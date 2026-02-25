
export default function FormBackground() {
    return (
        <div
            className="w-full justify-center items-center relative"
            style={{ background: "radial-gradient(ellipse at bottom right, #171a47, #191d7b, #000003" }}
        >
            <div
                className="pointer-events-none select-none w-full h-full absolute inset-0 bg-cover bg-center p-4"
            >
                <div className="w-full h-full animate-pulse duration-6000" style={{ backgroundImage: "url('/bg-auth.webp')" }} aria-label="Galaxy background" draggable="false" />
            </div>
        </div>
    )
}
