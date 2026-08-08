import { assessDataLevel, CATEGORY_ATTRIBUTE_RULES, DATA_LEVELS, SAMPLE_CATALOG_PRODUCTS } from '../src/lib/catalog';

const sample = SAMPLE_CATALOG_PRODUCTS[0];
const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
const assessment = assessDataLevel(sample, CATEGORY_ATTRIBUTE_RULES);
assert(sample.isSample && sample.publicationStatus === 'draft', 'The preview record must not be public.');
assert(assessment.level === 'DATA_2', 'The sample must expose its computed data level.');
assert(sample.bimAvailability === 'in_preparation' && sample.bimFiles.length === 0, 'BIM availability and downloadable BIM files must remain distinct.');
assert(sample.variants.length > 0, 'The detail model must support variants.');
assert(sample.documents.some(document => document.type === 'datasheet'), 'The detail model must support technical documents.');
console.log(`Product detail model checks passed: ${DATA_LEVELS[assessment.level].titleFa}; BIM is ${sample.bimAvailability}; no public sample was created.`);
