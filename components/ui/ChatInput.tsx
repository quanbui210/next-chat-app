'use client';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import React from 'react';
import { toast } from 'sonner';

export default function ChatInput() {
  const supabase = createClient();
  const handleSendMessage = async (text: string) => {
    const { error } = await supabase.from('messages').insert({ text });
    if (error) {
      toast.error(error.message);
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
