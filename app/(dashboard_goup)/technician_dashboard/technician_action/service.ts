"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"



export interface Service {
  id: string
  title: string
  description: string | null
  price: number
  category: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface ServiceResponse {
  success: boolean
  data?: Service[]
  message?: string
}

export interface ServiceActionResponse {
  success: boolean
  data?: Service
  message?: string
}

export interface Category {
  id: string
  name: string
  description?: string | null
}

export interface CategoriesResponse {
  success: boolean
  data?: Category[]
  message?: string
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


export async function getServices(): Promise<ServiceResponse> {
  try {
    // ✅ Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/services`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    //  Handle 401
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
        message: data.message || "Failed to fetch services"
      }
    }

    return {
      success: true,
      data: data.data || []
    }

  } catch (error) {
    console.error("Error fetching services:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}



export async function getService(serviceId: string): Promise<ServiceActionResponse> {
  try {
    //  Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    if (!serviceId) {
      return {
        success: false,
        message: "Service ID is required"
      }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/services/${serviceId}`,
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
        message: data.message || "Failed to fetch service"
      }
    }

    return {
      success: true,
      data: data.data
    }

  } catch (error) {
    console.error("Error fetching service:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}



export async function createService(data: {
  title: string
  description: string
  price: number
  categoryId: string
}): Promise<ServiceActionResponse> {
  try {
    //  Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    //  Validate input
    if (!data.title || data.title.trim().length === 0) {
      return {
        success: false,
        message: "Service title is required"
      }
    }

    if (data.title.length < 3) {
      return {
        success: false,
        message: "Service title must be at least 3 characters"
      }
    }

    if (data.price <= 0) {
      return {
        success: false,
        message: "Price must be greater than 0"
      }
    }

    if (!data.categoryId) {
      return {
        success: false,
        message: "Category is required"
      }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/services`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title.trim(),
          description: data.description?.trim() || "",
          price: data.price,
          categoryId: data.categoryId,
        }),
      }
    )

    if (response.status === 401) {
      return {
        success: false,
        message: "Session expired. Please login again."
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to create service"
      }
    }

    //  Revalidate paths
    revalidatePath("/technician/services")
    revalidatePath("/technician/dashboard")

    return {
      success: true,
      data: result.data,
      message: "Service created successfully"
    }

  } catch (error) {
    console.error("Error creating service:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}



export async function updateService(
  serviceId: string,
  data: {
    title?: string
    description?: string
    price?: number
    categoryId?: string
  }
): Promise<ServiceActionResponse> {
  try {
    //  Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    if (!serviceId) {
      return {
        success: false,
        message: "Service ID is required"
      }
    }

    // Validate input
    if (data.title !== undefined && data.title.trim().length === 0) {
      return {
        success: false,
        message: "Service title cannot be empty"
      }
    }

    if (data.price !== undefined && data.price <= 0) {
      return {
        success: false,
        message: "Price must be greater than 0"
      }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/services/${serviceId}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )

    if (response.status === 401) {
      return {
        success: false,
        message: "Session expired. Please login again."
      }
    }

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update service"
      }
    }

    revalidatePath("/technician/services")
    revalidatePath("/technician/dashboard")

    return {
      success: true,
      data: result.data,
      message: "Service updated successfully"
    }

  } catch (error) {
    console.error("Error updating service:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}


export async function deleteService(serviceId: string): Promise<{
  success: boolean
  message?: string
}> {
  try {
    //  Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    if (!serviceId) {
      return {
        success: false,
        message: "Service ID is required"
      }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/services/${serviceId}`,
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

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete service"
      }
    }

    revalidatePath("/technician/services")
    revalidatePath("/technician/dashboard")

    return {
      success: true,
      message: "Service deleted successfully"
    }

  } catch (error) {
    console.error("Error deleting service:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}



export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/categories`,
      {
        method: "GET",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: {
          revalidate: 3600, // 1 hour
        },
      }
    )

    if (response.status === 401) {
      return {
        success: false,
        message: "Failed to fetch categories"
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch categories"
      }
    }

    return {
      success: true,
      data: data.data || []
    }

  } catch (error) {
    console.error("Error fetching categories:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}



export async function getServiceStats(): Promise<{
  success: boolean
  data?: {
    total: number
    categories: { categoryId: string; categoryName: string; count: number }[]
  }
  message?: string
}> {
  try {
    //  Check authentication
    const auth = await checkAuth()
    if (!auth.success) {
      return { success: false, message: auth.message }
    }

    const token = await getToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/technician/services/stats`,
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
        message: data.message || "Failed to fetch service stats"
      }
    }

    return {
      success: true,
      data: data.data
    }

  } catch (error) {
    console.error("Error fetching service stats:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again."
    }
  }
}