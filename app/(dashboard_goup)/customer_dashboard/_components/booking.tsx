"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Booking {
  id: string
  service: { title: string }
  technician: { name: string; isAvailable?: boolean }
  scheduledAt: string
  status: 'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  totalAmount: number
  address: string
}

interface BookingHistoryProps {
  bookings: Booking[]
  onCancel: (bookingId: string) => Promise<void>
  isLoading?: boolean
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  REQUESTED: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Requested' },
  ACCEPTED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Accepted' },
  DECLINED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' },
  PAID: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Paid' },
  IN_PROGRESS: { bg: 'bg-green-100', text: 'text-green-800', label: 'In Progress' },
  COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completed' },
  CANCELLED: { bg: 'bg-red-900', text: 'text-white', label: 'Cancelled' },
}

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || statusConfig.REQUESTED
  return <Badge className={`${config.bg} ${config.text}`}>{config.label}</Badge>
}

export function BookingHistory({ bookings, onCancel, isLoading = false }: BookingHistoryProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId)
    try {
      await onCancel(bookingId)
    } finally {
      setCancellingId(null)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const canCancel = (status: string) => {
    return ['REQUESTED', 'ACCEPTED'].includes(status)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookings found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium">Service</th>
            <th className="text-left py-3 px-4 font-medium">Technician</th>
            <th className="text-left py-3 px-4 font-medium">Date</th>
            <th className="text-left py-3 px-4 font-medium">Amount</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-left py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">{booking.service?.title || 'N/A'}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span>{booking.technician?.name || 'N/A'}</span>
                  {/* ✅ Technician Availability Badge */}
                  {booking.technician?.isAvailable === false && (
                    <Badge variant="outline" className="text-red-500 border-red-200 text-xs">
                      Unavailable
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">{formatDate(booking.scheduledAt)}</td>
              <td className="py-3 px-4 font-medium">${booking.totalAmount.toFixed(2)}</td>
              <td className="py-3 px-4">
                <StatusBadge status={booking.status} />
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-2">
                  {/* Pay Now Button */}
                  {booking.status === 'ACCEPTED' && (
                    <Link href={`/customer_dashboard/bookings/${booking.id}/pay`}>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Pay Now
                      </Button>
                    </Link>
                  )}

                  {/* Cancel Button */}
                  {canCancel(booking.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      {cancellingId === booking.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Cancel'
                      )}
                    </Button>
                  )}

                  {/* Review Button */}
                  {booking.status === 'COMPLETED' && (
                    <Link href={`/customer_dashboard/reviews?bookingId=${booking.id}`}>
                      <Button size="sm" variant="default">
                        Leave Review
                      </Button>
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookingHistory