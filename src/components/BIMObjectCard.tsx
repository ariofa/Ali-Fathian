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

  const manufacturer = MANUFACTURERS.find(m => m.id === object.manufacturerId);
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
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        {/* Brand & Title */}
        <div>
          <div className="flex justify-between items-center text-[11px] text-gray-400 font-bold uppercase mb-1">
            <span 
              onClick={(e) => {
                if (onViewBrand) {
                  e.stopPropagation();
                  onViewBrand(object.manufacturerId);
                }
              }}
              className={onViewBrand ? 'hover:text-[#26B6B6] cursor-pointer transition-colors hover:underline' : ''}
            >
              {mName}
            </span>
            {manufacturer?.verified && (
              <span className="text-[#26B6B6] text-[10px] bg-[#26B6B6]/5 px-1 py-0.5 rounded">
                ✓ {isRtl ? 'تاییدشده' : 'VERIFIED'}
              </span>
            )}
          </div>

          <h3 
            onClick={onClick}
            className="text-sm font-bold text-gray-800 leading-snug hover:text-[#26B6B6] transition-colors cursor-pointer line-clamp-2"
          >
            {title}
          </h3>
        </div>

        {/* Format Tags & Quick-download Controls */}
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
          
          {/* Formats list available */}
          <div className="flex flex-wrap gap-1">
            {object.formats.slice(0, 4).map(format => (
              <span 
                key={format} 
                className="text-[9px] font-mono text-gray-500 bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded"
              >
                {format}
              </span>
            ))}
            {object.formats.length > 4 && (
              <span className="text-[9px] text-gray-400 bg-gray-50 px-1 py-0.5 rounded">
                +{object.formats.length - 4}
              </span>
            )}
          </div>

          {/* Quick Download Button Section */}
          <div className="flex items-center justify-end gap-2 relative">
            
            {/* Quick One-Click Download triggers */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFormatsDropdown(!showFormatsDropdown);
                }}
                onBlur={() => setTimeout(() => setShowFormatsDropdown(false), 200)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold rounded-md shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isRtl ? 'دانلود سریع' : 'Quick DL'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Formats Dropdown */}
              {showFormatsDropdown && (
                <div 
                  className={`absolute bottom-full mb-1 ${isRtl ? 'left-0' : 'right-0'} bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 min-w-[120px] z-20 text-xs`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1 text-[10px] text-gray-400 font-bold border-b border-gray-50 pb-1 mb-1">
                    {isRtl ? 'فرمت فایل را انتخاب کنید' : 'Select Format'}
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
