import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { CATEGORIES, MANUFACTURERS, BIM_OBJECTS, MOCK_REVIEWS } from '../../data';
import { BIMObject, FilterState } from '../../types';
import { BIMObjectCard } from '../BIMObjectCard';
import { CategoryIcon } from '../CategoryIcon';
import { ARTICLES } from './LearnView';
import { Logo } from '../Logo';
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
  MessageSquare,
  Compass,
  Factory,
  Package,
  Ruler,
  FolderOpen,
  DoorOpen
} from 'lucide-react';

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
  
  // Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartXRef = useRef<number | null>(null);

  const handleDragStart = (clientX: number) => {
    dragStartXRef.current = clientX;
    setIsPaused(true);
  };

  const handleDragEnd = (clientX: number) => {
    if (dragStartXRef.current === null) return;
    const diffX = clientX - dragStartXRef.current;
    const threshold = 50; // swipe threshold in pixels
    if (diffX > threshold) {
      // Swiped right -> go to previous slide
      setActiveSlide(prev => (prev === 0 ? 4 : prev - 1));
    } else if (diffX < -threshold) {
      // Swiped left -> go to next slide
      setActiveSlide(prev => (prev === 4 ? 0 : prev + 1));
    }
    dragStartXRef.current = null;
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

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
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
    if (!el) return;

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
  }, [isBrandHovered, isRtl]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 240;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const testimonialScrollRef = useRef<HTMLDivElement>(null);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);
  const isDraggingTestimonialRef = useRef(false);
  const testimonialStartXRef = useRef(0);
  const testimonialScrollLeftRef = useRef(0);
  const testimonialHasDraggedRef = useRef(false);

  const handleTestimonialMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!testimonialScrollRef.current) return;
    isDraggingTestimonialRef.current = true;
    testimonialHasDraggedRef.current = false;
    testimonialStartXRef.current = e.pageX - testimonialScrollRef.current.offsetLeft;
    testimonialScrollLeftRef.current = testimonialScrollRef.current.scrollLeft;
  };

  const handleTestimonialMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingTestimonialRef.current || !testimonialScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - testimonialScrollRef.current.offsetLeft;
    const walk = (x - testimonialStartXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      testimonialHasDraggedRef.current = true;
    }
    testimonialScrollRef.current.scrollLeft = testimonialScrollLeftRef.current - walk;
  };

  const handleTestimonialMouseUpOrLeave = () => {
    isDraggingTestimonialRef.current = false;
  };

  const handleTestimonialTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!testimonialScrollRef.current || e.touches.length === 0) return;
    isDraggingTestimonialRef.current = true;
    testimonialHasDraggedRef.current = false;
    testimonialStartXRef.current = e.touches[0].pageX - testimonialScrollRef.current.offsetLeft;
    testimonialScrollLeftRef.current = testimonialScrollRef.current.scrollLeft;
  };

  const handleTestimonialTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingTestimonialRef.current || !testimonialScrollRef.current || e.touches.length === 0) return;
    const x = e.touches[0].pageX - testimonialScrollRef.current.offsetLeft;
    const walk = (x - testimonialStartXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      testimonialHasDraggedRef.current = true;
    }
    testimonialScrollRef.current.scrollLeft = testimonialScrollLeftRef.current - walk;
  };

  const handleTestimonialTouchEnd = () => {
    isDraggingTestimonialRef.current = false;
  };

  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (testimonialScrollRef.current) {
      const scrollAmount = 350;
      testimonialScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Continuous auto horizontal movement scroll for testimonials
  useEffect(() => {
    const el = testimonialScrollRef.current;
    if (!el) return;

    // Set initial scroll position to middle of the 3 cloned groups
    // Use a small timeout to make sure elements are fully rendered and scrollWidth is ready
    const timer = setTimeout(() => {
      const oneGroupWidth = el.scrollWidth / 3;
      if (oneGroupWidth > 0) {
        el.scrollLeft = isRtl ? -oneGroupWidth : oneGroupWidth;
      }
    }, 150);

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 25; // elegant slow speed

    const scroll = (time: number) => {
      if (!isTestimonialHovered && !isDraggingTestimonialRef.current && el) {
        const delta = (time - lastTime) / 1000;
        const oneGroupWidth = el.scrollWidth / 3;

        if (oneGroupWidth > 0) {
          if (isRtl) {
            el.scrollLeft -= speed * delta;
            // If we scrolled past 2/3, loop back to 1/3
            if (Math.abs(el.scrollLeft) >= oneGroupWidth * 2) {
              el.scrollLeft += oneGroupWidth;
            } else if (Math.abs(el.scrollLeft) <= oneGroupWidth / 2) {
              // If user dragged back, loop forward
              el.scrollLeft -= oneGroupWidth;
            }
          } else {
            el.scrollLeft += speed * delta;
            if (el.scrollLeft >= oneGroupWidth * 2) {
              el.scrollLeft -= oneGroupWidth;
            } else if (el.scrollLeft <= oneGroupWidth / 2) {
              el.scrollLeft += oneGroupWidth;
            }
          }
        }
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTestimonialHovered, isRtl]);

  // Filter suggestions based on searchQuery
  const suggestions = searchQuery.trim().length > 1 ? {
    products: BIM_OBJECTS.filter(o => 
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

      {/* 1. NEW CAROUSEL HERO SECTION */}
      <section 
        className="relative bg-gradient-to-br from-[#464E56] via-[#353B41] to-[#1E2326] text-white overflow-hidden rounded-b-[2rem] md:rounded-b-[3.5rem] shadow-md text-start select-none cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (dragStartXRef.current !== null) {
            dragStartXRef.current = null;
          }
          setIsPaused(false);
        }}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        id="homepage-hero-carousel"
      >
        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveSlide(prev => (prev === 0 ? 4 : prev - 1));
          }}
          className="carousel-arrow absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-white/10 bg-black/35 hover:bg-[#26B6B6] hover:border-transparent text-white transition-all cursor-pointer hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
          title={isRtl ? 'اسلاید قبلی' : 'Previous slide'}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveSlide(prev => (prev === 4 ? 0 : prev + 1));
          }}
          className="carousel-arrow absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-white/10 bg-black/35 hover:bg-[#26B6B6] hover:border-transparent text-white transition-all cursor-pointer hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
          title={isRtl ? 'اسلاید بعدی' : 'Next slide'}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        {/* Subtle moving coordinate background grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#26B6B6_1.5px,transparent_1.5px)] [background-size:24px_24px] animate-bim-grid pointer-events-none"></div>
        
        {/* Glowing technical radar ambient source */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#26B6B6]/10 blur-3xl animate-tech-pulse pointer-events-none"></div>

        {/* 3D LiDAR laser scanner sweep */}
        <div className="absolute left-0 right-0 h-1 bg-[#26B6B6]/45 shadow-[0_0_12px_#26B6B6] animate-laser-scan pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 md:py-8 relative z-10">
          
          {/* Active Slide Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center min-h-[460px] xs:min-h-[420px] sm:min-h-[360px] md:min-h-[280px] lg:min-h-[240px]">
            
            {/* Slide Content Area (Left/Right depending on language) */}
            <div className="md:col-span-7 space-y-2 sm:space-y-4 flex flex-col justify-center animate-fadeIn">
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 backdrop-blur-md rounded-full text-[9px] sm:text-xs font-semibold text-[#26B6B6] self-start">
                <Sparkles className="w-3 h-3" />
                <span>
                  {activeSlide === 0 && (isRtl ? 'اولین اکوسیستم ملی بیم ایران' : "Iran's National BIM Ecosystem")}
                  {activeSlide === 1 && (isRtl ? 'برای طراحان، مهندسان و مدلرهای بیم' : 'For Architects, Engineers & BIM Modelers')}
                  {activeSlide === 2 && (isRtl ? 'برای تولیدکنندگان و صاحبان برند' : 'For Manufacturers & Brand Owners')}
                  {activeSlide === 3 && (isRtl ? 'پویایی بازار ایران‌بیم‌هاب' : 'IranBIMhub Market Momentum')}
                  {activeSlide === 4 && (isRtl ? 'عضویت رایگان' : 'Free Start')}
                </span>
              </div>

              {/* Slide Heading */}
              <h1 className="text-sm sm:text-lg md:text-2xl font-black tracking-tight leading-snug transition-all duration-300 text-white">
                {activeSlide === 0 && (isRtl ? 'ایران‌بیم‌هاب، خانه صنعت ساختمان هوشمند ایران' : "IranBIMhub — Home of Iran's Smart Construction Industry")}
                {activeSlide === 1 && (isRtl ? 'هر آبجکتی که برای پروژه‌تان نیاز دارید، همین‌جاست' : 'Every Object Your Project Needs, Right Here')}
                {activeSlide === 2 && (isRtl ? 'برند شما، در دستان مهندسانی که تصمیم می‌گیرند' : 'Your Brand, In the Hands of Decision-Making Engineers')}
                {activeSlide === 3 && (isRtl ? 'اعتمادی که هر روز رشد می‌کند' : 'Trust That Grows Every Day')}
                {activeSlide === 4 && (isRtl ? 'شروع، بدون هیچ هزینه‌ای' : 'Start — At No Cost')}
              </h1>

              {/* Slide Description */}
              <p className="text-[9px] sm:text-[11px] md:text-[13px] text-gray-300 leading-normal font-light transition-all duration-300">
                {activeSlide === 0 && (isRtl ? 'جایی که مهندسان و معماران، دقیق‌ترین آبجکت‌های بیم را می‌یابند؛ و تولیدکنندگان ایرانی، محصولات خود را وارد آینده دیجیتال ساخت‌وساز می‌کنند.' : 'Where engineers and architects find precise BIM objects, and Iranian manufacturers step into the digital future of construction.')}
                {activeSlide === 1 && (isRtl ? 'دسترسی به هزاران آبجکت بیم استاندارد ایرانی، آماده دانلود مستقیم. با عضویت ویژه، دانلود نامحدود و ابزارهای مدیریت پروژه را تجربه کنید.' : 'Access thousands of standardized Iranian BIM objects, ready to download instantly. Upgrade to VIP for unlimited downloads and advanced project tools.')}
                {activeSlide === 2 && (isRtl ? 'کاتالوگ محصولات خود را به زبان مهندسی امروز ترجمه کنید و مستقیماً در پروژه‌های واقعی ساختمانی ایران دیده شوید. با اشتراک ویژه، از تحلیل بازار و اولویت نمایش بهره‌مند شوید.' : "Translate your product catalog into today's engineering language and get specified directly into real Iranian construction projects. Upgrade for market analytics and priority placement.")}
                {activeSlide === 3 && (isRtl ? 'بستری پویا برای دسترسی به باکیفیت‌ترین مدل‌های BIM استاندارد و بومی، به پشتوانه تولیدکنندگان طراز اول کشور و بازخورد زنده بازار ساختمان ایران.' : 'A dynamic ecosystem for accessing high-quality standardized domestic BIM models, backed by top-tier suppliers and real-time market momentum.')}
                {activeSlide === 4 && (isRtl ? 'چه به‌دنبال آبجکت بیم هستید، چه می‌خواهید برندتان دیده شود؛ ایران‌بیم‌هاب رایگان شروع می‌شود.' : "Whether you're looking for a BIM object or want your brand seen, IranBIMhub starts free.")}
              </p>

              {/* Slide Button Action */}
              <div className="flex flex-wrap gap-2 pt-1">
                {activeSlide === 0 && (
                  <button
                    onClick={() => onNavigate('about')}
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap animate-fadeIn"
                  >
                    {isRtl ? 'کشف پلتفرم ←' : 'Discover the Platform →'}
                  </button>
                )}

                {activeSlide === 1 && (
                  <>
                    <button
                      onClick={() => {
                        const el = document.getElementById('search-and-browse-categories');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        else onNavigate('categories');
                      }}
                      className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? 'مشاهده کاتالوگ' : 'Browse Catalog'}
                    </button>
                    <button
                      onClick={() => onNavigate('payment', undefined, undefined, 'modeler-vip')}
                      className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? 'ارتقا به عضویت ویژه' : 'Upgrade to VIP'}
                    </button>
                  </>
                )}

                {activeSlide === 2 && (
                  <>
                    <button
                      onClick={() => onNavigate('for-manufacturers')}
                      className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? 'ثبت‌نام برند' : 'Register Your Brand'}
                    </button>
                    <button
                      onClick={() => onNavigate('for-manufacturers')}
                      className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? 'مشاهده پلن‌های اشتراک' : 'View Subscription Plans'}
                    </button>
                  </>
                )}

                {activeSlide === 3 && (
                  <button
                    onClick={() => {
                      if (onOpenAuthModal) onOpenAuthModal();
                    }}
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap animate-fadeIn"
                  >
                    {isRtl ? 'عضویت در پورتال فعالان' : 'Join the Network'}
                  </button>
                )}

                {activeSlide === 4 && (
                  <>
                    <button
                      onClick={() => onNavigate('for-designers')}
                      className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? 'ثبت‌نام طراحان' : 'Register as a Designer'}
                    </button>
                    <button
                      onClick={() => onNavigate('for-manufacturers')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? 'ثبت‌نام تولیدکنندگان' : 'Register as a Manufacturer'}
                    </button>
                  </>
                )}
              </div>

            </div>

            {/* Slide Graphic Element Area (Right/Left) */}
            <div className="md:col-span-5 flex items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] scale-100 sm:scale-105 md:scale-110 lg:scale-120 animate-float-3d">
              {activeSlide === 0 && (
                <div className="relative w-full h-full flex items-center justify-center select-none" dir="ltr">
                  {/* Glowing Orbit Rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Ring 1 (Inner) - Carrying Building icon */}
                    <div className="w-32 h-32 border border-[#26B6B6]/30 rounded-full animate-spin [animation-duration:12s] absolute">
                      <div className="w-6 h-6 bg-slate-900 border border-[#26B6B6]/50 rounded-full flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2 shadow-[0_0_8px_rgba(38,182,182,0.4)]">
                        <Building className="w-3.5 h-3.5 text-[#26B6B6]" />
                      </div>
                    </div>
                    {/* Ring 2 (Middle) - Carrying Factory & Cpu icons */}
                    <div className="w-44 h-44 border border-[#26B6B6]/20 rounded-full animate-spin [animation-duration:20s] [animation-direction:reverse] absolute">
                      <div className="w-6 h-6 bg-slate-900 border border-[#26B6B6]/40 rounded-full flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2 shadow-[0_0_8px_rgba(38,182,182,0.3)]">
                        <Factory className="w-3.5 h-3.5 text-[#26B6B6]" />
                      </div>
                      <div className="w-6 h-6 bg-slate-900 border border-[#26B6B6]/40 rounded-full flex items-center justify-center absolute -bottom-3 left-1/2 -translate-x-1/2 shadow-[0_0_8px_rgba(38,182,182,0.3)]">
                        <Cpu className="w-3.5 h-3.5 text-[#26B6B6]" />
                      </div>
                    </div>
                    {/* Ring 3 (Outer) - Carrying BookOpen icon */}
                    <div className="w-56 h-56 border border-dashed border-[#26B6B6]/15 rounded-full animate-spin [animation-duration:32s] absolute">
                      <div className="w-6 h-6 bg-slate-900 border border-[#26B6B6]/30 rounded-full flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2 shadow-[0_0_8px_rgba(38,182,182,0.2)]">
                        <BookOpen className="w-3.5 h-3.5 text-[#26B6B6]" />
                      </div>
                    </div>
                  </div>

                  {/* Central Hub Node */}
                  <div className="relative w-32 h-32 border border-[#26B6B6]/40 bg-slate-950/85 backdrop-blur-md rounded-full flex flex-col items-center justify-center shadow-[0_0_35px_rgba(38,182,182,0.45)] transition-all hover:scale-105">
                    <Logo iconOnly={true} className="w-12 h-12" />
                    
                    {/* floating identity labels */}
                    <div className="absolute -top-3.5 -right-3 bg-gradient-to-r from-[#26B6B6] to-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg">
                      {isRtl ? 'پایگاه ملی بیم' : 'National BIM Hub'}
                    </div>
                    <div className="absolute -bottom-3.5 -left-3 bg-[#464E56] border border-gray-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg">
                      {isRtl ? '+۱۴ دسته صنعتی' : '+14 Industries'}
                    </div>
                  </div>
                </div>
              )}

              {activeSlide === 1 && (
                <div className="relative w-full h-full flex items-center justify-center select-none" dir="ltr">
                  {/* Layered Stacked Cards */}
                  <div className="relative w-64 h-48 flex items-center justify-center">
                    
                    {/* 3rd Card (Back) */}
                    <div className="absolute bg-slate-900/60 backdrop-blur-md border border-[#26B6B6]/20 rounded-xl p-3 w-40 h-28 shadow-lg transform -translate-x-8 -translate-y-6 rotate-[-6deg] opacity-40">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[7px] text-[#26B6B6] font-mono">ARCHICAD LCF</span>
                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                      </div>
                      <div className="flex items-center justify-center h-14">
                        <Grid3X3 className="w-8 h-8 text-gray-500" />
                      </div>
                    </div>

                    {/* 2nd Card (Middle) */}
                    <div className="absolute bg-slate-900/80 backdrop-blur-md border border-[#26B6B6]/30 rounded-xl p-3 w-40 h-28 shadow-lg transform translate-x-4 -translate-y-3 rotate-[3deg] opacity-70">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[7px] text-[#26B6B6] font-mono">IFC FAMILY</span>
                        <div className="w-2 h-2 rounded-full bg-[#26B6B6]/50"></div>
                      </div>
                      <div className="flex items-center justify-center h-14">
                        <DoorOpen className="w-8 h-8 text-[#26B6B6]/70" />
                      </div>
                    </div>

                    {/* 1st Card (Front with active download pulse) */}
                    <div className="absolute bg-slate-950/90 backdrop-blur-md border border-[#26B6B6]/70 rounded-xl p-3 w-44 h-32 shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform translate-x-0 translate-y-2 rotate-0 opacity-100">
                      <div className="flex justify-between items-center mb-1.5 border-b border-white/10 pb-1">
                        <span className="text-[8px] text-white font-black tracking-wide">REVIT RFA</span>
                        <span className="text-[7px] bg-[#26B6B6]/20 text-[#26B6B6] px-1 rounded-sm font-mono font-bold">LOD 350</span>
                      </div>
                      
                      <div className="flex justify-between items-center h-16 px-1">
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] font-black text-gray-200">{isRtl ? 'پمپ آبرسانی طبقاتی' : 'Multistage Water Pump'}</span>
                          <span className="text-[7px] text-gray-400 font-mono">Size: 4.8 MB • Ver: 2024</span>
                        </div>
                        {/* Download Micro-interaction */}
                        <div className="relative w-8 h-8 bg-[#26B6B6]/15 rounded-lg flex items-center justify-center border border-[#26B6B6]/40 overflow-hidden">
                          <Download className="w-4 h-4 text-[#26B6B6] animate-down-arrow" />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[7px] text-emerald-400 pt-1 border-t border-white/10">
                        <Check className="w-2.5 h-2.5" />
                        <span>{isRtl ? 'سازگار با استانداردهای نظام فنی' : 'Verified Building Code Compliant'}</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {activeSlide === 2 && (
                <div className="relative w-full h-full flex items-center justify-center select-none" dir="ltr">
                  {/* Spotlight light beam */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-36 bg-gradient-to-t from-[#26B6B6]/20 to-transparent blur-xl rounded-t-full pointer-events-none"></div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[120px] border-b-[#26B6B6]/10 origin-bottom opacity-60 blur-xs"></div>

                  <div className="relative w-64 h-48 flex items-center justify-center">
                    
                    {/* Glowing brand product node */}
                    <div className="relative w-16 h-16 bg-slate-900 border border-[#26B6B6] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(38,182,182,0.4)] z-10">
                      <Logo iconOnly={true} className="w-10 h-10" />
                    </div>

                    {/* Floating statistics card (Analytics) */}
                    <div className="absolute right-4 top-2 bg-slate-950/90 border border-[#26B6B6]/30 rounded-lg p-2.5 space-y-1.5 shadow-lg max-w-[110px] z-20 text-left">
                      <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-bold">
                        <TrendingUp className="w-3 h-3" />
                        <span>{isRtl ? 'رشد بازدید' : 'Views Up'}</span>
                      </div>
                      {/* Mini bar chart */}
                      <div className="h-6 flex items-end gap-1.5 pt-0.5">
                        <div className="w-1.5 h-2 bg-[#26B6B6]/30 rounded-xs"></div>
                        <div className="w-1.5 h-3 bg-[#26B6B6]/50 rounded-xs"></div>
                        <div className="w-1.5 h-4 bg-[#26B6B6]/70 rounded-xs"></div>
                        <div className="w-1.5 h-5 bg-emerald-400 rounded-xs animate-pulse"></div>
                      </div>
                    </div>

                    {/* Floating views/leads notification bubble */}
                    <div className="absolute left-2 bottom-6 bg-[#464E56]/95 border border-gray-600 rounded-full py-1 px-2.5 flex items-center gap-1.5 shadow-md z-20 animate-pulse text-left">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                      <span className="text-[8px] font-black text-white">
                        {isRtl ? 'سرنخ جدید +۱' : 'New Lead +1'}
                      </span>
                    </div>

                  </div>
                </div>
              )}

              {activeSlide === 3 && (
                <div className="w-full h-full flex items-center justify-center select-none animate-fadeIn" dir="ltr">
                  <div className="grid grid-cols-2 gap-2.5 w-full max-w-[260px]">
                    
                    {/* Stat Card 1 - Active Objects */}
                    <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3 text-center space-y-1 backdrop-blur-md shadow-lg relative overflow-hidden transition-transform hover:scale-105">
                      <div className="absolute right-1.5 top-1.5 w-1 h-1 bg-[#26B6B6] rounded-full animate-ping"></div>
                      <span className="text-sm font-black text-[#26B6B6] font-mono tracking-wide">
                        <CountUp key={activeSlide} end={15000} prefix="+" isRtl={isRtl} />
                      </span>
                      <span className="text-[9px] text-gray-300 font-bold block">{isRtl ? 'آبجکت فعال' : 'BIM Objects'}</span>
                    </div>

                    {/* Stat Card 2 - Brand Houses */}
                    <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3 text-center space-y-1 backdrop-blur-md shadow-lg relative overflow-hidden transition-transform hover:scale-105">
                      <div className="absolute right-1.5 top-1.5 w-1 h-1 bg-[#26B6B6] rounded-full animate-ping"></div>
                      <span className="text-sm font-black text-[#26B6B6] font-mono tracking-wide">
                        <CountUp key={activeSlide} end={140} prefix="+" isRtl={isRtl} />
                      </span>
                      <span className="text-[9px] text-gray-300 font-bold block">{isRtl ? 'تولیدکننده ایرانی' : 'Brand Houses'}</span>
                    </div>

                    {/* Stat Card 3 - Successful Downloads */}
                    <div className="bg-gradient-to-br from-[#26B6B6]/20 to-[#26B6B6]/5 border-2 border-[#26B6B6]/40 rounded-xl p-3 text-center space-y-1.5 col-span-2 shadow-inner relative overflow-hidden">
                      <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-[#26B6B6] rounded-full animate-ping"></div>
                      <span className="text-base font-black text-emerald-400 font-mono tracking-wide">
                        <CountUp key={activeSlide} end={28000} prefix="+" isRtl={isRtl} />
                      </span>
                      <span className="text-[9px] text-gray-100 font-black block tracking-tight">
                        {isRtl ? 'دانلود موفق فمیلی در ماه جاری' : 'Monthly Successful Downloads'}
                      </span>
                      
                      {/* Stylized miniature mini chart line */}
                      <div className="h-1.5 flex items-end gap-1.5 justify-center pt-1">
                        <div className="w-1.5 h-1 bg-[#26B6B6]/30 rounded"></div>
                        <div className="w-1.5 h-1.5 bg-[#26B6B6]/45 rounded"></div>
                        <div className="w-1.5 h-2 bg-[#26B6B6]/60 rounded"></div>
                        <div className="w-1.5 h-3 bg-[#26B6B6]/80 rounded"></div>
                        <div className="w-1.5 h-4 bg-emerald-400 rounded animate-pulse"></div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {activeSlide === 4 && (
                <div className="relative w-full h-full flex items-center justify-center select-none" dir="ltr">
                  <div className="relative w-64 h-48 flex items-center justify-center">
                    
                    {/* Connecting path lines */}
                    <div className="absolute left-[15%] right-[50%] h-[1.5px] bg-gradient-to-r from-transparent via-[#26B6B6]/40 to-[#26B6B6] top-1/2 -translate-y-1/2 z-0">
                      <div className="absolute right-0 w-2 h-2 rounded-full bg-[#26B6B6] blur-xs animate-ping"></div>
                    </div>
                    <div className="absolute left-[50%] right-[15%] h-[1.5px] bg-gradient-to-l from-transparent via-emerald-500/40 to-emerald-500 top-1/2 -translate-y-1/2 z-0">
                      <div className="absolute left-0 w-2 h-2 rounded-full bg-emerald-500 blur-xs animate-ping"></div>
                    </div>

                    {/* Left Capsule - Designer Path */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#464E56]/90 border border-gray-600 rounded-2xl flex flex-col items-center justify-center shadow-lg hover:border-[#26B6B6] transition-colors z-10">
                      <Compass className="w-5 h-5 text-[#26B6B6]" />
                      <span className="absolute -bottom-5 text-[8px] font-black text-gray-300 whitespace-nowrap">
                        {isRtl ? 'طراحان' : 'Designers'}
                      </span>
                    </div>

                    {/* Center Node - Shared Platform */}
                    <div className="relative w-16 h-16 bg-slate-950/95 border-2 border-slate-800 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(38,182,182,0.3)] z-10">
                      <Logo iconOnly={true} className="w-9 h-9" />
                    </div>

                    {/* Right Capsule - Manufacturer Path */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#464E56]/90 border border-gray-600 rounded-2xl flex flex-col items-center justify-center shadow-lg hover:border-emerald-500 transition-colors z-10">
                      <Factory className="w-5 h-5 text-emerald-400" />
                      <span className="absolute -bottom-5 text-[8px] font-black text-gray-300 whitespace-nowrap">
                        {isRtl ? 'تولیدکنندگان' : 'Manufacturers'}
                      </span>
                    </div>

                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Carousel Manual Controls & Progress indicators */}
          <div className="flex items-center justify-center mt-4 pt-3 border-t border-white/10">
            
            {/* Dots + Animated Progress Indicator */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map(idx => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`relative h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === idx ? 'w-6 bg-[#26B6B6]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 3. PRECISION SEARCH AND BROWSE BY CATEGORY - MERGED WITH CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20" id="search-and-browse-categories">
        
        {/* Unified Search Engine & Categories Row */}
        <div 
          ref={searchContainerRef}
          onMouseMove={handleSearchMouseMove}
          onMouseEnter={() => setIsSearchHovered(true)}
          onMouseLeave={() => setIsSearchHovered(false)}
          className="relative bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6 shadow-sm overflow-hidden transition-all duration-300 select-none"
          style={{
            background: isSearchHovered 
              ? `radial-gradient(circle 280px at ${searchMousePos.x}% ${searchMousePos.y}%, rgba(38, 182, 182, 0.12) 0%, rgba(30, 41, 59, 0.01) 80%, transparent 100%)`
              : undefined
          }}
        >
          {/* Subtle static blueprint grid */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#26B6B6_1px,transparent_1px),linear-gradient(to_bottom,#26B6B6_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          {/* Interactive crosshairs that follow the mouse coordinate */}
          {isSearchHovered && (
            <>
              <div 
                className="absolute top-0 bottom-0 border-r border-dashed border-[#26B6B6]/20 pointer-events-none"
                style={{ left: `${searchMousePos.x}%` }}
              />
              <div 
                className="absolute left-0 right-0 border-b border-dashed border-[#26B6B6]/20 pointer-events-none"
                style={{ top: `${searchMousePos.y}%` }}
              />
              {/* Coordinate label in the corner of the crosshair */}
              <div 
                className="absolute text-[8px] font-mono text-[#26B6B6]/50 bg-white/85 dark:bg-gray-950/85 px-1.5 py-0.5 rounded shadow-xs border border-gray-100 dark:border-gray-800 pointer-events-none"
                style={{ 
                  left: `${searchMousePos.x + 1}%`, 
                  top: `${searchMousePos.y + 1.5}%` 
                }}
              >
                X: {searchMousePos.x.toFixed(0)}% Y: {searchMousePos.y.toFixed(0)}%
              </div>
            </>
          )}
          
          <div className="max-w-xl mx-auto space-y-1 relative z-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight">
              {isRtl ? 'جستجو در کتابخانه ملی بیم ایران' : 'Search the National BIM Library of Iran'}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-normal font-light max-w-lg mx-auto">
              {isRtl 
                ? 'نام کالا، مشخصه فنی یا کدهای کارخانجات ایرانی را جهت دانلود فمیلی معتبر بنویسید.' 
                : 'Enter model keys, manufacturer names, or standards to search certified Revit/IFC objects.'
              }
            </p>
          </div>

          {/* Precision Search Box */}
          <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-gray-950 p-1.5 rounded-xl sm:rounded-2xl shadow-sm max-w-2xl mx-auto text-gray-800 dark:text-gray-100 relative z-20 border border-gray-200 dark:border-gray-800 transition-all duration-300 focus-within:border-[#26B6B6] focus-within:ring-1 focus-within:ring-[#26B6B6]/30">
            <div className="flex flex-col sm:flex-row items-stretch gap-1.5">
              
              {/* Keywords Input */}
              <div className="flex-1 flex items-center gap-2 px-3 border-b sm:border-b-0 sm:border-e border-gray-100 dark:border-gray-800 py-1">
                <Search className="w-4 h-4 text-[#26B6B6]" />
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
                <Cpu className="w-3.5 h-3.5 text-[#26B6B6]" />
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
                className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-black shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap hover:scale-[1.01] active:scale-95"
              >
                <span>{isRtl ? 'جستجوی پیشرفته' : 'Advanced Search'}</span>
              </button>

            </div>

            {/* Faceted Autocomplete Suggestion Panel */}
            {showSuggestions && suggestions && (
              <div 
                className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-150 text-start overflow-hidden z-30 max-h-96 ${isRtl ? 'text-right' : 'text-left'}`}
                onMouseLeave={() => setShowSuggestions(false)}
              >
                
                {/* Product Matches */}
                {suggestions.products.length > 0 && (
                  <div className="p-3 border-b border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
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
                           className="w-full text-start hover:bg-gray-50 p-1.5 rounded-md flex items-center justify-between text-xs transition-colors cursor-pointer"
                        >
                           <span className="font-semibold text-gray-800 line-clamp-1">
                             {isRtl ? p.titleFa : p.titleEn}
                           </span>
                           <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">
                             {p.lod}
                           </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category matches */}
                {suggestions.categories.length > 0 && (
                  <div className="p-3 border-b border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
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
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
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
                           className="w-full text-start hover:bg-gray-50 p-1.5 rounded-md flex items-center gap-2 text-xs transition-colors cursor-pointer"
                        >
                           <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center font-mono text-[9px] font-bold text-gray-600">
                             {m.logo.substring(0,2)}
                           </div>
                           <span className="font-semibold text-gray-700">
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
                  <Grid3X3 className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'دسته‌بندی محصولات' : 'Product Categories'}</span>
                </h2>
                <p className="text-[10.5px] sm:text-xs text-gray-400 font-medium text-center">
                  {isRtl ? 'بررسی کاتالوگ سازندگان بر اساس کدهای استاندارد صنعت ساختمان ایران' : 'Explore catalogs according to national and international building standards'}
                </p>
              </div>
            </div>

            {isCategoriesExpanded ? (
              /* EXPANDED MULTI-ROW WRAPPING LAYOUT */
              <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center py-2.5 px-0.5 animate-fadeIn">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={(e) => handleCategoryItemClick(cat.id, e)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 hover:border-[#26B6B6]/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] select-none group hover:scale-[1.02]"
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
              <div className="relative group/scroll px-1">
                
                {/* Left Scroll Button */}
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  className="absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 z-25 w-7 h-7 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-[#26B6B6] hover:scale-105 transition-all cursor-pointer opacity-90 sm:opacity-0 sm:group-hover/scroll:opacity-100 focus:opacity-100"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Right Scroll Button */}
                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className="absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 z-25 w-7 h-7 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-[#26B6B6] hover:scale-105 transition-all cursor-pointer opacity-90 sm:opacity-0 sm:group-hover/scroll:opacity-100 focus:opacity-100"
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
                  className="flex gap-2.5 overflow-x-auto py-2.5 px-0.5 scrollbar-none cursor-grab active:cursor-grabbing select-none scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={(e) => handleCategoryItemClick(cat.id, e)}
                      className="flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 hover:border-[#26B6B6]/50 transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] select-none group"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 text-[10px] sm:text-xs font-black text-gray-700 dark:text-gray-300 hover:text-[#26B6B6] transition-all cursor-pointer shadow-3xs hover:scale-102 active:scale-98"
              >
                {isCategoriesExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-[#26B6B6]" />
                    <span>{isRtl ? 'نمایش خطی (اسکرول)' : 'Show Linear Scroll'}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-[#26B6B6]" />
                    <span>{isRtl ? 'نمایش شبکه‌ای (مشاهده همه دسته‌ها)' : 'View All Categories (Grid)'}</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 3. NEWEST BIM OBJECTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8" id="homepage-newest-objects">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-150/50 dark:border-gray-800/60 pb-5">
          <div className="space-y-2 text-start">
            <div className="inline-flex items-center gap-2 bg-[#26B6B6]/5 text-[#26B6B6] px-3 py-1 rounded-full text-[10px] font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{isRtl ? 'به‌روزرسانی‌های جدید' : 'New Releases'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {isRtl ? 'جدیدترین آبجکت‌های منتشر شده' : 'Newest Standardized BIM Objects'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 leading-relaxed font-light max-w-2xl">
              {isRtl 
                ? 'آخرین مدل‌های پارامتریک تاییدشده، فمیلی‌های رویت و جزئیات فنی قطعات که به تازگی به دایرکتوری اضافه شده‌اند.' 
                : 'Browse the latest architect-approved families, Revit models, and parametric building objects added this week.'}
            </p>
          </div>

          <div className="shrink-0 text-start">
            <button
              onClick={() => {
                onFilterChange({});
                onNavigate('library');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#26B6B6] hover:text-[#1e9494] transition-colors cursor-pointer group"
            >
              <span>{isRtl ? 'مشاهده همه محصولات کتابخانه' : 'Explore Entire Library'}</span>
              <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
          </div>
        </div>

        {/* Objects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BIM_OBJECTS.slice(-4).reverse().map((obj) => (
            <BIMObjectCard
              key={`new-obj-${obj.id}`}
              object={obj}
              isSaved={savedObjects.includes(obj.id)}
              onToggleSave={() => onToggleSave(obj.id)}
              onClick={() => onSelectObject(obj)}
              onQuickDownload={(format) => onQuickDownload(obj, format)}
              onViewBrand={onViewBrand}
            />
          ))}
        </div>

      </section>

      {/* 4. TRUSTED COMPANIES & VALUE PROPOSITION FOR MANUFACTURERS */}
      <section className="bg-slate-50 dark:bg-gray-950/40 border-y border-gray-150 dark:border-gray-800/60 py-6 sm:py-8 lg:py-10" id="homepage-trusted-brands">
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
              {/* Fade overlays on left and right of scrolling pane */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 dark:from-gray-950/40 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 dark:from-gray-950/40 to-transparent z-10 pointer-events-none" />

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
                {/* We triple the manufacturers array to create a seamless infinite horizontal scrolling list */}
                <div className="flex gap-4 px-4 shrink-0">
                  {[[...MANUFACTURERS], [...MANUFACTURERS], [...MANUFACTURERS]].map((group, groupIdx) => (
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
                            {mfg.tier}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-start pt-6">
            
            {/* Box 1 (Rightmost) */}
            <div className="flex flex-col bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6] flex items-center justify-center shrink-0 border border-[#26B6B6]/10 group-hover:scale-110 transition-transform duration-350">
                  <Layers className="w-5.5 h-5.5" />
                </div>
              </div>
              <div className="space-y-2.5">
                <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug group-hover:text-[#26B6B6] transition-colors">
                  {isRtl ? 'حضور در میز طراحی مهندسان' : 'Presence on Drafting Desks'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  {isRtl 
                    ? 'محصولات و مصالح شما دقیقاً در زمانِ کلیدیِ طراحی و پیش از شروع پروژه، به دست معماران، مهندسان مشاور و گودبرداران بررسی و وارد نقشه‌های رویت (Revit) می‌شوند.' 
                    : 'Your products and materials are reviewed and integrated into Revit plans by architects, consultants, and developers during the key design phase.'
                  }
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="flex flex-col bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6] flex items-center justify-center shrink-0 border border-[#26B6B6]/10 group-hover:scale-110 transition-transform duration-350">
                  <Users className="w-5.5 h-5.5" />
                </div>
              </div>
              <div className="space-y-2.5">
                <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug group-hover:text-[#26B6B6] transition-colors">
                  {isRtl ? 'جذب تقاضای واقعی بازار' : 'Capture Real Market Demand'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  {isRtl 
                    ? 'هر بازدید، دانلود کاتالوگ یا کلیک روی برگه مشخصات فنی محصولات شما، یک فرصت فروش مستقیم و ارجاعِ مستقیمِ یک خریدارِ بالقوه به بخش بازرگانی شماست.' 
                    : 'Every page view, catalog download, or click on technical sheets is a direct sales lead, routing a hot prospect straight to your sales desk.'
                  }
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="flex flex-col bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6] flex items-center justify-center shrink-0 border border-[#26B6B6]/10 group-hover:scale-110 transition-transform duration-350">
                  <LineChart className="w-5.5 h-5.5" />
                </div>
              </div>
              <div className="space-y-2.5">
                <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug group-hover:text-[#26B6B6] transition-colors">
                  {isRtl ? 'رصد هوشمند رفتار بازار' : 'Smart Behavior Tracking'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  {isRtl 
                    ? 'به صورت زنده و شفاف رصد کنید که کدام شرکت‌های مهندسی، مشاوران بزرگ و پروژه‌های ساختمانی، کدهای تجاری و مدل‌های محصولات شما را دانلود و انتخاب کرده‌اند.' 
                    : 'Monitor in real-time which engineering firms, major consultancies, and construction projects are downloading and specifying your catalog codes.'
                  }
                </p>
              </div>
            </div>

            {/* Box 4 (Leftmost) */}
            <div className="flex flex-col bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6] flex items-center justify-center shrink-0 border border-[#26B6B6]/10 group-hover:scale-110 transition-transform duration-350">
                  <Sparkles className="w-5.5 h-5.5 text-[#26B6B6]" />
                </div>
              </div>
              <div className="space-y-2.5">
                <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug group-hover:text-[#26B6B6] transition-colors">
                  {isRtl ? 'ورود به دنیای BIM بدون هزینه' : 'Zero-Cost BIM Onboarding'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  {isRtl 
                    ? 'بدون نیاز به کارت اعتباری یا تعهد مالی، اولین فایل‌های BIM و محصولات خود را بارگذاری کنید؛ بازخورد بازار را بسنجید و سهم فروش خود را توسعه دهید.' 
                    : 'Upload your first BIM files and products without a credit card or financial commitment; analyze market fit and grow your sales pipeline.'
                  }
                </p>
              </div>
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
                  ? 'مهندسان ایرانی روزانه ساعت‌ها وقت ارزشمند خود را صرف مدلسازی دستی درها، پنجره‌ها و تجهیزات می‌کنند، یا به کاتالوگ‌های خارجی پناه می‌برند که هیچ تطابقی با ابعاد، متریال و زنجیره تامین بازار مصالح کشورمان ندارد. ایران‌بیم‌هاب این خلاء بزرگ را حل کرده است.' 
                  : 'Iranian AEC professionals waste hours manually modeling doors, windows, and equipment, or rely on foreign catalogs that mismatch local standards, sizes, and active suppliers. IranBIMhub fills this gap.'}
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

      {/* 7. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" id="homepage-testimonials-preview">
        <div className="text-center space-y-1">
          <h2 className="text-base sm:text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2 justify-center">
            <MessageSquare className="w-5 h-5 text-[#26B6B6]" />
            <span>{isRtl ? 'دیدگاه معماران و متخصصان بیم' : 'Insights from Architects & BIM Specialists'}</span>
          </h2>
          <p className="text-[10.5px] sm:text-xs text-gray-400 font-medium text-center">
            {isRtl ? 'نظرات طراحان، معماران و مدیران پروژه‌ها درباره پلتفرم ایران‌بیم‌هاب' : 'What leading architectural designers and BIM managers say about us'}
          </p>
        </div>

        <div className="relative group/testimonials px-1 overflow-hidden">
          <div
            className="flex gap-4 py-3 px-0.5 select-none animate-marquee hover:[animation-play-state:paused]"
            dir="ltr"
            style={{ 
              width: 'max-content',
              WebkitMaskImage: 'linear-gradient(to right, transparent, white 4%, white 96%, transparent)',
              maskImage: 'linear-gradient(to right, transparent, white 4%, white 96%, transparent)'
            }}
          >
            {[...MOCK_REVIEWS, ...MOCK_REVIEWS, ...MOCK_REVIEWS].map((rev, idx) => (
              <div 
                key={`${rev.id}-${idx}`} 
                className="flex-shrink-0 w-[290px] sm:w-[340px] bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-[#26B6B6]/30 transition-all flex flex-col justify-between text-start group relative"
              >
                <div className="absolute top-4 end-4 text-gray-100 dark:text-gray-800 text-6xl font-serif select-none leading-none opacity-50 dark:opacity-30">
                  ”
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic relative z-10 mb-4 line-clamp-4">
                  "{isRtl ? rev.textFa : rev.textEn}"
                </p>
                <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-800/60 pt-3">
                  <div className="w-9 h-9 bg-[#26B6B6]/10 text-[#26B6B6] rounded-full flex items-center justify-center font-black text-xs shrink-0">
                    {rev.nameEn.substring(5,7).trim() || rev.nameEn.substring(0,2)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-gray-800 dark:text-gray-200 truncate">
                      {isRtl ? rev.nameFa : rev.nameEn}
                    </h4>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                      {isRtl ? rev.roleFa : rev.roleEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEW FEATURED: LEARN / INSIGHTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" id="homepage-learn-hub-preview">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="text-center sm:text-start">
            <h2 className="text-xl font-bold text-[#464E56] dark:text-gray-200 flex items-center gap-2 justify-center sm:justify-start">
              <BookOpen className="w-5 h-5 text-[#26B6B6]" />
              <span>{isRtl ? 'آخرین مقالات برگزیده' : 'From Our Insights & Learn Hub'}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isRtl ? 'راهنماهای مصور و صریح ۹۰ ثانیه‌ای مخصوص طراحان فاز دو و صاحبان صنایع ساختمانی' : 'Scannable industry analysis, 90-second guidelines, and marketing tactics.'}
            </p>
          </div>
          
          <button
            onClick={() => {
              onNavigate('learn');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-black text-[#26B6B6] hover:text-[#1e9494] transition-colors cursor-pointer"
          >
            {isRtl ? 'ورود به بخش مقالات ←' : 'Open Learn Hub →'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.slice(0, 3).map(art => {
            const title = language === 'fa' ? art.titleFa : art.titleEn;
            const summary = language === 'fa' ? art.summaryFa : art.summaryEn;
            return (
              <div
                key={art.id}
                onClick={() => {
                  localStorage.setItem('selected_learn_article_id', art.id);
                  onNavigate('learn');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between text-start group h-full"
              >
                <div>
                  <div className="relative h-[150px] overflow-hidden bg-gray-150 dark:bg-gray-800">
                    <img 
                      src={art.imageUrl} 
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-[#26B6B6] bg-[#26B6B6]/5 px-2 py-0.5 rounded">
                        {art.category === 'basics' && (isRtl ? 'مبانی بیم' : 'BIM Basics')}
                        {art.category === 'business' && (isRtl ? 'ارزش تجاری' : 'Business Value')}
                        {art.category === 'market' && (isRtl ? 'بازار ایران' : 'Iran Market')}
                        {art.category === 'guides' && (isRtl ? 'راهنما' : 'Guides')}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">
                        {language === 'fa' ? art.readTimeFa : art.readTimeEn}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-gray-800 dark:text-white line-clamp-2 group-hover:text-[#26B6B6] transition-colors leading-snug">
                      {title}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed font-light">
                      {summary}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0 text-[10px] font-bold text-[#26B6B6] border-t border-gray-50 dark:border-gray-800/60 mt-2 flex justify-between items-center">
                  <span>{isRtl ? 'مطالعه خلاصه ۹۰ ثانیه‌ای ←' : 'Read 90-Sec Summary →'}</span>
                  <span className="text-gray-300 dark:text-gray-700 font-mono uppercase text-[9px]">
                    {art.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
              aFa: 'ایران‌بیم‌هاب اولین پلتفرم ملی و پایگاه نوآوری تخصصی کاتالوگ دیجیتال و مدل‌های هوشمند (BIM) برای صنعت ساختمان ایران است. ما محصولات واقعی کارخانجات صنعتی و تولیدکنندگان مصالح را به مدل‌های باکیفیت استاندارد Revit و IFC تبدیل کرده و در اختیار جامعه معماران و مهندسان قرار می‌دهیم تا مستقیماً در پروژه‌های عمرانی خود استفاده کنند.',
              aEn: 'IranBIMhub is the premier national platform and innovation hub for digital brand catalogs and smart BIM models in Iran\'s construction industry. We translate real physical manufacturer catalog specifications into standardized, high-quality Revit & open IFC families, enabling AEC designers to integrate them directly into active blueprints.'
            },
            {
              qFa: 'آیا دانلود آبجکت‌های بیم در این سایت رایگان است؟',
              qEn: 'Is downloading BIM objects free on this platform?',
              aFa: 'بله، دسترسی به دایرکتوری و دانلود تمام فمیلی‌ها و آبجکت‌های BIM استاندارد موجود در ایران‌بیم‌هاب برای تمامی طراحان، معماران و مهندسان کشور کاملاً رایگان است.',
              aEn: 'Yes, searching the product directories and downloading all standardized BIM objects and Revit families on IranBIMhub is completely free for all AEC designers, architects, and consulting engineers.'
            },
            {
              qFa: 'چگونه می‌توانم محصولات تولیدی خود را در این سامانه ثبت کنم؟',
              qEn: 'How can I register my manufacturing catalog on this platform?',
              aFa: 'تولیدکنندگان محترم می‌توانند با کلیک روی گزینه «برای تولیدکنندگان» و انتخاب طرح رایگان یا حرفه‌ای، درخواست خود را برای مدل‌سازی هوشمند کاتالوگ و ثبت برند صنعتی خود ثبت نمایند. کارشناسان ما فرآیند مدل‌سازی و انطباق استاندارد را آغاز خواهند کرد.',
              aEn: 'Manufacturers can click \'For Manufacturers\' in the top menu, choose either a Free or Professional plan, and submit their catalogs. Our engineering team will handle the standardized 3D BIM modeling and specifications to publish your models on the live directory.'
            },
            {
              qFa: 'آبجکت‌ها با چه سطحی از جزئیات فنی (LOD) ارائه می‌شوند؟',
              qEn: 'With what Level of Detail (LOD) are the objects modeled?',
              aFa: 'آبجکت‌های بیم موجود در سامانه با رعایت دقیق ابعاد کاتالوگ واقعی و با سطح جزئیات هندسی و اطلاعاتی استاندارد LOD 300 الی LOD 350 طراحی و ارزیابی می‌شوند تا در برآورد مصالح دقیق کارگاهی بالاترین کارایی را داشته باشند.',
              aEn: 'All BIM families are engineered reflecting precise actual dimensions and embedded parameters according to LOD 300 to LOD 350 industry specifications, optimizing speed for shop drawings and material takeoffs.'
            },
            {
              qFa: 'چه فرمت‌هایی برای فایل‌ها در دسترس است؟',
              qEn: 'What file formats are available?',
              aFa: 'فایل‌ها عمدتاً در فرمت استاندارد Revit (.rfa) و فرمت باز و استاندارد بین‌المللی IFC به همراه جزئیات ۲بعدی اتوکد (CAD) جهت تطابق کامل با انواع نرم‌افزارهای تخصصی ارائه می‌شوند.',
              aEn: 'The platform delivers files in native Autodesk Revit (.rfa) formats, open BIM IFC templates, and standard 2D CAD details, providing robust compatibility across all architectural workflows.'
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

    </div>
  );
};
