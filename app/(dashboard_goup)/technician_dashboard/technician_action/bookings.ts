"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// ============================================
// Types
// ============================================

export interface Booking {
  id: string
  scheduledAt: string
  address: string
  notes: string | null
  status: 'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  totalAmount: number
  customer: {
    name: string
    email: string
  }
  service: {
    title: string
  }
  createdAt: string
  updatedAt: string
}

// ============================================
// ✅ Helper Functions
// ============================================

const getToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value || null
}

// ✅ SINGLE FUNCTION - Sob status update er jonno
async function updateBookingStatus(bookingId: string, status: string) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    // ✅ ETA THIK - Shudhu status body te pathano
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/${bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.message || `Failed to ${status}` }
    }

    // ✅ Revalidate all paths
    revalidatePath("/technician_dashboard/dashboard")
    revalidatePath("/technician_dashboard/bookings")
    revalidatePath("/customer_dashboard")
    revalidatePath("/customer_dashboard/bookings")

    return { success: true, data: data.data, message: `Booking ${status.toLowerCase()}` }

  } catch (error) {
    console.error(`Error updating booking to ${status}:`, error)
    return { success: false, message: "Something went wrong" }
  }
}

// ============================================
// ✅ EXPORTED ACTIONS
// ============================================

// 1️⃣ ACCEPT BOOKING
export async function acceptBooking(bookingId: string) {
  return updateBookingStatus(bookingId, "ACCEPTED")
}

// 2️⃣ DECLINE BOOKING
export async function declineBooking(bookingId: string) {
  return updateBookingStatus(bookingId, "DECLINED")
}

// 3️⃣ MARK IN-PROGRESS
export async function markInProgress(bookingId: string) {
  return updateBookingStatus(bookingId, "IN_PROGRESS")
}

// 4️⃣ MARK COMPLETED
export async function markCompleted(bookingId: string) {
  return updateBookingStatus(bookingId, "COMPLETED")
}

// 5️⃣ GET ALL BOOKINGS
export async function getBookings(status?: string) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    let url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings`
    if (status && status !== 'ALL') {
      url += `?status=${status}`
    }

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch bookings" }
    }

    return { success: true, data: data.data || [] }

  } catch (error) {
    console.error("Error fetching bookings:", error)
    return { success: false, message: "Failed to load bookings" }
  }
}

// 6️⃣ GET BOOKING STATS
export async function getBookingStats() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/stats`,
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
      return { success: false, message: data.message || "Failed to fetch stats" }
    }

    return { success: true, data: data.data }

  } catch (error) {
    console.error("Error fetching booking stats:", error)
    return { success: false, message: "Failed to load stats" }
  }
}