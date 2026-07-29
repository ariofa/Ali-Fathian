import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Factory,
  FileCheck2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wand2
} from 'lucide-react';

interface ForManufacturersViewProps {
  onNavigate: (view: string, customTextFa?: string, customTextEn?: string, param?: string) => void;
  onOpenAuthModal: () => void;
  currentUser: any;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
type HasBimFiles = 'yes' | 'no' | 'not-sure' | '';
type ArrayFieldName = 'bimFormats';

const CONTACT_PHONE_DISPLAY = '+98 939 168 6878';
const CONTACT_PHONE_INTERNATIONAL = '989391686878';

// Telegram does not provide a fully reliable public contact link by phone number alone.
// For production, replace this with an official Telegram username/bot URL, e.g. https://t.me/IranBIMhubSupport
const TELEGRAM_CONTACT_URL = `tg://resolve?phone=${CONTACT_PHONE_INTERNATIONAL}`;
const WHATSAPP_CONTACT_URL = `https://wa.me/${CONTACT_PHONE_INTERNATIONAL}`;

const initialFormState = {
  companyName: '',
  brandName: '',
  contactName: '',
  roleTitle: '',
  phone: '',
  email: '',
  city: '',
  websiteOrSocial: '',
  productCategory: '',
  hasBimFiles: '' as HasBimFiles,
  bimFormats: [] as string[],
  productCount: '',
  catalogUrl: '',
  filesSentByTelegram: false,
  filesSentByWhatsApp: false,
  message: '',
  hasAcceptedNotice: false,
  website: '' // Honeypot field; keep hidden in the UI.
};

export const ForManufacturersView: React.FC<ForManufacturersViewProps> = ({
  onNavigate,
  onOpenAuthModal,
  currentUser
}) => {
  const { isRtl } = useLanguage();
  const [formData, setFormData] = useState(initialFormState);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const contactMessage = encodeURIComponent(
    isRtl
      ? 'سلام، برای دریافت مشاوره رایگان BIM تولیدکنندگان در ایران‌بیم‌هاب پیام می‌دهم. می‌خواهم کاتالوگ یا اطلاعات اولیه محصولات را ارسال کنم.'
      : 'Hello, I am contacting IranBIMhub for free BIM consultation for manufacturers. I would like to send initial product catalogs or information.'
  );
  const telegramUrl = `${TELEGRAM_CONTACT_URL}&text=${contactMessage}`;
  const whatsappUrl = `${WHATSAPP_CONTACT_URL}?text=${contactMessage}`;

  const openManufacturerRegistration = () => {
    if (currentUser?.role === 'Manufacturer') {
      onNavigate('manufacturer-dashboard');
      return;
    }

    // Ask the existing auth modal to open in register mode and preselect Manufacturer.
    sessionStorage.setItem('iranbimhub_auth_mode', 'register');
    sessionStorage.setItem('iranbimhub_register_role', 'Manufacturer');
    onOpenAuthModal();
  };

  const scrollToConsultation = () => {
    document.getElementById('manufacturer-lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const productCategories = [
    { value: '', fa: 'انتخاب دسته محصول', en: 'Select product category' },
    { value: 'doors-windows', fa: 'در، پنجره و نما', en: 'Doors, windows and façade' },
    { value: 'facade-materials', fa: 'مصالح نما و پوشش ساختمان', en: 'Façade and building materials' },
    { value: 'flooring-tiles', fa: 'کاشی، سرامیک، سنگ و کف‌پوش', en: 'Tiles, stone and flooring' },
    { value: 'lighting-electrical', fa: 'روشنایی و تجهیزات برقی', en: 'Lighting and electrical' },
    { value: 'hvac-mep', fa: 'تأسیسات مکانیکی و HVAC', en: 'HVAC and mechanical equipment' },
    { value: 'plumbing-sanitary', fa: 'شیرآلات، لوله‌کشی و سرویس بهداشتی', en: 'Plumbing and sanitaryware' },
    { value: 'furniture-interior', fa: 'مبلمان، تجهیزات داخلی و اداری', en: 'Furniture and interiors' },
    { value: 'structural', fa: 'سازه و قطعات ساختمانی', en: 'Structural and construction elements' },
    { value: 'other', fa: 'سایر محصولات ساختمانی', en: 'Other building products' }
  ];

  const bimFormatOptions = ['Revit / RFA', 'RVT', 'IFC', 'ArchiCAD / GSM', 'DWG / CAD', 'SketchUp', 'STEP / SAT', 'Other'];

  const collaborationPaths = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      titleFa: 'هنوز فایل BIM ندارید؟',
      titleEn: 'Do not have BIM files yet?',
      descFa: 'اگر فقط کاتالوگ، دیتاشیت، نقشه یا عکس محصول دارید، نیازی به ثبت‌نام فوری نیست. اطلاعات اولیه را برای مشاوره رایگان ارسال کنید تا مسیر مناسب تولید آبجکت BIM استاندارد برای برند شما بررسی شود.',
      descEn: 'If you only have catalogs, datasheets, drawings or product photos, you do not need to register immediately. Send initial information for a free consultation so the right BIM creation path can be reviewed.',
      bulletsFa: ['ارسال کاتالوگ اولیه در تلگرام یا واتساپ', 'بررسی امکان تبدیل محصول به BIM', 'پیشنهاد مسیر تولید آبجکت استاندارد', 'هدایت به ساخت پروفایل برند پس از توافق'],
      bulletsEn: ['Send initial catalog via Telegram or WhatsApp', 'Review product BIM readiness', 'Recommend standard BIM creation path', 'Move to brand profile after agreement'],
      ctaFa: 'درخواست مشاوره رایگان',
      ctaEn: 'Request Free Consultation',
      mode: 'consultation'
    },
    {
      icon: <FileCheck2 className="w-6 h-6" />,
      titleFa: 'فایل BIM آماده دارید؟',
      titleEn: 'Already have BIM files?',
      descFa: 'اگر فایل Revit، IFC، ArchiCAD یا سایر فایل‌های BIM آماده دارید، مسیر رسمی شما ساخت پروفایل برند و آپلود فایل در پنل تولیدکننده است. فایل‌ها پس از پرداخت هزینه ارزیابی توسط کارشناس بررسی می‌شوند و در صورت تأیید منتشر خواهند شد.',
      descEn: 'If you already have Revit, IFC, ArchiCAD or other BIM files, the official path is to create a brand profile and upload files from the manufacturer panel. Files are reviewed by a specialist after the audit fee and published only after approval.',
      bulletsFa: ['آپلود رسمی فقط در پنل برند', 'ارزیابی فنی توسط کارشناس', 'گزارش اصلاحات و حداکثر ۳ نوبت بازبینی همان فایل', 'انتشار پس از تأیید نهایی'],
      bulletsEn: ['Official upload only from brand panel', 'Technical audit by specialist', 'Correction report and up to 3 re-reviews of the same file', 'Publishing after final approval'],
      ctaFa: 'ساخت پروفایل برند و آپلود فایل',
      ctaEn: 'Create Brand Profile & Upload Files',
      mode: 'profile'
    }
  ];

  const processSteps = [
    {
      titleFa: 'مشاوره یا ساخت پروفایل',
      titleEn: 'Consultation or Brand Profile',
      descFa: 'اگر فایل ندارید، مشاوره رایگان بگیرید؛ اگر فایل آماده دارید، پروفایل برند بسازید.',
      descEn: 'If you do not have files, request consultation; if you have files, create a brand profile.'
    },
    {
      titleFa: 'ارسال کاتالوگ یا آپلود رسمی',
      titleEn: 'Send Catalog or Official Upload',
      descFa: 'کاتالوگ اولیه برای مشاوره در تلگرام/واتساپ قابل ارسال است؛ فایل BIM آماده باید در پنل برند آپلود شود.',
      descEn: 'Initial catalogs can be sent via Telegram/WhatsApp for consultation; ready BIM files must be uploaded in the brand panel.'
    },
    {
      titleFa: 'تولید یا ارزیابی فایل',
      titleEn: 'Creation or Audit',
      descFa: 'برای فایل‌های آماده، ارزیابی پولی انجام می‌شود؛ برای فایل‌های ناموجود، مسیر تولید آبجکت BIM پیشنهاد می‌شود.',
      descEn: 'Ready files go through paid audit; missing files follow a BIM object creation proposal.'
    },
    {
      titleFa: 'تأیید و انتشار',
      titleEn: 'Approval & Publishing',
      descFa: 'انتشار محصول فقط پس از کنترل کیفیت، اصلاحات لازم و تأیید نهایی انجام می‌شود.',
      descEn: 'Products are published only after quality control, required corrections and final approval.'
    }
  ];

  const benefits = [
    {
      icon: <Building2 className="w-5 h-5" />,
      titleFa: 'ورود به مرحله طراحی',
      titleEn: 'Enter the Design Stage',
      descFa: 'محصول شما فقط در کاتالوگ دیده نمی‌شود؛ بلکه وارد مدل، نقشه و تصمیم‌گیری پروژه می‌شود.',
      descEn: 'Your product is not only seen in a catalog; it enters models, drawings and project decisions.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      titleFa: 'انتشار کنترل‌شده و معتبر',
      titleEn: 'Controlled and Trusted Publishing',
      descFa: 'هیچ فایل BIM بدون بررسی فنی منتشر نمی‌شود؛ این موضوع از اعتبار برند شما و کیفیت پلتفرم محافظت می‌کند.',
      descEn: 'No BIM file is published without technical review, protecting both your brand and platform quality.'
    },
    {
      icon: <Package className="w-5 h-5" />,
      titleFa: 'خدمات کامل دیجیتال‌سازی محصول',
      titleEn: 'Complete Product Digitization Service',
      descFa: 'اگر فایل ندارید، ایران‌بیم‌هاب می‌تواند مسیر تولید آبجکت BIM استاندارد را برای محصولات شما تعریف کند.',
      descEn: 'If you do not have files, IranBIMhub can define the standard BIM creation path for your products.'
    }
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const toggleArrayValue = (fieldName: ArrayFieldName, value: string) => {
    setFormData(prev => {
      const currentValues = prev[fieldName];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [fieldName]: nextValues };
    });
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) return isRtl ? 'نام شرکت یا برند را وارد کنید.' : 'Please enter company or brand name.';
    if (!formData.contactName.trim()) return isRtl ? 'نام فرد مسئول را وارد کنید.' : 'Please enter contact person name.';
    if (!formData.phone.trim()) return isRtl ? 'شماره تماس را وارد کنید.' : 'Please enter phone number.';
    if (!formData.city.trim()) return isRtl ? 'شهر محل فعالیت را وارد کنید.' : 'Please enter city.';
    if (!formData.productCategory) return isRtl ? 'دسته محصول را انتخاب کنید.' : 'Please select product category.';
    if (!formData.hasBimFiles) return isRtl ? 'وضعیت فایل BIM محصولات را مشخص کنید.' : 'Please specify BIM file status.';

    if (formData.hasBimFiles !== 'yes' && !formData.catalogUrl.trim() && !formData.filesSentByTelegram && !formData.filesSentByWhatsApp) {
      return isRtl
        ? 'برای مشاوره اولیه، لطفاً لینک کاتالوگ/صفحه محصول را وارد کنید یا ارسال از طریق تلگرام/واتساپ را انتخاب کنید.'
        : 'For initial consultation, please enter a catalog/product link or select Telegram/WhatsApp submission.';
    }

    if (!formData.hasAcceptedNotice) return isRtl ? 'لطفاً توضیح مربوط به مسیر رسمی آپلود و ارزیابی فنی را تأیید کنید.' : 'Please confirm the official upload and technical audit notice.';
    return '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus('error');
      setErrorMessage(validationError);
      return;
    }

    setSubmitStatus('submitting');

    try {
      const response = await fetch('/api/manufacturer-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.success === false) throw new Error(data?.message || 'Submission failed');

      setSubmitStatus('success');
      setFormData(initialFormState);
      setTimeout(() => {
        document.getElementById('manufacturer-lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        isRtl
          ? 'ثبت درخواست مشاوره با خطا مواجه شد. لطفاً دوباره تلاش کنید یا از طریق تلگرام/واتساپ پیام دهید.'
          : 'Consultation request failed. Please try again or contact us via Telegram/WhatsApp.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] dark:bg-gray-950 transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2326] via-[#2F3539] to-[#3B4247] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-start">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#26B6B6]/15 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#26B6B6]/15 border border-[#26B6B6]/25 rounded-full text-[11px] font-bold text-[#26B6B6]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'مشاوره رایگان برای تولیدکنندگان و صاحبان برند' : 'Free BIM Consultation for Manufacturers'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
              {isRtl ? 'مسیر درست ورود محصولات شما به BIM را پیدا کنیم' : 'Find the Right Path for Your Products to Enter BIM'}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              {isRtl
                ? 'اگر هنوز فایل BIM ندارید، کاتالوگ محصول را برای مشاوره اولیه ارسال کنید. اگر فایل BIM آماده دارید، مسیر حرفه‌ای شما ساخت پروفایل برند و آپلود رسمی فایل در پنل تولیدکننده است؛ سپس فایل‌ها با پرداخت هزینه ارزیابی توسط کارشناس بررسی و در صورت تأیید منتشر می‌شوند.'
                : 'If you do not have BIM files yet, send product catalogs for initial consultation. If you already have BIM files, the professional path is to create a brand profile and officially upload files from the manufacturer panel; then files are audited by a specialist after the audit fee and published only after approval.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={scrollToConsultation}
                className="px-7 py-3.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-98 shadow-md shadow-[#26B6B6]/20 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'درخواست مشاوره رایگان' : 'Request Free Consultation'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={openManufacturerRegistration}
                className="px-7 py-3.5 bg-white/5 border border-white/15 hover:bg-white/10 text-white rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Factory className="w-4 h-4" />
                <span>{isRtl ? 'ساخت پروفایل برند و آپلود فایل BIM' : 'Create Brand Profile & Upload BIM Files'}</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed max-w-2xl">
              {isRtl
                ? `تلگرام و واتساپ فقط برای ارسال کاتالوگ اولیه و هماهنگی مشاوره استفاده می‌شوند. آپلود رسمی فایل BIM آماده، از داخل پنل برند انجام می‌شود. شماره ارتباطی: ${CONTACT_PHONE_DISPLAY}`
                : `Telegram and WhatsApp are only for initial catalog sharing and consultation coordination. Official BIM file upload is done from the brand panel. Contact: ${CONTACT_PHONE_DISPLAY}`
              }
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/7 border border-white/12 rounded-3xl p-6 sm:p-7 backdrop-blur-sm shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#26B6B6]/15 text-[#26B6B6] flex items-center justify-center border border-[#26B6B6]/20">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">{isRtl ? 'دو مسیر بدون ابهام' : 'Two Clear Paths'}</h2>
                  <p className="text-[11px] text-gray-400 mt-1">{isRtl ? 'مشاوره برای کاتالوگ، پنل برند برای فایل آماده' : 'Consultation for catalogs, brand panel for ready files'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <strong className="text-sm text-white">{isRtl ? 'فایل BIM ندارید؟' : 'No BIM files yet?'}</strong>
                  <p className="text-[11px] text-gray-300 leading-relaxed mt-2">
                    {isRtl ? 'کاتالوگ را برای مشاوره اولیه بفرستید تا مسیر تولید آبجکت BIM بررسی شود.' : 'Send catalogs for initial consultation and BIM creation path review.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <strong className="text-sm text-white">{isRtl ? 'فایل BIM آماده دارید؟' : 'Ready BIM files?'}</strong>
                  <p className="text-[11px] text-gray-300 leading-relaxed mt-2">
                    {isRtl ? 'پروفایل برند بسازید، فایل را در پنل آپلود کنید و وارد مسیر ارزیابی فنی شوید.' : 'Create a brand profile, upload files in the panel and enter technical audit.'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-400/10 border border-amber-300/20 p-4 text-[11px] leading-relaxed text-amber-50">
                {isRtl
                  ? 'ارزیابی فایل آماده یک خدمت تخصصی و دارای هزینه است. هزینه می‌تواند بر اساس تعداد فایل‌ها، پیچیدگی محصول و سطح اصلاحات اعلام شود و شامل بررسی اولیه و حداکثر ۳ نوبت بازبینی اصلاحات همان فایل باشد.'
                  : 'Ready-file audit is a specialist paid service. Cost can depend on file count, product complexity and required corrections, and can include initial review plus up to 3 re-reviews of the same corrected file.'
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO PATHS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-start">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-black text-[#26B6B6] uppercase tracking-wider">
            {isRtl ? 'مسیر مناسب برند شما' : 'The Right Path for Your Brand'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {isRtl ? 'کاتالوگ برای مشاوره، فایل BIM آماده برای پنل برند' : 'Catalogs for Consultation, Ready BIM Files for Brand Panel'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {collaborationPaths.map((path) => {
            const isProfilePath = path.mode === 'profile';
            return (
              <div
                key={path.titleEn}
                className={`relative overflow-hidden rounded-[2rem] p-5 sm:p-7 shadow-sm hover:shadow-lg transition-all border group ${
                  isProfilePath
                    ? 'bg-slate-900 text-white border-slate-800'
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className={`absolute -top-20 -left-20 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isProfilePath ? 'bg-[#26B6B6]/20' : 'bg-emerald-400/10'}`} />

                <div className="relative z-10 flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 ${
                    isProfilePath
                      ? 'bg-[#26B6B6]/15 text-[#26B6B6] border border-[#26B6B6]/25'
                      : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {path.icon}
                  </div>

                  <div className="space-y-4 flex-1 min-w-0">
                    <div className="space-y-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black ${
                        isProfilePath
                          ? 'bg-[#26B6B6]/15 text-[#26B6B6]'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      }`}>
                        {isProfilePath
                          ? (isRtl ? 'مسیر رسمی انتشار فایل آماده' : 'Official publishing path')
                          : (isRtl ? 'مسیر مشاوره رایگان' : 'Free consultation path')}
                      </span>
                      <h3 className={`text-xl sm:text-2xl font-black leading-tight ${isProfilePath ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {isRtl ? path.titleFa : path.titleEn}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isProfilePath ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        {isRtl ? path.descFa : path.descEn}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(isRtl ? path.bulletsFa : path.bulletsEn).map(item => (
                        <div key={item} className={`flex items-center gap-2 text-xs font-bold ${isProfilePath ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}>
                          <CheckCircle2 className="w-4 h-4 text-[#26B6B6] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={isProfilePath ? openManufacturerRegistration : scrollToConsultation}
                      className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] ${
                        isProfilePath
                          ? 'bg-[#26B6B6] hover:bg-[#1e9494] text-white shadow-[#26B6B6]/20'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/15'
                      }`}
                    >
                      <span>{isRtl ? path.ctaFa : path.ctaEn}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BENEFITS + PROCESS */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-12 sm:py-16 text-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map(benefit => (
              <div key={benefit.titleEn} className="bg-[#FBFBFC] dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-5">
                <div className="w-11 h-11 rounded-2xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white mb-2">{isRtl ? benefit.titleFa : benefit.titleEn}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{isRtl ? benefit.descFa : benefit.descEn}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6" id="manufacturer-process">
            <div className="max-w-3xl space-y-3">
              <span className="text-[11px] font-black text-[#26B6B6] uppercase tracking-wider">
                {isRtl ? 'فرآیند پیشنهادی' : 'Recommended Process'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {isRtl ? 'از مشاوره اولیه تا انتشار کنترل‌شده' : 'From Initial Consultation to Controlled Publishing'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {processSteps.map((step, index) => (
                <div key={step.titleEn} className="relative bg-[#FBFBFC] dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-5">
                  <div className="w-9 h-9 rounded-2xl bg-[#26B6B6] text-white flex items-center justify-center text-sm font-black mb-4">
                    {isRtl ? ['۱', '۲', '۳', '۴'][index] : index + 1}
                  </div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white mb-2">{isRtl ? step.titleFa : step.titleEn}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{isRtl ? step.descFa : step.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AUDIT NOTICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-start">
        <div className="bg-slate-900 text-white rounded-[2rem] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1.5px,transparent_1.5px)] [background-size:22px_22px]" />
          <div className="relative z-10 lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 text-[#26B6B6] text-[11px] font-black">
              <ClipboardCheck className="w-4 h-4" />
              <span>{isRtl ? 'ارزیابی فنی فایل BIM آماده' : 'Technical Audit for Ready BIM Files'}</span>
            </div>
            <h2 className="text-2xl font-black">
              {isRtl ? 'آپلود رسمی فایل‌های آماده فقط در پنل برند انجام می‌شود' : 'Official Upload of Ready Files Happens Only in the Brand Panel'}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {isRtl
                ? 'بررسی فایل‌های آماده یک خدمت تخصصی و دارای هزینه است. این ارزیابی می‌تواند شامل بررسی اولیه، گزارش اصلاحات و حداکثر ۳ نوبت بازبینی اصلاحات همان فایل باشد. اگر اصلاحات فراتر از محدوده ارزیابی باشد، تولیدکننده می‌تواند آن را با تیم خود انجام دهد یا درخواست اصلاح و استانداردسازی را به ایران‌بیم‌هاب بسپارد.'
                : 'Ready-file review is a specialist paid service. It can include initial audit, correction report and up to 3 re-reviews of the same corrected file. If corrections go beyond the audit scope, the manufacturer can handle them internally or request IranBIMhub standardization service.'
              }
            </p>
          </div>
          <div className="relative z-10 lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              type="button"
              onClick={openManufacturerRegistration}
              className="px-5 py-3 bg-[#26B6B6] hover:bg-[#1e9494] rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Factory className="w-4 h-4" />
              <span>{isRtl ? 'ساخت پروفایل برند' : 'Create Brand Profile'}</span>
            </button>
            <a href="#manufacturer-lead-form" className="px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{isRtl ? 'نیاز به مشاوره دارم' : 'I Need Consultation'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="manufacturer-lead-form" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-start">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#1E2326] to-[#2F3539] text-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#26B6B6]/15 text-[#26B6B6] flex items-center justify-center border border-[#26B6B6]/25 shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black">{isRtl ? 'فرم درخواست مشاوره اولیه' : 'Initial Consultation Request Form'}</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                  {isRtl
                    ? 'این فرم برای بررسی اولیه و راهنمایی تولیدکنندگان است. ارسال کاتالوگ در تلگرام/واتساپ برای مشاوره مناسب است؛ اما آپلود رسمی فایل BIM آماده در پنل برند انجام می‌شود.'
                    : 'This form is for initial review and guidance. Sending catalogs via Telegram/WhatsApp is suitable for consultation; official ready BIM file upload happens in the brand panel.'
                  }
                </p>
              </div>
            </div>
          </div>

          {submitStatus === 'success' ? (
            <div className="p-6 sm:p-8">
              <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {isRtl ? 'درخواست مشاوره شما ثبت شد' : 'Your consultation request has been submitted'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
                  {isRtl
                    ? 'از شما سپاسگزاریم. تیم ایران‌بیم‌هاب وضعیت محصولات و فایل‌های شما را بررسی می‌کند و برای پیشنهاد مسیر مناسب با شما تماس خواهد گرفت.'
                    : 'Thank you. IranBIMhub will review your product/file status and contact you to recommend the right path.'
                  }
                </p>
                <button
                  onClick={() => {
                    setSubmitStatus('idle');
                    setErrorMessage('');
                  }}
                  className="px-5 py-2.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                >
                  {isRtl ? 'ثبت درخواست دیگر' : 'Submit Another Request'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {submitStatus === 'error' && errorMessage && (
                <div className="flex items-start gap-2 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 p-4 text-sm text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'نام شرکت / برند *' : 'Company / Brand Name *'}</span>
                  <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder={isRtl ? 'مثلاً: شرکت آریا پنجره' : 'e.g. Aria Window Co.'} />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'نام تجاری محصول / برند' : 'Commercial Brand Name'}</span>
                  <input name="brandName" value={formData.brandName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder={isRtl ? 'در صورت تفاوت با نام شرکت' : 'If different from company name'} />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'نام فرد مسئول *' : 'Contact Person *'}</span>
                  <input name="contactName" value={formData.contactName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder={isRtl ? 'نام مدیر فروش، فنی یا بازاریابی' : 'Sales, technical or marketing manager'} />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'سمت سازمانی' : 'Role / Position'}</span>
                  <input name="roleTitle" value={formData.roleTitle} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder={isRtl ? 'مثلاً: مدیر فروش' : 'e.g. Sales Manager'} />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'شماره تماس *' : 'Phone Number *'}</span>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`} placeholder={isRtl ? 'شماره موبایل یا تلفن شرکت' : 'Mobile or company phone'} />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'ایمیل' : 'Email'}</span>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`} placeholder="name@company.com" dir="ltr" />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'شهر محل فعالیت *' : 'City *'}</span>
                  <div className="relative">
                    <MapPin className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                    <input name="city" value={formData.city} onChange={handleInputChange} className={`w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`} placeholder={isRtl ? 'مثلاً: تهران، تبریز، اصفهان' : 'e.g. Tehran, Tabriz, Isfahan'} />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'وب‌سایت یا شبکه اجتماعی برند' : 'Website or Social Page'}</span>
                  <input name="websiteOrSocial" value={formData.websiteOrSocial} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder="https://example.com" dir="ltr" />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'دسته محصول *' : 'Product Category *'}</span>
                  <select name="productCategory" value={formData.productCategory} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors">
                    {productCategories.map(category => <option key={category.value} value={category.value}>{isRtl ? category.fa : category.en}</option>)}
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'وضعیت فایل BIM محصولات شما چیست؟ *' : 'What is your current BIM file status? *'}</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'no', fa: 'فایل BIM نداریم؛ مشاوره می‌خواهیم', en: 'No BIM files; need consultation' },
                    { value: 'yes', fa: 'فایل BIM آماده داریم', en: 'We already have BIM files' },
                    { value: 'not-sure', fa: 'مطمئن نیستیم؛ نیاز به راهنمایی داریم', en: 'Not sure; need guidance' }
                  ].map(option => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, hasBimFiles: option.value as HasBimFiles }))}
                      className={`px-4 py-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer text-start ${
                        formData.hasBimFiles === option.value
                          ? 'bg-[#26B6B6]/10 border-[#26B6B6] text-[#138f8f] dark:text-[#26B6B6]'
                          : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#26B6B6]/50'
                      }`}
                    >
                      {isRtl ? option.fa : option.en}
                    </button>
                  ))}
                </div>
              </div>

              {formData.hasBimFiles === 'yes' && (
                <div className="rounded-3xl bg-cyan-50 dark:bg-cyan-950/25 border border-cyan-100 dark:border-cyan-900 p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#26B6B6] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white">{isRtl ? 'مسیر رسمی فایل BIM آماده' : 'Official Path for Ready BIM Files'}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                        {isRtl
                          ? 'برای فایل‌های BIM آماده، پیشنهاد می‌کنیم پروفایل برند بسازید و فایل را از داخل پنل تولیدکننده آپلود کنید. ارسال فایل آماده در تلگرام/واتساپ مسیر رسمی انتشار نیست.'
                          : 'For ready BIM files, we recommend creating a brand profile and uploading files from the manufacturer panel. Sending ready files by Telegram/WhatsApp is not the official publishing path.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'فرمت فایل‌های موجود' : 'Existing File Formats'}</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {bimFormatOptions.map(format => (
                        <button
                          type="button"
                          key={format}
                          onClick={() => toggleArrayValue('bimFormats', format)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            formData.bimFormats.includes(format)
                              ? 'bg-[#26B6B6] border-[#26B6B6] text-white'
                              : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#26B6B6]/50'
                          }`}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openManufacturerRegistration}
                    className="px-5 py-3 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Factory className="w-4 h-4" />
                    <span>{isRtl ? 'ساخت پروفایل برند و آپلود رسمی فایل' : 'Create Brand Profile & Official Upload'}</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'تعداد تقریبی محصولات' : 'Approximate Product Count'}</span>
                  <input name="productCount" value={formData.productCount} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder={isRtl ? 'مثلاً: ۱۰ محصول یا ۳ سری محصول' : 'e.g. 10 products or 3 product series'} />
                </label>

                <div className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'لینک کاتالوگ / دیتاشیت / صفحه محصول' : 'Catalog / Datasheet / Product Link'}</span>
                  <input name="catalogUrl" value={formData.catalogUrl} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder="https://drive.google.com/..." dir="ltr" />
                </div>
              </div>

              <div className="rounded-3xl bg-[#26B6B6]/5 border border-[#26B6B6]/15 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <UploadCloud className="w-5 h-5 text-[#26B6B6] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-black text-gray-800 dark:text-white">{isRtl ? 'ارسال کاتالوگ اولیه برای مشاوره' : 'Send Initial Catalog for Consultation'}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                      {isRtl
                        ? 'تلگرام و واتساپ برای ارسال کاتالوگ، دیتاشیت، عکس محصول یا اطلاعات اولیه مناسب هستند؛ نه برای آپلود رسمی فایل BIM آماده جهت انتشار.'
                        : 'Telegram and WhatsApp are suitable for catalogs, datasheets, product photos or initial information; not for official ready BIM file upload for publishing.'
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-3">
                    <input type="checkbox" name="filesSentByTelegram" checked={formData.filesSentByTelegram} onChange={handleCheckboxChange} className="w-4 h-4 accent-[#26B6B6]" />
                    <span>{isRtl ? 'کاتالوگ یا اطلاعات اولیه را در تلگرام ارسال می‌کنم' : 'I will send catalog/initial info via Telegram'}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-3">
                    <input type="checkbox" name="filesSentByWhatsApp" checked={formData.filesSentByWhatsApp} onChange={handleCheckboxChange} className="w-4 h-4 accent-[#26B6B6]" />
                    <span>{isRtl ? 'کاتالوگ یا اطلاعات اولیه را در واتساپ ارسال می‌کنم' : 'I will send catalog/initial info via WhatsApp'}</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a href={telegramUrl} className="px-4 py-2.5 rounded-xl bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>{isRtl ? 'ارسال کاتالوگ در تلگرام' : 'Send Catalog on Telegram'}</span>
                  </a>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/15 text-[#128C7E] border border-[#25D366]/20 text-xs font-extrabold transition-all flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{isRtl ? 'ارسال کاتالوگ در واتساپ' : 'Send Catalog on WhatsApp'}</span>
                  </a>
                </div>
              </div>

              <label className="space-y-2 block">
                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'توضیح کوتاه درباره محصولات یا نیاز شما' : 'Short Message About Your Products or Need'}</span>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors resize-none" placeholder={isRtl ? 'مثلاً بگویید چه محصولاتی دارید، آیا فایل آماده دارید، یا نیاز به تولید آبجکت BIM دارید.' : 'Tell us what products you have, whether files exist, or if BIM creation is needed.'} />
              </label>

              <label className="flex items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-100 dark:border-amber-900 p-4 cursor-pointer">
                <input type="checkbox" name="hasAcceptedNotice" checked={formData.hasAcceptedNotice} onChange={handleCheckboxChange} className="mt-1 w-4 h-4 accent-[#26B6B6] shrink-0" />
                <span className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  {isRtl
                    ? 'می‌دانم که ارسال کاتالوگ در تلگرام/واتساپ فقط برای مشاوره اولیه است؛ آپلود رسمی فایل BIM آماده از داخل پنل برند انجام می‌شود و ارزیابی فنی آن یک خدمت تخصصی و دارای هزینه است.'
                    : 'I understand that sending catalogs via Telegram/WhatsApp is only for initial consultation; official ready BIM file upload happens in the brand panel and technical audit is a paid specialist service.'
                  }
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-2">
                <button type="button" onClick={() => onNavigate('home')} className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-950 transition-all cursor-pointer">
                  {isRtl ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
                </button>

                <button type="submit" disabled={submitStatus === 'submitting'} className="px-7 py-3 bg-[#26B6B6] hover:bg-[#1e9494] disabled:bg-gray-400 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#26B6B6]/20">
                  {submitStatus === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isRtl ? 'در حال ثبت...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isRtl ? 'ارسال درخواست مشاوره' : 'Submit Consultation Request'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};