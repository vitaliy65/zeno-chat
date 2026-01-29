import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function AvatarBlock({ user }: { user: User }) {
    return (
        <div className="flex justify-center items-center rounded-full h-full aspect-square shadow-custom-sm bg-accent-bg/10 button-basic">
            <Avatar className="w-full h-full bg-none">
                <AvatarImage src={user?.avatarUrl || "/images/user-avatar.png"} alt="User Avatar" />
                <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
    );
}
