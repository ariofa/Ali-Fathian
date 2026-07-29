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

// Important: Telegram does not provide a reliable public web link by phone number alone.
// If IranBIMhub later creates a Telegram username or bot, replace this URL with https://t.me/YOUR_USERNAME.
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

export const ForManufacturersView: React.FC<ForManufacturersViewProps> = ({ onNavigate }) => {
  const { isRtl } = useLanguage();
  const [formData, setFormData] = useState(initialFormState);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const telegramMessage = encodeURIComponent(
    isRtl
      ? 'سلام، برای همکاری تولیدکننده با ایران‌بیم‌هاب پیام می‌دهم. قصد دارم کاتالوگ یا فایل BIM محصولات شرکت را ارسال کنم.'
      : 'Hello, I am contacting IranBIMhub as a manufacturer. I would like to send our product catalog or BIM files.'
  );
  const telegramUrl = `${TELEGRAM_CONTACT_URL}&text=${telegramMessage}`;
  const whatsappUrl = `${WHATSAPP_CONTACT_URL}?text=${telegramMessage}`;

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
      icon: <FileCheck2 className="w-6 h-6" />,
      titleFa: 'فایل BIM آماده دارید؟',
      titleEn: 'Already have BIM files?',
      descFa: 'اگر برای محصولات خود فایل Revit، IFC، ArchiCAD یا سایر فرمت‌های BIM دارید، آن را برای بررسی فنی ارسال کنید. پس از کنترل کیفیت، اصلاحات احتمالی و تأیید، محصول شما در کاتالوگ IranBIMhub منتشر می‌شود.',
      descEn: 'If you already have Revit, IFC, ArchiCAD or other BIM files, send them for technical review. After quality control and required adjustments, your products can be published on IranBIMhub.',
      bulletsFa: ['بررسی صحت ابعاد و مشخصات', 'کنترل حجم و کیفیت فایل', 'اصلاح متادیتا و دسته‌بندی', 'آماده‌سازی برای انتشار'],
      bulletsEn: ['Geometry and data review', 'File size and quality control', 'Metadata and category cleanup', 'Preparation for publishing'],
      ctaFa: 'ارسال فایل BIM برای بررسی',
      ctaEn: 'Submit BIM Files for Review'
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      titleFa: 'هنوز فایل BIM ندارید؟',
      titleEn: 'Need BIM objects created?',
      descFa: 'اگر فقط کاتالوگ، دیتاشیت، نقشه یا عکس محصول دارید، ایران‌بیم‌هاب می‌تواند آبجکت BIM استاندارد محصول شما را بر اساس مشخصات واقعی آن تولید کند.',
      descEn: 'If you only have catalogs, datasheets, drawings or product photos, IranBIMhub can create standard BIM objects based on your real product specifications.',
      bulletsFa: ['ساخت فمیلی Revit', 'آماده‌سازی IFC', 'تعریف Typeهای محصول', 'کنترل کیفیت قبل از انتشار'],
      bulletsEn: ['Revit family creation', 'IFC preparation', 'Product type setup', 'QA before publishing'],
      ctaFa: 'درخواست ساخت آبجکت BIM',
      ctaEn: 'Request BIM Object Creation'
    }
  ];

  const processSteps = [
    {
      titleFa: 'ثبت درخواست برند',
      titleEn: 'Submit Brand Request',
      descFa: 'اطلاعات شرکت، نوع محصول و وضعیت فایل‌های BIM را ثبت می‌کنید.',
      descEn: 'Submit company details, product type and current BIM file status.'
    },
    {
      titleFa: 'ارسال کاتالوگ یا فایل BIM',
      titleEn: 'Send Catalog or BIM Files',
      descFa: 'فایل آماده، کاتالوگ PDF، دیتاشیت یا لینک محصول را از فرم، تلگرام یا واتساپ ارسال می‌کنید.',
      descEn: 'Send BIM files, PDF catalogs, datasheets or product links through the form, Telegram or WhatsApp.'
    },
    {
      titleFa: 'بررسی مسیر همکاری',
      titleEn: 'Choose Collaboration Path',
      descFa: 'اگر فایل آماده دارید، وارد بررسی فنی می‌شود؛ اگر ندارید، مسیر تولید آبجکت BIM پیشنهاد می‌شود.',
      descEn: 'Existing BIM files go to technical review; otherwise, a BIM creation service path is proposed.'
    },
    {
      titleFa: 'انتشار پس از تأیید',
      titleEn: 'Publish After Approval',
      descFa: 'پس از کنترل کیفیت و تأیید نهایی، محصول برای نمایش در کاتالوگ ایران‌بیم‌هاب آماده می‌شود.',
      descEn: 'After QA and final approval, the product becomes ready for IranBIMhub catalog publishing.'
    }
  ];

  const benefits = [
    {
      icon: <Building2 className="w-5 h-5" />,
      titleFa: 'حضور در مرحله طراحی',
      titleEn: 'Presence in Design Stage',
      descFa: 'محصول شما فقط در کاتالوگ دیده نمی‌شود؛ بلکه وارد مدل، نقشه و تصمیم‌گیری پروژه می‌شود.',
      descEn: 'Your product is not only seen in a catalog; it enters models, drawings and project decisions.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      titleFa: 'اعتماد فنی بیشتر',
      titleEn: 'More Technical Trust',
      descFa: 'فایل‌های بررسی‌شده و استاندارد، برند شما را برای دفاتر طراحی حرفه‌ای‌تر نشان می‌دهد.',
      descEn: 'Reviewed and standardized files make your brand more professional for design offices.'
    },
    {
      icon: <Package className="w-5 h-5" />,
      titleFa: 'دیجیتال‌سازی محصول',
      titleEn: 'Product Digitization',
      descFa: 'محصول فیزیکی شما به دارایی دیجیتال قابل استفاده در پروژه‌های BIM تبدیل می‌شود.',
      descEn: 'Your physical product becomes a digital asset usable in BIM-based projects.'
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
    if (!formData.catalogUrl.trim() && !formData.filesSentByTelegram && !formData.filesSentByWhatsApp) {
      return isRtl
        ? 'لطفاً لینک کاتالوگ/فایل را وارد کنید یا یکی از گزینه‌های ارسال از طریق تلگرام یا واتساپ را انتخاب کنید.'
        : 'Please enter a catalog/file link or select Telegram/WhatsApp file submission.';
    }
    if (!formData.hasAcceptedNotice) return isRtl ? 'لطفاً توضیح مربوط به بررسی فنی و عدم انتشار خودکار فایل‌ها را تأیید کنید.' : 'Please confirm the technical review notice.';
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
          ? 'ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید یا از طریق تلگرام/واتساپ پیام دهید.'
          : 'Submission failed. Please try again or contact us via Telegram/WhatsApp.'
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
              <span>{isRtl ? 'دعوت از تولیدکنندگان و صاحبان برندهای ساختمانی' : 'For Manufacturers & Building Product Brands'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
              {isRtl ? 'محصولات ساختمانی شما، وارد مدل دیجیتال پروژه‌ها شود' : 'Bring Your Building Products into Digital Project Models'}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              {isRtl
                ? 'چه فایل BIM آماده داشته باشید، چه فقط کاتالوگ محصول؛ ایران‌بیم‌هاب به شما کمک می‌کند محصولات واقعی برندتان پس از بررسی فنی، استانداردسازی یا تولید آبجکت BIM، در جریان طراحی پروژه‌های ساختمانی دیده شوند.'
                : 'Whether you already have BIM files or only product catalogs, IranBIMhub helps your real building products enter the design workflow after technical review, standardization or BIM object creation.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#manufacturer-lead-form"
                className="px-7 py-3.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-98 shadow-md shadow-[#26B6B6]/20 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'ثبت درخواست همکاری تولیدکننده' : 'Submit Manufacturer Request'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>
              <a
                href={telegramUrl}
                className="px-7 py-3.5 bg-white/5 border border-white/15 hover:bg-white/10 text-white rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'ارسال کاتالوگ در تلگرام' : 'Send Catalog on Telegram'}</span>
              </a>
            </div>

          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/7 border border-white/12 rounded-3xl p-6 sm:p-7 backdrop-blur-sm shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#26B6B6]/15 text-[#26B6B6] flex items-center justify-center border border-[#26B6B6]/20">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">{isRtl ? 'دو مسیر ساده برای شروع' : 'Two Simple Ways to Start'}</h2>
                  <p className="text-[11px] text-gray-400 mt-1">{isRtl ? 'بررسی فایل آماده یا تولید فایل استاندارد' : 'Review existing files or create standard BIM objects'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <strong className="text-sm text-white">{isRtl ? '۱. فایل BIM آماده دارید' : '1. You already have BIM files'}</strong>
                  <p className="text-[11px] text-gray-300 leading-relaxed mt-2">
                    {isRtl ? 'ارسال برای کنترل کیفیت و انتشار پس از تأیید.' : 'Send for QA and publish after approval.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <strong className="text-sm text-white">{isRtl ? '۲. فایل BIM ندارید' : '2. You do not have BIM files'}</strong>
                  <p className="text-[11px] text-gray-300 leading-relaxed mt-2">
                    {isRtl ? 'تولید آبجکت BIM بر اساس کاتالوگ و مشخصات واقعی محصول.' : 'Create BIM objects based on catalogs and real specifications.'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-400/10 border border-amber-300/20 p-4 text-[11px] leading-relaxed text-amber-50">
                {isRtl
                  ? 'هیچ فایل BIM بدون بررسی فنی منتشر نمی‌شود. هدف ما حفظ اعتبار برند شما و کیفیت کاتالوگ ایران‌بیم‌هاب است.'
                  : 'No BIM file is published without technical review. Our goal is to protect your brand credibility and IranBIMhub catalog quality.'
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
            {isRtl ? 'مسیر همکاری شما کدام است؟' : 'Which Path Fits You?'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {isRtl ? 'انتشار فایل آماده یا تولید آبجکت BIM از صفر' : 'Publish Existing Files or Create BIM Objects from Scratch'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {collaborationPaths.map((path, index) => (
            <div key={path.titleEn} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 sm:p-7 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 ${index === 0 ? 'bg-[#26B6B6]/10 text-[#26B6B6]' : 'bg-emerald-500/10 text-emerald-600'}`}>
                  {path.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{isRtl ? path.titleFa : path.titleEn}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{isRtl ? path.descFa : path.descEn}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(isRtl ? path.bulletsFa : path.bulletsEn).map(item => (
                      <div key={item} className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#26B6B6] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#manufacturer-lead-form" className="inline-flex items-center gap-2 text-xs font-extrabold text-[#26B6B6] hover:text-[#1e9494] transition-colors pt-2">
                    <span>{isRtl ? path.ctaFa : path.ctaEn}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </a>
                </div>
              </div>
            </div>
          ))}
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
                {isRtl ? 'فرآیند همکاری' : 'Collaboration Process'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {isRtl ? 'از ارسال اطلاعات تا آماده‌سازی برای انتشار' : 'From Information Submission to Publishing Readiness'}
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

      {/* FORM */}
      <section id="manufacturer-lead-form" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-start">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#1E2326] to-[#2F3539] text-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#26B6B6]/15 text-[#26B6B6] flex items-center justify-center border border-[#26B6B6]/25 shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black">{isRtl ? 'فرم ثبت درخواست تولیدکننده' : 'Manufacturer Collaboration Request'}</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                  {isRtl
                    ? 'فرم را کوتاه و دقیق تکمیل کنید. اگر فایل‌ها یا کاتالوگ‌ها آماده‌اند، می‌توانید لینک بدهید یا آن‌ها را در تلگرام/واتساپ ارسال کنید.'
                    : 'Keep the form short and clear. If files or catalogs are ready, provide a link or send them via Telegram/WhatsApp.'
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
                  {isRtl ? 'درخواست همکاری تولیدکننده ثبت شد' : 'Manufacturer request submitted'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
                  {isRtl
                    ? 'از شما سپاسگزاریم. تیم ایران‌بیم‌هاب اطلاعات برند، وضعیت فایل‌های BIM و مسیر مناسب همکاری را بررسی می‌کند و برای ادامه با شما تماس خواهد گرفت.'
                    : 'Thank you. IranBIMhub will review your brand details, BIM file status and suitable collaboration path, then contact you for the next step.'
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
                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'آیا برای محصولات خود فایل BIM آماده دارید؟ *' : 'Do you already have BIM files for your products? *'}</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'yes', fa: 'بله، فایل BIM آماده داریم', en: 'Yes, we have BIM files' },
                    { value: 'no', fa: 'خیر، فقط کاتالوگ / مشخصات محصول داریم', en: 'No, only catalogs/specs' },
                    { value: 'not-sure', fa: 'مطمئن نیستم؛ نیاز به مشاوره داریم', en: 'Not sure; need consultation' }
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
                            : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#26B6B6]/50'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'تعداد تقریبی محصولات' : 'Approximate Product Count'}</span>
                  <input name="productCount" value={formData.productCount} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder={isRtl ? 'مثلاً: ۱۰ محصول یا ۳ سری محصول' : 'e.g. 10 products or 3 product series'} />
                </label>

                <div className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'لینک کاتالوگ / فایل / صفحه محصول' : 'Catalog / File / Product Link'}</span>
                  <input name="catalogUrl" value={formData.catalogUrl} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors" placeholder="https://drive.google.com/..." dir="ltr" />
                </div>
              </div>

              <div className="rounded-3xl bg-[#26B6B6]/5 border border-[#26B6B6]/15 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <UploadCloud className="w-5 h-5 text-[#26B6B6] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-black text-gray-800 dark:text-white">{isRtl ? 'ارسال فایل از طریق تلگرام یا واتساپ' : 'Send Files via Telegram or WhatsApp'}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                      {isRtl
                        ? 'اگر فایل‌ها یا کاتالوگ‌ها لینک آنلاین ندارند، می‌توانید آن‌ها را از طریق تلگرام یا واتساپ ارسال کنید. تلگرام برای فایل‌های حجیم‌تر مناسب‌تر است.'
                        : 'If files or catalogs are not available online, you can send them via Telegram or WhatsApp. Telegram is usually better for larger files.'
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-3">
                    <input type="checkbox" name="filesSentByTelegram" checked={formData.filesSentByTelegram} onChange={handleCheckboxChange} className="w-4 h-4 accent-[#26B6B6]" />
                    <span>{isRtl ? 'فایل‌ها را از طریق تلگرام ارسال می‌کنم' : 'I will send files via Telegram'}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-3">
                    <input type="checkbox" name="filesSentByWhatsApp" checked={formData.filesSentByWhatsApp} onChange={handleCheckboxChange} className="w-4 h-4 accent-[#26B6B6]" />
                    <span>{isRtl ? 'فایل‌ها را از طریق واتساپ ارسال می‌کنم' : 'I will send files via WhatsApp'}</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a href={telegramUrl} className="px-4 py-2.5 rounded-xl bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>{isRtl ? 'ارسال در تلگرام' : 'Send on Telegram'}</span>
                  </a>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/15 text-[#128C7E] border border-[#25D366]/20 text-xs font-extrabold transition-all flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{isRtl ? 'ارسال در واتساپ' : 'Send on WhatsApp'}</span>
                  </a>
                </div>
              </div>

              <label className="space-y-2 block">
                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'توضیح کوتاه درباره محصولات یا نیاز شما' : 'Short Message About Your Products or Need'}</span>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors resize-none" placeholder={isRtl ? 'مثلاً بگویید چه محصولاتی دارید، آیا فایل آماده دارید، یا نیاز به ساخت آبجکت BIM دارید.' : 'Tell us what products you have, whether files exist, or if BIM creation is needed.'} />
              </label>

              <label className="flex items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-100 dark:border-amber-900 p-4 cursor-pointer">
                <input type="checkbox" name="hasAcceptedNotice" checked={formData.hasAcceptedNotice} onChange={handleCheckboxChange} className="mt-1 w-4 h-4 accent-[#26B6B6] shrink-0" />
                <span className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  {isRtl
                    ? 'می‌دانم که فایل‌های BIM آماده بدون بررسی فنی منتشر نمی‌شوند و در صورت نداشتن فایل BIM، تولید آبجکت استاندارد نیازمند بررسی محصول، زمان‌بندی و توافق جداگانه است.'
                    : 'I understand that existing BIM files are not published without technical review, and BIM object creation requires product review, scheduling and a separate agreement.'
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
                      <span>{isRtl ? 'ارسال درخواست همکاری' : 'Submit Request'}</span>
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
