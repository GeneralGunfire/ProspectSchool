// ── Physical Sciences, Term 3, Topic 2: Vectors and Scalars ──────────────────
// Physics strand, opens the Mechanics block. Introductory Grade 10 scope:
// scalar vs vector quantities, representing vectors as arrows, and adding/
// subtracting collinear (1D) vectors using a chosen positive direction.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'vector-scalar-conflated',
    label: 'Treating a vector quantity and its scalar counterpart as the same thing',
    errorType: 'You used a vector quantity (like displacement) and a scalar quantity (like distance) interchangeably, or named one when you meant the other.',
    principle: 'A SCALAR has magnitude only (e.g. distance, speed). A VECTOR has both magnitude AND direction (e.g. displacement, velocity). They are only equal in size when the motion is a straight line in one direction with no backtracking — never assume they are the same quantity.',
    correctStep: 'Walking 5 m east then 3 m west: the DISTANCE travelled is 8 m (scalar, adds up), but the DISPLACEMENT is 2 m east (vector, accounts for direction).',
  },
  {
    id: 'direction-ignored-in-addition',
    label: 'Adding vector magnitudes without accounting for direction',
    errorType: 'You added or subtracted vector magnitudes as plain numbers, ignoring whether they pointed in the same or opposite directions.',
    principle: 'Vectors in the SAME direction as the chosen positive direction are added as positive values; vectors in the OPPOSITE direction are subtracted (treated as negative). You must always assign a sign based on direction before combining vectors.',
    correctStep: 'A vector of 6 m right and a vector of 4 m left (with right chosen as positive): resultant = (+6) + (−4) = +2 m, i.e. 2 m to the right — not 10 m.',
  },
  {
    id: 'inconsistent-reference-direction',
    label: 'Switching which direction is "positive" partway through a problem',
    errorType: 'You changed which direction counted as positive partway through solving a problem, making some of your signs inconsistent.',
    principle: 'Before solving any vector problem, choose ONE positive direction and use it consistently for every vector in that problem — switching partway through will scramble your signs and produce a wrong resultant.',
    correctStep: 'If right is chosen as positive at the start of a problem, every vector pointing left must be entered as negative for the entire solution — not just for some steps.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 3,
  topicId: 'vectors-and-scalars',
  topicName: 'Vectors and Scalars',
  prerequisites: [
    'Basic algebra with signed numbers',
  ],
  objectives: [
    { id: 'classify-scalar-vector', text: 'Classify a given physical quantity as a scalar or a vector.' },
    { id: 'represent-vector-as-arrow', text: 'Represent a vector using an arrow with appropriate direction and relative length.' },
    { id: 'add-collinear-vectors', text: 'Add or subtract two or more collinear (1D) vectors using a consistent sign convention.' },
  ],
  estimatedMinutes: [20, 30],
};

export const vectorsAndScalars: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'If someone tells you "I walked 5 km," do you know exactly where they ended up?',
  goalSettingPrompt:
    'Some quantities in physics only need a size to be fully described, but others need a direction too — and mixing these up leads to wrong answers throughout mechanics. By the end of this lesson you\'ll be able to tell scalars and vectors apart, draw vectors correctly, and combine vectors along a straight line.',

  activate: {
    connectPrompt: 'You already use direction informally every day — "5 km north" tells you more than just "5 km." This lesson makes that distinction precise.',
    diagnosticQuestions: [
      { question: 'Does "10 m/s" on its own tell you which way something is moving?', options: ['No — it has no direction given', 'Yes — direction is implied', 'It is always north', 'Speed always includes direction'], correctIndex: 0, explanation: 'A bare number like 10 m/s has no direction attached.' },
      { question: 'If you walk in a straight line without turning back, are distance and displacement equal in size?', options: ['Yes', 'No', 'Never', 'Only if you run'], correctIndex: 0, explanation: 'With no direction changes, distance and displacement magnitudes match.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A SCALAR quantity has magnitude (size) only — examples include distance, speed, mass, and time. A VECTOR quantity has both magnitude AND direction — examples include displacement, velocity, acceleration, and force. To tell them apart, ask: "does direction matter for describing this quantity?" If yes, it\'s a vector. Vectors are represented as ARROWS: the length shows magnitude (to scale), and the arrowhead shows direction.',
    workedExamples: [
      { id: 'wx-classify', prompt: 'Classify each as scalar or vector: (a) 60 km/h, (b) 60 km/h north, (c) mass of 5 kg.', steps: [
        { step: '(a) "60 km/h" has magnitude only, no direction stated — this is speed, a scalar.', justification: 'No direction is given, so only magnitude is described.' },
        { step: '(b) "60 km/h north" has both magnitude and direction — this is velocity, a vector.', justification: 'A direction ("north") is attached to the magnitude.' },
        { step: '(c) "5 kg" is a magnitude with no direction — mass is always a scalar.', justification: 'Mass has no directional meaning.' },
      ], answer: '(a) Scalar (speed), (b) Vector (velocity), (c) Scalar (mass)' },
      { id: 'wx-draw-vector', prompt: 'A car travels 40 km east. Represent this displacement as a vector diagram description.', steps: [
        { step: 'Choose a scale, e.g. 1 cm : 10 km, so 40 km is represented by a 4 cm arrow.', justification: 'The arrow length must be proportional to the magnitude.' },
        { step: 'Draw the arrow pointing east, with the arrowhead on the east end.', justification: 'The arrowhead shows the direction of the vector.' },
      ], answer: 'A 4 cm arrow pointing east (at 1 cm : 10 km scale)' },
    ],
    knowledgeChecks: [
      { question: 'Which of these is a vector quantity?', options: ['Acceleration', 'Mass', 'Time', 'Distance'], correctIndex: 0, explanation: 'Acceleration has both magnitude and direction.', misconceptionId: 'vector-scalar-conflated' },
      { question: 'What does the length of a vector arrow represent?', options: ['Its magnitude, to scale', 'Its direction only', 'Nothing meaningful', 'Its mass'], correctIndex: 0, explanation: 'Arrow length is drawn proportional to magnitude.' },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying quantities as scalar or vector, and drawing vector arrows?',
  },

  demonstrateChunk2: {
    explanation:
      'To add or subtract VECTORS ALONG A STRAIGHT LINE (1D / collinear vectors), first choose ONE positive direction and stick to it for the whole problem. Vectors pointing in the positive direction keep their sign as given; vectors pointing in the opposite direction are treated as NEGATIVE. Then simply add the signed values together — the sign of the RESULTANT tells you its direction, and its size (ignoring sign) tells you its magnitude.',
    workedExamples: [
      { id: 'wx-add-same-direction', prompt: 'A hiker walks 3 km east, then 2 km east. Find the resultant displacement (choose east as positive).', steps: [
        { step: 'Both vectors point in the positive (east) direction: +3 km and +2 km.', justification: 'Same-direction vectors both take the positive sign.' },
        { step: 'Resultant = (+3) + (+2) = +5 km, i.e. 5 km east.', justification: 'Add the signed magnitudes.' },
      ], answer: '5 km east' },
      { id: 'wx-add-opposite-direction', prompt: 'A hiker walks 7 km east, then 4 km west. Find the resultant displacement (choose east as positive).', steps: [
        { step: 'East is positive, so 7 km east = +7 km; west is opposite, so 4 km west = −4 km.', justification: 'Assign signs based on the chosen positive direction.' },
        { step: 'Resultant = (+7) + (−4) = +3 km, i.e. 3 km east.', justification: 'Add the signed magnitudes; the positive result means the resultant points east.' },
      ], answer: '3 km east' },
    ],
    knowledgeChecks: [
      { question: 'A vector of 8 m right and a vector of 5 m left are added (right = positive). What is the resultant?', options: ['3 m right', '13 m right', '3 m left', '13 m left'], correctIndex: 0, explanation: '(+8) + (−5) = +3, i.e. 3 m right.', misconceptionId: 'direction-ignored-in-addition' },
      { question: 'In a problem where "up" was chosen as positive at the start, can you switch to "down = positive" halfway through to make a calculation easier?', options: ['No — this would make signs inconsistent', 'Yes, whenever convenient', 'Only for the last step', 'It doesn\'t matter'], correctIndex: 0, explanation: 'The reference direction must stay the same throughout a single problem.', misconceptionId: 'inconsistent-reference-direction' },
    ],
    confidenceCheckPrompt: 'How confident do you feel adding and subtracting vectors along a straight line using a sign convention?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'classify-scalar-vector', revealSteps: 1, prompt: 'Classify "15 m/s² downward" as scalar or vector.', steps: [
        { step: 'It has a magnitude (15 m/s²) and a direction (downward) — this is a vector (acceleration).', justification: 'Both magnitude and direction are given.' },
      ], answer: 'Vector' },
      { id: 'fp-partial-1', objectiveId: 'add-collinear-vectors', revealSteps: 1, prompt: 'A trolley moves 6 m left, then 9 m right. Find the resultant displacement (choose right as positive).', steps: [
        { step: '6 m left = −6 m; 9 m right = +9 m.', justification: 'Assign signs based on the chosen positive direction.' },
        { step: 'Resultant = (−6) + (+9) = +3 m, i.e. 3 m right.', justification: 'Add the signed magnitudes.' },
      ], answer: '3 m right' },
      { id: 'fp-independent-1', objectiveId: 'represent-vector-as-arrow', revealSteps: 0, prompt: 'Describe how you would draw a vector representing 20 N applied downward, using a scale of 1 cm : 10 N.', steps: [
        { step: 'A 2 cm arrow pointing straight down, since 20 N ÷ 10 N per cm = 2 cm.', justification: 'Arrow length is proportional to magnitude at the chosen scale, direction matches the given direction.' },
      ], answer: 'A 2 cm arrow pointing downward' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'classify-scalar-vector', question: 'Which of these is a scalar quantity?', options: ['Speed', 'Velocity', 'Force', 'Displacement'], correctIndex: 0, hints: { strategic: 'Ask: does this quantity need a direction to be fully described?', procedural: 'Speed only describes "how fast", not "which way".', workedStep: 'Speed is a scalar.' }, distractorMisconceptions: { 1: 'vector-scalar-conflated' } },
      { id: 'ip-2', objectiveId: 'represent-vector-as-arrow', question: 'A vector diagram uses a scale of 1 cm : 5 km. How long should the arrow be for a displacement of 25 km?', options: ['5 cm', '25 cm', '1 cm', '0,2 cm'], correctIndex: 0, hints: { strategic: 'Divide the magnitude by what 1 cm represents.', procedural: '25 km ÷ 5 km per cm.', workedStep: '5 cm.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'add-collinear-vectors', question: 'A swimmer swims 12 m north, then 5 m south. What is the resultant displacement (north = positive)?', options: ['7 m north', '17 m north', '7 m south', '17 m south'], correctIndex: 0, hints: { strategic: 'Assign signs: north positive, south negative.', procedural: '(+12) + (−5).', workedStep: '7 m north.' }, distractorMisconceptions: { 1: 'direction-ignored-in-addition' } },
      { id: 'ip-4', objectiveId: 'add-collinear-vectors', question: 'Two forces act on an object: 10 N right and 10 N left. What is the resultant force?', options: ['0 N', '20 N right', '20 N left', '10 N right'], correctIndex: 0, hints: { strategic: 'Assign opposite signs since the forces point in opposite directions.', procedural: '(+10) + (−10).', workedStep: '0 N.' }, distractorMisconceptions: { 1: 'direction-ignored-in-addition' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'classify-scalar-vector', multiSelect: false, question: 'Which of these is a vector quantity?', options: ['Displacement', 'Distance', 'Speed', 'Time'], correctIndices: [0], explanation: 'Displacement has both magnitude and direction.', distractorMisconceptions: { 1: 'vector-scalar-conflated' } },
    { id: 'q2', type: 'true-false', objectiveId: 'classify-scalar-vector', multiSelect: false, question: 'True or false: "mass" is a vector quantity.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — mass has magnitude only, no direction; it is a scalar.', distractorMisconceptions: { 0: 'vector-scalar-conflated' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'represent-vector-as-arrow', multiSelect: false, question: 'On a vector diagram, what does the arrowhead indicate?', options: ['The direction of the vector', 'The magnitude of the vector', 'Nothing — it is decorative', 'The scale used'], correctIndices: [0], explanation: 'The arrowhead shows which way the vector points.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'add-collinear-vectors', multiSelect: false, question: 'A cyclist rides 15 m east, then 6 m west. What is the resultant displacement (east = positive)?', options: ['9 m east', '21 m east', '9 m west', '21 m west'], correctIndices: [0], explanation: '(+15) + (−6) = +9, i.e. 9 m east.', distractorMisconceptions: { 1: 'direction-ignored-in-addition' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'add-collinear-vectors', multiSelect: false, question: 'Two vectors of 4 N and 6 N act in the same direction. What is the resultant magnitude?', options: ['10 N', '2 N', '24 N', '0 N'], correctIndices: [0], explanation: 'Same-direction vectors add directly: 4 + 6 = 10 N.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'add-collinear-vectors', multiSelect: false, question: 'True or false: you can change which direction is "positive" partway through solving a single vector problem, as long as you get an answer.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the positive direction must stay consistent throughout the whole problem.', distractorMisconceptions: { 0: 'inconsistent-reference-direction' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'add-collinear-vectors', multiSelect: false, question: 'A boat moves 20 m upstream (against current, taken as negative) then 8 m downstream (positive). What is the resultant?', options: ['12 m upstream', '28 m upstream', '12 m downstream', '28 m downstream'], correctIndices: [0], explanation: '(−20) + (+8) = −12, i.e. 12 m upstream.', distractorMisconceptions: { 1: 'direction-ignored-in-addition' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'classify-scalar-vector', multiSelect: true, question: 'Which of these are vector quantities? (select all that apply)', options: ['Velocity', 'Force', 'Distance', 'Mass'], correctIndices: [0, 1], explanation: 'Velocity and force both have direction; distance and mass do not.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'add-collinear-vectors',
      analogy: 'Think of a number line where you\'re standing at zero. Walking in the positive direction adds to your position; walking in the negative direction subtracts. Vector addition along a line works exactly the same way — direction just becomes a plus or minus sign.',
      explanation: 'To add collinear vectors: (1) choose one direction as positive and stick with it, (2) write every vector as a signed number based on that choice, (3) add the signed numbers, (4) interpret the sign of your answer as a direction.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A ball rolls 5 m right, then 5 m left. Find the resultant displacement (right = positive).', steps: [
          { step: '5 m right = +5 m; 5 m left = −5 m.', justification: 'Assign signs based on the chosen positive direction.' },
          { step: 'Resultant = (+5) + (−5) = 0 m.', justification: 'The ball ends up back where it started, so the net displacement is zero.' },
        ], answer: '0 m (returns to start)' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'add-collinear-vectors', question: 'A car drives 10 km north, then 4 km north. What is the resultant displacement (north = positive)?', options: ['14 km north', '6 km north', '14 km south', '6 km south'], correctIndex: 0, hints: { strategic: 'Both vectors point the same way.', procedural: '(+10) + (+4).', workedStep: '14 km north.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'add-collinear-vectors', question: 'A lift moves 12 m up, then 15 m down. What is the resultant displacement (up = positive)?', options: ['3 m down', '27 m down', '3 m up', '27 m up'], correctIndex: 0, hints: { strategic: 'Assign up as positive, down as negative.', procedural: '(+12) + (−15).', workedStep: '3 m down.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'add-collinear-vectors', question: 'Two forces of 8 N and 3 N act in opposite directions on an object. What is the resultant magnitude?', options: ['5 N', '11 N', '24 N', '0 N'], correctIndex: 0, hints: { strategic: 'Opposite directions mean opposite signs.', procedural: '(+8) + (−3).', workedStep: '5 N.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the key difference between a scalar and a vector quantity?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel classifying quantities and adding vectors along a straight line now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the first step you should always take before adding or subtracting vectors?', type: 'multiple-choice', options: ['Choose a consistent positive direction', 'Ignore direction and just add magnitudes', 'Always assume east is positive', 'Draw the vectors the same length'] },
  ],
};
