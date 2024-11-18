'use client';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import InitUser from '@/lib/store/InitUser';

interface UserRecord {
  id: string;
  avatar_url: string;
  created_at: string;
  display_name: string;
}

export default function Users() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<UserRecord[]>([]);

  useEffect(() => {
    const fetchUserAndUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data: usersData, error } = await supabase
        .from('users')
        .select('id, avatar_url, created_at, display_name');

      if (error) {
        console.error('Error fetching users:', error.message);
      } else {
        setAllUsers(usersData || []);
      }
    };

    fetchUserAndUsers();
  }, [supabase]);

  const handleChat = async (otherUserId: string) => {
    if (!user) return;

    const userA = user.id;
    const userB = otherUserId;

    // Check if a chat room already exists between these two users (both (user_a, user_b) and (user_b, user_a) combinations)
    let { data: existingRoom, error } = await supabase
      .from('chat_rooms' as 'messages' | 'users')
      .select('id')
      .or(`user_a.eq.${userA},user_b.eq.${userA}`)
      .or(`user_a.eq.${userB},user_b.eq.${userB}`)
      .single();

    let chatRoomId: string;

    if (existingRoom) {
      // Chat room exists, use its ID
      chatRoomId = existingRoom.id;
    } else {
      // Create a new chat room if one doesn't exist
      const { data: newRoom, error: creationError } = await supabase
        .from('chat_rooms' as 'messages' | 'users')
        .insert([{ user_a: userA, user_b: userB } as any])
        .select('id')
        .single();

      if (creationError) {
        console.error('Error creating chat room:', creationError.message);
        return;
      }

      chatRoomId = newRoom.id;
    }

    // Navigate to the chat room
    router.push(`/chat/${chatRoomId}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Users Directory</h1>
        <Button 
          onClick={handleLogout}
          className="px-6"
        >
          Log out
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        {allUsers.length > 0 ? (
          <ul className="space-y-4">
            {allUsers.map((p) => 
              p.id !== user?.id && (
                <li key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md border">
                  <p className="font-medium text-gray-800">{p.display_name}</p>
                  <Button 
                    onClick={() => handleChat(p.id)}
                    className="ml-4"
                    variant="outline"
                  >
                    Start Chat
                  </Button>
                </li>
              )
            )}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">No users found.</p>
        )}
      </div>
      <InitUser user={user} />
    </div>
  );
}
