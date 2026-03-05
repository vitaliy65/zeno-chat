
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Chat } from "@/types/chat";
import { Message } from "@/types/message";
import { MessageModel } from "./MessageModel";
import { MessageFieldsToSend } from "@/store/slices/chat/ChatAsyncThunks";


export class ChatModel {
    static async fetchChatsForUser(userId: string, options?: { messagesLimit?: number }) {
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

                const messages: Message[] = await MessageModel.fetchMessages(chatDoc.id, { limit: options?.messagesLimit ?? 50 });

                return {
                    ...chat,
                    messages
                };
            })
        );
        return chats;
    }

    static async createChatBetweenUsers(userId: string, otherUserId: string) {
        if (userId === otherUserId) {
            throw "You cannot create a chat with yourself";
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
    }

    static async sendMessage(messageFields: MessageFieldsToSend): Promise<{ chat: Chat; message: Message }> {
        const participantIds = [messageFields.senderId, messageFields.toId].sort() as [string, string];
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
        const msgPayload: Omit<Message, "id"> = {
            ...messageFields,
            createdAt: nowStr,
            isRead: false,
        };
        const message = await MessageModel.addMessage(chatId!, msgPayload);

        await updateDoc(doc(db, "chats", chatId!), {
            updatedAt: nowStr,
        });

        return {
            chat: { ...chatData!, updatedAt: nowStr },
            message,
        };
    }

    static async markChatAsRead(chatId: string, userId: string) {
        await MessageModel.markAllUnreadAsRead(chatId, userId);
    }
}