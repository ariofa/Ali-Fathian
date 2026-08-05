import React, { useState } from 'react';
import { BIMObject } from '../types';
import { useLanguage } from './LanguageContext';
import { MANUFACTURERS } from '../data';
import { 
  Download, 
  Heart, 
  Layers, 
  ExternalLink,
  ChevronDown,
  Check
} from 'lucide-react';

interface BIMObjectCardProps {
  object: BIMObject;
  isSaved: boolean;
  onToggleSave: () => void;
  onClick: () => void;
  onQuickDownload: (format: string) => void;
  onViewBrand?: (mfgId: string) => void;
}

export const BIMObjectCard: React.FC<BIMObjectCardProps> = ({
  object,
  isSaved,
  onToggleSave,
  onClick,
  onQuickDownload,
  onViewBrand
}) => {
  const { language, t, isRtl } = useLanguage();
  const [showFormatsDropdown, setShowFormatsDropdown] = useState(false);

  const getDynamicManufacturer = () => {
    const staticMfg = MANUFACTURERS.find(m => m.id === object.manufacturerId);
    try {
      const saved = localStorage.getItem('iranbimhub_mfg_profile');
      if (saved && (object.manufacturerId === 'm1' || object.manufacturerId === 'custom')) {
        const parsed = JSON.parse(saved);
        return {
          ...staticMfg,
          nameFa: parsed.nameFa || staticMfg?.nameFa,
          nameEn: parsed.nameEn || staticMfg?.nameEn,
          verified: parsed.verified !== undefined ? parsed.verified : staticMfg?.verified
        };
      }
    } catch (e) {
      console.error(e);
    }
    return staticMfg;
  };

  const manufacturer = getDynamicManufacturer();
  const isFileAvailable = object.formats.length > 0;
  const canViewBrand = Boolean(onViewBrand && manufacturer && manufacturer.id !== 'initial-library');
  const mName = manufacturer ? (isRtl ? manufacturer.nameFa : manufacturer.nameEn) : '';
  
  const title = isRtl ? object.titleFa : object.titleEn;
  const priceLabel = object.priceType === 'Free' 
    ? t('free') 
    : (object.priceType === 'Paid' ? t('paid') : t('subscriptionOnly'));

  return (
    <div 
      className="group bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden relative"
      id={`obj-card-${object.id}`}
    >
      {/* Visual Header / Preview Area */}
      <div className="relative aspect-4/3 bg-gray-50 overflow-hidden cursor-pointer" onClick={onClick}>
        <img 
          src={object.imageUrl} 
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Shadow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

        {/* Level of Development Indicator LOD */}
        <span className="absolute top-3 start-3 bg-[#464E56]/95 text-white text-[10px] font-mono px-2 py-0.5 rounded font-medium">
          {object.lod}
        </span>

        {/* Quick Save / Bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className={`absolute bottom-3 end-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isSaved 
              ? 'bg-rose-50 text-rose-500 shadow-sm' 
              : 'bg-black/30 text-white hover:bg-black/50'
          }`}
          title={t('favorites')}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Standard country manufacture badge */}
        <span className="absolute bottom-3 start-3 bg-white/90 backdrop-blur-xs text-[9px] text-[#464E56] font-medium px-2 py-0.5 rounded shadow-2xs">
          {object.isImported ? t('originImported') : t('originIran')}
        </span>
      </div>

      {/* Main Metadata Section */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        
        {/* Brand & Title */}
        <div>
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase mb-1">
            <span 
              onClick={(e) => {
                if (canViewBrand && onViewBrand) {
                  e.stopPropagation();
                  onViewBrand(object.manufacturerId);
                }
              }}
              className={`truncate max-w-[160px] ${canViewBrand ? 'hover:text-[#26B6B6] cursor-pointer transition-colors hover:underline' : ''}`}
            >
              {mName}
            </span>
            {manufacturer?.verified && (
              <span className="text-[#26B6B6] text-[9px] bg-[#26B6B6]/5 px-1 py-0.5 rounded shrink-0">
                ✓ {isRtl ? 'تاییدشده' : 'VERIFIED'}
              </span>
            )}
          </div>

          <h3 
            onClick={onClick}
            className="text-xs sm:text-sm font-bold text-gray-800 leading-snug hover:text-[#26B6B6] transition-colors cursor-pointer line-clamp-2 min-h-[32px]"
          >
            {title}
          </h3>
        </div>

        {/* Format Tags & Quick-download Controls */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-2">
          
          {/* Formats list available */}
          <div className="flex flex-wrap gap-1">
            {object.formats.slice(0, 3).map(format => (
              <span 
                key={format} 
                className="text-[8.5px] font-mono text-gray-500 bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded"
              >
                {format}
              </span>
            ))}
            {object.formats.length > 3 && (
              <span className="text-[8.5px] text-gray-400 bg-gray-50 px-1 py-0.5 rounded">
                +{object.formats.length - 3}
              </span>
            )}
          </div>

          {/* Quick Download Button Section */}
          <div className="flex items-center justify-between gap-1.5 relative pt-0.5">
            {object.priceType !== 'Free' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-1.5 py-0.5 rounded shrink-0">{priceLabel}</span>}
            
            {/* Download controls appear only when a publishable file is attached. */}
            <div className="relative">
              {!isFileAvailable ? (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded-md">{isRtl ? 'اطلاعات در حال تکمیل' : 'Information in progress'}</span>
              ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFormatsDropdown(!showFormatsDropdown);
                }}
                onBlur={() => setTimeout(() => setShowFormatsDropdown(false), 200)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[11px] font-bold rounded-md shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>{isRtl ? 'دانلود' : 'DL'}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
              )}

              {/* Formats Dropdown */}
              {isFileAvailable && showFormatsDropdown && (
                <div 
                  className={`absolute bottom-full mb-1 ${isRtl ? 'left-0' : 'right-0'} bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 min-w-[120px] z-20 text-xs`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1 text-[10px] text-gray-400 font-bold border-b border-gray-50 pb-1 mb-1">
                    {isRtl ? 'فرمت فایل' : 'Select Format'}
                  </div>
                  {object.formats.map(format => (
                    <button
                      key={format}
                      onClick={() => {
                        onQuickDownload(format);
                        setShowFormatsDropdown(false);
                      }}
                      className="w-full text-start px-3 py-1.5 hover:bg-gray-50 text-[#464E56] font-mono hover:text-[#26B6B6] transition-colors flex justify-between items-center cursor-pointer"
                    >
                      <span>{format}</span>
                      <Download className="w-3 h-3 text-gray-400 group-hover:text-[#26B6B6]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
