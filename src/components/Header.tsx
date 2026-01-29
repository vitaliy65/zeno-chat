"use client"

import { useAppSelector } from "@/store/hooks";
import AvatarBlock from "./header/AvatarBlock";
import HeaderLogo from "./header/header-logo";
import NotificationBlock from "./header/NotificationBlock";
import SearchBlock from "./header/Search-block";
import AvatarMock from "./mock/AvatarMock";

export default function Header() {
    const { user } = useAppSelector(s => s.user)


    return (
        <div className='flex row-span-1 col-span-4 base-container-settings justify-between'>
            <HeaderLogo />
            <div className="flex flex-row gap-2">
                <SearchBlock />
                <NotificationBlock />
                {user ? <AvatarBlock user={user} /> : <AvatarMock />}
            </div>
        </div>
    )
}
