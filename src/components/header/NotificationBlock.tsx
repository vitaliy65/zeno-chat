import { Bell } from "lucide-react";

export default function NotificationBlock() {
    return (
        <div className="relative flex justify-center items-center rounded-full h-full aspect-square shadow-custom-sm bg-accent-bg/50 text-white button-basic">
            <Bell />
            <div className="absolute size-2 bg-red-500 rounded-full outline-3 outline-[#383586] p-0 top-2 right-2"></div>
        </div>
    )
}
