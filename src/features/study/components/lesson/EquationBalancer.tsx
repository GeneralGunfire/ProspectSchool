// ── EquationBalancer — interactive chemical equation balancing exercise ──────
// New for Physical Sciences (Chemistry: representing chemical change). Per
// the research's recommendation, this is a real interactive component (not
// a plain quiz item) — learner adjusts coefficients, sees live atom counts
// on each side, and gets immediate visual feedback on balance. Fires
// onBalanced once the equation is correctly balanced.

import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { EquationSpec, EquationSpeciesSpec } from '../../data/library/types';

function countAtoms(species: EquationSpeciesSpec[], coefficients: number[]): Record<string, number> {
  const totals: Record<string, number> = {};
  species.forEach((s, i) => {
    const coeff = coefficients[i] ?? 1;
    for (const [el, count] of Object.entries(s.elements)) {
      totals[el] = (totals[el] ?? 0) + count * coeff;
    }
  });
  return totals;
}

function CoefficientStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(1, value - 1))} className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-sm">−</button>
      <span className="w-5 text-center font-black text-[#1e293b]">{value}</span>
      <button onClick={() => onChange(Math.min(9, value + 1))} className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-sm">+</button>
    </div>
  );
}

export function EquationBalancer({ equation, onBalanced }: { equation: EquationSpec; onBalanced?: () => void }) {
  const [reactantCoeffs, setReactantCoeffs] = useState<number[]>(() => equation.reactants.map(() => 1));
  const [productCoeffs, setProductCoeffs] = useState<number[]>(() => equation.products.map(() => 1));

  const reactantAtoms = useMemo(() => countAtoms(equation.reactants, reactantCoeffs), [equation.reactants, reactantCoeffs]);
  const productAtoms = useMemo(() => countAtoms(equation.products, productCoeffs), [equation.products, productCoeffs]);

  const allElements = useMemo(() => {
    const set = new Set<string>();
    Object.keys(reactantAtoms).forEach(e => set.add(e));
    Object.keys(productAtoms).forEach(e => set.add(e));
    return Array.from(set);
  }, [reactantAtoms, productAtoms]);

  const isBalanced = allElements.length > 0 && allElements.every(el => (reactantAtoms[el] ?? 0) === (productAtoms[el] ?? 0));

  useEffect(() => {
    if (isBalanced) onBalanced?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBalanced]);

  return (
    <div className="paper-card rounded overflow-hidden my-5">
      <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50/60">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Balance the Equation</p>
      </div>
      <div className="px-5 py-4 flex flex-wrap items-center gap-2">
        {equation.reactants.map((s, i) => (
          <div key={s.formula} className="flex items-center gap-2">
            {i > 0 && <span className="text-stone-400 font-bold">+</span>}
            <CoefficientStepper value={reactantCoeffs[i]} onChange={v => setReactantCoeffs(prev => prev.map((p, idx) => idx === i ? v : p))} />
            <span className="font-mono font-bold text-[#1e293b]">{s.formula}</span>
          </div>
        ))}
        <span className="text-stone-500 font-black mx-1">→</span>
        {equation.products.map((s, i) => (
          <div key={s.formula} className="flex items-center gap-2">
            {i > 0 && <span className="text-stone-400 font-bold">+</span>}
            <CoefficientStepper value={productCoeffs[i]} onChange={v => setProductCoeffs(prev => prev.map((p, idx) => idx === i ? v : p))} />
            <span className="font-mono font-bold text-[#1e293b]">{s.formula}</span>
          </div>
        ))}
      </div>
      <div className="px-5 pb-4">
        <div className="flex flex-wrap gap-2">
          {allElements.map(el => {
            const l = reactantAtoms[el] ?? 0, r = productAtoms[el] ?? 0;
            const match = l === r;
            return (
              <span key={el} className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${match ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                {el}: {l} / {r}
              </span>
            );
          })}
        </div>
      </div>
      {isBalanced && (
        <div className="px-5 pb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <p className="text-[12px] font-bold text-emerald-700">Balanced — every element matches on both sides.</p>
        </div>
      )}
    </div>
  );
}
