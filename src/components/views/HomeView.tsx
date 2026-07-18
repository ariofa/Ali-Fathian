import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { CATEGORIES, MANUFACTURERS, BIM_OBJECTS, MOCK_REVIEWS } from '../../data';
import { BIMObject, FilterState } from '../../types';
import { BIMObjectCard } from '../BIMObjectCard';
import { CategoryIcon } from '../CategoryIcon';
import { ARTICLES } from './LearnView';
import { 
  Search, 
  Download, 
  Layers, 
  Building2, 
  Users, 
  FileCheck2, 
  ArrowRight,
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
  MessageSquare
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
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
    <div className="space-y-16 pb-12">
      
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
                  {activeSlide === 0 && (isRtl ? 'پایگاه نوآوری صنعت ساختمان بومی' : 'The Definitive AEC Marketplace')}
                  {activeSlide === 1 && (isRtl ? 'مهندسی هماهنگ، کاهش ریسک فاز دو' : 'Smart Interference Coordination')}
                  {activeSlide === 2 && (isRtl ? 'مهندسی فروش و رشد سهم بازار مصالح' : 'High-Converting BIM Specification')}
                  {activeSlide === 3 && (isRtl ? 'پویایی بازار و شفافیت آماری' : 'National AEC Digital Trust')}
                  {activeSlide === 4 && (isRtl ? 'آسان و کم ریسک برای تولیدکننده ایرانی' : 'Unlocking Digital Value for Suppliers')}
                </span>
              </div>

              {/* Slide Heading */}
              <h1 className="text-sm sm:text-lg md:text-2xl font-black tracking-tight leading-snug transition-all duration-300">
                {activeSlide === 0 && (isRtl ? 'اولین پلتفرم ملی کاتالوگ دیجیتال و آبجکت‌های بیم (BIM)' : "Iran's Definitive BIM Objects Hub & Brand Catalog")}
                {activeSlide === 1 && (isRtl ? 'چرا بیم (BIM)؟ تا ۴۰٪ کاهش خطای تداخل کارگاهی' : 'Why BIM? Up to 40% Reduction in Structural Clashes')}
                {activeSlide === 2 && (isRtl ? 'کالای صنعتی شما مستقیماً در اسناد خرید پروژه' : 'Your Products Specified Directly into National Blueprints')}
                {activeSlide === 3 && (isRtl ? 'اعتماد و پویایی در ارقام زنده بازار ایران‌بیم‌هاب' : 'Verified Growth: Real-Time Network Statistics')}
                {activeSlide === 4 && (isRtl ? 'از سطح پایه به صورت کاملاً رایگان شروع کنید' : 'Start Completely Free. Upgrade at Your Pace.')}
              </h1>

              {/* Slide Description */}
              <p className="text-[9px] sm:text-[11px] md:text-[13px] text-gray-300 leading-normal font-light transition-all duration-300">
                {activeSlide === 0 && (isRtl ? 'پیونددهنده تخصصی برندهای کارخانجات صنعتی با جامعه معماران، مهندسان و برنامه‌ریزان پروژه.' : 'Connecting domestic manufacturing giants with verified AEC specifiers, architects, and designers.')}
                {activeSlide === 1 && (isRtl ? 'طراحی هوشمند سه‌بعدی به شما اجازه می‌دهد پیش از شروع بتن‌ریزی، تمام مسیرهای عبور تجهیزات و کانال‌ها را هماهنگ کنید.' : 'Virtual coordination resolves interferences before real-world installation, shortening completion timelines.')}
                {activeSlide === 2 && (isRtl ? 'وقتی معماران کاتالوگ بیم شما را در طرح‌های خود استفاده کنند، محصول شما به طور خودکار وارد زنجیره خرید می‌شود.' : 'Design specs translate into firm procurement sheets. Place your digital models on active CAD terminals.')}
                {activeSlide === 3 && (isRtl ? 'بستری امن برای بیش از ۱۵,۰۰0 مدل استاندارد و ده‌ها برند صنعتی که برآورد کالا را هوشمند کرده‌اند.' : 'Durable, peer-reviewed building families accessed daily by certified domestic specifiers.')}
                {activeSlide === 4 && (isRtl ? 'هیچ هزینه‌ای برای معرفی اولین محصولات شما وجود ندارد. قابلیت‌های پیشرفته برای برندهای طراز اول.' : 'Zero upfront friction. Scale up to VIP analytics dashboards when your marketing needs expand.')}
              </p>

              {/* Slide Button Action */}
              <div className="flex gap-2 pt-0.5">
                <button
                  onClick={() => {
                    if (activeSlide === 0) {
                      const el = document.getElementById('search-and-browse-categories');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else if (activeSlide === 1) {
                      onNavigate('learn');
                    } else if (activeSlide === 2) {
                      onNavigate('for-manufacturers');
                    } else if (activeSlide === 3) {
                      onNavigate('for-manufacturers');
                    } else if (activeSlide === 4) {
                      onNavigate('for-manufacturers');
                    }
                  }}
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                >
                  {activeSlide === 0 && (isRtl ? 'کاوش و فیلتر تجهیزات' : 'Explore Objects')}
                  {activeSlide === 1 && (isRtl ? 'آموزش ۹۰ ثانیه‌ای بیم چیست؟' : 'Learn BIM Basics')}
                  {activeSlide === 2 && (isRtl ? 'ثبت برند و کاتالوگ مصالح' : 'Grow Your Brand - Join Free')}
                  {activeSlide === 3 && (isRtl ? 'عضویت در پورتال فعالان' : 'Join the Network')}
                  {activeSlide === 4 && (isRtl ? 'ثبت کاتالوگ رایگان' : 'Start Free Listing')}
                </button>
              </div>

            </div>

            {/* Slide Graphic Element Area (Right/Left) */}
            <div className="md:col-span-5 flex items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] scale-100 sm:scale-105 md:scale-110 lg:scale-120 animate-float-3d">
              {activeSlide === 0 && (
                <div className="relative w-full h-full flex items-center justify-center select-none" dir="ltr">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-44 h-44 border-2 border-dashed border-[#26B6B6]/40 rounded-full animate-spin [animation-duration:15s] flex items-center justify-center">
                      <div className="w-32 h-32 border border-dotted border-[#26B6B6]/60 rounded-full animate-spin [animation-duration:8s] [animation-direction:reverse]"></div>
                    </div>
                  </div>
                  <div className="relative w-36 h-36 border-2 border-[#26B6B6] bg-slate-950/85 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center shadow-[0_0_25px_rgba(38,182,182,0.3)] border-t-[#26B6B6]/80 transition-all hover:scale-105">
                    <Building className="w-14 h-14 text-[#26B6B6] drop-shadow-[0_0_8px_rgba(38,182,182,0.6)]" />
                    <span className="text-[10px] font-black text-gray-300 mt-2 tracking-widest uppercase">BIM SYSTEM</span>
                    <div className="absolute -top-3.5 -right-3 bg-gradient-to-r from-[#26B6B6] to-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                      RFA 2026
                    </div>
                    <div className="absolute -bottom-3.5 -left-3 bg-[#464E56] border border-gray-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                      IFC 4.3
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-8 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-md">
                      LOD 350
                    </div>
                  </div>
                </div>
              )}

              {activeSlide === 1 && (
                <div className="w-full h-full flex flex-col items-center justify-center select-none">
                  <div className="bg-slate-950/85 backdrop-blur-md border border-[#26B6B6]/50 rounded-2xl p-4 w-full max-w-[260px] space-y-3 shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-16 h-16 bg-red-500/10 rounded-full blur-xl"></div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-amber-400">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                        {isRtl ? 'آنالیز خودکار برخوردها' : 'Auto Clash System'}
                      </span>
                      <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono font-bold">-40% Clashes</span>
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-gray-300 font-bold">
                          <span>{isRtl ? 'سازه و تاسیسات مکانیکال' : 'Structure vs HVAC'}</span>
                          <span className="font-mono text-emerald-400">Resolved • AutoFix</span>
                        </div>
                        <div className="h-2 bg-gray-900 rounded-full w-full overflow-hidden border border-gray-800">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-full rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-gray-300 font-bold">
                          <span>{isRtl ? 'سینی کابل و لوله‌های آتش‌نشانی' : 'Cable Tray vs Fire Pipe'}</span>
                          <span className="font-mono text-[#26B6B6]">95% Solved</span>
                        </div>
                        <div className="h-2 bg-gray-900 rounded-full w-full overflow-hidden border border-gray-800">
                          <div className="h-full bg-gradient-to-r from-[#26B6B6] to-cyan-400 w-[95%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[8px] text-gray-400">
                      <span>{isRtl ? 'هماهنگی فاز دو معماری' : 'BIM Coordination Tool'}</span>
                      <span className="font-mono text-[#26B6B6]">v2.4 Live</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSlide === 2 && (
                <div className="w-full h-full flex items-center justify-center select-none">
                  <div className="bg-slate-950/85 backdrop-blur-md border border-[#26B6B6]/45 rounded-2xl p-4 w-full max-w-[260px] space-y-3 shadow-2xl text-start relative overflow-hidden">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <h4 className="text-[11px] font-black text-gray-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#26B6B6]" />
                        <span>{isRtl ? 'پورتال اختصاصی سازندگان' : 'Supplier Sync Hub'}</span>
                      </h4>
                      <span className="text-[8px] bg-[#26B6B6]/20 text-[#26B6B6] px-1.5 py-0.5 rounded-full font-mono font-bold">SPEC-IN READY</span>
                    </div>
                    <ul className="space-y-2 text-[10px] text-gray-200">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#26B6B6] rounded-full mt-1 shrink-0 shadow-[0_0_6px_#26B6B6]"></span>
                        <span>{isRtl ? 'درج کدهای تجاری در جدول برآورد خرید پروژه' : 'Automatic brand specification in bills of quantities'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#26B6B6] rounded-full mt-1 shrink-0 shadow-[0_0_6px_#26B6B6]"></span>
                        <span>{isRtl ? 'افزودن مستقیم کات‌شیت و اطلاعات فنی کالا' : 'Verified Revit/CAD technical files linked directly'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#26B6B6] rounded-full mt-1 shrink-0 shadow-[0_0_6px_#26B6B6]"></span>
                        <span>{isRtl ? 'گزارش‌های آماری میزان دانلود و علاقه‌مندی‌ها' : 'Instant client download and specification reports'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSlide === 3 && (
                <div className="w-full h-full flex items-center justify-center select-none" dir="ltr">
                  <div className="grid grid-cols-2 gap-2.5 w-full max-w-[260px]">
                    <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3 text-center space-y-1 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
                      <span className="text-sm font-black text-[#26B6B6] font-mono tracking-wide">+۱۵,۰۰۰</span>
                      <span className="text-[9px] text-gray-300 font-bold block">{isRtl ? 'آبجکت فعال' : 'BIM Objects'}</span>
                    </div>
                    <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3 text-center space-y-1 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
                      <span className="text-sm font-black text-[#26B6B6] font-mono tracking-wide">+۱۴۰</span>
                      <span className="text-[9px] text-gray-300 font-bold block">{isRtl ? 'تولیدکننده ایرانی' : 'Brand Houses'}</span>
                    </div>
                    <div className="bg-gradient-to-br from-[#26B6B6]/20 to-[#26B6B6]/5 border-2 border-[#26B6B6]/40 rounded-xl p-3 text-center space-y-1.5 col-span-2 shadow-inner relative overflow-hidden">
                      <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-[#26B6B6] rounded-full animate-ping"></div>
                      <span className="text-base font-black text-emerald-400 font-mono tracking-wide">+۲۸,۰۰۰</span>
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
                <div className="w-full h-full flex items-center justify-center select-none">
                  <div className="bg-slate-950/85 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 w-full max-w-[260px] space-y-3 shadow-2xl relative overflow-hidden">
                    <div className="absolute -left-6 -top-6 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {isRtl ? 'بسته پایه رایگان (FREE)' : 'Base Tier (FREE)'}
                      </span>
                      <span className="font-mono text-xs text-white font-bold">0 Toman</span>
                    </div>
                    <p className="text-[10px] text-gray-300 font-light leading-relaxed text-start">
                      {isRtl ? 'بدون محدودیت زمانی، اولین کاتالوگ محصولات صنعتی خود را بارگذاری و به صنعت ساختمان معرفی کنید.' : 'Zero upfront cost. Publish fully featured BIM catalogs to showcase your building products.'}
                    </p>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[9px] text-gray-400 font-medium">
                      <span className="text-[#26B6B6] font-extrabold">{isRtl ? 'بسته حرفه‌ای (PRO)' : 'Professional Upgrade'}</span>
                      <span className="font-mono text-[9px] bg-white/5 px-2 py-0.5 rounded text-gray-300">Advanced Analytics</span>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 relative z-20" id="search-and-browse-categories">
        
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

      {/* 4. TRUSTED COMPANIES & VALUE PROPOSITION FOR MANUFACTURERS */}
      <section className="bg-slate-50 dark:bg-gray-950/40 border-y border-gray-150 dark:border-gray-800/60 py-12" id="homepage-trusted-brands">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header row and Carousel block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Title Column */}
            <div className="md:col-span-5 space-y-4 text-center md:text-start animate-fadeIn">
              <div className="space-y-2 text-start">
                <button
                  type="button"
                  onClick={() => onNavigate('manufacturers')}
                  className="group inline-flex items-center gap-2 text-xl md:text-2xl font-black text-[#464E56] dark:text-gray-200 hover:text-[#26B6B6] transition-colors cursor-pointer text-start"
                >
                  <span>{t('trustedPartners')}</span>
                  <span className="text-xs font-bold text-[#26B6B6] bg-[#26B6B6]/5 group-hover:bg-[#26B6B6] group-hover:text-white px-2 py-0.5 rounded transition-all">
                    {isRtl ? 'مشاهده دایرکتوری ←' : 'View Directory →'}
                  </span>
                </button>
                <p className="text-xs text-gray-400 leading-relaxed font-light max-w-md">
                  {t('trustedPartnersSub')}
                </p>
              </div>
              <div className="pt-2 text-start hidden md:block">
                <button
                  type="button"
                  onClick={() => onNavigate('for-manufacturers')}
                  className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-[#26B6B6]/40 text-[#464E56] dark:text-gray-300 hover:text-[#26B6B6] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  {isRtl ? 'ثبت‌نام تولیدکنندگان صنعتی' : 'Join as Industrial Partner'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start pt-2">
            
            {/* Column 1 */}
            <div className="flex gap-4 items-start bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-3xs transition-all hover:border-[#26B6B6]/30">
              <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0">
                <Search className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-gray-800 dark:text-gray-100">
                  {isRtl ? 'دیده شدن هدفمند کاتالوگ' : 'Targeted Specification'}
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed font-light">
                  {isRtl 
                    ? 'طراحان و مهندسان معمار، مصالح شما را پیش از گودبرداری بررسی و وارد نقشه‌های رویت می‌کنند.' 
                    : 'Iranian architects and engineers search here first for BIM-ready products.'
                  }
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex gap-4 items-start bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-3xs transition-all hover:border-[#26B6B6]/30">
              <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-gray-800 dark:text-gray-100">
                  {isRtl ? 'سرنخ‌های واقعی خرید' : 'High-Quality Digital Leads'}
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed font-light">
                  {isRtl 
                    ? 'هر بازدید، دانلود آبجکت یا کلیک روی برگه مشخصات فنی، یک فرصت فروش و سفارش مستقیم است.' 
                    : 'Every product view and download translates into potential supply specifications.'
                  }
                </p>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex gap-4 items-start bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-3xs transition-all hover:border-[#26B6B6]/30">
              <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0">
                <LineChart className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-gray-800 dark:text-gray-100">
                  {isRtl ? 'آمارهای زنده دانلود' : 'Real-Time Catalog Analytics'}
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed font-light">
                  {isRtl 
                    ? 'ببینید کدام مهندسان و پروژه‌ها کدهای تجاری محصولات شما را دانلود کرده‌اند.' 
                    : 'Track exact downloads, views, and spec trends with build-in dashboards.'
                  }
                </p>
              </div>
            </div>

            {/* Column 4 */}
            <div className="flex gap-4 items-start bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-3xs transition-all hover:border-[#26B6B6]/30">
              <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-gray-800 dark:text-gray-100">
                  {isRtl ? 'رایگان شروع کنید' : 'Free To Publish Base'}
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed font-light">
                  {isRtl 
                    ? 'اولین فایل‌های BIM خود را بدون کارت یا تعهد مالی بارگذاری کنید و سهم بازارتان را بسنجید.' 
                    : 'List your first products at zero cost, analyze market fit, and upgrade anytime.'
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

        <div className="relative group/testimonials px-1">
          {/* Left Scroll Button */}
          <button
            type="button"
            onClick={() => scrollTestimonials('left')}
            className="absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 z-25 w-7 h-7 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-[#26B6B6] hover:scale-105 transition-all cursor-pointer opacity-90 sm:opacity-0 sm:group-hover/testimonials:opacity-100 focus:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Scroll Button */}
          <button
            type="button"
            onClick={() => scrollTestimonials('right')}
            className="absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 z-25 w-7 h-7 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-[#26B6B6] hover:scale-105 transition-all cursor-pointer opacity-90 sm:opacity-0 sm:group-hover/testimonials:opacity-100 focus:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div
            ref={testimonialScrollRef}
            onMouseEnter={() => setIsTestimonialHovered(true)}
            onMouseLeave={() => setIsTestimonialHovered(false)}
            onMouseDown={handleTestimonialMouseDown}
            onMouseMove={handleTestimonialMouseMove}
            onMouseUp={handleTestimonialMouseUpOrLeave}
            onTouchStart={handleTestimonialTouchStart}
            onTouchMove={handleTestimonialTouchMove}
            onTouchEnd={handleTestimonialTouchEnd}
            className="flex gap-4 overflow-x-auto py-3 px-0.5 scrollbar-none cursor-grab active:cursor-grabbing select-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-start space-y-8 border-t border-gray-100 dark:border-gray-800/60 mt-16">
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
