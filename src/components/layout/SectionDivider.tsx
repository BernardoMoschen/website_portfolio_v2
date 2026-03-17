import React, { useEffect, useState } from 'react';

interface SectionDividerProps {
    /** Mirror vertically for top-of-section placement */
    flip?: boolean;
    className?: string;
    idBase?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ flip = false, className, idBase }) => {
    const stableId = (idBase ?? (flip ? 'section-divider-flip' : 'section-divider'))
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-');
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        setReducedMotion(
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }, []);

    const animDur = reducedMotion ? '0s' : '20s';

    return (
        <div
            className={className}
            style={{
                position: 'relative',
                width: '100%',
                height: '60px',
                overflow: 'hidden',
                transform: flip ? 'scaleY(-1)' : undefined,
                zIndex: 3,
                pointerEvents: 'none',
            }}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 1440 60"
                preserveAspectRatio="none"
                style={{ display: 'block', width: '100%', height: '100%' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Soft glow / bloom filter */}
                    <filter id={`glow-${stableId}`} x="-20%" y="-50%" width="140%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Animated shimmer gradient */}
                    <linearGradient id={`shimmer-${stableId}`} x1="0%" y1="0%" x2="200%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.15" />
                        <stop offset="20%" stopColor="var(--color-primary)" stopOpacity="0.6" />
                        <stop offset="35%" stopColor="var(--color-secondary)" stopOpacity="0.35" />
                        <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.6" />
                        <stop offset="65%" stopColor="var(--color-border)" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="var(--color-border)" stopOpacity="0.08" />
                        <animateTransform
                            attributeName="gradientTransform"
                            type="translate"
                            from="-1 0"
                            to="0 0"
                            dur={animDur}
                            repeatCount="indefinite"
                        />
                    </linearGradient>

                    {/* Radial bloom behind the wave */}
                    <radialGradient id={`bloom-${stableId}`} cx="50%" cy="50%" r="60%">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Background bloom */}
                <rect x="0" y="0" width="1440" height="60" fill={`url(#bloom-${stableId})`} />

                {/* Primary wave with glow */}
                <path
                    d="M0,30 C180,22 360,38 540,30 C720,22 900,38 1080,30 C1260,22 1440,34 1440,30"
                    fill="none"
                    stroke={`url(#shimmer-${stableId})`}
                    strokeWidth="1.5"
                    filter={`url(#glow-${stableId})`}
                />

                {/* Secondary wave — thinner, slightly offset */}
                <path
                    d="M0,33 C240,26 480,37 720,30 C960,23 1200,37 1440,33"
                    fill="none"
                    stroke={`url(#shimmer-${stableId})`}
                    strokeWidth="0.5"
                    opacity="0.35"
                />
            </svg>
        </div>
    );
};

export default SectionDivider;
