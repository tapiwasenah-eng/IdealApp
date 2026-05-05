import express from "express";
import crypto from "crypto";
import { z } from "zod";
import { getDb } from "../firebaseAdmin.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

const CreateLinkSchema = z.object({
  documentIds: z.array(z.string()).min(1),
  hasPassword: z.boolean().default(false),
  password: z.string().optional(),        // plain only for creation
  expiresAt: z.string().datetime().nullable().optional(),
  allowDownload: z.boolean().default(false),
  emailNotify: z.boolean().default(false),
});

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function makeToken() {
  return crypto.randomBytes(24).toString("hex");
}

// POST /api/data-room-links
router.post("/", async (req, res, next) => {
  try {
    const parsed = CreateLinkSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.message });

    const db = getDb();
    const token = makeToken();
    const now = new Date();

    const passwordHash =
      parsed.data.hasPassword && parsed.data.password
        ? hashPassword(parsed.data.password)
        : null;

    const payload = {
      token,
      ownerId: req.user!.uid,
      documentIds: parsed.data.documentIds,
      hasPassword: parsed.data.hasPassword,
      passwordHash,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      allowDownload: parsed.data.allowDownload,
      emailNotify: parsed.data.emailNotify,
      viewCount: 0,
      accessLog: [],
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("dataRoomLinks").add(payload);

    res.json({
      success: true,
      id: ref.id,
      token,
      publicUrl: `${process.env.PUBLIC_APP_URL || "http://localhost:5173"}/data-room/${token}`,
    });
  } catch(err) {
    next(err);
  }
});

// GET /api/data-room-links
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const snap = await db.collection("dataRoomLinks")
      .where("ownerId", "==", req.user!.uid)
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    res.json({ success: true, links: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch(err) {
    next(err);
  }
});

export default router;
