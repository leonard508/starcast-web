import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { OzowPaymentService } from '@/lib/payments/ozow'
import { db } from '@/lib/db'
import { z } from 'zod'

const CreatePaymentSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  reference: z.string().min(1, 'Reference is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  description: z.string().optional(),
  applicationId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult // Return error response
    }
    const { user } = authResult

    const body = await request.json()
    const validatedData = CreatePaymentSchema.parse(body)

    // Get base URL for callback URLs
    const baseUrl = process.env.RAILWAY_STATIC_URL 
      ? `https://${process.env.RAILWAY_STATIC_URL}`
      : 'http://localhost:3000'

    // Initialize Ozow service
    const ozowService = new OzowPaymentService()

    // Create payment request
    const paymentRequest = {
      amount: validatedData.amount,
      reference: validatedData.reference,
      customerEmail: validatedData.customerEmail,
      customerName: validatedData.customerName,
      successUrl: `${baseUrl}/payments/success?ref=${validatedData.reference}`,
      cancelUrl: `${baseUrl}/payments/cancelled?ref=${validatedData.reference}`,
      notifyUrl: `${baseUrl}/api/payments/ozow/webhook`,
      bankReference: validatedData.reference,
      isTest: process.env.NODE_ENV !== 'production',
    }

    // Create payment with Ozow
    const paymentResponse = await ozowService.createPayment(paymentRequest)

    // Store payment record in database
    const payment = await db.payment.create({
      data: {
        id: validatedData.reference,
        userId: user.id,
        amount: validatedData.amount,
        currency: 'ZAR',
        reference: validatedData.reference,
        status: 'PENDING',
        provider: 'ozow',
        providerTransactionId: paymentResponse.transactionId,
        description: validatedData.description,
        applicationId: validatedData.applicationId,
        metadata: {
          ozowUrl: paymentResponse.url,
          customerEmail: validatedData.customerEmail,
          customerName: validatedData.customerName,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      redirectUrl: paymentResponse.url,
      transactionId: paymentResponse.transactionId,
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}