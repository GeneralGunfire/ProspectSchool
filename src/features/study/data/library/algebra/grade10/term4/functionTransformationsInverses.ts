// ── Term 4, Topic 3: Function Transformations and Inverses ───────────────────
// Light-touch scope per LIBRARY_ALGEBRA_TERM3_4_RESEARCH.md (textbook-variable
// at Grade 10): vertical/horizontal shifts, reflections, and simple inverses
// via swapping x/y. Reuses the Term 2 FunctionGraph component — shows
// original and transformed/inverse graphs as paired worked examples (the
// engine doesn't yet support overlaying two functions on one plot, so
// before/after is shown as two adjacent graphs rather than one combined one).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'vertical-horizontal-shift-confused',
    label: 'Confusing a vertical shift with a horizontal shift',
    errorType: 'You moved the graph in the wrong direction for the type of shift described.',
    principle: 'Adding/subtracting OUTSIDE the function (like f(x)+q) shifts the graph VERTICALLY (up/down). Adding/subtracting INSIDE the function\'s input (like f(x-p)) shifts it HORIZONTALLY (left/right) — and confusingly, f(x-p) shifts RIGHT for positive p, not left.',
    correctStep: 'y=x²+3 shifts the parabola UP by 3. y=(x-3)² shifts it RIGHT by 3 (not left, despite the minus sign).',
  },
  {
    id: 'reflection-axis-confused',
    label: 'Confusing a reflection in the x-axis with a reflection in the y-axis',
    errorType: 'You reflected the graph across the wrong axis.',
    principle: 'y=-f(x) reflects the graph in the X-AXIS (flips top-to-bottom, y-values negate). y=f(-x) reflects the graph in the Y-AXIS (flips left-to-right, x-values negate).',
    correctStep: 'For y=x², the reflection y=-x² flips it upside down (opens downward) — that\'s a reflection in the x-axis.',
  },
  {
    id: 'inverse-not-just-swap',
    label: 'Not correctly swapping x and y when finding an inverse',
    errorType: 'You attempted to find an inverse without properly swapping the roles of x and y.',
    principle: 'To find the inverse of a simple function: write it as y=..., swap x and y everywhere, then (if possible) rearrange to solve for y again.',
    correctStep: 'For y=2x+3: swap to get x=2y+3, then solve for y: y=(x-3)/2 — this is the inverse.',
  },
  {
    id: 'inverse-graph-reflection-missed',
    label: 'Not recognising that a function and its inverse are reflections of each other across y=x',
    errorType: 'You didn\'t connect the algebraic swap (x and y) to its geometric meaning on the graph.',
    principle: 'Swapping x and y algebraically corresponds EXACTLY to reflecting the graph across the line y=x — every point (a,b) on the original becomes (b,a) on the inverse.',
    correctStep: 'If (2,7) is a point on the original function, (7,2) is the corresponding point on its inverse — reflected across y=x.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 4,
  topicId: 'function-transformations-inverses',
  topicName: 'Function Transformations and Inverses',
  prerequisites: [
    'Sketching linear and quadratic graphs (Term 2)',
    'Solving linear equations (Term 1)',
  ],
  objectives: [
    { id: 'apply-vertical-shift', text: 'Apply and describe a vertical shift to a function\'s graph.' },
    { id: 'apply-horizontal-shift', text: 'Apply and describe a horizontal shift to a function\'s graph.' },
    { id: 'apply-reflection', text: 'Apply and describe a reflection of a function\'s graph in the x-axis or y-axis.' },
    { id: 'find-simple-inverse', text: 'Find the inverse of a simple linear function by swapping x and y.' },
  ],
  estimatedMinutes: [20, 30],
};

export const functionTransformationsInverses: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What happens to a graph when you change what goes in, or what comes out?',
  goalSettingPrompt:
    'You already know how to sketch several types of graphs. Now we look at how small changes to a function\'s equation move or flip its graph in predictable ways — and what it means to "undo" a function entirely with its inverse.',

  activate: {
    connectPrompt: 'You already know how to sketch a basic parabola and a line. Let\'s check that before transforming them.',
    diagnosticQuestions: [
      { question: 'For y = x², what is the turning point?', options: ['(0,0)', '(1,1)', '(0,1)', '(1,0)'], correctIndex: 0, explanation: 'The basic parabola y=x² has its turning point at the origin.' },
      { question: 'Solve x = 2y + 4 for y.', options: ['y = (x-4)/2', 'y = (x+4)/2', 'y = 2x-4', 'y = x/2 - 4'], correctIndex: 0, explanation: 'Subtract 4: x-4=2y. Divide by 2: y=(x-4)/2.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Two basic transformations: a VERTICAL shift, y=f(x)+q, moves the whole graph up (q>0) or down (q<0) — this is the same "+q" you already know from Term 2\'s hyperbola/exponential work. A HORIZONTAL shift, y=f(x-p), moves the graph left or right — but counterintuitively, f(x-p) shifts RIGHT for a positive p (subtracting inside the brackets shifts right, not left).',
    workedExamples: [
      { id: 'wx-vertical-shift', prompt: 'Compare y=x² (original) and y=x²+4 (transformed).', steps: [
        { step: 'The original y=x² has turning point (0,0).', justification: 'Standard basic parabola.' },
        { step: 'Adding 4 outside shifts every point up by 4: the new turning point is (0,4).', justification: 'A "+4" outside the function shifts vertically.' },
      ], answer: 'Turning point moves from (0,0) to (0,4)', graph: {
        fn: (x: number) => x * x, domain: [-4, 4], yDomain: [-2, 20], features: [{ x: 0, y: 0, label: 'original (0,0)' }],
      } },
      { id: 'wx-vertical-shift-after', prompt: 'The transformed graph, y=x²+4.', steps: [
        { step: 'Every y-value from the original is increased by 4.', justification: 'Vertical shift applies uniformly.' },
      ], answer: 'Turning point at (0,4)', graph: {
        fn: (x: number) => x * x + 4, domain: [-4, 4], yDomain: [-2, 20], features: [{ x: 0, y: 4, label: 'shifted (0,4)' }],
      } },
      { id: 'wx-horizontal-shift', prompt: 'Compare y=x² (original) and y=(x-3)² (transformed).', steps: [
        { step: 'The original has turning point (0,0).', justification: 'Standard basic parabola.' },
        { step: 'y=(x-3)² shifts the graph RIGHT by 3 (not left) — the turning point moves to (3,0).', justification: 'Subtracting inside the brackets shifts right; this is the counterintuitive direction to remember.' },
      ], answer: 'Turning point moves from (0,0) to (3,0)', graph: {
        fn: (x: number) => (x - 3) * (x - 3), domain: [-2, 7], yDomain: [-2, 20], features: [{ x: 3, y: 0, label: 'shifted (3,0)' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'y = x² - 5. Which direction does this shift the graph?', options: ['Down by 5', 'Up by 5', 'Left by 5', 'Right by 5'], correctIndex: 0, explanation: 'A "-5" outside the function shifts the graph down.', misconceptionId: 'vertical-horizontal-shift-confused' },
      { question: 'y = (x+2)². Which direction does this shift the graph?', options: ['Left by 2', 'Right by 2', 'Up by 2', 'Down by 2'], correctIndex: 0, explanation: 'f(x+p) shifts LEFT for positive p — the opposite of f(x-p).', misconceptionId: 'vertical-horizontal-shift-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel telling vertical and horizontal shifts apart?',
  },

  demonstrateChunk2: {
    explanation:
      'REFLECTIONS: y=-f(x) reflects the graph in the X-AXIS (flips top-to-bottom). y=f(-x) reflects the graph in the Y-AXIS (flips left-to-right). To find the INVERSE of a simple function: write it as y=..., swap x and y everywhere, then rearrange to solve for y again. Geometrically, this swap is exactly a REFLECTION ACROSS THE LINE y=x — every point (a,b) on the original becomes (b,a) on the inverse.',
    workedExamples: [
      { id: 'wx-reflection-x-axis', prompt: 'Compare y=x² (original) and y=-x² (reflected in the x-axis).', steps: [
        { step: 'The original opens upward, with minimum (0,0).', justification: 'Standard parabola shape.' },
        { step: 'y=-x² flips every y-value\'s sign, so it opens DOWNWARD instead, with maximum (0,0).', justification: 'Reflecting in the x-axis negates all y-values.' },
      ], answer: 'Opens downward instead of upward', graph: {
        fn: (x: number) => -(x * x), domain: [-4, 4], yDomain: [-20, 2], features: [{ x: 0, y: 0, label: 'reflected max (0,0)' }],
      } },
      { id: 'wx-find-inverse', prompt: 'Find the inverse of y = 3x - 6.', steps: [
        { step: 'Swap x and y: x = 3y - 6.', justification: 'This is the defining step of finding an inverse.' },
        { step: 'Solve for y: x+6 = 3y, so y = (x+6)/3.', justification: 'Rearrange using the same equation-solving skills from Term 1.' },
      ], answer: 'Inverse: y = (x+6)/3', graph: {
        fn: (x: number) => 3 * x - 6, domain: [-2, 6], yDomain: [-10, 10], features: [{ x: 2, y: 0, label: 'original: (2,0)' }],
      } },
      { id: 'wx-inverse-graph', prompt: 'The inverse graph, y = (x+6)/3.', steps: [
        { step: 'The point (2,0) on the original becomes (0,2) on the inverse — coordinates swapped.', justification: 'This reflects the algebraic swap of x and y.' },
      ], answer: 'The point (0,2) lies on the inverse, corresponding to (2,0) on the original', graph: {
        fn: (x: number) => (x + 6) / 3, domain: [-8, 4], yDomain: [-2, 4], features: [{ x: 0, y: 2, label: 'inverse: (0,2)' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'Which transformation does y=-f(x) represent?', options: ['Reflection in the x-axis', 'Reflection in the y-axis', 'Vertical shift', 'Horizontal shift'], correctIndex: 0, explanation: 'Negating the whole function (outside) flips it top-to-bottom — reflection in the x-axis.', misconceptionId: 'reflection-axis-confused' },
      { question: 'To find the inverse of y=5x+1, what is the first step?', options: ['Swap x and y', 'Divide both sides by 5', 'Add 1 to both sides', 'Square both sides'], correctIndex: 0, explanation: 'Finding an inverse always starts by swapping x and y.', misconceptionId: 'inverse-not-just-swap' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying reflections and finding simple inverses?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-vertical-shift', revealSteps: 1, prompt: 'Describe how y=x²-7 differs from y=x².', steps: [
        { step: 'The graph shifts DOWN by 7; turning point moves from (0,0) to (0,-7).', justification: 'A "-7" outside the function is a vertical shift.' },
      ], answer: 'Shifts down by 7' },
      { id: 'fp-partial-1', objectiveId: 'apply-horizontal-shift', revealSteps: 1, prompt: 'Describe how y=(x-5)² differs from y=x².', steps: [
        { step: 'Subtracting 5 inside the brackets.', justification: 'This signals a horizontal shift.' },
        { step: 'Shifts RIGHT by 5 (not left).', justification: 'f(x-p) shifts right for positive p.' },
      ], answer: 'Shifts right by 5' },
      { id: 'fp-independent-1', objectiveId: 'find-simple-inverse', revealSteps: 0, prompt: 'Find the inverse of y = 4x - 8.', steps: [
        { step: 'Swap: x = 4y - 8. Solve: y = (x+8)/4.', justification: 'Swap then solve for y.' },
      ], answer: 'Inverse: y = (x+8)/4' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'apply-vertical-shift', question: 'y = x² + 10. How does this shift the basic parabola?', options: ['Up by 10', 'Down by 10', 'Left by 10', 'Right by 10'], correctIndex: 0, hints: { strategic: 'The "+10" is outside the function.', procedural: 'Outside changes = vertical shift.', workedStep: 'Up by 10.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'apply-horizontal-shift', question: 'y = (x+6)². How does this shift the basic parabola?', options: ['Left by 6', 'Right by 6', 'Up by 6', 'Down by 6'], correctIndex: 0, hints: { strategic: 'f(x+p) shifts left for positive p.', procedural: 'This is the opposite of f(x-p).', workedStep: 'Left by 6.' }, distractorMisconceptions: { 1: 'vertical-horizontal-shift-confused' } },
      { id: 'ip-3', objectiveId: 'apply-reflection', question: 'Which equation reflects y=x² in the y-axis?', options: ['y=(-x)²  (same as y=x², since squaring removes the sign)', 'y=-x²', 'y=x²+1', 'y=(x-1)²'], correctIndex: 0, hints: { strategic: 'Reflection in the y-axis replaces x with -x.', procedural: 'f(-x) means substitute -x for x.', workedStep: 'y=(-x)², which for a square happens to look the same as the original.' }, distractorMisconceptions: { 1: 'reflection-axis-confused' } },
      { id: 'ip-4', objectiveId: 'find-simple-inverse', question: 'Find the inverse of y = 2x + 10.', options: ['y = (x-10)/2', 'y = (x+10)/2', 'y = 2x-10', 'y = x/2 + 10'], correctIndex: 0, hints: { strategic: 'Swap x and y, then solve for y.', procedural: 'x=2y+10 → x-10=2y', workedStep: 'y=(x-10)/2.' }, distractorMisconceptions: { 1: 'inverse-not-just-swap' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'apply-vertical-shift', multiSelect: false, question: 'y = x² - 3. What is the new turning point?', options: ['(0,-3)', '(0,3)', '(-3,0)', '(3,0)'], correctIndices: [0], explanation: 'Vertical shift down by 3: (0,-3).', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'apply-horizontal-shift', multiSelect: false, question: 'y = (x-4)². What is the new turning point?', options: ['(4,0)', '(-4,0)', '(0,4)', '(0,-4)'], correctIndices: [0], explanation: 'Shifts right by 4 (not left): (4,0).', distractorMisconceptions: { 1: 'vertical-horizontal-shift-confused' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-horizontal-shift', multiSelect: false, question: 'y = (x+7)². What is the new turning point?', options: ['(-7,0)', '(7,0)', '(0,7)', '(0,-7)'], correctIndices: [0], explanation: 'Shifts left by 7: (-7,0).', distractorMisconceptions: { 1: 'vertical-horizontal-shift-confused' } },
    { id: 'q4', type: 'true-false', objectiveId: 'apply-reflection', multiSelect: false, question: 'True or false: y=-f(x) reflects a graph in the y-axis.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — y=-f(x) reflects in the x-axis. y=f(-x) reflects in the y-axis.', distractorMisconceptions: { 0: 'reflection-axis-confused' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'find-simple-inverse', multiSelect: false, question: 'Find the inverse of y = 6x - 12.', options: ['y = (x+12)/6', 'y = (x-12)/6', 'y = 6x+12', 'y = x/6 - 12'], correctIndices: [0], explanation: 'Swap: x=6y-12. Solve: y=(x+12)/6.', distractorMisconceptions: { 1: 'inverse-not-just-swap' } },
    { id: 'q6', type: 'true-false', objectiveId: 'find-simple-inverse', multiSelect: false, question: 'True or false: a function and its inverse are reflections of each other across the line y=x.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — swapping x and y algebraically corresponds to this geometric reflection.', distractorMisconceptions: { 1: 'inverse-graph-reflection-missed' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'find-simple-inverse', multiSelect: false, question: 'If (5,9) lies on a function, what point lies on its inverse?', options: ['(9,5)', '(5,9)', '(-5,9)', '(-9,-5)'], correctIndices: [0], explanation: 'Points swap coordinates on the inverse.', distractorMisconceptions: { 1: 'inverse-graph-reflection-missed' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'apply-vertical-shift', multiSelect: true, question: 'Which of these represent a vertical shift of y=x²? (select all that apply)', options: ['y = x² + 8', 'y = x² - 2', 'y = (x-8)²', 'y = -x²'], correctIndices: [0, 1], explanation: 'Adding/subtracting OUTSIDE the function is a vertical shift. The other two are a horizontal shift and a reflection, respectively.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'find-simple-inverse',
      analogy: 'Think of an inverse as "undoing" a function — like a recipe run backwards. If the original function says "multiply by 3, then subtract 6," the inverse must undo those steps in REVERSE order: "add 6, then divide by 3."',
      explanation: 'Two reliable steps every time: (1) swap x and y in the equation; (2) solve the new equation for y, using the same balance techniques from Term 1.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Find the inverse of y = 7x + 14.', steps: [
          { step: 'Swap: x = 7y + 14.', justification: 'The defining first step.' },
          { step: 'Solve for y: x-14 = 7y, so y = (x-14)/7.', justification: 'Standard equation-solving.' },
        ], answer: 'Inverse: y = (x-14)/7' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'find-simple-inverse', question: 'Find the inverse of y = 2x + 8.', options: ['y = (x-8)/2', 'y = (x+8)/2', 'y = 2x-8', 'y = x/2 + 8'], correctIndex: 0, hints: { strategic: 'Swap x and y, then solve for y.', procedural: 'x=2y+8 → x-8=2y', workedStep: 'y=(x-8)/2.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'find-simple-inverse', question: 'Find the inverse of y = 5x - 15.', options: ['y = (x+15)/5', 'y = (x-15)/5', 'y = 5x+15', 'y = x/5 - 15'], correctIndex: 0, hints: { strategic: 'Swap x and y, then solve for y.', procedural: 'x=5y-15 → x+15=5y', workedStep: 'y=(x+15)/5.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'find-simple-inverse', question: 'Find the inverse of y = x - 9.', options: ['y = x+9', 'y = x-9', 'y = -x+9', 'y = -x-9'], correctIndex: 0, hints: { strategic: 'Swap x and y, then solve for y.', procedural: 'x=y-9 → x+9=y', workedStep: 'y=x+9.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why does f(x-p) shift the graph RIGHT, even though it looks like subtraction?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with transformations and inverses now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What are the two steps for finding an inverse?', type: 'multiple-choice', options: ['Swap x and y, then solve for y', 'Just solve for y', 'Just swap x and y', 'Multiply everything by -1'] },
  ],
};
