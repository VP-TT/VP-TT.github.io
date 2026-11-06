import type { Project } from "@/data/portfolio";

/** Generated cover art: a two-hue mesh, a fine grid, the project monogram and its stack. */
export function ProjectCover({ project }: { project: Project }) {
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
      <span className="absolute right-5 bottom-1 font-serif text-[88px] leading-none text-white/90 italic drop-shadow-sm select-none">
        {project.glyph}
      </span>
      <div className="absolute top-4 left-4 flex max-w-[70%] flex-wrap gap-1.5">
        {project.stack.slice(0, 3).map((s) => (
          <span key={s} className="rounded-full bg-black/25 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
