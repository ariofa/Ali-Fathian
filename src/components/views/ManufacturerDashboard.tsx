import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { CATEGORIES, MANUFACTURERS, BIM_OBJECTS } from '../../data';
import { BIMObject } from '../../types';
import { ManufacturerAnalyticsView } from './ManufacturerAnalyticsView';
import { parseVideoEmbedUrl } from '../../lib/videoUtils';
import { 
  BarChart3, 
  UploadCloud, 
  Mail, 
  Layers, 
  Trash2, 
  Plus, 
  CheckCircle, 
  ChevronRight, 
  ChevronUp,
  ChevronDown,
  Play,
  FileText,
  Clock,
  User,
  ExternalLink,
  ShieldAlert,
  Sliders,
  DollarSign,
  TrendingUp,
  X,
  LogOut,
  Award,
  Zap,
  MessageSquare,
  ShieldCheck,
  Eye,
  Target,
  LineChart,
  Grid,
  Menu,
  Briefcase,
  BookOpen,
  FileCheck,
  Building,
  HelpCircle,
  Bell,
  Search,
  Filter,
  Check,
  Upload,
  AlertTriangle,
  Users,
  Lock,
  Calendar,
  Edit,
  Send,
  Globe,
  Video,
  Instagram,
  Linkedin,
  Youtube,
  Twitter
} from 'lucide-react';

interface ManufacturerDashboardProps {
  companyProfile: {
    companyName: string;
    email: string;
    phone: string;
    website: string;
    desc: string;
    tier: 'Free' | 'Premium' | 'VIP' | 'Basic' | 'Professional' | 'Enterprise';
  } | null;
  onPublishNewObject: (newObj: BIMObject) => void;
  onSelectObject: (obj: BIMObject) => void;
  onLogout: () => void;
  onViewBrand?: (mfgId: string) => void;
}

type MFGTab = 
  | 'overview'
  | 'profile'
  | 'catalog'
  | 'subscription'
  | 'analytics'
  | 'requests'
  | 'approval-chat'
  | 'notifications'
  | 'followers';

export const ManufacturerDashboard: React.FC<ManufacturerDashboardProps> = ({
  companyProfile,
  onPublishNewObject,
  onSelectObject,
  onLogout,
  onViewBrand
}) => {
  const { language, t, isRtl, formatNumber } = useLanguage();
  const [activeTab, setActiveTab] = useState<MFGTab>('overview');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState<'info' | 'standards' | 'awards' | 'projects' | 'catalogs'>('info');
  const [requestsSubTab, setRequestsSubTab] = useState<'leads' | 'objects'>('leads');

  // Listen for custom event to change active tab from Header
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const tabName = (e as CustomEvent).detail?.tab;
      if (tabName) {
        if (tabName === 'profile') {
          setActiveTab('profile');
        } else if (tabName === 'subscription') {
          setActiveTab('subscription');
        } else {
          setActiveTab('overview');
        }
      }
    };
    window.addEventListener('change-dashboard-tab', handleTabChange);
    return () => window.removeEventListener('change-dashboard-tab', handleTabChange);
  }, []);

  // Brand Info State
  const [brandInfo, setBrandInfo] = useState(() => {
    let currentTier: 'Free' | 'Premium' | 'VIP' = 'VIP';
    if (companyProfile?.tier) {
      const t = companyProfile.tier;
      if (t === 'Basic' || t === 'Free') currentTier = 'Free';
      else if (t === 'Professional' || t === 'Premium') currentTier = 'Premium';
      else if (t === 'Enterprise' || t === 'VIP') currentTier = 'VIP';
    }

    try {
      const saved = localStorage.getItem('iranbimhub_mfg_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          nameFa: parsed.nameFa || companyProfile?.companyName || 'شرکت صنایع آلومینیوم آلوپن',
          nameEn: parsed.nameEn || 'Alupan Aluminum Systems',
          descFa: parsed.descFa || companyProfile?.desc || 'تولیدکننده انواع در، پنجره و نماهای مدرن آلومینیومی ترمال‌بریک تحت استانداردهای نوین ساختمانی در ایران.',
          descEn: parsed.descEn || 'Pioneering thermal-break aluminum windows, doors and bespoke structural facade units compliant with international BIM standards.',
          logoUrl: parsed.logoUrl || 'https://images.unsplash.com/photo-1516876437184-593fda40c7cf?auto=format&fit=crop&w=150&q=80',
          coverUrl: parsed.coverUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
          website: parsed.website || companyProfile?.website || 'https://alupan.com',
          email: parsed.email || companyProfile?.email || 'info@alupan.com',
          phone: parsed.phone || companyProfile?.phone || '+98 (21) 8877-4433',
          country: parsed.country || 'IR',
          addressFa: parsed.addressFa || 'تهران، خیابان ولیعصر، برج آفتاب، طبقه ۱۲',
          addressEn: parsed.addressEn || '12th Flr, Aftab Tower, Vali-e-Asr Ave, Tehran',
          twitter: parsed.twitter || 'https://twitter.com/alupan',
          linkedin: parsed.linkedin || 'https://linkedin.com/company/alupan',
          instagram: parsed.instagram || 'https://instagram.com/alupan',
          youtube: parsed.youtube || 'https://youtube.com/alupan',
          pinterest: parsed.pinterest || 'https://pinterest.com/alupan',
          telegram: parsed.telegram || 'https://t.me/alupan',
          socialLinks: parsed.socialLinks || [
            { id: 'soc-1', platform: 'instagram', url: parsed.instagram || 'https://instagram.com/alupan' },
            { id: 'soc-2', platform: 'linkedin', url: parsed.linkedin || 'https://linkedin.com/company/alupan' },
            { id: 'soc-3', platform: 'youtube', url: parsed.youtube || 'https://youtube.com/alupan' },
            { id: 'soc-4', platform: 'telegram', url: parsed.telegram || 'https://t.me/alupan' }
          ],
          promoVideoUrl: parsed.promoVideoUrl || 'https://www.aparat.com/v/a1',
          promoVideos: parsed.promoVideos || [
            { 
              id: 'vid-1', 
              titleFa: 'ویدیو معرفی خط تولید و کارخانه آلوپن', 
              titleEn: 'Alupan Automated Factory & Production Line', 
              url: parsed.promoVideoUrl || 'https://www.aparat.com/v/a1', 
              embedUrl: parseVideoEmbedUrl(parsed.promoVideoUrl || 'https://www.aparat.com/v/a1').embedUrl, 
              type: 'aparat' as const 
            }
          ],
          portfolioPdfName: parsed.portfolioPdfName || 'Alupan_Corporate_Catalog_2026.pdf',
          portfolioPdfUrl: parsed.portfolioPdfUrl || 'https://alupan.com/catalog.pdf',
          tier: currentTier,
          verificationDocs: parsed.verificationDocs || [
            { 
              id: 'doc-gazette', 
              nameFa: 'روزنامه رسمی کشور (آگهی تأسیس یا آخرین تغییرات)', 
              nameEn: 'Official Gazette (Registration or Amendments Notice)', 
              type: 'PDF', 
              status: 'Pending', 
              date: '۱۴۰۵/۰۴/۰۱',
              isGazette: true,
              description: '',
              url: 'https://rrk.ir',
              fileUrl: '',
              fileName: ''
            },
            { 
              id: 'doc-1', 
              nameFa: 'پروانه بهره‌برداری وزارت صمت', 
              nameEn: 'Industrial Operating License', 
              type: 'PDF', 
              status: 'Verified', 
              date: '۱۴۰۴/۰۲/۱۵',
              description: 'پروانه بهره‌برداری صنایع نوین ساختمانی صادر شده توسط صمت البرز.',
              url: 'https://mimt.gov.ir',
              fileUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80',
              fileName: 'MIMT_Industrial_License.pdf'
            },
            { 
              id: 'doc-2', 
              nameFa: 'گواهینامه تایید صلاحیت فنی مرکز تحقیقات مسکن', 
              nameEn: 'BHRC Quality Certification', 
              type: 'PDF', 
              status: 'Verified', 
              date: '۱۴۰۴/۰۶/۱۰',
              description: 'تاییدیه فنی سیستم‌های آلومینیومی دوجداره هافمن آلو-۹۰.',
              url: 'https://bhrc.ac.ir',
              fileUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80',
              fileName: 'BHRC_Technical_Certificate.pdf'
            },
            { 
              id: 'doc-3', 
              nameFa: 'گواهینامه مالیات بر ارزش افزوده‌ سال جاری', 
              nameEn: 'VAT Registration Certificate', 
              type: 'PDF', 
              status: 'Rejected', 
              date: '۱۴۰۵/۰۲/۲۸',
              description: 'گواهی ثبت‌نام موقت مالیاتی دوره‌ای.',
              url: 'https://intamedia.ir',
              fileUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80',
              fileName: 'VAT_Certificate_1404.pdf',
              rejectionReasonFa: 'اعتبار گواهی ارزش افزوده بارگذاری شده منقضی شده است. لطفا آخرین تمدیدیه را تمدید و ارسال کنید.',
              rejectionReasonEn: 'The uploaded VAT certificate has expired. Please upload the latest renewal.'
            }
          ]
        };
      }
    } catch (e) {
      console.error("Error reading saved brandInfo:", e);
    }

    return {
      nameFa: companyProfile?.companyName || 'شرکت صنایع آلومینیوم آلوپن',
      nameEn: 'Alupan Aluminum Systems',
      descFa: companyProfile?.desc || 'تولیدکننده انواع در، پنجره و نماهای مدرن آلومینیومی ترمال‌بریک تحت استانداردهای نوین ساختمانی در ایران.',
      descEn: 'Pioneering thermal-break aluminum windows, doors and bespoke structural facade units compliant with international BIM standards.',
      logoUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7cf?auto=format&fit=crop&w=150&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      website: companyProfile?.website || 'https://alupan.com',
      email: companyProfile?.email || 'info@alupan.com',
      phone: companyProfile?.phone || '+98 (21) 8877-4433',
      country: 'IR',
      addressFa: 'تهران، خیابان ولیعصر، برج آفتاب، طبقه ۱۲',
      addressEn: '12th Flr, Aftab Tower, Vali-e-Asr Ave, Tehran',
      twitter: 'https://twitter.com/alupan',
      linkedin: 'https://linkedin.com/company/alupan',
      instagram: 'https://instagram.com/alupan',
      youtube: 'https://youtube.com/alupan',
      pinterest: 'https://pinterest.com/alupan',
      telegram: 'https://t.me/alupan',
      socialLinks: [
        { id: 'soc-1', platform: 'instagram', url: 'https://instagram.com/alupan' },
        { id: 'soc-2', platform: 'linkedin', url: 'https://linkedin.com/company/alupan' },
        { id: 'soc-3', platform: 'youtube', url: 'https://youtube.com/alupan' },
        { id: 'soc-4', platform: 'telegram', url: 'https://t.me/alupan' }
      ],
      promoVideoUrl: 'https://www.aparat.com/v/a1',
      promoVideos: [
        { 
          id: 'vid-1', 
          titleFa: 'ویدیو معرفی خط تولید و کارخانه آلوپن', 
          titleEn: 'Alupan Automated Factory & Production Line', 
          url: 'https://www.aparat.com/v/a1', 
          embedUrl: parseVideoEmbedUrl('https://www.aparat.com/v/a1').embedUrl, 
          type: 'aparat' as const 
        }
      ],
      portfolioPdfName: 'Alupan_Corporate_Catalog_2026.pdf',
      portfolioPdfUrl: 'https://alupan.com/catalog.pdf',
      tier: currentTier,
      verificationDocs: [
        { 
          id: 'doc-gazette', 
          nameFa: 'روزنامه رسمی کشور (آگهی تأسیس یا آخرین تغییرات)', 
          nameEn: 'Official Gazette (Registration or Amendments Notice)', 
          type: 'PDF', 
          status: 'Pending', 
          date: '۱۴۰۵/۰۴/۰۱',
          isGazette: true,
          description: '',
          url: 'https://rrk.ir',
          fileUrl: '',
          fileName: ''
        },
        { 
          id: 'doc-1', 
          nameFa: 'پروانه بهره‌برداری وزارت صمت', 
          nameEn: 'Industrial Operating License', 
          type: 'PDF', 
          status: 'Verified', 
          date: '۱۴۰۴/۰۲/۱۵',
          description: 'پروانه بهره‌برداری صنایع نوین ساختمانی صادر شده توسط صمت البرز.',
          url: 'https://mimt.gov.ir',
          fileUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80',
          fileName: 'MIMT_Industrial_License.pdf'
        },
        { 
          id: 'doc-2', 
          nameFa: 'گواهینامه تایید صلاحیت فنی مرکز تحقیقات مسکن', 
          nameEn: 'BHRC Quality Certification', 
          type: 'PDF', 
          status: 'Verified', 
          date: '۱۴۰۴/۰۶/۱۰',
          description: 'تاییدیه فنی سیستم‌های آلومینیومی دوجداره هافمن آلو-۹۰.',
          url: 'https://bhrc.ac.ir',
          fileUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80',
          fileName: 'BHRC_Technical_Certificate.pdf'
        },
        { 
          id: 'doc-3', 
          nameFa: 'گواهینامه مالیات بر ارزش افزوده سال جاری', 
          nameEn: 'VAT Registration Certificate', 
          type: 'PDF', 
          status: 'Rejected', 
          date: '۱۴۰۵/۰۲/۲۸',
          description: 'گواهی ثبت‌نام موقت مالیاتی دوره‌ای.',
          url: 'https://intamedia.ir',
          fileUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80',
          fileName: 'VAT_Certificate_1404.pdf',
          rejectionReasonFa: 'اعتبار گواهی ارزش افزوده بارگذاری شده منقضی شده است. لطفا آخرین تمدیدیه را تمدید و ارسال کنید.',
          rejectionReasonEn: 'The uploaded VAT certificate has expired. Please upload the latest renewal.'
        }
      ]
    };
  });

  // Verification document state updates
  const [newDocName, setNewDocName] = useState('');
  const [newDocFile, setNewDocFile] = useState<string | null>(null);
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');
  const [newDocFileUrl, setNewDocFileUrl] = useState('');

  // Products / Catalog State
  const mfgId = 'm1';
  const [catalogObjects, setCatalogObjects] = useState<BIMObject[]>(() => {
    const savedCustoms = JSON.parse(localStorage.getItem('iranbimhub_custom_objects_v2') || '[]');
    const seedMfgObjects = BIM_OBJECTS.filter(o => o.manufacturerId === mfgId || o.manufacturerId === 'custom');
    
    // Combine and deduplicate by obj.id to prevent duplicate keys (e.g. obj1, obj2)
    const combined = [...seedMfgObjects, ...savedCustoms];
    const uniqueMap = new Map<string, BIMObject>();
    combined.forEach(o => {
      if (o && o.id) {
        uniqueMap.set(o.id, o);
      }
    });
    const uniqueObjects = Array.from(uniqueMap.values());

    // Set some state fields like status (Approved, In Review, Draft, Rejected)
    return uniqueObjects.map(obj => ({
      ...obj,
      status: (obj.id === 'obj1' || obj.id === 'obj2') ? 'Published' : 'Pending Review',
      views: obj.id === 'obj1' ? 1420 : (obj.id === 'obj2' ? 940 : 12),
      downloads: obj.id === 'obj1' ? 420 : (obj.id === 'obj2' ? 240 : 1)
    })) as any[];
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_custom_objects_v2', JSON.stringify(catalogObjects));
  }, [catalogObjects]);

  // Catalog Filters & Search
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogStatus, setCatalogStatus] = useState('all');

  // Interactive CRM messages (leads)
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('iranbimhub_mfg_leads');
    return saved ? JSON.parse(saved) : [
      {
        id: 'lead-1',
        senderName: isRtl ? 'مهندس سهراب احمدی (شرکت آرک‌تک)' : 'Eng. Sohrab Ahmadi (ArchTech Studio)',
        email: 'ahmadi@archtech.ir',
        phone: '+98 912 345 6789',
        message: isRtl ? 'با سلام، ما در حال کار روی مدل فاز دو پروژه مجتمع تجاری اطلس هستیم. کاتالوگ دقیق و کات‌شیت فیزیکی متریال نما را نیاز داریم. امکان ارسال نمونه سمپل فیزیکی وجود دارد؟' : 'We are modeling the Atlas Plaza commercial phase 2 facades. We need printed cutsheets and architectural frame finishes samples.',
        productName: isRtl ? 'پنجره آلومینیومی آلو-۹۰' : 'Thermal Window Alu-90',
        date: '۱۴۰۵/۰۴/۰۹',
        tag: 'Sample Request',
        read: false,
        replies: []
      },
      {
        id: 'lead-2',
        senderName: isRtl ? 'مهندس آرش علوی (سازه پایدار)' : 'Eng. Arash Alavi (Sazeh Paydar)',
        email: 'alavi@sazehpaydar.ir',
        phone: '+98 935 999 8811',
        message: isRtl ? 'آیا کانکتورهای تاسیساتی پکیج دیجیتال پارما با استانداردهای لوله‌کشی رویت ۲۰۲۵ همخوانی کامل دارد؟' : 'Are Parma 24 condensing boiler MEP connectors certified for parametric automatic sizing in Revit 2025?',
        productName: isRtl ? 'پکیج دیواری چگالشی دیجیتال پارما ۲۴' : 'Condensing Boiler Parma 24',
        date: '۱۴۰۵/۰۴/۰۲',
        tag: 'Technical Quote',
        read: true,
        replies: [{ sender: 'mfg', text: isRtl ? 'بله، مهندس گرامی. کاملاً با پایپینگ استاندارد مپ شده است.' : 'Yes, Arash. Connectors are fully mapped to native piping tables.' }]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_mfg_leads', JSON.stringify(leads));
  }, [leads]);

  const [objectRequests, setObjectRequests] = useState(() => {
    const saved = localStorage.getItem('iranbimhub_object_requests');
    if (saved) return JSON.parse(saved);
    const defaultSeed = [
      {
        id: 'req-seed-1',
        manufacturerId: 'm1',
        senderName: isRtl ? 'مهندس الناز کریمی (مهندسین مشاور اثر)' : 'Eng. Elnaz Karimi (Asar Consultants)',
        email: 'karimi@asar.ir',
        phone: '+98 912 111 2233',
        objectName: isRtl ? 'پنجره دو جداره کشویی لیفت‌انداسلاید سری ۱۲۰' : 'Lift-and-Slide Sliding Window 120 Series',
        category: 'doors_windows',
        format: 'Revit',
        priority: 'High',
        description: isRtl ? 'با سلام، ما در حال تکمیل نقشه فاز دو پروژه هتل شیراز هستیم و به فمیلی پارامتریک پنجره‌های کشویی بزرگ لیفت اند اسلاید با مقادیر هیت‌ران ترنسفر دقیق نیاز داریم.' : 'We are developing Shiraz Hotel phase 2 and urgently need large lift-and-slide sliding windows with verified thermal transmission coefficients.',
        date: '۱۴۰۵/۰۴/۱۵',
        status: 'Pending'
      },
      {
        id: 'req-seed-2',
        manufacturerId: 'm1',
        senderName: isRtl ? 'مهندس رادین کیان (معماری موج)' : 'Eng. Radin Kian (Wave Architecture)',
        email: 'kian@wavearc.com',
        phone: '+98 930 444 5566',
        objectName: isRtl ? 'لوورهای آلومینیومی کنترل نور خورشید سری شیدر متحرک' : 'Dynamic Sun-Control Aluminum Louvre Shader',
        category: 'facade_structures',
        format: 'IFC',
        priority: 'Medium',
        description: isRtl ? 'فمیلی لوورهای دوار با قابلیت کنترل زوایه سایه‌بان به صورت پارامتریک در محیط رویت.' : 'Parametric rotating louvre shader with adaptive angle controls for daylighting calculations.',
        date: '۱۴۰۵/۰۴/۱۰',
        status: 'In Progress'
      }
    ];
    localStorage.setItem('iranbimhub_object_requests', JSON.stringify(defaultSeed));
    return defaultSeed;
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_object_requests', JSON.stringify(objectRequests));
  }, [objectRequests]);

  useEffect(() => {
    const handleRequestSync = () => {
      const saved = localStorage.getItem('iranbimhub_object_requests');
      if (saved) {
        setObjectRequests(JSON.parse(saved));
      }
    };
    window.addEventListener('iranbimhub_object_request_submitted', handleRequestSync);
    return () => window.removeEventListener('iranbimhub_object_request_submitted', handleRequestSync);
  }, []);

  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [crmReplyText, setCrmReplyText] = useState('');

  // Object Requests Filtering State
  const [selectedRequestFilterStatus, setSelectedRequestFilterStatus] = useState<string>('all');
  const [selectedRequestFilterPriority, setSelectedRequestFilterPriority] = useState<string>('all');
  const [activeObjectRequestId, setActiveObjectRequestId] = useState<string | null>(null);

  // Support tickets to IranBIMhub
  const [supportTickets, setSupportTickets] = useState(() => {
    const saved = localStorage.getItem('iranbimhub_mfg_support_tickets');
    return saved ? JSON.parse(saved) : [
      {
        id: 't-1',
        subject: isRtl ? 'رفع تداخل پارامتر ضخامت قاب در خروجی IFC' : 'Frame thickness mapping issue in IFC export',
        status: 'Open',
        date: '۱۴۰۵/۰۳/۲۸',
        chat: [
          { sender: 'mfg', text: isRtl ? 'سلام، پارامتر ضخامت قاب پنجره در فایل IFC استخراج شده خالی نشان داده می‌شود.' : 'Hello, the frame thickness parameter is lost on IFC export.' },
          { sender: 'supervisor', text: isRtl ? 'سلام همکار گرامی، تیم کنترل کیفیت بیم در حال بررسی تعریف Shared Parameters نما است. تا فردا برطرف می‌شود.' : 'Hello, our QA team is checking the Shared Parameters table. This will be updated tomorrow.' }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_mfg_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  const [newSupportSubject, setNewSupportSubject] = useState('');
  const [newSupportMsg, setNewSupportMsg] = useState('');

  // Brand standards Checklist with detailed properties
  const [standards, setStandards] = useState(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_mfg_standards');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { 
        id: 'std-1', 
        name: 'ISO 9001 (Quality Management)', 
        code: 'ISO-9001', 
        country: 'International', 
        verified: true,
        description: 'استاندارد جهانی مدیریت سیستم‌های کیفیت و ارزیابی فرایندها.',
        issueDate: '۱۴۰۲/۰۶/۱۵',
        validityDate: '۱۴۰۵/۰۶/۱۵',
        verificationUrl: 'https://www.iso.org',
        fileName: 'ISO9001_Alupan.pdf',
        fileUrl: '#'
      },
      { 
        id: 'std-2', 
        name: 'CE Mark (European Conformity)', 
        code: 'CE-AEC', 
        country: 'Europe', 
        verified: true,
        description: 'نشان انطباق محصول با استانداردهای بهداشت، ایمنی و حفاظت محیط زیست اروپا.',
        issueDate: '۱۴۰۳/۰۴/۱۰',
        validityDate: '۱۴۰۶/۰۴/۱۰',
        verificationUrl: 'https://ec.europa.eu',
        fileName: 'CE_Alupan_Facade.pdf',
        fileUrl: '#'
      },
      { 
        id: 'std-3', 
        name: 'نشان استاندارد ملی ایران (INSO)', 
        code: 'INSO-7090', 
        country: 'Iran', 
        verified: true,
        description: 'نشان استاندارد ملی اجباری برای در و پنجره‌های آلومینیومی ساختمان.',
        issueDate: '۱۴۰۱/۰۹/۲۰',
        validityDate: '۱۴۰۴/۰۹/۲۰',
        verificationUrl: 'https://isiri.gov.ir',
        fileName: 'INSO_7090_License.pdf',
        fileUrl: '#'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_mfg_standards', JSON.stringify(standards));
  }, [standards]);

  // Brand Portfolio & Awards Case Studies with full details
  const [portfolioProjects, setPortfolioProjects] = useState(() => {
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
        description: 'کسب عنوان برترین نماساز با محصول سری آلو-۹۰ در مسابقات سالانه.',
        fileName: 'Facade_Award_Certificate_1403.pdf',
        fileUrl: '#'
      },
      { 
        id: 'p-2', 
        titleFa: 'تندیس زرین برند محبوب سال در صنعت در و پنجره', 
        titleEn: 'Golden Statue of Popular Brand of the Year', 
        architect: 'صنایع ساختمانی ایران', 
        location: 'تهران، مرکز همایش‌ها', 
        year: '۱۴۰۴',
        description: 'انتخاب مردمی و مهندسی برند برتر تولیدکننده پروفیل اختصاصی.',
        fileName: 'Popular_Brand_Statue_1404.pdf',
        fileUrl: '#'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_mfg_awards', JSON.stringify(portfolioProjects));
  }, [portfolioProjects]);

  // Brand Projects
  const [projects, setProjects] = useState(() => {
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
        fileName: 'Armitage_Tower_SpecSheet.pdf',
        fileUrl: '#'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_mfg_projects', JSON.stringify(projects));
  }, [projects]);

  // Form states for Standards
  const [newStdName, setNewStdName] = useState('');
  const [newStdCode, setNewStdCode] = useState('');
  const [newStdCountry, setNewStdCountry] = useState('');
  const [newStdUrl, setNewStdUrl] = useState('');
  const [newStdDesc, setNewStdDesc] = useState('');
  const [newStdIssueDate, setNewStdIssueDate] = useState('');
  const [newStdValidityDate, setNewStdValidityDate] = useState('');
  const [newStdFileName, setNewStdFileName] = useState('');
  const [newStdFileUrl, setNewStdFileUrl] = useState('');
  const [editingStdId, setEditingStdId] = useState<string | null>(null);

  // Form states for Awards
  const [newAwardTitle, setNewAwardTitle] = useState('');
  const [newAwardTitleEn, setNewAwardTitleEn] = useState('');
  const [newAwardArch, setNewAwardArch] = useState('');
  const [newAwardLocation, setNewAwardLocation] = useState('');
  const [newAwardYear, setNewAwardYear] = useState('');
  const [newAwardDesc, setNewAwardDesc] = useState('');
  const [newAwardFileName, setNewAwardFileName] = useState('');
  const [newAwardFileUrl, setNewAwardFileUrl] = useState('');
  const [editingAwardId, setEditingAwardId] = useState<string | null>(null);

  // Form states for Projects
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjTitleEn, setNewProjTitleEn] = useState('');
  const [newProjArch, setNewProjArch] = useState('');
  const [newProjLocation, setNewProjLocation] = useState('');
  const [newProjYear, setNewProjYear] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjFileName, setNewProjFileName] = useState('');
  const [newProjFileUrl, setNewProjFileUrl] = useState('');
  const [editingProjId, setEditingProjId] = useState<string | null>(null);

  // Custom Delete Confirmation Dialog Modal State
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Technical Bookshelf & Catalogs State
  const [catalogs, setCatalogs] = useState(() => {
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

  useEffect(() => {
    localStorage.setItem('iranbimhub_mfg_catalogs', JSON.stringify(catalogs));
  }, [catalogs]);

  // Form states for Catalogs
  const [newCatTitleFa, setNewCatTitleFa] = useState('');
  const [newCatTitleEn, setNewCatTitleEn] = useState('');
  const [newCatCategory, setNewCatCategory] = useState('');
  const [newCatFileSize, setNewCatFileSize] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatFileName, setNewCatFileName] = useState('');
  const [newCatFileUrl, setNewCatFileUrl] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // ADD PRODUCT WIZARD STATE
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [agreePublishTerms, setAgreePublishTerms] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('doors_windows');
  const [dragActive, setDragActive] = useState(false);
  const [bimFileName, setBimFileName] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState('');

  const [wizardForm, setWizardForm] = useState({
    titleFa: '',
    titleEn: '',
    descFa: '',
    descEn: '',
    subcategory: '',
    lod: 'LOD 350' as const,
    formats: ['Revit', 'IFC'],
    revitVersions: ['2024', '2025'],
    fileSize: '15.6 MB',
    priceType: 'Free' as const,
    specs: {
      material: 'Aluminum',
      uValue: '1.4 W/m²K',
      soundReduction: '42 dB',
      glassThickness: '24 mm'
    }
  });

  // Simulated Analytics views trend data (last 7 periods)
  const analyticsTimeRange = [
    { label: isRtl ? 'فروردین' : 'Apr', views: 820, downloads: 210 },
    { label: isRtl ? 'اردیبهشت' : 'May', views: 1100, downloads: 350 },
    { label: isRtl ? 'خرداد' : 'Jun', views: 1350, downloads: 410 },
    { label: isRtl ? 'تیر' : 'Jul', views: 1420, downloads: 420 }
  ];

  // Predictive indicator - Next 30 days aggregate projection
  const predictedForecast = {
    viewsProj: 1680,
    downloadsProj: 490,
    growthPercent: '+16%'
  };

  // Aggregate stats
  const totalViews = useMemo(() => catalogObjects.reduce((acc, o) => acc + (o as any).views, 0), [catalogObjects]);
  const totalDownloads = useMemo(() => catalogObjects.reduce((acc, o) => acc + (o as any).downloads, 0), [catalogObjects]);
  const pendingApprovalsCount = useMemo(() => catalogObjects.filter(o => (o as any).status === 'Pending Review').length, [catalogObjects]);
  const unansweredLeadsCount = useMemo(() => leads.filter(l => !l.read).length, [leads]);

  // Profile Completeness Checklist
  const isLogoCompleted = useMemo(() => {
    return !!(brandInfo.logoUrl && !brandInfo.logoUrl.includes('unsplash.com/photo-1516876437184') && brandInfo.logoUrl.length > 0);
  }, [brandInfo.logoUrl]);

  const isDescCompleted = useMemo(() => {
    return !!(brandInfo.descFa && brandInfo.descFa.length > 20 && !brandInfo.descFa.includes('تولیدکننده انواع در، پنجره'));
  }, [brandInfo.descFa]);

  const isDocsCompleted = useMemo(() => {
    return !!(brandInfo.verificationDocs && brandInfo.verificationDocs.some(doc => doc.status === 'Verified' || doc.fileUrl));
  }, [brandInfo.verificationDocs]);

  const isProductCompleted = useMemo(() => {
    return catalogObjects.length > 2;
  }, [catalogObjects]);

  const progressPercent = useMemo(() => {
    const completedCount = 
      (isLogoCompleted ? 1 : 0) + 
      (isDescCompleted ? 1 : 0) + 
      (isDocsCompleted ? 1 : 0) + 
      (isProductCompleted ? 1 : 0);
    return Math.round((completedCount / 4) * 100);
  }, [isLogoCompleted, isDescCompleted, isDocsCompleted, isProductCompleted]);

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setBimFileName(e.dataTransfer.files[0].name);
    }
  };

  // Support Ticket Submit
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupportSubject.trim() || !newSupportMsg.trim()) return;

    const newTicket = {
      id: `t-${Math.random().toString(36).substring(2, 7)}`,
      subject: newSupportSubject,
      status: 'Open',
      date: isRtl ? '۱۴۰۵/۰۴/۰۱' : '2026-07-01',
      chat: [
        { sender: 'mfg', text: newSupportMsg }
      ]
    };

    setSupportTickets(prev => [...prev, newTicket]);
    setNewSupportSubject('');
    setNewSupportMsg('');
    alert(isRtl ? 'تیکت شما با موفقیت ارسال شد.' : 'Support ticket submitted successfully.');
  };

  // Add Product Wizard handler
  const handlePublishNewProduct = () => {
    if (!agreePublishTerms) {
      alert(isRtl ? 'لطفاً ابتدا تایید نمایید که مالکیت فایل کاتالوگ متعلق به برند شماست و با شرایط استفاده موافق هستید.' : 'Please confirm that you own the catalog files and agree to the Terms of Service.');
      return;
    }
    const newProduct: BIMObject = {
      id: `mfg-product-${Math.random().toString(36).substring(2, 7)}`,
      titleFa: wizardForm.titleFa || 'پنجره جدید آلومینیومی',
      titleEn: wizardForm.titleEn || 'New Architectural Aluminum Unit',
      manufacturerId: mfgId,
      category: selectedCategory,
      subcategory: wizardForm.subcategory || 'sliding_windows',
      tagsFa: [wizardForm.titleFa, 'ترمال‌بریک', 'آلومینیوم'],
      tagsEn: [wizardForm.titleEn, 'BIM', 'Facade'],
      formats: wizardForm.formats,
      revitVersions: wizardForm.revitVersions,
      lod: wizardForm.lod,
      priceType: wizardForm.priceType as any,
      certification: ['INSO', 'CE'],
      isImported: false,
      hasCutsheet: !!pdfFileName,
      hasSample: true,
      fileSize: wizardForm.fileSize,
      downloadCount: 0,
      rating: 5.0,
      imageUrl: previewPhotoUrl || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      descriptionFa: wizardForm.descFa || 'توضیحات فنی خانواده هوشمند نما و درگاه‌های مدرن',
      descriptionEn: wizardForm.descEn || 'Detailed technical specs of parametric BIM object',
      specs: wizardForm.specs
    };

    const enhancedProduct = {
      ...newProduct,
      status: 'Pending Review',
      views: 0,
      downloads: 0
    };

    setCatalogObjects(prev => [enhancedProduct as any, ...prev]);
    onPublishNewObject(newProduct);
    setWizardStep(3);
  };

  // CRM message reply
  const handleSendCrmReply = (leadId: string) => {
    if (!crmReplyText.trim()) return;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          read: true,
          replies: [...l.replies, { sender: 'mfg', text: crmReplyText }]
        };
      }
      return l;
    }));

    setCrmReplyText('');
    alert(isRtl ? 'پاسخ به معمار با موفقیت ارسال گردید.' : 'Reply sent to architect.');
  };

  const handleVerifyDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc = {
      id: `doc-${Math.random().toString(36).substring(2, 6)}`,
      nameFa: newDocName,
      nameEn: 'Supplementary Verification File',
      type: 'PDF',
      status: 'Pending' as const,
      date: isRtl ? '۱۴۰۵/۰۴/۰۱' : '2026-07-01',
      url: newDocUrl || undefined,
      description: newDocDesc || undefined,
      fileUrl: newDocFileUrl || undefined,
      fileName: newDocFileName || undefined
    };

    setBrandInfo(prev => ({
      ...prev,
      verificationDocs: [...prev.verificationDocs, newDoc]
    }));

    setNewDocName('');
    setNewDocUrl('');
    setNewDocDesc('');
    setNewDocFileName('');
    setNewDocFileUrl('');
    alert(isRtl ? 'سند رسمی جهت راستی‌آزمایی بارگذاری شد.' : 'Verification documentation uploaded successfully.');
  };

  const handleUpdateDocumentDetails = (docId: string, updates: Partial<any>) => {
    setBrandInfo(prev => ({
      ...prev,
      verificationDocs: prev.verificationDocs.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            ...updates,
            status: 'Pending' as const
          };
        }
        return doc;
      })
    }));
  };

  // Standards CRUD Handlers
  const handleAddStandard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName.trim()) return;

    const newStd = {
      id: `std-${Math.random().toString(36).substring(2, 6)}`,
      name: newStdName,
      code: newStdCode || 'N/A',
      country: newStdCountry || 'Iran',
      verified: false,
      description: newStdDesc,
      issueDate: newStdIssueDate,
      validityDate: newStdValidityDate,
      verificationUrl: newStdUrl,
      fileName: newStdFileName,
      fileUrl: newStdFileUrl || '#'
    };

    setStandards(prev => {
      const next = [...prev, newStd];
      try {
        localStorage.setItem('iranbimhub_mfg_standards', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    setNewStdName('');
    setNewStdCode('');
    setNewStdCountry('');
    setNewStdUrl('');
    setNewStdDesc('');
    setNewStdIssueDate('');
    setNewStdValidityDate('');
    setNewStdFileName('');
    setNewStdFileUrl('');
    alert(isRtl ? 'استاندارد جدید با موفقیت ثبت شد و در وضعیت بررسی قرار گرفت.' : 'New standard added successfully and is under review.');
  };

  const handleEditStandard = (id: string, updatedFields: Partial<typeof standards[0]>) => {
    setStandards(prev => {
      const next = prev.map(std => std.id === id ? { ...std, ...updatedFields } : std);
      try {
        localStorage.setItem('iranbimhub_mfg_standards', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Unified delete helper ensuring state consistency with prev => prev.filter(item => item.id !== targetId)
  const deleteEntry = <T extends { id: string }>(
    targetId: string,
    setter: (updater: (prev: T[]) => T[]) => void,
    onAfterDelete?: (updatedList: T[]) => void
  ) => {
    console.log(`[deleteEntry] Triggered deletion for target ID: "${targetId}"`);
    setter(prev => {
      const updatedList = prev.filter(item => item.id !== targetId);
      if (onAfterDelete) {
        onAfterDelete(updatedList);
      }
      return updatedList;
    });
  };

  const handleDeleteStandard = (id: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      title: isRtl ? 'حذف دائمی استاندارد' : 'Delete Standard',
      message: isRtl 
        ? 'آیا از حذف دائمی این استاندارد مطمئن هستید؟ این عمل قابل بازگشت نیست.' 
        : 'Are you sure you want to permanently delete this standard? This action cannot be undone.',
      onConfirm: () => {
        setStandards(prev => prev.filter(item => item.id !== id));
        setEditingStdId(null);
        alert(isRtl ? 'استاندارد مورد نظر با موفقیت حذف گردید.' : 'Standard deleted successfully.');
        setDeleteConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteAward = (id: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      title: isRtl ? 'حذف دائمی افتخار' : 'Delete Award/Honor',
      message: isRtl 
        ? 'آیا از حذف دائمی این مورد مطمئن هستید؟ این عمل قابل بازگشت نیست.' 
        : 'Are you sure you want to permanently delete this item? This action cannot be undone.',
      onConfirm: () => {
        setPortfolioProjects(prev => prev.filter(item => item.id !== id));
        setEditingAwardId(null);
        alert(isRtl ? 'افتخار مورد نظر با موفقیت حذف گردید.' : 'Award/Honor deleted successfully.');
        setDeleteConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteDoc = (docId: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      title: isRtl ? 'حذف دائمی مدرک' : 'Delete Document',
      message: isRtl 
        ? 'آیا از حذف دائمی این مدرک مطمئن هستید؟ این عمل قابل بازگشت نیست.' 
        : 'Are you sure you want to permanently delete this credential document? This action cannot be undone.',
      onConfirm: () => {
        setBrandInfo(prev => {
          const nextDocs = (prev.verificationDocs || []).filter(d => d.id !== docId);
          return {
            ...prev,
            verificationDocs: nextDocs
          };
        });
        alert(isRtl ? 'مدرک با موفقیت حذف گردید. برای ثبت نهایی روی دکمه ذخیره کلیک کنید.' : 'Document deleted successfully. Click Save to apply.');
        setDeleteConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleEditAward = (id: string, updatedFields: Partial<typeof portfolioProjects[0]>) => {
    setPortfolioProjects(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...updatedFields } : a);
      try {
        localStorage.setItem('iranbimhub_mfg_awards', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleAddAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAwardTitle.trim()) return;

    const newAward = {
      id: `p-${Math.random().toString(36).substring(2, 6)}`,
      titleFa: newAwardTitle,
      titleEn: newAwardTitleEn || newAwardTitle,
      architect: newAwardArch || 'N/A',
      location: newAwardLocation || 'N/A',
      year: newAwardYear || '1403',
      description: newAwardDesc,
      fileName: newAwardFileName,
      fileUrl: newAwardFileUrl || '#'
    };

    setPortfolioProjects(prev => {
      const next = [...prev, newAward];
      try {
        localStorage.setItem('iranbimhub_mfg_awards', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    setNewAwardTitle('');
    setNewAwardTitleEn('');
    setNewAwardArch('');
    setNewAwardLocation('');
    setNewAwardYear('');
    setNewAwardDesc('');
    setNewAwardFileName('');
    setNewAwardFileUrl('');
    alert(isRtl ? 'افتخار جدید با موفقیت ثبت شد.' : 'New award added successfully.');
  };

  const handleDeleteProject = (id: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      title: isRtl ? 'حذف دائمی پروژه' : 'Delete Project',
      message: isRtl 
        ? 'آیا از حذف دائمی این مورد مطمئن هستید؟ این عمل قابل بازگشت نیست.' 
        : 'Are you sure you want to permanently delete this item? This action cannot be undone.',
      onConfirm: () => {
        setProjects(prev => prev.filter(item => item.id !== id));
        setEditingProjId(null);
        alert(isRtl ? 'پروژه مورد نظر با موفقیت حذف گردید.' : 'Project deleted successfully.');
        setDeleteConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleEditProject = (id: string, updatedFields: Partial<typeof projects[0]>) => {
    setProjects(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updatedFields } : p);
      try {
        localStorage.setItem('iranbimhub_mfg_projects', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    const newProj = {
      id: `proj-${Math.random().toString(36).substring(2, 6)}`,
      titleFa: newProjTitle,
      titleEn: newProjTitleEn || newProjTitle,
      architect: newProjArch || 'N/A',
      location: newProjLocation || 'N/A',
      year: newProjYear || '1403',
      description: newProjDesc,
      fileName: newProjFileName,
      fileUrl: newProjFileUrl || '#'
    };

    setProjects(prev => {
      const next = [...prev, newProj];
      try {
        localStorage.setItem('iranbimhub_mfg_projects', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    setNewProjTitle('');
    setNewProjTitleEn('');
    setNewProjArch('');
    setNewProjLocation('');
    setNewProjYear('');
    setNewProjDesc('');
    setNewProjFileName('');
    setNewProjFileUrl('');
    alert(isRtl ? 'پروژه جدید با موفقیت ثبت گردید.' : 'New project added successfully.');
  };

  const handleDeleteCatalog = (id: string) => {
    if (window.confirm(isRtl ? 'آیا از حذف دائمی این مورد مطمئن هستید؟ این عمل قابل بازگشت نیست.' : 'Are you sure you want to permanently delete this item? This action cannot be undone.')) {
      setCatalogs(prev => {
        const next = prev.filter(cat => cat.id !== id);
        try {
          localStorage.setItem('iranbimhub_mfg_catalogs', JSON.stringify(next));
          window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
        } catch (e) {
          console.error("Failed to save catalogs after delete:", e);
        }
        return next;
      });
      if (editingCatId === id) {
        setEditingCatId(null);
      }
    }
  };

  const handleEditCatalog = (id: string, updatedFields: Partial<typeof catalogs[0]>) => {
    setCatalogs(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updatedFields } : c);
      try {
        localStorage.setItem('iranbimhub_mfg_catalogs', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleAddCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitleFa.trim()) return;

    const newCat = {
      id: `cat-${Math.random().toString(36).substring(2, 6)}`,
      titleFa: newCatTitleFa,
      titleEn: newCatTitleEn || newCatTitleFa,
      category: newCatCategory || (isRtl ? 'راهنمای فنی' : 'Technical Guide'),
      fileSize: newCatFileSize || '5.0 MB',
      description: newCatDesc,
      fileName: newCatFileName || 'Catalog_Document.pdf',
      fileUrl: newCatFileUrl || '#'
    };

    setCatalogs(prev => {
      const next = [...prev, newCat];
      try {
        localStorage.setItem('iranbimhub_mfg_catalogs', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    setNewCatTitleFa('');
    setNewCatTitleEn('');
    setNewCatCategory('');
    setNewCatFileSize('');
    setNewCatDesc('');
    setNewCatFileName('');
    setNewCatFileUrl('');
    alert(isRtl ? 'کاتالوگ / سند فنی جدید با موفقیت اضافه شد و به پروفایل عمومی برند متصل گردید.' : 'Catalog document added successfully and linked to public brand profile.');
  };

  const handleSaveBrandInfo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(brandInfo));
      localStorage.setItem('iranbimhub_mfg_profile_m1', JSON.stringify(brandInfo));
      window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      alert(isRtl 
        ? 'اطلاعات برند با موفقیت ذخیره شد و در صفحه عمومی برند به‌روزرسانی گردید.' 
        : 'Brand profile details saved successfully and updated on the public page.'
      );
    } catch (err) {
      console.error("Failed to save brand profile:", err);
    }
  };

  const SOCIAL_PLATFORM_OPTIONS = [
    { id: 'instagram', labelFa: 'اینستاگرام (Instagram)', labelEn: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/alupan' },
    { id: 'linkedin', labelFa: 'لینکدین (LinkedIn)', labelEn: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/alupan' },
    { id: 'youtube', labelFa: 'یوتیوب (YouTube)', labelEn: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/alupan' },
    { id: 'telegram', labelFa: 'تلگرام (Telegram)', labelEn: 'Telegram', icon: Send, placeholder: 'https://t.me/alupan' },
    { id: 'twitter', labelFa: 'توئیتر / X', labelEn: 'X / Twitter', icon: Twitter, placeholder: 'https://x.com/alupan' },
    { id: 'pinterest', labelFa: 'پینترست (Pinterest)', labelEn: 'Pinterest', icon: Globe, placeholder: 'https://pinterest.com/alupan' },
    { id: 'aparat', labelFa: 'آپارات (Aparat)', labelEn: 'Aparat', icon: Video, placeholder: 'https://aparat.com/alupan' },
    { id: 'whatsapp', labelFa: 'واتس‌اپ (WhatsApp)', labelEn: 'WhatsApp', icon: MessageSquare, placeholder: 'https://wa.me/989123456789' },
    { id: 'website', labelFa: 'وب‌سایت رسمی', labelEn: 'Official Website', icon: Globe, placeholder: 'https://alupan.com' }
  ];

  const handleAddSocialLinkRow = () => {
    setBrandInfo(prev => {
      const existingPlatforms = (prev.socialLinks || []).map((r: any) => r.platform);
      const available = SOCIAL_PLATFORM_OPTIONS.find(p => !existingPlatforms.includes(p.id));
      if (!available) return prev;
      const newRow = {
        id: `soc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        platform: available.id,
        url: ''
      };
      const nextSocialLinks = [...(prev.socialLinks || []), newRow];
      return {
        ...prev,
        socialLinks: nextSocialLinks,
        [available.id]: ''
      };
    });
  };

  const handleUpdateSocialLinkRow = (rowId: string, updates: { platform?: string; url?: string }) => {
    setBrandInfo(prev => {
      const nextSocialLinks = (prev.socialLinks || []).map((r: any) => {
        if (r.id === rowId) {
          return { ...r, ...updates };
        }
        return r;
      });

      const keyValSync: Record<string, string> = {};
      nextSocialLinks.forEach((row: any) => {
        keyValSync[row.platform] = row.url;
      });

      return {
        ...prev,
        ...keyValSync,
        socialLinks: nextSocialLinks
      };
    });
  };

  const handleDeleteSocialLinkRow = (rowId: string) => {
    setBrandInfo(prev => {
      const targetRow = (prev.socialLinks || []).find((r: any) => r.id === rowId);
      const nextSocialLinks = (prev.socialLinks || []).filter((r: any) => r.id !== rowId);
      const updated = {
        ...prev,
        socialLinks: nextSocialLinks
      };
      if (targetRow && targetRow.platform) {
        updated[targetRow.platform] = '';
      }
      return updated;
    });
  };

  const handleAddPromoVideoRow = () => {
    setBrandInfo(prev => {
      const currentVideos = prev.promoVideos || [];
      if (currentVideos.length >= 3) {
        alert(isRtl ? 'حداکثر می‌توانید تا ۳ ویدیو اضافه نمایید.' : 'Maximum 3 promo videos allowed.');
        return prev;
      }
      const newVideo = {
        id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        titleFa: `ویدیو معرفی شماره ${currentVideos.length + 1}`,
        titleEn: `Presentation Video ${currentVideos.length + 1}`,
        url: '',
        embedUrl: '',
        type: 'aparat' as const
      };
      return {
        ...prev,
        promoVideos: [...currentVideos, newVideo]
      };
    });
  };

  const handleUpdatePromoVideoRow = (vId: string, updates: { titleFa?: string; titleEn?: string; url?: string }) => {
    setBrandInfo(prev => {
      const nextVideos = (prev.promoVideos || []).map((v: any) => {
        if (v.id === vId) {
          const nextUrl = updates.url !== undefined ? updates.url : v.url;
          const parsed = parseVideoEmbedUrl(nextUrl);
          return {
            ...v,
            ...updates,
            embedUrl: parsed.embedUrl,
            type: parsed.type === 'invalid' ? 'aparat' : parsed.type
          };
        }
        return v;
      });

      const firstVidUrl = nextVideos[0]?.url || '';
      return {
        ...prev,
        promoVideoUrl: firstVidUrl,
        promoVideos: nextVideos
      };
    });
  };

  const handleDeletePromoVideoRow = (vId: string) => {
    setBrandInfo(prev => {
      const nextVideos = (prev.promoVideos || []).filter((v: any) => v.id !== vId);
      return {
        ...prev,
        promoVideoUrl: nextVideos[0]?.url || '',
        promoVideos: nextVideos
      };
    });
  };

  const handleMovePromoVideo = (index: number, direction: 'up' | 'down') => {
    setBrandInfo(prev => {
      const current = [...(prev.promoVideos || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;

      const temp = current[index];
      current[index] = current[targetIndex];
      current[targetIndex] = temp;

      return {
        ...prev,
        promoVideoUrl: current[0]?.url || '',
        promoVideos: current
      };
    });
  };

  const handleSetPromoVideoPriority = (vId: string, targetPriorityIndex: number) => {
    setBrandInfo(prev => {
      const current = [...(prev.promoVideos || [])];
      const currentIndex = current.findIndex((v: any) => v.id === vId);
      if (currentIndex === -1 || targetPriorityIndex < 0 || targetPriorityIndex >= current.length) return prev;

      const [item] = current.splice(currentIndex, 1);
      current.splice(targetPriorityIndex, 0, item);

      return {
        ...prev,
        promoVideoUrl: current[0]?.url || '',
        promoVideos: current
      };
    });
  };

  const handleSendDocComment = (docId: string) => {
    const inputEl = document.getElementById(`comment-input-${docId}`) as HTMLInputElement;
    if (!inputEl || !inputEl.value.trim()) return;
    const text = inputEl.value.trim();
    inputEl.value = '';

    const newComment = {
      id: `c-${Date.now()}`,
      sender: 'Manufacturer' as const,
      senderName: brandInfo.nameFa || 'کارخانه',
      text,
      date: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setBrandInfo(prev => {
      const nextDocs = prev.verificationDocs.map((d: any) => {
        if (d.id === docId) {
          return {
            ...d,
            comments: [...(d.comments || []), newComment]
          };
        }
        return d;
      });
      const next = { ...prev, verificationDocs: nextDocs };
      try {
        localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(next));
        localStorage.setItem('iranbimhub_mfg_profile_m1', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };



  // Filter products catalog
  const filteredCatalog = useMemo(() => {
    return catalogObjects.filter(o => {
      const title = isRtl ? o.titleFa : o.titleEn;
      const matchesSearch = title.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchesStatus = catalogStatus === 'all' || (o as any).status === catalogStatus;
      return matchesSearch && matchesStatus;
    });
  }, [catalogObjects, catalogSearch, catalogStatus, isRtl]);

  // Export statistics report handler
  const handleExportCSVReport = () => {
    let csv = "data:text/csv;charset=utf-8,";
    csv += "Product,Views,Downloads,Status\n";
    catalogObjects.forEach(o => {
      csv += `"${isRtl ? o.titleFa : o.titleEn}",${(o as any).views},${(o as any).downloads},"${(o as any).status}"\n`;
    });
    const encoded = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", "IranBIMhub_Mfg_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col md:flex-row font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpenMobile(true)}
            className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xs font-bold text-gray-800 dark:text-white">
            {isRtl ? 'پنل کارفرمایی آلوپن' : 'Alupan B2B Admin'}
          </span>
        </div>
        <span className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
          {brandInfo.tier}
        </span>
      </div>

      {/* Slide-over Mobile Navigation Drawer */}
      {isSidebarOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={() => setIsSidebarOpenMobile(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative w-72 h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-10 p-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-5">
              <div className="flex items-center gap-3">
                <img src={brandInfo.logoUrl} alt="Logo" className="w-9 h-9 rounded object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white">{isRtl ? brandInfo.nameFa : brandInfo.nameEn}</h4>
                  <p className="text-[9px] text-gray-400">{isRtl ? 'پنل مدیریتی کارخانجات' : 'Enterprise Provider Node'}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpenMobile(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav List */}
            <div className="flex-1 overflow-y-auto space-y-1">
              <MfgSidebarNavList 
                activeTab={activeTab} 
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'profile') setProfileSubTab('info');
                  if (tab === 'requests') setRequestsSubTab('leads');
                  setIsSidebarOpenMobile(false);
                }} 
                isRtl={isRtl}
                unansweredLeadsCount={unansweredLeadsCount}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Left-hand Sidebar (collapsible) */}
      <div className={`hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-l border-gray-100 dark:border-gray-800 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <img src={brandInfo.logoUrl} alt="logo" className="w-7 h-7 rounded object-cover" />
              <span className="font-black text-xs text-gray-800 dark:text-white uppercase tracking-wider">
                {isRtl ? 'مدیریت برند' : 'Brand Admin'}
              </span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg cursor-pointer mx-auto"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Brand visual widget for desktop */}
        {!isSidebarCollapsed && (
          <div className="p-4 mx-3 my-4 bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-800/50 rounded-xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">{isRtl ? 'برند احراز هویت شده' : 'Verified Brand Node'}</span>
            </div>
            
            <div className="text-xs">
              <span className="block font-bold text-gray-800 dark:text-white truncate">{isRtl ? brandInfo.nameFa : brandInfo.nameEn}</span>
              <span className="text-[9.5px] text-gray-400 block mt-0.5">{brandInfo.website}</span>
            </div>

            <div className="flex justify-between items-center text-[10px] pt-2 border-t border-gray-200/50 dark:border-gray-800">
              <span className="text-gray-400">{isRtl ? 'سطح کاربری:' : 'Tier:'}</span>
              <span className="text-emerald-500 font-black tracking-wide uppercase">{brandInfo.tier}</span>
            </div>
          </div>
        )}

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <MfgSidebarNavList 
            activeTab={activeTab} 
            onSelectTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'profile') setProfileSubTab('info');
              if (tab === 'requests') setRequestsSubTab('leads');
            }} 
            isRtl={isRtl}
            unansweredLeadsCount={unansweredLeadsCount}
            collapsed={isSidebarCollapsed}
            onLogout={onLogout}
          />
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* OVERVIEW HOME TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Stat Dashboard B2B */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-white/5 shadow-xs relative overflow-hidden">
              <div className="absolute right-0 top-0 w-1/4 h-full opacity-5 bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:12px_12px]" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#26B6B6]/10 text-[#26B6B6] border border-[#26B6B6]/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      Enterprise SaaS Panel
                    </span>
                    <span className="text-emerald-400 text-xs font-semibold">✓ Live data synced</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black font-sans">
                    {isRtl ? `پیشخوان مدیریت برند: ${brandInfo.nameFa}` : `Brand Board: ${brandInfo.nameEn}`}
                  </h1>
                  <p className="text-xs text-gray-400">
                    {isRtl ? 'رصد و تحلیل آماری کاتالوگ در مراجع مهندسی، ارتباط با طراحان و ثبت استعلام‌های فنی کات‌شیت.' : 'Analyze search trends, interact with active modelers, and audit structural material compliance.'}
                  </p>
                </div>

                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).onNavigateToView) {
                      (window as any).onNavigateToView('brand', mfgId);
                    } else if (onViewBrand) {
                      onViewBrand(mfgId);
                    }
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isRtl ? 'پیش‌نمایش عمومی برند' : 'Brand Public View'}</span>
                </button>
              </div>
            </div>

            {/* PRIOR PREREQUISITE WARNING ALERT */}
            {!isDocsCompleted && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 rounded-xl shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-start">
                    <h3 className="text-xs font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <span>{isRtl ? '⚠️ عدم بارگذاری مدرک الزامی (مجوز فعالیت / روزنامه رسمی)' : '⚠️ Pending Required Prerequisite (Operating License / Official Gazette)'}</span>
                      <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                        {isRtl ? 'بسیار مهم' : 'Required first'}
                      </span>
                    </h3>
                    <p className="text-[11px] text-amber-700/90 dark:text-amber-400 font-light leading-relaxed max-w-3xl">
                      {isRtl 
                        ? 'بر اساس ضوابط سامانه ایران‌بیم‌هاب، ثبت اطلاعات اولیه شرکت تایید شده است؛ اما جهت تایید نهایی برند و صدور مجوز انتشار کاتالوگ آبجکت‌ها در میان مهندسان مشاور، بارگذاری تصویر مجوز بهره‌برداری، پروانه تولید، یا آگهی روزنامه رسمی الزامی است.' 
                        : 'Your basic enrollment was recorded successfully. However, to authorize the release and download permissions of your Revit/BIM catalogs across the network, uploading an official operating license is a mandatory prerequisite.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-extrabold px-4 py-2.5 rounded-xl shrink-0 shadow-sm transition-all cursor-pointer hover:scale-102 self-start sm:self-auto"
                >
                  {isRtl ? 'بارگذاری پیش‌نیاز الزامی' : 'Upload Prerequisite Now'}
                </button>
              </div>
            )}

            {/* BRAND ONBOARDING CHECKLIST */}
            {progressPercent < 100 && (
              <div className="bg-white dark:bg-gray-900 border border-[#26B6B6]/25 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden" id="brand-onboarding-checklist">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#26B6B6] bg-[#26B6B6]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {isRtl ? 'راه‌اندازی اولیه برند' : 'Brand Onboarding Launchpad'}
                    </span>
                    <h3 className="text-sm font-extrabold text-gray-800 dark:text-white">
                      {isRtl ? 'مراحل تکمیل اطلاعات و احراز هویت برند' : 'Complete Your Brand Profile'}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {isRtl 
                        ? 'تکمیل گام‌های زیر جهت افزایش اعتبار برند و باز شدن امکان نمایش نامحدود کاتالوگ شما الزامی است.' 
                        : 'Finalize these key items to maximize catalog visibility and brand validation across IranBIMhub.'
                      }
                    </p>
                  </div>
                  <div className="text-end shrink-0">
                    <span className="text-lg font-black text-[#26B6B6] font-mono">{progressPercent}%</span>
                    <span className="text-[10px] text-gray-400 block">{isRtl ? 'تکمیل شده' : 'Complete'}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#26B6B6] to-[#1e9494] h-full transition-all duration-500 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Checklist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {/* Task 1 (Prior Prerequisite: Company Registration & License) */}
                  <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isDocsCompleted 
                      ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30' 
                      : 'bg-amber-500/5 dark:bg-amber-950/10 border-amber-300 dark:border-amber-800/80 ring-1 ring-amber-500/20'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1 rounded-full shrink-0 ${isDocsCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-500' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600'}`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="space-y-0.5 text-start">
                        <div className="flex items-center gap-1">
                          <h4 className="text-[11px] font-bold text-gray-800 dark:text-white">
                            {isRtl ? 'ثبت شرکت و مجوز بهره‌برداری' : 'Company Registration & License'}
                          </h4>
                          <span className="text-[8px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded">
                            {isRtl ? 'پیش‌نیاز اصلی' : 'Prior Required'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-normal">
                          {isRtl ? 'پیوست مجوز رسمی یا روزنامه رسمی جهت تایید عمومی برند' : 'Attach operating license or registered documents'}
                        </p>
                      </div>
                    </div>
                    {!isDocsCompleted && (
                      <button 
                        onClick={() => setActiveTab('profile')} 
                        className="text-[10px] text-[#26B6B6] hover:underline font-bold text-start cursor-pointer w-fit"
                      >
                        {isRtl ? 'بارگذاری سند پیش‌نیاز ←' : 'Upload Required Docs →'}
                      </button>
                    )}
                  </div>

                  {/* Task 2 */}
                  <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isLogoCompleted 
                      ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30' 
                      : 'bg-slate-50/50 dark:bg-gray-950/40 border-gray-100 dark:border-gray-800/80 hover:border-gray-200'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1 rounded-full shrink-0 ${isLogoCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="space-y-0.5 text-start">
                        <h4 className="text-[11px] font-bold text-gray-800 dark:text-white">
                          {isRtl ? 'لوگوی تجاری برند' : 'Upload Brand Logo'}
                        </h4>
                        <p className="text-[10px] text-gray-400 leading-normal">
                          {isRtl ? 'آپلود لوگوی رسمی جهت معرفی برند در نتایج' : 'Represent your brand identity in searches'}
                        </p>
                      </div>
                    </div>
                    {!isLogoCompleted && (
                      <button 
                        onClick={() => setActiveTab('profile')} 
                        className="text-[10px] text-[#26B6B6] hover:underline font-bold text-start cursor-pointer w-fit"
                      >
                        {isRtl ? 'بارگذاری لوگو ←' : 'Upload Logo →'}
                      </button>
                    )}
                  </div>

                  {/* Task 3 */}
                  <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isDescCompleted 
                      ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30' 
                      : 'bg-slate-50/50 dark:bg-gray-950/40 border-gray-100 dark:border-gray-800/80 hover:border-gray-200'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1 rounded-full shrink-0 ${isDescCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="space-y-0.5 text-start">
                        <h4 className="text-[11px] font-bold text-gray-800 dark:text-white">
                          {isRtl ? 'توضیحات کوتاه شرکت' : 'Add Brand Description'}
                        </h4>
                        <p className="text-[10px] text-gray-400 leading-normal">
                          {isRtl ? 'ثبت تاریخچه یا معرفی کوتاه کارخانه' : 'Short description for designers to read'}
                        </p>
                      </div>
                    </div>
                    {!isDescCompleted && (
                      <button 
                        onClick={() => setActiveTab('profile')} 
                        className="text-[10px] text-[#26B6B6] hover:underline font-bold text-start cursor-pointer w-fit"
                      >
                        {isRtl ? 'تکمیل توضیحات ←' : 'Add Description →'}
                      </button>
                    )}
                  </div>

                  {/* Task 4 */}
                  <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isProductCompleted 
                      ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30' 
                      : 'bg-slate-50/50 dark:bg-gray-950/40 border-gray-100 dark:border-gray-800/80 hover:border-gray-200'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1 rounded-full shrink-0 ${isProductCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="space-y-0.5 text-start">
                        <h4 className="text-[11px] font-bold text-gray-800 dark:text-white">
                          {isRtl ? 'آپلود اولین محصول BIM' : 'Upload First BIM Object'}
                        </h4>
                        <p className="text-[10px] text-gray-400 leading-normal">
                          {isRtl ? 'انتشار اولین محصول Revit یا IFC کارخانه' : 'Publish first product to catalog'}
                        </p>
                      </div>
                    </div>
                    {!isProductCompleted && (
                      <button 
                        onClick={() => {
                          setActiveTab('catalog');
                          alert(isRtl 
                            ? 'به زبانه مدیریت محصولات هدایت شدید. از فرم افزودن محصول برای ایجاد آبجکت جدید استفاده کنید.' 
                            : 'Redirecting to products view. Use the wizard to upload your Revit families.'
                          );
                        }} 
                        className="text-[10px] text-[#26B6B6] hover:underline font-bold text-start cursor-pointer w-fit"
                      >
                        {isRtl ? 'آپلود محصول ←' : 'Upload Product →'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* KPI Cards Board */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5 shadow-2xs">
                <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>{isRtl ? 'کل بازدید کاتالوگ' : 'Total Catalog Views'}</span>
                  <Eye className="w-4 h-4 text-[#26B6B6]" />
                </div>
                <span className="block text-2xl font-black font-mono text-gray-800 dark:text-white">{formatNumber(totalViews)}</span>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+14% vs last week</span>
                </span>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5 shadow-2xs">
                <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>{isRtl ? 'کل دانلودها' : 'Total Downloads'}</span>
                  <Clock className="w-4 h-4 text-[#26B6B6]" />
                </div>
                <span className="block text-2xl font-black font-mono text-gray-800 dark:text-white">{formatNumber(totalDownloads)}</span>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8.2% monthly trend</span>
                </span>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5 shadow-2xs">
                <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>{isRtl ? 'سرنخ‌های فروش (لید)' : 'CRM Active Leads'}</span>
                  <Mail className="w-4 h-4 text-[#26B6B6]" />
                </div>
                <span className="block text-2xl font-black font-mono text-gray-800 dark:text-white">{leads.length}</span>
                <span className="text-[10px] text-[#26B6B6] font-bold">
                  {unansweredLeadsCount} {isRtl ? 'مورد پاسخ داده نشده' : 'unanswered'}
                </span>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5 shadow-2xs">
                <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>{isRtl ? 'وضعیت تایید اسناد' : 'Brand Certification'}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="block text-sm font-extrabold text-emerald-600 dark:text-emerald-400 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-center rounded-xl">
                  {isRtl ? 'تایید هویت شده' : 'Identity Verified'}
                </span>
              </div>

              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2.5 shadow-2xs relative flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <span>{isRtl ? 'دنبال‌کنندگان برند' : 'Brand Followers'}</span>
                    <Users className="w-4 h-4 text-[#26B6B6]" />
                  </div>
                  <span className="block text-2xl font-black font-mono text-gray-800 dark:text-white">۱۴۲</span>
                  <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{isRtl ? 'رشد ۸٪ این ماه' : '+8% growth'}</span>
                  </span>
                </div>
                
                <button
                  onClick={() => setActiveTab('followers')}
                  className="w-full flex items-center justify-center gap-1 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 border border-slate-100 dark:border-gray-700/80 rounded-xl text-[9px] font-bold text-[#26B6B6] hover:text-[#1e9494] cursor-pointer group relative transition-colors"
                >
                  <Users className="w-3 h-3 shrink-0" />
                  <span>{isRtl ? 'مشاهده لیست' : 'View Follower List'}</span>
                </button>
              </div>
            </div>

            {/* Attention Center & Forecast Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Needs your attention */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
                  <span>{isRtl ? 'بخش‌هایی که نیاز به توجه شما دارند' : 'What Needs Your Attention'}</span>
                </h3>

                <div className="space-y-2.5">
                  {unansweredLeadsCount > 0 && (
                    <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {isRtl ? `شما تعداد ${unansweredLeadsCount} پیام معلق پاسخ داده نشده از معماران دارید.` : `You have ${unansweredLeadsCount} unresolved leads from architects.`}
                        </span>
                      </div>
                      <button onClick={() => { setActiveTab('requests'); setRequestsSubTab('leads'); }} className="text-xs text-[#26B6B6] hover:underline font-bold shrink-0">{isRtl ? 'پاسخ‌دهی' : 'Reply'}</button>
                    </div>
                  )}

                  {pendingApprovalsCount > 0 && (
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {isRtl ? `شما تعداد ${pendingApprovalsCount} محصول در انتظار تایید توسط کارشناسان دارید.` : `You have ${pendingApprovalsCount} products currently pending approval.`}
                        </span>
                      </div>
                      <button onClick={() => setActiveTab('catalog')} className="text-xs text-[#26B6B6] hover:underline font-bold shrink-0">{isRtl ? 'بررسی' : 'Inspect'}</button>
                    </div>
                  )}

                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{isRtl ? 'کلیه گواهی‌های استاندارد نما با کیفیت بالا فعال است.' : 'All system compliance certifications are fully active.'}</span>
                    </div>
                    <button onClick={() => { setActiveTab('profile'); setProfileSubTab('standards'); }} className="text-xs text-[#26B6B6] hover:underline font-bold shrink-0">{isRtl ? 'مشاهده' : 'View'}</button>
                  </div>
                </div>
              </div>

              {/* Predictive Forecast Insight */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'پیش‌بینی هوشمند دوره‌ای نما' : 'Lightweight Predictive Forecast'}</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    {isRtl ? 'تخمین رشد بازدید کاتالوگ بر اساس روند دانلود آرشیتکت‌ها در ۳۰ روز آتی.' : 'Est. aggregate projection models based on daily architectural activity.'}
                  </p>
                </div>

                <div className="space-y-3 font-mono">
                  <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800 pb-1.5">
                    <span className="text-gray-400">{isRtl ? 'تخمین بازدید کاتالوگ:' : 'Projected Views:'}</span>
                    <span className="font-bold text-gray-800 dark:text-white">{predictedForecast.viewsProj}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800 pb-1.5">
                    <span className="text-gray-400">{isRtl ? 'تخمین دانلودها:' : 'Projected Downloads:'}</span>
                    <span className="font-bold text-gray-800 dark:text-white">{predictedForecast.downloadsProj}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{isRtl ? 'نرخ رشد ماهانه تقریبی:' : 'Estimated growth rate:'}</span>
                    <span className="text-emerald-500 font-extrabold">{predictedForecast.growthPercent}</span>
                  </div>
                </div>

                <div className="text-[9.5px] bg-slate-50 dark:bg-gray-950 p-2 text-gray-400 rounded-lg">
                  💡 {isRtl ? 'تخمین‌ها جنبه مشاوره فنی دارند و تضمینی برای فروش قطعی نیستند.' : 'Forward-looking predictive projections, not binding guarantees.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BRAND PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-8 animate-fadeIn">
            {/* Secondary Tab Bar (pill-style) */}
            <div className="flex flex-nowrap gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-4 mb-6 overflow-x-auto scrollbar-thin text-start">
              <button
                type="button"
                onClick={() => setProfileSubTab('info')}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer ${
                  profileSubTab === 'info'
                    ? 'shadow-2xs border border-[#26B6B6]/30 text-[#26B6B6] bg-[#26B6B6]/5'
                    : 'hover:shadow-xs border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>{isRtl ? 'اطلاعات برند' : 'Brand Info'}</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileSubTab('standards')}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer ${
                  profileSubTab === 'standards'
                    ? 'shadow-2xs border border-[#26B6B6]/30 text-[#26B6B6] bg-[#26B6B6]/5'
                    : 'hover:shadow-xs border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isRtl ? 'گواهی‌ها و استانداردها' : 'Certifications & Standards'}</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileSubTab('awards')}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer ${
                  profileSubTab === 'awards'
                    ? 'shadow-2xs border border-[#26B6B6]/30 text-[#26B6B6] bg-[#26B6B6]/5'
                    : 'hover:shadow-xs border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{isRtl ? 'افتخارات و نشان‌ها' : 'Awards & Honors'}</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileSubTab('projects')}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer ${
                  profileSubTab === 'projects'
                    ? 'shadow-2xs border border-[#26B6B6]/30 text-[#26B6B6] bg-[#26B6B6]/5'
                    : 'hover:shadow-xs border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>{isRtl ? 'پروژه‌های اجرایی' : 'Projects'}</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileSubTab('catalogs')}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer ${
                  profileSubTab === 'catalogs'
                    ? 'shadow-2xs border border-[#26B6B6]/30 text-[#26B6B6] bg-[#26B6B6]/5'
                    : 'hover:shadow-xs border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{isRtl ? 'کتابخانه فنی و کاتالوگ‌ها' : 'Technical Bookshelf & Catalogs'}</span>
              </button>
            </div>

            {profileSubTab === 'info' && (
              <div className="space-y-8 animate-fadeIn text-start">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <Building className="w-5 h-5 text-[#26B6B6]" />
                    <span>{isRtl ? 'مشخصات رسمی و حقوقی برند کارخانه' : 'B2B Brand Profile & Verification'}</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {isRtl ? 'تصویر لوگو، کاتالوگ‌های چاپی، شبکه‌های اجتماعی و اسناد شرکت برای جلب اعتماد معماران ساختمانی.' : 'Manage public presentation specs, company registration files and website links.'}
                  </p>
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Left Column: Logos & Covers previews */}
              <div className="space-y-6">
                {/* Logo Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase block">{isRtl ? 'لوگو برند چاپی' : 'Company Logo'}</label>
                    <div className="relative group cursor-help inline-block">
                      <span className="text-[#26B6B6] font-bold text-xs hover:scale-110 transition-transform select-none">ⓘ</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900/95 dark:bg-gray-950 border border-slate-800 text-white text-[10px] rounded-xl shadow-xl z-50 leading-relaxed font-normal">
                        {isRtl 
                          ? 'فرمت PNG با پس‌زمینه شفاف، حداقل ۵۱۲×۵۱۲ پیکسل، حداکثر ۲ مگابایت' 
                          : 'PNG format with transparent background, minimum 512×512px, max 2MB'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <img 
                      src={brandInfo.logoUrl} 
                      alt="logo" 
                      onClick={() => document.getElementById('logo-upload-input')?.click()}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100 dark:border-gray-800 cursor-pointer hover:opacity-80 transition-opacity" 
                      title={isRtl ? 'جهت تغییر لوگو کلیک کنید' : 'Click to change logo'}
                    />
                    <input 
                      type="file" 
                      id="logo-upload-input"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) {
                          alert(isRtl ? 'خطا: فایل انتخابی باید تصویر باشد.' : 'Error: Selected file must be an image.');
                          return;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          alert(isRtl ? 'خطا: حجم لوگو نباید بیشتر از ۲ مگابایت باشد.' : 'Error: Logo size must not exceed 2MB.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const dataUrl = evt.target?.result as string;
                          if (dataUrl) {
                            setBrandInfo(prev => ({ ...prev, logoUrl: dataUrl }));
                            alert(isRtl ? 'لوگوی جدید ضمیمه شد (به صورت پیش‌نویس). برای ثبت نهایی روی دکمه ذخیره کلیک کنید.' : 'New logo attached as draft. Click Save to apply.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => document.getElementById('logo-upload-input')?.click()} 
                      className="text-xs bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 py-1.5 px-3 rounded-lg cursor-pointer font-bold text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      {isRtl ? 'بارگذاری لوگو جدید' : 'Change logo'}
                    </button>
                  </div>
                </div>

                {/* Cover Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase block">{isRtl ? 'تصویر کاور هدر پروفایل' : 'Profile Cover Photo'}</label>
                    <div className="relative group cursor-help inline-block">
                      <span className="text-[#26B6B6] font-bold text-xs hover:scale-110 transition-transform select-none">ⓘ</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900/95 dark:bg-gray-950 border border-slate-800 text-white text-[10px] rounded-xl shadow-xl z-50 leading-relaxed font-normal">
                        {isRtl 
                          ? 'فرمت JPG یا PNG، حداقل عرض ۱۲۰۰ پیکسل، نسبت تصویر ۳:۱ (پهن)، حداکثر ۵ مگابایت' 
                          : 'JPG or PNG format, minimum 1200px width, 3:1 wide aspect ratio, max 5MB'}
                      </div>
                    </div>
                  </div>
                  <img 
                    src={brandInfo.coverUrl} 
                    alt="cover" 
                    onClick={() => document.getElementById('cover-upload-input')?.click()}
                    className="w-full h-24 rounded-xl object-cover border border-gray-100 dark:border-gray-800 cursor-pointer hover:opacity-85 transition-opacity" 
                    title={isRtl ? 'جهت تغییر تصویر هدر کلیک کنید' : 'Click to change cover image'}
                  />
                  <input 
                    type="file" 
                    id="cover-upload-input"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('image/')) {
                        alert(isRtl ? 'خطا: فایل انتخابی باید تصویر باشد.' : 'Error: Selected file must be an image.');
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        alert(isRtl ? 'خطا: حجم تصویر کاور هدر نباید بیشتر از ۵ مگابایت باشد.' : 'Error: Cover image size must not exceed 5MB.');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const dataUrl = evt.target?.result as string;
                        if (dataUrl) {
                          setBrandInfo(prev => ({ ...prev, coverUrl: dataUrl }));
                          alert(isRtl ? 'تصویر کاور جدید ضمیمه شد (به صورت پیش‌نویس). برای ثبت نهایی روی دکمه ذخیره کلیک کنید.' : 'New cover photo attached as draft. Click Save to apply.');
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => document.getElementById('cover-upload-input')?.click()} 
                    className="text-xs text-[#26B6B6] hover:underline cursor-pointer font-bold"
                  >
                    {isRtl ? 'تعویض تصویر هدر...' : 'Change cover image'}
                  </button>
                </div>
              </div>

              {/* Right Columns: Forms fields */}
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 block">{isRtl ? 'نام برند (فارسی)' : 'Brand Name (Persian)'}</label>
                    <input 
                      type="text" 
                      value={brandInfo.nameFa}
                      onChange={(e) => setBrandInfo({...brandInfo, nameFa: e.target.value})}
                      className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 block">{isRtl ? 'نام برند (انگلیسی)' : 'Brand Name (English)'}</label>
                    <input 
                      type="text" 
                      value={brandInfo.nameEn}
                      onChange={(e) => setBrandInfo({...brandInfo, nameEn: e.target.value})}
                      className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 block">{isRtl ? 'توضیحات کوتاه شرکت (فارسی)' : 'Brand Description (Persian)'}</label>
                  <textarea 
                    rows={3}
                    value={brandInfo.descFa}
                    onChange={(e) => setBrandInfo({...brandInfo, descFa: e.target.value})}
                    className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 block">{isRtl ? 'توضیحات کوتاه شرکت (انگلیسی)' : 'Brand Description (English)'}</label>
                  <textarea 
                    rows={3}
                    value={brandInfo.descEn}
                    onChange={(e) => setBrandInfo({...brandInfo, descEn: e.target.value})}
                    className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>

                {/* Official Contact Info */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200">
                    {isRtl ? 'اطلاعات تماس رسمی و آدرس' : 'Official Contact & Coordinates'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 block">{isRtl ? 'کشور مبداء برند' : 'Brand Country'}</label>
                      <select 
                        value={brandInfo.country || 'IR'}
                        onChange={(e) => setBrandInfo({...brandInfo, country: e.target.value})}
                        className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                      >
                        <option value="IR">🇮🇷 {isRtl ? 'ایران' : 'Iran'}</option>
                        <option value="TR">🇹🇷 {isRtl ? 'ترکیه' : 'Turkey'}</option>
                        <option value="DE">🇩🇪 {isRtl ? 'آلمان' : 'Germany'}</option>
                        <option value="IT">🇮🇹 {isRtl ? 'ایتالیا' : 'Italy'}</option>
                        <option value="CN">🇨🇳 {isRtl ? 'چین' : 'China'}</option>
                        <option value="AE">🇦🇪 {isRtl ? 'امارات متحده عربی' : 'UAE'}</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 block">{isRtl ? 'شماره تلفن رسمی' : 'Official Phone'}</label>
                      <input 
                        type="text" 
                        value={brandInfo.phone || ''}
                        onChange={(e) => setBrandInfo({...brandInfo, phone: e.target.value})}
                        placeholder="+98 (21) 8877-4433"
                        className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 block">{isRtl ? 'آدرس وب‌سایت' : 'Website URL'}</label>
                      <input 
                        type="text" 
                        value={brandInfo.website || ''}
                        onChange={(e) => setBrandInfo({...brandInfo, website: e.target.value})}
                        placeholder="https://example.com"
                        className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 block">{isRtl ? 'پست الکترونیکی (ایمیل)' : 'Official Email'}</label>
                      <input 
                        type="email" 
                        value={brandInfo.email || ''}
                        onChange={(e) => setBrandInfo({...brandInfo, email: e.target.value})}
                        placeholder="info@example.com"
                        className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 block">{isRtl ? 'آدرس دقیق دفتر مرکزی / کارخانه' : 'Physical Address'}</label>
                    <textarea 
                      rows={2}
                      value={brandInfo.addressFa || ''}
                      onChange={(e) => setBrandInfo({...brandInfo, addressFa: e.target.value})}
                      placeholder={isRtl ? 'تهران، خیابان ولیعصر...' : '12th Flr, Tower, Ave...'}
                      className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Social Media Links */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {isRtl ? 'شبکه‌های اجتماعی و کانال‌های رسمی' : 'Official Social Media Accounts'}
                      </h4>
                      <p className="text-[10.5px] text-gray-400 mt-0.5">
                        {isRtl ? 'افزودن و مدیریت لینک‌های شبکه‌های اجتماعی جهت نمایش در پروفایل عمومی برند' : 'Add and manage social media channels shown on your public brand page'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSocialLinkRow}
                      className="bg-[#26B6B6]/10 hover:bg-[#26B6B6]/20 text-[#26B6B6] text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'افزودن شبکه اجتماعی' : 'Add Social Link'}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(brandInfo.socialLinks && brandInfo.socialLinks.length > 0) ? (
                      brandInfo.socialLinks.map((row: any) => {
                        const activePlatform = SOCIAL_PLATFORM_OPTIONS.find(p => p.id === row.platform) || SOCIAL_PLATFORM_OPTIONS[0];
                        const IconComp = activePlatform.icon;

                        return (
                          <div key={row.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 dark:bg-gray-800/60 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/60">
                            {/* Platform Selector */}
                            <div className="relative w-full sm:w-52 shrink-0">
                              <select
                                value={row.platform}
                                onChange={(e) => handleUpdateSocialLinkRow(row.id, { platform: e.target.value })}
                                className={`w-full text-xs p-2.5 ${isRtl ? 'pr-9 pl-6' : 'pl-9 pr-6'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded-xl focus:outline-none cursor-pointer appearance-none font-bold`}
                              >
                                {SOCIAL_PLATFORM_OPTIONS.map(opt => (
                                  <option key={opt.id} value={opt.id}>
                                    {isRtl ? opt.labelFa : opt.labelEn}
                                  </option>
                                ))}
                              </select>
                              <div className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2 pointer-events-none text-[#26B6B6]`}>
                                <IconComp className="w-4 h-4" />
                              </div>
                            </div>

                            {/* URL Input */}
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={row.url || ''}
                                onChange={(e) => handleUpdateSocialLinkRow(row.id, { url: e.target.value })}
                                placeholder={activePlatform.placeholder}
                                className="w-full text-xs p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded-xl focus:outline-none font-mono"
                              />
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSocialLinkRow(row.id)}
                              className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all shrink-0 cursor-pointer flex items-center justify-center"
                              title={isRtl ? 'حذف این شبکه اجتماعی' : 'Remove Social Link'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 bg-slate-50 dark:bg-gray-800/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-400">
                        {isRtl ? 'هیچ شبکه اجتماعی ثبت نشده است. با دکمه بالا یکی اضافه کنید.' : 'No social links added yet. Click above to add one.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Promotional Videos & Portfolio PDF Upload */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {isRtl ? 'ویدیوهای معرفی و تبلیغاتی (تا ۳ ویدیو)' : 'Promotional Presentation Videos (Up to 3)'}
                      </h4>
                      <p className="text-[10.5px] text-gray-400 mt-0.5">
                        {isRtl ? 'لینک ویدیوهای آپارات یا یوتیوب جهت پخش تعاملی در صفحه برند' : 'Aparat or YouTube embeddable video links'}
                      </p>
                    </div>

                    {(!brandInfo.promoVideos || brandInfo.promoVideos.length < 3) && (
                      <button
                        type="button"
                        onClick={handleAddPromoVideoRow}
                        className="bg-[#26B6B6]/10 hover:bg-[#26B6B6]/20 text-[#26B6B6] text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'افزودن ویدیو' : 'Add Video'}</span>
                      </button>
                    )}
                  </div>

                  {/* Promo Video List with Priority Controls */}
                  <div className="space-y-3">
                    {(brandInfo.promoVideos && brandInfo.promoVideos.length > 0) ? (
                      brandInfo.promoVideos.map((vid: any, idx: number) => {
                        const totalVids = brandInfo.promoVideos.length;
                        const priorityLabelsFa = ['پخش اول (اصلی)', 'پخش دوم', 'پخش سوم'];
                        const priorityLabelsEn = ['1st Play (Main)', '2nd Play', '3rd Play'];

                        return (
                          <div key={vid.id} className="p-3.5 bg-slate-50 dark:bg-gray-800/60 rounded-xl border border-gray-150 dark:border-gray-700/60 space-y-3 shadow-2xs">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/60 dark:border-gray-700/60 pb-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                                  idx === 0 
                                    ? 'bg-emerald-500 text-white shadow-2xs' 
                                    : idx === 1 
                                    ? 'bg-amber-500 text-white' 
                                    : 'bg-indigo-500 text-white'
                                }`}>
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>{isRtl ? priorityLabelsFa[idx] : priorityLabelsEn[idx]}</span>
                                </span>
                                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                                  {isRtl ? `ویدیو #${idx + 1}` : `Video #${idx + 1}`}
                                </span>
                              </div>

                              {/* Priority & Reorder Controls */}
                              <div className="flex items-center gap-2">
                                {totalVids > 1 && (
                                  <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
                                    <span className="text-[9.5px] text-gray-400 font-bold px-1">
                                      {isRtl ? 'اولویت:' : 'Order:'}
                                    </span>
                                    {Array.from({ length: totalVids }).map((_, pIdx) => (
                                      <button
                                        key={pIdx}
                                        type="button"
                                        onClick={() => handleSetPromoVideoPriority(vid.id, pIdx)}
                                        className={`px-2 py-0.5 text-[10px] font-black rounded transition-all cursor-pointer ${
                                          idx === pIdx
                                            ? 'bg-[#26B6B6] text-white shadow-2xs'
                                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                        title={isRtl ? `تعیین به عنوان اولویت ${pIdx + 1}` : `Set as Priority ${pIdx + 1}`}
                                      >
                                        {pIdx + 1}
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {/* Move Up / Move Down */}
                                {totalVids > 1 && (
                                  <div className="flex items-center gap-0.5">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleMovePromoVideo(idx, 'up')}
                                      className="p-1 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                      title={isRtl ? 'انتقال به اولویت بالاتر' : 'Move Up'}
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === totalVids - 1}
                                      onClick={() => handleMovePromoVideo(idx, 'down')}
                                      className="p-1 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                      title={isRtl ? 'انتقال به اولویت پایین‌تر' : 'Move Down'}
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeletePromoVideoRow(vid.id)}
                                  className="text-gray-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer flex items-center gap-1"
                                  title={isRtl ? 'حذف ویدیو' : 'Delete Video'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={vid.titleFa || ''}
                                onChange={(e) => handleUpdatePromoVideoRow(vid.id, { titleFa: e.target.value })}
                                placeholder={isRtl ? 'عنوان یا موضوع ویدیو (مثال: خط تولید)' : 'Video Title (e.g. Factory Tour)'}
                                className="text-xs p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none"
                              />
                              <input
                                type="text"
                                value={vid.url || ''}
                                onChange={(e) => handleUpdatePromoVideoRow(vid.id, { url: e.target.value })}
                                placeholder="https://aparat.com/v/... یا https://youtube.com/watch?v=..."
                                className="text-xs p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 bg-slate-50 dark:bg-gray-800/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-400 space-y-1">
                        <Video className="w-6 h-6 mx-auto text-gray-300 dark:text-gray-600 mb-1" />
                        <p className="font-bold">{isRtl ? 'هیچ ویدیویی ثبت نشده است.' : 'No promotional videos added yet.'}</p>
                        <p className="text-[10px] text-gray-400">{isRtl ? 'با افزودن لینک ویدیو، بخش پخش ویدیو در پروفایل برند شما فعال می‌شود.' : 'Adding a video link will enable the video player on your brand profile.'}</p>
                      </div>
                    )}
                  </div>

                  {/* Company Portfolio PDF Upload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-400 block">
                        {isRtl ? 'کاتالوگ جامع / پرتفولیوی شرکت (فایل PDF)' : 'Company Portfolio PDF'}
                      </label>

                      {/* Tooltip */}
                      <div className="relative group cursor-help">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#26B6B6]">
                          <HelpCircle className="w-3 h-3" />
                          <span>{isRtl ? 'راهنما' : 'Info'}</span>
                        </span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-52 p-2.5 bg-slate-900 text-white text-[10px] rounded-xl shadow-lg z-50 leading-relaxed font-normal text-center">
                          {isRtl ? 'فرمت PDF، حداکثر ۱۰ مگابایت' : 'PDF format, max 10MB size limit'}
                        </div>
                      </div>
                    </div>

                    <input 
                      type="file" 
                      id="portfolio-pdf-upload"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                          alert(isRtl ? 'خطا: فقط فایل‌های با فرمت PDF پذیرفته می‌شوند.' : 'Error: Only PDF files are accepted.');
                          return;
                        }
                        if (file.size > 10 * 1024 * 1024) {
                          alert(isRtl ? 'خطا: حجم فایل PDF نباید بیشتر از ۱۰ مگابایت باشد.' : 'Error: PDF file size must not exceed 10MB.');
                          return;
                        }
                        const formatBytes = (bytes: number, decimals = 2) => {
                          if (!+bytes) return '0 Bytes';
                          const k = 1024;
                          const dm = decimals < 0 ? 0 : decimals;
                          const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                          const i = Math.floor(Math.log(bytes) / Math.log(k));
                          return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
                        };
                        const localUrl = URL.createObjectURL(file);
                        setBrandInfo(prev => ({
                          ...prev,
                          portfolioPdfName: file.name,
                          portfolioPdfUrl: localUrl,
                          portfolioPdfSize: formatBytes(file.size)
                        }));
                        alert(isRtl ? `کاتالوگ ${file.name} با موفقیت پیوست گردید.` : `Portfolio catalog ${file.name} attached successfully.`);
                      }}
                    />

                    {brandInfo.portfolioPdfName ? (
                      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-[#26B6B6] shrink-0" />
                          <span className="text-xs font-mono text-gray-800 dark:text-gray-200 truncate">{brandInfo.portfolioPdfName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => document.getElementById('portfolio-pdf-upload')?.click()}
                            className="text-[10px] font-bold text-[#26B6B6] hover:underline cursor-pointer"
                          >
                            {isRtl ? 'تعویض' : 'Change'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setBrandInfo(prev => ({ ...prev, portfolioPdfName: '', portfolioPdfUrl: '' }))}
                            className="p-1 text-gray-400 hover:text-rose-500 cursor-pointer"
                            title={isRtl ? 'حذف کاتالوگ' : 'Remove PDF'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => document.getElementById('portfolio-pdf-upload')?.click()}
                        className="w-full py-3 px-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-[#26B6B6] hover:bg-[#26B6B6]/5 text-gray-500 dark:text-gray-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 text-[#26B6B6]" />
                        <span>{isRtl ? 'بارگذاری کاتالوگ شرکت (فایل PDF)' : 'Upload Company Portfolio (PDF File)'}</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-2xs">
                    <div className="text-start space-y-0.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-100 block">
                        {isRtl ? 'ثبت و اعمال تغییرات مشخصات برند' : 'Save Brand Profile Updates'}
                      </span>
                      <span className="text-[10.5px] text-gray-400 block">
                        {isRtl ? 'جهت نمایش آخرین لوگو، کاور، شبکه‌های اجتماعی و کاتالوگ شرکت در صفحه عمومی برند.' : 'Update public showcase with latest logo, promo videos, catalog PDF, and social links.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveBrandInfo()}
                      className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold px-6 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all hover:scale-102 flex items-center justify-center gap-2 shrink-0"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isRtl ? 'ذخیره تغییرات مشخصات برند' : 'Save Brand Profile Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL WIDTH SECTION 1: Verification Documents Upload */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5 text-start">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200">
                    {isRtl ? 'اسناد رسمی و مدارک احراز صلاحیت کارخانه' : 'Official Credentials & Verification Docs'}
                  </h4>
                  <p className="text-[10.5px] text-gray-400">
                    {isRtl ? 'جهت بررسی هویت حقوقی، تایید برند و صدور دسترسی انتشار فایل‌ها.' : 'For corporate identity verification, brand approval, and BIM catalog release permissions.'}
                  </p>
                </div>

                {/* Guidelines Tooltip Button */}
                <div className="relative group cursor-help self-start sm:self-auto shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10.5px] font-bold hover:bg-slate-100 transition-all select-none">
                    <HelpCircle className="w-3.5 h-3.5 text-[#26B6B6]" />
                    <span>{isRtl ? 'راهنمای بارگذاری مدارک' : 'Document Guidelines'}</span>
                  </span>
                  <div className="absolute bottom-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mb-2 hidden group-hover:block w-72 p-3.5 bg-slate-900/95 dark:bg-gray-950 border border-slate-800 text-white text-[10.5px] rounded-2xl shadow-xl z-50 leading-relaxed font-normal">
                    <div className="font-extrabold text-[#26B6B6] mb-1">{isRtl ? 'ضوابط پذیرش اسناد رسمی:' : 'Acceptable Document Guidelines:'}</div>
                    <p>{isRtl ? '• فرمت مجاز: PDF یا تصاویر اسکن‌شده با فرمت JPG یا PNG' : '• Formats: PDF or high-resolution JPG / PNG scans'}</p>
                    <p>{isRtl ? '• حداکثر حجم مجاز: ۵ مگابایت برای هر مدرک' : '• Max size: 5MB per document'}</p>
                    <p>{isRtl ? '• تصویر یا اسکن مدرک ارسالی باید کاملاً خوانا، بدون خط‌خوردگی و با حاشیه کامل باشد.' : '• Scans must be fully legible, uncropped, and free of physical damage.'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 w-full">
                {brandInfo.verificationDocs.map(doc => (
                  <div key={doc.id} className="p-5 sm:p-6 bg-slate-50 dark:bg-gray-950/40 border border-slate-100 dark:border-gray-800 rounded-2xl space-y-5 text-xs transition-all w-full shadow-2xs hover:shadow-xs">
                    {/* Hidden File Input just for this doc */}
                    <input 
                      type="file" 
                      id={`file-input-${doc.id}`}
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
                        if (!allowedTypes.includes(file.type)) {
                          alert(isRtl ? 'خطا: فرمت فایل غیرمجاز است. تنها فایل‌های PDF و تصاویر (JPG/PNG) پذیرفته می‌شوند.' : 'Error: Unsupported format. Only PDF and image files (JPG/PNG) are accepted.');
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          alert(isRtl ? 'خطا: حجم فایل نباید بیشتر از ۵ مگابایت باشد.' : 'Error: File size must not exceed 5MB.');
                          return;
                        }
                        const localUrl = URL.createObjectURL(file);
                        handleUpdateDocumentDetails(doc.id, {
                          fileName: file.name,
                          fileUrl: localUrl,
                          date: isRtl ? '۱۴۰۵/۰۴/۰۱' : '2026-07-01'
                        });
                        alert(isRtl ? `فایل ${file.name} با موفقیت پیوست شد و وضعیت سند به در حال بررسی تغییر یافت.` : `File ${file.name} attached successfully. Status set to Pending review.`);
                      }}
                    />

                    {/* Top Info Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100/60 dark:border-gray-800/60">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-slate-100 dark:bg-gray-800 text-[#26B6B6] rounded-xl shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-start">
                          <h5 className="font-extrabold text-gray-800 dark:text-gray-100">
                            {isRtl ? doc.nameFa : doc.nameEn}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{doc.date}</span>
                            </span>
                            {doc.isGazette && (
                              <span className="text-[9px] bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full font-bold">
                                {isRtl ? 'مدرک پایه الزامی' : 'Required Prerequisite'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                          doc.status === 'Verified' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : doc.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                        }`}>
                          {doc.status === 'Verified' ? (isRtl ? 'تایید شده ✓' : 'Verified ✓') : 
                           doc.status === 'Rejected' ? (isRtl ? 'رد شده ✗' : 'Rejected ✗') : 
                           (isRtl ? 'در انتظار تایید ⏳' : 'Pending Review ⏳')}
                        </span>
                      </div>
                    </div>

                    {/* Special Explanation Row for Official Gazette */}
                    {doc.isGazette && (
                      <div className="p-3 bg-sky-500/5 border border-sky-100 dark:border-sky-950/40 rounded-xl text-start">
                        <p className="text-[10.5px] text-sky-700/90 dark:text-sky-400 font-light leading-relaxed">
                          {isRtl 
                            ? 'ℹ️ آگهی رسمی ثبت شرکت که در روزنامه رسمی کشور منتشر شده است.' 
                            : 'ℹ️ The official company registration notice published in the national Official Gazette.'}
                        </p>
                      </div>
                    )}

                    {/* Custom Rejection Reason Alert Box */}
                    {doc.status === 'Rejected' && (
                      <div className="p-3.5 bg-rose-500/5 border border-rose-100 dark:border-rose-950/40 rounded-xl text-start space-y-1">
                        <div className="text-[11px] font-extrabold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                          <span>⚠️ {isRtl ? 'علت رد صلاحیت سند تجاری:' : 'Rejection Reason Details:'}</span>
                        </div>
                        <p className="text-[10.5px] text-rose-600 dark:text-rose-400/90 leading-relaxed font-light">
                          {isRtl ? (doc.rejectionReasonFa || 'اعتبار زمانی سند منقضی شده است یا کیفیت تصویر خوانا نیست.') : (doc.rejectionReasonEn || 'The quality of the upload is insufficient or the credential period has expired.')}
                        </p>
                      </div>
                    )}

                    {/* Custom VAT Expiry Warning Alert Box */}
                    {doc.id === 'doc-3' && (
                      <div className="p-3 bg-amber-500/5 border border-amber-100 dark:border-amber-950/40 rounded-xl text-start space-y-0.5">
                        <p className="text-[10.5px] text-amber-700 dark:text-amber-400 font-medium">
                          {isRtl 
                            ? '🔔 زمان تمدید یا ممیزی سالانه این سند فرا رسیده است. لطفاً فایل معتبر جدید را ارسال فرمایید.' 
                            : '🔔 Annual renewal/auditing period has arrived. Please upload your updated certificate.'}
                        </p>
                      </div>
                    )}

                    {/* File Details & Inline Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* Left Details: Attached File info */}
                      <div className="space-y-2 text-start flex flex-col justify-center">
                        <span className="text-[10.5px] font-bold text-gray-400 block">{isRtl ? 'فایل ضمیمه‌شده:' : 'Attached File:'}</span>
                        {doc.fileName ? (
                          <div className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-[#26B6B6] shrink-0" />
                              <span className="text-[10.5px] text-gray-700 dark:text-gray-300 font-mono truncate">{doc.fileName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {doc.fileUrl && (
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="p-1.5 text-gray-400 hover:text-[#26B6B6] transition-colors"
                                  title={isRtl ? 'مشاهده سند' : 'View Document'}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleUpdateDocumentDetails(doc.id, { fileName: '', fileUrl: '' })}
                                className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                                title={isRtl ? 'حذف فایل' : 'Delete File'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-3 px-4 bg-slate-100/50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center text-gray-400 text-[10.5px]">
                            {isRtl ? 'فایلی بارگذاری نشده است.' : 'No file attached yet.'}
                          </div>
                        )}
                      </div>

                      {/* Right Details: Inline Description & Lookup URL fields */}
                      <div className="space-y-2 text-start">
                        <span className="text-[10.5px] font-bold text-gray-400 block">{isRtl ? 'اطلاعات تکمیلی:' : 'Supplementary Details:'}</span>
                        <div className="space-y-2">
                          <input 
                            type="text"
                            placeholder={isRtl ? 'آدرس اینترنتی استعلام مدرک (اختیاری)...' : 'Verification lookup URL (optional)...'}
                            value={doc.url || ''}
                            onChange={(e) => handleUpdateDocumentDetails(doc.id, { url: e.target.value })}
                            className="w-full text-[10.5px] p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:outline-none"
                          />
                          <input 
                            type="text"
                            placeholder={isRtl ? 'توضیحات کوتاه یا یادداشت...' : 'Short description or notes...'}
                            value={doc.description || ''}
                            onChange={(e) => handleUpdateDocumentDetails(doc.id, { description: e.target.value })}
                            className="w-full text-[10.5px] p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row action: Trigger file picker & Permanent Delete */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-gray-100/60 dark:border-gray-800/60">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteDoc(doc.id);
                        }}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 dark:text-rose-400 text-[10.5px] font-extrabold px-3.5 py-2 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{isRtl ? 'حذف دائمی مدرک' : 'Permanent Delete'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => document.getElementById(`file-input-${doc.id}`)?.click()}
                        className="bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-[10.5px] font-extrabold px-3.5 py-2 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs transition-all hover:scale-102"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#26B6B6] shrink-0" />
                        <span>{doc.fileName ? (isRtl ? 'جایگزینی فایل ضمیمه' : 'Replace File') : (isRtl ? 'بارگذاری فایل ضمیمه' : 'Upload File')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Custom Document */}
              <div className="bg-[#26B6B6]/5 border border-[#26B6B6]/15 rounded-2xl p-4.5 space-y-3 text-start">
                <h5 className="text-[11px] font-extrabold text-[#26B6B6]">
                  {isRtl ? '＋ افزودن سند یا مدرک جدید' : '＋ Add New Credential or Document'}
                </h5>
                <form onSubmit={handleVerifyDocumentSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      required
                      placeholder={isRtl ? 'نام سند رسمی (مثلاً: پروانه کسب، گواهی ثبت برند)' : 'Legal document name (e.g. Trademark Cert)'}
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="w-full text-[10.5px] p-2.5 bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      placeholder={isRtl ? 'لینک استعلام اینترنتی مدرک (اختیاری)' : 'Lookup verification URL (optional)'}
                      value={newDocUrl}
                      onChange={(e) => setNewDocUrl(e.target.value)}
                      className="w-full text-[10.5px] p-2.5 bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <textarea 
                      rows={1}
                      placeholder={isRtl ? 'توضیحات کوتاه یا یادداشت مربوط به سند ارسالی...' : 'Short description or notes...'}
                      value={newDocDesc}
                      onChange={(e) => setNewDocDesc(e.target.value)}
                      className="w-full text-[10.5px] p-2.5 bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-xl focus:outline-none resize-none"
                    />
                  </div>

                  {/* Attach File for New Doc Form */}
                  <div className="sm:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        id="new-doc-file-picker"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) {
                            alert(isRtl ? 'خطا: حجم فایل نباید بیشتر از ۵ مگابایت باشد.' : 'Error: File size must not exceed 5MB.');
                            return;
                          }
                          setNewDocFileName(file.name);
                          setNewDocFileUrl(URL.createObjectURL(file));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('new-doc-file-picker')?.click()}
                        className="bg-white hover:bg-slate-50 dark:bg-gray-900 text-slate-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-[10px] font-bold px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#26B6B6]" />
                        <span>{newDocFileName ? (isRtl ? 'تغییر فایل ضمیمه' : 'Change Attached File') : (isRtl ? 'ضمیمه کردن فایل (PDF/عکس)' : 'Attach Document File (PDF/Image)')}</span>
                      </button>
                      {newDocFileName && (
                        <span className="text-[10px] text-gray-500 font-mono truncate max-w-xs block">
                          ✓ {newDocFileName}
                        </span>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[10.5px] font-extrabold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-all hover:scale-102 flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" />
                      <span>{isRtl ? 'ثبت و ارسال سند رسمی' : 'Add Legal Credential'}</span>
                    </button>
                  </div>
                </form>
              </div>

              <p className="text-[10px] text-gray-400 mt-2.5">
                {isRtl ? (
                  <span>
                    اطلاعات بارگذاری‌شده شما طبق ضوابط{' '}
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).onNavigateToView) {
                          (window as any).onNavigateToView('privacy');
                        }
                      }}
                      className="text-[#26B6B6] hover:underline font-bold cursor-pointer"
                    >
                      سیاست حفظ حریم خصوصی
                    </button>{' '}
                    ایران‌بیم‌هاب به صورت کاملاً محرمانه محافظت خواهد شد.
                  </span>
                ) : (
                  <span>
                    Your corporate verification records are fully secured in compliance with our{' '}
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).onNavigateToView) {
                          (window as any).onNavigateToView('privacy');
                        }
                      }}
                      className="text-[#26B6B6] hover:underline font-bold cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                )}
              </p>
            </div>

            {/* FULL WIDTH SECTION 2: LINK / REGISTER PROFESSIONAL ACCOUNT OPTION */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
              <div className="bg-slate-50/50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 space-y-4 max-w-xl text-start">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-[#26B6B6]/10 text-[#26B6B6] rounded-xl flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-white">
                      {isRtl ? 'آیا شما نیز طراح، معمار یا مهندس سازه هستید؟' : 'Are you also a BIM Professional / Modeler?'}
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      {isRtl 
                        ? 'یک حساب کاربری طراح ایجاد کنید تا بتوانید کاتالوگ آبجکت‌های ساختمانی را دانلود کرده، پوشه‌های پروژه‌ها را سازماندهی کنید و در نقش طراح فعالیت داشته باشید. حساب طراح شما کاملاً مجزا خواهد بود ولی به صورت لینک‌شده در بالای صفحه قابل سوئیچ سریع است.' 
                        : 'Link a professional designer profile under your same login to search, download, and organize Revit/IFC catalog objects for building models.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      const userSession = localStorage.getItem('iranbimhub_user');
                      if (userSession) {
                        const usr = JSON.parse(userSession);
                        usr.hasModelerAccount = true;
                        usr.selectedRoles = usr.selectedRoles || ['Architect'];
                        usr.selectedTopics = usr.selectedTopics || ['Facades', 'Sustainable Materials'];
                        localStorage.setItem('iranbimhub_user', JSON.stringify(usr));
                        alert(isRtl 
                          ? 'حساب طراح حرفه‌ای با موفقیت برای شما فعال شد! اکنون می‌توانید از دکمه سوئیچر در هدر سایت برای تعویض پنل استفاده کنید.' 
                          : 'BIM Professional account activated successfully! Use the header role switcher to navigate views.'
                        );
                        window.location.reload();
                      } else {
                        // If no session, create a default one
                        const mockUsr = {
                          name: 'BIM User',
                          fullName: 'BIM User',
                          phone: '09121112233',
                          role: 'Manufacturer',
                          hasModelerAccount: true,
                          selectedRoles: ['Architect'],
                          selectedTopics: ['Facades', 'Sustainable Materials']
                        };
                        localStorage.setItem('iranbimhub_user', JSON.stringify(mockUsr));
                        alert('BIM Professional account activated successfully!');
                        window.location.reload();
                      }
                    }}
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-[#26B6B6]/10 hover:text-[#26B6B6] text-gray-700 dark:text-gray-200 text-[11px] font-bold px-4 py-2 rounded-xl transition-all border border-transparent hover:border-[#26B6B6]/30 cursor-pointer"
                  >
                    {isRtl ? 'فعال‌سازی و ثبت‌نام حساب طراح حرفه‌ای' : 'Link & Activate BIM Professional Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

            {profileSubTab === 'standards' && (
              <div className="space-y-8 animate-fadeIn text-start">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <ShieldCheck className="w-5 h-5 text-[#26B6B6]" />
                    <span>{isRtl ? 'پایش استانداردهای کیفی در سطح کارخانه' : 'Quality Standards & Compliance Certifications'}</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {isRtl ? 'مدیریت و افزودن ایزوها و گواهی‌های استاندارد معتبر ملی و بین‌المللی برند شما.' : 'Link regional structural standards and international ISO ratings to the brand page.'}
                  </p>
                </div>

                {/* Standards list */}
                <div className="space-y-4">
                  {standards.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl space-y-2">
                      <ShieldCheck className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold max-w-sm mx-auto">
                        {isRtl ? 'مخفی کردن این بخش با افزودن اولین مدرک استاندارد؛ برای نمایش در پروفایل برند.' : 'Hide this section by adding the first standard document; show it in the brand\'s profile.'}
                      </p>
                    </div>
                  ) : (
                    standards.map(std => {
                      const isEditing = editingStdId === std.id;
                      return (
                      <div key={std.id} className="p-5 bg-slate-50 dark:bg-gray-950/45 border border-slate-100 dark:border-gray-800 rounded-2xl transition-all hover:shadow-xs space-y-4">
                        {isEditing ? (
                          /* IN-PLACE EDIT FORM */
                          <div className="space-y-3.5 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'نام استاندارد' : 'Standard Name'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={std.name}
                                  onChange={(e) => handleEditStandard(std.id, { name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'کد یا شناسه گواهینامه' : 'Certificate Code'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl font-mono"
                                  value={std.code}
                                  onChange={(e) => handleEditStandard(std.id, { code: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'مرجع صادرکننده / کشور' : 'Issuer / Country'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={std.country}
                                  onChange={(e) => handleEditStandard(std.id, { country: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'تاریخ صدور (شمسی یا میلادی)' : 'Issue Date'}</label>
                                <input 
                                  type="text" 
                                  placeholder="۱۴۰۴/۰۱/۰۱"
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={std.issueDate || ''}
                                  onChange={(e) => handleEditStandard(std.id, { issueDate: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'تاریخ اعتبار / انقضا' : 'Expiry Date'}</label>
                                <input 
                                  type="text" 
                                  placeholder="۱۴۰۷/۰۱/۰۱"
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={std.validityDate || ''}
                                  onChange={(e) => handleEditStandard(std.id, { validityDate: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'آدرس اینترنتی استعلام مدرک' : 'Verification Lookup URL'}</label>
                              <input 
                                type="text" 
                                placeholder="https://example.com/verify"
                                className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl font-mono text-left"
                                value={std.verificationUrl || ''}
                                onChange={(e) => handleEditStandard(std.id, { verificationUrl: e.target.value })}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'توضیحات استاندارد' : 'Standard Description'}</label>
                              <textarea 
                                rows={2}
                                className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl resize-none"
                                value={std.description || ''}
                                onChange={(e) => handleEditStandard(std.id, { description: e.target.value })}
                              />
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                              <button
                                type="button"
                                onClick={() => handleDeleteStandard(std.id)}
                                className="px-3.5 py-2 rounded-xl text-[10.5px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-xs border border-rose-200 hover:border-rose-300 dark:border-rose-900/30 dark:hover:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{isRtl ? 'حذف دائمی' : 'Permanently Delete'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingStdId(null)}
                                className="bg-[#26B6B6] text-white text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#1e9494]"
                              >
                                {isRtl ? 'ذخیره تغییرات' : 'Save Changes'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* STANDARD PREVIEW DISPLAY */
                          <div className="space-y-3.5 text-xs">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="font-extrabold text-gray-800 dark:text-gray-100 text-sm">{std.name}</h4>
                                <div className="flex flex-wrap items-center gap-2 text-gray-400 text-[10px] font-mono">
                                  <span>ID: {std.code}</span>
                                  <span>•</span>
                                  <span>Region: {std.country}</span>
                                  {(std.issueDate || std.validityDate) && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{isRtl ? 'اعتبار:' : 'Validity:'} {std.issueDate || 'N/A'} {isRtl ? 'تا' : 'to'} {std.validityDate || 'N/A'}</span>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                  std.verified ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                }`}>
                                  {std.verified ? (isRtl ? 'تایید شده ✓' : 'Verified ✓') : (isRtl ? 'در حال بررسی ⏳' : 'Under Review ⏳')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setEditingStdId(std.id)}
                                  className="p-1.5 bg-white dark:bg-gray-900 hover:bg-slate-100 border rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                                  title={isRtl ? 'ویرایش استاندارد' : 'Edit Standard'}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {std.description && (
                              <p className="text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900/40 p-2.5 rounded-xl border border-gray-100/60 dark:border-gray-800/60">
                                {std.description}
                              </p>
                            )}

                            {/* Verification URL link if present */}
                            {std.verificationUrl && (
                              <div className="flex items-center gap-1.5 text-[10px] text-[#26B6B6]">
                                <ExternalLink className="w-3 h-3 shrink-0" />
                                <span className="font-bold">{isRtl ? 'آدرس استعلام مدرک:' : 'Verification URL:'}</span>
                                <a href={std.verificationUrl} target="_blank" rel="noreferrer" className="underline truncate font-mono max-w-md">
                                  {std.verificationUrl}
                                </a>
                              </div>
                            )}

                            {/* Standard Attached Document Section */}
                            <div className="pt-2.5 border-t border-gray-100/60 dark:border-gray-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-bold text-[10px]">{isRtl ? 'سند ضمیمه:' : 'Certificate Doc:'}</span>
                                {std.fileName ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-900 border border-gray-100 rounded-lg">
                                    <FileText className="w-3.5 h-3.5 text-[#26B6B6]" />
                                    <span className="text-[10px] text-gray-700 dark:text-gray-300 font-mono max-w-[200px] truncate">{std.fileName}</span>
                                    {std.fileUrl && std.fileUrl !== '#' && (
                                      <a href={std.fileUrl} target="_blank" rel="noreferrer" className="text-[#26B6B6] hover:underline p-0.5">
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-light italic">{isRtl ? 'سندی پیوست نشده است.' : 'No document attached.'}</span>
                                )}
                              </div>

                              <div>
                                <input 
                                  type="file"
                                  id={`std-file-input-${std.id}`}
                                  accept=".pdf,image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const localUrl = URL.createObjectURL(file);
                                    handleEditStandard(std.id, {
                                      fileName: file.name,
                                      fileUrl: localUrl
                                    });
                                    alert(isRtl ? 'سند استاندارد به این گواهی پیوست شد.' : 'Certificate file attached successfully.');
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`std-file-input-${std.id}`)?.click()}
                                  className="bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800 border rounded-xl text-[10px] px-3 py-1.5 text-gray-700 dark:text-gray-200 cursor-pointer flex items-center gap-1"
                                >
                                  <Upload className="w-3.5 h-3.5 text-[#26B6B6]" />
                                  <span>{std.fileName ? (isRtl ? 'جایگزینی سند' : 'Replace Doc') : (isRtl ? 'بارگذاری سند گواهی' : 'Upload Doc')}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                  )}
                </div>

                {/* Form to Add New Standard */}
                <div className="bg-slate-50 dark:bg-gray-950 p-5 rounded-2xl border border-slate-100 dark:border-gray-800/80 space-y-4">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'ثبت استاندارد یا گواهی جدید برند' : 'Register New Quality Standard'}</span>
                  </h3>

                  {/* FULL STANDARD FORM */}
                  <form onSubmit={handleAddStandard} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            required
                            placeholder={isRtl ? 'نام استاندارد (مثال: ISO 14001)' : 'Standard Name (e.g. ISO 14001)'}
                            value={newStdName}
                            onChange={(e) => setNewStdName(e.target.value)}
                            className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            placeholder={isRtl ? 'کد گواهی (مثال: ISO-14001-2015)' : 'Certificate Code'}
                            value={newStdCode}
                            onChange={(e) => setNewStdCode(e.target.value)}
                            className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            placeholder={isRtl ? 'مرجع یا کشور صادرکننده' : 'Country / Issuer'}
                            value={newStdCountry}
                            onChange={(e) => setNewStdCountry(e.target.value)}
                            className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            placeholder={isRtl ? 'تاریخ صدور مدرک (مثال: ۱۴۰۴/۰۱/۱۵)' : 'Issue Date (e.g. 2025-04-01)'}
                            value={newStdIssueDate}
                            onChange={(e) => setNewStdIssueDate(e.target.value)}
                            className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            placeholder={isRtl ? 'تاریخ انقضا / ممیزی بعدی' : 'Expiry / Audit Date'}
                            value={newStdValidityDate}
                            onChange={(e) => setNewStdValidityDate(e.target.value)}
                            className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <input 
                          type="text" 
                          placeholder={isRtl ? 'آدرس اینترنتی معتبر جهت استعلام گواهی...' : 'Verification look-up URL...'}
                          value={newStdUrl}
                          onChange={(e) => setNewStdUrl(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <textarea 
                          rows={2}
                          placeholder={isRtl ? 'توضیحات کوتاه درباره دامنه کیفیت استاندارد...' : 'Short description regarding standard compliance scope...'}
                          value={newStdDesc}
                          onChange={(e) => setNewStdDesc(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 resize-none"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-2">
                          <input 
                            type="file" 
                            id="new-std-file-picker"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setNewStdFileName(file.name);
                              setNewStdFileUrl(URL.createObjectURL(file));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById('new-std-file-picker')?.click()}
                            className="bg-white hover:bg-slate-100 border rounded-xl text-[10px] font-bold px-3 py-2 cursor-pointer flex items-center gap-1"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#26B6B6]" />
                            <span>{newStdFileName ? (isRtl ? 'تغییر فایل مدرک' : 'Change Document') : (isRtl ? 'ضمیمه فایل گواهی استاندارد' : 'Attach Certificate File')}</span>
                          </button>
                          {newStdFileName && (
                            <span className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]">✓ {newStdFileName}</span>
                          )}
                        </div>

                        <button 
                          type="submit" 
                          className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                        >
                          {isRtl ? 'ثبت و بارگذاری نهایی استاندارد' : 'Save & Publish Standard'}
                        </button>
                      </div>
                    </form>
                </div>
              </div>
            )}

            {profileSubTab === 'awards' && (
              <div className="space-y-8 animate-fadeIn text-start">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <Award className="w-5 h-5 text-[#26B6B6]" />
                    <span>{isRtl ? 'افتخارات، نشان‌ها و دستاوردهای برند کارخانه' : 'Brand Awards & National Honors'}</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {isRtl ? 'مدیریت تندیس‌ها، گواهینامه‌های حامی مصرف‌کننده، رتبه‌های برتر جشنواره‌ها و گواهی‌های ثبت اختراع.' : 'Display national awards, design prizes, consumer satisfaction plaques and patents.'}
                  </p>
                </div>

                {/* Awards list */}
                <div className="space-y-4">
                  {portfolioProjects.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl space-y-2">
                      <Award className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold max-w-sm mx-auto">
                        {isRtl ? 'مخفی کردن این بخش با افزودن اولین سند افتخارات؛ برای نمایش در پروفایل برند.' : 'Hide this section by adding the first Honors & Awards document; show it in the brand\'s profile.'}
                      </p>
                    </div>
                  ) : (
                    portfolioProjects.map(award => {
                      const isEditing = editingAwardId === award.id;
                      return (
                      <div key={award.id} className="p-5 bg-slate-50 dark:bg-gray-950/45 border border-slate-100 dark:border-gray-800 rounded-2xl transition-all hover:shadow-xs space-y-4">
                        {isEditing ? (
                          /* EDIT AWARD FORM */
                          <div className="space-y-3.5 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'عنوان افتخار (فارسی)' : 'Award Title (Persian)'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={award.titleFa}
                                  onChange={(e) => handleEditAward(award.id, { titleFa: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'عنوان افتخار (انگلیسی)' : 'Award Title (English)'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl text-left"
                                  value={award.titleEn}
                                  onChange={(e) => handleEditAward(award.id, { titleEn: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'مرجع صادرکننده' : 'Issuer / Architect'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={award.architect}
                                  onChange={(e) => handleEditAward(award.id, { architect: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'مکان صادرکننده' : 'Location'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={award.location}
                                  onChange={(e) => handleEditAward(award.id, { location: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'سال اخذ' : 'Year'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={award.year}
                                  onChange={(e) => handleEditAward(award.id, { year: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'شرح یا جزئیات افتخار' : 'Description'}</label>
                              <textarea 
                                rows={2}
                                className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl resize-none"
                                value={award.description || ''}
                                onChange={(e) => handleEditAward(award.id, { description: e.target.value })}
                              />
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                              <button
                                type="button"
                                onClick={() => handleDeleteAward(award.id)}
                                className="px-3.5 py-2 rounded-xl text-[10.5px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-xs border border-rose-200 hover:border-rose-300 dark:border-rose-900/30 dark:hover:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{isRtl ? 'حذف دائمی' : 'Permanently Delete'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingAwardId(null)}
                                className="bg-[#26B6B6] text-white text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#1e9494]"
                              >
                                {isRtl ? 'ذخیره تغییرات' : 'Save Changes'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* AWARD PREVIEW MODE */
                          <div className="space-y-3.5 text-xs">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="font-extrabold text-gray-800 dark:text-gray-100 text-sm">
                                  {isRtl ? award.titleFa : award.titleEn}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-gray-400 text-[10px] font-mono">
                                  <span>Issuer: {award.architect}</span>
                                  <span>•</span>
                                  <span>{award.location}</span>
                                  <span>•</span>
                                  <span>Year: {award.year}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setEditingAwardId(award.id)}
                                  className="p-1.5 bg-white dark:bg-gray-900 hover:bg-slate-100 border rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                                  title={isRtl ? 'ویرایش افتخار' : 'Edit Award'}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {award.description && (
                              <p className="text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900/40 p-2.5 rounded-xl border border-gray-100/60 dark:border-gray-800/60">
                                {award.description}
                              </p>
                            )}

                            {/* Award Associated Document */}
                            <div className="pt-2.5 border-t border-gray-100/60 dark:border-gray-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-bold text-[10px]">{isRtl ? 'فایل پیوست:' : 'Attached File:'}</span>
                                {award.fileName ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-900 border border-gray-100 rounded-lg">
                                    <FileText className="w-3.5 h-3.5 text-[#26B6B6]" />
                                    <span className="text-[10px] text-gray-700 dark:text-gray-300 font-mono max-w-[200px] truncate">{award.fileName}</span>
                                    {award.fileUrl && award.fileUrl !== '#' && (
                                      <a href={award.fileUrl} target="_blank" rel="noreferrer" className="text-[#26B6B6] hover:underline p-0.5">
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-light italic">{isRtl ? 'سندی پیوست نشده است.' : 'No document attached.'}</span>
                                )}
                              </div>

                              <div>
                                <input 
                                  type="file"
                                  id={`award-file-input-${award.id}`}
                                  accept=".pdf,image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const localUrl = URL.createObjectURL(file);
                                    handleEditAward(award.id, {
                                      fileName: file.name,
                                      fileUrl: localUrl
                                    });
                                    alert(isRtl ? 'فایل تاییدیه به این افتخار ضمیمه شد.' : 'Document attached to award.');
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`award-file-input-${award.id}`)?.click()}
                                  className="bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800 border rounded-xl text-[10px] px-3 py-1.5 text-gray-700 dark:text-gray-200 cursor-pointer flex items-center gap-1"
                                >
                                  <Upload className="w-3.5 h-3.5 text-[#26B6B6]" />
                                  <span>{award.fileName ? (isRtl ? 'جایگزینی سند' : 'Replace Doc') : (isRtl ? 'بارگذاری سند افتخار' : 'Upload Doc')}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                  )}
                </div>

                {/* Add New Award Form */}
                <div className="bg-slate-50 dark:bg-gray-950 p-5 rounded-2xl border border-slate-100 dark:border-gray-800/80 space-y-4">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'ثبت رکورد افتخار یا مدال جدید برند' : 'Register New Brand Award'}</span>
                  </h3>

                  <form onSubmit={handleAddAward} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          required
                          placeholder={isRtl ? 'عنوان افتخار یا نشان به فارسی (مثال: برند محبوب سال ۱۴۰۳)' : 'Award Title in Persian'}
                          value={newAwardTitle}
                          onChange={(e) => setNewAwardTitle(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                        />
                        <input 
                          type="text" 
                          placeholder={isRtl ? 'عنوان افتخار یا نشان به انگلیسی (اختیاری)' : 'Award Title in English (optional)'}
                          value={newAwardTitleEn}
                          onChange={(e) => setNewAwardTitleEn(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 text-left"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input 
                          type="text" 
                          placeholder={isRtl ? 'مرجع صادرکننده افتخار' : 'Issuing Organization'}
                          value={newAwardArch}
                          onChange={(e) => setNewAwardArch(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                        />
                        <input 
                          type="text" 
                          placeholder={isRtl ? 'مکان صادرکننده (مثال: تهران)' : 'Location'}
                          value={newAwardLocation}
                          onChange={(e) => setNewAwardLocation(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                        />
                        <input 
                          type="text" 
                          placeholder={isRtl ? 'سال اخذ نشان (مثال: ۱۴۰۳)' : 'Year'}
                          value={newAwardYear}
                          onChange={(e) => setNewAwardYear(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                        />
                      </div>

                      <textarea 
                        rows={2}
                        placeholder={isRtl ? 'جزئیات تکمیلی، دلایل انتخاب یا حوزه کاربری محصولات...' : 'Supplementary details or compliance scope...'}
                        value={newAwardDesc}
                        onChange={(e) => setNewAwardDesc(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 resize-none"
                      />

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-2">
                          <input 
                            type="file" 
                            id="new-award-file-picker"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setNewAwardFileName(file.name);
                              setNewAwardFileUrl(URL.createObjectURL(file));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById('new-award-file-picker')?.click()}
                            className="bg-white hover:bg-slate-100 border rounded-xl text-[10px] font-bold px-3 py-2 cursor-pointer flex items-center gap-1"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#26B6B6]" />
                            <span>{newAwardFileName ? (isRtl ? 'تغییر فایل تاییدیه' : 'Change Document') : (isRtl ? 'ضمیمه فایل تاییدیه نشان' : 'Attach Supporting Document')}</span>
                          </button>
                          {newAwardFileName && (
                            <span className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]">✓ {newAwardFileName}</span>
                          )}
                        </div>

                        <button 
                          type="submit" 
                          className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                        >
                          {isRtl ? 'ثبت نهایی نشان و افتخار' : 'Publish Award Record'}
                        </button>
                      </div>
                    </form>
                </div>
              </div>
            )}

            {profileSubTab === 'projects' && (
              <div className="space-y-8 animate-fadeIn text-start">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <Briefcase className="w-5 h-5 text-[#26B6B6]" />
                    <span>{isRtl ? 'پروژه‌های شاخص اجرا شده با محصولات برند شما' : 'Key AEC Reference Projects'}</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {isRtl ? 'مدیریت و افزودن پروژه‌های معروفی که مجهز به محصولات کارخانه‌ای یا بلوک‌های بیم شما شده‌اند.' : 'Showcase major structural design builds equipped with your catalog specification objects.'}
                  </p>
                </div>

                {/* Projects list */}
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl space-y-2">
                      <Briefcase className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold max-w-sm mx-auto">
                        {isRtl ? 'مخفی کردن این بخش با افزودن اولین پروژه اجرایی؛ برای نمایش در پروفایل برند.' : 'Hide this section by adding the first Executed Projects document; show it in the brand\'s profile.'}
                      </p>
                    </div>
                  ) : (
                    projects.map(proj => {
                      const isEditing = editingProjId === proj.id;
                      return (
                      <div key={proj.id} className="p-5 bg-slate-50 dark:bg-gray-950/45 border border-slate-100 dark:border-gray-800 rounded-2xl transition-all hover:shadow-xs space-y-4">
                        {isEditing ? (
                          /* EDIT PROJECT FORM */
                          <div className="space-y-3.5 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'نام پروژه (فارسی)' : 'Project Title (Persian)'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={proj.titleFa}
                                  onChange={(e) => handleEditProject(proj.id, { titleFa: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'نام پروژه (انگلیسی)' : 'Project Title (English)'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl text-left"
                                  value={proj.titleEn}
                                  onChange={(e) => handleEditProject(proj.id, { titleEn: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'دفتر معماری یا طراح نما' : 'Architect / Designer'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={proj.architect}
                                  onChange={(e) => handleEditProject(proj.id, { architect: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'موقعیت پروژه' : 'Location'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={proj.location}
                                  onChange={(e) => handleEditProject(proj.id, { location: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'سال اجرا' : 'Year'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={proj.year}
                                  onChange={(e) => handleEditProject(proj.id, { year: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'توضیحات کوتاه پروژه' : 'Description'}</label>
                              <textarea 
                                rows={2}
                                className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl resize-none"
                                value={proj.description || ''}
                                onChange={(e) => handleEditProject(proj.id, { description: e.target.value })}
                              />
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj.id)}
                                className="px-3.5 py-2 rounded-xl text-[10.5px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-xs border border-rose-200 hover:border-rose-300 dark:border-rose-900/30 dark:hover:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{isRtl ? 'حذف دائمی' : 'Permanently Delete'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingProjId(null)}
                                className="bg-[#26B6B6] text-white text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#1e9494]"
                              >
                                {isRtl ? 'ذخیره تغییرات' : 'Save Changes'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* PROJECT PREVIEW MODE */
                          <div className="space-y-3.5 text-xs">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="font-extrabold text-gray-800 dark:text-gray-100 text-sm">
                                  {isRtl ? proj.titleFa : proj.titleEn}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-gray-400 text-[10px] font-mono">
                                  <span>Architect: {proj.architect}</span>
                                  <span>•</span>
                                  <span>{proj.location}</span>
                                  <span>•</span>
                                  <span>Year: {proj.year}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setEditingProjId(proj.id)}
                                  className="p-1.5 bg-white dark:bg-gray-900 hover:bg-slate-100 border rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                                  title={isRtl ? 'ویرایش پروژه' : 'Edit Project'}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {proj.description && (
                              <p className="text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900/40 p-2.5 rounded-xl border border-gray-100/60 dark:border-gray-800/60">
                                {proj.description}
                              </p>
                            )}

                            {/* Project Attached Brief/Specs file */}
                            <div className="pt-2.5 border-t border-gray-100/60 dark:border-gray-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-bold text-[10px]">{isRtl ? 'دفترچه پروژه:' : 'Project Brief:'}</span>
                                {proj.fileName ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-900 border border-gray-100 rounded-lg">
                                    <FileText className="w-3.5 h-3.5 text-[#26B6B6]" />
                                    <span className="text-[10px] text-gray-700 dark:text-gray-300 font-mono max-w-[200px] truncate">{proj.fileName}</span>
                                    {proj.fileUrl && proj.fileUrl !== '#' && (
                                      <a href={proj.fileUrl} target="_blank" rel="noreferrer" className="text-[#26B6B6] hover:underline p-0.5">
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-light italic">{isRtl ? 'سندی پیوست نشده است.' : 'No specs document attached.'}</span>
                                )}
                              </div>

                              <div>
                                <input 
                                  type="file"
                                  id={`proj-file-input-${proj.id}`}
                                  accept=".pdf,image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const localUrl = URL.createObjectURL(file);
                                    handleEditProject(proj.id, {
                                      fileName: file.name,
                                      fileUrl: localUrl
                                    });
                                    alert(isRtl ? 'دفترچه مشخصات فنی به پروژه ضمیمه شد.' : 'Document attached to project.');
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`proj-file-input-${proj.id}`)?.click()}
                                  className="bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800 border rounded-xl text-[10px] px-3 py-1.5 text-gray-700 dark:text-gray-200 cursor-pointer flex items-center gap-1"
                                >
                                  <Upload className="w-3.5 h-3.5 text-[#26B6B6]" />
                                  <span>{proj.fileName ? (isRtl ? 'جایگزینی مدرک' : 'Replace Doc') : (isRtl ? 'بارگذاری مدرک پروژه' : 'Upload Brief/Specs')}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                  )}
                </div>

                {/* Add New Project Form */}
                <div className="bg-slate-50 dark:bg-gray-950 p-5 rounded-2xl border border-slate-100 dark:border-gray-800/80 space-y-4">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'ثبت رکورد پروژه ساختمانی جدید' : 'Register New Project Reference'}</span>
                  </h3>

                  <form onSubmit={handleAddProject} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          required
                          placeholder={isRtl ? 'نام مجتمع یا پروژه به فارسی (مثال: برج مسکونی باران)' : 'Project Name in Persian'}
                          value={newProjTitle}
                          onChange={(e) => setNewProjTitle(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                        />
                        <input 
                          type="text" 
                          placeholder={isRtl ? 'نام مجتمع یا پروژه به انگلیسی (اختیاری)' : 'Project Name in English (optional)'}
                          value={newProjTitleEn}
                          onChange={(e) => setNewProjTitleEn(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 text-left"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input 
                          type="text" 
                          placeholder={isRtl ? 'دفتر معماری، آرشیتکت یا پیمانکار نما' : 'Architect or Design Team'}
                          value={newProjArch}
                          onChange={(e) => setNewProjArch(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                        />
                        <input 
                          type="text" 
                          placeholder={isRtl ? 'مکان پروژه (مثال: تهران، فرمانیه)' : 'Project Location'}
                          value={newProjLocation}
                          onChange={(e) => setNewProjLocation(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                        />
                        <input 
                          type="text" 
                          placeholder={isRtl ? 'سال اتمام یا اجرای پروژه (مثال: ۱۴۰۴)' : 'Year of Completion'}
                          value={newProjYear}
                          onChange={(e) => setNewProjYear(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                        />
                      </div>

                      <textarea 
                        rows={2}
                        placeholder={isRtl ? 'توضیحات پیرامون نحوه پیاده‌سازی، متراژ محصول مصرفی یا سایر ویژگی‌های مهندسی...' : 'Short description regarding architectural details and BIM blocks usage...'}
                        value={newProjDesc}
                        onChange={(e) => setNewProjDesc(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 resize-none"
                      />

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-2">
                          <input 
                            type="file" 
                            id="new-proj-file-picker"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setNewProjFileName(file.name);
                              setNewProjFileUrl(URL.createObjectURL(file));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById('new-proj-file-picker')?.click()}
                            className="bg-white hover:bg-slate-100 border rounded-xl text-[10px] font-bold px-3 py-2 cursor-pointer flex items-center gap-1"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#26B6B6]" />
                            <span>{newProjFileName ? (isRtl ? 'تغییر فایل ضمیمه' : 'Change Attached Brief') : (isRtl ? 'ضمیمه دفترچه یا تصاویر پروژه' : 'Attach Technical Case study/Brief')}</span>
                          </button>
                          {newProjFileName && (
                            <span className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]">✓ {newProjFileName}</span>
                          )}
                        </div>

                        <button 
                          type="submit" 
                          className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                        >
                          {isRtl ? 'ثبت نهایی پروژه ساختمانی' : 'Publish Reference Case'}
                        </button>
                      </div>
                    </form>
                </div>
              </div>
            )}

            {profileSubTab === 'catalogs' && (
              <div className="space-y-8 animate-fadeIn text-start">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <BookOpen className="w-5 h-5 text-[#26B6B6]" />
                    <span>{isRtl ? 'کتابخانه فنی و کاتالوگ‌های برند' : 'Technical Bookshelf & Catalogs'}</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {isRtl ? 'مدیریت و افزودن کاتالوگ‌های چاپی، کتب فنی، کات‌شیت‌ها و جداول محاسباتی درخواستی معماران و مهندسان.' : 'Manage technical handbooks, corporate brochures, U-value calculation tables and physical cutsheets.'}
                  </p>
                </div>

                {/* Catalogs list */}
                <div className="space-y-4">
                  {catalogs.map(cat => {
                    const isEditing = editingCatId === cat.id;
                    return (
                      <div key={cat.id} className="p-5 bg-slate-50 dark:bg-gray-950/45 border border-slate-100 dark:border-gray-800 rounded-2xl transition-all hover:shadow-xs space-y-4">
                        {isEditing ? (
                          /* EDIT CATALOG FORM */
                          <div className="space-y-3.5 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'عنوان کاتالوگ / کتاب فنی (فارسی)' : 'Catalog Title (Persian)'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={cat.titleFa}
                                  onChange={(e) => handleEditCatalog(cat.id, { titleFa: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'عنوان کاتالوگ / کتاب فنی (انگلیسی)' : 'Catalog Title (English)'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl text-left"
                                  value={cat.titleEn}
                                  onChange={(e) => handleEditCatalog(cat.id, { titleEn: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'دسته‌بندی یا نوع سند' : 'Category / Document Type'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl"
                                  value={cat.category}
                                  onChange={(e) => handleEditCatalog(cat.id, { category: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'حجم فایل' : 'File Size'}</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl font-mono"
                                  value={cat.fileSize}
                                  onChange={(e) => handleEditCatalog(cat.id, { fileSize: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 block">{isRtl ? 'توضیحات و سرفصل‌ها' : 'Description'}</label>
                              <textarea 
                                rows={2}
                                className="w-full p-2.5 bg-white dark:bg-gray-900 border rounded-xl resize-none"
                                value={cat.description || ''}
                                onChange={(e) => handleEditCatalog(cat.id, { description: e.target.value })}
                              />
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                              <button
                                type="button"
                                onClick={() => handleDeleteCatalog(cat.id)}
                                className="px-3.5 py-2 rounded-xl text-[10.5px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-xs border border-rose-200 hover:border-rose-300 dark:border-rose-900/30 dark:hover:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{isRtl ? 'حذف دائمی' : 'Permanently Delete'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCatId(null)}
                                className="bg-[#26B6B6] text-white text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#1e9494]"
                              >
                                {isRtl ? 'ذخیره تغییرات' : 'Save Changes'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* CATALOG PREVIEW MODE */
                          <div className="space-y-3.5 text-xs">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-xl shrink-0 mt-0.5">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-extrabold text-gray-800 dark:text-gray-100 text-sm">
                                    {isRtl ? cat.titleFa : cat.titleEn}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-2 text-gray-400 text-[10px]">
                                    <span className="bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium">{cat.category}</span>
                                    <span>•</span>
                                    <span className="font-mono text-[#26B6B6]">{cat.fileSize}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setEditingCatId(cat.id)}
                                  className="p-1.5 bg-white dark:bg-gray-900 hover:bg-slate-100 border rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                                  title={isRtl ? 'ویرایش کاتالوگ' : 'Edit Catalog'}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {cat.description && (
                              <p className="text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900/40 p-2.5 rounded-xl border border-gray-100/60 dark:border-gray-800/60">
                                {cat.description}
                              </p>
                            )}

                            {/* Catalog Document File */}
                            <div className="pt-2.5 border-t border-gray-100/60 dark:border-gray-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-bold text-[10px]">{isRtl ? 'فایل ضمیمه PDF:' : 'PDF File:'}</span>
                                {cat.fileName ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-900 border border-gray-100 rounded-lg">
                                    <FileText className="w-3.5 h-3.5 text-rose-500" />
                                    <span className="text-[10px] text-gray-700 dark:text-gray-300 font-mono max-w-[200px] truncate">{cat.fileName}</span>
                                    {cat.fileUrl && cat.fileUrl !== '#' && (
                                      <a href={cat.fileUrl} target="_blank" rel="noreferrer" className="text-[#26B6B6] hover:underline p-0.5">
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-light italic">{isRtl ? 'فایلی بارگذاری نشده است.' : 'No PDF attached.'}</span>
                                )}
                              </div>

                              <div>
                                <input 
                                  type="file"
                                  id={`cat-file-input-${cat.id}`}
                                  accept=".pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const localUrl = URL.createObjectURL(file);
                                    handleEditCatalog(cat.id, {
                                      fileName: file.name,
                                      fileUrl: localUrl,
                                      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                                    });
                                    alert(isRtl ? 'فایل PDF جدید به کاتالوگ پیوست شد.' : 'PDF file attached to catalog.');
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`cat-file-input-${cat.id}`)?.click()}
                                  className="bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800 border rounded-xl text-[10px] px-3 py-1.5 text-gray-700 dark:text-gray-200 cursor-pointer flex items-center gap-1"
                                >
                                  <Upload className="w-3.5 h-3.5 text-[#26B6B6]" />
                                  <span>{cat.fileName ? (isRtl ? 'جایگزینی PDF' : 'Replace PDF') : (isRtl ? 'بارگذاری فایل PDF' : 'Upload PDF')}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add New Catalog Form */}
                <div className="bg-slate-50 dark:bg-gray-950 p-5 rounded-2xl border border-slate-100 dark:border-gray-800/80 space-y-4">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'افزودن کاتالوگ یا سند فنی جدید' : 'Add New Technical Book / Catalog'}</span>
                  </h3>

                  <form onSubmit={handleAddCatalog} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        required
                        placeholder={isRtl ? 'عنوان کاتالوگ به فارسی (مثال: کتابچه فنی مقاطع ترمال‌بریک)' : 'Catalog Title (Persian)'}
                        value={newCatTitleFa}
                        onChange={(e) => setNewCatTitleFa(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                      />
                      <input 
                        type="text" 
                        placeholder={isRtl ? 'عنوان کاتالوگ به انگلیسی' : 'Catalog Title (English)'}
                        value={newCatTitleEn}
                        onChange={(e) => setNewCatTitleEn(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 text-left"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder={isRtl ? 'دسته‌بندی (مثال: راهنمای فنی / کاتالوگ محصول)' : 'Category (e.g. Technical Handbook)'}
                        value={newCatCategory}
                        onChange={(e) => setNewCatCategory(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900"
                      />
                      <input 
                        type="text" 
                        placeholder={isRtl ? 'حجم فایل (مثال: 12.4 MB)' : 'File Size (e.g. 12.4 MB)'}
                        value={newCatFileSize}
                        onChange={(e) => setNewCatFileSize(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 font-mono"
                      />
                    </div>

                    <textarea 
                      rows={2}
                      placeholder={isRtl ? 'توضیحات کوتاه، سرفصل‌ها و ضوابط اجرایی مربوط به این کاتالوگ...' : 'Short description, table of contents and guidelines...'}
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-900 resize-none"
                    />

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="file"
                          id="new-cat-file-picker"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setNewCatFileName(file.name);
                            setNewCatFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                            setNewCatFileUrl(URL.createObjectURL(file));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('new-cat-file-picker')?.click()}
                          className="bg-white hover:bg-slate-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border text-xs font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#26B6B6]" />
                          <span>{newCatFileName ? (isRtl ? 'تغییر فایل PDF' : 'Change PDF File') : (isRtl ? 'انتخاب فایل PDF' : 'Attach PDF File')}</span>
                        </button>
                        {newCatFileName && (
                          <span className="text-[10px] text-gray-500 font-mono truncate max-w-xs block">
                            ✓ {newCatFileName}
                          </span>
                        )}
                      </div>

                      <button 
                        type="submit" 
                        className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                      >
                        {isRtl ? 'ثبت و انتشار کاتالوگ فنی' : 'Save & Publish Catalog'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* PRODUCTS / CATALOG MANAGEMENT */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Catalog management tools */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Grid className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'مدیریت و پایش فایل‌های لایبری کاتالوگ' : 'Catalog Library Inventory'}</span>
                </h2>
                <p className="text-[11px] text-gray-400 mt-1">
                  {isRtl ? 'مشاهده آمار تک‌تک محصولات، اضافه کردن مدل‌های سه بعدی رویت و ثبت آپدیت برای فایل‌ها.' : 'Track file download stats, deploy family versions and publish parametric specifications.'}
                </p>
              </div>

              <button 
                onClick={() => setWizardStep(1)}
                className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isRtl ? 'افزودن آبجکت بیم جدید' : 'Add New BIM Object'}</span>
              </button>
            </div>

            {/* Catalog list view spreadsheet style */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder={isRtl ? 'جستجو در انبار محصولات...' : 'Search within SKU inventory...'}
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0 dark:text-white"
                />
              </div>

              <select
                value={catalogStatus}
                onChange={(e) => setCatalogStatus(e.target.value)}
                className="bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-xs px-3 py-2 rounded-xl focus:outline-none dark:text-white shrink-0"
              >
                <option value="all">{isRtl ? 'همه وضعیت‌ها' : 'All Status'}</option>
                <option value="Published">{isRtl ? 'منتشر شده' : 'Published'}</option>
                <option value="Pending Review">{isRtl ? 'در انتظار تایید' : 'Pending Review'}</option>
                <option value="Draft">{isRtl ? 'پیش‌نویس' : 'Draft'}</option>
              </select>
            </div>

            {/* Catalog Grid spreadsheet table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-gray-950/50 text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                      <th className="p-3 text-start">{isRtl ? 'تصویر محصول' : 'Preview'}</th>
                      <th className="p-3 text-start">{isRtl ? 'نام مدل هوشمند صنعتی' : 'BIM SKU Item'}</th>
                      <th className="p-3 text-center">{isRtl ? 'شاخه و کتگوری' : 'Category'}</th>
                      <th className="p-3 text-center">{isRtl ? 'وضعیت تایید فنی' : 'Approval Status'}</th>
                      <th className="p-3 text-center">{isRtl ? 'تعداد بازدید' : 'Views'}</th>
                      <th className="p-3 text-center">{isRtl ? 'تعداد دانلود' : 'Downloads'}</th>
                      <th className="p-3 text-center">{isRtl ? 'نسخه‌گذاری' : 'Version Control'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                    {filteredCatalog.map(obj => (
                      <tr key={obj.id} className="hover:bg-slate-50/30 dark:hover:bg-gray-950/30 transition-colors">
                        <td className="p-3">
                          <img src={obj.imageUrl} alt="preview" className="w-10 h-10 rounded object-cover border" />
                        </td>
                        <td className="p-3 font-bold text-gray-800 dark:text-white max-w-xs truncate">
                          {isRtl ? obj.titleFa : obj.titleEn}
                          <span className="block font-mono text-[9px] text-gray-400 mt-0.5">{obj.lod}</span>
                        </td>
                        <td className="p-3 text-center text-gray-500 dark:text-gray-400 font-medium">{obj.category}</td>
                        <td className="p-3 text-center">
                          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full ${
                            (obj as any).status === 'Published' 
                              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
                              : 'bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                          }`}>
                            {(obj as any).status || 'Published'}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-gray-600 dark:text-gray-300">{(obj as any).views || 0}</td>
                        <td className="p-3 text-center font-mono font-bold text-gray-600 dark:text-gray-300">{(obj as any).downloads || 0}</td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => {
                              const v = prompt(isRtl ? 'ورژن جدید فایل را وارد کنید (مثال: v1.2.0):' : 'Enter updated version tag (e.g. v2.1.0):');
                              if (v) alert(isRtl ? `ورژن جدید ${v} ثبت شد.` : `Version ${v} logged.`);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] py-1 px-2.5 rounded border border-slate-100 dark:border-gray-700 cursor-pointer"
                          >
                            {isRtl ? 'ثبت آپدیت' : 'Update file'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADD PRODUCT WIZARD POPUP */}
            {wizardStep !== 3 && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setWizardStep(3)} />
                <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-4 border-b dark:border-gray-800">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                      {isRtl ? 'جادوگر انتشار آبجکت بیم نوین صنعتی' : 'Add New Parametric BIM Object'}
                    </h3>
                    <button onClick={() => setWizardStep(3)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X className="w-5 h-5" /></button>
                  </div>

                  {/* Steps Progress */}
                  <div className="flex justify-around items-center py-4 border-b dark:border-gray-800 font-bold text-xs text-center text-gray-400">
                    <span className={wizardStep === 1 ? 'text-[#26B6B6]' : ''}>{isRtl ? '۱. پرونده فایل' : '1. Upload File'}</span>
                    <span>→</span>
                    <span className={wizardStep === 2 ? 'text-[#26B6B6]' : ''}>{isRtl ? '۲. داده‌های فنی' : '2. Parametric Specs'}</span>
                  </div>

                  {wizardStep === 1 && (
                    <div className="py-6 space-y-4">
                      {/* Drag and Drop */}
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                          dragActive ? 'border-[#26B6B6] bg-[#26B6B6]/5' : 'border-gray-200 dark:border-gray-700 hover:border-[#26B6B6]'
                        }`}
                      >
                        <UploadCloud className="w-12 h-12 text-[#26B6B6] mx-auto opacity-75" />
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2">
                          {bimFileName ? `${isRtl ? 'فایل انتخاب شده:' : 'File target:'} ${bimFileName}` : (isRtl ? 'فایل رویت (RFA) یا IFC خود را اینجا رها کنید' : 'Drag & Drop Revit (.RFA, .RVT) or IFC files here')}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">{isRtl ? 'حداکثر حجم مجاز: ۵۰ مگابایت' : 'Supported sizes up to 50MB maximum'}</p>
                        <input 
                          type="file" 
                          id="bimFile" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) setBimFileName(e.target.files[0].name);
                          }}
                        />
                        <button 
                          onClick={() => document.getElementById('bimFile')?.click()}
                          className="mt-3 bg-[#26B6B6]/10 text-[#26B6B6] hover:bg-[#26B6B6] hover:text-white font-bold text-xs py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer"
                        >
                          {isRtl ? 'یا انتخاب فایل دستی' : 'Browse Files'}
                        </button>
                      </div>

                      {/* Revit File Protection Limitation Notice */}
                      <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5 text-start">
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {isRtl ? 'شفاف‌سازی فنی: عدم امکان قفل فایل‌ها در Revit' : 'Technical Note: Revit Family Lock Limits'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                          {isRtl ? (
                            <span>به دلیل ساختار ذاتی و معماری بسته‌نرم‌افزار Autodesk Revit، هیچ روش فنی بومی برای قفل مادی یا سلب کامل امکان ویرایش فایل‌های فمیلی (.rfa) پس از دریافت توسط کاربران وجود ندارد. صیانت از حقوق تجاری شما بر دوش ضوابط حقوقی و توافق‌نامه کاربری ایران‌بیم‌هاب است.</span>
                          ) : (
                            <span>Due to the native architecture of Autodesk Revit, there is no technical method to fully write-protect or lock Revit family (.rfa) files from editing once they are downloaded. Protection of your catalog assets relies entirely on our legal Terms of Service.</span>
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          required
                          placeholder={isRtl ? 'عنوان محصول (فارسی)' : 'Product Title (Persian)'}
                          value={wizardForm.titleFa}
                          onChange={(e) => setWizardForm({...wizardForm, titleFa: e.target.value})}
                          className="text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                        />
                        <input 
                          type="text" 
                          required
                          placeholder={isRtl ? 'عنوان محصول (انگلیسی)' : 'Product Title (English)'}
                          value={wizardForm.titleEn}
                          onChange={(e) => setWizardForm({...wizardForm, titleEn: e.target.value})}
                          className="text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-4 border-t dark:border-gray-800">
                        <button 
                          onClick={() => {
                            if (!bimFileName) {
                              alert(isRtl ? 'ابتدا فایل بیم را آپلود کنید.' : 'Please choose a BIM family first.');
                              return;
                            }
                            setWizardStep(2);
                          }}
                          className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                        >
                          {isRtl ? 'بعدی: ویژگی‌ها نما' : 'Next Specs'}
                        </button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div className="py-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[11px] text-gray-400 block font-bold">{isRtl ? 'نوع LOD (سطح توسعه جزئیات)' : 'LOD standard'}</span>
                          <select 
                            value={wizardForm.lod} 
                            onChange={(e: any) => setWizardForm({...wizardForm, lod: e.target.value})}
                            className="w-full text-xs p-2.5 border rounded-xl bg-slate-50 dark:bg-gray-800 dark:text-white"
                          >
                            <option value="LOD 300">LOD 300</option>
                            <option value="LOD 350">LOD 350</option>
                            <option value="LOD 400">LOD 400</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] text-gray-400 block font-bold">{isRtl ? 'جنس پروفایل اصلی نما' : 'Facade Material Spec'}</span>
                          <input 
                            type="text" 
                            value={wizardForm.specs.material} 
                            onChange={(e) => setWizardForm({...wizardForm, specs: {...wizardForm.specs, material: e.target.value}})}
                            className="w-full text-xs p-2.5 border rounded-xl dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Brand Ownership and Legal Disclaimer Required Checkbox */}
                      <div className="p-3.5 bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10 border border-[#26B6B6]/25 rounded-xl space-y-2 text-start">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={agreePublishTerms}
                            onChange={(e) => setAgreePublishTerms(e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded accent-[#26B6B6] cursor-pointer animate-pulse"
                          />
                          <span className="text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
                            {isRtl ? (
                              <span>
                                تایید می‌کنم که مالکیت مادی و معنوی این فایل‌ها متعلق به برند تولیدی ما بوده و صحت تمام ابعاد فنی منطبق بر{' '}
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    if (typeof window !== 'undefined' && (window as any).onNavigateToView) {
                                      (window as any).onNavigateToView('terms');
                                    }
                                  }}
                                  className="text-[#26B6B6] hover:underline font-bold cursor-pointer inline-block"
                                >
                                  بند ۴ قوانین و مقررات پلتفرم
                                </button>{' '}
                                مورد پذیرش است.
                              </span>
                            ) : (
                              <span>
                                I certify that we hold full intellectual property rights for these assets, and agree to model precision in accordance with{' '}
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    if (typeof window !== 'undefined' && (window as any).onNavigateToView) {
                                      (window as any).onNavigateToView('terms');
                                    }
                                  }}
                                  className="text-[#26B6B6] hover:underline font-bold cursor-pointer inline-block"
                                >
                                  Clause 4 of the Terms of Service
                                </button>
                                .
                              </span>
                            )}
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-2 justify-end pt-4 border-t dark:border-gray-800">
                        <button 
                          onClick={() => setWizardStep(1)}
                          className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
                        >
                          {isRtl ? 'قبلی' : 'Back'}
                        </button>
                        <button 
                          onClick={handlePublishNewProduct}
                          className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                        >
                          {isRtl ? 'انتشار و ارسال جهت تایید فنی' : 'Publish to Supervisor'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTION & BILLING */}
        {activeTab === 'subscription' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">{isRtl ? 'پلن کارفرمایی برند' : 'Active Brand Plan'}</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-800 dark:text-white">
                    {isRtl ? `عضویت ویژه ${brandInfo.tier} کارخانجات` : `${brandInfo.tier} Provider SLA`}
                  </h2>
                </div>
                <p className="text-xs text-gray-400">
                  {brandInfo.tier === 'VIP' 
                    ? (isRtl ? 'شما دسترسی نامحدود به بارگذاری محصولات، ماژول آنالیز پیشرفته و دسترسی به CRM سرنخ‌های فروش معماران دارید.' : 'Unlimited parametric SKUs allowed, deep cohort analytical views and full CRM unread lead queries.')
                    : brandInfo.tier === 'Premium'
                    ? (isRtl ? 'شما دسترسی به بارگذاری ۳۰ محصول، ماژول آنالیز هفتگی و لید هوشمند دارید.' : 'Up to 30 object uploads, weekly analytics, and smart leads routing.')
                    : (isRtl ? 'شما دسترسی رایگان محدود به بارگذاری ۵ محصول دارید.' : 'Free basic tier with 5 object uploads support.')}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {brandInfo.tier === 'Free' && (
                  <>
                    <button
                      onClick={() => (window as any).onNavigateToView?.('payment', 'mfg-premium')}
                      className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      {isRtl ? 'ارتقا به ممتاز (Premium)' : 'Upgrade to Premium'}
                    </button>
                    <button
                      onClick={() => (window as any).onNavigateToView?.('payment', 'mfg-vip')}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      👑 {isRtl ? 'ارتقا به ویژه (VIP)' : 'Upgrade to VIP'}
                    </button>
                  </>
                )}
                {brandInfo.tier === 'Premium' && (
                  <button
                    onClick={() => (window as any).onNavigateToView?.('payment', 'mfg-vip')}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    👑 {isRtl ? 'ارتقا به ویژه (VIP)' : 'Upgrade to VIP'}
                  </button>
                )}
              </div>
            </div>

            {/* Plan Matrix */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">{isRtl ? 'ویژگی‌های اشتراک برندها' : 'B2B Brand Features Comparison'}</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400">
                      <th className="p-3 text-start font-bold">{isRtl ? 'شاخص خدمات' : 'SaaS Parameters'}</th>
                      <th className="p-3 text-center font-bold bg-slate-50/50 dark:bg-gray-950/50">{isRtl ? 'رایگان (Free)' : 'Free'}</th>
                      <th className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? 'ممتاز (Premium)' : 'Premium'}</th>
                      <th className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/10">👑 {isRtl ? 'ویژه (VIP)' : 'VIP'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'تعداد محصولات مجاز کاتالوگ' : 'SKU upload limit'}</td>
                      <td className="p-3 text-center bg-slate-50/50 dark:bg-gray-950/50">{isRtl ? '۵ کالا' : '5 objects max'}</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? '۳۰ کالا' : '30 objects max'}</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/10">👑 {isRtl ? 'بی‌نهایت' : 'Unlimited'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'فرمت‌های مدل سه‌بعدی' : 'Supported 3D formats'}</td>
                      <td className="p-3 text-center bg-slate-50/50 dark:bg-gray-950/50">{isRtl ? 'فقط Revit' : 'Revit only'}</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? 'تمامی فرمت‌ها' : 'All formats'}</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/10">👑 {isRtl ? 'همه‌جانبه + مدلسازی سفارشی' : 'All + custom modeling'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'عمق تحلیل و پایش' : 'Predictive analytics & tracking'}</td>
                      <td className="p-3 text-center text-gray-300 bg-slate-50/50 dark:bg-gray-950/50">{isRtl ? 'ماهانه (پایه)' : 'Monthly (Basic)'}</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">✓ {isRtl ? 'هفتگی (تفصیلی)' : 'Weekly deep'}</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/10">✓ {isRtl ? 'لحظه‌ای (هوشمند)' : 'Realtime smart'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'دریافت سرنخ‌های فروش مستقیم' : 'Leads routing & inbox'}</td>
                      <td className="p-3 text-center text-gray-300 bg-slate-50/50 dark:bg-gray-950/50">✕</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">✓ {isRtl ? 'فعال' : 'Unlocked'}</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/10">✓ {isRtl ? 'فعال + ارجاع مستقیم' : 'Unlocked + CRM Sync'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS & STATISTICS */}
        {activeTab === 'analytics' && (
          <ManufacturerAnalyticsView
            catalogObjects={catalogObjects}
            leads={leads}
            onExportCSV={handleExportCSVReport}
          />
        )}

        {/* FOLLOWERS LIST TAB */}
        {activeTab === 'followers' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-6 animate-fadeIn min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'دنبال‌کنندگان (مخاطبین هدف)' : 'Followers & Target Audience'}</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {isRtl ? 'لیست معماران و شرکت‌هایی که برند شما را دنبال می‌کنند' : 'List of architects and firms following your brand'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#26B6B6]/20 flex items-center justify-center text-[#26B6B6] font-bold shrink-0 text-sm">
                  AM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{isRtl ? 'علی مرادی' : 'Ali Moradi'}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">Senior Architect • 2 days ago</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#26B6B6]/20 flex items-center justify-center text-[#26B6B6] font-bold shrink-0 text-sm">
                  ZS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{isRtl ? 'زهرا شیرازی' : 'Zahra Shirazi'}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">BIM Modeler • 5 days ago</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#26B6B6]/20 flex items-center justify-center text-[#26B6B6] font-bold shrink-0 text-sm">
                  NT
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{isRtl ? 'نوید تهرانی' : 'Navid Tehrani'}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">Interior Designer • 1 week ago</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer">
                {isRtl ? 'مشاهده بیشتر' : 'Load More'}
              </button>
            </div>
          </div>
        )}

        {/* REQUESTS & LEADS TAB */}
        {activeTab === 'requests' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Secondary Tab Bar for Requests */}
            <div className="flex flex-nowrap gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-4 mb-6 overflow-x-auto scrollbar-thin text-start">
              <button
                type="button"
                onClick={() => setRequestsSubTab('leads')}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer ${
                  requestsSubTab === 'leads'
                    ? 'shadow-2xs border border-[#26B6B6]/30 text-[#26B6B6] bg-[#26B6B6]/5'
                    : 'hover:shadow-xs border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isRtl ? 'سرنخ‌های فروش (CRM)' : 'Purchase Leads'}</span>
              </button>
              <button
                type="button"
                onClick={() => setRequestsSubTab('objects')}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer ${
                  requestsSubTab === 'objects'
                    ? 'shadow-2xs border border-[#26B6B6]/30 text-[#26B6B6] bg-[#26B6B6]/5'
                    : 'hover:shadow-xs border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 bg-white hover:bg-slate-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>{isRtl ? 'فمیلی‌های درخواستی معماران' : 'Requested BIM Objects'}</span>
              </button>
            </div>

            {requestsSubTab === 'leads' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                {/* Leads list column */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 space-y-4">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider border-b pb-2">{isRtl ? 'پیام‌های دریافتی از طراحان (سرنخ)' : 'AEC Leads & Queries'}</h3>
                  
                  <div className="space-y-2">
                    {leads.map(lead => (
                      <div 
                        key={lead.id}
                        onClick={() => {
                          setActiveLeadId(lead.id);
                          setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, read: true } : l));
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-start ${
                          activeLeadId === lead.id 
                            ? 'border-[#26B6B6] bg-[#26B6B6]/5' 
                            : 'border-slate-100 hover:border-[#26B6B6]/30 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[11px] font-bold text-gray-800 truncate block">{lead.senderName}</span>
                          {!lead.read && <span className="w-2 h-2 rounded-full bg-[#26B6B6] shrink-0" />}
                        </div>
                        <span className="text-[9.5px] text-gray-400 font-mono block mt-1">{lead.date}</span>
                        <span className="inline-block bg-slate-100 text-gray-500 text-[8.5px] px-1.5 py-0.5 rounded font-bold mt-1.5">{lead.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversation detail and Support ticket box */}
                <div className="lg:col-span-2 space-y-6">
                  {activeLeadId ? (
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl space-y-4">
                      {(() => {
                        const lead = leads.find(l => l.id === activeLeadId);
                        if (!lead) return null;
                        return (
                          <div className="space-y-4 text-start">
                            <div className="border-b pb-3">
                              <h4 className="text-xs font-extrabold text-gray-800 dark:text-white">{lead.senderName}</h4>
                              <p className="text-[10px] text-gray-400 mt-1">Product: <span className="text-[#26B6B6] font-bold">{lead.productName}</span></p>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-gray-950 rounded-xl text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                              {lead.message}
                            </div>

                            {/* Thread of replies */}
                            {lead.replies.map((rep: any, idx: number) => (
                              <div key={idx} className="p-3 bg-indigo-50/30 rounded-xl text-xs flex flex-col justify-between">
                                <span className="text-[9.5px] text-gray-400 font-bold">{isRtl ? 'پاسخ کارفرما:' : 'Your Response:'}</span>
                                <p className="mt-1">{rep.text}</p>
                              </div>
                            ))}

                            <div className="space-y-2">
                              <textarea 
                                rows={3} 
                                placeholder={isRtl ? 'پاسخ فنی خود را به معمار ارسال کنید...' : 'Type your technical quote response...'}
                                value={crmReplyText}
                                onChange={(e) => setCrmReplyText(e.target.value)}
                                className="w-full text-xs p-3 border rounded-xl"
                              />
                              <button 
                                onClick={() => handleSendCrmReply(lead.id)}
                                className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold py-2 px-4.5 rounded-xl cursor-pointer"
                              >
                                {isRtl ? 'ارسال پاسخ نهایی' : 'Dispatch Message'}
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-2xl text-center text-xs text-gray-400">
                      {isRtl ? 'جهت بررسی پیام معماران، یک مورد را از لیست چپ انتخاب کنید.' : 'Select an active lead from the left pane to initialize chat.'}
                    </div>
                  )}

                  {/* Support ticket thread to platform */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                      <HelpCircle className="w-4.5 h-4.5 text-[#26B6B6]" />
                      <span>{isRtl ? 'تیکت‌های پشتیبانی به تیم ایران‌بیم‌هاب' : 'Official SLA Support Tickets'}</span>
                    </h3>

                    <div className="space-y-3">
                      {supportTickets.map(tick => (
                        <div key={tick.id} className="p-4 bg-slate-50 dark:bg-gray-950 rounded-xl border border-slate-100 dark:border-gray-800 space-y-2 text-start">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-gray-800 dark:text-white">{tick.subject}</span>
                            <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-[9px]">{tick.status}</span>
                          </div>
                          
                          {tick.chat.map((m: any, idx: number) => (
                            <div key={idx} className="p-2.5 bg-white dark:bg-gray-900 rounded-lg text-[11px] text-gray-600 dark:text-gray-300">
                              <span className="font-bold text-[9.5px] block text-gray-400">{m.sender === 'mfg' ? (isRtl ? 'من' : 'Brand') : (isRtl ? 'پشتیبان سیستم' : 'Mod Desk')}</span>
                              <p className="mt-0.5">{m.text}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleCreateTicket} className="space-y-3 pt-3 border-t dark:border-gray-800">
                      <input 
                        type="text" 
                        required
                        placeholder={isRtl ? 'موضوع تیکت فنی...' : 'Ticket Subject...'}
                        value={newSupportSubject}
                        onChange={(e) => setNewSupportSubject(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl"
                      />
                      <textarea 
                        rows={2} 
                        required
                        placeholder={isRtl ? 'جزئیات تداخل مدل، ایراد فاکتور یا سوال فنی...' : 'Type message detail...'}
                        value={newSupportMsg}
                        onChange={(e) => setNewSupportMsg(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl"
                      />
                      <button type="submit" className="bg-[#26B6B6] text-white text-xs font-bold py-2 px-4.5 rounded-xl cursor-pointer">
                        {isRtl ? 'ثبت تیکت فنی جدید' : 'Open Ticket'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {requestsSubTab === 'objects' && (
              <div className="space-y-8 animate-fadeIn text-start">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <HelpCircle className="w-5 h-5 text-[#26B6B6]" />
                    <span>{isRtl ? 'آبجکت‌ها و فمیلی‌های درخواستی معماران (BIM)' : 'Requested BIM Families from Designers'}</span>
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {isRtl 
                      ? 'مشاهده و مدیریت درخواست‌های مدل‌سازی که توسط کاربران بیم‌هاب در صفحه برند شما ثبت شده است.' 
                      : 'Review, accept and update statuses of custom modeling requests submitted by designers.'}
                  </p>
                </div>

                {/* Quick stats for requested objects */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">{isRtl ? 'کل درخواست‌ها' : 'Total Requests'}</span>
                    <span className="text-lg font-black text-gray-800 dark:text-white font-mono">{objectRequests.length}</span>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase text-red-500">{isRtl ? 'اولویت بالا (فوری)' : 'High Priority'}</span>
                    <span className="text-lg font-black text-red-500 font-mono">{objectRequests.filter(r => r.priority === 'High').length}</span>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase text-amber-500">{isRtl ? 'در حال بررسی' : 'Pending Review'}</span>
                    <span className="text-lg font-black text-amber-500 font-mono">{objectRequests.filter(r => r.status === 'Pending').length}</span>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase text-emerald-500">{isRtl ? 'مدل‌سازی شده' : 'Completed'}</span>
                    <span className="text-lg font-black text-emerald-500 font-mono">{objectRequests.filter(r => r.status === 'Completed').length}</span>
                  </div>
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-gray-900 border p-4 rounded-2xl dark:border-gray-800">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-0.5">
                      <label className="block text-[10px] text-gray-400 font-bold">{isRtl ? 'وضعیت بررسی' : 'Status Filter'}</label>
                      <select 
                        value={selectedRequestFilterStatus}
                        onChange={e => setSelectedRequestFilterStatus(e.target.value)}
                        className="text-xs p-1.5 border rounded-lg bg-gray-50 dark:bg-gray-950 focus:outline-none"
                      >
                        <option value="all">{isRtl ? 'همه وضعیت‌ها' : 'All Statuses'}</option>
                        <option value="Pending">{isRtl ? 'در انتظار بررسی' : 'Pending'}</option>
                        <option value="In Progress">{isRtl ? 'در حال مدلسازی' : 'In Progress'}</option>
                        <option value="Completed">{isRtl ? 'تکمیل شده' : 'Completed'}</option>
                        <option value="Rejected">{isRtl ? 'رد شده' : 'Rejected'}</option>
                      </select>
                    </div>

                    <div className="space-y-0.5">
                      <label className="block text-[10px] text-gray-400 font-bold">{isRtl ? 'اولویت پروژه' : 'Priority Filter'}</label>
                      <select 
                        value={selectedRequestFilterPriority}
                        onChange={e => setSelectedRequestFilterPriority(e.target.value)}
                        className="text-xs p-1.5 border rounded-lg bg-gray-50 dark:bg-gray-950 focus:outline-none"
                      >
                        <option value="all">{isRtl ? 'همه اولویت‌ها' : 'All Priorities'}</option>
                        <option value="High">{isRtl ? 'بالا (فوری)' : 'High'}</option>
                        <option value="Medium">{isRtl ? 'متوسط' : 'Medium'}</option>
                        <option value="Low">{isRtl ? 'کم' : 'Low'}</option>
                      </select>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400 font-medium">
                    {isRtl 
                      ? `${objectRequests.filter(r => {
                          const ms = selectedRequestFilterStatus === 'all' || r.status === selectedRequestFilterStatus;
                          const mp = selectedRequestFilterPriority === 'all' || r.priority === selectedRequestFilterPriority;
                          return ms && mp;
                        }).length} مورد یافت شد`
                      : `${objectRequests.filter(r => {
                          const ms = selectedRequestFilterStatus === 'all' || r.status === selectedRequestFilterStatus;
                          const mp = selectedRequestFilterPriority === 'all' || r.priority === selectedRequestFilterPriority;
                          return ms && mp;
                        }).length} items matching`
                    }
                  </span>
                </div>

                {/* Content list & Detail view */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: list */}
                  <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {(() => {
                      const items = objectRequests.filter(r => {
                        const ms = selectedRequestFilterStatus === 'all' || r.status === selectedRequestFilterStatus;
                        const mp = selectedRequestFilterPriority === 'all' || r.priority === selectedRequestFilterPriority;
                        return ms && mp;
                      });

                      if (items.length === 0) {
                        return (
                          <div className="bg-white dark:bg-gray-900 border rounded-2xl p-8 text-center text-xs text-gray-400">
                            {isRtl ? 'هیچ درخواستی با فیلترهای کنونی مطابقت ندارد.' : 'No requests match current filters.'}
                          </div>
                        );
                      }

                      return items.map(req => (
                        <div
                          key={req.id}
                          onClick={() => setActiveObjectRequestId(req.id)}
                          className={`p-4 bg-white dark:bg-gray-900 border rounded-2xl transition-all cursor-pointer text-start space-y-2.5 ${
                            activeObjectRequestId === req.id 
                              ? 'border-amber-500 bg-amber-50/10' 
                              : 'border-gray-100 hover:border-amber-300 dark:border-gray-800'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-white truncate">{req.objectName}</h4>
                            <span className={`text-[8.5px] px-2 py-0.5 rounded-full shrink-0 font-black tracking-wide ${
                              req.priority === 'High' 
                                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' 
                                : req.priority === 'Medium'
                                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                  : 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                            }`}>
                              {req.priority.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-[10px] text-gray-400 font-medium truncate leading-tight">
                            {req.senderName}
                          </p>

                          <div className="flex justify-between items-center text-[9.5px] text-gray-400 pt-1.5 border-t dark:border-gray-800/60">
                            <span className="font-mono">{req.date}</span>
                            <span className={`font-bold px-2 py-0.5 rounded ${
                              req.status === 'Completed' 
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
                                : req.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                                  : req.status === 'Rejected'
                                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {isRtl 
                                ? req.status === 'Completed' ? 'تکمیل شده' : req.status === 'In Progress' ? 'در حال مدلسازی' : req.status === 'Rejected' ? 'رد شده' : 'در انتظار بررسی'
                                : req.status
                              }
                            </span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Right Column: details */}
                  <div className="lg:col-span-2">
                    {activeObjectRequestId ? (
                      (() => {
                        const req = objectRequests.find(r => r.id === activeObjectRequestId);
                        if (!req) return null;
                        return (
                          <div className="bg-white dark:bg-gray-900 border rounded-2xl p-6 dark:border-gray-800 space-y-6 text-start">
                            <div className="flex justify-between items-start gap-4 border-b pb-4 dark:border-gray-800">
                              <div>
                                <h3 className="text-sm font-extrabold text-gray-800 dark:text-white leading-tight">{req.objectName}</h3>
                                <div className="flex flex-wrap gap-3 items-center text-[10px] text-gray-400 mt-2 font-bold">
                                  <span>Format: <span className="text-amber-600">{req.format}</span></span>
                                  <span>•</span>
                                  <span>Category: <span className="text-[#26B6B6]">{req.category.replace('_', ' ')}</span></span>
                                  <span>•</span>
                                  <span className="font-mono">{req.date}</span>
                                </div>
                              </div>
                              <span className={`text-[10px] px-3 py-1 rounded-full font-black tracking-widest ${
                                req.priority === 'High' 
                                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' 
                                  : req.priority === 'Medium'
                                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                              }`}>
                                {req.priority.toUpperCase()} PRIORITY
                              </span>
                            </div>

                            <div className="space-y-1 text-xs">
                              <h4 className="font-extrabold text-gray-400 uppercase tracking-wider text-[10px]">{isRtl ? 'جزئیات فنی درخواست شده' : 'Requested Details & Specs'}</h4>
                              <div className="p-4 bg-slate-50 dark:bg-gray-950 rounded-xl leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-light border dark:border-gray-800/50">
                                {req.description}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-gray-950 p-4 rounded-xl text-xs border dark:border-gray-800/30">
                              <div className="space-y-1">
                                <h5 className="font-bold text-gray-400 uppercase tracking-wider text-[9.5px]">{isRtl ? 'درخواست دهنده (معمار)' : 'AEC Contact Person'}</h5>
                                <p className="font-extrabold text-gray-800 dark:text-white">{req.senderName}</p>
                              </div>
                              <div className="space-y-1">
                                <h5 className="font-bold text-gray-400 uppercase tracking-wider text-[9.5px]">{isRtl ? 'مختصات تماس مستقیم' : 'Direct Coordinates'}</h5>
                                <p className="text-gray-600 dark:text-gray-400">{req.email}</p>
                                <p className="font-mono text-[11px] text-gray-500">{req.phone}</p>
                              </div>
                            </div>

                            {/* Interactive status updater */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t dark:border-gray-800">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs text-gray-500 font-bold">{isRtl ? 'تغییر وضعیت مدلسازی فمیلی:' : 'Transition Modeling Status:'}</span>
                                <select
                                  value={req.status}
                                  onChange={e => {
                                    const newStatus = e.target.value;
                                    setObjectRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: newStatus } : r));
                                    alert(isRtl ? 'وضعیت درخواست با موفقیت به روز شد.' : 'Modeling request status updated successfully.');
                                  }}
                                  className="text-xs p-2 border rounded-xl bg-gray-50 dark:bg-gray-950 font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                >
                                  <option value="Pending">{isRtl ? 'در انتظار بررسی' : 'Pending Review'}</option>
                                  <option value="In Progress">{isRtl ? 'در حال مدلسازی فمیلی' : 'In Modeling Queue'}</option>
                                  <option value="Completed">{isRtl ? 'تکمیل شده و انتشار یافته' : 'Completed & Released'}</option>
                                  <option value="Rejected">{isRtl ? 'رد شده (غیر قابل مدلسازی)' : 'Rejected'}</option>
                                </select>
                              </div>

                              <button
                                onClick={() => {
                                  // Automatically complete and transition to catalog
                                  setObjectRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Completed' } : r));
                                  alert(isRtl ? 'این فمیلی رسماً تایید شد و کاتالوگ آن آماده اتصال به آرشیو رویت گردید.' : 'Family released. Added to standard Revit spec libraries.');
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black py-2.5 px-4.5 rounded-xl transition-colors cursor-pointer shadow-sm self-stretch sm:self-auto text-center"
                              >
                                {isRtl ? 'تایید نهایی و آماده سازی انتشار' : 'Approve & Release Family'}
                              </button>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="bg-white dark:bg-gray-900 border rounded-2xl p-12 text-center text-xs text-gray-400 dark:border-gray-800">
                        {isRtl ? 'جهت مشاهده جزئیات فنی درخواست و مشخصات معمار، یک مورد را از لیست سمت چپ انتخاب کنید.' : 'Select an active modeling request from the left list to view technical specs and contact coordinates.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* APPROVAL PROGRESS CHAT */}
        {activeTab === 'approval-chat' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <FileCheck className="w-5 h-5 text-[#26B6B6]" />
                <span>{isRtl ? 'میز گفتگوی مستقیم با ناظر فنی کاتالوگ' : 'AEC Supervisor Approval Board'}</span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                {isRtl ? 'با ناظر فنی اختصاصی برند خود جهت ممیزی پارامترها و گواهی‌ها گفتگو کنید.' : 'Direct Slack-like communication with your designated account supervisor manager.'}
              </p>
            </div>

            <div className="p-4 bg-[#26B6B6]/5 rounded-xl border border-[#26B6B6]/20 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#26B6B6] text-white rounded-full flex items-center justify-center font-black text-sm">
                S
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-gray-800 dark:text-white block">{isRtl ? 'مهندس حمیدرضا فرخی (سرپرست ارشد ممیزی کاتالوگ)' : 'Hamidreza Farrokhi (Lead BIM Supervisor)'}</span>
                <span className="text-gray-400 block mt-0.5">{isRtl ? 'پاسخ‌دهی آنلاین: ۲۴ ساعته کاری' : 'Online B2B QA Moderator Desk'}</span>
              </div>
            </div>

            {/* Simulated direct chat window */}
            <div className="space-y-3 max-w-xl mx-auto border dark:border-gray-800 rounded-2xl p-4 h-64 overflow-y-auto bg-slate-50/50 dark:bg-gray-950">
              <div className="p-3 bg-white dark:bg-gray-900 border dark:border-gray-800/80 rounded-xl text-xs max-w-md">
                <span className="font-bold text-[#26B6B6] block mb-0.5">{isRtl ? 'ناظر سیستم فرخی' : 'QA Supervisor'}</span>
                <p>{isRtl ? 'سلام، کاتالوگ پنجره سری آلو-۹۰ بررسی شد. اتصالات پکیج رویت به درستی مپ گردیده است. فردا رسماً تایید می‌شود.' : 'Hello. We checked the window Alu-90 family specs. It is mapped perfectly.'}</p>
              </div>

              <div className="p-3 bg-indigo-50/50 dark:bg-gray-900 border border-indigo-100 dark:border-gray-800/80 rounded-xl text-xs max-w-md mr-0 ml-auto text-start">
                <span className="font-bold text-gray-500 block mb-0.5">{isRtl ? 'شما' : 'Brand Admin'}</span>
                <p>{isRtl ? 'بسیار عالی، سپاسگزارم. برای بقیه کاتالوگ‌ها هم همین روال را ادامه می‌دهیم.' : 'Wonderful. We appreciate your technical validation.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b pb-3">
                <Bell className="w-5 h-5 text-[#26B6B6]" />
                <span>{isRtl ? 'نوتیفیکیشن‌ها و پیام‌های اداری برند' : 'Brand Administrative Alerts'}</span>
              </h2>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-gray-950 rounded-xl border border-slate-100 dark:border-gray-800 text-xs text-gray-400 text-center">
              {isRtl ? 'هیچ اعلان جدیدی وجود ندارد.' : 'No new administrative alerts at this time.'}
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Custom Delete Confirmation Dialog Modal */}
      {deleteConfirmDialog.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5">
            <div className="mx-auto w-12 h-12 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-black text-gray-900 dark:text-white">
                {deleteConfirmDialog.title}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {deleteConfirmDialog.message}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isRtl ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={deleteConfirmDialog.onConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-750 text-white rounded-xl text-xs font-black cursor-pointer transition-colors shadow-sm"
              >
                {isRtl ? 'حذف دائمی' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// MFG Sidebar Navigation links helper
interface MfgSidebarNavListProps {
  activeTab: MFGTab;
  onSelectTab: (tab: MFGTab) => void;
  isRtl: boolean;
  unansweredLeadsCount: number;
  collapsed?: boolean;
  onLogout: () => void;
}

const MfgSidebarNavList: React.FC<MfgSidebarNavListProps> = ({
  activeTab,
  onSelectTab,
  isRtl,
  unansweredLeadsCount,
  collapsed = false,
  onLogout
}) => {
  const items = [
    { id: 'overview' as const, labelFa: 'پیشخوان', labelEn: 'Overview', icon: Grid },
    { id: 'profile' as const, labelFa: 'پروفایل برند', labelEn: 'Brand Profile', icon: Building },
    { id: 'catalog' as const, labelFa: 'انبار آبجکت‌های بیم', labelEn: 'BIM SKUs Inventory', icon: Layers },
    { id: 'followers' as const, labelFa: 'فالوورها (مخاطبین)', labelEn: 'Followers List', icon: Users },
    { id: 'subscription' as const, labelFa: 'اشتراک و صورتحساب', labelEn: 'Subscription & Billing', icon: DollarSign },
    { id: 'analytics' as const, labelFa: 'تحلیل عملکرد کاتالوگ', labelEn: 'Catalog Analytics', icon: BarChart3 },
    { id: 'requests' as const, labelFa: 'درخواست‌ها و سرنخ‌ها', labelEn: 'Requests & Leads', icon: Mail, leadBadge: unansweredLeadsCount > 0 },
    { id: 'approval-chat' as const, labelFa: 'گفتگو با ناظر ممیزی', labelEn: 'Supervisor Chat', icon: FileCheck },
    { id: 'notifications' as const, labelFa: 'اعلان‌ها', labelEn: 'Notifications', icon: Bell },
    { id: 'logout' as const, labelFa: 'خروج از حساب کاربری', labelEn: 'Sign Out', icon: LogOut, isLogout: true }
  ];

  return (
    <ul className="space-y-1 font-medium text-xs leading-none">
      {items.map(item => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        const label = isRtl ? item.labelFa : item.labelEn;

        if (item.isLogout) {
          return (
            <React.Fragment key={item.id}>
              {/* Horizontal divider line with spacing */}
              <li className="my-3 border-t border-gray-150 dark:border-gray-800" />
              <li>
                <button
                  type="button"
                  onClick={onLogout}
                  className={`w-full flex items-center gap-2.5 py-3 rounded-xl transition-all cursor-pointer font-bold border ${
                    collapsed 
                      ? 'justify-center px-0 border-rose-500/20 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10' 
                      : 'px-4 border-rose-500/20 text-rose-600 bg-rose-500/5 hover:bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/15'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </button>
              </li>
            </React.Fragment>
          );
        }

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelectTab(item.id as MFGTab)}
              className={`w-full flex items-center justify-between py-3 rounded-xl transition-all cursor-pointer ${
                active 
                  ? 'bg-[#26B6B6]/10 text-[#26B6B6] font-bold' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800'
              } ${collapsed ? 'justify-center px-0' : 'px-3'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </div>

              {!collapsed && item.leadBadge && (
                <span className="bg-[#26B6B6] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse shrink-0">
                  {isRtl ? 'جدید' : 'NEW'}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
