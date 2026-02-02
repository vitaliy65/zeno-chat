"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchChats } from "@/store/slices/chat/ChatAsyncThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ChatListItem } from "./chatList/ChatListItem";
import ChatListItemMock from "./mock/ChatListItemMock";
import { setSelectedChat } from "@/store/slices/chat/ChatSlice";
import { fetchFriends } from "@/store/slices/friends/FriendsAsyncThunks";
import { User } from "@/types/user";
import { openMobileChatModal } from "@/store/slices/MobileChat/MobileChatModalSlice";
import useMediaQuery from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

export default function ChatList() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chatListRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useAppDispatch();

    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const { fetchChats: chatsLoading } = useAppSelector((state) => state.chat.loading);
    const chats = useAppSelector((state) => state.chat.chats);
    const selectedChat = useAppSelector((state) => state.chat.selectedChat);
    const friends = useAppSelector((state) => state.friends.friends);

    const { isDesktop } = useMediaQuery();
    const { isOpen } = useAppSelector(s => s.MobileChatNodal)

    useEffect(() => {
        if (currentUserId) {
            dispatch(fetchFriends({ currentUserId }));
            dispatch(fetchChats({ userId: currentUserId }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId]);

    useEffect(() => {
        // Animate chat list item entrance
        const timeoutId = requestAnimationFrame(() => {
            const items = document.querySelectorAll('.chat-list-item');

            if (items.length === 0) return;

            const tl = gsap.timeline();

            gsap.set(items, { scale: 0, opacity: 0 });

            tl.to(items, {
                scale: 1,
                opacity: 1,
                stagger: { amount: 0.65 },
                duration: 0.6,
                ease: "back.out"
            });
        });

        return () => {
            if (timeoutId) {
                cancelAnimationFrame(timeoutId);
            }
        };
    }, [chats.length, chatsLoading]);

    if (!isDesktop && isOpen) return null;

    return (
        <div
            ref={containerRef}
            className='relative row-span-11 col-span-3 lg:col-span-1 base-container-settings overflow-y-auto overflow-x-hidden thin-scrollbar'
        >
            <div ref={chatListRef} className="flex flex-col gap-3 h-full">
                {(chatsLoading) && (
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
                    chats.map((chat) => {
                        const user = friends.find(friend => friend.chatId === chat.id) as User;
                        const preview = {
                            chatId: chat.id,
                            user: user,
                            lastMessage: chat.messages?.[chat.messages.length - 1],
                            unreadCount: chat.messages?.filter(message => !message.isRead && message.senderId !== currentUserId).length || 0,
                        }
                        return <ChatListItem
                            key={chat.id}
                            preview={preview}
                            selected={selectedChat?.id === chat.id}
                            onClick={() => {
                                dispatch(setSelectedChat(chat.id));
                                if (!isDesktop) dispatch(openMobileChatModal())
                            }}
                        />
                    })}
            </div>
        </div>
    )
}