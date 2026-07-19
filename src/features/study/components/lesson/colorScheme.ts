// ── Number-set color coding — single source of truth for every topic ─────────
// Per Part B section 9 (signaling): used identically everywhere a number set
// is referenced (badges, number-line ticks, worked-example annotations).
// Chosen to stay legible against the existing warm-beige/stone design system
// (see QuizBlock.tsx / LessonEnrichment.tsx) and distinguishable at a glance.

export const NUMBER_SET_COLORS = {
  N: { label: 'Natural (N)', text: 'text-sky-700', bg: 'bg-sky-100', dot: 'bg-sky-500', border: 'border-sky-200' },
  W: { label: 'Whole (W)', text: 'text-teal-700', bg: 'bg-teal-100', dot: 'bg-teal-500', border: 'border-teal-200' },
  Z: { label: 'Integers (Z)', text: 'text-indigo-700', bg: 'bg-indigo-100', dot: 'bg-indigo-500', border: 'border-indigo-200' },
  Q: { label: 'Rational (Q)', text: 'text-emerald-700', bg: 'bg-emerald-100', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  QPrime: { label: 'Irrational (Q′)', text: 'text-amber-700', bg: 'bg-amber-100', dot: 'bg-amber-500', border: 'border-amber-200' },
  R: { label: 'Real (R)', text: 'text-stone-700', bg: 'bg-stone-200', dot: 'bg-stone-500', border: 'border-stone-300' },
} as const;

export type NumberSetKey = keyof typeof NUMBER_SET_COLORS;
