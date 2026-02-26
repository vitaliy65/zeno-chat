
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCurrentUser } from "@/store/slices/user/UserAsyncThunks";
import { UserStatus } from "@/types/user";

export default function useUserStatusListener() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);

    useEffect(() => {
        if (!user) return;

        const setOnline = () => {
            dispatch(updateCurrentUser({ id: user.id, status: UserStatus.online }));
        };

        const setOffline = () => {
            dispatch(updateCurrentUser({ id: user.id, status: UserStatus.offline, lastSeenAt: new Date().toISOString() }));
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                setOnline();
            } else {
                setOffline();
            }
        };

        setOnline();
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("pagehide", setOffline);

        return () => {
            setOffline();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("pagehide", setOffline);
        };
    }, [dispatch, user?.id]);
}
