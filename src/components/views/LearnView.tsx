import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { TelegramIcon, WhatsAppIcon, LinkedInIcon } from '../SocialLinks';
import { 
  BookOpen, 
  Video, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Award, 
  FileText, 
  CheckCircle2, 
  Play, 
  Share2, 
  Building2, 
  Lightbulb,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface Article {
  id: string;
  category: 'basics' | 'business' | 'market' | 'guides';
  type: 'article' | 'video';
  readTimeFa: string;
  readTimeEn: string;
  titleFa: string;
  titleEn: string;
  summaryFa: string;
  summaryEn: string;
  imageUrl: string;
  isPinned?: boolean;
  ctaFa: string;
  ctaEn: string;
  ctaTarget: string;
  // Sections of rich content
  sectionsFa: {
    heading?: string;
    paragraphs: string[];
    bullets?: string[];
    quote?: string;
    mediaPlaceholder?: {
      type: 'video' | 'infographic';
      title: string;
      description: string;
    };
  }[];
  sectionsEn: {
    heading?: string;
    paragraphs: string[];
    bullets?: string[];
    quote?: string;
    mediaPlaceholder?: {
      type: 'video' | 'infographic';
      title: string;
      description: string;
    };
  }[];
}

export const ARTICLES: Article[] = [
  {
    id: 'what-is-bim',
    category: 'basics',
    type: 'video',
    readTimeFa: '۲ دقیقه مطالعه',
    readTimeEn: '2 min read',
    titleFa: 'بیم (BIM) چیست؟ آموزش پایه در ۹۰ ثانیه',
    titleEn: 'What is BIM? Basics Explained in 90 Seconds',
    summaryFa: 'مدل‌سازی اطلاعات ساختمان (BIM) یک فرآیند هوشمند مبتنی بر مدل سه بعدی است که به متخصصان معماری، مهندسی و ساخت (AEC) ابزار و بینش لازم برای برنامه‌ریزی، طراحی و مدیریت کارآمدتر ساختمان‌ها را می‌دهد.',
    summaryEn: 'Building Information Modeling (BIM) is an intelligent 3D model-based process that gives architecture, engineering, and construction (AEC) professionals the tools and insights to plan, design, and manage buildings more efficiently.',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    isPinned: true,
    ctaFa: 'بررسی آبجکت‌های کاتالوگ',
    ctaEn: 'Browse Object Catalog',
    ctaTarget: 'categories',
    sectionsFa: [
      {
        heading: 'مفهوم مدل‌سازی اطلاعات ساختمان',
        paragraphs: [
          'بیم (BIM) صرفاً یک نرم‌افزار سه بعدی مانند رویت یا آرشیکد نیست؛ بلکه یک متدولوژی انقلابی کار تیمی است. در روش سنتی نقشه‌کشی، هر تغییر در پلان مستلزم ویرایش دستی مقاطع و نماها بود. در سیستم BIM، شما یک پایگاه داده دیجیتال متمرکز از کل بنا می‌سازید.',
          'هر جزیی که در مدل قرار می‌گیرد، فراتر از خطوط ساده هندسی، اطلاعات هویتی به همراه دارد. به عنوان مثال، یک پنجره در مدل BIM شامل ابعاد واقعی، ضریب هدایت حرارتی، نام کارخانه سازنده ایرانی، شماره سریال و کات‌شیت رسمی است.'
        ],
        mediaPlaceholder: {
          type: 'video',
          title: 'ویدیو کوتاه: مفهوم بنیادی BIM در صنعت ساخت ایران',
          description: 'توضیح تصویری جریان اطلاعات بین مهندسان محاسب، معماران و سازنده قطعات ساختمانی.'
        }
      },
      {
        heading: 'چرا باید به عنوان تولیدکننده یا طراح اهمیت بدهیم؟',
        paragraphs: [
          'برای طراحان: دسترسی به آبجکت‌های آماده با ابعاد دقیق کارخانجات ایرانی، سرعت طراحی را تا ۴۰٪ افزایش داده و احتمال خطاهای اجرایی (برخورد لوله‌ها با تیرها) را به صفر نزدیک می‌کند.',
          'برای تولیدکنندگان: وقتی مهندسان معمار فایل آماده آبجکت شما را در نقشه‌های فاز دو رویت بگذارند، محصول شما مستقیماً وارد لیست خرید پروژه (LOM/BOQ) می‌شود و کارفرما عملاً مجبور به خرید از شماست.'
        ],
        quote: 'بیم زبان مشترک مهندسی مدرن است. هر محصول بدون شناسه بیم، به مرور از بازار ساخت‌وسازهای بزرگ حذف خواهد شد.'
      }
    ],
    sectionsEn: [
      {
        heading: 'Understanding Building Information Modeling',
        paragraphs: [
          'BIM is not just 3D software like Revit or ArchiCAD; it is a revolutionary collaborative methodology. In traditional 2D drafting, every plan change required manual section updates. With BIM, you construct a centralized digital database of the building.',
          'Every component placed inside a BIM model contains real-world data beyond mere geometry. For example, a window object holds actual thermal coefficients, certified domestic manufacturing names, serial numbers, and maintenance schedules.'
        ],
        mediaPlaceholder: {
          type: 'video',
          title: '90-Second Video: Core BIM Concepts for Modern Projects',
          description: 'A visual breakdown of how data flows between structural engineers, architects, and suppliers.'
        }
      },
      {
        heading: 'Why This Matters to Designers and Suppliers',
        paragraphs: [
          'For Designers: Instant access to pre-built, dimensionally accurate manufacturer assets increases speed by up to 40% and reduces on-site interference errors to nearly zero.',
          'For Manufacturers: When an architect places your exact BIM object inside their Revit project, your product is automatically specified into the Bill of Quantities (BOQ). The owner has to source it from you.'
        ],
        quote: 'BIM is the global language of modern engineering. Products without structured BIM families will gradually be locked out of major development projects.'
      }
    ]
  },
  {
    id: 'bim-specification-purchase-decisions',
    category: 'business',
    type: 'article',
    readTimeFa: '۴ دقیقه مطالعه',
    readTimeEn: '4 min read',
    titleFa: 'چگونه ثبت در کاتالوگ BIM تصمیمات خرید کارفرمایان را هدایت می‌کند؟',
    titleEn: 'How BIM Specification Drives Procurement Decisions',
    summaryFa: 'تحلیل دقیق مسیر تصمیم‌گیری در ساخت‌وسازهای مدرن نشان می‌دهد که ۸۲٪ از مدیران خرید پروژه‌ها، مصالحی را تهیه می‌کنند که از فاز طراحی اولیه به عنوان آبجکت استاندارد بیم وارد مدل شده‌اند.',
    summaryEn: 'Analysis of modern construction procurement reveals that 82% of project purchasing managers procure materials that were integrated into the 3D model as standard BIM families during the initial design phases.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
    ctaFa: 'ثبت برند و کاتالوگ محصولات',
    ctaEn: 'Register Brand & Catalog',
    ctaTarget: 'for-manufacturers',
    sectionsFa: [
      {
        heading: 'تغییر اهرم قدرت از خرید به طراحی',
        paragraphs: [
          'در گذشته، بازاریابی مصالح ساختمانی متکی بر کاتالوگ‌های کاغذی و ویزیت حضوری مهندسان کارگاه در مراحل پایانی سفت‌کاری بود. امروزه به دلیل ضوابط بیم در پروژه‌های بزرگ کشور، تصمیم‌گیری درباره برند شیرآلات، هواساز، آسانسور و پنجره‌ها ماه‌ها قبل از گودبرداری در دفاتر طراحی اتخاذ می‌شود.',
          'وقتی مدل بیم تاییدیه شهرداری یا نظام مهندسی را می‌گیرد، تغییر برند مشخص‌شده در مدل (Specification) کار بسیار پرهزینه‌ای است، زیرا ابعاد، وزن و بار مصرفی سایر المان‌ها بر اساس آن تنظیم شده است.'
        ]
      },
      {
        heading: 'مزایای مستقیم کاتالوگ دیجیتال ایران‌بیم‌هاب',
        paragraphs: [
          'ایران‌بیم‌هاب به عنوان هاب متمرکز ملی، دسترسی بدون واسطه به این بازاریابی دیجیتال را هموار کرده است:'
        ],
        bullets: [
          'حضور مداوم در مانیتور طراحان فاز دو معمار و سازه',
          'جلوگیری از خطای ترسیم دستی ابعاد اشتباه تجهیزات شما توسط مدلرها',
          'امکان دریافت مستقیم فرم‌های استعلام قیمت از روی پروژه‌های زنده کشور',
          'آمارهای زنده از تعداد طراحانی که کاتالوگ فنی یا مدل سه‌بعدی شما را بررسی کرده‌اند'
        ],
        quote: 'موفقیت در فروش مصالح امروز یعنی در زمان ترسیم نقشه، روی سیستم طراح حضور داشته باشید.'
      }
    ],
    sectionsEn: [
      {
        heading: 'The Shift in Purchasing Power: From Site to Desktop',
        paragraphs: [
          'Traditionally, material marketing relied on printed brochures and sales visits to construction sites during finishing. Today, due to mandatory BIM guidelines on large infrastructure, brand decisions for HVAC, elevators, windows, and fixtures are locked in months before ground breaking.',
          'Once a BIM model receives design approvals, switching specified products is extremely expensive. The physical dimensions, weights, and electrical load requirements of adjacent components have already been calculated based on those specific objects.'
        ]
      },
      {
        heading: 'Direct Benefits of the IranBIMhub Catalog System',
        paragraphs: [
          'IranBIMhub provides direct digital exposure to active AEC teams:'
        ],
        bullets: [
          'Constant visibility on the screen of phase-2 architectural and structural specifiers.',
          'Eliminating dimension errors caused by draftsmen drawing your products manually from PDF sheets.',
          'Direct leads and price inquiry forms generated directly from active national building files.',
          'Real-time analytics showing how many certified engineers downloaded your digital assets.'
        ],
        quote: 'Modern sales success is simple: you must be present on the modeler’s desktop at the moment of design conception.'
      }
    ]
  },
  {
    id: 'cost-of-not-being-ready',
    category: 'business',
    type: 'article',
    readTimeFa: '۳ دقیقه مطالعه',
    readTimeEn: '3 min read',
    titleFa: 'هزینه پنهان عدم انطباق با بیم (BIM) برای صاحبان کارخانجات صنعتی',
    titleEn: 'The Cost of Not Being BIM-Ready as a Manufacturer',
    summaryFa: 'تکنولوژی منتظر هیچ برندی نمی‌ماند. بررسی زیان‌های تجاری کارخانجات غیر مجهز به پایگاه داده بیم نشان‌دهنده از دست رفتن تدریجی بازارهای دولتی و انبوه‌سازی‌های مدرن است.',
    summaryEn: 'Technology waits for no one. Examining the market loss of manufacturers who fail to provide structured BIM objects highlights gradual exclusion from government tenders and premium developments.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    ctaFa: 'عضویت رایگان در پورتال',
    ctaEn: 'Join Free as Supplier',
    ctaTarget: 'for-manufacturers',
    sectionsFa: [
      {
        heading: 'حذف خودکار از اسناد مناقصات بزرگ',
        paragraphs: [
          'در بسیاری از کلان‌شهرهای کشور و مراجع دولتی، تحویل مدل BIM سطح LOD 300 به همراه نقشه‌ها اجباری شده است. وقتی مشاور پروژه در حال تجمیع اسناد مناقصه است، محصولاتی را انتخاب می‌کند که فمیلی بیم آماده و منطبق بر استانداردهای بومی داشته باشند.',
          'کارخانه‌ای که فقط کاتالوگ PDF ارائه می‌دهد، در این فرآیند غربالگری حذف می‌شود. مهندس زمان کافی برای بازطراحی سه‌بعدی محصول شما از روی پی‌دی‌اف را ندارد، پس به سراغ رقیبی می‌رود که کاتالوگ بیم آماده را در ایران‌بیم‌هاب منتشر کرده است.'
        ]
      },
      {
        heading: 'آمار تایید شده در توسعه بازار دیجیتال',
        paragraphs: [
          'طبق ارزیابی‌های آماری مقدماتی ایران‌بیم‌هاب در بازار ساختمان تهران [stat to be confirmed]:',
          'برندهای مجهز به کاتالوگ دیجیتال رویت، به طور متوسط ۲.۴ برابر بیشتر از رقبای سنتی خود در نقشه‌های مصوب فاز دو پروژه‌های اداری و تجاری بزرگ قرار گرفته‌اند.'
        ],
        quote: 'کاتالوگ بیم، بروشور تبلیغاتی هزاره جدید است. بدون آن، برند شما برای معماران امروز نامرئی است.'
      }
    ],
    sectionsEn: [
      {
        heading: 'Automatic Exclusion from Key Tender Documents',
        paragraphs: [
          'Many metropolitan municipalities and government agencies now mandate LOD 300 BIM models with all plan submissions. When consulting engineers assemble tender packages, they pick materials with existing compliant BIM files.',
          'A manufacturer providing only a PDF catalog is filtered out immediately. Engineers do not have the time to model your equipment manually from a datasheet. They simply select a competitor whose assets are readily downloadable on IranBIMhub.'
        ]
      },
      {
        heading: 'Market Performance Data',
        paragraphs: [
          'According to preliminary IranBIMhub tracking in the Tehran construction sector [stat to be confirmed]:',
          'Brands equipped with structured Revit families are integrated up to 2.4 times more frequently into official construction plans compared to traditional-only competitors.'
        ],
        quote: 'A BIM family is the digital catalog of the new millennium. Without it, your product remains invisible to modern designers.'
      }
    ]
  },
  {
    id: 'levels-of-lod-simply',
    category: 'basics',
    type: 'article',
    readTimeFa: '۳ دقیقه مطالعه',
    readTimeEn: '3 min read',
    titleFa: 'سطوح توسعه مدل (LOD) به زبان ساده: از ایده تا اجرا',
    titleEn: 'Levels of Development (LOD) Explained Simply',
    summaryFa: 'شاخص LOD مشخص می‌کند که یک آبجکت سه‌بعدی BIM چقدر اطلاعات هندسی و غیرهندسی دقیق در خود جای داده است. تفاوت بین LOD 100 تا LOD 400 را بیاموزید.',
    summaryEn: 'The Level of Development (LOD) metric specifies how much geometric and non-geometric data is packed inside a BIM object. Learn the difference between LOD 100 and LOD 400.',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80',
    ctaFa: 'مشاهده آبجکت‌ها بر اساس LOD',
    ctaEn: 'Browse Objects by LOD',
    ctaTarget: 'categories',
    sectionsFa: [
      {
        heading: 'چرا LOD اهمیت حیاتی دارد؟',
        paragraphs: [
          'در مراحل مختلف طراحی ساختمان، مهندسان به سطوح اطلاعاتی متفاوتی نیاز دارند. در فاز توجیهی اولیه، یک حجم ساده مستطیلی برای یخچال کافی است (LOD 100). اما در فاز خرید مصالح و نقشه‌های اجرایی فاز دو، نیاز به جزییات میلی‌متری، محل قرارگیری اتصالات برقی و گارانتی رسمی است (LOD 350 یا 400).',
          'تعریف استاندارد سطوح:'
        ],
        bullets: [
          'LOD 100: طرح مفهومی اولیه - نمایش ابعاد حدودی کلی.',
          'LOD 200: هندسه تقریبی - حجم کالا با ابعاد عمومی حدودی.',
          'LOD 300: هندسه دقیق - ابعاد کاملاً واقعی، پورت‌های اتصال و کدهای استاندارد.',
          'LOD 350: هماهنگی بین رشته‌ای - شامل تداخل‌سنجی‌ها و روابط آبجکت با دیوارهای اطراف.',
          'LOD 400: آماده ساخت و نصب - شامل جزییات ساخت کارخانه‌ای قطعه.'
        ],
        quote: 'ایران‌بیم‌هاب تمام محصولات را ارزیابی فنی کرده و نشان اصالت سطح توسعه (مانند LOD 300 / 350) را برای راحتی مهندسان اعطا می‌نماید.'
      }
    ],
    sectionsEn: [
      {
        heading: 'Why LOD is Crucial for Project Phases',
        paragraphs: [
          'During various construction stages, engineers require different depths of data. In the conceptual phase, a simple box placeholder is sufficient for a chiller (LOD 100). However, during procurement and installation design, precise millimeter layouts and exact terminal inputs are mandatory (LOD 350/400).',
          'Standard LOD Classifications:'
        ],
        bullets: [
          'LOD 100: Conceptual - General layout and approximate boundary limits.',
          'LOD 200: Approximate Geometry - General item sizes and standard placement.',
          'LOD 300: Precise Geometry - True dimensions, physical connectors, and standard codes.',
          'LOD 350: Coordination - Integrates specific connection lines and wall clearances.',
          'LOD 400: Fabrication Ready - Complete shop-drawing details and production specs.'
        ],
        quote: 'IranBIMhub verifies every uploaded object, labeling them with certified LOD indicators to ensure frictionless project compatibility.'
      }
    ]
  },
  {
    id: 'state-of-bim-iran',
    category: 'market',
    type: 'article',
    readTimeFa: '۵ دقیقه مطالعه',
    readTimeEn: '5 min read',
    titleFa: 'وضعیت پذیرش و قوانین الزامی BIM در صنعت ساختمان ایران',
    titleEn: 'BIM Adoption and Regulatory Landscape in Iran',
    summaryFa: 'بررسی مصوبات قانونی اخیر شورای عالی فنی، مقررات ملی ساختمان و شهرداری کلان‌شهرها در خصوص الزام به‌کارگیری بیم در پروژه‌های بزرگ مقیاس داخلی.',
    summaryEn: 'An overview of recent regulatory actions by the Supreme Technical Council, National Building Regulations, and major municipalities regarding mandatory BIM use in large Iranian projects.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    ctaFa: 'مشاهده آبجکت‌های تولید ایران',
    ctaEn: 'Browse Domestic BIM Products',
    ctaTarget: 'categories',
    sectionsFa: [
      {
        heading: 'اسناد قانونی و نقشه‌های راه ملی',
        paragraphs: [
          'حرکت به سمت مدل‌سازی اطلاعات ساختمان در ایران دیگر یک فعالیت فانتزی و آزمایشی نیست. شورای عالی فنی کشور و سازمان برنامه و بودجه [stat to be confirmed] در دستورالعمل‌های هم‌راستای مدیریت پروژه، استفاده از BIM را به عنوان یکی از اصول مدرن‌سازی مدیریت هزینه‌های عمرانی کشور مطرح کرده‌اند.',
          'در بخش شهرداری‌های کلان‌شهرها نیز پروژه‌های با متراژ بالا ملزم به ارائه فایل‌های سه‌بعدی با قابلیت تداخل‌سنجی جهت صدور پروانه ساختمانی هستند. این به این معنی است که بازار کارفرمایی به شدت تشنه کاتالوگ‌های استاندارد داخلی است.'
        ]
      },
      {
        heading: 'جلوگیری از خروج ارز با کاتالوگ‌های بومی',
        paragraphs: [
          'پیش از راه‌اندازی ایران‌بیم‌هاب، طراحان داخلی ناچار بودند فمیلی‌های بیم برندهای خارجی (مانند زیمنس، دانفوس و غیره) را دانلود کنند که این کار موجب سوق دادن ناخواسته کارفرما به خرید کالاهای خارجی و خروج ارز می‌شد.',
          'با بومی‌سازی کاتالوگ تولیدکنندگان در ایران‌بیم‌هاب، مهندسان مستقیماً از محصولات باکیفیت ایرانی استفاده می‌کنند که علاوه بر رونق تولید ملی، هزینه‌های ارزی پروژه‌ها را به شدت کاهش می‌دهد.'
        ]
      }
    ],
    sectionsEn: [
      {
        heading: 'Legislative Policies and National Directives',
        paragraphs: [
          'Implementing BIM in Iran is no longer experimental. The Supreme Technical Council and Plan and Budget Organization [stat to be confirmed] have introduced directives highlighting BIM as a tool for public budget optimization and construction speed.',
          'In municipal permits, high-rise and high-occupancy developments are increasingly required to undergo automated clash-detection reviews. This shift means the domestic market is highly responsive to standard, pre-built localized BIM catalogs.'
        ]
      },
      {
        heading: 'Fostering Import Substitution via Domestic Hubs',
        paragraphs: [
          'Before IranBIMhub, domestic designers were forced to download European or Asian BIM product families (e.g., Siemens, Danfoss). This naturally funneled procurement managers to source imported goods.',
          'By registering Iranian manufacturers on IranBIMhub, engineering squads can source compliant domestic products. This supports local industries and optimizes project budgets.'
        ]
      }
    ]
  },
  {
    id: 'upload-first-product-guide',
    category: 'guides',
    type: 'article',
    readTimeFa: '۵ دقیقه مطالعه',
    readTimeEn: '5 min read',
    titleFa: 'راهنمای گام‌به‌گام: آپلود اولین محصول BIM در ۱۰ دقیقه',
    titleEn: 'Step-by-Step: Publish Your First BIM Object in 10 Minutes',
    summaryFa: 'یک چک‌لیست کاربردی و سریع مخصوص کارشناسان بازاریابی کارخانجات جهت ثبت و انتشار موفق فایل‌های Revit / IFC در بازار ایران‌بیم‌هاب.',
    summaryEn: 'A practical, quick-start checklist designed for brand marketing managers to register and publish Revit/IFC families on the IranBIMhub marketplace.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    ctaFa: 'ورود به پورتال سازندگان',
    ctaEn: 'Open Brand Dashboard',
    ctaTarget: 'for-manufacturers',
    sectionsFa: [
      {
        heading: 'آماده‌سازی فایل‌ها قبل از بارگذاری',
        paragraphs: [
          'برای اینکه کاتالوگ شما بیشترین بازخورد مثبت را از مهندسان رویت بگیرد، چک‌لیست زیر را برای فایل‌های فمیلی (.rfa) رعایت کنید:'
        ],
        bullets: [
          'حجم بهینه: فایل‌های بالاتر از ۱۵ مگابایت به سختی دانلود می‌شوند. سعی کنید حجم فمیلی‌ها زیر ۸ مگابایت باشد.',
          'پارامترهای اشتراکی (Shared Parameters): شامل نام تجاری کالا، تلفن کارخانه، آدرس وب‌سایت و گارانتی در ویژگی‌های مدل.',
          'عکس کاور باکیفیت: یک رندر سه‌بعدی تمیز با پس‌زمینه سفید یا خاکستری ملایم.',
          'فایل کات‌شیت PDF: الصاق بروشور کاتالوگ فنی جهت پاسخ به سوالات کارگاهی مهندسان.'
        ]
      },
      {
        heading: 'مراحل ثبت در پنل مدیریت ایران‌بیم‌هاب',
        paragraphs: [
          '۱. وارد حساب کاربری خود شوید و نقش را به «تولیدکننده» تغییر دهید.',
          '۲. دکمه «افزودن محصول جدید» را بزنید.',
          '۳. دسته‌بندی موضوعی کالا را طبق استانداردهای ساختمانی تعیین کنید.',
          '۴. فایل سه‌بعدی (مانند RFA یا IFC) را به همراه عکس محصول و کات‌شیت پیوست کنید و دکمه انتشار را بفشارید.',
          'پس از تایید کارشناسان فنی ایران‌بیم‌هاب، محصول شما در کسری از ثانیه در نتایج جستجوی طراحان سراسر کشور قرار می‌گیرد.'
        ]
      }
    ],
    sectionsEn: [
      {
        heading: 'Preparing Files Before Uploading',
        paragraphs: [
          'To ensure your BIM family gets specified frequently, maintain this checklist for your Revit (.rfa) assets:'
        ],
        bullets: [
          'Optimal File Size: Large files slow down building model compilation. Keep your Revit files under 8 MB.',
          'Shared Parameters: Embed key data including brand name, contact website, and warranty info.',
          'High-Quality Cover Image: Use a clean 3D render with a plain white or soft gray background.',
          'PDF Datasheet: Attach technical catalog sheets to address on-site installation questions.'
        ]
      },
      {
        heading: 'The 4-Step Publishing Workflow',
        paragraphs: [
          '1. Log into your profile and toggle the active role to "Manufacturer".',
          '2. Click the "Add New Product" button in your dashboard.',
          '3. Assign the correct industry category (e.g., electrical, plumbing, structural).',
          '4. Upload your files, attach the thumbnail render and PDF sheet, and click Publish.',
          'Once validated by our engineering desk, your catalog is immediately indexed for architectural searchers.'
        ]
      }
    ]
  }
];

interface LearnViewProps {
  onNavigate: (view: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onNavigate }) => {
  const { language, isRtl } = useLanguage();
  const [activeArticleId, setActiveArticleId] = useState<string | null>(() => {
    const saved = localStorage.getItem('selected_learn_article_id');
    localStorage.removeItem('selected_learn_article_id'); // consume it
    return saved || null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const activeArticle = ARTICLES.find(a => a.id === activeArticleId);

  // Filter articles based on search, category, and type
  const filteredArticles = ARTICLES.filter(art => {
    const title = language === 'fa' ? art.titleFa : art.titleEn;
    const summary = language === 'fa' ? art.summaryFa : art.summaryEn;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesType = selectedType === 'all' || art.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Find the pinned featured article
  const pinnedArticle = ARTICLES.find(a => a.isPinned);

  const categories = [
    { id: 'all', labelFa: 'همه موضوعات', labelEn: 'All Topics' },
    { id: 'basics', labelFa: 'مبانی بیم (BIM)', labelEn: 'BIM Basics' },
    { id: 'business', labelFa: 'ارزش تجاری و برند', labelEn: 'Business & Brand' },
    { id: 'market', labelFa: 'بازار ایران و ضوابط', labelEn: 'Iran Market' },
    { id: 'guides', labelFa: 'راهنمای کاربری', labelEn: 'Guides' }
  ];

  const types = [
    { id: 'all', labelFa: 'همه قالب‌ها', labelEn: 'All Formats' },
    { id: 'article', labelFa: 'مقاله‌ و چک‌لیست', labelEn: 'Articles' },
    { id: 'video', labelFa: 'ویدیو آموزشی', labelEn: 'Videos' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12" id="insights-education-hub">
      
      {/* 1. ARTICLE DETAIL VIEW */}
      {activeArticle ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Breadcrumbs / Back button */}
          <button
            onClick={() => {
              setActiveArticleId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-xs font-extrabold text-[#26B6B6] hover:text-[#1e9494] transition-colors cursor-pointer group"
          >
            {isRtl ? <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /> : <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />}
            <span>{isRtl ? 'بازگشت به مقالات' : 'Back to Insights & Education'}</span>
          </button>

          {/* Article Header */}
          <div className="space-y-4 text-start">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-black text-white bg-[#26B6B6] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {activeArticle.category === 'basics' && (isRtl ? 'مبانی بیم' : 'BIM Basics')}
                {activeArticle.category === 'business' && (isRtl ? 'ارزش تجاری' : 'Business Value')}
                {activeArticle.category === 'market' && (isRtl ? 'بازار ایران' : 'Iran Market')}
                {activeArticle.category === 'guides' && (isRtl ? 'راهنما' : 'Guides')}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-[#26B6B6]" />
                <span>{language === 'fa' ? activeArticle.readTimeFa : activeArticle.readTimeEn}</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full uppercase">
                {activeArticle.type === 'video' ? (isRtl ? 'ویدیو آموزشی' : 'Video') : (isRtl ? 'مقاله علمی' : 'Article')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 dark:text-white leading-tight">
              {language === 'fa' ? activeArticle.titleFa : activeArticle.titleEn}
            </h1>
          </div>

          {/* Thumbnail / Hero Image */}
          <div className="relative h-[240px] sm:h-[380px] w-full rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={activeArticle.imageUrl} 
              alt={language === 'fa' ? activeArticle.titleFa : activeArticle.titleEn}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            {activeArticle.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#26B6B6]/90 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer">
                  <Play className={`w-7 h-7 fill-white ${isRtl ? 'translate-x-[-2px]' : 'translate-x-[2px]'}`} />
                </div>
              </div>
            )}
          </div>

          {/* Grid: Content vs Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Right Main Column: Rich Text Content */}
            <div className="lg:col-span-2 space-y-6 text-start">
              
              {/* EXECUTIVE SUMMARY BOX (Mandatory constraint) */}
              <div className="bg-slate-50 dark:bg-gray-900 border-l-4 border-r-4 border-[#26B6B6] rounded-xl p-5 sm:p-6 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-[#26B6B6]">
                  <Lightbulb className="w-5 h-5 shrink-0" />
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    {isRtl ? 'خلاصه مدیریتی (مطالعه در ۹۰ ثانیه)' : 'Executive Summary (90-Sec Read)'}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
                  {language === 'fa' ? activeArticle.summaryFa : activeArticle.summaryEn}
                </p>
              </div>

              {/* Rich Body Sections */}
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                {(language === 'fa' ? activeArticle.sectionsFa : activeArticle.sectionsEn).map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    {section.heading && (
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        {section.heading}
                      </h3>
                    )}
                    
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                        {p}
                      </p>
                    ))}

                    {/* Bullet Points */}
                    {section.bullets && (
                      <ul className="list-disc list-inside space-y-1.5 pl-4 pr-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {section.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="font-light">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Simulated Media Player Placeholder (Mandatory constraint) */}
                    {section.mediaPlaceholder && (
                      <div className="my-6 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0">
                          {section.mediaPlaceholder.type === 'video' ? <Video className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                        </div>
                        <div className="space-y-1 text-center sm:text-start flex-1">
                          <h4 className="text-xs font-bold text-gray-800 dark:text-white">
                            {section.mediaPlaceholder.title}
                          </h4>
                          <p className="text-[10px] text-gray-400">
                            {section.mediaPlaceholder.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert(isRtl ? 'سیستم شبیه‌ساز رسانه فعال شد. ویدیو/اینفوگرافیک به زودی آپلود می‌شود.' : 'Media simulation initialized. Content will load shortly.')}
                          className="bg-white dark:bg-gray-800 hover:bg-[#26B6B6]/10 hover:text-[#26B6B6] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-bold text-[10px] px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                        >
                          {section.mediaPlaceholder.type === 'video' ? (isRtl ? 'پخش ویدیو' : 'Play Clip') : (isRtl ? 'دیدن نمودار' : 'View Graph')}
                        </button>
                      </div>
                    )}

                    {/* Pull Quotes */}
                    {section.quote && (
                      <div className="my-6 border-l-4 border-[#26B6B6] dark:border-[#26B6B6] pl-4 pr-4 italic text-xs sm:text-sm text-[#1e9494] font-medium bg-gradient-to-r from-[#26B6B6]/5 to-transparent py-3 rounded-r-xl">
                        "{section.quote}"
                      </div>
                    )}

                  </div>
                ))}
              </div>

              {/* ACTION CALL-TO-ACTION (CTA) SECTION */}
              <div className="mt-12 bg-gray-50 dark:bg-gray-900/40 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="space-y-1 text-center sm:text-start">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {isRtl ? 'مرحله بعدی در توسعه پروژه شما چیست؟' : 'What is your next step in digital workflows?'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {isRtl 
                      ? 'تصمیم بگیرید، ثبت‌نام کنید و همین امروز کاتالوگ خود را وارد چرخه مدرن ساختمان کنید.' 
                      : 'Create your digital profile or search our extensive AEC marketplace today.'
                    }
                  </p>
                </div>
                <button
                  onClick={() => {
                    onNavigate(activeArticle.ctaTarget);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-6 py-3 rounded-xl text-xs font-black shadow-sm transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                >
                  {language === 'fa' ? activeArticle.ctaFa : activeArticle.ctaEn}
                </button>
              </div>

            </div>

            {/* Right Sidebar: Recommended content & Share */}
            <div className="space-y-6 text-start">
              
              {/* Share Box */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl p-5 space-y-3 shadow-2xs">
                <h4 className="text-xs font-bold text-gray-800 dark:text-white">
                  {isRtl ? 'اشتراک‌گذاری با همکاران' : 'Share with Colleagues'}
                </h4>
                <p className="text-[10px] text-gray-400 leading-normal">
                  {isRtl ? 'لینک این راهنمای ارزشمند را برای کارشناسان، مدیران بازاریابی یا اعضای تیم طراحی بفرستید.' : 'Send this executive guide directly to your procurement or engineering department.'}
                </p>
                
                {/* Active Share Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(isRtl ? activeArticle.titleFa : activeArticle.titleEn)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-50 dark:bg-sky-950/20 hover:bg-sky-100 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-[10px] font-bold py-2.5 px-3 rounded-xl border border-sky-100 dark:border-sky-950/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {TelegramIcon('w-3.5 h-3.5')}
                    <span>{isRtl ? 'تلگرام' : 'Telegram'}</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent((isRtl ? activeArticle.titleFa : activeArticle.titleEn) + ' - ' + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold py-2.5 px-3 rounded-xl border border-emerald-100 dark:border-emerald-950/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {WhatsAppIcon('w-3.5 h-3.5')}
                    <span>{isRtl ? 'واتساپ' : 'WhatsApp'}</span>
                  </a>
                </div>

                <div className="space-y-2">
                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold py-2 px-3 rounded-xl border border-blue-100 dark:border-blue-950/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {LinkedInIcon('w-3.5 h-3.5')}
                    <span>{isRtl ? 'اشتراک در لینکدین' : 'Share on LinkedIn'}</span>
                  </a>

                  {/* Copy Link Button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert(isRtl ? 'لینک مقاله با موفقیت در کلیپ‌بورد کپی شد.' : 'Article link copied to clipboard!');
                    }}
                    className="w-full bg-slate-50 dark:bg-gray-800 hover:bg-[#26B6B6]/5 hover:text-[#26B6B6] text-gray-600 dark:text-gray-300 text-[10px] font-bold py-2 px-3 rounded-xl border border-gray-200/50 dark:border-gray-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'کپی کردن لینک کوتاه' : 'Copy Short Link'}</span>
                  </button>
                </div>
              </div>

              {/* Sidebar list: Other interesting articles */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl p-5 space-y-4 shadow-2xs">
                <h4 className="text-xs font-bold text-gray-800 dark:text-white pb-2 border-b border-gray-50 dark:border-gray-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#26B6B6]" />
                  <span>{isRtl ? 'سایر مقالات برگزیده' : 'Other Pinned Guides'}</span>
                </h4>
                
                <div className="space-y-3">
                  {ARTICLES.filter(a => a.id !== activeArticle.id).slice(0, 3).map(other => (
                    <button
                      key={other.id}
                      onClick={() => {
                        setActiveArticleId(other.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-start group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex gap-2.5 items-start cursor-pointer"
                    >
                      <img 
                        src={other.imageUrl} 
                        alt={isRtl ? other.titleFa : other.titleEn}
                        className="w-12 h-12 object-cover rounded-md shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#26B6B6] transition-colors line-clamp-2">
                          {isRtl ? other.titleFa : other.titleEn}
                        </h5>
                        <span className="text-[9px] text-gray-400 block font-mono">
                          {language === 'fa' ? other.readTimeFa : other.readTimeEn}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical disclaimer */}
              <div className="p-4 bg-[#26B6B6]/5 rounded-2xl border border-[#26B6B6]/15 space-y-1.5">
                <span className="text-[9px] font-black uppercase text-[#26B6B6] tracking-wider block">
                  {isRtl ? 'سند معتبر ایران‌بیم‌هاب' : 'IranBIMhub Publication'}
                </span>
                <p className="text-[10px] text-gray-400 leading-normal">
                  {isRtl 
                    ? 'تمامی اطلاعات آموزشی و راهنماها طبق آیین‌نامه‌ها و با همکاری مستقیم اساتید مدلسازی رویت استخراج و تایید فنی شده است.' 
                    : 'All education materials are peer-reviewed by licensed BIM coordinators and domestic specifiers.'
                  }
                </p>
              </div>

            </div>

          </div>

        </div>
      ) : (
        // 2. MAIN HUB LIST GRID VIEW
        <div className="space-y-10 animate-fadeIn">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#26B6B6]/10 rounded-full text-xs font-semibold text-[#26B6B6]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'دانشنامه جامع و مقالات صنعت ساختمان' : 'The Definitive BIM Resource Library'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              {isRtl ? 'پایگاه مقالات و راهنماها' : 'IranBIMhub Insights & Learn Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {isRtl 
                ? 'مجموعه‌ای غنی از راهنماهای کاربردی و مقالات مدیریتی با کلامی صریح و خلاصه مدیریتی جهت افزایش سرعت کار طراحان و رونق سهم بازار تولیدکنندگان ایرانی.' 
                : 'Scannable guidance, 90-second video modules, and market data designed for AEC executives and busy professionals alike.'
              }
            </p>
          </div>

          {/* Search and Filters Strip */}
          <div className="bg-slate-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-stretch">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#26B6B6] shrink-0" />
              <input 
                type="text"
                placeholder={isRtl ? 'جستجو در مقالات و راهنماها...' : 'Search articles and videos...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-transparent border-none focus:outline-none placeholder-gray-400 font-medium dark:text-white"
              />
            </div>

            {/* Formats filter */}
            <div className="flex flex-wrap items-center gap-2">
              {types.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedType === t.id 
                      ? 'bg-[#26B6B6] border-transparent text-white shadow-xs' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#26B6B6]/30'
                  }`}
                >
                  {isRtl ? t.labelFa : t.labelEn}
                </button>
              ))}
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-gray-100 dark:border-gray-800 scrollbar-none" dir={isRtl ? 'rtl' : 'ltr'}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-extrabold px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id 
                    ? 'text-[#26B6B6] bg-[#26B6B6]/10 border-b-2 border-[#26B6B6]' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#26B6B6]'
                }`}
              >
                {isRtl ? cat.labelFa : cat.labelEn}
              </button>
            ))}
          </div>

          {/* PINNED / FEATURED ARTICLE AT TOP (Constraint) */}
          {pinnedArticle && selectedCategory === 'all' && searchQuery === '' && (
            <div className="bg-white dark:bg-gray-900 border border-[#26B6B6]/25 rounded-3xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 text-start">
              
              <div className="relative h-[200px] sm:h-full min-h-[220px] rounded-2xl overflow-hidden">
                <img 
                  src={pinnedArticle.imageUrl} 
                  alt={isRtl ? pinnedArticle.titleFa : pinnedArticle.titleEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div>
                <span className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-white" />
                  <span>{isRtl ? 'مطلب ویژه سنجش' : 'Featured Content'}</span>
                </span>
                {pinnedArticle.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#26B6B6]/90 text-white rounded-full flex items-center justify-center shadow-md">
                      <Play className="w-5 h-5 fill-white translate-x-[1px]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between py-2 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-[#26B6B6] bg-[#26B6B6]/10 px-2 py-0.5 rounded uppercase">
                      {isRtl ? 'مبانی پایه' : 'BIM Basics'}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                      <Clock className="w-3 h-3 text-[#26B6B6]" />
                      <span>{language === 'fa' ? pinnedArticle.readTimeFa : pinnedArticle.readTimeEn}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-gray-950 dark:text-white leading-tight">
                    {isRtl ? pinnedArticle.titleFa : pinnedArticle.titleEn}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-3">
                    {isRtl ? pinnedArticle.summaryFa : pinnedArticle.summaryEn}
                  </p>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => {
                      setActiveArticleId(pinnedArticle.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRtl ? 'شروع مطالعه و پخش فیلم' : 'Learn & Watch Video'}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Core Articles Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest text-start">
              {isRtl ? 'مجموعه مقالات و راهنماها' : 'Insights Resource Feed'}
            </h3>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(art => {
                  const title = language === 'fa' ? art.titleFa : art.titleEn;
                  const summary = language === 'fa' ? art.summaryFa : art.summaryEn;
                  return (
                    <div 
                      key={art.id}
                      onClick={() => {
                        setActiveArticleId(art.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between text-start group h-full"
                    >
                      <div>
                        {/* Card Image */}
                        <div className="relative h-[160px] overflow-hidden bg-gray-100">
                          <img 
                            src={art.imageUrl} 
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          {art.type === 'video' && (
                            <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[#26B6B6] text-white rounded-full flex items-center justify-center shadow">
                              <Play className="w-3 h-3 fill-white translate-x-[0.5px]" />
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-[#26B6B6] bg-[#26B6B6]/5 px-2 py-0.5 rounded">
                              {art.category === 'basics' && (isRtl ? 'مبانی بیم' : 'BIM Basics')}
                              {art.category === 'business' && (isRtl ? 'ارزش تجاری' : 'Business Value')}
                              {art.category === 'market' && (isRtl ? 'بازار ایران' : 'Iran Market')}
                              {art.category === 'guides' && (isRtl ? 'راهنما' : 'Guides')}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 font-mono flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-[#26B6B6]" />
                              <span>{language === 'fa' ? art.readTimeFa : art.readTimeEn}</span>
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-black text-gray-850 dark:text-white group-hover:text-[#26B6B6] transition-colors leading-snug line-clamp-2">
                            {title}
                          </h4>

                          <p className="text-[11px] text-gray-400 leading-normal line-clamp-3 font-light">
                            {summary}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-4 pt-0 border-t border-gray-50 dark:border-gray-800/60 mt-2 flex justify-between items-center text-[10px] font-bold text-[#26B6B6]">
                        <span>{isRtl ? 'مطالعه مقاله ←' : 'Read Article →'}</span>
                        <span className="text-gray-400 dark:text-gray-500 font-bold">
                          {art.type === 'video' ? (isRtl ? 'ویدیو' : 'VIDEO') : (isRtl ? 'مقاله' : 'ARTICLE')}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-12 text-center rounded-2xl">
                <p className="text-xs text-gray-400 font-medium">
                  {isRtl 
                    ? 'هیچ مقاله یا راهنمایی منطبق با کلمات جستجو شده یافت نشد.' 
                    : 'No educational guides match your specific filter queries.'
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedType('all');
                  }}
                  className="mt-3 text-xs text-[#26B6B6] hover:underline font-bold"
                >
                  {isRtl ? 'پاک کردن کل فیلترها' : 'Clear All Filters'}
                </button>
              </div>
            )}
          </div>

          {/* Business Pitch Call to action card */}
          <div className="bg-gradient-to-br from-[#464E56] to-[#1E2326] text-white p-8 rounded-3xl text-center space-y-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#26B6B6]/5 rounded-full blur-2xl"></div>
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="text-[10px] font-black text-[#26B6B6] bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">
                {isRtl ? 'پلتفرم تایید کاتالوگ‌های بومی' : 'Verified Building Objects Hub'}
              </span>
              <h2 className="text-lg sm:text-2xl font-black">
                {isRtl ? 'آیا کاتالوگ محصولات کارخانه خود را برای طراحان آماده کرده‌اید؟' : 'Are you a brand manager seeking structural specifications?'}
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                {isRtl 
                  ? 'برندهای طراز اول صنعت با ارائه آبجکت‌های BIM استاندارد خود در ایران‌بیم‌هاب، سهم بازارهای سنتی خود را تا ۲ برابر ارتقا داده‌اند. همین امروز بدون هزینه ثبت‌نام کنید.' 
                  : 'Join premium manufacturing giants listing their Revit files today. Empower draftsmen to write your catalog codes into active blueprints.'
                }
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    onNavigate('for-manufacturers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white px-6 py-2.5 rounded-xl text-xs font-black shadow transition-all hover:scale-105 cursor-pointer"
                >
                  {isRtl ? 'ثبت کاتالوگ به عنوان تولیدکننده' : 'Register Brand Catalog'}
                </button>
                <button
                  onClick={() => {
                    onNavigate('categories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  {isRtl ? 'جستجو در آرشیو آبجکت‌ها' : 'Search Building Files'}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
