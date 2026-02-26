import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Chat } from "@/types/chat";
import type { Message } from "@/types/message";
import {
    fetchChats,
    createChat,
    sendMessage,
    markChatAsRead,
    fetchMoreMessages
} from "./ChatAsyncThunks";

// Индивидуальные флаги загрузки для каждого async thunk
interface ChatLoadingState {
    fetchChats: boolean;
    fetchChatMessages: boolean;
    createChat: boolean;
    sendMessage: boolean;
}

interface ChatState {
    chats: Chat[];
    selectedChat?: Chat;
    error?: string;
    loading: ChatLoadingState;
}

const initialState: ChatState = {
    chats: [],
    selectedChat: undefined,
    error: undefined,
    loading: {
        fetchChats: false,
        fetchChatMessages: false,
        createChat: false,
        sendMessage: false,
    },
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChat(state, action: PayloadAction<string | undefined>) {
            if (action.payload === undefined) {
                state.selectedChat = undefined;
            } else {
                const foundChat = state.chats.find((c) => c.id === action.payload);
                state.selectedChat = foundChat ? foundChat : undefined;
            }
        },
        clearChatError(state) {
            state.error = undefined;
        },
        updateChatMessages(state, action: PayloadAction<{ chatId: string; newMessage: Message }>) {
            const { chatId, newMessage } = action.payload;
            const chatIdx = state.chats.findIndex((c) => c.id === chatId);
            if (chatIdx > -1) {
                const prevMessages = state.chats[chatIdx].messages ?? [];
                // Avoid duplicate messages by id
                if (!prevMessages.some((m) => m.id === newMessage.id)) {
                    state.chats[chatIdx] = {
                        ...state.chats[chatIdx],
                        messages: [...prevMessages, newMessage]
                    };
                }
            }
            if (state.selectedChat?.id === chatId) {
                const prevMessages = state.selectedChat.messages ?? [];
                if (!prevMessages.some((m) => m.id === newMessage.id)) {
                    state.selectedChat = {
                        ...state.selectedChat,
                        messages: [...prevMessages, newMessage]
                    };
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder

            // fetchChats
            .addCase(fetchChats.pending, (state) => {
                state.loading.fetchChats = true;
                state.error = undefined;
            })
            .addCase(fetchChats.fulfilled, (state, action: PayloadAction<Chat[]>) => {
                state.chats = action.payload;
                state.loading.fetchChats = false;
                state.error = undefined;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading.fetchChats = false;
                state.error = action.payload as string || "Failed to fetch chats";
            })

            // createChat
            .addCase(createChat.pending, (state) => {
                state.loading.createChat = true;
                state.error = undefined;
            })
            .addCase(createChat.fulfilled, (state, action: PayloadAction<Chat>) => {
                const chat = action.payload;
                if (!state.chats.some((c) => c.id === chat.id)) {
                    state.chats.push(chat);
                }
                state.loading.createChat = false;
                state.error = undefined;
            })
            .addCase(createChat.rejected, (state, action) => {
                state.loading.createChat = false;
                state.error = action.payload as string || "Failed to create chat";
            })

            // sendMessage
            .addCase(sendMessage.pending, (state) => {
                state.loading.sendMessage = true;
                state.error = undefined;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const { chat, message } = action.payload;
                const chatIdx = state.chats.findIndex((c) => c.id === chat.id);
                if (chatIdx > -1) {
                    const prevMessages = (state.chats[chatIdx] as Chat).messages ?? [];
                    state.chats[chatIdx] = {
                        ...chat,
                        messages: [...prevMessages, message]
                    };
                } else {
                    state.chats.push({
                        ...chat,
                        messages: [message]
                    } as Chat);
                }
                state.loading.sendMessage = false;
                state.error = undefined;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading.sendMessage = false;
                state.error = action.payload as string || "Failed to send message";
            })

            // markChatAsRead
            .addCase(markChatAsRead.pending, (state) => {
                state.error = undefined;
            })
            .addCase(markChatAsRead.fulfilled, (state, action) => {
                const { chatId, userId } = (action.meta.arg as { chatId: string, userId: string });

                // Update in chats array
                const chatIdx = state.chats.findIndex((c) => c.id === chatId);
                if (chatIdx > -1 && state.chats[chatIdx].messages) {
                    state.chats[chatIdx] = {
                        ...state.chats[chatIdx],
                        messages: state.chats[chatIdx].messages?.map(msg =>
                            msg.senderId !== userId ? { ...msg, isRead: true } : msg
                        )
                    };
                }

                // Update in selectedChat if currently selected
                if (state.selectedChat?.id === chatId && state.selectedChat.messages) {
                    state.selectedChat = {
                        ...state.selectedChat,
                        messages: state.selectedChat.messages.map(msg =>
                            msg.senderId !== userId ? { ...msg, isRead: true } : msg
                        )
                    };
                }
                state.error = undefined;
            })
            .addCase(markChatAsRead.rejected, (state, action) => {
                state.error = action.payload as string || "Failed to mark messages as read";
            })

            // fetchMoreMessages
            .addCase(fetchMoreMessages.pending, (state) => {
                state.loading.fetchChatMessages = true;
                state.error = undefined;
            })
            .addCase(fetchMoreMessages.fulfilled, (state, action) => {
                const { chatId, messages } = action.payload;

                // Update chat in chats array
                const chatIdx = state.chats.findIndex((c) => c.id === chatId);
                if (chatIdx > -1) {
                    // Prepend the older messages to the current messages
                    const prevMessages = state.chats[chatIdx].messages ?? [];
                    // Only add unique messages (avoid duplicates)
                    const existingIds = new Set(prevMessages.map(m => m.id));
                    const newMessages = messages.filter(m => !existingIds.has(m.id));
                    state.chats[chatIdx] = {
                        ...state.chats[chatIdx],
                        messages: [...newMessages, ...prevMessages]
                    };
                }

                // Update selectedChat if it's for the right chatId
                if (state.selectedChat?.id === chatId) {
                    const prevMessagesSel = state.selectedChat.messages ?? [];
                    const existingIdsSel = new Set(prevMessagesSel.map(m => m.id));
                    const newMessagesSel = messages.filter(m => !existingIdsSel.has(m.id));
                    state.selectedChat = {
                        ...state.selectedChat,
                        messages: [...newMessagesSel, ...prevMessagesSel]
                    };
                }

                state.loading.fetchChatMessages = false;
                state.error = undefined;
            })
            .addCase(fetchMoreMessages.rejected, (state, action) => {
                state.loading.fetchChatMessages = false;
                state.error = action.payload as string || "Failed to fetch more messages";
            });
    }
});

export const { setSelectedChat, clearChatError, updateChatMessages } = chatSlice.actions;
export default chatSlice.reducer;