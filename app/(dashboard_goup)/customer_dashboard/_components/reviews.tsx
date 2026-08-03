"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ReviewFormProps {
  bookingId: string
  onSubmit: (data: { bookingId: string; rating: number; comment: string }) => Promise<void>
  onSuccess?: () => void
}

export function ReviewForm({ bookingId, onSubmit, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (comment.trim().length < 3) {
      toast.error('Please provide a review (minimum 3 characters)')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        bookingId,
        rating,
        comment: comment.trim(),
      })
      setRating(0)
      setComment('')
      onSuccess?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="mb-2 block">Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  (hoveredRating || rating) >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating > 0 ? `${rating} of 5` : 'Select rating'}
          </span>
        </div>
      </div>

      <div>
        <Label htmlFor="review" className="mb-2 block">
          Your Review *
        </Label>
        <Textarea
          id="review"
          placeholder="Share your experience with the service..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {comment.length}/500 characters
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </Button>
    </form>
  )
}