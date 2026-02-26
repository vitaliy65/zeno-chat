"use client";

import { useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Message } from "@/types/message";
import { useAppDispatch } from "@/store/hooks";
import { updateChatMessages } from "@/store/slices/chat/ChatSlice";
import { Chat } from "@/types/chat";

export function useMessagesListener(chats: Chat[] | undefined) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chats || chats.length === 0) return;

    const unsubscribes = chats.map((chat) => {
      const q = query(
        collection(db, "chats", chat.id, "messages"),
        orderBy("createdAt", "asc")
      );

      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const lastDoc = snapshot.docs[snapshot.docs.length - 1];
          const newMessage: Message = {
            ...(lastDoc.data() as Omit<Message, "id">),
            id: lastDoc.id,
          };
          dispatch(updateChatMessages({ chatId: chat.id, newMessage }));
        }
      });
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats?.length]);
}
