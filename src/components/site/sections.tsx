"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight, GitMerge, Trophy } from "lucide-react";
import { achievements, experience, openSource, profile, skills } from "@/data/portfolio";
import { Reveal } from "./reveal";
import { Em, Section } from "./section";
import { Terminal } from "./terminal";

const SkillsSphere = dynamic(() => import("@/components/three/skills-sphere"), { ssr: false });

/* ---------- marquee band ---------- */

const BAND = ["LLM agents", "Retrieval", "Evals", "Exactly-once payments", "Computer vision", "Telemetry", "Distributed systems", "Property-based tests"];

export function Band() {
  return (
    <div className="relative border-y border-border bg-card/40 py-6">
      <div className="mask-fade-x overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-10">
          {[...BAND, ...BAND].map((w, i) => (
            <span key={i} className="flex items-center gap-10 text-3xl font-semibold tracking-tight whitespace-nowrap text-foreground/80 sm:text-5xl">
              {i % 2 ? <em className="font-serif font-normal">{w}</em> : w}
              <span className="size-2.5 rounded-full bg-linear-to-br from-flesh to-rind" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- about: scroll-revealed statement ---------- */

function RevealWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{word}</motion.span>;
}

const STATEMENT =
  "Most AI demos stop at the happy path. I work on the rest: evaluation, validation layers that catch silent failures, tests that hunt edge cases, and traces that show what a model actually did.";

export function About() {
  const target = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start 0.85", "end 0.45"] });
  const words = STATEMENT.split(" ");

  return (
    <section id="about" className="scroll-mt-24 px-5 py-28 sm:px-8 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 font-mono text-[11px] tracking-[0.22em] text-primary uppercase">About</p>
        <p ref={target} className="max-w-5xl text-[clamp(1.7rem,4.2vw,3.6rem)] leading-[1.15] font-medium tracking-tight text-balance">
          {words.map((w, i) => (
            <RevealWord key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>

        <div className="mt-20 grid gap-6 lg:grid-cols-[1fr_1fr_1.2fr]">
          <Reveal className="space-y-4 text-[15px] leading-relaxed text-muted-foreground lg:col-span-1">
            {profile.about.map((p) => <p key={p}>{p}</p>)}
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Education</p>
              <p className="mt-3 text-lg font-semibold">Keshav Memorial Institute of Technology</p>
              <p className="text-sm text-muted-foreground">B.Tech, Computer Science & Engineering · Hyderabad</p>
              <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
                <div>
                  <p className="font-serif text-6xl italic">9.3</p>
                  <p className="text-sm text-muted-foreground">CGPA / 10</p>
                </div>
                <p className="text-right text-sm text-muted-foreground">Graduating<br />May 2027</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <Terminal />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- experience ---------- */

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title={<>Two internships, one theme: <Em>catch it before production does</Em>.</>}>
      <div className="grid gap-6">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 0.05}>
            <article className="group relative grid gap-6 overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[260px_1fr]">
              <div aria-hidden className="absolute -top-24 -right-24 size-64 rounded-full bg-flesh/10 blur-3xl transition-opacity group-hover:opacity-100 lg:opacity-60" />
              <div>
                <p className="font-mono text-xs text-muted-foreground">{job.period}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{job.company}</h3>
                <p className="text-muted-foreground">{job.role}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {job.stack.map((s) => (
                    <span key={s} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <ul className="relative space-y-3 text-[15px] leading-relaxed text-foreground/85">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-linear-to-br from-flesh to-rind" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- open source as a git graph ---------- */

function GitGraph() {
  const rows = openSource.contributions;
  const rowH = 76;
  const h = rows.length * rowH + 40;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <svg ref={ref} viewBox={`0 0 120 ${h}`} className="h-full w-[120px] shrink-0" aria-hidden>
      <defs>
        <linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--flesh)" />
          <stop offset="100%" stopColor="var(--rind)" />
        </linearGradient>
      </defs>
      <motion.line x1="24" y1="10" x2="24" y2={h - 10} stroke="url(#trunk)" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.4, ease: "easeInOut" }} />
      {rows.map((r, i) => {
        const y = 40 + i * rowH;
        const branchX = 24 + 26 + Math.min(r.merged, 9) * 5;
        return (
          <g key={r.repo}>
            <motion.path
              d={`M24 ${y - 18} C 24 ${y - 4}, ${branchX} ${y - 14}, ${branchX} ${y} S 24 ${y + 4}, 24 ${y + 18}`}
              fill="none" stroke="var(--muted-foreground)" strokeOpacity="0.5" strokeWidth="2"
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.8, delay: 0.4 + i * 0.12 }}
            />
            <motion.circle cx={branchX} cy={y} r="6" fill="var(--background)" stroke="var(--flesh)" strokeWidth="2.5"
              initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.8 + i * 0.12, type: "spring" }} />
            <circle cx="24" cy={y + 18} r="4" fill="var(--rind)" />
          </g>
        );
      })}
    </svg>
  );
}

export function OpenSource() {
  const total = openSource.contributions.reduce((n, c) => n + c.merged, 0);
  return (
    <Section
      id="open-source"
      eyebrow="Open source"
      title={<><Em gradient>{total}</Em> merged pull requests across {openSource.contributions.length} projects.</>}
      intro={openSource.summary}
    >
      <Reveal>
        <div className="flex overflow-hidden rounded-3xl border border-border bg-card">
          <div className="hidden border-r border-border bg-secondary/40 sm:block">
            <GitGraph />
          </div>
          <div className="flex-1">
            {openSource.contributions.map((c) => (
              <a
                key={c.repo}
                href={`https://github.com/${c.repo}/pulls?q=is%3Apr+author%3AVP-TT+is%3Amerged`}
                target="_blank"
                rel="noreferrer"
                className="group flex h-[76px] items-center gap-4 border-b border-border px-5 transition-colors last:border-b-0 hover:bg-accent/60 sm:px-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm">
                    <span className="text-muted-foreground">{c.repo.split("/")[0]}/</span>{c.repo.split("/")[1]}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{c.what}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rind/12 px-2.5 py-1 font-mono text-xs text-rind">
                  <GitMerge className="size-3.5" /> {c.merged} merged
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------- achievements ---------- */

export function Achievements() {
  const [first, ...rest] = achievements;
  return (
    <Section id="achievements" eyebrow="Achievements" title={<>Hackathons, ranks and <Em>a few medals</Em>.</>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal className="sm:col-span-2 lg:row-span-2">
          <div className="relative flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-3xl border border-border bg-card p-8">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,color-mix(in_oklch,var(--flesh)_28%,transparent),transparent_55%),radial-gradient(circle_at_10%_100%,color-mix(in_oklch,var(--rind)_22%,transparent),transparent_50%)]" />
            <Trophy className="absolute top-7 right-7 size-20 text-flesh/40" strokeWidth={1} />
            <p className="relative font-serif text-7xl italic sm:text-8xl">1 <span className="text-muted-foreground">of</span> 4</p>
            <p className="relative mt-3 text-xl font-semibold">{first.title}</p>
            <p className="relative mt-2 max-w-md text-muted-foreground">{first.detail}</p>
          </div>
        </Reveal>
        {rest.map((a, i) => (
          <Reveal key={a.title} delay={0.04 * i}>
            <div className="h-full rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
              <p className="text-lg font-semibold">{a.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- skills: 3D sphere ---------- */

export function Skills() {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: "200px" });
  const [everShown, setEverShown] = useState(false);
  useEffect(() => {
    if (inView) setEverShown(true);
  }, [inView]);

  const accent = new Set(["Python", "Java", "TypeScript", "PyTorch", "LangChain", "RAG", "Spring Boot", "PostgreSQL", "Langfuse", "Evals"]);
  const items = Object.values(skills).flat().map((text) => ({ text, accent: accent.has(text) }));

  return (
    <Section id="skills" eyebrow="Toolbox" title={<>What I <Em>reach for</Em>.</>} intro="Drag the sphere to spin it.">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div ref={wrap} className="relative h-[420px] cursor-grab active:cursor-grabbing sm:h-[520px]">
          <div aria-hidden className="absolute inset-[15%] rounded-full bg-linear-to-br from-flesh/15 to-rind/15 blur-3xl" />
          {everShown && <SkillsSphere items={items} active={inView} />}
        </div>
        <div className="grid gap-7 sm:grid-cols-2">
          {Object.entries(skills).map(([group, list], i) => (
            <Reveal key={group} delay={i * 0.04}>
              <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{group}</p>
              <p className="text-sm leading-7 text-foreground/85">{list.join(" · ")}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
