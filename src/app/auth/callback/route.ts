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
  
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid or no code, redirect to home
  if (!code || !supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    return NextResponse.redirect(new URL('/', request.url));
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
    
    await supabase.auth.exchangeCodeForSession(code);
  } catch (error) {
    console.error('Error in auth callback:', error);
    // In case of error, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/profile', request.url));
} 