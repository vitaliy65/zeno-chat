import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MobileChatModalState {
    isOpen: boolean;
}

const initialState: MobileChatModalState = {
    isOpen: false,
};

const mobileChatModalSlice = createSlice({
    name: "mobileChatModal",
    initialState,
    reducers: {
        openMobileChatModal(state) {
            state.isOpen = true;
        },
        closeMobileChatModal(state) {
            state.isOpen = false;
        },
        setMobileChatModalOpen(state, action: PayloadAction<boolean>) {
            state.isOpen = action.payload;
        },
        toggleMobileChatModal(state) {
            state.isOpen = !state.isOpen;
        },
    },
});

export const { openMobileChatModal, closeMobileChatModal, setMobileChatModalOpen, toggleMobileChatModal } = mobileChatModalSlice.actions;
export default mobileChatModalSlice.reducer;