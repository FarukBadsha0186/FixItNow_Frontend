
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, PlayCircle, CheckCircle2 } from "lucide-react"
import type { Booking } from "../technician_action/bookings"

interface BookingsComponentProps {
  bookings: Booking[]
  onAccept: (id: string) => Promise<void>
  onDecline: (id: string) => Promise<void>
  onStartJob: (id: string) => Promise<void>
  onComplete: (id: string) => Promise<void>
  processingId: string | null
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

export function BookingsComponent({ 
  bookings, 
  onAccept, 
  onDecline, 
  onStartJob, 
  onComplete,
  processingId 
}: BookingsComponentProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
          <CardDescription>All your bookings in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No bookings found.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
        <CardDescription>All your bookings in one place</CardDescription>
      </CardHeader>
      <CardContent>
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
              {bookings.map((booking: Booking, index: number) => (
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
                            onClick={() => onAccept(booking.id)}
                            disabled={processingId === booking.id}
                          >
                            {processingId === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Accept
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => onDecline(booking.id)}
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
                          onClick={() => onStartJob(booking.id)}
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
                          onClick={() => onComplete(booking.id)}
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
                          Completed 
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}