-- Add new columns to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT;

-- Update RLS policies to include the new columns
ALTER POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT USING (true);

ALTER POLICY "Users can insert their own profile." 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

ALTER POLICY "Users can update own profile." 
ON profiles FOR UPDATE USING (auth.uid() = id); 