/**
 * IranBIMhub — lightweight registered-users index (نمایه کاربران ثبت‌نامی)
 * -----------------------------------------------------------------------
 * Powers REAL geo analytics in the manufacturer panel: every registration or
 * profile save upserts one record here, and ManufacturerAnalyticsView groups
 * Modeler accounts by province. No fabricated distributions — the chart only
 * shows provinces with real registered users.
 *
 * Backend note (Reza): replace with GET /api/admin/user-geo-stats.
 */

export interface RegisteredUserRecord {
  phone: string;
  name: string;
  role: 'Modeler' | 'Manufacturer' | string;
  provinceId?: string;
  provinceFa?: string;
  cityId?: string;
  cityFa?: string;
  company?: string;
  updatedAt: string;
}

const KEY = 'iranbimhub_users_index';

export function readRegisteredUsers(): RegisteredUserRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RegisteredUserRecord[]) : [];
  } catch {
    return [];
  }
}

export function upsertRegisteredUser(input: Omit<RegisteredUserRecord, 'updatedAt'>) {
  if (!input.phone) return;
  const users = readRegisteredUsers();
  const idx = users.findIndex(u => u.phone === input.phone);
  const record: RegisteredUserRecord = { ...input, updatedAt: new Date().toISOString() };
  if (idx >= 0) users[idx] = { ...users[idx], ...record };
  else users.unshift(record);
  localStorage.setItem(KEY, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent('iranbimhub_users_index_updated'));
}

/** Real per-province distribution of registered professional (Modeler) users. */
export function modelerProvinceDistribution(): { provinceId: string; count: number }[] {
  const bucket = new Map<string, number>();
  readRegisteredUsers()
    .filter(u => u.role === 'Modeler' && u.provinceId)
    .forEach(u => bucket.set(u.provinceId!, (bucket.get(u.provinceId!) || 0) + 1));
  return Array.from(bucket.entries())
    .map(([provinceId, count]) => ({ provinceId, count }))
    .sort((a, b) => b.count - a.count);
}
