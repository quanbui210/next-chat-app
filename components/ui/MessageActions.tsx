'use client';
import React, { useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Imessage, useMessage } from '@/lib/store/message';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export default function DeleteAlert() {
  const { actionMessage, optimisticDeleteMessage } = useMessage(
    (state) => state
  );
  const handleDelete = async () => {
    const supabase = createClient();
    optimisticDeleteMessage(actionMessage?.id!);
    await supabase.from('messages').delete().eq('id', actionMessage?.id!);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete message?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function EditAlert() {
  const { actionMessage, optimisticUpdateMessage } = useMessage(
    (state) => state
  );
  const [disabled, setDisabled] = useState(true);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const handleEdit = async () => {
    const supabase = createClient();
    const edittedMessage = messageRef?.current?.value;
    if (edittedMessage !== '') {
      const newMessage = {
        ...actionMessage,
        text: edittedMessage,
        is_edit: true,
      };
      optimisticUpdateMessage(newMessage as Imessage);
      const { error } = await supabase
        .from('messages')
        .update({ text: edittedMessage, is_edit: true })
        .eq('id', actionMessage?.id!);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('succesfully edit message');
      }
    } else {
      document.getElementById('trigger-edit')?.click();
      document.getElementById('trigger-delete')?.click();
    }
  };
  const handleChange = () => {
    const currentText = messageRef.current?.value;
    const isChanged = currentText !== actionMessage?.text;
    const isEmpty = currentText === '';
    setDisabled(!isChanged || isEmpty); // Enable button if text is different
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-edit" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit message?</AlertDialogTitle>
          <AlertDialogDescription>
            <Textarea
              onChange={handleChange}
              defaultValue={actionMessage?.text}
              ref={messageRef}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={disabled} onClick={handleEdit}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
