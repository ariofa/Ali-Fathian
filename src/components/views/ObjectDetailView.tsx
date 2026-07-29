import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { BIMObject } from '../../types';
import { MANUFACTURERS, BIM_OBJECTS, CATEGORIES } from '../../data';
import { 
  Download, 
  Heart, 
  Columns4, 
  Mail, 
  Building2, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Maximize2,
  Info,
  AlertTriangle,
  Image,
  Box
} from 'lucide-react';
import { BIM3DViewer } from '../BIM3DViewer';
import { Breadcrumb, BreadcrumbItem } from '../Breadcrumb';

interface ObjectDetailViewProps {
  object: BIMObject;
  onBack: () => void;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
  onDownloadFile: (format: string) => void;
  onSelectObject: (obj: BIMObject) => void;
  onNavigate: (view: string) => void;
  onViewBrand?: (mfgId: string) => void;
}

export const ObjectDetailView: React.FC<ObjectDetailViewProps> = ({
  object,
  onBack,
  onToggleSave,
  isSaved,
  onDownloadFile,
  onSelectObject,
  onNavigate,
  onViewBrand
}) => {
  const { language, t, isRtl, formatCurrency } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | '3d'>('image');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    requestSample: false,
    requestQuote: false
  });

  // Generate 3 contextual renders for each product
  const getProductRenders = () => {
    const mainImg = object.imageUrl;
    let techImg = "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1200"; // engineering blueprint
    let contextImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"; // luxury residential construction

    if (object.category === 'doors_windows') {
      techImg = "https://images.unsplash.com/photo-1503387762-592dec58ef4e?auto=format&fit=crop&q=80&w=1200"; // architectural blueprint
      contextImg = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200"; // window modern house interior
    } else if (object.category === 'bathroom') {
      techImg = "https://images.unsplash.com/photo-1542332213-9b5a5a3f8c4e?auto=format&fit=crop&q=80&w=1200"; // plumbing blueprint
      contextImg = "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1200"; // bathroom tiles setup
    } else if (object.category === 'furniture') {
      techImg = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200"; // industrial design CAD
      contextImg = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"; // stylized room showcase
    } else if (object.category === 'materials_facades') {
      techImg = "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200"; // concrete construction details
      contextImg = "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&q=80&w=1200"; // luxury building facade
    }

    return [
      {
        url: mainImg,
        titleEn: "Primary Product Render",
        titleFa: "رندر اصلی سه بعدی محصول",
        descEn: "High-fidelity digital render showcasing manufacturing scale and material finishes.",
        descFa: "رندر دیجیتالی با وضوح بالا جهت نمایش ابعاد، متریال و رنگ نهایی محصول کارخانه."
      },
      {
        url: techImg,
        titleEn: "Certified CAD Dimensional Blueprint",
        titleFa: "نقشه فنی و جزئیات اجرایی CAD",
        descEn: "Parametric lines & reference plumbing/mounting connection ports.",
        descFa: "ابعاد دقیق به میلی‌متر، پورت‌های تاسیساتی و نحوه اتصال به سازه مطابق با کاتالوگ."
      },
      {
        url: contextImg,
        titleEn: "Architectural Construction Context",
        titleFa: "نمونه اجرای واقعی در پروژه‌های برتر",
        descEn: "On-site installation example exhibiting aesthetic integration with modern spaces.",
        descFa: "نمونه عینی نصب و اجرای نهایی محصول در فضاهای مدرن معماری داخلی و خارجی."
      }
    ];
  };

  const renders = getProductRenders();

  // Handle ESC key to exit fullscreen image mode and manage body scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageFullscreen(false);
      }
    };
    if (isImageFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isImageFullscreen]);

  const getDynamicManufacturer = () => {
    const staticMfg = MANUFACTURERS.find(m => m.id === object.manufacturerId);
    try {
      const saved = localStorage.getItem('iranbimhub_mfg_profile');
      if (saved && (object.manufacturerId === 'm1' || object.manufacturerId === 'custom')) {
        const parsed = JSON.parse(saved);
        return {
          ...staticMfg,
          nameFa: parsed.nameFa || staticMfg?.nameFa,
          nameEn: parsed.nameEn || staticMfg?.nameEn,
          descriptionFa: parsed.descFa || staticMfg?.descriptionFa,
          descriptionEn: parsed.descEn || staticMfg?.descriptionEn,
          verified: parsed.verified !== undefined ? parsed.verified : staticMfg?.verified,
          logoUrl: parsed.logoUrl || staticMfg?.logo
        };
      }
    } catch (e) {
      console.error(e);
    }
    return staticMfg;
  };

  const activeMfg = getDynamicManufacturer();
  const mName = activeMfg ? (isRtl ? activeMfg.nameFa : activeMfg.nameEn) : '';
  const mDesc = activeMfg ? (isRtl ? activeMfg.descriptionFa : activeMfg.descriptionEn) : '';

  const title = isRtl ? object.titleFa : object.titleEn;
  const desc = isRtl ? object.descriptionFa : object.descriptionEn;

  // Get similar products in same category
  const related = useMemo(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_custom_objects_v2');
      const custom = saved ? JSON.parse(saved) : [];
      const map = new Map<string, BIMObject>();
      BIM_OBJECTS.forEach(obj => { if (obj && obj.id) map.set(obj.id, obj); });
      custom.forEach((obj: BIMObject) => { if (obj && obj.id) map.set(obj.id, obj); });
      const combined = Array.from(map.values());
      return combined.filter(o => o.category === object.category && o.id !== object.id).slice(0, 3);
    } catch {
      return BIM_OBJECTS.filter(o => o.category === object.category && o.id !== object.id).slice(0, 3);
    }
  }, [object.category, object.id]);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate adding message to localStorage for the manufacturer CRM
    const storedInquiries = JSON.parse(localStorage.getItem('iranbimhub_inquiries') || '[]');
    const newInquiry = {
      id: Math.random().toString(),
      objectId: object.id,
      objectTitle: isRtl ? object.titleFa : object.titleEn,
      manufacturerId: object.manufacturerId,
      senderName: formData.name,
      senderEmail: formData.email,
      senderPhone: formData.phone,
      message: formData.message,
      requestSample: formData.requestSample,
      requestQuote: formData.requestQuote,
      date: new Date().toLocaleDateString('fa-IR')
    };
    
    localStorage.setItem('iranbimhub_inquiries', JSON.stringify([newInquiry, ...storedInquiries]));
    setFormSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '', requestSample: false, requestQuote: false });
  };

  const activeCategoryObject = CATEGORIES.find(c => c.id === object.category);
  const activeSubcategoryObject = activeCategoryObject
    ? activeCategoryObject.subcategories.find(s => s.id === object.subcategory)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Wayfinding Breadcrumbs Trail */}
      <Breadcrumb
        items={[
          { label: isRtl ? 'صفحه اصلی' : 'Home', onClick: onBack },
          { label: isRtl ? 'دسته‌بندی محصولات' : 'Product Categories', onClick: onBack },
          ...(activeCategoryObject ? [{ label: isRtl ? activeCategoryObject.nameFa : activeCategoryObject.nameEn, onClick: onBack }] : []),
          ...(activeSubcategoryObject ? [{ label: isRtl ? activeSubcategoryObject.nameFa : activeSubcategoryObject.nameEn, onClick: onBack }] : []),
          { label: title }
        ]}
      />

      {/* Navigation Breadcrumb */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-[#26B6B6] hover:text-[#1e9494] transition-colors cursor-pointer bg-[#26B6B6]/5 px-3 py-2 rounded-lg border border-[#26B6B6]/10"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{isRtl ? 'بازگشت به نتایج فیلتر شده' : 'Back to results'}</span>
        </button>

        <span className="text-xs text-gray-400 font-mono">
          ID: {object.id} • LOD: {object.lod}
        </span>
      </div>

      {/* Main product presentation grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Center - Preview Image, Specs & Description */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Segmented Media Mode Switcher (2D Render / 3D BIM Model) */}
          <div className="flex bg-gray-100 dark:bg-gray-850 p-1 rounded-2xl border border-gray-150 dark:border-gray-800 w-full sm:w-fit gap-1 select-none">
            <button
              onClick={() => setActiveMediaTab('image')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activeMediaTab === 'image'
                  ? 'bg-white dark:bg-gray-800 text-[#26B6B6] shadow-md border-b-2 border-[#26B6B6]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50/40 dark:hover:bg-gray-900/20'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>{isRtl ? 'رندر دو بعدی محصول' : '2D Product Render'}</span>
            </button>
            <button
              onClick={() => setActiveMediaTab('3d')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activeMediaTab === '3d'
                  ? 'bg-white dark:bg-gray-800 text-[#26B6B6] shadow-md border-b-2 border-[#26B6B6]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50/40 dark:hover:bg-gray-900/20'
              }`}
            >
              <Box className="w-4 h-4 text-[#26B6B6]" />
              <span>{isRtl ? 'شبیه‌ساز و نمای سه بعدی تعاملی' : 'Interactive 3D BIM Model'}</span>
            </button>
          </div>

          {activeMediaTab === 'image' ? (
            /* Interactive 2D Gallery Slideshow with Fullscreen Lightbox */
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs relative group/gallery select-none">
                {/* Image Container */}
                <div className="relative aspect-16/9 overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img 
                    src={renders[activeSlideIndex].url} 
                    alt={isRtl ? renders[activeSlideIndex].titleFa : renders[activeSlideIndex].titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                  
                  {/* Sliding Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-6 text-white text-start flex flex-col justify-end min-h-[40%]">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#26B6B6] text-white px-1.5 py-0.5 rounded w-fit mb-1.5">
                      {isRtl ? `رندر ${activeSlideIndex + 1} از ۳` : `Render ${activeSlideIndex + 1} of 3`}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black tracking-tight text-white mb-1">
                      {isRtl ? renders[activeSlideIndex].titleFa : renders[activeSlideIndex].titleEn}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-300 font-light leading-snug">
                      {isRtl ? renders[activeSlideIndex].descFa : renders[activeSlideIndex].descEn}
                    </p>
                  </div>

                  {/* Previous Control */}
                  <button
                    onClick={() => setActiveSlideIndex(prev => prev === 0 ? renders.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer opacity-0 group-hover/gallery:opacity-100 z-10"
                    title={isRtl ? 'تصویر قبلی' : 'Previous Render'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Next Control */}
                  <button
                    onClick={() => setActiveSlideIndex(prev => prev === renders.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer opacity-0 group-hover/gallery:opacity-100 z-10"
                    title={isRtl ? 'تصویر بعدی' : 'Next Render'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Corner Action Overlays */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => setIsImageFullscreen(true)}
                    className="p-2 bg-black/45 hover:bg-black/75 text-white rounded-full backdrop-blur-md transition-all cursor-pointer"
                    title={isRtl ? 'مشاهده تمام‌صفحه تصویر' : 'Fullscreen Gallery'}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-4 end-4 flex gap-2 z-10">
                  <button
                    onClick={() => onToggleSave(object.id)}
                    className={`p-2.5 rounded-full backdrop-blur-md cursor-pointer transition-all ${
                      isSaved ? 'bg-rose-50 text-rose-500 shadow-md' : 'bg-black/45 text-white hover:bg-black/75'
                    }`}
                    title={t('favorites')}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Slide Indicator Dots and Thumbnails undercard */}
              <div className="flex items-center justify-between px-1">
                <div className="flex gap-1.5 select-none" dir="ltr">
                  {renders.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeSlideIndex ? 'w-6 bg-[#26B6B6]' : 'w-1.5 bg-gray-200 dark:bg-gray-800'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  {renders.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`relative w-14 aspect-16/10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activeSlideIndex ? 'border-[#26B6B6] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Fullscreen Lightbox Portal Overlay */}
              {isImageFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between p-4 md:p-6 select-none animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between w-full border-b border-white/10 pb-3">
                    <div className="text-start">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#26B6B6] block">
                        {isRtl ? 'آلبوم تصاویر و رندرهای باکیفیت' : 'High-Resolution Render Showcase'}
                      </span>
                      <h3 className="text-xs sm:text-sm font-black tracking-tight text-white mt-0.5">
                        {isRtl ? object.titleFa : object.titleEn}
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsImageFullscreen(false)}
                      className="bg-white/10 hover:bg-red-500 hover:text-white text-white p-2 md:p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                    >
                      <X className="w-4 h-4" />
                      <span className="hidden sm:inline">{isRtl ? 'بستن (ESC)' : 'Close (ESC)'}</span>
                    </button>
                  </div>

                  {/* Main Display Stage */}
                  <div className="flex-1 relative w-full flex items-center justify-center py-4 md:py-8">
                    <img 
                      src={renders[activeSlideIndex].url} 
                      alt="Fullscreen Render"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-[65vh] md:max-h-[72vh] object-contain rounded-xl shadow-2xl"
                    />

                    {/* Navigation Buttons inside Display */}
                    <button
                      onClick={() => setActiveSlideIndex(prev => prev === 0 ? renders.length - 1 : prev - 1)}
                      className="absolute left-2 md:left-6 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-lg transition-all cursor-pointer border border-white/5"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    <button
                      onClick={() => setActiveSlideIndex(prev => prev === renders.length - 1 ? 0 : prev + 1)}
                      className="absolute right-2 md:right-6 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-lg transition-all cursor-pointer border border-white/5"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>

                  {/* Bottom Metadata & Thumbnails Panel */}
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4">
                    <div className="text-start max-w-xl space-y-1">
                      <span className="text-[9px] font-extrabold uppercase text-[#26B6B6] tracking-widest">
                        {isRtl ? `جزئیات رندر شماره ${activeSlideIndex + 1}` : `DETAILS FOR RENDER ${activeSlideIndex + 1}`}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white">
                        {isRtl ? renders[activeSlideIndex].titleFa : renders[activeSlideIndex].titleEn}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-light leading-relaxed">
                        {isRtl ? renders[activeSlideIndex].descFa : renders[activeSlideIndex].descEn}
                      </p>
                    </div>

                    {/* Quick Selector Thumbnail tray */}
                    <div className="flex gap-2.5 bg-white/5 p-2 rounded-2xl border border-white/5">
                      {renders.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlideIndex(idx)}
                          className={`relative w-16 md:w-20 aspect-16/10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            idx === activeSlideIndex ? 'border-[#26B6B6] scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                        >
                          <img src={item.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 3D Interactive BIM Viewer Card */
            <BIM3DViewer object={object} />
          )}

          {/* Description Block */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-4 shadow-2xs">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-3">
              {t('description')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light whitespace-pre-wrap">
              {desc}
            </p>
          </div>

          {/* Parametric Specs Table */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-4 shadow-2xs">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#26B6B6]" />
                <span>{t('specifications')}</span>
              </h2>
              <span className="text-[10px] bg-gray-100 text-[#464E56] px-2 py-1 rounded font-bold font-mono">
                {object.lod} Standard
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 pt-2">
              
              {/* Shared Metadata attributes */}
              <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                <span className="text-gray-400 font-semibold">{isRtl ? 'تولیدکننده رسمی' : 'Manufacturer'}</span>
                <span className="text-gray-700 font-bold">{mName}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                <span className="text-gray-400 font-semibold">{t('lod')}</span>
                <span className="text-gray-700 font-mono font-bold">{object.lod}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                <span className="text-gray-400 font-semibold">{t('fileSize')}</span>
                <span className="text-gray-700 font-mono font-bold">{object.fileSize}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                <span className="text-gray-400 font-semibold">{isRtl ? 'نوع کاربری محصول' : 'Product Category'}</span>
                <span className="text-gray-700 font-bold">{object.category}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                <span className="text-gray-400 font-semibold">{t('certification')}</span>
                <span className="text-gray-700 font-mono font-bold flex gap-1">
                  {object.certification.map(c => (
                    <span key={c} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{c}</span>
                  ))}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                <span className="text-gray-400 font-semibold">{t('origin')}</span>
                <span className="text-gray-700 font-bold">{object.isImported ? t('originImported') : t('originIran')}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                <span className="text-gray-400 font-semibold">{t('hasCutsheet')}</span>
                <span className="text-gray-700 font-bold">{object.hasCutsheet ? t('yes') : t('no')}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                <span className="text-gray-400 font-semibold">{t('hasSample')}</span>
                <span className="text-gray-700 font-bold">{object.hasSample ? t('yes') : t('no')}</span>
              </div>

              {/* Dynamic Category Specific attributes */}
              {Object.entries(object.specs).map(([key, val]) => {
                // Capitalize key
                const formattedKey = key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <div key={key} className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                    <span className="text-gray-400 font-semibold capitalize">{formattedKey}</span>
                    <span className="text-[#26B6B6] font-bold">
                      {typeof val === 'boolean' ? (val ? t('yes') : t('no')) : String(val)}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

        {/* Right - Downloads Box & Contact Form */}
        <div className="space-y-8">
          
          {/* File Downloads Portal */}
          <div className="bg-gradient-to-br from-[#464E56] to-[#343a40] text-white rounded-2xl p-6 shadow-md border-b-4 border-[#26B6B6] space-y-4">
            <div>
              <span className="text-[10px] text-[#26B6B6] font-bold uppercase tracking-wider block">
                {t('formats')}
              </span>
              <h1 className="text-xl font-bold mt-1 leading-snug">
                {title}
              </h1>
            </div>

            <div className="space-y-2.5 pt-2">
              {object.formats.map(format => (
                <button
                  key={format}
                  onClick={() => onDownloadFile(format)}
                  className="w-full bg-white/10 hover:bg-white/20 hover:text-[#26B6B6] text-white p-3 rounded-xl transition-all flex justify-between items-center text-xs font-mono font-bold group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#26B6B6]" />
                    <span>Download {format} BIM family</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-300 group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>

            <div className="text-[10px] text-gray-400 text-center font-light pt-2">
              {isRtl 
                ? 'دانلود رایگان به عنوان مهندس عضو، یک کلیک دانلود مستقیم' 
                : '1-click direct download with registered Modeler profile'
              }
            </div>

            {/* Copyright & Liability Disclaimer banner */}
            <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5 text-start">
              <div className="flex items-center gap-1.5 text-amber-500">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-wider">
                  {isRtl ? 'سلب مسئولیت کپی‌رایت' : 'Liability & Copyright Shield'}
                </span>
              </div>
              <p className="text-[9.5px] text-gray-300 leading-normal font-light">
                {isRtl ? (
                  <span>
                    حقوق مالکیت مادی و معنوی این فایل‌ها متعلق به تولیدکننده است. ایران‌بیم‌هاب صرفاً ناشر دیجیتال کاتالوگ بوده و طبق{' '}
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).onNavigateToView) {
                          (window as any).onNavigateToView('terms');
                        }
                      }}
                      className="text-[#26B6B6] hover:underline font-bold cursor-pointer inline-block"
                    >
                      ماده ۴ شرایط استفاده
                    </button>{' '}
                    مسئولیتی در قبال اشکالات فنی مدل ندارد.
                  </span>
                ) : (
                  <span>
                    All intellectual property rights belong exclusively to the manufacturer. IranBIMhub acts as a distributor only and disclaims liability under{' '}
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).onNavigateToView) {
                          (window as any).onNavigateToView('terms');
                        }
                      }}
                      className="text-[#26B6B6] hover:underline font-bold cursor-pointer inline-block"
                    >
                      Clause 4 of Terms
                    </button>{' '}
                    for geometric errors.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Manufacturer Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
            <div 
              onClick={() => onViewBrand && onViewBrand(object.manufacturerId)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm tracking-wider text-gray-600 group-hover:border-[#26B6B6]/50 group-hover:text-[#26B6B6] transition-all">
                {activeMfg?.logo}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#26B6B6] transition-colors">
                  {mName}
                </h3>
                {activeMfg?.verified && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 mt-0.5 w-fit">
                    ✓ {isRtl ? 'برند صنعتی تاییدشده' : 'Certified Partner'}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
              {mDesc}
            </p>

            <button
              onClick={() => onViewBrand ? onViewBrand(object.manufacturerId) : onNavigate('manufacturers')}
              className="w-full text-center text-xs text-[#26B6B6] font-bold hover:underline cursor-pointer"
            >
              {isRtl ? 'مشاهده کاتالوگ کامل برند' : 'View brand profile & catalog'}
            </button>
          </div>

          {/* Contact Manufacturer / Lead-gen form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {t('contactManufacturer')}
            </h3>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs space-y-2 leading-relaxed">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <p>{t('contactSuccess')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-3.5">
                
                <p className="text-[11px] text-gray-500 leading-normal">
                  {t('contactFormTitle')}
                </p>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder={t('fullName')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder={t('emailAddress')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder={t('phoneNumber')}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                  />
                  
                  {/* Boolean Option Checks */}
                  <div className="space-y-1.5 pt-1">
                    <label className="flex items-center gap-2 text-xs text-gray-600 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requestSample}
                        onChange={(e) => setFormData({ ...formData, requestSample: e.target.checked })}
                        className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
                      />
                      <span>{isRtl ? 'درخواست نمونه فیزیکی متریال' : 'Request physical material sample'}</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-gray-600 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requestQuote}
                        onChange={(e) => setFormData({ ...formData, requestQuote: e.target.checked })}
                        className="w-3.5 h-3.5 rounded accent-[#26B6B6]"
                      />
                      <span>{isRtl ? 'درخواست قیمت پروژه و شرایط تحویل' : 'Request quote & construction discount'}</span>
                    </label>
                  </div>

                  <textarea
                    required
                    rows={3}
                    placeholder={isRtl ? 'پیام یا الزامات خاص ابعادی پروژه شما...' : 'Describe project specifications or custom dimension needs...'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#26B6B6] hover:bg-[#1e9494] text-white py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  {t('sendInquiry')}
                </button>

              </form>
            )}
          </div>

        </div>

      </div>

      {/* Related / Similar Products */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-gray-800">
            {t('relatedObjects')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(item => {
              const rTitle = isRtl ? item.titleFa : item.titleEn;
              return (
                <div 
                  key={item.id}
                  onClick={() => onSelectObject(item)}
                  className="bg-white border border-gray-100 hover:border-[#26B6B6]/30 rounded-xl p-3 flex gap-3 cursor-pointer group transition-all"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={rTitle}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#26B6B6] transition-colors line-clamp-2 leading-snug">
                      {rTitle}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono">LOD {item.lod}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
