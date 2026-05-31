import React from 'react';
import { useAuthStore } from '../../store/authStore';

interface TopHeaderProps {
  title: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ title }) => {
  const { profile, user } = useAuthStore();
  
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-gray-500">
            {profile?.plan || 'Free'} Plan
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-bold shadow-sm">
          {(profile?.displayName || user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
