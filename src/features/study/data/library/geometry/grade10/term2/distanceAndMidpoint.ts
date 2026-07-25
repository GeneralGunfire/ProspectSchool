// ── Geometry, Term 2, Topic 1: Distance and Midpoint ──────────────────────────
// First Geometry topic — Analytical Geometry, extending the existing
// FunctionGraph-style Cartesian approach with GeometricDiagram overlays
// (right-angle triangle for distance, segment+midpoint highlighting), per
// .planning/research/LIBRARY_GEOMETRY_RESEARCH.md Part A.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'distance-formula-sign-error',
    label: 'Losing a sign when subtracting coordinates in the distance formula',
    errorType: 'You made a sign error subtracting the x- or y-coordinates before squaring.',
    principle: 'In the distance formula, (x2-x1) and (y2-y1) can be negative — that\'s fine, since squaring removes the sign anyway. Just be careful to consistently subtract in the same order for both x and y.',
    correctStep: 'For (2,5) and (7,1): x2-x1 = 7-2=5, y2-y1 = 1-5=-4. Both get squared: 5²=25, (-4)²=16 — the negative disappears after squaring.',
  },
  {
    id: 'forgot-square-root-distance',
    label: 'Forgetting to take the square root at the end of the distance formula',
    errorType: 'You calculated the sum of squares but stopped before taking the square root.',
    principle: 'The distance formula is d = √[(x2-x1)² + (y2-y1)²] — the square root is the FINAL step, not optional. Without it, you have the squared distance, not the distance itself.',
    correctStep: 'If (x2-x1)²+(y2-y1)² = 25, the distance is √25 = 5, not 25.',
  },
  {
    id: 'midpoint-formula-error',
    label: 'Not averaging both coordinates correctly for the midpoint',
    errorType: 'You calculated the midpoint incorrectly, often forgetting to divide by 2, or averaging only one coordinate.',
    principle: 'The midpoint formula averages the x-coordinates AND the y-coordinates separately: M = ((x1+x2)/2, (y1+y2)/2). Both coordinates need their own average.',
    correctStep: 'For (2,8) and (6,4): midpoint = ((2+6)/2, (8+4)/2) = (4, 6).',
  },
  {
    id: 'distance-treated-as-coordinate-difference',
    label: 'Using a simple coordinate difference instead of the full distance formula',
    errorType: 'You subtracted coordinates directly as if the two points were on the same horizontal or vertical line, without accounting for the diagonal distance.',
    principle: 'Unless two points share the same x-coordinate or the same y-coordinate, the straight-line distance between them is a DIAGONAL — you must use the full distance formula (based on Pythagoras), not just subtract one pair of coordinates.',
    correctStep: 'For (1,1) and (4,5), the distance is NOT simply 4-1=3 or 5-1=4 — it\'s the diagonal, √[(4-1)²+(5-1)²] = √(9+16) = √25 = 5.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'geometry',
  grade: 10,
  term: 2,
  topicId: 'distance-and-midpoint',
  topicName: 'Distance and Midpoint',
  prerequisites: [
    'Plotting points on the Cartesian plane',
    'Pythagoras\' theorem',
    'Simplifying surds (Term 1 Algebra)',
  ],
  objectives: [
    { id: 'apply-distance-formula', text: 'Calculate the distance between two points using the distance formula.' },
    { id: 'apply-midpoint-formula', text: 'Calculate the midpoint of a segment joining two points.' },
    { id: 'connect-distance-pythagoras', text: 'Explain how the distance formula connects to Pythagoras\' theorem.' },
    { id: 'apply-to-shapes', text: 'Use distance and midpoint to determine properties of a shape (e.g. is a triangle isosceles?).' },
  ],
  estimatedMinutes: [20, 30],
};

export const distanceAndMidpoint: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How far apart are two points that aren\'t lined up?',
  goalSettingPrompt:
    'Finding the distance between two points that share an x- or y-coordinate is easy — just subtract. But most pairs of points sit diagonally from each other. By the end of this lesson you\'ll be able to find the exact distance and midpoint between any two points on the Cartesian plane.',

  activate: {
    connectPrompt: 'You already know Pythagoras\' theorem — the distance formula is just Pythagoras applied to coordinates.',
    diagnosticQuestions: [
      { question: 'For a right triangle with legs 3 and 4, find the hypotenuse.', options: ['5', '7', '12', '25'], correctIndex: 0, explanation: '√(3²+4²) = √25 = 5.' },
      { question: 'Simplify √36.', options: ['6', '18', '9', '12'], correctIndex: 0, explanation: '6×6=36.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'The DISTANCE FORMULA finds the straight-line distance between two points (x1,y1) and (x2,y2): d = √[(x2-x1)² + (y2-y1)²]. This is really just Pythagoras\' theorem — the horizontal difference (x2-x1) and vertical difference (y2-y1) form the two legs of a right triangle, and the distance is the hypotenuse. The square root is the FINAL step — don\'t stop at the sum of squares.',
    workedExamples: [
      { id: 'wx-distance-basic', prompt: 'Find the distance between A(1,2) and B(4,6).', steps: [
        { step: 'x2-x1 = 4-1 = 3. y2-y1 = 6-2 = 4.', justification: 'Find the horizontal and vertical differences.' },
        { step: 'd = √(3²+4²) = √(9+16) = √25 = 5.', justification: 'Square, add, then take the square root — this last step is essential.' },
      ], answer: 'Distance = 5 units', diagram: {
        points: [{ id: 'A', x: 20, y: 100, label: 'A(1,2)' }, { id: 'B', x: 90, y: 30, label: 'B(4,6)' }, { id: 'C', x: 90, y: 100, label: 'C', labelOffset: [4, 12] }],
        segments: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C', dashed: true }, { from: 'C', to: 'B', dashed: true }],
        angles: [{ at: 'C', from: 'A', to: 'B', rightAngle: true }],
      } },
    ],
    knowledgeChecks: [
      { question: 'For (0,0) and (6,8), find the distance.', options: ['10', '14', '100', '48'], correctIndex: 0, explanation: '√(6²+8²)=√(36+64)=√100=10.', misconceptionId: 'forgot-square-root-distance' },
      { question: 'For (2,3) and (5,7), what is (y2-y1)?', options: ['4', '-4', '3', '7'], correctIndex: 0, explanation: '7-3=4.', misconceptionId: 'distance-formula-sign-error' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying the distance formula and connecting it to Pythagoras?',
  },

  demonstrateChunk2: {
    explanation:
      'The MIDPOINT FORMULA finds the exact middle point of a segment joining (x1,y1) and (x2,y2): M = ((x1+x2)/2, (y1+y2)/2) — average the x-coordinates, and separately average the y-coordinates. Unlike distance, there\'s no square root involved. Distance and midpoint together let you investigate shape properties — e.g. checking if a triangle is isosceles (two equal sides) using the distance formula on each pair of vertices.',
    workedExamples: [
      { id: 'wx-midpoint-basic', prompt: 'Find the midpoint of the segment joining P(2,8) and Q(6,4).', steps: [
        { step: 'x-coordinate of midpoint: (2+6)/2 = 4.', justification: 'Average the x-coordinates.' },
        { step: 'y-coordinate of midpoint: (8+4)/2 = 6.', justification: 'Average the y-coordinates, separately.' },
      ], answer: 'Midpoint = (4, 6)', diagram: {
        points: [{ id: 'P', x: 20, y: 30, label: 'P(2,8)' }, { id: 'Q', x: 100, y: 100, label: 'Q(6,4)' }, { id: 'M', x: 60, y: 65, label: 'M(4,6)', labelOffset: [8, 4] }],
        segments: [{ from: 'P', to: 'M', ticks: 1 }, { from: 'M', to: 'Q', ticks: 1 }],
      } },
      { id: 'wx-isosceles-check', prompt: 'Is the triangle with vertices A(0,0), B(4,0), C(2,3) isosceles?', steps: [
        { step: 'AB = √[(4-0)²+(0-0)²] = √16 = 4.', justification: 'Distance between A and B.' },
        { step: 'AC = √[(2-0)²+(3-0)²] = √(4+9) = √13.', justification: 'Distance between A and C.' },
        { step: 'BC = √[(2-4)²+(3-0)²] = √(4+9) = √13.', justification: 'Distance between B and C.' },
        { step: 'AC = BC = √13, so two sides are equal.', justification: 'Compare all three side lengths.' },
      ], answer: 'Yes, isosceles — AC = BC = √13' },
    ],
    knowledgeChecks: [
      { question: 'Find the midpoint of (10,2) and (2,8).', options: ['(6,5)', '(12,10)', '(8,6)', '(5,6)'], correctIndex: 0, explanation: '((10+2)/2, (2+8)/2) = (6,5).', misconceptionId: 'midpoint-formula-error' },
      { question: 'For points (3,3) and (9,3), what is the distance?', options: ['6', '0', '3', '9'], correctIndex: 0, explanation: 'Same y-coordinate, so it\'s a horizontal line: distance = 9-3=6. (Also confirmable via the full formula: √(6²+0²)=6.)', misconceptionId: 'distance-treated-as-coordinate-difference' },
    ],
    confidenceCheckPrompt: 'How confident do you feel finding midpoints and using distance/midpoint to investigate shape properties?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-distance-formula', revealSteps: 1, prompt: 'Find the distance between (3,1) and (7,4).', steps: [
        { step: 'd = √[(7-3)²+(4-1)²] = √(16+9) = √25 = 5.', justification: 'Apply the formula directly.' },
      ], answer: 'Distance = 5' },
      { id: 'fp-partial-1', objectiveId: 'apply-midpoint-formula', revealSteps: 1, prompt: 'Find the midpoint of (0,0) and (8,10).', steps: [
        { step: 'x: (0+8)/2 = 4.', justification: 'Average the x-values.' },
        { step: 'y: (0+10)/2 = 5.', justification: 'Average the y-values.' },
      ], answer: 'Midpoint = (4,5)' },
      { id: 'fp-independent-1', objectiveId: 'apply-to-shapes', revealSteps: 0, prompt: 'Triangle with A(0,0), B(6,0), C(3,3) — is it isosceles?', steps: [
        { step: 'AC = √(9+9)=√18. BC = √(9+9)=√18. Equal, so yes.', justification: 'Compare AC and BC.' },
      ], answer: 'Yes, isosceles' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'apply-distance-formula', question: 'Find the distance between (0,0) and (5,12).', options: ['13', '17', '60', '7'], correctIndex: 0, hints: { strategic: 'Apply the distance formula.', procedural: '√(25+144)', workedStep: '=√169=13.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'apply-midpoint-formula', question: 'Find the midpoint of (4,9) and (10,3).', options: ['(7,6)', '(14,12)', '(6,3)', '(3,6)'], correctIndex: 0, hints: { strategic: 'Average x and y separately.', procedural: '((4+10)/2, (9+3)/2)', workedStep: '=(7,6).' }, distractorMisconceptions: { 3: 'midpoint-formula-error' } },
      { id: 'ip-3', objectiveId: 'connect-distance-pythagoras', question: 'The distance formula is based on which theorem?', options: ['Pythagoras\' theorem', 'The midpoint theorem', 'The angle sum theorem', 'None of these'], correctIndex: 0, hints: { strategic: 'The differences in x and y form the legs of a right triangle.', procedural: 'The distance is the hypotenuse.', workedStep: 'Pythagoras\' theorem.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'apply-to-shapes', question: 'For a quadrilateral, if the diagonals have the same midpoint, what does this suggest?', options: ['The diagonals bisect each other (a parallelogram property)', 'The shape is a triangle', 'Nothing can be concluded', 'The shape has no sides'], correctIndex: 0, hints: { strategic: 'Same midpoint means the diagonals cross at their own centre.', procedural: 'This is a defining property of parallelograms.', workedStep: 'The diagonals bisect each other.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'apply-distance-formula', multiSelect: false, question: 'Find the distance between (1,1) and (4,5).', options: ['5', '7', '25', '3'], correctIndices: [0], explanation: '√(9+16)=√25=5.', distractorMisconceptions: { 2: 'forgot-square-root-distance' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'apply-distance-formula', multiSelect: false, question: 'Find the distance between (2,-3) and (2,5).', options: ['8', '2', '0', '4'], correctIndices: [0], explanation: 'Same x-coordinate — vertical distance: 5-(-3)=8.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-midpoint-formula', multiSelect: false, question: 'Find the midpoint of (-2,4) and (6,-2).', options: ['(2,1)', '(4,2)', '(2,2)', '(4,1)'], correctIndices: [0], explanation: '((-2+6)/2, (4+-2)/2)=(2,1).', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'apply-midpoint-formula', multiSelect: false, question: 'True or false: the midpoint formula requires a square root, like the distance formula.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — midpoint just averages coordinates, no square root needed.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'connect-distance-pythagoras', multiSelect: false, question: 'In the distance formula, what do (x2-x1) and (y2-y1) represent geometrically?', options: ['The two legs of a right triangle', 'The hypotenuse', 'The midpoint coordinates', 'The gradient'], correctIndices: [0], explanation: 'They are the horizontal and vertical legs; the distance is the hypotenuse.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'apply-to-shapes', multiSelect: false, question: 'Triangle A(0,0), B(4,0), C(0,3). Find AB, AC, BC to classify the triangle.', options: ['AB=4, AC=3, BC=5 — scalene (all different)', 'AB=4, AC=3, BC=4 — isosceles', 'AB=AC=BC — equilateral', 'Cannot be determined'], correctIndices: [0], explanation: 'AB=4, AC=3, BC=√(16+9)=5 — all different lengths, so scalene.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'apply-distance-formula', multiSelect: false, question: 'True or false: (x2-x1) must always be calculated as a positive number before squaring.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — it can be negative; squaring removes the sign either way.', distractorMisconceptions: { 0: 'distance-formula-sign-error' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'apply-to-shapes', multiSelect: true, question: 'Which facts would help you determine if a triangle is isosceles? (select all that apply)', options: ['The lengths of all three sides', 'The x-intercepts of the triangle\'s sides', 'Whether any two side lengths are equal', 'The colour of the diagram'], correctIndices: [0, 2], explanation: 'You need all three side lengths, and specifically check whether any two match.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-distance-formula',
      analogy: 'Think of the distance formula as building a right-angled triangle between your two points: walk horizontally, then vertically, to connect them — the direct diagonal distance is the hypotenuse of that triangle, found exactly the way Pythagoras taught you.',
      explanation: 'Always work in this exact order: (1) find x2-x1 and y2-y1; (2) square both; (3) add them; (4) take the square root — never skip step 4.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Find the distance between (2,2) and (10,8).', steps: [
          { step: 'x2-x1=8, y2-y1=6.', justification: 'Find the differences.' },
          { step: '8²+6² = 64+36 = 100.', justification: 'Square and add.' },
          { step: '√100 = 10.', justification: 'Take the square root — the final step.' },
        ], answer: 'Distance = 10' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-distance-formula', question: 'Find the distance between (1,1) and (7,9).', options: ['10', '14', '100', '8'], correctIndex: 0, hints: { strategic: 'Differences, square, add, root.', procedural: '6²+8²=36+64=100.', workedStep: '√100=10.' }, distractorMisconceptions: { 2: 'forgot-square-root-distance' } },
        { id: 'rem-p2', objectiveId: 'apply-distance-formula', question: 'Find the distance between (-1,2) and (5,10).', options: ['10', '14', '100', '6'], correctIndex: 0, hints: { strategic: 'Differences, square, add, root.', procedural: '6²+8²=36+64=100.', workedStep: '√100=10.' }, distractorMisconceptions: { 2: 'forgot-square-root-distance' } },
        { id: 'rem-p3', objectiveId: 'apply-distance-formula', question: 'Find the distance between (0,3) and (4,0).', options: ['5', '7', '25', '1'], correctIndex: 0, hints: { strategic: 'Differences, square, add, root.', procedural: '4²+3²=16+9=25.', workedStep: '√25=5.' }, distractorMisconceptions: { 2: 'forgot-square-root-distance' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'How does the distance formula connect to Pythagoras\' theorem?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel using distance and midpoint now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the one step you\'ll be most careful not to skip in the distance formula?', type: 'multiple-choice', options: ['Taking the square root at the end', 'Squaring the differences', 'Finding the differences', 'Nothing in particular'] },
  ],
};
