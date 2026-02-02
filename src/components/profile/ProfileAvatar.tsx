import { User } from "@/types/user";
import { UserCircle2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useSaveUserAvatar } from "@/hooks/useSaveUserAvatar";

export default function ProfileAvatar({ user }: { user: User }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { saveUserAvatar } = useSaveUserAvatar();

    // Открыть диалог выбора файла по клику на аватар
    const handleAvatarClick = () => {
        if (inputRef.current) {
            inputRef.current.value = ""; // сброс, чтобы один и тот же файл можно было выбрать повторно
            inputRef.current.click();
        }
    };

    // Обработать выбор файла
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user.id) {
            await saveUserAvatar(file, user.id);
            // Возможное обновление данных пользователя после загрузки аватара — зависит от остальной архитектуры приложения
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-2">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <div className="relative">
                {user.avatarUrl ? (
                    <Image
                        src={user.avatarUrl}
                        alt={user.username}
                        width={512}
                        height={512}
                        className="w-20 h-20 rounded-full object-cover border-2 border-accent-bg shadow hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        onClick={handleAvatarClick}
                    />
                ) : (
                    <span
                        className="w-20 h-20 flex items-center justify-center rounded-full bg-accent-bg border-2 border-accent-bg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        onClick={handleAvatarClick}
                    >
                        <UserCircle2 size={64} className="text-white" />
                    </span>
                )}
                {/* Status indicator dot (optional, e.g., online indicator) */}
                <span className="absolute bottom-1 right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                </span>
            </div>
            <div className="mt-2 text-lg font-medium">{user.username}</div>
        </div>
    );
}
