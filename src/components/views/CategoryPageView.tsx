import React, { useState, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { CATEGORIES, BIM_OBJECTS, MANUFACTURERS } from '../../data';
import { BIMObject, FilterState } from '../../types';
import { CategoryFilterSidebar } from '../CategoryFilterSidebar';
import { BIMObjectCard } from '../BIMObjectCard';
import { Breadcrumb, BreadcrumbItem } from '../Breadcrumb';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Layers, 
  HelpCircle, 
  FileCheck2,
  Grid,
  List,
  Download,
  Heart,
  ChevronDown,
  Building2
} from 'lucide-react';

interface CategoryPageViewProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onSelectObject: (obj: BIMObject) => void;
  savedObjects: string[];
  onToggleSave: (id: string) => void;
  onQuickDownload: (obj: BIMObject, format: string) => void;
  onViewBrand?: (mfgId: string) => void;
}

export const CategoryPageView: React.FC<CategoryPageViewProps> = ({
  filterState,
  onFilterChange,
  onSelectObject,
  savedObjects,
  onToggleSave,
  onQuickDownload,
  onViewBrand
}) => {
  const { language, t, isRtl, formatNumber } = useLanguage();
  const [sortBy, setSortBy] = useState<'newest' | 'downloads' | 'alpha' | 'rating' | 'name_desc'>('newest');
  const [showFilters, setShowFilters] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth > 768 : false;
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [customObjectsVersion, setCustomObjectsVersion] = useState(0);

  React.useEffect(() => {
    const handleSync = () => setCustomObjectsVersion(v => v + 1);
    window.addEventListener('iranbimhub_custom_objects_updated', handleSync);
    window.addEventListener('iranbimhub_brand_profile_updated', handleSync);
    return () => {
      window.removeEventListener('iranbimhub_custom_objects_updated', handleSync);
      window.removeEventListener('iranbimhub_brand_profile_updated', handleSync);
    };
  }, []);

  // Dynamic Combined objects list
  const combinedObjects = useMemo(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_custom_objects_v2');
      const custom = saved ? JSON.parse(saved) : [];
      const map = new Map<string, BIMObject>();
      BIM_OBJECTS.forEach(obj => { if (obj && obj.id) map.set(obj.id, obj); });
      custom.forEach((obj: any) => {
        const isPublicObject = obj?.isPublic === true || obj?.status === 'Published' || obj?.evaluationStatus === 'approved';
        if (obj && obj.id && isPublicObject) map.set(obj.id, obj);
      });
      return Array.from(map.values());
    } catch {
      return BIM_OBJECTS;
    }
  }, [customObjectsVersion]);

  // Advanced search & filter logic
  const filteredObjects = useMemo(() => {
    return combinedObjects.filter(obj => {
      
      // 1. Search Query filter (checks title, description, tags, manufacturer)
      if (filterState.search) {
        const query = filterState.search.toLowerCase().trim();
        const matchesTitle = obj.titleFa.toLowerCase().includes(query) || obj.titleEn.toLowerCase().includes(query);
        const matchesDesc = obj.descriptionFa.toLowerCase().includes(query) || obj.descriptionEn.toLowerCase().includes(query);
        const matchesTags = obj.tagsFa.some(t => t.toLowerCase().includes(query)) || obj.tagsEn.some(t => t.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 2. Main Category Filter
      if (filterState.category && obj.category !== filterState.category) {
        return false;
      }

      // 3. Subcategory Filter
      if (filterState.subcategory && obj.subcategory !== filterState.subcategory) {
        return false;
      }

      // 4. File Formats filter (Matches ANY selected format if array is populated)
      if (filterState.formats.length > 0) {
        const hasMatchingFormat = obj.formats.some(fmt => filterState.formats.includes(fmt));
        if (!hasMatchingFormat) return false;
      }

      // 5. Manufacturers filter
      if (filterState.manufacturers.length > 0) {
        if (!filterState.manufacturers.includes(obj.manufacturerId)) {
          return false;
        }
      }

      // 6. Origin filters
      if (filterState.isIranBrand !== null) {
        if (filterState.isIranBrand && obj.isImported) return false;
        if (!filterState.isIranBrand && !obj.isImported) return false;
      }

      // 7. Dynamic Category Specific filters
      if (filterState.specifics && Object.keys(filterState.specifics).length > 0) {
        for (const [key, value] of Object.entries(filterState.specifics)) {
          if (value) {
            // Check if object specs has this key with this exact value
            if (obj.specs[key] !== value) {
              return false;
            }
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'downloads') {
        return b.downloadCount - a.downloadCount;
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'alpha') {
        const titleA = isRtl ? a.titleFa : a.titleEn;
        const titleB = isRtl ? b.titleFa : b.titleEn;
        return titleA.localeCompare(titleB);
      } else if (sortBy === 'name_desc') {
        const titleA = isRtl ? a.titleFa : a.titleEn;
        const titleB = isRtl ? b.titleFa : b.titleEn;
        return titleB.localeCompare(titleA);
      } else {
        // 'newest' (ID-based simulated timeline descending)
        return b.id.localeCompare(a.id);
      }
    });
  }, [combinedObjects, filterState, sortBy, isRtl]);

  const activeCategoryObject = useMemo(() => {
    return CATEGORIES.find(c => c.id === filterState.category);
  }, [filterState.category]);

  const activeSubcategoryObject = useMemo(() => {
    if (!activeCategoryObject || !filterState.subcategory) return null;
    return activeCategoryObject.subcategories.find(s => s.id === filterState.subcategory);
  }, [activeCategoryObject, filterState.subcategory]);

  const stats = useMemo(() => {
    const total = filteredObjects.length;
    const lods: Record<string, number> = {};
    filteredObjects.forEach(obj => {
      lods[obj.lod] = (lods[obj.lod] || 0) + 1;
    });
    const iranianCount = filteredObjects.filter(obj => !obj.isImported).length;
    return { total, lods, iranianCount };
  }, [filteredObjects]);

  const handleClearAllFilters = () => {
    onFilterChange({
      category: null,
      subcategory: null,
      search: '',
      formats: [],
      revitVersions: [],
      manufacturers: [],
      priceTypes: [],
      certifications: [],
      lods: [],
      isImported: null,
      hasCutsheet: null,
      hasSample: null,
      specifics: {}
    });
  };

  const handleRemoveActiveFilterTag = (type: keyof FilterState, value?: string) => {
    if (type === 'category') {
      onFilterChange({ category: null, subcategory: null, specifics: {} });
    } else if (type === 'subcategory') {
      onFilterChange({ subcategory: null });
    } else if (type === 'search') {
      onFilterChange({ search: '' });
    } else if (type === 'isImported') {
      onFilterChange({ isImported: null });
    } else if (type === 'formats') {
      onFilterChange({ formats: filterState.formats.filter(f => f !== value) });
    } else if (type === 'manufacturers') {
      onFilterChange({ manufacturers: filterState.manufacturers.filter(m => m !== value) });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Wayfinding Breadcrumbs Trail */}
      <div className="sticky top-[64px] z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md py-2.5 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-100 dark:border-gray-800/80 mb-4 flex items-center flex-wrap gap-1">
        <Breadcrumb
          className="!bg-transparent !border-none !p-0"
          items={[
            { label: isRtl ? 'صفحه اصلی' : 'Home', onClick: () => onFilterChange({ category: null, subcategory: null, search: '' }) },
            { label: isRtl ? 'دسته‌بندی محصولات' : 'Product Categories', onClick: () => onFilterChange({ subcategory: null, search: '' }) },
            ...(activeCategoryObject ? [{ label: isRtl ? activeCategoryObject.nameFa : activeCategoryObject.nameEn, onClick: () => onFilterChange({ subcategory: null }) }] : []),
            ...(activeSubcategoryObject ? [{ label: isRtl ? activeSubcategoryObject.nameFa : activeSubcategoryObject.nameEn }] : [])
          ]}
        />
      </div>

      {/* Search Header Info Banner */}
      <div className="bg-slate-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 mt-0.5">
            {filterState.search ? (
              <span>{isRtl ? 'نتایج جستجو برای' : 'Search Results for'}: "{filterState.search}"</span>
            ) : activeCategoryObject ? (
              <span>{isRtl ? activeCategoryObject.nameFa : activeCategoryObject.nameEn}</span>
            ) : (
              <span>{isRtl ? 'کل بازار آبجکت‌های بیم ایران' : 'Full IranBIMhub Directory'}</span>
            )}
          </h1>
          {activeSubcategoryObject && (
            <span className="text-xs text-[#26B6B6] font-bold mt-1 block">
              → {isRtl ? activeSubcategoryObject.nameFa : activeSubcategoryObject.nameEn}
            </span>
          )}
        </div>

        {/* Toolbar Controls Row: Grid/List Toggle + Sorting Options + Filters */}
        <div className="flex flex-row items-center justify-between md:justify-end gap-2.5 text-xs text-gray-500 shrink-0 w-full md:w-auto mt-2 md:mt-0">
          
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-2 py-1.5 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#26B6B6]" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-gray-750 dark:text-gray-200 cursor-pointer text-xs p-0.5"
            >
              <option value="newest" className="dark:bg-gray-900 dark:text-gray-200">{isRtl ? 'جدیدترین' : 'Newest'}</option>
              <option value="downloads" className="dark:bg-gray-900 dark:text-gray-200">{isRtl ? 'بیشترین دانلود' : 'Most Downloaded'}</option>
              <option value="rating" className="dark:bg-gray-900 dark:text-gray-200">{isRtl ? 'بالاترین امتیاز' : 'Highest Rated'}</option>
              <option value="alpha" className="dark:bg-gray-900 dark:text-gray-200">{isRtl ? 'نام (الف تا ی)' : 'Name (A-Z)'}</option>
              <option value="name_desc" className="dark:bg-gray-900 dark:text-gray-200">{isRtl ? 'نام (ی تا الف)' : 'Name (Z-A)'}</option>
            </select>
          </div>

          {/* Grid/List layout toggle */}
          <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shrink-0 p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all duration-200 cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-[#26B6B6] text-white shadow-2xs font-black' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-[#26B6B6] dark:hover:text-[#26B6B6] hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              title={isRtl ? 'نمایش شبکه‌ای' : 'Grid View'}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all duration-200 cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-[#26B6B6] text-white shadow-2xs font-black' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-[#26B6B6] dark:hover:text-[#26B6B6] hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              title={isRtl ? 'نمایش لیستی' : 'List View'}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 text-[#26B6B6] hover:bg-[#26B6B6]/10 border border-[#26B6B6]/20 px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer font-black shadow-2xs transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isRtl ? 'فیلترها' : 'Filters'}</span>
          </button>
        </div>
      </div>

      {/* Main layout with sidebar and product grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start relative">
        
        {/* Left Side: Filter Sidebar on Desktop (collapsible) */}
        <div className={`hidden md:block md:col-span-1 ${showFilters ? 'block' : 'hidden'}`}>
          <CategoryFilterSidebar
            filterState={filterState}
            onFilterChange={onFilterChange}
            onClearFilters={handleClearAllFilters}
            activeCategory={filterState.category}
            resultsCount={filteredObjects.length}
          />
        </div>

        {/* Mobile Filter Drawer (Slide-over with dark backdrop) */}
        {showFilters && (
          <div className="md:hidden fixed inset-0 z-50 flex justify-end animate-fadeIn">
            {/* Backdrop */}
            <div 
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />
            {/* Drawer container */}
            <div className="relative w-full max-w-xs h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-10 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4">
                <CategoryFilterSidebar
                  filterState={filterState}
                  onFilterChange={onFilterChange}
                  onClearFilters={handleClearAllFilters}
                  activeCategory={filterState.category}
                  onClose={() => setShowFilters(false)}
                  resultsCount={filteredObjects.length}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Grid of results */}
        <div className={`${showFilters ? 'md:col-span-3' : 'md:col-span-4'} space-y-6 w-full`}>
          
          {/* Active filter tags list */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{isRtl ? 'فیلترهای فعال:' : 'Active Filters:'}</span>
            
            {filterState.search && (
              <span className="bg-[#26B6B6]/5 text-[#26B6B6] border border-[#26B6B6]/10 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5">
                <span>"{filterState.search}"</span>
                <button onClick={() => handleRemoveActiveFilterTag('search')} className="hover:text-rose-500 font-sans cursor-pointer">×</button>
              </span>
            )}

            {filterState.category && (
              <span className="bg-[#26B6B6]/5 text-[#26B6B6] border border-[#26B6B6]/10 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5">
                <span>{activeCategoryObject ? (isRtl ? activeCategoryObject.nameFa : activeCategoryObject.nameEn) : ''}</span>
                <button onClick={() => handleRemoveActiveFilterTag('category')} className="hover:text-rose-500 font-sans cursor-pointer">×</button>
              </span>
            )}

            {filterState.subcategory && (
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5">
                <span>{activeSubcategoryObject ? (isRtl ? activeSubcategoryObject.nameFa : activeSubcategoryObject.nameEn) : ''}</span>
                <button onClick={() => handleRemoveActiveFilterTag('subcategory')} className="hover:text-rose-500 font-sans cursor-pointer">×</button>
              </span>
            )}

            {filterState.isImported !== null && (
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5">
                <span>{filterState.isImported ? t('originImported') : t('originIran')}</span>
                <button onClick={() => handleRemoveActiveFilterTag('isImported')} className="hover:text-rose-500 font-sans cursor-pointer">×</button>
              </span>
            )}

            {filterState.formats.map(fmt => {
              let displayLabel = fmt;
              if (fmt === 'Catalog (PDF)') {
                displayLabel = isRtl ? 'کاتالوگ (PDF)' : 'Catalog (PDF)';
              } else if (fmt === 'IFC') {
                displayLabel = isRtl ? 'استاندارد IFC' : 'IFC Standard';
              }
              return (
                <span key={fmt} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 font-mono">
                  <span>{displayLabel}</span>
                  <button onClick={() => handleRemoveActiveFilterTag('formats', fmt)} className="hover:text-rose-500 font-sans cursor-pointer">×</button>
                </span>
              );
            })}

            {/* Clear All Link */}
            {(filterState.search || filterState.category || filterState.subcategory || filterState.formats.length > 0 || filterState.manufacturers.length > 0 || filterState.isImported !== null) && (
              <button 
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-rose-500 hover:underline ms-2 cursor-pointer"
              >
                {t('clearAll')}
              </button>
            )}
          </div>

          {/* Real-time Dynamic Summary Metrics */}
          {filteredObjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#464E56]/5 dark:bg-gray-800/10 rounded-2xl p-4 border border-gray-150 dark:border-gray-800 text-start animate-fadeIn">
              
              {/* Stat 1: Match Count */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-[#26B6B6]/10 text-[#26B6B6] rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block uppercase">{isRtl ? 'تعداد کل آبجکت‌ها' : 'Total Objects'}</span>
                  <span className="text-xs font-black text-gray-850 dark:text-white">
                    {isRtl 
                      ? `${formatNumber(stats.total)} آبجکت بیم منطبق` 
                      : `${stats.total} BIM Families`
                    }
                  </span>
                </div>
              </div>

              {/* Stat 2: LOD Breakdown */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-[#26B6B6]/10 text-[#26B6B6] rounded-lg">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block uppercase">{isRtl ? 'تفکیک سطح توسعه (LOD)' : 'LOD Breakdown'}</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {Object.entries(stats.lods).map(([lod, count]) => (
                      <span key={lod} className="inline-block bg-gray-100 dark:bg-gray-850 px-1 py-0.2 rounded font-mono text-[9px] text-gray-700 dark:text-gray-300">
                        {lod}: {isRtl ? formatNumber(count) : count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stat 3: Domestic Manufacturing */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-[#26B6B6]/10 text-[#26B6B6] rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block uppercase">{isRtl ? 'تولید ملی ایران' : 'Iran-made content'}</span>
                  <span className="text-xs font-black text-[#26B6B6]">
                    {isRtl 
                      ? `${formatNumber(stats.iranianCount)} آبجکت تولید ملی (ایران)` 
                      : `${stats.iranianCount} Domestic products`
                    }
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* Object Cards list */}
          {filteredObjects.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="space-y-4 max-w-md mx-auto">
                <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {isRtl ? 'هیچ موردی یافت نشد' : 'No items match your exact filter parameters'}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto leading-relaxed">
                    {isRtl 
                      ? 'امتحان کنید: کلمات کلیدی عام‌تر به کار ببرید یا برخی از گزینه‌های فیلترها را غیرفعال کنید.' 
                      : 'Try removing specific filter tags, choosing a broader category, or broadening your keyword query.'
                    }
                  </p>
                </div>

                <button
                  onClick={handleClearAllFilters}
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  {t('clearAll')}
                </button>
              </div>

              {/* Elegant Curated Suggestions Shelf to prevent layout imbalance */}
              <div className="pt-8 border-t border-gray-100 dark:border-gray-850 space-y-4">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 text-start">
                  {isRtl ? 'آبجکت‌های پیشنهادی بر اساس تخصص شما:' : 'Recommended BIM Models for You:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
                  {BIM_OBJECTS.slice(0, 3).map(obj => (
                    <BIMObjectCard
                      key={obj.id}
                      object={obj}
                      isSaved={savedObjects.includes(obj.id)}
                      onToggleSave={() => onToggleSave(obj.id)}
                      onClick={() => onSelectObject(obj)}
                      onQuickDownload={(fmt) => onQuickDownload(obj, fmt)}
                      onViewBrand={onViewBrand}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {filteredObjects.map(obj => (
                <BIMObjectCard
                  key={obj.id}
                  object={obj}
                  isSaved={savedObjects.includes(obj.id)}
                  onToggleSave={() => onToggleSave(obj.id)}
                  onClick={() => onSelectObject(obj)}
                  onQuickDownload={(fmt) => onQuickDownload(obj, fmt)}
                  onViewBrand={onViewBrand}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {filteredObjects.map(obj => {
                const manufacturer = MANUFACTURERS.find(m => m.id === obj.manufacturerId);
                const mName = manufacturer ? (isRtl ? manufacturer.nameFa : manufacturer.nameEn) : '';
                const title = isRtl ? obj.titleFa : obj.titleEn;
                const isSaved = savedObjects.includes(obj.id);
                return (
                  <div 
                    key={obj.id} 
                    className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow group relative text-start items-stretch"
                  >
                    {/* Left/Start side: Image thumbnail */}
                    <div 
                      className="w-full sm:w-44 h-32 sm:h-auto bg-gray-50 dark:bg-gray-850 rounded-lg overflow-hidden shrink-0 cursor-pointer relative"
                      onClick={() => onSelectObject(obj)}
                    >
                      <img 
                        src={obj.imageUrl} 
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 animate-fadeIn"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 start-2 bg-[#464E56]/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-medium">
                        {obj.lod}
                      </span>
                      <span className="absolute bottom-2 start-2 bg-white/90 text-[8px] text-[#464E56] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                        {obj.isImported ? t('originImported') : t('originIran')}
                      </span>
                    </div>

                    {/* Central section: Titles, Manufacturers, metadata */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                          <span 
                            onClick={() => {
                              if (onViewBrand) onViewBrand(obj.manufacturerId);
                            }}
                            className={onViewBrand ? 'hover:text-[#26B6B6] cursor-pointer transition-colors hover:underline' : ''}
                          >
                            {mName}
                          </span>
                          {manufacturer?.verified && (
                            <span className="text-[#26B6B6] text-[9px] bg-[#26B6B6]/5 px-1 py-0.2 rounded">
                              ✓ {isRtl ? 'تاییدشده' : 'VERIFIED'}
                            </span>
                          )}
                        </div>
                        <h3 
                          className="text-sm font-extrabold text-gray-850 dark:text-white hover:text-[#26B6B6] transition-colors cursor-pointer line-clamp-1"
                          onClick={() => onSelectObject(obj)}
                        >
                          {title}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed font-light">
                          {isRtl ? obj.descriptionFa : obj.descriptionEn}
                        </p>
                      </div>

                      {/* Formats row */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {obj.formats.map(format => (
                          <span 
                            key={format} 
                            className="text-[9px] font-mono text-gray-500 bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded"
                          >
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right/End section: Pricing, quick downloads, bookmark */}
                    <div className="flex sm:flex-col justify-between items-end shrink-0 sm:border-s border-gray-100 dark:border-gray-800 sm:ps-4 gap-4 min-w-[125px]">
                      {/* Price/Access type label removed */}

                      {/* Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Bookmark Button */}
                        <button
                          onClick={() => onToggleSave(obj.id)}
                          className={`p-2 rounded-full border transition-all cursor-pointer ${
                            isSaved 
                              ? 'bg-rose-50 text-rose-500 border-rose-100 shadow-sm' 
                              : 'bg-white border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200'
                          }`}
                          title={t('favorites')}
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>

                        {/* Quick DL Dropdown wrapper */}
                        <ListQuickDownloadDropdown
                          object={obj}
                          onQuickDownload={onQuickDownload}
                          isRtl={isRtl}
                        />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

const ListQuickDownloadDropdown: React.FC<{
  object: BIMObject;
  onQuickDownload: (obj: BIMObject, format: string) => void;
  isRtl: boolean;
}> = ({ object, onQuickDownload, isRtl }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold rounded-md shadow-xs transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isRtl ? 'دانلود' : 'DL'}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div 
          className={`absolute bottom-full mb-1 ${isRtl ? 'left-0' : 'right-0'} bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 min-w-[120px] z-20 text-xs text-start`}
          onClick={(e) => e.stopPropagation()}
        >
          {object.formats.map(format => (
            <button
              key={format}
              onClick={() => {
                onQuickDownload(object, format);
                setOpen(false);
              }}
              className="w-full text-start px-3 py-1.5 hover:bg-gray-50 text-[#464E56] font-mono hover:text-[#26B6B6] transition-colors flex justify-between items-center cursor-pointer"
            >
              <span>{format}</span>
              <Download className="w-3 h-3 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
