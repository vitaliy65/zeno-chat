import { redirect, RedirectType } from 'next/navigation'
import { gsap } from "gsap"
import Link from "next/link"
import { useEffect, useRef, useState } from 'react'

// Универсальная анимированная форма для Auth страниц (Sign In / Sign Up)
export type AuthAnimatedFormProps = {
    title: string,
    description: string,
    onSubmit: () => Promise<void> | void,
    loading: boolean,
    children: React.ReactNode,
    link: {
        to: string,
        label: string,
        prompt: string
    },
    onSuccessRedirect?: string
}

export function AuthAnimatedForm({
    title,
    description,
    onSubmit,
    loading,
    children,
    link,
    onSuccessRedirect
}: AuthAnimatedFormProps) {
    const [isTransitioning, setIsTransitioning] = useState(false)
    const formRef = useRef<HTMLDivElement | null>(null)
    const ANIMATION_EXIT_TIME_MS = 300

    // Анимация появления формы
    useEffect(() => {
        if (formRef.current) {
            gsap.set(formRef.current, {
                scale: 0.95,
                opacity: 0,
            })
            gsap.to(formRef.current, {
                scale: 1,
                opacity: 1,
                duration: ANIMATION_EXIT_TIME_MS / 1000,
                ease: "power2.out",
                delay: 0.08
            })
        }
    }, [])

    // Анимация и редирект по ссылке
    const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        if (isTransitioning) return
        setIsTransitioning(true)

        if (formRef.current) {
            await gsap.to(formRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: ANIMATION_EXIT_TIME_MS / 1000,
                ease: "power1.inOut"
            })
        }

        redirect(link.to, RedirectType.push)
    }

    // Submit + опциональный редирект с анимацией
    const handleSubmit = async (e: React.FormEvent) => {
        if (loading || isTransitioning) return
        e.preventDefault()

        await onSubmit()

        if (onSuccessRedirect) {
            setTimeout(() => {
                redirect(onSuccessRedirect, RedirectType.push)
            }, ANIMATION_EXIT_TIME_MS)
        }
    }

    return (
        <div className="absolute inset-0 flex w-full items-center justify-center px-6 py-24">
            <div ref={formRef} className="opacity-0 w-full flex flex-col justify-center items-center max-w-md space-y-8 base-container-settings  p-6!">
                <div className="space-y-2 text-center w-full">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    {children}
                </form>
                <p className="text-center text-sm text-muted-foreground w-full">
                    {link.prompt}{" "}
                    <Link
                        href={link.to}
                        className="font-medium text-primary hover:underline"
                        onClick={handleLinkClick}
                        tabIndex={isTransitioning ? -1 : 0}
                        aria-disabled={isTransitioning}
                        prefetch={false}
                        style={isTransitioning ? { pointerEvents: 'none', opacity: 0.7 } : undefined}
                    >
                        {link.label}
                    </Link>
                </p>
            </div>
        </div>
    )
}