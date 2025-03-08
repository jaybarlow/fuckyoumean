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
    // Manually redirect to the Supabase reset password URL
    const resetUrl = `${supabaseUrl}/auth/v1/verify?token=${token}&type=recovery&redirect_to=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`)}`;
    
    return NextResponse.redirect(resetUrl);
  } catch (error: any) {
    console.error('Error in reset route:', error);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message || 'Unknown error')}`, request.url));
  }
} 