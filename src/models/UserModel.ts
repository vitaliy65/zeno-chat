import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "@/types/user";

export class UserModel {
    static async updateCurrentUser(payload: Partial<User> & { id: string }): Promise<User> {
        const { id, ...updates } = payload;
        const userRef = doc(db, "users", id);
        await updateDoc(userRef, updates);

        const updatedDoc = await getDoc(userRef);
        if (!updatedDoc.exists()) throw new Error("User not found");
        const userData = updatedDoc.data()!;
        return {
            id,
            username: userData?.username || "",
            avatarUrl: userData?.avatarUrl,
            chats: userData.chats,
            groups: userData.groups,
            status: userData?.status ?? "offline",
            lastSeenAt: userData?.lastSeenAt ?? "",
            createdAt: userData?.createdAt ?? "",
        };
    }

    static async getUserById(id: string): Promise<User> {
        const userDoc = await getDoc(doc(db, "users", id));
        if (!userDoc.exists()) throw new Error("User data not found");
        const userData = userDoc.data()!;
        return {
            id,
            username: userData?.username || "",
            avatarUrl: userData?.avatarUrl,
            chats: userData.chats,
            groups: userData.groups,
            status: userData?.status ?? "offline",
            lastSeenAt: userData?.lastSeenAt ?? "",
            createdAt: userData?.createdAt ?? "",
        };
    }

    static async createUser(payload: { id: string, username: string, email: string }) {
        const createdAt = new Date().toISOString();
        await setDoc(doc(db, "users", payload.id), {
            username: payload.username,
            email: payload.email,
            createdAt,
            status: "online"
        });
    }

    static async findUsersByUsername(username: string): Promise<
        Omit<User, 'chats' | 'groups'>[]
    > {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const lowerUsername = username.toLowerCase();
        const results: Omit<User, 'chats' | 'groups'>[] = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const docUsername = (data.username || "").toLowerCase();
            if (docUsername.includes(lowerUsername) && lowerUsername.length > 0) {
                results.push({
                    id: docSnap.id,
                    username: data.username || "",
                    avatarUrl: data.avatarUrl,
                    status: data.status || "offline",
                    lastSeenAt: data.lastSeenAt || "",
                    createdAt: data.createdAt || "",
                });
            }
        });
        return results;
    }
}
