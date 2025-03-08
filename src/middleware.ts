import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // This is used for setting cookies in the browser which we don't need in middleware
        },
        remove(name: string, options: any) {
          // This is used for removing cookies in the browser which we don't need in middleware
        },
      },
    }
  );

  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession();

  // Check if the user is authenticated
  const isAuthenticated = !!session;

  // Define protected routes
  const protectedRoutes = ['/profile', '/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Define auth routes (login, signup, etc.)
  const authRoutes = ['/login', '/forgot-password', '/auth/reset-password'];
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is authenticated and trying to access an auth route, redirect to profile
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

// Only run middleware on specific routes
export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*',
    '/login',
    '/forgot-password',
    '/auth/reset-password',
  ],
}; 