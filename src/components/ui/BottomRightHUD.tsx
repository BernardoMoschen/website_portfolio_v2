'use client';

import React, { useState, useEffect } from 'react';
import { useLikes } from '../../context/LikesContext';
import { scrollToTop } from '../layout/Navigation/utils';
import { useIsMobile } from '../../hooks/useIsMobile';

const BottomRightHUD: React.FC = () => {
  const { count, liked, loading, pulse, handleLike } = useLikes();
  const [showScroll, setShowScroll] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [hoverLike, setHoverLike] = useState(false);
  const [hoverScroll, setHoverScroll] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowScroll(y > 100);
      setShowLike(y > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile-first sizing
  const likeSize = isMobile ? 44 : (hoverLike ? 76 : 66);
  const scrollSize = isMobile ? 36 : (hoverScroll ? 52 : 46);
  const edgeOffset = isMobile ? '0.75rem' : '1.75rem';
  const baseBottom = isMobile ? '0.75rem' : '2rem';
  const likeBottom = showScroll
    ? `calc(${isMobile ? '3.5rem' : '5.75rem'} + env(safe-area-inset-bottom, 0px))`
    : `calc(${baseBottom} + env(safe-area-inset-bottom, 0px))`;
  const scrollBottom = `calc(${baseBottom} + env(safe-area-inset-bottom, 0px))`;

  return (
    <>
      <style>{`
        @keyframes morphA {
          0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          20%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          40%  { border-radius: 50% 40% 60% 30% / 40% 70% 30% 60%; }
          60%  { border-radius: 40% 70% 30% 60% / 70% 30% 60% 40%; }
          80%  { border-radius: 70% 30% 50% 50% / 30% 70% 40% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes morphB {
          0%   { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          25%  { border-radius: 70% 30% 40% 60% / 60% 40% 50% 40%; }
          50%  { border-radius: 30% 70% 50% 50% / 50% 30% 70% 40%; }
          75%  { border-radius: 60% 40% 60% 40% / 30% 60% 40% 70%; }
          100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
        }
        @keyframes glowLike {
          0%, 100% {
            box-shadow:
              0 0 18px color-mix(in srgb, var(--color-primary) 45%, transparent),
              0 10px 32px rgba(0,0,0,0.45);
          }
          50% {
            box-shadow:
              0 0 32px color-mix(in srgb, var(--color-primary) 65%, transparent),
              0 0 14px color-mix(in srgb, var(--color-secondary) 35%, transparent),
              0 10px 32px rgba(0,0,0,0.45);
          }
        }
        @keyframes glowLikeMobile {
          0%, 100% {
            box-shadow:
              0 0 8px color-mix(in srgb, var(--color-primary) 30%, transparent),
              0 4px 12px rgba(0,0,0,0.3);
          }
          50% {
            box-shadow:
              0 0 14px color-mix(in srgb, var(--color-primary) 45%, transparent),
              0 4px 12px rgba(0,0,0,0.3);
          }
        }
        @keyframes glowScroll {
          0%, 100% {
            box-shadow:
              0 0 12px color-mix(in srgb, var(--color-secondary) 40%, transparent),
              0 6px 22px rgba(0,0,0,0.4);
          }
          50% {
            box-shadow:
              0 0 24px color-mix(in srgb, var(--color-secondary) 60%, transparent),
              0 6px 22px rgba(0,0,0,0.4);
          }
        }
        @keyframes glowScrollMobile {
          0%, 100% {
            box-shadow:
              0 0 6px color-mix(in srgb, var(--color-secondary) 25%, transparent),
              0 3px 10px rgba(0,0,0,0.25);
          }
          50% {
            box-shadow:
              0 0 10px color-mix(in srgb, var(--color-secondary) 40%, transparent),
              0 3px 10px rgba(0,0,0,0.25);
          }
        }
        @keyframes heartBurst {
          0%   { transform: scale(1); }
          30%  { transform: scale(2); }
          65%  { transform: scale(1.4); }
          100% { transform: scale(1); }
        }

        .blob-like {
          animation: morphA 7s ease-in-out infinite, glowLike 3.5s ease-in-out infinite;
        }
        .blob-like:hover:not(:disabled) {
          animation: morphA 2s ease-in-out infinite, glowLike 1.2s ease-in-out infinite;
        }
        .blob-scroll {
          animation: morphB 5.5s ease-in-out infinite, glowScroll 3s ease-in-out infinite;
        }
        .blob-scroll:hover {
          animation: morphB 1.8s ease-in-out infinite, glowScroll 1s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .blob-like {
            animation: morphA 7s ease-in-out infinite, glowLikeMobile 3.5s ease-in-out infinite;
          }
          .blob-scroll {
            animation: morphB 5.5s ease-in-out infinite, glowScrollMobile 3s ease-in-out infinite;
          }
        }
      `}</style>

      {/* ── Like blob ── */}
      <button
        type="button"
        className="blob-like"
        onClick={liked || loading || count === null ? undefined : handleLike}
        onMouseEnter={() => setHoverLike(true)}
        onMouseLeave={() => setHoverLike(false)}
        aria-label={liked ? 'You liked this portfolio' : 'Like this portfolio'}
        aria-pressed={liked}
        disabled={liked || loading || count === null}
        style={{
          position: 'fixed',
          bottom: likeBottom,
          right: edgeOffset,
          zIndex: 1000,
          width: likeSize,
          height: likeSize,
          background: liked
            ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
            : 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 55%, #000) 0%, color-mix(in srgb, var(--color-secondary) 55%, #000) 100%)',
          border: 'none',
          cursor: liked || count === null ? 'default' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          opacity: showLike ? 1 : 0,
          pointerEvents: showLike ? 'auto' : 'none',
          transform: showLike ? 'scale(1)' : 'scale(0.5)',
          transition: [
            'opacity 0.45s ease',
            'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            'bottom 0.4s ease',
            'width 0.3s ease',
            'height 0.3s ease',
            'background 0.4s ease',
          ].join(', '),
        }}
      >
        <span style={{
          fontSize: isMobile ? '0.9rem' : '1.25rem',
          lineHeight: 1,
          display: 'block',
          animation: pulse ? 'heartBurst 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
          filter: liked ? 'drop-shadow(0 0 7px rgba(255,255,255,0.85))' : 'none',
          transition: 'filter 0.3s ease',
        }}>
          {liked ? '♥' : '♡'}
        </span>
        {count !== null && (
          <span style={{
            fontSize: isMobile ? '0.5rem' : '0.6rem',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 700,
            marginTop: isMobile ? 2 : 4,
            opacity: 0.88,
            letterSpacing: '0.02em',
          }}>
            {count}
          </span>
        )}
      </button>

      {/* ── Scroll-to-top blob ── */}
      <button
        className="blob-scroll"
        onClick={scrollToTop}
        onMouseEnter={() => setHoverScroll(true)}
        onMouseLeave={() => setHoverScroll(false)}
        aria-label="Scroll to top"
        style={{
          position: 'fixed',
          bottom: scrollBottom,
          right: edgeOffset,
          zIndex: 1000,
          width: scrollSize,
          height: scrollSize,
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: isMobile ? '0.8rem' : '1rem',
          fontWeight: 700,
          opacity: showScroll ? 1 : 0,
          pointerEvents: showScroll ? 'auto' : 'none',
          transform: showScroll ? 'scale(1)' : 'scale(0.5) translateY(8px)',
          transition: [
            'opacity 0.45s ease',
            'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            'width 0.3s ease',
            'height 0.3s ease',
          ].join(', '),
        }}
      >
        ↑
      </button>
    </>
  );
};

export default BottomRightHUD;
