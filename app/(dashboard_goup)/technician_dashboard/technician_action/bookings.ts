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
// Helper Functions
// ============================================

const getToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value || null
}

// ============================================
// ✅ Simplified: Direct PATCH Only (No Redundant Check)
// ============================================

async function updateBookingStatus(bookingId: string, status: string) {
  try {
    console.log(`🔵 Updating booking: ${bookingId} -> ${status}`)
    
    // ✅ 1. Token Check
    const token = await getToken()
    if (!token) {
      console.log("🔴 Token missing")
      return { success: false, message: "Unauthorized" }
    }

    // ✅ 2. Direct PATCH (Backend validates status transition)
    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/${bookingId}`
    console.log(`🔵 Request URL: ${url}`)

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    const data = await res.json()
    console.log(`🔵 Response Status: ${res.status}`)
    console.log(`🔵 Response Data:`, data)

    // ✅ 3. Error Handling
    if (!res.ok) {
      const errorMsg = data.message || data.error || `Failed to update booking status`
      console.error(`🔴 Error: ${errorMsg}`)
      return { success: false, message: errorMsg }
    }

    // ✅ 4. Success - Revalidate
    console.log(`✅ Booking updated successfully`)
    
    revalidatePath("/technician_dashboard")
    revalidatePath("/technician_dashboard/bookings")

    return { 
      success: true, 
      data: data.data, 
      message: `Booking ${status.toLowerCase()}` 
    }

  } catch (error) {
    console.error(`🔴 Catch Error:`, error)
    return { success: false, message: "Something went wrong" }
  }
}

// ============================================
// ✅ Exported Actions (Simplified)
// ============================================

export async function acceptBooking(bookingId: string) {
  return updateBookingStatus(bookingId, "ACCEPTED")
}

export async function declineBooking(bookingId: string) {
  return updateBookingStatus(bookingId, "DECLINED")
}

export async function markInProgress(bookingId: string) {
  // ✅ No redundant check - Backend validates transition from PAID to IN_PROGRESS
  return updateBookingStatus(bookingId, "IN_PROGRESS")
}

export async function markCompleted(bookingId: string) {
  // ✅ No redundant check - Backend validates transition from IN_PROGRESS to COMPLETED
  return updateBookingStatus(bookingId, "COMPLETED")
}

// ============================================
// ✅ Get Bookings
// ============================================

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
    console.error("❌ Error fetching bookings:", error)
    return { success: false, message: "Failed to load bookings" }
  }
}

// ============================================
// ✅ Get Booking Stats
// ============================================

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
    console.error("❌ Error fetching stats:", error)
    return { success: false, message: "Failed to load stats" }
  }
}