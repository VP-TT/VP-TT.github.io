"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, HeartPulse, LayoutGrid, PlayCircle, Server, Smartphone, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import ExpandableEventCard from "@/components/watermelon/expandable-event-card";
import { DiscreteTabs } from "@/components/watermelon/discrete-tabs";
import { categories, projects, type Project } from "@/data/portfolio";
import { ProjectCover } from "./project-cover";
import { Em, Section } from "./section";

const ICONS = { all: LayoutGrid, ai: Sparkles, backend: Server, health: HeartPulse, mobile: Smartphone } as const;

function Details({ p }: { p: Project }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {p.highlights.map((h) => (
          <span key={h} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{h}</span>
        ))}
      </div>
      <div className="space-y-4">
        {p.body.map((para) => <p key={para}>{para}</p>)}
      </div>
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
            <PlayCircle className="size-4" /> Demo video
          </a>
        )}
      </div>
    </div>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<string>("all");
  const shown = projects.filter((p) => !p.hidden).filter((p) => filter === "all" || p.categories.includes(filter as Project["categories"][number]));

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title={<>Things I&apos;ve built, and <Em>the numbers behind them</Em>.</>}
      intro="Click any card for the full story: architecture, trade-offs and what I measured."
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

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <ExpandableEventCard
                id={p.slug}
                cover={<ProjectCover project={p} />}
                eyebrow={p.featured ? "Featured" : p.context}
                title={p.name}
                description={p.oneLiner}
                footer={
                  <p className="flex items-start gap-2 text-xs font-medium text-primary">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    {p.highlights[0]}
                  </p>
                }
                content={<Details p={p} />}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
