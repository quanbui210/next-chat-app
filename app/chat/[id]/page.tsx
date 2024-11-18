'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import ChatHeader from '@/components/ui/ChatHeader';
import ChatInput from '@/components/ui/ChatInput';
import ChatMessages from '@/components/ui/ChatMessages';
import { User } from '@supabase/supabase-js';

export default function Page() {
  const { id: chatRoomId } = useParams();
  if (typeof chatRoomId !== 'string') {
    return <div>Invalid chat room</div>;
  }
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter();

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
      <button 
        onClick={() => router.push('/users')} 
        className="mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        ← Back to Users
      </button>
      <div className="h-full border rounded-md flex flex-col relative">
        {/* Pass the user data to the ChatHeader component */}
        <ChatHeader user={user} />
        <ChatMessages chatRoomId={chatRoomId} />
        <ChatInput chatRoomId={chatRoomId} />
        
      </div>
    </div>
  );
}
