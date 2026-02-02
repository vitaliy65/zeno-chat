"use client";

import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ChatBoxMsgGetter from "./ChatBoxMsgGetter";
import ChatBoxMsgSender from "./ChatBoxMsgSender";
import { markChatAsRead } from "@/store/slices/chat/ChatAsyncThunks";

export default function ChatBox() {
    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const selectedChat = useAppSelector((state) => state.chat.selectedChat);
    const id = selectedChat?.id;
    const messages = selectedChat?.messages ?? [];
    const dispatch = useAppDispatch();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        dispatch(markChatAsRead({ userId: currentUserId || "", chatId: id || '' }))
    }, [currentUserId, dispatch, id, messages.length]);

    return (
        <div className="flex flex-col w-full h-full rounded-md shadow-custom-lg-inset px-4 py-2 overflow-x-hidden overflow-y-auto thin-scrollbar space-y-1">
            {messages.map((msg, index) => {
                const isSender = msg.senderId === currentUserId;
                const nextSameType = index + 1 < messages.length && messages[index + 1].senderId === msg.senderId;

                return isSender ? (
                    <ChatBoxMsgSender key={msg.id} text={msg.text} nextSameType={nextSameType} />
                ) : (
                    <ChatBoxMsgGetter key={msg.id} text={msg.text} nextSameType={nextSameType} />
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}
