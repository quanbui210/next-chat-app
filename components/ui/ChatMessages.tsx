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
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatRoomId) return;

      const supabase = createClient();

      const { data, error } = await supabase
        .from('messages')
        .select('*, users(*)')
        .eq('chat_room', chatRoomId);

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data || []);
      }

      setLoading(false);
    };

    fetchMessages();
  }, [chatRoomId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chatRoomId || Array.isArray(chatRoomId)) {
    return null;
  }

  return (
    <>
      <ListMessage chatRoomId={chatRoomId} />
      <InitMessages messages={messages} />
    </>
  );
}
