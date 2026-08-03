"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"  // ← ETA ADD KORO!
import { PaymentForm } from "../../../_components/payment"
import { createPayment } from "../../../_customer_action/payment"
import { getBookingById } from "../../../_customer_action/booking"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

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

  const handlePay = async (id: string) => {
    setSubmitting(true)
    try {
      const result = await createPayment(id)
      if (result.success && result.data?.paymentUrl) {
        // ✅ Redirect to payment gateway
        window.location.href = result.data.paymentUrl
      } else {
        toast.error(result.message || "Payment initiation failed")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
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
      </div>
    )
  }

  // ✅ Only ACCEPTED bookings can be paid
  if (booking.status !== 'ACCEPTED') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          This booking cannot be paid for. Current status: {booking.status}
        </p>
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
    <div className="p-4 py-8">
      <PaymentForm
        bookingId={booking.id}
        amount={booking.totalAmount}
        serviceName={booking.service?.title || "Service"}
        technicianName={booking.technician?.name || "Technician"}
        onPay={handlePay}
        isLoading={submitting}
      />
    </div>
  )
}