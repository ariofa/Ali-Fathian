import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from '../ui/toast';
import { useLanguage } from '../LanguageContext';
import { PRODUCT_CATEGORIES } from '../../lib/catalog';

const REQUEST_L1_CATEGORIES = PRODUCT_CATEGORIES.filter(c => c.level === 1);
const requestSubcategoriesOf = (familyId: string) => PRODUCT_CATEGORIES.filter(c => c.parentId === familyId);
/** Taxonomy label for a stored request category id (empty when it is a legacy id). */
const requestCategoryLabel = (categoryId: string | undefined, isRtl: boolean) => {
  if (!categoryId) return '';
  const category = PRODUCT_CATEGORIES.find(c => c.id === categoryId);
  return category ? (isRtl ? category.label.fa : category.label.en) : '';
};
import { pushNotification } from '../../lib/notifications';
import {
  PackagePlus,
  Send,
  ImagePlus,
  Link2,
  Building2,
  ListChecks,
  RefreshCw,
  ClipboardCheck,
  Info
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Item 20 — «درخواست آبجکت جدید» (New BIM Object Request)              */
/* Architects ask IranBIMhub to contact a brand — even one that has    */
/* not registered yet — and produce/publish a real BIM object.         */
/* Backend: server.ts → /api/object-requests (data/object-requests.json)*/
/* ------------------------------------------------------------------ */

export interface ObjectRequestItem {
  id: string;
  trackingRef: string;
  brandName: string;
  brandUrl?: string;
  productName: string;
  detailLevel?: string;
  discipline?: string;
  categoryId?: string;
  subcategoryName?: string;
  linkUrl?: string;
  photoName?: string;
  projectName?: string;
  description?: string;
  requesterName: string;
  requesterPhone: string;
  status: 'new' | 'in_progress_contact' | 'in_production' | 'published' | 'rejected';
  adminNote?: string;
  createdAt: string;
}

export const OBJECT_REQUEST_STATUS: Record<ObjectRequestItem['status'], { fa: string; en: string; className: string }> = {
  new: { fa: 'دریافت شد', en: 'Received', className: 'bg-blue-50 text-blue-600 border-blue-100' },
  in_progress_contact: { fa: 'در حال تماس با برند', en: 'Contacting the brand', className: 'bg-amber-50 text-amber-600 border-amber-100' },
  in_production: { fa: 'در حال ساخت آبجکت', en: 'Object in production', className: 'bg-violet-50 text-violet-600 border-violet-100' },
  published: { fa: 'منتشر شد ✓', en: 'Published ✓', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  rejected: { fa: 'قابل انجام نیست', en: 'Not feasible', className: 'bg-rose-50 text-rose-500 border-rose-100' }
};

const LOD_OPTIONS = [
  { id: 'LOD 200', fa: 'LOD 200 — مدل کلی (کانسپت)', en: 'LOD 200 — Conceptual massing' },
  { id: 'LOD 300', fa: 'LOD 300 — مدل دقیق طراحی (متداول)', en: 'LOD 300 — Accurate design model (common)' },
  { id: 'LOD 350', fa: 'LOD 350 — مدل دقیق با اتصالات', en: 'LOD 350 — With connections' },
  { id: 'LOD 400', fa: 'LOD 400 — مدل اجرایی / ساخت', en: 'LOD 400 — Construction / fabrication' },
  { id: 'unsure', fa: 'اطلاع ندارم؛ پیشنهاد ایران‌بیم‌هاب', en: 'Not sure — IranBIMhub decides' }
];

export const DISCIPLINE_OPTIONS = [
  { id: 'architecture', fa: 'معماری', en: 'Architecture' },
  { id: 'structure', fa: 'سازه', en: 'Structure' },
  { id: 'mep-mechanical', fa: 'تأسیسات مکانیکی', en: 'Mechanical Installations' },
  { id: 'mep-electrical', fa: 'تأسیسات الکتریکی', en: 'Electrical Installations' },
  { id: 'interior', fa: 'طراحی داخلی و دکوراسیون', en: 'Interior Design' },
  { id: 'landscape', fa: 'محوطه و فضای سبز', en: 'Landscape' },
  { id: 'other', fa: 'سایر', en: 'Other' }
];

const faDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString('fa-IR'); } catch { return ''; }
};

interface ObjectRequestFormProps {
  currentUser: any;
  onSubmitted?: () => void;
}

export const ObjectRequestForm: React.FC<ObjectRequestFormProps> = ({ currentUser, onSubmitted }) => {
  const { isRtl } = useLanguage();
  const [brandName, setBrandName] = useState('');
  const [brandUrl, setBrandUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [detailLevel, setDetailLevel] = useState('LOD 300');
  const [discipline, setDiscipline] = useState('architecture');
  const [categoryId, setCategoryId] = useState(REQUEST_L1_CATEGORIES[0]?.id || '');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  const selectedCategory = useMemo(() => REQUEST_L1_CATEGORIES.find(c => c.id === categoryId), [categoryId]);

  useEffect(() => {
    // Reset subcategory when the parent category changes
    setSubcategoryName('');
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.phone) {
      toast(isRtl ? 'برای ثبت درخواست ابتدا وارد حساب کاربری شوید.' : 'Please sign in to submit a request.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/object-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName, brandUrl, productName, detailLevel, discipline,
          categoryId, subcategoryName, linkUrl, photoName, projectName, description,
          requesterName: currentUser.fullName || currentUser.name || '',
          requesterPhone: currentUser.phone || '',
          website: '' // honeypot
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) throw new Error(data?.messageFa || 'failed');

      setSuccessRef(data.trackingRef || null);
      pushNotification(currentUser.phone, {
        title: isRtl ? 'درخواست آبجکت شما ثبت شد 📦' : 'Your object request was received 📦',
        body: isRtl
          ? `درخواست ساخت آبجکت «${productName}» (${brandName}) با کد پیگیری ${data.trackingRef || ''} ثبت شد؛ تیم ایران‌بیم‌هاب با برند تماس می‌گیرد و نتیجه از همین‌جا قابل پیگیری است.`
          : `Your request for "${productName}" (${brandName}) was logged${data.trackingRef ? ` with ref ${data.trackingRef}` : ''}; our team will contact the brand.`,
        targetTab: 'messages-requests'
      });
      toast(isRtl ? 'درخواست شما با موفقیت ثبت شد.' : 'Request submitted successfully.');
      setBrandName(''); setBrandUrl(''); setProductName(''); setLinkUrl('');
      setPhotoName(''); setProjectName(''); setDescription(''); setSubcategoryName('');
      onSubmitted?.();
    } catch {
      toast(isRtl ? 'ثبت درخواست با خطا مواجه شد؛ لطفاً دوباره تلاش کنید.' : 'Submission failed; please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full text-[13px] p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6]';
  const labelCls = 'text-[12.5px] font-bold text-gray-600 dark:text-gray-300 block';

  if (successRef) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center space-y-5 animate-fadeIn">
        <div className="w-16 h-16 mx-auto bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-black text-gray-800 dark:text-white">{isRtl ? 'درخواست شما ثبت شد!' : 'Request submitted!'}</h3>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
            {isRtl
              ? 'تیم ایران‌بیم‌هاب با برند موردنظر (حتی اگر هنوز در سایت ثبت‌نام نکرده باشد) تماس می‌گیرد و روند ساخت و انتشار آبجکت را پیگیری می‌کند. وضعیت درخواست را می‌توانید در بخش «پیام‌ها و درخواست‌ها» دنبال کنید.'
              : 'IranBIMhub will contact the brand — even if it has not registered yet — and follow the object through production and publishing. Track its status under "Messages & Requests".'}
          </p>
          <p className="text-[13px] font-bold text-gray-700 dark:text-gray-200">
            {isRtl ? 'کد پیگیری:' : 'Tracking ref:'}{' '}
            <span className="font-mono bg-slate-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg text-[#26B6B6]">{successRef}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSuccessRef(null)}
          className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[13px] font-black px-6 py-3 rounded-xl cursor-pointer transition-colors"
        >
          {isRtl ? 'ثبت درخواست دیگر' : 'Submit another request'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-7 animate-fadeIn">
      <div>
        <h2 className="text-[15px] font-black text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <PackagePlus className="w-5 h-5 text-[#26B6B6]" />
          <span>{isRtl ? 'درخواست آبجکت جدید' : 'Request a New BIM Object'}</span>
        </h2>
        <p className="text-[12.5px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          {isRtl
            ? 'محصولی را که می‌خواهید به‌صورت آبجکت BIM در سایت داشته باشید معرفی کنید؛ ایران‌بیم‌هاب با برند سازنده — حتی اگر هنوز عضو سایت نباشد — تماس می‌گیرد و فرآیند مدل‌سازی تا انتشار را پیگیری می‌کند.'
            : 'Tell us which product you need as a BIM object; IranBIMhub contacts the manufacturer — even if not registered yet — and follows the modeling process through publication.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Honeypot (spam trap — hidden from users) */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="space-y-1.5">
          <label className={labelCls}>{isRtl ? 'برند / شرکت سازنده' : 'Brand / Manufacturer'} <span className="text-rose-500">*</span></label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-gray-300 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" required value={brandName} onChange={(e) => setBrandName(e.target.value)}
              placeholder={isRtl ? 'مثال: گروه صنعتی پارس آلومینیوم' : 'e.g. Pars Aluminum Group'}
              className={`${inputCls} ps-9`} maxLength={160} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>{isRtl ? 'آدرس سایت یا پیج برند' : 'Brand website / social page'}</label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-gray-300 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" dir="ltr" value={brandUrl} onChange={(e) => setBrandUrl(e.target.value)}
              placeholder="https://… یا instagram.com/brand"
              className={`${inputCls} ps-9 font-mono`} maxLength={300} />
          </div>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className={labelCls}>{isRtl ? 'نام دقیق محصول' : 'Exact product name'} <span className="text-rose-500">*</span></label>
          <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)}
            placeholder={isRtl ? 'مثال: پنجره UPVC دو جداره سری ۷۵ مدل کشویی' : 'e.g. uPVC double-glazed sliding window, series 75'}
            className={inputCls} maxLength={200} />
          <p className="text-[11px] text-gray-400">{isRtl ? 'هرچه نام و مدل محصول دقیق‌تر باشد، ساخت آبجکت سریع‌تر انجام می‌شود.' : 'The more precise the product name/model, the faster the object can be built.'}</p>
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>{isRtl ? 'سطح جزئیات موردنیاز (LOD)' : 'Required Level of Detail (LOD)'}</label>
          <select value={detailLevel} onChange={(e) => setDetailLevel(e.target.value)} className={inputCls}>
            {LOD_OPTIONS.map(o => <option key={o.id} value={o.id}>{isRtl ? o.fa : o.en}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>{isRtl ? 'بخش تخصصی' : 'Discipline'}</label>
          <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className={inputCls}>
            {DISCIPLINE_OPTIONS.map(o => <option key={o.id} value={o.id}>{isRtl ? o.fa : o.en}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>{isRtl ? 'دسته‌بندی در سایت' : 'Site category'}</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
            {REQUEST_L1_CATEGORIES.map(c => <option key={c.id} value={c.id}>{isRtl ? c.label.fa : c.label.en}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>{isRtl ? 'زیردسته' : 'Subcategory'}</label>
          <select value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} className={inputCls}>
            <option value="">{isRtl ? 'انتخاب نشده' : 'Not selected'}</option>
            {requestSubcategoriesOf(selectedCategory?.id || '').map(s => (
              <option key={s.id} value={isRtl ? s.label.fa : s.label.en}>{isRtl ? s.label.fa : s.label.en}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>{isRtl ? 'لینک صفحهٔ محصول' : 'Product page link'}</label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-gray-300 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" dir="ltr" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://…"
              className={`${inputCls} ps-9 font-mono`} maxLength={300} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>{isRtl ? 'عکس یا کاتالوگ محصول (اختیاری)' : 'Product photo / catalog (optional)'}</label>
          <div className="relative">
            <input
              type="file"
              id="object-request-photo"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 8 * 1024 * 1024) {
                  toast(isRtl ? 'حجم فایل نباید بیشتر از ۸ مگابایت باشد.' : 'File must be smaller than 8MB.');
                  e.target.value = '';
                  return;
                }
                setPhotoName(file.name);
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('object-request-photo')?.click()}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-gray-600 hover:border-[#26B6B6] text-gray-500 dark:text-gray-400 hover:text-[#26B6B6] rounded-xl p-3 text-[12.5px] font-bold transition-colors cursor-pointer"
            >
              <ImagePlus className="w-4 h-4" />
              <span className="truncate max-w-[240px]">{photoName || (isRtl ? 'انتخاب فایل...' : 'Choose file…')}</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            {isRtl ? 'نام فایل با درخواست ثبت می‌شود؛ در صورت نیاز، تیم ما برای دریافت نسخهٔ اصلی با شما تماس می‌گیرد.' : 'The file name is logged with your request; our team will contact you if the original file is needed.'}
          </p>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className={labelCls}>{isRtl ? 'برای چه پروژه‌ای نیاز دارید؟' : 'Which project is this for?'}</label>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)}
            placeholder={isRtl ? 'مثال: برج اداری سعادت‌آباد — فاز طراحی توسعه' : 'e.g. Saadat-Abad office tower — design development'}
            className={inputCls} maxLength={200} />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className={labelCls}>{isRtl ? 'توضیحات تکمیلی' : 'Additional notes'}</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder={isRtl ? 'ابعاد، جنس، تعداد، زمان‌بندی پروژه یا هر نکته‌ای که به ساخت دقیق‌تر آبجکت کمک می‌کند...' : 'Dimensions, material, quantities, project timeline, or anything that helps us model it accurately…'}
            className={`${inputCls} resize-y`} maxLength={1800} />
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-[11.5px] text-gray-400 leading-relaxed flex items-start gap-1.5 max-w-md">
            <Info className="w-4 h-4 shrink-0 text-[#26B6B6]" />
            <span>{isRtl ? 'پس از ثبت، کد پیگیری صادر می‌شود و وضعیت درخواست در بخش «پیام‌ها و درخواست‌ها» قابل مشاهده است.' : 'After submission you get a tracking code; follow the status under "Messages & Requests".'}</span>
          </p>
          <button
            type="submit"
            disabled={submitting || !brandName.trim() || !productName.trim()}
            className="bg-[#26B6B6] hover:bg-[#1e9494] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13.5px] font-black px-8 py-3.5 rounded-xl cursor-pointer transition-all flex items-center gap-2"
          >
            <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{submitting ? (isRtl ? 'در حال ارسال...' : 'Submitting…') : (isRtl ? 'ارسال درخواست' : 'Submit request')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* «درخواست‌های من» — compact status list (real data from the server)  */
/* ------------------------------------------------------------------ */

interface MyObjectRequestsListProps {
  phone?: string;
  compact?: boolean;
}

export const MyObjectRequestsList: React.FC<MyObjectRequestsListProps> = ({ phone, compact = false }) => {
  const { isRtl } = useLanguage();
  const [requests, setRequests] = useState<ObjectRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!phone) { setRequests([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/object-requests/mine?phone=${encodeURIComponent(phone)}`);
      const data = await res.json().catch(() => ({}));
      if (data?.success) setRequests(data.requests || []);
    } catch { /* offline */ } finally {
      setLoading(false);
    }
  }, [phone]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[13px] font-black text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
          <ListChecks className="w-4 h-4 text-[#26B6B6]" />
          <span>{isRtl ? 'درخواست‌های آبجکت من' : 'My object requests'}</span>
        </h4>
        <button
          type="button"
          onClick={load}
          className="p-1.5 text-gray-400 hover:text-[#26B6B6] rounded-lg transition-colors cursor-pointer"
          title={isRtl ? 'به‌روزرسانی' : 'Refresh'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <p className="text-[12px] text-gray-400 py-4 text-center">{isRtl ? 'در حال بارگذاری...' : 'Loading…'}</p>
      ) : requests.length === 0 ? (
        <p className="text-[12px] text-gray-400 leading-relaxed border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          {isRtl ? 'هنوز درخواستی ثبت نکرده‌اید؛ از بخش «درخواست آبجکت جدید» اولین درخواست خود را ارسال کنید.' : 'No requests yet — submit your first one from "Request a New Object".'}
        </p>
      ) : (
        <div className="space-y-2.5">
          {requests.map(req => {
            const st = OBJECT_REQUEST_STATUS[req.status] || OBJECT_REQUEST_STATUS.new;
            return (
              <div key={req.id} className="bg-slate-50/70 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-[13px] font-black text-gray-800 dark:text-white truncate">{req.productName}</span>
                    <span className="block text-[11.5px] text-gray-400 mt-0.5 truncate">
                      {req.brandName}
                      {(() => { const path = [requestCategoryLabel(req.categoryId, isRtl), req.subcategoryName].filter(Boolean).join(' › '); return path ? ` • ${path}` : ''; })()}
                    </span>
                  </div>
                  <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-full border shrink-0 ${st.className}`}>
                    {isRtl ? st.fa : st.en}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-[11px] text-gray-400">
                  <span className="font-mono bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2 py-0.5 rounded text-[10.5px]" dir="ltr">{req.trackingRef}</span>
                  <span>{faDate(req.createdAt)}</span>
                </div>
                {!compact && req.adminNote && (
                  <p className="text-[11.5px] text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-2.5 leading-relaxed">
                    <span className="font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'یادداشت تیم ایران‌بیم‌هاب: ' : 'IranBIMhub note: '}</span>
                    {req.adminNote}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
