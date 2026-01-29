import { User } from '@/types/user'
import AvatarBlock from './AvatarBlock'
import { createChat, fetchChatPreviews } from '@/store/slices/chat/ChatAsyncThunks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export default function UsersSearchList({ users }: { users: User[] }) {
    const dispatch = useAppDispatch();
    const currentUserId = useAppSelector((state) => state.user.user?.id);

    if (!users.length) return null;

    return (
        <div className={`absolute w-full min-h-[56px] z-20 left-1/2 -translate-x-1/2 top-14 bg-background-second 
                         bg-opacity-95 backdrop-blur-md rounded-xl shadow-custom-lg p-1 py-2 border border-primary/20 flex flex-col gap-1`}>
            {users.map((user) => (
                <div
                    key={user.id}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background cursor-pointer active:scale-98 transition-all group select-none"
                    onClick={async () => {
                        if (currentUserId) {
                            await dispatch(createChat({ userId: currentUserId, otherUserId: user.id }))
                            await dispatch(fetchChatPreviews({ userId: currentUserId || "" }))
                        }
                    }}
                >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shadow-custom-sm border border-secondary/20">
                        <AvatarBlock user={user} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-base text-ellipsis overflow-hidden whitespace-nowrap">{user.username}</span>
                        </div>
                        {user.status === "online" ? (
                            <span className="text-xs text-primary/80">Online</span>
                        ) : user.status === "away" ? (
                            <span className="text-xs text-yellow-600/80">Away</span>
                        ) : (
                            <span className="text-xs text-muted-foreground/70">{user.lastSeenAt ? `Last seen at ${new Date(user.lastSeenAt).toLocaleString()}` : "Offline"}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
