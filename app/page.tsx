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

  if (!user) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <>
      <div>
        {/* Add button click handler to navigate to the users page */}
        <Button onClick={handleNavigateToUsers}>Users</Button>
      </div>
      <InitUser user={user} />
    </>
  );
}
