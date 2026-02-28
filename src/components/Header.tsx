"use client"

import { useAppSelector } from "@/store/hooks";
import AvatarBlock from "./header/AvatarBlock";
import HeaderLogo from "./header/header-logo";
import SearchBlock from "./header/Search-block";
import AvatarMock from "./mock/AvatarMock";
import { Bell, Settings } from "lucide-react";

export default function Header() {
    const { user } = useAppSelector(s => s.user)

    return (
        <div className='flex h-14 shrink-0 items-center justify-between border-b border-border bg-background-elevated px-4'>
            <HeaderLogo />
            <div className="flex flex-row gap-2 justify-end">
                <SearchBlock />

                {/* Notifications */}
                <button className="relative flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-surface hover:text-foreground" aria-label="Notifications">
                    <Bell className="size-4" />
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
                </button>

                {/* Settings */}
                <button className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-surface hover:text-foreground" aria-label="Settings">
                    <Settings className="size-4" />
                </button>

                {user ? <AvatarBlock user={user} /> : <AvatarMock />}
            </div>
        </div>
    )
}
