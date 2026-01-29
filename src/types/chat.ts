import { Message } from "./message";
import { User } from "./user";

export interface Chat {
    id: string;
    participantIds: [string, string];
    messages?: Message[];
    updatedAt: string;
}

export interface ChatPreview {
    chatId: string;
    user: User;          // собеседник
    lastMessage?: Message | undefined;
    unreadCount: number;
}
