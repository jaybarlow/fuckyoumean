-- First, check what policies exist
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Make sure RLS is enabled
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists
DROP POLICY IF EXISTS "Users can manage their own profiles" ON profiles;

-- Create a simple policy that allows users to perform all operations on their own profiles
CREATE POLICY "Users can manage their own profiles" 
ON profiles 
USING (auth.uid() = id);

-- If you're still having issues, you can try this more permissive policy
-- (only use temporarily for debugging)
-- DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON profiles;
-- CREATE POLICY "Allow all operations for authenticated users" 
-- ON profiles 
-- USING (auth.role() = 'authenticated'); 