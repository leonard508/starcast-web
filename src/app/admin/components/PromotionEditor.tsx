'use client'

import React, { useState, useEffect } from 'react'

interface Promotion {
  id: string
  code: string
  name: string
  description?: string
  packageId?: string
  discountType: string
  discountValue: number
  startDate: string
  endDate: string
  usageLimit: number
  timesUsed: number
  targetAudience?: string
  userSpecific?: string
  minimumOrders?: number
  stackable: boolean
  autoApply: boolean
  active: boolean
  package?: {
    id: string
    name: string
    provider: {
      name: string
    }
  }
}

interface Package {
  id: string
  name: string
  type: string
  provider: {
    name: string
  }
}

interface PromotionEditorProps {
  promotion?: Promotion
  packages: Package[]
  onSave: (promotionData: Partial<Promotion>) => void
  onCancel: () => void
  mode: 'create' | 'edit'
}

export default function PromotionEditor({ 
  promotion, 
  packages, 
  onSave, 
  onCancel, 
  mode 
}: PromotionEditorProps) {
  const [formData, setFormData] = useState({
    code: promotion?.code || '',
    name: promotion?.name || '',
    description: promotion?.description || '',
    packageId: promotion?.packageId || '',
    discountType: promotion?.discountType || 'PERCENTAGE',
    discountValue: promotion?.discountValue || 0,
    startDate: promotion?.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
    endDate: promotion?.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
    usageLimit: promotion?.usageLimit || 1,
    targetAudience: promotion?.targetAudience || '',
    userSpecific: promotion?.userSpecific || '',
    minimumOrders: promotion?.minimumOrders || 1,
    stackable: promotion?.stackable ?? false,
    autoApply: promotion?.autoApply ?? false,
    active: promotion?.active ?? true
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
      if (!formData.code || !formData.name || !formData.discountType || !formData.discountValue || !formData.startDate || !formData.endDate) {
        throw new Error('Please fill in all required fields')
      }

      // Validate discount value
      if (formData.discountValue <= 0) {
        throw new Error('Discount value must be greater than 0')
      }

      if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
        throw new Error('Percentage discount cannot exceed 100%')
      }

      // Validate dates
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      if (startDate >= endDate) {
        throw new Error('End date must be after start date')
      }

      // Validate usage limit
      if (formData.usageLimit < 1) {
        throw new Error('Usage limit must be at least 1')
      }

      await onSave(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save promotion')
    } finally {
      setLoading(false)
    }
  }

  const getDiscountTypeOptions = () => {
    return [
      { value: 'PERCENTAGE', label: 'Percentage Discount (%)' },
      { value: 'FIXED_AMOUNT', label: 'Fixed Amount Discount (R)' },
      { value: 'OVERRIDE_PRICE', label: 'Override Price (R)' }
    ]
  }

  const getTargetAudienceOptions = () => {
    return [
      { value: '', label: 'All Customers' },
      { value: 'new_customers', label: 'New Customers Only' },
      { value: 'existing_customers', label: 'Existing Customers Only' },
      { value: 'bulk_orders', label: 'Bulk Orders' },
      { value: 'new_customers,existing_customers', label: 'New & Existing Customers' }
    ]
  }

  const getFilteredPackages = () => {
    if (!formData.packageId) return packages
    return packages.filter(pkg => pkg.id === formData.packageId)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? 'Create New Promotion' : 'Edit Promotion'}
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
                  Promotion Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., SUMMER2024, NEWCUSTOMER"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Summer Sale 2024"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of the promotion..."
              />
            </div>

            {/* Package Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apply to Package (Optional)
              </label>
              <select
                name="packageId"
                value={formData.packageId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Packages (Global Promotion)</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.provider.name} ({pkg.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Discount Configuration */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Discount Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {getDiscountTypeOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.discountType === 'PERCENTAGE' && 'Enter percentage (e.g., 10 for 10%)'}
                    {formData.discountType === 'FIXED_AMOUNT' && 'Enter amount in Rands'}
                    {formData.discountType === 'OVERRIDE_PRICE' && 'Enter final price in Rands'}
                  </p>
                </div>
              </div>
            </div>

            {/* Date Configuration */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Date Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Usage Configuration */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Usage Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit *
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                    min="1"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum number of times this promotion can be used
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Orders (for bulk deals)
                  </label>
                  <input
                    type="number"
                    name="minimumOrders"
                    value={formData.minimumOrders}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Targeting */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Targeting</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getTargetAudienceOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Users (comma-separated emails)
                  </label>
                  <input
                    type="text"
                    name="userSpecific"
                    value={formData.userSpecific}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user1@example.com, user2@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Behavior */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Behavior</h4>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="stackable"
                    checked={formData.stackable}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Stackable with other promotions</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoApply"
                    checked={formData.autoApply}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Auto-apply to eligible orders</span>
                </label>
              </div>
            </div>

            {/* Status */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Promotion Status</h4>
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  mode === 'create' ? 'Create Promotion' : 'Update Promotion'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 