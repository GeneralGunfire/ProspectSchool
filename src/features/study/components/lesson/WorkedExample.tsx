// ── WorkedExample — step-by-step reveal for full/partial/independent practice ──
// Fading sequence per Part B section 3: revealSteps === steps.length is a full
// worked example (all steps shown up front); 0 < revealSteps < steps.length is
// a partially-worked "completion" problem; revealSteps === 0 is independent
// (handled by IndependentPractice, not this component).

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import type { WorkedExampleContent } from '../../data/library/types';

const EASE = [0.23, 1, 0.32, 1] as const;

export function WorkedExample({
  example,
  revealSteps,
}: {
  example: WorkedExampleContent;
  revealSteps?: number; // defaults to fully worked
}) {
  const total = example.steps.length;
  const initialShown = revealSteps ?? total;
  const [shown, setShown] = useState(initialShown);
  const [done, setDone] = useState(shown >= total);

  const advance = () => {
    setShown(s => {
      const next = Math.min(s + 1, total);
      if (next >= total) setDone(true);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden my-5">
      <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50/60">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">Worked Example</p>
        <p className="text-[14px] font-bold text-[#1e293b] leading-snug">{example.prompt}</p>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        <AnimatePresence initial={false}>
          {example.steps.slice(0, shown).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-start gap-3 rounded-xl border border-stone-100 bg-stone-50/40 px-4 py-3"
            >
              <span className="w-5 h-5 rounded-md bg-[#1e293b] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-white">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-mono font-semibold text-stone-800">{step.step}</p>
                <p className="text-[12px] text-stone-500 mt-0.5">{step.justification}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!done && (
          <button
            onClick={advance}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold text-stone-500 border border-dashed border-stone-300 hover:border-stone-400 hover:text-stone-700 transition-colors"
          >
            Show next step <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 px-4 py-3"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[13px] font-bold text-emerald-800">Answer: {example.answer}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
