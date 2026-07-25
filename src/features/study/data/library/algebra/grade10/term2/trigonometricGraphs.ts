// ── Term 2, Topic 7: Trigonometric Graphs ─────────────────────────────────────
// Links T2.1's triangle-ratio trig to its graph form, per the research's
// explicit call to connect the two views. Domain kept in degrees (0-360°),
// consistent with Grade 10 scope (no radians).

import type { LessonContent } from '../../../types';

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'amplitude-vertical-shift-confused',
    label: 'Confusing amplitude with vertical shift',
    errorType: 'You mixed up which parameter controls the graph\'s height (amplitude) versus how far up/down it sits (vertical shift).',
    principle: 'For y = a·sin(x) + q, the AMPLITUDE (|a|) controls how far the graph swings above and below its middle line — bigger |a| means taller waves. The VERTICAL SHIFT (q) moves the entire wave (and its middle line) up or down, without changing how tall the waves are.',
    correctStep: 'y = 3sin(x) + 2 has amplitude 3 (waves reach 3 above/below the middle line) and a vertical shift of 2 (middle line at y=2, not y=0).',
  },
  {
    id: 'period-changed-by-wrong-parameter',
    label: 'Confusing amplitude with period (how often the wave repeats)',
    errorType: 'You expected changing "a" (amplitude) to change how often the wave repeats.',
    principle: 'The PERIOD (how many degrees it takes for the wave to complete one full cycle) for basic sin(x) and cos(x) at this level is a fixed 360° — changing "a" (amplitude) makes waves taller/shorter but does NOT change how often they repeat.',
    correctStep: 'Both y=sin(x) and y=5sin(x) complete one full cycle every 360° — only the height of the waves differs.',
  },
  {
    id: 'sin-cos-graphs-swapped',
    label: 'Confusing the starting shape of sine and cosine graphs',
    errorType: 'You mixed up which graph starts at the midline and which starts at its maximum.',
    principle: 'y = sin(x) starts at (0,0) — on the midline, heading upward. y = cos(x) starts at (0,1) — at its MAXIMUM point. This is the key visual difference between the two at x=0.',
    correctStep: 'sin(0°) = 0 (midline), cos(0°) = 1 (maximum) — this is why the two graphs look shifted relative to each other.',
  },
  {
    id: 'tan-asymptotes-missed',
    label: 'Not showing the vertical asymptotes on a tangent graph',
    errorType: 'You sketched y = tan(x) as a smooth continuous curve without breaks.',
    principle: 'Tan(x) is undefined at 90° and 270° (where cos(x)=0, since tan=sin/cos), so its graph has VERTICAL ASYMPTOTES at those points, splitting it into separate repeating branches — unlike the smooth, unbroken sine and cosine waves.',
    correctStep: 'y = tan(x) has vertical asymptotes at x=90° and x=270° within a 0°-360° domain.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 2,
  topicId: 'trigonometric-graphs',
  topicName: 'Trigonometric Graphs',
  prerequisites: [
    'Trigonometric ratios: SOH-CAH-TOA (this term, Topic 1)',
    'Sketching functions using key features (this term, Topics 3-6)',
  ],
  objectives: [
    { id: 'sketch-sin-cos', text: 'Sketch the basic sin(x) and cos(x) graphs over 0°-360°.' },
    { id: 'identify-amplitude-period', text: 'Identify the amplitude and period of a sine or cosine graph.' },
    { id: 'identify-vertical-shift', text: 'Identify the vertical shift of a trig graph and distinguish it from amplitude.' },
    { id: 'sketch-tan-graph', text: 'Recognise the shape and asymptotes of a basic tan(x) graph.' },
  ],
  estimatedMinutes: [20, 30],
};

export const trigonometricGraphs: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What does a trig RATIO look like as a full graph?',
  goalSettingPrompt:
    'You already know sin, cos, and tan as ratios inside a single triangle. This lesson shows what happens as the angle sweeps through every value from 0° to 360° — the ratios trace out a repeating wave. By the end of this lesson you\'ll be able to sketch and read basic trig graphs.',

  activate: {
    connectPrompt: 'You already know the trig ratios for specific angles. Let\'s check that before seeing how those values connect into a full graph.',
    diagnosticQuestions: [
      { question: 'What is sin(0°)?', options: ['0', '1', '-1', 'undefined'], correctIndex: 0, explanation: 'sin(0°) = 0.' },
      { question: 'What is cos(0°)?', options: ['1', '0', '-1', 'undefined'], correctIndex: 0, explanation: 'cos(0°) = 1.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'As the angle x sweeps from 0° to 360°, sin(x) and cos(x) trace out smooth, repeating waves. y = sin(x) starts at (0,0) — on the midline, rising — and completes one full cycle every 360° (its PERIOD). y = cos(x) starts at (0,1) — at its MAXIMUM — and also has a period of 360°. Both waves have an AMPLITUDE of 1 for the basic functions: they swing 1 unit above and 1 unit below their midline (y=0).',
    workedExamples: [
      { id: 'wx-sin-graph', prompt: 'Describe the graph of y = sin(x) from 0° to 360°.', steps: [
        { step: 'At x=0°, y=sin(0°)=0 — starts on the midline.', justification: 'Evaluate at the start of the domain.' },
        { step: 'It rises to a maximum of 1 at x=90°, returns to 0 at x=180°, dips to a minimum of -1 at x=270°, and returns to 0 at x=360°.', justification: 'Trace the standard shape using known special-angle values.' },
      ], answer: 'A wave starting at 0, peaking at 90°, back to 0 at 180°, trough at 270°, back to 0 at 360°', graph: {
        fn: (x: number) => Math.sin(degToRad(x)),
        domain: [0, 360], yDomain: [-1.5, 1.5],
        features: [{ x: 90, y: 1, label: 'max' }, { x: 270, y: -1, label: 'min' }],
      } },
      { id: 'wx-cos-graph', prompt: 'Describe the graph of y = cos(x) from 0° to 360°.', steps: [
        { step: 'At x=0°, y=cos(0°)=1 — starts at its maximum.', justification: 'Evaluate at the start of the domain.' },
        { step: 'It falls to 0 at x=90°, reaches a minimum of -1 at x=180°, returns to 0 at x=270°, and back to its maximum of 1 at x=360°.', justification: 'Trace the standard shape.' },
      ], answer: 'A wave starting at its maximum (1), dropping to -1 at 180°, back to maximum at 360°', graph: {
        fn: (x: number) => Math.cos(degToRad(x)),
        domain: [0, 360], yDomain: [-1.5, 1.5],
        features: [{ x: 0, y: 1, label: 'max' }, { x: 180, y: -1, label: 'min' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'At x=0°, what is the value of y=sin(x)?', options: ['0 (on the midline)', '1 (at the maximum)', '-1 (at the minimum)', 'undefined'], correctIndex: 0, explanation: 'sin(0°)=0 — sine starts on the midline.', misconceptionId: 'sin-cos-graphs-swapped' },
      { question: 'At x=0°, what is the value of y=cos(x)?', options: ['1 (at the maximum)', '0 (on the midline)', '-1', 'undefined'], correctIndex: 0, explanation: 'cos(0°)=1 — cosine starts at its maximum.', misconceptionId: 'sin-cos-graphs-swapped' },
    ],
    confidenceCheckPrompt: 'How confident do you feel sketching the basic sin(x) and cos(x) graphs?',
  },

  demonstrateChunk2: {
    explanation:
      'For y = a·sin(x) + q (or cos): the AMPLITUDE (|a|) is how far the wave swings above/below its midline — it does NOT affect how often the wave repeats. The PERIOD (how many degrees for one full cycle) stays 360° for basic sin/cos at this level, regardless of amplitude. The VERTICAL SHIFT (q) moves the entire wave — and its midline — up or down, and is a completely separate effect from amplitude. The tangent graph, y = tan(x), behaves very differently: it has VERTICAL ASYMPTOTES at 90° and 270° (where cosine is 0, since tan = sin/cos), splitting it into repeating branches rather than one smooth wave.',
    workedExamples: [
      { id: 'wx-amplitude-shift', prompt: 'Describe y = 2sin(x) + 1.', steps: [
        { step: 'Amplitude = 2: the wave swings 2 units above and below its midline.', justification: 'The coefficient of sin(x) is the amplitude.' },
        { step: 'Vertical shift = 1: the midline moves from y=0 to y=1, so the wave now ranges from -1 to 3.', justification: 'The added constant shifts the whole graph, including the midline.' },
      ], answer: 'Amplitude 2, midline y=1, ranging from -1 to 3', graph: {
        fn: (x: number) => 2 * Math.sin(degToRad(x)) + 1,
        domain: [0, 360], yDomain: [-2, 4],
        features: [{ x: 90, y: 3, label: 'max' }, { x: 270, y: -1, label: 'min' }],
      } },
      { id: 'wx-tan-graph', prompt: 'Describe the graph of y = tan(x) from 0° to 360°.', steps: [
        { step: 'tan(x) = sin(x)/cos(x), which is undefined wherever cos(x)=0 — at x=90° and x=270°.', justification: 'Identify where the function is undefined.' },
        { step: 'The graph has vertical asymptotes at these two points, splitting it into three separate rising branches across the domain.', justification: 'Unlike sin/cos, tan is not a single smooth wave.' },
      ], answer: 'Vertical asymptotes at x=90° and x=270°, three rising branches', graph: {
        fn: (x: number) => Math.tan(degToRad(x)),
        domain: [0, 360], yDomain: [-6, 6], discontinuities: [90, 270],
        asymptotes: [{ axis: 'x', value: 90, label: 'x=90°' }, { axis: 'x', value: 270, label: 'x=270°' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'For y = 4sin(x) - 2, what is the amplitude?', options: ['4', '-2', '2', '6'], correctIndex: 0, explanation: 'The amplitude is the coefficient of sin, |4|=4.', misconceptionId: 'amplitude-vertical-shift-confused' },
      { question: 'Does changing the amplitude of a basic sin(x) graph change how often it repeats (its period)?', options: ['No, the period stays 360° at this level', 'Yes, larger amplitude means shorter period', 'Yes, larger amplitude means longer period', 'It depends on the sign of a'], correctIndex: 0, explanation: 'Amplitude changes wave height, not how often it repeats.', misconceptionId: 'period-changed-by-wrong-parameter' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying amplitude and vertical shift, and recognising the tan graph\'s asymptotes?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'identify-amplitude-period', revealSteps: 1, prompt: 'What is the amplitude of y = 5cos(x)?', steps: [
        { step: 'The coefficient of cos is 5, so the amplitude is 5.', justification: 'Amplitude is the absolute value of the coefficient.' },
      ], answer: 'Amplitude = 5' },
      { id: 'fp-partial-1', objectiveId: 'identify-vertical-shift', revealSteps: 1, prompt: 'For y = sin(x) - 3, what is the vertical shift and new midline?', steps: [
        { step: 'The added constant is -3.', justification: 'Identify q.' },
        { step: 'The midline moves from y=0 to y=-3.', justification: 'q shifts the entire graph, including the midline.' },
      ], answer: 'Vertical shift -3, midline y=-3' },
      { id: 'fp-independent-1', objectiveId: 'sketch-tan-graph', revealSteps: 0, prompt: 'At which two x-values (0°-360°) does y=tan(x) have vertical asymptotes?', steps: [
        { step: 'tan(x) is undefined wherever cos(x)=0.', justification: 'Recall that tan = sin/cos.' },
        { step: 'cos(x)=0 at x=90° and x=270°.', justification: 'These are the standard points where cosine crosses zero.' },
      ], answer: 'x=90° and x=270°' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'sketch-sin-cos', question: 'At x=180°, what is y=sin(x)?', options: ['0', '1', '-1', 'undefined'], correctIndex: 0, hints: { strategic: 'Recall the shape of the sine wave.', procedural: 'It returns to the midline at 180°.', workedStep: 'sin(180°)=0.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'identify-amplitude-period', question: 'For y = 3sin(x), what is the maximum value the graph reaches?', options: ['3', '1', '0', '-3'], correctIndex: 0, hints: { strategic: 'Amplitude tells you the max height above the midline.', procedural: 'Amplitude = 3, midline = 0.', workedStep: 'Max = 0+3 = 3.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'identify-vertical-shift', question: 'For y = 2cos(x) + 4, what is the midline?', options: ['y = 4', 'y = 2', 'y = 6', 'y = 0'], correctIndex: 0, hints: { strategic: 'The midline is set by the added constant, not the amplitude.', procedural: 'q = 4.', workedStep: 'Midline y=4.' }, distractorMisconceptions: { 1: 'amplitude-vertical-shift-confused' } },
      { id: 'ip-4', objectiveId: 'sketch-tan-graph', question: 'True or false: the tan(x) graph is one smooth unbroken curve like sin(x) and cos(x).', options: ['False — it has vertical asymptotes and breaks', 'True — it looks the same as sin(x)', 'True — it looks the same as cos(x)', 'False — it has no defined shape'], correctIndex: 0, hints: { strategic: 'What happens to tan(x) where cos(x)=0?', procedural: 'It becomes undefined, creating asymptotes.', workedStep: 'The graph breaks into separate branches at 90° and 270°.' }, distractorMisconceptions: { 1: 'tan-asymptotes-missed' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'sketch-sin-cos', multiSelect: false, question: 'At x=90°, what is y=cos(x)?', options: ['0', '1', '-1', 'undefined'], correctIndices: [0], explanation: 'cos(90°)=0.', distractorMisconceptions: { 1: 'sin-cos-graphs-swapped' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'sketch-sin-cos', multiSelect: false, question: 'At x=270°, what is y=sin(x)?', options: ['-1', '1', '0', 'undefined'], correctIndices: [0], explanation: 'sin(270°) reaches its minimum, -1.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'identify-amplitude-period', multiSelect: false, question: 'For y = 6cos(x), what is the amplitude?', options: ['6', '1', '0', '360'], correctIndices: [0], explanation: 'Amplitude is the coefficient of cos, 6.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'identify-amplitude-period', multiSelect: false, question: 'True or false: y=sin(x) and y=7sin(x) have the same period.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — amplitude changes wave height, not how often the wave repeats (both have period 360° here).', distractorMisconceptions: { 1: 'period-changed-by-wrong-parameter' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'identify-vertical-shift', multiSelect: false, question: 'For y = sin(x) + 5, what is the midline?', options: ['y = 5', 'y = 1', 'y = 0', 'y = -5'], correctIndices: [0], explanation: 'The added constant, 5, sets the new midline.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'identify-vertical-shift', multiSelect: false, question: 'For y = 3cos(x) - 2, what is the maximum value reached?', options: ['1', '3', '-2', '5'], correctIndices: [0], explanation: 'Midline is -2, amplitude is 3, so max = -2+3 = 1.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'sketch-tan-graph', multiSelect: false, question: 'True or false: y=tan(x) has vertical asymptotes at x=90° and x=270° in the domain 0°-360°.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — tan is undefined wherever cos(x)=0, which happens at 90° and 270°.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-amplitude-period', multiSelect: true, question: 'Which statements about y = 2sin(x) - 3 are correct? (select all that apply)', options: ['Amplitude is 2', 'Midline is y=-3', 'Amplitude is -3', 'Maximum value is -1'], correctIndices: [0, 1, 3], explanation: 'Amplitude = 2, midline = -3, so max = -3+2 = -1. "-3" itself is not the amplitude, it\'s the vertical shift.', distractorMisconceptions: { 2: 'amplitude-vertical-shift-confused' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'identify-amplitude-period',
      analogy: 'Think of amplitude as the "height of the waves" on the sea, and vertical shift as "the sea level itself." Changing wave height doesn\'t move sea level, and raising sea level doesn\'t change how tall the waves are — they\'re two completely independent adjustments.',
      explanation: 'For y = a·sin(x) + q (or cos): amplitude = |a| (read directly from the coefficient); midline = q (read directly from the constant); maximum = q + |a|; minimum = q - |a|.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'For y = 4sin(x) + 2, find the amplitude, midline, maximum, and minimum.', steps: [
          { step: 'Amplitude = |4| = 4.', justification: 'Read the coefficient directly.' },
          { step: 'Midline = 2.', justification: 'Read the added constant directly.' },
          { step: 'Maximum = 2+4 = 6. Minimum = 2-4 = -2.', justification: 'Add/subtract the amplitude from the midline.' },
        ], answer: 'Amplitude 4, midline y=2, max 6, min -2' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'identify-amplitude-period', question: 'For y = 3cos(x) - 1, find the maximum and minimum.', options: ['Max 2, min -4', 'Max 3, min -3', 'Max -1, min 3', 'Max 4, min -2'], correctIndex: 0, hints: { strategic: 'Max = midline + amplitude; Min = midline - amplitude.', procedural: 'Midline=-1, amplitude=3.', workedStep: 'Max = -1+3=2. Min = -1-3=-4.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'identify-amplitude-period', question: 'For y = 5sin(x) + 3, find the maximum and minimum.', options: ['Max 8, min -2', 'Max 5, min -5', 'Max 3, min -3', 'Max 8, min 3'], correctIndex: 0, hints: { strategic: 'Max = midline + amplitude; Min = midline - amplitude.', procedural: 'Midline=3, amplitude=5.', workedStep: 'Max = 3+5=8. Min = 3-5=-2.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'identify-amplitude-period', question: 'For y = 2cos(x) + 6, find the amplitude and midline.', options: ['Amplitude 2, midline 6', 'Amplitude 6, midline 2', 'Amplitude 8, midline 0', 'Amplitude 2, midline 0'], correctIndex: 0, hints: { strategic: 'Amplitude is the coefficient; midline is the added constant.', procedural: 'Coefficient of cos is 2. Constant is 6.', workedStep: 'Amplitude 2, midline 6.' }, distractorMisconceptions: { 1: 'amplitude-vertical-shift-confused' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the key visual difference between the sin(x) and cos(x) graphs at x=0°?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel sketching and reading trig graphs now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Which was trickier: telling amplitude apart from vertical shift, or understanding the tan graph\'s asymptotes?', type: 'multiple-choice', options: ['Amplitude vs. vertical shift', 'Tan graph asymptotes', 'Both about the same', 'Neither felt difficult'] },
  ],
};
