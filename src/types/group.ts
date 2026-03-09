import { Message } from "./message";

export type GroupRole = "owner" | "admin" | "member" | "restricted" | "banned";

export interface GroupParticipant {
    id: string; // userId
    role: GroupRole;
    joinedAt: string;
}

export interface Group {
    id: string;
    title: string;
    description?: string;
    participants?: GroupParticipant[];
    messages?: (Message & { readedByUserIds: string[] })[];
    updatedAt: string;
    createdAt: string;
    avatarUrl?: string;
    type: "private" | "public";
    ownerId: string;
    admins?: string[];
    inviteLink?: string;
    lastMessage?: Message;
    unreadCount?: number;
}