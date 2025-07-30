"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/lib/auth-schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")
    
    try {
      // Use BetterAuth sign-in
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })
      
      if (result.error) {
        setError(result.error.message || "Invalid email or password")
        return
      }
      
      // Check if user has admin role
      if (result.data?.user) {
        // Fetch user details to check role
        const userResponse = await fetch('/api/auth/session', {
          credentials: 'include'
        })
        
        if (userResponse.ok) {
          const sessionData = await userResponse.json()
          if (sessionData.user?.role === 'ADMIN') {
            // Redirect to admin dashboard
            window.location.href = "/admin"
          } else {
            // Regular user - redirect to dashboard
            window.location.href = "/dashboard"
          }
        } else {
          // Fallback redirect
          window.location.href = "/admin"
        }
      }
      
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer Login</h1>
          <p className="text-gray-600 mt-2">Access your bills and support</p>
          <p className="text-sm text-blue-600 mt-1">
            New users: <a href="/register" className="underline">Register first</a>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              autoFocus
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
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Create Account
            </a>
          </p>
          <p className="text-sm text-gray-600">
            Having trouble accessing your account?{" "}
            <a href="/support" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}