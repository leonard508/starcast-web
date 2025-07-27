import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

if (!process.env.FROM_EMAIL) {
  throw new Error('FROM_EMAIL environment variable is required');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

export async function sendEmail(options: EmailOptions) {
  try {
    // Ensure we have either html or text content
    if (!options.html && !options.text) {
      throw new Error('Email must have either html or text content');
    }

    const emailData: any = {
      from: DEFAULT_FROM_EMAIL,
      to: options.to,
      subject: options.subject,
    };

    // Add content - Resend requires either html OR text
    if (options.html) {
      emailData.html = options.html;
    } else if (options.text) {
      emailData.text = options.text;
    }

    // Add attachments if provided
    if (options.attachments) {
      emailData.attachments = options.attachments;
    }

    const result = await resend.emails.send(emailData);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}