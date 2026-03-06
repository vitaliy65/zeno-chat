import type { Message } from "@/types/message";

export interface MessageGroup {
  sender: "me" | "them";
  senderName?: string;
  senderAvatar?: string;
  messages: Message[];
}

export function groupMessagesBySender(
  messages: Message[],
  currentUserId?: string
): MessageGroup[] {
  const groups: MessageGroup[] = [];

  for (const msg of messages) {
    const sender: "me" | "them" =
      currentUserId && msg.senderId === currentUserId ? "me" : "them";

    const last = groups[groups.length - 1];

    if (
      last &&
      last.sender === sender &&
      last.senderName === msg.senderName &&
      last.senderAvatar === msg.senderAvatar
    ) {
      last.messages.push(msg);
    } else {
      groups.push({
        sender,
        senderName: msg.senderName,
        senderAvatar: msg.senderAvatar,
        messages: [msg],
      });
    }
  }

  return groups;
}

