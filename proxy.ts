
import { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtUtils } from './utils/jwt'
import { getNewAccessToken } from './service/refreshToken'

const AUTH_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = ["/", "/services", "/technicians", "/technicians/:path*", "/login", "/register"]

export async function proxy(request: NextRequest) {
    console.log("Proxy")
    const pathname = request.nextUrl.pathname;
    const cookieStore = await cookies();
    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // ✅ Check if route is public FIRST
    const isPublic = PUBLIC_ROUTES.some((route) => {
        if (route.includes(":path*")) {
            const baseRoute = route.replace("/:path*", "")
            return pathname === baseRoute || pathname.startsWith(baseRoute + "/")
        }
        return pathname === route || pathname.startsWith(route + "/")
    });
    
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

    // ✅ Allow public routes without token check
    if (isPublic || isAuthRoute) {
        return NextResponse.next()
    }

    // ✅ Now check token for protected routes
    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;
    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

    // ✅ Refresh token logic
    if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
        const result = await getNewAccessToken();
        if (result.success) {
            const newAccessToken = result.data.accessToken;
            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
            });
            accessToken = newAccessToken;
            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);
        }
    }

    let userRole = null;
    
    // ✅ If token invalid → redirect to login (only for protected routes)
    if (!decodedAccessToken?.success) {
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (decodedAccessToken?.success && decodedAccessToken.data) {
        userRole = (decodedAccessToken.data as JwtPayload).role;
    }

    console.log("DEBUG:", JSON.stringify({ pathname, userRole, tokenValid: decodedAccessToken?.success }));

    // ✅ Redirect logged-in users from auth routes
    if (accessToken && isAuthRoute) {
        if (userRole === "CUSTOMER") {
            return NextResponse.redirect(new URL('/customer_dashboard', request.url));
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL('/admin_dashboard', request.url));
        } else if (userRole === "TECHNICIAN") {
            return NextResponse.redirect(new URL('/technician_dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // ✅ Role-based access control
    if (pathname.startsWith("/customer_dashboard") && userRole !== "CUSTOMER") {
        return NextResponse.redirect(new URL('/login', request.url));
    } else if (pathname.startsWith("/admin_dashboard") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL('/login', request.url));
    } else if (pathname.startsWith("/technician_dashboard") && userRole !== "TECHNICIAN") {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ]
}