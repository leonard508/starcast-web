import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)
    
    // Log incoming status webhook for debugging
    console.log('WhatsApp status webhook received:', {
      body: body,
      headers: Object.fromEntries(request.headers.entries())
    })

    // Extract Twilio status webhook data
    const messageSid = params.get('MessageSid')
    const messageStatus = params.get('MessageStatus')
    const accountSid = params.get('AccountSid')
    const to = params.get('To')
    const from = params.get('From')
    const errorCode = params.get('ErrorCode')
    const errorMessage = params.get('ErrorMessage')
    
    // Validate this is from our Twilio account
    if (accountSid !== process.env.TWILIO_ACCOUNT_SID) {
      console.error('Invalid Account SID in status webhook')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!messageSid || !messageStatus) {
      console.error('Missing required status webhook fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Processing WhatsApp message status update:', {
      messageSid,
      messageStatus,
      to,
      from,
      errorCode,
      errorMessage
    })

    // Update message status in database
    try {
      const updateData: any = {
        status: mapTwilioStatusToDbStatus(messageStatus),
        updatedAt: new Date()
      }

      // Set timestamps based on status
      switch (messageStatus) {
        case 'sent':
          updateData.sentAt = new Date()
          break
        case 'delivered':
          updateData.deliveredAt = new Date()
          break
        case 'read':
          updateData.readAt = new Date()
          break
        case 'failed':
        case 'undelivered':
          // Log error information (schema doesn't have error fields yet)
          if (errorCode || errorMessage) {
            console.error(`Message ${messageSid} failed:`, {
              errorCode,
              errorMessage,
              to,
              from
            })
          }
          break
      }

      const updatedMessage = await db.whatsAppMessage.updateMany({
        where: {
          messageId: messageSid
        },
        data: updateData
      })

      if (updatedMessage.count > 0) {
        console.log(`Updated ${updatedMessage.count} message(s) with status: ${messageStatus}`)
      } else {
        console.warn(`No message found with SID: ${messageSid}`)
        
        // If message not found, log for debugging but don't fail
        console.log('Status update for unknown message - this might be normal for older messages')
      }

      // Log successful status updates for monitoring
      if (messageStatus === 'delivered' || messageStatus === 'read') {
        console.log(`✅ Message ${messageSid} ${messageStatus} successfully`)
      } else if (messageStatus === 'failed' || messageStatus === 'undelivered') {
        console.error(`❌ Message ${messageSid} failed: ${errorMessage || errorCode || 'Unknown error'}`)
      }

    } catch (dbError) {
      console.error('Database error updating message status:', dbError)
      // Don't fail the webhook - Twilio expects 200 response
    }

    // Return success response to Twilio
    return NextResponse.json({ 
      success: true, 
      messageSid,
      status: messageStatus,
      processed: true
    }, { status: 200 })

  } catch (error) {
    console.error('Status webhook processing error:', error)
    
    // Still return 200 to prevent Twilio retries for processing errors
    return NextResponse.json(
      { 
        success: false, 
        error: 'Processing error',
        processed: false 
      },
      { status: 200 }
    )
  }
}

// Map Twilio message statuses to our database enum values
function mapTwilioStatusToDbStatus(twilioStatus: string): string {
  switch (twilioStatus.toLowerCase()) {
    case 'queued':
    case 'sent':
      return 'SENT'
    case 'delivered':
      return 'DELIVERED'
    case 'read':
      return 'READ'
    case 'failed':
    case 'undelivered':
      return 'FAILED'
    case 'receiving':
    case 'received':
      return 'RECEIVED'
    default:
      console.warn(`Unknown Twilio status: ${twilioStatus}, defaulting to PENDING`)
      return 'PENDING'
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'WhatsApp status webhook endpoint is active',
    timestamp: new Date().toISOString(),
    endpoint: '/api/webhooks/whatsapp-status',
    purpose: 'Handles Twilio WhatsApp message delivery status updates'
  })
}