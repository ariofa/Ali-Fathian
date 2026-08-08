/**
 * IranBIMhub — Personal notification inbox (جعبه اعلان‌های کاربر)
 * --------------------------------------------------------------
 * Per-account inbox stored under localStorage['iranbimhub_inbox_<phone>'].
 * The Header bell reads it on every page (item: notifications moved out of
 * the dashboard sidebar), while the first notification seeds right after
 * mobile registration and points the new Modeler to «پروفایل من».
 *
 * Backend note (Reza): replace with GET/POST /api/notifications later;
 * keep the same shape.
 */

export interface InboxNotification {
  id: string;
  title: string;
  body: string;
  time: string;        // fa-IR date(+time) string
  read: boolean;
  /** Optional modeler-dashboard tab this notification deep-links to */
  targetTab?: string;
}

const KEY_PREFIX = 'iranbimhub_inbox_';
export const INBOX_EVENT = 'iranbimhub_inbox_updated';

const keyFor = (phone: string) => `${KEY_PREFIX}${phone}`;

export function readInbox(phone: string | null | undefined): InboxNotification[] {
  if (!phone) return [];
  try {
    const raw = localStorage.getItem(keyFor(phone));
    return raw ? (JSON.parse(raw) as InboxNotification[]) : [];
  } catch {
    return [];
  }
}

export function unreadCount(phone: string | null | undefined): number {
  return readInbox(phone).filter(n => !n.read).length;
}

function writeInbox(phone: string, items: InboxNotification[]) {
  localStorage.setItem(keyFor(phone), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(INBOX_EVENT, { detail: { phone } }));
}

export function pushNotification(
  phone: string | null | undefined,
  input: { title: string; body: string; targetTab?: string }
): InboxNotification | null {
  if (!phone) return null;
  const note: InboxNotification = {
    id: `ntf-${Math.random().toString(36).substring(2, 9)}`,
    title: input.title,
    body: input.body,
    time: `${new Date().toLocaleDateString('fa-IR')} ${new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`,
    read: false,
    targetTab: input.targetTab
  };
  writeInbox(phone, [note, ...readInbox(phone)]);
  return note;
}

export function markNotificationRead(phone: string | null | undefined, id: string) {
  if (!phone) return;
  writeInbox(phone, readInbox(phone).map(n => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllRead(phone: string | null | undefined) {
  if (!phone) return;
  writeInbox(phone, readInbox(phone).map(n => ({ ...n, read: true })));
}

export function subscribeInbox(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(INBOX_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(INBOX_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/** Item 13 — the very first inbox message after mobile registration,
 *  gently pushing the new Modeler to complete «پروفایل من». */
export function seedProfileCompletionNotification(phone: string, name: string, isRtl = true) {
  const already = readInbox(phone).some(n => n.id.startsWith('ntf-first-'));
  if (already) return;

  const note: InboxNotification = {
    id: `ntf-first-${Math.random().toString(36).substring(2, 7)}`,
    title: isRtl ? 'پروفایل حرفه‌ای‌تان را کامل کنید ✨' : 'Complete your professional profile ✨',
    body: isRtl
      ? `${name || 'کاربر'} عزیز، خوش آمدید! برای دریافت پیشنهادهای دقیق‌تر آبجکت و نمایش حرفه‌ای‌تر به برندها، استان، شهر، تخصص و شرکت‌تان را در «پروفایل من» ثبت کنید.`
      : `Welcome${name ? `, ${name}` : ''}! Add your province, city, discipline and studio in "My Profile" so we can recommend the right BIM objects for you.`,
    time: `${new Date().toLocaleDateString('fa-IR')} ${new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`,
    read: false,
    targetTab: 'profile'
  };
  writeInbox(phone, [note, ...readInbox(phone)]);
}
