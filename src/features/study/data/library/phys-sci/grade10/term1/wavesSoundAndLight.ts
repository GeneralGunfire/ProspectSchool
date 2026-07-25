// ── Physical Sciences, Term 1, Topic 1: Waves, Sound and Light ───────────────
// First Physical Sciences topic. Reuses the existing FunctionGraph
// component (built for Algebra Term 2) to plot transverse wave shapes,
// since a wave is naturally a Cartesian-plottable sine curve — no new
// component needed here.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'transverse-longitudinal-confused',
    label: 'Confusing transverse and longitudinal waves',
    errorType: 'You mixed up which wave type vibrates perpendicular to travel direction versus parallel to it.',
    principle: 'In a TRANSVERSE wave, particles vibrate PERPENDICULAR (at right angles) to the direction the wave travels (e.g. a wave on a string). In a LONGITUDINAL wave, particles vibrate PARALLEL to the direction of travel, creating compressions and rarefactions (e.g. sound).',
    correctStep: 'Light and water-surface waves are transverse (up-down motion, wave travels sideways); sound is longitudinal (back-forth motion, same direction as travel).',
  },
  {
    id: 'wave-speed-formula-error',
    label: 'Confusing which quantities multiply in the wave speed equation',
    errorType: 'You substituted frequency and wavelength into the wrong positions, or confused wave speed with frequency.',
    principle: 'Wave speed v = fλ (frequency × wavelength). Frequency (f) is measured in Hz (cycles per second); wavelength (λ) is measured in metres; speed (v) is measured in m/s.',
    correctStep: 'For f=2Hz and λ=3m: v = 2×3 = 6 m/s, not 2/3 or 3/2.',
  },
  {
    id: 'amplitude-vs-wavelength-confused',
    label: 'Confusing amplitude with wavelength on a wave diagram',
    errorType: 'You measured the wrong feature of the wave when asked for amplitude or wavelength.',
    principle: 'AMPLITUDE is the maximum displacement from the rest (equilibrium) position — the height of a crest above the midline. WAVELENGTH is the distance between two consecutive identical points (e.g. crest to crest).',
    correctStep: 'A wave with crests 2m above the midline and 5m apart has amplitude 2m and wavelength 5m — these are two completely different measurements.',
  },
  {
    id: 'sound-travels-fastest-in-vacuum',
    label: 'Believing sound travels through a vacuum, or travels fastest through a vacuum/gas',
    errorType: 'You assumed sound behaves like light, needing no medium, or travels fastest with least matter present.',
    principle: 'Sound is a MECHANICAL wave — it requires a MEDIUM (solid, liquid, or gas) to travel, since it relies on particles colliding to pass the vibration along. It CANNOT travel through a vacuum. Sound travels FASTEST through solids (particles closely packed), slower through liquids, slowest through gases.',
    correctStep: 'In space (a vacuum), sound cannot travel at all — this is why explosions in space movies are scientifically inaccurate without added sound effects.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 1,
  topicId: 'waves-sound-and-light',
  topicName: 'Waves, Sound and Light',
  prerequisites: [
    'Basic algebra and substituting into formulas',
  ],
  objectives: [
    { id: 'distinguish-wave-types', text: 'Distinguish transverse waves from longitudinal waves, with examples.' },
    { id: 'identify-wave-properties', text: 'Identify amplitude, wavelength, frequency, and period on a wave diagram.' },
    { id: 'apply-wave-speed-equation', text: 'Apply the wave speed equation v = fλ to solve problems.' },
    { id: 'explain-sound-requires-medium', text: 'Explain why sound requires a medium and how its speed varies between media.' },
  ],
  estimatedMinutes: [20, 30],
};

export const wavesSoundAndLight: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Why can\'t you hear an explosion in outer space?',
  goalSettingPrompt:
    'Waves carry energy without carrying matter along with them — but not all waves behave the same way. By the end of this lesson you\'ll be able to describe wave properties precisely, calculate wave speed, and explain why sound needs a medium to travel.',

  activate: {
    connectPrompt: 'You already know how to substitute values into a formula — that\'s exactly what the wave speed equation needs.',
    diagnosticQuestions: [
      { question: 'If y = 3x, find y when x = 4.', options: ['12', '7', '1', '0.75'], correctIndex: 0, explanation: 'y = 3×4 = 12.' },
      { question: 'What unit is frequency measured in?', options: ['Hertz (Hz)', 'Metres (m)', 'Seconds (s)', 'Newtons (N)'], correctIndex: 0, explanation: 'Frequency is measured in Hertz, cycles per second.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A TRANSVERSE wave has particles vibrating PERPENDICULAR to the direction of travel (like a wave on a string, or light). A LONGITUDINAL wave has particles vibrating PARALLEL to the direction of travel, creating compressions (particles bunched together) and rarefactions (particles spread apart) — sound is longitudinal. On a wave diagram: AMPLITUDE is the maximum displacement from the rest position (crest height above the midline); WAVELENGTH is the distance between two consecutive identical points (e.g. crest to crest).',
    workedExamples: [
      { id: 'wx-wave-properties', prompt: 'Identify the amplitude and wavelength of a transverse wave shown as y = 2sin(x), where x is in metres and the pattern repeats every 6m.', steps: [
        { step: 'Amplitude: the coefficient of sin is 2, meaning the wave rises 2 units above (and below) the midline.', justification: 'Amplitude is the maximum displacement from rest.' },
        { step: 'Wavelength: given as 6m (the distance for one full repeating cycle).', justification: 'Wavelength is the distance between consecutive identical points.' },
      ], answer: 'Amplitude = 2m, Wavelength = 6m', graph: {
        fn: (x: number) => 2 * Math.sin((2 * Math.PI * x) / 6), domain: [0, 12], yDomain: [-3, 3],
        features: [{ x: 1.5, y: 2, label: 'crest' }, { x: 4.5, y: -2, label: 'trough' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'Which type of wave is sound?', options: ['Longitudinal', 'Transverse', 'Neither', 'Both equally'], correctIndex: 0, explanation: 'Sound particles vibrate parallel to the direction of travel — longitudinal.', misconceptionId: 'transverse-longitudinal-confused' },
      { question: 'On a wave diagram, what does amplitude measure?', options: ['The maximum displacement from the rest position', 'The distance between two crests', 'The number of waves per second', 'The wave\'s speed'], correctIndex: 0, explanation: 'Amplitude is the height of a crest above the midline, not the distance between crests.', misconceptionId: 'amplitude-vs-wavelength-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel distinguishing wave types and identifying wave properties?',
  },

  demonstrateChunk2: {
    explanation:
      'Wave speed: v = fλ, where f is frequency (Hz) and λ is wavelength (m), giving v in m/s. Sound is a MECHANICAL wave requiring a MEDIUM (solid, liquid, or gas) — it cannot travel through a vacuum, since it relies on particles colliding to pass the vibration along. Sound travels FASTEST through solids (tightly packed particles), slower through liquids, slowest through gases.',
    workedExamples: [
      { id: 'wx-wave-speed', prompt: 'A wave has frequency 5Hz and wavelength 4m. Find its speed.', steps: [
        { step: 'v = fλ = 5 × 4.', justification: 'Apply the wave speed equation directly.' },
        { step: 'v = 20 m/s.', justification: 'Multiply, including units.' },
      ], answer: 'v = 20 m/s' },
      { id: 'wx-sound-medium', prompt: 'Explain why an astronaut on the Moon cannot hear another astronaut shout, even standing close by.', steps: [
        { step: 'The Moon has essentially no atmosphere — no medium (gas) present for sound to travel through.', justification: 'Sound requires particles to collide and pass vibrations along.' },
        { step: 'Without a medium, sound simply cannot propagate, regardless of distance.', justification: 'This is why sound cannot travel through a vacuum.' },
      ], answer: 'No medium (atmosphere) is present on the Moon for sound to travel through' },
    ],
    knowledgeChecks: [
      { question: 'A wave has frequency 10Hz and wavelength 2m. Find its speed.', options: ['20 m/s', '5 m/s', '12 m/s', '8 m/s'], correctIndex: 0, explanation: 'v = fλ = 10×2 = 20 m/s.', misconceptionId: 'wave-speed-formula-error' },
      { question: 'In which medium does sound travel fastest?', options: ['Solids', 'Liquids', 'Gases', 'Vacuum'], correctIndex: 0, explanation: 'Sound travels fastest through solids, where particles are most tightly packed.', misconceptionId: 'sound-travels-fastest-in-vacuum' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying the wave speed equation and explaining why sound needs a medium?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-wave-speed-equation', revealSteps: 1, prompt: 'A wave has frequency 8Hz and wavelength 1.5m. Find its speed.', steps: [
        { step: 'v = 8 × 1.5 = 12 m/s.', justification: 'Apply v=fλ.' },
      ], answer: '12 m/s' },
      { id: 'fp-partial-1', objectiveId: 'distinguish-wave-types', revealSteps: 1, prompt: 'Is a Mexican wave in a stadium crowd transverse or longitudinal?', steps: [
        { step: 'People stand up and sit down (perpendicular motion) while the wave moves sideways around the stadium.', justification: 'Check the direction of particle motion relative to wave travel.' },
        { step: 'This matches transverse wave behaviour.', justification: 'Perpendicular motion to wave travel direction.' },
      ], answer: 'Transverse' },
      { id: 'fp-independent-1', objectiveId: 'explain-sound-requires-medium', revealSteps: 0, prompt: 'Would sound travel faster through steel or through air? Explain why.', steps: [
        { step: 'Steel is a solid with tightly packed particles, allowing vibrations to pass along much faster than in air (a gas with widely spaced particles).', justification: 'Sound speed depends on how closely packed and connected the medium\'s particles are.' },
      ], answer: 'Faster through steel — solids transmit sound faster than gases' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'distinguish-wave-types', question: 'Is light a transverse or longitudinal wave?', options: ['Transverse', 'Longitudinal', 'Neither', 'Both equally'], correctIndex: 0, hints: { strategic: 'Light\'s electric/magnetic field oscillations are perpendicular to travel direction.', procedural: 'This matches transverse wave behaviour.', workedStep: 'Transverse.' }, distractorMisconceptions: { 1: 'transverse-longitudinal-confused' } },
      { id: 'ip-2', objectiveId: 'identify-wave-properties', question: 'A wave\'s crests are 4m apart and rise 1.5m above the midline. What are the wavelength and amplitude?', options: ['Wavelength 4m, amplitude 1.5m', 'Wavelength 1.5m, amplitude 4m', 'Wavelength 4m, amplitude 4m', 'Wavelength 1.5m, amplitude 1.5m'], correctIndex: 0, hints: { strategic: 'Wavelength = crest-to-crest distance; amplitude = height above midline.', procedural: 'These are two separate measurements.', workedStep: 'Wavelength 4m, amplitude 1.5m.' }, distractorMisconceptions: { 1: 'amplitude-vs-wavelength-confused' } },
      { id: 'ip-3', objectiveId: 'apply-wave-speed-equation', question: 'A wave travels at 340 m/s with wavelength 0.5m. Find its frequency.', options: ['680 Hz', '170 Hz', '340.5 Hz', '85 Hz'], correctIndex: 0, hints: { strategic: 'Rearrange v=fλ to find f.', procedural: 'f = v/λ = 340/0.5.', workedStep: '= 680 Hz.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'explain-sound-requires-medium', question: 'Why can\'t sound travel through a vacuum?', options: ['There are no particles to collide and pass the vibration along', 'Sound travels fastest in a vacuum', 'Vacuums are too cold for sound', 'Sound doesn\'t need a reason, it just can\'t'], correctIndex: 0, hints: { strategic: 'Sound relies on particle collisions.', procedural: 'A vacuum has no particles at all.', workedStep: 'No particles to transmit the vibration.' }, distractorMisconceptions: { 1: 'sound-travels-fastest-in-vacuum' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'distinguish-wave-types', multiSelect: false, question: 'Which wave type has particles vibrating parallel to the direction of travel?', options: ['Longitudinal', 'Transverse', 'Neither', 'Both'], correctIndices: [0], explanation: 'Longitudinal waves vibrate parallel to travel direction.', distractorMisconceptions: { 1: 'transverse-longitudinal-confused' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'identify-wave-properties', multiSelect: false, question: 'A wave has amplitude 3m. How far below the midline does the trough reach?', options: ['3m', '6m', '1.5m', '0m'], correctIndices: [0], explanation: 'The trough is the same distance below the midline as the crest is above — the amplitude.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-wave-speed-equation', multiSelect: false, question: 'A wave has frequency 6Hz and wavelength 3m. Find its speed.', options: ['18 m/s', '2 m/s', '9 m/s', '3 m/s'], correctIndices: [0], explanation: 'v = fλ = 6×3 = 18 m/s.', distractorMisconceptions: { 1: 'wave-speed-formula-error' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'apply-wave-speed-equation', multiSelect: false, question: 'A wave travels at 12 m/s with frequency 4Hz. Find its wavelength.', options: ['3m', '48m', '8m', '16m'], correctIndices: [0], explanation: 'λ = v/f = 12/4 = 3m.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'explain-sound-requires-medium', multiSelect: false, question: 'True or false: sound can travel through a vacuum, just more slowly than through air.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — sound cannot travel through a vacuum at all, since there are no particles to carry the vibration.', distractorMisconceptions: { 0: 'sound-travels-fastest-in-vacuum' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'explain-sound-requires-medium', multiSelect: false, question: 'Rank these from fastest to slowest sound transmission: solid, liquid, gas.', options: ['Solid, liquid, gas', 'Gas, liquid, solid', 'Liquid, solid, gas', 'They are all equal'], correctIndices: [0], explanation: 'Sound travels fastest in solids (tightly packed particles), slowest in gases.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'distinguish-wave-types', multiSelect: false, question: 'A slinky pushed and pulled along its length (compressions travelling along it) demonstrates which wave type?', options: ['Longitudinal', 'Transverse', 'Neither', 'Both'], correctIndices: [0], explanation: 'Push-pull motion along the direction of travel is longitudinal.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-wave-properties', multiSelect: true, question: 'Which of these are properties you can measure directly from a wave diagram? (select all that apply)', options: ['Amplitude', 'Wavelength', 'The wave\'s colour', 'Crest position'], correctIndices: [0, 1, 3], explanation: 'Amplitude, wavelength, and crest position are all measurable from a wave diagram. Colour is not a general wave property (it applies specifically to visible light).', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-wave-speed-equation',
      analogy: 'Think of v=fλ like counting how far a line of marching cars travels: frequency is "how many cars pass a point each second," wavelength is "the length taken up by one car" — multiply them together and you get "the total distance covered per second," which is the speed.',
      explanation: 'Always identify which two of the three quantities (v, f, λ) are given, then rearrange v=fλ to solve for the missing one: v=fλ, f=v/λ, or λ=v/f.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A wave has speed 15 m/s and frequency 3Hz. Find its wavelength.', steps: [
          { step: 'Rearrange v=fλ to λ=v/f.', justification: 'Solve for the missing quantity.' },
          { step: 'λ = 15/3 = 5m.', justification: 'Substitute and evaluate.' },
        ], answer: 'λ = 5m' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-wave-speed-equation', question: 'A wave has speed 20 m/s and wavelength 4m. Find its frequency.', options: ['5 Hz', '80 Hz', '16 Hz', '24 Hz'], correctIndex: 0, hints: { strategic: 'f = v/λ.', procedural: '20/4', workedStep: '= 5 Hz.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'apply-wave-speed-equation', question: 'A wave has frequency 7Hz and wavelength 2m. Find its speed.', options: ['14 m/s', '9 m/s', '5 m/s', '3.5 m/s'], correctIndex: 0, hints: { strategic: 'v = fλ.', procedural: '7×2', workedStep: '= 14 m/s.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'apply-wave-speed-equation', question: 'A wave has speed 100 m/s and frequency 25Hz. Find its wavelength.', options: ['4m', '2500m', '75m', '0.25m'], correctIndex: 0, hints: { strategic: 'λ = v/f.', procedural: '100/25', workedStep: '= 4m.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the key difference between a transverse and a longitudinal wave?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with wave properties and the wave speed equation now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Why can\'t sound travel through space?', type: 'multiple-choice', options: ['There is no medium (particles) for it to travel through', 'Space is too cold', 'Sound travels too fast in space', 'It actually can travel through space'] },
  ],
};
