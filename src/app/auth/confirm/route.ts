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
  const token = requestUrl.searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
  }
  
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid, redirect to login
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    console.error('Invalid Supabase configuration');
    return NextResponse.redirect(new URL('/login?error=invalid_config', request.url));
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
    
    // Manually verify the token by redirecting to the Supabase verification URL
    const verificationUrl = `${supabaseUrl}/auth/v1/verify?token=${token}&type=signup&redirect_to=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`)}`;
    
    return NextResponse.redirect(verificationUrl);
  } catch (error: any) {
    console.error('Error in confirm route:', error);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message || 'Unknown error')}`, request.url));
  }
} 