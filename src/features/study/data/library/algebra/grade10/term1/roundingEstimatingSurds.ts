// ── Topic 2: Rational and Irrational Numbers — Rounding & Estimating Surds ────
// Algebra, Grade 10, Term 1. Follows the same LessonContent shape as Topic 1
// (realNumberSystem.ts) and the depth bar set there. Content grounded in
// .planning/research/LIBRARY_ALGEBRA_TOPIC2_RESEARCH.md (human-run Perplexity
// pass against Siyavula Grade 10 Ch.1) — Perplexity supplied scope/sequencing/
// misconception/assessment-shape guidance only; all lesson text, examples and
// quiz items below were authored directly against that guidance, not generated
// by Perplexity.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'round-down-on-five',
    label: 'Rounding down when the next digit is 5',
    errorType: 'You rounded down even though the digit after your cut-off point is 5 or more.',
    principle: 'The rule is: look at the FIRST digit being dropped. If it is 5 or more, round the last kept digit UP by one. If it is less than 5, leave the last kept digit as it is.',
    correctStep: '2.6525 rounded to 3 decimal places → look at the 4th digit (5) → round up → 2.653.',
  },
  {
    id: 'truncation-not-rounding',
    label: 'Chopping off digits instead of rounding',
    errorType: 'You dropped the extra digits without checking whether the last kept digit should change.',
    principle: 'Rounding is not the same as deleting digits. You must check the first dropped digit and decide whether to round the last kept digit up or leave it — every time.',
    correctStep: '3.14159 to 4 decimal places: the 5th digit is 9, so round up → 3.1416, not 3.1415.',
  },
  {
    id: 'nine-carry-failure',
    label: 'Missing the carry-over when rounding a 9',
    errorType: 'You rounded up a digit that was 9 without carrying the 1 into the digit before it.',
    principle: 'When the digit to round up is 9, it becomes 0, and the 1 carries over into the next digit to the left — exactly like carrying in addition.',
    correctStep: '2.78974526 to 3 decimal places: the 3rd decimal digit is 9, rounds up → carries → 2.790 (not 2.789).',
  },
  {
    id: 'round-fraction-directly',
    label: 'Rounding a fraction without converting to a decimal first',
    errorType: 'You tried to round the numerator or denominator of a fraction directly.',
    principle: 'A fraction has to be written as a decimal FIRST, then rounded using the decimal-place rule. There is no rule for "rounding" a numerator or denominator on its own.',
    correctStep: '45/99 = 0.454545... → rounded to 2 decimal places → 0.45.',
  },
  {
    id: 'context-blind-rounding',
    label: 'Rounding without checking what the situation actually needs',
    errorType: 'You applied the rounding rule mechanically without checking whether the real-world context needs rounding up, down, or to a specific number of places.',
    principle: 'Context changes what "correct" rounding means: money is rounded to 2 decimal places; a count of people must be a whole number, and if the calculation implies you need MORE than a whole number of something, you often have to round UP regardless of the digit rule (e.g. buses needed for a trip).',
    correctStep: 'If 41.2 buses are needed to transport a group, you need 42 buses — you round up because you can\'t send 0.2 of a bus, even though 41.2 would mathematically round down to 41.',
  },
  {
    id: 'incomplete-answer-belief',
    label: 'Thinking "between two integers" isn\'t a finished answer',
    errorType: 'You tried to force an exact decimal value instead of leaving your answer as a range between two integers.',
    principle: 'A surd like √26 genuinely cannot be written exactly as a decimal — "5 < √26 < 6" IS the complete, correct answer when a question asks for consecutive integer bounds.',
    correctStep: '5 < √26 < 6 is a complete answer, not an unfinished one.',
  },
  {
    id: 'leading-digit-bounding',
    label: 'Bounding a surd from the radicand\'s leading digit',
    errorType: 'You picked the bounding integers by looking at the first digit of the number under the root, not by comparing it to perfect squares.',
    principle: 'To bound √a between consecutive integers, find the two perfect squares immediately below and above a — not just look at what a "looks like".',
    correctStep: '√26: 25 = 5² and 36 = 6², and 25 < 26 < 36, so 5 < √26 < 6.',
  },
  {
    id: 'halfway-heuristic',
    label: 'Assuming the root is exactly halfway between its bounding integers',
    errorType: 'You assumed the square root falls exactly halfway between its two bounding integers, based on the radicand looking roughly halfway between the perfect squares.',
    principle: 'Square roots don\'t grow in a straight line — a number that looks "halfway" between two perfect squares is usually NOT halfway between their roots. You have to check which perfect square the radicand is actually closer to.',
    correctStep: '√10: 10 is much closer to 9 (distance 1) than to 16 (distance 6), so √10 ≈ 3.2, not 3.5.',
  },
  {
    id: 'surd-equals-nearby-integer',
    label: 'Rounding a surd all the way to the nearest integer',
    errorType: 'You treated a surd as exactly equal to the perfect square closest to it.',
    principle: 'A non-perfect-square surd is never exactly equal to a whole number — it can be CLOSE to one, but it is genuinely irrational and needs a decimal estimate, not a whole-number answer.',
    correctStep: '√15 is close to 16 (= 4²) but √15 ≈ 3.9, not 4.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'rounding-estimating-surds',
  topicName: 'Rational & Irrational Numbers: Rounding and Estimating Surds',
  prerequisites: [
    'Classifying numbers into N, W, Z, Q, Q′, R (Topic 1: The Real Number System)',
    'Recognising terminating, recurring, and non-terminating non-recurring decimals',
    'Perfect squares up to 144 and simple perfect cubes (1, 8, 27, 64, 125)',
  ],
  objectives: [
    { id: 'round-decimals', text: 'Round rational and irrational numbers to a stated number of decimal places, including cases requiring a carry-over.' },
    { id: 'round-in-context', text: 'Choose an appropriate way to round in a real-world context (money, counts, multi-step calculations).' },
    { id: 'bound-surds', text: 'Bound a surd between two consecutive integers using perfect squares or cubes, without a calculator.' },
    { id: 'estimate-surds', text: 'Estimate a square root to about one decimal place by judging closeness to the nearest perfect square.' },
  ],
  estimatedMinutes: [20, 30],
};

export const roundingEstimatingSurds: LessonContent = {
  meta,
  colorScheme: {
    N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone',
  },
  openingHook: 'How close is close enough?',
  goalSettingPrompt:
    'A builder measuring a tile\'s diagonal gets an exact answer of √2 metres — a number that can never be written exactly as a decimal. But the tape measure only shows decimals. By the end of this lesson you\'ll be able to round any number sensibly, and estimate a surd\'s value without a calculator, so "exact but unusable" becomes "close enough to build with".',

  activate: {
    connectPrompt: 'You already know how to classify numbers as rational or irrational. Let\'s check that before we start estimating them.',
    diagnosticQuestions: [
      {
        question: 'Which of these is irrational?',
        options: ['√16', '0.75', '√7', '5/2'],
        correctIndex: 2,
        explanation: '16 is a perfect square (√16 = 4, rational). 0.75 and 5/2 are both exact fractions. 7 is not a perfect square, so √7 is irrational.',
      },
      {
        question: 'Round 4.567 to 2 decimal places.',
        options: ['4.56', '4.57', '4.60', '4.5'],
        correctIndex: 1,
        explanation: 'The 3rd decimal digit is 7 (≥5), so the 2nd decimal digit rounds up from 6 to 7 → 4.57.',
      },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Rounding off means writing a number with fewer decimal digits while keeping it as close as possible to the original value. The rule: look at the FIRST digit you are about to drop. If it\'s 5 or more, round the last digit you\'re keeping UP by one. If it\'s less than 5, leave it as it is. This works for rational numbers (fractions and decimals) AND irrational numbers like π and √3 — for a fraction, convert it to a decimal first, then round. Watch out for the case where the digit being rounded up is 9 — it becomes 0, and the 1 carries into the digit before it, just like in addition.',
    workedExamples: [
      {
        id: 'wx-round-basic',
        prompt: 'Round 3.14159265 (an approximation of π) to 4 decimal places.',
        steps: [
          { step: 'Identify the first 4 decimal digits: 1415, and the digit right after them: 9.', justification: 'You round based on the digit immediately after your cut-off point.' },
          { step: 'Since 9 ≥ 5, round the last kept digit (5) up by one, to 6.', justification: 'The "5 or more rounds up" rule applies to irrationals exactly like decimals.' },
        ],
        answer: '3.1416',
      },
      {
        id: 'wx-round-carry',
        prompt: 'Round 2.78974526 to 3 decimal places.',
        steps: [
          { step: 'The first 3 decimal digits are 789, and the next digit is 7.', justification: 'Locate the cut-off point and the digit right after it.' },
          { step: 'Since 7 ≥ 5, the last kept digit (9) rounds up. But 9 + 1 = 10, so it becomes 0 and carries 1 into the digit before it.', justification: 'This is the carry-over case — treat it exactly like carrying in column addition.' },
          { step: 'The 9 in the hundredths place becomes 0, and the 8 in the tenths place becomes 9.', justification: 'The carry moves left one digit at a time until it lands on a digit that doesn\'t roll over.' },
        ],
        answer: '2.790',
      },
      {
        id: 'wx-round-fraction',
        prompt: 'Round 45/99 to 2 decimal places.',
        steps: [
          { step: 'First convert to a decimal: 45 ÷ 99 = 0.454545...', justification: 'You cannot round a fraction directly — convert to decimal form first.' },
          { step: 'The first 2 decimal digits are 45, and the next digit is 4.', justification: 'Locate the cut-off point.' },
          { step: 'Since 4 < 5, leave the last kept digit as it is.', justification: 'The digit after the cut-off is less than 5, so no rounding up happens.' },
        ],
        answer: '0.45',
      },
    ],
    knowledgeChecks: [
      {
        question: 'Round 6.995 to 2 decimal places.',
        options: ['6.99', '7.00', '6.90', '6.995'],
        correctIndex: 1,
        explanation: 'The 3rd decimal digit is 5, so the 9 in the hundredths place rounds up. 9 + 1 = 10, carrying into the tenths place, which is also 9, carrying again into the units place: 6.995 → 7.00.',
        misconceptionId: 'nine-carry-failure',
      },
      {
        question: 'What is the FIRST step to round the fraction 7/8 to 1 decimal place?',
        options: ['Round the 7 up to 8', 'Round the 8 down to 5', 'Convert 7/8 to a decimal (0.875)', 'It cannot be rounded'],
        correctIndex: 2,
        explanation: 'Fractions must be converted to decimal form before applying the rounding rule. 7/8 = 0.875, which then rounds to 0.9.',
        misconceptionId: 'round-fraction-directly',
      },
    ],
    confidenceCheckPrompt: 'How confident do you feel rounding decimals and fractions correctly, including the tricky carry-over case?',
  },

  demonstrateChunk2: {
    explanation:
      'Now let\'s apply rounding to a real skill: estimating surds. A surd like √26 is irrational — it cannot be written exactly — but we can still say roughly where it sits. Step 1: find the two perfect squares closest to 26. Since 25 = 5² and 36 = 6², and 25 < 26 < 36, we know 5 < √26 < 6. That inequality IS a complete, correct answer on its own. Step 2 (for a finer estimate): judge how close 26 is to each perfect square. 26 is much closer to 25 than to 36, so √26 should be estimated close to 5, not halfway to 6 — roughly 5.1. Careful: square roots don\'t grow in a straight line, so "halfway between the perfect squares" does NOT mean "halfway between the roots".',
    workedExamples: [
      {
        id: 'wx-bound-consecutive',
        prompt: 'Between which two consecutive integers does √50 lie?',
        steps: [
          { step: 'Find perfect squares near 50: 49 = 7² and 64 = 8².', justification: 'Always compare to the nearest perfect squares below and above.' },
          { step: 'Since 49 < 50 < 64, it follows that 7 < √50 < 8.', justification: 'If a is between two perfect squares, √a is between their square roots.' },
        ],
        answer: '7 < √50 < 8',
      },
      {
        id: 'wx-estimate-decimal',
        prompt: 'Estimate √50 to about 1 decimal place.',
        steps: [
          { step: 'We already know 7 < √50 < 8, and 50 is very close to 49 (distance 1) compared to 64 (distance 14).', justification: 'Judge which perfect square the radicand is actually nearer to — this is not a straight-line halfway calculation.' },
          { step: 'Since 50 is barely above 49, √50 should be just barely above 7.', justification: 'The closer the radicand is to a perfect square, the closer the root is to that square\'s root.' },
        ],
        answer: '√50 ≈ 7.1',
      },
      {
        id: 'wx-cube-root',
        prompt: 'Between which two consecutive integers does ³√100 (cube root of 100) lie?',
        steps: [
          { step: 'Find perfect cubes near 100: 4³ = 64 and 5³ = 125.', justification: 'For cube roots, compare against perfect cubes instead of perfect squares.' },
          { step: 'Since 64 < 100 < 125, it follows that 4 < ³√100 < 5.', justification: 'Same bounding logic as square roots, just with cubes.' },
        ],
        answer: '4 < ³√100 < 5',
      },
    ],
    knowledgeChecks: [
      {
        question: 'Between which two consecutive integers does √26 lie?',
        options: ['4 and 5', '5 and 6', '2 and 3', '6 and 7'],
        correctIndex: 1,
        explanation: '25 = 5² and 36 = 6², and 25 < 26 < 36, so 5 < √26 < 6.',
        misconceptionId: 'leading-digit-bounding',
      },
      {
        question: 'Which is the better estimate for √10?',
        options: ['3.5 (halfway between 3 and 4)', '3.2 (closer to 9 than to 16)', '4.0', '3.0'],
        correctIndex: 1,
        explanation: '10 is much closer to 9 (= 3²) than to 16 (= 4²), so √10 should be estimated close to 3, not halfway to 4. √10 ≈ 3.16.',
        misconceptionId: 'halfway-heuristic',
      },
    ],
    confidenceCheckPrompt: 'How confident do you feel bounding and estimating surds without a calculator?',
  },

  apply: {
    fadingProblems: [
      {
        id: 'fp-full-1',
        objectiveId: 'round-decimals',
        revealSteps: 3,
        prompt: 'Round 8.0952 to 2 decimal places.',
        steps: [
          { step: 'The first 2 decimal digits are 09, and the next digit is 5.', justification: 'Locate the cut-off point and the digit right after it.' },
          { step: 'Since 5 ≥ 5, round the last kept digit (9) up. 9 + 1 = 10, so it becomes 0 and carries into the digit before it.', justification: 'This is another carry-over case.' },
          { step: 'The 0 in the tenths place becomes 1.', justification: 'The carry moves one place left.' },
        ],
        answer: '8.10',
      },
      {
        id: 'fp-partial-1',
        objectiveId: 'bound-surds',
        revealSteps: 1,
        prompt: 'Between which two consecutive integers does √70 lie, and which is it closer to?',
        steps: [
          { step: 'Find perfect squares near 70: 64 = 8² and 81 = 9².', justification: 'Compare to the nearest perfect squares below and above.' },
          { step: 'Since 64 < 70 < 81, 8 < √70 < 9.', justification: 'This gives the consecutive-integer bound.' },
          { step: '70 is closer to 64 (distance 6) than to 81 (distance 11), so √70 is closer to 8.', justification: 'Compare the two distances to judge which bound the root leans toward.' },
        ],
        answer: '8 < √70 < 9, closer to 8 (√70 ≈ 8.4)',
      },
      {
        id: 'fp-independent-1',
        objectiveId: 'estimate-surds',
        revealSteps: 0,
        prompt: 'Estimate √85 to about 1 decimal place, showing your bounding reasoning.',
        steps: [
          { step: 'Nearest perfect squares: 81 = 9², 100 = 10². Since 81 < 85 < 100, 9 < √85 < 10.', justification: 'Bound first using perfect squares.' },
          { step: '85 is much closer to 81 (distance 4) than to 100 (distance 15), so √85 is close to 9.', justification: 'Judge closeness, don\'t assume halfway.' },
        ],
        answer: '√85 ≈ 9.2',
      },
    ],
    independentPractice: [
      {
        id: 'ip-1',
        objectiveId: 'round-decimals',
        question: 'Round 5.99962 to 3 decimal places.',
        options: ['5.999', '6.000', '5.996', '6.999'],
        correctIndex: 1,
        hints: {
          strategic: 'Look at the 4th decimal digit — is it 5 or more?',
          procedural: 'The 4th digit is 6, so the 9 in the thousandths place rounds up. What happens when you add 1 to 9?',
          workedStep: '5.9996 → the thousandths 9 becomes 0 and carries, the hundredths 9 becomes 0 and carries, the tenths 9 becomes 0 and carries into the units digit: 5 becomes 6. Result: 6.000.',
        },
        distractorMisconceptions: { 0: 'nine-carry-failure', 2: 'truncation-not-rounding' },
      },
      {
        id: 'ip-2',
        objectiveId: 'round-in-context',
        question: 'A minibus seats 15 people. 47 people need transport. How many minibuses are needed?',
        options: ['3 (47 ÷ 15 = 3.13, rounds down)', '4 (you can\'t send 0.13 of a bus)', '3.13', '3.5'],
        correctIndex: 1,
        hints: {
          strategic: 'Does the normal "round down if less than 5" rule make sense here?',
          procedural: '47 ÷ 15 = 3.133... — mathematically that rounds to 3, but think about what happens to the leftover people.',
          workedStep: '3 minibuses only fit 45 people — 2 people would be left behind. You need a 4th minibus for them, so the context forces rounding UP regardless of the decimal digit.',
        },
        distractorMisconceptions: { 0: 'context-blind-rounding', 2: 'context-blind-rounding' },
      },
      {
        id: 'ip-3',
        objectiveId: 'bound-surds',
        question: 'Between which two consecutive integers does √120 lie?',
        options: ['10 and 11', '11 and 12', '9 and 10', '12 and 13'],
        correctIndex: 1,
        hints: {
          strategic: 'Which two perfect squares are just below and just above 120?',
          procedural: '10² = 100 and 11² = 121 — where does 120 fall relative to these?',
          workedStep: '100 < 120 < 121, so 10 < √120 < 11... but check again: 121 is just 1 more than 120, and 11² = 121, so actually 120 is between 100 and 121, giving 10 < √120 < 11.',
        },
        distractorMisconceptions: { 0: 'leading-digit-bounding' },
      },
      {
        id: 'ip-4',
        objectiveId: 'estimate-surds',
        question: 'Which is the best 1-decimal-place estimate for √39?',
        options: ['6.5 (halfway between 6 and 7)', '6.2 (closer to 36 than to 49)', '6.0', '7.0'],
        correctIndex: 1,
        hints: {
          strategic: 'Which two perfect squares bracket 39, and which is 39 nearer to?',
          procedural: '36 = 6², 49 = 7². 39 is only 3 away from 36, but 10 away from 49.',
          workedStep: 'Since 39 is much closer to 36, √39 should be estimated close to 6, not halfway to 7. √39 ≈ 6.2.',
        },
        distractorMisconceptions: { 0: 'halfway-heuristic', 2: 'surd-equals-nearby-integer' },
      },
    ],
  },

  misconceptions,

  quiz: [
    {
      id: 'q1', type: 'true-false', objectiveId: 'round-decimals', multiSelect: false,
      question: 'True or false: to round 7.2996 to 2 decimal places, you just delete everything after the 2nd decimal digit.',
      options: ['True', 'False'],
      correctIndices: [1],
      explanation: 'False — you must check the digit after the cut-off point and decide whether to round up. Deleting digits (truncating) is not the same as rounding: 7.2996 rounds to 7.30, not 7.29.',
      distractorMisconceptions: { 0: 'truncation-not-rounding' },
    },
    {
      id: 'q2', type: 'decimal-discrimination', objectiveId: 'round-decimals', multiSelect: false,
      question: 'Round 4.99850 to 3 decimal places.',
      options: ['4.998', '4.999', '5.000', '4.985'],
      correctIndices: [1],
      explanation: 'The 4th decimal digit is 5, so the 8 in the thousandths place rounds up to 9. No further carry is needed. Result: 4.999.',
      distractorMisconceptions: { 0: 'truncation-not-rounding' },
    },
    {
      id: 'q3', type: 'decimal-discrimination', objectiveId: 'round-decimals', multiSelect: false,
      question: 'Round the fraction 5/6 to 2 decimal places.',
      options: ['0.83', '0.56', '0.84', '5.60'],
      correctIndices: [0],
      explanation: '5/6 = 0.8333..., which rounds to 0.83 at 2 decimal places. You must convert to a decimal before rounding.',
      distractorMisconceptions: { 1: 'round-fraction-directly' },
    },
    {
      id: 'q4', type: 'multi-select', objectiveId: 'round-in-context', multiSelect: true,
      question: 'Which situations would normally require rounding UP, even if the decimal digit rule alone would round down? (select all that apply)',
      options: ['Number of buses needed to fit everyone', 'A bank balance in rands and cents', 'Number of boxes needed to pack all the stock', 'A temperature reading rounded to the nearest degree'],
      correctIndices: [0, 2],
      explanation: 'Buses and boxes are both "you can\'t use a fraction of one" situations — any leftover forces one more whole unit, regardless of the decimal digit. Money and temperature follow the normal rounding rule.',
      distractorMisconceptions: { 1: 'context-blind-rounding', 3: 'context-blind-rounding' },
    },
    {
      id: 'q5', type: 'subset-numberline', objectiveId: 'bound-surds', multiSelect: false,
      question: 'Between which two consecutive integers does √95 lie?',
      options: ['8 and 9', '9 and 10', '10 and 11', '7 and 8'],
      correctIndices: [1],
      explanation: '81 = 9² and 100 = 10², and 81 < 95 < 100, so 9 < √95 < 10.',
      distractorMisconceptions: { 0: 'leading-digit-bounding', 2: 'leading-digit-bounding' },
    },
    {
      id: 'q6', type: 'true-false', objectiveId: 'bound-surds', multiSelect: false,
      question: 'True or false: "6 < √41 < 7" is a complete, correct final answer if the question asks you to bound √41 between consecutive integers.',
      options: ['True', 'False'],
      correctIndices: [0],
      explanation: 'True — a consecutive-integer bound is a genuinely complete answer for that kind of question. √41 cannot be written exactly, so there is no "more finished" version to give.',
      distractorMisconceptions: { 1: 'incomplete-answer-belief' },
    },
    {
      id: 'q7', type: 'decimal-discrimination', objectiveId: 'estimate-surds', multiSelect: false,
      question: 'Which is the best 1-decimal-place estimate for √62?',
      options: ['7.5 (halfway between 7 and 8)', '7.9 (closer to 64 than to 49)', '7.0', '8.0'],
      correctIndices: [1],
      explanation: '49 = 7², 64 = 8². 62 is much closer to 64 (distance 2) than to 49 (distance 13), so √62 should be estimated close to 8 — about 7.9.',
      distractorMisconceptions: { 0: 'halfway-heuristic', 3: 'surd-equals-nearby-integer' },
    },
    {
      id: 'q8', type: 'subset-numberline', objectiveId: 'estimate-surds', multiSelect: false,
      question: 'Which of these numbers is closest to √30?',
      options: ['5', '5.5', '6', '4.5'],
      correctIndices: [1],
      explanation: '25 = 5², 36 = 6². 30 is roughly in the middle of the gap between 25 and 36 (distance 5 vs. 6), so √30 ≈ 5.5 is the best estimate here — unlike most surds, this one genuinely does sit close to halfway.',
      distractorMisconceptions: { 0: 'surd-equals-nearby-integer' },
    },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'round-decimals',
      analogy:
        'Think of rounding like a queue at a shop till: the digit right after your cut-off point "votes" on whether the last digit you\'re keeping gets bumped up. A vote of 5, 6, 7, 8, or 9 says "round up"; a vote of 0, 1, 2, 3, or 4 says "leave it". And just like carrying in addition, if bumping up turns a 9 into a 10, that extra 1 has to move one place to the left.',
      explanation:
        'Let\'s slow the rounding process down into two separate questions every time: (1) What is the digit immediately after my cut-off point? (2) Is it 5 or more? Only after answering both do you touch the last kept digit — and if that digit is a 9, remember the carry.',
      workedExamples: [
        {
          id: 'rem-wx-1',
          prompt: 'Round 12.3456 to 1 decimal place.',
          steps: [
            { step: 'The last kept digit (1st decimal place) is 3. The digit right after it is 4.', justification: 'Identify the cut-off digit and the "voting" digit.' },
            { step: '4 < 5, so leave the 3 as it is.', justification: 'A vote under 5 means no change.' },
          ],
          answer: '12.3',
        },
        {
          id: 'rem-wx-2',
          prompt: 'Round 0.999 to 2 decimal places.',
          steps: [
            { step: 'The last kept digit (2nd decimal place) is 9. The digit right after it is 9.', justification: 'Identify the cut-off digit and the voting digit.' },
            { step: '9 ≥ 5, so the 9 rounds up. 9 + 1 = 10, so it becomes 0 and carries into the tenths place.', justification: 'This is the carry case again.' },
            { step: 'The tenths digit (also 9) becomes 0 and carries again, into the units place: 0 becomes 1.', justification: 'A carry can cascade through multiple 9s in a row.' },
          ],
          answer: '1.00',
        },
      ],
      practice: [
        {
          id: 'rem-p1', objectiveId: 'round-decimals',
          question: 'Round 3.456 to 2 decimal places.',
          options: ['3.45', '3.46', '3.50', '3.4'],
          correctIndex: 1,
          hints: {
            strategic: 'What is the digit right after the 2nd decimal place?',
            procedural: 'It\'s 6, which is ≥5.',
            workedStep: 'Round the 5 up to 6: 3.456 → 3.46.',
          },
          distractorMisconceptions: { 0: 'truncation-not-rounding' },
        },
        {
          id: 'rem-p2', objectiveId: 'round-decimals',
          question: 'Round 9.995 to 2 decimal places.',
          options: ['9.99', '10.00', '9.95', '9.90'],
          correctIndex: 1,
          hints: {
            strategic: 'The voting digit is 5, so the last kept digit rounds up. What is that digit?',
            procedural: 'The last kept digit (2nd decimal place) is 9. What happens when 9 rounds up?',
            workedStep: '9 + 1 = 10, carries: hundredths 9→0 carry, tenths 9→0 carry, units 9→10 → 10.00.',
          },
          distractorMisconceptions: { 0: 'nine-carry-failure' },
        },
        {
          id: 'rem-p3', objectiveId: 'round-decimals',
          question: 'Round the fraction 2/3 to 2 decimal places.',
          options: ['0.66', '0.67', '0.60', '2.30'],
          correctIndex: 1,
          hints: {
            strategic: 'What is 2/3 as a decimal first?',
            procedural: '2 ÷ 3 = 0.6666...',
            workedStep: 'The 3rd decimal digit is 6 (≥5), so round the 2nd decimal digit up: 0.6666 → 0.67.',
          },
          distractorMisconceptions: { 3: 'round-fraction-directly' },
        },
        {
          id: 'rem-p4', objectiveId: 'round-decimals',
          question: 'A bag of rice costs R47.996. Rounded to the nearest cent, what do you pay?',
          options: ['R47.99', 'R48.00', 'R47.90', 'R47.996'],
          correctIndex: 1,
          hints: {
            strategic: 'Nearest cent means 2 decimal places. What is the 3rd decimal digit?',
            procedural: 'It\'s 6, which is ≥5, and the digit before it is 9.',
            workedStep: '47.996 → the hundredths 9 rounds up, carries: 47.996 → 48.00.',
          },
          distractorMisconceptions: { 0: 'nine-carry-failure' },
        },
      ],
      passThreshold: { correct: 3, total: 4 },
    },
    {
      objectiveId: 'estimate-surds',
      analogy:
        'Picture a number line with perfect squares marked as lampposts (1, 4, 9, 16, 25, 36...). A surd like √20 is standing somewhere between two lampposts, and it stands MUCH closer to whichever lamppost\'s light reaches it — not necessarily in the middle. Your job is to spot which lamppost is nearer, using the actual distance from 20 to each perfect square.',
      explanation:
        'For any surd √a: first find the two nearest perfect squares (below and above a) — this gives you the consecutive-integer bound. Then compare the two distances (a minus the lower square, and the upper square minus a) to judge which side √a leans toward, and estimate accordingly.',
      workedExamples: [
        {
          id: 'rem2-wx-1',
          prompt: 'Estimate √52 to about 1 decimal place.',
          steps: [
            { step: 'Nearest perfect squares: 49 = 7², 64 = 8². Since 49 < 52 < 64, 7 < √52 < 8.', justification: 'Bound first.' },
            { step: 'Distance from 52 to 49 is 3; distance from 52 to 64 is 12. 52 is much closer to 49.', justification: 'Compare the two distances.' },
            { step: 'So √52 should be estimated close to 7, not halfway to 8.', justification: 'Closer radicand-distance means closer root-distance.' },
          ],
          answer: '√52 ≈ 7.2',
        },
      ],
      practice: [
        {
          id: 'rem2-p1', objectiveId: 'estimate-surds',
          question: 'Which is the best estimate for √28?',
          options: ['5.3 (closer to 25 than to 36)', '5.5 (halfway between 5 and 6)', '6.0', '5.0'],
          correctIndex: 0,
          hints: {
            strategic: 'Which perfect squares bracket 28?',
            procedural: '25 = 5², 36 = 6². 28 is only 3 away from 25 but 8 away from 36.',
            workedStep: '28 is much closer to 25, so √28 should be close to 5. √28 ≈ 5.3.',
          },
          distractorMisconceptions: { 1: 'halfway-heuristic' },
        },
        {
          id: 'rem2-p2', objectiveId: 'estimate-surds',
          question: 'Between which two consecutive integers does √83 lie?',
          options: ['8 and 9', '9 and 10', '7 and 8', '10 and 11'],
          correctIndex: 1,
          hints: {
            strategic: 'Which perfect squares are just below and above 83?',
            procedural: '81 = 9², 100 = 10².',
            workedStep: '81 < 83 < 100, so 9 < √83 < 10.',
          },
          distractorMisconceptions: { 0: 'leading-digit-bounding' },
        },
      ],
      passThreshold: { correct: 2, total: 2 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which felt harder: rounding with the carry-over case, or estimating surds?', type: 'multiple-choice', options: ['Rounding (especially the carry-over case)', 'Estimating and bounding surds', 'Both about the same', 'Neither — this topic felt easy'] },
    { id: 'r2', prompt: 'How confident do you feel rounding numbers and estimating surds now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is one thing you\'ll double-check next time you estimate a surd?', type: 'free-text' },
  ],
};
