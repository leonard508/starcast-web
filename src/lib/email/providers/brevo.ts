import * as brevo from '@getbrevo/brevo';

if (!process.env.BREVO_API_KEY) {
  throw new Error('BREVO_API_KEY environment variable is required');
}

if (!process.env.FROM_EMAIL) {
  throw new Error('FROM_EMAIL environment variable is required');
}

// Configure Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL;
export const DEFAULT_FROM_NAME = process.env.FROM_NAME || 'Starcast';

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

export async function sendEmail(options: EmailOptions): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // Ensure we have either html or text content
    if (!options.html && !options.text) {
      throw new Error('Email must have either html or text content');
    }

    // Prepare recipients
    const recipients = Array.isArray(options.to) 
      ? options.to.map(email => ({ email }))
      : [{ email: options.to }];

    // Prepare attachments for Brevo format
    const brevoAttachments = options.attachments?.map(attachment => ({
      name: attachment.filename,
      content: attachment.content.toString('base64')
    }));

    // Create email data
    const emailData: brevo.SendSmtpEmail = {
      sender: {
        email: DEFAULT_FROM_EMAIL,
        name: DEFAULT_FROM_NAME
      },
      to: recipients,
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text,
      attachment: brevoAttachments
    };

    // Send email via Brevo
    const result = await apiInstance.sendTransacEmail(emailData);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Failed to send email via Brevo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Test connection function
export async function testBrevoConnection(): Promise<{
  success: boolean;
  error?: string;
  accountInfo?: any;
}> {
  try {
    const accountApi = new brevo.AccountApi();
    accountApi.setApiKey(brevo.AccountApiApiKeys.apiKey, process.env.BREVO_API_KEY!);
    
    const result = await accountApi.getAccount();
    
    return {
      success: true,
      accountInfo: {
        email: result.body.email,
        companyName: result.body.companyName,
        plan: result.body.plan
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Connection test failed'
    };
  }
}