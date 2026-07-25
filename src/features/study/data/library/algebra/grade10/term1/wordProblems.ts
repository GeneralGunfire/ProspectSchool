// ── Topic 9: Word Problems (linear and quadratic) — Algebra, Grade 10, Term 1 ──
// Lighter-weight build per LIBRARY_PARTNER_HANDOFF.md §4/step 7. The final
// topic in the sequence — draws on Topic 6 (linear equations) and Topic 7
// (quadratic equations), both now built. Focus is entirely on translation
// (words -> equation), not on solving techniques already covered.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'no-variable-defined',
    label: 'Writing an equation without first defining what the variable represents',
    errorType: 'You jumped straight to an equation without stating in words what x represents.',
    principle: 'Always start by writing "Let x = ..." in words, describing exactly what unknown quantity x stands for. Without this, it\'s easy to lose track of what the final answer actually means.',
    correctStep: 'Let x = the number of tickets sold. Then define the equation in terms of x.',
  },
  {
    id: 'mistranslate-relationship',
    label: 'Translating a phrase into the wrong operation',
    errorType: 'You translated a word problem\'s relationship using the wrong mathematical operation.',
    principle: 'Common phrases translate consistently: "more than" and "sum" mean addition; "less than" and "difference" mean subtraction (careful with order: "5 less than x" is x-5, not 5-x); "times"/"product"/"of" mean multiplication; "shared equally"/"per" mean division.',
    correctStep: '"5 less than a number" translates to x - 5, NOT 5 - x — the order matters.',
  },
  {
    id: 'answer-not-checked-against-context',
    label: 'Not checking whether the answer makes sense in context',
    errorType: 'You found a mathematically valid solution but didn\'t check whether it makes sense for the real situation described.',
    principle: 'A correct equation can still produce an answer that\'s impossible in context (e.g. a negative number of people, a negative length, an age of -3). Always check your solution against what the problem is actually describing.',
    correctStep: 'If solving for "number of learners" gives x = -4, this cannot be correct in context — a negative count of people is impossible, so recheck the equation or reject that root.',
  },
  {
    id: 'consecutive-integers-wrong-setup',
    label: 'Setting up consecutive integers or ages incorrectly',
    errorType: 'You represented consecutive numbers, or an age relationship, with the wrong expressions.',
    principle: 'Consecutive integers are x, x+1, x+2, .... Consecutive even/odd integers are x, x+2, x+4, .... For ages "in 5 years", add 5 to the current age; "5 years ago", subtract 5 — apply this consistently to every person in the problem.',
    correctStep: 'Three consecutive integers: x, x+1, x+2 (not x, x+1, x+3).',
  },
  {
    id: 'quadratic-word-problem-forgets-reject-root',
    label: 'Not rejecting an extraneous root in a quadratic word problem',
    errorType: 'You found two solutions to the quadratic equation but reported both, without checking whether one makes sense in context.',
    principle: 'A quadratic equation modelling a real situation (like a length or an age) often produces two mathematical solutions, but only ONE may be valid in context — negative lengths, negative ages, or negative counts must be rejected.',
    correctStep: 'If x = -3 or x = 7 are the mathematical solutions but x represents a length, reject x = -3 (a length can\'t be negative) and keep x = 7.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'word-problems',
  topicName: 'Word Problems: Linear and Quadratic',
  prerequisites: [
    'Solving linear equations (Topic 6)',
    'Solving quadratic equations (Topic 7)',
  ],
  objectives: [
    { id: 'define-variable', text: 'Define a variable clearly in words before setting up an equation.' },
    { id: 'translate-to-equation', text: 'Translate a word problem into a linear or quadratic equation.' },
    { id: 'solve-and-interpret', text: 'Solve the resulting equation and interpret the answer in the context of the original problem.' },
    { id: 'reject-invalid-solutions', text: 'Reject a mathematically valid solution that doesn\'t make sense in the real-world context.' },
  ],
  estimatedMinutes: [20, 30],
};

export const wordProblems: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How do you turn a story into an equation?',
  goalSettingPrompt:
    'You can already solve linear and quadratic equations — the hard part of a word problem usually isn\'t the solving, it\'s the translating. By the end of this lesson you\'ll be able to turn a written scenario into the right equation, solve it, and check that your answer actually makes sense.',

  activate: {
    connectPrompt: 'You already know how to solve linear and quadratic equations. This lesson is about the step before that: writing the equation in the first place.',
    diagnosticQuestions: [
      { question: 'Solve 2x + 3 = 17.', options: ['x = 7', 'x = 10', 'x = 20', 'x = 8.5'], correctIndex: 0, explanation: 'Subtract 3: 2x=14. Divide by 2: x=7.' },
      { question: 'Solve x² - x - 6 = 0.', options: ['x = 3 or x = -2', 'x = -3 or x = 2', 'x = 6', 'x = 3 and x = -2 required together'], correctIndex: 0, explanation: 'Factorise: (x-3)(x+2)=0, so x=3 or x=-2.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Every word problem follows the same process: (1) define your variable clearly in words — "Let x = ..." — describing exactly what unknown you\'re solving for; (2) translate the relationships described into a mathematical equation, watching common phrases carefully; (3) solve the equation using the skills you already have; (4) interpret your answer back in the context of the original problem, and check it actually makes sense. Skipping step 1 is a common source of confusion later, since it\'s easy to lose track of what your final number actually represents.',
    workedExamples: [
      { id: 'wx-linear-basic', prompt: 'A number, plus 8, is equal to 23. Find the number.', steps: [
        { step: 'Let x = the number.', justification: 'Define the variable in words first.' },
        { step: 'Translate: x + 8 = 23.', justification: '"Plus 8" means add 8.' },
        { step: 'Solve: x = 23 - 8 = 15.', justification: 'Undo the addition.' },
      ], answer: 'The number is 15.' },
      { id: 'wx-consecutive', prompt: 'The sum of three consecutive integers is 66. Find the integers.', steps: [
        { step: 'Let x = the first integer. The next two are x+1 and x+2.', justification: 'Consecutive integers increase by 1 each time.' },
        { step: 'Translate: x + (x+1) + (x+2) = 66.', justification: '"Sum" means add all three together.' },
        { step: 'Solve: 3x + 3 = 66 → 3x = 63 → x = 21.', justification: 'Simplify and solve the linear equation.' },
      ], answer: 'The integers are 21, 22, and 23.' },
    ],
    knowledgeChecks: [
      { question: 'Translate: "5 less than a number is 12."', options: ['x - 5 = 12', '5 - x = 12', 'x + 5 = 12', '5x = 12'], correctIndex: 0, explanation: '"5 less than a number" means the number minus 5, so x - 5 = 12.', misconceptionId: 'mistranslate-relationship' },
      { question: 'What should be the very first step when setting up a word problem\'s equation?', options: ['Define the variable in words: "Let x = ..."', 'Immediately write the equation', 'Solve for x directly', 'Guess a likely answer'], correctIndex: 0, explanation: 'Defining the variable first keeps track of what your final answer will mean.', misconceptionId: 'no-variable-defined' },
    ],
    confidenceCheckPrompt: 'How confident do you feel translating a linear word problem into an equation?',
  },

  demonstrateChunk2: {
    explanation:
      'Some word problems translate into a QUADRATIC equation — often when a problem involves a product of two related quantities (like area, or a product of consecutive numbers). The process is the same: define the variable, translate, solve. The one extra step: because a quadratic can have two solutions, you must check EACH one against the real-world context — a negative length, age, or count is usually impossible and should be rejected, keeping only the solution that makes sense.',
    workedExamples: [
      { id: 'wx-quadratic-area', prompt: 'A rectangle\'s length is 3m more than its width. Its area is 40m². Find the width.', steps: [
        { step: 'Let x = the width (in metres). Then the length is x + 3.', justification: 'Define the variable and express the related quantity in terms of it.' },
        { step: 'Translate using Area = length × width: x(x + 3) = 40.', justification: 'Area of a rectangle is length times width.' },
        { step: 'Expand and rearrange: x² + 3x - 40 = 0. Factorise: (x+8)(x-5) = 0. So x = -8 or x = 5.', justification: 'Solve the quadratic as usual.' },
        { step: 'Reject x = -8, since a width cannot be negative. Keep x = 5.', justification: 'Check both solutions against the real-world context.' },
      ], answer: 'The width is 5m (and the length is 8m).' },
      { id: 'wx-quadratic-consecutive', prompt: 'The product of two consecutive positive integers is 56. Find the integers.', steps: [
        { step: 'Let x = the first integer. The next is x + 1.', justification: 'Define the variable.' },
        { step: 'Translate: x(x+1) = 56.', justification: '"Product" means multiply.' },
        { step: 'Expand and rearrange: x² + x - 56 = 0. Factorise: (x+8)(x-7) = 0. So x = -8 or x = 7.', justification: 'Solve the quadratic.' },
        { step: 'Reject x = -8, since the problem specifies positive integers. Keep x = 7.', justification: 'Check against the stated context (positive integers only).' },
      ], answer: 'The integers are 7 and 8.' },
    ],
    knowledgeChecks: [
      { question: 'Solving a quadratic word problem about a person\'s age gives x = -6 or x = 20. What should you do?', options: ['Reject x = -6, since an age can\'t be negative — keep x = 20', 'Report both solutions', 'Reject x = 20 instead', 'Average the two solutions'], correctIndex: 0, explanation: 'A negative age is impossible in context, so it must be rejected.', misconceptionId: 'quadratic-word-problem-forgets-reject-root' },
      { question: 'A rectangle\'s area problem gives width = x and length = x + 4. How do you translate "area is 32"?', options: ['x(x + 4) = 32', 'x + (x+4) = 32', 'x + 4 = 32', '2x + 4 = 32'], correctIndex: 0, explanation: 'Area = length × width, so x(x+4) = 32.', misconceptionId: 'mistranslate-relationship' },
    ],
    confidenceCheckPrompt: 'How confident do you feel setting up and solving a quadratic word problem, including rejecting invalid solutions?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'translate-to-equation', revealSteps: 2, prompt: 'A number doubled, plus 7, equals 25. Find the number.', steps: [
        { step: 'Let x = the number. Translate: 2x + 7 = 25.', justification: '"Doubled" means multiply by 2, then "plus 7" adds 7.' },
        { step: 'Solve: 2x = 18 → x = 9.', justification: 'Solve the linear equation.' },
      ], answer: 'The number is 9.' },
      { id: 'fp-partial-1', objectiveId: 'solve-and-interpret', revealSteps: 1, prompt: 'Twice a number, minus 3, is the same as the number plus 9. Find the number.', steps: [
        { step: 'Let x = the number. Translate: 2x - 3 = x + 9.', justification: 'Translate each part of the sentence.' },
        { step: 'Solve: subtract x from both sides: x - 3 = 9 → x = 12.', justification: 'Solve the equation with x on both sides.' },
      ], answer: 'The number is 12.' },
      { id: 'fp-independent-1', objectiveId: 'reject-invalid-solutions', revealSteps: 0, prompt: 'A rectangle\'s length is 2m more than its width. Its area is 24m². Find the width.', steps: [
        { step: 'Let x = width, length = x+2. Translate: x(x+2) = 24 → x² + 2x - 24 = 0 → (x+6)(x-4) = 0 → x = -6 or x = 4.', justification: 'Set up and solve the quadratic.' },
        { step: 'Reject x = -6 (a width can\'t be negative). Keep x = 4.', justification: 'Check against context.' },
      ], answer: 'The width is 4m.' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'translate-to-equation', question: 'Translate: "A number increased by 9 is 34."', options: ['x + 9 = 34', '9 - x = 34', 'x - 9 = 34', '9x = 34'], correctIndex: 0, hints: { strategic: '"Increased by" means what operation?', procedural: 'Addition — the number plus 9.', workedStep: 'x + 9 = 34.' }, distractorMisconceptions: { 2: 'mistranslate-relationship' } },
      { id: 'ip-2', objectiveId: 'solve-and-interpret', question: 'The sum of two consecutive even integers is 54. Find them.', options: ['26 and 28', '25 and 29', '27 and 27', '24 and 30'], correctIndex: 0, hints: { strategic: 'Consecutive even integers increase by 2 each time.', procedural: 'Let x = first, x+2 = second. x + (x+2) = 54.', workedStep: '2x + 2 = 54 → x = 26. Integers: 26 and 28.' }, distractorMisconceptions: { 1: 'consecutive-integers-wrong-setup' } },
      { id: 'ip-3', objectiveId: 'reject-invalid-solutions', question: 'A quadratic word problem about a length gives x = -5 or x = 9. What is the valid answer?', options: ['x = 9', 'x = -5', 'Both are valid', 'Neither is valid'], correctIndex: 0, hints: { strategic: 'Can a length be negative?', procedural: 'No — reject x = -5.', workedStep: 'The valid answer is x = 9.' }, distractorMisconceptions: { 2: 'quadratic-word-problem-forgets-reject-root' } },
      { id: 'ip-4', objectiveId: 'translate-to-equation', question: 'A rectangle\'s length is 5m more than its width, and its area is 36m². Which equation correctly represents this?', options: ['x(x + 5) = 36', 'x + (x+5) = 36', '2x + 5 = 36', 'x + 5 = 36'], correctIndex: 0, hints: { strategic: 'Area = length × width.', procedural: 'Width = x, length = x+5.', workedStep: 'x(x+5) = 36.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'define-variable', multiSelect: false, question: 'True or false: it\'s good practice to write "Let x = ..." before setting up a word problem\'s equation.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — defining the variable in words keeps track of what your final answer means.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'translate-to-equation', multiSelect: false, question: 'Translate: "7 less than twice a number is 15."', options: ['2x - 7 = 15', '7 - 2x = 15', '2x + 7 = 15', '2(x-7) = 15'], correctIndices: [0], explanation: '"7 less than twice a number" means (2 times the number) minus 7: 2x - 7 = 15.', distractorMisconceptions: { 1: 'mistranslate-relationship' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'solve-and-interpret', multiSelect: false, question: 'Three times a number, minus 4, equals the number plus 10. Find the number.', options: ['7', '3', '14', '4.67'], correctIndices: [0], explanation: '3x-4=x+10 → 2x=14 → x=7.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'solve-and-interpret', multiSelect: false, question: 'The sum of two consecutive integers is 45. Find the larger one.', options: ['23', '22', '24', '21'], correctIndices: [0], explanation: 'x + (x+1) = 45 → 2x = 44 → x = 22. The larger integer is 23.', distractorMisconceptions: { 1: 'consecutive-integers-wrong-setup' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'reject-invalid-solutions', multiSelect: false, question: 'A quadratic word problem about the number of learners in a class gives x = -12 or x = 30. What is the answer?', options: ['30', '-12', 'Both -12 and 30', 'Neither'], correctIndices: [0], explanation: 'A negative number of learners is impossible, so x = -12 must be rejected.', distractorMisconceptions: { 2: 'quadratic-word-problem-forgets-reject-root' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'translate-to-equation', multiSelect: false, question: 'The product of two consecutive positive integers is 42. Which equation models this?', options: ['x(x+1) = 42', 'x + (x+1) = 42', '2x + 1 = 42', 'x² = 42'], correctIndices: [0], explanation: '"Product of consecutive integers" translates to x(x+1) = 42.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'solve-and-interpret', multiSelect: false, question: 'A rectangle\'s length is 4m more than its width, and its area is 21m². Find the width.', options: ['3m', '7m', '4m', '-7m'], correctIndices: [0], explanation: 'x(x+4)=21 → x²+4x-21=0 → (x+7)(x-3)=0 → x=-7 or x=3. Reject the negative: width = 3m.', distractorMisconceptions: { 3: 'quadratic-word-problem-forgets-reject-root' } },
    { id: 'q8', type: 'true-false', objectiveId: 'reject-invalid-solutions', multiSelect: false, question: 'True or false: every solution found from solving a word problem\'s equation is automatically a valid answer to the original problem.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a mathematically valid solution must still be checked against the real-world context (e.g. rejecting negative lengths, ages, or counts).', distractorMisconceptions: { 0: 'answer-not-checked-against-context' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'translate-to-equation',
      analogy: 'Think of translating a word problem like translating between two languages: each common English phrase has a reliable mathematical "translation" — learn the dictionary of phrases (more than = +, less than = -, product = ×, etc.) and apply it piece by piece, rather than guessing the whole sentence at once.',
      explanation: 'Break the sentence into small pieces, translate each piece using the standard phrase-to-operation dictionary, and build the equation piece by piece. Watch order carefully for "less than" and "subtracted from" — these reverse the order of the words.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Translate piece by piece: "4 more than three times a number is 19."', steps: [
          { step: '"a number" → x', justification: 'This is the unknown.' },
          { step: '"three times a number" → 3x', justification: '"Times" means multiply.' },
          { step: '"4 more than three times a number" → 3x + 4', justification: '"More than" means add, applied to the whole previous expression.' },
          { step: '"...is 19" → 3x + 4 = 19', justification: '"Is" means equals.' },
        ], answer: '3x + 4 = 19 (which solves to x = 5)' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'translate-to-equation', question: 'Translate: "8 less than a number is 15."', options: ['x - 8 = 15', '8 - x = 15', 'x + 8 = 15', '8x = 15'], correctIndex: 0, hints: { strategic: '"Less than" reverses the order — the number comes first.', procedural: 'The number minus 8.', workedStep: 'x - 8 = 15.' }, distractorMisconceptions: { 1: 'mistranslate-relationship' } },
        { id: 'rem-p2', objectiveId: 'translate-to-equation', question: 'Translate: "Twice a number, decreased by 6, is 20."', options: ['2x - 6 = 20', '6 - 2x = 20', '2(x-6) = 20', '2x + 6 = 20'], correctIndex: 0, hints: { strategic: 'Break it into pieces: "twice a number" first, then "decreased by 6".', procedural: '2x, then subtract 6.', workedStep: '2x - 6 = 20.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'translate-to-equation', question: 'Translate: "The product of a number and 5, plus 2, is 37."', options: ['5x + 2 = 37', '5(x+2) = 37', '5x - 2 = 37', 'x + 5 + 2 = 37'], correctIndex: 0, hints: { strategic: 'Translate "product of a number and 5" first.', procedural: '5x, then "plus 2" adds 2 to the whole thing.', workedStep: '5x + 2 = 37.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which part of solving a word problem felt hardest: translating, solving, or checking the answer makes sense?', type: 'multiple-choice', options: ['Translating the words into an equation', 'Solving the equation', 'Checking the answer against the context', 'Defining the variable'] },
    { id: 'r2', prompt: 'How confident do you feel solving word problems now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is one phrase-to-operation translation you\'ll remember from this lesson?', type: 'free-text' },
  ],
};
