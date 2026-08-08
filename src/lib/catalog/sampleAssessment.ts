import { CATEGORY_ATTRIBUTE_RULES } from './categoryAttributeRules';
import { assessDataLevel } from './dataLevel';
import { SAMPLE_CATALOG_PRODUCTS } from './sampleCatalog';

/** A development fixture proving that a product, variant, document and BIM status can be assessed locally. */
export const SAMPLE_PRODUCT_ASSESSMENT = assessDataLevel(
  SAMPLE_CATALOG_PRODUCTS[0],
  CATEGORY_ATTRIBUTE_RULES,
);
