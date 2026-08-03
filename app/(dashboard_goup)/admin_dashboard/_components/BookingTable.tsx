"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Booking {
  id: string
  customer: { name: string; email: string }
  technician: { name: string }
  service: { title: string }
  scheduledAt: string
  status: string
  totalAmount: number
}

interface BookingTableProps {
  bookings: Booking[]
  isLoading?: boolean
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  REQUESTED: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Requested" },
  ACCEPTED: { bg: "bg-blue-100", text: "text-blue-800", label: "Accepted" },
  DECLINED: { bg: "bg-red-100", text: "text-red-800", label: "Declined" },
  PAID: { bg: "bg-purple-100", text: "text-purple-800", label: "Paid" },
  IN_PROGRESS: { bg: "bg-indigo-100", text: "text-indigo-800", label: "In Progress" },
  COMPLETED: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
  CANCELLED: { bg: "bg-gray-100", text: "text-gray-800", label: "Cancelled" },
}

export function BookingTable({ bookings, isLoading = false }: BookingTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBookings = bookings.filter((booking) =>
    booking.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.technician?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.service?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading bookings...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <span className="text-sm text-muted-foreground">{filteredBookings.length} bookings found</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Technician</th>
              <th className="px-4 py-3 text-left font-medium">Service</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.REQUESTED

                return (
                  <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{booking.customer?.name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{booking.customer?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{booking.technician?.name || "N/A"}</td>
                    <td className="px-4 py-3">{booking.service?.title || "N/A"}</td>
                    <td className="px-4 py-3">{formatDate(booking.scheduledAt)}</td>
                    <td className="px-4 py-3 font-medium">${booking.totalAmount?.toFixed(2) || "0.00"}</td>
                    <td className="px-4 py-3">
                      <Badge className={status.bg + " " + status.text}>{status.label}</Badge>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}