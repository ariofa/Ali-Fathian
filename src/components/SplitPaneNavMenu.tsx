import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { CATEGORIES } from '../data';
import { CategoryIcon } from './CategoryIcon';
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight } from 'lucide-react';

interface SplitPaneNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryId: string, subcategoryId?: string, format?: string) => void;
  currentCategoryId?: string | null;
  currentSubcategoryId?: string | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const SplitPaneNavMenu: React.FC<SplitPaneNavMenuProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentCategoryId,
  currentSubcategoryId,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { language, isRtl } = useLanguage();
  
  // Track active category
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    currentCategoryId || CATEGORIES[0]?.id || ''
  );

  // Reset or update active category when menu opens or prop changes
  useEffect(() => {
    if (isOpen) {
      if (currentCategoryId) {
        setActiveCategoryId(currentCategoryId);
      } else if (CATEGORIES.length > 0) {
        setActiveCategoryId(CATEGORIES[0].id);
      }
    }
  }, [isOpen, currentCategoryId]);

  if (!isOpen) return null;

  // Keep track of active category object
  const activeCategory = CATEGORIES.find(cat => cat.id === activeCategoryId);

  // Helper to generate dynamic, realistic nested links for each subcategory
  const getNestedLinks = (subId: string) => {
    if (isRtl) {
      return [
        { id: `${subId}-revit`, label: 'مدل سه‌بعدی و فمیلی Revit' },
        { id: `${subId}-ifc`, label: 'آبجکت استاندارد باز IFC' },
        { id: `${subId}-cad`, label: 'پلان و جزئیات ۲بعدی CAD' },
        { id: `${subId}-details`, label: 'مشخصات فنی و متریال هوشمند' }
      ];
    } else {
      return [
        { id: `${subId}-revit`, label: 'Revit 3D Family (.rfa)' },
        { id: `${subId}-ifc`, label: 'Standard Open IFC Model' },
        { id: `${subId}-cad`, label: '2D CAD Plan & Details' },
        { id: `${subId}-details`, label: 'Specs & Smart Parameters' }
      ];
    }
  };

  return (
    <div 
      className="fixed inset-x-0 top-[108px] sm:top-[111px] bottom-[56px] md:bottom-0 z-[100] bg-black/30 dark:bg-black/55 backdrop-blur-xs flex justify-center items-start animate-fadeIn"
      onClick={onClose}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      <div 
        className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 h-full sm:h-[480px] md:h-[520px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full bg-white dark:bg-gray-900 border-x-0 sm:border border-t-0 border-gray-150 dark:border-zinc-800 rounded-none sm:rounded-b-2xl flex shadow-2xl overflow-hidden">
          
          {/* COLUMN 1: Primary Navigation Column (Vertical List) */}
          <div 
            className={`w-[95px] min-[375px]:w-[110px] sm:w-[240px] bg-zinc-50 dark:bg-gray-950 flex flex-col h-full shrink-0 ${
              isRtl ? 'border-l border-gray-150 dark:border-zinc-800' : 'border-r border-gray-150 dark:border-zinc-800'
            }`}
          >
            {/* Scrollable List of Main Categories */}
            <div 
              className="flex-1 overflow-y-auto overscroll-contain py-4 space-y-1.5 scrollbar-none"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
            >
              {CATEGORIES.map(cat => {
                const isActive = activeCategoryId === cat.id;
                const name = isRtl ? cat.nameFa : cat.nameEn;
                const subsCount = cat.subcategories.length;
                
                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => {
                      // Desktop-only hover selection
                      if (window.innerWidth >= 640) {
                        setActiveCategoryId(cat.id);
                      }
                    }}
                    className={`w-full flex items-stretch transition-all relative select-none ${
                      isActive 
                        ? 'bg-white dark:bg-gray-900 shadow-2xs font-black text-[#26B6B6] dark:text-emerald-400' 
                        : 'hover:bg-zinc-100/50 dark:hover:bg-gray-900/30 text-gray-650 dark:text-gray-400'
                    }`}
                  >
                    {/* Outer edge indicator line */}
                    {isActive && (
                      <div 
                        className={`absolute top-0 bottom-0 w-[4px] bg-[#26B6B6] dark:bg-emerald-400 rounded-full my-1 z-10 ${
                          isRtl ? 'right-0' : 'left-0'
                        }`} 
                      />
                    )}
                    
                    {/* Primary Category Title Link (Smart active panel toggle / navigate) */}
                    <a
                      href={`#categories?category=${cat.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const isMobile = window.innerWidth < 640;
                        if (isMobile) {
                          if (activeCategoryId !== cat.id) {
                            // On mobile, first click switches the category tab so user can see subcategories
                            setActiveCategoryId(cat.id);
                          } else {
                            // Second click on the same category navigates to the full category
                            onSelect(cat.id);
                            onClose();
                          }
                        } else {
                          // Desktop click navigates directly
                          onSelect(cat.id);
                          onClose();
                        }
                      }}
                      className="flex-1 flex flex-col sm:flex-row items-center sm:gap-3.5 py-3.5 px-1.5 sm:px-4 text-center sm:text-start cursor-pointer select-none relative"
                      title={isRtl ? `مشاهده ${name}` : `View ${name}`}
                    >
                      {/* Rounded Tinted Icon Container */}
                      <div className={`w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isActive 
                          ? 'bg-[#26B6B6] text-white shadow-xs scale-102' 
                          : 'bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 text-[#26B6B6] dark:text-emerald-400 hover:scale-105'
                      }`}>
                        <CategoryIcon 
                          iconName={cat.icon} 
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5" 
                        />
                      </div>
                      
                      {/* Category Name Label & Subs Badge (Desktop/Tablet) */}
                      <div className="hidden sm:block text-start min-w-0 flex-1">
                        <p className={`text-xs font-black leading-tight truncate ${
                          isActive ? 'text-[#26B6B6] dark:text-emerald-400' : 'text-gray-750 dark:text-gray-300'
                        }`}>
                          {name}
                        </p>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold mt-0.5 block">
                          {subsCount} {isRtl ? 'زیرمجموعه' : 'divisions'}
                        </span>
                      </div>

                      {/* Mobile-only label: clear text sizing, line-height, spacing to avoid overlapping */}
                      <span className={`block sm:hidden text-[9px] leading-snug font-black text-center mt-1.5 w-full break-words px-0.5 ${
                        isActive ? 'text-[#26B6B6] dark:text-emerald-400' : 'text-gray-700 dark:text-gray-350'
                      }`}>
                        {name}
                      </span>
                    </a>

                    {/* Desktop Chevron Indicator */}
                    <div className="hidden sm:flex items-center px-3 text-gray-300 pointer-events-none">
                      {isRtl ? (
                        <ChevronLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: Dynamic Multi-Column Subcategory Grid (Mega Menu Pane) */}
          <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col h-full overflow-hidden">
            {activeCategory && (
              <>
                {/* Header: All products link */}
                <div className="p-3 sm:p-5 border-b border-gray-150 dark:border-zinc-800 shrink-0 bg-zinc-50/50 dark:bg-gray-950/25">
                  <a
                    href={`#categories?category=${activeCategory.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelect(activeCategory.id);
                      onClose();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-4 p-2.5 sm:p-3 bg-white dark:bg-gray-850 hover:bg-[#26B6B6]/5 border border-gray-150 dark:border-zinc-800 rounded-xl transition-all group shadow-2xs hover:border-[#26B6B6]/30 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-3.5 bg-[#26B6B6] rounded-xs" />
                      <span className="text-[11px] sm:text-xs font-black text-[#26B6B6]">
                        {isRtl 
                          ? `مشاهده همه محصولات ${activeCategory.nameFa}`
                          : `View All ${activeCategory.nameEn} Products`
                        }
                      </span>
                    </div>
                    {isRtl ? (
                      <ArrowLeft className="w-3.5 h-3.5 text-[#26B6B6] group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-[#26B6B6] group-hover:translate-x-1 transition-transform" />
                    )}
                  </a>
                </div>

                {/* Subcategories Multi-Column Grid Panel (Smooth independent scrolling) */}
                <div 
                  className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-none"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 sm:gap-y-8">
                    {activeCategory.subcategories.map(sub => {
                      const subName = isRtl ? sub.nameFa : sub.nameEn;
                      const nestedLinks = getNestedLinks(sub.id);
                      const isCurrentlySelectedSub = currentSubcategoryId === sub.id;

                      return (
                        <div key={sub.id} className="space-y-2.5 sm:space-y-3.5 text-start pb-4 sm:pb-0 border-b border-gray-100/40 sm:border-0 last:border-0">
                          {/* Subcategory Main Column Header Link */}
                          <a
                            href={`#categories?category=${activeCategory.id}&sub=${sub.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelect(activeCategory.id, sub.id);
                              onClose();
                            }}
                            className={`text-xs font-black tracking-tight hover:text-[#26B6B6] dark:hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer text-start w-full py-1 ${
                              isCurrentlySelectedSub ? 'text-[#26B6B6] dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            <span className="w-1.5 h-3 bg-[#26B6B6] dark:bg-emerald-400 rounded-xs shrink-0" />
                            <span className="hover:underline line-clamp-1">{subName}</span>
                            {isRtl ? (
                              <ChevronLeft className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            )}
                          </a>

                          {/* List of subcategory technical formats & links */}
                          <ul className="space-y-2 sm:space-y-2 border-r-[1.5px] rtl:border-r ltr:border-l ltr:border-l-[1.5px] border-gray-100 dark:border-zinc-800 pr-3 rtl:pr-3 rtl:pl-0 pl-0 ltr:pl-3">
                            {/* Quick access to full subcategory folder */}
                            <li>
                              <a
                                href={`#categories?category=${activeCategory.id}&sub=${sub.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onSelect(activeCategory.id, sub.id);
                                  onClose();
                                }}
                                className={`w-full text-start text-[11px] leading-normal transition-colors hover:text-[#26B6B6] dark:hover:text-emerald-400 cursor-pointer block truncate py-0.5 ${
                                  isCurrentlySelectedSub
                                    ? 'text-[#26B6B6] dark:text-emerald-400 font-bold'
                                    : 'text-gray-400 dark:text-gray-500 font-medium'
                                }`}
                              >
                                {isRtl ? `آرشیو کامل ${subName}` : `Full ${subName} Directory`}
                              </a>
                            </li>

                            {/* Technical specification sub-links mapped to correct subclass filters */}
                            {nestedLinks.map(link => {
                              let format: string | undefined = undefined;
                              if (link.id.endsWith('-revit')) format = 'Revit';
                              else if (link.id.endsWith('-ifc')) format = 'IFC';
                              else if (link.id.endsWith('-cad')) format = 'AutoCAD';

                              return (
                                <li key={link.id}>
                                  <a
                                    href={`#categories?category=${activeCategory.id}&sub=${sub.id}&format=${format || ''}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      onSelect(activeCategory.id, sub.id, format);
                                      onClose();
                                    }}
                                    className="w-full text-start text-[11px] leading-normal text-gray-500 dark:text-gray-400 hover:text-[#26B6B6] dark:hover:text-emerald-400 cursor-pointer block truncate font-medium transition-colors py-0.5"
                                  >
                                    {link.label}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
