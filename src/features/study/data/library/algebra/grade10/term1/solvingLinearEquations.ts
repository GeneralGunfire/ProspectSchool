// ── Topic 6: Solving Linear Equations — Algebra, Grade 10, Term 1 ────────────
// Lighter-weight build per LIBRARY_PARTNER_HANDOFF.md §4/step 7. Covers
// single/two-step equations, equations with brackets, and variable on both
// sides — the three CAPS sub-topics the execution plan groups under one
// Library lesson (matching the existing "OneVariableLinearEquations" pilot
// grouping decision noted in GRADE10_MATHS_CAPS_TOPIC_LIST.md).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'unbalanced-operation',
    label: 'Doing an operation to only one side of the equation',
    errorType: 'You performed an operation on one side of the equation but not the other.',
    principle: 'An equation is a balance — whatever you do to one side, you must do to the other, or the two sides stop being equal.',
    correctStep: 'x + 5 = 12 → subtract 5 from BOTH sides → x = 7.',
  },
  {
    id: 'sign-error-moving-terms',
    label: 'Not flipping the sign when moving a term across the equals sign',
    errorType: 'You moved a term to the other side of the equation without changing its sign.',
    principle: 'Moving a term across the equals sign is really "doing the opposite operation to both sides" — a term that was added becomes subtracted (and vice versa) once it crosses over.',
    correctStep: 'x + 5 = 12 → x = 12 - 5 = 7 (the +5 became -5 when it moved across).',
  },
  {
    id: 'divide-only-part-of-side',
    label: 'Dividing only part of one side by the coefficient',
    errorType: 'You divided only one term by the coefficient of x, instead of the entire side.',
    principle: 'When isolating x, you must divide the WHOLE of both sides by the coefficient — not just the term that contains x.',
    correctStep: '3x = 12 + 6 → 3x = 18 → x = 18 ÷ 3 = 6 (divide the whole right side by 3, not just the 12).',
  },
  {
    id: 'bracket-not-fully-distributed',
    label: 'Not distributing across the whole bracket before solving',
    errorType: 'You started solving before fully expanding a bracket in the equation.',
    principle: 'Any bracket in an equation must be expanded (distributed) first, before you start moving terms around.',
    correctStep: '3(x + 2) = 21 → 3x + 6 = 21 → 3x = 15 → x = 5.',
  },
  {
    id: 'variable-both-sides-wrong-direction',
    label: 'Collecting the x-terms on the wrong side, losing track of signs',
    errorType: 'You moved the x-terms to one side but made a sign error in the process.',
    principle: 'When x appears on both sides, subtract the SMALLER x-term from both sides (whichever choice avoids a negative x-coefficient), then continue solving as normal.',
    correctStep: '5x + 2 = 2x + 11 → subtract 2x from both sides → 3x + 2 = 11 → 3x = 9 → x = 3.',
  },
  {
    id: 'no-check-solution',
    label: 'Not checking the solution by substituting back',
    errorType: 'You found a value for x but didn\'t verify it actually satisfies the original equation.',
    principle: 'Substituting your answer back into the ORIGINAL equation is a fast way to catch arithmetic slips — both sides should come out equal.',
    correctStep: 'For x = 3 in 5x+2=2x+11: LHS = 5(3)+2 = 17, RHS = 2(3)+11 = 17. Equal, so x = 3 is confirmed correct.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'solving-linear-equations',
  topicName: 'Solving Linear Equations',
  prerequisites: [
    'Expanding brackets (Topic 3)',
    'Working with positive and negative numbers',
    'Combining like terms',
  ],
  objectives: [
    { id: 'single-two-step', text: 'Solve single- and two-step linear equations by performing the same operation on both sides.' },
    { id: 'brackets-equations', text: 'Solve a linear equation that contains a bracket, by expanding first.' },
    { id: 'variable-both-sides', text: 'Solve a linear equation with the variable appearing on both sides.' },
    { id: 'check-solution', text: 'Check a solution by substituting it back into the original equation.' },
  ],
  estimatedMinutes: [20, 30],
};

export const solvingLinearEquations: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What keeps an equation balanced?',
  goalSettingPrompt:
    'An equation is like a set of balanced scales — both sides must always weigh the same. By the end of this lesson you\'ll be able to solve linear equations of increasing complexity by keeping that balance at every step.',

  activate: {
    connectPrompt: 'You already know how to expand brackets and combine like terms — both come up constantly when solving equations.',
    diagnosticQuestions: [
      { question: 'Expand 2(x + 4).', options: ['2x + 4', '2x + 8', 'x + 8', '2x + 6'], correctIndex: 1, explanation: '2 × x = 2x, 2 × 4 = 8, so 2(x+4) = 2x + 8.' },
      { question: 'Simplify 7x - 3x + 2x.', options: ['6x', '4x', '12x', '2x'], correctIndex: 0, explanation: '7x - 3x + 2x = (7-3+2)x = 6x.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Think of an equation as a balanced scale: both sides must stay equal at every step. To isolate x, undo whatever is being done to it, always applying the SAME operation to both sides. If x has a term added or subtracted, undo that first (using the opposite operation). If x is multiplied by a coefficient, divide the ENTIRE other side by that coefficient last.',
    workedExamples: [
      { id: 'wx-one-step', prompt: 'Solve x - 6 = 14.', steps: [
        { step: 'Add 6 to both sides to undo the subtraction.', justification: 'The opposite of subtracting 6 is adding 6.' },
        { step: 'x - 6 + 6 = 14 + 6', justification: 'Apply the same operation to both sides to preserve balance.' },
      ], answer: 'x = 20' },
      { id: 'wx-two-step', prompt: 'Solve 4x + 3 = 19.', steps: [
        { step: 'Subtract 3 from both sides: 4x = 16.', justification: 'Undo the "+3" first, before dealing with the coefficient.' },
        { step: 'Divide both sides by 4: x = 4.', justification: 'The whole right side (16) is divided by the coefficient of x.' },
      ], answer: 'x = 4' },
    ],
    knowledgeChecks: [
      { question: 'Solve x + 9 = 15.', options: ['x = 6', 'x = 24', 'x = -6', 'x = 5'], correctIndex: 0, explanation: 'Subtract 9 from both sides: x = 15 - 9 = 6.', misconceptionId: 'unbalanced-operation' },
      { question: 'Solve 5x - 4 = 26.', options: ['x = 6', 'x = 4.4', 'x = 5', 'x = 22'], correctIndex: 0, explanation: 'Add 4 to both sides: 5x = 30. Divide both sides by 5: x = 6.', misconceptionId: 'divide-only-part-of-side' },
    ],
    confidenceCheckPrompt: 'How confident do you feel solving single- and two-step equations by keeping both sides balanced?',
  },

  demonstrateChunk2: {
    explanation:
      'Two more situations come up often. First, if the equation contains a bracket, expand (distribute) it completely before doing anything else — only then start isolating x. Second, if x appears on BOTH sides of the equation, first collect all the x-terms onto one side by subtracting the smaller x-term from both sides, then solve as usual. Once you have a solution, it\'s always worth substituting it back into the ORIGINAL equation to check both sides come out equal.',
    workedExamples: [
      { id: 'wx-bracket-eq', prompt: 'Solve 3(x + 2) = 21.', steps: [
        { step: 'Expand the bracket: 3x + 6 = 21.', justification: 'Distribute the 3 across both terms inside the bracket.' },
        { step: 'Subtract 6 from both sides: 3x = 15.', justification: 'Undo the "+6" first.' },
        { step: 'Divide both sides by 3: x = 5.', justification: 'Isolate x by dividing by its coefficient.' },
      ], answer: 'x = 5' },
      { id: 'wx-both-sides', prompt: 'Solve 5x + 2 = 2x + 11.', steps: [
        { step: 'Subtract 2x from both sides: 3x + 2 = 11.', justification: 'Collect the x-terms on one side — subtracting the smaller x-term (2x) avoids a negative coefficient.' },
        { step: 'Subtract 2 from both sides: 3x = 9.', justification: 'Isolate the x-term.' },
        { step: 'Divide both sides by 3: x = 3.', justification: 'Isolate x.' },
      ], answer: 'x = 3' },
      { id: 'wx-check-solution', prompt: 'Check that x = 3 solves 5x + 2 = 2x + 11.', steps: [
        { step: 'Substitute x=3 into the left side: 5(3) + 2 = 17.', justification: 'Evaluate the LHS with the found solution.' },
        { step: 'Substitute x=3 into the right side: 2(3) + 11 = 17.', justification: 'Evaluate the RHS with the found solution.' },
      ], answer: 'Both sides equal 17, so x = 3 is confirmed correct.' },
    ],
    knowledgeChecks: [
      { question: 'Solve 4(x - 1) = 16.', options: ['x = 5', 'x = 4', 'x = 3', 'x = 17'], correctIndex: 0, explanation: 'Expand: 4x - 4 = 16. Add 4: 4x = 20. Divide by 4: x = 5.', misconceptionId: 'bracket-not-fully-distributed' },
      { question: 'Solve 7x + 1 = 3x + 13.', options: ['x = 3', 'x = 4', 'x = -3', 'x = 2'], correctIndex: 0, explanation: 'Subtract 3x from both sides: 4x + 1 = 13. Subtract 1: 4x = 12. Divide by 4: x = 3.', misconceptionId: 'variable-both-sides-wrong-direction' },
    ],
    confidenceCheckPrompt: 'How confident do you feel solving equations with brackets, or with x on both sides?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'single-two-step', revealSteps: 2, prompt: 'Solve 6x - 5 = 25.', steps: [
        { step: 'Add 5 to both sides: 6x = 30.', justification: 'Undo the subtraction first.' },
        { step: 'Divide both sides by 6: x = 5.', justification: 'Isolate x by dividing by its coefficient.' },
      ], answer: 'x = 5' },
      { id: 'fp-partial-1', objectiveId: 'brackets-equations', revealSteps: 1, prompt: 'Solve 2(x + 5) = 24.', steps: [
        { step: 'Expand the bracket: 2x + 10 = 24.', justification: 'Distribute the 2 across both terms.' },
        { step: 'Subtract 10 from both sides: 2x = 14.', justification: 'Undo the "+10".' },
        { step: 'Divide both sides by 2: x = 7.', justification: 'Isolate x.' },
      ], answer: 'x = 7' },
      { id: 'fp-independent-1', objectiveId: 'variable-both-sides', revealSteps: 0, prompt: 'Solve 8x - 3 = 3x + 22.', steps: [
        { step: 'Subtract 3x from both sides: 5x - 3 = 22.', justification: 'Collect the x-terms on one side.' },
        { step: 'Add 3 to both sides: 5x = 25. Divide by 5: x = 5.', justification: 'Isolate x.' },
      ], answer: 'x = 5' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'single-two-step', question: 'Solve 3x + 7 = 22.', options: ['x = 5', 'x = 29/3', 'x = 15', 'x = 4.5'], correctIndex: 0, hints: { strategic: 'Undo the "+7" first, then the coefficient.', procedural: 'Subtract 7: 3x = 15. Divide by 3.', workedStep: 'x = 5.' }, distractorMisconceptions: { 1: 'unbalanced-operation' } },
      { id: 'ip-2', objectiveId: 'single-two-step', question: 'Solve 9 - x = 2.', options: ['x = 7', 'x = 11', 'x = -7', 'x = 4.5'], correctIndex: 0, hints: { strategic: 'Isolate x carefully — it has a negative coefficient here.', procedural: 'Subtract 9 from both sides: -x = -7.', workedStep: 'Multiply both sides by -1: x = 7.' }, distractorMisconceptions: { 2: 'sign-error-moving-terms' } },
      { id: 'ip-3', objectiveId: 'brackets-equations', question: 'Solve 5(x - 3) = 10.', options: ['x = 5', 'x = 2', 'x = 13', 'x = 1'], correctIndex: 0, hints: { strategic: 'Expand the bracket before solving.', procedural: '5x - 15 = 10. Add 15: 5x = 25.', workedStep: 'Divide by 5: x = 5.' }, distractorMisconceptions: { 1: 'bracket-not-fully-distributed' } },
      { id: 'ip-4', objectiveId: 'variable-both-sides', question: 'Solve 6x + 4 = x + 24.', options: ['x = 4', 'x = 20', 'x = 5.6', 'x = 28/7'], correctIndex: 0, hints: { strategic: 'Collect the x-terms on one side first.', procedural: 'Subtract x from both sides: 5x + 4 = 24.', workedStep: 'Subtract 4: 5x = 20. Divide by 5: x = 4.' }, distractorMisconceptions: { 2: 'variable-both-sides-wrong-direction' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'single-two-step', multiSelect: false, question: 'Solve x + 12 = 20.', options: ['x = 8', 'x = 32', 'x = -8', 'x = 12'], correctIndices: [0], explanation: 'Subtract 12 from both sides: x = 20 - 12 = 8.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'single-two-step', multiSelect: false, question: 'Solve 6x = 42.', options: ['x = 7', 'x = 36', 'x = 48', 'x = 252'], correctIndices: [0], explanation: 'Divide both sides by 6: x = 7.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'single-two-step', multiSelect: false, question: 'True or false: to solve 2x + 5 = 17, you should divide by 2 first, before subtracting 5.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — you should undo the "+5" first (subtract 5 from both sides), then divide by 2. Dividing first would also divide the 5, which is not what the equation says.', distractorMisconceptions: { 0: 'divide-only-part-of-side' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'brackets-equations', multiSelect: false, question: 'Solve 4(x + 3) = 32.', options: ['x = 5', 'x = 8', 'x = 6.5', 'x = 11'], correctIndices: [0], explanation: 'Expand: 4x + 12 = 32. Subtract 12: 4x = 20. Divide by 4: x = 5.', distractorMisconceptions: { 1: 'bracket-not-fully-distributed' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'brackets-equations', multiSelect: false, question: 'Solve 2(x - 4) = 10.', options: ['x = 9', 'x = 7', 'x = 3', 'x = 5'], correctIndices: [0], explanation: 'Expand: 2x - 8 = 10. Add 8: 2x = 18. Divide by 2: x = 9.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'variable-both-sides', multiSelect: false, question: 'Solve 3x + 8 = x + 20.', options: ['x = 6', 'x = 14', 'x = 4', 'x = 28/4'], correctIndices: [0], explanation: 'Subtract x from both sides: 2x + 8 = 20. Subtract 8: 2x = 12. Divide by 2: x = 6.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'check-solution', multiSelect: false, question: 'True or false: substituting your answer back into the original equation is a valid way to check your solution is correct.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — if both sides come out equal after substitution, the solution is confirmed correct.', distractorMisconceptions: {} },
    { id: 'q8', type: 'decimal-discrimination', objectiveId: 'check-solution', multiSelect: false, question: 'A student solves 4x + 1 = 21 and gets x = 5. Checking: LHS = 4(5)+1 = 21, RHS = 21. What does this tell you?', options: ['The solution x = 5 is correct', 'The equation has no solution', 'x = 5 must be rechecked further', 'The equation was set up wrong'], correctIndices: [0], explanation: 'Both sides equal 21 after substitution, confirming x = 5 is the correct solution.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'variable-both-sides',
      analogy: 'Think of the x-terms on both sides as two piles of the same kind of object on a scale. To compare them fairly, move all of that object onto one side first — subtract the smaller pile from both sides so you never end up with a negative pile to deal with.',
      explanation: 'When x is on both sides: pick the smaller x-coefficient and subtract that x-term from both sides. This leaves x-terms on only one side, with a positive coefficient, and you can solve normally from there.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Solve 9x + 2 = 4x + 27.', steps: [
          { step: 'The smaller x-coefficient is 4x. Subtract 4x from both sides: 5x + 2 = 27.', justification: 'This leaves x-terms only on the left, with a positive coefficient.' },
          { step: 'Subtract 2 from both sides: 5x = 25.', justification: 'Isolate the x-term.' },
          { step: 'Divide both sides by 5: x = 5.', justification: 'Isolate x.' },
        ], answer: 'x = 5' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'variable-both-sides', question: 'Solve 7x + 3 = 2x + 23.', options: ['x = 4', 'x = 5', 'x = 26/5', 'x = 20/5'], correctIndex: 0, hints: { strategic: 'Subtract the smaller x-term from both sides.', procedural: 'Subtract 2x: 5x + 3 = 23.', workedStep: 'Subtract 3: 5x = 20. Divide by 5: x = 4.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'variable-both-sides', question: 'Solve 10x - 4 = 4x + 14.', options: ['x = 3', 'x = 1.67', 'x = 18/6', 'x = 2'], correctIndex: 0, hints: { strategic: 'Subtract the smaller x-term from both sides.', procedural: 'Subtract 4x: 6x - 4 = 14.', workedStep: 'Add 4: 6x = 18. Divide by 6: x = 3.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'variable-both-sides', question: 'Solve 5x + 9 = 2x + 24.', options: ['x = 5', 'x = 33/7', 'x = 15/3', 'x = 4'], correctIndex: 0, hints: { strategic: 'Subtract the smaller x-term from both sides.', procedural: 'Subtract 2x: 3x + 9 = 24.', workedStep: 'Subtract 9: 3x = 15. Divide by 3: x = 5.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which type of equation felt hardest: single/two-step, with brackets, or variable on both sides?', type: 'multiple-choice', options: ['Single/two-step', 'Equations with brackets', 'Variable on both sides', 'They all felt about the same'] },
    { id: 'r2', prompt: 'How confident do you feel solving linear equations now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is one habit (like checking your solution) you\'ll build into how you solve equations from now on?', type: 'free-text' },
  ],
};
