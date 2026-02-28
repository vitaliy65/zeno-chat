"use client";

import { useState } from "react";
import { User } from "@/types/user";
import AvatarBlock from "./AvatarBlock";
import { createChat } from "@/store/slices/chat/ChatAsyncThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Spinner from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { fetchFriends } from "@/store/slices/friends/FriendsAsyncThunks";
import UserAvatar from "../UserAvatar";

export default function UsersSearchList({ users }: { users: User[] }) {
    const dispatch = useAppDispatch();
    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const createChatLoading = useAppSelector((state) => state.chat.loading.createChat);
    const [creatingForUserId, setCreatingForUserId] = useState<string | null>(null);

    if (!users.length) return null;

    const handleCreateChat = async (otherUserId: string) => {
        if (!currentUserId) return;
        setCreatingForUserId(otherUserId);
        try {
            await dispatch(createChat({ userId: currentUserId, otherUserId }));
            await dispatch(fetchFriends({ currentUserId }));
        } finally {
            setCreatingForUserId(null);
        }
    };

    return (
        <div className={`absolute w-full min-h-[56px] z-20 left-1/2 -translate-x-1/2 top-14 bg-background-second 
                        rounded-xl shadow-custom-lg p-2 border border-primary/20 flex flex-col gap-1`}>
            {users.map((user) => {
                const isCreating = createChatLoading && creatingForUserId === user.id;
                return (
                    <div
                        key={user.id}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group select-none",
                            isCreating ? "cursor-wait opacity-70" : "hover:bg-background cursor-pointer active:scale-98"
                        )}
                        onClick={() => !isCreating && handleCreateChat(user.id)}
                    >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shadow-custom-sm border border-secondary/20">
                            <UserAvatar user={user} />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap">{user.username}</span>
                                {isCreating && (
                                    <span className="shrink-0 [&_svg]:h-5 [&_svg]:w-5">
                                        <Spinner />
                                    </span>
                                )}
                            </div>
                            {user.status === "online" ? (
                                <span className="text-xs text-primary/80">Online</span>
                            ) : user.status === "away" ? (
                                <span className="text-xs text-yellow-600/80">Away</span>
                            ) : (
                                <span className="text-xs text-muted-foreground/70">{user.lastSeenAt ? `Last seen at ${new Date(user.lastSeenAt).toLocaleString()}` : "Offline"}</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
