import React, { useState, useEffect } from 'react';
import { toast } from '../ui/toast';
import { 
  Factory,
  Shield, 
  Users, 
  FileText, 
  Settings, 
  Activity, 
  TrendingUp, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  RefreshCw, 
  UserPlus, 
  Plus, 
  Search, 
  Mail, 
  MessageSquare, 
  DollarSign, 
  CreditCard, 
  Lock, 
  Key, 
  FileCheck,
  Building,
  Check,
  UserCheck,
  AlertTriangle,
  BookOpen,
  History,
  Send,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useLoading } from '../LoadingContext';
import { useSiteConfig } from '../SiteConfigContext';
import { 
  AdminRole, 
  AdminAccount, 
  AuditLogEntry, 
  ManufacturerRequest, 
  ReviewObject, 
  SupportTicket, 
  BillingInvoice, 
  RefundRequest,
  ReviewerMetrics
} from './AdminTypes';
import { 
  SEEDED_ADMINS, 
  SEEDED_AUDIT_LOGS, 
  SEEDED_MANUFACTURER_REQUESTS, 
  SEEDED_REVIEW_OBJECTS, 
  SEEDED_TICKETS, 
  SEEDED_INVOICES, 
  SEEDED_REFUNDS, 
  SEEDED_REVIEWER_METRICS,
  CANNED_RESPONSES
} from './AdminMockData';
import { BIMModelerApplicationsAdminView } from './BIMModelerApplicationsAdminView';
import { ManufacturerLeadsAdminView } from './ManufacturerLeadsAdminView';
import { BrandVerificationAdminView } from './BrandVerificationAdminView';

export const AdminControlPanel: React.FC = () => {
  const { isRtl } = useLanguage();
  const { triggerTransition } = useLoading();

  // Load site config CMS hook
  const { siteConfig, updateSiteConfig } = useSiteConfig();
  const [localConfig, setLocalConfig] = useState<any>(null);

  // Sync local draft config when siteConfig is loaded
  useEffect(() => {
    if (siteConfig) {
      setLocalConfig(JSON.parse(JSON.stringify(siteConfig)));
    }
  }, [siteConfig]);

  // Handle reordering landing page sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!localConfig || !localConfig.landingPageOrder) return;
    const order = [...localConfig.landingPageOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;

    // Swap elements
    const temp = order[index];
    order[index] = order[targetIdx];
    order[targetIdx] = temp;

    setLocalConfig({
      ...localConfig,
      landingPageOrder: order
    });
  };

  // Handle saving the visual config
  const handleSaveThemeConfig = async () => {
    if (!localConfig) return;
    triggerTransition(async () => {
      const ok = await updateSiteConfig(localConfig);
      if (ok) {
        logAdminAction(
          'بروزرسانی چیدمان و تنظیمات قالب سایت',
          'Theme Builder',
          'سند تنظیمات config.json',
          'تغییر چیدمان سکشن‌ها یا بروزرسانی فوتر و سوالات متداول توسط مدیر ارشد'
        );
        toast(isRtl ? 'تغییرات چیدمان و پوسته پلتفرم با موفقیت ثبت شد!' : 'Theme builder changes saved successfully!');
      } else {
        toast(isRtl ? 'خطا در ذخیره تغییرات.' : 'Error saving theme changes.');
      }
    }, isRtl ? 'در حال ثبت تغییرات پوسته در سرور...' : 'Saving page layout adjustments...', 'Saving page layout adjustments...', 600);
  };

  // Authentication State
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => {
    const saved = localStorage.getItem('iranbimhub_current_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [tempAdmin, setTempAdmin] = useState<AdminAccount | null>(null);
  const [loginError, setLoginError] = useState('');

  // Domain state loaded from localStorage or seeded data
  const [admins, setAdmins] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem('admin_accounts');
    return saved ? JSON.parse(saved) : SEEDED_ADMINS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('admin_audit_logs');
    return saved ? JSON.parse(saved) : SEEDED_AUDIT_LOGS;
  });

  const [mfgRequests, setMfgRequests] = useState<ManufacturerRequest[]>(() => {
    const saved = localStorage.getItem('admin_mfg_requests');
    return saved ? JSON.parse(saved) : SEEDED_MANUFACTURER_REQUESTS;
  });

  const [reviewObjects, setReviewObjects] = useState<ReviewObject[]>(() => {
    const saved = localStorage.getItem('admin_review_objects');
    return saved ? JSON.parse(saved) : SEEDED_REVIEW_OBJECTS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('admin_tickets');
    return saved ? JSON.parse(saved) : SEEDED_TICKETS;
  });

  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    const saved = localStorage.getItem('admin_invoices');
    return saved ? JSON.parse(saved) : SEEDED_INVOICES;
  });

  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(() => {
    const saved = localStorage.getItem('admin_refund_requests');
    return saved ? JSON.parse(saved) : SEEDED_REFUNDS;
  });

  const [reviewerMetrics, setReviewerMetrics] = useState<ReviewerMetrics[]>(() => {
    const saved = localStorage.getItem('admin_reviewer_metrics');
    return saved ? JSON.parse(saved) : SEEDED_REVIEWER_METRICS;
  });

  // Guidelines state
  const [reviewGuidelines, setReviewGuidelines] = useState<string>(() => {
    return localStorage.getItem('admin_review_guidelines') || 
      '1. بررسی صحت فایل خانواده (.rfa) و فرمت مکمل (.ifc)\n2. پر کردن دقیق پارامترهای فنی متاداده در سطح LOD 400\n3. بررسی اتصالات فیزیکی صحیح (Pipe/Duct Connectors)\n4. تطابق کامل نام‌گذاری برند تجاری با مدارک رسمی شرکت';
  });

  // Active Sub-tab/Section
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Search and filter inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  // Modal states for creating/editing resources
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('Reviewer');

  // Support Tickets interactive chat state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  // Manufacturer Profile & Verification Documents Sync State
  const [mfgProfile, setMfgProfile] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('iranbimhub_mfg_profile') || localStorage.getItem('iranbimhub_mfg_profile_m1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading mfgProfile in admin panel:", e);
    }
    return null;
  });

  useEffect(() => {
    const syncProfile = () => {
      try {
        const saved = localStorage.getItem('iranbimhub_mfg_profile') || localStorage.getItem('iranbimhub_mfg_profile_m1');
        if (saved) setMfgProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Error syncing mfgProfile in admin panel:", e);
      }
    };
    window.addEventListener('iranbimhub_brand_profile_updated', syncProfile);
    return () => window.removeEventListener('iranbimhub_brand_profile_updated', syncProfile);
  }, []);

  const handleAdminDocAction = (docId: string, action: 'approve' | 'reject', reason: string) => {
    if (!mfgProfile) return;
    const updatedDocs = (mfgProfile.verificationDocs || []).map((d: any) => {
      if (d.id === docId) {
        const nextStatus = action === 'approve' ? 'Verified' : 'Rejected';
        const adminComment = {
          id: `c-${Date.now()}`,
          sender: 'Admin' as const,
          senderName: currentAdmin?.name || 'مدیر تایید مدارک',
          text: reason || (action === 'approve' ? 'مدرک مورد تایید است.' : 'مدرک فاقد اعتبار است.'),
          date: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...d,
          status: nextStatus,
          rejectionReasonFa: action === 'reject' ? reason : undefined,
          comments: [...(d.comments || []), adminComment]
        };
      }
      return d;
    });

    const updatedProfile = { ...mfgProfile, verificationDocs: updatedDocs };
    setMfgProfile(updatedProfile);
    localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('iranbimhub_mfg_profile_m1', JSON.stringify(updatedProfile));
    window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
    toast(isRtl ? 'وضعیت مدرک با موفقیت تغییر یافت و پیام ادمین ثبت گردید.' : 'Document status updated and comment saved.');
  };

  const handleAdminSendDocComment = (docId: string, commentText: string) => {
    if (!commentText.trim() || !mfgProfile) return;
    const updatedDocs = (mfgProfile.verificationDocs || []).map((d: any) => {
      if (d.id === docId) {
        const adminComment = {
          id: `c-${Date.now()}`,
          sender: 'Admin' as const,
          senderName: currentAdmin?.name || 'پشتیبانی / کارشناس مرکز',
          text: commentText.trim(),
          date: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...d,
          comments: [...(d.comments || []), adminComment]
        };
      }
      return d;
    });

    const updatedProfile = { ...mfgProfile, verificationDocs: updatedDocs };
    setMfgProfile(updatedProfile);
    localStorage.setItem('iranbimhub_mfg_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('iranbimhub_mfg_profile_m1', JSON.stringify(updatedProfile));
    window.dispatchEvent(new CustomEvent('iranbimhub_brand_profile_updated'));
  };

  // Persist state updates to localstorage
  useEffect(() => {
    localStorage.setItem('admin_accounts', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem('admin_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('admin_mfg_requests', JSON.stringify(mfgRequests));
  }, [mfgRequests]);

  useEffect(() => {
    localStorage.setItem('admin_review_objects', JSON.stringify(reviewObjects));
  }, [reviewObjects]);

  useEffect(() => {
    localStorage.setItem('admin_tickets', JSON.stringify(tickets));
  }, [tickets]);

  /* ----------------------------------------------------------------------
   * REAL website tickets sync (Contact-Us form -> POST /api/tickets -> here)
   * Server tickets are adapted into the SupportTicket shape and prepended.
   * -------------------------------------------------------------------- */
  const mapServerStatusToLocal = (s: string): SupportTicket['status'] =>
    s === 'in_review' ? 'In Progress' : (s === 'answered' || s === 'closed') ? 'Resolved' : 'Open';

  const syncSupportTickets = async () => {
    try {
      const res = await fetch('/api/admin/tickets');
      const data = await res.json();
      if (!data?.success) return;
      const adapted: SupportTicket[] = (data.tickets || []).map((t: any) => ({
        id: `srv-${t.id}`,
        refNumber: t.refNumber,
        department: t.department,
        userEmail: t.email,
        userRole: 'Modeler' as const,
        subject: t.subject || '(بدون موضوع)',
        message: t.message,
        category: (t.department === 'tech' ? 'Technical Support' : 'General') as SupportTicket['category'],
        status: mapServerStatusToLocal(t.status),
        dateCreated: new Date(t.createdAt).toLocaleDateString('fa-IR'),
        messages: [{ sender: 'user' as const, text: t.message, timestamp: new Date(t.createdAt).toLocaleDateString('fa-IR') }],
      }));
      setTickets(prev => [...adapted, ...prev.filter(t => !t.id.startsWith('srv-'))]);
    } catch {
      /* backend offline (dev) — keep local session tickets */
    }
  };

  // Mirror status changes of WEBSITE tickets back to the server store
  const patchServerTicket = async (localId: string, status: 'in_review' | 'answered', adminNotes: string) => {
    if (!localId.startsWith('srv-')) return;
    try {
      await fetch(`/api/admin/tickets/${localId.slice(4)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
    } catch { /* offline dev */ }
  };

  useEffect(() => { syncSupportTickets(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  useEffect(() => {
    localStorage.setItem('admin_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('admin_refund_requests', JSON.stringify(refundRequests));
  }, [refundRequests]);

  useEffect(() => {
    localStorage.setItem('admin_reviewer_metrics', JSON.stringify(reviewerMetrics));
  }, [reviewerMetrics]);

  // Logging engine helper
  const logAdminAction = (action: string, targetType: string, targetName: string, reason: string, details?: string) => {
    if (!currentAdmin) return;
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('fa-IR') + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
      action,
      targetType,
      targetName,
      reason,
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Predefined credential mapping
    const match = admins.find(a => a.email.toLowerCase() === usernameInput.toLowerCase().trim() && a.active);
    
    if (match) {
      // Map passwords mock
      let correctPass = 'admin123';
      if (match.role === 'Super Admin') correctPass = 'superadmin123';
      if (match.role === 'Manufacturer Verification Admin') correctPass = 'verify123';
      if (match.role === 'Review Team Manager') correctPass = 'manager123';
      if (match.role === 'Reviewer') correctPass = 'reviewer123';
      if (match.role === 'Support & Customer Success') correctPass = 'support123';
      if (match.role === 'Finance & Subscription') correctPass = 'finance123';

      if (passwordInput === correctPass) {
        setTempAdmin(match);
        setShow2FA(true);
      } else {
        setLoginError(isRtl ? 'کلمه عبور وارد شده نادرست است' : 'Incorrect password');
      }
    } else {
      setLoginError(isRtl ? 'حساب کاربری ادمین فعال با این ایمیل یافت نشد' : 'Active admin account not found with this email');
    }
  };

  // Two-Factor Authentication handler
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempAdmin) return;

    // Define mock verification tokens
    let correctToken = '123456';
    if (tempAdmin.role === 'Super Admin') correctToken = '123456';
    if (tempAdmin.role === 'Manufacturer Verification Admin') correctToken = '222222';
    if (tempAdmin.role === 'Review Team Manager') correctToken = '333333';
    if (tempAdmin.role === 'Reviewer') correctToken = '444444';
    if (tempAdmin.role === 'Support & Customer Success') correctToken = '555555';
    if (tempAdmin.role === 'Finance & Subscription') correctToken = '666666';

    if (twoFactorInput === correctToken) {
      triggerTransition(() => {
        setCurrentAdmin(tempAdmin);
        localStorage.setItem('iranbimhub_current_admin', JSON.stringify(tempAdmin));
        // Reset tabs to appropriate default view
        if (tempAdmin.role === 'Super Admin') setActiveTab('dashboard');
        else if (tempAdmin.role === 'Manufacturer Verification Admin') setActiveTab('mfg-verification');
        else if (tempAdmin.role === 'Review Team Manager') setActiveTab('review-management');
        else if (tempAdmin.role === 'Reviewer') setActiveTab('my-reviews');
        else if (tempAdmin.role === 'Support & Customer Success') setActiveTab('support-tickets');
        else if (tempAdmin.role === 'Finance & Subscription') setActiveTab('finance-billing');
      }, isRtl ? 'در حال ورود به کنترل پنل امن...' : 'Entering secure admin control panel...', 'Entering secure admin control panel...', 700);
    } else {
      setLoginError(isRtl ? 'کد تایید دو مرحله‌ای نادرست است' : 'Incorrect 2FA verification token');
    }
  };

  // Logout handler
  const handleLogout = () => {
    triggerTransition(() => {
      setCurrentAdmin(null);
      localStorage.removeItem('iranbimhub_current_admin');
      setShow2FA(false);
      setTempAdmin(null);
      setUsernameInput('');
      setPasswordInput('');
      setTwoFactorInput('');
    }, isRtl ? 'خروج امن از حساب...' : 'Logging out securely...', 'Logging out securely...', 500);
  };

  // Check permission helper for RBAC
  const hasAccessTo = (tabName: string): boolean => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === 'Super Admin') return true; // Full unrestricted access

    switch (tabName) {
      case 'dashboard':
        return false;
      case 'mfg-verification':
        return currentAdmin.role === 'Manufacturer Verification Admin';
      case 'review-management':
        return currentAdmin.role === 'Review Team Manager';
      case 'manufacturer-leads':
        return ['Review Team Manager', 'Support & Customer Success', 'Manufacturer Verification Admin'].includes(currentAdmin.role);
        return ['Review Team Manager', 'Support & Customer Success'].includes(currentAdmin.role);
      case 'my-reviews':
        return currentAdmin.role === 'Reviewer';
      case 'support-tickets':
        return currentAdmin.role === 'Support & Customer Success';
      case 'finance-billing':
        return currentAdmin.role === 'Finance & Subscription';
      case 'audit-logs':
        // Super Admin sees complete trail, Verification/Managers see filtered versions
        return ['Super Admin', 'Manufacturer Verification Admin', 'Review Team Manager'].includes(currentAdmin.role);
      case 'theme-builder':
        return false; // Only Super Admin has access, handled at the top of this function
      default:
        return false;
    }
  };

  // Super Admin action: Toggle Admin Active status
  const handleToggleAdminActive = (id: string) => {
    if (currentAdmin?.role !== 'Super Admin') return;
    const adminAccount = admins.find(a => a.id === id);
    if (!adminAccount) return;

    if (adminAccount.id === currentAdmin.id) {
      toast(isRtl ? 'شما نمی‌توانید حساب کاربری خودتان را غیرفعال کنید!' : 'You cannot deactivate your own account!');
      return;
    }

    setAdmins(prev => prev.map(a => {
      if (a.id === id) {
        const nextActive = !a.active;
        logAdminAction(
          nextActive ? 'فعال‌سازی مجدد حساب ادمین' : 'تعلیق/غیرفعال‌سازی حساب ادمین',
          'Admin Management',
          a.name,
          `تغییر وضعیت فعالیت ادمین توسط مدیر ارشد`
        );
        return { ...a, active: nextActive };
      }
      return a;
    }));
  };

  // Super Admin action: Add Admin Account
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdmin?.role !== 'Super Admin') return;
    if (!newAdminName || !newAdminEmail || !newAdminPhone) return;

    const newAdmin: AdminAccount = {
      id: `admin-${Date.now()}`,
      name: newAdminName,
      email: newAdminEmail,
      phone: newAdminPhone,
      role: newAdminRole,
      active: true,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
    };

    setAdmins(prev => [...prev, newAdmin]);
    logAdminAction(
      'ایجاد حساب ادمین جدید',
      'Admin Management',
      newAdmin.name,
      `اختصاص نقش ${newAdmin.role} به پرسنل جدید`
    );

    // If new admin is a Reviewer, create entry in metrics
    if (newAdminRole === 'Reviewer') {
      const newMetric: ReviewerMetrics = {
        reviewerId: newAdmin.id,
        reviewerName: newAdmin.name,
        approvedCount: 0,
        rejectedCount: 0,
        avgTurnaroundHours: 0,
        assignedCount: 0
      };
      setReviewerMetrics(prev => [...prev, newMetric]);
    }

    // Reset fields
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPhone('');
    setShowAddAdminModal(false);
  };

  // Role 2 action: Approve/Reject Manufacturer Verification
  const handleVerifyManufacturer = (id: string, approve: boolean, reason: string) => {
    if (currentAdmin?.role !== 'Manufacturer Verification Admin' && currentAdmin?.role !== 'Super Admin') return;
    if (!reason.trim()) {
      toast(isRtl ? 'لطفاً علت تصمیم تایید یا رد را وارد نمایید.' : 'Please provide a verification reason.');
      return;
    }

    setMfgRequests(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = approve ? 'Approved' : 'Rejected';
        logAdminAction(
          approve ? 'تایید احراز هویت تولیدکننده' : 'رد احراز هویت تولیدکننده',
          'Manufacturer Onboarding',
          r.companyName,
          reason,
          `شناسه پروانه: ${r.licenseNumber}`
        );
        return { ...r, status: nextStatus, reason };
      }
      return r;
    }));
  };

  // Role 3 action: Assign Reviewer to Pending Object
  const handleAssignReviewer = (objectId: string, reviewerId: string) => {
    if (currentAdmin?.role !== 'Review Team Manager' && currentAdmin?.role !== 'Super Admin') return;
    const reviewer = admins.find(a => a.id === reviewerId);
    if (!reviewer) return;

    setReviewObjects(prev => prev.map(o => {
      if (o.id === objectId) {
        logAdminAction(
          'تخصیص ارزیاب به آبجکت',
          'BIM Object Assignment',
          o.titleFa,
          `ارجاع پرونده ارزیابی به ارزیاب: ${reviewer.name}`
        );
        return { ...o, assignedTo: reviewer.id, assignedName: reviewer.name };
      }
      return o;
    }));

    // Increment assignedCount in metrics
    setReviewerMetrics(prev => prev.map(m => {
      if (m.reviewerId === reviewerId) {
        return { ...m, assignedCount: m.assignedCount + 1 };
      }
      return m;
    }));
  };

  // Role 3 action: Override/Reverse review decision
  const handleOverrideReviewDecision = (objectId: string, reverseToApprove: boolean, reason: string) => {
    if (currentAdmin?.role !== 'Review Team Manager' && currentAdmin?.role !== 'Super Admin') return;
    if (!reason.trim()) {
      toast(isRtl ? 'وارد کردن علت همپوشانی و لغو تصمیم ارزیاب الزامی است!' : 'Providing override reason is mandatory!');
      return;
    }

    setReviewObjects(prev => prev.map(o => {
      if (o.id === objectId) {
        const nextStatus = reverseToApprove ? 'Approved' : 'Rejected';
        logAdminAction(
          'لغو و بازنویسی تصمیم ارزیاب (Override)',
          'BIM Object Decision Override',
          o.titleFa,
          reason,
          `تغییر وضعیت از ${o.status} به ${nextStatus} توسط مدیر تیم ارزیابی (${currentAdmin.name})`
        );
        return { 
          ...o, 
          status: nextStatus, 
          overrideReason: reason, 
          overriddenBy: currentAdmin.name,
          reasonDetail: `لغو ارزیابی: ${reason}`
        };
      }
      return o;
    }));
  };

  // Role 3 action: Update internal guidelines
  const handleSaveGuidelines = (val: string) => {
    if (currentAdmin?.role !== 'Review Team Manager' && currentAdmin?.role !== 'Super Admin') return;
    setReviewGuidelines(val);
    localStorage.setItem('admin_review_guidelines', val);
    logAdminAction(
      'بروزرسانی استانداردهای ارزیابی داخلی',
      'Standard Guidelines',
      'سند استاندارد ارزیابی',
      'تغییر معیارهای تایید ابعاد فنی و پارامتری خانواده‌های بیم'
    );
    toast(isRtl ? 'دستورالعمل‌های ارزیابی با موفقیت بروزرسانی شد.' : 'Review guidelines updated successfully.');
  };

  // Role 4 action: Approve/Reject BIM Object
  const handleReviewDecision = (objectId: string, approve: boolean, reasonCode: string, reasonDetail: string) => {
    if (currentAdmin?.role !== 'Reviewer' && currentAdmin?.role !== 'Super Admin') return;
    if (!approve && !reasonDetail.trim()) {
      toast(isRtl ? 'برای رد صلاحیت آبجکت، ثبت علت رد الزامی است.' : 'Rejection requires a mandatory reason detail.');
      return;
    }

    setReviewObjects(prev => prev.map(o => {
      if (o.id === objectId) {
        const nextStatus = approve ? 'Approved' : 'Rejected';
        logAdminAction(
          approve ? 'تایید استاندارد فنی آبجکت BIM' : 'رد صلاحیت فنی آبجکت BIM',
          'BIM Object Review',
          o.titleFa,
          approve ? 'تایید کلیه معیارهای استاندارد و پارامتریک' : `${reasonCode}: ${reasonDetail}`,
          `ارزیاب مسئول: ${currentAdmin.name}`
        );
        return { 
          ...o, 
          status: nextStatus, 
          reasonCode: approve ? undefined : reasonCode, 
          reasonDetail: approve ? undefined : reasonDetail 
        };
      }
      return o;
    }));

    // Update reviewer performance metrics
    setReviewerMetrics(prev => prev.map(m => {
      if (m.reviewerId === currentAdmin.id) {
        return {
          ...m,
          approvedCount: approve ? m.approvedCount + 1 : m.approvedCount,
          rejectedCount: !approve ? m.rejectedCount + 1 : m.rejectedCount,
          assignedCount: Math.max(0, m.assignedCount - 1)
        };
      }
      return m;
    }));
  };

  // Role 5 action: Reply to Support Ticket
  const handleSendTicketReply = (ticketId: string) => {
    if (currentAdmin?.role !== 'Support & Customer Success' && currentAdmin?.role !== 'Super Admin') return;
    if (!chatInput.trim()) return;

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updatedMessages = [
          ...t.messages,
          {
            sender: 'admin' as const,
            text: chatInput,
            timestamp: new Date().toLocaleDateString('fa-IR') + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
          }
        ];
        logAdminAction(
          'ارسال پاسخ تیکت پشتیبانی',
          'Customer Support',
          `تیکت #${t.id}`,
          `پاسخ به کاربر: ${t.userEmail}`
        );
        patchServerTicket(t.id, 'in_review', chatInput);
        return { ...t, status: 'In Progress' as const, messages: updatedMessages };
      }
      return t;
    }));

    setChatInput('');
  };

  // Role 5 action: Apply canned template response
  const handleApplyCanned = (text: string) => {
    setChatInput(text);
  };

  // Role 5 action: Escalate support ticket
  const handleEscalateTicket = (ticketId: string, target: 'Finance' | 'Review Manager') => {
    if (currentAdmin?.role !== 'Support & Customer Success' && currentAdmin?.role !== 'Super Admin') return;
    
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const escalTarget = target === 'Finance' ? 'Finance' as const : 'Review Manager' as const;
        const note = target === 'Finance' 
          ? 'ارجاع تیکت حل اختلاف مالی به واحد حسابداری و اشتراک‌ها' 
          : 'ارجاع اعتراض ارزیابی سازنده به مدیر تیم ارزیابی آبجکت‌ها';
        
        logAdminAction(
          'ارجاع تخصصی تیکت (Escalation)',
          'Customer Support Escalation',
          `تیکت #${t.id}`,
          note,
          `ارجاع داده شده توسط پشتیبان (${currentAdmin.name})`
        );

        patchServerTicket(t.id, 'in_review', note);
        return { ...t, status: 'Escalated' as const, escalatedTo: escalTarget };
      }
      return t;
    }));

    toast(isRtl ? 'تیکت همراه با سوابق کامل مکاتبه به دپارتمان تخصصی ارجاع داده شد.' : 'Ticket escalated successfully with full contact logs.');
  };

  // Role 6 action: Approve/Reject Billing refund
  const handleProcessRefund = (id: string, approve: boolean, reason: string) => {
    if (currentAdmin?.role !== 'Finance & Subscription' && currentAdmin?.role !== 'Super Admin') return;
    if (!reason.trim()) {
      toast(isRtl ? 'لطفاً دلیل موافقت یا مخالفت با بازپرداخت مالی را بنویسید.' : 'Refund decision reason is required.');
      return;
    }

    const request = refundRequests.find(r => r.id === id);
    if (!request) return;

    setRefundRequests(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = approve ? 'Approved' : 'Rejected';
        logAdminAction(
          approve ? 'تایید بازپرداخت تراکنش مالی' : 'رد صلاحیت بازپرداخت وجه',
          'Finance & Subscription',
          `فاکتور ${r.invoiceId}`,
          reason,
          `میزان تراکنش: ${r.amount.toLocaleString()} ریال`
        );
        return { ...r, status: nextStatus, processedBy: currentAdmin.name, processedDate: new Date().toLocaleDateString('fa-IR') };
      }
      return r;
    }));

    // Update original invoice status if approved
    if (approve) {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === request.invoiceId) {
          return { ...inv, status: 'Refunded' };
        }
        return inv;
      }));
    }
  };

  // If NO ADMIN is logged in, show Secure 2FA Login Page
  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo / Badge */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-[#26B6B6]/15 rounded-2xl border border-[#26B6B6]/30 flex items-center gap-2">
              <Shield className="w-8 h-8 text-[#26B6B6] animate-pulse" />
              <div className="text-start">
                <span className="block text-xs font-black tracking-widest text-[#26B6B6]">IRANBIMHUB</span>
                <span className="block text-[9px] text-gray-400 font-bold tracking-tight uppercase">Admin Control Center</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-center text-xl sm:text-2xl font-black text-white tracking-tight">
            {isRtl ? 'درگاه امنیتی ورود ادمین و مدیران' : 'Secure Admin Portal Access'}
          </h2>
          <p className="mt-2 text-center text-xs text-gray-400 max-w-sm mx-auto font-light leading-relaxed">
            {isRtl 
              ? 'این بخش کاملاً خصوصی بوده و تحت نظارت سیستم یکپارچه مانیتورینگ ادمین ایران‌بیم‌هاب قرار دارد.' 
              : 'Authorized internal personnel only. Every login attempt and access behavior is recorded.'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/65 py-8 px-6 sm:rounded-2xl shadow-xl space-y-6">
            {!show2FA ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                    {isRtl ? 'پست الکترونیک پرسنلی' : 'Personnel Email address'}
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="admin@iranbimhub.ir"
                      className="block w-full py-2.5 pr-10 pl-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#26B6B6] focus:border-[#26B6B6] transition-all text-start"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                    {isRtl ? 'رمز عبور امنیتی' : 'Security Password'}
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full py-2.5 pr-10 pl-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#26B6B6] focus:border-[#26B6B6] transition-all text-start"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5 text-xs text-red-400">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>{isRtl ? 'درخواست کد ۲ مرحله‌ای (2FA)' : 'Request 2FA Token'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 bg-[#26B6B6]/10 border border-[#26B6B6]/20 rounded-full flex items-center justify-center mb-3">
                    <Key className="w-5 h-5 text-[#26B6B6]" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {isRtl ? 'احراز هویت دو مرحله‌ای فعال است' : '2FA Verification Required'}
                  </h4>
                  <p className="text-[10px] text-gray-400 px-4 leading-relaxed font-light">
                    {isRtl 
                      ? `کد تایید ارسال شده یا موجود در اپلیکیشن رمزساز موبایل خود را وارد نمایید.`
                      : `Enter the 6-digit dynamic passcode generated by your authenticator app.`}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2 text-center">
                    {isRtl ? 'کد تایید ۶ رقمی' : '6-Digit Verification Code'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={twoFactorInput}
                    onChange={(e) => setTwoFactorInput(e.target.value)}
                    placeholder="123456"
                    className="block w-full py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm text-center text-white tracking-[0.75em] focus:outline-none focus:ring-1 focus:ring-[#26B6B6] focus:border-[#26B6B6] font-mono transition-all"
                  />
                </div>

                {loginError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5 text-xs text-red-400">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShow2FA(false)}
                    className="w-1/3 py-3 bg-slate-700 hover:bg-slate-650 text-gray-300 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    {isRtl ? 'بازگشت' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 flex items-center justify-center gap-2 py-3 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isRtl ? 'ورود به پنل' : 'Verify & Enter'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Helper Hint */}
            <div className="pt-4 border-t border-slate-700/60">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">
                {isRtl ? 'دسترسی سریع آزمایشی (Demo Access)' : 'Demo Role Credentials'}
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-gray-400 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 leading-relaxed text-start select-text">
                <div>
                  <span className="text-[#26B6B6] font-bold">1. Super Admin:</span>
                  <p>admin@iranbimhub.ir</p>
                  <p>Pass: superadmin123 • 2FA: 123456</p>
                </div>
                <div>
                  <span className="text-[#26B6B6] font-bold">2. Verification:</span>
                  <p>verification@iranbimhub.ir</p>
                  <p>Pass: verify123 • 2FA: 222222</p>
                </div>
                <div className="pt-1.5">
                  <span className="text-[#26B6B6] font-bold">3. Review Manager:</span>
                  <p>manager@iranbimhub.ir</p>
                  <p>Pass: manager123 • 2FA: 333333</p>
                </div>
                <div className="pt-1.5">
                  <span className="text-[#26B6B6] font-bold">4. Reviewer:</span>
                  <p>reviewer1@iranbimhub.ir</p>
                  <p>Pass: reviewer123 • 2FA: 444444</p>
                </div>
                <div className="pt-1.5">
                  <span className="text-[#26B6B6] font-bold">5. Support Success:</span>
                  <p>support@iranbimhub.ir</p>
                  <p>Pass: support123 • 2FA: 555555</p>
                </div>
                <div className="pt-1.5">
                  <span className="text-[#26B6B6] font-bold">6. Finance:</span>
                  <p>finance@iranbimhub.ir</p>
                  <p>Pass: finance123 • 2FA: 666666</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the Admin Workspace
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Professional Admin Bar */}
      <header className="bg-white dark:bg-slate-950 border-b border-gray-150 dark:border-slate-800 shadow-sm px-6 py-4 flex items-center justify-between flex-shrink-0 z-40 select-none">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#26B6B6]/10 rounded-xl border border-[#26B6B6]/20">
            <Shield className="w-5 h-5 text-[#26B6B6]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-gray-800 dark:text-gray-100 tracking-tight">
                {isRtl ? 'پنل نظارت و مدیریت یکپارچه' : 'IranBIMhub Integrated Console'}
              </span>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-gray-500 tracking-wider">v2.1</span>
            </div>
            <p className="text-[10px] text-gray-400 font-light mt-0.5">
              {isRtl ? 'پلتفرم ایمن و ارزیابی آبجکت‌های آماده صنعت ساختمان' : 'Secure asset auditing & specifications compliance system'}
            </p>
          </div>
        </div>

        {/* Admin profile detail */}
        <div className="flex items-center gap-3">
          <div className="text-end">
            <span className="block text-xs font-black text-gray-800 dark:text-gray-100">{currentAdmin.name}</span>
            <span className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-150 dark:border-cyan-900/60 rounded text-[9px] font-black mt-1 inline-block">
              {isRtl ? currentAdmin.role : currentAdmin.role}
            </span>
          </div>
          <img 
            src={currentAdmin.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} 
            alt="Admin Profile" 
            className="w-10 h-10 rounded-xl object-cover border border-gray-150 dark:border-slate-800"
          />
          <button
            onClick={handleLogout}
            title={isRtl ? 'خروج امن' : 'Secure Logout'}
            className="p-2.5 hover:bg-red-500/15 border border-transparent hover:border-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-all cursor-pointer flex items-center justify-center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white dark:bg-slate-950 border-r dark:border-l border-gray-150 dark:border-slate-800 p-4 flex flex-col justify-between flex-shrink-0 select-none">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">
              {isRtl ? 'ناوبری سیستم' : 'Control Scopes'}
            </span>

            {/* Tab: Super Admin Dashboard */}
            {hasAccessTo('dashboard') && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{isRtl ? 'داشبورد مدیریتی و آمار' : 'Platform Analytics'}</span>
              </button>
            )}

            {/* Tab: Manufacturer verification */}
            {hasAccessTo('mfg-verification') && (
              <button
                onClick={() => setActiveTab('mfg-verification')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'mfg-verification'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>{isRtl ? 'تایید احراز هویت شرکت‌ها' : 'Manufacturer Verification'}</span>
              </button>
            )}

            {/* Tab: Review Team Manager */}
            {hasAccessTo('review-management') && (
              <button
                onClick={() => setActiveTab('review-management')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'review-management'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{isRtl ? 'مدیریت تیم ارزیابی آبجکت' : 'Reviewer Management'}</span>
              </button>
            )}

            {/* Tab: Manufacturer Leads */}
            {hasAccessTo('manufacturer-leads') && (
              <button
                onClick={() => setActiveTab('manufacturer-leads')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'manufacturer-leads'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Factory className="w-4 h-4" />
                <span>{isRtl ? 'مشاوره تولیدکنندگان' : 'Manufacturer Consultations'}</span>
              </button>
            )}

            {/* Tab: BIM Modeler collaboration applications */}
            {hasAccessTo('bim-modeler-applications') && (
              <button
                onClick={() => setActiveTab('bim-modeler-applications')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'bim-modeler-applications'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{isRtl ? 'درخواست‌های مدل‌سازان BIM' : 'BIM Modeler Applications'}</span>
              </button>
            )}

            {/* Tab: Reviewer queue */}
            {hasAccessTo('my-reviews') && (
              <button
                onClick={() => setActiveTab('my-reviews')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'my-reviews'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>{isRtl ? 'صندوق ارزیابی‌های من' : 'My Assigned Reviews'}</span>
              </button>
            )}

            {/* Tab: Support tickets */}
            {hasAccessTo('support-tickets') && (
              <button
                onClick={() => setActiveTab('support-tickets')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'support-tickets'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isRtl ? 'تیکت‌های پشتیبانی' : 'Support Tickets'}</span>
              </button>
            )}

            {/* Tab: Finance billing */}
            {hasAccessTo('finance-billing') && (
              <button
                onClick={() => setActiveTab('finance-billing')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'finance-billing'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>{isRtl ? 'اشتراک‌ها و امور مالی' : 'Finance & Billing'}</span>
              </button>
            )}

            {/* Tab: Permanent Audit trail */}
            {hasAccessTo('audit-logs') && (
              <button
                onClick={() => setActiveTab('audit-logs')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'audit-logs'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <History className="w-4 h-4" />
                <span>{isRtl ? 'ردپای ارزیابی و وقایع سیستم' : 'Immutable Audit Trail'}</span>
              </button>
            )}

            {/* Tab: Theme & Layout Builder */}
            {hasAccessTo('theme-builder') && (
              <button
                onClick={() => setActiveTab('theme-builder')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'theme-builder'
                    ? 'bg-[#26B6B6] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{isRtl ? 'مدیریت پوسته و چیدمان پلتفرم' : 'Theme & Layout Builder'}</span>
              </button>
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl">
            <span className="block text-[9px] font-black text-gray-400 tracking-wider uppercase mb-1">Security Status</span>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>{isRtl ? 'اتصال ایمن (2FA فعال)' : '2FA Sessions Secured'}</span>
            </div>
          </div>
        </nav>

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* ==================== TAB 1: SUPER ADMIN DASHBOARD ==================== */}
          {activeTab === 'dashboard' && hasAccessTo('dashboard') && (
            <div className="space-y-6 animate-fadeIn">
              {/* Analytics Top Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 font-bold uppercase">{isRtl ? 'درآمد کل ماه جاری' : 'MRR Current Month'}</span>
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
                    {isRtl ? '۱,۶۵۰,۰۰۰,۰۰۰ ریال' : '165,000,000 Toman'}
                  </h3>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <span>+۱۲٪ رشد نسبت به ماه گذشته</span>
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 font-bold uppercase">{isRtl ? 'کارخانه‌های احراز هویت شده' : 'Verified Brands'}</span>
                    <Building className="w-5 h-5 text-[#26B6B6]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
                    {isRtl ? '۷۸ برند معتبر' : '78 Brands'}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {isRtl ? '۳ درخواست ثبت جدید در صف تایید' : '3 pending requests in queue'}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 font-bold uppercase">{isRtl ? 'کل آبجکت‌های BIM ثبت شده' : 'Total BIM Families'}</span>
                    <FileCheck className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
                    {isRtl ? '۱۵,۲۴۰ مدل' : '15,240 Families'}
                  </h3>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">
                    {isRtl ? '۹۶٪ ضریب انطباق کیفی استانداردهای رویت' : '96% Revit QA compliance rate'}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 font-bold uppercase">{isRtl ? 'دانلودهای ماه جاری' : 'Monthly Downloads'}</span>
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
                    {isRtl ? '۳۴,۹۸۰ دانلود' : '34,980 DLs'}
                  </h3>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                    {isRtl ? 'میانگین ۲۰۰ دانلود فمیلی در روز' : 'Avg 200 family DLs daily'}
                  </p>
                </div>
              </div>

              {/* Sub-grid: Admin Accounts list & Config */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Admin Accounts Management */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-150 dark:border-slate-800">
                    <div>
                      <h4 className="text-sm font-black text-gray-800 dark:text-white">
                        {isRtl ? 'مدیریت و صدور حساب‌های پرسنلی ادمین' : 'Personnel Security Access Management'}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {isRtl ? 'فقط مدیر ارشد پلتفرم توانایی اختصاص نقش به سایر لایه‌های ادمین را دارد.' : 'Strictly authorized by Super Admin. Manage internal personnel access levels.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddAdminModal(true)}
                      className="px-3 py-2 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[11px] font-extrabold rounded-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{isRtl ? 'ادمین جدید' : 'Add Admin'}</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-bold">
                          <th className="py-2.5 text-start">{isRtl ? 'نام ادمین' : 'Admin Name'}</th>
                          <th className="py-2.5 text-start">{isRtl ? 'پست الکترونیکی' : 'Email Address'}</th>
                          <th className="py-2.5 text-start">{isRtl ? 'نقش امنیتی و دسترسی' : 'Permission Role'}</th>
                          <th className="py-2.5 text-center">{isRtl ? 'وضعیت فعالیت' : 'Status'}</th>
                          <th className="py-2.5 text-end">{isRtl ? 'اقدامات' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map(acc => (
                          <tr key={acc.id} className="border-b border-gray-50 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                            <td className="py-3 font-bold text-gray-800 dark:text-white flex items-center gap-2">
                              <img src={acc.avatarUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                              <span>{acc.name}</span>
                            </td>
                            <td className="py-3 font-mono text-gray-500 text-[11px]">{acc.email}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-gray-150 dark:border-slate-700/85 text-gray-600 dark:text-gray-300 rounded text-[10px] font-bold">
                                {acc.role}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                acc.active 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600' 
                                  : 'bg-red-50 dark:bg-red-950/35 text-red-500'
                              }`}>
                                {acc.active ? (isRtl ? 'فعال' : 'Active') : (isRtl ? 'معلق شده' : 'Suspended')}
                              </span>
                            </td>
                            <td className="py-3 text-end">
                              <button
                                onClick={() => handleToggleAdminActive(acc.id)}
                                className={`px-2 py-1 border text-[10px] font-bold rounded cursor-pointer transition-all ${
                                  acc.active 
                                    ? 'border-red-200 text-red-500 hover:bg-red-50' 
                                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                {acc.active ? (isRtl ? 'غیرفعال‌سازی' : 'Deactivate') : (isRtl ? 'فعال‌سازی' : 'Activate')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Platform Configuration (homepage/subscription pricing) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white pb-3 border-b border-gray-150 dark:border-slate-800 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'تنظیمات سراسری و پلتفرم' : 'Platform Configurations'}</span>
                  </h4>

                  <div className="space-y-4">
                    {/* Feature flags mock */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isRtl ? 'کلیدهای تستی قابلیت‌ها' : 'Global Feature Flags'}</span>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg text-xs">
                          <span className="font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'نمایش نقشه پروژه در صفحه جزییات' : 'Detailed Geo Maps'}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded text-[9px] font-bold">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg text-xs">
                          <span className="font-bold text-gray-700 dark:text-gray-300">{isRtl ? 'دانلود مستقیم فمیلی‌های VIP برای همگان' : 'Universal VIP Downloads'}</span>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-gray-400 rounded text-[9px] font-bold">DISABLED</span>
                        </div>
                      </div>
                    </div>

                    {/* Subscription tier Pricing edit mock */}
                    <div className="space-y-3 pt-2">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isRtl ? 'قیمت‌گذاری پایه اشتراک‌ها (تومان)' : 'Subscription Tier Pricing'}</span>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 border border-gray-150 dark:border-slate-800 rounded-lg">
                            <span className="block text-[9px] text-gray-400 font-bold">{isRtl ? 'پلن VIP طراحان' : 'VIP Modeler'}</span>
                            <span className="text-xs font-black text-gray-800 dark:text-white">۱۵۰,۰۰۰ / ماهانه</span>
                          </div>
                          <div className="p-2 border border-gray-150 dark:border-slate-800 rounded-lg">
                            <span className="block text-[9px] text-gray-400 font-bold">{isRtl ? 'پلن VIP کارخانجات' : 'VIP Manufacturer'}</span>
                            <span className="text-xs font-black text-gray-800 dark:text-white">۴,۵۰۰,۰۰۰ / سالانه</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            logAdminAction(
                              'ویرایش تعرفه اشتراک',
                              'Platform Configuration',
                              'Subscription Pricing Structure',
                              'تعدیل قیمت طرح‌های درآمدی به منظور متناسب‌سازی با نرخ تورم سالانه'
                            );
                            toast(isRtl ? 'ساختار قیمت‌گذاری با موفقیت در لایه مانیتورینگ ادمین ذخیره و اعمال شد.' : 'Subscription pricing tier configuration updated.');
                          }}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          {isRtl ? 'ذخیره و بروزرسانی قیمت طرح‌ها' : 'Save Pricing Structure'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB: MANUFACTURER LEADS ==================== */}
          {activeTab === 'manufacturer-leads' && hasAccessTo('manufacturer-leads') && (
            <ManufacturerLeadsAdminView />
          )}

          {/* ==================== TAB: BIM MODELER COLLABORATION APPLICATIONS ==================== */}
          {activeTab === 'bim-modeler-applications' && hasAccessTo('bim-modeler-applications') && (
            <BIMModelerApplicationsAdminView />
          )}

          {/* ==================== TAB 2: MANUFACTURER VERIFICATION & COMPLIANCE ==================== */}
          {activeTab === 'mfg-verification' && hasAccessTo('mfg-verification') && (
            <div className="space-y-6 animate-fadeIn">
              <BrandVerificationAdminView
                mfgProfile={mfgProfile}
                setMfgProfile={setMfgProfile}
                currentAdminName={currentAdmin?.name}
                onLogAction={logAdminAction}
              />

              {/* Manufacturer Request approvals queue */}
              <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="pb-3 border-b border-gray-150 dark:border-slate-800">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white">
                    {isRtl ? 'درخواست‌های احراز هویت کارخانجات تولیدی صنعت ساختمان' : 'Manufacturer Brand Verification Queue'}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {isRtl ? 'به منظور تایید حساب کاربری کارخانجات تجاری، بررسی پروانه بهره‌برداری الزامی است.' : 'Review and approve digital industrial licenses of registered commercial brands.'}
                  </p>
                </div>

                <div className="space-y-4">
                  {mfgRequests.filter(r => r.status === 'Pending').length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs font-bold bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      {isRtl ? 'در حال حاضر هیچ درخواست احراز هویت معلقی در صف موجود نیست.' : 'No pending manufacturer verification requests.'}
                    </div>
                  ) : (
                    mfgRequests.filter(r => r.status === 'Pending').map(req => {
                      return (
                        <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 text-[10px] font-bold rounded">
                                {isRtl ? 'در انتظار بررسی مدارک' : 'Pending Verification'}
                              </span>
                              <h5 className="text-xs font-black text-gray-800 dark:text-white">{req.companyName} ({req.brandName})</h5>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-[10px] text-gray-500 font-medium">
                              <div>{isRtl ? 'مدیرعامل:' : 'CEO Name:'} <span className="text-gray-800 dark:text-white">{req.ceoName}</span></div>
                              <div>{isRtl ? 'تلفن تماس:' : 'Phone:'} <span className="text-gray-850 dark:text-gray-200">{req.phone}</span></div>
                              <div>{isRtl ? 'کد ثبت پروانه:' : 'License Number:'} <span className="text-gray-850 dark:text-gray-200 font-mono">{req.licenseNumber}</span></div>
                              <div>{isRtl ? 'تاریخ درخواست:' : 'Date Submited:'} <span className="text-gray-850 dark:text-gray-200 font-mono">{req.dateSubmitted}</span></div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[10px] text-gray-400 font-bold">{isRtl ? 'سند ضمیمه:' : 'License Doc:'}</span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold underline cursor-pointer">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{req.licenseFile}</span>
                              </span>
                            </div>
                          </div>

                          {/* Decision container */}
                          <div className="flex flex-col gap-2 w-full md:w-auto">
                            <input
                              type="text"
                              id={`reason-input-${req.id}`}
                              placeholder={isRtl ? 'دلیل موافقت یا مخالفت با درخواست تایید...' : 'Provide feedback reason...'}
                              className="w-full md:w-64 py-1.5 px-3 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-lg text-[11px]"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  const rInput = document.getElementById(`reason-input-${req.id}`) as HTMLInputElement;
                                  handleVerifyManufacturer(req.id, false, rInput?.value || '');
                                }}
                                className="px-3 py-1.5 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 text-[10px] font-bold rounded-lg cursor-pointer transition-all"
                              >
                                {isRtl ? 'رد مدارک' : 'Reject Request'}
                              </button>
                              <button
                                onClick={() => {
                                  const rInput = document.getElementById(`reason-input-${req.id}`) as HTMLInputElement;
                                  handleVerifyManufacturer(req.id, true, rInput?.value || 'مدارک و اصالت کارخانه معتبر است.');
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isRtl ? 'احراز اصالت برند' : 'Approve Brand'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Brand Verification Documents Review & Messaging Queue */}
              <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="pb-3 border-b border-gray-150 dark:border-slate-800">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'بررسی اسناد رسمی و مدارک ارسالی کارخانجات' : 'Brand Verification Documents Queue'}</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {isRtl ? 'بررسی، تایید، رد صلاحیت و تبادل مستقیم پیام با کارخانه در رابطه با اسناد بارگذاری‌شده' : 'Inspect, approve, reject, and message manufacturers directly regarding uploaded verification files.'}
                  </p>
                </div>

                <div className="space-y-4">
                  {(!mfgProfile || !mfgProfile.verificationDocs || mfgProfile.verificationDocs.length === 0) ? (
                    <div className="p-8 text-center text-gray-400 text-xs font-bold bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      {isRtl ? 'هیچ سند رسمی برای بررسی ثبت نشده است.' : 'No uploaded verification documents found.'}
                    </div>
                  ) : (
                    mfgProfile.verificationDocs.map((doc: any) => (
                      <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200/60 dark:border-slate-800">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-black text-gray-800 dark:text-white">
                                {isRtl ? doc.nameFa : doc.nameEn}
                              </h5>
                              <span className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                doc.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}>
                                {doc.status === 'Verified' ? (isRtl ? 'تایید شده ✓' : 'Verified') :
                                 doc.status === 'Rejected' ? (isRtl ? 'رد شده ✗' : 'Rejected') :
                                 (isRtl ? 'در انتظار تایید ⏳' : 'Pending Review')}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                              فایل: {doc.fileName || 'بارگذاری نشده'} {doc.date ? `| تاریخ: ${doc.date}` : ''}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              onClick={() => {
                                const input = document.getElementById(`admin-doc-reason-${doc.id}`) as HTMLInputElement;
                                handleAdminDocAction(doc.id, 'reject', input?.value || 'کیفیت مدرک ارسالی خوانا نیست یا فاقد اعتبار می‌باشد.');
                              }}
                              className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 text-[10px] font-extrabold rounded-xl transition-all cursor-pointer"
                            >
                              {isRtl ? 'رد صلاحیت مدرک' : 'Reject Document'}
                            </button>
                            <button
                              onClick={() => {
                                const input = document.getElementById(`admin-doc-reason-${doc.id}`) as HTMLInputElement;
                                handleAdminDocAction(doc.id, 'approve', input?.value || 'اصالت سند احراز شد.');
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-xl transition-all cursor-pointer"
                            >
                              {isRtl ? 'تایید سند' : 'Approve Document'}
                            </button>
                          </div>
                        </div>

                        {/* Input for reason / notes */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            id={`admin-doc-reason-${doc.id}`}
                            placeholder={isRtl ? 'یادداشت یا دلیل تایید/رد سند...' : 'Reason or feedback note for manufacturer...'}
                            className="flex-1 text-[11px] p-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none"
                          />
                        </div>

                        {/* Messages Discussion Thread */}
                        <div className="pt-2 border-t border-gray-200/40 dark:border-slate-800/60 space-y-2">
                          <span className="text-[10.5px] font-bold text-gray-500 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-[#26B6B6]" />
                            <span>{isRtl ? 'گفتگو و مکاتبات پیرامون این سند:' : 'Communication Thread:'}</span>
                          </span>

                          <div className="space-y-1.5 max-h-32 overflow-y-auto p-1 bg-white dark:bg-slate-950/50 rounded-xl border border-gray-100 dark:border-slate-800">
                            {(doc.comments && doc.comments.length > 0) ? (
                              doc.comments.map((comment: any) => (
                                <div key={comment.id} className="p-2 rounded-lg text-[10px] space-y-0.5 bg-slate-50 dark:bg-slate-900">
                                  <div className="flex items-center justify-between font-bold text-[9px]">
                                    <span className={comment.sender === 'Admin' ? 'text-amber-600 dark:text-amber-400' : 'text-[#26B6B6]'}>
                                      {comment.senderName || (comment.sender === 'Admin' ? 'پشتیبانی / کارشناس مرکز' : 'کارخانه')}
                                    </span>
                                    <span className="text-gray-400 font-mono text-[8.5px]">{comment.date}</span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 font-normal">{comment.text}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-[10px] text-gray-400 italic p-1">
                                {isRtl ? 'هنوز هیچ پیامی تبادل نشده است.' : 'No messages in thread yet.'}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              id={`admin-comment-input-${doc.id}`}
                              placeholder={isRtl ? 'ارسال پیام جدید به کارخانه...' : 'Send message to manufacturer...'}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const el = document.getElementById(`admin-comment-input-${doc.id}`) as HTMLInputElement;
                                  if (el) {
                                    handleAdminSendDocComment(doc.id, el.value);
                                    el.value = '';
                                  }
                                }
                              }}
                              className="flex-1 text-[10.5px] p-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const el = document.getElementById(`admin-comment-input-${doc.id}`) as HTMLInputElement;
                                if (el) {
                                  handleAdminSendDocComment(doc.id, el.value);
                                  el.value = '';
                                }
                              }}
                              className="bg-[#26B6B6] hover:bg-[#1e9494] text-white p-2 rounded-xl transition-all cursor-pointer"
                              title={isRtl ? 'ارسال پیام' : 'Send Message'}
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Compliance Panel: Read-only audit trail of object approvals */}
              <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-150 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-black text-gray-800 dark:text-white">
                      {isRtl ? 'میز نظارت و انطباق استاندارد ارزیابی آبجکت‌های BIM (خواندنی)' : 'BIM Objects Review Compliance Portal (Read-only)'}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {isRtl ? 'ردیابی مستقل تصمیمات بررسی‌کنندگان جهت مانیتورینگ عملکرد و جلوگیری از رفتارهای سلیقه‌ای.' : 'Audit and monitor decisions taken by the technical review team to guarantee objective evaluations.'}
                    </p>
                  </div>

                  {/* Escalate action */}
                  <button
                    onClick={() => {
                      const reason = prompt(isRtl ? 'شرح پرونده ارجاعی و دلیل لزوم بررسی اضطراری توسط مدیر ارزیابی:' : 'Describe the escalation details and reason:');
                      if (reason) {
                        logAdminAction(
                          'ارجاع نظارتی تخلف احتمالی یا ناهماهنگی ارزیاب',
                          'Compliance Verification Escalation',
                          'کارگروه بررسی پرونده‌ها',
                          reason,
                          `ارجاع داده شده توسط بازرس انطباق (${currentAdmin.name})`
                        );
                        toast(isRtl ? 'گزارش نظارتی به منظور بررسی نظارتی به مدیر تیم ارزیابی ارجاع داده شد.' : 'Escalation log dispatched to Review Manager.');
                      }
                    }}
                    className="px-3 py-2 border border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>{isRtl ? 'ارجاع اضطراری اختلاف به مدیر ارزیابی' : 'Escalate to Review Manager'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-bold">
                        <th className="py-2.5 text-start">{isRtl ? 'عنوان آبجکت' : 'BIM Asset'}</th>
                        <th className="py-2.5 text-start">{isRtl ? 'کارخانه تولیدی' : 'Manufacturer'}</th>
                        <th className="py-2.5 text-start">{isRtl ? 'ارزیاب پرونده' : 'Auditor / Reviewer'}</th>
                        <th className="py-2.5 text-start">{isRtl ? 'تاریخ ثبت تصمیم' : 'Decision Date'}</th>
                        <th className="py-2.5 text-center">{isRtl ? 'وضعیت نهایی' : 'Final Status'}</th>
                        <th className="py-2.5 text-end">{isRtl ? 'شرح و علت ثبتی تصمیم' : 'Reason Stated'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewObjects.filter(o => o.status !== 'Pending').map(obj => (
                        <tr key={obj.id} className="border-b border-gray-50 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="py-3 font-bold text-gray-800 dark:text-white">{obj.titleFa}</td>
                          <td className="py-3 text-gray-500">{obj.manufacturerName}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300 font-semibold">{obj.assignedName || (isRtl ? 'نامشخص' : 'Unassigned')}</td>
                          <td className="py-3 font-mono text-[11px] text-gray-400">{obj.dateSubmitted}</td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              obj.status === 'Approved' 
                                ? 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600' 
                                : 'bg-red-50 dark:bg-red-950/35 text-red-500'
                            }`}>
                              {obj.status === 'Approved' ? (isRtl ? 'تایید نهایی' : 'Approved') : (isRtl ? 'مردود صلاحیت' : 'Rejected')}
                            </span>
                          </td>
                          <td className="py-3 text-end text-[11px] max-w-xs truncate text-gray-500 font-light" title={obj.reasonDetail || 'مورد تایید است.'}>
                            {obj.reasonDetail || (isRtl ? 'کلیه استانداردها مطابقت دارند.' : 'All requirements matched.')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: REVIEW TEAM MANAGER ==================== */}
          {activeTab === 'review-management' && hasAccessTo('review-management') && (
            <div className="space-y-6 animate-fadeIn">
              {/* Reviewers team listing & performance statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Team & workload */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white pb-3 border-b border-gray-150 dark:border-slate-800">
                    {isRtl ? 'کنترل تیم ارزیابی فنی و ارزیابان پلتفرم' : 'Reviewer Team workload & Performance'}
                  </h4>

                  <div className="space-y-4">
                    {reviewerMetrics.map(rev => {
                      const reviewerAccount = admins.find(a => a.id === rev.reviewerId);
                      return (
                        <div key={rev.reviewerId} className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={reviewerAccount?.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                            <div>
                              <h5 className="text-xs font-black text-gray-800 dark:text-white">{rev.reviewerName}</h5>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {isRtl ? `تعداد کارهای فعال در دست بررسی: ${rev.assignedCount} آبجکت` : `${rev.assignedCount} active review jobs`}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="px-2">
                              <span className="block text-[9px] text-gray-400 font-bold uppercase">{isRtl ? 'موافقت‌ها' : 'Approvals'}</span>
                              <span className="text-xs font-black text-emerald-600">{rev.approvedCount}</span>
                            </div>
                            <div className="px-2">
                              <span className="block text-[9px] text-gray-400 font-bold uppercase">{isRtl ? 'مردودها' : 'Rejections'}</span>
                              <span className="text-xs font-black text-red-500">{rev.rejectedCount}</span>
                            </div>
                            <div className="px-2">
                              <span className="block text-[9px] text-gray-400 font-bold uppercase">{isRtl ? 'سرعت بررسی' : 'Avg Hours'}</span>
                              <span className="text-xs font-black text-indigo-500">{rev.avgTurnaroundHours}h</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Standards Document guidelines edit */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white pb-3 border-b border-gray-150 dark:border-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#26B6B6]" />
                    <span>{isRtl ? 'سند استانداردهای کیفی ارزیابی داخلی' : 'Internal Revit/BIM QA Standards'}</span>
                  </h4>

                  <div className="space-y-2">
                    <textarea
                      value={reviewGuidelines}
                      onChange={(e) => setReviewGuidelines(e.target.value)}
                      rows={6}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl text-xs font-medium leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#26B6B6] focus:border-[#26B6B6]"
                    />
                    <button
                      onClick={() => handleSaveGuidelines(reviewGuidelines)}
                      className="w-full py-2.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold rounded-lg cursor-pointer transition-all active:scale-[0.98]"
                    >
                      {isRtl ? 'بروزرسانی سند استانداردها' : 'Update QA Guidelines'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actionable BIM Object Audit Trail, Reassignments and Overrides */}
              <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="pb-3 border-b border-gray-150 dark:border-slate-800">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white">
                    {isRtl ? 'میز عملیات بررسی کاتالوگ و تخصیص آبجکت‌های BIM' : 'BIM Asset Review Assignments & Overrides Portal'}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {isRtl ? 'مدیریت ارجاع پرونده‌ها، تفویض وظایف ارزیابان و حق وتو در تصمیم‌گیری‌ها همراه با الزام ثبت علت لغو.' : 'Operational delegation of catalog objects. Supervise active reviews, assign folders, or override decisions.'}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-bold">
                        <th className="py-2.5 text-start">{isRtl ? 'عنوان آبجکت' : 'Asset Title'}</th>
                        <th className="py-2.5 text-start">{isRtl ? 'کارخانه تولیدی' : 'Manufacturer'}</th>
                        <th className="py-2.5 text-start">{isRtl ? 'وضعیت' : 'Status'}</th>
                        <th className="py-2.5 text-start">{isRtl ? 'ارزیاب تخصیص یافته' : 'Assigned Auditor'}</th>
                        <th className="py-2.5 text-end">{isRtl ? 'مدیریت و اورراید تصمیم' : 'Operational Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewObjects.map(obj => (
                        <tr key={obj.id} className="border-b border-gray-50 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="py-3.5 font-bold text-gray-800 dark:text-white">
                            <div>
                              <span>{obj.titleFa}</span>
                              <span className="block text-[9px] font-mono font-medium text-gray-400">{obj.category} • {obj.fileSize}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-gray-500">{obj.manufacturerName}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              obj.status === 'Pending' 
                                ? 'bg-amber-50 dark:bg-amber-950/35 text-amber-600'
                                : obj.status === 'Approved'
                                ? 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600'
                                : 'bg-red-50 dark:bg-red-950/35 text-red-500'
                            }`}>
                              {obj.status === 'Pending' ? (isRtl ? 'در انتظار ارزیابی' : 'Pending') : obj.status === 'Approved' ? (isRtl ? 'تایید شده' : 'Approved') : (isRtl ? 'مردود صلاحیت' : 'Rejected')}
                            </span>
                          </td>
                          <td className="py-3.5">
                            {obj.status === 'Pending' ? (
                              <select
                                value={obj.assignedTo || ''}
                                onChange={(e) => handleAssignReviewer(obj.id, e.target.value)}
                                className="p-1 border border-gray-150 dark:border-slate-800 rounded text-[11px] bg-white dark:bg-slate-950 text-gray-800 dark:text-white"
                              >
                                <option value="">{isRtl ? 'تخصیص ارزیاب...' : 'Assign Reviewer...'}</option>
                                {admins.filter(a => a.role === 'Reviewer' && a.active).map(rev => (
                                  <option key={rev.id} value={rev.id}>{rev.name}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-700 dark:text-slate-300 font-bold">{obj.assignedName}</span>
                            )}
                          </td>
                          <td className="py-3.5 text-end">
                            {obj.status !== 'Pending' ? (
                              <div className="flex gap-2 justify-end items-center">
                                <span className="text-[10px] text-gray-400 italic">
                                  {obj.overrideReason ? (isRtl ? 'لغو شده توسط مدیر' : 'Overridden') : ''}
                                </span>
                                <button
                                  onClick={() => {
                                    const nextApprove = obj.status === 'Rejected';
                                    const r = prompt(isRtl ? 'شرح پرونده ارزیابی و علت وتوی حکم ارزیاب:' : 'Explain the technical justification for overriding this decision:');
                                    if (r) {
                                      handleOverrideReviewDecision(obj.id, nextApprove, r);
                                    }
                                  }}
                                  className="px-2 py-1 border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/15 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  {obj.status === 'Approved' ? (isRtl ? 'لغو و تغییر به مردود' : 'Override to Reject') : (isRtl ? 'لغو و تغییر به تایید' : 'Override to Approve')}
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400">{isRtl ? 'پرونده هنوز به تصمیم نرسیده است' : 'Pending decision'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: REVIEWER QUEUE ==================== */}
          {activeTab === 'my-reviews' && hasAccessTo('my-reviews') && (
            <div className="space-y-6 animate-fadeIn">
              {/* Reviewer instructions summary */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/60 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#26B6B6] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-indigo-950 dark:text-indigo-200">
                    {isRtl ? 'دستورالعمل نظارتی ارزیابان فنی ایران‌بیم‌هاب' : 'Official Quality Assurance Checklist'}
                  </h4>
                  <p className="text-[10px] text-indigo-800 dark:text-indigo-400 leading-relaxed font-light mt-1">
                    {isRtl 
                      ? 'ارزیابان محترم، بررسی‌های شما باید فاقد سلیقه شخصی و منطبق بر سند استانداردهای کیفی باشد. برای موارد ریجکت، ثبت دقیق علت نقص به منظور آگاهی و اصلاح سازنده الزامی است.' 
                      : 'Please verify family models objectively against platform requirements. Specific, constructive reasons for rejections protect integrity.'}
                  </p>
                </div>
              </div>

              {/* Review Queue */}
              <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="pb-3 border-b border-gray-150 dark:border-slate-800">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white">
                    {isRtl ? 'صندوق کار کلاس‌های بیم محول شده به شما' : 'Your Assigned BIM Object Review Queue'}
                  </h4>
                </div>

                <div className="space-y-4">
                  {reviewObjects.filter(o => o.assignedTo === currentAdmin.id && o.status === 'Pending').length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs font-bold bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      {isRtl ? 'در حال حاضر هیچ فمیلی ارسالی معلقی به شما تخصیص نیافته است.' : 'Excellent work! Your queue is completely clean.'}
                    </div>
                  ) : (
                    reviewObjects.filter(o => o.assignedTo === currentAdmin.id && o.status === 'Pending').map(obj => (
                      <div key={obj.id} className="p-5 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="px-2.5 py-0.5 bg-[#26B6B6]/10 text-[#26B6B6] text-[9px] font-black rounded border border-[#26B6B6]/20">
                              {obj.category}
                            </span>
                            <h5 className="text-xs font-black text-gray-850 dark:text-white mt-1.5">{obj.titleFa}</h5>
                            <p className="text-[10px] font-mono text-gray-400 mt-0.5">{obj.titleEn}</p>
                          </div>

                          <div className="text-end text-[10px] text-gray-400 space-y-0.5">
                            <div>{isRtl ? 'سازنده:' : 'Manufacturer:'} <span className="text-gray-800 dark:text-white font-bold">{obj.manufacturerName}</span></div>
                            <div>{isRtl ? 'اندازه فمیلی:' : 'File Size:'} <span className="font-mono text-gray-800 dark:text-white">{obj.fileSize}</span></div>
                            <div>{isRtl ? 'فرمت‌های ارسالی:' : 'Formats:'} <span className="font-mono text-indigo-600 font-bold">{obj.formats.join(', ')}</span></div>
                          </div>
                        </div>

                        {/* Simulate download of family file */}
                        <div className="flex items-center gap-2 py-1.5 px-3 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-xl max-w-max">
                          <span className="text-[10px] text-gray-400 font-bold">{isRtl ? 'دریافت فایل جهت بازبینی فنی:' : 'Download for local inspection:'}</span>
                          <button
                            onClick={() => toast(isRtl ? `دریافت فایل خانواده رویت برای مدل «${obj.titleFa}» جهت آنالیز LOD 400.` : `Downloading Revit Family file...`)}
                            className="inline-flex items-center gap-1 text-[10px] text-cyan-600 dark:text-cyan-400 font-bold underline cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Download RFA</span>
                          </button>
                        </div>

                        {/* Action Decision block */}
                        <div className="pt-3 border-t border-gray-150 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex flex-1 gap-2">
                            {/* Rejection structured categories */}
                            <select
                              id={`rej-code-${obj.id}`}
                              className="py-1.5 px-2 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-lg text-[11px] text-gray-800 dark:text-white"
                            >
                              <option value="Incorrect metadata">{isRtl ? 'نقص در اطلاعات متاداده' : 'Incorrect metadata'}</option>
                              <option value="File format issue">{isRtl ? 'اشکال در نسخه یا ساختار فایل' : 'File format issue'}</option>
                              <option value="Incorrect certification claim">{isRtl ? 'ابهام در مجوزها و استاندارد ادعایی' : 'Incorrect certification claim'}</option>
                              <option value="Low-quality model">{isRtl ? 'کیفیت پایین مدل‌سازی و هندسه کاهنده رویت' : 'Low-quality model'}</option>
                            </select>

                            <input
                              type="text"
                              id={`rej-detail-${obj.id}`}
                              placeholder={isRtl ? 'توضیحات تکمیلی علت رد صلاحیت...' : 'Additional technical details of rejection reason...'}
                              className="flex-1 py-1.5 px-3 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-lg text-[11px]"
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                const codeEl = document.getElementById(`rej-code-${obj.id}`) as HTMLSelectElement;
                                const detailEl = document.getElementById(`rej-detail-${obj.id}`) as HTMLInputElement;
                                handleReviewDecision(obj.id, false, codeEl?.value || 'Low-quality model', detailEl?.value || '');
                              }}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-extrabold rounded-lg cursor-pointer"
                            >
                              {isRtl ? 'عدم تایید و رد فنی' : 'Reject Asset'}
                            </button>
                            <button
                              onClick={() => {
                                handleReviewDecision(obj.id, true, '', 'تمام پارامترهای LOD400 منطبق هستند.');
                              }}
                              className="px-4 py-1.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[10px] font-extrabold rounded-lg cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'تایید انطباق کیفی' : 'Approve Asset'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Personal Past history */}
              <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <h4 className="text-sm font-black text-gray-800 dark:text-white pb-3 border-b border-gray-150 dark:border-slate-800">
                  {isRtl ? 'سابقه ارزیابی‌های گذشته شما' : 'Your Personal Past Audits History'}
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-bold">
                        <th className="py-2 text-start">{isRtl ? 'عنوان آبجکت' : 'BIM Asset'}</th>
                        <th className="py-2 text-start">{isRtl ? 'کارخانه تولیدی' : 'Manufacturer'}</th>
                        <th className="py-2 text-center">{isRtl ? 'تصمیم شما' : 'Decision'}</th>
                        <th className="py-2 text-end">{isRtl ? 'توضیحات ثبت شده علت' : 'Stated Reason'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewObjects.filter(o => o.assignedTo === currentAdmin.id && o.status !== 'Pending').map(past => (
                        <tr key={past.id} className="border-b border-gray-50 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="py-2.5 font-bold text-gray-800 dark:text-white">{past.titleFa}</td>
                          <td className="py-2.5 text-gray-500">{past.manufacturerName}</td>
                          <td className="py-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              past.status === 'Approved' 
                                ? 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600' 
                                : 'bg-red-50 dark:bg-red-950/35 text-red-500'
                            }`}>
                              {past.status === 'Approved' ? (isRtl ? 'مورد تایید' : 'Approved') : (isRtl ? 'مردود' : 'Rejected')}
                            </span>
                          </td>
                          <td className="py-2.5 text-end text-[11px] text-gray-500 max-w-xs truncate" title={past.reasonDetail}>
                            {past.reasonDetail || (isRtl ? 'کلیه استانداردهای هندسی مطابقت دارند.' : 'All standards verified.')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: SUPPORT TICKETS ==================== */}
          {activeTab === 'support-tickets' && hasAccessTo('support-tickets') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
                {/* Tickets list */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-3xl p-4 flex flex-col overflow-hidden">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">
                    {isRtl ? 'تیکت‌های ورودی معلق پشتیبانی' : 'Active Helpdesk Tickets'}
                  </span>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {tickets.map(tkt => (
                      <div
                        key={tkt.id}
                        onClick={() => setSelectedTicketId(tkt.id)}
                        className={`p-3 border rounded-2xl cursor-pointer transition-all text-start ${
                          selectedTicketId === tkt.id
                            ? 'bg-[#26B6B6]/10 border-[#26B6B6]'
                            : 'bg-slate-50 dark:bg-slate-900 border-gray-150 dark:border-slate-850 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-gray-400 font-mono">{tkt.refNumber ? tkt.refNumber : `#${tkt.id}`}{tkt.refNumber ? (isRtl ? ' • وب‌سایت' : ' • Website') : ''}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            tkt.status === 'Open'
                              ? 'bg-red-50 dark:bg-red-950/30 text-red-500'
                              : tkt.status === 'In Progress'
                              ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-500'
                              : tkt.status === 'Escalated'
                              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-500'
                              : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500'
                          }`}>
                            {tkt.status === 'Open' ? (isRtl ? 'جدید' : 'Open') : tkt.status === 'In Progress' ? (isRtl ? 'در حال پاسخ' : 'In Progress') : tkt.status === 'Escalated' ? (isRtl ? 'ارجاع شده' : 'Escalated') : (isRtl ? 'پاسخ داده شده' : 'Resolved')}
                          </span>
                        </div>

                        <h5 className="text-xs font-black text-gray-800 dark:text-white truncate">{tkt.subject}</h5>
                        <p className="text-[10px] text-gray-500 truncate mt-1 leading-relaxed">{tkt.message}</p>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50 dark:border-slate-800 text-[9px] text-gray-400">
                          <span>{tkt.userEmail}</span>
                          <span className="font-mono">{tkt.dateCreated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticket Chat / Interactive window */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-3xl p-5 flex flex-col overflow-hidden text-start">
                  {selectedTicketId ? (() => {
                    const activeTkt = tickets.find(t => t.id === selectedTicketId);
                    if (!activeTkt) return null;

                    return (
                      <div className="flex-1 flex flex-col justify-between overflow-hidden">
                        {/* Header of chat */}
                        <div className="pb-3 border-b border-gray-150 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                          <div>
                            <h4 className="text-xs font-black text-gray-850 dark:text-white">{activeTkt.subject}</h4>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{activeTkt.userEmail} ({activeTkt.userRole})</p>
                          </div>

                          {/* Escalation buttons */}
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleEscalateTicket(activeTkt.id, 'Finance')}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 rounded text-[9px] font-black cursor-pointer"
                            >
                              {isRtl ? 'ارجاع به واحد مالی' : 'Escalate to Finance'}
                            </button>
                            <button
                              onClick={() => handleEscalateTicket(activeTkt.id, 'Review Manager')}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 rounded text-[9px] font-black cursor-pointer"
                            >
                              {isRtl ? 'ارجاع به مدیر ارزیابی' : 'Escalate to Review Mgr'}
                            </button>
                          </div>
                        </div>

                        {/* Messages logs */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl my-3">
                          {activeTkt.messages.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-3 max-w-sm rounded-2xl text-xs leading-relaxed shadow-sm ${
                                m.sender === 'admin'
                                  ? 'bg-[#26B6B6] text-white rounded-tr-none'
                                  : 'bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-850 text-gray-800 dark:text-gray-200 rounded-tl-none'
                              }`}>
                                <p>{m.text}</p>
                                <span className={`block text-[8px] mt-1.5 text-end ${m.sender === 'admin' ? 'text-white/70' : 'text-gray-400'}`}>
                                  {m.timestamp}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Quick Canned responses selectors */}
                        <div className="flex-shrink-0 space-y-2 pb-2">
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">{isRtl ? 'قالب‌های پاسخ سریع پشتیبانان' : 'Quick Response Canned Templates'}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {CANNED_RESPONSES.map(tpl => (
                              <button
                                key={tpl.id}
                                onClick={() => handleApplyCanned(tpl.text)}
                                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#26B6B6]/10 hover:text-[#26B6B6] rounded-full text-[9px] font-bold transition-all text-gray-600 dark:text-gray-300 cursor-pointer"
                              >
                                {tpl.title}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Input chat panel */}
                        <div className="flex gap-2 items-center flex-shrink-0 pt-2 border-t border-gray-150 dark:border-slate-800">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={isRtl ? 'پاسخ خود را بنویسید...' : 'Write your official personnel message...'}
                            className="flex-1 py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#26B6B6] focus:border-[#26B6B6]"
                          />
                          <button
                            onClick={() => handleSendTicketReply(activeTkt.id)}
                            className="p-2.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-10">
                      <HelpCircle className="w-12 h-12 text-[#26B6B6]/20 mb-3" />
                      <h4 className="text-xs font-black text-gray-600 dark:text-gray-400">{isRtl ? 'هیچ تیکتی انتخاب نشده است' : 'No Ticket Selected'}</h4>
                      <p className="text-[10px] mt-1 max-w-xs">{isRtl ? 'لطفاً از پنل سمت راست یک تیکت پشتیبانی برای بررسی مکاتبات انتخاب نمایید.' : 'Select a ticket to review communications history and apply official canned assistance.'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 6: FINANCE BILLING ==================== */}
          {activeTab === 'finance-billing' && hasAccessTo('finance-billing') && (
            <div className="space-y-6 animate-fadeIn">
              {/* Refund Requests Queue */}
              <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="pb-3 border-b border-gray-150 dark:border-slate-800">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white">
                    {isRtl ? 'درخواست‌های بازپرداخت و عودت وجه کارخانجات' : 'B2B Brand Refund Claims Queue'}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {isRtl ? 'بررسی تراکنش‌های بازگشتی یا کسر حساب مضاعف سازندگان همراه با الزام تاییدیه نهایی.' : 'Process B2B refund requests according to service-level satisfaction limits.'}
                  </p>
                </div>

                <div className="space-y-3">
                  {refundRequests.filter(r => r.status === 'Pending').length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs font-bold bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      {isRtl ? 'در حال حاضر هیچ ادعای استرداد وجه معلقی یافت نشد.' : 'All refund claims resolved.'}
                    </div>
                  ) : (
                    refundRequests.filter(r => r.status === 'Pending').map(ref => (
                      <div key={ref.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 text-start">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-[10px] font-black rounded font-mono">#{ref.id}</span>
                            <h5 className="text-xs font-black text-gray-850 dark:text-white">{ref.companyName}</h5>
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {isRtl ? 'مبلغ بازپرداخت:' : 'Claim Amount:'} <span className="text-rose-500 font-black font-mono">{(ref.amount / 10).toLocaleString()} تومان</span>
                          </p>
                          <p className="text-[10px] text-gray-400 font-light italic">
                            {isRtl ? 'علت استرداد:' : 'Claim Reason:'} {ref.reason}
                          </p>
                        </div>

                        {/* Decisions inputs */}
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <input
                            type="text"
                            id={`ref-reason-${ref.id}`}
                            placeholder={isRtl ? 'دلیل رد یا تایید مالی...' : 'Stated refund reason...'}
                            className="w-full md:w-64 py-1.5 px-3 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-lg text-[11px]"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                const rEl = document.getElementById(`ref-reason-${ref.id}`) as HTMLInputElement;
                                handleProcessRefund(ref.id, false, rEl?.value || '');
                              }}
                              className="px-3 py-1.5 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 text-[10px] font-bold rounded-lg cursor-pointer transition-all"
                            >
                              {isRtl ? 'مخالفت و رد استرداد' : 'Reject Claim'}
                            </button>
                            <button
                              onClick={() => {
                                const rEl = document.getElementById(`ref-reason-${ref.id}`) as HTMLInputElement;
                                handleProcessRefund(ref.id, true, rEl?.value || 'مورد تایید شد و تراکنش اصلاحیه صادر شد.');
                              }}
                              className="px-3 py-1.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'صدور تاییدیه عودت وجه' : 'Approve Refund'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* General billing, subscriptions, invoices list */}
              <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-150 dark:border-slate-800">
                  <h4 className="text-sm font-black text-gray-800 dark:text-white">
                    {isRtl ? 'سوابق مالی، اشتراک‌ها و صدور فاکتور پلتفرم' : 'Global Platform Billing Log'}
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-bold">
                        <th className="py-2.5 text-start">{isRtl ? 'کد فاکتور' : 'Invoice ID'}</th>
                        <th className="py-2.5 text-start">{isRtl ? 'نام کارفرما / برند' : 'Company Brand'}</th>
                        <th className="py-2.5 text-start">{isRtl ? 'نوع طرح درآمدی' : 'Plan Type'}</th>
                        <th className="py-2.5 text-start">{isRtl ? 'تاریخ صدور' : 'Date'}</th>
                        <th className="py-2.5 text-center">{isRtl ? 'وضعیت تراکنش' : 'Payment Status'}</th>
                        <th className="py-2.5 text-end">{isRtl ? 'مبلغ نهایی (تومان)' : 'Amount'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(inv => (
                        <tr key={inv.id} className="border-b border-gray-50 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="py-3 font-mono text-[11px] font-bold text-gray-400">#{inv.id}</td>
                          <td className="py-3 font-bold text-gray-800 dark:text-white">
                            <div>
                              <span>{inv.companyName}</span>
                              <span className="block text-[9px] font-medium text-gray-400">{inv.userEmail}</span>
                            </div>
                          </td>
                          <td className="py-3 font-bold text-gray-500">{inv.planName}</td>
                          <td className="py-3 font-mono text-gray-400 text-[11px]">{inv.date}</td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              inv.status === 'Paid'
                                ? 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600'
                                : inv.status === 'Refunded'
                                ? 'bg-slate-100 dark:bg-slate-800 text-gray-500'
                                : inv.status === 'Disputed'
                                ? 'bg-amber-50 dark:bg-amber-950/35 text-amber-500 font-bold'
                                : 'bg-red-50 dark:bg-red-950/35 text-red-500'
                            }`}>
                              {inv.status === 'Paid' ? (isRtl ? 'تصفیه شده' : 'Paid') : inv.status === 'Refunded' ? (isRtl ? 'عودت وجه' : 'Refunded') : inv.status === 'Disputed' ? (isRtl ? 'حل‌نشده مالی' : 'Disputed') : (isRtl ? 'ناموفق' : 'Failed')}
                            </span>
                          </td>
                          <td className="py-3 text-end font-mono font-black text-gray-800 dark:text-white text-xs">
                            {(inv.amount / 10).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 7: PERMANENT AUDIT TRAIL ==================== */}
          {activeTab === 'audit-logs' && hasAccessTo('audit-logs') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-gray-150 dark:border-slate-800 gap-3 text-start">
                  <div>
                    <h4 className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-2">
                      <History className="w-4 h-4 text-emerald-500" />
                      <span>{isRtl ? 'سند دائمی و ابطال‌ناپذیر ردپای ارزیابی ایران‌بیم‌هاب' : 'Platform Immutable Audit Log & Transactions Trail'}</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {isRtl ? 'هرگونه تایید، رد ارزیابی، تغییر ادمین و وتو با شناسه ادمین، زمان دقیق و ادله فنی جهت تضمین اصل پاسخگویی ثبت می‌گردد.' : 'Every approval, override, role modification, or credential deactivation is permanently recorded below.'}
                    </p>
                  </div>

                  {/* Filter and search */}
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={isRtl ? 'جستجو در اقدامات...' : 'Search actions...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-1.5 pr-8 pl-3 border border-gray-150 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
                    </div>

                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="py-1.5 px-2.5 border border-gray-150 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-white font-medium"
                    >
                      <option value="all">{isRtl ? 'فیلتر نقش...' : 'Filter role...'}</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Manufacturer Verification Admin">Manufacturer Verification Admin</option>
                      <option value="Review Team Manager">Review Team Manager</option>
                      <option value="Reviewer">Reviewer</option>
                      <option value="Support & Customer Success">Support Admin</option>
                      <option value="Finance & Subscription">Finance Admin</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto text-start">
                  <table className="w-full text-start text-xs leading-relaxed">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-bold">
                        <th className="py-2 text-start">{isRtl ? 'زمان وقوع' : 'Timestamp'}</th>
                        <th className="py-2 text-start">{isRtl ? 'کاربر ادمین مسئول' : 'Responsible Admin'}</th>
                        <th className="py-2 text-start">{isRtl ? 'نقش' : 'Role'}</th>
                        <th className="py-2 text-start">{isRtl ? 'نوع اقدام ثبتی' : 'Action Type'}</th>
                        <th className="py-2 text-start">{isRtl ? 'مورد مرجع' : 'Target Entity'}</th>
                        <th className="py-2 text-end">{isRtl ? 'علت یا توضیحات ثبتی' : 'Justification Stated'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs
                        .filter(log => {
                          // Apply role visibility constraints
                          if (currentAdmin.role === 'Manufacturer Verification Admin') {
                            // Only can see object approval decisions, and manufacturer verifications
                            return ['BIM Object Review', 'Manufacturer Onboarding', 'Compliance Verification Escalation'].includes(log.targetType);
                          }
                          if (currentAdmin.role === 'Review Team Manager') {
                            // Only sees object review actions, assignments and overrides
                            return ['BIM Object Review', 'BIM Object Assignment', 'BIM Object Decision Override', 'Standard Guidelines'].includes(log.targetType);
                          }
                          return true; // Super admin sees everything unfiltered
                        })
                        .filter(log => {
                          const queryMatch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            log.reason.toLowerCase().includes(searchQuery.toLowerCase());
                          const roleMatch = filterRole === 'all' || log.adminRole === filterRole;
                          return queryMatch && roleMatch;
                        })
                        .map(log => (
                          <tr key={log.id} className="border-b border-gray-50 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                            <td className="py-3 font-mono text-[11px] text-gray-400">{log.timestamp}</td>
                            <td className="py-3 font-black text-gray-850 dark:text-white">{log.adminName}</td>
                            <td className="py-3 text-[10px] text-gray-500 font-bold">{log.adminRole}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-[#26B6B6] dark:text-[#26B6B6] rounded text-[10px] font-bold">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3 font-bold text-gray-700 dark:text-slate-300">
                              <div>
                                <span>{log.targetName}</span>
                                <span className="block text-[9px] font-medium text-gray-400">{log.targetType}</span>
                              </div>
                            </td>
                            <td className="py-3 text-end text-[11px] font-light text-gray-500 max-w-sm" title={log.details || ''}>
                              <div>
                                <p>{log.reason}</p>
                                {log.details && <p className="text-[9px] font-mono text-[#26B6B6] mt-0.5">{log.details}</p>}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 8: THEME & LAYOUT BUILDER ==================== */}
          {activeTab === 'theme-builder' && hasAccessTo('theme-builder') && localConfig && (
            <div className="space-y-6 animate-fadeIn text-start">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#26B6B6]" />
                    <span>{isRtl ? 'مدیریت قالب و چیدمان' : 'Theme & Layout Builder'}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRtl ? 'ساختار بصری صفحات و اطلاعات پایه پلتفرم را ویرایش کنید.' : 'Configure the visual layout and global site settings.'}
                  </p>
                </div>
                <button
                  onClick={handleSaveThemeConfig}
                  className="px-5 py-2.5 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isRtl ? 'ذخیره تغییرات قالب' : 'Save Theme Configuration'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Landing Page Layout Builder */}
                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4">
                    {isRtl ? 'چیدمان صفحه اصلی (Landing Page)' : 'Landing Page Layout'}
                  </h4>
                  <div className="space-y-2">
                    {localConfig.landingPageOrder.map((section: string, idx: number) => (
                      <div key={section} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl transition-all hover:border-[#26B6B6]/40">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 font-mono flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-gray-500">{idx + 1}</span>
                          {section}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 text-gray-400 hover:text-[#26B6B6] disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                          </button>
                          <button
                            onClick={() => handleMoveSection(idx, 'down')}
                            disabled={idx === localConfig.landingPageOrder.length - 1}
                            className="p-1.5 text-gray-400 hover:text-[#26B6B6] disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hero Banners Manager */}
                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                      {isRtl ? 'مدیریت بنرهای صفحه اصلی (Hero Banners)' : 'Hero Banners Manager'}
                    </h4>
                    <button
                      onClick={() => setLocalConfig({...localConfig, heroBanners: [...(localConfig.heroBanners || []), {
                        id: 'slide-' + Date.now(), labelFa: '', labelEn: '', numFa: '', numEn: '',
                        badgeFa: '', badgeEn: '', headingFa: '', headingEn: '', descFa: '', descEn: '', bgImage: '', overlay: 'bg-black/40'
                      }]})}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#26B6B6] dark:text-[#26B6B6] text-xs font-bold rounded-lg transition-all"
                    >
                      {isRtl ? '+ افزودن بنر جدید' : '+ Add New Banner'}
                    </button>
                  </div>

                  {/* Manufacturer Hero Video Setting */}
                  <div className="mb-5 rounded-2xl border border-[#26B6B6]/20 bg-[#26B6B6]/5 p-4">
                    <label className="block text-xs font-black text-gray-800 dark:text-white mb-2">
                      {isRtl ? 'لینک ویدیوی آپارات برای اسلاید تولیدکنندگان' : 'Aparat Video URL for the Manufacturers Hero Slide'}
                    </label>
                    <input
                      type="url"
                      value={localConfig.manufacturerHeroVideoUrl || ''}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        manufacturerHeroVideoUrl: e.target.value
                      })}
                      placeholder="https://www.aparat.com/v/VIDEO_HASH"
                      dir="ltr"
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#26B6B6]/30 focus:border-[#26B6B6]"
                    />
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${localConfig.manufacturerHeroVideoUrl?.trim() ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <p className="text-[10px] leading-relaxed text-gray-500 dark:text-gray-400">
                          {localConfig.manufacturerHeroVideoUrl?.trim()
                            ? (isRtl ? 'لینک وارد شده است؛ برای فعال‌شدن در Hero ذخیره کنید.' : 'URL entered; save to activate it in the Hero.')
                            : (isRtl ? 'هنوز لینک ویدیویی ثبت نشده است.' : 'No video URL has been added yet.')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {localConfig.manufacturerHeroVideoUrl?.trim() && (
                          <button
                            type="button"
                            onClick={() => setLocalConfig({
                              ...localConfig,
                              manufacturerHeroVideoUrl: ''
                            })}
                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-[10px] font-black text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            {isRtl ? 'پاک‌کردن' : 'Clear'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleSaveThemeConfig}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#26B6B6] hover:bg-[#1e9494] text-white text-[10px] font-black transition-all shadow-sm hover:shadow-md cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'ذخیره لینک ویدیو' : 'Save Video Link'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Video card title + thumbnail (also shown site-wide on hero slide 3) */}
                    <div className="mt-4 pt-4 border-t border-[#26B6B6]/15 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5">{isRtl ? 'عنوان کارت ویدیو (فارسی)' : 'Video Card Title (FA)'}</label>
                        <input
                          type="text"
                          value={localConfig.manufacturerHeroVideoTitleFa || ''}
                          onChange={(e) => setLocalConfig({ ...localConfig, manufacturerHeroVideoTitleFa: e.target.value })}
                          placeholder={isRtl ? 'پیش‌فرض: چطور محصول شما وارد مسیر طراحی می‌شود؟' : 'Default title applies if empty'}
                          className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs outline-none focus:border-[#26B6B6]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5">{isRtl ? 'عنوان کارت ویدیو (انگلیسی)' : 'Video Card Title (EN)'}</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={localConfig.manufacturerHeroVideoTitleEn || ''}
                          onChange={(e) => setLocalConfig({ ...localConfig, manufacturerHeroVideoTitleEn: e.target.value })}
                          placeholder="Default: How does your product enter the design process?"
                          className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-left outline-none focus:border-[#26B6B6]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5">{isRtl ? 'تصویر بندانگشتی ویدیو (Thumbnail URL — اختیاری)' : 'Video Thumbnail URL (optional)'}</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={localConfig.manufacturerHeroVideoThumbnail || ''}
                          onChange={(e) => setLocalConfig({ ...localConfig, manufacturerHeroVideoThumbnail: e.target.value })}
                          placeholder="/hero/video-thumbnail.jpg — خالی = تصویر پس‌زمینهٔ اسلاید"
                          className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-[11px] font-mono text-left outline-none focus:border-[#26B6B6]"
                        />
                      </div>
                    </div>

                    <p className="mt-2 text-[10px] leading-relaxed text-gray-500 dark:text-gray-400">
                      {isRtl
                        ? 'لینک صفحه یا لینک embed آپارات را وارد کنید. ویدیو فقط پس از کلیک کاربر در پنجرهٔ ویدیو بارگذاری می‌شود.'
                        : 'Enter an Aparat page or embed URL. The video loads only after the user clicks the poster.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {(localConfig.heroBanners || []).map((banner: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl space-y-3 relative group">
                        <button 
                          onClick={() => {
                            const newBanners = [...(localConfig.heroBanners || [])];
                            newBanners.splice(idx, 1);
                            setLocalConfig({...localConfig, heroBanners: newBanners});
                          }}
                          className="absolute top-4 left-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={isRtl ? 'حذف این بنر' : 'Delete Banner'}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'تیتر اصلی (فارسی)' : 'Heading (FA)'}</label>
                            <input 
                              type="text" 
                              value={banner.headingFa || ''}
                              onChange={(e) => {
                                const newBanners = [...localConfig.heroBanners];
                                newBanners[idx].headingFa = e.target.value;
                                setLocalConfig({...localConfig, heroBanners: newBanners});
                              }}
                              className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1.5">Heading (EN)</label>
                            <input 
                              type="text" 
                              value={banner.headingEn || ''}
                              onChange={(e) => {
                                const newBanners = [...localConfig.heroBanners];
                                newBanners[idx].headingEn = e.target.value;
                                setLocalConfig({...localConfig, heroBanners: newBanners});
                              }}
                              className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-left" dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'توضیحات (فارسی)' : 'Description (FA)'}</label>
                            <textarea 
                              value={banner.descFa || ''}
                              onChange={(e) => {
                                const newBanners = [...localConfig.heroBanners];
                                newBanners[idx].descFa = e.target.value;
                                setLocalConfig({...localConfig, heroBanners: newBanners});
                              }}
                              className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950" rows={2}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1.5">Description (EN)</label>
                            <textarea 
                              value={banner.descEn || ''}
                              onChange={(e) => {
                                const newBanners = [...localConfig.heroBanners];
                                newBanners[idx].descEn = e.target.value;
                                setLocalConfig({...localConfig, heroBanners: newBanners});
                              }}
                              className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-left" dir="ltr" rows={2}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'تصویر پس‌زمینه (URL)' : 'Background Image (URL)'}</label>
                            <input 
                              type="text" 
                              value={banner.bgImage || ''}
                              onChange={(e) => {
                                const newBanners = [...localConfig.heroBanners];
                                newBanners[idx].bgImage = e.target.value;
                                setLocalConfig({...localConfig, heroBanners: newBanners});
                              }}
                              className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-left" dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'برچسب (فارسی)' : 'Badge (FA)'}</label>
                            <input 
                              type="text" 
                              value={banner.badgeFa || ''}
                              onChange={(e) => {
                                const newBanners = [...localConfig.heroBanners];
                                newBanners[idx].badgeFa = e.target.value;
                                setLocalConfig({...localConfig, heroBanners: newBanners});
                              }}
                              className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!localConfig.heroBanners || localConfig.heroBanners.length === 0) && (
                      <div className="text-center py-6 text-xs text-gray-400 font-bold border border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
                        {isRtl ? 'هیچ بنری تنظیم نشده است.' : 'No banners added yet.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expert Insights Manager */}
                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h4 className="text-sm font-black text-gray-800 dark:text-white">{isRtl ? 'دیدگاه متخصصان BIM' : 'BIM Expert Insights'}</h4>
                      <p className="text-[10px] text-gray-500 mt-1">{isRtl ? 'این بخش برای دیدگاه‌های واقعی و تأییدشدهٔ متخصصان است؛ نه رضایت مشتری یا نظر ساختگی.' : 'Use this for real, approved professional perspectives — not fabricated testimonials.'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocalConfig({ ...localConfig, expertInsights: [...(localConfig.expertInsights || []), { id: `insight-${Date.now()}`, nameFa: '', nameEn: '', roleFa: '', roleEn: '', quoteFa: '', quoteEn: '', profileUrl: '', isPublished: false }] })}
                      className="px-3 py-2 bg-[#26B6B6]/10 text-[#087F7A] dark:text-[#22D3EE] text-xs font-black rounded-xl hover:bg-[#26B6B6]/20 transition-colors cursor-pointer"
                    >{isRtl ? '+ افزودن دیدگاه' : '+ Add insight'}</button>
                  </div>
                  <div className="space-y-4">
                    {(localConfig.expertInsights || []).map((item: any, index: number) => (
                      <div key={item.id || index} className="rounded-2xl border border-gray-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-black text-[#087F7A] dark:text-[#22D3EE]">{isRtl ? `دیدگاه ${index + 1}` : `Insight ${index + 1}`}</span>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 cursor-pointer">
                              <input type="checkbox" checked={Boolean(item.isPublished)} onChange={(e) => { const rows = [...(localConfig.expertInsights || [])]; rows[index] = { ...rows[index], isPublished: e.target.checked }; setLocalConfig({ ...localConfig, expertInsights: rows }); }} className="accent-[#0FB9B1]" />
                              {isRtl ? 'نمایش عمومی' : 'Publish'}
                            </label>
                            <button type="button" onClick={() => { const rows = [...(localConfig.expertInsights || [])]; rows.splice(index, 1); setLocalConfig({ ...localConfig, expertInsights: rows }); }} className="text-[10px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer">{isRtl ? 'حذف' : 'Delete'}</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input value={item.nameFa || ''} onChange={(e) => { const rows = [...(localConfig.expertInsights || [])]; rows[index] = { ...rows[index], nameFa: e.target.value }; setLocalConfig({ ...localConfig, expertInsights: rows }); }} placeholder={isRtl ? 'نام و نام خانوادگی — فارسی' : 'Name — Persian'} className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs" />
                          <input value={item.roleFa || ''} onChange={(e) => { const rows = [...(localConfig.expertInsights || [])]; rows[index] = { ...rows[index], roleFa: e.target.value }; setLocalConfig({ ...localConfig, expertInsights: rows }); }} placeholder={isRtl ? 'نقش حرفه‌ای — فارسی' : 'Role — Persian'} className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs" />
                          <textarea value={item.quoteFa || ''} onChange={(e) => { const rows = [...(localConfig.expertInsights || [])]; rows[index] = { ...rows[index], quoteFa: e.target.value }; setLocalConfig({ ...localConfig, expertInsights: rows }); }} placeholder={isRtl ? 'متن دیدگاه واقعی و تأییدشده — فارسی' : 'Approved perspective — Persian'} rows={3} className="md:col-span-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs leading-6" />
                          <input value={item.nameEn || ''} onChange={(e) => { const rows = [...(localConfig.expertInsights || [])]; rows[index] = { ...rows[index], nameEn: e.target.value }; setLocalConfig({ ...localConfig, expertInsights: rows }); }} placeholder="Name — English" dir="ltr" className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs" />
                          <input value={item.roleEn || ''} onChange={(e) => { const rows = [...(localConfig.expertInsights || [])]; rows[index] = { ...rows[index], roleEn: e.target.value }; setLocalConfig({ ...localConfig, expertInsights: rows }); }} placeholder="Role — English" dir="ltr" className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs" />
                          <textarea value={item.quoteEn || ''} onChange={(e) => { const rows = [...(localConfig.expertInsights || [])]; rows[index] = { ...rows[index], quoteEn: e.target.value }; setLocalConfig({ ...localConfig, expertInsights: rows }); }} placeholder="Approved perspective — English" dir="ltr" rows={3} className="md:col-span-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs leading-6" />
                        </div>
                      </div>
                    ))}
                    {(localConfig.expertInsights || []).length === 0 && <div className="rounded-xl border border-dashed border-gray-200 dark:border-slate-700 py-7 text-center text-xs text-gray-400">{isRtl ? 'هنوز دیدگاهی ثبت نشده است.' : 'No insights have been added yet.'}</div>}
                  </div>
                  <button type="button" onClick={handleSaveThemeConfig} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0FB9B1] hover:bg-[#087F7A] px-4 py-2 text-xs font-black text-white cursor-pointer"><CheckCircle className="w-4 h-4" />{isRtl ? 'ذخیره دیدگاه‌ها' : 'Save insights'}</button>
                </div>

                {/* Footer Settings */}
                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-2">
                    {isRtl ? 'تنظیمات ارتباطی و فوتر' : 'Footer & Contact Info'}
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'ایمیل پشتیبانی' : 'Support Email'}</label>
                        <input 
                          type="email" 
                          value={localConfig.footer.email}
                          onChange={(e) => setLocalConfig({...localConfig, footer: {...localConfig.footer, email: e.target.value}})}
                          className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-lg text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'تلفن تماس مرکز' : 'Phone Number'}</label>
                        <input 
                          type="text" 
                          value={localConfig.footer.phone}
                          onChange={(e) => setLocalConfig({...localConfig, footer: {...localConfig.footer, phone: e.target.value}})}
                          className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-lg text-xs" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'آدرس مرکزی (فارسی)' : 'Address (FA)'}</label>
                      <textarea 
                        value={localConfig.footer.addressFa}
                        onChange={(e) => setLocalConfig({...localConfig, footer: {...localConfig.footer, addressFa: e.target.value}})}
                        className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-lg text-xs" 
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'آدرس مرکزی (انگلیسی)' : 'Address (EN)'}</label>
                      <textarea 
                        value={localConfig.footer.addressEn}
                        onChange={(e) => setLocalConfig({...localConfig, footer: {...localConfig.footer, addressEn: e.target.value}})}
                        className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-lg text-xs text-left" 
                        dir="ltr"
                        rows={2}
                      />
                    </div>

                    {/* Social / channel URLs — unified across the whole site (footer, contact page, stay-connected blocks) */}
                    <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-gray-400 mb-2">{isRtl ? 'آدرس شبکه‌های اجتماعی و کانال‌ها (نمایش در کل سایت)' : 'Social & Channel URLs (shown site-wide)'}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {([
                          ['website', 'وب‌سایت', 'Website'],
                          ['telegram', 'تلگرام', 'Telegram'],
                          ['instagram', 'اینستاگرام', 'Instagram'],
                          ['linkedin', 'لینکدین', 'LinkedIn'],
                          ['whatsapp', 'واتساپ', 'WhatsApp'],
                          ['aparat', 'آپارات', 'Aparat'],
                          ['bale', 'بله', 'Bale'],
                          ['youtube', 'یوتیوب', 'YouTube'],
                          ['x', 'ایکس (توییتر)', 'X (Twitter)'],
                        ] as const).map(([key, fa, en]) => (
                          <div key={key}>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? fa : en}</label>
                            <input
                              type="text"
                              dir="ltr"
                              value={(localConfig.footer as any)[key] || ''}
                              onChange={(e) => setLocalConfig({...localConfig, footer: {...localConfig.footer, [key]: e.target.value}})}
                              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-lg text-[11px] font-mono text-left"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* FAQ Settings */}
                <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 p-6 rounded-3xl lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                      {isRtl ? 'سوالات متداول (FAQ)' : 'Frequently Asked Questions'}
                    </h4>
                    <button
                      onClick={() => setLocalConfig({...localConfig, faq: [...localConfig.faq, {qFa: '', qEn: '', aFa: '', aEn: ''}]})}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#26B6B6] dark:text-[#26B6B6] text-xs font-bold rounded-lg transition-all"
                    >
                      {isRtl ? '+ افزودن سوال جدید' : '+ Add New FAQ'}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {localConfig.faq.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl space-y-3 relative group">
                        <button 
                          onClick={() => {
                            const newFaq = [...localConfig.faq];
                            newFaq.splice(idx, 1);
                            setLocalConfig({...localConfig, faq: newFaq});
                          }}
                          className="absolute top-4 left-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={isRtl ? 'حذف این سوال' : 'Delete FAQ'}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'پرسش (فارسی)' : 'Question (FA)'}</label>
                            <input 
                              type="text" 
                              value={item.qFa}
                              onChange={(e) => {
                                const newFaq = [...localConfig.faq];
                                newFaq[idx].qFa = e.target.value;
                                setLocalConfig({...localConfig, faq: newFaq});
                              }}
                              className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1.5">Question (EN)</label>
                            <input 
                              type="text" 
                              value={item.qEn}
                              onChange={(e) => {
                                const newFaq = [...localConfig.faq];
                                newFaq[idx].qEn = e.target.value;
                                setLocalConfig({...localConfig, faq: newFaq});
                              }}
                              className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-left" dir="ltr"
                            />
                          </div>
                          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 mb-1.5">{isRtl ? 'پاسخ (فارسی)' : 'Answer (FA)'}</label>
                              <textarea 
                                value={item.aFa}
                                onChange={(e) => {
                                  const newFaq = [...localConfig.faq];
                                  newFaq[idx].aFa = e.target.value;
                                  setLocalConfig({...localConfig, faq: newFaq});
                                }}
                                className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950" rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 mb-1.5">Answer (EN)</label>
                              <textarea 
                                value={item.aEn}
                                onChange={(e) => {
                                  const newFaq = [...localConfig.faq];
                                  newFaq[idx].aEn = e.target.value;
                                  setLocalConfig({...localConfig, faq: newFaq});
                                }}
                                className="w-full py-2 px-3 border border-gray-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 text-left" dir="ltr" rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {localConfig.faq.length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-400 font-bold border border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
                        {isRtl ? 'هیچ سوالی یافت نشد. می‌توانید با افزودن پرسش جدید شروع کنید.' : 'No FAQs added yet.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================== MODAL: ADD ADMIN ACCOUNT ==================== */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 max-w-md w-full rounded-3xl p-6 space-y-4 text-start">
            <h4 className="text-sm font-black text-gray-800 dark:text-white pb-2 border-b border-gray-150 dark:border-slate-800">
              {isRtl ? 'صدور دسترسی جدید پرسنلی' : 'Create New Personnel Admin Access'}
            </h4>

            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{isRtl ? 'نام و نام‌خانوادگی' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder={isRtl ? 'علیرضا تهرانی' : 'Alireza Tehrani'}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{isRtl ? 'پست الکترونیکی پرسنلی' : 'Email Address'}</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="name@iranbimhub.ir"
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-xl text-xs text-start"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{isRtl ? 'تلفن تماس همراه' : 'Phone Number'}</label>
                <input
                  type="text"
                  required
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  placeholder="09123456789"
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-xl text-xs text-start"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{isRtl ? 'نقش امنیتی و مجوز دسترسی' : 'Permission Level'}</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                  className="w-full py-2 px-2 bg-slate-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-xl text-xs text-gray-800 dark:text-white"
                >
                  <option value="Manufacturer Verification Admin">{isRtl ? 'Manufacturer Verification (سطح ۲)' : 'Manufacturer Verification (Level 2)'}</option>
                  <option value="Review Team Manager">{isRtl ? 'Review Team Manager (سطح ۳)' : 'Review Team Manager (Level 3)'}</option>
                  <option value="Reviewer">{isRtl ? 'Reviewer / Auditor (سطح ۴)' : 'Reviewer / Auditor (Level 4)'}</option>
                  <option value="Support & Customer Success">{isRtl ? 'Support & Success (سطح ۵)' : 'Support & Success (Level 5)'}</option>
                  <option value="Finance & Subscription">{isRtl ? 'Finance & Subscription (سطح ۶)' : 'Finance & Subscription (Level 6)'}</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {isRtl ? 'لغو و انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#26B6B6] hover:bg-[#1e9494] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  {isRtl ? 'صدور دسترسی فعال' : 'Create & Provision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
