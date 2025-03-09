import { ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

// Card component props
export interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
}

export interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
}

export interface SimpleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
}

// Profile related types
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  updated_at: string;
}

export interface ProfileFormProps {
  user: User;
  profile: Profile | null;
}

export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
} 