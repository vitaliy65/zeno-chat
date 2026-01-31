"use client"

import { FormField } from '@/components/auth/FormField';
import { Button } from '@/components/ui/button';
import { getFirebaseErrorMessage } from '@/lib/errorHandler';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser } from '@/store/slices/user/UserAsyncThunks'; import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
;
import React, { useState } from 'react'


export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useAppDispatch();
    const { error, loading } = useAppSelector(s => s.user);

    const handleSubmit = async (e: React.FormEvent) => {
        if (loading) return;
        e.preventDefault();
        await dispatch(registerUser({ username, email, password }));

        redirect("/sign-in", RedirectType.push)
    }

    return (
        <div className="absolute inset-0 flex w-full items-center justify-center px-6 py-24">
            <div className="w-full h-full flex flex-col justify-center items-center max-w-md space-y-8 base-container-settings p-6!">
                <div className="space-y-2 text-center w-full">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Create your account
                    </h1>
                    <p className="text-muted-foreground">
                        Enter your details to register
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <FormField
                        id="username"
                        label="Username"
                        type="text"
                        placeholder="your username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
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
                        Register
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground w-full">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
