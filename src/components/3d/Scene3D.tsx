import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { scrollState, mouseState } from './scrollState';
import CinematicCamera from './CinematicCamera';
import ParticleChoreo from './ParticleChoreo';
import { lerp } from './mathUtils';

// ─── Utilities ──────────────────────────────────────────────────
function latLngToVector3(lat: number, lng: number, r: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
    );
}

function createArc(a: THREE.Vector3, b: THREE.Vector3, alt: number) {
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(a.length() + alt);
    const cA = new THREE.Vector3().lerpVectors(a, mid, 0.5);
    cA.normalize().multiplyScalar(a.length() + alt * 0.8);
    const cB = new THREE.Vector3().lerpVectors(mid, b, 0.5);
    cB.normalize().multiplyScalar(a.length() + alt * 0.8);
    return new THREE.CubicBezierCurve3(a, cA, cB, b);
}

// ─── Constants ──────────────────────────────────────────────────
const PRIMARY = '#7fb069';
const SECONDARY = '#ff8a50';
// Darker, higher-contrast palette for light/warm backgrounds
const LIGHT_PRIMARY = '#0d7a5f';
const LIGHT_SECONDARY = '#c9530a';
const GLOBE_R = 2.0;

function getThemeColors() {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    return { isLight: light, p: light ? LIGHT_PRIMARY : PRIMARY, s: light ? LIGHT_SECONDARY : SECONDARY };
}

const locations = [
    { lat: -30.03, lng: -51.23, home: true },
    { lat: 45.50, lng: -73.57, home: false },
    { lat: -10.91, lng: -37.07, home: false },
];

// ─── Input Tracking ─────────────────────────────────────────────
const InputTracker: React.FC = () => {
    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            scrollState.target = max > 0 ? window.scrollY / max : 0;
        };
        const onMouse = (e: MouseEvent) => {
            mouseState.targetX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseState.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('mousemove', onMouse, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMouse);
        };
    }, []);

    useFrame(() => {
        scrollState.progress = lerp(scrollState.progress, scrollState.target, 0.04);
        mouseState.x = lerp(mouseState.x, mouseState.targetX, 0.05);
        mouseState.y = lerp(mouseState.y, mouseState.targetY, 0.05);
    });

    return null;
};

// ─── Globe Wireframe ────────────────────────────────────────────
const GlobeWireframe: React.FC = () => {
    const ref = useRef<THREE.Mesh>(null);
    const { size } = useThree();
    const segments = size.width < 768 ? 16 : 32;
    useFrame(() => {
        if (!ref.current) return;
        const fade = Math.max(0, 1 - scrollState.progress / 0.15);
        const { isLight, p } = getThemeColors();
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = (isLight ? 0.44 : 0.04) * fade;
        mat.color.set(p);
        ref.current.visible = fade > 0.01;
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[GLOBE_R - 0.01, segments, segments]} />
            <meshBasicMaterial color={PRIMARY} wireframe transparent opacity={0.04} />
        </mesh>
    );
};

// ─── Globe Atmosphere ───────────────────────────────────────────
const GlobeAtmosphere: React.FC = () => {
    const ref = useRef<THREE.Mesh>(null);
    const { size } = useThree();
    const segments = size.width < 768 ? 16 : 32;
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const fade = Math.max(0, 1 - scrollState.progress / 0.15);
        ref.current.visible = fade > 0.01;
        if (!ref.current.visible) return;
        const { isLight, p } = getThemeColors();
        const base = isLight ? 0.24 : 0.04;
        const swing = isLight ? 0.06 : 0.015;
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = (base + Math.sin(clock.getElapsedTime() * 0.4) * swing) * fade;
        mat.color.set(p);
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[GLOBE_R + 0.15, segments, segments]} />
            <meshBasicMaterial color={PRIMARY} transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>
    );
};

// ─── Traveling Light ────────────────────────────────────────────
const TravelingLight: React.FC<{ arc: THREE.CubicBezierCurve3; color: string; delay: number }> = ({
    arc, color, delay,
}) => {
    const dotRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const t = useRef(-delay);

    useFrame((_, delta) => {
        t.current += delta * 0.2;
        const prog = t.current % 3;
        const visible = prog >= 0 && prog <= 1 && scrollState.progress < 0.2;
        if (dotRef.current) {
            dotRef.current.visible = visible;
            if (visible) dotRef.current.position.copy(arc.getPoint(prog));
        }
        if (glowRef.current) {
            glowRef.current.visible = visible;
            if (visible) {
                glowRef.current.position.copy(arc.getPoint(prog));
                glowRef.current.scale.setScalar(1 + Math.sin(t.current * 8) * 0.3);
                const { isLight } = getThemeColors();
                (glowRef.current.material as THREE.MeshStandardMaterial).opacity = isLight ? 0.55 : 0.15;
            }
        }
    });

    return (
        <>
            <mesh ref={dotRef}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
            </mesh>
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.1, 6, 6]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.15} />
            </mesh>
        </>
    );
};

// ─── Connection Arcs ────────────────────────────────────────────
const Arcs: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    // Memoize arc data AND geometries
    const arcData = useMemo(() => {
        const home = latLngToVector3(locations[0].lat, locations[0].lng, GLOBE_R);
        return [
            { arc: createArc(home, latLngToVector3(locations[1].lat, locations[1].lng, GLOBE_R), 0.7), color: SECONDARY },
            { arc: createArc(home, latLngToVector3(locations[2].lat, locations[2].lng, GLOBE_R), 0.35), color: PRIMARY },
        ].map(d => {
            const geometry = new THREE.BufferGeometry().setFromPoints(d.arc.getPoints(60));
            const material = new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: 0.45 });
            return { ...d, line: new THREE.Line(geometry, material) };
        });
    }, []);

    useEffect(() => {
        return () => {
            arcData.forEach(d => {
                d.line.geometry.dispose();
                (d.line.material as THREE.Material).dispose();
            });
        };
    }, [arcData]);

    useFrame(() => {
        if (!groupRef.current) return;
        const fade = Math.max(0, 1 - scrollState.progress / 0.18);
        groupRef.current.visible = fade > 0.01;
        if (!groupRef.current.visible) return;
        const { isLight } = getThemeColors();
        arcData.forEach(d => {
            (d.line.material as THREE.LineBasicMaterial).opacity = (isLight ? 0.85 : 0.45) * fade;
        });
    });

    return (
        <group ref={groupRef}>
            {arcData.map((d, i) => (
                <group key={i}>
                    <primitive object={d.line} />
                    <TravelingLight arc={d.arc} color={d.color} delay={i * 1.5} />
                </group>
            ))}
        </group>
    );
};

// ─── Pulsing Markers ────────────────────────────────────────────
const PulsingMarker: React.FC<{ position: THREE.Vector3; color: string; size: number }> = ({
    position, color, size,
}) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2.5) * 0.3);
            const { isLight } = getThemeColors();
            (ref.current.material as THREE.MeshStandardMaterial).opacity = isLight ? 0.70 : 0.30;
        }
    });
    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.04 * size, 8, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
            </mesh>
            <mesh ref={ref}>
                <ringGeometry args={[0.06 * size, 0.09 * size, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

const Markers: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    const data = useMemo(() =>
        locations.map((l) => ({
            pos: latLngToVector3(l.lat, l.lng, GLOBE_R),
            color: l.home ? SECONDARY : PRIMARY,
            size: l.home ? 1.5 : 1,
        })), []);

    useFrame(() => {
        if (!groupRef.current) return;
        const fade = Math.max(0, 1 - scrollState.progress / 0.15);
        groupRef.current.visible = fade > 0.01;
    });

    return (
        <group ref={groupRef}>
            {data.map((m, i) => (
                <PulsingMarker key={i} position={m.pos} color={m.color} size={m.size} />
            ))}
        </group>
    );
};

// ─── Globe Group ────────────────────────────────────────────────
const Globe: React.FC = () => {
    const innerRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (!innerRef.current) return;
        const rotationFade = Math.max(0, 1 - scrollState.progress / 0.2);
        if (rotationFade > 0.01) {
            innerRef.current.rotation.y += delta * 0.05 * rotationFade;
        }
    });

    return (
        <group ref={innerRef} rotation={[0.15, -0.5, 0.05]}>
            <GlobeWireframe />
            <GlobeAtmosphere />
            <Arcs />
            <Markers />
        </group>
    );
};

// ─── Floating Geometric Shapes (reduced from 10 to 6) ──────────
interface ShapeData {
    type: 'torus' | 'icosahedron' | 'octahedron' | 'torusKnot' | 'dodecahedron';
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    speed: number;
    color: string;
    appearAt: number;
}

const shapes: ShapeData[] = [
    { type: 'torusKnot', position: [-3, 1.5, -2], rotation: [0.5, 0, 0], scale: 0.4, speed: 0.3, color: PRIMARY, appearAt: 0.08 },
    { type: 'icosahedron', position: [3.5, -1, -1], rotation: [0, 0.5, 0], scale: 0.5, speed: 0.2, color: SECONDARY, appearAt: 0.12 },
    { type: 'octahedron', position: [-2.5, -2, 1], rotation: [0.3, 0, 0.3], scale: 0.45, speed: 0.25, color: PRIMARY, appearAt: 0.18 },
    { type: 'torus', position: [2, 2, -3], rotation: [0, 0, 0.5], scale: 0.35, speed: 0.35, color: SECONDARY, appearAt: 0.15 },
    { type: 'dodecahedron', position: [-1, 3, -2], rotation: [0.2, 0.3, 0], scale: 0.3, speed: 0.28, color: PRIMARY, appearAt: 0.22 },
    { type: 'icosahedron', position: [-4, -1, -3], rotation: [0.4, 0, 0.2], scale: 0.35, speed: 0.22, color: SECONDARY, appearAt: 0.30 },
];

const FloatingShape: React.FC<{ data: ShapeData }> = ({ data }) => {
    const ref = useRef<THREE.Mesh>(null);
    const basePos = useMemo(() => new THREE.Vector3(...data.position), [data.position]);
    const prevProgress = useRef(0);
    const smoothVelocity = useRef(0);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const p = scrollState.progress;
        const t = clock.getElapsedTime();

        // Track scroll velocity for movement amplitude
        const rawVelocity = Math.abs(p - prevProgress.current);
        prevProgress.current = p;
        smoothVelocity.current = lerp(smoothVelocity.current, rawVelocity, 0.1);
        const velocityScale = Math.min(smoothVelocity.current * 150, 1);
        const movementMultiplier = lerp(1.0, 2.0, velocityScale);

        const fadeIn = Math.max(0, Math.min(1, (p - data.appearAt) / 0.08));
        const fadeOut = p > 0.9 ? Math.max(0, 1 - (p - 0.9) / 0.1) : 1;
        const opacity = fadeIn * fadeOut;

        ref.current.visible = opacity > 0.01;
        if (!ref.current.visible) return;

        const { isLight, p: pCol, s: sCol } = getThemeColors();
        const col = isLight ? (data.color === PRIMARY ? pCol : sCol) : data.color;
        const mat = ref.current.material as THREE.MeshStandardMaterial;
        mat.opacity = opacity * (isLight ? 0.55 : 0.12);
        mat.emissiveIntensity = opacity * (isLight ? 0.04 : 0.30);
        mat.color.set(col);
        mat.emissive.set(col);

        ref.current.position.x = basePos.x + Math.sin(t * data.speed + data.position[0]) * 0.3 * movementMultiplier + mouseState.x * 0.2;
        ref.current.position.y = basePos.y + Math.sin(t * data.speed * 0.7 + data.position[1]) * 0.4 * movementMultiplier + mouseState.y * 0.15;
        ref.current.position.z = basePos.z + Math.cos(t * data.speed * 0.5) * 0.2 * movementMultiplier;

        ref.current.rotation.x = data.rotation[0] + t * data.speed * 0.5;
        ref.current.rotation.y = data.rotation[1] + t * data.speed * 0.3;
        ref.current.rotation.z = data.rotation[2] + t * data.speed * 0.2;
    });

    const geometry = useMemo(() => {
        switch (data.type) {
            case 'torus': return <torusGeometry args={[1, 0.3, 12, 24]} />;
            case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
            case 'octahedron': return <octahedronGeometry args={[1, 0]} />;
            case 'torusKnot': return <torusKnotGeometry args={[0.8, 0.25, 48, 6]} />;
            case 'dodecahedron': return <dodecahedronGeometry args={[1, 0]} />;
        }
    }, [data.type]);

    return (
        <mesh ref={ref} scale={data.scale}>
            {geometry}
            <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.3} wireframe transparent opacity={0.12} />
        </mesh>
    );
};

const FloatingShapes: React.FC = () => (
    <group>
        {shapes.map((s, i) => <FloatingShape key={i} data={s} />)}
    </group>
);

// ─── Grid Plane ─────────────────────────────────────────────────
const GridPlane: React.FC = () => {
    const ref = useRef<THREE.GridHelper>(null);

    useFrame(() => {
        if (!ref.current) return;
        const p = scrollState.progress;
        const fadeIn = Math.max(0, Math.min(1, (p - 0.15) / 0.08));
        const fadeOut = p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.1) : 1;
        const opacity = fadeIn * fadeOut;

        ref.current.visible = opacity > 0.01;
        if (!ref.current.visible) return;
        const { isLight } = getThemeColors();
        (ref.current.material as THREE.Material).opacity = opacity * (isLight ? 0.32 : 0.06);
        ref.current.position.y = -3 + Math.sin(p * Math.PI) * 0.5;
    });

    return (
        <gridHelper
            ref={ref}
            args={[20, 20, PRIMARY, PRIMARY]}
            position={[0, -3, 0]}
            material-transparent
            material-opacity={0.06}
        />
    );
};

// ─── Energy Spiral ──────────────────────────────────────────────
const EnergyLines: React.FC = () => {
    const ref = useRef<THREE.Points>(null);
    const frameSkip = useRef(0);

    const geometry = useMemo(() => {
        const count = 60;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 4;
            const radius = 2 + Math.sin(i * 0.3) * 2;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (i / count - 0.5) * 6;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const p = scrollState.progress;
        const t = clock.getElapsedTime();

        const fadeIn = Math.max(0, Math.min(1, (p - 0.1) / 0.08));
        const fadeOut = p > 0.88 ? Math.max(0, 1 - (p - 0.88) / 0.1) : 1;
        const opacity = fadeIn * fadeOut;

        ref.current.visible = opacity > 0.01;
        if (!ref.current.visible) return;

        const { isLight, s } = getThemeColors();
        const eMat = ref.current.material as THREE.PointsMaterial;
        eMat.opacity = opacity * (isLight ? 0.72 : 0.30);
        eMat.color.set(s);

        frameSkip.current = (frameSkip.current + 1) % 2;
        if (frameSkip.current !== 0) return;

        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        const count = positions.length / 3;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 4 + t * 0.2;
            const radius = 2 + Math.sin(i * 0.3 + t * 0.5) * 2;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial color={SECONDARY} size={0.03} transparent opacity={0.3} sizeAttenuation depthWrite={false} />
        </points>
    );
};

// ─── Post-Processing ────────────────────────────────────────────
const PostProcessing: React.FC = () => {
    const { size } = useThree();
    const isMobile = size.width < 768;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // Bloom is designed for dark backgrounds — skip in light mode and on mobile
    if (isMobile || isLight) return null;

    return (
        <EffectComposer>
            <Bloom
                luminanceThreshold={0.3}
                luminanceSmoothing={0.9}
                intensity={0.5}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.4} />
        </EffectComposer>
    );
};

// ─── Error Boundary ─────────────────────────────────────────────
class Scene3DErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

// ─── Main Scene ─────────────────────────────────────────────────
const SceneContent: React.FC = () => {
    const { size } = useThree();
    const isMobile = size.width < 768;

    return (
        <Scene3DErrorBoundary>
            <InputTracker />
            <CinematicCamera />
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={0.2} color={PRIMARY} />
            <pointLight position={[-5, -3, 3]} intensity={0.15} color={SECONDARY} />
            <Globe />
            <ParticleChoreo />
            {!isMobile && <FloatingShapes />}
            <GridPlane />
            {!isMobile && <EnergyLines />}
            <PostProcessing />
        </Scene3DErrorBoundary>
    );
};

// ─── CSS 3D Globe (Brave / no-WebGL fallback) ───────────────────
interface CSSGlobeProps { isLight?: boolean }

const CSSGlobe: React.FC<CSSGlobeProps> = ({ isLight = false }) => {
    const [S, setS] = useState(typeof window !== 'undefined' ? Math.min(360, window.innerWidth - 32) : 360);
    useEffect(() => {
        const update = () => setS(Math.min(360, window.innerWidth - 32));
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);
    const R = S / 2;
    const meridians = 6;
    const latitudes = [-60, -30, 0, 30, 60];

    const pColor = isLight ? '13,122,95' : '127,176,105';
    const sColor = isLight ? '201,83,10' : '255,138,80';
    const dotColor = isLight ? '#c9530a' : SECONDARY;

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100dvh',
                zIndex: 1, pointerEvents: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            <style>{`
                @keyframes cssGlobeRotate {
                    from { transform: rotateX(14deg) rotateY(0deg); }
                    to   { transform: rotateX(14deg) rotateY(360deg); }
                }
                @keyframes cssGlobePulse {
                    0%, 100% { opacity: 0.55; }
                    50%      { opacity: 0.75; }
                }
            `}</style>

            {/* Atmosphere glow */}
            <div style={{
                position: 'absolute',
                width: S + 120, height: S + 120,
                borderRadius: '50%',
                background: isLight
                    ? `radial-gradient(circle, rgba(${pColor},0.36) 0%, rgba(${sColor},0.22) 45%, transparent 68%)`
                    : `radial-gradient(circle, rgba(${pColor},0.10) 0%, rgba(${sColor},0.04) 40%, transparent 68%)`,
                animation: 'cssGlobePulse 5s ease-in-out infinite',
            }} />

            {/* Perspective container */}
            <div style={{ perspective: `${S * 2.6}px`, width: S, height: S }}>
                {/* Rotating globe */}
                <div style={{
                    width: S, height: S,
                    transformStyle: 'preserve-3d',
                    animation: 'cssGlobeRotate 28s linear infinite',
                    position: 'relative',
                }}>
                    {/* Outer sphere */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        border: `1.5px solid rgba(${pColor}, ${isLight ? 0.80 : 0.3})`,
                    }} />

                    {/* Meridians */}
                    {Array.from({ length: meridians }, (_, i) => (
                        <div key={`m${i}`} style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '50%',
                            border: `1px solid rgba(${i === 1 ? sColor : pColor}, ${i === 0 ? (isLight ? 0.78 : 0.32) : (isLight ? 0.55 : 0.18)})`,
                            transform: `rotateY(${i * (180 / meridians)}deg)`,
                        }} />
                    ))}

                    {/* Latitude rings */}
                    {latitudes.map((lat, i) => {
                        const rad = lat * (Math.PI / 180);
                        const r = R * Math.cos(rad);
                        const y = -R * Math.sin(rad);
                        const isEquator = lat === 0;
                        return (
                            <div key={`l${i}`} style={{
                                position: 'absolute',
                                width: r * 2, height: r * 2,
                                left: '50%', top: '50%',
                                marginLeft: -r, marginTop: -r,
                                borderRadius: '50%',
                                border: `1px solid rgba(${pColor},${isEquator ? (isLight ? 0.80 : 0.38) : (isLight ? 0.55 : 0.2)})`,
                                transform: `rotateX(90deg) translateY(${y}px)`,
                            }} />
                        );
                    })}

                    {/* Location dot — home (Porto Alegre) */}
                    <div style={{
                        position: 'absolute',
                        width: 7, height: 7,
                        borderRadius: '50%',
                        background: dotColor,
                        boxShadow: `0 0 8px ${dotColor}`,
                        left: '54%', top: '60%',
                        transform: `translateZ(${R}px)`,
                    }} />
                </div>
            </div>
        </div>
    );
};

// ─── Outer Error Boundary (catches Canvas/WebGL init failures) ──
class WebGLErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error: Error) {
        console.warn('[Scene3D] WebGL initialization failed:', error.message);
    }
    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

// ─── Theme helper ────────────────────────────────────────────────
function useIsLight() {
    const [isLight, setIsLight] = useState(false);
    useEffect(() => {
        const check = () => setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
        check();
        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);
    return isLight;
}

// ─── Exported Component ─────────────────────────────────────────
type RenderMode = 'pending' | 'css-globe' | 'webgl' | 'none';

const Scene3DInner: React.FC = () => {
    const [mode, setMode] = useState<RenderMode>('pending');
    const [glReady, setGlReady] = useState(false);
    const isLight = useIsLight();

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setMode('none');
            return;
        }

        const nav = navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } };
        const braveCheck: Promise<boolean> = nav.brave?.isBrave?.().catch(() => false) ?? Promise.resolve(false);

        braveCheck.then(isBrave => {
            try {
                const canvas = document.createElement('canvas');
                const hasGL = !!(
                    canvas.getContext('webgl2') ||
                    (window.WebGLRenderingContext &&
                        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
                );
                // Brave with a working GPU gets the real WebGL scene.
                // Brave with no WebGL (broken/software GPU) gets the CSS globe.
                if (hasGL) {
                    setMode('webgl');
                } else {
                    setMode(isBrave ? 'css-globe' : 'none');
                }
            } catch {
                setMode(isBrave ? 'css-globe' : 'none');
            }
        });
    }, []);

    if (mode === 'none') return null;
    if (mode === 'pending' || mode === 'css-globe') return <CSSGlobe isLight={isLight} />;

    const antialias = window.devicePixelRatio <= 1;

    return (
        <>
            {/* CSS globe stays visible until WebGL first frame is rendered */}
            {!glReady && <CSSGlobe isLight={isLight} />}
            <div
                style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100vw', height: '100dvh',
                    zIndex: 1, pointerEvents: 'none',
                    opacity: glReady ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                }}
            >
                <Canvas
                    camera={{ position: [0, 0, 6], fov: 50 }}
                    style={{ background: 'transparent' }}
                    gl={{ antialias, alpha: true, powerPreference: 'default', preserveDrawingBuffer: false }}
                    dpr={[1, 1.5]}
                    onCreated={() => setGlReady(true)}
                >
                    <SceneContent />
                </Canvas>
            </div>
        </>
    );
};

const Scene3D: React.FC = () => (
    <WebGLErrorBoundary>
        <Scene3DInner />
    </WebGLErrorBoundary>
);

export default Scene3D;
