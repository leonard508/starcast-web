import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { requireAdmin } from '@/lib/auth/middleware'

const { AccessToken } = twilio.jwt
const { ChatGrant } = AccessToken

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { identity, endpointId } = await request.json()

    if (!identity) {
      return NextResponse.json(
        { error: 'Identity is required' },
        { status: 400 }
      )
    }

    // Create access token
    const accessToken = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY!,
      process.env.TWILIO_API_SECRET!,
      { identity }
    )

    // Create Chat Grant for Conversations
    const chatGrant = new ChatGrant({
      serviceSid: process.env.TWILIO_CONVERSATIONS_SERVICE_SID!,
      endpointId: endpointId || `${identity}-${Date.now()}`
    })

    accessToken.addGrant(chatGrant)

    return NextResponse.json({
      token: accessToken.toJwt(),
      identity,
      serviceSid: process.env.TWILIO_CONVERSATIONS_SERVICE_SID
    })

  } catch (error) {
    console.error('Error generating access token:', error)
    return NextResponse.json(
      { error: 'Failed to generate access token' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint with identity to get access token',
    required: ['identity'],
    optional: ['endpointId']
  })
}