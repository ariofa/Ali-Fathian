import type { AttributeDefinition, AttributeValue, CategoryAttributeRule, DataLevel, Product } from './types';
import { assessDataLevel } from './dataLevel';

export type CommonContentFilter = 'bim_file' | 'catalog' | 'datasheet' | 'technical_drawing' | 'image';
export type UpdatedWithin = '30d' | '90d' | 'older';
export type AttributeFilterValue = string | number | boolean | string[] | { min?: number; max?: number };
export interface CatalogFilterState {
  query: string;
  brands: string[];
  formats: string[];
  content: CommonContentFilter[];
  bimAvailability: string[];
  dataLevels: DataLevel[];
  updatedWithin: UpdatedWithin | null;
  attributes: Record<string, AttributeFilterValue>;
}
export const EMPTY_CATALOG_FILTERS: CatalogFilterState = {
  query: '', brands: [], formats: [], content: [], bimAvailability: [], dataLevels: [], updatedWithin: null, attributes: {},
};

export interface FacetOption { value: string; label: string; }
export interface AttributeFacet {
  key: string;
  labelFa: string;
  labelEn: string;
  kind: 'select' | 'range';
  options?: FacetOption[];
  min?: number;
  max?: number;
  unit?: string;
  priority: 'primary' | 'advanced';
}

const faToEnDigits: Record<string, string> = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9' };
const aliases: Record<string, string[]> = {
  'پنجره': ['window'], window: ['پنجره'], 'چراغ': ['light', 'lighting'], lighting: ['روشنایی', 'چراغ'],
  'در': ['door'], door: ['درب'], 'تهویه': ['ventilation', 'hvac'], hvac: ['تهویه', 'سرمایش', 'گرمایش'],
  'شیرآلات': ['faucet', 'mixer'], faucet: ['شیرآلات'], 'کرتین وال': ['curtain wall'], 'curtain wall': ['کرتین وال'],
};
const normalise = (value: string) => value
  .toLowerCase()
  .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک')
  .replace(/[۰-۹]/g, digit => faToEnDigits[digit] || digit)
  .replace(/[\u200c\-_/,.;:()]+/g, ' ').replace(/\s+/g, ' ').trim();
const valuesForProduct = (product: Product) => [...product.attributes, ...product.variants.flatMap(variant => variant.attributes)];
const hasValue = (value?: AttributeValue) => Boolean(value && value.applicability === 'applicable' && (value.value !== undefined || value.min !== undefined || value.max !== undefined));
const valueStrings = (value: AttributeValue) => [value.value, value.min, value.max].flatMap(item => Array.isArray(item) ? item : item === undefined ? [] : [String(item)]);

export function productSearchText(product: Product, categoryLabels: { fa: string; en: string }[] = []): string {
  const attributeText = valuesForProduct(product).flatMap(value => hasValue(value) ? valueStrings(value) : []);
  return normalise([
    product.title.fa, product.title.en, product.shortDescription.fa, product.shortDescription.en,
    product.manufacturer.name.fa, product.manufacturer.name.en, product.keywords.fa, product.keywords.en,
    ...categoryLabels.flatMap(label => [label.fa, label.en]), ...attributeText,
  ].join(' '));
}
function matchesQuery(product: Product, query: string, categoryLabels: { fa: string; en: string }[]): boolean {
  const normalisedQuery = normalise(query);
  if (!normalisedQuery) return true;
  const haystack = productSearchText(product, categoryLabels);
  const expanded = [normalisedQuery, ...(aliases[normalisedQuery] || [])].map(normalise);
  return expanded.some(term => haystack.includes(term));
}
function includesAny<T>(selected: T[], candidate: T): boolean { return selected.length === 0 || selected.includes(candidate); }
function isInUpdatedWindow(updatedAt: string, window: UpdatedWithin): boolean {
  const date = new Date(updatedAt).getTime();
  if (Number.isNaN(date)) return false;
  const age = Math.floor((Date.now() - date) / 86_400_000);
  if (window === '30d') return age <= 30;
  if (window === '90d') return age > 30 && age <= 90;
  return age > 90;
}
export function filterCatalogProducts(
  products: Product[], categoryId: string, filters: CatalogFilterState,
  rules: CategoryAttributeRule[], categoryLabels: { fa: string; en: string }[] = [],
): Product[] {
  return products.filter(product => {
    // A sample must never leak to a public result, even if somebody assigns a
    // publish status incorrectly in local data or a future adapter.
    if (product.isSample || product.categoryId !== categoryId || product.publicationStatus !== 'published') return false;
    if (!matchesQuery(product, filters.query, categoryLabels)) return false;
    if (!includesAny(filters.brands, product.manufacturer.id)) return false;
    if (filters.formats.length && !product.bimFiles.some(file => filters.formats.includes(file.format))) return false;
    if (filters.content.length && !filters.content.every(content => content === 'bim_file' ? product.bimFiles.length > 0 : product.documents.some(doc => doc.type === content))) return false;
    if (!includesAny(filters.bimAvailability, product.bimAvailability)) return false;
    const assessment = assessDataLevel(product, rules);
    if (!includesAny(filters.dataLevels, assessment.level)) return false;
    if (filters.updatedWithin && !isInUpdatedWindow(product.updatedAt, filters.updatedWithin)) return false;
    const values = valuesForProduct(product);
    for (const [key, selected] of Object.entries(filters.attributes)) {
      if (selected === '' || selected === undefined) continue;
      const matchingValue = values.find(value => value.attributeKey === key && hasValue(value));
      if (!matchingValue) return false;
      if (typeof selected === 'object' && !Array.isArray(selected)) {
        const numericValue = typeof matchingValue.value === 'number' ? matchingValue.value : matchingValue.min ?? matchingValue.max;
        if (numericValue === undefined) return false;
        if (selected.min !== undefined && numericValue < selected.min) return false;
        if (selected.max !== undefined && numericValue > selected.max) return false;
        continue;
      }
      const candidates = valueStrings(matchingValue).map(normalise);
      const requested = (Array.isArray(selected) ? selected : [selected]).map(value => normalise(String(value)));
      if (!requested.some(value => candidates.includes(value))) return false;
    }
    return true;
  });
}

export function buildAttributeFacets(
  products: Product[], categoryId: string, rules: CategoryAttributeRule[], definitions: AttributeDefinition[],
): AttributeFacet[] {
  const definitionByKey = new Map(definitions.map(definition => [definition.key, definition]));
  return rules.filter(rule => rule.categoryId === categoryId).flatMap<AttributeFacet>((rule): AttributeFacet[] => {
    const definition = definitionByKey.get(rule.attributeKey);
    if (!definition) return [];
    const values = products.flatMap(product => valuesForProduct(product).filter(value => value.attributeKey === rule.attributeKey && hasValue(value)));
    if (!values.length) return []; // Never display a filter with invented options.
    const numeric = values.flatMap(value => [value.min, value.max, typeof value.value === 'number' ? value.value : undefined]).filter((value): value is number => value !== undefined);
    if (definition.dataType === 'number_or_range' && numeric.length) {
      return [{ key: rule.attributeKey, labelFa: definition.label.fa, labelEn: definition.label.en, kind: 'range', min: Math.min(...numeric), max: Math.max(...numeric), unit: definition.unit, priority: rule.priority }];
    }
    const options = [...new Set(values.flatMap(value => valueStrings(value)))].filter(Boolean).sort().map(value => ({ value, label: value }));
    return options.length ? [{ key: rule.attributeKey, labelFa: definition.label.fa, labelEn: definition.label.en, kind: 'select', options, unit: definition.unit, priority: rule.priority }] : [];
  });
}
