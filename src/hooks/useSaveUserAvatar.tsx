import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCurrentUser } from "@/store/slices/user/UserAsyncThunks";

export function useSaveUserAvatar() {
    const dispatch = useAppDispatch();
    const authedUser = useAppSelector((state) => state.user.user);

    async function saveUserAvatar(file: File, userId: string) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);

        const res = await fetch("/api/uploadProfile", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const { error } = await res.json();
            throw new Error(error || "Failed to upload avatar");
        }

        const { url } = await res.json();

        if (authedUser && authedUser.id === userId) {
            dispatch(
                updateCurrentUser({ id: userId, avatarUrl: url })
            );
        }

        return url as string;
    }

    return { saveUserAvatar };
}