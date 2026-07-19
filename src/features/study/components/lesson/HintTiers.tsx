// ── HintTiers — 3-tier progressive hint system for independent practice ──────
// Part B section 5: strategic -> procedural -> worked step, requested in order,
// one tier at a time (learner chooses to escalate, not shown all at once).

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import type { HintTiers as HintTiersType } from '../../data/library/types';

const EASE = [0.23, 1, 0.32, 1] as const;
const TIER_LABELS = ['Strategic hint', 'Procedural hint', 'Worked step'] as const;

export function HintTiers({ hints }: { hints: HintTiersType }) {
  const [tier, setTier] = useState(0); // number of tiers revealed
  const tierText = [hints.strategic, hints.procedural, hints.workedStep];

  return (
    <div className="my-3">
      <AnimatePresence initial={false}>
        {Array.from({ length: tier }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="flex items-start gap-2.5 rounded-xl bg-blue-50/60 border border-blue-100 px-4 py-2.5 mb-2"
          >
            <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-700">{TIER_LABELS[i]}</p>
              <p className="text-[13px] text-stone-700 leading-relaxed mt-0.5">{tierText[i]}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {tier < 3 && (
        <button
          onClick={() => setTier(t => t + 1)}
          className="flex items-center gap-1.5 text-[12px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {tier === 0 ? 'Need a hint?' : 'Show me more'}
        </button>
      )}
    </div>
  );
}
