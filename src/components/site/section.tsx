import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function Section({ id, eyebrow, title, intro, children }: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 font-mono text-[11px] tracking-[0.22em] text-primary uppercase">{eyebrow}</p>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h2>
          {intro && <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{intro}</p>}
        </Reveal>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}

/** Serif italic accent for headings. */
export function Em({ children, gradient = false }: { children: ReactNode; gradient?: boolean }) {
  return <em className={`font-serif font-normal italic ${gradient ? "text-gradient pr-1" : ""}`}>{children}</em>;
}
