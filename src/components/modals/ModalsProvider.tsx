"use client"
import { ReactNode } from 'react'
import ProfileModal from '../profile/ProfileModal'
import { useAppSelector } from '@/store/hooks'
import NewGroupModal from '../chatList/Form/NewGroupModal'

export default function ModalsProvider({ children }: { children: ReactNode }) {
    const { openModal } = useAppSelector(s => s.modals)

    return (
        <>
            {children}
            {openModal === "profile" && <ProfileModal />}
            {openModal === "newGroup" && <NewGroupModal />}
        </>
    )
}
