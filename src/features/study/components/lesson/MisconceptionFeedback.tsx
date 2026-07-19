// ── MisconceptionFeedback — 4-part wrong-answer feedback, per misconception ───
// Part B section 5: name error -> explain principle -> show correct step -> prompt re-attempt.
// Distinct branch per misconception id (not a generic "incorrect" message).

import { motion } from 'motion/react';
import { XCircle, RotateCcw } from 'lucide-react';
import type { Misconception } from '../../data/library/types';

const EASE = [0.23, 1, 0.32, 1] as const;

export function MisconceptionFeedback({
  misconception,
  onRetry,
}: {
  misconception: Misconception;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.25, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="rounded-xl border border-red-200/80 bg-red-50 px-4 py-3.5 space-y-2">
        <div className="flex items-start gap-2.5">
          <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[13px] font-bold text-red-900 leading-snug">{misconception.errorType}</p>
        </div>
        <p className="text-[12.5px] text-stone-700 leading-relaxed pl-6.5">{misconception.principle}</p>
        <p className="text-[13px] font-mono font-semibold text-stone-800 pl-6.5">{misconception.correctStep}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-6.5 flex items-center gap-1.5 text-[12px] font-bold text-red-600 hover:text-red-800 transition-colors mt-1"
          >
            <RotateCcw className="w-3 h-3" /> Try a similar question
          </button>
        )}
      </div>
    </motion.div>
  );
}
