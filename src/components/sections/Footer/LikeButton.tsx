'use client';

import React from 'react';
import { useLikes } from '../../../context/LikesContext';

const LikeButton: React.FC = () => {
  const { count, liked, loading, pulse, handleLike } = useLikes();

  return (
    <button
      type="button"
      className="mono"
      onClick={handleLike}
      disabled={liked || loading || count === null}
      aria-label={liked ? 'You liked this portfolio' : 'Like this portfolio'}
      aria-pressed={liked}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: liked ? 'var(--color-primary)' : 'var(--color-text-muted)',
        cursor: liked || count === null ? 'default' : loading ? 'wait' : 'pointer',
        transition: 'color 0.25s ease, transform 0.25s ease',
        userSelect: 'none',
        transform: pulse ? 'scale(1.08)' : 'scale(1)',
        background: 'none',
        border: 'none',
        padding: '0.4rem 0.75rem',
        margin: '0 auto',
      }}
    >
      <span
        style={{
          fontSize: '1rem',
          transition: 'transform 0.25s ease',
          display: 'inline-block',
          transform: pulse ? 'scale(1.3)' : 'scale(1)',
        }}
      >
        {liked ? '♥' : '♡'}
      </span>
      <span>
        {count === null
          ? '$ send --appreciation'
          : liked
            ? `${count} liked this`
            : `${count} people liked this`}
      </span>
    </button>
  );
};

export default LikeButton;
