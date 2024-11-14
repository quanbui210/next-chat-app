'use client';

import React, { useState, useEffect } from 'react';
import ListMessage from './ListMessage';
import { createClient } from '@/utils/supabase/client';
import InitMessages from '@/lib/store/InitMessage';

export default function ChatMessages({
  chatRoomId,
}: {
  chatRoomId: string | string[] | undefined;
}) {
  const [messages, setMessages] = useState<any[]>([]); // State to store messages
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatRoomId) return; // Early exit if chatRoomId is undefined or falsy

      const supabase = createClient();

      // Assuming your column name is 'chat_room_id' in the messages table
      const { data, error } = await supabase
        .from('messages')
        .select('*, users(*)')
        .eq('chat_room', chatRoomId); // Replace 'chat_room_id' with your actual column name

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data || []);
      }

      setLoading(false); // Set loading to false once data is fetched
    };

    fetchMessages();
  }, [chatRoomId]); // Dependency array to refetch on chatRoomId change

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ListMessage chatRoomId={chatRoomId} />
      <InitMessages messages={messages} />
    </>
  );
}
