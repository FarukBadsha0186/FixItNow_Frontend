"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// ✅ Get Token
const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}

// ✅ Get User's Bookings (Already Done)
export async function getUserBookings() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/bookings`,
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
    console.error("Error fetching bookings:", error)
    return { success: false, message: "Failed to load bookings" }
  }
}

// ✅ Cancel Booking (Already Done)
export async function cancelBooking(bookingId: string) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/bookings/${bookingId}/cancel`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to cancel booking" }
    }

    revalidatePath("/customer_dashboard")
    return { success: true, message: "Booking cancelled successfully" }

  } catch (error) {
    console.error("Error cancelling booking:", error)
    return { success: false, message: "Something went wrong" }
  }
}

// ✅ NEW: Create Booking
export async function createBooking(data: {
  technicianId: string
  serviceId: string
  scheduledAt: string
  address: string
  notes?: string
}) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    // ✅ Validate input
    if (!data.technicianId || !data.serviceId || !data.scheduledAt) {
      return { success: false, message: "Missing required fields" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/bookings`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          technicianId: data.technicianId,
          serviceId: data.serviceId,
          scheduledAt: data.scheduledAt,
          address: data.address,
          notes: data.notes || "",
        }),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      return { success: false, message: result.message || "Failed to create booking" }
    }

    revalidatePath("/customer_dashboard")
    revalidatePath("/customer_dashboard/bookings")
    revalidatePath("/customer_dashboard")
     revalidatePath("/customer_dashboard/bookings")

    return {
      success: true,
      data: result.data,
      message: "Booking created successfully! Waiting for technician acceptance."
    }

  } catch (error) {
    console.error("Error creating booking:", error)
    return { success: false, message: "Something went wrong" }
  }
}

// ✅ NEW: Get Single Booking by ID
export async function getBookingById(bookingId: string) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/bookings/${bookingId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch booking" }
    }

    return { success: true, data: data.data }

  } catch (error) {
    console.error("Error fetching booking:", error)
    return { success: false, message: "Failed to load booking" }
  }
}


