"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { ReactElement, useEffect, useState } from "react"
import { redirect, RedirectType } from "next/navigation"
import { tryAutoLogin } from "@/store/slices/user/UserAsyncThunks"
import Spinner from "../Spinner"


export default function AuthCheck({ children }: { children: ReactElement }) {
    const { user, error, loading } = useAppSelector((s) => s.user);
    const dispatch = useAppDispatch();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        dispatch(tryAutoLogin()).finally(() => setChecked(true));
    }, [dispatch]);

    if (error) {
        redirect("/sign-in", RedirectType.replace);
    }

    if (!checked || (loading && !user)) {
        return (
            <div className="flex h-screen p-4 bg-background-second">
                <div className="flex flex-col gap-4 w-full h-full justify-center items-center base-container-settings">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (!user) {
        redirect("/sign-in", RedirectType.replace);
    }

    return children;
}
