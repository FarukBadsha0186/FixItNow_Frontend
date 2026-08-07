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

// ✅ GET Availability
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

// // ✅ UPDATE Availability (PATCH)
// export async function updateAvailability(slots: DayAvailability[]) {
//   try {
//     const token = await getToken()
//     if (!token) {
//       return { success: false, message: "Unauthorized" }
//     }

//     // ✅ Validate slots
//     if (!slots || slots.length === 0) {
//       return { success: false, message: "At least one slot is required" }
//     }

//     // ✅ Limit slots to 7 (one per day)
//     if (slots.length > 7) {
//       return { success: false, message: "Maximum 7 slots allowed (one per day)" }
//     }

//     for (const slot of slots) {
//       // ✅ Validate dayOfWeek (0-6)
//       if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
//         return { 
//           success: false, 
//           message: `dayOfWeek must be between 0 (Sunday) and 6 (Saturday), got ${slot.dayOfWeek}` 
//         }
//       }
      
//       // ✅ Validate time
//       if (!slot.startTime || !slot.endTime) {
//         return { 
//           success: false, 
//           message: `Start time and end time are required for day ${slot.dayOfWeek}` 
//         }
//       }
      
//       if (slot.startTime >= slot.endTime) {
//         return { 
//           success: false, 
//           message: `Start time must be before end time for day ${slot.dayOfWeek}` 
//         }
//       }
//     }

//     const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability`

//     const res = await fetch(url, {
//       method: "PATCH",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ slots }),
//       cache: "no-store",
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       return { success: false, message: data.message || "Failed to update availability" }
//     }

//     revalidatePath("/technician_dashboard/availability")
//     revalidatePath("/technician_dashboard/dashboard")

//     return { 
//       success: true, 
//       data: data.data, 
//       message: "Availability updated successfully" 
//     }
//   } catch (error) {
//     console.error("Error updating availability:", error)
//     return { success: false, message: "Something went wrong" }
//   }
// }



export async function updateAvailability(slots: any[]) {
  try {
    const token = await getToken()
    console.log("🔑 Token:", token ? "✅ Present" : "❌ Missing")

    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/availability`
    console.log("🔗 URL:", url) // ✅ Check this

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slots }),
    })

    console.log("📦 Status:", res.status) // ✅ Check status

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