'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../../../i18n';

const AboutContent: React.FC = () => {
    const { t } = useI18n();
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const briefs = t.about.briefs;

    return (
        <div style={{ marginBottom: '2rem' }}>
            {/* Tab buttons */}
            <div
                style={{
                    display: 'flex',
                    gap: '0.25rem',
                    marginBottom: '1.5rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}
            >
                {briefs.map(({ audience }, index) => {
                    const isActive = selectedTab === index;
                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedTab(index)}
                            style={{
                                padding: '0.4rem 0.75rem',
                                fontSize: 'clamp(0.78rem, 1.2vw, 0.95rem)',
                                fontWeight: 600,
                                background: 'none',
                                border: 'none',
                                borderBottom: isActive
                                    ? '3px solid var(--color-primary)'
                                    : '3px solid transparent',
                                color: isActive
                                    ? 'var(--color-primary)'
                                    : 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                transition: 'color 0.2s, border-color 0.2s',
                                fontFamily: 'inherit',
                            }}
                            aria-selected={isActive}
                            role="tab"
                        >
                            {audience}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div role="tabpanel" style={{ padding: '0.5rem 0.5rem' }}>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={selectedTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            lineHeight: 1.7,
                            color: 'var(--color-text-secondary)',
                            fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
                            textAlign: 'justify',
                            maxWidth: '100%',
                        }}
                    >
                        {briefs[selectedTab].brief}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AboutContent;
