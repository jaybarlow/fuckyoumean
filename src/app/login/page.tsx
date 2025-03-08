"use client";

import { useState, useEffect } from 'react';
import { signIn, signUp, confirmUserManually } from '@/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  const [email, setEmail] = useState('');
  const [showDevOptions, setShowDevOptions] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setIsSupabaseConfigured(false);
    }
    
    // Check for redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const email = formData.get('email') as string;
      setEmail(email);
      
      let result;
      
      if (isSignUp) {
        result = await signUp(formData);
        
        if (result.success) {
          setShowDevOptions(true);
          if (result.message) {
            setSuccess(result.message);
          }
        }
      } else {
        result = await signIn(formData);
        
        if (result.success) {
          // Redirect to the original path or profile
          window.location.href = redirectPath || '/profile';
          return;
        }
      }
      
      if (!result.success) {
        setError(result.error);
        if (result.message) {
          setSuccess(result.message);
        } else {
          setSuccess(null);
        }
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleManualConfirm() {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const result = await confirmUserManually(email);
      
      if (!result.success) {
        setError(result.error);
        if (result.message) {
          setSuccess(result.message);
        } else {
          setSuccess(null);
        }
      } else {
        if (result.message) {
          setSuccess(result.message);
        }
        setError(null);
        setIsSignUp(false);
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred');
      setSuccess('Please visit the Supabase dashboard to confirm your user: https://app.supabase.com/project/yrjuwkopkdwkcqvbnzbc/auth/users');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative py-20 bg-black min-h-[80vh]">
      {/* Shadow effect elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {isSignUp 
              ? 'Sign up to access exclusive features' 
              : 'Sign in to your account'}
          </p>
        </div>
        
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400">
            <p className="mb-2 font-medium">Supabase is not configured</p>
            <p className="text-sm">
              Please update your <code className="bg-gray-800 px-1 py-0.5 rounded">.env.local</code> file with your Supabase URL and anon key.
              You can get these from your Supabase project settings.
            </p>
          </div>
        )}
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
              {success}
            </div>
          )}
          
          {showDevOptions && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400">
              <p className="mb-2 font-medium">Development Mode</p>
              <p className="text-sm mb-3">
                In development, Supabase doesn't send real emails unless configured with an email provider.
                You can confirm your account in one of these ways:
              </p>
              <ul className="text-sm list-disc pl-5 mb-3">
                <li>Visit the <a href="https://app.supabase.com/project/yrjuwkopkdwkcqvbnzbc/auth/users" target="_blank" rel="noopener noreferrer" className="underline">Supabase Auth Dashboard</a> and confirm the user manually</li>
                <li>Click the button below to attempt a development-mode confirmation</li>
              </ul>
              <button
                onClick={handleManualConfirm}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 font-medium rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Confirm Account (Dev Mode)'}
              </button>
            </div>
          )}
          
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                placeholder="••••••••"
                required
              />
              {!isSignUp && (
                <div className="mt-1 text-right">
                  <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !isSupabaseConfigured}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? 'Processing...' 
                : isSignUp 
                  ? 'Create Account' 
                  : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setShowDevOptions(false);
                setError(null);
                setSuccess(null);
              }} 
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 