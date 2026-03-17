import React from 'react';
import TiltCard from '../../utils/TiltCard';
import { useI18n } from '../../../i18n';
import type { Certification } from '../../data/certificationsData';

const CATEGORY_COLORS: Record<Certification['category'], string> = {
  cloud:    'var(--color-primary)',
  devops:   'var(--color-secondary)',
  language: '#8b5cf6',
  platform: '#0ea5e9',
  degree:   '#f59e0b',
  course:   '#10b981',
};

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

interface Props {
  cert: Certification;
}

const CertificationCard: React.FC<Props> = ({ cert }) => {
  const { t } = useI18n();
  const color = CATEGORY_COLORS[cert.category];
  const target = cert.credentialUrl ?? cert.fileUrl;

  return (
    <TiltCard
      style={{
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-glass)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        cursor: target ? 'pointer' : 'default',
      }}
    >
      {/* Badge / logo area */}
      <div
        style={{
          padding: '1.5rem 1.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {cert.badgeUrl ? (
          <img
            src={cert.badgeUrl}
            alt={`${cert.issuer} logo`}
            style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 8, flexShrink: 0 }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: `${color}22`,
              border: `1.5px solid ${color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 22,
            }}
          >
            {cert.category === 'degree'   ? '🎓'
            : cert.category === 'cloud'   ? '☁️'
            : cert.category === 'devops'  ? '⚙️'
            : cert.category === 'platform' ? '🔖'
            : cert.category === 'language' ? '💬'
            :                               '📜'}
          </div>
        )}

        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: '0.72rem',
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
              color,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.2rem',
            }}
          >
            {cert.category}
          </p>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {cert.issuer}
          </p>
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '0 1.5rem', flex: 1 }}>
        <h3
          style={{
            fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
          }}
        >
          {cert.title}
        </h3>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-text-secondary)',
            fontFamily: '"JetBrains Mono", monospace',
            opacity: 0.75,
          }}
        >
          {formatDate(cert.date)}
        </p>
      </div>

      {/* Action */}
      {target && (
        <div style={{ padding: '1rem 1.5rem 1.25rem' }}>
          <button
            onClick={() => window.open(target, '_blank', 'noopener,noreferrer')}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', width: '100%' }}
          >
            {t.certifications.view_credential}
          </button>
        </div>
      )}
    </TiltCard>
  );
};

export default CertificationCard;
