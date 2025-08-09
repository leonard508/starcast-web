import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from 'twilio'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-twilio-signature') || ''
    
    // Validate Twilio webhook signature for security
    const isValid = validateRequest(
      process.env.TWILIO_AUTH_TOKEN!,
      signature,
      `${request.nextUrl.origin}/api/webhooks/twilio-whatsapp`,
      body as any
    )

    if (!isValid) {
      console.error('Invalid Twilio signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Parse the webhook payload
    const params = new URLSearchParams(body)
    const messageData = {
      messageSid: params.get('MessageSid'),
      accountSid: params.get('AccountSid'),
      from: params.get('From'), // whatsapp:+27821234567
      to: params.get('To'),     // whatsapp:+27872502788
      body: params.get('Body'),
      numMedia: parseInt(params.get('NumMedia') || '0'),
      profileName: params.get('ProfileName'),
      waId: params.get('WaId'), // WhatsApp ID
    }

    console.log('Received WhatsApp message:', messageData)

    // Clean phone number (remove whatsapp: prefix)
    const fromPhone = messageData.from?.replace('whatsapp:', '') || ''
    const customerMessage = messageData.body || ''

    // Store incoming message in database
    try {
      await prisma.whatsAppMessage.create({
        data: {
          messageId: messageData.messageSid || '',
          direction: 'INCOMING',
          fromNumber: fromPhone,
          toNumber: messageData.to?.replace('whatsapp:', '') || '',
          messageBody: customerMessage,
          profileName: messageData.profileName,
          whatsappId: messageData.waId,
          status: 'RECEIVED',
          receivedAt: new Date(),
        }
      })
    } catch (dbError) {
      console.error('Error saving message to database:', dbError)
      // Continue processing even if DB save fails
    }

    // Auto-response logic
    const response = await generateAutoResponse(customerMessage, fromPhone)
    
    if (response) {
      await sendWhatsAppMessage(fromPhone, response)
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function generateAutoResponse(message: string, fromPhone: string): Promise<string | null> {
  const lowerMessage = message.toLowerCase()

  // Help/Menu command
  if (lowerMessage.includes('help') || lowerMessage.includes('menu') || lowerMessage === 'hi' || lowerMessage === 'hello') {
    return `Hi! 👋 Welcome to Starcast ISP!

How can we help you today?

📶 *Fibre Packages* - Type "fibre"
📱 *LTE/5G Packages* - Type "lte" 
💰 *Billing* - Type "billing"
🔧 *Technical Support* - Type "support"
📞 *Speak to Agent* - Type "agent"

Visit: http://starcast.co.za
Call: 087 250 2788`
  }

  // Package inquiries
  if (lowerMessage.includes('fibre') || lowerMessage.includes('fiber')) {
    return `🌐 *Fibre Internet Packages*

Our top fibre deals:
• 10Mbps - From R299/month
• 25Mbps - From R399/month  
• 50Mbps - From R599/month
• 100Mbps - From R899/month

✅ Uncapped data
✅ No throttling
✅ 24/7 support

View all packages: http://starcast.co.za/fibre
Apply now or call: 087 250 2788`
  }

  if (lowerMessage.includes('lte') || lowerMessage.includes('5g') || lowerMessage.includes('mobile')) {
    return `📱 *LTE & 5G Packages*

Popular mobile data deals:
• 20GB LTE - From R299/month
• 50GB LTE - From R499/month
• 100GB 5G - From R799/month
• Uncapped 5G - From R999/month

✅ No contracts
✅ Instant activation
✅ Nationwide coverage

View packages: http://starcast.co.za/lte
Order online or call: 087 250 2788`
  }

  // Billing inquiries
  if (lowerMessage.includes('bill') || lowerMessage.includes('payment') || lowerMessage.includes('account')) {
    return `💰 *Billing & Account Help*

For account queries:
• View your bill online
• Make payments via Ozow
• Update payment methods
• Request payment extensions

Login: http://starcast.co.za/dashboard
Support: 087 250 2788

Need immediate help? Type "agent" to speak with our team.`
  }

  // Technical support
  if (lowerMessage.includes('support') || lowerMessage.includes('slow') || lowerMessage.includes('problem') || lowerMessage.includes('not working')) {
    return `🔧 *Technical Support*

Common solutions:
• Restart your router (unplug 30 sec)
• Check cable connections
• Test speed: fast.com
• Clear browser cache

Still having issues?
📞 Call: 087 250 2788
📧 Email: support@starcast.co.za

Type "agent" for immediate assistance.`
  }

  // Agent escalation
  if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('speak')) {
    // Store escalation request
    try {
      await prisma.whatsAppMessage.create({
        data: {
          messageId: `escalation-${Date.now()}`,
          direction: 'ESCALATION',
          fromNumber: fromPhone,
          toNumber: '+27872502788',
          messageBody: `Customer ${fromPhone} requested agent assistance. Original message: "${message}"`,
          status: 'ESCALATED',
          receivedAt: new Date(),
        }
      })
    } catch (error) {
      console.error('Error saving escalation:', error)
    }

    return `👥 *Connecting you to our team...*

Your request has been forwarded to our customer service team. An agent will respond within 30 minutes during business hours.

🕐 Business Hours: 
Monday-Friday: 8AM-6PM
Saturday: 9AM-1PM

For urgent technical issues, call: 087 250 2788`
  }

  // No auto-response match
  return null
}

async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  try {
    const response = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        message: message
      })
    })

    if (!response.ok) {
      console.error('Failed to send auto-response:', await response.text())
    }
  } catch (error) {
    console.error('Error sending auto-response:', error)
  }
}

// Handle Twilio webhook verification
export async function GET(_request: NextRequest) {
  return NextResponse.json({ 
    message: 'Twilio WhatsApp webhook endpoint',
    status: 'ready' 
  })
}