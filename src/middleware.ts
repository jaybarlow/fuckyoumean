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

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid, just continue without auth checks
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    console.error('Invalid Supabase credentials in middleware');
    return res;
  }
  
  // Create a Supabase client
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  try {
    // Check if the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Protected routes that require authentication
    const protectedRoutes = ['/profile'];
    const isProtectedRoute = protectedRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );

    // If accessing a protected route without being authenticated, redirect to login
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If already logged in and trying to access login page, redirect to profile
    if (session && req.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
  } catch (error) {
    console.error('Error in middleware:', error);
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/profile/:path*', '/login'],
}; 