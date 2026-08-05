import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, FileCheck2, FileText, Handshake, ReceiptText, ShieldCheck } from 'lucide-react';

interface PaymentViewProps {
  onBack: () => void;
  planId?: string;
  onPaymentSuccess: (userType: 'Modeler' | 'Manufacturer', tier: string) => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({ onBack }) => {
  const { isRtl } = useLanguage();
  const [requested, setRequested] = useState(false);
  const steps = [
    { icon: Building2, fa: 'معرفی برند یا محصول', en: 'Introduce your brand or product' },
    { icon: FileCheck2, fa: 'بررسی اولیه و تعیین دامنهٔ کار', en: 'Initial review and scope definition' },
    { icon: ReceiptText, fa: 'ارسال پیش‌فاکتور و روش تسویه', en: 'Proforma invoice and settlement method' },
    { icon: Handshake, fa: 'شروع خدمت و گزارش وضعیت', en: 'Service start and progress updates' }
  ];
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-black text-[#0F3D5E] dark:text-[#22D3EE] cursor-pointer">
        {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{isRtl ? 'بازگشت' : 'Back'}</span>
      </button>
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F3D5E] via-[#123D5A] to-[#087F7A] text-white p-7 sm:p-10 shadow-xl">
        <span className="inline-flex rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-black">{isRtl ? 'خدمات تخصصی برند و محصول' : 'Specialist brand & product services'}</span>
        <h1 className="mt-4 text-2xl sm:text-4xl font-black leading-tight">{isRtl ? 'فرایند همکاری و تسویهٔ خدمات' : 'Service collaboration & settlement process'}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80">{isRtl ? 'ایران‌بیم‌هاب در مرحلهٔ آغاز، خدمات را بر اساس نیاز واقعی هر محصول تعریف می‌کند. پیش از هر پرداخت، دامنهٔ کار، خروجی، زمان‌بندی و هزینه به‌صورت شفاف با شما هماهنگ می‌شود.' : 'At this stage, IranBIMhub defines services around the real needs of each product. Scope, deliverables, timing, and cost are clarified before any payment.'}</p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <article className="rounded-2xl border border-gray-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
          <h2 className="font-black text-gray-900 dark:text-white">{isRtl ? 'خدماتی که پس از بررسی ممکن است هزینه داشته باشند' : 'Services that may be priced after review'}</h2>
          <ul className="space-y-2 text-xs leading-6 text-gray-600 dark:text-gray-300">
            {[isRtl ? 'بررسی مقدماتی فنی آبجکت BIM' : 'Preliminary BIM object review', isRtl ? 'مدل‌سازی یا اصلاح Family و فایل‌ها' : 'Family modelling or file correction', isRtl ? 'آماده‌سازی اطلاعات محصول و کاتالوگ' : 'Product-information and catalog preparation', isRtl ? 'انتشار حرفه‌ای و خدمات اختصاصی برند' : 'Professional publication and brand-specific services'].map(x => <li key={x} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#0FB9B1] shrink-0 mt-0.5" />{x}</li>)}
          </ul>
        </article>
        <article className="rounded-2xl border border-amber-200/70 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-950/10 p-6 space-y-3">
          <ShieldCheck className="w-7 h-7 text-[#D6A01D]" />
          <h2 className="font-black text-gray-900 dark:text-white">{isRtl ? 'برنامهٔ برندهای آغازگر' : 'Founding brands program'}</h2>
          <p className="text-xs leading-7 text-gray-600 dark:text-gray-300">{isRtl ? 'برای پنج برند آغازگر، بررسی مقدماتی نخستین محصول یا آبجکت بدون هزینه انجام می‌شود. خدمات تخصصی پس از روشن‌شدن دامنهٔ کار، جداگانه تعریف می‌شوند.' : 'For the first five founding brands, the preliminary review of one first product or object is offered at no cost. Specialist services are scoped separately.'}</p>
        </article>
      </section>
      <section className="rounded-3xl border border-gray-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">{isRtl ? 'چهار گام روشن تا شروع خدمت' : 'Four clear steps to start a service'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{steps.map((step, i) => { const Icon=step.icon; return <div key={step.fa} className="relative rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 p-4"><span className="text-[10px] font-black text-[#0FB9B1]">۰{i+1}</span><Icon className="w-5 h-5 my-3 text-[#0F3D5E] dark:text-[#22D3EE]" /><p className="text-xs font-black text-gray-800 dark:text-white leading-6">{isRtl ? step.fa : step.en}</p></div>})}</div>
      </section>
      <section className="rounded-3xl border border-[#0FB9B1]/25 bg-[#0FB9B1]/5 p-7 text-center space-y-4">
        {requested ? <><CheckCircle2 className="w-9 h-9 text-[#087F7A] mx-auto" /><h2 className="font-black text-gray-900 dark:text-white">{isRtl ? 'درخواست شما ثبت شد' : 'Your request has been registered'}</h2><p className="text-xs text-gray-600 dark:text-gray-300">{isRtl ? 'در نسخهٔ عملیاتی، اطلاعات شما برای بررسی و هماهنگی پیش‌فاکتور ثبت خواهد شد.' : 'In the operational version, your information will be recorded for review and proforma coordination.'}</p></> : <><h2 className="text-lg font-black text-gray-900 dark:text-white">{isRtl ? 'برای بررسی اولیه و دریافت برآورد آماده‌اید؟' : 'Ready for an initial review and estimate?'}</h2><p className="text-xs leading-6 text-gray-600 dark:text-gray-300">{isRtl ? 'بدون نمایش شماره‌کارت یا درگاه ساختگی؛ روش پرداخت فقط پس از توافق دربارهٔ خدمت و صدور پیش‌فاکتور هماهنگ می‌شود.' : 'No public card number or simulated gateway. Payment method is coordinated only after scope agreement and a proforma invoice.'}</p><button onClick={() => setRequested(true)} className="rounded-xl bg-[#0FB9B1] hover:bg-[#087F7A] px-5 py-3 text-xs font-black text-white cursor-pointer">{isRtl ? 'درخواست بررسی اولیه' : 'Request initial review'}</button></>}
      </section>
    </main>
  );
};
