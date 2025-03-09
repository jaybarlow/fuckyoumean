'use client';

import dynamic from 'next/dynamic';

// Dynamically import the AuthDebug component with no SSR
const AuthDebug = dynamic(() => import('./AuthDebug'), { ssr: false });

export default function ClientAuthDebugWrapper() {
  return process.env.NODE_ENV === 'development' ? <AuthDebug /> : null;
} 