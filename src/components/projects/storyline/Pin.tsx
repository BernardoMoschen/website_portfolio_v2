'use client';

import React from 'react';
import { useReducedMotion } from 'motion/react';

interface Props {
    heading: string;
    body?: string;
    height?: '150vh' | '200vh' | '250vh';
}

const Pin: React.FC<Props> = ({ heading, body, height = '200vh' }) => {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return (
            <div className="section-inner" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
                <div
                    className="glass"
                    style={{
                        borderRadius: 16,
                        border: '1px solid var(--color-border)',
                        padding: 'clamp(2rem, 6vw, 4rem)',
                        textAlign: 'center',
                    }}
                >
                    <h3
                        style={{
                            fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                            fontWeight: 700,
                            margin: 0,
                            color: 'var(--color-text)',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2,
                        }}
                    >
                        {heading}
                    </h3>
                    {body && (
                        <p
                            style={{
                                marginTop: '1rem',
                                color: 'var(--color-text-secondary)',
                                fontSize: '1rem',
                                lineHeight: 1.7,
                                maxWidth: 640,
                                marginInline: 'auto',
                            }}
                        >
                            {body}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={{ height, position: 'relative', marginBottom: '2rem' }}>
            <div
                style={{
                    position: 'sticky',
                    top: '12vh',
                    height: '76vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className="section-inner" style={{ width: '100%' }}>
                    <div
                        className="glass"
                        style={{
                            borderRadius: 20,
                            border: '1px solid var(--color-border)',
                            padding: 'clamp(2rem, 6vw, 4rem)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            aria-hidden
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background:
                                    'radial-gradient(circle at 50% 50%, rgba(var(--color-primary-rgb,127,176,105),0.08), transparent 60%)',
                                pointerEvents: 'none',
                            }}
                        />
                        <h3
                            style={{
                                fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                                fontWeight: 700,
                                margin: 0,
                                color: 'var(--color-text)',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.15,
                                position: 'relative',
                            }}
                        >
                            {heading}
                        </h3>
                        {body && (
                            <p
                                style={{
                                    marginTop: '1.25rem',
                                    color: 'var(--color-text-secondary)',
                                    fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                                    lineHeight: 1.75,
                                    maxWidth: 720,
                                    marginInline: 'auto',
                                    position: 'relative',
                                }}
                            >
                                {body}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pin;
