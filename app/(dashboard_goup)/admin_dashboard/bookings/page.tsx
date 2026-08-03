"use client"

import { useState, useEffect } from "react"
import { getAdminBookings } from "../_actions/admin.action"
import { BookingTable } from "../_components/BookingTable"
import { toast } from "sonner"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      try {
        const result = await getAdminBookings()
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
    fetchBookings()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
        <p className="text-muted-foreground">View and manage all platform bookings</p>
      </div>

      <BookingTable bookings={bookings} isLoading={loading} />
    </div>
  )
}