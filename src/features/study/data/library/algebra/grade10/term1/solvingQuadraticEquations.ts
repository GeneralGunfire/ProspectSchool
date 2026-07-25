// ── Topic 7: Solving Quadratic Equations — Algebra, Grade 10, Term 1 ─────────
// Dedicated Perplexity research pass run (misconception-prone, per
// LIBRARY_PARTNER_HANDOFF.md §4) — see
// .planning/research/LIBRARY_ALGEBRA_TOPIC7_8_RESEARCH.md. Builds on Topic 4
// (factorisation) and Topic 6 (solving linear equations); the zero-product
// principle is the one genuinely new idea.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'not-set-to-zero',
    label: 'Trying to factorise before setting the equation to zero',
    errorType: 'You tried to factorise or solve the equation before rearranging it so one side is zero.',
    principle: 'The zero-product principle only works when one side of the equation is exactly 0. Any quadratic equation must be rearranged to "ax² + bx + c = 0" form before you factorise and solve.',
    correctStep: 'x² + 5x = 6 must first become x² + 5x - 6 = 0 before factorising.',
  },
  {
    id: 'zero-product-nonzero',
    label: 'Applying the zero-product rule to a product that isn\'t zero',
    errorType: 'You set each factor equal to a nonzero number, instead of only using this method when the product equals zero.',
    principle: 'The rule "if AB = 0 then A = 0 or B = 0" ONLY works when the product equals exactly zero. If (x-2)(x-3) = 6, you cannot conclude x-2=6 or x-3=6 — you\'d need to expand and rearrange to "=0" first, then re-factorise.',
    correctStep: '(x-2)(x-3) = 6 → expand: x²-5x+6=6 → x²-5x=0 → x(x-5)=0 → x=0 or x=5.',
  },
  {
    id: 'lose-one-root',
    label: 'Reporting only one of the two solutions',
    errorType: 'You found one factor equal to zero and stopped, without checking the other factor too.',
    principle: 'Once factorised and set to zero, EVERY factor must be set equal to zero and solved separately — a quadratic can have up to two distinct solutions.',
    correctStep: '(x-2)(x-3) = 0 → x-2=0 gives x=2, AND x-3=0 gives x=3. Both are solutions.',
  },
  {
    id: 'divide-by-variable-loses-root',
    label: 'Dividing both sides by a variable expression, losing a root',
    errorType: 'You divided both sides of the equation by an expression containing x, which silently deletes a valid solution.',
    principle: 'Never divide both sides of an equation by a variable expression — if that expression could be zero, you lose that solution entirely. Instead, keep everything on one side and factorise.',
    correctStep: 'x(x-3) = 0: do NOT divide by x. Instead use zero-product directly: x=0 or x-3=0, giving x=0 and x=3 (dividing by x would only find x=3, losing x=0).',
  },
  {
    id: 'quadratic-as-linear',
    label: 'Trying to isolate x directly, like solving a linear equation',
    errorType: 'You tried to isolate x using the "undo the operations" approach that works for linear equations.',
    principle: 'A quadratic equation has x appearing to the power of 2 — you cannot isolate it using addition/subtraction/division the way you would with a linear equation. Factorise and use the zero-product principle instead.',
    correctStep: 'x² + 5x - 6 = 0 cannot be solved by "moving terms around" alone — it must be factorised: (x+6)(x-1)=0, giving x=-6 or x=1.',
  },
  {
    id: 'repeated-root-confusion',
    label: 'Mishandling a repeated (double) root',
    errorType: 'You either listed a repeated root twice as if they were two different solutions, or assumed a second, different solution must exist.',
    principle: 'When a quadratic factorises as a square, like (x-3)², there is only ONE distinct solution — it just happens to come from a repeated factor. "Up to two solutions" includes the case of exactly one, repeated.',
    correctStep: '(x-3)² = 0 → x-3=0 (twice) → the only solution is x=3.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'solving-quadratic-equations',
  topicName: 'Solving Quadratic Equations',
  prerequisites: [
    'Factorising: common factor, trinomials, difference of squares (Topic 4)',
    'Solving linear equations (Topic 6)',
  ],
  objectives: [
    { id: 'zero-product-principle', text: 'Explain and apply the zero-product principle to solve a factorised equation.' },
    { id: 'rearrange-to-zero', text: 'Rearrange a quadratic equation to standard form (= 0) before solving.' },
    { id: 'solve-trinomial-quadratic', text: 'Solve a quadratic equation by factorising a trinomial and applying the zero-product principle.' },
    { id: 'handle-special-cases', text: 'Correctly identify and handle a repeated root or a case with no real solution.' },
  ],
  estimatedMinutes: [20, 30],
};

export const solvingQuadraticEquations: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'When does an expression become zero?',
  goalSettingPrompt:
    'You already know how to factorise expressions like x² - 5x + 6. Factorising answers a powerful question: for which values of x does this expression equal exactly zero? That question shows up everywhere — profit hitting zero, a ball landing on the ground, a curve crossing an axis. By the end of this lesson you\'ll be able to solve quadratic equations using factorisation and one new idea: the zero-product principle.',

  activate: {
    connectPrompt: 'You already know how to factorise. Let\'s check that, since it\'s the main tool for solving quadratic equations.',
    diagnosticQuestions: [
      { question: 'Factorise x² - 5x + 6.', options: ['(x-2)(x-3)', '(x+2)(x+3)', '(x-1)(x-6)', '(x-2)(x+3)'], correctIndex: 0, explanation: 'Need two numbers multiplying to 6 and adding to -5: -2 and -3.' },
      { question: 'What is 5 × 0?', options: ['0', '5', '50', 'undefined'], correctIndex: 0, explanation: 'Anything multiplied by 0 is 0.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'The zero-product principle says: if two things multiplied together equal zero, then AT LEAST ONE of them must be zero — there is no other way to multiply two numbers and get zero. This only works when the product equals EXACTLY zero, never any other number. To solve a quadratic equation, we first rearrange it so one side is 0, then factorise the other side, then apply this principle to each factor separately.',
    workedExamples: [
      { id: 'wx-zero-product-numeric', prompt: 'If (x-2)(x-3) = 0, what must be true?', steps: [
        { step: 'The product of (x-2) and (x-3) is zero.', justification: 'This is given.' },
        { step: 'By the zero-product principle, either (x-2)=0 or (x-3)=0.', justification: 'At least one factor of a zero product must itself be zero.' },
        { step: 'Solve each: x-2=0 gives x=2; x-3=0 gives x=3.', justification: 'Solve each mini-equation like a normal linear equation.' },
      ], answer: 'x = 2 or x = 3' },
      { id: 'wx-rearrange-first', prompt: 'Solve x² + 5x = 6.', steps: [
        { step: 'Rearrange so one side is 0: subtract 6 from both sides → x² + 5x - 6 = 0.', justification: 'The zero-product principle only applies when one side is exactly zero.' },
        { step: 'Factorise: (x+6)(x-1) = 0.', justification: 'Need two numbers multiplying to -6 and adding to 5: 6 and -1.' },
        { step: 'Apply zero-product: x+6=0 gives x=-6; x-1=0 gives x=1.', justification: 'Solve each factor separately.' },
      ], answer: 'x = -6 or x = 1' },
    ],
    knowledgeChecks: [
      { question: 'If (x+4)(x-7) = 0, what are the solutions?', options: ['x = -4 or x = 7', 'x = 4 or x = -7', 'x = -4 and x = -7', 'x = 4 or x = 7'], correctIndex: 0, explanation: 'x+4=0 gives x=-4; x-7=0 gives x=7.', misconceptionId: 'lose-one-root' },
      { question: 'Can you solve (x-3)(x+2) = 4 by setting x-3=4 and x+2=4?', options: ['No — the product isn\'t zero, so zero-product doesn\'t apply', 'Yes, that\'s correct', 'Yes, but only for one of the factors', 'No, because the numbers are too small'], correctIndex: 0, explanation: 'Zero-product only works when the product equals exactly 0, not 4 or any other number.', misconceptionId: 'zero-product-nonzero' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying the zero-product principle once an equation is factorised and equal to zero?',
  },

  demonstrateChunk2: {
    explanation:
      'Some quadratics need extra care. If a common factor (like x) can be taken out, NEVER divide both sides by that variable factor — it silently deletes a solution. Instead, apply the zero-product principle directly to each factor, including the variable one. When a quadratic factorises as a perfect square, like (x-3)², there is only ONE distinct solution — "up to two solutions" includes this repeated-root case. And some quadratics genuinely have no real solution at all — at this level, we simply state that and move on, without trying to force an answer.',
    workedExamples: [
      { id: 'wx-common-factor-quadratic', prompt: 'Solve x² - 3x = 0.', steps: [
        { step: 'Factorise by taking out the common factor x: x(x - 3) = 0.', justification: 'x is a common factor of both terms.' },
        { step: 'Apply zero-product to BOTH factors, including x itself: x=0 or x-3=0.', justification: 'Never divide by x — that would lose the x=0 solution.' },
      ], answer: 'x = 0 or x = 3' },
      { id: 'wx-repeated-root', prompt: 'Solve x² - 6x + 9 = 0.', steps: [
        { step: 'Factorise: this is a perfect square, (x-3)(x-3) = (x-3)².', justification: 'Recognise the pattern: -3 and -3 multiply to 9 and add to -6.' },
        { step: 'Apply zero-product: x-3=0 (the same equation from both factors).', justification: 'Both factors are identical, so there is only one distinct equation to solve.' },
      ], answer: 'x = 3 (a repeated root — only one distinct solution)' },
      { id: 'wx-no-real-solution', prompt: 'Try to solve x² + 4 = 0.', steps: [
        { step: 'Rearrange: x² = -4.', justification: 'Isolate the squared term.' },
        { step: 'No real number squared gives a negative result, so there is no real solution.', justification: 'At this level, we state "no real solution" rather than pursue non-real numbers.' },
      ], answer: 'No real solution' },
    ],
    knowledgeChecks: [
      { question: 'To solve x(x-5) = 0, what should you do?', options: ['Set x=0 and x-5=0 separately', 'Divide both sides by x to get x-5=0', 'Divide both sides by (x-5)', 'Add 5 to both sides'], correctIndex: 0, explanation: 'Apply zero-product directly to both factors — dividing by x would lose the x=0 solution.', misconceptionId: 'divide-by-variable-loses-root' },
      { question: 'Solve x² - 8x + 16 = 0.', options: ['x = 4 (repeated root)', 'x = 4 and x = -4', 'x = 8', 'No real solution'], correctIndex: 0, explanation: 'x²-8x+16 = (x-4)², a repeated root, so the only solution is x=4.', misconceptionId: 'repeated-root-confusion' },
    ],
    confidenceCheckPrompt: 'How confident do you feel handling common-factor quadratics, repeated roots, and no-real-solution cases?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'zero-product-principle', revealSteps: 2, prompt: 'Solve (x+5)(x-1) = 0.', steps: [
        { step: 'Apply zero-product: x+5=0 or x-1=0.', justification: 'Set each factor equal to zero.' },
        { step: 'Solve each: x=-5 or x=1.', justification: 'Solve each mini-equation.' },
      ], answer: 'x = -5 or x = 1' },
      { id: 'fp-partial-1', objectiveId: 'rearrange-to-zero', revealSteps: 1, prompt: 'Solve x² - 2x = 15.', steps: [
        { step: 'Rearrange to standard form: x² - 2x - 15 = 0.', justification: 'Subtract 15 from both sides.' },
        { step: 'Factorise: (x-5)(x+3) = 0.', justification: 'Need two numbers multiplying to -15 and adding to -2.' },
        { step: 'Apply zero-product: x=5 or x=-3.', justification: 'Solve each factor.' },
      ], answer: 'x = 5 or x = -3' },
      { id: 'fp-independent-1', objectiveId: 'solve-trinomial-quadratic', revealSteps: 0, prompt: 'Solve x² + x - 20 = 0.', steps: [
        { step: 'Factorise: need two numbers multiplying to -20 and adding to 1: 5 and -4.', justification: '(x+5)(x-4) = 0.' },
        { step: 'Apply zero-product: x=-5 or x=4.', justification: 'Solve each factor.' },
      ], answer: 'x = -5 or x = 4' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'zero-product-principle', question: 'Solve (x-6)(x+2) = 0.', options: ['x = 6 or x = -2', 'x = -6 or x = 2', 'x = 6 and x = -2 only if both true at once', 'x = 4'], correctIndex: 0, hints: { strategic: 'Set each factor equal to zero.', procedural: 'x-6=0 gives x=6. x+2=0 gives x=-2.', workedStep: 'x = 6 or x = -2.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'rearrange-to-zero', question: 'Solve x² = 4x.', options: ['x = 0 or x = 4', 'x = 4', 'x = 0', 'x = 2'], correctIndex: 0, hints: { strategic: 'Rearrange to "=0" first, then factorise — don\'t divide by x.', procedural: 'x² - 4x = 0 → x(x-4) = 0.', workedStep: 'x=0 or x-4=0, so x=0 or x=4.' }, distractorMisconceptions: { 1: 'divide-by-variable-loses-root' } },
      { id: 'ip-3', objectiveId: 'solve-trinomial-quadratic', question: 'Solve x² - 4x - 21 = 0.', options: ['x = 7 or x = -3', 'x = -7 or x = 3', 'x = 7 and x = 3', 'x = 21'], correctIndex: 0, hints: { strategic: 'Factorise first: which two numbers multiply to -21 and add to -4?', procedural: '7 and -3: 7×(-3)=-21, 7+(-3)=4... check signs again.', workedStep: 'Actually -7 and 3 give -4x correctly only if... (x-7)(x+3)=x²-4x-21. So x=7 or x=-3.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'handle-special-cases', question: 'Solve x² + 10x + 25 = 0.', options: ['x = -5 (repeated root)', 'x = 5 and x = -5', 'x = -5 and x = -5, two different solutions', 'No real solution'], correctIndex: 0, hints: { strategic: 'Check if this is a perfect square trinomial.', procedural: 'x²+10x+25 = (x+5)².', workedStep: 'Repeated root: x = -5 only.' }, distractorMisconceptions: { 2: 'repeated-root-confusion' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'rearrange-to-zero', multiSelect: false, question: 'True or false: x² + 3x = 10 can be factorised and solved directly, without rearranging first.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — it must first be rearranged to x² + 3x - 10 = 0 before factorising and applying zero-product.', distractorMisconceptions: { 0: 'not-set-to-zero' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'zero-product-principle', multiSelect: false, question: 'Solve (x-9)(x+1) = 0.', options: ['x = 9 or x = -1', 'x = -9 or x = 1', 'x = 9 and x = 1', 'x = 8'], correctIndices: [0], explanation: 'x-9=0 gives x=9; x+1=0 gives x=-1.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'zero-product-principle', multiSelect: false, question: 'True or false: if (x-4)(x+6) = 9, you can conclude x-4=9 or x+6=9.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — zero-product only applies when the product equals 0, not 9. You would need to expand, rearrange to "=0", then re-factorise.', distractorMisconceptions: { 0: 'zero-product-nonzero' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'solve-trinomial-quadratic', multiSelect: false, question: 'Solve x² - 7x + 12 = 0.', options: ['x = 3 or x = 4', 'x = -3 or x = -4', 'x = 3 and x = 4 simultaneously', 'x = 12'], correctIndices: [0], explanation: 'Factorise: (x-3)(x-4)=0, so x=3 or x=4.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'rearrange-to-zero', multiSelect: false, question: 'Solve 2x² = 8x.', options: ['x = 0 or x = 4', 'x = 4', 'x = 0', 'x = 16'], correctIndices: [0], explanation: 'Rearrange: 2x² - 8x = 0 → 2x(x-4) = 0 → x=0 or x=4. Dividing by x directly would lose x=0.', distractorMisconceptions: { 1: 'divide-by-variable-loses-root' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'handle-special-cases', multiSelect: false, question: 'Solve x² - 12x + 36 = 0.', options: ['x = 6 (repeated root)', 'x = 6 and x = -6', 'x = 12', 'No real solution'], correctIndices: [0], explanation: 'x²-12x+36 = (x-6)², a repeated root: x = 6 only.', distractorMisconceptions: { 1: 'repeated-root-confusion' } },
    { id: 'q7', type: 'true-false', objectiveId: 'handle-special-cases', multiSelect: false, question: 'True or false: every quadratic equation has exactly two different real solutions.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a quadratic can have two different solutions, one repeated solution, or no real solution at all.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'zero-product-principle', multiSelect: true, question: 'Which of these equations are ready to have the zero-product principle applied directly? (select all that apply)', options: ['(x-2)(x+5) = 0', 'x(x-7) = 0', '(x-3)(x+1) = 8', 'x² - 9 = 0 rewritten as (x+3)(x-3) = 0'], correctIndices: [0, 1, 3], explanation: 'The zero-product principle applies whenever the product of factors equals exactly 0 — true for options 1, 2, and 4, but not option 3, where the product equals 8.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'zero-product-principle',
      analogy: 'Think of two numbers multiplying to give zero like two people trying to make a "zero" handshake — the ONLY way their handshake result is zero is if at least one of them was already holding "nothing" (zero) to begin with. If neither is zero, their product can never land exactly on zero.',
      explanation: 'Whenever you see FactorA × FactorB = 0, you can immediately write two separate mini-equations: FactorA = 0, and FactorB = 0 — then solve each one like a normal linear equation. This ONLY works when the product is exactly 0.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Solve (x-8)(x+3) = 0.', steps: [
          { step: 'Split into two mini-equations: x-8=0 and x+3=0.', justification: 'Zero-product principle, since the product is exactly 0.' },
          { step: 'Solve each: x=8, and x=-3.', justification: 'Each is a simple one-step linear equation.' },
        ], answer: 'x = 8 or x = -3' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'zero-product-principle', question: 'Solve (x-1)(x-10) = 0.', options: ['x = 1 or x = 10', 'x = -1 or x = -10', 'x = 1 and x = 10 both required together', 'x = 11'], correctIndex: 0, hints: { strategic: 'Split into two mini-equations.', procedural: 'x-1=0 and x-10=0.', workedStep: 'x=1 or x=10.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'zero-product-principle', question: 'Solve (x+7)(x-2) = 0.', options: ['x = -7 or x = 2', 'x = 7 or x = -2', 'x = -7 and x = -2', 'x = 5'], correctIndex: 0, hints: { strategic: 'Split into two mini-equations.', procedural: 'x+7=0 and x-2=0.', workedStep: 'x=-7 or x=2.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'zero-product-principle', question: 'Is it valid to solve (x-4)(x+1) = 5 by setting x-4=5 and x+1=5?', options: ['No — the product isn\'t 0', 'Yes, that\'s correct', 'Yes, but only for the first factor', 'No, because 5 is too big'], correctIndex: 0, hints: { strategic: 'What does the zero-product principle require?', procedural: 'The product must equal exactly 0.', workedStep: 'Since the product is 5, not 0, this method doesn\'t apply directly — you\'d need to expand and rearrange first.' }, distractorMisconceptions: { 1: 'zero-product-nonzero' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the one new idea in this lesson that doesn\'t apply to linear equations?', type: 'multiple-choice', options: ['The zero-product principle', 'Factorising', 'Substituting values', 'Simplifying fractions'] },
    { id: 'r2', prompt: 'How confident do you feel solving quadratic equations now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you always check before applying the zero-product principle?', type: 'free-text' },
  ],
};
