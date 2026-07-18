import React from 'react';
import { useLanguage } from '../LanguageContext';
import { StayConnectedBlock } from '../SocialLinks';
import { 
  Compass, 
  Sparkles, 
  Building2, 
  Layers, 
  Cpu, 
  Wrench, 
  CheckCircle, 
  ArrowRight, 
  UserCheck, 
  LineChart, 
  FileSpreadsheet,
  PackageCheck
} from 'lucide-react';

interface IntroductionViewProps {
  onNavigate: (view: string) => void;
}

export const IntroductionView: React.FC<IntroductionViewProps> = ({ onNavigate }) => {
  const { isRtl } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. HERO HEADER BANNER WITH TECHNICAL GRID */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#464E56] via-[#353B41] to-[#1E2326] text-white p-8 md:p-12 text-start shadow-md">
        {/* Subtle coordinate grid overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#26B6B6_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none animate-pulse"></div>
        
        {/* Decorative laser line sweep */}
        <div className="absolute left-0 right-0 h-0.5 bg-[#26B6B6]/30 shadow-[0_0_10px_#26B6B6] pointer-events-none top-1/4"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#26B6B6]/15 border border-[#26B6B6]/30 text-[#26B6B6] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-spin [animation-duration:15s]" />
            <span>{isRtl ? 'معرفی جامع پلتفرم ملی بیم' : 'Complete Introduction of the National BIM Hub'}</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {isRtl ? 'ایران‌بیم‌هاب: پل ارتباطی صنعت و مهندسی دیجیتال' : 'IranBIMhub: Connecting Material Supply with Digital Twin Engineering'}
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light leading-relaxed max-w-3xl">
            {isRtl 
              ? 'بزرگترین پایگاه ملی آبجکت‌های پارامتریک و کاتالوگ‌های هوشمند صنعت ساختمان ایران. ما فاصله‌ی میان نقشه‌های سه‌بعدی طراحان و زنجیره خرید فیزیکی کارفرما را با کدهای فنی و ابعاد دقیق مسطح کرده‌ایم.'
              : 'Iran’s premium engineering portal for standard BIM objects and industrial brand catalogs. We bridge the gap between virtual design terminals and real-world procurement sheets.'
            }
          </p>
        </div>
      </section>

      {/* 2. WHAT IS IRANBIMHUB COMPLETE DEFINITION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 text-[#26B6B6] text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? 'ایران‌بیم‌هاب چیست؟' : 'WHAT IS IRANBIMHUB?'}</span>
          </div>
          
          <h2 className="text-xl sm:text-3xl font-black text-[#464E56] dark:text-white leading-tight">
            {isRtl 
              ? 'تغییر پارادایم از نقشه‌های خام دو‌بعدی به مدل‌های هوشمند زنده و متصل' 
              : 'The Digital Paradigm Shift for Contemporary Construction'
            }
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            {isRtl 
              ? 'ایران‌بیم‌هاب (IranBIMhub) یک اکوسیستم فنی-تجاری برای مدل‌سازی اطلاعات ساختمان (BIM) است. در روش‌های سنتی، مشخصات مصالح و تجهیزات ساختمان در قالب برگه‌های کاتالوگ کاغذی یا فایل‌های PDF غیرپویا مبادله می‌شد. طراحان ناچار بودند ابعاد تقریبی را ترسیم کنند که منجر به تداخلات شدید لوله‌کشی، حریق و تاسیسات در کارگاه می‌شد.'
              : 'IranBIMhub is a comprehensive digital asset environment. Historically, architectural component specifications were locked inside static brochures or flat PDF catalogs, forcing BIM modelers to draft approximate visual blocks. This discrepancy regularly resulted in severe on-site spatial collisions and expensive procurement modifications.'
            }
          </p>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            {isRtl 
              ? 'با ایران‌بیم‌هاب، کارخانجات صنعتی محصولات خود را به فایل‌های سه‌بعدی پارامتریک با کدگذاری فنی (مانند ابعاد دقیق، مقاومت حرارتی مبحث ۱۹، اطلاعات هیدرولیکی، و ضرایب مصرف انرژی) تبدیل می‌کنند. معماران و مهندسان با دانلود مستقیم این فایل‌ها و قراردادن آن‌ها در نرم‌افزارهای خود، طرح‌هایی ۱۰۰٪ انطباق‌پذیر با واقعیت پدید می‌آورند.'
              : 'Through our specialized platform, manufacturers transition their catalogs into verified 3D smart components rich in spatial, mechanical, thermal, and hydraulic attributes. Architects drop these certified digital representations into their models, guaranteeing designs that are 100% compliant with actual manufacturing lines.'
            }
          </p>

          {/* High-Level Values List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex gap-3 items-start">
              <span className="p-2 bg-[#26B6B6]/10 rounded-lg text-[#26B6B6] shrink-0">
                <Cpu className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-extrabold text-xs text-gray-800 dark:text-gray-200">{isRtl ? 'استاندارد سطح جزئیات بالا (LOD 350)' : 'High LOD 350 Standard'}</h4>
                <p className="text-[10px] text-gray-400 font-light mt-0.5">{isRtl ? 'ارائه مدل‌های به شدت دقیق هماهنگ با فرآیند مونتاژ در محل' : 'Superb geometric precision aligning perfectly with on-site assembly'}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="p-2 bg-[#26B6B6]/10 rounded-lg text-[#26B6B6] shrink-0">
                <Wrench className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-extrabold text-xs text-gray-800 dark:text-gray-200">{isRtl ? 'کاهش ۴۰ درصدی خطای تداخلات' : '40% Crash Collision Mitigation'}</h4>
                <p className="text-[10px] text-gray-400 font-light mt-0.5">{isRtl ? 'شناسایی و رفع زنده تداخل کانال‌ها و تیرها پیش از بتن‌ریزی' : 'Live conflict checking between structural and MEP elements before pouring'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Abstract Tech Render Side Image */}
        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg border border-gray-100 dark:border-gray-800 select-none">
          <img 
            src="https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80" 
            alt="Advanced CAD BIM engineering modeling terminal" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-start">
            <span className="text-[9px] font-black text-[#26B6B6] uppercase tracking-wider">{isRtl ? 'کاتالوگ زنده دوقلوهای دیجیتال' : 'Certified Digital-Twin Directory'}</span>
            <h3 className="font-extrabold text-sm sm:text-base text-white mt-1">{isRtl ? 'طراحی متصل به زنجیره تامین ملی' : 'Design Bound with Procured Reality'}</h3>
          </div>
        </div>
      </section>

      {/* 3. DUAL BENEFITS GRID - BUILDERS VS MANUFACTURERS */}
      <section className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-xl sm:text-3xl font-black text-[#464E56] dark:text-white">
            {isRtl ? 'مزایای دو سویه پلتفرم برای بازیگران کلیدی صنعت' : 'Who Benefits from IranBIMhub?'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
            {isRtl 
              ? 'چرا معماران و سازندگان بزرگ و از سوی دیگر کارخانجات صنعتی پیشرو به ایران‌بیم‌هاب اتکا می‌کنند؟' 
              : 'Our dual-engine model coordinates both the demand specifiers and supply manufacturing giants.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUMN 1: FOR BUILDERS & ENGINEERS */}
          <div className="bg-slate-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between text-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-[#26B6B6]/10 text-[#26B6B6] rounded-2xl">
                  <Layers className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-gray-800 dark:text-white">
                    {isRtl ? '۱. برای سازندگان، معماران و مهندسان مشاور' : '1. For Builders, Architects & Consultants'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">
                    {isRtl ? 'کاهش هزینه‌های مکرر بازطراحی و تضمین تحویل پروژه' : 'Eliminating remodeling tasks and securing material specifications'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4 space-y-4">
                
                {/* Benefit 1.1 */}
                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block text-gray-800 dark:text-gray-200">{isRtl ? 'آبجکت‌های پارامتریک و منطبق بر استاندارد ملی' : 'Localized Standardized Families'}</strong>
                    <span className="text-gray-500 dark:text-gray-400 font-light block">
                      {isRtl 
                        ? 'دیگر نیازی به مدلسازی تخمینی نیست. فایل‌های Revit با استانداردهای فمیلی رسمی، حجم سبک و متغیرهای دقیق منطقه‌بندی بارگذاری شده‌اند.'
                        : 'No more flat block representations. Standard, certified parametric models ready to insert with accurate performance attributes.'
                      }
                    </span>
                  </div>
                </div>

                {/* Benefit 1.2 */}
                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block text-gray-800 dark:text-gray-200">{isRtl ? 'برآورد متره و برآورد زنده (BOM) بیست برابر سریع‌تر' : 'Instant & Real-Time Bill of Materials (BOM)'}</strong>
                    <span className="text-gray-500 dark:text-gray-400 font-light block">
                      {isRtl 
                        ? 'به دلیل وجود مشخصات دقیق کارخانه در آبجکت، بلافاصله پس از تکمیل طراحی، متره دقیق مصالح و تجهیزات به همراه نام برندها آماده پرینت است.'
                        : 'Since files host exact physical parameters, Revit instantly yields itemized inventory sheets, saving weeks of manual estimation.'
                      }
                    </span>
                  </div>
                </div>

                {/* Benefit 1.3 */}
                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block text-gray-800 dark:text-gray-200">{isRtl ? 'ارتباط مستقیم و مکتوب با زنجیره تامین' : 'Direct Compliance Communication'}</strong>
                    <span className="text-gray-500 dark:text-gray-400 font-light block">
                      {isRtl 
                        ? 'تسهیل مکاتبات کارگاهی. هر زمان که نیاز به نمونه فیزیکی، استعلام قیمت یا برگه کاتالوک فنی محصول داشتید، اطلاعات تماس کارخانه ضمیمه فایل است.'
                        : 'Integrated manufacturer contacts allow procurement teams to quickly dispatch specs for live quotes or physical material samples.'
                      }
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <button 
              onClick={() => onNavigate('categories')}
              className="mt-6 bg-[#464E56] hover:bg-[#353B41] text-white font-extrabold text-xs py-3 px-5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 self-start active:scale-95 shadow-sm"
            >
              <span>{isRtl ? 'کاوش در آرشیو دسته‌بندی‌ها' : 'Browse BIM Object Catalog'}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* COLUMN 2: FOR MANUFACTURERS & BRANDS */}
          <div className="bg-slate-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between text-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-gray-800 dark:text-white">
                    {isRtl ? '۲. برای کارخانجات، تولیدکنندگان و صاحبان برند' : '2. For Manufacturers & Industrial Brands'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">
                    {isRtl ? 'تضمین حضور محصول در اسناد خرید پروژه پیش از مرحله مناقصه' : 'Securing material specs in active blue-prints prior to procurement stages'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4 space-y-4">
                
                {/* Benefit 2.1 */}
                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle className="w-4 h-4 text-[#26B6B6] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block text-gray-800 dark:text-gray-200">{isRtl ? 'انحصار در مشخصات خرید (Bidding Specs)' : 'Firm Specification Lock-in'}</strong>
                    <span className="text-gray-500 dark:text-gray-400 font-light block">
                      {isRtl 
                        ? 'وقتی طراح، فمیلی رویت کارخانه شما را در سند قرار می‌دهد، محصول شما وارد لیست متره پروژه‌ها شده و تعویض آن با برندهای فاقد آبجکت سخت خواهد بود.'
                        : 'Once an architect inserts your parametric object, your technical specification is baked directly into the official procurement lists.'
                      }
                    </span>
                  </div>
                </div>

                {/* Benefit 2.2 */}
                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle className="w-4 h-4 text-[#26B6B6] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block text-gray-800 dark:text-gray-200">{isRtl ? 'پنل آماری و ابزار تحلیل دوقلو دیجیتال' : 'Advanced Market Intelligence Panel'}</strong>
                    <span className="text-gray-500 dark:text-gray-400 font-light block">
                      {isRtl 
                        ? 'مشاهده آمار دقیق دانلود فایل‌ها، تعداد ذخیره شدن محصولات، کات‌شیت‌های خوانده شده و دسترسی به اطلاعات تماس طراحان علاقه‌مند.'
                        : 'Access custom analytical dashboards showing download rates, saves, and specs activity across major architectural bureaus.'
                      }
                    </span>
                  </div>
                </div>

                {/* Benefit 2.3 */}
                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle className="w-4 h-4 text-[#26B6B6] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block text-gray-800 dark:text-gray-200">{isRtl ? 'همگام‌سازی و پشتیبانی با تیم مدل‌سازی ایران‌بیم‌هاب' : 'Full Conversion Services Support'}</strong>
                    <span className="text-gray-500 dark:text-gray-400 font-light block">
                      {isRtl 
                        ? 'نگران تخصص مدلسازی رویت نباشید! دپارتمان مدل‌سازی ما کاتالوگ‌های سنتی شما را با هزینه اندک به بهترین فمیلی‌های رویت تبدیل می‌کند.'
                        : 'No technical hurdles. Our internal engineering department converts your catalogs into high-performance Revit and IFC objects.'
                      }
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <button 
              onClick={() => onNavigate('for-manufacturers')}
              className="mt-6 bg-[#26B6B6] hover:bg-[#1e9494] text-white font-extrabold text-xs py-3 px-5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 self-start active:scale-95 shadow-sm shadow-[#26B6B6]/20"
            >
              <span>{isRtl ? 'ثبت کاتالوگ و ورود به بخش برندها' : 'Register Brand & Join Portal'}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC STEP-BY-STEP WORKFLOW INFOGRAPHIC */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-10 text-start space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-lg sm:text-2xl font-black text-[#464E56] dark:text-white">
            {isRtl ? 'چرخه حیات کاتالوگ دیجیتال در ایران‌بیم‌هاب' : 'The Lifespan of a Digital-Twin Specification'}
          </h2>
          <p className="text-xs text-gray-400 font-light">
            {isRtl ? 'فرآیند گام‌به‌گام از کارخانه صنعتی تا اجرای واقعی در محل کارگاه ساختمانی' : 'Step-by-step process flow starting at local foundries and completing on active sites'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-gray-600 dark:text-gray-300">
          
          {/* Step 1 */}
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3 relative">
            <span className="absolute top-4 right-4 text-3xl font-black text-[#26B6B6]/15 font-mono">01</span>
            <span className="inline-flex p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
              <Building2 className="w-4 h-4" />
            </span>
            <h4 className="font-extrabold text-gray-800 dark:text-white text-xs pt-1">
              {isRtl ? '۱. ارائه اسناد کارخانه' : '1. Catalog Submittal'}
            </h4>
            <p className="font-light text-[11px] leading-relaxed">
              {isRtl 
                ? 'کارخانه کاتالوگ فیزیکی، برگه‌های فنی ابعاد، کات‌شیت‌ها یا دیتای استاندارد را ارسال می‌کند.' 
                : 'Brands join the portal and upload physical files, structural specifications, and standard sizing matrices.'
              }
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3 relative">
            <span className="absolute top-4 right-4 text-3xl font-black text-[#26B6B6]/15 font-mono">02</span>
            <span className="inline-flex p-2.5 bg-[#26B6B6]/10 text-[#26B6B6] rounded-xl">
              <Cpu className="w-4 h-4" />
            </span>
            <h4 className="font-extrabold text-gray-800 dark:text-white text-xs pt-1">
              {isRtl ? '۲. مدل‌سازی هوشمند' : '2. Quality Assurance & Model'}
            </h4>
            <p className="font-light text-[11px] leading-relaxed">
              {isRtl 
                ? 'متخصصان هاب مدل‌ها را با فرمت Revit (.rfa) و فرمت فراملی openBIM (.ifc) مدل‌سازی دقیق می‌کنند.' 
                : 'BIM experts refine 3D parametric families ensuring compliance with energy and mechanical constraints.'
              }
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3 relative">
            <span className="absolute top-4 right-4 text-3xl font-black text-[#26B6B6]/15 font-mono">03</span>
            <span className="inline-flex p-2.5 bg-[#26B6B6]/10 text-[#26B6B6] rounded-xl">
              <UserCheck className="w-4 h-4" />
            </span>
            <h4 className="font-extrabold text-gray-800 dark:text-white text-xs pt-1">
              {isRtl ? '۳. دانلود و قرارگیری در طرح' : '3. Specifying on CAD Terminals'}
            </h4>
            <p className="font-light text-[11px] leading-relaxed">
              {isRtl 
                ? 'معماران آبجکت‌ها را با یک کلیک در مدل‌های خود قرار داده و اتصالات الکتریکال و مکانیکال را متصل می‌کنند.' 
                : 'Specifiers download objects and place them on active blueprints, locking the brand in.'
              }
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3 relative">
            <span className="absolute top-4 right-4 text-3xl font-black text-[#26B6B6]/15 font-mono">04</span>
            <span className="inline-flex p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <PackageCheck className="w-4 h-4" />
            </span>
            <h4 className="font-extrabold text-gray-800 dark:text-white text-xs pt-1">
              {isRtl ? '۴. سفارش خرید قطعی' : '4. Automated Procurement'}
            </h4>
            <p className="font-light text-[11px] leading-relaxed">
              {isRtl 
                ? 'فهرست مصالح استخراج شده و پیمانکار مستقیماً برای خرید با کارخانه تماس می‌گیرد و خطا به صفر می‌رسد.' 
                : 'Revit exports automated supply schedules. Contractors contact the factory directly, removing delivery error.'
              }
            </p>
          </div>

        </div>
      </section>

      {/* 5. NUMERICAL EVIDENCE SUMMARY ROW */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-start">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl space-y-1 hover:shadow-xs transition-shadow">
          <span className="text-3xl font-black text-[#26B6B6] block">۴۰٪</span>
          <span className="font-bold text-xs text-[#464E56] dark:text-gray-200 block">{isRtl ? 'کاهش خطاهای کارگاهی' : 'Reduction in Clashes'}</span>
          <p className="text-[10px] text-gray-400 font-light leading-normal">{isRtl ? 'با شبیه‌سازی تداخل لوله‌کشی و داکت پیش از ساخت' : 'Avoid physical re-routing of pipes and beams'}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl space-y-1 hover:shadow-xs transition-shadow">
          <span className="text-3xl font-black text-[#26B6B6] block">۳۰٪</span>
          <span className="font-bold text-xs text-[#464E56] dark:text-gray-200 block">{isRtl ? 'کاهش زباله و اتلاف متریال' : 'Material Waste Mitigation'}</span>
          <p className="text-[10px] text-gray-400 font-light leading-normal">{isRtl ? 'با سفارش دقیق ابعاد و متراژهای تولید کالا' : 'Highly accurate measurements and quantity sheets'}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl space-y-1 hover:shadow-xs transition-shadow">
          <span className="text-3xl font-black text-[#26B6B6] block">۲.۵ برابر</span>
          <span className="font-bold text-xs text-[#464E56] dark:text-gray-200 block">{isRtl ? 'سرعت در طراحی اسناد' : 'Design Spec Speed'}</span>
          <p className="text-[10px] text-gray-400 font-light leading-normal">{isRtl ? 'بدون اتلاف وقت برای مدلسازی آبجکت‌های سفارشی' : 'Insert pre-modeled components with single-click ease'}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl space-y-1 hover:shadow-xs transition-shadow">
          <span className="text-3xl font-black text-[#26B6B6] block">۳۵,۰۰۰+</span>
          <span className="font-bold text-xs text-[#464E56] dark:text-gray-200 block">{isRtl ? 'بارگیری موفق کاتالوگ' : 'Standard Downloads'}</span>
          <p className="text-[10px] text-gray-400 font-light leading-normal">{isRtl ? 'توسط دفاتر فنی معماران برتر کشور' : 'Verified specs downloaded by national AEC design experts'}</p>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="bg-gradient-to-br from-[#464E56] to-[#1E2326] text-white rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <h2 className="text-xl sm:text-3xl font-black">
            {isRtl ? 'هم‌اکنون به زنجیره مهندسی دیجیتال بپیوندید' : 'Connect Your Workflow to the Digital Grid'}
          </h2>
          <p className="text-xs text-gray-300 font-light leading-relaxed">
            {isRtl 
              ? 'فرقی نمی‌کند طراح سازه هستید یا مدیر کارخانه صنعتی بزرگ؛ در ایران‌بیم‌هاب ابزارهای اختصاصی شما مهیاست.' 
              : 'Whether you are a certified BIM coordinator or a marketing director of an industrial giant, we have the workspace for you.'
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10 pt-2">
          <button 
            onClick={() => onNavigate('categories')}
            className="w-full sm:w-auto bg-[#26B6B6] hover:bg-[#1e9494] text-white px-8 py-3.5 rounded-xl text-xs font-black transition-all hover:scale-105 shadow-sm shadow-[#26B6B6]/25 cursor-pointer"
          >
            {isRtl ? 'کاوش در آرشیو کاتالوگ بیم' : 'Explore BIM Catalog'}
          </button>
          
          <button 
            onClick={() => onNavigate('for-manufacturers')}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-3.5 rounded-xl text-xs font-black transition-all hover:scale-105 cursor-pointer"
          >
            {isRtl ? 'ثبت برند کارخانه صنعتی' : 'Join as Industrial Brand'}
          </button>
        </div>
      </section>

      {/* STAY CONNECTED SECTION */}
      <section className="pt-4">
        <StayConnectedBlock isRtl={isRtl} />
      </section>

    </div>
  );
};
