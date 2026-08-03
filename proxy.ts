
// // import { JwtPayload } from 'jsonwebtoken'
// // import { cookies } from 'next/headers'
// // import { NextResponse } from 'next/server'
// // import type { NextRequest } from 'next/server'
// // import { jwtUtils } from './utils/jwt'
// // import { getNewAccessToken } from './service/refreshToken'

// // const AUTH_ROUTES = ["/login", "/register"]
// // const PUBLIC_ROUTES = ["/", "/services", "/technicians", "/technicians/:path*", "/login", "/register"]

// // export async function proxy(request: NextRequest) {
// //     console.log("Proxy")
// //     const pathname = request.nextUrl.pathname;
// //     const cookieStore = await cookies();
// //     let accessToken = request.cookies.get("accessToken")?.value;
// //     const refreshToken = request.cookies.get("refreshToken")?.value;

// //     // ✅ Check if route is public FIRST
// //     const isPublic = PUBLIC_ROUTES.some((route) => {
// //         if (route.includes(":path*")) {
// //             const baseRoute = route.replace("/:path*", "")
// //             return pathname === baseRoute || pathname.startsWith(baseRoute + "/")
// //         }
// //         return pathname === route || pathname.startsWith(route + "/")
// //     });
    
// //     const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

// //     // ✅ Allow public routes without token check
// //     if (isPublic || isAuthRoute) {
// //         return NextResponse.next()
// //     }

// //     // ✅ Now check token for protected routes
// //     let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;
// //     const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

// //     // ✅ Refresh token logic
// //     if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
// //         const result = await getNewAccessToken();
// //         if (result.success) {
// //             const newAccessToken = result.data.accessToken;
// //             cookieStore.set("accessToken", newAccessToken, {
// //                 httpOnly: true,
// //                 maxAge: 60 * 60 * 24,
// //                 sameSite: "lax",
// //             });
// //             accessToken = newAccessToken;
// //             decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);
// //         }
// //     }

// //     let userRole = null;
    
// //     // ✅ If token invalid → redirect to login (only for protected routes)
// //     if (!decodedAccessToken?.success) {
// //         cookieStore.delete("accessToken");
// //         cookieStore.delete("refreshToken");
// //         return NextResponse.redirect(new URL('/login', request.url));
// //     }

// //     if (decodedAccessToken?.success && decodedAccessToken.data) {
// //         userRole = (decodedAccessToken.data as JwtPayload).role;
// //     }

// //     console.log("DEBUG:", JSON.stringify({ pathname, userRole, tokenValid: decodedAccessToken?.success }));

// //     // ✅ Redirect logged-in users from auth routes
// //     if (accessToken && isAuthRoute) {
// //         if (userRole === "CUSTOMER") {
// //             return NextResponse.redirect(new URL('/customer_dashboard', request.url));
// //         } else if (userRole === "ADMIN") {
// //             return NextResponse.redirect(new URL('/admin_dashboard', request.url));
// //         } else if (userRole === "TECHNICIAN") {
// //             return NextResponse.redirect(new URL('/technician_dashboard', request.url));
// //         } else {
// //             return NextResponse.redirect(new URL('/', request.url));
// //         }
// //     }

// //     // ✅ Role-based access control
// //     if (pathname.startsWith("/customer_dashboard") && userRole !== "CUSTOMER") {
// //         return NextResponse.redirect(new URL('/login', request.url));
// //     } else if (pathname.startsWith("/admin_dashboard") && userRole !== "ADMIN") {
// //         return NextResponse.redirect(new URL('/login', request.url));
// //     } else if (pathname.startsWith("/technician_dashboard") && userRole !== "TECHNICIAN") {
// //         return NextResponse.redirect(new URL('/login', request.url));
// //     }

// //     return NextResponse.next();
// // }

// // export const config = {
// //     matcher: [
// //         '/((?!api|_next/static|_next/image|.*\\.png$).*)',
// //     ]
// // }


// import { JwtPayload } from 'jsonwebtoken'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { jwtUtils } from './utils/jwt'
// import { getNewAccessToken } from './service/refreshToken'

// const AUTH_ROUTES = ["/login", "/register"]
// const PUBLIC_ROUTES = ["/", "/services", "/technicians", "/technicians/:path*", "/login", "/register"]

// export async function proxy(request: NextRequest) {
//     const pathname = request.nextUrl.pathname;
//     let accessToken = request.cookies.get("accessToken")?.value;
//     const refreshToken = request.cookies.get("refreshToken")?.value;

//     const isPublic = PUBLIC_ROUTES.some((route) => {
//         if (route.includes(":path*")) {
//             const baseRoute = route.replace("/:path*", "")
//             return pathname === baseRoute || pathname.startsWith(baseRoute + "/")
//         }
//         return pathname === route || pathname.startsWith(route + "/")
//     });

//     const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

//     if (isPublic || isAuthRoute) {
//         // এখানেও যদি accessToken valid থাকে auth route এ, লগইন করা user কে dashboard এ পাঠানো দরকার
//         // (নিচের auth-route redirect logic টা public early-return এর কারণে কখনোই রান হচ্ছে না — এটাও একটা বাগ, নিচে দেখুন)
//         return NextResponse.next()
//     }

//     let response = NextResponse.next(); // ✅ প্রথমেই response object বানিয়ে নিন

//     let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;
//     const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

//     if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
//         const result = await getNewAccessToken();
//         if (result.success) {
//             const newAccessToken = result.data.accessToken;

//             // ✅ response.cookies.set ব্যবহার করুন, cookieStore.set নয়
//             response.cookies.set("accessToken", newAccessToken, {
//                 httpOnly: true,
//                 maxAge: 60 * 60 * 24,
//                 sameSite: "lax",
//                 path: "/",
//             });

//             accessToken = newAccessToken;
//             decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);
//         }
//     }

//     let userRole = null;

//     if (!decodedAccessToken?.success) {
//         const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
//         redirectResponse.cookies.delete("accessToken");
//         redirectResponse.cookies.delete("refreshToken");
//         return redirectResponse; // ✅ delete করা cookie সহ redirect response রিটার্ন করুন
//     }

//     if (decodedAccessToken?.success && decodedAccessToken.data) {
//         userRole = (decodedAccessToken.data as JwtPayload).role;
//     }

//     if (pathname.startsWith("/customer_dashboard") && userRole !== "CUSTOMER") {
//         return NextResponse.redirect(new URL('/login', request.url));
//     } else if (pathname.startsWith("/admin_dashboard") && userRole !== "ADMIN") {
//         return NextResponse.redirect(new URL('/login', request.url));
//     } else if (pathname.startsWith("/technician_dashboard") && userRole !== "TECHNICIAN") {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     return response; // ✅ যেই response এ নতুন accessToken cookie attach আছে সেটাই রিটার্ন করুন
// }

// export const config = {
//     matcher: [
//         '/((?!api|_next/static|_next/image|.*\\.png$).*)',
//     ]
// }

import { JwtPayload } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtUtils } from './utils/jwt'
import { getNewAccessToken } from './service/refreshToken'

const AUTH_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = ["/", "/services", "/technicians", "/technicians/:path*"]

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const isPublic = PUBLIC_ROUTES.some((route) => {
        if (route.includes(":path*")) {
            const baseRoute = route.replace("/:path*", "")
            return pathname === baseRoute || pathname.startsWith(baseRoute + "/")
        }
        return pathname === route || pathname.startsWith(route + "/")
    });

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

    let response = NextResponse.next();

    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;
    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

    if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
        const result = await getNewAccessToken();
        if (result.success) {
            const newAccessToken = result.data.accessToken;
            response.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
                path: "/",
            });
            accessToken = newAccessToken;
            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);
        }
    }

    // logged-in user auth route এ গেলে dashboard এ পাঠানো (এখন public route থেকে আলাদা করে check হচ্ছে)
    if (accessToken && decodedAccessToken?.success && isAuthRoute) {
        const role = (decodedAccessToken.data as JwtPayload)?.role;
        if (role === "CUSTOMER") return NextResponse.redirect(new URL('/customer_dashboard', request.url));
        if (role === "ADMIN") return NextResponse.redirect(new URL('/admin_dashboard', request.url));
        if (role === "TECHNICIAN") return NextResponse.redirect(new URL('/technician_dashboard', request.url));
    }

    if (isPublic || isAuthRoute) {
        return response;
    }

    if (!decodedAccessToken?.success) {
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.cookies.delete("accessToken");
        redirectResponse.cookies.delete("refreshToken");
        return redirectResponse;
    }

    const userRole = (decodedAccessToken.data as JwtPayload)?.role;

    if (pathname.startsWith("/customer_dashboard") && userRole !== "CUSTOMER") {
        return NextResponse.redirect(new URL('/login', request.url));
    } else if (pathname.startsWith("/admin_dashboard") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL('/login', request.url));
    } else if (pathname.startsWith("/technician_dashboard") && userRole !== "TECHNICIAN") {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ]
}