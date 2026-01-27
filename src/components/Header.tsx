import AvatarBlock from "./header/AvatarBlock";
import HeaderLogo from "./header/header-logo";
import NotificationBlock from "./header/NotificationBlock";
import SearchBlock from "./header/Search-block";

export default function Header() {
    return (
        <div className='flex row-span-1 col-span-4 base-container-settings justify-between'>
            <HeaderLogo />
            <div className="flex flex-row gap-2">
                <SearchBlock />
                <NotificationBlock />
                <AvatarBlock />
            </div>
        </div>
    )
}
