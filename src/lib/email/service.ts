import { render } from '@react-email/components';
import { sendEmail, type EmailOptions } from './providers';
import { WelcomeEmail, ApprovalEmail, InvoiceEmail, RejectionEmail, AdminNotificationEmail } from './templates';

export interface EmailService {
  sendWelcomeEmail: (data: WelcomeEmailData) => Promise<EmailResult>;
  sendApprovalEmail: (data: ApprovalEmailData) => Promise<EmailResult>;
  sendInvoiceEmail: (data: InvoiceEmailData) => Promise<EmailResult>;
  sendRejectionEmail: (data: RejectionEmailData) => Promise<EmailResult>;
  sendAdminNotification: (data: AdminNotificationEmailData) => Promise<EmailResult>;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface WelcomeEmailData {
  to: string;
  customerName: string;
  packageName: string;
  applicationId: string;
  contactPhone?: string;
}

export interface ApprovalEmailData {
  to: string;
  customerName: string;
  packageName: string;
  activationDate: string;
  installationContact?: string;
  accountNumber?: string;
}

export interface InvoiceEmailData {
  to: string;
  customerName: string;
  invoiceNumber: string;
  dueDate: string;
  amount: number;
  packageName: string;
  billingPeriod: string;
  paymentUrl?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

export interface RejectionEmailData {
  to: string;
  customerName: string;
  packageName: string;
  applicationId: string;
  rejectionReason?: string;
  alternativeOptions?: string;
  contactPhone?: string;
}

export interface AdminNotificationEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  packageName: string;
  applicationId: string;
  serviceAddress: any;
  submittedAt: string;
  specialRequirements?: string;
  dashboardUrl?: string;
}

export class StarcastEmailService implements EmailService {
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailResult> {
    try {
      const emailHtml = await render(WelcomeEmail({
        customerName: data.customerName,
        packageName: data.packageName,
        applicationId: data.applicationId,
        contactPhone: data.contactPhone,
      }));

      const emailOptions: EmailOptions = {
        to: data.to,
        subject: `Welcome to Starcast - ${data.packageName} Application Received`,
        html: emailHtml,
      };

      return await sendEmail(emailOptions);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendApprovalEmail(data: ApprovalEmailData): Promise<EmailResult> {
    try {
      const emailHtml = await render(ApprovalEmail({
        customerName: data.customerName,
        packageName: data.packageName,
        activationDate: data.activationDate,
        installationContact: data.installationContact,
        accountNumber: data.accountNumber,
      }));

      const emailOptions: EmailOptions = {
        to: data.to,
        subject: `Service Approved! ${data.packageName} - Installation Scheduled`,
        html: emailHtml,
      };

      return await sendEmail(emailOptions);
    } catch (error) {
      console.error('Failed to send approval email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendInvoiceEmail(data: InvoiceEmailData): Promise<EmailResult> {
    try {
      const emailHtml = await render(InvoiceEmail({
        customerName: data.customerName,
        invoiceNumber: data.invoiceNumber,
        dueDate: data.dueDate,
        amount: data.amount,
        packageName: data.packageName,
        billingPeriod: data.billingPeriod,
        paymentUrl: data.paymentUrl,
      }));

      const emailOptions: EmailOptions = {
        to: data.to,
        subject: `Invoice ${data.invoiceNumber} - R${data.amount.toFixed(2)} due ${data.dueDate}`,
        html: emailHtml,
        attachments: data.attachments,
      };

      return await sendEmail(emailOptions);
    } catch (error) {
      console.error('Failed to send invoice email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendRejectionEmail(data: RejectionEmailData): Promise<EmailResult> {
    try {
      const emailHtml = await render(RejectionEmail({
        customerName: data.customerName,
        packageName: data.packageName,
        applicationId: data.applicationId,
        rejectionReason: data.rejectionReason,
        alternativeOptions: data.alternativeOptions,
        contactPhone: data.contactPhone,
      }));

      const emailOptions: EmailOptions = {
        to: data.to,
        subject: `Service Update - ${data.packageName} Application`,
        html: emailHtml,
      };

      return await sendEmail(emailOptions);
    } catch (error) {
      console.error('Failed to send rejection email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendAdminNotification(data: AdminNotificationEmailData): Promise<EmailResult> {
    try {
      const emailHtml = await render(AdminNotificationEmail({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        packageName: data.packageName,
        applicationId: data.applicationId,
        serviceAddress: data.serviceAddress,
        submittedAt: data.submittedAt,
        specialRequirements: data.specialRequirements,
        dashboardUrl: data.dashboardUrl,
      }));

      const emailOptions: EmailOptions = {
        to: process.env.ADMIN_EMAIL || 'starcast.tech@gmail.com',
        subject: `🚨 New Application: ${data.customerName} - ${data.packageName}`,
        html: emailHtml,
      };

      return await sendEmail(emailOptions);
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const emailService = new StarcastEmailService();