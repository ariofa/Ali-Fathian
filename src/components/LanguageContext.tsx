import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
  formatNumber: (n: number) => string;
  formatCurrency: (n: number) => string;
}

const translations: Record<string, { fa: string; en: string }> = {
  // Brand
  brandName: { fa: 'IranBIMhub', en: 'IranBIMhub' },
  brandTagline: { fa: 'اولین مرجع تخصصی آبجکت‌های بیم و کاتالوگ سازندگان در صنعت ساختمان ایران', en: 'The first dedicated BIM object marketplace and manufacturer showcase for the Iranian AEC industry' },
  
  // Nav
  home: { fa: 'صفحه اصلی', en: 'Home' },
  categories: { fa: 'دسته‌بندی‌ها', en: 'Categories' },
  manufacturers: { fa: 'تولیدکنندگان', en: 'Manufacturers' },
  forManufacturers: { fa: 'تولیدکنندگان', en: 'For Manufacturers' },
  compare: { fa: 'مقایسه محصولات', en: 'Compare' },
  aboutUs: { fa: 'درباره ما', en: 'About Us' },
  blog: { fa: 'مجله آموزشی', en: 'Resources & Blog' },
  contact: { fa: 'تماس و پشتیبانی', en: 'Contact & Support' },
  login: { fa: 'ورود', en: 'Login' },
  register: { fa: 'ثبت‌نام', en: 'Register' },
  modelerDashboard: { fa: 'پنل طراحان', en: 'Modeler Panel' },
  manufacturerDashboard: { fa: 'پنل تولیدکننده', en: 'Manufacturer Panel' },
  logout: { fa: 'خروج', en: 'Logout' },
  
  // Hero
  heroTitle: { fa: 'طراحی هوشمند با کتابخانه جامع آبجکتهای BIM واقعی ایرانی', en: 'Smart Design with the Comprehensive Library of Real Iranian BIM Objects' },
  heroSubtitle: { fa: 'هزاران آبجکت BIM از برندهای معتبر ایرانی برای معماران و مهندسان', en: 'Thousands of BIM objects from reliable Iranian brands for architects and engineers' },
  searchPlaceholder: { fa: 'جستجوی در و پنجره، پکیج، شیرآلات، برند یا محصول...', en: 'Search doors, HVAC, faucets, brands, or products...' },
  allCategories: { fa: 'همه دسته‌بندی‌ها', en: 'All Categories' },
  allFormats: { fa: 'تمامی فرمت‌ها', en: 'All Formats' },
  allLods: { fa: 'تمامی سطوح توسعه LOD', en: 'All LOD Levels' },
  
  // Home Sections
  browseByCategory: { fa: 'مرور بر اساس دسته‌بندی موضوعی', en: 'Browse by Technical Category' },
  trustedPartners: { fa: 'برندهای معتبر صنعتی عضو شده', en: 'Verified Manufacturer Partners' },
  trustedPartnersSub: { fa: 'شرکت‌های تولیدی برتر ایرانی که کاتالوگ رسمی BIM خود را منتشر کرده‌اند', en: 'Leading Iranian building manufacturers who publish their certified digital catalogs here' },
  newAndTrending: { fa: 'جدیدترین و پردانلودترین آبجکت‌ها', en: 'New & Trending BIM Objects' },
  manufacturerPromoTitle: { fa: 'آیا تولیدکننده مصالح یا تجهیزات ساختمانی هستید؟', en: 'Are You a Building Product Manufacturer?' },
  manufacturerPromoDesc: { fa: 'کاتالوگ محصولات خود را به آبجکت‌های هوشمند BIM تبدیل کنید و مستقیماً در نقشه‌های فاز دو مهندسین معمار و سازه ایران حضور یابید. مشخص شدن در مدل یعنی فروش قطعی در کارگاه ساختمانی.', en: 'Convert your physical products into smart BIM families. Get discovered and specified directly inside the design stage of top Iranian projects. Getting specified means secured project sales.' },
  manufacturerPromoCTA: { fa: 'ثبت‌نام و آپلود کاتالوگ محصولات', en: 'Register & Upload Your Catalog' },
  testimonials: { fa: 'صدای کاربران و متخصصان صنعت', en: 'AEC Industry Testimonials' },
  
  // General Buttons / Labels
  download: { fa: 'دانلود فایل', en: 'Download File' },
  compareCheckbox: { fa: 'افزودن به مقایسه', en: 'Compare' },
  compareSelected: { fa: 'مقایسه موارد منتخب', en: 'Compare Selected' },
  clearCompare: { fa: 'پاک کردن لیست مقایسه', en: 'Clear Compare' },
  rating: { fa: 'امتیاز طراحان', en: 'User Rating' },
  formats: { fa: 'فرمت‌های موجود', en: 'Available Formats' },
  lod: { fa: 'سطح توسعه', en: 'LOD Level' },
  fileSize: { fa: 'حجم فایل', en: 'File Size' },
  certification: { fa: 'استانداردها و گواهی‌ها', en: 'Certifications' },
  origin: { fa: 'کشور سازنده', en: 'Origin' },
  originIran: { fa: 'تولید ملی ایران', en: 'Manufactured in Iran' },
  originImported: { fa: 'وارداتی', en: 'Imported' },
  hasCutsheet: { fa: 'کاتالوگ فنی پیوست', en: 'Datasheet Available' },
  hasSample: { fa: 'امکان درخواست نمونه فیزیکی', en: 'Physical Sample Available' },
  yes: { fa: 'بله', en: 'Yes' },
  no: { fa: 'خیر', en: 'No' },
  free: { fa: 'رایگان', en: 'Free' },
  paid: { fa: 'تجاری', en: 'Paid' },
  subscriptionOnly: { fa: 'مخصوص اعضا', en: 'Subscription-only' },
  toman: { fa: 'تومان', en: 'Tomans' },
  
  // Filter Sidebar
  filters: { fa: 'فیلترهای پیشرفته', en: 'Advanced Filters' },
  clearAll: { fa: 'حذف همه فیلترها', en: 'Clear All Filters' },
  sharedFilters: { fa: 'فیلترهای عمومی', en: 'Shared Filters' },
  specificFilters: { fa: 'فیلترهای اختصاصی این گروه', en: 'Technical Specifications' },
  softwareVersion: { fa: 'نسخه نرم‌افزار سازگار', en: 'Software Version' },
  priceType: { fa: 'نوع دسترسی / قیمت', en: 'Access & Pricing' },
  selectSubcategory: { fa: 'زیرمجموعه‌ها', en: 'Subcategories' },
  showResults: { fa: 'نمایش نتایج فیلتر شده', en: 'Show Filtered Results' },
  noProductsFound: { fa: 'هیچ آبجکتی با این مشخصات یافت نشد.', en: 'No BIM objects found matching your criteria.' },
  
  // Object Detail
  specifications: { fa: 'مشخصات فنی پارامتریک', en: 'Parametric Specifications' },
  description: { fa: 'توضیحات و کاربرد', en: 'Description & Application' },
  relatedObjects: { fa: 'محصولات مشابه و مرتبط', en: 'Related BIM Objects' },
  contactManufacturer: { fa: 'ارتباط مستقیم با تولیدکننده', en: 'Contact Manufacturer' },
  contactFormTitle: { fa: 'درخواست اطلاعات فنی، نمونه فیزیکی یا قیمت پروژه', en: 'Request Pricing, Catalog, or Physical Sample' },
  contactSuccess: { fa: 'پیام شما با موفقیت ارسال شد. کارشناسان فنی شرکت در اسرع وقت با شما تماس خواهند گرفت.', en: 'Your inquiry has been sent successfully. The manufacturer will contact you shortly.' },
  sendInquiry: { fa: 'ارسال درخواست استعلام', en: 'Send Technical Inquiry' },
  
  // Manufacturer Landing & Onboarding
  mLandingTitle: { fa: 'نمایش و فروش کاتالوگ محصولات شما در پروژه‌های بزرگ کشور', en: 'Get Specified in Iran’s Top Construction Projects' },
  mLandingSubtitle: { fa: 'بزرگترین پلتفرم تخصصی معرفی و دانلود آبجکت‌های BIM برای مهندسان مشاور، معماران و مجریان ساخت و ساز در ایران.', en: 'The central digital warehouse where Iranian engineering firms find, specify, and procure local building components.' },
  pricingTiers: { fa: 'طرح‌های عضویت و آبونمان تولیدکنندگان', en: 'Manufacturer Subscription Tiers' },
  featuresComparison: { fa: 'جدول مقایسه امکانات طرح‌ها', en: 'Plan Comparison' },
  registerAsManufacturer: { fa: 'ثبت‌نام تولیدکننده جدید', en: 'Register as a Manufacturer' },
  registerAsModeler: { fa: 'ثبت‌نام معمار / طراح (رایگان)', en: 'Register as an Architect/Modeler' },
  
  // Form fields
  fullName: { fa: 'نام و نام خانوادگی', en: 'Full Name' },
  companyName: { fa: 'نام شرکت / کارخانه', en: 'Company / Factory Name' },
  emailAddress: { fa: 'آدرس ایمیل', en: 'Email Address' },
  phoneNumber: { fa: 'شماره تماس', en: 'Phone Number' },
  password: { fa: 'رمز عبور', en: 'Password' },
  websiteUrl: { fa: 'وب‌سایت رسمی', en: 'Official Website' },
  manufacturerLogo: { fa: 'آپلود لوگوی شرکت', en: 'Upload Company Logo' },
  shortDescription: { fa: 'معرفی کوتاه شرکت (فارسی و انگلیسی)', en: 'Short Company Intro (FA & EN)' },
  selectTier: { fa: 'انتخاب طرح عضویت', en: 'Select Membership Plan' },
  submitOnboarding: { fa: 'تکمیل ثبت‌نام و ورود به پنل مدیریت', en: 'Complete Registration & Access Dashboard' },
  
  // Wizard Upload
  uploadWizardTitle: { fa: 'بارگذاری آبجکت BIM جدید در پورتال IranBIMhub', en: 'Upload New BIM Object to IranBIMhub' },
  uploadWizardStep1: { fa: '۱. فایل و اطلاعات پایه', en: '1. File & Basic Info' },
  uploadWizardStep2: { fa: '۲. مشخصات فنی اختصاصی', en: '2. Technical Parameters' },
  uploadWizardStep3: { fa: '۳. انتشار کاتالوگ دیجیتال', en: '3. Publish Object' },
  fileSelectorLabel: { fa: 'فایل خانواده (RFA, RVT, GSM, IFC, STEP) را بکشید یا انتخاب کنید', en: 'Drag or select BIM Family file (RFA, RVT, GSM, IFC, STEP)' },
  photoSelectorLabel: { fa: 'تصویر پیش‌نمایش رندر شده سه بعدی محصول', en: 'Upload high-res 3D rendered preview photo' },
  objectTitleFa: { fa: 'عنوان محصول (به فارسی)', en: 'Product Title (in Persian)' },
  objectTitleEn: { fa: 'عنوان محصول (به انگلیسی)', en: 'Product Title (in English)' },
  objectDescFa: { fa: 'توضیحات و ویژگی‌های کاربردی (به فارسی)', en: 'Description & Applications (in Persian)' },
  objectDescEn: { fa: 'توضیحات و ویژگی‌های کاربردی (به انگلیسی)', en: 'Description & Applications (in English)' },
  step2Directions: { fa: 'مشخصات فنی و فیلترهای پارامتریک را جهت جستجوی دقیق معماران تکمیل کنید:', en: 'Fill out these parametric parameters so engineers can filter your product accurately:' },
  publishSuccess: { fa: 'تبریک! آبجکت بیم شما با موفقیت ثبت، پردازش و در مارکت IranBIMhub منتشر شد.', en: 'Success! Your BIM object has been processed, verified, and published on IranBIMhub.' },
  uploadMore: { fa: 'بارگذاری محصول جدید دیگر', en: 'Upload Another Product' },
  
  // Dashboards
  views: { fa: 'تعداد کل بازدیدها', en: 'Total Views' },
  downloads: { fa: 'تعداد کل دانلودها', en: 'Total Downloads' },
  leads: { fa: 'سرنخ‌های فروش و پیام‌ها', en: 'Total CRM Inquiries' },
  myCatalog: { fa: 'مدیریت کاتالوگ محصولات', en: 'My Product Catalog' },
  analyticsOverview: { fa: 'گزارش و آمارهای بازدید', en: 'Analytics Overview' },
  contactInquiries: { fa: 'پیام‌های دریافتی از طراحان', en: 'Inquiries from Architects' },
  subscriptionStatus: { fa: 'وضعیت اشتراک', en: 'Subscription Status' },
  noInquiries: { fa: 'هنوز پیامی دریافت نشده است.', en: 'No messages received yet.' },
  favorites: { fa: 'آبجکت‌های نشان‌شده شما', en: 'Your Saved Collections' },
  downloadHistory: { fa: 'تاریخچه دانلودهای شما', en: 'Your Download History' },
  noFavorites: { fa: 'هنوز هیچ آبجکتی را نشان نکرده‌اید.', en: 'You have not saved any objects yet.' },
  noDownloads: { fa: 'هنوز فایلی دانلود نکرده‌اید.', en: 'You have not downloaded any files yet.' },
  sortBy: { fa: 'مرتب‌سازی', en: 'Sort By' },
  newest: { fa: 'جدیدترین', en: 'Newest' },
  popularity: { fa: 'پرتکرارترین دانلود', en: 'Most Downloaded' },
  alpha: { fa: 'محبوب‌ترین', en: 'Most Popular' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('iranbimhub_lang');
    return (saved as Language) || 'fa'; // Persian is default
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('iranbimhub_lang', lang);
  };

  const isRtl = language === 'fa';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  const t = (key: string): string => {
    const term = translations[key];
    if (!term) return key;
    return isRtl ? term.fa : term.en;
  };

  const formatNumber = (n: number): string => {
    if (isRtl) {
      return n.toLocaleString('fa-IR');
    }
    return n.toLocaleString('en-US');
  };

  const formatCurrency = (n: number): string => {
    if (isRtl) {
      return `${(n).toLocaleString('fa-IR')} تومان`;
    }
    return `$${n.toLocaleString('en-US')}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl, formatNumber, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
