# Supabase Migration Guide

This guide explains how to apply the database migrations to your Supabase project.

## Applying the Profile Table Updates

To add the new columns to the profiles table, follow these steps:

1. Log in to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Go to the SQL Editor in the left sidebar
4. Create a new query
5. Copy and paste the following SQL:

```sql
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
```

6. Click "Run" to execute the query

## Verifying the Migration

To verify that the migration was successful:

1. Go to the "Table Editor" in the left sidebar
2. Select the "profiles" table
3. Check that the new columns (bio, twitter, linkedin, github) are present

## Setting Up Storage for Avatars

To set up storage for avatar uploads:

1. Go to the "Storage" section in the left sidebar
2. Click "Create a new bucket"
3. Name the bucket "avatars"
4. Set the following options:
   - Public bucket: Yes (to allow public access to avatars)
   - File size limit: 2MB (or your preferred limit)
5. Click "Create bucket"

## Setting Up Storage Policies

After creating the bucket, set up the following policies:

1. Go to the "Storage" section and select the "avatars" bucket
2. Go to the "Policies" tab
3. Create a policy for uploads:
   - Name: "Avatar uploads"
   - Allowed operations: INSERT
   - Policy definition: `auth.uid() IS NOT NULL`
4. Create a policy for viewing:
   - Name: "Public avatar access"
   - Allowed operations: SELECT
   - Policy definition: `true`

These steps will ensure that your database schema is updated to support the new profile features and that avatar uploads work correctly. 