import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, mouseState } from './scrollState';
import { lerp } from './mathUtils';

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface Waypoint {
    progress: number; // 0-1 global scroll
    position: THREE.Vector3;
    target: THREE.Vector3;
    fov: number;
}

const waypoints: Waypoint[] = [
    // Hero — close up on globe
    { progress: 0.0, position: new THREE.Vector3(0, 0, 6), target: new THREE.Vector3(0, 0, 0), fov: 50 },
    { progress: 0.08, position: new THREE.Vector3(0.3, 0.2, 5.5), target: new THREE.Vector3(0, 0, 0), fov: 50 },
    // Hero exit — pull back and rise
    { progress: 0.18, position: new THREE.Vector3(0.5, 1, 7), target: new THREE.Vector3(0, 0, -1), fov: 48 },
    // About — orbit to side view
    { progress: 0.3, position: new THREE.Vector3(2.5, 0.8, 6), target: new THREE.Vector3(0, 0, -2), fov: 45 },
    { progress: 0.42, position: new THREE.Vector3(1.5, 0.3, 7.5), target: new THREE.Vector3(-1, 0, -3), fov: 46 },
    // Projects — fly forward through space
    { progress: 0.52, position: new THREE.Vector3(-0.5, 0.5, 5), target: new THREE.Vector3(0, 0, -5), fov: 52 },
    { progress: 0.65, position: new THREE.Vector3(-1.5, 0, 3.5), target: new THREE.Vector3(0, -0.5, -6), fov: 55 },
    // Contact — descend
    { progress: 0.78, position: new THREE.Vector3(0, -0.5, 5.5), target: new THREE.Vector3(0, -2, -2), fov: 48 },
    { progress: 0.88, position: new THREE.Vector3(0, -1, 6.5), target: new THREE.Vector3(0, -2, 0), fov: 46 },
    // Footer — settle
    { progress: 1.0, position: new THREE.Vector3(0, -0.5, 7), target: new THREE.Vector3(0, -1, 0), fov: 45 },
];

// Pre-build CatmullRom curves for smooth interpolation
const positionCurve = new THREE.CatmullRomCurve3(
    waypoints.map(w => w.position),
    false,
    'catmullrom',
    0.3,
);

const targetCurve = new THREE.CatmullRomCurve3(
    waypoints.map(w => w.target),
    false,
    'catmullrom',
    0.3,
);

// Cache last segment index — scroll moves gradually so it's almost always the same segment
let _lastSegment = 0;

function findSegment(progress: number): number {
    const n = waypoints.length - 1;
    // Check cached segment first (hot path)
    if (_lastSegment < n && progress >= waypoints[_lastSegment].progress && progress <= waypoints[_lastSegment + 1].progress) {
        return _lastSegment;
    }
    // Check next segment (scrolling forward)
    if (_lastSegment + 1 < n && progress >= waypoints[_lastSegment + 1].progress && progress <= waypoints[_lastSegment + 2].progress) {
        _lastSegment = _lastSegment + 1;
        return _lastSegment;
    }
    // Fallback: linear scan
    for (let i = 0; i < n; i++) {
        if (progress >= waypoints[i].progress && progress <= waypoints[i + 1].progress) {
            _lastSegment = i;
            return i;
        }
    }
    return progress >= 1 ? n - 1 : 0;
}

const _invSegCount = 1 / (waypoints.length - 1);

function getProgressOnCurve(progress: number): number {
    const i = findSegment(progress);
    const start = waypoints[i].progress;
    const end = waypoints[i + 1].progress;
    const localT = (progress - start) / (end - start);
    const easedT = easeInOutCubic(localT);
    const segmentStart = i * _invSegCount;
    return segmentStart + easedT * _invSegCount;
}

function getFov(progress: number): number {
    const i = findSegment(progress);
    const t = (progress - waypoints[i].progress) / (waypoints[i + 1].progress - waypoints[i].progress);
    return lerp(waypoints[i].fov, waypoints[i + 1].fov, easeInOutCubic(t));
}

const _pos = new THREE.Vector3();
const _target = new THREE.Vector3();
const _smoothPos = new THREE.Vector3(0, 0, 6); // Snapped to actual position on first frame
const _smoothTarget = new THREE.Vector3(0, 0, 0);
let _initialized = false;

const CinematicCamera: React.FC = () => {
    const { size } = useThree();
    // On narrow screens, push camera back so the globe is fully visible
    const mobileZOffset = size.width < 768 ? 3.5 : 0;

    useFrame(({ camera, clock }) => {
        const p = scrollState.progress;
        const mx = mouseState.x;
        const my = mouseState.y;

        const curveT = getProgressOnCurve(p);
        positionCurve.getPoint(curveT, _pos);
        targetCurve.getPoint(curveT, _target);

        // Pull camera back on mobile so the full globe is visible
        _pos.z += mobileZOffset;

        // Add mouse parallax offset
        _pos.x += mx * 0.6;
        _pos.y += my * 0.4;

        // On first frame, snap to position (no lerp from origin)
        if (!_initialized) {
            _smoothPos.copy(_pos);
            _smoothTarget.copy(_target);
            _initialized = true;
        } else {
            _smoothPos.lerp(_pos, 0.06);
            _smoothTarget.lerp(_target, 0.06);
        }

        // Idle breathing — scale down when actively scrolling
        const scrollDelta = Math.abs(scrollState.target - scrollState.progress);
        const idleFactor = 1 - Math.min(1, scrollDelta * 20);
        const elapsed = clock.getElapsedTime();

        _smoothPos.y += Math.sin(elapsed * 0.3) * 0.04 * idleFactor;
        _smoothTarget.x += Math.sin(elapsed * 0.2) * 0.02 * idleFactor;

        camera.position.copy(_smoothPos);
        camera.lookAt(_smoothTarget);

        // FOV animation — only update projection matrix when FOV changes meaningfully
        const targetFov = getFov(p);
        const cam = camera as THREE.PerspectiveCamera;
        const newFov = lerp(cam.fov, targetFov, 0.04);
        if (Math.abs(newFov - cam.fov) > 0.01) {
            cam.fov = newFov;
            cam.updateProjectionMatrix();
        }
    });

    return null;
};

export default CinematicCamera;
