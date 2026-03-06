export default function HeaderLogo() {
    return (
        <div className='flex flex-row justify-start items-center gap-2 h-9 w-fit'>
            <div className='rounded-sm bg-primary h-full aspect-square flex justify-center items-center font-bold text-2xl text-foreground'>Z</div>
            <span className="text-xl font-bold max-md:hidden">Zeno-chat</span>
        </div>
    )
}
