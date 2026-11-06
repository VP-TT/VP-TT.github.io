"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// One real, verifiable line per project; the panel types them out in turn.
const LINES = [
  { cmd: "ledgerline test --parallel 1000", out: "600 charged · 0 double charges ✓" },
  { cmd: "k6 run payments.js --rate 200", out: "p95 1,392 ms → 35 ms after the hot-row fix" },
  { cmd: "prism review #42", out: "6 tools · sandbox --network none · 1 review posted" },
  { cmd: "vidsense ask \"when does the desert appear?\"", out: "[00:24] → jumps to the moment" },
  { cmd: "cura chat --proxy-tuning", out: "expert − anti-expert logits → steer the base model" },
];

export function Terminal() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const line = LINES[index];

  useEffect(() => {
    let i = 0;
    setTyped("");
    const typer = setInterval(() => {
      i += 1;
      setTyped(line.cmd.slice(0, i));
      if (i >= line.cmd.length) clearInterval(typer);
    }, 38);
    const next = setTimeout(() => setIndex((n) => (n + 1) % LINES.length), line.cmd.length * 38 + 2600);
    return () => {
      clearInterval(typer);
      clearTimeout(next);
    };
  }, [line]);

  const done = typed.length === line.cmd.length;

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-4 rounded-[28px] bg-linear-to-br from-flesh/25 via-transparent to-rind/25 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-zinc-950 text-zinc-100 shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[11px] text-zinc-500">~/projects</span>
        </div>
        <div className="h-[188px] space-y-3 p-5 font-mono text-[13px] leading-relaxed" aria-live="polite">
          {LINES.slice(0, index).slice(-2).map((l) => (
            <div key={l.cmd} className="opacity-45">
              <p><span className="text-emerald-400">❯</span> {l.cmd}</p>
              <p className="text-zinc-400">{l.out}</p>
            </div>
          ))}
          <div>
            <p>
              <span className="text-emerald-400">❯</span> {typed}
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-zinc-300" />
            </p>
            <AnimatePresence>
              {done && (
                <motion.p
                  key={line.out}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-rose-300"
                >
                  {line.out}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
