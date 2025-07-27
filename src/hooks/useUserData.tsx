import { useState, useEffect } from 'react'

interface Order {
  id: string
  status: string
  originalPrice: number
  discountAmount: number
  finalPrice: number
  installationDate: string | null
  createdAt: string
  updatedAt: string
  package: {
    id: string
    name: string
    type: string
    speed: string | null
    data: string | null
    currentPrice: number
    provider: {
      id: string
      name: string
      slug: string
      logo: string | null
    }
    promotions: Array<{
      id: string
      code: string
      name: string
      discountType: string
      discountValue: number
    }>
  }
  promotion: {
    id: string
    code: string
    name: string
    discountType: string
    discountValue: number
  } | null
}

interface UserProfile {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  name: string | null
  phone: string | null
  address: string | null
  city: string | null
  province: string | null
  postalCode: string | null
  createdAt: string
  active: boolean
}

interface UseUserDataReturn {
  profile: UserProfile | null
  orders: Order[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useUserData(): UseUserDataReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch user profile and orders in parallel
      const [profileResponse, ordersResponse] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/orders')
      ])

      if (!profileResponse.ok || !ordersResponse.ok) {
        if (profileResponse.status === 401 || ordersResponse.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/login'
          return
        }
        throw new Error('Failed to fetch user data')
      }

      const profileData = await profileResponse.json()
      const ordersData = await ordersResponse.json()

      if (profileData.success) {
        setProfile(profileData.data)
      }

      if (ordersData.success) {
        setOrders(ordersData.data)
      }

    } catch (err) {
      console.error('Error fetching user data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return {
    profile,
    orders,
    loading,
    error,
    refetch: fetchUserData
  }
}