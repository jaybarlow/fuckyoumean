import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import { signOut } from '@/actions/auth';

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient();
  
  // Get the user session
  // NOTE: In server components, we're using getSession() directly.
  // For better security in production, consider implementing a server-side
  // verification of the session using Supabase Admin or Edge Functions.
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session, redirect to login
  if (!session) {
    redirect('/login');
  }
  
  // Fetch user profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
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
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-6">
            Your Profile
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Manage your account information
          </p>
        </div>
        
        <ProfileForm user={session.user} profile={profile} />
        
        <div className="text-center mt-8">
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