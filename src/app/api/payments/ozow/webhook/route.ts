import { NextRequest, NextResponse } from 'next/server'
import { OzowPaymentService } from '@/lib/payments/ozow'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-ozow-signature') || ''
    
    // Initialize Ozow service
    const ozowService = new OzowPaymentService()

    // Verify webhook signature for security
    if (!ozowService.verifyWebhook(body, signature)) {
      console.error('Ozow webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse webhook data
    const webhookData = JSON.parse(body)
    console.log('Ozow webhook received:', webhookData)

    // Process the webhook
    const processedData = await ozowService.processWebhook(webhookData)

    // Update payment record in database
    const payment = await db.payment.findUnique({
      where: { id: processedData.reference },
    })

    if (!payment) {
      console.error('Payment not found:', processedData.reference)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Update payment status
    const updatedPayment = await db.payment.update({
      where: { id: processedData.reference },
      data: {
        status: processedData.status,
        providerTransactionId: processedData.transactionId,
        completedAt: processedData.status === 'COMPLETED' ? new Date() : null,
        updatedAt: new Date(),
        metadata: {
          ...(payment.metadata as object || {}),
          webhookData: webhookData,
          processedAt: new Date().toISOString(),
        },
      },
    })

    // Handle different payment statuses
    switch (processedData.status) {
      case 'COMPLETED':
        await handleSuccessfulPayment(updatedPayment)
        break
      case 'CANCELLED':
        await handleCancelledPayment(updatedPayment)
        break
      case 'FAILED':
        await handleFailedPayment(updatedPayment)
        break
    }

    return NextResponse.json({ 
      success: true, 
      status: processedData.status,
      transactionId: processedData.transactionId 
    })

  } catch (error) {
    console.error('Ozow webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(payment: any) {
  console.log('Payment completed successfully:', payment.id)
  
  // If this is for an application, log the successful payment
  if (payment.applicationId) {
    console.log('Payment completed for application:', payment.applicationId)
    // Payment status is tracked in the Payment model
    // Application status updates can be handled separately if needed
  }

  // TODO: Send payment confirmation email
  // TODO: Trigger any post-payment workflows
}

async function handleCancelledPayment(payment: any) {
  console.log('Payment cancelled:', payment.id)
  
  // TODO: Handle cancelled payment logic
  // TODO: Send cancellation notification if needed
}

async function handleFailedPayment(payment: any) {
  console.log('Payment failed:', payment.id)
  
  // TODO: Handle failed payment logic
  // TODO: Send failure notification if needed
}