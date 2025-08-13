'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import GoogleAddressAutocomplete from '@/components/GoogleAddressAutocomplete'

interface Package {
  id: string
  name: string
  type: string
  speed?: string
  data?: string
  aup?: string
  throttle?: string
  basePrice: number
  currentPrice: number
  provider: {
    name: string
    slug: string
    logo?: string
  }
  promotions?: Array<{
    id: string
    code: string
    name: string
    discountType: string
    discountValue: number
  }>
}

interface RouterOption {
  option: string
  price: number
  description: string
}

function LTESignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get('package')
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [selectedRouter, setSelectedRouter] = useState<RouterOption | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    address: '',
    postalCode: '',
    promoCode: ''
  })
  const [promoValidation, setPromoValidation] = useState<{
    valid: boolean
    message: string
    discountAmount?: number
    finalPrice?: number
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Router options for LTE packages
  const routerOptions = [
    { option: 'bring-own', price: 0, description: 'Use your own compatible router' },
    { option: 'rental', price: 150, description: 'Rent a router (R150/month)' },
    { option: 'purchase', price: 2500, description: 'Purchase router (R2,500 once-off)' }
  ]

  useEffect(() => {
    if (packageId) {
      fetchPackage()
    } else {
      setLoading(false)
    }
  }, [packageId])

  const fetchPackage = async () => {
    try {
      const response = await fetch('/api/packages')
      if (!response.ok) throw new Error('Failed to fetch package')
      
      const data = await response.json()
      const pkg = data.data.find((p: Package) => p.id === packageId)
      
      if (pkg) {
        setSelectedPackage(pkg)
      }
    } catch (_error) {
      console.error('Error fetching package:', _error)
    } finally {
      setLoading(false)
    }
  }

  const validatePromoCode = async (code: string) => {
    if (!code || !selectedPackage) return

    try {
      const response = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          packageId: selectedPackage.id,
          packageType: 'LTE'
        })
      })

      const data = await response.json()
      setPromoValidation(data)
    } catch {
      setPromoValidation({
        valid: false,
        message: 'Failed to validate promo code'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPackage || !termsAccepted) return

    setSubmitting(true)
    
    try {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value)
      })
      
      // Add package and router data
      submitData.append('selectedPackage', JSON.stringify(selectedPackage))
      if (selectedRouter) {
        submitData.append('selectedRouter', JSON.stringify(selectedRouter))
      }
      
      // Add ID document
      if (idDocument) {
        submitData.append('idDocument', idDocument)
      }
      
      // Add promo data if valid
      if (promoValidation?.valid) {
        submitData.append('promoCode', formData.promoCode)
        submitData.append('promoDiscount', promoValidation.discountAmount?.toString() || '0')
      }

      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success message
      alert(`LTE Application submitted successfully! 

Reference: #LTE-${Date.now()}

Your application has been received and will be reviewed within 24 hours. We'll check coverage availability in your area and send you account access details once approved.

Device delivery typically takes 5-7 days after approval.

Questions? Contact us at starcast.tech@gmail.com`)
      
      router.push('/')
    } catch {
      alert('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Validate promo code when it changes
    if (name === 'promoCode') {
      if (value.length > 2) {
        validatePromoCode(value)
      } else {
        setPromoValidation(null)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload a JPG, PNG, or PDF file.')
        return
      }
      
      if (file.size > maxSize) {
        alert('File too large. Maximum size is 5MB.')
        return
      }
      
      setIdDocument(file)
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setPreviewUrl('')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📱</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No LTE Package Selected</h1>
          <p className="text-gray-600 mb-6">Please select an LTE package first.</p>
          <button
            onClick={() => router.push('/lte')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Browse LTE Packages
          </button>
        </div>
      </div>
    )
  }

  const calculateFinalPrice = () => {
    let packagePrice = selectedPackage.currentPrice
    
    if (promoValidation?.valid && promoValidation.finalPrice) {
      packagePrice = promoValidation.finalPrice
    }
    
    return packagePrice
  }

  const formatSpeed = (speed?: string) => {
    if (!speed) return ''
    const speedNumber = speed.replace(/[^0-9]/g, '')
    return speedNumber ? `${speedNumber}Mbps` : speed
  }

  const formatDataAllowance = (data?: string, aup?: string) => {
    if (!data) return ''
    
    const dataLower = data.toLowerCase()
    if (dataLower.includes('unlimited') || dataLower.includes('uncapped')) {
      if (aup && aup !== '' && aup !== '0') {
        const aupNumber = aup.replace(/[^0-9]/g, '')
        return aupNumber ? `${aupNumber}GB FUP` : 'Uncapped'
      }
      return 'Uncapped'
    }
    
    if (dataLower.includes('gb') || dataLower.includes('fup')) {
      return data
    }
    
    const dataNumber = data.replace(/[^0-9]/g, '')
    return dataNumber ? `${dataNumber}GB` : data
  }

  const packageTitle = `${selectedPackage.provider.name} Fixed LTE ${formatSpeed(selectedPackage.speed)}`
  const finalPrice = calculateFinalPrice()
  const originalPrice = selectedPackage.currentPrice
  const hasPromoDiscount = promoValidation?.valid && finalPrice < originalPrice

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">Complete Your LTE Application</h1>
            <p className="text-xl opacity-90">Get connected with high-speed LTE internet</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Package Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="text-2xl mr-2">📱</span>
                    Selected Package
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Package Details */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center mb-3">
                            {selectedPackage.provider.logo && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={selectedPackage.provider.logo} 
                                alt={selectedPackage.provider.name}
                                className="h-8 w-8 mr-3"
                              />
                            )}
                        <div>
                          <div className="font-semibold text-lg text-gray-900">{packageTitle}</div>
                          <div className="text-sm text-gray-600">{selectedPackage.type === 'LTE_FIXED' ? 'Fixed LTE' : 'Mobile LTE'}</div>
                        </div>
                      </div>

                      {selectedPackage.speed && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Speed:</span>
                          <span className="font-medium text-purple-600">{formatSpeed(selectedPackage.speed)}</span>
                        </div>
                      )}

                      {selectedPackage.data && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Data:</span>
                          <span className="font-medium">{formatDataAllowance(selectedPackage.data, selectedPackage.aup)}</span>
                        </div>
                      )}

                      {selectedPackage.aup && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">AUP:</span>
                          <span className="font-medium text-sm">{selectedPackage.aup}</span>
                        </div>
                      )}
                    </div>

                    {/* Router Selection */}
                    {selectedRouter && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Router Option</h4>
                        <div className="text-sm text-gray-600 mb-1">{selectedRouter.description}</div>
                        <div className="text-lg font-bold text-purple-600">
                          {selectedRouter.price > 0 ? `R${selectedRouter.price}${selectedRouter.option === 'rental' ? '/mo' : ' once-off'}` : 'Free'}
                        </div>
                      </div>
                    )}

                    <hr className="my-4" />

                    {/* Pricing */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      {hasPromoDiscount && (
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-gray-600">
                            <span>Original Price:</span>
                            <span className="line-through">R{originalPrice}/mo</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Promo Discount:</span>
                            <span>-R{(originalPrice - finalPrice).toFixed(0)}/mo</span>
                          </div>
                          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                            ✅ Promo code &quot;{formData.promoCode}&quot; applied!
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between text-2xl font-bold">
                        <span>Monthly Total:</span>
                        <span className={hasPromoDiscount ? 'text-green-600' : 'text-gray-900'}>
                          R{finalPrice.toFixed(0)}/mo
                        </span>
                      </div>

                      {selectedRouter && selectedRouter.price > 0 && selectedRouter.option !== 'rental' && (
                        <div className="flex justify-between text-lg font-semibold text-purple-600 mt-2 pt-2 border-t">
                          <span>Setup Fee:</span>
                          <span>R{selectedRouter.price} once-off</span>
                        </div>
                      )}
                    </div>

                    {!selectedRouter && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                          ⚠️ Please select a router option below to complete your application.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Application Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-xl mr-2">👤</span>
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Number *
                        </label>
                        <input
                          type="text"
                          name="idNumber"
                          required
                          pattern="[0-9]{13}"
                          maxLength={13}
                          placeholder="13-digit SA ID number"
                          value={formData.idNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Router Selection */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-xl mr-2">📡</span>
                      Router Option *
                    </h3>
                    
                    <div className="space-y-4">
                      {routerOptions.map((option) => (
                        <label
                          key={option.option}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedRouter?.option === option.option
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="router"
                            value={option.option}
                            checked={selectedRouter?.option === option.option}
                            onChange={() => setSelectedRouter(option)}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold text-gray-900">{option.description}</div>
                              </div>
                              <div className="text-lg font-bold text-purple-600">
                                {option.price > 0 ? `R${option.price}${option.option === 'rental' ? '/mo' : ' once-off'}` : 'Free'}
                              </div>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ml-4 flex items-center justify-center ${
                            selectedRouter?.option === option.option
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedRouter?.option === option.option && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-xl mr-2">📍</span>
                      Delivery Address
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Address *
                        </label>
                        <GoogleAddressAutocomplete
                          value={formData.address}
                          onChange={(value, place) => {
                            setFormData(prev => ({ ...prev, address: value }))
                          }}
                          onPostalCodeExtract={(postalCode) => {
                            setFormData(prev => ({ ...prev, postalCode }))
                          }}
                          name="address"
                          required
                          placeholder="Start typing your delivery address..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Format: House number, Street name, Suburb, City
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          required
                          pattern="[0-9]{4}"
                          maxLength={4}
                          placeholder="4-digit code"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ID Document Upload */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-xl mr-2">📄</span>
                      ID Document *
                    </h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        id="idDocument"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                        required
                      />
                      <label htmlFor="idDocument" className="cursor-pointer">
                        {idDocument ? (
                          <div>
                            <div className="text-green-600 text-4xl mb-2">✓</div>
                            <p className="text-lg font-semibold text-gray-900">{idDocument.name}</p>
                            <p className="text-sm text-gray-500 mt-1">Click to change file</p>
                            {previewUrl && (
                              <img src={previewUrl} alt="ID Preview" className="max-w-48 max-h-32 mx-auto mt-4 rounded-lg shadow-md" />
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="text-gray-400 text-4xl mb-2">📁</div>
                            <p className="text-lg font-semibold text-gray-900">Upload ID Document</p>
                            <p className="text-sm text-gray-500 mt-1">Click to select or drag and drop</p>
                            <p className="text-xs text-gray-400 mt-2">JPG, PNG, or PDF • Max 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-xl mr-2">🎫</span>
                      Promo Code (Optional)
                    </h3>
                    
                    <div>
                      <input
                        type="text"
                        name="promoCode"
                        placeholder="Enter promo code"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {promoValidation && (
                        <div className={`mt-2 p-3 rounded-lg ${
                          promoValidation.valid 
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                          <p className="text-sm">
                            {promoValidation.valid ? '✅' : '❌'} {promoValidation.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        required
                      />
                      <div className="text-sm text-gray-700">
                        <p>
                          I agree to the{' '}
                          <a href="/terms-of-service" target="_blank" className="text-purple-600 underline hover:text-purple-800">
                            Terms of Service
                          </a>{' '}
                          and understand that an account will be created upon approval. *
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Your application will be reviewed for availability before activation. 
                          No charges apply until service is activated.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      ← Back to Packages
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !selectedRouter || !termsAccepted}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        '🚀 Submit LTE Application'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LTESignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    }>
      <LTESignupContent />
    </Suspense>
  )
}