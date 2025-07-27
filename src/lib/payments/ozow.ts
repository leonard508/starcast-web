import crypto from 'crypto'

/**
 * Ozow Payment Gateway Integration Service
 * Secure implementation using environment variables only
 */

export interface OzowPaymentRequest {
  amount: number
  reference: string
  customerEmail: string
  customerName: string
  successUrl: string
  cancelUrl: string
  notifyUrl: string
  bankReference?: string
  isTest?: boolean
}

export interface OzowTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface OzowPaymentResponse {
  url: string
  transactionId: string
  status: string
}

export class OzowPaymentService {
  private readonly apiKey: string
  private readonly siteCode: string
  private readonly privateKey: string
  private readonly baseUrl: string
  
  constructor() {
    this.apiKey = process.env.OZOW_API_KEY!
    this.siteCode = process.env.OZOW_SITE_CODE!
    this.privateKey = process.env.OZOW_PRIVATE_KEY!
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.ozow.com' 
      : 'https://stagingapi.ozow.com'
    
    this.validateCredentials()
  }

  private validateCredentials(): void {
    if (!this.apiKey || !this.siteCode || !this.privateKey) {
      throw new Error('Ozow credentials not configured. Check environment variables.')
    }
  }

  /**
   * Get authentication token from Ozow API
   */
  async getToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/token`, {
        method: 'POST',
        headers: {
          'ApiKey': this.apiKey,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          SiteCode: this.siteCode,
        }),
      })

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`)
      }

      const data: OzowTokenResponse = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Ozow token request failed:', error)
      throw new Error('Failed to authenticate with Ozow')
    }
  }

  /**
   * Generate SHA512 hash for request authentication
   */
  private generateHash(params: Record<string, string | number>): string {
    // Convert all values to strings and sort by key
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = String(params[key])
        return result
      }, {} as Record<string, string>)

    // Concatenate values (excluding HashCheck)
    const concatenated = Object.entries(sortedParams)
      .filter(([key]) => key !== 'HashCheck')
      .map(([, value]) => value)
      .join('')

    // Append private key and convert to lowercase
    const stringToHash = (concatenated + this.privateKey).toLowerCase()

    // Generate SHA512 hash
    return crypto.createHash('sha512').update(stringToHash).digest('hex')
  }

  /**
   * Create payment request with Ozow
   */
  async createPayment(request: OzowPaymentRequest): Promise<OzowPaymentResponse> {
    try {
      const token = await this.getToken()
      
      // Prepare payment parameters
      const params = {
        SiteCode: this.siteCode,
        CountryCode: 'ZA',
        CurrencyCode: 'ZAR',
        Amount: (request.amount * 100).toString(), // Convert to cents
        TransactionReference: request.reference,
        BankReference: request.bankReference || request.reference,
        Customer: request.customerEmail,
        CustomerFirstName: request.customerName.split(' ')[0] || '',
        CustomerLastName: request.customerName.split(' ').slice(1).join(' ') || '',
        CustomerEmail: request.customerEmail,
        SuccessUrl: request.successUrl,
        CancelUrl: request.cancelUrl,
        ErrorUrl: request.cancelUrl,
        NotifyUrl: request.notifyUrl,
        IsTest: request.isTest ? 'true' : 'false',
      }

      // Generate hash for authentication
      const hashCheck = this.generateHash(params)
      const requestData = { ...params, HashCheck: hashCheck }

      const response = await fetch(`${this.baseUrl}/PostPaymentRequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ApiKey': this.apiKey,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Ozow payment request failed:', errorText)
        throw new Error(`Payment request failed: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        url: result.url || result.redirectUrl,
        transactionId: result.transactionId || request.reference,
        status: 'pending'
      }
    } catch (error) {
      console.error('Ozow payment creation failed:', error)
      throw new Error('Failed to create payment with Ozow')
    }
  }

  /**
   * Verify webhook signature for security
   */
  verifyWebhook(payload: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha512', this.privateKey)
        .update(payload)
        .digest('hex')
      
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )
    } catch (error) {
      console.error('Webhook verification failed:', error)
      return false
    }
  }

  /**
   * Process webhook notification from Ozow
   */
  async processWebhook(data: any): Promise<{
    transactionId: string
    status: 'complete' | 'cancelled' | 'error'
    amount: number
    reference: string
  }> {
    return {
      transactionId: data.TransactionId,
      status: this.mapOzowStatus(data.Status),
      amount: parseInt(data.Amount) / 100, // Convert from cents
      reference: data.TransactionReference,
    }
  }

  private mapOzowStatus(ozowStatus: string): 'complete' | 'cancelled' | 'error' {
    switch (ozowStatus?.toLowerCase()) {
      case 'complete':
      case 'successful':
        return 'complete'
      case 'cancelled':
      case 'canceled':
        return 'cancelled'
      default:
        return 'error'
    }
  }
}