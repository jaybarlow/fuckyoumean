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
    const full_name = formData.get('full_name') as string;
    const website = formData.get('website') as string;
    const bio = formData.get('bio') as string;
    const twitter = formData.get('twitter') as string;
    const linkedin = formData.get('linkedin') as string;
    const github = formData.get('github') as string;
    
    // Handle avatar file upload
    const avatarFile = formData.get('avatar') as File;
    let avatar_url = '';
    
    // Check if a new avatar was uploaded
    if (avatarFile && avatarFile.size > 0) {
      try {
        // First, check if the avatars bucket exists
        const { data: buckets, error: bucketsError } = await supabase
          .storage
          .listBuckets();
        
        if (bucketsError) {
          console.error('Error listing buckets:', bucketsError);
          return {
            success: false,
            error: `Error checking storage buckets: ${bucketsError.message}`
          };
        }
        
        // Check if avatars bucket exists
        const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars');
        
        if (!avatarsBucket) {
          console.error('Avatars bucket not found, attempting to create it');
          
          // Try to create the bucket
          const { error: createBucketError } = await supabase
            .storage
            .createBucket('avatars', {
              public: true,
              fileSizeLimit: 2 * 1024 * 1024 // 2MB
            });
          
          if (createBucketError) {
            console.error('Error creating avatars bucket:', createBucketError);
            return {
              success: false,
              error: `Error creating avatars bucket: ${createBucketError.message}`
            };
          }
        }
        
        // Generate a unique filename
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        
        // Upload the file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          return {
            success: false,
            error: `Error uploading avatar: ${uploadError.message}`
          };
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        avatar_url = publicUrl;
      } catch (uploadError: any) {
        console.error('Exception during avatar upload:', uploadError);
        return {
          success: false,
          error: `Error processing avatar: ${uploadError.message || 'Unknown error'}`
        };
      }
    } else {
      // If no new avatar, get the current one from the profile
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();
      
      avatar_url = currentProfile?.avatar_url || '';
    }
    
    const updates = {
      id: userId,
      username,
      full_name,
      website,
      avatar_url,
      bio,
      twitter,
      linkedin,
      github,
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