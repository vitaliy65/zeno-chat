
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
import { UserChat } from "@/types/user";
import { UserModel } from "./UserModel";


export class ChatModel {
    static async fetchChatsForUser(userChatIds: UserChat[], options?: { messagesLimit?: number }) {
        if (!userChatIds?.length) return [];
        const chatIds = userChatIds.map(uc => uc.chatId);

        // Fetch each chat document directly by id
        const chats: Chat[] = [];
        for (const chatId of chatIds) {
            const chatDoc = await getDoc(doc(db, "chats", chatId));
            if (!chatDoc.exists()) continue;
            const data = chatDoc.data();
            const chat: Chat = {
                id: chatDoc.id,
                participantIds: data.participantIds,
                updatedAt: data.updatedAt,
            };
            const messages: Message[] = await MessageModel.fetchMessages(chatDoc.id, { limit: options?.messagesLimit ?? 50 });
            chats.push({
                ...chat,
                messages,
            });
        }
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

        const userChat: UserChat = { chatId: chatData.id, isPined: false, pinOrder: 0 };

        async function addChatToUser(userId: string, chat: UserChat) {
            const user = await UserModel.getUserById(userId);
            const chats = user.chats ?? [];
            if (!chats.some((c: UserChat) => c.chatId === chat.chatId)) {
                await UserModel.updateCurrentUser({
                    id: userId,
                    chats: [...chats, chat],
                });
            }
        }

        await Promise.all([
            addChatToUser(userId, userChat),
            addChatToUser(otherUserId, userChat),
        ]);

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
            senderAvatar: messageFields.senderAvatar || "",
            fileName: messageFields.fileName || "",
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