"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}

// ✅ GET Profile (with photo + availability)


// ✅ UPDATE Profile (with photo)
export async function updateProfile(data: {
  bio?: string
  experience?: number
  hourlyRate?: number
  location?: string
  profilePicture?: string  // ✅ Photo add
}) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/profile`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      return { success: false, message: result.message || "Failed to update profile" }
    }

    revalidatePath("/technician_dashboard/dashboard")
    revalidatePath("/technician_dashboard/profile")

    return { success: true, data: result.data, message: "Profile updated successfully" }

  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, message: "Something went wrong" }
  }
}





// ✅ GET Profile (using /api/auth/me + bookings)
export async function getProfile() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    // 1. Get user data
    const meRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/me`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    const meData = await meRes.json()

    if (!meRes.ok) {
      return { success: false, message: meData.message || "Failed to fetch user" }
    }

    const user = meData.data || {}

    // 2. Build profile
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      bio: user.bio || null,
      experience: user.experience || 0,
      hourlyRate: user.hourlyRate || 0,
      location: user.location || null,
      avgRating: user.avgRating || 0,
      totalReviews: user.totalReviews || 0,
      isAvailable: user.isAvailable ?? true,
      profilePicture: user.profilePicture || null,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || null,
      }
    }

    return { success: true, data: profile }

  } catch (error) {
    console.error("Error fetching profile:", error)
    return { success: false, message: "Failed to load profile" }
  }
}