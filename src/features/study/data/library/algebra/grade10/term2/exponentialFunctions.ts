// ── Term 2, Topic 6: Exponential Functions ────────────────────────────────────

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'exponential-means-steep',
    label: 'Thinking "exponential" just means "very steep"',
    errorType: 'You described a graph as exponential just because it looked steep, without checking the equation form.',
    principle: 'A graph is exponential specifically because the variable is in the EXPONENT (y = a·bˣ), not just because it looks steep. Steepness alone doesn\'t make something exponential — a steep line or steep parabola section isn\'t exponential.',
    correctStep: 'y = 2ˣ is exponential (x is the exponent). y = 100x is just a very steep LINE, not exponential.',
  },
  {
    id: 'horizontal-asymptote-mistaken-for-intercept',
    label: 'Confusing the horizontal asymptote with the x-intercept',
    errorType: 'You treated the horizontal asymptote as if the graph actually crosses the x-axis there.',
    principle: 'An exponential function y = a·bˣ + q has a horizontal asymptote at y=q, which the graph approaches but NEVER touches — it is not an x-intercept, and in fact a basic exponential of this form usually has NO x-intercept at all.',
    correctStep: 'y = 3ˣ + 2 has a horizontal asymptote at y=2, and the graph never crosses the x-axis (never reaches y=0).',
  },
  {
    id: 'growth-vs-decay-confused',
    label: 'Confusing exponential growth with exponential decay',
    errorType: 'You mixed up whether a base greater than 1 or less than 1 produces growth vs. decay.',
    principle: 'For y = a·bˣ (a>0): if b > 1, the function GROWS as x increases. If 0 < b < 1, the function DECAYS (shrinks toward the asymptote) as x increases.',
    correctStep: 'y = 5·(2)ˣ grows (b=2>1). y = 5·(0.5)ˣ decays (b=0.5, between 0 and 1).',
  },
  {
    id: 'y-intercept-error-exponential',
    label: 'Miscalculating the y-intercept of an exponential function',
    errorType: 'You made an error finding y when x=0, often forgetting that any nonzero number to the power 0 equals 1.',
    principle: 'For y = a·bˣ + q, the y-intercept is found by setting x=0: since b⁰=1 for any b≠0, this simplifies to y = a(1) + q = a + q.',
    correctStep: 'For y = 4·(3)ˣ + 1: y-intercept = 4(3⁰)+1 = 4(1)+1 = 5.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 2,
  topicId: 'exponential-functions',
  topicName: 'Exponential Functions',
  prerequisites: [
    'Sketching hyperbolas, including asymptotes (this term, Topic 5)',
    'Exponent laws (Term 1)',
  ],
  objectives: [
    { id: 'recognise-exponential-form', text: 'Recognise the general form y = a·bˣ + q and distinguish exponential functions from other function types.' },
    { id: 'growth-vs-decay', text: 'Determine whether an exponential function represents growth or decay based on its base.' },
    { id: 'find-exponential-features', text: 'Find the y-intercept and horizontal asymptote of an exponential function.' },
    { id: 'sketch-exponential', text: 'Sketch an exponential function using its intercept, asymptote, and general shape.' },
  ],
  estimatedMinutes: [20, 30],
};

export const exponentialFunctions: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What happens when the variable is the exponent instead of the base?',
  goalSettingPrompt:
    'You\'ve seen the variable as a base (x², x³) — exponential functions flip this, putting the variable in the EXPONENT. This single change creates a completely different growth pattern. By the end of this lesson you\'ll be able to sketch and interpret exponential graphs.',

  activate: {
    connectPrompt: 'You already know the exponent laws from Term 1. Exponential functions apply those same rules, just with x in the exponent position.',
    diagnosticQuestions: [
      { question: 'What is 2³?', options: ['8', '6', '9', '5'], correctIndex: 0, explanation: '2×2×2 = 8.' },
      { question: 'What is any nonzero number raised to the power 0?', options: ['1', '0', 'The number itself', 'Undefined'], correctIndex: 0, explanation: 'Any nonzero base to the power 0 equals 1.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'An exponential function has the form y = a·bˣ + q, where the variable x is in the EXPONENT — this is what makes it "exponential," not just steepness. The horizontal asymptote is at y=q (the graph approaches but never touches this line), and typically there is NO x-intercept for a basic exponential of this form, since the graph never actually reaches its asymptote. To find the y-intercept, set x=0: since b⁰=1 always, the y-intercept simplifies to a+q.',
    workedExamples: [
      { id: 'wx-exponential-basic', prompt: 'For y = 2·3ˣ + 1, find the y-intercept and horizontal asymptote.', steps: [
        { step: 'Y-intercept: set x=0. y = 2(3⁰)+1 = 2(1)+1 = 3.', justification: 'Any nonzero base to the power 0 is 1.' },
        { step: 'Horizontal asymptote: y = q = 1 (the graph approaches, but never reaches, y=1).', justification: 'The added constant sets the horizontal asymptote.' },
      ], answer: 'Y-intercept (0,3); asymptote y=1', graph: {
        fn: (x: number) => 2 * Math.pow(3, x) + 1,
        domain: [-3, 2], yDomain: [-1, 15],
        features: [{ x: 0, y: 3, label: '(0,3)' }],
        asymptotes: [{ axis: 'y', value: 1, label: 'y=1' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'Is y = 3x⁵ an exponential function?', options: ['No — the variable is the base, not the exponent', 'Yes, it grows quickly', 'Yes, because it has a power', 'Cannot be determined'], correctIndex: 0, explanation: 'Exponential functions have the variable IN the exponent, like y=3ˣ, not raised to a fixed power like x⁵.', misconceptionId: 'exponential-means-steep' },
      { question: 'For y = 5·2ˣ - 3, what is the horizontal asymptote?', options: ['y = -3', 'y = 5', 'y = 2', 'x = -3'], correctIndex: 0, explanation: 'The asymptote is at y=q=-3.', misconceptionId: 'horizontal-asymptote-mistaken-for-intercept' },
    ],
    confidenceCheckPrompt: 'How confident do you feel recognising exponential functions and finding their y-intercept and asymptote?',
  },

  demonstrateChunk2: {
    explanation:
      'The base b determines the shape: if b > 1, the function shows GROWTH (increases as x increases). If 0 < b < 1, the function shows DECAY (decreases toward the asymptote as x increases). In both cases, the graph never touches its horizontal asymptote (y=q) and approaches it in one direction while growing/shrinking rapidly in the other. Use the slider below to see how changing the base affects growth vs. decay.',
    workedExamples: [
      { id: 'wx-decay', prompt: 'Describe the shape of y = 4·(0.5)ˣ.', steps: [
        { step: 'b = 0.5, which is between 0 and 1.', justification: 'Check where b sits relative to 1.' },
        { step: 'This means the function decays — it shrinks toward its asymptote (y=0) as x increases.', justification: 'A base between 0 and 1 always produces decay.' },
      ], answer: 'Decay, approaching y=0 as x increases', graph: {
        fn: (x: number) => 4 * Math.pow(0.5, x),
        domain: [-3, 6], yDomain: [-2, 20],
        asymptotes: [{ axis: 'y', value: 0, label: 'y=0' }],
      } },
      { id: 'wx-explore-base', prompt: 'Explore: how does changing the base b affect y = 2·bˣ?', steps: [
        { step: 'Move the slider between values above and below 1 and observe.', justification: 'b>1 gives growth; 0<b<1 gives decay; the y-intercept (0,2) stays fixed since a and q don\'t change.' },
      ], answer: 'The graph switches between growth and decay depending on whether b is above or below 1.', graph: {
        fn: (x: number, b = 2) => 2 * Math.pow(Math.max(b, 0.1), x),
        domain: [-3, 3], yDomain: [-2, 18],
        features: [{ x: 0, y: 2, label: '(0,2)' }],
        asymptotes: [{ axis: 'y', value: 0, label: 'y=0' }],
        slider: { label: 'Base (b)', min: 0.25, max: 3, step: 0.25, initial: 2 },
      } },
    ],
    knowledgeChecks: [
      { question: 'For y = 6·(1.5)ˣ, does this represent growth or decay?', options: ['Growth (b=1.5 > 1)', 'Decay (b=1.5 > 1)', 'Neither', 'Cannot be determined'], correctIndex: 0, explanation: 'b=1.5 is greater than 1, so the function grows.', misconceptionId: 'growth-vs-decay-confused' },
      { question: 'For y = 3·(0.2)ˣ + 5, find the y-intercept.', options: ['8', '5', '3', '0.2'], correctIndex: 0, explanation: 'y = 3(0.2⁰)+5 = 3(1)+5 = 8.', misconceptionId: 'y-intercept-error-exponential' },
    ],
    confidenceCheckPrompt: 'How confident do you feel telling growth and decay apart, and sketching either shape?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'find-exponential-features', revealSteps: 2, prompt: 'For y = 3·2ˣ - 2, find the y-intercept and asymptote.', steps: [
        { step: 'Y-intercept: y = 3(2⁰)-2 = 3-2 = 1.', justification: 'Set x=0.' },
        { step: 'Asymptote: y = -2.', justification: 'The added constant sets the asymptote.' },
      ], answer: 'Y-intercept (0,1); asymptote y=-2' },
      { id: 'fp-partial-1', objectiveId: 'growth-vs-decay', revealSteps: 1, prompt: 'Does y = 10·(0.8)ˣ represent growth or decay?', steps: [
        { step: 'b = 0.8, between 0 and 1.', justification: 'Check b relative to 1.' },
        { step: 'This means decay.', justification: 'Base between 0 and 1 always decays.' },
      ], answer: 'Decay' },
      { id: 'fp-independent-1', objectiveId: 'sketch-exponential', revealSteps: 0, prompt: 'Sketch y = 2·4ˣ + 3, describing its y-intercept, asymptote, and growth/decay behaviour.', steps: [
        { step: 'Y-intercept: 2(1)+3=5. Asymptote: y=3. Base 4>1, so growth.', justification: 'Combine all three checks.' },
      ], answer: 'Y-intercept (0,5), asymptote y=3, growing' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'recognise-exponential-form', question: 'Which of these is an exponential function?', options: ['y = 5·2ˣ', 'y = 5x²', 'y = 5/x', 'y = 5x + 2'], correctIndex: 0, hints: { strategic: 'Where is the variable — as a base, or as an exponent?', procedural: 'y=5·2ˣ has x in the exponent.', workedStep: 'y=5·2ˣ is exponential.' }, distractorMisconceptions: { 1: 'exponential-means-steep' } },
      { id: 'ip-2', objectiveId: 'growth-vs-decay', question: 'Does y = 7·(3)ˣ represent growth or decay?', options: ['Growth', 'Decay', 'Neither', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'Is the base greater or less than 1?', procedural: 'b=3 > 1.', workedStep: 'Growth.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'find-exponential-features', question: 'For y = 6·5ˣ + 4, find the horizontal asymptote.', options: ['y = 4', 'y = 6', 'y = 5', 'y = 10'], correctIndex: 0, hints: { strategic: 'The asymptote is q, the added constant.', procedural: 'q = 4.', workedStep: 'y = 4.' }, distractorMisconceptions: { 1: 'horizontal-asymptote-mistaken-for-intercept' } },
      { id: 'ip-4', objectiveId: 'find-exponential-features', question: 'For y = 2·(0.5)ˣ - 1, find the y-intercept.', options: ['1', '2', '-1', '0.5'], correctIndex: 0, hints: { strategic: 'Set x=0.', procedural: 'y = 2(1)-1.', workedStep: '= 1.' }, distractorMisconceptions: { 2: 'y-intercept-error-exponential' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'recognise-exponential-form', multiSelect: false, question: 'True or false: y = 8x³ is an exponential function.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the variable is the base here, not the exponent. This is a cubic, not exponential.', distractorMisconceptions: { 0: 'exponential-means-steep' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'find-exponential-features', multiSelect: false, question: 'For y = 3·4ˣ + 2, find the y-intercept.', options: ['5', '3', '2', '4'], correctIndices: [0], explanation: 'y = 3(4⁰)+2 = 3(1)+2 = 5.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'find-exponential-features', multiSelect: false, question: 'For y = 5·2ˣ - 6, find the horizontal asymptote.', options: ['y = -6', 'y = 5', 'y = 2', 'y = 0'], correctIndices: [0], explanation: 'The asymptote is q=-6.', distractorMisconceptions: { 3: 'horizontal-asymptote-mistaken-for-intercept' } },
    { id: 'q4', type: 'true-false', objectiveId: 'growth-vs-decay', multiSelect: false, question: 'True or false: y = 4·(0.3)ˣ represents growth.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — b=0.3 is between 0 and 1, so this is decay.', distractorMisconceptions: { 0: 'growth-vs-decay-confused' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'growth-vs-decay', multiSelect: false, question: 'Which of these represents decay?', options: ['y = 5·(0.7)ˣ', 'y = 5·(1.7)ˣ', 'y = 5·(2)ˣ', 'y = 5·(3)ˣ'], correctIndices: [0], explanation: 'b=0.7 is between 0 and 1, the only decay case here.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'sketch-exponential', multiSelect: false, question: 'True or false: a basic exponential function y = a·bˣ + q (with a>0) usually has an x-intercept.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the graph approaches but never reaches its horizontal asymptote, so (for a typical case where the asymptote is above the x-axis, or the function never crosses y=0) there is often no x-intercept.', distractorMisconceptions: { 0: 'horizontal-asymptote-mistaken-for-intercept' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'sketch-exponential', multiSelect: false, question: 'For y = 1·2ˣ + 0 (i.e. y=2ˣ), find the y-intercept.', options: ['1', '2', '0', '0.5'], correctIndices: [0], explanation: 'y = 1(2⁰)+0 = 1(1)+0 = 1.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'recognise-exponential-form', multiSelect: true, question: 'Which of these are exponential functions? (select all that apply)', options: ['y = 3·5ˣ', 'y = 3x⁵', 'y = 2·(0.4)ˣ + 1', 'y = 3/x'], correctIndices: [0, 2], explanation: 'y=3·5ˣ and y=2·(0.4)ˣ+1 both have the variable in the exponent — true exponential functions.', distractorMisconceptions: { 1: 'exponential-means-steep' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'find-exponential-features',
      analogy: 'For y = a·bˣ + q, think of q as the "floor" the graph can never fall below (or ceiling it can\'t rise above, for decay) — always read it straight from the equation as the asymptote. The y-intercept is just "start at x=0 and remember b⁰ is always 1."',
      explanation: 'Two separate, simple lookups: y-intercept = a + q (since b⁰=1 always); horizontal asymptote = q (read directly, no calculation needed).',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'For y = 6·3ˣ + 4, find the y-intercept and asymptote.', steps: [
          { step: 'Y-intercept = a + q = 6 + 4 = 10.', justification: 'Since 3⁰=1, y=6(1)+4=10.' },
          { step: 'Asymptote = q = 4.', justification: 'Read q directly from the equation.' },
        ], answer: 'Y-intercept (0,10); asymptote y=4' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'find-exponential-features', question: 'For y = 2·5ˣ + 3, find the y-intercept and asymptote.', options: ['(0,5) and y=3', '(0,2) and y=5', '(0,3) and y=2', '(0,5) and y=2'], correctIndex: 0, hints: { strategic: 'Y-intercept = a+q. Asymptote = q.', procedural: 'a=2, q=3, so y-int = 5.', workedStep: '(0,5), asymptote y=3.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'find-exponential-features', question: 'For y = 4·2ˣ - 1, find the y-intercept and asymptote.', options: ['(0,3) and y=-1', '(0,4) and y=-1', '(0,-1) and y=4', '(0,3) and y=4'], correctIndex: 0, hints: { strategic: 'Y-intercept = a+q. Asymptote = q.', procedural: 'a=4, q=-1, so y-int = 3.', workedStep: '(0,3), asymptote y=-1.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'find-exponential-features', question: 'For y = 1·10ˣ + 9, find the y-intercept and asymptote.', options: ['(0,10) and y=9', '(0,1) and y=10', '(0,9) and y=1', '(0,10) and y=1'], correctIndex: 0, hints: { strategic: 'Y-intercept = a+q. Asymptote = q.', procedural: 'a=1, q=9, so y-int = 10.', workedStep: '(0,10), asymptote y=9.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Did exploring the base slider help you see growth vs. decay?', type: 'multiple-choice', options: ['Yes, a lot', 'A little', 'Not really', 'I didn\'t need it'] },
    { id: 'r2', prompt: 'How confident do you feel sketching exponential functions now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What real-world situation can you think of that grows or decays exponentially?', type: 'free-text' },
  ],
};
