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
  const [allUsers, setAllUsers] = useState<UserRecord[]>([]); // State to hold all users from DB

  const normalizeUsers = (userA: string, userB: string) => {
    const users = [userA, userB];
    return users.sort(); // Sorts the users lexicographically
  };

  useEffect(() => {
    const fetchUserAndUsers = async () => {
      // Get the authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch all users from the users table
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

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);
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

  const handleChat = async (otherUserId: string) => {
    if (!user) return;

    const userA = user.id;
    const userB = otherUserId;

    // Check if a chat room already exists between these two users (both (user_a, user_b) and (user_b, user_a) combinations)
    let { data: existingRoom, error } = await supabase
      .from('chat_rooms')
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
        .from('chat_rooms')
        .insert([{ user_a: userA, user_b: userB }])
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
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/users');
  };
  return (
    <div>
      <Button onClick={user ? handleLogout : handleLoginWithGitHub}>
        {user ? 'Log out' : 'Login'}
      </Button>

      <div className="users-list mt-4">
        <h2>All Users:</h2>
        {allUsers.length > 0 ? (
          <ul>
            {allUsers.map((p) => (
              <li key={p.id}>
                <p>{p.display_name}</p>
                {p.id !== user?.id && (
                  <Button onClick={() => handleChat(p.id)}>Chat</Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <InitUser user={user} />
    </div>
  );
}
