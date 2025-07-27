"use client"

import { useState } from "react"

export function DashboardNavigation() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bills', label: 'Bills & Payments', icon: '💰' },
    { id: 'support', label: 'Support', icon: '🛠️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
} 