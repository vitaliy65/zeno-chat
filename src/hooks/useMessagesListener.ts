"use client";

import { useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Message } from "@/types/message";
import { useAppDispatch } from "@/store/hooks";
import { updateChatMessages } from "@/store/slices/chat/ChatSlice";

export function useMessagesListener(chatId: string | undefined) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: Message[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Message, "id">),
        id: doc.id,
      }));
      dispatch(updateChatMessages({ chatId, messages }));
    });

    return () => unsubscribe();
  }, [chatId, dispatch]);
}
