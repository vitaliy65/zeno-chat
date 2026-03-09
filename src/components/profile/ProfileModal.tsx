import { useAppDispatch, useAppSelector } from '@/store/hooks'
import ModalCenter from '../ModalCenter'
import ProfileAvatar from './ProfileAvatar'
import ProfileBio from './ProfileBio'
import { closeModal } from '@/store/slices/profile/modalSlice'
import ModalButtons from './ModalButtons'

export default function ProfileModal() {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(s => s.user);

    if (!user) return;

    return (
        <ModalCenter onClick={() => dispatch(closeModal())}>
            <div
                className="relative min-w-[356px] min-h-1/3 bg-background-surface p-4 rounded-xl shadow-custom-md space-y-4"
                onClick={e => e.stopPropagation()}
            >
                <ModalButtons />
                <ProfileAvatar user={user} />
                <ProfileBio />
            </div>
        </ModalCenter>
    )
}
