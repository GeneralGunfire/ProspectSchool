// ── Topic 11: Solving Linear Inequalities — Algebra, Grade 10, Term 1 ────────
// Lighter-weight build per LIBRARY_PARTNER_HANDOFF.md §4/step 7. Builds
// directly on Topic 6 (solving linear equations) — same balance technique,
// with the one critical addition: flipping the inequality sign when
// multiplying/dividing by a negative number.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'forgets-flip-sign-negative',
    label: 'Not flipping the inequality sign when multiplying/dividing by a negative',
    errorType: 'You multiplied or divided both sides by a negative number without flipping the inequality sign.',
    principle: 'Multiplying or dividing an inequality by a NEGATIVE number reverses the direction of the inequality — this is the one rule that doesn\'t apply to equations.',
    correctStep: '-2x < 8 → divide both sides by -2 AND flip the sign → x > -4.',
  },
  {
    id: 'treats-inequality-like-equation-fully',
    label: 'Solving an inequality exactly like an equation, ignoring the sign-flip rule entirely',
    errorType: 'You applied every equation-solving step correctly except for checking whether the sign needed to flip.',
    principle: 'Every other step (undo addition/subtraction, divide by a POSITIVE coefficient) works exactly the same as an equation — the ONLY difference is the sign-flip rule for negative multiplication/division.',
    correctStep: '3 - x > 7 → subtract 3: -x > 4 → divide by -1 AND flip: x < -4.',
  },
  {
    id: 'wrong-number-line-direction',
    label: 'Shading the wrong direction on the number line',
    errorType: 'You drew the solution on a number line shading the wrong side of the boundary value.',
    principle: '"x > a" shades everything to the RIGHT of a (larger values); "x < a" shades everything to the LEFT of a (smaller values). Read the inequality symbol carefully before shading.',
    correctStep: 'x > 3 shades all values greater than 3, so the arrow points right from an open circle at 3.',
  },
  {
    id: 'open-vs-closed-circle-confusion',
    label: 'Using the wrong type of circle (open vs. closed) at the boundary point',
    errorType: 'You used an open circle when the boundary value should be included, or a closed circle when it should not.',
    principle: 'A CLOSED (filled) circle means the boundary value IS included (≤ or ≥). An OPEN circle means it is NOT included (< or >).',
    correctStep: 'x ≤ 5 uses a closed circle at 5 (5 is included); x < 5 uses an open circle at 5 (5 is not included).',
  },
  {
    id: 'compound-inequality-one-side-only',
    label: 'Only solving one side of a compound inequality',
    errorType: 'You performed an operation on only one part of a compound (three-part) inequality.',
    principle: 'A compound inequality like -3 < x + 2 ≤ 7 has three parts. Any operation must be applied to ALL THREE parts, not just one or two.',
    correctStep: '-3 < x + 2 ≤ 7 → subtract 2 from ALL THREE parts → -5 < x ≤ 5.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'solving-linear-inequalities',
  topicName: 'Solving Linear Inequalities',
  prerequisites: [
    'Solving linear equations, including brackets and variable on both sides (Topic 6)',
    'Reading and plotting points on a number line',
  ],
  objectives: [
    { id: 'solve-basic-inequality', text: 'Solve a linear inequality using the same steps as a linear equation.' },
    { id: 'flip-sign-negative', text: 'Correctly flip the inequality sign when multiplying or dividing by a negative number.' },
    { id: 'represent-number-line', text: 'Represent the solution to an inequality on a number line, using open/closed circles correctly.' },
    { id: 'compound-inequality', text: 'Solve and represent a compound (three-part) inequality.' },
  ],
  estimatedMinutes: [20, 30],
};

export const solvingLinearInequalities: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What breaks when you multiply by a negative?',
  goalSettingPrompt:
    'Solving an inequality uses almost exactly the same steps as solving an equation — except for one rule that changes everything when a negative number is involved. By the end of this lesson you\'ll be able to solve, and represent on a number line, linear inequalities including compound ones.',

  activate: {
    connectPrompt: 'You already know how to solve linear equations. Let\'s check that, since inequalities use almost the same process.',
    diagnosticQuestions: [
      { question: 'Solve 2x + 3 = 11.', options: ['x = 4', 'x = 7', 'x = 5.5', 'x = 22'], correctIndex: 0, explanation: 'Subtract 3: 2x = 8. Divide by 2: x = 4.' },
      { question: 'Is -3 < -1 a true statement?', options: ['True', 'False'], correctIndex: 0, explanation: '-3 is further left on the number line than -1, so -3 is indeed less than -1.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A linear inequality (using <, >, ≤, or ≥ instead of =) is solved using EXACTLY the same steps as an equation: undo addition/subtraction on both sides, then divide by the coefficient. The solution isn\'t a single value — it\'s a whole range of values that make the inequality true. There is exactly one new rule to learn, covered in the next section: what happens when you need to multiply or divide by a negative number.',
    workedExamples: [
      { id: 'wx-basic-inequality', prompt: 'Solve x + 4 < 10.', steps: [
        { step: 'Subtract 4 from both sides.', justification: 'Same first step as solving an equation.' },
      ], answer: 'x < 6' },
      { id: 'wx-two-step-inequality', prompt: 'Solve 3x - 2 ≥ 13.', steps: [
        { step: 'Add 2 to both sides: 3x ≥ 15.', justification: 'Undo the subtraction first.' },
        { step: 'Divide both sides by 3 (a positive number, so the sign stays the same): x ≥ 5.', justification: 'Dividing by a positive number never changes the inequality direction.' },
      ], answer: 'x ≥ 5' },
    ],
    knowledgeChecks: [
      { question: 'Solve x - 5 > 2.', options: ['x > 7', 'x > -3', 'x < 7', 'x > 3'], correctIndex: 0, explanation: 'Add 5 to both sides: x > 7.', misconceptionId: 'treats-inequality-like-equation-fully' },
      { question: 'Solve 4x ≤ 20 (coefficient is positive).', options: ['x ≤ 5', 'x ≥ 5', 'x ≤ 16', 'x ≤ 80'], correctIndex: 0, explanation: 'Divide both sides by 4 (positive), sign stays the same: x ≤ 5.', misconceptionId: 'treats-inequality-like-equation-fully' },
    ],
    confidenceCheckPrompt: 'How confident do you feel solving a basic linear inequality using the same steps as an equation?',
  },

  demonstrateChunk2: {
    explanation:
      'The ONE rule that makes inequalities different from equations: whenever you multiply OR divide both sides by a NEGATIVE number, you must flip the inequality sign (< becomes >, ≤ becomes ≥, and vice versa). To show a solution on a number line: use a CLOSED (filled) circle for ≤ or ≥ (the boundary value is included), and an OPEN circle for < or > (the boundary value is excluded) — then shade in the direction the inequality points (right for > or ≥, left for < or ≤). A compound inequality has three parts (e.g. -3 < x + 2 ≤ 7) — apply every operation to all three parts at once.',
    workedExamples: [
      { id: 'wx-flip-sign', prompt: 'Solve -3x > 12.', steps: [
        { step: 'Divide both sides by -3.', justification: 'Isolate x by dividing by its coefficient.' },
        { step: 'Since we divided by a NEGATIVE number, flip the sign: > becomes <.', justification: 'This is the one rule that differs from solving equations.' },
      ], answer: 'x < -4' },
      { id: 'wx-number-line', prompt: 'Represent x ≥ 2 on a number line.', steps: [
        { step: 'Since the inequality is ≥ (includes equal to), use a CLOSED circle at 2.', justification: '2 itself is part of the solution.' },
        { step: 'Shade to the RIGHT of 2, since x ≥ 2 means all values greater than or equal to 2.', justification: 'The ≥ symbol points toward larger values.' },
      ], answer: 'Closed circle at 2, shading to the right.' },
      { id: 'wx-compound', prompt: 'Solve -3 < x + 2 ≤ 7.', steps: [
        { step: 'Subtract 2 from all THREE parts: -3-2 < x ≤ 7-2.', justification: 'The same operation must apply to every part of a compound inequality.' },
      ], answer: '-5 < x ≤ 5' },
    ],
    knowledgeChecks: [
      { question: 'Solve -2x ≤ 10.', options: ['x ≥ -5', 'x ≤ -5', 'x ≥ 5', 'x ≤ 5'], correctIndex: 0, explanation: 'Divide both sides by -2 and flip the sign: x ≥ -5.', misconceptionId: 'forgets-flip-sign-negative' },
      { question: 'For x < 4 on a number line, which is correct?', options: ['Open circle at 4, shade left', 'Closed circle at 4, shade left', 'Open circle at 4, shade right', 'Closed circle at 4, shade right'], correctIndex: 0, explanation: '"<" excludes 4 (open circle) and means smaller values (shade left).', misconceptionId: 'open-vs-closed-circle-confusion' },
    ],
    confidenceCheckPrompt: 'How confident do you feel flipping the sign for negative multiplication/division, and reading number-line representations?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'solve-basic-inequality', revealSteps: 2, prompt: 'Solve 5x + 1 < 21.', steps: [
        { step: 'Subtract 1 from both sides: 5x < 20.', justification: 'Undo the addition first.' },
        { step: 'Divide both sides by 5 (positive, sign unchanged): x < 4.', justification: 'Isolate x.' },
      ], answer: 'x < 4' },
      { id: 'fp-partial-1', objectiveId: 'flip-sign-negative', revealSteps: 1, prompt: 'Solve -4x ≥ 16.', steps: [
        { step: 'Divide both sides by -4.', justification: 'Isolate x.' },
        { step: 'Flip the sign since dividing by a negative: x ≤ -4.', justification: 'The direction must reverse.' },
      ], answer: 'x ≤ -4' },
      { id: 'fp-independent-1', objectiveId: 'compound-inequality', revealSteps: 0, prompt: 'Solve -1 ≤ x - 3 < 5.', steps: [
        { step: 'Add 3 to all three parts.', justification: 'Apply the same operation to every part.' },
      ], answer: '2 ≤ x < 8' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'solve-basic-inequality', question: 'Solve x + 6 ≤ 9.', options: ['x ≤ 3', 'x ≥ 3', 'x ≤ 15', 'x ≤ -3'], correctIndex: 0, hints: { strategic: 'Undo the "+6".', procedural: 'Subtract 6 from both sides.', workedStep: 'x ≤ 3.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'flip-sign-negative', question: 'Solve -x > 5.', options: ['x < -5', 'x > -5', 'x < 5', 'x > 5'], correctIndex: 0, hints: { strategic: 'You are dividing/multiplying by -1 here — remember the flip rule.', procedural: 'Multiply both sides by -1 and flip the sign.', workedStep: 'x < -5.' }, distractorMisconceptions: { 1: 'forgets-flip-sign-negative' } },
      { id: 'ip-3', objectiveId: 'represent-number-line', question: 'Which number-line description matches x ≤ -2?', options: ['Closed circle at -2, shade left', 'Open circle at -2, shade left', 'Closed circle at -2, shade right', 'Open circle at -2, shade right'], correctIndex: 0, hints: { strategic: 'Does ≤ include the boundary value?', procedural: 'Yes, so use a closed circle. Which direction does ≤ point?', workedStep: 'Smaller values — shade left. Closed circle at -2, shade left.' }, distractorMisconceptions: { 1: 'open-vs-closed-circle-confusion' } },
      { id: 'ip-4', objectiveId: 'compound-inequality', question: 'Solve 2 < x + 5 ≤ 9.', options: ['-3 < x ≤ 4', '-3 < x ≤ 14', '7 < x ≤ 4', '-3 < x ≤ 9'], correctIndex: 0, hints: { strategic: 'Apply the same operation to all three parts.', procedural: 'Subtract 5 from every part.', workedStep: '2-5 < x ≤ 9-5 → -3 < x ≤ 4.' }, distractorMisconceptions: { 1: 'compound-inequality-one-side-only' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'solve-basic-inequality', multiSelect: false, question: 'Solve x - 7 ≥ 1.', options: ['x ≥ 8', 'x ≤ 8', 'x ≥ -6', 'x ≥ 6'], correctIndices: [0], explanation: 'Add 7 to both sides: x ≥ 8.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'solve-basic-inequality', multiSelect: false, question: 'Solve 6x < 30.', options: ['x < 5', 'x > 5', 'x < 36', 'x < 24'], correctIndices: [0], explanation: 'Divide both sides by 6 (positive): x < 5.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'flip-sign-negative', multiSelect: false, question: 'True or false: dividing both sides of an inequality by a positive number requires flipping the sign.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the sign only flips when multiplying/dividing by a NEGATIVE number.', distractorMisconceptions: { 0: 'treats-inequality-like-equation-fully' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'flip-sign-negative', multiSelect: false, question: 'Solve -5x < 25.', options: ['x > -5', 'x < -5', 'x > 5', 'x < 5'], correctIndices: [0], explanation: 'Divide both sides by -5 and flip the sign: x > -5.', distractorMisconceptions: { 1: 'forgets-flip-sign-negative' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'represent-number-line', multiSelect: false, question: 'Which circle/shading matches x > 0?', options: ['Open circle at 0, shade right', 'Closed circle at 0, shade right', 'Open circle at 0, shade left', 'Closed circle at 0, shade left'], correctIndices: [0], explanation: '">" excludes 0 (open circle) and points to larger values (shade right).', distractorMisconceptions: { 1: 'open-vs-closed-circle-confusion' } },
    { id: 'q6', type: 'multi-select', objectiveId: 'represent-number-line', multiSelect: true, question: 'Which of these inequalities would use a CLOSED circle on a number line? (select all that apply)', options: ['x ≥ 3', 'x < 3', 'x ≤ 3', 'x > 3'], correctIndices: [0, 2], explanation: '≥ and ≤ both include the boundary value, so both use a closed circle.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'compound-inequality', multiSelect: false, question: 'Solve -4 < x - 1 < 6.', options: ['-3 < x < 7', '-3 < x < 5', '-5 < x < 7', '-3 < x < 6'], correctIndices: [0], explanation: 'Add 1 to all three parts: -4+1 < x < 6+1 → -3 < x < 7.', distractorMisconceptions: { 1: 'compound-inequality-one-side-only' } },
    { id: 'q8', type: 'decimal-discrimination', objectiveId: 'compound-inequality', multiSelect: false, question: 'Solve -6 ≤ 2x < 10.', options: ['-3 ≤ x < 5', '-3 ≤ x < 10', '-12 ≤ x < 20', '-6 ≤ x < 5'], correctIndices: [0], explanation: 'Divide all three parts by 2 (positive, sign unchanged): -6÷2 ≤ x < 10÷2 → -3 ≤ x < 5.', distractorMisconceptions: { 3: 'compound-inequality-one-side-only' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'flip-sign-negative',
      analogy: 'Picture the inequality sign as an arrow pointing along a number line. Multiplying or dividing by a negative number is like looking at that same number line in a mirror — left becomes right, so the arrow has to point the other way to still mean the same thing.',
      explanation: 'Before finalising an answer, always ask: "Did I multiply or divide both sides by a negative number at any point?" If yes, flip the inequality sign at that exact step — everything else about solving stays the same as an equation.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Solve 8 - x > 3.', steps: [
          { step: 'Subtract 8 from both sides: -x > -5.', justification: 'Isolate the x-term.' },
          { step: 'Divide both sides by -1 (negative) — flip the sign: x < 5.', justification: 'This division by a negative requires the flip.' },
        ], answer: 'x < 5' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'flip-sign-negative', question: 'Solve -6x ≥ 18.', options: ['x ≤ -3', 'x ≥ -3', 'x ≤ 3', 'x ≥ 3'], correctIndex: 0, hints: { strategic: 'Are you dividing by a negative here?', procedural: 'Yes, -6 is negative, so flip the sign after dividing.', workedStep: 'x ≤ -3.' }, distractorMisconceptions: { 1: 'forgets-flip-sign-negative' } },
        { id: 'rem-p2', objectiveId: 'flip-sign-negative', question: 'Solve 5 - 2x < 1.', options: ['x > 2', 'x < 2', 'x > -2', 'x < -2'], correctIndex: 0, hints: { strategic: 'Isolate the x-term first, then check the sign of what you divide by.', procedural: 'Subtract 5: -2x < -4.', workedStep: 'Divide by -2 and flip: x > 2.' }, distractorMisconceptions: { 1: 'forgets-flip-sign-negative' } },
        { id: 'rem-p3', objectiveId: 'flip-sign-negative', question: 'Solve -x/3 ≤ 2.', options: ['x ≥ -6', 'x ≤ -6', 'x ≥ 6', 'x ≤ 6'], correctIndex: 0, hints: { strategic: 'Multiply both sides by -3 to clear the fraction.', procedural: 'This multiplies by a negative, so flip the sign.', workedStep: 'x ≥ -6.' }, distractorMisconceptions: { 1: 'forgets-flip-sign-negative' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the one rule that makes inequalities different from equations?', type: 'multiple-choice', options: ['Flip the sign when multiplying/dividing by a negative', 'You can\'t add the same number to both sides', 'The answer is always a single number', 'There is no difference'] },
    { id: 'r2', prompt: 'How confident do you feel solving and representing linear inequalities now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you double-check every time you solve an inequality involving a negative number?', type: 'free-text' },
  ],
};
