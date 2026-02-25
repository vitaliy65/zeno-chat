"use client"

import { useState } from 'react'
import { FormField } from '@/components/auth/FormField'
import { Button } from '@/components/ui/button'
import { getFirebaseErrorMessage } from '@/lib/errorHandler'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { registerUser } from '@/store/slices/user/UserAsyncThunks'
import { AuthAnimatedForm } from '@/components/auth/AuthAnimatedForm'

// --- Страница регистрации с помощью общей формы ---

export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useAppDispatch()
    const { error, loading } = useAppSelector(s => s.user)

    const handleSubmit = async () => {
        await dispatch(registerUser({ username, email, password }))
    }

    return (
        <AuthAnimatedForm
            title="Create your account"
            description="Enter your details to register"
            onSubmit={handleSubmit}
            loading={loading}
            link={{
                to: "/sign-in",
                label: "Sign In",
                prompt: "Already have an account?"
            }}
            onSuccessRedirect="/sign-in"
        >
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
        </AuthAnimatedForm>
    )
}
