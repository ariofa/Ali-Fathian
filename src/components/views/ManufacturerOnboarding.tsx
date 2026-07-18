import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Check, ArrowRight, ShieldCheck, TrendingUp, BarChart3, HelpCircle } from 'lucide-react';

interface ManufacturerOnboardingProps {
  onCompleteOnboarding: (data: {
    companyName: string;
    email: string;
    phone: string;
    website: string;
    desc: string;
    tier: 'Free' | 'Premium' | 'VIP';
  }) => void;
}

export const ManufacturerOnboarding: React.FC<ManufacturerOnboardingProps> = ({
  onCompleteOnboarding
}) => {
  const { language, t, isRtl } = useLanguage();

  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);

  // Load selectedPlan from draft if available
  const [selectedPlan, setSelectedPlan] = useState<'Free' | 'Premium' | 'VIP'>(() => {
    try {
      const saved = localStorage.getItem('manufacturer_onboarding_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedPlan) {
          const plan = parsed.selectedPlan;
          if (plan === 'Basic') return 'Free';
          if (plan === 'Professional') return 'Premium';
          if (plan === 'Enterprise') return 'VIP';
          return plan as 'Free' | 'Premium' | 'VIP';
        }
      }
    } catch (e) {
      console.error('Error loading onboarding draft plan', e);
    }
    return 'Free';
  });

  // Load formData from draft if available
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('manufacturer_onboarding_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          return parsed.formData;
        }
      }
    } catch (e) {
      console.error('Error loading onboarding draft', e);
    }
    return {
      companyName: '',
      email: '',
      phone: '',
      website: '',
      desc: '',
      contactName: '',
      password: ''
    };
  });

  // Keep track of whether we restored a draft to show a user notice
  const [hasRestoredDraft, setHasRestoredDraft] = useState(() => {
    try {
      const saved = localStorage.getItem('manufacturer_onboarding_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasData = parsed.formData && Object.values(parsed.formData).some(val => val !== '');
        return !!hasData;
      }
    } catch (e) {}
    return false;
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Auto-save draft on changes with debounce
  useEffect(() => {
    const hasData = Object.values(formData).some(val => val !== '');
    if (hasData) {
      setSaveStatus('saving');
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(
            'manufacturer_onboarding_draft',
            JSON.stringify({ formData, selectedPlan })
          );
          setSaveStatus('saved');
        } catch (e) {
          console.error('Error saving onboarding draft', e);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSaveStatus('idle');
    }
  }, [formData, selectedPlan]);

  // Handle clearing of draft data manually
  const handleClearDraft = () => {
    try {
      localStorage.removeItem('manufacturer_onboarding_draft');
    } catch (err) {}
    setFormData({
      companyName: '',
      email: '',
      phone: '',
      website: '',
      desc: '',
      contactName: '',
      password: ''
    });
    setSelectedPlan('Premium');
    setHasRestoredDraft(false);
    setSaveStatus('idle');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TIERS = [
    {
      id: 'Free' as const,
      nameFa: 'رایگان',
      nameEn: 'Free',
      priceFa: '۰ تومان',
      priceEn: '$0',
      periodFa: 'همیشگی',
      periodEn: 'Forever',
      featuresFa: [
        'بارگذاری تا سقف ۵ کالا',
        'فرمت‌های پایه (فقط Revit)',
        'گزارش آمار ماهانه بازدید و دانلود',
        'صندوق پیام اولیه بدون ارجاع خودکار',
      ],
      featuresEn: [
        'Upload up to 5 BIM objects',
        'Revit format only support',
        'Monthly views & downloads analytics',
        'Basic email/message portal',
      ],
      color: 'border-gray-200 bg-white'
    },
    {
      id: 'Premium' as const,
      nameFa: 'حرفه‌ای / ممتاز (Premium)',
      nameEn: 'Premium (Popular)',
      priceFa: '۴,۹۰۰,۰۰۰ تومان',
      priceEn: '$149',
      periodFa: 'ماهانه',
      periodEn: 'per month',
      featuresFa: [
        'بارگذاری تا سقف ۳۰ کالا',
        'پشتیبانی کامل از تمامی فرمت‌ها',
        'گزارش‌دهی آماری عمیق هفتگی',
        'نشان تاییدشده "Verified" در مارکت',
        'ابزار جذب لید هوشمند و ارسال نمونه',
      ],
      featuresEn: [
        'Upload up to 30 BIM objects',
        'Full file formats support',
        'Weekly deep analytics with lead tracking',
        '"Verified Partner" badge',
        'Material sample request features',
      ],
      color: 'border-[#26B6B6] bg-white ring-2 ring-[#26B6B6]/30 shadow-md'
    },
    {
      id: 'VIP' as const,
      nameFa: 'ویژه / سازمانی (VIP)',
      nameEn: 'VIP Unlimited',
      priceFa: '۱۲,۵۰۰,۰۰۰ تومان',
      priceEn: '$399',
      periodFa: 'ماهانه',
      periodEn: 'per month',
      featuresFa: [
        'بارگذاری نامحدود کالاها',
        'توسعه و بازبینی مدل‌ها توسط تیم مهندسی ما',
        'یکپارچگی کامل با CRM داخلی کارخانه',
        'جایگاه تبلیغاتی اول در نتایج جستجو',
        'پشتیبانی اختصاصی تلفنی ۲۴ ساعته',
      ],
      featuresEn: [
        'Unlimited object listings',
        'Professional family modeling support',
        'Direct API Integration with factory CRM',
        'Sponsored placement in search engine',
        'Dedicated account engineer 24/7',
      ],
      color: 'border-slate-800 bg-slate-900 text-white'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {onboardingStep === 1 ? (
        <>
          {/* Landing / Value proposition header */}
          <section className="text-center max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <span className="bg-[#26B6B6]/10 text-[#26B6B6] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {isRtl ? 'بستر معرفی کالا به جامعه مهندسی ایران' : 'Brand Specification Infrastructure'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#464E56] leading-tight">
              {t('mLandingTitle')}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 max-w-3xl mx-auto leading-relaxed font-light">
              {t('mLandingSubtitle')}
            </p>

            {/* Dynamic highlights bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-start">
              <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-2xs space-y-2">
                <TrendingUp className="w-6 h-6 text-[#26B6B6]" />
                <h3 className="text-xs font-bold text-gray-800">{isRtl ? 'در نقشه طراحان حضور یابید' : 'Get Inside Active Plans'}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  {isRtl 
                    ? 'وقتی مدل سه‌بعدی شیرآلات یا پنجره شما در پلان Revit قرار می‌گیرد، در واقع فاکتور خرید کارخانه شما صادر شده است.' 
                    : 'Getting your lighting or boiler Revit family placed in active drafts is the absolute best way to guarantee bulk procurement.'
                  }
                </p>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-2xs space-y-2">
                <BarChart3 className="w-6 h-6 text-[#26B6B6]" />
                <h3 className="text-xs font-bold text-gray-800">{isRtl ? 'تحلیل بازار هدف بر اساس ارقام واقعی' : 'Deep Analytics & CRM'}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  {isRtl 
                    ? 'گزارش بگیرید که کدام شرکت‌های مشاوره‌ای و در کدام مناطق ایران در حال دانلود و مشخص کردن محصولات شما هستند.' 
                    : 'Analyze downloads, views, and read lead notifications from verified engineering firms across regions.'
                  }
                </p>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-2xs space-y-2">
                <ShieldCheck className="w-6 h-6 text-[#26B6B6]" />
                <h3 className="text-xs font-bold text-gray-800">{isRtl ? 'تضمین اصالت و تایید فنی کاتالوگ' : 'Verified digital catalog'}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  {isRtl 
                    ? 'ما اصالت فایل‌های شما را تایید کرده و با قرار دادن نشان تایید، اعتمادسازی ۱۰۰ درصدی برای مهندسین مشاور فراهم می‌کنیم.' 
                    : 'Certified "Verified" tag establishes complete structural credibility for professional consulting firms.'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Guided Registration Form */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-xs overflow-hidden max-w-3xl mx-auto">
            <div className="bg-[#464E56] text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">
                  {t('registerAsManufacturer')}
                </h2>
                <p className="text-[10px] text-gray-300">
                  {isRtl ? 'اطلاعات کارخانه یا نام تجاری خود را ثبت نمایید' : 'Enter company details to launch your branded digital showcase'}
                </p>
              </div>
            </div>

            {hasRestoredDraft && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/40 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-start">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 shrink-0 rounded-full bg-amber-500 animate-pulse"></span>
                  <p className="text-xs text-amber-800 dark:text-amber-400 font-medium font-sans">
                    {isRtl 
                      ? 'پیش‌نویس ثبت‌نام قبلی شما به صورت خودکار بازیابی شد.' 
                      : 'Your previous registration draft was restored automatically.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-950 dark:text-amber-400 dark:hover:text-amber-200 underline cursor-pointer self-start sm:self-auto font-sans"
                >
                  {isRtl ? 'پاک کردن پیش‌نویس و شروع مجدد' : 'Clear & Start Fresh'}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    {t('companyName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder={isRtl ? 'مثال: صنایع بهساز کاران البرز' : 'e.g. Alupan Co.'}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    {t('websiteUrl')} *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://company.ir"
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    {t('emailAddress')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@company.ir"
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    {t('phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+98 21 8888 1234"
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    {isRtl ? 'نام رابط فنی / مدیر فروش' : 'Sales / Tech Contact Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder={isRtl ? 'مهندس سهراب احمدی' : 'Sohrab Ahmadi'}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    {t('password')} *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  {t('shortDescription')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder={isRtl ? 'معرفی کوتاه شرکت، ظرفیت تولید و سابقه فعالیت...' : 'Short introduction about brand manufacturing capabilities and certifications...'}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#26B6B6] hover:bg-[#1e9494] text-white py-3.5 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 hover:scale-102 cursor-pointer"
              >
                <span>{isRtl ? 'ثبت اطلاعات و ادامه' : 'Register & Continue'}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>

              {/* Autosave Draft Status Indicator */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 select-none">
                <span className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  saveStatus === 'saved' ? 'bg-emerald-500 scale-110' :
                  saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'
                }`}></span>
                <span>
                  {saveStatus === 'saved' && (isRtl ? 'پیش‌نویس با موفقیت ذخیره شد' : 'Progress saved automatically')}
                  {saveStatus === 'saving' && (isRtl ? 'در حال ذخیره‌سازی پیش‌نویس...' : 'Saving draft...')}
                  {saveStatus === 'idle' && (isRtl ? 'پیش‌نویس به صورت خودکار ذخیره می‌شود' : 'Draft progress secured locally')}
                </span>
              </div>

            </form>
          </section>
        </>
      ) : (
        <>
          {/* Subscription Pricing Tiers - STEP 2 */}
          <section className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="bg-[#26B6B6]/10 text-[#26B6B6] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {isRtl ? 'ثبت‌نام انجام شد! گام دوم: طرح عضویت برند' : 'Enrollment Finished! Step 2: Choose Membership'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#464E56] dark:text-white leading-snug">
                {isRtl 
                  ? '🎉 نمایه کارخانه ایجاد شد! اکنون نوع عضویت خود را ارتقا دهید.' 
                  : '🎉 Company profile created! Now, select your branding subscription.'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
                {isRtl 
                  ? 'طرح‌های پیشرفته ما قابلیت معرفی کالا به جامعه مهندسان مشاور، دریافت سرنخ‌های فروش (Lead) و نشان ارزشمند Verified را فعال می‌کنند.' 
                  : 'Choose a premium tier to receive direct architect query CRM leads, secure the Verified badge, and publish unlimited parametric files.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              {TIERS.map(tier => {
                const isSelected = selectedPlan === tier.id;
                const name = isRtl ? tier.nameFa : tier.nameEn;
                const price = isRtl ? tier.priceFa : tier.priceEn;
                const period = isRtl ? tier.periodFa : tier.periodEn;
                const features = isRtl ? tier.featuresFa : tier.featuresEn;

                return (
                  <div 
                    key={tier.id}
                    onClick={() => setSelectedPlan(tier.id)}
                    className={`border-2 rounded-2xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all hover:shadow-lg ${tier.color} relative`}
                  >
                    {isSelected && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#26B6B6] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                        {isRtl ? 'انتخاب شده' : 'Active Choice'}
                      </span>
                    )}

                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider">
                          {name}
                        </h3>
                        <div className="mt-4 flex items-baseline">
                          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {price}
                          </span>
                          <span className="ms-1.5 text-xs text-gray-400 font-medium">
                            / {period}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2.5 pt-3 border-t border-gray-100/10 text-xs font-light">
                        {features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#26B6B6] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(tier.id);
                      }}
                      className={`mt-8 w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#26B6B6] text-white shadow-xs'
                          : (tier.id === 'VIP' ? 'bg-white text-slate-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                      }`}
                    >
                      {isRtl ? 'انتخاب این طرح' : 'Select Plan'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Launch Action Bar */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('manufacturer_onboarding_draft');
                  } catch (err) {}
                  
                  onCompleteOnboarding({
                    companyName: formData.companyName,
                    email: formData.email,
                    phone: formData.phone,
                    website: formData.website,
                    desc: formData.desc,
                    tier: selectedPlan
                  });
                }}
                className="w-full bg-[#26B6B6] hover:bg-[#1e9494] text-white py-3.5 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
              >
                <span>
                  {isRtl 
                    ? `تایید و راه‌اندازی با عضویت ${selectedPlan === 'Free' ? 'رایگان' : selectedPlan === 'Premium' ? 'حرفه‌ای ممتایز' : 'ویژه سازمانی (VIP)'}` 
                    : `Confirm & Launch with ${selectedPlan} Tier`}
                </span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>

              {selectedPlan !== 'Free' && (
                <button
                  onClick={() => {
                    try {
                      localStorage.removeItem('manufacturer_onboarding_draft');
                    } catch (err) {}
                    
                    onCompleteOnboarding({
                      companyName: formData.companyName,
                      email: formData.email,
                      phone: formData.phone,
                      website: formData.website,
                      desc: formData.desc,
                      tier: 'Free'
                    });
                  }}
                  className="w-full border border-gray-200 hover:bg-gray-50 text-gray-500 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isRtl ? 'فعلاً با طرح رایگان معمولی شروع کنم' : 'Continue with Free Plan for now'}
                </button>
              )}
            </div>
          </section>
        </>
      )}

    </div>
  );
};
