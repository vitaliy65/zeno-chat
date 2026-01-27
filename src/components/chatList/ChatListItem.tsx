"use client"

import { useRef } from "react";
import { gsap } from "gsap"
import AvatarBlock from "../header/AvatarBlock";

export function ChatListItem() {
    const itemRef = useRef<HTMLDivElement | null>(null);

    // Объединяем функции анимации для разных событий
    const animate = (scale: number, duration: number, ease: string) => {
        if (itemRef.current) {
            gsap.to(itemRef.current, { scale, duration, ease });
        }
    };

    return (
        <div
            ref={itemRef}
            className="flex chat-list-item w-full h-14 items-center p-2 gap-2 bg-background-second/50 rounded-full shadow-custom-md cursor-pointer select-none"
            onMouseEnter={() => animate(1.05, 0.2, "power2.out")}
            onMouseLeave={() => animate(1, 0.2, "power2.inOut")}
            onMouseDown={() => animate(0.98, 0.08, "power1.in")}
            onMouseUp={() => animate(1.05, 0.13, "power1.out")}
            onTouchStart={() => animate(0.98, 0.08, "power1.in")}
            onTouchEnd={() => animate(1.05, 0.13, "power1.out")}
            tabIndex={0}
        >
            <AvatarBlock />
            <div className="flex flex-col w-full mr-3 overflow-hidden">
                <div className="flex flex-row items-center justify-between">
                    <span className="font-semibold">Username Username</span>
                    <span className="text-foreground/50">12:12</span>
                </div>
                <div className="flex">
                    <span className="text-foreground/65 truncate block max-w-full">
                        text text text text text text text text text text
                    </span>
                </div>
            </div>
        </div>
    );
}