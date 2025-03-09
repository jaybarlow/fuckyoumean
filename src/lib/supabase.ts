'use client';

import { createBrowserClient } from '@supabase/ssr';

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
const createDummyClient = () => {
  console.error(
    'Invalid Supabase credentials. Please update your .env.local file with valid credentials.'
  );
  
  // Return a mock client that doesn't throw errors but doesn't do anything
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { session: null }, error: { message: 'Invalid Supabase credentials' } }),
      signUp: () => Promise.resolve({ data: { session: null }, error: { message: 'Invalid Supabase credentials' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      admin: {
        updateUserById: () => Promise.resolve({ error: { message: 'This is a development feature and requires Supabase configuration' } }),
      }
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

// Create the Supabase client with validation
const supabaseClient = !supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)
  ? createDummyClient()
  : createBrowserClient(supabaseUrl, supabaseAnonKey);

// Add development-only admin functions
if (process.env.NODE_ENV === 'development' && !supabaseClient.auth.admin) {
  // @ts-ignore - Add mock admin functions for development
  supabaseClient.auth.admin = {
    updateUserById: () => {
      console.log('Development mode: Simulating user confirmation');
      // In development, redirect to Supabase dashboard
      window.open('https://app.supabase.com/project/yrjuwkopkdwkcqvbnzbc/auth/users', '_blank');
      return Promise.resolve({ 
        data: { user: null },
        error: { 
          message: 'In development mode, please confirm users through the Supabase dashboard' 
        } 
      });
    }
  };
}

export const supabase = supabaseClient; 