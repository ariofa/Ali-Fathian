import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { CATEGORIES, MANUFACTURERS } from '../data';
import { FilterState } from '../types';
import { 
  X, 
  ChevronDown, 
  Settings2,
  FileCode,
  Check,
  Building,
  Cpu,
  BadgePercent,
  Search,
  Filter
} from 'lucide-react';

interface CategoryFilterSidebarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onClearFilters: () => void;
  activeCategory: string | null;
  onClose?: () => void;
  resultsCount?: number;
}

const SUPPORTED_FORMATS = [
  'Revit', 'ArchiCAD', 'SketchUp', 'IFC', 'Catalog (PDF)', 'AutoCAD'
];

const REVIT_VERSIONS = ['2022', '2023', '2024', '2025', '2026'];

const LOD_LEVELS = ['LOD 100', 'LOD 200', 'LOD 300', 'LOD 350', 'LOD 400'];

const CERTIFICATIONS = ['INSO', 'ISO 9001', 'CE', 'BHRC'];

export const CategoryFilterSidebar: React.FC<CategoryFilterSidebarProps> = ({
  filterState,
  onFilterChange,
  onClearFilters,
  activeCategory,
  onClose,
  resultsCount = 0
}) => {
  const { language, t, isRtl } = useLanguage();

  const [categoryNavExpanded, setCategoryNavExpanded] = useState(true);
  const [specificFiltersExpanded, setSpecificFiltersExpanded] = useState(true);
  const [drillDownCategoryId, setDrillDownCategoryId] = useState<string | null>(activeCategory);

  React.useEffect(() => {
    setDrillDownCategoryId(activeCategory);
  }, [activeCategory]);

  const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory);

  // Search state for manufacturer filter
  const [mfgSearchQuery, setMfgSearchQuery] = useState('');

  // Collapse/Expand state for filter groups
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    formats: false,
    manufacturers: false,
    revitVersions: true,
    lods: true,
    certifications: true
  });

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormatToggle = (format: string) => {
    const isChecked = filterState.formats.includes(format);
    const newFormats = isChecked
      ? filterState.formats.filter(f => f !== format)
      : [...filterState.formats, format];
    onFilterChange({ formats: newFormats });
  };

  const handleRevitToggle = (ver: string) => {
    const isChecked = filterState.revitVersions.includes(ver);
    const newVers = isChecked
      ? filterState.revitVersions.filter(v => v !== ver)
      : [...filterState.revitVersions, ver];
    onFilterChange({ revitVersions: newVers });
  };

  const handleLodToggle = (lod: string) => {
    const isChecked = filterState.lods.includes(lod);
    const newLods = isChecked
      ? filterState.lods.filter(l => l !== lod)
      : [...filterState.lods, lod];
    onFilterChange({ lods: newLods });
  };

  const handleCertToggle = (cert: string) => {
    const isChecked = filterState.certifications.includes(cert);
    const newCerts = isChecked
      ? filterState.certifications.filter(c => c !== cert)
      : [...filterState.certifications, cert];
    onFilterChange({ certifications: newCerts });
  };

  const handleMfgToggle = (mfgId: string) => {
    const isChecked = filterState.manufacturers.includes(mfgId);
    const newMfg = isChecked
      ? filterState.manufacturers.filter(m => m !== mfgId)
      : [...filterState.manufacturers, mfgId];
    onFilterChange({ manufacturers: newMfg });
  };

  const handleSpecificChange = (filterId: string, val: string) => {
    const updatedSpecifics = { ...filterState.specifics };
    if (val === '') {
      delete updatedSpecifics[filterId];
    } else {
      updatedSpecifics[filterId] = val;
    }
    onFilterChange({ specifics: updatedSpecifics });
  };

  const filteredMfgList = MANUFACTURERS.filter(mfg => {
    const query = mfgSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return (isRtl ? mfg.nameFa : mfg.nameEn).toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      {/* CARD 1: Categories Card (دسته‌بندی‌ها) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 p-5 space-y-4 shadow-2xs text-gray-800 dark:text-gray-100">
        <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-100 text-xs uppercase tracking-wider">
            <span className="w-1.5 h-3.5 bg-[#26B6B6] rounded-xs inline-block" />
            <span>{isRtl ? 'دسته‌بندی‌های BIM' : 'BIM Categories'}</span>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              title="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {/* MOBILE VIEW: Drill-down panel-swap navigation (hidden on desktop md) */}
          <div className="md:hidden space-y-2.5">
            {drillDownCategoryId ? (
              (() => {
                const cat = CATEGORIES.find(c => c.id === drillDownCategoryId);
                if (!cat) return null;
                return (
                  <div className="space-y-2 animate-fadeIn text-start">
                    {/* Back control */}
                    <button
                      onClick={() => {
                        setDrillDownCategoryId(null);
                        onFilterChange({ category: null, subcategory: null, specifics: {} });
                      }}
                      className="flex items-center gap-1 text-[11px] font-extrabold text-[#26B6B6] hover:underline cursor-pointer pb-2 border-b border-gray-150 dark:border-gray-800/60 w-full"
                    >
                      <span>{isRtl ? '‹ بازگشت به دسته‌بندی‌های اصلی' : '‹ Back to all categories'}</span>
                    </button>
                    
                    {/* Current Category Title */}
                    <div className="px-1 py-1.5 text-xs font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#26B6B6]" />
                      <span>{isRtl ? cat.nameFa : cat.nameEn}</span>
                    </div>

                    {/* All in this category link */}
                    <button
                      onClick={() => {
                        onFilterChange({ category: cat.id, subcategory: null, specifics: {} });
                      }}
                      className={`w-full text-start py-1.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        !filterState.subcategory
                          ? 'bg-[#26B6B6] text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/55 dark:hover:bg-gray-800/40'
                      }`}
                    >
                      {isRtl ? `همه محصولات ${cat.nameFa}` : `All ${cat.nameEn}`}
                    </button>

                    {/* Subcategories */}
                    <div className="space-y-1 pl-1 pr-1">
                      {cat.subcategories.map(sub => {
                        const isSelected = filterState.subcategory === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onFilterChange({ category: cat.id, subcategory: sub.id });
                            }}
                            className={`w-full text-start py-1.5 px-3 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#26B6B6]/10 text-[#26B6B6] border border-[#26B6B6]/20'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/55 dark:hover:bg-gray-800/40'
                            }`}
                          >
                            {isRtl ? sub.nameFa : sub.nameEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="space-y-1 text-xs text-start">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setDrillDownCategoryId(cat.id);
                      onFilterChange({ category: cat.id, subcategory: null, specifics: {} });
                    }}
                    className="w-full text-start px-2.5 py-2 rounded-md font-semibold text-gray-750 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-all flex justify-between items-center cursor-pointer"
                  >
                    <span>{isRtl ? cat.nameFa : cat.nameEn}</span>
                    <ChevronDown className="w-3.5 h-3.5 rotate-270 rtl:rotate-90 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESKTOP VIEW: Collapsible Category Accordion Tree (hidden on mobile md max) */}
          <div className="hidden md:block space-y-1 text-xs text-start">
            {CATEGORIES.map(cat => {
              const isCatSelected = filterState.category === cat.id;
              return (
                <div key={cat.id} className="space-y-0.5">
                  <button
                    onClick={() => {
                      const newCat = isCatSelected ? null : cat.id;
                      onFilterChange({ category: newCat, subcategory: null, specifics: {} });
                    }}
                    className={`w-full text-start px-2.5 py-1.5 rounded-md font-semibold transition-all flex justify-between items-center cursor-pointer ${
                      isCatSelected
                        ? 'bg-[#26B6B6]/10 text-[#26B6B6] font-black'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/40'
                    }`}
                  >
                    <span>{isRtl ? cat.nameFa : cat.nameEn}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCatSelected ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Desktop Subcategories Accordion */}
                  {isCatSelected && (
                    <div className="mt-1 pl-3 pr-3 border-s border-[#26B6B6]/30 space-y-1">
                      {cat.subcategories.map(sub => {
                        const isSubSelected = filterState.subcategory === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              const newSub = isSubSelected ? null : sub.id;
                              onFilterChange({ subcategory: newSub });
                            }}
                            className={`w-full text-start py-1 px-2.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                              isSubSelected
                                ? 'text-[#26B6B6] bg-[#26B6B6]/5 font-black'
                                : 'text-gray-500 dark:text-gray-400 hover:text-[#26B6B6]'
                            }`}
                          >
                            • {isRtl ? sub.nameFa : sub.nameEn}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CARD 2: Filters Card (سایر فیلترها) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 p-5 space-y-5 shadow-2xs text-gray-800 dark:text-gray-100">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-100 text-sm">
            <Settings2 className="w-5 h-5 text-[#26B6B6]" />
            <span>{t('filters')}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClearFilters}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer"
            >
              {t('clearAll')}
            </button>
            {onClose && !filterState.category && (
              <button 
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                title="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Results Indicator */}
        <div className="bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 border border-[#26B6B6]/20 dark:border-[#26B6B6]/30 rounded-xl p-3 flex justify-between items-center text-[11px] transition-all">
          <span className="text-gray-500 dark:text-gray-300 font-medium">
            {isRtl ? 'یافته‌ها با فیلترهای کنونی' : 'Results with active filters'}
          </span>
          <span className="font-extrabold text-[#26B6B6] bg-white dark:bg-gray-800 border border-[#26B6B6]/15 px-2.5 py-1 rounded-full text-[11px] font-mono shadow-2xs">
            {resultsCount} {isRtl ? 'آبجکت' : 'objects'}
          </span>
        </div>

        {/* ========================================== */}
        {/* SECTION 2: CATEGORY-SPECIFIC PARAMETRIC FILTERS */}
        {/* ========================================== */}
        {currentCategoryObj && currentCategoryObj.specificFilters.length > 0 && (
          <div className="bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 p-3.5 rounded-xl border border-[#26B6B6]/15 space-y-3">
            <button
              onClick={() => setSpecificFiltersExpanded(!specificFiltersExpanded)}
              className="w-full flex justify-between items-center text-start group cursor-pointer"
            >
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#26B6B6] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                <span>{isRtl ? 'فیلترهای اختصاصی این گروه' : 'Specific Filters'}</span>
              </h4>
              <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-[#26B6B6] transition-transform ${!specificFiltersExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {specificFiltersExpanded && (
              <div className="space-y-3 pt-1 animate-fadeIn text-start">
                {currentCategoryObj.specificFilters.map(filter => {
                  const currentVal = (filterState.specifics[filter.id] as string) || '';

                  return (
                    <div key={filter.id} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {isRtl ? filter.labelFa : filter.labelEn}
                      </label>
                      
                      {filter.type === 'select' && filter.options && (
                        <select
                          value={currentVal}
                          onChange={(e) => handleSpecificChange(filter.id, e.target.value)}
                          className="w-full text-xs p-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-850 focus:outline-none focus:ring-1 focus:ring-[#26B6B6] cursor-pointer"
                        >
                          <option value="">{isRtl ? 'همه موارد' : 'All options'}</option>
                          {filter.options.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {isRtl ? opt.labelFa : opt.labelEn}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* GENERAL FILTERS SECTION WITH COLLAPSIBLE HEADERS */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50 space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 text-start">
            {t('sharedFilters')}
          </h4>

          {/* 1. File Format Filters */}
          <div className="space-y-2 border-b border-gray-50 dark:border-gray-800/30 pb-3 text-start">
            <button 
              onClick={() => toggleGroup('formats')}
              className="w-full flex justify-between items-center text-start group cursor-pointer"
            >
              <span className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                {isRtl ? 'فرمت فایل‌های دانلودی' : 'Download File Format'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform ${collapsedGroups.formats ? 'rotate-180' : ''}`} />
            </button>
            
            {!collapsedGroups.formats && (
              <div className="space-y-2 pt-1 animate-fadeIn">
                <div className="space-y-1.5 pr-1">
                  {SUPPORTED_FORMATS.map(fmt => {
                    const checked = filterState.formats.includes(fmt);
                    let displayLabel = fmt;
                    if (fmt === 'Catalog (PDF)') {
                      displayLabel = isRtl ? 'کاتالوگ (PDF)' : 'Catalog (PDF)';
                    } else if (fmt === 'IFC') {
                      displayLabel = isRtl ? 'استاندارد IFC' : 'IFC Standard';
                    }
                    return (
                      <label key={fmt} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleFormatToggle(fmt)}
                          className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
                        />
                        <span>{displayLabel}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Manufacturers / Brands */}
          <div className="space-y-2 border-b border-gray-50 dark:border-gray-800/30 pb-3 text-start">
            <button 
              onClick={() => toggleGroup('manufacturers')}
              className="w-full flex justify-between items-center text-start group cursor-pointer"
            >
              <span className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                {isRtl ? 'تولیدکننده / برند' : 'Manufacturers'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform ${collapsedGroups.manufacturers ? 'rotate-180' : ''}`} />
            </button>
            
            {!collapsedGroups.manufacturers && (
              <div className="space-y-2 pt-1 animate-fadeIn">
                <div className="relative">
                  <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={mfgSearchQuery}
                    onChange={(e) => setMfgSearchQuery(e.target.value)}
                    placeholder={isRtl ? 'جستجوی تولیدکننده...' : 'Search brand...'}
                    className="w-full text-[10px] pl-2 pr-7 py-1.5 border border-gray-150 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-950 focus:outline-none focus:ring-1 focus:ring-[#26B6B6] focus:bg-white dark:focus:bg-gray-900 transition-all"
                  />
                  {mfgSearchQuery && (
                    <button 
                      onClick={() => setMfgSearchQuery('')}
                      className="absolute left-2.5 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 pr-1 pt-1">
                  {filteredMfgList.length > 0 ? (
                    filteredMfgList.map(mfg => {
                      const checked = filterState.manufacturers.includes(mfg.id);
                      return (
                        <label key={mfg.id} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleMfgToggle(mfg.id)}
                            className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
                          />
                          <span>{isRtl ? mfg.nameFa : mfg.nameEn}</span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-[10px] text-gray-400 text-center py-2">
                      {isRtl ? 'برندی یافت نشد' : 'No brands match'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Revit Version */}
          <div className="space-y-2 border-b border-gray-50 dark:border-gray-800/30 pb-3 text-start">
            <button 
              onClick={() => toggleGroup('revitVersions')}
              className="w-full flex justify-between items-center text-start group cursor-pointer"
            >
              <span className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                {isRtl ? 'نسخه نرم‌افزار رویت' : 'Revit Software Version'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform ${collapsedGroups.revitVersions ? 'rotate-180' : ''}`} />
            </button>
            
            {!collapsedGroups.revitVersions && (
              <div className="space-y-1.5 pt-1 animate-fadeIn">
                {REVIT_VERSIONS.map(ver => {
                  const checked = filterState.revitVersions.includes(ver);
                  return (
                    <label key={ver} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleRevitToggle(ver)}
                        className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
                      />
                      <span className="font-mono">{ver}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. LOD levels */}
          <div className="space-y-2 border-b border-gray-50 dark:border-gray-800/30 pb-3 text-start">
            <button 
              onClick={() => toggleGroup('lods')}
              className="w-full flex justify-between items-center text-start group cursor-pointer"
            >
              <span className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                {t('lod')}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform ${collapsedGroups.lods ? 'rotate-180' : ''}`} />
            </button>
            
            {!collapsedGroups.lods && (
              <div className="space-y-1.5 pt-1 animate-fadeIn">
                {LOD_LEVELS.map(lod => {
                  const checked = filterState.lods.includes(lod);
                  return (
                    <label key={lod} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleLodToggle(lod)}
                        className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
                      />
                      <span className="font-mono">{lod}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Certifications */}
          <div className="space-y-2 border-b border-gray-50 dark:border-gray-800/30 pb-3 text-start">
            <button 
              onClick={() => toggleGroup('certifications')}
              className="w-full flex justify-between items-center text-start group cursor-pointer"
            >
              <span className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                {t('certification')}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform ${collapsedGroups.certifications ? 'rotate-180' : ''}`} />
            </button>
            
            {!collapsedGroups.certifications && (
              <div className="space-y-1.5 pt-1 animate-fadeIn">
                {CERTIFICATIONS.map(cert => {
                  const checked = filterState.certifications.includes(cert);
                  return (
                    <label key={cert} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCertToggle(cert)}
                        className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
                      />
                      <span>{cert}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 7. Quick Boolean toggles */}
          <div className="pt-2 space-y-2 text-start">
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={filterState.isImported === false}
                onChange={(e) => onFilterChange({ isImported: e.target.checked ? false : null })}
                className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
              />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{isRtl ? 'فقط کالاهای تولید ملی ایران' : 'Only Manufactured in Iran'}</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={filterState.hasCutsheet === true}
                onChange={(e) => onFilterChange({ hasCutsheet: e.target.checked ? true : null })}
                className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
              />
              <span>{t('hasCutsheet')}</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={filterState.hasSample === true}
                onChange={(e) => onFilterChange({ hasSample: e.target.checked ? true : null })}
                className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
              />
              <span>{t('hasSample')}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Apply button specifically for mobile slide-over drawers */}
      {onClose && (
        <div className="sticky bottom-0 left-0 right-0 pt-3 pb-1 bg-white dark:bg-gray-900 border-t border-gray-150 dark:border-gray-800 z-10">
          <button
            onClick={onClose}
            className="w-full bg-[#26B6B6] hover:bg-[#1e9494] text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isRtl ? `اعمال فیلترها (${resultsCount} مورد)` : `Apply Filters (${resultsCount} results)`}</span>
          </button>
        </div>
      )}
    </div>
  );
};
