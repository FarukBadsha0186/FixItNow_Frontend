"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

//  Get Token
const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value
}


export async function getAdminStats() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    //  Get users
    const usersRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/users`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    // Get bookings
    const bookingsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/bookings`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    const usersData = await usersRes.json()
    const bookingsData = await bookingsRes.json()

    const users = usersData?.data || []
    const bookings = bookingsData?.data || []

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter((u: any) => u.status === 'ACTIVE').length,
      bannedUsers: users.filter((u: any) => u.status === 'BANNED').length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b: any) => b.status === 'REQUESTED' || b.status === 'PENDING').length,
      completedBookings: bookings.filter((b: any) => b.status === 'COMPLETED').length,
      revenue: bookings
        .filter((b: any) => b.status === 'COMPLETED' || b.status === 'PAID')
        .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
    }

    return { success: true, data: stats }

  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return { success: false, message: "Failed to load stats" }
  }
}
export async function getUsers() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/users`,
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
      return { success: false, message: data.message || "Failed to fetch users" }
    }

    return { success: true, data: data.data || [] }

  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, message: "Failed to load users" }
  }
}


export async function toggleUserStatus(userId: string, action: 'ACTIVE' | 'BANNED') {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    if (!userId) {
      return { success: false, message: "User ID is required" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.message || `Failed to ${action} user` }
    }

    revalidatePath("/admin_dashboard")
    revalidatePath("/admin_dashboard/users")

    const message = action === 'BANNED' ? 'banned' : 'activated'
    return { success: true, message: `User ${message} successfully` }

  } catch (error) {
    console.error("Error toggling user status:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export async function getAdminBookings() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/bookings`,
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
      return { success: false, message: data.message || "Failed to fetch bookings" }
    }

    return { success: true, data: data.data || [] }

  } catch (error) {
    console.error("Error fetching bookings:", error)
    return { success: false, message: "Failed to load bookings" }
  }
}


//  GET ALL CATEGORIES (Admin)
//
export async function getAdminCategories() {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/categories`,
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
      return { success: false, message: data.message || "Failed to fetch categories" }
    }

    return { success: true, data: data.data || [] }

  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, message: "Failed to load categories" }
  }
}


// 6️⃣ CREATE CATEGORY

export async function createCategory(data: { name: string; description?: string }) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, message: "Category name is required" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/categories`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name.trim(),
          description: data.description?.trim() || "",
        }),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      return { success: false, message: result.message || "Failed to create category" }
    }

    revalidatePath("/admin_dashboard")
    revalidatePath("/admin_dashboard/categories")

    return { success: true, data: result.data, message: "Category created successfully" }

  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, message: "Something went wrong" }
  }
}




export async function updateCategory(categoryId: string, data: { name: string; description?: string }) {
  try {
    const token = await getToken()
    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    if (!categoryId) {
      return { success: false, message: "Category ID is required" }
    }

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, message: "Category name is required" }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/categories/${categoryId}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name.trim(),
          description: data.description?.trim() || "",
        }),
      }
    )

    const result = await res.json()

    if (!res.ok) {
      return { success: false, message: result.message || "Failed to update category" }
    }

    revalidatePath("/admin_dashboard")
    revalidatePath("/admin_dashboard/categories")

    return { success: true, data: result.data, message: "Category updated successfully" }

  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, message: "Something went wrong" }
  }
}