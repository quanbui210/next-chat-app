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
      </div>
    </div>
  );
}
