import React from 'react';
import { toast } from '../ui/toast';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FileText,
  ShieldCheck,
  Upload,
  XCircle
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface BrandOwnershipVerificationPanelProps {
  brandInfo: any;
  setBrandInfo: React.Dispatch<React.SetStateAction<any>>;
}

const OWNERSHIP_OPTIONS = [
  {
    id: 'Direct Manufacturer',
    labelFa: 'تولیدکننده مستقیم',
    labelEn: 'Direct Manufacturer',
    descFa: 'شرکت شما خودش محصول ساختمانی را تولید می‌کند.',
    descEn: 'Your company directly manufactures the building product.'
  },
  {
    id: 'Brand Owner',
    labelFa: 'صاحب برند',
    labelEn: 'Brand Owner',
    descFa: 'مالک برند هستید، حتی اگر تولید را برون‌سپاری کرده باشید.',
    descEn: 'You own the brand, even if manufacturing is outsourced.'
  },
  {
    id: 'Official Representative / Importer',
    labelFa: 'نماینده رسمی / واردکننده رسمی',
    labelEn: 'Official Representative / Importer',
    descFa: 'برای معرفی، عرضه یا واردات برند، مدرک نمایندگی رسمی دارید.',
    descEn: 'You have official authorization to represent or import the brand.'
  },
  {
    id: 'Distributor / Seller',
    labelFa: 'توزیع‌کننده / فروشنده',
    labelEn: 'Distributor / Seller',
    descFa: 'فروشنده یا توزیع‌کننده هستید؛ انتشار صفحه رسمی برند نیازمند مدرک نمایندگی یا مالکیت است.',
    descEn: 'You sell or distribute products; public brand ownership requires authorization or ownership proof.'
  },
  {
    id: 'Other / Needs Review',
    labelFa: 'سایر / نیازمند بررسی',
    labelEn: 'Other / Needs Review',
    descFa: 'وضعیت شما باید توسط واحد ارزیابی بررسی شود.',
    descEn: 'Your case needs evaluation team review.'
  }
];

const getSavedManufacturerRelationship = () => {
  if (typeof window === 'undefined') return '';

  try {
    const savedUser = JSON.parse(localStorage.getItem('iranbimhub_user') || 'null');
    const savedProfile = JSON.parse(localStorage.getItem('iranbimhub_mfg_profile') || 'null');
    return savedUser?.brandOwnershipType
      || savedUser?.companyType
      || savedProfile?.brandOwnershipType
      || savedProfile?.companyType
      || '';
  } catch {
    return '';
  }
};

const getDefaultOfficialDocs = (brandInfo: any) => ({
  officialCompanyName: brandInfo?.officialDocs?.officialCompanyName || brandInfo?.nameFa || brandInfo?.companyName || '',
  nationalId: brandInfo?.officialDocs?.nationalId || '',
  registrationNumber: brandInfo?.officialDocs?.registrationNumber || '',
  officialGazetteUrl: brandInfo?.officialDocs?.officialGazetteUrl || '',
  officialGazetteFile: brandInfo?.officialDocs?.officialGazetteFile || '',
  officialGazetteFileUrl: brandInfo?.officialDocs?.officialGazetteFileUrl || '',
  representativeLetterFile: brandInfo?.officialDocs?.representativeLetterFile || '',
  representativeLetterFileUrl: brandInfo?.officialDocs?.representativeLetterFileUrl || '',
  ownershipType: brandInfo?.officialDocs?.ownershipType
    || brandInfo?.brandOwnershipType
    || brandInfo?.companyType
    || getSavedManufacturerRelationship(),
  adminNote: brandInfo?.officialDocs?.adminNote || ''
});

const getStatusMeta = (status: string, isRtl: boolean) => {
  switch (status) {
    case 'under_evaluation':
      return {
        icon: <FileCheck2 className="w-5 h-5 text-amber-500" />,
        label: isRtl ? 'در حال ارزیابی' : 'Under Evaluation',
        desc: isRtl
          ? 'مدارک شما برای بررسی به واحد ارزیابی ارسال شده است. تا زمان تأیید، صفحه برند عمومی نمی‌شود.'
          : 'Your documents have been submitted to the evaluation team. Public brand publishing remains disabled until approval.',
        className: 'bg-amber-50 dark:bg-amber-950/25 border-amber-100 dark:border-amber-900 text-amber-800 dark:text-amber-200'
      };
    case 'needs_correction':
      return {
        icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
        label: isRtl ? 'نیازمند اصلاح مدارک' : 'Needs Correction',
        desc: isRtl
          ? 'واحد ارزیابی برای مدارک شما اصلاح یا توضیح تکمیلی درخواست کرده است.'
          : 'The evaluation team requested corrections or additional information.',
        className: 'bg-orange-50 dark:bg-orange-950/25 border-orange-100 dark:border-orange-900 text-orange-800 dark:text-orange-200'
      };
    case 'verified':
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        label: isRtl ? 'برند تأیید شده' : 'Brand Verified',
        desc: isRtl
          ? 'مالکیت یا نمایندگی برند تأیید شده و امکان انتشار عمومی صفحه برند فعال است.'
          : 'Brand ownership/representation is verified and public publishing can be enabled.',
        className: 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
      };
    case 'rejected':
      return {
        icon: <XCircle className="w-5 h-5 text-rose-500" />,
        label: isRtl ? 'رد شده' : 'Rejected',
        desc: isRtl
          ? 'مدارک ارسالی برای احراز مالکیت یا نمایندگی برند کافی نبوده است.'
          : 'Submitted documents were not sufficient for brand ownership/representation verification.',
        className: 'bg-rose-50 dark:bg-rose-950/25 border-rose-100 dark:border-rose-900 text-rose-800 dark:text-rose-200'
      };
    default:
      return {
        icon: <ShieldCheck className="w-5 h-5 text-[#26B6B6]" />,
        label: isRtl ? 'در انتظار تکمیل مدارک' : 'Waiting for Documents',
        desc: isRtl
          ? 'برای انتشار عمومی صفحه برند و محصولات، ابتدا مدارک رسمی شرکت یا نمایندگی را ارسال کنید.'
          : 'To publish your brand and products publicly, first submit company or representation documents.',
        className: 'bg-[#26B6B6]/5 border-[#26B6B6]/15 text-gray-700 dark:text-gray-200'
      };
  }
};

export const BrandOwnershipVerificationPanel: React.FC<BrandOwnershipVerificationPanelProps> = ({
  brandInfo,
  setBrandInfo
}) => {
  const { isRtl } = useLanguage();
  const officialDocs = getDefaultOfficialDocs(brandInfo);
  const status = brandInfo?.brandVerificationStatus || 'not_started';
  const statusMeta = getStatusMeta(status, isRtl);
  const latestEvaluationMessage = Array.isArray(brandInfo?.brandEvaluationMessages)
    ? brandInfo.brandEvaluationMessages[0]
    : null;
  const adminEvaluationText = officialDocs.adminNote || (latestEvaluationMessage
    ? (isRtl ? latestEvaluationMessage.textFa : latestEvaluationMessage.textEn)
    : '');
  const adminEvaluationTitle = latestEvaluationMessage
    ? (isRtl ? latestEvaluationMessage.titleFa : latestEvaluationMessage.titleEn)
    : (isRtl ? 'پیام واحد ارزیابی' : 'Evaluation Team Message');

  const updateOfficialDocs = (updates: Partial<ReturnType<typeof getDefaultOfficialDocs>>) => {
    setBrandInfo(prev => ({
      ...prev,
      officialDocs: {
        ...getDefaultOfficialDocs(prev),
        ...updates
      },
      brandOwnershipType: updates.ownershipType || prev.brandOwnershipType || prev.companyType || '',
      brandVerificationStatus: prev.brandVerificationStatus === 'verified' ? 'needs_correction' : (prev.brandVerificationStatus || 'not_started'),
      brandPublishStatus: prev.brandPublishStatus || 'private_draft',
      isPendingVerification: true
    }));
  };

  const handleMockFile = (field: 'officialGazetteFile' | 'representativeLetterFile', file?: File) => {
    if (!file) return;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast(isRtl ? 'فرمت فایل باید PDF یا تصویر باشد.' : 'File must be PDF or image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast(isRtl ? 'حجم فایل نباید بیشتر از ۸ مگابایت باشد.' : 'File size must not exceed 8MB.');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    if (field === 'officialGazetteFile') {
      updateOfficialDocs({ officialGazetteFile: file.name, officialGazetteFileUrl: fileUrl });
    } else {
      updateOfficialDocs({ representativeLetterFile: file.name, representativeLetterFileUrl: fileUrl });
    }
  };

  const handleSubmitForEvaluation = () => {
    const docs = getDefaultOfficialDocs(brandInfo);

    if (!docs.officialCompanyName.trim()) {
      toast(isRtl ? 'نام رسمی شرکت یا برند را وارد کنید.' : 'Please enter the official company/brand name.');
      return;
    }
    if (!docs.ownershipType) {
      toast(isRtl ? 'نقش خود نسبت به برند را انتخاب کنید.' : 'Please select your relationship to the brand.');
      return;
    }
    if (!docs.nationalId.trim() && !docs.registrationNumber.trim()) {
      toast(isRtl ? 'شناسه ملی یا شماره ثبت شرکت را وارد کنید.' : 'Please enter national ID or registration number.');
      return;
    }
    if (!docs.officialGazetteUrl.trim() && !docs.officialGazetteFile) {
      toast(isRtl ? 'لینک یا فایل روزنامه رسمی را وارد کنید.' : 'Please provide an official gazette URL or file.');
      return;
    }

    const nowFa = new Date().toLocaleDateString('fa-IR');
    const nowEn = new Date().toISOString().slice(0, 10);
    const nextVerificationDocs = Array.isArray(brandInfo.verificationDocs) ? [...brandInfo.verificationDocs] : [];

    const upsertDoc = (doc: any) => {
      const index = nextVerificationDocs.findIndex(existing => existing.id === doc.id);
      if (index >= 0) nextVerificationDocs[index] = { ...nextVerificationDocs[index], ...doc };
      else nextVerificationDocs.unshift(doc);
    };

    upsertDoc({
      id: 'doc-official-gazette',
      nameFa: 'روزنامه رسمی / آگهی ثبت یا آخرین تغییرات',
      nameEn: 'Official Gazette / Company Registration Notice',
      type: 'PDF/URL',
      status: 'Pending',
      date: isRtl ? nowFa : nowEn,
      isGazette: true,
      description: `Official company: ${docs.officialCompanyName} | National ID: ${docs.nationalId || '-'} | Reg No: ${docs.registrationNumber || '-'}`,
      url: docs.officialGazetteUrl,
      fileUrl: docs.officialGazetteFileUrl,
      fileName: docs.officialGazetteFile
    });

    upsertDoc({
      id: 'doc-brand-ownership',
      nameFa: 'مدرک مالکیت یا نمایندگی برند',
      nameEn: 'Brand Ownership or Representation Proof',
      type: 'PDF/URL',
      status: 'Pending',
      date: isRtl ? nowFa : nowEn,
      description: `Ownership type: ${docs.ownershipType}`,
      url: '',
      fileUrl: docs.representativeLetterFileUrl,
      fileName: docs.representativeLetterFile
    });

    const nextProfile = {
      ...brandInfo,
      officialDocs: docs,
      brandOwnershipType: docs.ownershipType,
      brandVerificationStatus: 'under_evaluation',
      brandPublishStatus: 'private_draft',
      isPendingVerification: true,
      verificationDocs: nextVerificationDocs
    };

    setBrandInfo(nextProfile);
    localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(nextProfile));
    localStorage.setItem('iranbimhub_mfg_profile_m1', JSON.stringify(nextProfile));
    window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));

    toast(isRtl
      ? 'مدارک احراز مالکیت برند برای واحد ارزیابی ارسال شد. صفحه برند تا زمان تأیید عمومی نمی‌شود.'
      : 'Brand ownership documents were submitted to the evaluation team. The brand page remains private until approval.'
    );
  };

  return (
    <div className="rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-l from-[#26B6B6]/10 to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2 text-start">
            <div className="inline-flex items-center gap-2 text-[#26B6B6] text-[11px] font-black">
              <ShieldCheck className="w-4 h-4" />
              <span>{isRtl ? 'احراز مالکیت یا نمایندگی برند' : 'Brand Ownership / Representation Verification'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
              {isRtl ? 'صفحه برند فقط پس از تأیید مدارک رسمی عمومی می‌شود' : 'Public Brand Pages Require Official Document Approval'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl">
              {isRtl
                ? 'برای جلوگیری از ساخت صفحات جعلی، نام برند و محصولات تا زمان بررسی روزنامه رسمی، شناسه ملی یا مدارک مالکیت/نمایندگی توسط واحد ارزیابی به‌صورت عمومی منتشر نمی‌شود.'
                : 'To prevent fake brand pages, brand/product publishing stays private until official gazette, national ID, or ownership/representation documents are reviewed by the evaluation team.'
              }
            </p>
          </div>

          <div className={`rounded-2xl border p-3 text-xs leading-relaxed max-w-sm ${statusMeta.className}`}>
            <div className="flex items-center gap-2 font-black mb-1">
              {statusMeta.icon}
              <span>{statusMeta.label}</span>
            </div>
            <p>{statusMeta.desc}</p>
          </div>
        </div>
      </div>

      {adminEvaluationText && (
        <div className={`rounded-2xl border p-4 text-start ${
          status === 'needs_correction'
            ? 'bg-orange-50 dark:bg-orange-950/25 border-orange-100 dark:border-orange-900 text-orange-900 dark:text-orange-100'
            : status === 'rejected'
            ? 'bg-rose-50 dark:bg-rose-950/25 border-rose-100 dark:border-rose-900 text-rose-900 dark:text-rose-100'
            : status === 'verified'
            ? 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100'
            : 'bg-amber-50 dark:bg-amber-950/25 border-amber-100 dark:border-amber-900 text-amber-900 dark:text-amber-100'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-black">
                {adminEvaluationTitle}
              </h4>
              <p className="text-xs leading-relaxed">
                {adminEvaluationText}
              </p>
              {latestEvaluationMessage?.createdAt && (
                <p className="text-[10px] opacity-70 font-mono pt-1">
                  {new Date(latestEvaluationMessage.createdAt).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="space-y-1.5 text-start">
            <span className="text-[11px] font-black text-gray-500 dark:text-gray-400">{isRtl ? 'نام رسمی شرکت / برند' : 'Official Company / Brand Name'}</span>
            <input
              value={officialDocs.officialCompanyName}
              onChange={(e) => updateOfficialDocs({ officialCompanyName: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
              placeholder={isRtl ? 'مطابق روزنامه رسمی' : 'As written in official documents'}
            />
          </label>

          <label className="space-y-1.5 text-start">
            <span className="text-[11px] font-black text-gray-500 dark:text-gray-400">{isRtl ? 'نقش شما نسبت به برند' : 'Relationship to Brand'}</span>
            <select
              value={officialDocs.ownershipType}
              onChange={(e) => updateOfficialDocs({ ownershipType: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
            >
              <option value="">{isRtl ? 'انتخاب کنید...' : 'Select...'}</option>
              {OWNERSHIP_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>{isRtl ? option.labelFa : option.labelEn}</option>
              ))}
            </select>
            {officialDocs.ownershipType && (
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {isRtl
                  ? OWNERSHIP_OPTIONS.find(item => item.id === officialDocs.ownershipType)?.descFa
                  : OWNERSHIP_OPTIONS.find(item => item.id === officialDocs.ownershipType)?.descEn
                }
              </p>
            )}
          </label>

          <label className="space-y-1.5 text-start">
            <span className="text-[11px] font-black text-gray-500 dark:text-gray-400">{isRtl ? 'شناسه ملی شرکت' : 'Company National ID'}</span>
            <input
              value={officialDocs.nationalId}
              onChange={(e) => updateOfficialDocs({ nationalId: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
              placeholder={isRtl ? 'مثلاً: ۱۰۱۰۱۲۳۴۵۶۷' : 'e.g. 10101234567'}
            />
          </label>

          <label className="space-y-1.5 text-start">
            <span className="text-[11px] font-black text-gray-500 dark:text-gray-400">{isRtl ? 'شماره ثبت شرکت' : 'Registration Number'}</span>
            <input
              value={officialDocs.registrationNumber}
              onChange={(e) => updateOfficialDocs({ registrationNumber: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
              placeholder={isRtl ? 'مثلاً: ۱۲۳۴۵۶' : 'e.g. 123456'}
            />
          </label>

          <label className="space-y-1.5 text-start lg:col-span-2">
            <span className="text-[11px] font-black text-gray-500 dark:text-gray-400">{isRtl ? 'لینک روزنامه رسمی' : 'Official Gazette URL'}</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={officialDocs.officialGazetteUrl}
                onChange={(e) => updateOfficialDocs({ officialGazetteUrl: e.target.value })}
                className="flex-1 text-xs p-3 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                placeholder="https://rrk.ir/..."
                dir="ltr"
              />
              {officialDocs.officialGazetteUrl && (
                <a
                  href={officialDocs.officialGazetteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-[#26B6B6] text-xs font-black inline-flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isRtl ? 'باز کردن' : 'Open'}</span>
                </a>
              )}
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#26B6B6] shrink-0 mt-0.5" />
              <div className="space-y-1 text-start">
                <h4 className="text-xs font-black text-gray-800 dark:text-white">{isRtl ? 'فایل روزنامه رسمی' : 'Official Gazette File'}</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed">{isRtl ? 'PDF یا تصویر خوانا از روزنامه رسمی / آخرین تغییرات.' : 'Readable PDF or image of official gazette / latest amendments.'}</p>
              </div>
            </div>
            <input
              id="brand-official-gazette-file"
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => handleMockFile('officialGazetteFile', e.target.files?.[0])}
            />
            {officialDocs.officialGazetteFile ? (
              <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-gray-950 rounded-xl p-3">
                <span className="text-[11px] font-mono text-gray-700 dark:text-gray-300 truncate">{officialDocs.officialGazetteFile}</span>
                <button
                  type="button"
                  onClick={() => updateOfficialDocs({ officialGazetteFile: '', officialGazetteFileUrl: '' })}
                  className="text-rose-500 text-[10px] font-bold hover:underline"
                >
                  {isRtl ? 'حذف' : 'Remove'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('brand-official-gazette-file')?.click()}
                className="w-full py-3 rounded-xl bg-[#26B6B6]/10 hover:bg-[#26B6B6]/15 text-[#138f8f] dark:text-[#26B6B6] text-xs font-black transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isRtl ? 'بارگذاری فایل روزنامه رسمی' : 'Upload Official Gazette File'}</span>
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#26B6B6] shrink-0 mt-0.5" />
              <div className="space-y-1 text-start">
                <h4 className="text-xs font-black text-gray-800 dark:text-white">{isRtl ? 'مدرک مالکیت یا نمایندگی' : 'Ownership / Representation Proof'}</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed">{isRtl ? 'برای صاحب برند، نماینده رسمی، واردکننده یا توزیع‌کننده ضروری است.' : 'Required for brand owner, representative, importer, or distributor cases.'}</p>
              </div>
            </div>
            <input
              id="brand-representative-letter-file"
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => handleMockFile('representativeLetterFile', e.target.files?.[0])}
            />
            {officialDocs.representativeLetterFile ? (
              <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-gray-950 rounded-xl p-3">
                <span className="text-[11px] font-mono text-gray-700 dark:text-gray-300 truncate">{officialDocs.representativeLetterFile}</span>
                <button
                  type="button"
                  onClick={() => updateOfficialDocs({ representativeLetterFile: '', representativeLetterFileUrl: '' })}
                  className="text-rose-500 text-[10px] font-bold hover:underline"
                >
                  {isRtl ? 'حذف' : 'Remove'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('brand-representative-letter-file')?.click()}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-xs font-black transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isRtl ? 'بارگذاری مدرک مالکیت/نمایندگی' : 'Upload Proof Document'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-start gap-2 text-start">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
              {isRtl
                ? 'مدارک حقوقی فقط برای احراز مالکیت یا نمایندگی برند استفاده می‌شود و به‌صورت عمومی نمایش داده نخواهد شد. ارسال مدارک به معنی انتشار فوری برند نیست.'
                : 'Legal documents are used only for ownership/representation verification and will not be shown publicly. Submitting documents does not mean immediate public publishing.'
              }
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubmitForEvaluation}
            className="px-5 py-3 rounded-xl bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-black transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{isRtl ? 'ارسال مدارک برای ارزیابی' : 'Submit for Evaluation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};