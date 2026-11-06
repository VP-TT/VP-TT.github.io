// Adapted from Watermelon UI "shimmer-button" (ui.watermelon.sh): adds a link variant and an
// outline style; the shimmer sweep is unchanged.

import { cn } from "@/lib/utils";

const base = cn(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium",
  "transition-shadow duration-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
);
const variants = {
  solid: "bg-primary text-primary-foreground hover:shadow-primary/25",
  outline: "border border-border bg-card/60 text-foreground backdrop-blur hover:shadow-black/5",
};

function Sweep() {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-0 -translate-x-full",
        "bg-linear-to-r from-transparent via-white/25 to-transparent",
        "transition-transform duration-700 group-hover:translate-x-full",
      )}
    />
  );
}

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}

export function ShimmerButton({ children, className, variant = "solid", ...props }: ShimmerButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <Sweep />
    </button>
  );
}

interface ShimmerLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}

export function ShimmerLink({ children, className, variant = "solid", ...props }: ShimmerLinkProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <Sweep />
    </a>
  );
}
