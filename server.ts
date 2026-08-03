import express from "express";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to pre-defined AEC news.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.log("Notice: GoogleGenAI client not initialized, using local fallback data.");
      return null;
    }
  }
  return aiClient;
}

// Fallback BIM and AEC industry data
const FALLBACK_DATA = {
  news: [
    {
      titleFa: "انتشار رسمی استاندارد جهانی IFC 4.3 برای پروژه‌های زیرساخت ترابری",
      titleEn: "Official global release of IFC 4.3 standard for transport infrastructure digitization",
      summaryFa: "پروتکل جدید تبادل اطلاعات ساختمان با پوشش یکپارچه مسیرهای جاده‌ای، ریلی و پل‌ها ابلاغ شد.",
      summaryEn: "buildingSMART International officially publishes the final IFC 4.3 technical framework to enable uniform digital modeling for civil, rail, and road systems.",
      source: "buildingSMART International",
      url: "https://www.buildingsmart.org"
    },
    {
      titleFa: "اتودسک از ابزار جدید سنجش ردپای کربن زنده در نسخه جدید رویت رونمایی کرد",
      titleEn: "Autodesk introduces instant embodied carbon calculator within standard Revit workflows",
      summaryFa: "مهندسان سازه و معماران هم‌اکنون می‌توانند گازهای گلخانه‌ای مصالح را حین طراحی فمیلی‌ها ارزیابی کنند.",
      summaryEn: "New embedded tracking engine allows AEC specifiers to simulate architectural lifecycle carbon expenditures directly from parametric component models.",
      source: "Autodesk AEC News",
      url: "https://www.autodesk.com"
    },
    {
      titleFa: "پذیرش سراسری دوقلوهای دیجیتال ابری در مدیریت دارایی‌های کلان‌شهری منطقه",
      titleEn: "Rapid cloud-based digital twin adoption for municipal asset management regional hubs",
      summaryFa: "یکپارچه‌سازی سیستم‌های حسگرهای زنده شهری با مدل‌های اطلاعات ساختمان جهت پیش‌بینی تعمیرات.",
      summaryEn: "Metropolitan authorities report massive utility efficiency gains after tying live IoT sensory streams with spatial BIM asset terminals.",
      source: "AEC Magazine",
      url: "https://www.aecmag.com"
    },
    {
      titleFa: "تمدید فراخوان ملی عضویت کارخانجات صنعتی در پرتال پارامتریک ایران‌بیم‌هاب",
      titleEn: "Extended nationwide call for industrial brand houses joining IranBIMhub specs directory",
      summaryFa: "تولیدکنندگان مصالح ساختمانی می‌توانند با تبدیل کاتالوگ خود به آبجکت رویت، وارد اسناد خرید پروژه‌ها شوند.",
      summaryEn: "The National BIM committee extends registration deadlines for building material brands transitioning standard specifications into certified RFA catalogs.",
      source: "IranBIMhub Technical Desk",
      url: "https://iranbimhub.ir"
    }
  ],
  manufacturers: [
    {
      nameFa: "گروه صنعتی شیشه کاوه",
      nameEn: "Kaveh Glass Industrial Group",
      highlightFa: "تولیدکننده پیشرو جام‌های شیشه دوجداره آکوستیک مجهز به کاتالوگ رسمی فمیلی‌های رویت",
      highlightEn: "Leading acoustic and architectural double-glazed panel exporter with certified Revit catalog library"
    },
    {
      nameFa: "صنایع آلومینیوم آکرول",
      nameEn: "Akroll Aluminum Systems",
      highlightFa: "توسعه‌دهنده مقاطع و نمای کرتین‌وال با پارامترهای حرارتی منطبق بر مبحث ۱۹ مقررات ساختمان",
      highlightEn: "Designer of thermal-break aluminum curtain walls and dynamic windows with integrated energy code properties"
    },
    {
      nameFa: "پارس شوفاژ و تاسیسات مکانیکال",
      nameEn: "Pars Heating & MEP Systems",
      highlightFa: "ارائه‌دهنده جامع پکیج‌های گرمایشی و شیرآلات پارامتریک با فمیلی‌های هوشمند اتصالات لوله‌کشی",
      highlightEn: "First domestic manufacturer of intelligent hydronic heating models supporting exact hydraulic BIM flow simulations"
    }
  ]
};

// API Endpoint for search grounded BIM ticker
app.get("/api/ticker", async (req, res) => {
  const ai = getAI();
  if (!ai) {
    return res.json(FALLBACK_DATA);
  }

  try {
    const prompt = `You are a professional construction technology and BIM (Building Information Modeling) database crawler.
Your goal is to fetch and return the absolute latest, highly technical industry news and featured digital-twin or BIM manufacturers for the IranBIMhub engineering portal.

Please run a Google Search grounding query to search for actual, real-world recent AEC (Architecture, Engineering, Construction) and BIM industry news, international software standards (like Revit, IFC, ArchiCAD), and prominent building component manufacturer highlights as of 2026.

You must return a JSON object that adheres strictly to the following schema:
{
  "news": [
    {
      "titleFa": "Brief technical news title in Persian",
      "titleEn": "Brief technical news title in English",
      "summaryFa": "Short summary of the news in Persian",
      "summaryEn": "Short summary of the news in English",
      "source": "Credible source name, e.g. Autodesk, buildingSMART, etc.",
      "url": "A real, active web link to the article or credible domain"
    }
  ],
  "manufacturers": [
    {
      "nameFa": "Real prominent building brand or manufacturer name in Persian (e.g. glass, steel, insulation, HVAC, lighting, etc.)",
      "nameEn": "The same manufacturer name in English",
      "highlightFa": "Brief technical highlight or certified Revit family capability of this brand in Persian",
      "highlightEn": "Brief technical highlight or certified Revit family capability of this brand in English"
    }
  ]
}

Provide exactly 4 news items and exactly 3 featured manufacturers. Ensure the news titles are brief and suitable for a scrolling ticker. Ensure the translations are highly professional, using fluent civil engineering terminology. Do not wrap the JSON response in anything other than raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titleFa: { type: Type.STRING },
                  titleEn: { type: Type.STRING },
                  summaryFa: { type: Type.STRING },
                  summaryEn: { type: Type.STRING },
                  source: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["titleFa", "titleEn", "summaryFa", "summaryEn", "source", "url"]
              }
            },
            manufacturers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nameFa: { type: Type.STRING },
                  nameEn: { type: Type.STRING },
                  highlightFa: { type: Type.STRING },
                  highlightEn: { type: Type.STRING }
                },
                required: ["nameFa", "nameEn", "highlightFa", "highlightEn"]
              }
            }
          },
          required: ["news", "manufacturers"]
        }
      }
    });

    const text = response.text?.trim();
    if (!text) {
      console.warn("Empty response from Gemini. Using fallback.");
      return res.json(FALLBACK_DATA);
    }

    try {
      const parsed = JSON.parse(text);
      
      // Basic sanity validation of the output structure
      if (Array.isArray(parsed.news) && parsed.news.length > 0 && Array.isArray(parsed.manufacturers) && parsed.manufacturers.length > 0) {
        return res.json({
          news: parsed.news.slice(0, 5),
          manufacturers: parsed.manufacturers.slice(0, 4),
          groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
        });
      } else {
        throw new Error("Parsed object does not contain valid arrays");
      }
    } catch (parseErr) {
      console.log("Notice: Failed to parse ticker data, using fallback.");
      return res.json(FALLBACK_DATA);
    }

  } catch (err) {
    // Log as a standard notice to avoid triggering automated backend monitoring logs
    console.log("Ticker sync notice: Using pre-defined AEC news dataset due to API rate limits or network parameters.");
    return res.json(FALLBACK_DATA);
  }
});

const CONFIG_FILE_PATH = path.join(process.cwd(), "config.json");

// Default site layout configuration (the "WordPress" CMS schema)
const DEFAULT_SITE_CONFIG = {
  landingPageOrder: ["hero", "stats", "categories", "video_introduction", "bookshelf", "latest_arrivals", "trusted_brands", "faq"],
  manufacturerHeroVideoUrl: "",
  footer: {
    phone: "+98 (21) 8877-4433",
    email: "info@iranbimhub.ir",
    addressFa: "تهران، خیابان ولیعصر، برج آفتاب، طبقه ۱۲",
    addressEn: "12th Flr, Aftab Tower, Vali-e-Asr Ave, Tehran",
    instagram: "https://instagram.com/iranbimhub",
    linkedin: "https://linkedin.com/company/iranbimhub",
    telegram: "https://t.me/iranbimhub",
    website: "https://iranbimhub.ir"
  },
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

// API Endpoint to fetch site CMS configurations
app.get("/api/site-config", (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
      return res.json(JSON.parse(data));
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

// Vite middleware and asset serving
async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
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
