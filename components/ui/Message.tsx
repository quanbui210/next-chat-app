'use client';
import { Imessage, useMessage } from '@/lib/store/message';
import Image from 'next/image';
import React from 'react';
import { EllipsisVertical } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/lib/store/user';

interface MessageProps {
  value: Imessage;
}

export default function Message({ value }: MessageProps) {
  const user = useUser((state) => state.user);
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
        <div className="flex item-center gap-1 justify-between">
          <div className="flex item-center gap-1">
            <h1 className="font-bold">{value.users?.display_name}</h1>
            <h2 className="text-sm text-gray-400">
              {new Date(value.created_at).toDateString()}
            </h2>
            <p>
              {value.is_edit && (
                <span className="text-sm italic text-gray-400">(edited)</span>
              )}
            </p>
          </div>
          {value.users?.id === user?.id && <MessageMenu message={value} />}
        </div>
        <p className="text-black-500">{value.text}</p>
      </div>
    </div>
  );
}

const MessageMenu = ({ message }: { message: Imessage }) => {
  const setActionMessage = useMessage((state) => state.setActionMessage);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.getElementById('trigger-edit')?.click();
            setActionMessage(message);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById('trigger-delete')?.click();
            setActionMessage(message);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
