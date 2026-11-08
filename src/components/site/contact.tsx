"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { profile } from "@/data/portfolio";
import { Reveal } from "./reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { label: "GitHub", href: profile.github, Icon: FaGithub },
    { label: "LinkedIn", href: profile.linkedin, Icon: FaLinkedin },
  ];

  return (
    <footer id="contact" className="relative scroll-mt-24 overflow-hidden px-5 pt-28 pb-32 sm:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-linear-to-r from-flesh/20 via-amber-400/10 to-rind/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-6 font-mono text-[11px] tracking-[0.22em] text-primary uppercase">Contact</p>
          <h2 className="max-w-4xl text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
            Let&apos;s build something{" "}
            <em className="text-gradient pr-2 font-serif font-normal">that holds up</em>.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Internships, full-time roles, research, or a hard reliability problem: my inbox is open.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center gap-4">
          <button
            onClick={copy}
            className="group inline-flex items-center gap-4 rounded-full border border-border bg-card py-2.5 pr-2.5 pl-6 text-base transition-colors hover:border-primary/40 sm:text-lg"
            aria-label={`Copy email address ${profile.email}`}
          >
            <span className="font-medium">{profile.email}</span>
            <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={copied ? "check" : "copy"}
                  initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>
          <span className="sr-only" aria-live="polite">{copied ? "Email copied" : ""}</span>
          {links.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-3.5 text-sm font-medium transition-colors hover:bg-accent">
              <Icon className="size-4" /> {label}
              <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </Reveal>

        <div className="mt-28 select-none" aria-hidden>
          <p className="text-[clamp(3rem,15vw,15rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--border)]">
            Vishnu Priya
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {profile.name} · {profile.location}</p>
          <p>
            Next.js · three.js · Motion ·{" "}
            <a className="underline underline-offset-2 hover:text-foreground" href="https://ui.watermelon.sh" target="_blank" rel="noreferrer">Watermelon UI</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
