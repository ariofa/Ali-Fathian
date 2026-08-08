import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Boxes, ChevronDown, ChevronLeft, ChevronRight, Layers,
  RotateCcw, Search, SearchX, SlidersHorizontal, Sparkles, X,
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { BIMObjectCard } from '../BIMObjectCard';
import { MetadataChips, useCatalogDataLevel } from '../catalog/StructuredMetadata';
import { useLanguage } from '../LanguageContext';
import {
  ALL_ATTRIBUTE_DEFINITIONS,
  BIM_AVAILABILITY_STATUSES,
  CATEGORY_ATTRIBUTE_RULES,
  PRODUCT_CATEGORIES,
  PUBLISHED_CATALOG_PRODUCTS,
  entryAttributeValues,
  legacyMainFilterPresetsForCategory,
  legacyObjectToUnifiedSearchEntry,
  normalizeSearchText,
  productToUnifiedSearchEntry,
} from '../../lib/catalog';
import type { Product } from '../../lib/catalog';
import {
  familyIdOfLibraryCategory,
  legacyObjectLibraryCategoryId,
  legacyObjectLibraryPathLabels,
  specialistFilterHintsForCategory,
} from '../../lib/catalog/legacyProductBridge';
import { categoryIcon } from '../../lib/catalog/categoryIcons';
import type { BIMObject, Manufacturer } from '../../types';

/**
 * Unified product library — bim.com/NBS-style browse experience.
 *
 * One screen, every level: the full category tree and the full filter rail
 * stay visible on one side while the matching products are listed next to
 * them. Deep links (/library, /library/:family, /library/:family/:sub) all
 * land on this same view with that level's filter pre-applied — there is no
 * dead-end "pick again" page. The taxonomy and metadata are consumed
 * read-only; nothing here mutates them.
 */

interface CatalogLibraryViewProps {
  categorySlug?: string;
  subcategorySlug?: string;
  onNavigateLibrary: (categorySlug?: string, subcategorySlug?: string) => void;
  onNavigate: (view: string) => void;
  objects: BIMObject[];
  manufacturers: Manufacturer[];
  savedObjects: string[];
  onToggleSave: (id: string) => void;
  onSelectObject: (obj: BIMObject) => void;
  onQuickDownload: (obj: BIMObject, format: string) => void;
  onViewBrand?: (mfgId: string) => void;
  onRequestObject: () => void;
  onSelectCatalogProduct: (product: Product) => void;
  initialQuery?: string;
  /** A new value requests that the existing mobile categories/filters drawer opens immediately. */
  mobileFilterOpenRequest?: number;
}

interface BrowseFilters {
  query: string;
  brands: string[];
  formats: string[];
  revitVersions: string[];
  lods: string[];
  origins: string[];
  certifications: string[];
  hasCutsheet: boolean | null;
  hasSample: boolean | null;
  specs: Record<string, string>;
}

const EMPTY_FILTERS: BrowseFilters = {
  query: '', brands: [], formats: [], revitVersions: [], lods: [], origins: [], certifications: [], hasCutsheet: null, hasSample: null, specs: {},
};

// Kept from the previous main-branch filter UX. They are available choices,
// not fabricated product counts; a choice simply returns no result when no
// current object carries it.
const MAIN_DOWNLOAD_FORMATS = ['Revit', 'ArchiCAD', 'SketchUp', 'IFC', 'Catalog (PDF)', 'AutoCAD'];
const MAIN_REVIT_VERSIONS = ['2022', '2023', '2024', '2025', '2026'];
const MAIN_LOD_LEVELS = ['LOD 100', 'LOD 200', 'LOD 300', 'LOD 350', 'LOD 400'];
const MAIN_CERTIFICATIONS = ['INSO', 'ISO 9001', 'CE', 'BHRC'];

type SortMode = 'default' | 'title' | 'lod';

const l1Categories = PRODUCT_CATEGORIES.filter(category => category.level === 1);
const childrenOf = (parentId: string) => PRODUCT_CATEGORIES.filter(category => category.parentId === parentId);

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter(item => item !== value) : [...list, value];
}

export const CatalogLibraryView: React.FC<CatalogLibraryViewProps> = ({
  categorySlug,
  subcategorySlug,
  onNavigateLibrary,
  onNavigate,
  objects,
  manufacturers,
  savedObjects,
  onToggleSave,
  onSelectObject,
  onQuickDownload,
  onViewBrand,
  onRequestObject,
  onSelectCatalogProduct,
  initialQuery,
  mobileFilterOpenRequest = 0,
}) => {
  const { isRtl } = useLanguage();
  const [filters, setFilters] = useState<BrowseFilters>({ ...EMPTY_FILTERS, query: initialQuery || '' });
  const [expandedFamilies, setExpandedFamilies] = useState<Record<string, boolean>>({});
  const [sortMode, setSortMode] = useState<SortMode>('default');
  // Initialise from the request as well as reacting to later requests: the
  // first mobile tap therefore paints the drawer open, not one frame later.
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(() => mobileFilterOpenRequest > 0);

  // A prop (not a timeout/event race) opens this exact drawer from the first
  // mobile bottom-nav tap, including when the library has to mount first.
  useEffect(() => {
    if (mobileFilterOpenRequest > 0) setFiltersDrawerOpen(true);
  }, [mobileFilterOpenRequest]);

  // A new header search lands here as initialQuery; keep the in-page query in
  // sync even when the user is already on the library view (no remount).
  useEffect(() => {
    if (typeof initialQuery === 'string' && initialQuery.trim() !== '') {
      setFilters(previous => ({ ...previous, query: initialQuery }));
    }
  }, [initialQuery]);

  const selectedFamily = useMemo(() => l1Categories.find(category => category.slug === categorySlug), [categorySlug]);
  const selectedSubcategory = useMemo(
    () => selectedFamily && childrenOf(selectedFamily.id).find(category => category.slug === subcategorySlug),
    [selectedFamily, subcategorySlug],
  );

  // Auto-expand the active family when the URL changes (deep links land open).
  useEffect(() => {
    if (selectedFamily) setExpandedFamilies(previous => ({ ...previous, [selectedFamily.id]: true }));
  }, [selectedFamily]);

  // Reset spec filters whenever the selected (sub)category changes.
  useEffect(() => {
    setFilters(previous => ({ ...previous, specs: {} }));
  }, [categorySlug, subcategorySlug]);

  const manufacturerById = useMemo(() => new Map(manufacturers.map(m => [m.id, m])), [manufacturers]);

  /** Every legacy object is adapted once into the same searchable metadata shape as Product. */
  const mappedObjects = useMemo(
    () => objects.map(object => {
      const entry = legacyObjectToUnifiedSearchEntry(object, manufacturerById.get(object.manufacturerId));
      return { object, libraryCategoryId: entry.categoryId, entry };
    }),
    [objects, manufacturerById],
  );

  const catalogProductEntries = useMemo(
    () => new Map(PUBLISHED_CATALOG_PRODUCTS.filter(product => !product.isSample && product.publicationStatus === 'published').map(product => [product.id, productToUnifiedSearchEntry(product)])),
    [],
  );

  /** Real object counts per level-2 category (for the tree badges). */
  const countsBySubcategory = useMemo(() => {
    const counts: Record<string, number> = {};
    mappedObjects.forEach(({ libraryCategoryId }) => { counts[libraryCategoryId] = (counts[libraryCategoryId] || 0) + 1; });
    PUBLISHED_CATALOG_PRODUCTS.forEach(product => { counts[product.categoryId] = (counts[product.categoryId] || 0) + 1; });
    return counts;
  }, [mappedObjects]);

  /** Objects inside the currently selected taxonomy scope (before value filters). */
  const scopeObjects = useMemo(
    () => mappedObjects.filter(({ libraryCategoryId }) => {
      if (selectedSubcategory) return libraryCategoryId === selectedSubcategory.id;
      if (selectedFamily) return familyIdOfLibraryCategory(libraryCategoryId) === selectedFamily.id;
      return true;
    }),
    [mappedObjects, selectedFamily, selectedSubcategory],
  );

  const scopeCatalogProducts = useMemo(
    () => PUBLISHED_CATALOG_PRODUCTS.filter(product => {
      if (product.isSample || product.publicationStatus !== 'published') return false;
      if (selectedSubcategory) return product.categoryId === selectedSubcategory.id;
      if (selectedFamily) return familyIdOfLibraryCategory(product.categoryId) === selectedFamily.id;
      return true;
    }),
    [selectedFamily, selectedSubcategory],
  );

  // The same normalized metadata search contract applies to Product records,
  // so a future API response cannot bypass filters that already work for BIMObject.
  const filteredCatalogProducts = useMemo(() => {
    const query = normalizeSearchText(filters.query || '');
    return scopeCatalogProducts.filter(product => {
      const entry = catalogProductEntries.get(product.id);
      if (!entry) return false;
      if (filters.brands.length && !filters.brands.includes(entry.manufacturerId)) return false;
      if (filters.formats.length && !entry.formats.some(format => filters.formats.includes(format))) return false;
      if (filters.revitVersions.length && !entry.revitVersions.some(version => filters.revitVersions.includes(version))) return false;
      if (filters.hasCutsheet !== null && entry.hasCutsheet !== filters.hasCutsheet) return false;
      if (filters.hasSample !== null && entry.hasSample !== filters.hasSample) return false;
      if (filters.certifications.length && !entry.certifications.some(cert => filters.certifications.includes(cert))) return false;
      for (const [key, selected] of Object.entries(filters.specs)) {
        if (selected && !entryAttributeValues(entry, key).some(value => normalizeSearchText(value) === normalizeSearchText(selected))) return false;
      }
      return !query || entry.searchText.includes(query);
    });
  }, [scopeCatalogProducts, catalogProductEntries, filters]);

  /**
   * Specialist facets combine actual values with the richer filter presets
   * imported from the previous main branch. Presets only define allowed filter
   * choices; they never create objects, counts or false search results.
   */
  const specFacets = useMemo(() => {
    const byKey = new Map<string, { key: string; label: { fa: string; en: string }; options: Map<string, { fa: string; en: string }> }>();
    const ensureFacet = (key: string, label = ALL_ATTRIBUTE_DEFINITIONS.find(item => item.key === key)?.label || { fa: key, en: key }) => {
      if (!byKey.has(key)) byKey.set(key, { key, label, options: new Map() });
      return byKey.get(key)!;
    };
    const presetCategoryId = selectedSubcategory?.id;
    legacyMainFilterPresetsForCategory(presetCategoryId).forEach(preset => {
      const facet = ensureFacet(preset.key, preset.label);
      preset.options.forEach(option => facet.options.set(option.value, { fa: option.fa, en: option.en }));
    });
    scopeObjects.forEach(({ entry }) => {
      entry.attributes.forEach(attribute => {
        const definition = ALL_ATTRIBUTE_DEFINITIONS.find(item => item.key === attribute.key);
        const facet = ensureFacet(attribute.key, definition?.label);
        attribute.values.forEach(value => {
          const text = String(value ?? '').trim();
          if (text) facet.options.set(text, { fa: text, en: text });
        });
      });
    });
    return [...byKey.values()]
      .map(facet => ({ ...facet, options: [...facet.options.entries()].map(([value, label]) => ({ value, label })) }))
      .filter(facet => facet.options.length > 0)
      .sort((a, b) => (isRtl ? a.label.fa : a.label.en).localeCompare(isRtl ? b.label.fa : b.label.en, isRtl ? 'fa' : 'en'));
  }, [scopeObjects, selectedSubcategory, isRtl]);

  /** What you WILL be able to filter by here (rules+registry hints, read-only). */
  const specialistHints = useMemo(
    () => (selectedSubcategory ? specialistFilterHintsForCategory(selectedSubcategory.id, CATEGORY_ATTRIBUTE_RULES, ALL_ATTRIBUTE_DEFINITIONS, 4) : []),
    [selectedSubcategory],
  );

  const filteredObjects = useMemo(() => {
    const query = normalizeSearchText(filters.query || '');
    const matches = scopeObjects.filter(({ entry }) => {
      if (filters.brands.length && !filters.brands.includes(entry.manufacturerId)) return false;
      if (filters.formats.length && !entry.formats.some(format => filters.formats.includes(format))) return false;
      if (filters.revitVersions.length && !entry.revitVersions.some(version => filters.revitVersions.includes(version))) return false;
      if (filters.lods.length && (!entry.lod || !filters.lods.includes(entry.lod))) return false;
      if (filters.hasCutsheet !== null && entry.hasCutsheet !== filters.hasCutsheet) return false;
      if (filters.hasSample !== null && entry.hasSample !== filters.hasSample) return false;
      if (filters.origins.length) {
        const origin = entry.isImported ? 'imported' : 'iran';
        if (!filters.origins.includes(origin)) return false;
      }
      if (filters.certifications.length && !entry.certifications.some(cert => filters.certifications.includes(cert))) return false;
      for (const [key, selected] of Object.entries(filters.specs)) {
        if (!selected) continue;
        if (!entryAttributeValues(entry, key).some(value => normalizeSearchText(value) === normalizeSearchText(selected))) return false;
      }
      if (query && !entry.searchText.includes(query)) return false;
      return true;
    });
    const sorted = [...matches];
    if (sortMode === 'title') sorted.sort((a, b) => (isRtl ? a.object.titleFa : a.object.titleEn).localeCompare(isRtl ? b.object.titleFa : b.object.titleEn, isRtl ? 'fa' : 'en'));
    if (sortMode === 'lod') sorted.sort((a, b) => (parseInt(b.object.lod.replace(/\D/g, ''), 10) || 0) - (parseInt(a.object.lod.replace(/\D/g, ''), 10) || 0));
    return sorted;
  }, [scopeObjects, filters, sortMode, isRtl]);

  const allFormats = useMemo(() => [...new Set([...MAIN_DOWNLOAD_FORMATS, ...objects.flatMap(object => object.formats), ...scopeCatalogProducts.flatMap(product => product.bimFiles.map(file => file.format))])], [objects, scopeCatalogProducts]);
  const allRevitVersions = useMemo(() => [...new Set([...MAIN_REVIT_VERSIONS, ...objects.flatMap(object => object.revitVersions || []), ...scopeCatalogProducts.flatMap(product => product.bimFiles.flatMap(file => file.softwareVersion ? [file.softwareVersion] : []))])].sort(), [objects, scopeCatalogProducts]);
  const allLods = useMemo(() => [...new Set([...MAIN_LOD_LEVELS, ...objects.map(object => object.lod)])], [objects]);
  const allBrands = useMemo(() => {
    const brands = new Map<string, { id: string; nameFa: string; nameEn: string }>();
    objects.forEach(object => {
      const manufacturer = manufacturerById.get(object.manufacturerId);
      if (manufacturer) brands.set(manufacturer.id, { id: manufacturer.id, nameFa: manufacturer.nameFa, nameEn: manufacturer.nameEn });
    });
    scopeCatalogProducts.forEach(product => brands.set(product.manufacturer.id, { id: product.manufacturer.id, nameFa: product.manufacturer.name.fa, nameEn: product.manufacturer.name.en }));
    return [...brands.values()];
  }, [objects, manufacturerById, scopeCatalogProducts]);
  const allCertifications = useMemo(() => [...new Set([...MAIN_CERTIFICATIONS, ...objects.flatMap(object => object.certification)])], [objects]);

  const activeFilterCount =
    filters.brands.length + filters.formats.length + filters.revitVersions.length + filters.lods.length + filters.origins.length +
    filters.certifications.length + (filters.hasCutsheet !== null ? 1 : 0) + (filters.hasSample !== null ? 1 : 0) +
    Object.values(filters.specs).filter(Boolean).length + (filters.query.trim() ? 1 : 0);

  const clearAllFilters = () => setFilters(previous => ({ ...EMPTY_FILTERS }));
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const FwdChevron = isRtl ? ChevronLeft : ChevronRight;
  const BackIcon = isRtl ? ChevronRight : ChevronLeft;

  const breadcrumb = (
    <nav aria-label={isRtl ? 'مسیر صفحه' : 'Breadcrumb'} className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <button type="button" onClick={() => onNavigate('home')} className="hover:text-[#087F7A] transition-colors cursor-pointer">{isRtl ? 'صفحهٔ اصلی' : 'Home'}</button>
      <span className="text-slate-300">/</span>
      <button type="button" onClick={() => onNavigateLibrary()} className={`transition-colors cursor-pointer ${!selectedFamily ? 'font-bold text-slate-700 dark:text-slate-200' : 'hover:text-[#087F7A]'}`}>{isRtl ? 'کتابخانهٔ محصولات' : 'Product library'}</button>
      {selectedFamily && <>
        <span className="text-slate-300">/</span>
        <button type="button" onClick={() => onNavigateLibrary(selectedFamily.slug)} className={`transition-colors cursor-pointer ${selectedFamily && !selectedSubcategory ? 'font-bold text-slate-700 dark:text-slate-200' : 'hover:text-[#087F7A]'}`}>{isRtl ? selectedFamily.label.fa : selectedFamily.label.en}</button>
      </>}
      {selectedSubcategory && <>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-slate-700 dark:text-slate-200">{isRtl ? selectedSubcategory.label.fa : selectedSubcategory.label.en}</span>
      </>}
    </nav>
  );

  const filterRail = (
    <div className="space-y-5">
      {/* Category tree — every level stays visible (bim.com pattern) */}
      <section className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <span className="flex items-center gap-2 text-[13px] font-black text-slate-800 dark:text-white"><Layers className="h-4 w-4 text-[#087F7A]" />{isRtl ? 'دسته‌بندی‌ها' : 'Categories'}</span>
          {(selectedFamily || selectedSubcategory) && (
            <button type="button" onClick={() => onNavigateLibrary()} className="text-[10.5px] font-bold text-slate-400 hover:text-[#087F7A] cursor-pointer transition-colors">{isRtl ? 'همهٔ دسته‌ها' : 'All categories'}</button>
          )}
        </header>
        <div className="p-2">
          {l1Categories.map(family => {
            const Icon = categoryIcon(family.id);
            const isActiveFamily = selectedFamily?.id === family.id;
            const isExpanded = !!expandedFamilies[family.id];
            return (
              <div key={family.id} className="mb-0.5">
                <div className={`flex items-center rounded-xl transition-colors ${isActiveFamily && !selectedSubcategory ? 'bg-[#0FB9B1]/12' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
                  <button
                    type="button"
                    onClick={() => onNavigateLibrary(family.slug)}
                    className={`flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-start cursor-pointer lg:gap-2 lg:px-2.5 lg:py-2 ${isActiveFamily ? 'text-[#087F7A]' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 lg:h-4 lg:w-4 ${isActiveFamily ? 'text-[#087F7A]' : 'text-slate-400'}`} />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-black lg:text-[11.5px]">{isRtl ? family.label.fa : family.label.en}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={isRtl ? 'باز/بستن زیردسته‌ها' : 'Toggle subcategories'}
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedFamilies(previous => ({ ...previous, [family.id]: !isExpanded }))}
                    className="shrink-0 p-1.5 me-1 text-slate-400 hover:text-[#087F7A] cursor-pointer rounded-lg"
                  >
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isExpanded && (
                  <div className="ms-7 mt-0.5 space-y-0.5 border-s border-slate-100 ps-2 dark:border-slate-800 animate-fadeIn">
                    {childrenOf(family.id).map(child => {
                      const isActiveChild = selectedSubcategory?.id === child.id;
                      const count = countsBySubcategory[child.id] || 0;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => onNavigateLibrary(family.slug, child.slug)}
                          className={`flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-start text-[12.5px] transition-colors cursor-pointer lg:gap-2 lg:px-2.5 lg:py-1.5 lg:text-[11px] ${isActiveChild ? 'bg-[#087F7A]/10 font-black text-[#087F7A]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-700'}`}
                        >
                          <span className="min-w-0 flex-1 truncate">{isRtl ? child.label.fa : child.label.en}</span>
                          <span className="flex shrink-0 items-center gap-1">
                            {count > 0 && <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${isActiveChild ? 'bg-[#087F7A] text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>{count}</span>}
                            <FwdChevron className={`h-3 w-3 ${isActiveChild ? 'text-[#087F7A]' : 'text-slate-300'}`} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Value filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <span className="flex items-center gap-2 text-[13px] font-black text-slate-800 dark:text-white"><SlidersHorizontal className="h-4 w-4 text-[#087F7A]" />{isRtl ? 'فیلترها' : 'Filters'}</span>
          {activeFilterCount > 0 && (
            <button type="button" onClick={clearAllFilters} className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#087F7A] hover:underline cursor-pointer"><RotateCcw className="h-3 w-3" />{isRtl ? 'پاک‌کردن' : 'Clear'}</button>
          )}
        </header>
        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold text-slate-600 dark:text-slate-300">{isRtl ? 'جست‌وجو در نتایج' : 'Search results'}</span>
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.query}
                onChange={event => setFilters(previous => ({ ...previous, query: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 ps-9 pe-3 text-xs text-slate-800 outline-none focus:border-[#0FB9B1] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder={isRtl ? 'نام، برند یا ویژگی...' : 'Name, brand or property…'}
              />
            </div>
          </label>

          {allBrands.length > 1 && (
            <FilterGroup title={isRtl ? 'برند' : 'Brand'}>
              {allBrands.map(brand => (
                <CheckRow key={brand.id} label={isRtl ? brand.nameFa : brand.nameEn} checked={filters.brands.includes(brand.id)} onChange={() => setFilters(previous => ({ ...previous, brands: toggle(previous.brands, brand.id) }))} />
              ))}
            </FilterGroup>
          )}

          {allFormats.length > 0 && (
            <FilterGroup title={isRtl ? 'فرمت فایل' : 'File format'}>
              {allFormats.map(format => (
                <CheckRow key={format} label={format} mono checked={filters.formats.includes(format)} onChange={() => setFilters(previous => ({ ...previous, formats: toggle(previous.formats, format) }))} />
              ))}
            </FilterGroup>
          )}

          {allRevitVersions.length > 0 && (
            <FilterGroup title={isRtl ? 'نسخهٔ نرم‌افزار Revit' : 'Revit software version'}>
              {allRevitVersions.map(version => (
                <CheckRow key={version} label={`Revit ${version}`} mono checked={filters.revitVersions.includes(version)} onChange={() => setFilters(previous => ({ ...previous, revitVersions: toggle(previous.revitVersions, version) }))} />
              ))}
            </FilterGroup>
          )}

          {allLods.length > 0 && (
            <FilterGroup title={isRtl ? 'سطح جزئیات (LOD)' : 'Level of detail'}>
              {allLods.map(lod => (
                <CheckRow key={lod} label={lod} mono checked={filters.lods.includes(lod)} onChange={() => setFilters(previous => ({ ...previous, lods: toggle(previous.lods, lod) }))} />
              ))}
            </FilterGroup>
          )}

          <FilterGroup title={isRtl ? 'مبدأ تولید' : 'Origin'}>
            <CheckRow label={isRtl ? 'تولید ایران' : 'Made in Iran'} checked={filters.origins.includes('iran')} onChange={() => setFilters(previous => ({ ...previous, origins: toggle(previous.origins, 'iran') }))} />
            <CheckRow label={isRtl ? 'وارداتی' : 'Imported'} checked={filters.origins.includes('imported')} onChange={() => setFilters(previous => ({ ...previous, origins: toggle(previous.origins, 'imported') }))} />
          </FilterGroup>

          {allCertifications.length > 0 && (
            <FilterGroup title={isRtl ? 'گواهی' : 'Certification'}>
              {allCertifications.map(cert => (
                <CheckRow key={cert} label={cert} mono checked={filters.certifications.includes(cert)} onChange={() => setFilters(previous => ({ ...previous, certifications: toggle(previous.certifications, cert) }))} />
              ))}
            </FilterGroup>
          )}

          <FilterGroup title={isRtl ? 'محتوای محصول' : 'Product content'}>
            <CheckRow label={isRtl ? 'دارای دیتاشیت یا Cut-sheet' : 'Datasheet / cut-sheet available'} checked={filters.hasCutsheet === true} onChange={() => setFilters(previous => ({ ...previous, hasCutsheet: previous.hasCutsheet === true ? null : true }))} />
            <CheckRow label={isRtl ? 'دارای نمونهٔ فیزیکی' : 'Physical sample available'} checked={filters.hasSample === true} onChange={() => setFilters(previous => ({ ...previous, hasSample: previous.hasSample === true ? null : true }))} />
          </FilterGroup>

          {/* Specialist filters — current object values plus the richer main-branch presets. */}
          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            <h3 className="mb-2.5 flex items-center gap-1.5 text-[11.5px] font-black text-slate-700 dark:text-slate-200">
              <Sparkles className="h-3.5 w-3.5 text-[#B45309]" />
              {isRtl ? 'فیلترهای تخصصی این مسیر' : 'Specialist filters for this path'}
            </h3>
            {specFacets.length > 0 ? (
              <div className="space-y-3.5">
                {specFacets.map(facet => (
                  <label key={facet.key} className="block">
                    <span className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">{isRtl ? facet.label.fa : facet.label.en}</span>
                    <select
                      value={filters.specs[facet.key] || ''}
                      onChange={event => setFilters(previous => {
                        const specs = { ...previous.specs };
                        if (event.target.value) specs[facet.key] = event.target.value; else delete specs[facet.key];
                        return { ...previous, specs };
                      })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-[#0FB9B1] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                      <option value="">{isRtl ? 'همه' : 'All'}</option>
                      {facet.options.map(option => <option key={option.value} value={option.value}>{isRtl ? option.label.fa : option.label.en}</option>)}
                    </select>
                  </label>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 p-3 text-[10.5px] leading-5 text-slate-400 dark:border-slate-700">
                {isRtl
                  ? 'برای این مسیر هنوز مقدار ساختاریافته‌ای ثبت نشده است؛ با تکمیل دادهٔ برندها، فیلترهای تخصصی همین‌جا فعال می‌شوند.'
                  : 'No structured values are recorded for this path yet; specialist filters activate here as brand data is completed.'}
              </p>
            )}
            {specialistHints.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-[10px] font-bold text-slate-400">{isRtl ? 'فیلترهایی که در این مسیر خواهید داشت:' : 'Filters you will get on this path:'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {specialistHints.map(hint => (
                    <span key={hint.key} className="rounded-md bg-[#B45309]/8 px-2 py-1 text-[10px] font-bold text-[#B45309]/80">{isRtl ? hint.labelFa : hint.labelEn}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  if (categorySlug && !selectedFamily) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {breadcrumb}
        <div className="mt-6">
          <EmptyState
            icon={SearchX}
            title={isRtl ? 'دستهٔ درخواستی پیدا نشد' : 'Category not found'}
            description={isRtl ? 'مسیر این دسته در کتابخانهٔ فعلی ایران‌بیم‌هاب وجود ندارد.' : 'This category path is not available in the current IranBIMhub library.'}
            actionLabel={isRtl ? 'مشاهدهٔ کتابخانه' : 'Browse library'}
            onAction={() => onNavigateLibrary()}
          />
        </div>
      </div>
    );
  }

  const pageTitle = selectedSubcategory
    ? (isRtl ? selectedSubcategory.label.fa : selectedSubcategory.label.en)
    : selectedFamily
      ? (isRtl ? selectedFamily.label.fa : selectedFamily.label.en)
      : (isRtl ? 'همهٔ محصولات و آبجکت‌ها' : 'All products and BIM objects');

  const totalResults = filteredObjects.length + filteredCatalogProducts.length;

  // When a filtered/category path is empty, keep the user moving instead of
  // ending the journey. Prefer the same level-2 category, then its family,
  // then other available objects in the library. These are existing records,
  // never generated recommendations or fabricated products.
  const emptyRecommendations = useMemo(() => {
    const unique = (items: typeof mappedObjects) => {
      const seen = new Set<string>();
      return items.filter(item => !seen.has(item.object.id) && seen.add(item.object.id)).slice(0, 3);
    };
    if (selectedSubcategory) {
      const sameCategory = mappedObjects.filter(item => item.libraryCategoryId === selectedSubcategory.id);
      if (sameCategory.length) return { kind: 'same' as const, items: unique(sameCategory) };
    }
    if (selectedFamily) {
      const sameFamily = mappedObjects.filter(item => familyIdOfLibraryCategory(item.libraryCategoryId) === selectedFamily.id);
      if (sameFamily.length) return { kind: 'family' as const, items: unique(sameFamily) };
    }
    return { kind: 'library' as const, items: unique(mappedObjects) };
  }, [mappedObjects, selectedFamily, selectedSubcategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9">
      {breadcrumb}

      {/* Mobile filter bar */}
      <div className="mt-5 flex items-center justify-between gap-3 lg:hidden">
        <h1 className="text-base font-black text-slate-800 dark:text-white">{pageTitle}</h1>
        <button
          type="button"
          onClick={() => setFiltersDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#087F7A]" />
          {isRtl ? 'دسته‌ها و فیلترها' : 'Categories & filters'}
          {activeFilterCount > 0 && <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#087F7A] px-1 text-[9px] text-white">{activeFilterCount}</span>}
        </button>
      </div>

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="hidden lg:block lg:sticky lg:top-28">{filterRail}</aside>

        <main>
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="hidden text-lg font-black text-slate-800 dark:text-white lg:block">{pageTitle}</h1>
              <p className="mt-1 text-[11.5px] text-slate-500 dark:text-slate-400">
                {isRtl
                  ? `${totalResults} مورد${selectedFamily ? ' در این مسیر' : ' در کل کتابخانه'} — همهٔ دسته‌ها و فیلترها همین‌جا در دسترس است.`
                  : `${totalResults} item(s) ${selectedFamily ? 'on this path' : 'across the library'} — every category and filter stays on this screen.`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold text-slate-400">{isRtl ? 'مرتب‌سازی:' : 'Sort:'}</label>
              <select value={sortMode} onChange={event => setSortMode(event.target.value as SortMode)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-[#0FB9B1] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 cursor-pointer">
                <option value="default">{isRtl ? 'پیش‌فرض' : 'Default'}</option>
                <option value="title">{isRtl ? 'نام' : 'Name'}</option>
                <option value="lod">{isRtl ? 'سطح جزئیات (بیشترین)' : 'LOD (highest)'}</option>
              </select>
            </div>
          </header>

          {totalResults > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCatalogProducts.map(product => (
                <CatalogProductCard key={product.id} product={product} isRtl={isRtl} onClick={() => onSelectCatalogProduct(product)} />
              ))}
              {filteredObjects.map(({ object }) => {
                const path = legacyObjectLibraryPathLabels(object);
                return (
                  <div key={object.id} className="flex flex-col">
                    <span className="mb-1.5 block truncate px-1 text-[10px] font-bold text-slate-400" title={isRtl ? `${path.familyFa} › ${path.subcategoryFa}` : `${path.familyEn} › ${path.subcategoryEn}`}>
                      {isRtl ? `${path.familyFa} › ${path.subcategoryFa}` : `${path.familyEn} › ${path.subcategoryEn}`}
                    </span>
                    <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-3 transition-colors hover:border-[#0FB9B1]/40 dark:border-slate-800 dark:bg-slate-900">
                      <BIMObjectCard
                        object={object}
                        isSaved={savedObjects.includes(object.id)}
                        onToggleSave={() => onToggleSave(object.id)}
                        onClick={() => onSelectObject(object)}
                        onQuickDownload={format => onQuickDownload(object, format)}
                        onViewBrand={onViewBrand}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                icon={SearchX}
                title={isRtl ? 'محصولی مطابق این انتخاب یافت نشد' : 'No product matches this selection'}
                description={isRtl
                  ? 'مسیر یا فیلتر دیگری را امتحان کنید؛ اگر محصول خاصی مدنظرتان است، درخواستش را ثبت کنید تا برای ساخت آبجکت بررسی شود.'
                  : 'Try another path or filter — or request the product you need and we will review it for modeling.'}
                actionLabel={activeFilterCount > 0 ? (isRtl ? 'پاک‌کردن فیلترها' : 'Clear filters') : (isRtl ? 'مشاهدهٔ همهٔ محصولات' : 'Browse everything')}
                onAction={() => { if (activeFilterCount > 0) clearAllFilters(); else onNavigateLibrary(); }}
              />
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={onRequestObject}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F3D5E] px-5 py-3 text-xs font-black text-white transition-colors hover:bg-[#0B2E47] cursor-pointer"
                >
                  <Boxes className="h-4 w-4" />
                  {isRtl ? 'ثبت درخواست آبجکت جدید' : 'Request a new object'}
                </button>
              </div>
              {emptyRecommendations.items.length > 0 && (
                <section className="mt-10 border-t border-slate-100 pt-7 dark:border-slate-800">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <h2 className="text-base font-black text-slate-800 dark:text-white">
                        {emptyRecommendations.kind === 'same'
                          ? (isRtl ? 'آبجکت‌های دیگر در همین دسته' : 'Other objects in this category')
                          : emptyRecommendations.kind === 'family'
                            ? (isRtl ? 'آبجکت‌های دیگر در همین خانواده' : 'Other objects in this product family')
                            : (isRtl ? 'پیشنهادهای دیگر در کتابخانه' : 'Other library suggestions')}
                      </h2>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                        {isRtl ? 'این موارد از رکوردهای موجود کتابخانه انتخاب شده‌اند.' : 'These suggestions are drawn from existing library records.'}
                      </p>
                    </div>
                    <button type="button" onClick={() => onNavigateLibrary()} className="text-xs font-black text-[#087F7A] hover:underline cursor-pointer">
                      {isRtl ? 'مشاهدهٔ همهٔ محصولات' : 'Browse all products'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {emptyRecommendations.items.map(({ object }) => (
                      <div key={`suggestion-${object.id}`} className="rounded-2xl border border-gray-100 bg-white p-3 transition-colors hover:border-[#0FB9B1]/40 dark:border-slate-800 dark:bg-slate-900">
                        <BIMObjectCard
                          object={object}
                          isSaved={savedObjects.includes(object.id)}
                          onToggleSave={() => onToggleSave(object.id)}
                          onClick={() => onSelectObject(object)}
                          onQuickDownload={format => onQuickDownload(object, format)}
                          onViewBrand={onViewBrand}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filters drawer */}
      {filtersDrawerOpen && (
        <div className="fixed inset-0 z-[70] flex lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setFiltersDrawerOpen(false)} />
          <div className={`absolute inset-y-0 ${isRtl ? 'right-0' : 'left-0'} flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-2xl dark:bg-slate-900`}>
            <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 dark:border-slate-800">
              <span className="text-sm font-black text-slate-800 dark:text-white">{isRtl ? 'دسته‌ها و فیلترها' : 'Categories & filters'}</span>
              <button type="button" onClick={() => setFiltersDrawerOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4">{filterRail}</div>
            <footer className="border-t border-slate-100 p-4 dark:border-slate-800">
              <button type="button" onClick={() => setFiltersDrawerOpen(false)} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#087F7A] py-3 text-xs font-black text-white cursor-pointer">
                {isRtl ? 'مشاهدهٔ نتایج' : 'View results'}
                <BackIcon className="hidden" />
                <Arrow className="h-4 w-4" />
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */

const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="mb-2 text-[11px] font-black text-slate-600 dark:text-slate-300">{title}</h3>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const CheckRow: React.FC<{ label: string; checked: boolean; onChange: () => void; mono?: boolean }> = ({ label, checked, onChange, mono }) => (
  <label className="flex cursor-pointer items-center gap-2.5 text-[11.5px] text-slate-600 dark:text-slate-300">
    <input type="checkbox" checked={checked} onChange={onChange} className="h-3.5 w-3.5 accent-[#087F7A]" />
    <span className={mono ? 'font-mono' : ''}>{label}</span>
  </label>
);

const CatalogProductCard: React.FC<{ product: Product; isRtl: boolean; onClick: () => void }> = ({ product, isRtl, onClick }) => {
  const { assessment, level } = useCatalogDataLevel(product);
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  return (
    <button type="button" onClick={onClick} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-start transition-all hover:-translate-y-0.5 hover:border-[#0FB9B1]/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 cursor-pointer">
      <p className="text-[11px] font-bold text-[#087F7A]">{isRtl ? product.manufacturer.name.fa : product.manufacturer.name.en}</p>
      <h3 className="mt-1.5 text-sm font-black leading-6 text-slate-800 dark:text-white">{isRtl ? product.title.fa : product.title.en}</h3>
      <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500 dark:text-slate-400">{isRtl ? product.shortDescription.fa : product.shortDescription.en}</p>
      <div className="mt-4">
        <MetadataChips
          items={[
            { text: `${isRtl ? level.titleFa : level.titleEn} · ${assessment.completionPercent}٪`, tone: 'teal' },
            { text: isRtl ? BIM_AVAILABILITY_STATUSES[product.bimAvailability] : product.bimAvailability.replaceAll('_', ' '), tone: 'slate' },
            ...product.bimFiles.slice(0, 2).map(file => ({ text: file.format, tone: 'navy' as const })),
          ]}
        />
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-[#087F7A]">
        {isRtl ? 'مشاهدهٔ متادیتای کامل' : 'View full metadata'}
        <Arrow className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
      </span>
    </button>
  );
};
