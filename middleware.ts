
import { JwtPayload } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtUtils } from './utils/jwt'
import { getNewAccessToken } from './service/refreshToken'

const AUTH_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = ["/", "/services", "/technicians", "/technicians/:path*"]

export async function middleware(request: NextRequest) {
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