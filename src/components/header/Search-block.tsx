import { useAppDispatch } from "@/store/hooks";
import { findUsersByUsername } from "@/store/slices/user/UserAsyncThunks";
import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import UsersSearchList from "./UsersSearchList";
import { User } from "@/types/user";

export default function SearchBlock() {
    const [searchUser, setSearchUser] = useState("");
    const [searchOpen, setSearchOpen] = useState(false)
    const [findedUsers, setFindedUsers] = useState<User[]>([]);

    const dispatch = useAppDispatch();

    const handleChatSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter" && searchUser.length != 0) {
            dispatch(findUsersByUsername(searchUser)).then(res => { setFindedUsers(res.payload as User[]); });
        }
    }

    return (
        <div className="relative">
            <div
                className={`flex items-center rounded-lg border border-border bg-background-surface transition-all ${searchOpen ? "w-64" : "w-9"
                    }`}
            >
                <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Search"
                >
                    <Search className="size-4" />
                </button>
                {searchOpen && (
                    <input
                        autoFocus
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        onKeyDown={handleChatSearch}
                        placeholder="Search users, messages..."
                        className="h-9 flex-1 bg-transparent pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                )}
            </div>
            <UsersSearchList users={findedUsers} />
            {findedUsers.length > 0 && (
                <div
                    className="fixed inset-0 w-screen h-screen z-10"
                    onClick={() => setFindedUsers([])}
                />
            )}
        </div>
    )
}
