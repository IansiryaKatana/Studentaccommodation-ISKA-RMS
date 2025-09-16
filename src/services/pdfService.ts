import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice, Branding } from './api';

interface InvoiceData {
  invoice: Invoice;
  reservation?: any & { studio?: any };
  student?: any;
  tourist?: any;
  branding?: Branding;
}

export class PDFService {
  static async generateInvoicePDF(data: InvoiceData): Promise<jsPDF> {
    const { invoice, reservation, student, tourist, branding } = data;
    
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Set font
    pdf.setFont('helvetica');
    
    // Header with branding
    this.drawHeader(pdf, branding, margin, contentWidth);
    
    // Invoice title
    pdf.setFontSize(24);
    pdf.setTextColor(50, 50, 50);
    pdf.text('INVOICE', margin, 80);
    
    // Invoice details
    this.drawInvoiceDetails(pdf, invoice, margin, contentWidth);
    
    // Customer information
    this.drawCustomerInfo(pdf, reservation, student, tourist, margin, contentWidth);
    
    // Studio information
    if (reservation?.studio) {
      this.drawStudioInfo(pdf, reservation.studio, margin, contentWidth);
    }
    
    // Invoice items
    this.drawInvoiceItems(pdf, invoice, margin, contentWidth);
    
    // Total section
    this.drawTotalSection(pdf, invoice, margin, contentWidth);
    
    // Footer
    this.drawFooter(pdf, branding, margin, pageHeight);
    
    return pdf;
  }
  
  private static drawHeader(pdf: jsPDF, branding?: Branding, margin: number = 20, contentWidth: number = 170) {
    const y = 30;
    
    // Company logo (placeholder)
    if (branding?.logo_url) {
      // In a real implementation, you would load and embed the logo image
      // For now, we'll use a placeholder
      pdf.setFillColor(59, 130, 246); // Blue color
      pdf.rect(margin, y - 10, 40, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text('LOGO', margin + 20, y + 2);
    }
    
    // Company information
    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(branding?.company_name || 'ISKA RMS', margin + 50, y);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    if (branding?.company_address) {
      pdf.text(branding.company_address, margin + 50, y + 8);
    }
    if (branding?.company_phone) {
      pdf.text(`Phone: ${branding.company_phone}`, margin + 50, y + 12);
    }
    if (branding?.company_email) {
      pdf.text(`Email: ${branding.company_email}`, margin + 50, y + 16);
    }
    if (branding?.company_website) {
      pdf.text(`Website: ${branding.company_website}`, margin + 50, y + 20);
    }
    
    // Invoice number and date (right side)
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Invoice Number:', contentWidth + margin - 60, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoice.invoice_number, contentWidth + margin - 60, y + 6);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Issue Date:', contentWidth + margin - 60, y + 15);
    pdf.setFont('helvetica', 'normal');
    pdf.text(new Date(invoice.created_at).toLocaleDateString(), contentWidth + margin - 60, y + 21);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Due Date:', contentWidth + margin - 60, y + 30);
    pdf.setFont('helvetica', 'normal');
    pdf.text(new Date(invoice.due_date).toLocaleDateString(), contentWidth + margin - 60, y + 36);
  }
  
  private static drawInvoiceDetails(pdf: jsPDF, invoice: Invoice, margin: number, contentWidth: number) {
    const y = 100;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Invoice Details', margin, y);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Status: ${invoice.status.toUpperCase()}`, margin, y + 8);
    pdf.text(`Amount: £${invoice.amount.toFixed(2)}`, margin, y + 12);
    if (invoice.tax_amount > 0) {
      pdf.text(`Tax: £${invoice.tax_amount.toFixed(2)}`, margin, y + 16);
    }
    pdf.text(`Total: £${invoice.total_amount.toFixed(2)}`, margin, y + 20);
  }
  
  private static drawCustomerInfo(pdf: jsPDF, reservation?: any, student?: any, tourist?: any, margin: number = 20, contentWidth: number = 170) {
    const y = 140;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Customer Information', margin, y);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    if (reservation?.type === 'student' && student) {
      pdf.text(`Name: ${student.user?.first_name || ''} ${student.user?.last_name || ''}`, margin, y + 8);
      pdf.text(`Student ID: ${student.student_id || ''}`, margin, y + 12);
      pdf.text(`Email: ${student.user?.email || ''}`, margin, y + 16);
      pdf.text(`Phone: ${student.user?.phone || ''}`, margin, y + 20);
    } else if (reservation?.type === 'tourist' && tourist) {
      pdf.text(`Name: ${tourist.first_name || ''} ${tourist.last_name || ''}`, margin, y + 8);
      pdf.text(`Tourist ID: ${tourist.id || ''}`, margin, y + 12);
      pdf.text(`Email: ${tourist.email || ''}`, margin, y + 16);
      pdf.text(`Phone: ${tourist.phone || ''}`, margin, y + 20);
    }
    
    if (reservation) {
      pdf.text(`Reservation Number: ${reservation.reservation_number || ''}`, margin, y + 24);
      pdf.text(`Check-in: ${new Date(reservation.check_in_date).toLocaleDateString()}`, margin, y + 28);
      pdf.text(`Check-out: ${new Date(reservation.check_out_date).toLocaleDateString()}`, margin, y + 32);
    }
  }
  
  private static drawStudioInfo(pdf: jsPDF, studio: any, margin: number, contentWidth: number) {
    const y = 200;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Studio Information', margin, y);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Studio Number: ${studio.studio_number || ''}`, margin, y + 8);
    if (studio.floor) {
      pdf.text(`Floor: ${studio.floor}`, margin, y + 12);
    }
    pdf.text(`Status: ${studio.status || ''}`, margin, y + 16);
  }
  
  private static drawInvoiceItems(pdf: jsPDF, invoice: Invoice, margin: number, contentWidth: number) {
    const y = 240;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Invoice Items', margin, y);
    
    // Table header
    const tableY = y + 10;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, tableY - 5, contentWidth, 8, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', margin + 2, tableY);
    pdf.text('Amount', margin + contentWidth - 30, tableY);
    
    // Table content
    pdf.setFont('helvetica', 'normal');
    pdf.text('Reservation Payment', margin + 2, tableY + 8);
    pdf.text(`£${invoice.amount.toFixed(2)}`, margin + contentWidth - 30, tableY + 8);
    
    if (invoice.tax_amount > 0) {
      pdf.text('Tax', margin + 2, tableY + 16);
      pdf.text(`£${invoice.tax_amount.toFixed(2)}`, margin + contentWidth - 30, tableY + 16);
    }
  }
  
  private static drawTotalSection(pdf: jsPDF, invoice: Invoice, margin: number, contentWidth: number) {
    const y = 280;
    
    // Total box
    pdf.setFillColor(250, 250, 250);
    pdf.rect(margin + contentWidth - 80, y, 80, 30, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin + contentWidth - 80, y, 80, 30, 'S');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL', margin + contentWidth - 75, y + 10);
    pdf.text(`£${invoice.total_amount.toFixed(2)}`, margin + contentWidth - 75, y + 20);
  }
  
  private static drawFooter(pdf: jsPDF, branding?: Branding, margin: number = 20, pageHeight: number = 297) {
    const y = pageHeight - 30;
    
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');
    
    const footerText = `Thank you for your business. ${branding?.company_name || 'ISKA RMS'}`;
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.text(footerText, (pdf.internal.pageSize.getWidth() - footerWidth) / 2, y);
    
    pdf.text('This is a computer-generated invoice. No signature required.', margin, y + 8);
  }
  
  static async generateInvoiceHTML(data: InvoiceData): Promise<string> {
    const { invoice, reservation, student, tourist, branding } = data;
    
    const customerName = reservation?.type === 'student' && student 
      ? `${student.user?.first_name || ''} ${student.user?.last_name || ''}`
      : reservation?.type === 'tourist' && tourist
      ? `${tourist.first_name || ''} ${tourist.last_name || ''}`
      : 'N/A';
    
    const customerEmail = reservation?.type === 'student' && student 
      ? student.user?.email 
      : reservation?.type === 'tourist' && tourist
      ? tourist.email
      : 'N/A';
    
    const customerPhone = reservation?.type === 'student' && student 
      ? student.user?.phone 
      : reservation?.type === 'tourist' && tourist
      ? tourist.phone
      : 'N/A';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
          body {
            font-family: '${branding?.font_family || 'Arial, sans-serif'}';
            margin: 0;
            padding: 20px;
            background-color: white;
            color: #333;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #${branding?.primary_color?.replace('#', '') || '3B82F6'};
          }
          .company-info {
            flex: 1;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #${branding?.primary_color?.replace('#', '') || '3B82F6'};
            margin-bottom: 10px;
          }
          .company-details {
            font-size: 12px;
            line-height: 1.4;
          }
          .invoice-details {
            text-align: right;
          }
          .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #${branding?.secondary_color?.replace('#', '') || '1F2937'};
            margin-bottom: 20px;
          }
          .invoice-info {
            font-size: 14px;
            line-height: 1.6;
          }
          .content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          .customer-info, .studio-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #${branding?.secondary_color?.replace('#', '') || '1F2937'};
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .info-label {
            font-weight: 600;
            color: #666;
          }
          .info-value {
            color: #333;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .items-table th {
            background-color: #${branding?.primary_color?.replace('#', '') || '3B82F6'};
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
          }
          .total-section {
            text-align: right;
            margin-top: 20px;
          }
          .total-box {
            display: inline-block;
            background-color: #${branding?.accent_color?.replace('#', '') || '10B981'};
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <div class="company-name">${branding?.company_name || 'ISKA RMS'}</div>
            <div class="company-details">
              ${branding?.company_address ? `${branding.company_address}<br>` : ''}
              ${branding?.company_phone ? `Phone: ${branding.company_phone}<br>` : ''}
              ${branding?.company_email ? `Email: ${branding.company_email}<br>` : ''}
              ${branding?.company_website ? `Website: ${branding.company_website}` : ''}
            </div>
          </div>
          <div class="invoice-details">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-info">
              <div><strong>Invoice Number:</strong> ${invoice.invoice_number}</div>
              <div><strong>Issue Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</div>
              <div><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</div>
              <div><strong>Status:</strong> ${invoice.status.toUpperCase()}</div>
            </div>
          </div>
        </div>
        
        <div class="content">
          <div class="customer-info">
            <div class="section-title">Customer Information</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${customerName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${customerEmail}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${customerPhone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Reservation:</span>
              <span class="info-value">${reservation?.reservation_number || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Check-in:</span>
              <span class="info-value">${reservation ? new Date(reservation.check_in_date).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Check-out:</span>
              <span class="info-value">${reservation ? new Date(reservation.check_out_date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
          
          <div class="studio-info">
            <div class="section-title">Studio Information</div>
            <div class="info-row">
              <span class="info-label">Studio Number:</span>
              <span class="info-value">${reservation?.studio?.studio_number || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Floor:</span>
              <span class="info-value">${reservation?.studio?.floor || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">${reservation?.studio?.status || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Reservation Payment</td>
              <td style="text-align: right;">£${invoice.amount.toFixed(2)}</td>
            </tr>
            ${invoice.tax_amount > 0 ? `
            <tr>
              <td>Tax</td>
              <td style="text-align: right;">£${invoice.tax_amount.toFixed(2)}</td>
            </tr>
            ` : ''}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-box">
            Total: £${invoice.total_amount.toFixed(2)}
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your business. ${branding?.company_name || 'ISKA RMS'}</p>
          <p>This is a computer-generated invoice. No signature required.</p>
        </div>
      </body>
      </html>
    `;
  }
  
  static async generateInvoiceFromHTML(data: InvoiceData): Promise<jsPDF> {
    const html = await this.generateInvoiceHTML(data);
    
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    document.body.appendChild(tempDiv);
    
    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: tempDiv.scrollHeight
      });
      
      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      return pdf;
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  }
} 