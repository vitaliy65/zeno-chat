import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage } from "@/store/slices/chat/ChatAsyncThunks";
import { useFile } from "@/hooks/useFIle";
import type { MessageType } from "@/types/message";
import type { PutFileResponse } from "@/app/api/uploadMedia/route";
import { convertToPlainType } from "@/lib/utils";

export function useChatMessageComposer() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.user);
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const sendMessageLoading = useAppSelector(
    (state) => state.chat.loading.sendMessage
  );

  const [message, setMessage] = useState("");

  const { saveMedia, loading: fileUploading } = useFile();

  const canSend =
    !!currentUser?.id && !!selectedChat && !sendMessageLoading && !!message.trim();

  const send = (type: MessageType, url?: string, fileName?: string) => {
    const text = url ? url : message.trim();
    if (!text || !currentUser?.id || !selectedChat || sendMessageLoading) return;

    const toId = selectedChat.participantIds.find(
      (id) => id !== currentUser.id
    );
    if (!toId) return;

    dispatch(
      sendMessage({
        chatId: selectedChat.id,
        senderId: currentUser.id,
        senderName: currentUser.username!,
        senderAvatar: currentUser.avatarUrl!,
        fileName,
        toId,
        text,
        type,
      })
    );

    if (!url) {
      setMessage("");
    }
  };

  const sendFile = async (file: File) => {
    if (!currentUser?.id || !selectedChat || sendMessageLoading) return;

    const response = (await saveMedia(
      file,
      currentUser.id,
      selectedChat.id
    )) as PutFileResponse;

    send(convertToPlainType(response.contentType), response.url, response.filename);
  };

  return {
    message,
    setMessage,
    send,
    sendFile,
    canSend,
    fileUploading,
  };
}

