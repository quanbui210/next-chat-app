import { Imessage } from '@/lib/store/message';
import Image from 'next/image';
import React from 'react';

interface MessageProps {
  value: Imessage;
}

export default function Message({ value }: MessageProps) {
  return (
    <div className="flex gap-2">
      <Image
        src={value.users?.avatar_url!}
        width={40}
        height={40}
        alt="name"
        className=" rounded-full ring-2"
      ></Image>
      <div className="flex-1">
        <div className="flex item-center gap-1">
          <h1 className="font-bold">{value.users?.display_name}</h1>
          <h2 className="text-sm text-gray-400">{value.created_at}</h2>
        </div>
        <p className="text-black-500">{value.text}</p>
      </div>
    </div>
  );
}
