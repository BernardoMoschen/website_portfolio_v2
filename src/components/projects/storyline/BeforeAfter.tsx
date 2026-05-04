'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimateOnScroll } from '../../utils/animations';

interface Props {
    before: string;
    after: string;
    alt: string;
    height?: number;
}

const BeforeAfter: React.FC<Props> = ({ before, after, alt, height = 480 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const [pct, setPct] = useState(50);

    const updateFromClientX = useCallback((clientX: number) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const next = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        setPct(next);
    }, []);

    const onPointerDown = (e: React.PointerEvent) => {
        draggingRef.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!draggingRef.current) return;
        updateFromClientX(e.clientX);
    };
    const stopDragging = () => {
        draggingRef.current = false;
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (document.activeElement !== containerRef.current?.querySelector('[data-handle]')) return;
            if (e.key === 'ArrowLeft') setPct((p) => Math.max(0, p - 5));
            if (e.key === 'ArrowRight') setPct((p) => Math.min(100, p + 5));
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="section-inner" style={{ marginBottom: '3rem' }}>
            <AnimateOnScroll y={30}>
                <div
                    ref={containerRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={stopDragging}
                    onPointerCancel={stopDragging}
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: `clamp(280px, 50vw, ${height}px)`,
                        borderRadius: 16,
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                        cursor: 'ew-resize',
                        userSelect: 'none',
                        touchAction: 'none',
                    }}
                >
                    {/* AFTER (full background) */}
                    <Image
                        src={after}
                        alt={`${alt} — after`}
                        fill
                        sizes="(max-width: 768px) 100vw, 80vw"
                        style={{ objectFit: 'cover' }}
                        draggable={false}
                    />

                    {/* BEFORE (clipped from left) */}
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute',
                            inset: 0,
                            clipPath: `inset(0 ${100 - pct}% 0 0)`,
                            willChange: 'clip-path',
                        }}
                    >
                        <Image
                            src={before}
                            alt={`${alt} — before`}
                            fill
                            sizes="(max-width: 768px) 100vw, 80vw"
                            style={{ objectFit: 'cover' }}
                            draggable={false}
                        />
                    </div>

                    {/* Labels */}
                    <span
                        className="mono"
                        style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            padding: '4px 10px',
                            background: 'rgba(0,0,0,0.55)',
                            color: '#fff',
                            fontSize: '0.7rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            borderRadius: 6,
                            pointerEvents: 'none',
                        }}
                    >
                        Before
                    </span>
                    <span
                        className="mono"
                        style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            padding: '4px 10px',
                            background: 'rgba(0,0,0,0.55)',
                            color: '#fff',
                            fontSize: '0.7rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            borderRadius: 6,
                            pointerEvents: 'none',
                        }}
                    >
                        After
                    </span>

                    {/* Divider line + handle */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: `${pct}%`,
                            width: 2,
                            background: 'linear-gradient(180deg, var(--color-primary), var(--color-secondary))',
                            transform: 'translateX(-1px)',
                            pointerEvents: 'none',
                        }}
                    />
                    <button
                        data-handle
                        aria-label={`Reveal ${pct.toFixed(0)}% of after image`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(pct)}
                        role="slider"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: `${pct}%`,
                            width: 44,
                            height: 44,
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '50%',
                            border: '2px solid var(--color-primary)',
                            background: 'var(--color-bg-glass)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            cursor: 'ew-resize',
                            display: 'grid',
                            placeItems: 'center',
                            color: 'var(--color-primary)',
                            fontWeight: 700,
                            fontSize: 14,
                        }}
                    >
                        ⇆
                    </button>
                </div>
            </AnimateOnScroll>
        </div>
    );
};

export default BeforeAfter;
