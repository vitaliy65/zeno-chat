"use client"

import { useAppSelector } from "@/store/hooks"
import { ReactElement, useEffect } from "react"
import Spinner from "./Spinner"

export default function AuthCheck({ children }: { children: ReactElement }) {
    const { user, error, loading } = useAppSelector(s => s.user)

    useEffect(() => { }, [])

    if (user == null && loading) {
        return (
            <div className="flex h-screen p-4 bg-background-second">
                <div className="flex w-full h-full base-container-settings">
                    <Spinner />
                </div>
            </div>)
    }

    return children
}
