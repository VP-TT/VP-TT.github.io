"use client";

import { motion } from "motion/react";
import { ArrowDown, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { ShimmerLink } from "@/components/watermelon/shimmer-button";
import { profile, stats } from "@/data/portfolio";
import { Em } from "./section";
import { Terminal } from "./terminal";

const ease = [0.22, 1, 0.36, 1] as const;

function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div className="animate-drift absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-flesh/30 blur-[120px] dark:bg-flesh/25" />
      <div className="animate-drift-slow absolute top-10 -right-40 h-[480px] w-[480px] rounded-full bg-rind/25 blur-[120px] dark:bg-rind/20" />
      <div className="animate-drift absolute top-[55%] left-1/3 h-[360px] w-[360px] rounded-full bg-amber-400/15 blur-[110px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
    </div>
  );
}

export function Hero() {
  return (
    <header id="top" className="relative isolate overflow-hidden px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32">
      <Aurora />
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 pr-3 pl-1 text-xs text-muted-foreground backdrop-blur"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-linear-to-br from-flesh to-rind font-mono text-[10px] font-bold text-white">
              {profile.initials}
            </span>
            {profile.name}
            <span className="text-border">·</span>
            <MapPin className="size-3" />
            {profile.location}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            AI engineer who makes systems <Em gradient>reliable</Em>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            Final-year CS at KMIT. {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <ShimmerLink href="#projects">
              See my work <ArrowDown className="size-4" />
            </ShimmerLink>
            <ShimmerLink href={profile.github} target="_blank" rel="noreferrer" variant="outline">
              <FaGithub className="size-4" /> GitHub
            </ShimmerLink>
            <ShimmerLink href={profile.linkedin} target="_blank" rel="noreferrer" variant="outline">
              <FaLinkedin className="size-4" /> LinkedIn
            </ShimmerLink>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
        >
          <Terminal />
        </motion.div>
      </div>

      <dl className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-3 sm:mt-20 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease }}
            className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur"
          >
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-serif text-4xl italic">{s.value}</dd>
            <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
          </motion.div>
        ))}
      </dl>
    </header>
  );
}
