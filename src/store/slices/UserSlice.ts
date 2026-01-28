
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, LoginPayload, RegisterPayload, UserStatus } from "../../types/user";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { AppDispatch } from "../store";

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
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        logoutUser(state) {
            state.user = null;
        },
        updateStatus(state, action: PayloadAction<UserStatus>) {
            if (state.user) {
                state.user.status = action.payload;
            }
        }
    }
});

// Thunks

export const loginUser =
    (payload: LoginPayload) =>
        async (dispatch: AppDispatch): Promise<void> => {
            dispatch(setLoading(true));
            dispatch(setError(null));
            try {
                const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
                const user = userCredential.user;
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists()) throw new Error("User data not found");
                const userData = userDoc.data();
                dispatch(
                    setUser({
                        id: user.uid,
                        username: userData?.username || "",
                        email: user.email ?? "",
                        avatarUrl: userData?.avatarUrl,
                        status: userData?.status ?? "offline",
                        lastSeenAt: userData?.lastSeenAt ?? "",
                        createdAt: userData?.createdAt ?? "",
                    })
                );
            } catch (error) {
                if (error instanceof Error) {
                    dispatch(setError(error.message || "Login failed"));
                } else {
                    dispatch(setError("Login failed"));
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

export const registerUser =
    (payload: RegisterPayload) =>
        async (dispatch: AppDispatch): Promise<void> => {
            dispatch(setLoading(true));
            dispatch(setError(null));
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
                const user = userCredential.user;
                const createdAt = new Date().toISOString();
                const authUser: AuthUser = {
                    id: user.uid,
                    username: payload.username,
                    email: payload.email,
                    createdAt,
                };
                await setDoc(doc(db, "users", user.uid), {
                    username: payload.username,
                    createdAt,
                    email: payload.email,
                    status: "online"
                });
                dispatch(setUser(authUser));
            } catch (error) {
                if (error instanceof Error) {
                    dispatch(setError(error.message || "Registration failed"));
                } else {
                    dispatch(setError("Registration failed"));
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

export const logout = () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
        await signOut(auth);
        dispatch(logoutUser());
    } catch (error) {
        if (error instanceof Error) {
            dispatch(setError(error.message || "Logout failed"));
        } else {
            dispatch(setError("Logout failed"));
        }
    } finally {
        dispatch(setLoading(false));
    }
};

export const { setUser, setLoading, setError, logoutUser } = userSlice.actions;
export default userSlice.reducer;