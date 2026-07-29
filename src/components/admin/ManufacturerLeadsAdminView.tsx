import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Factory
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

type ManufacturerLeadStatus = 'new' | 'contact_needed' | 'waiting_files' | 'has_bim_ready' | 'needs_bim_creation' | 'technical_review' | 'ready_to_publish' | 'published' | 'rejected';

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
  hasBimFiles: 'yes' | 'no' | 'not-sure' | '';
  bimFormats: string[];
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
  { value: 'contact_needed', fa: 'نیاز به تماس', en: 'Contact Needed' },
  { value: 'waiting_files', fa: 'منتظر ارسال فایل', en: 'Waiting for Files' },
  { value: 'has_bim_ready', fa: 'دارای فایل BIM', en: 'Has BIM Ready' },
  { value: 'needs_bim_creation', fa: 'نیاز به تولید آبجکت', en: 'Needs BIM Creation' },
  { value: 'technical_review', fa: 'بررسی فنی (QA)', en: 'Technical Review' },
  { value: 'ready_to_publish', fa: 'آماده انتشار', en: 'Ready to Publish' },
  { value: 'published', fa: 'منتشر شده', en: 'Published' },
  { value: 'rejected', fa: 'رد شده', en: 'Rejected' }
];

const statusClassName: Record<ManufacturerLeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-300',
  contact_needed: 'bg-orange-50 text-orange-700 dark:bg-orange-950/35 dark:text-orange-300',
  waiting_files: 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-300',
  has_bim_ready: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300',
  needs_bim_creation: 'bg-purple-50 text-purple-700 dark:bg-purple-950/35 dark:text-purple-300',
  technical_review: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-300',
  ready_to_publish: 'bg-teal-50 text-teal-700 dark:bg-teal-950/35 dark:text-teal-300',
  published: 'bg-green-50 text-green-700 dark:bg-green-950/35 dark:text-green-300',
  rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-300'
};

const normalizePhoneForContact = (phone: string) => {
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return `98${digits.slice(1)}`;
  return digits;
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
      setErrorMessage(isRtl ? 'دریافت درخواست‌های تولیدکنندگان با خطا مواجه شد.' : 'Failed to load manufacturer leads.');
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
        lead.message,
        ...(lead.bimFormats || [])
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [leads, searchQuery]);

  const statusCounts = useMemo(() => {
    return leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
  }, [leads]);

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

      setLeads(prev => prev.map(lead => (
        lead.id === leadId ? data.lead : lead
      )));
    } catch (error) {
      setErrorMessage(isRtl ? 'به‌روزرسانی وضعیت درخواست با خطا مواجه شد.' : 'Failed to update lead status.');
    } finally {
      setSavingId(null);
    }
  };

  const getStatusLabel = (status: ManufacturerLeadStatus) => {
    const statusOption = STATUS_OPTIONS.find(item => item.value === status);
    return isRtl ? statusOption?.fa || status : statusOption?.en || status;
  };

  const createWhatsAppUrl = (lead: ManufacturerLead) => {
    const normalizedPhone = normalizePhoneForContact(lead.phone);
    if (!normalizedPhone) return '';
    const message = encodeURIComponent(
      isRtl
        ? `سلام ${lead.contactName} عزیز، از طرف ایران‌بیم‌هاب درباره درخواست همکاری شرکت ${lead.companyName} پیام می‌دهم.`
        : `Hello ${lead.contactName}, I am contacting you from IranBIMhub regarding ${lead.companyName}'s collaboration request.`
    );
    return `https://wa.me/${normalizedPhone}?text=${message}`;
  };

  const createTelegramUrl = (lead: ManufacturerLead) => {
    const normalizedPhone = normalizePhoneForContact(lead.phone);
    if (!normalizedPhone) return '';
    return `tg://resolve?phone=${normalizedPhone}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
            <Factory className="w-5 h-5 text-[#26B6B6]" />
            <span>{isRtl ? 'درخواست‌های همکاری تولیدکنندگان' : 'Manufacturer Collaboration Requests'}</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {isRtl
              ? 'بررسی و پیگیری درخواست‌های ثبت‌شده تولیدکنندگان برای انتشار کاتالوگ یا ساخت آبجکت BIM.'
              : 'Review and follow up on manufacturer requests for catalog publishing or BIM object creation.'
            }
          </p>
        </div>
        <button
          onClick={loadLeads}
          disabled={isLoading}
          className="px-4 py-2.5 bg-[#26B6B6] hover:bg-[#1e9494] disabled:bg-gray-400 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>{isRtl ? 'به‌روزرسانی فهرست' : 'Refresh List'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'کل درخواست‌ها' : 'Total'}</span>
            <FileText className="w-4 h-4 text-[#26B6B6]" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{leads.length.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'جدید' : 'New'}</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{(statusCounts.new || 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'نیاز به اقدام' : 'Action Needed'}</span>
            <MessageCircle className="w-4 h-4 text-orange-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{((statusCounts.contact_needed || 0) + (statusCounts.waiting_files || 0)).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'منتشر شده' : 'Published'}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{(statusCounts.published || 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative w-full md:max-w-sm">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={isRtl ? 'جستجو بر اساس نام شرکت، شخص، شهر و...' : 'Search by company, name, city...'}
              className={`w-full py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs outline-none focus:border-[#26B6B6] ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
            />
          </div>
          <span className="text-[11px] text-gray-400 font-bold">
            {isRtl ? `${filteredLeads.length.toLocaleString('fa-IR')} درخواست نمایش داده می‌شود` : `${filteredLeads.length} requests shown`}
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
            {isRtl ? 'هیچ درخواست همکاری تولیدکننده‌ای یافت نشد.' : 'No manufacturer requests found.'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map(lead => {
              const whatsappUrl = createWhatsAppUrl(lead);
              const telegramUrl = createTelegramUrl(lead);
              return (
                <div key={lead.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-black text-gray-850 dark:text-white">{lead.companyName} {lead.brandName ? `(${lead.brandName})` : ''}</h4>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${statusClassName[lead.status || 'new']}`}>
                          {getStatusLabel(lead.status || 'new')}
                        </span>
                        {lead.hasBimFiles === 'yes' && <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">{isRtl ? 'دارای فایل BIM' : 'Has BIM Files'}</span>}
                        {lead.hasBimFiles === 'no' && <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">{isRtl ? 'نیاز به ساخت BIM' : 'Needs BIM Creation'}</span>}
                        {lead.filesSentByTelegram && <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">{isRtl ? 'ارسال فایل تلگرام' : 'Telegram Files'}</span>}
                        {lead.filesSentByWhatsApp && <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-700">{isRtl ? 'ارسال فایل واتساپ' : 'WhatsApp Files'}</span>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#26B6B6]" />{lead.phone}</span>
                        {lead.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#26B6B6]" />{lead.email}</span>}
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#26B6B6]" />{lead.city}</span>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{lead.contactName} ({lead.roleTitle || '-'})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {lead.catalogUrl && (
                        <a href={lead.catalogUrl.startsWith('http') ? lead.catalogUrl : `https://${lead.catalogUrl}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-extrabold hover:text-[#26B6B6] transition-colors flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'فایل / کاتالوگ' : 'File / Catalog'}</span>
                        </a>
                      )}
                      {lead.websiteOrSocial && (
                        <a href={lead.websiteOrSocial.startsWith('http') ? lead.websiteOrSocial : `https://${lead.websiteOrSocial}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-extrabold hover:text-[#26B6B6] transition-colors flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'سایت / سوشال' : 'Website'}</span>
                        </a>
                      )}
                      {telegramUrl && (
                        <a href={telegramUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-[#0088cc]/10 border border-[#0088cc]/20 text-[#0088cc] rounded-xl text-[10px] font-extrabold hover:bg-[#0088cc]/15 transition-colors flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>تلگرام</span>
                        </a>
                      )}
                      {whatsappUrl && (
                        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] rounded-xl text-[10px] font-extrabold hover:bg-[#25D366]/15 transition-colors flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساپ</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3">
                      <span className="block text-[10px] text-gray-400 font-black mb-1">{isRtl ? 'دسته‌بندی و تنوع محصول' : 'Category & Product Range'}</span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-bold">{lead.productCategory || '-'}</p>
                      {lead.productCount && <p className="text-gray-500 dark:text-gray-400 mt-1">{lead.productCount}</p>}
                    </div>
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3 lg:col-span-2">
                      <span className="block text-[10px] text-gray-400 font-black mb-2">{isRtl ? 'فرمت‌های BIM موجود' : 'Existing BIM Formats'}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {lead.hasBimFiles === 'yes' && (lead.bimFormats || []).length > 0 ? (
                          (lead.bimFormats || []).map(format => <span key={format} className="px-2 py-1 rounded-lg bg-[#26B6B6]/10 text-[#138f8f] dark:text-[#26B6B6] text-[10px] font-bold">{format}</span>)
                        ) : (
                          <span className="text-gray-500 text-[10px]">{isRtl ? 'ندارد / مشخص نیست' : 'None / Not sure'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {lead.message && (
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      <span className="block text-[10px] text-gray-400 font-black mb-1">{isRtl ? 'توضیحات تکمیلی تولیدکننده' : 'Additional Message'}</span>
                      {lead.message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 border-t border-gray-200/70 dark:border-slate-800">
                    <div className="lg:col-span-3">
                      <label className="block text-[10px] text-gray-400 font-black mb-1.5">{isRtl ? 'وضعیت بررسی' : 'Review Status'}</label>
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
                        placeholder={isRtl ? 'مثلاً: فایل رو در تلگرام فرستادن، در حال بررسی کیفیت فایل هستیم.' : 'Example: Files sent on Telegram, QA in progress.'}
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
