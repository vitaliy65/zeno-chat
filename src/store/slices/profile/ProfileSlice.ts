
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ProfileState {
    modalOpen: boolean
}

const initialState: ProfileState = {
    modalOpen: false
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        openModal(state) {
            state.modalOpen = true;
        },
        closeModal(state) {
            state.modalOpen = false;
        },
        setModalOpen(state, action: PayloadAction<boolean>) {
            state.modalOpen = action.payload
        },
        toggleModal(state) {
            state.modalOpen = !state.modalOpen;
        }
    }
})

export const { openModal, closeModal, setModalOpen, toggleModal } = profileSlice.actions;
export default profileSlice.reducer;
