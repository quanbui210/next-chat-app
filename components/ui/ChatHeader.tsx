'use client';
import React from 'react';
import { Button } from './button';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

import { User } from '@supabase/supabase-js';

interface ChatHeaderProps {
  user?: User;
}

export default function ChatHeader({ user }: ChatHeaderProps) {
  const router = useRouter();

  const handleLoginWithGitHub = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: location.origin + '/auth/callback',
        },
      });
      if (error) console.error('Login error:', error.message);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-bold">Daily Chat</h1>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-sm text-gray-400">{user?.email}</h3>
          </div>
        </div>
        <Button onClick={user ? handleLogout : handleLoginWithGitHub}>
          {user ? 'Log out' : 'Login'}
        </Button>
      </div>
    </div>
  );
}
