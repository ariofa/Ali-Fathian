import React from 'react';
import { useLanguage } from './LanguageContext';
import { useSiteConfig } from './SiteConfigContext';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { SocialIconsRow } from './SocialLinks';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, isRtl } = useLanguage();
  const { siteConfig } = useSiteConfig();

  // Contact rows render ONLY when the admin has actually provided a value
  // in the site config (footer section) — no fabricated fallbacks.
  const footerMail = siteConfig?.footer?.email?.trim() || '';
  const footerPhone = siteConfig?.footer?.phone?.trim() || '';
  const footerAddress = isRtl 
    ? (siteConfig?.footer?.addressFa?.trim() || '')
    : (siteConfig?.footer?.addressEn?.trim() || '');
  // Social row is shown only if at least one primary channel has a URL in config.
  const hasSocials = ['telegram', 'aparat', 'linkedin', 'instagram', 'whatsapp'].some(
    (key) => Boolean((siteConfig?.footer as any)?.[key]?.trim?.())
  );

  return (
    <footer className="bg-slate-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300 mt-10 sm:mt-16 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Logo & Intro column */}
          <div className="pb-6 sm:pb-0 sm:pe-8 lg:pe-10 space-y-5">
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
          <div className="pt-6 sm:pt-0 sm:ps-8 lg:ps-10 border-t sm:border-t-0 sm:border-s border-gray-200 dark:border-gray-800 pb-6 sm:pb-0">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">
              {isRtl ? 'ایران بیم هاب' : 'IranBIMhub'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button id="footer-link-about" onClick={() => onNavigate('about')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full font-bold">
                  {isRtl ? 'درباره ایران‌بیم‌هاب' : 'About IranBIMhub'}
                </button>
              </li>
              <li>
                <button id="footer-link-designers" onClick={() => onNavigate('for-designers')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full font-bold">
                  {isRtl ? 'برای معماران و متخصصان BIM' : 'For architects and BIM specialists'}
                </button>
              </li>
              <li>
                <button id="footer-link-manufacturers" onClick={() => onNavigate('for-manufacturers')} className="hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors cursor-pointer text-start block w-full font-bold">
                  {isRtl ? 'برای تولیدکنندگان' : 'For manufacturers'}
                </button>
              </li>
              <li>
                <button id="footer-link-collaboration" onClick={() => onNavigate('for-bim-modelers')} className="hover:text-[#087F7A] dark:hover:text-[#22D3EE] transition-colors cursor-pointer text-start block w-full font-bold">
                  {isRtl ? 'همکاری با ما' : 'Collaborate with us'}
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
          <div className="pt-6 sm:pt-8 lg:pt-0 sm:pe-8 lg:pe-0 border-t sm:border-t lg:border-t-0 lg:border-s border-gray-200 dark:border-gray-800 pb-6 sm:pb-0">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">
              {isRtl ? 'پایگاه دانش و آیین‌نامه‌ها' : 'Knowledge Base & Legal'}
            </h4>
            <ul className="space-y-2 text-xs">
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
            </ul>
          </div>

          {/* Contact Details */}
          <div className="pt-6 sm:pt-8 lg:pt-0 sm:ps-8 lg:ps-10 border-t sm:border-t lg:border-t-0 sm:border-s lg:border-s border-gray-200 dark:border-gray-800 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">
              {t('contact')}
            </h4>
            {footerMail && (
              <a href={`mailto:${footerMail}`} className="flex items-center gap-2 text-start hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors">
                <Mail className="w-4 h-4 text-[#26B6B6] shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{footerMail}</span>
              </a>
            )}
            {footerPhone && (
              <a href={`tel:${footerPhone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 text-start hover:text-[#26B6B6] dark:hover:text-[#26B6B6] transition-colors">
                <Phone className="w-4 h-4 text-[#26B6B6] shrink-0" />
                <span className="font-sans text-gray-600 dark:text-gray-300" dir="ltr">{footerPhone}</span>
              </a>
            )}
            {footerAddress && (
              <div className="flex items-start gap-2 leading-normal text-start">
                <MapPin className="w-4 h-4 text-[#26B6B6] shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  {footerAddress}
                </span>
              </div>
            )}
            {hasSocials && (
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold block">{isRtl ? 'ما را در شبکه‌های اجتماعی دنبال کنید:' : 'Follow us on social media:'}</span>
                <SocialIconsRow className="flex gap-2" iconClassName="w-4.5 h-4.5" />
              </div>
            )}
          </div>

        </div>

        {/* Outer credit line */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 dark:text-gray-500 gap-4">
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
