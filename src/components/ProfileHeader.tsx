"use client";

import { Profile } from '@/types/components';
import UsernameRequiredAlert from './UsernameRequiredAlert';

interface ProfileHeaderProps {
  profile: Profile | null;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-white mb-6">
        Your Profile
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Manage your account information
      </p>
      
      {!profile?.username && <UsernameRequiredAlert />}
    </div>
  );
} 