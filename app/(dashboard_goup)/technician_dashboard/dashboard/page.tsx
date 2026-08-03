"use client"

import { useState, useEffect } from 'react'
import { DashboardOverview } from '../../technician_dashboard/technician_components/_dasboard'
import { getDashboardData } from '../../technician_dashboard/technician_action/dashboard'
import { toast } from 'sonner'

// ✅ Define type for dashboard data
interface DashboardData {
  profile: any
  stats: {
    pendingRequests: number
    upcomingJobs: number
    completedJobs: number
    totalEarnings: number
  }
  recentBookings: any[]
}

export default function TechnicianDashboardPage() {
  // ✅ Add proper type: DashboardData | null
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData()
        if (result.success) {
          // ✅ Use nullish coalescing to handle undefined
          setData(result.data ?? null)
        } else {
          toast.error(result.message || 'Failed to load dashboard')
          setData(null)
        }
      } catch (error) {
        toast.error('Failed to load dashboard')
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No dashboard data available</p>
      </div>
    )
  }

  return (
    <DashboardOverview
      profile={data.profile || {
        id: '',
        bio: null,
        experience: 0,
        hourlyRate: 0,
        location: null,
        avgRating: 0,
        totalReviews: 0,
        isAvailable: false,
        user: { name: 'Technician', email: '' }
      }}
      stats={data.stats || {
        pendingRequests: 0,
        upcomingJobs: 0,
        completedJobs: 0,
        totalEarnings: 0
      }}
      recentBookings={data.recentBookings || []}
    />
  )
}