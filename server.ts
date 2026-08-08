import express from "express";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Public news and notification feeds are intentionally disabled in the MVP.
// Editorial content will be added only through a reviewed publishing workflow.

const CONFIG_FILE_PATH = path.join(process.cwd(), "config.json");

// Default site layout configuration (the "WordPress" CMS schema)
const DEFAULT_SITE_CONFIG = {
  landingPageOrder: ["hero", "stats", "categories", "video_introduction", "bookshelf", "latest_arrivals", "trusted_brands", "faq"],
  manufacturerHeroVideoUrl: "",
  footer: {
    phone: "021-88887767",
    email: "info@iranbimhub.ir",
    addressFa: "",
    addressEn: "",
    instagram: "https://instagram.com/iranbimhub",
    linkedin: "https://linkedin.com/company/iranbimhub",
    telegram: "https://t.me/iranbimhub",
    whatsapp: "https://wa.me/982188887767",
    aparat: "https://aparat.com/iranbimhub",
    bale: "https://ble.ir/iranbimhub",
    youtube: "https://youtube.com/@iranbimhub",
    x: "https://x.com/iranbimhub",
    website: "https://iranbimhub.ir"
  },
  manufacturerHeroVideoTitleFa: "",
  manufacturerHeroVideoTitleEn: "",
  manufacturerHeroVideoThumbnail: "",
  faq: [
    {
      qFa: "آبجکتهای بیم موجود در سامانه با چه مشخصات فنی مدلسازی میشوند؟",
      qEn: "With what Level of Detail (LOD) are the objects modeled?",
      aFa: "آبجکتهای بیم موجود در سامانه با رعایت دقیق ابعاد کاتالوگ واقعی و با سطح جزئیات هندسی و اطلاعاتی استاندارد LOD 300 الی LOD 350 طراحی و ارزیابی میشوند تا در برآورد مصالح دقیق کارگاهی بالاترین کارایی را داشته باشند.",
      aEn: "All BIM families are engineered reflecting precise actual dimensions and embedded parameters according to LOD 300 to LOD 350 industry specifications, optimizing speed for shop drawings and material takeoffs."
    },
    {
      qFa: "چه فرمتهایی برای فایلها در دسترس است؟",
      qEn: "What file formats are available?",
      aFa: "فایلها عمدتاً در فرمت استاندارد Revit (.rfa) و فرمت باز و استاندارد بینالمللی IFC به همراه جزئیات ۲بعدی اتوکد (CAD) جهت تطابق کامل با انواع نرمافزارهای تخصصی ارائه میشوند.",
      aEn: "The platform delivers files in native Autodesk Revit (.rfa) formats, open BIM IFC templates, and standard 2D CAD details, providing robust compatibility across all architectural workflows."
    }
  ]
};

// API Endpoint to fetch site CMS configurations.
// Stored config is merged ONTO the defaults so older installs automatically
// gain newly introduced fields (social URLs, hero video title/thumbnail, ...).
function mergeWithDefaults(stored: any) {
  if (!stored || typeof stored !== "object") return DEFAULT_SITE_CONFIG;
  return {
    ...DEFAULT_SITE_CONFIG,
    ...stored,
    footer: { ...DEFAULT_SITE_CONFIG.footer, ...(stored.footer || {}) },
  };
}

app.get("/api/site-config", (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
      const merged = mergeWithDefaults(JSON.parse(data));
      return res.json(merged);
    } else {
      fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(DEFAULT_SITE_CONFIG, null, 2), "utf-8");
      return res.json(DEFAULT_SITE_CONFIG);
    }
  } catch (err) {
    console.error("Failed to load site config:", err);
    return res.status(500).json({ error: "Failed to load site config" });
  }
});

// API Endpoint to save site CMS configurations
app.post("/api/site-config", (req, res) => {
  try {
    const newConfig = req.body;
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2), "utf-8");
    return res.json({ success: true, message: "Site configuration saved successfully!" });
  } catch (err) {
    console.error("Failed to save site config:", err);
    return res.status(500).json({ error: "Failed to save site config" });
  }
});

// -----------------------------------------------------------------------------
// BIM modeler collaboration applications (MVP)
// Stores simple project-based collaboration requests in a local JSON file.
// In production, your backend/database team can replace these helpers with a real DB table.
// -----------------------------------------------------------------------------
const MODEL_APPLICATIONS_FILE = path.join(process.cwd(), "data", "bim-modeler-applications.json");

function sanitizeString(value: unknown, maxLength = 800): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function sanitizeStringArray(value: unknown, maxItems = 12, maxLength = 120): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(item => typeof item === "string")
    .map(item => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

async function readModelerApplications(): Promise<any[]> {
  try {
    const raw = await fs.promises.readFile(MODEL_APPLICATIONS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function writeModelerApplications(applications: any[]) {
  await fs.promises.mkdir(path.dirname(MODEL_APPLICATIONS_FILE), { recursive: true });
  await fs.promises.writeFile(MODEL_APPLICATIONS_FILE, JSON.stringify(applications, null, 2), "utf8");
}

app.post("/api/bim-modeler-applications", async (req, res) => {
  try {
    const body = req.body || {};

    // Basic honeypot protection. Real users will never fill this hidden field.
    if (sanitizeString(body.website, 200)) {
      return res.status(400).json({ success: false, message: "Invalid submission." });
    }

    const fullName = sanitizeString(body.fullName, 120);
    const phone = sanitizeString(body.phone, 80);
    const email = sanitizeString(body.email, 160);
    const city = sanitizeString(body.city, 120);
    const mainSpecialty = sanitizeString(body.mainSpecialty, 120);
    const experienceYears = sanitizeString(body.experienceYears, 160);
    const availability = sanitizeString(body.availability, 120);
    const portfolioUrl = sanitizeString(body.portfolioUrl, 600);
    const portfolioSentByTelegram = Boolean(body.portfolioSentByTelegram);
    const portfolioSentByWhatsApp = Boolean(body.portfolioSentByWhatsApp);
    const linkedinUrl = sanitizeString(body.linkedinUrl, 600);
    const message = sanitizeString(body.message, 1500);
    const softwareSkills = sanitizeStringArray(body.softwareSkills);
    const preferredProjectTypes = sanitizeStringArray(body.preferredProjectTypes);
    const hasAcceptedNotice = Boolean(body.hasAcceptedNotice);

    if (!fullName || !phone || !city || !mainSpecialty || !experienceYears || !hasAcceptedNotice) {
      return res.status(400).json({
        success: false,
        messageFa: "لطفاً فیلدهای ضروری فرم همکاری را تکمیل کنید.",
        messageEn: "Please complete all required collaboration form fields."
      });
    }

    if (!portfolioUrl && !portfolioSentByTelegram && !portfolioSentByWhatsApp) {
      return res.status(400).json({
        success: false,
        messageFa: "لطفاً لینک نمونه‌کار را وارد کنید یا گزینه ارسال نمونه‌کار از طریق تلگرام/واتساپ را انتخاب کنید.",
        messageEn: "Please enter a portfolio link or select Telegram/WhatsApp portfolio submission."
      });
    }

    if (softwareSkills.length === 0 || preferredProjectTypes.length === 0) {
      return res.status(400).json({
        success: false,
        messageFa: "لطفاً حداقل یک نرم‌افزار و یک نوع پروژه را انتخاب کنید.",
        messageEn: "Please select at least one software skill and one project type."
      });
    }

    const applications = await readModelerApplications();
    const now = new Date().toISOString();

    const application = {
      id: randomUUID(),
      fullName,
      phone,
      email,
      city,
      mainSpecialty,
      experienceYears,
      availability,
      portfolioUrl,
      portfolioSentByTelegram,
      portfolioSentByWhatsApp,
      linkedinUrl,
      softwareSkills,
      preferredProjectTypes,
      message,
      status: "new",
      source: "bim-modeler-collaboration-page",
      createdAt: now,
      updatedAt: now,
      adminNotes: ""
    };

    applications.unshift(application);
    await writeModelerApplications(applications);

    return res.status(201).json({
      success: true,
      id: application.id,
      messageFa: "درخواست همکاری شما با موفقیت ثبت شد.",
      messageEn: "Your collaboration application was submitted successfully."
    });
  } catch (error) {
    console.error("Failed to save BIM modeler application:", error);
    return res.status(500).json({
      success: false,
      messageFa: "ثبت درخواست با خطا مواجه شد. لطفاً کمی بعد دوباره تلاش کنید.",
      messageEn: "Submission failed. Please try again later."
    });
  }
});


// MVP admin endpoint: list BIM modeler collaboration applications.
// Note: current admin auth is mock/localStorage-based, so this endpoint is intentionally simple for prototype use.
app.get("/api/admin/bim-modeler-applications", async (_req, res) => {
  try {
    const applications = await readModelerApplications();
    return res.json({ success: true, applications, total: applications.length });
  } catch (error) {
    console.error("Failed to read BIM modeler applications:", error);
    return res.status(500).json({
      success: false,
      messageFa: "خطا در دریافت درخواست‌های همکاری مدل‌سازان BIM.",
      messageEn: "Failed to load BIM modeler applications."
    });
  }
});

// MVP admin endpoint: update review status and internal admin notes for a BIM modeler application.
app.patch("/api/admin/bim-modeler-applications/:id", async (req, res) => {
  try {
    const allowedStatuses = new Set(["new", "reviewing", "shortlisted", "test_project", "approved", "rejected"]);
    const applicationId = sanitizeString(req.params.id, 120);
    const nextStatus = sanitizeString(req.body?.status, 60);
    const adminNotes = sanitizeString(req.body?.adminNotes, 1500);

    if (!allowedStatuses.has(nextStatus)) {
      return res.status(400).json({
        success: false,
        messageFa: "وضعیت انتخاب‌شده معتبر نیست.",
        messageEn: "Invalid application status."
      });
    }

    const applications = await readModelerApplications();
    const targetIndex = applications.findIndex(app => app.id === applicationId);

    if (targetIndex === -1) {
      return res.status(404).json({
        success: false,
        messageFa: "درخواست همکاری مورد نظر پیدا نشد.",
        messageEn: "Application not found."
      });
    }

    applications[targetIndex] = {
      ...applications[targetIndex],
      status: nextStatus,
      adminNotes,
      updatedAt: new Date().toISOString()
    };

    await writeModelerApplications(applications);

    return res.json({
      success: true,
      application: applications[targetIndex],
      messageFa: "وضعیت درخواست همکاری به‌روزرسانی شد.",
      messageEn: "Application status updated."
    });
  } catch (error) {
    console.error("Failed to update BIM modeler application:", error);
    return res.status(500).json({
      success: false,
      messageFa: "خطا در به‌روزرسانی درخواست همکاری.",
      messageEn: "Failed to update application."
    });
  }
});

// Manufacturer consultation / pre-registration requests (MVP)
// Stores initial manufacturer consultation requests in a local JSON file.
// Production backend can replace this with a real database table.
// -----------------------------------------------------------------------------
const MANUFACTURER_LEADS_FILE = path.join(process.cwd(), "data", "manufacturer-leads.json");

type ManufacturerLeadStatus =
  | "new"
  | "contact_needed"
  | "waiting_files"
  | "has_bim_ready"
  | "needs_bim_creation"
  | "technical_review"
  | "ready_to_publish"
  | "published"
  | "rejected";

async function readManufacturerLeads(): Promise<any[]> {
  try {
    const raw = await fs.promises.readFile(MANUFACTURER_LEADS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function writeManufacturerLeads(leads: any[]) {
  await fs.promises.mkdir(path.dirname(MANUFACTURER_LEADS_FILE), { recursive: true });
  await fs.promises.writeFile(MANUFACTURER_LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
}

function getInitialManufacturerLeadStatus(hasBimFiles: string): ManufacturerLeadStatus {
  if (hasBimFiles === "yes") return "has_bim_ready";
  if (hasBimFiles === "no") return "needs_bim_creation";
  return "contact_needed";
}

app.post("/api/manufacturer-leads", async (req, res) => {
  try {
    const body = req.body || {};

    // Honeypot protection. Real users will never fill this hidden field.
    if (sanitizeString(body.website, 200)) {
      return res.status(400).json({ success: false, message: "Invalid submission." });
    }

    const companyName = sanitizeString(body.companyName, 160);
    const brandName = sanitizeString(body.brandName, 160);
    const contactName = sanitizeString(body.contactName, 120);
    const roleTitle = sanitizeString(body.roleTitle, 120);
    const phone = sanitizeString(body.phone, 80);
    const email = sanitizeString(body.email, 160);
    const city = sanitizeString(body.city, 120);
    const websiteOrSocial = sanitizeString(body.websiteOrSocial, 600);
    const productCategory = sanitizeString(body.productCategory, 120);
    const hasBimFiles = sanitizeString(body.hasBimFiles, 40);
    const productCount = sanitizeString(body.productCount, 120);
    const catalogUrl = sanitizeString(body.catalogUrl, 600);
    const message = sanitizeString(body.message, 1800);
    const bimFormats = sanitizeStringArray(body.bimFormats);
    const filesSentByTelegram = Boolean(body.filesSentByTelegram);
    const filesSentByWhatsApp = Boolean(body.filesSentByWhatsApp);
    const hasAcceptedNotice = Boolean(body.hasAcceptedNotice);

    if (!companyName || !contactName || !phone || !city || !productCategory || !hasBimFiles || !hasAcceptedNotice) {
      return res.status(400).json({
        success: false,
        messageFa: "لطفاً فیلدهای ضروری فرم مشاوره تولیدکنندگان را تکمیل کنید.",
        messageEn: "Please complete all required manufacturer consultation fields."
      });
    }

    if (!["yes", "no", "not-sure"].includes(hasBimFiles)) {
      return res.status(400).json({
        success: false,
        messageFa: "وضعیت فایل BIM معتبر نیست.",
        messageEn: "Invalid BIM file status."
      });
    }

    // If the manufacturer does not have ready BIM files, we need at least a catalog/product link
    // or confirmation that initial materials will be sent through Telegram/WhatsApp for consultation.
    // If they already have ready BIM files, the official upload happens later in the brand panel.
    if (hasBimFiles !== "yes" && !catalogUrl && !filesSentByTelegram && !filesSentByWhatsApp) {
      return res.status(400).json({
        success: false,
        messageFa: "برای مشاوره اولیه، لطفاً لینک کاتالوگ/صفحه محصول را وارد کنید یا ارسال از طریق تلگرام/واتساپ را انتخاب کنید.",
        messageEn: "For initial consultation, please enter a catalog/product link or select Telegram/WhatsApp submission."
      });
    }

    const leads = await readManufacturerLeads();
    const now = new Date().toISOString();
    const status = getInitialManufacturerLeadStatus(hasBimFiles);

    const lead = {
      id: randomUUID(),
      companyName,
      brandName,
      contactName,
      roleTitle,
      phone,
      email,
      city,
      websiteOrSocial,
      productCategory,
      hasBimFiles,
      bimFormats,
      productCount,
      catalogUrl,
      filesSentByTelegram,
      filesSentByWhatsApp,
      message,
      status,
      source: "manufacturer-consultation-page",
      createdAt: now,
      updatedAt: now,
      adminNotes: ""
    };

    leads.unshift(lead);
    await writeManufacturerLeads(leads);

    return res.status(201).json({
      success: true,
      id: lead.id,
      status,
      messageFa: "درخواست مشاوره تولیدکننده با موفقیت ثبت شد.",
      messageEn: "Manufacturer consultation request submitted successfully."
    });
  } catch (error) {
    console.error("Failed to save manufacturer consultation request:", error);
    return res.status(500).json({
      success: false,
      messageFa: "ثبت درخواست مشاوره تولیدکننده با خطا مواجه شد. لطفاً کمی بعد دوباره تلاش کنید.",
      messageEn: "Manufacturer consultation request failed. Please try again later."
    });
  }
});

app.get("/api/admin/manufacturer-leads", async (_req, res) => {
  try {
    const leads = await readManufacturerLeads();
    return res.json({ success: true, leads, total: leads.length });
  } catch (error) {
    console.error("Failed to read manufacturer consultation requests:", error);
    return res.status(500).json({
      success: false,
      messageFa: "خطا در دریافت درخواست‌های مشاوره تولیدکنندگان.",
      messageEn: "Failed to load manufacturer consultation requests."
    });
  }
});

app.patch("/api/admin/manufacturer-leads/:id", async (req, res) => {
  try {
    const allowedStatuses = new Set([
      "new",
      "contact_needed",
      "waiting_files",
      "has_bim_ready",
      "needs_bim_creation",
      "technical_review",
      "ready_to_publish",
      "published",
      "rejected"
    ]);
    const leadId = sanitizeString(req.params.id, 120);
    const nextStatus = sanitizeString(req.body?.status, 80);
    const adminNotes = sanitizeString(req.body?.adminNotes, 1800);

    if (!allowedStatuses.has(nextStatus)) {
      return res.status(400).json({
        success: false,
        messageFa: "وضعیت انتخاب‌شده معتبر نیست.",
        messageEn: "Invalid manufacturer consultation status."
      });
    }

    const leads = await readManufacturerLeads();
    const targetIndex = leads.findIndex(lead => lead.id === leadId);

    if (targetIndex === -1) {
      return res.status(404).json({
        success: false,
        messageFa: "درخواست مشاوره تولیدکننده مورد نظر پیدا نشد.",
        messageEn: "Manufacturer consultation request not found."
      });
    }

    leads[targetIndex] = {
      ...leads[targetIndex],
      status: nextStatus,
      adminNotes,
      updatedAt: new Date().toISOString()
    };

    await writeManufacturerLeads(leads);

    return res.json({
      success: true,
      lead: leads[targetIndex],
      messageFa: "وضعیت مشاوره تولیدکننده بروزرسانی شد.",
      messageEn: "Manufacturer consultation status updated."
    });
  } catch (error) {
    console.error("Failed to update manufacturer consultation request:", error);
    return res.status(500).json({
      success: false,
      messageFa: "خطا در بروزرسانی مشاوره تولیدکننده.",
      messageEn: "Failed to update manufacturer consultation request."
    });
  }
});

// -----------------------------------------------------------------------------
// Support tickets (Contact Us desk) — file-based JSON store.
// Public: POST /api/tickets (submit). Admin: GET/PATCH (manage in admin panel).
// Statuses: new → in_review → answered → closed
// -----------------------------------------------------------------------------
const TICKETS_FILE = path.join(process.cwd(), "data", "support-tickets.json");

async function readSupportTickets(): Promise<any[]> {
  try {
    const raw = await fs.promises.readFile(TICKETS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function writeSupportTickets(tickets: any[]) {
  await fs.promises.mkdir(path.dirname(TICKETS_FILE), { recursive: true });
  await fs.promises.writeFile(TICKETS_FILE, JSON.stringify(tickets, null, 2), "utf8");
}

app.post("/api/tickets", async (req, res) => {
  try {
    const body = req.body || {};

    // Honeypot protection
    if (sanitizeString(body.website, 200)) {
      return res.status(400).json({ success: false, message: "Invalid submission." });
    }

    const name = sanitizeString(body.name, 120);
    const email = sanitizeString(body.email, 160);
    const subject = sanitizeString(body.subject, 200);
    const department = sanitizeString(body.department, 60);
    const message = sanitizeString(body.message, 2000);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        messageFa: "لطفاً نام، ایمیل و متن پیام را تکمیل کنید.",
        messageEn: "Please complete name, email and message fields."
      });
    }

    const allowedDepartments = new Set(["tech", "general"]);
    if (!allowedDepartments.has(department)) {
      return res.status(400).json({
        success: false,
        messageFa: "بخش انتخاب‌شده معتبر نیست.",
        messageEn: "Invalid support department."
      });
    }

    const now = new Date().toISOString();
    const tickets = await readSupportTickets();
    // Sequential human-friendly reference: IBH-YYYY-NNN
    const refNumber = `IBH-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, "0")}`;

    const ticket = {
      id: randomUUID(),
      refNumber,
      name,
      email,
      subject,
      department,
      message,
      status: "new",
      adminNotes: "",
      createdAt: now,
      updatedAt: now
    };

    tickets.unshift(ticket);
    await writeSupportTickets(tickets);

    return res.status(201).json({
      success: true,
      id: ticket.id,
      refNumber,
      messageFa: "تیکت شما با موفقیت ثبت شد.",
      messageEn: "Your ticket has been submitted successfully."
    });
  } catch (error) {
    console.error("Failed to save support ticket:", error);
    return res.status(500).json({
      success: false,
      messageFa: "ثبت تیکت با خطا مواجه شد. لطفاً کمی بعد دوباره تلاش کنید.",
      messageEn: "Ticket submission failed. Please try again later."
    });
  }
});

app.get("/api/admin/tickets", async (_req, res) => {
  try {
    const tickets = await readSupportTickets();
    return res.json({ success: true, tickets, total: tickets.length });
  } catch (error) {
    console.error("Failed to read support tickets:", error);
    return res.status(500).json({
      success: false,
      messageFa: "خطا در دریافت تیکت‌های پشتیبانی.",
      messageEn: "Failed to load support tickets."
    });
  }
});

app.patch("/api/admin/tickets/:id", async (req, res) => {
  try {
    const allowedStatuses = new Set(["new", "in_review", "answered", "closed"]);
    const ticketId = sanitizeString(req.params.id, 120);
    const nextStatus = sanitizeString(req.body?.status, 60);
    const adminNotes = sanitizeString(req.body?.adminNotes, 1800);

    if (!allowedStatuses.has(nextStatus)) {
      return res.status(400).json({
        success: false,
        messageFa: "وضعیت تیکت معتبر نیست.",
        messageEn: "Invalid ticket status."
      });
    }

    const tickets = await readSupportTickets();
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        messageFa: "تیکت مورد نظر پیدا نشد.",
        messageEn: "Ticket not found."
      });
    }

    tickets[idx] = { ...tickets[idx], status: nextStatus, adminNotes, updatedAt: new Date().toISOString() };
    await writeSupportTickets(tickets);

    return res.json({
      success: true,
      ticket: tickets[idx],
      messageFa: "وضعیت تیکت بروزرسانی شد.",
      messageEn: "Ticket status updated."
    });
  } catch (error) {
    console.error("Failed to update support ticket:", error);
    return res.status(500).json({
      success: false,
      messageFa: "خطا در بروزرسانی تیکت.",
      messageEn: "Failed to update support ticket."
    });
  }
});

/**
 * Object Comments & Discussions — Item 14 («دیدگاه‌ها» on object pages)
 * -----------------------------------------------------------------
 * Architects/BIM specialists write top-level comments; manufacturers AND
 * modelers may reply. EVERY entry starts as `pending` and becomes public
 * only after admin approval (moderation queue in the admin panel).
 * GET  /api/comments?objectId=&phone=   → approved + caller's own pending
 * POST /api/comments                    → create (pending)
 * GET  /api/comments/mine?phone=        → caller's own comments (dashboard)
 * Admin: GET /api/admin/comments | PATCH /api/admin/comments/:id | DELETE
 */
const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json");

async function readComments(): Promise<any[]> {
  try {
    const raw = await fs.promises.readFile(COMMENTS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function writeComments(comments: any[]) {
  await fs.promises.mkdir(path.dirname(COMMENTS_FILE), { recursive: true });
  await fs.promises.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), "utf8");
}

app.get("/api/comments", async (req, res) => {
  try {
    const objectId = sanitizeString(String(req.query.objectId || ""), 120);
    const phone = sanitizeString(String(req.query.phone || ""), 40);
    if (!objectId) {
      return res.status(400).json({ success: false, messageFa: "شناسه آبجکت ارسال نشده است.", messageEn: "Missing objectId." });
    }
    const all = await readComments();
    const visible = all.filter(c =>
      c.objectId === objectId && (c.status === "approved" || (phone && c.authorPhone === phone))
    );
    return res.json({ success: true, comments: visible, total: visible.length });
  } catch (error) {
    console.error("Failed to read comments:", error);
    return res.status(500).json({ success: false, messageFa: "خطا در دریافت دیدگاه‌ها.", messageEn: "Failed to load comments." });
  }
});

app.get("/api/comments/mine", async (req, res) => {
  try {
    const phone = sanitizeString(String(req.query.phone || ""), 40);
    if (!phone) {
      return res.status(400).json({ success: false, messageFa: "شماره موبایل ارسال نشده است.", messageEn: "Missing phone." });
    }
    const all = await readComments();
    const mine = all.filter(c => c.authorPhone === phone);
    return res.json({ success: true, comments: mine, total: mine.length });
  } catch (error) {
    console.error("Failed to read own comments:", error);
    return res.status(500).json({ success: false, messageFa: "خطا در دریافت دیدگاه‌های شما.", messageEn: "Failed to load your comments." });
  }
});

app.post("/api/comments", async (req, res) => {
  try {
    const body = req.body || {};
    if (sanitizeString(body.website, 200)) {
      return res.status(400).json({ success: false, message: "Invalid submission." });
    }

    const objectId = sanitizeString(body.objectId, 120);
    const objectTitle = sanitizeString(body.objectTitle, 200);
    const parentId = sanitizeString(body.parentId, 120) || null;
    const authorName = sanitizeString(body.authorName, 120);
    const authorPhone = sanitizeString(body.authorPhone, 40);
    const authorRole = sanitizeString(body.authorRole, 40);
    const text = sanitizeString(body.text, 1200);

    if (!objectId || !authorName || !authorPhone || !text) {
      return res.status(400).json({
        success: false,
        messageFa: "نام، شماره موبایل و متن دیدگاه الزامی است.",
        messageEn: "Name, mobile number and comment text are required."
      });
    }

    // Item 14 permission rule: only Modeler accounts may open a discussion;
    // manufacturers (and modelers) may only REPLY inside an existing thread.
    if (!parentId && authorRole !== "Modeler") {
      return res.status(403).json({
        success: false,
        messageFa: "نوشتن دیدگاه جدید فقط برای حساب‌های معمار و متخصص BIM فعال است؛ می‌توانید به دیدگاه‌های موجود پاسخ دهید.",
        messageEn: "Only architect/BIM professional accounts can start discussions; you may reply to existing comments."
      });
    }

    const comments = await readComments();
    const comment = {
      id: randomUUID(),
      objectId,
      objectTitle,
      parentId,
      authorName,
      authorPhone,
      authorRole: parentId ? authorRole || "Modeler" : "Modeler",
      text,
      status: "pending", // honest-by-design: public only after admin approval
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    comments.unshift(comment);
    await writeComments(comments);

    return res.status(201).json({
      success: true,
      comment,
      messageFa: "دیدگاه شما ثبت شد و پس از تأیید به‌صورت عمومی نمایش داده می‌شود.",
      messageEn: "Your comment was submitted and will be public after approval."
    });
  } catch (error) {
    console.error("Failed to save comment:", error);
    return res.status(500).json({ success: false, messageFa: "ثبت دیدگاه با خطا مواجه شد. لطفاً دوباره تلاش کنید.", messageEn: "Comment submission failed. Please try again." });
  }
});

app.get("/api/admin/comments", async (_req, res) => {
  try {
    const comments = await readComments();
    return res.json({ success: true, comments, total: comments.length });
  } catch (error) {
    console.error("Failed to read comments for admin:", error);
    return res.status(500).json({ success: false, messageFa: "خطا در دریافت دیدگاه‌ها.", messageEn: "Failed to load comments." });
  }
});

app.patch("/api/admin/comments/:id", async (req, res) => {
  try {
    const allowed = new Set(["approved", "rejected", "pending"]);
    const id = sanitizeString(req.params.id, 120);
    const status = sanitizeString(req.body?.status, 40);
    if (!allowed.has(status)) {
      return res.status(400).json({ success: false, messageFa: "وضعیت دیدگاه معتبر نیست.", messageEn: "Invalid comment status." });
    }
    const comments = await readComments();
    const idx = comments.findIndex(c => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, messageFa: "دیدگاه پیدا نشد.", messageEn: "Comment not found." });
    }
    comments[idx] = { ...comments[idx], status, updatedAt: new Date().toISOString() };
    await writeComments(comments);
    return res.json({ success: true, comment: comments[idx], messageFa: "وضعیت دیدگاه بروزرسانی شد.", messageEn: "Comment status updated." });
  } catch (error) {
    console.error("Failed to update comment:", error);
    return res.status(500).json({ success: false, messageFa: "خطا در بروزرسانی دیدگاه.", messageEn: "Failed to update comment." });
  }
});

app.delete("/api/admin/comments/:id", async (req, res) => {
  try {
    const id = sanitizeString(req.params.id, 120);
    const comments = await readComments();
    const remaining = comments.filter(c => c.id !== id && c.parentId !== id);
    await writeComments(remaining);
    return res.json({ success: true, messageFa: "دیدگاه حذف شد.", messageEn: "Comment deleted." });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return res.status(500).json({ success: false, messageFa: "خطا در حذف دیدگاه.", messageEn: "Failed to delete comment." });
  }
});

/**
 * Object Requests — Item 20 («درخواست آبجکت جدید» in the Modeler panel)
 * -------------------------------------------------------------------
 * Architects ask IranBIMhub to contact a brand (even one not registered yet)
 * and produce/publish a BIM object for a real product.
 * POST /api/object-requests                → create (returns trackingRef)
 * GET  /api/object-requests/mine?phone=    → caller's requests + statuses
 * Admin: GET /api/admin/object-requests | PATCH /:id (status, adminNote)
 */
const OBJECT_REQUESTS_FILE = path.join(process.cwd(), "data", "object-requests.json");

async function readObjectRequests(): Promise<any[]> {
  try {
    const raw = await fs.promises.readFile(OBJECT_REQUESTS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function writeObjectRequests(items: any[]) {
  await fs.promises.mkdir(path.dirname(OBJECT_REQUESTS_FILE), { recursive: true });
  await fs.promises.writeFile(OBJECT_REQUESTS_FILE, JSON.stringify(items, null, 2), "utf8");
}

app.post("/api/object-requests", async (req, res) => {
  try {
    const body = req.body || {};
    if (sanitizeString(body.website, 200)) {
      return res.status(400).json({ success: false, message: "Invalid submission." });
    }

    const brandName = sanitizeString(body.brandName, 160);
    const brandUrl = sanitizeString(body.brandUrl, 300);
    const productName = sanitizeString(body.productName, 200);
    const detailLevel = sanitizeString(body.detailLevel, 60);
    const discipline = sanitizeString(body.discipline, 80);
    const categoryId = sanitizeString(body.categoryId, 80);
    const subcategoryName = sanitizeString(body.subcategoryName, 120);
    const linkUrl = sanitizeString(body.linkUrl, 300);
    const photoName = sanitizeString(body.photoName, 200);
    const projectName = sanitizeString(body.projectName, 200);
    const description = sanitizeString(body.description, 1800);
    const requesterName = sanitizeString(body.requesterName, 120);
    const requesterPhone = sanitizeString(body.requesterPhone, 40);

    if (!brandName || !productName || !requesterName || !requesterPhone) {
      return res.status(400).json({
        success: false,
        messageFa: "نام برند، نام محصول و مشخصات درخواست‌کننده الزامی است.",
        messageEn: "Brand name, product name and requester details are required."
      });
    }

    const requests = await readObjectRequests();
    const trackingRef = `REQ-${new Date().getFullYear()}-${String(requests.length + 1).padStart(3, "0")}`;
    const item = {
      id: randomUUID(),
      trackingRef,
      brandName,
      brandUrl,
      productName,
      detailLevel,
      discipline,
      categoryId,
      subcategoryName,
      linkUrl,
      photoName,
      projectName,
      description,
      requesterName,
      requesterPhone,
      status: "new", // new → in_progress_contact → in_production → published | rejected
      adminNote: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    requests.unshift(item);
    await writeObjectRequests(requests);

    return res.status(201).json({
      success: true,
      trackingRef,
      request: item,
      messageFa: "درخواست آبجکت شما ثبت شد؛ تیم ایران‌بیم‌هاب با برند تماس می‌گیرد.",
      messageEn: "Your object request was submitted; IranBIMhub will contact the brand."
    });
  } catch (error) {
    console.error("Failed to save object request:", error);
    return res.status(500).json({ success: false, messageFa: "ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید.", messageEn: "Request submission failed. Please try again." });
  }
});

app.get("/api/object-requests/mine", async (req, res) => {
  try {
    const phone = sanitizeString(String(req.query.phone || ""), 40);
    if (!phone) {
      return res.status(400).json({ success: false, messageFa: "شماره موبایل ارسال نشده است.", messageEn: "Missing phone." });
    }
    const requests = await readObjectRequests();
    const mine = requests.filter(r => r.requesterPhone === phone);
    return res.json({ success: true, requests: mine, total: mine.length });
  } catch (error) {
    console.error("Failed to read own object requests:", error);
    return res.status(500).json({ success: false, messageFa: "خطا در دریافت درخواست‌ها.", messageEn: "Failed to load requests." });
  }
});

app.get("/api/admin/object-requests", async (_req, res) => {
  try {
    const requests = await readObjectRequests();
    return res.json({ success: true, requests, total: requests.length });
  } catch (error) {
    console.error("Failed to read object requests for admin:", error);
    return res.status(500).json({ success: false, messageFa: "خطا در دریافت درخواست‌ها.", messageEn: "Failed to load object requests." });
  }
});

app.patch("/api/admin/object-requests/:id", async (req, res) => {
  try {
    const allowed = new Set(["new", "in_progress_contact", "in_production", "published", "rejected"]);
    const id = sanitizeString(req.params.id, 120);
    const status = sanitizeString(req.body?.status, 60);
    const adminNote = sanitizeString(req.body?.adminNote, 1200);
    if (!allowed.has(status)) {
      return res.status(400).json({ success: false, messageFa: "وضعیت درخواست معتبر نیست.", messageEn: "Invalid request status." });
    }
    const requests = await readObjectRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, messageFa: "درخواست پیدا نشد.", messageEn: "Request not found." });
    }
    requests[idx] = { ...requests[idx], status, adminNote, updatedAt: new Date().toISOString() };
    await writeObjectRequests(requests);
    return res.json({ success: true, request: requests[idx], messageFa: "وضعیت درخواست بروزرسانی شد.", messageEn: "Request status updated." });
  } catch (error) {
    console.error("Failed to update object request:", error);
    return res.status(500).json({ success: false, messageFa: "خطا در بروزرسانی درخواست.", messageEn: "Failed to update request." });
  }
});

// Vite middleware and asset serving
async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          // File-based JSON stores (data/**) change on every POST; without this,
          // Vite full-reloads the page after each form submission and React loses state.
          // config.json (admin site settings saves) gets the same treatment.
          watch: { ignored: ["**/data/**", "**/config.json", "**/server.ts", "**/dist/**", "**/releases/**"] },
        },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
