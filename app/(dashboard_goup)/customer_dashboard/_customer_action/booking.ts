
"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// ✅ Get Token
const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}


export async function getUserBookings() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/customer/bookings`
    console.log("🔗 Fetching bookings:", url)

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    const data = await res.json()
    console.log("📦 Bookings response:", data)

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Failed to fetch bookings"
      }
    }

    return { 
      success: true, 
      data: data.data || [], 
      meta: data.meta 
    }

  } catch (error) {
    console.error("Error fetching bookings:", error)
    return { success: false, message: "Failed to load bookings" }
  }
}


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

    if (!data.technicianId || !data.serviceId || !data.scheduledAt) {
      return { success: false, message: "Missing required fields" }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/customer/bookings`
    console.log("📤 Creating booking:", url)

    const res = await fetch(url, {
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
      cache: "no-store",
    })

    const result = await res.json()
    console.log("📦 Create response:", result)

    if (!res.ok) {
      return { 
        success: false, 
        message: result.message || "Failed to create booking" 
      }
    }

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


export async function cancelBooking(bookingId: string) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/customer/bookings/${bookingId}/cancel`
    console.log("📤 Cancelling booking:", url)

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Failed to cancel booking" 
      }
    }

    revalidatePath("/customer_dashboard")
    revalidatePath("/customer_dashboard/bookings")

    return { 
      success: true, 
      message: "Booking cancelled successfully" 
    }

  } catch (error) {
    console.error("Error cancelling booking:", error)
    return { success: false, message: "Something went wrong" }
  }
}


export async function getBookingById(bookingId: string) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/customer/bookings/${bookingId}`
    console.log("🔗 Fetching booking:", url)

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Failed to fetch booking" 
      }
    }

    return { 
      success: true, 
      data: data.data 
    }

  } catch (error) {
    console.error("Error fetching booking:", error)
    return { success: false, message: "Failed to load booking" }
  }
}