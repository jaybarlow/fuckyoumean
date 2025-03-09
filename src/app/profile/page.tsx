import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import { signOut } from '@/actions/auth';
import Link from 'next/link';
import ProfileHeader from '@/components/ProfileHeader';

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient();
  
  // Get the user session
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session, redirect to login
  if (!session) {
    redirect('/login');
  }
  
  // Get verified user data
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting verified user:', userError?.message);
    redirect('/login');
  }
  
  // Fetch user profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error loading profile:', error.message);
  }
  
  return (
    <div className="relative py-20 bg-black min-h-[80vh]">
      {/* Shadow effect elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader profile={profile} />
        
        <ProfileForm user={user} profile={profile} />
        
        <div className="text-center mt-8 flex justify-center space-x-4">
          {profile?.username && (
            <Link 
              href={`/profile/${profile.username}`}
              className="px-6 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-medium rounded-lg transition-all duration-300 flex items-center"
              target="_blank"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview Public Profile
            </Link>
          )}
          
          <form action={signOut}>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-lg transition-all duration-300"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 