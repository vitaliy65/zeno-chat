import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Chat } from "@/types/chat";
import type { Message } from "@/types/message";
import { FirebaseError } from "firebase/app";
import { chatService } from "@/services/chatService";
import { UserChat } from "@/types/user";

export type MessageFieldsToSend = Omit<Message, 'id' | 'isRead' | 'createdAt'> & { toId: string; };

export const fetchChats = createAsyncThunk<
    Chat[],
    { userChatIds: UserChat[] }>(
        "chat/fetchChats",
        async ({ userChatIds }, { rejectWithValue }) => {
            try {
                const chats = await chatService.getChatsForUser(userChatIds, 50);
                return chats;
            } catch (error) {
                if (error instanceof FirebaseError) {
                    return rejectWithValue(error.message || "Failed to fetch chats");
                }
                return rejectWithValue("Failed to fetch chats");
            }
        }
    );

export const createChat = createAsyncThunk<
    Chat,
    { userId: string; otherUserId: string }>(
        "chat/createChat",
        async ({ userId, otherUserId }, { rejectWithValue }) => {
            try {
                const chat = await chatService.createChatBetweenUsers(userId, otherUserId);
                return chat;
            } catch (error) {
                if (error instanceof FirebaseError) {
                    return rejectWithValue(error.message || "Failed to create chat");
                }
                if (typeof error === "string") {
                    return rejectWithValue(error);
                }
                return rejectWithValue("Failed to create chat");
            }
        }
    );

export const sendMessage = createAsyncThunk<
    { chat: Chat; message: Message }, MessageFieldsToSend>(
        "chat/sendMessage",
        async (messageFields, { rejectWithValue }) => {
            try {
                const { chat, message } = await chatService.sendMessage(messageFields);

                return { chat, message };
            } catch (error) {
                if (error instanceof FirebaseError) {
                    return rejectWithValue(error.message || "Failed to send message");
                }
                return rejectWithValue("Failed to send message");
            }
        }
    );

export const markChatAsRead = createAsyncThunk<
    void, { chatId: string, userId: string }>(
        "chat/markChatAsRead",
        async ({ chatId, userId }, { rejectWithValue }) => {
            try {
                await chatService.markChatAsRead(chatId, userId);
            } catch (error) {
                if (error instanceof FirebaseError) {
                    return rejectWithValue(error.message || "Failed to mark messages as read");
                }
            }
        }
    );

export const fetchMoreMessages = createAsyncThunk<
    { chatId: string, messages: Message[] },
    { chatId: string, firstMessageId: string, pageSize?: number }>(
        "chat/fetchMoreMessages",
        async ({ chatId, firstMessageId, pageSize = 50 }, { rejectWithValue }) => {
            try {
                const messages = await chatService.fetchMoreMessages(chatId, firstMessageId, pageSize);

                return { chatId, messages };
            } catch (error) {
                if (error instanceof FirebaseError) {
                    return rejectWithValue(error.message || "Failed to fetch more messages");
                }
                return rejectWithValue("Failed to fetch more messages");
            }
        }
    );