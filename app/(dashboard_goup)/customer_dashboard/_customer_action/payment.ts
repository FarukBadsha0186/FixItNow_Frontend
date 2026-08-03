"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// ✅ Get Token
const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}

// ✅ Get Payment History (Already Done)
export async function getPayments() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    const data = await res.json()
    return { success: true, data: data.data || [] }

  } catch (error) {
    console.error("Error fetching payments:", error)
    return { success: false, message: "Failed to load payments" }
  }
}

// ✅ NEW: Create Payment
export async function createPayment(bookingId: string) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    if (!bookingId) {
      return { success: false, message: "Booking ID is required" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/create`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      return { success: false, message: result.message || "Failed to create payment" }
    }

    // ✅ Return payment URL (Stripe/SSLCommerz)
    return {
      success: true,
      data: result.data,
      message: "Payment initiated successfully",
    }

  } catch (error) {
    console.error("Error creating payment:", error)
    return { success: false, message: "Something went wrong" }
  }
}

// ✅ NEW: Confirm Payment (Optional - for webhook fallback)
export async function confirmPayment(paymentId: string) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/confirm`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId }),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      return { success: false, message: result.message || "Payment confirmation failed" }
    }

    revalidatePath("/customer_dashboard")
    revalidatePath("/customer_dashboard/payments")

    return {
      success: true,
      data: result.data,
      message: "Payment confirmed successfully",
    }

  } catch (error) {
    console.error("Error confirming payment:", error)
    return { success: false, message: "Something went wrong" }
  }
}