import { useAppDispatch } from '@/store/hooks'
import { Edit2, X } from 'lucide-react'
import { closeModal } from '@/store/slices/profile/ProfileSlice'

export default function ModalButtons() {
    const dispatch = useAppDispatch()

    return (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
                type="button"
                className="p-2 rounded-md hover:bg-accent-bg/30 text-foreground hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Edit profile"
            >
                <Edit2 size={20} />
            </button>
            <button
                type="button"
                className="p-2 rounded-md hover:bg-accent-bg/30 text-foreground hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Close profile"
                onClick={() => dispatch(closeModal())}
            >
                <X size={20} />
            </button>
        </div>
    )
}
