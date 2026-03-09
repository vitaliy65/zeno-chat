
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginPayload, RegisterPayload, User } from "../../../types/user";
import { FirebaseError } from "firebase/app";
import { userService } from "@/services/userService";

type ResultUser = Omit<User, 'chats' | 'groups'>;

// Update current user
export const updateCurrentUser = createAsyncThunk<
    User,
    Partial<User> & { id: string },
    { rejectValue: string }
>(
    "user/updateCurrentUser",
    async (payload, { rejectWithValue }) => {
        try {
            return await userService.updateCurrentUser(payload);
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.code || "User update failed");
            }
            return rejectWithValue("User update failed");
        }
    }
);

// Login user
export const loginUser = createAsyncThunk<
    User,
    LoginPayload,
    { rejectValue: string }
>(
    "user/loginUser",
    async (payload, { rejectWithValue }) => {
        try {
            return await userService.loginUser(payload);
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.code || "Login failed");
            }
            return rejectWithValue("Login failed");
        }
    }
);

// Register user
export const registerUser = createAsyncThunk<
    ResultUser,
    RegisterPayload,
    { rejectValue: string }
>(
    "user/registerUser",
    async (payload, { rejectWithValue }) => {
        try {
            return await userService.registerUser(payload);
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.code || "Registration failed");
            }
            return rejectWithValue("Registration failed");
        }
    }
);

// Try auto login
export const tryAutoLogin = createAsyncThunk<
    User | null,
    void,
    { rejectValue: string }
>(
    "user/tryAutoLogin",
    async (_, { rejectWithValue }) => {
        try {
            return await userService.tryAutoLogin();
        } catch (error) {
            return rejectWithValue(
                (error instanceof Error ? error.message : "Auto login failed") || "Auto login failed"
            );
        }
    }
);

// Logout
export const logout = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            await userService.logout();
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message || "Logout failed");
            }
            return rejectWithValue("Logout failed");
        }
    }
);

// Find users by username
export const findUsersByUsername = createAsyncThunk<
    ResultUser[],
    string,
    { rejectValue: string }
>(
    "user/findUsersByUsername",
    async (username, { rejectWithValue }) => {
        try {
            return await userService.findUsersByUsername(username);
        } catch (error) {
            return rejectWithValue("Search failed");
        }
    }
);
