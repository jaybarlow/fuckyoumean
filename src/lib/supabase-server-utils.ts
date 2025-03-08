import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Validate URL format
export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Create a type-safe response object
export type ServerActionResponse<T = undefined> = 
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; message?: string };

// Create a server-side Supabase client
export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid, throw error
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    throw new Error('Invalid Supabase configuration. Please check your environment variables.');
  }
  
  const cookieStore = cookies();
  
  return createServerClient(
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
}

// Helper function to handle errors in server actions
export function handleServerActionError(error: any): ServerActionResponse {
  console.error('Server action error:', error);
  return { 
    success: false, 
    error: error.message || 'An unexpected error occurred' 
  };
} 