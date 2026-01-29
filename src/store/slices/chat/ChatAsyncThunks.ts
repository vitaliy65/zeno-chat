import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Chat, ChatPreview } from "@/types/chat";
import type { Message } from "@/types/message";
import type { User } from "@/types/user";
import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    orderBy,
    where,
    writeBatch,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";

// Получить список чатов текущего пользователя (превью для списка)
export const fetchChatPreviews = createAsyncThunk<
    ChatPreview[],
    { userId: string },
    { rejectValue: string }
>(
    "chat/fetchChatPreviews",
    async ({ userId }, { rejectWithValue }) => {
        try {
            // Находим все личные чаты, где участвует пользователь
            const chatsSnap = await getDocs(
                query(
                    collection(db, "chats"),
                    where("participantIds", "array-contains", userId)
                )
            );

            const chats: Chat[] = [];
            for (const chatDoc of chatsSnap.docs) {
                const chat = chatDoc.data() as Chat;
                chat.id = chatDoc.id;
                chats.push(chat);
            }

            // Получить превью для каждого чата
            const chatPreviews: ChatPreview[] = [];
            for (const chat of chats) {
                // найди id собеседника
                const anotherId = chat.participantIds.find(id => id !== userId)!;
                const userSnap = await getDoc(doc(db, "users", anotherId));
                const user = { ...(userSnap.data() || {}), id: anotherId } as User;

                // найти последнее сообщение
                let lastMsg: Message | undefined;
                let unreadCount = 0;
                const messagesSnap = await getDocs(
                    query(
                        collection(db, "chats", chat.id, "messages"),
                        orderBy("createdAt", "desc"),
                    )
                );
                if (!messagesSnap.empty) {
                    lastMsg = messagesSnap.docs[0].data() as Message;
                    // все непрочитанные сообщения, где sender не ты
                    unreadCount = messagesSnap.docs.filter(m => {
                        const mData = m.data() as Message;
                        return mData.senderId !== userId && !mData.isRead;
                    }).length;
                }

                chatPreviews.push({
                    chatId: chat.id,
                    user,
                    lastMessage: lastMsg,
                    unreadCount,
                });
            }

            return chatPreviews;
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message || "Failed to fetch chat previews");
            }
            return rejectWithValue("Failed to fetch chat previews");
        }
    }
);

// Получить все сообщения чата
export const fetchChatMessages = createAsyncThunk<
    Message[],
    { chatId: string },
    { rejectValue: string }
>(
    "chat/fetchChatMessages",
    async ({ chatId }, { rejectWithValue }) => {
        try {
            const messagesSnap = await getDocs(
                query(
                    collection(db, "chats", chatId, "messages"),
                    orderBy("createdAt", "asc")
                )
            );
            const messages = messagesSnap.docs.map(doc => ({
                ...(doc.data() as Message),
                id: doc.id,
            }));
            return messages;
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message || "Failed to fetch messages");
            }
            return rejectWithValue("Failed to fetch messages");
        }
    }
);


export const createChat = createAsyncThunk<
    Chat,
    { userId: string; otherUserId: string },
    { rejectValue: string }
>(
    "chat/createChat",
    async ({ userId, otherUserId }, { rejectWithValue }) => {
        try {
            // Проверка что нельзя создать чат с самим собой
            if (userId === otherUserId) {
                return rejectWithValue("You cannot create a chat with yourself");
            }

            // Для избежания дублей сортируем participantIds
            const participantIds = [userId, otherUserId].sort() as [string, string];

            // Проверка существования чата с такими участниками
            const chatSnap = await getDocs(query(
                collection(db, "chats"),
                where("participantIds", "==", participantIds)
            ));

            if (!chatSnap.empty) {
                // Уже есть чат с такими participantIds, возвращаем первый попавшийся
                const chatId = chatSnap.docs[0].id;
                const chatData: Chat = { ...(chatSnap.docs[0].data() as Chat), id: chatId };
                return chatData;
            }

            // Если не найден — создаём новый чат
            const now = new Date().toISOString();
            const newChat: Omit<Chat, "id"> = {
                participantIds,
                updatedAt: now,
            };
            const chatRef = await addDoc(collection(db, "chats"), newChat);
            const chatData: Chat = { ...newChat, id: chatRef.id };
            return chatData;
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message || "Failed to create chat");
            }
            return rejectWithValue("Failed to create chat");
        }
    }
);

export const sendMessage = createAsyncThunk<
    { chat: Chat; message: Message },
    { fromId: string, toId: string, text: string },
    { rejectValue: string }
>(
    "chat/sendMessage",
    async ({ fromId, toId, text }, { rejectWithValue }) => {
        try {
            // Сортируем IDs участников чтобы найти или создать уникальный чат
            const participantIds = [fromId, toId].sort() as [string, string];
            let chatId: string | undefined;
            let chatData: Chat | undefined;

            // Проверяем существование чата по отсортированному массиву participantIds
            const chatSnap = await getDocs(query(
                collection(db, "chats"),
                where("participantIds", "==", participantIds)
            ));

            if (!chatSnap.empty) {
                chatId = chatSnap.docs[0].id;
                chatData = { ...(chatSnap.docs[0].data() as Chat), id: chatId };
            } else {
                // Нет чата — создаём новый 
                const now = new Date().toISOString();
                const newChat: Omit<Chat, "id"> = {
                    participantIds,
                    updatedAt: now,
                };
                const chatRef = await addDoc(collection(db, "chats"), newChat);
                chatId = chatRef.id;
                chatData = { ...newChat, id: chatId };
            }

            // Добавляем сообщение в чат
            const nowStr = new Date().toISOString();
            const msgPayload = {
                chatId,
                senderId: fromId,
                text,
                createdAt: nowStr,
                isRead: false,
            };
            const msgRef = await addDoc(collection(db, "chats", chatId!, "messages"), msgPayload);

            // Обновляем updatedAt у чата
            await updateDoc(doc(db, "chats", chatId!), {
                updatedAt: nowStr,
            });

            return {
                chat: { ...chatData!, updatedAt: nowStr },
                message: { ...msgPayload, id: msgRef.id },
            };
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message || "Failed to send message");
            }
            return rejectWithValue("Failed to send message");
        }
    }
);

// Пометить все сообщения чата как прочитанные текущим пользователем
export const markChatAsRead = createAsyncThunk<
    void,
    { chatId: string, userId: string },
    { rejectValue: string }
>(
    "chat/markChatAsRead",
    async ({ chatId, userId }, { rejectWithValue }) => {
        try {
            const messagesSnap = await getDocs(
                query(
                    collection(db, "chats", chatId, "messages"),
                    where("isRead", "==", false),
                    where("senderId", "!=", userId)
                )
            );
            const batch = writeBatch(db);
            messagesSnap.forEach(msgDoc => {
                batch.update(msgDoc.ref, { isRead: true });
            });
            await batch.commit();
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message || "Failed to mark messages as read");
            }
        }
    }
);

export const fetchChatById = createAsyncThunk<
    Chat & { messages: Message[]; participants: User[] },
    { chatId: string },
    { rejectValue: string }
>(
    "chat/fetchChatById",
    async ({ chatId }, { rejectWithValue }) => {
        try {
            const chatDoc = await getDoc(doc(db, "chats", chatId));
            if (!chatDoc.exists()) throw new Error("Чат не найден");
            const chat = { ...(chatDoc.data() as Chat), id: chatDoc.id };

            // сообщения
            const messagesSnap = await getDocs(
                query(
                    collection(db, "chats", chatId, "messages"),
                    orderBy("createdAt", "asc")
                )
            );
            const messages: Message[] = messagesSnap.docs.map(doc => ({
                ...(doc.data() as Message),
                id: doc.id,
            }));

            // участники
            const users: User[] = [];
            for (const uid of chat.participantIds) {
                const userSnap = await getDoc(doc(db, "users", uid));
                if (userSnap.exists()) {
                    users.push({ ...(userSnap.data() as User), id: uid });
                }
            }

            return { ...chat, messages, participants: users };
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message || "Failed to fetch chat");
            }
            return rejectWithValue("Failed to fetch chat");
        }
    }
);

