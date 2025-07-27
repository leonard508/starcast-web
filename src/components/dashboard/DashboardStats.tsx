interface DashboardStatsProps {
  orders: Array<{
    id: string
    status: string
    finalPrice: number
  }>
}

export function DashboardStats({ orders }: DashboardStatsProps) {
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
            <p className="text-green-600 text-sm mt-1">✓ Installed & Running</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
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
            <p className="text-blue-600 text-sm mt-1">All services combined</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-sm">
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
            <p className="text-3xl font-bold text-green-600 mt-1">Active</p>
            <p className="text-gray-500 text-sm mt-1">
              {pendingServices > 0 ? `${pendingServices} pending` : 'All services active'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
} 