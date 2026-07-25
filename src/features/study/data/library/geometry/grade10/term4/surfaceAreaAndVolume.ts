// ── Geometry, Term 4, Topic 1: Surface Area and Volume of Solids ─────────────
// Measurement — per LIBRARY_GEOMETRY_RESEARCH.md, strong emphasis on
// diagram-interpretation (radius vs diameter) and unit-consistency checks.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'surface-area-volume-confused',
    label: 'Confusing surface area with volume',
    errorType: 'You calculated volume when surface area was asked for, or vice versa.',
    principle: 'SURFACE AREA measures the total area covering the OUTSIDE of a solid (measured in square units, like cm²) — how much material to wrap it. VOLUME measures how much SPACE is inside it (measured in cubic units, like cm³) — how much it can hold.',
    correctStep: 'Painting the outside of a box needs surface area (cm²); filling the box with sand needs volume (cm³).',
  },
  {
    id: 'radius-diameter-confused',
    label: 'Using the diameter where the radius is needed, or vice versa',
    errorType: 'You substituted the diameter into a formula that requires the radius (or vice versa).',
    principle: 'The RADIUS is the distance from the centre to the edge. The DIAMETER is the full distance across, through the centre — twice the radius. Formulas for circles/spheres/cylinders/cones use the RADIUS — always check which one a diagram is actually labelling.',
    correctStep: 'If a diagram labels a circle\'s width across as 10cm, that\'s the DIAMETER, so the radius is 5cm — halve it before substituting into any formula.',
  },
  {
    id: 'unit-not-converted',
    label: 'Mixing units (e.g. cm and m) without converting first',
    errorType: 'You used measurements with different units directly in the same calculation, without converting them to match.',
    principle: 'All measurements in a single calculation must use the SAME unit before you start — convert everything to the same unit (usually the smaller/more precise one, or whatever the question requires) first.',
    correctStep: 'A box with a height of 2m and width of 50cm: convert 2m to 200cm (or 50cm to 0.5m) before calculating — don\'t mix 2 and 50 directly.',
  },
  {
    id: 'wrong-unit-power-for-quantity',
    label: 'Using the wrong power of units (cm vs cm² vs cm³) for the quantity being measured',
    errorType: 'You reported an area with a linear unit (cm) or a volume with a squared unit (cm²), rather than the correct power.',
    principle: 'LENGTH uses a single unit (cm, m). AREA (including surface area) uses a SQUARED unit (cm², m²). VOLUME uses a CUBED unit (cm³, m³). Always match the unit\'s power to what you\'re actually measuring.',
    correctStep: 'A cylinder\'s surface area might be 150cm² (squared, since it\'s an area); its volume might be 400cm³ (cubed, since it\'s a volume) — never mix these up.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'geometry',
  grade: 10,
  term: 4,
  topicId: 'surface-area-and-volume',
  topicName: 'Surface Area and Volume of Solids',
  prerequisites: [
    'Area formulas for basic 2D shapes (rectangle, triangle, circle)',
    'Substituting into formulas',
  ],
  objectives: [
    { id: 'apply-prism-cylinder-formulas', text: 'Calculate the surface area and volume of prisms and cylinders.' },
    { id: 'apply-sphere-cone-pyramid-formulas', text: 'Calculate the surface area and volume of spheres, cones, and pyramids using given formulas.' },
    { id: 'convert-units-measurement', text: 'Convert between units correctly before performing a measurement calculation.' },
    { id: 'solve-composite-shapes', text: 'Calculate the surface area or volume of a simple composite (combined) solid.' },
  ],
  estimatedMinutes: [20, 30],
};

export const surfaceAreaAndVolume: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How much material does it take to wrap a box, versus how much can it hold?',
  goalSettingPrompt:
    'Every 3D solid has two very different measurements: how much surface covers it (surface area), and how much space is inside it (volume). By the end of this lesson you\'ll be able to calculate both, for several common solids, with careful attention to diagrams and units.',

  activate: {
    connectPrompt: 'You already know how to find the area of basic 2D shapes — surface area and volume build directly on that.',
    diagnosticQuestions: [
      { question: 'Find the area of a rectangle with length 8cm and width 5cm.', options: ['40cm²', '13cm²', '26cm²', '40cm'], correctIndex: 0, explanation: 'Area = length × width = 8×5 = 40cm².' },
      { question: 'Find the area of a circle with radius 3cm (use π≈3.14).', options: ['≈28.3cm²', '≈9.4cm²', '≈18.8cm²', '≈6cm²'], correctIndex: 0, explanation: 'Area = πr² = 3.14×9 ≈ 28.3cm².' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'For PRISMS (like rectangular boxes and triangular prisms), volume = base area × height, and surface area = the sum of the areas of every face. For CYLINDERS, volume = πr²h (circle base area times height), and surface area = 2πr² (the two circular ends) + 2πrh (the curved side, "unrolled" into a rectangle). Always check whether a diagram labels the RADIUS or the DIAMETER before substituting — the diameter must be halved first.',
    workedExamples: [
      { id: 'wx-prism-volume', prompt: 'Find the volume of a rectangular prism: length 6cm, width 4cm, height 3cm.', steps: [
        { step: 'Base area = length × width = 6×4 = 24cm².', justification: 'For a rectangular prism, the base is a rectangle.' },
        { step: 'Volume = base area × height = 24×3 = 72cm³.', justification: 'Volume of any prism = base area × height. Note the cubed unit.' },
      ], answer: 'Volume = 72cm³' },
      { id: 'wx-cylinder-volume', prompt: 'Find the volume of a cylinder with radius 4cm and height 10cm.', steps: [
        { step: 'Base area (circle) = πr² = π(4²) = 16π ≈ 50.27cm².', justification: 'The base of a cylinder is a circle.' },
        { step: 'Volume = base area × height = 50.27×10 ≈ 502.7cm³.', justification: 'Same principle as a prism: base area times height.' },
      ], answer: 'Volume ≈ 502.7cm³' },
    ],
    knowledgeChecks: [
      { question: 'A cylinder\'s diagram labels its width across the circular face as 12cm. What radius should you use in the formula?', options: ['6cm', '12cm', '24cm', '3cm'], correctIndex: 0, explanation: '12cm is the diameter; radius = diameter/2 = 6cm.', misconceptionId: 'radius-diameter-confused' },
      { question: 'Which quantity is measured in cm³?', options: ['Volume', 'Surface area', 'Perimeter', 'Length'], correctIndex: 0, explanation: 'Volume uses cubed units, since it measures 3D space.', misconceptionId: 'wrong-unit-power-for-quantity' },
    ],
    confidenceCheckPrompt: 'How confident do you feel calculating the volume of prisms and cylinders?',
  },

  demonstrateChunk2: {
    explanation:
      'For SPHERES, CONES, and PYRAMIDS, use the given formulas directly (they\'re not usually derived at this level): Sphere volume = (4/3)πr³, surface area = 4πr². Cone volume = (1/3)πr²h. Pyramid volume = (1/3) × base area × height. Always check units are CONSISTENT before calculating (convert if needed), and match your final answer\'s unit power to what\'s being measured: length (single unit), area (squared), volume (cubed).',
    workedExamples: [
      { id: 'wx-sphere', prompt: 'Find the volume and surface area of a sphere with radius 6cm.', steps: [
        { step: 'Volume = (4/3)πr³ = (4/3)π(216) = 288π ≈ 904.8cm³.', justification: 'Substitute r=6 into the given volume formula.' },
        { step: 'Surface area = 4πr² = 4π(36) = 144π ≈ 452.4cm².', justification: 'Substitute r=6 into the given surface area formula. Note the different unit power.' },
      ], answer: 'Volume ≈ 904.8cm³, Surface area ≈ 452.4cm²' },
      { id: 'wx-unit-conversion', prompt: 'A cylindrical tank has radius 50cm and height 2m. Find its volume in cm³.', steps: [
        { step: 'Convert height to cm: 2m = 200cm (matching the radius\'s unit).', justification: 'All measurements must use the same unit before calculating.' },
        { step: 'Volume = πr²h = π(50²)(200) = 500000π ≈ 1570796cm³.', justification: 'Now substitute with consistent units.' },
      ], answer: 'Volume ≈ 1570796cm³' },
    ],
    knowledgeChecks: [
      { question: 'Find the volume of a cone with radius 3cm and height 8cm.', options: ['≈75.4cm³', '≈226.2cm³', '≈37.7cm³', '≈150.8cm³'], correctIndex: 0, explanation: 'V=(1/3)πr²h=(1/3)π(9)(8)=24π≈75.4cm³.', misconceptionId: 'surface-area-volume-confused' },
      { question: 'A box has length 3m and width 80cm. Before calculating area, what should you do?', options: ['Convert both measurements to the same unit', 'Multiply them as they are', 'Ignore the width\'s unit', 'Add them together'], correctIndex: 0, explanation: 'Mixed units must be converted to match before any calculation.', misconceptionId: 'unit-not-converted' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying sphere/cone/pyramid formulas and handling unit conversions?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-prism-cylinder-formulas', revealSteps: 1, prompt: 'Find the volume of a rectangular prism: 5cm × 4cm × 6cm.', steps: [
        { step: 'Volume = 5×4×6 = 120cm³.', justification: 'Multiply all three dimensions (or base area × height).' },
      ], answer: 'Volume = 120cm³' },
      { id: 'fp-partial-1', objectiveId: 'apply-sphere-cone-pyramid-formulas', revealSteps: 1, prompt: 'Find the volume of a sphere with radius 3cm.', steps: [
        { step: 'V = (4/3)πr³ = (4/3)π(27).', justification: 'Substitute r=3.' },
        { step: '= 36π ≈ 113.1cm³.', justification: 'Evaluate.' },
      ], answer: 'Volume ≈ 113.1cm³' },
      { id: 'fp-independent-1', objectiveId: 'convert-units-measurement', revealSteps: 0, prompt: 'A cylinder has radius 20cm and height 1.5m. Find its volume in cm³.', steps: [
        { step: 'Convert height: 1.5m = 150cm. Volume = π(20²)(150) = 60000π ≈ 188495.6cm³.', justification: 'Convert to matching units first, then apply the formula.' },
      ], answer: 'Volume ≈ 188495.6cm³' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'apply-prism-cylinder-formulas', question: 'Find the volume of a cylinder with radius 5cm and height 12cm.', options: ['≈942.5cm³', '≈188.5cm³', '≈314.2cm³', '≈753.6cm³'], correctIndex: 0, hints: { strategic: 'V=πr²h.', procedural: 'π(25)(12)', workedStep: '=300π≈942.5cm³.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'apply-sphere-cone-pyramid-formulas', question: 'Find the volume of a pyramid with base area 30cm² and height 9cm.', options: ['90cm³', '270cm³', '30cm³', '9cm³'], correctIndex: 0, hints: { strategic: 'V=(1/3)×base area×height.', procedural: '(1/3)(30)(9)', workedStep: '=90cm³.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'convert-units-measurement', question: 'A box has dimensions 2m × 150cm × 50cm. What should you do before finding its volume?', options: ['Convert 2m to 200cm (or all to metres)', 'Multiply as given', 'Ignore the metre measurement', 'Only use the two cm measurements'], correctIndex: 0, hints: { strategic: 'All units must match.', procedural: 'Convert 2m to cm, or convert cm to m.', workedStep: 'Convert to matching units first.' }, distractorMisconceptions: { 1: 'unit-not-converted' } },
      { id: 'ip-4', objectiveId: 'solve-composite-shapes', question: 'A solid is a cylinder (volume 400cm³) with a cone (volume 100cm³) removed from the top. Find the remaining volume.', options: ['300cm³', '500cm³', '400cm³', '100cm³'], correctIndex: 0, hints: { strategic: 'Subtract the removed part from the total.', procedural: '400-100', workedStep: '=300cm³.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'apply-prism-cylinder-formulas', multiSelect: false, question: 'True or false: volume of a prism = base area × height.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this applies to all prisms and cylinders.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'apply-prism-cylinder-formulas', multiSelect: false, question: 'Find the volume of a cylinder with radius 2cm and height 5cm.', options: ['≈62.8cm³', '≈31.4cm³', '≈20cm³', '≈125.7cm³'], correctIndices: [0], explanation: 'π(4)(5)=20π≈62.8cm³.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-sphere-cone-pyramid-formulas', multiSelect: false, question: 'Find the volume of a sphere with radius 3cm.', options: ['≈113.1cm³', '≈339.3cm³', '≈28.3cm³', '≈37.7cm³'], correctIndices: [0], explanation: '(4/3)π(27)=36π≈113.1cm³.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'apply-sphere-cone-pyramid-formulas', multiSelect: false, question: 'Find the volume of a cone with radius 4cm and height 9cm.', options: ['≈150.8cm³', '≈452.4cm³', '≈50.3cm³', '≈75.4cm³'], correctIndices: [0], explanation: '(1/3)π(16)(9)=48π≈150.8cm³.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'convert-units-measurement', multiSelect: false, question: 'True or false: measurements in different units can be used directly in the same formula without converting.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — units must be converted to match before calculating.', distractorMisconceptions: { 0: 'unit-not-converted' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'convert-units-measurement', multiSelect: false, question: 'A cylinder has diameter 10cm. What radius should be used in the volume formula?', options: ['5cm', '10cm', '20cm', '2.5cm'], correctIndices: [0], explanation: 'Radius = diameter/2 = 5cm.', distractorMisconceptions: { 1: 'radius-diameter-confused' } },
    { id: 'q7', type: 'true-false', objectiveId: 'apply-prism-cylinder-formulas', multiSelect: false, question: 'True or false: surface area is measured in cubed units, like cm³.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — surface area uses squared units (cm²); volume uses cubed units.', distractorMisconceptions: { 0: 'wrong-unit-power-for-quantity' } },
    { id: 'q8', type: 'decimal-discrimination', objectiveId: 'solve-composite-shapes', multiSelect: false, question: 'A composite solid is a rectangular prism (volume 200cm³) with a smaller prism (volume 50cm³) attached. Find the total volume.', options: ['250cm³', '150cm³', '200cm³', '50cm³'], correctIndices: [0], explanation: '200+50=250cm³ (added, since the smaller prism is attached, not removed).', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-prism-cylinder-formulas',
      analogy: 'Think of finding a prism\'s or cylinder\'s volume like stacking identical flat layers (each the shape of the base) on top of each other, up to the full height — the total volume is just "one layer\'s area" multiplied by "how many layers" (the height).',
      explanation: 'Always follow: (1) identify the base shape and calculate its area; (2) multiply by the height. For surface area, add up the area of every distinct face.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Find the volume of a triangular prism: base triangle area 12cm², height (length of the prism) 10cm.', steps: [
          { step: 'Base area is already given: 12cm².', justification: 'The base is the triangular cross-section.' },
          { step: 'Volume = 12×10 = 120cm³.', justification: 'Multiply base area by the prism\'s length/height.' },
        ], answer: 'Volume = 120cm³' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-prism-cylinder-formulas', question: 'A prism has base area 18cm² and height 7cm. Find its volume.', options: ['126cm³', '25cm³', '11cm³', '18cm³'], correctIndex: 0, hints: { strategic: 'Volume = base area × height.', procedural: '18×7', workedStep: '=126cm³.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'apply-prism-cylinder-formulas', question: 'A cylinder has radius 3cm and height 10cm. Find its volume (use π≈3.14).', options: ['≈282.6cm³', '≈94.2cm³', '≈188.4cm³', '≈30cm³'], correctIndex: 0, hints: { strategic: 'V=πr²h.', procedural: '3.14×9×10', workedStep: '=282.6cm³.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'apply-prism-cylinder-formulas', question: 'A rectangular prism has length 4cm, width 5cm, height 6cm. Find its volume.', options: ['120cm³', '15cm³', '20cm³', '30cm³'], correctIndex: 0, hints: { strategic: 'Volume = length × width × height.', procedural: '4×5×6', workedStep: '=120cm³.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the difference between surface area and volume, in your own words?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel calculating surface area and volume now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you always check before substituting into a measurement formula?', type: 'multiple-choice', options: ['Whether it\'s radius or diameter, and whether units match', 'Nothing in particular', 'Only the colour of the diagram', 'The name of the shape only'] },
  ],
};
