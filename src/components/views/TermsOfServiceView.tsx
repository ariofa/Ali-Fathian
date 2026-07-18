import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { FileText, Calendar, CheckCircle, Scale, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '../Breadcrumb';

interface TermsOfServiceViewProps {
  onNavigate: (view: string) => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({ onNavigate }) => {
  const { isRtl } = useLanguage();
  const [activeLang, setActiveLang] = useState<'fa' | 'en'>(isRtl ? 'fa' : 'en');

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
              {activeLang === 'fa' ? 'قوانین و مقررات رسمی' : 'Official Terms of Service'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {activeLang === 'fa' ? 'شرایط استفاده و قوانین ایران‌بیم‌هاب' : 'IranBIMhub Terms of Service'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              {activeLang === 'fa'
                ? 'توافق‌نامه کاربری استفاده از بستر دیجیتال مدل‌سازی اطلاعات ساختمان (BIM) و ضوابط عرضه و دانلود فمیلی‌ها.'
                : 'User agreement for accessing the BIM digital infrastructure, content contribution, and download compliance standards.'}
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-start md:justify-end">
            <Scale className="w-16 h-16 text-[#26B6B6] animate-pulse" />
          </div>
        </div>
      </section>

      {/* Language Toggle & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <Breadcrumb
          className="!bg-transparent !border-none !p-0"
          items={[
            { label: activeLang === 'fa' ? 'خانه' : 'Home', onClick: () => onNavigate('home') },
            { label: activeLang === 'fa' ? 'شرایط استفاده و قوانین' : 'Terms of Service' }
          ]}
        />

        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1 max-w-[240px]" dir="ltr">
          <button
            onClick={() => setActiveLang('fa')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeLang === 'fa'
                ? 'bg-white dark:bg-gray-800 text-[#26B6B6] shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            فارسی (Persian)
          </button>
          <button
            onClick={() => setActiveLang('en')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeLang === 'en'
                ? 'bg-white dark:bg-gray-800 text-[#26B6B6] shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Side Panel Summary */}
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
                {activeLang === 'fa' ? 'تعهدات کلیدی' : 'Core Obligations'}
              </h4>
              <ul className="space-y-2.5 text-[11px] text-gray-500 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#26B6B6] shrink-0 mt-0.5" />
                  <span>{activeLang === 'fa' ? 'احراز هویت شماره تلفن و مجوزهای برند' : 'Mobile and corporate license verification'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#26B6B6] shrink-0 mt-0.5" />
                  <span>{activeLang === 'fa' ? 'مسئولیت اصالت مدل‌ها تماماً بر عهده بارگذار است' : 'Model accuracy remains uploader liability'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#26B6B6] shrink-0 mt-0.5" />
                  <span>{activeLang === 'fa' ? 'منع مهندسی معکوس قفل‌های فایل‌ها' : 'Reverse engineering files is strictly prohibited'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Long Form Terms */}
        <div className="lg:col-span-3 space-y-8 text-start">
          {activeLang === 'fa' ? (
            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              
              {/* Introduction */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۱. مقدمه و پذیرش شرایط</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  ورود، ثبت‌نام، و استفاده شما از هرگونه ابزار، کاتالوگ یا آبجکت‌های مدل‌سازی اطلاعات ساختمان (BIM) در ایران‌بیم‌هاب، به منزله پذیرش کامل و بدون قید و شرط این توافق‌نامه کاربری است. در صورت عدم موافقت، استفاده خود را متوقف نمایید.
                </p>
              </section>

              {/* Accounts */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۲. حساب‌های کاربری و احراز هویت</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  کاربران موظف به وارد کردن اطلاعات هویتی حقیقی و حقوقی دقیق هستند. به منظور حفظ اصالت اطلاعات:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ps-2 font-light">
                  <li>شماره‌های ثبت شرکت و مدارک بارگذاری‌شده تولیدکنندگان تحت ممیزی تخصصی ۴۸ ساعته کارشناسان پلتفرم قرار می‌گیرند.</li>
                  <li>هرگونه سوءاستفاده از هویت برندهای متفرقه یا بارگذاری اسناد فاقد اعتبار منجر به ابطال دائم حساب کاربری خواهد شد.</li>
                  <li>حفظ و صیانت از گذرواژه حساب کاربری بر عهده صاحب حساب است.</li>
                </ul>
              </section>

              {/* Downloads & Technical Use */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۳. قوانین دانلود فمیلی‌ها و استانداردهای فنی</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  دانلود آبجکت‌های موجود در پلتفرم مشروط به رعایت قوانین زیر است:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ps-2 font-light">
                  <li>کاربران عادی مجاز به دانلود روزانه حداکثر ۵ فمیلی هستند؛ افزایش سقف نیازمند ارتقا به حساب ممتاز (Premium) است.</li>
                  <li>آبجکت‌ها نباید بازنشر تجاری شده یا به عنوان محصول مستقل در پلتفرم‌های ثانویه به فروش برسند.</li>
                  <li>تغییر پارامترهای پایه‌ای متریال و نام برند در فایل‌های دانلود شده به منظور ارائه فمیلی جعلی تحت نام برند دیگر مجاز نمی‌باشد.</li>
                </ul>
              </section>

              {/* IP / Liability Clause (CRITICAL REQUIREMENT #3 & CROSS-REFERENCE TO POLICY SECTION 9) */}
              <section className="bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 border border-[#26B6B6]/20 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/20 text-[#26B6B6]">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white text-[#26B6B6]">۴. سلب مسئولیت اصالت محتوا و حق نشر (کپی‌رایت)</h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-light">
                  <p className="font-bold text-gray-900 dark:text-white">
                    منطبق بر مفاد صریح ماده ۹ سیاست حفظ حریم خصوصی ایران‌بیم‌هاب، تمام حقوق مالکیت مادی و معنوی مربوط به فمیلی‌های رویت، مستندات نقشه‌ها، تصاویر و کدهای کاتالوگی بارگذاری‌شده در پلتفرم تماماً متعلق به تولیدکننده‌ای است که نسبت به بارگذاری آن فایل مبادرت ورزیده است.
                  </p>
                  <p className="border-r-2 border-[#26B6B6] pr-3 my-2 text-gray-900 dark:text-white font-medium">
                    ایران‌بیم‌هاب صرفاً نقش بستر توزیع کاتالوگ و نمایش مشخصات فنی محصولات را بر عهده دارد و به هیچ وجه مالک آبجکت‌ها قلمداد نمی‌شود. ایران‌بیم‌هاب هیچ‌گونه تضمینی در خصوص انطباق هندسی دقیق فایل‌ها با محصول فیزیکی، عدم نقض کپی‌رایت اشخاص ثالث، یا برطرف‌سازی باگ‌های فنی نرم‌افزار ارائه نمی‌دهد. هر نوع دعاوی حقوقی مربوط به محتوای بارگذاری‌شده مستقیماً متوجه شرکت عرضه کننده است.
                  </p>
                </div>
              </section>

              {/* Revit File Protection Limitations (CRITICAL REQUIREMENT #4 - Honest Informational Statement) */}
              <section className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white text-amber-600 dark:text-amber-400">۵. حریم امنیت فایل‌ها و محدودیت‌های نرم‌افزار Revit</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  به جهت شفاف‌سازی و ترسیم انتظارات واقع‌بینانه برای تولیدکنندگان کاتالوگ اعلام می‌گردد: به دلیل ساختار فنی نرم‌افزار Autodesk Revit، امکان قفل‌گذاری کامل فنی و جلوگیری از ویرایش فمیلی‌های دانلود شده (.rfa) پس از دریافت توسط کاربران وجود ندارد. حفاظت از فایل‌های شما اساساً بر دوش شرایط استفاده و توافق‌نامه کاربری این پلتفرم است و هیچ مانع رمزنگاری فیزیکی صددرصدی روی هندسه‌های دانلود شده میسر نمی‌باشد.
                </p>
              </section>

              {/* Terminations */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">۶. لغو و تعلیق خدمات</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  ایران‌بیم‌هاب مجاز است در صورت نقض هر یک از مفاد این توافق‌نامه، سوءاستفاده‌های رباتیک و بارگذاری فایل‌های خرابکارانه، حساب کاربری متخلف را بدون اطلاع قبلی و به صورت دائمی به حالت تعلیق درآورد.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              
              {/* Introduction */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">1. Introduction and Agreement</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  By accessing, registering, or downloading any digital materials or structural BIM family objects on IranBIMhub, you unconditionally agree to comply with and be bound by these legal Terms of Service.
                </p>
              </section>

              {/* Accounts */}
              <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/5 text-[#26B6B6]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">2. User Accounts & Verification</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  Users are strictly obliged to submit accurate hassan, phone, and company profiles. To keep platform records authenticated:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ps-2 font-light">
                  <li>Manufacturer registration uploads and tax documents undergo an intensive 48-hour audit by our compliance specialists.</li>
                  <li>Using mock identities, misleading trade licenses, or uploading false documents will lead to an immediate ban.</li>
                  <li>You are responsible for keeping your password secure and managing session credentials.</li>
                </ul>
              </section>

              {/* IP / Disclaimer */}
              <section className="bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 border border-[#26B6B6]/20 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#26B6B6]/20 text-[#26B6B6]">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white text-[#26B6B6]">3. Content Ownership and Copyright (Liability Shield)</h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-light">
                  <p className="font-bold text-gray-900 dark:text-white">
                    In complete alignment with Section 9 of our Privacy Policy, all intellectual rights, copyrights, patents, and catalogs in connection with uploaded BIM packages remain solely owned by the contributing manufacturing brand.
                  </p>
                  <p className="border-l-2 border-[#26B6B6] pl-3 my-2 text-gray-900 dark:text-white font-medium">
                    IranBIMhub serves solely as a catalog-sharing and distribution portal; we lay no ownership claims to the uploaded materials and waive any responsibility regarding their geometric accuracy, physical replication, third-party intellectual property breaches, or software bugs. All disputes must be negotiated directly with the publishing brand.
                  </p>
                </div>
              </section>

              {/* Revit Lock limitations (CRITICAL REQUIREMENT #4 - Honest Informational Statement) */}
              <section className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white text-amber-600 dark:text-amber-400">4. Revit File Custody Limitations</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-light">
                  Due to architectural limits inherent in Autodesk Revit software, complete digital lockups and write-protection constraints cannot be technical guarantees on downloaded family (.rfa) files. Protecting your brand's digital designs relies primarily on our Terms of Use agreements, not on a physical file lock mechanism.
                </p>
              </section>
            </div>
          )}

          {/* Action Back Button */}
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
