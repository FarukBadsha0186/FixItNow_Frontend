"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function PaymentCancelContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('bookingId')
    setBookingId(id)
    setLoading(false)

    const timer = setTimeout(() => {
      router.push('/customer_dashboard')
    }, 10000)

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
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was not completed. You can try again.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {bookingId && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Booking ID: <span className="font-medium text-foreground">#{bookingId.slice(0, 8)}</span>
              </p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <p className="text-sm text-yellow-800">
              💡 Your booking is still active. You can retry payment from your dashboard.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            You will be redirected to your dashboard in a few seconds.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Link href="/customer_dashboard" className="w-full">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          {bookingId && (
            <Link href={`/customer_dashboard/bookings/${bookingId}/pay`} className="w-full">
              <Button variant="outline" className="w-full">Retry Payment</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}