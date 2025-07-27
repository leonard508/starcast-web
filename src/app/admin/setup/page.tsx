'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSetupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    setupKey: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [setupNeeded, setSetupNeeded] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/admin/setup')
      const data = await response.json()
      setSetupNeeded(data.setupNeeded)
      
      if (!data.setupNeeded) {
        setMessage('Admin user already exists. Redirecting to login...')
        setTimeout(() => router.push('/signin'), 2000)
      }
    } catch (error) {
      console.error('Setup check failed:', error)
      setError('Failed to check setup status')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Setup failed')
      }

      setMessage('Admin user created successfully! Redirecting to dashboard...')
      setTimeout(() => router.push('/admin'), 2000)

    } catch (error) {
      console.error('Setup error:', error)
      setError(error instanceof Error ? error.message : 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (setupNeeded === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Checking setup status...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!setupNeeded) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-2">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
              Setup Complete
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {message || 'Admin user already exists. You will be redirected to login.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Starcast Admin Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create the first admin user for your Starcast system
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="setupKey" className="block text-sm font-medium text-gray-700">
                Setup Key
              </label>
              <input
                id="setupKey"
                name="setupKey"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter setup key"
                value={formData.setupKey}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="admin@starcast.co.za"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up...
                  </div>
                ) : (
                  'Create Admin User'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500 text-center">
              This setup can only be used once. After creating the admin user,
              this endpoint will be disabled for security.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}