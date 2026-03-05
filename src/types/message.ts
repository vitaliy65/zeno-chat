export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    text: string;
    fileName?: string
    type: MessageType;
    createdAt: string; // ISO
    isRead: boolean;
}

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'sticker' | 'gif'