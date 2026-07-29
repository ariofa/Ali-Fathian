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
  Laptop
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
      ? `دانلود موفق سند استاندارد: «${title}». این فایل به عنوان یک قالب معتبر در اختیار شما قرار گرفت.`
      : `Standard Resource "${title}" has been successfully downloaded.`
    );
  };

  // 1. RENDER ABOUT VIEW (Platform overview)
  if (viewMode === 'about') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* HEADER HERO BANNER WITH GRADIENT */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#464E56] via-[#353B41] to-[#1E2326] text-white p-8 md:p-12 text-start">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#26B6B6]/10 border border-[#26B6B6]/20 text-[#26B6B6] rounded-full text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 animate-spin [animation-duration:12s]" />
              <span>{isRtl ? 'درگاه تعامل فنی و تجاری صنعت ساختمان' : 'AEC Technical & Commercial Integration Gateway'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {isRtl ? 'درباره هاب بیم ایران (IranBIMhub)' : 'About IranBIMhub'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              {isRtl 
                ? 'تلفیق دانش فنی مدل‌سازی اطلاعات ساختمان و توانمندی تولیدکنندگان داخلی جهت کاهش تداخلات، برآورد دقیق مصالح و بومی‌سازی استانداردهای دیجیتال مهندسی در پروژه‌های عمرانی کشور.'
                : 'Bridging the technical gap between parametric component modeling and real physical procurement for construction optimization, clash reduction, and digital standards implementation.'
              }
            </p>
          </div>
        </section>

        {/* CORE STATS & MISSION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-start">
            <div className="inline-flex items-center gap-1 text-[#26B6B6] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'ماموریت کلان ما' : 'Our Overarching Mission'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#464E56] dark:text-white leading-snug">
              {isRtl ? 'بومی‌سازی استانداردهای بیم برای ارتقای زنجیره تامین ساختمان' : 'Standardizing Building Information Modeling for Supply Chains'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              {isRtl 
                ? 'ایران‌بیم‌هاب به عنوان مرجع ملی مبادلات دیجیتال کالا و مدل‌های پارامتریک، با هدف پیاده‌سازی کامل سند بیم ملی طراحی شده است. ما به مهندسان مشاور و مجریان ساخت‌وساز کمک می‌کنیم تا کاتالوگ‌های معتبر و استاندارد را به‌صورت زنده از روی سرورهای ابری دانلود کرده و مستقیماً در نرم‌افزارهای Revit ،ArchiCAD و سایر پلتفرم‌های سازگار با استاندارد IFC قرار دهند.'
                : 'IranBIMhub serves as the definitive cloud specifier in the region. We support engineering consultancies and general contractors in fetching certified parametric digital representations directly from verified brands, eliminating model discrepancies and optimizing bills of material on standard Revit, ArchiCAD, and IFC open BIM terminals.'
              }
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-base sm:text-lg font-black text-[#26B6B6] block">۹۹.۸٪</span>
                <span className="text-[9px] text-gray-400 block">{isRtl ? 'صحت هندسی فمیلی‌ها' : 'Parametric Accuracy'}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-base sm:text-lg font-black text-[#26B6B6] block">۱۲+ بخش</span>
                <span className="text-[9px] text-gray-400 block">{isRtl ? 'دسته‌بندی تخصصی' : 'AEC Categories'}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-base sm:text-lg font-black text-[#26B6B6] block">۳۵,۰۰۰+</span>
                <span className="text-[9px] text-gray-400 block">{isRtl ? 'دانلود تجاری موفق' : 'Active Specifiers'}</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-video shadow-md border border-gray-100 dark:border-gray-800">
            <img 
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" 
              alt="High-tech digital twin rendering" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 text-start">
              <div className="text-white space-y-1">
                <span className="text-[9px] font-bold text-[#26B6B6] uppercase tracking-wider">{isRtl ? 'فناوری و مهندسی معاصر' : 'Contemporary AEC Engineering'}</span>
                <h3 className="font-extrabold text-sm sm:text-base">{isRtl ? 'ساخت دیجیتال، بهره‌وری واقعی' : 'Build Digitally, Deliver Physically'}</h3>
              </div>
            </div>
          </div>
        </section>

        {/* TWO TARGET AUDIENCE PATHWAYS */}
        <section className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 sm:p-10 space-y-8 text-start">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#464E56] dark:text-white">
              {isRtl ? 'خدمات تخصصی متناسب با نقش شما' : 'Specialized Portals for AEC Roles'}
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              {isRtl ? 'ایران‌بیم‌هاب بخش‌های کاملاً مجزا و کارآمدی را برای طراحان پروژه‌ها و کارخانجات صنعتی فراهم آورده است.' : 'IranBIMhub hosts distinct, high-fidelity pipelines for design specifiers and industrial brands.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-850 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 flex items-center justify-center text-[#26B6B6]">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-gray-800 dark:text-white">
                {isRtl ? 'برای معماران، مهندسان و مدلسازان' : 'For BIM Modelers, Architects & Engineers'}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                {isRtl 
                  ? 'دسترسی رایگان به صدها مدل هوشمند و معتبر فمیلی محصولات، کاتالوگ ابعاد و پیوست به دفترچه‌های فنی به همراه سازماندهی پروژه‌ها.' 
                  : 'Get unlimited access to certified standard-sized family models, complete with thermal and structural spec variables.'
                }
              </p>
              {onNavigate && (
                <button
                  onClick={() => {
                    onNavigate('for-designers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-[#26B6B6] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isRtl ? 'ورود به پورتال مهندسان' : 'View Modeler Benefits'}</span>
                  <span>&larr;</span>
                </button>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-850 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#26B6B6]/10 flex items-center justify-center text-[#26B6B6]">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-gray-800 dark:text-white">
                {isRtl ? 'برای سازندگان، برندها و تولیدکنندگان' : 'For Industrial Brands & Manufacturers'}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                {isRtl 
                  ? 'ثبت کاتالوگ و محصولات برای دیده شدن در فاز صفر نقشه‌های ملی، دریافت سرنخ‌های گرم B2B خرید و مشاهده تحلیل‌های آماری پیشرفته.' 
                  : 'Place your catalog into designers specifiers, capture hot procurement leads, and manage analytical performance metrics.'
                }
              </p>
              {onNavigate && (
                <button
                  onClick={() => {
                    onNavigate('for-manufacturers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-[#26B6B6] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isRtl ? 'ورود به پورتال تولیدکنندگان' : 'View Brand Benefits'}</span>
                  <span>&larr;</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* BIM EDUCATION SECTION */}
        <section className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-10 space-y-8 text-start">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <BookOpen className="w-8 h-8 text-[#26B6B6] mx-auto" />
            <h2 className="text-xl sm:text-2xl font-black text-[#464E56] dark:text-white">
              {isRtl ? 'چرا مدل‌سازی اطلاعات ساختمان (BIM) الزامی است؟' : 'Why is Building Information Modeling (BIM) Imperative?'}
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              {isRtl ? 'حرکت از نقشه‌های سنتی فاقد هوشمندی به سمت مدل‌های زنده، پارامتریک و هم‌بسته عمرانی' : 'Transitioning from non-intelligent 2D CAD vectors to living, breathing parametric building models'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light">
            <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl space-y-3 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-800 dark:text-white text-sm border-b border-gray-50 dark:border-gray-900 pb-2 flex gap-1.5 items-center text-[#26B6B6]">
                <Layers className="w-4 h-4 text-[#26B6B6] shrink-0" />
                <span>{isRtl ? '۱. شبیه‌سازی ۴بعدی و ۵بعدی' : '1. 4D & 5D Project Lifecycle'}</span>
              </h3>
              <p>
                {isRtl 
                  ? 'کاتالوگ‌های بیم به شما اجازه می‌دهند علاوه‌بر هندسه، زمان‌بندی ساخت (بعد چهارم) و برآورد زنده هزینه‌ها (بعد پنجم) را شبیه‌سازی کنید تا انحراف از بودجه به حداقل برسد.' 
                  : 'BIM families host geometric properties plus timeline stages (4D) and continuous cost variables (5D), minimizing over-budget construction risks.'
                }
              </p>
            </div>

            <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl space-y-3 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-800 dark:text-white text-sm border-b border-gray-50 dark:border-gray-900 pb-2 flex gap-1.5 items-center text-[#26B6B6]">
                <ShieldCheck className="w-4 h-4 text-[#26B6B6] shrink-0" />
                <span>{isRtl ? '۲. تضمین انطباق و گواهینامه‌ها' : '2. Quality & Standard Compliance'}</span>
              </h3>
              <p>
                {isRtl 
                  ? 'مدل‌های بارگذاری‌شده روی پلتفرم ایران‌بیم‌هاب ابتدا توسط مهندسان ارشد ارزیابی شده تا منطبق بر مقررات ملی ساختمان و کدهای فنی حریق و مصرف انرژی باشند.' 
                  : 'Every model listed undergoes strict QA reviews. We verify spatial bounds, local building code alignments, energy efficiency parameters, and fire safety ratings.'
                }
              </p>
            </div>

            <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl space-y-3 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-800 dark:text-white text-sm border-b border-gray-50 dark:border-gray-900 pb-2 flex gap-1.5 items-center text-[#26B6B6]">
                <Award className="w-4 h-4 text-[#26B6B6] shrink-0" />
                <span>{isRtl ? '۳. مدیریت هوشمند دارایی (COBie)' : '3. Operations & Asset Management'}</span>
              </h3>
              <p>
                {isRtl 
                  ? 'داده‌های پیوست در پایان پروژه ساختمانی مستقیماً جهت نگهداری و بهره‌برداری ساختمان تحویل کارفرما می‌شود، که موجب کاهش ۳۰ درصدی هزینه‌های دوره عمر ساختمان است.' 
                  : 'BIM metadata smoothly transitions into Operations and Facility Management (via COBie formats), reducing long-term post-construction maintenance costs by up to 30%.'
                }
              </p>
            </div>
          </div>
        </section>



        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="space-y-6 max-w-3xl mx-auto text-start pb-6">
          <div className="text-center">
            <HelpCircle className="w-8 h-8 text-[#26B6B6] mx-auto mb-2" />
            <h2 className="text-xl sm:text-2xl font-black text-[#464E56] dark:text-white">
              {t('faq') || 'سوالات متداول'}
            </h2>
          </div>

          <div className="space-y-3 pt-4">
            {FAQ_ITEMS.map((faq, i) => {
              const faqId = i.toString();
              const isOpen = openFaq === faqId;
              const q = isRtl ? faq.qFa : faq.qEn;
              const a = isRtl ? faq.aFa : faq.aEn;

              return (
                <div 
                  key={faqId}
                  className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faqId)}
                    className="w-full p-4 text-start font-bold text-xs text-gray-800 dark:text-gray-100 hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors flex justify-between items-center cursor-pointer select-none"
                  >
                    <span>{q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#26B6B6]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                      {a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* STAY CONNECTED SECTION */}
        <section className="pt-4">
          <StayConnectedBlock isRtl={isRtl} />
        </section>

      </div>
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
    const addr = (isRtl ? mfg.addressFa : mfg.addressEn).toLowerCase();
    return name.includes(searchString) || desc.includes(searchString) || addr.includes(searchString);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-start" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Directory Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E2326] via-[#2F3539] to-[#464E56] text-white p-8 md:p-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-[10px] uppercase font-bold text-[#26B6B6] tracking-wider">{isRtl ? 'دایرکتوری رسمی کارخانجات ساختمان ایران' : 'Official Iranian Physical Brands Specifier Directory'}</span>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {isRtl ? 'تولیدکنندگان معتبر صنعت ساختمان' : 'Verified Industrial Manufacturers'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
            {isRtl 
              ? 'لیست کامل و دسته‌بندی‌شده کارخانجاتی که دارای تاییدیه اصالت هندسی و فنی کاتالوگ مصالح در بستر مدل‌سازی اطلاعات ساختمان (BIM) کشور هستند.'
              : 'Complete directory of manufacturers whose physical specs and spatial catalog parameters have passed BIM quality-assurance standards.'
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
            ? `${filteredManufacturers.length} برند فعال یافت شد` 
            : `${filteredManufacturers.length} active brands found`
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
                      {isRtl ? mfg.addressFa : mfg.addressEn}
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

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-gray-950/40 p-3 rounded-2xl border border-slate-100 dark:border-gray-850/30 text-center text-[11px]">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase">{isRtl ? 'بازدید کاتالوگ' : 'Views'}</span>
                  <span className="font-bold text-gray-700 dark:text-gray-200 mt-0.5 block">{mfg.stats?.views?.toLocaleString() || '1,200'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase">{isRtl ? 'دانلود فمیلی' : 'Downloads'}</span>
                  <span className="font-bold text-gray-700 dark:text-gray-200 mt-0.5 block">{mfg.stats?.downloads?.toLocaleString() || '450'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase">{isRtl ? 'سرنخ‌های فروش' : 'Leads'}</span>
                  <span className="font-bold text-[#26B6B6] mt-0.5 block">{mfg.stats?.leads?.toLocaleString() || '24'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-850 flex items-center justify-between text-xs">
              <a 
                href={mfg.website} 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-400 hover:text-[#26B6B6] flex items-center gap-1 font-mono text-[10px]"
              >
                <span>{mfg.website.replace('https://', '')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {onViewBrand && (
                <button
                  onClick={() => onViewBrand(mfg.id)}
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-4 py-2 rounded-xl text-[11px] font-black cursor-pointer transition-colors shadow-2xs"
                >
                  {isRtl ? 'مشاهده کاتالوگ آبجکت‌ها' : 'View Objects Catalog'}
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
