"use client"

import { useState, useEffect } from 'react'
import { toast } from "sonner"
import { BookingsPage, FilterStatus } from '../../technician_dashboard/technician_components/_booking' 
import {
  getBookings,
  acceptBooking,
  declineBooking,
  markInProgress,
  markCompleted,
  getBookingStats,
} from '../../technician_dashboard/technician_action/bookings'


import type { Booking } from '../../technician_dashboard/technician_action/bookings'

// ✅ Define stats type
interface BookingStats {
  total: number
  requested: number
  accepted: number
  inProgress: number
  completed: number
  cancelled: number
  declined: number
}

export default function BookingsRoute() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<BookingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL')

  const fetchBookings = async (status?: string) => {
    setLoading(true)
    try {
      const [bookingsResult, statsResult] = await Promise.all([
        getBookings(status),
        getBookingStats()
      ])

      if (bookingsResult.success) {
        setBookings(bookingsResult.data || [])
      } else {
        toast.error(bookingsResult.message || 'Failed to load bookings')
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data)
      }
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings(filterStatus === 'ALL' ? undefined : filterStatus)
  }, [filterStatus])

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    let action
    switch (status) {
      case 'ACCEPTED':
        action = acceptBooking(bookingId)
        break
      case 'DECLINED':
        action = declineBooking(bookingId)
        break
      case 'IN_PROGRESS':
        action = markInProgress(bookingId)
        break
      case 'COMPLETED':
        action = markCompleted(bookingId)
        break
      default:
        return
    }

    const result = await action
    if (result.success) {
      toast.success(result.message)
      fetchBookings(filterStatus === 'ALL' ? undefined : filterStatus)
    } else {
      toast.error(result.message)
    }
  }

  // ✅ Handle filter change with proper type
  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <BookingsPage 
      bookings={bookings}
      onUpdateStatus={handleUpdateStatus}
      onFilterChange={handleFilterChange}  // ✅ Now matches type
      currentFilter={filterStatus}
    />
  )
}