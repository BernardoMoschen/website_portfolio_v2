import React from 'react';
import { FaCode, FaGlobeAmericas, FaWifi } from 'react-icons/fa';
import { experiences } from '../../data/aboutData';
import AboutContent from './AboutContent';
import TechnicalExpertiseSection from '../Technical/TechnicalExpertiseSection';
import ExperienceTimeline from './ExperienceTimeline';
import { AnimateOnScroll } from '../../utils/animations';
import SectionAnchor from '../../utils/SectionAnchor';
import { useI18n } from '../../../i18n';

const AboutSection: React.FC = () => {
    const { t } = useI18n();
    return (
        <div
            style={{
                width: '100%',
                minHeight: '100vh',
                padding: 'clamp(2rem, 4vw, 3rem) 0',
                background: 'var(--color-bg-glass)',
                backdropFilter: 'blur(16px)',
                position: 'relative',
            }}
        >
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <AnimateOnScroll>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div className="section-heading-group">
                            <h2
                                style={{
                                    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                                    fontWeight: 800,
                                    marginBottom: '0.75rem',
                                    background: 'linear-gradient(180deg, var(--color-primary) 20%, var(--color-secondary) 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: 1.1,
                                }}
                            >
                                {t.about.heading}
                            </h2>
                            <SectionAnchor sectionId="about" />
                        </div>

                        <p
                            style={{
                                color: 'var(--color-text-secondary)',
                                maxWidth: 600,
                                margin: '0 auto 2rem',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                            }}
                        >
                            {t.about.subtitle}
                        </p>

                        {/* Stats line */}
                        <p
                            style={{
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: 'var(--color-text-secondary)',
                                letterSpacing: '0.04em',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)' }}>
                                <FaCode size={14} /> {t.about.stats.years}
                            </span>
                            <span style={{ opacity: 0.4 }}>//</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-secondary)' }}>
                                <FaGlobeAmericas size={14} /> {t.about.stats.countries}
                            </span>
                            <span style={{ opacity: 0.4 }}>//</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)' }}>
                                <FaWifi size={14} /> {t.about.stats.remote}
                            </span>
                        </p>
                    </div>
                </AnimateOnScroll>

                {/* Content */}
                <AnimateOnScroll delay={0.15}>
                    <div
                        className="glass"
                        style={{
                            borderRadius: 12,
                            overflow: 'hidden',
                            marginBottom: '3rem',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        {/* Terminal title bar */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 16px',
                                borderBottom: '1px solid var(--color-border)',
                                background: 'rgba(0, 0, 0, 0.15)',
                            }}
                        >
                            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                            <span
                                style={{
                                    marginLeft: 8,
                                    fontFamily: '"JetBrains Mono", monospace',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-secondary)',
                                    opacity: 0.7,
                                }}
                            >
                                ~/about — profile.tsx
                            </span>
                        </div>
                        <div style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
                            <AboutContent />
                            <TechnicalExpertiseSection />
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* Experience Timeline */}
                <AnimateOnScroll delay={0.1}>
                    <ExperienceTimeline
                        experiences={experiences}
                        descriptions={t.about.experience_descriptions}
                        heading={t.about.experience_heading}
                    />
                </AnimateOnScroll>
            </div>
        </div>
    );
};

export default AboutSection;
