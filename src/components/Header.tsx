"use client"

import { useAppSelector } from "@/store/hooks";
import AvatarBlock from "./header/AvatarBlock";
import HeaderLogo from "./header/header-logo";
import SearchBlock from "./header/Search-block";
import AvatarMock from "./mock/AvatarMock";
import { Settings } from "lucide-react";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function Header() {
    const { user } = useAppSelector(s => s.user)
    const { isMobile } = useMediaQuery();

    return (
        <div className='flex h-14 shrink-0 items-center justify-between border-b border-border bg-background-elevated px-4'>
            <HeaderLogo />
            <div className="flex flex-row gap-2 justify-end">
                {!isMobile && <SearchBlock />}

                {/* Settings */}
                <button className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-surface hover:text-foreground" aria-label="Settings">
                    <Settings className="size-4" />
                </button>

                {user ? <AvatarBlock user={user} /> : <AvatarMock />}
            </div>
        </div>
    )
}
