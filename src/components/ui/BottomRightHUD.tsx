'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLikes } from '../../context/LikesContext';
import { scrollToTop } from '../layout/Navigation/utils';

const BottomRightHUD: React.FC = () => {
  const { count, liked, loading, pulse, handleLike } = useLikes();
  const [showScroll, setShowScroll] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [scrollHovered, setScrollHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowScroll(y > 100);
      setShowLike(y > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (ny - 0.5) * -14, y: (nx - 0.5) * 14 });
    setSpotlight({ x: nx * 100, y: ny * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setSpotlight({ x: 50, y: 50 });
  }, []);

  const merged = showScroll && showLike;
  const visible = showScroll || showLike;

  return (
    <>
      <style>{`
        @keyframes hudFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes hudGlow {
          0%, 100% { box-shadow: 0 0 18px color-mix(in srgb, var(--color-primary) 35%, transparent), 0 16px 48px rgba(0,0,0,0.45); }
          50%       { box-shadow: 0 0 32px color-mix(in srgb, var(--color-primary) 55%, transparent), 0 0 16px color-mix(in srgb, var(--color-secondary) 20%, transparent), 0 16px 48px rgba(0,0,0,0.45); }
        }
        @keyframes heartBeat {
          0%   { transform: scale(1); }
          25%  { transform: scale(1.5); }
          50%  { transform: scale(1.2); }
          75%  { transform: scale(1.45); }
          100% { transform: scale(1); }
        }
        .hud-scroll-solo:hover {
          transform: translateY(-4px) scale(1.1) !important;
          box-shadow: 0 8px 28px color-mix(in srgb, var(--color-primary) 55%, transparent), 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        .hud-like-row:hover:not(:disabled) {
          background: color-mix(in srgb, var(--color-primary) 10%, transparent) !important;
        }
        .hud-scroll-row:hover {
          background: color-mix(in srgb, var(--color-secondary) 8%, transparent) !important;
          color: var(--color-secondary) !important;
        }
        .hud-scroll-row:hover svg {
          stroke: var(--color-secondary);
        }
      `}</style>

      {/* Float wrapper — animation here so it doesn't conflict with tilt transform below */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '1.5rem',
          zIndex: 1000,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          animation: merged ? 'hudFloat 4s ease-in-out infinite' : 'none',
        }}
      >
        {merged ? (
          /* ── MERGED: gradient-border + glass card with tilt + spotlight ── */
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              /* Gradient border via 1px padding + gradient background */
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              borderRadius: '1.15rem',
              padding: '1px',
              transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x !== 0 || tilt.y !== 0 ? 1.04 : 1})`,
              transition: 'transform 0.25s ease',
              animation: 'hudGlow 3.5s ease-in-out infinite',
            }}
          >
            {/* Actual glass card */}
            <div style={{
              background: 'var(--color-bg-glass)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              borderRadius: '1.05rem',
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Mouse-following spotlight overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '1.05rem',
                background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.07), transparent 65%)`,
                pointerEvents: 'none',
                transition: 'background 0.1s ease',
              }} />

              {/* Like row */}
              <button
                type="button"
                className="hud-like-row"
                onClick={handleLike}
                disabled={liked || loading || count === null}
                aria-label={liked ? 'You liked this portfolio' : 'Like this portfolio'}
                aria-pressed={liked}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.75rem 1.25rem',
                  width: '100%',
                  background: liked
                    ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 22%, transparent), color-mix(in srgb, var(--color-secondary) 12%, transparent))'
                    : 'transparent',
                  border: 'none',
                  cursor: liked || count === null ? 'default' : loading ? 'wait' : 'pointer',
                  color: liked ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  transition: 'background 0.3s ease, color 0.3s ease',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span style={{
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  display: 'block',
                  animation: pulse ? 'heartBeat 0.6s ease' : 'none',
                  filter: liked
                    ? 'drop-shadow(0 0 8px var(--color-primary))'
                    : 'none',
                  transition: 'filter 0.3s ease',
                }}>
                  {liked ? '♥' : '♡'}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    ...(liked ? {
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                    } : {
                      color: 'var(--color-text-muted)',
                    }),
                  }}
                >
                  {liked ? `${count} liked` : count !== null && count > 0 ? `${count}` : 'Like'}
                </span>
              </button>

              {/* Gradient divider */}
              <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                opacity: 0.4,
              }} />

              {/* Scroll row */}
              <button
                className="hud-scroll-row"
                onClick={scrollToTop}
                aria-label="Scroll back to top"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  transition: 'color 0.2s ease, background 0.2s ease',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                <span className="mono" style={{ fontSize: '0.73rem', fontWeight: 600 }}>top</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── SOLO scroll-to-top button ── */
          showScroll && (
            <button
              className="hud-scroll-solo"
              onClick={scrollToTop}
              onMouseEnter={() => setScrollHovered(true)}
              onMouseLeave={() => setScrollHovered(false)}
              aria-label="Scroll back to top"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
                boxShadow: scrollHovered
                  ? '0 8px 28px color-mix(in srgb, var(--color-primary) 55%, transparent), 0 4px 12px rgba(0,0,0,0.3)'
                  : '0 4px 20px color-mix(in srgb, var(--color-primary) 35%, transparent), 0 8px 25px rgba(0,0,0,0.2)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          )
        )}
      </div>
    </>
  );
};

export default BottomRightHUD;
