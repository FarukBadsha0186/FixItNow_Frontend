
"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// ✅ Helper: Get Token
const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}

// ✅ GET Dashboard Data (Profile + Bookings)
export async function getDashboardData() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    // ✅ 1. Get Profile
    const profileRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/profile`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    // ✅ 2. Get Bookings
    const bookingsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    const profile = await profileRes.json()
    const bookings = await bookingsRes.json()

    // ✅ 3. Calculate stats
    const bookingList = bookings.data || []
    const stats = {
      pendingRequests: bookingList.filter((b: any) => b.status === 'REQUESTED').length,
      upcomingJobs: bookingList.filter((b: any) => b.status === 'ACCEPTED' || b.status === 'PAID').length,
      completedJobs: bookingList.filter((b: any) => b.status === 'COMPLETED').length,
      totalEarnings: bookingList
        .filter((b: any) => b.status === 'COMPLETED')
        .reduce((sum: number, b: any) => sum + b.totalAmount, 0)
    }

    return {
      success: true,
      data: {
        profile: profile.data,
        stats,
        recentBookings: bookingList.slice(0, 5)
      }
    }

  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return { success: false, message: "Failed to load dashboard" }
  }
}

// ✅ Refresh Dashboard
export async function refreshDashboard() {
  try {
    revalidatePath("/technician_dashboard")
    revalidatePath("/technician_dashboard/bookings")
    console.log("✅ Technician dashboard refreshed")
    return { success: true }
  } catch (error) {
    console.error("Error refreshing dashboard:", error)
    return { success: false }
  }
}