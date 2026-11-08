"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTheme } from "next-themes";
import { ArrowDown, Command } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { ShimmerButton, ShimmerLink } from "@/components/watermelon/shimmer-button";
import { SwitchMode } from "@/components/watermelon/switch-mode";
import { profile, stats } from "@/data/portfolio";
import { scrollToId } from "./smooth-scroll";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), { ssr: false });
const ease = [0.22, 1, 0.36, 1] as const;

function Word({ children, delay }: { children: string; delay: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = !mounted || resolvedTheme !== "light";

  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const lift = useTransform(scrollY, [0, 500], [0, -80]);

  return (
    <header id="top" className="relative isolate h-[100svh] min-h-[640px] overflow-hidden">
      {/* 3D scene */}
      <div className="absolute inset-0 -z-10">
        {mounted && <HeroScene dark={dark} />}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,transparent_30%,var(--background)_85%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-background" />
      </div>

      {/* top bar */}
      <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <button onClick={() => scrollToId("top")} className="flex items-center gap-2.5" aria-label="Back to top">
          <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-flesh to-rind font-mono text-xs font-bold text-white shadow-lg shadow-flesh/20">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-medium sm:block">{profile.name}</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPalette}
            className="hidden items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground sm:flex"
          >
            Quick jump
            <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-secondary px-1.5 py-0.5 font-sans text-[10px]">
              <Command className="size-2.5" />K
            </kbd>
          </button>
          <SwitchMode width={60} height={30} />
        </div>
      </div>

      {/* copy */}
      <motion.div style={{ opacity: fade, y: lift }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-28 sm:px-8 sm:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rind opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-rind" />
          </span>
          {profile.role} · {profile.location}
        </motion.p>

        <h1 className="text-[clamp(3.2rem,11vw,10rem)] leading-[0.88] font-semibold tracking-[-0.045em]">
          <Word delay={0.25}>Vishnu</Word> <Word delay={0.35}>Priya</Word>
          <br />
          <span className="font-serif font-normal tracking-[-0.02em] italic">
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className="text-gradient inline-block pr-3"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease }}
              >
                Taduka
              </motion.span>
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            I make AI systems <span className="text-foreground">reliable</span>: LLM agents, retrieval and backends, plus the
            tests, evals and telemetry that prove they work.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="flex flex-wrap gap-3"
          >
            <ShimmerButton onClick={() => scrollToId("projects")}>
              See the work <ArrowDown className="size-4" />
            </ShimmerButton>
            <ShimmerLink href={profile.github} target="_blank" rel="noreferrer" variant="outline">
              <FaGithub className="size-4" /> GitHub
            </ShimmerLink>
            <ShimmerLink href={profile.linkedin} target="_blank" rel="noreferrer" variant="outline">
              <FaLinkedin className="size-4" /> LinkedIn
            </ShimmerLink>
          </motion.div>
        </div>
      </motion.div>

      {/* stats ticker */}
      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-border bg-background/40 backdrop-blur-md md:block"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-border px-8">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-3 px-5 py-4 first:pl-0">
              <dd className="font-serif text-3xl whitespace-nowrap italic">{s.value}</dd>
              <dt className="text-xs leading-tight text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </div>
      </motion.dl>
    </header>
  );
}
