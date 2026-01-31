import { cn } from "@/lib/utils";
import { ChatBoxMsg } from "./ChatBoxMsgGetter";

export default function ChatBoxMsgSender({ text, nextSameType }: ChatBoxMsg) {
    return (
        <div className="flex justify-end">
            <div className="relative flex flex-row justify-end items-end max-w-1/2">
                <div className={cn("px-3 py-2 bg-accent-bg/45 w-fit h-fit", nextSameType ? "rounded-xl" : "rounded-l-xl rounded-tr-xl")}>
                    {text}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 124 124" fill="none">
                    <rect width="124" height="124" rx="" fill="currentColor" className={`${nextSameType ? "text-transparent" : 'text-accent-bg/45'}`} />
                    <circle cx="110%" cy="" r="137" fill="#212427" />
                </svg>
            </div>
        </div>
    )
}