"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import type { Media } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type Slide = { kind: "video"; label: string } | { kind: "image"; src: string; caption: string };

/** Demo video first (autoplaying, muted, with controls), then screenshots; thumbnails switch between them. */
export function MediaViewer({ media, title }: { media: Media; title: string }) {
  const slides: Slide[] = [
    ...(media.video ? [{ kind: "video" as const, label: "Demo" }] : []),
    ...(media.images ?? []).map((i) => ({ kind: "image" as const, src: i.src, caption: i.caption })),
  ];
  const [active, setActive] = useState(0);
  const slide = slides[active];
  if (!slide) return null;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-border bg-black">
        {slide.kind === "video" && media.video?.kind === "mp4" && (
          <video
            key="video"
            className={cn("mx-auto max-h-[52vh] w-full", media.video.portrait ? "w-auto" : "object-contain")}
            src={media.video.src}
            poster={media.video.poster}
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        )}
        {slide.kind === "video" && media.video?.kind === "youtube" && (
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${media.video.id}?autoplay=1&mute=1&rel=0&modestbranding=1`}
              title={`${title} demo video`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {slide.kind === "image" && (
          <motion.img
            key={slide.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={slide.src}
            alt={slide.caption}
            className="mx-auto max-h-[52vh] w-full object-contain"
          />
        )}
      </div>
      {slide.kind === "image" && <p className="text-xs text-muted-foreground">{slide.caption}</p>}
      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={s.kind === "video" ? "Play demo video" : s.caption}
              className={cn(
                "relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border transition-all",
                i === active ? "border-primary ring-2 ring-primary/30" : "border-border opacity-70 hover:opacity-100",
              )}
            >
              {s.kind === "video" ? (
                <span className="flex h-full w-full items-center justify-center gap-1 bg-secondary text-xs font-medium">
                  <Play className="size-3.5 fill-current" /> Demo
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.src} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
