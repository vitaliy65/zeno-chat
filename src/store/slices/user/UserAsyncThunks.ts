
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthUser, LoginPayload, RegisterPayload, User } from "../../../types/user";
import { auth, db } from "../../../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export const updateCurrentUser = createAsyncThunk<
    AuthUser,
    Partial<AuthUser> & { id: string },
    { rejectValue: string }
>(
    "user/updateCurrentUser",
    async (payload, { rejectWithValue }) => {
        try {
            const { id, ...updates } = payload;
            const userRef = doc(db, "users", id);
            await updateDoc(userRef, updates);

            const updatedDoc = await getDoc(userRef);
            if (!updatedDoc.exists()) {
                throw new Error("User not found");
            }
            const userData = updatedDoc.data();

            return {
                id,
                username: userData?.username || "",
                email: userData?.email || "",
                avatarUrl: userData?.avatarUrl,
                status: userData?.status ?? "offline",
                lastSeenAt: userData?.lastSeenAt ?? "",
                createdAt: userData?.createdAt ?? "",
            } as AuthUser;
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.code || "User update failed");
            }
            return rejectWithValue("User update failed");
        }
    }
);


export const loginUser = createAsyncThunk<
    AuthUser, // return type on fulfilled
    LoginPayload, // payload
    { rejectValue: string }
>(
    "user/loginUser",
    async (payload, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
            const user = userCredential.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) throw new Error("User data not found");
            const userData = userDoc.data();
            return {
                id: user.uid,
                username: userData?.username || "",
                email: user.email ?? "",
                avatarUrl: userData?.avatarUrl,
                status: userData?.status ?? "offline",
                lastSeenAt: userData?.lastSeenAt ?? "",
                createdAt: userData?.createdAt ?? "",
            } as AuthUser;
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.code || "Login failed");
            }
            return rejectWithValue("Login failed");
        }
    }
);

export const registerUser = createAsyncThunk<
    AuthUser, // return type
    RegisterPayload, // payload
    { rejectValue: string }
>(
    "user/registerUser",
    async (payload, { rejectWithValue }) => {
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
            return authUser;
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.code || "Registration failed");
            }
            return rejectWithValue("Registration failed");
        }
    }
);

export const tryAutoLogin = createAsyncThunk<
    AuthUser | null,
    void,
    { rejectValue: string }
>("user/tryAutoLogin", async (_, { rejectWithValue }) => {
    return new Promise<AuthUser | null>((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (!user) return resolve(null);

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists()) throw new Error("User data not found");

                const userData = userDoc.data();
                resolve({
                    id: user.uid,
                    username: userData?.username || "",
                    email: user.email ?? "",
                    avatarUrl: userData?.avatarUrl,
                    status: userData?.status ?? "offline",
                    lastSeenAt: userData?.lastSeenAt ?? "",
                    createdAt: userData?.createdAt ?? "",
                } as AuthUser);
            } catch (error) {
                reject(rejectWithValue((error as Error).message || "Auto login failed"));
            }
        });
    });
});

export const logout = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
            // nothing to return
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message || "Logout failed");
            }
            return rejectWithValue("Logout failed");
        }
    }
);

export const findUsersByUsername = createAsyncThunk<
    User[],
    string,
    { rejectValue: string }
>(
    "user/findUsersByUsername",
    async (username, { rejectWithValue }) => {
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);
            const results: User[] = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                results.push({
                    id: docSnap.id,
                    username: data.username || "",
                    avatarUrl: data.avatarUrl,
                    status: data.status || "offline",
                    lastSeenAt: data.lastSeenAt || "",
                    createdAt: data.createdAt || "",
                });
            });
            return results;
        } catch (error) {
            return rejectWithValue("Search failed");
        }
    }
);

// Replace: findUsersById thunk with findUserById thunk - finds a single user by ID
export const findUserById = createAsyncThunk<
    User | null,
    string,
    { rejectValue: string }
>(
    "user/findUserById",
    async (userId, { rejectWithValue }) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (!userDoc.exists()) {
                return null;
            }
            const data = userDoc.data();
            return {
                id: userDoc.id,
                username: data.username || "",
                avatarUrl: data.avatarUrl,
                status: data.status || "offline",
                lastSeenAt: data.lastSeenAt || "",
                createdAt: data.createdAt || "",
            };
        } catch (error) {
            return rejectWithValue("Search failed");
        }
    }
);
