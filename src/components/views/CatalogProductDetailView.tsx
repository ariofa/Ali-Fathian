import React, { useMemo } from 'react';
import {
  ArrowLeft, ArrowRight, BadgeInfo, BookOpen, Boxes, CalendarDays, CheckCircle2,
  CircleAlert, ClipboardList, Download, ExternalLink, FileCode2, FileText, FolderOpen,
  Image as ImageIcon, Info, Layers3, PackageCheck, RefreshCw, Ruler, Tag, XCircle,
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import {
  assessDataLevel, ATTRIBUTE_REGISTRY, BIM_AVAILABILITY_STATUSES, CATEGORY_ATTRIBUTE_RULES,
  DATA_LEVELS, PRODUCT_CATEGORIES, PRODUCTION_STATUSES, PUBLICATION_STATUSES,
} from '../../lib/catalog';
import type { AttributeValue, Product, ProductDocument } from '../../lib/catalog';

interface CatalogProductDetailViewProps {
  product: Product;
  preview?: boolean;
  onBack: () => void;
  onRequest: () => void;
  onViewCompletion?: () => void;
}

const documentIcons: Record<ProductDocument['type'], React.ComponentType<{ className?: string }>> = {
  image: ImageIcon, catalog: BookOpen, datasheet: ClipboardList, installation_guide: PackageCheck, technical_drawing: Ruler,
};

function valueLabel(value?: AttributeValue): string {
  if (!value || value.applicability === 'unknown') return 'اعلام نشده';
  if (value.applicability === 'not_applicable') return 'نامرتبط با این محصول';
  const raw = Array.isArray(value.value) ? value.value.join('، ') : value.value;
  if (raw !== undefined) return `${raw}${value.unit ? ` ${value.unit}` : ''}`;
  if (value.min !== undefined || value.max !== undefined) return `${value.min ?? '—'} تا ${value.max ?? '—'}${value.unit ? ` ${value.unit}` : ''}`;
  return 'اعلام نشده';
}

export const CatalogProductDetailView: React.FC<CatalogProductDetailViewProps> = ({ product, preview = false, onBack, onRequest, onViewCompletion }) => {
  const { isRtl } = useLanguage();
  const productCategory = PRODUCT_CATEGORIES.find(category => category.id === product.categoryId);
  const parentCategory = productCategory?.parentId ? PRODUCT_CATEGORIES.find(category => category.id === productCategory.parentId) : undefined;
  const assessment = useMemo(() => assessDataLevel(product, CATEGORY_ATTRIBUTE_RULES), [product]);
  const definitionByKey = useMemo(() => new Map(ATTRIBUTE_REGISTRY.map(definition => [definition.key, definition])), []);
  const rules = useMemo(() => CATEGORY_ATTRIBUTE_RULES.filter(rule => rule.categoryId === product.categoryId), [product.categoryId]);
  const values = useMemo(() => [...product.attributes, ...product.variants.flatMap(variant => variant.attributes)], [product]);
  const valueByKey = useMemo(() => new Map(values.map(value => [value.attributeKey, value])), [values]);
  const primaryRules = rules.filter(rule => rule.priority === 'primary').slice(0, 6);
  const advancedRules = rules.filter(rule => rule.priority === 'advanced');
  const unknownRules = rules.filter(rule => !valueByKey.has(rule.attributeKey) || valueByKey.get(rule.attributeKey)?.applicability === 'unknown');
  const level = DATA_LEVELS[assessment.level];
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#087F7A] cursor-pointer transition-colors"><Arrow className="w-4 h-4" />{isRtl ? 'بازگشت به کتابخانه' : 'Back to library'}</button>

    {preview && <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-[#D6A01D]/40 bg-[#FFF8E6] px-4 py-3 text-xs leading-6 text-[#5C4610]"><Info className="h-4 w-4 shrink-0" /><p className="flex-1"><strong>پیش‌نمایش داخلی ساختار داده:</strong> این رکورد صرفاً برای نمایش معماری صفحهٔ محصول است؛ برند، محصول، مدرک و فایل قابل‌دانلود واقعی نیستند و در کتابخانهٔ عمومی نمایش داده نمی‌شود.</p>{onViewCompletion && <button type="button" onClick={onViewCompletion} className="shrink-0 rounded-lg border border-[#D6A01D]/50 bg-white px-3 py-1.5 text-[11px] font-black text-[#5C4610] cursor-pointer hover:bg-[#FFF1C9]">نمای مسیر تکمیل برای برند</button>}</div>}

    <header className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500"><span>{parentCategory ? (isRtl ? parentCategory.label.fa : parentCategory.label.en) : '—'}</span><span>/</span><span>{productCategory ? (isRtl ? productCategory.label.fa : productCategory.label.en) : '—'}</span></div>
          <p className="mt-6 text-xs font-black text-[#087F7A]">{isRtl ? product.manufacturer.name.fa : product.manufacturer.name.en}</p>
          <h1 className="mt-2 text-2xl sm:text-4xl font-black leading-tight text-[#0F3D5E] dark:text-white">{isRtl ? product.title.fa : product.title.en}</h1>
          {(product.family || product.modelNumber) && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{product.family && <span>{isRtl ? `سری: ${product.family}` : `Family: ${product.family}`}</span>}{product.family && product.modelNumber && <span className="mx-2">•</span>}{product.modelNumber && <span>{isRtl ? `مدل: ${product.modelNumber}` : `Model: ${product.modelNumber}`}</span>}</p>}
          <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-600 dark:text-slate-300">{isRtl ? product.shortDescription.fa : product.shortDescription.en}</p>
          <div className="mt-6 flex flex-wrap gap-2"><span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{isRtl ? PRODUCTION_STATUSES[product.productionStatus] : product.productionStatus.replaceAll('_', ' ')}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{isRtl ? PUBLICATION_STATUSES[product.publicationStatus] : product.publicationStatus.replaceAll('_', ' ')}</span></div>
        </div>
        <div className="border-t border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950/50 lg:border-s-0 lg:border-t-0">
          <p className="text-[11px] font-black text-slate-500">{isRtl ? 'سطح دادهٔ محصول' : 'Product data level'}</p>
          <div className="mt-3 rounded-2xl border p-4" style={{ borderColor: `${level.color}55`, backgroundColor: `${level.color}0E` }}><div className="flex items-center gap-2" style={{ color: level.color }}><Layers3 className="w-5 h-5" /><span className="text-sm font-black">{isRtl ? level.titleFa : level.titleEn}</span></div><p className="mt-2 text-[11px] leading-6 text-slate-600 dark:text-slate-300">{isRtl ? `${assessment.completionPercent}٪ پوشش دادهٔ مرتبط ثبت شده است.` : `${assessment.completionPercent}% of relevant data is recorded.`}</p></div>
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800"><p className="text-[11px] font-black text-slate-500">{isRtl ? 'وضعیت مستقل BIM' : 'Independent BIM status'}</p><div className="mt-2 flex items-start gap-2"><FileCode2 className="mt-0.5 h-4 w-4 text-[#087F7A]" /><div><p className="text-xs font-bold text-slate-700 dark:text-slate-200">{isRtl ? BIM_AVAILABILITY_STATUSES[product.bimAvailability] : product.bimAvailability.replaceAll('_', ' ')}</p><p className="mt-1 text-[10px] leading-5 text-slate-500">{isRtl ? 'این وضعیت، جدا از سطح دادهٔ محصول است و به‌تنهایی نشان‌دهندهٔ بررسی فنی فایل نیست.' : 'This status is separate from the data level and does not itself confirm a technical review.'}</p></div></div></div>
        </div>
      </div>
    </header>

    <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
      <main className="space-y-8">
        <Section title={isRtl ? 'ویژگی‌های کلیدی' : 'Key properties'} icon={Tag}><div className="grid gap-3 sm:grid-cols-2">{primaryRules.map(rule => <PropertyCard key={rule.attributeKey} label={isRtl ? definitionByKey.get(rule.attributeKey)?.label.fa : definitionByKey.get(rule.attributeKey)?.label.en} value={valueLabel(valueByKey.get(rule.attributeKey))} source={valueByKey.get(rule.attributeKey)?.sourceId} product={product} />)}</div></Section>
        <Section title={isRtl ? 'مشخصات فنی ساختاریافته' : 'Structured technical specifications'} icon={ClipboardList}><div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"><table className="w-full text-sm"><tbody>{advancedRules.map(rule => <tr key={rule.attributeKey} className="border-b border-slate-100 last:border-0 dark:border-slate-800"><th className="w-[44%] bg-slate-50 px-4 py-3.5 text-start text-xs font-bold text-slate-600 dark:bg-slate-950/50 dark:text-slate-300">{isRtl ? definitionByKey.get(rule.attributeKey)?.label.fa : definitionByKey.get(rule.attributeKey)?.label.en}</th><td className="px-4 py-3.5 text-xs text-slate-700 dark:text-slate-200">{valueLabel(valueByKey.get(rule.attributeKey))}</td></tr>)}</tbody></table></div></Section>
        <Section title={isRtl ? 'مدل‌ها و واریانت‌ها' : 'Models and variants'} icon={Boxes}>{product.variants.length ? <div className="space-y-3">{product.variants.map(variant => <div key={variant.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-black text-slate-800 dark:text-white">{isRtl ? variant.label.fa : variant.label.en}</h3>{variant.sku && <span className="font-mono text-[10px] text-slate-500">{variant.sku}</span>}</div><div className="mt-3 flex flex-wrap gap-2">{variant.attributes.filter(attribute => attribute.applicability === 'applicable').map(attribute => <span key={attribute.attributeKey} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{isRtl ? definitionByKey.get(attribute.attributeKey)?.label.fa : definitionByKey.get(attribute.attributeKey)?.label.en}: {valueLabel(attribute)}</span>)}</div></div>)}</div> : <NoData text={isRtl ? 'مدل یا واریانت قابل‌نمایشی ثبت نشده است.' : 'No publishable model or variant is recorded.'} />}</Section>
        <Section title={isRtl ? 'فایل‌ها و محتوای طراحی' : 'Design files and content'} icon={FolderOpen}><div className="grid gap-3 sm:grid-cols-2">{product.documents.map(document => <DocumentCard key={document.id} document={document} isRtl={isRtl} />)}{product.bimFiles.map(file => <div key={file.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><FileCode2 className="h-5 w-5 text-[#087F7A]" /><h3 className="mt-3 text-sm font-black text-slate-800 dark:text-white">{file.format} {isRtl ? 'فایل BIM' : 'BIM file'}</h3><p className="mt-1 text-[11px] text-slate-500">{isRtl ? PUBLICATION_STATUSES[file.reviewStatus] : file.reviewStatus.replaceAll('_', ' ')}</p></div>)}</div>{!product.bimFiles.length && <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-4 text-xs leading-6 text-slate-500 dark:border-slate-700">{isRtl ? 'فایل BIM برای دانلود در دسترس نیست. وضعیت BIM در بالای صفحه مشخص شده است.' : 'No BIM file is available for download. See the BIM status at the top of this page.'}</div>}</Section>
      </main>
      <aside className="space-y-5 xl:sticky xl:top-28 xl:h-fit">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-sm font-black text-slate-800 dark:text-white">{isRtl ? 'شفافیت اطلاعات' : 'Information transparency'}</h2><div className="mt-4 space-y-3"><div className="flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 text-[#087F7A]" /><div><p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{isRtl ? 'آخرین به‌روزرسانی' : 'Last update'}</p><p className="mt-0.5 text-[11px] text-slate-500">{product.updatedAt}</p></div></div><div className="flex items-start gap-2"><CircleAlert className="mt-0.5 h-4 w-4 text-[#D6A01D]" /><p className="text-[11px] leading-6 text-slate-500">{unknownRules.length ? (isRtl ? `${unknownRules.length} ویژگی مرتبط هنوز اعلام یا تکمیل نشده است.` : `${unknownRules.length} relevant properties have not been declared or completed.`) : (isRtl ? 'همهٔ ویژگی‌های تعریف‌شدهٔ این الگو ثبت شده‌اند.' : 'All defined properties in this template are recorded.')}</p></div></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-sm font-black text-slate-800 dark:text-white">{isRtl ? 'منبع داده و مدارک' : 'Data sources and documents'}</h2><div className="mt-4 space-y-3">{product.sources.length ? product.sources.map(source => <div key={source.id} className="text-[11px]"><p className="font-bold text-slate-700 dark:text-slate-200">{source.title}</p><p className="mt-1 text-slate-500">{source.kind.replaceAll('_', ' ')}</p></div>) : <NoData text={isRtl ? 'منبعی برای این اطلاعات ثبت نشده است.' : 'No source is registered for this information.'} />}</div></section>
        <section className="rounded-2xl bg-[#0F3D5E] p-5 text-white"><h2 className="text-sm font-black">{isRtl ? 'محصول یا برند موردنظر شما نیست؟' : 'Need a different product or brand?'}</h2><p className="mt-2 text-xs leading-6 text-slate-200">{isRtl ? 'درخواست خود را ثبت کنید تا برای تکمیل کتابخانه بررسی شود.' : 'Send a request so it can be considered while the library is built.'}</p><button type="button" onClick={onRequest} className="mt-4 w-full rounded-xl bg-white px-3 py-2.5 text-xs font-black text-[#0F3D5E] cursor-pointer hover:bg-[#E8F7F5]">{isRtl ? 'درخواست محصول یا برند' : 'Request a product or brand'}</button></section>
      </aside>
    </div>
  </div>;
};

const Section: React.FC<{ title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }> = ({ title, icon: Icon, children }) => <section><div className="mb-4 flex items-center gap-2"><Icon className="h-4 w-4 text-[#087F7A]" /><h2 className="text-base font-black text-slate-800 dark:text-white">{title}</h2></div>{children}</section>;
const PropertyCard: React.FC<{ label?: string; value: string; source?: string; product: Product }> = ({ label, value, source, product }) => <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><p className="text-[11px] font-bold text-slate-500">{label || '—'}</p><p className="mt-2 text-sm font-black text-slate-800 dark:text-white">{value}</p>{source && <p className="mt-2 text-[10px] text-[#087F7A]">{product.sources.find(item => item.id === source)?.title || 'منبع ثبت شده'}</p>}</div>;
const DocumentCard: React.FC<{ document: ProductDocument; isRtl: boolean }> = ({ document, isRtl }) => { const Icon = documentIcons[document.type]; return <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><Icon className="h-5 w-5 text-[#087F7A]" /><h3 className="mt-3 text-sm font-black text-slate-800 dark:text-white">{isRtl ? document.title.fa : document.title.en}</h3>{document.url ? <a href={document.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#087F7A] hover:underline"><ExternalLink className="h-3.5 w-3.5" />{isRtl ? 'مشاهدهٔ مدرک' : 'Open document'}</a> : <p className="mt-2 text-[11px] leading-5 text-slate-500">{isRtl ? 'مدرک ثبت شده است؛ لینک عمومی هنوز منتشر نشده.' : 'Document is registered; its public link is not published yet.'}</p>}</div>; };
const NoData: React.FC<{ text: string }> = ({ text }) => <p className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-xs leading-6 text-slate-500 dark:border-slate-700">{text}</p>;
