import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  PhoneCall, 
  Building2, 
  TrendingUp, 
  Users, 
  Award, 
  FileCheck,
  Send,
  Zap,
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface ForManufacturersViewProps {
  onNavigate: (view: string, customTextFa?: string, customTextEn?: string, param?: string) => void;
  onOpenAuthModal: () => void;
  currentUser: any;
}

export const ForManufacturersView: React.FC<ForManufacturersViewProps> = ({
  onNavigate,
  onOpenAuthModal,
  currentUser
}) => {
  const { language, isRtl } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [compareTab, setCompareTab] = useState<'free' | 'premium' | 'vip'>('premium');
  
  // Callback form states
  const [callbackName, setCallbackName] = useState('');
  const [callbackCompany, setCallbackCompany] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  const handleRegisterBrand = () => {
    // If user is already logged in, go straight to onboarding or dashboard
    if (currentUser) {
      const savedProfile = localStorage.getItem('iranbimhub_mfg_profile');
      if (savedProfile) {
        onNavigate('manufacturer-dashboard');
      } else {
        onNavigate('manufacturer-onboarding');
      }
    } else {
      // If not logged in, we can let them open auth modal or direct to onboarding
      onNavigate('manufacturer-onboarding');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone) return;
    setCallbackSubmitted(true);
  };

  const steps = [
    {
      num: '۱',
      numEn: '1',
      titleFa: 'ثبت پروفایل رایگان برند',
      titleEn: 'Create Free Brand Profile',
      descFa: 'مشخصات رسمی شرکت، کاتالوگ‌های چاپی، آدرس وب‌سایت و اطلاعات تماس خود را در کمتر از ۵ دقیقه ثبت کنید.',
      descEn: 'Register company details, print catalogs, office website, and coordinate channels in less than 5 minutes.'
    },
    {
      num: '۲',
      numEn: '2',
      titleFa: 'بارگذاری فایل‌های BIM',
      titleEn: 'Upload BIM Files & Catalogs',
      descFa: 'آبجکت‌های پارامتریک (Revit یا IFC) خود را بارگذاری کنید. در صورت نیاز، ما شما را به دفاتر مدلسازی تاییدشده معرفی می‌کنیم.',
      descEn: 'Upload standard parametric files (RFA/IFC). If you do not have digital files yet, we connect you to certified modeling partners.'
    },
    {
      num: '۳',
      numEn: '3',
      titleFa: 'دیده شدن و دریافت سرنخ خرید',
      titleEn: 'Get Discovered & Capture Leads',
      descFa: 'محصولات شما در موتورهای فیلتر طراحان قرار می‌گیرد. به ازای هر دانلود فمیلی، مستقیماً اطلاعات تماس شرکت‌ها را دریافت نمایید.',
      descEn: 'Your digital inventory lands directly on builders specifiers. Access instant lead contacts and downloads analytics.'
    }
  ];

  const valuePillars = [
    {
      icon: <Users className="w-5 h-5 text-[#26B6B6]" />,
      titleFa: 'دیده شدن هدفمند در فاز صفر',
      titleEn: 'Targeted Specifier Placement',
      descFa: 'طراحان و مشاوران پروژه‌های عمرانی کلان در فاز صفر (طراحی مفهومی) آبجکت محصولات شما را در نرم‌افزارهای خود استفاده کرده و در متره و برآورد پیوست می‌کنند.',
      descEn: 'AEC consultants place your precise Revit and IFC models during conceptual draft phases, locking your brand into final procurement spec sheets.'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-[#26B6B6]" />,
      titleFa: 'سرنخ‌های قطعی و گرم خرید',
      titleEn: 'Hot B2B Purchase Leads',
      descFa: 'تلفن و ایمیل مدیران فنی شرکت‌های پیمانکاری که کاتالوگ یا فمیلی شما را دانلود کرده‌اند، بلافاصله در کارتابل فروش شما به عنوان درخواست رسمی ثبت می‌شود.',
      descEn: 'Access the name, firm, and phone details of contractors downloading your families. Move from cold calls to highly context-driven commercial sales.'
    },
    {
      icon: <Award className="w-5 h-5 text-[#26B6B6]" />,
      titleFa: 'اثبات کیفیت و ارتقای اعتبار',
      titleEn: 'Premium Brand Authorization',
      descFa: 'با داشتن گواهی ارزیابی ایران‌بیم‌هاب، محصولات شما به عنوان اقلام منطبق بر استانداردهای حریق و مبحث ۱۹ شناخته شده و تاییدیه کارفرما را با سرعت دریافت می‌کنند.',
      descEn: 'Verified BIM badges certify your physical product complies with localized building regulations, easing general contractor submittals.'
    }
  ];

  const faqItems = [
    {
      qFa: 'آیا امنیت اطلاعات کارخانه و فرمول‌های محصولات ما حفظ می‌شود؟',
      qEn: 'Is our company catalog and proprietary data secure?',
      aFa: 'کاملاً. فایل‌های قرار گرفته بر روی پلتفرم صرفاً کدهای هندسی پارامتریک خارجی و کاتالوگ‌های عمومی معرفی محصول هستند؛ هیچ اطلاعات محرمانه یا نقشه‌های فرآیند ساخت کارخانه روی بستر قرار نمی‌گیرد.',
      aEn: 'Absolutely. Models published only reflect external spatial bounds, parametric connections, and general dimensions. No proprietary design calculations or factory workflows are stored.'
    },
    {
      qFa: 'محصولات ما چگونه بررسی و تایید می‌شوند؟',
      qEn: 'How are our digital objects audited and approved?',
      aFa: 'پس از بارگذاری کاتالوگ، کارشناسان ارشد دپارتمان ارزیابی فنی ما انطباق هندسی و صحت متادیتاها را مطابق با کدهای ملی بررسی کرده و نشان تایید رسمی را ظرف ۴۸ ساعت روی برند شما فعال می‌کنند.',
      aEn: 'Once uploaded, our expert engineering team audits your family files for spatial accuracy, file limits, and parameter settings. A verification badge is issued within 48 business hours.'
    },
    {
      qFa: 'اگر در آینده اشتراک را لغو کنیم چه می‌شود؟',
      qEn: 'What happens if we cancel or downgrade our subscription?',
      aFa: 'هیچ مشکلی وجود ندارد. شما همواره به طرح پایه و رایگان خود دسترسی خواهید داشت؛ فمیلی‌های بارگذاری شده حذف نخواهند شد، فقط تعداد سرنخ‌های پیشرفته و جزئیات آماری پانل شما محدود می‌گردد.',
      aEn: 'There is no locked-in contract. If you downgrade, your brand moves back to the free tier. Your published files remain active for downloads, while advanced leads and deep dashboard analytics are restricted.'
    },
    {
      qFa: 'تعرفه‌ها و سیستم پرداخت به چه صورتی است؟',
      qEn: 'How is billing and billing cycles processed?',
      aFa: 'پرداخت‌ها به صورت سالانه یا فصلی و به ریال/تومان انجام می‌شوند. شرکت‌ها فاکتور رسمی معتبر دریافت می‌کنند که جزئیات مالیات بر ارزش افزوده در آن کاملاً ثبت و شفاف است.',
      aEn: 'Subscriptions are billed on quarterly or annual cycles with full legal invoicing (with standard local taxation transparency) processed directly via corporate accounts.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFC] dark:bg-gray-950 transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION (Conversion focused, de-risking) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2326] via-[#2F3539] to-[#3B4247] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-start">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#26B6B6]/15 border border-[#26B6B6]/20 rounded-full text-[11px] font-bold text-[#26B6B6]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRtl ? 'بزرگترین هاب تامین دیجیتال مصالح ساختمان و پروژه‌های بزرگ کشور' : 'Irans Largest Digital Building Components Hub & Specification Database'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
              {isRtl ? 'برند شما، وارد پروژه‌های واقعی ساختمانی ایران شود' : 'Your Brand, Specified into Real Iranian Construction Projects'}
            </h1>
            
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl">
              {isRtl 
                ? 'مهندسان مشاور و آرشیتکت‌های تراز اول کشور روزانه هزاران نقشه را در محیط مدل‌سازی اطلاعات ساختمان (BIM) ترسیم می‌کنند. اگر فمیلی محصولات کارخانه شما در پلتفرم وجود نداشته باشد، محصولات رقبای شما جایگزین می‌شوند. حضور خود را بیمه کنید.'
                : 'Top-tier architects and consultants generate thousands of drawings daily in standard BIM interfaces. If your product specs are missing, competitors get written into the blueprints. Protect your pipeline today.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleRegisterBrand}
                className="px-8 py-3.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-98 shadow-md shadow-[#26B6B6]/20 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'ثبت‌نام رایگان پروفایل برند' : 'Register Your Brand Free'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
              
              <a
                href="#callback-section"
                className="px-8 py-3.5 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isRtl ? 'درخواست تماس مشاوران' : 'Request Consult Callback'}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm space-y-4 text-start hidden lg:block">
            <h3 className="font-extrabold text-sm text-[#26B6B6] flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5" />
              <span>{isRtl ? 'شاخص‌های بازار ایران‌بیم‌هاب' : 'Market Metrics'}</span>
            </h3>
            <div className="divide-y divide-white/10 space-y-3.5 text-xs font-light">
              <div className="pt-3 flex justify-between">
                <span className="text-gray-300">{isRtl ? 'کاربران مشاور و طراح فعال:' : 'Active Specifiers & Architects:'}</span>
                <span className="font-bold text-[#26B6B6]">۱۲,۵۰۰+</span>
              </div>
              <div className="pt-3 flex justify-between">
                <span className="text-gray-300">{isRtl ? 'دانلود ماهانه کاتالوگ‌ها:' : 'Monthly BIM Downloads:'}</span>
                <span className="font-bold text-[#26B6B6]">۴۵,۰۰۰+</span>
              </div>
              <div className="pt-3 flex justify-between">
                <span className="text-gray-300">{isRtl ? 'برندهای Verification شده:' : 'Verified Industrial Brands:'}</span>
                <span className="font-bold text-[#26B6B6]">۴۸ برند ملی</span>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. THE OPPORTUNITY, NAMED HONESTLY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-start">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-black text-[#26B6B6] uppercase tracking-wider">
              {isRtl ? 'واقعیت بازار مدرن ساختمان' : 'The Reality of Modern Construction'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white leading-tight">
              {isRtl ? 'طراحان بر اساس مدل تصمیم می‌گیرند؛ بدون فایل مدل، برند شما نامرئی است' : 'Architects Design with Living Data; Without BIM, You Are Invisible'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              {isRtl 
                ? 'امروزه مهندسان دیگر تمایلی به استفاده از کاتالوگ‌های سنتی PDF و تماس‌های طولانی برای استعلام ابعاد محصولات ندارند. آن‌ها مستقیماً آبجکت‌های آماده، سه‌بعدی و هوشمند را جستجو کرده و در نقشه نهایی پروژه جایگذاری می‌کنند. سازمانی که مدل‌های بیم رسمی خود را رایگان در اختیار طراح قرار می‌دهد، قبل از رسیدن کارگاه به خرید، قرارداد تامین مصالح خود را محکم کرده است.'
                : 'Today, engineering consultancies have abandoned print catalog binders and long sales calls. Instead, they drag and drop pre-certified, standard-sized digital equivalents into plans. Brands offering standard, accurate BIM catalogs secure their specify positions long before actual buying bids even open on site.'
              }
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              {isRtl 
                ? 'این به معنای تفاوت تکراری بین گرفتن پروژه‌های کلان یا باختن رقابت به تولیدکنندگانی است که گامی کوچک در مسیر دیجیتال‌سازی زنجیره تامین مصالح خود برداشته‌اند.'
                : 'It is the definitive differentiator between locking in multi-million contracts or trailing behind brands that digitize their supply chain interfaces.'
              }
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-video rounded-3xl overflow-hidden border border-gray-150 dark:border-gray-800 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80" 
              alt="Industrial manufacturing plant with high standards" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS (Adapts to vertical on mobile, horizontal on desktop) */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-150 dark:border-gray-800 py-16 px-4 sm:px-6 lg:px-8 text-start">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
              {isRtl ? 'فرآیند ثبت و انتشار محصولات کالا در ۳ گام ساده' : 'Brand Deployment in 3 Simple Steps'}
            </h2>
            <p className="text-xs text-gray-400">
              {isRtl ? 'ما فرآیند را برای کارخانجات تسهیل کرده‌ایم؛ بدون چالش‌های اداری یا فنی.' : 'We have de-cluttered the process, removing corporate friction.'}
            </p>
          </div>

          {/* Desktop flow (Horizontal) / Mobile flow (Vertical Stepper) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-gray-950 p-6 rounded-2xl relative border border-slate-100 dark:border-gray-850 flex flex-col items-start space-y-4"
              >
                {/* Connector line for desktop */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 left-0 translate-x-1/2 w-full h-[1px] bg-gray-250 dark:bg-gray-800 z-0"></div>
                )}
                
                <div className="w-10 h-10 rounded-full bg-[#26B6B6] text-white flex items-center justify-center font-black text-sm z-10 shadow-md shadow-[#26B6B6]/15">
                  {isRtl ? step.num : step.numEn}
                </div>
                
                <div className="space-y-1.5 text-start">
                  <h4 className="text-xs font-black text-gray-800 dark:text-white">
                    {isRtl ? step.titleFa : step.titleEn}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                    {isRtl ? step.descFa : step.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-start">
        <div className="space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black text-[#26B6B6] uppercase tracking-wider">
              {isRtl ? 'مزایای تحول دیجیتال برند شما' : 'Key Pillars of Value'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
              {isRtl ? 'چرا کارخانجات برتر روی ایران‌بیم‌هاب سرمایه‌گذاری می‌کنند؟' : 'Why Leading Manufacturers Partner with Us'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valuePillars.map((pillar, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-2xs space-y-4 text-start"
              >
                <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="text-xs font-bold text-gray-800 dark:text-white">
                  {isRtl ? pillar.titleFa : pillar.titleEn}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                  {isRtl ? pillar.descFa : pillar.descEn}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. SUBSCRIPTION TIERS COMPARISON (Recommended highlighted) */}
      <section className="bg-slate-100/50 dark:bg-gray-900/30 border-y border-gray-200/50 dark:border-gray-850 py-16 px-4 sm:px-6 lg:px-8 text-start">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black text-[#26B6B6] uppercase tracking-wider">
              {isRtl ? 'تعرفه‌های عضویت سازمانی' : 'Subscription Packages'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
              {isRtl ? 'طرح اشتراک برند خود را انتخاب کنید' : 'Transparent Pricing for Enterprise Brands'}
            </h2>
            <p className="text-xs text-gray-400">
              {isRtl ? 'بدون هزینه‌های مخفی، شروع کار همواره با تعرفه رایگان امکان‌پذیر است.' : 'No hidden commission fees. Get started completely free.'}
            </p>
          </div>

          {/* Desktop comparison table */}
          <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl shadow-xs">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="p-4 text-start font-bold text-gray-800 dark:text-white w-2/5">{isRtl ? 'امکانات پنل سازمانی' : 'Features & Corporate Tools'}</th>
                  <th className="p-4 text-center font-bold text-gray-500 dark:text-gray-400 w-1/5">{isRtl ? 'پایه (رایگان)' : 'Base (Free)'}</th>
                  <th className="p-4 text-center font-extrabold text-[#26B6B6] w-1/5 bg-[#26B6B6]/5 border-x border-[#26B6B6]/20">{isRtl ? 'ممتاز (Premium)' : 'Premium Plan'}</th>
                  <th className="p-4 text-center font-bold text-slate-800 dark:text-white w-1/5">{isRtl ? 'ویژه (VIP)' : 'VIP Plan'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'حداکثر تعداد مدل‌ها در کاتالوگ' : 'Maximum catalog limit'}</td>
                  <td className="p-4 text-center text-gray-500">{isRtl ? 'تا ۳ محصول' : 'Up to 3 objects'}</td>
                  <td className="p-4 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5 border-x border-[#26B6B6]/20">{isRtl ? 'تا ۱۵ محصول' : 'Up to 15 objects'}</td>
                  <td className="p-4 text-center text-gray-700 dark:text-gray-300">{isRtl ? 'نامحدود' : 'Unlimited'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'دریافت سرنخ خرید تماس دانلودها' : 'AEC download lead contacts'}</td>
                  <td className="p-4 text-center text-gray-400 font-light">{isRtl ? 'تعداد محدود و کلی' : 'Generic counts only'}</td>
                  <td className="p-4 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5 border-x border-[#26B6B6]/20">{isRtl ? 'کامل (نام، تلفن، ایمیل)' : 'Full lead details'}</td>
                  <td className="p-4 text-center text-gray-700 dark:text-gray-300">{isRtl ? 'کامل + پیامرسانی داخلی' : 'Full + direct message'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'عمق آمار و تحلیل کاتالوگ' : 'Catalog analytics & metrics'}</td>
                  <td className="p-4 text-center text-gray-400 font-light">{isRtl ? 'آمار کل ماهانه' : 'Monthly totals'}</td>
                  <td className="p-4 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5 border-x border-[#26B6B6]/20">{isRtl ? 'پیشرفته روزانه و تفکیکی' : 'Daily & category breakdown'}</td>
                  <td className="p-4 text-center text-gray-700 dark:text-gray-300">{isRtl ? 'تحلیل با هوش مصنوعی هاب' : 'Predictive AI forecasting'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'نمایش برجسته در کاتالوگ عمومی' : 'Featured catalog listings'}</td>
                  <td className="p-4 text-center text-gray-400 font-light">✕</td>
                  <td className="p-4 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5 border-x border-[#26B6B6]/20">{isRtl ? 'دسته مربوطه اولویت متوسط' : 'Medium priority boost'}</td>
                  <td className="p-4 text-center text-gray-700 dark:text-gray-300">{isRtl ? 'صفحه اصلی و دسته اولویت بالا' : 'Homepage spotlight'}</td>
                </tr>
                <tr className="bg-gray-50/30 dark:bg-gray-900/30">
                  <td className="p-5 font-extrabold text-gray-800 dark:text-white">{isRtl ? 'تعرفه عضویت سازمانی' : 'Corporate Tariff'}</td>
                  <td className="p-5 text-center font-bold text-gray-500">{isRtl ? 'رایگان همیشگی' : 'Free Forever'}</td>
                  <td className="p-5 text-center font-black text-[#26B6B6] bg-[#26B6B6]/10 text-xs border-x border-[#26B6B6]/20">
                    {isRtl ? '۲,۹۰۰,۰۰۰ تومان / فصل' : '2.9M Toman / quarter'}
                  </td>
                  <td className="p-5 text-center font-black text-gray-800 dark:text-gray-100">
                    {isRtl ? '۷,۹۰۰,۰۰۰ تومان / سال' : '7.9M Toman / year'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile responsive active tier view */}
          <div className="sm:hidden space-y-4">
            <div className="flex border border-gray-250 dark:border-gray-800 rounded-xl p-1 bg-white dark:bg-gray-900">
              <button
                onClick={() => setCompareTab('free')}
                className={`flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg cursor-pointer ${
                  compareTab === 'free' ? 'bg-[#26B6B6] text-white' : 'text-gray-500'
                }`}
              >
                {isRtl ? 'رایگان' : 'Free'}
              </button>
              <button
                onClick={() => setCompareTab('premium')}
                className={`flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg cursor-pointer ${
                  compareTab === 'premium' ? 'bg-[#26B6B6] text-white' : 'text-gray-500'
                }`}
              >
                {isRtl ? 'ممتاز' : 'Premium'}
              </button>
              <button
                onClick={() => setCompareTab('vip')}
                className={`flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg cursor-pointer ${
                  compareTab === 'vip' ? 'bg-[#26B6B6] text-white' : 'text-gray-500'
                }`}
              >
                {isRtl ? 'ویژه VIP' : 'VIP'}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl space-y-4">
              {compareTab === 'free' && (
                <>
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2">
                    <span className="font-bold text-xs text-gray-800 dark:text-white">{isRtl ? 'پایه سازمانی' : 'Free Base'}</span>
                    <span className="text-[10px] text-gray-400">{isRtl ? 'رایگان همیشگی' : 'Free Forever'}</span>
                  </div>
                  <ul className="space-y-1.5 text-[10px] text-gray-500">
                    <li>• {isRtl ? 'کاتالوگ حداکثر ۳ محصول' : 'Up to 3 products'}</li>
                    <li>• {isRtl ? 'سرنخ‌های خام دانلودها' : 'Basic download counters'}</li>
                    <li>• {isRtl ? 'آمار ماهانه محدود' : 'Monthly totals only'}</li>
                  </ul>
                  <button onClick={handleRegisterBrand} className="w-full py-2 bg-slate-100 text-gray-700 text-[10px] font-black rounded-lg cursor-pointer">
                    {isRtl ? 'ثبت رایگان برند' : 'Register Free'}
                  </button>
                </>
              )}
              {compareTab === 'premium' && (
                <>
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2">
                    <span className="font-bold text-xs text-[#26B6B6]">{isRtl ? 'طرح ممتاز سازمانی' : 'Corporate Premium'}</span>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{isRtl ? '۲.۹ م تومان / فصل' : '2.9M Toman / qtr'}</span>
                  </div>
                  <ul className="space-y-1.5 text-[10px] text-gray-600 dark:text-gray-300">
                    <li>✓ {isRtl ? 'کاتالوگ ارتقایافته تا ۱۵ محصول' : 'Up to 15 products'}</li>
                    <li>✓ {isRtl ? 'دریافت سرنخ‌های کامل طراحان (نام، تلفن، ایمیل)' : 'Full specification contact details'}</li>
                    <li>✓ {isRtl ? 'آمار روزانه تفکیک‌شده و تحلیل جستجوها' : 'Daily searches and category logs'}</li>
                  </ul>
                  <button 
                    onClick={() => {
                      const savedProfile = localStorage.getItem('iranbimhub_mfg_profile');
                      if (savedProfile) {
                        onNavigate('payment', undefined, undefined, 'mfg-premium');
                      } else {
                        onNavigate('manufacturer-onboarding');
                      }
                    }} 
                    className="w-full py-2 bg-[#26B6B6] text-white text-[10px] font-black rounded-lg cursor-pointer"
                  >
                    {isRtl ? 'خرید اشتراک ممتاز' : 'Purchase Premium'}
                  </button>
                </>
              )}
              {compareTab === 'vip' && (
                <>
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2">
                    <span className="font-bold text-xs text-gray-800 dark:text-white">{isRtl ? 'طرح اختصاصی VIP' : 'Enterprise VIP'}</span>
                    <span className="text-[10px] font-extrabold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{isRtl ? '۷.۹ م تومان / سال' : '7.9M Toman / year'}</span>
                  </div>
                  <ul className="space-y-1.5 text-[10px] text-gray-600 dark:text-gray-300">
                    <li>✓ {isRtl ? 'تعداد کاتالوگ و فمیلی کاملاً نامحدود' : 'Unlimited catalogs'}</li>
                    <li>✓ {isRtl ? 'سرنخ‌های مستقیم هوشمند به اضافه پیامرسان' : 'Leads + custom communications'}</li>
                    <li>✓ {isRtl ? 'موقعیت ویژه در صفحه اصلی و نتایج جستجو' : 'Homepage spotlight placements'}</li>
                  </ul>
                  <button 
                    onClick={() => {
                      const savedProfile = localStorage.getItem('iranbimhub_mfg_profile');
                      if (savedProfile) {
                        onNavigate('payment', undefined, undefined, 'mfg-vip');
                      } else {
                        onNavigate('manufacturer-onboarding');
                      }
                    }} 
                    className="w-full py-2 bg-gray-800 text-white text-[10px] font-black rounded-lg cursor-pointer"
                  >
                    {isRtl ? 'خرید اشتراک ویژه' : 'Purchase VIP'}
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 6. FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-start space-y-8">
        <div className="text-center">
          <HelpCircle className="w-8 h-8 text-[#26B6B6] mx-auto mb-2" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
            {isRtl ? 'سوالات متداول کارخانجات' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const q = isRtl ? faq.qFa : faq.qEn;
            const a = isRtl ? faq.aFa : faq.aEn;

            return (
              <div 
                key={idx}
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
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

      {/* 7. HIGH-TOUCH CALLBACK OPTION FORM */}
      <section id="callback-section" className="max-w-xl mx-auto px-4 py-12 text-start">
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="font-black text-lg text-gray-800 dark:text-white flex items-center gap-1.5">
              <PhoneCall className="w-5 h-5 text-[#26B6B6]" />
              <span>{isRtl ? 'درخواست مشاوره و ممیزی رایگان برند' : 'Request Callback Consultation'}</span>
            </h3>
            <p className="text-[11px] text-gray-400 font-light leading-relaxed">
              {isRtl 
                ? 'مایلید بدانید چطور می‌توانید مدل‌های BIM کاتالوگ برند خود را ایجاد کنید؟ شماره تماس خود را بگذارید تا کارشناس ارشد ما با شما تماس بگیرد.'
                : 'Want to understand how to digitize your active print product sheets? Leave coordinates, and our engineer will call you.'
              }
            </p>
          </div>

          {callbackSubmitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-5 rounded-2xl space-y-2 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="font-extrabold text-gray-800 dark:text-emerald-400 text-sm">
                {isRtl ? 'درخواست تماس شما با موفقیت ثبت شد' : 'Callback Logged Successfully'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                {isRtl 
                  ? `جناب آقای / سرکار خانم مهندس گرامی، درخواست شما به کارگروه ممیزی کارخانجات ارجاع داده شد. حداکثر طی ۲۴ ساعت کاری آینده با شما به شماره ${callbackPhone} تماس برقرار خواهد شد.`
                  : `Your request has been routed to our factory desk. We will establish contact with your office via ${callbackPhone} within 24 business hours.`
                }
              </p>
              <button 
                onClick={() => {
                  setCallbackSubmitted(false);
                  setCallbackName('');
                  setCallbackCompany('');
                  setCallbackPhone('');
                }}
                className="text-[#26B6B6] font-bold mt-2 hover:underline cursor-pointer"
              >
                {isRtl ? 'ثبت درخواست جدید' : 'Submit another inquiry'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleCallbackSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'نام و نام خانوادگی' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'مثال: مهندس رامین خسروی' : 'e.g. Ramin Khosravi'}
                  value={callbackName}
                  onChange={(e) => setCallbackName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'نام شرکت / کارخانه صنعتی' : 'Company / Factory Name'}</label>
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'مثال: صنایع لوله و اتصالات سهند' : 'e.g. Sahand Pipes & Valves'}
                  value={callbackCompany}
                  onChange={(e) => setCallbackCompany(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'شماره تلفن مستقیم همراه یا ثابت' : 'Phone / Mobile Number'}</label>
                <input
                  type="text"
                  required
                  placeholder="09123456789"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isRtl ? 'ارسال درخواست تماس مهندسی' : 'Dispatch Consult Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 8. FINAL CTA + PERSISTENT BOTTOM BAR */}
      <section className="bg-gradient-to-br from-[#464E56] to-[#1E2326] text-white py-16 px-4 sm:px-6 lg:px-8 text-center rounded-t-[40px]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
            {isRtl ? 'با ثبت رایگان کاتالوگ دیجیتال خود شروع کنید' : 'Establish Your Digital BIM Specifications Today'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto">
            {isRtl 
              ? 'حضور در کارپوشه طراحان تراز اول ایران‌بیم‌هاب ریسکی ندارد. همین امروز حساب تجاری برند خود را بدون پرداخت هیچ مبلغی بسازید.'
              : 'There is no risk to putting your products on Irans premier AEC specification list. Set up your brand account for free today.'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={handleRegisterBrand}
              className="px-8 py-3.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer text-center"
            >
              {isRtl ? 'ثبت‌نام رایگان برند' : 'Register Brand Free'}
            </button>
            <a
              href="#callback-section"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{isRtl ? 'مشاوره تلفنی' : 'Phone Call Call'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* PERSISTENT STICKY CTA BAR FOR MOBILE PHONES */}
      <div className="fixed bottom-[56px] left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-150 dark:border-gray-800/80 py-2.5 px-4 flex items-center justify-between sm:hidden select-none">
        <div className="text-start">
          <p className="text-[10px] text-gray-400">{isRtl ? 'ثبت‌نام کاتالوگ' : 'Catalog Registration'}</p>
          <p className="text-[11px] font-black text-[#26B6B6]">{isRtl ? 'شروع رایگان' : 'Start Free'}</p>
        </div>
        <button
          onClick={handleRegisterBrand}
          className="px-4 py-2 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[11px] font-extrabold rounded-lg cursor-pointer"
        >
          {isRtl ? 'ثبت برند' : 'Register Brand'}
        </button>
      </div>

    </div>
  );
};
