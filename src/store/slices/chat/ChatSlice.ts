import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, ChatPreview } from "@/types/chat";
import { Message } from "@/types/message";
import {
    fetchChatPreviews,
    fetchChatMessages,
    createChat,
    sendMessage
} from "./ChatAsyncThunks";

interface ChatState {
    chats: Chat[];                 // All chat objects, each may contain messages
    chatPreviews: ChatPreview[];   // For user chats list
    selectedChatId?: string;       // Currently open chat, if any
    error?: string;                // To track chat-related errors
    loading: boolean;
}

const initialState: ChatState = {
    chats: [],
    chatPreviews: [],
    selectedChatId: undefined,
    error: undefined,
    loading: false,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChatId(state, action: PayloadAction<string | undefined>) {
            state.selectedChatId = action.payload;
        },
        clearChatError(state) {
            state.error = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchChatPreviews
            .addCase(fetchChatPreviews.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchChatPreviews.fulfilled, (state, action: PayloadAction<ChatPreview[]>) => {
                state.chatPreviews = action.payload;
                state.loading = false;
                state.error = undefined;
            })
            .addCase(fetchChatPreviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch chat previews";
            })

            // fetchChatMessages
            .addCase(fetchChatMessages.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchChatMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
                const chatId = state.selectedChatId;
                if (!chatId) {
                    state.loading = false;
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
                state.loading = false;
            })
            .addCase(fetchChatMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch chat messages";
            })

            // createChat
            .addCase(createChat.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(createChat.fulfilled, (state, action: PayloadAction<Chat>) => {
                const chat = action.payload;
                // Only add if not exist
                if (!state.chats.some((c) => c.id === chat.id)) {
                    state.chats.push(chat);
                }
                state.loading = false;
                state.error = undefined;
            })
            .addCase(createChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create chat";
            })

            // sendMessage
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const { chat, message } = action.payload;
                // Update chat or add if not exist
                const chatIdx = state.chats.findIndex((c) => c.id === chat.id);
                if (chatIdx > -1) {
                    // If 'messages' field exists, append; otherwise set as first message
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
                state.loading = false;
                state.error = undefined;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to send message";
            });
    }
});

export const { setSelectedChatId, clearChatError } = chatSlice.actions;
export default chatSlice.reducer;