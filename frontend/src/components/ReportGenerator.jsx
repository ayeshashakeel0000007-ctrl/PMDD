import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReportGenerator = ({ elementId, filename = 'PMDD_Analysis_Report.pdf' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const container = document.getElementById(elementId);
    if (!container) {
      console.error(`Container with id ${elementId} not found.`);
      return;
    }

    let sections = Array.from(container.querySelectorAll('.export-page'));
    if (sections.length === 0) {
      sections = [container];
    }

    setIsExporting(true);

    // Yield to allow UI to update (show loading spinner)
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = pdfHeight - margin * 2 - 15;

      for (let i = 0; i < sections.length; i++) {
        const element = sections[i];
        const appendixTitle = element.getAttribute('data-appendix') || `Figure ${i + 1}`;
        
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = '#0f172a';
        
        // Yield before each heavy canvas operation to prevent UI freeze
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0f172a',
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        });

        element.style.backgroundColor = originalBg;

        const imgData = canvas.toDataURL('image/png');
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(contentWidth / imgWidth, contentHeight / imgHeight);
        
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;
        
        const imgX = margin + (contentWidth - scaledWidth) / 2;
        const imgY = margin + 15;
        
        if (i > 0) {
          pdf.addPage();
        }

        // Header - Academic Styling
        pdf.setTextColor(60);
        pdf.setFont("times", "bold");
        pdf.setFontSize(14);
        pdf.text("PMDD Computational Linguistics Laboratory", margin, margin);
        
        pdf.setFont("times", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(new Date().toLocaleDateString(), pdfWidth - margin, margin, { align: 'right' });
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(80);
        pdf.text(appendixTitle, margin, margin + 7);
        
        pdf.setDrawColor(200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, margin + 10, pdfWidth - margin, margin + 10);

        // Content
        pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);

        // Footer
        pdf.setFont("times", "italic");
        pdf.setFontSize(10);
        pdf.text(`Page ${i + 1} of ${sections.length}`, pdfWidth / 2, pdfHeight - margin + 5, { align: 'center' });
      }

      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center px-4 py-2 bg-pmdd-dark/80 border border-pmdd-accent/50 text-white rounded-md hover:bg-pmdd-accent/20 transition-all shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
      title="Export to PDF"
    >
      {isExporting ? (
        <Loader size={18} className="animate-spin text-pmdd-accent" />
      ) : (
        <Download size={18} className="text-pmdd-accent group-hover:scale-110 transition-transform" />
      )}
      <span className="ml-2 text-sm font-medium">
        {isExporting ? 'Generating Academic PDF...' : 'Export Publication PDF'}
      </span>
    </button>
  );
};

export default ReportGenerator;
