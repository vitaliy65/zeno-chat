import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, ChatPreview } from "@/types/chat";
import { Message } from "@/types/message";
import {
    fetchChats,
    fetchChatMessages,
    createChat,
    sendMessage,
    fetchChatPreviews,
    markChatAsRead
} from "./ChatAsyncThunks";

// Индивидуальные флаги загрузки для каждого async thunk
interface ChatLoadingState {
    fetchChats: boolean;
    fetchChatPreviews: boolean;
    fetchChatMessages: boolean;
    createChat: boolean;
    sendMessage: boolean;
}

interface ChatState {
    chats: Chat[];
    chatPreviews: ChatPreview[];
    selectedChat?: Chat;
    error?: string;
    loading: ChatLoadingState;
}

const initialState: ChatState = {
    chats: [],
    chatPreviews: [],
    selectedChat: undefined,
    error: undefined,
    loading: {
        fetchChats: false,
        fetchChatPreviews: false,
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
        updateChatMessages(state, action: PayloadAction<{ chatId: string; messages: Message[] }>) {
            const { chatId, messages } = action.payload;
            const chatIdx = state.chats.findIndex((c) => c.id === chatId);
            if (chatIdx > -1) {
                state.chats[chatIdx] = { ...state.chats[chatIdx], messages };
            }
            if (state.selectedChat?.id === chatId) {
                state.selectedChat = { ...state.selectedChat, messages };
            }

            // Update chatPreviews (lastMessage & unreadCount)
            const previewIdx = state.chatPreviews.findIndex(
                (preview) => preview.chatId === chatId
            );

            if (previewIdx > -1) {
                const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;

                const prevPreview = state.chatPreviews[previewIdx];
                let unreadCount = prevPreview.unreadCount;

                if (state.selectedChat?.id === chatId) {
                    unreadCount = 0;
                } else {
                    unreadCount = messages.filter((m: Message) => m && m.isRead === false).length;
                }

                state.chatPreviews[previewIdx] = {
                    ...prevPreview,
                    lastMessage: lastMessage
                        ? {
                            id: lastMessage.id,
                            text: lastMessage.text,
                            createdAt: lastMessage.createdAt,
                            senderId: lastMessage.senderId,
                            chatId: chatId,
                            isRead: true,
                        }
                        : prevPreview.lastMessage,
                    unreadCount,
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchChatPreviews
            .addCase(fetchChatPreviews.pending, (state) => {
                state.loading.fetchChatPreviews = true;
                state.error = undefined;
            })
            .addCase(fetchChatPreviews.fulfilled, (state, action: PayloadAction<ChatPreview[]>) => {
                state.chatPreviews = action.payload;
                state.loading.fetchChatPreviews = false;
                state.error = undefined;
            })
            .addCase(fetchChatPreviews.rejected, (state, action) => {
                state.loading.fetchChatPreviews = false;
                state.error = action.payload as string || "Failed to fetch chat previews";
            })

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

            // fetchChatMessages
            .addCase(fetchChatMessages.pending, (state) => {
                state.loading.fetchChatMessages = true;
                state.error = undefined;
            })
            .addCase(fetchChatMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
                const chatId = state.selectedChat?.id;
                if (!chatId) {
                    state.loading.fetchChatMessages = false;
                    return;
                }
                // Place the messages in the corresponding chat in 'chats' array
                const chatIdx = state.chats.findIndex((c) => c.id === chatId);
                if (chatIdx > -1) {
                    // Updating existing chat's messages
                    state.chats[chatIdx] = {
                        ...state.chats[chatIdx],
                        messages: action.payload
                    };
                }
                state.loading.fetchChatMessages = false;
            })
            .addCase(fetchChatMessages.rejected, (state, action) => {
                state.loading.fetchChatMessages = false;
                state.error = action.payload as string || "Failed to fetch chat messages";
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
            });
    }
});

export const { setSelectedChat, clearChatError, updateChatMessages } = chatSlice.actions;
export default chatSlice.reducer;