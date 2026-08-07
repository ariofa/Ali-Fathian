import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { CATEGORIES, MANUFACTURERS, BIM_OBJECTS, MOCK_REVIEWS } from '../../data';
import { BIMObject, FilterState } from '../../types';
import { BIMObjectCard } from '../BIMObjectCard';
import { CategoryIcon } from '../CategoryIcon';
import { ARTICLES } from './LearnView';
import { Logo } from '../Logo';
import { HeroCarousel } from '../HeroCarousel';
import { ExpertInsightsSection } from '../ExpertInsightsSection';
import { 
  Search, 
  Download, 
  Layers, 
  Building2, 
  Users, 
  FileCheck2, 
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Cpu,
  BadgePercent,
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeftRight,
  Grid3X3,
  BookOpen,
  Briefcase,
  LineChart,
  Play,
  CheckCircle2,
  Check,
  Building,

  Compass,
  Factory,
  Package,
  ShieldCheck,
  Ruler,
  FolderOpen,
  DoorOpen
} from 'lucide-react';
import { StayConnectedBlock } from '../SocialLinks';


const toPersianDigits = (num: string | number) => {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/[0-9]/g, function (w) {
    return id[+w];
  });
};

const CountUp: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string; isRtl?: boolean }> = ({ 
  end, 
  duration = 1200, 
  prefix = '', 
  suffix = '',
  isRtl = false
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing out quad
      const easeProgress = progress * (2 - progress);
      setValue(Math.floor(easeProgress * end));
      if (progress < 1) {
        animFrameId = window.requestAnimationFrame(step);
      }
    };
    animFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animFrameId) {
        window.cancelAnimationFrame(animFrameId);
      }
    };
  }, [end, duration]);

  const formatted = value.toLocaleString();
  const displayVal = isRtl ? toPersianDigits(formatted) : formatted;

  return (
    <span>
      {prefix}
      {displayVal}
      {suffix}
    </span>
  );
};



interface HomeViewProps {
  onNavigate: (view: string, customTextFa?: string, customTextEn?: string, param?: string) => void;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onSelectObject: (obj: BIMObject) => void;
  savedObjects: string[];
  onToggleSave: (id: string) => void;
  onQuickDownload: (obj: BIMObject, format: string) => void;
  onViewBrand?: (mfgId: string) => void;
  currentUser?: any;
  onOpenAuthModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onFilterChange,
  onSelectObject,
  savedObjects,
  onToggleSave,
  onQuickDownload,
  onViewBrand,
  currentUser,
  onOpenAuthModal
}) => {
  const { language, t, isRtl, formatNumber } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [followedCategories, setFollowedCategories] = useState<string[]>([]);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [openLandingFaq, setOpenLandingFaq] = useState<number | null>(null);

  const [customObjectsVersion, setCustomObjectsVersion] = useState(0);

  useEffect(() => {
    const handleSync = () => setCustomObjectsVersion(v => v + 1);
    window.addEventListener('iranbimhub_custom_objects_updated', handleSync);
    window.addEventListener('iranbimhub_brand_profile_updated', handleSync);
    return () => {
      window.removeEventListener('iranbimhub_custom_objects_updated', handleSync);
      window.removeEventListener('iranbimhub_brand_profile_updated', handleSync);
    };
  }, []);

  // Dynamic Combined objects list
  const combinedObjects = React.useMemo(() => {
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

  // Dynamic Merged Manufacturers list reading live state from Manufacturer Dashboard
  const mergedManufacturers = React.useMemo(() => {
    try {
      const savedProfileStr = localStorage.getItem('iranbimhub_mfg_profile') || localStorage.getItem('iranbimhub_mfg_profile_m1');
      if (!savedProfileStr) return MANUFACTURERS;
      const savedProfile = JSON.parse(savedProfileStr);
      if (!savedProfile) return MANUFACTURERS;

      return MANUFACTURERS.map(mfg => {
        if (mfg.id === 'm1' || mfg.id === savedProfile.id) {
          return {
            ...mfg,
            nameFa: savedProfile.nameFa || mfg.nameFa,
            nameEn: savedProfile.nameEn || mfg.nameEn,
            logo: savedProfile.logoUrl ? (savedProfile.nameFa ? savedProfile.nameFa.slice(0, 6) : 'BRAND') : mfg.logo,
            descriptionFa: savedProfile.descriptionFa || mfg.descriptionFa,
            descriptionEn: savedProfile.descriptionEn || mfg.descriptionEn,
            tier: savedProfile.tier || mfg.tier,
            website: savedProfile.website || mfg.website,
            email: savedProfile.email || mfg.email,
            phone: savedProfile.phone || mfg.phone,
            addressFa: savedProfile.addressFa || mfg.addressFa,
            addressEn: savedProfile.addressEn || mfg.addressEn,
          };
        }
        return mfg;
      });
    } catch {
      return MANUFACTURERS;
    }
  }, [customObjectsVersion]);

  /* ------------------------------------------------------------------
   * Phase 2 (UX): honest carousels.
   * The infinite-scroll marquee is only enabled when we actually have
   * enough unique items to fill it. Below the threshold we render a
   * single, honest row — repeating 3–4 items three times looked fake.
   * As the real library grows past the threshold, the marquee resumes
   * automatically with no further code change.
   * ------------------------------------------------------------------ */
  const MARQUEE_MIN_ITEMS = 6;
  const newestObjects = React.useMemo(() => combinedObjects.slice(-8).reverse(), [combinedObjects]);
  const newestLoopActive = newestObjects.length >= MARQUEE_MIN_ITEMS;
  const brandLoopActive = mergedManufacturers.length >= MARQUEE_MIN_ITEMS;

  // Carousel State & Interactive Drag Stack
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef<number | null>(null);

  const handleDragStart = (clientX: number) => {
    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
    setIsPaused(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current || dragStartXRef.current === null) return;
    const diffX = clientX - dragStartXRef.current;
    const boundedDiff = Math.max(-250, Math.min(250, diffX));
    setDragOffsetX(boundedDiff);
  };

  const handleDragEnd = (clientX?: number) => {
    if (!isDraggingRef.current && dragStartXRef.current === null) return;
    const finalX = clientX !== undefined ? clientX : (dragStartXRef.current !== null ? dragStartXRef.current + dragOffsetX : 0);
    const diffX = dragStartXRef.current !== null ? finalX - dragStartXRef.current : dragOffsetX;
    const threshold = 60; // swipe threshold in pixels

    if (diffX > threshold) {
      // Swiped right -> go to previous slide
      setActiveSlide(prev => (prev === 0 ? 4 : prev - 1));
      setSlideProgress(0);
    } else if (diffX < -threshold) {
      // Swiped left -> go to next slide
      setActiveSlide(prev => (prev === 4 ? 0 : prev + 1));
      setSlideProgress(0);
    }

    isDraggingRef.current = false;
    dragStartXRef.current = null;
    setDragOffsetX(0);
    setIsPaused(false);
  };

  // Interactive Search Section State
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchMousePos, setSearchMousePos] = useState({ x: 50, y: 50 });
  const [isSearchHovered, setIsSearchHovered] = useState(false);

  const handleSearchMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!searchContainerRef.current) return;
    const rect = searchContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSearchMousePos({ x, y });
  };

  // Auto-advance timer & progress fill (6 seconds duration = 6000ms)
  useEffect(() => {
    if (isPaused) return;
    const stepMs = 100;
    const totalMs = 6000;
    const increment = (stepMs / totalMs) * 100;

    const timer = setInterval(() => {
      setSlideProgress(prev => {
        if (prev + increment >= 100) {
          setActiveSlide(s => (s + 1) % 5);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [isPaused]);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingCategoryRef = useRef(false);
  const categoryStartXRef = useRef(0);
  const categoryScrollLeftRef = useRef(0);
  const categoryHasDraggedRef = useRef(false);

  const handleCategoryMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!categoryScrollRef.current) return;
    isDraggingCategoryRef.current = true;
    categoryHasDraggedRef.current = false;
    categoryStartXRef.current = e.pageX - categoryScrollRef.current.offsetLeft;
    categoryScrollLeftRef.current = categoryScrollRef.current.scrollLeft;
  };

  const handleCategoryMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingCategoryRef.current || !categoryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - categoryStartXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      categoryHasDraggedRef.current = true;
    }
    categoryScrollRef.current.scrollLeft = categoryScrollLeftRef.current - walk;
  };

  const handleCategoryMouseUpOrLeave = () => {
    isDraggingCategoryRef.current = false;
  };

  const handleCategoryItemClick = (catId: string, e: React.MouseEvent) => {
    if (categoryHasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handleCategoryClick(catId);
  };

  const handleFollowCategory = (catId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowedCategories(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId) 
        : [...prev, catId]
    );
  };

  const brandScrollRef = useRef<HTMLDivElement>(null);
  const [isBrandHovered, setIsBrandHovered] = useState(false);
  const isDraggingBrandRef = useRef(false);
  const brandStartXRef = useRef(0);
  const brandScrollLeftRef = useRef(0);
  const brandHasDraggedRef = useRef(false);

  const handleBrandMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!brandScrollRef.current) return;
    isDraggingBrandRef.current = true;
    brandHasDraggedRef.current = false;
    brandStartXRef.current = e.pageX - brandScrollRef.current.offsetLeft;
    brandScrollLeftRef.current = brandScrollRef.current.scrollLeft;
  };

  const handleBrandMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingBrandRef.current || !brandScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - brandScrollRef.current.offsetLeft;
    const walk = (x - brandStartXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      brandHasDraggedRef.current = true;
    }
    brandScrollRef.current.scrollLeft = brandScrollLeftRef.current - walk;
  };

  const handleBrandMouseUpOrLeave = () => {
    isDraggingBrandRef.current = false;
  };

  const handleBrandTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!brandScrollRef.current || e.touches.length === 0) return;
    isDraggingBrandRef.current = true;
    brandHasDraggedRef.current = false;
    brandStartXRef.current = e.touches[0].pageX - brandScrollRef.current.offsetLeft;
    brandScrollLeftRef.current = brandScrollRef.current.scrollLeft;
  };

  const handleBrandTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingBrandRef.current || !brandScrollRef.current || e.touches.length === 0) return;
    const x = e.touches[0].pageX - brandScrollRef.current.offsetLeft;
    const walk = (x - brandStartXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      brandHasDraggedRef.current = true;
    }
    brandScrollRef.current.scrollLeft = brandScrollLeftRef.current - walk;
  };

  const handleBrandTouchEnd = () => {
    isDraggingBrandRef.current = false;
  };

  // Continuous auto horizontal movement scroll for trusted brands
  useEffect(() => {
    const el = brandScrollRef.current;
    if (!el || !brandLoopActive) return; // static row when too few brands — no auto-scroll (Phase 2)

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 35; // pixels per second

    const scroll = (time: number) => {
      if (!isBrandHovered && !isDraggingBrandRef.current && el) {
        const delta = (time - lastTime) / 1000;
        const oneGroupWidth = el.scrollWidth / 3;

        if (isRtl) {
          // In RTL, we can scroll in the native scrolling direction.
          // Subtracting speed * delta moves the content leftwards
          el.scrollLeft -= speed * delta;
          if (Math.abs(el.scrollLeft) >= oneGroupWidth) {
            el.scrollLeft += oneGroupWidth;
          }
        } else {
          // In LTR, we add speed * delta
          el.scrollLeft += speed * delta;
          if (el.scrollLeft >= oneGroupWidth) {
            el.scrollLeft -= oneGroupWidth;
          }
        }
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isBrandHovered, isRtl, brandLoopActive]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 240;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  /* Testimonial carousel handlers were removed in Phase 3: the section
     returned as the admin-driven unified Expert Insights grid shared with the
     For Designers page (no dead code kept). */


  const newestObjectsScrollRef = useRef<HTMLDivElement>(null);
  const [isNewestObjectsHovered, setIsNewestObjectsHovered] = useState(false);
  const isDraggingNewestObjectsRef = useRef(false);
  const newestObjectsStartXRef = useRef(0);
  const newestObjectsScrollLeftRef = useRef(0);
  const newestObjectsHasDraggedRef = useRef(false);

  const scrollNewestObjects = (direction: 'left' | 'right') => {
    const el = newestObjectsScrollRef.current;
    if (!el) return;

    const firstCard = el.querySelector('[data-newest-object-card]') as HTMLElement | null;
    const gap = 20;
    const scrollAmount = firstCard ? firstCard.offsetWidth + gap : Math.min(el.clientWidth * 0.85, 280);

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Keep this carousel interaction aligned with the trusted-brands carousel:
  // mouse drag on desktop and native touch scrolling on mobile.
  const handleNewestObjectsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !newestObjectsScrollRef.current) return;

    const el = newestObjectsScrollRef.current;
    isDraggingNewestObjectsRef.current = true;
    newestObjectsHasDraggedRef.current = false;
    newestObjectsStartXRef.current = e.pageX - el.offsetLeft;
    newestObjectsScrollLeftRef.current = el.scrollLeft;
  };

  const handleNewestObjectsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingNewestObjectsRef.current || !newestObjectsScrollRef.current) return;

    e.preventDefault();
    const el = newestObjectsScrollRef.current;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - newestObjectsStartXRef.current) * 1.5;

    if (Math.abs(walk) > 5) {
      newestObjectsHasDraggedRef.current = true;
    }

    el.scrollLeft = newestObjectsScrollLeftRef.current - walk;
  };

  const handleNewestObjectsMouseUpOrLeave = () => {
    isDraggingNewestObjectsRef.current = false;
  };

  const handleNewestObjectsTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!newestObjectsScrollRef.current || e.touches.length === 0) return;

    const el = newestObjectsScrollRef.current;
    isDraggingNewestObjectsRef.current = true;
    newestObjectsHasDraggedRef.current = false;
    newestObjectsStartXRef.current = e.touches[0].pageX - el.offsetLeft;
    newestObjectsScrollLeftRef.current = el.scrollLeft;
  };

  const handleNewestObjectsTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (
      !isDraggingNewestObjectsRef.current ||
      !newestObjectsScrollRef.current ||
      e.touches.length === 0
    ) {
      return;
    }

    const el = newestObjectsScrollRef.current;
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - newestObjectsStartXRef.current) * 1.5;

    if (Math.abs(walk) > 5) {
      newestObjectsHasDraggedRef.current = true;
    }

    el.scrollLeft = newestObjectsScrollLeftRef.current - walk;
  };

  const handleNewestObjectsTouchEnd = () => {
    isDraggingNewestObjectsRef.current = false;
  };

  const handleNewestObjectsClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!newestObjectsHasDraggedRef.current) return;

    e.preventDefault();
    e.stopPropagation();
    newestObjectsHasDraggedRef.current = false;
  };

  const handleNewestObjectsDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Continuous movement, matching the trusted-brands carousel.
  useEffect(() => {
    const el = newestObjectsScrollRef.current;
    if (!el || !newestLoopActive) return; // static row until the library grows (Phase 2)

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 35;

    const scroll = (time: number) => {
      if (!isNewestObjectsHovered && !isDraggingNewestObjectsRef.current && el) {
        const delta = (time - lastTime) / 1000;
        const oneGroupWidth = el.scrollWidth / 3;

        if (isRtl) {
          el.scrollLeft -= speed * delta;
          if (Math.abs(el.scrollLeft) >= oneGroupWidth) {
            el.scrollLeft += oneGroupWidth;
          }
        } else {
          el.scrollLeft += speed * delta;
          if (el.scrollLeft >= oneGroupWidth) {
            el.scrollLeft -= oneGroupWidth;
          }
        }
      }

      lastTime = time;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isNewestObjectsHovered, isRtl, newestLoopActive]);

  // Filter suggestions based on searchQuery
  const suggestions = searchQuery.trim().length > 1 ? {
    products: combinedObjects.filter(o => 
      o.titleFa.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    categories: CATEGORIES.filter(c => 
      c.nameFa.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 2),
    manufacturers: MANUFACTURERS.filter(m => 
      m.nameFa.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 2)
  } : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ 
      search: searchQuery, 
      formats: selectedFormat !== 'All' ? [selectedFormat] : [],
      category: null,
      subcategory: null,
      specifics: {}
    });
    onNavigate('categories');
  };

  const handleCategoryClick = (catId: string) => {
    onFilterChange({ category: catId, subcategory: null, specifics: {} });
    onNavigate('categories');
  };

  const handleManufacturerClick = (mfgId: string) => {
    if (onViewBrand) {
      onViewBrand(mfgId);
    } else {
      onFilterChange({ manufacturers: [mfgId], category: null, subcategory: null, specifics: {} });
      onNavigate('categories');
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12 pb-12">
      
      {/* Dynamic Animated Styles for High-Tech BIM effects */}
      <style>{`
        @keyframes bimGridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes laserScan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes float3d {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes techPulse {
          0%, 100% { opacity: 0.15; transform: scale(0.98); }
          50% { opacity: 0.4; transform: scale(1.02); }
        }
        @keyframes downArrow {
          0% { transform: translateY(-4px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(4px); opacity: 0; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-bim-grid {
          animation: bimGridMove 25s linear infinite;
        }
        .animate-laser-scan {
          animation: laserScan 6s ease-in-out infinite;
        }
        .animate-float-3d {
          animation: float3d 5s ease-in-out infinite;
        }
        .animate-radar-sweep {
          animation: radarSweep 12s linear infinite;
        }
        .animate-tech-pulse {
          animation: techPulse 4s ease-in-out infinite;
        }
        .animate-down-arrow {
          animation: downArrow 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* 1. CAROUSEL HERO SECTION WITH REAL PHOTOGRAPHY & CARD STACK */}
      <HeroCarousel onNavigate={onNavigate} onOpenAuthModal={onOpenAuthModal} />

      {/* 2. INTRODUCTION / VALUE CLARITY SECTION */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        id="iranbimhub-value-introduction"
      >
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-7 lg:p-9 shadow-sm">
          {/* Subtle background grid */}
          <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#26B6B6_1.4px,transparent_1.4px)] [background-size:22px_22px] pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#26B6B6]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-slate-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-7">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#26B6B6]/10 text-[#138f8f] dark:text-[#26B6B6] text-[10px] sm:text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isRtl ? 'از معرفی محصول تا حضور در مدل ساختمان' : 'From product introduction to building model use'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                {isRtl
                  ? 'جایی که کاتالوگ محصول وارد طراحی و مدل‌سازی BIM ساختمان می‌شود'
                  : 'Where product catalogs enter BIM-based building design'}
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                {isRtl
                  ? 'ایران‌بیم‌هاب کمک می‌کند اطلاعات واقعی محصولات ساختمانی از کاتالوگ، دیتاشیت و تجربه تولیدکننده، به آبجکت‌های BIM قابل استفاده در طراحی تبدیل شود؛ مسیری که با احراز هویت برند، ارزیابی فایل و همکاری مدل‌سازان متخصص کامل می‌شود.'
                  : 'IranBIMhub helps real building product information move from catalogs, datasheets, and manufacturer knowledge into BIM objects that can be used in design workflows, supported by brand verification, file evaluation, and specialist modelers.'
                }
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {[
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  titleFa: 'وقتی کاتالوگ فقط خوانده نمی‌شود',
                  titleEn: 'When a catalog becomes more than something to read',
                  descFa:
                    'کاتالوگ PDF، عکس و دیتاشیت محصول برای معرفی کافی‌اند؛ اما در پروژه‌های BIM، اطلاعات محصول باید به‌صورت یک آبجکت قابل استفاده وارد مدل ساختمان شود.',
                  descEn:
                    'PDF catalogs, images, and datasheets are useful for introducing products, but BIM projects need product information to become usable objects inside the building model.'
                },
                {
                  icon: <Package className="w-5 h-5" />,
                  titleFa: 'محصول شما وارد تصمیم طراحی می‌شود',
                  titleEn: 'Your product enters the design decision',
                  descFa:
                    'وقتی محصول واقعی برند شما به آبجکت BIM استاندارد تبدیل شود، معمار و مهندس می‌توانند آن را در مرحله طراحی ببینند، مقایسه کنند و با مشخصات واقعی برند بسنجند.',
                  descEn:
                    'When a real product becomes a standard BIM object, architects and engineers can view, compare, and evaluate it during the design stage using real brand specifications.'
                },
                {
                  icon: <FileCheck2 className="w-5 h-5" />,
                  titleFa: 'طراحی با محصول واقعی، نه مدل فرضی',
                  titleEn: 'Design with real products, not placeholders',
                  descFa:
                    'به‌جای مدل‌سازی حدسی یا استفاده از فایل‌های نامعتبر، طراح به آبجکت‌هایی دسترسی پیدا می‌کند که به محصول واقعی، برند مشخص و اطلاعات فنی قابل ارزیابی متصل‌اند.',
                  descEn:
                    'Instead of using approximate models or unreliable files, designers can work with BIM objects connected to real products, identified brands, and reviewable technical information.'
                }
              ].map((item, index) => (
                <div
                  key={item.titleEn}
                  className="group relative overflow-hidden bg-slate-50/70 dark:bg-gray-950/60 border border-gray-150 dark:border-gray-800 rounded-3xl p-5 sm:p-6 text-start hover:border-[#26B6B6]/40 hover:shadow-md transition-all"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#26B6B6]/5 to-transparent transition-opacity pointer-events-none" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#26B6B6]/10 text-[#26B6B6] border border-[#26B6B6]/15 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>

                      <span className="text-[10px] font-black text-gray-300 dark:text-gray-700 font-mono">
                        {isRtl ? `۰${index + 1}` : `0${index + 1}`}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white leading-snug">
                        {isRtl ? item.titleFa : item.titleEn}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {isRtl ? item.descFa : item.descEn}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust note */}
            <div className="rounded-2xl bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 border border-[#26B6B6]/15 p-4 sm:p-5 text-start">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-950 text-[#26B6B6] flex items-center justify-center shrink-0 border border-[#26B6B6]/10">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                    {isRtl ? 'حفاظت از هویت رسمی برندها، بخشی از مسیر انتشار است' : 'Protecting official brand identity is part of publishing'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {isRtl
                      ? 'در ایران‌بیم‌هاب، صفحه برند و فایل‌های BIM پیش از نمایش عمومی باید به محصول واقعی، هویت مشخص برند و اطلاعات قابل ارزیابی متصل باشند.'
                      : 'On IranBIMhub, brand pages and BIM files must be connected to real products, clear brand identity, and reviewable information before public display.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRECISION SEARCH AND BROWSE BY CATEGORY - MERGED WITH CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20" id="search-and-browse-categories">
        
        {/* Unified Search Engine & Categories Row */}
        <div 
          ref={searchContainerRef}
          onMouseEnter={() => setIsSearchHovered(true)}
          onMouseLeave={() => setIsSearchHovered(false)}
          className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6 shadow-sm transition-all duration-300 hover:shadow-md"
        >
          {/* Subtle static blueprint grid */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#26B6B6_1px,transparent_1px),linear-gradient(to_bottom,#26B6B6_1px,transparent_1px)] bg-[size:20px_20px] rounded-2xl sm:rounded-3xl pointer-events-none"></div>

          {/* Ambient glow in hover mode */}
          {isSearchHovered && (
            <div className="absolute inset-0 bg-radial from-[#26B6B6]/10 via-transparent to-transparent rounded-2xl sm:rounded-3xl pointer-events-none transition-opacity duration-300" />
          )}
          
          <div className="max-w-xl mx-auto space-y-1 relative z-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight">
              {isRtl ? 'جستجو در کتابخانهٔ اولیهٔ ایران‌بیم‌هاب' : 'Search the IranBIMhub Initial Library'}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-normal font-light max-w-lg mx-auto">
              {isRtl 
                ? 'نام محصول، دسته‌بندی یا مشخصهٔ فنی موردنظر خود را جست‌وجو کنید.' 
                : 'Search by product, category, or technical attribute.'
              }
            </p>
          </div>

          {/* Precision Search Box */}
          <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-gray-950 p-1.5 rounded-xl sm:rounded-2xl shadow-sm max-w-2xl mx-auto text-gray-800 dark:text-gray-100 relative z-20 border border-gray-200 dark:border-gray-800 transition-all duration-300 focus-within:border-[#26B6B6] focus-within:ring-1 focus-within:ring-[#26B6B6]/30">
            <div className="flex flex-col sm:flex-row items-stretch gap-1.5">
              
              {/* Keywords Input */}
              <div className="flex-1 flex items-center gap-2 px-3 border-b sm:border-b-0 sm:border-e border-gray-100 dark:border-gray-800 py-1">
                <Search className="w-4 h-4 text-[#26B6B6] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                />
              </div>

              {/* Quick Format Filter Selector */}
              <div className="flex items-center gap-2 px-3 border-b sm:border-b-0 sm:border-e border-gray-100 dark:border-gray-800 py-1 shrink-0 min-w-[110px]">
                <Cpu className="w-3.5 h-3.5 text-[#26B6B6] shrink-0" />
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="text-xs bg-transparent border-none focus:outline-none font-bold text-[#464E56] dark:text-gray-300 cursor-pointer"
                >
                  <option value="All">{t('allFormats')}</option>
                  <option value="Revit">Revit (.rfa)</option>
                  <option value="ArchiCAD">ArchiCAD (.gsm)</option>
                  <option value="SketchUp">SketchUp (.skp)</option>
                  <option value="IFC">IFC Standard</option>
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-black shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap hover:scale-[1.01] active:scale-95 shrink-0"
              >
                <span>{isRtl ? 'جستجوی پیشرفته' : 'Advanced Search'}</span>
              </button>

            </div>

            {/* Faceted Autocomplete Suggestion Panel */}
            {showSuggestions && suggestions && (
              <div 
                className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 text-start overflow-hidden z-40 max-h-96 ${isRtl ? 'text-right' : 'text-left'}`}
                onMouseLeave={() => setShowSuggestions(false)}
              >
                
                {/* Product Matches */}
                {suggestions.products.length > 0 && (
                  <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">
                      {isRtl ? 'آبجکت‌های بیم منطبق' : 'Matching BIM Families'}
                    </span>
                    <div className="space-y-1">
                      {suggestions.products.map(p => (
                        <button
                           key={p.id}
                           type="button"
                           onClick={() => {
                             onSelectObject(p);
                             setShowSuggestions(false);
                           }}
                           className="w-full text-start hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-md flex items-center justify-between text-xs transition-colors cursor-pointer"
                        >
                           <span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                             {isRtl ? p.titleFa : p.titleEn}
                           </span>
                           <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 font-mono shrink-0">
                             {p.lod}
                           </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category matches */}
                {suggestions.categories.length > 0 && (
                  <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">
                      {isRtl ? 'دسته‌بندی‌های پیشنهادی' : 'Suggested Categories'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.categories.map(c => (
                        <button
                           key={c.id}
                           type="button"
                           onClick={() => {
                             handleCategoryClick(c.id);
                             setShowSuggestions(false);
                           }}
                           className="text-xs font-semibold text-[#26B6B6] bg-[#26B6B6]/5 hover:bg-[#26B6B6]/10 px-2.5 py-1 rounded transition-colors cursor-pointer"
                        >
                           {isRtl ? c.nameFa : c.nameEn}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manufacturer matches */}
                {suggestions.manufacturers.length > 0 && (
                  <div className="p-3">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">
                      {isRtl ? 'سازندگان عضو شده' : 'Registered Manufacturers'}
                    </span>
                    <div className="space-y-1">
                      {suggestions.manufacturers.map(m => (
                        <button
                           key={m.id}
                           type="button"
                           onClick={() => {
                             handleManufacturerClick(m.id);
                             setShowSuggestions(false);
                           }}
                           className="w-full text-start hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-md flex items-center gap-2 text-xs transition-colors cursor-pointer"
                        >
                           <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center font-mono text-[9px] font-bold text-gray-600 dark:text-gray-300 shrink-0">
                             {m.logo.substring(0,2)}
                           </div>
                           <span className="font-semibold text-gray-700 dark:text-gray-300">
                             {isRtl ? m.nameFa : m.nameEn}
                           </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.products.length === 0 && suggestions.categories.length === 0 && suggestions.manufacturers.length === 0 && (
                  <div className="p-4 text-center text-xs text-gray-400 font-medium">
                    {isRtl ? 'موردی یافت نشد. اینتر بزنید تا کل بازار جستجو شود.' : 'No suggestions found. Press enter to search the full library.'}
                  </div>
                )}

              </div>
            )}
          </form>

          {/* 3B. PRODUCT CATEGORIES - INTEGRATED INSIDE THE CARD */}
          <div className="space-y-4 relative z-10 text-center mt-6">
            
            <div className="flex flex-col items-center justify-center pb-1">
              <div className="space-y-1 text-center">
                <h2 className="text-base sm:text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 justify-center">
                  <Grid3X3 className="w-5 h-5 text-[#26B6B6] shrink-0" />
                  <span>{isRtl ? 'دسته‌بندی محصولات' : 'Product Categories'}</span>
                </h2>
                <p className="text-[10.5px] sm:text-xs text-gray-400 font-medium text-center">
                  {isRtl ? 'بررسی کاتالوگ سازندگان بر اساس کدهای استاندارد صنعت ساختمان ایران' : 'Explore catalogs according to national and international building standards'}
                </p>
              </div>
            </div>

            {isCategoriesExpanded ? (
              /* EXPANDED MULTI-ROW WRAPPING LAYOUT */
              <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center py-2.5 px-0.5 animate-fadeIn min-h-[120px]">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={(e) => handleCategoryItemClick(cat.id, e)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 hover:border-[#26B6B6]/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] group"
                  >
                    {/* Left icon */}
                    <div className="w-6 h-6 rounded-full bg-[#26B6B6]/5 text-[#26B6B6] flex items-center justify-center shrink-0">
                      <CategoryIcon iconName={cat.icon} className="w-3.5 h-3.5" />
                    </div>
                    
                    {/* Middle title */}
                    <span className="text-[11px] sm:text-xs font-extrabold text-gray-700 dark:text-gray-300 group-hover:text-[#26B6B6] transition-colors leading-none truncate max-w-[140px] sm:max-w-[180px]">
                      {isRtl ? cat.nameFa : cat.nameEn}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* COLLAPSED HORIZONTAL SCROLL LAYOUT */
              <div className="relative group/scroll px-1 min-h-[52px]">
                
                {/* Left Scroll Button */}
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  className="absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 z-25 w-7 h-7 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-[#26B6B6] transition-all cursor-pointer opacity-90 sm:opacity-0 sm:group-hover/scroll:opacity-100 focus:opacity-100"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Right Scroll Button */}
                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className="absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 z-25 w-7 h-7 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-[#26B6B6] transition-all cursor-pointer opacity-90 sm:opacity-0 sm:group-hover/scroll:opacity-100 focus:opacity-100"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div
                  ref={categoryScrollRef}
                  onMouseDown={handleCategoryMouseDown}
                  onMouseMove={handleCategoryMouseMove}
                  onMouseUp={handleCategoryMouseUpOrLeave}
                  onMouseLeave={handleCategoryMouseUpOrLeave}
                  className="flex gap-2.5 overflow-x-auto py-2.5 px-0.5 scrollbar-none cursor-grab active:cursor-grabbing scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={(e) => handleCategoryItemClick(cat.id, e)}
                      className="flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 hover:border-[#26B6B6]/50 transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] group"
                    >
                      {/* Left icon */}
                      <div className="w-6 h-6 rounded-full bg-[#26B6B6]/5 text-[#26B6B6] flex items-center justify-center shrink-0">
                        <CategoryIcon iconName={cat.icon} className="w-3.5 h-3.5" />
                      </div>
                      
                      {/* Middle title */}
                      <span className="text-[11px] sm:text-xs font-extrabold text-gray-700 dark:text-gray-300 group-hover:text-[#26B6B6] transition-colors leading-none truncate max-w-[120px] sm:max-w-[150px]">
                        {isRtl ? cat.nameFa : cat.nameEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle Expand / Collapse Button beneath */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 text-[10px] sm:text-xs font-black text-gray-700 dark:text-gray-300 hover:text-[#26B6B6] transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
              >
                {isCategoriesExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-[#26B6B6] shrink-0" />
                    <span>{isRtl ? 'نمایش خطی (اسکرول)' : 'Show Linear Scroll'}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-[#26B6B6] shrink-0" />
                    <span>{isRtl ? 'نمایش شبکه‌ای (مشاهده همه دسته‌ها)' : 'View All Categories (Grid)'}</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 3. NEWEST BIM OBJECTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6" id="homepage-newest-objects">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150/50 dark:border-gray-800/60 pb-4">
          <div className="space-y-1.5 text-start flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-[#26B6B6]/5 text-[#26B6B6] px-3 py-1 rounded-full text-[10px] font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{isRtl ? 'کتابخانهٔ اولیه' : 'Initial Library'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {isRtl ? 'نمونه‌آبجکت‌های اولیهٔ ایران‌بیم‌هاب' : 'IranBIMhub Initial Object Samples'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 leading-relaxed font-light">
              {isRtl
                ? 'چند نمونه از ساختار آبجکت و اطلاعات فنی که برای کتابخانهٔ محصولات ساختمانی ایران در حال توسعه است.'
                : 'Explore initial object and technical-information structures being developed for Iran’s construction-product library.'}
            </p>
          </div>
        </div>

        {/* Objects Horizontally Scrollable Row */}
        <div className="relative group/newest">
          {/* Soft edge gradients (hidden on large screens while the row is static — Phase 2) */}
          <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16 bg-gradient-to-r from-white dark:from-gray-950 to-transparent ${!newestLoopActive ? 'lg:hidden' : ''}`} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16 bg-gradient-to-l from-white dark:from-gray-950 to-transparent ${!newestLoopActive ? 'lg:hidden' : ''}`} />

          {/* Glass side navigation buttons */}
          <button
            type="button"
            onClick={() => scrollNewestObjects('left')}
            className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/75 dark:bg-gray-950/70 backdrop-blur-xl border border-white/70 dark:border-gray-800/80 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-[#26B6B6] hover:border-[#26B6B6]/40 hover:bg-white/90 dark:hover:bg-gray-900/90 transition-all active:scale-95 cursor-pointer ${!newestLoopActive ? 'lg:hidden' : ''}`}
            aria-label={isRtl ? 'اسکرول به چپ' : 'Scroll left'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollNewestObjects('right')}
            className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/75 dark:bg-gray-950/70 backdrop-blur-xl border border-white/70 dark:border-gray-800/80 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-[#26B6B6] hover:border-[#26B6B6]/40 hover:bg-white/90 dark:hover:bg-gray-900/90 transition-all active:scale-95 cursor-pointer ${!newestLoopActive ? 'lg:hidden' : ''}`}
            aria-label={isRtl ? 'اسکرول به راست' : 'Scroll right'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={newestObjectsScrollRef}
            dir={isRtl ? 'rtl' : 'ltr'}
            onMouseEnter={() => setIsNewestObjectsHovered(true)}
            onMouseLeave={() => {
              setIsNewestObjectsHovered(false);
              handleNewestObjectsMouseUpOrLeave();
            }}
            onMouseDown={handleNewestObjectsMouseDown}
            onMouseMove={handleNewestObjectsMouseMove}
            onMouseUp={handleNewestObjectsMouseUpOrLeave}
            onTouchStart={handleNewestObjectsTouchStart}
            onTouchMove={handleNewestObjectsTouchMove}
            onTouchEnd={handleNewestObjectsTouchEnd}
            onClickCapture={handleNewestObjectsClickCapture}
            onDragStart={handleNewestObjectsDragStart}
            className="flex gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none overscroll-x-contain [touch-action:pan-x] select-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex gap-3.5 sm:gap-4 md:gap-5 px-10 sm:px-12 shrink-0">
              {/* Phase 2: single honest row until >= 6 unique objects exist; tripled loop resumes automatically */}
              {(newestLoopActive ? [1, 2, 3] : [1]).map((groupIndex) => (
                <div key={`newest-group-${groupIndex}`} className="flex gap-3.5 sm:gap-4 md:gap-5 shrink-0">
                  {newestObjects.map((obj) => (
                    <div
                      key={`new-obj-${groupIndex}-${obj.id}`}
                      data-newest-object-card
                      dir={isRtl ? 'rtl' : 'ltr'}
                      className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px]"
                    >
                      <BIMObjectCard
                        object={obj}
                        isSaved={savedObjects.includes(obj.id)}
                        onToggleSave={() => onToggleSave(obj.id)}
                        onClick={() => onSelectObject(obj)}
                        onQuickDownload={(format) => onQuickDownload(obj, format)}
                        onViewBrand={onViewBrand}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* 4. TRUSTED COMPANIES & VALUE PROPOSITION FOR MANUFACTURERS */}
      <section className="border-y border-gray-150 dark:border-gray-800/60 py-6 sm:py-8 lg:py-10" id="homepage-trusted-brands">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header row and Carousel block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Title Column */}
            <div className="md:col-span-5 space-y-4 text-center md:text-start animate-fadeIn">
              <div className="space-y-2 text-center md:text-start">
                <button
                  type="button"
                  onClick={() => onNavigate('manufacturers')}
                  className="group inline-flex items-center gap-2 text-xl md:text-2xl font-black text-[#464E56] dark:text-gray-200 hover:text-[#26B6B6] transition-colors cursor-pointer text-center md:text-start"
                >
                  <span>{t('trustedPartners')}</span>
                  <span className="text-xs font-bold text-[#26B6B6] bg-[#26B6B6]/5 group-hover:bg-[#26B6B6] group-hover:text-white px-2 py-0.5 rounded transition-all shrink-0">
                    {isRtl ? 'مشاهده دایرکتوری ←' : 'View Directory →'}
                  </span>
                </button>
                <p className="text-xs text-gray-400 dark:text-gray-400 leading-relaxed font-light max-w-md mx-auto md:mx-0">
                  {t('trustedPartnersSub')}
                </p>
              </div>
              <div className="pt-2 text-center md:text-start block">
                <button
                  type="button"
                  onClick={() => onNavigate('for-manufacturers')}
                  className="bg-gradient-to-r from-[#26B6B6] to-[#1e9494] text-white hover:from-[#1e9494] hover:to-[#177373] text-xs font-extrabold px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-102 active:scale-98 cursor-pointer inline-flex items-center gap-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-[#26B6B6]/50"
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
                  <span>{isRtl ? 'معرفی برند و ثبت کاتالوگ شما' : 'Introduce Brand & Register Your Catalog'}</span>
                </button>
              </div>
            </div>

            {/* Horizontal Scrolling Row Column */}
            <div className="md:col-span-7 relative h-[140px] w-full overflow-hidden flex items-center">
              <div
                ref={brandScrollRef}
                onMouseEnter={() => setIsBrandHovered(true)}
                onMouseLeave={() => setIsBrandHovered(false)}
                onMouseDown={handleBrandMouseDown}
                onMouseMove={handleBrandMouseMove}
                onMouseUp={handleBrandMouseUpOrLeave}
                onTouchStart={handleBrandTouchStart}
                onTouchMove={handleBrandTouchMove}
                onTouchEnd={handleBrandTouchEnd}
                className="w-full overflow-x-auto whitespace-nowrap scrollbar-none cursor-grab active:cursor-grabbing flex items-center py-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Phase 2: while fewer than 6 real brands exist we show ONE honest row;
                    the seamless tripled marquee resumes automatically as the directory grows. */}
                <div className={`flex gap-4 px-4 shrink-0 ${!brandLoopActive ? 'w-full justify-center' : ''}`}>
                  {(brandLoopActive ? [mergedManufacturers, mergedManufacturers, mergedManufacturers] : [mergedManufacturers]).map((group, groupIdx) => (
                    <div key={groupIdx} className="flex gap-4 shrink-0">
                      {group.map((mfg, idx) => (
                        <div
                          key={`${groupIdx}-${mfg.id}-${idx}`}
                          onClick={(e) => {
                            if (brandHasDraggedRef.current) {
                              e.preventDefault();
                              return;
                            }
                            handleManufacturerClick(mfg.id);
                          }}
                          className="flex flex-col items-center justify-center text-center bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/80 p-4 rounded-xl shadow-2xs hover:shadow-xs cursor-pointer group transition-all hover:border-[#26B6B6]/50 select-none w-[120px] shrink-0"
                        >
                          <div className="w-10 h-10 bg-[#464E56]/5 dark:bg-gray-800 text-[#464E56] dark:text-gray-300 font-mono font-extrabold text-[11px] tracking-widest rounded-lg flex items-center justify-center group-hover:bg-[#26B6B6] group-hover:text-white transition-all mb-1.5 shadow-inner shrink-0">
                            {mfg.logo}
                          </div>
                          <span className="text-[10px] font-extrabold text-gray-700 dark:text-gray-200 block truncate max-w-full">
                            {isRtl ? mfg.nameFa : mfg.nameEn}
                          </span>
                          <span className="text-[8px] text-[#26B6B6] bg-[#26B6B6]/5 px-1 py-0.5 rounded mt-0.5 font-bold">
                            {mfg.isSample ? (isRtl ? 'پروفایل نمونه' : 'Profile template') : mfg.tier}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-gray-200/50 dark:border-gray-800/80 my-2" />

          {/* 4 Manufacturer Value Columns Directly Below inside the unified card/section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-start pt-6">
            
            {/* Box 1 */}
            <div className="flex flex-col bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0 border border-[#26B6B6]/20">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-800">
                  {isRtl ? 'حضور در نقشه‌ها' : 'In Specifications'}
                </span>
              </div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug">
                {isRtl ? 'حضور در میز طراحی مهندسان' : 'Presence on Drafting Desks'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal mt-2">
                {isRtl 
                  ? 'محصولات و مصالح شما دقیقاً در زمانِ کلیدیِ طراحی و پیش از شروع پروژه، به دست معماران، مهندسان مشاور و طراحان بررسی و وارد نقشه‌های رویت (Revit) می‌شوند.' 
                  : 'Your products and materials are reviewed and integrated into Revit plans by architects, consultants, and developers during the key design phase.'
                }
              </p>
            </div>

            {/* Box 2 */}
            <div className="flex flex-col bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0 border border-[#26B6B6]/20">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-800">
                  {isRtl ? 'تقاضای زنده' : 'Real Demand'}
                </span>
              </div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug">
                {isRtl ? 'جذب تقاضای واقعی بازار' : 'Capture Real Market Demand'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal mt-2">
                {isRtl 
                  ? 'حضور محصول در مرحلهٔ طراحی، فرصت دیده‌شدن حرفه‌ای برند شما را میان معماران و مهندسان بیشتر می‌کند.' 
                  : 'Bringing product information into the design stage can increase your brand’s professional visibility among architects and engineers.'
                }
              </p>
            </div>

            {/* Box 3 */}
            <div className="flex flex-col bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0 border border-[#26B6B6]/20">
                  <LineChart className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-800">
                  {isRtl ? 'تحلیل رفتار' : 'Market Insights'}
                </span>
              </div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug">
                {isRtl ? 'رصد هوشمند رفتار بازار' : 'Smart Behavior Tracking'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal mt-2">
                {isRtl 
                  ? 'به صورت شفاف رصد کنید که کدام شرکت‌های مهندسی، مشاوران بزرگ و پروژه‌های ساختمانی، کدهای تجاری و مدل‌های محصولات شما را بررسی کرده‌اند.' 
                  : 'Monitor which engineering firms, major consultancies, and construction projects are downloading and specifying your catalog codes.'
                }
              </p>
            </div>

            {/* Box 4 */}
            <div className="flex flex-col bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0 border border-[#26B6B6]/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-800">
                  {isRtl ? 'ورود آسان' : 'Easy Onboarding'}
                </span>
              </div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug">
                {isRtl ? 'شروعی ساده برای ورود به BIM' : 'A Simple Start in BIM'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal mt-2">
                {isRtl 
                  ? 'معرفی برند و محصولتان را از یک مسیر ساده آغاز کنید. اطلاعات اولیه و کاتالوگ محصول را ارسال کنید؛ مسیر آماده‌سازی، ارزیابی فایل یا انتشار با شما هماهنگ می‌شود.' 
                  : 'Start with your brand and product information. Share the initial catalog and we will coordinate the appropriate preparation, evaluation, or publication path with you.'
                }
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. PROMOTIONAL BANNERS: MANUFACTURERS & BIM MODELERS SIDE BY SIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* CARD 1: FOR MANUFACTURERS */}
          <div className="relative bg-[#464E56] text-white rounded-3xl overflow-hidden shadow-lg p-6 sm:p-8 md:p-10 border-b-8 border-[#26B6B6] flex flex-col justify-between h-full group hover:shadow-xl transition-all">
            {/* Accent decoration */}
            <div className="absolute top-0 end-0 w-48 h-48 bg-[#26B6B6]/10 rounded-full blur-3xl"></div>
            
            <div className="space-y-4 relative z-10 text-start">
              <span className="bg-[#26B6B6] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {isRtl ? 'صاحبان صنایع و کارخانجات' : 'Industrial Brand Leaders'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
                {t('manufacturerPromoTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {t('manufacturerPromoDesc')}
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => {
                    localStorage.setItem('selected_learn_article_id', 'bim-specification-purchase-decisions');
                    onNavigate('learn');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-[#26B6B6] hover:underline font-bold flex items-center gap-1 cursor-pointer text-start"
                >
                  <span>{isRtl ? 'ببینید بیم چه معنایی برای کسب‌وکار و سهم بازار شما دارد ←' : 'See what BIM specification means for your brand growth →'}</span>
                </button>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => onNavigate('for-manufacturers')}
                className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:scale-102 transition-all w-full flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>{t('manufacturerPromoCTA')}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* CARD 2: FOR BIM MODELERS / DESIGNERS */}
          <div className="relative bg-[#2D3339] text-white rounded-3xl overflow-hidden shadow-lg p-6 sm:p-8 md:p-10 border-b-8 border-[#26B6B6] flex flex-col justify-between h-full group hover:shadow-xl transition-all">
            {/* Accent decoration */}
            <div className="absolute top-0 end-0 w-48 h-48 bg-[#26B6B6]/10 rounded-full blur-3xl"></div>
            
            <div className="space-y-4 relative z-10 text-start">
              <span className="bg-[#26B6B6] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {isRtl ? 'برای طراحان و مهندسان' : 'For Designers & Engineers'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
                {isRtl ? 'دیگر لازم نیست هر آبجکت را از صفر مدل کنید' : 'Stop Modeling Every Object From Scratch'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {isRtl 
                  ? 'مهندسان ایرانی روزانه ساعت‌ها وقت ارزشمند خود را صرف مدلسازی دستی درها، پنجره‌ها و تجهیزات می‌کنند، یا به کاتالوگ‌های خارجی پناه می‌برند که هیچ تطابقی با ابعاد، متریال و زنجیره تامین بازار مصالح کشورمان ندارد. ایران‌بیم‌هاب برای پاسخ‌دادن به این خلأ، در حال ساخت مسیری بومی و قابل‌اعتماد است.' 
                  : 'Iranian AEC professionals waste hours manually modeling doors, windows, and equipment, or rely on foreign catalogs that mismatch local standards, sizes, and active suppliers. IranBIMhub is building a local and reliable path to address this gap.'}
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => {
                    onNavigate('for-designers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-[#26B6B6] hover:underline font-bold flex items-center gap-1 cursor-pointer text-start"
                >
                  <span>{isRtl ? 'مشاهده کاتالوگ و ابزارهای اختصاصی طراحان ←' : 'Explore designer tools and BIM catalog →'}</span>
                </button>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => {
                  onNavigate('for-designers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:scale-102 transition-all w-full flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>{isRtl ? 'ورود به بخش طراحان' : 'Enter For Designers'}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 7. EXPERT INSIGHTS — shared unified section (identical code on the
             For-Designers page); real named quotes are managed in the admin panel */}
      <ExpertInsightsSection />

      {/* 8. LANDING FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12 text-start space-y-8 border-t border-gray-100 dark:border-gray-800/60 mt-8 sm:mt-10 lg:mt-12">
        <div className="text-center">
          <HelpCircle className="w-8 h-8 text-[#26B6B6] mx-auto mb-2" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
            {isRtl ? 'سوالات متداول کاربران' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-gray-400 font-light mt-1">
            {isRtl 
              ? 'پاسخ به رایج‌ترین پرسش‌ها درباره خدمات، مدل‌سازی و فرآیندهای ایران‌بیم‌هاب' 
              : 'Everything you need to know about our digital modeling, hosting, and brand integration.'}
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              qFa: 'ایران‌بیم‌هاب چیست؟',
              qEn: 'What is IranBIMhub?',
               aFa: 'ایران‌بیم‌هاب به‌عنوان اولین مسیر ملی تخصصی برای کاتالوگ دیجیتال و آبجکت‌های BIM محصولات ساختمانی ایران، در حال ساخت ارتباطی قابل اعتماد میان تولیدکنندگان، متخصصان BIM و جامعه طراحی ساختمان است.',
               aEn: 'IranBIMhub is building Iran\'s first specialized national path for digital brand catalogs and BIM objects of real building products, connecting manufacturers, BIM specialists, and the AEC design community.'
            },
            {
              qFa: 'آیا دانلود آبجکت‌های بیم در این سایت رایگان است؟',
              qEn: 'Is downloading BIM objects free on this platform?',
              aFa: 'کتابخانهٔ اولیه در حال تکمیل است. با فعال‌شدن حساب‌های کاربری و انتشار فایل‌های مجاز، دسترسی پایه برای طراحان تا پنج دانلود در روز در نظر گرفته می‌شود.',
              aEn: 'The initial library is being completed. Once accounts and authorized files are available, the base access is planned for up to five downloads per day.'
            },
            {
              qFa: 'چگونه می‌توانم محصولات تولیدی خود را در این سامانه ثبت کنم؟',
              qEn: 'How can I register my manufacturing catalog on this platform?',
              aFa: 'تولیدکنندگان می‌توانند از مسیر «برای تولیدکنندگان» اطلاعات اولیهٔ برند و محصول خود را ثبت کنند. پس از بررسی اولیه، مسیر مناسب آماده‌سازی فایل، ارزیابی یا انتشار با آن‌ها هماهنگ می‌شود.',
              aEn: 'Manufacturers can click \'For Manufacturers\' in the top menu, choose either a Free or Professional plan, and submit their catalogs. Our engineering team will handle the standardized 3D BIM modeling and specifications to publish your models on the live directory.'
            },
            {
              qFa: 'آبجکت‌ها با چه سطحی از جزئیات فنی (LOD) ارائه می‌شوند؟',
              qEn: 'With what Level of Detail (LOD) are the objects modeled?',
              aFa: 'کیفیت هندسه، اطلاعات فنی و قابلیت استفادهٔ آبجکت‌ها بر اساس نیاز هر دستهٔ محصول بررسی می‌شود. سطح اطلاعات و فرمت‌های قابل ارائه در صفحهٔ فنی هر محصول اعلام خواهد شد.',
              aEn: 'Geometry, technical information, and usability are reviewed according to each product category. Available information levels and formats are listed on each product’s technical page.'
            },
            {
              qFa: 'چه فرمت‌هایی برای فایل‌ها در دسترس است؟',
              qEn: 'What file formats are available?',
              aFa: 'فرمت‌های قابل ارائه برای هر محصول، با توجه به فایل‌های منبع و مسیر آماده‌سازی آن مشخص می‌شود. اطلاعات فنی و فایل‌های در دسترس در صفحهٔ همان محصول اعلام خواهند شد.',
              aEn: 'Available formats are determined by each product’s source files and preparation path. Technical information and accessible files are listed on that product’s page.'
            }
          ].map((faq, idx) => {
            const isOpen = openLandingFaq === idx;
            const q = isRtl ? faq.qFa : faq.qEn;
            const a = isRtl ? faq.aFa : faq.aEn;

            return (
              <div 
                key={idx}
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenLandingFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-start font-bold text-xs text-gray-800 dark:text-gray-100 hover:text-[#26B6B6] flex justify-between items-center cursor-pointer select-none"
                >
                  <span>{q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#26B6B6]' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-4 bg-slate-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-850 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-10 lg:pb-12 -mt-2 sm:-mt-4">
        <StayConnectedBlock isRtl={isRtl} variant="landing" />
      </section>

    </div>
  );
};
