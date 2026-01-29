import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user/UserSlice";
import chatReducer from "./slices/chat/ChatSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
