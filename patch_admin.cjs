const fs = require('fs');
const content = fs.readFileSync('src/components/admin/ManufacturerLeadsAdminView.tsx', 'utf8');

const newContent = content
  .replace(
    "type ManufacturerLeadStatus = 'new' | 'reviewing' | 'contacted' | 'negotiating' | 'approved' | 'rejected';",
    `type ManufacturerLeadStatus = 'new' | 'contact_needed' | 'waiting_files' | 'has_bim_ready' | 'needs_bim_creation' | 'technical_review' | 'ready_to_publish' | 'published' | 'rejected';`
  )
  .replace(
    `const STATUS_OPTIONS: { value: ManufacturerLeadStatus; fa: string; en: string }[] = [
  { value: 'new', fa: 'جدید', en: 'New' },
  { value: 'reviewing', fa: 'در حال بررسی', en: 'Reviewing' },
  { value: 'contacted', fa: 'ارتباط برقرار شد', en: 'Contacted' },
  { value: 'negotiating', fa: 'در حال مذاکره', en: 'Negotiating' },
  { value: 'approved', fa: 'تأیید شده / توافق شده', en: 'Approved / Agreed' },
  { value: 'rejected', fa: 'رد شده / متوقف', en: 'Rejected / Stopped' }
];`,
    `const STATUS_OPTIONS: { value: ManufacturerLeadStatus; fa: string; en: string }[] = [
  { value: 'new', fa: 'جدید', en: 'New' },
  { value: 'contact_needed', fa: 'نیاز به تماس', en: 'Contact Needed' },
  { value: 'waiting_files', fa: 'منتظر ارسال فایل', en: 'Waiting for Files' },
  { value: 'has_bim_ready', fa: 'دارای فایل BIM', en: 'Has BIM Ready' },
  { value: 'needs_bim_creation', fa: 'نیاز به تولید آبجکت', en: 'Needs BIM Creation' },
  { value: 'technical_review', fa: 'بررسی فنی (QA)', en: 'Technical Review' },
  { value: 'ready_to_publish', fa: 'آماده انتشار', en: 'Ready to Publish' },
  { value: 'published', fa: 'منتشر شده', en: 'Published' },
  { value: 'rejected', fa: 'رد شده', en: 'Rejected' }
];`
  )
  .replace(
    `const statusClassName: Record<ManufacturerLeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-300',
  reviewing: 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-300',
  contacted: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/35 dark:text-cyan-300',
  negotiating: 'bg-purple-50 text-purple-700 dark:bg-purple-950/35 dark:text-purple-300',
  approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300',
  rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-300'
};`,
    `const statusClassName: Record<ManufacturerLeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-300',
  contact_needed: 'bg-orange-50 text-orange-700 dark:bg-orange-950/35 dark:text-orange-300',
  waiting_files: 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-300',
  has_bim_ready: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300',
  needs_bim_creation: 'bg-purple-50 text-purple-700 dark:bg-purple-950/35 dark:text-purple-300',
  technical_review: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-300',
  ready_to_publish: 'bg-teal-50 text-teal-700 dark:bg-teal-950/35 dark:text-teal-300',
  published: 'bg-green-50 text-green-700 dark:bg-green-950/35 dark:text-green-300',
  rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-300'
};`
  )
  .replace(
    `        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'در حال ارتباط' : 'In Contact'}</span>
            <MessageCircle className="w-4 h-4 text-cyan-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{((statusCounts.contacted || 0) + (statusCounts.negotiating || 0)).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'توافق شده' : 'Agreed'}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{(statusCounts.approved || 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>`,
    `        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'نیاز به اقدام' : 'Action Needed'}</span>
            <MessageCircle className="w-4 h-4 text-orange-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{((statusCounts.contact_needed || 0) + (statusCounts.waiting_files || 0)).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase">{isRtl ? 'منتشر شده' : 'Published'}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <strong className="text-2xl font-black text-gray-850 dark:text-white">{(statusCounts.published || 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
        </div>`
  );

fs.writeFileSync('src/components/admin/ManufacturerLeadsAdminView.tsx', newContent, 'utf8');
console.log("Patched ManufacturerLeadsAdminView.tsx");
