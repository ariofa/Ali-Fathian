import React, { useEffect, useMemo, useState } from 'react';
import { toast } from './ui/toast';
import { useLanguage } from './LanguageContext';
import { MessageSquare, Send, CheckCircle2, CornerDownRight, Lock, Clock } from 'lucide-react';
import { BIMObject } from '../types';

interface CommentItem {
  id: string;
  objectId: string;
  parentId: string | null;
  authorName: string;
  authorPhone: string;
  authorRole: string;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface CommentsSectionProps {
  object: BIMObject;
  onOpenAuthModal?: () => void;
}

/**
 * Item 14 — Discussions on object download pages.
 *  - Only architect/BIM-professional (Modeler) accounts may START a thread.
 *  - Manufacturers AND modelers may REPLY to existing threads.
 *  - Every submission starts as `pending`; the notice tells the author that
 *    comments become public only after admin approval.
 */
export const CommentsSection: React.FC<CommentsSectionProps> = ({ object, onOpenAuthModal }) => {
  const { isRtl } = useLanguage();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<CommentItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('iranbimhub_user_session') || 'null');
    } catch {
      return null;
    }
  }, []);
  const isModeler = currentUser?.role === 'Modeler';
  const isLoggedIn = Boolean(currentUser);

  const loadComments = async () => {
    setLoading(true);
    try {
      const phone = currentUser?.phone ? `&phone=${encodeURIComponent(currentUser.phone)}` : '';
      const res = await fetch(`/api/comments?objectId=${encodeURIComponent(object.id)}${phone}`);
      const data = await res.json().catch(() => ({}));
      if (data?.success) setComments(data.comments || []);
    } catch {
      /* offline — keep empty */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [object.id]);

  const threads = useMemo(() => {
    const roots = comments.filter(c => !c.parentId && (c.status === 'approved' || c.authorPhone === currentUser?.phone));
    const repliesOf = (id: string) =>
      comments.filter(c => c.parentId === id && (c.status === 'approved' || c.authorPhone === currentUser?.phone));
    return roots.map(root => ({ root, replies: repliesOf(root.id) }));
  }, [comments, currentUser]);

  const submitComment = async (parentId: string | null, bodyText: string, reset: () => void) => {
    if (!bodyText.trim()) return;
    if (!isLoggedIn) {
      toast(isRtl ? 'برای ثبت دیدگاه ابتدا وارد حساب کاربری شوید.' : 'Please sign in to leave a comment.');
      onOpenAuthModal?.();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectId: object.id,
          objectTitle: `${object.titleFa} / ${object.titleEn}`,
          parentId,
          authorName: currentUser.fullName || currentUser.name || '',
          authorPhone: currentUser.phone || '',
          authorRole: currentUser.role || 'Modeler',
          text: bodyText.trim(),
          website: ''
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) throw new Error(data?.messageFa || data?.message || 'failed');

      toast(isRtl
        ? 'دیدگاه شما ثبت شد؛ پس از تأیید به‌صورت عمومی نمایش داده می‌شود.'
        : 'Submitted. Comments become public after approval.');
      setJustSubmitted(true);
      reset();
      await loadComments();
    } catch (err: any) {
      toast(err?.message?.includes?.('فقط')
        ? err.message
        : (isRtl ? 'ثبت دیدگاه با خطا مواجه شد. لطفاً دوباره تلاش کنید.' : 'Comment submission failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const faDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fa-IR');
    } catch {
      return '';
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6 shadow-2xs" id="object-comments">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#26B6B6]" />
          <span>{isRtl ? 'دیدگاه‌ها و پرسش‌های فنی' : 'Discussions & Technical Comments'}</span>
        </h2>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-bold">
          {threads.length === 0
            ? (isRtl ? 'بدون دیدگاه' : 'No comments')
            : isRtl
              ? `${threads.length.toLocaleString('fa-IR')} دیدگاه`
              : `${threads.length} comment${threads.length > 1 ? 's' : ''}`}
        </span>
      </div>

      {justSubmitted && (
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 p-3.5 text-xs leading-relaxed text-amber-800 animate-fadeIn">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {isRtl
              ? 'دیدگاه شما با موفقیت ثبت شد. دیدگاه‌ها پس از تأیید تیم ایران‌بیم‌هاب به‌صورت عمومی نمایش داده می‌شوند و تا آن زمان فقط برای خودتان با برچسب «در انتظار تأیید» قابل مشاهده است.'
              : 'Your comment was submitted. Comments become public after IranBIMhub approval; until then only you can see it with a "pending" label.'}
          </span>
        </div>
      )}

      {/* New thread composer — Modeler accounts only (item 14 rule) */}
      {!isLoggedIn ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-gray-500">
            <Lock className="w-4 h-4 text-[#26B6B6] shrink-0" />
            <span>{isRtl ? 'برای نوشتن دیدگاه ابتدا وارد حساب کاربری خود شوید.' : 'Sign in to join the discussion.'}</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenAuthModal?.()}
            className="px-4 py-2 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
          >
            {isRtl ? 'ورود / ثبت‌نام' : 'Sign in / Register'}
          </button>
        </div>
      ) : isModeler ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitComment(null, text, () => setText(''));
          }}
          className="space-y-2.5"
        >
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isRtl ? 'دیدگاه، تجربه یا پرسش فنی‌تان دربارهٔ این آبجکت...' : 'Your experience or technical question about this object…'}
            className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none resize-y"
            maxLength={1200}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              {isRtl ? 'دیدگاه‌ها پس از تأیید نمایش عمومی می‌شوند.' : 'Comments appear publicly after approval.'}
            </p>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="px-4 py-2 bg-[#26B6B6] hover:bg-[#1e9494] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{isRtl ? 'ارسال دیدگاه' : 'Post comment'}</span>
            </button>
          </div>
        </form>
      ) : (
        <p className="text-[11px] text-gray-400 bg-slate-50 border border-gray-100 rounded-xl p-3 leading-relaxed">
          {isRtl
            ? 'نوشتن دیدگاه جدید مختص حساب‌های معمار و متخصص BIM است؛ حساب تولیدکننده شما می‌تواند به دیدگاه‌های ثبت‌شده پاسخ دهد.'
            : 'New discussions are for architect/BIM professional accounts; your manufacturer account can reply to existing comments.'}
        </p>
      )}

      {/* Threads */}
      <div className="space-y-4 pt-2">
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-4">{isRtl ? 'در حال بارگذاری دیدگاه‌ها…' : 'Loading comments…'}</p>
        ) : threads.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4 leading-relaxed border border-dashed border-gray-200 rounded-xl">
            {isRtl
              ? 'هنوز دیدگاهی برای این آبجکت ثبت نشده است؛ اولین نفری باشید که تجربه یا پرسش فنی خود را مطرح می‌کند.'
              : 'No comments yet for this object — be the first to share an experience or ask a technical question.'}
          </p>
        ) : (
          threads.map(({ root, replies }) => (
            <div key={root.id} className="rounded-xl border border-gray-100 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center font-black text-xs shrink-0">
                    {root.authorName?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-black text-gray-800 truncate">{root.authorName}</span>
                    <span className="block text-[10px] text-gray-400">{faDate(root.createdAt)}</span>
                  </div>
                </div>
                {root.status === 'pending' && (
                  <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 font-black px-2 py-0.5 rounded-full shrink-0">
                    {isRtl ? 'در انتظار تأیید' : 'Pending'}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{root.text}</p>

              {/* Replies */}
              {replies.map(rep => (
                <div key={rep.id} className="ms-7 border-s-2 border-slate-100 ps-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-xs font-black text-gray-700">{rep.authorName}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${rep.authorRole === 'Manufacturer' ? 'bg-slate-800 text-white' : 'bg-[#26B6B6]/10 text-[#26B6B6]'}`}>
                      {rep.authorRole === 'Manufacturer' ? (isRtl ? 'تولیدکننده' : 'Manufacturer') : (isRtl ? 'متخصص BIM' : 'BIM pro')}
                    </span>
                    {rep.status === 'pending' && (
                      <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 font-black px-1.5 py-0.5 rounded-full">
                        {isRtl ? 'در انتظار تأیید' : 'Pending'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{rep.text}</p>
                </div>
              ))}

              {/* Reply composer — allowed for modelers AND manufacturers */}
              {isLoggedIn && (
                replyTo?.id === root.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitComment(root.id, replyText, () => { setReplyText(''); setReplyTo(null); });
                    }}
                    className="flex items-start gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={isRtl ? 'پاسخ شما…' : 'Your reply…'}
                      className="flex-1 text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#26B6B6] focus:outline-none"
                      maxLength={600}
                    />
                    <button
                      type="submit"
                      disabled={submitting || !replyText.trim()}
                      className="px-3.5 py-2.5 bg-[#26B6B6] hover:bg-[#1e9494] disabled:opacity-40 text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
                    >
                      {isRtl ? 'ارسال' : 'Send'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setReplyTo(null); setReplyText(''); }}
                      className="px-3 py-2.5 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                    >
                      {isRtl ? 'انصراف' : 'Cancel'}
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReplyTo(root)}
                    className="text-[11px] font-black text-[#26B6B6] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'پاسخ دادن' : 'Reply'}</span>
                  </button>
                )
              )}
            </div>
          ))
        )}
      </div>

      <p className="text-[10px] text-gray-300 leading-relaxed border-t border-gray-50 pt-3 flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span>
          {isRtl
            ? 'دیدگاه‌ها پس از تأیید تیم تحریریه ایران‌بیم‌هاب به‌صورت عمومی نمایش داده می‌شوند.'
            : 'Comments appear publicly after approval by the IranBIMhub editorial team.'}
        </span>
      </p>
    </section>
  );
};
