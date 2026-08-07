/**
 * IranBIMhub Toast Notification System (Phase 2 – UX)
 * ----------------------------------------------------
 * Replaces every native `alert()` call with a non-blocking, on-brand toast.
 *
 * Usage (drop-in replacement for alert):
 *   import { toast } from './ui/toast';      // adjust relative path
 *   toast('پیام');                            // tone auto-inferred from keywords
 *   toast('پیام', 'success');                 // explicit tone override
 *   toast.success('پیام') / toast.error(...) / toast.warning(...) / toast.info(...)
 *
 * Tone auto-inference (only when caller does not specify a tone):
 *   error   ← contains: خطا، نامعتبر، invalid, error, failed, متأسف
 *   success ← contains: موفق، با موفقیت، success, ثبت شد، ذخیره شد، ارسال شد، منتشر شد، انجام شد، خوش آمد
 *   warning ← contains: لطفاً، لطفا، please، ابتدا، حداکثر، سقف، توجه، warning، محدودیت
 *   info    ← everything else (default)
 * Backend note (Reza): keep calling `toast(message)` after wiring the real API;
 * only the message strings need to come from server/localization.
 */
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, XOctagon, Info, X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export type ToastTone = 'info' | 'success' | 'error' | 'warning';

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const MAX_VISIBLE = 4;
const DEFAULT_DURATION = 4500;
const ERROR_DURATION = 6500;

/* ------------------------------------------------------------------ */
/* Keyword-based tone inference (documented for future maintainers)    */
/* ------------------------------------------------------------------ */
const ERROR_HINTS = ['خطا', 'نامعتبر', 'متأسف', 'invalid', 'error', 'failed', 'failure'];
const SUCCESS_HINTS = ['موفق', 'با موفقیت', 'ثبت شد', 'ذخیره شد', 'ارسال شد', 'منتشر شد', 'انجام شد', 'خوش آمد', 'success'];
const WARNING_HINTS = ['لطفاً', 'لطفا', 'ابتدا', 'حداکثر', 'سقف', 'توجه', 'محدودیت', 'please', 'warning'];

export function inferToastTone(message: string): ToastTone {
  const m = message.toLowerCase();
  if (ERROR_HINTS.some(h => m.includes(h))) return 'error';
  if (SUCCESS_HINTS.some(h => m.includes(h))) return 'success';
  if (WARNING_HINTS.some(h => m.includes(h))) return 'warning';
  return 'info';
}

/* ------------------------------------------------------------------ */
/* Module-level event bus so `toast()` works outside React components */
/* ------------------------------------------------------------------ */
type ToastListener = (message: string, tone: ToastTone) => void;
const listeners = new Set<ToastListener>();
let lastMsg = '';
let lastAt = 0;

function emitToast(message: string, tone?: ToastTone) {
  if (typeof message !== 'string' || message.trim() === '') return;
  // Suppress rapid duplicate firings of the exact same message (e.g. double handlers)
  const now = Date.now();
  if (message === lastMsg && now - lastAt < 900) return;
  lastMsg = message;
  lastAt = now;
  const finalTone = tone ?? inferToastTone(message);
  listeners.forEach(fn => fn(message, finalTone));
}

/** Drop-in replacement for window.alert — non-blocking, brand-styled. */
export const toast = Object.assign(
  (message: string, tone?: ToastTone) => emitToast(message, tone),
  {
    info: (message: string) => emitToast(message, 'info'),
    success: (message: string) => emitToast(message, 'success'),
    error: (message: string) => emitToast(message, 'error'),
    warning: (message: string) => emitToast(message, 'warning'),
  }
);

/* ------------------------------------------------------------------ */
/* React context (for components that prefer hooks)                    */
/* ------------------------------------------------------------------ */
const ToastContext = createContext<{ notify: typeof toast }>({ notify: toast });
export const useToast = () => useContext(ToastContext);

/* ------------------------------------------------------------------ */
/* Visual config per tone – uses the approved semantic state tokens   */
/* defined in src/index.css (--color-state-*).                         */
/* ------------------------------------------------------------------ */
const TONE_STYLES: Record<ToastTone, { icon: React.ReactNode; ring: string; iconTint: string; bar: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    ring: 'border-state-success/35',
    iconTint: 'text-state-success',
    bar: 'bg-state-success',
  },
  error: {
    icon: <XOctagon className="w-5 h-5 shrink-0" />,
    ring: 'border-state-error/35',
    iconTint: 'text-state-error',
    bar: 'bg-state-error',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
    ring: 'border-state-warning/40',
    iconTint: 'text-state-warning',
    bar: 'bg-state-warning',
  },
  info: {
    icon: <Info className="w-5 h-5 shrink-0" />,
    ring: 'border-state-info/35',
    iconTint: 'text-state-info',
    bar: 'bg-state-info',
  },
};

/* ------------------------------------------------------------------ */
/* Provider + viewport                                                 */
/* ------------------------------------------------------------------ */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const { isRtl } = useLanguage();

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler: ToastListener = (message, tone) => {
      const id = ++idRef.current;
      setToasts(prev => [...prev.slice(-(MAX_VISIBLE - 1)), { id, message, tone }]);
      const ttl = tone === 'error' ? ERROR_DURATION : DEFAULT_DURATION;
      window.setTimeout(() => dismiss(id), ttl);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ notify: toast }}>
      {children}

      {/* Viewport: bottom-center; clears the mobile bottom-nav (h-16) via bottom-20 */}
      <div
        className="pointer-events-none fixed bottom-20 md:bottom-6 inset-x-0 z-[9999] flex flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map(t => {
            const s = TONE_STYLES[t.tone];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                dir={isRtl ? 'rtl' : 'ltr'}
                className={`pointer-events-auto relative w-full max-w-md overflow-hidden rounded-xl border bg-ui-surface shadow-xl shadow-black/10 dark:shadow-black/40 ${s.ring}`}
              >
                <div className="flex items-start gap-3 px-4 py-3">
                  <span className={`mt-px ${s.iconTint}`}>{s.icon}</span>
                  <p className="flex-1 text-xs sm:text-[13px] font-semibold leading-6 text-ui-text-primary whitespace-pre-line">
                    {t.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    className="shrink-0 rounded-md p-1 text-ui-text-muted hover:text-ui-text-primary hover:bg-ui-border/40 transition-colors cursor-pointer"
                    aria-label={isRtl ? 'بستن اعلان' : 'Dismiss notification'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* subtle tone indicator bar */}
                <div className={`absolute bottom-0 inset-x-0 h-[2.5px] opacity-70 ${s.bar}`} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
