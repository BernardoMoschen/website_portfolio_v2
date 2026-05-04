'use client';

import React from 'react';
import { AnimateOnScroll } from '../../utils/animations';

interface Props {
    text: string;
    level?: 2 | 3;
}

const Heading: React.FC<Props> = ({ text, level = 2 }) => {
    const Tag = level === 2 ? 'h2' : 'h3';
    const fontSize = level === 2 ? 'clamp(1.8rem, 4vw, 2.5rem)' : 'clamp(1.3rem, 3vw, 1.7rem)';

    return (
        <div className="section-inner" style={{ marginBottom: '1.5rem', marginTop: '2.5rem' }}>
            <AnimateOnScroll y={20}>
                <Tag
                    style={{
                        fontSize,
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        margin: 0,
                    }}
                >
                    {text}
                </Tag>
            </AnimateOnScroll>
        </div>
    );
};

export default Heading;
