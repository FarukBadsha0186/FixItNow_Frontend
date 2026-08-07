"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

//  Get Token
const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}

//  Create Review
export async function createReview(data: {
  bookingId: string
  rating: number
  comment: string
}) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return { success: false, message: "Please provide a valid rating (1-5)" }
    }

    if (!data.comment || data.comment.trim().length < 3) {
      return { success: false, message: "Please provide a review (minimum 3 characters)" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/reviews`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: data.bookingId,
          rating: data.rating,
          comment: data.comment.trim(),
        }),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      return { success: false, message: result.message || "Failed to submit review" }
    }

    revalidatePath("/customer_dashboard")
    return { success: true, message: "Review submitted successfully!" }

  } catch (error) {
    console.error("Error submitting review:", error)
    return { success: false, message: "Something went wrong" }
  }
}