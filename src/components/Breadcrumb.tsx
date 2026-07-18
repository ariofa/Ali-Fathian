import React from 'react';
import { useLanguage } from './LanguageContext';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const { isRtl } = useLanguage();

  return (
    <div className={`flex flex-wrap items-center gap-1.5 text-[11px] text-gray-400 font-bold bg-gray-50/50 dark:bg-gray-800/10 px-3.5 py-1.5 rounded-lg border border-gray-150/50 dark:border-gray-800/50 w-fit ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <span className="text-gray-300 dark:text-gray-700 select-none font-normal mx-0.5">
                {isRtl ? '‹' : '›'}
              </span>
            )}
            {item.onClick && !isLast ? (
              <button
                onClick={item.onClick}
                className="hover:text-[#26B6B6] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className={`${isLast ? 'text-gray-600 dark:text-gray-200 font-black' : 'text-gray-400 font-normal'} truncate max-w-[150px] sm:max-w-[250px]`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
