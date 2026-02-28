import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { User } from '@/types/user'

interface UserAvatarProps {
    user: User;
    onClick?: () => void;
}

export default function UserAvatar({ user, onClick }: UserAvatarProps) {
    return (
        <button
            onClick={onClick}
            className="flex w-full h-full cursor-pointer items-center rounded-lg transition-colors hover:bg-background-surface"
        >
            <Avatar className='w-full h-full'>
                <AvatarImage src={user.avatarUrl} alt="Your avatar" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{user.username.charAt(0).toLocaleUpperCase()}</AvatarFallback>
            </Avatar>
        </button>
    )
}
