import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { findUsersByUsername } from "@/store/slices/user/UserAsyncThunks";
import type { User } from "@/types/user";

export function useUserSearch() {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);

  const search = async () => {
    if (!query.trim()) return;
    const res = await dispatch(findUsersByUsername(query));
    setResults(res.payload as User[]);
  };

  const clear = () => {
    setResults([]);
  };

  return {
    query,
    setQuery,
    results,
    search,
    clear,
  };
}

