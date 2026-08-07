
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, DollarSign, CheckCircle, Eye, Loader2, CheckCircle as CheckIcon, XCircle, PlayCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  acceptBooking, 
  declineBooking, 
  markInProgress, 
  markCompleted 
} from "../technician_action/bookings"

interface DashboardOverviewProps {
  profile: any
  stats: {
    pendingRequests: number
    upcomingJobs: number
    completedJobs: number
    totalEarnings: number
  }
  recentBookings: any[]
  onStatusUpdate?: () => void
}

const statusColors: Record<string, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  DECLINED: "bg-red-100 text-red-800",
  PAID: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-gray-100 text-gray-800",
}

export function DashboardOverview({ 
  profile, 
  stats, 
  recentBookings: initialBookings,
  onStatusUpdate 
}: DashboardOverviewProps) {
  const [recentBookings, setRecentBookings] = useState(initialBookings)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [localStats, setLocalStats] = useState(stats)

  useEffect(() => {
    setRecentBookings(initialBookings)
    setLocalStats(stats)
  }, [initialBookings, stats])

  const statItems = [
    {
      title: "Pending Requests",
      value: localStats.pendingRequests || 0,
      icon: Users,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Upcoming Jobs",
      value: localStats.upcomingJobs || 0,
      icon: Calendar,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Completed Jobs",
      value: localStats.completedJobs || 0,
      icon: CheckCircle,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Total Earnings",
      value: `$${localStats.totalEarnings?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: "bg-purple-100 text-purple-800",
    },
  ]

  const updateStats = (bookings: any[]) => {
    const newStats = {
      pendingRequests: bookings.filter((b: any) => b.status === 'REQUESTED').length,
      upcomingJobs: bookings.filter((b: any) => b.status === 'ACCEPTED' || b.status === 'PAID').length,
      completedJobs: bookings.filter((b: any) => b.status === 'COMPLETED').length,
      totalEarnings: bookings
        .filter((b: any) => b.status === 'COMPLETED')
        .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0)
    }
    setLocalStats(newStats)
  }

  const refreshData = async () => {
    if (onStatusUpdate) {
      onStatusUpdate()
    }
  }

  // ✅ Handle Accept
  const handleAccept = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const result = await acceptBooking(bookingId)
      if (result.success) {
        toast.success("Booking accepted")
        const updatedBookings = recentBookings.map(b => 
          b.id === bookingId ? { ...b, status: 'ACCEPTED' } : b
        )
        setRecentBookings(updatedBookings)
        updateStats(updatedBookings)
        await refreshData()
      } else {
        toast.error(result.message || "Failed to accept")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Handle Decline
  const handleDecline = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const result = await declineBooking(bookingId)
      if (result.success) {
        toast.success("Booking declined")
        const updatedBookings = recentBookings.map(b => 
          b.id === bookingId ? { ...b, status: 'DECLINED' } : b
        )
        setRecentBookings(updatedBookings)
        updateStats(updatedBookings)
        await refreshData()
      } else {
        toast.error(result.message || "Failed to decline")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Handle Start Job (PAID → IN_PROGRESS)
  const handleStartJob = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const result = await markInProgress(bookingId)
      if (result.success) {
        toast.success("Job started")
        const updatedBookings = recentBookings.map(b => 
          b.id === bookingId ? { ...b, status: 'IN_PROGRESS' } : b
        )
        setRecentBookings(updatedBookings)
        updateStats(updatedBookings)
        await refreshData()
      } else {
        toast.error(result.message || "Failed to start job")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Handle Complete (IN_PROGRESS → COMPLETED)
  const handleComplete = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const result = await markCompleted(bookingId)
      if (result.success) {
        toast.success("Job completed")
        const updatedBookings = recentBookings.map(b => 
          b.id === bookingId ? { ...b, status: 'COMPLETED' } : b
        )
        setRecentBookings(updatedBookings)
        updateStats(updatedBookings)
        await refreshData()
      } else {
        toast.error(result.message || "Failed to complete")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.user?.name || 'Technician'}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <div className={`p-2 rounded-full ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings - Table Style */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your latest booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground">No recent bookings</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">#</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking: any, index: number) => (
                    <tr key={booking.id} className="border-b border-border hover:bg-gray-50">
                      <td className="py-3 px-4 text-xs text-gray-400">{index + 1}</td>
                      <td className="py-3 px-4">{booking.customer?.name || "N/A"}</td>
                      <td className="py-3 px-4">{booking.service?.title || "N/A"}</td>
                      <td className="py-3 px-4">
                        {new Date(booking.scheduledAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">${booking.totalAmount?.toFixed(2) || "0.00"}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[booking.status] || "bg-gray-100"}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          {/* REQUESTED → Accept / Decline */}
                          {booking.status === 'REQUESTED' && (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleAccept(booking.id)}
                                disabled={processingId === booking.id}
                              >
                                {processingId === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckIcon className="h-4 w-4 mr-1" />
                                )}
                                Accept
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDecline(booking.id)}
                                disabled={processingId === booking.id}
                              >
                                {processingId === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-1" />
                                )}
                                Decline
                              </Button>
                            </>
                          )}

                          {/* PAID → Start Job */}
                          {booking.status === 'PAID' && (
                            <Button
                              type="button"
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={() => handleStartJob(booking.id)}
                              disabled={processingId === booking.id}
                            >
                              {processingId === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <PlayCircle className="h-4 w-4 mr-1" />
                              )}
                              Start Job
                            </Button>
                          )}

                          {/* IN_PROGRESS → Complete */}
                          {booking.status === 'IN_PROGRESS' && (
                            <Button
                              type="button"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleComplete(booking.id)}
                              disabled={processingId === booking.id}
                            >
                              {processingId === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                              )}
                              Complete
                            </Button>
                          )}

                          {/* COMPLETED → Show only badge */}
                          {booking.status === 'COMPLETED' && (
                            <Badge className="bg-emerald-100 text-emerald-800">
                              Completed ✅
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 flex gap-2 flex-wrap">
            <Link href="/technician_dashboard/bookings" className="flex-1 min-w-[120px]">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-1" />
                View All Bookings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}