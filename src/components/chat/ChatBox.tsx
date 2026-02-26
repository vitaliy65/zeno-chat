"use client";

import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ChatBoxMsgGetter from "./ChatBoxMsgGetter";
import ChatBoxMsgSender from "./ChatBoxMsgSender";
import { fetchMoreMessages, markChatAsRead } from "@/store/slices/chat/ChatAsyncThunks";

export default function ChatBox() {
    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const { selectedChat } = useAppSelector((state) => state.chat);
    const id = selectedChat?.id;
    const messages = selectedChat?.messages ?? [];
    const dispatch = useAppDispatch();
    const bottomRef = useRef<HTMLDivElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        const container = containerRef.current;
        if (!container) return;

        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
    }, [id, messages.length]);

    useEffect(() => {
        if (!currentUserId || !id) return;
        dispatch(markChatAsRead({ userId: currentUserId, chatId: id }));
    }, [currentUserId, dispatch, id]);

    const handleScroll = async () => {
        const container = containerRef.current;
        if (!container || !id) return;

        if (container.scrollTop === 0) {
            const firstMessageId = messages[0].id;
            const prevScrollHeight = container.scrollHeight;

            const res = await dispatch(fetchMoreMessages({ chatId: id, firstMessageId }));

            const loadedMessages =
                typeof res.payload === "object" && res.payload && "messages" in res.payload
                    ? (res.payload.messages as unknown[])
                    : [];

            if (loadedMessages.length > 0) {
                requestAnimationFrame(() => {
                    const c = containerRef.current;
                    if (!c) return;
                    const newScrollHeight = c.scrollHeight;
                    c.scrollTop = newScrollHeight - prevScrollHeight;
                });
            }
        }
    };

    return (
        <div
            className="flex flex-col w-full h-full rounded-md shadow-custom-lg-inset px-4 py-2 overflow-x-hidden overflow-y-auto thin-scrollbar space-y-1"
            ref={containerRef}
            onScroll={handleScroll}
        >
            {messages.map((msg, index) => {
                const isSender = msg.senderId === currentUserId;
                const nextSameType =
                    index + 1 < messages.length && messages[index + 1].senderId === msg.senderId;

                if (isSender) {
                    return (
                        <div key={`chat-row-${msg.id}-${index}`}>
                            <ChatBoxMsgSender
                                text={msg.text}
                                nextSameType={nextSameType}
                            />
                        </div>
                    );
                }

                return (
                    <div key={`chat-row-${msg.id}-${index}`}>
                        <ChatBoxMsgGetter
                            text={msg.text}
                            nextSameType={nextSameType}
                        />
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}
