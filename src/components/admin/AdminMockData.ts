import { 
  AdminAccount, 
  AuditLogEntry, 
  ManufacturerRequest, 
  ReviewObject, 
  SupportTicket, 
  BillingInvoice, 
  RefundRequest,
  ReviewerMetrics
} from './AdminTypes';

// Predefined Admin Accounts
export const SEEDED_ADMINS: AdminAccount[] = [
  {
    id: 'admin-1',
    name: 'علیرضا رضایی',
    email: 'admin@iranbimhub.ir',
    role: 'Super Admin',
    active: true,
    phone: '09121111111',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'admin-2',
    name: 'مریم محمدی',
    email: 'verification@iranbimhub.ir',
    role: 'Manufacturer Verification Admin',
    active: true,
    phone: '09122222222',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'admin-3',
    name: 'امیر محسنی',
    email: 'manager@iranbimhub.ir',
    role: 'Review Team Manager',
    active: true,
    phone: '09123333333',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'admin-4',
    name: 'سهراب سپهری',
    email: 'reviewer1@iranbimhub.ir',
    role: 'Reviewer',
    active: true,
    phone: '09124444444',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'admin-4b',
    name: 'نیما یوشیج',
    email: 'reviewer2@iranbimhub.ir',
    role: 'Reviewer',
    active: true,
    phone: '09124444445',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'admin-5',
    name: 'نیلوفر اکبری',
    email: 'support@iranbimhub.ir',
    role: 'Support & Customer Success',
    active: true,
    phone: '09125555555',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'admin-6',
    name: 'حمید تقوی',
    email: 'finance@iranbimhub.ir',
    role: 'Finance & Subscription',
    active: true,
    phone: '09126666666',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120'
  }
];

// Initial Audit Logs (History of system actions)
export const SEEDED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '1405/04/10 09:30',
    adminName: 'علیرضا رضایی',
    adminRole: 'Super Admin',
    action: 'ویرایش تعرفه اشتراک',
    targetType: 'Subscription Tiers',
    targetName: 'طرح VIP تولیدکنندگان',
    reason: 'بروزرسانی سالانه تعرفه‌ها بر اساس مصوبه هیات مدیره',
    details: 'افزایش قیمت طرح VIP به میزان ۱۵٪ و ارتقاء ظرفیت به ۱۵۰ مدل آماده.'
  },
  {
    id: 'log-2',
    timestamp: '1405/04/12 11:15',
    adminName: 'مریم محمدی',
    adminRole: 'Manufacturer Verification Admin',
    action: 'تایید اصالت تولیدکننده',
    targetType: 'Manufacturer Verification',
    targetName: 'صنایع گرمایشی آذران',
    reason: 'ارائه پروانه بهره‌برداری معتبر و مطابقت مدارک ثبتی شرکت',
  },
  {
    id: 'log-3',
    timestamp: '1405/04/13 14:22',
    adminName: 'سهراب سپهری',
    adminRole: 'Reviewer',
    action: 'تایید آبجکت BIM',
    targetType: 'BIM Object Review',
    targetName: 'پمپ سیرکولاتور خطی ۳ اینچ',
    reason: 'استانداردهای هندسی، پارامترهای LOD 400 و اتصالات پایپینگ کاملاً صحیح است.',
  },
  {
    id: 'log-4',
    timestamp: '1405/04/14 10:05',
    adminName: 'امیر محسنی',
    adminRole: 'Review Team Manager',
    action: 'تغییر ممیز شیء بیم',
    targetType: 'BIM Object Assignment',
    targetName: 'چیلر تراکمی سانتریفیوژ ۱۰۰ تن',
    reason: 'سهراب سپهری مرخصی بود و کار فوری معمار پروژه نیاز داشت.',
    details: 'انتقال پرونده بررسی به ممیز نیما یوشیج جهت تسریع در فرآیند.'
  },
  {
    id: 'log-5',
    timestamp: '1405/04/14 16:45',
    adminName: 'حمید تقوی',
    adminRole: 'Finance & Subscription',
    action: 'صدور بازپرداخت',
    targetType: 'Refund Request',
    targetName: 'شرکت بتن‌سازان پارس',
    reason: 'پرداخت مضاعف بانکی به علت خطای درگاه پرداخت سامان',
    details: 'بازپرداخت ۲۵,۰۰۰,۰۰۰ ریال به شماره کارت ۶۲۷۳-xxxx-xxxx-۱۲۰۲.'
  }
];

// Seeded Pending/Past Manufacturer Onboardings
export const SEEDED_MANUFACTURER_REQUESTS: ManufacturerRequest[] = [
  {
    id: 'mfg-req-1',
    companyName: 'شیرآلات بهداشتی قهرمان',
    brandName: 'Ghahraman Valves',
    ceoName: 'قهرمان سلیمانی',
    phone: '02188887766',
    email: 'info@ghahraman.com',
    licenseNumber: '95/ق/12839',
    licenseFile: 'license_ghahraman_industries.pdf',
    dateSubmitted: '1405/04/13',
    status: 'Pending'
  },
  {
    id: 'mfg-req-2',
    companyName: 'صنایع روشنایی مازی‌نور',
    brandName: 'Mazinoor Lighting',
    ceoName: 'حسین مازیار',
    phone: '02122334455',
    email: 'b2b@mazinoor.ir',
    licenseNumber: '82/م/54932',
    licenseFile: 'mazinoor_industrial_permit.pdf',
    dateSubmitted: '1405/04/14',
    status: 'Pending'
  },
  {
    id: 'mfg-req-3',
    companyName: 'تهویه مطبوع ساراول',
    brandName: 'Saravel HVAC',
    ceoName: 'احمدرضا ساراول',
    phone: '02144556677',
    email: 'support@saravel.com',
    licenseNumber: '70/س/10023',
    licenseFile: 'saravel_hvac_license.pdf',
    dateSubmitted: '1405/04/05',
    status: 'Approved',
    reason: 'مدارک کامل بود و اصالت کارخانه فیزیکی توسط نماینده تایید شد.'
  },
  {
    id: 'mfg-req-4',
    companyName: 'لوله و اتصالات پلی‌ران اتصال',
    brandName: 'Poliran Connection',
    ceoName: 'سهراب یزدانی',
    phone: '02155667788',
    email: 'sales@poliran.com',
    licenseNumber: '89/پ/43212',
    licenseFile: 'poliran_permit_final.pdf',
    dateSubmitted: '1405/04/08',
    status: 'Rejected',
    reason: 'تصویر پروانه بهره‌برداری ارسالی منقضی شده بود و خوانا نبود.'
  }
];

// Seeded Pending/Review objects
export const SEEDED_REVIEW_OBJECTS: ReviewObject[] = [
  {
    id: 'rev-obj-1',
    titleFa: 'دیگ آبگرم چدنی سوپر ۳۰۰۰',
    titleEn: 'Super 3000 Cast Iron Hot Water Boiler',
    category: 'Mechanical',
    manufacturerName: 'صنایع حرارتی شوفاژکار',
    fileSize: '14.2 MB',
    formats: ['RFA', 'IFC'],
    dateSubmitted: '1405/04/12',
    status: 'Pending',
    assignedTo: 'admin-4',
    assignedName: 'سهراب سپهری'
  },
  {
    id: 'rev-obj-2',
    titleFa: 'پنجره یوپی‌وی‌سی دوحالته ترمال‌بریک',
    titleEn: 'UPVC Double-Action Thermal Break Window',
    category: 'Architectural',
    manufacturerName: 'ویستابست',
    fileSize: '8.7 MB',
    formats: ['RFA', 'IFC', 'GSM'],
    dateSubmitted: '1405/04/13',
    status: 'Pending',
    assignedTo: 'admin-4b',
    assignedName: 'نیما یوشیج'
  },
  {
    id: 'rev-obj-3',
    titleFa: 'تابلو برق فشار ضعیف ایستاده سلولی',
    titleEn: 'LV Stand-Alone Cell Switchboard Panel',
    category: 'Electrical',
    manufacturerName: 'صنایع الکتریک البرز',
    fileSize: '18.1 MB',
    formats: ['RFA', 'IFC'],
    dateSubmitted: '1405/04/14',
    status: 'Pending' // Unassigned!
  },
  {
    id: 'rev-obj-4',
    titleFa: 'پمپ سیرکولاتور خطی ۳ اینچ',
    titleEn: '3-Inch In-Line Circulator Pump',
    category: 'Mechanical',
    manufacturerName: 'صنایع گرمایشی آذران',
    fileSize: '6.4 MB',
    formats: ['RFA'],
    dateSubmitted: '1405/04/11',
    status: 'Approved',
    assignedTo: 'admin-4',
    assignedName: 'سهراب سپهری',
    reasonCode: 'Geometry & Parameters Approved',
    reasonDetail: 'استانداردهای هندسی، پارامترهای LOD 400 و اتصالات پایپینگ کاملاً صحیح است.'
  }
];

// Seeded Support Tickets
export const SEEDED_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-101',
    userEmail: 'fathi_bim@gmail.com',
    userRole: 'Modeler',
    subject: 'عدم تطابق کانکتورهای الکتریکی چیلر آب خنک',
    message: 'سلام. من فمیلی چیلر تهویه مطبوع ساراول را دانلود کردم ولی کانکتورهای برقی آن پارامتر جریان فاز ندارند و در رویت ارور میدهد. لطفا اصلاح بفرمایید.',
    category: 'Download Issue',
    status: 'Open',
    dateCreated: '1405/04/14 08:20',
    messages: [
      {
        sender: 'user',
        text: 'سلام. من فمیلی چیلر تهویه مطبوع ساراول را دانلود کردم ولی کانکتورهای برقی آن پارامتر جریان فاز ندارند و در رویت ارور میدهد. لطفا اصلاح بفرمایید.',
        timestamp: '1405/04/14 08:20'
      }
    ]
  },
  {
    id: 'tkt-102',
    userEmail: 'finance@ghahraman.com',
    userRole: 'Manufacturer',
    subject: 'بروز خطا در هنگام ارتقا به پنل VIP و کسر دو باره پول',
    message: 'ما خواستیم اکانت کارخانه قهرمان را به طرح VIP ارتقا دهیم، تراکنش درگاه ملت بار اول خطا داد ولی مبلغ ۴۵,۰۰۰,۰۰۰ ریال کسر شد. بار دوم ارتقا با موفقیت انجام شد ولی آن تراکنش اول هم نهایی شده. لطفاً بررسی و عودت دهید.',
    category: 'Billing',
    status: 'In Progress',
    dateCreated: '1405/04/13 15:40',
    messages: [
      {
        sender: 'user',
        text: 'ما خواستیم اکانت کارخانه قهرمان را به طرح VIP ارتقا دهیم، تراکنش درگاه ملت بار اول خطا داد ولی مبلغ ۴۵,۰۰۰,۰۰۰ ریال کسر شد. بار دوم ارتقا با موفقیت انجام شد ولی آن تراکنش اول هم نهایی شده. لطفاً بررسی و عودت دهید.',
        timestamp: '1405/04/13 15:40'
      },
      {
        sender: 'admin',
        text: 'سلام. همکار محترم، پیام شما دریافت شد و بابت ناهماهنگی پوزش می‌خواهیم. این تیکت جهت بررسی دقیق تراکنش‌های بانکی به واحد مالی ارجاع داده شد.',
        timestamp: '1405/04/13 17:10'
      }
    ]
  },
  {
    id: 'tkt-103',
    userEmail: 'arash_design@outlook.com',
    userRole: 'Modeler',
    subject: 'درخواست راهنمایی جهت دانلود فرمت خانواده رویت ۲۰۲۴',
    message: 'سلام وقت بخیر. آیا آبجکت‌های قرار گرفته در سایت با رویت ۲۰۲۴ سازگار هستند یا خیر؟',
    category: 'General',
    status: 'Resolved',
    dateCreated: '1405/04/10',
    messages: [
      {
        sender: 'user',
        text: 'سلام وقت بخیر. آیا آبجکت‌های قرار گرفته در سایت با رویت ۲۰۲۴ سازگار هستند یا خیر؟',
        timestamp: '1405/04/10'
      },
      {
        sender: 'admin',
        text: 'سلام بله تمام آبجکت‌ها از نسخه Revit 2021 به بالا پشتیبانی می‌کنند و در نسخه ۲۰۲۴ کاملا پایدار هستند.',
        timestamp: '1405/04/10'
      }
    ]
  }
];

// Seeded Billing Invoices
export const SEEDED_INVOICES: BillingInvoice[] = [
  {
    id: 'inv-4001',
    companyName: 'صنایع روشنایی مازی‌نور',
    userEmail: 'b2b@mazinoor.ir',
    userRole: 'Manufacturer',
    planName: 'طرح کارخانه‌ای طلایی',
    amount: 120000000, // 12,000,000 Toman (120,000,000 Rials)
    status: 'Paid',
    date: '1405/04/01'
  },
  {
    id: 'inv-4002',
    companyName: 'شیرآلات بهداشتی قهرمان',
    userEmail: 'finance@ghahraman.com',
    userRole: 'Manufacturer',
    planName: 'طرح VIP تولیدکنندگان',
    amount: 45000000, // 4,500,000 Toman (45,000,000 Rials)
    status: 'Disputed',
    date: '1405/04/13'
  },
  {
    id: 'inv-4003',
    companyName: 'شرکت آریا بتن',
    userEmail: 'payment@ariabeton.ir',
    userRole: 'Manufacturer',
    planName: 'طرح پایه عادی',
    amount: 0,
    status: 'Paid',
    date: '1405/03/25'
  },
  {
    id: 'inv-4004',
    companyName: 'شرکت آذران صنعت',
    userEmail: 'info@azaran.ir',
    userRole: 'Manufacturer',
    planName: 'طرح کارخانه‌ای طلایی',
    amount: 120000000,
    status: 'Refunded',
    date: '1405/04/05'
  }
];

// Seeded Refund Requests
export const SEEDED_REFUNDS: RefundRequest[] = [
  {
    id: 'ref-501',
    invoiceId: 'inv-4002',
    companyName: 'شیرآلات بهداشتی قهرمان',
    amount: 45000000,
    reason: 'خطای تراکنش مضاعف و ارتقای مکرر',
    dateSubmitted: '1405/04/13',
    status: 'Pending'
  },
  {
    id: 'ref-502',
    invoiceId: 'inv-4004',
    companyName: 'شرکت آذران صنعت',
    amount: 120000000,
    reason: 'عدم توانایی آپلود کاتالوگ‌های رویت و انصراف در محدوده ضمانت ۷ روزه برگشت وجه',
    dateSubmitted: '1405/04/04',
    status: 'Approved',
    processedBy: 'حمید تقوی',
    processedDate: '1405/04/05'
  }
];

// Seeded Reviewer Performance Metrics
export const SEEDED_REVIEWER_METRICS: ReviewerMetrics[] = [
  {
    reviewerId: 'admin-4',
    reviewerName: 'سهراب سپهری',
    approvedCount: 42,
    rejectedCount: 8,
    avgTurnaroundHours: 4.2,
    assignedCount: 1
  },
  {
    reviewerId: 'admin-4b',
    reviewerName: 'نیما یوشیج',
    approvedCount: 31,
    rejectedCount: 15,
    avgTurnaroundHours: 6.8,
    assignedCount: 1
  }
];

// Seeded Canned Response Templates
export const CANNED_RESPONSES = [
  {
    id: 'canned-1',
    title: 'تایید رفع مشکل هندسی',
    text: 'کاربر گرامی، مشکل گزارش شده در اتصالات هندسی آبجکت بیم بررسی گردید و با هماهنگی تیم فنی سازنده اصلاح شد. لطفاً فایل جدید را مجدداً دانلود فرمایید.'
  },
  {
    id: 'canned-2',
    title: 'تکمیل مدارک تایید شرکت',
    text: 'شرکت محترم، پروانه بهره‌برداری ارائه شده مخدوش یا فاقد مهر ثبت می‌باشد. لطفاً نسخه معتبر و اسکن شده باکیفیت بالا را مجدداً آپلود فرمایید تا روند تایید به جریان افتد.'
  },
  {
    id: 'canned-3',
    title: 'بررسی مجدد تراکنش مالی',
    text: 'نماینده محترم مالی، درخواست تراکنش ناموفق شما دریافت گردید. جزئیات به درگاه شتاب ارسال شده و در صورت کسر وجه قطعی، بازپرداخت حداکثر تا ۷۲ ساعت انجام خواهد شد.'
  }
];
