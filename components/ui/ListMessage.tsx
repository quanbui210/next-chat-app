'use client';
import { Imessage, useMessage } from '@/lib/store/message';
import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import DeleteAlert from './MessageActions';
import { EditAlert } from './MessageActions';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { ArrowDown } from 'lucide-react';

export default function ListMessage(roomData: {chatRoomId: string}) {
  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage((state) => state);
  const supabase = createClient();
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`chat-${roomData.chatRoomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          console.log(payload.new.chat_room, roomData.chatRoomId, payload.new)
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from('users')
              .select('*')
              .eq('id', payload.new.send_by)
              .single();
            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };
              if (payload.new.chat_room === roomData.chatRoomId) {
                addMessage(newMessage as Imessage);
              }
            }
          }
          const scrollContainer = scrollRef.current;
          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotification((current) => current + 1);
          }
          if (
            scrollContainer.scrollTop ===
            scrollContainer.scrollHeight - scrollContainer.clientHeight
          ) {
            setNotification(0);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => {
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          optimisticUpdateMessage(payload.new as Imessage);
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
      }
    }
  };

  const scrollDown = () => {
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <>
      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex-1"> </div>
        <div className="space-y-7">
          {messages.map((value, index) => {
            return <Message value={value} key={index} />;
          })}
        </div>
        <DeleteAlert />
        <EditAlert />
      </div>
      {userScrolled && (
        <div className=" absolute bottom-20 w-full">
          {notification ? (
            <div
              className="w-36 mx-auto bg-indigo-500 p-1 rounded-md cursor-pointer"
              onClick={scrollDown}
            >
              <h1>{notification} new messages</h1>
            </div>
          ) : (
            <div
              className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  );
}
