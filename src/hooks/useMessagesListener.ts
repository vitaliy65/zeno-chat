"use client";

import { useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Message } from "@/types/message";
import { useAppDispatch } from "@/store/hooks";
import { updateChatMessages } from "@/store/slices/chat/ChatSlice";
import { Chat } from "@/types/chat";

/**
 * Listen to all chat messages for an array of chat IDs. This will attach listeners to each chat,
 * so all of the user's chats will update in realtime.
 * @param chatIds string[] - Array of chat IDs to listen for messages on.
 */
export function useMessagesListener(chats: Chat[] | undefined) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chats || chats.length === 0) return;

    // Store all unsubscribe functions so we can clean them up
    const unsubscribes = chats.map((chat) => {
      const q = query(
        collection(db, "chats", chat.id, "messages"),
        orderBy("createdAt", "asc")
      );

      return onSnapshot(q, (snapshot) => {
        const messages: Message[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<Message, "id">),
          id: doc.id,
        }));
        dispatch(updateChatMessages({ chatId: chat.id, messages }));
      });
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [JSON.stringify(chats?.map(c => c.id)), dispatch]); // use JSON.stringify to re-run effect if chatIds changed
}
