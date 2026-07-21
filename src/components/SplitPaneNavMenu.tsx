import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { CATEGORIES } from '../data';
import { CategoryIcon } from './CategoryIcon';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  ChevronDown, 
  Home, 
  Layers, 
  BookOpen, 
  Users, 
  Briefcase, 
  Info, 
  Phone 
} from 'lucide-react';

interface SplitPaneNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryId: string, subcategoryId?: string, format?: string) => void;
  currentCategoryId?: string | null;
  currentSubcategoryId?: string | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNavigate?: (view: string) => void;
}

export const SplitPaneNavMenu: React.FC<SplitPaneNavMenuProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentCategoryId,
  currentSubcategoryId,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}) => {
  const { language, isRtl } = useLanguage();
  
  // Track active category in desktop menu
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    currentCategoryId || CATEGORIES[0]?.id || ''
  );

  // Track active accordion in mobile menu
  const [expandedMobileCategoryId, setExpandedMobileCategoryId] = useState<string | null>(null);

  // Reset desktop active category when menu opens
  useEffect(() => {
    if (isOpen) {
      if (currentCategoryId) {
        setActiveCategoryId(currentCategoryId);
      } else if (CATEGORIES.length > 0) {
        setActiveCategoryId(CATEGORIES[0].id);
      }
    }
  }, [isOpen, currentCategoryId]);

  // If menu is closed, do not render anything
  if (!isOpen) return null;

  const activeCategory = CATEGORIES.find(cat => cat.id === activeCategoryId);

  // Helper to generate dynamic, realistic nested links for each subcategory
  const getNestedLinks = (subId: string) => {
    if (isRtl) {
      return [
        { id: `${subId}-revit`, label: 'مدل سه‌بعدی و فمیلی Revit' },
        { id: `${subId}-ifc`, label: 'آبجکت استاندارد باز IFC' },
        { id: `${subId}-cad`, label: 'پلان و جزئیات ۲بعدی CAD' }
      ];
    } else {
      return [
        { id: `${subId}-revit`, label: 'Revit 3D Family (.rfa)' },
        { id: `${subId}-ifc`, label: 'Standard Open IFC Model' },
        { id: `${subId}-cad`, label: '2D CAD Plan & Details' }
      ];
    }
  };

  // Safe navigation handler
  const handleNav = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      // Fallback window dispatch if prop not passed
      window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: { view } }));
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay (common for both desktop hover out and mobile backdrop click) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[90] bg-black/30 dark:bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* ==================== DESKTOP LAYOUT (md:block) ==================== */}
          <div 
            className="hidden md:block fixed inset-x-0 top-[108px] sm:top-[111px] z-[100]"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-7xl mx-auto px-6 lg:px-8"
            >
              {/* AEC Architectural Look: Sharp rectangular corners (rounded-none), thin grey border (border-zinc-200), clean white background, soft shadow */}
              <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none flex shadow-md overflow-hidden h-[480px]">
                
                {/* COLUMN 1: Vertical list of Main Categories */}
                <div 
                  className={`w-[240px] bg-zinc-50 dark:bg-zinc-950 flex flex-col h-full shrink-0 ${
                    isRtl ? 'border-l border-zinc-200 dark:border-zinc-800' : 'border-r border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <div 
                    className="flex-1 overflow-y-auto overscroll-contain py-4 space-y-1 scrollbar-thin"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {CATEGORIES.map(cat => {
                      const isActive = activeCategoryId === cat.id;
                      const name = isRtl ? cat.nameFa : cat.nameEn;
                      const subsCount = cat.subcategories.length;
                      
                      return (
                        <div
                          key={cat.id}
                          onMouseEnter={() => setActiveCategoryId(cat.id)}
                          className={`w-full flex items-stretch transition-colors ${
                            isActive 
                              ? 'bg-white dark:bg-zinc-900 text-[#26B6B6] dark:text-emerald-400' 
                              : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20 text-slate-700 dark:text-zinc-400'
                          }`}
                        >
                          {/* Precise Left Accent Line */}
                          {isActive && (
                            <div className="absolute top-0 bottom-0 start-0 w-[3px] bg-[#26B6B6] dark:bg-emerald-400" />
                          )}
                          
                          <a
                            href={`#categories?category=${cat.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelect(cat.id);
                              onClose();
                            }}
                            className="flex-1 flex items-center gap-3 py-3 px-4 text-start cursor-pointer relative"
                            title={isRtl ? `مشاهده ${name}` : `View ${name}`}
                          >
                            <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border ${
                              isActive 
                                ? 'bg-slate-900 text-white border-slate-900 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                                : 'bg-white text-slate-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                            }`}>
                              <CategoryIcon 
                                iconName={cat.icon} 
                                className="w-4 h-4" 
                              />
                            </div>
                            
                            <div className="text-start min-w-0 flex-1">
                              <p className={`text-xs font-bold leading-tight truncate ${
                                isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-zinc-300'
                              }`}>
                                {name}
                              </p>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium block mt-0.5">
                                {subsCount} {isRtl ? 'زیرمجموعه' : 'divisions'}
                              </span>
                            </div>
                          </a>

                          <div className="flex items-center px-3 text-zinc-300 pointer-events-none">
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

                {/* COLUMN 2: Subcategory Grid (Mega Menu Pane) */}
                <div className="flex-1 bg-white dark:bg-zinc-900 flex flex-col h-full overflow-hidden min-h-0">
                  {activeCategory && (
                    <>
                      {/* Header bar */}
                      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-zinc-50/30 dark:bg-zinc-950/20 flex items-center justify-between">
                        <a
                          href={`#categories?category=${activeCategory.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelect(activeCategory.id);
                            onClose();
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 hover:border-[#26B6B6]/50 bg-white dark:bg-zinc-850 hover:bg-[#26B6B6]/5 text-slate-800 dark:text-zinc-200 rounded-none transition-all group text-xs cursor-pointer"
                        >
                          <div className="w-1.5 h-3 bg-[#26B6B6] dark:bg-emerald-400 rounded-none shrink-0" />
                          <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-[#26B6B6] dark:group-hover:text-emerald-400">
                            {isRtl 
                              ? `مشاهده کل آرشیو دسته‌بندی ${activeCategory.nameFa}`
                              : `Browse Entire ${activeCategory.nameEn} Directory`
                            }
                          </span>
                          {isRtl ? (
                            <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:-translate-x-1 transition-transform shrink-0" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform shrink-0" />
                          )}
                        </a>
                      </div>

                      {/* Subcategories Grid */}
                      <div 
                        className="flex-1 overflow-y-auto p-6 scrollbar-thin"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {activeCategory.subcategories.map(sub => {
                            const subName = isRtl ? sub.nameFa : sub.nameEn;
                            const nestedLinks = getNestedLinks(sub.id);
                            const isCurrentlySelectedSub = currentSubcategoryId === sub.id;

                            return (
                              <div key={sub.id} className="space-y-2.5 text-start border-b border-zinc-100 dark:border-zinc-800/40 pb-3 last:border-0 sm:border-0 sm:pb-0">
                                {/* Subcategory Header Link */}
                                <a
                                  href={`#categories?category=${activeCategory.id}&sub=${sub.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onSelect(activeCategory.id, sub.id);
                                    onClose();
                                  }}
                                  className={`text-xs font-bold hover:text-[#26B6B6] dark:hover:text-emerald-400 transition-colors flex items-center justify-between gap-2 cursor-pointer text-start w-full py-0.5 ${
                                    isCurrentlySelectedSub ? 'text-[#26B6B6] dark:text-emerald-400 font-extrabold' : 'text-slate-900 dark:text-zinc-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="w-1.5 h-1.5 bg-[#26B6B6] dark:bg-emerald-400 rounded-none shrink-0" />
                                    <span className="truncate">{subName}</span>
                                  </div>
                                  {isRtl ? (
                                    <ChevronLeft className="w-3 h-3 text-zinc-300" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3 text-zinc-300" />
                                  )}
                                </a>

                                {/* Technical specs child formats list */}
                                <ul className="space-y-1.5 border-s border-zinc-200 dark:border-zinc-800 ps-3">
                                  {/* Quick access */}
                                  <li>
                                    <a
                                      href={`#categories?category=${activeCategory.id}&sub=${sub.id}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        onSelect(activeCategory.id, sub.id);
                                        onClose();
                                      }}
                                      className={`w-full text-start text-[11px] font-medium leading-normal transition-colors hover:text-[#26B6B6] dark:hover:text-emerald-400 cursor-pointer block py-0.5 ${
                                        isCurrentlySelectedSub
                                          ? 'text-[#26B6B6] dark:text-emerald-400 font-bold'
                                          : 'text-zinc-400 dark:text-zinc-500'
                                      }`}
                                    >
                                      {isRtl ? `آرشیو کامل قطعات` : `Complete division index`}
                                    </a>
                                  </li>

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
                                          className="w-full text-start text-[11px] leading-normal text-zinc-500 hover:text-[#26B6B6] dark:text-zinc-400 dark:hover:text-emerald-400 cursor-pointer block font-medium transition-colors py-0.5"
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
            </motion.div>
          </div>

          {/* ==================== MOBILE LAYOUT SLIDE-OUT DRAWER (md:hidden) ==================== */}
          {/* Slides out from the RIGHT side of the screen natively matching RTL flow */}
          <div className="md:hidden fixed inset-0 z-[150]" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            
            {/* Dark background blur overlay */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
              onClick={onClose}
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.25 }}
              className="absolute top-0 bottom-0 start-0 w-[85%] max-w-[360px] h-full bg-white dark:bg-zinc-900 border-s border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-slate-900 dark:bg-[#26B6B6] text-white flex items-center justify-center text-sm font-bold">
                    I
                  </div>
                  <div className="text-start">
                    <h2 className="text-xs font-black text-slate-900 dark:text-white leading-none">
                      {isRtl ? 'ایران‌بیم‌هاب' : 'IranBIMhub'}
                    </h2>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-1">
                      {isRtl ? 'کاتالوگ و کتابخانه دیجیتال BIM' : 'Digital BIM Catalog'}
                    </p>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-none border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                  title={isRtl ? 'بستن منو' : 'Close Menu'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body (Scrollable Links and Accordions) */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">
                
                {/* Primary Nav Links */}
                <div className="space-y-1 text-start">
                  <button
                    onClick={() => handleNav('home')}
                    className="w-full flex items-center gap-3 py-3 px-3.5 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-none transition-colors border-b border-zinc-100 dark:border-zinc-800/30"
                  >
                    <Home className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <span>{isRtl ? 'صفحه اصلی پلتفرم' : 'Home Page'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('categories')}
                    className="w-full flex items-center justify-between py-3 px-3.5 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-none transition-colors border-b border-zinc-100 dark:border-zinc-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                      <span>{isRtl ? 'مشاهده کل کاتالوگ BIM' : 'Browse Full BIM Catalog'}</span>
                    </div>
                    <ChevronLeft className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  </button>
                </div>

                {/* Section Title */}
                <div className="text-start px-3.5">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                    {isRtl ? 'کتابخانه قطعات هوشمند (موضوعی)' : 'BIM object categories'}
                  </span>
                </div>

                {/* Categories Collapsible Accordion Group */}
                <div className="space-y-1">
                  {CATEGORIES.map(cat => {
                    const isExpanded = expandedMobileCategoryId === cat.id;
                    const name = isRtl ? cat.nameFa : cat.nameEn;
                    
                    return (
                      <div 
                        key={cat.id} 
                        className="border border-zinc-100 dark:border-zinc-800/50 rounded-none overflow-hidden bg-white dark:bg-zinc-900/50"
                      >
                        {/* Accordion Trigger Header */}
                        <button
                          onClick={() => setExpandedMobileCategoryId(isExpanded ? null : cat.id)}
                          className={`w-full flex items-center justify-between py-3 px-3.5 text-right transition-colors ${
                            isExpanded ? 'bg-zinc-50 dark:bg-zinc-950/40 text-[#26B6B6]' : 'text-slate-800 dark:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-7 h-7 rounded-none flex items-center justify-center shrink-0 border ${
                              isExpanded 
                                ? 'bg-slate-900 text-white border-slate-900 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                : 'bg-zinc-50 text-slate-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                            }`}>
                              <CategoryIcon iconName={cat.icon} className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold truncate">
                              {name}
                            </span>
                          </div>
                          
                          <ChevronDown 
                            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                              isExpanded ? 'rotate-180 text-[#26B6B6] dark:text-emerald-400' : ''
                            }`} 
                          />
                        </button>

                        {/* Collapsible Subcategory Panel */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.18, ease: 'easeInOut' }}
                              className="overflow-hidden bg-zinc-50/40 dark:bg-zinc-950/20 border-t border-zinc-100 dark:border-zinc-800/40"
                            >
                              <div className="py-1.5 px-3 space-y-1">
                                {/* Browse all subcategories */}
                                <button
                                  onClick={() => {
                                    onSelect(cat.id);
                                    onClose();
                                  }}
                                  className="w-full text-start py-2.5 px-3.5 text-xs font-black text-[#26B6B6] dark:text-emerald-400 hover:bg-[#26B6B6]/5 transition-colors flex items-center gap-2"
                                >
                                  <span className="w-1.5 h-1.5 bg-[#26B6B6] dark:bg-emerald-400 rounded-none shrink-0" />
                                  <span>{isRtl ? `نمایش کلیه ${name}` : `View All ${name}`}</span>
                                </button>

                                {/* Child subcategories with spacious, touch-friendly 44px+ height targets */}
                                {cat.subcategories.map(sub => (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      onSelect(cat.id, sub.id);
                                      onClose();
                                    }}
                                    className="w-full text-start py-2.5 px-3.5 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-[#26B6B6] dark:hover:text-emerald-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/30 transition-colors flex items-center gap-2"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                    <span className="truncate">{isRtl ? sub.nameFa : sub.nameEn}</span>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Platform Links */}
                <div className="text-start px-3.5 pt-3">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                    {isRtl ? 'لینک‌های ناوبری پلتفرم' : 'Platform Navigation'}
                  </span>
                </div>

                <div className="space-y-1 text-start">
                  <button
                    onClick={() => handleNav('for-designers')}
                    className="w-full flex items-center gap-3 py-2.5 px-3.5 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-none transition-colors"
                  >
                    <Users className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <span>{isRtl ? 'برای طراحان و مهندسان' : 'For Designers'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('for-manufacturers')}
                    className="w-full flex items-center gap-3 py-2.5 px-3.5 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-none transition-colors"
                  >
                    <Briefcase className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <span>{isRtl ? 'برای تولیدکنندگان' : 'For Manufacturers'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('about')}
                    className="w-full flex items-center gap-3 py-2.5 px-3.5 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-none transition-colors"
                  >
                    <Info className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <span>{isRtl ? 'معرفی ایران‌بیم‌هاب' : 'About IranBIMhub'}</span>
                  </button>

                  <button
                    onClick={() => handleNav('contact')}
                    className="w-full flex items-center gap-3 py-2.5 px-3.5 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-none transition-colors"
                  >
                    <Phone className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <span>{isRtl ? 'تماس با ما' : 'Contact Us'}</span>
                  </button>
                </div>

              </div>

              {/* Drawer Footer Status Area */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30 text-center shrink-0">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                  {isRtl ? 'طراحی بهینه شده برای موبایل با استاندارد AEC' : 'AEC-optimized mobile navigation interface'}
                </span>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
