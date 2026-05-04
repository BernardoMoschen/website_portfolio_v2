'use client';

import React from 'react';

interface Props {
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
}

const renderMarkdownLight = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let lastIndex = 0;
    let key = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        const token = match[0];
        if (token.startsWith('**')) {
            parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
        } else {
            parts.push(
                <code
                    key={key++}
                    style={{
                        background: 'var(--color-bg-glass)',
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.85em',
                    }}
                >
                    {token.slice(1, -1)}
                </code>,
            );
        }
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
};

const ConciergeMessage: React.FC<Props> = ({ role, content, isError }) => {
    const isUser = role === 'user';
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: 10,
            }}
        >
            <div
                style={{
                    maxWidth: '85%',
                    padding: '8px 14px',
                    borderRadius: 14,
                    background: isUser
                        ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
                        : 'var(--color-bg-glass)',
                    color: isUser
                        ? '#fff'
                        : isError
                          ? 'var(--color-secondary)'
                          : 'var(--color-text)',
                    fontSize: '0.88rem',
                    lineHeight: 1.55,
                    border: isUser ? 'none' : '1px solid var(--color-border)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    boxShadow: isUser ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
                }}
            >
                {renderMarkdownLight(content)}
            </div>
        </div>
    );
};

export default ConciergeMessage;
