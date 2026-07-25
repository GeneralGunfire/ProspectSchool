// ── Term 4, Topic 2: Geometric Sequences ──────────────────────────────────────
// Builds directly on T4.1's arithmetic sequences via deliberate contrast
// tasks, per the research's specific recommendation to distinguish
// arithmetic vs. geometric growth explicitly.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'ratio-vs-difference-confused',
    label: 'Checking for a common DIFFERENCE instead of a common RATIO',
    errorType: 'You tried to find a constant difference between terms, when the sequence is actually geometric (constant ratio).',
    principle: 'A GEOMETRIC sequence has a constant RATIO (each term ÷ the previous term), not a constant difference. Always check both: if consecutive differences aren\'t constant, try consecutive ratios instead.',
    correctStep: 'For 3, 6, 12, 24: differences are 3,6,12 (not constant) but ratios are 6/3=2, 12/6=2, 24/12=2 (constant) — this is geometric with r=2.',
  },
  {
    id: 'geometric-off-by-one',
    label: 'Using Tn = ar^n instead of Tn = ar^(n-1)',
    errorType: 'You applied the general term formula without the crucial "n-1" exponent adjustment.',
    principle: 'The general term of a geometric sequence is Tn = ar^(n-1), NOT ar^n — because T1 already equals a, with zero "multiplications" by r applied yet.',
    correctStep: 'For a=2, r=3: T1 should be 2. Using Tn=ar^(n-1): T1=2×3⁰=2×1=2 ✓. Using the wrong Tn=ar^n: T1=2×3¹=6 ✗.',
  },
  {
    id: 'negative-ratio-sign-pattern-missed',
    label: 'Not recognising the alternating-sign pattern from a negative common ratio',
    errorType: 'You didn\'t notice that a negative common ratio makes the terms alternate between positive and negative.',
    principle: 'If the common ratio r is NEGATIVE, the terms alternate in sign (positive, negative, positive, negative...) — this is expected behaviour, not an error.',
    correctStep: 'For a=4, r=-2: 4, -8, 16, -32, 64... alternates sign because each multiplication by a negative flips it.',
  },
  {
    id: 'exponent-law-error-in-geometric',
    label: 'Making an exponent-law error when evaluating r^(n-1)',
    errorType: 'You evaluated the power incorrectly, often by multiplying r by (n-1) instead of raising it to that power.',
    principle: 'r^(n-1) means r RAISED TO THE POWER (n-1), not r multiplied by (n-1) — these are very different operations.',
    correctStep: 'For r=2, n=5: r^(n-1) = 2⁴ = 16, NOT 2×4=8.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 4,
  topicId: 'geometric-sequences',
  topicName: 'Geometric Sequences',
  prerequisites: [
    'Arithmetic sequences (this term, Topic 1)',
    'Exponent laws (Term 1)',
  ],
  objectives: [
    { id: 'recognise-geometric-sequence', text: 'Recognise a geometric sequence by its constant common ratio, and distinguish it from arithmetic.' },
    { id: 'find-common-ratio', text: 'Calculate the common ratio of a geometric sequence.' },
    { id: 'derive-geometric-general-term', text: 'Derive and apply the general term formula Tn = ar^(n-1).' },
    { id: 'find-geometric-specific-term', text: 'Find a specific term of a geometric sequence, including with a negative ratio.' },
  ],
  estimatedMinutes: [20, 30],
};

export const geometricSequences: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What kind of pattern grows by multiplying instead of adding?',
  goalSettingPrompt:
    'Arithmetic sequences grow by adding the same amount each time. Geometric sequences grow completely differently — by MULTIPLYING by the same amount each time. By the end of this lesson you\'ll be able to tell them apart and work with geometric sequences confidently.',

  activate: {
    connectPrompt: 'You already know arithmetic sequences (constant difference). Let\'s contrast that with a new pattern type.',
    diagnosticQuestions: [
      { question: 'For the arithmetic sequence 5, 9, 13, 17, what is the common difference?', options: ['4', '5', '9', '1.8'], correctIndex: 0, explanation: '9-5=4, constant.' },
      { question: 'What is 2³?', options: ['8', '6', '9', '5'], correctIndex: 0, explanation: '2×2×2=8.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A GEOMETRIC sequence increases (or decreases) by MULTIPLYING by the same fixed value every step — this is the COMMON RATIO (r), found by dividing any term by the one before it: r = T(n) ÷ T(n-1). This is fundamentally different from an arithmetic sequence\'s constant DIFFERENCE. If a sequence doesn\'t have a constant difference, always check for a constant RATIO before concluding it has no pattern.',
    workedExamples: [
      { id: 'wx-common-ratio', prompt: 'Find the common ratio of 5, 15, 45, 135.', steps: [
        { step: 'r = 15/5 = 3. Check: 45/15=3, 135/45=3.', justification: 'Verify the ratio is constant throughout.' },
      ], answer: 'r = 3' },
      { id: 'wx-distinguish-types', prompt: 'Is 4, 8, 16, 32 arithmetic or geometric?', steps: [
        { step: 'Check for a common difference: 8-4=4, 16-8=8. Not constant — NOT arithmetic.', justification: 'Rule out arithmetic first.' },
        { step: 'Check for a common ratio: 8/4=2, 16/8=2, 32/16=2. Constant — this IS geometric.', justification: 'A constant ratio confirms it\'s geometric.' },
      ], answer: 'Geometric, with r=2' },
    ],
    knowledgeChecks: [
      { question: 'For 2, 6, 18, 54, is this arithmetic or geometric?', options: ['Geometric, r=3', 'Arithmetic, d=4', 'Neither', 'Both'], correctIndex: 0, explanation: 'Differences aren\'t constant (4,12,36), but ratios are: 6/2=3, 18/6=3, 54/18=3.', misconceptionId: 'ratio-vs-difference-confused' },
      { question: 'Find the common ratio of 100, 50, 25, 12.5.', options: ['0.5', '-50', '2', '50'], correctIndex: 0, explanation: '50/100=0.5, constant.', misconceptionId: 'ratio-vs-difference-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel telling arithmetic and geometric sequences apart, and finding the common ratio?',
  },

  demonstrateChunk2: {
    explanation:
      'The GENERAL TERM formula for a geometric sequence is Tn = ar^(n-1), where a is the first term and r is the common ratio — note r is RAISED TO THE POWER (n-1), not multiplied by it. If r is NEGATIVE, the terms alternate in sign — this is expected. As with arithmetic sequences, always test your derived formula against T1 and T2 before trusting it for larger n.',
    workedExamples: [
      { id: 'wx-geometric-general-term', prompt: 'Find the general term of 3, 6, 12, 24 and use it to find T8.', steps: [
        { step: 'a=3, r=2 (since 6/3=2).', justification: 'Identify first term and common ratio.' },
        { step: 'Tn = ar^(n-1) = 3(2)^(n-1).', justification: 'Substitute into the formula.' },
        { step: 'Check: T1=3(2)⁰=3×1=3 ✓. T2=3(2)¹=3×2=6 ✓.', justification: 'Verify before trusting the formula.' },
        { step: 'T8 = 3(2)⁷ = 3×128 = 384.', justification: 'Substitute n=8 and evaluate the power carefully.' },
      ], answer: 'Tn = 3(2)^(n-1); T8 = 384' },
      { id: 'wx-negative-ratio', prompt: 'Find the first 4 terms of a geometric sequence with a=5, r=-2.', steps: [
        { step: 'T1 = 5. T2 = 5×(-2) = -10. T3 = -10×(-2) = 20. T4 = 20×(-2) = -40.', justification: 'Multiply by r each step, tracking the sign carefully.' },
      ], answer: '5, -10, 20, -40 — signs alternate' },
    ],
    knowledgeChecks: [
      { question: 'For a=4, r=5, find T4 using Tn=ar^(n-1).', options: ['500', '2500', '80', '625'], correctIndex: 0, explanation: 'T4 = 4×5³ = 4×125 = 500.', misconceptionId: 'exponent-law-error-in-geometric' },
      { question: 'For a=6, r=-3, is T3 positive or negative?', options: ['Positive', 'Negative', 'Zero', 'Cannot be determined'], correctIndex: 0, explanation: 'T3 = 6×(-3)² = 6×9 = 54 — a negative ratio squared (even power) is positive.', misconceptionId: 'negative-ratio-sign-pattern-missed' },
    ],
    confidenceCheckPrompt: 'How confident do you feel deriving and applying the geometric general term formula, including with negative ratios?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'find-common-ratio', revealSteps: 1, prompt: 'Find the common ratio of 7, 21, 63, 189.', steps: [
        { step: 'r = 21/7 = 3. Check: 63/21=3, 189/63=3.', justification: 'Verify constancy.' },
      ], answer: 'r = 3' },
      { id: 'fp-partial-1', objectiveId: 'derive-geometric-general-term', revealSteps: 1, prompt: 'Derive the general term of 2, 10, 50, 250.', steps: [
        { step: 'a=2, r=5.', justification: 'Identify first term and ratio.' },
        { step: 'Tn = 2(5)^(n-1). Check: T1=2✓, T2=10✓.', justification: 'Substitute and verify.' },
      ], answer: 'Tn = 2(5)^(n-1)' },
      { id: 'fp-independent-1', objectiveId: 'find-geometric-specific-term', revealSteps: 0, prompt: 'Using Tn = 2(5)^(n-1) (from above), find T6.', steps: [
        { step: 'T6 = 2(5)⁵ = 2×3125 = 6250.', justification: 'Substitute n=6.' },
      ], answer: 'T6 = 6250' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'recognise-geometric-sequence', question: 'Is 1, 4, 16, 64 arithmetic, geometric, or neither?', options: ['Geometric, r=4', 'Arithmetic, d=3', 'Neither', 'Both'], correctIndex: 0, hints: { strategic: 'Check differences first, then ratios.', procedural: 'Differences 3,12,48 — not constant. Ratios 4,4,4 — constant.', workedStep: 'Geometric, r=4.' }, distractorMisconceptions: { 1: 'ratio-vs-difference-confused' } },
      { id: 'ip-2', objectiveId: 'find-common-ratio', question: 'Find the common ratio of 8, 4, 2, 1.', options: ['0.5', '4', '-4', '2'], correctIndex: 0, hints: { strategic: 'r = T2/T1.', procedural: '4/8', workedStep: '= 0.5.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'derive-geometric-general-term', question: 'Derive the general term of 9, 27, 81, 243.', options: ['Tn = 9(3)^(n-1)', 'Tn = 9(3)^n', 'Tn = 3(9)^(n-1)', 'Tn = 27n'], correctIndex: 0, hints: { strategic: 'a=9, r=3. Use Tn=ar^(n-1).', procedural: 'Test: T1=9(3)⁰=9✓, T2=9(3)¹=27✓.', workedStep: 'Tn = 9(3)^(n-1).' }, distractorMisconceptions: { 1: 'geometric-off-by-one' } },
      { id: 'ip-4', objectiveId: 'find-geometric-specific-term', question: 'For a=3, r=-2, find T5.', options: ['48', '-48', '96', '-96'], correctIndex: 0, hints: { strategic: 'T5 = 3×(-2)⁴.', procedural: '(-2)⁴=16 (even power, positive result).', workedStep: '3×16=48.' }, distractorMisconceptions: { 1: 'negative-ratio-sign-pattern-missed' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'recognise-geometric-sequence', multiSelect: false, question: 'True or false: 5, 10, 20, 40 is a geometric sequence.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — ratio is constant at 2 (differences are 5,10,20, not constant).', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'find-common-ratio', multiSelect: false, question: 'Find the common ratio of 6, 18, 54, 162.', options: ['3', '12', '6', '-3'], correctIndices: [0], explanation: '18/6=3.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'find-common-ratio', multiSelect: false, question: 'Find the common ratio of 200, 100, 50, 25.', options: ['0.5', '-100', '100', '2'], correctIndices: [0], explanation: '100/200=0.5.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'derive-geometric-general-term', multiSelect: false, question: 'Derive the general term of 4, 12, 36, 108.', options: ['Tn = 4(3)^(n-1)', 'Tn = 4(3)^n', 'Tn = 3(4)^(n-1)', 'Tn = 12n'], correctIndices: [0], explanation: 'a=4, r=3. Correct form: ar^(n-1).', distractorMisconceptions: { 1: 'geometric-off-by-one' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'find-geometric-specific-term', multiSelect: false, question: 'For Tn = 5(2)^(n-1), find T5.', options: ['80', '160', '40', '50'], correctIndices: [0], explanation: '5×2⁴=5×16=80.', distractorMisconceptions: { 1: 'exponent-law-error-in-geometric' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'find-geometric-specific-term', multiSelect: false, question: 'For a=2, r=-3, find T4.', options: ['-54', '54', '-24', '24'], correctIndices: [0], explanation: 'T4=2×(-3)³=2×(-27)=-54 (odd power, negative result).', distractorMisconceptions: { 1: 'negative-ratio-sign-pattern-missed' } },
    { id: 'q7', type: 'true-false', objectiveId: 'find-geometric-specific-term', multiSelect: false, question: 'True or false: for a negative common ratio, EVEN-position terms (T2, T4...) will be negative if a is positive.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — an odd number of sign-flips (from an even power minus... actually check: T2 uses r¹, odd power of negative r, giving negative) — for a=positive, r=negative: T2 is negative, T4 is negative (odd powers of r).', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'recognise-geometric-sequence', multiSelect: true, question: 'Which of these are geometric sequences? (select all that apply)', options: ['3, 9, 27, 81', '10, 7, 4, 1', '2, 6, 18, 54', '5, 10, 15, 20'], correctIndices: [0, 2], explanation: '3,9,27,81 has r=3. 2,6,18,54 has r=3. The other two are arithmetic (constant difference), not geometric.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'derive-geometric-general-term',
      analogy: 'Think of Tn = ar^(n-1) like compound interest: each step multiplies by r, and the exponent counts how many multiplications have happened so far — zero multiplications to reach the 1st term, one to reach the 2nd, and so on.',
      explanation: 'After finding a and r, write Tn = ar^(n-1), then test it: substitute n=1 (should give a) and n=2 (should give a×r). If either check fails, recheck your a or r.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Derive and test the general term of 4, 20, 100, 500.', steps: [
          { step: 'a=4, r=5.', justification: 'Identify first term and common ratio.' },
          { step: 'Tn = 4(5)^(n-1).', justification: 'Substitute into the formula.' },
          { step: 'Test: T1=4(5)⁰=4×1=4✓. T2=4(5)¹=4×5=20✓.', justification: 'Verify against known terms.' },
        ], answer: 'Tn = 4(5)^(n-1), verified correct' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'derive-geometric-general-term', question: 'Derive the general term of 6, 18, 54, 162.', options: ['Tn = 6(3)^(n-1)', 'Tn = 6(3)^n', 'Tn = 3(6)^(n-1)', 'Tn = 18n'], correctIndex: 0, hints: { strategic: 'a=6, r=3. Test against T1 and T2.', procedural: 'Tn=6(3)^(n-1): T1=6✓, T2=18✓.', workedStep: 'Tn = 6(3)^(n-1).' }, distractorMisconceptions: { 1: 'geometric-off-by-one' } },
        { id: 'rem-p2', objectiveId: 'derive-geometric-general-term', question: 'Derive the general term of 100, 20, 4, 0.8.', options: ['Tn = 100(0.2)^(n-1)', 'Tn = 100(0.2)^n', 'Tn = 0.2(100)^(n-1)', 'Tn = 20n'], correctIndex: 0, hints: { strategic: 'a=100, r=0.2. Test.', procedural: 'Tn=100(0.2)^(n-1): T1=100✓, T2=20✓.', workedStep: 'Tn = 100(0.2)^(n-1).' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'derive-geometric-general-term', question: 'Derive the general term of 2, -6, 18, -54.', options: ['Tn = 2(-3)^(n-1)', 'Tn = 2(-3)^n', 'Tn = -3(2)^(n-1)', 'Tn = -6n'], correctIndex: 0, hints: { strategic: 'a=2, r=-3. Test.', procedural: 'Tn=2(-3)^(n-1): T1=2✓, T2=2(-3)=-6✓.', workedStep: 'Tn = 2(-3)^(n-1).' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the key difference between arithmetic and geometric sequences?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with geometric sequences now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you check first when trying to identify a sequence type?', type: 'multiple-choice', options: ['Whether the difference is constant (arithmetic)', 'Whether the ratio is constant (geometric)', 'Both, in order', 'Neither — I\'ll guess'] },
  ],
};
