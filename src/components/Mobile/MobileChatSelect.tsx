"use client"

import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { closeMobileChatModal } from "@/store/slices/MobileChat/MobileChatModalSlice";
import { MessageCircle } from "lucide-react";

export default function MobileChatSelect() {
    const dispatch = useAppDispatch()
    const { isDesktop, isMobile } = useMediaQuery();

    return (
        <div
            className={cn("relative w-22 bg-background-elevated border-r border-r-border px-3 py-2 overflow-y-auto overflow-x-hidden thin-scrollbar", (isDesktop || isMobile) && "hidden")}
        >
            <button className="flex flex-col justify-center items-center aspect-square w-full bg-background-surface rounded-md p-2 gap-2 shadow-custom-md
            hover:bg-background-light button-basic" onClick={() => dispatch(closeMobileChatModal())}>
                <MessageCircle />
                <span className="text-xs">All Chats</span>
            </button>
        </div>
    )
}
