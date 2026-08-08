import { ATTRIBUTE_REGISTRY } from './attributeRegistry';
import { CATEGORY_ATTRIBUTE_RULES } from './categoryAttributeRules';
import { assessDataLevel } from './dataLevel';
import type { AttributeValue, Product } from './types';

export type CompletionTaskGroup = 'required' | 'supplementary' | 'category';
export interface CompletionTask {
  id: string;
  group: CompletionTaskGroup;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  complete: boolean;
}
const isComplete = (value?: AttributeValue) => Boolean(value && value.applicability === 'applicable' && (value.value !== undefined || value.min !== undefined || value.max !== undefined));

/** Returns only actions relevant to the product's next information-data level. */
export function getCompletionTasks(product: Product): CompletionTask[] {
  const assessment = assessDataLevel(product, CATEGORY_ATTRIBUTE_RULES);
  const rules = CATEGORY_ATTRIBUTE_RULES.filter(rule => rule.categoryId === product.categoryId);
  const definitions = new Map(ATTRIBUTE_REGISTRY.map(definition => [definition.key, definition]));
  const values = [...product.attributes, ...product.variants.flatMap(variant => variant.attributes)];
  const valueByKey = new Map(values.map(value => [value.attributeKey, value]));
  const needsData2 = assessment.level === 'DATA_1';
  const relevantRules = needsData2 ? rules.filter(rule => rule.priority === 'primary') : assessment.level === 'DATA_2' ? rules.filter(rule => rule.priority === 'advanced') : [];
  const tasks: CompletionTask[] = relevantRules.map(rule => {
    const definition = definitions.get(rule.attributeKey);
    const value = valueByKey.get(rule.attributeKey);
    const hasEvidence = !rule.evidenceRequired || Boolean(value?.sourceId && product.sources.some(source => source.id === value.sourceId));
    return { id: rule.attributeKey, group: (needsData2 ? 'required' : 'category') as CompletionTaskGroup, titleFa: definition?.label.fa || rule.attributeKey, titleEn: definition?.label.en || rule.attributeKey, descriptionFa: rule.evidenceRequired ? 'مقدار و منبع رسمی آن را ثبت کنید.' : 'مقدار مرتبط با این محصول را ثبت کنید.', complete: isComplete(value) && hasEvidence };
  });
  if (needsData2) {
    tasks.push({ id: 'bim-status', group: 'required', titleFa: 'تعیین وضعیت فایل BIM', titleEn: 'Declare BIM status', descriptionFa: 'مشخص کنید فایل BIM موجود است، در حال آماده‌سازی است یا هنوز ارائه نشده.', complete: Boolean(product.bimAvailability) });
    tasks.push({ id: 'datasheet', group: 'required', titleFa: 'افزودن دیتاشیت یا منبع رسمی', titleEn: 'Add a datasheet or official source', descriptionFa: 'حداقل یک منبع قابل‌بررسی برای مشخصات محصول ثبت کنید.', complete: product.documents.some(document => document.type === 'datasheet') || product.sources.length > 0 });
  }
  if (assessment.level === 'DATA_2') {
    tasks.push({ id: 'variants', group: 'supplementary', titleFa: 'ثبت مدل‌ها و واریانت‌های مؤثر', titleEn: 'Record relevant models and variants', descriptionFa: 'ابعاد، رنگ، توان یا ظرفیت‌های قابل سفارش را در سطح مدل ثبت کنید.', complete: product.variants.length > 0 });
    tasks.push({ id: 'design-documents', group: 'supplementary', titleFa: 'افزودن مدرک طراحی', titleEn: 'Add a design document', descriptionFa: 'دیتاشیت، نقشه، راهنمای نصب یا مدرک مرتبط را ثبت کنید.', complete: product.documents.some(document => ['datasheet', 'technical_drawing', 'installation_guide'].includes(document.type)) });
    tasks.push({ id: 'updated-at', group: 'supplementary', titleFa: 'ثبت تاریخ به‌روزرسانی اطلاعات', titleEn: 'Record data update date', descriptionFa: 'آخرین زمان بررسی یا تأیید اطلاعات محصول را نگه‌داری کنید.', complete: Boolean(product.updatedAt) });
  }
  return tasks;
}
