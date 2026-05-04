import { useCallback, useEffect, useRef, useState } from 'react';
import { conciergeBus } from '../lib/conciergeBus';

export interface ConciergeMessageRecord {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export type ConciergeError = 'rate_limited' | 'error' | null;

interface UseConciergeStreamArgs {
    locale: 'en' | 'pt-br';
}

const newId = (): string => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const dispatchTool = (name: string, args: unknown) => {
    if (!args || typeof args !== 'object') return;
    if (name === 'highlightProject') {
        const slug = (args as { slug?: unknown }).slug;
        if (typeof slug === 'string') conciergeBus.emit('highlightProject', { slug });
    } else if (name === 'scrollToSection') {
        const id = (args as { id?: unknown }).id;
        if (typeof id === 'string') conciergeBus.emit('scrollToSection', { id });
    }
};

export const useConciergeStream = ({ locale }: UseConciergeStreamArgs) => {
    const [messages, setMessages] = useState<ConciergeMessageRecord[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<ConciergeError>(null);
    const abortRef = useRef<AbortController | null>(null);
    const messagesRef = useRef<ConciergeMessageRecord[]>([]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => () => abortRef.current?.abort(), []);

    const send = useCallback(
        async (content: string) => {
            const trimmed = content.trim();
            if (!trimmed) return;

            const userMsg: ConciergeMessageRecord = {
                id: newId(),
                role: 'user',
                content: trimmed,
            };
            const asstMsg: ConciergeMessageRecord = {
                id: newId(),
                role: 'assistant',
                content: '',
            };

            const history = [...messagesRef.current, userMsg];
            setMessages([...history, asstMsg]);
            setIsStreaming(true);
            setError(null);

            abortRef.current?.abort();
            const ctrl = new AbortController();
            abortRef.current = ctrl;

            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                        messages: history.map((m) => ({ role: m.role, content: m.content })),
                        locale,
                    }),
                    signal: ctrl.signal,
                });

                if (res.status === 429) {
                    setError('rate_limited');
                    setIsStreaming(false);
                    return;
                }

                if (!res.ok || !res.body) {
                    setError('error');
                    setIsStreaming(false);
                    return;
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const events = buffer.split('\n\n');
                    buffer = events.pop() ?? '';

                    for (const evt of events) {
                        if (!evt.trim()) continue;
                        let evtName: string | null = null;
                        let dataStr = '';
                        for (const line of evt.split('\n')) {
                            if (line.startsWith('event: ')) evtName = line.slice(7).trim();
                            else if (line.startsWith('data: ')) dataStr += line.slice(6);
                        }

                        if (evtName === 'tool') {
                            try {
                                const payload = JSON.parse(dataStr) as {
                                    name?: string;
                                    args?: unknown;
                                };
                                if (payload.name) dispatchTool(payload.name, payload.args);
                            } catch {
                                // ignore malformed tool payload
                            }
                            continue;
                        }

                        if (evtName === 'error') {
                            setError('error');
                            continue;
                        }

                        if (dataStr === '[DONE]') continue;

                        try {
                            const payload = JSON.parse(dataStr) as { delta?: string };
                            if (typeof payload.delta === 'string') {
                                const delta = payload.delta;
                                setMessages((prev) =>
                                    prev.map((m) =>
                                        m.id === asstMsg.id
                                            ? { ...m, content: m.content + delta }
                                            : m,
                                    ),
                                );
                            }
                        } catch {
                            // ignore malformed delta
                        }
                    }
                }
            } catch (err) {
                if ((err as Error).name !== 'AbortError') setError('error');
            } finally {
                setIsStreaming(false);
            }
        },
        [locale],
    );

    return { messages, send, isStreaming, error };
};
