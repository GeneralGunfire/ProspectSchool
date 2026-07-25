// ── Physical Sciences, Term 3, Topic 4: Equations of Motion ──────────────────
// Physics strand. Builds directly on Motion in One Dimension (this term).
// Introductory Grade 10 scope: the three kinematic equations for constant
// (uniform) acceleration in one dimension, and solving word problems with them.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'equations-used-for-nonconstant-acceleration',
    label: 'Applying the kinematic equations when acceleration is not constant',
    errorType: 'You used v = u + at (or another kinematic equation) for a situation where acceleration was changing, not constant.',
    principle: 'The three kinematic equations (v = u + at, s = ut + ½at², v² = u² + 2as) are ONLY valid when acceleration is CONSTANT (uniform) throughout the motion. If acceleration changes partway through, the motion must be split into separate constant-acceleration phases.',
    correctStep: 'A car that accelerates steadily then suddenly brakes must be treated as two separate phases, each with its own constant acceleration — not one equation covering the whole trip.',
  },
  {
    id: 'initial-velocity-assumed-zero',
    label: 'Assuming initial velocity (u) is always zero',
    errorType: 'You set u = 0 in a kinematic equation without checking whether the problem actually stated a starting velocity.',
    principle: 'The initial velocity, u, is only zero when an object STARTS FROM REST — this must be stated or clearly implied in the problem. If the object is already moving at the start of the time interval being considered, u is whatever that starting velocity is, not automatically zero.',
    correctStep: 'A car "already travelling at 15 m/s" that then accelerates has u = 15 m/s, not u = 0 m/s.',
  },
  {
    id: 'sign-convention-inconsistent-motion',
    label: 'Using inconsistent signs for u, v, a, and s within one problem',
    errorType: 'You mixed positive and negative signs inconsistently for velocity, acceleration, and displacement within the same kinematics problem.',
    principle: 'Before substituting into any kinematic equation, choose ONE positive direction and apply it consistently to every value: u, v, a, and s must all use the same sign convention for the same problem — a deceleration in the positive direction is a NEGATIVE acceleration.',
    correctStep: 'If "forward" is chosen as positive and a car is braking while moving forward, its acceleration must be entered as negative (e.g. −3 m/s²), even though it is "positive" in the sense of being given as a magnitude in the question.',
  },
  {
    id: 'unit-mismatch-in-substitution',
    label: 'Substituting values with mismatched units',
    errorType: 'You substituted values into a kinematic equation without converting them to consistent units first (e.g. mixing km/h with seconds).',
    principle: 'All values substituted into a kinematic equation must use CONSISTENT SI units: velocity in m/s, time in s, acceleration in m/s², displacement in m. Convert km/h to m/s (divide by 3,6) and any other mismatched units before substituting.',
    correctStep: 'A velocity of "72 km/h" must be converted to 72 ÷ 3,6 = 20 m/s before it is substituted into an equation alongside a time given in seconds.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 3,
  topicId: 'equations-of-motion',
  topicName: 'Equations of Motion',
  prerequisites: [
    'Motion in One Dimension (this term, Topic 3)',
    'Vectors and Scalars (this term, Topic 2)',
  ],
  objectives: [
    { id: 'identify-constant-acceleration', text: 'Identify whether a described motion involves constant acceleration.' },
    { id: 'select-and-apply-kinematic-equation', text: 'Select and apply the correct kinematic equation to find an unknown quantity (u, v, a, t, or s).' },
    { id: 'solve-kinematics-word-problems', text: 'Translate a word problem into known/unknown kinematic quantities and solve for the requested value, using a consistent sign convention.' },
  ],
  estimatedMinutes: [25, 35],
};

export const equationsOfMotion: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'A car brakes to avoid an obstacle. How far does it actually travel before stopping — and can you calculate that before it happens?',
  goalSettingPrompt:
    'When acceleration is constant, three equations let you find any missing piece of the motion — starting velocity, final velocity, acceleration, time, or displacement — from the others. By the end of this lesson you\'ll be able to pick the right equation for a problem and solve it with correct signs and units.',

  activate: {
    connectPrompt: 'You already know that acceleration is the slope of a velocity-time graph — for constant acceleration, that graph is a straight line, which is exactly what makes these equations work.',
    diagnosticQuestions: [
      { question: 'On a velocity-time graph, what does a straight (non-curved) line indicate about acceleration?', options: ['Acceleration is constant', 'Acceleration is always zero', 'Acceleration is increasing over time', 'Nothing can be determined'], correctIndex: 0, explanation: 'A straight-line v-t graph has a constant slope, meaning constant acceleration.' },
      { question: 'If a car starts "from rest", what is its initial velocity?', options: ['0 m/s', 'Unknown', 'Equal to its final velocity', 'Always negative'], correctIndex: 0, explanation: '"From rest" means the starting velocity is zero.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'When acceleration is CONSTANT, three kinematic equations relate the quantities u (initial velocity), v (final velocity), a (acceleration), t (time), and s (displacement): v = u + at; s = ut + ½at²; v² = u² + 2as. To use them: first choose a positive direction and apply it consistently to every value; then list the knowns and the unknown; then choose the equation that contains exactly those variables.',
    workedExamples: [
      { id: 'wx-find-final-velocity', prompt: 'A cyclist starts at 2 m/s and accelerates at 1,5 m/s² for 4 s. Find the final velocity.', steps: [
        { step: 'Knowns: u = 2 m/s, a = 1,5 m/s², t = 4 s. Unknown: v. Use v = u + at.', justification: 'This equation directly relates u, a, t, and v — exactly the known and unknown quantities.' },
        { step: 'v = 2 + (1,5 × 4) = 2 + 6 = 8 m/s.', justification: 'Substitute the known values and calculate.' },
      ], answer: '8 m/s' },
      { id: 'wx-find-displacement', prompt: 'A car starts from rest and accelerates at 3 m/s² for 5 s. Find the displacement.', steps: [
        { step: 'Knowns: u = 0 m/s (starts from rest), a = 3 m/s², t = 5 s. Unknown: s. Use s = ut + ½at².', justification: 'This equation relates u, a, t, and s.' },
        { step: 's = (0 × 5) + ½(3)(5²) = 0 + ½(3)(25) = 37,5 m.', justification: 'Substitute the known values and calculate, remembering u = 0 removes the first term.' },
      ], answer: '37,5 m' },
    ],
    knowledgeChecks: [
      { question: 'A ball is dropped and falls with constant acceleration. Which kinematic equation directly relates u, a, t, and v?', options: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'None of them'], correctIndex: 0, explanation: 'v = u + at contains exactly u, a, t, and v.' },
      { question: 'A skater "starts from rest" and speeds up. What value should be used for u?', options: ['0 m/s', 'Cannot be determined', 'Equal to the final velocity', 'The acceleration value'], correctIndex: 0, explanation: '"Starts from rest" always means u = 0 m/s.', misconceptionId: 'initial-velocity-assumed-zero' },
    ],
    confidenceCheckPrompt: 'How confident do you feel selecting and applying a kinematic equation when u, a, t, or v are known?',
  },

  demonstrateChunk2: {
    explanation:
      'When TIME is not known or not needed, use v² = u² + 2as, which relates u, v, a, and s without t. Before solving ANY kinematics problem: (1) choose one positive direction and apply it to every value consistently — a deceleration acting opposite to the direction of motion is NEGATIVE; (2) convert all units to SI (m/s, s, m/s², m) before substituting, e.g. divide km/h by 3,6 to get m/s.',
    workedExamples: [
      { id: 'wx-find-acceleration-no-time', prompt: 'A car increases its velocity from 10 m/s to 26 m/s over a displacement of 72 m. Find its acceleration.', steps: [
        { step: 'Knowns: u = 10 m/s, v = 26 m/s, s = 72 m. Unknown: a. Use v² = u² + 2as, since time isn\'t given.', justification: 'This equation relates u, v, a, and s without needing t.' },
        { step: '26² = 10² + 2a(72) → 676 = 100 + 144a → a = (676 − 100) ÷ 144 = 4 m/s².', justification: 'Substitute known values, then solve algebraically for a.' },
      ], answer: '4 m/s²' },
      { id: 'wx-braking-distance', prompt: 'A car travelling at 72 km/h (converted to m/s) brakes with an acceleration of −5 m/s² until it stops. Find the braking distance.', steps: [
        { step: 'Convert velocity to SI units: 72 km/h ÷ 3,6 = 20 m/s. Knowns: u = 20 m/s, v = 0 m/s (stops), a = −5 m/s². Unknown: s.', justification: 'Convert to consistent SI units and identify knowns before substituting; "stops" means v = 0.' },
        { step: 'Use v² = u² + 2as: 0² = 20² + 2(−5)s → 0 = 400 − 10s → s = 40 m.', justification: 'Substitute known values, respecting the negative sign for deceleration, then solve for s.' },
      ], answer: '40 m' },
    ],
    knowledgeChecks: [
      { question: 'A car moving forward brakes to a stop. If "forward" is chosen as positive, what sign should its acceleration have?', options: ['Negative', 'Positive', 'Zero', 'Signs don\'t matter for acceleration'], correctIndex: 0, explanation: 'Braking opposes the direction of motion, so acceleration is negative when forward is positive.', misconceptionId: 'sign-convention-inconsistent-motion' },
      { question: 'A velocity of 108 km/h must be converted to m/s before use in a kinematics equation. What is this in m/s?', options: ['30 m/s', '108 m/s', '3,6 m/s', '388,8 m/s'], correctIndex: 0, explanation: '108 ÷ 3,6 = 30 m/s.', misconceptionId: 'unit-mismatch-in-substitution' },
    ],
    confidenceCheckPrompt: 'How confident do you feel using v² = u² + 2as, applying sign conventions, and converting units correctly?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'select-and-apply-kinematic-equation', revealSteps: 2, prompt: 'A skateboarder starts at 3 m/s and accelerates at 2 m/s² for 6 s. Find the final velocity.', steps: [
        { step: 'Knowns: u = 3 m/s, a = 2 m/s², t = 6 s. Use v = u + at.', justification: 'This equation contains exactly the known and unknown quantities.' },
        { step: 'v = 3 + (2 × 6) = 15 m/s.', justification: 'Substitute and calculate.' },
      ], answer: '15 m/s' },
      { id: 'fp-partial-1', objectiveId: 'solve-kinematics-word-problems', revealSteps: 1, prompt: 'A train starts from rest and reaches 24 m/s after travelling 144 m. Find its acceleration.', steps: [
        { step: 'Knowns: u = 0 m/s (from rest), v = 24 m/s, s = 144 m. Use v² = u² + 2as.', justification: 'Time is not given, and the equation relates u, v, a, s.' },
        { step: '24² = 0² + 2a(144) → 576 = 288a → a = 2 m/s².', justification: 'Substitute and solve algebraically for a.' },
      ], answer: '2 m/s²' },
      { id: 'fp-independent-1', objectiveId: 'solve-kinematics-word-problems', revealSteps: 0, prompt: 'A ball is thrown downward at 5 m/s and accelerates at 10 m/s² for 2 s. Find its displacement (downward = positive).', steps: [
        { step: 'Knowns: u = 5 m/s, a = 10 m/s², t = 2 s. Use s = ut + ½at²: s = (5×2) + ½(10)(2²) = 10 + 20 = 30 m.', justification: 'Substitute known values into the equation relating u, a, t, and s.' },
      ], answer: '30 m (downward)' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'identify-constant-acceleration', question: 'A cyclist speeds up steadily for the first half of a trip, then brakes suddenly for the rest. Can a single kinematic equation be used for the whole trip?', options: ['No — it must be split into two constant-acceleration phases', 'Yes, one equation always works', 'Only if using v² = u² + 2as', 'Only if time is unknown'], correctIndex: 0, hints: { strategic: 'Check whether acceleration is the same throughout.', procedural: 'Acceleration changes partway, so treat it as two separate phases.', workedStep: 'Split into two phases.' }, distractorMisconceptions: { 1: 'equations-used-for-nonconstant-acceleration' } },
      { id: 'ip-2', objectiveId: 'select-and-apply-kinematic-equation', question: 'A car already travelling at 12 m/s accelerates at 2 m/s² for 5 s. What is u for this calculation?', options: ['12 m/s', '0 m/s', '2 m/s', '5 m/s'], correctIndex: 0, hints: { strategic: 'u is the velocity at the start of the time interval being considered.', procedural: 'The car is "already travelling at 12 m/s" — that is u.', workedStep: '12 m/s.' }, distractorMisconceptions: { 1: 'initial-velocity-assumed-zero' } },
      { id: 'ip-3', objectiveId: 'solve-kinematics-word-problems', question: 'A car moving forward at 18 m/s brakes at a constant rate and stops after 6 s. Taking forward as positive, what sign is the acceleration?', options: ['Negative', 'Positive', 'Zero', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'Braking opposes the direction of motion.', procedural: 'If forward is positive, deceleration is negative.', workedStep: 'Negative.' }, distractorMisconceptions: { 1: 'sign-convention-inconsistent-motion' } },
      { id: 'ip-4', objectiveId: 'solve-kinematics-word-problems', question: 'A velocity of 90 km/h needs to be substituted into v = u + at, where t is in seconds. What must be done first?', options: ['Convert 90 km/h to m/s by dividing by 3,6', 'Substitute 90 directly', 'Convert seconds to hours instead', 'Nothing — units don\'t matter'], correctIndex: 0, hints: { strategic: 'Kinematic equations require consistent SI units.', procedural: 'Convert km/h to m/s before substituting.', workedStep: '90 ÷ 3,6 = 25 m/s.' }, distractorMisconceptions: { 1: 'unit-mismatch-in-substitution' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'identify-constant-acceleration', multiSelect: false, question: 'True or false: the kinematic equations can be used even if acceleration changes partway through the motion, as long as you use the average acceleration.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — they require constant acceleration; changing motion must be split into separate phases.', distractorMisconceptions: { 0: 'equations-used-for-nonconstant-acceleration' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'select-and-apply-kinematic-equation', multiSelect: false, question: 'A scooter starts at 4 m/s and accelerates at 2 m/s² for 3 s. Find the final velocity using v = u + at.', options: ['10 m/s', '6 m/s', '12 m/s', '24 m/s'], correctIndices: [0], explanation: 'v = 4 + (2 × 3) = 10 m/s.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'select-and-apply-kinematic-equation', multiSelect: false, question: 'An object starts from rest and accelerates at 4 m/s² for 3 s. Find its displacement using s = ut + ½at².', options: ['18 m', '12 m', '24 m', '6 m'], correctIndices: [0], explanation: 's = 0 + ½(4)(3²) = ½(4)(9) = 18 m.', distractorMisconceptions: { 1: 'initial-velocity-assumed-zero' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'solve-kinematics-word-problems', multiSelect: false, question: 'A car "already moving at 8 m/s" accelerates at 3 m/s² for 2 s. What value should be used for u?', options: ['8 m/s', '0 m/s', '3 m/s', '2 m/s'], correctIndices: [0], explanation: 'u is the velocity at the start of the interval, which is stated as 8 m/s.', distractorMisconceptions: { 1: 'initial-velocity-assumed-zero' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'solve-kinematics-word-problems', multiSelect: false, question: 'A ball moving at 30 m/s decelerates at 6 m/s² until it stops. Find the distance it travels using v² = u² + 2as.', options: ['75 m', '150 m', '5 m', '25 m'], correctIndices: [0], explanation: '0² = 30² + 2(−6)s → 0 = 900 − 12s → s = 75 m.', distractorMisconceptions: { 1: 'sign-convention-inconsistent-motion' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'solve-kinematics-word-problems', multiSelect: false, question: 'A velocity of 36 km/h must be converted before use in an equation with time in seconds. What is 36 km/h in m/s?', options: ['10 m/s', '36 m/s', '100 m/s', '3,6 m/s'], correctIndices: [0], explanation: '36 ÷ 3,6 = 10 m/s.', distractorMisconceptions: { 1: 'unit-mismatch-in-substitution' } },
    { id: 'q7', type: 'true-false', objectiveId: 'solve-kinematics-word-problems', multiSelect: false, question: 'True or false: in a problem where forward is chosen positive, an object decelerating while moving forward has positive acceleration.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — deceleration opposing the direction of motion is negative acceleration.', distractorMisconceptions: { 0: 'sign-convention-inconsistent-motion' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'select-and-apply-kinematic-equation', multiSelect: true, question: 'Which of these are valid kinematic equations for constant acceleration? (select all that apply)', options: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'v = u × at'], correctIndices: [0, 1, 2], explanation: 'The first three are the standard kinematic equations; the fourth is not a valid equation.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'select-and-apply-kinematic-equation',
      analogy: 'Think of the three equations as three different tools in a toolbox, each missing exactly one variable: v = u + at has no s; s = ut + ½at² has no v; v² = u² + 2as has no t. List what you know and what you want, then pick the tool that\'s missing only the variable you don\'t have and don\'t need.',
      explanation: 'To choose the right equation: (1) list every quantity given in the problem (u, v, a, t, s — some will be unknown), (2) identify which one variable is neither given nor asked for, (3) pick the equation that does NOT contain that variable, (4) substitute and solve, using consistent signs and SI units.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A cart starts from rest and accelerates at 2,5 m/s² for 4 s. Find its displacement.', steps: [
          { step: 'Knowns: u = 0, a = 2,5 m/s², t = 4 s. Unknown: s. v is neither given nor asked for.', justification: 'Identify which variable is absent from the problem entirely.' },
          { step: 'Since v is missing, use s = ut + ½at² (no v needed): s = 0 + ½(2,5)(4²) = ½(2,5)(16) = 20 m.', justification: 'Choose the equation that excludes the missing variable, then substitute and solve.' },
        ], answer: '20 m' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'select-and-apply-kinematic-equation', question: 'A car starts at 6 m/s and accelerates at 3 m/s² for 5 s. Find its final velocity.', options: ['21 m/s', '15 m/s', '18 m/s', '30 m/s'], correctIndex: 0, hints: { strategic: 's is not given or asked for — use v = u + at.', procedural: 'v = 6 + (3 × 5).', workedStep: '21 m/s.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'select-and-apply-kinematic-equation', question: 'An object accelerates from 5 m/s to 15 m/s over a displacement of 50 m. Find its acceleration.', options: ['2 m/s²', '1 m/s²', '4 m/s²', '0,5 m/s²'], correctIndex: 0, hints: { strategic: 't is not given or asked for — use v² = u² + 2as.', procedural: '15² = 5² + 2a(50) → 225 = 25 + 100a.', workedStep: '2 m/s².' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'select-and-apply-kinematic-equation', question: 'A ball starts from rest and falls for 3 s with acceleration 10 m/s². Find the distance fallen.', options: ['45 m', '30 m', '15 m', '90 m'], correctIndex: 0, hints: { strategic: 'v is not given or asked for — use s = ut + ½at².', procedural: 's = 0 + ½(10)(3²).', workedStep: '45 m.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'How do you decide which of the three kinematic equations to use for a given problem?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel solving kinematics word problems with correct signs and units now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What must always be true about acceleration for these three equations to apply?', type: 'multiple-choice', options: ['It must be constant throughout the motion', 'It must always be positive', 'It must always be zero', 'It doesn\'t matter'] },
  ],
};
