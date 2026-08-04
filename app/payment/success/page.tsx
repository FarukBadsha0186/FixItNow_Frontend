

// "use client"

// import { useEffect, useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { CheckCircle, Loader2 } from "lucide-react"
// import { confirmPayment } from "../../(dashboard_goup)/customer_dashboard/_customer_action/payment"
// import { toast } from "sonner"

// export default function PaymentSuccessPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const sessionId = searchParams.get("session_id")
//   const bookingId = searchParams.get("bookingId")

//   const [confirming, setConfirming] = useState(true)
//   const [confirmed, setConfirmed] = useState(false)

//   useEffect(() => {
//     const confirmPaymentHandler = async () => {
//       if (!sessionId) {
//         setConfirming(false)
//         return
//       }

//       try {
//         console.log("📌 Starting payment confirmation...")
        
//         const result = await confirmPayment(sessionId)
//         console.log("📌 Confirm Result:", result)

//         if (result.success) {
//           console.log("✅ Payment confirmed successfully!")
//           setConfirmed(true)
//           toast.success("Payment confirmed!")
          
//           // ✅ Redirect with refresh parameter
//           const timer = setTimeout(() => {
//             router.push("/customer_dashboard/bookings?refresh=true")
//           }, 2000)

//           return () => clearTimeout(timer)
//         } else {
//           console.error("❌ Confirmation failed:", result.message)
//           toast.error(result.message || "Failed to confirm payment")
//           setConfirming(false)
//         }
//       } catch (error) {
//         console.error("❌ Error confirming payment:", error)
//         toast.error("Something went wrong")
//         setConfirming(false)
//       }
//     }

//     confirmPaymentHandler()
//   }, [sessionId, bookingId, router])

  
// }

import { Suspense } from 'react'
import PaymentSuccessContent from './PaymentSuccessContent'

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-4 text-muted-foreground">Loading payment confirmation...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}