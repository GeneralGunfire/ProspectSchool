// ── QuizBlock — "Test Yourself" section for lesson pages ─────────────────────

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2, XCircle, RotateCcw, Trophy,
  BookOpen, Shuffle, ArrowRight, Star, ChevronLeft, ChevronRight,
} from 'lucide-react';

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface QuizRecord {
  storageKey: string;
  score: number;
  total: number;
  completedAt: string;
}

// ── localStorage ──────────────────────────────────────────────────────────────
const LS_PREFIX = 'prospect_quiz_';

export function saveQuizResult(storageKey: string, score: number, total: number) {
  try {
    localStorage.setItem(LS_PREFIX + storageKey, JSON.stringify({
      storageKey, score, total, completedAt: new Date().toISOString(),
    } satisfies QuizRecord));
  } catch {}
}

export function loadQuizResult(storageKey: string): QuizRecord | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const EASE = [0.23, 1, 0.32, 1] as const;
const BG   = '#F5F0E8';
const DARK = '#1C1917';
const LABELS = ['A', 'B', 'C', 'D'];

type Phase = 'idle' | 'active' | 'review';

interface QuizState {
  questions: QuizQuestion[];
  current: number;
  selections: (number | null)[];
  revealed: boolean[];
  score: number;
  timeLeft: number;
  phase: Phase;
}

// ── Option row ────────────────────────────────────────────────────────────────
function OptionRow({
  label, index, selected, revealed, correctIndex, onSelect,
}: {
  label: string; index: number; selected: number | null;
  revealed: boolean; correctIndex: number; onSelect: (i: number) => void;
}) {
  const isCorrect  = index === correctIndex;
  const isSelected = index === selected;
  const letter     = LABELS[index];

  let containerCls = 'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ';
  let labelCls = 'w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition-all ';
  let textCls = 'text-sm font-medium leading-snug flex-1 ';

  if (!revealed) {
    if (isSelected) {
      containerCls += 'border-[#1C1917] bg-[#1C1917]';
      labelCls += 'bg-white text-[#1C1917]';
      textCls += 'text-white font-bold';
    } else {
      containerCls += 'border-stone-200 bg-stone-50/40 hover:border-stone-300 hover:bg-white cursor-pointer';
      labelCls += 'bg-stone-200 text-stone-500';
      textCls += 'text-stone-700';
    }
  } else if (isCorrect) {
    containerCls += 'border-emerald-300 bg-emerald-50';
    labelCls += 'bg-emerald-500 text-white';
    textCls += 'text-emerald-900 font-semibold';
  } else if (isSelected) {
    containerCls += 'border-red-200 bg-red-50';
    labelCls += 'bg-red-400 text-white';
    textCls += 'text-red-800';
  } else {
    containerCls += 'border-stone-100 bg-white opacity-50';
    labelCls += 'bg-stone-100 text-stone-300';
    textCls += 'text-stone-400';
  }

  return (
    <motion.button
      whileHover={!revealed ? { scale: 1.005, y: -1 } : {}}
      whileTap={!revealed ? { scale: 0.995 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={containerCls}
      onClick={() => !revealed && onSelect(index)}
      disabled={revealed}
    >
      <span className={labelCls}>
        {revealed && isCorrect  ? '✓' :
         revealed && isSelected ? '✗' :
         letter}
      </span>
      <span className={textCls}>{label}</span>
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function QuizBlock({
  storageKey,
  questions,
  timerSeconds = 0,
  shuffle = true,
}: {
  storageKey: string;
  questions: QuizQuestion[];
  timerSeconds?: number;
  shuffle?: boolean;
}) {
  const prev = loadQuizResult(storageKey);

  const buildState = useCallback((): QuizState => ({
    questions: shuffle ? shuffleArray(questions) : questions,
    current:   0,
    selections: new Array(questions.length).fill(null),
    revealed:   new Array(questions.length).fill(false),
    score:      0,
    timeLeft:   timerSeconds,
    phase:      'active',
  }), [questions, shuffle, timerSeconds]);

  const [state, setState] = useState<QuizState | null>(null);

  useEffect(() => {
    if (!state || state.phase !== 'active' || timerSeconds === 0) return;
    if (state.timeLeft <= 0) { setState(s => s ? { ...s, phase: 'review' } : s); return; }
    const id = setInterval(() => setState(s => {
      if (!s) return s;
      const t = s.timeLeft - 1;
      return t <= 0 ? { ...s, timeLeft: 0, phase: 'review' } : { ...s, timeLeft: t };
    }), 1000);
    return () => clearInterval(id);
  }, [state?.phase, state?.timeLeft, timerSeconds]);

  const selectAnswer = (qi: number, oi: number) => setState(s => {
    if (!s) return s;
    const newSels  = [...s.selections];  newSels[qi]  = oi;
    const newRevld = [...s.revealed];    newRevld[qi] = true;
    return { ...s, selections: newSels, revealed: newRevld,
             score: s.score + (oi === s.questions[qi].answer ? 1 : 0) };
  });

  const goTo   = (i: number) => setState(s => s ? { ...s, current: i } : s);
  const submit = () => { if (!state) return; saveQuizResult(storageKey, state.score, state.questions.length); setState(s => s ? { ...s, phase: 'review' } : s); };
  const retry  = () => setState(buildState());

  const allAnswered = state?.revealed.every(Boolean) ?? false;
  const pct         = state ? Math.round((state.score / state.questions.length) * 100) : 0;

  // ── IDLE ──────────────────────────────────────────────────────────────────
  if (!state) {
    return (
      <div className="mt-14 pt-8" style={{ borderTop: '1.5px dashed #D6CFC4' }}>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: DARK }}>
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900 tracking-tight">Test Yourself</h3>
              <p className="text-[12px] text-stone-400 mt-0.5">{questions.length} questions · instant feedback</p>
            </div>
          </div>

          {prev && (
            <div className="shrink-0 text-right">
              <div className="flex items-center gap-1 justify-end mb-0.5">
                <Star className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Best</span>
              </div>
              <span className={`text-base font-black ${
                prev.score / prev.total >= 0.7 ? 'text-emerald-600' :
                prev.score / prev.total >= 0.5 ? 'text-amber-500' : 'text-red-500'
              }`}>
                {prev.score}/{prev.total}
              </span>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          onClick={() => setState(buildState())}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-black tracking-wide shadow-sm"
          style={{ background: DARK, color: 'white' }}
        >
          {prev ? <><RotateCcw className="w-3.5 h-3.5" /> Try Again</> : <><ArrowRight className="w-3.5 h-3.5" /> Start Quiz</>}
        </motion.button>
      </div>
    );
  }

  // ── REVIEW ────────────────────────────────────────────────────────────────
  if (state.phase === 'review') {
    const mastered = pct >= 70;
    return (
      <div className="mt-14 pt-8 space-y-6" style={{ borderTop: '1.5px dashed #D6CFC4' }}>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="rounded-2xl overflow-hidden"
          style={{ background: DARK }}
        >
          <div className="px-6 py-7 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${mastered ? 'bg-emerald-500' : 'bg-amber-400'}`}>
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div className="text-5xl font-black text-white tracking-tight mb-1">
              {state.score}<span className="text-2xl text-white/30">/{state.questions.length}</span>
            </div>
            <p className={`text-[13px] font-bold mt-1.5 ${mastered ? 'text-emerald-400' : 'text-amber-400'}`}>
              {pct}% · {mastered ? 'Excellent work!' : "Keep going — you're getting there"}
            </p>
            {/* Progress bar */}
            <div className="mt-4 bg-stone-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                className={`h-full rounded-full ${mastered ? 'bg-emerald-500' : 'bg-amber-400'}`}
              />
            </div>
          </div>
        </motion.div>

        {/* Review rows */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Review</p>
          {state.questions.map((q, qi) => {
            const sel     = state.selections[qi];
            const correct = sel === q.answer;
            return (
              <motion.div
                key={qi}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qi * 0.04, ease: EASE }}
                className={`rounded-2xl border overflow-hidden ${correct ? 'border-emerald-200 bg-emerald-50/30' : 'border-stone-200 bg-white'}`}
              >
                <div className="flex items-start gap-3 p-4">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${correct ? 'bg-emerald-500' : 'bg-red-400'}`}>
                    {correct
                      ? <CheckCircle2 className="w-3 h-3 text-white" />
                      : <XCircle className="w-3 h-3 text-white" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-stone-900 leading-snug">{q.q}</p>
                    {!correct && sel !== null && (
                      <p className="text-[11px] text-red-500 mt-1">
                        Your answer: {q.options[sel]}
                      </p>
                    )}
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      ✓ {q.options[q.answer]}
                    </p>
                    {!correct && (
                      <div className="mt-2.5 px-3 py-2.5 rounded-xl text-[12px] text-stone-600 leading-relaxed border border-stone-200/60"
                           style={{ background: BG }}>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          onClick={retry}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black"
          style={{ background: DARK, color: 'white' }}
        >
          <Shuffle className="w-3.5 h-3.5" /> Shuffle & Try Again
        </motion.button>
      </div>
    );
  }

  // ── ACTIVE ────────────────────────────────────────────────────────────────
  const q   = state.questions[state.current];
  const sel = state.selections[state.current];
  const rev = state.revealed[state.current];
  const isLast = state.current === state.questions.length - 1;

  return (
    <div className="mt-14 pt-8 space-y-5" style={{ borderTop: '1.5px dashed #D6CFC4' }}>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-black text-stone-900 tracking-tight">Test Yourself</h3>
          {/* Progress dots */}
          <div className="flex gap-1 items-center">
            {state.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === state.current ? 24 : 14,
                  height: 5,
                  background:
                    i === state.current ? DARK :
                    state.revealed[i]
                      ? state.selections[i] === state.questions[i].answer ? '#10b981' : '#f87171'
                      : '#e7e0d5',
                }}
                aria-label={`Question ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">
          {state.current + 1} / {state.questions.length}
        </span>
      </div>

      {/* Unified question + options card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.current}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
        >
          {/* Question */}
          <div className="px-5 pt-5 pb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2.5">
              Question {state.current + 1}
            </p>
            <p className="text-[16px] font-black text-[#1C1917] leading-snug">{q.q}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100 mx-5" />

          {/* Options */}
          <div className="px-5 py-4 space-y-2">
            {q.options.map((opt, i) => (
              <OptionRow
                key={i}
                label={opt}
                index={i}
                selected={sel}
                revealed={rev}
                correctIndex={q.answer}
                onSelect={oi => selectAnswer(state.current, oi)}
              />
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {rev && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="overflow-hidden"
              >
                <div className={`mx-5 mb-5 rounded-xl px-4 py-3.5 border ${
                  sel === q.answer
                    ? 'bg-emerald-50 border-emerald-200/80'
                    : 'bg-[#F5F0E8] border-stone-200/80'
                }`}>
                  <p className={`text-[10px] font-black uppercase tracking-[0.18em] mb-1.5 ${
                    sel === q.answer ? 'text-emerald-600' : 'text-stone-400'
                  }`}>
                    {sel === q.answer ? 'Correct!' : 'Explanation'}
                  </p>
                  <p className={`text-[13px] leading-relaxed ${
                    sel === q.answer ? 'text-emerald-800' : 'text-stone-700'
                  }`}>
                    {q.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer nav */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-stone-100 bg-stone-50/50">
            <button
              onClick={() => goTo(Math.max(0, state.current - 1))}
              disabled={state.current === 0}
              className="flex items-center gap-1 text-[12px] font-bold text-stone-400 hover:text-stone-800 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <span className={`text-[11px] font-bold flex items-center gap-1.5 ${rev ? (sel === q.answer ? 'text-emerald-600' : 'text-red-400') : 'text-stone-300'}`}>
              {rev && sel === q.answer && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
              {rev && sel !== q.answer && <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />}
              {rev ? (sel === q.answer ? 'Correct' : 'Incorrect') : 'Select an answer'}
            </span>

            {isLast && allAnswered ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={submit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-black text-white shadow-sm"
                style={{ background: DARK }}
              >
                <Trophy className="w-3.5 h-3.5" /> Results
              </motion.button>
            ) : (
              <button
                onClick={() => goTo(Math.min(state.questions.length - 1, state.current + 1))}
                disabled={state.current === state.questions.length - 1}
                className="flex items-center gap-1 text-[12px] font-bold text-stone-400 hover:text-stone-800 disabled:opacity-20 transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
