"use client"

import { useAppSelector } from "@/store/hooks";
import ChatNotSelected from "./chat/ChatNotSelected";
import ChatBox from "./chat/ChatBox";
import ChatMessageField from "./chat/ChatMessageField";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function ChatContainer() {
    const chat = useAppSelector((s) => s.chat.selectedChat);
    const { isDesktop } = useMediaQuery();
    const { isOpen } = useAppSelector(s => s.MobileChatNodal)

    // Если не desktop и не открыт мобильный чат - ничего не рендерим
    if (!isDesktop && !isOpen) return null;

    return (
        <div className='relative flex flex-col justify-center items-center row-span-11 col-span-3 base-container-settings overflow-y-auto p-4 space-y-4'>
            {chat ? (
                <>
                    <ChatBox />
                    <ChatMessageField />
                </>
            ) : (
                <ChatNotSelected />
            )}
        </div>
    );
}
