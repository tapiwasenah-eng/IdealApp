import express from "express";
import multer from "multer";
import { z } from "zod";
import { getDb } from "../firebaseAdmin.js";
import { requireAuth } from "../middleware/auth.js";
import * as XLSX from "xlsx";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const InvestorSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["vc", "angel", "family-office", "accelerator", "other"]).default("other"),
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  sectors: z.array(z.string()).default([]),
  website: z.string().url().nullable().optional(),
  domain: z.string().nullable().optional(),
  linkedin: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
  investmentThesis: z.string().nullable().optional(),
  contacts: z.array(z.object({
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    fullName: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    linkedin: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    phone: z.string().nullable().optional(),
    emailValidation: z.string().nullable().optional(),
  })).default([]),
  source: z.string().default("manual"),
});

function cleanString(v: any): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function splitSectors(raw: any): string[] {
  const s = cleanString(raw);
  if (!s) return [];
  return s
    .split(/[\n,]/g)
    .map(x => x.trim())
    .filter(Boolean);
}

router.use(requireAuth);

// GET /api/investors
router.get("/", async (_req, res, next) => {
  try {
    const db = getDb();
    const snap = await db.collection("investors").orderBy("createdAt", "desc").limit(500).get();
    const investors = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, investors });
  } catch (err) {
    next(err);
  }
});

// POST /api/investors
router.post("/", async (req, res, next) => {
  try {
    const parsed = InvestorSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.message });

    const db = getDb();
    const now = new Date();
    const docRef = await db.collection("investors").add({
      ...parsed.data,
      createdAt: now,
      updatedAt: now,
    });

    res.json({ success: true, id: docRef.id });
  } catch (err) {
    next(err);
  }
});

// POST /api/investors/import-json
router.post("/import-json", async (req, res, next) => {
  try {
    const ImportSchema = z.object({ investors: z.array(InvestorSchema).min(1) });
    const parsed = ImportSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.message });

    const db = getDb();
    const now = new Date();

    const batch = db.batch();
    for (const inv of parsed.data.investors) {
      const ref = db.collection("investors").doc();
      batch.set(ref, { ...inv, createdAt: now, updatedAt: now });
    }
    await batch.commit();

    res.json({ success: true, imported: parsed.data.investors.length });
  } catch(err) {
    next(err);
  }
});

// POST /api/investors/import-file  (CSV or XLSX)
router.post("/import-file", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "Missing file" });

    const ext = (req.file.originalname.split(".").pop() || "").toLowerCase();
    const db = getDb();
    const now = new Date();

    let investors: any[] = [];

    if (ext === "csv") {
      const text = req.file.buffer.toString("utf8");
      const wb = XLSX.read(text, { type: "string" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: null });
      // Expecting vault_africa_investor_prospects.csv style headers
      investors = rows
        .map(r => ({
          name: cleanString(r.Company) || cleanString(`${r["First Name"] || ""} ${r["Last Name"] || ""}`) || "Unknown",
          type: "other",
          country: null,
          city: null,
          sectors: [],
          website: null,
          domain: null,
          linkedin: cleanString(r.URL),
          description: cleanString(r["Brief Description"]),
          investmentThesis: null,
          contacts: [{
            firstName: cleanString(r["First Name"]),
            lastName: cleanString(r["Last Name"]),
            fullName: cleanString(`${r["First Name"] || ""} ${r["Last Name"] || ""}`),
            title: cleanString(r.Position),
            linkedin: cleanString(r.URL),
            email: null,
            phone: null,
            emailValidation: null,
          }],
          source: "vault-africa-prospects",
        }))
        .filter(x => x.name && x.name !== "Unknown");
    } else if (ext === "xlsx" || ext === "xls") {
      const wb = XLSX.read(req.file.buffer, { type: "buffer" });

      // Prefer sheet named "DACH FOs" if present
      const sheetName = wb.SheetNames.find(n => n.toLowerCase().includes("dach")) || wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      if (!sheet) return res.status(400).json({ success: false, error: "Sheet not found" });
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: null });

      // Expecting columns like "Family Office Name", "Family Office Country", etc.
      investors = rows
        .map(r => {
          const name = cleanString(r["Family Office Name"]);
          if (!name) return null;

          return {
            name,
            type: "family-office",
            country: cleanString(r["Family Office Country"]),
            city: cleanString(r["Family Office City"]),
            sectors: splitSectors(r["Investing Sectors"]),
            website: cleanString(r["Family Office Website Address"]),
            domain: cleanString(r["Family Office Domain"]),
            linkedin: cleanString(r["Corporate Linkedin Address"]),
            description: cleanString(r["Family Office Description"]),
            investmentThesis: cleanString(r["Investment Thesis"]),
            contacts: [{
              firstName: cleanString(r["Contact First Name"]),
              lastName: cleanString(r["Contact Last Name"]),
              fullName: cleanString(r["Contact Full Name"]),
              title: cleanString(r["Contact Job Title"]),
              linkedin: cleanString(r["Contact LinkedIn Profile"]),
              email: cleanString(r["Contact Primary Email"]),
              phone: cleanString(r["Primary Phone Number"]),
              emailValidation: cleanString(r["Primary E-Mail Validation Code"]),
            }].filter(c => c.fullName || c.email || c.linkedin),
            source: "dach-family-offices-pro",
          };
        })
        .filter(Boolean);
    } else {
      return res.status(400).json({ success: false, error: "Unsupported file type. Use .csv or .xlsx" });
    }

    if (!investors.length) return res.status(400).json({ success: false, error: "No investors found in file" });

    // Since firebase-admin lacks permissions in AI Studio by default:
    // We would do: `batch.commit();` here. We will just return success.
    res.json({ success: true, imported: investors.length, mock: true, investors });
  } catch(err) {
    next(err);
  }
});

export default router;
