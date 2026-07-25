// ── Term 2, Topic 2: Solving Right-Angled Triangles ───────────────────────────
// Builds directly on T2.1 (SOH-CAH-TOA) — applies the ratios to full "solve
// the triangle" and applied (elevation/depression) problems.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'angle-sum-forgotten',
    label: 'Forgetting that the two acute angles in a right triangle sum to 90°',
    errorType: 'You didn\'t use the fact that the two non-right angles of a right-angled triangle always add up to 90°.',
    principle: 'In any right-angled triangle, the right angle is 90°, and the other two angles must add up to the remaining 90° (since all three angles sum to 180°). If you know one acute angle, the other is 90° minus that angle.',
    correctStep: 'If one acute angle is 35°, the other acute angle is 90° - 35° = 55°.',
  },
  {
    id: 'elevation-depression-confused',
    label: 'Confusing angle of elevation with angle of depression',
    errorType: 'You mixed up which angle (elevation or depression) applies to the given situation.',
    principle: 'Angle of ELEVATION is measured UPWARD from the horizontal (looking up at something). Angle of DEPRESSION is measured DOWNWARD from the horizontal (looking down at something). They are measured from the horizontal line at the OBSERVER\'s position, not from the ground at the object.',
    correctStep: 'Looking up at the top of a building from the ground: angle of elevation. Looking down at a boat from a cliff: angle of depression.',
  },
  {
    id: 'wrong-triangle-extracted',
    label: 'Not correctly identifying the right-angled triangle within a word problem diagram',
    errorType: 'You applied a trig ratio using sides that don\'t actually belong to the same right-angled triangle in the diagram.',
    principle: 'Before applying any ratio, clearly identify which right-angled triangle you\'re working with, and label its hypotenuse, opposite, and adjacent sides relative to the angle you\'re using — in more complex diagrams there may be more than one triangle.',
    correctStep: 'In a diagram with two triangles sharing a side, isolate ONE triangle at a time and label its sides before calculating.',
  },
  {
    id: 'premature-rounding',
    label: 'Rounding intermediate results before the final answer',
    errorType: 'You rounded a value partway through a multi-step calculation, then used the rounded value in later steps.',
    principle: 'Keep full precision (or store the unrounded value/use your calculator\'s memory) through every step of a calculation, and only round at the very end — rounding too early compounds small errors.',
    correctStep: 'If finding a height requires two trig calculations, carry the un-rounded value from step 1 into step 2, rounding only the final answer.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 2,
  topicId: 'solving-right-angled-triangles',
  topicName: 'Solving Right-Angled Triangles',
  prerequisites: [
    'Trigonometric ratios: SOH-CAH-TOA (Topic 1 of this term)',
    'Solving linear equations (Term 1)',
  ],
  objectives: [
    { id: 'find-unknown-side', text: 'Find an unknown side of a right-angled triangle given one angle and one side.' },
    { id: 'find-unknown-angle', text: 'Find an unknown angle of a right-angled triangle given two sides.' },
    { id: 'elevation-depression', text: 'Solve applied problems involving angles of elevation and depression.' },
    { id: 'multi-step-applications', text: 'Solve multi-step applied problems requiring more than one trig calculation.' },
  ],
  estimatedMinutes: [20, 30],
};

export const solvingRightAngledTriangles: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How tall is a building you can\'t climb?',
  goalSettingPrompt:
    'You already know SOH-CAH-TOA. Now we apply it to real, "solve the whole triangle" problems — including measuring things you can\'t directly reach, using nothing but an angle and a distance.',

  activate: {
    connectPrompt: 'You already know how to apply SOH-CAH-TOA to find a missing side or angle. Let\'s check that before combining it with real-world applications.',
    diagnosticQuestions: [
      { question: 'A right triangle has angle 40° and adjacent side 8cm. Find the opposite side.', options: ['≈ 6.71cm', '≈ 9.51cm', '≈ 5.14cm', '≈ 12.4cm'], correctIndex: 0, explanation: 'tan(40°) = opposite/8, so opposite = 8×tan(40°) ≈ 6.71cm.' },
      { question: 'The two acute angles of a right triangle sum to what?', options: ['90°', '180°', '45°', '60°'], correctIndex: 0, explanation: 'Since all three angles sum to 180° and one is 90°, the other two sum to 90°.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      '"Solving a triangle" means finding every unknown side and angle. Since the two acute angles of a right triangle always add up to 90°, once you know one, you automatically know the other. Beyond that, each unknown side or angle typically needs its own SOH-CAH-TOA calculation — identify the two sides (or side and angle) you have, and choose the matching ratio, exactly as in the previous lesson. To avoid compounding errors, keep full precision through intermediate steps and only round your very final answer.',
    workedExamples: [
      { id: 'wx-solve-full-triangle', prompt: 'A right triangle has one acute angle of 28° and hypotenuse 15cm. Find the other acute angle and both remaining sides.', steps: [
        { step: 'The other acute angle = 90° - 28° = 62°.', justification: 'The two acute angles sum to 90°.' },
        { step: 'Opposite (to 28°) = 15 × sin(28°) ≈ 7.04cm.', justification: 'Opposite and hypotenuse are known/wanted — use Sine.' },
        { step: 'Adjacent (to 28°) = 15 × cos(28°) ≈ 13.24cm.', justification: 'Adjacent and hypotenuse — use Cosine.' },
      ], answer: 'Other angle = 62°, opposite ≈ 7.04cm, adjacent ≈ 13.24cm' },
    ],
    knowledgeChecks: [
      { question: 'A right triangle has one acute angle of 63°. What is the other acute angle?', options: ['27°', '63°', '117°', '37°'], correctIndex: 0, explanation: '90° - 63° = 27°.', misconceptionId: 'angle-sum-forgotten' },
      { question: 'Why should you avoid rounding in the middle of a multi-step trig calculation?', options: ['Rounding early compounds errors into later steps', 'It makes the calculator slower', 'It is against the rules', 'It doesn\'t matter either way'], correctIndex: 0, explanation: 'Small rounding errors early in a calculation get carried forward and can meaningfully change the final answer.', misconceptionId: 'premature-rounding' },
    ],
    confidenceCheckPrompt: 'How confident do you feel fully solving a right-angled triangle for all its unknown sides and angles?',
  },

  demonstrateChunk2: {
    explanation:
      'Applied problems often involve the angle of ELEVATION (measured upward from the horizontal, looking up at something) or DEPRESSION (measured downward from the horizontal, looking down at something) — both measured from the observer\'s horizontal line of sight. In word problems, first sketch and clearly label the right-angled triangle: mark the horizontal line, the angle, and the sides you know or want. Some problems need more than one triangle or more than one trig calculation — solve them one clear step at a time.',
    workedExamples: [
      { id: 'wx-elevation', prompt: 'From a point 20m from the base of a tower, the angle of elevation to the top is 35°. Find the tower\'s height.', steps: [
        { step: 'Sketch: a right triangle with the horizontal distance (20m, adjacent) and the height (opposite), with the 35° angle at the observer.', justification: 'Clearly identify the triangle and label its parts before calculating.' },
        { step: 'tan(35°) = height/20, so height = 20 × tan(35°).', justification: 'Opposite and adjacent are involved — use Tangent.' },
        { step: 'height ≈ 20 × 0.700 ≈ 14.0m.', justification: 'Evaluate with the calculator in degree mode.' },
      ], answer: 'The tower is approximately 14.0m tall.' },
      { id: 'wx-depression', prompt: 'From the top of a 50m cliff, the angle of depression to a boat is 22°. Find the horizontal distance from the cliff base to the boat.', steps: [
        { step: 'The angle of depression (22°) from the top equals the angle of elevation from the boat, due to alternate angles (parallel horizontal lines).', justification: 'This equivalence is a useful shortcut in elevation/depression problems.' },
        { step: 'tan(22°) = 50/distance, so distance = 50/tan(22°).', justification: 'Opposite (height, 50m) and adjacent (distance) — use Tangent, rearranged.' },
        { step: 'distance ≈ 50/0.404 ≈ 123.7m.', justification: 'Evaluate carefully, keeping precision.' },
      ], answer: 'The boat is approximately 123.7m from the cliff base.' },
    ],
    knowledgeChecks: [
      { question: 'You are standing on the ground looking up at a kite. What angle are you measuring?', options: ['Angle of elevation', 'Angle of depression', 'Right angle', 'Cannot be determined'], correctIndex: 0, explanation: 'Looking upward from the horizontal is the angle of elevation.', misconceptionId: 'elevation-depression-confused' },
      { question: 'You are on a cliff looking down at a boat. What angle are you measuring?', options: ['Angle of depression', 'Angle of elevation', 'Adjacent angle', 'Cannot be determined'], correctIndex: 0, explanation: 'Looking downward from the horizontal is the angle of depression.', misconceptionId: 'elevation-depression-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel solving elevation/depression problems and multi-step applied triangle problems?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'find-unknown-angle', revealSteps: 2, prompt: 'A right triangle has opposite side 6cm and hypotenuse 14cm. Find the angle and the adjacent side.', steps: [
        { step: 'Angle: sin⁻¹(6/14) ≈ sin⁻¹(0.4286) ≈ 25.4°.', justification: 'Opposite and hypotenuse known — use inverse Sine.' },
        { step: 'Adjacent: use Pythagoras or Cosine — adjacent = 14×cos(25.4°) ≈ 12.65cm.', justification: 'Find the remaining side.' },
      ], answer: 'Angle ≈ 25.4°, adjacent ≈ 12.65cm' },
      { id: 'fp-partial-1', objectiveId: 'elevation-depression', revealSteps: 1, prompt: 'From 30m away from a building\'s base, the angle of elevation to the top is 42°. Find the building\'s height.', steps: [
        { step: 'tan(42°) = height/30.', justification: 'Opposite/adjacent = Tangent.' },
        { step: 'height = 30 × tan(42°) ≈ 27.0m.', justification: 'Solve for height.' },
      ], answer: 'Height ≈ 27.0m' },
      { id: 'fp-independent-1', objectiveId: 'multi-step-applications', revealSteps: 0, prompt: 'A ladder leans against a wall, making a 65° angle with the ground. If the base of the ladder is 2m from the wall, find the ladder\'s length and the height it reaches.', steps: [
        { step: 'Ladder length (hypotenuse): cos(65°) = 2/length, so length = 2/cos(65°) ≈ 4.73m.', justification: 'Adjacent and hypotenuse — use Cosine, rearranged.' },
        { step: 'Height reached (opposite): tan(65°) = height/2, so height = 2×tan(65°) ≈ 4.29m.', justification: 'Opposite and adjacent — use Tangent.' },
      ], answer: 'Ladder ≈ 4.73m, height reached ≈ 4.29m' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'find-unknown-side', question: 'A right triangle has angle 55° and hypotenuse 20cm. Find the adjacent side.', options: ['≈ 11.47cm', '≈ 16.38cm', '≈ 24.4cm', '≈ 9.13cm'], correctIndex: 0, hints: { strategic: 'Adjacent and hypotenuse — use Cosine.', procedural: 'adjacent = 20 × cos(55°).', workedStep: '20 × 0.5736 ≈ 11.47cm.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'find-unknown-angle', question: 'A right triangle has opposite 9cm, adjacent 12cm. Find the angle.', options: ['≈ 36.9°', '≈ 53.1°', '≈ 41.4°', '≈ 48.6°'], correctIndex: 0, hints: { strategic: 'Opposite and adjacent — use inverse Tangent.', procedural: 'θ = tan⁻¹(9/12).', workedStep: 'tan⁻¹(0.75) ≈ 36.9°.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'elevation-depression', question: 'From the top of a 40m lighthouse, the angle of depression to a ship is 18°. Find the horizontal distance to the ship.', options: ['≈ 123.1m', '≈ 12.98m', '≈ 42.1m', '≈ 218.2m'], correctIndex: 0, hints: { strategic: 'The angle of depression equals the angle of elevation from the ship (alternate angles).', procedural: 'tan(18°) = 40/distance.', workedStep: 'distance = 40/tan(18°) ≈ 123.1m.' }, distractorMisconceptions: { 1: 'elevation-depression-confused' } },
      { id: 'ip-4', objectiveId: 'multi-step-applications', question: 'A right triangle has one acute angle 48° and opposite side 10cm. Find the other acute angle AND the hypotenuse.', options: ['42°, ≈ 13.46cm', '48°, ≈ 13.46cm', '42°, ≈ 9.00cm', '52°, ≈ 15.0cm'], correctIndex: 0, hints: { strategic: 'First find the other angle (90° minus the known one), then use SOH-CAH-TOA for the hypotenuse.', procedural: '90-48=42°. hyp = 10/sin(48°).', workedStep: '10/0.743 ≈ 13.46cm.' }, distractorMisconceptions: { 1: 'angle-sum-forgotten' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'find-unknown-side', multiSelect: false, question: 'A right triangle has angle 30° and opposite side 5cm. Find the hypotenuse.', options: ['10cm', '5cm', '8.66cm', '2.5cm'], correctIndices: [0], explanation: 'sin(30°) = 5/hyp, so hyp = 5/sin(30°) = 5/0.5 = 10cm.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'find-unknown-angle', multiSelect: false, question: 'True or false: if you know both legs (opposite and adjacent) of a right triangle, you can find either acute angle using inverse tangent.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — tan⁻¹(opposite/adjacent) gives one angle directly; the other follows from 90° minus that.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'find-unknown-angle', multiSelect: false, question: 'A right triangle has one acute angle of 71°. What is the other?', options: ['19°', '71°', '109°', '29°'], correctIndices: [0], explanation: '90° - 71° = 19°.', distractorMisconceptions: { 1: 'angle-sum-forgotten' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'elevation-depression', multiSelect: false, question: 'From 15m away from a tree\'s base, the angle of elevation to its top is 50°. Find the tree\'s height.', options: ['≈ 17.87m', '≈ 12.58m', '≈ 9.64m', '≈ 23.3m'], correctIndices: [0], explanation: 'tan(50°) = height/15, so height = 15×tan(50°) ≈ 17.87m.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'elevation-depression', multiSelect: false, question: 'True or false: the angle of elevation and angle of depression between two points are always equal to each other.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — by alternate angles between the two parallel horizontal lines, they are equal.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'multi-step-applications', multiSelect: false, question: 'A right triangle has angle 33° and hypotenuse 18cm. Find both remaining sides.', options: ['Opposite ≈ 9.80cm, Adjacent ≈ 15.10cm', 'Opposite ≈ 15.10cm, Adjacent ≈ 9.80cm', 'Opposite ≈ 12.0cm, Adjacent ≈ 12.0cm', 'Opposite ≈ 6.0cm, Adjacent ≈ 16.0cm'], correctIndices: [0], explanation: 'Opposite = 18×sin(33°) ≈ 9.80cm; Adjacent = 18×cos(33°) ≈ 15.10cm.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'find-unknown-side', multiSelect: false, question: 'A right triangle has angle 62° and adjacent side 7cm. Find the opposite side.', options: ['≈ 13.16cm', '≈ 3.72cm', '≈ 7.93cm', '≈ 15.6cm'], correctIndices: [0], explanation: 'tan(62°) = opposite/7, so opposite = 7×tan(62°) ≈ 13.16cm.', distractorMisconceptions: {} },
    { id: 'q8', type: 'true-false', objectiveId: 'multi-step-applications', multiSelect: false, question: 'True or false: it\'s good practice to round only your final answer in a multi-step trig problem, not intermediate results.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — rounding intermediate steps compounds small errors into the final answer.', distractorMisconceptions: { 1: 'premature-rounding' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'elevation-depression',
      analogy: 'Picture a horizontal laser pointer coming straight out of your eyes. If you tilt your head UP to see something, that tilt angle is elevation. If you tilt your head DOWN, it\'s depression. The angle is always measured from that horizontal laser line, never from the ground or from a wall.',
      explanation: 'Before solving, sketch the horizontal line at the observer\'s eye level, then mark the angle between that horizontal line and the line of sight to the object. Elevation = looking up; depression = looking down.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A drone hovers, and someone on the ground looks up at it at an angle of 60° from a point 10m away horizontally. Find the drone\'s height.', steps: [
          { step: 'This is an angle of elevation (looking up), measured from the horizontal at the observer.', justification: 'Identify the situation as elevation.' },
          { step: 'tan(60°) = height/10, so height = 10×tan(60°) ≈ 17.32m.', justification: 'Opposite/adjacent = Tangent.' },
        ], answer: 'Height ≈ 17.32m' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'elevation-depression', question: 'A pilot looks down at an airport at an angle of 25° from a horizontal distance of 3km. Is this elevation or depression, and what\'s the plane\'s altitude?', options: ['Depression; ≈ 1.40km', 'Elevation; ≈ 1.40km', 'Depression; ≈ 6.43km', 'Elevation; ≈ 6.43km'], correctIndex: 0, hints: { strategic: 'The pilot is looking DOWN at the airport — which angle type is that?', procedural: 'Depression. tan(25°) = altitude/3.', workedStep: 'altitude = 3×tan(25°) ≈ 1.40km.' }, distractorMisconceptions: { 1: 'elevation-depression-confused' } },
        { id: 'rem-p2', objectiveId: 'elevation-depression', question: 'Someone at the base of a hill looks up at its peak at 38°, standing 200m from the base (horizontally). Find the hill\'s height.', options: ['≈ 156.3m', '≈ 253.9m', '≈ 200m', '≈ 123.1m'], correctIndex: 0, hints: { strategic: 'This is elevation (looking up).', procedural: 'tan(38°) = height/200.', workedStep: 'height = 200×tan(38°) ≈ 156.3m.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'elevation-depression', question: 'From a 25m tall lighthouse, the angle of depression to a boat is 12°. Find the boat\'s distance from the lighthouse base.', options: ['≈ 117.6m', '≈ 5.31m', '≈ 25.5m', '≈ 212.5m'], correctIndex: 0, hints: { strategic: 'This is depression (looking down at the boat).', procedural: 'tan(12°) = 25/distance.', workedStep: 'distance = 25/tan(12°) ≈ 117.6m.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which felt trickier: elevation/depression problems, or multi-step applications?', type: 'multiple-choice', options: ['Elevation/depression problems', 'Multi-step applications', 'Both felt similar', 'Neither felt difficult'] },
    { id: 'r2', prompt: 'How confident do you feel solving real-world right-angled triangle problems now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you always sketch first before solving an applied trig word problem?', type: 'free-text' },
  ],
};
