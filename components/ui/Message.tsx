'use client';
import { Imessage, useMessage } from '@/lib/store/message';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
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
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

interface MessageProps {
  value: Imessage;
}

export default function Message({ value }: MessageProps) {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user); // Update the user state with session data
    };

    fetchSession();
  }, []); // Only run once on mount
  return (
    <div className="flex gap-2">
      <img
        src={value.users?.avatar_url!}
        alt={value.users?.display_name!}
        className=" rounded-full ring-2 w-8 h-8"
      />
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
