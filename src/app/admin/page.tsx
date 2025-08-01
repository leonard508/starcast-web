'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PackageEditor from './components/PackageEditor'
import PromotionEditor from './components/PromotionEditor'
import BadgeManager from './components/BadgeManager'

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
  // Promotional Badge System
  promoBadge?: string
  promoBadgeColor?: string
  promoBadgeExpiryDate?: string
  promoBadgeTimer?: boolean
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
  packages: Package[]
}

interface Promotion {
  id: string
  code: string
  name: string
  description?: string
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
  packageId?: string
}

interface Application {
  id: string
  applicationNumber: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  package: {
    id: string
    name: string
    type: string
    provider: {
      name: string
    }
  }
  serviceAddress: any
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'
  specialRequirements?: string
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [activeTab, setActiveTab] = useState<'applications' | 'packages' | 'promotions' | 'price-changes' | 'providers' | 'users'>('applications')
  const [selectedType, setSelectedType] = useState<'all' | 'FIBRE' | 'LTE_FIXED' | 'LTE_MOBILE'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'>('all')
  const [selectedProvider, setSelectedProvider] = useState<'all' | string>('all')
  const [selectedUserFilter, setSelectedUserFilter] = useState<'all' | 'pending' | 'active' | 'inactive' | 'unverified' | 'admins'>('all')
  const [packageSearchTerm, setPackageSearchTerm] = useState('')
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [showPackageEditor, setShowPackageEditor] = useState(false)
  const [showPromotionEditor, setShowPromotionEditor] = useState(false)
  const [showBadgeManager, setShowBadgeManager] = useState(false)
  const [priceHistory, setPriceHistory] = useState<any[]>([])

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      // Check if user is authenticated as admin by trying to fetch a protected endpoint
      const response = await fetch('/api/applications', { 
        credentials: 'include',
        method: 'HEAD' // Just check auth without getting data
      })
      
      if (response.status === 401 || response.status === 403) {
        // Not authenticated or not admin, redirect to login
        router.push('/login?redirect=/admin')
        return
      }
      
      // Authentication successful, proceed to fetch data
      setAuthChecked(true)
      fetchData()
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login?redirect=/admin')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [packagesRes, providersRes, promotionsRes, priceHistoryRes, applicationsRes, usersRes] = await Promise.all([
        fetch('/api/packages', { credentials: 'include' }),
        fetch('/api/providers', { credentials: 'include' }),
        fetch('/api/promotions', { credentials: 'include' }),
        fetch('/api/price-history', { credentials: 'include' }),
        fetch('/api/applications', { credentials: 'include' }),
        fetch('/api/users', { credentials: 'include' })
      ])

      if (!packagesRes.ok || !providersRes.ok || !promotionsRes.ok || !priceHistoryRes.ok || !applicationsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const packagesData = await packagesRes.json()
      const providersData = await providersRes.json()
      const promotionsData = await promotionsRes.json()
      const priceHistoryData = await priceHistoryRes.json()
      const applicationsData = await applicationsRes.json()
      const usersData = await usersRes.json()

      setPackages(packagesData.data || [])
      setProviders(providersData.data || [])
      setPromotions(promotionsData.data || [])
      setPriceHistory(priceHistoryData.data || [])
      setApplications(applicationsData.data || [])
      setUsers(usersData.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = packages.filter(pkg => {
    const typeMatch = selectedType === 'all' || pkg.type === selectedType
    const providerMatch = selectedProvider === 'all' || pkg.provider.slug === selectedProvider
    const searchMatch = packageSearchTerm === '' || 
      pkg.name.toLowerCase().includes(packageSearchTerm.toLowerCase()) ||
      pkg.provider.name.toLowerCase().includes(packageSearchTerm.toLowerCase()) ||
      pkg.speed?.toLowerCase().includes(packageSearchTerm.toLowerCase())
    
    return typeMatch && providerMatch && searchMatch
  })

  const filteredApplications = applications.filter(app => 
    selectedStatus === 'all' || app.status === selectedStatus
  )

  const filteredUsers = users.filter(user => {
    // First apply the filter
    let matches = false
    switch (selectedUserFilter) {
      case 'pending':
        matches = !user.emailVerified || (!user.active && user.role === 'USER')
        break
      case 'active':
        matches = user.active && user.emailVerified
        break
      case 'inactive':
        matches = !user.active
        break
      case 'unverified':
        matches = !user.emailVerified
        break
      case 'admins':
        matches = user.role === 'ADMIN'
        break
      case 'all':
      default:
        matches = true
        break
    }
    
    if (!matches) return false
    
    // Then apply search term if provided
    if (userSearchTerm === '') return true
    return user.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
           user.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
           user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
           user.phone?.toLowerCase().includes(userSearchTerm.toLowerCase())
  })

  // Get providers categorized by type
  const fibreProviders = providers.filter(provider => 
    packages.some(pkg => pkg.provider.id === provider.id && pkg.type === 'FIBRE')
  )
  
  const lteProviders = providers.filter(provider => 
    packages.some(pkg => pkg.provider.id === provider.id && (pkg.type === 'LTE_FIXED' || pkg.type === '5G_FIXED'))
  )

  const fibrePackages = packages.filter(pkg => pkg.type === 'FIBRE')
  const ltePackages = packages.filter(pkg => pkg.type.startsWith('LTE'))

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FIBRE': return 'bg-blue-100 text-blue-800'
      case 'LTE_FIXED': return 'bg-purple-100 text-purple-800'
      case 'LTE_MOBILE': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (active: boolean) => {
    return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const isPromoBadgeExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date() > new Date(expiryDate)
  }

  const handleBulkBadgeUpdate = async (updates: Array<{id: string, badgeData: any}>) => {
    try {
      const promises = updates.map(update => 
        fetch('/api/packages', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            id: update.id,
            ...packages.find(p => p.id === update.id),
            ...update.badgeData
          }),
        })
      )

      await Promise.all(promises)
      await fetchData()
      alert(`Successfully updated badges for ${updates.length} packages`)
    } catch (error) {
      console.error('Bulk badge update failed:', error)
      throw error
    }
  }

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg)
    setShowPackageEditor(true)
  }

  const handleEditPromotion = (promo: Promotion) => {
    setEditingPromotion(promo)
    setShowPromotionEditor(true)
  }

  const handleSavePackage = async (packageData: Partial<Package>) => {
    try {
      const url = '/api/packages'
      const method = editingPackage ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editingPackage ? { ...packageData, id: editingPackage.id } : packageData),
      })

      if (!response.ok) {
        throw new Error('Failed to save package')
      }

      // Refresh data
      await fetchData()
      setShowPackageEditor(false)
      setEditingPackage(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save package')
    }
  }

  const handleSavePromotion = async (promotionData: Partial<Promotion>) => {
    try {
      const url = editingPromotion ? `/api/promotions/${editingPromotion.id}` : '/api/promotions'
      const method = editingPromotion ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editingPromotion ? { ...promotionData, id: editingPromotion.id } : promotionData),
      })

      if (!response.ok) {
        throw new Error('Failed to save promotion')
      }

      // Refresh data
      await fetchData()
      setShowPromotionEditor(false)
      setEditingPromotion(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save promotion')
    }
  }

  const handleApproveApplication = async (application: Application) => {
    try {
      const response = await fetch(`/api/applications/${application.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          reviewedBy: 'Admin', // In a real app, get from auth context
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve application')
      }

      // Refresh data
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve application')
    }
  }

  const handleRejectApplication = async (application: Application) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      const response = await fetch(`/api/applications/${application.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rejectionReason: reason,
          reviewedBy: 'Admin', // In a real app, get from auth context
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject application')
      }

      // Refresh data
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject application')
    }
  }

  const handleSendEmailToUser = async (user: any) => {
    // Redirect to messaging dashboard with pre-selected user
    router.push(`/admin/messages?user=${user.id}&email=${user.email}&name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}`)
  }

  const handleViewUserDetails = (user: any) => {
    const userApps = applications.filter(app => app.user.id === user.id)
    const details = `
User Details:
Name: ${user.firstName || 'N/A'} ${user.lastName || ''}
Email: ${user.email}
Phone: ${user.phone || 'Not provided'}
Role: ${user.role}
Status: ${user.active ? 'Active' : 'Inactive'}
Email Verified: ${user.emailVerified ? 'Yes' : 'No'}
Joined: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
Applications: ${userApps.length}

Recent Applications:
${userApps.slice(0, 3).map(app => `- ${app.package.name} (${app.status})`).join('\n')}
    `
    alert(details)
  }

  const handleToggleUserStatus = async (user: any) => {
    const action = user.active ? 'deactivate' : 'activate'
    const confirmed = confirm(`Are you sure you want to ${action} ${user.email}?`)
    
    if (!confirmed) return

    try {
      const response = await fetch('/api/users/toggle-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          active: !user.active
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      // Refresh data
      await fetchData()
      alert(`User ${action}d successfully`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status')
    }
  }

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            {!authChecked ? 'Checking authentication...' : 'Loading admin dashboard...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage packages, promotions, and customer applications</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/admin/messages"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                📧 Messages
              </Link>
              <Link 
                href="/admin/import"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                📊 Import Data
              </Link>
              <a 
                href="/WHATSAPP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                📱 WhatsApp Docs
              </a>
              <button 
                onClick={fetchData}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg font-medium border border-gray-200"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pending Actions Alert */}
        {(applications.filter(a => a.status === 'PENDING_APPROVAL').length > 0 || users.filter(u => !u.emailVerified || u.role === 'USER' && !u.active).length > 0) && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-amber-800">⚠️ Action Required</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-amber-700">
                  {applications.filter(a => a.status === 'PENDING_APPROVAL').length > 0 && (
                    <button 
                      onClick={() => {
                        setActiveTab('applications')
                        setSelectedStatus('PENDING_APPROVAL')
                      }}
                      className="bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-md font-medium transition-colors"
                    >
                      📋 {applications.filter(a => a.status === 'PENDING_APPROVAL').length} Applications Awaiting Approval
                    </button>
                  )}
                  {users.filter(u => !u.emailVerified && u.role === 'USER').length > 0 && (
                    <button 
                      onClick={() => {
                        setActiveTab('users')
                        setUserSearchTerm('')
                      }}
                      className="bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-md font-medium transition-colors"
                    >
                      👤 {users.filter(u => !u.emailVerified && u.role === 'USER').length} Users Need Email Verification
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          <button 
            onClick={() => {
              setActiveTab('applications')
              setSelectedStatus('all')
            }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full text-left cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{applications.length}</p>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation()
                    setActiveTab('applications')
                    setSelectedStatus('PENDING_APPROVAL')
                  }}
                  className="text-sm text-amber-600 font-medium mt-1 hover:text-amber-800 hover:underline"
                >
                  {applications.filter(a => a.status === 'PENDING_APPROVAL').length} pending review
                </button>
              </div>
            </div>
          </button>
          <button 
            onClick={() => {
              setActiveTab('packages')
              setSelectedType('all')
              setSelectedProvider('all')
              setPackageSearchTerm('')
            }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full text-left cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Packages</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{packages.length}</p>
                <p className="text-sm text-blue-600 font-medium mt-1">
                  {packages.filter(p => p.active).length} active
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('packages')
              setSelectedType('FIBRE')
              setSelectedProvider('all')
              setPackageSearchTerm('')
            }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full text-left cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Fibre Packages</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{fibrePackages.length}</p>
                <p className="text-sm text-orange-600 font-medium mt-1">
                  High-speed internet
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('packages')
              setSelectedType('LTE_FIXED')
              setSelectedProvider('all')
              setPackageSearchTerm('')
            }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full text-left cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">LTE Packages</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{ltePackages.length}</p>
                <p className="text-sm text-purple-600 font-medium mt-1">
                  Mobile connectivity
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('packages')
              setSelectedType('all')
              setSelectedProvider('all')
              setPackageSearchTerm('')
            }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full text-left cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Packages</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {packages.filter(p => p.active).length}
                </p>
                <p className="text-sm text-green-600 font-medium mt-1">
                  Available for customers
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('promotions')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full text-left cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Promotions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {promotions.filter(p => p.active).length}
                </p>
                <p className="text-sm text-pink-600 font-medium mt-1">
                  Discounts & offers
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('providers')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 w-full text-left cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Providers</p>
                <p className="text-2xl font-semibold text-gray-900">{providers.length}</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('price-changes')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 w-full text-left cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Price Changes</p>
                <p className="text-2xl font-semibold text-gray-900">{priceHistory.length}</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveTab('users')
              setUserSearchTerm('')
            }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 w-full text-left cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Registered Users</p>
                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                <p className="text-xs text-blue-600">
                  {users.filter(u => u.role === 'ADMIN').length} admin(s)
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applications ({applications.length})
                {applications.filter(a => a.status === 'PENDING_APPROVAL').length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {applications.filter(a => a.status === 'PENDING_APPROVAL').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'packages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Packages ({packages.length})
              </button>
              <button
                onClick={() => setActiveTab('promotions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'promotions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Promotions ({promotions.length})
              </button>
              <button
                onClick={() => setActiveTab('price-changes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'price-changes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Price Changes ({priceHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('providers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'providers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Providers ({providers.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users ({users.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Customer Applications</h2>
                  <div className="flex space-x-4">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as any)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="PENDING_APPROVAL">Pending Approval</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                    <button 
                      onClick={fetchData}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Application
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{app.applicationNumber}</div>
                              {app.specialRequirements && (
                                <div className="text-xs text-gray-500">Special requirements noted</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {app.user.firstName} {app.user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{app.user.email}</div>
                              {app.user.phone && (
                                <div className="text-xs text-gray-500">{app.user.phone}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{app.package.name}</div>
                              <div className="text-sm text-gray-500">{app.package.provider.name}</div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(app.package.type)}`}>
                                {app.package.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="max-w-xs truncate">
                              {app.serviceAddress?.street && (
                                <div>{app.serviceAddress.street}</div>
                              )}
                              {app.serviceAddress?.suburb && app.serviceAddress?.city && (
                                <div>{app.serviceAddress.suburb}, {app.serviceAddress.city}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApplicationStatusColor(app.status)}`}>
                              {app.status.replace('_', ' ')}
                            </span>
                            {app.reviewedAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                Reviewed by {app.reviewedBy}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {app.status === 'PENDING_APPROVAL' && (
                                <>
                                  <button 
                                    onClick={() => handleApproveApplication(app)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleRejectApplication(app)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button className="text-blue-600 hover:text-blue-900">View Details</button>
                              {app.rejectionReason && (
                                <span className="text-xs text-gray-500" title={app.rejectionReason}>
                                  Reason: {app.rejectionReason.slice(0, 20)}...
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredApplications.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                    <p className="mt-1 text-sm text-gray-500">No customer applications found for the selected filter.</p>
                  </div>
                )}
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Package Management</h2>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Search packages, providers, speeds..."
                      value={packageSearchTerm}
                      onChange={(e) => setPackageSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
                    />
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as any)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="FIBRE">Fibre Only</option>
                      <option value="LTE_FIXED">LTE/5G Only</option>
                    </select>
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Providers</option>
                      <optgroup label="Fibre Providers">
                        {fibreProviders.map(provider => (
                          <option key={provider.id} value={provider.slug}>
                            {provider.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="LTE/5G Providers">
                        {lteProviders.map(provider => (
                          <option key={provider.id} value={provider.slug}>
                            {provider.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <button 
                      onClick={() => {
                        setEditingPackage(null)
                        setShowPackageEditor(true)
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add Package
                    </button>
                    <button 
                      onClick={() => setShowBadgeManager(true)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      🏷️ Manage Badges
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                      Import Wholesale Prices
                    </button>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                      Import Retail Prices
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Speed/Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pricing
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPackages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                              <div className="flex items-center space-x-2 mt-1">
                                {pkg.featured && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    ⭐ Featured
                                  </span>
                                )}
                                {pkg.promoBadge && !isPromoBadgeExpired(pkg.promoBadgeExpiryDate) && (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getBadgeColorClass(pkg.promoBadgeColor || 'blue')}`}>
                                    🏷️ {pkg.promoBadge}
                                    {pkg.promoBadgeTimer && pkg.promoBadgeExpiryDate && (
                                      <span className="ml-1 text-xs opacity-75">
                                        ⏰
                                      </span>
                                    )}
                                  </span>
                                )}
                                {pkg.promoBadge && isPromoBadgeExpired(pkg.promoBadgeExpiryDate) && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 line-through">
                                    🏷️ {pkg.promoBadge} (Expired)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.provider.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(pkg.type)}`}>
                              {pkg.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              {pkg.speed && <div>Speed: {pkg.speed}</div>}
                              {pkg.data && <div>Data: {pkg.data}</div>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium text-blue-600">R{pkg.currentPrice}</div>
                              <div className="text-xs text-gray-500">Retail</div>
                              <div className="text-xs text-green-600">R{pkg.basePrice}</div>
                              <div className="text-xs text-gray-500">Wholesale</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pkg.active)}`}>
                              {pkg.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-2">
                              <button 
                                onClick={() => handleEditPackage(pkg)}
                                className="text-blue-600 hover:text-blue-900 font-medium"
                              >
                                ✏️ Edit
                              </button>
                              <button className="text-green-600 hover:text-green-900 font-medium">
                                💰 Promotions
                              </button>
                              {pkg.promoBadge && (
                                <button className="text-purple-600 hover:text-purple-900 font-medium">
                                  🏷️ Badge
                                </button>
                              )}
                              <button className="text-red-600 hover:text-red-900 font-medium">
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Promotions Tab */}
            {activeTab === 'promotions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Promotion Management</h2>
                  <button 
                    onClick={() => {
                      setEditingPromotion(null)
                      setShowPromotionEditor(true)
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Add Promotion
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Promotion
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Discount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {promotions.map((promo) => (
                        <tr key={promo.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{promo.name}</div>
                              {promo.description && (
                                <div className="text-sm text-gray-500">{promo.description}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{promo.code}</code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              {promo.discountType === 'PERCENTAGE' && `${promo.discountValue}%`}
                              {promo.discountType === 'FIXED_AMOUNT' && `R${promo.discountValue}`}
                              {promo.discountType === 'OVERRIDE_PRICE' && `R${promo.discountValue}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {promo.timesUsed} / {promo.usageLimit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div>From: {new Date(promo.startDate).toLocaleDateString()}</div>
                              <div>To: {new Date(promo.endDate).toLocaleDateString()}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(promo.active)}`}>
                              {promo.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditPromotion(promo)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-900">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Price Changes Tab */}
            {activeTab === 'price-changes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Price Change History</h2>
                  <div className="flex space-x-2">
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option value="all">All Packages</option>
                      {packages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                      ))}
                    </select>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Export History
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Old Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          New Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Changed By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {priceHistory.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                            No price changes recorded yet.
                          </td>
                        </tr>
                      ) : (
                        priceHistory.map((change) => (
                          <tr key={change.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {change.package?.name || 'Unknown Package'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {change.package?.provider?.name || 'Unknown Provider'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              R{change.oldPrice}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              R{change.newPrice}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {change.newPrice > change.oldPrice ? (
                                  <span className="text-red-600 text-sm font-medium">
                                    +R{change.newPrice - change.oldPrice} (+{Math.round(((change.newPrice - change.oldPrice) / change.oldPrice) * 100)}%)
                                  </span>
                                ) : (
                                  <span className="text-green-600 text-sm font-medium">
                                    -R{change.oldPrice - change.newPrice} (-{Math.round(((change.oldPrice - change.newPrice) / change.oldPrice) * 100)}%)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {change.changedBy}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(change.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {change.reason || 'No reason provided'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {priceHistory.length > 0 && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Changes</p>
                        <p className="text-lg font-semibold text-gray-900">{priceHistory.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price Increases</p>
                        <p className="text-lg font-semibold text-red-600">
                          {priceHistory.filter(change => change.newPrice > change.oldPrice).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price Decreases</p>
                        <p className="text-lg font-semibold text-green-600">
                          {priceHistory.filter(change => change.newPrice < change.oldPrice).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">No Change</p>
                        <p className="text-lg font-semibold text-gray-600">
                          {priceHistory.filter(change => change.newPrice === change.oldPrice).length}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Provider Management</h2>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    Add Provider
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Slug
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Packages
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {providers.map((provider) => (
                        <tr key={provider.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {provider.slug}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {provider.packages?.length || 0} packages
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(provider.active)}`}>
                              {provider.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">Edit</button>
                              <button className="text-green-600 hover:text-green-900">Packages</button>
                              <button className="text-red-600 hover:text-red-900">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                  <div className="flex space-x-4">
                    <select
                      value={selectedUserFilter || 'all'}
                      onChange={(e) => setSelectedUserFilter(e.target.value as any)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Users</option>
                      <option value="pending">⚠️ Needs Attention</option>
                      <option value="active">✅ Active Users</option>
                      <option value="inactive">❌ Inactive Users</option>
                      <option value="unverified">📧 Unverified Email</option>
                      <option value="admins">🔒 Admins</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Search users by name, email, phone..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Export Users
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                      Send Bulk Email
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity & Applications
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Admin Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className={`hover:bg-gray-50 ${!user.emailVerified || !user.active ? 'bg-amber-50' : ''}`}>
                          {/* User Details */}
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                  user.role === 'ADMIN' ? 'bg-purple-500' : 
                                  user.active && user.emailVerified ? 'bg-green-500' : 'bg-gray-400'
                                }`}>
                                  {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName || 'N/A'} {user.lastName || ''}
                                  {user.role === 'ADMIN' && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Admin</span>}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-xs text-gray-400">{user.phone || 'No phone provided'}</div>
                              </div>
                            </div>
                          </td>

                          {/* Account Status */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.active ? '✅ Active' : '❌ Inactive'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.emailVerified ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {user.emailVerified ? '📧 Verified' : '⚠️ Unverified'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                              </div>
                            </div>
                          </td>

                          {/* Activity & Applications */}
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {applications.filter(app => app.user.id === user.id).length} Applications
                              </div>
                              {applications.filter(app => app.user.id === user.id).length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {applications.filter(app => app.user.id === user.id && app.status === 'PENDING_APPROVAL').length > 0 && (
                                    <span className="text-amber-600 font-medium">
                                      {applications.filter(app => app.user.id === user.id && app.status === 'PENDING_APPROVAL').length} pending approval
                                    </span>
                                  )}
                                  {applications.filter(app => app.user.id === user.id && app.status === 'APPROVED').length > 0 && (
                                    <span className="text-green-600">
                                      {applications.filter(app => app.user.id === user.id && app.status === 'APPROVED').length} approved
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Admin Actions */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              {/* Primary Actions for users needing attention */}
                              {(!user.emailVerified || !user.active) && user.role !== 'ADMIN' && (
                                <div className="flex space-x-2">
                                  {!user.active && (
                                    <button 
                                      onClick={() => handleToggleUserStatus(user)}
                                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                    >
                                      ✅ Approve User
                                    </button>
                                  )}
                                  {!user.emailVerified && (
                                    <button 
                                      onClick={() => handleSendEmailToUser(user)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                    >
                                      📧 Send Verification
                                    </button>
                                  )}
                                </div>
                              )}
                              
                              {/* Secondary Actions */}
                              <div className="flex space-x-2 text-xs">
                                <button 
                                  onClick={() => handleViewUserDetails(user)}
                                  className="text-gray-600 hover:text-gray-900 underline"
                                >
                                  View Details
                                </button>
                                <button 
                                  onClick={() => handleSendEmailToUser(user)}
                                  className="text-blue-600 hover:text-blue-900 underline"
                                >
                                  Send Email
                                </button>
                                {user.role !== 'ADMIN' && (
                                  <button 
                                    onClick={() => handleToggleUserStatus(user)}
                                    className={`${user.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} underline`}
                                  >
                                    {user.active ? 'Deactivate' : 'Activate'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">No users match your search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Package Editor Modal */}
      {showPackageEditor && (
        <PackageEditor
          package={editingPackage || undefined}
          providers={providers}
          onSave={handleSavePackage}
          onCancel={() => {
            setShowPackageEditor(false)
            setEditingPackage(null)
          }}
          mode={editingPackage ? 'edit' : 'create'}
        />
      )}

      {/* Promotion Editor Modal */}
      {showPromotionEditor && (
        <PromotionEditor
          promotion={editingPromotion || undefined}
          packages={packages}
          onSave={handleSavePromotion}
          onCancel={() => {
            setShowPromotionEditor(false)
            setEditingPromotion(null)
          }}
          mode={editingPromotion ? 'edit' : 'create'}
        />
      )}

      {/* Badge Manager Modal */}
      {showBadgeManager && (
        <BadgeManager
          packages={packages}
          onClose={() => setShowBadgeManager(false)}
          onBulkUpdate={handleBulkBadgeUpdate}
        />
      )}
    </div>
  )
} 