"use client";

// A draggable sphere of skill labels. Labels are DOM nodes positioned by three.js (crisp text,
// themeable); ones on the far side fade and shrink. Only mounted when its section is on screen.

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function fibonacciSphere(n: number, r: number) {
  const pts: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push([Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r]);
  }
  return pts;
}

const tmp = new THREE.Vector3();

function Label({ text, position, accent }: { text: string; position: [number, number, number]; accent: boolean }) {
  const anchor = useRef<THREE.Group>(null);
  const el = useRef<HTMLSpanElement>(null);
  useFrame(({ camera }) => {
    if (!anchor.current || !el.current) return;
    anchor.current.getWorldPosition(tmp);
    // depth relative to the camera: 1 = nearest, 0 = farthest
    const toCam = tmp.clone().sub(camera.position).normalize();
    const facing = -toCam.dot(tmp.clone().normalize());
    const t = (facing + 1) / 2;
    el.current.style.opacity = String(0.12 + t * 0.88);
    el.current.style.transform = `scale(${0.7 + t * 0.45})`;
    el.current.style.filter = t < 0.35 ? "blur(1px)" : "none";
  });
  return (
    <group ref={anchor} position={position}>
      <Html center zIndexRange={[10, 0]}>
        <span
          ref={el}
          className={`block cursor-default rounded-full border px-3 py-1 text-[13px] font-medium whitespace-nowrap backdrop-blur-sm transition-colors select-none ${
            accent ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-card/70 text-foreground"
          }`}
        >
          {text}
        </span>
      </Html>
    </group>
  );
}

function Cloud({ items }: { items: { text: string; accent: boolean }[] }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => fibonacciSphere(items.length, 2.7), [items.length]);
  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.06;
  });
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Label key={it.text} text={it.text} position={points[i]} accent={it.accent} />
      ))}
    </group>
  );
}

export default function SkillsSphere({ items, active = true }: { items: { text: string; accent: boolean }[]; active?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true }} frameloop={active ? "always" : "never"}>
      <Cloud items={items} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
}
