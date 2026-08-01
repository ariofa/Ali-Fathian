import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { useSiteConfig } from './SiteConfigContext';
import { Logo } from './Logo';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Download,
  Check,
  TrendingUp,
  Compass,
  Factory,
  DoorOpen,
  FileText,
  Database,
  Box,
  Building2,
  ShieldCheck,
  Layers
} from 'lucide-react';

const toPersianDigits = (num: string | number) => {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/[0-9]/g, (w) => id[+w]);
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

const HERO_BIM_ASSETS = {
  window: '/hero/bim-window.webp',
  rotatingHalogen: '/hero/bim-rotating-halogen.webp',
  fireDoor: '/hero/bim-fire-door.webp',
  wallHungToilet: '/hero/bim-wall-hung-toilet.webp'
};

const HERO_BIM_GALLERY = [
  {
    src: HERO_BIM_ASSETS.window,
    titleFa: 'پنجره ترمال‌بریک BIM',
    titleEn: 'Thermal Break Window BIM',
    categoryFa: 'در و پنجره',
    categoryEn: 'Openings',
    meta: [
      { icon: FileText, labelFa: 'فرمت', labelEn: 'Format', valueFa: 'RFA / IFC', valueEn: 'RFA / IFC' },
      { icon: Layers, labelFa: 'جزئیات', labelEn: 'Detail', valueFa: 'LOD ۳۰۰', valueEn: 'LOD 300' },
      { icon: Database, labelFa: 'منطق', labelEn: 'Logic', valueFa: 'پارامتریک', valueEn: 'Parametric' },
      { icon: ShieldCheck, labelFa: 'وضعیت', labelEn: 'Status', valueFa: 'قابل ارزیابی', valueEn: 'Reviewable' }
    ]
  },
  {
    src: HERO_BIM_ASSETS.rotatingHalogen,
    titleFa: 'هالوژن چرخشی BIM',
    titleEn: 'Adjustable Halogen BIM Light',
    categoryFa: 'روشنایی داخلی',
    categoryEn: 'Interior Lighting',
    meta: [
      { icon: FileText, labelFa: 'فرمت', labelEn: 'Format', valueFa: 'RFA / IFC', valueEn: 'RFA / IFC' },
      { icon: Layers, labelFa: 'جزئیات', labelEn: 'Detail', valueFa: 'LOD ۳۰۰', valueEn: 'LOD 300' },
      { icon: Database, labelFa: 'نور', labelEn: 'Light Data', valueFa: 'IES آماده', valueEn: 'IES Ready' },
      { icon: Compass, labelFa: 'حرکت', labelEn: 'Motion', valueFa: 'چرخش‌پذیر', valueEn: 'Adjustable' }
    ]
  },
  {
    src: HERO_BIM_ASSETS.fireDoor,
    titleFa: 'درِ ضدحریق BIM',
    titleEn: 'Fire-Rated Door BIM Object',
    categoryFa: 'ایمنی ساختمان',
    categoryEn: 'Building Safety',
    meta: [
      { icon: FileText, labelFa: 'فرمت', labelEn: 'Format', valueFa: 'RFA / IFC', valueEn: 'RFA / IFC' },
      { icon: Layers, labelFa: 'جزئیات', labelEn: 'Detail', valueFa: 'LOD ۳۵۰', valueEn: 'LOD 350' },
      { icon: ShieldCheck, labelFa: 'مقاومت', labelEn: 'Rating', valueFa: '۱۲۰ دقیقه', valueEn: '120 min' },
      { icon: Database, labelFa: 'پارامتر', labelEn: 'Params', valueFa: 'بازشو / یراق', valueEn: 'Swing / Hardware' }
    ]
  },
  {
    src: HERO_BIM_ASSETS.wallHungToilet,
    titleFa: 'توالت وال‌هنگ BIM',
    titleEn: 'Wall-Hung Toilet BIM Object',
    categoryFa: 'سرویس بهداشتی',
    categoryEn: 'Sanitary Fixtures',
    meta: [
      { icon: FileText, labelFa: 'فرمت', labelEn: 'Format', valueFa: 'RFA / IFC', valueEn: 'RFA / IFC' },
      { icon: Layers, labelFa: 'جزئیات', labelEn: 'Detail', valueFa: 'LOD ۳۰۰', valueEn: 'LOD 300' },
      { icon: Database, labelFa: 'اتصال', labelEn: 'Connect', valueFa: 'اتصال فاضلاب', valueEn: 'Waste Outlet' },
      { icon: Building2, labelFa: 'نصب', labelEn: 'Mount', valueFa: 'نصب دیواری', valueEn: 'Wall Mounted' }
    ]
  }
];

const DESIGNER_PROBLEM_INPUTS = [
  { icon: FileText, labelFa: 'PDF پراکنده', labelEn: 'Scattered PDF' },
  { icon: Box, labelFa: 'مدل عمومی نامطمئن', labelEn: 'Unverified Generic Model' }
];

const DESIGNER_PROBLEM_RESULTS = [
  { labelFa: 'دوباره‌کاری', labelEn: 'Rework' },
  { labelFa: 'ابهام مشخصات', labelEn: 'Unclear Specs' },
  { labelFa: 'خروجی کم‌اتکا', labelEn: 'Lower Confidence' }
];

const DESIGNER_SOLUTION_RESULTS = [
  { labelFa: 'طراحی واقعی‌تر', labelEn: 'More Realistic Design' },
  { labelFa: 'مستندسازی بهتر', labelEn: 'Better Documentation' },
  { labelFa: 'آماده‌تر برای متره', labelEn: 'Better Prepared for QTO' }
];

const DESIGNER_BENEFITS = [
  { labelFa: 'کاهش دوباره‌کاری', labelEn: 'Less Rework' },
  { labelFa: 'داده فنی قابل بررسی', labelEn: 'Reviewable Technical Data' },
  { labelFa: 'آماده‌تر برای متره', labelEn: 'Better Prepared for QTO' }
];

export const SLIDE_CONFIGS = [
  {
    id: 'identity',
    labelFa: 'ایران بیم هاب',
    labelEn: 'IranBIMhub',
    numFa: '۰۱',
    numEn: '01',
    bgImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-[#1E2326]/85',
    badgeFa: 'اولین پلتفرم ایرانی برای انتشار مدل‌های بیم محصولات ساختمانی',
    badgeEn: "Iran's Premier BIM Catalog Platform for Construction Products",
    headingFa: 'مرجع تخصصی و بازار ملی بیم ایران',
    headingEn: "Iran's National BIM Marketplace & Engineering Reference",
    descFa: 'داده‌های فنی معتبر برای معماران و مهندسان، دیده شدن حرفه‌ای برای تولیدکنندگان ایرانی',
    descEn: 'Verified technical BIM data for architects & engineers, professional visibility for Iranian manufacturers'
  },
  {
    id: 'designers',
    labelFa: 'معماران و مهندسان',
    labelEn: 'Architects & Engineers',
    numFa: '۰۲',
    numEn: '02',
    bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-[#26B6B6]/25',
    badgeFa: 'برای معماران، مهندسان و تیم‌های BIM',
    badgeEn: 'For Architects, Engineers & BIM Teams',
    headingFa: 'دیگر لازم نیست هر آبجکت را از صفر مدل کنید',
    headingEn: 'Stop Modeling Every Object from Scratch',
    descFa: 'به‌جای مدل‌سازی دستی از روی PDF و کاتالوگ‌های پراکنده، آبجکت‌های BIM سبک و قابل بررسی را پیدا کنید؛ آماده‌تر برای طراحی، مستندسازی و متره و برآورد.',
    descEn: 'Instead of rebuilding objects from PDFs and scattered catalogs, find lightweight, reviewable BIM objects—better prepared for design documentation and quantity takeoff.'
  },
  {
    id: 'manufacturers',
    labelFa: 'تولیدکنندگان',
    labelEn: 'Manufacturers',
    numFa: '۰۳',
    numEn: '03',
    bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-emerald-950/50',
    badgeFa: 'برای تولیدکنندگان و صاحبان برندهای ساختمانی',
    badgeEn: 'For Manufacturers & Building Product Brands',
    headingFa: 'محصول شما قبل از خرید، وارد نقشه پروژه می‌شود',
    headingEn: 'Your Product Enters the Project Before Procurement',
    descFa: 'ایران‌بیم‌هاب کاتالوگ فنی شما را به مسیر قابل استفاده برای معماران و مهندسان تبدیل می‌کند؛ از مشاوره و احراز برند تا تولید یا ارزیابی فایل BIM.',
    descEn: 'IranBIMhub turns your technical catalog into a usable workflow for architects and engineers; from consultation and brand verification to BIM file creation or evaluation.'
  },
  {
    id: 'modelers',
    labelFa: 'همکاری با ما',
    labelEn: 'Collaborate',
    numFa: '۰۴',
    numEn: '04',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-[#112a2b]/95 via-slate-950/90 to-slate-900/85',
    badgeFa: 'همکاری پروژه‌ای با مدل‌سازان BIM و سازندگان Revit Family',
    badgeEn: 'Project-Based Collaboration for BIM & Revit Family Specialists',
    headingFa: 'همکاری به‌عنوان مدل‌ساز BIM با ایران‌بیم‌هاب',
    headingEn: 'Collaborate with IranBIMhub as a BIM Modeler',
    descFa: 'اگر در مدل‌سازی BIM، ساخت فمیلی Revit، استانداردسازی پارامترها یا کنترل کیفیت فایل‌ها تجربه دارید، ایران‌بیم‌هاب می‌تواند خانه همکاری حرفه‌ای شما باشد.',
    descEn: 'If you work with BIM modeling, Revit families, parameter standards or file quality control, IranBIMhub can become your professional collaboration home.'
  },
  {
    id: 'start',
    labelFa: 'شروع همکاری',
    labelEn: 'Start',
    numFa: '۰۵',
    numEn: '05',
    bgImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-[#1E2326]/85',
    badgeFa: 'شروع همکاری و عضویت اولیه',
    badgeEn: 'Start Your Early Access',
    headingFa: 'از امروز وارد جریان BIM ایران شوید',
    headingEn: 'Join the BIM Movement in Iran Today',
    descFa: 'چه طراح باشید، چه تولیدکننده یا متخصص BIM؛ می‌توانید در نسخه اولیه ایران‌بیم‌هاب همراه ما باشید و به شکل‌گیری مسیر قابل اعتماد BIM در صنعت ساختمان ایران کمک کنید.',
    descEn: 'Whether you are a designer, manufacturer or BIM specialist, you can join IranBIMhub early and help shape a trusted BIM path in Iran’s construction industry.'
  }
];

export interface HeroCarouselProps {
  onNavigate: (view: string, customTextFa?: string, customTextEn?: string, param?: string) => void;
  onOpenAuthModal?: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onNavigate,
  onOpenAuthModal
}) => {
  const { isRtl } = useLanguage();
  const { siteConfig } = useSiteConfig();
  const activeSlides = siteConfig?.heroBanners && siteConfig.heroBanners.length > 0
    ? siteConfig.heroBanners
    : SLIDE_CONFIGS;
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [activeHeroAsset, setActiveHeroAsset] = useState(0);
  const activeHeroAssetData = HERO_BIM_GALLERY[activeHeroAsset];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % activeSlides.length);
    setSlideProgress(0);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    setSlideProgress(0);
  };

  // Auto-play slide progress increment
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSlideProgress((prev) => prev + 2);
    }, 120);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Handle slide transition when progress reaches 100%
  useEffect(() => {
    if (slideProgress >= 100) {
      setActiveSlide((prev) => (prev + 1) % activeSlides.length);
      setSlideProgress(0);
    }
  }, [slideProgress, activeSlides.length]);

  useEffect(() => {
    if (activeSlide !== 0) return;

    const timer = window.setInterval(() => {
      setActiveHeroAsset((prev) => (prev + 1) % HERO_BIM_GALLERY.length);
    }, 3400);

    return () => window.clearInterval(timer);
  }, [activeSlide]);

  const handleDragStart = (clientX: number) => {
    setDragStartX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (dragStartX === null) return;
    const diff = clientX - dragStartX;
    setDragOffsetX(diff);
  };

  const handleDragEnd = (clientX?: number) => {
    if (dragStartX !== null && clientX !== undefined) {
      const diff = clientX - dragStartX;
      if (diff < -50) {
        handleNextSlide();
      } else if (diff > 50) {
        handlePrevSlide();
      }
    }
    setDragStartX(null);
    setDragOffsetX(0);
  };

  return (
    <section
      className="relative text-white overflow-hidden rounded-b-[2rem] md:rounded-b-[3.5rem] shadow-xl text-start select-none cursor-grab active:cursor-grabbing hover:shadow-2xl transition-all duration-300 bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        handleDragEnd();
        setIsPaused(false);
      }}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={(e) => handleDragEnd(e.clientX)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0]?.clientX)}
      id="homepage-hero-carousel"
    >
      {/* Keyframes & CSS styles for floating 3D BIM model card, glassmorphism, and watermarks */}
      <style>{`
        @keyframes float3dBimCard {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(38, 182, 182, 0.2);
          }
          50% {
            transform: translateY(-10px) rotate(1.8deg) scale(1.02);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(38, 182, 182, 0.4);
          }
        }
        @keyframes float3dBimCardBack {
          0%, 100% {
            transform: translateX(16px) translateY(-12px) rotate(4deg);
          }
          50% {
            transform: translateX(20px) translateY(-20px) rotate(5.5deg);
          }
        }
        @keyframes downArrow {
          0% { transform: translateY(-4px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(4px); opacity: 0; }
        }
        @keyframes bimGridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes techPulse {
          0%, 100% { opacity: 0.15; transform: scale(0.98); }
          50% { opacity: 0.4; transform: scale(1.02); }
        }
        .animate-float-3d-bim {
          animation: float3dBimCard 5.5s ease-in-out infinite;
          will-change: transform;
        }
        .animate-float-3d-bim-back {
          animation: float3dBimCardBack 6s ease-in-out infinite;
          will-change: transform;
        }
        .animate-down-arrow {
          animation: downArrow 1.5s ease-in-out infinite;
        }
        .animate-bim-grid {
          animation: bimGridMove 25s linear infinite;
        }
        .animate-tech-pulse {
          animation: techPulse 4s ease-in-out infinite;
        }
        @keyframes heroVisualFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }
        @keyframes heroVisualFloatAlt {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-1deg); }
          50% { transform: translate3d(6px, -10px, 0) rotate(1deg); }
        }
        @keyframes heroVisualScan {
          0% { transform: translateX(-120%); opacity: 0; }
          15% { opacity: 0.6; }
          75% { opacity: 0.6; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes heroVisualGridShift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 44px 44px, -44px -44px; }
        }
        .animate-hero-visual-float {
          animation: heroVisualFloat 7s ease-in-out infinite;
        }
        .animate-hero-visual-float-alt {
          animation: heroVisualFloatAlt 8s ease-in-out infinite;
        }
        .animate-hero-visual-scan {
          animation: heroVisualScan 5s ease-in-out infinite;
        }
        .animate-hero-visual-grid {
          animation: heroVisualGridShift 36s linear infinite;
        }
        @keyframes heroAlbumGlow {
          0%, 100% { opacity: 0.35; transform: scale(0.98); }
          50% { opacity: 0.75; transform: scale(1.02); }
        }
        .animate-hero-album-glow {
          animation: heroAlbumGlow 4.5s ease-in-out infinite;
        }
        @keyframes heroWorkflowPulse {
          0%, 100% { opacity: 0.35; transform: scaleX(0.96); }
          50% { opacity: 0.95; transform: scaleX(1); }
        }
        @keyframes heroWorkflowFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -7px, 0); }
        }
        @keyframes heroWorkflowScan {
          0% { transform: translateX(-120%); opacity: 0; }
          20% { opacity: 0.55; }
          70% { opacity: 0.55; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        .animate-hero-workflow-pulse {
          animation: heroWorkflowPulse 2.6s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-hero-workflow-float {
          animation: heroWorkflowFloat 6.5s ease-in-out infinite;
        }
        .animate-hero-workflow-scan {
          animation: heroWorkflowScan 4.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-hero-visual-float,
          .animate-hero-visual-float-alt,
          .animate-hero-visual-scan,
          .animate-hero-visual-grid,
          .animate-hero-workflow-pulse,
          .animate-hero-workflow-float,
          .animate-hero-workflow-scan {
            animation: none !important;
          }
        }
      `}</style>

      {/* Dynamic Background Photo & Dark Gradient Overlay for Active Slide */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.bgImage}
              alt={slide.labelEn}
              className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
            />
            <div className={`absolute inset-0 ${slide.overlay}`} />
          </div>
        ))}
      </div>

      {/* Background Grid & Pulsing Glow */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#26B6B6_1.5px,transparent_1.5px)] [background-size:24px_24px] animate-bim-grid pointer-events-none z-10" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#26B6B6]/15 blur-3xl animate-tech-pulse pointer-events-none z-10" />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5 sm:py-8 md:py-12 relative z-20">
        <div
          dir="ltr"
          className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 md:gap-10 items-center min-h-[430px] sm:min-h-[520px] md:min-h-[460px] lg:min-h-[430px] transition-transform duration-100 ease-out"
          style={{
            transform: dragOffsetX !== 0 ? `translateX(${dragOffsetX}px) rotate(${dragOffsetX * 0.015}deg)` : 'none'
          }}
        >
          {/* Text Content */}
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`${activeSlide === 0 ? 'md:col-span-7 lg:col-span-7 order-1 ' + (isRtl ? 'md:order-2' : 'md:order-1') : activeSlide === 1 ? 'md:col-span-6 lg:col-span-6 order-1 ' + (isRtl ? 'md:order-2' : 'md:order-1') : 'md:col-span-12 order-1'} space-y-2 sm:space-y-5 flex flex-col justify-center animate-fadeIn`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-[#26B6B6]/30 rounded-full text-[10px] sm:text-xs font-bold text-[#26B6B6] self-start shadow-md max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#26B6B6] shrink-0" />
              <span className="truncate">
                {isRtl ? activeSlides[activeSlide].badgeFa : activeSlides[activeSlide].badgeEn}
              </span>
            </div>

            <h1 className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.28] sm:leading-tight md:leading-tight text-white drop-shadow-md transition-all duration-300">
              {isRtl ? activeSlides[activeSlide].headingFa : activeSlides[activeSlide].headingEn}
            </h1>

            <p className="text-xs sm:text-base md:text-lg text-gray-200 leading-relaxed font-normal max-w-2xl drop-shadow-sm transition-all duration-300">
              {isRtl ? activeSlides[activeSlide].descFa : activeSlides[activeSlide].descEn}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {activeSlide === 0 && (
                <>
                  {/* Primary CTA Button */}
                  <button
                    onClick={() => {
                      const el = document.getElementById('search-and-browse-categories');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      else onNavigate('categories');
                    }}
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    <span>{isRtl ? 'کاوش محصولات بیم' : 'Explore BIM Products'}</span>
                    <span>{isRtl ? '←' : '→'}</span>
                  </button>

                  {/* Secondary Outline CTA Button */}
                  <button
                    onClick={() => onNavigate('about')}
                    className="bg-slate-900/60 hover:bg-slate-800/80 text-white border border-[#26B6B6]/50 hover:border-[#26B6B6] backdrop-blur-md px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isRtl ? 'ایران‌بیم‌هاب چیست؟' : 'What is IranBIMhub?'}</span>
                  </button>
                </>
              )}

              {activeSlide === 1 && (
                <>
                  <button
                    onClick={() => {
                      const el = document.getElementById('search-and-browse-categories');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      else onNavigate('categories');
                    }}
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'مشاهده نمونه آبجکت‌ها' : 'View Sample Objects'}
                  </button>
                  <button
                    onClick={() => onNavigate('for-designers')}
                    className="bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'راهنمای طراحان و مهندسان' : 'For Architects & Engineers'}
                  </button>
                </>
              )}

              {activeSlide === 2 && (
                <>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('iranbimhub_manufacturer_page_target', 'consultation');
                      onNavigate('for-manufacturers');
                    }}
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'مشاوره رایگان تولیدکنندگان' : 'Free Manufacturer Consultation'}
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('iranbimhub_manufacturer_page_target');
                      onNavigate('for-manufacturers');
                    }}
                    className="bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'صفحه تولیدکنندگان' : 'Manufacturer Page'}
                  </button>
                </>
              )}

              {activeSlide === 3 && (
                <button
                  onClick={() => onNavigate('for-bim-modelers')}
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer animate-fadeIn"
                >
                  {isRtl ? 'همکاری به‌عنوان مدل‌ساز BIM' : 'Collaborate as a BIM Modeler'}
                </button>
              )}

              {activeSlide === 4 && (
                <>
                  <button
                    onClick={() => onNavigate('for-designers')}
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'شروع به‌عنوان طراح یا مهندس' : 'Start as a Designer'}
                  </button>
                  <button
                    onClick={() => onNavigate('for-manufacturers')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'شروع به‌عنوان تولیدکننده' : 'Start as a Manufacturer'}
                  </button>
                </>
              )}
            </div>
          </div>

          {activeSlide === 0 && (
            <div
              dir="ltr"
              className={`${isRtl ? 'md:order-1' : 'md:order-2'} order-2 md:col-span-5 lg:col-span-5 relative w-full animate-fadeIn`}
              aria-label={isRtl ? 'آلبوم تصویری آبجکت‌های BIM' : 'BIM object visual album'}
            >
              <div className="relative min-h-[410px] sm:min-h-[430px] md:h-[400px] lg:h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111F]/72 backdrop-blur-md shadow-2xl p-3 sm:p-4 md:p-5">
                {/* Ambient stage: subtle, branded, and behind the content only */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#26B6B6_1px,transparent_1px),linear-gradient(to_bottom,#26B6B6_1px,transparent_1px)] [background-size:22px_22px] animate-hero-visual-grid" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(38,182,182,0.22),transparent_30%),radial-gradient(circle_at_82%_76%,rgba(255,255,255,0.10),transparent_34%)]" />
                <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#26B6B6]/18 blur-3xl animate-hero-album-glow" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#26B6B6]/60 to-transparent" />

                <div className="relative z-10 flex h-full min-h-0 flex-col gap-3 sm:gap-4">
                  {/* Square image slot: keeps every BIM object predictable on mobile and desktop */}
                  <div className="relative flex min-h-[238px] sm:min-h-[258px] md:min-h-0 flex-1 items-center justify-center">
                    <div className="relative aspect-square w-[min(74vw,270px)] sm:w-[min(58vw,300px)] md:w-full md:max-w-[300px] lg:max-w-[314px]">
                      {HERO_BIM_GALLERY.map((asset, idx) => {
                        const total = HERO_BIM_GALLERY.length;
                        const offset = (idx - activeHeroAsset + total) % total;
                        const isActiveAsset = offset === 0;
                        const isNextAsset = offset === 1;
                        const isPrevAsset = offset === total - 1;
                        const isVisible = isActiveAsset || isNextAsset || isPrevAsset;

                        if (!isVisible) return null;

                        const transformClass = isActiveAsset
                          ? 'translate-x-0 translate-y-0 rotate-0 scale-100 z-30 opacity-100'
                          : isNextAsset
                          ? 'hidden sm:block sm:translate-x-12 md:translate-x-14 translate-y-5 rotate-[5deg] scale-[0.84] z-20 opacity-45'
                          : 'hidden sm:block sm:-translate-x-12 md:-translate-x-14 translate-y-5 rotate-[-5deg] scale-[0.84] z-10 opacity-45';

                        const cardToneClass = isActiveAsset
                          ? 'border-white/70 bg-[#F4F7F8] shadow-[0_22px_70px_rgba(0,0,0,0.34)]'
                          : 'border-white/15 bg-[#111827]/80 shadow-xl';

                        return (
                          <button
                            key={asset.src}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHeroAsset(idx);
                            }}
                            className={`absolute inset-0 rounded-[1.65rem] overflow-hidden border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${cardToneClass} ${transformClass}`}
                            aria-label={`Show ${asset.titleEn}`}
                          >
                            <div className={`absolute inset-x-8 bottom-5 h-8 rounded-full blur-2xl ${isActiveAsset ? 'bg-slate-900/12' : 'bg-black/25'}`} />
                            <img
                              src={asset.src}
                              alt={isRtl ? asset.titleFa : asset.titleEn}
                              loading="eager"
                              className={`relative z-10 w-full h-full object-contain ${isActiveAsset ? '' : 'opacity-72'}`}
                              onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                            />
                            {isActiveAsset ? (
                              <div className="pointer-events-none absolute inset-0 rounded-[1.65rem] ring-1 ring-inset ring-white/55" />
                            ) : (
                              <div className="pointer-events-none absolute inset-0 bg-slate-950/20" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Synced concise metadata: normal flow, never over the image */}
                  <div dir={isRtl ? 'rtl' : 'ltr'} className="relative z-40 shrink-0 rounded-[1.35rem] bg-[#0B1020]/92 border border-white/10 backdrop-blur-md px-3 sm:px-4 py-3 shadow-xl">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="text-start min-w-0">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#26B6B6]/12 border border-[#26B6B6]/25 px-2 py-1 text-[9px] sm:text-[10px] text-[#7EE7E7] font-extrabold leading-none max-w-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#26B6B6] shrink-0" />
                          <span className="truncate">
                            {isRtl ? activeHeroAssetData.categoryFa : activeHeroAssetData.categoryEn}
                          </span>
                        </div>
                        <div className="mt-1 text-[12px] sm:text-sm font-black text-white leading-snug">
                          {isRtl ? activeHeroAssetData.titleFa : activeHeroAssetData.titleEn}
                        </div>
                      </div>
                      <div dir="ltr" className="flex items-center gap-1.5 shrink-0 pt-1">
                        {HERO_BIM_GALLERY.map((asset, idx) => (
                          <button
                            key={asset.src}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHeroAsset(idx);
                            }}
                            className={`h-2 rounded-full transition-all ${idx === activeHeroAsset ? 'bg-[#26B6B6] w-5' : 'bg-white/25 hover:bg-white/50 w-2'}`}
                            aria-label={`Show hero image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-start">
                      {activeHeroAssetData.meta.map((item) => {
                        const MetaIcon = item.icon;
                        return (
                          <div key={item.labelEn} className="min-w-0 rounded-xl bg-white/[0.06] border border-white/10 px-2.5 py-2">
                            <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] text-gray-400 font-extrabold leading-none">
                              <MetaIcon className="w-3 h-3 text-[#7EE7E7] shrink-0" />
                              <span className="truncate">{isRtl ? item.labelFa : item.labelEn}</span>
                            </div>
                            <div className="mt-1 text-[10px] sm:text-[11px] text-white font-black leading-snug">
                              {isRtl ? item.valueFa : item.valueEn}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSlide === 1 && (
            <div
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`${isRtl ? 'md:order-1' : 'md:order-2'} order-2 md:col-span-6 lg:col-span-6 relative w-full animate-fadeIn`}
              aria-label={isRtl ? 'اینفوگرافی مسیر ارزش برای معماران و مدل‌سازان BIM' : 'Architect and BIM modeler value infographic'}
            >
              <div className="relative min-h-[350px] sm:min-h-[370px] md:h-[390px] lg:h-[400px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111F]/78 backdrop-blur-md shadow-2xl p-3 sm:p-4 md:p-5">
                <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#26B6B6_1px,transparent_1px),linear-gradient(to_bottom,#26B6B6_1px,transparent_1px)] [background-size:22px_22px] animate-hero-visual-grid" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(38,182,182,0.22),transparent_30%),radial-gradient(circle_at_84%_78%,rgba(59,130,246,0.13),transparent_34%)]" />
                <div className="pointer-events-none absolute -top-24 -left-20 w-64 h-64 rounded-full bg-[#26B6B6]/16 blur-3xl animate-hero-album-glow" />
                <div className="pointer-events-none absolute -bottom-24 -right-16 w-60 h-60 rounded-full bg-sky-400/12 blur-3xl" />

                <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#26B6B6]/12 border border-[#26B6B6]/25 px-2.5 py-1 text-[9px] sm:text-[10px] text-[#7EE7E7] font-extrabold">
                      <Sparkles className="w-3 h-3" />
                      <span>{isRtl ? 'کیفیت ورودی، دقت خروجی را می‌سازد' : 'Better input creates better output'}</span>
                    </div>
                    <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] border border-white/10 px-2.5 py-1 text-[9px] sm:text-[10px] text-white/82 font-bold">
                      <Database className="w-3 h-3 text-[#7EE7E7]" />
                      <span>{isRtl ? 'مدل اطلاعاتی محصول' : 'Product BIM Data'}</span>
                    </div>
                  </div>

                  <div className="relative flex-1 min-h-[238px] md:min-h-0 rounded-[1.5rem] border border-white/10 bg-white/[0.075] p-3 sm:p-4 overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.13),transparent_38%)]" />
                    <div className="pointer-events-none absolute inset-0 opacity-[0.045] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />

                    <div className="relative z-10 flex h-full min-h-0 flex-col lg:flex-row items-stretch justify-center gap-2.5 lg:gap-2">
                      {/* Common / risky path */}
                      <div className="flex-1 min-h-0 rounded-[1.25rem] border border-amber-200/65 bg-gradient-to-br from-white via-[#FFFDF7] to-amber-50 p-2.5 sm:p-3 shadow-xl overflow-hidden">
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="text-start min-w-0">
                            <div className="text-[9px] sm:text-[10px] font-black text-amber-600 leading-none">
                              {isRtl ? 'مسیر رایج' : 'Common Path'}
                            </div>
                            <div className="mt-1 text-[12px] sm:text-[13px] font-black text-slate-800 leading-tight">
                              {isRtl ? 'ورودی نامطمئن' : 'Uncertain Input'}
                            </div>
                            <div className="mt-0.5 text-[9px] sm:text-[10px] font-bold text-slate-500 leading-snug">
                              {isRtl ? 'داده پراکنده و مدل‌سازی دستی' : 'Scattered data and manual modeling'}
                            </div>
                          </div>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <FileText className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-1.5">
                          {DESIGNER_PROBLEM_INPUTS.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <div key={item.labelEn} className="flex items-center gap-1.5 rounded-xl border border-amber-100 bg-white/78 px-2 py-1.5 text-[8px] sm:text-[9px] font-extrabold text-slate-600">
                                <ItemIcon className="w-3 h-3 text-amber-600 shrink-0" />
                                <span className="truncate">{isRtl ? item.labelFa : item.labelEn}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-2 rounded-xl bg-amber-100/65 px-2 py-1.5">
                          <div className="text-[8px] sm:text-[9px] font-black text-amber-700 leading-snug">
                            {isRtl ? 'نتیجه: دوباره‌کاری، ابهام مشخصات، خروجی کم‌اتکا' : 'Result: rework, unclear specs, lower confidence'}
                          </div>
                        </div>
                      </div>

                      {/* Replacement cue */}
                      <div className="flex shrink-0 items-center justify-center min-h-7 lg:min-h-0 lg:w-9" aria-hidden="true">
                        <div className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full border border-[#26B6B6]/35 bg-[#26B6B6]/14 text-[#7EE7E7] shadow-[0_0_18px_rgba(38,182,182,0.18)] animate-hero-workflow-pulse">
                          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                        <div className="lg:hidden inline-flex items-center gap-1.5 rounded-full border border-[#26B6B6]/35 bg-[#26B6B6]/14 px-3 py-1 text-[9px] font-black text-[#B8FFFF] shadow-[0_0_18px_rgba(38,182,182,0.18)]">
                          <ChevronDown className="w-3.5 h-3.5 animate-down-arrow" />
                          <span>{isRtl ? 'جایگزین با داده قابل بررسی' : 'Replace with reviewable data'}</span>
                        </div>
                      </div>

                      {/* IranBIMhub path */}
                      <div className="relative flex-1 lg:flex-[1.12] min-h-0 rounded-[1.35rem] border border-[#26B6B6]/45 bg-gradient-to-br from-white via-[#F3FEFE] to-[#E5FBFB] p-2.5 sm:p-3 shadow-2xl ring-1 ring-[#26B6B6]/25 overflow-hidden animate-hero-workflow-float">
                        <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-[#26B6B6]/12 to-transparent animate-hero-workflow-scan" />
                        <div className="relative z-10 flex items-start justify-between gap-2.5">
                          <div className="text-start min-w-0">
                            <div className="text-[9px] sm:text-[10px] font-black text-[#0F8F8F] leading-none">
                              {isRtl ? 'مسیر ایران‌بیم‌هاب' : 'IranBIMhub Path'}
                            </div>
                            <div className="mt-1 text-[14px] sm:text-base font-black text-[#073F46] leading-tight">
                              {isRtl ? 'مدل اطلاعاتی محصول' : 'Product BIM Data Model'}
                            </div>
                            <div className="mt-0.5 text-[9px] sm:text-[10px] font-bold text-slate-500 leading-snug">
                              {isRtl ? 'آبجکت BIM با داده فنی قابل بررسی' : 'BIM object with reviewable technical data'}
                            </div>
                          </div>
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#26B6B6] text-white shadow-lg">
                            <Box className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="relative z-10 mt-2 grid grid-cols-3 gap-1.5">
                          {DESIGNER_SOLUTION_RESULTS.map((item, idx) => (
                            <div key={item.labelEn} className="rounded-xl border border-[#26B6B6]/18 bg-white/75 px-1.5 sm:px-2 py-1.5 text-start">
                              <div className="flex items-center gap-1 text-[7.5px] sm:text-[8.5px] font-black text-[#0F8F8F] leading-tight">
                                {idx === 0 ? <Check className="w-3 h-3 shrink-0" /> : idx === 1 ? <ShieldCheck className="w-3 h-3 shrink-0" /> : <TrendingUp className="w-3 h-3 shrink-0" />}
                                <span>{isRtl ? item.labelFa : item.labelEn}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:grid grid-cols-3 gap-2">
                    {DESIGNER_BENEFITS.map((benefit, idx) => (
                      <div key={benefit.labelEn} className="rounded-2xl bg-white/[0.085] border border-white/10 px-3 py-2 text-start">
                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-white leading-tight">
                          {idx === 0 ? <Check className="w-3.5 h-3.5 text-[#7EE7E7] shrink-0" /> : idx === 1 ? <ShieldCheck className="w-3.5 h-3.5 text-[#7EE7E7] shrink-0" /> : <TrendingUp className="w-3.5 h-3.5 text-[#7EE7E7] shrink-0" />}
                          <span>{isRtl ? benefit.labelFa : benefit.labelEn}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-2.5 border-t border-white/15">
          <div className="flex items-center justify-between gap-1.5 sm:gap-4 max-w-5xl mx-auto px-1 sm:px-2">
            {/* Left Navigation Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isRtl) {
                  handleNextSlide();
                } else {
                  handlePrevSlide();
                }
              }}
              className="p-1 sm:p-2.5 rounded-full text-white/70 hover:text-white bg-transparent hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center shrink-0 hover:scale-110 active:scale-95"
              title={isRtl ? 'اسلاید بعدی' : 'Previous slide'}
            >
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>

            {/* Stepper Pills with Slide Numbers */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-4 flex-1 max-w-4xl">
              {activeSlides.map((cfg, idx) => {
                const isActive = activeSlide === idx;
                return (
                  <button
                    key={cfg.id}
                    type="button"
                    onClick={() => {
                      setActiveSlide(idx);
                      setSlideProgress(0);
                    }}
                    className={`relative py-1.5 sm:py-2.5 px-1 sm:px-3 rounded-xl transition-all duration-300 cursor-pointer text-center group flex flex-col items-center justify-between gap-1 ${
                      isActive
                        ? 'bg-slate-950/80 border border-[#26B6B6]/50 shadow-lg text-white'
                        : 'bg-slate-900/40 hover:bg-slate-900/70 border border-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className={`font-mono text-[10px] sm:text-xs font-bold ${isActive ? 'text-[#26B6B6]' : 'text-gray-400'}`}>
                        {isRtl ? cfg.numFa : cfg.numEn}
                      </span>
                      <span className={`hidden sm:inline text-xs font-extrabold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {isRtl ? cfg.labelFa : cfg.labelEn}
                      </span>
                    </div>

                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                      <div
                        className={`h-full bg-[#26B6B6] transition-all duration-100 ease-linear rounded-full ${
                          isActive ? '' : 'w-0'
                        }`}
                        style={{
                          width: isActive ? `${slideProgress}%` : '0%'
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Navigation Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isRtl) {
                  handlePrevSlide();
                } else {
                  handleNextSlide();
                }
              }}
              className="p-1 sm:p-2.5 rounded-full text-white/70 hover:text-white bg-transparent hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center shrink-0 hover:scale-110 active:scale-95"
              title={isRtl ? 'اسلاید قبلی' : 'Next slide'}
            >
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
