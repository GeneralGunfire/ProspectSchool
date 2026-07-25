// ── Term 3, Topic 5: Simple and Compound Interest ─────────────────────────────
// First financial mathematics topic. Per
// .planning/research/LIBRARY_ALGEBRA_TERM3_4_RESEARCH.md, uses an explicit
// "identify P, i, n first" scaffold distinct from Term 1's general
// word-problem translation approach.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'percentage-not-converted-to-decimal',
    label: 'Using a percentage rate directly in a formula without converting to a decimal',
    errorType: 'You substituted a rate like "8%" as 8 into the formula, instead of converting it to 0.08.',
    principle: 'Interest rates given as percentages MUST be converted to decimals before use in a formula: divide by 100. "8% per year" means i = 0.08, not i = 8.',
    correctStep: '8% becomes i = 8/100 = 0.08 before substituting into I = Prn or A = P(1+i)ⁿ.',
  },
  {
    id: 'simple-compound-formula-confused',
    label: 'Using the compound interest formula for a simple interest problem, or vice versa',
    errorType: 'You applied the wrong formula for the type of interest described.',
    principle: 'Simple interest: I = P×i×n, growing by the SAME amount each period (linear growth). Compound interest: A = P(1+i)ⁿ, growing by a percentage of the CURRENT (growing) balance each period (exponential growth). Check which type the problem describes before choosing a formula.',
    correctStep: 'A "fixed R500 per year" scenario is simple interest; a "grows by 8% of the current balance" scenario is compound interest.',
  },
  {
    id: 'total-vs-interest-confused',
    label: 'Confusing the total amount (A) with just the interest earned (I)',
    errorType: 'You reported the interest amount when asked for the total, or vice versa.',
    principle: 'The INTEREST (I) is only the extra amount earned. The TOTAL AMOUNT (A) is the original principal PLUS the interest: A = P + I.',
    correctStep: 'If P=1000 and I=80, then A = 1000+80 = 1080 — A and I are different quantities, easily confused.',
  },
  {
    id: 'compounding-period-mismatch',
    label: 'Not matching the interest rate and the time period to the same compounding frequency',
    errorType: 'You used an annual rate with a monthly time period (or vice versa) without converting.',
    principle: 'The rate and the number of periods (n) must use the SAME time unit. If interest compounds monthly, convert the annual rate to a monthly rate (divide by 12) AND count n in months, not years.',
    correctStep: 'For 12% per year compounded monthly over 2 years: monthly rate = 0.12/12 = 0.01, and n = 2×12 = 24 months.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 3,
  topicId: 'simple-compound-interest',
  topicName: 'Simple and Compound Interest',
  prerequisites: [
    'Percentages and converting between percentages and decimals',
    'Substituting into formulas (Term 1)',
  ],
  objectives: [
    { id: 'apply-simple-interest', text: 'Calculate simple interest and the total amount using I = Prn.' },
    { id: 'apply-compound-interest', text: 'Calculate compound interest and the total amount using A = P(1+i)ⁿ.' },
    { id: 'distinguish-interest-types', text: 'Determine which interest formula applies to a given scenario.' },
    { id: 'compare-growth', text: 'Compare simple and compound interest growth over time for the same principal and rate.' },
  ],
  estimatedMinutes: [20, 30],
};

export const simpleCompoundInterest: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Why does money in a bank grow faster the longer you leave it?',
  goalSettingPrompt:
    'A deposit that grows by the same fixed amount each year behaves very differently from one that grows by a percentage of an ever-increasing balance. By the end of this lesson you\'ll be able to calculate both, and know when to use which.',

  activate: {
    connectPrompt: 'You already know how to work with percentages and substitute into formulas — that\'s exactly what interest calculations need.',
    diagnosticQuestions: [
      { question: 'Convert 12% to a decimal.', options: ['0.12', '12', '1.2', '0.012'], correctIndex: 0, explanation: '12% = 12/100 = 0.12.' },
      { question: 'If P=2000 and rate=0.05, find P × rate.', options: ['100', '10000', '1000', '0.1'], correctIndex: 0, explanation: '2000 × 0.05 = 100.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'For every financial problem, first identify three things: P (the principal, the starting amount), i (the interest rate, as a DECIMAL — convert any percentage by dividing by 100), and n (the number of time periods). SIMPLE INTEREST grows by the SAME fixed amount every period: I = P × i × n, and the total amount A = P + I. This is linear growth — the interest earned each year never changes.',
    workedExamples: [
      { id: 'wx-simple-interest', prompt: 'R5000 is invested at 6% simple interest per year for 4 years. Find the interest and total amount.', steps: [
        { step: 'Identify: P=5000, i=6/100=0.06, n=4.', justification: 'Always identify P, i, n first — converting the rate to a decimal.' },
        { step: 'I = P×i×n = 5000×0.06×4 = 1200.', justification: 'Apply the simple interest formula.' },
        { step: 'A = P+I = 5000+1200 = 6200.', justification: 'Total amount is principal plus interest.' },
      ], answer: 'Interest = R1200, Total = R6200' },
    ],
    knowledgeChecks: [
      { question: 'For a rate of 9%, what value of i should you use in a formula?', options: ['0.09', '9', '0.9', '90'], correctIndex: 0, explanation: '9% = 9/100 = 0.09.', misconceptionId: 'percentage-not-converted-to-decimal' },
      { question: 'If P=3000 and I=450, what is the total amount A?', options: ['3450', '450', '3000', '1350'], correctIndex: 0, explanation: 'A = P+I = 3000+450 = 3450.', misconceptionId: 'total-vs-interest-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying P, i, n and applying the simple interest formula?',
  },

  demonstrateChunk2: {
    explanation:
      'COMPOUND INTEREST grows by a percentage of the CURRENT (already-grown) balance each period, not the original principal — this produces exponential growth, and the amount earned increases every period. The formula is A = P(1+i)ⁿ, where the interest itself, I = A - P. Critically, the rate and n must use the SAME time unit — if interest compounds monthly, convert an annual rate by dividing by 12, and count n in months.',
    workedExamples: [
      { id: 'wx-compound-interest', prompt: 'R5000 is invested at 6% compound interest per year for 4 years. Find the total amount and interest earned.', steps: [
        { step: 'Identify: P=5000, i=0.06, n=4.', justification: 'Same first step as simple interest.' },
        { step: 'A = P(1+i)ⁿ = 5000(1.06)⁴ ≈ 5000×1.2625 ≈ 6312.38.', justification: 'Apply the compound interest formula.' },
        { step: 'I = A - P = 6312.38 - 5000 = 1312.38.', justification: 'Interest is the total minus the original principal.' },
      ], answer: 'Total ≈ R6312.38, Interest ≈ R1312.38' },
      { id: 'wx-compare-growth', prompt: 'Compare simple vs. compound interest on R5000 at 6% over 4 years (from the examples above).', steps: [
        { step: 'Simple interest total: R6200. Compound interest total: R6312.38.', justification: 'Compare the two results directly.' },
        { step: 'Compound interest earns more, because each year\'s interest is calculated on a growing balance, not just the original R5000.', justification: 'This gap grows larger the longer the money is invested.' },
      ], answer: 'Compound interest earns R112.38 more over 4 years at this rate' },
    ],
    knowledgeChecks: [
      { question: 'A deposit earns 12% per year, compounded monthly, over 3 years. What should n and i be?', options: ['n=36, i=0.01', 'n=3, i=0.12', 'n=36, i=0.12', 'n=3, i=0.01'], correctIndex: 0, explanation: 'Monthly compounding: i=0.12/12=0.01, n=3×12=36 months.', misconceptionId: 'compounding-period-mismatch' },
      { question: 'A scenario says an investment "grows by 8% of the current balance each year." Which formula applies?', options: ['Compound interest (A=P(1+i)ⁿ)', 'Simple interest (I=Prn)', 'Neither applies', 'Both apply equally'], correctIndex: 0, explanation: '"Percentage of the current (growing) balance" is the defining feature of compound interest.', misconceptionId: 'simple-compound-formula-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying compound interest and comparing it to simple interest?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-simple-interest', revealSteps: 2, prompt: 'R8000 at 5% simple interest for 3 years. Find the total amount.', steps: [
        { step: 'I = 8000×0.05×3 = 1200.', justification: 'Apply the simple interest formula.' },
        { step: 'A = 8000+1200 = 9200.', justification: 'Add interest to principal.' },
      ], answer: 'A = R9200' },
      { id: 'fp-partial-1', objectiveId: 'apply-compound-interest', revealSteps: 1, prompt: 'R10000 at 7% compound interest for 2 years. Find the total amount.', steps: [
        { step: 'A = 10000(1.07)² = 10000×1.1449.', justification: 'Apply the compound interest formula.' },
        { step: 'A = 11449.', justification: 'Evaluate.' },
      ], answer: 'A = R11449' },
      { id: 'fp-independent-1', objectiveId: 'distinguish-interest-types', revealSteps: 0, prompt: 'A loan charges "a fixed R200 fee every year regardless of balance." Which interest type does this resemble, and why?', steps: [
        { step: 'A fixed amount every period, unrelated to a growing balance, matches simple interest\'s linear growth pattern.', justification: 'Check whether growth is linear (fixed) or based on a percentage of the current balance.' },
      ], answer: 'Simple interest — the amount added each period is fixed.' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'apply-simple-interest', question: 'R6000 at 4% simple interest for 5 years. Find the interest earned.', options: ['R1200', 'R1000', 'R6000', 'R240'], correctIndex: 0, hints: { strategic: 'I = Prn.', procedural: '6000×0.04×5', workedStep: '= 1200.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'apply-compound-interest', question: 'R4000 at 10% compound interest for 2 years. Find the total amount.', options: ['R4840', 'R4800', 'R4400', 'R5000'], correctIndex: 0, hints: { strategic: 'A = P(1+i)ⁿ.', procedural: '4000×(1.1)²', workedStep: '=4000×1.21=4840.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'distinguish-interest-types', question: 'A savings account "adds 3% of your CURRENT balance every year." Which formula applies?', options: ['Compound interest', 'Simple interest', 'Neither', 'Both equally'], correctIndex: 0, hints: { strategic: 'Percentage of the CURRENT (growing) balance is the compound signal.', procedural: 'This is compound interest.', workedStep: 'A = P(1+i)ⁿ.' }, distractorMisconceptions: { 1: 'simple-compound-formula-confused' } },
      { id: 'ip-4', objectiveId: 'compare-growth', question: 'For the same P, i, and n (n>1), which is always true?', options: ['Compound interest total ≥ simple interest total', 'Simple interest total is always higher', 'They are always exactly equal', 'Cannot be compared without more information'], correctIndex: 0, hints: { strategic: 'Compound interest grows on a growing balance — this compounds the advantage over time.', procedural: 'For n>1, compound interest total is greater than or equal to simple.', workedStep: 'Compound ≥ simple.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'apply-simple-interest', multiSelect: false, question: 'R3000 at 8% simple interest for 6 years. Find the interest.', options: ['R1440', 'R1800', 'R240', 'R3240'], correctIndices: [0], explanation: '3000×0.08×6=1440.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'apply-simple-interest', multiSelect: false, question: 'True or false: a rate of 15% should be substituted into a formula as 15.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — it must be converted to 0.15 first.', distractorMisconceptions: { 0: 'percentage-not-converted-to-decimal' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-compound-interest', multiSelect: false, question: 'R2000 at 5% compound interest for 3 years. Find the total amount.', options: ['R2315.25', 'R2300', 'R2100', 'R2500'], correctIndices: [0], explanation: '2000×(1.05)³ = 2000×1.157625 ≈ 2315.25.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'apply-compound-interest', multiSelect: false, question: 'R1000 at 12% per year, compounded monthly, for 1 year. What are the correct i and n?', options: ['i=0.01, n=12', 'i=0.12, n=1', 'i=0.01, n=1', 'i=0.12, n=12'], correctIndices: [0], explanation: 'Monthly compounding: i=0.12/12=0.01, n=12 months.', distractorMisconceptions: { 1: 'compounding-period-mismatch' } },
    { id: 'q5', type: 'true-false', objectiveId: 'distinguish-interest-types', multiSelect: false, question: 'True or false: "grows by the same fixed amount every year" describes compound interest.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a fixed amount every year is simple interest; compound interest grows by a percentage of the current balance.', distractorMisconceptions: { 0: 'simple-compound-formula-confused' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'distinguish-interest-types', multiSelect: false, question: 'For P=5000, I=750 (simple interest earned), what is the total amount A?', options: ['R5750', 'R750', 'R5000', 'R4250'], correctIndices: [0], explanation: 'A = P+I = 5000+750 = 5750.', distractorMisconceptions: { 1: 'total-vs-interest-confused' } },
    { id: 'q7', type: 'true-false', objectiveId: 'compare-growth', multiSelect: false, question: 'True or false: for the same P, i, and n>1, compound interest always earns at least as much as simple interest.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — compounding on a growing balance means it earns at least as much, and strictly more once n>1.', distractorMisconceptions: {} },
    { id: 'q8', type: 'decimal-discrimination', objectiveId: 'apply-simple-interest', multiSelect: false, question: 'R12000 at 3.5% simple interest for 2 years. Find the total amount.', options: ['R12840', 'R12420', 'R840', 'R13200'], correctIndices: [0], explanation: 'I=12000×0.035×2=840. A=12000+840=12840.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-compound-interest',
      analogy: 'Think of compound interest like a snowball rolling downhill: each year, the "snow" it picks up (interest) is based on how BIG the snowball has already become — not its original starting size. That\'s why it grows faster and faster over time.',
      explanation: 'Always identify P, i (as a decimal), and n first. Then apply A = P(1+i)ⁿ directly. If you need just the interest, subtract: I = A - P.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'R3000 at 4% compound interest for 3 years. Find the total and the interest.', steps: [
          { step: 'P=3000, i=0.04, n=3.', justification: 'Identify all three values, converting the rate.' },
          { step: 'A = 3000(1.04)³ = 3000×1.124864 ≈ 3374.59.', justification: 'Apply the formula.' },
          { step: 'I = 3374.59 - 3000 = 374.59.', justification: 'Interest is total minus principal.' },
        ], answer: 'Total ≈ R3374.59, Interest ≈ R374.59' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-compound-interest', question: 'R6000 at 5% compound interest for 2 years. Find the total.', options: ['R6615', 'R6600', 'R6300', 'R6900'], correctIndex: 0, hints: { strategic: 'A = P(1+i)ⁿ.', procedural: '6000×(1.05)²', workedStep: '=6000×1.1025=6615.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'apply-compound-interest', question: 'R2500 at 8% compound interest for 2 years. Find the interest earned.', options: ['R416', 'R400', 'R500', 'R450'], correctIndex: 0, hints: { strategic: 'Find A first, then subtract P.', procedural: 'A=2500×(1.08)²=2500×1.1664=2916.', workedStep: 'I=2916-2500=416.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'apply-compound-interest', question: 'R1500 at 6% compound interest for 3 years. Find the total.', options: ['R1786.55', 'R1770', 'R1800', 'R1590'], correctIndex: 0, hints: { strategic: 'A = P(1+i)ⁿ.', procedural: '1500×(1.06)³', workedStep: '=1500×1.191016≈1786.55.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the key difference between simple and compound interest, in your own words?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel calculating both types of interest now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the first thing you\'ll do when reading a new financial word problem?', type: 'multiple-choice', options: ['Identify P, i, and n', 'Guess which formula to use', 'Start calculating immediately', 'Skip to the answer choices'] },
  ],
};
