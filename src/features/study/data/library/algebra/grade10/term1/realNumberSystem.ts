// ── Topic 1: The Real Number System — Algebra, Grade 10, Term 1 ───────────────
// Reference implementation for the rebuilt Study Library. Follows
// .planning/research/LIBRARY_TEACHING_EXECUTION_PLAN.md Parts B and D exactly.
//
// Convention chosen for this lesson (Part D misconception 4 — genuinely
// disputed across SA textbooks, must be stated explicitly, not assumed):
// Natural numbers N = {1, 2, 3, ...} (counting numbers, does NOT include 0).
// Whole numbers W = {0, 1, 2, 3, ...} (adds 0 to N). This lesson states this
// convention explicitly to students rather than assuming they already agree.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'all-roots-irrational',
    label: 'All square roots are irrational',
    errorType: 'You treated this square root as irrational without checking whether it’s a perfect square.',
    principle: 'Some square roots simplify to whole numbers — √16 = 4, √25 = 5. A square root is only irrational if the number under the root is NOT a perfect square.',
    correctStep: '√16 = 4, and 4 is a natural number, whole number, integer, AND rational number.',
  },
  {
    id: 'not-integer-means-irrational',
    label: 'Not an integer = irrational',
    errorType: 'You assumed that because this number isn’t an integer, it must be irrational.',
    principle: 'Non-integer numbers like ¾ or 0.2 are still rational — they can be written exactly as a fraction of two integers. "Not an integer" and "irrational" are different ideas.',
    correctStep: '0.2 = 1/5, so 0.2 is rational (a non-integer rational number).',
  },
  {
    id: 'decimals-not-rational',
    label: 'Decimals are "something else", not rational',
    errorType: 'You treated this decimal as a separate category from fractions.',
    principle: 'Every terminating or recurring decimal IS a fraction written a different way. 0.75 and 3/4 are the exact same number — decimals and fractions aren’t different categories.',
    correctStep: '0.75 = 3/4, so 0.75 is rational.',
  },
  {
    id: 'zero-convention',
    label: 'Is 0 natural or whole?',
    errorType: 'You classified 0 without using this lesson’s stated convention.',
    principle: 'Textbooks disagree on this. This lesson uses: Natural numbers (N) start at 1 (counting numbers). Whole numbers (W) start at 0. So 0 is whole, but not natural.',
    correctStep: '0 ∈ W, 0 ∉ N (using this lesson’s convention).',
  },
  {
    id: 'negatives-not-real',
    label: 'Negative numbers aren’t "real"',
    errorType: 'You excluded a negative number from the real numbers.',
    principle: '"Real" doesn’t mean positive or physical — it’s the name for the full number line, including negatives. Every negative number is real (and often rational or integer too).',
    correctStep: '-5 ∈ Z, ∈ Q, ∈ R — negative numbers belong to R just like positive ones.',
  },
  {
    id: 'long-decimal-irrational',
    label: 'Long decimal = irrational',
    errorType: 'You assumed a long decimal must be irrational without checking if it recurs.',
    principle: 'A decimal is only irrational if it goes on forever WITHOUT repeating. A long decimal that eventually repeats (like 0.6666...) is still rational.',
    correctStep: '0.6̄ (0.666...) = 2/3, which is rational — it repeats forever, it just doesn’t terminate.',
  },
  {
    id: 'weak-perfect-squares',
    label: 'Doesn’t recognise perfect squares beyond the obvious ones',
    errorType: 'You didn’t recognise that this number under the root is a perfect square.',
    principle: 'Perfect squares to know by sight at this level: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144. If a number under a root isn’t on this list, it’s worth double-checking before calling it irrational.',
    correctStep: '√144 = 12 (since 12 × 12 = 144), so it’s rational.',
  },
  {
    id: 'only-integer-or-surd',
    label: 'Every real number is an integer or a surd',
    errorType: 'You treated integers and surds as the only two options for real numbers.',
    principle: 'Plain fractions and non-surd decimals (like ¾ or 0.2) are real numbers too, and they’re neither integers nor surds — they’re ordinary rational numbers.',
    correctStep: '¾ is real, rational, but not an integer and not a surd.',
  },
  {
    id: 'symbol-confusion',
    label: 'Mixing up the set symbols',
    errorType: 'You mixed up which letter stands for which number set.',
    principle: 'The symbols are just labels, not descriptions — R doesn’t mean "rational" (it means Real, the whole number line). Q means rational (from "quotient"). Learn them as: N (Natural), W (Whole), Z (Integers), Q (rational), Q′ (irrational), R (Real, all of them combined).',
    correctStep: 'R = the set of ALL real numbers (rational and irrational together), not just rational ones.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'real-number-system',
  topicName: 'The Real Number System',
  prerequisites: [
    'Comparing and ordering whole numbers and integers',
    'Simple fractions and their decimal equivalents',
    'Basic surd simplification from Grade 9 (e.g. √16 = 4)',
  ],
  objectives: [
    { id: 'classify-numbers', text: 'Define and give examples of natural numbers, whole numbers, integers, rational numbers, irrational numbers, and real numbers.' },
    { id: 'classify-given-number', text: 'Classify a given number into the correct set(s).' },
    { id: 'number-line', text: 'Represent different number types using number-line placement.' },
    { id: 'rational-irrational-decimal', text: 'Explain the decimal-form distinction between rational (terminating/recurring) and irrational (non-terminating, non-recurring) numbers.' },
  ],
  estimatedMinutes: [20, 30],
};

export const realNumberSystem: LessonContent = {
  meta,
  colorScheme: {
    N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone',
  },
  openingHook: 'What can be written exactly?',
  goalSettingPrompt:
    'Some quantities can be written exactly — half a pizza is exactly 1/2. Others, like the diagonal of a square, never can be — any decimal you write is an approximation. By the end of this lesson you’ll be able to tell, for any number, whether it can be written exactly or not — and classify it correctly.',

  activate: {
    connectPrompt: 'You’ve worked with numbers like these before. Let’s see what you remember.',
    diagnosticQuestions: [
      {
        question: 'Which of these is an integer?',
        options: ['3/4', '-7', '0.333...', '√2'],
        correctIndex: 1,
        explanation: '-7 is a whole number (positive or negative) with no fractional part — that’s exactly what an integer is.',
      },
      {
        question: 'What is 3/4 written as a decimal?',
        options: ['0.75', '0.34', '3.4', '0.43'],
        correctIndex: 0,
        explanation: '3 ÷ 4 = 0.75. This decimal terminates (stops) after two digits.',
      },
      {
        question: 'What does the symbol R stand for in the number sets we’re about to study?',
        options: ['Rational numbers', 'Real numbers — the whole number line, rational and irrational together', 'Repeating decimals', 'Root numbers'],
        correctIndex: 1,
        explanation: 'R stands for Real numbers — every number on the number line, both rational and irrational. It’s easy to confuse R with "rational" since they sound alike, but Q is the symbol for rational.',
        misconceptionId: 'symbol-confusion',
      },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Let’s start with numbers you already know well. Natural numbers (N) are counting numbers: 1, 2, 3... In this lesson, N does NOT include 0. Whole numbers (W) add 0 to that list: 0, 1, 2, 3... Integers (Z) extend further to include negatives: ...-2, -1, 0, 1, 2... Each set is bigger than the last — every natural number is also whole, and every whole number is also an integer. We’ll come back to that relationship properly at the end of the lesson.',
    workedExamples: [
      {
        id: 'wx-classify-basic',
        prompt: 'Classify -3 into the number sets we’ve covered so far (N, W, Z).',
        steps: [
          { step: 'Is -3 a counting number (1, 2, 3...)? No.', justification: 'Natural numbers are positive counting numbers only, starting at 1.' },
          { step: 'Is -3 a whole number (0, 1, 2, 3...)? No.', justification: 'Whole numbers start at 0 and go up — no negatives.' },
          { step: 'Is -3 an integer (...-2, -1, 0, 1, 2...)? Yes.', justification: 'Integers include all whole numbers and their negatives.' },
        ],
        answer: '-3 ∈ Z only (not N, not W)',
      },
      {
        id: 'wx-classify-zero',
        prompt: 'Classify 0 using this lesson’s convention.',
        steps: [
          { step: 'Is 0 a counting number? No — counting starts at 1.', justification: 'This lesson defines N = {1, 2, 3, ...}.' },
          { step: 'Is 0 a whole number? Yes.', justification: 'This lesson defines W = {0, 1, 2, 3, ...} — 0 is included here.' },
        ],
        answer: '0 ∈ W, 0 ∉ N',
      },
    ],
    knowledgeChecks: [
      {
        question: 'Using this lesson’s convention, which set does 0 belong to?',
        options: ['N only', 'W only', 'Both N and W', 'Neither'],
        correctIndex: 1,
        explanation: 'This lesson uses N = {1, 2, 3, ...} (no zero) and W = {0, 1, 2, 3, ...}. So 0 is whole but not natural.',
        misconceptionId: 'zero-convention',
      },
      {
        question: 'Is -12 a real number?',
        options: ['Yes', 'No — negative numbers aren’t real', 'Only if it’s written as +12', 'Can’t tell'],
        correctIndex: 0,
        explanation: '"Real" includes the entire number line — positive, negative, and zero. -12 is real (and also an integer and rational).',
        misconceptionId: 'negatives-not-real',
      },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying numbers into N, W, and Z so far?',
  },

  demonstrateChunk2: {
    explanation:
      'Now the central idea of this lesson: rational vs. irrational. A rational number (Q) can be written EXACTLY as a fraction a/b, where a and b are integers and b ≠ 0. This includes all integers (5 = 5/1), all terminating decimals (0.75 = 3/4), and all recurring decimals (0.3̄ = 1/3). An irrational number (Q′) can NEVER be written exactly as a fraction — its decimal goes on forever without ever settling into a repeating pattern. √2, √3, and π are irrational. Careful: √9 = 3 and √16 = 4 are perfect squares, so they’re actually rational, not irrational — this trips a lot of people up.',
    workedExamples: [
      {
        id: 'wx-rational-fraction-decimal',
        prompt: 'Show that 0.6̄ (0.666... recurring) is rational.',
        steps: [
          { step: 'Let x = 0.666...', justification: 'Start by naming the repeating decimal.' },
          { step: '10x = 6.666...', justification: 'Multiply both sides by 10 to shift the decimal point.' },
          { step: '10x - x = 6.666... - 0.666... = 6, so 9x = 6', justification: 'Subtracting cancels the repeating part.' },
          { step: 'x = 6/9 = 2/3', justification: 'Divide both sides by 9 and simplify — this is an exact fraction, so x is rational.' },
        ],
        answer: '0.6̄ = 2/3, which is rational',
      },
      {
        id: 'wx-irrational-surd',
        prompt: 'Is √5 rational or irrational?',
        steps: [
          { step: 'Is 5 a perfect square? Check: 2×2=4, 3×3=9 — 5 is not on this list.', justification: 'A surd is rational only if the number under the root is a perfect square.' },
          { step: '√5 ≈ 2.236067977... and this decimal never terminates or repeats.', justification: 'Non-perfect-square surds always produce a non-terminating, non-recurring decimal — this lesson asks you to accept this fact rather than prove it.' },
        ],
        answer: '√5 is irrational',
      },
      {
        id: 'wx-perfect-square-check',
        prompt: 'Is √25 rational or irrational?',
        steps: [
          { step: 'Is 25 a perfect square? Yes — 5 × 5 = 25.', justification: 'Always check for a perfect square before assuming a surd is irrational.' },
          { step: '√25 = 5, an exact whole number.', justification: 'Perfect-square surds simplify to integers, which are rational.' },
        ],
        answer: '√25 = 5, which is rational',
      },
      {
        id: 'wx-nested-capstone',
        prompt:
          'Capstone: now that you understand rational vs. irrational, here is how ALL the sets fit together. Where does 7 sit in the full hierarchy N ⊂ W ⊂ Z ⊂ Q ⊂ R?',
        steps: [
          { step: 'Is 7 a counting number? Yes, so 7 ∈ N.', justification: 'N is the smallest, most specific set.' },
          { step: 'Every natural number is also whole, so 7 ∈ W too.', justification: 'N ⊂ W — the nested-subset relationship: N sits entirely inside W.' },
          { step: 'Every whole number is also an integer, so 7 ∈ Z too.', justification: 'W ⊂ Z — whole numbers sit entirely inside the integers.' },
          { step: 'Every integer is also rational (7 = 7/1), so 7 ∈ Q too.', justification: 'Z ⊂ Q — integers are a special case of rational numbers.' },
          { step: 'Every rational number is real, so 7 ∈ R too.', justification: 'Q ⊂ R, and Q′ ⊂ R — rational and irrational numbers together make up all of R.' },
        ],
        answer: '7 belongs to N, W, Z, Q, AND R all at once — the sets are nested inside each other, not separate boxes.',
      },
    ],
    knowledgeChecks: [
      {
        question: 'Which of these is irrational?',
        options: ['√16', '0.6̄', '√9', '√2'],
        correctIndex: 3,
        explanation: '√16 = 4 and √9 = 3 are perfect squares (rational). 0.6̄ is a recurring decimal (rational). √2 is not a perfect square and its decimal never terminates or repeats — irrational.',
        misconceptionId: 'all-roots-irrational',
      },
      {
        question: 'Is 0.2 rational or irrational?',
        options: ['Rational — it’s not an integer, but it can be written as 1/5', 'Irrational — it’s not a whole number', 'Can’t say without more digits', 'Irrational — it has a decimal point'],
        correctIndex: 0,
        explanation: '0.2 = 1/5 exactly. Being a non-integer doesn’t make a number irrational — the test is whether it can be written as an exact fraction.',
        misconceptionId: 'not-integer-means-irrational',
      },
      {
        question: 'A decimal expansion goes on for 40 digits without any visible pattern yet. What can you conclude?',
        options: ['It must be irrational', 'It must be rational', 'Not enough information — it might still start repeating later', 'All long decimals are irrational'],
        correctIndex: 2,
        explanation: 'A long decimal isn’t automatically irrational — some rational numbers have long repeating blocks (e.g. 1/7 = 0.142857142857...). Only a decimal that NEVER repeats, no matter how far you go, is irrational.',
        misconceptionId: 'long-decimal-irrational',
      },
      {
        question: 'True or false: every real number is either an integer or a surd (like √2).',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False — plain fractions and non-surd decimals, like 3/4 or 0.2, are real numbers too. They’re neither integers nor surds, just ordinary rational numbers.',
        misconceptionId: 'only-integer-or-surd',
      },
      {
        question: 'Using the nested-subset relationship (N ⊂ W ⊂ Z ⊂ Q ⊂ R), if a number is a natural number, what else must be true about it?',
        options: ['Nothing else can be assumed', 'It is also whole, an integer, rational, and real', 'It is also irrational', 'It cannot be rational'],
        correctIndex: 1,
        explanation: 'Because N sits entirely inside W, which sits inside Z, which sits inside Q, which sits inside R, any natural number automatically belongs to every one of those larger sets too.',
      },
    ],
    confidenceCheckPrompt: 'How confident do you feel telling rational and irrational numbers apart?',
  },

  apply: {
    fadingProblems: [
      {
        id: 'fp-full-1',
        objectiveId: 'rational-irrational-decimal',
        revealSteps: 3,
        prompt: 'Classify 0.125 as rational or irrational.',
        steps: [
          { step: 'Check if the decimal terminates: 0.125 stops after 3 digits.', justification: 'Terminating decimals are always rational.' },
          { step: 'Write it as a fraction: 0.125 = 125/1000 = 1/8.', justification: 'Every terminating decimal can be written exactly as a fraction.' },
          { step: 'Conclusion: 0.125 is rational.', justification: 'It can be written exactly as a/b with integers a, b.' },
        ],
        answer: '0.125 is rational (= 1/8)',
      },
      {
        id: 'fp-partial-1',
        objectiveId: 'classify-given-number',
        revealSteps: 1,
        prompt: 'Classify √36 into all the number sets it belongs to.',
        steps: [
          { step: 'Check if 36 is a perfect square: 6 × 6 = 36, yes.', justification: 'Always check for a perfect square first with any surd.' },
          { step: 'So √36 = 6.', justification: 'Simplify the surd.' },
          { step: '6 is a natural number, whole number, integer, and rational number — so √36 ∈ N, W, Z, Q, R.', justification: 'A number can belong to several sets at once — check each one.' },
        ],
        answer: '√36 = 6 ∈ N, W, Z, Q, R',
      },
      {
        id: 'fp-independent-1',
        objectiveId: 'rational-irrational-decimal',
        revealSteps: 0,
        prompt: 'Classify √3 as rational or irrational, and explain why in one sentence.',
        steps: [
          { step: 'Check if 3 is a perfect square — it is not.', justification: 'No integer multiplied by itself gives 3.' },
          { step: '√3 ≈ 1.7320508... and never terminates or repeats.', justification: 'Non-perfect-square surds are irrational (accepted as fact at this level).' },
        ],
        answer: '√3 is irrational — 3 is not a perfect square',
      },
    ],
    independentPractice: [
      {
        id: 'ip-1',
        objectiveId: 'classify-given-number',
        question: 'Which of these numbers is rational?',
        options: ['√7', 'π', '0.4̄ (0.444...)', '√11'],
        correctIndex: 2,
        hints: {
          strategic: 'Which of these four numbers can you write as an exact fraction?',
          procedural: 'Check each: is the number under any square root a perfect square? Does any decimal terminate or repeat?',
          workedStep: '0.4̄ repeats forever as 4s — that’s the signature of a recurring (rational) decimal, unlike √7 or √11 which aren’t perfect squares.',
        },
        distractorMisconceptions: { 0: 'weak-perfect-squares', 1: 'long-decimal-irrational', 3: 'weak-perfect-squares' },
      },
      {
        id: 'ip-2',
        objectiveId: 'rational-irrational-decimal',
        question: 'True or false: every decimal that doesn’t terminate is irrational.',
        options: ['True', 'False'],
        correctIndex: 1,
        hints: {
          strategic: 'Think about a fraction like 1/3 — what does its decimal look like?',
          procedural: '1/3 = 0.333... — does this decimal terminate?',
          workedStep: '1/3 = 0.3̄, which never terminates, but it IS rational because it repeats forever in a fixed pattern. Non-terminating alone isn’t enough — it must also NOT repeat.',
        },
        distractorMisconceptions: { 0: 'long-decimal-irrational' },
      },
      {
        id: 'ip-3',
        objectiveId: 'classify-numbers',
        question: 'Which number is real but NOT rational?',
        options: ['-4', '5/9', '√10', '0'],
        correctIndex: 2,
        hints: {
          strategic: 'Three of these four numbers can be written as exact fractions. Which one can’t?',
          procedural: 'Check if 10 is a perfect square.',
          workedStep: '10 is not a perfect square (3×3=9, 4×4=16), so √10 cannot be written as an exact fraction — it’s irrational, but still real.',
        },
        distractorMisconceptions: { 0: 'negatives-not-real', 1: 'decimals-not-rational', 3: 'zero-convention' },
      },
      {
        id: 'ip-4',
        objectiveId: 'number-line',
        question: 'On a number line, where would √2 (≈1.41) be placed?',
        options: ['Exactly on 1', 'Exactly on 2', 'Between 1 and 2', 'It cannot be placed on a number line'],
        correctIndex: 2,
        hints: {
          strategic: 'What is √2 approximately equal to as a decimal?',
          procedural: '√2 ≈ 1.41 — which two whole numbers does this fall between?',
          workedStep: 'Since 1.41 is between 1 and 2, √2 sits between those two points — irrational numbers still have an exact position on the real number line, even though we can’t write their decimal exactly.',
        },
        distractorMisconceptions: { 3: 'only-integer-or-surd' },
      },
    ],
  },

  misconceptions,

  quiz: [
    {
      id: 'q1', type: 'multi-select', objectiveId: 'classify-given-number', multiSelect: true,
      question: 'Which sets does the number 9 belong to? (select all that apply)',
      options: ['N', 'W', 'Z', 'Q', 'Q′ (irrational)'],
      correctIndices: [0, 1, 2, 3],
      explanation: '9 is a natural number, whole number, integer, and rational number (9 = 9/1). It is NOT irrational.',
    },
    {
      id: 'q2', type: 'multi-select', objectiveId: 'classify-given-number', multiSelect: true,
      question: 'Which sets does √20 belong to? (select all that apply)',
      options: ['Z', 'Q', 'Q′ (irrational)', 'R'],
      correctIndices: [2, 3],
      explanation: '20 is not a perfect square, so √20 is irrational. It is real (Q′ ⊂ R) but not an integer or rational.',
      distractorMisconceptions: { 0: 'only-integer-or-surd', 1: 'weak-perfect-squares' },
    },
    {
      id: 'q3', type: 'true-false', objectiveId: 'classify-numbers', multiSelect: false,
      question: 'True or false: every integer is a rational number.',
      options: ['True', 'False'],
      correctIndices: [0],
      explanation: 'True — any integer n can be written as n/1, which fits the definition of rational exactly.',
    },
    {
      id: 'q4', type: 'true-false', objectiveId: 'rational-irrational-decimal', multiSelect: false,
      question: 'True or false: if a decimal doesn’t terminate, it must be irrational.',
      options: ['True', 'False'],
      correctIndices: [1],
      explanation: 'False — a decimal that doesn’t terminate but DOES repeat (like 0.3̄) is still rational. Only non-terminating AND non-recurring decimals are irrational.',
      distractorMisconceptions: { 0: 'long-decimal-irrational' },
    },
    {
      id: 'q5', type: 'true-false', objectiveId: 'classify-numbers', multiSelect: false,
      question: 'True or false: using this lesson’s convention, 0 is a natural number.',
      options: ['True', 'False'],
      correctIndices: [1],
      explanation: 'False, under this lesson’s stated convention — N = {1, 2, 3, ...} does not include 0. (0 IS a whole number, W = {0, 1, 2, 3, ...}.)',
      distractorMisconceptions: { 0: 'zero-convention' },
    },
    {
      id: 'q6', type: 'decimal-discrimination', objectiveId: 'rational-irrational-decimal', multiSelect: true,
      question: 'Which of these decimal expansions are irrational? (select all that apply)',
      options: ['0.25 (terminates)', '0.454545... (repeats "45")', '2.3891057... (confirmed non-repeating)', '0.1̄ (repeats "1")'],
      correctIndices: [2],
      explanation: 'Only the third option is irrational — it is confirmed non-terminating AND non-repeating. The others terminate or recur, so they are rational.',
      distractorMisconceptions: { 1: 'long-decimal-irrational', 3: 'long-decimal-irrational' },
    },
    {
      id: 'q7', type: 'decimal-discrimination', objectiveId: 'rational-irrational-decimal', multiSelect: false,
      question: 'Which of these is the odd one out (the only irrational number)?',
      options: ['√49', '√50', '√64', '√81'],
      correctIndices: [1],
      explanation: '49, 64, and 81 are all perfect squares (7², 8², 9²). 50 is not a perfect square, so √50 is the only irrational one.',
      distractorMisconceptions: { 0: 'all-roots-irrational', 2: 'weak-perfect-squares', 3: 'weak-perfect-squares' },
    },
    {
      id: 'q8', type: 'subset-numberline', objectiveId: 'number-line', multiSelect: false,
      question: 'Which statement about the real number system is correct?',
      options: [
        'Every rational number is also a real number',
        'Every real number is either an integer or a surd',
        'R stands for "rational", not "real"',
        'There is no number between 1 and 2 on the number line',
      ],
      correctIndices: [0],
      explanation: 'Real numbers (R) are the union of all rational and irrational numbers — so every rational number is automatically real. The other options are common misconceptions this lesson addressed directly.',
      distractorMisconceptions: { 1: 'only-integer-or-surd', 2: 'symbol-confusion', 3: 'only-integer-or-surd' },
    },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'rational-irrational-decimal',
      analogy:
        'Think of a family tree of numbers, not a checklist. Imagine every real number is either "exact" (you can write its precise address as a fraction — rational) or "wild" (its decimal wanders forever without ever settling into a pattern — irrational). It’s a two-branch fork, not a spectrum: every real number falls into exactly one branch.',
      explanation:
        'Let’s slow down and use a different check for each number: can I write it as EXACTLY one whole number divided by another whole number? If yes — even if it takes a repeating decimal to show it — it’s rational. If the decimal genuinely never repeats, no matter how far you calculate, it’s irrational. We’ll practice this "can I write it exactly?" question on several numbers.',
      workedExamples: [
        {
          id: 'rem-wx-1',
          prompt: 'Sort these into rational or irrational: 0.9̄, √8, 7/2.',
          steps: [
            { step: '0.9̄ repeats forever as 9s — can be written as 1 (a whole number, so also a fraction 1/1).', justification: 'Recurring decimals are always rational, even ones that look unusual.' },
            { step: '√8: is 8 a perfect square? No (2×2=4, 3×3=9). So √8 is irrational.', justification: 'Non-perfect-square surds are irrational.' },
            { step: '7/2 is already written as an exact fraction of two integers.', justification: 'Any number already in a/b form, with a, b integers, is rational by definition.' },
          ],
          answer: '0.9̄ rational, √8 irrational, 7/2 rational',
        },
        {
          id: 'rem-wx-2',
          prompt: 'Sort these: √49, 0.101001000100001... (pattern of increasing zeros, never repeats exactly), 5.5.',
          steps: [
            { step: '√49 = 7 (49 is a perfect square) — rational.', justification: 'Perfect square surds simplify to integers.' },
            { step: '0.101001000100001... — the gaps of zeros keep growing, so this decimal never settles into a fixed repeating block. Irrational.', justification: 'A changing, non-repeating pattern is still non-recurring — the digits must repeat in an identical fixed block to count as "recurring".' },
            { step: '5.5 = 11/2 — terminates, so rational.', justification: 'Terminating decimals are always rational.' },
          ],
          answer: '√49 rational, the growing-zeros decimal irrational, 5.5 rational',
        },
      ],
      practice: [
        {
          id: 'rem-p1',
          objectiveId: 'rational-irrational-decimal',
          question: 'Is 0.7̄ (0.777...) rational or irrational?',
          options: ['Rational', 'Irrational'],
          correctIndex: 0,
          hints: {
            strategic: 'Does this decimal repeat in a fixed, predictable block?',
            procedural: 'Yes — it repeats "7" forever. Try converting it to a fraction like we did with 0.6̄ earlier.',
            workedStep: '0.7̄ = 7/9 — an exact fraction, so it is rational.',
          },
          distractorMisconceptions: { 1: 'long-decimal-irrational' },
        },
        {
          id: 'rem-p2',
          objectiveId: 'rational-irrational-decimal',
          question: 'Is √12 rational or irrational?',
          options: ['Rational', 'Irrational'],
          correctIndex: 1,
          hints: {
            strategic: 'Is 12 a perfect square?',
            procedural: 'Check: 3×3=9, 4×4=16. 12 falls between these — not a perfect square.',
            workedStep: 'Since 12 is not a perfect square, √12 cannot be written as an exact fraction — it is irrational.',
          },
          distractorMisconceptions: { 0: 'weak-perfect-squares' },
        },
        {
          id: 'rem-p3',
          objectiveId: 'rational-irrational-decimal',
          question: 'Is 5/8 rational or irrational?',
          options: ['Rational', 'Irrational'],
          correctIndex: 0,
          hints: {
            strategic: 'Is this number already written as a fraction of two integers?',
            procedural: 'Yes — 5 and 8 are both integers, and 8 ≠ 0.',
            workedStep: 'Any a/b with integers a, b (b ≠ 0) is rational by definition — no further checking needed.',
          },
          distractorMisconceptions: { 1: 'decimals-not-rational' },
        },
        {
          id: 'rem-p4',
          objectiveId: 'rational-irrational-decimal',
          question: 'Is √100 rational or irrational?',
          options: ['Rational', 'Irrational'],
          correctIndex: 0,
          hints: {
            strategic: 'Is 100 a perfect square?',
            procedural: 'Yes — 10 × 10 = 100.',
            workedStep: '√100 = 10, a whole number, so it is rational.',
          },
          distractorMisconceptions: { 1: 'all-roots-irrational' },
        },
        {
          id: 'rem-p5',
          objectiveId: 'rational-irrational-decimal',
          question: 'Is π (3.14159265...) rational or irrational?',
          options: ['Rational', 'Irrational'],
          correctIndex: 1,
          hints: {
            strategic: 'Does π’s decimal ever settle into a repeating pattern?',
            procedural: 'No — mathematicians have calculated trillions of digits and no repeating pattern has ever appeared.',
            workedStep: 'π is a famous example of an irrational number — non-terminating and non-repeating.',
          },
          distractorMisconceptions: { 0: 'decimals-not-rational' },
        },
      ],
      passThreshold: { correct: 4, total: 5 },
    },
    {
      objectiveId: 'classify-given-number',
      analogy:
        'Picture the number sets as nested Russian dolls: R is the biggest doll, containing Q and Q′ side by side inside it. Inside Q sits Z, inside Z sits W, and inside W sits N — each smaller doll is entirely contained within the one before it. To classify a number, find the SMALLEST doll it fits inside, and it automatically belongs to every bigger doll around it too.',
      explanation:
        'When classifying a number, work from the inside out: first check if it’s a counting number (N), then whether it’s 0 or positive (W), then whether it could be negative (Z), then whether it can be written as any exact fraction (Q), and if none of those fit, it’s irrational (Q′). Every number is real (R) regardless.',
      workedExamples: [
        {
          id: 'rem2-wx-1',
          prompt: 'Classify -8 using the nested-doll approach.',
          steps: [
            { step: 'Counting number (N)? No — negative.', justification: 'N only contains positive counting numbers.' },
            { step: 'Whole number (W)? No — negative.', justification: 'W only contains 0 and positive counting numbers.' },
            { step: 'Integer (Z)? Yes.', justification: 'Z includes negatives.' },
            { step: 'Since -8 ∈ Z, it is automatically also in Q and R (bigger dolls).', justification: 'Every integer is rational, and every rational number is real.' },
          ],
          answer: '-8 ∈ Z, Q, R (not N, not W)',
        },
      ],
      practice: [
        {
          id: 'rem2-p1',
          objectiveId: 'classify-given-number',
          question: 'Which sets does 3/4 belong to?',
          options: ['N, W, Z only', 'Q and R only', 'Z, Q, and R', 'Q′ and R only'],
          correctIndex: 1,
          hints: {
            strategic: 'Is 3/4 a whole number or does it have a fractional part?',
            procedural: 'It has a fractional part, so it can’t be N, W, or Z — but it IS an exact fraction.',
            workedStep: '3/4 is rational (Q) and, since all rational numbers are real, also R.',
          },
          distractorMisconceptions: { 0: 'only-integer-or-surd', 2: 'only-integer-or-surd', 3: 'not-integer-means-irrational' },
        },
        {
          id: 'rem2-p2',
          objectiveId: 'classify-given-number',
          question: 'Which sets does √2 belong to?',
          options: ['Q and R only', 'Q′ and R only', 'Z, Q, and R', 'N, W, Z, Q, and R'],
          correctIndex: 1,
          hints: {
            strategic: 'Is 2 a perfect square?',
            procedural: 'No — so √2 cannot be written as an exact fraction.',
            workedStep: '√2 is irrational (Q′), and since all irrational numbers are real, also R — but nothing else.',
          },
          distractorMisconceptions: { 0: 'all-roots-irrational', 3: 'all-roots-irrational' },
        },
      ],
      passThreshold: { correct: 2, total: 2 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which type of question felt hardest in this lesson?', type: 'multiple-choice', options: ['Classifying a number into sets', 'Deciding rational vs. irrational', 'Number-line placement', 'None of these'] },
    { id: 'r2', prompt: 'How confident do you feel about the real number system now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What’s one thing you’ll look out for next time you classify a number?', type: 'free-text' },
  ],
};
