import React, { useMemo, useState } from 'react';
import { toast } from '../ui/toast';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FileText,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface BrandVerificationAdminViewProps {
  mfgProfile: any | null;
  setMfgProfile: React.Dispatch<React.SetStateAction<any | null>>;
  currentAdminName?: string;
  onLogAction?: (action: string, targetType: string, targetName: string, reason: string, details?: string) => void;
}

const getStatusMeta = (status: string, isRtl: boolean) => {
  switch (status) {
    case 'under_evaluation':
      return {
        label: isRtl ? 'در حال ارزیابی' : 'Under Evaluation',
        icon: <FileCheck2 className="w-4 h-4 text-amber-500" />,
        className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
      };
    case 'needs_correction':
      return {
        label: isRtl ? 'نیازمند اصلاح مدارک' : 'Needs Correction',
        icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
        className: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300'
      };
    case 'verified':
      return {
        label: isRtl ? 'تأیید شده' : 'Verified',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
        className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
      };
    case 'rejected':
      return {
        label: isRtl ? 'رد شده' : 'Rejected',
        icon: <XCircle className="w-4 h-4 text-rose-500" />,
        className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
      };
    default:
      return {
        label: isRtl ? 'در انتظار ارسال مدارک' : 'Waiting for Documents',
        icon: <ShieldCheck className="w-4 h-4 text-[#26B6B6]" />,
        className: 'bg-[#26B6B6]/10 text-[#138f8f] dark:text-[#26B6B6]'
      };
  }
};

const ownershipLabel = (value: string, isRtl: boolean) => {
  const map: Record<string, { fa: string; en: string }> = {
    'Direct Manufacturer': { fa: 'تولیدکننده مستقیم', en: 'Direct Manufacturer' },
    'Brand Owner': { fa: 'صاحب برند', en: 'Brand Owner' },
    'Official Representative / Importer': { fa: 'نماینده رسمی / واردکننده رسمی', en: 'Official Representative / Importer' },
    'Distributor / Seller': { fa: 'توزیع‌کننده / فروشنده', en: 'Distributor / Seller' },
    'Other / Needs Review': { fa: 'سایر / نیازمند بررسی', en: 'Other / Needs Review' }
  };
  return isRtl ? (map[value]?.fa || value || '-') : (map[value]?.en || value || '-');
};

const getOfficialDocs = (profile: any) => ({
  officialCompanyName: profile?.officialDocs?.officialCompanyName || profile?.nameFa || profile?.companyName || '',
  nationalId: profile?.officialDocs?.nationalId || '',
  registrationNumber: profile?.officialDocs?.registrationNumber || '',
  officialGazetteUrl: profile?.officialDocs?.officialGazetteUrl || '',
  officialGazetteFile: profile?.officialDocs?.officialGazetteFile || '',
  officialGazetteFileUrl: profile?.officialDocs?.officialGazetteFileUrl || '',
  representativeLetterFile: profile?.officialDocs?.representativeLetterFile || '',
  representativeLetterFileUrl: profile?.officialDocs?.representativeLetterFileUrl || '',
  ownershipType: profile?.officialDocs?.ownershipType || profile?.brandOwnershipType || profile?.companyType || '',
  adminNote: profile?.officialDocs?.adminNote || ''
});

const addAdminCommentToKeyDocs = (docs: any[], status: string, adminName: string, note: string, isRtl: boolean) => {
  const keyIds = new Set(['doc-official-gazette', 'doc-brand-ownership', 'doc-gazette']);
  const now = new Date().toLocaleDateString(isRtl ? 'fa-IR' : 'en-US') + ' - ' + new Date().toLocaleTimeString(isRtl ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  return (docs || []).map(doc => {
    if (!keyIds.has(doc.id) && !doc.isGazette) return doc;
    const comment = {
      id: `brand-eval-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sender: 'Admin' as const,
      senderName: adminName,
      text: note,
      date: now
    };
    return {
      ...doc,
      status,
      rejectionReasonFa: status === 'Rejected' ? note : doc.rejectionReasonFa,
      comments: [...(doc.comments || []), comment]
    };
  });
};

export const BrandVerificationAdminView: React.FC<BrandVerificationAdminViewProps> = ({
  mfgProfile,
  setMfgProfile,
  currentAdminName,
  onLogAction
}) => {
  const { isRtl } = useLanguage();
  const [adminNote, setAdminNote] = useState('');
  const docs = useMemo(() => getOfficialDocs(mfgProfile), [mfgProfile]);
  const status = mfgProfile?.brandVerificationStatus || 'not_started';
  const statusMeta = getStatusMeta(status, isRtl);
  const adminName = currentAdminName || (isRtl ? 'واحد ارزیابی ایران‌بیم‌هاب' : 'IranBIMhub Evaluation Team');
  const hasSubmittedDocs = Boolean(
    mfgProfile && (
      docs.nationalId ||
      docs.registrationNumber ||
      docs.officialGazetteUrl ||
      docs.officialGazetteFile ||
      docs.representativeLetterFile ||
      status === 'under_evaluation' ||
      status === 'needs_correction' ||
      status === 'verified' ||
      status === 'rejected'
    )
  );

  const persistProfile = (nextProfile: any, logAction: string, reason: string, details?: string) => {
    setMfgProfile(nextProfile);
    localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(nextProfile));
    localStorage.setItem('iranbimhub_mfg_profile_m1', JSON.stringify(nextProfile));
    window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
    onLogAction?.(logAction, 'Brand Ownership Verification', nextProfile?.nameFa || nextProfile?.companyName || 'Brand Profile', reason, details);
  };

  const handleDecision = (decision: 'approve' | 'needs_correction' | 'reject') => {
    if (!mfgProfile) return;

    const note = adminNote.trim();
    if (decision !== 'approve' && !note) {
      toast(isRtl ? 'برای درخواست اصلاح یا رد مدارک، یادداشت واحد ارزیابی الزامی است.' : 'A note is required for correction request or rejection.');
      return;
    }

    if (decision === 'approve' && (!docs.officialGazetteUrl && !docs.officialGazetteFile)) {
      const confirmed = window.confirm(isRtl
        ? 'لینک یا فایل روزنامه رسمی ثبت نشده است. آیا با وجود این، برند را تأیید می‌کنید؟'
        : 'No official gazette URL/file is registered. Do you still want to approve this brand?'
      );
      if (!confirmed) return;
    }

    const nextStatus = decision === 'approve' ? 'verified' : decision === 'needs_correction' ? 'needs_correction' : 'rejected';
    const nextPublishStatus = decision === 'approve' ? 'public' : 'private_draft';
    const docStatus = decision === 'approve' ? 'Verified' : decision === 'reject' ? 'Rejected' : 'Needs Correction';

    const defaultNote = decision === 'approve'
      ? (isRtl ? 'مدارک رسمی برند توسط واحد ارزیابی تأیید شد.' : 'Brand official documents approved by evaluation team.')
      : note;

    const nextMessage = {
      id: `brand-evaluation-message-${Date.now()}`,
      type: nextStatus,
      titleFa: decision === 'approve'
        ? 'برند شما تأیید شد'
        : decision === 'needs_correction'
        ? 'مدارک برند نیازمند اصلاح است'
        : 'احراز برند رد شد',
      titleEn: decision === 'approve'
        ? 'Your brand has been verified'
        : decision === 'needs_correction'
        ? 'Brand documents need correction'
        : 'Brand verification rejected',
      textFa: defaultNote,
      textEn: defaultNote,
      createdAt: new Date().toISOString(),
      createdBy: adminName,
      read: false
    };

    const nextProfile = {
      ...mfgProfile,
      officialDocs: {
        ...docs,
        adminNote: defaultNote,
        lastEvaluatedAt: new Date().toISOString(),
        lastEvaluatedBy: adminName
      },
      brandOwnershipType: docs.ownershipType || mfgProfile.brandOwnershipType || mfgProfile.companyType || '',
      brandVerificationStatus: nextStatus,
      brandPublishStatus: nextPublishStatus,
      isPendingVerification: decision !== 'approve',
      verifiedAt: decision === 'approve' ? new Date().toISOString() : mfgProfile.verifiedAt,
      verifiedBy: decision === 'approve' ? adminName : mfgProfile.verifiedBy,
      brandEvaluationMessages: [nextMessage, ...(mfgProfile.brandEvaluationMessages || [])].slice(0, 30),
      verificationDocs: addAdminCommentToKeyDocs(mfgProfile.verificationDocs || [], docStatus, adminName, defaultNote, isRtl)
    };

    const logAction = decision === 'approve'
      ? 'تأیید احراز مالکیت برند'
      : decision === 'needs_correction'
      ? 'درخواست اصلاح مدارک برند'
      : 'رد احراز مالکیت برند';

    persistProfile(
      nextProfile,
      logAction,
      defaultNote,
      `brandVerificationStatus: ${nextStatus} | brandPublishStatus: ${nextPublishStatus}`
    );

    localStorage.setItem('iranbimhub_brand_profile_last_admin_message', JSON.stringify(nextMessage));

    setAdminNote('');

    toast(decision === 'approve'
      ? (isRtl ? 'برند تأیید شد و پیام تأیید برای تولیدکننده ثبت شد.' : 'Brand verified and approval message saved for manufacturer.')
      : decision === 'needs_correction'
      ? (isRtl ? 'درخواست اصلاح مدارک برای تولیدکننده ثبت شد.' : 'Correction request saved for manufacturer.')
      : (isRtl ? 'درخواست احراز برند رد شد و پیام برای تولیدکننده ثبت شد.' : 'Brand verification rejected and message saved for manufacturer.')
    );
  };

  return (
    <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-5 text-start">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-gray-150 dark:border-slate-800">
        <div className="space-y-2">
          <h4 className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#26B6B6]" />
            <span>{isRtl ? 'ارزیابی مالکیت یا نمایندگی برند' : 'Brand Ownership / Representation Evaluation'}</span>
          </h4>
          <p className="text-[10.5px] text-gray-400 leading-relaxed max-w-3xl">
            {isRtl
              ? 'این بخش وضعیت احراز مالکیت برند را کنترل می‌کند. تا قبل از تأیید مدارک رسمی، صفحه برند به‌صورت عمومی منتشر نمی‌شود.'
              : 'This section controls brand ownership verification. The public brand page remains disabled until official documents are approved.'
            }
          </p>
        </div>
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black ${statusMeta.className}`}>
          {statusMeta.icon}
          <span>{statusMeta.label}</span>
        </span>
      </div>

      {!mfgProfile ? (
        <div className="p-8 text-center text-gray-400 text-xs font-bold bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          {isRtl ? 'هنوز پروفایل تولیدکننده‌ای برای ارزیابی ثبت نشده است.' : 'No manufacturer profile is available for evaluation yet.'}
        </div>
      ) : !hasSubmittedDocs ? (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-black text-xs">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>{isRtl ? 'در انتظار تکمیل مدارک توسط تولیدکننده' : 'Waiting for manufacturer documents'}</span>
          </div>
          <p className="text-[10.5px] text-gray-400 leading-relaxed">
            {isRtl
              ? 'پس از اینکه تولیدکننده در پنل برند، اطلاعات روزنامه رسمی یا مدارک مالکیت/نمایندگی را ارسال کند، جزئیات اینجا نمایش داده می‌شود.'
              : 'Once the manufacturer submits official gazette or ownership/representation documents from the brand panel, details will appear here.'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-3">
              <h5 className="text-xs font-black text-gray-800 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#26B6B6]" />
                <span>{isRtl ? 'اطلاعات رسمی ثبت‌شده' : 'Submitted Official Information'}</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="block text-gray-400 font-bold mb-1">{isRtl ? 'نام رسمی' : 'Official Name'}</span>
                  <span className="font-black text-gray-800 dark:text-white">{docs.officialCompanyName || '-'}</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-bold mb-1">{isRtl ? 'نقش نسبت به برند' : 'Relationship'}</span>
                  <span className="font-black text-gray-800 dark:text-white">{ownershipLabel(docs.ownershipType, isRtl)}</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-bold mb-1">{isRtl ? 'شناسه ملی' : 'National ID'}</span>
                  <span className="font-mono font-black text-gray-800 dark:text-white">{docs.nationalId || '-'}</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-bold mb-1">{isRtl ? 'شماره ثبت' : 'Registration No.'}</span>
                  <span className="font-mono font-black text-gray-800 dark:text-white">{docs.registrationNumber || '-'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-3">
              <h5 className="text-xs font-black text-gray-800 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#26B6B6]" />
                <span>{isRtl ? 'مدارک و لینک‌ها' : 'Documents & Links'}</span>
              </h5>
              <div className="space-y-2 text-[11px]">
                {docs.officialGazetteUrl ? (
                  <a href={docs.officialGazetteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#26B6B6] font-black hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'مشاهده لینک روزنامه رسمی' : 'Open Official Gazette URL'}</span>
                  </a>
                ) : (
                  <p className="text-gray-400">{isRtl ? 'لینک روزنامه رسمی ثبت نشده است.' : 'No official gazette URL submitted.'}</p>
                )}
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>{isRtl ? 'فایل روزنامه رسمی:' : 'Gazette file:'}</span>
                  <span className="font-mono truncate">{docs.officialGazetteFile || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>{isRtl ? 'مدرک مالکیت/نمایندگی:' : 'Ownership/representation file:'}</span>
                  <span className="font-mono truncate">{docs.representativeLetterFile || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {docs.adminNote && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-100 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
              <strong>{isRtl ? 'آخرین یادداشت واحد ارزیابی: ' : 'Latest evaluation note: '}</strong>
              {docs.adminNote}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">
              {isRtl ? 'یادداشت واحد ارزیابی برای تولیدکننده' : 'Evaluation Team Note for Manufacturer'}
            </label>
            <textarea
              value={adminNote}
              onChange={(event) => setAdminNote(event.target.value)}
              rows={3}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
              placeholder={isRtl
                ? 'مثلاً: لطفاً لینک معتبرتر روزنامه رسمی یا فایل خواناتر بارگذاری کنید.'
                : 'Example: Please upload a clearer file or a valid official gazette link.'
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
            <button
              onClick={() => handleDecision('reject')}
              className="px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 text-xs font-black transition-all cursor-pointer"
            >
              {isRtl ? 'رد احراز برند' : 'Reject Verification'}
            </button>
            <button
              onClick={() => handleDecision('needs_correction')}
              className="px-4 py-2.5 rounded-xl border border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-xs font-black transition-all cursor-pointer"
            >
              {isRtl ? 'درخواست اصلاح مدارک' : 'Request Corrections'}
            </button>
            <button
              onClick={() => handleDecision('approve')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRtl ? 'تأیید برند و فعال‌سازی انتشار عمومی' : 'Approve Brand & Enable Public Publishing'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};