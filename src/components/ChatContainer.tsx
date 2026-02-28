"use client"

import { useAppSelector } from "@/store/hooks";
import ChatNotSelected from "./chat/ChatNotSelected";
import ChatBox from "./chat/ChatBox";
import ChatMessageField from "./chat/ChatMessageField";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ChatAreaHeader } from "./chat/ChatAreaHeader";

export default function ChatContainer() {
    const chat = useAppSelector((s) => s.chat.selectedChat);
    const { isDesktop } = useMediaQuery();
    const { isOpen } = useAppSelector(s => s.MobileChatNodal)

    // Если не desktop и не открыт мобильный чат - ничего не рендерим
    if (!isDesktop && !isOpen) return null;

    return (
        <main className='flex min-w-0 flex-1 flex-col'>
            {chat ? (
                <>
                    <ChatAreaHeader />
                    <ChatBox />
                    <ChatMessageField />
                </>
            ) : (
                <ChatNotSelected />
            )}
        </main>
    );
}
