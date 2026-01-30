"use client"

import { useRef } from "react";
import { gsap } from "gsap"
import { Skeleton } from "../ui/skeleton";
import AvatarMock from "./AvatarMock";

export default function ChatListItemMock() {
    const itemRef = useRef<HTMLDivElement | null>(null);

    // Объединяем функции анимации для разных событий
    const animate = (scale: number, duration: number, ease: string) => {
        if (itemRef.current) {
            gsap.to(itemRef.current, { scale, duration, ease });
        }
    };

    return (
        <Skeleton
            ref={itemRef}
            className="flex chat-list-item w-full h-14 items-center p-2 gap-2 rounded-full shadow-custom-md cursor-pointer select-none"
            onMouseEnter={() => animate(1.05, 0.2, "power2.out")}
            onMouseLeave={() => animate(1, 0.2, "power2.inOut")}
            onMouseDown={() => animate(0.98, 0.08, "power1.in")}
            onMouseUp={() => animate(1.05, 0.13, "power1.out")}
            onTouchStart={() => animate(0.98, 0.08, "power1.in")}
            onTouchEnd={() => animate(1.05, 0.13, "power1.out")}
            tabIndex={0}
        >
            <AvatarMock />
            <div className="flex flex-col w-full mr-3 overflow-hidden space-y-2">
                <div className="flex flex-row items-center justify-between w-full h-[16px]">
                    <span className="bg-accent-bg/30 w-1/2 h-full rounded-full"></span>
                    <span className="bg-accent-bg/30 w-12 h-full rounded-full"></span>
                </div>
                <div className="flex bg-accent-bg/30 h-[16px] rounded-full">
                </div>
            </div>
        </Skeleton>
    );
}
