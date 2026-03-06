import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import UsersSearchList from "./UsersSearchList";
import { useUserSearch } from "@/hooks/useUserSearch";

export default function SearchBlock() {
    const [searchOpen, setSearchOpen] = useState(false)
    const { query, setQuery, results, search, clear } = useUserSearch();

    const handleChatSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {
            search();
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
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleChatSearch}
                        placeholder="Search users, messages..."
                        className="h-9 flex-1 bg-transparent pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                )}
            </div>
            <UsersSearchList users={results} />
            {results.length > 0 && (
                <div
                    className="fixed inset-0 w-screen h-screen z-10"
                    onClick={clear}
                />
            )}
        </div>
    )
}
