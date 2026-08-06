import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { FAQ_ITEMS, MANUFACTURERS } from '../../data';
import { 
  SocialIconsRow, 
  StayConnectedBlock, 
  WhatsAppIcon, 
  TelegramIcon, 
  BaleIcon, 
  LinkedInIcon, 
  InstagramIcon, 
  AparatIcon, 
  YouTubeIcon, 
  XIcon 
} from '../SocialLinks';
import { 
  Building2, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  BookOpen,
  Users,
  Compass,
  CheckCircle,
  ChevronDown,
  ShieldCheck,
  FileText,
  Map,
  Award,
  Globe,
  Briefcase,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  Laptop,
  Info,
  Play,
  ImageIcon,
  X
} from 'lucide-react';

interface AboutViewProps {
  viewMode?: 'about' | 'contact' | 'manufacturers';
  onNavigate?: (view: string) => void;
  onViewBrand?: (mfgId: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ 
  viewMode = 'about', 
  onNavigate, 
  onViewBrand 
}) => {
  const { language, t, isRtl } = useLanguage();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', department: 'general' });
  const [mfgSearch, setMfgSearch] = useState('');
  const [isAboutVideoOpen, setIsAboutVideoOpen] = useState(false);

  // Mock Team Members
  const TEAM_MEMBERS = [
    {
      id: 1,
      nameFa: 'مهندس آرش کریمی',
      nameEn: 'Arash Karimi, PE',
      roleFa: 'مدیر دپارتمان بیم و تکنولوژی دوقلوی دیجیتال',
      roleEn: 'Director of BIM & Digital Twin Services',
      bioFa: 'فارغ‌التحصیل دکتری مدیریت ساخت از دانشگاه صنعتی شریف، متخصص پیاده‌سازی استانداردهای بیم.',
      bioEn: 'Ph.D. in Construction Management from Sharif Univ. BIM standards practitioner with 12+ years experience.',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      socials: {
        linkedin: 'https://linkedin.com/in/arash-karimi',
        telegram: 'https://t.me/arash_bim',
        email: 'mailto:arash.karimi@iranbimhub.ir'
      }
    },
    {
      id: 2,
      nameFa: 'دکتر مریم صفوی',
      nameEn: 'Dr. Maryam Safavi',
      roleFa: 'رئیس کارگروه ارزیابی و استانداردهای مصالح صنعتی',
      roleEn: 'Head of Industrial Material Quality & Standards',
      bioFa: 'پژوهشگر ارشد متریال و عضو کمیته تدوین مقررات ملی ساختمان در حوزه مدل‌سازی اطلاعات.',
      bioEn: 'Senior material scientist and national building code committee consultant on digital specification.',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      socials: {
        linkedin: 'https://linkedin.com/in/maryam-safavi',
        telegram: 'https://t.me/maryam_safavi_bim',
        email: 'mailto:maryam.safavi@iranbimhub.ir'
      }
    },
    {
      id: 3,
      nameFa: 'مهندس نیما احمدی',
      nameEn: 'Nima Ahmadi, Arch',
      roleFa: 'سرپرست تیم مدلسازی پارامتریک و توسعه فمیلی رویت',
      roleEn: 'Lead BIM Parametric Modeler & Content Developer',
      bioFa: 'کارشناس ارشد معماری دیجیتال، طراح و سازنده صدها خانواده پارامتریک در ابعاد ملی و بین‌المللی.',
      bioEn: 'M.Arch in Digital Architecture, developer of hundreds of verified Revit, IFC, and ArchiCAD standard families.',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      socials: {
        linkedin: 'https://linkedin.com/in/nima-ahmadi',
        telegram: 'https://t.me/nima_ahmadi_bim',
        email: 'mailto:nima.ahmadi@iranbimhub.ir'
      }
    }
  ];

  // Technical resources/downloads for engineers
  const RESOURCES = [
    {
      titleFa: 'سند الگوی اجرای بیم در پروژه‌های ملی (BEP Template)',
      titleEn: 'National BIM Execution Plan (BEP) Template v2.1',
      size: '2.4 MB',
      format: 'DOCX'
    },
    {
      titleFa: 'استاندارد سطح جزئیات مدل‌سازی بومی (LOD Specifications)',
      titleEn: 'Localized Level of Development (LOD) Requirements',
      size: '1.8 MB',
      format: 'PDF'
    },
    {
      titleFa: 'راهنمای کارخانجات برای تبدیل کاتالوگ به رویت (RFA Manual)',
      titleEn: 'Brand Guide for RFA & IFC Parametric Conversion',
      size: '3.1 MB',
      format: 'PDF'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const selectDepartment = (deptId: string, deptNameFa: string, deptNameEn: string) => {
    setFormData(prev => ({
      ...prev,
      department: deptId,
      subject: isRtl ? `درخواست ارتباط با ${deptNameFa}` : `Inquiry for ${deptNameEn}`
    }));
  };

  const handleDownloadResource = (title: string) => {
    alert(isRtl 
      ? `منبع «${title}» پس از تکمیل و انتشار رسمی در دسترس قرار می‌گیرد.`
      : `Standard Resource "${title}" has been successfully downloaded.`
    );
  };

  // 1. RENDER ABOUT VIEW (Platform overview)
  if (viewMode === 'about') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 space-y-10 sm:space-y-14" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* 1. Clear platform definition */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3D5E] via-[#123D5A] to-[#064E4B] text-white px-6 py-10 sm:px-10 sm:py-14">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0FB9B1_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative grid grid-cols-1 xl:grid-cols-[1.25fr_.75fr] gap-7 xl:gap-10 items-center">
            <div className="text-start">
            <span className="inline-flex rounded-full border border-[#0FB9B1]/35 bg-[#0FB9B1]/10 px-3 py-1 text-[10px] font-black text-[#22D3EE]">
              {isRtl ? 'اولین مرجع تخصصی مارکت‌پلیس ملی BIM ایران' : 'Iran’s national BIM marketplace and specialist reference'}
            </span>
            <h1 className="mt-5 text-3xl sm:text-5xl font-black leading-tight">
              {isRtl ? 'جایی که محصول واقعی، وارد مسیر طراحی ساختمان می‌شود' : 'Where real products enter the building-design workflow'}
            </h1>
            <p className="mt-5 max-w-2xl text-sm sm:text-base leading-8 text-slate-200">
              {isRtl
                ? 'ایران بیم هاب یک پلتفرم ایرانی است که کمک می‌کند اطلاعات فنی و فایل‌های BIM محصولات ساختمانی، به‌شکلی ساخت‌یافته در اختیار معماران، مهندسان و تیم‌های طراحی قرار بگیرد.'
                : 'IranBIMhub connects building-product manufacturers with architects, engineers, designers, and BIM specialists so real product information can be useful during design, before procurement.'}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate?.('for-manufacturers')} className="rounded-xl bg-[#0FB9B1] hover:bg-[#087F7A] px-4 py-3 text-xs font-black text-white transition-colors cursor-pointer">
                {isRtl ? 'راهنمای تولیدکنندگان و صاحبان برند' : 'For manufacturers and brand owners'}
              </button>
              <button type="button" onClick={() => onNavigate?.('for-designers')} className="rounded-xl border border-white/25 bg-white/5 hover:bg-white/10 px-4 py-3 text-xs font-black text-white transition-colors cursor-pointer">
                {isRtl ? 'راهنمای معماران و مهندسان' : 'Guide for architects and engineers'}
              </button>
            </div>
            </div>
            <button type="button" onClick={() => setIsAboutVideoOpen(true)} className="group relative min-h-[245px] overflow-hidden rounded-2xl border border-white/15 bg-[#0B1220] text-center cursor-pointer shadow-2xl">
              <img src="https://img.youtube.com/vi/NvZN0DUiTKo/maxresdefault.jpg" onError={(event) => { event.currentTarget.src = 'https://img.youtube.com/vi/NvZN0DUiTKo/hqdefault.jpg'; }} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/95 via-[#0B1220]/35 to-[#0B1220]/20" />
              <span className="relative z-10 flex h-full min-h-[245px] flex-col items-center justify-center gap-4 px-5">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0F3D5E] shadow-2xl transition-transform duration-300 group-hover:scale-110"><Play className="w-7 h-7 fill-current" /></span>
                <span><span className="block text-sm font-black leading-tight">{isRtl ? 'ایران بیم هاب در یک دقیقه' : 'IranBIMhub in one minute'}</span><span className="mt-1.5 block text-[11px] font-bold text-white/75">{isRtl ? 'تماشای ویدیوی معرفی پلتفرم' : 'Watch the platform introduction'}</span></span>
              </span>
            </button>
          </div>
        </section>

        {isAboutVideoOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B1220]/90 backdrop-blur-sm p-3 sm:p-6" role="dialog" aria-modal="true" onMouseDown={() => setIsAboutVideoOpen(false)}>
            <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B1220] shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><span className="text-sm font-black text-white">{isRtl ? 'ویدیوی معرفی ایران بیم هاب' : 'IranBIMhub introduction'}</span><button type="button" onClick={() => setIsAboutVideoOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-white/75 hover:bg-white/10 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button></div>
              <div className="aspect-video bg-black"><iframe src="https://www.youtube-nocookie.com/embed/NvZN0DUiTKo?autoplay=1" title={isRtl ? 'ویدیوی معرفی ایران بیم هاب' : 'IranBIMhub introduction video'} className="h-full w-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div>
            </div>
          </div>
        )}

        {/* 2. The market gap, explained without jargon */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="text-start space-y-4 order-2 lg:order-1">
            <span className="text-[11px] font-black text-[#087F7A]">{isRtl ? 'مسئله‌ای که می‌خواهیم حل کنیم' : 'The gap we are addressing'}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B2F33] dark:text-white leading-tight">
              {isRtl ? 'میان محصول واقعی و طراحی پروژه، هنوز فاصله‌ای وجود دارد' : 'There is still a gap between real products and project design'}
            </h2>
            <p className="text-sm leading-8 text-gray-600 dark:text-gray-300">
              {isRtl
                ? 'در بسیاری از پروژه‌ها، طراحان برای پیدا کردن اطلاعات قابل‌استفاده دربارهٔ محصولات واقعی، میان کاتالوگ‌ها، فایل‌های پراکنده و مدل‌سازی دستی رفت‌وآمد می‌کنند. در سوی دیگر، بسیاری از تولیدکنندگان محصول دارند؛ اما دادهٔ محصولشان هنوز به‌شکلی ساخت‌یافته وارد جریان طراحی دیجیتال نشده است.'
                : 'In many projects, designers move between catalogs, scattered files, and manual modeling to find usable information about real products. Meanwhile, many manufacturers have capable products, but their product data has not yet entered a structured digital design workflow.'}
            </p>
            <p className="text-sm font-bold leading-7 text-[#0F3D5E] dark:text-[#22D3EE]">
              {isRtl ? 'ایران بیم هاب برای سامان‌دادن این مسیر طراحی شده است: از دریافت اطلاعات محصول تا آماده‌سازی و معرفی آن برای استفاده در طراحی.' : 'IranBIMhub was created to bring these two worlds closer together.'}
            </p>
          </div>
          <div className="order-1 lg:order-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-3 items-center text-center">
              <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4"><FileText className="w-7 h-7 mx-auto text-[#0F3D5E]" /><p className="mt-3 text-[11px] font-black text-gray-700 dark:text-gray-200">{isRtl ? 'کاتالوگ و اطلاعات پراکنده' : 'Scattered product information'}</p></div>
              <div className="flex items-center justify-center"><div className="h-px w-full bg-[#0FB9B1]" /><div className="absolute w-2 h-2 rounded-full bg-[#0FB9B1]" /></div>
              <div className="rounded-2xl bg-[#0F3D5E] p-4 text-white"><Layers className="w-7 h-7 mx-auto text-[#22D3EE]" /><p className="mt-3 text-[11px] font-black">{isRtl ? 'دادهٔ قابل‌استفاده در طراحی' : 'Design-ready product data'}</p></div>
            </div>
            <div className="mt-5 rounded-2xl border border-dashed border-[#0FB9B1]/45 bg-white/70 dark:bg-slate-950/40 px-5 py-4 text-center text-xs leading-6 text-gray-600 dark:text-gray-300">
              {isRtl ? 'محصول، اطلاعات فنی، هویت برند و مدل اطلاعاتی ساختمان؛ در یک مسیر مشترک.' : 'Product, technical information, brand identity, and the building information model; one connected path.'}
            </div>
            <div className="mt-4 min-h-[108px] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-950/30 flex flex-col items-center justify-center text-center">
              <ImageIcon className="w-6 h-6 text-[#0FB9B1]" />
              <p className="mt-2 text-[11px] font-black text-gray-600 dark:text-gray-300">{isRtl ? 'جای تصویر حرفه‌ای: محصول واقعی در فضای طراحی' : 'Media placeholder: real product in a design context'}</p>
              <p className="mt-1 text-[10px] text-gray-400">{isRtl ? 'تصویر نهایی پس از انتخاب منبع واقعی جایگزین می‌شود.' : 'The final visual will be added after selecting an approved source.'}</p>
            </div>
          </div>
        </section>

        {/* 3. What the platform brings together */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 text-start">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B2F33] dark:text-white">{isRtl ? 'یک محصول برای ورود به طراحی، به چه چیزهایی نیاز دارد؟' : 'What does a product need to enter a design workflow?'}</h2>
            <p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'برای استفادهٔ واقعی در پروژه، یک محصول فقط به تصویر یا کاتالوگ نیاز ندارد. مدل سه‌بعدی یا Revit Family، مشخصات فنی، نام و کد محصول، اطلاعات برند و مدارک مرتبط باید در یک ساختار قابل‌استفاده کنار هم قرار بگیرند.' : 'The value of IranBIMhub is not limited to a 3D file. A product gains digital value in design when its information is understandable, reviewable, and connected to its real brand identity.'}</p>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[['Package','محصول واقعی','Real product'],['FileText','مشخصات فنی و کاتالوگ','Technical documentation'],['Building2','اطلاعات و هویت برند','Brand information'],['Layers','مدل BIM و فایل‌های قابل‌استفاده','BIM model and usable files']].map(([icon,fa,en]) => (
              <div key={fa} className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 text-center">
                <div className="mx-auto w-9 h-9 rounded-xl bg-[#0FB9B1]/10 text-[#087F7A] flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
                <p className="mt-3 text-xs font-black text-gray-800 dark:text-white">{isRtl ? fa : en}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Simple, useful process */}
        <section className="text-start">
          <div className="max-w-5xl">
            <span className="text-[11px] font-black text-[#087F7A]">{isRtl ? 'مسیر همکاری با برندها' : 'The brand collaboration path'}</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#2B2F33] dark:text-white lg:whitespace-nowrap">{isRtl ? 'یک تولیدکننده چگونه محصول خود را وارد مسیر BIM می‌کند؟' : 'How does a manufacturer bring a product into a BIM workflow?'}</h2>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['۱','معرفی برند و محصول','نام برند، دستهٔ محصول، کاتالوگ و اطلاعات اولیه را معرفی کنید.'],
              ['۲','بررسی و آماده‌سازی','مسیر مناسب محصول مشخص می‌شود؛ بررسی فایل یا آماده‌سازی اطلاعات در صورت نیاز.'],
              ['۳','حضور در جریان طراحی','پس از تکمیل اطلاعات و فعال‌شدن انتشار، محصول برای معرفی در کتابخانه آماده می‌شود.']
            ].map(([n,title,desc]) => <div key={n} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900"><span className="text-xs font-black text-[#0FB9B1]">{n}</span><h3 className="mt-4 text-base font-black text-[#2B2F33] dark:text-white">{isRtl ? title : title}</h3><p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">{isRtl ? desc : desc}</p></div>)}
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-5 rounded-3xl overflow-hidden bg-[#0F3D5E] text-white">
            <div className="p-6 sm:p-8 text-start">
              <span className="inline-flex rounded-full bg-[#0FB9B1]/15 px-3 py-1 text-[10px] font-black text-[#22D3EE]">{isRtl ? 'ویدیوی معرفی مسیر تولیدکنندگان' : 'Manufacturer pathway video'}</span>
              <h3 className="mt-4 text-xl sm:text-2xl font-black">{isRtl ? 'محصول شما چگونه به مرحلهٔ طراحی نزدیک می‌شود؟' : 'How does your product move closer to the design stage?'}</h3>
              <p className="mt-3 max-w-xl text-xs sm:text-sm leading-7 text-slate-200">{isRtl ? 'جای ویدیوی موشن‌گرافی کوتاه برای توضیح مسیر برندهای دارای فایل BIM و برندهای بدون فایل آماده.' : 'Placeholder for a short motion-graphics explainer covering both onboarding paths.'}</p>
              <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white text-[#0F3D5E] px-4 py-2.5 text-xs font-black cursor-default"><Play className="w-4 h-4 fill-current" />{isRtl ? 'نمایش ویدیو به‌زودی' : 'Video coming soon'}</button>
            </div>
            <div className="min-h-[190px] border-t lg:border-t-0 lg:border-s border-white/10 bg-[radial-gradient(#22D3EE_1px,transparent_1px)] [background-size:18px_18px] flex items-center justify-center p-6">
              <div className="w-20 h-20 rounded-full border border-[#22D3EE]/40 bg-[#22D3EE]/10 flex items-center justify-center"><Play className="w-8 h-8 text-[#22D3EE] fill-current" /></div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#0FB9B1]/7 border border-[#0FB9B1]/20 p-4">
            <Info className="w-5 h-5 text-[#087F7A] shrink-0 mt-0.5" />
            <p className="text-xs leading-7 text-gray-600 dark:text-gray-300">{isRtl ? 'تولیدکننده لازم نیست از روز اول متخصص BIM باشد؛ مسیر ورود هر برند متناسب با وضعیت واقعی محصول و فایل‌های موجود آن تعیین می‌شود.' : 'Manufacturers do not need to be BIM experts on day one; each brand’s path is determined by the actual state of its product information and available files.'}</p>
          </div>
        </section>

        {/* 5. Audience paths */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            ['برای معماران، مهندسان و BIM Modelerها','مدل و اطلاعات محصول را در یک ساختار قابل‌استفاده بررسی کنید','برای کاربر حرفه‌ای، مسیر کتابخانه شامل آبجکت BIM، Revit Family، فایل IFC، مشخصات فنی، پارامترها و وضعیت انتشار محصول است؛ هر محصول بر اساس فایل و اطلاعات واقعی همان برند معرفی می‌شود.','for-designers','مسیر طراحان'],
            ['برای تولیدکنندگان و صاحبان برند','محصولتان را به مرحلهٔ طراحی نزدیک کنید','اطلاعات محصول و برندتان را در جایی معرفی کنید که معماران و مهندسان، گزینه‌های پروژه‌های آینده را بررسی می‌کنند.','for-manufacturers','مسیر تولیدکنندگان'],
            ['برای متخصصان BIM','در ساخت کتابخانهٔ BIM ایران نقش داشته باشید','اگر در مدل‌سازی، ساخت Family، استانداردسازی داده یا کنترل کیفیت فایل تجربه دارید، مسیر همکاری حرفه‌ای شما باز است.','for-bim-modelers','همکاری حرفه‌ای']
          ].map(([eyebrow,title,desc,view,cta], index) => {
            const tones = [
              'border-[#0FB9B1]/35 bg-gradient-to-br from-[#ECFDFC] to-white dark:from-[#063B3A] dark:to-slate-900',
              'border-[#0F3D5E]/35 bg-gradient-to-br from-[#EAF2F7] to-white dark:from-[#102D43] dark:to-slate-900',
              'border-[#D6A01D]/35 bg-gradient-to-br from-[#FFF9EA] to-white dark:from-[#362A0A] dark:to-slate-900'
            ];
            const buttonTones = ['bg-[#087F7A] hover:bg-[#064E4B]', 'bg-[#0F3D5E] hover:bg-[#0A2D47]', 'bg-[#D6A01D] hover:bg-[#B9820D] text-[#2B2F33]'];
            return <article key={view} className={`rounded-3xl border p-6 sm:p-7 flex flex-col text-start shadow-[0_12px_30px_rgba(15,61,94,0.06)] ${tones[index]}`}><p className="text-xs sm:text-sm font-black text-[#087F7A]">{isRtl ? eyebrow : eyebrow}</p><h2 className="mt-5 text-2xl font-black text-[#2B2F33] dark:text-white leading-9">{isRtl ? title : title}</h2><p className="mt-4 text-xs leading-7 text-gray-600 dark:text-gray-300 flex-1">{isRtl ? desc : desc}</p><button type="button" onClick={() => onNavigate?.(view)} className={`mt-7 self-start rounded-xl px-4 py-3 text-xs font-black text-white transition-colors cursor-pointer ${buttonTones[index]}`}>{isRtl ? `${cta} ←` : `${cta} →`}</button></article>;
          })}
        </section>

        {/* 6. Trust */}
        <section className="rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 text-start">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B2F33] dark:text-white">{isRtl ? 'پیش از انتشار هر محصول، چه چیزهایی بررسی می‌شود؟' : 'What is checked before a product is published?'}</h2>
            <p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'هر محصول پیش از معرفی عمومی، باید به برند یا نمایندهٔ مشخص، اطلاعات محصول قابل‌بررسی، فایل‌ها و وضعیت انتشار روشن متصل باشد. این بررسی‌ها کمک می‌کند کتابخانه به‌تدریج با محتوای قابل‌اعتماد رشد کند.' : 'Our goal is not to build the largest library in the shortest time. It is to build a trustworthy library. Brand identity, product information, files, and publication status are handled step by step.'}</p>
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
            {['هویت برند','اطلاعات محصول','بررسی فنی','انتشار مسئولانه'].map((x,i)=><div key={x} className="rounded-xl bg-white dark:bg-slate-950 p-3 border border-slate-100 dark:border-slate-800"><span className="text-[#0FB9B1] font-black">۰{i+1}</span><p className="mt-3 text-xs font-black text-gray-800 dark:text-white">{isRtl ? x : x}</p></div>)}
          </div>
        </section>

        {/* 7. Mission and roadmap */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start text-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'رسالت ما' : 'Our mission'}</h2>
            <h3 className="mt-3 text-xl sm:text-2xl font-black text-[#2B2F33] dark:text-white leading-tight">{isRtl ? 'نزدیک‌کردن صنعت ساختمان ایران به طراحی مبتنی بر داده' : 'Moving Iran’s construction industry closer to data-driven design'}</h3>
            <p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'ایران بیم هاب می‌خواهد زبانی مشترک میان تولیدکننده، معمار، مهندس و متخصص BIM بسازد؛ زبانی که در آن محصول فقط یک تصویر یا کاتالوگ نیست، بلکه بخشی از اطلاعات قابل‌استفاده در پروژه است.' : 'IranBIMhub aims to create a shared language for manufacturers, architects, engineers, and BIM specialists—where a product is more than an image or catalog and becomes usable project information.'}</p>
            <p className="mt-5 text-sm font-bold leading-7 text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'ما می‌خواهیم محصول واقعی، پیش از رسیدن به کارگاه، در مدل و گفت‌وگوی طراحی حضور داشته باشد.' : 'We want real products to be present in the model and design conversation before they reach the construction site.'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'چشم‌انداز ما' : 'Our vision'}</h2>
            <h3 className="mt-3 text-xl font-black text-[#2B2F33] dark:text-white">{isRtl ? 'یک نقشهٔ راه هفت‌مرحله‌ای، با تمرکز بر ساختن پایه‌های درست' : 'A seven-stage roadmap focused on building the right foundations'}</h3>
            <p className="mt-3 text-xs leading-7 text-gray-500 dark:text-gray-400">{isRtl ? 'امروز در مرحلهٔ پایه‌گذاری کتابخانهٔ اولیه و مسیر همکاری هستیم. هر مرحله پس از تثبیت مرحلهٔ قبل و بر اساس نیاز واقعی بازار توسعه پیدا می‌کند.' : 'Today we are building the initial library and collaboration path. Each stage follows only after the previous one is stable and market needs validate the next step.'}</p>
            <div className="mt-6 flex items-center justify-between gap-1" dir="ltr">{Array.from({length:7}).map((_,i)=><div key={i} className="flex items-center flex-1 last:flex-none"><span className={`w-6 h-6 rounded-full text-[9px] font-black flex items-center justify-center ${i===0 ? 'bg-[#0F3D5E] text-white ring-4 ring-[#0FB9B1]/15' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>{i+1}</span>{i<6&&<span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"/>}</div>)}</div>
            <p className="mt-4 text-[11px] font-black text-[#087F7A]">{isRtl ? 'فاز اول: کتابخانهٔ اولیه و مسیر همکاری' : 'Phase one: Initial library and collaboration path'}</p>
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 py-5 text-center"><ImageIcon className="mx-auto w-5 h-5 text-[#0FB9B1]" /><p className="mt-2 text-[10px] font-bold text-gray-500">{isRtl ? 'جای اسلاید یا تصویر آیندهٔ نقشهٔ راه' : 'Roadmap visual placeholder'}</p></div>
          </div>
        </section>

        {/* Contact path retained on the platform introduction page */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-7 sm:px-8 text-start flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-xl font-black text-[#2B2F33] dark:text-white">{isRtl ? 'برای شروع یک گفت‌وگوی تخصصی، با ما در ارتباط باشید' : 'Start a focused conversation with IranBIMhub'}</h2>
            <p className="mt-2 text-xs leading-7 text-gray-500 dark:text-gray-400">{isRtl ? 'برای معرفی محصول، بررسی مسیر ورود به BIM یا همکاری حرفه‌ای، می‌توانید از مسیر ارتباط با ما شروع کنید.' : 'For product introduction, a BIM entry-path review, or professional collaboration, start through our contact channel.'}</p>
            <div className="mt-4"><SocialIconsRow className="flex gap-2" iconClassName="w-4.5 h-4.5" /></div>
          </div>
          <button type="button" onClick={() => onNavigate?.('contact')} className="shrink-0 self-start lg:self-auto rounded-xl border border-[#0FB9B1]/35 bg-[#0FB9B1]/10 hover:bg-[#0FB9B1] hover:text-white px-4 py-3 text-xs font-black text-[#087F7A] transition-colors cursor-pointer">{isRtl ? 'تماس با ایران بیم هاب' : 'Contact IranBIMhub'}</button>
        </section>

        {/* 8. Final action */}
        <section className="rounded-3xl border border-[#0FB9B1]/25 bg-[#0FB9B1]/5 p-7 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[#2B2F33] dark:text-white">{isRtl ? 'ایران بیم هاب را از مسیر مناسب خودتان شروع کنید' : 'Start IranBIMhub from the path that fits you'}</h2>
          <p className="max-w-2xl mx-auto mt-4 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'امروز اطلاعات محصولتان را معرفی کنید؛ برای تصمیم‌های طراحی فردا آماده باشید.' : 'Introduce your product information today and be ready for tomorrow’s design decisions.'}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button onClick={() => onNavigate?.('for-manufacturers')} className="rounded-xl bg-[#0F3D5E] hover:bg-[#0A2D47] px-4 py-3 text-xs font-black text-white cursor-pointer">{isRtl ? 'معرفی برند و محصول' : 'Introduce a brand and product'}</button>
            <button onClick={() => onNavigate?.('for-designers')} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 text-xs font-black text-[#087F7A] cursor-pointer">{isRtl ? 'کاوش کتابخانهٔ اولیه' : 'Explore the initial library'}</button>
            <button onClick={() => onNavigate?.('for-bim-modelers')} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 text-xs font-black text-[#087F7A] cursor-pointer">{isRtl ? 'همکاری به‌عنوان متخصص BIM' : 'Collaborate as a BIM specialist'}</button>
          </div>
        </section>
      </main>
    );
  }

  // 2. RENDER CONTACT US VIEW
  if (viewMode === 'contact') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Banner with Map Accent */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E2326] to-[#464E56] text-white p-8 md:p-12 text-start shadow-xs">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-[10px] uppercase font-bold text-[#26B6B6] tracking-wider">{isRtl ? 'پاسخگویی سریع و فنی' : 'Prompt Technical Support'}</span>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {isRtl ? 'تماس با ما و دپارتمان‌های پشتیبانی' : 'Contact Us & Engineering Helpdesks'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              {isRtl 
                ? 'مهندسان مشاور و نمایندگان کارخانجات می‌توانند درخواست‌های ارزیابی، تبدیل فایل و همکاری‌های سازمانی را از طریق ارسال تیکت مستقیم پیگیری نمایند.'
                : 'Consulting engineers and industrial factory reps can coordinate files conversion, validation audits, and B2B alliances via our direct ticketing system.'
              }
            </p>
          </div>
        </section>

        {/* CONTACT CHANNELS & INTERACTIVE FORM */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-start pb-6">
          
          {/* Office Contact Coordinates (Row 1) */}
          <div className="bg-[#464E56] text-white p-8 rounded-3xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold">
                  {isRtl ? 'دبیرخانه مرکزی هاب بیم' : 'Central Secretariat'}
                </h2>
                <p className="text-[10px] text-gray-300 mt-1">
                  {isRtl ? 'پاسخگویی به درخواست‌های همکاری ملی و فنی' : 'Institutional partnerships & compliance desks'}
                </p>
              </div>

              <div className="space-y-4 font-light text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#26B6B6] shrink-0" />
                  <span>
                    {isRtl 
                      ? 'تهران، میدان ونک، خیابان ملاصدرا، پلاک ۱۴، طبقه سوم، واحد ۳۰۲' 
                      : 'Suite 302, 3rd Floor, No. 14, Mollasadra St., Vanak Square, Tehran, Iran'
                    }
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#26B6B6] shrink-0" />
                  <span className="font-mono text-gray-200">+98 21 8888 7766</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#26B6B6] shrink-0" />
                  <span className="font-mono text-gray-200">support@iranbimhub.ir</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#26B6B6] block">{isRtl ? 'دپارتمان بازرگانی' : 'Onboarding Hotline'}</span>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>+98 21 8888 7767</span>
              </div>
              <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                {isRtl 
                  ? 'شنبه تا چهارشنبه از ۹:۰۰ صبح الی ۱۷:۰۰ جهت هدایت پرونده‌های کارخانجات' 
                  : 'Dedicated expert guidance for industrial factories (Sat - Wed)'
                }
              </p>
            </div>
          </div>

          {/* Dynamic Contact ticketing Desk */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">
                {isRtl ? 'ارسال تیکت مستقیم به دپارتمان‌های هاب' : 'Direct Engineering ticketing Desk'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isRtl ? 'بخش مورد نظر را انتخاب نموده تا تیکت شما سریعاً پاسخ داده شود' : 'Select a target department below to route your ticket efficiently'}
              </p>
            </div>

            {/* Department Quick Buttons */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => selectDepartment('tech', 'پشتیبانی فنی فمیلی‌ها', 'Technical Support')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold text-center cursor-pointer transition-all ${
                  formData.department === 'tech' 
                    ? 'border-[#26B6B6] bg-[#26B6B6]/5 text-[#26B6B6]' 
                    : 'border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {isRtl ? 'پشتیبانی فنی' : 'Technical Support'}
              </button>
              <button
                type="button"
                onClick={() => selectDepartment('brand', 'عضویت و پذیرش کارخانجات', 'Brand Onboarding')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold text-center cursor-pointer transition-all ${
                  formData.department === 'brand' 
                    ? 'border-[#26B6B6] bg-[#26B6B6]/5 text-[#26B6B6]' 
                    : 'border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {isRtl ? 'پذیرش کارخانه' : 'Brand Onboarding'}
              </button>
              <button
                type="button"
                onClick={() => selectDepartment('general', 'دبیرخانه کل', 'General Secretariat')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold text-center cursor-pointer transition-all ${
                  formData.department === 'general' 
                    ? 'border-[#26B6B6] bg-[#26B6B6]/5 text-[#26B6B6]' 
                    : 'border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {isRtl ? 'درخواست عمومی' : 'General Inquiry'}
              </button>
            </div>

            {contactSubmitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-400 p-6 rounded-2xl text-xs space-y-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <p className="font-extrabold text-sm">{isRtl ? 'تیکت شما با موفقیت ثبت گردید' : 'Ticket Registered Successfully'}</p>
                <p className="font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                  {isRtl 
                    ? `موضوع: «${formData.subject || 'عمومی'}» با موفقیت ثبت شد. شناسه تیکت شما: CRM-9945 می‌باشد. همکاران دپارتمان مربوطه ظرف حداکثر ۲۴ ساعت کاری آینده با شما تماس خواهند گرفت.`
                    : `Subject "${formData.subject || 'General'}" has been processed. Your reference ticket ID is CRM-9945. Our staff will coordinate with you shortly.`
                  }
                </p>
                <button 
                  onClick={() => {
                    setContactSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '', department: 'general' });
                  }}
                  className="mt-3 text-[#26B6B6] font-bold hover:underline block cursor-pointer"
                >
                  {isRtl ? 'ارسال پیام جدید' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'نام و نام خانوادگی' : 'Full Name'}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isRtl ? 'مثال: مهندس کاوه باقری' : 'e.g. Kaveh Bagheri'}
                      className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'آدرس ایمیل کاری' : 'Business Email'}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="kaveh@bagheri-arch.ir"
                      className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'موضوع پیام' : 'Subject'}</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={isRtl ? 'مثال: درخواست پشتیبانی در تبدیل فایل IFC / پورتال برندها' : 'e.g. Help with IFC compliance conversion / brand pricing details'}
                    className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'شرح درخواست' : 'Detailed Message'}</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isRtl ? 'جزئیات درخواست یا مشخصات کاتالوگ صنعتی کارخانه خود را بنویسید...' : 'Type specific technical or catalog details here...'}
                    className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-6 py-3 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#26B6B6]/10"
                >
                  <span>{isRtl ? 'ثبت و ارسال تیکت مهندسی' : 'Dispatch Ticket'}</span>
                  <Send className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>

              </form>
            )}
          </div>
        </section>

        {/* SOCIAL CONTACT & FOLLOW GROUPS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Group 1: Direct Contact */}
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5 text-start">
              <h3 className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#26B6B6] shrink-0"></span>
                <span>{isRtl ? 'ارتباط مستقیم و پشتیبانی آنی' : 'Direct Contact & Instant Support'}</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                {isRtl 
                  ? 'جهت مشاوره سریع بازرگانی، ارسال فایل، یا پیگیری تیکت‌های پشتیبانی از این پیام‌رسان‌ها استفاده نمایید.' 
                  : 'Get in touch directly with our commercial desk or technical support teams via secure chat.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/982188887767" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/30 transition-all text-center flex flex-col items-center gap-2"
              >
                <div className="text-emerald-500">{WhatsAppIcon('w-6 h-6')}</div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{isRtl ? 'واتساپ' : 'WhatsApp'}</span>
                <span className="text-[9px] text-gray-400">{isRtl ? 'گفتگوی مستقیم' : 'Direct Chat'}</span>
              </a>

              {/* Telegram */}
              <a 
                href="https://t.me/iranbimhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/10 hover:border-sky-500/30 transition-all text-center flex flex-col items-center gap-2"
              >
                <div className="text-sky-500">{TelegramIcon('w-6 h-6')}</div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{isRtl ? 'تلگرام' : 'Telegram'}</span>
                <span className="text-[9px] text-gray-400">{isRtl ? 'ارسال سریع پیام' : 'Direct Message'}</span>
              </a>

              {/* Bale */}
              <a 
                href="https://ble.ir/iranbimhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-600/5 hover:bg-emerald-600/10 border border-emerald-600/10 hover:border-emerald-600/30 transition-all text-center flex flex-col items-center gap-2"
              >
                <div className="text-emerald-600">{BaleIcon('w-6 h-6')}</div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{isRtl ? 'بله' : 'Bale'}</span>
                <span className="text-[9px] text-gray-400">{isRtl ? 'پیام‌رسان بومی' : 'Domestic Chat'}</span>
              </a>
            </div>
          </div>

          {/* Group 2: Follow Us */}
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5 text-start">
              <h3 className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>{isRtl ? 'دنبال کنید و مطلع شوید' : 'Follow Our Official Content'}</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                {isRtl 
                  ? 'جهت مشاهده ویدیوهای آموزشی، معرفی برندها و مقالات تحلیلی، کانال‌های رسمی ما را دنبال کنید.' 
                  : 'Subscribe to our official brand pages to watch BIM masterclasses and read expert reports.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-medium">
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/company/iranbimhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-blue-600/5 hover:bg-blue-600/10 border border-blue-600/10 hover:border-blue-600/30 transition-all text-center flex flex-col items-center gap-2"
              >
                <div className="text-blue-600">{LinkedInIcon('w-5 h-5')}</div>
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">{isRtl ? 'لینکدین' : 'LinkedIn'}</span>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com/iranbimhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-pink-600/5 hover:bg-pink-600/10 border border-pink-600/10 hover:border-pink-600/30 transition-all text-center flex flex-col items-center gap-2"
              >
                <div className="text-pink-600">{InstagramIcon('w-5 h-5')}</div>
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">{isRtl ? 'اینستاگرام' : 'Instagram'}</span>
              </a>

              {/* Aparat */}
              <a 
                href="https://aparat.com/iranbimhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-rose-600/5 hover:bg-rose-600/10 border border-rose-600/10 hover:border-rose-600/30 transition-all text-center flex flex-col items-center gap-2"
              >
                <div className="text-rose-600">{AparatIcon('w-5 h-5')}</div>
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">{isRtl ? 'آپارات' : 'Aparat'}</span>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com/@iranbimhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-red-600/5 hover:bg-red-600/10 border border-red-600/10 hover:border-red-600/30 transition-all text-center flex flex-col items-center gap-2"
              >
                <div className="text-red-600">{YouTubeIcon('w-5 h-5')}</div>
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">{isRtl ? 'یوتیوب' : 'YouTube'}</span>
              </a>

              {/* X */}
              <a 
                href="https://x.com/iranbimhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-gray-900/5 hover:bg-gray-900/10 border border-gray-900/10 hover:border-gray-900/30 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 transition-all text-center flex flex-col items-center gap-2"
              >
                <div className="text-gray-800 dark:text-white">{XIcon('w-5 h-5')}</div>
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">{isRtl ? 'X / توییتر' : 'X / Twitter'}</span>
              </a>
            </div>
          </div>

        </section>

      </div>
    );
  }

  // 3. RENDER MANUFACTURERS DIRECTORY VIEW
  // (Searchable listing of verified industrial physical brands)
  const filteredManufacturers = MANUFACTURERS.filter(mfg => {
    const searchString = mfgSearch.toLowerCase();
    const name = (isRtl ? mfg.nameFa : mfg.nameEn).toLowerCase();
    const desc = (isRtl ? mfg.descriptionFa : mfg.descriptionEn).toLowerCase();
    const addr = ((isRtl ? mfg.addressFa : mfg.addressEn) || '').toLowerCase();
    return name.includes(searchString) || desc.includes(searchString) || addr.includes(searchString);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-start" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Directory Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E2326] via-[#2F3539] to-[#464E56] text-white p-8 md:p-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-[10px] uppercase font-bold text-[#26B6B6] tracking-wider">{isRtl ? 'دایرکتوری و ساختارهای نمونهٔ برند' : 'Brand Directory & Profile Templates'}</span>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {isRtl ? 'پروفایل‌های برند در ایران‌بیم‌هاب' : 'Brand Profiles on IranBIMhub'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
            {isRtl 
              ? 'برندهایی که پس از تکمیل اطلاعات و فعال‌سازی انتشار عمومی، در کتابخانهٔ ایران‌بیم‌هاب معرفی می‌شوند.'
              : 'Explore presentation-ready profile structures. Official brand pages are published after completing their information and publication process.'
            }
          </p>
        </div>
      </section>

      {/* Directory Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder={isRtl ? 'جستجوی نام برند، مصالح، مکان یا توضیحات...' : 'Search brand names, products, city...'}
            value={mfgSearch}
            onChange={(e) => setMfgSearch(e.target.value)}
            className="w-full text-xs p-2.5 pr-10 border border-gray-250 dark:border-gray-800 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-[#26B6B6] text-gray-800 dark:text-gray-100"
          />
        </div>
        <span className="text-[11px] text-gray-400 font-medium">
          {isRtl 
            ? `${filteredManufacturers.length} پروفایل نمونه یافت شد` 
            : `${filteredManufacturers.length} sample profiles found`
          }
        </span>
      </div>

      {/* Manufacturers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        {filteredManufacturers.map(mfg => (
          <div 
            key={mfg.id} 
            className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => onViewBrand && onViewBrand(mfg.id)}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-850 dark:to-gray-950 border border-gray-150 dark:border-gray-800 flex items-center justify-center text-[#26B6B6] font-black text-sm select-none shadow-2xs cursor-pointer hover:border-[#26B6B6]/50 hover:text-[#1e9494] transition-all"
                  >
                    {mfg.logo}
                  </div>
                  <div className="text-start">
                    <h3 
                      onClick={() => onViewBrand && onViewBrand(mfg.id)}
                      className="font-extrabold text-sm text-gray-800 dark:text-white flex items-center gap-1.5 hover:text-[#26B6B6] transition-colors cursor-pointer"
                    >
                      <span>{isRtl ? mfg.nameFa : mfg.nameEn}</span>
                      {mfg.verified && (
                        <span className="inline-flex text-[#26B6B6]" title={isRtl ? 'برند تایید شده' : 'Verified Brand'}>
                          <ShieldCheck className="w-4.5 h-4.5 fill-current text-emerald-500" />
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {isRtl ? (mfg.addressFa || 'ساختار نمونهٔ قابل شخصی‌سازی') : (mfg.addressEn || 'Customizable profile template')}
                    </p>
                  </div>
                </div>

                <span className="text-[9px] font-black bg-[#26B6B6]/15 text-[#26B6B6] px-2 py-0.5 rounded-full uppercase">
                  {mfg.tier || 'STANDARD'}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed text-start min-h-[48px]">
                {isRtl ? mfg.descriptionFa : mfg.descriptionEn}
              </p>

              {/* Profile state — metrics remain an internal feature until real data exists. */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-950/40 p-3 rounded-2xl border border-slate-100 dark:border-gray-850/30 text-[10px] text-gray-500 dark:text-gray-400">
                <Layers className="w-4 h-4 text-[#0FB9B1] shrink-0" />
                <span>{mfg.isSample ? (isRtl ? 'ساختار پیشنهادی برای نمایش پروفایل و اطلاعات محصول برند' : 'Suggested structure for a brand profile and product information') : (isRtl ? 'وضعیت اطلاعات برند در حال تکمیل است.' : 'Brand information is being completed.')}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-850 flex items-center justify-between text-xs">
              {mfg.website ? <a 
                href={mfg.website} 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-400 hover:text-[#26B6B6] flex items-center gap-1 font-mono text-[10px]"
              >
                <span>{mfg.website.replace('https://', '')}</span>
                <ExternalLink className="w-3 h-3" />
              </a> : <span className="text-[10px] text-gray-400">{isRtl ? 'ساختار پروفایل قابل شخصی‌سازی' : 'Customizable profile structure'}</span>}

              {onViewBrand && (
                <button
                  onClick={() => onViewBrand(mfg.id)}
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-4 py-2 rounded-xl text-[11px] font-black cursor-pointer transition-colors shadow-2xs"
                >
                  {isRtl ? (mfg.isSample ? 'مشاهدهٔ ساختار پروفایل' : 'مشاهدهٔ کاتالوگ آبجکت‌ها') : (mfg.isSample ? 'View Profile Structure' : 'View Objects Catalog')}
                </button>
              )}
            </div>

          </div>
        ))}
        {filteredManufacturers.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl">
            {isRtl ? 'هیچ کارخانه‌ای متناسب با ملاک جستجوی شما پیدا نشد.' : 'No registered factory found matching your query.'}
          </div>
        )}
      </div>

    </div>
  );
};
