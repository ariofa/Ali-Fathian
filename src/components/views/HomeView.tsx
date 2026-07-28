import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { CATEGORIES, MANUFACTURERS, BIM_OBJECTS, MOCK_REVIEWS } from '../../data';
import { BIMObject, FilterState } from '../../types';
import { BIMObjectCard } from '../BIMObjectCard';
import { CategoryIcon } from '../CategoryIcon';
import { ARTICLES } from './LearnView';
import { Logo } from '../Logo';
import { HeroCarousel } from '../HeroCarousel';
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

const SLIDE_CONFIGS = [
  {
    id: 'identity',
    labelFa: 'هویت',
    labelEn: 'Identity',
    numFa: '۰۱',
    numEn: '01',
    bgImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    overlay: 'bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-[#1E2326]/85',
    badgeFa: 'اولین اکوسیستم ملی بیم ایران',
    badgeEn: "Iran's National BIM Ecosystem",
    headingFa: 'ایران‌بیم‌هاب، خانه صنعت ساختمان هوشمند ایران',
    headingEn: "IranBIMhub — Home of Iran's Smart Construction Industry",
    descFa: 'جایی که مهندسان و معماران، دقیق‌ترین آبجکت‌های بیم را می‌یابند؛ و تولیدکنندگان ایرانی، محصولات خود را وارد آینده دیجیتال ساخت‌وساز می‌کنند.',
    descEn: 'Where engineers and architects find precise BIM objects, and Iranian manufacturers step into the digital future of construction.'
  },
  {
    id: 'designers',
    labelFa: 'طراحان',
    labelEn: 'Designers',
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
      custom.forEach((obj: BIMObject) => { if (obj && obj.id) map.set(obj.id, obj); });
      return Array.from(map.values());
    } catch {
      return BIM_OBJECTS;
    }
  }, [customObjectsVersion]);
  
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

  const newestObjectsScrollRef = useRef<HTMLDivElement>(null);

  const scrollNewestObjects = (direction: 'left' | 'right') => {
    if (newestObjectsScrollRef.current) {
      const scrollAmount = 260;
      newestObjectsScrollRef.current.scrollBy({
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
              <span>{isRtl ? 'به‌روزرسانی‌های جدید' : 'New Releases'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {isRtl ? 'جدیدترین آبجکت‌های منتشر شده' : 'Newest Standardized BIM Objects'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 leading-relaxed font-light">
              {isRtl 
                ? 'آخرین مدل‌های پارامتریک تاییدشده، فمیلی‌های رویت و جزئیات فنی قطعات که به تازگی به دایرکتوری اضافه شده‌اند.' 
                : 'Browse the latest architect-approved families, Revit models, and parametric building objects added this week.'}
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3">
            <button
              onClick={() => {
                onFilterChange({});
                onNavigate('library');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#26B6B6] hover:text-[#1e9494] transition-colors cursor-pointer group whitespace-nowrap"
            >
              <span>{isRtl ? 'مشاهده همه محصولات' : 'Explore Entire Library'}</span>
              <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 shrink-0 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>

            {/* Left/Right scroll controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollNewestObjects('left')}
                className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:border-[#26B6B6] transition-all shadow-2xs cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollNewestObjects('right')}
                className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:border-[#26B6B6] transition-all shadow-2xs cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Objects Horizontally Scrollable Row */}
        <div className="relative group/newest">
          <div
            ref={newestObjectsScrollRef}
            className="flex gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {combinedObjects.slice(-8).reverse().map((obj) => (
              <div key={`new-obj-${obj.id}`} className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] snap-start">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-150/50 dark:border-gray-800/60 pb-4">
          <div className="text-start space-y-1 flex-1">
            <h2 className="text-base sm:text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#26B6B6] shrink-0" />
              <span>{isRtl ? 'دیدگاه معماران و متخصصان بیم' : 'Insights from Architects & BIM Specialists'}</span>
            </h2>
            <p className="text-[10.5px] sm:text-xs text-gray-400 font-medium">
              {isRtl ? 'نظرات طراحان، معماران و مدیران پروژه‌ها درباره پلتفرم ایران‌بیم‌هاب' : 'What leading architectural designers and BIM managers say about us'}
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollTestimonials('left')}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:border-[#26B6B6] transition-all shadow-2xs cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTestimonials('right')}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] hover:border-[#26B6B6] transition-all shadow-2xs cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative group/testimonials">
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
            className="flex gap-4 sm:gap-6 overflow-x-auto py-2 px-1 scrollbar-none snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[[...MOCK_REVIEWS], [...MOCK_REVIEWS], [...MOCK_REVIEWS]].map((group, groupIdx) => (
              <React.Fragment key={groupIdx}>
                {group.map((rev, revIdx) => (
                  <div 
                    key={`${groupIdx}-${rev.id}-${revIdx}`} 
                    className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] snap-start bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between text-start relative select-none"
                  >
                    <div className="absolute top-4 end-4 text-gray-100 dark:text-gray-800 text-5xl sm:text-6xl font-serif select-none leading-none opacity-50 dark:opacity-30 pointer-events-none">
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
              </React.Fragment>
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
