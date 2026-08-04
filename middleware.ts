import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ROUTES = ['/', '/services', '/technicians','/payment',"/payment/success",  
  "/payment/cancel"  ];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessToken')?.value;

  console.log('🔍 Path:', pathname, '| Token:', accessToken ? '✅' : '❌');

  // Public routes
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublic || isAuthRoute) {
    return NextResponse.next();
  }

  // Protected routes
  if (!accessToken) {
    console.log('❌ No token');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Decode token
  try {
    const decoded = jwt.decode(accessToken) as any;

    if (!decoded) {
      throw new Error('Invalid token');
    }

    // Check expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.log('❌ Token expired');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    const role = decoded?.role;
    console.log('✅ Role:', role);

    // Role-based access
    if (pathname.startsWith('/admin_dashboard') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/technician_dashboard') && role !== 'TECHNICIAN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/customer_dashboard') && role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('❌ Error:', error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};