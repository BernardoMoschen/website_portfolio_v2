import React, { useState } from 'react';
import { FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { Technology } from '../../data/aboutData';
import TechnologyChip from './TechnologyChip';

interface TechnologyChipListProps {
    technologies: Technology[];
}

const TechnologyChipList: React.FC<TechnologyChipListProps> = ({ technologies }) => {
    const [showAll, setShowAll] = useState(false);

    const featuredTechnologies = technologies.filter(tech => tech.featured);
    const additionalTechnologies = technologies.filter(tech => !tech.featured);
    const hasAdditional = additionalTechnologies.length > 0;

    return (
        <div>
            {/* Featured Technologies */}
            {featuredTechnologies.length > 0 && (
                <div style={{ marginBottom: hasAdditional ? '0.5rem' : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <FaStar size={9} style={{ color: 'var(--color-primary)', marginRight: '0.25rem' }} />
                        <span
                            style={{
                                fontWeight: 700,
                                color: 'var(--color-text)',
                                fontSize: '0.6rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Core Technologies
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {featuredTechnologies.map((tech, index) => (
                            <TechnologyChip key={index} technology={tech} />
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Technologies - collapsible */}
            {hasAdditional && (
                <div>
                    <div
                        style={{
                            overflow: 'hidden',
                            maxHeight: showAll ? '500px' : '0px',
                            opacity: showAll ? 1 : 0,
                            transition: 'max-height 0.35s ease, opacity 0.3s ease',
                        }}
                    >
                        <div style={{ marginBottom: '0.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.35rem' }}>
                                <span
                                    style={{
                                        fontWeight: 600,
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '0.55rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Additional Skills
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                {additionalTechnologies.map((tech, index) => (
                                    <TechnologyChip key={index} technology={tech} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Toggle button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.4rem' }}>
                        <button
                            onClick={() => setShowAll(!showAll)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                border: '1px solid var(--color-primary)',
                                color: 'var(--color-primary)',
                                background: 'transparent',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                borderRadius: 6,
                                padding: '0.2rem 0.75rem',
                                height: 24,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'color-mix(in srgb, var(--color-primary) 10%, transparent)';
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                            }}
                        >
                            {showAll ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                            {showAll ? 'Show Less' : `+${additionalTechnologies.length} More`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnologyChipList;
