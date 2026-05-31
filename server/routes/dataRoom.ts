import express from "express";
import crypto from "crypto";
import { z } from "zod";
import multer from 'multer';
import { FieldValue } from "firebase-admin/firestore";
import { getDb, getAdminApp } from "../firebaseAdmin.ts";
import { requireAuth } from "../middleware/auth.ts";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function makeToken() {
  return crypto.randomBytes(24).toString("hex");
}

const CreateLinkSchema = z.object({
  documentIds: z.array(z.string()).min(1),
  hasPassword: z.boolean().default(false),
  password: z.string().optional(),        // plain only for creation
  expiresAt: z.string().datetime().nullable().optional(),
  allowDownload: z.boolean().default(false),
  emailNotify: z.boolean().default(false),
});

// PUBLIC ENDPOINTS

// GET /api/data-room-links/public/:token
router.post("/public/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body; // Might be empty
    const db = getDb();
    
    const snap = await db.collection("dataRoomLinks").where("token", "==", token).limit(1).get();
    if (snap.empty) {
      return res.status(404).json({ success: false, error: "Link not found or expired" });
    }
    
    const linkDoc = snap.docs[0];
    const link = linkDoc.data();
    
    if (link.expiresAt && link.expiresAt.toDate() < new Date()) {
      return res.status(400).json({ success: false, error: "This link has expired" });
    }
    
    if (link.hasPassword) {
      if (!password) {
        return res.status(401).json({ success: false, requirePassword: true });
      }
      const hashed = hashPassword(password);
      if (hashed !== link.passwordHash) {
        return res.status(401).json({ success: false, requirePassword: true, error: "Incorrect password" });
      }
    }
    
    // Log initial access
    await linkDoc.ref.update({
      viewCount: (link.viewCount || 0) + 1,
      accessLog: FieldValue.arrayUnion({
        timestamp: new Date(),
        type: 'login'
      })
    });
    
    // For now we'll just return the document IDs. In a real app we'd fetch the document metadata here
    // or the frontend fetches them.
    res.json({
      success: true,
      dataRoom: {
        id: linkDoc.id,
        ownerId: link.ownerId,
        documentIds: link.documentIds,
        allowDownload: link.allowDownload
      }
    });
    
  } catch(err) {
    next(err);
  }
});

// POST /api/data-room-links/public/:token/analytics
router.post("/public/:token/analytics", async (req, res, next) => {
  try {
    const { token } = req.params;
    const { documentId, durationSeconds } = req.body;
    
    const db = getDb();
    const snap = await db.collection("dataRoomLinks").where("token", "==", token).limit(1).get();
    
    if (!snap.empty) {
      const linkDoc = snap.docs[0];
      const linkId = linkDoc.id;
      const ownerId = linkDoc.data().ownerId;
      
      // We will record the view in a subcollection or separate analytics collection
      await db.collection("dataRoomViews").add({
        linkId,
        token,
        ownerId,
        documentId,
        durationSeconds,
        timestamp: new Date()
      });
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: "Not found" });
    }
  } catch(err) {
    next(err);
  }
});

// AUTHENTICATED ENDPOINTS BELOW
router.use(requireAuth);

// Upload file
router.post('/upload', upload.single('file'), async (req, res, next) => {
  const { workspaceId, projectId, folderId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const admin = await import('firebase-admin');
    const bucket = getAdminApp().storage().bucket();
    const fileName = `data-rooms/${workspaceId}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    const db = getDb();
    
    // Fallback if FieldValue isn't available
    const FieldValue = admin.default.firestore.FieldValue;

    const docRef = await db.collection('dataRoomItems').add({
      workspaceId: workspaceId || req.user!.uid, // Fallback if no workspaceId
      projectId: projectId || null,
      folderId: folderId || null,
      name: file.originalname,
      type: 'file',
      fileUrl: url,
      storagePath: fileName,
      createdBy: req.user!.uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.json({ id: docRef.id, url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List files
router.get('/workspace/:workspaceId', async (req, res, next) => {
  const { workspaceId } = req.params;

  try {
    const snapshot = await getDb()
      .collection('dataRoomItems')
      .where('workspaceId', '==', workspaceId)
      .orderBy('createdAt', 'desc')
      .get();

    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const docRef = getDb().collection('dataRoomItems').doc(id);
    const doc = await docRef.get();
    const data = doc.data();

    if (data?.storagePath) {
      await getAdminApp().storage().bucket().file(data.storagePath).delete();
    }

    await docRef.delete();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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
      publicUrl: `${process.env.PUBLIC_APP_URL || "http://localhost:5173"}/r/${token}`, // updating to standard /r/ route
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
