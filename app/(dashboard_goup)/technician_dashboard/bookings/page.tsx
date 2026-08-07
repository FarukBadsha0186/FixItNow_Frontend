"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  getBookings, 
  acceptBooking, 
  declineBooking,
  markInProgress,
  markCompleted 
} from "../technician_action/bookings"
import { BookingsComponent } from "../technician_components/_bookings"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Load bookings
  const loadBookings = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getBookings()
      if (result.success) {
        setBookings(result.data || [])
      } else {
        toast.error(result.message || "Failed to load bookings")
      }
    } catch (error) {
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  // ✅ Refresh without loading state
  const refreshBookings = useCallback(async () => {
    try {
      const result = await getBookings()
      if (result.success) {
        setBookings(result.data || [])
      }
    } catch (error) {
      console.error("Refresh failed:", error)
    }
    router.refresh()
  }, [router])

  // ✅ Accept Booking
  const handleAccept = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const result = await acceptBooking(bookingId)
      if (result.success) {
        toast.success("Booking accepted")
        // Optimistic update
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'ACCEPTED' } : b
        ))
        await refreshBookings()
      } else {
        toast.error(result.message || "Failed to accept")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Decline Booking
  const handleDecline = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const result = await declineBooking(bookingId)
      if (result.success) {
        toast.success("Booking declined")
        // Optimistic update
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'DECLINED' } : b
        ))
        await refreshBookings()
      } else {
        toast.error(result.message || "Failed to decline")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Start Job
  const handleStartJob = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const result = await markInProgress(bookingId)
      if (result.success) {
        toast.success("Job started")
        // Optimistic update
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'IN_PROGRESS' } : b
        ))
        await refreshBookings()
      } else {
        toast.error(result.message || "Failed to start job")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Complete Job
  const handleComplete = async (bookingId: string) => {
    setProcessingId(bookingId)
    try {
      const result = await markCompleted(bookingId)
      if (result.success) {
        toast.success("Job completed")
        // Optimistic update
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'COMPLETED' } : b
        ))
        await refreshBookings()
      } else {
        toast.error(result.message || "Failed to complete")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push("/technician_dashboard/dashboard")}
          type="button"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
          <p className="text-muted-foreground">View and manage all your bookings</p>
        </div>
      </div>

      <BookingsComponent
        bookings={bookings}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onStartJob={handleStartJob}
        onComplete={handleComplete}
        processingId={processingId}
      />
    </div>
  )
}