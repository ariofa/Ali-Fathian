import React, { useMemo, useState } from 'react';
import { ChevronDown, ExternalLink, Layers3 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import {
  assessDataLevel,
  ATTRIBUTE_REGISTRY,
  CATEGORY_ATTRIBUTE_RULES,
  DATA_LEVELS,
  PRODUCT_CATEGORIES,
} from '../../lib/catalog';
import type { AttributeValue, CategoryAttributeRule, Product } from '../../lib/catalog';
import type { BIMObject } from '../../types';
import { legacyObjectLibraryPathLabels, legacySpecLabel } from '../../lib/catalog/legacyProductBridge';

/**
 * Controlled, grouped, coloured metadata display — the single front-end
 * component that renders product metadata the same way in every surface
 * (object download page, catalog product page, and card chips on the
 * browse page), so all three views stay linked to the same data contract.
 */

export type MetadataRowState = 'ok' | 'unknown' | 'muted';

export interface MetadataRow {
  label: { fa: string; en: string };
  value: string;
  state?: MetadataRowState;
  hint?: string;
  href?: string;
}

export type MetadataAccent = 'teal' | 'navy' | 'violet' | 'amber' | 'slate';

export interface MetadataGroup {
  id: string;
  title: { fa: string; en: string };
  accent: MetadataAccent;
  rows: MetadataRow[];
  note?: { fa: string; en: string };
  defaultOpen?: boolean;
}

const ACCENT_STYLES: Record<MetadataAccent, { solid: string; chip: string; ring: string }> = {
  teal: { solid: '#087F7A', chip: 'bg-[#087F7A]/10 text-[#087F7A]', ring: 'border-[#087F7A]/25' },
  navy: { solid: '#0F3D5E', chip: 'bg-[#0F3D5E]/10 text-[#0F3D5E]', ring: 'border-[#0F3D5E]/20' },
  violet: { solid: '#6D28D9', chip: 'bg-[#6D28D9]/10 text-[#6D28D9]', ring: 'border-[#6D28D9]/25' },
  amber: { solid: '#B45309', chip: 'bg-[#B45309]/10 text-[#B45309]', ring: 'border-[#B45309]/25' },
  slate: { solid: '#64748B', chip: 'bg-[#64748B]/10 text-[#64748B]', ring: 'border-[#64748B]/25' },
};

/** Shared, honest value formatting — the same wording everywhere. */
export function formatMetadataValue(value?: AttributeValue, isRtl = true): { text: string; state: MetadataRowState } {
  const unknownText = isRtl ? 'اعلام نشده' : 'Not declared';
  if (!value || value.applicability === 'unknown') return { text: unknownText, state: 'unknown' };
  if (value.applicability === 'not_applicable') return { text: isRtl ? 'نامرتبط با این محصول' : 'Not applicable', state: 'muted' };
  const raw = Array.isArray(value.value) ? value.value.join(isRtl ? '، ' : ', ') : value.value;
  if (raw !== undefined && raw !== '') return { text: `${raw}${value.unit ? ` ${value.unit}` : ''}`, state: 'ok' };
  if (value.min !== undefined || value.max !== undefined) {
    return { text: `${value.min ?? '—'} ${isRtl ? 'تا' : 'to'} ${value.max ?? '—'}${value.unit ? ` ${value.unit}` : ''}`, state: 'ok' };
  }
  return { text: unknownText, state: 'unknown' };
}

export const StructuredMetadataAccordion: React.FC<{ groups: MetadataGroup[]; titleId?: string }> = ({ groups, titleId }) => {
  const { isRtl } = useLanguage();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group, index) => [group.id, group.defaultOpen ?? index < 2])),
  );
  return (
    <div className="space-y-3" id={titleId}>
      {groups.map(group => {
        const accent = ACCENT_STYLES[group.accent];
        const open = !!openIds[group.id];
        const unknownCount = group.rows.filter(row => row.state === 'unknown').length;
        return (
          <section key={group.id} className={`overflow-hidden rounded-2xl border ${accent.ring} bg-white dark:bg-slate-900`}>
            <button
              type="button"
              onClick={() => setOpenIds(previous => ({ ...previous, [group.id]: !open }))}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${accent.chip}`}>
                  <Layers3 className="h-3.5 w-3.5" />
                </span>
                <span className="truncate text-[13px] font-black text-slate-800 dark:text-white">
                  {isRtl ? group.title.fa : group.title.en}
                </span>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {group.rows.length} {isRtl ? 'مورد' : 'items'}
                </span>
                {unknownCount > 0 && (
                  <span className="hidden shrink-0 rounded-full bg-[#B45309]/10 px-2 py-0.5 text-[10px] font-bold text-[#B45309] sm:inline">
                    {unknownCount} {isRtl ? 'اعلام نشده' : 'undeclared'}
                  </span>
                )}
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <div className="border-t border-slate-100 px-4 py-4 dark:border-slate-800 animate-fadeIn">
                <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 md:grid-cols-2">
                  {group.rows.map((row, index) => {
                    const valueClass = row.state === 'unknown'
                      ? 'text-slate-400 dark:text-slate-500 font-semibold'
                      : row.state === 'muted'
                        ? 'text-slate-400 dark:text-slate-500 font-semibold'
                        : 'text-slate-800 dark:text-white font-bold';
                    return (
                      <div key={`${group.id}-${index}`} className="flex items-center justify-between gap-3 border-b border-slate-50 pb-2 text-xs dark:border-slate-800/60">
                        <span className="min-w-0 truncate font-semibold text-slate-500 dark:text-slate-400">
                          {isRtl ? row.label.fa : row.label.en}
                          {row.hint && <span className="ms-1 text-[10px] text-slate-400">({row.hint})</span>}
                        </span>
                        {row.href ? (
                          <a href={row.href} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 font-bold text-[#087F7A] hover:underline">
                            <ExternalLink className="h-3 w-3" />
                            <span className={valueClass.replace('text-slate-800 dark:text-white', 'text-[#087F7A]')}>{row.value}</span>
                          </a>
                        ) : (
                          <span className={`shrink-0 text-end ${valueClass}`}>{row.value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {group.note && (
                  <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[10.5px] leading-5 text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                    {isRtl ? group.note.fa : group.note.en}
                  </p>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

/** Small metadata chips for cards on the browse page — linked to the same contract. */
export const MetadataChips: React.FC<{ items: { text: string; tone?: MetadataAccent }[] }> = ({ items }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    {items.map((item, index) => {
      const accent = item.tone ? ACCENT_STYLES[item.tone] : ACCENT_STYLES.slate;
      return <span key={index} className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${accent.chip}`}>{item.text}</span>;
    })}
  </div>
);

/* ------------------------------------------------------------------ */
/* Builders — one source of truth for every surface                    */
/* ------------------------------------------------------------------ */

function catalogValueRows(
  rules: CategoryAttributeRule[],
  definitionByKey: Map<string, { label: { fa: string; en: string } }>,
  valueByKey: Map<string, AttributeValue>,
  product: Product,
  isRtl: boolean,
): MetadataRow[] {
  return rules.map(rule => {
    const definition = definitionByKey.get(rule.attributeKey);
    const formatted = formatMetadataValue(valueByKey.get(rule.attributeKey), isRtl);
    const sourceId = valueByKey.get(rule.attributeKey)?.sourceId;
    const sourceTitle = sourceId ? product.sources.find(item => item.id === sourceId)?.title : undefined;
    return {
      label: definition ? definition.label : { fa: rule.attributeKey, en: rule.attributeKey },
      value: formatted.text,
      state: formatted.state,
      hint: sourceTitle,
    };
  });
}

/** Grouped metadata for a catalog-contract Product (rules + registry driven). */
export function buildCatalogProductMetadataGroups(product: Product, isRtl: boolean): MetadataGroup[] {
  const definitionByKey = new Map(ATTRIBUTE_REGISTRY.map(definition => [definition.key, { label: definition.label }]));
  const rules = CATEGORY_ATTRIBUTE_RULES.filter(rule => rule.categoryId === product.categoryId);
  const values = [...product.attributes, ...product.variants.flatMap(variant => variant.attributes)];
  const valueByKey = new Map(values.map(value => [value.attributeKey, value]));
  const primaryRules = rules.filter(rule => rule.priority === 'primary');
  const advancedRules = rules.filter(rule => rule.priority === 'advanced');

  const variantRows: MetadataRow[] = product.variants.length
    ? product.variants.map(variant => {
        const applicable = variant.attributes.filter(attribute => attribute.applicability === 'applicable');
        const text = applicable.length
          ? applicable
              .map(attribute => `${isRtl ? definitionByKey.get(attribute.attributeKey)?.label.fa || attribute.attributeKey : definitionByKey.get(attribute.attributeKey)?.label.en || attribute.attributeKey}: ${formatMetadataValue(attribute, isRtl).text}`)
              .join(isRtl ? '، ' : ', ')
          : isRtl ? 'مشخصات اعلام نشده' : 'No declared properties';
        return {
          label: variant.label,
          value: text,
          state: applicable.length ? 'ok' as MetadataRowState : 'unknown' as MetadataRowState,
          hint: variant.sku,
        };
      })
    : [{ label: { fa: 'مدل‌ها', en: 'Variants' }, value: isRtl ? 'مدل یا واریانت قابل‌نمایشی ثبت نشده است.' : 'No publishable variant is recorded.', state: 'unknown' as MetadataRowState }];

  const documentRows: MetadataRow[] = product.documents.length
    ? product.documents.map(document => ({
        label: document.title,
        value: document.url ? (isRtl ? 'مشاهدهٔ مدرک' : 'Open document') : (isRtl ? 'ثبت شده؛ لینک عمومی منتشر نشده' : 'Registered; public link not published'),
        state: document.url ? 'ok' as MetadataRowState : 'unknown' as MetadataRowState,
        href: document.url,
      }))
    : [{ label: { fa: 'مدارک', en: 'Documents' }, value: isRtl ? 'مدرکی ثبت نشده است.' : 'No document is recorded.', state: 'unknown' as MetadataRowState }];

  const fileRows: MetadataRow[] = product.bimFiles.length
    ? product.bimFiles.map(file => ({
        label: { fa: `فایل BIM — ${file.format}`, en: `BIM file — ${file.format}` },
        value: file.version || file.softwareVersion || (isRtl ? 'نسخه اعلام نشده' : 'Version not declared'),
        state: 'ok' as MetadataRowState,
      }))
    : [{ label: { fa: 'فایل BIM', en: 'BIM file' }, value: isRtl ? 'فایل BIM برای دانلود در دسترس نیست' : 'No BIM file available for download', state: 'unknown' as MetadataRowState }];

  const sourceRows: MetadataRow[] = product.sources.length
    ? product.sources.map(source => ({
        label: { fa: source.title, en: source.title },
        value: source.url ? (isRtl ? 'مشاهدهٔ منبع' : 'Open source') : source.kind.replaceAll('_', ' '),
        state: 'ok' as MetadataRowState,
        href: source.url,
      }))
    : [{ label: { fa: 'منبع داده', en: 'Data source' }, value: isRtl ? 'منبعی برای این اطلاعات ثبت نشده است.' : 'No source is registered.', state: 'unknown' as MetadataRowState }];

  const groups: MetadataGroup[] = [
    { id: 'key', accent: 'teal', title: { fa: 'ویژگی‌های کلیدی', en: 'Key properties' }, rows: catalogValueRows(primaryRules, definitionByKey, valueByKey, product, isRtl), defaultOpen: true },
    { id: 'technical', accent: 'navy', title: { fa: 'مشخصات فنی ساختاریافته', en: 'Structured technical specifications' }, rows: catalogValueRows(advancedRules, definitionByKey, valueByKey, product, isRtl), defaultOpen: primaryRules.length < 4 },
    { id: 'variants', accent: 'violet', title: { fa: 'مدل‌ها و واریانت‌ها', en: 'Models and variants' }, rows: variantRows, defaultOpen: false },
    { id: 'files', accent: 'amber', title: { fa: 'فایل‌ها و مدارک', en: 'Files and documents' }, rows: [...fileRows, ...documentRows], defaultOpen: false },
    { id: 'sources', accent: 'slate', title: { fa: 'شفافیت داده و منابع', en: 'Data transparency and sources' }, rows: sourceRows, defaultOpen: false },
  ];
  return groups.filter(group => group.rows.length > 0);
}

const yesNo = (value: boolean | undefined, isRtl: boolean): string =>
  value === undefined ? (isRtl ? 'اعلام نشده' : 'Not declared') : value ? (isRtl ? 'بله' : 'Yes') : (isRtl ? 'خیر' : 'No');

/** Grouped metadata for a legacy BIMObject — rendered with the same component. */
export function buildLegacyObjectMetadataGroups(object: BIMObject, manufacturerName: string, manufacturerIsSample: boolean, isRtl: boolean): MetadataGroup[] {
  const path = legacyObjectLibraryPathLabels(object);
  const categoryLabel = isRtl && path.subcategoryFa
    ? `${path.familyFa} › ${path.subcategoryFa}`
    : path.subcategoryEn
      ? `${path.familyEn} › ${path.subcategoryEn}`
      : object.category;

  const generalRows: MetadataRow[] = [
    { label: { fa: 'تولیدکننده', en: 'Manufacturer' }, value: manufacturerName || (isRtl ? 'اعلام نشده' : 'Not declared'), state: manufacturerName ? 'ok' : 'unknown' },
    { label: { fa: 'مسیر دسته‌بندی کتابخانه', en: 'Library category path' }, value: categoryLabel, state: 'ok' },
    { label: { fa: 'سطح جزئیات مدل', en: 'Level of detail' }, value: object.lod || (isRtl ? 'اعلام نشده' : 'Not declared'), state: object.lod ? 'ok' : 'unknown' },
    { label: { fa: 'حجم فایل', en: 'File size' }, value: object.fileSize || (isRtl ? 'اعلام نشده' : 'Not declared'), state: object.fileSize ? 'ok' : 'unknown' },
    { label: { fa: 'مبدأ تولید', en: 'Origin' }, value: object.isImported ? (isRtl ? 'وارداتی' : 'Imported') : (isRtl ? 'تولید ایران' : 'Made in Iran'), state: 'ok' },
    { label: { fa: 'گواهی‌ها', en: 'Certifications' }, value: object.certification.length ? object.certification.join(isRtl ? '، ' : ', ') : (isRtl ? 'اعلام نشده' : 'Not declared'), state: object.certification.length ? 'ok' : 'unknown' },
    { label: { fa: 'نمونهٔ فیزیکی', en: 'Physical sample' }, value: yesNo(object.hasSample, isRtl), state: 'ok' },
    { label: { fa: 'برگهٔ فنی (Cut-sheet)', en: 'Cut-sheet' }, value: yesNo(object.hasCutsheet, isRtl), state: 'ok' },
  ];

  const specRows: MetadataRow[] = Object.entries(object.specs || {}).map(([key, raw]) => {
    const label = legacySpecLabel(key);
    const text = typeof raw === 'boolean' ? yesNo(raw, isRtl) : Array.isArray(raw) ? raw.join(isRtl ? '، ' : ', ') : String(raw);
    return { label, value: text || (isRtl ? 'اعلام نشده' : 'Not declared'), state: text ? 'ok' as MetadataRowState : 'unknown' as MetadataRowState };
  });
  if (!specRows.length) {
    specRows.push({ label: { fa: 'مشخصات دسته', en: 'Category properties' }, value: isRtl ? 'مشخصات اختصاصی این دسته در حال تکمیل است.' : 'Category-specific properties are being completed.', state: 'unknown' });
  }

  const fileRows: MetadataRow[] = [
    {
      label: { fa: 'فرمت‌های قابل دانلود', en: 'Downloadable formats' },
      value: object.formats.length ? object.formats.join(isRtl ? '، ' : ', ') : (isRtl ? 'هنوز فایلی منتشر نشده' : 'No file published yet'),
      state: object.formats.length ? 'ok' : 'unknown',
    },
    { label: { fa: 'نسخه‌های Revit', en: 'Revit versions' }, value: object.revitVersions?.length ? object.revitVersions.join(isRtl ? '، ' : ', ') : (isRtl ? 'اعلام نشده' : 'Not declared'), state: object.revitVersions?.length ? 'ok' : 'unknown' },
    { label: { fa: 'مدل پارامتریک', en: 'Parametric model' }, value: isRtl ? 'منطق پارامتریک خانواده در فایل دانلودی' : 'Parametric family logic inside the download', state: 'muted' },
  ];

  const transparencyRows: MetadataRow[] = [
    {
      label: { fa: 'وضعیت پروفایل برند', en: 'Brand profile status' },
      value: manufacturerIsSample
        ? (isRtl ? 'پروفایل نمونه — برند واقعی پس از تأیید جایگزین می‌شود' : 'Sample profile — replaced once a real brand is verified')
        : (isRtl ? 'برند ثبت‌شده در پلتفرم' : 'Registered platform brand'),
      state: manufacturerIsSample ? 'muted' : 'ok',
    },
    { label: { fa: 'تکمیل داده', en: 'Data completion' }, value: isRtl ? 'اطلاعات فنی این محصول در حال تکمیل است' : 'Technical information is being completed', state: 'muted' },
    { label: { fa: 'الگوی متادیتا', en: 'Metadata pattern' }, value: isRtl ? 'مطابق قرارداد کتابخانهٔ ساختاریافتهٔ ایران‌بیم‌هاب' : 'Aligned with the IranBIMhub structured-library contract', state: 'muted' },
  ];

  return [
    { id: 'general', accent: 'teal', title: { fa: 'اطلاعات عمومی محصول', en: 'General product information' }, rows: generalRows, defaultOpen: true },
    { id: 'specs', accent: 'navy', title: { fa: 'ویژگی‌های فنی دسته', en: 'Category technical properties' }, rows: specRows, defaultOpen: true },
    { id: 'files', accent: 'amber', title: { fa: 'فایل‌ها و محتوای BIM', en: 'Files and BIM content' }, rows: fileRows, defaultOpen: false },
    { id: 'transparency', accent: 'slate', title: { fa: 'شفافیت داده', en: 'Data transparency' }, rows: transparencyRows, defaultOpen: false },
  ];
}

/** Data-level badge info used on cards and detail headers (shared colours). */
export function useCatalogDataLevel(product: Product) {
  return useMemo(() => {
    const assessment = assessDataLevel(product, CATEGORY_ATTRIBUTE_RULES);
    return { assessment, level: DATA_LEVELS[assessment.level] };
  }, [product]);
}

export function categoryPathLabel(categoryId: string, isRtl: boolean): string {
  const category = PRODUCT_CATEGORIES.find(item => item.id === categoryId);
  if (!category) return '';
  const parent = category.parentId ? PRODUCT_CATEGORIES.find(item => item.id === category.parentId) : undefined;
  const categoryLabel = isRtl ? category.label.fa : category.label.en;
  if (!parent) return categoryLabel;
  const parentLabel = isRtl ? parent.label.fa : parent.label.en;
  return `${parentLabel} › ${categoryLabel}`;
}
