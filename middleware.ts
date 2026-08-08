// import { NextResponse, type NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';

// const AUTH_ROUTES = ['/login', '/register'];
// const PUBLIC_ROUTES = ['/', '/services', '/technicians','/payment','/payment/success',  
//   '/payment/cancel'  ];

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
//   const accessToken = request.cookies.get('accessToken')?.value;

//   console.log('🔍 Path:', pathname, '| Token:', accessToken ? '✅' : '❌');

//   // Public routes
//   const isPublic = PUBLIC_ROUTES.some(
//     (route) => pathname === route || pathname.startsWith(route + '/')
//   );

//   const isAuthRoute = AUTH_ROUTES.some(
//     (route) => pathname === route || pathname.startsWith(route + '/')
//   );

//   if (isPublic || isAuthRoute) {
//     return NextResponse.next();
//   }

//   // Protected routes
//   if (!accessToken) {
//     console.log('❌ No token');
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // Decode token
//   try {
//     const decoded = jwt.decode(accessToken) as any;

//     if (!decoded) {
//       throw new Error('Invalid token');
//     }

//     // Check expiry
//     if (decoded.exp && decoded.exp * 1000 < Date.now()) {
//       console.log('❌ Token expired');
//       const response = NextResponse.redirect(new URL('/login', request.url));
//       response.cookies.delete('accessToken');
//       response.cookies.delete('refreshToken');
//       return response;
//     }

//     const role = decoded?.role;
//     console.log('✅ Role:', role);

//     // Role-based access
//     if (pathname.startsWith('/admin_dashboard') && role !== 'ADMIN') {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//     if (pathname.startsWith('/technician_dashboard') && role !== 'TECHNICIAN') {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//     if (pathname.startsWith('/customer_dashboard') && role !== 'CUSTOMER') {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.error('❌ Error:', error);
//     const response = NextResponse.redirect(new URL('/login', request.url));
//     response.cookies.delete('accessToken');
//     response.cookies.delete('refreshToken');
//     return response;
//   }
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

//8/8/26 time 7.09

// import { NextResponse, type NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';

// const AUTH_ROUTES = ['/login', '/register'];
// const PUBLIC_ROUTES = ['/', '/services', '/technicians', '/payment', '/payment/success', '/payment/cancel'];

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
//   const accessToken = request.cookies.get('accessToken')?.value;

//   console.log('🔍 Path:', pathname, '| Token:', accessToken ? '✅' : '❌');

//   const isPublic = PUBLIC_ROUTES.some(
//     (route) => pathname === route || pathname.startsWith(route + '/')
//   );

//   const isAuthRoute = AUTH_ROUTES.some(
//     (route) => pathname === route || pathname.startsWith(route + '/')
//   );

//   // ✅ FIXED: If token exists and trying to access auth route → redirect to dashboard
//   if (accessToken && isAuthRoute) {
//     console.log('🔄 Token exists, redirecting from auth route');
//     try {
//       const decoded = jwt.decode(accessToken) as any;
//       const role = decoded?.role || 'CUSTOMER';

//       if (role === 'ADMIN') {
//         return NextResponse.redirect(new URL('/admin_dashboard', request.url));
//       } else if (role === 'TECHNICIAN') {
//         return NextResponse.redirect(new URL('/technician_dashboard', request.url));
//       } else {
//         return NextResponse.redirect(new URL('/customer_dashboard', request.url));
//       }
//     } catch (error) {
//       // Invalid token - clear and proceed
//       const response = NextResponse.next();
//       response.cookies.delete('accessToken');
//       response.cookies.delete('refreshToken');
//       return response;
//     }
//   }

//   // ✅ Public routes - allow access
//   if (isPublic) {
//     return NextResponse.next();
//   }

//   // ✅ Auth routes without token - allow access
//   if (isAuthRoute) {
//     return NextResponse.next();
//   }

//   // ✅ Protected routes - check token
//   if (!accessToken) {
//     console.log('❌ No token');
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // Decode token
//   try {
//     const decoded = jwt.decode(accessToken) as any;

//     if (!decoded) {
//       throw new Error('Invalid token');
//     }

//     // Check expiry
//     if (decoded.exp && decoded.exp * 1000 < Date.now()) {
//       console.log('❌ Token expired');
//       const response = NextResponse.redirect(new URL('/login', request.url));
//       response.cookies.delete('accessToken');
//       response.cookies.delete('refreshToken');
//       return response;
//     }

//     const role = decoded?.role;
//     console.log('✅ Role:', role);

//     // Role-based access
//     if (pathname.startsWith('/admin_dashboard') && role !== 'ADMIN') {
//       return NextResponse.redirect(new URL('/not-found', request.url));
//     }
//     if (pathname.startsWith('/technician_dashboard') && role !== 'TECHNICIAN') {
//       return NextResponse.redirect(new URL('/not-found', request.url));
//     }
//     if (pathname.startsWith('/customer_dashboard') && role !== 'CUSTOMER') {
//       return NextResponse.redirect(new URL('/not-found', request.url));
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.error('❌ Error:', error);
//     const response = NextResponse.redirect(new URL('/login', request.url));
//     response.cookies.delete('accessToken');
//     response.cookies.delete('refreshToken');
//     return response;
//   }
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };



import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ROUTES = ['/', '/services', '/technicians', '/payment', '/payment/success', '/payment/cancel'];

export async function middleware(request: NextRequest) {  // ✅ async যোগ করো
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessToken')?.value;

  console.log('🔍 Path:', pathname, '| Token:', accessToken ? '✅' : '❌');

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // ✅ যদি token থাকে এবং login/register page এ যাচ্ছে → dashboard এ redirect
  if (accessToken && isAuthRoute) {
    console.log('🔄 Token exists, redirecting from auth route');
    try {
      const decoded = jwt.decode(accessToken) as any;
      const role = decoded?.role || 'CUSTOMER';

      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin_dashboard', request.url));
      } else if (role === 'TECHNICIAN') {
        return NextResponse.redirect(new URL('/technician_dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/customer_dashboard', request.url));
      }
    } catch (error) {
      const response = NextResponse.next();
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  // ✅ Public routes - allow করো
  if (isPublic) {
    return NextResponse.next();
  }

  // ✅ Auth routes without token - allow করো
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // ✅ Protected routes - token check করো
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

    // ✅ Token expire check + Refresh logic
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.log('🔄 Token expired, trying to refresh...');
      
      try {
        const refreshToken = request.cookies.get('refreshToken')?.value;
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // ✅ Backend থেকে নতুন token নাও
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cookie": `refreshToken=${refreshToken}`
            }
          }
        );

        const refreshData = await refreshRes.json();

        if (refreshData.success && refreshData?.data?.accessToken) {
          console.log("✅ Token Refreshed Successfully");
          const response = NextResponse.next();
          response.cookies.set('accessToken', refreshData.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
            path: "/"
          });
          return response;
        }
      } catch (error) {
        console.error("❌ Refresh failed:", error);
      }

      // ❌ Refresh fail হলে login এ পাঠাও
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    const role = decoded?.role;
    console.log('✅ Role:', role);

    // Role-based access
    if (pathname.startsWith('/admin_dashboard') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
    if (pathname.startsWith('/technician_dashboard') && role !== 'TECHNICIAN') {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
    if (pathname.startsWith('/customer_dashboard') && role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/not-found', request.url));
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