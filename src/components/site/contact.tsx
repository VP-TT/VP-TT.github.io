"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { ShimmerLink } from "@/components/watermelon/shimmer-button";
import { profile } from "@/data/portfolio";
import { Reveal } from "./reveal";
import { Em } from "./section";

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

  return (
    <section id="contact" className="scroll-mt-24 px-5 pt-16 pb-40 sm:px-8">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-12 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-flesh/20 blur-[100px]" />
          <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-rind/20 blur-[100px]" />
        </div>
        <div className="relative">
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] text-primary uppercase">Contact</p>
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Let&apos;s build something <Em gradient>that holds up</Em>.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
            Internships, full-time roles, research or a hard reliability problem: my inbox is open.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={copy}
              className="group inline-flex items-center gap-3 rounded-full border border-border bg-background/70 py-2 pr-2 pl-5 font-mono text-sm backdrop-blur transition-colors hover:border-primary/40"
              aria-label={`Copy email address ${profile.email}`}
            >
              {profile.email}
              <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={copied ? "check" : "copy"}
                    initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -14, opacity: 0, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
            <span className="sr-only" aria-live="polite">{copied ? "Email copied" : ""}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ShimmerLink href={`mailto:${profile.email}`} variant="outline"><Mail className="size-4" /> Email</ShimmerLink>
            <ShimmerLink href={profile.github} target="_blank" rel="noreferrer" variant="outline"><FaGithub className="size-4" /> GitHub</ShimmerLink>
            <ShimmerLink href={profile.linkedin} target="_blank" rel="noreferrer" variant="outline"><FaLinkedin className="size-4" /> LinkedIn</ShimmerLink>
          </div>
        </div>
      </Reveal>

      <footer className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>Built with Next.js, Tailwind, Motion and <a className="underline underline-offset-2 hover:text-foreground" href="https://ui.watermelon.sh" target="_blank" rel="noreferrer">Watermelon UI</a>.</p>
      </footer>
    </section>
  );
}
