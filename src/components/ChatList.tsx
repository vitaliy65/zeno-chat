"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchChatPreviews } from "@/store/slices/chat/ChatAsyncThunks";
import { setSelectedChatId } from "@/store/slices/chat/ChatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ChatListItem } from "./chatList/ChatListItem";
import ChatListItemMock from "./mock/ChatListItemMock";

gsap.registerPlugin(ScrollTrigger);

export default function ChatList() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chatListRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useAppDispatch();

    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const loading = useAppSelector((state) => state.chat.loading);
    const chatPreviews = useAppSelector((state) => state.chat.chatPreviews);
    const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);

    useEffect(() => {
        if (currentUserId) {
            dispatch(fetchChatPreviews({ userId: currentUserId }));
        }
    }, []);

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
    }, [chatPreviews.length]);

    return (
        <div
            ref={containerRef}
            className='row-span-11 col-span-1 base-container-settings overflow-y-auto overflow-x-hidden thin-scrollbar'
        >
            <div ref={chatListRef} className="flex flex-col gap-3 h-full">
                {loading && (
                    <>
                        {Array.from({ length: 12 }).map((_, index) => (
                            <ChatListItemMock key={index} />
                        ))}
                    </>
                )}
                {!loading && chatPreviews.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-3xl font-bold">No chats yet.</div>
                    </div>
                )}
                {!loading &&
                    chatPreviews.map((preview) => (
                        <ChatListItem
                            key={preview.chatId}
                            preview={preview}
                            selected={selectedChatId === preview.chatId}
                            onClick={() => dispatch(setSelectedChatId(preview.chatId))}
                        />
                    ))}
            </div>
        </div>
    )
}