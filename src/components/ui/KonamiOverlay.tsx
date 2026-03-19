'use client';

import React, { useEffect, useCallback, useRef } from 'react';

interface KonamiOverlayProps {
    onClose: () => void;
}

const LINES = [
    { text: '> konami_code --execute', delay: 0 },
    { text: '> ', delay: 300 },
    { text: '> ACCESS GRANTED. Welcome, fellow developer.', delay: 500 },
    { text: '> ', delay: 900 },
    { text: '> SYSTEM REPORT:', delay: 1100 },
    { text: '> ┌─────────────────────────────────────────┐', delay: 1300 },
    { text: '> │  name    :: Bernardo Moschen            │', delay: 1500 },
    { text: '> │  role    :: Full Stack Engineer         │', delay: 1650 },
    { text: '> │  base    :: Porto Alegre, BR → Remote   │', delay: 1800 },
    { text: '> │  stack   :: React · TS · Python · AWS   │', delay: 1950 },
    { text: '> │  status  :: open to new adventures      │', delay: 2100 },
    { text: '> └─────────────────────────────────────────┘', delay: 2250 },
    { text: '> ', delay: 2500 },
    { text: '> fun fact: this easter egg took longer', delay: 2700 },
    { text: '>           to build than you\'d expect.', delay: 2900 },
    { text: '> ', delay: 3100 },
    { text: '> [ESC or click anywhere to exit developer mode]', delay: 3300, muted: true },
];

const KonamiOverlay: React.FC<KonamiOverlayProps> = ({ onClose }) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const previousFocus = useRef<Element | null>(null);

    const handleKey = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        previousFocus.current = document.activeElement;
        overlayRef.current?.focus();
        return () => {
            if (previousFocus.current instanceof HTMLElement) {
                previousFocus.current.focus();
            }
        };
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleKey]);

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Developer mode overlay"
            tabIndex={-1}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                background: 'rgba(5, 8, 5, 0.97)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    fontFamily: '"Fira Code", "Cascadia Code", monospace',
                    fontSize: 'clamp(11px, 1.6vw, 14px)',
                    lineHeight: 1.9,
                    padding: '2.5rem 3rem',
                    maxWidth: 640,
                    width: '90vw',
                    cursor: 'default',
                }}
            >
                {LINES.map(({ text, delay, muted }, i) => (
                    <div
                        key={i}
                        style={{
                            color: muted ? '#4a6a4a' : '#7fb069',
                            opacity: 0,
                            animation: `konamiReveal 0.15s ease forwards`,
                            animationDelay: `${delay}ms`,
                            whiteSpace: 'pre',
                        }}
                    >
                        {text || '\u00A0'}
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes konamiReveal {
                    from { opacity: 0; transform: translateX(-6px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default KonamiOverlay;
