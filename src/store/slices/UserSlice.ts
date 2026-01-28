import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, UserStatus } from "../../types/user";
import { loginUser, logout, registerUser, tryAutoLogin } from "./UserAsyncThunks";

interface UserState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUser | null>) {
            state.user = action.payload;
        },
        updateStatus(state, action: PayloadAction<UserStatus>) {
            if (state.user) {
                state.user.status = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // --------------- loginUser ---------------
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Login failed";
            })

            // --------------- registerUser ---------------
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Registration failed";
            })

            // --------------- logout ---------------
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Logout failed";
            })

            // --------------- tryAutoLogin ---------------
            .addCase(tryAutoLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tryAutoLogin.fulfilled, (state, action: PayloadAction<AuthUser | null>) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(tryAutoLogin.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.payload ?? "Auto login failed";
            });
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
