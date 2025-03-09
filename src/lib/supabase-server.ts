import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Check if Supabase URL and anon key are valid
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Create a dummy client if credentials are invalid
const createDummyServerClient = (cookieStore: any) => {
  console.error(
    'Invalid Supabase credentials. Please update your .env.local file with valid credentials.'
  );
  
  // Return a mock client that doesn't throw errors but doesn't do anything
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { session: null }, error: { message: 'Invalid Supabase credentials' } }),
      signUp: () => Promise.resolve({ data: { session: null }, error: { message: 'Invalid Supabase credentials' } }),
      signOut: () => Promise.resolve({ error: null }),
      exchangeCodeForSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Invalid Supabase credentials' } }),
        }),
      }),
      upsert: () => Promise.resolve({ error: { message: 'Invalid Supabase credentials' } }),
    }),
  };
};

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  // Return dummy client if credentials are invalid
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    return createDummyServerClient(cookieStore);
  }
  
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