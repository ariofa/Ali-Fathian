import React from 'react';
import { useLanguage } from './LanguageContext';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-11', iconOnly = false }) => {
  const { isRtl } = useLanguage();

  return (
    <div className={`flex items-center gap-3 ${className} select-none`}>
      {/* 3D Isometric Geometric Block Icon with precise wireframe styles */}
      <svg
        className="h-full aspect-[11/10]"
        viewBox="0 0 110 106"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* UPPER LEFT C-FRAME - TEAL WIREFRAME */}
        {/* Back and side connection faces */}
        <polygon
          points="65,45 85,34 85,46 65,57"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="65,22 85,34 65,45 45,34"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Top/Front faces of bracket */}
        <polygon
          points="45,11 65,22 45,34 25,22"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="15,28 25,22 25,34 15,40"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="15,40 25,34 25,46 15,52"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="25,22 45,34 45,46 25,34"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="15,28 35,39 35,63 15,51"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="15,51 35,63 35,75 15,63"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="45,34 65,45 65,57 45,46"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* FLOATING INNER CUBE - TEAL WIREFRAME */}
        <polygon
          points="55,42 70,50 55,59 40,50"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="40,50 55,59 55,74 40,65"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="55,59 70,50 70,65 55,74"
          className="fill-white dark:fill-gray-950 transition-colors"
          stroke="#26B6B6"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* BOTTOM ACCENT BLOCK - SLATE WIREFRAME */}
        <polygon
          points="55,68 75,80 55,91 35,80"
          className="fill-white dark:fill-gray-950 stroke-[#464E56] dark:stroke-slate-300 transition-colors"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="35,80 55,91 55,103 35,92"
          className="fill-white dark:fill-gray-950 stroke-[#464E56] dark:stroke-slate-300 transition-colors"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points="55,91 75,80 75,92 55,103"
          className="fill-white dark:fill-gray-950 stroke-[#464E56] dark:stroke-slate-300 transition-colors"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {!iconOnly && (
        <div className="flex tracking-tight text-xl leading-none items-center">
          {isRtl ? (
            <div className="flex items-center gap-1 font-bold">
              <span className="text-[#464E56] dark:text-gray-100 transition-colors">ایران بیم</span>
              <span className="font-extrabold text-[#26B6B6]">هاب</span>
            </div>
          ) : (
            <div className="flex items-center font-sans">
              <span className="font-light text-[#464E56] dark:text-gray-300 transition-colors">Iran</span>
              <span className="font-extrabold text-[#464E56] dark:text-gray-100 transition-colors">BIM</span>
              <span className="font-bold text-[#26B6B6]">hub</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
