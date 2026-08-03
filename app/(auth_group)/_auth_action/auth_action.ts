
 

"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt, { JwtPayload } from "jsonwebtoken"
import { z } from "zod"

// export type LoginState = {
//   success: boolean
//   statusCode?: number
//   message? : string
//   data?: {
//     accessToken?: string
//     refreshToken?: string
//   }
//}
export type LoginState = {
  success: boolean
  statusCode?: number
  message: string  
  data?: {
    accessToken?: string
    refreshToken?: string
  }
}
export type RegisterState = {
  success: boolean
  errors?: { field: string; message: string }[]
  data?: any
}


// LOGIN ACTION

export const loginAction = async (prevState: LoginState, formData: FormData) => {
  const email = formData.get("email")
  const password = formData.get("password")

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const result = await res.json()

    if (!result.success) {
      return { success: false, message: result.message || "Invalid credentials" }
    }

    const accessToken = result.data?.accessToken || result.accessToken
    const refreshToken = result.data?.refreshToken || result.refreshToken

    if (!accessToken) {
      return { success: false, message: "No access token received" }
    }

    // ✅ Decode token to get role
    const decoded = jwt.decode(accessToken) as JwtPayload
    const role = decoded?.role || "CUSTOMER"

    // ✅ Set cookies
    const cookieStore = await cookies()
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1,
      sameSite: "lax",
      path: "/",
    })

    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 5,
        sameSite: "lax",
        path: "/",
      })
    }

    // ✅ Redirect based on role
    if (role === "ADMIN") {
      redirect("/admin_dashboard")
    } else if (role === "TECHNICIAN") {
      redirect("/technician_dashboard")
    } else {
      redirect("/customer_dashboard")
    }

    return { success: true, message: "Login successful" }

  } catch (error) {
    // ✅ Handle redirect errors (Next.js intentional)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error
    }

    console.error("Login error:", error)
    return { success: false, message: "Something went wrong. Please try again." }
  }
}

// ============================================
// REGISTER SCHEMA
// ============================================

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  location: z.string().min(2, "Location is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
  role: z.enum(["CUSTOMER", "TECHNICIAN"]),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// ============================================
// REGISTER ACTION
// ============================================

export async function registerUser(
  prevState: RegisterState | undefined,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
  }

  const result = registerSchema.safeParse(raw)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((err) => ({
        field: err.path[0]?.toString() || "",
        message: err.message,
      })),
      data: raw,
    }
  }

  const { name, email, phone, location, password, role } = result.data

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, location, password, role }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        errors: [{ field: "general", message: data.message || "Registration failed" }],
        data: raw,
      }
    }

    return {
      success: true,
      errors: [],
      data: { name, email, phone, location, role },
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      errors: [{ field: "general", message: "Something went wrong. Please try again." }],
      data: raw,
    }
  }
}