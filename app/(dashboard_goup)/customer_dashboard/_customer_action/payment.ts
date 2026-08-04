
"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// ✅ Get Token
const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}



export async function createPayment(bookingId: string) {
  try {
    if (!bookingId) {
      return { success: false, message: "Booking ID is required" }
    }

    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized - Please log in" }
    }

    console.log("📌 Token exists:", !!token)
    console.log("📌 Creating payment for:", bookingId)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      }
    )

    const data = await res.json()
    console.log("🔍 Payment API Response:", JSON.stringify(data, null, 2))

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Payment initiation failed" 
      }
    }

  
    const paymentUrl = data.data?.checkoutUrl || 
                       data.data?.paymentUrl || 
                       data.paymentUrl || 
                       data.data?.url || 
                       data.url

    console.log("🔍 Extracted paymentUrl:", paymentUrl)

    if (!paymentUrl) {
      return { 
        success: false, 
        message: "No payment URL received from server" 
      }
    }

    return {
      success: true,
      data: { 
        paymentUrl, 
        paymentId: data.data?.payment?.id || data.data?.paymentId,
        clientSecret: data.data?.clientSecret || data.clientSecret
      },
      message: "Payment initiated successfully",
    }

  } catch (error) {
    console.error("Error creating payment:", error)
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    }
  }
}


export async function getPaymentStatus(bookingId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/booking/${bookingId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Failed to get payment status" 
      }
    }

    return { 
      success: true, 
      data: data.data 
    }

  } catch (error) {
    console.error("Error getting payment status:", error)
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    }
  }
}


export async function getPayments() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,  // ✅ Token আছে
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    const data = await res.json()
    return { success: true, data: data.data || [] }

  } catch (error) {
    console.error("Error fetching payments:", error)
    return { success: false, message: "Failed to load payments" }
  }
}



// export async function confirmPayment(paymentId: string) {
//   try {
//     if (!paymentId) {
//       return { success: false, message: "Payment ID is required" }
//     }

//     const token = await getToken()
//     if (!token) {
//       return { success: false, message: "Unauthorized - Please log in" }
//     }

//     console.log("📌 Confirming payment:", paymentId)

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/confirm`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({ paymentId }),
//       }
//     )

//     const result = await res.json()
//     console.log("🔍 Confirm Payment Response:", result)

//     if (!res.ok) {
//       return { 
//         success: false, 
//         message: result.message || "Payment confirmation failed" 
//       }
//     }

    
//     revalidatePath("/")
//     revalidatePath("/customer_dashboard")
//     revalidatePath("/customer_dashboard/bookings")
//     revalidatePath("/customer_dashboard/payments")
    
    
//     revalidatePath("/technician_dashboard")
//     revalidatePath("/technician_dashboard/bookings")
    
  
//     revalidatePath("/admin_dashboard")
//     revalidatePath("/admin_dashboard/bookings")

//     console.log("✅ All paths revalidated")

//     return {
//       success: true,
//       data: result.data,
//       message: "Payment confirmed successfully",
//     }

//   } catch (error) {
//     console.error("Error confirming payment:", error)
//     return { 
//       success: false, 
//       message: "Something went wrong. Please try again." 
//     }
//   }
// }



// ✅ Correct - expects sessionId
export async function confirmPayment(sessionId: string) {
  if (!sessionId) {
    return { success: false, message: "Session ID is required" }
  }

  const token = await getToken()
  if (!token) {
    return { success: false, message: "Unauthorized - Please log in" }
  }

  console.log("📌 Confirming payment with sessionId:", sessionId)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/confirm`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),  // ✅ Fixed!
    }
  )

  const result = await res.json()
  console.log("🔍 Confirm Payment Response:", result)

  if (!res.ok) {
    return { 
      success: false, 
      message: result.message || "Payment confirmation failed" 
    }
  }

  // ✅ Revalidate all paths
  revalidatePath("/")
  revalidatePath("/customer_dashboard")
  revalidatePath("/customer_dashboard/bookings")
  revalidatePath("/customer_dashboard/payments")
  revalidatePath("/technician_dashboard")
  revalidatePath("/technician_dashboard/bookings")
  revalidatePath("/admin_dashboard")
  revalidatePath("/admin_dashboard/bookings")

  console.log("✅ All paths revalidated")

  return {
    success: true,
    data: result.data,
    message: "Payment confirmed successfully",
  }
}