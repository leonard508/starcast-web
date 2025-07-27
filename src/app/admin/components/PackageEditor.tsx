'use client'

import React, { useState } from 'react'

interface Package {
  id: string
  name: string
  type: string
  speed?: string
  data?: string
  basePrice: number
  currentPrice: number
  active: boolean
  featured: boolean
  technology?: string
  coverage?: string
  installation?: string
  fupLimit?: string
  throttleSpeed?: string
  fupDescription?: string
  specialTerms?: string
  provider: {
    id: string
    name: string
    slug: string
  }
  promotions?: Array<{
    id: string
    code: string
    name: string
    discountType: string
    discountValue: number
    active: boolean
  }>
}

interface Provider {
  id: string
  name: string
  slug: string
  active: boolean
}

interface PackageEditorProps {
  package?: Package
  providers: Provider[]
  onSave: (packageData: Partial<Package>) => void
  onCancel: () => void
  mode: 'create' | 'edit'
}

export default function PackageEditor({ 
  package: packageData, 
  providers, 
  onSave, 
  onCancel, 
  mode 
}: PackageEditorProps) {
  const [formData, setFormData] = useState({
    name: packageData?.name || '',
    type: packageData?.type || 'FIBRE',
    speed: packageData?.speed || '',
    data: packageData?.data || '',
    basePrice: packageData?.basePrice || 0,
    currentPrice: packageData?.currentPrice || 0,
    providerId: packageData?.provider?.id || '',
    active: packageData?.active ?? true,
    featured: packageData?.featured ?? false,
    technology: packageData?.technology || '',
    coverage: packageData?.coverage || '',
    installation: packageData?.installation || '',
    fupLimit: packageData?.fupLimit || '',
    throttleSpeed: packageData?.throttleSpeed || '',
    fupDescription: packageData?.fupDescription || '',
    specialTerms: packageData?.specialTerms || ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.name || !formData.providerId || formData.basePrice <= 0 || formData.currentPrice <= 0) {
        throw new Error('Please fill in all required fields')
      }

      // Note: Retail price (currentPrice) can be higher or lower than wholesale price (basePrice)
      // This allows for proper business pricing strategies

      await onSave(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save package')
    } finally {
      setLoading(false)
    }
  }

  const getTypeOptions = () => {
    return [
      { value: 'FIBRE', label: 'Fibre' },
      { value: 'LTE_FIXED', label: 'LTE Fixed' },
      { value: 'LTE_MOBILE', label: 'LTE Mobile' },
      { value: '5G_FIXED', label: '5G Fixed' }
    ]
  }

  const getInstallationOptions = () => {
    return [
      { value: '', label: 'Select installation type' },
      { value: 'SELF_INSTALL', label: 'Self Install' },
      { value: 'TECH_INSTALL', label: 'Tech Install' },
      { value: 'NO_INSTALL', label: 'No Installation Required' }
    ]
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? 'Create New Package' : 'Edit Package'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 100Mbps Uncapped Fibre"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider *
                </label>
                <select
                  name="providerId"
                  value={formData.providerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Provider</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {getTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed
                </label>
                <input
                  type="text"
                  name="speed"
                  value={formData.speed}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 100Mbps, 10/10Mbps"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Allowance
                </label>
                <input
                  type="text"
                  name="data"
                  value={formData.data}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Unlimited, 100GB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology
                </label>
                <input
                  type="text"
                  name="technology"
                  value={formData.technology}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., LTE, 5G, LTE Advanced"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Pricing Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wholesale Price (R) *
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Cost price from provider</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retail Price (R) *
                  </label>
                  <input
                    type="number"
                    name="currentPrice"
                    value={formData.currentPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Price shown to customers</p>
                </div>
              </div>
              
              {formData.currentPrice > 0 && formData.basePrice > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Margin:</span>
                    <span className={`text-sm font-medium ${formData.currentPrice > formData.basePrice ? 'text-green-600' : formData.currentPrice < formData.basePrice ? 'text-red-600' : 'text-gray-600'}`}>
                      R{formData.currentPrice - formData.basePrice} 
                      ({Math.round(((formData.currentPrice - formData.basePrice) / formData.basePrice) * 100)}%)
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {formData.currentPrice > formData.basePrice ? 'Profit' : 
                     formData.currentPrice < formData.basePrice ? 'Loss (promotional pricing)' : 'Break-even'}
                  </div>
                </div>
              )}
            </div>

            {/* FUP Information */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Fair Use Policy (FUP)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FUP Limit
                  </label>
                  <input
                    type="text"
                    name="fupLimit"
                    value={formData.fupLimit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1000GB, Unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Throttle Speed
                  </label>
                  <input
                    type="text"
                    name="throttleSpeed"
                    value={formData.throttleSpeed}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1Mbps, 2Mbps"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FUP Description
                </label>
                <textarea
                  name="fupDescription"
                  value={formData.fupDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed FUP terms and conditions..."
                />
              </div>
            </div>

            {/* LTE/5G Specific Fields */}
            {(formData.type === 'LTE_FIXED' || formData.type === 'LTE_MOBILE' || formData.type === '5G_FIXED') && (
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">LTE/5G Specific Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coverage Area
                    </label>
                    <input
                      type="text"
                      name="coverage"
                      value={formData.coverage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Nationwide, Gauteng only"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Installation Type
                    </label>
                    <select
                      name="installation"
                      value={formData.installation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {getInstallationOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Special Terms */}
            <div className="border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Terms
                </label>
                <textarea
                  name="specialTerms"
                  value={formData.specialTerms}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special terms or conditions..."
                />
              </div>
            </div>

            {/* Status */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Package Status</h4>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  mode === 'create' ? 'Create Package' : 'Update Package'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 