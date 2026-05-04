'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n';
import { useConciergeStream } from '../../hooks/useConciergeStream';
import ConciergeMessage from './ConciergeMessage';

const Concierge: React.FC = () => {
    const { t, locale } = useI18n();
    const shouldReduceMotion = useReducedMotion();
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { messages, send, isStreaming, error } = useConciergeStream({ locale });

    useEffect(() => {
        if (open) {
            const id = window.setTimeout(() => inputRef.current?.focus(), 80);
            return () => window.clearTimeout(id);
        }
    }, [open]);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, isStreaming]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!draft.trim() || isStreaming) return;
        send(draft);
        setDraft('');
    };

    const c = t.concierge;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 24,
                left: 24,
                zIndex: 1000,
            }}
        >
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="panel"
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
                        transition={{
                            duration: shouldReduceMotion ? 0 : 0.22,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="glass"
                        style={{
                            position: 'absolute',
                            bottom: 64,
                            left: 0,
                            width: 'min(380px, calc(100vw - 48px))',
                            height: 'min(540px, 70vh)',
                            borderRadius: 18,
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 24px 72px rgba(0,0,0,0.28)',
                        }}
                    >
                        <header
                            style={{
                                padding: '14px 18px',
                                borderBottom: '1px solid var(--color-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span
                                className="mono"
                                style={{
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-primary)',
                                    fontWeight: 600,
                                }}
                            >
                                {c.label}
                            </span>
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close concierge"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-secondary)',
                                    padding: 4,
                                    fontSize: 20,
                                    lineHeight: 1,
                                }}
                            >
                                ×
                            </button>
                        </header>

                        <div
                            ref={scrollRef}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '14px 16px',
                            }}
                        >
                            {messages.length === 0 && (
                                <ConciergeMessage role="assistant" content={c.firstMessage} />
                            )}
                            {messages.map((m) => (
                                <ConciergeMessage key={m.id} role={m.role} content={m.content} />
                            ))}
                            {isStreaming && messages[messages.length - 1]?.content === '' && (
                                <div
                                    className="mono"
                                    style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--color-text-secondary)',
                                        padding: '4px 12px',
                                        opacity: 0.6,
                                    }}
                                >
                                    …
                                </div>
                            )}
                            {error === 'rate_limited' && (
                                <ConciergeMessage role="assistant" content={c.rateLimited} isError />
                            )}
                            {error === 'error' && (
                                <ConciergeMessage role="assistant" content={c.error} isError />
                            )}
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            style={{
                                borderTop: '1px solid var(--color-border)',
                                padding: 12,
                            }}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder={c.placeholder}
                                disabled={isStreaming}
                                aria-label={c.placeholder}
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    background: 'var(--color-bg-glass)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 10,
                                    padding: '10px 14px',
                                    color: 'var(--color-text)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                }}
                            />
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setOpen((o) => !o)}
                aria-label={c.label}
                aria-expanded={open}
                className="glass"
                style={{
                    padding: '10px 18px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 24,
                    color: 'var(--color-text)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                    transition: shouldReduceMotion ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
            >
                <span
                    aria-hidden
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        boxShadow: '0 0 12px var(--color-primary)',
                    }}
                />
                {c.label}
            </button>
        </div>
    );
};

export default Concierge;
