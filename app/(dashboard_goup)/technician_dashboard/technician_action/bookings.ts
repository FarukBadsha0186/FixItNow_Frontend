// "use server"

// import { revalidatePath } from "next/cache"
// import { cookies } from "next/headers"

// export interface Booking {
//   id: string
//   scheduledAt: string
//   address: string
//   notes: string | null
//   status: 'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
//   totalAmount: number
//   customer: {
//     name: string
//     email: string
//   }
//   service: {
//     title: string
//   }
//   createdAt: string
//   updatedAt: string
// }

// // Helper: Get Token
// const getToken = async (): Promise<string | null> => {
//   const cookieStore = await cookies()
//   return cookieStore.get("accessToken")?.value || null
// }

// // ✅ Update Booking Status
// async function updateBookingStatus(bookingId: string, status: string) {
//   try {
//     const token = await getToken()
//     if (!token) {
//       return { success: false, message: "Unauthorized" }
//     }

//     const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/${bookingId}`
//     console.log(`🔵 Updating: ${bookingId} -> ${status}`)

//     const res = await fetch(url, {
//       method: "PATCH",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ status }),
//       cache: "no-store",
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       console.error(`❌ Update failed:`, data)
//       return { 
//         success: false, 
//         message: data.message || data.error || `Failed to ${status}` 
//       }
//     }

//     console.log(`✅ Booking ${status}:`, data)

//     // Revalidate all related paths
//     revalidatePath("/technician_dashboard")
//     revalidatePath("/technician_dashboard/bookings")
//     revalidatePath("/technician_dashboard/dashboard")

//     return { 
//       success: true, 
//       data: data.data, 
//       message: `Booking ${status.toLowerCase()}` 
//     }

//   } catch (error) {
//     console.error(`❌ Error:`, error)
//     return { success: false, message: "Something went wrong" }
//   }
// }

// // ✅ Exported Actions
// export async function acceptBooking(bookingId: string) {
//   return updateBookingStatus(bookingId, "ACCEPTED")
// }

// export async function declineBooking(bookingId: string) {
//   return updateBookingStatus(bookingId, "DECLINED")
// }

// export async function markInProgress(bookingId: string) {
//   return updateBookingStatus(bookingId, "IN_PROGRESS")
// }

// export async function markCompleted(bookingId: string) {
//   return updateBookingStatus(bookingId, "COMPLETED")
// }

// // ✅ Get Bookings
// export async function getBookings(status?: string) {
//   try {
//     const token = await getToken()
//     if (!token) {
//       return { success: false, message: "Unauthorized" }
//     }

//     let url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings`
//     if (status && status !== 'ALL') {
//       url += `?status=${status}`
//     }

//     console.log(`🔵 Fetching bookings from: ${url}`)

//     const res = await fetch(url, {
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       cache: "no-store",
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       return { success: false, message: data.message || "Failed to fetch bookings" }
//     }

//     return { success: true, data: data.data || [] }

//   } catch (error) {
//     console.error("❌ Error fetching:", error)
//     return { success: false, message: "Failed to load bookings" }
//   }
// }

// // ✅ Get Booking Stats
// export async function getBookingStats() {
//   try {
//     const token = await getToken()
//     if (!token) {
//       return { success: false, message: "Unauthorized" }
//     }

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/stats`,
//       {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         cache: "no-store",
//       }
//     )

//     const data = await res.json()

//     if (!res.ok) {
//       return { success: false, message: data.message || "Failed to fetch stats" }
//     }

//     return { success: true, data: data.data }

//   } catch (error) {
//     console.error("❌ Error fetching stats:", error)
//     return { success: false, message: "Failed to load stats" }
//   }
// }

"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

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

// Helper: Get Token
const getToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value || null
}

// ✅ Get Bookings
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
    console.error("❌ Error fetching:", error)
    return { success: false, message: "Failed to load bookings" }
  }
}

// ✅ Update Booking Status
async function updateBookingStatus(bookingId: string, status: string) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/${bookingId}`
    
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || data.error || `Failed to ${status}` 
      }
    }

    // Revalidate all related paths
    revalidatePath("/technician_dashboard")
    revalidatePath("/technician_dashboard/bookings")
    revalidatePath("/technician_dashboard/dashboard")

    return { 
      success: true, 
      data: data.data, 
      message: `Booking ${status.toLowerCase()}` 
    }

  } catch (error) {
    console.error(`❌ Error:`, error)
    return { success: false, message: "Something went wrong" }
  }
}

// ✅ Exported Actions
export async function acceptBooking(bookingId: string) {
  return updateBookingStatus(bookingId, "ACCEPTED")
}

export async function declineBooking(bookingId: string) {
  return updateBookingStatus(bookingId, "DECLINED")
}

export async function markInProgress(bookingId: string) {
  return updateBookingStatus(bookingId, "IN_PROGRESS")
}

export async function markCompleted(bookingId: string) {
  return updateBookingStatus(bookingId, "COMPLETED")
}

// ✅ Get Booking Stats
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