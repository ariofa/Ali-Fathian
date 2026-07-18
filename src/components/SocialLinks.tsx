import React from 'react';

// Platform interfaces
export interface SocialPlatform {
  id: string;
  nameFa: string;
  nameEn: string;
  url: string;
  icon: (className?: string) => React.ReactNode;
}

// Icons SVGs as clean components
export const TelegramIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.578.192l-8.533 7.701-.332 4.966c.487 0 .702-.223.974-.485l2.337-2.27 4.861 3.591c.896.494 1.54.239 1.763-.833l3.185-15.001c.326-1.307-.5-1.902-1.355-1.51l.002-.002z" />
  </svg>
);

export const AparatIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.002 2C6.479 2 2 6.477 2 12s4.479 10 10.002 10c5.521 0 9.998-4.477 9.998-10s-4.477-10-9.998-10zm0 14.286c-2.363 0-4.288-1.923-4.288-4.286s1.925-4.286 4.288-4.286c2.361 0 4.284 1.923 4.284 4.286s-1.923 4.286-4.284 4.286z" />
    <circle cx="12" cy="12" r="2.2" />
    <circle cx="12" cy="6.2" r="1.3" />
    <circle cx="12" cy="17.8" r="1.3" />
    <circle cx="6.2" cy="12" r="1.3" />
    <circle cx="17.8" cy="12" r="1.3" />
  </svg>
);

export const LinkedInIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const InstagramIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

export const WhatsAppIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 2.738 1.47 4.795 1.471 5.485 0 9.95-4.461 9.953-9.94a9.913 9.913 0 0 0-2.912-7.03 9.92 9.92 0 0 0-7.052-2.915c-5.49 0-9.96 4.463-9.964 9.943-.001 1.943.499 3.41 1.396 4.957l-.997 3.641 3.774-.987zm11.531-4.99c-.29-.145-1.713-.846-1.978-.941-.265-.096-.458-.145-.65.145-.192.29-.745.941-.913 1.135-.168.192-.337.216-.627.072-2.585-1.293-3.13-1.871-4.71-4.6-.29-.499.29-.463.83-1.543.115-.223.058-.417-.029-.562-.087-.145-.65-1.566-.89-2.144-.233-.563-.47-.486-.65-.496l-.553-.01c-.192 0-.505.072-.77.361-.264.29-1.01 1.01-1.01 2.458 0 1.445 1.052 2.842 1.2 3.035.144.193 2.07 3.161 5.016 4.437.702.304 1.25.486 1.677.621.705.224 1.346.193 1.854.117.566-.084 1.714-.7 1.954-1.374.24-.675.24-1.253.168-1.374-.072-.12-.29-.193-.58-.338z" />
  </svg>
);

export const BaleIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.886.524 3.65 1.436 5.16L2.1 21.9l4.88-.98A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-1 14h-2v-2h2v2zm4-4H9V9h6v3z" />
  </svg>
);

export const YouTubeIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const XIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// The primary 5 platforms (Telegram, Aparat, LinkedIn, Instagram, WhatsApp)
export const PRIMARY_SOCIALS: SocialPlatform[] = [
  {
    id: 'telegram',
    nameFa: 'تلگرام',
    nameEn: 'Telegram',
    url: 'https://t.me/iranbimhub',
    icon: (cls) => TelegramIcon(cls),
  },
  {
    id: 'aparat',
    nameFa: 'آپارات',
    nameEn: 'Aparat',
    url: 'https://aparat.com/iranbimhub',
    icon: (cls) => AparatIcon(cls),
  },
  {
    id: 'linkedin',
    nameFa: 'لینکدین',
    nameEn: 'LinkedIn',
    url: 'https://linkedin.com/company/iranbimhub',
    icon: (cls) => LinkedInIcon(cls),
  },
  {
    id: 'instagram',
    nameFa: 'اینستاگرام',
    nameEn: 'Instagram',
    url: 'https://instagram.com/iranbimhub',
    icon: (cls) => InstagramIcon(cls),
  },
  {
    id: 'whatsapp',
    nameFa: 'واتساپ (پشتیبانی)',
    nameEn: 'WhatsApp (Support)',
    url: 'https://wa.me/982188887767',
    icon: (cls) => WhatsAppIcon(cls),
  },
];

// Secondary platforms
export const SECONDARY_SOCIALS: SocialPlatform[] = [
  {
    id: 'bale',
    nameFa: 'بله',
    nameEn: 'Bale',
    url: 'https://ble.ir/iranbimhub',
    icon: (cls) => BaleIcon(cls),
  },
  {
    id: 'youtube',
    nameFa: 'یوتیوب',
    nameEn: 'YouTube',
    url: 'https://youtube.com/@iranbimhub',
    icon: (cls) => YouTubeIcon(cls),
  },
  {
    id: 'x',
    nameFa: 'توییتر / X',
    nameEn: 'X (Twitter)',
    url: 'https://x.com/iranbimhub',
    icon: (cls) => XIcon(cls),
  },
];

// Helper Row of Primary Icons
interface SocialIconsRowProps {
  className?: string;
  iconClassName?: string;
  isDarkBg?: boolean;
}

export const SocialIconsRow: React.FC<SocialIconsRowProps> = ({
  className = 'flex gap-3',
  iconClassName = 'w-5 h-5',
  isDarkBg = false,
}) => {
  return (
    <div className={className} dir="ltr">
      {PRIMARY_SOCIALS.map((p) => {
        // Aesthetic color palette matching branding
        let colorClasses = '';
        if (isDarkBg) {
          colorClasses = 'text-gray-300 hover:text-[#26B6B6] hover:bg-white/5';
        } else {
          colorClasses = 'text-gray-500 hover:text-[#26B6B6] hover:bg-[#26B6B6]/5 dark:text-gray-400 dark:hover:text-[#26B6B6] dark:hover:bg-white/5';
        }

        // WhatsApp direct contact hover color check
        if (p.id === 'whatsapp') {
          colorClasses = isDarkBg 
            ? 'text-gray-300 hover:text-emerald-400 hover:bg-white/5' 
            : 'text-gray-500 hover:text-emerald-500 hover:bg-emerald-500/5 dark:text-gray-400 dark:hover:text-emerald-400 dark:hover:bg-white/5';
        }

        return (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            title={p.nameFa}
            className={`p-2 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center ${colorClasses}`}
          >
            {p.icon(iconClassName)}
          </a>
        );
      })}
    </div>
  );
};

// STAY CONNECTED Block
interface StayConnectedProps {
  isRtl?: boolean;
}

export const StayConnectedBlock: React.FC<StayConnectedProps> = ({ isRtl = true }) => {
  return (
    <div className="bg-slate-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-start">
      <div className="space-y-1.5 flex-1 w-full">
        <h3 className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-white">
          {isRtl ? 'با ما در ارتباط باشید' : 'Stay Connected'}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed font-light">
          {isRtl
            ? 'با دنبال کردن شبکه‌های اجتماعی رسمی ایران‌بیم‌هاب، از آخرین اخبار پلتفرم، وبینارهای آموزشی و انتشار کاتالوگ‌های جدید مطلع شوید.'
            : 'Follow IranBIMhub’s official channels to receive real-time updates, BIM webinars, and brand catalog listings.'}
        </p>
      </div>
      <div className="shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
        <SocialIconsRow className="flex gap-3 bg-white dark:bg-gray-950 p-2 rounded-2xl border border-gray-100 dark:border-gray-850" />
      </div>
    </div>
  );
};
