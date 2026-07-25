// ── Term 2, Topic 4: Quadratic Functions ──────────────────────────────────────
// Builds on Term 1's factorisation/quadratic-equation solving (for finding
// x-intercepts) and T2.3's intercept-based sketching approach.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'sign-of-a-confused',
    label: 'Confusing which sign of "a" opens the parabola up vs. down',
    errorType: 'You mixed up whether a positive or negative leading coefficient makes the parabola open upward or downward.',
    principle: 'In y = ax² + bx + c, if a > 0 the parabola opens UPWARD (like a smile, with a minimum turning point). If a < 0, it opens DOWNWARD (like a frown, with a maximum turning point).',
    correctStep: 'y = -2x² + 3 opens downward (a=-2 is negative), with a maximum turning point.',
  },
  {
    id: 'axis-of-symmetry-wrong-formula',
    label: 'Using the wrong formula (or forgetting it) for the axis of symmetry',
    errorType: 'You calculated the axis of symmetry incorrectly, or tried to guess it from the graph shape alone.',
    principle: 'For y = ax² + bx + c, the axis of symmetry is the vertical line x = -b/(2a). This always passes exactly through the turning point.',
    correctStep: 'For y = x² - 6x + 5: a=1, b=-6, so axis of symmetry is x = -(-6)/(2×1) = 3.',
  },
  {
    id: 'turning-point-mistaken-for-intercept',
    label: 'Confusing the turning point with an x-intercept',
    errorType: 'You treated the turning point (vertex) as if it were one of the x-intercepts, or vice versa.',
    principle: 'The TURNING POINT is the single highest or lowest point of the parabola (where it changes direction) — it usually is NOT on the x-axis. The X-INTERCEPTS are where the graph crosses y=0, and there can be zero, one, or two of them.',
    correctStep: 'y = (x-2)(x-6) has x-intercepts at x=2 and x=6, but its turning point (the minimum) is at x=4, exactly halfway between them — not at either intercept.',
  },
  {
    id: 'skip-factorise-for-intercepts',
    label: 'Not using factorisation to find x-intercepts',
    errorType: 'You tried to guess or estimate the x-intercepts instead of factorising the equation.',
    principle: 'To find the exact x-intercepts of y = ax² + bx + c, set y = 0 and factorise (or otherwise solve) the resulting quadratic equation — the same skill from Term 1.',
    correctStep: 'For y = x² - x - 6: set 0 = x²-x-6 = (x-3)(x+2), giving x-intercepts at x=3 and x=-2.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 2,
  topicId: 'quadratic-functions',
  topicName: 'Quadratic Functions',
  prerequisites: [
    'Factorising and solving quadratic equations (Term 1)',
    'Sketching linear graphs using intercepts (this term, Topic 3)',
  ],
  objectives: [
    { id: 'identify-shape-direction', text: 'Identify whether a parabola opens upward or downward from its equation.' },
    { id: 'find-axis-turning-point', text: 'Find the axis of symmetry and turning point of a quadratic function.' },
    { id: 'find-intercepts-quadratic', text: 'Find the x- and y-intercepts of a quadratic function, using factorisation.' },
    { id: 'sketch-parabola', text: 'Sketch a parabola using its intercepts, axis of symmetry, and turning point.' },
  ],
  estimatedMinutes: [20, 30],
};

export const quadraticFunctions: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What shape does a quadratic equation actually draw?',
  goalSettingPrompt:
    'You already know how to solve quadratic equations using factorisation. That same skill finds the exact points where a parabola crosses the x-axis. By the end of this lesson you\'ll be able to sketch a full parabola from its equation.',

  activate: {
    connectPrompt: 'You already know how to factorise and solve quadratic equations — that\'s the main tool for finding a parabola\'s x-intercepts.',
    diagnosticQuestions: [
      { question: 'Solve x² - 5x + 6 = 0.', options: ['x=2 or x=3', 'x=-2 or x=-3', 'x=6', 'x=5'], correctIndex: 0, explanation: 'Factorise: (x-2)(x-3)=0, so x=2 or x=3.' },
      { question: 'What is the y-intercept of y = x² + 4x - 7 (set x=0)?', options: ['-7', '4', '7', '0'], correctIndex: 0, explanation: 'y = 0 + 0 - 7 = -7.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A quadratic function y = ax² + bx + c graphs as a parabola — a symmetric curve. The sign of a controls the direction: a > 0 opens UPWARD (a minimum turning point, like a smile); a < 0 opens DOWNWARD (a maximum turning point, like a frown). Every parabola has a vertical AXIS OF SYMMETRY, found using x = -b/(2a), which passes exactly through the TURNING POINT — the single highest or lowest point where the curve changes direction.',
    workedExamples: [
      { id: 'wx-direction-axis', prompt: 'For y = x² - 6x + 5, find the direction it opens and its axis of symmetry.', steps: [
        { step: 'a = 1 (positive), so the parabola opens upward, with a minimum turning point.', justification: 'Check the sign of a.' },
        { step: 'Axis of symmetry: x = -b/(2a) = -(-6)/(2×1) = 3.', justification: 'Apply the formula directly.' },
      ], answer: 'Opens upward; axis of symmetry x = 3', graph: {
        fn: (x: number) => x * x - 6 * x + 5,
        domain: [-1, 7], yDomain: [-6, 10],
        features: [{ x: 3, y: -4, label: 'turning point (3,-4)' }],
      } },
      { id: 'wx-downward-parabola', prompt: 'For y = -x² + 4, find the direction and axis of symmetry.', steps: [
        { step: 'a = -1 (negative), so the parabola opens downward, with a maximum turning point.', justification: 'Check the sign of a.' },
        { step: 'Axis of symmetry: x = -b/(2a) = -0/(2×-1) = 0.', justification: 'Here b=0, so the axis is simply x=0.' },
      ], answer: 'Opens downward; axis of symmetry x = 0', graph: {
        fn: (x: number) => -(x * x) + 4,
        domain: [-4, 4], yDomain: [-8, 6],
        features: [{ x: 0, y: 4, label: 'turning point (0,4)' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'For y = -3x² + 2x - 1, which way does the parabola open?', options: ['Downward', 'Upward', 'Sideways', 'It depends on x'], correctIndex: 0, explanation: 'a = -3 is negative, so it opens downward.', misconceptionId: 'sign-of-a-confused' },
      { question: 'What is the axis of symmetry of y = x² - 8x + 12?', options: ['x = 4', 'x = -4', 'x = 8', 'x = 12'], correctIndex: 0, explanation: 'x = -b/(2a) = -(-8)/(2×1) = 4.', misconceptionId: 'axis-of-symmetry-wrong-formula' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying a parabola\'s direction and axis of symmetry?',
  },

  demonstrateChunk2: {
    explanation:
      'To sketch a full parabola: find the Y-INTERCEPT (set x=0, giving c directly), the X-INTERCEPTS (set y=0 and factorise/solve — the same skill from Term 1), and the TURNING POINT (using the axis of symmetry\'s x-value, then substituting back into the equation to find y). The turning point is NOT usually an x-intercept — it sits on the axis of symmetry, exactly halfway between the two x-intercepts when there are two.',
    workedExamples: [
      { id: 'wx-full-sketch', prompt: 'Sketch y = x² - x - 6 fully.', steps: [
        { step: 'Y-intercept: x=0 → y=-6, so (0,-6).', justification: 'Set x=0.' },
        { step: 'X-intercepts: 0 = x²-x-6 = (x-3)(x+2), so x=3 or x=-2, giving (3,0) and (-2,0).', justification: 'Factorise and apply zero-product, as in Term 1.' },
        { step: 'Axis of symmetry: x = -(-1)/(2×1) = 0.5 (exactly halfway between -2 and 3).', justification: 'Confirms the axis sits between the two x-intercepts.' },
        { step: 'Turning point: substitute x=0.5 into the equation: y = (0.5)²-(0.5)-6 = -6.25, so (0.5, -6.25).', justification: 'Find the y-value at the axis of symmetry.' },
      ], answer: 'Intercepts (0,-6), (3,0), (-2,0); turning point (0.5,-6.25)', graph: {
        fn: (x: number) => x * x - x - 6,
        domain: [-4, 5], yDomain: [-8, 8],
        features: [{ x: 0, y: -6, label: '(0,-6)' }, { x: 3, y: 0, label: '(3,0)' }, { x: -2, y: 0, label: '(-2,0)' }, { x: 0.5, y: -6.25, label: 'min' }],
      } },
      { id: 'wx-explore-a', prompt: 'Explore: how does changing "a" affect y = ax², with the vertex fixed at the origin?', steps: [
        { step: 'Move the slider to change a and observe the parabola.', justification: 'A larger |a| makes the parabola narrower; a negative a flips it to open downward.' },
      ], answer: 'The parabola widens/narrows and flips direction as a changes.', graph: {
        fn: (x: number, a = 1) => a * x * x,
        domain: [-4, 4], yDomain: [-10, 10],
        features: [{ x: 0, y: 0, label: 'vertex (0,0)' }],
        slider: { label: 'Coefficient (a)', min: -2, max: 2, step: 0.25, initial: 1 },
      } },
    ],
    knowledgeChecks: [
      { question: 'For y = x² - 9, what are the x-intercepts?', options: ['x = 3 or x = -3', 'x = 9 or x = -9', 'x = 3 only', 'No x-intercepts'], correctIndex: 0, explanation: '0 = x²-9 = (x-3)(x+3), so x=3 or x=-3.', misconceptionId: 'skip-factorise-for-intercepts' },
      { question: 'For y = (x-1)(x-7), where is the turning point\'s x-value?', options: ['x = 4 (halfway between 1 and 7)', 'x = 1', 'x = 7', 'x = 8'], correctIndex: 0, explanation: 'The turning point sits on the axis of symmetry, exactly halfway between the two x-intercepts: (1+7)/2 = 4.', misconceptionId: 'turning-point-mistaken-for-intercept' },
    ],
    confidenceCheckPrompt: 'How confident do you feel sketching a full parabola using its intercepts and turning point?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'find-axis-turning-point', revealSteps: 2, prompt: 'Find the axis of symmetry and turning point of y = x² - 4x + 1.', steps: [
        { step: 'Axis: x = -(-4)/(2×1) = 2.', justification: 'Apply the formula.' },
        { step: 'y at x=2: (2)²-4(2)+1 = -3, so turning point (2,-3).', justification: 'Substitute back.' },
      ], answer: 'Axis x=2, turning point (2,-3)' },
      { id: 'fp-partial-1', objectiveId: 'find-intercepts-quadratic', revealSteps: 1, prompt: 'Find all intercepts of y = x² + 2x - 8.', steps: [
        { step: 'Y-intercept: x=0 → y=-8, so (0,-8).', justification: 'Set x=0.' },
        { step: 'X-intercepts: 0=(x+4)(x-2), so x=-4 or x=2.', justification: 'Factorise and solve.' },
      ], answer: '(0,-8), (-4,0), (2,0)' },
      { id: 'fp-independent-1', objectiveId: 'sketch-parabola', revealSteps: 0, prompt: 'Sketch y = -x² + 6x - 5 fully (find all intercepts, axis, and turning point).', steps: [
        { step: 'Y-int (0,-5). X-ints: 0=-(x²-6x+5)=-(x-1)(x-5), so x=1 or x=5. Axis: x=3. Turning point: y=-(9)+18-5=4, so (3,4).', justification: 'Combine all four sketching steps.' },
      ], answer: '(0,-5), (1,0), (5,0), turning point (3,4) — opens downward' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'identify-shape-direction', question: 'Does y = 4x² - 3x + 2 open upward or downward?', options: ['Upward', 'Downward', 'Neither', 'Cannot tell'], correctIndex: 0, hints: { strategic: 'Check the sign of a.', procedural: 'a = 4, positive.', workedStep: 'Opens upward.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'find-axis-turning-point', question: 'Find the axis of symmetry of y = 2x² - 8x + 3.', options: ['x = 2', 'x = -2', 'x = 4', 'x = 8'], correctIndex: 0, hints: { strategic: 'Use x = -b/(2a).', procedural: 'a=2, b=-8.', workedStep: 'x = -(-8)/(2×2) = 2.' }, distractorMisconceptions: { 2: 'axis-of-symmetry-wrong-formula' } },
      { id: 'ip-3', objectiveId: 'find-intercepts-quadratic', question: 'Find the x-intercepts of y = x² - 3x - 10.', options: ['x=5 or x=-2', 'x=-5 or x=2', 'x=3 or x=10', 'x=10'], correctIndex: 0, hints: { strategic: 'Set y=0 and factorise.', procedural: '(x-5)(x+2)=0.', workedStep: 'x=5 or x=-2.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'sketch-parabola', question: 'For y = (x-2)(x-8), where is the turning point\'s x-value?', options: ['x = 5', 'x = 2', 'x = 8', 'x = 10'], correctIndex: 0, hints: { strategic: 'It\'s halfway between the two x-intercepts.', procedural: '(2+8)/2', workedStep: '= 5.' }, distractorMisconceptions: { 1: 'turning-point-mistaken-for-intercept' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'identify-shape-direction', multiSelect: false, question: 'True or false: y = -5x² + x - 1 opens upward.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a = -5 is negative, so it opens downward.', distractorMisconceptions: { 0: 'sign-of-a-confused' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'find-axis-turning-point', multiSelect: false, question: 'Find the axis of symmetry of y = x² + 10x + 21.', options: ['x = -5', 'x = 5', 'x = -10', 'x = 10'], correctIndices: [0], explanation: 'x = -b/(2a) = -10/2 = -5.', distractorMisconceptions: { 2: 'axis-of-symmetry-wrong-formula' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'find-intercepts-quadratic', multiSelect: false, question: 'Find the x-intercepts of y = x² - 49.', options: ['x=7 or x=-7', 'x=49', 'x=7 only', 'No x-intercepts'], correctIndices: [0], explanation: '0=(x-7)(x+7), so x=7 or x=-7.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'find-intercepts-quadratic', multiSelect: false, question: 'What is the y-intercept of y = 2x² - 3x + 9?', options: ['9', '2', '-3', '0'], correctIndices: [0], explanation: 'Set x=0: y=9.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'sketch-parabola', multiSelect: false, question: 'True or false: the turning point of a parabola is usually one of its x-intercepts.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the turning point is where the curve changes direction, and is usually NOT on the x-axis at all.', distractorMisconceptions: { 0: 'turning-point-mistaken-for-intercept' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'sketch-parabola', multiSelect: false, question: 'For y = (x+3)(x-9), what is the turning point\'s x-value?', options: ['x = 3', 'x = -3', 'x = 9', 'x = 6'], correctIndices: [0], explanation: 'Halfway between -3 and 9: (-3+9)/2 = 3.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'find-axis-turning-point', multiSelect: false, question: 'For y = x² - 2x - 3, find the turning point.', options: ['(1, -4)', '(1, -3)', '(2, -3)', '(-1, -4)'], correctIndices: [0], explanation: 'Axis: x=1. y = 1-2-3 = -4, so (1,-4).', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-shape-direction', multiSelect: true, question: 'Which of these parabolas open downward? (select all that apply)', options: ['y = -x² + 5', 'y = 3x² - 1', 'y = -2x² + 4x', 'y = 0.5x² + 2'], correctIndices: [0, 2], explanation: 'y=-x²+5 (a=-1) and y=-2x²+4x (a=-2) both have negative leading coefficients.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'sketch-parabola',
      analogy: 'Think of sketching a parabola like assembling a puzzle with four known pieces: the y-intercept (where it starts on the y-axis), the x-intercepts (where it touches the ground), and the turning point (the peak or valley) — find each piece separately using its own method, then connect them with a smooth symmetric curve.',
      explanation: 'Always find the pieces in this order: (1) y-intercept — set x=0; (2) x-intercepts — set y=0, factorise; (3) axis of symmetry — use x=-b/(2a); (4) turning point — substitute the axis x-value back into the equation.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Sketch y = x² - 4x fully.', steps: [
          { step: 'Y-intercept: x=0 → y=0, so (0,0).', justification: 'Set x=0.' },
          { step: 'X-intercepts: 0 = x(x-4), so x=0 or x=4.', justification: 'Factorise (common factor x here).' },
          { step: 'Axis: x = -(-4)/(2) = 2. Turning point: y = 4-8 = -4, so (2,-4).', justification: 'Find the axis, then substitute.' },
        ], answer: '(0,0), (4,0), turning point (2,-4)' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'sketch-parabola', question: 'Find all key features of y = x² - 6x + 8.', options: ['(0,8), (2,0), (4,0), turning point (3,-1)', '(0,8), (2,0), (4,0), turning point (3,1)', '(0,-8), (2,0), (4,0), turning point (3,-1)', '(0,8), (6,0), (8,0), turning point (3,-1)'], correctIndex: 0, hints: { strategic: 'Follow the four-step order.', procedural: 'y-int: x=0→y=8. x-ints: (x-2)(x-4)=0.', workedStep: 'Axis x=3, y=9-18+8=-1. So (0,8),(2,0),(4,0),(3,-1).' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'sketch-parabola', question: 'Find all key features of y = x² - 1.', options: ['(0,-1), (1,0), (-1,0), turning point (0,-1)', '(0,1), (1,0), (-1,0), turning point (0,1)', '(0,-1), (1,0), (-1,0), turning point (0,1)', '(0,-1), (0,1), turning point (1,-1)'], correctIndex: 0, hints: { strategic: 'Follow the four-step order.', procedural: 'y-int: x=0→y=-1. x-ints: (x-1)(x+1)=0.', workedStep: 'Axis x=0, y=-1. So (0,-1),(1,0),(-1,0),(0,-1).' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'sketch-parabola', question: 'Find all key features of y = -x² + 4x.', options: ['(0,0), (0,0), (4,0), turning point (2,4)', '(0,0), (4,0), turning point (2,-4)', '(0,4), (4,0), turning point (2,4)', '(0,0), (4,0), turning point (4,0)'], correctIndex: 0, hints: { strategic: 'Follow the four-step order, careful with the negative leading coefficient.', procedural: 'y-int: x=0→y=0. x-ints: -x(x-4)=0, x=0 or 4.', workedStep: 'Axis x=2, y=-4+8=4. So (0,0),(4,0),(2,4).' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Did exploring the "a" slider help you see how the parabola\'s shape changes?', type: 'multiple-choice', options: ['Yes, a lot', 'A little', 'Not really', 'I didn\'t need it'] },
    { id: 'r2', prompt: 'How confident do you feel sketching a full parabola now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the order of steps you\'ll follow to sketch a parabola from now on?', type: 'free-text' },
  ],
};
