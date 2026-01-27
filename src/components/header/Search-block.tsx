import { Search } from "lucide-react";

export default function SearchBlock() {
    return (
        <div className='flex bg-background-second/50 min-w-2xs p-1 rounded-full shadow-custom-md-inset gap-2'>
            <span className='bg-background-second h-full aspect-square rounded-full flex justify-center items-center shadow-custom-sm button-interaction'><Search /></span>
            <input
                type="text"
                className="w-full focus:outline-none focus:ring-0"
                placeholder="Search..."
            />
        </div>
    )
}
