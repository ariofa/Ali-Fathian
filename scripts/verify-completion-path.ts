import { getCompletionTasks, SAMPLE_CATALOG_PRODUCTS } from '../src/lib/catalog';

const product = SAMPLE_CATALOG_PRODUCTS[0];
const tasks = getCompletionTasks(product);
const remaining = tasks.filter(task => !task.complete);
const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
assert(product.isSample && product.publicationStatus === 'draft', 'Completion preview must remain non-public.');
assert(remaining.length === 5, `Expected five category-specific tasks; got ${remaining.length}.`);
assert(remaining.every(task => task.group === 'category'), 'DATA_2 sample should show its missing work as category-specific design-data tasks.');
assert(tasks.some(task => task.id === 'variants' && task.complete), 'Completed supplementary variant work must be shown as complete.');
assert(tasks.some(task => task.id === 'design-documents' && task.complete), 'Completed supporting documents must be shown as complete.');
console.log(`Completion path checks passed: ${remaining.length} remaining tasks; no sales, quality, or BIM-review guarantee is implied.`);
