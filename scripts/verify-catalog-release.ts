import { ATTRIBUTE_REGISTRY, CATEGORY_ATTRIBUTE_RULES, PUBLISHED_CATALOG_PRODUCTS, PRODUCT_CATEGORIES, SAMPLE_CATALOG_PRODUCTS } from '../src/lib/catalog';

const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
const levelOne = PRODUCT_CATEGORIES.filter(category => category.level === 1);
const levelTwo = PRODUCT_CATEGORIES.filter(category => category.level === 2);
const categoryIds = new Set(PRODUCT_CATEGORIES.map(category => category.id));
const keys = ATTRIBUTE_REGISTRY.map(attribute => attribute.key);

assert(levelOne.length === 10, `Expected 10 level-one categories; got ${levelOne.length}.`);
assert(levelTwo.length === 100, `Expected 100 level-two categories; got ${levelTwo.length}.`);
assert(new Set(keys).size === keys.length, 'Attribute registry contains duplicate keys.');
assert(levelTwo.every(category => category.parentId && categoryIds.has(category.parentId)), 'Every level-two category needs a valid parent.');
assert(levelOne.every(category => category.childIds.length > 0 && category.childIds.every(child => categoryIds.has(child))), 'Every level-one category needs valid children.');
assert(CATEGORY_ATTRIBUTE_RULES.every(rule => levelTwo.some(category => category.id === rule.categoryId)), 'Every attribute rule must target a level-two category.');
assert(CATEGORY_ATTRIBUTE_RULES.every(rule => keys.includes(rule.attributeKey)), 'Every rule must reference a registered attribute key.');
assert(PUBLISHED_CATALOG_PRODUCTS.length === 0, 'No public catalog product should be seeded before real authorization.');
assert(PUBLISHED_CATALOG_PRODUCTS.every(product => !product.isSample), 'Sample records must never be public.');
assert(SAMPLE_CATALOG_PRODUCTS.every(product => product.isSample && product.publicationStatus !== 'published'), 'Samples must remain explicitly non-public.');
console.log(`Release catalog checks passed: ${levelOne.length} main categories, ${levelTwo.length} specialist categories, ${keys.length} unique attributes, ${CATEGORY_ATTRIBUTE_RULES.length} rules, and no seeded public products.`);
