
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import { fetchFriends } from "./FriendsAsyncThunks";


export interface Friend extends User {
    chatId: string;
}

interface FriendsState {
    friends: Friend[];
    selectedFriend?: Friend;
    error?: string;
    loading: {
        fetchFriends: boolean;
    };
}

const initialState: FriendsState = {
    friends: [],
    selectedFriend: undefined,
    error: undefined,
    loading: {
        fetchFriends: false,
    },
};

const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        clearFriendsError(state) {
            state.error = undefined;
        },
        updateFriend(state, action: PayloadAction<Friend>) {
            const updated = action.payload;
            const index = state.friends.findIndex(f => f.id === updated.id);
            if (index !== -1) {
                state.friends[index] = {
                    ...state.friends[index],
                    ...updated,
                };
            }
        },
        setSelectedFriend(state, action: PayloadAction<string | undefined>) {
            if (action.payload === undefined) {
                state.selectedFriend = undefined;
            } else {
                const found = state.friends.find((f) => f.id === action.payload);
                state.selectedFriend = found ? found : undefined;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFriends.pending, (state) => {
                state.loading.fetchFriends = true;
                state.error = undefined;
            })
            .addCase(fetchFriends.fulfilled, (state, action: PayloadAction<Friend[]>) => {
                state.loading.fetchFriends = false;
                state.friends = action.payload;
            })
            .addCase(fetchFriends.rejected, (state, action) => {
                state.loading.fetchFriends = false;
                state.error = action.payload || "Не удалось получить список друзей";
            });
    }
});


export const {
    updateFriend,
    setSelectedFriend,
} = friendsSlice.actions;

export default friendsSlice.reducer;

