"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/store/slices/UserAsyncThunks"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useAppDispatch();
    const { user, error, loading } = useAppSelector(s => s.user);

    const handleSubmit = async (e: React.FormEvent) => {
        if (loading) return;
        e.preventDefault()
        await dispatch(loginUser({ email, password }))
    }

    return (
        <div className="relative flex min-h-screen">
            {/* Left side - Image */}
            <div className="hidden w-full md:space-x-20 lg:space-x-80 lg:flex justify-center items-center">
                <div className="relative w-1/2 h-full">
                    <Image
                        src="/hello.png"
                        alt="Sign in background"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="relative w-1/2 h-full">
                    <Image
                        src="/meeting.png"
                        alt="Sign in background"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* center - Form */}
            <div className="absolute inset-0 flex w-full items-center justify-center px-6 py-24">
                <div className="w-full h-full flex flex-col justify-center items-center max-w-md space-y-8 base-container-settings bg-card! p-6!">
                    <div className="space-y-2 text-center w-full">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Sign in to your account
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your email and password to sign in
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 w-full">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 bg-background"
                            />
                        </div>

                        {error && <div className="text-center text-red-500 font-bold">Incorrect email or password!</div>}

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
                        <a
                            href="/register"
                            className="font-medium text-primary hover:underline"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
