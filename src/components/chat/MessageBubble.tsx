import { formatTime } from "@/lib/utils";
import { Message } from "@/types/message";
import { Check, CheckCheck, FileText } from "lucide-react";
import Image from "next/image";

interface MessageBubbleProps {
    message: Message;
    isFirst: boolean;
    isLast: boolean;
    isOwn: boolean;
}

export function MessageBubble({ message, isFirst, isLast, isOwn }: MessageBubbleProps) {
    let content = null;

    switch (message.type) {
        case "image":
            content = (
                <a href={message.text} target="_blank" rel="noopener noreferrer">
                    <Image
                        src={message.text}
                        alt={message.fileName || ""}
                        width={512}
                        height={512}
                        className="max-w-[260px] max-h-[260px] rounded-lg"
                    />
                </a>
            );
            break;
        case "video":
            content = (
                <video controls src={message.text} className="max-w-[260px] max-h-[260px] rounded-lg" />
            );
            break;
        case "audio":
            content = (
                <audio controls src={message.text} className="w-48">
                    Ваш браузер не поддерживает аудио.
                </audio>
            );
            break;
        case "file":
            content = (
                <a
                    href={message.text}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline text-foreground"
                    download={message.fileName}
                >
                    <FileText className="size-4" />
                    <span className="break-all">
                        {message.fileName || "File"}
                    </span>
                </a>
            );
            break;
        // можно добавить другие типы, например, gif/sticker
        default:
            content = <span>{message.text}</span>;
    }

    // Класс для bubble shape
    const bubbleShape = isOwn
        ? isFirst && isLast
            ? "rounded-2xl rounded-br-md"
            : isFirst
                ? "rounded-2xl rounded-br-md"
                : isLast
                    ? "rounded-2xl rounded-tr-md"
                    : "rounded-2xl rounded-r-md"
        : isFirst && isLast
            ? "rounded-2xl rounded-bl-md"
            : isFirst
                ? "rounded-2xl rounded-bl-md"
                : isLast
                    ? "rounded-2xl rounded-tl-md"
                    : "rounded-2xl rounded-l-md";

    return (
        <div
            className={`group relative inline-flex max-w-full items-end gap-1.5 ${isOwn ? "flex-row-reverse" : "flex-row"
                }`}
        >
            <div
                className={`inline-block px-3.5 py-2 text-sm leading-relaxed ${isOwn && isFirst && "mt-5"
                    } ${isOwn
                        ? "bg-chat-bubble-own text-chat-bubble-own-foreground"
                        : "bg-chat-bubble-other text-chat-bubble-other-foreground"
                    } ${bubbleShape}`}
            >
                {content}
            </div>
            {/* Time + статус прочтения */}
            <span
                className={`flex shrink-0 items-center gap-0.5 text-[10px] text-muted-foreground ${isLast
                    ? "opacity-100"
                    : "opacity-0 transition-opacity group-hover:opacity-100"
                    }`}
            >
                {formatTime(message.createdAt)}
                {isOwn &&
                    (message.isRead ? (
                        <CheckCheck className="size-3 text-primary" />
                    ) : (
                        <Check className="size-3" />
                    ))}
            </span>
        </div>
    );
}