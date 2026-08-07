/**
 * IranBIMhub — Unified, REAL download-history store (قرارداد داده دانلود)
 * ----------------------------------------------------------------------
 * Single source of truth for download history & daily free-download counting,
 * shared by App.tsx (download gate) and ModelerDashboard (history widgets).
 *
 * - Storage key: localStorage['iranbimhub_dl_history']  (array of DownloadEntry)
 * - Daily count: entries whose `date` equals today's fa-IR date string.
 * - Any write dispatches window event DL_HISTORY_EVENT so open dashboards
 *   update their counters live.
 * - One-time migration: adopts the legacy 'iranbimhub_dl_history_v2' payload.
 *
 * Backend note (Reza): replace reads/writes with API calls later; keep the
 * same entry shape. GET /api/downloads, POST /api/downloads, and enforce the
 * DAILY_FREE_LIMIT server-side for free accounts.
 */

export interface DownloadEntry {
  id: string;
  objectId: string;
  titleFa: string;
  titleEn: string;
  format: string;
  fileSize?: string;
  /** fa-IR date string, e.g. "1405/05/16" */
  date: string;
  manufacturerName?: string;
}

export const DAILY_FREE_LIMIT = 5;
export const DL_HISTORY_KEY = 'iranbimhub_dl_history';
export const DL_HISTORY_EVENT = 'iranbimhub_dl_history_updated';

const LEGACY_KEY_V2 = 'iranbimhub_dl_history_v2';

export function getTodayDateString(): string {
  return new Date().toLocaleDateString('fa-IR');
}

export function readDownloadHistory(): DownloadEntry[] {
  try {
    const raw = localStorage.getItem(DL_HISTORY_KEY);
    if (raw) return JSON.parse(raw) as DownloadEntry[];

    // One-time migration from the legacy v2 key (written by older dashboard builds)
    const legacy = localStorage.getItem(LEGACY_KEY_V2);
    if (legacy) {
      const parsed = JSON.parse(legacy) as DownloadEntry[];
      localStorage.setItem(DL_HISTORY_KEY, legacy);
      localStorage.removeItem(LEGACY_KEY_V2);
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function getTodayDownloadCount(): number {
  const today = getTodayDateString();
  return readDownloadHistory().filter(e => e.date === today).length;
}

export function getRemainingDownloads(isPremium: boolean): number {
  if (isPremium) return DAILY_FREE_LIMIT; // premium = effectively unlimited; UI shows full bar
  return Math.max(0, DAILY_FREE_LIMIT - getTodayDownloadCount());
}

export function appendDownloadEntry(entry: Omit<DownloadEntry, 'id' | 'date'> & { id?: string; date?: string }): DownloadEntry[] {
  const history = readDownloadHistory();
  const isDuplicate = history.some(e => e.objectId === entry.objectId && e.format === entry.format && e.date === getTodayDateString());
  if (isDuplicate) return history;

  const full: DownloadEntry = {
    id: entry.id || `dl-${Math.random().toString(36).substring(2, 8)}`,
    date: entry.date || getTodayDateString(),
    objectId: entry.objectId,
    titleFa: entry.titleFa,
    titleEn: entry.titleEn,
    format: entry.format,
    fileSize: entry.fileSize,
    manufacturerName: entry.manufacturerName,
  };
  const next = [full, ...history];
  localStorage.setItem(DL_HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(DL_HISTORY_EVENT));
  return next;
}

/** Subscribe a component to live history changes (other tabs + same tab). */
export function subscribeDownloadHistory(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener(DL_HISTORY_EVENT, handler);
  window.addEventListener('storage', handler);
  window.addEventListener('focus', handler);
  return () => {
    window.removeEventListener(DL_HISTORY_EVENT, handler);
    window.removeEventListener('storage', handler);
    window.removeEventListener('focus', handler);
  };
}
