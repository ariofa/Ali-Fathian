import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Eye, FileCheck2, ShieldCheck, UploadCloud } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface BrandPublicationStatusBannerProps {
  brandInfo: any;
  onGoToProfile?: () => void;
  onPreviewBrand?: () => void;
}

const getStatusMeta = (status: string, isRtl: boolean) => {
  switch (status) {
    case 'verified':
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        title: isRtl ? 'برند شما تأیید شده است' : 'Your brand is verified',
        desc: isRtl
          ? 'امکان انتشار عمومی صفحه برند فعال است. فایل‌های BIM همچنان باید پس از پرداخت هزینه ارزیابی، توسط تیم ارزیاب تأیید شوند.'
          : 'Public brand publishing is enabled. BIM files still require evaluation fee payment and approval by the evaluation team.',
        className: 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100',
        cta: isRtl ? 'پیش‌نمایش صفحه برند' : 'Preview Brand Page'
      };
    case 'under_evaluation':
      return {
        icon: <Clock className="w-5 h-5 text-amber-500" />,
        title: isRtl ? 'مدارک برند در حال ارزیابی است' : 'Brand documents are under evaluation',
        desc: isRtl
          ? 'تا زمان تأیید واحد ارزیابی، صفحه برند فقط برای شما و ادمین‌های سایت قابل مشاهده است و برای کاربران عمومی منتشر نمی‌شود.'
          : 'Until evaluation team approval, the brand page is visible only to you and site admins, not to the public.',
        className: 'bg-amber-50 dark:bg-amber-950/25 border-amber-100 dark:border-amber-900 text-amber-900 dark:text-amber-100',
        cta: isRtl ? 'مشاهده پیش‌نمایش خصوصی' : 'View Private Preview'
      };
    case 'needs_correction':
      return {
        icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
        title: isRtl ? 'مدارک برند نیازمند اصلاح است' : 'Brand documents need correction',
        desc: isRtl
          ? 'پیام واحد ارزیابی را در بخش احراز مالکیت برند بررسی کنید و مدارک را اصلاح و دوباره ارسال کنید.'
          : 'Check the evaluation team message in brand ownership verification, correct the documents, and resubmit.',
        className: 'bg-orange-50 dark:bg-orange-950/25 border-orange-100 dark:border-orange-900 text-orange-900 dark:text-orange-100',
        cta: isRtl ? 'اصلاح مدارک برند' : 'Correct Documents'
      };
    case 'rejected':
      return {
        icon: <AlertCircle className="w-5 h-5 text-rose-500" />,
        title: isRtl ? 'احراز برند تأیید نشد' : 'Brand verification was rejected',
        desc: isRtl
          ? 'صفحه برند عمومی نمی‌شود. توضیح واحد ارزیابی را بررسی کنید یا از مسیر پشتیبانی پیگیری کنید.'
          : 'The brand page will not be public. Review the evaluation note or follow up through support.',
        className: 'bg-rose-50 dark:bg-rose-950/25 border-rose-100 dark:border-rose-900 text-rose-900 dark:text-rose-100',
        cta: isRtl ? 'بررسی پیام ارزیابی' : 'Review Evaluation Note'
      };
    default:
      return {
        icon: <ShieldCheck className="w-5 h-5 text-[#26B6B6]" />,
        title: isRtl ? 'صفحه برند شما هنوز عمومی نشده است' : 'Your brand page is not public yet',
        desc: isRtl
          ? 'ما از اصالت برند شما محافظت می‌کنیم. برای انتشار عمومی صفحه برند و محصولات، ابتدا مدارک رسمی شرکت یا نمایندگی را تکمیل و برای واحد ارزیابی ارسال کنید.'
          : 'We protect your brand authenticity. To publish your brand and products publicly, first complete official company or representation documents for evaluation.',
        className: 'bg-[#26B6B6]/5 border-[#26B6B6]/15 text-gray-800 dark:text-gray-100',
        cta: isRtl ? 'تکمیل مدارک برند' : 'Complete Brand Documents'
      };
  }
};

export const BrandPublicationStatusBanner: React.FC<BrandPublicationStatusBannerProps> = ({
  brandInfo,
  onGoToProfile,
  onPreviewBrand
}) => {
  const { isRtl } = useLanguage();
  const status = brandInfo?.brandVerificationStatus || 'not_started';
  const isVerified = status === 'verified' || brandInfo?.brandPublishStatus === 'public';
  const meta = getStatusMeta(status, isRtl);

  return (
    <div className={`rounded-[1.75rem] border p-4 sm:p-5 ${meta.className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-start">
          <div className="w-11 h-11 rounded-2xl bg-white/70 dark:bg-gray-950/50 flex items-center justify-center shrink-0">
            {meta.icon}
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-black">{meta.title}</h3>
            <p className="text-xs leading-relaxed opacity-90 max-w-4xl">{meta.desc}</p>
            {!isVerified && (
              <p className="text-[10.5px] leading-relaxed opacity-80">
                {isRtl
                  ? 'می‌توانید محصولات و فایل‌های BIM را به‌صورت پیش‌نویس آماده کنید؛ اما انتشار عمومی پس از تأیید برند و ارزیابی فایل انجام می‌شود.'
                  : 'You can prepare products and BIM files as drafts; public publishing happens after brand verification and file evaluation.'
                }
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={isVerified ? onPreviewBrand : onGoToProfile}
            className="px-4 py-2.5 rounded-xl bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-black transition-all flex items-center justify-center gap-2"
          >
            {isVerified ? <Eye className="w-4 h-4" /> : <FileCheck2 className="w-4 h-4" />}
            <span>{meta.cta}</span>
          </button>
          {!isVerified && onPreviewBrand && (
            <button
              type="button"
              onClick={onPreviewBrand}
              className="px-4 py-2.5 rounded-xl bg-white/70 dark:bg-gray-950/50 border border-white/50 dark:border-gray-800 text-xs font-black transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>{isRtl ? 'پیش‌نمایش خصوصی' : 'Private Preview'}</span>
            </button>
          )}
        </div>
      </div>

      {!isVerified && (
        <div className="mt-4 pt-4 border-t border-current/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10.5px] font-bold">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-[#26B6B6]" />
            <span>{isRtl ? 'آپلود پیش‌نویس مجاز است' : 'Draft upload allowed'}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#26B6B6]" />
            <span>{isRtl ? 'نمایش عمومی قفل است' : 'Public view locked'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#26B6B6]" />
            <span>{isRtl ? 'انتشار پس از ارزیابی فایل' : 'Publish after file evaluation'}</span>
          </div>
        </div>
      )}
    </div>
  );
};