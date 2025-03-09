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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          return;
        }
        
        // If we have a session, try to get the user with getUser() if available
        if (session) {
          if ('getUser' in supabase.auth) {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
              console.error('Error getting user:', userError);
              // Fall back to session user if there's an error
              setUser(session.user);
            } else {
              setUser(userData.user);
            }
          } else {
            // Fall back to session user if getUser is not available
            setUser(session.user);
          }
          
          setSession(session);
        } else {
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
        setSession(session);
        
        if (session) {
          // Try to get the user with getUser() if available
          if ('getUser' in supabase.auth) {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
              console.error('Error getting user:', userError);
              // Fall back to session user if there's an error
              setUser(session.user);
            } else {
              setUser(userData.user);
            }
          } else {
            // Fall back to session user if getUser is not available
            setUser(session.user);
          }
        } else {
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