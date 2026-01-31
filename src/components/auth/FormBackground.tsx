import Image from 'next/image'

export default function FormBackground() {
    return (
        <div className="hidden w-full md:space-x-20 lg:space-x-80 lg:flex justify-center items-center">
            <div className="relative w-1/2 h-full">
                <Image
                    src="/hello.png"
                    alt="Register background"
                    fill
                    className="object-contain opacity-50"
                    priority
                />
            </div>
            <div className="relative w-1/2 h-full">
                <Image
                    src="/meeting.png"
                    alt="Register background"
                    fill
                    className="object-contain opacity-50"
                    priority
                />
            </div>
        </div>
    )
}
