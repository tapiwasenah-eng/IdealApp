import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getDb } from '../firebaseAdmin.js';
import puppeteer, { PuppeteerLifeCycleEvent } from 'puppeteer';
import pptxgen from 'pptxgenjs';

const EXPORT_WAIT_UNTIL: PuppeteerLifeCycleEvent = "load";

const router = express.Router();

router.use(requireAuth);

router.get('/pdf/:documentId', async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const db = getDb();
    const docRef = await db.collection("users").doc((req as any).user.uid).collection("documents").doc(documentId).get();
    
    if (!docRef.exists) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    const docData = docRef.data();
    const sections = docData?.sections || [];

    // Simple HTML layout for PDF representation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
          h1, h2, h3 { color: #111; }
          .page-break { page-break-after: always; }
          .section { margin-bottom: 40px; }
          .title-page { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; }
          .title { font-size: 48px; font-weight: bold; margin-bottom: 20px; }
          .subtitle { font-size: 24px; color: #666; }
        </style>
      </head>
      <body>
        <div class="title-page page-break">
          <div class="title">${docData?.title || 'Untitled Document'}</div>
          <div class="subtitle">${docData?.companyName || ''}</div>
          <div class="subtitle" style="margin-top:20px; font-size: 16px;">${docData?.type || ''}</div>
        </div>
        ${sections.map((s: any) => `
          <div class="section page-break">
            <h2>${s.title}</h2>
            <div>${s.content}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: EXPORT_WAIT_UNTIL });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(docData?.title || 'document').replace(/[^a-z0-9]/gi, '_')}.pdf"`);
    res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF Export Error:", error);
    res.status(500).json({ error: "Failed to generate PDF." });
  }
});

router.get('/pptx/:documentId', async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const db = getDb();
    const docRef = await db.collection("users").doc((req as any).user.uid).collection("documents").doc(documentId).get();
    
    if (!docRef.exists) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    const docData = docRef.data();
    const sections = docData?.sections || [];

    const pres = new pptxgen();
    
    // Title Slide
    const slide = pres.addSlide();
    slide.addText(docData?.title || 'Untitled Document', { x: 1, y: 2, w: 8, h: 1.5, fontSize: 44, bold: true, align: pres.AlignH.center, color: '1f2937' });
    slide.addText(docData?.companyName || '', { x: 1, y: 3.5, w: 8, h: 1, fontSize: 24, align: pres.AlignH.center, color: '6b7280' });

    // Content Slides
    for (const section of sections) {
      const s = pres.addSlide();
      
      s.addText(section.title, { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 24, bold: true, color: '3730a3' });
      
      // Extremely basic HTML to text stripping for PPTX MVP. 
      // Replace breaks with newlines, strip other tags.
      const rawText = section.content
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<li>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]+>/g, '') // strip remaining
        .replace(/&nbsp;/g, ' ')
        .trim();

      s.addText(rawText, { x: 0.5, y: 1.8, w: 9, h: 3.3, fontSize: 14, color: '4b5563', align: pres.AlignH.left, valign: pres.AlignV.top });
    }

    const pptxBuffer = await pres.write({ outputType: 'nodebuffer' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${(docData?.title || 'document').replace(/[^a-z0-9]/gi, '_')}.pptx"`);
    res.end(pptxBuffer);
  } catch (error) {
    console.error("PPTX Export Error:", error);
    res.status(500).json({ error: "Failed to generate PPTX." });
  }
});

export default router;
