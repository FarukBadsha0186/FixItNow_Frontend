// // // "use server"

// // // import { revalidatePath } from "next/cache"
// // // import { cookies } from "next/headers"

// // // // ============================================
// // // // Types
// // // // ============================================

// // // export interface Booking {
// // //   id: string
// // //   scheduledAt: string
// // //   address: string
// // //   notes: string | null
// // //   status: 'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
// // //   totalAmount: number
// // //   customer: {
// // //     name: string
// // //     email: string
// // //   }
// // //   service: {
// // //     title: string
// // //   }
// // //   createdAt: string
// // //   updatedAt: string
// // // }

// // // // ============================================
// // // // Helper Functions
// // // // ============================================

// // // const getToken = async (): Promise<string | null> => {
// // //   const cookieStore = await cookies()
// // //   return cookieStore.get("accessToken")?.value || null
// // // }

// // // // ============================================
// // // // ✅ Frontend Validation + Direct PATCH
// // // // ============================================

// // // async function updateBookingStatus(bookingId: string, status: string) {
// // //   try {
// // //     // ✅ 1. Token Check
// // //     const token = await getToken()
// // //     if (!token) {
// // //       return { success: false, message: "Unauthorized" }
// // //     }

// // //     // ✅ 2. Current Status Fetch (GET request - যদি কাজ করে)
// // //     // কিন্তু আপনার API তে GET কাজ না করলে, এই অংশ skip করব
// // //     let currentStatus = null
// // //     try {
// // //       const checkRes = await fetch(
// // //         `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/${bookingId}`,
// // //         {
// // //           headers: {
// // //             "Authorization": `Bearer ${token}`,
// // //             "Content-Type": "application/json",
// // //           },
// // //           cache: "no-store",
// // //         }
// // //       )
// // //       if (checkRes.ok) {
// // //         const checkData = await checkRes.json()
// // //         currentStatus = checkData.data?.status
// // //       }
// // //     } catch (error) {
// // //       // GET কাজ না করলে, আমরা অনুমান করব status ঠিক আছে
// // //       console.log("⚠️ Status check skipped (GET not working)")
// // //     }

// // //     // ✅ 3. Frontend Validation (যদি currentStatus পাওয়া যায়)
// // //     if (currentStatus) {
// // //       // Accept/Decline Validation
// // //       if ((status === 'ACCEPTED' || status === 'DECLINED') && currentStatus !== 'REQUESTED') {
// // //         return { success: false, message: "Booking must be REQUESTED to accept or decline" }
// // //       }

// // //       // Start Job Validation
// // //       if (status === 'IN_PROGRESS' && currentStatus !== 'PAID') {
// // //         return { success: false, message: "Booking must be PAID before starting job" }
// // //       }

// // //       // Complete Validation
// // //       if (status === 'COMPLETED' && currentStatus !== 'IN_PROGRESS') {
// // //         return { success: false, message: "Booking must be IN_PROGRESS to complete" }
// // //       }
// // //     }

// // //     // ✅ 4. Direct PATCH (Backend এ পাঠান)
// // //     const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/${bookingId}`
// // //     console.log(`🔵 Updating: ${bookingId} -> ${status}`)

// // //     const res = await fetch(url, {
// // //       method: "PATCH",
// // //       headers: {
// // //         "Authorization": `Bearer ${token}`,
// // //         "Content-Type": "application/json",
// // //       },
// // //       body: JSON.stringify({ status }),
// // //     })

// // //     const data = await res.json()

// // //     // ✅ 5. Response Check
// // //     if (!res.ok) {
// // //       console.error(`❌ Update failed:`, data)
      
// // //       // Backend Error Message দেখানো
// // //       const errorMsg = data.message || data.error || `Failed to ${status}`
// // //       return { success: false, message: errorMsg }
// // //     }

// // //     console.log(`✅ Booking ${status}:`, data)

// // //     // ✅ 6. Revalidate
// // //     revalidatePath("/technician_dashboard")
// // //     revalidatePath("/technician_dashboard/bookings")

// // //     return { success: true, data: data.data, message: `Booking ${status.toLowerCase()}` }

// // //   } catch (error) {
// // //     console.error(`❌ Error:`, error)
// // //     return { success: false, message: "Something went wrong" }
// // //   }
// // // }

// // // // ============================================
// // // // ✅ Exported Actions
// // // // ============================================

// // // export async function acceptBooking(bookingId: string) {
// // //   return updateBookingStatus(bookingId, "ACCEPTED")
// // // }

// // // export async function declineBooking(bookingId: string) {
// // //   return updateBookingStatus(bookingId, "DECLINED")
// // // }

// // // export async function markInProgress(bookingId: string) {
// // //   return updateBookingStatus(bookingId, "IN_PROGRESS")
// // // }

// // // export async function markCompleted(bookingId: string) {
// // //   return updateBookingStatus(bookingId, "COMPLETED")
// // // }

// // // // ============================================
// // // // ✅ Get Bookings
// // // // ============================================

// // // export async function getBookings(status?: string) {
// // //   try {
// // //     const token = await getToken()
// // //     if (!token) {
// // //       return { success: false, message: "Unauthorized" }
// // //     }

// // //     let url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings`
// // //     if (status && status !== 'ALL') {
// // //       url += `?status=${status}`
// // //     }

// // //     const res = await fetch(url, {
// // //       headers: {
// // //         "Authorization": `Bearer ${token}`,
// // //         "Content-Type": "application/json",
// // //       },
// // //       cache: "no-store",
// // //     })

// // //     const data = await res.json()

// // //     if (!res.ok) {
// // //       return { success: false, message: data.message || "Failed to fetch bookings" }
// // //     }

// // //     return { success: true, data: data.data || [] }

// // //   } catch (error) {
// // //     console.error("❌ Error fetching:", error)
// // //     return { success: false, message: "Failed to load bookings" }
// // //   }
// // // }

// // // // ============================================
// // // // ✅ Get Booking Stats
// // // // ============================================

// // // export async function getBookingStats() {
// // //   try {
// // //     const token = await getToken()
// // //     if (!token) {
// // //       return { success: false, message: "Unauthorized" }
// // //     }

// // //     const res = await fetch(
// // //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/stats`,
// // //       {
// // //         headers: {
// // //           "Authorization": `Bearer ${token}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //         cache: "no-store",
// // //       }
// // //     )

// // //     const data = await res.json()

// // //     if (!res.ok) {
// // //       return { success: false, message: data.message || "Failed to fetch stats" }
// // //     }

// // //     return { success: true, data: data.data }

// // //   } catch (error) {
// // //     console.error("❌ Error fetching stats:", error)
// // //     return { success: false, message: "Failed to load stats" }
// // //   }
// // // }

// // "use server"

// // import { revalidatePath } from "next/cache"
// // import { cookies } from "next/headers"

// // export interface Booking {
// //   id: string
// //   scheduledAt: string
// //   address: string
// //   notes: string | null
// //   status: 'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
// //   totalAmount: number
// //   customer: {
// //     name: string
// //     email: string
// //   }
// //   service: {
// //     title: string
// //   }
// //   createdAt: string
// //   updatedAt: string
// // }

// // const getToken = async (): Promise<string | null> => {
// //   const cookieStore = await cookies()
// //   return cookieStore.get("accessToken")?.value || null
// // }

// // async function updateBookingStatus(bookingId: string, status: string) {
// //   try {
// //     const token = await getToken()
// //     if (!token) return { success: false, message: "Unauthorized" }

// //     const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/${bookingId}`

// //     const res = await fetch(url, {
// //       method: "PATCH",
// //       headers: {
// //         "Authorization": `Bearer ${token}`,
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({ status }),
// //       cache: "no-store",
// //     })

// //     const data = await res.json()

// //     if (!res.ok) {
// //       return { success: false, message: data.message || data.error || "Failed to update status" }
// //     }

// //     // Revalidate BOTH pages so both tables update automatically
// //     revalidatePath("/technician_dashboard/bookings")
// //     revalidatePath("/technician_dashboard/dashboard")

// //     return { success: true, data: data.data, message: `Booking ${status.toLowerCase()}` }

// //   } catch (error) {
// //     console.error("Error updating booking status:", error)
// //     return { success: false, message: "Something went wrong" }
// //   }
// // }

// // export async function acceptBooking(bookingId: string) { return updateBookingStatus(bookingId, "ACCEPTED") }
// // export async function declineBooking(bookingId: string) { return updateBookingStatus(bookingId, "DECLINED") }
// // export async function markInProgress(bookingId: string) { return updateBookingStatus(bookingId, "IN_PROGRESS") }
// // export async function markCompleted(bookingId: string) { return updateBookingStatus(bookingId, "COMPLETED") }

// // export async function getBookings(status?: string) {
// //   try {
// //     const token = await getToken()
// //     if (!token) return { success: false, message: "Unauthorized", data: [] }

// //     let url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings`
// //     if (status && status !== 'ALL') url += `?status=${status}`

// //     const res = await fetch(url, {
// //       headers: {
// //         "Authorization": `Bearer ${token}`,
// //         "Content-Type": "application/json",
// //       },
// //       cache: "no-store",
// //     })

// //     const data = await res.json()
// //     if (!res.ok) return { success: false, message: data.message || "Failed to fetch bookings", data: [] }

// //     return { success: true, data: data.data || [] }

// //   } catch (error) {
// //     console.error("Error fetching bookings:", error)
// //     return { success: false, message: "Failed to load bookings", data: [] }
// //   }
// // }

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

// const getToken = async (): Promise<string | null> => {
//   const cookieStore = await cookies()
//   return cookieStore.get("accessToken")?.value || null
// }

// async function updateBookingStatus(bookingId: string, status: string) {
//   try {
//     const token = await getToken()
//     if (!token) return { success: false, message: "Unauthorized" }

//     const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings/${bookingId}`

//     const res = await fetch(url, {
//       method: "PATCH",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ status }),
//       cache: "no-store", // ✅ No caching
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       return { success: false, message: data.message || data.error || "Failed to update status" }
//     }

//     // ✅ Revalidate both paths to ensure UI updates
//     revalidatePath("/technician_dashboard/bookings", "page")
//     revalidatePath("/technician_dashboard/dashboard", "page")

//     return { 
//       success: true, 
//       data: data.data,
//       booking: data.data, // Return full booking object for client-side use
//       message: `Booking ${status.toLowerCase()}` 
//     }

//   } catch (error) {
//     console.error("Error updating booking status:", error)
//     return { success: false, message: "Something went wrong" }
//   }
// }

// // ✅ Action functions
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

// // ✅ Get all bookings with no cache
// export async function getBookings(status?: string) {
//   try {
//     const token = await getToken()
//     if (!token) return { success: false, message: "Unauthorized", data: [] }

//     let url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings`
//     if (status && status !== 'ALL') url += `?status=${status}`

//     const res = await fetch(url, {
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       cache: "no-store", // ✅ No caching for fresh data
//     })

//     const data = await res.json()
//     if (!res.ok) return { success: false, message: data.message || "Failed to fetch bookings", data: [] }

//     return { success: true, data: data.data || [] }

//   } catch (error) {
//     console.error("Error fetching bookings:", error)
//     return { success: false, message: "Failed to load bookings", data: [] }
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

const getToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value || null
}

async function updateBookingStatus(bookingId: string, status: string) {
  try {
    const token = await getToken()
    if (!token) return { success: false, message: "Unauthorized" }

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
      return { success: false, message: data.message || data.error || "Failed to update status" }
    }

    revalidatePath("/technician_dashboard/bookings", "page")
    revalidatePath("/technician_dashboard/dashboard", "page")

    return { 
      success: true, 
      data: data.data,
      booking: data.data,
      message: `Booking ${status.toLowerCase()}` 
    }

  } catch (error) {
    console.error("Error updating booking status:", error)
    return { success: false, message: "Something went wrong" }
  }
}

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

export async function getBookings(status?: string) {
  try {
    const token = await getToken()
    if (!token) return { success: false, message: "Unauthorized", data: [] }

    let url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/bookings`
    if (status && status !== 'ALL') url += `?status=${status}`

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    const data = await res.json()
    if (!res.ok) return { success: false, message: data.message || "Failed to fetch bookings", data: [] }

    return { success: true, data: data.data || [] }

  } catch (error) {
    console.error("Error fetching bookings:", error)
    return { success: false, message: "Failed to load bookings", data: [] }
  }
}