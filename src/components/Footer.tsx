import React from 'react';
import { useLanguage } from './LanguageContext';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { SocialIconsRow } from './SocialLinks';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="bg-slate-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300 mt-16 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Logo & Intro column */}
          <div className="pb-8 sm:pb-0 sm:pe-8 lg:pe-10 space-y-5">
            <div className="flex items-center">
              <Logo className="h-12" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
              {t('brandTagline')}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span>{isRtl ? 'سامانه رسمی ثبت و ارزیابی کاتالوگ' : 'Official AEC Evaluation Hub'}</span>
            </div>
          </div>

          {/* Useful Quick Links */}
          <div className="pt-8 sm:pt-0 sm:ps-8 lg:ps-10 border-t sm:border-t-0 sm:border-s border-gray-200 dark:border-gray-800 pb-8 sm:pb-0">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
              {isRtl ? 'بخش‌های اصلی هاب' : 'Primary Channels'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button id="footer-link-categories" onClick={() => onNavigate('categories')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full font-bold">
                  {isRtl ? 'دسته‌بندی محصولات' : 'Product Categories'}
                </button>
              </li>
              <li>
                <button id="footer-link-about" onClick={() => onNavigate('about')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full font-bold">
                  {isRtl ? 'معرفی ایران‌بیم‌هاب' : 'About IranBIMhub'}
                </button>
              </li>
              <li>
                <button id="footer-link-designers" onClick={() => onNavigate('for-designers')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full font-bold">
                  {isRtl ? 'برای طراحان و مهندسان' : 'For BIM Designers'}
                </button>
              </li>
              <li>
                <button id="footer-link-manufacturers" onClick={() => onNavigate('for-manufacturers')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full font-bold">
                  {isRtl ? 'برای تولیدکنندگان مصالح' : 'For Manufacturers'}
                </button>
              </li>
              <li>
                <button id="footer-link-contact" onClick={() => onNavigate('contact')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full font-bold">
                  {isRtl ? 'ارتباط با ما و پشتیبانی' : 'Contact Support'}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Informational */}
          <div className="pt-8 sm:pt-8 lg:pt-0 sm:pe-8 lg:pe-0 border-t sm:border-t lg:border-t-0 lg:border-s border-gray-200 dark:border-gray-800 pb-8 sm:pb-0">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
              {isRtl ? 'پایگاه دانش و آیین‌نامه‌ها' : 'Knowledge Base & Legal'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button id="footer-link-mfg-directory" onClick={() => onNavigate('manufacturers')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full">
                  {isRtl ? 'دایرکتوری برندهای ساختمان' : 'Physical Brands Directory'}
                </button>
              </li>
              <li>
                <button id="footer-link-scientific-articles" onClick={() => onNavigate('learn')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full">
                  {isRtl ? 'مقالات علمی و آیین‌نامه‌ها' : 'AEC Technical Publications'}
                </button>
              </li>
              <li>
                <button id="footer-link-terms" onClick={() => onNavigate('terms')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full">
                  {isRtl ? 'شرایط استفاده و قوانین پلتفرم' : 'Terms of Service'}
                </button>
              </li>
              <li>
                <button id="footer-link-privacy" onClick={() => onNavigate('privacy')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full">
                  {isRtl ? 'سیاست حفظ حریم خصوصی' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <span className="text-gray-400 dark:text-gray-500 block mt-2 text-start">
                  {isRtl ? 'پشتیبانی فنی: ۲۴ ساعته' : 'Support: 24/7 Technical Desk'}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="pt-8 sm:pt-8 lg:pt-0 sm:ps-8 lg:ps-10 border-t sm:border-t lg:border-t-0 sm:border-s lg:border-s border-gray-200 dark:border-gray-800 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
              {t('contact')}
            </h4>
            <div className="flex items-center gap-2 text-start">
              <Mail className="w-4 h-4 text-[#26B6B6] shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">support@iranbimhub.ir</span>
            </div>
            <div className="flex items-center gap-2 text-start">
              <Phone className="w-4 h-4 text-[#26B6B6] shrink-0" />
              <span className="font-sans text-gray-600 dark:text-gray-300" dir="ltr">+98 (21) 8877-4433</span>
            </div>
            <div className="flex items-start gap-2 leading-normal text-start">
              <MapPin className="w-4 h-4 text-[#26B6B6] shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-300">
                {isRtl 
                  ? 'تهران، پارک فناوری پردیس، مجتمع شکوفایی، واحد ۴۰2' 
                  : 'Suite 402, Shokoufaei Bldg, Pardis Technology Park, Tehran, Iran'}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50 space-y-2">
              <span className="text-[10px] text-gray-400 font-bold block">{isRtl ? 'ما را در شبکه‌های اجتماعی دنبال کنید:' : 'Follow us on social media:'}</span>
              <SocialIconsRow className="flex gap-2" iconClassName="w-4.5 h-4.5" />
            </div>
          </div>

        </div>

        {/* Outer credit line */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 dark:text-gray-500 gap-4">
          <div className="text-gray-500 dark:text-gray-400">
            &copy; 2026 {isRtl ? 'ایران‌بیم‌هاب. تمامی حقوق مادی و معنوی محفوظ است.' : 'IranBIMhub. All Rights Reserved.'}
          </div>
          <div className="flex gap-4">
            <span className="text-gray-400 dark:text-gray-600 font-sans">v1.1.0-AEC</span>
            <span className="text-gray-400 dark:text-gray-600">|</span>
            <span className="text-gray-400 dark:text-gray-600 font-sans">UTC: 2026-06-30</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
