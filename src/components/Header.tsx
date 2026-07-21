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
  Bell,
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
  BookOpen
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const mobileSearchRefCombined = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setCategoriesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setCategoriesDropdownOpen(false);
    }, 250);
  };

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
  const desktopAccountRef = useRef<HTMLDivElement>(null);
  const mobileAccountRef = useRef<HTMLDivElement>(null);
  const desktopNotificationsRef = useRef<HTMLDivElement>(null);
  const mobileNotificationsRef = useRef<HTMLDivElement>(null);

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
      if (categoriesRef.current && !categoriesRef.current.contains(target)) {
        setCategoriesDropdownOpen(false);
      }
      const clickedOutsideDesktopAccount = !desktopAccountRef.current || !desktopAccountRef.current.contains(target);
      const clickedOutsideMobileAccount = !mobileAccountRef.current || !mobileAccountRef.current.contains(target);
      if (clickedOutsideDesktopAccount && clickedOutsideMobileAccount) {
        setAccountDropdownOpen(false);
      }
      const clickedOutsideDesktopNotifications = !desktopNotificationsRef.current || !desktopNotificationsRef.current.contains(target);
      const clickedOutsideMobileNotifications = !mobileNotificationsRef.current || !mobileNotificationsRef.current.contains(target);
      if (clickedOutsideDesktopNotifications && clickedOutsideMobileNotifications) {
        setNotificationsOpen(false);
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
        setShowAutocomplete(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    BIM_OBJECTS.forEach(obj => {
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

  // Mock Notification List
  const mockNotifications = [
    {
      id: 1,
      titleFa: 'به ایران‌بیم‌هاب خوش آمدید! فرآیند احراز هویت اولیه شما با موفقیت انجام شد.',
      titleEn: 'Welcome to IranBIMhub! Your initial security registration is verified.',
      timeFa: 'هم‌اکنون',
      timeEn: 'Just now',
      unread: true
    },
    {
      id: 2,
      titleFa: 'کاتالوگ مدل‌های هوشمند BIM شرکت آلوپن به‌روزرسانی شد.',
      titleEn: 'Alupan Co. smart BIM catalog is updated with thermal-break families.',
      timeFa: '۲ ساعت پیش',
      timeEn: '2 hours ago',
      unread: true
    },
    {
      id: 3,
      titleFa: 'پلاگین رویت ۲۰۲۶ ایران‌بیم‌هاب با پشتیبانی از سیستم تطبیق اتوماتیک منتشر شد.',
      titleEn: 'IranBIMhub Revit 2026 plugin published with auto-matching parameters.',
      timeFa: 'دیروز',
      timeEn: 'Yesterday',
      unread: false
    }
  ];

  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors ${currentView === 'home' ? 'is-landing-page' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DESKTOP LAYOUT (md:flex) */}
        <div className="hidden md:flex items-center justify-between h-16 gap-3 sm:gap-6 relative">
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

            {/* 2. Interactive Notifications Bell */}
            <div className="relative" ref={desktopNotificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center h-9 w-9 border border-gray-200/60 dark:border-gray-800/80 ${
                  notificationsOpen 
                    ? 'bg-slate-100 dark:bg-gray-900 text-[#26B6B6]' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#26B6B6] hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
                title={isRtl ? 'اعلان‌ها' : 'Notifications'}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white font-mono text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                  2
                </span>
              </button>

              {/* Notifications Dropdown Panel */}
              {notificationsOpen && (
                <div className={`absolute ${isRtl ? 'left-0 sm:-left-12' : 'right-0 sm:-right-12'} mt-2.5 w-76 sm:w-80 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl py-3 z-50 text-gray-700 dark:text-gray-200 animate-fadeIn`}>
                  <div className="px-4 pb-2 border-b border-gray-50 dark:border-gray-800 mb-2 font-bold text-xs text-[#26B6B6] flex justify-between items-center">
                    <span>{isRtl ? 'اعلان‌های سیستم' : 'System Notifications'}</span>
                    <span className="bg-[#26B6B6]/10 text-[#26B6B6] px-2 py-0.5 rounded-full text-[9px] font-extrabold">۲ جدید</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto px-2 space-y-1">
                    {mockNotifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-2.5 rounded-lg transition-colors text-[11px] ${
                          notif.unread 
                            ? 'bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 border-r-2 border-[#26B6B6]' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <p className="font-medium text-gray-800 dark:text-gray-200 leading-normal">
                          {isRtl ? notif.titleFa : notif.titleEn}
                        </p>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 block mt-1">
                          {isRtl ? notif.timeFa : notif.timeEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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

        {/* MOBILE LAYOUT (md:hidden) */}
        <div className="flex md:hidden flex-col gap-2 py-2.5 relative">
          {/* ROW 1: Logo & Logotype + Compact Icon Cluster */}
          <div className="flex items-center justify-between gap-2">
            {/* Logo & Logotype */}
            <div className="flex items-center shrink-0">
              <button 
                onClick={() => onNavigate('home')} 
                className="focus:outline-none cursor-pointer transition-transform duration-200 active:scale-95"
              >
                <Logo className="h-9 sm:h-10" iconOnly={false} />
              </button>
            </div>

            {/* Compact Icon Cluster */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* 1. Search Toggle Icon (Aligned horizontally, same size as other peers) */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center h-8 w-8 border ${
                  mobileSearchOpen 
                    ? 'border-[#26B6B6]/40 bg-[#26B6B6]/5 text-[#26B6B6]' 
                    : 'border-gray-200/60 dark:border-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-[#26B6B6]'
                }`}
                title={isRtl ? 'جستجو' : 'Search'}
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              {/* 2. Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
                className="flex items-center justify-center p-1.5 border border-gray-200/60 dark:border-gray-800/80 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-[10px] font-extrabold text-[#464E56] dark:text-gray-300 cursor-pointer h-8 w-8 gap-0.5 shrink-0"
                title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
              >
                <Globe className="w-3.5 h-3.5 text-[#26B6B6]" />
                <span className="text-[8px]">{language === 'fa' ? 'EN' : 'فا'}</span>
              </button>

              {/* 3. Notifications Bell */}
              <div className="relative" ref={mobileNotificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center h-8 w-8 border border-gray-200/60 dark:border-gray-800/80 ${
                    notificationsOpen 
                      ? 'bg-slate-100 dark:bg-gray-900 text-[#26B6B6]' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-[#26B6B6] hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                  title={isRtl ? 'اعلان‌ها' : 'Notifications'}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute top-1 right-1 bg-red-500 text-white font-mono text-[7px] font-bold w-3 h-3 rounded-full flex items-center justify-center leading-none">
                    2
                  </span>
                </button>

                {/* Notifications Dropdown Panel */}
                {notificationsOpen && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl py-3.5 z-50 text-gray-700 dark:text-gray-200 animate-fadeIn`}>
                    <div className="px-4 pb-2 border-b border-gray-50 dark:border-gray-800 mb-2 font-bold text-xs text-[#26B6B6] flex justify-between items-center">
                      <span>{isRtl ? 'اعلان‌های سیستم' : 'System Notifications'}</span>
                      <span className="bg-[#26B6B6]/10 text-[#26B6B6] px-2 py-0.5 rounded-full text-[9px] font-extrabold">۲ جدید</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto px-2 space-y-1">
                      {mockNotifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-2 rounded-lg transition-colors text-[10px] ${
                            notif.unread 
                              ? 'bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 border-r-2 border-[#26B6B6]' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <p className="font-medium text-gray-800 dark:text-gray-200 leading-normal">
                            {isRtl ? notif.titleFa : notif.titleEn}
                          </p>
                          <span className="text-[8px] text-gray-400 dark:text-gray-500 block mt-1">
                            {isRtl ? notif.timeFa : notif.timeEn}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>



              {/* 3. Account Dropdown */}
              <div className="relative" ref={mobileAccountRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center h-8 w-8 border ${
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
                  <User className={`w-3.5 h-3.5 ${currentUser ? 'text-[#26B6B6]' : ''}`} />
                </button>

                {/* Account Dropdown */}
                {accountDropdownOpen && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl py-2 z-50 animate-fadeIn`}>
                    {currentUser ? (
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl mb-1.5">
                        <p className="font-bold text-xs text-gray-800 dark:text-gray-100">
                          {currentUser.fullName || currentUser.name}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5 truncate">
                          {currentUser.email || currentUser.phone}
                        </p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#26B6B6]/15 text-[#26B6B6] text-[8px] font-black rounded-full uppercase tracking-wider">
                          {isRtl 
                            ? (userRole === 'Manufacturer' ? 'تولیدکننده کاتالوگ' : 'طراح و مدل‌ساز بیم') 
                            : (userRole === 'Manufacturer' ? 'Manufacturer' : 'BIM Modeler')
                          }
                        </span>
                      </div>
                    ) : (
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 text-center mb-1.5">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                          {isRtl ? 'برای دسترسی به امکانات کامل وارد شوید' : 'Sign in to access AEC libraries'}
                        </p>
                        <button
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            onOpenAuthModal();
                          }}
                          className="w-full py-1.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-lg text-xs font-black cursor-pointer transition-all active:scale-98 shadow-sm"
                        >
                          {isRtl ? 'ورود یا ثبت‌نام همراه' : 'Sign In / Register'}
                        </button>
                      </div>
                    )}

                    <div className="space-y-0.5 px-1.5">
                      {currentUser && (
                        <button
                          onClick={() => handleDashboardNavigate('profile')}
                          className="w-full flex items-center gap-3 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                        >
                          <User className="w-3.5 h-3.5 text-gray-400" />
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
                          className="w-full flex items-center gap-3 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                        >
                          <Download className="w-3.5 h-3.5 text-gray-400" />
                          <span>{isRtl ? 'تاریخچه دانلود آبجکت‌ها' : 'Download History'}</span>
                        </button>
                      )}

                      {currentUser && (
                        <button
                          onClick={() => handleDashboardNavigate('subscription')}
                          className="w-full flex items-center gap-3 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          <span>{isRtl ? 'خرید و مدیریت اشتراک' : 'Subscription & Upgrade'}</span>
                        </button>
                      )}

                      {currentUser && (
                        <button
                          onClick={() => handleDashboardNavigate('collections')}
                          className="w-full flex items-center justify-between px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                        >
                          <div className="flex items-center gap-3">
                            <Heart className="w-3.5 h-3.5 text-gray-400" />
                            <span>{isRtl ? 'نشان شده‌ها' : 'Saved Collections'}</span>
                          </div>
                          {savedCount > 0 && (
                            <span className="bg-[#26B6B6] text-white text-[8px] font-sans font-bold px-1.5 py-0.5 rounded-full shrink-0">
                              {savedCount}
                            </span>
                          )}
                        </button>
                      )}

                      {/* Theme Toggle (Always present under account dropdown for both mobile and desktop) */}
                      <button
                        onClick={onToggleDark}
                        className="w-full flex items-center gap-3 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 rounded-lg text-xs font-bold transition-colors cursor-pointer text-start"
                      >
                        {isDark ? (
                          <>
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                            <span>{isRtl ? 'حالت روز (تم روشن)' : 'Switch to Light Mode'}</span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-3.5 h-3.5 text-slate-500" />
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
                          className="w-full flex items-center gap-3 px-3 py-1.5 text-red-500 hover:bg-red-500/5 rounded-lg text-xs font-black transition-colors cursor-pointer text-start"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                          <span>{isRtl ? 'خروج از حساب کاربری' : 'Sign Out'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expandable Mobile Search Bar (under row 1, visible only when search toggled) */}
          {mobileSearchOpen && (
            <div ref={mobileSearchRefCombined} className="w-full relative mt-1.5 animate-fadeIn">
              <form 
                onSubmit={handleSearchSubmit} 
                className="w-full flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-[#26B6B6]/20 focus-within:border-[#26B6B6] transition-all h-9.5"
              >
                <input
                  id="header-search-input-mobile"
                  type="text"
                  autoFocus
                  placeholder={isRtl ? 'جستجو...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full text-xs bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-105 px-3 py-1"
                />
                <button 
                  type="submit"
                  className="bg-[#464E56] dark:bg-[#26B6B6] text-white rounded-full p-1 h-7.5 w-7.5 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0 mr-1 ml-1"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Suggestions / Dropdown for mobile */}
              {isSearchFocused && (
                <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 text-[11px] w-full max-w-sm`}>
                  {searchQuery.trim().length < 2 && recentSearches.length > 0 ? (
                    <div className="py-1.5 px-0.5">
                      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-gray-100 dark:border-gray-800/60 mb-1">
                        <span className="font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#26B6B6]" />
                          {isRtl ? 'جستجوهای اخیر' : 'Recent'}
                        </span>
                        <button
                          type="button"
                          onClick={clearAllRecentSearches}
                          className="text-[9px] text-gray-400 dark:text-gray-500 hover:text-red-500 hover:dark:text-red-400 transition-colors cursor-pointer font-bold"
                        >
                          {isRtl ? 'پاک کردن' : 'Clear'}
                        </button>
                      </div>
                      <div className="space-y-0.5 max-h-36 overflow-y-auto">
                        {recentSearches.map((query, index) => (
                          <div
                            key={`recent-mob-${index}`}
                            onClick={() => handleRecentSearchClick(query)}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 text-start rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors group"
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
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    showAutocomplete && suggestions.length > 0 && (
                      <div className="py-1">
                        {suggestions.slice(0, 5).map((sug, idx) => {
                          const Icon = sug.type === 'object' ? Package : (sug.type === 'category' ? Folder : Tag);
                          const isSelected = idx === autocompleteIndex;
                          return (
                            <button
                              key={`suggest-mob-${sug.id}`}
                              type="button"
                              onClick={() => handleSelectSuggestion(sug)}
                              onMouseEnter={() => setAutocompleteIndex(idx)}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-start border-b border-gray-50 dark:border-gray-800/50 last:border-0 transition-colors ${
                                isSelected 
                                  ? 'bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 text-[#26B6B6]' 
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                              }`}
                            >
                              <Icon className="w-3 h-3 shrink-0 text-gray-400" />
                              <div className="flex-1 min-w-0">
                                <p className="font-extrabold truncate text-[10px]">{sug.label}</p>
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

          {/* ROW 2: Persistent Search Bar (Only visible on tablet widths between 640px and 768px) */}
          <div ref={mobileSearchRef} className="w-full relative hidden sm:block md:hidden">
            <form 
              onSubmit={handleSearchSubmit} 
              className="w-full flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1 focus-within:ring-2 focus-within:ring-[#26B6B6]/20 focus-within:border-[#26B6B6] transition-all h-10"
            >
              <input
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
                className="bg-[#464E56] dark:bg-[#26B6B6] text-white rounded-full p-1.5 h-8 w-8 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Recent Searches & Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 text-xs">
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
        </div>

        {/* ROW 2: Secondary Navigation Bar (Always visible beneath Row 1) */}
        <div className="border-t border-gray-100 dark:border-gray-800 py-2 sm:py-2.5">
          
          {/* Desktop/Tablet secondary bar navigation (Hidden below sm, inline menu) */}
          <div className="hidden sm:flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
            
            {/* Primary Navigation Menu (5 Items Centered) */}
            <div className="flex items-center gap-4 md:gap-6 text-xs font-extrabold">
              
              {/* Category Dropdown Menu anchor */}
              <div 
                className="relative" 
                ref={categoriesRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  id="nav-categories"
                  onClick={(e) => {
                    e.preventDefault();
                    setCategoriesDropdownOpen(prev => !prev);
                  }}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 font-extrabold shadow-2xs hover:shadow-xs hover:scale-102 ${
                    currentView === 'categories' || categoriesDropdownOpen
                      ? 'text-[#26B6B6] bg-[#26B6B6]/10 border border-[#26B6B6]/20' 
                      : 'text-gray-650 dark:text-gray-305 hover:text-[#26B6B6] border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <span>{isRtl ? 'دسته‌بندی‌ها' : 'Categories'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-[#26B6B6]' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* برای طراحان و مهندسان (For Designers) */}
              <button
                id="nav-designers"
                onClick={() => onNavigate('for-designers')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'for-designers'
                    ? 'text-[#26B6B6] bg-[#26B6B6]/5 font-black' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-[#26B6B6]'
                }`}
              >
                {isRtl ? 'برای طراحان و مهندسان' : 'For Designers'}
              </button>

              {/* برای تولیدکنندگان (For Manufacturers) */}
              <button
                id="nav-manufacturers-persuasion"
                onClick={() => onNavigate('for-manufacturers')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'for-manufacturers'
                    ? 'text-[#26B6B6] bg-[#26B6B6]/5 font-black' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-[#26B6B6]'
                }`}
              >
                {isRtl ? 'برای تولیدکنندگان' : 'For Manufacturers'}
              </button>

              {/* معرفی ایران‌بیم‌هاب (About) */}
              <button
                id="nav-about"
                onClick={() => onNavigate('about')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'about'
                    ? 'text-[#26B6B6] bg-[#26B6B6]/5 font-black' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-[#26B6B6]'
                }`}
              >
                {isRtl ? 'معرفی ایران‌بیم‌هاب' : 'About IranBIMhub'}
              </button>

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

            {/* Desktop Join Platform CTA Button */}
            <div className="flex items-center">
              <button
                onClick={currentUser ? () => handleDashboardNavigate('profile') : onOpenAuthModal}
                className="relative group overflow-hidden px-4.5 py-1.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white dark:text-gray-950 dark:bg-[#26B6B6] dark:hover:bg-[#1e9494] rounded-full text-xs font-black shadow-xs hover:shadow-md transition-all duration-300 active:scale-97 cursor-pointer flex items-center gap-1.5 hover:scale-102"
              >
                <User className="w-3.5 h-3.5" />
                <span>
                  {currentUser 
                    ? (isRtl ? 'پنل کاربری' : 'Go to Dashboard')
                    : (isRtl ? 'ورود/ثبت نام' : 'Join Platform')
                  }
                </span>
              </button>
            </div>

          </div>

          {/* Mobile responsive view: Centered horizontal secondary menu containing navigation links */}
          <div className="flex sm:hidden items-center justify-center gap-4 px-4 py-1.5 select-none w-full border-t border-gray-150/40 dark:border-gray-800/40" id="mobile-nav-bar-combined">
            {/* Navigation buttons: About Us, Contact & Join */}
            <div className="flex items-center justify-center gap-3">
              <button
                id="mobile-nav-about"
                onClick={() => onNavigate('about')}
                className={`py-1.5 px-2.5 text-xs transition-colors shrink-0 font-extrabold rounded-lg ${
                  currentView === 'about' ? 'text-[#26B6B6] bg-[#26B6B6]/5 font-black' : 'text-gray-650 dark:text-gray-300 hover:text-[#26B6B6]'
                }`}
              >
                {isRtl ? 'درباره ما' : 'About Us'}
              </button>
              <button
                id="mobile-nav-contact"
                onClick={() => onNavigate('contact')}
                className={`py-1.5 px-2.5 text-xs transition-colors shrink-0 font-extrabold rounded-lg ${
                  currentView === 'contact' ? 'text-[#26B6B6] bg-[#26B6B6]/5 font-black' : 'text-gray-650 dark:text-gray-300 hover:text-[#26B6B6]'
                }`}
              >
                {isRtl ? 'تماس با ما' : 'Contact Us'}
              </button>
              <button
                id="mobile-nav-auth"
                onClick={currentUser ? () => handleDashboardNavigate('profile') : onOpenAuthModal}
                className="py-1 px-3 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-full text-xs font-black transition-all duration-150 active:scale-95 shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5 hover:scale-102"
              >
                <User className="w-3.5 h-3.5" />
                <span>
                  {currentUser 
                    ? (isRtl ? 'پنل کاربری' : 'Dashboard')
                    : (isRtl ? 'ورود/ثبت نام' : 'Join')
                  }
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>
      
      <SplitPaneNavMenu
        isOpen={categoriesDropdownOpen}
        onClose={() => setCategoriesDropdownOpen(false)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onSelect={(catId, subId, format) => handleCategorySelect(catId, subId || null, format || null)}
        onNavigate={onNavigate}
      />
    </header>
  );
};
