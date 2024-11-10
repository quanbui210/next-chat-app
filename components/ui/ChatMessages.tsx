import React, { Suspense } from 'react';
import ListMessage from './ListMessage';
import { createClient } from '@/utils/supabase/server';

export default async function ChatMessages() {
  const supabase = await createClient();

  let { data: messages, error } = await supabase
    .from('messages')
    .select('*, users(*)');

  console.log(messages);

  return (
    <Suspense fallback={'Loading...'}>
      <ListMessage messages={messages || []} />
    </Suspense>
  );
}
