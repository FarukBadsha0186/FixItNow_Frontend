// "use client"

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { CheckCircle } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import Link from 'next/link'

// export default function PaymentSuccessContent() {
//   const router = useRouter()

//   useEffect(() => {
//     // ✅ Auto redirect after 3 seconds
//     const timer = setTimeout(() => {
//       router.push('/customer_dashboard')
//     }, 3000)

//     return () => clearTimeout(timer)
//   }, [router])

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <Card className="w-full max-w-md text-center">
//         <CardHeader>
//           <div className="flex justify-center mb-4">
//             <div className="rounded-full bg-green-100 p-3">
//               <CheckCircle className="h-12 w-12 text-green-600" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl">Payment Successful! 🎉</CardTitle>
//           <CardDescription>
//             Your payment has been processed successfully.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <p className="text-sm text-muted-foreground">
//             Redirecting to dashboard...
//           </p>
//         </CardContent>

//         <CardFooter>
//           <Link href="/customer_dashboard" className="w-full">
//             <Button className="w-full">Go to Dashboard</Button>
//           </Link>
//         </CardFooter>
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
import { confirmPayment } from "../../_customer_action/payment"

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
        console.log("📌 Confirming payment with sessionId:", sessionId)
        
        // ✅ Call confirmPayment
        const result = await confirmPayment(sessionId)
        
        console.log("✅ Payment confirmed:", result)

        if (result.success) {
          setConfirmed(true)
          
          // ✅ Redirect to dashboard after 2 seconds
          const timer = setTimeout(() => {
            router.push("/customer_dashboard")
          }, 2000)

          return () => clearTimeout(timer)
        } else {
          console.error("❌ Confirmation failed:", result.message)
        }
      } catch (error) {
        console.error("❌ Error confirming payment:", error)
      } finally {
        setConfirming(false)
      }
    }

    confirmPaymentHandler()
  }, [sessionId, router])

  if (confirming) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <CardTitle>Processing Payment</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Please wait while we confirm your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Payment Successful! ✅</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your payment has been processed and confirmed.
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded break-all">
              Session: {sessionId.slice(0, 30)}...
            </p>
          )}
          {bookingId && (
            <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded break-all">
              Booking: {bookingId}
            </p>
          )}
          <p className="text-sm font-medium text-amber-600">
            Redirecting to dashboard in 2 seconds...
          </p>
          <Button 
            onClick={() => router.push("/customer_dashboard")}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Go to Dashboard Now
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}