'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface Package {
  id: string
  name: string
  speed: string | null
  data: string
  fupLimit: string | null
  throttleSpeed: string | null
  secondaryThrottleSpeed: string | null
  fupDescription: string | null
  specialTerms: string | null
  technology: string
  basePrice: number
  currentPrice: number
  type: string
  provider: {
    id: string
    name: string
    slug: string
  }
}

interface Provider {
  id: string
  name: string
  slug: string
  packages: Package[]
}

export default function LTE5GPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPackages, setSelectedPackages] = useState<Record<string, Package | null>>({})

  useEffect(() => {
    fetchLTE5GData()
  }, [])

  const fetchLTE5GData = async () => {
    try {
      // Fetch LTE and 5G packages
      const response = await fetch('/api/packages?type=LTE_FIXED,5G_FIXED')
      const data = await response.json()
      
      if (data.success) {
        // Group packages by provider
        const providerMap: Record<string, Provider> = {}
        
        data.data.forEach((pkg: Package) => {
          const providerName = pkg.provider.name
          if (!providerMap[providerName]) {
            providerMap[providerName] = {
              id: pkg.provider.id,
              name: providerName,
              slug: pkg.provider.slug,
              packages: []
            }
          }
          providerMap[providerName].packages.push(pkg)
        })

        // Sort packages within each provider by price
        Object.values(providerMap).forEach(provider => {
          provider.packages.sort((a, b) => a.currentPrice - b.currentPrice)
        })

        const providersArray = Object.values(providerMap)
        setProviders(providersArray)

        // Set default selected packages (cheapest for each provider)
        const defaultSelections: Record<string, Package | null> = {}
        providersArray.forEach(provider => {
          if (provider.packages.length > 0) {
            defaultSelections[provider.slug] = provider.packages[0]
          }
        })
        setSelectedPackages(defaultSelections)
      }
    } catch (error) {
      console.error('Error fetching LTE/5G data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePackageSelect = (providerSlug: string, packageId: string) => {
    const provider = providers.find(p => p.slug === providerSlug)
    const selectedPackage = provider?.packages.find(p => p.id === packageId)
    
    if (selectedPackage) {
      setSelectedPackages(prev => ({
        ...prev,
        [providerSlug]: selectedPackage
      }))
    }
  }

  const handleSignup = (pkg: Package) => {
    // Navigate to signup with package details
    const params = new URLSearchParams({
      package: pkg.id,
      provider: pkg.provider.slug,
      price: pkg.currentPrice.toString(),
      name: pkg.name
    })
    window.location.href = `/signup?${params.toString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Uncapped LTE & 5G
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Self-Install Today. Fast & Reliable Wireless Internet.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Quick Setup
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Wide Coverage
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                No Contracts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Providers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Wireless Network
          </h2>
          <p className="text-lg text-gray-600">
            Select from South Africa&apos;s leading LTE and 5G networks
          </p>
        </div>

        {/* Provider Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {providers.map((provider) => {
            const selectedPackage = selectedPackages[provider.slug]
            
            return (
              <div key={provider.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                {/* Provider Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">{provider.name}</h3>
                  <p className="text-blue-100">LTE & 5G Network</p>
                </div>

                {/* Package Selection */}
                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Package:
                    </label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedPackage?.id || ''}
                      onChange={(e) => handlePackageSelect(provider.slug, e.target.value)}
                    >
                      {provider.packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - R{pkg.currentPrice}/pm
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPackage && (
                    <>
                      {/* Package Details */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-3xl font-bold text-gray-900">
                              R{selectedPackage.currentPrice}
                            </span>
                            <span className="text-gray-600">/month</span>
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {selectedPackage.technology}
                          </div>
                        </div>

                        {/* Speed */}
                        {selectedPackage.speed && (
                          <div className="mb-3">
                            <span className="text-lg font-semibold text-gray-800">
                              {selectedPackage.speed}
                            </span>
                          </div>
                        )}

                        {/* Data */}
                        <div className="mb-3">
                          <span className="text-green-600 font-medium">
                            {selectedPackage.data} Data
                          </span>
                        </div>

                        {/* FUP Information */}
                        {selectedPackage.fupLimit && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                            <div className="text-sm">
                              <div className="font-medium text-orange-800 mb-1">
                                Fair Use Policy: {selectedPackage.fupLimit}
                              </div>
                              {selectedPackage.throttleSpeed && (
                                <div className="text-orange-700">
                                  Then {selectedPackage.throttleSpeed}
                                  {selectedPackage.secondaryThrottleSpeed && 
                                    ` → ${selectedPackage.secondaryThrottleSpeed}`
                                  }
                                </div>
                              )}
                              {selectedPackage.fupDescription && (
                                <div className="text-orange-600 text-xs mt-1">
                                  {selectedPackage.fupDescription}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Special Terms */}
                        {selectedPackage.specialTerms && (
                          <div className="text-xs text-gray-500 mb-4 italic">
                            {selectedPackage.specialTerms}
                          </div>
                        )}

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            Self-install router
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            Wide network coverage
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            Quick activation
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            {selectedPackage.technology} technology
                          </div>
                        </div>

                        {/* Signup Button */}
                        <button
                          onClick={() => handleSignup(selectedPackage)}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                          Get {provider.name} {selectedPackage.technology}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Coverage Disclaimer */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              Network Coverage Information
            </h3>
            <p className="text-amber-700 text-sm">
              Speeds are dependent on network coverage and available capacity. 
              LTE and 5G coverage varies by location. Contact us to confirm availability in your area.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}