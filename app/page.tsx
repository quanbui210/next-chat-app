'use client';

import { Button } from '@/components/ui/button';
import ChatHeader from '@/components/ui/ChatHeader';
import ChatInput from '@/components/ui/ChatInput';
import ChatMessages from '@/components/ui/ChatMessages';
import InitUser from '@/lib/store/InitUser';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { createClient } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function Page() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter(); // Initialize useRouter hook
  const supabase = createClient();

  // Fetch session data on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user); // Update user state with session data
    };

    fetchSession();
  }, [supabase]);

  const handleNavigateToUsers = () => {
    router.push('/users'); // Navigate to the /users page
  };


  const handleLoginWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: location.origin + '/users',
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
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {user ? `Welcome back!` : 'Welcome to Chat App'}
          </h1>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={user ? handleLogout : handleLoginWithGitHub}
              className="bg-gray-900 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {user ? 'Log out' : 'Login with GitHub'}
            </Button>
            {user && (
              <Button
                onClick={handleNavigateToUsers}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View All Users
              </Button>
            )}
          </div>
          {!user && (
            <p className="mt-4 text-gray-600">
              Please login to start chatting with other users
            </p>
          )}
        </div>
      </div>
      <InitUser user={user} />
    </div>
  );
}
