import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  Laptop,
  Layers,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Wrench
} from 'lucide-react';

interface BIMModelerCollaborationViewProps {
  onNavigate: (view: string, customTextFa?: string, customTextEn?: string, param?: string) => void;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
type ArrayFieldName = 'softwareSkills' | 'preferredProjectTypes';

const CONTACT_NUMBER = '989391686878';
const TELEGRAM_CONTACT_URL = `tg://resolve?phone=${CONTACT_NUMBER}`;
const WHATSAPP_CONTACT_URL = `https://wa.me/${CONTACT_NUMBER}`;

const initialFormState = {
  fullName: '',
  phone: '',
  email: '',
  city: '',
  mainSpecialty: '',
  experienceYears: '',
  availability: '',
  portfolioUrl: '',
  linkedinUrl: '',
  portfolioSentByTelegram: false,
  portfolioSentByWhatsApp: false,
  softwareSkills: [] as string[],
  preferredProjectTypes: [] as string[],
  message: '',
  hasAcceptedNotice: false,
  website: '' // Honeypot field; keep hidden in the UI.
};

export const BIMModelerCollaborationView: React.FC<BIMModelerCollaborationViewProps> = ({ onNavigate }) => {
  const { isRtl } = useLanguage();
  const [formData, setFormData] = useState(initialFormState);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const portfolioMessage = encodeURIComponent(
    isRtl
      ? 'سلام، برای همکاری پروژه‌ای به‌عنوان مدل‌ساز BIM در ایران‌بیم‌هاب پیام می‌دهم. نمونه‌کارهایم را ارسال می‌کنم.'
      : 'Hello, I am applying for project-based collaboration as a BIM modeler with IranBIMhub. I would like to send my portfolio.'
  );
  const telegramPortfolioUrl = `${TELEGRAM_CONTACT_URL}&text=${portfolioMessage}`;
  const whatsappPortfolioUrl = `${WHATSAPP_CONTACT_URL}?text=${portfolioMessage}`;

  const roleCards = [
    {
      icon: <Wrench className="w-5 h-5" />,
      titleFa: 'سازنده Revit Family',
      titleEn: 'Revit Family Creator',
      descFa: 'ساخت فمیلی‌های سبک، پارامتریک و قابل استفاده برای محصولات واقعی ساختمانی.',
      descEn: 'Create lightweight, parametric and usable families for real building products.'
    },
    {
      icon: <Layers className="w-5 h-5" />,
      titleFa: 'مدل‌ساز BIM معماری',
      titleEn: 'Architectural BIM Modeler',
      descFa: 'مدل‌سازی محصولات معماری مانند در، پنجره، نما، کف‌پوش، مبلمان و تجهیزات داخلی.',
      descEn: 'Model architectural products such as doors, windows, façades, flooring and furniture.'
    },
    {
      icon: <Laptop className="w-5 h-5" />,
      titleFa: 'متخصص BIM تأسیسات',
      titleEn: 'MEP BIM Specialist',
      descFa: 'آماده‌سازی آبجکت‌های تأسیساتی، کانکتورها، تجهیزات مکانیکی، روشنایی و لوله‌کشی.',
      descEn: 'Prepare MEP objects, connectors, mechanical equipment, lighting and plumbing items.'
    },
    {
      icon: <ClipboardCheck className="w-5 h-5" />,
      titleFa: 'کنترل کیفیت فایل BIM',
      titleEn: 'BIM File QA',
      descFa: 'بررسی حجم فایل، نام‌گذاری، پارامترها، دسته‌بندی و قابلیت استفاده در پروژه واقعی.',
      descEn: 'Review file size, naming, parameters, categories and usability in real projects.'
    }
  ];

  const processSteps = [
    {
      titleFa: 'ثبت درخواست',
      titleEn: 'Apply',
      descFa: 'فرم همکاری را تکمیل می‌کنید و لینک نمونه‌کار خود را می‌فرستید.',
      descEn: 'Complete the collaboration form and send your portfolio link.'
    },
    {
      titleFa: 'بررسی نمونه‌کار',
      titleEn: 'Portfolio Review',
      descFa: 'تیم ایران‌بیم‌هاب تخصص، کیفیت فایل‌ها و تجربه شما را بررسی می‌کند.',
      descEn: 'IranBIMhub reviews your skills, file quality and experience.'
    },
    {
      titleFa: 'تعریف پروژه',
      titleEn: 'Project Scope',
      descFa: 'در صورت تناسب، محدوده کار، زمان تحویل و مبلغ پروژه قبل از شروع مشخص می‌شود.',
      descEn: 'If matched, scope, deadline and fee are agreed before the project starts.'
    },
    {
      titleFa: 'تحویل و تسویه',
      titleEn: 'Delivery & Payment',
      descFa: 'فایل‌ها به‌صورت دورکاری تحویل، بررسی و پس از تأیید نهایی تسویه می‌شوند.',
      descEn: 'Files are delivered remotely, reviewed, approved and then paid project-by-project.'
    }
  ];

  const softwareOptions = [
    'Autodesk Revit',
    'Revit Family Editor',
    'Dynamo',
    'AutoCAD',
    'Navisworks',
    'ArchiCAD',
    'IFC / Solibri',
    'Rhino / Grasshopper'
  ];

  const projectTypeOptions = [
    {
      value: 'revit-family',
      labelFa: 'ساخت فمیلی Revit',
      labelEn: 'Revit family creation'
    },
    {
      value: 'architectural-products',
      labelFa: 'مدل‌سازی محصولات معماری',
      labelEn: 'Architectural product modeling'
    },
    {
      value: 'mep-products',
      labelFa: 'مدل‌سازی محصولات تأسیساتی',
      labelEn: 'MEP product modeling'
    },
    {
      value: 'ifc-standardization',
      labelFa: 'خروجی IFC و استانداردسازی',
      labelEn: 'IFC export and standardization'
    },
    {
      value: 'qa-optimization',
      labelFa: 'کنترل کیفیت و سبک‌سازی فایل',
      labelEn: 'QA and file optimization'
    }
  ];

  const specialtyOptions = [
    { value: '', labelFa: 'انتخاب تخصص اصلی', labelEn: 'Select main specialty' },
    { value: 'revit-family', labelFa: 'ساخت فمیلی Revit', labelEn: 'Revit Family Creation' },
    { value: 'architectural-bim', labelFa: 'BIM معماری', labelEn: 'Architectural BIM' },
    { value: 'mep-bim', labelFa: 'BIM تأسیسات / MEP', labelEn: 'MEP BIM' },
    { value: 'ifc-qa', labelFa: 'IFC و کنترل کیفیت فایل', labelEn: 'IFC & File QA' },
    { value: 'other', labelFa: 'سایر تخصص‌های مرتبط', labelEn: 'Other related specialty' }
  ];

  const availabilityOptions = [
    { value: '', labelFa: 'انتخاب وضعیت همکاری', labelEn: 'Select availability' },
    { value: 'limited', labelFa: 'چند ساعت در هفته', labelEn: 'A few hours per week' },
    { value: 'part-time', labelFa: 'پاره‌وقت پروژه‌ای', labelEn: 'Part-time project-based' },
    { value: 'full-projects', labelFa: 'آماده برای پروژه‌های کامل', labelEn: 'Available for full projects' },
    { value: 'team', labelFa: 'دارای تیم کوچک مدل‌سازی', labelEn: 'I have a small modeling team' }
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNoticeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, hasAcceptedNotice: event.target.checked }));
  };

  const handlePortfolioTelegramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, portfolioSentByTelegram: event.target.checked }));
  };

  const handlePortfolioWhatsAppChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, portfolioSentByWhatsApp: event.target.checked }));
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
    if (!formData.fullName.trim()) return isRtl ? 'نام و نام خانوادگی را وارد کنید.' : 'Please enter your full name.';
    if (!formData.phone.trim()) return isRtl ? 'شماره تماس را وارد کنید.' : 'Please enter your phone number.';
    if (!formData.city.trim()) return isRtl ? 'شهر محل فعالیت را وارد کنید.' : 'Please enter your city.';
    if (!formData.mainSpecialty) return isRtl ? 'تخصص اصلی خود را انتخاب کنید.' : 'Please select your main specialty.';
    if (!formData.experienceYears.trim()) return isRtl ? 'سابقه کاری خود را وارد کنید.' : 'Please enter your experience.';
    if (formData.softwareSkills.length === 0) return isRtl ? 'حداقل یک نرم‌افزار را انتخاب کنید.' : 'Please select at least one software skill.';
    if (formData.preferredProjectTypes.length === 0) return isRtl ? 'حداقل یک نوع پروژه را انتخاب کنید.' : 'Please select at least one project type.';
    if (!formData.portfolioUrl.trim() && !formData.portfolioSentByTelegram && !formData.portfolioSentByWhatsApp) return isRtl ? 'لطفاً لینک نمونه‌کار را وارد کنید یا گزینه ارسال نمونه‌کار از طریق تلگرام/واتساپ را انتخاب کنید.' : 'Please enter a portfolio link or select Telegram/WhatsApp portfolio submission.';
    if (!formData.hasAcceptedNotice) return isRtl ? 'لطفاً توضیح مربوط به پروژه‌ای بودن همکاری را تأیید کنید.' : 'Please confirm the project-based collaboration notice.';
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
      const response = await fetch('/api/bim-modeler-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.success === false) {
        throw new Error(data?.messageFa || data?.message || 'Submission failed');
      }

      setSubmitStatus('success');
      setFormData(initialFormState);
      setTimeout(() => {
        document.getElementById('modeler-application-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        isRtl
          ? 'ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید یا بعداً با پشتیبانی تماس بگیرید.'
          : 'Submission failed. Please try again or contact support later.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] dark:bg-gray-950 transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2326] via-[#2F3539] to-[#3B4247] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-start">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#26B6B6]/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#26B6B6]/15 border border-[#26B6B6]/25 rounded-full text-[11px] font-bold text-[#26B6B6]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'دعوت به همکاری پروژه‌ای و دورکاری' : 'Remote, Project-Based Collaboration'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
              {isRtl ? 'همکاری پروژه‌ای با مدل‌سازان BIM' : 'Project-Based Collaboration for BIM Modelers'}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              {isRtl
                ? 'ایران‌بیم‌هاب در حال ساخت کتابخانه تخصصی آبجکت‌های BIM برای محصولات واقعی ساختمانی ایران است. اگر در ساخت فمیلی Revit، مدل‌سازی BIM، استانداردسازی پارامترها یا کنترل کیفیت فایل‌های BIM تجربه دارید، می‌توانید به‌صورت دورکاری و پروژه‌به‌پروژه با ما همکاری کنید.'
                : 'IranBIMhub is building a dedicated BIM object library for real Iranian construction products. If you create Revit families, BIM objects, standardized parameters or quality-controlled BIM files, you can collaborate with us remotely on a project-by-project basis.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#modeler-application-form"
                className="px-7 py-3.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-98 shadow-md shadow-[#26B6B6]/20 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'ثبت درخواست همکاری' : 'Apply for Collaboration'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>
              <a
                href="#collaboration-process"
                className="px-7 py-3.5 bg-white/5 border border-white/15 hover:bg-white/10 text-white rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>{isRtl ? 'فرآیند همکاری' : 'How It Works'}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/7 border border-white/12 rounded-3xl p-6 sm:p-7 backdrop-blur-sm shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#26B6B6]/15 text-[#26B6B6] flex items-center justify-center border border-[#26B6B6]/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">{isRtl ? 'مدل همکاری در این مرحله' : 'Collaboration Model'}</h2>
                  <p className="text-[11px] text-gray-400 mt-1">{isRtl ? 'شفاف، ساده و بدون تعهد استخدامی' : 'Simple, transparent and non-employment based'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 text-xs">
                {[
                  { icon: <Laptop className="w-4 h-4" />, fa: 'دورکاری', en: 'Remote' },
                  { icon: <Clock className="w-4 h-4" />, fa: 'پروژه‌به‌پروژه', en: 'Project-based' },
                  { icon: <FileText className="w-4 h-4" />, fa: 'پس از بررسی نمونه‌کار', en: 'After portfolio review' }
                ].map(item => (
                  <div key={item.en} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 text-gray-200">
                    <span className="text-[#26B6B6]">{item.icon}</span>
                    <span className="font-bold">{isRtl ? item.fa : item.en}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-amber-400/10 border border-amber-300/20 p-4 text-[11px] leading-relaxed text-amber-50">
                {isRtl
                  ? 'توجه: ثبت درخواست همکاری به‌معنای استخدام یا دریافت فوری پروژه نیست. پروژه‌ها بر اساس نیاز برندها، کیفیت نمونه‌کار و ظرفیت همکاری تعریف می‌شوند.'
                  : 'Note: Applying does not mean employment or immediate project assignment. Projects depend on brand demand, portfolio quality and available capacity.'
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-7 text-start">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-black text-[#26B6B6] uppercase tracking-wider">
            {isRtl ? 'این همکاری مناسب چه کسانی است؟' : 'Who Is This For?'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {isRtl ? 'اگر فایل BIM تمیز و قابل استفاده می‌سازید، با ما صحبت کنید' : 'If you create clean, usable BIM files, let’s talk'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {isRtl
              ? 'تمرکز ما روی فایل‌هایی است که در پروژه واقعی قابل استفاده باشند؛ سبک، منظم، قابل بررسی و نزدیک به مشخصات واقعی محصول.'
              : 'We focus on files that can be used in real projects: lightweight, organized, reviewable and close to real product specifications.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roleCards.map(card => (
            <div key={card.titleEn} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white mb-2">{isRtl ? card.titleFa : card.titleEn}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{isRtl ? card.descFa : card.descEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="collaboration-process" className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-12 sm:py-16 text-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-[11px] font-black text-[#26B6B6] uppercase tracking-wider">
              {isRtl ? 'فرآیند همکاری' : 'Collaboration Process'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              {isRtl ? 'ساده، مرحله‌به‌مرحله و پروژه‌محور' : 'Simple, Step-by-Step and Project-Based'}
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
      </section>

      {/* FORM */}
      <section id="modeler-application-form" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-start">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#1E2326] to-[#2F3539] text-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#26B6B6]/15 text-[#26B6B6] flex items-center justify-center border border-[#26B6B6]/25 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black">{isRtl ? 'فرم ثبت درخواست همکاری' : 'Collaboration Application Form'}</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                  {isRtl
                    ? 'لطفاً اطلاعات را کوتاه و دقیق وارد کنید. اگر لینک آنلاین نمونه‌کار ندارید، می‌توانید نمونه‌کارها را از طریق تلگرام یا واتساپ ارسال کنید. تلگرام برای فایل‌های حجیم‌تر مناسب‌تر است.'
                    : 'Please keep your answers short and clear. If you do not have an online portfolio link, you can send samples through Telegram or WhatsApp. Telegram is better for larger files.'
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
                  {isRtl ? 'درخواست همکاری شما ثبت شد' : 'Your application has been submitted'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
                  {isRtl
                    ? 'از شما سپاسگزاریم. تیم ایران‌بیم‌هاب نمونه‌کار و اطلاعات شما را بررسی می‌کند و در صورت تناسب با پروژه‌های فعلی یا آینده با شما تماس خواهد گرفت.'
                    : 'Thank you. IranBIMhub will review your portfolio and contact you if your skills match current or future projects.'
                  }
                </p>
                <button
                  onClick={() => {
                    setSubmitStatus('idle');
                    setErrorMessage('');
                  }}
                  className="px-5 py-2.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                >
                  {isRtl ? 'ثبت درخواست دیگر' : 'Submit Another Application'}
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
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'نام و نام خانوادگی *' : 'Full Name *'}</span>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors"
                    placeholder={isRtl ? 'مثلاً: علی رضایی' : 'e.g. Ali Rezaei'}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'شماره تماس *' : 'Phone Number *'}</span>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
                      placeholder={isRtl ? 'شماره موبایل یا واتساپ' : 'Mobile or WhatsApp number'}
                    />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'ایمیل' : 'Email'}</span>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
                      placeholder="name@example.com"
                      dir="ltr"
                    />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'شهر محل فعالیت *' : 'City *'}</span>
                  <div className="relative">
                    <MapPin className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
                      placeholder={isRtl ? 'مثلاً: تهران، شیراز، اصفهان' : 'e.g. Tehran, Shiraz, Isfahan'}
                    />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'تخصص اصلی *' : 'Main Specialty *'}</span>
                  <select
                    name="mainSpecialty"
                    value={formData.mainSpecialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors"
                  >
                    {specialtyOptions.map(option => (
                      <option key={option.value} value={option.value}>{isRtl ? option.labelFa : option.labelEn}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'سابقه کاری *' : 'Experience *'}</span>
                  <input
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors"
                    placeholder={isRtl ? 'مثلاً: ۳ سال تجربه ساخت فمیلی Revit' : 'e.g. 3 years creating Revit families'}
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'وضعیت آمادگی برای همکاری' : 'Availability'}</span>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors"
                  >
                    {availabilityOptions.map(option => (
                      <option key={option.value} value={option.value}>{isRtl ? option.labelFa : option.labelEn}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'نرم‌افزارهای مسلط *' : 'Software Skills *'}</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {softwareOptions.map(option => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => toggleArrayValue('softwareSkills', option)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        formData.softwareSkills.includes(option)
                          ? 'bg-[#26B6B6] border-[#26B6B6] text-white'
                          : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#26B6B6]/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'نوع پروژه‌های مورد علاقه *' : 'Preferred Project Types *'}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {projectTypeOptions.map(option => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => toggleArrayValue('preferredProjectTypes', option.value)}
                      className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-start ${
                        formData.preferredProjectTypes.includes(option.value)
                          ? 'bg-[#26B6B6]/10 border-[#26B6B6] text-[#138f8f] dark:text-[#26B6B6]'
                          : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#26B6B6]/50'
                      }`}
                    >
                      {isRtl ? option.labelFa : option.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'نمونه‌کار / پورتفولیو' : 'Portfolio / Work Samples'}</span>
                  <input
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors"
                    placeholder="https://drive.google.com/..."
                    dir="ltr"
                  />
                  <div className="rounded-2xl bg-[#26B6B6]/5 border border-[#26B6B6]/15 p-3 space-y-3">
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                      {isRtl
                        ? 'اگر لینک آنلاین آماده ندارید، نمونه‌کارها را از طریق تلگرام یا واتساپ ارسال کنید. برای فایل‌های حجیم‌تر، تلگرام گزینه مناسب‌تری است.'
                        : 'If you do not have an online link, send your samples through Telegram or WhatsApp. Telegram is better for larger files.'
                      }
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-[11px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.portfolioSentByTelegram}
                          onChange={handlePortfolioTelegramChange}
                          className="w-4 h-4 accent-[#26B6B6]"
                        />
                        <span>{isRtl ? 'نمونه‌کار را از طریق تلگرام ارسال می‌کنم' : 'I will send my portfolio through Telegram'}</span>
                      </label>
                      <label className="flex items-center gap-2 text-[11px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.portfolioSentByWhatsApp}
                          onChange={handlePortfolioWhatsAppChange}
                          className="w-4 h-4 accent-[#26B6B6]"
                        />
                        <span>{isRtl ? 'نمونه‌کار را از طریق واتساپ ارسال می‌کنم' : 'I will send my portfolio through WhatsApp'}</span>
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={telegramPortfolioUrl}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[11px] font-extrabold transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isRtl ? 'ارسال نمونه‌کار در تلگرام' : 'Send portfolio on Telegram'}</span>
                      </a>
                      <a
                        href={whatsappPortfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] hover:bg-[#25D366]/15 transition-colors text-[11px] font-extrabold"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{isRtl ? 'ارسال نمونه‌کار در واتساپ' : 'Send portfolio on WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <label className="space-y-2">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'لینک LinkedIn یا وب‌سایت' : 'LinkedIn or Website'}</span>
                  <input
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors"
                    placeholder="https://linkedin.com/in/..."
                    dir="ltr"
                  />
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{isRtl ? 'توضیح کوتاه درباره تجربه شما' : 'Short Message About Your Experience'}</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm outline-none focus:border-[#26B6B6] transition-colors resize-none"
                  placeholder={isRtl ? 'مثلاً درباره نوع پروژه‌هایی که انجام داده‌اید، سطح تسلط یا نمونه‌کارهای شاخص توضیح دهید.' : 'Describe your previous project types, skill level or notable portfolio items.'}
                />
              </label>

              <label className="flex items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-100 dark:border-amber-900 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAcceptedNotice}
                  onChange={handleNoticeChange}
                  className="mt-1 w-4 h-4 accent-[#26B6B6] shrink-0"
                />
                <span className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  {isRtl
                    ? 'می‌دانم که این فرم برای ثبت درخواست همکاری پروژه‌ای است و ارسال آن به‌معنای استخدام، قرارداد قطعی یا دریافت فوری پروژه نیست.'
                    : 'I understand that this is a project-based collaboration application and submitting it does not mean employment, a guaranteed contract or immediate project assignment.'
                  }
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-950 transition-all cursor-pointer"
                >
                  {isRtl ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
                </button>

                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className="px-7 py-3 bg-[#26B6B6] hover:bg-[#1e9494] disabled:bg-gray-400 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#26B6B6]/20"
                >
                  {submitStatus === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isRtl ? 'در حال ثبت...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isRtl ? 'ارسال درخواست همکاری' : 'Submit Application'}</span>
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
