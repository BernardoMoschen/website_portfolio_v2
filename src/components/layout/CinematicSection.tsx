import React, { useRef, useEffect, useCallback, useState } from 'react';
import { scrollState, type SectionId } from '../3d/scrollState';

interface CinematicSectionProps {
    id: SectionId;
    children: React.ReactNode;
    scrollHeight?: string;
    /** z-index for the sticky content layer. Default 2 (above 3D scene).
     *  Set to 0 to let 3D particles render above this section's content. */
    contentZIndex?: number;
    /** If true, content is fully visible at progress=0 (no fade-in entrance). */
    startVisible?: boolean;
}

// Easing for smooth entrance/exit curves
function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

const CinematicSection: React.FC<CinematicSectionProps> = ({
    id,
    children,
    scrollHeight = '400vh',
    contentZIndex = 2,
    startVisible = false,
}) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef(0);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    const stickyRef = useRef<HTMLDivElement>(null);

    const updateProgress = useCallback(() => {
        const el = outerRef.current;
        const content = contentRef.current;
        const inner = innerRef.current;
        const sticky = stickyRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const totalScroll = el.offsetHeight - window.innerHeight;

        if (totalScroll <= 0) {
            scrollState.sections[id] = rect.top <= 0 ? 1 : 0;
            return;
        }

        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
        scrollState.sections[id] = progress;

        // Apply scroll-driven transitions to the content
        if (content) {
            const enterEnd = 0.12;
            const exitStart = 0.88;

            let opacity = 1;
            let scale = 1;
            let fadeTranslateY = 0;

            if (progress < enterEnd && !startVisible) {
                const t = easeOutCubic(progress / enterEnd);
                opacity = t;
                scale = 0.96 + 0.04 * t;
                fadeTranslateY = 20 * (1 - t);
            } else if (progress > exitStart) {
                const t = easeOutCubic((1 - progress) / (1 - exitStart));
                opacity = t;
                scale = 0.96 + 0.04 * t;
                fadeTranslateY = -20 * (1 - t);
            }

            content.style.opacity = String(opacity);

            // Disable pointer events when section is faded out so sections
            // below remain clickable (sticky layers overlap in viewport)
            if (sticky) {
                sticky.style.pointerEvents = opacity < 0.5 ? 'none' : 'auto';
            }

            // If inner content is taller than viewport, scroll it based on progress
            let contentScrollY = 0;
            if (inner) {
                const contentHeight = inner.scrollHeight;
                const viewportHeight = window.innerHeight;
                const overflow = contentHeight - viewportHeight;
                if (overflow > 0) {
                    // Map progress [enterEnd, exitStart] → scroll [0, overflow]
                    const scrollProgress = Math.max(0, Math.min(1,
                        (progress - enterEnd) / (exitStart - enterEnd)
                    ));
                    contentScrollY = -overflow * scrollProgress;
                }
            }

            content.style.transform = `scale(${scale}) translateY(${fadeTranslateY + contentScrollY}px)`;
        }
    }, [id, startVisible]);

    useEffect(() => {
        const onScroll = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateProgress);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, [updateProgress]);

    if (reducedMotion) {
        return (
            <section id={id}>
                {children}
            </section>
        );
    }

    return (
        <section
            ref={outerRef}
            id={id}
            style={{
                position: 'relative',
                height: scrollHeight,
            }}
        >
            <div
                ref={stickyRef}
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100dvh',
                    width: '100%',
                    overflow: 'hidden',
                    zIndex: contentZIndex,
                }}
            >
                <div
                    ref={contentRef}
                    style={{
                        width: '100%',
                        willChange: 'transform, opacity',
                        transition: 'none',
                    }}
                >
                    <div ref={innerRef}>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CinematicSection;
