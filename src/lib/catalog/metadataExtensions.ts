/**
 * Small, governed extensions needed to preserve useful former-main filters
 * that were not present in the initial 271-field registry. They use the
 * exact same AttributeDefinition contract and are front-end ready for API
 * registration; no UI-only keys are introduced.
 */
import type { AttributeDefinition } from './types';

export const ATTRIBUTE_REGISTRY_EXTENSIONS: AttributeDefinition[] = [
  { key: 'thermal_conductivity', label: { fa: 'رسانایی حرارتی', en: 'Thermal Conductivity' }, dataType: 'number_or_range', unit: 'W/mK', inputHint: 'عدد یا بازه + واحد', searchable: true, comparable: true, definitionStatus: 'draft_for_domain_review' },
  { key: 'tile_finish', label: { fa: 'نوع لعاب یا پوشش', en: 'Tile Finish' }, dataType: 'enum', inputHint: 'انتخاب از فهرست کنترل‌شده', searchable: true, comparable: true, definitionStatus: 'draft_for_domain_review' },
  { key: 'countertop_material', label: { fa: 'جنس صفحه یا رویه', en: 'Countertop Material' }, dataType: 'enum', inputHint: 'انتخاب از فهرست کنترل‌شده', searchable: true, comparable: true, definitionStatus: 'draft_for_domain_review' },
  { key: 'steel_grade', label: { fa: 'گرید فولاد', en: 'Steel Grade' }, dataType: 'enum', inputHint: 'انتخاب از فهرست کنترل‌شده', searchable: true, comparable: true, definitionStatus: 'draft_for_domain_review' },
];
