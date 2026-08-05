import React from 'react';
import { useLanguage } from './LanguageContext';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

/** Official 1:1 IranBIMhub mark with localized wordmark. */
export const Logo: React.FC<LogoProps> = ({ className = 'h-11', iconOnly = false }) => {
  const { isRtl } = useLanguage();

  return (
    <div className={`flex items-center gap-3 ${className} select-none`} aria-label="IranBIMhub">
      <span className="relative block h-full aspect-square shrink-0" aria-hidden="true">
        <img src="/brand/iranbimhub-icon-day.png" alt="" className="block h-full w-full object-contain dark:hidden" />
        <img src="/brand/iranbimhub-icon-night.png" alt="" className="hidden h-full w-full object-contain dark:block" />
      </span>

      {!iconOnly && (
        isRtl ? (
          <div className="flex items-center gap-1 text-xl leading-none tracking-tight">
            <span className="font-bold text-[#2B2F33] dark:text-[#F1F5F9]">ایران بیم</span>
            <span className="font-extrabold text-[#0FB9B1] dark:text-[#22D3EE]">هاب</span>
          </div>
        ) : (
          <div className="flex items-center font-sans text-xl leading-none tracking-tight">
            <span className="font-light text-[#2B2F33] dark:text-[#F1F5F9]">Iran</span>
            <span className="font-extrabold text-[#2B2F33] dark:text-[#F1F5F9]">BIM</span>
            <span className="font-bold text-[#0FB9B1] dark:text-[#22D3EE]">hub</span>
          </div>
        )
      )}
    </div>
  );
};
