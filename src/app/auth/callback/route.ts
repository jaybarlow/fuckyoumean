import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/profile';
  
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid or no code, redirect to home
  if (!code || !supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    console.error('Missing code or invalid Supabase credentials');
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }
  
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          async get(name: string) {
            const cookies = await cookieStore;
            return cookies.get(name)?.value;
          },
          async set(name: string, value: string, options: any) {
            const cookies = await cookieStore;
            cookies.set({ name, value, ...options });
          },
          async remove(name: string, options: any) {
            const cookies = await cookieStore;
            cookies.delete({ name, ...options });
          },
        },
      }
    );
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error.message);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
    }
    
    if (!data.session) {
      console.error('No session returned from exchangeCodeForSession');
      return NextResponse.redirect(new URL('/login?error=no_session', request.url));
    }
    
    // Check if this is a valid redirect URL (security measure)
    let redirectTo = next;
    if (!redirectTo.startsWith('/')) {
      // Only allow relative URLs for security
      redirectTo = '/profile';
    }
    
    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error: any) {
    console.error('Error in auth callback:', error);
    // In case of error, redirect to login with error message
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message || 'Unknown error')}`, request.url));
  }
} 