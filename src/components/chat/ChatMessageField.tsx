"use client";

import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage } from "@/store/slices/chat/ChatAsyncThunks";
import { useFile } from "@/hooks/useFIle";
import { MessageType } from "@/types/message";
import { PutBlobResult } from "@vercel/blob";
import { PutFileResponse } from "@/app/api/uploadMedia/route";
import { convertToPlainType } from "@/lib/utils";

export default function ChatMessageField() {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.user.user);
    const selectedChat = useAppSelector((state) => state.chat.selectedChat);
    const sendMessageLoading = useAppSelector((state) => state.chat.loading.sendMessage);

    const [message, setMessage] = useState("")

    const { saveMedia, loading: fileUploading } = useFile();

    const handleSend = (type: MessageType, url?: string, fileName?: string) => {
        const text = url ? url : message.trim();
        if (!text || !currentUser?.id || !selectedChat || sendMessageLoading) return;

        const toId = selectedChat.participantIds.find((id) => id !== currentUser?.id);
        if (!toId) return;

        dispatch(sendMessage(
            {
                chatId: selectedChat.id,
                senderId: currentUser.id,
                senderName: currentUser.username!,
                senderAvatar: currentUser.avatarUrl!,
                fileName: fileName,
                toId,
                text,
                type,
            }
        ));

        setMessage("");
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || !currentUser?.id || !selectedChat || sendMessageLoading) return;

        const response = await saveMedia(files[0], currentUser?.id || "noUserID", selectedChat?.id || "noChatID") as PutFileResponse;
        e.target.value = "";

        handleSend(convertToPlainType(response.contentType), response.url, response.filename)
    };

    return (
        <div className="border-t border-border bg-background-elevated px-4 py-3 lg:px-6">
            <div className="flex items-end gap-2 rounded-xl bg-background-surface px-3 py-2">
                {/* Attach */}
                <label
                    className="mb-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-elevated hover:text-foreground"
                    aria-label="Attach file"
                >
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={fileUploading}
                    />
                    <Paperclip className="size-4" />
                </label>

                {/* Text area */}
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message..."
                    rows={1}
                    className="max-h-[120px] min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground outline-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend("text");
                        }
                    }}
                />

                {/* Emoji */}
                <button
                    className="mb-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-elevated hover:text-foreground"
                    aria-label="Emoji"
                    type="button"
                >
                    <Smile className="size-4" />
                </button>

                {/* Send or Voice */}
                {message.trim() ? (
                    <button
                        onClick={() => setMessage("")}
                        className="mb-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary-hover active:scale-95"
                        aria-label="Send message"
                    >
                        <Send className="size-4" />
                    </button>
                ) : (
                    <button
                        className="mb-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-elevated hover:text-foreground"
                        aria-label="Voice message"
                        type="button"
                        disabled={fileUploading}
                    >
                        <Mic className="size-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
