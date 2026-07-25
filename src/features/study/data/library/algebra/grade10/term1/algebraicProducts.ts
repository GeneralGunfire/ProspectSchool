// ── Topic 3: Algebraic Products (expanding brackets) — Algebra, Grade 10, Term 1 ──
// Lighter-weight build per LIBRARY_PARTNER_HANDOFF.md §4/step 7 — a standard,
// well-covered symbolic-algebra topic, built directly from the general
// template (Part B) and the already-verified CAPS topic list, no dedicated
// topic-specific Perplexity pass. Same LessonContent shape/quality bar as
// Topics 1-2.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'distribute-only-first-term',
    label: 'Only multiplying the outside term by the first term inside the bracket',
    errorType: 'You multiplied the term outside the bracket by only the first term inside, and left the rest unchanged.',
    principle: 'The distributive law means the outside term must multiply EVERY term inside the bracket, not just the first one.',
    correctStep: '3(x + 5) = 3·x + 3·5 = 3x + 15, not 3x + 5.',
  },
  {
    id: 'sign-error-negative-distribution',
    label: 'Losing a negative sign when distributing',
    errorType: 'You distributed a negative term but didn\'t flip the sign of every term inside the bracket.',
    principle: 'When the term outside the bracket is negative, EVERY term inside flips sign after multiplying — not just the first one.',
    correctStep: '-2(x - 4) = -2·x + (-2)·(-4) = -2x + 8, not -2x - 8.',
  },
  {
    id: 'foil-missed-term',
    label: 'Missing one of the four products when expanding two brackets',
    errorType: 'You multiplied some pairs of terms from the two brackets but missed one of the four required products.',
    principle: 'Expanding (a+b)(c+d) always produces exactly 4 products: a·c, a·d, b·c, b·d. Missing any one gives a wrong, incomplete answer.',
    correctStep: '(x+3)(x+5) = x·x + x·5 + 3·x + 3·5 = x² + 5x + 3x + 15 = x² + 8x + 15.',
  },
  {
    id: 'forget-combine-like-terms',
    label: 'Leaving the answer without combining like terms',
    errorType: 'You expanded correctly but left two like terms un-combined at the end.',
    principle: 'An expansion is only finished once all like terms (same variable and power) are added or subtracted together.',
    correctStep: 'x² + 5x + 3x + 15 must be simplified further to x² + 8x + 15.',
  },
  {
    id: 'square-binomial-drop-middle',
    label: 'Squaring a binomial by squaring each term and forgetting the middle term',
    errorType: 'You expanded (a+b)² as a² + b², skipping the middle "cross" term.',
    principle: '(a+b)² is short for (a+b)(a+b), which expands to a² + 2ab + b² — the middle term (2ab) comes from the two "outer" cross-products and is easy to lose if you skip straight to squaring each term.',
    correctStep: '(x+4)² = (x+4)(x+4) = x² + 4x + 4x + 16 = x² + 8x + 16, not x² + 16.',
  },
  {
    id: 'difference-squares-wrong-signs',
    label: 'Getting the signs wrong in a difference-of-squares product',
    errorType: 'You expanded (a+b)(a-b) but didn\'t get the middle terms to cancel correctly.',
    principle: '(a+b)(a-b) = a² - ab + ab - b² — the two middle "cross" terms are opposites and cancel exactly, leaving only a² - b².',
    correctStep: '(x+6)(x-6) = x² - 6x + 6x - 36 = x² - 36 (the middle terms cancel).',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'algebraic-products',
  topicName: 'Algebraic Products: Expanding Brackets',
  prerequisites: [
    'Classifying and working with real numbers (Topic 1)',
    'Basic simplifying of like terms (e.g. 3x + 2x = 5x)',
    'Multiplying and dividing with negative numbers',
  ],
  objectives: [
    { id: 'distribute-single', text: 'Expand a single-term bracket using the distributive law, including negative multipliers.' },
    { id: 'expand-two-brackets', text: 'Expand the product of two binomials using all four required products.' },
    { id: 'square-binomial', text: 'Expand a squared binomial (a+b)² or (a-b)², including the middle term.' },
    { id: 'difference-of-squares', text: 'Expand a product of the form (a+b)(a-b) and recognise the difference-of-squares pattern.' },
  ],
  estimatedMinutes: [20, 30],
};

export const algebraicProducts: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What does multiplying by a bracket actually mean?',
  goalSettingPrompt:
    'A bracket like (x + 5) represents a single quantity — but to multiply it out, every part of that quantity has to be accounted for. By the end of this lesson you\'ll be able to expand brackets of increasing complexity without dropping a term.',

  activate: {
    connectPrompt: 'You already know how to simplify like terms. Let\'s check that before adding brackets into the mix.',
    diagnosticQuestions: [
      {
        question: 'Simplify: 4x + 3x - x',
        options: ['6x', '7x', '8x', '4x'],
        correctIndex: 0,
        explanation: '4x + 3x - x = (4 + 3 - 1)x = 6x.',
      },
      {
        question: 'What is -3 × -5?',
        options: ['-15', '15', '-8', '8'],
        correctIndex: 1,
        explanation: 'A negative times a negative gives a positive: -3 × -5 = 15.',
      },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'The distributive law says a(b + c) = ab + ac — the term outside a bracket must multiply EVERY term inside it, one at a time. This works the same way with negative outside terms: every sign inside flips according to normal multiplication rules. Once you\'ve distributed, always check whether any like terms can be combined to finish simplifying.',
    workedExamples: [
      {
        id: 'wx-distribute-basic',
        prompt: 'Expand 5(2x - 3).',
        steps: [
          { step: '5 × 2x = 10x', justification: 'Multiply the outside term by the first term inside.' },
          { step: '5 × (-3) = -15', justification: 'Multiply the outside term by the second term inside, keeping the sign.' },
        ],
        answer: '10x - 15',
      },
      {
        id: 'wx-distribute-negative',
        prompt: 'Expand -4(x - 7).',
        steps: [
          { step: '-4 × x = -4x', justification: 'Multiply the outside term by the first term.' },
          { step: '-4 × (-7) = 28', justification: 'Negative times negative gives a positive.' },
        ],
        answer: '-4x + 28',
      },
    ],
    knowledgeChecks: [
      {
        question: 'Expand -2(3x + 4).',
        options: ['-6x + 8', '-6x - 8', '6x - 8', '-6x + 4'],
        correctIndex: 1,
        explanation: '-2 × 3x = -6x, and -2 × 4 = -8, so the result is -6x - 8.',
        misconceptionId: 'sign-error-negative-distribution',
      },
      {
        question: 'Expand 6(x + 9).',
        options: ['6x + 9', '6x + 54', '6x + 15', 'x + 54'],
        correctIndex: 1,
        explanation: '6 × x = 6x and 6 × 9 = 54, so the result is 6x + 54, not 6x + 9 (which forgets to multiply the second term).',
        misconceptionId: 'distribute-only-first-term',
      },
    ],
    confidenceCheckPrompt: 'How confident do you feel distributing a single term across a bracket, including negative signs?',
  },

  demonstrateChunk2: {
    explanation:
      'Expanding two brackets, like (x+3)(x+5), needs all FOUR products: first×first, first×last, last×first, last×last — this is the same distributive law applied twice. After multiplying, combine any like terms to finish. Two special patterns come up often: squaring a binomial, (a+b)² = a² + 2ab + b² (don\'t skip the middle term!), and the difference of squares, (a+b)(a-b) = a² - b² (the middle terms always cancel).',
    workedExamples: [
      {
        id: 'wx-two-brackets',
        prompt: 'Expand (x + 3)(x + 5).',
        steps: [
          { step: 'x × x = x², x × 5 = 5x', justification: 'Multiply the first term of the first bracket by both terms of the second.' },
          { step: '3 × x = 3x, 3 × 5 = 15', justification: 'Multiply the second term of the first bracket by both terms of the second.' },
          { step: 'x² + 5x + 3x + 15 = x² + 8x + 15', justification: 'Combine the like terms 5x and 3x.' },
        ],
        answer: 'x² + 8x + 15',
      },
      {
        id: 'wx-square-binomial',
        prompt: 'Expand (x - 4)².',
        steps: [
          { step: 'Rewrite as (x - 4)(x - 4).', justification: 'Squaring a bracket means multiplying it by itself.' },
          { step: 'x×x=x², x×(-4)=-4x, -4×x=-4x, -4×(-4)=16', justification: 'Apply all four products.' },
          { step: 'x² - 4x - 4x + 16 = x² - 8x + 16', justification: 'Combine the two -4x terms.' },
        ],
        answer: 'x² - 8x + 16',
      },
      {
        id: 'wx-diff-squares',
        prompt: 'Expand (x + 6)(x - 6).',
        steps: [
          { step: 'x×x=x², x×(-6)=-6x, 6×x=6x, 6×(-6)=-36', justification: 'Apply all four products.' },
          { step: '-6x and 6x cancel each other out.', justification: 'These are opposite terms, so they sum to zero.' },
        ],
        answer: 'x² - 36',
      },
    ],
    knowledgeChecks: [
      {
        question: 'Expand (x + 2)(x + 7).',
        options: ['x² + 9x + 14', 'x² + 14', 'x² + 9x + 9', 'x² + 7x + 14'],
        correctIndex: 0,
        explanation: 'x² + 7x + 2x + 14 = x² + 9x + 14. Skipping any of the four products gives a wrong result.',
        misconceptionId: 'foil-missed-term',
      },
      {
        question: 'Expand (x + 5)².',
        options: ['x² + 25', 'x² + 5x + 25', 'x² + 10x + 25', 'x² + 5'],
        correctIndex: 2,
        explanation: '(x+5)(x+5) = x² + 5x + 5x + 25 = x² + 10x + 25. Squaring each term alone (x² + 25) forgets the middle term.',
        misconceptionId: 'square-binomial-drop-middle',
      },
    ],
    confidenceCheckPrompt: 'How confident do you feel expanding two brackets, including the squared-binomial and difference-of-squares patterns?',
  },

  apply: {
    fadingProblems: [
      {
        id: 'fp-full-1', objectiveId: 'distribute-single', revealSteps: 2,
        prompt: 'Expand -3(2x - 5).',
        steps: [
          { step: '-3 × 2x = -6x', justification: 'Multiply outside term by the first inside term.' },
          { step: '-3 × (-5) = 15', justification: 'Negative times negative gives positive.' },
        ],
        answer: '-6x + 15',
      },
      {
        id: 'fp-partial-1', objectiveId: 'expand-two-brackets', revealSteps: 1,
        prompt: 'Expand (x - 2)(x + 8).',
        steps: [
          { step: 'x×x=x², x×8=8x, -2×x=-2x, -2×8=-16', justification: 'Apply all four products.' },
          { step: 'x² + 8x - 2x - 16 = x² + 6x - 16', justification: 'Combine the like terms 8x and -2x.' },
        ],
        answer: 'x² + 6x - 16',
      },
      {
        id: 'fp-independent-1', objectiveId: 'difference-of-squares', revealSteps: 0,
        prompt: 'Expand (x + 9)(x - 9).',
        steps: [
          { step: 'x² - 9x + 9x - 81', justification: 'Apply all four products.' },
          { step: 'The middle terms cancel, leaving x² - 81.', justification: 'Difference-of-squares pattern: (a+b)(a-b) = a² - b².' },
        ],
        answer: 'x² - 81',
      },
    ],
    independentPractice: [
      {
        id: 'ip-1', objectiveId: 'distribute-single',
        question: 'Expand 7(x - 3).',
        options: ['7x - 21', '7x - 3', '7x + 21', 'x - 21'],
        correctIndex: 0,
        hints: { strategic: 'Multiply the 7 by both terms inside.', procedural: '7 × x = 7x, and 7 × (-3) = -21.', workedStep: '7(x-3) = 7x - 21.' },
        distractorMisconceptions: { 1: 'distribute-only-first-term' },
      },
      {
        id: 'ip-2', objectiveId: 'distribute-single',
        question: 'Expand -5(x + 2).',
        options: ['-5x + 2', '-5x - 10', '-5x + 10', '5x - 10'],
        correctIndex: 1,
        hints: { strategic: 'What sign does -5 times a positive give?', procedural: '-5 × x = -5x, and -5 × 2 = -10.', workedStep: '-5(x+2) = -5x - 10.' },
        distractorMisconceptions: { 2: 'sign-error-negative-distribution' },
      },
      {
        id: 'ip-3', objectiveId: 'expand-two-brackets',
        question: 'Expand (x + 4)(x - 3).',
        options: ['x² + x - 12', 'x² - 12', 'x² + 7x - 12', 'x² + x + 12'],
        correctIndex: 0,
        hints: { strategic: 'You need all four products, then combine like terms.', procedural: 'x×x=x², x×(-3)=-3x, 4×x=4x, 4×(-3)=-12.', workedStep: 'x² - 3x + 4x - 12 = x² + x - 12.' },
        distractorMisconceptions: { 1: 'foil-missed-term' },
      },
      {
        id: 'ip-4', objectiveId: 'square-binomial',
        question: 'Expand (x - 3)².',
        options: ['x² - 9', 'x² - 6x + 9', 'x² + 9', 'x² - 3x + 9'],
        correctIndex: 1,
        hints: { strategic: 'Rewrite as (x-3)(x-3) and use all four products.', procedural: 'x×x=x², x×(-3)=-3x, -3×x=-3x, -3×(-3)=9.', workedStep: 'x² -3x -3x + 9 = x² - 6x + 9.' },
        distractorMisconceptions: { 0: 'square-binomial-drop-middle' },
      },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'distribute-single', multiSelect: false, question: 'True or false: 4(x + 6) = 4x + 6.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the 4 must multiply BOTH terms: 4(x+6) = 4x + 24.', distractorMisconceptions: { 0: 'distribute-only-first-term' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'distribute-single', multiSelect: false, question: 'Expand -6(x - 2).', options: ['-6x - 12', '-6x + 12', '6x - 12', '-6x - 2'], correctIndices: [1], explanation: '-6 × x = -6x, and -6 × (-2) = 12, so -6(x-2) = -6x + 12.', distractorMisconceptions: { 0: 'sign-error-negative-distribution' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'expand-two-brackets', multiSelect: false, question: 'Expand (x + 1)(x + 6).', options: ['x² + 7x + 6', 'x² + 6', 'x² + 6x + 1', 'x² + 7x + 7'], correctIndices: [0], explanation: 'x² + 6x + x + 6 = x² + 7x + 6.', distractorMisconceptions: { 1: 'foil-missed-term' } },
    { id: 'q4', type: 'true-false', objectiveId: 'expand-two-brackets', multiSelect: false, question: 'True or false: (x+2)(x+3) = x² + 5x + 6 is fully simplified.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — 3x and 2x have already been combined into 5x, and there are no more like terms left.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'square-binomial', multiSelect: false, question: 'Expand (x + 7)².', options: ['x² + 49', 'x² + 7x + 49', 'x² + 14x + 49', 'x² + 14x + 7'], correctIndices: [2], explanation: '(x+7)(x+7) = x² + 7x + 7x + 49 = x² + 14x + 49.', distractorMisconceptions: { 0: 'square-binomial-drop-middle' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'square-binomial', multiSelect: false, question: 'Expand (x - 5)².', options: ['x² - 25', 'x² - 10x + 25', 'x² + 25', 'x² - 5x + 25'], correctIndices: [1], explanation: '(x-5)(x-5) = x² - 5x - 5x + 25 = x² - 10x + 25.', distractorMisconceptions: { 0: 'square-binomial-drop-middle' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'difference-of-squares', multiSelect: false, question: 'Expand (x + 8)(x - 8).', options: ['x² - 64', 'x² + 64', 'x² - 16x - 64', 'x² - 16x + 64'], correctIndices: [0], explanation: 'The middle terms (-8x and 8x) cancel, leaving x² - 64.', distractorMisconceptions: { 2: 'difference-squares-wrong-signs', 3: 'difference-squares-wrong-signs' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'difference-of-squares', multiSelect: true, question: 'Which of these expand to a difference of squares (no middle x-term)? (select all that apply)', options: ['(x+4)(x-4)', '(x+4)(x+4)', '(x+10)(x-10)', '(x-3)(x+8)'], correctIndices: [0, 2], explanation: '(x+4)(x-4) and (x+10)(x-10) both fit the (a+b)(a-b) pattern, so their middle terms cancel. The other two do not.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'expand-two-brackets',
      analogy: 'Think of each bracket as a shopping list of two items. Expanding (a+b)(c+d) means every item in the first list has to "shop" at every item in the second list — that\'s where the 4 products come from: nothing gets skipped.',
      explanation: 'Slow the process down: label the two terms in the first bracket 1st and 2nd, and the two terms in the second bracket 1st and 2nd. Compute 1st×1st, 1st×2nd, 2nd×1st, 2nd×2nd, in that order, before combining anything.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Expand (x + 2)(x + 9) using the 4-product method.', steps: [
          { step: '1st×1st: x × x = x²', justification: 'First term of each bracket.' },
          { step: '1st×2nd: x × 9 = 9x', justification: 'First term of bracket 1, second term of bracket 2.' },
          { step: '2nd×1st: 2 × x = 2x', justification: 'Second term of bracket 1, first term of bracket 2.' },
          { step: '2nd×2nd: 2 × 9 = 18', justification: 'Second term of each bracket.' },
          { step: 'x² + 9x + 2x + 18 = x² + 11x + 18', justification: 'Combine 9x and 2x.' },
        ], answer: 'x² + 11x + 18' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'expand-two-brackets', question: 'Expand (x + 3)(x + 4).', options: ['x² + 7x + 12', 'x² + 12', 'x² + 7x + 7', 'x² + 4x + 12'], correctIndex: 0, hints: { strategic: 'Use all 4 products in order.', procedural: 'x²+4x+3x+12', workedStep: 'Combine 4x and 3x: x² + 7x + 12.' }, distractorMisconceptions: { 1: 'foil-missed-term' } },
        { id: 'rem-p2', objectiveId: 'expand-two-brackets', question: 'Expand (x - 1)(x + 6).', options: ['x² + 5x - 6', 'x² - 6', 'x² + 7x - 6', 'x² + 5x + 6'], correctIndex: 0, hints: { strategic: 'Use all 4 products.', procedural: 'x²+6x-x-6', workedStep: 'Combine 6x and -x: x² + 5x - 6.' }, distractorMisconceptions: { 1: 'foil-missed-term' } },
        { id: 'rem-p3', objectiveId: 'expand-two-brackets', question: 'Expand (x - 4)(x - 2).', options: ['x² - 6x + 8', 'x² + 8', 'x² - 6x - 8', 'x² - 2x + 8'], correctIndex: 0, hints: { strategic: 'Use all 4 products, watch the signs.', procedural: 'x²-2x-4x+8', workedStep: 'Combine -2x and -4x: x² - 6x + 8.' }, distractorMisconceptions: { 2: 'difference-squares-wrong-signs' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which felt trickiest: distributing one term, or expanding two brackets?', type: 'multiple-choice', options: ['Distributing a single term', 'Expanding two brackets', 'The squared-binomial pattern', 'The difference-of-squares pattern'] },
    { id: 'r2', prompt: 'How confident do you feel expanding brackets now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you double-check next time you expand a bracket?', type: 'free-text' },
  ],
};
