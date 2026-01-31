import FormBackground from '@/components/auth/FormBackground';
import React from 'react'

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative flex min-h-screen bg-background-second">
            <FormBackground />
            {children}
        </div>
    );
}
