import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Manufacturer, BIMObject } from '../../types';
import { BIM_OBJECTS } from '../../data';
import { 
  TelegramIcon, 
  AparatIcon, 
  LinkedInIcon, 
  InstagramIcon, 
  WhatsAppIcon, 
  YouTubeIcon, 
  XIcon 
} from '../SocialLinks';
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Download, 
  ExternalLink, 
  MessageSquare, 
  Share2,
  Play,
  Heart,
  Video,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  Award,
  Building2,
  Search
} from 'lucide-react';
import { BIMObjectCard } from '../BIMObjectCard';
import { parseVideoEmbedUrl } from '../../lib/videoUtils';

interface BrandPageViewProps {
  manufacturer: Manufacturer;
  onBack: () => void;
  onSelectObject: (obj: BIMObject) => void;
  onToggleSave: (id: string) => void;
  savedObjects: string[];
  onQuickDownload: (obj: BIMObject, format: string) => void;
}

// Rich mock data for each manufacturer to support premium branding, collections, clips, and bookshelf catalogs
const BRAND_EXTENSIONS: Record<string, {
  sloganFa: string;
  sloganEn: string;
  subTitleFa: string;
  subTitleEn: string;
  bannerUrl: string;
  longDescriptionFa: string;
  longDescriptionEn: string;
  socials: {
    instagram?: string;
    linkedin?: string;
    telegram?: string;
    youtube?: string;
    pinterest?: string;
    twitter?: string;
  };
  collections: {
    id: string;
    titleFa: string;
    titleEn: string;
    imageUrl: string;
  }[];
  clips: {
    id: string;
    titleFa: string;
    titleEn: string;
    videoUrl: string; // fallback if any, or custom styled player
    thumbnailUrl: string;
    duration: string;
    aparatId: string;
  }[];
  bookshelf: {
    id: string;
    title: string;
    fileSize: string;
    coverUrl: string;
  }[];
}> = {
  'initial-library': {
    sloganFa: 'ساخت کتابخانهٔ دادهٔ محصول برای جریان طراحی',
    sloganEn: 'Building a Product-Data Library for Design Workflows',
    subTitleFa: 'محصولات و اطلاعات فنی منتخب در حال تکمیل',
    subTitleEn: 'Selected products and technical information are being completed',
    bannerUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80',
    longDescriptionFa: 'کتابخانهٔ اولیهٔ ایران‌بیم‌هاب برای نمایش ساختار اطلاعات محصول، دسته‌بندی و تجربهٔ جست‌وجو در حال توسعه است. هر محصول پس از تکمیل منبع، اطلاعات فنی و وضعیت انتشار، به‌صورت مستقل معرفی خواهد شد.',
    longDescriptionEn: 'The IranBIMhub initial library is being developed to present product-information structures, categories, and the search experience. Each product will be introduced independently after its source, technical information, and publication status are complete.',
    socials: {}, collections: [], clips: [], bookshelf: []
  },
  m1: {
    sloganFa: 'نوآوری در سیستم‌های درب، پنجره و کرتین‌وال آلومینیومی',
    sloganEn: 'Innovation in Aluminum Window, Door & Curtain Wall Systems',
    subTitleFa: '۴۰ سال پیشتازی در مهندسی نما و پنجره ساختمان',
    subTitleEn: '40 Years of Pioneering in Building Facades & Window Engineering',
    bannerUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    longDescriptionFa: 'شرکت آلوپن از سال ۱۳۵۳ با هدف تولید پروفیل‌های آلومینیومی اختصاصی ساختمانی تاسیس گردید. امروز ما با بهره‌گیری از تکنولوژی‌های روز اروپا، مدرن‌ترین سیستم‌های در و پنجره دوجداره ترمال‌بریک و کرتین‌وال را در کشور طراحی و تولید می‌کنیم. مدل‌های هوشمند BIM ما با دقت بسیار بالایی برای طراحان توسعه داده شده‌اند.',
    longDescriptionEn: 'Alupan Co. was established in 1974 with the aim of producing proprietary structural aluminum profiles. Today, utilizing European advanced technologies, we design and manufacture the most modern thermal-break double-glazed window/door systems and curtain walls in the country. Our smart BIM families are highly detailed for professional architects.',
    socials: {
      instagram: 'https://instagram.com/alupan',
      linkedin: 'https://linkedin.com/company/alupan',
      pinterest: 'https://pinterest.com/alupan',
      youtube: 'https://youtube.com/alupan'
    },
    collections: [
      { id: 'c1_1', titleFa: 'سیستم‌های پنجره ترمال‌بریک', titleEn: 'Thermal-Break Systems', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
      { id: 'c1_2', titleFa: 'نماهای شیشه‌ای کرتین‌وال', titleEn: 'Curtain Wall Facades', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80' },
      { id: 'c1_3', titleFa: 'پنجره‌های کشویی فوق‌باریک', titleEn: 'Slimline Sliding Windows', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80' }
    ],
    clips: [
      { id: 'clip1_1', titleFa: 'تیزر معرفی پنجره کشویی ترمال‌بریک سری الیت آلوپن', titleEn: 'Introduction to Alupan Elite Slim Thermal-Break Sliding Windows', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', duration: '2:15', aparatId: 'a1' },
      { id: 'clip1_2', titleFa: 'تست مقاومت باد و نفوذ آب سیستم‌های کرتین‌وال آلوپن', titleEn: 'Wind Resistance & Water Infiltration Test of Alupan Curtain Walls', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', duration: '4:32', aparatId: 'a2' }
    ],
    bookshelf: [
      { id: 'b1_1', title: 'Alupan_Thermal_Break_Windows_Catalog_2025.pdf', fileSize: '8.4 MB', coverUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=300&q=80' },
      { id: 'b1_2', title: 'Curtain_Wall_Structural_Details_Design_Guide.pdf', fileSize: '14.2 MB', coverUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  m2: {
    sloganFa: 'گروه صنعتی بوتان، انتخابی مطمئن برای گرمایش نسل‌ها',
    sloganEn: 'Butane Group, A Reliable Choice for Generations of Warmth',
    subTitleFa: 'بزرگترین تولیدکننده پکیج و رادیاتور در خاورمیانه',
    subTitleEn: 'The Largest Heating Boiler & Radiator Manufacturer in the ME',
    bannerUrl: 'https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=1400&q=80',
    longDescriptionFa: 'گروه صنعتی بوتان در سال ۱۳۳۲ تأسیس گردید و با بیش از ۷ دهه تجربه، پیشگام صنعت گرمایشی ایران است. پکیج‌های دیواری هوشمند و رادیاتورهای پره‌ای آلومینیومی ما به دست بهترین مهندسین این مرز و بوم طراحی شده و اکنون فایل‌های مدل‌سازی پارامتریک رویت آن‌ها با رعایت کامل کدهای محاسباتی در اختیار جامعه مهندسی کشور قرار دارد.',
    longDescriptionEn: 'Butane Industrial Group was founded in 1953 and stands as a 70-year pioneer in Iran heating industry. Our smart wall boilers and aluminum radiators are engineered by domestic talents, and their parametric Revit families are fully detailed to respect local codes and load calculations.',
    socials: {
      instagram: 'https://instagram.com/butane',
      linkedin: 'https://linkedin.com/company/butane',
      telegram: 'https://t.me/butane'
    },
    collections: [
      { id: 'c2_1', titleFa: 'پکیج‌های دیواری هوشمند چگالشی', titleEn: 'Smart Condensing Boilers', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80' },
      { id: 'c2_2', titleFa: 'رادیاتورهای آلومینیومی پره‌ای دکوراتیو', titleEn: 'Decorative Aluminum Radiators', imageUrl: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=400&q=80' }
    ],
    clips: [
      { id: 'clip2_1', titleFa: 'فیلم راهنمای جانمایی و اتصال لوله‌های پکیج بوتان در رویت', titleEn: 'Revit Placement and Pipe Connection Guide for Butane Boilers', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80', duration: '5:40', aparatId: 'b1' },
      { id: 'clip2_2', titleFa: 'تیزر تکنولوژی رادیاتورهای دکوراتیو نسل جدید پرلاپرو', titleEn: 'New Generation PerlaPro Decorative Radiators Commercial', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', duration: '1:50', aparatId: 'b2' }
    ],
    bookshelf: [
      { id: 'b2_1', title: 'Butane_Smart_Boilers_Technical_Datasheet_2026.pdf', fileSize: '6.1 MB', coverUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  m3: {
    sloganFa: 'شفافیت و پایداری در معماری مدرن با شیشه کاوه',
    sloganEn: 'Transparency & Sustainability in Architecture with Kaveh Glass',
    subTitleFa: 'پیشرفته‌ترین خط تولید شیشه‌های هوشمند کم‌گسیل و دوجداره',
    subTitleEn: 'Advanced Production of Smart Low-E & Laminated Glazing',
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    longDescriptionFa: 'گروه صنعتی شیشه کاوه بزرگترین تولیدکننده تخصصی شیشه در منطقه است. ما شیشه‌های پیشرفته لمینت ضدسرقت، شیشه‌های ایمنی سکوریت و شیشه‌های هوشمند کنترل‌کننده انرژی (Low-E) را تولید می‌کنیم که مستقیماً در کاهش مصرف انرژی ساختمان‌های سبز نقش حیاتی دارند.',
    longDescriptionEn: 'Kaveh Glass Industrial Group is the largest specialized glass manufacturer in the region. We produce advanced burglar-proof laminated glass, tempered safety glass, and energy-controlling smart Low-E glass that plays a critical role in reducing energy consumption in green buildings.',
    socials: {
      instagram: 'https://instagram.com/kavehglass',
      linkedin: 'https://linkedin.com/company/kavehglass'
    },
    collections: [
      { id: 'c3_1', titleFa: 'شیشه‌های کنترل‌کننده انرژی Low-E', titleEn: 'Smart Low-E Energy Glass', imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80' },
      { id: 'c3_2', titleFa: 'شیشه‌های لمینت ایمنی و آکوستیک', titleEn: 'Acoustic & Laminated Safety Glass', imageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=400&q=80' }
    ],
    clips: [
      { id: 'clip3_1', titleFa: 'شبیه سازی راندمان حرارتی شیشه دوجداره Low-E کاوه', titleEn: 'Thermal Performance Simulation of Kaveh Low-E Double Glazing', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', duration: '3:05', aparatId: 'g1' }
    ],
    bookshelf: [
      { id: 'b3_1', title: 'Kaveh_Glass_Acoustic_Performance_Chart.pdf', fileSize: '4.5 MB', coverUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  m4: {
    sloganFa: 'وین‌تک، پنجره‌ای رو به آرامش و بهینه‌سازی فردا',
    sloganEn: 'WinTech, A Window to Comfort & Efficiency of Tomorrow',
    subTitleFa: 'تولیدکننده تراز اول پروفیل‌های مدرن درب و پنجره UPVC',
    subTitleEn: 'Top-tier Manufacturer of Modern UPVC Window & Door Profiles',
    bannerUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
    longDescriptionFa: 'گروه صنعتی وین‌تک با استقرار خطوط تولید اتوماتیک مدرن در ایران، باکیفیت‌ترین پروفیل‌های در و پنجره دوجداره UPVC را ارائه می‌دهد. محصولات ما کاملاً در برابر نفوذ صدا، گرد و خاک و اتلاف حرارتی عایق هستند. کتابخانه فایل‌های رویت ما منطبق بر استانداردهای جهانی BIM به طراحان در برآورد دقیق متره کمک می‌کند.',
    longDescriptionEn: 'WinTech Industrial Group, with automated state-of-the-art factories in Iran, provides the highest quality double-glazed UPVC door and window profiles. Our profiles are completely insulated against noise, dust, and thermal leakage. Our Revit database helps modelers generate precise bills of quantities (BoQ).',
    socials: {
      instagram: 'https://instagram.com/wintech',
      linkedin: 'https://linkedin.com/company/wintech',
      telegram: 'https://t.me/wintech_fa'
    },
    collections: [
      { id: 'c4_1', titleFa: 'پروفیل‌های ۵ کاناله سری W700', titleEn: 'W700 Series 5-Chamber Profiles', imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=400&q=80' },
      { id: 'c4_2', titleFa: 'سیستم‌های توری پلیسه و کشویی ریلی', titleEn: 'Sliding & Pleated Screen Systems', imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80' }
    ],
    clips: [
      { id: 'clip4_1', titleFa: 'تست‌های دوام و ضربه پروفیل وین‌تک در شرایط آب و هوایی سخت', titleEn: 'Durability and Impact Tests of WinTech Profiles in Hard Climate', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', duration: '3:50', aparatId: 'w1' }
    ],
    bookshelf: [
      { id: 'b4_1', title: 'WinTech_UPVC_Profiles_Technical_Detail_Book_2025.pdf', fileSize: '18.7 MB', coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  m5: {
    sloganFa: 'بهسرام، جلوه لوکس پرسلان در ابعاد بزرگ برای فضاهای خاص',
    sloganEn: 'Behceram, The Luxury Glance of Porcelain for Unique Spaces',
    subTitleFa: 'اولین تولیدکننده اسلب‌های پرسلانی سوپر پولیش ساخت ایران',
    subTitleEn: 'First Manufacturer of Super-Polished Porcelain Slabs in Iran',
    bannerUrl: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1400&q=80',
    longDescriptionFa: 'صنایع کاشی و سرامیک پرسلانی بهسرام با بهره‌گیری از تجهیزات پیشرفته ساخت ایتالیا، تولیدکننده برتر اسلب‌های لوکس با طرح‌های طبیعی سنگ مرمر و تراورتن است. اسلب‌های ما با جذب آب نزدیک به صفر، برای نماهای خشک ساختمانی، کف لابی‌های مجلل و کانترهای کابینت آشپزخانه کاربرد دارند.',
    longDescriptionEn: 'Behceram Porcelain Slabs and Tiles Co. utilizes state-of-the-art Italian machinery to produce premium-grade luxury slabs resembling natural marbles and travertines. With zero water absorption, our slabs are ideal for ventilated facades, lobby floorings, and modern countertops.',
    socials: {
      instagram: 'https://instagram.com/behceram',
      linkedin: 'https://linkedin.com/company/behceram',
      pinterest: 'https://pinterest.com/behceram'
    },
    collections: [
      { id: 'c5_1', titleFa: 'اسلب‌های پرسلانی طرح مرمر کلکته', titleEn: 'Calacatta Marble Slabs', imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=400&q=80' },
      { id: 'c5_2', titleFa: 'کاشی‌های پرسلانی دکوراتیو مات زبر', titleEn: 'Matte Textured Exterior Slabs', imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80' }
    ],
    clips: [
      { id: 'clip5_1', titleFa: 'تیزر فرآیند پخت و خط پولیش مجهز بهسرام در اصفهان', titleEn: 'Behceram Modern Slabs Production & Polishing Line in Isfahan', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', duration: '2:40', aparatId: 'bc1' }
    ],
    bookshelf: [
      { id: 'b5_1', title: 'Behceram_Porcelain_Slabs_Architectural_Collection.pdf', fileSize: '11.5 MB', coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  m6: {
    sloganFa: 'مازی‌نور، پیشرو در مهندسی روشنایی و طراحی معماری نور',
    sloganEn: 'Mazinoor, Pioneer in Lighting Engineering & Architectural Lighting',
    subTitleFa: 'مدرن‌ترین چراغ‌های اداری، تجاری و صنعتی ساخت ایران',
    subTitleEn: 'Advanced Commercial, Office & Industrial Luminaires',
    bannerUrl: 'https://images.unsplash.com/photo-1565538810844-16ba89417953?auto=format&fit=crop&w=1400&q=80',
    longDescriptionFa: 'صنایع روشنایی مازی‌نور به عنوان پیشتاز طراحی چراغ‌های مدرن در کشور، مجهزترین آزمایشگاه‌های فوتومتری و تست‌های عایق آب و گرد و خاک (IP) را داراست. چراغ‌های اداری خطی توکار و روکار ما با بازده فوق‌العاده بالا و فاقد چشمک‌زن (Flicker-Free) برای پروژه‌های کلاس A ایران مدل‌سازی شده‌اند.',
    longDescriptionEn: 'Mazinoor Lighting Industries is the pioneer of modern luminaire design in Iran, equipped with the most advanced photometric and IP laboratories. Our architectural linear recessed/surface LED fixtures are flicker-free and offer exceptional efficacy for Class A domestic projects.',
    socials: {
      instagram: 'https://instagram.com/mazinoor',
      linkedin: 'https://linkedin.com/company/mazinoor',
      youtube: 'https://youtube.com/mazinoor'
    },
    collections: [
      { id: 'c6_1', titleFa: 'چراغ‌های خطی توکار و روکار سری لدی‌لوکس', titleEn: 'Ledilux High-End Linear Luminaires', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80' },
      { id: 'c6_2', titleFa: 'نورافکن‌ها و پروژکتورهای صنعتی ضدآب IP66', titleEn: 'Heavy Industrial IP66 Floodlights', imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80' }
    ],
    clips: [
      { id: 'clip6_1', titleFa: 'فیلم تست آزمایشگاهی گونیوفوتومتر چراغ‌های خطی مازی‌نور', titleEn: 'Photometric Goniophotometer Test of Mazinoor Linear Lights', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', duration: '4:12', aparatId: 'm1_1' }
    ],
    bookshelf: [
      { id: 'b6_1', title: 'Mazinoor_Interior_Architectural_Lighting_Catalog.pdf', fileSize: '9.8 MB', coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80' }
    ]
  }
};

export const BrandPageView: React.FC<BrandPageViewProps> = ({
  manufacturer,
  onBack,
  onSelectObject,
  onToggleSave,
  savedObjects,
  onQuickDownload
}) => {
  const { language, t, isRtl } = useLanguage();
  const [isFollowing, setIsFollowing] = useState(() => {
    try {
      const savedFollows = JSON.parse(localStorage.getItem('iranbimhub_followed_brands') || '[]');
      return savedFollows.includes(manufacturer.id);
    } catch {
      return false;
    }
  });

  const [followersCount, setFollowersCount] = useState(() => {
    // Semi-random deterministic follower count based on stats view count
    const base = manufacturer.stats ? Math.floor(manufacturer.stats.views / 15) : 0;
    return isFollowing ? base + 1 : base;
  });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'Architect',
    subject: '',
    productOfInterest: 'general',
    estimatedQuantity: '',
    message: '',
    receiveNews: true
  });

  const [showObjectRequestModal, setShowObjectRequestModal] = useState(false);
  const [objectRequestSubmitted, setObjectRequestSubmitted] = useState(false);
  const [objectRequestForm, setObjectRequestForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    objectName: '',
    category: 'doors_windows',
    format: 'Revit',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    description: ''
  });

  const ext = BRAND_EXTENSIONS[manufacturer.id] || BRAND_EXTENSIONS['initial-library'];

  const [savedProfile, setSavedProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(`iranbimhub_mfg_profile_${manufacturer.id}`) ||
        (manufacturer.id === 'm1' ? localStorage.getItem('iranbimhub_mfg_profile') : null);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [brandStandards, setBrandStandards] = useState(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_mfg_standards');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    if (manufacturer.isSample) return [];
    return [
      { id: 'std-1', name: 'ISO 9001 (Quality Management)', code: 'ISO-9001', country: 'SGS Germany', verified: true, description: 'استاندارد جهانی مدیریت سیستم‌های کیفیت و ارزیابی فرایندها.' },
      { id: 'std-2', name: 'CE Mark (European Conformity)', code: 'CE-AEC', country: 'TUV Nord', verified: true, description: 'نشان انطباق محصول با استانداردهای بهداشت، ایمنی و حفاظت محیط زیست اروپا.' },
      { id: 'std-3', name: 'نشان استاندارد ملی ایران (INSO)', code: 'INSO-7090', country: 'ISIRI', verified: true, description: 'نشان استاندارد ملی اجباری برای در و پنجره‌های آلومینیومی ساختمان.' }
    ];
  });

  const [brandAwards, setBrandAwards] = useState(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_mfg_awards');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { 
        id: 'p-1', 
        titleFa: 'رتبه نخست مسابقه ملی طراحی و نمای آلومینیوم ایران', 
        titleEn: '1st Place in Iranian Aluminum Facade Design Award', 
        architect: 'دفتر معماری دلیری / همکاران', 
        location: 'تهران، الهیه', 
        year: '۱۴۰۳',
        description: 'کسب عنوان برترین نماساز با محصول سری آلو-۹۰ در مسابقات سالانه.'
      },
      { 
        id: 'p-2', 
        titleFa: 'تندیس زرین برند محبوب سال در صنعت در و پنجره', 
        titleEn: 'Golden Statue of Popular Brand of the Year', 
        architect: 'صنایع ساختمانی ایران', 
        location: 'تهران، مرکز همایش‌ها', 
        year: '۱۴۰۴',
        description: 'انتخاب مردمی و مهندسی برند برتر تولیدکننده پروفیل اختصاصی.'
      }
    ];
  });

  const [brandProjects, setBrandProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_mfg_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { 
        id: 'proj-1', 
        titleFa: 'مجتمع تجاری اداری روشا تهران', 
        titleEn: 'Rosha Department Store Tehran', 
        architect: 'مهندس محمدرضا نیکبخت', 
        location: 'تهران، نیاوران', 
        year: '۱۴۰۲',
        description: 'اجرای نمای شیشه‌ای و کرتین‌وال آلومینیومی با مقاطع اختصاصی آلوپن.',
        fileName: 'Rosha_Project_Brief.pdf',
        fileUrl: '#'
      },
      { 
        id: 'proj-2', 
        titleFa: 'برج آرمیتاژ گلشن مشهد', 
        titleEn: 'Armitage Golshan Tower Mashhad', 
        architect: 'دفتر فنی آرمیتاژ', 
        location: 'مشهد، هفت تیر', 
        year: '۱۴۰۳',
        description: 'پوشش کامل پنجره‌های ترمال‌بریک کشویی و لولایی با ضریب عایق بسیار بالا.',
        fileName: 'Armitage_Tower_Specs.pdf',
        fileUrl: '#'
      }
    ];
  });

  const [brandCatalogs, setBrandCatalogs] = useState(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_mfg_catalogs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'cat-1',
        titleFa: 'دفترچه راهنمای فنی و جزئیات اجرایی پروفیل‌های آلوپن',
        titleEn: 'Alupan Technical Handbook & Execution Details',
        category: 'راهنمای فنی / Technical Handbook',
        fileSize: '14.8 MB',
        description: 'کاتالوگ جامع مقاطع پروفیل‌های ترمال‌بریک، جزئیات آب‌بندی، هواپذیری و ضرایب انتقال حرارت U-Value.',
        fileName: 'Alupan_Technical_Handbook_2026.pdf',
        fileUrl: '#'
      },
      {
        id: 'cat-2',
        titleFa: 'کاتالوگ جامع سیستم‌های در و پنجره دوجداره آلومینیومی',
        titleEn: 'Comprehensive Aluminum Doors & Windows Catalog',
        category: 'کاتالوگ محصولات / Product Catalog',
        fileSize: '8.2 MB',
        description: 'کاتالوگ اصلی معرفی ابعاد استاندارد، تنوع رنگ آنادایز و پودری و یراق‌آلات سازگار.',
        fileName: 'Alupan_Window_Catalog.pdf',
        fileUrl: '#'
      },
      {
        id: 'cat-3',
        titleFa: 'جدول محاسبات بار باد و ضرایب حرارتی فریم‌های نما',
        titleEn: 'Wind Load & Thermal Resistance Calculation Tables',
        category: 'جدول محاسباتی / Calculation Sheets',
        fileSize: '4.5 MB',
        description: 'دستورالعمل‌ها و جداول فنی محاسبه ممان اینرسی و مقاومت فریم در برابر بارهای سازه‌ای.',
        fileName: 'Wind_Load_Tables.pdf',
        fileUrl: '#'
      }
    ];
  });

  const [customObjectsVersion, setCustomObjectsVersion] = useState(0);

  useEffect(() => {
    const handleProfileSync = () => {
      try {
        const saved = localStorage.getItem(`iranbimhub_mfg_profile_${manufacturer.id}`) ||
          (manufacturer.id === 'm1' ? localStorage.getItem('iranbimhub_mfg_profile') : null);
        if (saved) setSavedProfile(JSON.parse(saved));

        const savedStds = localStorage.getItem('iranbimhub_mfg_standards');
        if (savedStds) setBrandStandards(JSON.parse(savedStds));

        const savedAwards = localStorage.getItem('iranbimhub_mfg_awards');
        if (savedAwards) setBrandAwards(JSON.parse(savedAwards));

        const savedProjects = localStorage.getItem('iranbimhub_mfg_projects');
        if (savedProjects) setBrandProjects(JSON.parse(savedProjects));

        const savedCatalogs = localStorage.getItem('iranbimhub_mfg_catalogs');
        if (savedCatalogs) setBrandCatalogs(JSON.parse(savedCatalogs));
      } catch (e) {
        console.error(e);
      }
      setCustomObjectsVersion(v => v + 1);
    };
    window.addEventListener('iranbimhub_brand_profile_updated', handleProfileSync);
    window.addEventListener('iranbimhub_custom_objects_updated', handleProfileSync);
    return () => {
      window.removeEventListener('iranbimhub_brand_profile_updated', handleProfileSync);
      window.removeEventListener('iranbimhub_custom_objects_updated', handleProfileSync);
    };
  }, [manufacturer.id]);

  const activeMfg = {
    ...manufacturer,
    nameFa: savedProfile?.nameFa || manufacturer.nameFa,
    nameEn: savedProfile?.nameEn || manufacturer.nameEn,
    sloganFa: savedProfile?.sloganFa || ext.sloganFa,
    sloganEn: savedProfile?.sloganEn || ext.sloganEn,
    descriptionFa: savedProfile?.descFa || manufacturer.descriptionFa,
    descriptionEn: savedProfile?.descEn || manufacturer.descriptionEn,
    website: savedProfile?.website !== undefined ? savedProfile.website : manufacturer.website,
    email: savedProfile?.email !== undefined ? savedProfile.email : manufacturer.email,
    phone: savedProfile?.phone !== undefined ? savedProfile.phone : manufacturer.phone,
    addressFa: savedProfile?.addressFa !== undefined ? savedProfile.addressFa : manufacturer.addressFa,
    addressEn: savedProfile?.addressEn !== undefined ? savedProfile.addressEn : manufacturer.addressEn,
    verified: savedProfile?.verified !== undefined ? savedProfile.verified : manufacturer.verified,
    logoUrl: savedProfile?.logoUrl || manufacturer.logo,
    coverUrl: savedProfile?.coverUrl || ext.bannerUrl,
    country: savedProfile?.country || 'IR',
    promoVideoUrl: savedProfile?.promoVideoUrl !== undefined ? savedProfile.promoVideoUrl : 'https://www.aparat.com/v/a1',
    portfolioPdfName: savedProfile?.portfolioPdfName !== undefined ? savedProfile.portfolioPdfName : 'Alupan_Corporate_Catalog_2026.pdf',
    portfolioPdfUrl: savedProfile?.portfolioPdfUrl !== undefined ? savedProfile.portfolioPdfUrl : 'https://alupan.com/catalog.pdf',
  };

  const getActiveSocials = () => {
    if (!savedProfile) {
      return {
        instagram: ext.socials.instagram || '',
        linkedin: ext.socials.linkedin || '',
        youtube: ext.socials.youtube || '',
        pinterest: ext.socials.pinterest || '',
        telegram: ext.socials.telegram || '',
        twitter: ext.socials.twitter || '',
      };
    }

    const socials: Record<string, string> = {};
    if (Array.isArray(savedProfile.socialLinks)) {
      savedProfile.socialLinks.forEach((row: any) => {
        if (row.platform && row.url && row.url.trim() !== '') {
          socials[row.platform] = row.url;
        }
      });
    } else {
      if (savedProfile.instagram) socials.instagram = savedProfile.instagram;
      if (savedProfile.linkedin) socials.linkedin = savedProfile.linkedin;
      if (savedProfile.youtube) socials.youtube = savedProfile.youtube;
      if (savedProfile.pinterest) socials.pinterest = savedProfile.pinterest;
      if (savedProfile.telegram) socials.telegram = savedProfile.telegram;
      if (savedProfile.twitter) socials.twitter = savedProfile.twitter;
    }
    return socials;
  };

  const activeSocials = getActiveSocials();

  // Handle follow toggle
  const handleFollowToggle = () => {
    try {
      const savedFollows = JSON.parse(localStorage.getItem('iranbimhub_followed_brands') || '[]');
      let updated: string[];
      if (isFollowing) {
        updated = savedFollows.filter((id: string) => id !== manufacturer.id);
        setFollowersCount(prev => prev - 1);
        setIsFollowing(false);
      } else {
        updated = [...savedFollows, manufacturer.id];
        setFollowersCount(prev => prev + 1);
        setIsFollowing(true);
      }
      localStorage.setItem('iranbimhub_followed_brands', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine product name based on selected productOfInterest
    let prodName = isRtl ? 'مشاوره عمومی برند' : 'General Brand Consultation';
    if (requestForm.productOfInterest !== 'general') {
      const selectedObj = BIM_OBJECTS.find(o => o.id === requestForm.productOfInterest);
      if (selectedObj) {
        prodName = isRtl ? selectedObj.titleFa : selectedObj.titleEn;
      }
    }

    // Compose rich senderName incorporating company and role
    const senderName = isRtl 
      ? `مهندس ${requestForm.name} (${requestForm.company} - ${requestForm.role})`
      : `Eng. ${requestForm.name} (${requestForm.company} - ${requestForm.role})`;

    // Compose rich message incorporating estimated quantity and subject
    const finalMessage = isRtl
      ? `موضوع: ${requestForm.subject}\n\n${requestForm.message}\n\n[حجم برآوردی پروژه: ${requestForm.estimatedQuantity || 'ذکر نشده'}]`
      : `Subject: ${requestForm.subject}\n\n${requestForm.message}\n\n[Estimated Project Quantity / Spec Value: ${requestForm.estimatedQuantity || 'Not Specified'}]`;

    // Create a new lead
    const newLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderName,
      email: requestForm.email,
      phone: requestForm.phone,
      message: finalMessage,
      productName: prodName,
      date: new Date().toLocaleDateString(isRtl ? 'fa-IR' : 'en-US'),
      tag: requestForm.productOfInterest !== 'general' ? 'Product Spec Inquiry' : 'Technical Quote',
      read: false,
      replies: []
    };

    try {
      const savedLeads = JSON.parse(localStorage.getItem('iranbimhub_mfg_leads') || '[]');
      const updatedLeads = [newLead, ...savedLeads];
      localStorage.setItem('iranbimhub_mfg_leads', JSON.stringify(updatedLeads));
      
      // Dispatch custom event to notify listening CRM views of new leads
      window.dispatchEvent(new CustomEvent('iranbimhub_lead_submitted'));
    } catch (err) {
      console.error('Error saving B2B lead:', err);
    }

    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setShowRequestModal(false);
      setRequestForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: 'Architect',
        subject: '',
        productOfInterest: 'general',
        estimatedQuantity: '',
        message: '',
        receiveNews: true
      });
    }, 2000);
  };

  const handleObjectRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newObjRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      manufacturerId: manufacturer.id,
      senderName: isRtl 
        ? `${objectRequestForm.name} (${objectRequestForm.company || 'شخصی'})` 
        : `${objectRequestForm.name} (${objectRequestForm.company || 'Individual'})`,
      email: objectRequestForm.email,
      phone: objectRequestForm.phone,
      objectName: objectRequestForm.objectName,
      category: objectRequestForm.category,
      format: objectRequestForm.format,
      priority: objectRequestForm.priority,
      description: objectRequestForm.description,
      date: new Date().toLocaleDateString(isRtl ? 'fa-IR' : 'en-US'),
      status: 'Pending'
    };

    try {
      const savedRequests = JSON.parse(localStorage.getItem('iranbimhub_object_requests') || '[]');
      const updatedRequests = [newObjRequest, ...savedRequests];
      localStorage.setItem('iranbimhub_object_requests', JSON.stringify(updatedRequests));

      // Dispatch custom event to notify listening CRM/Dashboard views of new object requests
      window.dispatchEvent(new CustomEvent('iranbimhub_object_request_submitted'));
    } catch (err) {
      console.error('Error saving BIM object request:', err);
    }

    setObjectRequestSubmitted(true);
    setTimeout(() => {
      setObjectRequestSubmitted(false);
      setShowObjectRequestModal(false);
      setObjectRequestForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        objectName: '',
        category: 'doors_windows',
        format: 'Revit',
        priority: 'Medium',
        description: ''
      });
    }, 2000);
  };

  // Computed promotional presentation videos list linked from Manufacturer Dashboard
  const displayVideos = React.useMemo(() => {
    // 1. Check savedProfile promoVideos from Manufacturer Dashboard
    if (savedProfile && Array.isArray(savedProfile.promoVideos)) {
      return savedProfile.promoVideos
        .filter((v: any) => v && v.url && v.url.trim() !== '')
        .map((v: any, index: number) => {
          const parsed = parseVideoEmbedUrl(v.url);
          return {
            id: v.id || `v-${index}`,
            titleFa: v.titleFa || `ویدیو معرفی شماره ${index + 1}`,
            titleEn: v.titleEn || `Presentation Video #${index + 1}`,
            url: v.url,
            embedUrl: parsed.embedUrl,
            type: parsed.type,
            priority: index + 1,
            thumbnailUrl: activeMfg.coverUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
            duration: '03:30'
          };
        });
    }

    // 2. Default fallback to ext.clips if savedProfile hasn't configured promoVideos
    if (ext.clips && ext.clips.length > 0) {
      return ext.clips.map((c: any, index: number) => {
        const videoUrl = c.url || (c.aparatId ? `https://www.aparat.com/v/${c.aparatId}` : '');
        const parsed = parseVideoEmbedUrl(videoUrl);
        return {
          id: c.id,
          titleFa: c.titleFa,
          titleEn: c.titleEn,
          url: videoUrl,
          embedUrl: parsed.embedUrl,
          type: parsed.type === 'invalid' ? 'aparat' : parsed.type,
          priority: index + 1,
          thumbnailUrl: c.thumbnailUrl || activeMfg.coverUrl,
          duration: c.duration || '03:45'
        };
      });
    }

    // 3. Fallback to promoVideoUrl
    if (activeMfg.promoVideoUrl && activeMfg.promoVideoUrl.trim() !== '') {
      const parsed = parseVideoEmbedUrl(activeMfg.promoVideoUrl);
      if (parsed.type !== 'invalid') {
        return [{
          id: 'promo-1',
          titleFa: activeMfg.nameFa + ' - ' + (isRtl ? 'ویدیو رسمی معرفی' : 'Official Presentation Video'),
          titleEn: activeMfg.nameEn + ' - Official Presentation Video',
          url: activeMfg.promoVideoUrl,
          embedUrl: parsed.embedUrl,
          type: parsed.type,
          priority: 1,
          thumbnailUrl: activeMfg.coverUrl,
          duration: '04:15'
        }];
      }
    }

    return [];
  }, [savedProfile, ext.clips, activeMfg.promoVideoUrl, activeMfg.coverUrl, activeMfg.nameFa, activeMfg.nameEn, isRtl]);

  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Active video selection (defaults to 1st priority video)
  const activeVideo = React.useMemo(() => {
    if (displayVideos.length === 0) return null;
    if (selectedVideoId) {
      const found = displayVideos.find(v => v.id === selectedVideoId);
      if (found) return found;
    }
    return displayVideos[0];
  }, [displayVideos, selectedVideoId]);

  // Filter BIM Objects related specifically to this manufacturer (including custom ones added from dashboard)
  const manufacturerObjects = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_custom_objects_v2');
      const custom = saved ? JSON.parse(saved) : [];
      const map = new Map<string, any>();
      BIM_OBJECTS.forEach(obj => { if (obj && obj.id) map.set(obj.id, obj); });
      custom.forEach((obj: any) => { if (obj && obj.id) map.set(obj.id, obj); });
      const combined = Array.from(map.values());
      return combined.filter(obj => obj && (obj.manufacturerId === manufacturer.id || (manufacturer.id === 'm1' && obj.manufacturerId === 'custom')));
    } catch {
      return BIM_OBJECTS.filter(obj => obj.manufacturerId === manufacturer.id);
    }
  }, [manufacturer.id, customObjectsVersion]);

  const draftBrandProfile = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_mfg_profile') || localStorage.getItem('iranbimhub_mfg_profile_m1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, [manufacturer.id, customObjectsVersion]);

  const hasLocalDraftProfile = Boolean(draftBrandProfile);
  const isBrandPublic = !hasLocalDraftProfile || draftBrandProfile?.brandVerificationStatus === 'verified' || draftBrandProfile?.brandPublishStatus === 'public';

  let sessionUser: any = null;
  try {
    const savedUser = localStorage.getItem('iranbimhub_user_session') || localStorage.getItem('iranbimhub_user');
    sessionUser = savedUser ? JSON.parse(savedUser) : null;
  } catch {}

  const isOwnerPreview = hasLocalDraftProfile && sessionUser?.role === 'Manufacturer' && (
    !draftBrandProfile?.phone || !sessionUser?.phone || draftBrandProfile.phone === sessionUser.phone || manufacturer.id === 'm1'
  );
  const isAdminPreview = Boolean(localStorage.getItem('iranbimhub_current_admin'));
  const canPreviewPrivateBrand = isBrandPublic || isOwnerPreview || isAdminPreview;
  const canSeeDraftObjects = isOwnerPreview || isAdminPreview;
  const visibleManufacturerObjects = canSeeDraftObjects
    ? manufacturerObjects
    : manufacturerObjects.filter((obj: any) => {
        const hasPublicationMetadata = obj.isPublic !== undefined || obj.status !== undefined || obj.evaluationStatus !== undefined;
        return !hasPublicationMetadata || obj.isPublic === true || obj.status === 'Published' || obj.evaluationStatus === 'approved';
      });

  // Catalog Filtering State
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');

  const availableSubcategories = React.useMemo(() => {
    const subs = new Set<string>();
    visibleManufacturerObjects.forEach(obj => {
      if (obj.subcategory) subs.add(obj.subcategory);
    });
    return Array.from(subs);
  }, [visibleManufacturerObjects]);

  const availableFormats = React.useMemo(() => {
    const fmts = new Set<string>();
    visibleManufacturerObjects.forEach(obj => {
      obj.formats.forEach(f => fmts.add(f));
    });
    return Array.from(fmts);
  }, [visibleManufacturerObjects]);

  const filteredCatalogObjects = React.useMemo(() => {
    return visibleManufacturerObjects.filter(obj => {
      const title = isRtl ? obj.titleFa : obj.titleEn;
      const desc = isRtl ? obj.descriptionFa : obj.descriptionEn;
      const matchesSearch = 
        title.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        ((obj.specs && (obj.specs as any).model) || '').toLowerCase().includes(catalogSearchQuery.toLowerCase());
      
      const matchesSub = selectedSubcategory === 'all' || obj.subcategory === selectedSubcategory;
      const matchesFormat = selectedFormat === 'all' || obj.formats.includes(selectedFormat);

      return matchesSearch && matchesSub && matchesFormat;
    });
  }, [visibleManufacturerObjects, catalogSearchQuery, selectedSubcategory, selectedFormat, isRtl]);

  // Helper to map products to specific brand collections
  const getCollectionObjects = React.useCallback((colId: string, objects: BIMObject[]): BIMObject[] => {
    let filtered: BIMObject[] = [];
    if (colId === 'c1_1') {
      filtered = objects.filter(obj => obj.titleFa.includes('ترمال') || obj.titleEn.toLowerCase().includes('thermal') || obj.titleFa.includes('پنجره'));
    } else if (colId === 'c1_2') {
      filtered = objects.filter(obj => obj.titleFa.includes('کرتین') || obj.titleEn.toLowerCase().includes('curtain') || obj.titleFa.includes('نما'));
    } else if (colId === 'c1_3') {
      filtered = objects.filter(obj => obj.titleFa.includes('کشویی') || obj.titleEn.toLowerCase().includes('sliding') || obj.titleEn.toLowerCase().includes('slim'));
    } else if (colId === 'c2_1') {
      filtered = objects.filter(obj => obj.titleFa.includes('پکیج') || obj.titleEn.toLowerCase().includes('boiler'));
    } else if (colId === 'c2_2') {
      filtered = objects.filter(obj => obj.titleFa.includes('رادیاتور') || obj.titleEn.toLowerCase().includes('radiator'));
    } else if (colId === 'c3_1') {
      filtered = objects.filter(obj => obj.titleFa.includes('کنترل') || obj.titleEn.toLowerCase().includes('low-e') || obj.titleEn.toLowerCase().includes('energy'));
    } else if (colId === 'c3_2') {
      filtered = objects.filter(obj => obj.titleFa.includes('لمینت') || obj.titleEn.toLowerCase().includes('laminated') || obj.titleFa.includes('سکوریت'));
    } else if (colId === 'c4_1') {
      filtered = objects.filter(obj => obj.titleFa.includes('پروفیل') || obj.titleEn.toLowerCase().includes('profile') || obj.titleEn.toLowerCase().includes('w700'));
    } else if (colId === 'c4_2') {
      filtered = objects.filter(obj => obj.titleFa.includes('کشویی') || obj.titleEn.toLowerCase().includes('sliding') || obj.titleFa.includes('توری'));
    } else if (colId === 'c5_1') {
      filtered = objects.filter(obj => obj.titleFa.includes('مرمر') || obj.titleEn.toLowerCase().includes('marble') || obj.titleEn.toLowerCase().includes('slab'));
    } else if (colId === 'c5_2') {
      filtered = objects.filter(obj => obj.titleFa.includes('سرامیک') || obj.titleEn.toLowerCase().includes('matte') || obj.titleEn.toLowerCase().includes('tile'));
    } else if (colId === 'c6_1') {
      filtered = objects.filter(obj => obj.titleFa.includes('خطی') || obj.titleEn.toLowerCase().includes('linear') || obj.titleFa.includes('چراغ'));
    } else if (colId === 'c6_2') {
      filtered = objects.filter(obj => obj.titleFa.includes('نورافکن') || obj.titleEn.toLowerCase().includes('floodlight') || obj.titleEn.toLowerCase().includes('ip66'));
    }

    if (filtered.length === 0) {
      // Fallback to avoid empty row layout: split objects of this manufacturer
      filtered = objects.slice(0, 3);
    }
    return filtered;
  }, []);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [manufacturer.id]);

  if (!canPreviewPrivateBrand) {
    return (
      <div className="min-h-screen bg-[#FBFBFC] dark:bg-gray-950 flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-lg w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-xl p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-gray-900 dark:text-white">
              {isRtl ? 'این برند هنوز توسط تیم ایران‌بیم‌هاب ارزیابی و تأیید نشده است' : 'This brand has not yet been evaluated and approved by IranBIMhub'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {isRtl
                ? 'برای حفاظت از هویت و اصالت برندها، صفحه برند تنها پس از بررسی مدارک رسمی و تأیید واحد ارزیابی ایران‌بیم‌هاب منتشر می‌شود.'
                : 'To protect brand identity and authenticity, brand pages are published only after official documents are reviewed and approved by the IranBIMhub evaluation team.'
              }
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-black transition-all cursor-pointer"
          >
            {isRtl ? 'بازگشت' : 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. Header Banner Image & Overlay navigation */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden bg-gray-100">
        <img 
          src={activeMfg.coverUrl || ext.bannerUrl} 
          alt={isRtl ? activeMfg.nameFa : activeMfg.nameEn}
          className="w-full h-full object-cover select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"></div>
        
        {/* Back navigation button */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 max-w-7xl mx-auto flex justify-between items-center z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-black bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-white px-3.5 py-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-gray-100 dark:border-gray-800"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{isRtl ? 'بازگشت' : 'Back'}</span>
          </button>

          <span className="text-[10px] bg-[#26B6B6] text-white px-3 py-1.5 rounded-full shadow-md font-bold uppercase tracking-wider">
            {isRtl ? activeMfg.nameFa : activeMfg.nameEn}
          </span>
        </div>
      </div>

      {/* 2. Main Profile Card (Floating offset over banner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 md:-mt-28 relative z-20 pb-12">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl space-y-6 md:space-y-8">
          
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 justify-between">
            {/* Left Col: Brand Logo, Name, Meta counts */}
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              {/* Rounded Square Logo Box */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border-2 border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center font-mono font-black text-lg sm:text-2xl tracking-widest text-[#26B6B6] shadow-md select-none shrink-0 overflow-hidden">
                {activeMfg.logoUrl && (activeMfg.logoUrl.startsWith('http') || activeMfg.logoUrl.startsWith('data:image')) ? (
                  <img src={activeMfg.logoUrl} alt={isRtl ? activeMfg.nameFa : activeMfg.nameEn} className="w-full h-full object-cover" />
                ) : (
                  <span>{activeMfg.logoUrl || manufacturer.logo}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight flex items-center gap-2">
                    {isRtl ? activeMfg.nameFa : activeMfg.nameEn}
                    <span className="text-2xl ml-1" title={activeMfg.country}>
                      {{'IR': '🇮🇷', 'TR': '🇹🇷', 'DE': '🇩🇪', 'IT': '🇮🇹', 'CN': '🇨🇳', 'AE': '🇦🇪'}[activeMfg.country as string] || '🇮🇷'}
                    </span>
                  </h1>
                  {activeMfg.verified && (
                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900 flex items-center gap-1 select-none">
                      ✓ {isRtl ? 'تایید شده' : 'Verified'}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#26B6B6] tracking-wide">
                  {isRtl ? activeMfg.sloganFa : activeMfg.sloganEn}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 font-bold font-mono">
                  <span>{followersCount} {isRtl ? 'دنبال‌کننده' : 'followers'}</span>
                  <span>•</span>
                  <span>{visibleManufacturerObjects.length} {isRtl ? 'مدل BIM فعال' : 'Active BIM Models'}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Buttons Controls */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 items-stretch sm:items-center lg:items-end justify-start sm:justify-end lg:justify-center w-full lg:w-auto">
              {/* Follow Button */}
              <button
                onClick={handleFollowToggle}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm w-full sm:w-36 ${
                  isFollowing 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-750' 
                    : 'bg-[#26B6B6] hover:bg-[#1e9494] text-white'
                }`}
              >
                {isFollowing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isFollowing ? (isRtl ? 'دنبال می‌کنید' : 'Following') : (isRtl ? 'دنبال کردن' : 'Follow')}</span>
              </button>

              {/* Direct Request B2B Button */}
              <button
                onClick={() => setShowRequestModal(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs w-full sm:w-44"
              >
                <MessageSquare className="w-4 h-4 text-[#26B6B6]" />
                <span>{isRtl ? 'ارسال درخواست مشاوره' : 'Send B2B Request'}</span>
              </button>

              {/* Request Needed Objects Button */}
              <button
                onClick={() => setShowObjectRequestModal(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs w-full sm:w-44"
              >
                <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{isRtl ? 'درخواست فمیلی جدید' : 'Request BIM Object'}</span>
              </button>
            </div>
          </div>

          {!isBrandPublic && (isOwnerPreview || isAdminPreview) && (
            <div className="rounded-2xl border border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/25 text-amber-900 dark:text-amber-100 p-4 text-start flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-black">
                  {isRtl ? 'پیش‌نمایش خصوصی برند' : 'Private Brand Preview'}
                </h3>
                <p className="text-xs leading-relaxed">
                  {isRtl
                    ? 'این برند هنوز توسط تیم ایران‌بیم‌هاب ارزیابی و تأیید نشده است. این صفحه فعلاً فقط برای شما و ادمین‌های سایت قابل مشاهده است.'
                    : 'This brand has not yet been evaluated and approved by IranBIMhub. This page is currently visible only to you and site admins.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Table of Contacts & Custom Stats Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800/60">
            {/* Brief Bio Section */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#26B6B6]" />
                  <span>{isRtl ? 'درباره شرکت' : 'About Brand'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light whitespace-pre-wrap">
                  {isRtl ? (activeMfg.descriptionFa || ext.longDescriptionFa) : (activeMfg.descriptionEn || ext.longDescriptionEn)}
                </p>
              </div>

              {/* Company Portfolio PDF Download Button */}
              {(activeMfg.portfolioPdfName || activeMfg.portfolioPdfUrl) && (
                <div className="pt-1">
                  <a
                    href={activeMfg.portfolioPdfUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    download={activeMfg.portfolioPdfName || 'Company_Portfolio.pdf'}
                    className="inline-flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-4 py-2.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all hover:scale-102 active:scale-95 cursor-pointer w-full sm:w-auto"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <Download className="w-4 h-4" />
                      <span>{isRtl ? 'دانلود پرتفولیوی شرکت (PDF)' : 'Download Portfolio Catalog'}</span>
                    </div>
                    {activeMfg.portfolioPdfName && (
                      <span className="text-[10px] opacity-80 font-mono font-normal truncate max-w-[240px] sm:max-w-xs inline-block">({activeMfg.portfolioPdfName})</span>
                    )}
                  </a>
                </div>
              )}
            </div>

            {/* Brand Contact Details Box */}
            <div className="bg-gray-50/50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 rounded-xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {isRtl ? 'اطلاعات تماس رسمی' : 'Official Coordinates'}
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {activeMfg.website && (
                  <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                    <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <a href={activeMfg.website} target="_blank" rel="noreferrer" className="hover:text-[#26B6B6] underline font-medium truncate">
                      {activeMfg.website.replace('https://', '').replace('http://', '')}
                    </a>
                  </div>
                )}

                {activeMfg.email && (
                  <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <a href={`mailto:${activeMfg.email}`} className="hover:text-[#26B6B6] font-medium truncate">
                      {activeMfg.email}
                    </a>
                  </div>
                )}

                {activeMfg.phone && (
                  <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-mono font-medium">{activeMfg.phone}</span>
                  </div>
                )}

                {(activeMfg.addressFa || activeMfg.addressEn) && (
                  <div className="flex items-start gap-2.5 text-gray-600 dark:text-gray-300 leading-normal">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="font-light">{isRtl ? (activeMfg.addressFa || activeMfg.addressEn) : (activeMfg.addressEn || activeMfg.addressFa)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social connections block */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50 dark:border-gray-800/40">
            <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">
              {isRtl ? 'شبکه‌های اجتماعی و ارتباطات رسمی:' : 'Corporate Social Connects:'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(activeSocials).map(([key, url]) => {
                if (!url || typeof url !== 'string' || !url.trim()) return null;

                const ensureAbsoluteUrl = (u: string) => {
                  const trimmed = u.trim();
                  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
                    return trimmed;
                  }
                  return `https://${trimmed}`;
                };

                let iconEl = null;
                let colorClass = 'hover:text-[#26B6B6] hover:bg-[#26B6B6]/10';
                
                if (key === 'telegram') {
                  iconEl = TelegramIcon('w-4 h-4');
                  colorClass = 'hover:text-sky-500 hover:bg-sky-500/10 dark:hover:bg-sky-500/20';
                } else if (key === 'instagram') {
                  iconEl = InstagramIcon('w-4 h-4');
                  colorClass = 'hover:text-pink-500 hover:bg-pink-500/10 dark:hover:bg-pink-500/20';
                } else if (key === 'linkedin') {
                  iconEl = LinkedInIcon('w-4 h-4');
                  colorClass = 'hover:text-blue-500 hover:bg-blue-500/10 dark:hover:bg-blue-500/20';
                } else if (key === 'youtube') {
                  iconEl = YouTubeIcon('w-4 h-4');
                  colorClass = 'hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20';
                } else if (key === 'twitter' || key === 'x') {
                  iconEl = XIcon('w-4 h-4');
                  colorClass = 'hover:text-gray-950 hover:bg-gray-950/10 dark:hover:text-white dark:hover:bg-white/20';
                } else if (key === 'whatsapp') {
                  iconEl = WhatsAppIcon('w-4 h-4');
                  colorClass = 'hover:text-emerald-500 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20';
                } else if (key === 'pinterest') {
                  iconEl = (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.396-5.966 1.396-5.966s-.356-.715-.356-1.774c0-1.662.962-2.902 2.163-2.902 1.021 0 1.513.768 1.513 1.687 0 1.026-.653 2.561-.99 3.982-.281 1.192.597 2.163 1.774 2.163 2.13 0 3.771-2.25 3.771-5.49 0-2.87-2.062-4.88-5.005-4.88-3.414 0-5.419 2.561-5.419 5.212 0 1.031.396 2.139.893 2.74a.36.36 0 0 1 .083.345l-.332 1.353a.364.364 0 0 1-.515.253c-1.393-.647-2.26-2.68-2.26-4.316 0-3.513 2.553-6.738 7.354-6.738 3.86 0 6.86 2.751 6.86 6.421 0 3.836-2.42 6.923-5.776 6.923-1.129 0-2.193-.586-2.553-1.272l-.696 2.65c-.25 1.054-.93 2.37-1.385 3.111 1.045.32 2.153.493 3.3.493 6.621 0 11.988-5.366 11.988-11.987C23.996 5.367 18.631 0 12.017 0z"/>
                    </svg>
                  );
                  colorClass = 'hover:text-red-600 hover:bg-red-600/10 dark:hover:bg-red-600/20';
                }

                return (
                  <a
                    key={key}
                    href={ensureAbsoluteUrl(url)}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-700/60 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 transition-all duration-200 cursor-pointer capitalize active:scale-95 ${colorClass}`}
                    title={key}
                  >
                    {iconEl}
                    <span className="text-[10px] hidden sm:inline">{key}</span>
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      </div>



      {/* 3. Active BIM Objects Catalog grid (use Bimobject as source) */}
      <div id="manufacturer-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 scroll-mt-20">
        <div className="border-s-4 border-[#26B6B6] pl-3.5 pr-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#26B6B6]" />
              <span>{isRtl ? `کاتالوگ آبجکت‌های هوشمند بیم (${filteredCatalogObjects.length} مورد)` : `BIM Object Families Catalog (${filteredCatalogObjects.length} items)`}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isRtl ? 'دانلود رایگان مستقیم مدل‌های سه‌بعدی تاییدشده رویت، آرکیکد و استاندارد IFC' : 'Direct free download of verified Revit files, ArchiCAD and IFC formats'}
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-slate-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search text query */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 dark:left-auto dark:right-3 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={isRtl ? 'جستجو در محصولات این برند...' : 'Search brand products...'}
              value={catalogSearchQuery}
              onChange={e => setCatalogSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
            />
          </div>

          {/* Subcategory dropdown */}
          <div>
            <select
              value={selectedSubcategory}
              onChange={e => setSelectedSubcategory(e.target.value)}
              className="w-full text-xs p-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
            >
              <option value="all">{isRtl ? 'همه دسته‌بندی‌ها' : 'All Subcategories'}</option>
              {availableSubcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Format dropdown */}
          <div>
            <select
              value={selectedFormat}
              onChange={e => setSelectedFormat(e.target.value)}
              className="w-full text-xs p-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
            >
              <option value="all">{isRtl ? 'همه فرمت‌های مدل' : 'All File Formats'}</option>
              {availableFormats.map(fmt => (
                <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredCatalogObjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalogObjects.map(obj => (
              <BIMObjectCard
                key={obj.id}
                object={obj}
                isSaved={savedObjects.includes(obj.id)}
                onToggleSave={() => onToggleSave(obj.id)}
                onClick={() => onSelectObject(obj)}
                onQuickDownload={(fmt) => onQuickDownload(obj, fmt)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-800 text-gray-400">
            <Layers className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-xs font-bold mb-2">
              {isRtl ? 'هیچ آبجکت بیم فعالی یافت نشد' : 'No active BIM families matching search options'}
            </p>
            <button
              onClick={() => {
                setCatalogSearchQuery('');
                setSelectedSubcategory('all');
                setSelectedFormat('all');
              }}
              className="text-xs text-[#26B6B6] font-bold hover:underline cursor-pointer"
            >
              {isRtl ? 'حذف تمام فیلترها' : 'Reset All Filters'}
            </button>
          </div>
        )}
      </div>

      {/* 3.5 Trust & Credibility Section */}
      {(brandStandards.length > 0 || brandAwards.length > 0 || brandProjects.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-gray-150 dark:border-gray-800 pt-10">
          
          {/* Standards & Certifications */}
          {brandStandards.length > 0 && (
            <div className="space-y-4">
          <div className="border-s-4 border-emerald-500 pl-3.5 pr-3.5">
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>{isRtl ? 'استانداردها و گواهینامه‌های فنی' : 'Standards & Certifications'}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {isRtl ? 'سرتیفیکیت‌ها و تاییدیه صلاحیت‌های رسمی صادر شده از مراجع نظارتی' : 'Verified standard badges and technical quality certifications'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {brandStandards.map(std => (
              <div 
                key={std.id}
                className="bg-slate-50/50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-800 rounded-xl p-3.5 flex gap-3 items-start hover:border-emerald-500/20 transition-all shadow-2xs"
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${std.verified ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'}`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[11.5px] font-extrabold text-gray-800 dark:text-gray-200 leading-snug">
                    {std.name}
                  </h4>
                  {std.code && <p className="text-[9.5px] text-gray-400 mt-0.5 font-mono">Code: {std.code}</p>}
                  {std.description && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{std.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-[8px] bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-700 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase font-mono">
                      {std.country || 'ISIRI'}
                    </span>
                    <span className={`text-[8px] font-bold ${std.verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {std.verified ? (isRtl ? 'تایید شده ✓' : 'Verified ✓') : (isRtl ? 'در حال بررسی ⏳' : 'Under Review ⏳')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Honors & Awards Section (افتخارات و نشان‌ها) */}
        {brandAwards.length > 0 && (
        <div className="space-y-4">
          <div className="border-s-4 border-amber-500 pl-3.5 pr-3.5">
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{isRtl ? 'افتخارات و نشان‌ها' : 'Honors & Awards'}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {isRtl ? 'تندیس‌ها، جوایز ملی و افتخارات کسب شده توسط این برند' : 'Statues, national awards and recognized achievements earned by this brand'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {brandAwards.map(award => (
              <div 
                key={award.id}
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-3.5 hover:border-amber-500/30 hover:shadow-2xs transition-all flex flex-col justify-between space-y-2"
              >
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11.5px] font-extrabold text-gray-800 dark:text-gray-150 leading-snug">
                        {isRtl ? (award.titleFa || award.titleEn) : (award.titleEn || award.titleFa)}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] text-gray-400 mt-1">
                        {award.architect && <span>{award.architect}</span>}
                        {award.location && (
                          <>
                            <span>•</span>
                            <span>{award.location}</span>
                          </>
                        )}
                        {award.year && (
                          <>
                            <span>•</span>
                            <span className="font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">{award.year}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {award.description && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50/50 dark:bg-gray-850 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                      {award.description}
                    </p>
                  )}
                </div>
                {award.fileUrl && award.fileUrl !== '#' && (
                  <a
                    href={award.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[9.5px] text-[#26B6B6] font-bold hover:underline pt-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{award.fileName || (isRtl ? 'دانلود لوح / گواهی' : 'Download Certificate')}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Executed Projects Section (پروژه‌های اجرایی) */}
        {brandProjects.length > 0 && (
        <div className="space-y-4">
          <div className="border-s-4 border-[#26B6B6] pl-3.5 pr-3.5">
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#26B6B6]" />
              <span>{isRtl ? 'پروژه‌های اجرایی' : 'Executed Projects'}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {isRtl ? 'پروژه‌های بکارگیرنده محصولات این برند در سطح کشور' : 'Key architectural developments specifying brand products'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {brandProjects.map(proj => (
              <div 
                key={proj.id}
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-3.5 hover:border-[#26B6B6]/30 hover:shadow-2xs transition-all flex flex-col justify-between space-y-2"
              >
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-teal-50 dark:bg-teal-950/40 text-[#26B6B6] rounded-xl shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11.5px] font-extrabold text-gray-800 dark:text-gray-150 leading-snug">
                        {isRtl ? (proj.titleFa || proj.titleEn) : (proj.titleEn || proj.titleFa)}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] text-gray-400 mt-1">
                        {proj.architect && <span>{proj.architect}</span>}
                        {proj.location && (
                          <>
                            <span>•</span>
                            <span>{proj.location}</span>
                          </>
                        )}
                        {proj.year && (
                          <>
                            <span>•</span>
                            <span className="font-mono bg-teal-500/10 text-[#26B6B6] dark:text-teal-400 px-1.5 py-0.5 rounded font-bold">{proj.year}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {proj.description && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50/50 dark:bg-gray-850 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                      {proj.description}
                    </p>
                  )}
                </div>
                {proj.fileUrl && proj.fileUrl !== '#' && (
                  <a
                    href={proj.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[9.5px] text-[#26B6B6] font-bold hover:underline pt-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{proj.fileName || (isRtl ? 'دانلود مستندات پروژه' : 'Download Project Document')}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
        )}

      </div>
      )}

      {/* 4. Advertising/Introduction Video Clips & Interactive Player (Selector: div#root > ... > div:nth-of-type(5)) */}
      {displayVideos.length > 0 && activeVideo && (
        <div className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800/60 py-12 my-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex justify-between items-end">
              <div className="border-s-4 border-[#26B6B6] pl-3.5 pr-3.5">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'ویدیوهای معرفی و راهنمای مدل‌سازی' : 'Promotional Videos & Presentation Guides'}</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {isRtl 
                    ? 'ویدیوهای معرفی، آزمایش محصول و دستورالعمل‌های فنی بر اساس اولویت پخش' 
                    : 'Official presentation clips and product guides ordered by priority'}
                </p>
              </div>

              <span className="text-[10px] bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-3 py-1.5 border border-rose-100 dark:border-rose-900/40 rounded-lg font-bold font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                <span>{isRtl ? 'کانال ویدیویی رسمی' : 'Official Media Channel'}</span>
              </span>
            </div>

            {/* Main Interactive Video Player Structure */}
            <div className={`grid grid-cols-1 ${displayVideos.length > 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
              {/* Active Player Box */}
              <div className={`${displayVideos.length > 1 ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'} space-y-4`}>
                <div className="relative aspect-16/9 bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 group">
                  {isPlayingVideo ? (
                    activeVideo.type === 'direct' ? (
                      <video 
                        src={activeVideo.url} 
                        controls 
                        autoPlay 
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : activeVideo.embedUrl ? (
                      <iframe 
                        src={
                          activeVideo.type === 'youtube' && !activeVideo.embedUrl.includes('autoplay')
                            ? `${activeVideo.embedUrl}?autoplay=1`
                            : activeVideo.embedUrl
                        } 
                        title={isRtl ? activeVideo.titleFa : activeVideo.titleEn} 
                        className="w-full h-full border-0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white relative">
                        <p className="text-sm font-bold text-gray-300">
                          {isRtl ? 'امکان نمایش ویدیو وجود ندارد.' : 'Video format not playable directly.'}
                        </p>
                        <a 
                          href={activeVideo.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="mt-3 bg-[#26B6B6] text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'مشاهده در منبع اصلی' : 'Open Video Link'}</span>
                        </a>
                      </div>
                    )
                  ) : (
                    /* Custom Cover Preview Before Playing */
                    <div className="absolute inset-0 w-full h-full">
                      <img 
                        src={activeVideo.thumbnailUrl || activeMfg.coverUrl} 
                        alt={isRtl ? activeVideo.titleFa : activeVideo.titleEn}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <button
                          onClick={() => setIsPlayingVideo(true)}
                          className="w-16 h-16 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer group-hover:ring-4 group-hover:ring-[#26B6B6]/30"
                          title={isRtl ? 'پخش ویدیو' : 'Play Video'}
                        >
                          <Play className="w-7 h-7 fill-current ml-1" />
                        </button>
                      </div>

                      {/* Duration label */}
                      <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-lg font-bold">
                        {activeVideo.duration || '03:30'}
                      </span>

                      {/* Priority Badge */}
                      <div className={`absolute top-4 right-4 text-white font-extrabold text-[10px] px-3 py-1 rounded-lg shadow-md flex items-center gap-1.5 ${
                        activeVideo.priority === 1 ? 'bg-emerald-600' : activeVideo.priority === 2 ? 'bg-amber-600' : 'bg-indigo-600'
                      }`}>
                        <Play className="w-3 h-3 fill-current" />
                        <span>
                          {isRtl 
                            ? (activeVideo.priority === 1 ? 'پخش اول (اصلی)' : `پخش ${activeVideo.priority === 2 ? 'دوم' : 'سوم'}`)
                            : (activeVideo.priority === 1 ? '1st Play (Main)' : `${activeVideo.priority}nd Play`)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white leading-snug">
                      {isRtl ? activeVideo.titleFa : activeVideo.titleEn}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {isRtl ? `اولویت پخش: شماره ${activeVideo.priority}` : `Play Priority: #${activeVideo.priority}`}
                    </p>
                  </div>

                  <a 
                    href={activeVideo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#26B6B6] hover:underline flex items-center gap-1 shrink-0 bg-[#26B6B6]/10 px-3 py-1.5 rounded-lg"
                  >
                    <span>{isRtl ? 'لینک مستقیم' : 'Direct Link'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Sidebar Playlist Section (Shown when multiple videos are present) */}
              {displayVideos.length > 1 && (
                <div className="space-y-4 bg-white dark:bg-gray-900/80 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#26B6B6]" />
                      <span>{isRtl ? 'لیست پخش ویدیوها (بر اساس اولویت)' : 'Video Playlist (By Priority)'}</span>
                    </h4>
                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                      {displayVideos.length} {isRtl ? 'ویدیو' : 'Videos'}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {displayVideos.map((vid) => {
                      const isActive = vid.id === activeVideo.id;
                      return (
                        <div
                          key={vid.id}
                          onClick={() => {
                            setSelectedVideoId(vid.id);
                            setIsPlayingVideo(true);
                          }}
                          className={`flex gap-3 p-2.5 rounded-xl border transition-all cursor-pointer text-start group ${
                            isActive 
                              ? 'bg-[#26B6B6]/10 dark:bg-[#26B6B6]/15 border-[#26B6B6]/40 shadow-2xs' 
                              : 'bg-slate-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/60 hover:border-[#26B6B6]/30'
                          }`}
                        >
                          <div className="relative w-24 h-15 bg-gray-900 rounded-lg overflow-hidden shrink-0">
                            <img 
                              src={vid.thumbnailUrl || activeMfg.coverUrl} 
                              alt="thumbnail" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-[#26B6B6] text-white' : 'bg-black/60 text-white'}`}>
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[8px] font-mono px-1 rounded font-bold">
                              {vid.duration || '03:30'}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded ${
                                  vid.priority === 1 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}>
                                  {isRtl ? `پخش ${vid.priority === 1 ? 'اول' : vid.priority === 2 ? 'دوم' : 'سوم'}` : `#${vid.priority} Play`}
                                </span>
                              </div>
                              <h5 className={`text-[11px] font-bold leading-snug line-clamp-2 ${isActive ? 'text-[#26B6B6]' : 'text-gray-800 dark:text-gray-200'}`}>
                                {isRtl ? vid.titleFa : vid.titleEn}
                              </h5>
                            </div>

                            <span className="text-[9px] text-gray-400 font-mono truncate">
                              {vid.type === 'aparat' ? 'Aparat' : vid.type === 'youtube' ? 'YouTube' : 'Media Link'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Bookshelf PDF documents & Catalog Section */}
      {(brandCatalogs.length > 0 || ext.bookshelf.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="border-s-4 border-[#26B6B6] pl-3.5 pr-3.5">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#26B6B6]" />
              <span>{isRtl ? 'کتابخانه کاتالوگ‌ها و کتب فنی' : 'Technical Bookshelf & Catalogs'}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isRtl ? 'دانلود مستقیم کاتالوگ‌های فنی، جداول ضرایب انتقال حرارت و استانداردهای فیزیکی' : 'Direct download of corporate brochures, thermal conductivity datasheets and physical codes'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(brandCatalogs.length > 0 ? brandCatalogs : ext.bookshelf.map(b => ({
              id: b.id,
              titleFa: b.title,
              titleEn: b.title,
              category: isRtl ? 'راهنمای فنی' : 'Technical Handbook',
              fileSize: b.fileSize,
              description: '',
              fileName: 'Catalog_Document.pdf',
              fileUrl: '#'
            }))).map(cat => (
              <div 
                key={cat.id}
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-4 flex gap-4 hover:border-[#26B6B6]/30 hover:shadow-xs transition-all relative group"
              >
                {/* Book PDF Cover Mock */}
                <div className="w-20 aspect-[3/4] bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg overflow-hidden shrink-0 flex flex-col justify-between p-1.5 shadow-2xs relative">
                  <div className="flex justify-between items-start">
                    <span className="bg-red-500 text-white text-[7px] font-bold px-1 rounded">PDF</span>
                  </div>
                  <FileText className="w-8 h-8 text-red-500 mx-auto" />
                  <span className="text-[7px] text-gray-400 text-center font-mono truncate">{cat.fileSize || 'PDF'}</span>
                </div>

                {/* Info and action */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">
                      {isRtl ? (cat.titleFa || cat.titleEn) : (cat.titleEn || cat.titleFa)}
                    </h4>
                    {cat.category && (
                      <p className="text-[10px] text-[#26B6B6] font-bold">
                        {cat.category}
                      </p>
                    )}
                    {cat.description && (
                      <p className="text-[9.5px] text-gray-400 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  {cat.fileUrl && cat.fileUrl !== '#' ? (
                    <a
                      href={cat.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[10px] text-[#26B6B6] font-black hover:underline cursor-pointer w-fit pt-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{cat.fileName || (isRtl ? 'دانلود سند PDF' : 'Download PDF')}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        alert(isRtl ? `در حال آماده‌سازی و دانلود کاتالوگ: ${cat.titleFa || cat.titleEn}` : `Preparing download for catalog: ${cat.titleEn || cat.titleFa}`);
                      }}
                      className="flex items-center gap-1 text-[10px] text-[#26B6B6] font-black hover:underline cursor-pointer w-fit pt-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{cat.fileName || (isRtl ? 'دانلود سند PDF' : 'Download Document')}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Send Request Pop-up Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-start space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'درخواست رسمی مشاوره فنی (B2B)' : 'Corporate B2B Consultation'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {isRtl 
                    ? `ارسال مستقیم درخواست فنی و تجاری به کارشناسان شرکت ${activeMfg.nameFa}`
                    : `Send directly to corporate design and technical engineers at ${activeMfg.nameEn}`
                  }
                </p>
              </div>
              <button 
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {requestSubmitted ? (
              <div className="py-8 text-center space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  ✓
                </div>
                <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">
                  {isRtl ? 'درخواست شما با موفقیت ثبت و ارسال شد!' : 'Inquiry Submitted Successfully!'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto px-4">
                  {isRtl 
                    ? 'یک نسخه تاییدیه پیامک و ایمیل گردید. کارشناسان فنی برند به زودی با شما تماس خواهند گرفت.'
                    : 'A verification was sent to your email. Engineers will contact you shortly.'
                  }
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'نام و نام خانوادگی' : 'Full Name'}</label>
                    <input 
                      type="text" 
                      required 
                      value={requestForm.name}
                      onChange={e => setRequestForm({...requestForm, name: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'نام شرکت / دفتر معماری' : 'Company / Studio'}</label>
                    <input 
                      type="text" 
                      required 
                      value={requestForm.company}
                      onChange={e => setRequestForm({...requestForm, company: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'شماره تماس' : 'Phone Number'}</label>
                    <input 
                      type="tel" 
                      required 
                      value={requestForm.phone}
                      onChange={e => setRequestForm({...requestForm, phone: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'آدرس ایمیل' : 'Email address'}</label>
                    <input 
                      type="email" 
                      required 
                      value={requestForm.email}
                      onChange={e => setRequestForm({...requestForm, email: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'سمت / نقش حرفه‌ای' : 'Your Professional Role'}</label>
                    <select
                      value={requestForm.role}
                      onChange={e => setRequestForm({...requestForm, role: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                    >
                      <option value="Architect">{isRtl ? 'معمار / طراح فاز دو' : 'Architect / Specifier'}</option>
                      <option value="BIM Manager">{isRtl ? 'مدیر بیم (BIM Manager)' : 'BIM Manager'}</option>
                      <option value="MEP Engineer">{isRtl ? 'مهندس تاسیسات (MEP)' : 'MEP Engineer'}</option>
                      <option value="Structural Engineer">{isRtl ? 'مهندس سازه' : 'Structural Engineer'}</option>
                      <option value="General Contractor">{isRtl ? 'پیمانکار عمومی / سازنده' : 'General Contractor'}</option>
                      <option value="Owner / Client">{isRtl ? 'کارفرما / مالک پروژه' : 'Project Owner / Client'}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">
                      {isRtl ? 'حجم برآوردی پروژه / تعداد حدودی' : 'Estimated Project Quantity'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={isRtl ? 'مثال: ۲۰۰ لنگه درب یا ۱۰۰۰ مترمربع نما' : 'e.g. 200 doors, 1000 sqm facade, etc.'}
                      value={requestForm.estimatedQuantity}
                      onChange={e => setRequestForm({...requestForm, estimatedQuantity: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'محصول مورد نظر جهت مشاوره' : 'Product of Interest'}</label>
                  <select
                    value={requestForm.productOfInterest}
                    onChange={e => setRequestForm({...requestForm, productOfInterest: e.target.value})}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  >
                    <option value="general">{isRtl ? 'مشاوره عمومی برند (کل کاتالوگ)' : 'General Brand Consultation'}</option>
                    {visibleManufacturerObjects.map(obj => (
                      <option key={obj.id} value={obj.id}>
                        {isRtl ? obj.titleFa : obj.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'موضوع مشاوره' : 'Consultation Subject'}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder={isRtl ? 'مثال: جزئیات نصب پنجره‌های فریم‌لس پروژه سعادت‌آباد' : 'e.g. Frameless window connection details for Tehran project'}
                    value={requestForm.subject}
                    onChange={e => setRequestForm({...requestForm, subject: e.target.value})}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'متن پیام یا الزامات خاص محاسباتی' : 'Message Details'}</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={requestForm.message}
                    onChange={e => setRequestForm({...requestForm, message: e.target.value})}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                  ></textarea>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isRtl ? 'انصراف' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-lg text-xs font-black shadow-md cursor-pointer transition-colors"
                  >
                    {isRtl ? 'ارسال درخواست رسمی' : 'Send B2B Request'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 8. Request Needed Objects Pop-up Modal */}
      {showObjectRequestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-start space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-500" />
                  <span>{isRtl ? 'درخواست مدلسازی فمیلی/آبجکت جدید' : 'Request New BIM Object Modeling'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {isRtl 
                    ? `اگر محصول مورد نظر خود از شرکت ${activeMfg.nameFa} را در لیست آبجکت‌ها پیدا نکردید، از این قسمت درخواست مدلسازی آن را ارسال کنید.`
                    : `If you cannot find a specific product from ${activeMfg.nameEn} in our library, request our engineers to model it for you.`
                  }
                </p>
              </div>
              <button 
                onClick={() => setShowObjectRequestModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {objectRequestSubmitted ? (
              <div className="py-8 text-center space-y-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                  ✓
                </div>
                <h4 className="font-bold text-sm text-amber-800 dark:text-amber-400">
                  {isRtl ? 'درخواست مدلسازی شما با موفقیت ثبت شد!' : 'BIM Object Request Submitted!'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto px-4">
                  {isRtl 
                    ? 'درخواست شما در پنل کارفرمایی کارخانه قرار گرفت. به زودی وضعیت مدلسازی آن را اعلام خواهیم کرد.'
                    : 'Your request has been delivered to the manufacturer\'s modeling queue.'
                  }
                </p>
              </div>
            ) : (
              <form onSubmit={handleObjectRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'نام و نام خانوادگی' : 'Full Name'}</label>
                    <input 
                      type="text" 
                      required 
                      value={objectRequestForm.name}
                      onChange={e => setObjectRequestForm({...objectRequestForm, name: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'نام شرکت / دفتر معماری' : 'Company / Studio'}</label>
                    <input 
                      type="text" 
                      value={objectRequestForm.company}
                      onChange={e => setObjectRequestForm({...objectRequestForm, company: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'شماره تماس' : 'Phone Number'}</label>
                    <input 
                      type="tel" 
                      required 
                      value={objectRequestForm.phone}
                      onChange={e => setObjectRequestForm({...objectRequestForm, phone: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'آدرس ایمیل' : 'Email Address'}</label>
                    <input 
                      type="email" 
                      required 
                      value={objectRequestForm.email}
                      onChange={e => setObjectRequestForm({...objectRequestForm, email: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'نام یا کد کاتالوگی محصول مورد نیاز' : 'Requested Object Name / Catalog Code'}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder={isRtl ? 'مثال: درب شیشه‌ای ریلی ترمال‌بریک سری کشویی' : 'e.g. Slideline door system thermal 150'}
                    value={objectRequestForm.objectName}
                    onChange={e => setObjectRequestForm({...objectRequestForm, objectName: e.target.value})}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'دسته‌بندی فنی' : 'BIM Category'}</label>
                    <select
                      value={objectRequestForm.category}
                      onChange={e => setObjectRequestForm({...objectRequestForm, category: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="doors_windows">{isRtl ? 'در و پنجره' : 'Doors & Windows'}</option>
                      <option value="facade_structures">{isRtl ? 'سازه‌های نما' : 'Facade Structures'}</option>
                      <option value="mep_hvac">{isRtl ? 'تاسیسات مکانیکی و سرمایش گرمایش' : 'MEP & HVAC'}</option>
                      <option value="electrical_lighting">{isRtl ? 'تاسیسات الکتریکی و روشنایی' : 'Electrical & Lighting'}</option>
                      <option value="finishes_materials">{isRtl ? 'مصالح و پوشش‌های نهایی' : 'Finishes & Materials'}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'فرمت مورد نیاز' : 'Required Format'}</label>
                    <select
                      value={objectRequestForm.format}
                      onChange={e => setObjectRequestForm({...objectRequestForm, format: e.target.value})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Revit">Revit (.rfa / .rvt)</option>
                      <option value="IFC">IFC (openBIM)</option>
                      <option value="ArchiCAD">ArchiCAD (.gsm)</option>
                      <option value="AutoCAD">AutoCAD (.dwg)</option>
                      <option value="SketchUp">SketchUp (.skp)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'اولویت پروژه' : 'Project Priority'}</label>
                    <select
                      value={objectRequestForm.priority}
                      onChange={e => setObjectRequestForm({...objectRequestForm, priority: e.target.value as any})}
                      className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Low">{isRtl ? 'کم (کاتالوگ شخصی)' : 'Low (Personal library)'}</option>
                      <option value="Medium">{isRtl ? 'متوسط (طرح فاز یک)' : 'Medium (Phase 1 schematic)'}</option>
                      <option value="High">{isRtl ? 'بالا (فوری - فاز دو اجرایی)' : 'High (Immediate construction)'}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'توضیحات فنی، ابعاد یا لینک مشخصات محصول' : 'Technical Specifications / Sizing details'}</label>
                  <textarea 
                    rows={3} 
                    required 
                    placeholder={isRtl ? 'ابعاد دقیق، کات‌شیت پی‌دی‌اف، یا جزئیات اتصالات مورد نیاز فمیلی را یادداشت نمایید.' : 'Write precise sizing, required parametric control parameters, etc.'}
                    value={objectRequestForm.description}
                    onChange={e => setObjectRequestForm({...objectRequestForm, description: e.target.value})}
                    className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  ></textarea>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowObjectRequestModal(false)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isRtl ? 'انصراف' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-black shadow-md cursor-pointer transition-colors"
                  >
                    {isRtl ? 'ثبت نهایی درخواست فمیلی' : 'Submit Modeling Request'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
