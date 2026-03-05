import Image from 'next/image'

export default function ChatNotSelected() {
    return (
        <div className='flex flex-1 flex-col items-center justify-center'>
            <div className='relative'>
                <Image
                    src={"/messages.png"}
                    width={1024}
                    height={1024}
                    alt="lets chat icon"
                    className="relative object-contain max-w-[450px] aspect-square select-none"
                    draggable={false}
                />
                <div className='absolute bottom-0 flex flex-col items-center justify-center w-full'>
                    <span className='font-extrabold text-3xl select-none'>Select a chat</span>
                    <span className='font-extrabold text-3xl select-none'>To start chating!</span>
                </div>
            </div>
        </div>
    )
}
