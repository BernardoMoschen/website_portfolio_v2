'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface Props {
    code: string;
    lang?: string;
    caption?: string;
}

const TYPE_DURATION_MS = 1400;

const CodeBlock: React.FC<Props> = ({ code, lang, caption }) => {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const [revealed, setRevealed] = useState(0);
    const startedRef = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (reduce) {
            setRevealed(code.length);
            return;
        }

        const obs = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && !startedRef.current) {
                        startedRef.current = true;
                        const start = performance.now();
                        const total = code.length;
                        let raf = 0;
                        const tick = (t: number) => {
                            const p = Math.min(1, (t - start) / TYPE_DURATION_MS);
                            setRevealed(Math.floor(total * p));
                            if (p < 1) raf = requestAnimationFrame(tick);
                        };
                        raf = requestAnimationFrame(tick);
                        return () => cancelAnimationFrame(raf);
                    }
                }
            },
            { threshold: 0.4 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [code, reduce]);

    const visible = code.slice(0, revealed);
    const cursor = revealed < code.length ? '▍' : '';

    return (
        <div className="section-inner" style={{ marginBottom: '2rem' }}>
            <div
                ref={ref}
                className="glass"
                style={{
                    borderRadius: 12,
                    border: '1px solid var(--color-border)',
                    padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                    overflow: 'hidden',
                }}
            >
                {lang && (
                    <div
                        className="mono"
                        style={{
                            fontSize: '0.7rem',
                            color: 'var(--color-primary)',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            marginBottom: 10,
                            opacity: 0.8,
                        }}
                    >
                        {lang}
                    </div>
                )}
                <pre
                    className="mono"
                    style={{
                        margin: 0,
                        fontSize: 'clamp(0.78rem, 1.4vw, 0.9rem)',
                        lineHeight: 1.7,
                        color: 'var(--color-text)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        minHeight: '1.7em',
                    }}
                >
                    <code>
                        {visible}
                        <span
                            aria-hidden
                            style={{
                                color: 'var(--color-primary)',
                                opacity: cursor ? 1 : 0,
                            }}
                        >
                            {cursor}
                        </span>
                    </code>
                </pre>
            </div>
            {caption && (
                <p
                    className="mono"
                    style={{
                        marginTop: 8,
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        opacity: 0.7,
                    }}
                >
                    {caption}
                </p>
            )}
        </div>
    );
};

export default CodeBlock;
