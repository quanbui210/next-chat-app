'use client';
import { Imessage, useMessage } from '@/lib/store/message';
import React, { useEffect, useRef } from 'react';
import Message from './Message';
import DeleteAlert, { EditAlert } from './MessageActions';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';


export default function ListMessage() {
  const { messages, addMessage, optimisticIds, optimisticDeleteMessage, optimisticUpdateMessage } = useMessage((state) => state);
  const supabase = createClient()
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const channel = supabase
      .channel('chat-app')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          console.log("INSERT event received:", payload);
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from('users')
              .select('*')
              .eq('id', payload.new.send_by)
              .single();
            if (error) {
              toast.error(error.message)
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };
              addMessage(newMessage as Imessage);
            } 
          }
        }
      ).on(
				"postgres_changes",
				{ event: "DELETE", schema: "public", table: "messages" },
				(payload) => {
					optimisticDeleteMessage(payload.old.id);
				}
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "messages" },
				(payload) => {
					optimisticUpdateMessage(payload.new as Imessage);
				}
			)
      .subscribe();
      console.log(channel)

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  
  return (
    <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto" ref={scrollRef}>
      <div className="flex-1"> </div>
      <div className="space-y-7">
        {messages.map((value, index) => {
          return <Message value={value} key={index} />;
        })}
      </div>
      <DeleteAlert />
      <EditAlert />
    </div>
  );
}
