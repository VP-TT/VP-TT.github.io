'use client';

// Adapted from Watermelon UI "discrete-tabs" (ui.watermelon.sh): smaller sizing for a filter bar,
// theme tokens instead of fixed greys, and proper tab semantics.

import { useEffect, useState, type FC, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  icon: ReactNode;
  label: string;
}

interface DiscreteTabsProps {
  tabs: TabItem[];
  onTabChange?: (tabId: string) => void;
  defaultTab?: string;
}

export const DiscreteTabs: FC<DiscreteTabsProps> = ({ tabs, onTabChange, defaultTab }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id);
  const [shine, setShine] = useState<boolean>(false);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShine(true), 600);
    return () => {
      clearTimeout(timer);
      setShine(false);
    };
  }, [activeTab]);

  return (
    <motion.div layout role="tablist" className="flex w-fit flex-wrap items-center justify-center gap-2 overflow-hidden">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            onClick={() => handleTabClick(tab.id)}
            className="relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <motion.div layout="position" transition={{ type: 'spring', stiffness: 210, damping: 18, mass: 1 }}>
              <div
                className={cn(
                  'flex h-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card px-3 transition-colors',
                  isActive && 'border-primary/40 bg-primary/8',
                )}
              >
                <div className={cn('flex items-center justify-center transition-colors duration-300', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {tab.icon}
                </div>
                <motion.span
                  initial={false}
                  animate={{ width: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0, marginLeft: isActive ? 8 : 0 }}
                  className={cn('relative overflow-hidden text-sm font-semibold whitespace-nowrap', isActive ? 'text-primary' : 'text-foreground')}
                >
                  {tab.label}
                  <AnimatePresence>
                    {isActive && shine && (
                      <motion.span
                        initial={{ left: '-120%' }}
                        animate={{ left: '120%' }}
                        transition={{ duration: 0.5, ease: 'linear' }}
                        className="absolute top-0 bottom-0 w-12 bg-linear-to-r from-transparent via-white/70 to-transparent dark:via-white/25"
                      />
                    )}
                  </AnimatePresence>
                </motion.span>
              </div>
            </motion.div>
          </button>
        );
      })}
    </motion.div>
  );
};
