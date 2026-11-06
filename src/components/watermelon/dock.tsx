'use client';

// Adapted from Watermelon UI "dock" (ui.watermelon.sh): items are labelled, clickable and can be
// marked active; the demo wrapper background is removed so it can float over the page.

import React, { useState, type FC } from 'react';
import { motion, type Transition } from 'motion/react';
import { cn } from '@/lib/utils';

export interface DockItem {
  id: string;
  label: string;
  Icon: React.ElementType;
  onClick?: () => void;
  href?: string;
  className?: string;
}

interface DockProps {
  items: DockItem[];
  activeId?: string | null;
  trailing?: React.ReactNode;
  className?: string;
}

const dockSpring: Transition = { stiffness: 300, damping: 22, mass: 0.7 };

export const Dock: FC<DockProps> = ({ items, activeId, trailing, className }) => {
  const [bounce, setBounce] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = (item: DockItem) => {
    setBounce(item.id);
    setTimeout(() => setBounce(null), 200);
    item.onClick?.();
  };

  return (
    <motion.nav
      layout
      aria-label="Sections"
      transition={dockSpring}
      className={cn(
        'relative flex items-end gap-2 rounded-3xl border border-border bg-background/75 px-2 py-2 shadow-lg shadow-black/5 backdrop-blur-xl sm:gap-3 dark:shadow-black/30',
        className,
      )}
    >
      {items.map((item) => {
        const active = activeId === item.id;
        const Tag = item.href ? 'a' : 'button';
        return (
          <motion.div
            key={item.id}
            className={cn('relative', item.className)}
            style={{ transformOrigin: 'bottom' }}
            whileHover={{ y: -4 }}
            animate={{ scale: bounce === item.id ? 1.3 : 1, y: bounce === item.id ? -6 : 0 }}
            transition={{ type: 'spring', stiffness: 550, damping: 15, mass: 1.1 }}
            onHoverStart={() => setHovered(item.id)}
            onHoverEnd={() => setHovered(null)}
          >
            <Tag
              {...(item.href ? { href: item.href, target: '_blank', rel: 'noreferrer' } : { type: 'button' as const })}
              onClick={() => handleClick(item)}
              aria-label={item.label}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'flex cursor-pointer items-center justify-center rounded-xl bg-secondary p-2 text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                active && 'bg-primary/12 text-primary hover:text-primary',
              )}
            >
              <item.Icon className="size-[18px]" strokeWidth={1.8} />
            </Tag>

            {/* tooltip */}
            <motion.span
              initial={false}
              animate={{ opacity: hovered === item.id ? 1 : 0, y: hovered === item.id ? 0 : 4 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-border bg-popover px-2 py-1 text-[11px] font-medium whitespace-nowrap text-popover-foreground shadow-sm"
            >
              {item.label}
            </motion.span>

            {/* active dot */}
            <div className={cn('mt-px flex w-full justify-center opacity-0 transition-opacity duration-300', active && 'opacity-100')}>
              <div className="size-1 rounded-full bg-primary" />
            </div>
          </motion.div>
        );
      })}
      {trailing && <div className="ml-1 flex items-center self-center border-l border-border pl-2.5">{trailing}</div>}
    </motion.nav>
  );
};
