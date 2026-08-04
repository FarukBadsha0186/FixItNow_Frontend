"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function PaymentSuccessContent() {
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
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful! 🎉</CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
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