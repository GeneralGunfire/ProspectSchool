// ── Physical Sciences, Term 3, Topic 5: Energy ────────────────────────────────
// Physics strand, closes the Mechanics block. Builds on Equations of Motion
// (this term). Introductory Grade 10 scope: kinetic energy, gravitational
// potential energy, and conservation of mechanical energy in idealised systems.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'potential-energy-treated-as-absolute',
    label: 'Treating gravitational potential energy as an absolute value',
    errorType: 'You calculated potential energy without first identifying the reference level (height = 0) it is measured from.',
    principle: 'Gravitational potential energy, Ep = mgh, is always measured RELATIVE TO A CHOSEN REFERENCE LEVEL (where h = 0) — it is not an absolute property of an object. Changing the reference level changes the calculated Ep, even though the object hasn\'t physically changed.',
    correctStep: 'A 2 kg object 5 m above the ground has Ep = mgh = 2 × 9,8 × 5 = 98 J relative to the ground — but only 49 J relative to a shelf 2,5 m up, since h changes with the reference level.',
  },
  {
    id: 'energy-used-up-misconception',
    label: 'Believing energy is "used up" rather than transformed',
    errorType: 'You described energy as disappearing or being "used up" during motion, instead of being transformed from one form to another.',
    principle: 'Energy is never destroyed — it is TRANSFORMED from one form to another (e.g. kinetic to potential, or mechanical to heat via friction) or TRANSFERRED between objects. In an idealised system with no friction, total mechanical energy is CONSERVED, not lost.',
    correctStep: 'As a pendulum swings up, its kinetic energy is not "used up" — it is converted into gravitational potential energy, and the total (Ek + Ep) stays constant in the absence of friction.',
  },
  {
    id: 'mass-only-determines-kinetic-energy',
    label: 'Ignoring the role of velocity in kinetic energy',
    errorType: 'You assumed a heavier object always has more kinetic energy than a lighter one, without considering velocity.',
    principle: 'Kinetic energy is Ek = ½mv² — it depends on BOTH mass AND velocity, and velocity is SQUARED, so it has a much larger effect. A lighter, faster object can have far more kinetic energy than a heavier, slower one.',
    correctStep: 'A 1 kg ball at 10 m/s has Ek = ½(1)(10²) = 50 J, which is MORE than a 4 kg ball at 3 m/s, which has Ek = ½(4)(3²) = 18 J — despite being lighter.',
  },
  {
    id: 'joules-newtons-confused',
    label: 'Confusing the units for energy and force',
    errorType: 'You used Newtons (N) as the unit for an energy value, or Joules (J) as the unit for a force value.',
    principle: 'ENERGY (kinetic or potential) is measured in JOULES (J). FORCE is measured in NEWTONS (N). These are different physical quantities with different units — never interchange them, even though both appear in mechanics calculations.',
    correctStep: 'Kinetic energy of 40 J is correct; "40 N of kinetic energy" is not a valid statement, since kinetic energy is never expressed in Newtons.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 3,
  topicId: 'energy',
  topicName: 'Energy',
  prerequisites: [
    'Equations of Motion (this term, Topic 4)',
    'Motion in One Dimension (this term, Topic 3)',
  ],
  objectives: [
    { id: 'calculate-kinetic-energy', text: 'Calculate the kinetic energy of a moving object.' },
    { id: 'calculate-potential-energy', text: 'Calculate the gravitational potential energy of an object relative to a reference level.' },
    { id: 'apply-conservation-of-mechanical-energy', text: 'Apply conservation of mechanical energy to relate speed and height in an idealised (frictionless) system.' },
  ],
  estimatedMinutes: [20, 30],
};

export const energy: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'A rollercoaster has no engine after the first big climb — so what keeps it moving all the way to the end?',
  goalSettingPrompt:
    'Motion and height both carry energy, and in an idealised system that energy simply changes form rather than disappearing. By the end of this lesson you\'ll be able to calculate kinetic and potential energy, and use conservation of mechanical energy to solve problems.',

  activate: {
    connectPrompt: 'You already know how to calculate velocity and displacement from the equations of motion — energy calculations use those same quantities in a new way.',
    diagnosticQuestions: [
      { question: 'What two quantities does kinetic energy depend on?', options: ['Mass and velocity', 'Mass and height', 'Height and time', 'Only velocity'], correctIndex: 0, explanation: 'Kinetic energy depends on both mass and velocity.' },
      { question: 'Is energy measured in Joules or Newtons?', options: ['Joules', 'Newtons', 'Both equally', 'Neither'], correctIndex: 0, explanation: 'Energy is measured in Joules (J); Newtons measure force.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'KINETIC ENERGY (Ek) is the energy an object has due to its motion: Ek = ½mv², where m is mass in kg and v is velocity in m/s, giving Ek in Joules (J). Because velocity is SQUARED, small changes in speed cause large changes in kinetic energy. GRAVITATIONAL POTENTIAL ENERGY (Ep) is the energy an object has due to its height above a chosen REFERENCE LEVEL: Ep = mgh, where g ≈ 9,8 m/s² and h is height in metres above that reference level.',
    workedExamples: [
      { id: 'wx-kinetic-energy', prompt: 'Calculate the kinetic energy of a 5 kg object moving at 6 m/s.', steps: [
        { step: 'Use Ek = ½mv².', justification: 'This equation gives kinetic energy from mass and velocity.' },
        { step: 'Ek = ½(5)(6²) = ½(5)(36) = 90 J.', justification: 'Substitute the mass and velocity, remembering to square the velocity before multiplying.' },
      ], answer: '90 J' },
      { id: 'wx-potential-energy', prompt: 'Calculate the gravitational potential energy of a 2 kg object held 4 m above the ground (g = 9,8 m/s²).', steps: [
        { step: 'Use Ep = mgh, with the ground as the reference level (h = 0 at the ground).', justification: 'Potential energy requires a stated reference level for height.' },
        { step: 'Ep = 2 × 9,8 × 4 = 78,4 J.', justification: 'Substitute mass, gravitational acceleration, and height.' },
      ], answer: '78,4 J' },
    ],
    knowledgeChecks: [
      { question: 'A 1 kg ball moves at 8 m/s and a 4 kg ball moves at 3 m/s. Which has more kinetic energy?', options: ['The 1 kg ball (32 J vs 18 J)', 'The 4 kg ball, since it is heavier', 'They are equal', 'Cannot be determined'], correctIndex: 0, explanation: 'Ek(1 kg) = ½(1)(8²) = 32 J; Ek(4 kg) = ½(4)(3²) = 18 J — the lighter, faster ball has more.', misconceptionId: 'mass-only-determines-kinetic-energy' },
      { question: 'What unit is kinetic energy measured in?', options: ['Joules (J)', 'Newtons (N)', 'Watts (W)', 'Metres (m)'], correctIndex: 0, explanation: 'Energy, including kinetic energy, is measured in Joules.', misconceptionId: 'joules-newtons-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel calculating kinetic and gravitational potential energy?',
  },

  demonstrateChunk2: {
    explanation:
      'In an IDEALISED system with no friction or air resistance, MECHANICAL ENERGY IS CONSERVED: the total (Ek + Ep) stays constant, even as it converts between kinetic and potential forms. This means Ek(initial) + Ep(initial) = Ek(final) + Ep(final) — as an object falls, it LOSES potential energy and GAINS an equal amount of kinetic energy (and vice versa when rising), rather than energy being created or destroyed.',
    workedExamples: [
      { id: 'wx-conservation-falling', prompt: 'A 3 kg object falls from rest from a height of 5 m. Find its speed just before hitting the ground (ignore air resistance, g = 9,8 m/s²).', steps: [
        { step: 'At the top: Ek = 0 (starts from rest), Ep = mgh = 3 × 9,8 × 5 = 147 J. Total mechanical energy = 147 J.', justification: 'Calculate the initial energy, which is entirely potential since the object starts at rest.' },
        { step: 'At the ground: Ep = 0 (h = 0 there), so all 147 J is now kinetic: ½mv² = 147 → ½(3)v² = 147 → v² = 98 → v ≈ 9,9 m/s.', justification: 'By conservation, total mechanical energy stays 147 J; at the ground it is entirely kinetic, so solve for v.' },
      ], answer: '≈ 9,9 m/s' },
      { id: 'wx-conservation-rising', prompt: 'A 0,5 kg ball is thrown upward at 12 m/s. Find the maximum height it reaches (ignore air resistance).', steps: [
        { step: 'At launch: Ek = ½(0,5)(12²) = 36 J, Ep = 0 (taking launch point as reference). Total = 36 J.', justification: 'Calculate the initial kinetic energy at the reference height.' },
        { step: 'At maximum height, the ball is momentarily at rest, so Ek = 0, meaning all 36 J is now Ep: mgh = 36 → (0,5)(9,8)h = 36 → h ≈ 7,3 m.', justification: 'At maximum height all energy has converted to potential; solve for h using conservation.' },
      ], answer: '≈ 7,3 m' },
    ],
    knowledgeChecks: [
      { question: 'As a ball rolls down a frictionless ramp, what happens to its mechanical energy?', options: ['It stays constant, converting from Ep to Ek', 'It decreases as it is used up', 'It increases without limit', 'It becomes zero at the bottom'], correctIndex: 0, explanation: 'With no friction, total mechanical energy is conserved, just changing form.', misconceptionId: 'energy-used-up-misconception' },
      { question: 'An object is held at a height of 3 m above a table that is itself 1 m above the floor. What must you decide before calculating Ep?', options: ['The reference level (height = 0)', 'The object\'s velocity', 'The object\'s kinetic energy first', 'Nothing extra is needed'], correctIndex: 0, explanation: 'Ep depends on the chosen reference level for height.', misconceptionId: 'potential-energy-treated-as-absolute' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying conservation of mechanical energy to find speed or height?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'calculate-kinetic-energy', revealSteps: 2, prompt: 'Calculate the kinetic energy of a 10 kg object moving at 4 m/s.', steps: [
        { step: 'Use Ek = ½mv².', justification: 'This equation gives kinetic energy from mass and velocity.' },
        { step: 'Ek = ½(10)(4²) = ½(10)(16) = 80 J.', justification: 'Substitute and calculate.' },
      ], answer: '80 J' },
      { id: 'fp-partial-1', objectiveId: 'calculate-potential-energy', revealSteps: 1, prompt: 'Calculate the gravitational potential energy of a 6 kg object 2,5 m above the ground (g = 9,8 m/s²).', steps: [
        { step: 'Use Ep = mgh, with the ground as reference level.', justification: 'Identify the equation and reference level.' },
        { step: 'Ep = 6 × 9,8 × 2,5 = 147 J.', justification: 'Substitute mass, g, and height.' },
      ], answer: '147 J' },
      { id: 'fp-independent-1', objectiveId: 'apply-conservation-of-mechanical-energy', revealSteps: 0, prompt: 'A 2 kg object falls from rest from a height of 10 m (ignore air resistance, g = 9,8 m/s²). Find its speed just before hitting the ground.', steps: [
        { step: 'Ep at top = mgh = 2 × 9,8 × 10 = 196 J = total mechanical energy. At the ground, all 196 J is kinetic: ½(2)v² = 196 → v² = 196 → v = 14 m/s.', justification: 'Apply conservation of mechanical energy: initial Ep equals final Ek since the object starts at rest and ends at ground level.' },
      ], answer: '14 m/s' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'calculate-kinetic-energy', question: 'What is the kinetic energy of a 2 kg object moving at 5 m/s?', options: ['25 J', '10 J', '50 J', '5 J'], correctIndex: 0, hints: { strategic: 'Use Ek = ½mv².', procedural: 'Ek = ½(2)(5²).', workedStep: '25 J.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'calculate-kinetic-energy', question: 'A 0,5 kg ball moves at 20 m/s and a 8 kg ball moves at 2 m/s. Which has more kinetic energy?', options: ['The 0,5 kg ball (100 J vs 16 J)', 'The 8 kg ball, since it is heavier', 'They are equal', 'Cannot be compared'], correctIndex: 0, hints: { strategic: 'Calculate Ek for both using Ek = ½mv².', procedural: 'Ek(0,5 kg) = ½(0,5)(20²) = 100 J; Ek(8 kg) = ½(8)(2²) = 16 J.', workedStep: 'The 0,5 kg ball has more.' }, distractorMisconceptions: { 1: 'mass-only-determines-kinetic-energy' } },
      { id: 'ip-3', objectiveId: 'calculate-potential-energy', question: 'What is the gravitational potential energy of a 4 kg object 3 m above a reference level (g = 9,8 m/s²)?', options: ['117,6 J', '39,2 J', '12 J', '29,4 J'], correctIndex: 0, hints: { strategic: 'Use Ep = mgh.', procedural: 'Ep = 4 × 9,8 × 3.', workedStep: '117,6 J.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'apply-conservation-of-mechanical-energy', question: 'A 1 kg ball is thrown upward at 10 m/s. Ignoring air resistance, what is its kinetic energy at maximum height?', options: ['0 J, since all energy is now potential', '50 J, unchanged from launch', '25 J', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'At maximum height, the ball is momentarily at rest.', procedural: 'Ek = ½mv², and v = 0 at maximum height.', workedStep: '0 J.' }, distractorMisconceptions: { 1: 'energy-used-up-misconception' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'calculate-kinetic-energy', multiSelect: false, question: 'What is the kinetic energy of a 3 kg object moving at 4 m/s?', options: ['24 J', '12 J', '48 J', '6 J'], correctIndices: [0], explanation: 'Ek = ½(3)(4²) = ½(3)(16) = 24 J.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'calculate-kinetic-energy', multiSelect: false, question: 'True or false: a heavier object always has more kinetic energy than a lighter one, regardless of speed.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — kinetic energy depends on both mass and velocity squared; a fast light object can have more.', distractorMisconceptions: { 0: 'mass-only-determines-kinetic-energy' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'calculate-potential-energy', multiSelect: false, question: 'What is the gravitational potential energy of a 5 kg object 6 m above the ground (g = 9,8 m/s²)?', options: ['294 J', '49 J', '58,8 J', '30 J'], correctIndices: [0], explanation: 'Ep = 5 × 9,8 × 6 = 294 J.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'calculate-potential-energy', multiSelect: false, question: 'True or false: gravitational potential energy can be calculated without specifying a reference level for height.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — Ep is always relative to a chosen reference level.', distractorMisconceptions: { 0: 'potential-energy-treated-as-absolute' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'apply-conservation-of-mechanical-energy', multiSelect: false, question: 'A 4 kg object falls from rest from a height of 20 m (ignore air resistance, g = 9,8 m/s²). What is its kinetic energy just before hitting the ground?', options: ['784 J', '78,4 J', '392 J', '0 J'], correctIndices: [0], explanation: 'By conservation, Ek at the ground equals Ep at the top: mgh = 4 × 9,8 × 20 = 784 J.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'apply-conservation-of-mechanical-energy', multiSelect: false, question: 'True or false: as an object swings on a frictionless pendulum, energy is gradually used up until it stops.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — with no friction, mechanical energy is conserved and the pendulum keeps swinging.', distractorMisconceptions: { 0: 'energy-used-up-misconception' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'apply-conservation-of-mechanical-energy', multiSelect: false, question: 'A 2 kg ball is thrown upward at 8 m/s. Ignoring air resistance, what is its total mechanical energy throughout the motion (taking the launch point as h = 0)?', options: ['64 J', '32 J', '16 J', '128 J'], correctIndices: [0], explanation: 'At launch, all energy is kinetic: Ek = ½(2)(8²) = 64 J; this total stays constant throughout.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'calculate-kinetic-energy', multiSelect: true, question: 'Which of these correctly describe kinetic energy? (select all that apply)', options: ['Measured in Joules', 'Depends on mass and velocity', 'Measured in Newtons', 'Depends only on mass'], correctIndices: [0, 1], explanation: 'Kinetic energy is in Joules and depends on both mass and velocity (squared) — not Newtons, and not mass alone.', distractorMisconceptions: { 2: 'joules-newtons-confused', 3: 'mass-only-determines-kinetic-energy' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-conservation-of-mechanical-energy',
      analogy: 'Think of mechanical energy like money moving between two bank accounts, "Kinetic" and "Potential" — the total amount of money never changes (in an idealised system), it just moves between the two accounts. When height decreases, the potential account pays out into the kinetic account, and vice versa.',
      explanation: 'To apply conservation of mechanical energy: (1) calculate total energy (Ek + Ep) at the point where you know the most, (2) recognise that this total stays the same at any other point in the same idealised system, (3) at the new point, use whatever you know about Ek or Ep there to solve for the missing quantity.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A 1,5 kg object slides from rest down a frictionless slope, dropping a height of 4 m. Find its speed at the bottom (g = 9,8 m/s²).', steps: [
          { step: 'At the top: Ek = 0 (rest), Ep = mgh = 1,5 × 9,8 × 4 = 58,8 J. Total = 58,8 J.', justification: 'Calculate the total mechanical energy at the point you know the most about.' },
          { step: 'At the bottom: Ep = 0 (h = 0 there), so Ek = 58,8 J: ½(1,5)v² = 58,8 → v² = 78,4 → v ≈ 8,85 m/s.', justification: 'Use the conserved total to solve for the unknown quantity at the new point.' },
        ], answer: '≈ 8,85 m/s' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-conservation-of-mechanical-energy', question: 'A 2 kg object falls from rest from 8 m (g = 9,8 m/s²). Find its kinetic energy just before hitting the ground.', options: ['156,8 J', '78,4 J', '19,6 J', '15,68 J'], correctIndex: 0, hints: { strategic: 'Ek at the ground equals Ep at the start.', procedural: 'Ep = mgh = 2 × 9,8 × 8.', workedStep: '156,8 J.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'apply-conservation-of-mechanical-energy', question: 'A 0,2 kg ball is thrown upward at 6 m/s. What is its Ep at maximum height (ignore air resistance)?', options: ['3,6 J', '0 J', '1,2 J', '7,2 J'], correctIndex: 0, hints: { strategic: 'At max height, Ek = 0, so all initial Ek becomes Ep.', procedural: 'Initial Ek = ½(0,2)(6²) = 3,6 J.', workedStep: '3,6 J.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'apply-conservation-of-mechanical-energy', question: 'A 3 kg object slides down a frictionless slope from rest, reaching 6 m/s at the bottom. What was its Ep at the top?', options: ['54 J', '18 J', '9 J', '108 J'], correctIndex: 0, hints: { strategic: 'Ep at top equals Ek at bottom (starts from rest).', procedural: 'Ek at bottom = ½(3)(6²).', workedStep: '54 J.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'In your own words, explain what "conservation of mechanical energy" means for a falling object.', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel calculating kinetic energy, potential energy, and using conservation of energy now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What happens to an object\'s mechanical energy as it falls, in a system with no friction?', type: 'multiple-choice', options: ['It stays constant, converting from potential to kinetic', 'It decreases as it is used up', 'It increases without limit', 'It becomes entirely potential energy'] },
  ],
};
