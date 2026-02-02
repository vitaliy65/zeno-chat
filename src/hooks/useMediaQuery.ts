import { useEffect, useState } from "react";

type MediaQueryResult = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};

const MOBILE_MAX = 639;
const TABLET_MIN = 640;
const TABLET_MAX = 1023;
const DESKTOP_MIN = 1024;

function getMediaQueryResult(): MediaQueryResult {
    if (typeof window === "undefined") {
        return {
            isMobile: false,
            isTablet: false,
            isDesktop: false,
        };
    }
    const width = window.innerWidth;
    return {
        isMobile: width <= MOBILE_MAX,
        isTablet: width >= TABLET_MIN && width <= TABLET_MAX,
        isDesktop: width >= DESKTOP_MIN,
    };
}

export default function useMediaQuery() {
    const [media, setMedia] = useState<MediaQueryResult>(getMediaQueryResult());

    useEffect(() => {
        const handleResize = () => {
            setMedia(getMediaQueryResult());
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return media;
}

