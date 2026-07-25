// ── Term 4, Topic 1: Arithmetic Sequences ─────────────────────────────────────
// Per .planning/research/LIBRARY_ALGEBRA_TERM3_4_RESEARCH.md's specific
// recommendation, worked examples always test the derived general-term
// formula against at least two known terms to prevent off-by-one errors.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'off-by-one-in-formula',
    label: 'Using Tn = a + nd instead of Tn = a + (n-1)d',
    errorType: 'You applied the general term formula without the crucial "-1" adjustment.',
    principle: 'The general term of an arithmetic sequence is Tn = a + (n-1)d, NOT a + nd — because the first term T1 already equals a, with zero "steps" of d applied yet.',
    correctStep: 'For a=5, d=3: T1 should be 5 (no steps applied). Using Tn=a+(n-1)d: T1=5+(0)(3)=5 ✓. Using the wrong Tn=a+nd: T1=5+(1)(3)=8 ✗.',
  },
  {
    id: 'common-difference-sign-error',
    label: 'Getting the sign of the common difference wrong for a decreasing sequence',
    errorType: 'You calculated the common difference with the wrong sign for a sequence that is decreasing.',
    principle: 'The common difference d = (any term) - (the term before it). If the sequence is decreasing, d will be NEGATIVE — don\'t force it to be positive.',
    correctStep: 'For 20, 15, 10, 5...: d = 15-20 = -5 (negative, since the sequence decreases).',
  },
  {
    id: 'not-testing-formula-against-terms',
    label: 'Not checking a derived formula against known terms',
    errorType: 'You wrote a general term formula without verifying it produces the correct values for n=1 and n=2.',
    principle: 'After deriving Tn, ALWAYS test it against at least two known terms (usually n=1 and n=2) — if it doesn\'t reproduce them correctly, there\'s an error in the formula.',
    correctStep: 'For Tn = 4+3(n-1): check n=1 gives 4 (matches T1), n=2 gives 7 (matches T2) — the formula is confirmed correct.',
  },
  {
    id: 'confuses-term-value-with-position',
    label: 'Confusing a term\'s VALUE with its POSITION (n) in the sequence',
    errorType: 'You mixed up the term\'s value with which position (1st, 2nd, 3rd...) it occupies.',
    principle: 'n is the POSITION in the sequence (1st, 2nd, 3rd...); Tn is the VALUE at that position. "Find T5" means "find the value of the 5th term," not "the answer is 5."',
    correctStep: 'For the sequence 3,7,11,15..., T3 = 11 (the value at position 3), not T3 = 3.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 4,
  topicId: 'arithmetic-sequences',
  topicName: 'Arithmetic Sequences',
  prerequisites: [
    'Solving linear equations (Term 1)',
    'Substituting into formulas',
  ],
  objectives: [
    { id: 'recognise-arithmetic-sequence', text: 'Recognise an arithmetic sequence by its constant common difference.' },
    { id: 'find-common-difference', text: 'Calculate the common difference of an arithmetic sequence.' },
    { id: 'derive-general-term', text: 'Derive and apply the general term formula Tn = a + (n-1)d.' },
    { id: 'find-specific-term', text: 'Find a specific term (e.g. the 20th term) of an arithmetic sequence.' },
  ],
  estimatedMinutes: [20, 30],
};

export const arithmeticSequences: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How do you predict the 100th number in a pattern without listing all 100?',
  goalSettingPrompt:
    'Some number patterns grow by the same fixed amount every step. Once you recognise this and find a general formula, you can jump straight to any term — the 5th, the 50th, even the 500th — without listing every one in between.',

  activate: {
    connectPrompt: 'You already know how to substitute values into a formula and solve simple equations.',
    diagnosticQuestions: [
      { question: 'If Tn = 2n + 3, find T4.', options: ['11', '9', '7', '8'], correctIndex: 0, explanation: 'T4 = 2(4)+3 = 11.' },
      { question: 'What is 4 + (3-1)×5?', options: ['14', '19', '9', '24'], correctIndex: 0, explanation: '4 + (2)(5) = 4+10 = 14.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'An ARITHMETIC SEQUENCE increases (or decreases) by the same fixed amount every step — this fixed amount is the COMMON DIFFERENCE (d), found by subtracting any term from the one after it: d = T(n) - T(n-1). If the sequence decreases, d is negative — don\'t force it to be positive. Always double-check d is genuinely constant across the whole sequence, not just between the first two terms.',
    workedExamples: [
      { id: 'wx-common-difference', prompt: 'Find the common difference of 4, 9, 14, 19, 24.', steps: [
        { step: 'd = 9-4 = 5. Check: 14-9=5, 19-14=5, 24-19=5.', justification: 'Verify the difference is constant throughout, not just the first pair.' },
      ], answer: 'd = 5' },
      { id: 'wx-decreasing-sequence', prompt: 'Find the common difference of 30, 24, 18, 12.', steps: [
        { step: 'd = 24-30 = -6. Check: 18-24=-6, 12-18=-6.', justification: 'The sequence decreases, so d is negative — this is expected, not an error.' },
      ], answer: 'd = -6' },
    ],
    knowledgeChecks: [
      { question: 'Find the common difference of 7, 11, 15, 19.', options: ['4', '-4', '11', '7'], correctIndex: 0, explanation: 'd = 11-7 = 4.', misconceptionId: 'common-difference-sign-error' },
      { question: 'Find the common difference of 50, 42, 34, 26.', options: ['-8', '8', '50', '42'], correctIndex: 0, explanation: 'd = 42-50 = -8, negative since decreasing.', misconceptionId: 'common-difference-sign-error' },
    ],
    confidenceCheckPrompt: 'How confident do you feel finding the common difference of an arithmetic sequence?',
  },

  demonstrateChunk2: {
    explanation:
      'The GENERAL TERM formula for an arithmetic sequence is Tn = a + (n-1)d, where a is the first term and d is the common difference. The "(n-1)" is crucial: T1 has zero "steps" of d applied (since it IS the first term), T2 has one step applied, and so on. After deriving a formula, ALWAYS test it against at least two known terms (n=1 and n=2) to catch off-by-one errors before trusting it for larger n.',
    workedExamples: [
      { id: 'wx-general-term', prompt: 'Find the general term of 6, 10, 14, 18, ... and use it to find T15.', steps: [
        { step: 'a=6, d=4 (since 10-6=4).', justification: 'Identify the first term and common difference.' },
        { step: 'Tn = a+(n-1)d = 6+(n-1)(4).', justification: 'Substitute into the general term formula.' },
        { step: 'Check: T1 = 6+(0)(4)=6 ✓. T2 = 6+(1)(4)=10 ✓.', justification: 'Always test the formula against known terms before trusting it.' },
        { step: 'T15 = 6+(14)(4) = 6+56 = 62.', justification: 'Substitute n=15 into the verified formula.' },
      ], answer: 'Tn = 6+4(n-1); T15 = 62' },
    ],
    knowledgeChecks: [
      { question: 'For a sequence with a=3, d=5, which is the correct general term?', options: ['Tn = 3+5(n-1)', 'Tn = 3+5n', 'Tn = 5+3(n-1)', 'Tn = 3n+5'], correctIndex: 0, explanation: 'The correct form is a+(n-1)d — never a+nd.', misconceptionId: 'off-by-one-in-formula' },
      { question: 'For the sequence 2, 5, 8, 11..., what does T4 refer to?', options: ['The value at position 4, which is 11', 'The number 4 itself', 'The 4th common difference', 'Position 11'], correctIndex: 0, explanation: 'T4 is the VALUE at position 4, i.e. 11 — not the number 4.', misconceptionId: 'confuses-term-value-with-position' },
    ],
    confidenceCheckPrompt: 'How confident do you feel deriving and testing a general term formula?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'find-common-difference', revealSteps: 1, prompt: 'Find the common difference of 12, 19, 26, 33.', steps: [
        { step: 'd = 19-12 = 7. Check: 26-19=7, 33-26=7.', justification: 'Confirm constancy.' },
      ], answer: 'd = 7' },
      { id: 'fp-partial-1', objectiveId: 'derive-general-term', revealSteps: 1, prompt: 'Derive the general term of 8, 13, 18, 23, ...', steps: [
        { step: 'a=8, d=5.', justification: 'Identify first term and common difference.' },
        { step: 'Tn = 8+(n-1)(5). Check: T1=8✓, T2=13✓.', justification: 'Substitute and verify.' },
      ], answer: 'Tn = 8+5(n-1)' },
      { id: 'fp-independent-1', objectiveId: 'find-specific-term', revealSteps: 0, prompt: 'Using Tn = 8+5(n-1) (from above), find T20.', steps: [
        { step: 'T20 = 8+5(19) = 8+95 = 103.', justification: 'Substitute n=20.' },
      ], answer: 'T20 = 103' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'recognise-arithmetic-sequence', question: 'Is 5, 8, 11, 14 an arithmetic sequence?', options: ['Yes, common difference is 3', 'No', 'Yes, common difference is 5', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'Check if the difference is constant.', procedural: '8-5=3, 11-8=3, 14-11=3.', workedStep: 'Yes, constant difference of 3.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'find-common-difference', question: 'Find the common difference of 100, 88, 76, 64.', options: ['-12', '12', '100', '88'], correctIndex: 0, hints: { strategic: 'd = T2-T1.', procedural: '88-100', workedStep: '= -12.' }, distractorMisconceptions: { 1: 'common-difference-sign-error' } },
      { id: 'ip-3', objectiveId: 'derive-general-term', question: 'Derive the general term of 10, 17, 24, 31.', options: ['Tn = 10+7(n-1)', 'Tn = 10+7n', 'Tn = 7+10(n-1)', 'Tn = 10n+7'], correctIndex: 0, hints: { strategic: 'a=10, d=7. Use Tn=a+(n-1)d.', procedural: 'Test: T1=10+0=10✓, T2=10+7=17✓.', workedStep: 'Tn = 10+7(n-1).' }, distractorMisconceptions: { 1: 'off-by-one-in-formula' } },
      { id: 'ip-4', objectiveId: 'find-specific-term', question: 'For Tn = 3+6(n-1), find T12.', options: ['69', '75', '63', '72'], correctIndex: 0, hints: { strategic: 'Substitute n=12.', procedural: '3+6(11)', workedStep: '=3+66=69.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'find-common-difference', multiSelect: false, question: 'Find the common difference of 15, 22, 29, 36.', options: ['7', '-7', '15', '22'], correctIndices: [0], explanation: '22-15=7.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'find-common-difference', multiSelect: false, question: 'Find the common difference of 80, 65, 50, 35.', options: ['-15', '15', '80', '65'], correctIndices: [0], explanation: '65-80=-15.', distractorMisconceptions: { 1: 'common-difference-sign-error' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'derive-general-term', multiSelect: false, question: 'Derive the general term of 4, 9, 14, 19.', options: ['Tn = 4+5(n-1)', 'Tn = 4+5n', 'Tn = 5+4(n-1)', 'Tn = 4n+5'], correctIndices: [0], explanation: 'a=4, d=5. Correct form: a+(n-1)d.', distractorMisconceptions: { 1: 'off-by-one-in-formula' } },
    { id: 'q4', type: 'true-false', objectiveId: 'derive-general-term', multiSelect: false, question: 'True or false: for Tn = 6+3(n-1), T1 should equal 6.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — T1 = 6+3(0) = 6.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'find-specific-term', multiSelect: false, question: 'For Tn = 2+4(n-1), find T10.', options: ['38', '42', '36', '40'], correctIndices: [0], explanation: '2+4(9)=2+36=38.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'find-specific-term', multiSelect: false, question: 'A sequence has a=20, d=-3. Find T8.', options: ['-1', '41', '17', '3'], correctIndices: [0], explanation: '20+(-3)(7)=20-21=-1.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'find-specific-term', multiSelect: false, question: 'True or false: "T3" means "the value 3" in a sequence.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — T3 means "the value AT position 3", which could be any number.', distractorMisconceptions: { 0: 'confuses-term-value-with-position' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'recognise-arithmetic-sequence', multiSelect: true, question: 'Which of these are arithmetic sequences? (select all that apply)', options: ['2, 6, 10, 14', '3, 6, 12, 24', '50, 45, 40, 35', '1, 4, 9, 16'], correctIndices: [0, 2], explanation: '2,6,10,14 has d=4 constant. 50,45,40,35 has d=-5 constant. The other two have changing differences (not arithmetic).', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'derive-general-term',
      analogy: 'Think of Tn = a+(n-1)d like counting how many "steps" of size d you\'ve taken from the starting point a. To reach the 1st term, you\'ve taken ZERO steps (you\'re already there); to reach the 5th term, you\'ve taken 4 steps — always one fewer step than the position number.',
      explanation: 'After finding a and d, ALWAYS write Tn = a+(n-1)d, then immediately test it: substitute n=1 (should give a) and n=2 (should give a+d). If either check fails, recheck your a or d.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Derive and test the general term of 15, 21, 27, 33.', steps: [
          { step: 'a=15, d=6.', justification: 'Identify first term and common difference.' },
          { step: 'Tn = 15+6(n-1).', justification: 'Substitute into the formula.' },
          { step: 'Test: T1=15+6(0)=15✓. T2=15+6(1)=21✓.', justification: 'Verify against known terms.' },
        ], answer: 'Tn = 15+6(n-1), verified correct' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'derive-general-term', question: 'Derive the general term of 7, 12, 17, 22.', options: ['Tn = 7+5(n-1)', 'Tn = 7+5n', 'Tn = 5+7(n-1)', 'Tn = 12n'], correctIndex: 0, hints: { strategic: 'a=7, d=5. Test your formula against T1 and T2.', procedural: 'Tn=7+5(n-1): T1=7✓, T2=12✓.', workedStep: 'Tn = 7+5(n-1).' }, distractorMisconceptions: { 1: 'off-by-one-in-formula' } },
        { id: 'rem-p2', objectiveId: 'derive-general-term', question: 'Derive the general term of 40, 33, 26, 19.', options: ['Tn = 40-7(n-1)', 'Tn = 40-7n', 'Tn = -7+40(n-1)', 'Tn = 33n'], correctIndex: 0, hints: { strategic: 'a=40, d=-7. Test against T1 and T2.', procedural: 'Tn=40+(-7)(n-1): T1=40✓, T2=33✓.', workedStep: 'Tn = 40-7(n-1).' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'derive-general-term', question: 'Derive the general term of 9, 16, 23, 30.', options: ['Tn = 9+7(n-1)', 'Tn = 9+7n', 'Tn = 7+9(n-1)', 'Tn = 16n'], correctIndex: 0, hints: { strategic: 'a=9, d=7. Test your formula.', procedural: 'Tn=9+7(n-1): T1=9✓, T2=16✓.', workedStep: 'Tn = 9+7(n-1).' }, distractorMisconceptions: { 1: 'off-by-one-in-formula' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is it important to test your formula against T1 and T2 before trusting it?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel finding and testing general term formulas now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the most common mistake you\'ll watch out for when writing Tn?', type: 'multiple-choice', options: ['Forgetting the "-1" in (n-1)', 'Getting the sign of d wrong', 'Confusing a term\'s value with its position', 'All of the above'] },
  ],
};
