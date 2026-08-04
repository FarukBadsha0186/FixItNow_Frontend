// // // // import { Suspense } from 'react'
// // // // import PaymentSuccessContent from './PaymentSuccessContent'

// // // // export default function PaymentSuccessPage() {
// // // //   return (
// // // //     <Suspense fallback={
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
// // // //       </div>
// // // //     }>
// // // //       <PaymentSuccessContent />
// // // //     </Suspense>
// // // //   )
// // // // }

// // // "use client"

// // // import { useEffect, useState } from "react"
// // // import { useRouter, useSearchParams } from "next/navigation"
// // // import { Button } from "@/components/ui/button"
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { CheckCircle, Loader2 } from "lucide-react"
// // // import { confirmPayment } from "../../(dashboard_goup)/customer_dashboard/_customer_action/payment"

// // // export default function PaymentSuccessPage() {
// // //   const router = useRouter()
// // //   const searchParams = useSearchParams()
// // //   const sessionId = searchParams.get("session_id")
// // //   const bookingId = searchParams.get("bookingId")

// // //   const [confirming, setConfirming] = useState(true)
// // //   const [confirmed, setConfirmed] = useState(false)

// // //   useEffect(() => {
// // //     const confirmPaymentHandler = async () => {
// // //       if (!sessionId) {
// // //         setConfirming(false)
// // //         return
// // //       }

// // //       try {
// // //         console.log("📌 Confirming payment with sessionId:", sessionId)
        
// // //         // ✅ Call confirmPayment
// // //         const result = await confirmPayment(sessionId)
        
// // //         console.log("✅ Payment confirmed:", result)

// // //         if (result.success) {
// // //           setConfirmed(true)
          
// // //           // ✅ Redirect to dashboard after 2 seconds
// // //           const timer = setTimeout(() => {
// // //             router.push("/customer_dashboard")
// // //           }, 2000)

// // //           return () => clearTimeout(timer)
// // //         } else {
// // //           console.error("❌ Confirmation failed:", result.message)
// // //         }
// // //       } catch (error) {
// // //         console.error("❌ Error confirming payment:", error)
// // //       } finally {
// // //         setConfirming(false)
// // //       }
// // //     }

// // //     confirmPaymentHandler()
// // //   }, [sessionId, router])

// // //   if (confirming) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-screen">
// // //         <Card className="w-full max-w-md mx-4">
// // //           <CardHeader className="text-center">
// // //             <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
// // //             <CardTitle>Processing Payment</CardTitle>
// // //           </CardHeader>
// // //           <CardContent className="text-center">
// // //             <p className="text-muted-foreground">
// // //               Please wait while we confirm your payment...
// // //             </p>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
// // //       <Card className="w-full max-w-md mx-4">
// // //         <CardHeader className="text-center">
// // //           <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
// // //           <CardTitle className="text-2xl">Payment Successful! ✅</CardTitle>
// // //         </CardHeader>
// // //         <CardContent className="text-center space-y-4">
// // //           <p className="text-muted-foreground">
// // //             Your payment has been processed and confirmed.
// // //           </p>
// // //           {sessionId && (
// // //             <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded break-all">
// // //               Session: {sessionId.slice(0, 30)}...
// // //             </p>
// // //           )}
// // //           {bookingId && (
// // //             <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded break-all">
// // //               Booking: {bookingId}
// // //             </p>
// // //           )}
// // //           <p className="text-sm font-medium text-amber-600">
// // //             Redirecting to dashboard in 2 seconds...
// // //           </p>
// // //           <Button 
// // //             onClick={() => router.push("/customer_dashboard")}
// // //             className="w-full bg-green-600 hover:bg-green-700"
// // //           >
// // //             Go to Dashboard Now
// // //           </Button>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   )
// // // }

// // "use client"

// // import { useEffect, useState } from "react"
// // import { useRouter, useSearchParams } from "next/navigation"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { CheckCircle, Loader2 } from "lucide-react"
// // import { confirmPayment } from "../../(dashboard_goup)/customer_dashboard/_customer_action/payment"
// // import { toast } from "sonner"

// // export default function PaymentSuccessPage() {
// //   const router = useRouter()
// //   const searchParams = useSearchParams()
// //   const sessionId = searchParams.get("session_id")
// //   const bookingId = searchParams.get("bookingId")

// //   const [confirming, setConfirming] = useState(true)
// //   const [confirmed, setConfirmed] = useState(false)

// //   useEffect(() => {
// //     const confirmPaymentHandler = async () => {
// //       if (!sessionId) {
// //         console.log("❌ No session ID found")
// //         setConfirming(false)
// //         return
// //       }

// //       try {
// //         console.log("📌 Starting payment confirmation...")
// //         console.log("📌 Session ID:", sessionId)
// //         console.log("📌 Booking ID:", bookingId)
        
// //         // ✅ Call confirmPayment action
// //         const result = await confirmPayment(sessionId)
        
// //         console.log("📌 Confirm Result:", result)

// //         if (result.success) {
// //           console.log("✅ Payment confirmed successfully!")
// //           setConfirmed(true)
// //           toast.success("Payment confirmed!")
          
// //           // ✅ Redirect after 2 seconds
// //           const timer = setTimeout(() => {
// //             router.push("/customer_dashboard")
// //           }, 2000)

// //           return () => clearTimeout(timer)
// //         } else {
// //           console.error("❌ Confirmation failed:", result.message)
// //           toast.error(result.message || "Failed to confirm payment")
// //           setConfirming(false)
// //         }
// //       } catch (error) {
// //         console.error("❌ Error confirming payment:", error)
// //         toast.error("Something went wrong")
// //         setConfirming(false)
// //       }
// //     }

// //     confirmPaymentHandler()
// //   }, [sessionId, bookingId, router])

// //   // ✅ Confirming state
// //   if (confirming) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
// //         <Card className="w-full max-w-md mx-4">
// //           <CardHeader className="text-center">
// //             <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
// //             <CardTitle className="text-xl">Processing Payment</CardTitle>
// //           </CardHeader>
// //           <CardContent className="text-center">
// //             <p className="text-muted-foreground">
// //               Please wait while we confirm your payment...
// //             </p>
// //             {sessionId && (
// //               <p className="text-xs text-muted-foreground mt-4 font-mono break-all">
// //                 {sessionId.slice(0, 30)}...
// //               </p>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>
// //     )
// //   }

// //   // ✅ Success state
// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
// //       <Card className="w-full max-w-md mx-4">
// //         <CardHeader className="text-center">
// //           <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
// //           <CardTitle className="text-3xl">Payment Successful! ✅</CardTitle>
// //         </CardHeader>
// //         <CardContent className="text-center space-y-6">
// //           <div className="bg-green-50 p-4 rounded-lg">
// //             <p className="text-sm text-green-700 font-medium">
// //               ✓ Payment has been confirmed
// //             </p>
// //             <p className="text-sm text-green-600">
// //               Your booking is now confirmed
// //             </p>
// //           </div>

// //           {bookingId && (
// //             <div className="text-xs text-muted-foreground bg-muted p-3 rounded font-mono break-all">
// //               Booking ID: {bookingId}
// //             </div>
// //           )}

// //           <div>
// //             <p className="text-sm font-medium text-amber-600 mb-3">
// //               Redirecting to dashboard in 2 seconds...
// //             </p>
// //             <Button 
// //               onClick={() => router.push("/customer_dashboard")}
// //               className="w-full bg-green-600 hover:bg-green-700 text-white"
// //               size="lg"
// //             >
// //               Go to Dashboard Now
// //             </Button>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }

// // const timer = setTimeout(() => {
  
// //   window.location.href = "/customer_dashboard/bookings"
// // }, 2000)

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
          
//           // ✅ এখানে hard refresh
//           const timer = setTimeout(() => {
//             window.location.href = "/customer_dashboard/bookings"
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
//   }, [sessionId, bookingId])

//   // ✅ Confirming state UI
//   if (confirming) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//         <Card className="w-full max-w-md mx-4">
//           <CardHeader className="text-center">
//             <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//             <CardTitle className="text-xl">Processing Payment</CardTitle>
//           </CardHeader>
//           <CardContent className="text-center">
//             <p className="text-muted-foreground">
//               Please wait while we confirm your payment...
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   // ✅ Success state UI (নিচে)
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
//       <Card className="w-full max-w-md mx-4">
//         <CardHeader className="text-center">
//           <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
//           <CardTitle className="text-3xl">Payment Successful! ✅</CardTitle>
//         </CardHeader>
//         <CardContent className="text-center space-y-6">
//           <div className="bg-green-50 p-4 rounded-lg">
//             <p className="text-sm text-green-700 font-medium">
//               ✓ Payment has been confirmed
//             </p>
//             <p className="text-sm text-green-600">
//               Your booking is now confirmed
//             </p>
//           </div>

//           {bookingId && (
//             <div className="text-xs text-muted-foreground bg-muted p-3 rounded font-mono break-all">
//               Booking ID: {bookingId}
//             </div>
//           )}

//           <div>
//             <p className="text-sm font-medium text-amber-600 mb-3">
//               Redirecting to dashboard in 2 seconds...
//             </p>
//             <Button 
//               onClick={() => window.location.href = "/customer_dashboard/bookings"}
//               className="w-full bg-green-600 hover:bg-green-700 text-white"
//               size="lg"
//             >
//               Go to Dashboard Now
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import { confirmPayment } from "../../(dashboard_goup)/customer_dashboard/_customer_action/payment"
import { toast } from "sonner"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const bookingId = searchParams.get("bookingId")

  const [confirming, setConfirming] = useState(true)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const confirmPaymentHandler = async () => {
      if (!sessionId) {
        setConfirming(false)
        return
      }

      try {
        console.log("📌 Starting payment confirmation...")
        
        const result = await confirmPayment(sessionId)
        console.log("📌 Confirm Result:", result)

        if (result.success) {
          console.log("✅ Payment confirmed successfully!")
          setConfirmed(true)
          toast.success("Payment confirmed!")
          
          // ✅ Redirect with refresh parameter
          const timer = setTimeout(() => {
            router.push("/customer_dashboard/bookings?refresh=true")
          }, 2000)

          return () => clearTimeout(timer)
        } else {
          console.error("❌ Confirmation failed:", result.message)
          toast.error(result.message || "Failed to confirm payment")
          setConfirming(false)
        }
      } catch (error) {
        console.error("❌ Error confirming payment:", error)
        toast.error("Something went wrong")
        setConfirming(false)
      }
    }

    confirmPaymentHandler()
  }, [sessionId, bookingId, router])

  // ... rest same
}