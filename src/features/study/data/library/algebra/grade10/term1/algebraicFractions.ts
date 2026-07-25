// ── Topic 5: Simplifying Algebraic Fractions — Algebra, Grade 10, Term 1 ─────
// Lighter-weight build per LIBRARY_PARTNER_HANDOFF.md §4/step 7. Builds
// directly on Topic 4 (factorisation) — simplifying algebraic fractions is
// framed as "factorise, then cancel".

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'cancel-terms-not-factors',
    label: 'Cancelling a term instead of a factor',
    errorType: 'You cancelled a term that is being added or subtracted, rather than a factor that is being multiplied.',
    principle: 'You can only cancel FACTORS (things being multiplied) that appear in both the numerator and denominator — never terms that are added or subtracted.',
    correctStep: '(x + 3)/3 cannot cancel the 3s — 3 is a term added to x, not a factor of the whole numerator. Only (3x)/3 = x can cancel, because 3 is a factor there.',
  },
  {
    id: 'skip-factorise-before-cancel',
    label: 'Trying to cancel before factorising',
    errorType: 'You tried to simplify a fraction by cancelling parts of an unfactorised expression.',
    principle: 'An algebraic fraction can only be simplified once both the numerator and denominator are written as products of factors — factorise first, cancel second.',
    correctStep: '(x²-9)/(x+3) must first become ((x+3)(x-3))/(x+3), then the (x+3) factors cancel, leaving x-3.',
  },
  {
    id: 'cancel-across-addition',
    label: 'Cancelling a factor that\'s only in part of a sum',
    errorType: 'You cancelled a factor that appears in only one term of a multi-term numerator or denominator, not the whole thing.',
    principle: 'A factor can only be cancelled if it divides EVERY term in both the numerator and denominator — not just one part of a sum.',
    correctStep: '(x² + x)/x = x(x+1)/x = x+1 is valid because x is a factor of BOTH terms in x²+x. But (x+5)/x cannot cancel the x, since x is not a factor of 5.',
  },
  {
    id: 'restriction-not-considered',
    label: 'Not noting the value(s) that make the denominator zero',
    errorType: 'You simplified a fraction without stating which value(s) of the variable are not allowed.',
    principle: 'Division by zero is undefined, so any value of the variable that makes the ORIGINAL denominator zero must be excluded, even after simplifying.',
    correctStep: '(x²-9)/(x+3) simplifies to x-3, but x ≠ -3 must be stated, since x = -3 makes the original denominator zero.',
  },
  {
    id: 'sign-error-factoring-denominator',
    label: 'Losing a sign when factorising a "reversed" bracket',
    errorType: 'You didn\'t account for the sign change when a bracket in the denominator is the reverse of one in the numerator.',
    principle: '(a - b) and (b - a) are negatives of each other: (b - a) = -(a - b). Spotting this lets you cancel brackets that look reversed.',
    correctStep: '(x-5)/(5-x) = (x-5)/-(x-5) = -1.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'algebraic-fractions',
  topicName: 'Simplifying Algebraic Fractions',
  prerequisites: [
    'Factorising: common factor, trinomials, difference of squares (Topic 4)',
    'Simplifying numeric fractions to lowest terms',
  ],
  objectives: [
    { id: 'cancel-common-factor', text: 'Simplify an algebraic fraction by cancelling a common factor from numerator and denominator.' },
    { id: 'factorise-then-cancel', text: 'Factorise both the numerator and denominator before cancelling common factors.' },
    { id: 'state-restrictions', text: 'State the value(s) of the variable for which the original denominator is undefined.' },
    { id: 'multiply-divide-fractions', text: 'Multiply and divide algebraic fractions by factorising, then cancelling, then combining.' },
  ],
  estimatedMinutes: [20, 30],
};

export const algebraicFractions: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What can you actually cancel?',
  goalSettingPrompt:
    'Numeric fractions simplify by cancelling common factors — algebraic fractions work exactly the same way, but only once everything is factorised into a product. By the end of this lesson you\'ll be able to simplify algebraic fractions correctly, and know which values of the variable to avoid.',

  activate: {
    connectPrompt: 'You already know how to factorise. Let\'s check that, since simplifying algebraic fractions depends on it.',
    diagnosticQuestions: [
      { question: 'Factorise x² - 25.', options: ['(x+5)(x-5)', '(x-5)²', '(x+5)²', 'cannot be factorised'], correctIndex: 0, explanation: 'x² - 25 is a difference of squares: (x+5)(x-5).' },
      { question: 'Simplify the numeric fraction 12/18 to lowest terms.', options: ['2/3', '6/9', '4/6', '3/4'], correctIndex: 0, explanation: 'HCF(12,18) = 6, so 12/18 = 2/3.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'To simplify an algebraic fraction, you cancel a common FACTOR from the numerator and denominator — exactly like simplifying a numeric fraction. The key rule: you can only cancel something that is being multiplied by everything else (a factor), never something that is added or subtracted (a term). If the numerator or denominator isn\'t already written as a single product, you must factorise it first before you can cancel anything.',
    workedExamples: [
      { id: 'wx-cancel-simple', prompt: 'Simplify (5x)/(10x²).', steps: [
        { step: 'Both terms have a factor of 5x in common.', justification: 'Identify the common factor in numerator and denominator.' },
        { step: '5x ÷ 5x = 1, and 10x² ÷ 5x = 2x.', justification: 'Divide both numerator and denominator by the common factor.' },
      ], answer: '1/(2x)' },
      { id: 'wx-no-cancel', prompt: 'Can (x + 3)/3 be simplified by cancelling the 3s?', steps: [
        { step: 'Check: is 3 a FACTOR of the whole numerator (x+3), or just a term?', justification: 'Only factors of the entire numerator/denominator can cancel.' },
        { step: 'x + 3 is a SUM — 3 is added to x, it is not a factor multiplying the whole expression.', justification: 'You cannot cancel a number that is only added to part of the numerator.' },
      ], answer: 'No — (x+3)/3 is already fully simplified; the 3s cannot cancel.' },
    ],
    knowledgeChecks: [
      { question: 'Simplify (8x²)/(4x).', options: ['2x', '4x', '2x²', '8x'], correctIndex: 0, explanation: '8x² ÷ 4x = 2x — the common factor 4x cancels from top and bottom.', misconceptionId: 'cancel-terms-not-factors' },
      { question: 'Can (x + 7)/(x) be simplified further by cancelling the x\'s?', options: ['Yes, it simplifies to 1 + 7', 'No, x is not a factor of the whole numerator', 'Yes, it simplifies to 7', 'Yes, it simplifies to 1/7'], correctIndex: 1, explanation: 'x is a term added to 7 in the numerator, not a factor of the whole numerator, so nothing cancels.', misconceptionId: 'cancel-terms-not-factors' },
    ],
    confidenceCheckPrompt: 'How confident do you feel telling the difference between cancelling a factor and (wrongly) cancelling a term?',
  },

  demonstrateChunk2: {
    explanation:
      'Most algebraic fractions need to be factorised before anything can cancel. The process: factorise the numerator, factorise the denominator, then cancel any bracket (or factor) that appears in both. Whenever you cancel a factor from the denominator, remember: any value of the variable that would have made the ORIGINAL denominator zero is still not allowed, even in the simplified answer — division by zero is always undefined. Watch also for brackets that are exact opposites of each other, like (x-5) and (5-x): (5-x) = -(x-5), so they can still cancel, but leave behind a negative sign.',
    workedExamples: [
      { id: 'wx-factor-cancel', prompt: 'Simplify (x² - 9)/(x + 3), stating any restriction.', steps: [
        { step: 'Factorise the numerator: x² - 9 = (x+3)(x-3).', justification: 'This is a difference of squares.' },
        { step: 'The (x+3) factor appears in both numerator and denominator, so it cancels.', justification: 'Cancel the common bracket factor.' },
        { step: 'The original denominator (x+3) is zero when x = -3, so this value must be excluded.', justification: 'State the restriction based on the ORIGINAL denominator, before simplifying.' },
      ], answer: 'x - 3, where x ≠ -3' },
      { id: 'wx-opposite-brackets', prompt: 'Simplify (x - 6)/(6 - x).', steps: [
        { step: 'Notice (6 - x) is the exact opposite of (x - 6): 6 - x = -(x - 6).', justification: 'Rewrite the denominator to reveal the shared factor.' },
        { step: '(x-6)/-(x-6) = -1, since a value divided by its own negative is always -1.', justification: 'The (x-6) factors cancel, leaving the sign.' },
      ], answer: '-1, where x ≠ 6' },
    ],
    knowledgeChecks: [
      { question: 'Simplify (x² - 16)/(x - 4).', options: ['x + 4', 'x - 4', 'x² - 4', '4'], correctIndex: 0, explanation: 'x² - 16 = (x+4)(x-4), so (x+4)(x-4)/(x-4) = x+4 (with x ≠ 4).', misconceptionId: 'skip-factorise-before-cancel' },
      { question: 'For (x² - 4)/(x - 2), what restriction must be stated?', options: ['x ≠ 2', 'x ≠ -2', 'x ≠ 0', 'no restriction needed'], correctIndex: 0, explanation: 'The original denominator x - 2 is zero when x = 2, so x ≠ 2 must be stated even after simplifying to x + 2.', misconceptionId: 'restriction-not-considered' },
    ],
    confidenceCheckPrompt: 'How confident do you feel factorising an algebraic fraction before cancelling, and stating restrictions?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'cancel-common-factor', revealSteps: 2, prompt: 'Simplify (6x²)/(9x).', steps: [
        { step: 'HCF of 6x² and 9x is 3x.', justification: 'Find the common factor.' },
        { step: '6x² ÷ 3x = 2x, and 9x ÷ 3x = 3.', justification: 'Divide both by the common factor.' },
      ], answer: '2x/3' },
      { id: 'fp-partial-1', objectiveId: 'factorise-then-cancel', revealSteps: 1, prompt: 'Simplify (x² + 5x)/(x² - 25).', steps: [
        { step: 'Factorise: numerator = x(x+5), denominator = (x+5)(x-5).', justification: 'Factorise both parts fully first.' },
        { step: 'Cancel the shared (x+5) factor.', justification: 'It appears in both numerator and denominator.' },
      ], answer: 'x/(x - 5), where x ≠ -5, 5' },
      { id: 'fp-independent-1', objectiveId: 'state-restrictions', revealSteps: 0, prompt: 'Simplify (x² - 49)/(x + 7), stating the restriction.', steps: [
        { step: 'Factorise the numerator as (x+7)(x-7), cancel the shared (x+7).', justification: 'Difference of squares, then cancel.' },
        { step: 'The original denominator is zero at x = -7.', justification: 'Restriction comes from the original, unsimplified denominator.' },
      ], answer: 'x - 7, where x ≠ -7' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'cancel-common-factor', question: 'Simplify (12x³)/(4x).', options: ['3x²', '3x', '4x²', '8x²'], correctIndex: 0, hints: { strategic: 'What is the HCF of 12x³ and 4x?', procedural: 'HCF = 4x. Divide both by it.', workedStep: '12x³ ÷ 4x = 3x², 4x ÷ 4x = 1.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'factorise-then-cancel', question: 'Simplify (x² - 6x)/(x² - 36).', options: ['x/(x + 6)', 'x/(x - 6)', '(x-6)/(x+6)', '1/6'], correctIndex: 0, hints: { strategic: 'Factorise both numerator and denominator first.', procedural: 'Numerator = x(x-6), denominator = (x+6)(x-6).', workedStep: 'Cancel the shared (x-6): result is x/(x+6).' }, distractorMisconceptions: { 3: 'skip-factorise-before-cancel' } },
      { id: 'ip-3', objectiveId: 'state-restrictions', question: 'For (x+2)(x-2)/(x-2), which restriction applies?', options: ['x ≠ 2', 'x ≠ -2', 'x ≠ 0', 'x ≠ 4'], correctIndex: 0, hints: { strategic: 'Which value makes the ORIGINAL denominator zero?', procedural: 'The denominator is (x - 2).', workedStep: 'x - 2 = 0 when x = 2, so x ≠ 2.' }, distractorMisconceptions: { 2: 'restriction-not-considered' } },
      { id: 'ip-4', objectiveId: 'cancel-common-factor', question: 'Simplify (x - 8)/(8 - x).', options: ['-1', '1', 'x - 8', '0'], correctIndex: 0, hints: { strategic: 'Is the denominator the exact opposite of the numerator?', procedural: '8 - x = -(x - 8).', workedStep: '(x-8)/-(x-8) = -1.' }, distractorMisconceptions: { 2: 'sign-error-factoring-denominator' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'cancel-common-factor', multiSelect: false, question: 'True or false: in (x+4)/4, the 4s can be cancelled to leave x.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — 4 is a term added to x in the numerator, not a factor of the whole numerator, so it cannot cancel.', distractorMisconceptions: { 0: 'cancel-terms-not-factors' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'cancel-common-factor', multiSelect: false, question: 'Simplify (15x²)/(20x).', options: ['3x/4', '15x/20', '3/4x', '4x/3'], correctIndices: [0], explanation: 'HCF(15x²,20x) = 5x. 15x² ÷ 5x = 3x, 20x ÷ 5x = 4, so the result is 3x/4.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'factorise-then-cancel', multiSelect: false, question: 'Simplify (x² - 3x)/(x² - 9).', options: ['x/(x + 3)', 'x/(x - 3)', '(x-3)/(x+3)', '1/3'], correctIndices: [0], explanation: 'Numerator = x(x-3), denominator = (x+3)(x-3). Cancel the shared (x-3), leaving x/(x+3).', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'factorise-then-cancel', multiSelect: false, question: 'True or false: (x²-16)/(x+4) can be simplified without factorising first.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — you must factorise x²-16 into (x+4)(x-4) before anything can validly cancel.', distractorMisconceptions: { 0: 'skip-factorise-before-cancel' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'state-restrictions', multiSelect: false, question: 'For (x² - 1)/(x - 1), what restriction must be stated?', options: ['x ≠ 1', 'x ≠ -1', 'x ≠ 0', 'no restriction'], correctIndices: [0], explanation: 'The original denominator (x-1) is zero when x = 1.', distractorMisconceptions: { 3: 'restriction-not-considered' } },
    { id: 'q6', type: 'multi-select', objectiveId: 'state-restrictions', multiSelect: true, question: 'For (x+3)/((x-5)(x+2)), which values must be excluded? (select all that apply)', options: ['x = 5', 'x = -2', 'x = -3', 'x = 3'], correctIndices: [0, 1], explanation: 'The denominator is zero when x = 5 or x = -2 — both make (x-5)(x+2) = 0, so both must be excluded.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'multiply-divide-fractions', multiSelect: false, question: 'Simplify (x/(x+2)) × ((x+2)/3).', options: ['x/3', 'x²/3', '1/3', 'x/(x+2)'], correctIndices: [0], explanation: 'Multiplying, the (x+2) factors cancel across the two fractions, leaving x/3.', distractorMisconceptions: {} },
    { id: 'q8', type: 'decimal-discrimination', objectiveId: 'cancel-common-factor', multiSelect: false, question: 'Simplify (3 - x)/(x - 3).', options: ['-1', '1', '3', '0'], correctIndices: [0], explanation: '3 - x = -(x - 3), so (3-x)/(x-3) = -(x-3)/(x-3) = -1.', distractorMisconceptions: { 1: 'sign-error-factoring-denominator' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'factorise-then-cancel',
      analogy: 'Think of an algebraic fraction like a padlock made of several linked rings (factors). You can only remove a ring that appears as a WHOLE, separate link on both the top and bottom chain — you can never snap a ring in half (cancel part of a sum) to make things match.',
      explanation: 'Before cancelling anything, always factorise both the numerator and denominator completely first. Then look for any whole bracket or factor that appears in both, and only cancel that.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Simplify (x² + 4x)/(x² - 16).', steps: [
          { step: 'Factorise the numerator: x² + 4x = x(x + 4).', justification: 'Common factor x.' },
          { step: 'Factorise the denominator: x² - 16 = (x+4)(x-4).', justification: 'Difference of squares.' },
          { step: 'Cancel the shared (x+4) factor.', justification: 'It appears whole in both numerator and denominator.' },
        ], answer: 'x/(x - 4), where x ≠ -4, 4' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'factorise-then-cancel', question: 'Simplify (x² + 2x)/(x² - 4).', options: ['x/(x - 2)', 'x/(x + 2)', '(x+2)/(x-2)', '1/2'], correctIndex: 0, hints: { strategic: 'Factorise both parts fully first.', procedural: 'Numerator = x(x+2), denominator = (x+2)(x-2).', workedStep: 'Cancel shared (x+2): x/(x-2).' }, distractorMisconceptions: { 1: 'skip-factorise-before-cancel' } },
        { id: 'rem-p2', objectiveId: 'factorise-then-cancel', question: 'Simplify (x² - 5x + 6)/(x - 2).', options: ['x - 3', 'x + 3', 'x - 2', 'x + 2'], correctIndex: 0, hints: { strategic: 'Factorise the trinomial first.', procedural: 'x²-5x+6 = (x-2)(x-3).', workedStep: 'Cancel shared (x-2): x - 3.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'factorise-then-cancel', question: 'Simplify (x² - 9)/(x² + 6x + 9).', options: ['(x-3)/(x+3)', '(x+3)/(x-3)', 'x - 3', 'x + 3'], correctIndex: 0, hints: { strategic: 'Factorise both: one is a difference of squares, the other a squared binomial.', procedural: 'x²-9=(x+3)(x-3); x²+6x+9=(x+3)².', workedStep: 'Cancel one (x+3): (x-3)/(x+3).' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What\'s the biggest rule to remember before cancelling anything in a fraction?', type: 'multiple-choice', options: ['Only cancel factors, never terms', 'Always state restrictions', 'Factorise fully first', 'All of the above'] },
    { id: 'r2', prompt: 'How confident do you feel simplifying algebraic fractions now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you check first the next time you\'re asked to simplify an algebraic fraction?', type: 'free-text' },
  ],
};
