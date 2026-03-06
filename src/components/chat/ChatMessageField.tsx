"use client";

import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { useChatMessageComposer } from "@/hooks/useChatMessageComposer";
import dynamic from 'next/dynamic';
import { useState } from "react";
import { Theme } from 'emoji-picker-react'

const EmojiPicker = dynamic(
    () => import('emoji-picker-react'),
    { ssr: false }
);

export default function ChatMessageField() {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const {
        message,
        setMessage,
        send,
        sendFile,
        canSend,
        fileUploading
    } = useChatMessageComposer();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files[0]) return;
        await sendFile(files[0]);
        e.target.value = "";
    };

    // Function to append emoji to the current message
    const onEmojiClick = (emojiData: { emoji: string }) => {
        setMessage((prev) => prev + emojiData.emoji);
        // Optional: Close picker after selection
        // setShowEmojiPicker(false); 
    };

    return (
        <div className="relative border-t border-border bg-background-elevated px-4 py-3 lg:px-6">

            {/* Emoji Picker Modal/Popover */}
            {showEmojiPicker && (
                <div className="absolute bottom-20 right-4 z-50 shadow-xl">
                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                        lazyLoadEmojis
                        className="bg-background-surface! border-border!"
                    />
                </div>
            )}

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
                            e.preventDefault();
                            send("text");
                        }
                    }}
                />

                {/* Emoji Button */}
                <button
                    className={`mb-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-background-elevated hover:text-foreground ${showEmojiPicker ? "text-primary bg-background-elevated" : "text-muted-foreground"
                        }`}
                    aria-label="Emoji"
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <Smile className="size-4" />
                </button>

                {/* Send or Voice */}
                {message.trim() ? (
                    <button
                        onClick={() => {
                            send("text");
                            setShowEmojiPicker(false); // Close picker on send
                        }}
                        className="mb-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary-hover active:scale-95"
                        aria-label="Send message"
                        disabled={!canSend}
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
