"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, HeartPulse, LayoutGrid, PlayCircle, Server, Smartphone, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import ExpandableEventCard from "@/components/watermelon/expandable-event-card";
import { DiscreteTabs } from "@/components/watermelon/discrete-tabs";
import { categories, projects, type Project } from "@/data/portfolio";
import { MediaViewer } from "./media-viewer";
import { ProjectCover } from "./project-cover";
import { Em, Section } from "./section";
import { TiltCard } from "./tilt-card";

const ICONS = { all: LayoutGrid, ai: Sparkles, backend: Server, health: HeartPulse, mobile: Smartphone } as const;

function Details({ p }: { p: Project }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {p.highlights.map((h) => (
          <span key={h} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{h}</span>
        ))}
      </div>
      <div className="space-y-4">{p.body.map((para) => <p key={para}>{para}</p>)}</div>
      <div>
        <p className="mb-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {p.stack.map((s) => <span key={s} className="rounded-md bg-secondary px-2.5 py-1 text-xs">{s}</span>)}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
          <FaGithub className="size-4" /> Source <ArrowUpRight className="size-3.5" />
        </a>
        {p.demo && (
          <a href={p.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
            <PlayCircle className="size-4" /> Watch on YouTube
          </a>
        )}
      </div>
    </div>
  );
}

function Card({ p, big }: { p: Project; big?: boolean }) {
  return (
    <TiltCard max={big ? 3 : 6}>
      <ExpandableEventCard
        id={p.slug}
        cover={<ProjectCover project={p} />}
        coverClassName={big ? "h-64 sm:h-80" : "h-48"}
        media={p.media ? <MediaViewer media={p.media} title={p.name} /> : undefined}
        eyebrow={p.context ?? (p.featured ? "Featured" : undefined)}
        title={p.name}
        description={p.oneLiner}
        footer={
          <div className="flex flex-wrap gap-1.5">
            {(big ? p.highlights : p.highlights.slice(0, 1)).map((h) => (
              <span key={h} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">{h}</span>
            ))}
          </div>
        }
        content={<Details p={p} />}
      />
    </TiltCard>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<string>("all");
  const visible = projects.filter((p) => !p.hidden && (filter === "all" || p.categories.includes(filter as Project["categories"][number])));
  const featured = visible.filter((p) => p.featured);
  const rest = visible.filter((p) => !p.featured);

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title={<>Things I&apos;ve built, and <Em>the numbers behind them</Em>.</>}
      intro="Open any project for the demo, the architecture and what I measured."
    >
      <div className="mb-10">
        <DiscreteTabs
          tabs={categories.map((c) => {
            const Icon = ICONS[c.id];
            return { id: c.id, label: c.label, icon: <Icon className="size-4" /> };
          })}
          onTabChange={setFilter}
          defaultTab="all"
        />
      </div>

      <motion.div layout className="grid gap-5 lg:grid-cols-6">
        <AnimatePresence mode="popLayout">
          {featured.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={i === 0 ? "lg:col-span-6" : "lg:col-span-3"}
            >
              <Card p={p} big />
            </motion.div>
          ))}
          {rest.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="sm:col-span-1 lg:col-span-2"
            >
              <Card p={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
