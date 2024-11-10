import ChatHeader from '@/components/ui/ChatHeader';
import ChatInput from '@/components/ui/ChatInput';
import ChatMessages from '@/components/ui/ChatMessages';
import InitUser from '@/lib/store/InitUser';
import { createClient } from '@/utils/supabase/server';
import React from 'react';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col">
          <ChatHeader user={data.session?.user} />
          <ChatMessages />
          <ChatInput />
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
