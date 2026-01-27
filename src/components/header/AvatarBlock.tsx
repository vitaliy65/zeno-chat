import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function AvatarBlock() {
    return (
        <div className="flex justify-center items-center rounded-full h-full aspect-square shadow-custom-sm bg-background-second button-interaction">
            <Avatar className="w-full h-full bg-none">
                <AvatarImage src="/images/user-avatar.png" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
        </div>
    );
}
