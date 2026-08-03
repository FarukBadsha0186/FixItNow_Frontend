"use client"

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createReview } from '../../customer_dashboard/_customer_action/reviews'
import { ReviewForm } from '../../customer_dashboard/_components/reviews'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ReviewsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId')

  const handleSubmit = async (data: { bookingId: string; rating: number; comment: string }) => {
    const result = await createReview(data)
    if (result.success) {
      toast.success(result.message)
      router.push('/customer_dashboard')
    } else {
      toast.error(result.message)
    }
  }

  if (!bookingId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">No booking selected for review.</p>
              <Link href="/customer_dashboard" className="text-primary hover:underline mt-2 inline-block">
                Go to Dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/customer_dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Leave a Review</CardTitle>
          <CardDescription>Share your experience with the service</CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewForm 
            bookingId={bookingId} 
            onSubmit={handleSubmit}
            onSuccess={() => router.push('/customer_dashboard')}
          />
        </CardContent>
      </Card>
    </div>
  )
}