
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ModalType = 'profile' | 'newGroup' | null;

export interface ProfileState {
    openModal: ModalType;
}

const initialState: ProfileState = {
    openModal: null,
};

const modalSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<ModalType>) => {
            state.openModal = action.payload;
        },
        closeModal: (state) => {
            state.openModal = null;
        },
        setModal: (state, action: PayloadAction<ModalType>) => {
            state.openModal = action.payload;
        },
        toggleModal: (state, action: PayloadAction<ModalType>) => {
            state.openModal = state.openModal === action.payload ? null : action.payload;
        },
    },
});

export const { openModal, closeModal, setModal, toggleModal } = modalSlice.actions;
export default modalSlice.reducer;

