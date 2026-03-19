import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { HiChevronDown } from 'react-icons/hi2';
import { siteConfig } from '../../../config/site';
import ProfileAvatar from './components/ProfileAvatar';
import { scrollToSection } from './utils';
import { useI18n } from '../../../i18n';

function useTypingEffect(text: string, startDelay: number, charDelay = 40) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion.current) {
      setDisplayText(text);
      return;
    }

    const startTimer = setTimeout(() => {
      setShowCursor(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayText(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          // Cursor blinks for 2s then disappears
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, charDelay);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, startDelay, charDelay]);

  return { displayText, showCursor };
}

const HeroSection: React.FC = () => {
  const { t } = useI18n();
  const titleText = `{ ${t.hero.title} }`;
  const { displayText, showCursor } = useTypingEffect(titleText, 600, 40);

  const heroRef = useRef<HTMLDivElement>(null);
  const plasmaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const heroEl = heroRef.current;
      const plasmaEl = plasmaRef.current;
      if (!heroEl || !plasmaEl) return;
      const rect = heroEl.getBoundingClientRect();
      const x = e.clientX - rect.left - 240;
      const y = e.clientY - rect.top - 210;
      plasmaEl.style.opacity = '0.28';
      plasmaEl.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={heroRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '5rem 1.5rem 6rem',
      }}
    >
      {/* Bottom gradient fade to smooth globe-to-background transition */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, var(--color-bg))',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Cursor-following plasma orb */}
      <style>{`
        @keyframes plasmaMorph {
          0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          20%     { border-radius: 40% 60% 55% 45% / 50% 40% 60% 50%; }
          40%     { border-radius: 70% 30% 45% 55% / 30% 65% 35% 70%; }
          60%     { border-radius: 45% 55% 65% 35% / 55% 45% 55% 45%; }
          80%     { border-radius: 30% 70% 55% 45% / 65% 35% 70% 30%; }
        }
      `}</style>
      <div
        ref={plasmaRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 480,
          height: 420,
          left: 0,
          top: 0,
          opacity: 0,
          transform: 'translate(-240px, -210px)',
          transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease',
          background: 'radial-gradient(ellipse at 40% 45%, var(--color-secondary), var(--color-primary) 45%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'plasmaMorph 9s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Main content — centered vertically */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          maxWidth: '64rem',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ProfileAvatar
            profileImage={siteConfig.profileImage}
            name={siteConfig.name}
          />
        </motion.div>

        {/* Name — dramatic oversized */}
        <motion.h1
          className="gradient-text"
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            margin: 0,
          }}
        >
          {siteConfig.name.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i === 0 ? 0.2 : 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ display: 'block' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Title — mono, gradient, typing effect */}
        <p
          className="mono gradient-text"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.35rem)',
            fontWeight: 500,
            margin: 0,
            letterSpacing: '-0.01em',
            minHeight: '1.5em',
          }}
        >
          {displayText}
          {showCursor && (
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '1.1em',
                backgroundColor: 'var(--color-primary)',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'blink-cursor 0.6s step-end infinite',
              }}
            />
          )}
          <style>{`@keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
        </p>

        {/* Location tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="tag" style={{ fontSize: '0.8rem' }}>
            {t.hero.location}
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => scrollToSection('projects')}
          >
            {t.hero.cta_projects}
          </button>
          <a
            className="btn btn-outline"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.hero.cta_resume}
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="social-icon-link"
          >
            <FaGithub size={18} />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="social-icon-link"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Email"
            className="social-icon-link"
          >
            <HiMail size={20} />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator — bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        onClick={() => scrollToSection('about')}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: '0.65rem',
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {t.hero.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: 'var(--color-primary)', filter: 'drop-shadow(0 0 8px var(--color-primary))' }}
        >
          <HiChevronDown size={24} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
