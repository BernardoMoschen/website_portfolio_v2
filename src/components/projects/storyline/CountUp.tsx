'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface Props {
    to: number;
    from?: number;
    suffix?: string;
    prefix?: string;
    label: string;
    duration?: number;
    /** Larger display variant for use inside Metrics grid */
    compact?: boolean;
}

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

const CountUp: React.FC<Props> = ({
    to,
    from = 0,
    suffix = '',
    prefix = '',
    label,
    duration = 1400,
    compact = false,
}) => {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState(reduce ? to : from);
    const startedRef = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (reduce) {
            setValue(to);
            return;
        }

        const obs = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && !startedRef.current) {
                        startedRef.current = true;
                        const start = performance.now();
                        let raf = 0;
                        const tick = (t: number) => {
                            const p = Math.min(1, (t - start) / duration);
                            const eased = easeOutQuad(p);
                            setValue(Math.round(from + (to - from) * eased));
                            if (p < 1) raf = requestAnimationFrame(tick);
                        };
                        raf = requestAnimationFrame(tick);
                        return () => cancelAnimationFrame(raf);
                    }
                }
            },
            { threshold: 0.5 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [from, to, duration, reduce]);

    const numberSize = compact ? 'clamp(2rem, 5vw, 3rem)' : 'clamp(3rem, 8vw, 5rem)';
    const labelSize = compact ? '0.75rem' : '0.85rem';

    return (
        <div
            ref={ref}
            style={{
                textAlign: 'center',
                padding: compact ? '0.5rem' : '1rem',
            }}
        >
            <div
                className="gradient-text"
                style={{
                    fontSize: numberSize,
                    fontWeight: 800,
                    lineHeight: 1,
                    background:
                        'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    letterSpacing: '-0.03em',
                    fontVariantNumeric: 'tabular-nums',
                }}
            >
                {prefix}
                {value.toLocaleString()}
                {suffix}
            </div>
            <div
                className="mono"
                style={{
                    fontSize: labelSize,
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginTop: 12,
                }}
            >
                {label}
            </div>
        </div>
    );
};

export default CountUp;
