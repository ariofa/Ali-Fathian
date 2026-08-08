/**
 * IranBIMhub EmptyState (Phase 2 – UX)
 * ------------------------------------
 * Unified honest-empty-state block. Instead of fake/seeded content we show a
 * clear, friendly explanation plus (optionally) one helpful next action.
 * Uses the approved semantic tokens from src/index.css (brand-accent, ui-*).
 *
 * Usage:
 *   <EmptyState
 *     icon={Download}
 *     title={isRtl ? 'هنوز فایلی دانلود نکرده‌اید' : 'No downloads yet'}
 *     description={...}            // optional guidance sentence
 *     actionLabel={...}            // optional CTA
 *     onAction={...}               // optional CTA handler
 *   />
 */
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Smaller padding for inline sections (default: false = roomy card) */
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) => {
  return (
    <div
      className={`bg-ui-surface rounded-2xl border border-dashed border-ui-border-strong/60 text-center ${
        compact ? 'p-6 sm:p-8' : 'p-10 sm:p-14'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm mx-auto space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-accent" />
        </div>
        <h3 className="text-sm sm:text-[15px] font-extrabold text-ui-text-primary leading-7">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-[12.5px] text-ui-text-muted leading-6 font-normal">
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-1.5 px-5 py-2.5 rounded-xl bg-[#087F7A] hover:bg-[#064E4B] text-white text-xs font-extrabold transition-all shadow-xs hover:shadow-md active:scale-97 cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
