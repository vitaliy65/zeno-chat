import type { LoginPayload, RegisterPayload, User } from "@/types/user";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { UserModel } from "@/models/UserModel";

type ResultUser = Omit<User, 'chats' | 'groups'>;

export const userService = {
    async updateCurrentUser(payload: Partial<User> & { id: string }): Promise<User> {
        return UserModel.updateCurrentUser(payload);
    },
    async loginUser(payload: LoginPayload): Promise<User> {
        // Handle authentication, then get user data.
        const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
        return UserModel.getUserById(userCredential.user.uid);
    },
    async registerUser(payload: RegisterPayload): Promise<ResultUser> {
        const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
        const user = userCredential.user;
        // Registration in Firestore
        await UserModel.createUser({
            id: user.uid,
            username: payload.username,
            email: payload.email,
        });
        return {
            id: user.uid,
            username: payload.username,
            createdAt: new Date().toISOString(),
        };
    },
    async tryAutoLogin(): Promise<User | null> {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe();
                if (!user) return resolve(null);
                try {
                    const result = await UserModel.getUserById(user.uid);
                    resolve(result);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (e: any) {
                    reject(e);
                }
            });
        });
    },
    async logout(): Promise<void> {
        await signOut(auth);
    },
    async findUsersByUsername(username: string): Promise<ResultUser[]> {
        return UserModel.findUsersByUsername(username);
    }
};