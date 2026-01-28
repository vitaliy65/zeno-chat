export interface User {
    id: string;
    username: string;
    avatarUrl?: string;
    status?: UserStatus;
    lastSeenAt?: string; // ISO
    createdAt: string;   // ISO
}

export type UserStatus = "online" | "offline" | "away";

export interface AuthUser extends User {
    email: string;
}


// payloads for login and register
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}