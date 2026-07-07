'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from './icons';

export interface HoverExpandItem {
  label: string;
  // Either a real image URL, or an icon + gradient pair rendered as a local
  // CSS background — avoids depending on an external image host resolving.
  image?: string;
  icon?: LucideIcon;
  gradient?: string;
  sublabel?: string;
  description?: string;
  imageAlt?: string;
  onClick?: () => void;
}

interface HoverExpandProps {
  items: HoverExpandItem[];
  collapsedHeight?: number;
  expandedHeight?: number;
  className?: string;
}

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 32, mass: 0.9 };

export const HoverExpand = ({
  items,
  collapsedHeight = 68,
  expandedHeight = 320,
  className = '',
}: HoverExpandProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {items.map((item, i) => {
        const isActive = activeIndex === i;
        const isDimmed = activeIndex !== null && !isActive;
        const Icon = item.icon;

        return (
          <motion.div
            key={item.label}
            onHoverStart={() => setActiveIndex(i)}
            onHoverEnd={() => setActiveIndex(null)}
            onClick={item.onClick}
            animate={{ height: isActive ? expandedHeight : collapsedHeight, opacity: isDimmed ? 0.38 : 1 }}
            transition={SPRING}
            className="relative overflow-hidden cursor-pointer border-b border-brand-border/60 first:border-t"
          >
            {item.image ? (
              <motion.img
                src={item.image}
                alt={item.imageAlt ?? ''}
                loading="lazy"
                decoding="async"
                initial={false}
                animate={{ scale: isActive ? 1 : 1.06 }}
                transition={SPRING}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <motion.div
                initial={false}
                animate={{ scale: isActive ? 1 : 1.06 }}
                transition={SPRING}
                className="absolute inset-0 w-full h-full"
                style={{ background: item.gradient ?? 'var(--color-brand-dark)' }}
              >
                {Icon && (
                  <Icon
                    className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10"
                    strokeWidth={1.25}
                  />
                )}
              </motion.div>
            )}

            {/* Legibility gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

            {/* Row content */}
            <div className="relative z-10 h-full flex items-center justify-between px-6 md:px-8">
              <div className="flex items-baseline gap-3 min-w-0">
                <h3 className="text-white font-black text-lg md:text-xl tracking-tight truncate">{item.label}</h3>
                {item.sublabel && (
                  <span className="text-white/60 text-[11px] font-black uppercase tracking-[0.18em] shrink-0">
                    {item.sublabel}
                  </span>
                )}
              </div>

              {item.description && (
                <motion.p
                  initial={false}
                  animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                  transition={{ ...SPRING, delay: isActive ? 0.12 : 0 }}
                  className="hidden sm:block text-white/75 text-[13px] font-medium max-w-[32ch] text-right shrink-0"
                >
                  {item.description}
                </motion.p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
