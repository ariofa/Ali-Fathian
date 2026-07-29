const fs = require('fs');

const mfgViewCode = `import React, { useState } from 'react';
import {
  Factory,
  CheckCircle,
  FileCheck2,
  Wand2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Package,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  Send,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

type HasBimFiles = 'yes' | 'no' | 'not-sure';

export const ForManufacturersView: React.FC = () => {
  const { isRtl } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: '',
    brandName: '',
    contactName: '',
    roleTitle: '',
    phone: '',
    email: '',
    city: '',
    websiteOrSocial: '',
    productCategory: '',
    hasBimFiles: 'not-sure' as HasBimFiles,
    bimFormats: [] as string[],
    productCount: '',
    catalogUrl: '',
    filesSentByTelegram: false,
    filesSentByWhatsApp: false,
    message: '',
    honeypot: '' // Anti-spam
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormatChange = (format: string) => {
    setFormData(prev => {
      const formats = prev.bimFormats.includes(format)
        ? prev.bimFormats.filter(f => f !== format)
        : [...prev.bimFormats, format];
      return { ...prev, bimFormats: formats };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Spam detected

    if (!formData.companyName || !formData.contactName || !formData.phone || !formData.city || !formData.productCategory) {
      setSubmitError(isRtl ? 'لطفاً فیلدهای ضروری (*) را پر کنید.' : 'Please fill in the required fields (*).');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/manufacturer-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Submission failed');
      }

      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitError(
        isRtl
          ? 'ارسال فرم با خطا مواجه شد. لطفاً دوباره تلاش کنید یا از طریق تلگرام پیام دهید.'
          : 'Submission failed. Please try again or contact us via Telegram.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTelegramClick = () => {
    const message = encodeURIComponent(
      isRtl
        ? 'سلام، برای بررسی محصولات و مشاوره BIM از طرف شرکت ' + (formData.companyName || '...') + ' پیام می‌دهم.'
        : 'Hello, I am contacting you for BIM consultation from ' + (formData.companyName || '...') + '.'
    );
    window.open(\`tg://resolve?domain=iranbimhub&text=\${message}\`, '_blank');
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      isRtl
        ? 'سلام، برای بررسی محصولات و مشاوره BIM از طرف شرکت ' + (formData.companyName || '...') + ' پیام می‌دهم.'
        : 'Hello, I am contacting you for BIM consultation from ' + (formData.companyName || '...') + '.'
    );
    window.open(\`https://wa.me/989391686878?text=\${message}\`, '_blank');
  };

  return (
    <div className="space-y-16 py-8 animate-fadeIn text-start">
      {/* Hero Section */}
      <section className="relative px-4 text-center max-w-4xl mx-auto space-y-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#26B6B6]/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#26B6B6] to-[#1a7f7f] text-white shadow-xl shadow-[#26B6B6]/20 mb-4">
          <Factory className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
          {isRtl ? (
            <>
              محصولات خود را <span className="text-[#26B6B6]">دیجیتال</span> کنید و<br />
              وارد پروژه‌های نوین ساختمان شوید
            </>
          ) : (
            <>
              <span className="text-[#26B6B6]">Digitize</span> your products and<br />
              enter modern building projects
            </>
          )}
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-bold max-w-2xl mx-auto leading-relaxed">
          {isRtl
            ? 'ایران‌بیم‌هاب پل ارتباطی تولیدکنندگان مصالح و تجهیزات ساختمانی با معماران، مهندسان و پیمانکاران پیشرو است. با تبدیل محصولات به آبجکت‌های استاندارد BIM (مدل‌سازی اطلاعات ساختمان)، شانس انتخاب محصول خود را در فاز طراحی افزایش دهید.'
            : 'IranBIMhub is the bridge between construction product manufacturers and leading architects, engineers, and contractors. By converting your products into standard BIM (Building Information Modeling) objects, you increase the chance of your product being selected during the design phase.'
          }
        </p>
      </section>

      {/* Two Paths Section */}
      <section className="px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-10">
          {isRtl ? 'مسیر همکاری چگونه است؟' : 'How does collaboration work?'}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Path 1: Already has BIM */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-150 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none hover:border-[#26B6B6]/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 dark:bg-cyan-900/30 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-850 dark:text-white">
                  {isRtl ? 'فایل BIM آماده دارم' : 'I already have BIM files'}
                </h3>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {isRtl ? 'ثبت و ارزیابی' : 'Registration & Audit'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-bold leading-relaxed mb-6">
              {isRtl
                ? 'اگر برای محصولات خود فایل‌های سه‌بعدی اطلاعات‌محور (Revit, IFC و...) تهیه کرده‌اید، می‌توانید آن‌ها را برای بررسی و ارزیابی فنی به ما بسپارید.'
                : 'If you have already created data-driven 3D files (Revit, IFC, etc.) for your products, you can submit them to us for technical review and auditing.'
              }
            </p>
            <ul className="space-y-3 mb-8">
              {[
                isRtl ? 'تکمیل فرم درخواست زیر' : 'Complete the request form below',
                isRtl ? 'دریافت راهنمای ایجاد پنل برند' : 'Receive brand panel creation guide',
                isRtl ? 'آپلود فایل‌ها در پنل تولیدکننده' : 'Upload files in the manufacturer panel',
                isRtl ? 'بررسی استاندارد و ارائه گزارش اصلاحات' : 'Standard review & correction report',
                isRtl ? 'انتشار رسمی پس از تایید کیفی' : 'Official publication after QA approval'
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Path 2: Needs BIM Creation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-[#26B6B6] shadow-xl shadow-[#26B6B6]/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#26B6B6]/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div className="absolute top-4 left-4 bg-[#26B6B6] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {isRtl ? 'پیشنهاد ما' : 'Recommended'}
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#26B6B6]/10 flex items-center justify-center text-[#26B6B6]">
                <Wand2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-850 dark:text-white">
                  {isRtl ? 'فایل BIM ندارم' : 'I don\'t have BIM files'}
                </h3>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {isRtl ? 'مشاوره و ساخت آبجکت' : 'Consultation & Object Creation'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-bold leading-relaxed mb-6">
              {isRtl
                ? 'تیم متخصص ما می‌تواند با دریافت کاتالوگ‌ها، دیتاشیت‌ها و نقشه‌های فنی (CAD/PDF)، محصولات شما را با بالاترین استانداردهای روز دنیا مدل‌سازی کند.'
                : 'Our expert team can model your products to the highest global standards using your catalogs, datasheets, and technical drawings (CAD/PDF).'
              }
            </p>
            <ul className="space-y-3 mb-8">
              {[
                isRtl ? 'تکمیل فرم درخواست زیر' : 'Complete the request form below',
                isRtl ? 'ارسال کاتالوگ در تلگرام یا فرم' : 'Send catalogs via Telegram or form',
                isRtl ? 'بررسی دامنه محصولات و برآورد هزینه' : 'Scope review and cost estimation',
                isRtl ? 'عقد قرارداد ساخت آبجکت BIM' : 'BIM object creation contract sign',
                isRtl ? 'تولید، ارزیابی داخلی و انتشار مستقیم' : 'Production, internal audit & direct publish'
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-[#26B6B6] shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 max-w-4xl mx-auto pb-16">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-lg shadow-gray-200/20 dark:shadow-none">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
              {isRtl ? 'فرم درخواست مشاوره اولیه' : 'Initial Consultation Request Form'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
              {isRtl
                ? 'اطلاعات اولیه شرکت خود را وارد کنید تا کارشناسان ما برای راهنمایی دقیق‌تر با شما تماس بگیرند.'
                : 'Enter your company\'s basic information so our experts can contact you with specific guidance.'
              }
            </p>
          </div>

          {submitSuccess ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-8 text-center animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                {isRtl ? 'درخواست شما با موفقیت ثبت شد!' : 'Your request was successfully submitted!'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-bold max-w-md mx-auto mb-6">
                {isRtl
                  ? 'اطلاعات شما در سیستم ثبت شد. همکاران ما در واحد ارتباط با تولیدکنندگان به زودی با شما تماس خواهند گرفت.'
                  : 'Your information has been recorded in the system. Our manufacturer relations team will contact you soon.'
                }
              </p>
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 inline-block text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-3 text-center">
                  {isRtl ? 'جهت تسریع در روند بررسی، کاتالوگ‌های خود را در تلگرام ارسال کنید:' : 'To speed up the process, send your catalogs via Telegram:'}
                </p>
                <button
                  onClick={handleTelegramClick}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-sm font-extrabold transition-all"
                >
                  <Send className="w-4 h-4" />
                  {isRtl ? 'ارسال فایل در تلگرام (@iranbimhub)' : 'Send Files on Telegram (@iranbimhub)'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {submitError && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <p className="text-sm font-bold text-rose-800 dark:text-rose-300">{submitError}</p>
                </div>
              )}

              {/* Honeypot field (hidden) */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                    {isRtl ? 'نام شرکت (حقوقی/برند) *' : 'Company / Brand Name *'}
                  </label>
                  <div className="relative">
                    <Building2 className={\`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 \${isRtl ? 'right-3' : 'left-3'}\`} />
                    <input
                      required
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder={isRtl ? 'مثال: فولاد مبارکه سپاهان' : 'e.g. Acme Corp'}
                      className={\`w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all \${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}\`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                    {isRtl ? 'نام برند تجاری (اختیاری)' : 'Commercial Brand Name (Optional)'}
                  </label>
                  <div className="relative">
                    <Package className={\`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 \${isRtl ? 'right-3' : 'left-3'}\`} />
                    <input
                      type="text"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleChange}
                      placeholder={isRtl ? 'نامی که در بازار شناخته می‌شوید' : 'The name you are known by in market'}
                      className={\`w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all \${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}\`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                    {isRtl ? 'نام و نام خانوادگی رابط *' : 'Contact Person Name *'}
                  </label>
                  <input
                    required
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                    {isRtl ? 'سمت سازمانی (اختیاری)' : 'Job Title (Optional)'}
                  </label>
                  <input
                    type="text"
                    name="roleTitle"
                    value={formData.roleTitle}
                    onChange={handleChange}
                    placeholder={isRtl ? 'مثال: مدیر فنی / مدیر فروش' : 'e.g. Technical Manager / Sales Manager'}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                    {isRtl ? 'شماره تماس تلفن همراه (جهت هماهنگی) *' : 'Mobile Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className={\`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 \${isRtl ? 'right-3' : 'left-3'}\`} />
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09..."
                      dir="ltr"
                      className={\`w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all \${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}\`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                    {isRtl ? 'آدرس ایمیل (اختیاری)' : 'Email Address (Optional)'}
                  </label>
                  <div className="relative">
                    <Mail className={\`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 \${isRtl ? 'right-3' : 'left-3'}\`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      dir="ltr"
                      className={\`w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all \${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}\`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                    {isRtl ? 'شهر دفتر مرکزی/کارخانه *' : 'Headquarters / Factory City *'}
                  </label>
                  <div className="relative">
                    <MapPin className={\`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 \${isRtl ? 'right-3' : 'left-3'}\`} />
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={\`w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all \${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}\`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                    {isRtl ? 'وب‌سایت یا پیج اینستاگرام' : 'Website or Instagram Page'}
                  </label>
                  <div className="relative">
                    <Globe className={\`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 \${isRtl ? 'right-3' : 'left-3'}\`} />
                    <input
                      type="text"
                      name="websiteOrSocial"
                      value={formData.websiteOrSocial}
                      onChange={handleChange}
                      dir="ltr"
                      className={\`w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all \${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}\`}
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-slate-800" />

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                      {isRtl ? 'دسته‌بندی اصلی محصولات *' : 'Main Product Category *'}
                    </label>
                    <input
                      required
                      type="text"
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleChange}
                      placeholder={isRtl ? 'مثال: شیرآلات بهداشتی، تاسیسات مکانیکی، روشنایی...' : 'e.g. Sanitary Ware, HVAC, Lighting...'}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                      {isRtl ? 'تخمین تعداد محصول برای مدل‌سازی' : 'Estimated number of products for modeling'}
                    </label>
                    <select
                      name="productCount"
                      value={formData.productCount}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all"
                    >
                      <option value="">{isRtl ? 'انتخاب کنید...' : 'Select...'}</option>
                      <option value="1-10">۱ تا ۱۰ محصول (1-10)</option>
                      <option value="11-50">۱۱ تا ۵۰ محصول (11-50)</option>
                      <option value="51-100">۵۱ تا ۱۰۰ محصول (51-100)</option>
                      <option value="100+">بیش از ۱۰۰ محصول (100+)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                      {isRtl ? 'آیا فایل‌های مدل‌سازی شده سه‌بعدی اطلاعات‌محور دارید؟ *' : 'Do you have data-driven 3D modeled files? *'}
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'yes', label: isRtl ? 'بله، فایل BIM آماده داریم' : 'Yes, we have ready BIM files' },
                        { value: 'no', label: isRtl ? 'خیر، نیاز به ساخت آبجکت داریم' : 'No, we need object creation' },
                        { value: 'not-sure', label: isRtl ? 'مطمئن نیستم، نیاز به مشاوره دارم' : 'Not sure, need consultation' }
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <input
                            type="radio"
                            name="hasBimFiles"
                            value={option.value}
                            checked={formData.hasBimFiles === option.value}
                            onChange={handleChange}
                            className="w-4 h-4 text-[#26B6B6] focus:ring-[#26B6B6]"
                          />
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.hasBimFiles === 'yes' && (
                    <div className="space-y-3 animate-fadeIn">
                      <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                        {isRtl ? 'فرمت فایل‌های موجود (می‌توانید چند مورد انتخاب کنید):' : 'Available file formats (you can select multiple):'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Revit (.rfa / .rvt)', 'IFC', 'ArchiCAD', 'AutoCAD 3D', 'SketchUp', 'Other'].map(format => (
                          <label key={format} className={\`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all \${formData.bimFormats.includes(format) ? 'bg-[#26B6B6] border-[#26B6B6] text-white' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:border-[#26B6B6]/50'}\`}>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={formData.bimFormats.includes(format)}
                              onChange={() => handleFormatChange(format)}
                            />
                            {format}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 border border-gray-150 dark:border-slate-800">
                <h4 className="text-sm font-black text-gray-800 dark:text-white mb-4">
                  {isRtl ? 'ارسال فایل کاتالوگ / اطلاعات تکمیلی' : 'Send Catalog / Additional Info'}
                </h4>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                      {isRtl ? 'لینک دانلود کاتالوگ یا فضای ابری (Google Drive, Dropbox و...)' : 'Download link for catalog or cloud storage'}
                    </label>
                    <input
                      type="url"
                      name="catalogUrl"
                      value={formData.catalogUrl}
                      onChange={handleChange}
                      dir="ltr"
                      placeholder="https://"
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-3">
                      {isRtl ? 'ترجیح می‌دهید فایل‌های حجیم کاتالوگ یا دیتاشیت را از چه طریقی ارسال کنید؟' : 'How would you prefer to send large catalog or datasheet files?'}
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="filesSentByTelegram" checked={formData.filesSentByTelegram} onChange={handleChange} className="w-4 h-4 text-[#26B6B6] rounded border-gray-300 focus:ring-[#26B6B6]" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Send className="w-3.5 h-3.5 text-[#138f8f]" /> {isRtl ? 'ارسال در تلگرام' : 'Send via Telegram'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="filesSentByWhatsApp" checked={formData.filesSentByWhatsApp} onChange={handleChange} className="w-4 h-4 text-[#26B6B6] rounded border-gray-300 focus:ring-[#26B6B6]" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> {isRtl ? 'ارسال در واتساپ' : 'Send via WhatsApp'}</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300">
                      {isRtl ? 'توضیحات تکمیلی (اختیاری)' : 'Additional Notes (Optional)'}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:border-[#26B6B6] focus:ring-1 focus:ring-[#26B6B6] outline-none text-sm font-bold transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#26B6B6] hover:bg-[#1e9494] disabled:bg-gray-400 text-white rounded-xl text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#26B6B6]/20"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  <span>{isRtl ? 'ثبت درخواست مشاوره' : 'Submit Consultation Request'}</span>
                </button>
                <p className="text-[11px] text-gray-500 font-bold text-center sm:text-start">
                  {isRtl
                    ? 'با ثبت این فرم، اطلاعات شما تنها جهت ارتباط همکاران ما استفاده خواهد شد.'
                    : 'By submitting this form, your information will only be used by our team to contact you.'
                  }
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Contact Channels Support */}
      <section className="px-4 max-w-4xl mx-auto pb-16">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-gray-150 dark:border-slate-800 text-center space-y-4">
          <p className="text-sm font-black text-gray-800 dark:text-gray-200">
            {isRtl ? 'نیاز به راهنمایی سریع‌تری دارید؟' : 'Need faster guidance?'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={handleTelegramClick} className="px-5 py-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-[#26B6B6] rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2">
              <Send className="w-4 h-4 text-[#138f8f]" />
              {isRtl ? 'پشتیبانی در تلگرام' : 'Support on Telegram'}
            </button>
            <button onClick={handleWhatsAppClick} className="px-5 py-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-[#26B6B6] rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              {isRtl ? 'پشتیبانی در واتساپ' : 'Support on WhatsApp'}
            </button>
            <a href="tel:+989391686878" className="px-5 py-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-[#26B6B6] rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              0939 168 6878
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
`;

fs.writeFileSync('src/components/views/ForManufacturersView.tsx', mfgViewCode, 'utf8');
console.log('ForManufacturersView.tsx written successfully');
