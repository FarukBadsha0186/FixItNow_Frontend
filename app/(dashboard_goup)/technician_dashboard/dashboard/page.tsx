"use client"

import { useState, useEffect } from 'react'
import { DashboardOverview } from '../../technician_dashboard/technician_components/_dasboard'
import { getDashboardData } from '../../technician_dashboard/technician_action/dashboard'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

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
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getDashboardData()
        console.log("📊 Dashboard result:", result)
        
        if (result.success && result.data) {
          setData(result.data)
        } else {
          setError(result.message || 'Failed to load dashboard')
          toast.error(result.message || 'Failed to load dashboard')
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Something went wrong'
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-lg font-semibold">⚠️ Error</div>
        <p className="text-muted-foreground mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Retry
        </button>
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