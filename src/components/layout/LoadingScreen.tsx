import React, { useEffect, useState } from 'react';

const bootLines = [
    '> initializing system...',
    '> loading 3d engine...',
    '> compiling shaders...',
    '> ready.',
];

const LINE_DELAY = 250;
const FADE_OUT_DELAY = 500;

const LoadingScreen: React.FC<{ loading: boolean }> = ({ loading }) => {
    const [visibleLines, setVisibleLines] = useState(0);
    const [fadingOut, setFadingOut] = useState(false);
    const [hidden, setHidden] = useState(false);

    // Show boot lines one by one
    useEffect(() => {
        // Show first 3 lines on a timer
        const maxAutoLines = bootLines.length - 1; // all except "ready."
        const timers: ReturnType<typeof setTimeout>[] = [];

        for (let i = 1; i <= maxAutoLines; i++) {
            timers.push(
                setTimeout(() => setVisibleLines(i), LINE_DELAY * i)
            );
        }

        return () => timers.forEach(clearTimeout);
    }, []);

    // When loading finishes, show "ready." then fade out
    useEffect(() => {
        if (loading) return;

        // Show the final "ready." line
        setVisibleLines(bootLines.length);

        const fadeTimer = setTimeout(() => setFadingOut(true), FADE_OUT_DELAY);
        const hideTimer = setTimeout(() => setHidden(true), FADE_OUT_DELAY + 600);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, [loading]);

    if (hidden) return null;

    return (
        <div
            role="status"
            aria-label={loading ? 'Loading portfolio…' : 'Portfolio ready'}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                background: 'var(--color-bg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: fadingOut ? 'translateY(-100vh)' : 'translateY(0)',
                transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
                pointerEvents: fadingOut ? 'none' : 'auto',
            }}
        >
            {/* Brand name */}
            <h1
                className="gradient-text mono"
                style={{
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    marginBottom: '2.5rem',
                    letterSpacing: '0.05em',
                    animation: 'fadeInUp 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) both',
                }}
            >
                bernardo.moschen
            </h1>

            {/* Terminal boot lines */}
            <div
                aria-live="polite"
                className="mono"
                style={{
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                    color: 'var(--color-text-secondary, #888)',
                    lineHeight: 1.9,
                    minHeight: `${bootLines.length * 1.9}em`,
                }}
            >
                {bootLines.slice(0, visibleLines).map((line, i) => (
                    <div
                        key={i}
                        style={{
                            animation: 'fadeInUp 0.35s cubic-bezier(0.25, 0.1, 0.25, 1) both',
                            color: i === bootLines.length - 1 ? 'var(--color-primary)' : undefined,
                        }}
                    >
                        {line}
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: loading ? '2px' : '3px',
                    transition: 'height 0.3s ease',
                    background: 'var(--color-bg-elevated, #111)',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        background: loading
                            ? 'var(--color-primary)'
                            : 'linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-primary))',
                        width: loading ? '70%' : '100%',
                        transition: loading
                            ? 'width 2s cubic-bezier(0.4, 0, 0.2, 1)'
                            : 'width 0.4s ease-out, background 0.3s ease',
                        boxShadow: loading ? 'none' : '0 0 12px var(--color-primary), 0 0 24px var(--color-secondary)',
                    }}
                />
            </div>

            {/* Reduced motion: simple fallback via media query */}
            <style>{`
                @media (prefers-reduced-motion: reduce) {
                    .loading-screen-root * {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
