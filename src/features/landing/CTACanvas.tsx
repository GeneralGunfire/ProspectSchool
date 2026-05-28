import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Glowing orb cluster for the dark CTA section
function Orbs() {
  const group = useRef<THREE.Group>(null!);

  const orbs = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        -2 - Math.random() * 3,
      ] as [number, number, number],
      scale: 0.4 + Math.random() * 1.2,
      speed: 0.3 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    })),
  []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const o = orbs[i];
      child.position.y = o.pos[1] + Math.sin(t * o.speed + o.phase) * 0.6;
      child.position.x = o.pos[0] + Math.cos(t * o.speed * 0.7 + o.phase) * 0.4;
    });
  });

  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i} position={o.pos} scale={o.scale}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#1e293b" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

// Slow-spinning ring inside dark CTA
function GlowRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.getElapsedTime() * 0.06;
    ref.current.rotation.x = 0.6 + Math.sin(clock.getElapsedTime() * 0.15) * 0.1;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[3.5, 0.012, 2, 160]} />
      <meshBasicMaterial color="#334155" transparent opacity={0.4} />
    </mesh>
  );
}

function GlowRing2() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = -clock.getElapsedTime() * 0.04;
    ref.current.rotation.y = 0.4 + Math.cos(clock.getElapsedTime() * 0.12) * 0.15;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[5, 0.006, 2, 200]} />
      <meshBasicMaterial color="#1e293b" transparent opacity={0.25} />
    </mesh>
  );
}

export default function CTACanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '3rem' }}
      dpr={[1, 1.5]}
    >
      <Orbs />
      <GlowRing />
      <GlowRing2 />
    </Canvas>
  );
}
