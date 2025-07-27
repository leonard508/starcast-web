"use client"

import { useUserData } from "@/hooks/useUserData"
import { PackageCard } from "@/components/dashboard/PackageCard"

// Temporary inline components to fix import issues
function DashboardHeader({ profile }: { profile: any }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{profile?.firstName ? `, ${profile.firstName}` : ''}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Your connectivity dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-900">{profile?.email}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-lg">
                {profile?.firstName?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardStats({ orders }: { orders: any[] }) {
  const activeServices = orders.filter(o => o.status === 'INSTALLED').length
  const monthlyTotal = orders.reduce((sum, order) => sum + order.finalPrice, 0)
  const pendingServices = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Active Services */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Active Services</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{activeServices}</p>
            <p className="text-gray-600 text-sm mt-1">✓ Installed & Running</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Monthly Total */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Monthly Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              R{monthlyTotal.toFixed(2)}
            </p>
            <p className="text-gray-600 text-sm mt-1">All services combined</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Account Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Account Status</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">Active</p>
            <p className="text-gray-500 text-sm mt-1">
              {pendingServices > 0 ? `${pendingServices} pending` : 'All services active'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { profile, orders, loading, error } = useUserData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader profile={profile} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <DashboardStats orders={orders} />
        
        {/* Active Packages Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
              <p className="text-gray-600 mt-1">Manage your connectivity packages</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                {orders.length} {orders.length === 1 ? 'service' : 'services'}
              </span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Services Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven&apos;t signed up for any connectivity packages yet. Explore our available services to get connected.
              </p>
              <button className="bg-gray-800 text-white px-8 py-3 rounded-xl hover:bg-gray-900 transition-all duration-200 font-medium shadow-sm">
                Explore Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order) => (
                <PackageCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}