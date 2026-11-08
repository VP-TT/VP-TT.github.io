"use client";

// The hero's 3D scene: a noise-displaced, iridescent orb inside a drifting particle field.
// Mouse bends the orb and parallaxes the field; scrolling pulls the camera back.

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { simplex3 } from "./noise";

const orbVertex = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  ${simplex3}
  void main() {
    vec3 p = position;
    float t = uTime * 0.22;
    float n = snoise(p * 0.9 + vec3(t, t * 0.6, -t)) * 0.55
            + snoise(p * 2.1 - vec3(t * 1.4)) * 0.18 * (0.6 + uHover);
    vNoise = n;
    p += normal * n * (0.32 + 0.18 * uHover);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const orbFragment = /* glsl */ `
  uniform vec3 uFlesh;
  uniform vec3 uRind;
  uniform vec3 uAmber;
  uniform vec3 uCore;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  void main() {
    float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.2);
    float band = smoothstep(-0.45, 0.55, vNoise);
    vec3 skin = mix(uFlesh, uAmber, smoothstep(0.15, 0.6, band));
    skin = mix(skin, uRind, smoothstep(0.55, 0.95, band));
    vec3 col = mix(uCore, skin, 0.6 + 0.4 * fres);
    col *= 0.9 + 0.35 * smoothstep(-0.2, 0.8, vNoise);   // brighter crests, so the body isn't muddy
    col += fres * fres * 0.9 * mix(uFlesh, uRind, band);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aSeed;
  varying float vSeed;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.15 + aSeed * 6.283) * 0.25;
    p.y += cos(uTime * 0.12 + aSeed * 12.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (14.0 + aSeed * 22.0) * uSize * uPixelRatio / -mv.z;
    vSeed = aSeed;
    gl_Position = projectionMatrix * mv;
  }
`;

const pointsFragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform float uOpacity;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 col = vSeed < 0.12 ? uA : (vSeed < 0.22 ? uB : uC);
    gl_FragColor = vec4(col, a * uOpacity * (0.35 + 0.65 * vSeed));
  }
`;

type Pointer = { x: number; y: number };

function Orb({ pointer, dark }: { pointer: React.RefObject<Pointer>; dark: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  // portrait screens: lift the orb above the headline and shrink it so the text stays readable
  const portrait = size.width / size.height < 0.9;
  const place: [number, number, number] = portrait ? [0.35, 1.55, -0.6] : [1.55, 0.05, 0];
  const scale = portrait ? 0.62 : 1;
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uFlesh: { value: new THREE.Color("#ff5d7d") },
      uRind: { value: new THREE.Color("#35d39a") },
      uAmber: { value: new THREE.Color("#ffb14a") },
      uCore: { value: new THREE.Color(dark ? "#160d18" : "#f6e9ec") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    uniforms.uCore.value.set(dark ? "#160d18" : "#f3e4e8");
  }, [dark, uniforms]);

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    const p = pointer.current!;
    const target = Math.min(1, Math.hypot(p.x, p.y));
    uniforms.uHover.value += (target - uniforms.uHover.value) * 0.04;
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.08;
      mesh.current.rotation.x += (p.y * 0.35 - mesh.current.rotation.x) * 0.04;
      mesh.current.rotation.z += (-p.x * 0.25 - mesh.current.rotation.z) * 0.04;
    }
  });

  return (
    <mesh ref={mesh} position={place} scale={scale}>
      <icosahedronGeometry args={[1.35, 64]} />
      <shaderMaterial vertexShader={orbVertex} fragmentShader={orbFragment} uniforms={uniforms} />
    </mesh>
  );
}

function Field({ pointer, dark, count = 2400 }: { pointer: React.RefObject<Pointer>; dark: boolean; count?: number }) {
  const group = useRef<THREE.Points>(null);
  const { gl } = useThree();
  const [positions, seeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // shell between radius 2.6 and 9, flattened slightly
      const r = 2.6 + Math.pow(Math.random(), 0.7) * 6.4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(ph);
      seed[i] = Math.random();
    }
    return [pos, seed];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uA: { value: new THREE.Color("#ff6b8a") },
      uB: { value: new THREE.Color("#3fe0a3") },
      uC: { value: new THREE.Color(dark ? "#d9d4e6" : "#9a90a8") },
      uOpacity: { value: dark ? 0.9 : 0.6 },
      uSize: { value: dark ? 1 : 0.6 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    uniforms.uC.value.set(dark ? "#d9d4e6" : "#9a90a8");
    uniforms.uOpacity.value = dark ? 0.9 : 0.6;
    uniforms.uSize.value = dark ? 1 : 0.6;
  }, [dark, uniforms]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    const p = pointer.current!;
    if (group.current) {
      group.current.rotation.y += delta * 0.015 + (p.x * 0.2 - group.current.rotation.y) * 0.02;
      group.current.rotation.x += (p.y * 0.12 - group.current.rotation.x) * 0.02;
    }
  });

  return (
    <points ref={group}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={pointsVertex}
        fragmentShader={pointsFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

/** Camera dolly tied to page scroll (0 at top → pulled back and up after one screen). */
function ScrollRig() {
  useFrame(({ camera }) => {
    const s = Math.min(1, window.scrollY / window.innerHeight);
    const targetZ = 6 + s * 3.5;
    const targetY = s * 1.2;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.lookAt(0.6, 0, 0);
  });
  return null;
}

export default function HeroScene({ dark }: { dark: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={!visible ? "never" : reduced ? "demand" : "always"}
      >
        <Orb pointer={pointer} dark={dark} />
        <Field pointer={pointer} dark={dark} />
        <ScrollRig />
      </Canvas>
    </div>
  );
}
