// ── Topic 10: Literal Equations — Algebra, Grade 10, Term 1 ──────────────────
// Lighter-weight build per LIBRARY_PARTNER_HANDOFF.md §4/step 7. Builds
// directly on Topic 6 (solving linear equations) — same balance-scale
// technique, applied to equations with multiple letters, to make a chosen
// variable the subject.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'treats-other-letters-as-unknowns',
    label: 'Trying to "solve" every letter instead of isolating just one',
    errorType: 'You tried to find a numeric value for every letter in the equation.',
    principle: 'In a literal equation, every letter except the one you\'re asked to make the subject is treated as a known constant — your job is only to isolate the requested variable in terms of the others.',
    correctStep: 'Make x the subject of ax + b = c: treat a, b, c as known numbers, and isolate x just like you would with actual numbers.',
  },
  {
    id: 'divide-before-isolating-term',
    label: 'Dividing by a letter before fully isolating the term containing the target variable',
    errorType: 'You divided by a variable coefficient before finishing all the addition/subtraction steps.',
    principle: 'Follow the exact same order as solving a normal equation: undo addition/subtraction first, THEN divide by the coefficient of the target variable, last.',
    correctStep: 'To make x the subject of ax + b = c: subtract b from both sides first (ax = c - b), THEN divide by a (x = (c-b)/a) — not the other way round.',
  },
  {
    id: 'forgets-whole-side-division',
    label: 'Dividing only part of the other side by the coefficient',
    errorType: 'You divided only one term on the other side by the coefficient, instead of the entire side.',
    principle: 'When isolating a variable, the coefficient must divide the WHOLE expression on the other side — written as a single fraction if needed.',
    correctStep: 'ax = c - b → x = (c - b)/a — the whole of (c-b) is divided by a, not just c or just b separately.',
  },
  {
    id: 'sign-error-negative-coefficient',
    label: 'Losing track of sign when the target variable\'s coefficient is negative',
    errorType: 'You isolated the variable but didn\'t correctly handle a negative coefficient.',
    principle: 'If the target variable ends up with a negative coefficient, dividing both sides by that negative number flips the sign of everything else on the other side too.',
    correctStep: 'c - ax = b → -ax = b - c → x = (b-c)/(-a) = (c-b)/a.',
  },
  {
    id: 'no-bracket-for-fraction-result',
    label: 'Not treating a multi-term numerator as a single unit after isolating',
    errorType: 'You wrote the final answer without grouping a multi-term result correctly as a single fraction.',
    principle: 'When a variable is isolated to equal a fraction with more than one term on top, that whole expression is the numerator — it must be written as one grouped quantity divided by the coefficient, not split apart.',
    correctStep: 'x = (c - b)/a means the ENTIRE quantity (c-b) is divided by a — this is different from c - b/a, which would only divide b by a.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'literal-equations',
  topicName: 'Literal Equations',
  prerequisites: [
    'Solving linear equations, including brackets and variable on both sides (Topic 6)',
    'Simplifying algebraic fractions (Topic 5)',
  ],
  objectives: [
    { id: 'identify-subject', text: 'Identify which variable is being asked for as the "subject" of a literal equation.' },
    { id: 'isolate-simple', text: 'Make a variable the subject of a simple literal equation using the balance method.' },
    { id: 'isolate-with-fraction', text: 'Make a variable the subject when the result must be written as a single fraction.' },
    { id: 'apply-formula', text: 'Rearrange a familiar formula to solve for a different variable.' },
  ],
  estimatedMinutes: [20, 30],
};

export const literalEquations: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What if the numbers in an equation were letters too?',
  goalSettingPrompt:
    'You already know how to solve for x when everything else is a number. A literal equation just replaces some of those numbers with letters — the exact same balance technique still works. By the end of this lesson you\'ll be able to make any chosen variable the subject of a formula.',

  activate: {
    connectPrompt: 'You already know how to isolate x in a normal equation. Let\'s check that skill before applying it with letters instead of numbers.',
    diagnosticQuestions: [
      { question: 'Solve 3x + 4 = 19.', options: ['x = 5', 'x = 23/3', 'x = 45', 'x = 7.67'], correctIndex: 0, explanation: 'Subtract 4: 3x = 15. Divide by 3: x = 5.' },
      { question: 'Simplify (a + b)/c when a=10, b=5, c=3.', options: ['5', '2.5', '15', '3'], correctIndex: 0, explanation: '(10+5)/3 = 15/3 = 5.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A literal equation has more than one letter, and you\'re asked to make ONE of them the "subject" — meaning isolate it on one side, expressed in terms of the others. Every other letter is treated exactly like a known number would be. The technique is identical to solving a normal equation: undo addition/subtraction first, then divide by the coefficient of the target variable last.',
    workedExamples: [
      { id: 'wx-simple-literal', prompt: 'Make x the subject of x + b = c.', steps: [
        { step: 'Subtract b from both sides.', justification: 'Undo the "+b" exactly like you would undo "+5" with numbers.' },
      ], answer: 'x = c - b' },
      { id: 'wx-coefficient-literal', prompt: 'Make x the subject of ax = c.', steps: [
        { step: 'Divide both sides by a.', justification: 'Undo the multiplication by a — treating a as a known constant.' },
      ], answer: 'x = c/a' },
    ],
    knowledgeChecks: [
      { question: 'Make y the subject of y - m = n.', options: ['y = n + m', 'y = n - m', 'y = m - n', 'y = mn'], correctIndex: 0, explanation: 'Add m to both sides: y = n + m.' },
      { question: 'Make x the subject of 5x = k.', options: ['x = k/5', 'x = 5k', 'x = k - 5', 'x = 5 - k'], correctIndex: 0, explanation: 'Divide both sides by 5: x = k/5.', misconceptionId: 'divide-before-isolating-term' },
    ],
    confidenceCheckPrompt: 'How confident do you feel isolating a variable when the other quantities are letters instead of numbers?',
  },

  demonstrateChunk2: {
    explanation:
      'For a two-step literal equation like ax + b = c, use the exact same order as solving a normal equation: undo the addition/subtraction FIRST (subtract b from both sides), THEN divide by the coefficient a LAST. When the result has more than one term on top, the whole expression is the numerator of a single fraction — grouped together, not split apart. Watch for a negative coefficient on the target variable: dividing both sides by a negative flips the sign of everything on the other side.',
    workedExamples: [
      { id: 'wx-two-step-literal', prompt: 'Make x the subject of ax + b = c.', steps: [
        { step: 'Subtract b from both sides: ax = c - b.', justification: 'Undo the addition first, treating b as a known constant.' },
        { step: 'Divide both sides by a: x = (c - b)/a.', justification: 'The WHOLE of (c-b) is divided by a, written as one fraction.' },
      ], answer: 'x = (c - b)/a' },
      { id: 'wx-negative-coefficient', prompt: 'Make x the subject of c - ax = b.', steps: [
        { step: 'Subtract c from both sides: -ax = b - c.', justification: 'Isolate the term containing x.' },
        { step: 'Divide both sides by -a: x = (b - c)/(-a).', justification: 'Dividing by a negative flips every sign on the other side.' },
        { step: 'Simplify by multiplying top and bottom by -1: x = (c - b)/a.', justification: 'This is an equivalent, tidier way to write the same result.' },
      ], answer: 'x = (c - b)/a' },
      { id: 'wx-real-formula', prompt: 'The formula for the perimeter of a rectangle is P = 2l + 2w. Make w the subject.', steps: [
        { step: 'Subtract 2l from both sides: P - 2l = 2w.', justification: 'Isolate the term containing w.' },
        { step: 'Divide both sides by 2: w = (P - 2l)/2.', justification: 'The whole of (P - 2l) is divided by 2.' },
      ], answer: 'w = (P - 2l)/2' },
    ],
    knowledgeChecks: [
      { question: 'Make x the subject of px + q = r.', options: ['x = (r - q)/p', 'x = r - q/p', 'x = (r + q)/p', 'x = r/p - q'], correctIndex: 0, explanation: 'Subtract q: px = r - q. Divide by p: x = (r-q)/p, with the whole of (r-q) as the numerator.', misconceptionId: 'no-bracket-for-fraction-result' },
      { question: 'The formula A = lw gives the area of a rectangle. Make l the subject.', options: ['l = A/w', 'l = A - w', 'l = Aw', 'l = w/A'], correctIndex: 0, explanation: 'Divide both sides by w: l = A/w.', misconceptionId: 'divide-before-isolating-term' },
    ],
    confidenceCheckPrompt: 'How confident do you feel making a variable the subject of a two-step literal equation or formula?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'isolate-simple', revealSteps: 2, prompt: 'Make y the subject of y + k = m.', steps: [
        { step: 'Subtract k from both sides.', justification: 'Undo the addition, treating k as a known constant.' },
      ], answer: 'y = m - k' },
      { id: 'fp-partial-1', objectiveId: 'isolate-with-fraction', revealSteps: 1, prompt: 'Make x the subject of bx - d = e.', steps: [
        { step: 'Add d to both sides: bx = e + d.', justification: 'Undo the subtraction first.' },
        { step: 'Divide both sides by b: x = (e + d)/b.', justification: 'The whole of (e+d) is the numerator.' },
      ], answer: 'x = (e + d)/b' },
      { id: 'fp-independent-1', objectiveId: 'apply-formula', revealSteps: 0, prompt: 'The formula for simple interest is A = P + Prt. Make P the subject (hint: factorise P out first).', steps: [
        { step: 'Factorise P out of the right side: A = P(1 + rt).', justification: 'Both terms on the right share the common factor P.' },
        { step: 'Divide both sides by (1 + rt): P = A/(1 + rt).', justification: 'Isolate P by dividing by its coefficient, (1+rt).' },
      ], answer: 'P = A/(1 + rt)' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'isolate-simple', question: 'Make x the subject of x - n = p.', options: ['x = p + n', 'x = p - n', 'x = n - p', 'x = np'], correctIndex: 0, hints: { strategic: 'Undo the "-n".', procedural: 'Add n to both sides.', workedStep: 'x = p + n.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'isolate-simple', question: 'Make x the subject of cx = d.', options: ['x = d/c', 'x = cd', 'x = d - c', 'x = c/d'], correctIndex: 0, hints: { strategic: 'Undo the multiplication by c.', procedural: 'Divide both sides by c.', workedStep: 'x = d/c.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'isolate-with-fraction', question: 'Make x the subject of mx + n = p.', options: ['x = (p - n)/m', 'x = p - n/m', 'x = (p + n)/m', 'x = p/m - n'], correctIndex: 0, hints: { strategic: 'Isolate the mx term first, then divide by m.', procedural: 'Subtract n: mx = p - n.', workedStep: 'Divide by m: x = (p-n)/m.' }, distractorMisconceptions: { 1: 'no-bracket-for-fraction-result' } },
      { id: 'ip-4', objectiveId: 'apply-formula', question: 'The formula for the area of a triangle is A = ½bh. Make h the subject.', options: ['h = 2A/b', 'h = A/(2b)', 'h = 2A - b', 'h = Ab/2'], correctIndex: 0, hints: { strategic: 'First clear the fraction by multiplying both sides by 2.', procedural: '2A = bh.', workedStep: 'Divide by b: h = 2A/b.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'isolate-simple', multiSelect: false, question: 'Make x the subject of x + t = w.', options: ['x = w - t', 'x = w + t', 'x = t - w', 'x = wt'], correctIndices: [0], explanation: 'Subtract t from both sides: x = w - t.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'isolate-simple', multiSelect: false, question: 'Make x the subject of kx = m.', options: ['x = m/k', 'x = km', 'x = k/m', 'x = m - k'], correctIndices: [0], explanation: 'Divide both sides by k: x = m/k.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'identify-subject', multiSelect: false, question: 'True or false: to "make x the subject" of ax + b = c, you should also find numeric values for a, b, and c.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a, b, and c stay as letters (treated as known constants); only x is isolated.', distractorMisconceptions: { 0: 'treats-other-letters-as-unknowns' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'isolate-with-fraction', multiSelect: false, question: 'Make x the subject of ax - b = c.', options: ['x = (c + b)/a', 'x = c/a + b', 'x = (c - b)/a', 'x = c + b/a'], correctIndices: [0], explanation: 'Add b to both sides: ax = c + b. Divide by a: x = (c+b)/a, with the whole of (c+b) as the numerator.', distractorMisconceptions: { 1: 'no-bracket-for-fraction-result' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'isolate-with-fraction', multiSelect: false, question: 'Make y the subject of py + q = r.', options: ['y = (r - q)/p', 'y = r - q/p', 'y = (r + q)/p', 'y = r/p - q'], correctIndices: [0], explanation: 'Subtract q: py = r - q. Divide by p: y = (r-q)/p.', distractorMisconceptions: { 1: 'no-bracket-for-fraction-result' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'apply-formula', multiSelect: false, question: 'The formula v = u + at gives final velocity. Make a the subject.', options: ['a = (v - u)/t', 'a = v - u - t', 'a = (v + u)/t', 'a = vt - u'], correctIndices: [0], explanation: 'Subtract u: v - u = at. Divide by t: a = (v-u)/t.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'apply-formula', multiSelect: false, question: 'True or false: rearranging a formula uses exactly the same balance technique as solving a normal linear equation.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — the only difference is that most of the "numbers" are letters, but every step (undo addition/subtraction, then divide by the coefficient) is identical.', distractorMisconceptions: {} },
    { id: 'q8', type: 'decimal-discrimination', objectiveId: 'isolate-with-fraction', multiSelect: false, question: 'Make x the subject of d - ax = e.', options: ['x = (d - e)/a', 'x = (e - d)/a', 'x = d - e - a', 'x = (d + e)/a'], correctIndices: [0], explanation: 'Subtract d: -ax = e - d. Divide by -a: x = (e-d)/(-a) = (d-e)/a.', distractorMisconceptions: { 1: 'sign-error-negative-coefficient' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'isolate-with-fraction',
      analogy: 'Treat every letter that isn\'t your target variable exactly like you would treat a plain number — pretend, just for a moment, that b, c, and a are actually 3, 10, and 2. Solve it that way first if it helps, then swap the numbers back for letters at the very end.',
      explanation: 'The order never changes: undo any addition or subtraction connected to the target variable\'s term first, then divide by whatever is multiplying the target variable, last — writing the whole remaining expression as the numerator of one fraction.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Make x the subject of nx + m = k, by first solving the "numbers only" version 3x + 5 = 20, then repeating with letters.', steps: [
          { step: 'Numbers version: 3x + 5 = 20 → subtract 5: 3x = 15 → divide by 3: x = 5.', justification: 'Solve the numeric analogy first to see the pattern clearly.' },
          { step: 'Letters version: nx + m = k → subtract m: nx = k - m.', justification: 'Same first step, using m instead of 5.' },
          { step: 'Divide by n: x = (k - m)/n.', justification: 'Same last step, using n instead of 3, and the whole of (k-m) as the numerator.' },
        ], answer: 'x = (k - m)/n' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'isolate-with-fraction', question: 'Make x the subject of hx + j = l.', options: ['x = (l - j)/h', 'x = l - j/h', 'x = (l + j)/h', 'x = l/h - j'], correctIndex: 0, hints: { strategic: 'Try the numbers-first trick if it helps: 2x + 3 = 11.', procedural: 'Subtract j: hx = l - j.', workedStep: 'Divide by h: x = (l-j)/h.' }, distractorMisconceptions: { 1: 'no-bracket-for-fraction-result' } },
        { id: 'rem-p2', objectiveId: 'isolate-with-fraction', question: 'Make y the subject of sy - t = u.', options: ['y = (u + t)/s', 'y = u/s + t', 'y = (u - t)/s', 'y = u - t/s'], correctIndex: 0, hints: { strategic: 'Undo the "-t" first.', procedural: 'Add t to both sides: sy = u + t.', workedStep: 'Divide by s: y = (u+t)/s.' }, distractorMisconceptions: { 1: 'no-bracket-for-fraction-result' } },
        { id: 'rem-p3', objectiveId: 'isolate-with-fraction', question: 'Make x the subject of wx + z = y.', options: ['x = (y - z)/w', 'x = y - z/w', 'x = (y + z)/w', 'x = y/w - z'], correctIndex: 0, hints: { strategic: 'Undo the "+z" first, then divide by w.', procedural: 'Subtract z: wx = y - z.', workedStep: 'Divide by w: x = (y-z)/w.' }, distractorMisconceptions: { 1: 'no-bracket-for-fraction-result' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Did thinking of the other letters as "just numbers" help you solve literal equations?', type: 'multiple-choice', options: ['Yes, that helped a lot', 'A bit, but I still found it tricky', 'Not really — it felt different from normal equations', 'I didn\'t need that trick'] },
    { id: 'r2', prompt: 'How confident do you feel rearranging formulas and literal equations now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is one formula (from any subject) you could now rearrange using this skill?', type: 'free-text' },
  ],
};
