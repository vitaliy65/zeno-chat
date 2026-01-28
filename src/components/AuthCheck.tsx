"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { ReactElement, useEffect, useRef, useState } from "react"
import Spinner from "./Spinner"
import { redirect, RedirectType } from "next/navigation"
import { tryAutoLogin } from "@/store/slices/UserAsyncThunks"
import gsap from "gsap"

const REDIRECT_TIME = 10000;

export default function AuthCheck({ children }: { children: ReactElement }) {
    const { user, error, loading } = useAppSelector(s => s.user)
    const loadingRef = useRef<HTMLDivElement>(null)
    const [timeToRedirect, setTimeToRedirect] = useState(REDIRECT_TIME / 1000);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(tryAutoLogin())

        const timer = setInterval(() => {
            setTimeToRedirect(prev => prev - 1)
        }, 1000)

        const timeout = setTimeout(() => {
            if (loadingRef.current) {
                gsap.to(loadingRef.current, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        redirect('/sign-in', RedirectType.push)
                    }
                })
            }
        }, REDIRECT_TIME)

        return () => {
            clearTimeout(timeout)
            clearInterval(timer)
        }
    }, [])

    if (error) {
        redirect('/sign-in', RedirectType.replace)
    }

    if (user == null || loading) {
        return (
            <div
                id="loading-state"
                ref={loadingRef}
                className="flex h-screen p-4 bg-background-second"
            >
                <div className="flex flex-col gap-4 w-full h-full justify-center items-center base-container-settings">
                    <Spinner />
                    <span className="text-xl font-bold">Redirect in <span className="text-accent-bg">{timeToRedirect}</span></span>
                </div>
            </div>
        )
    }

    return children
}
