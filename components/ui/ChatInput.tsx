'use client';
import { Input } from '@/components/ui/input';
import { Imessage, useMessage } from '@/lib/store/message';
import { useUser } from '@/lib/store/user';
import { createClient } from '@/utils/supabase/client';
import React from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export default function ChatInput() {
  const user = useUser((state) => state.user);
  const { addMessage, setOptimisticIds } = useMessage((state) => state);
  const supabase = createClient();
  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const id = uuidv4();
      const newMessage = {
        id,
        text,
        send_by: user?.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        users: {
          id: user?.id,
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata.user_name,
        },
      };
      addMessage(newMessage as Imessage);
      setOptimisticIds(newMessage.id);
      const { error } = await supabase.from('messages').insert({ text, id });
      if (error) {
        toast.error(error.message);
      }
    } else {
      toast.error('Message can not be empty!!');
    }
  };
  return (
    <div className="p-5">
      <Input
        placeholder="send message"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
    </div>
  );
}
