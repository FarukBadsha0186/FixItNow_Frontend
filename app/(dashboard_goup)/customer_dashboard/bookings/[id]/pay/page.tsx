// // "use client"

// // import { useState, useEffect } from "react"
// // import { useParams, useRouter } from "next/navigation"
// // import { Button } from "@/components/ui/button"  // ← ETA ADD KORO!
// // import { PaymentForm } from "../../../_components/payment"
// // import { createPayment } from "../../../_customer_action/payment"
// // import { getBookingById } from "../../../_customer_action/booking"
// // import { toast } from "sonner"
// // import { Loader2 } from "lucide-react"

// // export default function PaymentPage() {
// //   const params = useParams()
// //   const router = useRouter()
// //   const bookingId = params.id as string

// //   const [booking, setBooking] = useState<any>(null)
// //   const [loading, setLoading] = useState(true)
// //   const [submitting, setSubmitting] = useState(false)

// //   useEffect(() => {
// //     const fetchBooking = async () => {
// //       try {
// //         const result = await getBookingById(bookingId)
// //         if (result.success) {
// //           setBooking(result.data)
// //         } else {
// //           toast.error(result.message || "Booking not found")
// //           router.push("/customer_dashboard")
// //         }
// //       } catch (error) {
// //         toast.error("Failed to load booking")
// //       } finally {
// //         setLoading(false)
// //       }
// //     }
// //     fetchBooking()
// //   }, [bookingId, router])

// //   const handlePay = async (id: string) => {
// //     setSubmitting(true)
// //     try {
// //       const result = await createPayment(id)
// //       if (result.success && result.data?.paymentUrl) {
// //         // ✅ Redirect to payment gateway
// //         window.location.href = result.data.paymentUrl
// //       } else {
// //         toast.error(result.message || "Payment initiation failed")
// //       }
// //     } catch (error) {
// //       toast.error("Something went wrong")
// //     } finally {
// //       setSubmitting(false)
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[60vh]">
// //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
// //       </div>
// //     )
// //   }

// //   if (!booking) {
// //     return (
// //       <div className="text-center py-12">
// //         <p className="text-muted-foreground">Booking not found</p>
// //       </div>
// //     )
// //   }

// //   // ✅ Only ACCEPTED bookings can be paid
// //   if (booking.status !== 'ACCEPTED') {
// //     return (
// //       <div className="text-center py-12">
// //         <p className="text-muted-foreground">
// //           This booking cannot be paid for. Current status: {booking.status}
// //         </p>
// //         <Button
// //           variant="outline"
// //           className="mt-4"
// //           onClick={() => router.push("/customer_dashboard")}
// //         >
// //           Back to Dashboard
// //         </Button>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="p-4 py-8">
// //       <PaymentForm
// //         bookingId={booking.id}
// //         amount={booking.totalAmount}
// //         serviceName={booking.service?.title || "Service"}
// //         technicianName={booking.technician?.name || "Technician"}
// //         onPay={handlePay}
// //         isLoading={submitting}
// //       />
// //     </div>
// //   )
// // }

// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Loader2, CreditCard, Lock } from "lucide-react"
// import { toast } from "sonner"
// import { createPayment } from "../../../_customer_action/payment"
// import { getBookingById } from "../../../_customer_action/booking"

// export default function PaymentPage() {
//   const params = useParams()
//   const router = useRouter()
//   const bookingId = params.id as string

//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [booking, setBooking] = useState<any>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await getBookingById(bookingId)
//         if (result.success) {
//           setBooking(result.data)
//         } else {
//           toast.error("Booking not found")
//           router.push("/customer_dashboard")
//         }
//       } catch (error) {
//         toast.error("Failed to load booking")
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [bookingId, router])

//   const handlePay = async () => {
//     setSubmitting(true)
//     try {
//       const result = await createPayment(bookingId)
//       console.log("🔍 Payment Result:", result)  // ✅ Debug
      
//       if (result.success && result.data?.paymentUrl) {
//         // ✅ Redirect to Stripe Checkout
//         window.location.href = result.data.paymentUrl
//       } else {
//         toast.error(result.message || "Payment initiation failed")
//       }
//     } catch (error) {
//       console.error("Payment error:", error)
//       toast.error("Something went wrong")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // ... rest of component
// }

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Lock } from "lucide-react"
import { toast } from "sonner"
import { createPayment } from "../../../_customer_action/payment"
import { getBookingById } from "../../../_customer_action/booking"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBookingById(bookingId)
        if (result.success) {
          setBooking(result.data)
        } else {
          toast.error("Booking not found")
          router.push("/customer_dashboard")
        }
      } catch (error) {
        toast.error("Failed to load booking")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [bookingId, router])

  const handlePay = async () => {
    setSubmitting(true)
    try {
      const result = await createPayment(bookingId)
      console.log("🔍 Payment Result:", result)
      
      if (result.success && result.data?.paymentUrl) {
        // ✅ Redirect to Stripe Checkout
        window.location.href = result.data.paymentUrl
      } else {
        toast.error(result.message || "Payment initiation failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
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
        <Button variant="outline" className="mt-4" onClick={() => router.push("/customer_dashboard")}>
          Back to Dashboard
        </Button>
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
        <Button variant="outline" className="mt-4" onClick={() => router.push("/customer_dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </CardTitle>
          <CardDescription>Complete your payment to confirm the booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{booking.service?.title || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Technician</span>
              <span className="font-medium">{booking.technician?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold text-lg text-primary">
                ${booking.totalAmount?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Secure payment via Stripe</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/customer_dashboard")}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePay}
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}