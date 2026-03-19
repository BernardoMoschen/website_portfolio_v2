import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768) {
    const [mobile, setMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
    });

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
        setMobile(mql.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [breakpoint]);

    return mobile;
}
