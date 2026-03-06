import { Plus, Search, Users } from 'lucide-react'
import React from 'react'

interface ChatListHeaderProps {
    input: string
    onChange: (v: string) => void
}

export default function ChatListHeader({ input, onChange }: ChatListHeaderProps) {
    return (
        <div className="flex flex-col gap-3 p-3">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-lg bg-background-surface px-3 py-2">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                    value={input}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search chats..."
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-1">
                <button className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
                    <Plus className="size-3.5" />
                    New Chat
                </button>
                <button className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-background-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Users className="size-3.5" />
                    New Group
                </button>
            </div>
        </div>
    )
}
