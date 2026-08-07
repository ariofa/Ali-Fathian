import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  CheckCircle2, 
  Search, 
  Download, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Star, 
  Zap, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Database,
  Grid,
  Laptop,
  Layers,
  Building2
} from 'lucide-react';
import { CATEGORIES, BIM_OBJECTS } from '../../data';
import { BIMObjectCard } from '../BIMObjectCard';

interface ForDesignersViewProps {
  onNavigate: (view: string, customTextFa?: string, customTextEn?: string, param?: string) => void;
  onOpenAuthModal: () => void;
  savedObjects: string[];
  onToggleSave: (id: string) => void;
  onQuickDownload: (obj: any, format: string) => void;
  currentUser: any;
}

export const ForDesignersView: React.FC<ForDesignersViewProps> = ({
  onNavigate,
  onOpenAuthModal,
  savedObjects,
  onToggleSave,
  onQuickDownload,
  currentUser
}) => {
  const { language, isRtl } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [previewSearch, setPreviewSearch] = useState('');
  const [previewCategory, setPreviewCategory] = useState('all');
  const [compareTab, setCompareTab] = useState<'free' | 'vip'>('free');

  // Handle register action
  const handleStartFree = () => {
    if (currentUser) {
      onNavigate('modeler-dashboard');
    } else {
      onOpenAuthModal();
    }
  };

  // Sample object for concrete visual preview
  const sampleBimObject = BIM_OBJECTS[0] || {
    id: 'obj1',
    titleFa: 'پنجره دو‌جداره آلومینیومی آلوپن سری Alu-90',
    titleEn: 'Alupan Double-Glazed Aluminum Window Series Alu-90',
    category: 'doors_windows',
    subcategory: 'windows',
    formats: ['rfa', 'ifc', 'dwg'],
    fileSize: '4.2 MB',
    manufacturerId: 'm1',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    specs: { model: 'Alu-90', frame: 'Thermal Break' }
  };

  // Filter sample categories for preview
  const sampleCategories = CATEGORIES.slice(0, 4);

  // FAQ items for engineers
  const faqItems = [
    {
      qFa: 'آیا دسترسی به فایل‌ها واقعاً رایگان است؟',
      qEn: 'Is access to files really free?',
      aFa: 'بله! حساب کاربری عادی ایران‌بیم‌هاب کاملاً رایگان است و به شما اجازه می‌دهد تا سقف ۵ فایل استاندارد در روز را دانلود کرده، برندها را نشانه کرده و کارهای خود را مدیریت نمایید.',
      aEn: 'Yes! A standard account on IranBIMhub is completely free, allowing you to download up to 5 standard files per day, bookmark favorite brands, and organize saved files.'
    },
    {
      qFa: 'چه فرمت‌هایی از نرم‌افزارهای BIM پشتیبانی می‌شود؟',
      qEn: 'What BIM software formats are supported?',
      aFa: 'تمامی آبجکت‌ها حداقل در سه فرمت Revit (RFA) ،ArchiCAD (GSM) و فرمت تبادل استاندارد بین‌المللی باز (IFC) برای هماهنگی کامل با تمام ابزارهای AEC ارائه می‌شوند.',
      aEn: 'All objects are available in Revit (RFA), ArchiCAD (GSM), and open-source Industry Foundation Classes (IFC) standard formats to guarantee compatibility with popular AEC software.'
    },
    {
      qFa: 'آیا تاریخچه دانلود و اطلاعات پروژه‌های من خصوصی است؟',
      qEn: 'Is my download history and project data private?',
      aFa: 'صد درصد. ایران‌بیم‌هاب منطبق بر بالاترین سطوح امنیتی و حریم خصوصی کار طراحان طراحی شده است. تاریخچه کارپوشه شما فقط برای خودتان قابل مشاهده است.',
      aEn: 'Absolutely. IranBIMhub is built with robust security standards. Your download history and custom collection folders are private and strictly accessible only to your account.'
    },
    {
      qFa: 'آیا آبجکت‌ها منطبق با استانداردهای ملی و اجرایی ایران هستند؟',
      qEn: 'Are objects compliant with Iranian building standards?',
      aFa: 'بله. کاتالوگ‌های دیجیتال برندها قبل از انتشار عمومی توسط تیم ارزیابی فنی ما ارزیابی می‌شوند تا با پارامترهای مقررات ملی ساختمان (مانند عایق‌بندی حرارتی مبحث ۱۹ و کدهای حریق) مطابقت کامل داشته باشند.',
      aEn: 'Yes. Digital catalogs undergo rigorous QA checks by our engineering team to ensure alignment with national building codes (e.g., thermal performance Section 19 and safety standards).'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      nameFa: 'مهندس بردیا صدر',
      nameEn: 'Bardia Sadr, AIA',
      roleFa: 'معمار ارشد و مدیر پروژه',
      roleEn: 'Senior Architect & Project Manager',
      firmFa: 'مهندسین مشاور نقش‌جهان',
      firmEn: 'Naqsh-e-Jahan Consulting',
      commentFa: 'ایران‌بیم‌هاب دغدغه قدیمی ما در شبیه‌سازی دقیق و تحویل برآورد مصالح را حل کرده است. دیگر مدل‌های خارجی بدون بازار و غیرقابل تامین را وارد نقشه‌ها نمی‌کنیم.',
      commentEn: 'IranBIMhub has resolved our long-standing issue with material estimation. We no longer design with foreign catalogs that aren\'t available in the local market.',
      rating: 5
    },
    {
      nameFa: 'دکتر مریم سهرابی',
      nameEn: 'Dr. Maryam Sohrabi',
      roleFa: 'مدیر دپارتمان مدل‌سازی اطلاعات ساختمان (BIM)',
      roleEn: 'Director of BIM Implementation',
      firmFa: 'شرکت مهندسی کیسون',
      firmEn: 'Kayson Engineering Co.',
      commentFa: 'مدل‌های پارامتریک و منطبق بر استاندارد ملی در این هاب، بهره‌وری کار تیمی ما را بیش از ۴۰ درصد ارتقا داده است. سرعت کار به طرز محسوسی بالا رفته است.',
      commentEn: 'Parametric and standardized models provided here have increased our team\'s productivity by over 40%. The speedup in model coordination is exceptional.',
      rating: 5
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] dark:bg-gray-950 transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2326] via-[#2F3539] to-[#464E56] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-start">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#26B6B6_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#26B6B6]/15 border border-[#26B6B6]/20 rounded-full text-[11px] font-bold text-[#26B6B6]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'بستر دانلود تخصصی آبجکت‌های BIM برای معماران و مهندسان ایران' : 'Specialized BIM Object Download Hub for Iranian Architects & Engineers'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
              {isRtl ? 'دیگر لازم نیست هر آبجکت را از صفر مدل کنید' : 'Stop Modeling Every Object From Scratch'}
            </h1>
            
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl">
              {isRtl 
                ? 'مهندسان ایرانی روزانه ساعت‌ها وقت ارزشمند خود را صرف مدلسازی دستی درها، پنجره‌ها و تجهیزات می‌کنند، یا به کاتالوگ‌های خارجی پناه می‌برند که هیچ تطابقی با ابعاد، متریال و زنجیره تامین بازار مصالح کشورمان ندارد. ایران‌بیم‌هاب این خلاء بزرگ را حل کرده است.'
                : 'Iranian AEC professionals waste hours manually modeling doors, windows, and equipment, or rely on foreign catalogs that mismatch local standards, sizes, and active suppliers. IranBIMhub fills this gap.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleStartFree}
                className="px-8 py-3.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-98 shadow-md shadow-[#26B6B6]/20 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'ثبت‌نام رایگان' : 'Start Free Registration'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => {
                  onNavigate('categories');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer"
              >
                {isRtl ? 'مشاهده کاتالوگ محصولات' : 'Browse BIM Catalog'}
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1.5 bg-[#26B6B6]/15 rounded-3xl blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white dark:bg-gray-900 shadow-2xl text-gray-800 dark:text-gray-100 p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <span className="text-[11px] font-black text-[#138F8F] dark:text-[#26B6B6]">BIM WORKFLOW</span>
                <span className="text-[10px] font-bold text-gray-400">PRODUCT → BIM → DESIGN</span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-[.8fr_auto_1.25fr_auto_.8fr] gap-3 items-stretch" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 overflow-hidden text-center">
                  <div className="h-24 overflow-hidden bg-white dark:bg-gray-900">
                    <img src="/hero/bim-window.webp" alt="Generic window product" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-black text-[#464E56] dark:text-gray-200">PRODUCT</p>
                    <p className="mt-1 text-[10px] text-gray-400">Real product information</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center justify-center text-lg font-black text-[#26B6B6]">←</div>

                <div className="relative overflow-hidden rounded-2xl bg-[#0F3D5E] min-h-[195px] text-white p-4">
                  <img src="/hero/bim-window.webp" alt="BIM object example" className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.12)_1px,transparent_1px)] bg-[size:18px_18px]" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between"><span className="text-[11px] font-black text-[#22D3EE]">BIM OBJECT</span><Layers className="w-4 h-4 text-[#22D3EE]" /></div>
                    <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold text-slate-100">
                      {['Dimensions', 'Material', 'Manufacturer', 'Performance', 'BIM Parameters', 'File Format'].map((label) => <span key={label} className="rounded-md border border-[#22D3EE]/25 bg-[#0B1220]/45 px-1.5 py-1 text-center">{label}</span>)}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center justify-center text-lg font-black text-[#26B6B6]">←</div>

                <div className="relative rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-3 text-center overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.09] bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:10px_10px]" />
                  <div className="relative h-24 flex items-center justify-center"><Building2 className="w-14 h-14 text-[#464E56] dark:text-gray-300" /><span className="absolute w-4 h-7 border-2 border-[#26B6B6] bg-[#26B6B6]/15 rounded-sm" /></div>
                  <div className="relative"><p className="text-[10px] font-black text-[#464E56] dark:text-gray-200">PROJECT MODEL</p><p className="mt-1 text-[10px] text-gray-400">Use in design workflow</p></div>
                </div>
              </div>

              <p className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3 text-[10px] leading-6 text-gray-500 dark:text-gray-400 text-start">
                {isRtl ? 'نمونهٔ ساختاری مسیر محصول؛ فیلدها و وضعیت قابل‌نمایش هر محصول بر اساس اطلاعات واقعی همان برند مشخص می‌شود.' : 'A structural product-path example; visible fields and publication status are determined from each brand’s real information.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM, NAMED HONESTLY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-start">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-black text-[#26B6B6] uppercase tracking-wider">
            {isRtl ? 'چالش مهندسان ایرانی' : 'The Real Challenge for Iranian Engineers'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white leading-tight">
            {isRtl ? 'طراحی با نقشه فرضی، عامل اصلی تداخلات و هزینه مازاد کارگاه' : 'Designing with Imaginary Objects Causes Costly Site Clashes'}
          </h2>
          <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-light leading-relaxed space-y-4">
            <p>
              {isRtl 
                ? 'تا به امروز، معماران و مهندسان ایرانی یا باید تک‌تک اقلام ساختمانی را با حدس و گمان و به صورت خام دو‌بعدی ترسیم می‌کردند، یا فمیلی‌های آماده را از مراجع خارجی دانلود می‌کردند که ابعاد، اتصالات و کدهای هماهنگی آن‌ها با محصولات قابل تهیه در بازار ایران مغایر بود.'
                : 'Until now, local architects and engineers had to draw components as abstract 2D shapes, or download random foreign BIM models whose actual specs, joinery, and ratings mismatched the products physically procurable in Iran.'
              }
            </p>
            <p>
              {isRtl 
                ? 'این مغایرت هندسی و فنی در نهایت خود را در زمان ساخت نشان می‌دهد؛ جایی که لوله‌ها با تیرها تداخل پیدا کرده، ابعاد چهارچوب بازشوها با فریم پنجره‌ها نمی‌خواند و سفارش‌های میلیاردی مصالح باطل می‌شوند. راهکار درست، استفاده از اشیاء BIM از پیش ساخته‌شده و منطبق بر کاتالوگ رسمی سازندگان بومی است.'
                : 'This discrepancy manifests as expensive design clashes on the physical site: pipelines crossing ventilation ducts, windows failing to fit structural rough openings, and custom manufacturing orders going completely out of bounds. The only path forward is verified, brand-matched local BIM families.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHAT YOU GET (Interactive Mock Environment) */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-150 dark:border-gray-800 py-16 px-4 sm:px-6 lg:px-8 text-start">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
              {isRtl ? 'مکانیک کار بسیار ساده است: جستجو، فیلتر، دانلود' : 'Simple AEC Workflow: Search, Filter, Download'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              {isRtl 
                ? 'بدون نیاز به نصب نرم‌افزارهای پیچیده یا پرداخت هزینه‌های دلاری، آبجکت‌های واقعی برندها را بیابید.'
                : 'Discover and extract actual manufacturer-backed digital building blocks easily.'
              }
            </p>
          </div>

          {/* Interactive Preview Container */}
          <div className="bg-slate-50 dark:bg-gray-950 border border-gray-200/80 dark:border-gray-850 p-4 sm:p-8 rounded-3xl space-y-6">
            
            {/* Control Bar inside the Preview */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-250/50 dark:border-gray-800 pb-5">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={isRtl ? 'تست کنید: درب، پنجره، بوتان...' : 'Search demo: boiler, valve, door...'}
                  value={previewSearch}
                  onChange={(e) => setPreviewSearch(e.target.value)}
                  className="w-full text-xs p-2.5 pr-10 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                />
              </div>

              {/* Category selector */}
              <div className="flex gap-2 overflow-x-auto whitespace-nowrap py-1 scrollbar-none">
                <button
                  onClick={() => setPreviewCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    previewCategory === 'all' ? 'bg-[#26B6B6] text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-[#26B6B6]'
                  }`}
                >
                  {isRtl ? 'همه' : 'All'}
                </button>
                {sampleCategories.map(cat => {
                  const name = isRtl ? cat.nameFa : cat.nameEn;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setPreviewCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        previewCategory === cat.id ? 'bg-[#26B6B6] text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-[#26B6B6]'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Grid of Objects based on preview controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BIM_OBJECTS
                .filter(obj => {
                  const matchCat = previewCategory === 'all' || obj.category === previewCategory;
                  const title = isRtl ? obj.titleFa : obj.titleEn;
                  const matchSearch = !previewSearch || title.toLowerCase().includes(previewSearch.toLowerCase());
                  return matchCat && matchSearch;
                })
                .slice(0, 3)
                .map(obj => (
                  <div 
                    key={obj.id} 
                    className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between p-4"
                  >
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-50 relative">
                        <img src={obj.imageUrl} alt={obj.titleEn} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-[#464E56]/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                          {obj.fileSize}
                        </span>
                      </div>
                      <div className="space-y-1 text-start">
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-2 min-h-[32px]">
                          {isRtl ? obj.titleFa : obj.titleEn}
                        </h4>
                        <p className="text-[10px] text-gray-400">
                          {isRtl ? 'فرمت‌های موجود:' : 'Formats:'} <span className="font-mono font-bold text-gray-600 dark:text-gray-300">{obj.formats.join(', ').toUpperCase()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                      <button
                        onClick={() => onToggleSave(obj.id)}
                        className={`p-1.5 rounded-lg border cursor-pointer ${
                          savedObjects.includes(obj.id) 
                            ? 'bg-[#26B6B6]/10 border-[#26B6B6] text-[#26B6B6]' 
                            : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-500'
                        }`}
                        title={isRtl ? 'افزودن به علاقه‌مندی‌ها' : 'Add to Favorites'}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <div className="flex gap-1.5">
                        {obj.formats.slice(0, 2).map(fmt => (
                          <button
                            key={fmt}
                            onClick={() => onQuickDownload(obj, fmt)}
                            className="px-2.5 py-1 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <Download className="w-3 h-3" />
                            <span>{fmt.toUpperCase()}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              {BIM_OBJECTS.filter(obj => {
                const matchCat = previewCategory === 'all' || obj.category === previewCategory;
                const title = isRtl ? obj.titleFa : obj.titleEn;
                const matchSearch = !previewSearch || title.toLowerCase().includes(previewSearch.toLowerCase());
                return matchCat && matchSearch;
              }).length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400 text-xs">
                  {isRtl ? 'موردی متناسب با فیلتر شما در این دمو یافت نشد.' : 'No match found in the demo.'}
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 4. FREE ACCOUNT & FUTURE ADVANCED FEATURES (With mobile responsive swipeable layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-start">
        <div className="space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#26B6B6] uppercase tracking-wider">
              {isRtl ? 'حساب رایگان و امکانات پیشرفته آینده' : 'Free Account & Future Advanced Features'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
              {isRtl ? 'شروع رایگان؛ امکانات پیشرفته پس از تکمیل نسخه اولیه' : 'Start Free; Advanced Features After Initial Platform Is Ready'}
            </h2>
            <p className="text-xs text-gray-400 font-light">
              {isRtl ? 'در این مرحله تمرکز ایران‌بیم‌هاب روی دسترسی اولیه، جمع‌آوری بازخورد و ساخت کتابخانه قابل اعتماد است.' : 'At this stage, IranBIMhub focuses on early access, feedback, and building a trusted library.'}
            </p>
          </div>

          {/* Desktop & Tablet Table (Hidden on small mobile screen) */}
          <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl shadow-xs">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="p-4 text-start font-bold text-gray-800 dark:text-white w-2/5">{isRtl ? 'امکانات و ویژگی‌ها' : 'Features & Benefits'}</th>
                  <th className="p-4 text-center font-extrabold text-gray-500 dark:text-gray-400 w-1/5">{isRtl ? 'طرح عادی (رایگان)' : 'Free Account'}</th>
                  <th className="p-4 text-center font-extrabold text-[#26B6B6] w-1/5 bg-[#26B6B6]/5">{isRtl ? 'امکانات پیشرفته آینده' : 'Future Advanced Features'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'سقف دانلود روزانه فمیلی‌ها' : 'Daily download limit'}</td>
                  <td className="p-4 text-center text-gray-500">{isRtl ? '۵ فایل در روز' : '5 files per day'}</td>
                  <td className="p-4 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? 'پس از فعال‌سازی' : 'After activation'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'سازماندهی پروژه‌ها و پوشه‌ها' : 'Project & folder structures'}</td>
                  <td className="p-4 text-center text-gray-400 font-light">{isRtl ? 'پوشه پیش‌فرض تکی' : 'Single default folder'}</td>
                  <td className="p-4 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? 'قابل توسعه در نسخه‌های بعدی' : 'Planned for future versions'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'مجموعه علاقه‌مندی‌های شخصی' : 'Custom bookmark collections'}</td>
                  <td className="p-4 text-center text-gray-400 font-light">{isRtl ? 'لیست ساده تکی' : 'Basic single list'}</td>
                  <td className="p-4 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? 'پشتیبانی کامل چندگانه' : 'Multiple custom sets'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'پشتیبانی فنی در رفع نقص فایل‌ها' : 'Priority engineering support'}</td>
                  <td className="p-4 text-center text-gray-400 font-light">✕</td>
                  <td className="p-4 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? 'پشتیبانی اولویت‌دار پس از فعال‌سازی' : 'Priority support after activation'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'دسترسی به اسنادBEP بومی شده' : 'BEP & LOD templates'}</td>
                  <td className="p-4 text-center text-gray-500">{isRtl ? 'رایگان عمومی' : 'Free access'}</td>
                  <td className="p-4 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? 'شامل نسخه‌های اداری ویژه' : 'Premium organizational files'}</td>
                </tr>
                <tr className="bg-gray-50/30 dark:bg-gray-900/30">
                  <td className="p-5 font-extrabold text-gray-800 dark:text-white">{isRtl ? 'وضعیت فعلی' : 'Current Status'}</td>
                  <td className="p-5 text-center font-black text-gray-500">{isRtl ? 'رایگان همیشگی' : 'Free Forever'}</td>
                  <td className="p-5 text-center font-black text-[#26B6B6] bg-[#26B6B6]/10 text-sm">
                    {isRtl ? 'پس از تکمیل نسخه اولیه اعلام می‌شود' : 'To be announced after MVP validation'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile swipeable horizontal cards (one tier per card) */}
          <div className="sm:hidden space-y-4">
            
            {/* Tab buttons to compare */}
            <div className="flex border border-gray-200 dark:border-gray-800 rounded-xl p-1 bg-white dark:bg-gray-900">
              <button
                onClick={() => setCompareTab('free')}
                className={`flex-1 py-2 text-center text-xs font-extrabold rounded-lg cursor-pointer ${
                  compareTab === 'free' ? 'bg-[#26B6B6] text-white' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {isRtl ? 'طرح رایگان' : 'Free Tier'}
              </button>
              <button
                onClick={() => setCompareTab('vip')}
                className={`flex-1 py-2 text-center text-xs font-extrabold rounded-lg cursor-pointer ${
                  compareTab === 'vip' ? 'bg-[#26B6B6] text-white' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {isRtl ? 'امکانات پیشرفته آینده' : 'Future Advanced Features'}
              </button>
            </div>

            {/* Display active card details */}
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl space-y-4">
              {compareTab === 'free' ? (
                <>
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2">
                    <span className="font-black text-sm text-gray-800 dark:text-white">{isRtl ? 'طرح عادی (رایگان)' : 'Free Account'}</span>
                    <span className="text-xs font-bold text-gray-400">{isRtl ? 'رایگان همیشگی' : 'Free Forever'}</span>
                  </div>
                  <ul className="space-y-2 text-[11px] text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">✓ {isRtl ? 'دانلود ۵ فایل در روز' : '5 downloads per day'}</li>
                    <li className="flex items-center gap-2">✓ {isRtl ? 'سازماندهی در پوشه پیش‌فرض' : 'Single default folder'}</li>
                    <li className="flex items-center gap-2">✓ {isRtl ? 'لیست علاقه‌مندی ساده' : 'Basic bookmark list'}</li>
                    <li className="flex items-center gap-2 text-gray-400">✕ {isRtl ? 'بدون پشتیبانی ارزیابی فنی ممتاز' : 'No priority support'}</li>
                  </ul>
                  <button
                    onClick={handleStartFree}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-black cursor-pointer"
                  >
                    {isRtl ? 'ثبت‌نام رایگان' : 'Register Free'}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2">
                    <span className="font-black text-sm text-[#26B6B6]">{isRtl ? 'امکانات پیشرفته آینده' : 'Future Advanced Features'}</span>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">{isRtl ? 'به‌زودی' : 'Coming soon'}</span>
                  </div>
                  <ul className="space-y-2 text-[11px] text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">✓ {isRtl ? 'دانلود کاملاً نامحدود روزانه' : 'Unlimited downloads'}</li>
                    <li className="flex items-center gap-2">✓ {isRtl ? 'پوشه‌بندی نامحدود پروژه‌ها' : 'Unlimited nested folders'}</li>
                    <li className="flex items-center gap-2">✓ {isRtl ? 'کالکشن‌های اختصاصی دلخواه' : 'Multiple custom sets'}</li>
                    <li className="flex items-center gap-2">✓ {isRtl ? 'پشتیبانی مهندسی و بازبینی کاتالوگ' : 'Priority support desk'}</li>
                  </ul>
                  <button
                    onClick={() => {
                      if (currentUser) {
                        onNavigate('modeler-dashboard');
                      } else {
                        onOpenAuthModal();
                      }
                    }}
                    className="w-full py-2.5 bg-[#26B6B6] text-white rounded-xl text-xs font-black hover:bg-[#1e9494] transition-colors cursor-pointer"
                  >
                    {isRtl ? 'اعلام علاقه‌مندی به امکانات پیشرفته' : 'Register Interest in Advanced Features'}
                  </button>
                </>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 5. SOCIAL PROOF (Testimonials with named architects/companies) */}
      <section className="bg-slate-100/50 dark:bg-gray-900/30 border-y border-gray-200/50 dark:border-gray-850 py-16 px-4 sm:px-6 lg:px-8 text-start">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black text-[#26B6B6] uppercase tracking-wider">
              {isRtl ? 'گفت‌وگو با فعالان طراحی و BIM' : 'Conversations with Design & BIM Professionals'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
              {isRtl ? 'نیازهای واقعی طراحان را جدی می‌گیریم' : 'We listen to real designer needs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-0.5 text-amber-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed italic">
                    «{isRtl ? test.commentFa : test.commentEn}»
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-full bg-[#26B6B6]/10 text-[#26B6B6] font-black text-xs flex items-center justify-center shrink-0">
                    {test.nameEn.split(' ')[0][0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-800 dark:text-gray-100">
                      {isRtl ? test.nameFa : test.nameEn}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {isRtl ? `${test.roleFa} • ${test.firmFa}` : `${test.roleEn} at ${test.firmEn}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-start space-y-8">
        <div className="text-center">
          <HelpCircle className="w-8 h-8 text-[#26B6B6] mx-auto mb-2" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
            {isRtl ? 'سوالات متداول طراحان' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-gray-400">
            {isRtl ? 'پاسخ به سوالات و ابهامات مهندسان در خصوص مدل‌های هوشمند BIM' : 'Answers to common doubts on parametric BIM modeling'}
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const q = isRtl ? faq.qFa : faq.qEn;
            const a = isRtl ? faq.aFa : faq.aEn;

            return (
              <div 
                key={idx}
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-start font-bold text-xs text-gray-800 dark:text-gray-100 hover:text-[#26B6B6] flex justify-between items-center cursor-pointer select-none"
                >
                  <span>{q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#26B6B6]' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-4 bg-slate-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-850 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="bg-gradient-to-br from-[#464E56] to-[#1E2326] text-white py-16 px-4 sm:px-6 lg:px-8 text-center rounded-t-[40px] mt-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
            {isRtl ? 'آماده‌اید تا با دانلود آبجکت‌های آماده، در وقت و خطاهای طراحی خود صرفه‌جویی کنید؟' : 'Ready to Save Time and Reduce Design Errors with Ready-to-Use BIM Objects?'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed max-w-xl mx-auto">
            {isRtl 
              ? 'همین امروز حساب کاربری عادی و رایگان خود را ساخته و کار با فایل‌های پارامتریک و منطبق بر بازار خرید پروژه‌های واقعی ایران را آغاز کنید.'
              : 'Create your free account today and start utilizing parametric components aligned with physical procurement databases.'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={handleStartFree}
              className="px-8 py-3.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer text-center"
            >
              {isRtl ? 'ثبت‌نام رایگان' : 'Start Free Registration'}
            </button>
            <button
              onClick={() => {
                onNavigate('categories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center"
            >
              {isRtl ? 'مرور دسته‌بندی آبجکت‌ها' : 'Explore BIM Categories'}
            </button>
          </div>
        </div>
      </section>

      {/* PERSISTENT STICKY CTA BAR FOR MOBILE PHONES */}
      <div className="fixed bottom-[56px] left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-150 dark:border-gray-800/80 py-2.5 px-4 flex items-center justify-between sm:hidden select-none">
        <div className="text-start">
          <p className="text-[10px] text-gray-400">{isRtl ? 'عضویت طراحان و مهندسان' : 'Designer & Engineer Sign Up'}</p>
          <p className="text-[11px] font-black text-[#26B6B6]">{isRtl ? 'کاملاً رایگان' : 'Free Forever'}</p>
        </div>
        <button
          onClick={handleStartFree}
          className="px-4 py-2 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[11px] font-extrabold rounded-lg cursor-pointer"
        >
          {isRtl ? 'ثبت‌نام رایگان' : 'Start Free Registration'}
        </button>
      </div>

    </div>
  );
};
