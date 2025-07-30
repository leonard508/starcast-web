import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '@/lib/auth/middleware'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting for WhatsApp messages - 10 messages per minute per admin
    const rateLimitResult = rateLimit(10, 60000)(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Require admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    const { to, message } = body;

    // Validate required fields
    if (!to || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['to', 'message']
        },
        { status: 400, headers }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
    if (!phoneRegex.test(to)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid phone number format'
        },
        { status: 400, headers }
      );
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = to.replace(/[\s\-\(\)]/g, '');

    // Try multiple WhatsApp providers in order of preference
    try {
      const result = await sendViaThirdPartyService(cleanPhone, message);
      
      // Store outgoing message in database
      try {
        // Check if user exists by phone number
        const existingUser = await db.user.findFirst({
          where: {
            phone: result.to
          }
        });

        await db.whatsAppMessage.create({
          data: {
            messageId: result.messageId,
            direction: 'OUTGOING',
            fromNumber: process.env.TWILIO_WHATSAPP_NUMBER?.replace('whatsapp:', '') || '+27872502788',
            toNumber: result.to,
            messageBody: result.demo ? `[DEMO] ${message}` : message,
            status: result.demo ? 'DEMO_SENT' : 'SENT',
            sentAt: new Date(),
            userId: existingUser?.id || null,
            isAutoResponse: false,
            escalated: false
          }
        });
      } catch (dbError) {
        console.error('Failed to store outgoing message in database:', dbError);
        // Continue even if DB storage fails
      }
      
      return NextResponse.json({
        success: true,
        message: 'WhatsApp message sent successfully',
        data: result
      }, { headers });

    } catch (whatsappError) {
      console.error('WhatsApp API request failed:', whatsappError);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to send WhatsApp message: ${whatsappError instanceof Error ? whatsappError.message : 'Unknown error'}`
        },
        { status: 500, headers }
      );
    }

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send WhatsApp message'
      },
      { 
        status: 500,
        headers: {
          ...securityHeaders(),
          ...corsHeaders()
        }
      }
    );
  }
}

// Format phone number for WhatsApp (ensure proper international format)
function formatWhatsAppNumber(phoneNumber: string): string {
  // Remove any existing whatsapp: prefix
  let cleanNumber = phoneNumber.replace(/^whatsapp:/, '');
  
  // Remove spaces, dashes, brackets
  cleanNumber = cleanNumber.replace(/[\s\-\(\)]/g, '');
  
  // Handle South African numbers
  if (cleanNumber.startsWith('0')) {
    // Convert 0821234567 to +27821234567
    cleanNumber = '+27' + cleanNumber.substring(1);
  } else if (cleanNumber.startsWith('27') && !cleanNumber.startsWith('+')) {
    // Convert 27821234567 to +27821234567
    cleanNumber = '+' + cleanNumber;
  } else if (!cleanNumber.startsWith('+')) {
    // Add + if missing
    cleanNumber = '+' + cleanNumber;
  }
  
  return cleanNumber;
}

// Multiple WhatsApp provider implementation with fallback
async function sendViaThirdPartyService(to: string, message: string) {
  let lastError: Error | null = null;
  
  // Format the phone number properly
  const formattedNumber = formatWhatsAppNumber(to);
  
  // 1. Twilio WhatsApp API (Primary configured provider)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
    // Check if credentials are placeholder values
    const isPlaceholderSID = process.env.TWILIO_ACCOUNT_SID.includes('xxx') || 
                             process.env.TWILIO_ACCOUNT_SID.includes('placeholder') ||
                             process.env.TWILIO_ACCOUNT_SID === 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    const isPlaceholderToken = process.env.TWILIO_AUTH_TOKEN.includes('placeholder') || 
                              process.env.TWILIO_AUTH_TOKEN.includes('your-') ||
                              process.env.TWILIO_AUTH_TOKEN === 'your-twilio-auth-token-here';
    
    if (isPlaceholderSID || isPlaceholderToken) {
      console.log('⚠️ Twilio credentials are placeholder values, skipping...');
      lastError = new Error('Twilio credentials not configured (placeholder values detected)');
    } else {
      try {
        console.log('Attempting to send via Twilio WhatsApp API...');
        const twilioResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              From: process.env.TWILIO_WHATSAPP_NUMBER,
              To: `whatsapp:${formattedNumber}`,
              Body: message
            })
          }
        );
        
        // Check if response is HTML (error page) instead of JSON
        const contentType = twilioResponse.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Twilio returned HTML error page - likely invalid credentials or account issue');
        }
        
        const twilioData = await twilioResponse.json();
        
        if (twilioResponse.ok) {
          return {
            messageId: twilioData.sid,
            to: formattedNumber,
            sentAt: new Date().toISOString(),
            provider: 'Twilio WhatsApp',
            status: twilioData.status || 'sent',
            twilioData
          };
        } else {
          throw new Error(`Twilio error: ${twilioData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Twilio WhatsApp API failed:', error);
        lastError = error instanceof Error ? error : new Error('Twilio API failed');
      }
    }
  }

  // 2. WhatsApp Cloud API (Meta) - Fallback
  if (process.env.META_ACCESS_TOKEN && process.env.META_PHONE_NUMBER_ID) {
    // Check if Meta credentials are placeholder values
    const isPlaceholderToken = process.env.META_ACCESS_TOKEN.includes('your-') || 
                              process.env.META_ACCESS_TOKEN.includes('placeholder') ||
                              process.env.META_ACCESS_TOKEN === 'your-meta-access-token-here';
    const isPlaceholderPhoneId = process.env.META_PHONE_NUMBER_ID.includes('your-') || 
                                process.env.META_PHONE_NUMBER_ID.includes('placeholder') ||
                                process.env.META_PHONE_NUMBER_ID === 'your-phone-number-id-here';
    
    if (isPlaceholderToken || isPlaceholderPhoneId) {
      console.log('⚠️ Meta credentials are placeholder values, skipping...');
      lastError = new Error('Meta credentials not configured (placeholder values detected)');
    } else {
      try {
        console.log('Attempting to send via Meta WhatsApp Cloud API...');
        const metaResponse = await fetch(
          `https://graph.facebook.com/v18.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: formattedNumber,
              type: 'text',
              text: { body: message }
            })
          }
        );
        
        const metaData = await metaResponse.json();
        
        if (metaResponse.ok) {
          return {
            messageId: metaData.messages?.[0]?.id,
            to: formattedNumber,
            sentAt: new Date().toISOString(),
            provider: 'Meta WhatsApp Cloud API',
            status: metaData.messages?.[0]?.message_status || 'sent',
            metaData
          };
        } else {
          throw new Error(`Meta API error: ${metaData.error?.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Meta WhatsApp Cloud API failed:', error);
        lastError = error instanceof Error ? error : new Error('Meta API failed');
      }
    }
  }

  // 3. Green API (Simple WhatsApp service) - Fallback
  if (process.env.GREEN_API_URL && process.env.GREEN_API_INSTANCE && process.env.GREEN_API_TOKEN) {
    // Check if Green API credentials are placeholder values
    const isPlaceholderInstance = process.env.GREEN_API_INSTANCE.includes('your-') || 
                                 process.env.GREEN_API_INSTANCE.includes('placeholder') ||
                                 process.env.GREEN_API_INSTANCE === 'your-instance-id-here';
    const isPlaceholderToken = process.env.GREEN_API_TOKEN.includes('your-') || 
                              process.env.GREEN_API_TOKEN.includes('placeholder') ||
                              process.env.GREEN_API_TOKEN === 'your-api-token-here';
    
    if (isPlaceholderInstance || isPlaceholderToken) {
      console.log('⚠️ Green API credentials are placeholder values, skipping...');
      lastError = new Error('Green API credentials not configured (placeholder values detected)');
    } else {
      try {
        console.log('Attempting to send via Green API...');
        const greenResponse = await fetch(
          `${process.env.GREEN_API_URL}/waInstance${process.env.GREEN_API_INSTANCE}/sendMessage/${process.env.GREEN_API_TOKEN}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId: `${formattedNumber}@c.us`,
              message: message
            })
          }
        );
        
        const greenData = await greenResponse.json();
        
        if (greenResponse.ok) {
          return {
            messageId: greenData.idMessage,
            to: formattedNumber,
            sentAt: new Date().toISOString(),
            provider: 'Green API',
            status: 'sent',
            greenData
          };
        } else {
          throw new Error(`Green API error: ${greenData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Green API failed:', error);
        lastError = error instanceof Error ? error : new Error('Green API failed');
      }
    }
  }

  // If all providers failed, check if we're in demo mode
  if (lastError && lastError.message.includes('placeholder values detected')) {
    // Demo mode - simulate successful sending for testing UI
    console.log('🎭 Demo mode: Simulating WhatsApp message send...');
    return {
      messageId: `demo-${Date.now()}`,
      to: formattedNumber,
      sentAt: new Date().toISOString(),
      provider: 'Demo Mode',
      status: 'sent',
      demo: true,
      note: 'This is a simulated message - configure real WhatsApp credentials to send actual messages'
    };
  }
  
  // If all providers failed, throw the last error
  throw lastError || new Error('No WhatsApp service configured. Please set up at least one provider (Twilio, Meta, or Green API)');
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders(request.headers.get('origin') || undefined),
      ...securityHeaders()
    }
  });
}