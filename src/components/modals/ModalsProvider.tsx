"use client"
import { ReactNode } from 'react'
import ProfileContainer from '../profile/ProfileContainer'
import { useAppSelector } from '@/store/hooks'

export default function ModalsProvider({ children }: { children: ReactNode }) {
    const { modalOpen } = useAppSelector(s => s.profile)

    return (
        <>
            {children}
            {modalOpen && <ProfileContainer />}
        </>
    )
}
