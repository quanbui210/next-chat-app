import ChatHeader from '@/components/ui/ChatHeader';
import ChatInput from '@/components/ui/ChatInput';
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
          <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto">
            <div className="flex-1"> </div>
            <div className="space-y-7">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
                return (
                  <div className="flex gap-2" key={value}>
                    <div className="h-10 w-10 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex item-center gap-1">
                        <h1 className="font-bold">Quan</h1>
                        <h2 className="text-sm text-gray-400">
                          {new Date().toDateString()}
                        </h2>
                      </div>
                      <p className="text-black-500">
                        Replace trigger_name with the name of your trigger and
                        table_name with the name of the table where the trigger
                        was set up.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <ChatInput />
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
