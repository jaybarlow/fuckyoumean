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

  // Initialize auth state
  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        console.log('Initial session check:', data);
        
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
        
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
        } else {
          setSession(null);
          setUser(null);
        }
      }
    );
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth methods
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

  // Context value
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