"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChatListItem } from "./chatList/ChatListItem";
import ChatListItemMock from "./mock/ChatListItemMock";
import { useChatList } from "@/hooks/useChatList";
import ChatListHeader from "./chatList/ChatListHeader";

gsap.registerPlugin(ScrollTrigger);

export default function ChatList() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");

  const {
    chatsLoading,
    chats,
    previews,
    selectedChatId,
    isDesktop,
    isMobileChatOpen,
    selectChat,
  } = useChatList();

  useEffect(() => {
    const timeoutId = requestAnimationFrame(() => {
      const items = document.querySelectorAll(".chat-list-item");

      if (items.length === 0) return;

      const tl = gsap.timeline();

      gsap.set(items, { scale: 0, opacity: 0 });

      tl.to(items, {
        scale: 1,
        opacity: 1,
        stagger: { amount: 0.65 },
        duration: 0.6,
        ease: "back.out",
      });
    });

    return () => {
      if (timeoutId) {
        cancelAnimationFrame(timeoutId);
      }
    };
  }, [chatsLoading]);

  const filteredPreviews = previews.filter((preview) => preview.user?.username.toLowerCase().includes(search));

  if (!isDesktop && isMobileChatOpen) return null;

  return (
    <div
      ref={containerRef}
      className="flex w-72 shrink-0 flex-col border-r border-border bg-background-elevated"
    >
      <ChatListHeader input={search} onChange={setSearch} />
      <div
        ref={chatListRef}
        className="thin-scrollbar flex-1 overflow-y-auto px-3 pb-2 space-y-1"
      >
        {chatsLoading && (
          <>
            {Array.from({ length: 12 }).map((_, index) => (
              <ChatListItemMock key={index} />
            ))}
          </>
        )}
        {!chatsLoading && chats.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <div className="text-3xl font-bold">No chats yet.</div>
          </div>
        )}
        {!chatsLoading &&
          filteredPreviews.map((preview) => (
            <ChatListItem
              key={preview.chatId}
              preview={preview}
              selected={selectedChatId === preview.chatId}
              onClick={() => selectChat(preview)}
            />
          ))}
      </div>
    </div>
  );
}
