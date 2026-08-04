"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<{ bookingId: string; amount: number } | null>(null)

  useEffect(() => {
    const bookingId = searchParams.get('bookingId')
    const amount = searchParams.get('amount')

    if (bookingId && amount) {
      setPaymentData({ bookingId, amount: parseFloat(amount) })
    }

    setLoading(false)

    // ✅ 5 seconds por auto redirect
    const timer = setTimeout(() => {
      router.push('/customer_dashboard')
    }, 5000)

    return () => clearTimeout(timer)
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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