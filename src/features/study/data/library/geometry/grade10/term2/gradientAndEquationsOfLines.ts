// ── Geometry, Term 2, Topic 2: Gradient and Equations of Lines ───────────────
// Builds on Topic 1 (distance/midpoint) and reuses the Algebra Term 2 linear
// function knowledge (y=mx+c), extended to parallel/perpendicular conditions.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'gradient-formula-order-error-geo',
    label: 'Mixing up the order of coordinates when calculating gradient',
    errorType: 'You calculated the gradient using coordinates in an inconsistent order between the numerator and denominator.',
    principle: 'Gradient = (y2-y1)/(x2-x1) — once you decide which point is "point 1" and which is "point 2", use that SAME order for both the y-difference and the x-difference.',
    correctStep: 'For (1,4) and (5,12): gradient = (12-4)/(5-1) = 8/4 = 2, not (4-12)/(5-1).',
  },
  {
    id: 'perpendicular-condition-error',
    label: 'Using "equal gradients" for perpendicular lines, or "negative reciprocal" for parallel lines',
    errorType: 'You swapped the conditions for parallel and perpendicular lines.',
    principle: 'PARALLEL lines have EQUAL gradients (m1=m2). PERPENDICULAR lines have gradients that are NEGATIVE RECIPROCALS of each other (m1×m2=-1, i.e. m2=-1/m1).',
    correctStep: 'A line with gradient 2 is parallel to another line with gradient 2, but perpendicular to a line with gradient -1/2.',
  },
  {
    id: 'reciprocal-without-negative',
    label: 'Finding the reciprocal for a perpendicular gradient but forgetting to negate it',
    errorType: 'You flipped the gradient (found the reciprocal) but kept the same sign, instead of also negating it.',
    principle: 'The perpendicular gradient condition needs BOTH steps: flip the fraction (reciprocal) AND change the sign (negate). Missing either step gives the wrong answer.',
    correctStep: 'For a gradient of 3/4, the perpendicular gradient is -4/3 — flipped AND negated, not just flipped to 4/3.',
  },
  {
    id: 'point-not-verified-on-line',
    label: 'Not checking that a derived line equation actually passes through the given point(s)',
    errorType: 'You found an equation for a line but never verified it against the original point(s) it was supposed to pass through.',
    principle: 'After finding a line\'s equation, substitute the original given point(s) back in as a check — if the equation doesn\'t produce a true statement, there\'s an error somewhere.',
    correctStep: 'For a line through (2,7) with equation y=3x+1: check x=2 gives y=3(2)+1=7 ✓ — confirms the equation is correct.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'geometry',
  grade: 10,
  term: 2,
  topicId: 'gradient-and-equations-of-lines',
  topicName: 'Gradient and Equations of Lines',
  prerequisites: [
    'Distance and midpoint (this term, Topic 1)',
    'Linear functions, y=mx+c (Algebra Term 2)',
  ],
  objectives: [
    { id: 'calculate-gradient-two-points', text: 'Calculate the gradient of a line through two given points.' },
    { id: 'find-line-equation', text: 'Find the equation of a line given a point and gradient, or two points.' },
    { id: 'apply-parallel-condition', text: 'Determine whether two lines are parallel using their gradients.' },
    { id: 'apply-perpendicular-condition', text: 'Determine whether two lines are perpendicular using their gradients.' },
  ],
  estimatedMinutes: [20, 30],
};

export const gradientAndEquationsOfLines: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How do you write the equation of a line if you only know two points on it?',
  goalSettingPrompt:
    'You already know how to read a gradient and y-intercept off a line\'s equation. This lesson works backwards: given points on a line, find its full equation — and use gradients to determine whether two lines are parallel or perpendicular.',

  activate: {
    connectPrompt: 'You already know the form y=mx+c from Algebra. Let\'s check that before working backwards to find equations from points.',
    diagnosticQuestions: [
      { question: 'For y=4x-3, what is the gradient?', options: ['4', '-3', '3', '-4'], correctIndex: 0, explanation: 'The coefficient of x is the gradient.' },
      { question: 'For y=4x-3, what is the y-intercept?', options: ['-3', '4', '3', '0'], correctIndex: 0, explanation: 'The constant term is the y-intercept.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'The gradient between two points (x1,y1) and (x2,y2) is m = (y2-y1)/(x2-x1) — keep the SAME point order in both the numerator and denominator. Once you know the gradient AND one point, you can find the line\'s full equation by substituting into y=mx+c and solving for c. Always verify your final equation by checking it against the original point(s).',
    workedExamples: [
      { id: 'wx-gradient-then-equation', prompt: 'Find the equation of the line through (2,7) with gradient 3.', steps: [
        { step: 'Substitute the point and gradient into y=mx+c: 7 = 3(2) + c.', justification: 'Use the known point to solve for c.' },
        { step: '7 = 6+c, so c = 1.', justification: 'Solve the resulting equation.' },
        { step: 'Equation: y = 3x + 1. Check: at x=2, y=3(2)+1=7 ✓', justification: 'Verify against the original point.' },
      ], answer: 'y = 3x + 1', diagram: {
        points: [{ id: 'A', x: 40, y: 100, label: '(2,7)' }, { id: 'B', x: 100, y: 40, label: 'line' }],
        segments: [{ from: 'A', to: 'B' }],
      } },
      { id: 'wx-equation-from-two-points', prompt: 'Find the equation of the line through (1,5) and (3,13).', steps: [
        { step: 'Gradient: m = (13-5)/(3-1) = 8/2 = 4.', justification: 'Apply the gradient formula first.' },
        { step: 'Substitute point (1,5): 5 = 4(1)+c, so c=1.', justification: 'Use either point to solve for c.' },
      ], answer: 'y = 4x + 1' },
    ],
    knowledgeChecks: [
      { question: 'Find the gradient through (3,2) and (7,14).', options: ['3', '4', '1/3', '12'], correctIndex: 0, explanation: '(14-2)/(7-3)=12/4=3.', misconceptionId: 'gradient-formula-order-error-geo' },
      { question: 'A line through (4,10) has gradient 2. Find its equation.', options: ['y=2x+2', 'y=2x+10', 'y=2x-2', 'y=4x+2'], correctIndex: 0, explanation: '10=2(4)+c → c=2. y=2x+2.', misconceptionId: 'point-not-verified-on-line' },
    ],
    confidenceCheckPrompt: 'How confident do you feel finding a line\'s equation from a point and gradient, or from two points?',
  },

  demonstrateChunk2: {
    explanation:
      'PARALLEL lines have EQUAL gradients (m1=m2) — they never meet. PERPENDICULAR lines meet at a right angle, and their gradients are NEGATIVE RECIPROCALS: m1×m2=-1, meaning you flip the fraction AND change the sign. Missing either step (only flipping, or only negating) gives the wrong perpendicular gradient.',
    workedExamples: [
      { id: 'wx-parallel-check', prompt: 'Are the lines y=5x+2 and y=5x-7 parallel?', steps: [
        { step: 'Both have gradient 5.', justification: 'Compare the coefficients of x.' },
        { step: 'Equal gradients means the lines are parallel.', justification: 'Apply the parallel condition.' },
      ], answer: 'Yes, parallel — both have gradient 5' },
      { id: 'wx-perpendicular-gradient', prompt: 'Find the gradient of a line perpendicular to one with gradient 2/3.', steps: [
        { step: 'Flip the fraction: 3/2.', justification: 'Take the reciprocal.' },
        { step: 'Negate the sign: -3/2.', justification: 'The perpendicular gradient must also be negated, not just flipped.' },
      ], answer: 'Perpendicular gradient = -3/2' },
    ],
    knowledgeChecks: [
      { question: 'A line has gradient -4. What gradient would a PARALLEL line have?', options: ['-4', '4', '1/4', '-1/4'], correctIndex: 0, explanation: 'Parallel lines share the exact same gradient.', misconceptionId: 'perpendicular-condition-error' },
      { question: 'A line has gradient 5. What gradient would a PERPENDICULAR line have?', options: ['-1/5', '1/5', '-5', '5'], correctIndex: 0, explanation: 'Flip (1/5) and negate (-1/5).', misconceptionId: 'reciprocal-without-negative' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying the parallel and perpendicular gradient conditions?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'calculate-gradient-two-points', revealSteps: 1, prompt: 'Find the gradient through (0,3) and (4,11).', steps: [
        { step: 'm = (11-3)/(4-0) = 8/4 = 2.', justification: 'Apply the gradient formula.' },
      ], answer: 'm = 2' },
      { id: 'fp-partial-1', objectiveId: 'find-line-equation', revealSteps: 1, prompt: 'Find the equation of the line through (1,6) with gradient -2.', steps: [
        { step: '6 = -2(1)+c, so c=8.', justification: 'Substitute and solve for c.' },
        { step: 'y = -2x+8.', justification: 'Write the final equation.' },
      ], answer: 'y = -2x + 8' },
      { id: 'fp-independent-1', objectiveId: 'apply-perpendicular-condition', revealSteps: 0, prompt: 'Are y=4x+1 and y=-0.25x+9 perpendicular?', steps: [
        { step: '4 × -0.25 = -1, so yes, perpendicular.', justification: 'Check if the product of gradients is -1.' },
      ], answer: 'Yes, perpendicular' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'calculate-gradient-two-points', question: 'Find the gradient through (2,5) and (8,17).', options: ['2', '4', '1/2', '12'], correctIndex: 0, hints: { strategic: 'm=(y2-y1)/(x2-x1).', procedural: '(17-5)/(8-2)', workedStep: '=12/6=2.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'find-line-equation', question: 'Find the equation of the line through (0,4) and (2,10).', options: ['y=3x+4', 'y=3x+10', 'y=4x+3', 'y=6x+4'], correctIndex: 0, hints: { strategic: 'Find gradient, then use a point to find c.', procedural: 'm=(10-4)/(2-0)=3. c=4 (y-intercept given directly since x=0).', workedStep: 'y=3x+4.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'apply-parallel-condition', question: 'Is a line with gradient 7 parallel to one with gradient -1/7?', options: ['No — those gradients indicate perpendicular, not parallel', 'Yes', 'Cannot be determined', 'They are the same line'], correctIndex: 0, hints: { strategic: 'Parallel needs EQUAL gradients.', procedural: '7 ≠ -1/7, and 7×(-1/7)=-1 actually indicates perpendicular.', workedStep: 'Not parallel — perpendicular instead.' }, distractorMisconceptions: { 1: 'perpendicular-condition-error' } },
      { id: 'ip-4', objectiveId: 'apply-perpendicular-condition', question: 'Find the perpendicular gradient to -5.', options: ['1/5', '-1/5', '5', '-5'], correctIndex: 0, hints: { strategic: 'Flip and negate.', procedural: 'Flip -5 (as -5/1) to -1/5, then negate.', workedStep: '1/5.' }, distractorMisconceptions: { 1: 'reciprocal-without-negative' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'calculate-gradient-two-points', multiSelect: false, question: 'Find the gradient through (1,3) and (4,15).', options: ['4', '12', '1/4', '3'], correctIndices: [0], explanation: '(15-3)/(4-1)=12/3=4.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'find-line-equation', multiSelect: false, question: 'Find the equation of the line through (3,10) with gradient 2.', options: ['y=2x+4', 'y=2x+10', 'y=3x+4', 'y=2x-4'], correctIndices: [0], explanation: '10=2(3)+c → c=4. y=2x+4.', distractorMisconceptions: { 1: 'point-not-verified-on-line' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'find-line-equation', multiSelect: false, question: 'Find the equation of the line through (2,1) and (5,10).', options: ['y=3x-5', 'y=3x+5', 'y=5x-3', 'y=3x-2'], correctIndices: [0], explanation: 'm=(10-1)/(5-2)=3. 1=3(2)+c → c=-5. y=3x-5.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'apply-parallel-condition', multiSelect: false, question: 'True or false: y=6x+1 and y=6x-9 are parallel.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — both have gradient 6.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'apply-perpendicular-condition', multiSelect: false, question: 'True or false: lines with gradients 3 and 3 are perpendicular.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — equal gradients mean parallel, not perpendicular.', distractorMisconceptions: { 0: 'perpendicular-condition-error' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'apply-perpendicular-condition', multiSelect: false, question: 'Find the perpendicular gradient to 4/5.', options: ['-5/4', '5/4', '-4/5', '4/5'], correctIndices: [0], explanation: 'Flip to 5/4, negate to -5/4.', distractorMisconceptions: { 1: 'reciprocal-without-negative' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'apply-perpendicular-condition', multiSelect: false, question: 'Are y=2x+3 and y=-0.5x+1 perpendicular?', options: ['Yes, 2×(-0.5)=-1', 'No', 'Cannot be determined', 'Only if they intersect'], correctIndices: [0], explanation: '2×(-0.5)=-1, confirming perpendicularity.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'find-line-equation', multiSelect: true, question: 'To find the equation of a line through two points, which steps are needed? (select all that apply)', options: ['Calculate the gradient using both points', 'Substitute one point into y=mx+c to solve for c', 'Verify the equation against the original point(s)', 'Assume c=0 always'], correctIndices: [0, 1, 2], explanation: 'All three are genuine steps; c should never be assumed to be 0.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-perpendicular-condition',
      analogy: 'Think of finding a perpendicular gradient as a two-part instruction you must always do both parts of: "flip it, THEN flip its sign" — like turning a key and then pulling it out; skipping either half leaves the job incomplete.',
      explanation: 'For any gradient m, the perpendicular gradient is always -1/m: write m as a fraction, flip the fraction (reciprocal), then change its sign (negate).',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Find the perpendicular gradient to 2.', steps: [
          { step: 'Write 2 as a fraction: 2/1.', justification: 'Any number can be written as a fraction over 1.' },
          { step: 'Flip: 1/2.', justification: 'Take the reciprocal.' },
          { step: 'Negate: -1/2.', justification: 'Change the sign — this step is essential, not optional.' },
        ], answer: 'Perpendicular gradient = -1/2' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-perpendicular-condition', question: 'Find the perpendicular gradient to 3.', options: ['-1/3', '1/3', '-3', '3'], correctIndex: 0, hints: { strategic: 'Flip, then negate.', procedural: '3=3/1, flip to 1/3.', workedStep: 'Negate: -1/3.' }, distractorMisconceptions: { 1: 'reciprocal-without-negative' } },
        { id: 'rem-p2', objectiveId: 'apply-perpendicular-condition', question: 'Find the perpendicular gradient to -2/3.', options: ['3/2', '-3/2', '2/3', '-2/3'], correctIndex: 0, hints: { strategic: 'Flip, then negate.', procedural: 'Flip -2/3 to -3/2.', workedStep: 'Negate: 3/2.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'apply-perpendicular-condition', question: 'Find the perpendicular gradient to 1/4.', options: ['-4', '4', '-1/4', '1/4'], correctIndex: 0, hints: { strategic: 'Flip, then negate.', procedural: 'Flip 1/4 to 4.', workedStep: 'Negate: -4.' }, distractorMisconceptions: { 1: 'reciprocal-without-negative' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What are the two separate steps for finding a perpendicular gradient?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel finding line equations and applying parallel/perpendicular conditions now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you always do after finding a line\'s equation?', type: 'multiple-choice', options: ['Check it against the original point(s)', 'Nothing further', 'Assume it\'s correct', 'Redraw the whole graph'] },
  ],
};
