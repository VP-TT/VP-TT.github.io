'use client';

// Adapted from Watermelon UI "expandable-event-card" (ui.watermelon.sh): the image is replaced by an
// arbitrary cover node, the card shows chips, and the modal closes on Escape and locks page scroll.

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { setScrollLocked } from '@/components/site/smooth-scroll';

interface ExpandableCardProps {
  id: string;
  cover: ReactNode;
  title: string;
  description: string;
  eyebrow?: string;
  footer?: ReactNode;
  content: ReactNode;
  /** Shown at the top of the opened card instead of the cover (e.g. a demo video). */
  media?: ReactNode;
  coverClassName?: string;
}

export default function ExpandableEventCard({ id, cover, title, description, eyebrow, footer, content, media, coverClassName = 'h-44' }: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const layoutId = `expandable-card-${id}`;

  // lets other UI (e.g. the command palette) open this card: window.dispatchEvent(new CustomEvent('open-card', { detail: id }))
  useEffect(() => {
    const onOpen = (e: Event) => (e as CustomEvent<string>).detail === id && setIsOpen(true);
    window.addEventListener('open-card', onOpen);
    return () => window.removeEventListener('open-card', onOpen);
  }, [id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    setScrollLocked(true);
    window.addEventListener('keydown', onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <>
      <motion.div
        layoutId={layoutId}
        role="button"
        tabIndex={0}
        aria-label={`Open details for ${title}`}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <motion.div layoutId={`cover-${layoutId}`} className={`relative w-full overflow-hidden ${coverClassName}`}>
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">{cover}</div>
        </motion.div>
        <div className="flex flex-1 flex-col p-5">
          {eyebrow && <p className="mb-1.5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p>}
          <motion.h3 layoutId={`title-${layoutId}`} className="mb-1.5 text-lg font-semibold tracking-tight text-foreground">
            {title}
          </motion.h3>
          <motion.p layoutId={`desc-${layoutId}`} className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </motion.p>
          {footer && <div className="mt-auto pt-4">{footer}</div>}
        </div>
      </motion.div>

      {/* portal: a transformed ancestor (e.g. a tilt wrapper) would otherwise trap position:fixed */}
      {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8" role="dialog" aria-modal="true" aria-label={title}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              layoutId={layoutId}
              className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
              data-lenis-prevent
            >
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>

              {media ? (
                <motion.div layoutId={`cover-${layoutId}`} className="relative w-full shrink-0 bg-card px-6 pt-14 sm:px-8">
                  {media}
                </motion.div>
              ) : (
                <motion.div layoutId={`cover-${layoutId}`} className="relative h-48 w-full shrink-0 overflow-hidden sm:h-56">
                  {cover}
                </motion.div>
              )}

              <div className="overflow-y-auto p-6 sm:p-8" data-lenis-prevent>
                <motion.h3 layoutId={`title-${layoutId}`} className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
                  {title}
                </motion.h3>
                <motion.p layoutId={`desc-${layoutId}`} className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0, delay: 0.1 }}
                  className="text-sm leading-relaxed text-foreground/85"
                >
                  {content}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body)}
    </>
  );
}
