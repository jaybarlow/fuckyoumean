'use server';

import { redirect } from 'next/navigation';
import { 
  createServerSupabaseClient, 
  handleServerActionError,
  ServerActionResponse 
} from '@/lib/supabase-server-utils';

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
export async function confirmUserManually(email: string): Promise<ServerActionResponse> {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return { 
      success: false, 
      error: 'This function is only available in development mode' 
    };
  }
  
  try {
    const supabase = await createServerSupabaseClient();
    
    // First, get the user by email
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    
    if (fetchError) {
      return { 
        success: false, 
        error: 'Failed to find user. Admin API might not be available in development mode.' 
      };
    }
    
    if (!users || users.users.length === 0) {
      return { 
        success: false, 
        error: 'User not found with that email.' 
      };
    }
    
    // Find the user with matching email
    const user = users.users.find(u => u.email === email);
    if (!user) {
      return { 
        success: false, 
        error: 'User not found with that email.' 
      };
    }
    
    const userId = user.id;
    
    // Now confirm the user
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );
    
    if (error) {
      return { 
        success: false, 
        error: 'Failed to confirm user', 
        message: 'Please visit the Supabase dashboard to confirm your user: https://app.supabase.com/project/yrjuwkopkdwkcqvbnzbc/auth/users' 
      };
    }
    
    return { 
      success: true, 
      message: 'User confirmed successfully! You can now log in.' 
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'An error occurred', 
      message: 'Please visit the Supabase dashboard to confirm your user: https://app.supabase.com/project/yrjuwkopkdwkcqvbnzbc/auth/users' 
    };
  }
}

export async function signIn(formData: FormData): Promise<ServerActionResponse> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      return { 
        success: false, 
        error: 'Email and password are required' 
      };
    }
    
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { success: true };
  } catch (error: any) {
    return handleServerActionError(error);
  }
}

export async function signUp(formData: FormData): Promise<ServerActionResponse> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      return { 
        success: false, 
        error: 'Email and password are required' 
      };
    }
    
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
    
    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: true, 
      message: 'Check your email for the confirmation link! If you don\'t receive an email, please check your spam folder or try again.'
    };
  } catch (error: any) {
    return handleServerActionError(error);
  }
}

export async function signOut() {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
  
  redirect('/');
}

export async function resetPassword(formData: FormData): Promise<ServerActionResponse> {
  try {
    const email = formData.get('email') as string;
    
    if (!email) {
      return { 
        success: false, 
        error: 'Email is required' 
      };
    }
    
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });
    
    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: true, 
      message: 'Check your email for the password reset link! If you don\'t receive an email, please check your spam folder or try again.'
    };
  } catch (error: any) {
    return handleServerActionError(error);
  }
}

export async function updatePassword(formData: FormData): Promise<ServerActionResponse> {
  try {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (!password) {
      return { 
        success: false, 
        error: 'Password is required' 
      };
    }
    
    if (password !== confirmPassword) {
      return { 
        success: false, 
        error: 'Passwords do not match' 
      };
    }
    
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: true, 
      message: 'Password updated successfully!' 
    };
  } catch (error: any) {
    return handleServerActionError(error);
  }
} 