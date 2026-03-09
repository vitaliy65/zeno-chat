export interface User {
    id: string;
    username: string;
    avatarUrl?: string;
    status?: UserStatus;
    chats: UserChat[];
    groups: UserGroup[];
    lastSeenAt?: string; // ISO
    createdAt: string;   // ISO
}

export interface UserChat { chatId: string; isPined: boolean; pinOrder: number; };
export interface UserGroup { groupId: string; isPined: boolean; pinOrder: number };

export enum UserStatus {
    "online" = "online",
    "offline" = "offline",
    "away" = "away"
};


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