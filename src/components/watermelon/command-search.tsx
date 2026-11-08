'use client';

// Adapted from Watermelon UI "command-search" (ui.watermelon.sh): controlled open state, opened with
// ⌘K / Ctrl+K or "/", centred as a dialog, theme tokens, and free-form sections.

import { useState, useMemo, useEffect, useRef, type KeyboardEvent, type FC, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommandItem {
  id: string;
  title: string;
  section: string;
  icon: ReactNode;
  hint?: string;
  keywords?: string;
  action: () => void;
}

interface Props {
  items: CommandItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandSearch: FC<Props> = ({ items, open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName ?? '');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === '/' && !open && !typing) {
        e.preventDefault();
        onOpenChange(true);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onOpenChange]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => !q || `${i.title} ${i.keywords ?? ''} ${i.section}`.toLowerCase().includes(q));
  }, [query, items]);

  useEffect(() => setActiveIndex(0), [query]);

  const sections = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    filtered.forEach((i) => groups.set(i.section, [...(groups.get(i.section) ?? []), i]));
    return [...groups.entries()];
  }, [filtered]);

  const run = (item?: CommandItem) => {
    if (!item) return;
    onOpenChange(false);
    setTimeout(item.action, 80);
  };

  const onInputKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((p) => (p + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((p) => (p - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === 'Enter') {
      run(filtered[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[14vh]" role="dialog" aria-modal="true" aria-label="Command palette">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="relative flex max-h-[60vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search size={18} className="text-muted-foreground" strokeWidth={2.2} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Jump to a section, project or link…"
                className="w-full bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                aria-label="Search"
              />
              <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">Esc</kbd>
            </div>
            <div className="flex-1 overflow-y-auto p-1.5" data-lenis-prevent>
              {filtered.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">Nothing matches “{query}”</p>
              ) : (
                <div className="space-y-3 py-1">
                  {sections.map(([name, list]) => (
                    <div key={name}>
                      <h3 className="px-3 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{name}</h3>
                      {list.map((item) => {
                        const index = filtered.indexOf(item);
                        const active = index === activeIndex;
                        return (
                          <button
                            key={item.id}
                            className={cn(
                              'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors',
                              active ? 'bg-accent text-foreground' : 'text-muted-foreground',
                            )}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => run(item)}
                          >
                            <span className="flex items-center gap-3">
                              <span className={active ? 'text-primary' : ''}>{item.icon}</span>
                              <span className="text-sm font-medium">{item.title}</span>
                            </span>
                            {item.hint && <span className="text-xs text-muted-foreground">{item.hint}</span>}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span className="ml-auto">⌘K toggle</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
