import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from './scrollState';
import { lerp } from './mathUtils';

const COUNT = 3000; // Reduced from 5000 for performance
const GLOBE_R = 2.0;
const PRIMARY = '#7fb069';
const SECONDARY = '#ff8a50';

function makeGlobe(buf: Float32Array) {
    for (let i = 0; i < COUNT; i++) {
        const phi = Math.acos(-1 + (2 * i) / COUNT);
        const theta = Math.sqrt(COUNT * Math.PI) * phi;
        buf[i * 3] = GLOBE_R * Math.cos(theta) * Math.sin(phi);
        buf[i * 3 + 1] = GLOBE_R * Math.sin(theta) * Math.sin(phi);
        buf[i * 3 + 2] = GLOBE_R * Math.cos(phi);
    }
}

function makeBrackets(buf: Float32Array) {
    const bracketPoints = (mirror: boolean): THREE.Vector3[] => {
        const pts: THREE.Vector3[] = [];
        const sign = mirror ? -1 : 1;
        const cx = sign * 2.2;
        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            const y = (t - 0.5) * 5;
            const bulge = Math.sin(t * Math.PI) * 0.8;
            pts.push(new THREE.Vector3(cx - sign * bulge, y, 0));
        }
        return pts;
    };
    const allPts = [...bracketPoints(false), ...bracketPoints(true)];
    for (let i = 0; i < COUNT; i++) {
        const pt = allPts[i % allPts.length];
        const spread = 0.15;
        buf[i * 3] = pt.x + (Math.random() - 0.5) * spread;
        buf[i * 3 + 1] = pt.y + (Math.random() - 0.5) * spread;
        buf[i * 3 + 2] = pt.z + (Math.random() - 0.5) * spread * 2;
    }
}

function makeCircuit(buf: Float32Array) {
    const cols = 6, rows = 4;
    const spacing = 1.2;
    const offsetX = -(cols - 1) * spacing / 2;
    const offsetY = -(rows - 1) * spacing / 2;

    // Build node positions
    const nodes: { x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            nodes.push({ x: offsetX + c * spacing, y: offsetY + r * spacing });
        }
    }

    // Build trace segments between adjacent nodes
    type Segment = { x1: number; y1: number; x2: number; y2: number };
    const segments: Segment[] = [];

    // Horizontal and vertical connections (random subset)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            // Right neighbor
            if (c < cols - 1 && Math.random() < 0.6) {
                segments.push({ x1: nodes[idx].x, y1: nodes[idx].y, x2: nodes[idx + 1].x, y2: nodes[idx + 1].y });
            }
            // Down neighbor
            if (r < rows - 1 && Math.random() < 0.6) {
                segments.push({ x1: nodes[idx].x, y1: nodes[idx].y, x2: nodes[idx + cols].x, y2: nodes[idx + cols].y });
            }
            // Diagonal connections (less frequent)
            if (c < cols - 1 && r < rows - 1 && Math.random() < 0.2) {
                segments.push({ x1: nodes[idx].x, y1: nodes[idx].y, x2: nodes[idx + cols + 1].x, y2: nodes[idx + cols + 1].y });
            }
            if (c > 0 && r < rows - 1 && Math.random() < 0.15) {
                segments.push({ x1: nodes[idx].x, y1: nodes[idx].y, x2: nodes[idx + cols - 1].x, y2: nodes[idx + cols - 1].y });
            }
        }
    }

    // Distribute particles: some on nodes, rest along trace segments
    const nodeParticles = Math.min(nodes.length * 12, Math.floor(COUNT * 0.1));
    let i = 0;

    // Place particles on nodes
    for (; i < nodeParticles && i < COUNT; i++) {
        const node = nodes[i % nodes.length];
        buf[i * 3] = node.x + (Math.random() - 0.5) * 0.1;
        buf[i * 3 + 1] = node.y + (Math.random() - 0.5) * 0.1;
        buf[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    // Place remaining particles along trace segments
    for (; i < COUNT; i++) {
        if (segments.length > 0) {
            const seg = segments[i % segments.length];
            const t = Math.random();
            buf[i * 3] = seg.x1 + (seg.x2 - seg.x1) * t + (Math.random() - 0.5) * 0.1;
            buf[i * 3 + 1] = seg.y1 + (seg.y2 - seg.y1) * t + (Math.random() - 0.5) * 0.1;
            buf[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        } else {
            // Fallback if no segments generated
            const node = nodes[i % nodes.length];
            buf[i * 3] = node.x + (Math.random() - 0.5) * 0.3;
            buf[i * 3 + 1] = node.y + (Math.random() - 0.5) * 0.3;
            buf[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        }
    }
}

function makeGrid(buf: Float32Array) {
    const cols = 8, rows = 6;
    const spacingX = 1.0, spacingY = 0.8;
    const offsetX = -(cols - 1) * spacingX / 2;
    const offsetY = -(rows - 1) * spacingY / 2;
    for (let i = 0; i < COUNT; i++) {
        const cellIdx = i % (cols * rows);
        buf[i * 3] = offsetX + (cellIdx % cols) * spacingX + (Math.random() - 0.5) * 0.6;
        buf[i * 3 + 1] = offsetY + Math.floor(cellIdx / cols) * spacingY + (Math.random() - 0.5) * 0.5;
        buf[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
}

function makeEnvelope(buf: Float32Array) {
    const w = 5.5, h = 3.5, hw = w / 2, hh = h / 2;
    for (let i = 0; i < COUNT; i++) {
        const t = Math.random();
        if (t < 0.4) {
            const edge = Math.floor(Math.random() * 4);
            const pos = Math.random();
            switch (edge) {
                case 0: buf[i * 3] = -hw + pos * w; buf[i * 3 + 1] = -hh; break;
                case 1: buf[i * 3] = -hw + pos * w; buf[i * 3 + 1] = hh; break;
                case 2: buf[i * 3] = -hw; buf[i * 3 + 1] = -hh + pos * h; break;
                case 3: buf[i * 3] = hw; buf[i * 3 + 1] = -hh + pos * h; break;
            }
        } else if (t < 0.7) {
            const side = Math.random() < 0.5;
            const pos = Math.random();
            buf[i * 3] = side ? lerp(-hw, 0, pos) : lerp(hw, 0, pos);
            buf[i * 3 + 1] = lerp(hh, 0, pos);
        } else {
            buf[i * 3] = (Math.random() - 0.5) * w * 0.9;
            buf[i * 3 + 1] = (Math.random() - 0.5) * h * 0.9;
        }
        buf[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
}

// Section-aware shape mapping: determines fromShape, toShape, blend from scrollState.sections
function getSectionShape(sections: { hero: number; about: number; projects: number; certifications: number; contact: number }): { fromShape: number; toShape: number; blend: number } {
    const { about, projects, certifications, contact } = sections;

    // Globe = hero, Brackets = about (first half), Circuit = about→projects,
    // Grid = projects, Envelope = contact

    // Certifications active (shares Grid shape with projects)
    if (certifications > 0.05) {
        return { fromShape: 3, toShape: 3, blend: 0 }; // Grid holds
    }

    // Contact active
    if (contact > 0.05) {
        if (contact < 0.25) {
            // Grid → Envelope transition
            const blend = contact / 0.25;
            return { fromShape: 3, toShape: 4, blend: blend * blend * (3 - 2 * blend) };
        }
        return { fromShape: 4, toShape: 4, blend: 0 }; // Envelope holds
    }

    // Projects active
    if (projects > 0.05) {
        if (projects < 0.2) {
            // Circuit → Grid transition
            const blend = projects / 0.2;
            return { fromShape: 2, toShape: 3, blend: blend * blend * (3 - 2 * blend) };
        }
        return { fromShape: 3, toShape: 3, blend: 0 }; // Grid holds
    }

    // About active
    if (about > 0.05) {
        if (about < 0.2) {
            // Globe → Brackets transition
            const blend = about / 0.2;
            return { fromShape: 0, toShape: 1, blend: blend * blend * (3 - 2 * blend) };
        }
        if (about > 0.7) {
            // Brackets → Circuit transition
            const blend = (about - 0.7) / 0.3;
            return { fromShape: 1, toShape: 2, blend: blend * blend * (3 - 2 * blend) };
        }
        return { fromShape: 1, toShape: 1, blend: 0 }; // Brackets holds
    }

    // Hero active (or default)
    return { fromShape: 0, toShape: 0, blend: 0 }; // Globe holds
}

const ParticleChoreo: React.FC = () => {
    const ref = useRef<THREE.Points>(null);
    const prevState = useRef({ fromShape: -1, toShape: -1, blend: -1 });
    const prevProgress = useRef(0);
    const smoothVelocity = useRef(0);

    const { geometry, shapes } = useMemo(() => {
        const positions = new Float32Array(COUNT * 3);
        const colors = new Float32Array(COUNT * 3);

        const globe = new Float32Array(COUNT * 3);
        const brackets = new Float32Array(COUNT * 3);
        const circuit = new Float32Array(COUNT * 3);
        const grid = new Float32Array(COUNT * 3);
        const envelope = new Float32Array(COUNT * 3);

        makeGlobe(globe);
        makeBrackets(brackets);
        makeCircuit(circuit);
        makeGrid(grid);
        makeEnvelope(envelope);

        positions.set(globe);

        // Pre-compute initial colors
        const pColor = new THREE.Color(PRIMARY);
        const sColor = new THREE.Color(SECONDARY);
        const tmp = new THREE.Color();
        for (let i = 0; i < COUNT; i++) {
            const f = Math.abs(globe[i * 3 + 1] / GLOBE_R);
            if (f < 0.3) {
                tmp.copy(sColor).lerp(pColor, f / 0.3);
            } else {
                tmp.copy(pColor);
            }
            colors[i * 3] = tmp.r;
            colors[i * 3 + 1] = tmp.g;
            colors[i * 3 + 2] = tmp.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        return { geometry: geo, shapes: [globe, brackets, circuit, grid, envelope] };
    }, []);

    // Pre-allocate color objects — never create THREE.Color in the loop
    const colorCache = useMemo(() => ({
        pColor: new THREE.Color(PRIMARY),
        sColor: new THREE.Color(SECONDARY),
        tmp: new THREE.Color(),
    }), []);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const p = scrollState.progress;
        const t = clock.getElapsedTime();
        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        const colors = ref.current.geometry.attributes.color.array as Float32Array;

        // Track scroll velocity for reactive wobble
        const rawVelocity = Math.abs(p - prevProgress.current);
        prevProgress.current = p;
        smoothVelocity.current = lerp(smoothVelocity.current, rawVelocity, 0.1);
        const velocityScale = Math.min(smoothVelocity.current * 150, 1);
        const wobbleMultiplier = lerp(0.5, 2.0, velocityScale);

        const { fromShape, toShape, blend } = getSectionShape(scrollState.sections);

        const from = shapes[fromShape];
        const to = shapes[toShape];
        const { pColor, sColor, tmp } = colorCache;

        // Only update colors when shape state changes meaningfully
        const shapeChanged = fromShape !== prevState.current.fromShape ||
            toShape !== prevState.current.toShape ||
            Math.abs(blend - prevState.current.blend) > 0.02;

        // Update positions
        const wobble = (0.03 + blend * 0.05) * wobbleMultiplier;
        for (let i = 0; i < COUNT; i++) {
            const i3 = i * 3;
            const fx = lerp(from[i3], to[i3], blend);
            const fy = lerp(from[i3 + 1], to[i3 + 1], blend);
            const fz = lerp(from[i3 + 2], to[i3 + 2], blend);
            positions[i3] = fx + Math.sin(t * 0.3 + i * 0.01) * wobble;
            positions[i3 + 1] = fy + Math.cos(t * 0.2 + i * 0.02) * wobble;
            positions[i3 + 2] = fz + Math.sin(t * 0.15 + i * 0.015) * wobble;
        }

        if (shapeChanged) {
            const shapeIdx = blend > 0.5 ? toShape : fromShape;
            const colorBlend = fromShape === toShape ? 0 : blend;
            for (let i = 0; i < COUNT; i++) {
                const i3 = i * 3;
                if (shapeIdx >= 2) {
                    const mixT = shapeIdx === 2 ? 0.3 : 0.5;
                    tmp.copy(pColor).lerp(sColor, mixT * (0.5 + colorBlend * 0.5));
                } else {
                    const f = Math.abs(from[i3 + 1] / GLOBE_R);
                    tmp.copy(f < 0.3 ? sColor : pColor);
                    if (f < 0.3) tmp.lerp(pColor, f / 0.3);
                }
                colors[i3] = tmp.r;
                colors[i3 + 1] = tmp.g;
                colors[i3 + 2] = tmp.b;
            }
            ref.current.geometry.attributes.color.needsUpdate = true;
            prevState.current = { fromShape, toShape, blend };
        }

        ref.current.geometry.attributes.position.needsUpdate = true;

        const mat = ref.current.material as THREE.PointsMaterial;
        const isEnvelope = toShape === 4 || fromShape === 4;
        if (isEnvelope) {
            const envelopeBlend = toShape === 4 ? blend : (1 - blend);
            mat.opacity = lerp(0.5, 0.7, envelopeBlend);
            mat.size = lerp(0.015, 0.022, envelopeBlend);
        } else {
            mat.opacity = blend > 0 ? lerp(0.5, 0.35, blend) : 0.5;
            mat.size = blend > 0 ? lerp(0.015, 0.018, blend) : 0.015;
        }
    });

    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial vertexColors size={0.015} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
        </points>
    );
};

export default ParticleChoreo;
