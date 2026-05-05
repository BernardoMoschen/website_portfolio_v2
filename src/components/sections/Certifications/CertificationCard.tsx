import React, { useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
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

const CATEGORY_EMOJI: Record<Certification['category'], string> = {
  degree:   '🎓',
  cloud:    '☁️',
  devops:   '⚙️',
  platform: '🔖',
  language: '💬',
  course:   '📜',
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

  const [popoverOpen, setPopoverOpen] = useState(false);

  const issuerLabel = (
    <span
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        wordBreak: 'break-word',
      }}
    >
      {cert.issuer}
    </span>
  );

  return (
    <TiltCard
      style={{
        height: '100%',
        borderRadius: 12,
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-glass)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Category accent bar (matches card top corners) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          background: `linear-gradient(90deg, ${color} 0%, ${color}66 60%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      {/* Header: badge + title + issuer */}
      <div style={{ padding: '1.5rem 1.5rem 1rem', display: 'flex', gap: '1rem' }}>
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
              width: 56,
              height: 56,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${color}33, ${color}11)`,
              border: `1.5px solid ${color}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 26,
            }}
          >
            {CATEGORY_EMOJI[cert.category]}
          </div>
        )}

        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
              marginBottom: '0.4rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '4rem',
            }}
          >
            {cert.title}
          </h3>

          {cert.issuerUrl ? (
            <div
              style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}
              onMouseEnter={() => setPopoverOpen(true)}
              onMouseLeave={() => setPopoverOpen(false)}
              onFocus={() => setPopoverOpen(true)}
              onBlur={() => setPopoverOpen(false)}
            >
              <a
                href={cert.issuerUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${cert.issuer} – ${t.certifications.visit_issuer}`}
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500,
                  lineHeight: 1.35,
                  display: 'inline-flex',
                  alignItems: 'flex-start',
                  gap: '0.4rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  minHeight: '2.2rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'var(--color-text-secondary)')
                }
              >
                {issuerLabel}
                <FaLinkedin
                  size={13}
                  style={{ flexShrink: 0, marginTop: 3, opacity: 0.7 }}
                />
              </a>

              {/* Hover popover */}
              {popoverOpen && (
                <div
                  role="tooltip"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    paddingTop: '0.5rem',
                    zIndex: 10,
                    width: 'max-content',
                    maxWidth: 280,
                    pointerEvents: 'auto',
                  }}
                >
                  <div
                    style={{
                      borderRadius: 10,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg-elevated, #1a1a1a)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                    }}
                  >
                    {/* Top accent strip */}
                    <div
                      aria-hidden
                      style={{
                        height: 2,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${color}, transparent)`,
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                      {cert.badgeUrl ? (
                        <img
                          src={cert.badgeUrl}
                          alt=""
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 6,
                            objectFit: 'contain',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          aria-hidden
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: `${color}22`,
                            border: `1px solid ${color}55`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            flexShrink: 0,
                          }}
                        >
                          {CATEGORY_EMOJI[cert.category]}
                        </div>
                      )}
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          lineHeight: 1.3,
                        }}
                      >
                        {cert.issuer}
                      </p>
                    </div>
                    <a
                      href={cert.issuerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.45rem 0.75rem',
                        borderRadius: 8,
                        background: '#0A66C2',
                        color: '#fff',
                        textDecoration: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      <FaLinkedin size={14} />
                      {t.certifications.visit_issuer}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                lineHeight: 1.35,
                minHeight: '2.2rem',
              }}
            >
              {issuerLabel}
            </p>
          )}
        </div>
      </div>

      {/* Meta chips: category + date */}
      <div
        style={{
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 600,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0.25rem 0.6rem',
            borderRadius: 999,
            background: `${color}1a`,
            border: `1px solid ${color}40`,
          }}
        >
          {t.certifications.categories[cert.category]}
        </span>
        <span
          style={{
            fontSize: '0.72rem',
            color: 'var(--color-text-secondary)',
            fontFamily: '"JetBrains Mono", monospace',
            opacity: 0.75,
            padding: '0.25rem 0.6rem',
            borderRadius: 999,
            border: '1px solid var(--color-border)',
          }}
        >
          {formatDate(cert.date)}
        </span>
      </div>

      {/* Action — pinned to bottom */}
      {target && (
        <div style={{ padding: '1rem 1.5rem 1.25rem', marginTop: 'auto' }}>
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
