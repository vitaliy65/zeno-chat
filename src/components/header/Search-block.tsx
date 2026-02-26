import { useAppDispatch } from "@/store/hooks";
import { findUsersByUsername } from "@/store/slices/user/UserAsyncThunks";
import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import UsersSearchList from "./UsersSearchList";
import { User } from "@/types/user";

export default function SearchBlock() {
    const [searchUser, setSearchChat] = useState("");
    const [findedUsers, setFindedUsers] = useState<User[]>([]);

    const dispatch = useAppDispatch();

    const handleChatSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter" && searchUser.length != 0) {
            dispatch(findUsersByUsername(searchUser)).then(res => { setFindedUsers(res.payload as User[]); });
        }
    }

    const handleChatSearchClick = () => {
        if (searchUser.length != 0) {
            dispatch(findUsersByUsername(searchUser)).then(res => { setFindedUsers(res.payload as User[]); });
        }
    }

    return (
        <div className='relative flex bg-background-second/50 lg:min-w-2xs p-1 rounded-full shadow-custom-md-inset gap-2'>
            <span className='bg-accent-bg/50 text-white h-full aspect-square rounded-full flex justify-center items-center shadow-custom-sm button-basic'
                onClick={handleChatSearchClick}><Search size={20} /></span>
            <input
                type="text"
                className="w-full focus:outline-none focus:ring-0"
                value={searchUser}
                onChange={(e) => { setSearchChat(e.target.value) }}
                onKeyDown={handleChatSearch}
                placeholder="Search..."
            />
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
