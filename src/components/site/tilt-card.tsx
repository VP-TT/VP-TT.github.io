"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 3D tilt towards the cursor plus a soft spotlight that follows it. */
export function TiltCard({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const rx = useSpring(0, { stiffness: 200, damping: 18 });
  const ry = useSpring(0, { stiffness: 200, damping: 18 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, color-mix(in oklch, var(--flesh) 18%, transparent), transparent 60%)`;

  return (
    <motion.div
      className={cn("group/tilt relative h-full [perspective:1200px]", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 2 * max);
        rx.set(-(py - 0.5) * 2 * max);
        mx.set(px * 100);
        my.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative h-full">
        {children}
        <motion.div aria-hidden style={{ background: glow }} className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100" />
      </motion.div>
    </motion.div>
  );
}
