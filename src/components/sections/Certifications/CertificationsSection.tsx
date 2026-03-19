import React, { useState } from 'react';
import { certifications } from '../../data/certificationsData';
import type { Certification } from '../../data/certificationsData';
import CertificationCard from './CertificationCard';
import { StaggerContainer, StaggerItem, AnimateOnScroll } from '../../utils/animations';
import SectionAnchor from '../../utils/SectionAnchor';
import { useI18n } from '../../../i18n';

type CategoryFilter = 'all' | Certification['category'];

const CertificationsSection: React.FC = () => {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const presentCategories = Array.from(
    new Set(certifications.map((c) => c.category))
  ) as Certification['category'][];

  const showFilters = presentCategories.length > 2;

  const filtered =
    activeFilter === 'all'
      ? certifications
      : certifications.filter((c) => c.category === activeFilter);

  const isEmpty = certifications.length === 0;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        paddingTop: 'calc(72px + clamp(1rem, 2vw, 2rem))',
        paddingBottom: 'clamp(2rem, 4vw, 3rem)',
        background: 'var(--color-bg-glass)',
        backdropFilter: 'blur(16px)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <AnimateOnScroll>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
                {t.certifications.heading}
              </h2>
              <SectionAnchor sectionId="certifications" />
            </div>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                maxWidth: 520,
                margin: '0 auto',
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              }}
            >
              {t.certifications.subtitle}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Category filter tabs */}
        {showFilters && (
          <AnimateOnScroll delay={0.1}>
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: '2.5rem',
              }}
            >
              {(['all', ...presentCategories] as CategoryFilter[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: 999,
                    border: '1px solid var(--color-border)',
                    background: activeFilter === cat ? 'var(--color-primary)' : 'transparent',
                    color: activeFilter === cat ? '#fff' : 'var(--color-text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    fontFamily: '"JetBrains Mono", monospace',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s, border-color 0.2s',
                    textTransform: 'capitalize',
                  }}
                >
                  {t.certifications.categories[cat]}
                </button>
              ))}
            </div>
          </AnimateOnScroll>
        )}

        {/* Empty state */}
        {isEmpty && (
          <AnimateOnScroll delay={0.15}>
            <div
              className="glass"
              style={{
                borderRadius: 12,
                padding: '3rem',
                textAlign: 'center',
                border: '1px solid var(--color-border)',
              }}
            >
              <p
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  opacity: 0.7,
                }}
              >
                // certifications coming soon
              </p>
            </div>
          </AnimateOnScroll>
        )}

        {/* Cards grid */}
        {!isEmpty && (
          <StaggerContainer
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
              gap: '1.25rem',
            }}
          >
            {filtered.map((cert) => (
              <StaggerItem key={cert.id} style={{ height: '100%' }}>
                <CertificationCard cert={cert} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
};

export default CertificationsSection;
