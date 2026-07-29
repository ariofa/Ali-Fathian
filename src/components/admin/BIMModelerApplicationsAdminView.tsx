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
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

type ModelerApplicationStatus = 'new' | 'reviewing' | 'shortlisted' | 'test_project' | 'approved' | 'rejected';

interface BIMModelerApplication {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  mainSpecialty: string;
  experienceYears: string;
  availability?: string;
  portfolioUrl?: string;
  portfolioSentByWhatsApp?: boolean;
  linkedinUrl?: string;
  softwareSkills: string[];
  preferredProjectTypes: string[];
  message?: string;
  status: ModelerApplicationStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

const STATUS_OPTIONS: { value: ModelerApplicationStatus; fa: string; en: string }[] = [
  { value: 'new', fa: 'جدید', en: 'New' },
  { value: 'reviewing', fa: 'در حال بررسی', en: 'Reviewing' },
  { value: 'shortlisted', fa: 'منتخب اولیه', en: 'Shortlisted' },
  { value: 'test_project', fa: 'پروژه آزمایشی', en: 'Test Project' },
  { value: 'approved', fa: 'تأیید شده', en: 'Approved' },
  { value: 'rejected', fa: 'رد شده', en: 'Rejected' }
];

const statusClassName: Record<ModelerApplicationStatus, string> = {
  new: 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-300',
  reviewing: 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-300',
  shortlisted: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/35 dark:text-cyan-300',
  test_project: 'bg-purple-50 text-purple-700 dark:bg-purple-950/35 dark:text-purple-300',
  approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300',
  rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-300'
};

const normalizePhoneForWhatsApp = (phone: string) => {
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return `98${digits.slice(1)}`;
  return digits;
};

export const BIMModelerApplicationsAdminView: React.FC = () => {
  const { isRtl } = useLanguage();
  const [applications, setApplications] = useState<BIMModelerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [statusById, setStatusById] = useState<Record<string, ModelerApplicationStatus>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadApplications = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/bim-modeler-applications');
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.success === false) throw new Error(data?.message || 'Load failed');

      const loadedApplications = Array.isArray(data.applications) ? data.applications : [];
      setApplications(loadedApplications);

      const nextNotes: Record<string, string> = {};
      const nextStatuses: Record<string, ModelerApplicationStatus> = {};
      loadedApplications.forEach((application: BIMModelerApplication) => {
        nextNotes[application.id] = application.adminNotes || '';
        nextStatuses[application.id] = application.status || 'new';
      });
      setNotesById(nextNotes);
      setStatusById(nextStatuses);
    } catch (error) {
      setErrorMessage(isRtl ? 'دریافت درخواستهای همکاری با خطا مواجه شد.' : 'Failed to load collaboration applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter(application => {
      const haystack = [
        application.fullName,
        application.phone,
        application.email,
        application.city,
        application.mainSpecialty,
        application.experienceYears,
        application.availability,
        application.message,
        ...(application.softwareSkills || []),
        ...(application.preferredProjectTypes || [])
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [applications, searchQuery]);

  const statusCounts = useMemo(() => {
    return applications.reduce<Record<string, number>>((acc, application) => {
      acc[application.status] = (acc[application.status] || 0) + 1;
      return acc;
    }, {});
  }, [applications]);

  const handleSaveApplication = async (applicationId: string) => {
    setSavingId(applicationId);
    setErrorMessage('');
    try {
      const response = await fetch(`/api/admin/bim-modeler-applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusById[applicationId] || 'new',
          adminNotes: notesById[applicationId] || ''
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.success === false) throw new Error(data?.message || 'Update failed');

      setApplications(prev => prev.map(application => (
        application.id === applicationId ? data.application : application
      )));
    } catch (error) {
      setErrorMessage(isRtl ? 'به‌روزرسانی وضعیت درخواست با خطا مواجه شد.' : 'Failed to update application status.');
    } finally {
      setSavingId(null);
    }
  };

  const getStatusLabel = (status: ModelerApplicationStatus) => {
    const statusOption = STATUS_OPTIONS.find(item => item.value === status);
    return isRtl ? statusOption?.fa || status : statusOption?.en || status;
  };

  const createApplicantWhatsAppUrl = (application: BIMModelerApplication) => {
    const normalizedPhone = normalizePhoneForWhatsApp(application.phone);
    if (!normalizedPhone) return '';
    const message = encodeURIComponent(
      isRtl
        ? `سلام ${application.fullName} عزیز، از طرف ایران‌بیم‌هاب درباره درخواست همکاری پروژه‌ای مدل‌ساز BIM پیام می‌دهم.`
        : `Hello ${application.fullName}, I am contacting you from IranBIMhub about your BIM modeler collaboration application.`
    );
    return `https://wa.me/${normalizedPhone}?text=${message}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#26B6B6]" />
            <span>{isRtl ? 'درخواستهای همکاری مدل‌سازان BIM' : 'BIM Modeler Collaboration Applications'}</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {isRtl
              ? 'اینجا درخواستهای ثبت‌شده از صفحه همکاری پروژه‌ای مدل‌سازان BIM را بررسی، دستهبندی و پیگیری می‌کنید.'
              : 'Review, classify and follow up applications submitted from the BIM modeler collaboration page.'
            }
          </p>
        </div>
        <button
          onClick={loadApplications}
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
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'کل درخواستها' : 'Total'}</span>
            <FileText className="w-4 h-4 text-[#26B6B6]" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{applications.length.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
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
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'منتخب اولیه' : 'Shortlisted'}</span>
            <UserCheck className="w-4 h-4 text-cyan-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{(statusCounts.shortlisted || 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'تأیید شده' : 'Approved'}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{(statusCounts.approved || 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative w-full md:max-w-sm">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={isRtl ? 'جستجو بر اساس نام، شهر، تخصص یا نرم‌افزار...' : 'Search by name, city, specialty or software...'}
              className={`w-full py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs outline-none focus:border-[#26B6B6] ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
            />
          </div>
          <span className="text-[11px] text-gray-400 font-bold">
            {isRtl ? `${filteredApplications.length.toLocaleString('fa-IR')} درخواست نمایش داده می‌شود` : `${filteredApplications.length} applications shown`}
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
            {isRtl ? 'در حال دریافت درخواستها...' : 'Loading applications...'}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-xs font-bold bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            {isRtl ? 'هنوز درخواست همکاری مدل‌ساز BIM ثبت نشده است.' : 'No BIM modeler applications have been submitted yet.'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map(application => {
              const applicantWhatsAppUrl = createApplicantWhatsAppUrl(application);
              return (
                <div key={application.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-black text-gray-850 dark:text-white">{application.fullName}</h4>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${statusClassName[application.status || 'new']}`}>
                          {getStatusLabel(application.status || 'new')}
                        </span>
                        {application.portfolioSentByWhatsApp && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#25D366]/10 text-[#128C7E]">
                            {isRtl ? 'نمونه‌کار از طریق واتساپ' : 'Portfolio via WhatsApp'}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#26B6B6]" />{application.phone}</span>
                        {application.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#26B6B6]" />{application.email}</span>}
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#26B6B6]" />{application.city}</span>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{application.mainSpecialty}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {application.portfolioUrl && (
                        <a href={application.portfolioUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-extrabold hover:text-[#26B6B6] transition-colors flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'مشاهده نمونه‌کار' : 'Portfolio'}</span>
                        </a>
                      )}
                      {application.linkedinUrl && (
                        <a href={application.linkedinUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-extrabold hover:text-[#26B6B6] transition-colors flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {applicantWhatsAppUrl && (
                        <a href={applicantWhatsAppUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] rounded-xl text-[10px] font-extrabold hover:bg-[#25D366]/15 transition-colors flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'پیام واتساپ' : 'WhatsApp'}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3">
                      <span className="block text-[10px] text-gray-400 font-black mb-1">{isRtl ? 'سابقه و آمادگی' : 'Experience & Availability'}</span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{application.experienceYears || '-'}</p>
                      {application.availability && <p className="text-gray-500 dark:text-gray-400 mt-1">{application.availability}</p>}
                    </div>
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3">
                      <span className="block text-[10px] text-gray-400 font-black mb-2">{isRtl ? 'نرم‌افزارها' : 'Software'}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(application.softwareSkills || []).map(skill => <span key={skill} className="px-2 py-1 rounded-lg bg-[#26B6B6]/10 text-[#138f8f] dark:text-[#26B6B6] text-[10px] font-bold">{skill}</span>)}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3">
                      <span className="block text-[10px] text-gray-400 font-black mb-2">{isRtl ? 'نوع پروژهها' : 'Project Types'}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(application.preferredProjectTypes || []).map(type => <span key={type} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold">{type}</span>)}
                      </div>
                    </div>
                  </div>

                  {application.message && (
                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      <span className="block text-[10px] text-gray-400 font-black mb-1">{isRtl ? 'توضیح متقاضی' : 'Applicant Message'}</span>
                      {application.message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 border-t border-gray-200/70 dark:border-slate-800">
                    <div className="lg:col-span-3">
                      <label className="block text-[10px] text-gray-400 font-black mb-1.5">{isRtl ? 'وضعیت بررسی' : 'Review Status'}</label>
                      <select
                        value={statusById[application.id] || application.status || 'new'}
                        onChange={(event) => setStatusById(prev => ({ ...prev, [application.id]: event.target.value as ModelerApplicationStatus }))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none"
                      >
                        {STATUS_OPTIONS.map(status => <option key={status.value} value={status.value}>{isRtl ? status.fa : status.en}</option>)}
                      </select>
                    </div>
                    <div className="lg:col-span-7">
                      <label className="block text-[10px] text-gray-400 font-black mb-1.5">{isRtl ? 'یادداشت داخلی ادمین' : 'Internal Admin Notes'}</label>
                      <input
                        value={notesById[application.id] || ''}
                        onChange={(event) => setNotesById(prev => ({ ...prev, [application.id]: event.target.value }))}
                        placeholder={isRtl ? 'مثلاً: نمونه‌کار مناسب فمیلی معماری؛ برای پروژه آزمایشی تماس گرفته شود.' : 'Example: Good architectural family samples; contact for test project.'}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none"
                      />
                    </div>
                    <div className="lg:col-span-2 flex items-end">
                      <button
                        onClick={() => handleSaveApplication(application.id)}
                        disabled={savingId === application.id}
                        className="w-full px-3 py-2 bg-[#26B6B6] hover:bg-[#1e9494] disabled:bg-gray-400 text-white rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {savingId === application.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
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
