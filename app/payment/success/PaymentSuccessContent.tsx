"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { confirmPayment } from '../../(dashboard_goup)/customer_dashboard/_customer_action/payment'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<{ bookingId: string; amount: number } | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const bookingId = searchParams.get('bookingId')
    const amount = searchParams.get('amount')
    const sessionId = searchParams.get('session_id')

    console.log("🔍 Payment Success Params:", { bookingId, amount, sessionId })

    if (bookingId && amount) {
      setPaymentData({ bookingId, amount: parseFloat(amount) })
    }

    // ✅ Confirm payment automatically
    if (sessionId) {
      const confirm = async () => {
        try {
          console.log("📌 Starting payment confirmation with sessionId:", sessionId)
          const result = await confirmPayment(sessionId)
          
          if (result.success) {
            console.log("✅ Payment confirmed:", result)
            setConfirmed(true)
            toast.success("Payment confirmed! 🎉")
            
            // ✅ Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push('/customer_dashboard')
            }, 2000)
          } else {
            console.error("❌ Payment confirmation failed:", result)
            toast.error(result.message || "Payment confirmation failed")
            setLoading(false)
          }
        } catch (error) {
          console.error("❌ Error confirming payment:", error)
          toast.error("Something went wrong")
          setLoading(false)
        }
      }
      confirm()
    } else {
      setLoading(false)
    }

    // ✅ Auto redirect after 5 seconds (fallback)
    const timer = setTimeout(() => {
      if (!confirmed) {
        router.push('/customer_dashboard')
      }
    }, 8000)

    return () => clearTimeout(timer)
  }, [searchParams, router, confirmed])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Processing payment confirmation...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful! 🎉</CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentData && (
            <div className="bg-muted p-4 rounded-lg space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-medium">#{paymentData.bookingId.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-medium">${paymentData.amount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {confirmed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">✅ Payment confirmed! Redirecting to dashboard...</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            You will be redirected to your dashboard in a few seconds.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Link href="/customer_dashboard" className="w-full">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <Link href="/services" className="w-full">
            <Button variant="outline" className="w-full">Browse More Services</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}