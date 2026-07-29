import React from 'react';
import { useLanguage } from '../LanguageContext';
import { ShieldCheck, Calendar, Lock, Eye, CheckCircle, Mail, Globe, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '../Breadcrumb';

interface PrivacyPolicyViewProps {
  onNavigate: (view: string) => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigate }) => {
  const { isRtl } = useLanguage();
  const activeLang = isRtl ? 'fa' : 'en';

  const handleGoBack = () => {
    onNavigate('home');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10" dir={activeLang === 'fa' ? 'rtl' : 'ltr'}>
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E2326] to-[#464E56] text-white p-8 md:p-12 text-start shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <span className="text-[10px] uppercase font-extrabold text-[#26B6B6] tracking-wider px-2.5 py-1 bg-[#26B6B6]/10 rounded-full border border-[#26B6B6]/20 inline-block">
              {activeLang === 'fa' ? 'امنیت داده‌ها و حریم خصوصی' : 'Data Security & Confidentiality'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {activeLang === 'fa' ? 'سیاست حفظ حریم خصوصی ایران‌بیم‌هاب' : 'IranBIMhub Privacy Policy'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              {activeLang === 'fa'
                ? 'تعهد ایران‌بیم‌هاب به شفافیت، امانت‌داری داده‌ها و ایمن‌سازی اطلاعات شخصی مهندسان و تولیدکنندگان صنعت ساختمان.'
                : 'IranBIMhub’s solemn commitment to transparency, data integrity, and securing the personal information of AEC professionals and manufacturers.'}
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-start md:justify-end">
            <ShieldCheck className="w-16 h-16 text-[#26B6B6] animate-pulse" />
          </div>
        </div>
      </section>

      {/* Breadcrumb navigation without Language Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <Breadcrumb
          className="!bg-transparent !border-none !p-0"
          items={[
            { label: activeLang === 'fa' ? 'خانه' : 'Home', onClick: () => onNavigate('home') },
            { label: activeLang === 'fa' ? 'سیاست حفظ حریم خصوصی' : 'Privacy Policy' }
          ]}
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Side summary card */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 text-start space-y-5">
            <div className="flex items-center gap-2 text-[#26B6B6]">
              <Calendar className="w-5 h-5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {activeLang === 'fa' ? 'آخرین به‌روزرسانی' : 'Last Updated'}
              </span>
            </div>
            <p className="text-sm font-black text-gray-800 dark:text-white font-mono">
              {activeLang === 'fa' ? '۱۵ تیر ۱۴۰۵ (تیر ۱۴۰۵)' : 'July 5, 2026'}
            </p>
            <hr className="border-gray-200/50 dark:border-gray-800/50" />
            
            <div className="space-y-3">
              <h4 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {activeLang === 'fa' ? 'نکات کلیدی این سند' : 'Key Document Highlights'}
              </h4>
              <ul className="space-y-2.5 text-[11px] text-gray-500 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{activeLang === 'fa' ? 'عدم فروش اطلاعات کاربران به اشخاص ثالث' : 'Zero sale of personal data to third parties'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{activeLang === 'fa' ? 'حفظ کامل حق مالکیت معنوی تولیدکننده' : 'Preserving full brand intellectual property'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{activeLang === 'fa' ? 'امکان ویرایش و حذف حساب کاربری' : 'Easy profile modification & account deletion'}</span>
                </li>
              </ul>
            </div>

            <hr className="border-gray-200/50 dark:border-gray-800/50" />
            
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 leading-normal">
                {activeLang === 'fa' 
                  ? 'سوالی درباره حریم خصوصی دارید؟ تیم پشتیبانی فنی آماده پاسخگویی به شماست.' 
                  : 'Have questions about your data? Our compliance desk is here to help.'}
              </p>
              <a 
                href="mailto:support@iranbimhub.ir" 
                className="flex items-center gap-2 text-xs font-extrabold text-[#26B6B6] hover:underline"
              >
                <Mail className="w-4 h-4" />
                <span>support@iranbimhub.ir</span>
              </a>
            </div>
          </div>
        </div>

        {/* Clean, readable long-form text section */}
        <div className="lg:col-span-3 space-y-8 text-start">
          {activeLang === 'fa' ? (
            // Persian Content
            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              {/* Introduction */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۱. مقدمه</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  ایران‌بیم‌هاب («ما»، «پلتفرم») به حفظ حریم خصوصی کاربران خود اعم از مهندسان و طراحان بیم و تولیدکنندگان/برندها متعهد است. این سند توضیح می‌دهد چه اطلاعاتی جمع‌آوری می‌کنیم، چگونه از آن استفاده می‌کنیم، و چه حقوقی در قبال اطلاعات خود دارید.
                </p>
              </section>

              {/* Data Collected */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۲. اطلاعاتی که جمع‌آوری می‌کنیم</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  برای ارائه خدمات بهینه کاتالوگ و مدل‌سازی اطلاعات ساختمان (BIM)، انواع اطلاعات زیر را از شما جمع‌آوری می‌کنیم:
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ps-2 font-light">
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">اطلاعات حساب کاربری:</strong> نام و نام خانوادگی، نشانی ایمیل معتبر، شماره تلفن همراه، رمز عبور به صورت رمزنگاری‌شده برگشت‌ناپذیر.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">برای حساب‌های تولیدکننده:</strong> نام رسمی شرکت، اسناد هویتی شرکتی و مدارک ثبتی/مجوز کسب‌وکار، اطلاعات تماس اداری و مالی شرکت جهت ارزیابی و ارزیابی اصالت برند.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">اطلاعات استفاده از پلتفرم:</strong> تاریخچه جستجوهای پارامتریک، دسته‌بندی‌های مورد بازدید، تاریخچه دقیق دانلود فایل‌ها به منظور مدیریت سقف مجاز دانلود روزانه.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">اطلاعات دستگاه و مرورگر:</strong> آدرس IP، مشخصات مرورگر و سخت‌افزار دستگاه جهت ارتقای امنیت سایبری و ممانعت از دانلودهای اسپم یا مخرب.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">محتوای بارگذاری‌شده توسط تولیدکنندگان:</strong> فایل‌های فمیلی آبجکت بیم (RFA, IFC, GSM و غیره)، کاتالوگ‌های تصویری، نقشه‌های پی‌دی‌اف و مدارک استاندارد فنی.
                  </li>
                </ul>
              </section>

              {/* Usage of Data */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۳. نحوه استفاده از اطلاعات</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  اطلاعات دریافتی شما را در مسیر اهداف عملیاتی زیر به کار می‌گیریم:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {[
                    'ارائه و بهبود مداوم کیفیت خدمات مدل‌سازی اطلاعات و سرعت پلتفرم',
                    'تایید هویت تخصصی و مدارک تجاری بارگذاری‌شده حساب‌های سازمانی و تولیدکننده',
                    'شخصی‌سازی پیشنهادهای هوشمند مدل‌سازی و فمیلی بر پایه الگوریتم‌های رفتار کاربری',
                    'پردازش دقیق دوره‌های اشتراک، فعال‌سازی بسته‌های پرمیوم و مدیریت تراکنش‌های مالی',
                    'اطلاع‌رسانی حیاتی در رابطه با به‌روزرسانی‌های فنی فمیلی‌ها، محصولات جدید برندها و مباحث امنیتی حساب کاربری',
                    'پاسخگویی سریع به تیکت‌های پشتیبانی فنی دپارتمان‌های مدلسازی و مهندسی'
                  ].map((text, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start p-3 bg-gray-50 dark:bg-gray-850 rounded-2xl">
                      <span className="w-5 h-5 rounded-full bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                      <span className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{text}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sharing of Data */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۴. اشتراک‌گذاری اطلاعات</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  ما اطلاعات شخصی و هویتی کاربران خود را تحت هیچ شرایطی به اشخاص ثالث، شرکت‌های تبلیغاتی یا تجاری نمی‌فروشیم و اجاره نمی‌دهیم. به اشتراک‌گذاری داده‌ها صرفاً در دایره محدود زیر صورت می‌پذیرد:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ps-2 font-light">
                  <li>ارائه‌دهندگان خدمات زیرساختی معتمد و ضروری جهت کارکرد صحیح پلتفرم (از قبیل درگاه‌های پرداخت مجاز بانکی و سرویس‌های امن میزبانی داده‌ها).</li>
                  <li>در صورت دریافت الزام قانونی رسمی و مستند از مراجع ذی‌صلاح و قضایی کشور جمهوری اسلامی ایران.</li>
                  <li>ارائه گزارش‌های آماری کلی و کاملاً ناشناس و تجمیع‌شده درباره رفتار مصرف متریال به منظور بهبود صنعت ساخت‌وساز (بدون درج کوچک‌ترین اطلاعات هویتی).</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۵. کوکی‌ها</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  پلتفرم ایران‌بیم‌هاب از فناوری کوکی‌ها به جهت حفظ و مدیریت نشست ورود امن کاربر، به خاطر سپردن انتخاب‌های ترجیحی مانند زبان سیستم (فارسی/انگلیسی)، و تحلیل داده‌های کلان عملکردی پلتفرم به کمک ابزارهای ایمن استفاده می‌کند. شما همواره قادر هستید از مسیر تنظیمات مرورگر شخصی خود، کوکی‌ها را غیرفعال کنید؛ هرچند این کار ممکن است مانع از اجرای برخی ویژگی‌های تعاملی پلتفرم گردد.
                </p>
              </section>

              {/* Security */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۶. امنیت اطلاعات</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  ما تدابیر فنی، ساختاری و سازمانی سخت‌گیرانه‌ای را منطبق با استانداردهای رایج حفاظت از داده‌ها پیاده‌سازی کرده‌ایم. این تمهیدات شامل پروتکل‌های رمزنگاری لایه امن (SSL/TLS)، ذخیره‌سازی رمزنگاری‌شده اطلاعات حساس، سیستم‌های مانیتورینگ نفوذ سایبری و فعال‌سازی اجباری احراز هویت دو مرحله‌ای (2FA) برای حساب‌های مدیریتی و تایید اصالت کارشناسان ما می‌باشد. با این وجود، به یاد داشته باشید که هیچ متد ارتباط الکترونیکی یا سیستم ذخیره‌سازی ابری به طور ۱۰۰٪ امن نبوده و امنیت مطلق در دنیای دیجیتال غیرممکن است.
                </p>
              </section>

              {/* User Rights */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <UserCheckIcon />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۷. حقوق کاربران</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  طبق قوانین صیانت از داده‌ها، کلیه کاربران ایران‌بیم‌هاب از حقوق قانونی زیر بهره‌مند هستند و می‌توانند در هر زمان اقدام نمایند:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1.5">درخواست دسترسی به اطلاعات</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-light">شما می‌توانید درخواست دریافت کپی کاملی از کلیه اطلاعات ثبت‌شده خود در سرورهای پلتفرم را ارائه کنید.</p>
                  </div>
                  <div className="p-4 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1.5">اصلاح فوری اطلاعات نادرست</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-light">در صورت تغییر یا اشتباه بودن مدارک، شماره تماس یا ایمیل، می‌توانید آنها را تصحیح نمایید.</p>
                  </div>
                  <div className="p-4 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1.5">درخواست حذف کامل داده‌ها</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-light">می‌توانید برای انحلال دائم حساب کاربری خود و امحای رکوردهای مرتبط درخواست دهید.</p>
                  </div>
                  <div className="p-4 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1.5 font-sans">Opt-out / لغو اشتراک خبرنامه</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-light">لغو دریافت سریع ایمیل‌های اطلاع‌رسانی تبلیغاتی پلتفرم در هر لحظه میسر است.</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal font-light pt-2">
                  جهت اجرای هر یک از موارد فوق‌الذکر، لطفاً درخواست صریح خود را مستقیماً به نشانی الکترونیک <a href="mailto:support@iranbimhub.ir" className="text-[#26B6B6] hover:underline">support@iranbimhub.ir</a> ارسال نمایید تا همکاران ما در دبیرخانه حداکثر ظرف ۴۸ ساعت کاری با شما هماهنگ شوند.
                </p>
              </section>

              {/* Data Retention */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۸. نگهداری اطلاعات</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  داده‌های کاربری شما تا زمانی که حساب کاربری شما در ایران‌بیم‌هاب فعال و برقرار باشد نزد ما نگهداری می‌شوند. پس از مسدودسازی یا انحلال حساب، داده‌ها تا جایی که بر اساس قوانین عمومی، مالیاتی یا نظارتی کشور نگهداری آن‌ها الزام‌آور نباشد، به طور کامل حذف می‌گردند.
                </p>
              </section>

              {/* IP / Liability Clause (CRITICAL REQUIREMENT #9) */}
              <section className="bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 border border-[#26B6B6]/20 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/20 text-[#26B6B6]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white text-[#26B6B6]">۹. مالکیت محتوا و مسئولیت آبجکت‌های بارگذاری‌شده</h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-light">
                  <p>
                    تمامی حقوق مالکیت معنوی، کپی‌رایت، نقشه‌های جزئیات و اسرار تجاری مربوط به آبجکت‌های بیم (BIM Objects)، فایل‌های خانواده، اسناد پی‌دی‌اف فنی، و عکس‌های بارگذاری‌شده توسط برندها و کارخانجات صنعتی، به طور کامل و انحصاری متعلق به همان شرکت/تولیدکننده بارگذاری‌کننده است.
                  </p>
                  <p className="font-bold border-r-2 border-[#26B6B6] pr-3 my-2 text-gray-900 dark:text-white">
                    ایران‌بیم‌هاب صرفاً به عنوان یک پلتفرم معرفی، نمایش کاتالوگ و توزیع فنی محصولات عمل می‌کند؛ هیچ‌گونه حق مالکیت مادی یا معنوی روی محتواهای آپلود شده برندها ندارد و هیچ مسئولیتی را در قبال صحت ابعادی، مجاز بودن قانونی، کپی‌برداری غیرمجاز یا عدم تطبیق این فایل‌ها با استانداردها و حقوق اشخاص ثالث پذیرا نمی‌شود.
                  </p>
                  <p>
                    مسئولیت مستقیم هرگونه مغایرت اطلاعاتی، آسیب به مدل‌های مرجع ساختمانی یا ادعاهای نقض حق نشر به عهده شرکت تولیدکننده‌ای است که محتوا را بارگذاری کرده است.
                  </p>
                </div>
              </section>

              {/* Policy Changes */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۱۰. تغییرات این سیاست</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  ممکن است این سیاست به مرور زمان و بر اساس بهینه‌سازی فرآیندهای حفاظتی به‌روزرسانی شود. تاریخ دقیق آخرین اصلاح همواره در بالای این صفحه قابل رویت است. استفاده مستمر شما از پلتفرم بعد از اعمال اصلاحات به معنی پذیرش تام سیاست تجدیدنظرشده تلقی خواهد شد.
                </p>
              </section>

              {/* Contact Us */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۱۱. تماس با ما</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  جهت دریافت هرگونه شفاف‌سازی در رابطه با بندهای این سند یا مسائل مرتبط با حریم شخصی، صمیمانه منتظر ارتباط شما با کارشناسان فنی و حقوقی پلتفرم در آدرس ایمیل رسمی روبه‌رو هستیم:
                </p>
                <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-light">
                    <ShieldCheck className="w-4 h-4 text-[#26B6B6]" />
                    <span>واحد هماهنگی و صیانت از داده‌های ایران‌بیم‌هاب</span>
                  </div>
                  <a href="mailto:support@iranbimhub.ir" className="text-xs font-extrabold text-[#26B6B6] hover:underline font-mono">
                    support@iranbimhub.ir
                  </a>
                </div>
              </section>
            </div>
          ) : (
            // English Content
            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              {/* Introduction */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">1. Introduction</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  IranBIMhub ("we", "the platform") is deeply committed to safeguarding the privacy and security of its users, which includes BIM modelers, designers, architects, and industrial building material manufacturers/brands. This Privacy Policy details what data we collect, how it is managed, and your distinct legal rights in managing that information.
                </p>
              </section>

              {/* Data Collected */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">2. Information We Collect</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  To provide our advanced catalog services, parametric search filters, and custom engineering tools, we gather several types of data:
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ps-2 font-light">
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">Personal Account Details:</strong> Full name, verified email address, mobile phone number, and password (securely hashed via irreversible algorithms).
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">Manufacturer Corporate Data:</strong> Official brand/company name, national corporate ID and registration certificates, physical business coordinates, and corporate support lines for brand verification.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">Usage Records & Behavior:</strong> Parametric query terms, clicked categories, downloaded BIM formats, and transaction records to maintain quality metrics.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">Device & Network Metadata:</strong> IP address, browser user-agent details, and operating system identifiers to block automated scraping or security breaches.
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-white font-bold">Manufacturer Published Materials:</strong> BIM families (.RFA, .IFC, .GSM, etc.), digital catalogs, technical specification PDFs, and product display photos.
                  </li>
                </ul>
              </section>

              {/* Usage of Data */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">3. How We Use Your Information</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  We process gathered information solely for specific and necessary business goals:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {[
                    'To deliver, monitor, and optimize our digital BIM catalogs and platform speeds.',
                    'To audit, verify, and validate structural manufacturers’ official profiles and licenses.',
                    'To personalize parametric search results and suggest families based on user modeling histories.',
                    'To securely process subscriptions, handle premium memberships, and track financial transactions.',
                    'To notify users of vital technical revisions to files, brand product releases, or account changes.',
                    'To answer support tickets and resolve complex digital family integration queries.'
                  ].map((text, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start p-3 bg-gray-50 dark:bg-gray-850 rounded-2xl">
                      <span className="w-5 h-5 rounded-full bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                      <span className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{text}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sharing of Data */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">4. Information Sharing and Disclosure</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  We maintain a strict zero-sale data policy. We do not sell or lease user information to commercial ad networks. Shared data is kept to a minimum:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ps-2 font-light">
                  <li>To essential third-party service providers (e.g. secure payment gateways and cloud database hosting) to keep the platform running.</li>
                  <li>In response to official judicial orders or written legal mandates issued by sovereign authorities.</li>
                  <li>In fully anonymized, aggregated, and statistical form to compile general market trend analysis (where individual identity is completely redacted).</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">5. Cookies & Tracking Technologies</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  The platform uses persistent and session cookies to securely handle login sessions, remember preference settings (such as Farsi or English defaults), and collect analytical speed indicators. You can modify your browser settings to reject cookies, though doing so might disable certain responsive portal sections.
                </p>
              </section>

              {/* Security */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">6. Data Security</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  We use appropriate physical, administrative, and technical controls to secure user files. This includes SSL/TLS web transport encryption, hashed database storage, cyber monitoring tools, and mandatory Multi-Factor Authentication (MFA) for administrative workers and verification personnel. Note, however, that no digital storage or transmission is 100% impenetrable; hence, we cannot offer absolute, flawless guarantees.
                </p>
              </section>

              {/* User Rights */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <UserCheckIcon />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">7. User Rights</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  All users of IranBIMhub can exercise their digital privacy rights at any time:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1.5">Right to Access Data</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-light">You can request a complete readable export of all files and data associated with your username.</p>
                  </div>
                  <div className="p-4 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1.5">Right to Correction</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-light">You can edit your contact information, phone, and company documents to reflect true status.</p>
                  </div>
                  <div className="p-4 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1.5">Right to Erasure</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-light">You can request the permanent deletion of your profile, wiping all logs and active registrations.</p>
                  </div>
                  <div className="p-4 border border-gray-100 dark:border-gray-800/80 rounded-2xl">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-1.5 font-sans">Opt-out / Unsubscribe</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-light">You can instantly opt out of any informational emails, newsletter cycles, or updates.</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal font-light pt-2">
                  To invoke these rights, please write to us at <a href="mailto:support@iranbimhub.ir" className="text-[#26B6B6] hover:underline">support@iranbimhub.ir</a> and our compliance desk will act on it within 48 business hours.
                </p>
              </section>

              {/* Data Retention */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">8. Data Retention</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  User profiles are kept on file as long as the account remains active. If you choose to close your account, we completely purge the database except where financial audits, national taxation laws, or corporate reporting standards dictate preservation.
                </p>
              </section>

              {/* IP / Liability Clause (CRITICAL REQUIREMENT #9) */}
              <section className="bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 border border-[#26B6B6]/20 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/20 text-[#26B6B6]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white text-[#26B6B6]">9. Content Ownership and Liability for Uploaded Objects</h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-light">
                  <p>
                    All intellectual property rights, patents, copyrights, details drawings, and trade secrets in connection with BIM files, family packages, specification sheets, and brand imagery uploaded by manufacturers remain exclusively owned by the uploading manufacturer.
                  </p>
                  <p className="font-bold border-l-2 border-[#26B6B6] pl-3 my-2 text-gray-900 dark:text-white">
                    IranBIMhub acts purely as a marketplace platform for hosting, introducing, and distributing these digital assets; we hold no ownership claims and decline any legal liability regarding the geometric accuracy, licensed validity, trademark infringements, or compliance of these files with third-party copyrights.
                  </p>
                  <p>
                    Any legal disputes, structural deviations, or intellectual violations in connection with uploaded BIM catalogs must be negotiated directly with the uploading manufacturing company.
                  </p>
                </div>
              </section>

              {/* Policy Changes */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">10. Policy Changes</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  We reserve the right to revise this policy to reflect operational changes or compliance standards. The "Last Updated" date will always show our latest release. Your continued usage after modifications constitutes consent to the updated terms.
                </p>
              </section>

              {/* Contact Us */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">11. Contact Us</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  If you require any clarification on our digital custody policies, or want to raise a general data security query, please feel free to email our legal and technical desks:
                </p>
                <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-light">
                    <ShieldCheck className="w-4 h-4 text-[#26B6B6]" />
                    <span>IranBIMhub Technical Custody Unit</span>
                  </div>
                  <a href="mailto:support@iranbimhub.ir" className="text-xs font-extrabold text-[#26B6B6] hover:underline font-mono">
                    support@iranbimhub.ir
                  </a>
                </div>
              </section>
            </div>
          )}

          {/* Quick Action Button */}
          <div className="pt-6 flex justify-end">
            <button
              onClick={handleGoBack}
              className="px-5 py-2.5 bg-[#26B6B6] text-white hover:bg-[#1f9393] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md active:scale-95 select-none"
            >
              <span>{activeLang === 'fa' ? 'بازگشت به خانه' : 'Back to Home'}</span>
              <ArrowRight className={`w-4 h-4 ${activeLang === 'fa' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-component for clean user icon layout
const UserCheckIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);
