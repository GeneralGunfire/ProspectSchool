// ── Physical Sciences, Term 3, Topic 3: Motion in One Dimension ──────────────
// Physics strand. Builds on Vectors & Scalars (this term). Introductory Grade 10
// scope: reference frames, distance/displacement, speed/velocity, acceleration,
// and interpreting position-time and velocity-time graphs.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'distance-displacement-equated',
    label: 'Treating distance and displacement as always equal',
    errorType: 'You assumed distance travelled and displacement have the same value, even when the motion involved a change of direction.',
    principle: 'DISTANCE (scalar) is the total path length travelled, and always adds up. DISPLACEMENT (vector) is the straight-line change in position from start to end, accounting for direction. They are only equal in size for motion in a single direction with no backtracking.',
    correctStep: 'Walking 8 m forward then 3 m back: distance = 8 + 3 = 11 m, but displacement = 8 − 3 = 5 m forward — these are not the same.',
  },
  {
    id: 'speed-velocity-conflated',
    label: 'Ignoring direction when using velocity',
    errorType: 'You calculated or interpreted velocity as if it were speed, without considering direction.',
    principle: 'SPEED is a scalar (distance ÷ time, magnitude only). VELOCITY is a vector (displacement ÷ time, magnitude AND direction). A negative velocity means motion in the negative direction, not "negative speed" or an error.',
    correctStep: 'A car moving at "20 m/s west" has a velocity of −20 m/s if east is chosen as positive — the negative sign shows direction, not that something went wrong.',
  },
  {
    id: 'xt-graph-slope-misread',
    label: 'Misreading the vertical value on a position-time graph as speed',
    errorType: 'You read the height (y-value) of a position-time graph as the speed or velocity, instead of reading the slope.',
    principle: 'On a POSITION-TIME graph, the height (y-value) shows POSITION at that instant. The SLOPE (gradient) of the graph shows VELOCITY. A steeper slope means a greater speed; a flat (horizontal) section means the object is at rest.',
    correctStep: 'If a position-time graph shows position = 20 m at t = 4 s, that is the position, not the speed — the speed must be found from the slope of the line.',
  },
  {
    id: 'acceleration-only-speeding-up',
    label: 'Believing acceleration only means "speeding up"',
    errorType: 'You assumed an object is only accelerating when it is getting faster, and that slowing down is not acceleration.',
    principle: 'ACCELERATION is any change in velocity over time — this includes speeding up, slowing down (deceleration, i.e. negative acceleration in the direction of motion), or changing direction. Zero acceleration means constant velocity, not "not accelerating because it\'s not speeding up."',
    correctStep: 'A car braking from 20 m/s to 0 m/s is accelerating (negative acceleration) just as much as a car speeding up from 0 to 20 m/s (positive acceleration).',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 3,
  topicId: 'motion-in-one-dimension',
  topicName: 'Motion in One Dimension',
  prerequisites: [
    'Vectors and Scalars (this term, Topic 2)',
  ],
  objectives: [
    { id: 'distinguish-distance-displacement', text: 'Distinguish between distance and displacement for a given motion.' },
    { id: 'calculate-speed-velocity', text: 'Calculate average speed and average velocity for a given motion.' },
    { id: 'interpret-position-time-graph', text: 'Interpret a position-time graph, including reading position and finding velocity from slope.' },
    { id: 'interpret-velocity-time-graph', text: 'Interpret a velocity-time graph, including reading velocity and identifying acceleration from slope.' },
  ],
  estimatedMinutes: [25, 35],
};

export const motionInOneDimension: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Two runners cover the same distance in a race, but only one of them wins. What\'s actually different about their motion?',
  goalSettingPrompt:
    'Describing motion precisely means separating "how far" from "which way", and reading graphs correctly to see speed and acceleration change over time. By the end of this lesson you\'ll be able to calculate speed, velocity, and acceleration, and read both position-time and velocity-time graphs.',

  activate: {
    connectPrompt: 'You already know displacement is a vector and distance is a scalar (from Vectors and Scalars) — this lesson applies that distinction directly to motion.',
    diagnosticQuestions: [
      { question: 'Is displacement a vector or a scalar quantity?', options: ['Vector', 'Scalar', 'Neither', 'Both'], correctIndex: 0, explanation: 'Displacement has direction, so it is a vector.' },
      { question: 'On a graph, what does a straight, sloped line generally represent?', options: ['A constant rate of change', 'No change at all', 'Random motion', 'An error in the data'], correctIndex: 0, explanation: 'A straight sloped line has a constant gradient, i.e. a constant rate of change.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'To describe motion, first choose a REFERENCE POINT (origin) and a positive direction. POSITION is location relative to that reference point. DISTANCE is the total path length travelled (scalar, always positive, always adds up). DISPLACEMENT is the straight-line change in position from start to end (vector, can be positive or negative depending on direction). AVERAGE SPEED = distance ÷ time (scalar). AVERAGE VELOCITY = displacement ÷ time (vector, direction matters).',
    workedExamples: [
      { id: 'wx-distance-displacement', prompt: 'A jogger runs 6 km east then 2 km west. Find (a) the distance travelled and (b) the displacement (east = positive).', steps: [
        { step: '(a) Distance = total path length = 6 + 2 = 8 km.', justification: 'Distance always adds the full path travelled, regardless of direction.' },
        { step: '(b) Displacement = (+6) + (−2) = +4 km, i.e. 4 km east.', justification: 'Displacement accounts for direction using a sign convention.' },
      ], answer: '(a) 8 km, (b) 4 km east' },
      { id: 'wx-average-velocity', prompt: 'A cyclist has a displacement of 12 km east in 40 minutes (2/3 hour). Find the average velocity.', steps: [
        { step: 'Average velocity = displacement ÷ time = 12 km ÷ (2/3 h).', justification: 'Average velocity uses displacement, not distance.' },
        { step: 'Average velocity = 12 ÷ 0,667 = 18 km/h east.', justification: 'Divide displacement by time, keeping the direction.' },
      ], answer: '18 km/h east' },
    ],
    knowledgeChecks: [
      { question: 'A hiker walks 10 m forward then 10 m back to the start. What is the displacement?', options: ['0 m', '20 m', '10 m', '−10 m'], correctIndex: 0, explanation: 'The hiker ends up exactly where they started, so displacement is zero.', misconceptionId: 'distance-displacement-equated' },
      { question: 'A car has a velocity of −15 m/s (with east as positive). What does the negative sign mean?', options: ['It is moving west', 'The car has a calculation error', 'The car is decelerating', 'It has no meaning'], correctIndex: 0, explanation: 'A negative velocity indicates motion in the negative (west) direction.', misconceptionId: 'speed-velocity-conflated' },
    ],
    confidenceCheckPrompt: 'How confident do you feel distinguishing distance from displacement and calculating average speed and velocity?',
  },

  demonstrateChunk2: {
    explanation:
      'A POSITION-TIME (x-t) graph plots position on the y-axis against time on the x-axis: the SLOPE of the graph gives VELOCITY, and a flat (horizontal) section means the object is at rest. A VELOCITY-TIME (v-t) graph plots velocity against time: the SLOPE gives ACCELERATION, and the AREA under the graph gives displacement. UNIFORM motion means constant speed/velocity (straight-line x-t graph, flat v-t graph); NON-UNIFORM motion means changing speed/velocity (curved x-t graph, sloped v-t graph).',
    workedExamples: [
      { id: 'wx-xt-slope', prompt: 'A position-time graph shows position increasing steadily from 0 m to 20 m over 5 s. Find the velocity.', steps: [
        { step: 'Velocity = slope of the x-t graph = change in position ÷ change in time.', justification: 'Slope of a position-time graph equals velocity.' },
        { step: 'Velocity = (20 − 0) ÷ (5 − 0) = 4 m/s.', justification: 'Substitute the rise and run of the straight-line graph.' },
      ], answer: '4 m/s' },
      { id: 'wx-vt-slope', prompt: 'A velocity-time graph shows velocity increasing from 0 m/s to 12 m/s over 3 s. Find the acceleration.', steps: [
        { step: 'Acceleration = slope of the v-t graph = change in velocity ÷ change in time.', justification: 'Slope of a velocity-time graph equals acceleration.' },
        { step: 'Acceleration = (12 − 0) ÷ (3 − 0) = 4 m/s².', justification: 'Substitute the rise and run of the straight-line graph.' },
      ], answer: '4 m/s²' },
    ],
    knowledgeChecks: [
      { question: 'On a position-time graph, a flat horizontal section means the object is:', options: ['At rest (not moving)', 'Moving at maximum speed', 'Accelerating', 'Off the graph'], correctIndex: 0, explanation: 'A flat x-t line means position isn\'t changing, so the object is at rest.', misconceptionId: 'xt-graph-slope-misread' },
      { question: 'A velocity-time graph shows velocity decreasing from 20 m/s to 0 m/s. Is the object accelerating?', options: ['Yes — this is negative acceleration (deceleration)', 'No — only speeding up counts as acceleration', 'No — this is impossible', 'Yes, but only if it speeds up again after'], correctIndex: 0, explanation: 'A change in velocity, including slowing down, is acceleration.', misconceptionId: 'acceleration-only-speeding-up' },
    ],
    confidenceCheckPrompt: 'How confident do you feel reading velocity from a position-time graph and acceleration from a velocity-time graph?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'distinguish-distance-displacement', revealSteps: 2, prompt: 'A swimmer swims 25 m to the far end of a pool and back to the start. Find the distance and displacement.', steps: [
        { step: 'Distance = 25 + 25 = 50 m (total path length).', justification: 'Distance adds up the entire path travelled.' },
        { step: 'Displacement = 0 m, since the swimmer returns to the starting point.', justification: 'Displacement is the net change in position from start to end.' },
      ], answer: 'Distance = 50 m, Displacement = 0 m' },
      { id: 'fp-partial-1', objectiveId: 'calculate-speed-velocity', revealSteps: 1, prompt: 'A car travels 90 km in 1,5 hours in a straight line, always moving forward. Find its average speed and average velocity.', steps: [
        { step: 'Average speed = distance ÷ time = 90 ÷ 1,5 = 60 km/h.', justification: 'No direction change, so distance travelled equals displacement magnitude.' },
        { step: 'Since motion is a straight line with no backtracking, average velocity has the same magnitude: 60 km/h in the direction of travel.', justification: 'With no reversal, displacement magnitude equals distance.' },
      ], answer: 'Average speed = 60 km/h; average velocity = 60 km/h (forward)' },
      { id: 'fp-independent-1', objectiveId: 'interpret-velocity-time-graph', revealSteps: 0, prompt: 'A velocity-time graph shows a constant velocity of 10 m/s for 6 s (a flat horizontal line). What is the acceleration during this time?', steps: [
        { step: 'The slope of a flat (horizontal) line is zero, so acceleration = 0 m/s².', justification: 'A flat v-t line means velocity is not changing, so there is no acceleration.' },
      ], answer: '0 m/s²' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'distinguish-distance-displacement', question: 'A runner completes one full lap of a 400 m track, ending where they started. What is the displacement?', options: ['0 m', '400 m', '200 m', '800 m'], correctIndex: 0, hints: { strategic: 'Displacement depends only on start and end position.', procedural: 'Start position = end position after one full lap.', workedStep: '0 m.' }, distractorMisconceptions: { 1: 'distance-displacement-equated' } },
      { id: 'ip-2', objectiveId: 'calculate-speed-velocity', question: 'A cyclist has a displacement of 30 km west in 2 hours. What is the average velocity?', options: ['15 km/h west', '15 km/h east', '60 km/h west', '30 km/h west'], correctIndex: 0, hints: { strategic: 'Average velocity = displacement ÷ time, keep the direction.', procedural: '30 ÷ 2 = 15, direction stays west.', workedStep: '15 km/h west.' }, distractorMisconceptions: { 1: 'speed-velocity-conflated' } },
      { id: 'ip-3', objectiveId: 'interpret-position-time-graph', question: 'A position-time graph has a steeper slope in the first 2 s than in the next 2 s. What does this mean?', options: ['The object was moving faster in the first 2 s', 'The object was at a higher position always', 'The object was accelerating at a constant rate', 'Nothing can be determined'], correctIndex: 0, hints: { strategic: 'Slope of an x-t graph gives velocity.', procedural: 'A steeper slope means a greater velocity magnitude.', workedStep: 'Faster in the first 2 s.' }, distractorMisconceptions: { 1: 'xt-graph-slope-misread' } },
      { id: 'ip-4', objectiveId: 'interpret-velocity-time-graph', question: 'A velocity-time graph shows velocity dropping from 18 m/s to 6 m/s over 4 s (a straight, downward-sloping line). Is the object accelerating?', options: ['Yes, with negative acceleration', 'No, only speeding up is acceleration', 'No, the object is stationary', 'Yes, but only briefly'], correctIndex: 0, hints: { strategic: 'Any change in velocity over time is acceleration.', procedural: 'Velocity is decreasing, so acceleration is negative.', workedStep: 'Yes, negative acceleration.' }, distractorMisconceptions: { 1: 'acceleration-only-speeding-up' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'distinguish-distance-displacement', multiSelect: false, question: 'True or false: distance and displacement are always numerically equal.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — they are only equal when motion is in one direction with no backtracking.', distractorMisconceptions: { 0: 'distance-displacement-equated' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'distinguish-distance-displacement', multiSelect: false, question: 'A person walks 4 m east then 4 m west. What is their displacement?', options: ['0 m', '8 m', '4 m east', '4 m west'], correctIndices: [0], explanation: 'They return to the start, so displacement is zero.', distractorMisconceptions: { 1: 'distance-displacement-equated' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'calculate-speed-velocity', multiSelect: false, question: 'A car covers 150 km of distance (with some direction changes) in 3 hours. What is its average speed?', options: ['50 km/h', '450 km/h', '3 km/h', '147 km/h'], correctIndices: [0], explanation: 'Average speed = total distance ÷ time = 150 ÷ 3 = 50 km/h.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'calculate-speed-velocity', multiSelect: false, question: 'A runner has a displacement of 100 m north in 20 s. What is the average velocity?', options: ['5 m/s north', '2000 m/s north', '5 m/s south', '20 m/s north'], correctIndices: [0], explanation: 'Average velocity = displacement ÷ time = 100 ÷ 20 = 5 m/s north.', distractorMisconceptions: { 2: 'speed-velocity-conflated' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'interpret-position-time-graph', multiSelect: false, question: 'A position-time graph is a straight line rising from 0 m to 40 m over 8 s. What is the velocity?', options: ['5 m/s', '40 m/s', '8 m/s', '320 m/s'], correctIndices: [0], explanation: 'Velocity = slope = (40 − 0) ÷ (8 − 0) = 5 m/s.', distractorMisconceptions: { 1: 'xt-graph-slope-misread' } },
    { id: 'q6', type: 'true-false', objectiveId: 'interpret-position-time-graph', multiSelect: false, question: 'True or false: the height of a point on a position-time graph tells you the object\'s speed at that time.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — height gives position; the slope gives speed/velocity.', distractorMisconceptions: { 0: 'xt-graph-slope-misread' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'interpret-velocity-time-graph', multiSelect: false, question: 'A velocity-time graph is a straight line falling from 30 m/s to 10 m/s over 5 s. What is the acceleration?', options: ['−4 m/s²', '4 m/s²', '−20 m/s²', '20 m/s²'], correctIndices: [0], explanation: 'Acceleration = slope = (10 − 30) ÷ (5 − 0) = −4 m/s².', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'interpret-velocity-time-graph', multiSelect: true, question: 'On a velocity-time graph, which of these situations represent acceleration? (select all that apply)', options: ['Velocity increasing over time', 'Velocity decreasing over time', 'Velocity constant over time', 'Velocity changing direction over time'], correctIndices: [0, 1, 3], explanation: 'Any change in velocity — speeding up, slowing down, or reversing direction — is acceleration; constant velocity is not.', distractorMisconceptions: { 2: 'acceleration-only-speeding-up' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'interpret-velocity-time-graph',
      analogy: 'Think of a velocity-time graph like a hill: how STEEP the hill is (the slope) tells you how quickly velocity is changing — that\'s acceleration. It doesn\'t matter if the hill goes up or down; either way, you\'re on a slope, which means acceleration is happening.',
      explanation: 'To read acceleration from a v-t graph: (1) pick two points on the line, (2) find the change in velocity (rise) between them, (3) find the change in time (run) between them, (4) divide rise by run. A flat line has zero slope, meaning zero acceleration (constant velocity).',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A v-t graph shows velocity dropping from 24 m/s to 8 m/s over 4 s. Find the acceleration.', steps: [
          { step: 'Rise = 8 − 24 = −16 m/s; run = 4 − 0 = 4 s.', justification: 'Find the change in velocity and the change in time between the two points.' },
          { step: 'Acceleration = rise ÷ run = −16 ÷ 4 = −4 m/s².', justification: 'Divide the change in velocity by the change in time.' },
        ], answer: '−4 m/s² (deceleration)' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'interpret-velocity-time-graph', question: 'A v-t graph shows velocity rising from 5 m/s to 25 m/s over 5 s. What is the acceleration?', options: ['4 m/s²', '5 m/s²', '20 m/s²', '30 m/s²'], correctIndex: 0, hints: { strategic: 'Find rise ÷ run.', procedural: '(25 − 5) ÷ (5 − 0).', workedStep: '4 m/s².' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'interpret-velocity-time-graph', question: 'A v-t graph is a flat horizontal line at 15 m/s for 10 s. What is the acceleration?', options: ['0 m/s²', '1,5 m/s²', '15 m/s²', '150 m/s²'], correctIndex: 0, hints: { strategic: 'A flat line has zero slope.', procedural: 'No change in velocity over time.', workedStep: '0 m/s².' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'interpret-velocity-time-graph', question: 'A v-t graph shows velocity dropping from 40 m/s to 0 m/s over 8 s. What is the acceleration?', options: ['−5 m/s²', '5 m/s²', '−40 m/s²', '0 m/s²'], correctIndex: 0, hints: { strategic: 'Find rise ÷ run.', procedural: '(0 − 40) ÷ (8 − 0).', workedStep: '−5 m/s².' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Explain in your own words why distance and displacement can be different values for the same motion.', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel reading position-time and velocity-time graphs now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What does the slope of a velocity-time graph represent?', type: 'multiple-choice', options: ['Acceleration', 'Displacement', 'Distance', 'Position'] },
  ],
};
