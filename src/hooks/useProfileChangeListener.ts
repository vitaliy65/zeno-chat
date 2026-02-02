
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFriends } from "@/store/slices/friends/FriendsAsyncThunks";


export function useProfileChangeListener() {
    const dispatch = useAppDispatch();
    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const friends = useAppSelector((state) => state.friends.friends);

    useEffect(() => {
        if (!currentUserId || friends.length === 0) return;

        const unsubscribes = friends.map(friend => {
            const userDocRef = doc(db, "users", friend.id);
            return onSnapshot(userDocRef, (snapshot) => {
                if (snapshot.exists()) {
                    dispatch(fetchFriends({ currentUserId }));
                }
            });
        });

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [currentUserId, JSON.stringify(friends.map(f => f.id)), dispatch]);
}


