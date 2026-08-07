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
  Factory,
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



  // 1. RENDER ABOUT VIEW (Platform overview)
  if (viewMode === 'about') {
    const BulletList: React.FC<{ items: string[]; light?: boolean }> = ({ items, light = false }) => (
      <ul className="space-y-2.5">
        {items.map((item) => <li key={item} className={`flex items-start gap-2 text-xs leading-6 ${light ? 'text-slate-100' : 'text-gray-600 dark:text-gray-300'}`}><CheckCircle className="w-4 h-4 shrink-0 mt-1 text-[#0FB9B1]" /><span>{item}</span></li>)}
      </ul>
    );

    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-9 space-y-8 sm:space-y-14" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Hero is the only visual container; the only content cards appear later in the value section. */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3D5E] via-[#123D5A] to-[#064E4B] text-white px-5 py-7 sm:px-10 sm:py-12">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0FB9B1_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative grid grid-cols-1 xl:grid-cols-[1.3fr_.7fr] gap-7 xl:gap-10 items-center">
            <div className="text-start">
              <p className="text-xs sm:text-sm font-black text-[#22D3EE]">{isRtl ? 'اولین مرجع تخصصی بازار ملی BIM ایران' : 'Iran’s first specialist national BIM marketplace'}</p>
              <h1 className="mt-4 text-2xl sm:text-5xl font-black leading-tight">{isRtl ? 'محصولات ساختمانی، پیش از خرید در مسیر طراحی دیده می‌شوند.' : 'Building products become visible in design before procurement.'}</h1>
              <p className="mt-5 max-w-3xl text-sm sm:text-base leading-7 sm:leading-8 text-slate-100">{isRtl ? 'ایران بیم هاب محصولات واقعی را با آبجکت BIM و اطلاعات فنی، در اختیار معماران و مهندسان قرار می‌دهد؛ تا طراحان سریع‌تر انتخاب کنند و تولیدکنندگان زودتر دیده شوند.' : 'IranBIMhub makes real products, BIM objects and technical information available to architects and engineers.'}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3"><button type="button" onClick={() => onNavigate?.('for-manufacturers')} className="w-full sm:w-auto rounded-xl bg-[#0FB9B1] hover:bg-[#087F7A] px-4 py-3 text-xs font-black text-white transition-colors cursor-pointer">{isRtl ? 'ثبت برند / معرفی محصول' : 'Register a brand / introduce a product'}</button><button type="button" onClick={() => onNavigate?.('categories')} className="w-full sm:w-auto rounded-xl border border-white/25 bg-white/5 hover:bg-white/10 px-4 py-3 text-xs font-black text-white transition-colors cursor-pointer">{isRtl ? 'مشاهده محصولات' : 'View products'}</button></div>
            </div>
            <button type="button" onClick={() => setIsAboutVideoOpen(true)} className="group relative min-h-[185px] sm:min-h-[245px] overflow-hidden rounded-2xl border border-white/15 bg-[#0B1220] text-center cursor-pointer shadow-2xl"><img src="https://img.youtube.com/vi/NvZN0DUiTKo/maxresdefault.jpg" onError={(event) => { event.currentTarget.src = 'https://img.youtube.com/vi/NvZN0DUiTKo/hqdefault.jpg'; }} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 transition-transform duration-700 group-hover:scale-105" /><span className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/95 via-[#0B1220]/35 to-[#0B1220]/20" /><span className="relative z-10 flex h-full min-h-[185px] sm:min-h-[245px] flex-col items-center justify-center gap-4 px-5"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0F3D5E] shadow-2xl transition-transform duration-300 group-hover:scale-110"><Play className="w-7 h-7 fill-current" /></span><span><span className="block text-sm font-black">{isRtl ? 'ایران بیم هاب در یک دقیقه' : 'IranBIMhub in one minute'}</span><span className="mt-1.5 block text-[11px] font-bold text-white/75">{isRtl ? 'تماشای ویدیوی معرفی پلتفرم' : 'Watch the platform introduction'}</span></span></span></button>
          </div>
        </section>

        {isAboutVideoOpen && (<div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B1220]/90 backdrop-blur-sm p-3 sm:p-6" role="dialog" aria-modal="true" onMouseDown={() => setIsAboutVideoOpen(false)}><div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B1220] shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><span className="text-sm font-black text-white">{isRtl ? 'ویدیوی معرفی ایران بیم هاب' : 'IranBIMhub introduction'}</span><button type="button" onClick={() => setIsAboutVideoOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-white/75 hover:bg-white/10 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button></div><div className="aspect-video bg-black"><iframe src="https://www.youtube-nocookie.com/embed/NvZN0DUiTKo?autoplay=1" title={isRtl ? 'ویدیوی معرفی ایران بیم هاب' : 'IranBIMhub introduction video'} className="h-full w-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div></div></div>)}

        <section className="text-start max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'ایران بیم هاب چیست؟' : 'What is IranBIMhub?'}</h2>
          <p className="mt-5 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'ایران بیم هاب محل گردآوری و معرفی آبجکت‌های BIM، مشخصات فنی، کاتالوگ و اطلاعات برند محصولات ساختمانی است. این پلتفرم، تولیدکنندگان و صاحبان برند را به معماران، مهندسان، طراحان و BIM Modelerها نزدیک می‌کند.' : 'IranBIMhub brings together BIM objects, technical specifications, catalogs, and brand information for building products.'}</p>
          <p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'برای تولیدکننده، این مسیر به معنی آماده‌کردن محصول برای معرفی حرفه‌ای در فضای طراحی است؛ برای طراح، به معنی دسترسی منظم‌تر به محصول واقعی و اطلاعات قابل‌بررسی آن.' : 'For manufacturers this is a professional product-introduction path; for designers it is structured access to real products and reviewable information.'}</p>
          <div className="mt-6"><button onClick={() => onNavigate?.('manufacturers')} className="text-xs font-black text-[#087F7A] hover:text-[#064E4B] underline underline-offset-4 cursor-pointer">{isRtl ? 'مشاهده برندها' : 'View brands'}</button></div>
        </section>

        <section className="text-start space-y-10 sm:space-y-12">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-10 sm:pb-12">
            <p className="text-xs font-black text-[#087F7A]">{isRtl ? 'مدل‌سازی اطلاعاتی ساختمان' : 'Building Information Modeling'}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'BIM چیست؟ (به زبان ساده)' : 'What is BIM? (Simply explained)'}</h2>
            <div className="mt-5 max-w-5xl"><p className="text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'BIM یا مدل‌سازی اطلاعاتی ساختمان بر مبنای اطلاعات واقعی، روشی برای طراحی و مدیریت پروژه‌های ساختمانی است که در آن هر جزء ساختمان علاوه بر مدل سه‌بعدی، اطلاعات واقعی خود را نیز همراه دارد.' : 'BIM is a design and project-management method in which elements carry both geometry and real information.'}</p><p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'به بیان ساده، در BIM هر در، پنجره، شیرآلات یا محصول ساختمانی فقط یک شکل سه‌بعدی نیست؛ مجموعه‌ای از اطلاعات واقعی مانند ابعاد، مشخصات فنی، استانداردها، عملکرد و اطلاعات تولیدکننده را نیز در خود دارد.' : 'In BIM, each product is more than a 3D shape; it carries dimensions, specifications, standards, performance and manufacturer information.'}</p><button onClick={() => onNavigate?.('learn')} className="mt-6 text-xs font-black text-[#087F7A] hover:text-[#064E4B] underline underline-offset-4 cursor-pointer">{isRtl ? 'آشنایی بیشتر با BIM' : 'Learn more about BIM'}</button></div>
          </div>
          <div>
            <p className="text-xs font-black text-[#087F7A]">{isRtl ? 'مدل محصول همراه با اطلاعات واقعی' : 'A product model with real information'}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'آبجکت BIM چیست؟' : 'What is a BIM object?'}</h2>
            <div className="mt-5 max-w-5xl"><p className="text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'آبجکت BIM نسخهٔ دیجیتال و هوشمند یک محصول ساختمانی است. این آبجکت علاوه بر ظاهر سه‌بعدی، اطلاعات واقعی محصول را نیز در اختیار نرم‌افزارهای BIM قرار می‌دهد و امکان استفادهٔ مستقیم از محصول در فرآیند طراحی را فراهم می‌کند.' : 'A BIM object is the intelligent digital version of a building product.'}</p><p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'هرچه آبجکت استانداردتر، دقیق‌تر و اطلاعات آن کامل‌تر باشد، کیفیت طراحی و تصمیم‌گیری پروژه نیز افزایش پیدا می‌کند. آبجکت‌های منتشرشده در ایران بیم هاب بر اساس چارچوب‌های تعریف‌شدهٔ پلتفرم بررسی و طبقه‌بندی می‌شوند.' : 'The more standard, accurate and complete an object is, the better the design and decision-making process can be.'}</p><button onClick={() => onNavigate?.('categories')} className="mt-6 text-xs font-black text-[#0F3D5E] dark:text-[#22D3EE] hover:underline underline-offset-4 cursor-pointer">{isRtl ? 'دسته‌بندی آبجکت‌ها' : 'Object categories'}</button></div>
          </div>
        </section>

        <section className="text-start"><h2 className="text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'چرا ایران بیم هاب شکل گرفت؟' : 'Why was IranBIMhub created?'}</h2><div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-6">{[['محصولات در مرحلهٔ طراحی دیده نمی‌شوند.','در حالی که تصمیم اصلی دربارهٔ انتخاب بسیاری از محصولات، ماه‌ها قبل از اجرا و در مرحلهٔ طراحی پروژه گرفته می‌شود، اکثر محصولات ساختمانی ایران هنوز حضور مؤثری در این مرحله ندارند.'],['اطلاعات محصولات پراکنده است.','معماران، مهندسان و BIM Modelerها برای پیدا کردن اطلاعات معتبر هر محصول باید میان وب‌سایت‌ها، فایل‌های PDF، کاتالوگ‌ها و منابع مختلف جست‌وجو کنند.'],['نبود آبجکت‌های BIM استاندارد','بسیاری از طراحان ساعت‌ها و گاهی روزها زمان صرف مدل‌سازی محصولاتی می‌کنند که می‌توانستند به‌صورت آماده، استاندارد و رایگان در اختیار جامعهٔ مهندسی قرار گیرند.']].map(([title,desc],i)=><div key={title} className="border-s-2 border-[#0FB9B1] ps-4"><span className="text-[#0FB9B1] font-black">۰{i+1}</span><h3 className="mt-2 text-lg font-black text-[#2B2F33] dark:text-white leading-8">{title}</h3><p className="mt-3 text-xs leading-7 text-gray-500 dark:text-gray-400">{desc}</p></div>)}</div><p className="mt-8 text-sm font-bold text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'ایران بیم هاب برای رفع همین فاصله میان صنعت ساختمان و فرآیند طراحی ایجاد شده است.' : 'IranBIMhub was created to address this gap.'}</p></section>

        {/* The only two content cards: designers on the right and manufacturers on the left in RTL. */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-start"><article className="rounded-3xl bg-gradient-to-br from-[#0F3D5E] to-[#064E4B] p-7 sm:p-9 text-white"><p className="text-sm font-black text-[#22D3EE]">{isRtl ? 'ارزش افزوده برای معماران و مهندسان' : 'Value for architects and engineers'}</p><div className="mt-6"><BulletList light items={['دانلود سریع آبجکت‌های استاندارد','دسترسی به اطلاعات فنی معتبر','کاهش زمان مدل‌سازی','افزایش کیفیت طراحی','انتخاب بهتر محصولات']} /></div></article><article className="rounded-3xl border border-[#D6A01D]/35 bg-gradient-to-br from-[#FFF8E8] to-white dark:from-[#352907] dark:to-slate-900 p-7 sm:p-9"><p className="text-sm font-black text-[#B9820D]">{isRtl ? 'ارزش افزوده برای تولیدکنندگان' : 'Value for manufacturers'}</p><div className="mt-6"><BulletList items={['حضور محصول در مرحلهٔ طراحی','افزایش دیده‌شدن برند','ساخت آبجکت BIM','معرفی حرفه‌ای محصولات','ارتباط با جامعهٔ مهندسی','آمادگی برای بازار دیجیتال ساختمان']} /></div></article></section>

        <section className="text-start">
          <h2 className="text-3xl sm:text-4xl font-black text-[#087F7A] dark:text-[#22D3EE]">
            {isRtl ? 'کنترل کیفیت و بررسی فنی' : 'Quality control and technical review'}
          </h2>
          <p className="mt-5 max-w-5xl text-sm leading-8 text-gray-600 dark:text-gray-300">
            {isRtl
              ? 'ایران بیم هاب تنها یک محل دانلود فایل نیست. فایل‌های تولیدشده و فایل‌های بارگذاری‌شده، در مسیر ارزیابی و کنترل کیفیت تخصصی بررسی می‌شوند.'
              : 'IranBIMhub is more than a file-download location. Files enter a specialist review and quality-control path.'}
          </p>
          <p className="mt-4 max-w-5xl border-s-2 border-[#0FB9B1] ps-4 text-sm font-bold leading-8 text-[#464E56] dark:text-gray-200">
            {isRtl
              ? 'فایل‌های منتشرشده بر اساس نوع محصول، ساختار اطلاعات، هندسه، نام‌گذاری، پارامترهای قابل‌استفاده، فرمت فایل و وضعیت انتشار بررسی می‌شوند.'
              : 'Published files are reviewed according to product type, information structure, geometry, naming, usable parameters, file format, and publication status.'}
          </p>
          <p className="mt-4 max-w-5xl text-sm leading-8 text-gray-500 dark:text-gray-400">
            {isRtl
              ? 'معیارهای بررسی به‌صورت مرحله‌ای در حال تدوین و تکمیل هستند و وضعیت هر محصول به‌صورت مستقل اعلام می‌شود.'
              : 'Review criteria are being developed and completed in stages, and each product’s status is announced independently.'}
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 text-start">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'مسیر استفاده از کتابخانه' : 'Library use path'}</h2>
            <p className="mt-3 text-sm font-black text-[#087F7A]">{isRtl ? 'برای معماران، مهندسان و BIM Modelerها' : 'For architects, engineers and BIM modelers'}</p>
            <ol className="mt-6 border-s border-slate-200 dark:border-slate-700 space-y-6">
              {[
                ['۱','جست‌وجو','محصول یا دستهٔ موردنیاز خود را پیدا کنید.'],
                ['۲','بررسی','اطلاعات فنی و آبجکت BIM را مشاهده کنید.'],
                ['۳','استفاده','فایل منتشرشده را دانلود و در پروژه استفاده کنید.'],
                ['۴','ارتباط','در صورت نیاز با تولیدکننده ارتباط بگیرید.']
              ].map(([n,title,desc]) => <li key={n} className="relative ps-8"><span className="absolute -start-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F3D5E] text-[10px] font-black text-white">{n}</span><h3 className="text-base sm:text-lg font-black text-[#2B2F33] dark:text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{desc}</p></li>)}
            </ol>
            <button onClick={() => onNavigate?.('categories')} className="mt-7 w-full sm:w-auto rounded-xl bg-[#0F3D5E] hover:bg-[#0A2D47] px-4 py-3 text-xs font-black text-white cursor-pointer">{isRtl ? 'مشاهده محصولات' : 'View products'}</button>
          </div>
          <div className="border-t lg:border-t-0 lg:border-s border-slate-200 dark:border-slate-800 pt-8 lg:pt-0 lg:ps-10">
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'مسیر ثبت برند و معرفی محصول' : 'Brand registration and product introduction path'}</h2>
            <p className="mt-3 text-sm font-black text-[#087F7A]">{isRtl ? 'برای تولیدکنندگان و صاحبان برند' : 'For manufacturers and brand owners'}</p>
            <ol className="mt-6 border-s border-slate-200 dark:border-slate-700 space-y-6">
              {[
                ['۱','ثبت برند','برند خود را ثبت کنید.'],
                ['۲','معرفی محصول','محصولات و کاتالوگ را معرفی کنید.'],
                ['۳','فایل یا تولید BIM','فایل آماده بررسی می‌شود یا مسیر تولید هماهنگ می‌گردد.'],
                ['۴','بررسی و انتشار','اطلاعات و فایل‌ها وارد مسیر بررسی می‌شوند.'],
                ['۵','به‌روزرسانی','اطلاعات محصولات را به‌روز نگه دارید.']
              ].map(([n,title,desc]) => <li key={n} className="relative ps-8"><span className="absolute -start-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#0FB9B1] text-[10px] font-black text-[#0B1220]">{n}</span><h3 className="text-base sm:text-lg font-black text-[#2B2F33] dark:text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{desc}</p></li>)}
            </ol>
            <button onClick={() => onNavigate?.('for-manufacturers')} className="mt-7 w-full sm:w-auto rounded-xl bg-[#087F7A] hover:bg-[#064E4B] px-4 py-3 text-xs font-black text-white cursor-pointer">{isRtl ? 'ثبت برند / معرفی محصول' : 'Register a brand / introduce a product'}</button>
          </div>
        </section>

        <section className="text-start space-y-12 sm:space-y-14">
          <div className="max-w-5xl"><h2 className="text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'رسالت ما' : 'Our mission'}</h2><p className="mt-5 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'رسالت ایران بیم هاب توسعهٔ فرهنگ BIM و ارتقای کیفیت اطلاعات محصولات ساختمانی در ایران است. ما باور داریم تصمیم‌های بهتر، از اطلاعات بهتر آغاز می‌شوند. با استانداردسازی اطلاعات محصولات، گسترش استفاده از BIM و ایجاد ارتباط مؤثر میان تولیدکنندگان و جامعه مهندسی، می‌توان کیفیت طراحی، هماهنگی پروژه‌ها، کاهش دوباره‌کاری و بهره‌وری صنعت ساختمان کشور را بهبود بخشید.' : 'Our mission is to develop BIM culture and improve building-product information in Iran.'}</p></div>
          <div className="max-w-5xl border-t border-slate-200 dark:border-slate-800 pt-10 sm:pt-12"><h2 className="text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'چشم‌انداز ما' : 'Our vision'}</h2><p className="mt-5 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'چشم‌انداز ایران بیم هاب تبدیل‌شدن به مرجع ملی اطلاعات محصولات ساختمانی و زیرساخت دیجیتال BIM ایران است. ما آینده‌ای را تصور می‌کنیم که هر محصول ساختمانی ایرانی دارای یک هویت دیجیتال استاندارد باشد و معماران، مهندسان و شرکت‌های ساختمانی بتوانند با اطمینان آن را در پروژه‌های خود به کار بگیرند.' : 'Our vision is to become a national reference for building-product information and BIM digital infrastructure in Iran.'}</p><p className="mt-4 text-xs leading-7 text-gray-500 dark:text-gray-400">{isRtl ? 'برای تحقق این هدف، نقشهٔ راه بلندمدت ایران بیم هاب در ۷ فاز توسعه برنامه‌ریزی شده است. امروز در ابتدای مسیر و در حال راه‌اندازی بخش نخست از فاز اول هستیم؛ اما چشم‌انداز ما فراتر از یک وب‌سایت دانلود آبجکت است.' : 'Our long-term roadmap has seven development phases. Today we are launching the first part of phase one.'}</p></div>
        </section>

        <section className="border-y border-slate-200 dark:border-slate-800 py-9 text-center">
          <div className="mx-auto max-w-4xl space-y-3 text-start">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE] text-right">{isRtl ? 'پرسش‌های پرتکرار' : 'Frequently asked questions'}</h2>
            {FAQ_ITEMS.map((faq, index) => <div key={faq.qFa} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"><button type="button" onClick={() => setOpenFaq(openFaq === String(index) ? null : String(index))} className="w-full flex items-center justify-between gap-4 min-h-[56px] px-5 py-4 text-start text-sm font-black text-[#2B2F33] dark:text-white cursor-pointer"><span>{isRtl ? faq.qFa : faq.qEn}</span><ChevronDown className={`w-4 h-4 shrink-0 text-[#26B6B6] transition-transform ${openFaq === String(index) ? 'rotate-180' : ''}`} /></button>{openFaq === String(index) && <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 text-sm leading-7 text-gray-600 dark:text-gray-300">{isRtl ? faq.aFa : faq.aEn}</div>}</div>)}
          </div>
          <div className="mt-12 max-w-5xl mx-auto text-right">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'با ما همراه باشید' : 'Stay connected with us'}</h2>
            <div className="mt-5 rounded-3xl border border-[#26B6B6]/25 bg-gradient-to-br from-white via-[#F7FFFF] to-[#EAFBFB] dark:from-gray-900 dark:via-gray-900 dark:to-[#112a2b] p-6 sm:p-8 text-start">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div><h3 className="text-xl font-black text-[#464E56] dark:text-white">{isRtl ? 'برای گفت‌وگو، مشاوره یا همکاری در کنار شما هستیم' : 'We are here for consultation and collaboration'}</h3><p className="mt-3 max-w-2xl text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'اگر دربارهٔ BIM، تولید آبجکت، معرفی محصولات یا همکاری با ایران بیم هاب پرسشی دارید، از راه‌های ارتباطی رسمی با ما در تماس باشید.' : 'For questions about BIM, object creation, product introduction, or collaboration, contact us through the official channels.'}</p></div>
                <div className="flex flex-col items-start lg:items-end gap-4"><SocialIconsRow className="flex gap-2 bg-white/80 dark:bg-gray-950/70 p-2.5 rounded-2xl border border-white/70 dark:border-gray-800" iconClassName="w-5 h-5" /><button onClick={() => onNavigate?.('contact')} className="text-xs font-black text-[#087F7A] hover:text-[#064E4B] underline underline-offset-4 cursor-pointer">{isRtl ? 'تماس و دریافت مشاوره' : 'Contact and request consultation'}</button></div>
              </div>
            </div>
          </div>
          <div className="mt-12 max-w-3xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-10"><h2 className="text-3xl sm:text-4xl font-black text-[#0F3D5E] dark:text-[#22D3EE]">{isRtl ? 'به جامعه ایران بیم هاب بپیوندید' : 'Join the IranBIMhub community'}</h2><p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-300">{isRtl ? 'چه معمار باشید، چه BIM Modeler، چه تولیدکننده یا صاحب برند، ایران بیم هاب جایی است که طراحی، اطلاعات و محصولات ساختمانی به هم متصل می‌شوند. از شما دعوت می‌کنیم بخشی از جامعه‌ای باشید که آیندهٔ دیجیتال صنعت ساختمان ایران را شکل می‌دهد.' : 'Whether you are an architect, BIM modeler, manufacturer, or brand owner, IranBIMhub connects design, information and building products.'}</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button onClick={() => onNavigate?.('categories')} className="rounded-xl bg-[#0F3D5E] hover:bg-[#0A2D47] px-4 py-3 text-xs font-black text-white cursor-pointer">{isRtl ? 'مشاهده محصولات' : 'View products'}</button><button onClick={() => onNavigate?.('for-manufacturers')} className="rounded-xl bg-[#26B6B6] hover:bg-[#138F8F] px-4 py-3 text-xs font-black text-white cursor-pointer">{isRtl ? 'ثبت برند / معرفی محصول' : 'Register a brand / introduce a product'}</button><button onClick={() => onNavigate?.('for-bim-modelers')} className="rounded-xl border border-[#26B6B6]/40 bg-white dark:bg-slate-900 px-4 py-3 text-xs font-black text-[#087F7A] dark:text-[#22D3EE] cursor-pointer">{isRtl ? 'همکاری با ما' : 'Collaborate with us'}</button></div></div>
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
