
import { User, UserStatus } from '@/types/user'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'

export default function ChatListAvatar({ user }: { user: User }) {
    console.log(user?.status)
    return (
        <div className="relative flex justify-center items-center rounded-full h-full aspect-square shadow-custom-sm bg-accent-bg button-basic cursor-pointer">
            <Avatar className="w-full h-full bg-none">
                <AvatarImage src={user?.avatarUrl || "/images/user-avatar.png"} alt="User Avatar" />
                <AvatarFallback>
                    {user?.username ? user.username[0].toUpperCase() : "U"}
                </AvatarFallback>
            </Avatar>
            <div id='user-online-status' className={cn("absolute w-3 h-3 top-0 right-0 rounded-full border-3 bg-transparent", user?.status == UserStatus.online ? "bg-emerald-400 border-0!" : "border-gray-400")}>
            </div>

        </div>
    )
}
