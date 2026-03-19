import React, { useState } from 'react';
import type { TechnicalArea } from '../../data/aboutData';
import TechnologyChipList from './TechnologyChipList';
import { getCategoryIcon } from '../../utils/iconMap';

interface TechnicalExpertiseCardProps {
    area: TechnicalArea;
}

const TechnicalExpertiseCard: React.FC<TechnicalExpertiseCardProps> = ({ area }) => {
    const [isDescriptionHovered, setIsDescriptionHovered] = useState(false);

    const featuredCount = area.technologies.filter(tech => tech.featured).length;
    const totalCount = area.technologies.length;

    return (
        <div className="glass-subtle tech-card">
            <style>{`
                .tech-card {
                    border-radius: 8px;
                    padding: 0.75rem;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .tech-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px color-mix(in srgb, var(--color-primary) 15%, transparent);
                    border-color: var(--color-primary) !important;
                }
                @media (max-width: 640px) {
                    .tech-card {
                        padding: 0.625rem;
                    }
                    .tech-card:hover {
                        transform: none;
                    }
                    .tech-card-description-box {
                        background: none !important;
                        padding: 0 !important;
                        min-height: auto !important;
                    }
                    .tech-card-desc-highlight {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.625rem' }}>
                {/* Category icon */}
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.8rem',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)',
                        marginTop: '0.1rem',
                    }}
                >
                    {getCategoryIcon(area.iconType)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.85rem' }}>
                            {area.category}
                        </span>
                        <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                            <span
                                style={{
                                    background: 'var(--color-primary)',
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: '0.55rem',
                                    padding: '0.1rem 0.35rem',
                                    borderRadius: 4,
                                    lineHeight: 1.4,
                                }}
                            >
                                {featuredCount} Core
                            </span>
                            <span
                                style={{
                                    border: '1px solid var(--color-primary)',
                                    color: 'var(--color-primary)',
                                    fontWeight: 600,
                                    fontSize: '0.55rem',
                                    padding: '0.05rem 0.35rem',
                                    borderRadius: 4,
                                    lineHeight: 1.4,
                                }}
                            >
                                {totalCount} Total
                            </span>
                        </div>
                    </div>

                    {/* Description with hover swap */}
                    <div
                        className="tech-card-description-box"
                        style={{
                            position: 'relative',
                            minHeight: 28,
                            cursor: 'pointer',
                            borderRadius: 4,
                            padding: '0.35rem',
                            background: 'var(--color-bg-glass)',
                            marginTop: '0.25rem',
                        }}
                        onMouseEnter={() => setIsDescriptionHovered(true)}
                        onMouseLeave={() => setIsDescriptionHovered(false)}
                    >
                        <span
                            style={{
                                color: 'var(--color-text-secondary)',
                                lineHeight: 1.3,
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                opacity: isDescriptionHovered ? 0 : 1,
                                transform: isDescriptionHovered ? 'translateY(-6px)' : 'translateY(0)',
                                transition: 'all 0.3s ease',
                                position: isDescriptionHovered ? 'absolute' : 'static',
                                width: '100%',
                                display: 'block',
                            }}
                        >
                            {area.description}
                        </span>
                        <span
                            className="tech-card-desc-highlight"
                            style={{
                                color: 'var(--color-secondary)',
                                lineHeight: 1.3,
                                fontSize: '0.7rem',
                                fontStyle: 'italic',
                                fontWeight: 600,
                                opacity: isDescriptionHovered ? 1 : 0,
                                transform: isDescriptionHovered ? 'translateY(0)' : 'translateY(6px)',
                                transition: 'all 0.3s ease',
                                position: isDescriptionHovered ? 'static' : 'absolute',
                                width: '100%',
                                display: 'block',
                            }}
                        >
                            {area.descriptionHighlight}
                        </span>
                    </div>
                </div>
            </div>

            <TechnologyChipList technologies={area.technologies} />
        </div>
    );
};

export default TechnicalExpertiseCard;
