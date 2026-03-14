import React, { useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Only on desktop with fine pointer, and respect reduced motion
        const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (!mq.matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        document.body.classList.add('custom-cursor');

        const onMouseMove = (e: MouseEvent) => {
            pos.current = { x: e.clientX, y: e.clientY };
        };

        const onMouseEnter = (e: Event) => {
            const target = e.target;
            if (target instanceof Element && target.closest('a, button, [role="button"], input, textarea, .interactive')) {
                document.body.classList.add('cursor-hover');
            }
        };

        const onMouseLeave = (e: Event) => {
            if (!(e instanceof MouseEvent)) return;
            const isInteractive = (el: EventTarget | null): boolean =>
                el instanceof Element && !!el.closest('a, button, [role="button"], input, textarea, .interactive');
            if (isInteractive(e.target) && !isInteractive(e.relatedTarget)) {
                document.body.classList.remove('cursor-hover');
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseenter', onMouseEnter, true);
        document.addEventListener('mouseleave', onMouseLeave, true);

        let raf: number;
        let lastDotX = -1, lastDotY = -1;
        const animate = () => {
            const { x, y } = pos.current;
            if (dotRef.current && (x !== lastDotX || y !== lastDotY)) {
                dotRef.current.style.left = `${x}px`;
                dotRef.current.style.top = `${y}px`;
                lastDotX = x; lastDotY = y;
            }
            ringPos.current.x += (x - ringPos.current.x) * 0.15;
            ringPos.current.y += (y - ringPos.current.y) * 0.15;
            if (ringRef.current) {
                ringRef.current.style.left = `${ringPos.current.x}px`;
                ringRef.current.style.top = `${ringPos.current.y}px`;
            }
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseenter', onMouseEnter, true);
            document.removeEventListener('mouseleave', onMouseLeave, true);
            cancelAnimationFrame(raf);
            document.body.classList.remove('custom-cursor', 'cursor-hover');
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    );
};

export default CustomCursor;
