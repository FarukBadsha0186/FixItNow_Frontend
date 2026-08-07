"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export interface DayAvailability {
  dayOfWeek: number
  startTime: string
  endTime: string
}

const getToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value || null
}

// GET Availability
export async function getAvailability() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability`

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

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





export async function updateAvailability(slots: any[]) {
  try {
    const token = await getToken()
    console.log(" Token:", token ? " Present" : " Missing")

    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability`
    console.log("URL:", url) 

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slots }),
    })

    console.log("📦 Status:", res.status) 

    const data = await res.json()
    console.log("📦 Data:", data)

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update" }
    }

    revalidatePath("/technician_dashboard/availability")

    return { success: true, data: data.data, message: "Availability updated successfully" }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, message: "Something went wrong" }
  }
}