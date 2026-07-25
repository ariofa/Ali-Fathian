import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { Logo } from './Logo';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  TrendingUp,
  Compass,
  Factory,
  DoorOpen
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

export const SLIDE_CONFIGS = [
  {
    id: 'identity',
    labelFa: 'ایران‌بیم‌هاب',
    labelEn: 'IranBIMhub',
    numFa: '۰۱',
    numEn: '01',
    bgImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-[#1E2326]/85',
    badgeFa: 'اولین پلتفرم ایرانی برای انتشار مدلهای بیم محصولات ساختمانی',
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
    badgeFa: 'برای طراحان، مهندسان و مدلرهای بیم',
    badgeEn: 'For Architects, Engineers & BIM Modelers',
    headingFa: 'هر آبجکتی که برای پروژه‌تان نیاز دارید، همین‌جاست',
    headingEn: 'Every Object Your Project Needs, Right Here',
    descFa: 'دسترسی به هزاران آبجکت بیم استاندارد ایرانی، آماده دانلود مستقیم. با عضویت ویژه، دانلود نامحدود و ابزارهای مدیریت پروژه را تجربه کنید.',
    descEn: 'Access thousands of standardized Iranian BIM objects, ready to download instantly. Upgrade to VIP for unlimited downloads and advanced project tools.'
  },
  {
    id: 'manufacturers',
    labelFa: 'تولیدکنندگان',
    labelEn: 'Manufacturers',
    numFa: '۰۳',
    numEn: '03',
    bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-emerald-950/50',
    badgeFa: 'برای تولیدکنندگان و صاحبان برند',
    badgeEn: 'For Manufacturers & Brand Owners',
    headingFa: 'برند شما، در دستان مهندسانی که تصمیم می‌گیرند',
    headingEn: 'Your Brand, In the Hands of Decision-Making Engineers',
    descFa: 'کاتالوگ محصولات خود را به زبان مهندسی امروز ترجمه کنید و مستقیماً در پروژه‌های واقعی ساختمانی ایران دیده شوید. با اشتراک ویژه، از تحلیل بازار و اولویت نمایش بهره‌مند شوید.',
    descEn: "Translate your product catalog into today's engineering language and get specified directly into real Iranian construction projects. Upgrade for market analytics and priority placement."
  },
  {
    id: 'trust',
    labelFa: 'اعتماد',
    labelEn: 'Trust',
    numFa: '۰۴',
    numEn: '04',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-[#112a2b]/95 via-slate-950/90 to-slate-900/85',
    badgeFa: 'پویایی بازار ایران‌بیم‌هاب',
    badgeEn: 'IranBIMhub Market Momentum',
    headingFa: 'اعتمادی که هر روز رشد می‌کند',
    headingEn: 'Trust That Grows Every Day',
    descFa: 'بستری پویا برای دسترسی به باکیفیت‌ترین مدل‌های BIM استاندارد و بومی، به پشتوانه تولیدکنندگان طراز اول کشور و بازخورد زنده بازار ساختمان ایران.',
    descEn: 'A dynamic ecosystem for accessing high-quality standardized domestic BIM models, backed by top-tier suppliers and real-time market momentum.'
  },
  {
    id: 'start',
    labelFa: 'شروع',
    labelEn: 'Start',
    numFa: '۰۵',
    numEn: '05',
    bgImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-[#1E2326]/85',
    badgeFa: 'عضویت رایگان',
    badgeEn: 'Free Start',
    headingFa: 'شروع، بدون هیچ هزینه‌ای',
    headingEn: 'Start — At No Cost',
    descFa: 'چه به‌دنبال آبجکت بیم هستید، چه می‌خواهید برندتان دیده شود؛ ایران‌بیم‌هاب رایگان شروع می‌شود.',
    descEn: "Whether you're looking for a BIM object or want your brand seen, IranBIMhub starts free."
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDE_CONFIGS.length);
    setSlideProgress(0);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDE_CONFIGS.length) % SLIDE_CONFIGS.length);
    setSlideProgress(0);
  };

  // Auto-play slide timer - strict sequential cycling
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((current) => (current + 1) % SLIDE_CONFIGS.length);
          return 0;
        }
        return prev + 2;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPaused]);

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
      `}</style>

      {/* Dynamic Background Photo & Dark Gradient Overlay for Active Slide */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {SLIDE_CONFIGS.map((slide, idx) => (
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 md:py-12 relative z-20">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center min-h-[500px] sm:min-h-[440px] md:min-h-[420px] lg:min-h-[400px] transition-transform duration-100 ease-out"
          style={{
            transform: dragOffsetX !== 0 ? `translateX(${dragOffsetX}px) rotate(${dragOffsetX * 0.015}deg)` : 'none'
          }}
        >
          {/* Left Text Content */}
          <div className="md:col-span-7 space-y-3 sm:space-y-5 flex flex-col justify-center animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-950/80 backdrop-blur-md border border-[#26B6B6]/30 rounded-full text-xs font-bold text-[#26B6B6] self-start shadow-md max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#26B6B6] shrink-0" />
              <span className="truncate">
                {isRtl ? SLIDE_CONFIGS[activeSlide].badgeFa : SLIDE_CONFIGS[activeSlide].badgeEn}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight md:leading-tight text-white drop-shadow-md transition-all duration-300">
              {isRtl ? SLIDE_CONFIGS[activeSlide].headingFa : SLIDE_CONFIGS[activeSlide].headingEn}
            </h1>

            <p className="text-xs sm:text-base md:text-lg text-gray-200 leading-relaxed font-normal max-w-2xl drop-shadow-sm transition-all duration-300">
              {isRtl ? SLIDE_CONFIGS[activeSlide].descFa : SLIDE_CONFIGS[activeSlide].descEn}
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
                    {isRtl ? 'مشاهده کاتالوگ آبجکت‌ها' : 'Browse BIM Catalog'}
                  </button>
                  <button
                    onClick={() => onNavigate('payment', undefined, undefined, 'modeler-vip')}
                    className="bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'ارتقا به عضویت ویژه' : 'Upgrade to VIP'}
                  </button>
                </>
              )}

              {activeSlide === 2 && (
                <>
                  <button
                    onClick={() => onNavigate('for-manufacturers')}
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'ثبت‌نام برند کارخانه' : 'Register Brand'}
                  </button>
                  <button
                    onClick={() => onNavigate('for-manufacturers')}
                    className="bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all hover:scale-105 cursor-pointer"
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
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer animate-fadeIn"
                >
                  {isRtl ? 'عضویت در پورتال فعالان' : 'Join the Network'}
                </button>
              )}

              {activeSlide === 4 && (
                <>
                  <button
                    onClick={() => onNavigate('for-designers')}
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'ثبت‌نام طراحان' : 'Register as a Designer'}
                  </button>
                  <button
                    onClick={() => onNavigate('for-manufacturers')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    {isRtl ? 'ثبت‌نام تولیدکنندگان' : 'Register as a Manufacturer'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Slide Graphic / Floating 3D BIM Model Card Area */}
          <div className="md:col-span-5 flex items-center justify-center min-h-[240px] sm:min-h-[280px]">
            {activeSlide === 0 && (
              /* Slide 0: PROMINENT IRANBIMHUB BRAND LOGO & TAGLINE */
              <div className="relative w-full max-w-sm bg-slate-950/80 border border-[#26B6B6]/50 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(38,182,182,0.25)] flex flex-col items-center text-center space-y-4 animate-float-3d-bim relative overflow-hidden">
                {/* Low-Opacity IranBIMhub Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10">
                  <span className="text-4xl font-black font-mono tracking-widest text-[#26B6B6] -rotate-12 whitespace-nowrap uppercase">
                    IranBIMhub
                  </span>
                </div>

                <Logo className="h-14 sm:h-16 w-auto relative z-10" />

                <p className="text-xs sm:text-sm font-extrabold text-teal-200 leading-snug px-3 py-2 bg-[#26B6B6]/10 border border-[#26B6B6]/30 rounded-xl relative z-10">
                  {isRtl
                    ? 'پلی میان معماران و تولیدکنندگان صنعت ساختمان در بستر بیم'
                    : 'A bridge between architects and manufacturers of the construction industry, built on BIM'}
                </p>
              </div>
            )}

            {activeSlide === 1 && (
              /* Slide 1: FLOATING 3D BIM MODEL CARD WITH GLASSMORPHISM & IRANBIMHUB WATERMARK */
              <div className="relative w-full h-full flex items-center justify-center select-none" dir="ltr">
                <div className="relative w-80 h-56 flex items-center justify-center">
                  {/* Back Card (IFC / ARCHICAD) with Soft Glass Effect */}
                  <div className="absolute bg-slate-900/70 backdrop-blur-md border border-[#26B6B6]/30 rounded-2xl p-3.5 w-52 h-36 shadow-xl transform translate-x-4 -translate-y-3 rotate-[4deg] opacity-75 animate-float-3d-bim-back relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] text-[#26B6B6] font-mono font-bold tracking-wider">IFC 4 / ARCHICAD</span>
                      <div className="w-2 h-2 rounded-full bg-[#26B6B6] animate-ping" />
                    </div>
                    <div className="flex items-center justify-center h-20">
                      <DoorOpen className="w-10 h-10 text-[#26B6B6]/80" />
                    </div>
                    {/* Watermark on Back Card */}
                    <div className="absolute bottom-1.5 right-2 opacity-15 pointer-events-none font-mono text-[7px] text-[#26B6B6] uppercase font-bold tracking-widest">
                      IranBIMhub
                    </div>
                  </div>

                  {/* Front Floating 3D BIM Model Card with Continuous Motion, Glassmorphism, and Low-Opacity Watermark */}
                  <div className="absolute bg-slate-950/80 backdrop-blur-xl border border-[#26B6B6]/60 rounded-2xl p-4 w-60 sm:w-64 h-42 shadow-[0_25px_50px_-12px_rgba(38,182,182,0.35)] animate-float-3d-bim relative overflow-hidden group">
                    {/* Top Soft Glassmorphism Reflection Sheen */}
                    <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none" />

                    {/* Low-Opacity IranBIMhub Watermark across card background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10">
                      <span className="text-2xl font-black font-mono tracking-widest text-[#26B6B6] -rotate-12 whitespace-nowrap uppercase">
                        IranBIMhub 3D
                      </span>
                    </div>

                    {/* Corner Watermark Badge */}
                    <div className="absolute -right-3 -bottom-3 pointer-events-none select-none opacity-15 flex items-center gap-1 transform -rotate-12">
                      <Logo iconOnly={true} className="w-14 h-14 text-[#26B6B6]" />
                      <span className="text-sm font-black font-mono tracking-widest text-[#26B6B6]">
                        IranBIMhub
                      </span>
                    </div>

                    {/* Card Header */}
                    <div className="flex justify-between items-center mb-2 border-b border-white/15 pb-2 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#26B6B6] animate-ping" />
                        <span className="text-[10px] text-white font-black tracking-wide">REVIT RFA 3D MODEL</span>
                      </div>
                      <span className="text-[8px] bg-[#26B6B6]/25 text-[#26B6B6] px-2 py-0.5 rounded font-mono font-bold border border-[#26B6B6]/40 shadow-xs">
                        LOD 350
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="flex justify-between items-center h-18 px-1 relative z-10">
                      <div className="flex flex-col text-left">
                        <span className="text-xs sm:text-sm font-black text-gray-100 tracking-tight">
                          {isRtl ? 'پمپ آبرسانی طبقاتی' : 'Multistage Water Pump'}
                        </span>
                        <span className="text-[9px] text-teal-200/90 font-mono mt-0.5">
                          Size: 4.8 MB • Ver: 2024
                        </span>
                        <span className="text-[8px] text-gray-400 font-mono mt-0.5">
                          MEP Parametric Connectors
                        </span>
                      </div>
                      <div className="relative w-10 h-10 bg-[#26B6B6]/20 rounded-xl flex items-center justify-center border border-[#26B6B6]/60 overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                        <Download className="w-5 h-5 text-[#26B6B6] animate-down-arrow" />
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between text-[8px] text-emerald-400 pt-2 border-t border-white/15 font-bold relative z-10">
                      <div className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'سازگار با استانداردهای نظام فنی' : 'Verified Building Code Compliant'}</span>
                      </div>
                      <span className="text-[7px] text-teal-300/60 font-mono uppercase tracking-widest">
                        3D BIM HUB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSlide === 2 && (
              /* Slide 2: Manufacturer Analytics Node with Glassmorphism & Watermark */
              <div className="relative w-full h-full flex items-center justify-center select-none" dir="ltr">
                <div className="relative w-72 h-52 flex items-center justify-center animate-float-3d-bim">
                  <div className="relative w-22 h-22 bg-slate-950/90 border-2 border-[#26B6B6] rounded-3xl flex items-center justify-center shadow-[0_0_35px_rgba(38,182,182,0.45)] backdrop-blur-xl z-10 overflow-hidden">
                    {/* Watermark in Central Node */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                      <span className="text-[8px] font-mono font-black text-[#26B6B6] uppercase">IranBIMhub</span>
                    </div>
                    <Logo iconOnly={true} className="w-12 h-12 relative z-10" />
                  </div>

                  <div className="absolute right-2 top-0 bg-slate-950/85 border border-[#26B6B6]/50 backdrop-blur-xl rounded-xl p-3 space-y-1.5 shadow-2xl max-w-[140px] z-20 text-left relative overflow-hidden">
                    <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none text-[8px] font-mono text-[#26B6B6] font-extrabold uppercase">
                      IranBIMhub
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-black">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'رشد بازدید' : 'Views Up'}</span>
                    </div>
                    <div className="h-7 flex items-end gap-1.5 pt-0.5">
                      <div className="w-2 h-2 bg-[#26B6B6]/30 rounded-xs" />
                      <div className="w-2 h-3.5 bg-[#26B6B6]/50 rounded-xs" />
                      <div className="w-2 h-5 bg-[#26B6B6]/70 rounded-xs" />
                      <div className="w-2 h-6 bg-emerald-400 rounded-xs animate-pulse" />
                    </div>
                  </div>

                  <div className="absolute left-0 bottom-2 bg-slate-900/90 border border-gray-400/50 backdrop-blur-xl rounded-full py-1.5 px-3 flex items-center gap-2 shadow-xl z-20 animate-pulse text-left">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span className="text-[9px] font-black text-white">
                      {isRtl ? 'سرنخ جدید +۱' : 'New Lead +1'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeSlide === 3 && (
              /* Slide 3: Trust Stat Cards with Glassmorphism & Watermark */
              <div className="w-full h-full flex items-center justify-center select-none animate-fadeIn" dir="ltr">
                <div className="grid grid-cols-2 gap-3 w-full max-w-[290px] animate-float-3d-bim">
                  <div className="bg-slate-950/80 border border-white/20 rounded-2xl p-3.5 text-center space-y-1 backdrop-blur-xl shadow-xl relative overflow-hidden">
                    <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-[#26B6B6] rounded-full animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                      <span className="text-[9px] font-mono font-black text-[#26B6B6]">IranBIMhub</span>
                    </div>
                    <span className="text-base font-black text-[#26B6B6] font-mono tracking-wide relative z-10">
                      <CountUp key={activeSlide} end={15000} prefix="+" isRtl={isRtl} />
                    </span>
                    <span className="text-[10px] text-gray-200 font-bold block relative z-10">
                      {isRtl ? 'آبجکت فعال' : 'BIM Objects'}
                    </span>
                  </div>

                  <div className="bg-slate-950/80 border border-white/20 rounded-2xl p-3.5 text-center space-y-1 backdrop-blur-xl shadow-xl relative overflow-hidden">
                    <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-[#26B6B6] rounded-full animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                      <span className="text-[9px] font-mono font-black text-[#26B6B6]">IranBIMhub</span>
                    </div>
                    <span className="text-base font-black text-[#26B6B6] font-mono tracking-wide relative z-10">
                      <CountUp key={activeSlide} end={140} prefix="+" isRtl={isRtl} />
                    </span>
                    <span className="text-[10px] text-gray-200 font-bold block relative z-10">
                      {isRtl ? 'تولیدکننده ایرانی' : 'Brand Houses'}
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-[#26B6B6]/30 via-slate-950/80 to-slate-900/90 border-2 border-[#26B6B6]/60 backdrop-blur-xl rounded-2xl p-3.5 text-center space-y-1.5 col-span-2 shadow-2xl relative overflow-hidden">
                    <div className="absolute right-2.5 top-2.5 w-2 h-2 bg-[#26B6B6] rounded-full animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                      <span className="text-xl font-mono font-black text-[#26B6B6] uppercase tracking-widest">
                        IranBIMhub
                      </span>
                    </div>
                    <span className="text-lg font-black text-emerald-400 font-mono tracking-wide relative z-10">
                      <CountUp key={activeSlide} end={28000} prefix="+" isRtl={isRtl} />
                    </span>
                    <span className="text-[10px] text-white font-black block tracking-tight relative z-10">
                      {isRtl ? 'دانلود موفق فمیلی در ماه جاری' : 'Monthly Successful Downloads'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeSlide === 4 && (
              /* Slide 4: Dual Path Node with Glassmorphism & Watermarks */
              <div className="relative w-full h-full flex items-center justify-center select-none" dir="ltr">
                <div className="relative w-72 h-52 flex items-center justify-center animate-float-3d-bim">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-950/85 border border-[#26B6B6] rounded-2xl backdrop-blur-xl flex flex-col items-center justify-center shadow-xl z-10">
                    <Compass className="w-6 h-6 text-[#26B6B6]" />
                    <span className="absolute -bottom-6 text-[9px] font-black text-gray-200 whitespace-nowrap">
                      {isRtl ? 'طراحان' : 'Designers'}
                    </span>
                  </div>

                  <div className="relative w-20 h-20 bg-slate-950 border-2 border-[#26B6B6] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(38,182,182,0.5)] backdrop-blur-xl z-10 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                      <span className="text-[7px] font-mono font-black text-[#26B6B6]">HUB</span>
                    </div>
                    <Logo iconOnly={true} className="w-10 h-10 relative z-10" />
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-950/85 border border-emerald-500 rounded-2xl backdrop-blur-xl flex flex-col items-center justify-center shadow-xl z-10">
                    <Factory className="w-6 h-6 text-emerald-400" />
                    <span className="absolute -bottom-6 text-[9px] font-black text-gray-200 whitespace-nowrap">
                      {isRtl ? 'تولیدکنندگان' : 'Manufacturers'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Clickable Tabs + Progress Bar + Transparent Navigation Arrows */}
        <div className="mt-8 pt-4 border-t border-white/15">
          <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-5xl mx-auto px-1 sm:px-2">
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
              className="p-2 sm:p-2.5 rounded-full text-white/70 hover:text-white bg-transparent hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center shrink-0 hover:scale-110 active:scale-95"
              title={isRtl ? 'اسلاید بعدی' : 'Previous slide'}
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Stepper Pills with Slide Numbers */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-4 flex-1 max-w-4xl">
              {SLIDE_CONFIGS.map((cfg, idx) => {
                const isActive = activeSlide === idx;
                return (
                  <button
                    key={cfg.id}
                    type="button"
                    onClick={() => {
                      setActiveSlide(idx);
                      setSlideProgress(0);
                    }}
                    className={`relative py-2.5 px-1 sm:px-3 rounded-xl transition-all duration-300 cursor-pointer text-center group flex flex-col items-center justify-between gap-1.5 ${
                      isActive
                        ? 'bg-slate-950/80 border border-[#26B6B6]/50 shadow-lg text-white'
                        : 'bg-slate-900/40 hover:bg-slate-900/70 border border-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#26B6B6]' : 'text-gray-400'}`}>
                        {isRtl ? cfg.numFa : cfg.numEn}
                      </span>
                      <span className={`hidden sm:inline text-xs font-extrabold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {isRtl ? cfg.labelFa : cfg.labelEn}
                      </span>
                    </div>

                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
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
              className="p-2 sm:p-2.5 rounded-full text-white/70 hover:text-white bg-transparent hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center shrink-0 hover:scale-110 active:scale-95"
              title={isRtl ? 'اسلاید قبلی' : 'Next slide'}
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
