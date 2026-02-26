"use client"

import { useMessagesListener } from '@/hooks/useMessagesListener';
import { useProfileChangeListener } from '@/hooks/useProfileChangeListener';
import useUserStatusListener from '@/hooks/useUserStatusListener';
import { useAppSelector } from '@/store/hooks';

export default function ListenersProvider() {
    const chats = useAppSelector((state) => state.chat.chats);

    useMessagesListener(chats);
    useProfileChangeListener();
    useUserStatusListener();

    return null;
}
