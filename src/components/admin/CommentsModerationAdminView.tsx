import React, { useCallback, useEffect, useState } from 'react';
import { toast } from '../ui/toast';
import { useLanguage } from '../LanguageContext';
import {
  MessageSquare,
  RefreshCw,
  Check,
  X,
  Trash2,
  Filter,
  CornerDownRight
} from 'lucide-react';

interface AdminComment {
  id: string;
  objectId: string;
  objectTitle?: string;
  parentId: string | null;
  authorName: string;
  authorPhone: string;
  authorRole: string;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

/**
 * Admin view — moderation queue for object-page comments (item 14 back-office).
 *   GET    /api/admin/comments
 *   PATCH  /api/admin/comments/:id  { status: 'approved' | 'rejected' | 'pending' }
 *   DELETE /api/admin/comments/:id  (also removes its replies)
 */
export const CommentsModerationAdminView: React.FC = () => {
  const { isRtl } = useLanguage();
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/comments');
      const data = await res.json().catch(() => ({}));
      if (data?.success) setComments(data.comments || []);
    } catch {
      toast(isRtl ? 'خطا در دریافت دیدگاه‌ها.' : 'Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, [isRtl]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: 'approved' | 'rejected') => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error();
      toast(status === 'approved'
        ? (isRtl ? 'دیدگاه تأیید و منتشر شد.' : 'Comment approved and published.')
        : (isRtl ? 'دیدگاه رد شد.' : 'Comment rejected.'));
      await load();
    } catch {
      toast(isRtl ? 'بروزرسانی با خطا مواجه شد.' : 'Update failed.');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(isRtl ? 'این دیدگاه (و پاسخ‌هایش) برای همیشه حذف شود؟' : 'Permanently delete this comment (and its replies)?')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast(isRtl ? 'دیدگاه حذف شد.' : 'Comment deleted.');
      await load();
    } catch {
      toast(isRtl ? 'حذف با خطا مواجه شد.' : 'Delete failed.');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = comments.filter(c => statusFilter === 'all' ? true : c.status === statusFilter);
  const pendingCount = comments.filter(c => c.status === 'pending').length;
  const faDate = (iso: string) => { try { return `${new Date(iso).toLocaleDateString('fa-IR')} ${new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`; } catch { return ''; } };

  const statusBadge = (s: AdminComment['status']) => s === 'approved'
    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
    : s === 'rejected'
      ? 'bg-rose-50 text-rose-500 border-rose-100'
      : 'bg-amber-50 text-amber-600 border-amber-100';
  const statusLabel = (s: AdminComment['status']) => s === 'approved' ? (isRtl ? 'منتشر شده' : 'Approved') : s === 'rejected' ? (isRtl ? 'رد شده' : 'Rejected') : (isRtl ? 'در انتظار تأیید' : 'Pending');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#26B6B6]" />
            <span>{isRtl ? 'مدیریت دیدگاه‌های آبجکت‌ها' : 'Object Comments Moderation'}</span>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                {pendingCount} {isRtl ? 'در انتظار' : 'pending'}
              </span>
            )}
          </h2>
          <p className="text-[11px] text-gray-400 mt-1">
            {isRtl ? 'دیدگاه‌ها پس از تأیید در این‌جا، به‌صورت عمومی در صفحهٔ آبجکت نمایش داده می‌شوند.' : 'Comments become public on the object page only after approval here.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-2.5 py-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="bg-transparent text-xs focus:outline-none dark:text-white cursor-pointer">
              <option value="pending">{isRtl ? 'در انتظار تأیید' : 'Pending'}</option>
              <option value="approved">{isRtl ? 'منتشر شده' : 'Approved'}</option>
              <option value="rejected">{isRtl ? 'رد شده' : 'Rejected'}</option>
              <option value="all">{isRtl ? 'همه' : 'All'}</option>
            </select>
          </div>
          <button onClick={load} className="p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#26B6B6] text-gray-500 hover:text-[#26B6B6] rounded-xl transition-colors cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-gray-400 text-center py-10">{isRtl ? 'در حال بارگذاری...' : 'Loading…'}</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-10 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          {isRtl ? 'دیدگاهی در این وضعیت وجود ندارد.' : 'No comments in this state.'}
        </p>
      ) : (
        <div className="space-y-3.5">
          {filtered.map(c => (
            <div key={c.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {c.parentId && <CornerDownRight className="w-4 h-4 text-gray-300 shrink-0" />}
                  <div className="w-9 h-9 rounded-full bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center font-black text-xs shrink-0">
                    {c.authorName?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-gray-800 dark:text-white">{c.authorName}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${c.authorRole === 'Manufacturer' ? 'bg-slate-800 text-white' : 'bg-[#26B6B6]/10 text-[#26B6B6]'}`}>
                        {c.authorRole === 'Manufacturer' ? (isRtl ? 'تولیدکننده' : 'Manufacturer') : (isRtl ? 'معمار/متخصص' : 'Architect')}
                      </span>
                      {c.parentId && <span className="text-[9px] text-gray-400">({isRtl ? 'پاسخ' : 'reply'})</span>}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5" dir="ltr">{c.authorPhone} • {faDate(c.createdAt)}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border shrink-0 ${statusBadge(c.status)}`}>{statusLabel(c.status)}</span>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-slate-50/60 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl p-3">{c.text}</p>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  {isRtl ? 'روی آبجکت: ' : 'On object: '}
                  <span className="font-bold text-gray-500 dark:text-gray-300">{(c.objectTitle || '').split('/')[0]?.trim() || c.objectId}</span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                {c.status !== 'approved' && (
                  <button
                    onClick={() => setStatus(c.id, 'approved')}
                    disabled={busyId === c.id}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-[11px] font-black px-4 py-2 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تأیید و انتشار' : 'Approve'}</span>
                  </button>
                )}
                {c.status !== 'rejected' && (
                  <button
                    onClick={() => setStatus(c.id, 'rejected')}
                    disabled={busyId === c.id}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 disabled:opacity-40 text-[11px] font-black px-4 py-2 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'رد کردن' : 'Reject'}</span>
                  </button>
                )}
                <button
                  onClick={() => remove(c.id)}
                  disabled={busyId === c.id}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-500 disabled:opacity-40 text-[11px] font-black px-3.5 py-2 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حذف' : 'Delete'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
