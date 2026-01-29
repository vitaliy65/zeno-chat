
import { ChatPreview } from "@/types/chat";

export const chatsMock: ChatPreview[] = [
    {
        chatId: "1",
        user: {
            id: "2",
            username: "Alice",
            avatarUrl: "/images/user-avatars/alice.png",
            createdAt: "2023-04-18T10:00:00Z"
        },
        lastMessage: {
            id: "m1",
            chatId: "1",
            senderId: "2",
            text: "Hey! Are you coming tonight?",
            createdAt: "2024-06-11T19:20:00Z",
            isRead: false
        },
        unreadCount: 2,
    },
    {
        chatId: "2",
        user: {
            id: "3",
            username: "Bob",
            avatarUrl: "/images/user-avatars/bob.png",
            createdAt: "2022-11-25T09:30:00Z"
        },
        lastMessage: {
            id: "m2",
            chatId: "2",
            senderId: "1",
            text: "I sent you the files.",
            createdAt: "2024-06-11T18:52:00Z",
            isRead: true
        },
        unreadCount: 0,
    },
    {
        chatId: "3",
        user: {
            id: "4",
            username: "Charlie",
            avatarUrl: "/images/user-avatars/charlie.png",
            createdAt: "2021-07-15T13:12:00Z"
        },
        lastMessage: {
            id: "m3",
            chatId: "3",
            senderId: "4",
            text: "Let's meet tomorrow.",
            createdAt: "2024-06-11T17:45:00Z",
            isRead: false
        },
        unreadCount: 1,
    },
    {
        chatId: "4",
        user: {
            id: "5",
            username: "Diana",
            avatarUrl: "/images/user-avatars/diana.png",
            createdAt: "2022-03-02T15:45:00Z"
        },
        lastMessage: {
            id: "m4",
            chatId: "4",
            senderId: "1",
            text: "Thanks for your help!",
            createdAt: "2024-06-10T09:10:00Z",
            isRead: true
        },
        unreadCount: 0,
    },
    {
        chatId: "5",
        user: {
            id: "6",
            username: "Eddie",
            avatarUrl: "/images/user-avatars/eddie.png",
            createdAt: "2020-12-22T11:40:00Z"
        },
        lastMessage: {
            id: "m5",
            chatId: "5",
            senderId: "6",
            text: "Lunch today?",
            createdAt: "2024-06-11T13:14:00Z",
            isRead: false
        },
        unreadCount: 5,
    },
    {
        chatId: "6",
        user: {
            id: "7",
            username: "Fiona",
            avatarUrl: "/images/user-avatars/fiona.png",
            createdAt: "2023-01-06T08:22:00Z"
        },
        lastMessage: {
            id: "m6",
            chatId: "6",
            senderId: "1",
            text: "See you soon!",
            createdAt: "2024-06-09T18:20:00Z",
            isRead: true
        },
        unreadCount: 0,
    },
    {
        chatId: "7",
        user: {
            id: "8",
            username: "George",
            avatarUrl: "/images/user-avatars/george.png",
            createdAt: "2023-06-29T14:18:00Z"
        },
        lastMessage: {
            id: "m7",
            chatId: "7",
            senderId: "8",
            text: "Don't forget our call.",
            createdAt: "2024-06-11T11:30:00Z",
            isRead: false
        },
        unreadCount: 3,
    },
    {
        chatId: "8",
        user: {
            id: "9",
            username: "Hannah",
            avatarUrl: "/images/user-avatars/hannah.png",
            createdAt: "2022-09-14T12:08:00Z"
        },
        lastMessage: {
            id: "m8",
            chatId: "8",
            senderId: "9",
            text: "Okay, will do.",
            createdAt: "2024-06-10T23:10:00Z",
            isRead: true
        },
        unreadCount: 0,
    },
    {
        chatId: "9",
        user: {
            id: "10",
            username: "Ivan",
            avatarUrl: "/images/user-avatars/ivan.png",
            createdAt: "2021-12-16T20:00:00Z"
        },
        lastMessage: {
            id: "m9",
            chatId: "9",
            senderId: "1",
            text: "Long time no see!",
            createdAt: "2024-06-09T07:03:00Z",
            isRead: false
        },
        unreadCount: 7,
    },
    {
        chatId: "10",
        user: {
            id: "11",
            username: "Julia",
            avatarUrl: "/images/user-avatars/julia.png",
            createdAt: "2022-08-05T09:47:00Z"
        },
        lastMessage: {
            id: "m10",
            chatId: "10",
            senderId: "11",
            text: "Got it, thank you!",
            createdAt: "2024-06-09T09:55:00Z",
            isRead: true
        },
        unreadCount: 0,
    },
    {
        chatId: "11",
        user: {
            id: "12",
            username: "Kurt",
            avatarUrl: "/images/user-avatars/kurt.png",
            createdAt: "2023-03-12T11:23:00Z"
        },
        lastMessage: {
            id: "m11",
            chatId: "11",
            senderId: "12",
            text: "Where are you from?",
            createdAt: "2024-06-08T18:01:00Z",
            isRead: false
        },
        unreadCount: 2,
    },
    {
        chatId: "12",
        user: {
            id: "13",
            username: "Luna",
            avatarUrl: "/images/user-avatars/luna.png",
            createdAt: "2022-04-29T16:29:00Z"
        },
        lastMessage: {
            id: "m12",
            chatId: "12",
            senderId: "13",
            text: "Yes, let's do it!",
            createdAt: "2024-06-11T10:11:00Z",
            isRead: true
        },
        unreadCount: 0,
    }
];


