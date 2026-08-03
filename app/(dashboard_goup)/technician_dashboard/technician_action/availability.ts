"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"


export interface DayAvailability {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface AvailabilityResponse {
  id: string
  technicianId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

const getToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value || null
}



const checkAuth = async (): Promise<{ success: boolean; message?: string }> => {
  const token = await getToken()
  
  if (!token) {
    return {
      success: false,
      message: "Unauthorized. Please login again."
    }
  }
  
  return { success: true }
}


export interface DayAvailability {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface AvailabilityResponse {
  id: string
  technicianId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}








// ✅ GET Availability
export async function getAvailability() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability`,
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
      return { success: false, message: data.message || "Failed to fetch availability" }
    }

    return { success: true, data: data.data || [] }

  } catch (error) {
    console.error("Error fetching availability:", error)
    return { success: false, message: "Failed to load availability" }
  }
}

// ✅ UPDATE Availability
export async function updateAvailability(slots: any[]) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slots }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update availability" }
    }

    revalidatePath("/technician_dashboard/availability")
    revalidatePath("/technician_dashboard/dashboard")

    return { success: true, data: data.data, message: "Availability updated successfully" }

  } catch (error) {
    console.error("Error updating availability:", error)
    return { success: false, message: "Something went wrong" }
  }
}




export async function updateDaySlot(
  dayOfWeek: number,
  startTime: string,
  endTime: string
): Promise<{
  success: boolean
  data?: AvailabilityResponse
  message?: string
}> {
  try {
    // ✅ Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    // ✅ Validate
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return {
        success: false,
        message: "Day must be between 0 (Sunday) and 6 (Saturday)"
      }
    }
    if (!startTime || !endTime) {
      return {
        success: false,
        message: "Start time and end time are required"
      }
    }
    if (startTime >= endTime) {
      return {
        success: false,
        message: "Start time must be before end time"
      }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability/day`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),
      }
    )

    if (response.status === 401) {
      return {
        success: false,
        message: "Session expired. Please login again."
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update day slot"
      }
    }

    revalidatePath("/technician/availability")
    revalidatePath("/technician/dashboard")

    return {
      success: true,
      data: data.data,
      message: "Day slot updated successfully"
    }

  } catch (error) {
    console.error("Error updating day slot:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}

// ============================================
// 4️⃣ DELETE DAY SLOT
// ============================================

export async function deleteDaySlot(dayOfWeek: number): Promise<{
  success: boolean
  message?: string
}> {
  try {
    // ✅ Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return {
        success: false,
        message: "Invalid day. Must be between 0 and 6"
      }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability/day/${dayOfWeek}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (response.status === 401) {
      return {
        success: false,
        message: "Session expired. Please login again."
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete day slot"
      }
    }

    revalidatePath("/technician/availability")
    revalidatePath("/technician/dashboard")

    return {
      success: true,
      message: "Day slot deleted successfully"
    }

  } catch (error) {
    console.error("Error deleting day slot:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}

// ============================================
// 5️⃣ BLOCK DATE
// ============================================

export async function blockDate(
  date: string,
  reason?: string
): Promise<{
  success: boolean
  message?: string
}> {
  try {
    // ✅ Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    if (!date) {
      return {
        success: false,
        message: "Date is required"
      }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability/block`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, reason }),
      }
    )

    if (response.status === 401) {
      return {
        success: false,
        message: "Session expired. Please login again."
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to block date"
      }
    }

    revalidatePath("/technician/availability")
    revalidatePath("/technician/dashboard")

    return {
      success: true,
      message: "Date blocked successfully"
    }

  } catch (error) {
    console.error("Error blocking date:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}

// ============================================
// 6️⃣ UNBLOCK DATE
// ============================================

export async function unblockDate(date: string): Promise<{
  success: boolean
  message?: string
}> {
  try {
    // ✅ Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    if (!date) {
      return {
        success: false,
        message: "Date is required"
      }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability/block/${date}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (response.status === 401) {
      return {
        success: false,
        message: "Session expired. Please login again."
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to unblock date"
      }
    }

    revalidatePath("/technician/availability")
    revalidatePath("/technician/dashboard")

    return {
      success: true,
      message: "Date unblocked successfully"
    }

  } catch (error) {
    console.error("Error unblocking date:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}

export async function getBlockedDates(): Promise<{
  success: boolean
  data?: { date: string; reason?: string }[]
  message?: string
}> {
  try {
    // ✅ Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability/blocked`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (response.status === 401) {
      return {
        success: false,
        message: "Session expired. Please login again."
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch blocked dates"
      }
    }

    return {
      success: true,
      data: data.data || []
    }

  } catch (error) {
    console.error("Error fetching blocked dates:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}