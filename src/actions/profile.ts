'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export async function updateProfile(formData: FormData) {
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
    // Get the authenticated user (more secure than using session)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'Not authenticated' };
    }
    
    const userId = user.id;
    const username = formData.get('username') as string;
    const fullName = formData.get('fullName') as string;
    const website = formData.get('website') as string;
    const avatarUrl = formData.get('avatarUrl') as string;
    
    const updates = {
      id: userId,
      username,
      full_name: fullName,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };
    
    // First check if the profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    let result;
    
    if (!existingProfile) {
      // If profile doesn't exist, insert it
      result = await supabase
        .from('profiles')
        .insert(updates);
    } else {
      // If profile exists, update it
      result = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
    }
    
    if (result.error) throw result.error;
    
    // Revalidate the profile page to show updated data
    revalidatePath('/profile');
    
    return { success: 'Profile updated successfully!' };
  } catch (error: any) {
    console.error('Profile update error:', error);
    return { error: error.message || 'Error updating profile' };
  }
} 