import React, { useEffect, useRef, useState } from 'react';
import { scrollState } from '../3d/scrollState';

const SECTIONS = [
    { key: 'hero', label: 'hero' },
    { key: 'about', label: 'about' },
    { key: 'projects', label: 'projects' },
    { key: 'certifications', label: 'certifications' },
    { key: 'contact', label: 'contact' },
] as const;

const ScrollProgress: React.FC = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        let rafId = 0;
        const update = () => {
            const p = scrollState.progress;
            const sections = scrollState.sections;

            // Update fill height
            if (fillRef.current) {
                fillRef.current.style.height = `${p * 100}%`;
            }

            // Determine active section
            let activeIdx = 0;
            const sectionKeys = SECTIONS.map(s => s.key);
            for (let i = sectionKeys.length - 1; i >= 0; i--) {
                if (sections[sectionKeys[i] as keyof typeof sections] > 0.1) {
                    activeIdx = i;
                    break;
                }
            }

            // Update dots
            dotsRef.current.forEach((dot, i) => {
                if (!dot) return;
                const isActive = i === activeIdx;
                dot.style.backgroundColor = isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)';
                dot.style.boxShadow = isActive ? '0 0 8px var(--color-primary)' : 'none';
                dot.style.transform = isActive ? 'scale(1.5)' : 'scale(1)';
            });

            // Update label
            if (labelRef.current) {
                labelRef.current.textContent = `// ${SECTIONS[activeIdx].label}`;
            }

            rafId = requestAnimationFrame(update);
        };
        rafId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafId);
    }, [isMobile]);

    if (isMobile) return null;

    return (
        <div
            style={{
                position: 'fixed',
                right: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                pointerEvents: 'none',
            }}
        >
            {/* Section label */}
            <span
                ref={labelRef}
                className="mono"
                style={{
                    fontSize: '0.6rem',
                    color: 'var(--color-text-secondary)',
                    opacity: 0.6,
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                }}
            />

            {/* Track */}
            <div
                ref={trackRef}
                style={{
                    width: '2px',
                    height: '50vh',
                    backgroundColor: 'var(--color-border)',
                    borderRadius: '1px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Fill */}
                <div
                    ref={fillRef}
                    style={{
                        width: '100%',
                        height: '0%',
                        background: 'linear-gradient(to bottom, var(--color-primary), var(--color-secondary))',
                        borderRadius: '1px',
                        transition: 'height 0.05s linear',
                    }}
                />
            </div>

            {/* Dots overlay */}
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    height: '50vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '2px',
                }}
            >
                {SECTIONS.map((_, i) => (
                    <div
                        key={i}
                        ref={el => { dotsRef.current[i] = el; }}
                        style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-text-secondary)',
                            transition: 'all 0.3s ease',
                            transform: 'translateX(-2px)',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ScrollProgress;
