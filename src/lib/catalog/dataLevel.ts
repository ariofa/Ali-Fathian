import type { CategoryAttributeRule, DataLevelAssessment, Product } from './types';

const levelLabel = { DATA_1: 'basic_information', DATA_2: 'technical_information', DATA_3: 'design_data' } as const;

function isMeaningful(value: unknown): boolean {
  return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== '';
}

/**
 * Front-end-only assessment. The API may later reproduce this exact rule, but
 * public publication and technical review remain human-controlled decisions.
 */
export function assessDataLevel(product: Product, rules: CategoryAttributeRule[]): DataLevelAssessment {
  const unmet: string[] = [];
  const hasBasicIdentity = Boolean(product.title.fa.trim() && product.manufacturer.id && product.categoryId && product.shortDescription.fa.trim());
  const hasReference = product.documents.some(document => document.type === 'catalog' || document.type === 'datasheet') || product.sources.length > 0;
  const hasVisual = product.documents.some(document => document.type === 'image');
  const hasData1 = hasBasicIdentity && hasReference && hasVisual && Boolean(product.productionStatus);
  if (!hasBasicIdentity) unmet.push('اطلاعات هویتی محصول کامل نیست.');
  if (!hasVisual) unmet.push('تصویر یا رسانهٔ معرفی محصول ثبت نشده است.');
  if (!hasReference) unmet.push('کاتالوگ، دیتاشیت یا منبع محصول ثبت نشده است.');

  const values = [...product.attributes, ...product.variants.flatMap(variant => variant.attributes)];
  const applicableRules = rules.filter(rule => rule.categoryId === product.categoryId);
  const getValue = (key: string) => values.find(value => value.attributeKey === key && value.applicability === 'applicable');
  let completedWeight = 0;
  let eligibleWeight = 0;
  let evidenceGap = false;
  const missingPrimary: string[] = [];
  for (const rule of applicableRules) {
    const value = getValue(rule.attributeKey);
    // A documented not-applicable value is excluded from the denominator.
    const isNotApplicable = values.some(candidate => candidate.attributeKey === rule.attributeKey && candidate.applicability === 'not_applicable');
    if (isNotApplicable) continue;
    eligibleWeight += rule.weight;
    const valid = Boolean(value && (isMeaningful(value.value) || value.min !== undefined || value.max !== undefined));
    const hasEvidence = !rule.evidenceRequired || Boolean(value?.sourceId && product.sources.some(source => source.id === value.sourceId));
    if (valid && hasEvidence) completedWeight += rule.weight;
    if (rule.priority === 'primary' && (!valid || !hasEvidence)) missingPrimary.push(rule.attributeKey);
    if (valid && !hasEvidence) evidenceGap = true;
  }
  const completionPercent = eligibleWeight === 0 ? 0 : Math.round((completedWeight / eligibleWeight) * 100);
  const hasBimStatus = Boolean(product.bimAvailability);
  const hasData2 = hasData1 && hasBimStatus && missingPrimary.length === 0 && completionPercent >= 70;
  if (hasData1 && missingPrimary.length) unmet.push('ویژگی‌های کلیدیِ مرتبط با دسته کامل یا مستند نیستند.');
  if (hasData1 && completionPercent < 70) unmet.push('پوشش وزنی دادهٔ مرتبط به ۷۰٪ نرسیده است.');

  const hasDesignDocuments = product.documents.some(document => document.type === 'datasheet' || document.type === 'technical_drawing' || document.type === 'installation_guide');
  const hasData3 = hasData2 && product.variants.length > 0 && hasDesignDocuments && completionPercent >= 85 && !evidenceGap;
  if (hasData2 && product.variants.length === 0) unmet.push('مدل یا واریانت محصول ثبت نشده است.');
  if (hasData2 && !hasDesignDocuments) unmet.push('مدرک طراحی یا دیتاشیت تکمیلی ثبت نشده است.');
  if (hasData2 && completionPercent < 85) unmet.push('پوشش وزنی دادهٔ طراحی به ۸۵٪ نرسیده است.');

  const level = hasData3 ? 'DATA_3' : hasData2 ? 'DATA_2' : 'DATA_1';
  return { level, label: levelLabel[level], completedWeight, eligibleWeight, completionPercent, unmetRequirements: unmet, hasEvidenceGap: evidenceGap };
}
