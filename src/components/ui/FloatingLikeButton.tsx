'use client';

import React, { useEffect, useState } from 'react';
import { useLikes } from '../../context/LikesContext';

const FloatingLikeButton: React.FC = () => {
  const { count, liked, loading, pulse, handleLike } = useLikes();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 300) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || loading || count === null}
      aria-label={liked ? 'You liked this portfolio' : 'Like this portfolio'}
      aria-pressed={liked}
      style={{
        position: 'fixed',
        right: '1.25rem',
        top: '50%',
        transform: `translateY(-50%) scale(${pulse ? 1.12 : 1})`,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.6rem 0.5rem',
        background: 'var(--color-bg-glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${liked ? 'var(--color-primary)' : 'var(--color-border, rgba(255,255,255,0.1))'}`,
        borderRadius: '2rem',
        cursor: liked || count === null ? 'default' : loading ? 'wait' : 'pointer',
        color: liked ? 'var(--color-primary)' : 'var(--color-text-muted)',
        transition: 'opacity 0.4s ease, transform 0.25s ease, border-color 0.25s ease, color 0.25s ease',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: '1.1rem', lineHeight: 1, transition: 'transform 0.25s ease', display: 'block', transform: pulse ? 'scale(1.35)' : 'scale(1)' }}>
        {liked ? '♥' : '♡'}
      </span>
      {count !== null && (
        <span className="mono" style={{ fontSize: '0.65rem', lineHeight: 1 }}>
          {count}
        </span>
      )}
    </button>
  );
};

export default FloatingLikeButton;
