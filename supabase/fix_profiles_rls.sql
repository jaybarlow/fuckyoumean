-- First, check what policies exist
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Make sure RLS is enabled
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy for INSERT if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND cmd = 'INSERT'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id)';
    END IF;
END
$$;

-- Create a policy for UPDATE if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND cmd = 'UPDATE'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id)';
    END IF;
END
$$;

-- Create a policy for SELECT if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND cmd = 'SELECT'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id)';
    END IF;
END
$$;

-- Create a policy for DELETE if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND cmd = 'DELETE'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE USING (auth.uid() = id)';
    END IF;
END
$$; 