import type { BIMObject } from '../../types';
import { PRODUCT_CATEGORIES } from './taxonomy';
import { ATTRIBUTE_DEFINITION_BY_KEY, LEGACY_SPEC_TO_ATTRIBUTE_KEY } from './unifiedSearch';

/**
 * Bridge between the objects the site already publishes (src/data.ts legacy
 * BIMObject records) and the approved two-level library taxonomy.
 *
 * This module is a pure lookup/adapter layer. It never edits the taxonomy,
 * the attribute registry, the attribute rules, or any declared metadata —
 * it only maps already-published records onto the new structure so the
 * browse page, the header menu and the object download page can speak the
 * same language.
 */

/** Legacy subcategory ids → approved level-2 taxonomy ids. */
export const LEGACY_SUBCATEGORY_TO_LIBRARY_ID: Record<string, string> = {
  // در و پنجره
  windows: 'windows',
  fire_doors: 'fire-security-doors',
  interior_doors: 'interior-doors',
  exterior_doors: 'external-doors',
  sliding_doors: 'interior-doors',
  curtain_walls: 'curtain-wall-glazing',
  // روشنایی
  indoor_lighting: 'recessed-lighting',
  outdoor_lighting: 'outdoor-landscape-lighting',
  // مصالح و نما
  cladding: 'facade-cladding-systems',
  insulation: 'thermal-acoustic-insulation',
  waterproofing: 'waterproofing-membranes',
  // تجهیزات بهداشتی
  sanitaryware: 'sanitaryware',
  faucets: 'faucets-mixers',
  toilets: 'sanitaryware',
  showers: 'showers-baths',
  sinks: 'sinks-accessories',
  // تأسیسات مکانیکی
  cooling: 'chillers-heat-pumps',
  heating: 'boilers-heating',
  ventilation: 'ventilation-exhaust-fans',
  fan_coil: 'fan-coils-ahus-vrf',
  // مبلمان
  office_furniture: 'office-furniture',
  residential_furniture: 'seating-lounge',
  seating: 'seating-lounge',
  tables_desks: 'tables-counters',
  kitchen: 'kitchen-casework',
  // سازه
  steel: 'steel-structure',
  concrete: 'concrete-structure',
  stairs: 'stairs-ramps',
  // برق و هوشمندسازی
  switches: 'switches-sockets',
  smart_home: 'smart-building-bms',
};

/** Legacy category ids → approved level-1 family ids. */
export const LEGACY_CATEGORY_TO_FAMILY_ID: Record<string, string> = {
  doors_windows: 'doors-windows-openings',
  lighting: 'lighting',
  materials_facades: 'facade-envelope-materials',
  furniture: 'kitchen-furniture-interior-equipment',
  bathroom: 'sanitary-plumbing',
  hvac: 'heating-cooling-ventilation',
  structure: 'structure-building-elements',
  electrical: 'electrical-safety-smart-building',
  elevators: 'vertical-transportation-circulation',
};

/** Level-1 family id for any taxonomy category id (level 1 or 2). */
export function familyIdOfLibraryCategory(categoryId: string): string {
  const category = PRODUCT_CATEGORIES.find(item => item.id === categoryId);
  if (!category) return '';
  return category.level === 1 ? category.id : category.parentId || '';
}

/** The approved level-2 category id a legacy object belongs to. */
export function legacyObjectLibraryCategoryId(object: Pick<BIMObject, 'category' | 'subcategory'>): string {
  const direct = LEGACY_SUBCATEGORY_TO_LIBRARY_ID[object.subcategory];
  if (direct) return direct;
  const familyId = LEGACY_CATEGORY_TO_FAMILY_ID[object.category] || 'doors-windows-openings';
  const family = PRODUCT_CATEGORIES.find(item => item.id === familyId);
  return family?.childIds?.[0] || 'windows';
}

/** Human-readable taxonomy path (fa/en labels) for a legacy object. */
export function legacyObjectLibraryPathLabels(object: Pick<BIMObject, 'category' | 'subcategory'>): {
  familyId: string;
  familyFa: string;
  familyEn: string;
  subcategoryId: string;
  subcategoryFa: string;
  subcategoryEn: string;
} {
  const subcategoryId = legacyObjectLibraryCategoryId(object);
  const sub = PRODUCT_CATEGORIES.find(item => item.id === subcategoryId);
  const familyId = sub?.parentId || '';
  const family = PRODUCT_CATEGORIES.find(item => item.id === familyId);
  return {
    familyId,
    familyFa: family?.label.fa || '',
    familyEn: family?.label.en || '',
    subcategoryId,
    subcategoryFa: sub?.label.fa || '',
    subcategoryEn: sub?.label.en || '',
  };
}

/**
 * Readable labels for the legacy per-object spec keys. These labels already
 * existed in the legacy catalogue filters/UI — nothing new is invented here;
 * the dictionary only makes the same keys render nicely in the metadata view.
 */
export const LEGACY_SPEC_LABELS: Record<string, { fa: string; en: string }> = {
  frame_material: { fa: 'جنس فریم', en: 'Frame Material' },
  glazing_type: { fa: 'نوع شیشه', en: 'Glazing Type' },
  fire_rating: { fa: 'مقاومت در برابر حریق', en: 'Fire Rating' },
  u_value: { fa: 'ضریب انتقال حرارت (U-Value)', en: 'U-Value (Thermal Performance)' },
  thermal_break: { fa: 'ترمال‌بریک', en: 'Thermal Break' },
  opening_type: { fa: 'نوع بازشو', en: 'Opening Type' },
  material: { fa: 'جنس اصلی', en: 'Main Material' },
  finish: { fa: 'نوع پرداخت', en: 'Finish' },
  color: { fa: 'رنگ', en: 'Color' },
  dimensions: { fa: 'ابعاد', en: 'Dimensions' },
  width: { fa: 'عرض', en: 'Width' },
  height: { fa: 'ارتفاع', en: 'Height' },
  thickness: { fa: 'ضخامت', en: 'Thickness' },
  weight: { fa: 'وزن', en: 'Weight' },
  watt: { fa: 'توان (وات)', en: 'Wattage' },
  power: { fa: 'توان', en: 'Power' },
  lumens: { fa: 'شار نورانی (لومن)', en: 'Luminous Flux (lm)' },
  luminous_flux: { fa: 'شار نورانی (لومن)', en: 'Luminous Flux (lm)' },
  color_temperature: { fa: 'دمای رنگ', en: 'Color Temperature' },
  ip_rating: { fa: 'درجهٔ حفاظت (IP)', en: 'IP Rating' },
  mounting: { fa: 'نوع نصب', en: 'Mounting' },
  installation: { fa: 'روش نصب', en: 'Installation' },
  acoustic_rating: { fa: 'رتبهٔ آکوستیک', en: 'Acoustic Rating' },
  warranty: { fa: 'گارانتی', en: 'Warranty' },
  resistance_minutes: { fa: 'مدت مقاومت (دقیقه)', en: 'Resistance (minutes)' },
};

export function legacySpecLabel(key: string): { fa: string; en: string } {
  // 1) Canonical path first: the same registry labels that power the unified
  //    search index and the library specialist filters, so the object download
  //    page, search and browse share ONE wording for every metadata key.
  //    (unifiedSearch imports this module too, so these bindings are only read
  //    here at call time — after both modules finished evaluating.)
  const canonicalKey = LEGACY_SPEC_TO_ATTRIBUTE_KEY[key] || key;
  const definition = ATTRIBUTE_DEFINITION_BY_KEY.get(canonicalKey);
  if (definition?.label) return { fa: definition.label.fa, en: definition.label.en };
  // 2) Legacy dictionary for historic keys that have no governed definition.
  const known = LEGACY_SPEC_LABELS[key];
  if (known) return known;
  const fallbackEn = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  return { fa: fallbackEn, en: fallbackEn };
}

/** Specialist-filter hint keys shown under menu items / in the sidebar. */
export interface SpecialistFilterHint {
  key: string;
  labelFa: string;
  labelEn: string;
  priority: 'primary' | 'advanced';
}

/**
 * Top specialist (filterable) attribute labels declared for a level-2
 * category in the approved rules+registry — used for menu hints and the
 * "what you will be able to filter by" block. Read-only lookup.
 */
export function specialistFilterHintsForCategory(
  categoryId: string,
  rules: { categoryId: string; attributeKey: string; priority: 'primary' | 'advanced'; filterable: boolean }[],
  registry: { key: string; label: { fa: string; en: string } }[],
  limit = 3,
): SpecialistFilterHint[] {
  const labelByKey = new Map(registry.map(definition => [definition.key, definition.label]));
  return rules
    .filter(rule => rule.categoryId === categoryId && rule.filterable)
    .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'primary' ? -1 : 1))
    .flatMap(rule => {
      const label = labelByKey.get(rule.attributeKey);
      return label ? [{ key: rule.attributeKey, labelFa: label.fa, labelEn: label.en, priority: rule.priority }] : [];
    })
    .slice(0, limit);
}
