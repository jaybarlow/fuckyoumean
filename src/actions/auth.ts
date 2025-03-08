'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Development-only function to manually confirm a user
export async function confirmUserManually(email: string) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'This function is only available in development mode' };
  }
  
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid, return error
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    return { error: 'Invalid Supabase configuration. Please check your environment variables.' };
  }
  
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
  
  try {
    // First, get the user by email
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    
    if (fetchError) {
      return { error: 'Failed to find user. Admin API might not be available in development mode.' };
    }
    
    if (!users || users.users.length === 0) {
      return { error: 'User not found with that email.' };
    }
    
    // Find the user with matching email
    const user = users.users.find(u => u.email === email);
    if (!user) {
      return { error: 'User not found with that email.' };
    }
    
    const userId = user.id;
    
    // Now confirm the user
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );
    
    if (error) {
      return { 
        error: 'Failed to confirm user', 
        message: 'Please visit the Supabase dashboard to confirm your user: https://app.supabase.com/project/yrjuwkopkdwkcqvbnzbc/auth/users' 
      };
    }
    
    return { success: 'User confirmed successfully! You can now log in.' };
  } catch (error: any) {
    return { 
      error: error.message || 'An error occurred', 
      message: 'Please visit the Supabase dashboard to confirm your user: https://app.supabase.com/project/yrjuwkopkdwkcqvbnzbc/auth/users' 
    };
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid, return error
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    return { error: 'Invalid Supabase configuration. Please check your environment variables.' };
  }
  
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
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { error: error.message };
    }
    
    redirect('/profile');
  } catch (error: any) {
    return { error: error.message || 'An error occurred during sign in' };
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid, return error
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    return { error: 'Invalid Supabase configuration. Please check your environment variables.' };
  }
  
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
  
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { success: 'Check your email for the confirmation link!' };
  } catch (error: any) {
    return { error: error.message || 'An error occurred during sign up' };
  }
}

export async function signOut() {
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid, just redirect to home
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    redirect('/');
  }
  
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
  
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
  
  redirect('/');
}

export async function resetPassword(formData: FormData) {
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid, return error
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    return { error: 'Invalid Supabase configuration. Please check your environment variables.' };
  }
  
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
  
  try {
    const email = formData.get('email') as string;
    
    if (!email) {
      return { error: 'Email is required' };
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { success: 'Check your email for the password reset link!' };
  } catch (error: any) {
    return { error: error.message || 'An error occurred during password reset' };
  }
}

export async function updatePassword(formData: FormData) {
  // Check if Supabase URL and anon key are valid
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If credentials are invalid, return error
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    return { error: 'Invalid Supabase configuration. Please check your environment variables.' };
  }
  
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
  
  try {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (!password) {
      return { error: 'Password is required' };
    }
    
    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' };
    }
    
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { success: 'Password updated successfully!' };
  } catch (error: any) {
    return { error: error.message || 'An error occurred during password update' };
  }
} 