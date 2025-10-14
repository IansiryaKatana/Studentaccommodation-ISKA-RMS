// Email Service for automated notifications
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface PaymentNotificationData {
  studentName: string;
  studentEmail: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

export interface AdminNotificationData {
  adminEmail: string;
  studentName: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
}

export class EmailService {
  private static instance: EmailService;

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send payment confirmation email to student
  async sendPaymentConfirmationEmail(data: PaymentNotificationData): Promise<void> {
    try {
      console.log('📧 Sending payment confirmation email to student:', data.studentEmail);
      
      const template = this.generatePaymentConfirmationTemplate(data);
      
      // In a real implementation, you would integrate with an email service like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Nodemailer with SMTP
      
      // For now, we'll log the email content
      console.log('📧 Email Subject:', template.subject);
      console.log('📧 Email Content:', template.text);
      
      // TODO: Implement actual email sending
      // await this.sendEmail(data.studentEmail, template);
      
    } catch (error) {
      console.error('❌ Error sending payment confirmation email:', error);
      throw error;
    }
  }

  // Send payment notification to admin/accountant
  async sendAdminPaymentNotification(data: AdminNotificationData): Promise<void> {
    try {
      console.log('📧 Sending payment notification to admin:', data.adminEmail);
      
      const template = this.generateAdminNotificationTemplate(data);
      
      // Log the email content
      console.log('📧 Admin Email Subject:', template.subject);
      console.log('📧 Admin Email Content:', template.text);
      
      // TODO: Implement actual email sending
      // await this.sendEmail(data.adminEmail, template);
      
    } catch (error) {
      console.error('❌ Error sending admin payment notification:', error);
      throw error;
    }
  }

  // Generate payment confirmation email template
  private generatePaymentConfirmationTemplate(data: PaymentNotificationData): EmailTemplate {
    const subject = `Payment Confirmation - Invoice ${data.invoiceNumber}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .payment-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear ${data.studentName},</p>
            <p>Thank you for your payment! Your payment has been successfully processed.</p>
            
            <div class="payment-details">
              <h3>Payment Details:</h3>
              <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
              <p><strong>Amount Paid:</strong> £${data.amount.toFixed(2)}</p>
              <p><strong>Payment Date:</strong> ${data.paymentDate}</p>
              <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            </div>
            
            <p>This payment has been recorded in your account. If you have any questions, please contact our support team.</p>
            <p>Best regards,<br>{{company_name}} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const text = `
Payment Confirmation - Invoice ${data.invoiceNumber}

Dear ${data.studentName},

Thank you for your payment! Your payment has been successfully processed.

Payment Details:
- Invoice Number: ${data.invoiceNumber}
- Amount Paid: £${data.amount.toFixed(2)}
- Payment Date: ${data.paymentDate}
- Payment Method: ${data.paymentMethod}

This payment has been recorded in your account. If you have any questions, please contact our support team.

Best regards,
{{company_name}} Team

This is an automated message. Please do not reply to this email.
    `;
    
    return { subject, html, text };
  }

  // Generate admin notification email template
  private generateAdminNotificationTemplate(data: AdminNotificationData): EmailTemplate {
    const subject = `New Payment Received - ${data.studentName} - £${data.amount.toFixed(2)}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Payment Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .payment-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 New Payment Received</h1>
          </div>
          <div class="content">
            <p>Hello Admin,</p>
            <p>A new payment has been received in the system.</p>
            
            <div class="payment-details">
              <h3>Payment Details:</h3>
              <p><strong>Student:</strong> ${data.studentName}</p>
              <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
              <p><strong>Amount:</strong> £${data.amount.toFixed(2)}</p>
              <p><strong>Payment Date:</strong> ${data.paymentDate}</p>
            </div>
            
            <p>Please log into the ISKA RMS system to view complete payment details and update any necessary records.</p>
            <p>Best regards,<br>{{company_name}} System</p>
          </div>
          <div class="footer">
            <p>This is an automated notification from ISKA RMS.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const text = `
New Payment Received - ${data.studentName} - £${data.amount.toFixed(2)}

Hello Admin,

A new payment has been received in the system.

Payment Details:
- Student: ${data.studentName}
- Invoice Number: ${data.invoiceNumber}
- Amount: £${data.amount.toFixed(2)}
- Payment Date: ${data.paymentDate}

Please log into the ISKA RMS system to view complete payment details and update any necessary records.

Best regards,
{{company_name}} System

This is an automated notification from ISKA RMS.
    `;
    
    return { subject, html, text };
  }

  // Generate PDF receipt (placeholder)
  async generatePaymentReceipt(data: PaymentNotificationData): Promise<string> {
    try {
      console.log('📄 Generating payment receipt for:', data.invoiceNumber);
      
      // In a real implementation, you would use a PDF library like:
      // - jsPDF
      // - Puppeteer
      // - PDFKit
      
      // For now, return a placeholder URL
      const receiptUrl = `/receipts/${data.invoiceNumber}-${Date.now()}.pdf`;
      console.log('📄 Receipt generated:', receiptUrl);
      
      return receiptUrl;
    } catch (error) {
      console.error('❌ Error generating payment receipt:', error);
      throw error;
    }
  }
}

export default EmailService;
