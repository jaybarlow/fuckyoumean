"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get session and verified user from Supabase
    async function getSessionAndUser() {
      try {
        setIsLoading(true);
        
        // Check for session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          return;
        }
        
        console.log('Session check result:', { session });
        
        // If we have a session, try to get the user
        if (session) {
          try {
            // Use type assertion to handle potential missing method in dummy client
            const auth = supabase.auth as any;
            const { data: userData, error: userError } = await auth.getUser();
            
            if (userError) {
              console.error('Error getting user:', userError);
              // Fall back to session user if there's an error
              setUser(session.user);
              console.log('Using session user as fallback:', session.user);
            } else {
              setUser(userData.user);
              console.log('Got user from getUser():', userData.user);
            }
            
            setSession(session);
          } catch (userError) {
            console.error('Exception getting user:', userError);
            // Fall back to session user if there's an exception
            setUser(session.user);
            setSession(session);
          }
        } else {
          console.log('No session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error in getSessionAndUser:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    getSessionAndUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', { event, session });
        
        if (session) {
          setSession(session);
          
          try {
            // Use type assertion to handle potential missing method in dummy client
            const auth = supabase.auth as any;
            const { data: userData, error: userError } = await auth.getUser();
            
            if (userError) {
              console.error('Error getting user on auth change:', userError);
              // Fall back to session user if there's an error
              setUser(session.user);
            } else {
              setUser(userData.user);
            }
          } catch (userError) {
            console.error('Exception getting user on auth change:', userError);
            // Fall back to session user if there's an exception
            setUser(session.user);
          }
        } else {
          setSession(null);
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 