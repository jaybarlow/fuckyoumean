"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get session and verified user from Supabase
    const getSessionAndUser = async () => {
      try {
        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setIsLoading(false);
          return;
        }
        
        setSession(sessionData.session);
        
        // Try to get verified user using getUser() if available, otherwise fall back to session user
        if (sessionData.session) {
          // Check if getUser method exists on the supabase client
          if (typeof (supabase.auth as any).getUser === 'function') {
            try {
              const { data: userData, error: userError } = await (supabase.auth as any).getUser();
              if (userError) {
                console.error('Error getting user:', userError);
                setUser(sessionData.session.user);
              } else {
                setUser(userData.user);
              }
            } catch (error) {
              console.error('Error calling getUser:', error);
              setUser(sessionData.session.user);
            }
          } else {
            // Fallback to session user if getUser is not available
            console.info('getUser method not available, using session user');
            setUser(sessionData.session.user);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSessionAndUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        // Try to get verified user using getUser() if available, otherwise fall back to session user
        if (currentSession) {
          // Check if getUser method exists on the supabase client
          if (typeof (supabase.auth as any).getUser === 'function') {
            try {
              const { data: userData, error: userError } = await (supabase.auth as any).getUser();
              if (userError) {
                console.error('Error getting user on auth change:', userError);
                setUser(currentSession.user);
              } else {
                setUser(userData.user);
              }
            } catch (error) {
              console.error('Error calling getUser on auth change:', error);
              setUser(currentSession.user);
            }
          } else {
            // Fallback to session user if getUser is not available
            setUser(currentSession.user);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
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