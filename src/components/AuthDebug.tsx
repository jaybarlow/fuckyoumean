"use client";

import { useAuth } from '@/context/AuthContext';

export default function AuthDebug() {
  const { user, isLoading } = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs overflow-hidden">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <p>Loading: {isLoading ? 'true' : 'false'}</p>
      <p>User: {user ? 'Logged In' : 'Not Logged In'}</p>
      {user && (
        <div className="mt-2">
          <p>ID: {user.id.substring(0, 8)}...</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
} 