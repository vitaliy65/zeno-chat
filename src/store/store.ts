import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user/UserSlice";
import chatReducer from "./slices/chat/ChatSlice";
import profileReducer from "./slices/profile/ProfileSlice";
import friendsReducer from "./slices/friends/FriendsSlice";
import MobileChatReducer from "./slices/MobileChat/MobileChatModalSlice";
import infoPanelReducer from "./slices/InfoPanel/InfoPanelSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
        profile: profileReducer,
        friends: friendsReducer,
        MobileChatNodal: MobileChatReducer,
        infoPanel: infoPanelReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
