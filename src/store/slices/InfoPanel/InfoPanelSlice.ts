import { createSlice } from '@reduxjs/toolkit';

interface InfoPanelState {
    open: boolean;
}

const initialState: InfoPanelState = {
    open: false,
};

const infoPanelSlice = createSlice({
    name: 'infoPanel',
    initialState,
    reducers: {
        toggleInfoPanel(state) {
            state.open = !state.open;
        },
        openInfoPanel(state) {
            state.open = true;
        },
        closeInfoPanel(state) {
            state.open = false;
        },
    },
});

export const { toggleInfoPanel, openInfoPanel, closeInfoPanel } = infoPanelSlice.actions;
export default infoPanelSlice.reducer;