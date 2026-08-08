import { BIM_OBJECTS, MANUFACTURERS } from '../src/data';
import {
  ATTRIBUTE_DEFINITION_BY_KEY,
  entryAttributeValues,
  legacyMainFilterPresetsForCategory,
  legacyObjectToUnifiedSearchEntry,
  normalizeSearchText,
  productToUnifiedSearchEntry,
  SAMPLE_CATALOG_PRODUCTS,
} from '../src/lib/catalog';

const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
const windowObject = BIM_OBJECTS.find(object => object.id === 'initial-window');
assert(Boolean(windowObject), 'Initial window record is missing.');
const entry = legacyObjectToUnifiedSearchEntry(windowObject!, MANUFACTURERS.find(brand => brand.id === windowObject!.manufacturerId));
assert(entry.categoryId === 'windows', 'Legacy object must resolve to approved level-2 taxonomy.');
assert(entryAttributeValues(entry, 'frame_material').includes('aluminum'), 'Legacy frame_material must map to canonical metadata.');
assert(entryAttributeValues(entry, 'glazing_type').includes('double'), 'Legacy glazing_type must map to canonical metadata.');
assert(!entry.attributes.some(attribute => attribute.values.includes('در حال تکمیل')), 'Unknown placeholders must not become searchable metadata values.');
assert(entry.searchText.includes(normalizeSearchText('پنجره')), 'Persian object name must be searchable.');
assert(entry.searchText.includes(normalizeSearchText('window')), 'English object name must be searchable.');
const windowPresets = legacyMainFilterPresetsForCategory('windows');
assert(windowPresets.some(preset => preset.key === 'thermal_transmittance'), 'Main U-Value filter must map to canonical thermal_transmittance.');
assert(ATTRIBUTE_DEFINITION_BY_KEY.has('thermal_conductivity'), 'Main thermal-conductivity filter must be governed by the metadata extension registry.');
const sampleEntry = productToUnifiedSearchEntry(SAMPLE_CATALOG_PRODUCTS[0]);
assert(sampleEntry.attributes.some(attribute => attribute.key === 'frame_material'), 'Catalog Product metadata must enter the same unified search index.');
console.log('Unified catalog metadata checks passed: legacy specs, product metadata, main-branch filters, and bilingual search share one contract.');
