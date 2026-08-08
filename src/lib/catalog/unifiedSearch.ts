import { ATTRIBUTE_REGISTRY } from './attributeRegistry';
import { ATTRIBUTE_REGISTRY_EXTENSIONS } from './metadataExtensions';
import { PRODUCT_CATEGORIES } from './taxonomy';
import type { AttributeDefinition, Product } from './types';
import type { BIMObject, Manufacturer } from '../../types';
import { legacyObjectLibraryCategoryId } from './legacyProductBridge';

export const ALL_ATTRIBUTE_DEFINITIONS: AttributeDefinition[] = [...ATTRIBUTE_REGISTRY, ...ATTRIBUTE_REGISTRY_EXTENSIONS];
export const ATTRIBUTE_DEFINITION_BY_KEY = new Map(ALL_ATTRIBUTE_DEFINITIONS.map(definition => [definition.key, definition]));

/** Maps historic `BIMObject.specs` keys onto the governed metadata registry. */
export const LEGACY_SPEC_TO_ATTRIBUTE_KEY: Record<string, string> = {
  frame_material: 'frame_material', glazing_type: 'glazing_type', fire_rating: 'fire_resistance', u_value: 'thermal_transmittance', thermal_break: 'thermal_insulation',
  material: 'material', material_type: 'material', finish: 'finish', color: 'colour', dimensions: 'dimensions', width: 'width', height: 'height', thickness: 'thickness', weight: 'weight',
  watt: 'power', wattage: 'power', power: 'power', lumens: 'luminous_flux', luminous_flux: 'luminous_flux', color_temp: 'colour_temperature', color_temperature: 'colour_temperature', ip_rating: 'ip_rating',
  mounting: 'installation_type', installation: 'installation_method', acoustic_rating: 'acoustic_performance',
  thermal_conductivity: 'thermal_conductivity', wind_load: 'wind_resistance', water_flow: 'water_consumption',
  slip_resistance: 'slip_resistance', tile_finish: 'tile_finish', kitchen_material: 'countertop_material', hvac_capacity: 'capacity', pipe_material: 'material', steel_grade: 'steel_grade', power_source: 'power_supply',
};

export interface UnifiedAttributeValue { key: string; values: string[]; source: 'legacy_spec' | 'product_metadata'; }
export interface UnifiedCatalogSearchEntry {
  id: string;
  kind: 'legacy_object' | 'catalog_product';
  categoryId: string;
  manufacturerId: string;
  attributes: UnifiedAttributeValue[];
  searchText: string;
  formats: string[];
  revitVersions: string[];
  lod?: string;
  certifications: string[];
  isImported?: boolean;
  hasCutsheet?: boolean;
  hasSample?: boolean;
}

export const normalizeSearchText = (value: string) => value
  .toLowerCase()
  .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک')
  .replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
  .replace(/[\u200c\-_/,.;:()]+/g, ' ').replace(/\s+/g, ' ').trim();

const categorySearchLabels = (categoryId: string) => {
  const category = PRODUCT_CATEGORIES.find(item => item.id === categoryId);
  const parent = category?.parentId ? PRODUCT_CATEGORIES.find(item => item.id === category?.parentId) : undefined;
  return [category?.label.fa, category?.label.en, parent?.label.fa, parent?.label.en].filter(Boolean).join(' ');
};

const isUnknownLegacyValue = (value: string) => ['در حال تکمیل', 'اعلام نشده', 'نامشخص', '—', 'n a', 'unknown'].includes(normalizeSearchText(value));

export function legacyObjectToUnifiedSearchEntry(object: BIMObject, manufacturer?: Manufacturer): UnifiedCatalogSearchEntry {
  const grouped = new Map<string, string[]>();
  Object.entries(object.specs || {}).forEach(([legacyKey, raw]) => {
    const key = LEGACY_SPEC_TO_ATTRIBUTE_KEY[legacyKey] || legacyKey;
    const values = (Array.isArray(raw) ? raw : [raw])
      .filter(value => value !== undefined && value !== null && value !== '')
      .map(String)
      .filter(value => !isUnknownLegacyValue(value));
    if (!values.length) return;
    grouped.set(key, [...(grouped.get(key) || []), ...values]);
  });
  const categoryId = legacyObjectLibraryCategoryId(object);
  const attributes = [...grouped.entries()].map(([key, values]) => ({ key, values: [...new Set(values)], source: 'legacy_spec' as const }));
  const labels = attributes.flatMap(attribute => [ATTRIBUTE_DEFINITION_BY_KEY.get(attribute.key)?.label.fa || attribute.key, ATTRIBUTE_DEFINITION_BY_KEY.get(attribute.key)?.label.en || attribute.key, ...attribute.values]);
  return {
    id: object.id, kind: 'legacy_object', categoryId, manufacturerId: object.manufacturerId, attributes,
    searchText: normalizeSearchText([object.titleFa, object.titleEn, object.descriptionFa, object.descriptionEn, manufacturer?.nameFa, manufacturer?.nameEn, ...(object.tagsFa || []), ...(object.tagsEn || []), categorySearchLabels(categoryId), ...labels].filter(Boolean).join(' ')),
    formats: object.formats || [], revitVersions: object.revitVersions || [], lod: object.lod, certifications: object.certification || [], isImported: object.isImported, hasCutsheet: object.hasCutsheet, hasSample: object.hasSample,
  };
}

export function productToUnifiedSearchEntry(product: Product): UnifiedCatalogSearchEntry {
  const categoryId = product.categoryId;
  const grouped = new Map<string, string[]>();
  [...product.attributes, ...product.variants.flatMap(variant => variant.attributes)].forEach(attribute => {
    if (attribute.applicability !== 'applicable') return;
    const values = Array.isArray(attribute.value) ? attribute.value.map(String) : attribute.value !== undefined ? [String(attribute.value)] : [attribute.min, attribute.max].filter(value => value !== undefined).map(String);
    if (values.length) grouped.set(attribute.attributeKey, [...(grouped.get(attribute.attributeKey) || []), ...values]);
  });
  const attributes = [...grouped.entries()].map(([key, values]) => ({ key, values: [...new Set(values)], source: 'product_metadata' as const }));
  const labels = attributes.flatMap(attribute => [ATTRIBUTE_DEFINITION_BY_KEY.get(attribute.key)?.label.fa || attribute.key, ATTRIBUTE_DEFINITION_BY_KEY.get(attribute.key)?.label.en || attribute.key, ...attribute.values]);
  return {
    id: product.id, kind: 'catalog_product', categoryId, manufacturerId: product.manufacturer.id, attributes,
    searchText: normalizeSearchText([product.title.fa, product.title.en, product.shortDescription.fa, product.shortDescription.en, product.manufacturer.name.fa, product.manufacturer.name.en, product.keywords.fa, product.keywords.en, categorySearchLabels(categoryId), ...labels].filter(Boolean).join(' ')),
    formats: product.bimFiles.map(file => file.format), revitVersions: product.bimFiles.flatMap(file => file.softwareVersion ? [file.softwareVersion] : []), certifications: [],
    hasCutsheet: product.documents.some(document => document.type === 'datasheet'), hasSample: false,
  };
}

export function entryAttributeValues(entry: UnifiedCatalogSearchEntry, attributeKey: string): string[] {
  return entry.attributes.find(attribute => attribute.key === attributeKey)?.values || [];
}
