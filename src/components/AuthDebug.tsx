"use client";

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthDebug() {
  const { user, isLoading } = useAuth();
  const [directSessionCheck, setDirectSessionCheck] = useState<{
    hasSession: boolean;
    loading: boolean;
  }>({
    hasSession: false,
    loading: true
  });
  
  useEffect(() => {
    async function checkSessionDirectly() {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Direct session check:', data);
        setDirectSessionCheck({
          hasSession: !!data.session,
          loading: false
        });
      } catch (error) {
        console.error('Error in direct session check:', error);
        setDirectSessionCheck({
          hasSession: false,
          loading: false
        });
      }
    }
    
    checkSessionDirectly();
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs overflow-hidden">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <p>Context Loading: {isLoading ? 'true' : 'false'}</p>
      <p>Context User: {user ? 'Logged In' : 'Not Logged In'}</p>
      <p>Direct Check Loading: {directSessionCheck.loading ? 'true' : 'false'}</p>
      <p>Direct Session: {directSessionCheck.hasSession ? 'Found' : 'Not Found'}</p>
      {user && (
        <div className="mt-2">
          <p>ID: {user.id.substring(0, 8)}...</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
} 