-- Add new columns to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT;

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Recreate policies
CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload avatars
DROP POLICY IF EXISTS "Avatar uploads" ON storage.objects;
CREATE POLICY "Avatar uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid() IS NOT NULL
);

-- Create policy to allow public access to avatars
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars'); 