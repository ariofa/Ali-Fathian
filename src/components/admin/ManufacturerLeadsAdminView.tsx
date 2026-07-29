import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  ExternalLink,
  Factory,
  FileCheck2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Wand2
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

type ManufacturerLeadStatus =
  | 'new'
  | 'contact_needed'
  | 'waiting_files'
  | 'has_bim_ready'
  | 'needs_bim_creation'
  | 'technical_review'
  | 'ready_to_publish'
  | 'published'
  | 'rejected';

type HasBimFiles = 'yes' | 'no' | 'not-sure';

interface ManufacturerLead {
  id: string;
  companyName: string;
  brandName?: string;
  contactName: string;
  roleTitle?: string;
  phone: string;
  email?: string;
  city: string;
  websiteOrSocial?: string;
  productCategory: string;
  hasBimFiles: HasBimFiles;
  bimFormats?: string[];
  productCount?: string;
  catalogUrl?: string;
  filesSentByTelegram?: boolean;
  filesSentByWhatsApp?: boolean;
  message?: string;
  status: ManufacturerLeadStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

const STATUS_OPTIONS: { value: ManufacturerLeadStatus; fa: string; en: string }[] = [
  { value: 'new', fa: 'جدید', en: 'New' },
  { value: 'contact_needed', fa: 'نیازمند تماس', en: 'Contact Needed' },
  { value: 'waiting_files', fa: 'در انتظار کاتالوگ اولیه', en: 'Waiting for Initial Catalog' },
  { value: 'has_bim_ready', fa: 'فایل BIM آماده دارد؛ ارجاع به پنل برند', en: 'Has BIM Files — Send to Brand Panel' },
  { value: 'needs_bim_creation', fa: 'نیازمند مشاوره ساخت آبجکت BIM', en: 'Needs BIM Creation Consultation' },
  { value: 'technical_review', fa: 'مسیر ارزیابی و هزینه توضیح داده شد', en: 'Audit Path & Fee Explained' },
  { value: 'ready_to_publish', fa: 'آماده ساخت پروفایل برند', en: 'Ready for Brand Profile' },
  { value: 'published', fa: 'پیگیری انجام شد / ثبت‌نام رسمی', en: 'Follow-up Done / Official Signup' },
  { value: 'rejected', fa: 'نامرتبط / رد شده', en: 'Irrelevant / Rejected' }
];

const statusClassName: Record<ManufacturerLeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-300',
  contact_needed: 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-300',
  waiting_files: 'bg-orange-50 text-orange-700 dark:bg-orange-950/35 dark:text-orange-300',
  has_bim_ready: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/35 dark:text-cyan-300',
  needs_bim_creation: 'bg-purple-50 text-purple-700 dark:bg-purple-950/35 dark:text-purple-300',
  technical_review: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-300',
  ready_to_publish: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300',
  published: 'bg-green-50 text-green-700 dark:bg-green-950/35 dark:text-green-300',
  rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-300'
};

const normalizePhone = (phone: string) => {
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return `98${digits.slice(1)}`;
  return digits;
};

const getBimStatusLabel = (value: HasBimFiles, isRtl: boolean) => {
  if (value === 'yes') return isRtl ? 'فایل BIM آماده دارد' : 'Has ready BIM files';
  if (value === 'no') return isRtl ? 'فایل BIM ندارد' : 'No BIM files';
  return isRtl ? 'نیازمند راهنمایی' : 'Needs guidance';
};

export const ManufacturerLeadsAdminView: React.FC = () => {
  const { isRtl } = useLanguage();
  const [leads, setLeads] = useState<ManufacturerLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [statusById, setStatusById] = useState<Record<string, ManufacturerLeadStatus>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadLeads = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/manufacturer-leads');
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.success === false) throw new Error(data?.message || 'Load failed');

      const loadedLeads = Array.isArray(data.leads) ? data.leads : [];
      setLeads(loadedLeads);

      const nextNotes: Record<string, string> = {};
      const nextStatuses: Record<string, ManufacturerLeadStatus> = {};
      loadedLeads.forEach((lead: ManufacturerLead) => {
        nextNotes[lead.id] = lead.adminNotes || '';
        nextStatuses[lead.id] = lead.status || 'new';
      });
      setNotesById(nextNotes);
      setStatusById(nextStatuses);
    } catch (error) {
      setErrorMessage(isRtl ? 'دریافت درخواست‌های مشاوره تولیدکنندگان با خطا مواجه شد.' : 'Failed to load manufacturer consultation requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return leads;
    return leads.filter(lead => {
      const haystack = [
        lead.companyName,
        lead.brandName,
        lead.contactName,
        lead.roleTitle,
        lead.phone,
        lead.email,
        lead.city,
        lead.websiteOrSocial,
        lead.productCategory,
        lead.productCount,
        lead.message,
        ...(lead.bimFormats || [])
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [leads, searchQuery]);

  const leadCounts = useMemo(() => {
    return leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      acc[lead.hasBimFiles] = (acc[lead.hasBimFiles] || 0) + 1;
      return acc;
    }, {});
  }, [leads]);

  const getStatusLabel = (status: ManufacturerLeadStatus) => {
    const option = STATUS_OPTIONS.find(item => item.value === status);
    return isRtl ? option?.fa || status : option?.en || status;
  };

  const handleSaveLead = async (leadId: string) => {
    setSavingId(leadId);
    setErrorMessage('');
    try {
      const response = await fetch(`/api/admin/manufacturer-leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusById[leadId] || 'new',
          adminNotes: notesById[leadId] || ''
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.success === false) throw new Error(data?.message || 'Update failed');

      setLeads(prev => prev.map(lead => (lead.id === leadId ? data.lead : lead)));
    } catch (error) {
      setErrorMessage(isRtl ? 'بروزرسانی وضعیت مشاوره تولیدکننده با خطا مواجه شد.' : 'Failed to update manufacturer consultation status.');
    } finally {
      setSavingId(null);
    }
  };

  const createWhatsAppUrl = (lead: ManufacturerLead) => {
    const phone = normalizePhone(lead.phone);
    if (!phone) return '';
    const message = encodeURIComponent(
      isRtl
        ? `سلام ${lead.contactName} عزیز، از طرف ایران‌بیم‌هاب درباره مشاوره BIM محصولات شرکت ${lead.companyName} پیام می‌دهم.`
        : `Hello ${lead.contactName}, I am contacting you from IranBIMhub about BIM consultation for ${lead.companyName}.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const createTelegramUrl = (lead: ManufacturerLead) => {
    const phone = normalizePhone(lead.phone);
    if (!phone) return '';
    const message = encodeURIComponent(
      isRtl
        ? `سلام ${lead.contactName} عزیز، از طرف ایران‌بیم‌هاب درباره مشاوره BIM محصولات شرکت ${lead.companyName} پیام می‌دهم.`
        : `Hello ${lead.contactName}, I am contacting you from IranBIMhub about BIM consultation for ${lead.companyName}.`
    );
    return `tg://resolve?phone=${phone}&text=${message}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
            <Factory className="w-5 h-5 text-[#26B6B6]" />
            <span>{isRtl ? 'مشاوره تولیدکنندگان' : 'Manufacturer BIM Consultations'}</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed max-w-3xl">
            {isRtl
              ? 'این بخش برای مدیریت پیش‌ثبت‌نام و مشاوره اولیه تولیدکنندگان است. فایل BIM آماده باید در پنل برند آپلود شود؛ تلگرام/واتساپ فقط برای کاتالوگ اولیه و هماهنگی مشاوره استفاده می‌شود.'
              : 'This section manages manufacturer pre-registration and initial consultation. Ready BIM files must be uploaded in the brand panel; Telegram/WhatsApp are only for initial catalogs and consultation coordination.'
            }
          </p>
        </div>
        <button
          onClick={loadLeads}
          disabled={isLoading}
          className="px-4 py-2.5 bg-[#26B6B6] hover:bg-[#1e9494] disabled:bg-gray-400 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>{isRtl ? 'بروزرسانی فهرست' : 'Refresh List'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'کل مشاوره‌ها' : 'Total'}</span>
            <Building2 className="w-4 h-4 text-[#26B6B6]" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{leads.length.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'فایل آماده دارند' : 'Has BIM'}</span>
            <FileCheck2 className="w-4 h-4 text-cyan-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{(leadCounts.yes || 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'نیازمند تولید BIM' : 'Needs Creation'}</span>
            <Wand2 className="w-4 h-4 text-purple-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{(leadCounts.no || 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'ارجاع رسمی' : 'Official Signup'}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{(leadCounts.published || 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative w-full md:max-w-sm">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={isRtl ? 'جستجو بر اساس برند، شهر، محصول یا فرمت...' : 'Search by brand, city, product or format...'}
              className={`w-full py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs outline-none focus:border-[#26B6B6] ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
            />
          </div>
          <span className="text-[11px] text-gray-400 font-bold">
            {isRtl ? `${filteredLeads.length.toLocaleString('fa-IR')} درخواست نمایش داده می‌شود` : `${filteredLeads.length} consultations shown`}
          </span>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center text-gray-400 text-xs font-bold">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#26B6B6]" />
            {isRtl ? 'در حال دریافت درخواست‌ها...' : 'Loading requests...'}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-xs font-bold bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            {isRtl ? 'هنوز درخواست مشاوره تولیدکننده‌ای ثبت نشده است.' : 'No manufacturer consultation requests have been submitted yet.'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map(lead => {
              const whatsappUrl = createWhatsAppUrl(lead);
              const telegramUrl = createTelegramUrl(lead);
              const statusClass = statusClassName[lead.status] || statusClassName.new;
              return (
                <div key={lead.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-black text-gray-850 dark:text-white">{lead.companyName}</h4>
                        {lead.brandName && <span className="text-xs font-bold text-gray-500">({lead.brandName})</span>}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${statusClass}`}>
                          {getStatusLabel(lead.status || 'new')}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                          {getBimStatusLabel(lead.hasBimFiles, isRtl)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#26B6B6]" />{lead.phone}</span>
                        {lead.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#26B6B6]" />{lead.email}</span>}
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#26B6B6]" />{lead.city}</span>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{lead.productCategory}</span>
                      </div>

                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {isRtl ? 'مسئول پیگیری:' : 'Contact:'} <strong className="text-gray-800 dark:text-white">{lead.contactName}</strong>
                        {lead.roleTitle ? ` — ${lead.roleTitle}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {lead.catalogUrl && (
                        <a href={lead.catalogUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-extrabold hover:text-[#26B6B6] transition-colors flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'کاتالوگ/لینک اولیه' : 'Catalog/Link'}</span>
                        </a>
                      )}
                      {lead.websiteOrSocial && (
                        <a href={lead.websiteOrSocial} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-extrabold hover:text-[#26B6B6] transition-colors flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'وب‌سایت' : 'Website'}</span>
                        </a>
                      )}
                      {telegramUrl && (
                        <a href={telegramUrl} className="px-3 py-2 bg-[#26B6B6]/10 border border-[#26B6B6]/20 text-[#138f8f] dark:text-[#26B6B6] rounded-xl text-[10px] font-extrabold hover:bg-[#26B6B6]/15 transition-colors flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'تلگرام' : 'Telegram'}</span>
                        </a>
                      )}
                      {whatsappUrl && (
                        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] rounded-xl text-[10px] font-extrabold hover:bg-[#25D366]/15 transition-colors flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'واتساپ' : 'WhatsApp'}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {lead.hasBimFiles === 'yes' && (
                    <div className="rounded-2xl border border-cyan-100 dark:border-cyan-900 bg-cyan-50 dark:bg-cyan-950/25 p-3 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#26B6B6] shrink-0 mt-0.5" />
                      <p className="text-xs text-cyan-900 dark:text-cyan-100 leading-relaxed">
                        {isRtl
                          ? 'این تولیدکننده اعلام کرده فایل BIM آماده دارد. مسیر پیشنهادی: ساخت پروفایل برند، آپلود رسمی در پنل تولیدکننده، پرداخت هزینه ارزیابی، بررسی توسط کارشناس، گزارش اصلاحات و حداکثر ۳ نوبت بازبینی همان فایل.'
                          : 'This manufacturer says they have ready BIM files. Recommended path: create brand profile, official upload in manufacturer panel, audit fee, specialist review, correction report and up to 3 re-reviews of the same file.'
                        }
                      </p>
                    </div>
                  )}

                  {lead.hasBimFiles !== 'yes' && (
                    <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/25 p-3 flex items-start gap-3">
                      <Wand2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed">
                        {isRtl
                          ? 'این درخواست برای مشاوره اولیه و بررسی مسیر تولید آبجکت BIM است. تلگرام/واتساپ برای دریافت کاتالوگ، دیتاشیت و عکس محصول مناسب است.'
                          : 'This request is for initial consultation and BIM creation path review. Telegram/WhatsApp are suitable for receiving catalogs, datasheets and product photos.'
                        }
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3">
                      <span className="block text-[10px] text-gray-400 font-black mb-1">{isRtl ? 'تعداد/دامنه محصولات' : 'Product Count / Scope'}</span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{lead.productCount || '-'}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3">
                      <span className="block text-[10px] text-gray-400 font-black mb-2">{isRtl ? 'فرمت‌های اعلام‌شده' : 'Reported BIM Formats'}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(lead.bimFormats && lead.bimFormats.length > 0) ? lead.bimFormats.map(format => <span key={format} className="px-2 py-1 rounded-lg bg-[#26B6B6]/10 text-[#138f8f] dark:text-[#26B6B6] text-[10px] font-bold">{format}</span>) : <span className="text-gray-400">-</span>}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3">
                      <span className="block text-[10px] text-gray-400 font-black mb-2">{isRtl ? 'روش ارسال اطلاعات اولیه' : 'Initial Info Submission'}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {lead.filesSentByTelegram && <span className="px-2 py-1 rounded-lg bg-[#26B6B6]/10 text-[#138f8f] dark:text-[#26B6B6] text-[10px] font-bold">Telegram</span>}
                        {lead.filesSentByWhatsApp && <span className="px-2 py-1 rounded-lg bg-[#25D366]/10 text-[#128C7E] text-[10px] font-bold">WhatsApp</span>}
                        {lead.catalogUrl && <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold">Link</span>}
                      </div>
                    </div>
                  </div>

                  {lead.message && (
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      <span className="block text-[10px] text-gray-400 font-black mb-1">{isRtl ? 'توضیح تولیدکننده' : 'Manufacturer Message'}</span>
                      {lead.message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 border-t border-gray-200/70 dark:border-slate-800">
                    <div className="lg:col-span-3">
                      <label className="block text-[10px] text-gray-400 font-black mb-1.5">{isRtl ? 'وضعیت پیگیری مشاوره' : 'Consultation Status'}</label>
                      <select
                        value={statusById[lead.id] || lead.status || 'new'}
                        onChange={(event) => setStatusById(prev => ({ ...prev, [lead.id]: event.target.value as ManufacturerLeadStatus }))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none"
                      >
                        {STATUS_OPTIONS.map(status => <option key={status.value} value={status.value}>{isRtl ? status.fa : status.en}</option>)}
                      </select>
                    </div>
                    <div className="lg:col-span-7">
                      <label className="block text-[10px] text-gray-400 font-black mb-1.5">{isRtl ? 'یادداشت داخلی ادمین' : 'Internal Admin Notes'}</label>
                      <input
                        value={notesById[lead.id] || ''}
                        onChange={(event) => setNotesById(prev => ({ ...prev, [lead.id]: event.target.value }))}
                        placeholder={isRtl ? 'مثلاً: فایل آماده دارد؛ هزینه و مسیر ارزیابی توضیح داده شود و به ثبت‌نام رسمی هدایت شود.' : 'Example: Has ready file; explain audit cost/path and route to official signup.'}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none"
                      />
                    </div>
                    <div className="lg:col-span-2 flex items-end">
                      <button
                        onClick={() => handleSaveLead(lead.id)}
                        disabled={savingId === lead.id}
                        className="w-full px-3 py-2 bg-[#26B6B6] hover:bg-[#1e9494] disabled:bg-gray-400 text-white rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {savingId === lead.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        <span>{isRtl ? 'ذخیره' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
