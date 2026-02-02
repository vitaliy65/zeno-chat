"use client"

import { useRef } from "react";
import { gsap } from "gsap"
import { ChatPreview } from "@/types/chat";
import { cn } from "@/lib/utils";
import ChatListAvatar from "./ChatListAvatar";

interface ChatListItemProps {
    preview: ChatPreview;
    selected?: boolean;
    onClick?: () => void;
}

export function ChatListItem({ preview, selected = false, onClick }: ChatListItemProps) {
    const itemRef = useRef<HTMLDivElement | null>(null);

    // Объединяем функции анимации для разных событий
    const animate = (scale: number, duration: number, ease: string) => {
        if (itemRef.current) {
            gsap.to(itemRef.current, { scale, duration, ease });
        }
    };

    const username = preview.user?.username || "Username";
    const lastMessageText = preview.lastMessage ? preview.lastMessage.text : "No messages yet";
    let timeStr = "";
    if (preview.lastMessage?.createdAt) {
        try {
            const date = new Date(preview.lastMessage.createdAt);
            timeStr = isNaN(date.getTime())
                ? preview.lastMessage.createdAt
                : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            timeStr = preview.lastMessage.createdAt;
        }
    }

    const unread = preview.unreadCount > 0;

    return (
        <div
            ref={itemRef}
            className={cn(`flex chat-list-item w-full h-14 items-center p-2 gap-2 
                rounded-full shadow-custom-md cursor-pointer select-none`,
                selected ? "outline-3 outline-accent-bg/55" : "outline-0 outline-none")
            }
            onMouseEnter={() => animate(1.03, 0.1, "power2.out")}
            onMouseLeave={() => animate(1, 0.1, "power2.inOut")}
            onMouseDown={() => animate(0.98, 0.08, "power1.in")}
            onMouseUp={() => animate(1.03, 0.13, "power1.out")}
            onTouchStart={() => animate(0.98, 0.08, "power1.in")}
            onTouchEnd={() => animate(1.03, 0.13, "power1.out")}
            tabIndex={0}
            onClick={onClick}
        >
            <ChatListAvatar user={preview.user} />
            <div className="flex flex-col w-full mr-3 overflow-hidden">
                <div className="flex flex-row items-center justify-between">
                    <span className="font-semibold truncate">{username}</span>
                    <span className="text-foreground/50 text-xs">{timeStr || ""}</span>
                </div>
                <div className="flex">
                    <span className={`text-foreground/65 truncate block max-w-full text-sm ${unread ? "font-semibold" : ""}`}>
                        {lastMessageText}
                    </span>
                    {unread && (
                        <span className="ml-2 bg-primary text-white text-xs rounded-full min-w-5 px-2 py-px text-center select-none">
                            {preview.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}