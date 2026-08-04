"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/customer_dashboard")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Payment Successful! ✅</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your payment has been processed successfully.
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
              {sessionId.slice(0, 30)}...
            </p>
          )}
          <p className="text-sm font-medium text-amber-600">
            Redirecting to dashboard in 3 seconds...
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