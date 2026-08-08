import React, { useCallback, useEffect, useState } from 'react';
import { toast } from '../ui/toast';
import { useLanguage } from '../LanguageContext';
import {
  PackagePlus,
  RefreshCw,
  ExternalLink,
  Phone,
  User,
  Calendar,
  Filter,
  Save
} from 'lucide-react';
import { OBJECT_REQUEST_STATUS, ObjectRequestItem, DISCIPLINE_OPTIONS } from '../dashboard/ObjectRequestForm';
import { PRODUCT_CATEGORIES } from '../../lib/catalog';

/**
 * Admin view — «درخواست‌های آبجکت معماران» (item 20 back-office queue)
 * Reads/writes the same store as the modeler panel:
 *   GET   /api/admin/object-requests
 *   PATCH /api/admin/object-requests/:id  { status, adminNote }
 */
export const ObjectRequestsAdminView: React.FC = () => {
  const { isRtl } = useLanguage();
  const [requests, setRequests] = useState<ObjectRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [draftStatus, setDraftStatus] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/object-requests');
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setRequests(data.requests || []);
        const notes: Record<string, string> = {};
        const statuses: Record<string, string> = {};
        (data.requests || []).forEach((r: ObjectRequestItem) => {
          notes[r.id] = r.adminNote || '';
          statuses[r.id] = r.status;
        });
        setDraftNotes(notes);
        setDraftStatus(statuses);
      }
    } catch {
      toast(isRtl ? 'خطا در دریافت درخواست‌ها.' : 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  }, [isRtl]);

  useEffect(() => { load(); }, [load]);

  const save = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/object-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: draftStatus[id], adminNote: draftNotes[id] || '' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) throw new Error();
      toast(isRtl ? 'وضعیت درخواست بروزرسانی شد؛ درخواست‌کننده آن را در پنل خود می‌بیند.' : 'Request updated; the architect sees it in their panel.');
      await load();
    } catch {
      toast(isRtl ? 'بروزرسانی با خطا مواجه شد.' : 'Update failed.');
    } finally {
      setSavingId(null);
    }
  };

  const filtered = statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter);
  const faDate = (iso: string) => { try { return new Date(iso).toLocaleDateString('fa-IR'); } catch { return ''; } };
  // Requests are stored with approved-taxonomy category ids; an id outside the
  // current taxonomy falls back to the raw id only if nothing better exists.
  const categoryName = (id?: string) => {
    if (!id) return '';
    const category = PRODUCT_CATEGORIES.find(c => c.id === id);
    return category ? (isRtl ? category.label.fa : category.label.en) : id;
  };
  const disciplineName = (id?: string) => {
    const d = DISCIPLINE_OPTIONS.find(x => x.id === id);
    return d ? (isRtl ? d.fa : d.en) : (id || '');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-[#26B6B6]" />
            <span>{isRtl ? 'درخواست‌های آبجکت معماران' : 'Architect Object Requests'}</span>
          </h2>
          <p className="text-[11px] text-gray-400 mt-1">
            {isRtl ? 'درخواست‌های ثبت‌شده از پنل معماران؛ پس از تماس با برند، وضعیت را بروزرسانی کنید تا کاربر آن را در پنل خود ببیند.' : 'Requests submitted from the modeler panel; update status after contacting the brand so the architect sees the progress.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-2.5 py-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-xs focus:outline-none dark:text-white cursor-pointer">
              <option value="all">{isRtl ? 'همه وضعیت‌ها' : 'All statuses'}</option>
              {Object.entries(OBJECT_REQUEST_STATUS).map(([id, s]) => (
                <option key={id} value={id}>{isRtl ? s.fa : s.en}</option>
              ))}
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
          {isRtl ? 'درخواستی با این وضعیت ثبت نشده است.' : 'No requests with this status.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filtered.map(req => {
            const st = OBJECT_REQUEST_STATUS[req.status] || OBJECT_REQUEST_STATUS.new;
            return (
              <div key={req.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-black text-gray-800 dark:text-white">{req.productName}</h3>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {req.brandName}
                      {req.brandUrl && (
                        <a href={req.brandUrl.startsWith('http') ? req.brandUrl : `https://${req.brandUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#26B6B6] hover:underline ms-1.5 inline-flex items-center gap-0.5">
                          <ExternalLink className="w-3 h-3" />
                          <span>{isRtl ? 'صفحه برند' : 'brand page'}</span>
                        </a>
                      )}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span dir="ltr">{req.trackingRef}</span> • {faDate(req.createdAt)}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border shrink-0 ${st.className}`}>
                    {isRtl ? st.fa : st.en}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-gray-500 dark:text-gray-400 bg-slate-50/70 dark:bg-gray-950/50 rounded-xl p-3">
                  <span><b className="text-gray-600 dark:text-gray-300">{isRtl ? 'سطح جزئیات: ' : 'LOD: '}</b>{req.detailLevel || '-'}</span>
                  <span><b className="text-gray-600 dark:text-gray-300">{isRtl ? 'بخش: ' : 'Discipline: '}</b>{disciplineName(req.discipline) || '-'}</span>
                  <span><b className="text-gray-600 dark:text-gray-300">{isRtl ? 'دسته: ' : 'Category: '}</b>{categoryName(req.categoryId) || '-'}{req.subcategoryName ? ` / ${req.subcategoryName}` : ''}</span>
                  <span><b className="text-gray-600 dark:text-gray-300">{isRtl ? 'پروژه: ' : 'Project: '}</b>{req.projectName || '-'}</span>
                  <span className="col-span-2 flex items-center gap-1"><User className="w-3 h-3" /><b className="text-gray-600 dark:text-gray-300">{req.requesterName}</b></span>
                  <span className="col-span-2 flex items-center gap-1 font-mono" dir="ltr"><Phone className="w-3 h-3 shrink-0" />{req.requesterPhone}</span>
                  {req.linkUrl && (
                    <a href={req.linkUrl.startsWith('http') ? req.linkUrl : `https://${req.linkUrl}`} target="_blank" rel="noopener noreferrer" className="col-span-2 text-[#26B6B6] hover:underline inline-flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /><span className="truncate font-mono" dir="ltr">{req.linkUrl}</span>
                    </a>
                  )}
                  {req.photoName && <span className="col-span-2 text-gray-400">{isRtl ? 'فایل ضمیمه: ' : 'Attachment: '}{req.photoName}</span>}
                </div>

                {req.description && (
                  <p className="text-[11.5px] text-gray-500 dark:text-gray-400 leading-relaxed border-r-2 border-[#26B6B6]/30 pr-3">{req.description}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold text-gray-400 block">{isRtl ? 'وضعیت' : 'Status'}</label>
                    <select
                      value={draftStatus[req.id] || req.status}
                      onChange={(e) => setDraftStatus(prev => ({ ...prev, [req.id]: e.target.value }))}
                      className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none cursor-pointer"
                    >
                      {Object.entries(OBJECT_REQUEST_STATUS).map(([id, s]) => (
                        <option key={id} value={id}>{isRtl ? s.fa : s.en}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold text-gray-400 block">{isRtl ? 'یادداشت برای درخواست‌کننده (اختیاری)' : 'Note for requester (optional)'}</label>
                    <input
                      type="text"
                      value={draftNotes[req.id] ?? ''}
                      onChange={(e) => setDraftNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                      placeholder={isRtl ? 'مثال: با برند تماس گرفته شد؛ در انتظار نقشه‌ها' : 'e.g. Brand contacted; awaiting drawings'}
                      className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      onClick={() => save(req.id)}
                      disabled={savingId === req.id}
                      className="bg-[#26B6B6] hover:bg-[#1e9494] disabled:opacity-40 text-white text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingId === req.id ? (isRtl ? 'در حال ذخیره...' : 'Saving…') : (isRtl ? 'ذخیره وضعیت' : 'Save status')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
