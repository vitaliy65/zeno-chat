import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user/UserSlice";
import chatReducer from "./slices/chat/ChatSlice";
import modalReducer from "./slices/profile/modalSlice";
import friendsReducer from "./slices/friends/FriendsSlice";
import MobileChatReducer from "./slices/MobileChat/MobileChatModalSlice";
import infoPanelReducer from "./slices/InfoPanel/InfoPanelSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
        modals: modalReducer,
        friends: friendsReducer,
        MobileChatNodal: MobileChatReducer,
        infoPanel: infoPanelReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;