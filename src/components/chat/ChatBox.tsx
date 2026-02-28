"use client";

import { useRef, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMoreMessages, markChatAsRead } from "@/store/slices/chat/ChatAsyncThunks";
import { Message } from "@/types/message";
import { Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatTime } from "@/lib/utils";

interface MessageGroup {
    sender: "me" | "them";
    senderName?: string;
    senderAvatar?: string;
    messages: Message[];
}

// Исправленная группировка сообщений: теперь "группируются только подряд идущие сообщения от одного и того же отправителя"
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

    // Группируем только идущие подряд сообщения одного и того же отправителя
    const groupMessages = useCallback(
        (messages: Message[]): MessageGroup[] => {
            const groups: MessageGroup[] = [];

            for (const msg of messages) {
                const sender = msg.senderId === currentUserId ? "me" : "them";

                const last = groups[groups.length - 1];

                // Группируем, только если sender совпадает (не senderId, а "me"/"them")
                if (
                    last &&
                    last.sender === sender &&
                    last.senderName === msg.senderName &&
                    last.senderAvatar === msg.senderAvatar
                ) {
                    last.messages.push(msg);
                } else {
                    groups.push({
                        sender: sender,
                        senderName: msg.senderName,
                        senderAvatar: msg.senderAvatar,
                        messages: [msg],
                    });
                }
            }

            return groups;
        },
        [currentUserId]
    );

    const groups = groupMessages(messages);
    // console.log(groups)

    return (
        <div
            className="thin-scrollbar flex-1 overflow-y-auto px-4 py-4 lg:px-6"
            ref={containerRef}
            onScroll={handleScroll}
        >
            {groups.map((group, gi) => (
                <div
                    key={gi}
                    className={`flex gap-2.5 ${group.sender === "me" ? "flex-row-reverse" : "flex-row"
                        }`}
                >
                    {/* Avatar - only for others */}
                    {group.sender === "them" ? (
                        <Avatar className="mt-0.5 size-8 shrink-0">
                            {group.senderAvatar ? (
                                <AvatarImage src={group.senderAvatar} alt={group.senderName || "User"} />
                            ) : null}
                            <AvatarFallback className="bg-secondary text-muted-foreground text-xs">
                                {(group.senderName || "U").charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="w-8 shrink-0" />
                    )}

                    {/* Message bubbles */}
                    <div
                        className={`flex max-w-[65%] flex-col gap-0.5 ${group.sender === "me" ? "items-end" : "items-start"
                            }`}
                    >
                        {/* Sender name for "them" - first message only */}
                        {group.sender === "them" && group.senderName && (
                            <span className="mb-0.5 px-1 text-xs font-medium text-primary">
                                {group.senderName}
                            </span>
                        )}

                        {group.messages.map((msg, mi) => {
                            const isFirst = mi === 0;
                            const isLast = mi === group.messages.length - 1;
                            const isOwn = msg.senderId === currentUserId;

                            return (
                                <div
                                    key={msg.id}
                                    className={`group relative inline-flex max-w-full items-end gap-1.5 ${isOwn ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <div
                                        className={`inline-block px-3.5 py-2 text-sm leading-relaxed ${isOwn
                                            ? "bg-chat-bubble-own text-chat-bubble-own-foreground"
                                            : "bg-chat-bubble-other text-chat-bubble-other-foreground"
                                            } ${isOwn
                                                ? isFirst && isLast
                                                    ? "rounded-2xl rounded-br-md"
                                                    : isFirst
                                                        ? "rounded-2xl rounded-br-md"
                                                        : isLast
                                                            ? "rounded-2xl rounded-tr-md"
                                                            : "rounded-2xl rounded-r-md"
                                                : isFirst && isLast
                                                    ? "rounded-2xl rounded-bl-md"
                                                    : isFirst
                                                        ? "rounded-2xl rounded-bl-md"
                                                        : isLast
                                                            ? "rounded-2xl rounded-tl-md"
                                                            : "rounded-2xl rounded-l-md"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>

                                    {/* Time + read status - visible on hover or for last message */}
                                    <span
                                        className={`flex shrink-0 items-center gap-0.5 text-[10px] text-muted-foreground ${isLast
                                            ? "opacity-100"
                                            : "opacity-0 transition-opacity group-hover:opacity-100"
                                            }`}
                                    >
                                        {formatTime(msg.createdAt)}
                                        {isOwn &&
                                            (msg.isRead ? (
                                                <CheckCheck className="size-3 text-primary" />
                                            ) : (
                                                <Check className="size-3" />
                                            ))}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
