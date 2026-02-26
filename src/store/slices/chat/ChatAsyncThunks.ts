import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Chat } from "@/types/chat";
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
    limit,
    startAfter,
    DocumentData,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export const fetchChats = createAsyncThunk<
    Chat[],
    { userId: string },
    { rejectValue: string }
>(
    "chat/fetchChats",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const chatsSnap = await getDocs(
                query(
                    collection(db, "chats"),
                    where("participantIds", "array-contains", userId)
                )
            );

            const chats: Chat[] = await Promise.all(
                chatsSnap.docs.map(async chatDoc => {
                    const data = chatDoc.data();

                    const chat: Chat = {
                        id: chatDoc.id,
                        participantIds: data.participantIds,
                        updatedAt: data.updatedAt,
                    };

                    const messagesSnap = await getDocs(
                        query(
                            collection(db, "chats", chatDoc.id, "messages"),
                            orderBy("createdAt", "desc"),
                            limit(50)
                        )
                    );

                    const messages: Message[] = messagesSnap.docs.map(msgDoc => ({
                        ...(msgDoc.data() as Omit<Message, "id">),
                        id: msgDoc.id
                    })).reverse();

                    return {
                        ...chat,
                        messages
                    };
                })
            );
            console.log(chats)
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
    { userId: string; otherUserId: string },
    { rejectValue: string }
>(
    "chat/createChat",
    async ({ userId, otherUserId }, { rejectWithValue }) => {
        try {
            if (userId === otherUserId) {
                return rejectWithValue("You cannot create a chat with yourself");
            }
            const participantIds = [userId, otherUserId].sort() as [string, string];
            const chatSnap = await getDocs(query(
                collection(db, "chats"),
                where("participantIds", "==", participantIds)
            ));

            if (!chatSnap.empty) {
                const chatId = chatSnap.docs[0].id;
                const chatData: Chat = { ...(chatSnap.docs[0].data() as Chat), id: chatId };
                return chatData;
            }

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
            const participantIds = [fromId, toId].sort() as [string, string];
            let chatId: string | undefined;
            let chatData: Chat | undefined;

            const chatSnap = await getDocs(query(
                collection(db, "chats"),
                where("participantIds", "==", participantIds)
            ));

            if (!chatSnap.empty) {
                chatId = chatSnap.docs[0].id;
                chatData = { ...(chatSnap.docs[0].data() as Chat), id: chatId };
            } else {
                const now = new Date().toISOString();
                const newChat: Omit<Chat, "id"> = {
                    participantIds,
                    updatedAt: now,
                };
                const chatRef = await addDoc(collection(db, "chats"), newChat);
                chatId = chatRef.id;
                chatData = { ...newChat, id: chatId };
            }

            const nowStr = new Date().toISOString();
            const msgPayload = {
                chatId,
                senderId: fromId,
                text,
                createdAt: nowStr,
                isRead: false,
            };
            const msgRef = await addDoc(collection(db, "chats", chatId!, "messages"), msgPayload);

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
                    where("isRead", "==", false)
                )
            );

            const batch = writeBatch(db);
            messagesSnap.forEach(msgDoc => {
                const data = msgDoc.data();
                if (data.senderId !== userId) {
                    batch.update(msgDoc.ref, { isRead: true });
                }
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

            // Подгружаем только последние 50 сообщений (для начальной загрузки)
            const messagesSnap = await getDocs(
                query(
                    collection(db, "chats", chatId, "messages"),
                    orderBy("createdAt", "desc"),
                    limit(50)
                )
            );
            const messages: Message[] = messagesSnap.docs.map(doc => ({
                ...(doc.data() as Message),
                id: doc.id,
            })).reverse();

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

export const fetchMoreMessages = createAsyncThunk<
    { chatId: string, messages: Message[] },
    { chatId: string, firstMessageId: string, pageSize?: number },
    { rejectValue: string }
>(
    "chat/fetchMoreMessages",
    async ({ chatId, firstMessageId, pageSize = 50 }, { rejectWithValue }) => {
        try {
            // Get the document to use as a startAfter cursor
            const firstMsgRef = doc(db, "chats", chatId, "messages", firstMessageId);
            const firstMsgSnap = await getDoc(firstMsgRef);

            if (!firstMsgSnap.exists()) {
                return rejectWithValue("First message not found");
            }

            const messagesQuery = query(
                collection(db, "chats", chatId, "messages"),
                orderBy("createdAt", "desc"),
                startAfter(firstMsgSnap),
                limit(pageSize)
            );
            const messagesSnap = await getDocs(messagesQuery);

            const messages: Message[] = messagesSnap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                ...(doc.data() as Omit<Message, "id">),
                id: doc.id,
            })).reverse();

            return { chatId, messages };
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message || "Failed to fetch more messages");
            }
            return rejectWithValue("Failed to fetch more messages");
        }
    }
);