"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  DollarSign, 
  ArrowLeft,
  Loader2 
} from "lucide-react"
import { getBookingById } from "../../_customer_action/booking"
import { toast } from "sonner"

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

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const result = await getBookingById(bookingId)
        if (result.success) {
          setBooking(result.data)
        } else {
          toast.error(result.message || "Booking not found")
          router.push("/customer_dashboard")
        }
      } catch (error) {
        toast.error("Failed to load booking")
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [bookingId, router])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Booking not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/customer_dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.push("/customer_dashboard")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground">Booking #{booking.id.slice(0, 8)}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Main Details */}
      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
          <CardDescription>Details about your booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Technician</p>
                <p className="font-medium">{booking.technician?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">${booking.totalAmount?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(booking.scheduledAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{formatTime(booking.scheduledAt)}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{booking.address || 'N/A'}</p>
            </div>
          </div>

          {booking.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium">{booking.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        {booking.status === 'ACCEPTED' && (
          <Link href={`/customer_dashboard/bookings/${booking.id}/pay`}>
            <Button className="bg-green-600 hover:bg-green-700">
              Pay Now
            </Button>
          </Link>
        )}

        {booking.status === 'COMPLETED' && (
          <Link href={`/customer_dashboard/reviews?bookingId=${booking.id}`}>
            <Button>Leave Review</Button>
          </Link>
        )}

        {['REQUESTED', 'ACCEPTED'].includes(booking.status) && (
          <Button variant="destructive">
            Cancel Booking
          </Button>
        )}
      </div>
    </div>
  )
}