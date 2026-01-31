"use client";

import { Paperclip, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage } from "@/store/slices/chat/ChatAsyncThunks";

export default function ChatMessageField() {
    const [messageText, setMessageText] = useState("");
    const dispatch = useAppDispatch();
    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const selectedChat = useAppSelector((state) => state.chat.selectedChat);
    const sendMessageLoading = useAppSelector((state) => state.chat.loading.sendMessage);

    const handleSend = () => {
        const text = messageText.trim();
        if (!text || !currentUserId || !selectedChat || sendMessageLoading) return;

        const toId = selectedChat.participantIds.find((id) => id !== currentUserId);
        if (!toId) return;

        dispatch(sendMessage({ fromId: currentUserId, toId, text }));
        setMessageText("");
    };

    return (
        <div className="flex w-full h-16 rounded-md shadow-custom-lg max-w-2/3 px-4 py-2 space-x-3">
            <button className="aspect-square h-full bg-accent-bg/50 rounded-full shadow-custom-md flex justify-center items-center text-white button-basic">
                <Paperclip />
            </button>
            <div className="relative flex bg-background-second/50 w-full p-1 rounded-full shadow-custom-md-inset gap-2">
                <button
                    className="bg-accent-bg/50 text-white h-full aspect-square rounded-full flex justify-center items-center shadow-custom-sm button-basic disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSend}
                    disabled={sendMessageLoading}
                >
                    <SendHorizonal />
                </button>
                <input
                    type="text"
                    className="w-full focus:outline-none focus:ring-0"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Write a message..."
                />
            </div>
        </div>
    );
}
