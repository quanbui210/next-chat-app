import { Imessage } from '@/lib/store/message';
import React from 'react';
import Message from './Message';

interface ListMessageProps {
  messages: Imessage[];
}

export default function ListMessage({ messages }: ListMessageProps) {
  return (
    <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto">
      <div className="flex-1"> </div>
      <div className="space-y-7">
        {messages.map((value, index) => {
          return <Message value={value} key={index} />;
        })}
      </div>
    </div>
  );
}
