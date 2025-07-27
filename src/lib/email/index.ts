export { emailService, StarcastEmailService } from './service';
export type { 
  EmailService, 
  EmailResult, 
  WelcomeEmailData, 
  ApprovalEmailData, 
  InvoiceEmailData 
} from './service';

export { sendEmail, type EmailOptions } from './providers';
export { WelcomeEmail, ApprovalEmail, InvoiceEmail } from './templates';