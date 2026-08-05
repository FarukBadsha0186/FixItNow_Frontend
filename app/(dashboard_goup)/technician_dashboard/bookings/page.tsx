"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  getBookings, 
  acceptBooking, 
  declineBooking,
  markInProgress,
  markCompleted,
  Booking
} from "../technician_action/bookings"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, CheckCircle, XCircle, PlayCircle, CheckCircle2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// ============================================
// Types & Constants
// ============================================

const STATUS_ACTIONS: Record<string, string[]> = {
  REQUESTED: ['ACCEPTED', 'DECLINED'],
  ACCEPTED: [],
  DECLINED: [],
  PAID: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: []
}

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  DECLINED: "bg-red-100 text-red-800",
  PAID: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-gray-100 text-gray-800",
}

// ============================================
// Main Component
// ============================================

export default function TechnicianBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ✅ Fetch bookings
  const fetchBookings = async () => {
    try {
      setError(null)
      const result = await getBookings()
      if (result.success) {
        setBookings(result.data || [])
      } else {
        setError(result.message || "Failed to load bookings")
        toast.error(result.message || "Failed to load bookings")
      }
    } catch (error) {
      const errorMsg = "Failed to load bookings"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // ✅ Generic handler for all actions
  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    if (processingId) return // Prevent multiple clicks

    setProcessingId(bookingId)
    try {
      let result

      switch (newStatus) {
        case 'ACCEPTED':
          result = await acceptBooking(bookingId)
          break
        case 'DECLINED':
          result = await declineBooking(bookingId)
          break
        case 'IN_PROGRESS':
          result = await markInProgress(bookingId)
          break
        case 'COMPLETED':
          result = await markCompleted(bookingId)
          break
        default:
          throw new Error(`Unknown status: ${newStatus}`)
      }

      if (result.success) {
        toast.success(result.message || `Status updated to ${newStatus}`)
        
        // ✅ Optimistic update + refetch
        setBookings(prev =>
          prev.map(b => b.id === bookingId ? { ...b, status: newStatus as any } : b)
        )
        
        // Refetch to sync with backend
        setTimeout(() => fetchBookings(), 500)
      } else {
        toast.error(result.message || `Failed to update status`)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Render action buttons based on status
  const renderActionButtons = (booking: Booking) => {
    const allowedActions = STATUS_ACTIONS[booking.status as keyof typeof STATUS_ACTIONS] || []

    return (
      <div className="flex gap-2 flex-wrap">
        {allowedActions.includes('ACCEPTED') && (
          <Button
            size="sm"
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}
            disabled={processingId === booking.id}
          >
            {processingId === booking.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-1" />
            )}
            Accept
          </Button>
        )}

        {allowedActions.includes('DECLINED') && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleStatusUpdate(booking.id, 'DECLINED')}
            disabled={processingId === booking.id}
          >
            {processingId === booking.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4 mr-1" />
            )}
            Decline
          </Button>
        )}

        {allowedActions.includes('IN_PROGRESS') && (
          <Button
            size="sm"
            variant="default"
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => handleStatusUpdate(booking.id, 'IN_PROGRESS')}
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

        {allowedActions.includes('COMPLETED') && (
          <Button
            size="sm"
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
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

        {allowedActions.length === 0 && (
          <span className="text-xs text-muted-foreground">No actions available</span>
        )}
      </div>
    )
  }

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    )
  }

  // ============================================
  // Render
  // ============================================

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push("/technician_dashboard/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
          <p className="text-muted-foreground">View and manage all your bookings</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={fetchBookings}
              className="ml-auto"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bookings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
          <CardDescription>
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold">Service</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{booking.customer?.name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{booking.customer?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{booking.service?.title || "N/A"}</td>
                      <td className="py-3 px-4">
                        {new Date(booking.scheduledAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        ${booking.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={STATUS_COLORS[booking.status] || "bg-gray-100"}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {renderActionButtons(booking)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
