import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { useSiteConfig } from './SiteConfigContext';
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
  const { siteConfig } = useSiteConfig();
  const activeSlides = siteConfig?.heroBanners && siteConfig.heroBanners.length > 0
    ? siteConfig.heroBanners
    : SLIDE_CONFIGS;
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);

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
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center min-h-[350px] sm:min-h-[440px] md:min-h-[420px] lg:min-h-[400px] transition-transform duration-100 ease-out"
          style={{
            transform: dragOffsetX !== 0 ? `translateX(${dragOffsetX}px) rotate(${dragOffsetX * 0.015}deg)` : 'none'
          }}
        >
          {/* Left Text Content */}
          <div className="md:col-span-12 space-y-2 sm:space-y-5 flex flex-col justify-center animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-[#26B6B6]/30 rounded-full text-[10px] sm:text-xs font-bold text-[#26B6B6] self-start shadow-md max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#26B6B6] shrink-0" />
              <span className="truncate">
                {isRtl ? activeSlides[activeSlide].badgeFa : activeSlides[activeSlide].badgeEn}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight md:leading-tight text-white drop-shadow-md transition-all duration-300">
              {isRtl ? activeSlides[activeSlide].headingFa : activeSlides[activeSlide].headingEn}
            </h1>

            <p className="text-[11px] sm:text-base md:text-lg text-gray-200 leading-relaxed font-normal max-w-2xl drop-shadow-sm transition-all duration-300">
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

        </div>

        {/* Carousel Clickable Tabs + Progress Bar + Transparent Navigation Arrows */}
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
