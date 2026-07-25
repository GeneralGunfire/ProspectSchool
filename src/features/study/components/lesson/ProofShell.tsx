// ── ProofShell — interactive statement/reason proof exercise ─────────────────
// New for Geometry (Euclidean). Per the research's explicit call for
// "select a reason next to each statement" interactivity, distinct from any
// existing quiz/practice item type — each row shows a fixed statement and a
// set of reason options; the learner must pick the correct reason before
// the row is marked resolved. Fires onAllResolved once every row is correct.

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { ProofSpec, ProofStepSpec } from '../../data/library/types';

export function ProofShell({ proof, onAllResolved }: { proof: ProofSpec; onAllResolved?: () => void }) {
  const [resolvedCount, setResolvedCount] = useState(0);
  const [rowStates, setRowStates] = useState<boolean[]>(() => proof.steps.map(() => false));

  const markResolved = (idx: number) => {
    setRowStates(prev => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  useEffect(() => {
    const count = rowStates.filter(Boolean).length;
    setResolvedCount(count);
    if (count === proof.steps.length && proof.steps.length > 0) onAllResolved?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowStates]);

  return (
    <div className="paper-card rounded overflow-hidden my-5">
      <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50/60 space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Proof</p>
        {proof.given.map((g, i) => (
          <p key={i} className="text-[13px] text-stone-700"><span className="font-bold">Given:</span> {g}</p>
        ))}
        <p className="text-[13px] text-stone-700"><span className="font-bold">Prove:</span> {proof.prove}</p>
      </div>
      <div className="px-5">
        {proof.steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            <ProofRowWithCallback step={step} index={i} onResolved={() => markResolved(i)} />
          </motion.div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-stone-100">
        <p className="text-[11.5px] font-bold text-stone-500">{resolvedCount}/{proof.steps.length} statements matched to the correct reason</p>
      </div>
    </div>
  );
}

function ProofRowWithCallback({ step, index, onResolved }: { step: ProofStepSpec; index: number; onResolved: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const isCorrect = selected === step.correctReason;

  useEffect(() => {
    if (isCorrect) onResolved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCorrect]);

  return (
    <div className="border-b border-stone-100 last:border-b-0 py-3">
      <div className="flex items-start gap-2">
        <span className="w-5 h-5 rounded-md bg-[#1e293b] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-white">{index + 1}</span>
        <p className="text-[13px] font-mono font-semibold text-stone-800 flex-1">{step.statement}</p>
      </div>
      <div className="mt-2 ml-7 flex flex-wrap gap-1.5">
        {step.reasonOptions.map((opt, i) => {
          const active = selected === opt;
          return (
            <button
              key={i}
              disabled={isCorrect}
              onClick={() => setSelected(opt)}
              className={`px-2.5 py-1.5 rounded-lg border text-[11.5px] font-medium transition-all ${
                active && isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold' :
                active && !isCorrect ? 'border-red-200 bg-red-50 text-red-800' :
                'border-stone-200 bg-stone-50/40 hover:border-stone-300 text-stone-600'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="ml-7 mt-1.5 flex items-center gap-1.5">
          {isCorrect ? (
            <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /><p className="text-[11px] font-bold text-emerald-700">Correct reason</p></>
          ) : (
            <><XCircle className="w-3.5 h-3.5 text-red-500" /><p className="text-[11px] font-bold text-red-600">Not quite — try another reason</p></>
          )}
        </div>
      )}
    </div>
  );
}
