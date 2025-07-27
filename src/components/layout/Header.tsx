'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/auth-schemas'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

const Header = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Check user authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession()
        if (session && 'data' in session && session.data?.user) {
          const userData = session.data.user
          setUser({
            id: userData.id,
            firstName: userData.name?.split(' ')[0] || '',
            lastName: userData.name?.split(' ').slice(1).join(' ') || '',
            email: userData.email
          })
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Handle login submission
  const onSubmit = async (data: LoginFormData) => {
    setIsLoggingIn(true)
    setLoginError('')
    
    try {
      const { error: authError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })
      
      if (authError) {
        setLoginError('Invalid email or password')
        return
      }
      
      // Refresh user state after successful login
      const session = await authClient.getSession()
      if (session && 'data' in session && session.data?.user) {
        const userData = session.data.user
        setUser({
          id: userData.id,
          firstName: userData.name?.split(' ')[0] || '',
          lastName: userData.name?.split(' ').slice(1).join(' ') || '',
          email: userData.email
        })
        setShowLoginModal(false)
        reset()
        router.push('/dashboard')
      }
      
    } catch (err) {
      console.error('Login error:', err)
      setLoginError('An error occurred during login. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await authClient.signOut()
      setUser(null)
      setShowUserMenu(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Starcast
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                href="/fibre" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Fibre
              </Link>
              <Link 
                href="/lte" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                LTE
              </Link>
              <Link 
                href="/lte-5g" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                LTE-5G
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              
              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.firstName?.[0] || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.firstName || 'User'}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/bills" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Bills & Payments
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Login Button */
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Sign In'}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/fibre" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Fibre
                </Link>
                <Link 
                  href="/lte" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  LTE
                </Link>
                <Link 
                  href="/lte-5g" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  LTE-5G
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <button
                onClick={() => {
                  setShowLoginModal(false)
                  setLoginError('')
                  reset()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="mt-1"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {loginError}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Create Account
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                <Link href="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showLoginModal) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false)
            if (!showLoginModal) {
              setShowLoginModal(false)
              setLoginError('')
              reset()
            }
          }}
        />
      )}
    </>
  )
}

export default Header