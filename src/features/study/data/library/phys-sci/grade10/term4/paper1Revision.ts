// ── Physical Sciences, Term 4: Paper 1 Revision (Physics) ────────────────────
// CAPS Term 4 introduces no new Grade 10 content — it consolidates Paper 1
// (Physics) across the year: Waves/Sound/Light and Electrostatics (Term 1),
// and the Mechanics block (Term 3): Vectors & Scalars, Motion in One Dimension,
// Equations of Motion, Energy. This module re-tests the single most
// exam-reported misconception per topic rather than re-teaching from scratch.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'wave-speed-frequency-confused',
    label: 'Believing wave speed changes when frequency changes, in the same medium',
    errorType: 'You assumed that increasing a wave\'s frequency increases its speed, treating v = fλ as if v depends freely on f.',
    principle: 'In a GIVEN MEDIUM, wave speed (v) is fixed by the properties of that medium — increasing frequency (f) causes wavelength (λ) to DECREASE proportionally (since v = fλ), not the speed to increase.',
    correctStep: 'Doubling the frequency of a wave in the same medium halves its wavelength; the speed v = fλ stays the same.',
  },
  {
    id: 'charge-created-not-transferred',
    label: 'Believing charge can be created or destroyed during charging',
    errorType: 'You described a charging process (e.g. rubbing two objects together) as if charge were newly created, rather than transferred.',
    principle: 'Charge is CONSERVED — it is never created or destroyed, only TRANSFERRED between objects. When two neutral objects are rubbed together, electrons move from one to the other, leaving one positively charged and the other equally negatively charged.',
    correctStep: 'When a glass rod is rubbed with silk, electrons transfer from the glass to the silk — the glass becomes positive and the silk becomes negative, with total charge conserved.',
  },
  {
    id: 'vector-direction-ignored-revision',
    label: 'Adding vector magnitudes without accounting for direction',
    errorType: 'You combined vector quantities as plain numbers, ignoring whether they act in the same or opposite directions.',
    principle: 'Vectors must be assigned a sign based on a chosen positive direction before being combined — same-direction vectors add directly, opposite-direction vectors are subtracted.',
    correctStep: 'A vector of 9 m right and a vector of 4 m left (right positive) combine to (+9) + (−4) = +5 m, i.e. 5 m right — not 13 m.',
  },
  {
    id: 'graph-slope-vs-value-revision',
    label: 'Reading a graph\'s height as the wrong physical quantity',
    errorType: 'You read the vertical height of a motion graph as a different quantity than the one it actually represents (e.g. reading a v-t graph\'s height as displacement).',
    principle: 'On a position-time graph, height = position and slope = velocity. On a velocity-time graph, height = velocity and slope = acceleration (with area under the graph = displacement). Always check which graph you are reading before interpreting height or slope.',
    correctStep: 'On a v-t graph, if the line sits at 12 m/s at t = 3 s, that 12 m/s is the velocity at that instant — not the displacement or acceleration.',
  },
  {
    id: 'equations-nonconstant-acceleration-revision',
    label: 'Applying kinematic equations when acceleration is not constant',
    errorType: 'You used v = u + at (or another kinematic equation) across a motion where acceleration actually changed partway through.',
    principle: 'The kinematic equations (v = u + at, s = ut + ½at², v² = u² + 2as) require CONSTANT acceleration. Motion with changing acceleration must be split into separate constant-acceleration phases, each solved on its own.',
    correctStep: 'A cyclist accelerating steadily then suddenly braking must be treated as two separate phases with two separate accelerations, not one equation for the whole trip.',
  },
  {
    id: 'energy-used-up-revision',
    label: 'Believing mechanical energy is "used up" instead of transformed',
    errorType: 'You described an object\'s energy as disappearing during motion, instead of converting between kinetic and potential forms.',
    principle: 'In an idealised (frictionless) system, mechanical energy is CONSERVED — total (Ek + Ep) stays constant, converting between forms rather than being destroyed.',
    correctStep: 'As a pendulum swings from its highest point to its lowest, its Ep converts to Ek — the total Ek + Ep stays the same (ignoring friction), it is not "used up".',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 4,
  topicId: 'paper-1-revision',
  topicName: 'Paper 1 Revision: Waves, Electrostatics & Mechanics',
  prerequisites: [
    'Waves, Sound and Light (Term 1)',
    'Electrostatics (Term 1)',
    'Vectors and Scalars, Motion in One Dimension, Equations of Motion, Energy (Term 3)',
  ],
  objectives: [
    { id: 'revise-waves-sound-light', text: 'Apply v = fλ and describe wave properties correctly.' },
    { id: 'revise-electrostatics', text: 'Explain charging processes using conservation of charge.' },
    { id: 'revise-vectors-scalars', text: 'Classify quantities as scalar/vector and combine collinear vectors correctly.' },
    { id: 'revise-motion-1d', text: 'Interpret position-time and velocity-time graphs correctly.' },
    { id: 'revise-equations-of-motion', text: 'Select and apply the correct kinematic equation for constant-acceleration problems.' },
    { id: 'revise-energy', text: 'Apply conservation of mechanical energy to relate speed and height.' },
  ],
  estimatedMinutes: [30, 45],
};

export const paper1Revision: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'You\'ve covered a full year of Physics — waves, charge, and motion. Can you still catch the exact mistakes examiners see most often?',
  goalSettingPrompt:
    'This revision pulls together every Paper 1 topic from the year and targets the single error each topic trips learners up on most in exams. By the end, you\'ll have tested and sharpened your recall across all of Term 1 and Term 3 Physics.',

  activate: {
    connectPrompt: 'Every topic here builds toward exam-style questions that mix concepts — this revision checks each piece stays solid on its own first.',
    diagnosticQuestions: [
      { question: 'In v = fλ, if frequency doubles in the same medium, what happens to wavelength?', options: ['It halves', 'It doubles', 'It stays the same', 'It becomes zero'], correctIndex: 0, explanation: 'Speed is fixed by the medium, so wavelength must halve to keep v = fλ constant.' },
      { question: 'When two neutral objects are rubbed together and become charged, where does the charge come from?', options: ['Electrons transfer between the two objects', 'Charge is newly created', 'Charge appears from the air', 'One object loses mass'], correctIndex: 0, explanation: 'Charging by friction transfers electrons; no charge is created.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'WAVES: v = fλ links speed, frequency, and wavelength — in a given medium, speed is fixed, so f and λ are inversely related. ELECTROSTATICS: charge is conserved and only ever transferred (never created) during processes like friction, induction, or contact — the charged objects end up with equal and opposite charge if starting neutral. VECTORS: combining vectors along a line requires a consistent positive-direction sign convention applied to every vector in the problem.',
    workedExamples: [
      { id: 'wx-wave-speed', prompt: 'A wave has a frequency of 50 Hz and a wavelength of 4 m. Find its speed.', steps: [
        { step: 'Use v = fλ.', justification: 'This equation links speed, frequency, and wavelength.' },
        { step: 'v = 50 × 4 = 200 m/s.', justification: 'Substitute the known frequency and wavelength.' },
      ], answer: '200 m/s' },
      { id: 'wx-charge-conservation', prompt: 'A neutral plastic rod is rubbed with a cloth and becomes negatively charged. What happened, and what charge does the cloth now have?', steps: [
        { step: 'Electrons transferred FROM the cloth TO the rod (since the rod became negative, i.e. gained electrons).', justification: 'Charging by friction is always an electron transfer, not creation of charge.' },
        { step: 'The cloth lost electrons, so it is now positively charged, with a magnitude of charge equal to what the rod gained.', justification: 'Charge is conserved: what one object gains, the other loses.' },
      ], answer: 'Electrons transferred from cloth to rod; the cloth is now positively charged' },
      { id: 'wx-vector-revision', prompt: 'A hiker walks 9 km east then 6 km west. Find the resultant displacement (east = positive).', steps: [
        { step: '9 km east = +9 km; 6 km west = −6 km.', justification: 'Assign signs based on the chosen positive direction.' },
        { step: 'Resultant = (+9) + (−6) = +3 km, i.e. 3 km east.', justification: 'Add the signed magnitudes.' },
      ], answer: '3 km east' },
    ],
    knowledgeChecks: [
      { question: 'A wave\'s frequency triples in the same medium. What happens to its wavelength?', options: ['It becomes a third of its original value', 'It triples', 'It stays the same', 'It becomes nine times larger'], correctIndex: 0, explanation: 'Speed is fixed, so wavelength is inversely proportional to frequency.', misconceptionId: 'wave-speed-frequency-confused' },
      { question: 'True or false: when an object is charged by rubbing, new charge is created.', options: ['False — charge is only transferred', 'True — friction creates charge'], correctIndex: 0, explanation: 'Charge is conserved and only transferred, never created.', misconceptionId: 'charge-created-not-transferred' },
    ],
    confidenceCheckPrompt: 'How confident do you feel with wave speed calculations, charge conservation, and vector addition?',
  },

  demonstrateChunk2: {
    explanation:
      'MOTION GRAPHS: on a position-time graph, height gives position and slope gives velocity; on a velocity-time graph, height gives velocity and slope gives acceleration. EQUATIONS OF MOTION apply only when acceleration is constant — list your knowns and unknowns, then pick the equation missing exactly the variable you don\'t have and don\'t need. ENERGY: in a frictionless system, total mechanical energy (Ek + Ep) is conserved, converting between forms rather than disappearing.',
    workedExamples: [
      { id: 'wx-graph-revision', prompt: 'A velocity-time graph is a straight line rising from 4 m/s to 16 m/s over 4 s. Find the acceleration.', steps: [
        { step: 'Acceleration = slope of the v-t graph = change in velocity ÷ change in time.', justification: 'Slope of a v-t graph gives acceleration.' },
        { step: 'a = (16 − 4) ÷ (4 − 0) = 3 m/s².', justification: 'Substitute the rise and run.' },
      ], answer: '3 m/s²' },
      { id: 'wx-kinematics-revision', prompt: 'A car starts at 10 m/s and accelerates at 2,5 m/s² for 6 s. Find its final velocity.', steps: [
        { step: 'Knowns: u = 10 m/s, a = 2,5 m/s², t = 6 s. s is not given or needed, so use v = u + at.', justification: 'Choose the equation missing exactly the variable that is absent.' },
        { step: 'v = 10 + (2,5 × 6) = 25 m/s.', justification: 'Substitute and calculate.' },
      ], answer: '25 m/s' },
      { id: 'wx-energy-revision', prompt: 'A 2 kg object falls from rest from a height of 5 m (ignore air resistance, g = 9,8 m/s²). Find its speed just before hitting the ground.', steps: [
        { step: 'Ep at top = mgh = 2 × 9,8 × 5 = 98 J = total mechanical energy (Ek = 0 at rest).', justification: 'Calculate total energy at the point you know the most.' },
        { step: 'At the ground, Ep = 0, so Ek = 98 J: ½(2)v² = 98 → v² = 98 → v ≈ 9,9 m/s.', justification: 'Apply conservation of mechanical energy to solve for the unknown speed.' },
      ], answer: '≈ 9,9 m/s' },
    ],
    knowledgeChecks: [
      { question: 'On a velocity-time graph, what does the slope represent?', options: ['Acceleration', 'Displacement', 'Position', 'Distance'], correctIndex: 0, explanation: 'Slope of a v-t graph gives acceleration.', misconceptionId: 'graph-slope-vs-value-revision' },
      { question: 'A cyclist accelerates steadily, then suddenly brakes. Can one kinematic equation cover the whole trip?', options: ['No — it must be split into two constant-acceleration phases', 'Yes, always', 'Only using v² = u² + 2as', 'Only if time is unknown'], correctIndex: 0, explanation: 'Acceleration changes partway, so the motion must be split into phases.', misconceptionId: 'equations-nonconstant-acceleration-revision' },
    ],
    confidenceCheckPrompt: 'How confident do you feel reading motion graphs, applying kinematic equations, and using conservation of energy?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'revise-waves-sound-light', revealSteps: 1, prompt: 'A sound wave has a speed of 340 m/s and a frequency of 170 Hz. Find its wavelength.', steps: [
        { step: 'Rearrange v = fλ to λ = v ÷ f = 340 ÷ 170 = 2 m.', justification: 'Solve for wavelength using the given speed and frequency.' },
      ], answer: '2 m' },
      { id: 'fp-partial-1', objectiveId: 'revise-equations-of-motion', revealSteps: 1, prompt: 'A ball starts from rest and accelerates at 4 m/s² for 3 s. Find its displacement.', steps: [
        { step: 'Knowns: u = 0, a = 4 m/s², t = 3 s. Use s = ut + ½at².', justification: 'v is not given or needed, so choose the equation without v.' },
        { step: 's = 0 + ½(4)(3²) = 18 m.', justification: 'Substitute and calculate.' },
      ], answer: '18 m' },
      { id: 'fp-independent-1', objectiveId: 'revise-energy', revealSteps: 0, prompt: 'A 1 kg ball is thrown upward at 6 m/s. Ignoring air resistance, what is its kinetic energy at maximum height?', steps: [
        { step: 'At maximum height the ball is momentarily at rest (v = 0), so Ek = ½(1)(0²) = 0 J.', justification: 'At maximum height, all kinetic energy has converted to potential energy.' },
      ], answer: '0 J' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'revise-waves-sound-light', question: 'A wave\'s frequency is halved while staying in the same medium. What happens to its wavelength?', options: ['It doubles', 'It halves', 'It stays the same', 'It becomes zero'], correctIndex: 0, hints: { strategic: 'Speed stays fixed in the same medium.', procedural: 'v = fλ, so λ is inversely proportional to f.', workedStep: 'Wavelength doubles.' }, distractorMisconceptions: { 1: 'wave-speed-frequency-confused' } },
      { id: 'ip-2', objectiveId: 'revise-electrostatics', question: 'Two neutral metal spheres touch and separate, one ending up positive. Where did its missing electrons go?', options: ['They transferred to the other sphere', 'They were destroyed', 'They turned into protons', 'Nothing transferred'], correctIndex: 0, hints: { strategic: 'Charge is always conserved.', procedural: 'A positive sphere lost electrons — they must have gone somewhere.', workedStep: 'Transferred to the other sphere.' }, distractorMisconceptions: { 1: 'charge-created-not-transferred' } },
      { id: 'ip-3', objectiveId: 'revise-vectors-scalars', question: 'Two forces of 12 N and 5 N act in opposite directions on an object. What is the resultant magnitude?', options: ['7 N', '17 N', '60 N', '0 N'], correctIndex: 0, hints: { strategic: 'Opposite directions mean opposite signs.', procedural: '(+12) + (−5).', workedStep: '7 N.' }, distractorMisconceptions: { 1: 'vector-direction-ignored-revision' } },
      { id: 'ip-4', objectiveId: 'revise-motion-1d', question: 'A position-time graph shows a flat horizontal line for 3 s. What is the object doing?', options: ['At rest (not moving)', 'Moving at constant maximum speed', 'Accelerating', 'Off the graph'], correctIndex: 0, hints: { strategic: 'A flat x-t line has zero slope.', procedural: 'Zero slope means zero velocity.', workedStep: 'At rest.' }, distractorMisconceptions: { 1: 'graph-slope-vs-value-revision' } },
      { id: 'ip-5', objectiveId: 'revise-equations-of-motion', question: 'A car moving at 20 m/s brakes at a constant rate and stops after travelling 50 m. Find its acceleration using v² = u² + 2as.', options: ['−4 m/s²', '4 m/s²', '−0,4 m/s²', '−8 m/s²'], correctIndex: 0, hints: { strategic: 'u = 20 m/s, v = 0 m/s, s = 50 m.', procedural: '0² = 20² + 2a(50) → 0 = 400 + 100a.', workedStep: '−4 m/s².' }, distractorMisconceptions: {} },
      { id: 'ip-6', objectiveId: 'revise-energy', question: 'A 3 kg object slides down a frictionless slope from rest, dropping 4 m. What is its kinetic energy at the bottom (g = 9,8 m/s²)?', options: ['117,6 J', '39,2 J', '29,4 J', '0 J'], correctIndex: 0, hints: { strategic: 'Ek at bottom equals Ep at top (since it starts from rest).', procedural: 'Ep = mgh = 3 × 9,8 × 4.', workedStep: '117,6 J.' }, distractorMisconceptions: { 3: 'energy-used-up-revision' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'revise-waves-sound-light', multiSelect: false, question: 'A wave has speed 300 m/s and wavelength 2,5 m. Find its frequency.', options: ['120 Hz', '750 Hz', '2,5 Hz', '297,5 Hz'], correctIndices: [0], explanation: 'f = v ÷ λ = 300 ÷ 2,5 = 120 Hz.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'revise-electrostatics', multiSelect: false, question: 'True or false: total charge is conserved during any charging process.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — charge is neither created nor destroyed, only transferred.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'revise-vectors-scalars', multiSelect: false, question: 'A cyclist rides 14 km north then 6 km south. Find the resultant displacement (north = positive).', options: ['8 km north', '20 km north', '8 km south', '20 km south'], correctIndices: [0], explanation: '(+14) + (−6) = +8, i.e. 8 km north.', distractorMisconceptions: { 1: 'vector-direction-ignored-revision' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'revise-motion-1d', multiSelect: false, question: 'A position-time graph is a straight line rising from 0 m to 30 m over 6 s. Find the velocity.', options: ['5 m/s', '30 m/s', '6 m/s', '180 m/s'], correctIndices: [0], explanation: 'Velocity = slope = (30 − 0) ÷ (6 − 0) = 5 m/s.', distractorMisconceptions: { 1: 'graph-slope-vs-value-revision' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'revise-equations-of-motion', multiSelect: false, question: 'An object starts from rest and accelerates at 5 m/s² for 4 s. Find its final velocity.', options: ['20 m/s', '9 m/s', '1,25 m/s', '40 m/s'], correctIndices: [0], explanation: 'v = u + at = 0 + (5 × 4) = 20 m/s.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'revise-equations-of-motion', multiSelect: false, question: 'True or false: the kinematic equations can be applied over a motion where acceleration changes partway through, without splitting it into phases.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — constant acceleration is required; changing motion must be split into phases.', distractorMisconceptions: { 0: 'equations-nonconstant-acceleration-revision' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'revise-energy', multiSelect: false, question: 'A 4 kg object is thrown upward at 5 m/s. What is its total mechanical energy throughout the motion (ignoring air resistance, taking launch point as h = 0)?', options: ['50 J', '20 J', '100 J', '0 J'], correctIndices: [0], explanation: 'At launch, all energy is kinetic: Ek = ½(4)(5²) = 50 J; this stays constant.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'revise-vectors-scalars', multiSelect: true, question: 'Which of these are vector quantities? (select all that apply)', options: ['Velocity', 'Displacement', 'Distance', 'Mass'], correctIndices: [0, 1], explanation: 'Velocity and displacement have direction; distance and mass do not.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'revise-equations-of-motion',
      analogy: 'Think of the three kinematic equations as three tools, each missing exactly one variable: v = u + at has no s; s = ut + ½at² has no v; v² = u² + 2as has no t. Match the tool to the variable you don\'t have and don\'t need.',
      explanation: 'List every known and unknown quantity, identify which single variable (u, v, a, t, or s) is neither given nor asked for, then pick the equation that excludes it — substitute using consistent signs and SI units.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A car starts from rest and reaches 18 m/s after travelling 81 m. Find its acceleration.', steps: [
          { step: 'Knowns: u = 0, v = 18 m/s, s = 81 m. Time is not given or needed, so use v² = u² + 2as.', justification: 'Choose the equation missing the absent variable, t.' },
          { step: '18² = 0² + 2a(81) → 324 = 162a → a = 2 m/s².', justification: 'Substitute and solve algebraically for a.' },
        ], answer: '2 m/s²' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'revise-equations-of-motion', question: 'A skater starts at 2 m/s and accelerates at 3 m/s² for 5 s. Find the final velocity.', options: ['17 m/s', '15 m/s', '10 m/s', '37,5 m/s'], correctIndex: 0, hints: { strategic: 's is not given or needed — use v = u + at.', procedural: 'v = 2 + (3 × 5).', workedStep: '17 m/s.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'revise-equations-of-motion', question: 'An object accelerates from rest at 6 m/s² for 4 s. Find its displacement.', options: ['48 m', '24 m', '12 m', '96 m'], correctIndex: 0, hints: { strategic: 'v is not given or needed — use s = ut + ½at².', procedural: 's = 0 + ½(6)(4²).', workedStep: '48 m.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'revise-equations-of-motion', question: 'A ball moving at 16 m/s decelerates at 4 m/s² until it stops. Find the distance travelled.', options: ['32 m', '16 m', '64 m', '4 m'], correctIndex: 0, hints: { strategic: 't is not given or needed — use v² = u² + 2as.', procedural: '0² = 16² + 2(−4)s.', workedStep: '32 m.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which Paper 1 topic from this year do you still feel least confident about, and why?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel across all of Term 1 and Term 3 Physics now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Which single habit will help you avoid sign-convention errors in exams?', type: 'multiple-choice', options: ['Choosing one positive direction and using it consistently throughout a problem', 'Guessing the sign at the end', 'Avoiding negative numbers entirely', 'Always assuming right/east is positive regardless of the problem'] },
  ],
};
