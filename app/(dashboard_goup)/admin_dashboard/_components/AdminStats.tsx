"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX, Calendar, Clock, CheckCircle, DollarSign } from "lucide-react"

// ✅ Make stats optional with default values
interface AdminStatsProps {
  stats?: {
    totalUsers: number
    activeUsers: number
    bannedUsers: number
    totalBookings: number
    pendingBookings: number
    completedBookings: number
    revenue: number
  } | null  // ← Allow null
  isLoading?: boolean
}

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export function AdminStats({ stats, isLoading = false }: AdminStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // ✅ Default values if stats is null/undefined
  const safeStats = {
    totalUsers: stats?.totalUsers ?? 0,
    activeUsers: stats?.activeUsers ?? 0,
    bannedUsers: stats?.bannedUsers ?? 0,
    totalBookings: stats?.totalBookings ?? 0,
    pendingBookings: stats?.pendingBookings ?? 0,
    completedBookings: stats?.completedBookings ?? 0,
    revenue: stats?.revenue ?? 0,
  }

  const statItems = [
    { icon: Users, label: "Total Users", value: safeStats.totalUsers, color: "bg-blue-100 text-blue-600" },
    { icon: UserCheck, label: "Active Users", value: safeStats.activeUsers, color: "bg-green-100 text-green-600" },
    { icon: UserX, label: "Banned Users", value: safeStats.bannedUsers, color: "bg-red-100 text-red-600" },
    { icon: Calendar, label: "Total Bookings", value: safeStats.totalBookings, color: "bg-purple-100 text-purple-600" },
    { icon: Clock, label: "Pending Bookings", value: safeStats.pendingBookings, color: "bg-yellow-100 text-yellow-600" },
    { icon: CheckCircle, label: "Completed Bookings", value: safeStats.completedBookings, color: "bg-emerald-100 text-emerald-600" },
    { icon: DollarSign, label: "Revenue", value: `$${safeStats.revenue.toLocaleString()}`, color: "bg-indigo-100 text-indigo-600" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  )
}