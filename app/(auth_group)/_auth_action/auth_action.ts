// app/(auth_group)/_auth_action/auth_action.ts

"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ============================================
// ✅ FIXED: LoginState Type
// ============================================

export type LoginState = {
    success: boolean;  // ✅ true/false both
    statusCode?: number;
    message: string;
    data?: {
        accessToken?: string;
        refreshToken?: string;
    };
};

// ============================================
// ✅ FIXED: Login Action
// ============================================

export const loginAction = async (
    prevState: LoginState,  // ✅ redirectTo সরিয়ে দিয়েছি
    formData: FormData
): Promise<LoginState> => {
    try {
        // ✅ FIXED: Email/Password Type
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        // ✅ Validation
        if (!email || !password) {
            return {
                success: false,
                statusCode: 400,
                message: "Email and password are required",
            };
        }

        console.log("🔍 Sending Login Request:", { email });

        // ✅ FIXED: Environment Variable
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await res.json();
        console.log("📦 Login Response:", JSON.stringify(result, null, 2));

        // ✅ FIXED: Error Handling
        if (!result.success) {
            return {
                success: false,
                statusCode: result.statusCode || 401,
                message: result.message || "Invalid credentials",
            };
        }

        // ✅ Get Tokens
        const accessToken = result?.data?.accessToken;
        const refreshToken = result?.data?.refreshToken;

        if (!accessToken) {
            return {
                success: false,
                statusCode: 500,
                message: "No access token received from server",
            };
        }

        // ✅ FIXED: Cookies Set (Secure added)
        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: "lax",
            path: "/",
        });

        cookieStore.set("refreshToken", refreshToken || "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
            path: "/",
        });

        console.log("✅ Cookies Set Successfully");

        // ✅ Decode Token
        const decodedToken = jwt.decode(accessToken) as JwtPayload;
        console.log("👤 Decoded Token:", decodedToken);

        const role = decodedToken?.role || "CUSTOMER";
        console.log("🎭 User Role:", role);

        // ✅ FIXED: Role-based Redirect (আপনার মতো)
        // আপনি যদি redirectTo চান তাহলে:
        // if (redirectTo && typeof redirectTo === "string" && redirectTo.startsWith("/") && !redirectTo.startsWith("//")){
        //     redirect(redirectTo)
        // }

        if (role === "ADMIN") {
            redirect("/admin_dashboard");
        } else if (role === "TECHNICIAN") {
            redirect("/technician_dashboard");
        } else if (role === "AUTHOR") {
            redirect("/author_dashboard");
        } else {
            redirect("/customer_dashboard");
        }

        // ✅ This won't execute
        return {
            success: true,
            statusCode: 200,
            message: result.message || "Login successful",
            data: {
                accessToken,
                refreshToken,
            },
        };

    } catch (error) {
        console.error("Login error:", error);

        // ✅ Handle redirect error
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
            throw error;
        }

        return {
            success: false,
            statusCode: 500,
            message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        };
    }
};

// ============================================
// REGISTER (আপনার Code এ যোগ করেছি)
// ============================================

export type RegisterState = {
    success: boolean;
    statusCode?: number;
    message?: string;
    errors?: { field: string; message: string }[];
    data?: any;
};

export async function registerUser(
    prevState: RegisterState | undefined,
    formData: FormData
): Promise<RegisterState> {
    try {
        const raw = {
            name: formData.get("name")?.toString() || "",
            email: formData.get("email")?.toString() || "",
            phone: formData.get("phone")?.toString() || "",
            location: formData.get("location")?.toString() || "",
            password: formData.get("password")?.toString() || "",
            confirmPassword: formData.get("confirmPassword")?.toString() || "",
            role: (formData.get("role")?.toString() || "CUSTOMER") as "CUSTOMER" | "TECHNICIAN",
        };

        const response = await fetch(
            `${process.env.BACKEND_API_URL}/api/auth/register`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: raw.name,
                    email: raw.email,
                    phone: raw.phone,
                    location: raw.location,
                    password: raw.password,
                    role: raw.role,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                statusCode: response.status,
                errors: [{ field: "general", message: data.message || "Registration failed" }],
                data: raw,
            };
        }

        return {
            success: true,
            statusCode: 200,
            message: data.message || "Registration successful!",
            data: { name: raw.name, email: raw.email, phone: raw.phone, location: raw.location, role: raw.role },
        };

    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            statusCode: 500,
            errors: [{ field: "general", message: "Something went wrong. Please try again." }],
        };
    }
}