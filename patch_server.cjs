const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

const startMarker = "// -----------------------------------------------------------------------------\n// Manufacturer Leads (MVP)";
const endMarker = "// Vite middleware and asset serving";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newBlock = `// -----------------------------------------------------------------------------
// Manufacturer collaboration leads (MVP)
// Stores manufacturer requests in a local JSON file.
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
        messageFa: "لطفاً فیلدهای ضروری فرم تولیدکنندگان را تکمیل کنید.",
        messageEn: "Please complete all required manufacturer request fields."
      });
    }

    if (!["yes", "no", "not-sure"].includes(hasBimFiles)) {
      return res.status(400).json({
        success: false,
        messageFa: "وضعیت فایل BIM معتبر نیست.",
        messageEn: "Invalid BIM file status."
      });
    }

    if (!catalogUrl && !filesSentByTelegram && !filesSentByWhatsApp) {
      return res.status(400).json({
        success: false,
        messageFa: "لطفاً لینک کاتالوگ/فایل را وارد کنید یا ارسال از طریق تلگرام/واتساپ را انتخاب کنید.",
        messageEn: "Please enter a catalog/file link or select Telegram/WhatsApp file submission."
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
      source: "manufacturer-collaboration-page",
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
      messageFa: "درخواست همکاری تولیدکننده با موفقیت ثبت شد.",
      messageEn: "Manufacturer collaboration request submitted successfully."
    });
  } catch (error) {
    console.error("Failed to save manufacturer lead:", error);
    return res.status(500).json({
      success: false,
      messageFa: "ثبت درخواست تولیدکننده با خطا مواجه شد. لطفاً کمی بعد دوباره تلاش کنید.",
      messageEn: "Manufacturer request failed. Please try again later."
    });
  }
});

app.get("/api/admin/manufacturer-leads", async (_req, res) => {
  try {
    const leads = await readManufacturerLeads();
    return res.json({ success: true, leads, total: leads.length });
  } catch (error) {
    console.error("Failed to read manufacturer leads:", error);
    return res.status(500).json({
      success: false,
      messageFa: "خطا در دریافت درخواستهای تولیدکنندگان.",
      messageEn: "Failed to load manufacturer leads."
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
        messageFa: "وضعیت انتخابشده معتبر نیست.",
        messageEn: "Invalid manufacturer lead status."
      });
    }

    const leads = await readManufacturerLeads();
    const targetIndex = leads.findIndex(lead => lead.id === leadId);

    if (targetIndex === -1) {
      return res.status(404).json({
        success: false,
        messageFa: "درخواست تولیدکننده مورد نظر پیدا نشد.",
        messageEn: "Manufacturer lead not found."
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
      messageFa: "وضعیت درخواست تولیدکننده بروزرسانی شد.",
      messageEn: "Manufacturer lead status updated."
    });
  } catch (error) {
    console.error("Failed to update manufacturer lead:", error);
    return res.status(500).json({
      success: false,
      messageFa: "خطا در بروزرسانی درخواست تولیدکننده.",
      messageEn: "Failed to update manufacturer lead."
    });
  }
});

`;
  
  const newContent = content.substring(0, startIndex) + newBlock + content.substring(endIndex);
  fs.writeFileSync('server.ts', newContent, 'utf8');
  console.log("Patched server.ts");
} else {
  console.log("Could not find markers.", {startIndex, endIndex});
}
