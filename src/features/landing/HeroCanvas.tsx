import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Floating particle field that gently drifts and reacts to mouse
function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const { viewport } = useThree();

  const count = 1800;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  // Per-particle random offsets for varied motion
  const offsets = useMemo(() =>
    Array.from({ length: count }, () => Math.random() * Math.PI * 2),
  []);

  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const o = offsets[i];
      // Gentle vertical drift
      arr[i * 3 + 1] += Math.sin(t * 0.3 + o) * 0.0008;
      // Horizontal sway
      arr[i * 3 + 0] += Math.cos(t * 0.2 + o) * 0.0004;

      // Wrap particles that drift too far
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7;
      if (arr[i * 3 + 0] > 7) arr[i * 3 + 0] = -7;
      if (arr[i * 3 + 1] < -7) arr[i * 3 + 1] = 7;
      if (arr[i * 3 + 0] < -7) arr[i * 3 + 0] = 7;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // Mouse parallax tilt
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      mouse.y * 0.08,
      0.04
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      mouse.x * 0.08,
      0.04
    );
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#94a3b8"
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

// Slow-rotating topo ring
function TopoRing() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.getElapsedTime() * 0.04;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <torusGeometry args={[4.5, 0.008, 2, 180]} />
      <meshBasicMaterial color="#cbd5e1" transparent opacity={0.18} />
    </mesh>
  );
}

function TopoRing2() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = -clock.getElapsedTime() * 0.025;
    ref.current.rotation.y = Math.cos(clock.getElapsedTime() * 0.08) * 0.12;
  });
  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <torusGeometry args={[6, 0.006, 2, 220]} />
      <meshBasicMaterial color="#e2e8f0" transparent opacity={0.12} />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      dpr={[1, 1.5]}
    >
      <ParticleField />
      <TopoRing />
      <TopoRing2 />
    </Canvas>
  );
}
