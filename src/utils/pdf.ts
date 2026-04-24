import { jsPDF } from 'jspdf';

export const downloadPdfText = (content: string, fileName: string) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const marginTop = 16;
  const marginBottom = 16;
  const lineHeight = 5;
  const maxWidth = pageWidth - marginX * 2;

  doc.setFont('courier', 'normal');
  doc.setFontSize(10);

  let cursorY = marginTop;

  const ensureSpace = () => {
    if (cursorY > pageHeight - marginBottom) {
      doc.addPage();
      doc.setFont('courier', 'normal');
      doc.setFontSize(10);
      cursorY = marginTop;
    }
  };

  content.split('\n').forEach((line) => {
    const wrapped = doc.splitTextToSize(line || ' ', maxWidth) as string[];

    wrapped.forEach((segment) => {
      ensureSpace();
      doc.text(segment, marginX, cursorY);
      cursorY += lineHeight;
    });
  });

  doc.save(fileName);
};