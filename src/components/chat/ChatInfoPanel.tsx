"use client"

import { Phone, Video, MoreHorizontal, X, Image, FileText, Link2, ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeInfoPanel } from "@/store/slices/InfoPanel/InfoPanelSlice";
import { formatTime, formatTimeFullData } from "@/lib/utils";

export function ChatInfoPanel() {
    const friend = useAppSelector(s => s.friends.selectedFriend)
    const { open } = useAppSelector(s => s.infoPanel)
    const dispatch = useAppDispatch();

    if (!open || !friend) return null

    return (
        <aside className="flex w-72 shrink-0 flex-col border-l border-border bg-background-elevated">
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
                <span className="text-sm font-semibold text-foreground">Chat Info</span>
                <button
                    onClick={() => dispatch(closeInfoPanel())}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-surface hover:text-foreground"
                    aria-label="Close panel"
                >
                    <X className="size-4" />
                </button>
            </div>

            <div className="thin-scrollbar flex-1 overflow-y-auto">
                {/* Profile section */}
                <div className="flex flex-col items-center px-4 pt-6 pb-4">
                    <div className="relative">
                        <Avatar className="size-20">
                            <AvatarImage src={friend.avatarUrl || ""} alt={friend.username} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                {friend.username?.charAt(0).toUpperCase() || "-"}
                            </AvatarFallback>
                        </Avatar>
                        <span
                            className={`absolute right-0.5 bottom-0.5 size-4 rounded-full border-3 border-background-elevated ${friend.status === "online" ? "bg-chat-online" : "bg-chat-offline"}`}
                        />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-foreground">{friend.username}</h3>
                    <p className={`text-xs ${friend.status === "online" ? "text-chat-online" : "text-chat-offline"}`}>
                        {friend.status ? friend.status.charAt(0).toUpperCase() + friend.status.slice(1) : ""}
                    </p>
                    {friend.username && (
                        <p className="mt-1 text-xs text-muted-foreground">@{friend.username}</p>
                    )}
                </div>

                {/* Quick actions */}
                <div className="flex items-center justify-center gap-3 px-4 pb-4">
                    <button className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-muted-foreground transition-colors hover:bg-background-surface hover:text-foreground">
                        <Phone className="size-4" />
                        <span className="text-[10px]">Call</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-muted-foreground transition-colors hover:bg-background-surface hover:text-foreground">
                        <Video className="size-4" />
                        <span className="text-[10px]">Video</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-muted-foreground transition-colors hover:bg-background-surface hover:text-foreground">
                        <MoreHorizontal className="size-4" />
                        <span className="text-[10px]">More</span>
                    </button>
                </div>

                <div className="mx-4 h-px bg-border" />

                {/* Info section */}
                <div className="p-4">
                    <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">About</p>
                    <p className="text-sm leading-relaxed text-foreground">
                        {/* {friend.about || "No information provided."} */}
                        Not implemented yet
                    </p>
                </div>

                <div className="mx-4 h-px bg-border" />

                {/* Shared media */}
                <div className="p-4">
                    <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Shared Media
                    </p>
                    <div className="flex flex-col gap-1">
                        <button className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-foreground transition-colors hover:bg-background-surface">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                <ImageIcon className="size-4 text-primary" />
                            </div>
                            <span>Photos</span>
                            <span className="ml-auto text-xs text-muted-foreground">99</span>
                        </button>
                        <button className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-foreground transition-colors hover:bg-background-surface">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-chat-online/10">
                                <FileText className="size-4 text-chat-online" />
                            </div>
                            <span>Files</span>
                            <span className="ml-auto text-xs text-muted-foreground">99</span>
                        </button>
                        <button className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-foreground transition-colors hover:bg-background-surface">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-chat-typing/10">
                                <Link2 className="size-4 text-chat-typing" />
                            </div>
                            <span>Links</span>
                            <span className="ml-auto text-xs text-muted-foreground">99</span>
                        </button>
                    </div>
                </div>

                <div className="mx-4 h-px bg-border" />

                {/* Members in common */}
                <div className="p-4">
                    <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {friend.createdAt
                            ? `Joined ${formatTimeFullData(friend.createdAt)}`
                            : "Member"}
                    </p>
                </div>
            </div>
        </aside>
    )
}
