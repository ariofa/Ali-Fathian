import React, { useMemo, useState } from 'react';
import { ChevronDown, FileSearch, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { useLanguage } from '../LanguageContext';
import {
  assessDataLevel, ATTRIBUTE_REGISTRY, BIM_AVAILABILITY_STATUSES, buildAttributeFacets,
  CATEGORY_ATTRIBUTE_RULES, DATA_LEVELS, EMPTY_CATALOG_FILTERS,
  filterCatalogProducts, PUBLISHED_CATALOG_PRODUCTS,
} from '../../lib/catalog';
import type { CatalogFilterState, CommonContentFilter } from '../../lib/catalog';

interface CatalogSearchPanelProps {
  categoryId: string;
  categoryLabels: { fa: string; en: string }[];
  onRequest: () => void;
}

const contentLabels: Record<CommonContentFilter, { fa: string; en: string }> = {
  bim_file: { fa: 'فایل BIM', en: 'BIM file' },
  catalog: { fa: 'کاتالوگ', en: 'Catalog' }, datasheet: { fa: 'دیتاشیت', en: 'Datasheet' },
  technical_drawing: { fa: 'نقشه یا دیتیل', en: 'Drawing / detail' }, image: { fa: 'تصویر', en: 'Image' },
};

export const CatalogSearchPanel: React.FC<CatalogSearchPanelProps> = ({ categoryId, categoryLabels, onRequest }) => {
  const { isRtl } = useLanguage();
  const [filters, setFilters] = useState<CatalogFilterState>(EMPTY_CATALOG_FILTERS);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const sourceProducts = useMemo(() => PUBLISHED_CATALOG_PRODUCTS.filter(product => product.categoryId === categoryId && product.publicationStatus === 'published'), [categoryId]);
  const results = useMemo(() => filterCatalogProducts(sourceProducts, categoryId, filters, CATEGORY_ATTRIBUTE_RULES, categoryLabels), [sourceProducts, categoryId, filters, categoryLabels]);
  const facets = useMemo(() => buildAttributeFacets(sourceProducts, categoryId, CATEGORY_ATTRIBUTE_RULES, ATTRIBUTE_REGISTRY), [sourceProducts, categoryId]);
  const primaryFacets = facets.filter(facet => facet.priority === 'primary').slice(0, 6);
  const advancedFacets = facets.filter(facet => facet.priority === 'advanced');
  const hasAvailableData = sourceProducts.length > 0;

  const updateAttributes = (key: string, value: CatalogFilterState['attributes'][string] | undefined) => {
    setFilters(previous => {
      const attributes = { ...previous.attributes };
      if (value === undefined || value === '') delete attributes[key]; else attributes[key] = value;
      return { ...previous, attributes };
    });
  };
  const clearFilters = () => setFilters(EMPTY_CATALOG_FILTERS);

  if (!hasAvailableData) {
    return <EmptyState icon={FileSearch} title={isRtl ? 'هنوز محصول منتشرشده‌ای در این دسته وجود ندارد' : 'No published products in this category yet'} description={isRtl ? 'فیلترها فقط زمانی فعال می‌شوند که دادهٔ واقعی و قابل‌انتشار برای این خانواده ثبت شده باشد؛ بنابراین هیچ گزینه یا تعداد ساختگی نمایش داده نمی‌شود.' : 'Filters are activated only when real, publishable data exists for this family; no invented options or counts are shown.'} actionLabel={isRtl ? 'محصول یا برند موردنظر خود را درخواست کنید' : 'Request a product or brand'} onAction={onRequest} />;
  }

  const formats = [...new Set(sourceProducts.flatMap(product => product.bimFiles.map(file => file.format)))];
  const bimStates = [...new Set(sourceProducts.map(product => product.bimAvailability))];
  const brands = [...new Map(sourceProducts.map(product => [product.manufacturer.id, product.manufacturer])).values()];
  const content = (Object.keys(contentLabels) as CommonContentFilter[]).filter(item => sourceProducts.some(product => item === 'bim_file' ? product.bimFiles.length > 0 : product.documents.some(document => document.type === item)));
  const dataLevels = [...new Set(sourceProducts.map(product => assessDataLevel(product, CATEGORY_ATTRIBUTE_RULES).level))];
  const updatedBuckets = [...new Set(sourceProducts.map(product => { const age = Math.floor((Date.now() - new Date(product.updatedAt).getTime()) / 86_400_000); return age <= 30 ? '30d' : age <= 90 ? '90d' : 'older'; }))];
  const updatedLabels: Record<string, { fa: string; en: string }> = { '30d': { fa: '۳۰ روز اخیر', en: 'Last 30 days' }, '90d': { fa: '۳۱ تا ۹۰ روز اخیر', en: '31–90 days' }, older: { fa: 'قدیمی‌تر', en: 'Older' } };

  return <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-28">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800"><div className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-white"><SlidersHorizontal className="w-4 h-4 text-[#087F7A]" />{isRtl ? 'فیلترها' : 'Filters'}</div><button type="button" onClick={clearFilters} className="text-[11px] font-bold text-[#087F7A] hover:underline cursor-pointer">{isRtl ? 'پاک‌کردن' : 'Clear'}</button></div>
      <div className="mt-4 space-y-5">
        <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">{isRtl ? 'جست‌وجو در این دسته' : 'Search this category'}</span><div className="relative"><Search className="absolute start-3 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-slate-400" /><input value={filters.query} onChange={event => setFilters(previous => ({ ...previous, query: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 ps-9 pe-3 text-xs text-slate-800 outline-none focus:border-[#0FB9B1] dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder={isRtl ? 'نام، ویژگی یا کلیدواژه' : 'Name, property or keyword'} /></div></label>
        {primaryFacets.map(facet => <AttributeFilter key={facet.key} facet={facet} value={filters.attributes[facet.key]} onChange={value => updateAttributes(facet.key, value)} isRtl={isRtl} />)}
        <section className="border-t border-slate-100 pt-4 dark:border-slate-800 space-y-3"><h3 className="text-xs font-black text-slate-700 dark:text-slate-200">{isRtl ? 'فیلترهای مشترک' : 'Common filters'}</h3>
          {brands.length > 1 && <SelectFilter label={isRtl ? 'برند' : 'Brand'} value={filters.brands[0] || ''} options={brands.map(brand => ({ value: brand.id, label: isRtl ? brand.name.fa : brand.name.en }))} onChange={value => setFilters(previous => ({ ...previous, brands: value ? [value] : [] }))} />}
          {formats.length > 0 && <SelectFilter label={isRtl ? 'فرمت فایل' : 'File format'} value={filters.formats[0] || ''} options={formats.map(value => ({ value, label: value }))} onChange={value => setFilters(previous => ({ ...previous, formats: value ? [value] : [] }))} />}
          {content.length > 1 && <SelectFilter label={isRtl ? 'محتوای قابل‌دسترسی' : 'Available content'} value={filters.content[0] || ''} options={content.map(value => ({ value, label: isRtl ? contentLabels[value].fa : contentLabels[value].en }))} onChange={value => setFilters(previous => ({ ...previous, content: value ? [value as CommonContentFilter] : [] }))} />}
          {bimStates.length > 1 && <SelectFilter label={isRtl ? 'وضعیت BIM' : 'BIM status'} value={filters.bimAvailability[0] || ''} options={bimStates.map(value => ({ value, label: isRtl ? BIM_AVAILABILITY_STATUSES[value] : value.replaceAll('_', ' ') }))} onChange={value => setFilters(previous => ({ ...previous, bimAvailability: value ? [value] : [] }))} />}
          {dataLevels.length > 1 && <SelectFilter label={isRtl ? 'سطح دادهٔ محصول' : 'Product data level'} value={filters.dataLevels[0] || ''} options={dataLevels.map(value => ({ value, label: isRtl ? DATA_LEVELS[value].titleFa : DATA_LEVELS[value].titleEn }))} onChange={value => setFilters(previous => ({ ...previous, dataLevels: value ? [value as keyof typeof DATA_LEVELS] : [] }))} />}
          {updatedBuckets.length > 1 && <SelectFilter label={isRtl ? 'آخرین به‌روزرسانی' : 'Last update'} value={filters.updatedWithin || ''} options={updatedBuckets.map(value => ({ value, label: isRtl ? updatedLabels[value].fa : updatedLabels[value].en }))} onChange={value => setFilters(previous => ({ ...previous, updatedWithin: value as CatalogFilterState['updatedWithin'] || null }))} />}
        </section>
        {advancedFacets.length > 0 && <section className="border-t border-slate-100 pt-3 dark:border-slate-800"><button type="button" onClick={() => setAdvancedOpen(open => !open)} className="flex w-full items-center justify-between text-xs font-black text-[#087F7A] cursor-pointer">{isRtl ? 'فیلترهای بیشتر' : 'More filters'}<ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} /></button>{advancedOpen && <div className="mt-4 space-y-4">{advancedFacets.map(facet => <AttributeFilter key={facet.key} facet={facet} value={filters.attributes[facet.key]} onChange={value => updateAttributes(facet.key, value)} isRtl={isRtl} />)}</div>}</section>}
      </div>
    </aside>
    <section><div className="mb-4 flex items-center justify-between"><p className="text-xs text-slate-500 dark:text-slate-400">{results.length} {isRtl ? 'محصول واقعی منتشرشده' : 'published real products'}</p><span className="text-[11px] text-slate-400">{isRtl ? 'نتایج بر اساس دادهٔ ساختاریافته' : 'Structured-data results'}</span></div>{results.length ? <div className="grid gap-3 sm:grid-cols-2">{results.map(product => <article key={product.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><p className="text-[11px] font-bold text-[#087F7A]">{isRtl ? product.manufacturer.name.fa : product.manufacturer.name.en}</p><h3 className="mt-2 text-sm font-black text-slate-800 dark:text-white">{isRtl ? product.title.fa : product.title.en}</h3><p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">{isRtl ? product.shortDescription.fa : product.shortDescription.en}</p></article>)}</div> : <EmptyState compact icon={Filter} title={isRtl ? 'محصولی با این ترکیب فیلتر پیدا نشد' : 'No product matches these filters'} description={isRtl ? 'فیلترها را تغییر دهید یا درخواست محصول خود را ثبت کنید.' : 'Adjust the filters or request the product you need.'} actionLabel={isRtl ? 'پاک‌کردن فیلترها' : 'Clear filters'} onAction={clearFilters} />}</section>
  </div>;
};

const SelectFilter: React.FC<{ label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-slate-600 dark:text-slate-300">{label}</span><select value={value} onChange={event => onChange(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-[#0FB9B1] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"><option value="">—</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
const AttributeFilter: React.FC<{ facet: import('../../lib/catalog').AttributeFacet; value: CatalogFilterState['attributes'][string]; onChange: (value: CatalogFilterState['attributes'][string] | undefined) => void; isRtl: boolean }> = ({ facet, value, onChange, isRtl }) => {
  const label = isRtl ? facet.labelFa : facet.labelEn;
  if (facet.kind === 'range') { const range = typeof value === 'object' && !Array.isArray(value) ? value : {}; return <div><span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">{label}{facet.unit ? ` (${facet.unit})` : ''}</span><div className="grid grid-cols-2 gap-2"><input type="number" placeholder={isRtl ? `از ${facet.min}` : `From ${facet.min}`} onChange={event => onChange({ ...range, min: event.target.value === '' ? undefined : Number(event.target.value) })} className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-950" /><input type="number" placeholder={isRtl ? `تا ${facet.max}` : `To ${facet.max}`} onChange={event => onChange({ ...range, max: event.target.value === '' ? undefined : Number(event.target.value) })} className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-950" /></div></div>; }
  return <SelectFilter label={label} value={typeof value === 'string' ? value : ''} options={facet.options || []} onChange={next => onChange(next || undefined)} />;
};
