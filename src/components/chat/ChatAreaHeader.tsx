"use client"

import { Phone, Video, PanelRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toggleInfoPanel } from "@/store/slices/InfoPanel/InfoPanelSlice"

export function ChatAreaHeader() {
    const { open } = useAppSelector(s => s.infoPanel)
    const dispatch = useAppDispatch();
    const friend = useAppSelector(s => s.friends.selectedFriend);

    return (
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background-elevated px-4">
            {/* Contact info */}
            <div className="flex items-center gap-2.5">
                <div className="relative">
                    <Avatar className="size-8">
                        <AvatarImage src={friend?.avatarUrl} alt={friend?.username} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">{friend?.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span
                        className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-background-elevated ${friend?.status === "online" ? "bg-chat-online" : "bg-chat-offline"
                            }`}
                    />
                </div>
                <div>
                    <p className="text-sm font-medium text-foreground">{friend?.username}</p>
                    <p className={`text-[11px] ${friend?.status === "online" ? "text-chat-online" : "text-chat-offline"}`}>{friend?.status}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                <button className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-surface hover:text-foreground" aria-label="Audio call">
                    <Phone className="size-4" />
                </button>
                <button className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-surface hover:text-foreground" aria-label="Video call">
                    <Video className="size-4" />
                </button>
                <button
                    onClick={() => dispatch(toggleInfoPanel())}
                    className={`flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${open
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-background-surface hover:text-foreground"
                        }`}
                    aria-label="Toggle info panel"
                >
                    <PanelRight className="size-4" />
                </button>
            </div>
        </div>
    )
}
