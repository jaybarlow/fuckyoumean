# Setting Up Row Level Security (RLS) for Profiles Table

The error message "new row violates row-level security policy for table 'profiles'" indicates that there might be an issue with the Row Level Security policies for the profiles table in Supabase.

## Option 1: Apply SQL Directly in Supabase Dashboard

1. Go to your Supabase project dashboard: https://app.supabase.com/project/yrjuwkopkdwkcqvbnzbc
2. Navigate to the SQL Editor
3. Create a new query and paste the following SQL:

```sql
-- Enable Row Level Security (if not already enabled)
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they're causing issues
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Create policy to allow users to select their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create policy to allow users to delete their own profile
CREATE POLICY "Users can delete their own profile" 
ON profiles FOR DELETE 
USING (auth.uid() = id);
```

4. Run the query

## Alternative: Check and Fix Existing Policies

Since you're getting an error that policies already exist, you might want to check the existing policies first:

1. Go to your Supabase project dashboard
2. Navigate to Database → Tables → profiles
3. Click on "Policies" tab
4. Review the existing policies

If you see policies that are too restrictive or not working correctly, you can modify them directly in the dashboard or run this SQL to check what policies exist:

```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## Testing

After setting up or fixing the policies, try updating your profile again. The error should be resolved, and you should be able to update your profile information successfully. 