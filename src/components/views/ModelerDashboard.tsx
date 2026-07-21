import React, { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { BIMObject } from '../../types';
import { BIM_OBJECTS } from '../../data';
import { BIMObjectCard } from '../BIMObjectCard';
import { 
  User, 
  Settings, 
  Folder, 
  FolderHeart, 
  Download, 
  Clock, 
  ShieldCheck, 
  FileDigit, 
  LogOut, 
  Menu, 
  X, 
  CreditCard, 
  Layers, 
  CheckCircle, 
  Tag, 
  Bell, 
  Search, 
  ArrowLeft, 
  Trash2, 
  FileSpreadsheet, 
  Calendar, 
  Info, 
  Sparkles,
  ChevronRight,
  Bookmark,
  Building
} from 'lucide-react';

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
  | 'subscription' 
  | 'history' 
  | 'projects' 
  | 'collections' 
  | 'roles-topics' 
  | 'notifications';

export const ModelerDashboard: React.FC<ModelerDashboardProps> = ({
  savedObjects,
  comparedObjects,
  onToggleSave,
  onSelectObject,
  onQuickDownload,
  onLogout,
  onViewBrand
}) => {
  const { language, t, isRtl, formatNumber } = useLanguage();
  const [activeTab, setActiveTab] = useState<DashboardSection>('overview');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for custom event to change active tab from Header
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const tabName = (e as CustomEvent).detail?.tab;
      if (tabName) {
        // Map some tab aliases if needed
        if (tabName === 'collections') {
          setActiveTab('collections');
        } else if (tabName === 'history') {
          setActiveTab('history');
        } else if (tabName === 'profile') {
          setActiveTab('profile');
        } else if (tabName === 'subscription') {
          setActiveTab('subscription');
        } else {
          setActiveTab('overview');
        }
      }
    };
    window.addEventListener('change-dashboard-tab', handleTabChange);
    return () => window.removeEventListener('change-dashboard-tab', handleTabChange);
  }, []);

  // User details & Subscription
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const local = localStorage.getItem('iranbimhub_user_session');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed) {
          if (!parsed.fullName && parsed.name) {
            parsed.fullName = parsed.name;
          }
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing user session:", e);
      }
    }
    return {
      fullName: isRtl ? 'مهندس آرش علوی' : 'Eng. Arash Alavi',
      email: 'arash.alavi@aec-design.ir',
      role: 'Modeler',
      isPremium: false, // Default Free, can upgrade to VIP
      company: isRtl ? 'مهندسین مشاور سازه پایدار' : 'Sazeh Paydar Consulting Engineers',
      title: 'Architect & BIM Lead',
      joinedDate: '۱۴۰۴/۱۰/۱۲',
      phone: '+98 912 456 7890',
      notificationPrefs: { email: true, platform: true, newsletter: false }
    };
  });

  // Daily download tracking (for Free account)
  const [dailyDownloadsRemaining, setDailyDownloadsRemaining] = useState<number>(() => {
    const saved = localStorage.getItem('iranbimhub_modeler_dl_remaining');
    return saved !== null ? parseInt(saved) : 3; // 3 of 5 remaining
  });
  const [timerString, setTimerString] = useState('16:42:05');

  // Simulated countdown timer for download limit reset
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = 23 - now.getHours();
      const minutes = 59 - now.getMinutes();
      const seconds = 59 - now.getSeconds();
      const pad = (n: number) => String(n).padStart(2, '0');
      setTimerString(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save remaining downloads to local storage
  useEffect(() => {
    localStorage.setItem('iranbimhub_modeler_dl_remaining', String(dailyDownloadsRemaining));
  }, [dailyDownloadsRemaining]);

  // Project Folders State
  const [folders, setFolders] = useState<{ id: string; name: string; desc: string; objectIds: string[]; dateCreated: string }[]>(() => {
    const local = localStorage.getItem('iranbimhub_user_folders_v2');
    return local ? JSON.parse(local) : [
      { 
        id: 'f1', 
        name: isRtl ? 'پروژه فاز دو هتل مسکونی شیراز' : 'Shiraz Residential Hotel Phase 2', 
        desc: isRtl ? 'نقشه‌های اجرایی و جزئیات نازک‌کاری بخش اقامتی' : 'Detail specs & architectural window units',
        objectIds: ['obj1'], 
        dateCreated: '۱۴۰۵/۰۲/۱۵' 
      },
      { 
        id: 'f2', 
        name: isRtl ? 'بیمارستان تخصصی ۲۰۰ تخت‌خوابی کرج' : 'Karaj Specialty Hospital', 
        desc: isRtl ? 'مدل‌سازی موتورخانه و سیستم‌های تبرید مرکزی' : 'Boiler plant and MEP mechanical layout',
        objectIds: ['obj2'], 
        dateCreated: '۱۴۰۵/۰۳/۱۰' 
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_user_folders_v2', JSON.stringify(folders));
  }, [folders]);

  // Selected folder in active view
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  // Custom Collections (Freeform shortlists, VIP exclusive)
  const [collections, setCollections] = useState<{ id: string; name: string; objectIds: string[] }[]>(() => {
    const local = localStorage.getItem('iranbimhub_user_collections');
    return local ? JSON.parse(local) : [
      { id: 'c1', name: isRtl ? 'شورت‌لیست شیرآلات لوکس' : 'Luxury Faucets Shortlist', objectIds: [] },
      { id: 'c2', name: isRtl ? 'تجهیزات معماری پایدار' : 'Green Materials Moodboard', objectIds: [] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_user_collections', JSON.stringify(collections));
  }, [collections]);

  const [newCollectionName, setNewCollectionName] = useState('');

  // Professional Roles & Topics
  const [selectedRoles, setSelectedRoles] = useState<string[]>(() => {
    if (currentUser?.selectedRoles && Array.isArray(currentUser.selectedRoles)) {
      return currentUser.selectedRoles;
    }
    return ['Architect', 'MEP Engineer'];
  });
  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
    if (currentUser?.selectedTopics && Array.isArray(currentUser.selectedTopics)) {
      return currentUser.selectedTopics;
    }
    return ['HVAC', 'Facades', 'Sustainable Materials'];
  });

  // Download History Log
  const [downloadHistory, setDownloadHistory] = useState<any[]>(() => {
    const local = localStorage.getItem('iranbimhub_dl_history_v2');
    return local ? JSON.parse(local) : [
      {
        id: 'dl-1',
        objectId: 'obj1',
        titleFa: 'پنجره دوجداره آلومینیومی ترمال‌بریک سری آلو-۹۰',
        titleEn: 'Thermal-Break Aluminum Double Glazed Window - Alu-90 Series',
        format: 'Revit',
        fileSize: '14.2 MB',
        date: '۱۴۰۵/۰۴/۰۹',
        manufacturerName: 'Alupan Co.'
      },
      {
        id: 'dl-2',
        objectId: 'obj2',
        titleFa: 'پکیج دیواری چگالشی دیجیتال پارما ۲۴',
        titleEn: 'Parma 24 Condensing Wall Boiler',
        format: 'IFC',
        fileSize: '22.8 MB',
        date: '۱۴۰۵/۰۴/۰۱',
        manufacturerName: 'Butane Group'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('iranbimhub_dl_history_v2', JSON.stringify(downloadHistory));
  }, [downloadHistory]);

  // Search & Filters inside lists
  const [historySearch, setHistorySearch] = useState('');
  const [historyFormat, setHistoryFormat] = useState('all');

  // Platform notifications list
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: isRtl ? 'به‌روزرسانی موفق کاتالوگ آلوپن' : 'Alupan Catalog Updated',
      body: isRtl ? 'مستندات و فایلهای Revit آبجکت پنجره آلو-۹۰ به نسخه ۲۰۲۶ آپدیت شد.' : 'Revit 2026 family file has been uploaded for Alu-90.',
      time: isRtl ? '۲ ساعت پیش' : '2 hours ago',
      read: false
    },
    {
      id: 'n-2',
      title: isRtl ? 'باقیمانده ترافیک دانلود روزانه' : 'Daily Download Limit Reminder',
      body: isRtl ? 'شما ۲ دانلود از ۵ دانلود روزانه خود را انجام داده‌اید. هم‌اکنون می‌توانید به VIP ارتقا دهید.' : 'You have completed 2 of your 5 daily downloads. Upgrade to VIP for unlimited access.',
      time: isRtl ? '۱ روز پیش' : '1 day ago',
      read: true
    }
  ]);

  // Profile Form States
  const [profileName, setProfileName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profileCompany, setProfileCompany] = useState(currentUser.company || '');
  const [profileTitle, setProfileTitle] = useState(currentUser.title || '');
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');

  // Handle premium upgrade
  const handleUpgradeToVIP = () => {
    if ((window as any).onNavigateToView) {
      (window as any).onNavigateToView('payment', 'modeler-vip');
    }
  };

  const handleDowngrade = () => {
    const updated = { ...currentUser, isPremium: false };
    setCurrentUser(updated);
    localStorage.setItem('iranbimhub_user_session', JSON.stringify(updated));
    alert(isRtl ? 'حساب شما با موفقیت به نسخه رایگان برگردانده شد.' : 'Account downgraded to Free tier.');
  };

  // Quick download implementation with daily limits
  const handleReDownload = (dlEntry: any) => {
    if (!currentUser.isPremium && dailyDownloadsRemaining <= 0) {
      alert(isRtl 
        ? 'خطا: سقف دانلود روزانه شما (۵ عدد) به پایان رسیده است. لطفاً برای دانلود نامحدود به VIP ارتقا دهید.' 
        : 'Error: You have reached your limit of 5 downloads per day. Please upgrade to VIP for unlimited access.'
      );
      setActiveTab('subscription');
      return;
    }

    if (!currentUser.isPremium) {
      setDailyDownloadsRemaining(prev => Math.max(0, prev - 1));
    }

    alert(isRtl 
      ? `در حال دانلود مجدد فایل ${dlEntry.format} محصول...` 
      : `Starting download of ${dlEntry.format} product file...`
    );

    // Append to history log
    const newLog = {
      id: `dl-${Math.random().toString(36).substring(2, 9)}`,
      objectId: dlEntry.objectId,
      titleFa: dlEntry.titleFa,
      titleEn: dlEntry.titleEn,
      format: dlEntry.format,
      fileSize: dlEntry.fileSize,
      date: isRtl ? '۱۴۰۵/۰۴/۰۱' : '2026-07-01',
      manufacturerName: dlEntry.manufacturerName
    };
    setDownloadHistory(prev => [newLog, ...prev]);
  };

  // Add folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.isPremium) {
      alert(isRtl 
        ? 'قابلیت ایجاد پوشه اختصاصی پروژه مختص اعضای VIP است!' 
        : 'Creating custom project folders is a VIP-only feature!'
      );
      setActiveTab('subscription');
      return;
    }
    if (!newFolderName.trim()) return;

    const newFolder = {
      id: `folder-${Math.random().toString(36).substring(2, 7)}`,
      name: newFolderName,
      desc: newFolderDesc || (isRtl ? 'بدون توضیحات' : 'No description'),
      objectIds: [],
      dateCreated: isRtl ? '۱۴۰۵/۰۴/۰۱' : '2026-07-01'
    };

    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setNewFolderDesc('');
    alert(isRtl ? 'پوشه پروژه با موفقیت ایجاد شد.' : 'Project folder created successfully.');
  };

  // Add collection
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.isPremium) {
      alert(isRtl 
        ? 'قابلیت ایجاد مجموعه‌های دلخواه مختص اعضای VIP است!' 
        : 'Creating custom collections is a VIP-only feature!'
      );
      setActiveTab('subscription');
      return;
    }
    if (!newCollectionName.trim()) return;

    const newColl = {
      id: `coll-${Math.random().toString(36).substring(2, 7)}`,
      name: newCollectionName,
      objectIds: []
    };

    setCollections(prev => [...prev, newColl]);
    setNewCollectionName('');
    alert(isRtl ? 'کلکسیون جدید با موفقیت ایجاد شد.' : 'Collection created successfully.');
  };

  // Remove folder
  const handleDeleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    if (activeFolderId === id) setActiveFolderId(null);
  };

  // Add BIM Object to folder
  const handleAddObjectToFolder = (folderId: string, objId: string) => {
    if (!currentUser.isPremium) {
      alert(isRtl ? 'پوشه‌بندی پروژه‌ها مختص کاربران ویژه است.' : 'Project organization is for VIP users.');
      setActiveTab('subscription');
      return;
    }
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        if (f.objectIds.includes(objId)) return f;
        return { ...f, objectIds: [...f.objectIds, objId] };
      }
      return f;
    }));
  };

  // Add BIM Object to Collection
  const handleAddObjectToCollection = (collId: string, objId: string) => {
    if (!currentUser.isPremium) {
      alert(isRtl ? 'دسته‌بندی کلکسیونی مختص کاربران ویژه است.' : 'Collection categorization is for VIP users.');
      setActiveTab('subscription');
      return;
    }
    setCollections(prev => prev.map(c => {
      if (c.id === collId) {
        if (c.objectIds.includes(objId)) return c;
        return { ...c, objectIds: [...c.objectIds, objId] };
      }
      return c;
    }));
  };

  // Export Project Specs
  const handleExportSpecs = (folder: any) => {
    const list = BIM_OBJECTS.filter(o => folder.objectIds.includes(o.id));
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Title,Category,LOD,Formats\n";
    list.forEach(o => {
      csvContent += `"${o.id}","${isRtl ? o.titleFa : o.titleEn}","${o.category}","${o.lod}","${o.formats.join(' | ')}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BIM_Specs_${folder.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recommendation logic based on selected topics & roles
  const recommendedObjects = useMemo(() => {
    return BIM_OBJECTS.filter(obj => {
      // Basic recommendation rules
      if (selectedTopics.includes('HVAC') && obj.category === 'hvac') return true;
      if (selectedTopics.includes('Facades') && obj.category === 'doors_windows') return true;
      if (selectedTopics.includes('Sustainable Materials') && obj.certification.includes('BHRC')) return true;
      return false;
    }).slice(0, 3);
  }, [selectedTopics]);

  // Filtered Download History
  const filteredHistory = useMemo(() => {
    return downloadHistory.filter(dl => {
      const title = isRtl ? dl.titleFa : dl.titleEn;
      const matchesSearch = title.toLowerCase().includes(historySearch.toLowerCase()) || 
                            dl.manufacturerName.toLowerCase().includes(historySearch.toLowerCase());
      const matchesFormat = historyFormat === 'all' || dl.format === historyFormat;
      return matchesSearch && matchesFormat;
    });
  }, [downloadHistory, historySearch, historyFormat, isRtl]);

  // Favorites list
  const favoriteObjects = BIM_OBJECTS.filter(obj => savedObjects.includes(obj.id));

  // Save profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      fullName: profileName,
      email: profileEmail,
      company: profileCompany,
      title: profileTitle,
      phone: profilePhone
    };
    setCurrentUser(updated);
    localStorage.setItem('iranbimhub_user_session', JSON.stringify(updated));
    alert(isRtl ? 'تنظیمات پروفایل با موفقیت ذخیره گردید.' : 'Profile settings saved successfully.');
  };

  const handleToggleNotification = (key: string) => {
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        notificationPrefs: {
          ...prev.notificationPrefs,
          [key]: !prev.notificationPrefs[key]
        }
      };
      localStorage.setItem('iranbimhub_user_session', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-gray-950 flex flex-col md:flex-row font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Mobile Top Navigation & Drawer Trigger */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpenMobile(true)}
            className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xs font-bold text-gray-800 dark:text-white">
            {isRtl ? 'میز کار طراحان ایران‌بیم‌هاب' : 'IranBIMhub Modeler Panel'}
          </span>
        </div>
        
        {/* Tier badge on mobile */}
        <div className="flex items-center gap-1.5">
          {currentUser.isPremium ? (
            <span className="bg-[#26B6B6] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
              <Sparkles className="w-2.5 h-2.5" />
              <span>VIP</span>
            </span>
          ) : (
            <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
              {isRtl ? 'رایگان' : 'Free'}
            </span>
          )}
        </div>
      </div>

      {/* Slide-over Off-canvas Mobile Sidebar (Drawer) */}
      {isSidebarOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsSidebarOpenMobile(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          {/* Drawer menu */}
          <div className="relative w-72 h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-10 p-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#26B6B6]/10 text-[#26B6B6] rounded-full flex items-center justify-center font-extrabold text-sm">
                  {(currentUser?.fullName || currentUser?.name || 'U').charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white">{currentUser?.fullName || currentUser?.name || ''}</h4>
                  <p className="text-[10px] text-gray-400">{currentUser?.title || ''}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpenMobile(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {/* Upgrade Banner for Free Users */}
              {!currentUser.isPremium && (
                <div className="bg-gradient-to-br from-[#26B6B6]/10 to-[#1e9494]/5 border border-[#26B6B6]/20 p-3 rounded-xl mb-3">
                  <div className="flex items-center gap-1 text-[#26B6B6] font-bold text-xs mb-1">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{isRtl ? 'ارتقای اکانت به VIP' : 'Upgrade to VIP'}</span>
                  </div>
                  <p className="text-[9.5px] text-gray-500 leading-relaxed mb-2">
                    {isRtl ? 'پوشه پروژه اختصاصی، دانلود نامحدود و مرتب‌سازی پیشرفته.' : 'Unlock unlimited files, folder filing and custom collections.'}
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab('subscription');
                      setIsSidebarOpenMobile(false);
                    }}
                    className="w-full bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[10px] font-bold py-1.5 rounded-lg cursor-pointer transition-colors text-center"
                  >
                    👑 {isRtl ? 'عضویت ویژه' : 'Upgrade now'}
                  </button>
                </div>
              )}

              {/* Navigation Items */}
              <ModelerSidebarNav 
                activeTab={activeTab} 
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setIsSidebarOpenMobile(false);
                }} 
                isRtl={isRtl}
                t={t}
                isPremium={currentUser.isPremium}
              />
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{isRtl ? 'خروج از حساب' : 'Log Out'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent / Collapsible Sidebar */}
      <div className={`hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-l border-gray-100 dark:border-gray-800 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#26B6B6] text-white rounded-lg flex items-center justify-center font-black text-sm">
                B
              </div>
              <span className="font-extrabold text-xs tracking-tight text-gray-800 dark:text-white uppercase">
                {isRtl ? 'میز کار طراحان' : 'Modeler Hub'}
              </span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg cursor-pointer mx-auto"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop User profile detail */}
        {!isSidebarCollapsed && (
          <div className="p-4 mx-3 my-4 bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-800/50 rounded-xl space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#26B6B6]/10 text-[#26B6B6] rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {(currentUser?.fullName || currentUser?.name || 'U').charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-gray-800 dark:text-white truncate">{currentUser?.fullName || currentUser?.name || ''}</h4>
                <p className="text-[9px] text-gray-400 truncate">{currentUser?.title || ''}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-gray-200/50 dark:border-gray-800">
              <span className="text-gray-400">{isRtl ? 'نوع عضویت:' : 'Plan:'}</span>
              {currentUser.isPremium ? (
                <span className="text-[#26B6B6] font-bold flex items-center gap-0.5">
                  👑 VIP
                </span>
              ) : (
                <span className="text-gray-500 font-bold">{isRtl ? 'رایگان' : 'Free'}</span>
              )}
            </div>

            {/* Daily Download Progress for Free users */}
            {!currentUser.isPremium && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[9px]">
                  <span className="text-gray-400">{isRtl ? 'دانلود امروز:' : 'Downloads remaining:'}</span>
                  <span className="font-bold text-[#26B6B6]">{dailyDownloadsRemaining} / 5</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#26B6B6] h-full transition-all" 
                    style={{ width: `${(dailyDownloadsRemaining / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sidebar Nav links */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <ModelerSidebarNav 
            activeTab={activeTab} 
            onSelectTab={setActiveTab} 
            isRtl={isRtl}
            t={t}
            isPremium={currentUser.isPremium}
            collapsed={isSidebarCollapsed}
          />
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2.5 py-2.5 bg-rose-50 dark:bg-rose-950/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSidebarCollapsed ? 'justify-center' : 'px-3'}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>{isRtl ? 'خروج از حساب' : 'Log Out'}</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Render different panels based on Active Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Stat Board */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-950 text-white rounded-2xl p-6 relative overflow-hidden shadow-xs border border-white/5">
              {/* Subtle design element */}
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(#26B6B6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {currentUser.isPremium ? (
                      <span className="bg-[#26B6B6] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        👑 VIP MEMBER
                      </span>
                    ) : (
                      <span className="bg-gray-800 text-gray-300 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {isRtl ? 'کاربر عادی' : 'Free Plan'}
                      </span>
                    )}
                    <span className="text-[#26B6B6] text-xs font-semibold">{isRtl ? 'عضویت فعال در سیستم' : 'Active AEC Node'}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
                    {isRtl ? `خوش‌آمدید، ${currentUser?.fullName || currentUser?.name || ''}` : `Welcome back, ${currentUser?.fullName || currentUser?.name || ''}`}
                  </h1>
                  <p className="text-xs text-gray-400">
                    {isRtl 
                      ? 'مدیریت خانواده‌های نشان‌شده، پروژه‌های ساختمانی فعال و سوابق استعلام فایل بیم' 
                      : 'Organize architectural components, manage custom spec lists, and track BIM records'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 font-mono">
                  {/* Download Counter Card */}
                  {!currentUser.isPremium ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center shrink-0 min-w-32">
                      <span className="block text-lg font-bold text-[#26B6B6]">{dailyDownloadsRemaining} / 5</span>
                      <span className="text-[8.5px] uppercase text-gray-400 tracking-wider">
                        {isRtl ? 'دانلود مانده امروز' : 'Today\'s limit'}
                      </span>
                      <div className="text-[7.5px] text-rose-400 mt-1 flex items-center justify-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{isRtl ? `ریست در ${timerString}` : `Reset: ${timerString}`}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#26B6B6]/10 border border-[#26B6B6]/20 rounded-xl p-3 text-center shrink-0 min-w-32">
                      <span className="block text-lg font-bold text-[#26B6B6]">∞</span>
                      <span className="text-[8.5px] uppercase text-[#26B6B6] tracking-wider font-bold">
                        {isRtl ? 'دانلود نامحدود' : 'Unlimited downloads'}
                      </span>
                    </div>
                  )}

                  {/* Saved stats */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center shrink-0 min-w-24">
                    <span className="block text-lg font-bold text-white">{favoriteObjects.length}</span>
                    <span className="text-[8.5px] uppercase text-gray-400 tracking-wider">{isRtl ? 'نشان‌شده‌ها' : 'Saved'}</span>
                  </div>

                  {/* Folders count */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center shrink-0 min-w-24">
                    <span className="block text-lg font-bold text-white">{folders.length}</span>
                    <span className="text-[8.5px] uppercase text-gray-400 tracking-wider">{isRtl ? 'پروژه‌ها' : 'Projects'}</span>
                  </div>
                </div>
              </div>
            </div>



            {/* Widget Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recommended For You Section */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'پیشنهادهای هوشمند بر اساس علایق شما' : 'Personalized Recommendations'}</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('roles-topics')} 
                    className="text-[11px] text-[#26B6B6] hover:underline"
                  >
                    {isRtl ? 'اصلاح علایق' : 'Configure Topics'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedObjects.map(obj => (
                    <div 
                      key={obj.id} 
                      onClick={() => onSelectObject(obj)}
                      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex gap-3 hover:border-[#26B6B6]/50 transition-all cursor-pointer group"
                    >
                      <img 
                        src={obj.imageUrl} 
                        alt={obj.titleEn} 
                        className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-50"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[11.5px] font-bold text-gray-800 dark:text-white truncate group-hover:text-[#26B6B6] transition-colors">
                            {isRtl ? obj.titleFa : obj.titleEn}
                          </h4>
                          <span className="text-[9.5px] text-gray-400 font-mono block mt-0.5">{obj.lod}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#26B6B6] font-semibold">{obj.priceType}</span>
                          <span className="text-gray-400 font-mono">{obj.fileSize}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick links to Active Projects */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'پروژه‌های فعال من' : 'Active Projects'}</span>
                  </h3>
                  {currentUser.isPremium && (
                    <button 
                      onClick={() => setActiveTab('projects')} 
                      className="text-[11px] text-[#26B6B6] hover:underline"
                    >
                      {isRtl ? 'مدیریت همه' : 'Manage'}
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {folders.slice(0, 3).map(f => (
                    <div 
                      key={f.id}
                      onClick={() => {
                        if (currentUser.isPremium) {
                          setActiveFolderId(f.id);
                          setActiveTab('projects');
                        } else {
                          alert(isRtl ? 'پروژه‌های پیشرفته مخصوص اعضای ویژه است.' : 'Custom folders is a premium feature.');
                          setActiveTab('subscription');
                        }
                      }}
                      className="p-3 bg-slate-50 dark:bg-gray-950 hover:bg-slate-100 dark:hover:bg-gray-800 border border-slate-100 dark:border-gray-800/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="block text-[11.5px] font-bold text-gray-800 dark:text-white truncate">{f.name}</span>
                        <span className="text-[9px] text-gray-400 mt-0.5 block">{f.dateCreated}</span>
                      </div>
                      <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {f.objectIds.length} {isRtl ? 'آبجکت' : 'Files'}
                      </span>
                    </div>
                  ))}
                </div>

                {!currentUser.isPremium && (
                  <div className="text-center p-3 bg-rose-500/5 border border-dashed border-rose-500/10 rounded-xl text-[10px] text-rose-500 font-semibold">
                    🔑 {isRtl ? 'برای بازگشایی پروژه‌های بیشتر اکانت خود را ارتقا دهید' : 'Upgrade to write custom folders'}
                  </div>
                )}
              </div>
            </div>

            {/* Recently Downloaded List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#26B6B6]" />
                <span>{isRtl ? 'فایل‌هایی که اخیراً دانلود کرده‌اید' : 'Recently Downloaded Objects'}</span>
              </h3>

              {downloadHistory.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-dashed border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
                  {isRtl ? 'هنوز هیچ فایلی دانلود نکرده‌اید.' : 'No downloaded files found.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {downloadHistory.slice(0, 3).map(dl => (
                    <div 
                      key={dl.id}
                      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="bg-slate-100 dark:bg-gray-800 font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">
                            {dl.format}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono">{dl.date}</span>
                        </div>
                        <h4 className="text-[12px] font-extrabold text-gray-800 dark:text-white mt-2 leading-snug line-clamp-2">
                          {isRtl ? dl.titleFa : dl.titleEn}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-1">{dl.manufacturerName}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800/60">
                        <span className="text-[10px] text-gray-400 font-mono">{dl.fileSize}</span>
                        <button 
                          onClick={() => handleReDownload(dl)}
                          className="text-[#26B6B6] hover:text-white hover:bg-[#26B6B6] p-1 rounded-lg border border-[#26B6B6]/20 transition-all cursor-pointer"
                          title="Download again"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <Settings className="w-5 h-5 text-[#26B6B6]" />
                <span>{isRtl ? 'تنظیمات حساب کاربری طراح' : 'Modeler Profile Settings'}</span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                {isRtl ? 'اطلاعات حقوقی و صنفی خود را برای بهبود دسترسی به استعلام شرکت‌های تولیدی مدیریت کنید.' : 'Update your personal details, professional role, and contact defaults.'}
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase block">{isRtl ? 'نام و نام خانوادگی' : 'Full Name'}</label>
                <input 
                  type="text" 
                  required
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase block">{isRtl ? 'آدرس ایمیل' : 'Email Address'}</label>
                <input 
                  type="email" 
                  required
                  value={profileEmail} 
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase block">{isRtl ? 'نام شرکت / دفتر مهندسی' : 'Company / Studio Name'}</label>
                <input 
                  type="text" 
                  value={profileCompany} 
                  onChange={(e) => setProfileCompany(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase block">{isRtl ? 'عنوان یا سمت شغلی' : 'Professional Title'}</label>
                <input 
                  type="text" 
                  value={profileTitle} 
                  onChange={(e) => setProfileTitle(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6]"
                />
              </div>

              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase block">{isRtl ? 'تلفن همراه (مخصوص فاکتور و اطلاع‌رسانی)' : 'Phone Number'}</label>
                <input 
                  type="text" 
                  value={profilePhone} 
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#26B6B6] font-mono"
                />
              </div>

              {/* Notification Prefs */}
              <div className="col-span-1 md:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200">{isRtl ? 'تنظیمات اطلاع‌رسانی' : 'Notification Preferences'}</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={currentUser.notificationPrefs?.email}
                      onChange={() => handleToggleNotification('email')}
                      className="accent-[#26B6B6]" 
                    />
                    <span>{isRtl ? 'ارسال فاکتورها و جزئیات ارتقای اکانت به ایمیل' : 'Send receipt invoice and VIP renewal alerts to email'}</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={currentUser.notificationPrefs?.platform}
                      onChange={() => handleToggleNotification('platform')}
                      className="accent-[#26B6B6]" 
                    />
                    <span>{isRtl ? 'اعلام درون‌برنامه‌ای به محض آپدیت شدن خانواده‌های بیم نشان‌شده' : 'In-app warning when one of my favorited BIM units is refreshed'}</span>
                  </label>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                  type="submit" 
                  className="bg-[#26B6B6] hover:bg-[#1e9494] text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer shadow-sm transition-colors"
                >
                  {isRtl ? 'ذخیره نهایی تغییرات' : 'Save Profile Changes'}
                </button>
              </div>
            </form>

            {/* LINK / REGISTER MANUFACTURER BRAND ACCOUNT OPTION */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
              <div className="bg-slate-50/50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 space-y-4 max-w-xl text-start">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-[#26B6B6]/10 text-[#26B6B6] rounded-xl flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-white">
                      {isRtl ? 'آیا شما نیز تولیدکننده یا تامین‌کننده مصالح و تجهیزات ساختمانی هستید؟' : 'Do you also produce or supply building materials / equipment?'}
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      {isRtl 
                        ? 'یک صفحه تجاری کاتالوگ و نمایه برند برای شرکت یا کارخانه خود ثبت کنید. محصولات خود را در قالب آبجکت‌های بیم جهت استفاده مهندسان آپلود کنید و آمارهای زنده دانلود قطعات را پیگیری نمایید.' 
                        : 'Register an official manufacturer/brand profile under your same login to upload and organize BIM product families for Iranian AEC modelers.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      const brandName = prompt(
                        isRtl 
                          ? 'لطفاً نام رسمی برند یا کارخانه تولیدی خود را وارد نمایید:' 
                          : 'Please enter your official brand/factory name:'
                      );
                      if (!brandName || !brandName.trim()) {
                        alert(isRtl ? 'نام برند نمی‌تواند خالی باشد.' : 'Brand name cannot be empty.');
                        return;
                      }

                      // Seed manufacturer profile
                      const mfgProfile = {
                        companyName: brandName,
                        desc: isRtl 
                          ? `تولیدکننده رسمی مصالح و تجهیزات ساختمانی ${brandName}. کاتالوگ کات‌شیت و فایل‌های سه بعدی.` 
                          : `${brandName} official brand catalog and BIM resource directory page.`,
                        website: `https://${brandName.toLowerCase().replace(/\s+/g, '') || 'brand'}.ir`,
                        phone: currentUser?.phone || '09121112233',
                        tier: 'Standard',
                        companyType: 'Manufacturer / Producer',
                        isPendingVerification: true,
                        licenseFile: 'uploaded_license.pdf'
                      };

                      localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(mfgProfile));
                      alert(isRtl 
                        ? `حساب کاربری برند "${brandName}" با موفقیت ایجاد و پیوند شد! اکنون می‌توانید از طریق دکمه‌های سوئیچر بالا بین پنل طراح و تولیدکننده جابجا شوید.` 
                        : `Brand account "${brandName}" registered and linked successfully! Switch views anytime via the header toggle.`
                      );
                      window.location.reload();
                    }}
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-[#26B6B6]/10 hover:text-[#26B6B6] text-gray-700 dark:text-gray-200 text-[11px] font-bold px-4 py-2 rounded-xl transition-all border border-transparent hover:border-[#26B6B6]/30 cursor-pointer"
                  >
                    {isRtl ? 'ثبت‌نام و ایجاد حساب کاربری تولیدکننده جدید' : 'Register & Create Brand Manufacturer Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBSCRIPTION PLAN TAB */}
        {activeTab === 'subscription' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Current Plan Overview */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">{isRtl ? 'طرح اشتراک شما' : 'Active Account Tier'}</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-800 dark:text-white">
                    {currentUser.isPremium ? (isRtl ? 'عضو طلایی (VIP)' : 'VIP Gold Member') : (isRtl ? 'حساب طراح رایگان' : 'Free Modeler Account')}
                  </h2>
                  <span className="bg-[#26B6B6]/10 text-[#26B6B6] text-[9.5px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    {currentUser.isPremium ? 'Unlimited' : '5 DLs / day'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {currentUser.isPremium 
                    ? (isRtl ? 'شما دسترسی نامحدود به کاتالوگ بیم ایران‌بیم‌هاب دارید.' : 'You enjoy unlimited files download, advanced organization and priorities.') 
                    : (isRtl ? 'محدود به ۵ فایل در روز. ارتقا دهید تا پوشه‌ها قفل‌گشایی شوند.' : 'Limited to 5 component downloads a day. Upgrade to unlock all limits.')}
                </p>
              </div>

              {currentUser.isPremium ? (
                <button 
                  onClick={handleDowngrade}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isRtl ? 'بازگشت به اکانت رایگان' : 'Cancel VIP Membership'}
                </button>
              ) : (
                <button 
                  onClick={handleUpgradeToVIP}
                  className="bg-gradient-to-r from-[#26B6B6] to-emerald-600 hover:from-[#1e9494] text-white px-6 py-3 rounded-xl text-xs font-black shadow-md cursor-pointer transition-transform transform active:scale-95"
                >
                  👑 {isRtl ? 'ارتقای اکانت به ویژه (۹۹ تومان در ماه)' : 'Upgrade to VIP (99K Tomans/Mo)'}
                </button>
              )}
            </div>

            {/* Comparison Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">{isRtl ? 'مقایسه ویژگی‌ها و مزایای حساب‌ها' : 'Compare Subscription Tiers'}</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400">
                      <th className="p-3 text-start font-bold">{isRtl ? 'خدمات و امکانات' : 'Feature Checklist'}</th>
                      <th className="p-3 text-center font-bold bg-slate-50/50 dark:bg-gray-950/50">{isRtl ? 'رایگان' : 'Free Modeler'}</th>
                      <th className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? 'عضویت ویژه VIP' : 'VIP Member'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'محدودیت دانلود روزانه' : 'Daily download allowance'}</td>
                      <td className="p-3 text-center bg-slate-50/50 dark:bg-gray-950/50">{isRtl ? '۵ فایل' : '5 files max'}</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">👑 {isRtl ? 'نامحدود (بای‌پس کامل)' : 'Unlimited'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'سازماندهی پروژه‌ها در پوشه‌ها' : 'Custom Project Folders'}</td>
                      <td className="p-3 text-center text-gray-300 dark:text-gray-600 bg-slate-50/50 dark:bg-gray-950/50">✕</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">✓ {isRtl ? 'پروژه‌های نامحدود' : 'Unlimited Folders'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'مجموعه‌ها و مودبردهای آزاد' : 'Freeform Collections'}</td>
                      <td className="p-3 text-center text-gray-300 dark:text-gray-600 bg-slate-50/50 dark:bg-gray-950/50">✕</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">✓ {isRtl ? 'فعال' : 'Unlocked'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'فیلتر نشان‌شده‌ها بر اساس دسته‌بندی' : 'Filter favorites by Category'}</td>
                      <td className="p-3 text-center text-gray-300 dark:text-gray-600 bg-slate-50/50 dark:bg-gray-950/50">✕</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">✓ {isRtl ? 'فعال' : 'Fully supported'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'پشتیبانی فنی اولویت‌دار' : 'Priority SLA Support Ticket'}</td>
                      <td className="p-3 text-center text-gray-300 dark:text-gray-600 bg-slate-50/50 dark:bg-gray-950/50">✕</td>
                      <td className="p-3 text-center font-bold text-[#26B6B6] bg-[#26B6B6]/5">✓ {isRtl ? 'پشتیبانی ۲۴ ساعته' : 'Dedicated Ticket Channel'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">{isRtl ? 'قیمت ماهیانه' : 'Monthly cost'}</td>
                      <td className="p-3 text-center bg-slate-50/50 dark:bg-gray-950/50">{isRtl ? 'رایگان' : 'Free'}</td>
                      <td className="p-3 text-center font-extrabold text-[#26B6B6] bg-[#26B6B6]/5">{isRtl ? '۹۹ هزار تومان' : '99,000 Tomans'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice billing history simulator */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">{isRtl ? 'تاریخچه پرداخت‌ها و فاکتورها' : 'Billing History'}</h3>
              
              {currentUser.isPremium ? (
                <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-950 p-3 flex justify-between text-[11px] font-bold text-gray-500 border-b border-gray-100 dark:border-gray-800">
                    <span>{isRtl ? 'توضیحات تراکنش' : 'Invoice details'}</span>
                    <span>{isRtl ? 'تاریخ پرداخت' : 'Date'}</span>
                    <span>{isRtl ? 'مبلغ' : 'Amount'}</span>
                    <span>{isRtl ? 'وضعیت' : 'Status'}</span>
                  </div>
                  <div className="p-3 flex justify-between text-xs text-gray-600 dark:text-gray-300 items-center">
                    <span className="font-semibold">{isRtl ? 'تمدید اشتراک یک ماهه طلایی' : '1 Month VIP Gold Renewal'}</span>
                    <span className="font-mono text-[10.5px]">۱۴۰۵/۰۳/۱۲</span>
                    <span className="font-mono">{formatNumber(99000)} {isRtl ? 'تومان' : 'Tomans'}</span>
                    <span className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 font-bold text-[9px] px-2 py-0.5 rounded-full">✓ Paid</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">{isRtl ? 'تراکنشی جهت نمایش وجود ندارد.' : 'No invoices found for this free account.'}</p>
              )}
            </div>
          </div>
        )}

        {/* DOWNLOAD HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header info */}
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <FileDigit className="w-5 h-5 text-[#26B6B6]" />
                <span>{isRtl ? 'تاریخچه تفصیلی فایل‌های دانلود شده' : 'Detailed Download Log'}</span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                {isRtl ? 'گزارش مکتوب و فیلترپذیر تمام لایبری‌های بیم کاتالوگ که دانلود کرده‌اید.' : 'Filter and search your previously pulled parametric blocks.'}
              </p>
            </div>

            {/* Filter Search controls */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder={isRtl ? 'جستجو در عنوان یا برند...' : 'Search inside file names...'}
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0 dark:text-white"
                />
              </div>

              <select
                value={historyFormat}
                onChange={(e) => setHistoryFormat(e.target.value)}
                className="bg-slate-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-xs px-3 py-2 rounded-xl focus:outline-none dark:text-white shrink-0"
              >
                <option value="all">{isRtl ? 'همه فرمت‌ها' : 'All Formats'}</option>
                <option value="Revit">Revit</option>
                <option value="IFC">IFC</option>
                <option value="ArchiCAD">ArchiCAD</option>
              </select>
            </div>

            {/* History Table */}
            {filteredHistory.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-12 border border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
                {isRtl ? 'موردی یافت نشد.' : 'No download entries match your filters.'}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-gray-950/50 text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                        <th className="p-3 text-start">{isRtl ? 'نام آبجکت بیم' : 'BIM Element'}</th>
                        <th className="p-3 text-start">{isRtl ? 'برند سازنده' : 'Brand'}</th>
                        <th className="p-3 text-center">{isRtl ? 'فرمت' : 'Format'}</th>
                        <th className="p-3 text-center">{isRtl ? 'سایز فایل' : 'File Size'}</th>
                        <th className="p-3 text-center">{isRtl ? 'تاریخ دانلود' : 'Date'}</th>
                        <th className="p-3 text-center">{isRtl ? 'پروژه / کلکسیون' : 'File into Project'}</th>
                        <th className="p-3 text-center">{isRtl ? 'دانلود مجدد' : 'Pull Again'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                      {filteredHistory.map(dl => {
                        const title = isRtl ? dl.titleFa : dl.titleEn;
                        return (
                          <tr key={dl.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-950/50 transition-colors">
                            <td className="p-3 font-bold text-gray-800 dark:text-white max-w-xs truncate">{title}</td>
                            <td className="p-3 text-gray-500 dark:text-gray-400 font-medium">{dl.manufacturerName}</td>
                            <td className="p-3 text-center">
                              <span className="bg-[#26B6B6]/10 text-[#26B6B6] text-[9.5px] px-1.5 py-0.5 rounded font-bold font-mono">
                                {dl.format}
                              </span>
                            </td>
                            <td className="p-3 text-center font-mono text-gray-400">{dl.fileSize}</td>
                            <td className="p-3 text-center font-mono text-gray-400">{dl.date}</td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center gap-1.5">
                                {currentUser.isPremium ? (
                                  <select 
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleAddObjectToFolder(e.target.value, dl.objectId);
                                        alert(isRtl ? 'آبجکت با موفقیت به پوشه الصاق شد.' : 'Linked to project.');
                                        e.target.value = '';
                                      }
                                    }}
                                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded p-1 text-[10px] focus:outline-none"
                                  >
                                    <option value="">{isRtl ? 'الصاق به پروژه...' : 'Filing...'}</option>
                                    {folders.map(f => (
                                      <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="text-[10px] text-rose-500 font-semibold">{isRtl ? 'پروژه ویژه (VIP)' : 'VIP Project Filing'}</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <button 
                                onClick={() => handleReDownload(dl)}
                                className="bg-[#26B6B6]/10 text-[#26B6B6] hover:bg-[#26B6B6] hover:text-white p-1.5 rounded transition-all cursor-pointer inline-flex"
                              >
                                <Download className="w-3.5 h-3.5" />
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

        {/* PROJECTS SECTION */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            {activeFolderId === null ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <Folder className="w-5 h-5 text-[#26B6B6]" />
                      <span>{isRtl ? 'پوشه‌های اختصاصی پروژه‌ها' : 'Custom Project Folders'}</span>
                    </h2>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {isRtl ? 'سازماندهی حرفه‌ای تجهیزات معماری در بسته‌بندی پروژه‌های تفکیکی شما.' : 'Keep separate asset boards for every building draft you manage.'}
                    </p>
                  </div>

                  {!currentUser.isPremium && (
                    <span className="bg-rose-50 text-rose-500 dark:bg-rose-950/20 text-[10px] font-black px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/50">
                      🔒 VIP Only
                    </span>
                  )}
                </div>

                {/* Create Project Folder form */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-gray-700 dark:text-white">{isRtl ? 'ساخت پوشه پروژه ساختمانی جدید' : 'Create New Project Container'}</h3>
                  <form onSubmit={handleCreateFolder} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                      type="text"
                      required
                      placeholder={isRtl ? 'نام پروژه (مثال: برج مسکونی الهیه)' : 'Project Name (e.g. Elahiyeh Tower)'}
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                    />
                    <input 
                      type="text"
                      placeholder={isRtl ? 'توضیحات کوتاه یا آدرس' : 'Short description / address'}
                      value={newFolderDesc}
                      onChange={(e) => setNewFolderDesc(e.target.value)}
                      className="text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none md:col-span-1"
                    />
                    <button 
                      type="submit"
                      className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold py-3 px-5 rounded-xl transition-colors cursor-pointer"
                    >
                      {isRtl ? 'ایجاد پوشه جدید' : 'Generate Project'}
                    </button>
                  </form>
                </div>

                {/* Folders grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {folders.map(folder => (
                    <div 
                      key={folder.id}
                      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-[#26B6B6]/40 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[13px] font-extrabold text-gray-800 dark:text-white">{folder.name}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">{folder.dateCreated}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{folder.desc}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                        <span className="text-[10.5px] font-bold text-[#26B6B6]">
                          {folder.objectIds.length} {isRtl ? 'آبجکت ذخیره شده' : 'BIM Units'}
                        </span>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              if (currentUser.isPremium) {
                                setActiveFolderId(folder.id);
                              } else {
                                alert(isRtl ? 'پروژه‌های تفصیلی مخصوص اعضای ویژه است.' : 'Detailed view is for VIP gold members.');
                                setActiveTab('subscription');
                              }
                            }}
                            className="bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-bold py-1.5 px-3 rounded-lg border border-slate-100 dark:border-gray-700 cursor-pointer"
                          >
                            {isRtl ? 'مشاهده و خروجی' : 'View & Export'}
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteFolder(folder.id)}
                            className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Single Folder Detail View */
              <div className="space-y-6 animate-fadeIn">
                <button 
                  onClick={() => setActiveFolderId(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#26B6B6] font-bold hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isRtl ? 'بازگشت به پروژه‌ها' : 'Back to Projects'}</span>
                </button>

                {(() => {
                  const currentFolder = folders.find(f => f.id === activeFolderId);
                  if (!currentFolder) return null;
                  const linkedBimObjects = BIM_OBJECTS.filter(obj => currentFolder.objectIds.includes(obj.id));
                  
                  return (
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <h2 className="text-sm sm:text-base font-black text-gray-800 dark:text-white">{currentFolder.name}</h2>
                          <p className="text-xs text-gray-400">{currentFolder.desc}</p>
                          <span className="text-[10px] text-gray-400 font-mono mt-1 block">Created: {currentFolder.dateCreated}</span>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleExportSpecs(currentFolder)}
                            className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-900/50 cursor-pointer"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                            <span>{isRtl ? 'خروجی اکسل پروپوزال (CSV)' : 'Export CSV Proposal'}</span>
                          </button>
                          <button 
                            onClick={() => {
                              const renamed = prompt(isRtl ? 'نام جدید پروژه:' : 'Rename Project Container:', currentFolder.name);
                              if (renamed) {
                                setFolders(prev => prev.map(f => f.id === currentFolder.id ? { ...f, name: renamed } : f));
                              }
                            }}
                            className="bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 py-2 px-4 rounded-xl border border-slate-100 dark:border-gray-700 cursor-pointer"
                          >
                            {isRtl ? 'ویرایش نام' : 'Rename'}
                          </button>
                        </div>
                      </div>

                      {/* Display elements inside Project container */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{isRtl ? 'آبجکت‌های الصاق شده' : 'Linked parametric models'}</h3>
                        
                        {linkedBimObjects.length === 0 ? (
                          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center text-xs text-gray-400 border border-dashed border-gray-100 dark:border-gray-800 space-y-2">
                            <Info className="w-8 h-8 text-[#26B6B6] mx-auto opacity-70" />
                            <p>{isRtl ? 'این پوشه پروژه خالی است.' : 'No BIM products associated yet.'}</p>
                            <p className="text-[11px] text-gray-400">{isRtl ? 'از کاتالوگ اصلی محصولات را به این پوشه متصل کنید.' : 'Assign spec targets from search or favorites.'}</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {linkedBimObjects.map(obj => (
                              <div key={obj.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-2.5 flex flex-col justify-between">
                                <BIMObjectCard 
                                  object={obj}
                                  isSaved={savedObjects.includes(obj.id)}
                                  onToggleSave={() => onToggleSave(obj.id)}
                                  onClick={() => onSelectObject(obj)}
                                  onQuickDownload={(fmt) => onQuickDownload(obj, fmt)}
                                  onViewBrand={onViewBrand}
                                />
                                <div className="pt-2 mt-2 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                                  <button 
                                    onClick={() => {
                                      setFolders(prev => prev.map(f => {
                                        if (f.id === currentFolder.id) {
                                          return { ...f, objectIds: f.objectIds.filter(id => id !== obj.id) };
                                        }
                                        return f;
                                      }));
                                    }}
                                    className="text-[10px] text-rose-500 hover:underline font-bold"
                                  >
                                    {isRtl ? 'حذف از پروژه' : 'Detach'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* COLLECTIONS / FAVORITES TAB */}
        {activeTab === 'collections' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <FolderHeart className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'آبجکت‌های نشان‌شده و کلکسیون‌ها' : 'Favorites & Shortlists'}</span>
                </h2>
                <p className="text-[11px] text-gray-400 mt-1">
                  {isRtl ? 'آبجکت‌های بوکمارک شده خود را مدیریت و به کلکسیون‌های دلخواه متصل کنید.' : 'Group your saved elements into themed moodboards or quick collections.'}
                </p>
              </div>

              {!currentUser.isPremium && (
                <span className="bg-slate-100 dark:bg-gray-800 text-gray-500 text-[9.5px] font-bold px-2.5 py-1 rounded-full">
                  {isRtl ? 'مجموعه سفارشی مخصوص VIP' : 'Custom Collections VIP'}
                </span>
              )}
            </div>

            {/* Custom collections creation form (VIP only) */}
            {currentUser.isPremium && (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl">
                <form onSubmit={handleCreateCollection} className="flex gap-3 max-w-md">
                  <input 
                    type="text" 
                    required
                    placeholder={isRtl ? 'نام مجموعه سفارشی جدید (مثال: شیرآلات مشکی)' : 'New custom collection name'}
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
                  >
                    {isRtl ? 'ایجاد کلکسیون' : 'Create Collection'}
                  </button>
                </form>
              </div>
            )}

            {/* Collections toggle views */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-gray-400 font-bold">{isRtl ? 'کلکسیون‌ها:' : 'Collections:'}</span>
              <span className="bg-[#26B6B6] text-white text-[10.5px] px-3 py-1 rounded-full font-bold cursor-pointer">
                {isRtl ? 'همه نشان‌شده‌ها' : 'All Favorites'} ({favoriteObjects.length})
              </span>
              {collections.map(col => (
                <span 
                  key={col.id} 
                  onClick={() => {
                    if (!currentUser.isPremium) {
                      alert(isRtl ? 'کلکسیون‌های سفارشی مخصوص کاربران ویژه است.' : 'Collections are for VIP accounts.');
                      setActiveTab('subscription');
                    }
                  }}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-[10.5px] px-3 py-1 rounded-full font-bold cursor-pointer hover:bg-gray-50"
                >
                  {col.name} ({col.objectIds.length})
                </span>
              ))}
            </div>

            {/* Objects Grid */}
            {favoriteObjects.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center text-xs text-gray-400 border border-dashed border-gray-100 dark:border-gray-800">
                <Bookmark className="w-8 h-8 text-[#26B6B6] mx-auto opacity-70 mb-2" />
                <p>{isRtl ? 'هیچ محصولی را نشان نکرده‌اید.' : 'Your favorites list is currently empty.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoriteObjects.map(obj => (
                  <div key={obj.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-2.5 flex flex-col justify-between">
                    <BIMObjectCard 
                      object={obj}
                      isSaved={savedObjects.includes(obj.id)}
                      onToggleSave={() => onToggleSave(obj.id)}
                      onClick={() => onSelectObject(obj)}
                      onQuickDownload={(fmt) => onQuickDownload(obj, fmt)}
                      onViewBrand={onViewBrand}
                    />
                    
                    {/* VIP Option to move to collections */}
                    {currentUser.isPremium && (
                      <div className="pt-2 mt-2 border-t border-gray-50 dark:border-gray-800">
                        <select 
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddObjectToCollection(e.target.value, obj.id);
                              alert(isRtl ? 'آبجکت به کلکسیون منتقل شد.' : 'Added to collection.');
                              e.target.value = '';
                            }
                          }}
                          className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent rounded p-1 text-[10px] focus:outline-none"
                        >
                          <option value="">{isRtl ? 'انتقال به کلکسیون سفارشی...' : 'Move to Collection...'}</option>
                          {collections.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ROLES & INTERESTS TOPICS TAB */}
        {activeTab === 'roles-topics' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <Tag className="w-5 h-5 text-[#26B6B6]" />
                <span>{isRtl ? 'فیلتر هوشمند علایق و حوزه‌های تخصصی' : 'Professional Roles & Topics'}</span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                {isRtl 
                  ? 'نقش و علایق خود را انتخاب کنید تا پیشنهاد کاتالوگ‌های ویژه، کامپوننت‌های مرتبط و اخبار استانداردها کاملاً متناسب با رشته تحصیلی شما شخصی‌سازی شود.' 
                  : 'Tailor recommendation models and catalog lists based on your structural and mechanical focus.'}
              </p>
            </div>

            {/* Roles checklist */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{isRtl ? 'نقش‌های صنفی شما (رشته‌های تحصیلی)' : 'Your Professional Roles'}</h3>
              <div className="flex flex-wrap gap-2.5">
                {['Architect', 'Structural Engineer', 'MEP Engineer', 'Quantity Surveyor', 'Project Manager', 'BIM Manager'].map(role => {
                  const active = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setSelectedRoles(prev => 
                          prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
                        );
                      }}
                      className={`text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-semibold ${
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

            {/* Topics/Interests checklist */}
            <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-800">
              <h3 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{isRtl ? 'سرفصل‌های پرکاربرد و موضوعات مورد علاقه' : 'Areas of Interest / Topics'}</h3>
              <div className="flex flex-wrap gap-2.5">
                {['HVAC', 'Electrical Fittings', 'Sanitary Ware', 'Facades', 'Structural Concrete', 'Sustainable Materials', 'Acoustics', 'Interior Design'].map(topic => {
                  const active = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        setSelectedTopics(prev => 
                          prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
                        );
                      }}
                      className={`text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-semibold ${
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

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => {
                  alert(isRtl ? 'علایق و فید هوشمند شما با موفقیت به‌روزرسانی شد.' : 'Smart feedback feed personalized successfully.');
                  setActiveTab('overview');
                }}
                className="bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
              >
                {isRtl ? 'ذخیره و بازگشت به داشبورد' : 'Apply and return'}
              </button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#26B6B6]" />
                  <span>{isRtl ? 'صندوق پیام‌ها و اطلاعیه‌های سیستم' : 'System Messages & Notifications'}</span>
                </h2>
                <p className="text-[11px] text-gray-400 mt-1">
                  {isRtl ? 'اعلامیه‌های مربوط به سقف دانلودها، تاییدیه فایل و محصولات به‌روزرسانی شده.' : 'Platform alerts regarding catalog versions, tickets responses, and daily allowance reset.'}
                </p>
              </div>

              <button 
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  alert(isRtl ? 'همه موارد به عنوان خوانده‌شده علامت‌گذاری شدند.' : 'All notifications marked as read.');
                }}
                className="text-[11px] text-[#26B6B6] hover:underline cursor-pointer"
              >
                {isRtl ? 'خوانده شده همه' : 'Mark all as read'}
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map(n => (
                <div 
                  key={n.id}
                  className={`bg-white dark:bg-gray-900 border p-4 rounded-xl flex items-start gap-3 transition-all ${
                    n.read 
                      ? 'border-gray-100 dark:border-gray-800 opacity-80' 
                      : 'border-[#26B6B6]/30 dark:border-[#26B6B6]/20 bg-slate-50/20'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-gray-300' : 'bg-[#26B6B6] animate-pulse'}`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-[12.5px] font-extrabold text-gray-800 dark:text-white">{n.title}</h4>
                      <span className="text-[9.5px] text-gray-400 font-mono shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// Sidebar Nav List Helper Component
interface ModelerSidebarNavProps {
  activeTab: DashboardSection;
  onSelectTab: (tab: DashboardSection) => void;
  isRtl: boolean;
  t: (key: string) => string;
  isPremium: boolean;
  collapsed?: boolean;
}

const ModelerSidebarNav: React.FC<ModelerSidebarNavProps> = ({
  activeTab,
  onSelectTab,
  isRtl,
  t,
  isPremium,
  collapsed = false
}) => {
  const items = [
    { id: 'overview' as const, labelFa: 'داشبورد عمومی', labelEn: 'Overview', icon: Clock },
    { id: 'profile' as const, labelFa: 'تنظیمات پروفایل', labelEn: 'Profile Settings', icon: User },
    { id: 'subscription' as const, labelFa: 'اشتراک و ارتقا اکانت', labelEn: 'Subscription', icon: CreditCard, badge: !isPremium ? 'Upgrade' : null },
    { id: 'history' as const, labelFa: 'تاریخچه دانلودها', labelEn: 'Download History', icon: FileDigit },
    { id: 'projects' as const, labelFa: 'پوشه‌های پروژه ساختمانی', labelEn: 'Project Folders', icon: Folder, lock: !isPremium },
    { id: 'collections' as const, labelFa: 'کلکسیون‌ها و مودبردها', labelEn: 'Saved Collections', icon: FolderHeart, lock: !isPremium },
    { id: 'roles-topics' as const, labelFa: 'نقش‌ها و سرفصل‌ها', labelEn: 'Roles & Interests', icon: Tag },
    { id: 'notifications' as const, labelFa: 'اعلان‌ها و پیام‌ها', labelEn: 'Notifications', icon: Bell }
  ];

  return (
    <ul className="space-y-1 font-medium text-xs leading-none">
      {items.map(item => {
        const IconComponent = item.icon;
        const active = activeTab === item.id;
        const label = isRtl ? item.labelFa : item.labelEn;

        return (
          <li key={item.id}>
            <button
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between py-3 rounded-xl transition-all cursor-pointer ${
                active 
                  ? 'bg-[#26B6B6]/10 text-[#26B6B6] font-bold' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-gray-800'
              } ${collapsed ? 'justify-center px-0' : 'px-3'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <IconComponent className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </div>

              {!collapsed && (
                <div className="flex items-center gap-1">
                  {item.badge && (
                    <span className="bg-[#26B6B6] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                      {item.badge}
                    </span>
                  )}
                  {item.lock && (
                    <span className="text-gray-300 dark:text-gray-600 text-[10px]">🔒</span>
                  )}
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
