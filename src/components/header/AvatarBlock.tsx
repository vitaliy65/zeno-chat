import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/user/UserAsyncThunks";

export default function AvatarBlock({ user }: { user: User }) {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex justify-center items-center rounded-full h-full aspect-square shadow-custom-sm bg-accent-bg button-basic cursor-pointer">
                    <Avatar className="w-full h-full bg-none">
                        <AvatarImage src={user?.avatarUrl || "/images/user-avatar.png"} alt="User Avatar" />
                        <AvatarFallback>
                            {user?.username ? user.username[0].toUpperCase() : "U"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[220px] bg-background-second -translate-x-4
                        rounded-xl shadow-custom-lg p-2 border border-primary/20 flex flex-col gap-1">
                <DropdownMenuItem
                    className="justify-center text-center w-full py-2 px-4 rounded-full bg-red-500/10 focus:bg-red-500/30 focus:text-white transition border-none cursor-pointer font-medium text-red-800"
                    onClick={handleLogout}
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
