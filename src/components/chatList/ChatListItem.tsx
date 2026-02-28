"use client"

import { ChatPreview } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatTime } from "@/lib/utils";

interface ChatListItemProps {
    preview: ChatPreview;
    selected?: boolean;
    onClick?: () => void;
}

export function ChatListItem({ preview, selected = false, onClick }: ChatListItemProps) {
    if (!preview.user) return

    return (
        <button
            onClick={onClick}
            className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all ${selected
                ? "bg-primary/15 text-foreground"
                : "text-foreground hover:bg-background-surface"
                }`}
        >
            <div className="relative shrink-0">
                <Avatar className="size-9">
                    {preview.user.avatarUrl ? (
                        <AvatarImage src={preview.user.avatarUrl} alt={preview.user.username} />
                    ) : null}
                    <AvatarFallback
                        className={`text-xs font-medium bg-secondary text-muted-foreground`}
                    >
                        {preview.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <span
                    className={`absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background-elevated ${preview.user.status === "online" ? "bg-chat-online" : "bg-chat-offline"}`}
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium">{preview.user.username}</p>
                    <span className="ml-1 shrink-0 text-[10px] text-muted-foreground">{formatTime(preview.lastMessage?.createdAt)}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{preview.lastMessage?.text}</p>
            </div>

            {preview.unreadCount > 0 && (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {preview.unreadCount > 9 ? "9+" : preview.unreadCount}
                </span>
            )}
        </button>
    );
}