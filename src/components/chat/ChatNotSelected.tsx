import Image from 'next/image'
import React from 'react'

export default function ChatNotSelected() {
    return (
        <div className='flex flex-col items-center justify-center'>
            <Image
                src={"/lets-chat.png"}
                width={512}
                height={512}
                alt="lets chat icon"
                className="object-contain w-full h-full max-w-2xs max-h-[288px] select-none"
                draggable={false}
            />
            <span className='font-extrabold text-3xl select-none'>Select a chat</span>
            <span className='font-extrabold text-3xl select-none'>To start chating!</span>
        </div>
    )
}
