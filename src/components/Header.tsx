import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { Logo } from './Logo';
import { CATEGORIES, BIM_OBJECTS } from '../data';
import { CategoryIcon } from './CategoryIcon';
import { SplitPaneNavMenu } from './SplitPaneNavMenu';
import {
  Globe,
  User,
  Heart,
  Search,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  LogOut,
  X,
  CreditCard,
  Download,
  Menu,
  Tag,
  Folder,
  Package,
  Clock,
  Trash2,
  Building2,
  BookOpen,
  Layers,
  Factory,
  MessageSquare,
  FileCheck
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: 'Modeler' | 'Manufacturer';
  onChangeRole: (role: 'Modeler' | 'Manufacturer') => void;
  savedCount: number;
  compareCount: number;
  currentUser: any | null;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onHeaderSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  onChangeRole,
  savedCount,
  compareCount,
  currentUser,
  onLogout,
  onOpenAuthModal,
  isDark,
  onToggleDark,
  onHeaderSearch
}) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const mobileSearchRefCombined = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const hoverTimeoutRef = useRef<any>(null);

  const handleMouseEnter = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setCategoriesDropdownOpen(true);
  };

  const handleMouseLeave = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setCategoriesDropdownOpen(false);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Synchronize categories menu state globally
  useEffect(() => {
    const handleToggleCategoriesMenu = () => {
      setCategoriesDropdownOpen(prev => !prev);
    };
    const handleOpenCategoriesMenu = () => {
      setCategoriesDropdownOpen(true);
    };
    const handleCloseCategoriesMenu = () => {
      setCategoriesDropdownOpen(false);
    };
    window.addEventListener('toggle-categories-menu', handleToggleCategoriesMenu);
    window.addEventListener('open-categories-menu', handleOpenCategoriesMenu);
    window.addEventListener('close-categories-menu', handleCloseCategoriesMenu);
    return () => {
      window.removeEventListener('toggle-categories-menu', handleToggleCategoriesMenu);
      window.removeEventListener('open-categories-menu', handleOpenCategoriesMenu);
      window.removeEventListener('close-categories-menu', handleCloseCategoriesMenu);
    };
  }, []);

  useEffect(() => {
    if (categoriesDropdownOpen) {
      setMobileSearchOpen(false);
    }
    const event = new CustomEvent('categories-menu-changed', {
      detail: { open: categoriesDropdownOpen }
    });
    window.dispatchEvent(event);
  }, [categoriesDropdownOpen]);

  // Sync hovered category for Desktop Mega Menu
  useEffect(() => {
    if (categoriesDropdownOpen && CATEGORIES.length > 0 && !hoveredCategoryId) {
      setHoveredCategoryId(CATEGORIES[0].id);
    }
  }, [categoriesDropdownOpen, hoveredCategoryId]);

  // Recent Searches state and handlers
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const saveSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentSearch = (queryToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setRecentSearches(prev => {
      const updated = prev.filter(q => q !== queryToRemove);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    saveSearchQuery(query);
    onHeaderSearch(query);
    setMobileSearchOpen(false);
    setShowAutocomplete(false);
    setIsSearchFocused(false);
  };

  // Autocomplete states & refs
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteIndex, setAutocompleteIndex] = useState(-1);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoryPanelRef = useRef<HTMLDivElement>(null);
  const desktopAccountRef = useRef<HTMLDivElement>(null);
  const mobileAccountRef = useRef<HTMLDivElement>(null);
  const platformMenuRef = useRef<HTMLDivElement>(null);

  // Sync searchQuery when search filter updates
  useEffect(() => {
    if (currentView === 'home') {
      setSearchQuery('');
    }
  }, [currentView]);

  // Handle autocomplete query change
  useEffect(() => {
    setAutocompleteIndex(-1);
    if (searchQuery.trim().length >= 2) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  }, [searchQuery]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(target) &&
        (!categoryPanelRef.current || !categoryPanelRef.current.contains(target))
      ) {
        setCategoriesDropdownOpen(false);
      }
      const clickedOutsideDesktopAccount = !desktopAccountRef.current || !desktopAccountRef.current.contains(target);
      const clickedOutsideMobileAccount = !mobileAccountRef.current || !mobileAccountRef.current.contains(target);
      if (clickedOutsideDesktopAccount && clickedOutsideMobileAccount) {
        setAccountDropdownOpen(false);
      }
      if (platformMenuRef.current && !platformMenuRef.current.contains(target)) {
        setPlatformMenuOpen(false);
      }
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(target)) {
        setShowAutocomplete(false);
        setIsSearchFocused(false);
        setIsSearchExpanded(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target)) {
        setShowAutocomplete(false);
        setIsSearchFocused(false);
      }
      if (mobileSearchRefCombined.current && !mobileSearchRefCombined.current.contains(target)) {
        setMobileSearchOpen(false);
        setShowAutocomplete(false);
        setIsSearchFocused(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleMenuEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleMenuEscape);
    return () => window.removeEventListener('keydown', handleMenuEscape);
  }, [mobileMenuOpen]);

  // Focus the compact mobile/tablet search after it opens.
  useEffect(() => {
    if (!mobileSearchOpen) return;

    setAccountDropdownOpen(false);
    setCategoriesDropdownOpen(false);
    setIsSearchFocused(true);

    const focusTimer = window.setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 90);

    return () => window.clearTimeout(focusTimer);
  }, [mobileSearchOpen]);

  // Compute matched suggestions
  const getSuggestions = () => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return [];

    const matches: {
      type: 'object' | 'category' | 'subcategory';
      id: string;
      label: string;
      secondaryLabel?: string;
      objectId?: string;
      categoryId?: string;
      subcategoryId?: string | null;
    }[] = [];

    // 1. Match Categories and Subcategories
    CATEGORIES.forEach(cat => {
      const catName = isRtl ? cat.nameFa : cat.nameEn;
      const otherCatName = isRtl ? cat.nameEn : cat.nameFa;
      if (catName.toLowerCase().includes(query) || otherCatName.toLowerCase().includes(query)) {
        matches.push({
          type: 'category',
          id: `cat-${cat.id}`,
          label: catName,
          secondaryLabel: isRtl ? 'دسته‌بندی اصلی' : 'Main Category',
          categoryId: cat.id,
          subcategoryId: null
        });
      }

      cat.subcategories.forEach(sub => {
        const subName = isRtl ? sub.nameFa : sub.nameEn;
        const otherSubName = isRtl ? sub.nameEn : sub.nameFa;
        if (subName.toLowerCase().includes(query) || otherSubName.toLowerCase().includes(query)) {
          matches.push({
            type: 'subcategory',
            id: `sub-${sub.id}`,
            label: subName,
            secondaryLabel: isRtl ? `در ${catName}` : `in ${catName}`,
            categoryId: cat.id,
            subcategoryId: sub.id
          });
        }
      });
    });

    // 2. Match BIM Objects (by title or tags)
    const combinedObjects = (() => {
      try {
        const saved = localStorage.getItem('iranbimhub_custom_objects_v2');
        const custom = saved ? JSON.parse(saved) : [];
        const map = new Map<string, any>();
        BIM_OBJECTS.forEach(obj => { if (obj && obj.id) map.set(obj.id, obj); });
        custom.forEach((obj: any) => { if (obj && obj.id) map.set(obj.id, obj); });
        return Array.from(map.values());
      } catch {
        return BIM_OBJECTS;
      }
    })();

    combinedObjects.forEach(obj => {
      const title = isRtl ? obj.titleFa : obj.titleEn;
      const otherTitle = isRtl ? obj.titleEn : obj.titleFa;
      const matchesTitle = title.toLowerCase().includes(query) || otherTitle.toLowerCase().includes(query);
      const matchesTags = (obj.tagsFa && obj.tagsFa.some(t => t.toLowerCase().includes(query))) ||
                          (obj.tagsEn && obj.tagsEn.some(t => t.toLowerCase().includes(query)));

      if (matchesTitle || matchesTags) {
        // Find category name
        const cat = CATEGORIES.find(c => c.id === obj.category);
        const catLabel = cat ? (isRtl ? cat.nameFa : cat.nameEn) : '';
        matches.push({
          type: 'object',
          id: `obj-${obj.id}`,
          label: title,
          secondaryLabel: catLabel,
          objectId: obj.id
        });
      }
    });

    return matches.slice(0, 8);
  };

  const suggestions = getSuggestions();

  const handleSelectSuggestion = (suggestion: typeof suggestions[0]) => {
    if (searchQuery.trim()) {
      saveSearchQuery(searchQuery);
    }
    if (suggestion.type === 'object') {
      window.dispatchEvent(new CustomEvent('select-bim-object', { detail: { objectId: suggestion.objectId } }));
    } else {
      handleCategorySelect(suggestion.categoryId!, suggestion.subcategoryId);
    }
    setSearchQuery('');
    setShowAutocomplete(false);
    setMobileSearchOpen(false);
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAutocompleteIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAutocompleteIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (autocompleteIndex >= 0 && autocompleteIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[autocompleteIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false);
      setIsSearchFocused(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearchQuery(searchQuery);
      onHeaderSearch(searchQuery);
      setMobileSearchOpen(false);
      setShowAutocomplete(false);
      setIsSearchFocused(false);
    }
  };

  const handleCategorySelect = (catId: string, subId: string | null = null, format: string | null = null) => {
    setCategoriesDropdownOpen(false);
    onNavigate('categories');
    onHeaderSearch(''); // clear query if we click category
    setTimeout(() => {
      const event = new CustomEvent('select-category-filter', {
        detail: {
          categoryId: catId,
          subcategoryId: subId,
          format: format
        }
      });
      window.dispatchEvent(event);
    }, 50);
  };

  // Safe dashboard tabs navigation dispatch
  const handleDashboardNavigate = (tab: string) => {
    setAccountDropdownOpen(false);
    if (userRole === 'Modeler') {
      onNavigate('modeler-dashboard');
    } else {
      onNavigate('manufacturer-dashboard');
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('change-dashboard-tab', { detail: { tab } }));
    }, 120);
  };

  const handleMobileMenuNavigate = (view: string) => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setShowAutocomplete(false);
    setIsSearchFocused(false);
    onNavigate(view);
  };

  const isManufacturerAccount = Boolean(currentUser && (currentUser.role === 'Manufacturer' || userRole === 'Manufacturer'));

  // Views where the logged-in user is already inside their own panel/dashboard.
  // In these views the "پنل کاربری" shortcut button is redundant and stays hidden;
  // everywhere else it acts as a quick shortcut back to the user's panel.
  const USER_PANEL_VIEWS = ['modeler-dashboard', 'manufacturer-dashboard', 'admin-panel'];
  const isInUserPanel = USER_PANEL_VIEWS.includes(currentView);
  const savedManufacturerProfile = (() => {
    if (!isManufacturerAccount) return null;
    try {
      const raw = localStorage.getItem('iranbimhub_mfg_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const accountDisplayName = isManufacturerAccount
    ? (savedManufacturerProfile?.companyName || currentUser?.companyName || currentUser?.fullName || currentUser?.name || '')
    : (currentUser?.fullName || currentUser?.name || '');
  const accountSubtitle = isManufacturerAccount
    ? (currentUser?.roleTitle || currentUser?.title || (isRtl ? 'مدیر صفحهٔ برند' : 'Brand Page Manager'))
    : (currentUser?.officeName || currentUser?.companyName || '');
  const accountRoleLabel = isManufacturerAccount
    ? (isRtl ? 'تولیدکننده / صاحب برند' : 'Manufacturer / Brand Owner')
    : (currentUser?.selectedRoles?.slice?.(0, 2)?.join(' / ') || (isRtl ? 'مدل‌ساز BIM / معمار / مهندس' : 'BIM Modeler / Architect / Engineer'));


  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors ${currentView === 'home' ? 'is-landing-page' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* DESKTOP LAYOUT (lg:flex) */}
        <div className="hidden lg:flex items-center justify-between h-16 gap-3 sm:gap-6 relative">
          {/* Logo Area */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="focus:outline-none cursor-pointer transition-transform duration-200 active:scale-95"
            >
              <Logo className="h-11 md:h-12" iconOnly={false} />
            </button>
          </div>

          {/* Desktop Persistent Search Bar (BIMobject style) - Rendered ONLY on non-landing pages */}
          {currentView !== 'home' && (
            <div
              ref={desktopSearchRef}
              className="transition-all duration-300 ease-in-out relative mx-4 flex-1 max-w-xl"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-gray-50 dark:bg-slate-50 border border-gray-200 dark:border-gray-300 rounded-full p-1 focus-within:ring-2 focus-within:ring-[#26B6B6]/20 focus-within:border-[#26B6B6] transition-all h-11 w-full"
              >
                <input
                  type="text"
                  placeholder={isRtl ? 'جستجو در آبجکت‌های بیم، دسته‌بندی‌ها یا برندها' : 'Search BIM objects, categories or brands'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsSearchFocused(true)}
                  className="text-xs bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-400 text-gray-800 dark:text-gray-900 w-full px-4 opacity-100"
                />
                <button
                  type="submit"
                  className="rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shrink-0 cursor-pointer bg-[#464E56] hover:bg-[#2c3136] text-white dark:bg-[#26B6B6] dark:hover:bg-[#1e9494] px-5 h-8 gap-1.5 text-xs font-black"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{isRtl ? 'جستجو' : 'Search'}</span>
                </button>
              </form>

              {/* Recent Searches & Autocomplete Dropdown */}
              {isSearchFocused && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 text-xs">
                  {searchQuery.trim().length < 2 && recentSearches.length > 0 ? (
                    <div className="py-2 px-1">
                      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 dark:border-gray-800/60 mb-1">
                        <span className="font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#26B6B6]" />
                          {isRtl ? 'جستجوهای اخیر' : 'Recent Searches'}
                        </span>
                        <button
                          type="button"
                          onClick={clearAllRecentSearches}
                          className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-red-500 hover:dark:text-red-400 transition-colors cursor-pointer font-bold"
                        >
                          {isRtl ? 'پاک کردن همه' : 'Clear All'}
                        </button>
                      </div>
                      <div className="space-y-0.5 max-h-60 overflow-y-auto">
                        {recentSearches.map((query, index) => (
                          <div
                            key={`recent-${index}`}
                            onClick={() => handleRecentSearchClick(query)}
                            className="w-full flex items-center justify-between px-3 py-2 text-start rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors group"
                          >
                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#26B6B6] truncate flex-1 font-medium">
                              {query}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => removeRecentSearch(query, e)}
                              className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors"
                              title={isRtl ? 'حذف' : 'Remove'}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    showAutocomplete && suggestions.length > 0 && (
                      <div className="py-1">
                        {suggestions.map((sug, idx) => {
                          const Icon = sug.type === 'object' ? Package : (sug.type === 'category' ? Folder : Tag);
                          const isSelected = idx === autocompleteIndex;
                          return (
                            <button
                              key={sug.id}
                              type="button"
                              onClick={() => handleSelectSuggestion(sug)}
                              onMouseEnter={() => setAutocompleteIndex(idx)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-start border-b border-gray-50 dark:border-gray-800/50 last:border-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 text-[#26B6B6]'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                              }`}
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#26B6B6]' : 'text-gray-400'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="font-extrabold truncate">{sug.label}</p>
                                {sug.secondaryLabel && (
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate mt-0.5">
                                    {sug.secondaryLabel}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Side Icons: Language, Notifications, Account */}
          <div className="flex items-center gap-2.5">
            {/* Conditional Search Icon inside action group (Only visible on Landing Page) */}
            {currentView === 'home' && (
              <div ref={desktopSearchRef} className="relative flex items-center">
                {isSearchExpanded ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-gray-50 dark:bg-slate-50 border border-gray-200 dark:border-gray-300 rounded-full p-1 focus-within:ring-2 focus-within:ring-[#26B6B6]/20 focus-within:border-[#26B6B6] transition-all h-9 w-64 animate-fadeIn"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder={isRtl ? 'جستجو...' : 'Search...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsSearchFocused(true)}
                      className="text-xs bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-400 text-gray-800 dark:text-gray-900 w-full px-3 py-1"
                    />
                    <button
                      type="submit"
                      className="bg-[#464E56] hover:bg-[#2c3136] text-white dark:bg-[#26B6B6] dark:hover:bg-[#1e9494] rounded-full p-1.5 h-7 w-7 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setIsSearchExpanded(true);
                      setIsSearchFocused(true);
                    }}
                    className="p-2 border border-gray-200/60 dark:border-gray-800/80 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-gray-500 dark:text-gray-400 hover:text-[#26B6B6] cursor-pointer h-9 w-9 flex items-center justify-center shrink-0"
                    title={isRtl ? 'جستجو' : 'Search'}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}

                {/* Suggestions / Dropdown for search icon inside group */}
                {isSearchFocused && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 text-xs`}>
                    {searchQuery.trim().length < 2 && recentSearches.length > 0 ? (
                      <div className="py-2 px-1">
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 dark:border-gray-800/60 mb-1">
                          <span className="font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#26B6B6]" />
                            {isRtl ? 'جستجوهای اخیر' : 'Recent Searches'}
                          </span>
                          <button
                            type="button"
                            onClick={clearAllRecentSearches}
                            className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-red-500 hover:dark:text-red-400 transition-colors cursor-pointer font-bold"
                          >
                            {isRtl ? 'پاک کردن همه' : 'Clear All'}
                          </button>
                        </div>
                        <div className="space-y-0.5 max-h-60 overflow-y-auto">
                          {recentSearches.map((query, index) => (
                            <div
                              key={`recent-lp-${index}`}
                              onClick={() => handleRecentSearchClick(query)}
                              className="w-full flex items-center justify-between px-3 py-2 text-start rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors group"
                            >
                              <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#26B6B6] truncate flex-1 font-medium">
                                {query}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => removeRecentSearch(query, e)}
                                className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors"
                                title={isRtl ? 'حذف' : 'Remove'}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      showAutocomplete && suggestions.length > 0 && (
                        <div className="py-1">
                          {suggestions.map((sug, idx) => {
                            const Icon = sug.type === 'object' ? Package : (sug.type === 'category' ? Folder : Tag);
                            const isSelected = idx === autocompleteIndex;
                            return (
                              <button
                                key={`suggest-lp-${sug.id}`}
                                type="button"
                                onClick={() => handleSelectSuggestion(sug)}
                                onMouseEnter={() => setAutocompleteIndex(idx)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-start border-b border-gray-50 dark:border-gray-800/50 last:border-0 transition-colors ${
                                  isSelected
                                    ? 'bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 text-[#26B6B6]'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                                }`}
                              >
                                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#26B6B6]' : 'text-gray-400'}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="font-extrabold truncate">{sug.label}</p>
                                  {sug.secondaryLabel && (
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate mt-0.5">
                                      {sug.secondaryLabel}
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 1. Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
              className="flex items-center justify-center p-2 border border-gray-200/60 dark:border-gray-800/80 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-[10px] font-extrabold text-[#464E56] dark:text-gray-300 cursor-pointer h-9 w-9 gap-0.5 shrink-0"
              title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
            >
              <Globe className="w-4 h-4 text-[#26B6B6]" />
              <span className="text-[9px]">{language === 'fa' ? 'EN' : 'فا'}</span>
            </button>

            {/* Standalone dark mode toggle removed here, it's enough inside the account menu */}

            {/* 3. Account Dropdown (Avatar) */}
            <div className="relative" ref={desktopAccountRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center h-9 w-9 border ${
                  currentUser
                    ? 'border-[#26B6B6]/40 dark:border-[#26B6B6]/40 bg-[#26B6B6]/5'
                    : 'border-gray-200/60 dark:border-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-900'
                } ${
                  accountDropdownOpen
                    ? 'bg-slate-100 dark:bg-gray-900 text-[#26B6B6]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#26B6B6]'
                }`}
                title={isRtl ? 'حساب کاربری' : 'User Account'}
              >
                <User className={`w-4 h-4 ${currentUser ? 'text-[#26B6B6]' : ''}`} />
              </button>

              {/* Account Dropdown matching Digikala pattern */}
              {accountDropdownOpen && (
                <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2.5 w-64 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl py-2 z-50 animate-fadeIn`}>
                  {currentUser ? (
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl mb-1.5">
                      <p className="font-bold text-xs text-gray-800 dark:text-gray-100">
                        {currentUser.fullName || currentUser.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5 truncate">
                        {currentUser.email || currentUser.phone}
                      </p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#26B6B6]/15 text-[#26B6B6] text-[9px] font-black rounded-full uppercase tracking-wider">
                        {isRtl
                          ? (userRole === 'Manufacturer' ? 'تولیدکننده کاتالوگ' : 'طراح و مدل‌ساز بیم')
                          : (userRole === 'Manufacturer' ? 'Manufacturer' : 'BIM Modeler')
                        }
                      </span>
                    </div>
                  ) : (
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 text-center mb-1.5">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                        {isRtl ? 'برای دسترسی به امکانات کامل وارد شوید' : 'Sign in to access AEC libraries'}
                      </p>
                      <button
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          onOpenAuthModal();
                        }}
                        className="w-full py-2 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-lg text-xs font-black cursor-pointer transition-all active:scale-98 shadow-sm"
                      >
                        {isRtl ? 'ورود یا ثبت‌نام همراه' : 'Sign In / Register'}
                      </button>
                    </div>
                  )}

                  {/* Dropdown Items in ordered sequence */}
                  <div className="space-y-0.5 px-1.5">
                    {currentUser && (
                      <button
                        onClick={() => handleDashboardNavigate('profile')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>
                          {userRole === 'Manufacturer'
                            ? (isRtl ? 'پروفایل شرکت' : 'Company Profile')
                            : (isRtl ? 'پروفایل من' : 'My Profile')
                          }
                        </span>
                      </button>
                    )}

                    {currentUser && userRole === 'Modeler' && (
                      <button
                        onClick={() => handleDashboardNavigate('history')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                      >
                        <Download className="w-4 h-4 text-gray-400" />
                        <span>{isRtl ? 'تاریخچه دانلود آبجکت‌ها' : 'Download History'}</span>
                      </button>
                    )}

                    {currentUser && (
                      <button
                        onClick={() => handleDashboardNavigate('subscription')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                      >
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span>{isRtl ? 'خرید و مدیریت اشتراک' : 'Subscription & Upgrade'}</span>
                      </button>
                    )}

                    {currentUser && (
                      <button
                        onClick={() => handleDashboardNavigate('collections')}
                        className="w-full flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                      >
                        <div className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span>{isRtl ? 'نشان شده‌ها' : 'Saved Collections'}</span>
                        </div>
                        {savedCount > 0 && (
                          <span className="bg-[#26B6B6] text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-full shrink-0">
                            {savedCount}
                          </span>
                        )}
                      </button>
                    )}

                    {/* Theme Toggle (Always present under account dropdown for both mobile and desktop) */}
                    <button
                      onClick={onToggleDark}
                      className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                    >
                      {isDark ? (
                        <>
                          <Sun className="w-4 h-4 text-amber-500" />
                          <span>{isRtl ? 'حالت روز (تم روشن)' : 'Switch to Light Mode'}</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4 text-slate-500" />
                          <span>{isRtl ? 'حالت شب (تم تاریک)' : 'Switch to Dark Mode'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {currentUser && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-800 px-1.5">
                      <button
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/5 rounded-lg text-xs font-black transition-colors cursor-pointer text-start"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>{isRtl ? 'خروج از حساب کاربری' : 'Sign Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE / TABLET LAYOUT (below lg) */}
        <div ref={mobileSearchRefCombined} className="flex lg:hidden flex-col gap-2 py-2.5 relative">
          <div className="relative w-full">
          {/* ROW 1: Mobile menu + logo + account/search actions */}
          <div className="flex items-center justify-between gap-2">
            {/* In RTL: hamburger at the far right, logo immediately to its left. */}
            <div className="flex items-center gap-2 shrink-0" dir={isRtl ? 'rtl' : 'ltr'}>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(prev => !prev);
                  setMobileSearchOpen(false);
                              setShowAutocomplete(false);
                  setIsSearchFocused(false);
                }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  mobileMenuOpen
                    ? 'bg-[#26B6B6] border-[#26B6B6] text-white shadow-md'
                    : 'border-gray-200/70 dark:border-gray-800/80 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
                aria-label={isRtl ? 'بازکردن منوی اصلی' : 'Open main menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-primary-menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => handleMobileMenuNavigate('home')}
                className="focus:outline-none cursor-pointer transition-transform duration-200 active:scale-95"
                aria-label={isRtl ? 'صفحه اصلی ایران‌بیم‌هاب' : 'IranBIMhub home'}
              >
                <Logo className="h-9 sm:h-10" iconOnly={false} />
              </button>
            </div>

            {/* Mobile actions: guest login; authenticated search, notifications, language and account. */}
            <div className="flex items-center gap-1.5 shrink-0" dir={isRtl ? 'rtl' : 'ltr'}>
              <button
                type="button"
                onClick={() => {
                  setMobileSearchOpen(prev => !prev);
                  setMobileMenuOpen(false);
                  setAccountDropdownOpen(false);
                            }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${
                  mobileSearchOpen
                    ? 'bg-[#26B6B6] border-[#26B6B6] text-white shadow-[0_8px_20px_rgba(38,182,182,0.25)]'
                    : 'border-gray-200/60 dark:border-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-[#26B6B6] hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
                title={isRtl ? 'جستجو' : 'Search'}
                aria-expanded={mobileSearchOpen}
                aria-controls="mobile-header-search-panel"
              >
                {mobileSearchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
              </button>

              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setLanguage(language === 'fa' ? 'en' : 'fa');
                                }}
                  className="flex h-8 min-w-9 shrink-0 items-center justify-center gap-1 rounded-full border border-gray-200/60 dark:border-gray-800/80 px-1.5 text-[8px] font-black text-[#26B6B6] hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === 'fa' ? 'EN' : 'فا'}</span>
                </button>
              )}

              <div className="relative" ref={mobileAccountRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      onOpenAuthModal();
                      return;
                    }
                    setAccountDropdownOpen(prev => !prev);
                    setMobileMenuOpen(false);
                    setMobileSearchOpen(false);
                                }}
                  className={`flex items-center justify-center rounded-full border transition-all cursor-pointer active:scale-95 ${
                    currentUser
                      ? 'h-9 w-9 border-[#26B6B6]/40 bg-[#26B6B6]/5 text-[#26B6B6]'
                      : 'h-8 whitespace-nowrap gap-1.5 border-[#26B6B6]/30 bg-[#26B6B6] px-2.5 text-[10px] font-black text-white hover:bg-[#1e9494]'
                  }`}
                  aria-label={currentUser ? (isRtl ? 'حساب کاربری' : 'Account') : (isRtl ? 'ورود / ثبت‌نام' : 'Sign in / Register')}
                  aria-expanded={currentUser ? accountDropdownOpen : undefined}
                >
                  <User className={currentUser ? 'w-5 h-5' : 'w-4 h-4'} />
                  {!currentUser && <span>{isRtl ? 'ورود / ثبت‌نام' : 'Sign in / Register'}</span>}
                </button>

                {currentUser && accountDropdownOpen && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-2 w-72 max-w-[calc(100vw-2rem)] max-h-[calc(100svh-5rem)] overflow-y-auto rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-xl z-[80]`}>
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-950 px-3 py-3 mb-1.5">
                      <p className="truncate text-sm font-black text-gray-900 dark:text-white">{accountDisplayName}</p>
                      {accountSubtitle && <p className="mt-1 truncate text-[10px] font-bold text-gray-500 dark:text-gray-400">{accountSubtitle}</p>}
                      <span className="mt-1.5 inline-flex max-w-full rounded-full bg-[#26B6B6]/10 px-2 py-1 text-[9px] font-black text-[#26B6B6] truncate">{accountRoleLabel}</span>
                    </div>

                    {isManufacturerAccount ? (
                      <>
                        <button type="button" onClick={() => handleDashboardNavigate('profile')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <Building2 className="w-4 h-4 text-[#26B6B6]" />
                          <span>{isRtl ? 'پروفایل برند' : 'Brand Profile'}</span>
                        </button>
                        <button type="button" onClick={() => handleDashboardNavigate('catalog')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <Package className="w-4 h-4 text-[#26B6B6]" />
                          <span>{isRtl ? 'محصولات و کاتالوگ' : 'Products & Catalog'}</span>
                        </button>
                        <button type="button" onClick={() => handleMobileMenuNavigate('manufacturers')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <Building2 className="w-4 h-4 text-[#26B6B6]" />
                          <span>{isRtl ? 'مشاهدهٔ صفحهٔ عمومی برند' : 'View Public Brand Page'}</span>
                        </button>
                        <button type="button" onClick={() => handleMobileMenuNavigate('payment')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <CreditCard className="w-4 h-4 text-[#26B6B6]" />
                          <span>{isRtl ? 'اشتراک‌ها و صورتحساب' : 'Subscriptions & Billing'}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => handleDashboardNavigate('profile')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <User className="w-4 h-4 text-[#26B6B6]" />
                          <span>{isRtl ? 'پروفایل من' : 'My Profile'}</span>
                        </button>
                        <button type="button" onClick={() => handleDashboardNavigate('collections')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <Heart className="w-4 h-4 text-[#26B6B6]" />
                          <span>{isRtl ? 'نشان‌شده‌ها' : 'Saved Items'}</span>
                        </button>
                        <button type="button" onClick={() => handleDashboardNavigate('history')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <Clock className="w-4 h-4 text-[#26B6B6]" />
                          <span>{isRtl ? 'تاریخچهٔ دانلودها' : 'Download History'}</span>
                        </button>
                      </>
                    )}

                    <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />
                    <button
                      type="button"
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-red-500 hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{isRtl ? 'خروج از حساب' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile primary menu: normal-flow dropdown from top to bottom, never a side drawer. */}
          {mobileMenuOpen && (
            <div
              id="mobile-primary-menu"
              ref={mobileMenuRef}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`${isRtl ? 'right-0' : 'left-0'} absolute top-full mt-2 z-[70] w-fit min-w-[250px] max-w-[calc(100vw-2rem)] max-h-[calc(100svh-5rem)] sm:max-h-[calc(100svh-5.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl animate-fadeIn`}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <nav className="p-2" aria-label={isRtl ? 'منوی اصلی موبایل' : 'Mobile primary navigation'}>
                <button
                  type="button"
                  onClick={() => handleMobileMenuNavigate('about')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black transition-colors cursor-pointer ${currentView === 'about' ? 'bg-[#0FB9B1]/10 text-[#087F7A]' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <BookOpen className="w-4 h-4 text-[#0FB9B1]" />
                  <span>{isRtl ? 'ایران بیم هاب چیست؟' : 'What is IranBIMhub?'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileMenuNavigate('for-manufacturers')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black transition-colors cursor-pointer ${currentView === 'for-manufacturers' ? 'bg-[#0FB9B1]/10 text-[#087F7A]' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <Factory className="w-4 h-4 text-[#0FB9B1]" />
                  <span>{isRtl ? 'راهنمای تولیدکنندگان و صاحبان برند' : 'Guide for manufacturers and brand owners'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileMenuNavigate('for-designers')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black transition-colors cursor-pointer ${currentView === 'for-designers' ? 'bg-[#0FB9B1]/10 text-[#087F7A]' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <Layers className="w-4 h-4 text-[#0FB9B1]" />
                  <span>{isRtl ? 'راهنمای معماران و مهندسان' : 'Guide for architects and engineers'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileMenuNavigate('for-bim-modelers')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black transition-colors cursor-pointer ${currentView === 'for-bim-modelers' ? 'bg-[#0FB9B1]/10 text-[#087F7A]' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <FileCheck className="w-4 h-4 text-[#0FB9B1]" />
                  <span>{isRtl ? 'همکاری با ما' : 'Collaborate with us'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileMenuNavigate('contact')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black transition-colors cursor-pointer ${currentView === 'contact' ? 'bg-[#0FB9B1]/10 text-[#087F7A]' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-[#0FB9B1]" />
                  <span>{isRtl ? 'تماس با ما' : 'Contact us'}</span>
                </button>

                <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

                {!currentUser && (
                  <>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage(language === 'fa' ? 'en' : 'fa');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-[#26B6B6]" />
                      <span>{isRtl ? 'تغییر زبان' : 'Change Language'}</span>
                    </span>
                    <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-[9px] font-black text-[#26B6B6]">{language === 'fa' ? 'EN' : 'فا'}</span>
                  </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={onToggleDark}
                  className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
                    <span>{isDark ? (isRtl ? 'حالت روز (تم روشن)' : 'Switch to Light Mode') : (isRtl ? 'حالت شب (تم تاریک)' : 'Switch to Dark Mode')}</span>
                  </span>
                  <span className={`relative h-5 w-9 rounded-full transition-colors ${isDark ? 'bg-[#26B6B6]' : 'bg-gray-300 dark:bg-gray-700'}`} aria-hidden="true">
                    <span
                      className="absolute start-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                      style={{
                        transform: isDark
                          ? `translateX(${isRtl ? '-16px' : '16px'})`
                          : 'translateX(0)'
                      }}
                    />
                  </span>
                </button>
              </nav>
            </div>
          )}

          </div>

          <div
            id="mobile-header-search-panel"
            ref={mobileSearchRef}
            className={`relative w-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mobileSearchOpen
                ? 'max-h-[96px] opacity-100 translate-y-0 overflow-visible'
                : 'max-h-0 opacity-0 -translate-y-2 overflow-hidden pointer-events-none'
            }`}
          >
            <form
              onSubmit={handleSearchSubmit}
              className={`w-full flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1 focus-within:ring-2 focus-within:ring-[#26B6B6]/20 focus-within:border-[#26B6B6] transition-all h-10 shadow-sm ${
                mobileSearchOpen ? 'scale-100' : 'scale-[0.98]'
              }`}
            >
              <input
                ref={mobileSearchInputRef}
                id="header-search-input"
                type="text"
                placeholder={isRtl ? 'جستجو در آبجکت‌های بیم، دسته‌بندی‌ها یا برندها' : 'Search BIM objects, categories or brands'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full text-xs bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 px-3.5"
              />
              <button
                type="submit"
                className="bg-[#464E56] hover:bg-[#2c3136] dark:bg-[#26B6B6] dark:hover:bg-[#1e9494] text-white rounded-full p-1.5 h-8 w-8 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
                aria-label={isRtl ? 'اجرای جستجو' : 'Submit search'}
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Recent Searches & Autocomplete Dropdown */}
            {mobileSearchOpen && isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 text-xs animate-fadeIn">
                {searchQuery.trim().length < 2 && recentSearches.length > 0 ? (
                  <div className="py-2 px-1">
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 dark:border-gray-800/60 mb-1">
                      <span className="font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#26B6B6]" />
                        {isRtl ? 'جستجوهای اخیر' : 'Recent Searches'}
                      </span>
                      <button
                        type="button"
                        onClick={clearAllRecentSearches}
                        className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-red-500 hover:dark:text-red-400 transition-colors cursor-pointer font-bold"
                      >
                        {isRtl ? 'پاک کردن همه' : 'Clear All'}
                      </button>
                    </div>
                    <div className="space-y-0.5 max-h-60 overflow-y-auto">
                      {recentSearches.map((query, index) => (
                        <div
                          key={`recent-mobile-${index}`}
                          onClick={() => handleRecentSearchClick(query)}
                          className="w-full flex items-center justify-between px-3 py-2 text-start rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors group"
                        >
                          <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#26B6B6] truncate flex-1 font-medium">
                            {query}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(query, e)}
                            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors"
                            title={isRtl ? 'حذف' : 'Remove'}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  showAutocomplete && suggestions.length > 0 && (
                    <div className="py-1">
                      {suggestions.map((sug, idx) => {
                        const Icon = sug.type === 'object' ? Package : (sug.type === 'category' ? Folder : Tag);
                        const isSelected = idx === autocompleteIndex;
                        return (
                          <button
                            key={`suggest-mobile-${sug.id}`}
                            type="button"
                            onClick={() => handleSelectSuggestion(sug)}
                            onMouseEnter={() => setAutocompleteIndex(idx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-start border-b border-gray-50 dark:border-gray-800/50 last:border-0 transition-colors ${
                              isSelected
                                ? 'bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 text-[#26B6B6]'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#26B6B6]' : 'text-gray-400'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-extrabold truncate">{sug.label}</p>
                              {sug.secondaryLabel && (
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate mt-0.5">
                                  {sug.secondaryLabel}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: Desktop secondary navigation bar */}
        <div className="hidden lg:block border-t border-gray-100 dark:border-gray-800 py-2 sm:py-2.5">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">

            {/* Primary Navigation Menu */}
            <div className="flex items-center gap-5 md:gap-7 text-sm font-extrabold">

              {/* Two-level product-category navigation — temporary taxonomy, both levels navigate. */}
              <div className="relative" ref={categoriesRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <button
                  id="nav-categories"
                  type="button"
                  onClick={() => setCategoriesDropdownOpen((open) => !open)}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${categoriesDropdownOpen || currentView === 'categories' ? 'text-[#087F7A] bg-[#0FB9B1]/10 font-black' : 'text-gray-600 dark:text-gray-400 hover:text-[#087F7A] hover:bg-gray-50 dark:hover:bg-gray-800/40'}`}
                  aria-expanded={categoriesDropdownOpen}
                >
                  <span>{isRtl ? 'دسته‌بندی محصولات' : 'Product categories'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {categoriesDropdownOpen && (
                  <div ref={categoryPanelRef} className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-full mt-2 z-[80] grid grid-cols-[175px_240px] overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl animate-fadeIn`}>
                    <div className="border-e border-gray-100 dark:border-gray-800 bg-slate-50/70 dark:bg-slate-950/30 p-2">
                      {CATEGORIES.map((category) => (
                        <button key={category.id} type="button" onMouseEnter={() => setHoveredCategoryId(category.id)} onClick={() => handleCategorySelect(category.id)} className={`w-full rounded-xl px-3 py-2.5 text-start text-xs font-black transition-colors cursor-pointer ${hoveredCategoryId === category.id ? 'bg-[#0FB9B1]/12 text-[#087F7A]' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'}`}>
                          {isRtl ? category.nameFa : category.nameEn}
                        </button>
                      ))}
                    </div>
                    <div className="p-3">
                      {(() => { const active = CATEGORIES.find((category) => category.id === hoveredCategoryId) || CATEGORIES[0]; return active ? <><button type="button" onClick={() => handleCategorySelect(active.id)} className="w-full text-start rounded-xl border border-[#0FB9B1]/20 bg-[#0FB9B1]/5 px-3 py-2 text-xs font-black text-[#087F7A] hover:bg-[#0FB9B1]/10 cursor-pointer">{isRtl ? `همهٔ محصولات ${active.nameFa} ←` : `All ${active.nameEn} →`}</button><div className="mt-2 grid grid-cols-1 gap-1">{active.subcategories.map((sub) => <button key={sub.id} type="button" onClick={() => handleCategorySelect(active.id, sub.id)} className="rounded-lg px-3 py-2 text-start text-[11px] text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#087F7A] cursor-pointer">{isRtl ? sub.nameFa : sub.nameEn}</button>)}</div></> : null; })()}
                    </div>
                  </div>
                )}
              </div>

              {/* IranBIMhub section menu */}
              <div className="relative" ref={platformMenuRef}>
                <button
                  id="nav-iranbimhub"
                  type="button"
                  onClick={() => setPlatformMenuOpen((open) => !open)}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    platformMenuOpen || ['about', 'for-manufacturers', 'for-designers', 'for-bim-modelers'].includes(currentView)
                      ? 'text-[#087F7A] bg-[#0FB9B1]/10 font-black'
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#087F7A] hover:bg-gray-50 dark:hover:bg-gray-800/40'
                  }`}
                  aria-expanded={platformMenuOpen}
                  aria-haspopup="menu"
                >
                  <span>{isRtl ? 'ایران بیم هاب' : 'IranBIMhub'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${platformMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {platformMenuOpen && (
                  <div role="menu" className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-full mt-2 z-[80] min-w-[235px] rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-xl animate-fadeIn`}>
                    <button type="button" role="menuitem" onClick={() => { setPlatformMenuOpen(false); onNavigate('about'); }} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-[#0FB9B1]/10 hover:text-[#087F7A] transition-colors cursor-pointer"><BookOpen className="w-4 h-4 shrink-0 text-[#0FB9B1]" /><span>{isRtl ? 'دربارهٔ ایران بیم هاب' : 'About IranBIMhub'}</span></button>
                    <button type="button" role="menuitem" onClick={() => { setPlatformMenuOpen(false); onNavigate('for-manufacturers'); }} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-[#0FB9B1]/10 hover:text-[#087F7A] transition-colors cursor-pointer"><Factory className="w-4 h-4 shrink-0 text-[#0FB9B1]" /><span>{isRtl ? 'برای تولیدکنندگان' : 'For manufacturers'}</span></button>
                    <button type="button" role="menuitem" onClick={() => { setPlatformMenuOpen(false); onNavigate('for-designers'); }} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-[#0FB9B1]/10 hover:text-[#087F7A] transition-colors cursor-pointer"><Layers className="w-4 h-4 shrink-0 text-[#0FB9B1]" /><span>{isRtl ? 'برای معماران و متخصصان BIM' : 'For architects and BIM specialists'}</span></button>
                    <button type="button" role="menuitem" onClick={() => { setPlatformMenuOpen(false); onNavigate('for-bim-modelers'); }} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-[#0FB9B1]/10 hover:text-[#087F7A] transition-colors cursor-pointer"><FileCheck className="w-4 h-4 shrink-0 text-[#0FB9B1]" /><span>{isRtl ? 'همکاری با متخصصان BIM' : 'Collaborate as a BIM specialist'}</span></button>
                  </div>
                )}
              </div>

              {/* تماس با ما (Contact Us) */}
              <button
                id="nav-contact"
                onClick={() => onNavigate('contact')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'contact'
                    ? 'text-[#26B6B6] bg-[#26B6B6]/5 font-black'
                    : 'text-gray-650 dark:text-gray-305 hover:text-[#26B6B6]'
                }`}
              >
                {isRtl ? 'تماس با ما' : 'Contact Us'}
              </button>

            </div>

            {/* Desktop Join Platform CTA Button — hidden while the user is already inside their own panel */}
            <div className="flex items-center">
              {(!currentUser || !isInUserPanel) && (
                <button
                  onClick={currentUser ? () => handleDashboardNavigate('profile') : onOpenAuthModal}
                  className="relative group overflow-hidden px-5.5 py-2 bg-[#26B6B6] hover:bg-[#1e9494] text-white dark:text-gray-950 dark:bg-[#26B6B6] dark:hover:bg-[#1e9494] rounded-full text-sm font-black shadow-xs hover:shadow-md transition-all duration-300 active:scale-97 cursor-pointer flex items-center gap-2 hover:scale-102"
                >
                  <User className="w-4.5 h-4.5" />
                  <span>
                    {currentUser
                      ? (isRtl ? 'پنل کاربری' : 'Go to Dashboard')
                      : (isRtl ? 'ورود/ثبت نام' : 'Join Platform')
                    }
                  </span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </header>
  );
};
