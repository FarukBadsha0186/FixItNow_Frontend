"use server"

import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value || null;

    if (!refreshToken) {
        return {
            success: false,
            message: "Refresh token not found!"
        }
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`
            },
            cache: "no-cache",
        });

        const result = await res.json();

        // ✅ নতুন token পেলে SET করো
        if (result.success && result?.data?.accessToken) {
            const newAccessToken = result.data.accessToken;
            
            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
                sameSite: "lax",
                path: "/",
            });

            console.log("✅ New Access Token Set Successfully");
        }

        return result;

    } catch (error) {
        console.error("Token refresh error:", error);
        return {
            success: false,
            message: "Token refresh failed"
        }
    }
}