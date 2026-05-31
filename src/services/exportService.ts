import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';
import { saveAs } from 'file-saver';

export async function exportToPdf(canvas: any, filename: string): Promise<void> {
  const dataUrl = canvas.toDataURL({ format: 'png', quality: 1 });
  const pdf = new jsPDF('l', 'px', [canvas.width, canvas.height]);
  pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
}

export async function exportGeneratedDocumentToPdf(doc: any, filename: string): Promise<void> {
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 40;
  let cursorY = 60;

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text(doc.title || 'Untitled Document', margin, cursorY);
  cursorY += 40;

  // Sections
  doc.sections.forEach((section: any) => {
    // Check if we need a new page
    if (cursorY > pdf.internal.pageSize.getHeight() - 100) {
      pdf.addPage();
      cursorY = 60;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text(section.heading || 'Section', margin, cursorY);
    cursorY += 25;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const splitText = pdf.splitTextToSize(section.content || '', pageWidth - margin * 2);
    pdf.text(splitText, margin, cursorY);
    cursorY += splitText.length * 15 + 30;
  });

  pdf.save(`${filename}.pdf`);
}

export async function exportToDocx(sections: any[], filename: string): Promise<void> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections.map(section => {
        return new Paragraph({
          children: [
            new TextRun({ text: section.title, bold: true, size: 32 }),
            new TextRun({ text: '\n' + section.content, size: 24 }),
          ],
        });
      }),
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

export async function exportToPptx(canvas: any, filename: string): Promise<void> {
  // PPTX export is complex with pure JS, usually done with PptxGenJS
  // For now, we'll provide a placeholder or use a library if installed.
  console.log('PPTX export triggered for', filename);
  // Placeholder: in a real app, we'd use PptxGenJS
}

export const exportService = {
  exportToPdf,
  exportToDocx,
  exportToPptx
};
