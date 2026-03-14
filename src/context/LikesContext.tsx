'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const LS_KEY = 'portfolio:liked';

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* unavailable */ }
}

interface LikesContextValue {
  count: number | null;
  liked: boolean;
  loading: boolean;
  pulse: boolean;
  handleLike: () => Promise<void>;
}

const LikesContext = createContext<LikesContextValue | null>(null);

export const LikesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    return () => { if (pulseTimer.current) clearTimeout(pulseTimer.current); };
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
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  };

  return (
    <LikesContext.Provider value={{ count, liked, loading, pulse, handleLike }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = (): LikesContextValue => {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error('useLikes must be used inside LikesProvider');
  return ctx;
};
