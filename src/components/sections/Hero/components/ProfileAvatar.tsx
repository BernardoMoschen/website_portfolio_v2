import React, { useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface ProfileAvatarProps {
  profileImage: string;
  name: string;
  size?: number;
}

interface Particle {
  id: number;
  angle: number;
  color: string;
  size: number;
  distance: number;
  duration: number;
  shape: 'circle' | 'square' | 'diamond';
  spin: number;
  delay: number;
}

const PARTICLE_COLORS = ['#7fb069', '#ff8a50', '#ffd700', '#a78bfa', '#34d399', '#fb923c', '#f472b6', '#60a5fa'];

function makeParticles(count = 16): Particle[] {
  const shapes: Particle['shape'][] = ['circle', 'square', 'diamond'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // spread evenly + small jitter so they don't all land in a ring
    angle: (i / count) * 360 + (Math.random() - 0.5) * 22,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    size: Math.random() * 7 + 5,
    distance: Math.random() * 60 + 50,
    duration: Math.random() * 280 + 520,
    shape: shapes[i % 3],
    spin: (Math.random() - 0.5) * 540,
    delay: Math.random() * 60,
  }));
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profileImage,
  name,
  size = 140,
}) => {
  const clicks = useRef(0);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Separate keys so the same animation can be re-triggered on repeat taps
  const [wiggleKey, setWiggleKey] = useState(0);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleClick = useCallback(() => {
    if (celebrating) return;

    clicks.current += 1;
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
    resetTimeout.current = setTimeout(() => { clicks.current = 0; }, 800);

    if (clicks.current >= 5) {
      clicks.current = 0;
      setParticles(makeParticles());
      setCelebrating(true);
      setCelebrateKey(k => k + 1);
      setShowMsg(true);
      setTimeout(() => setCelebrating(false), 900);
      setTimeout(() => {
        setShowMsg(false);
        setParticles([]);
      }, 2600);
    } else {
      // Each pre-celebration click: a quick charge wiggle
      setWiggleKey(k => k + 1);
    }
  }, [celebrating]);

  // Pre-compute particle geometry once per burst (memoized per particles array identity)
  const particleElements = useMemo(() => particles.map(p => {
    const rad = (p.angle * Math.PI) / 180;
    const tx = Math.cos(rad) * p.distance;
    const ty = Math.sin(rad) * p.distance;
    const borderRadius = p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '2px';
    const extraTransform = p.shape === 'diamond' ? 'rotate(45deg)' : '';

    return (
      <div
        key={p.id}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: p.size,
          height: p.size,
          borderRadius,
          background: p.color,
          pointerEvents: 'none',
          transform: `translate(-50%, -50%) ${extraTransform}`,
          animation: `particleFly ${p.duration}ms cubic-bezier(0.2, 0.8, 0.3, 1) ${p.delay}ms forwards`,
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          '--spin': `${p.spin}deg`,
          zIndex: 20,
        } as React.CSSProperties}
      />
    );
  }), [particles]);

  return (
    <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>

      {/* Confetti burst — rendered behind the avatar ring */}
      {particleElements}

      {/* Gradient ring + photo */}
      <div
        key={`spin-${celebrateKey}`}
        onClick={handleClick}
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          padding: 3,
          background: celebrating
            ? 'linear-gradient(135deg, #7fb069, #ffd700, #ff8a50, #a78bfa, #34d399, #7fb069)'
            : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          backgroundSize: celebrating ? '300% 300%' : '100% 100%',
          boxShadow: celebrating
            ? '0 0 50px rgba(127,176,105,0.5), 0 0 90px rgba(255,138,80,0.3)'
            : '0 0 40px rgba(var(--color-primary-rgb, 127, 176, 105), 0.25), 0 0 80px rgba(var(--color-primary-rgb, 127, 176, 105), 0.1)',
          cursor: 'pointer',
          animation: celebrating
            ? 'avatarCelebrate 0.85s ease forwards'
            : wiggleKey > 0 ? `avatarCharge 0.36s ease ${wiggleKey}` : undefined,
          zIndex: 1,
        }}
      >
        {/* Charge glow ring — grows per click count */}
        {wiggleKey > 0 && !celebrating && (
          <div
            key={wiggleKey}
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '2px solid var(--color-secondary)',
              opacity: 0,
              animation: 'chargeRing 0.36s ease forwards',
              pointerEvents: 'none',
            }}
          />
        )}

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--color-bg-glass, #111)',
          }}
        >
          <Image
            src={profileImage}
            alt={`${name} — Full Stack Engineer`}
            width={size}
            height={size}
            priority
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* Tooltip */}
      {showMsg && (
        <div
          style={{
            position: 'absolute',
            top: '108%',
            left: '50%',
            background: 'var(--color-bg-glass)',
            border: '1px solid var(--color-primary)',
            borderRadius: 8,
            padding: '6px 16px',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            color: 'var(--color-primary)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'tooltipBounce 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            backdropFilter: 'blur(12px)',
            zIndex: 30,
          }}
        >
          hey! 👋
        </div>
      )}

      <style>{`
        /* Spring-loaded elastic single rotation with wind-up */
        @keyframes avatarCelebrate {
          0%   { transform: scale(1)    rotate(0deg);   }
          14%  { transform: scale(1.24) rotate(-6deg);  }
          68%  { transform: scale(1.16) rotate(370deg); }
          82%  { transform: scale(1.07) rotate(353deg); }
          92%  { transform: scale(1.02) rotate(362deg); }
          100% { transform: scale(1)    rotate(360deg); }
        }

        /* Quick charge shake — tells the user "keep going" */
        @keyframes avatarCharge {
          0%, 100% { transform: rotate(0deg)  scale(1);    }
          20%      { transform: rotate(-10deg) scale(1.07); }
          45%      { transform: rotate(7deg)   scale(1.05); }
          65%      { transform: rotate(-4deg)  scale(1.02); }
          82%      { transform: rotate(2deg);               }
        }

        /* Outer ring pulse — orange flash on each charge click */
        @keyframes chargeRing {
          0%   { opacity: 0.9; transform: scale(0.92); }
          60%  { opacity: 0.5; transform: scale(1.08); }
          100% { opacity: 0;   transform: scale(1.18); }
        }

        /* Confetti particles — fly outward via CSS custom properties */
        @keyframes particleFly {
          0%   {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + var(--tx)),
              calc(-50% + var(--ty))
            ) scale(0.15) rotate(var(--spin));
          }
        }

        /* Tooltip — spring bounce in */
        @keyframes tooltipBounce {
          from { opacity: 0; transform: translateX(-50%) scale(0.6) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) scale(1)   translateY(0);   }
        }
      `}</style>
    </div>
  );
};

export default ProfileAvatar;
