"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function PaymentCancelContent() {
  const router = useRouter()

  useEffect(() => {
    // ✅ Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/customer_dashboard')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

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

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </CardContent>

        <CardFooter>
          <Link href="/customer_dashboard" className="w-full">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}