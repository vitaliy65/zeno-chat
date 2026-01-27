"use client"
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChatListItem } from "./chatList/ChatListItem";

gsap.registerPlugin(ScrollTrigger);

export default function ChatList() {
    const containerRef = useRef(null);
    const chatListRef = useRef(null)

    useEffect(() => {
        const items = document.querySelectorAll('.chat-list-item');
        const tl = gsap.timeline();

        tl.from(items, {
            xPercent: -100,
            opacity: 0,
            stagger: { amount: 1 },
            scrollTrigger: {
                trigger: chatListRef.current,
                scroller: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                toggleActions: "play none none reverse",
                // markers: true
            }
        });

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className='row-span-11 col-span-1 base-container-settings overflow-y-scroll overflow-x-hidden thin-scrollbar'
        >
            <div ref={chatListRef} className="flex flex-col gap-3">
                {Array.from({ length: 20 }).map((_, index) => (
                    <ChatListItem key={index} />
                ))}
            </div>
        </div>
    )
}