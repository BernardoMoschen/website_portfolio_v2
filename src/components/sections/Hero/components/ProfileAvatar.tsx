import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
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

// Each ring lives in a different 3D plane (rotateX + rotateY defines the orbital tilt)
const RING_CONFIGS = [
  { rotateX: 70, rotateY:   0, color: '#7fb069', duration: 3.2 },
  { rotateX: 16, rotateY:  68, color: '#ff8a50', duration: 4.1 },
  { rotateX: 46, rotateY:  38, color: '#a78bfa', duration: 2.5 },
  { rotateX: 60, rotateY: -52, color: '#34d399', duration: 5.2 },
] as const;

const PARTICLE_COLORS = ['#7fb069', '#ff8a50', '#ffd700', '#a78bfa', '#34d399', '#fb923c', '#f472b6', '#60a5fa'];

function makeParticles(count = 18): Particle[] {
  const shapes: Particle['shape'][] = ['circle', 'square', 'diamond'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * 360 + (Math.random() - 0.5) * 20,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    size: Math.random() * 7 + 5,
    distance: Math.random() * 70 + 55,
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
  const celebrationTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [chargeKey, setChargeKey] = useState(0);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [visibleRings, setVisibleRings] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleClick = useCallback(() => {
    if (celebrating) return;

    clicks.current += 1;
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
    // Reset if they go idle — rings fade, counter restarts
    resetTimeout.current = setTimeout(() => {
      clicks.current = 0;
      setVisibleRings(0);
    }, 1400);

    if (clicks.current >= 5) {
      clicks.current = 0;
      setParticles(makeParticles());
      setCelebrating(true);
      setCelebrateKey(k => k + 1);
      setChargeKey(0);
      setShowMsg(true);
      setVisibleRings(4);
      celebrationTimeouts.current.push(
        setTimeout(() => setCelebrating(false), 950),
        setTimeout(() => {
          setShowMsg(false);
          setParticles([]);
          setVisibleRings(0);
        }, 2800),
      );
    } else {
      setVisibleRings(clicks.current);
      setChargeKey(k => k + 1);
    }
  }, [celebrating]);

  useEffect(() => {
    return () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
      celebrationTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  // Ring dimensions — slightly larger than avatar
  const ringSize = size + 32;
  const dotSize = 7;
  const dotHalf = dotSize / 2;

  const particleElements = useMemo(() => particles.map(p => {
    const rad = (p.angle * Math.PI) / 180;
    const tx = Math.cos(rad) * p.distance;
    const ty = Math.sin(rad) * p.distance;
    const borderRadius = p.shape === 'circle' ? '50%' : '2px';
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
    <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none', perspective: '520px' }}>

      {/* Orbital rings — appear one per charge click, each in a different 3D plane */}
      {RING_CONFIGS.map((ring, i) => {
        if (i >= visibleRings) return null;
        // Orbit faster during celebration
        const orbitDuration = celebrating ? ring.duration * 0.28 : ring.duration;

        return (
          // Outer div: sets the 3D orbital plane (static tilt, no animation conflict)
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: ringSize,
              height: ringSize,
              marginLeft: -ringSize / 2,
              marginTop: -ringSize / 2,
              transform: `rotateX(${ring.rotateX}deg) rotateY(${ring.rotateY}deg)`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {/* Inner div: handles fade-in entrance — isolated from the plane transform */}
            <div style={{
              position: 'absolute',
              inset: 0,
              animation: `ringAppear 0.5s ${i * 70}ms cubic-bezier(0.34, 1.56, 0.64, 1) both`,
            }}>
              {/* The elliptical ring border */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `1.5px solid ${ring.color}`,
                opacity: celebrating ? 0.85 : 0.5,
                boxShadow: celebrating
                  ? `0 0 14px ${ring.color}90, 0 0 5px ${ring.color}70`
                  : `0 0 7px ${ring.color}50`,
                transition: 'opacity 0.3s, box-shadow 0.3s',
              }} />

              {/* Glowing dot that orbits along the ring */}
              {/* transform-origin points at the ring center from the dot's frame */}
              <div
                key={celebrating ? `fast-${i}` : `normal-${i}`}
                style={{
                  position: 'absolute',
                  top: -dotHalf,
                  left: '50%',
                  marginLeft: -dotHalf,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: '50%',
                  background: ring.color,
                  boxShadow: `0 0 10px ${ring.color}, 0 0 4px ${ring.color}`,
                  transformOrigin: `${dotHalf}px ${ringSize / 2 + dotHalf}px`,
                  animation: `dotOrbit ${orbitDuration}s linear infinite`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Confetti burst */}
      {particleElements}

      {/* Avatar gradient ring + photo */}
      <div
        key={`avatar-${celebrateKey}-${chargeKey}`}
        role="button"
        tabIndex={0}
        aria-label="Click to interact with avatar"
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
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
            ? '0 0 50px rgba(127,176,105,0.55), 0 0 90px rgba(255,138,80,0.3)'
            : visibleRings > 0
              ? '0 0 36px rgba(127,176,105,0.40), 0 0 72px rgba(127,176,105,0.16)'
              : '0 0 40px rgba(var(--color-primary-rgb, 127, 176, 105), 0.25), 0 0 80px rgba(var(--color-primary-rgb, 127, 176, 105), 0.1)',
          cursor: 'pointer',
          // Celebration: 3D coin-flip on Y axis. Charge: 3D tilt (not flat wiggle)
          animation: celebrating
            ? 'avatarFlip 0.92s ease forwards'
            : chargeKey > 0 ? 'avatarTilt 0.40s ease' : undefined,
          zIndex: 1,
        }}
      >
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
        /* 3D Y-axis coin-flip — wind-up then smooth landing */
        @keyframes avatarFlip {
          0%   { transform: perspective(520px) rotateY(0deg)   scale(1);    }
          12%  { transform: perspective(520px) rotateY(-22deg) scale(1.20); }
          65%  { transform: perspective(520px) rotateY(192deg) scale(1.10); }
          100% { transform: perspective(520px) rotateY(360deg) scale(1);    }
        }

        /* 3D tilt on each charge click — feels like it's about to flip */
        @keyframes avatarTilt {
          0%   { transform: perspective(520px) rotateY(0deg)   scale(1);    }
          35%  { transform: perspective(520px) rotateY(-28deg) scale(1.08); }
          100% { transform: perspective(520px) rotateY(0deg)   scale(1);    }
        }

        /* Orbiting dot rotates around the ring center */
        @keyframes dotOrbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Ring entrance — fade + slight scale pop, no transform conflict with parent tilt */
        @keyframes ringAppear {
          from { opacity: 0; transform: scale(0.55); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* Confetti particles fly outward via CSS custom properties */
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

        /* Tooltip spring bounce in */
        @keyframes tooltipBounce {
          from { opacity: 0; transform: translateX(-50%) scale(0.6) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) scale(1)   translateY(0);   }
        }
      `}</style>
    </div>
  );
};

export default ProfileAvatar;
