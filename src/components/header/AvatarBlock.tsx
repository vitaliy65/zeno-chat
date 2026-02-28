import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/user/UserAsyncThunks";
import { toggleModal } from "@/store/slices/profile/ProfileSlice";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function AvatarBlock({ user }: { user: User }) {
    const dispatch = useAppDispatch();
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleToggleProfile = () => {
        dispatch(toggleModal());
    };

    return (
        <div className="relative">
            <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-background-surface"
            >
                <Avatar className="size-7">
                    <AvatarImage src={user.avatarUrl} alt="Your avatar" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">{user.username.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                </Avatar>
                <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>

            {profileOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-background-surface p-1 shadow-lg">
                        <button onClick={() => {
                            handleToggleProfile();
                            setProfileOpen(false)
                        }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-background-elevated">
                            My Profile
                        </button>
                        <div className="my-1 h-px bg-border" />
                        <button onClick={() => {
                            handleLogout();
                            setProfileOpen(false)
                        }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/10">
                            Log out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
