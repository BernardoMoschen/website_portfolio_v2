'use client';

import React, { useState, useEffect, useRef } from 'react';

const LS_KEY = 'portfolio:liked';

function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode, quota exceeded, etc.)
  }
}

const LikeButton: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLiked(lsGet(LS_KEY) === '1');

    fetch('/api/likes')
      .then((r) => r.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => setCount(0));

    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, []);

  const handleLike = async () => {
    if (liked || loading || count === null) return;
    setLoading(true);

    try {
      const res = await fetch('/api/likes', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setCount(data.count);
        setLiked(true);
        lsSet(LS_KEY, '1');
        setPulse(true);
        pulseTimer.current = setTimeout(() => setPulse(false), 600);
      } else if (res.status === 409) {
        setLiked(true);
        lsSet(LS_KEY, '1');
        if (data.count !== undefined) setCount(data.count);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

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
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: liked ? 'var(--color-primary)' : 'var(--color-text-muted)',
        cursor: liked || count === null ? 'default' : loading ? 'wait' : 'pointer',
        transition: 'color 0.25s ease',
        userSelect: 'none',
        transform: pulse ? 'scale(1.08)' : 'scale(1)',
        background: 'none',
        border: 'none',
        padding: 0,
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
