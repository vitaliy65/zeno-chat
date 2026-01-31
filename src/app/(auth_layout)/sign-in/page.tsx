"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { loginUser } from "@/store/slices/user/UserAsyncThunks"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { FormField } from "@/components/auth/FormField"
import Link from "next/link"
import { getFirebaseErrorMessage } from "@/lib/errorHandler"
import { redirect, RedirectType } from "next/navigation"

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useAppDispatch();
    const { error, loading } = useAppSelector(s => s.user);

    const handleSubmit = async (e: React.FormEvent) => {
        if (loading) return;
        e.preventDefault()
        await dispatch(loginUser({ email, password }))

        redirect("/", RedirectType.push)
    }

    return (
        <div className="absolute inset-0 flex w-full items-center justify-center px-6 py-24">
            <div className="w-full h-full flex flex-col justify-center items-center max-w-md space-y-8 base-container-settings p-6!">
                <div className="space-y-2 text-center w-full">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Sign in to your account
                    </h1>
                    <p className="text-muted-foreground">
                        Enter your email and password to sign in
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <FormField
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <FormField
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    {error && <div className="text-center text-red-500 font-bold">{getFirebaseErrorMessage(error)}</div>}

                    <Button
                        type="submit"
                        className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 button-basic"
                        disabled={loading}
                    >
                        Sign In
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground w-full">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}
