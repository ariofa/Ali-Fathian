import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { CATEGORIES, MANUFACTURERS, BIM_OBJECTS } from '../../data';
import { BIMObject } from '../../types';
import { ManufacturerAnalyticsView } from './ManufacturerAnalyticsView';
import { 
  BarChart3, 
  UploadCloud, 
  Mail, 
  Layers, 
  Trash2, 
  Plus, 
  CheckCircle, 
  ChevronRight, 
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
  FileCheck,
  Building,
  HelpCircle,
  Bell,
  Search,
  Filter,
  Check,
  Upload,
  AlertTriangle
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
}

type MFGTab = 
  | 'overview'
  | 'profile'
  | 'catalog'
  | 'subscription'
  | 'analytics'
  | 'crm'
  | 'standards'
  | 'awards'
  | 'approval-chat'
  | 'notifications'
  | 'object-requests';

export const ManufacturerDashboard: React.FC<ManufacturerDashboardProps> = ({
  companyProfile,
  onPublishNewObject,
  onSelectObject,
  onLogout
}) => {
  const { language, t, isRtl, formatNumber } = useLanguage();
  const [activeTab, setActiveTab] = useState<MFGTab>('overview');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      addressFa: 'تهران، خیابان ولیعصر، برج آفتاب، طبقه ۱۲',
      addressEn: '12th Flr, Aftab Tower, Vali-e-Asr Ave, Tehran',
      twitter: 'https://twitter.com/alupan',
      linkedin: 'https://linkedin.com/company/alupan',
      tier: currentTier,
      verificationDocs: [
        { id: 'doc-1', nameFa: 'پروانه بهره‌برداری وزارت صمت', nameEn: 'Industrial Operating License', type: 'PDF', status: 'Verified', date: '۱۴۰۴/۰۲/۱۵' },
        { id: 'doc-2', nameFa: 'گواهینامه تایید صلاحیت فنی مرکز تحقیقات مسکن', nameEn: 'BHRC Quality Certification', type: 'PDF', status: 'Verified', date: '۱۴۰۴/۰۶/۱۰' },
        { id: 'doc-3', nameFa: 'مالیات بر ارزش افزوده ۱۴۰۴', nameEn: 'VAT Declaration Certificate', type: 'PDF', status: 'Pending', date: '۱۴۰۵/۰۲/۲۸' }
      ]
    };
  });

  // Verification document state updates
  const [newDocName, setNewDocName] = useState('');
  const [newDocFile, setNewDocFile] = useState<string | null>(null);

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

  // Brand standards Checklist
  const [standards, setStandards] = useState([
    { id: 'std-1', name: 'ISO 9001 (Quality Management)', code: 'ISO-9001', country: 'International', verified: true },
    { id: 'std-2', name: 'CE Mark (European Conformity)', code: 'CE-AEC', country: 'Europe', verified: true },
    { id: 'std-3', name: 'نشان استاندارد ملی ایران (INSO)', code: 'INSO-7090', country: 'Iran', verified: true },
    { id: 'std-4', name: 'گواهینامه فنی مرکز تحقیقات راه، مسکن و شهرسازی', code: 'BHRC-A2', country: 'Iran', verified: false }
  ]);

  // Brand Portfolio & Awards Case Studies
  const [portfolioProjects, setPortfolioProjects] = useState([
    { id: 'p-1', titleFa: 'مجتمع مسکونی رویال الهیه', titleEn: 'Royal Elahiyeh Residences', architect: 'دفتر معماری دلیری', location: 'تهران، الهیه', year: '۱۴۰۳' },
    { id: 'p-2', titleFa: 'برج باغ نیاوران', titleEn: 'Niavaran Garden Tower', architect: 'مهندس فرزاد دلیری', location: 'تهران، نیاوران', year: '۱۴۰۴' }
  ]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectArch, setNewProjectArch] = useState('');

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
    return !!(brandInfo.verificationDocs && brandInfo.verificationDocs.length > 0);
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
      status: 'Pending',
      date: isRtl ? '۱۴۰۵/۰۴/۰۱' : '2026-07-01'
    };

    setBrandInfo(prev => ({
      ...prev,
      verificationDocs: [...prev.verificationDocs, newDoc]
    }));

    setNewDocName('');
    alert(isRtl ? 'سند رسمی جهت راستی‌آزمایی بارگذاری شد.' : 'Verification documentation uploaded successfully.');
  };

  // Add brand portfolio project
  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProj = {
      id: `p-${Math.random().toString(36).substring(2, 6)}`,
      titleFa: newProjectTitle,
      titleEn: 'AEC Case Study Installation',
      architect: newProjectArch || 'آرشیتکت معاصر',
      location: isRtl ? 'تهران' : 'Tehran',
      year: '۱۴۰۵'
    };

    setPortfolioProjects(prev => [...prev, newProj]);
    setNewProjectTitle('');
    setNewProjectArch('');
    alert(isRtl ? 'نمونه پروژه اجرایی برند ثبت شد.' : 'Portfolio study logged.');
  };

  // Public Preview Visitor Modal State
  const [showPublicPreview, setShowPublicPreview] = useState(false);

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
                  setIsSidebarOpenMobile(false);
                }} 
                isRtl={isRtl}
                unansweredLeadsCount={unansweredLeadsCount}
              />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{isRtl ? 'خروج کارفرمایی' : 'B2B Log Out'}</span>
              </button>
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
            onSelectTab={setActiveTab} 
            isRtl={isRtl}
            unansweredLeadsCount={unansweredLeadsCount}
            collapsed={isSidebarCollapsed}
          />
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2.5 py-2.5 bg-rose-50 dark:bg-rose-950/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSidebarCollapsed ? 'justify-center' : 'px-3'}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>{isRtl ? 'خروج' : 'Exit Panel'}</span>}
          </button>
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
                  onClick={() => setShowPublicPreview(true)}
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                      <button onClick={() => setActiveTab('crm')} className="text-xs text-[#26B6B6] hover:underline font-bold shrink-0">{isRtl ? 'پاسخ‌دهی' : 'Reply'}</button>
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
                    <button onClick={() => setActiveTab('standards')} className="text-xs text-[#26B6B6] hover:underline font-bold shrink-0">{isRtl ? 'مشاهده' : 'View'}</button>
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
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <Building className="w-5 h-5 text-[#26B6B6]" />
                <span>{isRtl ? 'مشخصات رسمی و حقوقی برند کارخانه' : 'B2B Brand Profile & Verification'}</span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                {isRtl ? 'تصویر لوگو، کاتالوگ‌های چاپی، شبکه‌های اجتماعی و اسناد شرکت برای جلب اعتماد معماران ساختمانی.' : 'Manage public presentation specs, company registration files and website links.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Logos & Covers previews */}
              <div className="space-y-6">
                {/* Logo Section */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase block">{isRtl ? 'لوگو برند چاپی' : 'Company Logo'}</label>
                  <div className="flex items-center gap-4">
                    <img src={brandInfo.logoUrl} alt="logo" className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
                    <button 
                      onClick={() => alert(isRtl ? 'شبیه‌ساز بارگذاری عکس با موفقیت اجرا شد' : 'Simulated photo uploader triggered')} 
                      className="text-xs bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 py-1.5 px-3 rounded-lg cursor-pointer"
                    >
                      {isRtl ? 'بارگذاری لوگو جدید' : 'Change logo'}
                    </button>
                  </div>
                </div>

                {/* Cover Section */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase block">{isRtl ? 'تصویر کاور هدر پروفایل' : 'Profile Cover Photo'}</label>
                  <img src={brandInfo.coverUrl} alt="cover" className="w-full h-24 rounded-xl object-cover border border-gray-100" />
                  <button 
                    onClick={() => alert(isRtl ? 'بارگذاری تصویر کاور هدر برند' : 'Simulating cover image update')} 
                    className="text-xs text-[#26B6B6] hover:underline"
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

                {/* Verification Documents Upload */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200">{isRtl ? 'مدارک و گواهی صلاحیت تجاری جهت تایید هویت' : 'Company Verification Documents'}</h4>
                  
                  <div className="space-y-2">
                    {brandInfo.verificationDocs.map(doc => (
                      <div key={doc.id} className="p-3 bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#26B6B6]" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{isRtl ? doc.nameFa : doc.nameEn}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-400 font-mono">{doc.date}</span>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleVerifyDocumentSubmit} className="flex gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder={isRtl ? 'نام مدرک جدید (پروانه کسب، گواهی ثبت برند و...)' : 'New legal document name'}
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="flex-1 text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                    />
                    <button 
                      type="submit" 
                      className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shrink-0"
                    >
                      {isRtl ? 'بارگذاری سند رسمی' : 'Upload doc'}
                    </button>
                  </form>
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

                {/* LINK / REGISTER PROFESSIONAL ACCOUNT OPTION */}
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
            </div>
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

        {/* CRM MESSAGES & platform tickets */}
        {activeTab === 'crm' && (
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
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
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
                      <div className="space-y-4">
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
                    <div key={tick.id} className="p-4 bg-slate-50 dark:bg-gray-950 rounded-xl border border-slate-100 dark:border-gray-800 space-y-2">
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

        {/* STANDARDS & CERTIFICATIONS */}
        {activeTab === 'standards' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#26B6B6]" />
                <span>{isRtl ? 'پایش استانداردهای کیفی در سطح کارخانه' : 'Quality Standards & Compliance Certifications'}</span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                {isRtl ? 'مدیریت و افزودن ایزوها و گواهی‌های استاندارد معتبر ملی و بین‌المللی برند شما.' : 'Link regional structural standards and international ISO ratings to the brand page.'}
              </p>
            </div>

            <div className="space-y-3">
              {standards.map(std => (
                <div key={std.id} className="p-4 bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-extrabold text-gray-800 dark:text-white block">{std.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">Code: {std.code} | Region: {std.country}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    std.verified ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {std.verified ? 'Verified ✓' : 'Under Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AWARDS & PORTFOLIO */}
        {activeTab === 'awards' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <Award className="w-5 h-5 text-[#26B6B6]" />
                <span>{isRtl ? 'افتخارات، نشان‌ها و نمونه پروژه‌های اجرایی' : 'Awards & Case Study Portfolio'}</span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                {isRtl ? 'ثبت پروژه‌های بزرگی که از محصولات شما استفاده کرده‌اند برای جلب نظر دفاتر طراح نما.' : 'Display notable buildings outfitted with your catalog spec blocks.'}
              </p>
            </div>

            {/* Portfolio Grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioProjects.map(proj => (
                <div key={proj.id} className="p-4 bg-slate-50 dark:bg-gray-950 rounded-xl border border-slate-100 dark:border-gray-800 space-y-1 text-xs">
                  <h4 className="font-extrabold text-gray-800 dark:text-white">{isRtl ? proj.titleFa : proj.titleEn}</h4>
                  <p className="text-gray-400 font-medium">Architect: {proj.architect} | {proj.location}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddPortfolio} className="bg-slate-50 dark:bg-gray-950 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200">{isRtl ? 'ثبت رکورد پروژه جدید' : 'Log portfolio study'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  required
                  placeholder={isRtl ? 'نام مجتمع یا پروژه ساختمانی...' : 'Project Name'}
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="text-xs p-2.5 border rounded-lg bg-white dark:bg-gray-900"
                />
                <input 
                  type="text" 
                  placeholder={isRtl ? 'دفتر معماری یا آرشیتکت...' : 'Architect/Design team'}
                  value={newProjectArch}
                  onChange={(e) => setNewProjectArch(e.target.value)}
                  className="text-xs p-2.5 border rounded-lg bg-white dark:bg-gray-900"
                />
              </div>
              <button type="submit" className="bg-[#26B6B6] text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer">
                {isRtl ? 'ثبت نهایی پروژه' : 'Add Project Case'}
              </button>
            </form>
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

        {/* OBJECT REQUESTS TAB */}
        {activeTab === 'object-requests' && (
          <div className="space-y-8 animate-fadeIn text-start">
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <HelpCircle className="w-5 h-5 text-amber-500" />
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

      {/* Visitor Public Preview Modal Representation */}
      {showPublicPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowPublicPreview(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b dark:border-gray-800">
              <h4 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">{isRtl ? 'مشاهده پروفایل برند از دید طراحان' : 'Public Visitor Preview'}</h4>
              <button onClick={() => setShowPublicPreview(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="text-center space-y-2">
                <img src={brandInfo.logoUrl} alt="logo" className="w-16 h-16 rounded-2xl mx-auto object-cover border" />
                <h3 className="font-black text-sm text-gray-800 dark:text-white">{isRtl ? brandInfo.nameFa : brandInfo.nameEn}</h3>
                <span className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full text-[9px]">Verified Producer</span>
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                {isRtl ? brandInfo.descFa : brandInfo.descEn}
              </p>

              <div className="bg-slate-50 dark:bg-gray-950 p-3 rounded-xl space-y-1.5 text-center text-gray-400">
                <p>Website: <span className="text-[#26B6B6] font-bold">{brandInfo.website}</span></p>
                <p>Phone: <span className="font-mono">{brandInfo.phone}</span></p>
              </div>
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
}

const MfgSidebarNavList: React.FC<MfgSidebarNavListProps> = ({
  activeTab,
  onSelectTab,
  isRtl,
  unansweredLeadsCount,
  collapsed = false
}) => {
  const items = [
    { id: 'overview' as const, labelFa: 'پیشخوان اصلی', labelEn: 'Overview Home', icon: Grid },
    { id: 'profile' as const, labelFa: 'پروفایل برند کارخانه', labelEn: 'Brand Profile', icon: Building },
    { id: 'catalog' as const, labelFa: 'کاتالوگ محصولات', labelEn: 'BIM SKUs Inventory', icon: Layers },
    { id: 'subscription' as const, labelFa: 'اشتراک و کارمزد', labelEn: 'Subscription SLA', icon: DollarSign },
    { id: 'analytics' as const, labelFa: 'گزارش و تحلیل آماری', labelEn: 'Catalog Analytics', icon: BarChart3 },
    { id: 'crm' as const, labelFa: 'سرنخ‌ها و تیکت‌ها', labelEn: 'Leads Inbox CRM', icon: Mail, leadBadge: unansweredLeadsCount > 0 },
    { id: 'object-requests' as const, labelFa: 'آبجکت‌های درخواستی کاربران', labelEn: 'Requested BIM Families', icon: HelpCircle },
    { id: 'standards' as const, labelFa: 'گواهی‌ها و استانداردها', labelEn: 'Standards ISO', icon: ShieldCheck },
    { id: 'awards' as const, labelFa: 'افتخارات و پروژه‌ها', labelEn: 'Portfolio Awards', icon: Award },
    { id: 'approval-chat' as const, labelFa: 'گفتگو با ناظر ممیزی', labelEn: 'Supervisor Chat', icon: FileCheck },
    { id: 'notifications' as const, labelFa: 'اعلان‌های سازمانی', labelEn: 'Administrative Alerts', icon: Bell }
  ];

  return (
    <ul className="space-y-1 font-medium text-xs leading-none">
      {items.map(item => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        const label = isRtl ? item.labelFa : item.labelEn;

        return (
          <li key={item.id}>
            <button
              onClick={() => onSelectTab(item.id)}
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
                <span className="bg-[#26B6B6] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                  NEW
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
