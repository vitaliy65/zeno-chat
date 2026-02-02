import { ReactNode } from "react";

export default function ModalCenter({ children, onClick }: { children: ReactNode, onClick?: () => void }) {
    return (
        <div className='absolute flex inset-0 w-screen h-screen justify-center items-center bg-black/40' onClick={onClick}>
            {children}
        </div>
    );
}
