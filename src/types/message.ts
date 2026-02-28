export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    text: string;
    createdAt: string; // ISO
    isRead: boolean;
}

