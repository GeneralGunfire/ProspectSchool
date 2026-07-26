import type { ReactNode } from 'react';
import { motion } from 'motion/react';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

export interface PageHeroStat {
  value: ReactNode;
  label: string;
}

interface PageHeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Single readout pill shown at the right of the title row, e.g. "12 resources" or an average ring. */
  stat?: PageHeroStat;
  /** Fully custom node instead of `stat`, for things like the Marks page's ring+label combo. */
  statSlot?: ReactNode;
  /** Extra content below the subtitle (search bar, filter pills) that should still sit inside the hero band. */
  children?: ReactNode;
}

/**
 * Shared page header used across student portal pages: eyebrow line, serif
 * title, subtitle, and an optional stat readout — replaces the near-identical
 * block that was previously copy-pasted into every page file.
 */
export default function PageHero({ eyebrow, title, subtitle, stat, statSlot, children }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-brand-border">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0"
          >
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">{eyebrow}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-wrap items-end justify-between gap-4 mt-2"
        >
          <div className="min-w-0">
            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.06 }}
              className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] min-w-0"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <p className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {(stat || statSlot) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="shrink-0"
            >
              {statSlot ?? (
                <div className="border border-brand-border bg-white/70 rounded px-3.5 py-2 sm:px-4 sm:py-2.5 text-center">
                  <p className="font-black text-base sm:text-2xl leading-none text-brand-dark">{stat!.value}</p>
                  <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[rgba(31,36,33,0.5)] mt-1">{stat!.label}</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {children}
      </div>
    </div>
  );
}
