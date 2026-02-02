import { cn } from "@/lib/utils";

export interface ChatBoxMsg {
    text: string;
    nextSameType: boolean;
}

export default function ChatBoxMsgGetter({ text, nextSameType }: ChatBoxMsg) {
    return (
        <div className={cn("flex justify-start", !nextSameType && "mb-4")}>
            <div className="relative flex flex-row justify-end items-end lg:max-w-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 124 124" fill="none">
                    <rect width="124" height="124" rx="" fill="currentColor" className={`${nextSameType ? "text-transparent" : "text-accent-bg/20"}`} />
                    <circle cx="-10%" cy="" r="137" fill="#212427" />
                </svg>
                <div className={cn("px-3 py-2 bg-accent-bg/20 w-fit wrap-break-word break-all", nextSameType ? "rounded-xl" : "rounded-r-xl rounded-tl-xl")}>
                    {text}
                </div>
            </div>
        </div>
    );
}
