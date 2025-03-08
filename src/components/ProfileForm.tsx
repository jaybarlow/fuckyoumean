"use client";

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { updateProfile } from '@/actions/profile';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  updated_at: string;
}

interface ProfileFormProps {
  user: User;
  profile: Profile | null;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateProfile(formData);
      
      if (!result.success) {
        setError(result.error);
      } else if (result.message) {
        setSuccess(result.message);
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 shadow-lg mb-8">
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
      
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={profile?.username || ''}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
          />
        </div>
        
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            defaultValue={profile?.full_name || ''}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
          />
        </div>
        
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            defaultValue={profile?.website || ''}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
            placeholder="https://example.com"
          />
        </div>
        
        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-300 mb-1">
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            defaultValue={profile?.avatar_url || ''}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
} 