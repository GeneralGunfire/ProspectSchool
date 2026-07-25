// ── Term 2, Topic 3: Linear Functions ─────────────────────────────────────────
// First graph-based topic — uses the new FunctionGraph component (see
// components/lesson/FunctionGraph.tsx). Per
// .planning/research/LIBRARY_ALGEBRA_TERM2_RESEARCH.md Part B, worked
// examples narrate the "read the graph" decision sequence, not just show a
// picture, and a parameter slider is used at least once to let students see
// gradient/intercept effects directly rather than only describing them.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'gradient-vs-intercept-confused',
    label: 'Confusing what the gradient (m) and y-intercept (c) each control',
    errorType: 'You mixed up which parameter controls the line\'s steepness versus where it crosses the y-axis.',
    principle: 'In y = mx + c, m is the GRADIENT (steepness/slope — how fast y changes as x increases), and c is the Y-INTERCEPT (where the line crosses the y-axis, i.e. the value of y when x=0). They control completely different visual features.',
    correctStep: 'y = 3x + 5: gradient is 3 (steep, rising), y-intercept is 5 (crosses the y-axis at (0,5)).',
  },
  {
    id: 'y-intercept-mistaken-for-x-intercept',
    label: 'Confusing the y-intercept with the x-intercept',
    errorType: 'You found or read off the wrong intercept — mixing up where the line crosses the x-axis versus the y-axis.',
    principle: 'The Y-intercept is where the graph crosses the y-axis (found by setting x=0). The X-intercept is where the graph crosses the x-axis (found by setting y=0). These are usually different points.',
    correctStep: 'For y = 2x - 6: y-intercept is at x=0: y=-6, so (0,-6). x-intercept is at y=0: 0=2x-6, x=3, so (3,0).',
  },
  {
    id: 'negative-gradient-direction-confused',
    label: 'Misreading which direction a negative gradient slopes',
    errorType: 'You thought a negative gradient means the line rises from left to right, or a positive gradient means it falls.',
    principle: 'A POSITIVE gradient means the line rises as you move left to right. A NEGATIVE gradient means the line falls as you move left to right.',
    correctStep: 'y = -2x + 3 has a negative gradient, so the line falls from left to right.',
  },
  {
    id: 'gradient-formula-order-error',
    label: 'Mixing up the order of coordinates when calculating gradient from two points',
    errorType: 'You calculated the gradient using coordinates in an inconsistent order between the numerator and denominator.',
    principle: 'Gradient = (y₂-y₁)/(x₂-x₁) — once you decide which point is "point 1" and which is "point 2", you MUST use that same order for both the y-difference and the x-difference.',
    correctStep: 'For (2,5) and (6,13): gradient = (13-5)/(6-2) = 8/4 = 2, NOT (5-13)/(6-2).',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 2,
  topicId: 'linear-functions',
  topicName: 'Linear Functions',
  prerequisites: [
    'Solving linear equations (Term 1)',
    'Plotting points on a Cartesian plane',
  ],
  objectives: [
    { id: 'identify-gradient-intercept', text: 'Identify the gradient and y-intercept from a linear equation in the form y = mx + c.' },
    { id: 'sketch-linear-graph', text: 'Sketch a linear graph given its equation, using the intercepts.' },
    { id: 'calculate-gradient', text: 'Calculate the gradient of a line given two points on it.' },
    { id: 'interpret-linear-graph', text: 'Read and interpret information (intercepts, gradient sign) directly from a linear graph.' },
  ],
  estimatedMinutes: [20, 30],
};

export const linearFunctions: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What do the numbers in an equation actually control on the graph?',
  goalSettingPrompt:
    'Every straight-line graph comes from an equation of the form y = mx + c — and each of those two letters controls a specific, separate visual feature. By the end of this lesson you\'ll be able to sketch a line from its equation, and read an equation\'s features straight off a graph.',

  activate: {
    connectPrompt: 'You already know how to solve linear equations for a single value of x. Now we look at ALL the (x,y) pairs that satisfy an equation at once — that\'s what a graph shows.',
    diagnosticQuestions: [
      { question: 'If y = 2x + 1, what is y when x = 3?', options: ['7', '6', '5', '8'], correctIndex: 0, explanation: 'y = 2(3) + 1 = 7.' },
      { question: 'On a Cartesian plane, which axis is vertical?', options: ['The y-axis', 'The x-axis', 'Neither', 'Both'], correctIndex: 0, explanation: 'The y-axis is vertical; the x-axis is horizontal.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A linear function has the form y = mx + c. The GRADIENT (m) controls the line\'s steepness and direction: positive means rising left-to-right, negative means falling, and a bigger |m| means steeper. The Y-INTERCEPT (c) is the point where the line crosses the y-axis — it\'s the value of y when x=0. These two numbers control completely separate visual features, and changing one doesn\'t affect the other.',
    workedExamples: [
      { id: 'wx-identify-m-c', prompt: 'For y = 3x - 4, identify the gradient and y-intercept, and describe the line\'s general shape.', steps: [
        { step: 'Compare to y = mx + c: m = 3, c = -4.', justification: 'Match the equation to the standard form directly.' },
        { step: 'Since m = 3 is positive, the line rises from left to right.', justification: 'Positive gradient means increasing.' },
        { step: 'Since c = -4, the line crosses the y-axis at (0, -4).', justification: 'The y-intercept is the value of y when x=0.' },
      ], answer: 'Gradient = 3 (rising), y-intercept = -4, crossing at (0,-4)', graph: {
        fn: (x: number) => 3 * x - 4,
        domain: [-4, 4], yDomain: [-16, 12],
        features: [{ x: 0, y: -4, label: '(0,-4)' }],
      } },
      { id: 'wx-negative-gradient', prompt: 'For y = -2x + 5, describe the line.', steps: [
        { step: 'm = -2 (negative), c = 5.', justification: 'Match to standard form.' },
        { step: 'Since m is negative, the line falls from left to right.', justification: 'Negative gradient means decreasing.' },
      ], answer: 'Gradient = -2 (falling), y-intercept = 5', graph: {
        fn: (x: number) => -2 * x + 5,
        domain: [-4, 4], yDomain: [-3, 13],
        features: [{ x: 0, y: 5, label: '(0,5)' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'For y = 5x + 2, what does the 5 control?', options: ['The gradient (steepness)', 'The y-intercept', 'The x-intercept', 'Nothing visible on the graph'], correctIndex: 0, explanation: '5 is the coefficient of x, matching m in y=mx+c — the gradient.', misconceptionId: 'gradient-vs-intercept-confused' },
      { question: 'A line has a negative gradient. What does it look like?', options: ['It falls from left to right', 'It rises from left to right', 'It is horizontal', 'It is vertical'], correctIndex: 0, explanation: 'A negative gradient means y decreases as x increases — the line falls.', misconceptionId: 'negative-gradient-direction-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying the gradient and y-intercept from an equation?',
  },

  demonstrateChunk2: {
    explanation:
      'To sketch a line, the easiest method is plotting its two intercepts: the Y-INTERCEPT (set x=0, giving c directly) and the X-INTERCEPT (set y=0, and solve for x), then draw a straight line through both points. To find the gradient between two known points (x₁,y₁) and (x₂,y₂), use gradient = (y₂-y₁)/(x₂-x₁) — keep the SAME order in the numerator and denominator once you\'ve chosen which point is "1" and which is "2". Use the slider below to see how changing the gradient changes the line\'s steepness and direction, while the y-intercept stays fixed.',
    workedExamples: [
      { id: 'wx-sketch-intercepts', prompt: 'Sketch y = 2x - 6 using its intercepts.', steps: [
        { step: 'Y-intercept: set x=0. y = 2(0)-6 = -6, so (0,-6).', justification: 'The y-intercept is read directly from c.' },
        { step: 'X-intercept: set y=0. 0 = 2x-6, so x=3, giving (3,0).', justification: 'Solve the resulting linear equation for x.' },
        { step: 'Draw a straight line through (0,-6) and (3,0).', justification: 'Two points are enough to define a unique straight line.' },
      ], answer: 'Line through (0,-6) and (3,0)', graph: {
        fn: (x: number) => 2 * x - 6,
        domain: [-2, 6], yDomain: [-10, 6],
        features: [{ x: 0, y: -6, label: '(0,-6)' }, { x: 3, y: 0, label: '(3,0)' }],
      } },
      { id: 'wx-gradient-from-points', prompt: 'Find the gradient of the line through (1, 4) and (5, 12).', steps: [
        { step: 'Let (x₁,y₁)=(1,4) and (x₂,y₂)=(5,12).', justification: 'Label the two points consistently.' },
        { step: 'gradient = (y₂-y₁)/(x₂-x₁) = (12-4)/(5-1) = 8/4 = 2.', justification: 'Apply the gradient formula, keeping the same point order top and bottom.' },
      ], answer: 'Gradient = 2' },
      { id: 'wx-explore-gradient', prompt: 'Explore: how does changing the gradient affect the line y = mx + 2?', steps: [
        { step: 'Move the slider to change m and observe the line.', justification: 'A larger |m| makes the line steeper; the sign controls rising vs falling.' },
        { step: 'Notice the y-intercept (0,2) never moves, since only m is changing.', justification: 'm and c control independent features.' },
      ], answer: 'The line pivots around the fixed y-intercept as m changes.', graph: {
        fn: (x: number, m = 1) => m * x + 2,
        domain: [-5, 5], yDomain: [-8, 12],
        features: [{ x: 0, y: 2, label: '(0,2)' }],
        slider: { label: 'Gradient (m)', min: -3, max: 3, step: 0.5, initial: 1 },
      } },
    ],
    knowledgeChecks: [
      { question: 'For y = 4x - 8, what is the x-intercept?', options: ['(2, 0)', '(0, -8)', '(0, 4)', '(-2, 0)'], correctIndex: 0, explanation: 'Set y=0: 0=4x-8, so x=2, giving (2,0).', misconceptionId: 'y-intercept-mistaken-for-x-intercept' },
      { question: 'Find the gradient through (3,10) and (7,2).', options: ['-2', '2', '-4', '4'], correctIndex: 0, explanation: '(2-10)/(7-3) = -8/4 = -2.', misconceptionId: 'gradient-formula-order-error' },
    ],
    confidenceCheckPrompt: 'How confident do you feel sketching a line from its intercepts and calculating gradient from two points?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'identify-gradient-intercept', revealSteps: 2, prompt: 'For y = -x + 7, identify the gradient and y-intercept.', steps: [
        { step: 'Compare to y=mx+c: m=-1, c=7.', justification: 'Match to standard form (note: -x means m=-1).' },
        { step: 'Gradient -1 means the line falls gently; y-intercept 7 means it crosses at (0,7).', justification: 'Interpret both values.' },
      ], answer: 'Gradient = -1, y-intercept = 7' },
      { id: 'fp-partial-1', objectiveId: 'sketch-linear-graph', revealSteps: 1, prompt: 'Sketch y = 3x - 9 using its intercepts.', steps: [
        { step: 'Y-intercept: x=0 → y=-9, so (0,-9).', justification: 'Set x=0.' },
        { step: 'X-intercept: y=0 → 0=3x-9 → x=3, so (3,0).', justification: 'Set y=0 and solve.' },
      ], answer: 'Line through (0,-9) and (3,0)', graph: {
        fn: (x: number) => 3 * x - 9,
        domain: [-1, 5], yDomain: [-12, 6],
        features: [{ x: 0, y: -9, label: '(0,-9)' }, { x: 3, y: 0, label: '(3,0)' }],
      } },
      { id: 'fp-independent-1', objectiveId: 'calculate-gradient', revealSteps: 0, prompt: 'Find the gradient through (-2, 3) and (4, 15).', steps: [
        { step: 'gradient = (15-3)/(4-(-2)) = 12/6 = 2.', justification: 'Apply the formula consistently.' },
      ], answer: 'Gradient = 2' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'identify-gradient-intercept', question: 'For y = -5x + 2, what is the gradient?', options: ['-5', '5', '2', '-2'], correctIndex: 0, hints: { strategic: 'Match to y=mx+c.', procedural: 'The coefficient of x is m.', workedStep: 'm = -5.' }, distractorMisconceptions: { 2: 'gradient-vs-intercept-confused' } },
      { id: 'ip-2', objectiveId: 'sketch-linear-graph', question: 'What are the intercepts of y = 4x - 12?', options: ['(0,-12) and (3,0)', '(0,-12) and (-3,0)', '(0,12) and (3,0)', '(0,-3) and (12,0)'], correctIndex: 0, hints: { strategic: 'Find y-intercept (x=0) and x-intercept (y=0) separately.', procedural: 'x=0: y=-12. y=0: 4x=12, x=3.', workedStep: '(0,-12) and (3,0).' }, distractorMisconceptions: { 1: 'y-intercept-mistaken-for-x-intercept' } },
      { id: 'ip-3', objectiveId: 'calculate-gradient', question: 'Find the gradient through (0,1) and (4,9).', options: ['2', '8', '0.5', '4'], correctIndex: 0, hints: { strategic: 'Apply gradient = (y2-y1)/(x2-x1).', procedural: '(9-1)/(4-0) = 8/4.', workedStep: '= 2.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'interpret-linear-graph', question: 'A line on a graph falls from left to right and crosses the y-axis above the origin. Which equation could it be?', options: ['y = -2x + 3', 'y = 2x + 3', 'y = -2x - 3', 'y = 2x - 3'], correctIndex: 0, hints: { strategic: 'Falling means negative gradient; crossing above origin means positive c.', procedural: 'Need m<0 and c>0.', workedStep: 'y = -2x + 3 fits both.' }, distractorMisconceptions: { 1: 'negative-gradient-direction-confused' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'identify-gradient-intercept', multiSelect: false, question: 'For y = 6x - 1, what is the y-intercept?', options: ['-1', '6', '1', '0'], correctIndices: [0], explanation: 'c = -1, so the y-intercept is -1.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'identify-gradient-intercept', multiSelect: false, question: 'True or false: in y = mx + c, m controls where the line crosses the y-axis.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — m controls the gradient (steepness); c controls the y-intercept.', distractorMisconceptions: { 0: 'gradient-vs-intercept-confused' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'sketch-linear-graph', multiSelect: false, question: 'What is the x-intercept of y = 5x - 20?', options: ['(4, 0)', '(0, -20)', '(-4, 0)', '(20, 0)'], correctIndices: [0], explanation: 'Set y=0: 5x=20, x=4.', distractorMisconceptions: { 1: 'y-intercept-mistaken-for-x-intercept' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'calculate-gradient', multiSelect: false, question: 'Find the gradient through (2,3) and (5,15).', options: ['4', '0.25', '-4', '12'], correctIndices: [0], explanation: '(15-3)/(5-2) = 12/3 = 4.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'calculate-gradient', multiSelect: false, question: 'Find the gradient through (-1, 6) and (3, -2).', options: ['-2', '2', '-8', '0.5'], correctIndices: [0], explanation: '(-2-6)/(3-(-1)) = -8/4 = -2.', distractorMisconceptions: { 1: 'gradient-formula-order-error' } },
    { id: 'q6', type: 'true-false', objectiveId: 'interpret-linear-graph', multiSelect: false, question: 'True or false: a line with a positive gradient rises from left to right.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — positive gradient means y increases as x increases.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'interpret-linear-graph', multiSelect: false, question: 'A graph shows a line crossing the y-axis at (0,-3) and rising steeply. Which equation matches best?', options: ['y = 4x - 3', 'y = -4x - 3', 'y = 0.5x - 3', 'y = 4x + 3'], correctIndices: [0], explanation: 'Rising steeply means a large positive gradient; crossing at (0,-3) means c=-3.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-gradient-intercept', multiSelect: true, question: 'Which of these lines have a negative gradient? (select all that apply)', options: ['y = -3x + 1', 'y = 2x - 5', 'y = -x - 4', 'y = 7x'], correctIndices: [0, 2], explanation: 'y=-3x+1 (m=-3) and y=-x-4 (m=-1) both have negative gradients.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'sketch-linear-graph',
      analogy: 'Think of the y-intercept as your "starting point" (where the line begins on the y-axis), and the x-intercept as the "landing point" (where it touches the ground, the x-axis). Two clear points are always enough to draw one exact straight line between them.',
      explanation: 'For any linear equation, find the y-intercept by setting x=0, and the x-intercept by setting y=0 and solving. Plot both points, then draw a straight line through them.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Sketch y = -2x + 8 using its intercepts.', steps: [
          { step: 'Y-intercept: x=0 → y=8, so (0,8).', justification: 'Set x=0.' },
          { step: 'X-intercept: y=0 → 0=-2x+8 → x=4, so (4,0).', justification: 'Set y=0 and solve.' },
        ], answer: 'Line through (0,8) and (4,0)', graph: {
          fn: (x: number) => -2 * x + 8,
          domain: [-1, 6], yDomain: [-2, 10],
          features: [{ x: 0, y: 8, label: '(0,8)' }, { x: 4, y: 0, label: '(4,0)' }],
        } },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'sketch-linear-graph', question: 'What are the intercepts of y = x - 5?', options: ['(0,-5) and (5,0)', '(0,5) and (-5,0)', '(0,-5) and (-5,0)', '(5,0) and (-5,0)'], correctIndex: 0, hints: { strategic: 'Set x=0 first, then y=0.', procedural: 'x=0: y=-5. y=0: x=5.', workedStep: '(0,-5) and (5,0).' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'sketch-linear-graph', question: 'What are the intercepts of y = -3x + 9?', options: ['(0,9) and (3,0)', '(0,-9) and (3,0)', '(0,9) and (-3,0)', '(9,0) and (3,0)'], correctIndex: 0, hints: { strategic: 'Set x=0 first, then y=0.', procedural: 'x=0: y=9. y=0: -3x=-9, x=3.', workedStep: '(0,9) and (3,0).' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'sketch-linear-graph', question: 'What are the intercepts of y = 2x + 10?', options: ['(0,10) and (-5,0)', '(0,10) and (5,0)', '(0,-10) and (-5,0)', '(10,0) and (5,0)'], correctIndex: 0, hints: { strategic: 'Set x=0 first, then y=0.', procedural: 'x=0: y=10. y=0: 2x=-10, x=-5.', workedStep: '(0,10) and (-5,0).' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Did exploring the gradient slider help you understand what m does?', type: 'multiple-choice', options: ['Yes, a lot', 'A little', 'Not really', 'I didn\'t need it'] },
    { id: 'r2', prompt: 'How confident do you feel sketching and reading linear graphs now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is one thing you\'ll always check first when sketching a line?', type: 'free-text' },
  ],
};
