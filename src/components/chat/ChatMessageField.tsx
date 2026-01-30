import { Paperclip, SendHorizonal } from 'lucide-react'
import React, { useState } from 'react'

export default function ChatMessageField() {
    const [messageText, setMessageText] = useState("")
    return (
        <div className='flex w-full h-16 rounded-md shadow-custom-lg max-w-2/3 px-4 py-2 space-x-3'>
            <button className='aspect-square h-full bg-accent-bg/50 rounded-full shadow-custom-md flex justify-center items-center text-white button-basic'>
                <Paperclip />
            </button>
            <div className='relative flex bg-background-second/50 w-full p-1 rounded-full shadow-custom-md-inset gap-2'>
                <button className='bg-accent-bg/50 text-white h-full aspect-square rounded-full flex justify-center items-center shadow-custom-sm button-basic'
                    onClick={() => { }}><SendHorizonal />
                </button>
                <input
                    type="text"
                    className="w-full focus:outline-none focus:ring-0"
                    value={messageText}
                    onChange={(e) => { setMessageText(e.target.value) }}
                    placeholder="Write a message..."
                />
            </div>
        </div>
    )
}
