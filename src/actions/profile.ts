'use server';

import { revalidatePath } from 'next/cache';
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

export async function updateProfile(formData: FormData): Promise<ServerActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { 
        success: false, 
        error: 'Not authenticated' 
      };
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
    
    if (result.error) {
      return {
        success: false,
        error: result.error.message
      };
    }
    
    // Revalidate the profile page to show updated data
    revalidatePath('/profile');
    
    return { 
      success: true, 
      message: 'Profile updated successfully!' 
    };
  } catch (error: any) {
    return handleServerActionError(error);
  }
} 