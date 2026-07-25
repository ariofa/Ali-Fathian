import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { LoadingProvider, useLoading } from './components/LoadingContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BIMObject, FilterState } from './types';
import { BIM_OBJECTS, MANUFACTURERS } from './data';
import { AuthModal } from './components/AuthModal';
import { Home, Layers, Building, Heart, User, ArrowUp } from 'lucide-react';

// Import Views
import { HomeView } from './components/views/HomeView';
import { CategoryPageView } from './components/views/CategoryPageView';
import { ObjectDetailView } from './components/views/ObjectDetailView';
import { ManufacturerOnboarding } from './components/views/ManufacturerOnboarding';
import { ManufacturerDashboard } from './components/views/ManufacturerDashboard';
import { ModelerDashboard } from './components/views/ModelerDashboard';
import { AboutView } from './components/views/AboutView';
import { LearnView } from './components/views/LearnView';
import { IntroductionView } from './components/views/IntroductionView';
import { BrandPageView } from './components/views/BrandPageView';
import { ForDesignersView } from './components/views/ForDesignersView';
import { ForManufacturersView } from './components/views/ForManufacturersView';
import { AdminControlPanel } from './components/admin/AdminControlPanel';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';
import { TermsOfServiceView } from './components/views/TermsOfServiceView';
import { PaymentView } from './components/views/PaymentView';

// Inner App with context
const MainAppContent: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const { triggerTransition } = useLoading();

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
      delete (window as any).onNavigateToView;
    };
  }, []);

  const navigateTo = (view: string, customTextFa?: string, customTextEn?: string, param?: string) => {
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

  const handleSelectObject = (obj: BIMObject) => {
    triggerTransition(() => {
      setActiveObject(obj);
      setCurrentView('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, isRtl ? 'در حال بارگذاری مشخصات فنی آبجکت...' : 'Loading BIM Object specifications...', 'Loading BIM Object specifications...', 600);
  };

  const handleViewBrand = (mfgId: string) => {
    triggerTransition(() => {
      setActiveManufacturerId(mfgId);
      setCurrentView('brand');
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

  // Listen to custom event for directly opening BIM objects from search autocomplete
  useEffect(() => {
    const handleSelectBimObject = (e: Event) => {
      const { objectId } = (e as CustomEvent).detail;
      const targetObj = BIM_OBJECTS.find(o => o.id === objectId);
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
      setIsAuthModalOpen(true);
      alert(isRtl ? 'جهت ذخیره فایل‌ها در لیست علاقمندی‌ها، ابتدا باید وارد حساب کاربری خود شوید.' : 'Please register or log in to save objects to your favorites.');
      return;
    }
    setSavedObjects(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id: string) => {
    const targetObj = BIM_OBJECTS.find(o => o.id === id);
    if (!targetObj) return;

    setComparedObjects(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        if (prev.length > 0) {
          const firstObj = BIM_OBJECTS.find(o => o.id === prev[0]);
          if (firstObj && (firstObj.category !== targetObj.category || firstObj.subcategory !== targetObj.subcategory)) {
            alert(isRtl 
              ? 'طبق قوانین ایران‌بیم‌هاب، مقایسه فقط بین آبجکت‌های با دسته‌بندی و زیردسته‌بندی کاملاً یکسان مجاز است!' 
              : 'By policy, comparison is only permitted between objects of the exact same category and subcategory!'
            );
            return prev;
          }
        }
        if (prev.length >= 4) {
          alert(isRtl ? 'حداکثر می‌توانید ۴ محصول را همزمان مقایسه کنید.' : 'You can compare up to 4 products at a time.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleQuickDownload = (obj: BIMObject, format: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      alert(isRtl 
        ? 'طبق ضوابط، دانلود فایل کاتالوگ یا آبجکت BIM منوط به ثبت‌نام و ورود است! لطفا وارد شوید.' 
        : 'All file downloads require registration and logging in first.'
      );
      return;
    }

    // Check download limit for regular (free) users
    if (!currentUser.isPremium) {
      const history = JSON.parse(localStorage.getItem('iranbimhub_dl_history') || '[]');
      const todayString = new Date().toLocaleDateString('fa-IR');
      const todayDownloads = history.filter((dl: any) => dl.date === todayString);
      
      if (todayDownloads.length >= 5) {
        alert(isRtl 
          ? 'خطا: شما به سقف دانلود روزانه ۵ فایل رایگان رسیده‌اید! لطفاً فردا مجدداً تلاش نمایید یا حساب خود را ارتقا دهید.' 
          : 'Limit exceeded: You have reached your limit of 5 free downloads per day!'
        );
        return;
      }
    }

    triggerTransition(() => {
      // 1. Add to local storage history
      const history = JSON.parse(localStorage.getItem('iranbimhub_dl_history') || '[]');
      const isAlreadyInHistory = history.some((dl: any) => dl.objectId === obj.id && dl.format === format);
      
      if (!isAlreadyInHistory) {
        const entry = {
          id: `dl-${Math.random().toString().substring(2,6)}`,
          objectId: obj.id,
          titleFa: obj.titleFa,
          titleEn: obj.titleEn,
          format,
          fileSize: obj.fileSize,
          date: new Date().toLocaleDateString('fa-IR')
        };
        localStorage.setItem('iranbimhub_dl_history', JSON.stringify([entry, ...history]));
      }

      // 2. Trigger browser download effect
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.click();
      
      alert(isRtl 
        ? `دانلود موفق فایل فمیلی بیم محصول «${obj.titleFa}» با فرمت ${format}.`
        : `BIM family object downloaded successfully: ${obj.titleEn} (${format}).`
      );
    }, isRtl ? 'در حال آماده‌سازی و بررسی اصالت هندسی فمیلی...' : 'Verifying and preparing BIM family...', 'Verifying and preparing BIM family...', 800);
  };

  const handleHeaderSearch = (query: string) => {
    triggerTransition(() => {
      setFilterState(prev => ({ ...prev, search: query }));
      setCurrentView('categories');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, isRtl ? 'در حال جستجوی کاتالوگ...' : 'Searching catalog...', 'Searching catalog...', 600);
  };

  const handleCompleteManufacturerOnboarding = (profile: any) => {
    localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(profile));
    setCompanyProfile(profile);
    setUserRole('Manufacturer');
    setCurrentView('manufacturer-dashboard');
    alert(isRtl ? 'ثبت‌نام کاتالوگ با موفقیت انجام شد! به پورتال هوشمند خود خوش آمدید.' : 'Onboarding completed! Welcome to your official brand portal.');
  };

  const handlePublishNewObject = (newObj: BIMObject) => {
    alert(isRtl 
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
  const comparedListObjects = BIM_OBJECTS.filter(o => comparedObjects.includes(o.id));

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
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        );
      
      case 'categories':
        return (
          <CategoryPageView
            filterState={filterState}
            onFilterChange={(updates) => setFilterState(prev => ({ ...prev, ...updates }))}
            onSelectObject={handleSelectObject}
            savedObjects={savedObjects}
            onToggleSave={handleToggleSave}
            onQuickDownload={handleQuickDownload}
            onViewBrand={handleViewBrand}
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
          />
        );
      }

      case 'for-designers':
        return (
          <ForDesignersView
            onNavigate={navigateTo}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            savedObjects={savedObjects}
            onToggleSave={handleToggleSave}
            onQuickDownload={handleQuickDownload}
            currentUser={currentUser}
          />
        );

      case 'for-manufacturers':
        return (
          <ForManufacturersView
            onNavigate={navigateTo}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
          />
        );

      case 'manufacturer-onboarding':
        return (
          <ManufacturerOnboarding
            onCompleteOnboarding={handleCompleteManufacturerOnboarding}
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
        onNavigate={navigateTo}
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
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onHeaderSearch={handleHeaderSearch}
      />

      {/* Main layout frame with staggered animation entry */}
      <main className="flex-1 w-full bg-white dark:bg-gray-950 transition-colors pb-16 md:pb-0">
        {renderViewContent()}
      </main>

      {/* Branded Footer */}
      <Footer 
        onNavigate={navigateTo}
      />

      {/* Sticky App-like Mobile Bottom Navigation (Optimized for mobile phones with enhanced contrast and larger touch targets) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-gray-950/98 backdrop-blur-xl border-t-2 border-[#26B6B6] shadow-[0_-10px_30px_rgba(0,0,0,0.3)] flex justify-around items-center py-2.5 px-2 md:hidden select-none text-white" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Home */}
        <button
          onClick={() => {
            navigateTo('home');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'home' 
              ? 'bg-[#26B6B6]/20 text-[#26B6B6] font-bold scale-105 shadow-xs border border-[#26B6B6]/30' 
              : 'text-gray-300 dark:text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-6 h-6 mb-0.5 shrink-0" />
          <span className="text-xs font-semibold tracking-tight">{isRtl ? 'خانه' : 'Home'}</span>
        </button>

        {/* Categories / Catalog */}
        <button
          onClick={() => {
            if (currentView !== 'categories') {
              navigateTo('categories');
            }
            const event = new CustomEvent('toggle-categories-menu');
            window.dispatchEvent(event);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'categories' || isCategoriesMenuOpen
              ? 'bg-[#26B6B6]/20 text-[#26B6B6] font-bold scale-105 shadow-xs border border-[#26B6B6]/30' 
              : 'text-gray-300 dark:text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-6 h-6 mb-0.5 shrink-0" />
          <span className="text-xs font-semibold tracking-tight">{isRtl ? 'کاتالوگ BIM' : 'BIM Catalog'}</span>
        </button>

        {/* Manufacturers */}
        <button
          onClick={() => {
            navigateTo('manufacturers');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'manufacturers' 
              ? 'bg-[#26B6B6]/20 text-[#26B6B6] font-bold scale-105 shadow-xs border border-[#26B6B6]/30' 
              : 'text-gray-300 dark:text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building className="w-6 h-6 mb-0.5 shrink-0" />
          <span className="text-xs font-semibold tracking-tight">{isRtl ? 'برندها' : 'Brands'}</span>
        </button>

        {/* Saved/Favorites */}
        <button
          onClick={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              navigateTo('modeler-dashboard');
            }
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
            currentView === 'modeler-dashboard' && currentUser
              ? 'bg-[#26B6B6]/20 text-[#26B6B6] font-bold scale-105 shadow-xs border border-[#26B6B6]/30' 
              : 'text-gray-300 dark:text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Heart className="w-6 h-6 mb-0.5 shrink-0" />
          <span className="text-xs font-semibold tracking-tight">{isRtl ? 'نشان‌شده' : 'Saved'}</span>
          {savedObjects.length > 0 && (
            <span className="absolute top-1 right-1/2 translate-x-3 bg-[#26B6B6] text-white font-sans text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-slate-900">
              {savedObjects.length}
            </span>
          )}
        </button>

        {/* Panel */}
        <button
          onClick={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              navigateTo(userRole === 'Modeler' ? 'modeler-dashboard' : 'manufacturer-dashboard');
            }
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            (currentView === 'modeler-dashboard' || currentView === 'manufacturer-dashboard') && currentUser
              ? 'bg-[#26B6B6]/20 text-[#26B6B6] font-bold scale-105 shadow-xs border border-[#26B6B6]/30' 
              : 'text-gray-300 dark:text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-6 h-6 mb-0.5 shrink-0" />
          <span className="text-xs font-semibold tracking-tight">{isRtl ? 'پنل کاربری' : 'Panel'}</span>
        </button>
      </div>

      {/* Unified Security Gate Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          triggerTransition(() => {
            setCurrentUser(user);
            localStorage.setItem('iranbimhub_user_session', JSON.stringify(user));
            if (user?.role === 'Manufacturer') {
              setUserRole('Manufacturer');
              setCurrentView('manufacturer-dashboard');
            } else {
              setUserRole('Modeler');
              setCurrentView('modeler-dashboard');
            }
          }, isRtl ? 'در حال ورود و دریافت فمیلی‌های اختصاصی شما...' : 'Logging in and preparing your custom workspace...', 'Logging in and preparing your custom workspace...', 800);
        }}
        onNavigate={navigateTo}
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
    <LanguageProvider>
      <LoadingProvider>
        <MainAppContent />
      </LoadingProvider>
    </LanguageProvider>
  );
}
