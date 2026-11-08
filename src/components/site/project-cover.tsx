"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import type { Project } from "@/data/portfolio";

/** Generated cover art: a two-hue mesh, a fine grid and the project monogram. */
export function GeneratedCover({ project }: { project: Project }) {
  const [a, b] = project.hue;
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 0% 0%, oklch(0.72 0.16 ${a} / 0.95), transparent 60%),
                     radial-gradient(110% 100% at 100% 100%, oklch(0.62 0.17 ${b} / 0.95), transparent 65%),
                     oklch(0.24 0.03 ${(a + b) / 2})`,
      }}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />
      <span className="absolute right-5 bottom-1 font-serif text-[88px] leading-none text-white/90 italic drop-shadow-sm select-none">{project.glyph}</span>
    </div>
  );
}

/** Real media when the project has it (video poster or first screenshot); plays the demo muted on hover. */
export function ProjectCover({ project }: { project: Project }) {
  const video = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const m = project.media;
  const still = m?.video?.poster ?? m?.images?.[0]?.src;
  const mp4 = m?.video?.kind === "mp4" ? m.video : undefined;

  if (!still) return <GeneratedCover project={project} />;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-zinc-900"
      onMouseEnter={() => {
        setHover(true);
        video.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHover(false);
        video.current?.pause();
      }}
    >
      {mp4?.portrait ? (
        <>
          {/* portrait phone recording: blurred fill behind the centred frame */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={still} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-2xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={still} alt={`${project.name} screenshot`} className="relative mx-auto h-full object-contain" />
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={still} alt={`${project.name} screenshot`} className="absolute inset-0 h-full w-full object-cover object-top" />
      )}
      {mp4 && (
        <video
          ref={video}
          src={mp4.src}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${mp4.portrait ? "object-contain" : "object-cover object-top"} ${hover ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
      {m?.video && (
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          <Play className="size-3 fill-current" /> Demo video
        </span>
      )}
    </div>
  );
}
