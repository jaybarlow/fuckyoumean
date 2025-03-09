# Storage Setup Guide for Avatars

This guide explains how to set up the storage bucket for avatar uploads in your Supabase project.

## Setting Up the Avatars Storage Bucket

1. **Log in to your Supabase Dashboard**
   - Go to [https://app.supabase.com/](https://app.supabase.com/)
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar

3. **Create the Avatars Bucket**
   - Click "New Bucket"
   - Enter "avatars" as the bucket name (must be exactly this name)
   - Enable "Public bucket" option
   - Click "Create bucket"

4. **Set Up Bucket Policies**
   - After creating the bucket, click on the "avatars" bucket
   - Go to the "Policies" tab
   - Click "Add Policies"

5. **Create Upload Policy**
   - Select "INSERT" operation
   - Policy name: "Avatar uploads"
   - Policy definition: `auth.uid() IS NOT NULL`
   - This allows any authenticated user to upload files
   - Click "Save policy"

6. **Create View Policy**
   - Select "SELECT" operation
   - Policy name: "Public avatar access"
   - Policy definition: `true`
   - This allows anyone to view the avatars
   - Click "Save policy"

## Troubleshooting

If you encounter the error "The avatars storage bucket has not been set up" when trying to upload an avatar, it means the bucket hasn't been created or the policies aren't set up correctly.

Follow the steps above to create the bucket and set up the necessary policies.

## Security Considerations

- The avatars bucket is set to public to allow avatar images to be displayed without authentication
- Only authenticated users can upload files
- Consider adding file type restrictions if needed for additional security 