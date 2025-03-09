"use client";

import { useState, useRef } from 'react';
import { updateProfile } from '@/actions/profile';
import { ProfileFormProps } from '@/types/components';
import Image from 'next/image';

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle file selection for avatar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError(null);
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

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
        {/* Hidden user ID field */}
        <input type="hidden" name="id" value={user.id} />
        
        {/* Avatar upload */}
        <div className="flex flex-col items-center mb-6">
          <div 
            onClick={handleAvatarClick}
            className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/50 cursor-pointer group mb-2"
          >
            {previewUrl ? (
              <Image 
                src={previewUrl} 
                alt="Profile avatar" 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-sm">Change</span>
            </div>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            name="avatar" 
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-400">Click to upload a profile picture</p>
        </div>
        
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={profile?.username || ''}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your username"
          />
        </div>
        
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={profile?.full_name || ''}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        
        {/* Email (read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email || ''}
            readOnly
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>
        
        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            defaultValue={profile?.website || ''}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://yourwebsite.com"
          />
        </div>
        
        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={profile?.bio || ''}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Tell us about yourself"
          />
        </div>
        
        {/* Social Media Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Social Media</h3>
          
          {/* Twitter */}
          <div className="flex items-center">
            <span className="bg-gray-800/50 p-2 rounded-l-lg border border-gray-700 border-r-0">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </span>
            <input
              name="twitter"
              type="text"
              defaultValue={profile?.twitter || ''}
              className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Twitter username"
            />
          </div>
          
          {/* LinkedIn */}
          <div className="flex items-center">
            <span className="bg-gray-800/50 p-2 rounded-l-lg border border-gray-700 border-r-0">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </span>
            <input
              name="linkedin"
              type="text"
              defaultValue={profile?.linkedin || ''}
              className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="LinkedIn username"
            />
          </div>
          
          {/* GitHub */}
          <div className="flex items-center">
            <span className="bg-gray-800/50 p-2 rounded-l-lg border border-gray-700 border-r-0">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </span>
            <input
              name="github"
              type="text"
              defaultValue={profile?.github || ''}
              className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="GitHub username"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white shadow-lg hover:shadow-purple-500/30 transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
} 