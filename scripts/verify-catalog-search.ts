import { ATTRIBUTE_REGISTRY, buildAttributeFacets, CATEGORY_ATTRIBUTE_RULES, EMPTY_CATALOG_FILTERS, filterCatalogProducts, SAMPLE_CATALOG_PRODUCTS } from '../src/lib/catalog';

// This clone is a controlled test fixture only; the original sample remains non-public.
const product = { ...SAMPLE_CATALOG_PRODUCTS[0], isSample: false, publicationStatus: 'published' as const };
const labels = [{ fa: 'در، پنجره و بازشوها', en: 'Doors, Windows & Openings' }, { fa: 'پنجره‌ها', en: 'Windows' }];
const expect = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
const search = (overrides: Partial<typeof EMPTY_CATALOG_FILTERS>) => filterCatalogProducts([product], 'windows', { ...EMPTY_CATALOG_FILTERS, ...overrides }, CATEGORY_ATTRIBUTE_RULES, labels);

expect(search({ query: 'پنجره' }).length === 1, 'Persian category search must find the sample.');
expect(search({ query: 'window' }).length === 1, 'English category search must find the sample.');
expect(search({ attributes: { frame_material: 'aluminium' } }).length === 1, 'A matching technical filter must find the sample.');
expect(search({ attributes: { frame_material: 'steel' } }).length === 0, 'An unrelated technical filter must not return the sample.');
expect(search({ attributes: { dimensions: { min: 1700, max: 1900 } } }).length === 1, 'A matching numeric range must find the sample variant.');
expect(search({ attributes: { dimensions: { min: 2000 } } }).length === 0, 'An unrelated numeric range must not return the sample.');
const leakedSample = { ...SAMPLE_CATALOG_PRODUCTS[0], publicationStatus: 'published' as const };
expect(filterCatalogProducts([leakedSample], 'windows', EMPTY_CATALOG_FILTERS, CATEGORY_ATTRIBUTE_RULES, labels).length === 0, 'A sample must never leak to public search, even if its status is changed.');
const facets = buildAttributeFacets([product], 'windows', CATEGORY_ATTRIBUTE_RULES, ATTRIBUTE_REGISTRY);
expect(facets.some(facet => facet.key === 'frame_material'), 'A populated primary category attribute must become a facet.');
console.log(`Catalog search checks passed: ${facets.length} populated facets; no mock product was published.`);
