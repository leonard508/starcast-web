import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)
    
    // Log incoming webhook for debugging
    console.log('WhatsApp webhook received:', {
      body: body,
      headers: Object.fromEntries(request.headers.entries())
    })

    // Extract Twilio webhook data
    const from = params.get('From')
    const to = params.get('To')
    const body_text = params.get('Body')
    const messageSid = params.get('MessageSid')
    const accountSid = params.get('AccountSid')
    const profileName = params.get('ProfileName')
    const waId = params.get('WaId')
    
    // Validate this is from our Twilio account
    if (accountSid !== process.env.TWILIO_ACCOUNT_SID) {
      console.error('Invalid Account SID in webhook')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!from || !to || !body_text || !messageSid) {
      console.error('Missing required webhook fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Clean phone numbers
    const fromNumber = from.replace('whatsapp:', '')
    const toNumber = to.replace('whatsapp:', '')
    
    console.log('Processing incoming WhatsApp message:', {
      from: fromNumber,
      to: toNumber,
      message: body_text,
      profileName,
      waId
    })

    // Store incoming message in database using Prisma
    try {
      // Check if user exists by phone number
      let userId = null
      try {
        const existingUser = await db.user.findFirst({
          where: {
            phone: fromNumber
          }
        })
        userId = existingUser?.id || null
      } catch (userError) {
        console.log('User lookup failed, continuing without user link:', userError)
      }

      const whatsappMessage = await db.whatsAppMessage.create({
        data: {
          messageId: messageSid,
          direction: 'INCOMING',
          fromNumber: fromNumber,
          toNumber: toNumber,
          messageBody: body_text,
          profileName: profileName || null,
          whatsappId: waId || null,
          status: 'RECEIVED',
          receivedAt: new Date(),
          userId: userId,
          isAutoResponse: false,
          escalated: false
        }
      })

      console.log('Message stored in database with ID:', whatsappMessage.id)
    } catch (dbError) {
      console.error('Database error storing message:', dbError)
      // Continue processing even if DB fails
    }

    // Send auto-response for customer queries
    const autoResponse = generateAutoResponse(body_text)
    if (autoResponse) {
      try {
        // Send auto-response via Twilio
        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              From: to, // Our WhatsApp number
              To: from, // Customer's number
              Body: autoResponse
            })
          }
        )

        if (response.ok) {
          const responseData = await response.json()
          console.log('Auto-response sent successfully:', responseData.sid)
          
          // Store auto-response in database
          try {
            // Use userId from the scope above
            let autoResponseUserId = null
            try {
              const existingUser = await db.user.findFirst({
                where: {
                  phone: fromNumber
                }
              })
              autoResponseUserId = existingUser?.id || null
            } catch (userError) {
              console.log('User lookup failed for auto-response, continuing without user link:', userError)
            }

            await db.whatsAppMessage.create({
              data: {
                messageId: responseData.sid,
                direction: 'OUTGOING',
                fromNumber: toNumber,
                toNumber: fromNumber,
                messageBody: autoResponse,
                status: 'SENT',
                sentAt: new Date(),
                userId: autoResponseUserId,
                isAutoResponse: true,
                escalated: false
              }
            })
          } catch (autoResponseDbError) {
            console.error('Failed to store auto-response in DB:', autoResponseDbError)
          }
        } else {
          console.error('Failed to send auto-response:', await response.text())
        }
      } catch (error) {
        console.error('Error sending auto-response:', error)
      }
    }

    // Return TwiML response
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>Thank you for contacting Starcast! We've received your message and will respond shortly.</Message>
      </Response>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Auto-response logic for common queries
function generateAutoResponse(message: string): string | null {
  const lowerMessage = message.toLowerCase()
  
  // WiFi issues
  if (lowerMessage.includes('wifi') || lowerMessage.includes('internet') || lowerMessage.includes('slow')) {
    return `🌐 *WiFi Troubleshooting*

Hi! I can help with your internet connection:

1️⃣ *Check your router*: Unplug for 30 seconds, then plug back in
2️⃣ *Move closer* to your WiFi router
3️⃣ *Restart your device* and reconnect to WiFi
4️⃣ *Check cables* - ensure all connections are secure

If the issue persists, our technical team will assist you shortly!

*Starcast Support* 📞 087 250 2788`
  }

  // Billing queries
  if (lowerMessage.includes('bill') || lowerMessage.includes('payment') || lowerMessage.includes('account')) {
    return `💰 *Billing Support*

For billing inquiries:

• *View account*: Log into your online portal
• *Payment options*: EFT, Card, or Cash deposit
• *Payment queries*: Send proof of payment

Our admin team will review your account and respond shortly.

*Starcast Billing* 📞 087 250 2788`
  }

  // Technical support
  if (lowerMessage.includes('setup') || lowerMessage.includes('install') || lowerMessage.includes('config')) {
    return `🔧 *Technical Setup*

Need help with installation?

• *WiFi setup*: We'll guide you through configuration
• *TV installation*: Professional technician available
• *Device support*: Router, modem, and equipment help

A technician will contact you within 2 hours!

*Starcast Tech* 📞 087 250 2788`
  }

  // General greeting/help
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return `👋 *Welcome to Starcast!*

How can we assist you today?

🌐 *Internet Issues* - type "wifi help"
💰 *Billing Queries* - type "billing"  
🔧 *Technical Setup* - type "setup help"
📞 *Speak to Agent* - type "agent"

We're here to help 24/7!

*Starcast Support* 📞 087 250 2788`
  }

  // Agent request
  if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('speak')) {
    return `👨‍💼 *Agent Request*

Connecting you to our support team...

Your message has been forwarded to our agents who will respond within 15 minutes during business hours.

*Business Hours:*
📅 Mon-Fri: 8AM - 6PM
📅 Sat: 9AM - 2PM
📅 Sun: Emergency only

*Starcast Support* 📞 087 250 2788`
  }

  return null // No auto-response for other messages
}

export async function GET(_request: NextRequest) {
  return NextResponse.json({ 
    message: 'WhatsApp webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}