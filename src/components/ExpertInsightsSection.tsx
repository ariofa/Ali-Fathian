import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useSiteConfig } from './SiteConfigContext';

/**
 * EXPERT INSIGHTS — Unified, shared section rendered IDENTICALLY on the
 * homepage (HomeView) and the For-Designers page.
 *
 * Single source of truth: `siteConfig.expertInsights` (admin panel →
 * «نظرات متخصصان»). Only rows with `isPublished` are shown.
 *
 * Until the first REAL, named, approved testimonials are published by the
 * admin, the section shows clearly-unattributed community conversation
 * notes (roles only — no fabricated names or companies).
 */
const COMMUNITY_QUOTES = [
  {
    initial: 'م',
    nameFa: 'معمار ارشد پروژه‌های مسکونی',
    nameEn: 'Senior Residential Architect',
    roleFa: 'از گفت‌وگوهای اولیه با جامعهٔ طراحی',
    roleEn: 'From early conversations with the design community',
    commentFa: 'دغدغهٔ اصلی ما پیداکردن آبجکت‌هایی است که با محصولات واقعیِ قابل تأمین در بازار ایران مطابقت داشته باشند؛ نه مدل‌های خارجی که در اجرا جایگزین ندارند.',
    commentEn: 'Our main concern is finding BIM objects that match real products available in the Iranian market — not foreign models with no local equivalent.'
  },
  {
    initial: 'B',
    nameFa: 'مدیر BIM دفتر مهندسی',
    nameEn: 'BIM Manager at an Engineering Office',
    roleFa: 'از گفت‌وگوهای اولیه با متخصصان BIM',
    roleEn: 'From early conversations with BIM specialists',
    commentFa: 'مدل‌سازی تکراری قطعات از روی کاتالوگ PDF بخش بزرگی از زمان تیم ما را می‌گیرد؛ یک کتابخانهٔ استاندارد و قابل اعتماد این هزینهٔ پنهان را حذف می‌کند.',
    commentEn: 'Repetitive modeling from PDF catalogs consumes a large share of our team time; a reliable standard library removes this hidden cost.'
  }
];

export const ExpertInsightsSection: React.FC = () => {
  const { isRtl } = useLanguage();
  const { siteConfig } = useSiteConfig();
  const publishedInsights = (siteConfig?.expertInsights || []).filter((item) => item.isPublished);

  return (
    <section
      id="expert-insights"
      className="bg-slate-100/50 dark:bg-gray-900/30 border-y border-gray-200/50 dark:border-gray-850 py-16 px-4 sm:px-6 lg:px-8 text-start"
      aria-label={isRtl ? 'نظرات متخصصان' : 'Expert insights'}
    >
      <div className="max-w-7xl mx-auto space-y-10">

        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#26B6B6] uppercase tracking-wider">
            {isRtl ? 'گفت‌وگو با فعالان طراحی و BIM' : 'Conversations with Design & BIM Professionals'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
            {isRtl
              ? 'نظرات و دیدگاه‌های متخصصان حوزه مدل‌سازی اطلاعاتی ساختمان (BIM)'
              : 'Insights from Building Information Modeling (BIM) Professionals'}
          </h2>
        </div>

        {publishedInsights.length > 0 ? (
          /* REAL named, admin-approved testimonials — identical card on both pages */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedInsights.map((insight) => (
              <article key={insight.id} className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-5 text-start shadow-2xs flex flex-col">
                <MessageSquare className="w-5 h-5 text-[#26B6B6] mb-4" />
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-7 flex-1">«{isRtl ? insight.quoteFa : insight.quoteEn}»</p>
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-black text-gray-800 dark:text-white">{isRtl ? insight.nameFa : insight.nameEn}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{isRtl ? insight.roleFa : insight.roleEn}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Honest interim state: unattributed community conversation notes */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {COMMUNITY_QUOTES.map((quote, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed italic">
                    «{isRtl ? quote.commentFa : quote.commentEn}»
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-full bg-[#26B6B6]/10 text-[#26B6B6] font-black text-xs flex items-center justify-center shrink-0">
                    {quote.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-800 dark:text-gray-100">
                      {isRtl ? quote.nameFa : quote.nameEn}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {isRtl ? quote.roleFa : quote.roleEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default ExpertInsightsSection;
