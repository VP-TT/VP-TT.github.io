import { ArrowUpRight, GitMerge, Trophy } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { achievements, experience, openSource, profile, skills } from "@/data/portfolio";
import { Reveal } from "./reveal";
import { Em, Section } from "./section";

export function About() {
  return (
    <Section id="about" eyebrow="About" title={<>The half of AI engineering that <Em>doesn&apos;t</Em> demo well.</>}>
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-pretty text-muted-foreground">
          {profile.about.map((p) => <p key={p}>{p}</p>)}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Education</p>
            <p className="mt-3 text-lg font-semibold">Keshav Memorial Institute of Technology</p>
            <p className="text-sm text-muted-foreground">B.Tech, Computer Science & Engineering · Hyderabad</p>
            <div className="mt-5 flex items-end justify-between border-t border-border pt-5">
              <div>
                <p className="font-serif text-5xl italic">9.3</p>
                <p className="text-sm text-muted-foreground">CGPA / 10</p>
              </div>
              <p className="text-right text-sm text-muted-foreground">Graduating<br />May 2027</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title={<>Two internships, one theme: <Em>catch it before production does</Em>.</>}>
      <ol className="relative space-y-10 border-l border-border pl-8 sm:pl-10">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 0.05}>
            <li className="relative">
              <span className="absolute top-1.5 -left-[41px] size-4 rounded-full border-4 border-background bg-linear-to-br from-flesh to-rind sm:-left-[49px]" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-xl font-semibold tracking-tight">
                  {job.role} <span className="text-muted-foreground">· {job.company}</span>
                </h3>
                <p className="font-mono text-xs text-muted-foreground">{job.period} · {job.location}</p>
              </div>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-muted-foreground">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2.5 size-1 shrink-0 rounded-full bg-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {job.stack.map((s) => (
                  <span key={s} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">{s}</span>
                ))}
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

export function OpenSource() {
  const total = openSource.contributions.reduce((n, c) => n + c.merged, 0);
  const max = Math.max(...openSource.contributions.map((c) => c.merged));
  return (
    <Section
      id="open-source"
      eyebrow="Open source"
      title={<><Em gradient>{total}</Em> merged pull requests across {openSource.contributions.length} projects.</>}
      intro={openSource.summary}
    >
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {openSource.contributions.map((c) => (
            <a
              key={c.repo}
              href={`https://github.com/${c.repo}/pulls?q=is%3Apr+author%3AVP-TT+is%3Amerged`}
              target="_blank"
              rel="noreferrer"
              className="group grid gap-3 border-b border-border p-5 transition-colors last:border-b-0 hover:bg-accent/60 sm:grid-cols-[1.1fr_1.6fr_auto] sm:items-center sm:gap-6"
            >
              <div className="flex items-center gap-3 font-mono text-sm">
                <FaGithub className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{c.repo}</span>
              </div>
              <p className="text-sm text-muted-foreground">{c.what}</p>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-linear-to-r from-flesh to-rind" style={{ width: `${(c.merged / max) * 100}%` }} />
                </div>
                <span className="inline-flex w-14 items-center gap-1 font-mono text-xs text-muted-foreground">
                  <GitMerge className="size-3.5 text-rind" /> {c.merged}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

export function Achievements() {
  const [first, ...rest] = achievements;
  return (
    <Section id="achievements" eyebrow="Achievements" title={<>Hackathons, ranks and <Em>a few medals</Em>.</>}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal className="sm:col-span-2 lg:row-span-2">
          <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-border bg-linear-to-br from-flesh/15 via-card to-rind/15 p-7">
            <Trophy className="absolute top-6 right-6 size-24 text-flesh/20" strokeWidth={1} />
            <p className="font-serif text-6xl italic sm:text-7xl">1 <span className="text-muted-foreground">of</span> 4</p>
            <p className="mt-2 text-xl font-semibold">{first.title}</p>
            <p className="mt-2 max-w-md text-muted-foreground">{first.detail}</p>
          </div>
        </Reveal>
        {rest.map((a, i) => (
          <Reveal key={a.title} delay={0.04 * i}>
            <div className="h-full rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold">{a.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Skills() {
  const all = Object.values(skills).flat();
  return (
    <Section id="skills" eyebrow="Toolbox" title={<>What I <Em>reach for</Em>.</>}>
      <div className="mask-fade-x mb-12 overflow-hidden">
        <div className="animate-marquee flex w-max gap-3">
          {[...all, ...all].map((s, i) => (
            <span key={`${s}-${i}`} className="rounded-full border border-border bg-card px-4 py-2 text-sm whitespace-nowrap text-muted-foreground">{s}</span>
          ))}
        </div>
      </div>
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(skills).map(([group, items], i) => (
          <Reveal key={group} delay={i * 0.04}>
            <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{group}</p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((s) => (
                <span key={s} className="rounded-md bg-secondary px-2.5 py-1 text-sm">{s}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
