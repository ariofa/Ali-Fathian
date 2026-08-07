import React, { useEffect, useState } from 'react';
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
  HelpCircle,
  ChevronDown,
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

const CONTACT_PHONE_DISPLAY = '+98 939 168 6878';
const CONTACT_PHONE_INTERNATIONAL = '989391686878';

// Telegram does not provide a fully reliable public contact link by phone number alone.
// For production, replace this with an official Telegram username/bot URL, e.g. https://t.me/IranBIMhubSupport
const TELEGRAM_CONTACT_URL = `tg://resolve?phone=${CONTACT_PHONE_INTERNATIONAL}`;
const WHATSAPP_CONTACT_URL = `https://wa.me/${CONTACT_PHONE_INTERNATIONAL}`;

const initialFormState = {
  companyName: '',
  contactName: '',
  phone: '',
  productCategory: '',
  hasBimFiles: '' as HasBimFiles,
  catalogUrl: '',
  filesSentByTelegram: false,
  filesSentByWhatsApp: false,
  email: '',
  websiteOrSocial: '',
  productCount: '',
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
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const contactMessage = encodeURIComponent(
    isRtl
      ? 'سلام، برای معرفی محصول و تعیین مسیر همکاری در ایران‌بیم‌هاب پیام می‌دهم. می‌خواهم کاتالوگ یا اطلاعات اولیه محصولات را ارسال کنم.'
      : 'Hello, I am contacting IranBIMhub to introduce a product and determine the right collaboration path. I would like to send initial product catalogs or information.'
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

  const scrollToReadyBimPath = () => {
    document.getElementById('manufacturer-ready-files-path')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // The Hero consultation CTA sets this target before navigating here.
  // Poll briefly because the view is mounted after the app transition animation.
  useEffect(() => {
    const target = sessionStorage.getItem('iranbimhub_manufacturer_page_target');
    if (target !== 'consultation') return;

    sessionStorage.removeItem('iranbimhub_manufacturer_page_target');
    let attempts = 0;
    const timer = window.setInterval(() => {
      const form = document.getElementById('manufacturer-lead-form');
      attempts += 1;

      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.clearInterval(timer);
      } else if (attempts >= 40) {
        window.clearInterval(timer);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, []);

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



  const collaborationPaths = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      titleFa: 'هنوز فایل BIM ندارید؟',
      titleEn: 'Do not have BIM files yet?',
      descFa: 'اگر فقط کاتالوگ، دیتاشیت، نقشه یا عکس محصول دارید، نیازی به ثبت‌نام فوری نیست. اطلاعات اولیه را ارسال کنید تا وضعیت محصول و مسیر مناسب همکاری بررسی شود.',
      descEn: 'If you only have catalogs, datasheets, drawings or product photos, you do not need to register immediately. Send initial information so the product status and suitable collaboration path can be reviewed.',
      bulletsFa: ['ارسال کاتالوگ یا اطلاعات اولیه محصول', 'بررسی وضعیت محصول و فایل‌های موجود', 'تعیین مسیر آماده‌سازی یا تولید BIM', 'اعلام قدم بعدی همکاری'],
      bulletsEn: ['Send an initial catalog or product information', 'Review product status and available files', 'Determine the BIM preparation or creation path', 'Receive the next collaboration step'],
      ctaFa: 'درخواست بررسی اولیه',
      ctaEn: 'Request Initial Review',
      mode: 'consultation'
    },
    {
      icon: <FileCheck2 className="w-6 h-6" />,
      titleFa: 'فایل BIM آماده دارید؟',
      titleEn: 'Already have BIM files?',
      descFa: 'اگر فایل Revit، IFC، ArchiCAD یا سایر فایل‌های BIM آماده دارید، مسیر رسمی شما ساخت پروفایل برند و معرفی فایل برای بررسی فنی است. پس از تعیین دامنهٔ کار، ارزیابی تخصصی، گزارش اصلاحات و مسیر انتشار به‌صورت شفاف با شما هماهنگ می‌شود.',
      descEn: 'If you already have Revit, IFC, ArchiCAD or other BIM files, the official path is to create a brand profile and introduce files for technical review. After scope is defined, specialist review, a correction report, and the publication path are coordinated transparently.',
      bulletsFa: ['معرفی رسمی فایل در پنل برند', 'تعیین دامنهٔ بررسی فنی', 'گزارش اصلاحات و مسیر بازبینی متناسب با فایل', 'انتشار پس از تکمیل شرایط مربوطه'], 
      bulletsEn: ['Official file introduction in the brand panel', 'Technical review scope definition', 'Correction report and review path suited to the file', 'Publication after relevant conditions are met'], 
      ctaFa: 'ساخت پروفایل برند و آپلود فایل',
      ctaEn: 'Create Brand Profile & Upload Files',
      mode: 'profile'
    }
  ];

  const processSteps = [
    {
      titleFa: 'معرفی محصول و تعیین مسیر',
      titleEn: 'Product Introduction & Path Definition',
      descFa: 'اطلاعات اولیه محصول و وضعیت فایل‌های موجود بررسی می‌شود تا مسیر مناسب همکاری مشخص شود.',
      descEn: 'Initial product information and available-file status are reviewed to determine the suitable collaboration path.'
    },
    {
      titleFa: 'تعیین دامنهٔ کار',
      titleEn: 'Scope Definition',
      descFa: 'بر اساس نوع محصول، کاتالوگ و وضعیت فایل، خدمات موردنیاز و خروجی مورد انتظار مشخص می‌شوند.',
      descEn: 'Based on product type, catalog, and file status, required services and expected deliverables are defined.'
    },
    {
      titleFa: 'خدمات تخصصی محصول',
      titleEn: 'Specialist Product Services',
      descFa: 'خدماتی مانند ارزیابی فنی فایل، اصلاح Family، تولید آبجکت BIM یا آماده‌سازی اطلاعات محصول متناسب با دامنهٔ کار برآورد می‌شوند.',
      descEn: 'Services such as technical file audit, Family correction, BIM object creation, or product-information preparation are estimated according to scope.'
    },
    {
      titleFa: 'تأیید و انتشار',
      titleEn: 'Approval & Publishing',
      descFa: 'انتشار محصول فقط پس از کنترل کیفیت، اصلاحات لازم و تأیید نهایی انجام می‌شود.',
      descEn: 'Products are published only after quality control, required corrections and final approval.'
    }
  ];

  const manufacturerFaqs = [
    {
      qFa: 'اگر فایل BIM آماده نداریم، می‌توانیم همکاری را شروع کنیم؟',
      qEn: 'Can we start if we do not have ready BIM files?',
      aFa: 'بله. می‌توانید با کاتالوگ، دیتاشیت، نقشه یا اطلاعات واقعی محصول شروع کنید. بررسی اولیه کمک می‌کند مسیر مناسب آماده‌سازی یا تولید BIM برای محصول شما مشخص شود.',
      aEn: 'Yes. Start with your catalog, datasheet, drawings, or real product information. Initial review helps determine the right BIM preparation or creation path.'
    },
    {
      qFa: 'بررسی اولیه شامل چه چیزی است؟',
      qEn: 'What does the initial review include?',
      aFa: 'در بررسی اولیه، وضعیت اطلاعات محصول، کاتالوگ و فایل‌های موجود بررسی می‌شود تا قدم بعدی همکاری مشخص شود. این مرحله جایگزین ارزیابی فنی کامل فایل نیست.',
      aEn: 'Initial review considers available product information, catalogs, and files to determine the next collaboration step. It is not a substitute for a full technical file audit.'
    },
    {
      qFa: 'اگر فایل BIM آماده داشته باشیم، چه اتفاقی می‌افتد؟',
      qEn: 'What happens if we already have BIM files?',
      aFa: 'پس از ایجاد یا تکمیل پروفایل برند، فایل برای تعیین دامنه بررسی فنی معرفی می‌شود. در صورت نیاز، گزارش اصلاحات و مسیر بازبینی متناسب با وضعیت فایل، نوع محصول و خروجی موردنیاز با شما هماهنگ خواهد شد.',
      aEn: 'After creating or completing the brand profile, the file is introduced to define the technical review scope. If needed, a correction report and review path suited to file status, product type, and required deliverables are coordinated with you.'
    },
    {
      qFa: 'هزینه خدمات چگونه مشخص می‌شود؟',
      qEn: 'How are service costs determined?',
      aFa: 'خدمات تخصصی مانند مدل‌سازی، اصلاح Family یا ارزیابی فنی پس از مشخص‌شدن نوع محصول، وضعیت فایل، خروجی موردنیاز و دامنه کار، به‌صورت شفاف برآورد می‌شوند.',
      aEn: 'Specialist services such as modeling, Family correction, or technical audit are estimated transparently after product type, file status, deliverables, and scope are defined.'
    },
    {
      qFa: 'برای شروع چه اطلاعاتی باید ارسال کنیم؟',
      qEn: 'What information should we send to start?',
      aFa: 'نام برند یا شرکت، دسته محصول، راه ارتباطی و هر اطلاعات اولیه‌ای که از محصول دارید کافی است. کاتالوگ، دیتاشیت، نقشه یا لینک وب‌سایت مسیر بررسی را دقیق‌تر می‌کند.',
      aEn: 'Your brand or company name, product category, contact details, and any initial product information are enough. Catalogs, datasheets, drawings, or website links make the review path more precise.'
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



  const validateForm = () => {
    if (!formData.companyName.trim()) return isRtl ? 'نام برند یا شرکت را وارد کنید.' : 'Please enter brand or company name.';
    if (!formData.contactName.trim()) return isRtl ? 'نام شخص مسئول را وارد کنید.' : 'Please enter contact person name.';
    if (!formData.phone.trim()) return isRtl ? 'شماره تماس را وارد کنید.' : 'Please enter phone number.';
    if (!formData.productCategory) return isRtl ? 'دسته محصول را انتخاب کنید.' : 'Please select product category.';
    if (!formData.hasBimFiles) return isRtl ? 'وضعیت BIM محصول را مشخص کنید.' : 'Please specify BIM product status.';
    if (!formData.hasAcceptedNotice) return isRtl ? 'لطفاً اجازه تماس برای پیگیری درخواست را تأیید کنید.' : 'Please confirm that we may contact you about this request.';
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
          ? 'ثبت درخواست بررسی اولیه با خطا مواجه شد. لطفاً دوباره تلاش کنید یا از طریق تلگرام/واتساپ پیام دهید.'
          : 'Initial review request failed. Please try again or contact us via Telegram/WhatsApp.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] dark:bg-gray-950 transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2326] via-[#2F3539] to-[#3B4247] text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-start">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#26B6B6]/15 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-9 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#26B6B6]/15 border border-[#26B6B6]/25 rounded-full text-xs font-bold text-[#26B6B6]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'برای تولیدکنندگان و صاحبان برندهای ساختمانی' : 'For building-product manufacturers and brand owners'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
              {isRtl
                ? 'با ایران بیم هاب محصول شما پیش از خرید، در مرحلهٔ طراحی وارد نقشه‌های پروژه می‌شود.'
                : 'With IranBIMhub, your product can enter project drawings before procurement.'}
            </h1>

            <p className="max-w-3xl text-sm sm:text-base text-gray-200 leading-8">
              {isRtl
                ? 'ایران بیم هاب به تولیدکنندگان کمک می‌کند اطلاعات واقعی محصولات خود را به آبجکت BIM و محتوای قابل‌استفاده در طراحی نزدیک کنند؛ تا معماران و مهندسان محصول را در مرحلهٔ انتخاب پروژه ببینند و بررسی کنند.'
                : 'IranBIMhub helps manufacturers bring real product information closer to BIM objects and design-ready content, so architects and engineers can review products during project selection.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={scrollToConsultation}
                className="px-7 py-3.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-98 shadow-md shadow-[#26B6B6]/20 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'درخواست مشاوره اولیه' : 'Request Initial Consultation'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={scrollToReadyBimPath}
                className="px-7 py-3.5 bg-white/5 border border-white/15 hover:bg-white/10 text-white rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-[#26B6B6]" />
                <span>{isRtl ? 'فایل BIM آماده دارید؟' : 'Already have BIM files?'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/12 bg-white/7 p-6 sm:p-7 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#26B6B6]/15 text-[#26B6B6] flex items-center justify-center border border-[#26B6B6]/20"><Factory className="w-5 h-5" /></div>
                <div><h2 className="text-base font-black text-white">{isRtl ? 'از محصول واقعی تا انتخاب در طراحی' : 'From real product to design selection'}</h2><p className="mt-1 text-xs text-gray-400">{isRtl ? 'دو نقطهٔ شروع، متناسب با وضعیت برند شما' : 'Two starting points for your brand'}</p></div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm font-black text-white">{isRtl ? 'فایل BIM ندارید؟' : 'No BIM files yet?'}</p><p className="mt-2 text-xs leading-6 text-gray-300">{isRtl ? 'با کاتالوگ، دیتاشیت یا اطلاعات واقعی محصول شروع کنید.' : 'Start with your catalog, datasheet, or real product information.'}</p></div>
                <div className="rounded-2xl border border-[#26B6B6]/20 bg-[#26B6B6]/8 p-4"><p className="text-sm font-black text-white">{isRtl ? 'فایل BIM آماده دارید؟' : 'Ready BIM files?'}</p><p className="mt-2 text-xs leading-6 text-gray-200">{isRtl ? 'فایل را برای بررسی فنی و مسیر انتشار معرفی کنید.' : 'Introduce the file for technical review and the publication path.'}</p></div>
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
            {isRtl ? 'شروع با اطلاعات محصول، سپس تعیین مسیر مناسب' : 'Start with product information, then define the right path'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {collaborationPaths.map((path) => {
            const isProfilePath = path.mode === 'profile';
            return (
              <div
                key={path.titleEn}
                id={isProfilePath ? 'manufacturer-ready-files-path' : undefined}
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
                          : (isRtl ? 'مسیر بررسی اولیه' : 'Initial review path')}
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
                {isRtl ? 'از بررسی اولیه تا مسیر انتشار' : 'From Initial Review to Publication Path'}
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
                ? 'بررسی اولیه برای شناخت محصول و انتخاب مسیر انجام می‌شود. خدمات تخصصی مانند مدل‌سازی، اصلاح یا ارزیابی فنی فایل پس از مشخص‌شدن دامنهٔ کار، خروجی موردنیاز و زمان‌بندی، به‌صورت شفاف برآورد می‌شوند.'
                : 'Initial review is used to understand the product and select the right path. Specialist services such as modeling, correction, or technical file audit are estimated transparently after scope, deliverables, and timing are defined.'
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
              <span>{isRtl ? 'درخواست بررسی اولیه' : 'Request Initial Review'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOUNDING BRANDS: a restrained opportunity message after service scope clarification, before the decision form. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 text-start">
        <div className="border-s-4 border-[#D6A01D] bg-[#D6A01D]/8 dark:bg-[#D6A01D]/10 rounded-2xl px-5 py-5 sm:px-7 sm:py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-10 h-10 rounded-2xl bg-[#D6A01D]/15 text-[#B9820D] dark:text-[#D6A01D] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-[#B9820D] dark:text-[#D6A01D]">
                {isRtl ? 'ظرفیت محدود' : 'Limited capacity'}
              </p>
              <h2 className="mt-1 text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {isRtl ? 'برنامهٔ برندهای آغازگر ایران بیم هاب' : 'IranBIMhub Founding Brands Program'}
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
                {isRtl
                  ? 'برای ظرفیت محدودی از برندهایی که در مرحلهٔ آغاز با ایران بیم هاب وارد مسیر می‌شوند، بررسی اولیهٔ محصول و تعیین مسیر ورود به BIM با شرایط ویژه انجام می‌شود.'
                  : 'For a limited number of brands entering the IranBIMhub path at this early stage, initial product review and BIM entry-path definition are offered under special conditions.'}
              </p>
              <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                {isRtl
                  ? 'خدمات تخصصی مانند تولید، اصلاح یا ارزیابی فنی فایل پس از تعیین دامنهٔ کار، به‌صورت جداگانه و شفاف برآورد می‌شوند.'
                  : 'Specialist services such as modeling, correction, or technical file review are estimated separately and transparently after scope is defined.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToConsultation}
            className="shrink-0 self-start lg:self-auto px-5 py-3 bg-[#D6A01D] hover:bg-[#B9820D] text-[#2B2F33] rounded-xl text-xs font-black transition-colors cursor-pointer"
          >
            {isRtl ? 'درخواست بررسی اولیه' : 'Request Initial Review'}
          </button>
        </div>
      </section>

      {/* FAQ: placed after service-path clarification and before the lead form to remove hesitation at the decision point. */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 text-start">
        <div className="border-y border-gray-200 dark:border-gray-800 py-10 sm:py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[#26B6B6]">
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs font-black">{isRtl ? 'پرسش‌های پرتکرار تولیدکنندگان' : 'Manufacturer FAQ'}</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              {isRtl ? 'پیش از شروع همکاری، پاسخ چند پرسش مهم' : 'A few important answers before you begin'}
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
              {isRtl ? 'اگر پاسخ پرسش شما اینجا نیست، می‌توانید از مسیر بررسی اولیه محصول با ما در ارتباط باشید.' : 'If your question is not answered here, contact us through the initial product review path.'}
            </p>
          </div>

          <div className="mt-7 space-y-3">
            {manufacturerFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.qFa} className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="min-h-[56px] w-full px-5 py-4 flex items-center justify-between gap-5 text-start text-sm font-black text-gray-800 dark:text-gray-100 cursor-pointer hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{isRtl ? faq.qFa : faq.qEn}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 text-[#26B6B6] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {isRtl ? faq.aFa : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="manufacturer-lead-form" className="scroll-mt-24 sm:scroll-mt-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-start">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#1E2326] to-[#2F3539] text-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#26B6B6]/15 text-[#26B6B6] flex items-center justify-center border border-[#26B6B6]/25 shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black">{isRtl ? 'فرم درخواست بررسی اولیه محصول' : 'Initial Product Review Request Form'}</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                  {isRtl
                    ? 'این فرم برای شناخت محصول و تعیین مسیر همکاری است. کاتالوگ یا اطلاعات اولیه برای شروع کافی است؛ جزئیات خدمات تخصصی پس از بررسی اولیه مشخص می‌شوند.'
                    : 'This form is used to understand the product and determine the collaboration path. An initial catalog or product information is enough to start; specialist service details are defined after the initial review.'
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
                  {isRtl ? 'درخواست بررسی اولیه شما ثبت شد' : 'Your initial review request has been submitted'}
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

              <input type="text" name="website" value={formData.website} onChange={handleInputChange} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="rounded-2xl bg-[#26B6B6]/5 border border-[#26B6B6]/15 p-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
                {isRtl
                  ? 'برای شروع، فقط اطلاعات پایهٔ برند و محصولتان را ثبت کنید. لازم نیست فایل BIM یا همهٔ اطلاعات فنی محصول را همین حالا آماده داشته باشید.'
                  : 'To begin, submit only your brand and product basics. You do not need to have BIM files or all technical information ready now.'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-black text-gray-700 dark:text-gray-300">{isRtl ? 'نام برند یا شرکت *' : 'Brand or Company Name *'}</span>
                  <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder={isRtl ? 'مثلاً: شرکت آریا پنجره' : 'e.g. Aria Window Co.'} />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-black text-gray-700 dark:text-gray-300">{isRtl ? 'نام شخص مسئول *' : 'Contact Person *'}</span>
                  <input name="contactName" value={formData.contactName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder={isRtl ? 'نام مدیر فروش، فنی یا بازاریابی' : 'Sales, technical or marketing manager'} />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-black text-gray-700 dark:text-gray-300">{isRtl ? 'شماره تماس *' : 'Phone Number *'}</span>
                  <div className="relative"><Phone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} /><input name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`} placeholder={isRtl ? 'شماره موبایل یا تلفن شرکت' : 'Mobile or company phone'} /></div>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-black text-gray-700 dark:text-gray-300">{isRtl ? 'دسته محصول *' : 'Product Category *'}</span>
                  <select name="productCategory" value={formData.productCategory} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors">
                    {productCategories.map(category => <option key={category.value} value={category.value}>{isRtl ? category.fa : category.en}</option>)}
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-black text-gray-700 dark:text-gray-300">{isRtl ? 'وضعیت BIM محصول شما چیست؟ *' : 'What is your current BIM product status? *'}</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'no', fa: 'فایل BIM نداریم', en: 'We do not have BIM files' },
                    { value: 'yes', fa: 'فایل BIM آماده داریم', en: 'We already have BIM files' },
                    { value: 'not-sure', fa: 'مطمئن نیستیم و راهنمایی می‌خواهیم', en: 'We are not sure and need guidance' }
                  ].map(option => (
                    <button type="button" key={option.value} onClick={() => setFormData(prev => ({ ...prev, hasBimFiles: option.value as HasBimFiles }))} className={`min-h-[54px] px-4 py-3 rounded-2xl border text-sm font-extrabold transition-all cursor-pointer text-start ${formData.hasBimFiles === option.value ? 'bg-[#26B6B6]/10 border-[#26B6B6] text-[#138f8f] dark:text-[#26B6B6]' : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#26B6B6]/50'}`}>
                      {isRtl ? option.fa : option.en}
                    </button>
                  ))}
                </div>
              </div>

              {formData.hasBimFiles === 'yes' && (
                <div className="rounded-2xl bg-[#26B6B6]/5 border border-[#26B6B6]/15 p-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
                  {isRtl
                    ? 'فایل BIM آماده دارید؛ پس از ثبت اطلاعات اولیه، مسیر معرفی فایل و بررسی فنی با شما هماهنگ می‌شود. ارسال فایل در پیام‌رسان، مسیر رسمی انتشار نیست.'
                    : 'You have ready BIM files. After initial submission, the technical review path is coordinated with you. Sending a file through messaging is not the official publication path.'}
                </div>
              )}

              <div className="rounded-2xl bg-[#26B6B6]/5 border border-[#26B6B6]/15 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <UploadCloud className="w-5 h-5 text-[#26B6B6] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-black text-gray-800 dark:text-white">{isRtl ? 'ارسال کاتالوگ یا اطلاعات اولیه محصول (اختیاری)' : 'Share a catalog or initial product information (optional)'}</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600 dark:text-gray-400">{isRtl ? 'می‌توانید فرم را بدون ارسال کاتالوگ ثبت کنید. تلگرام و واتساپ فقط برای ارسال اطلاعات اولیه هستند، نه آپلود رسمی فایل BIM برای انتشار.' : 'You may submit the form without sharing a catalog. Telegram and WhatsApp are only for initial information, not official BIM file upload for publication.'}</p>
                  </div>
                </div>
                <label className="block space-y-2">
                  <span className="text-sm font-black text-gray-700 dark:text-gray-300">
                    {isRtl ? 'لینک کاتالوگ / دیتاشیت / صفحه محصول (اختیاری)' : 'Catalog / Datasheet / Product Link (optional)'}
                  </span>
                  <input
                    name="catalogUrl"
                    value={formData.catalogUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6]"
                    placeholder="https://..."
                    dir="ltr"
                  />
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a href={telegramUrl} className="px-4 py-3 rounded-xl bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2"><Send className="w-4 h-4" />{isRtl ? 'ارسال اطلاعات در تلگرام' : 'Send information via Telegram'}</a>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/15 text-[#128C7E] border border-[#25D366]/20 text-xs font-extrabold transition-all flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" />{isRtl ? 'ارسال اطلاعات در واتساپ' : 'Send information via WhatsApp'}</a>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
                <button
                  type="button"
                  onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                  aria-expanded={showOptionalDetails}
                  className="w-full flex items-center justify-between gap-4 rounded-2xl border border-[#087F7A]/30 bg-white dark:bg-gray-950 px-5 py-4 text-start transition-colors hover:bg-[#26B6B6]/5 dark:hover:bg-[#26B6B6]/10 cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#087F7A] dark:text-[#26B6B6] shrink-0" />
                    <span>
                      <span className="block text-sm font-black text-[#087F7A] dark:text-[#26B6B6]">{showOptionalDetails ? (isRtl ? 'بستن اطلاعات تکمیلی محصول' : 'Hide optional product details') : (isRtl ? 'افزودن اطلاعات تکمیلی محصول' : 'Add optional product details')}</span>
                      <span className="mt-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{isRtl ? 'اختیاری؛ شامل لینک کاتالوگ، وب‌سایت و جزئیات بیشتر محصول' : 'Optional: catalog link, website, and additional product details'}</span>
                    </span>
                  </span>
                  <ChevronDown className={`w-5 h-5 shrink-0 text-[#087F7A] dark:text-[#26B6B6] transition-transform ${showOptionalDetails ? 'rotate-180' : ''}`} />
                </button>

                {showOptionalDetails && (
                  <div className="mt-5 space-y-5 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="space-y-2"><span className="text-sm font-black text-gray-700 dark:text-gray-300">{isRtl ? 'ایمیل' : 'Email'}</span><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm outline-none focus:border-[#26B6B6]" placeholder="name@company.com" dir="ltr" /></label>
                      <label className="space-y-2"><span className="text-sm font-black text-gray-700 dark:text-gray-300">{isRtl ? 'وب‌سایت یا شبکه اجتماعی برند' : 'Website or Social Page'}</span><input name="websiteOrSocial" value={formData.websiteOrSocial} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm outline-none focus:border-[#26B6B6]" placeholder="https://example.com" dir="ltr" /></label>
                      <label className="space-y-2"><span className="text-sm font-black text-gray-700 dark:text-gray-300">{isRtl ? 'تعداد تقریبی محصولات' : 'Approximate Product Count'}</span><input name="productCount" value={formData.productCount} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm outline-none focus:border-[#26B6B6]" placeholder={isRtl ? 'مثلاً: ۱۰ محصول یا ۳ سری محصول' : 'e.g. 10 products or 3 product series'} /></label>

                    </div>

                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 rounded-2xl bg-[#26B6B6]/5 border border-[#26B6B6]/15 p-4 cursor-pointer">
                <input type="checkbox" name="hasAcceptedNotice" checked={formData.hasAcceptedNotice} onChange={handleCheckboxChange} className="mt-1 w-4 h-4 accent-[#26B6B6] shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{isRtl ? 'موافقم ایران بیم هاب برای پیگیری درخواست و تعیین مسیر همکاری با من تماس بگیرد.' : 'I agree that IranBIMhub may contact me to follow up on this request and determine the appropriate path.'}</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-2">
                <button type="button" onClick={() => onNavigate('home')} className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-950 transition-all cursor-pointer">{isRtl ? 'بازگشت به صفحه اصلی' : 'Back to Home'}</button>
                <button type="submit" disabled={submitStatus === 'submitting'} className="px-7 py-3 bg-[#26B6B6] hover:bg-[#1e9494] disabled:bg-gray-400 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#26B6B6]/20">
                  {submitStatus === 'submitting' ? <><Loader2 className="w-4 h-4 animate-spin" /><span>{isRtl ? 'در حال ثبت...' : 'Submitting...'}</span></> : <><Send className="w-4 h-4" /><span>{isRtl ? 'درخواست بررسی اولیه' : 'Request Initial Review'}</span></>}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};