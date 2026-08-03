// proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtUtils } from './utils/jwt';

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/services", "/technicians"];

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get("accessToken")?.value;

    console.log("🔍 Middleware - Path:", pathname);
    console.log("🔍 AccessToken:", accessToken ? "✅ Found" : "❌ Not Found");

    const isPublic = PUBLIC_ROUTES.some((route) => 
        pathname === route || pathname.startsWith(route + "/")
    );

    const isAuthRoute = AUTH_ROUTES.some((route) => 
        pathname === route || pathname.startsWith(route + "/")
    );

    // ✅ If has token and on auth route → redirect to dashboard
    if (accessToken && isAuthRoute) {
        try {
            const decoded = jwtUtils.verifyToken(
                accessToken, 
                process.env.JWT_ACCESS_SECRET as string
            );
            
            if (decoded.success) {
                const role = (decoded.data as any)?.role;
                let redirectUrl = '/customer_dashboard';
                if (role === "ADMIN") redirectUrl = '/admin_dashboard';
                if (role === "TECHNICIAN") redirectUrl = '/technician_dashboard';
                
                console.log("🔀 Redirecting to:", redirectUrl);
                return NextResponse.redirect(new URL(redirectUrl, request.url));
            }
        } catch (error) {
            console.error("Token verification failed:", error);
        }
    }

    // ✅ Public routes
    if (isPublic || isAuthRoute) {
        return NextResponse.next();
    }

    // ✅ Protected routes - check token
    if (!accessToken) {
        console.log("❌ No Token, Redirecting to Login");
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // ✅ Verify token for protected routes
    try {
        const decoded = jwtUtils.verifyToken(
            accessToken, 
            process.env.JWT_ACCESS_SECRET as string
        );
        
        if (!decoded.success) {
            console.log("❌ Invalid Token, Redirecting to Login");
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
            return response;
        }

        // ✅ Role-based access
        const role = (decoded.data as any)?.role;
        if (pathname.startsWith("/admin_dashboard") && role !== "ADMIN") {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (pathname.startsWith("/technician_dashboard") && role !== "TECHNICIAN") {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (pathname.startsWith("/customer_dashboard") && role !== "CUSTOMER") {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ]
};