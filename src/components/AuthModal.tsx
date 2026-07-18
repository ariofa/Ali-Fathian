import React, { useState } from 'react';
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onNavigate?: (view: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, onNavigate }) => {
  const { t, isRtl, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Registration Multi-Step Wizard State
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4>(1);
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

  // Login Fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (!isOpen) return null;

  // Toggle multi-select expertise for Professional
  const handleToggleExpertise = (val: string) => {
    setRegExpertise(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onboardingStep < 3) {
      setOnboardingStep(3);
      return;
    }

    if (!regPhone || !regName || !regPassword) {
      alert(isRtl ? 'لطفاً تمامی فیلدهای اجباری را تکمیل نمایید.' : 'Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      alert(isRtl ? 'رمز عبور و تایید آن با هم مطابقت ندارند.' : 'Password and confirmation do not match.');
      return;
    }

    if (!regAgreeTerms) {
      alert(isRtl ? 'لطفاً موافقت خود با قوانین و مقررات را تایید کنید.' : 'Please agree to the Terms of Service.');
      return;
    }

    // Advance to confirmation review step
    setOnboardingStep(4);
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
      phone: regPhone,
      email: regEmail || null,
      role: regAccountType, // Modeler or Manufacturer
      isPremium: regIsPremium,
      password: regPassword,
      selectedRoles: mappedRoles,
      selectedTopics: mappedTopics,
      companyType: regAccountType === 'Manufacturer' ? regOrgType : null,
      companyName: regAccountType === 'Manufacturer' ? regName : null,
      verificationStatus: regAccountType === 'Manufacturer' ? 'Pending Verification' : 'Approved',
      licenseFile: regLicenseName || null
    };

    // Store in global users database
    localStorage.setItem('iranbimhub_user', JSON.stringify(newUser));

    // For manufacturers, also seed the company profile details instantly
    if (regAccountType === 'Manufacturer') {
      const mfgProfile = {
        companyName: regName,
        desc: isRtl 
          ? `پروفایل برند تجاری ${regName} به عنوان تامین‌کننده رسمی حوزه ${regOrgType}.` 
          : `${regName} official brand page registered as a certified ${regOrgType}.`,
        website: `https://${regName.toLowerCase().replace(/\s+/g, '') || 'brand'}.ir`,
        email: regEmail || `contact@${regName.toLowerCase().replace(/\s+/g, '') || 'brand'}.ir`,
        phone: regPhone,
        tier: regIsPremium ? 'VIP' : 'Free',
        companyType: regOrgType,
        isPendingVerification: true,
        licenseFile: regLicenseName || 'uploaded_license.pdf'
      };
      localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(mfgProfile));
    }

    onLoginSuccess(newUser);
    onClose();

    alert(isRtl 
      ? `ثبت‌نام شما با موفقیت به پایان رسید! خوش آمدید ${regName}` 
      : `Registration completed successfully! Welcome ${regName}`
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || !loginPassword) {
      alert(isRtl ? 'لطفاً شماره تلفن همراه و رمز عبور را وارد کنید.' : 'Please enter your phone number and password.');
      return;
    }

    // Check if there's a stored user matching this session
    const storedUserStr = localStorage.getItem('iranbimhub_user');
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      if (storedUser.phone === loginPhone && storedUser.password === loginPassword) {
        onLoginSuccess(storedUser);
        onClose();
        alert(isRtl ? `خوش آمدید، ورود موفقیت‌آمیز بود!` : `Welcome back, login successful!`);
        return;
      }
    }

    // Fallback Mock Logins for testing
    const mockUser = {
      name: isRtl ? 'مهندس رضایی' : 'Eng. Rezaei',
      fullName: isRtl ? 'مهندس رضایی' : 'Eng. Rezaei',
      phone: loginPhone,
      email: 'rezaei@example.com',
      role: 'Modeler',
      isPremium: loginPhone.endsWith('9') || loginPhone.includes('99'),
      selectedRoles: ['Architect', 'MEP Engineer'],
      selectedTopics: ['HVAC', 'Facades', 'Sustainable Materials']
    };
    
    localStorage.setItem('iranbimhub_user', JSON.stringify(mockUser));
    onLoginSuccess(mockUser);
    onClose();
    alert(isRtl ? `ورود موفقیت‌آمیز بود!` : `Login successful!`);
  };

  const mockGoogleSignup = () => {
    // Check if there is an existing phone-verified account registered in localStorage
    const storedUserStr = localStorage.getItem('iranbimhub_user');
    if (!storedUserStr) {
      alert(isRtl 
        ? 'خطا: ورود با گوگل غیرفعال است! حساب کاربری متصل به گوگل تنها در صورتی مجاز است که ابتدا با شماره تلفن همراه و تایید پیامکی (SMS OTP) ثبت‌نام شده باشد. لطفاً ابتدا از بخش ثبت‌نام، حساب خود را ایجاد کنید.' 
        : 'Error: Google Sign-In is restricted! Google authentication is only allowed for existing accounts registered with a phone number and SMS OTP first. Please sign up with your phone number first.'
      );
      return;
    }

    const storedUser = JSON.parse(storedUserStr);
    alert(isRtl 
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
    alert(isRtl 
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
    { id: 'Manufacturer / Producer', labelFa: 'تولیدکننده / سازنده', labelEn: 'Manufacturer / Producer', descFa: 'شرکت‌هایی که مستقیماً محصولات ساختمانی تولید می‌کنند', descEn: 'Companies that physically produce building products' },
    { id: 'Brand Owner', labelFa: 'صاحب برند', labelEn: 'Brand Owner', descFa: 'مالک برند تجاری (که تولید را برون‌سپاری کرده است)', descEn: 'Companies that own and market a product brand' },
    { id: 'Distributor / Brand Representative', labelFa: 'توزیع‌کننده / نماینده انحصاری', labelEn: 'Distributor / Representative', descFa: 'نمایندگان فروش و بازرگانی رسمی برندها در ایران', descEn: 'Official reps or distributors marketing a brand in Iran' },
    { id: 'Material / Product Supplier', labelFa: 'تامین‌کننده مصالح و تجهیزات', labelEn: 'Material & Product Supplier', descFa: 'تامین‌کنندگان عمومی مصالح و متریال ساختمانی', descEn: 'General suppliers of building materials' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 relative flex flex-col transition-all text-gray-800 dark:text-gray-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        id="auth-modal-container"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
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
              ? 'بزرگترین پایگاه کاتالوگ آبجکت‌های ساختمانی بیم در ایران' 
              : 'Iran\'s Largest Certified Building Information Modeling Object Hub'
            }
          </p>
        </div>

        {/* Tab Selection */}
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

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-4" id="form-login">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#26B6B6]" />
                  <span>{isRtl ? 'شماره تلفن همراه (اجباری)' : 'Mobile Phone Number (Required)'}</span>
                </label>
                <input
                  type="tel"
                  required
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
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-gray-400 pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="font-bold text-[#26B6B6]">
                  {isRtl ? `مرحله ${onboardingStep} از ۴` : `Step ${onboardingStep} of 4`}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
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
                          <span>{isRtl ? 'کدام گزینه به بهترین شکل سازمان شما را توصیف می‌کند؟' : 'What best describes your organization?'}</span>
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          {isRtl 
                            ? 'نوع کسب‌وکار رسمی شرکت خود را انتخاب نمایید (انتخاب یک گزینه)' 
                            : 'Select the category representing your brand operational model in Iran.'
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
                      {isRtl ? 'اطلاعات نهایی حساب کاربری را تکمیل کنید' : 'Complete Your Profile Details'}
                    </h3>
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
                        placeholder={regAccountType === 'Manufacturer' ? (isRtl ? 'مثال: آلومینیوم آلوپن' : 'e.g., Alupan Aluminum') : (isRtl ? 'مثال: آرش علوی' : 'e.g., Arash Alavi')}
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#26B6B6]" />
                        <span>{isRtl ? 'شماره تلفن همراه (اجباری)' : 'Mobile Phone Number (Required)'}</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={isRtl ? 'مثال: 09123456789' : 'e.g., 09123456789'}
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none font-semibold"
                      />
                    </div>

                    {/* Email */}
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
                      <span>{isRtl ? 'تایید و ادامه' : 'Confirm & Proceed'}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: Confirmation & Routing Summary */}
              {onboardingStep === 4 && (
                <div className="space-y-5 text-center animate-fadeIn text-xs" id="wizard-step-4">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-1 shadow-inner">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-gray-800 dark:text-white">
                      {isRtl ? 'خلاصه اطلاعات ثبت‌نام شما' : 'Verify Your Onboarding Choices'}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {isRtl 
                        ? 'پیش از نهایی‌سازی، اطلاعات زیر را جهت مطابقت دقیق بررسی کنید' 
                        : 'Review your configured categories and business credentials before launching.'
                      }
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800/80 p-4 space-y-3.5 text-start leading-relaxed">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800/50">
                      <span className="font-bold text-gray-400 uppercase tracking-wide text-[10px]">
                        {isRtl ? 'نوع حساب کاربری' : 'Account Type'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#26B6B6]">
                          {regAccountType === 'Manufacturer' 
                            ? (isRtl ? 'تولیدکننده / برند تجاری' : 'Manufacturer / Brand')
                            : (isRtl ? 'کاربر حرفه‌ای BIM' : 'BIM Professional')
                          }
                        </span>
                        <button 
                          onClick={() => setOnboardingStep(1)}
                          className="text-[#26B6B6] hover:underline font-bold text-[10px]"
                        >
                          {isRtl ? 'اصلاح' : 'Edit'}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-start pb-2 border-b border-gray-100 dark:border-gray-800/50">
                      <span className="font-bold text-gray-400 uppercase tracking-wide text-[10px]">
                        {regAccountType === 'Manufacturer' 
                          ? (isRtl ? 'مدل ساختار تجاری' : 'Operational Type')
                          : (isRtl ? 'حوزه‌های تخصصی' : 'Fields of Expertise')
                        }
                      </span>
                      <div className="text-end space-y-1">
                        <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                          {regAccountType === 'Manufacturer' ? (
                            <span className="bg-[#26B6B6]/10 text-[#26B6B6] font-bold px-2.5 py-1 rounded-lg text-[10px]">
                              {regOrgType}
                            </span>
                          ) : (
                            regExpertise.map(exp => (
                              <span key={exp} className="bg-[#26B6B6]/10 text-[#26B6B6] font-bold px-2.5 py-1 rounded-lg text-[10px]">
                                {isRtl ? expertiseOptions.find(o => o.id === exp)?.labelFa : exp}
                              </span>
                            ))
                          )}
                        </div>
                        <button 
                          onClick={() => setOnboardingStep(2)}
                          className="text-[#26B6B6] hover:underline font-bold text-[10px] block mt-1 ml-auto"
                        >
                          {isRtl ? 'اصلاح' : 'Edit'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-bold text-gray-400 uppercase tracking-wide text-[10px] block">
                        {isRtl ? 'مشخصات هویتی' : 'Personal Specifications'}
                      </span>
                      <p className="text-gray-600 dark:text-gray-300 font-semibold">{isRtl ? 'نام:' : 'Name:'} <span className="text-gray-900 dark:text-white font-black">{regName}</span></p>
                      <p className="text-gray-600 dark:text-gray-300 font-semibold">{isRtl ? 'همراه:' : 'Phone:'} <span className="font-mono">{regPhone}</span></p>
                      {regEmail && <p className="text-gray-600 dark:text-gray-300 font-semibold">{isRtl ? 'ایمیل:' : 'Email:'} <span>{regEmail}</span></p>}
                      {regAccountType === 'Manufacturer' && regLicenseName && (
                        <p className="text-emerald-500 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{isRtl ? `پروانه پیوست شد: ${regLicenseName}` : `License attached: ${regLicenseName}`}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleFinalizeRegistration}
                    className="w-full bg-[#26B6B6] hover:bg-[#1e9494] text-white py-3.5 rounded-2xl text-xs font-black transition-all hover:shadow-lg cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 font-sans"
                    id="btn-onboarding-finalize"
                  >
                    <span>
                      {regAccountType === 'Manufacturer'
                        ? (isRtl ? 'ایجاد برند کارخانه‌ای و ورود به پیشخوان تولیدکنندگان' : 'Launch Brand Portal & Enter Dashboard')
                        : (isRtl ? 'تکمیل ثبت‌نام و ورود به پیشخوان طراحان' : 'Access Modeler Catalog & Enter Dashboard')
                      }
                    </span>
                    {isRtl ? <ArrowLeft className="w-4 h-4 stroke-[2]" /> : <ArrowRight className="w-4 h-4 stroke-[2]" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
