'use client';

import React from 'react';
import { AnimateOnScroll } from '../../utils/animations';
import CountUp from './CountUp';

interface Item {
    to: number;
    from?: number;
    suffix?: string;
    prefix?: string;
    label: string;
}

interface Props {
    items: Item[];
}

const Metrics: React.FC<Props> = ({ items }) => {
    return (
        <div className="section-inner" style={{ marginBottom: '3rem', marginTop: '2rem' }}>
            <AnimateOnScroll y={20}>
                <div
                    className="glass"
                    style={{
                        borderRadius: 16,
                        border: '1px solid var(--color-border)',
                        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                        display: 'grid',
                        gridTemplateColumns: `repeat(auto-fit, minmax(min(180px, 100%), 1fr))`,
                        gap: 'clamp(1rem, 3vw, 2rem)',
                    }}
                >
                    {items.map((item, idx) => (
                        <CountUp key={`${item.label}-${idx}`} compact {...item} />
                    ))}
                </div>
            </AnimateOnScroll>
        </div>
    );
};

export default Metrics;
