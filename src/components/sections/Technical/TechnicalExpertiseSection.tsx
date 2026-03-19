import React from 'react';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { FaCode } from 'react-icons/fa';
import { technicalAreas } from '../../data/aboutData';
import TechnicalExpertiseCard from './TechnicalExpertiseCard';
import { StaggerContainer, StaggerItem } from '../../utils/animations';
import { useI18n } from '../../../i18n';

const TechnicalExpertiseSection: React.FC = () => {
    const { t } = useI18n();
    const areas = technicalAreas.map((area, i) => ({
        ...area,
        ...(t.about.technical_categories[i] ?? {}),
    }));

    return (
        <div>
            <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaCode
                    size={20}
                    style={{
                        color: 'var(--color-primary)',
                        animation: 'pulse 2s infinite',
                    }}
                />
                <span
                    style={{
                        fontWeight: 700,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '1.15rem',
                        background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 80%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'pulse 2s infinite',
                    }}
                >
                    {'<TechStack />'}
                </span>
                <FaArrowTrendUp size={16} style={{ color: 'var(--color-secondary)', marginLeft: '0.25rem' }} />
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>

            <StaggerContainer staggerDelay={0.12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {areas.map((area, index) => (
                        <StaggerItem key={index}>
                            <TechnicalExpertiseCard area={area} />
                        </StaggerItem>
                    ))}
                </div>
            </StaggerContainer>
        </div>
    );
};

export default TechnicalExpertiseSection;
