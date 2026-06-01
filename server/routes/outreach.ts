import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getDb } from '../firebaseAdmin.js';
import { Resend } from 'resend';

const router = express.Router();
router.use(requireAuth);

// Mock or real API key behavior
// If you do not have a RESEND_API_KEY, it will just log to console and simulate a 1s delay
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

router.post('/send', async (req, res, next) => {
  try {
    const { emailIds, investorName, firm, customIntro, dataRoomLink, roomToken } = req.body;
    
    if (!emailIds || !dataRoomLink) {
      return res.status(400).json({ error: "Missing required fields: emailIds, dataRoomLink." });
    }

    const htmlContent = `
      <p>Hi ${investorName || 'there'},</p>
      ${customIntro ? `<p>${customIntro}</p>` : ''}
      <p>View your full data room here: <a href="${dataRoomLink}"><strong>${dataRoomLink}</strong></a></p>
      <p>Best regards,<br/>[(req as any).user.email]</p>
    `;

    if (resend) {
      await resend.emails.send({
        from: 'Founders <founders@idealapp.dev>', // Needs actual domain verification in prod
        to: emailIds,
        subject: `Pitch Package to ${firm || investorName || 'Investor'}`,
        html: htmlContent
      });
    } else {
      console.log("[MOCK EMAIL SENT] HTML:", htmlContent);
      console.log("To:", emailIds);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Even if simulated, we should update outreach record if outreachId was provided 
    // Actually the prompt says: "Write a corresponding outreach record/update into the user's outreach collection".
    const db = getDb();
    
    const outreachDocs = [];
    for (const email of emailIds) {
      const docRef = await db.collection("users").doc((req as any).user.uid).collection("outreach").add({
        investorName: investorName || email,
        firm: firm || "",
        sentDate: new Date().toISOString(),
        lastOpened: "--",
        timeSpent: "--",
        docsViewed: 0,
        status: "Sent",
        dataRoomLink,
        roomToken: roomToken || null,
        emailSentTo: email
      });
      outreachDocs.push(docRef.id);
    }
    
    res.json({ success: true, outreachIds: outreachDocs });
  } catch (error) {
    console.error("Outreach Send Error:", error);
    res.status(500).json({ error: "Failed to send outreach." });
  }
});

export default router;
