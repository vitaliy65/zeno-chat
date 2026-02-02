
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import type { Friend } from "./FriendsSlice";
import type { User } from "@/types/user";

// Получить всех друзей, где currentUser является участником чата (participant)
export const fetchFriends = createAsyncThunk<
    Friend[],
    { currentUserId: string },
    { rejectValue: string }
>(
    "friends/fetchFriends",
    async ({ currentUserId }, { rejectWithValue }) => {
        try {
            // Найти все чаты, где currentUser участвует
            const chatsSnap = await getDocs(
                query(
                    collection(db, "chats"),
                    where("participantIds", "array-contains", currentUserId)
                )
            );

            const friends: Friend[] = [];

            for (const chatDoc of chatsSnap.docs) {
                const chatData = chatDoc.data();
                const chatId = chatDoc.id;
                const participantIds: string[] = chatData.participantIds || [];
                // Найти id собеседника, не равного currentUserId
                const friendId = participantIds.find(id => id !== currentUserId);
                if (!friendId) continue;

                // Получить данные пользователя
                const friendUserSnap = await getDoc(doc(db, "users", friendId));
                if (!friendUserSnap.exists()) continue;

                const friendUserData = friendUserSnap.data() as User;
                friends.push({
                    ...friendUserData,
                    id: friendId,
                    chatId,
                });
            }

            return friends;
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message || "Не удалось получить список друзей");
            }
            return rejectWithValue("Не удалось получить список друзей");
        }
    }
);

