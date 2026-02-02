"use client"

import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { closeMobileChatModal } from "@/store/slices/MobileChat/MobileChatModalSlice";
import { MessageCircle } from "lucide-react";

export default function MobileChatSelect() {
    const dispatch = useAppDispatch()
    const { isDesktop } = useMediaQuery();

    return (
        <div
            className={cn("relative row-span-11 col-span-1 base-container-settings overflow-y-auto overflow-x-hidden thin-scrollbar", isDesktop && "hidden")}
        >
            <button className="flex flex-col justify-center items-center aspect-square w-full bg-background-light/70 rounded-md p-1 gap-2 shadow-custom-md
            hover:bg-background-light button-basic" onClick={() => dispatch(closeMobileChatModal())}>
                <MessageCircle />
                <span className="text-xs">All Chats</span>
            </button>
        </div>
    )
}
