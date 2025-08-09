"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/lib/auth-schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithUsername, isAdmin } from "@/lib/auth-utils"

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
      // Use username-based sign-in
      const { data: authData, error: authError } = await signInWithUsername(
        data.username,
        data.password
      )
      
      if (authError) {
        setError(authError.message || "Invalid username or password")
        return
      }
      
      if (authData.user) {
        // Debug: Check user data
        console.log('Login successful - User data:', authData.user)
        console.log('User metadata:', authData.user.user_metadata)
        console.log('User role:', authData.user.user_metadata?.role)
        console.log('Is admin?', isAdmin(authData.user))
        
        // Check if user is admin
        if (isAdmin(authData.user)) {
          console.log('Redirecting to admin dashboard...')
          // Redirect to admin dashboard
          window.location.href = "/admin"
        } else {
          console.log('Redirecting to user dashboard...')
          // Regular user - redirect to dashboard
          window.location.href = "/dashboard"
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="starcastadmin"
              {...register("username")}
              autoFocus
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
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
            Don&apos;t have an account?{" "}
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