import React, { useEffect, useState } from 'react';
import { toast } from './ui/toast';
import { useLanguage } from './LanguageContext';
import { 
  X, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  Lock, 
  Briefcase, 
  Building, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Globe, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { Logo } from './Logo';
import { seedProfileCompletionNotification } from '../lib/notifications';
import { upsertRegisteredUser } from '../lib/usersIndex';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onNavigate?: (view: string) => void;
  // Why was auth requested? Lets the post-registration welcome screen point
  // the user back to their original task (e.g. continuing a download).
  authIntent?: 'download' | 'save' | 'generic';
}

// ---------- Iranian mobile helpers ----------
// Convert Persian/Arabic digits to Latin so typed/inputted numbers validate uniformly.
const toLatinDigits = (s: string): string =>
  s
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

// Normalize to the canonical 09xxxxxxxxx form. Accepts 09..., 9..., +98..., and 0098...
export const normalizeIranMobile = (raw: string): string => {
  let s = toLatinDigits(raw).replace(/[\s\-()]/g, '');
  if (s.startsWith('0098')) s = '0' + s.slice(4);
  else if (s.startsWith('+98')) s = '0' + s.slice(3);
  else if (s.startsWith('98') && s.length === 12) s = '0' + s.slice(2);
  else if (s.startsWith('9') && s.length === 10) s = '0' + s; // tolerate a missing leading 0
  return s;
};

// Iranian mobile numbers start with 09 and are 11 digits in total (09 + 9 digits).
export const isValidIranMobile = (raw: string): boolean => /^09\d{9}$/.test(normalizeIranMobile(raw));

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, onNavigate, authIntent = 'generic' }) => {
  const { t, isRtl, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Registration Multi-Step Wizard State (3 steps: type → expertise → details;
  // the old review "step 4" merged into the single post-registration welcome page).
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1);
  const [regAccountType, setRegAccountType] = useState<'Modeler' | 'Manufacturer' | null>(null);
  
  // Professional disciplines (multi-select)
  const [regExpertise, setRegExpertise] = useState<string[]>([]);
  // Manufacturer org type (single select)
  const [regOrgType, setRegOrgType] = useState<string>('');

  // Step 3 registration fields
  const [regPhone, setRegPhone] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regIsPremium, setRegIsPremium] = useState(false);
  const [regLicenseName, setRegLicenseName] = useState<string>('');
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);

  // Mobile-first registration verification (mock until SMS provider is connected)
  const [regOtpCode, setRegOtpCode] = useState('');
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpVerified, setRegOtpVerified] = useState(false);
  // Resend cooldown — 120s matches the SMS-OTP convention of major Iranian
  // apps (Snapp/Divar ~90–120s); counts down in mm:ss after every send.
  const OTP_RESEND_SECONDS = 120;
  const [otpCooldownLeft, setOtpCooldownLeft] = useState(0);

  // Post-registration WELCOME screen: shows the new user by name and hands
  // them back to the page they came from (instead of an abrupt modal close).
  const [welcomeUser, setWelcomeUser] = useState<any | null>(null);

  // Login Fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const requestedMode = sessionStorage.getItem('iranbimhub_auth_mode');
    const requestedRole = sessionStorage.getItem('iranbimhub_register_role');

    if (requestedMode === 'register') {
      setActiveTab('register');
    } else if (requestedMode === 'login') {
      setActiveTab('login');
    }

    if (requestedRole === 'Manufacturer' || requestedRole === 'Modeler') {
      setRegAccountType(requestedRole);
      setOnboardingStep(1);

      if (requestedRole === 'Manufacturer') {
        // Restore the relationship selected during an earlier registration/profile flow.
        try {
          const savedUser = JSON.parse(localStorage.getItem('iranbimhub_user') || 'null');
          const savedProfile = JSON.parse(localStorage.getItem('iranbimhub_mfg_profile') || 'null');
          const savedRelationship = savedUser?.brandOwnershipType
            || savedUser?.companyType
            || savedProfile?.brandOwnershipType
            || savedProfile?.companyType
            || '';
          const validRelationships = [
            'Direct Manufacturer',
            'Brand Owner',
            'Official Representative / Importer',
            'Distributor / Seller',
            'Other / Needs Review'
          ];

          if (validRelationships.includes(savedRelationship)) {
            setRegOrgType(savedRelationship);
          }
        } catch {
          // Keep the initial selection empty if saved profile data is unavailable or malformed.
          setRegOrgType('');
        }
      }
    }

    sessionStorage.removeItem('iranbimhub_auth_mode');
    sessionStorage.removeItem('iranbimhub_register_role');
  }, [isOpen]);

  // Web OTP API: where the browser supports it, the SMS code is read, filled
  // and verified automatically. Unsupported browsers silently fall back to
  // manual entry. (Placed before the isOpen early-return to keep hook order stable.)
  useEffect(() => {
    if (!isOpen || !regOtpSent || regOtpVerified) return;
    const nav: any = navigator;
    if (typeof window === 'undefined' || !('OTPCredential' in window) || !nav.credentials?.get) return;

    const controller = new AbortController();
    nav.credentials
      .get({ otp: { transport: ['sms'] }, signal: controller.signal })
      .then((otp: any) => {
        const code = otp?.code ? toLatinDigits(String(otp.code)).trim() : '';
        if (code) {
          setRegOtpCode(code);
          verifyOtpCode(code);
        }
      })
      .catch(() => {
        /* user dismissed or not available — manual entry remains */
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, regOtpSent, regOtpVerified]);

  // Resend cooldown ticker (120s → 0)
  useEffect(() => {
    if (otpCooldownLeft <= 0) return;
    const timer = window.setInterval(() => {
      setOtpCooldownLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpCooldownLeft]);

  if (!isOpen) return null;

  const mmss = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(m)}:${pad(s)}`;
  };
  const faMmss = (total: number) => mmss(total).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  // Toggle multi-select expertise for Professional
  const handleToggleExpertise = (val: string) => {
    setRegExpertise(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleRegPhoneChange = (value: string) => {
    setRegPhone(value);
    setRegOtpCode('');
    setRegOtpSent(false);
    setRegOtpVerified(false);
  };

  const invalidPhoneToast = () =>
    toast(isRtl
      ? 'شماره موبایل معتبر نیست. شماره باید ۱۱ رقم و با ۰۹ شروع شود (مثال: 09123456789).'
      : 'Invalid mobile number. It must be 11 digits starting with 09 (e.g., 09123456789).');

  const handleSendMockOtp = () => {
    if (!regPhone.trim()) {
      toast(isRtl ? 'ابتدا شماره موبایل را وارد کنید.' : 'Please enter your mobile number first.');
      return;
    }

    if (!isValidIranMobile(regPhone)) {
      invalidPhoneToast();
      return;
    }

    // Normalize to 09xxxxxxxxx so the account always stores the canonical number.
    setRegPhone(normalizeIranMobile(regPhone));

    // TODO: Replace this mock with backend endpoint POST /api/auth/send-otp connected to SMS provider.
    setRegOtpSent(true);
    setRegOtpVerified(false);
    setRegOtpCode('');
    setOtpCooldownLeft(OTP_RESEND_SECONDS);
    toast(isRtl
      ? 'کد تأیید آزمایشی ارسال شد. تا اتصال پنل پیامکی، کد ۱۲۳۴۵۶ را وارد کنید.'
      : 'Mock verification code sent. Until SMS provider is connected, use code 123456.'
    );
  };

  const verifyOtpCode = (code: string) => {
    // TODO: Replace this mock with backend endpoint POST /api/auth/verify-otp.
    if (toLatinDigits(code).trim() === '123456') {
      setRegOtpVerified(true);
      toast(isRtl ? 'شماره موبایل با موفقیت تأیید شد.' : 'Mobile number verified successfully.');
      return;
    }
    toast(isRtl ? 'کد تأیید نادرست است.' : 'Incorrect verification code.');
  };

  const handleVerifyMockOtp = () => verifyOtpCode(regOtpCode);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onboardingStep < 3) {
      setOnboardingStep(3);
      return;
    }

    if (!isValidIranMobile(regPhone)) {
      invalidPhoneToast();
      return;
    }

    if (regAccountType === 'Manufacturer') {
      if (!regName.trim() || !regPhone.trim()) {
        toast(isRtl ? 'برای ثبت‌نام اولیه برند، نام برند/شرکت و شماره موبایل الزامی است.' : 'For initial brand signup, brand/company name and mobile number are required.');
        return;
      }

      if (!regOtpVerified) {
        toast(isRtl ? 'لطفاً شماره موبایل را با کد پیامکی تأیید کنید.' : 'Please verify your mobile number with the SMS code.');
        return;
      }

      if (!regAgreeTerms) {
        toast(isRtl ? 'لطفاً موافقت خود با قوانین و مقررات را تایید کنید.' : 'Please agree to the Terms of Service.');
        return;
      }

      // Manufacturer signup is intentionally lightweight: after mobile verification,
      // the rest of brand/legal profile is completed inside the manufacturer dashboard.
      handleFinalizeRegistration();
      return;
    }

    if (!regPhone || !regName || !regPassword) {
      toast(isRtl ? 'لطفاً تمامی فیلدهای اجباری را تکمیل نمایید.' : 'Please fill in all required fields.');
      return;
    }

    if (!regOtpVerified) {
      toast(isRtl ? 'لطفاً شماره موبایل را با کد پیامکی تأیید کنید.' : 'Please verify your mobile number with the SMS code.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      toast(isRtl ? 'رمز عبور و تایید آن با هم مطابقت ندارند.' : 'Password and confirmation do not match.');
      return;
    }

    if (!regAgreeTerms) {
      toast(isRtl ? 'لطفاً موافقت خود با قوانین و مقررات را تایید کنید.' : 'Please agree to the Terms of Service.');
      return;
    }

    // The review step and welcome screen were merged into ONE post-registration
    // page, so BIM professionals also finalize right here.
    handleFinalizeRegistration();
  };

  const handleFinalizeRegistration = () => {
    // Determine mapping from expertise to Modeler's system roles
    let mappedRoles: string[] = [];
    let mappedTopics: string[] = [];

    if (regAccountType === 'Modeler') {
      regExpertise.forEach(exp => {
        if (exp === 'Architectural') {
          mappedRoles.push('Architect');
          mappedTopics.push('Facades', 'Interior Design');
        } else if (exp === 'Structural') {
          mappedRoles.push('Structural Engineer');
          mappedTopics.push('Structural Concrete');
        } else if (exp === 'Mechanical') {
          mappedRoles.push('MEP Engineer');
          mappedTopics.push('HVAC', 'Sanitary Ware');
        } else if (exp === 'Electrical') {
          mappedRoles.push('MEP Engineer');
          mappedTopics.push('Electrical Fittings');
        } else if (exp === 'Planning') {
          mappedRoles.push('Project Manager');
          mappedTopics.push('Sustainable Materials');
        } else if (exp === 'Other') {
          mappedRoles.push('Architect');
          mappedTopics.push('Acoustics');
        }
      });
      if (mappedRoles.length === 0) mappedRoles = ['Architect'];
      if (mappedTopics.length === 0) mappedTopics = ['Sustainable Materials'];
    }

    const newUser = {
      name: regName,
      fullName: regName,
      phone: normalizeIranMobile(regPhone),
      email: regEmail || null,
      role: regAccountType, // Modeler or Manufacturer
      isPremium: regIsPremium,
      authMethod: regAccountType === 'Manufacturer' ? 'sms_otp' : 'password_with_sms_verification',
      password: regAccountType === 'Manufacturer' ? null : regPassword,
      selectedRoles: mappedRoles,
      selectedTopics: mappedTopics,
      companyType: regAccountType === 'Manufacturer' ? regOrgType : null,
      brandOwnershipType: regAccountType === 'Manufacturer' ? regOrgType : null,
      companyName: regAccountType === 'Manufacturer' ? regName : null,
      phoneVerified: regOtpVerified,
      verificationStatus: regAccountType === 'Manufacturer' ? 'Pending Brand Documents' : 'Approved',
      brandVerificationStatus: regAccountType === 'Manufacturer' ? 'not_started' : 'not_required',
      brandPublishStatus: regAccountType === 'Manufacturer' ? 'private_draft' : 'not_required',
      licenseFile: regLicenseName || null
    };

    // Store in global users database
    localStorage.setItem('iranbimhub_user', JSON.stringify(newUser));

    // Geo-aligned analytics base: upsert this account into the registered-users
    // index (manufacturer panel reads the REAL province distribution from it).
    upsertRegisteredUser({
      phone: newUser.phone,
      name: newUser.fullName,
      role: newUser.role || 'Modeler',
      company: regAccountType === 'Manufacturer' ? regName : undefined
    });

    // Item 13 — first inbox notification for new BIM professionals: a gentle
    // push to complete «پروفایل من» (deep-links to the profile tab).
    if (regAccountType === 'Modeler') {
      seedProfileCompletionNotification(newUser.phone, newUser.fullName, isRtl);
    }

    // For manufacturers, also seed the company profile details instantly
    if (regAccountType === 'Manufacturer') {
      const mfgProfile = {
        companyName: regName,
        desc: isRtl 
          ? `پروفایل اولیه ${regName}. انتشار عمومی برند پس از ارزیابی مدارک رسمی فعال می‌شود.` 
          : `${regName} draft brand profile. Public publishing is enabled after official document evaluation.`,
        website: `https://${regName.toLowerCase().replace(/\s+/g, '') || 'brand'}.ir`,
        email: regEmail || null,
        phone: normalizeIranMobile(regPhone),
        tier: regIsPremium ? 'VIP' : 'Free',
        companyType: regOrgType,
        brandOwnershipType: regOrgType,
        brandVerificationStatus: 'not_started',
        brandPublishStatus: 'private_draft',
        officialDocs: {
          nationalId: '',
          registrationNumber: '',
          officialGazetteUrl: '',
          officialGazetteFile: '',
          representativeLetterFile: '',
          adminNote: ''
        },
        isPendingVerification: true,
        licenseFile: regLicenseName || null
      };
      localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(mfgProfile));
    }

    // Instead of closing the modal abruptly, show the personalized welcome
    // screen (name + account details). The actual login hand-off happens on
    // «ادامه», and App navigates the user back to the page they came from.
    setWelcomeUser(newUser);
  };

  // Complete the flow from the welcome screen (the modal ✕ does the same so a
  // freshly-registered user is never stranded in a logged-out limbo).
  const handleWelcomeContinue = () => {
    if (!welcomeUser) return;
    onLoginSuccess(welcomeUser);
    setWelcomeUser(null);
    onClose();
  };

  // Welcome-screen CTA label: brand accounts enter the brand panel; everyone
  // else returns to their original context (e.g. the download they attempted).
  const welcomeCtaLabel = welcomeUser?.role === 'Manufacturer'
    ? (isRtl ? 'ورود به پنل برند تولیدکننده' : 'Enter the Manufacturer Brand Panel')
    : authIntent === 'download'
      ? (isRtl ? 'بازگشت به صفحهٔ محصول و ادامهٔ دانلود' : 'Back to the Product Page & Continue Downloading')
      : authIntent === 'save'
        ? (isRtl ? 'بازگشت و تکمیل علاقه‌مندی‌ها' : 'Back & Complete Your Favorites')
        : (isRtl ? 'ورود به ایران‌بیم‌هاب و ادامهٔ مسیر' : 'Enter IranBIMhub & Continue');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || !loginPassword) {
      toast(isRtl ? 'لطفاً شماره تلفن همراه و رمز عبور را وارد کنید.' : 'Please enter your phone number and password.');
      return;
    }

    if (!isValidIranMobile(loginPhone)) {
      invalidPhoneToast();
      return;
    }
    const normalizedLoginPhone = normalizeIranMobile(loginPhone);

    // Check if there's a stored user matching this session
    const storedUserStr = localStorage.getItem('iranbimhub_user');
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      if (normalizeIranMobile(storedUser.phone || '') === normalizedLoginPhone && storedUser.password === loginPassword) {
        onLoginSuccess(storedUser);
        onClose();
        toast(isRtl ? `خوش آمدید، ورود موفقیت‌آمیز بود!` : `Welcome back, login successful!`);
        return;
      }
    }

    // Demo-mode fallback (no fabricated persona — clearly labelled placeholder)
    const mockUser = {
      name: isRtl ? 'کاربر نمایشی (حالت آزمایشی)' : 'Demo User (sandbox)',
      fullName: isRtl ? 'کاربر نمایشی (حالت آزمایشی)' : 'Demo User (sandbox)',
      phone: normalizedLoginPhone,
      email: '',
      role: 'Modeler',
      isPremium: false,
      selectedRoles: [],
      selectedTopics: []
    };
    
    localStorage.setItem('iranbimhub_user', JSON.stringify(mockUser));
    onLoginSuccess(mockUser);
    onClose();
    toast(isRtl ? `ورود موفقیت‌آمیز بود!` : `Login successful!`);
  };

  const mockGoogleSignup = () => {
    // Check if there is an existing phone-verified account registered in localStorage
    const storedUserStr = localStorage.getItem('iranbimhub_user');
    if (!storedUserStr) {
      toast(isRtl 
        ? 'خطا: ورود با گوگل غیرفعال است! حساب کاربری متصل به گوگل تنها در صورتی مجاز است که ابتدا با شماره تلفن همراه و تایید پیامکی (SMS OTP) ثبت‌نام شده باشد. لطفاً ابتدا از بخش ثبت‌نام، حساب خود را ایجاد کنید.' 
        : 'Error: Google Sign-In is restricted! Google authentication is only allowed for existing accounts registered with a phone number and SMS OTP first. Please sign up with your phone number first.'
      );
      return;
    }

    const storedUser = JSON.parse(storedUserStr);
    toast(isRtl 
      ? `ورود با گوگل با موفقیت انجام شد! خوش آمدید ${storedUser.fullName || storedUser.name}` 
      : `Google Sign-In successful! Welcome back, ${storedUser.fullName || storedUser.name}`
    );
    onLoginSuccess(storedUser);
    onClose();
  };

  const triggerMockFileUpload = () => {
    const fileNames = [
      'business_license_1405.pdf',
      'company_registration_docs.zip',
      'iran_mfg_license_signed.pdf',
      'mfg_bhrc_qualification.pdf'
    ];
    const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
    setRegLicenseName(randomName);
    toast(isRtl 
      ? `فایل سند رسمی «${randomName}» با موفقیت جهت تایید پیوست شد.` 
      : `Legal file "${randomName}" attached successfully.`
    );
  };

  // Step 2 categories config
  const expertiseOptions = [
    { id: 'Architectural', labelFa: 'معماری', labelEn: 'Architectural', descFa: 'طراحان فاز دو و مدل‌سازان معمار', descEn: 'Architects and architectural BIM modelers' },
    { id: 'Structural', labelFa: 'سازه', labelEn: 'Structural', descFa: 'مهندسان عمران و طراحان سازه', descEn: 'Structural/civil engineers' },
    { id: 'Mechanical', labelFa: 'تاسیسات مکانیکی (MEP)', labelEn: 'Mechanical (MEP)', descFa: 'مهندسان مکانیک و طراحان تأسیسات', descEn: 'Mechanical engineers and HVAC/plumbing designers' },
    { id: 'Electrical', labelFa: 'تاسیسات الکتریکی (MEP)', labelEn: 'Electrical (MEP)', descFa: 'مهندسان برق و طراحان قدرت', descEn: 'Electrical engineers and lighting/power designers' },
    { id: 'Planning', labelFa: 'برنامه‌ریزی و مدیریت پروژه', labelEn: 'Planning & Project Management', descFa: 'برنامه‌ریزان ساختمانی و مدیران پروژه', descEn: 'Urban/construction planners, project coordinators' },
    { id: 'Other', labelFa: 'سایر / مدل‌ساز عمومی BIM', labelEn: 'Other / General BIM Modeler', descFa: 'سایر نقش‌ها و تخصص‌های مدل‌سازی', descEn: 'Roles not listed above' }
  ];

  const orgTypeOptions = [
    {
      id: 'Direct Manufacturer',
      labelFa: 'تولیدکننده مستقیم',
      labelEn: 'Direct Manufacturer',
      descFa: 'شرکتی که خودش محصول ساختمانی را تولید می‌کند و مالک فرآیند تولید است.',
      descEn: 'Company that directly manufactures the building product.'
    },
    {
      id: 'Brand Owner',
      labelFa: 'صاحب برند',
      labelEn: 'Brand Owner',
      descFa: 'مالک برند تجاری هستید، حتی اگر تولید را به کارخانه دیگری سپرده باشید.',
      descEn: 'You own the product brand, even if production is outsourced.'
    },
    {
      id: 'Official Representative / Importer',
      labelFa: 'نماینده رسمی / واردکننده رسمی',
      labelEn: 'Official Representative / Importer',
      descFa: 'نمایندگی یا مجوز رسمی برای معرفی و عرضه محصولات یک برند دارید.',
      descEn: 'You have official authorization to represent or import a brand.'
    },
    {
      id: 'Distributor / Seller',
      labelFa: 'توزیع‌کننده / فروشنده',
      labelEn: 'Distributor / Seller',
      descFa: 'فروشنده یا توزیع‌کننده هستید. صفحه رسمی برند فقط با مدرک نمایندگی یا مالکیت منتشر می‌شود.',
      descEn: 'You sell/distribute products. Official brand pages require ownership or authorization proof.'
    },
    {
      id: 'Other / Needs Review',
      labelFa: 'سایر / نیازمند بررسی',
      labelEn: 'Other / Needs Review',
      descFa: 'وضعیت شما در گزینه‌های بالا نیست و باید توسط واحد ارزیابی بررسی شود.',
      descEn: 'Your case does not fit above options and needs evaluation team review.'
    }
  ];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 relative flex flex-col transition-all text-gray-800 dark:text-gray-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        id="auth-modal-container"
      >
        {/* Close Button — on the welcome screen it completes the login, not abandon it */}
        <button
          onClick={() => (welcomeUser ? handleWelcomeContinue() : onClose())}
          className="absolute top-5 end-5 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer z-10"
          id="btn-close-auth-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="bg-gradient-to-b from-[#26B6B6]/10 to-transparent p-6 text-center space-y-2 flex flex-col items-center">
          <Logo className="h-9 justify-center" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isRtl 
              ? 'یک قدم تا ورود به جامعهٔ ایران‌بیم‌هاب' 
              : 'One step to joining the IranBIMhub community'
            }
          </p>
        </div>

        {/* Tab Selection — hidden while the post-registration welcome screen is shown */}
        {!welcomeUser && (
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-6">
          <button
            onClick={() => {
              setActiveTab('login');
              setOnboardingStep(1);
            }}
            className={`flex-1 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'border-[#26B6B6] text-[#26B6B6]'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-400'
            }`}
            id="tab-sign-in"
          >
            {isRtl ? 'ورود به حساب کاربری' : 'Sign In'}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-[#26B6B6] text-[#26B6B6]'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-400'
            }`}
            id="tab-create-account"
          >
            {isRtl ? 'ایجاد حساب کاربری جدید' : 'Create Account'}
          </button>
        </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {welcomeUser ? (
            /* ================= POST-REGISTRATION WELCOME ================= */
            <div className="space-y-6 text-center animate-fadeIn pt-2" id="wizard-welcome-screen">

              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-emerald-400/25 animate-ping" />
                <div className="relative w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-black text-[#26B6B6]">
                  {isRtl ? 'ثبت‌نام شما با موفقیت انجام شد' : 'Your registration was completed successfully'}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white leading-snug px-2">
                  {isRtl
                    ? `${welcomeUser.name || ''} عزیز، به ایران‌بیم‌هاب خوش آمدید`
                    : `Welcome to IranBIMhub${welcomeUser.name ? `, ${welcomeUser.name}` : ''}`}
                </h3>
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs mx-auto">
                  {welcomeUser.role === 'Manufacturer'
                    ? (isRtl
                        ? 'حساب برند شما ساخته شد. برای انتشار عمومی صفحه برند، مدارک رسمی را در پنل برند تکمیل کنید.'
                        : 'Your brand account was created. Complete the official documents in the brand panel to publish your brand page.')
                    : (isRtl
                        ? 'حساب کاربری شما آماده است؛ می‌توانید مسیر خود را دقیقاً از همان‌جایی که بودید ادامه دهید.'
                        : 'Your account is ready; you can continue exactly from where you left off.')}
                </p>
              </div>

              {/* Identity recap chips (merged from the former review step) */}
              <div className="bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3.5 flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold">
                <span className="bg-[#26B6B6]/10 text-[#087F7A] dark:text-[#22D3EE] px-2.5 py-1 rounded-lg">
                  {welcomeUser.role === 'Manufacturer'
                    ? (isRtl ? 'حساب تولیدکننده / برند' : 'Manufacturer / Brand Account')
                    : (isRtl ? 'کاربر حرفه‌ای BIM' : 'BIM Professional')}
                </span>
                {welcomeUser.role === 'Manufacturer' && welcomeUser.brandOwnershipType && (
                  <span className="bg-[#26B6B6]/10 text-[#087F7A] dark:text-[#22D3EE] px-2.5 py-1 rounded-lg">
                    {isRtl
                      ? (orgTypeOptions.find(o => o.id === welcomeUser.brandOwnershipType)?.labelFa || welcomeUser.brandOwnershipType)
                      : welcomeUser.brandOwnershipType}
                  </span>
                )}
                {welcomeUser.role !== 'Manufacturer' && regExpertise.length > 0 && regExpertise.map(exp => (
                  <span key={exp} className="bg-[#26B6B6]/10 text-[#087F7A] dark:text-[#22D3EE] px-2.5 py-1 rounded-lg">
                    {isRtl ? (expertiseOptions.find(o => o.id === exp)?.labelFa || exp) : exp}
                  </span>
                ))}
                {welcomeUser.phone && (
                  <span className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg font-mono" dir="ltr">
                    {welcomeUser.phone}
                  </span>
                )}
                {welcomeUser.email && (
                  <span className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg" dir="ltr">
                    {welcomeUser.email}
                  </span>
                )}
                {welcomeUser.role === 'Manufacturer' && welcomeUser.licenseFile && (
                  <span className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg inline-flex items-center gap-1" dir="ltr">
                    <Check className="w-3 h-3 stroke-[3]" />
                    {welcomeUser.licenseFile}
                  </span>
                )}
              </div>

              {welcomeUser.role !== 'Manufacturer' && authIntent === 'download' && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/40 rounded-xl px-4 py-2.5 leading-relaxed">
                  {isRtl
                    ? 'می‌توانید دانلود فایل موردنظر را از همان صفحهٔ محصول ادامه دهید.'
                    : 'You can continue downloading the file right from the same product page.'}
                </p>
              )}

              <button
                onClick={handleWelcomeContinue}
                className="w-full bg-[#26B6B6] hover:bg-[#1e9494] text-white py-3.5 rounded-2xl text-xs font-black transition-all hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                id="btn-welcome-continue"
              >
                <span>{welcomeCtaLabel}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4 stroke-[2]" /> : <ArrowRight className="w-4 h-4 stroke-[2]" />}
              </button>
            </div>
          ) : activeTab === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-4" id="form-login">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#26B6B6]" />
                  <span>{isRtl ? 'شماره موبایل، شناسه اصلی حساب (اجباری)' : 'Mobile number, main account ID (Required)'}</span>
                </label>
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  dir="ltr"
                  autoComplete="tel-national"
                  placeholder={isRtl ? 'مثال: 09123456789' : 'e.g., 09123456789'}
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full text-xs p-3.5 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{isRtl ? 'رمز عبور' : 'Password'}</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full text-xs p-3.5 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#26B6B6] hover:bg-[#1e9494] text-white py-3.5 rounded-xl text-xs font-bold transition-all hover:shadow-md cursor-pointer"
                id="btn-login-submit"
              >
                {isRtl ? 'ورود به سامانه ایران‌بیم‌هاب' : 'Sign In to IranBIMhub'}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-gray-400 uppercase tracking-widest">{isRtl ? 'یا' : 'Or'}</span>
                <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
              </div>

              <button
                type="button"
                onClick={mockGoogleSignup}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-950 text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer text-gray-600 dark:text-gray-300"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.61 0 3.05.55 4.19 1.64l3.14-3.14C17.43 1.68 14.9 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 6.8 8.76 5.04 12 5.04z"/>
                  <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.61-.21-2.38H12v4.5h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.6 2.8c2.1-1.94 3.32-4.8 3.32-8.5z"/>
                  <path fill="#FBBC05" d="M5.1 14.9c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 7.5C.55 9.4 0 11.6 0 14s.55 4.6 1.5 6.5l3.6-2.8z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.96-1.08 7.94-2.91l-3.6-2.8c-1.11.75-2.52 1.21-4.34 1.21-3.24 0-5.99-1.76-6.91-4.46l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
                </svg>
                <span>{isRtl ? 'ورود با حساب گوگل' : 'Continue with Google'}</span>
              </button>
            </form>
          ) : (
            /* ================= REGISTER WIZARD ================= */
            <div className="space-y-6" id="register-wizard-container">
              {/* Progress Indicator — fully Persian in FA, fully English in EN */}
              <div className="flex items-center justify-between text-xs text-gray-400 pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="font-bold text-[#26B6B6]">
                  {isRtl
                    ? `مرحله ${onboardingStep.toLocaleString('fa-IR')} از ${(3).toLocaleString('fa-IR')}`
                    : `Step ${onboardingStep} of 3`}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        onboardingStep >= step 
                          ? 'w-6 bg-[#26B6B6]' 
                          : 'w-2 bg-gray-200 dark:bg-gray-800'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: Account Type Selection */}
              {onboardingStep === 1 && (
                <div className="space-y-4 animate-fadeIn" id="wizard-step-1">
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-extrabold text-gray-800 dark:text-white">
                      {isRtl ? 'نوع حساب کاربری خود را انتخاب کنید' : 'Select Your Account Type'}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {isRtl 
                        ? 'این تصمیم مسیر دسترسی به ویژگی‌ها و پنل‌های تخصصی شما را تعیین می‌کند' 
                        : 'This decision defines your workspace layout and target features.'
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Modeler Card */}
                    <div 
                      onClick={() => setRegAccountType('Modeler')}
                      className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 hover:shadow-md ${
                        regAccountType === 'Modeler'
                          ? 'border-[#26B6B6] bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10'
                          : 'border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/40 hover:border-gray-300'
                      }`}
                      id="card-select-modeler"
                    >
                      {regAccountType === 'Modeler' && (
                        <div className="absolute top-3 right-3 bg-[#26B6B6] text-white p-1 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        regAccountType === 'Modeler' 
                          ? 'bg-[#26B6B6] text-white' 
                          : 'bg-white dark:bg-gray-800 text-gray-400'
                      }`}>
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-800 dark:text-white">
                          {isRtl ? 'کاربر حرفه‌ای BIM' : 'BIM Professional'}
                        </h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          {isRtl 
                            ? 'جستجو، دانلود و سازماندهی آبجکت‌های BIM برای پروژه‌های شما (معماران، مهندسان، طراحان).' 
                            : 'Search, download, and organize BIM objects for your architectural and engineering projects.'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Manufacturer Card */}
                    <div 
                      onClick={() => setRegAccountType('Manufacturer')}
                      className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 hover:shadow-md ${
                        regAccountType === 'Manufacturer'
                          ? 'border-[#26B6B6] bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10'
                          : 'border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/40 hover:border-gray-300'
                      }`}
                      id="card-select-manufacturer"
                    >
                      {regAccountType === 'Manufacturer' && (
                        <div className="absolute top-3 right-3 bg-[#26B6B6] text-white p-1 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        regAccountType === 'Manufacturer' 
                          ? 'bg-[#26B6B6] text-white' 
                          : 'bg-white dark:bg-gray-800 text-gray-400'
                      }`}>
                        <Building className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-800 dark:text-white">
                          {isRtl ? 'تولیدکننده / برند' : 'Manufacturer / Brand'}
                        </h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          {isRtl 
                            ? 'آپلود محصولات خود، دیده‌شدن توسط طراحان ساختمان و مشخص شدن در پروژه‌های واقعی.' 
                            : 'Upload your products, get discovered by architects, and get specified into real construction projects.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!regAccountType}
                      onClick={() => setOnboardingStep(2)}
                      className="bg-[#26B6B6] hover:bg-[#1e9494] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      id="btn-step1-next"
                    >
                      <span>{isRtl ? 'مرحله بعدی' : 'Next Step'}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Role / Field of Expertise (Branching) */}
              {onboardingStep === 2 && (
                <div className="space-y-4 animate-fadeIn" id="wizard-step-2">
                  {regAccountType === 'Modeler' ? (
                    /* BIM Professional Branch (Multi-select) */
                    <div className="space-y-4">
                      <div className="text-center space-y-1">
                        <h3 className="text-sm font-extrabold text-gray-800 dark:text-white flex items-center justify-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-[#26B6B6]" />
                          <span>{isRtl ? 'زمینه تخصص شما چیست؟' : 'What is your field of expertise?'}</span>
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          {isRtl 
                            ? 'می‌توانید یک یا چند گزینه را همزمان انتخاب کنید' 
                            : 'Select one or more professional disciplines to customize your feed.'
                          }
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {expertiseOptions.map((opt) => {
                          const isSelected = regExpertise.includes(opt.id);
                          return (
                            <div
                              key={opt.id}
                              onClick={() => handleToggleExpertise(opt.id)}
                              className={`p-4.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 hover:shadow-sm ${
                                isSelected
                                  ? 'border-[#26B6B6] bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10'
                                  : 'border-gray-100 dark:border-gray-800 bg-slate-50/20 dark:bg-gray-950/30'
                              }`}
                            >
                              <div className={`mt-0.5 rounded-full p-0.5 ${isSelected ? 'bg-[#26B6B6] text-white' : 'border border-gray-300 text-transparent'}`}>
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <div className="space-y-0.5 text-start">
                                <h4 className="text-xs font-bold text-gray-800 dark:text-white">
                                  {isRtl ? opt.labelFa : opt.labelEn}
                                </h4>
                                <p className="text-[9.5px] text-gray-400 leading-normal">
                                  {isRtl ? opt.descFa : opt.descEn}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Manufacturer Branch (Single-select) */
                    <div className="space-y-4">
                      <div className="text-center space-y-1">
                        <h3 className="text-sm font-extrabold text-gray-800 dark:text-white flex items-center justify-center gap-1.5">
                          <Building className="w-4 h-4 text-[#26B6B6]" />
                          <span>{isRtl ? 'نقش شما نسبت به برند چیست؟' : 'What is your relationship to the brand?'}</span>
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          {isRtl 
                            ? 'این انتخاب مشخص می‌کند برای انتشار عمومی صفحه برند چه مدارکی باید توسط واحد ارزیابی بررسی شود.' 
                            : 'This determines what documents the evaluation team needs before public brand publishing.'
                          }
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {orgTypeOptions.map((opt) => {
                          const isSelected = regOrgType === opt.id;
                          return (
                            <div
                              key={opt.id}
                              onClick={() => setRegOrgType(opt.id)}
                              className={`p-4.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 hover:shadow-sm ${
                                isSelected
                                  ? 'border-[#26B6B6] bg-[#26B6B6]/5 dark:bg-[#26B6B6]/10'
                                  : 'border-gray-100 dark:border-gray-800 bg-slate-50/20 dark:bg-gray-950/30'
                              }`}
                            >
                              <div className={`mt-0.5 rounded-full p-0.5 ${isSelected ? 'bg-[#26B6B6] text-white' : 'border border-gray-300 text-transparent'}`}>
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <div className="space-y-0.5 text-start">
                                <h4 className="text-xs font-bold text-gray-800 dark:text-white">
                                  {isRtl ? opt.labelFa : opt.labelEn}
                                </h4>
                                <p className="text-[9.5px] text-gray-400 leading-normal">
                                  {isRtl ? opt.descFa : opt.descEn}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-100 dark:border-amber-900 p-3 flex items-start gap-2.5 text-start">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[10.5px] leading-relaxed text-amber-800 dark:text-amber-200">
                          {isRtl
                            ? 'ثبت‌نام اولیه سریع است؛ اما صفحه برند و محصولات فقط پس از ارسال روزنامه رسمی، مدارک مالکیت یا نمایندگی و تأیید واحد ارزیابی عمومی می‌شود.'
                            : 'Initial signup is quick; public brand/product pages are enabled only after official gazette, ownership/representation documents, and evaluation team approval.'
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(1)}
                      className="border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      id="btn-step2-back"
                    >
                      {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                      <span>{isRtl ? 'مرحله قبلی' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={regAccountType === 'Modeler' ? regExpertise.length === 0 : !regOrgType}
                      onClick={() => setOnboardingStep(3)}
                      className="bg-[#26B6B6] hover:bg-[#1e9494] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      id="btn-step2-next"
                    >
                      <span>{isRtl ? 'مرحله بعدی' : 'Next Step'}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Standard Account Details */}
              {onboardingStep === 3 && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn" id="wizard-step-3">
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-extrabold text-gray-800 dark:text-white">
                      {regAccountType === 'Manufacturer'
                        ? (isRtl ? 'ثبت‌نام اولیه برند را تکمیل کنید' : 'Complete Initial Brand Signup')
                        : (isRtl ? 'اطلاعات نهایی حساب کاربری را تکمیل کنید' : 'Complete Your Profile Details')
                      }
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed max-w-md mx-auto">
                      {regAccountType === 'Manufacturer'
                        ? (isRtl
                            ? 'در این مرحله فقط نام برند/شرکت و تأیید شماره موبایل کافی است. اطلاعات حقوقی، روزنامه رسمی و فایل‌های BIM بعداً در پنل برند تکمیل می‌شود.'
                            : 'At this step, only brand/company name and mobile verification are required. Legal documents, official gazette, and BIM files are completed later in the brand panel.')
                        : (isRtl
                            ? 'شماره موبایل شناسه اصلی حساب شماست؛ ایمیل اختیاری است.'
                            : 'Mobile number is the main account ID; email is optional.')
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-start">
                    {/* Name/Company */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#26B6B6]" />
                        <span>
                          {regAccountType === 'Manufacturer' 
                            ? (isRtl ? 'نام رسمی شرکت / برند (اجباری)' : 'Official Company/Brand Name (Required)')
                            : (isRtl ? 'نام و نام خانوادگی (اجباری)' : 'Full Name (Required)')
                          }
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={regAccountType === 'Manufacturer' ? (isRtl ? 'مثال: شرکت ساختمانی نمونه' : 'e.g., Sample Building Co.') : (isRtl ? 'مثال: آرش علوی' : 'e.g., Arash Alavi')}
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                      />
                    </div>

                    {/* Phone Number + SMS verification */}
                    <div className={`space-y-2 ${regAccountType === 'Manufacturer' ? 'sm:col-span-2' : ''}`}>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#26B6B6]" />
                        <span>{isRtl ? 'شماره موبایل، شناسه اصلی حساب (اجباری)' : 'Mobile number, main account ID (Required)'}</span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                        <div>
                          <input
                            type="tel"
                            required
                            inputMode="tel"
                            dir="ltr"
                            autoComplete="tel-national"
                            placeholder={isRtl ? 'مثال: 09123456789' : 'e.g., 09123456789'}
                            value={regPhone}
                            onChange={(e) => handleRegPhoneChange(e.target.value)}
                            className={`w-full text-xs p-3 border dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none font-semibold ${
                              regPhone.trim() && !isValidIranMobile(regPhone)
                                ? 'border-rose-300 dark:border-rose-800'
                                : 'border-gray-200 dark:border-gray-800'
                            }`}
                          />
                          {regPhone.trim() !== '' && !isValidIranMobile(regPhone) && (
                            <p className="mt-1 text-[10px] text-rose-500 font-bold" dir={isRtl ? 'rtl' : 'ltr'}>
                              {isRtl
                                ? 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود (مثال: 09123456789)'
                                : 'Mobile number must be 11 digits starting with 09 (e.g., 09123456789)'}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleSendMockOtp}
                          disabled={regOtpSent && otpCooldownLeft > 0}
                          className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all whitespace-nowrap self-start ${
                            regOtpSent && otpCooldownLeft > 0
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-[#26B6B6]/10 hover:bg-[#26B6B6]/15 text-[#138f8f] dark:text-[#26B6B6] cursor-pointer'
                          }`}
                        >
                          {regOtpSent
                            ? (otpCooldownLeft > 0
                                ? (isRtl ? `ارسال مجدد (${faMmss(otpCooldownLeft)})` : `Resend in ${mmss(otpCooldownLeft)}`)
                                : (isRtl ? 'ارسال مجدد کد' : 'Resend code'))
                            : (isRtl ? 'ارسال کد' : 'Send Code')}
                        </button>
                      </div>
                      {regOtpSent && !regOtpVerified && otpCooldownLeft > 0 && (
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <span>{isRtl ? 'تا امکان ارسال مجدد کد:' : 'You can resend the code in'}</span>
                          <span className="font-black text-[#26B6B6] tabular-nums" dir="ltr">{isRtl ? faMmss(otpCooldownLeft) : mmss(otpCooldownLeft)}</span>
                          <span>{isRtl ? '' : 's'}</span>
                        </p>
                      )}

                      <div className="rounded-2xl bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-3 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:items-end">
                          <div>
                            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400">
                              {isRtl ? 'کد تأیید پیامکی' : 'SMS Verification Code'}
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              dir="ltr"
                              autoComplete="one-time-code"
                              value={regOtpCode}
                              onChange={(e) => setRegOtpCode(toLatinDigits(e.target.value))}
                              disabled={!regOtpSent || regOtpVerified}
                              placeholder={isRtl ? 'کد آزمایشی: ۱۲۳۴۵۶' : 'Mock code: 123456'}
                              className="mt-1 w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none disabled:opacity-60"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleVerifyMockOtp}
                            disabled={!regOtpSent || regOtpVerified}
                            className={`px-4 py-3 rounded-xl text-xs font-black transition-all ${
                              regOtpVerified
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-default'
                                : 'bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
                            }`}
                          >
                            {regOtpVerified ? (isRtl ? 'تأیید شد' : 'Verified') : (isRtl ? 'تأیید کد' : 'Verify')}
                          </button>
                        </div>
                        <p className="text-[9.5px] text-gray-400 leading-relaxed">
                          {isRtl
                            ? 'در نسخه فعلی، کد ۱۲۳۴۵۶ آزمایشی است. پس از خرید پنل پیامکی، این بخش به ارسال واقعی پیامک متصل می‌شود.'
                            : 'For now, 123456 is a mock code. After buying an SMS panel, this will connect to real SMS delivery.'
                          }
                        </p>
                        {regOtpSent && !regOtpVerified && (
                          <p className="text-[9.5px] text-[#087F7A] dark:text-[#22D3EE] leading-relaxed font-bold">
                            {isRtl
                              ? 'در مرورگرهای پشتیبانی‌کننده، کد پیامک به‌صورت خودکار خوانده و تأیید می‌شود؛ در غیر این صورت کد را دستی وارد کنید.'
                              : 'On supported browsers, the SMS code is read and verified automatically; otherwise enter it manually.'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    {regAccountType !== 'Manufacturer' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{isRtl ? 'آدرس ایمیل (اختیاری)' : 'Email Address (Optional)'}</span>
                      </label>
                      <input
                        type="email"
                        placeholder={isRtl ? 'مثال: info@company.ir' : 'e.g., info@company.com'}
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                      />
                    </div>
                    )}

                    {regAccountType !== 'Manufacturer' && (
                      <>
                        {/* Password */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{isRtl ? 'رمز عبور (حداقل ۶ کاراکتر)' : 'Password (Min 6 characters)'}</span>
                          </label>
                          <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="••••••••"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                          />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{isRtl ? 'تکرار رمز عبور' : 'Confirm Password'}</span>
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Language & Bypass options */}
                  <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-start">
                    {/* Terms Checkbox */}
                    <label className="flex items-start gap-2.5 p-1 text-[11px] text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={regAgreeTerms}
                        onChange={(e) => setRegAgreeTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded accent-[#26B6B6] cursor-pointer"
                        id="checkbox-agree-terms"
                      />
                       <span className="leading-relaxed">
                        {isRtl ? (
                          <span>
                            با{' '}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                if (onNavigate) onNavigate('terms');
                              }}
                              className="text-[#26B6B6] hover:underline font-bold cursor-pointer"
                            >
                              قوانین و مقررات
                            </button>{' '}
                            و{' '}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                if (onNavigate) onNavigate('privacy');
                              }}
                              className="text-[#26B6B6] hover:underline font-bold cursor-pointer"
                            >
                              سیاست حفظ حریم خصوصی
                            </button>{' '}
                            شرکت توسعه فناوری ایران‌بیم‌هاب موافق هستم.
                          </span>
                        ) : (
                          <span>
                            I agree to the{' '}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                if (onNavigate) onNavigate('terms');
                              }}
                              className="text-[#26B6B6] hover:underline font-bold cursor-pointer"
                            >
                              Terms of Service
                            </button>{' '}
                            and{' '}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                if (onNavigate) onNavigate('privacy');
                              }}
                              className="text-[#26B6B6] hover:underline font-bold cursor-pointer"
                            >
                              Privacy Policy
                            </button>
                            .
                          </span>
                        )}
                      </span>
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 flex justify-between border-t border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(2)}
                      className="border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      id="btn-step3-back"
                    >
                      {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                      <span>{isRtl ? 'مرحله قبلی' : 'Back'}</span>
                    </button>
                    <button
                      type="submit"
                      className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                      id="btn-step3-submit"
                    >
                      <span>{regAccountType === 'Manufacturer' ? (isRtl ? 'تأیید شماره و تکمیل ثبت‌نام برند' : 'Verify & Complete Brand Registration') : (isRtl ? 'تکمیل ثبت‌نام' : 'Complete Registration')}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};