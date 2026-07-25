// ── Topic 4: Factorisation — Algebra, Grade 10, Term 1 ────────────────────────
// Lighter-weight build per LIBRARY_PARTNER_HANDOFF.md §4/step 7. Builds
// directly on Topic 3 (expanding brackets) — factorising is presented as the
// reverse process.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'incomplete-common-factor',
    label: 'Taking out a common factor that isn\'t the highest one',
    errorType: 'You factored out a common factor, but it wasn\'t the highest common factor available.',
    principle: 'Always take out the HIGHEST common factor (HCF) of every term — both the number part and the variable part — so the bracket left behind has no further common factor.',
    correctStep: '8x² + 12x: the HCF is 4x (not just 4 or just x), giving 4x(2x + 3).',
  },
  {
    id: 'forget-to-check-remaining-factor',
    label: 'Not checking if the bracket left behind can be factorised further',
    errorType: 'You stopped after one round of factorising, but the bracket left over can still be factorised.',
    principle: 'Factorising isn\'t finished until no factor (common, trinomial, or difference-of-squares) remains inside any bracket.',
    correctStep: '2x² - 8 = 2(x² - 4) = 2(x - 2)(x + 2) — the difference of squares inside still needed factorising.',
  },
  {
    id: 'trinomial-wrong-sign-pair',
    label: 'Picking a factor pair with the wrong signs for a trinomial',
    errorType: 'You found two numbers that multiply to give the constant term but their signs don\'t produce the correct middle term.',
    principle: 'For x² + bx + c, you need two numbers that multiply to c AND add to b — both conditions must hold, not just one.',
    correctStep: 'x² + x - 12: need two numbers that multiply to -12 and add to +1 → 4 and -3 (not -4 and 3, which add to -1).',
  },
  {
    id: 'difference-squares-not-recognised',
    label: 'Not recognising a difference of squares',
    errorType: 'You tried to factorise a difference-of-squares expression as if it were a general trinomial, or said it can\'t be factorised.',
    principle: 'a² - b² always factorises as (a+b)(a-b) — recognise this pattern whenever you see two perfect squares separated by a minus sign, with no middle term.',
    correctStep: 'x² - 49 = (x + 7)(x - 7).',
  },
  {
    id: 'sum-of-squares-treated-as-factorable',
    label: 'Trying to factorise a sum of squares',
    errorType: 'You attempted to factorise an expression like x² + 25 using the difference-of-squares pattern.',
    principle: 'x² + 25 does NOT factorise using real numbers — the difference-of-squares pattern only works with a MINUS sign between the two squared terms, not a plus.',
    correctStep: 'x² + 25 cannot be factorised further at this level; only x² - 25 = (x+5)(x-5) can.',
  },
  {
    id: 'grouping-wrong-pairs',
    label: 'Grouping terms in the wrong pairs when factorising by grouping',
    errorType: 'You paired terms for grouping in a way that doesn\'t leave a common bracket factor.',
    principle: 'When factorising by grouping, pair terms so that each pair shares a common factor, and check that both pairs leave the SAME bracket behind.',
    correctStep: 'xy + 3x + 2y + 6 = x(y+3) + 2(y+3) = (y+3)(x+2) — both groups had to produce the same (y+3) bracket.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'factorisation',
  topicName: 'Factorisation',
  prerequisites: [
    'Expanding brackets, including squared binomials and difference of squares (Topic 3)',
    'Finding factors and highest common factors of numbers',
  ],
  objectives: [
    { id: 'common-factor', text: 'Factorise an expression by taking out the highest common factor.' },
    { id: 'trinomial', text: 'Factorise a trinomial of the form x² + bx + c into two brackets.' },
    { id: 'difference-squares-factor', text: 'Recognise and factorise a difference of squares.' },
    { id: 'grouping', text: 'Factorise a four-term expression by grouping.' },
  ],
  estimatedMinutes: [20, 30],
};

export const factorisation: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What if you had to run expanding backwards?',
  goalSettingPrompt:
    'In the last lesson you learned to expand brackets into a longer expression. Factorising is the reverse: turning a longer expression back into brackets. By the end of this lesson you\'ll be able to spot and apply four different factorising patterns.',

  activate: {
    connectPrompt: 'You already know how to expand brackets. Let\'s check that skill, since factorising is its reverse.',
    diagnosticQuestions: [
      { question: 'Expand 3(x + 5).', options: ['3x + 5', '3x + 15', 'x + 15', '3x + 8'], correctIndex: 1, explanation: '3 × x = 3x, 3 × 5 = 15, so 3(x+5) = 3x + 15.' },
      { question: 'Expand (x + 4)(x - 4).', options: ['x² - 16', 'x² + 16', 'x² - 8x - 16', 'x² + 8'], correctIndex: 0, explanation: 'The middle terms cancel: (x+4)(x-4) = x² - 4x + 4x - 16 = x² - 16.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Factorising means writing an expression as a product of factors — the reverse of expanding. The simplest kind is taking out a common factor: find the highest common factor (HCF) of every term, then write it outside a bracket containing what\'s left when you divide each term by that HCF. Always check the resulting bracket can\'t be factorised further.',
    workedExamples: [
      { id: 'wx-common-basic', prompt: 'Factorise 6x + 15.', steps: [
        { step: 'Find the HCF of 6 and 15: it\'s 3.', justification: 'The HCF must divide into every term exactly.' },
        { step: '6x ÷ 3 = 2x, and 15 ÷ 3 = 5.', justification: 'Divide each term by the HCF to find what goes inside the bracket.' },
      ], answer: '3(2x + 5)' },
      { id: 'wx-common-variable', prompt: 'Factorise 8x² + 12x.', steps: [
        { step: 'HCF of the numbers: HCF(8,12) = 4. HCF of the variables: both terms have at least one x, so include x too.', justification: 'The HCF includes both a numeric part and a variable part when every term shares a variable.' },
        { step: '8x² ÷ 4x = 2x, and 12x ÷ 4x = 3.', justification: 'Divide each term by the full HCF, 4x.' },
      ], answer: '4x(2x + 3)' },
    ],
    knowledgeChecks: [
      { question: 'Factorise 10x + 25.', options: ['5(2x + 5)', '5(2x + 25)', '10(x + 25)', '5(x + 5)'], correctIndex: 0, explanation: 'HCF(10,25) = 5. 10x ÷ 5 = 2x, 25 ÷ 5 = 5, so 10x + 25 = 5(2x + 5).', misconceptionId: 'incomplete-common-factor' },
      { question: 'Which is the fully factorised form of 12x² + 18x?', options: ['6(2x² + 3x)', '6x(2x + 3)', '2x(6x + 9)', '3x(4x + 6)'], correctIndex: 1, explanation: 'The HCF of 12x² and 18x is 6x — larger than 6, 2x, or 3x alone, and it leaves no further common factor inside the bracket.', misconceptionId: 'incomplete-common-factor' },
    ],
    confidenceCheckPrompt: 'How confident do you feel finding the highest common factor and factorising it out?',
  },

  demonstrateChunk2: {
    explanation:
      'Two more factorising patterns: trinomials and difference of squares. For x² + bx + c, find two numbers that MULTIPLY to give c AND ADD to give b — both conditions must hold at once. For a difference of squares, a² - b², the answer is always (a+b)(a-b) — recognise it whenever two perfect squares are separated by a minus sign with no middle term. A sum of squares like x² + 25 cannot be factorised this way.',
    workedExamples: [
      { id: 'wx-trinomial', prompt: 'Factorise x² + 7x + 12.', steps: [
        { step: 'Need two numbers that multiply to 12 and add to 7.', justification: 'This matches the pattern x² + bx + c with b=7, c=12.' },
        { step: 'Try factor pairs of 12: (1,12), (2,6), (3,4). 3 + 4 = 7 ✓', justification: '3 and 4 satisfy both conditions.' },
      ], answer: '(x + 3)(x + 4)' },
      { id: 'wx-trinomial-negative', prompt: 'Factorise x² + x - 12.', steps: [
        { step: 'Need two numbers that multiply to -12 and add to +1.', justification: 'One number must be negative since the product is negative.' },
        { step: 'Try 4 and -3: 4 × (-3) = -12 ✓, and 4 + (-3) = 1 ✓', justification: 'Both conditions are satisfied.' },
      ], answer: '(x + 4)(x - 3)' },
      { id: 'wx-diff-squares-factor', prompt: 'Factorise x² - 81.', steps: [
        { step: 'Recognise this as a difference of squares: x² and 81 = 9² are both perfect squares, separated by a minus.', justification: 'Matches the a² - b² pattern.' },
        { step: 'Apply (a+b)(a-b) with a=x, b=9.', justification: 'This pattern always applies to a difference of two squares.' },
      ], answer: '(x + 9)(x - 9)' },
    ],
    knowledgeChecks: [
      { question: 'Factorise x² - 2x - 15.', options: ['(x - 5)(x + 3)', '(x + 5)(x - 3)', '(x - 5)(x - 3)', '(x + 5)(x + 3)'], correctIndex: 0, explanation: 'Need two numbers multiplying to -15 and adding to -2: -5 and 3 work (-5 × 3 = -15, -5 + 3 = -2).', misconceptionId: 'trinomial-wrong-sign-pair' },
      { question: 'Which of these can be factorised using the difference-of-squares pattern?', options: ['x² + 36', 'x² - 36', 'x² + 6x + 36', 'x² - 6x + 36'], correctIndex: 1, explanation: 'x² - 36 is a minus between two perfect squares (x² and 6²), so it factorises as (x+6)(x-6). x² + 36 (a sum) cannot be factorised this way.', misconceptionId: 'sum-of-squares-treated-as-factorable' },
    ],
    confidenceCheckPrompt: 'How confident do you feel factorising trinomials and recognising a difference of squares?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'common-factor', revealSteps: 2, prompt: 'Factorise 9x² + 21x.', steps: [
        { step: 'HCF(9,21) = 3, and both terms share at least one x, so the HCF is 3x.', justification: 'Include both the numeric and variable common factor.' },
        { step: '9x² ÷ 3x = 3x, and 21x ÷ 3x = 7.', justification: 'Divide each term by the HCF.' },
      ], answer: '3x(3x + 7)' },
      { id: 'fp-partial-1', objectiveId: 'trinomial', revealSteps: 1, prompt: 'Factorise x² - 5x + 6.', steps: [
        { step: 'Need two numbers that multiply to 6 and add to -5.', justification: 'Both numbers must be negative since they multiply to a positive but add to a negative.' },
        { step: '-2 and -3: (-2)×(-3)=6 ✓, (-2)+(-3)=-5 ✓', justification: 'Both conditions satisfied.' },
      ], answer: '(x - 2)(x - 3)' },
      { id: 'fp-independent-1', objectiveId: 'difference-squares-factor', revealSteps: 0, prompt: 'Factorise x² - 100.', steps: [
        { step: 'Recognise x² and 100 = 10² as perfect squares with a minus between them.', justification: 'Matches the difference-of-squares pattern.' },
        { step: 'Apply (a+b)(a-b) with a=x, b=10.', justification: 'Standard pattern application.' },
      ], answer: '(x + 10)(x - 10)' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'common-factor', question: 'Factorise 14x + 21.', options: ['7(2x + 3)', '7(2x + 21)', '14(x + 21)', '7(x + 3)'], correctIndex: 0, hints: { strategic: 'What is the HCF of 14 and 21?', procedural: 'HCF(14,21) = 7. Divide each term by 7.', workedStep: '14x ÷ 7 = 2x, 21 ÷ 7 = 3, so 14x+21 = 7(2x+3).' }, distractorMisconceptions: { 1: 'incomplete-common-factor' } },
      { id: 'ip-2', objectiveId: 'common-factor', question: 'Factorise 15x² - 10x.', options: ['5x(3x - 2)', '5(3x² - 2x)', '5x(3x - 10)', '10x(1.5x - 1)'], correctIndex: 0, hints: { strategic: 'Find the HCF including the variable.', procedural: 'HCF(15,10)=5, both terms have x, so HCF = 5x.', workedStep: '15x² ÷ 5x = 3x, -10x ÷ 5x = -2, so 15x²-10x = 5x(3x-2).' }, distractorMisconceptions: { 1: 'incomplete-common-factor' } },
      { id: 'ip-3', objectiveId: 'trinomial', question: 'Factorise x² + 3x - 10.', options: ['(x + 5)(x - 2)', '(x - 5)(x + 2)', '(x + 5)(x + 2)', '(x - 5)(x - 2)'], correctIndex: 0, hints: { strategic: 'Which two numbers multiply to -10 and add to 3?', procedural: 'Try 5 and -2: 5×(-2)=-10, 5+(-2)=3.', workedStep: '(x+5)(x-2) is correct.' }, distractorMisconceptions: { 1: 'trinomial-wrong-sign-pair' } },
      { id: 'ip-4', objectiveId: 'difference-squares-factor', question: 'Factorise x² - 121.', options: ['(x + 11)(x - 11)', 'cannot be factorised', '(x - 11)²', '(x + 11)²'], correctIndex: 0, hints: { strategic: 'Is 121 a perfect square?', procedural: '121 = 11², and there is a minus sign, so this is a difference of squares.', workedStep: 'x² - 121 = (x+11)(x-11).' }, distractorMisconceptions: { 1: 'difference-squares-not-recognised' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'common-factor', multiSelect: false, question: 'Factorise 12x + 18.', options: ['6(2x + 3)', '3(4x + 6)', '2(6x + 9)', '6(2x + 18)'], correctIndices: [0], explanation: 'HCF(12,18) = 6, and 6 is the HIGHEST common factor — 12x+18 = 6(2x+3), which cannot be factorised further.', distractorMisconceptions: { 1: 'incomplete-common-factor', 2: 'incomplete-common-factor' } },
    { id: 'q2', type: 'true-false', objectiveId: 'common-factor', multiSelect: false, question: 'True or false: 4(x² - 4) is fully factorised.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — x² - 4 is itself a difference of squares and factorises further: 4(x²-4) = 4(x+2)(x-2).', distractorMisconceptions: { 0: 'forget-to-check-remaining-factor' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'trinomial', multiSelect: false, question: 'Factorise x² - 7x + 10.', options: ['(x - 2)(x - 5)', '(x + 2)(x - 5)', '(x - 2)(x + 5)', '(x + 2)(x + 5)'], correctIndices: [0], explanation: 'Need two numbers multiplying to 10 and adding to -7: -2 and -5 (both negative since they multiply positive but add negative).', distractorMisconceptions: { 1: 'trinomial-wrong-sign-pair' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'trinomial', multiSelect: false, question: 'Factorise x² + 2x - 8.', options: ['(x + 4)(x - 2)', '(x - 4)(x + 2)', '(x + 4)(x + 2)', '(x - 4)(x - 2)'], correctIndices: [0], explanation: 'Need two numbers multiplying to -8 and adding to 2: 4 and -2.', distractorMisconceptions: { 1: 'trinomial-wrong-sign-pair' } },
    { id: 'q5', type: 'true-false', objectiveId: 'difference-squares-factor', multiSelect: false, question: 'True or false: x² + 49 can be factorised as (x+7)(x-7).', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the difference-of-squares pattern only applies with a MINUS between the two squares. x² + 49 (a sum) cannot be factorised this way.', distractorMisconceptions: { 0: 'sum-of-squares-treated-as-factorable' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'difference-squares-factor', multiSelect: false, question: 'Factorise x² - 144.', options: ['(x + 12)(x - 12)', '(x - 12)²', 'cannot be factorised', '(x + 12)²'], correctIndices: [0], explanation: '144 = 12², so x² - 144 = (x+12)(x-12).', distractorMisconceptions: { 2: 'difference-squares-not-recognised' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'grouping', multiSelect: false, question: 'Factorise xy + 5x + 3y + 15 by grouping.', options: ['(y + 5)(x + 3)', '(x + 5)(y + 3)', '(y + 3)(x + 5)', 'cannot be grouped'], correctIndices: [0], explanation: 'Group as x(y+5) + 3(y+5) = (y+5)(x+3) — both groups produce the same bracket, (y+5).', distractorMisconceptions: { 3: 'grouping-wrong-pairs' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'grouping', multiSelect: true, question: 'For ab + 4a + 2b + 8, which groupings correctly lead to a common bracket? (select all that apply)', options: ['a(b + 4) and 2(b + 4)', 'a(b + 2) and 4(2 + b)... i.e. re-ordered terms still giving (b+4)', 'ab + 4a grouped with 2b + 8 giving different brackets', 'a(b+4) + 2(b+4)'], correctIndices: [0, 3], explanation: 'ab+4a+2b+8 = a(b+4) + 2(b+4) = (b+4)(a+2) — both valid groupings shown produce the matching (b+4) bracket.', distractorMisconceptions: { 2: 'grouping-wrong-pairs' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'trinomial',
      analogy: 'Think of factorising a trinomial like solving a small puzzle with two clues: the two missing numbers must MULTIPLY to give the last term, AND ADD to give the middle coefficient. Both clues must match at once — a pair that satisfies only one clue is not the answer.',
      explanation: 'List a few factor pairs of the constant term, then check each pair\'s sum against the middle coefficient. Stop as soon as both conditions match.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Factorise x² + 8x + 15.', steps: [
          { step: 'Factor pairs of 15: (1,15), (3,5).', justification: 'List pairs that multiply to the constant term.' },
          { step: 'Check sums: 1+15=16 (no), 3+5=8 (yes!)', justification: 'Compare each pair\'s sum to the middle coefficient, 8.' },
        ], answer: '(x + 3)(x + 5)' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'trinomial', question: 'Factorise x² + 9x + 20.', options: ['(x + 4)(x + 5)', '(x + 2)(x + 10)', '(x - 4)(x - 5)', '(x + 20)(x + 1)'], correctIndex: 0, hints: { strategic: 'Which factor pair of 20 adds to 9?', procedural: 'Try 4 and 5: 4×5=20, 4+5=9.', workedStep: '(x+4)(x+5) is correct.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'trinomial', question: 'Factorise x² - 3x - 4.', options: ['(x - 4)(x + 1)', '(x + 4)(x - 1)', '(x - 4)(x - 1)', '(x + 4)(x + 1)'], correctIndex: 0, hints: { strategic: 'Which pair multiplies to -4 and adds to -3?', procedural: 'Try -4 and 1: -4×1=-4, -4+1=-3.', workedStep: '(x-4)(x+1) is correct.' }, distractorMisconceptions: { 2: 'trinomial-wrong-sign-pair' } },
        { id: 'rem-p3', objectiveId: 'trinomial', question: 'Factorise x² - 10x + 21.', options: ['(x - 3)(x - 7)', '(x + 3)(x + 7)', '(x - 3)(x + 7)', '(x + 3)(x - 7)'], correctIndex: 0, hints: { strategic: 'Both numbers must be negative here — why?', procedural: 'They multiply to +21 (positive) but add to -10 (negative), so both are negative.', workedStep: '-3 and -7: product 21, sum -10. (x-3)(x-7).' }, distractorMisconceptions: { 2: 'trinomial-wrong-sign-pair' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which factorising pattern felt hardest: common factor, trinomial, or difference of squares?', type: 'multiple-choice', options: ['Common factor', 'Trinomial', 'Difference of squares', 'Grouping'] },
    { id: 'r2', prompt: 'How confident do you feel factorising now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is one thing you\'ll check before saying an expression is "fully factorised"?', type: 'free-text' },
  ],
};
