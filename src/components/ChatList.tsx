"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchChatPreviews, fetchChats } from "@/store/slices/chat/ChatAsyncThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ChatListItem } from "./chatList/ChatListItem";
import ChatListItemMock from "./mock/ChatListItemMock";
import { setSelectedChat } from "@/store/slices/chat/ChatSlice";

gsap.registerPlugin(ScrollTrigger);

export default function ChatList() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chatListRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useAppDispatch();

    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const loading = useAppSelector((state) => state.chat.loading);
    const chats = useAppSelector((state) => state.chat.chats);
    const chatPreviews = useAppSelector((state) => state.chat.chatPreviews);
    const selectedChat = useAppSelector((state) => state.chat.selectedChat);

    useEffect(() => {
        if (currentUserId) {
            dispatch(fetchChats({ userId: currentUserId }));
            dispatch(fetchChatPreviews({ userId: currentUserId }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId]);

    useEffect(() => {
        // Animate chat list item entrance
        const timeoutId = requestAnimationFrame(() => {
            const items = document.querySelectorAll('.chat-list-item');

            if (items.length === 0) return;

            const tl = gsap.timeline();

            gsap.set(items, { xPercent: -100, opacity: 0 });

            tl.to(items, {
                xPercent: 0,
                opacity: 1,
                stagger: { amount: 1 },
                duration: 0.6,
                ease: "power2.out"
            });
        });

        return () => {
            if (timeoutId) {
                cancelAnimationFrame(timeoutId);
            }
        };
    }, [chats.length]);

    return (
        <div
            ref={containerRef}
            className='relative row-span-11 col-span-1 base-container-settings overflow-y-auto overflow-x-hidden thin-scrollbar'
        >
            <div ref={chatListRef} className="flex flex-col gap-3 h-full">
                {loading && (
                    <>
                        {Array.from({ length: 12 }).map((_, index) => (
                            <ChatListItemMock key={index} />
                        ))}
                    </>
                )}
                {!loading && chats.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-3xl font-bold">No chats yet.</div>
                    </div>
                )}
                {!loading &&
                    chatPreviews.map((preview) => (
                        <ChatListItem
                            key={preview.chatId}
                            preview={preview}
                            selected={selectedChat?.id === preview.chatId}
                            onClick={() => dispatch(setSelectedChat(preview.chatId))}
                        />
                    ))}
            </div>
        </div>
    )
}