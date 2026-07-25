// ── Term 2, Topic 5: Hyperbolic Functions ─────────────────────────────────────
// First topic needing the FunctionGraph component's discontinuity handling
// (y = k/x has a break at x=0).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'asymptote-touched-or-crossed',
    label: 'Believing the graph touches or crosses its asymptote',
    errorType: 'You drew or described the hyperbola as touching or crossing one of its asymptotes.',
    principle: 'An asymptote is a line the graph gets closer and closer to, but NEVER actually touches or crosses. For y = k/x, the graph approaches the x-axis and y-axis but never reaches them.',
    correctStep: 'For y = 4/x, as x gets very large, y gets very close to 0 but never equals exactly 0 — the x-axis (y=0) is an asymptote, never touched.',
  },
  {
    id: 'wrong-quadrants-for-sign-of-k',
    label: 'Placing the hyperbola\'s branches in the wrong quadrants',
    errorType: 'You sketched the branches of y = k/x in the wrong pair of quadrants for the sign of k.',
    principle: 'For y = k/x: if k > 0, the branches sit in quadrants 1 and 3 (where x and y have the SAME sign). If k < 0, the branches sit in quadrants 2 and 4 (where x and y have OPPOSITE signs).',
    correctStep: 'y = -3/x has k=-3 (negative), so its branches are in quadrants 2 and 4.',
  },
  {
    id: 'undefined-point-ignored',
    label: 'Not recognising that the function is undefined at x = 0',
    errorType: 'You tried to evaluate or plot the function at x = 0, or drew the graph as continuous through x = 0.',
    principle: 'For y = k/x, division by zero is undefined, so x = 0 is NOT part of the domain — the graph has a break (discontinuity) there, with the y-axis as a vertical asymptote.',
    correctStep: 'y = k/x is undefined at x=0 — the graph never touches the y-axis, splitting into two separate branches.',
  },
  {
    id: 'shift-changes-asymptote-missed',
    label: 'Not updating the asymptote when the hyperbola is shifted',
    errorType: 'You kept the original asymptotes even though the equation includes a shift (e.g. +q).',
    principle: 'For y = k/x + q, the horizontal asymptote moves from y=0 to y=q — adding q shifts the ENTIRE graph (including its horizontal asymptote) up or down by q.',
    correctStep: 'y = 2/x + 3 has a horizontal asymptote at y=3 (not y=0), since the whole graph is shifted up by 3.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 2,
  topicId: 'hyperbolic-functions',
  topicName: 'Hyperbolic Functions',
  prerequisites: [
    'Sketching linear and quadratic graphs (this term, Topics 3-4)',
    'Working with positive and negative numbers',
  ],
  objectives: [
    { id: 'recognise-hyperbola-shape', text: 'Recognise the general shape of a hyperbola y = k/x and identify its asymptotes.' },
    { id: 'determine-quadrants', text: 'Determine which quadrants a hyperbola\'s branches sit in, based on the sign of k.' },
    { id: 'sketch-hyperbola', text: 'Sketch a hyperbola including a vertical shift, correctly showing both asymptotes.' },
    { id: 'interpret-inverse-proportion', text: 'Interpret a hyperbola in a simple inverse-proportionality context.' },
  ],
  estimatedMinutes: [20, 30],
};

export const hyperbolicFunctions: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What happens to a graph that can never touch a line?',
  goalSettingPrompt:
    'A hyperbola behaves differently from any graph you\'ve sketched so far — it\'s split into two separate pieces, and gets closer and closer to certain lines without ever touching them. By the end of this lesson you\'ll be able to sketch one confidently.',

  activate: {
    connectPrompt: 'You already know how to sketch linear and quadratic graphs using key features. A hyperbola needs a similar approach, but with one new idea: asymptotes.',
    diagnosticQuestions: [
      { question: 'What is 1 divided by a very large number, like 1000?', options: ['A very small number, close to 0', 'A very large number', 'Exactly 0', 'Undefined'], correctIndex: 0, explanation: '1/1000 = 0.001, a small number approaching (but not reaching) 0.' },
      { question: 'Is division by 0 defined in normal arithmetic?', options: ['No, it is undefined', 'Yes, it equals 0', 'Yes, it equals 1', 'Only for negative numbers'], correctIndex: 0, explanation: 'Division by zero is undefined.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A hyperbola of the form y = k/x is undefined at x=0 (division by zero), so its graph splits into two separate branches, one on each side of x=0. As x gets very large (positive or negative), y gets closer and closer to 0, but never reaches it — this means y=0 (the x-axis) is a horizontal ASYMPTOTE, and x=0 (the y-axis) is a vertical asymptote. An asymptote is a line the graph approaches but NEVER touches or crosses.',
    workedExamples: [
      { id: 'wx-basic-hyperbola', prompt: 'Describe the graph of y = 4/x.', steps: [
        { step: 'The function is undefined at x=0, so the graph splits into two branches.', justification: 'Division by zero is undefined.' },
        { step: 'As x increases, y approaches 0 but never reaches it — y=0 is a horizontal asymptote. As x approaches 0, y grows very large — x=0 is a vertical asymptote.', justification: 'Examine the behaviour as x grows large or approaches 0.' },
      ], answer: 'Two branches, asymptotes at x=0 and y=0', graph: {
        fn: (x: number) => 4 / x,
        domain: [-8, 8], yDomain: [-8, 8], discontinuities: [0],
        asymptotes: [{ axis: 'x', value: 0, label: 'x=0' }, { axis: 'y', value: 0, label: 'y=0' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'For y = 6/x, what happens as x gets very close to 0 (but not equal to 0)?', options: ['y grows very large in size', 'y approaches 6', 'y equals 0', 'y is undefined everywhere nearby'], correctIndex: 0, explanation: 'As x shrinks toward 0, 6/x grows without bound — this is why x=0 is a vertical asymptote.', misconceptionId: 'undefined-point-ignored' },
      { question: 'True or false: the graph of y = 2/x eventually touches the x-axis for a large enough x.', options: ['False — it only ever gets closer, never touches', 'True — it touches at some large x value', 'True — it touches at x=2', 'Cannot be determined'], correctIndex: 0, explanation: 'An asymptote is never actually reached, no matter how large x gets.', misconceptionId: 'asymptote-touched-or-crossed' },
    ],
    confidenceCheckPrompt: 'How confident do you feel understanding why a hyperbola has asymptotes and splits into two branches?',
  },

  demonstrateChunk2: {
    explanation:
      'The sign of k in y = k/x determines which quadrants the two branches sit in: if k > 0, both branches sit where x and y have the SAME sign (quadrants 1 and 3). If k < 0, both branches sit where x and y have OPPOSITE signs (quadrants 2 and 4). Adding a constant, y = k/x + q, shifts the ENTIRE graph vertically by q — including its horizontal asymptote, which moves from y=0 to y=q. The vertical asymptote (x=0) stays fixed unless x itself is shifted.',
    workedExamples: [
      { id: 'wx-negative-k', prompt: 'Describe the branches of y = -5/x.', steps: [
        { step: 'k = -5 is negative.', justification: 'Check the sign of k.' },
        { step: 'Negative k means the branches sit where x and y have opposite signs: quadrants 2 (x<0, y>0) and 4 (x>0, y<0).', justification: 'Apply the sign rule.' },
      ], answer: 'Branches in quadrants 2 and 4', graph: {
        fn: (x: number) => -5 / x,
        domain: [-8, 8], yDomain: [-8, 8], discontinuities: [0],
        asymptotes: [{ axis: 'x', value: 0, label: 'x=0' }, { axis: 'y', value: 0, label: 'y=0' }],
      } },
      { id: 'wx-shifted-hyperbola', prompt: 'Sketch y = 3/x + 2, identifying both asymptotes.', steps: [
        { step: 'The vertical asymptote stays at x=0 (the x-part is unshifted).', justification: 'No horizontal shift is present in this equation.' },
        { step: 'The horizontal asymptote moves from y=0 to y=2, since the whole graph shifts up by 2.', justification: 'The "+2" shifts every y-value, including the asymptote.' },
      ], answer: 'Asymptotes at x=0 and y=2', graph: {
        fn: (x: number) => 3 / x + 2,
        domain: [-8, 8], yDomain: [-4, 8], discontinuities: [0],
        asymptotes: [{ axis: 'x', value: 0, label: 'x=0' }, { axis: 'y', value: 2, label: 'y=2' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'For y = 7/x, which quadrants do the branches sit in?', options: ['1 and 3', '2 and 4', '1 and 2', '3 and 4'], correctIndex: 0, explanation: 'k=7 is positive, so branches sit where x and y share the same sign: quadrants 1 and 3.', misconceptionId: 'wrong-quadrants-for-sign-of-k' },
      { question: 'For y = 5/x - 4, what is the horizontal asymptote?', options: ['y = -4', 'y = 0', 'y = 5', 'y = 4'], correctIndex: 0, explanation: 'The "-4" shifts the whole graph down by 4, moving the horizontal asymptote to y=-4.', misconceptionId: 'shift-changes-asymptote-missed' },
    ],
    confidenceCheckPrompt: 'How confident do you feel determining quadrants and asymptotes for a shifted hyperbola?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'determine-quadrants', revealSteps: 1, prompt: 'Which quadrants does y = -2/x sit in?', steps: [
        { step: 'k = -2 is negative, so branches are where x and y have opposite signs.', justification: 'Apply the sign rule.' },
      ], answer: 'Quadrants 2 and 4' },
      { id: 'fp-partial-1', objectiveId: 'sketch-hyperbola', revealSteps: 1, prompt: 'Identify the asymptotes of y = 6/x - 1.', steps: [
        { step: 'Vertical asymptote stays at x=0.', justification: 'No horizontal shift present.' },
        { step: 'Horizontal asymptote shifts to y=-1.', justification: 'The "-1" shifts the graph down by 1.' },
      ], answer: 'Asymptotes at x=0 and y=-1' },
      { id: 'fp-independent-1', objectiveId: 'recognise-hyperbola-shape', revealSteps: 0, prompt: 'Why does y = 8/x have no y-intercept?', steps: [
        { step: 'The y-intercept would require x=0, but the function is undefined there.', justification: 'Division by zero is undefined.' },
      ], answer: 'Because x=0 is not in the domain — the function is undefined there.' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'recognise-hyperbola-shape', question: 'For y = 3/x, what is the vertical asymptote?', options: ['x = 0', 'y = 0', 'x = 3', 'y = 3'], correctIndex: 0, hints: { strategic: 'Where is the function undefined?', procedural: 'At x=0.', workedStep: 'Vertical asymptote: x=0.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'determine-quadrants', question: 'Which quadrants does y = 9/x occupy?', options: ['1 and 3', '2 and 4', '1 and 4', '2 and 3'], correctIndex: 0, hints: { strategic: 'Check the sign of k.', procedural: 'k=9, positive.', workedStep: 'Quadrants 1 and 3.' }, distractorMisconceptions: { 1: 'wrong-quadrants-for-sign-of-k' } },
      { id: 'ip-3', objectiveId: 'sketch-hyperbola', question: 'For y = -4/x + 5, what are the two asymptotes?', options: ['x=0 and y=5', 'x=5 and y=0', 'x=0 and y=-4', 'x=-4 and y=5'], correctIndex: 0, hints: { strategic: 'The vertical asymptote is unshifted; the horizontal one shifts by the added constant.', procedural: 'x=0 stays; y=0 shifts to y=5.', workedStep: 'x=0 and y=5.' }, distractorMisconceptions: { 3: 'shift-changes-asymptote-missed' } },
      { id: 'ip-4', objectiveId: 'interpret-inverse-proportion', question: 'If y = 20/x models "time to finish a job" (y) vs. "number of workers" (x), what happens to time as workers increase?', options: ['Time decreases, approaching (but never reaching) 0', 'Time increases without bound', 'Time stays constant', 'Time becomes negative'], correctIndex: 0, hints: { strategic: 'This is inverse proportionality — as one quantity grows, the other shrinks.', procedural: 'As x (workers) grows, y (time) = 20/x shrinks toward 0.', workedStep: 'Time decreases, approaching 0 but never reaching it.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'recognise-hyperbola-shape', multiSelect: false, question: 'True or false: y = 5/x is defined at x=0.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — division by zero is undefined, so x=0 is not in the domain.', distractorMisconceptions: { 0: 'undefined-point-ignored' } },
    { id: 'q2', type: 'true-false', objectiveId: 'recognise-hyperbola-shape', multiSelect: false, question: 'True or false: a hyperbola\'s graph eventually crosses its asymptote for a large enough x.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — an asymptote is approached but never touched or crossed.', distractorMisconceptions: { 0: 'asymptote-touched-or-crossed' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'determine-quadrants', multiSelect: false, question: 'Which quadrants does y = -1/x occupy?', options: ['2 and 4', '1 and 3', '1 and 2', '3 and 4'], correctIndices: [0], explanation: 'k=-1 is negative, so branches are in quadrants 2 and 4.', distractorMisconceptions: { 1: 'wrong-quadrants-for-sign-of-k' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'sketch-hyperbola', multiSelect: false, question: 'For y = 2/x + 7, find the horizontal asymptote.', options: ['y = 7', 'y = 0', 'y = 2', 'x = 7'], correctIndices: [0], explanation: 'The +7 shifts the graph up by 7, moving the horizontal asymptote to y=7.', distractorMisconceptions: { 1: 'shift-changes-asymptote-missed' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'sketch-hyperbola', multiSelect: false, question: 'For y = -3/x - 2, find both asymptotes.', options: ['x=0 and y=-2', 'x=-2 and y=0', 'x=0 and y=-3', 'x=0 and y=2'], correctIndices: [0], explanation: 'Vertical asymptote unshifted at x=0; horizontal asymptote shifts to y=-2.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'determine-quadrants', multiSelect: false, question: 'True or false: for y = k/x with k > 0, the branches sit in quadrants where x and y have the same sign.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — positive k means x and y must share the same sign for their product to be positive.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'interpret-inverse-proportion', multiSelect: false, question: 'A car\'s travel time (y) for a fixed distance relates to speed (x) by y = 200/x. As speed doubles, what happens to travel time?', options: ['It halves', 'It doubles', 'It stays the same', 'It quadruples'], correctIndices: [0], explanation: 'This is inverse proportionality — doubling x halves y.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'recognise-hyperbola-shape', multiSelect: true, question: 'Which of these are true about y = k/x (k≠0)? (select all that apply)', options: ['It is undefined at x=0', 'It has two separate branches', 'It touches the x-axis at exactly one point', 'It has a vertical asymptote at x=0'], correctIndices: [0, 1, 3], explanation: 'The function is undefined at x=0, splits into two branches, and has a vertical asymptote at x=0 — but it never touches the x-axis.', distractorMisconceptions: { 2: 'asymptote-touched-or-crossed' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'sketch-hyperbola',
      analogy: 'Think of the asymptotes as invisible fences the graph can lean against but never climb over. For y = k/x + q, find the fences first (x=0 always, y=q from the shift), then sketch a branch in each of the two allowed quadrants, always curving toward — but never touching — both fences.',
      explanation: 'For y = k/x + q: the vertical asymptote is always x=0 (unless x itself is shifted, which isn\'t covered at this level). The horizontal asymptote is y=q. The sign of k tells you which pair of quadrants (relative to the shifted centre) the branches occupy.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Find the asymptotes and quadrant behaviour of y = -4/x + 1.', steps: [
          { step: 'Vertical asymptote: x=0 (always, at this level).', justification: 'Fixed unless x is shifted.' },
          { step: 'Horizontal asymptote: y=1 (from the +1 shift).', justification: 'The added constant shifts the horizontal asymptote.' },
          { step: 'k=-4 is negative, so branches sit in the "opposite sign" pattern relative to the shifted centre (0,1).', justification: 'Apply the sign rule relative to the new centre.' },
        ], answer: 'Asymptotes x=0 and y=1' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'sketch-hyperbola', question: 'Find the asymptotes of y = 5/x + 3.', options: ['x=0, y=3', 'x=3, y=0', 'x=0, y=5', 'x=5, y=3'], correctIndex: 0, hints: { strategic: 'Vertical stays at x=0; horizontal shifts by the added constant.', procedural: '+3 shifts y=0 to y=3.', workedStep: 'x=0, y=3.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'sketch-hyperbola', question: 'Find the asymptotes of y = -2/x - 6.', options: ['x=0, y=-6', 'x=-6, y=0', 'x=0, y=-2', 'x=2, y=-6'], correctIndex: 0, hints: { strategic: 'Vertical stays at x=0; horizontal shifts by the added constant.', procedural: '-6 shifts y=0 to y=-6.', workedStep: 'x=0, y=-6.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'sketch-hyperbola', question: 'Find the asymptotes of y = 1/x.', options: ['x=0, y=0', 'x=1, y=0', 'x=0, y=1', 'No asymptotes'], correctIndex: 0, hints: { strategic: 'No shift here — what are the default asymptotes?', procedural: 'Vertical x=0, horizontal y=0 (no constant added).', workedStep: 'x=0, y=0.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is an asymptote, in your own words?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel sketching a hyperbola now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Which felt trickier: finding the quadrants, or finding the shifted asymptote?', type: 'multiple-choice', options: ['Finding the quadrants', 'Finding the shifted asymptote', 'Both about the same', 'Neither felt difficult'] },
  ],
};
