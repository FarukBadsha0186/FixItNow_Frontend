// "use server"

// import { revalidateTag } from "next/cache";
// import { redirect } from "next/dist/server/api-utils";
// import { cookies } from "next/headers";
// // import { redirect } from "next/navigation";

// export const logout = async () => {
//     const cookieStore = await cookies();
    
//     cookieStore.delete("accessToken");
//     cookieStore.delete("refreshToken");

//     revalidateTag("my-profile", "max");
//    //  redirect("/login");
// }


"use server"

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const logout = async () => {
    try {
        const cookieStore = await cookies();
        
        // ✅ Cookies delete করো
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        console.log("✅ Logged out successfully");
        
        // ✅ Login page এ redirect করো
        redirect("/login");
        
    } catch (error) {
        console.error("Logout error:", error);
        
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
            throw error;
        }
        
        throw error;
    }
}