import { useAppSelector } from '@/store/hooks'

export default function ProfileBio() {
    const { user } = useAppSelector(s => s.user);

    if (!user) return null;

    return (
        <div className="mt-2 flex flex-col gap-3 text-foreground text-base">
            <div className="flex items-center gap-1 text-blue-400">
                @{user.username}
            </div>
            <div className="border-t border-border/10 my-1" />
            <div className="flex items-center gap-2">
                <span>Joined</span>
                <span>
                    {new Date(user.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </div>
    );
}
