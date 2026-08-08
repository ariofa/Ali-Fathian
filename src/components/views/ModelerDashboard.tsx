import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { toast } from '../ui/toast';
import { readDownloadHistory, appendDownloadEntry, getTodayDownloadCount, DAILY_FREE_LIMIT, subscribeDownloadHistory } from '../../lib/downloadHistory';
import { IRAN_PROVINCES } from '../../lib/iranGeo';
import { upsertRegisteredUser } from '../../lib/usersIndex';
import { useLanguage } from '../LanguageContext';
import { BIMObject } from '../../types';
import { BIM_OBJECTS } from '../../data';
import { BIMObjectCard } from '../BIMObjectCard';
import { EmptyState } from '../ui/EmptyState';
import { ObjectRequestForm, MyObjectRequestsList } from '../dashboard/ObjectRequestForm';
import {
  User,
  FolderHeart,
  Download,
  Clock,
  MessageSquare,
  FileDigit,
  LogOut,
  Menu,
  X,
  CreditCard,
  Sparkles,
  Bookmark,
  Edit,
  Layers,
  Search,
  LayoutDashboard,
  PackagePlus,
  MessagesSquare,
  Hourglass,
  BellRing,
  MapPin
} from 'lucide-react';

/**
 * Modeler Dashboard (پنل معماران و متخصصین BIM)
 * --------------------------------------------
 * Restructured per the approved 20-item batch (1405/05/17_03):
 *  4) «کار روزمره/فضای حرفه‌ای» switch removed — everything always visible
 *  5) «نقش‌ها و سرفصل‌ها» tab removed — its content moved into the profile
 *  6) «پروفایل من» replaces «تنظیمات پروفایل»
 *  7) province + city cascading selects (src/lib/iranGeo.ts) — the same ids
 *     feed the manufacturer analytics geo chart via src/lib/usersIndex.ts
 *  8) larger, more readable typography across the panel
 *  9/18) projects / collections / moodboards hidden behind a «به‌زودی» tab
 *  11) real, bigger daily-download counter fed by the unified history store
 *  16) subscription purchase replaced with an honest «به‌زودی» notice
 *  17) every mock/default value purged (no fake email, company, phone,
 *      invoice, timer seed, or folder dates)
 *  20) «درخواست آبجکت جدید» tab + «پیام‌ها و درخواست‌ها» tracking tab
 */

interface ModelerDashboardProps {
  savedObjects: string[];
  comparedObjects: string[];
  onToggleSave: (id: string) => void;
  onSelectObject: (obj: BIMObject) => void;
  onQuickDownload: (obj: BIMObject, format: string) => void;
  onLogout: () => void;
  onViewBrand?: (mfgId: string) => void;
}

type DashboardSection =
  | 'overview'
  | 'profile'
  | 'messages-requests'
  | 'favorites'
  | 'history'
  | 'object-request'
  | 'projects-coming'
  | 'subscription';

/** Persian-day countdown to midnight (real, recomputed every second). */
const nowToMidnight = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(23 - now.getHours())}:${pad(59 - now.getMinutes())}:${pad(59 - now.getSeconds())}`;
};

const PROFESSIONAL_ROLES = ['Architect', 'Structural Engineer', 'MEP Engineer', 'Interior Designer', 'Quantity Surveyor', 'Project Manager', 'BIM Manager'];
const INTEREST_TOPICS = ['HVAC', 'Electrical Fittings', 'Sanitary Ware', 'Facades', 'Structural Concrete', 'Sustainable Materials', 'Acoustics', 'Interior Design'];

export const ModelerDashboard: React.FC<ModelerDashboardProps> = ({
  savedObjects,
  onToggleSave,
  onSelectObject,
  onQuickDownload,
  onLogout,
  onViewBrand
}) => {
  const { isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<DashboardSection>('overview');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for custom event to change active tab from Header / App / inbox deep-links
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const tabName = (e as CustomEvent).detail?.tab;
      if (!tabName) return;
      // Legacy aliases → new sections
      if (tabName === 'collections' || tabName === 'favorites') setActiveTab('favorites');
      else if (tabName === 'projects') setActiveTab('projects-coming');
      else if (tabName === 'roles-topics') setActiveTab('profile');
      else if (tabName === 'notifications') setActiveTab('overview');
      else if (['profile', 'history', 'subscription', 'messages-requests', 'object-request', 'overview'].includes(tabName)) {
        setActiveTab(tabName as DashboardSection);
      } else setActiveTab('overview');
    };
    window.addEventListener('change-dashboard-tab', handleTabChange);
    return () => window.removeEventListener('change-dashboard-tab', handleTabChange);
  }, []);

  // User session — honest defaults: nothing fabricated (item 17)
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const local = localStorage.getItem('iranbimhub_user_session');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed) {
          if (!parsed.fullName && parsed.name) parsed.fullName = parsed.name;
          return parsed;
        }
      } catch {
        /* fall through to the empty account shell */
      }
    }
    return {
      fullName: '',
      email: '',
      role: 'Modeler',
      isPremium: false,
      company: '',
      title: '',
      joinedDate: '',
      phone: '',
      provinceId: '',
      cityId: '',
      selectedRoles: [],
      selectedTopics: [],
      notificationPrefs: { email: true, platform: true, newsletter: false }
    };
  });

  // Daily download tracking — REAL count derived from the unified history store
  const [todayDownloadsUsed, setTodayDownloadsUsed] = useState<number>(() => getTodayDownloadCount());
  useEffect(() => subscribeDownloadHistory(() => setTodayDownloadsUsed(getTodayDownloadCount())), []);
  const dailyDownloadsRemaining = Math.max(0, DAILY_FREE_LIMIT - todayDownloadsUsed);
  const [timerString, setTimerString] = useState(nowToMidnight);

  useEffect(() => {
    const interval = setInterval(() => setTimerString(nowToMidnight()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Professional roles & topics — no fabricated defaults (item 17)
  const [selectedRoles, setSelectedRoles] = useState<string[]>(() =>
    Array.isArray(currentUser?.selectedRoles) ? currentUser.selectedRoles : []);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(() =>
    Array.isArray(currentUser?.selectedTopics) ? currentUser.selectedTopics : []);

  // Download history — REAL entries from the unified store
  const [downloadHistory, setDownloadHistory] = useState<any[]>(() => readDownloadHistory());
  useEffect(() => subscribeDownloadHistory(() => setDownloadHistory(readDownloadHistory())), []);

  // Search & filters inside the history list
  const [historySearch, setHistorySearch] = useState('');
  const [historyFormat, setHistoryFormat] = useState('all');

  // My object requests count (real — from the server store)
  const [myRequestsCount, setMyRequestsCount] = useState(0);
  const loadMyRequestsCount = useCallback(async () => {
    if (!currentUser?.phone) { setMyRequestsCount(0); return; }
    try {
      const res = await fetch(`/api/object-requests/mine?phone=${encodeURIComponent(currentUser.phone)}`);
      const data = await res.json().catch(() => ({}));
      if (data?.success) setMyRequestsCount(data.total ?? (data.requests?.length || 0));
    } catch { /* offline */ }
  }, [currentUser?.phone]);
  useEffect(() => { loadMyRequestsCount(); }, [loadMyRequestsCount]);

  // My comments (real — from the server store)
  const [myComments, setMyComments] = useState<any[]>([]);
  const [myCommentsLoading, setMyCommentsLoading] = useState(false);
  const loadMyComments = useCallback(async () => {
    if (!currentUser?.phone) { setMyComments([]); return; }
    setMyCommentsLoading(true);
    try {
      const res = await fetch(`/api/comments/mine?phone=${encodeURIComponent(currentUser.phone)}`);
      const data = await res.json().catch(() => ({}));
      if (data?.success) setMyComments(data.comments || []);
    } catch { /* offline */ } finally {
      setMyCommentsLoading(false);
    }
  }, [currentUser?.phone]);
  useEffect(() => { loadMyComments(); }, [loadMyComments]);

  // Profile form state
  const [profileName, setProfileName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileCompany, setProfileCompany] = useState(currentUser?.company || '');
  const [profileTitle, setProfileTitle] = useState(currentUser?.title || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileProvinceId, setProfileProvinceId] = useState<string>(currentUser?.provinceId || '');
  const [profileCityId, setProfileCityId] = useState<string>(currentUser?.cityId || '');

  const selectedProvince = useMemo(
    () => IRAN_PROVINCES.find(p => p.id === profileProvinceId) || null,
    [profileProvinceId]
  );

  // Dynamic combined & deduplicated BIM objects list
  const allBimObjects = useMemo(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_custom_objects_v2');
      const custom = saved ? JSON.parse(saved) : [];
      const map = new Map<string, BIMObject>();
      BIM_OBJECTS.forEach(obj => { if (obj && obj.id) map.set(obj.id, obj); });
      custom.forEach((obj: BIMObject) => { if (obj && obj.id) map.set(obj.id, obj); });
      return Array.from(map.values());
    } catch {
      return BIM_OBJECTS;
    }
  }, []);

  // Recommendations based on selected topics (empty for a brand-new, honest profile)
  const recommendedObjects = useMemo(() => {
    if (selectedTopics.length === 0) return [];
    return BIM_OBJECTS.filter(obj => {
      if (selectedTopics.includes('HVAC') && obj.category === 'hvac') return true;
      if (selectedTopics.includes('Facades') && obj.category === 'doors_windows') return true;
      if (selectedTopics.includes('Sustainable Materials') && obj.certification.includes('BHRC')) return true;
      return false;
    }).slice(0, 4);
  }, [selectedTopics]);

  const filteredHistory = useMemo(() => {
    return downloadHistory.filter(dl => {
      const title = isRtl ? dl.titleFa : dl.titleEn;
      const matchesSearch = title.toLowerCase().includes(historySearch.toLowerCase()) ||
        (dl.manufacturerName || '').toLowerCase().includes(historySearch.toLowerCase());
      const matchesFormat = historyFormat === 'all' || dl.format === historyFormat;
      return matchesSearch && matchesFormat;
    });
  }, [downloadHistory, historySearch, historyFormat, isRtl]);

  const favoriteObjects = allBimObjects.filter(obj => savedObjects.includes(obj.id));

  // Quick re-download — REAL daily-limit counting via the unified history store
  const handleReDownload = (dlEntry: any) => {
    if (!currentUser.isPremium && getTodayDownloadCount() >= DAILY_FREE_LIMIT) {
      toast(isRtl
        ? 'سقف دانلود روزانهٔ شما به پایان رسیده است؛ فردا دوباره در دسترس خواهد بود.'
        : 'You have reached your daily download limit; it resets tomorrow.');
      setActiveTab('subscription');
      return;
    }
    appendDownloadEntry({
      objectId: dlEntry.objectId,
      titleFa: dlEntry.titleFa,
      titleEn: dlEntry.titleEn,
      format: dlEntry.format,
      fileSize: dlEntry.fileSize,
      manufacturerName: dlEntry.manufacturerName,
    });
    toast(isRtl
      ? `در حال دانلود مجدد فایل ${dlEntry.format} محصول...`
      : `Re-downloading the ${dlEntry.format} file…`);
  };

  // Save profile edits — also upserts the geo index used by the manufacturer analytics (item 7)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const province = IRAN_PROVINCES.find(p => p.id === profileProvinceId) || null;
    const city = province?.cities.find(c => c.id === profileCityId) || null;
    const updated = {
      ...currentUser,
      fullName: profileName,
      name: profileName,
      email: profileEmail,
      company: profileCompany,
      title: profileTitle,
      phone: profilePhone,
      provinceId: province?.id || '',
      provinceFa: province?.nameFa || '',
      cityId: city?.id || '',
      cityFa: city?.nameFa || '',
      selectedRoles,
      selectedTopics
    };
    setCurrentUser(updated);
    localStorage.setItem('iranbimhub_user_session', JSON.stringify(updated));
    if (profilePhone) {
      upsertRegisteredUser({
        phone: profilePhone,
        name: profileName,
        role: 'Modeler',
        provinceId: province?.id || '',
        provinceFa: province?.nameFa || '',
        cityId: city?.id || '',
        cityFa: city?.nameFa || '',
        company: profileCompany
      });
    }
    toast(isRtl ? 'پروفایل شما با موفقیت ذخیره شد.' : 'Profile saved successfully.');
  };

  const handleToggleNotification = (key: string) => {
    setCurrentUser((prev: any) => {
      const updated = {
        ...prev,
        notificationPrefs: { ...prev.notificationPrefs, [key]: !prev.notificationPrefs?.[key] }
      };
      localStorage.setItem('iranbimhub_user_session', JSON.stringify(updated));
      return updated;
    });
  };

  const navItems: { id: DashboardSection; labelFa: string; labelEn: string; icon: any; badgeFa?: string }[] = [
    { id: 'overview', labelFa: 'پیشخوان عمومی', labelEn: 'Overview', icon: LayoutDashboard },
    { id: 'profile', labelFa: 'پروفایل من', labelEn: 'My Profile', icon: User },
    { id: 'messages-requests', labelFa: 'پیام‌ها و درخواست‌ها', labelEn: 'Messages & Requests', icon: MessagesSquare },
    { id: 'favorites', labelFa: 'نشان‌شده‌ها', labelEn: 'Saved Objects', icon: Bookmark },
    { id: 'history', labelFa: 'تاریخچه دانلودها', labelEn: 'Download History', icon: FileDigit },
    { id: 'object-request', labelFa: 'درخواست آبجکت جدید', labelEn: 'Request an Object', icon: PackagePlus },
    { id: 'projects-coming', labelFa: 'پروژه‌ها و کلکسیون‌ها', labelEn: 'Projects & Collections', icon: FolderHeart, badgeFa: 'به‌زودی' },
    { id: 'subscription', labelFa: 'پرداخت و اشتراک', labelEn: 'Subscription & Payment', icon: CreditCard },
  ];

  const renderNavList = (collapsed: boolean, onPick?: () => void) => (
    <ul className="space-y-1 font-medium text-[13px] leading-none">
      {navItems.map(item => {
        const IconComponent = item.icon;
        const active = activeTab === item.id;
        return (
          <li key={item.id}>
            <button
              onClick={() => { setActiveTab(item.id); onPick?.(); }}
              className={`w-full flex items-center justify-between py-3 rounded-xl transition-all cursor-pointer ${
                active
                  ? 'bg-[#26B6B6]/10 text-[#26B6B6] font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-gray-800'
              } ${collapsed ? 'justify-center px-0' : 'px-3'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <IconComponent className="w-4.5 h-4.5 shrink-0" />
                {!collapsed && <span className="truncate">{isRtl ? item.labelFa : item.labelEn}</span>}
              </div>
              {!collapsed && item.badgeFa && (
                <span className="bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0">
                  {isRtl ? item.badgeFa : 'Soon'}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const displayName = currentUser?.fullName || currentUser?.name || '';
  const commentStatusMeta: Record<string, { fa: string; className: string }> = {
    pending: { fa: 'در انتظار تأیید', className: 'bg-amber-50 text-amber-600 border-amber-100' },
    approved: { fa: 'منتشر شده', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    rejected: { fa: 'تأیید نشد', className: 'bg-rose-50 text-rose-500 border-rose-100' }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-gray-950 flex flex-col md:flex-row font-sans" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpenMobile(true)}
            className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-[13px] font-bold text-gray-800 dark:text-white">
            {isRtl ? 'میز کار طراحان ایران‌بیم‌هاب' : 'IranBIMhub Modeler Panel'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {currentUser.isPremium ? (
            <span className="bg-[#26B6B6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>VIP</span>
            </span>
          ) : (
            <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {isRtl ? 'رایگان' : 'Free'}
            </span>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isSidebarOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div onClick={() => setIsSidebarOpenMobile(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />
          <div className="relative w-72 h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-10 p-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#26B6B6]/10 text-[#26B6B6] rounded-full flex items-center justify-center font-extrabold text-sm">
                  {(displayName || 'U').charAt(0)}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-800 dark:text-white">{displayName}</h4>
                  <p className="text-[11px] text-gray-400">{currentUser?.title || ''}</p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpenMobile(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {renderNavList(false, () => setIsSidebarOpenMobile(false))}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isRtl ? 'خروج از حساب' : 'Log Out'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-l border-gray-100 dark:border-gray-800 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#26B6B6] text-white rounded-lg flex items-center justify-center font-black text-sm">B</div>
              <span className="font-extrabold text-[13px] tracking-tight text-gray-800 dark:text-white uppercase">
                {isRtl ? 'میز کار طراحان' : 'Modeler Hub'}
              </span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg cursor-pointer mx-auto"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {!isSidebarCollapsed && (
          <div className="p-4 mx-3 my-4 bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-800/50 rounded-xl space-y-2">
            <div className="flex items-center gap-3">
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full object-cover border border-[#26B6B6] shrink-0" />
              ) : (
                <div className="w-10 h-10 bg-[#26B6B6]/10 text-[#26B6B6] rounded-full flex items-center justify-center font-bold text-sm uppercase shrink-0">
                  {(displayName || 'U').charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-[13px] font-bold text-gray-800 dark:text-white truncate">{displayName}</h4>
                <p className="text-[10.5px] text-gray-400 truncate">{currentUser?.title || ''}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11.5px] pt-1.5 border-t border-gray-200/50 dark:border-gray-800">
              <span className="text-gray-400">{isRtl ? 'نوع عضویت:' : 'Plan:'}</span>
              {currentUser.isPremium ? (
                <span className="text-[#26B6B6] font-bold">👑 VIP</span>
              ) : (
                <span className="text-gray-500 font-bold">{isRtl ? 'رایگان' : 'Free'}</span>
              )}
            </div>
            {!currentUser.isPremium && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10.5px]">
                  <span className="text-gray-400">{isRtl ? 'دانلود مانده امروز:' : 'Downloads left today:'}</span>
                  <span className="font-bold text-[#26B6B6]">{dailyDownloadsRemaining} / {DAILY_FREE_LIMIT}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#26B6B6] h-full transition-all" style={{ width: `${(dailyDownloadsRemaining / DAILY_FREE_LIMIT) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {renderNavList(isSidebarCollapsed)}
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-2.5 py-3 bg-rose-50 dark:bg-rose-950/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${isSidebarCollapsed ? 'justify-center' : 'px-3'}`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>{isRtl ? 'خروج از حساب' : 'Log Out'}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* ============ OVERVIEW (پیشخوان عمومی) ============ */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Welcome board + big real counters (item 11) */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-950 text-white rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xs border border-white/5">
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {currentUser.isPremium ? (
                      <span className="bg-[#26B6B6] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">👑 VIP</span>
                    ) : (
                      <span className="bg-gray-800 text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{isRtl ? 'حساب رایگان' : 'Free Plan'}</span>
                    )}
                    {selectedProvinceChip(currentUser, isRtl)}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    {displayName
                      ? (isRtl ? `خوش‌آمدید، ${displayName}` : `Welcome back, ${displayName}`)
                      : (isRtl ? 'به میز کار خود خوش‌آمدید' : 'Welcome to your workspace')}
                  </h1>
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    {isRtl
                      ? 'مدیریت دانلودها، نشان‌شده‌ها، درخواست‌های آبجکت و پروفایل حرفه‌ای شما'
                      : 'Manage your downloads, saved objects, object requests and professional profile'}
                  </p>
                </div>

                <div className="flex flex-wrap items-stretch gap-3.5">
                  {/* Big REAL daily counter */}
                  {!currentUser.isPremium ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center min-w-36 flex flex-col justify-center">
                      <span className="block text-3xl font-black text-[#26B6B6] leading-none">{dailyDownloadsRemaining}<span className="text-base text-gray-400 font-bold"> / {DAILY_FREE_LIMIT}</span></span>
                      <span className="text-[11px] text-gray-300 mt-2 font-bold">{isRtl ? 'دانلود ماندهٔ امروز' : 'Downloads left today'}</span>
                      <div className="text-[10.5px] text-rose-300 mt-1.5 flex items-center justify-center gap-1 font-mono" dir="ltr">
                        <Clock className="w-3 h-3" />
                        <span>{timerString}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#26B6B6]/10 border border-[#26B6B6]/20 rounded-2xl px-6 py-4 text-center min-w-36 flex flex-col justify-center">
                      <span className="block text-3xl font-black text-[#26B6B6] leading-none">∞</span>
                      <span className="text-[11px] text-[#26B6B6] mt-2 font-bold">{isRtl ? 'دانلود نامحدود' : 'Unlimited downloads'}</span>
                    </div>
                  )}

                  <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center min-w-28 flex flex-col justify-center">
                    <span className="block text-3xl font-black leading-none">{favoriteObjects.length}</span>
                    <span className="text-[11px] text-gray-300 mt-2 font-bold">{isRtl ? 'نشان‌شده‌ها' : 'Saved'}</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center min-w-28 flex flex-col justify-center">
                    <span className="block text-3xl font-black leading-none">{myRequestsCount}</span>
                    <span className="text-[11px] text-gray-300 mt-2 font-bold">{isRtl ? 'درخواست‌های آبجکت' : 'Object requests'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { tab: 'object-request' as DashboardSection, icon: PackagePlus, titleFa: 'درخواست آبجکت جدید', titleEn: 'Request an object', descFa: 'معرفی محصول برای ساخت آبجکت', descEn: 'Ask us to model a product' },
                { tab: 'favorites' as DashboardSection, icon: Bookmark, titleFa: 'نشان‌شده‌ها', titleEn: 'Saved objects', descFa: 'دسترسی سریع به منتخب‌ها', descEn: 'Your shortlisted products' },
                { tab: 'history' as DashboardSection, icon: FileDigit, titleFa: 'تاریخچه دانلودها', titleEn: 'Download history', descFa: 'فایل‌های دریافت‌شدهٔ شما', descEn: 'Files you pulled' },
              ].map(card => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.tab}
                    onClick={() => setActiveTab(card.tab)}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-[#26B6B6]/50 rounded-2xl p-5 flex items-center gap-4 text-start transition-all cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#26B6B6]/10 text-[#26B6B6] flex items-center justify-center shrink-0 group-hover:bg-[#26B6B6] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[13.5px] font-black text-gray-800 dark:text-white">{isRtl ? card.titleFa : card.titleEn}</span>
                      <span className="block text-[11.5px] text-gray-400 mt-0.5">{isRtl ? card.descFa : card.descEn}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Widget grid */}
            <div className="grid grid-cols-1 gap-6">
              {/* Recommendations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <h3 className="text-[13px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'پیشنهادهای بر اساس علایق شما' : 'Recommendations Based on Your Interests'}</span>
                  </h3>
                  <button onClick={() => setActiveTab('profile')} className="text-[12px] text-[#26B6B6] hover:underline cursor-pointer">
                    {isRtl ? 'ویرایش علایق' : 'Edit interests'}
                  </button>
                </div>

                {selectedTopics.length === 0 ? (
                  <EmptyState
                    compact
                    icon={Sparkles}
                    title={isRtl ? 'علایق تخصصی‌تان را ثبت کنید' : 'Set your professional interests'}
                    description={isRtl
                      ? 'با ثبت نقش‌ها و سرفصل‌های موردعلاقه در «پروفایل من»، پیشنهادهای آبجکت متناسب با رشتهٔ شما این‌جا نمایش داده می‌شود.'
                      : 'Pick your roles and topics in "My Profile" and matching object suggestions will show up here.'}
                  />
                ) : recommendedObjects.length === 0 ? (
                  <EmptyState
                    compact
                    icon={Sparkles}
                    title={isRtl ? 'پیشنهاد منطبقی یافت نشد' : 'No matching suggestions yet'}
                    description={isRtl
                      ? 'با تکمیل کاتالوگ، پیشنهادهای مرتبط با علایق شما به‌صورت خودکار این‌جا نمایش داده می‌شود.'
                      : 'As the catalog grows, objects matching your interests will appear here automatically.'}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendedObjects.map(obj => (
                      <div
                        key={obj.id}
                        onClick={() => onSelectObject(obj)}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-[#26B6B6]/50 transition-all cursor-pointer group"
                      >
                        <img src={obj.imageUrl} alt={obj.titleEn} className="w-full h-28 rounded-lg object-cover bg-slate-50" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-800 dark:text-white group-hover:text-[#26B6B6] transition-colors leading-snug line-clamp-2">
                            {isRtl ? obj.titleFa : obj.titleEn}
                          </h4>
                          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5 font-mono">
                            <span>{obj.lod}</span>
                            <span>{obj.fileSize}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recently downloaded */}
            <div className="space-y-4">
              <h3 className="text-[13px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#26B6B6]" />
                <span>{isRtl ? 'فایل‌هایی که اخیراً دانلود کرده‌اید' : 'Recently Downloaded'}</span>
              </h3>

              {downloadHistory.length === 0 ? (
                <EmptyState
                  compact
                  icon={Download}
                  title={isRtl ? 'هنوز هیچ فایلی دانلود نکرده‌اید' : 'No downloaded files yet'}
                  description={isRtl
                    ? 'پس از دانلود اولین آبجکت، تاریخچهٔ دانلودهای شما این‌جا نمایش داده می‌شود.'
                    : 'Once you download your first BIM object, your history will appear here.'}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {downloadHistory.slice(0, 3).map(dl => (
                    <div key={dl.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-3.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="bg-slate-100 dark:bg-gray-800 font-mono text-[11px] font-extrabold px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400">{dl.format}</span>
                          <span className="text-[11px] text-gray-400 font-mono">{dl.date}</span>
                        </div>
                        <h4 className="text-[14px] font-extrabold text-gray-800 dark:text-white mt-2.5 leading-snug line-clamp-2">{isRtl ? dl.titleFa : dl.titleEn}</h4>
                        <p className="text-[12px] text-gray-400 mt-1">{dl.manufacturerName}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-50 dark:border-gray-800/60">
                        <span className="text-[12px] text-gray-400 font-mono">{dl.fileSize}</span>
                        <button
                          onClick={() => handleReDownload(dl)}
                          className="text-[#26B6B6] hover:text-white hover:bg-[#26B6B6] p-1.5 rounded-lg border border-[#26B6B6]/20 transition-all cursor-pointer"
                          title={isRtl ? 'دانلود مجدد' : 'Download again'}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ PROFILE (پروفایل من) ============ */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-[15px] font-black text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <User className="w-5 h-5 text-[#26B6B6]" />
                <span>{isRtl ? 'پروفایل من' : 'My Profile'}</span>
              </h2>
              <p className="text-[12.5px] text-gray-400 mt-2 leading-relaxed">
                {isRtl
                  ? 'مشخصات حرفه‌ای، موقعیت جغرافیایی و علایق تخصصی خود را ثبت کنید؛ این اطلاعات در پیشنهاد آبجکت‌ها و آمار جغرافیایی برندها (به‌صورت تجمیعی و ناشناس) استفاده می‌شود.'
                  : 'Register your professional details, location and interests; they shape object recommendations and (anonymized, aggregated) brand geo-analytics.'}
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 col-span-1 md:col-span-2">
                <div
                  className="relative group cursor-pointer shrink-0"
                  onClick={() => document.getElementById('user-avatar-upload')?.click()}
                  title={isRtl ? 'جهت بارگذاری یا تعویض تصویر کلیک کنید' : 'Click to upload or change photo'}
                >
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-[#26B6B6] shadow-2xs" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#26B6B6]/15 text-[#26B6B6] flex items-center justify-center font-black text-xl border-2 border-[#26B6B6] shadow-2xs">
                      {(profileName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="space-y-1 text-start">
                  <h4 className="text-[13px] font-bold text-gray-800 dark:text-white">{isRtl ? 'تصویر نمایه' : 'Profile photo'}</h4>
                  <p className="text-[11.5px] text-gray-400">{isRtl ? 'برای تعویض عکس روی تصویر کلیک کنید (JPG یا PNG، حداکثر ۳ مگابایت)' : 'Click the image to upload (JPG/PNG, max 3MB)'}</p>
                  <button
                    type="button"
                    onClick={() => document.getElementById('user-avatar-upload')?.click()}
                    className="text-[12px] font-bold text-[#26B6B6] hover:underline cursor-pointer inline-block"
                  >
                    {isRtl ? 'بارگذاری تصویر جدید...' : 'Upload new photo…'}
                  </button>
                  <input
                    type="file"
                    id="user-avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('image/')) {
                        toast(isRtl ? 'فایل انتخابی باید تصویر باشد.' : 'Selected file must be an image.');
                        return;
                      }
                      if (file.size > 3 * 1024 * 1024) {
                        toast(isRtl ? 'حجم تصویر نباید بیشتر از ۳ مگابایت باشد.' : 'Image must be smaller than 3MB.');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const dataUrl = evt.target?.result as string;
                        if (dataUrl) {
                          const updated = { ...currentUser, avatarUrl: dataUrl };
                          setCurrentUser(updated);
                          try { localStorage.setItem('iranbimhub_user_session', JSON.stringify(updated)); } catch { /* storage full */ }
                          toast(isRtl ? 'تصویر نمایه به‌روز شد.' : 'Avatar updated.');
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-gray-500 block">{isRtl ? 'نام و نام خانوادگی' : 'Full Name'}</label>
                <input type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)}
                  className="w-full text-[13px] p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-gray-500 block">{isRtl ? 'نشانی ایمیل' : 'Email Address'}</label>
                <input type="email" dir="ltr" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full text-[13px] p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6] font-mono" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-gray-500 block">{isRtl ? 'شرکت / دفتر طراحی' : 'Company / Studio'}</label>
                <input type="text" value={profileCompany} onChange={(e) => setProfileCompany(e.target.value)}
                  className="w-full text-[13px] p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-gray-500 block">{isRtl ? 'عنوان یا سمت حرفه‌ای' : 'Professional Title'}</label>
                <input type="text" value={profileTitle} onChange={(e) => setProfileTitle(e.target.value)}
                  placeholder={isRtl ? 'مثال: معمار طراح / مدیر BIM' : 'e.g. Design Architect / BIM Manager'}
                  className="w-full text-[13px] p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6]" />
              </div>

              {/* Province → City cascading selects (item 7) */}
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#26B6B6]" />
                  <span>{isRtl ? 'استان' : 'Province'}</span>
                </label>
                <select
                  value={profileProvinceId}
                  onChange={(e) => { setProfileProvinceId(e.target.value); setProfileCityId(''); }}
                  className="w-full text-[13px] p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                >
                  <option value="">{isRtl ? 'انتخاب استان...' : 'Select province…'}</option>
                  {IRAN_PROVINCES.map(p => (
                    <option key={p.id} value={p.id}>{isRtl ? p.nameFa : p.nameEn}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-gray-500 block">{isRtl ? 'شهر / شهرستان' : 'City / County'}</label>
                <select
                  value={profileCityId}
                  onChange={(e) => setProfileCityId(e.target.value)}
                  disabled={!selectedProvince}
                  className="w-full text-[13px] p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{selectedProvince ? (isRtl ? 'انتخاب شهر...' : 'Select city…') : (isRtl ? 'ابتدا استان را انتخاب کنید' : 'Pick a province first')}</option>
                  {(selectedProvince?.cities || []).map(c => (
                    <option key={c.id} value={c.id}>{isRtl ? c.nameFa : c.nameEn}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[12.5px] font-bold text-gray-500 block">{isRtl ? 'شماره همراه (شناسهٔ ورود شما)' : 'Mobile number (your sign-in ID)'}</label>
                <input type="text" dir="ltr" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full text-[13px] p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6] font-mono" />
              </div>

              {/* Roles & interests — moved here from the removed tab (item 5) */}
              <div className="col-span-1 md:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
                <div>
                  <h4 className="text-[13.5px] font-black text-gray-700 dark:text-gray-200">{isRtl ? 'نقش‌های حرفه‌ای شما' : 'Your Professional Roles'}</h4>
                  <p className="text-[11.5px] text-gray-400 mt-1">{isRtl ? 'انتخاب نقش‌ها در پیشنهاد آبجکت‌ها و محتوای تخصصی استفاده می‌شود.' : 'Roles shape your object suggestions and professional content.'}</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {PROFESSIONAL_ROLES.map(role => {
                    const active = selectedRoles.includes(role);
                    return (
                      <button key={role} type="button"
                        onClick={() => setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role])}
                        className={`text-[12.5px] px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-semibold ${
                          active
                            ? 'bg-[#26B6B6]/10 text-[#26B6B6] border-[#26B6B6]'
                            : 'bg-slate-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-slate-100'
                        }`}
                      >
                        {role} {active && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-4">
                <h4 className="text-[13.5px] font-black text-gray-700 dark:text-gray-200">{isRtl ? 'سرفصل‌های موردعلاقه' : 'Topics of Interest'}</h4>
                <div className="flex flex-wrap gap-2.5">
                  {INTEREST_TOPICS.map(topic => {
                    const active = selectedTopics.includes(topic);
                    return (
                      <button key={topic} type="button"
                        onClick={() => setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic])}
                        className={`text-[12.5px] px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-semibold ${
                          active
                            ? 'bg-[#26B6B6]/10 text-[#26B6B6] border-[#26B6B6]'
                            : 'bg-slate-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-slate-100'
                        }`}
                      >
                        {topic} {active && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notification preferences */}
              <div className="col-span-1 md:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
                <h4 className="text-[13.5px] font-black text-gray-700 dark:text-gray-200">{isRtl ? 'تنظیمات اطلاع‌رسانی' : 'Notification Preferences'}</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[13px] text-gray-600 dark:text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={!!currentUser.notificationPrefs?.email} onChange={() => handleToggleNotification('email')} className="accent-[#26B6B6] w-4 h-4" />
                    <span>{isRtl ? 'دریافت خبرنامه و اطلاعیه‌های مهم به ایمیل' : 'Receive newsletters and important announcements by email'}</span>
                  </label>
                  <label className="flex items-center gap-3 text-[13px] text-gray-600 dark:text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={!!currentUser.notificationPrefs?.platform} onChange={() => handleToggleNotification('platform')} className="accent-[#26B6B6] w-4 h-4" />
                    <span>{isRtl ? 'اعلان درون‌برنامه‌ای هنگام به‌روزرسانی آبجکت‌های نشان‌شده' : 'In-app alert when one of my saved objects is updated'}</span>
                  </label>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="submit" className="bg-[#26B6B6] hover:bg-[#1e9494] text-white font-black text-[13px] px-8 py-3.5 rounded-xl cursor-pointer shadow-sm transition-colors">
                  {isRtl ? 'ذخیرهٔ پروفایل' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============ MESSAGES & REQUESTS (پیام‌ها و درخواست‌ها) ============ */}
        {activeTab === 'messages-requests' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-[15px] font-black text-gray-800 dark:text-white flex items-center gap-2">
                  <MessagesSquare className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'پیام‌ها و درخواست‌ها' : 'Messages & Requests'}</span>
                </h2>
                <p className="text-[12.5px] text-gray-400 mt-1.5">
                  {isRtl ? 'پیگیری درخواست‌های آبجکت و دیدگاه‌هایی که در صفحهٔ محصولات ثبت کرده‌اید.' : 'Track your object requests and the comments you left on product pages.'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('object-request')}
                className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[12.5px] font-black px-4 py-2.5 rounded-xl cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
              >
                <PackagePlus className="w-4 h-4" />
                <span>{isRtl ? 'درخواست آبجکت جدید' : 'New object request'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* My object requests */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                <MyObjectRequestsList phone={currentUser?.phone} />
              </div>

              {/* My comments */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-[13px] font-black text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#26B6B6]" />
                  <span>{isRtl ? 'دیدگاه‌های من در صفحه آبجکت‌ها' : 'My object-page comments'}</span>
                </h4>
                {myCommentsLoading ? (
                  <p className="text-[12px] text-gray-400 py-4 text-center">{isRtl ? 'در حال بارگذاری...' : 'Loading…'}</p>
                ) : myComments.length === 0 ? (
                  <p className="text-[12px] text-gray-400 leading-relaxed border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                    {isRtl ? 'هنوز دیدگاهی ثبت نکرده‌اید؛ از صفحهٔ هر آبجکت می‌توانید پرسش یا تجربهٔ خود را بنویسید.' : 'No comments yet — share a question or experience from any object page.'}
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {myComments.map(c => {
                      const st = commentStatusMeta[c.status] || commentStatusMeta.pending;
                      const linkedObject = allBimObjects.find(o => o.id === c.objectId);
                      return (
                        <div key={c.id} className="bg-slate-50/70 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => linkedObject && onSelectObject(linkedObject)}
                              className={`text-start min-w-0 ${linkedObject ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                              <span className={`block text-[12.5px] font-black truncate ${linkedObject ? 'text-[#26B6B6] hover:underline' : 'text-gray-700 dark:text-gray-200'}`}>
                                {(c.objectTitle || '').split('/')[0]?.trim() || (isRtl ? 'آبجکت' : 'Object')}
                              </span>
                            </button>
                            <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-full border shrink-0 ${st.className}`}>{st.fa}</span>
                          </div>
                          <p className="text-[12.5px] text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">{c.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ FAVORITES (نشان‌شده‌ها) ============ */}
        {activeTab === 'favorites' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-[15px] font-black text-gray-800 dark:text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'نشان‌شده‌ها' : 'Saved Objects'}</span>
                </h2>
                <p className="text-[12.5px] text-gray-400 mt-1.5">
                  {isRtl ? 'آبجکت‌هایی که برای دسترسی سریع نشان کرده‌اید.' : 'Objects you bookmarked for quick access.'}
                </p>
              </div>
              <span className="bg-slate-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 text-[12px] font-bold px-3 py-1.5 rounded-full">
                {favoriteObjects.length} {isRtl ? 'آبجکت' : 'objects'}
              </span>
            </div>

            {favoriteObjects.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title={isRtl ? 'هنوز محصولی را نشان نکرده‌اید' : 'Your saved list is empty'}
                description={isRtl
                  ? 'با لمس آیکون نشان‌کردن روی هر آبجکت، آن را برای دسترسی سریع به این فهرست اضافه کنید.'
                  : 'Tap the bookmark icon on any object to pin it here for quick access.'}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteObjects.map(obj => (
                  <div key={obj.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3 flex flex-col justify-between">
                    <BIMObjectCard
                      object={obj}
                      isSaved={savedObjects.includes(obj.id)}
                      onToggleSave={() => onToggleSave(obj.id)}
                      onClick={() => onSelectObject(obj)}
                      onQuickDownload={(fmt) => onQuickDownload(obj, fmt)}
                      onViewBrand={onViewBrand}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============ HISTORY (تاریخچه دانلودها) ============ */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-[15px] font-black text-gray-800 dark:text-white flex items-center gap-2">
                  <FileDigit className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'تاریخچه دانلودها' : 'Download History'}</span>
                </h2>
                <p className="text-[12.5px] text-gray-400 mt-1.5">
                  {isRtl ? 'فهرست واقعی همهٔ فایل‌هایی که تاکنون دانلود کرده‌اید.' : 'A real log of every file you have downloaded.'}
                </p>
              </div>
              {!currentUser.isPremium && (
                <span className="bg-[#26B6B6]/10 text-[#26B6B6] text-[12px] font-black px-3.5 py-1.5 rounded-full shrink-0">
                  {isRtl ? `امروز: ${todayDownloadsUsed} از ${DAILY_FREE_LIMIT}` : `Today: ${todayDownloadsUsed} of ${DAILY_FREE_LIMIT}`}
                </span>
              )}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder={isRtl ? 'جستجو در عنوان یا برند...' : 'Search file names…'}
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="bg-transparent border-none text-[13px] w-full focus:outline-none focus:ring-0 dark:text-white"
                />
              </div>
              <select
                value={historyFormat}
                onChange={(e) => setHistoryFormat(e.target.value)}
                className="bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-[13px] px-3 py-2.5 rounded-xl focus:outline-none dark:text-white shrink-0"
              >
                <option value="all">{isRtl ? 'همهٔ فرمت‌ها' : 'All formats'}</option>
                <option value="Revit">Revit</option>
                <option value="IFC">IFC</option>
                <option value="ArchiCAD">ArchiCAD</option>
              </select>
            </div>

            {filteredHistory.length === 0 ? (
              <EmptyState
                compact
                icon={Search}
                title={isRtl ? 'موردی مطابق فیلترها یافت نشد' : 'Nothing matches your filters'}
                description={isRtl
                  ? 'عبارت یا فرمت دیگری را امتحان کنید؛ یا پس از دانلود اولین آبجکت به این بخش بازگردید.'
                  : 'Try a different keyword or format — or come back after your first download.'}
              />
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px] text-start">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-gray-950/50 text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                        <th className="p-3.5 text-start">{isRtl ? 'نام آبجکت' : 'BIM Object'}</th>
                        <th className="p-3.5 text-start">{isRtl ? 'برند' : 'Brand'}</th>
                        <th className="p-3.5 text-center">{isRtl ? 'فرمت' : 'Format'}</th>
                        <th className="p-3.5 text-center">{isRtl ? 'حجم' : 'Size'}</th>
                        <th className="p-3.5 text-center">{isRtl ? 'تاریخ' : 'Date'}</th>
                        <th className="p-3.5 text-center">{isRtl ? 'دانلود مجدد' : 'Re-download'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                      {filteredHistory.map(dl => {
                        const title = isRtl ? dl.titleFa : dl.titleEn;
                        return (
                          <tr key={dl.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-950/50 transition-colors">
                            <td className="p-3.5 font-bold text-gray-800 dark:text-white max-w-xs truncate">{title}</td>
                            <td className="p-3.5 text-gray-500 dark:text-gray-400 font-medium">{dl.manufacturerName}</td>
                            <td className="p-3.5 text-center">
                              <span className="bg-[#26B6B6]/10 text-[#26B6B6] text-[11px] px-2 py-1 rounded-lg font-bold font-mono">{dl.format}</span>
                            </td>
                            <td className="p-3.5 text-center font-mono text-gray-400 text-[12px]">{dl.fileSize}</td>
                            <td className="p-3.5 text-center font-mono text-gray-400 text-[12px]">{dl.date}</td>
                            <td className="p-3.5 text-center">
                              <button
                                onClick={() => handleReDownload(dl)}
                                className="bg-[#26B6B6]/10 text-[#26B6B6] hover:bg-[#26B6B6] hover:text-white p-2 rounded-lg transition-all cursor-pointer inline-flex"
                                title={isRtl ? 'دانلود مجدد' : 'Download again'}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ OBJECT REQUEST (درخواست آبجکت جدید — item 20) ============ */}
        {activeTab === 'object-request' && (
          <ObjectRequestForm currentUser={currentUser} onSubmitted={() => { loadMyRequestsCount(); }} />
        )}

        {/* ============ PROJECTS & COLLECTIONS — «به‌زودی» (items 9 & 18) ============ */}
        {activeTab === 'projects-coming' && (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10 text-center space-y-5">
              <div className="w-16 h-16 mx-auto bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-full flex items-center justify-center">
                <Hourglass className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-lg font-black text-gray-800 dark:text-white flex items-center justify-center gap-2">
                  <span>{isRtl ? 'پروژه‌ها و کلکسیون‌ها' : 'Projects & Collections'}</span>
                  <span className="bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md">{isRtl ? 'به‌زودی' : 'Coming soon'}</span>
                </h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {isRtl
                    ? 'به‌زودی می‌توانید آبجکت‌های نشان‌شده را در پروژه‌ها، کلکسیون‌ها و مودبردهای اختصاصی خود سازمان‌دهی کنید و خروجی استعلامی پروژه بگیرید. این بخش در حال آماده‌سازی است و به‌محض فعال‌شدن از طریق اعلان درون‌برنامه‌ای به شما خبر داده می‌شود.'
                    : 'Soon you will be able to organize saved objects into your own projects, collections and moodboards, and export project spec sheets. We will let you know in-app as soon as it launches.'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('favorites')}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-[13px] font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                {isRtl ? 'بازگشت به نشان‌شده‌ها' : 'Back to saved objects'}
              </button>
            </div>
          </div>
        )}

        {/* ============ SUBSCRIPTION (پرداخت و اشتراک — item 16) ============ */}
        {activeTab === 'subscription' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Current plan */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                <div className="space-y-2">
                  <span className="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">{isRtl ? 'طرح فعلی شما' : 'Your current plan'}</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-gray-800 dark:text-white">
                      {currentUser.isPremium ? (isRtl ? 'عضویت ویژه (VIP)' : 'VIP Member') : (isRtl ? 'حساب رایگان' : 'Free Account')}
                    </h2>
                    <span className="bg-[#26B6B6]/10 text-[#26B6B6] text-[11px] font-black px-2.5 py-1 rounded-full">
                      {currentUser.isPremium ? (isRtl ? 'دانلود نامحدود' : 'Unlimited') : (isRtl ? `${DAILY_FREE_LIMIT} دانلود در روز` : `${DAILY_FREE_LIMIT} downloads / day`)}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-gray-400 leading-relaxed">
                    {isRtl ? 'همهٔ آبجکت‌های سایت برای معماران و متخصصین رایگان است.' : 'Every object on the platform is free for architects and BIM professionals.'}
                  </p>
                </div>
              </div>

              {/* Real daily usage */}
              {!currentUser.isPremium && (
                <div className="bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-bold text-gray-600 dark:text-gray-300">{isRtl ? 'مصرف دانلود امروز' : "Today's download usage"}</span>
                    <span className="font-black text-[#26B6B6]">{todayDownloadsUsed} / {DAILY_FREE_LIMIT}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#26B6B6] h-full transition-all" style={{ width: `${Math.min((todayDownloadsUsed / DAILY_FREE_LIMIT) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[11.5px] text-gray-400 flex items-center gap-1.5 font-mono" dir={isRtl ? 'rtl' : 'ltr'}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isRtl ? `سقف روزانه در ${timerString} ساعت دیگر تازه می‌شود` : `Daily limit resets in ${timerString}`}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Honest «به‌زودی» notice for professional features (item 16) */}
            <div className="bg-gradient-to-br from-[#26B6B6]/10 to-[#0F3D5E]/5 border border-[#26B6B6]/20 rounded-2xl p-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-[#26B6B6]/15 text-[#26B6B6] rounded-full flex items-center justify-center">
                <BellRing className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-gray-800 dark:text-white">
                {isRtl ? 'به‌زودی؛ امکانات ویژه برای کاربران حرفه‌ای' : 'Coming soon — exclusive features for professional users'}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                {isRtl
                  ? 'طرح اشتراک حرفه‌ای ایران‌بیم‌هاب — شامل دانلود نامحدود، پوشه‌بندی پروژه‌ها و مودبردها، خروجی استعلامی پروژه و پشتیبانی اولویت‌دار — در حال آماده‌سازی است. جزئیات و قیمت‌گذاری به‌محض نهایی‌شدن از طریق اعلان درون‌برنامه‌ای اطلاع‌رسانی می‌شود.'
                  : 'The IranBIMhub professional plan — unlimited downloads, project folders and moodboards, spec-sheet export and priority support — is on its way. Details and pricing will be announced in-app as soon as they are finalized.'}
              </p>
              <span className="inline-block bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 text-[11px] font-black px-3 py-1.5 rounded-full">
                {isRtl ? 'به‌زودی فعال می‌شود' : 'Launching soon'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** Province chip on the overview board (from the saved profile). */
function selectedProvinceChip(user: any, isRtl: boolean) {
  if (!user?.provinceFa) return null;
  return (
    <span className="bg-white/10 text-gray-200 text-[10.5px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
      <MapPin className="w-3 h-3" />
      <span>{user.provinceFa}{user.cityFa ? `، ${user.cityFa}` : ''}</span>
    </span>
  );
}
