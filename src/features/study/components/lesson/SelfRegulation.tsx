// ── Self-regulated-learning scaffolding — goal-setting, confidence checks, reflection ──
// Part B section 10. Replaces what a live teacher would normally provide.

import { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Sparkles } from 'lucide-react';
import type { ReflectionPrompt } from '../../data/library/types';

const EASE = [0.23, 1, 0.32, 1] as const;

// ── Goal setting (lesson start) ────────────────────────────────────────────────

export function GoalSetting({
  prompt,
  objectives,
  onContinue,
}: {
  prompt: string;
  objectives: string[];
  onContinue: (confidence: number) => void;
}) {
  const [confidence, setConfidence] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="paper-card rounded overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2.5">
        <Target className="w-4 h-4 text-stone-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Before you start</p>
      </div>
      <div className="px-5 py-4">
        <p className="text-[14px] font-bold text-[#1e293b] leading-snug mb-3">{prompt}</p>
        <ul className="space-y-1.5 mb-5">
          {objectives.map((o, i) => (
            <li key={i} className="text-[13px] text-stone-600 flex items-start gap-2">
              <span className="text-stone-300 mt-0.5">•</span>{o}
            </li>
          ))}
        </ul>
        <p className="text-[12px] font-bold text-stone-500 mb-2">How confident do you feel about this topic right now?</p>
        <div className="flex gap-1.5 mb-5">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setConfidence(n)}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-black transition-all ${
                confidence === n ? 'bg-[#1e293b] text-white' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          disabled={confidence === null}
          onClick={() => onContinue(confidence ?? 3)}
          className="w-full py-3 rounded-xl text-sm font-black text-white bg-[#1e293b] disabled:opacity-30 transition-opacity"
        >
          Start the lesson
        </button>
      </div>
    </motion.div>
  );
}

// ── Mid-lesson confidence self-check ───────────────────────────────────────────

export function ConfidenceCheck({
  prompt,
  onRate,
}: {
  prompt: string;
  onRate: (rating: number) => void;
}) {
  const [rated, setRated] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-3.5 my-6">
      <p className="text-[12.5px] font-bold text-stone-600 mb-2.5">{prompt}</p>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => { setRated(n); onRate(n); }}
            className={`flex-1 py-2 rounded-lg text-[12px] font-black transition-all ${
              rated === n ? 'bg-[#1e293b] text-white' : 'bg-white border border-stone-200 text-stone-400 hover:border-stone-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {rated !== null && rated <= 2 && (
        <p className="text-[11.5px] text-amber-700 mt-2">
          Consider reviewing the last worked example again before continuing, or try an extra practice question.
        </p>
      )}
    </div>
  );
}

// ── End-of-lesson reflection ────────────────────────────────────────────────────

export function Reflection({
  prompts,
  onComplete,
}: {
  prompts: ReflectionPrompt[];
  onComplete: (answers: Record<string, string | number>) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  const setAnswer = (id: string, value: string | number) =>
    setAnswers(a => ({ ...a, [id]: value }));

  const allAnswered = prompts.every(p => answers[p.id] !== undefined);

  return (
    <div className="paper-card rounded overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-stone-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Reflect</p>
      </div>
      <div className="px-5 py-4 space-y-5">
        {prompts.map(p => (
          <div key={p.id}>
            <p className="text-[13.5px] font-bold text-stone-700 mb-2.5">{p.prompt}</p>
            {p.type === 'confidence-scale' && (
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setAnswer(p.id, n)}
                    className={`flex-1 py-2.5 rounded-xl text-[13px] font-black transition-all ${
                      answers[p.id] === n ? 'bg-[#1e293b] text-white' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
            {p.type === 'multiple-choice' && p.options && (
              <div className="space-y-2">
                {p.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswer(p.id, opt)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                      answers[p.id] === opt
                        ? 'border-[#1e293b] bg-[#1e293b] text-white font-bold'
                        : 'border-stone-200 bg-stone-50/40 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {p.type === 'free-text' && (
              <textarea
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-[13px] text-stone-700 resize-none focus:outline-none focus:border-stone-400"
                rows={2}
                placeholder="Type your answer..."
                value={(answers[p.id] as string) ?? ''}
                onChange={e => setAnswer(p.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <button
          disabled={!allAnswered}
          onClick={() => onComplete(answers)}
          className="w-full py-3 rounded-xl text-sm font-black text-white bg-[#1e293b] disabled:opacity-30 transition-opacity"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
