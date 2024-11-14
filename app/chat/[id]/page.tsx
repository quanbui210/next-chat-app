'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import ChatHeader from '@/components/ui/ChatHeader';
import ChatInput from '@/components/ui/ChatInput';
import ChatMessages from '@/components/ui/ChatMessages';
import { User } from '@supabase/supabase-js';

export default function Page() {
  const { id: chatRoomId } = useParams();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user); // Update the user state with session data
    };

    fetchSession();
  }, []); // Only run once on mount

  if (!user) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md flex flex-col relative">
        {/* Pass the user data to the ChatHeader component */}
        <ChatHeader user={user} />
        <ChatMessages chatRoomId={chatRoomId} />
        <ChatInput chatRoomId={chatRoomId} />
        
      </div>
    </div>
  );
}
