"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { loginUser } from "@/store/slices/user/UserAsyncThunks"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { FormField } from "@/components/auth/FormField"
import { getFirebaseErrorMessage } from "@/lib/errorHandler"
import { AuthAnimatedForm } from "@/components/auth/AuthAnimatedForm"

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useAppDispatch();
    const { error, loading } = useAppSelector(s => s.user);

    const handleSubmit = async () => {
        await dispatch(loginUser({ email, password }))
    }

    return (
        <AuthAnimatedForm
            title="Sign in to your account"
            description="Enter your credentials to continue"
            onSubmit={handleSubmit}
            loading={loading}
            link={{
                to: "/register",
                label: "Register",
                prompt: "Don't have an account?"
            }}
            onSuccessRedirect="/"
        >
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
        </AuthAnimatedForm>
    )
}
