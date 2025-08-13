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
  currentPrice: number
  provider: {
    name: string
    slug: string
  }
}

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get('package')
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
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
    } catch (error) {
      console.error('Error fetching package:', error)
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
          packageId: selectedPackage.id 
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
    if (!selectedPackage) return

    setSubmitting(true)
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          promoCode: formData.promoCode || null
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Show success message
        alert(`Application submitted successfully! We'll contact you within 24 hours to confirm your ${selectedPackage.name} package. Application ID: ${data.data.applicationNumber}`)
        router.push('/')
      } else {
        alert(data.error || 'Failed to submit application. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Package Selected</h1>
          <p className="text-gray-600 mb-6">Please select a package first.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Packages
          </button>
        </div>
      </div>
    )
  }

  const finalPrice = promoValidation?.valid && promoValidation.finalPrice 
    ? promoValidation.finalPrice 
    : selectedPackage.currentPrice

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Package Application</h1>
            <p className="opacity-90">Complete your application for internet service</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Package Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Package</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {selectedPackage.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedPackage.provider.name}
                      </div>
                    </div>

                    {selectedPackage.speed && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Speed:</span>
                        <span className="font-medium">{selectedPackage.speed}</span>
                      </div>
                    )}

                    {selectedPackage.data && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-medium">{selectedPackage.data}</span>
                      </div>
                    )}

                    <hr className="my-4" />

                    {promoValidation?.valid && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>Original Price:</span>
                          <span className="line-through">R{selectedPackage.currentPrice}/mo</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-R{promoValidation.discountAmount}/mo</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between text-xl font-bold">
                      <span>Monthly Total:</span>
                      <span className={promoValidation?.valid ? 'text-green-600' : 'text-gray-900'}>
                        R{finalPrice}/mo
                      </span>
                    </div>

                    {promoValidation?.valid && (
                      <div className="text-sm text-green-600 font-medium">
                        ✅ Promo code applied successfully!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Application Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Installation Address *
                    </label>
                    <GoogleAddressAutocomplete
                      value={formData.address}
                      onChange={(value, place) => {
                        setFormData(prev => ({ ...prev, address: value }))
                        
                        // Auto-fill city and postal code from Google Places result
                        if (place?.address_components) {
                          const cityComponent = place.address_components.find(
                            comp => comp.types.includes('locality') || comp.types.includes('sublocality')
                          )
                          const provinceComponent = place.address_components.find(
                            comp => comp.types.includes('administrative_area_level_1')
                          )
                          const postalCodeComponent = place.address_components.find(
                            comp => comp.types.includes('postal_code')
                          )
                          
                          setFormData(prev => ({
                            ...prev,
                            city: cityComponent?.long_name || prev.city,
                            province: provinceComponent?.long_name || prev.province,
                            postalCode: postalCodeComponent?.long_name || prev.postalCode
                          }))
                        }
                      }}
                      name="address"
                      required
                      placeholder="Start typing your installation address..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province *
                      </label>
                      <select
                        name="province"
                        required
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Province</option>
                        <option value="Western Cape">Western Cape</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Northern Cape">Northern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="North West">North West</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="Limpopo">Limpopo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleInputChange}
                      placeholder="Enter promo code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {promoValidation && !promoValidation.valid && (
                      <p className="mt-1 text-sm text-red-600">
                        {promoValidation.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}