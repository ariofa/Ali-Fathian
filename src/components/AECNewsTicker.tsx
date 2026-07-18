import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { Globe, Radio, Sparkles, Building2, ExternalLink } from 'lucide-react';

interface NewsItem {
  titleFa: string;
  titleEn: string;
  summaryFa: string;
  summaryEn: string;
  source: string;
  url: string;
}

interface ManufacturerItem {
  nameFa: string;
  nameEn: string;
  highlightFa: string;
  highlightEn: string;
}

interface TickerData {
  news: NewsItem[];
  manufacturers: ManufacturerItem[];
}

export const AECNewsTicker: React.FC = () => {
  const { isRtl } = useLanguage();
  const [data, setData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTickerData = async () => {
      try {
        const response = await fetch('/api/ticker');
        if (response.ok) {
          const resData = await response.json();
          if (isMounted) {
            setData(resData);
            setLoading(false);
          }
        } else {
          throw new Error('API failed');
        }
      } catch (err) {
        console.error('Error fetching ticker data:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTickerData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Duplicate items to ensure smooth continuous marquee effect
  const renderMarqueeContent = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-8 py-3 text-xs text-gray-400 dark:text-gray-500 font-light select-none">
          <span className="flex items-center gap-1.5 animate-pulse">
            <Radio className="w-3.5 h-3.5 text-[#26B6B6] animate-spin" />
            {isRtl 
              ? "در حال دریافت خبرنامه‌های زنده کاتالوگ صنعتی از گوگل..." 
              : "Connecting with Google Search grounding live engine..."
            }
          </span>
          <span className="opacity-40">|</span>
          <span className="animate-pulse duration-1000">IFC 4.3 standards...</span>
          <span className="opacity-40">|</span>
          <span className="animate-pulse duration-700">Autodesk Revit update...</span>
        </div>
      );
    }

    if (!data || !data.news || !data.news.length) {
      return (
        <span className="text-xs text-gray-400 p-3">
          {isRtl ? "پروتکل همگام‌سازی موقتا در دسترس نیست" : "Sync protocol temporarily offline"}
        </span>
      );
    }

    // Compose a list of combined items: News followed by Featured Manufacturers
    const newsItems = data.news.map((item, idx) => ({
      id: `news-${idx}`,
      type: 'news',
      text: isRtl ? item.titleFa : item.titleEn,
      subtitle: isRtl ? item.summaryFa : item.summaryEn,
      source: item.source,
      url: item.url,
    }));

    const mfrItems = data.manufacturers.map((item, idx) => ({
      id: `mfr-${idx}`,
      type: 'mfr',
      text: isRtl ? item.nameFa : item.nameEn,
      subtitle: isRtl ? item.highlightFa : item.highlightEn,
      source: isRtl ? "سازنده برگزیده" : "Featured Brand",
      url: "#",
    }));

    const allItems = [...newsItems, ...mfrItems];
    // Double the array for seamless infinite marquee scrolling
    const doubleItems = [...allItems, ...allItems, ...allItems];

    return (
      <div 
        className={`flex items-center gap-8 py-1.5 select-none ${
          isRtl ? 'animate-marquee-rtl' : 'animate-marquee-ltr'
        }`}
        style={{ width: 'max-content' }}
      >
        {doubleItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="flex items-center gap-3 shrink-0 text-xs text-gray-600 dark:text-gray-300 transition-colors hover:text-[#26B6B6]"
          >
            {/* Dot separator */}
            <span className="text-gray-300 dark:text-gray-700 text-base font-bold">•</span>

            {/* Content Segment */}
            <div className="flex items-center gap-2 max-w-lg">
              {item.type === 'news' ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#26B6B6]/10 text-[#26B6B6] uppercase">
                  <Globe className="w-2.5 h-2.5" />
                  <span>{item.source}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase">
                  <Building2 className="w-2.5 h-2.5" />
                  <span>{item.source}</span>
                </span>
              )}

              <div className="flex flex-col text-start">
                <div className="flex items-center gap-1.5 font-bold text-[11px] sm:text-xs">
                  {item.url && item.url !== "#" ? (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline flex items-center gap-0.5"
                    >
                      <span>{item.text}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-50 shrink-0" />
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-light truncate max-w-[280px]">
                  {item.subtitle}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id="aec-news-ticker-strip" className="w-full bg-slate-50 dark:bg-gray-900/50 border-y border-gray-150 dark:border-gray-800/80 overflow-hidden relative z-10">
      
      {/* CSS custom marquee infinite scroll styles */}
      <style>{`
        @keyframes marquee-ltr {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes marquee-rtl {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(33.333%, 0, 0); }
        }
        .animate-marquee-ltr {
          animation: marquee-ltr 50s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 50s linear infinite;
        }
        .marquee-container:hover .animate-marquee-ltr,
        .marquee-container:hover .animate-marquee-rtl {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch">
        
        {/* Anchor Live Indicator Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 bg-[#464E56]/5 dark:bg-white/5 border-b md:border-b-0 md:border-r border-gray-150 dark:border-gray-800 shrink-0 select-none z-20 text-start">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#26B6B6]" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#26B6B6]">
              {isRtl ? 'پایش زنده گوگل' : 'Google Grounded'}
            </span>
          </div>

          <span className="text-[10px] font-light text-gray-400 dark:text-gray-500 hidden sm:inline">
            {isRtl ? '| بهروزرسانی روزانه صنعت' : '| Daily BIM Updates'}
          </span>
        </div>

        {/* Marquee Wrapper with Pause on Hover */}
        <div className="flex-1 overflow-hidden relative marquee-container cursor-grab active:cursor-grabbing px-2 md:px-4">
          {renderMarqueeContent()}
          
          {/* Fading left/right bounds to create professional dynamic transition edge */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-50 dark:from-gray-900/50 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-50 dark:from-gray-900/50 to-transparent pointer-events-none z-10" />
        </div>

      </div>
    </div>
  );
};
