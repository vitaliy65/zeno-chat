import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    query,
    orderBy,
    where,
    writeBatch,
    limit,
    startAfter,
    DocumentData,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import type { Message } from "@/types/message";
import { db } from "@/lib/firebase";

export class MessageModel {
    static async fetchMessages(chatId: string, options?: { limit?: number; orderDesc?: boolean }) {
        const msgsQuery = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", options?.orderDesc === false ? "asc" : "desc"),
            ...(options?.limit ? [limit(options.limit)] : [])
        );
        const snap = await getDocs(msgsQuery);
        const data = snap.docs.map(doc => ({
            ...(doc.data() as Omit<Message, "id">),
            id: doc.id
        }));
        if (options?.orderDesc === false) return data;
        // По умолчанию orderDesc=true (сначала новые), reverse для хронологичности
        return data.reverse();
    }

    static async fetchMoreMessages(chatId: string, firstMessageId: string, pageSize: number = 50) {
        const firstMsgRef = doc(db, "chats", chatId, "messages", firstMessageId);
        const firstMsgSnap = await getDoc(firstMsgRef);

        if (!firstMsgSnap.exists()) throw new Error("First message not found");

        const msgsQuery = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "desc"),
            startAfter(firstMsgSnap),
            limit(pageSize)
        );
        const snap = await getDocs(msgsQuery);
        return snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
            ...(doc.data() as Omit<Message, "id">),
            id: doc.id,
        })).reverse();
    }

    static async addMessage(chatId: string, msgPayload: Omit<Message, "id">) {
        try {
            const msgRef = await addDoc(collection(db, "chats", chatId, "messages"), msgPayload);
            return { ...msgPayload, id: msgRef.id };
        } catch (error) {
            console.error("Failed to add message:", error);
            throw new Error("Failed to add message");
        }
    }

    static async markAllUnreadAsRead(chatId: string, userId: string) {
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
    }
}