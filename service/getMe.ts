

// "use server"

// import { cookies } from "next/headers";

// export const getMe = async () => {
//     const cookieStore = await cookies();

//     const accessToken = cookieStore.get("accessToken")?.value || null;

//     if(!accessToken){
//         // throw new Error("User Not Logged In!");

//         return {
//             success : false,
//             message : "User not logged in!"
//         }
//     }

//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/me`, {
//         headers : {
//             // Authorization : accessToken as unknown as string,
//             // Authorization : `${accessToken}`,
//             // Authorization : `Bearer ${accessToken}`

//             Cookie : `accessToken=${accessToken}`
//         },

//         cache : "force-cache",
//         next : {
//             revalidate : 60 * 60 * 24, // 1day
//             tags : ["my-profile"]
//         }
//     });

//     const result = res.json();


//     return result
// }


"use server"

import { cookies } from "next/headers";

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!"
        }
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/me`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`  // ✅ এটা change করো
            },
            cache: "force-cache",
            next: {
                revalidate: 60 * 60 * 24, // 1day
                tags: ["my-profile"]
            }
        });

        const result = await res.json();

        return result

    } catch (error) {
        console.error("Get user error:", error);
        return {
            success: false,
            message: "Failed to fetch user data"
        }
    }
}