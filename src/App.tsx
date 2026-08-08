import React, { useState, useEffect } from 'react';
import { toast, ToastProvider } from './components/ui/toast';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { LoadingProvider, useLoading } from './components/LoadingContext';
import { SiteConfigProvider } from './components/SiteConfigContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BIMObject, FilterState } from './types';
import { BIM_OBJECTS, MANUFACTURERS } from './data';
import { AuthModal } from './components/AuthModal';
import { appendDownloadEntry, getTodayDownloadCount, DAILY_FREE_LIMIT } from './lib/downloadHistory';
import { Home, Layers, Building, Heart, User, ArrowUp, Folder, Package, MessageSquare } from 'lucide-react';

// Import Views
import { HomeView } from './components/views/HomeView';
import { ObjectDetailView } from './components/views/ObjectDetailView';
import { ManufacturerDashboard } from './components/views/ManufacturerDashboard';
import { ModelerDashboard } from './components/views/ModelerDashboard';
import { AboutView } from './components/views/AboutView';
import { LearnView } from './components/views/LearnView';
import { IntroductionView } from './components/views/IntroductionView';
import { BrandPageView } from './components/views/BrandPageView';
import { ForDesignersView } from './components/views/ForDesignersView';
import { ForManufacturersView } from './components/views/ForManufacturersView';
import { BIMModelerCollaborationView } from './components/views/BIMModelerCollaborationView';
import { AdminControlPanel } from './components/admin/AdminControlPanel';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';
import { TermsOfServiceView } from './components/views/TermsOfServiceView';
import { PaymentView } from './components/views/PaymentView';
import { CatalogLibraryView } from './components/views/CatalogLibraryView';
import { CatalogProductDetailView } from './components/views/CatalogProductDetailView';
import { ProductDataCompletionPanel } from './components/views/ProductDataCompletionPanel';
import { PUBLISHED_CATALOG_PRODUCTS, SAMPLE_CATALOG_PRODUCTS } from './lib/catalog';

// Inner App with context
const MainAppContent: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const { triggerTransition } = useLoading();

  // Library path is deliberately separate from the legacy filter state.
  // It mirrors the stable two-level taxonomy URL: /library/:family/:subcategory.
  const [libraryPath, setLibraryPath] = useState<{ categorySlug?: string; subcategorySlug?: string }>({});
  const [catalogProductId, setCatalogProductId] = useState<string | null>(null);

  // Payment states
  const [paymentPlanId, setPaymentPlanId] = useState<string>('modeler-vip');
  const [previousViewBeforePayment, setPreviousViewBeforePayment] = useState<string>('home');
  
  // Navigation View State
  const [currentView, setCurrentView] = useState<string>(() => {
    // If we're visiting /admin or #admin, boot immediately into admin panel
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      return 'admin-panel';
    }
    // If there is an active session for manufacturer, load it
    const profile = localStorage.getItem('iranbimhub_mfg_profile');
    if (profile) return 'manufacturer-dashboard';
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setCurrentView('admin-panel');
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // Sync view from URL on load (back/forward buttons)
    const syncFromUrl = () => {
      const path = window.location.pathname.replace(/^\//, '').split('/');
      const viewFromUrl = path[0] || 'home';
      const paramFromUrl = path[1] || '';
      const secondParamFromUrl = path[2] || '';
      if (viewFromUrl === 'library') {
        // Product records have their own stable route. Preview is deliberately
        // isolated from public records and is never linked from the library.
        if ((paramFromUrl === 'product' || paramFromUrl === 'preview') && secondParamFromUrl) {
          setCatalogProductId(secondParamFromUrl);
          setCurrentView(paramFromUrl === 'preview' ? 'catalog-preview' : 'catalog-product');
          return;
        }
        setLibraryPath({
          categorySlug: paramFromUrl || undefined,
          subcategorySlug: secondParamFromUrl || undefined,
        });
      }
      if (viewFromUrl === 'catalog-completion-preview' && paramFromUrl) {
        setCatalogProductId(paramFromUrl);
        setCurrentView('catalog-completion-preview');
        return;
      }
      // Legacy cleanup: /categories is replaced by the approved two-level /library route.
      if (viewFromUrl === 'categories') {
        window.history.replaceState({ view: 'library' }, '', '/library');
        setLibraryPath({});
        setCurrentView('library');
        return;
      }
      // Legacy cleanup: the old manufacturer onboarding page was removed.
      // Any old direct URL should land on the current manufacturer page.
      if (viewFromUrl === 'manufacturer-onboarding') {
        window.history.replaceState({ view: 'for-manufacturers' }, '', '/for-manufacturers');
        setCurrentView('for-manufacturers');
        return;
      }
      // Deep links like /detail/<objectId> (used by the new share feature, item 19)
      // must resolve the object from the catalog state, otherwise a fresh visit
      // would bounce to the home page.
      if (viewFromUrl === 'detail' && paramFromUrl) {
        let customList: BIMObject[] = [];
        try {
          customList = JSON.parse(localStorage.getItem('iranbimhub_custom_objects_v2') || '[]') || [];
        } catch { customList = []; }
        const found =
          BIM_OBJECTS.find(o => o.id === paramFromUrl) ||
          customList.find(o => o && o.id === paramFromUrl);
        if (found) setActiveObject(found);
      }
      if (viewFromUrl && (viewFromUrl === 'home' || viewFromUrl === 'admin-panel' || ['about','contact','categories','library','detail','brand','manufacturers','for-designers','for-manufacturers','manufacturer-dashboard','modeler-dashboard','learn','introduction','for-bim-modelers','privacy','terms','payment'].includes(viewFromUrl))) {
        setCurrentView(viewFromUrl);
        if (viewFromUrl === 'brand' && paramFromUrl) {
          setActiveManufacturerId(paramFromUrl);
        }
      }
    };
    window.addEventListener('popstate', syncFromUrl);
    syncFromUrl();

    (window as any).onNavigateToView = (view: string, param?: string) => {
      if (view === 'brand' && param) {
        handleViewBrand(param);
      } else if (view === 'payment') {
        if (param) setPaymentPlanId(param);
        setCurrentView(prev => {
          setPreviousViewBeforePayment(prev);
          return 'payment';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigateTo(view);
      }
    };
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', syncFromUrl);
      delete (window as any).onNavigateToView;
    };
  }, []);

  const navigateTo = (view: string, customTextFa?: string, customTextEn?: string, param?: string) => {
    // The previous catalog route now resolves to the approved two-level library.
    if (view === 'categories') {
      view = 'library';
      param = undefined;
    }
    // Legacy cleanup: redirect removed manufacturer onboarding route to manufacturer page.
    if (view === 'manufacturer-onboarding') {
      view = 'for-manufacturers';
      param = undefined;
    }
    // Update browser URL so SEO and sharing work
    const urlPath = view === 'home' ? '/' : `/${view}${param ? '/' + param : ''}`;
    window.history.pushState({ view, param }, '', urlPath);

    if (view === 'payment') {
      if (param) setPaymentPlanId(param);
      setCurrentView(prev => {
        setPreviousViewBeforePayment(prev);
        return 'payment';
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    triggerTransition(() => {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, customTextFa || (isRtl ? 'در حال انتقال...' : 'Navigating...'), customTextEn || 'Navigating...', 500);
  };

  const navigateLibrary = (categorySlug?: string, subcategorySlug?: string) => {
    const safeCategory = categorySlug?.trim();
    const safeSubcategory = subcategorySlug?.trim();
    const path = safeCategory
      ? `/library/${safeCategory}${safeSubcategory ? `/${safeSubcategory}` : ''}`
      : '/library';
    window.history.pushState({ view: 'library', categorySlug: safeCategory, subcategorySlug: safeSubcategory }, '', path);
    triggerTransition(() => {
      setLibraryPath({ categorySlug: safeCategory, subcategorySlug: safeSubcategory });
      setCurrentView('library');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, isRtl ? 'در حال باز کردن کتابخانهٔ محصولات...' : 'Opening product library...', 'Opening product library...', 350);
  };

  const handleDashboardTabNavigate = (view: string, tab: string) => {
    setActiveDashboardTab(tab);
    navigateTo(view);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('change-dashboard-tab', { detail: { tab } }));
    }, 50);
  };

  const handleSelectObject = (obj: BIMObject) => {
    triggerTransition(() => {
      setActiveObject(obj);
      setCurrentView('detail');
      window.history.pushState({ view: 'detail', param: obj.id }, '', `/detail/${obj.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, isRtl ? 'در حال بارگذاری مشخصات فنی آبجکت...' : 'Loading BIM Object specifications...', 'Loading BIM Object specifications...', 600);
  };

  const handleViewBrand = (mfgId: string) => {
    triggerTransition(() => {
      setActiveManufacturerId(mfgId);
      setCurrentView('brand');
      window.history.pushState({ view: 'brand', param: mfgId }, '', `/brand/${mfgId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, isRtl ? 'در حال بارگذاری کاتالوگ دیجیتال برند...' : 'Loading Brand digital catalog...', 'Loading Brand digital catalog...', 600);
  };

  const [activeObject, setActiveObject] = useState<BIMObject | null>(null);
  const [activeManufacturerId, setActiveManufacturerId] = useState<string | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    const local = localStorage.getItem('iranbimhub_user_session');
    return local ? JSON.parse(local) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Where was the user when the auth gate opened? After login/registration they
  // land back on exactly that page (e.g. the object page they tried to download from).
  const [authReturnView, setAuthReturnView] = useState<string | null>(null);
  const [authIntent, setAuthIntent] = useState<'download' | 'save' | 'generic'>('generic');

  const openAuthModal = (intent: 'download' | 'save' | 'generic' = 'generic') => {
    setAuthReturnView(currentView);
    setAuthIntent(intent);
    setIsAuthModalOpen(true);
  };

  // Dark Mode State
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Filter state for search/category page
  const [filterState, setFilterState] = useState<FilterState>({
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
    isIranBrand: null,
    hasCutsheet: null,
    hasSample: null,
    specifics: {}
  });

  // Saved / Compare state (Synchronized with localStorage)
  const [savedObjects, setSavedObjects] = useState<string[]>(() => {
    const local = localStorage.getItem('iranbimhub_saved_ids');
    return local ? JSON.parse(local) : [];
  });

  const [comparedObjects, setComparedObjects] = useState<string[]>(() => {
    const local = localStorage.getItem('iranbimhub_compared_ids');
    return local ? JSON.parse(local) : [];
  });

  // User type switcher state
  const [userRole, setUserRole] = useState<'Modeler' | 'Manufacturer'>(() => {
    const profile = localStorage.getItem('iranbimhub_mfg_profile');
    return profile ? 'Manufacturer' : 'Modeler';
  });

  // Manufacturer registered profile state
  const [companyProfile, setCompanyProfile] = useState<any | null>(() => {
    const local = localStorage.getItem('iranbimhub_mfg_profile');
    return local ? JSON.parse(local) : null;
  });

  // State to track if Split-Pane Categories Menu is currently open
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Active dashboard tab state for navigation highlighting
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>('overview');

  useEffect(() => {
    const handleProfileSync = () => {
      const local = localStorage.getItem('iranbimhub_mfg_profile');
      if (local) {
        setCompanyProfile(JSON.parse(local));
      }
    };
    window.addEventListener('iranbimhub_brand_profile_updated', handleProfileSync);
    return () => window.removeEventListener('iranbimhub_brand_profile_updated', handleProfileSync);
  }, []);

  useEffect(() => {
    const handleTabSync = (e: Event) => {
      const { tab } = (e as CustomEvent).detail;
      setActiveDashboardTab(tab);
    };
    window.addEventListener('change-dashboard-tab', handleTabSync);
    return () => window.removeEventListener('change-dashboard-tab', handleTabSync);
  }, []);

  useEffect(() => {
    const handleNavigateToView = (e: Event) => {
      const { view, param } = (e as CustomEvent).detail;
      navigateTo(view, undefined, undefined, param);
    };
    window.addEventListener('navigate-to-view', handleNavigateToView);
    return () => window.removeEventListener('navigate-to-view', handleNavigateToView);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMenuChange = (e: Event) => {
      const { open } = (e as CustomEvent).detail;
      setIsCategoriesMenuOpen(open);
    };
    window.addEventListener('categories-menu-changed', handleMenuChange);
    return () => window.removeEventListener('categories-menu-changed', handleMenuChange);
  }, []);

  // Listen to custom event for header categories navigation
  useEffect(() => {
    const handleSelectCategoryFilter = (e: Event) => {
      const { categoryId, subcategoryId, format } = (e as CustomEvent).detail;
      setFilterState(prev => ({
        ...prev,
        category: categoryId,
        subcategory: subcategoryId,
        formats: format ? [format] : [],
        specifics: {}
      }));
    };
    window.addEventListener('select-category-filter', handleSelectCategoryFilter);
    return () => window.removeEventListener('select-category-filter', handleSelectCategoryFilter);
  }, []);

  // Helper to get all combined & deduplicated BIM objects
  const getAllBimObjects = (): BIMObject[] => {
    try {
      const saved = localStorage.getItem('iranbimhub_custom_objects_v2');
      const custom = saved ? JSON.parse(saved) : [];
      const map = new Map<string, BIMObject>();
      BIM_OBJECTS.forEach(obj => { if (obj && obj.id) map.set(obj.id, obj); });
      custom.forEach((obj: BIMObject) => { if (obj && obj.id) map.set(obj.id, obj); });
      return Array.from(map.values());
    } catch {
      return BIM_OBJECTS;
    }
  };

  // Listen to custom event for directly opening BIM objects from search autocomplete
  useEffect(() => {
    const handleSelectBimObject = (e: Event) => {
      const { objectId } = (e as CustomEvent).detail;
      const allObjs = getAllBimObjects();
      const targetObj = allObjs.find(o => o.id === objectId);
      if (targetObj) {
        handleSelectObject(targetObj);
      }
    };
    window.addEventListener('select-bim-object', handleSelectBimObject);
    return () => window.removeEventListener('select-bim-object', handleSelectBimObject);
  }, []);

  // Global keyboard shortcuts (Ctrl+K to focus search input, Esc to close any open modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K to focus the header search input
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('header-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Check for Esc key to close open modals (such as AuthModal)
      if (e.key === 'Escape' || e.key === 'Esc') {
        setIsAuthModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('iranbimhub_saved_ids', JSON.stringify(savedObjects));
  }, [savedObjects]);

  useEffect(() => {
    localStorage.setItem('iranbimhub_compared_ids', JSON.stringify(comparedObjects));
  }, [comparedObjects]);

  const handleToggleSave = (id: string) => {
    if (!currentUser) {
      openAuthModal('save');
      toast(isRtl ? 'جهت ذخیره فایل‌ها در لیست علاقمندی‌ها، ابتدا باید وارد حساب کاربری خود شوید.' : 'Please register or log in to save objects to your favorites.');
      return;
    }
    setSavedObjects(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id: string) => {
    const allObjs = getAllBimObjects();
    const targetObj = allObjs.find(o => o.id === id);
    if (!targetObj) return;

    setComparedObjects(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        if (prev.length > 0) {
          const firstObj = allObjs.find(o => o.id === prev[0]);
          if (firstObj && (firstObj.category !== targetObj.category || firstObj.subcategory !== targetObj.subcategory)) {
            toast(isRtl 
              ? 'طبق قوانین ایران‌بیم‌هاب، مقایسه فقط بین آبجکت‌های با دسته‌بندی و زیردسته‌بندی کاملاً یکسان مجاز است!' 
              : 'By policy, comparison is only permitted between objects of the exact same category and subcategory!'
            );
            return prev;
          }
        }
        if (prev.length >= 4) {
          toast(isRtl ? 'حداکثر می‌توانید ۴ محصول را همزمان مقایسه کنید.' : 'You can compare up to 4 products at a time.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleQuickDownload = (obj: BIMObject, format: string) => {
    if (!currentUser) {
      openAuthModal('download');
      toast(isRtl 
        ? 'طبق ضوابط، دانلود فایل کاتالوگ یا آبجکت BIM منوط به ثبت‌نام و ورود است! لطفا وارد شوید.' 
        : 'All file downloads require registration and logging in first.'
      );
      return;
    }

    // Check download limit for regular (free) users — REAL counting from unified history
    if (!currentUser.isPremium) {
      if (getTodayDownloadCount() >= DAILY_FREE_LIMIT) {
        toast(isRtl 
          ? 'خطا: شما به سقف دانلود روزانه ۵ فایل رایگان رسیده‌اید! لطفاً فردا مجدداً تلاش نمایید یا حساب خود را ارتقا دهید.' 
          : 'Limit exceeded: You have reached your limit of 5 free downloads per day!'
        );
        return;
      }
    }

    triggerTransition(() => {
      // 1. Append to the unified, real download history (shared with the user dashboard)
      const mfgName = MANUFACTURERS.find(m => m.id === obj.manufacturerId);
      appendDownloadEntry({
        objectId: obj.id,
        titleFa: obj.titleFa,
        titleEn: obj.titleEn,
        format,
        fileSize: obj.fileSize,
        manufacturerName: mfgName ? (isRtl ? mfgName.nameFa : mfgName.nameEn) : undefined,
      });
      
      // 2. Trigger browser download effect
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.click();
      
      toast(isRtl 
        ? `دانلود موفق فایل فمیلی بیم محصول «${obj.titleFa}» با فرمت ${format}.`
        : `BIM family object downloaded successfully: ${obj.titleEn} (${format}).`
      );
    }, isRtl ? 'در حال آماده‌سازی و بررسی اصالت هندسی فمیلی...' : 'Verifying and preparing BIM family...', 'Verifying and preparing BIM family...', 800);
  };

  const handleHeaderSearch = (query: string) => {
    // Product result search is intentionally introduced with the structured
    // filter engine in phase three. Until then, category suggestions route to
    // the real library and a free-text query must not surface legacy mock data.
    setFilterState(prev => ({ ...prev, search: query }));
    navigateLibrary();
  };

  const handlePublishNewObject = (newObj: BIMObject) => {
    toast(isRtl 
      ? `محصول جدید «${newObj.titleFa}» با موفقیت در بازار منتشر شد!` 
      : `Successfully published ${newObj.titleEn} in the directory!`
    );
  };

  const handleChangeRole = (role: 'Modeler' | 'Manufacturer') => {
    setUserRole(role);
    if (role === 'Manufacturer') {
      const profile = localStorage.getItem('iranbimhub_mfg_profile');
      if (profile) {
        setCurrentView('manufacturer-dashboard');
      } else {
        setCurrentView('for-manufacturers');
      }
    } else {
      setCurrentView('modeler-dashboard');
    }
  };

  // Convert compared IDs to actual objects
  const comparedListObjects = getAllBimObjects().filter(o => comparedObjects.includes(o.id));

  // Render proper body based on currentView route
  const renderViewContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            onNavigate={navigateTo}
            onFilterChange={(updates) => setFilterState(prev => ({ ...prev, ...updates }))}
            onSelectObject={handleSelectObject}
            savedObjects={savedObjects}
            onToggleSave={handleToggleSave}
            onQuickDownload={handleQuickDownload}
            onViewBrand={handleViewBrand}
            currentUser={currentUser}
            onOpenAuthModal={() => openAuthModal()}
          />
        );
      
      case 'catalog-preview': {
        const product = SAMPLE_CATALOG_PRODUCTS.find(item => item.id === catalogProductId);
        return product ? <CatalogProductDetailView product={product} preview onBack={() => navigateLibrary('doors-windows-openings', 'windows')} onRequest={() => navigateTo('modeler-dashboard')} onViewCompletion={() => {
          window.history.pushState({ view: 'catalog-completion-preview', productId: product.id }, '', `/catalog-completion-preview/${product.id}`);
          setCatalogProductId(product.id);
          setCurrentView('catalog-completion-preview');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} /> : null;
      }

      case 'catalog-completion-preview': {
        const product = SAMPLE_CATALOG_PRODUCTS.find(item => item.id === catalogProductId);
        return product ? <ProductDataCompletionPanel product={product} preview onBack={() => {
          window.history.pushState({ view: 'catalog-preview', productId: product.id }, '', `/library/preview/${product.id}`);
          setCurrentView('catalog-preview');
        }} /> : null;
      }

      case 'catalog-product': {
        const product = PUBLISHED_CATALOG_PRODUCTS.find(item => item.id === catalogProductId);
        return product ? <CatalogProductDetailView product={product} onBack={() => navigateLibrary()} onRequest={() => navigateTo('modeler-dashboard')} /> : (
          <div className="max-w-xl mx-auto py-16 px-4 text-center"><h2 className="text-xl font-bold text-gray-800 dark:text-white">{isRtl ? 'محصول موردنظر پیدا نشد' : 'Product not found'}</h2><button onClick={() => navigateLibrary()} className="mt-4 bg-[#0F3D5E] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">{isRtl ? 'بازگشت به کتابخانه' : 'Back to library'}</button></div>
        );
      }

      case 'categories':
      case 'library':
        return (
          <CatalogLibraryView
            categorySlug={currentView === 'library' ? libraryPath.categorySlug : undefined}
            subcategorySlug={currentView === 'library' ? libraryPath.subcategorySlug : undefined}
            onNavigateLibrary={navigateLibrary}
            onNavigate={navigateTo}
          />
        );

       case 'detail':
        if (!activeObject) {
          setCurrentView('home');
          return null;
        }
        return (
          <ObjectDetailView
            object={activeObject}
            onBack={() => navigateTo('categories')}
            onToggleSave={handleToggleSave}
            isSaved={savedObjects.includes(activeObject.id)}
            onDownloadFile={(format) => handleQuickDownload(activeObject, format)}
            onSelectObject={handleSelectObject}
            onNavigate={navigateTo}
            onViewBrand={handleViewBrand}
            onOpenAuthModal={() => openAuthModal()}
          />
        );

      case 'brand': {
        const mfg = MANUFACTURERS.find(m => m.id === activeManufacturerId);
        if (!mfg) {
          setCurrentView('home');
          return null;
        }
        return (
          <BrandPageView
            manufacturer={mfg}
            onBack={() => {
              if (activeObject) {
                navigateTo('detail');
              } else {
                navigateTo('categories');
              }
            }}
            onSelectObject={handleSelectObject}
            onToggleSave={handleToggleSave}
            savedObjects={savedObjects}
            onQuickDownload={handleQuickDownload}
            onNavigate={navigateTo}
          />
        );
      }

      case 'for-designers':
        return (
          <ForDesignersView
            onNavigate={navigateTo}
            onOpenAuthModal={() => openAuthModal()}
            savedObjects={savedObjects}
            onToggleSave={handleToggleSave}
            onQuickDownload={handleQuickDownload}
            onSelectObject={handleSelectObject}
            currentUser={currentUser}
          />
        );

      case 'for-manufacturers':
        return (
          <ForManufacturersView
            onNavigate={navigateTo}
            onOpenAuthModal={() => openAuthModal()}
            currentUser={currentUser}
          />
        );

      case 'manufacturer-dashboard':
        return (
          <ManufacturerDashboard
            companyProfile={companyProfile}
            onPublishNewObject={handlePublishNewObject}
            onSelectObject={handleSelectObject}
            onViewBrand={handleViewBrand}
            onLogout={() => {
              triggerTransition(() => {
                setCurrentUser(null);
                localStorage.removeItem('iranbimhub_user_session');
                localStorage.removeItem('iranbimhub_mfg_profile');
                setCompanyProfile(null);
                setUserRole('Modeler');
                setCurrentView('home');
              }, isRtl ? 'در حال خروج از سیستم...' : 'Signing out...', 'Signing out...', 600);
            }}
          />
        );

      case 'modeler-dashboard':
        return (
          <ModelerDashboard
            savedObjects={savedObjects}
            comparedObjects={comparedObjects}
            onToggleSave={handleToggleSave}
            onSelectObject={handleSelectObject}
            onQuickDownload={handleQuickDownload}
            onLogout={() => {
              triggerTransition(() => {
                setCurrentUser(null);
                localStorage.removeItem('iranbimhub_user_session');
                localStorage.removeItem('iranbimhub_mfg_profile');
                setCompanyProfile(null);
                setUserRole('Modeler');
                setCurrentView('home');
              }, isRtl ? 'در حال خروج از سیستم...' : 'Signing out...', 'Signing out...', 600);
            }}
            onViewBrand={handleViewBrand}
          />
        );

      case 'manufacturers':
        return (
          <AboutView
            viewMode="manufacturers"
            onNavigate={navigateTo}
            onViewBrand={handleViewBrand}
          />
        );

      case 'about':
        return (
          <AboutView
            viewMode="about"
            onNavigate={navigateTo}
          />
        );

      case 'contact':
        return (
          <AboutView
            viewMode="contact"
            onNavigate={navigateTo}
          />
        );

      case 'introduction':
        return (
          <IntroductionView
            onNavigate={navigateTo}
          />
        );

      case 'learn':
        return (
          <LearnView
            onNavigate={navigateTo}
          />
        );

      case 'privacy':
        return (
          <PrivacyPolicyView
            onNavigate={navigateTo}
          />
        );

      case 'terms':
        return (
          <TermsOfServiceView
            onNavigate={navigateTo}
          />
        );

      case 'for-bim-modelers':
        return (
          <BIMModelerCollaborationView
            onNavigate={navigateTo}
          />
        );

      case 'payment':
        return (
          <PaymentView
            planId={paymentPlanId}
            onBack={() => {
              navigateTo(previousViewBeforePayment || 'home');
            }}
            onPaymentSuccess={(userType, tier) => {
              if (userType === 'Modeler') {
                const updated = { ...currentUser, isPremium: true };
                setCurrentUser(updated);
                localStorage.setItem('iranbimhub_user_session', JSON.stringify(updated));
              } else {
                const localMfg = localStorage.getItem('iranbimhub_mfg_profile');
                const parsed = localMfg ? JSON.parse(localMfg) : null;
                const updatedProfile = parsed 
                  ? { ...parsed, tier: tier } 
                  : { tier: tier };
                setCompanyProfile(updatedProfile);
                localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(updatedProfile));
                
                // Also trigger a window reload or custom event to keep states in sync
                window.dispatchEvent(new CustomEvent('mfg-profile-updated', { detail: updatedProfile }));
              }
            }}
          />
        );

      default:
        return (
          <div className="max-w-xl mx-auto py-16 px-4 text-center">
            <h2 className="text-xl font-bold text-gray-800">404 - Not Found</h2>
            <button onClick={() => navigateTo('home')} className="mt-4 bg-[#26B6B6] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">
              Go Home
            </button>
          </div>
        );
    }
  };

  if (currentView === 'admin-panel') {
    return <AdminControlPanel />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans flex flex-col justify-between selection:bg-[#26B6B6]/20 transition-colors">
      
      {/* Top Banner & Main Nav */}
      <Header
        currentView={currentView}
        onNavigate={(view, pathParam) => {
          if (view === 'library') {
            const [categorySlug, subcategorySlug] = (pathParam || '').split('/').filter(Boolean);
            navigateLibrary(categorySlug, subcategorySlug);
            return;
          }
          navigateTo(view);
        }}
        userRole={userRole}
        onChangeRole={handleChangeRole}
        savedCount={savedObjects.length}
        compareCount={comparedObjects.length}
        currentUser={currentUser}
        onLogout={() => {
          triggerTransition(() => {
            setCurrentUser(null);
            localStorage.removeItem('iranbimhub_user_session');
            localStorage.removeItem('iranbimhub_mfg_profile');
            setCompanyProfile(null);
            setUserRole('Modeler');
            setCurrentView('home');
          }, isRtl ? 'در حال خروج از سیستم...' : 'Signing out...', 'Signing out...', 600);
        }}
        onOpenAuthModal={() => openAuthModal()}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onHeaderSearch={handleHeaderSearch}
      />

      {/* Main layout frame with staggered animation entry */}
      <main className="flex-1 w-full bg-white dark:bg-gray-950 transition-colors pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderViewContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Branded Footer */}
      <Footer 
        onNavigate={navigateTo}
      />

      {/* Sticky App-like Mobile Bottom Navigation (4-item Adaptive 3-State Layout with High-Fidelity Glassmorphism) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/75 dark:bg-gray-950/80 backdrop-blur-xl border-t border-white/20 dark:border-white/5 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)] flex justify-around items-center h-16 md:hidden select-none px-1.5" dir="rtl">
        
        {/* ================= STATE 1: GUEST ================= */}
        {!currentUser && (
          <>
            {/* 1. Home - خانه */}
            <button
              onClick={() => navigateTo('home')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <Home className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'خانه' : 'Home'}</span>
            </button>

            {/* 2. BIM Catalog - کاتالوگ بیم */}
            <button
              onClick={() => navigateTo('categories')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer ${
                currentView === 'categories'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <Layers className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'کاتالوگ بیم' : 'BIM Catalog'}</span>
            </button>

            {/* 3. Brands - برندها */}
            <button
              onClick={() => navigateTo('manufacturers')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer ${
                currentView === 'manufacturers'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <Building className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'برندها' : 'Brands'}</span>
            </button>

            {/* 4. Login / Sign Up - ورود / ثبت‌نام */}
            <button
              onClick={() => openAuthModal()}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              style={{ flexBasis: '25%' }}
            >
              <User className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'ورود / ثبت‌نام' : 'Login / Sign Up'}</span>
            </button>
          </>
        )}

        {/* ================= STATE 2: ENGINEER / ARCHITECT ================= */}
        {currentUser && userRole === 'Modeler' && (
          <>
            {/* 1. Home - خانه */}
            <button
              onClick={() => handleDashboardTabNavigate('modeler-dashboard', 'overview')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer ${
                currentView === 'modeler-dashboard' && activeDashboardTab === 'overview'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <Home className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'خانه' : 'Home'}</span>
            </button>

            {/* 2. BIM Catalog - کاتالوگ بیم */}
            <button
              onClick={() => navigateTo('categories')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer ${
                currentView === 'categories'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <Layers className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'کاتالوگ بیم' : 'BIM Catalog'}</span>
            </button>

            {/* 3. My Library - کتابخانه من */}
            <button
              onClick={() => handleDashboardTabNavigate('modeler-dashboard', 'collections')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer relative ${
                currentView === 'modeler-dashboard' && (activeDashboardTab === 'collections' || activeDashboardTab === 'history')
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <Folder className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'کتابخانه من' : 'My Library'}</span>
              {savedObjects.length > 0 && (
                <span className="absolute top-1.5 right-1/2 translate-x-3.5 bg-[#26B6B6] text-white font-sans text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-md border border-white animate-fadeIn">
                  {savedObjects.length}
                </span>
              )}
            </button>

            {/* 4. My Account - حساب من */}
            <button
              onClick={() => handleDashboardTabNavigate('modeler-dashboard', 'profile')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer ${
                currentView === 'modeler-dashboard' && activeDashboardTab === 'profile'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <User className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'حساب من' : 'My Account'}</span>
            </button>
          </>
        )}

        {/* ================= STATE 3: MANUFACTURER / BRAND OWNER ================= */}
        {currentUser && userRole === 'Manufacturer' && (
          <>
            {/* 1. Home - خانه */}
            <button
              onClick={() => handleDashboardTabNavigate('manufacturer-dashboard', 'overview')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer ${
                currentView === 'manufacturer-dashboard' && activeDashboardTab === 'overview'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <Home className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'خانه' : 'Home'}</span>
            </button>

            {/* 2. My Products - محصولات من */}
            <button
              onClick={() => handleDashboardTabNavigate('manufacturer-dashboard', 'catalog')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer ${
                currentView === 'manufacturer-dashboard' && activeDashboardTab === 'catalog'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <Package className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'محصولات من' : 'My Products'}</span>
            </button>

            {/* 3. Messages - پیام‌ها */}
            <button
              onClick={() => handleDashboardTabNavigate('manufacturer-dashboard', 'requests')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer relative ${
                currentView === 'manufacturer-dashboard' && activeDashboardTab === 'requests'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <MessageSquare className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'پیام‌ها' : 'Messages'}</span>
              <span className="absolute top-2.5 right-1/2 translate-x-3 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-xs animate-ping" />
              <span className="absolute top-2.5 right-1/2 translate-x-3 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-xs" />
            </button>

            {/* 4. My Account - حساب من */}
            <button
              onClick={() => handleDashboardTabNavigate('manufacturer-dashboard', 'profile')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all cursor-pointer ${
                currentView === 'manufacturer-dashboard' && activeDashboardTab === 'profile'
                  ? 'bg-[#26B6B6]/15 text-[#26B6B6] font-black border border-[#26B6B6]/30 dark:border-[#26B6B6]/40 shadow-2xs backdrop-blur-md'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              style={{ flexBasis: '25%' }}
            >
              <User className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{isRtl ? 'حساب من' : 'My Account'}</span>
            </button>
          </>
        )}

      </div>

      {/* Unified Security Gate Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          triggerTransition(() => {
            setCurrentUser(user);
            localStorage.setItem('iranbimhub_user_session', JSON.stringify(user));
            // Return the user to EXACTLY the page where the auth gate opened
            // (e.g. the product page they tried to download from). Brand accounts
            // still enter their panel unless they came from an actual brand context.
            const returnView = authReturnView;
            setAuthReturnView(null);
            setAuthIntent('generic');
            if (user?.role === 'Manufacturer') {
              setUserRole('Manufacturer');
              setCurrentView(returnView && returnView.startsWith('manufacturer') ? returnView : 'manufacturer-dashboard');
            } else {
              setUserRole('Modeler');
              setCurrentView(returnView && returnView !== 'admin-panel' ? returnView : 'modeler-dashboard');
            }
          }, isRtl ? 'در حال ورود و دریافت فمیلی‌های اختصاصی شما...' : 'Logging in and preparing your custom workspace...', 'Logging in and preparing your custom workspace...', 800);
        }}
        onNavigate={navigateTo}
        authIntent={authIntent}
      />

      {/* Floating Go to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 md:bottom-8 right-6 z-50 p-3 bg-[#26B6B6] text-white rounded-full shadow-lg hover:bg-[#1e9494] transition-all cursor-pointer hover:scale-105 active:scale-95 animate-fadeIn flex items-center justify-center border border-white/20"
          title={isRtl ? 'برو به بالای صفحه' : 'Go to top'}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};

export default function App() {
  return (
    <SiteConfigProvider>
      <LanguageProvider>
        <ToastProvider>
          <LoadingProvider>
            <MainAppContent />
          </LoadingProvider>
        </ToastProvider>
      </LanguageProvider>
    </SiteConfigProvider>
  );
}
