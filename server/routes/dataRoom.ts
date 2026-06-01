import express from "express";
import crypto from "crypto";
import { z } from "zod";
import multer from 'multer';
import { FieldValue } from "firebase-admin/firestore";
import { getDb, getAdminApp } from "../firebaseAdmin.ts";
import { requireAuth } from "../middleware/auth.ts";
import { DataRoomPermissions, defaultPermissions } from "../../src/types/dataRoom.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function makeToken() {
  return crypto.randomBytes(24).toString("hex");
}

const permissionsSchema = z.object({
  hasPassword: z.boolean().default(false),
  password: z.string().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  allowDownload: z.boolean().default(false),
  requireNDA: z.boolean().default(false),
});

const CreateLinkSchema = z.object({
  documentIds: z.array(z.string()).min(1),
  companyId: z.string().optional(),
  label: z.string().optional(),
  campaignId: z.string().optional(),
  permissions: permissionsSchema.optional(),
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
    
    const permissions = link.permissions || {};
    
    if (permissions.hasPassword) {
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
    
    // Fetch actual documents for returning in the data room payload
    const documents = [];
    if (link.documentIds && link.documentIds.length > 0) {
      for (const docId of link.documentIds) {
        const docSnap = await db.collection("users").doc(link.ownerId).collection("documents").doc(docId).get();
        if (docSnap.exists) {
          const docData = docSnap.data();
          const sectionsSnap = await db.collection("users").doc(link.ownerId).collection("documents").doc(docId).collection("sections").get();
          
          const subSections: Record<string, any> = {};
          sectionsSnap.forEach(s => subSections[s.id] = s.data());
          
          let sections = [];
          if (docData?.sectionOrder && docData.sectionOrder.length > 0) {
            sections = docData.sectionOrder.map((sid: string) => subSections[sid]).filter(Boolean);
          } else if (docData?.sections && docData.sections.length > 0) {
            sections = docData.sections;
          }
          
          documents.push({
            id: docId,
            title: docData?.title || "Untitled",
            companyName: docData?.companyName || "My Company",
            type: docData?.type || "Custom",
            sections
          });
        }
      }
    }

    res.json({
      success: true,
      dataRoom: {
        id: linkDoc.id,
        ownerId: link.ownerId,
        documentIds: link.documentIds,
        permissions: link.permissions,
        allowDownload: permissions.allowDownload,
        documents
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

// POST /api/data-room-links/create
router.post("/create", async (req, res, next) => {
  try {
    const parsed = CreateLinkSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.issues });

    const db = getDb();
    const token = makeToken();
    const now = new Date();

    const permissions: DataRoomPermissions = parsed.data.permissions ?? defaultPermissions;
    const passwordHash =
      permissions.hasPassword && permissions.password
        ? hashPassword(permissions.password)
        : null;

    const payload = {
      token,
      ownerId: req.user!.uid,
      companyId: parsed.data.companyId || null,
      label: parsed.data.label || null,
      campaignId: parsed.data.campaignId || null,
      documentIds: parsed.data.documentIds,
      permissions: {
        hasPassword: permissions.hasPassword,
        allowDownload: permissions.allowDownload,
        requireNDA: permissions.requireNDA,
      },
      passwordHash,
      expiresAt: permissions.expiresAt ? new Date(permissions.expiresAt) : null,
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
      publicUrl: `${process.env.PUBLIC_APP_URL || "http://localhost:5173"}/r/${token}`,
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
