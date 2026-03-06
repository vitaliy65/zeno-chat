import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchChats } from "@/store/slices/chat/ChatAsyncThunks";
import { fetchFriends } from "@/store/slices/friends/FriendsAsyncThunks";
import { setSelectedChat } from "@/store/slices/chat/ChatSlice";
import { setSelectedFriend } from "@/store/slices/friends/FriendsSlice";
import { openMobileChatModal } from "@/store/slices/MobileChat/MobileChatModalSlice";
import type { ChatPreview } from "@/types/chat";
import type { User } from "@/types/user";
import useMediaQuery from "./useMediaQuery";

export function useChatList() {
  const dispatch = useAppDispatch();

  const currentUserId = useAppSelector((state) => state.user.user?.id);
  const { fetchChats: chatsLoading } = useAppSelector(
    (state) => state.chat.loading
  );
  const chats = useAppSelector((state) => state.chat.chats);
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const friends = useAppSelector((state) => state.friends.friends);
  const { isDesktop } = useMediaQuery();
  const { isOpen } = useAppSelector((s) => s.MobileChatNodal);

  useEffect(() => {
    if (!currentUserId) return;

    dispatch(fetchFriends({ currentUserId }));
    dispatch(fetchChats({ userId: currentUserId }));
  }, [currentUserId, dispatch]);

  const previews: ChatPreview[] = useMemo(
    () =>
      chats.map((chat) => {
        const user = friends.find(
          (friend) => friend.chatId === chat.id
        ) as User;

        const lastMessage = chat.messages?.[chat.messages.length - 1];
        const unreadCount =
          chat.messages?.filter(
            (message) =>
              !message.isRead && message.senderId !== currentUserId
          ).length || 0;

        return {
          chatId: chat.id!,
          user,
          lastMessage,
          unreadCount,
        };
      }),
    [chats, friends, currentUserId]
  );

  const selectChat = (preview: ChatPreview) => {
    const chatId = preview.chatId;
    if (!chatId || !preview.user) return;

    dispatch(setSelectedChat(chatId));
    dispatch(setSelectedFriend(preview.user.id));
    if (!isDesktop) {
      dispatch(openMobileChatModal());
    }
  };

  return {
    chatsLoading,
    chats,
    previews,
    selectedChatId: selectedChat?.id,
    isDesktop,
    isMobileChatOpen: isOpen,
    selectChat,
  };
}

