'use client'

import React, { useState } from 'react'

interface Package {
  id: string
  name: string
  type: string
  provider: {
    name: string
  }
  promoBadge?: string
  promoBadgeColor?: string
  promoBadgeExpiryDate?: string
  promoBadgeTimer?: boolean
  active: boolean
}

interface BadgeManagerProps {
  packages: Package[]
  onClose: () => void
  onBulkUpdate: (updates: Array<{id: string, badgeData: any}>) => void
}

export default function BadgeManager({ packages, onClose, onBulkUpdate }: BadgeManagerProps) {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [bulkBadgeData, setBulkBadgeData] = useState({
    promoBadge: '',
    promoBadgeColor: 'blue',
    promoBadgeExpiryDate: '',
    promoBadgeTimer: false
  })
  const [mode, setMode] = useState<'add' | 'remove' | 'update'>('add')
  const [loading, setLoading] = useState(false)

  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPackages.length === packages.length) {
      setSelectedPackages([])
    } else {
      setSelectedPackages(packages.map(pkg => pkg.id))
    }
  }

  const handleBulkOperation = async () => {
    if (selectedPackages.length === 0) {
      alert('Please select at least one package')
      return
    }

    setLoading(true)
    try {
      const updates = selectedPackages.map(id => ({
        id,
        badgeData: mode === 'remove' ? {
          promoBadge: null,
          promoBadgeColor: null,
          promoBadgeExpiryDate: null,
          promoBadgeTimer: false
        } : {
          promoBadge: bulkBadgeData.promoBadge || null,
          promoBadgeColor: bulkBadgeData.promoBadgeColor,
          promoBadgeExpiryDate: bulkBadgeData.promoBadgeExpiryDate || null,
          promoBadgeTimer: bulkBadgeData.promoBadgeTimer
        }
      }))

      await onBulkUpdate(updates)
      onClose()
    } catch (error) {
      console.error('Bulk badge operation failed:', error)
      alert('Failed to update badges. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500 text-white'
      case 'green': return 'bg-green-500 text-white'
      case 'red': return 'bg-red-500 text-white'
      case 'yellow': return 'bg-yellow-500 text-black'
      case 'purple': return 'bg-purple-500 text-white'
      case 'pink': return 'bg-pink-500 text-white'
      case 'orange': return 'bg-orange-500 text-white'
      case 'gray': return 'bg-gray-500 text-white'
      default: return 'bg-blue-500 text-white'
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-8 border w-11/12 max-w-6xl shadow-2xl rounded-xl bg-white">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🏷️ Promotional Badge Manager</h2>
              <p className="text-gray-600 mt-1">Manage promotional badges across multiple packages</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Operation Mode Selection */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Operation</h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="add"
                  checked={mode === 'add'}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">➕ Add New Badges</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="update"
                  checked={mode === 'update'}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">🔄 Update Existing</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="remove"
                  checked={mode === 'remove'}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">🗑️ Remove All Badges</span>
              </label>
            </div>
          </div>

          {/* Badge Configuration (only for add/update modes) */}
          {(mode === 'add' || mode === 'update') && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge Text *
                  </label>
                  <input
                    type="text"
                    value={bulkBadgeData.promoBadge}
                    onChange={(e) => setBulkBadgeData(prev => ({...prev, promoBadge: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., SUMMER SALE, LIMITED TIME"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge Color
                  </label>
                  <select
                    value={bulkBadgeData.promoBadgeColor}
                    onChange={(e) => setBulkBadgeData(prev => ({...prev, promoBadgeColor: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="blue">🔵 Blue</option>
                    <option value="green">🟢 Green</option>
                    <option value="red">🔴 Red</option>
                    <option value="yellow">🟡 Yellow</option>
                    <option value="purple">🟣 Purple</option>
                    <option value="pink">🩷 Pink</option>
                    <option value="orange">🟠 Orange</option>
                    <option value="gray">⚫ Gray</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={bulkBadgeData.promoBadgeExpiryDate}
                    onChange={(e) => setBulkBadgeData(prev => ({...prev, promoBadgeExpiryDate: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={bulkBadgeData.promoBadgeTimer}
                      onChange={(e) => setBulkBadgeData(prev => ({...prev, promoBadgeTimer: e.target.checked}))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show Countdown Timer</span>
                  </label>
                </div>
              </div>
              
              {/* Badge Preview */}
              {bulkBadgeData.promoBadge && (
                <div className="mt-4 p-3 bg-white rounded-md border">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getBadgeColorClass(bulkBadgeData.promoBadgeColor)}`}>
                    🏷️ {bulkBadgeData.promoBadge}
                    {bulkBadgeData.promoBadgeTimer && bulkBadgeData.promoBadgeExpiryDate && (
                      <span className="ml-1 opacity-75">⏰</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Package Selection */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Packages ({selectedPackages.length}/{packages.length})
                </h3>
                <button
                  onClick={handleSelectAll}
                  className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                >
                  {selectedPackages.length === packages.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {packages.map((pkg) => (
                <div key={pkg.id} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPackages.includes(pkg.id)}
                        onChange={() => handlePackageToggle(pkg.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                        <div className="text-sm text-gray-500">{pkg.provider.name} • {pkg.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!pkg.active && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                      {pkg.promoBadge && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getBadgeColorClass(pkg.promoBadgeColor || 'blue')}`}>
                          🏷️ {pkg.promoBadge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkOperation}
              disabled={loading || selectedPackages.length === 0 || (mode !== 'remove' && !bulkBadgeData.promoBadge)}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  {mode === 'add' && '➕ Add Badges'}
                  {mode === 'update' && '🔄 Update Badges'}
                  {mode === 'remove' && '🗑️ Remove Badges'}
                  {' '}({selectedPackages.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}