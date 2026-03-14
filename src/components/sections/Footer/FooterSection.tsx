import React, { useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import siteConfig from '../../../config/site';
import { useI18n } from '../../../i18n';
import { AnimateOnScroll } from '../../utils/animations';
import LikeButton from './LikeButton';

const socialLinks = [
  { icon: FaGithub, label: 'GitHub', url: siteConfig.github },
  { icon: FaLinkedin, label: 'LinkedIn', url: siteConfig.linkedin },
  { icon: HiMail, label: 'Email', url: `mailto:${siteConfig.email}` },
];

const FooterSection: React.FC = () => {
  const { t } = useI18n();
  const [topHover, setTopHover] = useState(false);

  return (
    <footer
      id="footer"
      style={{
        position: 'relative',
        background: 'var(--color-bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '2rem 1.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {/* Top gradient border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
        }}
      />

      <AnimateOnScroll>
        {/* Terminal session ended */}
        <div
          className="mono"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem',
            marginBottom: '0.5rem',
          }}
        >
          <div>$ exit 0</div>
          <div>&gt; Session terminated. Thanks for scrolling.</div>
        </div>

        {/* Brand */}
        <span
          className="gradient-text mono"
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          bernardo.moschen
        </span>

        {/* Like button */}
        <LikeButton />

        {/* Social icons */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
          {socialLinks.map(({ icon: Icon, label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="social-icon-link"
              style={{ fontSize: '1.15rem' }}
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Back to top */}
        <div
          className="mono"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onMouseEnter={() => setTopHover(true)}
          onMouseLeave={() => setTopHover(false)}
          style={{
            cursor: 'pointer',
            color: topHover ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontSize: '0.8rem',
            marginTop: '0.75rem',
            transition: 'color 0.25s ease',
          }}
        >
          $ cd /home ↑
        </div>

        {/* Copyright */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.25rem 0.75rem',
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            opacity: 0.7,
            marginTop: '0.5rem',
          }}
        >
          <span>{t.footer.copyright}</span>
          <span>{t.footer.built_with}</span>
        </div>
      </AnimateOnScroll>
    </footer>
  );
};

export default FooterSection;
