import { ChatModel } from "@/models/ChatModel";
import { MessageModel } from "@/models/MessageModel";
import type { Chat } from "@/types/chat";
import type { Message } from "@/types/message";
import type { MessageFieldsToSend } from "@/store/slices/chat/ChatAsyncThunks";
import { UserChat } from "@/types/user";

export const chatService = {
  getChatsForUser(userChatIds: UserChat[], messagesLimit = 50): Promise<Chat[]> {
    return ChatModel.fetchChatsForUser(userChatIds, { messagesLimit });
  },

  async createChatBetweenUsers(
    userId: string,
    otherUserId: string
  ): Promise<Chat> {
    return ChatModel.createChatBetweenUsers(userId, otherUserId);
  },

  async sendMessage(
    messageFields: MessageFieldsToSend
  ): Promise<{ chat: Chat; message: Message }> {
    return ChatModel.sendMessage(messageFields);
  },

  async markChatAsRead(chatId: string, userId: string): Promise<void> {
    await ChatModel.markChatAsRead(chatId, userId);
  },

  async fetchMoreMessages(
    chatId: string,
    firstMessageId: string,
    pageSize = 50
  ): Promise<Message[]> {
    return MessageModel.fetchMoreMessages(chatId, firstMessageId, pageSize);
  },
};

