'use client';

import React from 'react';
import { AnimateOnScroll } from '../../utils/animations';

interface Props {
    text: string;
    align?: 'left' | 'center';
}

const Paragraph: React.FC<Props> = ({ text, align = 'left' }) => {
    return (
        <div className="section-inner" style={{ marginBottom: '1.5rem' }}>
            <AnimateOnScroll y={20}>
                <p
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'clamp(1rem, 1.6vw, 1.1rem)',
                        lineHeight: 1.85,
                        maxWidth: align === 'center' ? '720px' : '760px',
                        margin: align === 'center' ? '0 auto' : 0,
                        textAlign: align,
                    }}
                >
                    {text}
                </p>
            </AnimateOnScroll>
        </div>
    );
};

export default Paragraph;
