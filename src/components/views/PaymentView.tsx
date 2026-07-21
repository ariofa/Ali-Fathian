import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Check, 
  HelpCircle, 
  Lock, 
  Building2, 
  User, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  RefreshCw 
} from 'lucide-react';

interface PaymentViewProps {
  onBack: () => void;
  planId?: string; // 'modeler-vip' | 'mfg-premium' | 'mfg-vip'
  onPaymentSuccess: (userType: 'Modeler' | 'Manufacturer', tier: string) => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({ 
  onBack, 
  planId: initialPlanId = 'modeler-vip',
  onPaymentSuccess 
}) => {
  const { isRtl, t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlanId);
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'success'>('checkout');
  const [gatewaySelected, setGatewaySelected] = useState<'zarinpal' | 'saman' | 'mellat'>('zarinpal');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Plans data
  const plans = {
    'modeler-vip': {
      id: 'modeler-vip',
      nameFa: 'عضویت ویژه طراحان (VIP)',
      nameEn: 'Modeler VIP Membership',
      userType: 'Modeler' as const,
      tier: 'VIP',
      priceFa: '۹۹,۰۰۰ تومان',
      priceEn: '99,000 Tomans',
      priceNum: 99000,
      periodFa: 'ماهانه',
      periodEn: 'month',
      color: 'from-amber-500 to-yellow-600',
      icon: Sparkles,
      featuresFa: [
        'دانلود نامحدود تمام آبجکت‌های بیم (BIM)',
        'دسته‌بندی و پوشه‌بندی پیشرفته پروژه‌ها',
        'ایجاد کلکسیون‌ها و مودبردهای سفارشی نامحدود',
        'فیلتر نشان‌شده‌ها بر اساس دسته‌بندی کالا',
        'پشتیبانی فنی اولویت‌دار ۲۴ ساعته'
      ],
      featuresEn: [
        'Unlimited BIM object downloads with no speed limits',
        'Advanced project structure & folders organization',
        'Unlimited custom folders, collections, and moodboards',
        'Filter favorites by Category & manufacturer metadata',
        'Priority SLA 24/7 technical customer support'
      ]
    },
    'mfg-premium': {
      id: 'mfg-premium',
      nameFa: 'اشتراک ممتاز کارخانجات (Premium)',
      nameEn: 'Manufacturer Premium Plan',
      userType: 'Manufacturer' as const,
      tier: 'Premium',
      priceFa: '۱,۴۹۰,۰۰۰ تومان',
      priceEn: '1,490,000 Tomans',
      priceNum: 1490000,
      periodFa: 'ماهانه',
      periodEn: 'month',
      color: 'from-[#26B6B6] to-[#1e9494]',
      icon: Building2,
      featuresFa: [
        'بارگذاری کاتالوگ تا سقف ۳۰ محصول (SKU)',
        'پشتیبانی از تمامی فرمت‌های مدل سه‌بعدی (Revit, IFC, DWG)',
        'دسترسی به داشبورد آنالیز و پایش هفتگی ترافیک کالا',
        'دریافت سرنخ‌های فروش (Leads) و پیام مستقیم طراحان',
        'نشان ممیزی شده درجه ۲ (Silver Verified Provider)'
      ],
      featuresEn: [
        'Catalog hosting up to 30 products (SKUs)',
        'Support for all 3D formats (Revit, IFC, DWG, 3DS)',
        'Weekly traffic analytics and catalog performance logs',
        'Direct leads routing and buyer messaging inbox',
        'Silver Verified Provider verification badge'
      ]
    },
    'mfg-vip': {
      id: 'mfg-vip',
      nameFa: 'اشتراک ویژه کارخانجات (VIP)',
      nameEn: 'Manufacturer VIP Unlimited',
      userType: 'Manufacturer' as const,
      tier: 'VIP',
      priceFa: '۳,۹۰۰,۰۰۰ تومان',
      priceEn: '3,900,000 Tomans',
      priceNum: 3900000,
      periodFa: 'ماهانه',
      periodEn: 'month',
      color: 'from-emerald-500 to-teal-700',
      icon: Sparkles,
      featuresFa: [
        'بارگذاری کاتالوگ بی‌نهایت و بدون سقف محصول',
        'مدلسازی سه‌بعدی اختصاصی محصولات توسط مهندسان ما',
        'داشبورد آنالیز پیشرفته پیش‌بینی‌کننده لحظه‌ای ترافیک کالا',
        'سیستم هماهنگ‌سازی سرنخ‌ها با سیستم CRM سازمانی کارخانه',
        'نشان ویژه ممیزی طلایی (Gold Verified Provider SLA)'
      ],
      featuresEn: [
        'Unlimited SKU uploads in the catalog',
        'In-house expert BIM modeling services for your products',
        'Real-time analytical dashboard with predictive heatmaps',
        'Direct CRM synchronization and lead prioritization',
        'Gold Verified Provider VIP status & prominent ranking'
      ]
    }
  };

  const activePlan = plans[selectedPlan as keyof typeof plans] || plans['modeler-vip'];

  const handlePayAndActivate = () => {
    setIsProcessing(true);
    
    // Simulate API connection to Zarinpal gateway
    // ----------------------------------------------------
    // IN PRODUCTION CODE:
    // This is the ideal spot to fetch a gateway authority token from your backend API:
    //
    // fetch('/api/payment/request', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ planId: activePlan.id, amount: activePlan.priceNum })
    // })
    // .then(res => res.json())
    // .then(data => {
    //   if(data.authority) {
    //     window.location.href = `https://payment.zarinpal.com/pg/StartPay/${data.authority}`;
    //   }
    // });
    // ----------------------------------------------------

    setTimeout(() => {
      setIsProcessing(false);
      const generatedRefId = 'IRB-' + Math.floor(10000000 + Math.random() * 90000000);
      setTransactionId(generatedRefId);
      setPaymentStep('success');
      
      // Update the actual app states
      onPaymentSuccess(activePlan.userType, activePlan.tier);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121315] py-12 px-4 sm:px-6 lg:px-8 text-start font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button and Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isRtl ? 'بازگشت به پنل کاربری' : 'Back to Dashboard'}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#26B6B6]/15 text-[#26B6B6] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {isRtl ? 'پرداخت امن زرین‌پال' : 'Secure Zarinpal Gateway'}
            </span>
          </div>
        </div>

        {paymentStep === 'checkout' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left/Right details based on RTL: Selection and Checkout Details */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Plan Switcher */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black text-gray-800 dark:text-white">
                  {isRtl ? '۱. انتخاب طرح اشتراک جهت ارتقا' : '1. Choose Subscription Plan'}
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {Object.values(plans).map((p) => {
                    const isSelected = selectedPlan === p.id;
                    const IconComp = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={`p-4 rounded-2xl border text-start flex items-center justify-between gap-4 transition-all relative overflow-hidden cursor-pointer ${
                          isSelected 
                            ? 'border-[#26B6B6] bg-[#26B6B6]/5 shadow-xs' 
                            : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${
                            isSelected ? 'bg-[#26B6B6] text-white' : 'bg-slate-50 dark:bg-gray-800 text-gray-500'
                          }`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-extrabold text-xs text-gray-800 dark:text-white">
                              {isRtl ? p.nameFa : p.nameEn}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {p.userType === 'Modeler' 
                                ? (isRtl ? 'ویژه مهندسان و مدل‌سازان خلاق' : 'For architecture engineers & BIM modelers')
                                : (isRtl ? 'ویژه کارخانجات و تولیدکنندگان صنعتی' : 'For industrial manufacturers')}
                            </div>
                          </div>
                        </div>

                        <div className="text-end">
                          <span className="text-xs font-black text-[#26B6B6] block">
                            {isRtl ? p.priceFa : p.priceEn}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono">
                            / {isRtl ? p.periodFa : p.periodEn}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Iranian Payment Gateway Connection */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>{isRtl ? '۲. دروازه پرداخت امن شتاب' : '2. Secure Iranian Payment Gate'}</span>
                  </h3>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>SSL 256-bit</span>
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {isRtl 
                    ? 'اتصال کاملاً امن به درگاه‌های رسمی بانک‌های عضو شبکه شتاب ایران. تراکنش‌ها از طریق پروتکل‌های امن به مرکز الکترونیک پرداخت صادر می‌شوند.'
                    : 'Fully secure connection to official central banks under the Iranian Shetab network. Transactions are routed securely.'}
                </p>

                {/* Gateway selection visual representation */}
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setGatewaySelected('zarinpal')}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      gatewaySelected === 'zarinpal'
                        ? 'border-yellow-500 bg-yellow-50/15 text-yellow-600 dark:bg-yellow-500/5'
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center font-bold text-xs text-yellow-600">
                      زرین
                    </div>
                    <span className="text-[10.5px] font-bold">{isRtl ? 'درگاه زرین‌پال' : 'ZarinPal'}</span>
                  </button>

                  <button 
                    onClick={() => setGatewaySelected('saman')}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      gatewaySelected === 'saman'
                        ? 'border-blue-500 bg-blue-50/15 text-blue-600 dark:bg-blue-500/5'
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-xs text-blue-600">
                      سامان
                    </div>
                    <span className="text-[10.5px] font-bold">{isRtl ? 'پرداخت سامان' : 'Saman'}</span>
                  </button>

                  <button 
                    onClick={() => setGatewaySelected('mellat')}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      gatewaySelected === 'mellat'
                        ? 'border-rose-500 bg-rose-50/15 text-rose-600 dark:bg-rose-500/5'
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center font-bold text-xs text-rose-600">
                      ملت
                    </div>
                    <span className="text-[10.5px] font-bold">{isRtl ? 'به‌پرداخت ملت' : 'Mellat'}</span>
                  </button>
                </div>

                {/* Secure Gateway info footer */}
                <div className="bg-slate-50 dark:bg-gray-950 p-4 rounded-2xl flex items-center gap-3 border border-gray-100/50 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-start space-y-0.5">
                    <span className="text-[11px] font-extrabold text-gray-800 dark:text-gray-100 block">
                      {isRtl ? 'آدرس اتصال به درگاه شاپرک:' : 'Shaparak Gateway Host:'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      https://shaparak.ir/pg/startpay/zarinpal
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right/Left details based on RTL: Order Summary Card */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 space-y-6 shadow-sm sticky top-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                    {isRtl ? 'جزئیات سفارش ارتقا اکانت' : 'Order Summary'}
                  </h3>
                  
                  <div className="bg-slate-50 dark:bg-gray-950 p-4.5 rounded-2xl border border-gray-100/60 dark:border-gray-800/60 space-y-2">
                    <span className="text-[10px] text-[#26B6B6] font-bold block">
                      {activePlan.userType === 'Modeler' ? (isRtl ? 'پنل کاربری طراحان' : 'Modeler Account') : (isRtl ? 'پنل کارفرمایی برندها' : 'Industrial Brand')}
                    </span>
                    <h4 className="text-base font-black text-gray-800 dark:text-white">
                      {isRtl ? activePlan.nameFa : activePlan.nameEn}
                    </h4>
                    <p className="text-[10.5px] text-gray-400 leading-relaxed font-light">
                      {isRtl 
                        ? 'فعال‌سازی آنی پس از پرداخت موفق. فاکتور پرداخت رسمی بلافاصله ارسال می‌شود.' 
                        : 'Instant activation upon successful authorization. Tax invoice will be sent instantly.'}
                    </p>
                  </div>
                </div>

                {/* Feature highlights list */}
                <div className="space-y-3 text-start">
                  <span className="text-[10.5px] font-bold text-gray-400 block">
                    {isRtl ? 'امکاناتی که با ارتقا بازگشایی می‌شوند:' : 'What you unlock with this upgrade:'}
                  </span>
                  <div className="space-y-2.5">
                    {(isRtl ? activePlan.featuresFa : activePlan.featuresEn).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                        <div className="p-0.5 bg-[#26B6B6]/10 text-[#26B6B6] rounded-md shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-normal">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout pricing details */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{isRtl ? 'مبلغ اشتراک' : 'Subscription Cost'}</span>
                    <span className="font-mono text-gray-600 dark:text-gray-300">{isRtl ? activePlan.priceFa : activePlan.priceEn}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{isRtl ? 'مالیات بر ارزش افزوده (٪۰)' : 'VAT (0%)'}</span>
                    <span className="font-mono text-gray-600 dark:text-gray-300">{isRtl ? '۰ تومان' : '0 Tomans'}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
                    <span className="text-xs font-black text-gray-800 dark:text-white">{isRtl ? 'مبلغ نهایی قابل پرداخت' : 'Total Amount Due'}</span>
                    <span className="text-sm font-black text-[#26B6B6] font-mono">
                      {isRtl ? activePlan.priceFa : activePlan.priceEn}
                    </span>
                  </div>
                </div>

                {/* Pay and Activate Button */}
                <button
                  type="button"
                  onClick={handlePayAndActivate}
                  disabled={isProcessing}
                  className={`w-full py-4.5 rounded-2xl text-xs font-black tracking-wide text-white bg-gradient-to-r from-[#26B6B6] to-emerald-600 hover:from-[#1e9494] shadow-md transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                    isProcessing ? 'opacity-85 pointer-events-none' : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isRtl ? 'در حال اتصال به شبکه شتاب بانک مرکزی...' : 'Connecting to banking gateway...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{isRtl ? 'پرداخت و فعال‌سازی آنلاین' : 'Pay & Activate Account Now'}</span>
                    </>
                  )}
                </button>

                <p className="text-[9.5px] text-gray-400 text-center leading-relaxed font-light">
                  {isRtl 
                    ? 'با ثبت پرداخت، شما کلیه قوانین کاربری و شرایط استفاده ایران‌بیم‌هاب را می‌پذیرید.' 
                    : 'By initiating payment, you accept our commercial terms of service.'}
                </p>

              </div>

            </div>

          </div>
        ) : (
          
          /* Success Screen View */
          <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-scaleIn">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto scale-110">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-3 py-1 rounded-full uppercase">
                {isRtl ? 'تراکنش موفقیت‌آمیز' : 'Payment Successful'}
              </span>
              <h3 className="text-lg font-black text-gray-800 dark:text-white pt-1">
                {isRtl ? 'اشتراک شما با موفقیت فعال گردید!' : 'Subscription Activated Successfully!'}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                {isRtl 
                  ? `تبریک! حساب شما به عضویت ویژه ارتقا یافت. کلیه قفل‌های کاربری برداشته شد و می‌توانید از خدمات کامل ایران‌بیم‌هاب استفاده کنید.`
                  : `Congratulations! Your subscription is active. All limits have been permanently lifted for your account tier.`}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-gray-950 p-4.5 rounded-2xl border border-gray-100/50 dark:border-gray-800 text-xs text-start space-y-3 font-light">
              <div className="flex justify-between">
                <span className="text-gray-400">{isRtl ? 'نوع اشتراک' : 'Plan Type'}</span>
                <span className="font-extrabold text-gray-800 dark:text-gray-100">{isRtl ? activePlan.nameFa : activePlan.nameEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{isRtl ? 'مبلغ پرداختی' : 'Paid Amount'}</span>
                <span className="font-mono text-[#26B6B6] font-extrabold">{isRtl ? activePlan.priceFa : activePlan.priceEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{isRtl ? 'کد رهگیری تراکنش' : 'Transaction Ref ID'}</span>
                <span className="font-mono text-gray-600 dark:text-gray-300 font-bold">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{isRtl ? 'درگاه پرداختی' : 'Payment Gate'}</span>
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {gatewaySelected === 'zarinpal' ? (isRtl ? 'زرین‌پال (شتاب)' : 'ZarinPal') : 
                   gatewaySelected === 'saman' ? (isRtl ? 'بانک سامان' : 'Saman PG') : (isRtl ? 'بانک ملت' : 'Mellat PG')}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onBack}
                className="w-full bg-[#26B6B6] hover:bg-[#1e9494] text-white py-3 px-5 rounded-2xl text-xs font-black shadow-md cursor-pointer transition-transform transform active:scale-98"
              >
                {isRtl ? 'ورود به پنل کاربری' : 'Proceed to Dashboard'}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-light">
              <FileText className="w-3.5 h-3.5 text-[#26B6B6]" />
              <span>{isRtl ? 'فاکتور مالیاتی رسمی به ایمیل شما ارسال گردید.' : 'Official tax invoice has been dispatched to your email.'}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
