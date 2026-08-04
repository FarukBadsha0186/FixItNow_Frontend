// // // "use server"

// // // import { cookies } from "next/headers"
// // // import { revalidatePath } from "next/cache"

// // // const getToken = async () => {
// // //   const cookieStore = await cookies()
// // //   return cookieStore.get("accessToken")?.value
// // // }

// // // // ✅ Get Payment History
// // // export async function getPayments() {
// // //   try {
// // //     const token = await getToken()
// // //     if (!token) {
// // //       return { success: false, message: "Unauthorized" }
// // //     }

// // //     const res = await fetch(
// // //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments`,
// // //       {
// // //         headers: {
// // //           "Authorization": `Bearer ${token}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //         cache: "no-store",
// // //       }
// // //     )

// // //     const data = await res.json()
// // //     return { success: true, data: data.data || [] }

// // //   } catch (error) {
// // //     console.error("Error fetching payments:", error)
// // //     return { success: false, message: "Failed to load payments" }
// // //   }
// // // }

// // // // ✅ Create Payment - Supports Multiple Response Formats
// // // export async function createPayment(bookingId: string) {
// // //   try {
// // //     const token = await getToken()
// // //     if (!token) {
// // //       return { success: false, message: "Unauthorized" }
// // //     }

// // //     if (!bookingId) {
// // //       return { success: false, message: "Booking ID is required" }
// // //     }

// // //     const res = await fetch(
// // //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/create`,
// // //       {
// // //         method: "POST",
// // //         headers: {
// // //           "Authorization": `Bearer ${token}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({ bookingId }),
// // //       }
// // //     )

// // //     const data = await res.json()
// // //     console.log("🔍 Payment API Response:", JSON.stringify(data, null, 2))

// // //     if (!res.ok) {
// // //       return { 
// // //         success: false, 
// // //         message: data.message || "Payment initiation failed" 
// // //       }
// // //     }

// // //     // ✅ Handle multiple response formats
// // //     // Format 1: { data: { paymentUrl: "..." } }
// // //     // Format 2: { paymentUrl: "..." }
// // //     // Format 3: { data: { url: "..." } }
// // //     // Format 4: { url: "..." }
// // //     const paymentUrl = data.data?.paymentUrl || 
// // //                        data.paymentUrl || 
// // //                        data.data?.url || 
// // //                        data.url

// // //     const paymentId = data.data?.paymentId || 
// // //                       data.paymentId || 
// // //                       data.data?.id || 
// // //                       data.id

// // //     const clientSecret = data.data?.clientSecret || 
// // //                          data.clientSecret

// // //     if (!paymentUrl) {
// // //       console.error("❌ No paymentUrl in response:", data)
// // //       return { 
// // //         success: false, 
// // //         message: "No payment URL received from server" 
// // //       }
// // //     }

// // //     return {
// // //       success: true,
// // //       data: { 
// // //         paymentUrl, 
// // //         paymentId, 
// // //         clientSecret 
// // //       },
// // //       message: "Payment initiated successfully",
// // //     }

// // //   } catch (error) {
// // //     console.error("Error creating payment:", error)
// // //     return { 
// // //       success: false, 
// // //       message: "Something went wrong. Please try again." 
// // //     }
// // //   }
// // // }

// // // // ✅ Confirm Payment
// // // export async function confirmPayment(paymentId: string) {
// // //   try {
// // //     const token = await getToken()
// // //     if (!token) {
// // //       return { success: false, message: "Unauthorized" }
// // //     }

// // //     const res = await fetch(
// // //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/confirm`,
// // //       {
// // //         method: "POST",
// // //         headers: {
// // //           "Authorization": `Bearer ${token}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({ paymentId }),
// // //       }
// // //     )

// // //     const result = await res.json()

// // //     if (!res.ok) {
// // //       return { 
// // //         success: false, 
// // //         message: result.message || "Payment confirmation failed" 
// // //       }
// // //     }

// // //     revalidatePath("/customer_dashboard")
// // //     revalidatePath("/customer_dashboard/payments")

// // //     return {
// // //       success: true,
// // //       data: result.data,
// // //       message: "Payment confirmed successfully",
// // //     }

// // //   } catch (error) {
// // //     console.error("Error confirming payment:", error)
// // //     return { 
// // //       success: false, 
// // //       message: "Something went wrong. Please try again." 
// // //     }
// // //   }
// // // }


// // // export async function getPaymentStatus(bookingId: string) {
// // //   try {
// // //     const token = await getToken()
// // //     if (!token) {
// // //       return { success: false, message: "Unauthorized" }
// // //     }

// // //     const res = await fetch(
// // //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/booking/${bookingId}`,
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
// // //       return { success: false, message: data.message || "Failed to get payment status" }
// // //     }

// // //     return { success: true, data: data.data }

// // //   } catch (error) {
// // //     console.error("Error getting payment status:", error)
// // //     return { success: false, message: "Something went wrong" }
// // //   }
// // // }


// // "use server"

// // import { cookies } from "next/headers"
// // import { revalidatePath } from "next/cache"

// // // ✅ Get Token
// // const getToken = async () => {
// //   const cookieStore = await cookies()
// //   return cookieStore.get("accessToken")?.value
// // }

// // // ✅ Create Payment (Public - No Token Required)
// // export async function createPayment(bookingId: string) {
// //   try {
// //     if (!bookingId) {
// //       return { success: false, message: "Booking ID is required" }
// //     }

// //     const res = await fetch(
// //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/create`,
// //       {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ bookingId }),
// //       }
// //     )

// //     const data = await res.json()
// //     console.log("🔍 Payment API Response:", JSON.stringify(data, null, 2))

// //     if (!res.ok) {
// //       return { 
// //         success: false, 
// //         message: data.message || "Payment initiation failed" 
// //       }
// //     }

// //     const paymentUrl = data.data?.paymentUrl || data.paymentUrl || data.data?.url || data.url

// //     if (!paymentUrl) {
// //       return { 
// //         success: false, 
// //         message: "No payment URL received from server" 
// //       }
// //     }

// //     return {
// //       success: true,
// //       data: { 
// //         paymentUrl, 
// //         paymentId: data.data?.paymentId || data.paymentId,
// //         clientSecret: data.data?.clientSecret || data.clientSecret
// //       },
// //       message: "Payment initiated successfully",
// //     }

// //   } catch (error) {
// //     console.error("Error creating payment:", error)
// //     return { 
// //       success: false, 
// //       message: "Something went wrong. Please try again." 
// //     }
// //   }
// // }

// // // ✅ Get Payment Status
// // export async function getPaymentStatus(bookingId: string) {
// //   try {
// //     const res = await fetch(
// //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/booking/${bookingId}`,
// //       {
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         cache: "no-store",
// //       }
// //     )

// //     const data = await res.json()

// //     if (!res.ok) {
// //       return { 
// //         success: false, 
// //         message: data.message || "Failed to get payment status" 
// //       }
// //     }

// //     return { 
// //       success: true, 
// //       data: data.data 
// //     }

// //   } catch (error) {
// //     console.error("Error getting payment status:", error)
// //     return { 
// //       success: false, 
// //       message: "Something went wrong. Please try again." 
// //     }
// //   }
// // }

// // // ✅ Get Payment History (Private - Needs Token)
// // export async function getPayments() {
// //   try {
// //     const token = await getToken()
// //     if (!token) {
// //       return { success: false, message: "Unauthorized" }
// //     }

// //     const res = await fetch(
// //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments`,
// //       {
// //         headers: {
// //           "Authorization": `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //         cache: "no-store",
// //       }
// //     )

// //     const data = await res.json()
// //     return { success: true, data: data.data || [] }

// //   } catch (error) {
// //     console.error("Error fetching payments:", error)
// //     return { success: false, message: "Failed to load payments" }
// //   }
// // }

// // // ✅ Confirm Payment
// // export async function confirmPayment(paymentId: string) {
// //   try {
// //     const res = await fetch(
// //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/confirm`,
// //       {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ paymentId }),
// //       }
// //     )

// //     const result = await res.json()

// //     if (!res.ok) {
// //       return { 
// //         success: false, 
// //         message: result.message || "Payment confirmation failed" 
// //       }
// //     }

// //     revalidatePath("/customer_dashboard")
// //     revalidatePath("/customer_dashboard/payments")

// //     return {
// //       success: true,
// //       data: result.data,
// //       message: "Payment confirmed successfully",
// //     }

// //   } catch (error) {
// //     console.error("Error confirming payment:", error)
// //     return { 
// //       success: false, 
// //       message: "Something went wrong. Please try again." 
// //     }
// //   }
// // }

// "use server"

// import { cookies } from "next/headers"
// import { revalidatePath } from "next/cache"

// // ✅ Get Token
// const getToken = async () => {
//   const cookieStore = await cookies()
//   return cookieStore.get("accessToken")?.value
// }

// // ✅ Create Payment (Public - No Token Required)
// export async function createPayment(bookingId: string) {
//   try {
//     if (!bookingId) {
//       return { success: false, message: "Booking ID is required" }
//     }

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/create`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ bookingId }),
//       }
//     )

//     const data = await res.json()
//     console.log("🔍 Payment API Response:", JSON.stringify(data, null, 2))

//     if (!res.ok) {
//       return { 
//         success: false, 
//         message: data.message || "Payment initiation failed" 
//       }
//     }

//     // ✅ Handle multiple response formats
//     const paymentUrl = data.data?.paymentUrl || 
//                        data.paymentUrl || 
//                        data.data?.url || 
//                        data.url

//     if (!paymentUrl) {
//       return { 
//         success: false, 
//         message: "No payment URL received from server" 
//       }
//     }

//     return {
//       success: true,
//       data: { 
//         paymentUrl, 
//         paymentId: data.data?.paymentId || data.paymentId,
//         clientSecret: data.data?.clientSecret || data.clientSecret
//       },
//       message: "Payment initiated successfully",
//     }

//   } catch (error) {
//     console.error("Error creating payment:", error)
//     return { 
//       success: false, 
//       message: "Something went wrong. Please try again." 
//     }
//   }
// }

// // ✅ Get Payment Status
// export async function getPaymentStatus(bookingId: string) {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/booking/${bookingId}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         cache: "no-store",
//       }
//     )

//     const data = await res.json()

//     if (!res.ok) {
//       return { 
//         success: false, 
//         message: data.message || "Failed to get payment status" 
//       }
//     }

//     return { 
//       success: true, 
//       data: data.data 
//     }

//   } catch (error) {
//     console.error("Error getting payment status:", error)
//     return { 
//       success: false, 
//       message: "Something went wrong. Please try again." 
//     }
//   }
// }

// // ✅ Get Payment History (Private - Needs Token)
// export async function getPayments() {
//   try {
//     const token = await getToken()
//     if (!token) {
//       return { success: false, message: "Unauthorized" }
//     }

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments`,
//       {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         cache: "no-store",
//       }
//     )

//     const data = await res.json()
//     return { success: true, data: data.data || [] }

//   } catch (error) {
//     console.error("Error fetching payments:", error)
//     return { success: false, message: "Failed to load payments" }
//   }
// }

// // ✅ Confirm Payment
// export async function confirmPayment(paymentId: string) {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/confirm`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ paymentId }),
//       }
//     )

//     const result = await res.json()

//     if (!res.ok) {
//       return { 
//         success: false, 
//         message: result.message || "Payment confirmation failed" 
//       }
//     }

//     revalidatePath("/customer_dashboard")
//     revalidatePath("/customer_dashboard/payments")

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

"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// ✅ Get Token
const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}

// ✅ Create Payment (Protected - Needs Token)
// export async function createPayment(bookingId: string) {
//   try {
//     if (!bookingId) {
//       return { success: false, message: "Booking ID is required" }
//     }

//     // ✅ Get Token
//     const token = await getToken()
//     if (!token) {
//       return { success: false, message: "Unauthorized - Please log in" }
//     }

//     console.log("📌 Token exists:", !!token)
//     console.log("📌 Creating payment for:", bookingId)

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/create`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,  // ✅ Token যোগ করেছি
//         },
//         body: JSON.stringify({ bookingId }),
//       }
//     )

//     const data = await res.json()
//     console.log("🔍 Payment API Response:", JSON.stringify(data, null, 2))

//     if (!res.ok) {
//       return { 
//         success: false, 
//         message: data.message || "Payment initiation failed" 
//       }
//     }

//     // ✅ Handle multiple response formats
//     const paymentUrl = data.data?.paymentUrl || 
//                        data.paymentUrl || 
//                        data.data?.url || 
//                        data.url

//     if (!paymentUrl) {
//       return { 
//         success: false, 
//         message: "No payment URL received from server" 
//       }
//     }

//     return {
//       success: true,
//       data: { 
//         paymentUrl, 
//         paymentId: data.data?.paymentId || data.paymentId,
//         clientSecret: data.data?.clientSecret || data.clientSecret
//       },
//       message: "Payment initiated successfully",
//     }

//   } catch (error) {
//     console.error("Error creating payment:", error)
//     return { 
//       success: false, 
//       message: "Something went wrong. Please try again." 
//     }
//   }
// }

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

    // ✅ Fix: Backend returns 'checkoutUrl', not 'paymentUrl'
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

// ✅ Get Payment Status (Public - No Token Required)
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

// ✅ Get Payment History (Private - Needs Token)
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

// ✅ Confirm Payment (Protected - Needs Token)
export async function confirmPayment(paymentId: string) {
  try {
    if (!paymentId) {
      return { success: false, message: "Payment ID is required" }
    }

    // ✅ Get Token
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized - Please log in" }
    }

    console.log("📌 Confirming payment:", paymentId)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // ✅ Token যোগ করেছি
        },
        body: JSON.stringify({ paymentId }),
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

    // ✅ Revalidate paths
    revalidatePath("/customer_dashboard")
    revalidatePath("/customer_dashboard/payments")
    revalidatePath("/customer_dashboard/bookings")

    return {
      success: true,
      data: result.data,
      message: "Payment confirmed successfully",
    }

  } catch (error) {
    console.error("Error confirming payment:", error)
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    }
  }
}