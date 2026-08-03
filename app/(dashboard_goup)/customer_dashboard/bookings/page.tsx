"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserBookings, cancelBooking } from "../_customer_action/booking"

import { BookingHistory } from "../_components/booking"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const result = await getUserBookings()
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
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (bookingId: string) => {
    const result = await cancelBooking(bookingId)
    if (result.success) {
      toast.success(result.message)
      await fetchBookings()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/customer_dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
          <p className="text-muted-foreground">View and manage all your bookings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>All your bookings in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <BookingHistory
            bookings={bookings}
            onCancel={handleCancel}
            isLoading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}