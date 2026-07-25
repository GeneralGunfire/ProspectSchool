// ── Term 2, Topic 1: Trigonometric Ratios (SOH-CAH-TOA) ──────────────────────
// Grade 10, Term 2. Per LIBRARY_ALGEBRA_TERM2_RESEARCH.md, this topic doesn't
// need graph visuals (right-angled triangle diagrams are described in text/
// worked-example steps, consistent with the existing engine's text-first
// pattern) — the FunctionGraph component is reserved for the Functions and
// Trig-graph topics later in Term 2.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'wrong-side-labelled-opposite',
    label: 'Labelling the wrong side as "opposite" or "adjacent"',
    errorType: 'You labelled a side as opposite or adjacent without checking which angle you\'re working from.',
    principle: '"Opposite" and "adjacent" are always relative to the angle you\'re using — the opposite side is across from that specific angle, and the adjacent side is next to it (but is NOT the hypotenuse). The hypotenuse is always the longest side, opposite the right angle, and never changes.',
    correctStep: 'For angle A, the side directly across from A is "opposite"; the other non-hypotenuse side (next to A) is "adjacent".',
  },
  {
    id: 'wrong-ratio-chosen',
    label: 'Choosing the wrong trig ratio (sin/cos/tan) for the given sides',
    errorType: 'You picked a trig ratio that doesn\'t match the two sides you actually have (or need to find).',
    principle: 'SOH-CAH-TOA: Sine = Opposite/Hypotenuse, Cosine = Adjacent/Hypotenuse, Tangent = Opposite/Adjacent. Identify which two sides are involved (given or wanted) BEFORE choosing which ratio to use.',
    correctStep: 'If you know the adjacent side and want the hypotenuse, use Cosine (Adjacent/Hypotenuse) — not Sine or Tangent.',
  },
  {
    id: 'calculator-mode-error',
    label: 'Using the wrong calculator angle mode',
    errorType: 'Your calculator was in the wrong mode (radians instead of degrees), giving a nonsensical answer.',
    principle: 'At this level, all angle work uses DEGREES. Always check your calculator is in degree mode before computing any trig ratio or inverse trig function.',
    correctStep: 'sin(30°) = 0.5 in degree mode — a very different (and wrong) number results if the calculator is in radian mode.',
  },
  {
    id: 'inverse-trig-confusion',
    label: 'Confusing when to use a trig ratio vs. its inverse',
    errorType: 'You used sin/cos/tan when you needed the inverse (sin⁻¹/cos⁻¹/tan⁻¹), or vice versa.',
    principle: 'Use sin/cos/tan when you know an ANGLE and want a SIDE. Use the inverse (sin⁻¹/cos⁻¹/tan⁻¹) when you know a RATIO of two sides and want the ANGLE.',
    correctStep: 'To find an unknown angle from two known sides, use the inverse function: θ = tan⁻¹(opposite/adjacent).',
  },
  {
    id: 'special-angle-memorisation-error',
    label: 'Misremembering a special-angle trig value',
    errorType: 'You recalled the wrong exact value for a trig ratio at 30°, 45°, or 60°.',
    principle: 'The special angles (30°, 45°, 60°) have fixed, standard values that come from consistent right-angled triangles (a 45-45-90 and a 30-60-90 triangle) — they can be re-derived from those triangles if forgotten, not just guessed.',
    correctStep: 'sin(30°) = 1/2, sin(45°) = √2/2, sin(60°) = √3/2 — these come from the ratios of sides in the 30-60-90 and 45-45-90 triangles.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 2,
  topicId: 'trigonometric-ratios',
  topicName: 'Trigonometric Ratios (SOH-CAH-TOA)',
  prerequisites: [
    'Basic properties of right-angled triangles',
    'Simplifying and solving simple equations (Term 1)',
  ],
  objectives: [
    { id: 'label-triangle-sides', text: 'Correctly label the opposite, adjacent, and hypotenuse sides relative to a given angle.' },
    { id: 'apply-soh-cah-toa', text: 'Choose and apply the correct trig ratio (sine, cosine, or tangent) for a given pair of sides.' },
    { id: 'use-calculator-trig', text: 'Use a calculator correctly (in degree mode) to evaluate and invert trig ratios.' },
    { id: 'special-angles', text: 'Recall the exact trig ratio values for the special angles 30°, 45°, and 60°.' },
  ],
  estimatedMinutes: [20, 30],
};

export const trigonometricRatios: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Why do all right-angled triangles with the same angle behave the same way?',
  goalSettingPrompt:
    'Every right-angled triangle with a given acute angle has the same SIDE RATIOS, no matter its size — that consistency is what makes trigonometry work. By the end of this lesson you\'ll be able to name a triangle\'s sides correctly and use SOH-CAH-TOA to relate angles and sides.',

  activate: {
    connectPrompt: 'Trigonometry builds on right-angled triangles you\'ve seen since Grade 9 (like Pythagoras\' theorem).',
    diagnosticQuestions: [
      { question: 'In a right-angled triangle, which side is always the longest?', options: ['The hypotenuse', 'The side opposite the smallest angle', 'It varies', 'The adjacent side'], correctIndex: 0, explanation: 'The hypotenuse, opposite the right angle, is always the longest side.' },
      { question: 'If a triangle has sides 3, 4, and 5, which is the hypotenuse?', options: ['5', '3', '4', 'Cannot tell'], correctIndex: 0, explanation: 'The hypotenuse is the longest side, opposite the right angle — here, 5.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'In a right-angled triangle, relative to a chosen angle (not the right angle), the three sides have names: the HYPOTENUSE (always the longest side, opposite the right angle, never changes), the OPPOSITE side (directly across from the chosen angle), and the ADJACENT side (next to the chosen angle, but not the hypotenuse). These names depend on WHICH angle you\'re working from — the same side can be "opposite" for one angle and "adjacent" for the other acute angle in the same triangle.',
    workedExamples: [
      { id: 'wx-label-sides', prompt: 'In a right-angled triangle with angle A marked, label the three sides.', steps: [
        { step: 'The side opposite the right angle (the longest side) is the hypotenuse — this never changes regardless of which angle you pick.', justification: 'The hypotenuse is fixed by the right angle\'s position.' },
        { step: 'The side directly across from angle A is the "opposite" side.', justification: 'Opposite is always relative to the chosen angle.' },
        { step: 'The remaining side, touching angle A but not the hypotenuse, is the "adjacent" side.', justification: 'Adjacent means "next to" the chosen angle.' },
      ], answer: 'Hypotenuse (longest, opposite the right angle), Opposite (across from A), Adjacent (next to A).' },
      { id: 'wx-relabel-other-angle', prompt: 'The same triangle also has angle B (the other acute angle). How do the side names change?', steps: [
        { step: 'The hypotenuse stays the same — it never depends on which acute angle you pick.', justification: 'Hypotenuse is fixed.' },
        { step: 'What was "opposite" for angle A is now the "adjacent" side for angle B, and vice versa.', justification: 'Opposite/adjacent swap depending on which angle you\'re measuring from.' },
      ], answer: 'The opposite and adjacent labels swap; the hypotenuse stays the same.' },
    ],
    knowledgeChecks: [
      { question: 'Which side is always the hypotenuse?', options: ['The side opposite the right angle', 'The side opposite the chosen angle', 'The shortest side', 'It depends on which angle you pick'], correctIndex: 0, explanation: 'The hypotenuse never changes — it is always opposite the right angle, regardless of which acute angle you focus on.', misconceptionId: 'wrong-side-labelled-opposite' },
      { question: 'If you switch from angle A to angle B in the same right triangle, what happens to the opposite and adjacent labels?', options: ['They swap', 'They stay the same', 'Both become the hypotenuse', 'There is no way to tell'], correctIndex: 0, explanation: 'What was opposite for A becomes adjacent for B, and vice versa.', misconceptionId: 'wrong-side-labelled-opposite' },
    ],
    confidenceCheckPrompt: 'How confident do you feel labelling the sides of a right-angled triangle relative to a given angle?',
  },

  demonstrateChunk2: {
    explanation:
      'SOH-CAH-TOA gives the three basic ratios: Sine = Opposite/Hypotenuse, Cosine = Adjacent/Hypotenuse, Tangent = Opposite/Adjacent. To choose the right one, identify which two sides you know (or want to find) relative to the angle, then pick the ratio connecting exactly those two. Always work in DEGREES and check your calculator is in degree mode. To find an unknown ANGLE from two known sides, use the INVERSE function (sin⁻¹, cos⁻¹, tan⁻¹) — the reverse of using the ratio to find a side.',
    workedExamples: [
      { id: 'wx-find-side', prompt: 'In a right triangle, angle A = 40°, and the hypotenuse is 10cm. Find the side opposite A.', steps: [
        { step: 'You know the angle and hypotenuse, and want the opposite side — this matches Sine (Opposite/Hypotenuse).', justification: 'Identify which two sides are involved: opposite and hypotenuse.' },
        { step: 'sin(40°) = opposite/10, so opposite = 10 × sin(40°).', justification: 'Rearrange the ratio to isolate the unknown side.' },
        { step: 'Using a calculator (degree mode): opposite ≈ 10 × 0.643 ≈ 6.43cm.', justification: 'Evaluate sin(40°) with the calculator in degree mode.' },
      ], answer: 'Opposite ≈ 6.43cm' },
      { id: 'wx-find-angle', prompt: 'In a right triangle, the opposite side is 5cm and the adjacent side is 8cm. Find the angle.', steps: [
        { step: 'You know opposite and adjacent, and want the angle — this matches Tangent (Opposite/Adjacent).', justification: 'Identify the two known sides.' },
        { step: 'tan(θ) = 5/8, so θ = tan⁻¹(5/8).', justification: 'Use the INVERSE tangent, since you\'re finding an angle from a ratio of sides.' },
        { step: 'θ ≈ tan⁻¹(0.625) ≈ 32.0°.', justification: 'Evaluate using the calculator in degree mode.' },
      ], answer: 'θ ≈ 32.0°' },
    ],
    knowledgeChecks: [
      { question: 'You know the adjacent side and the hypotenuse. Which ratio should you use to find the angle?', options: ['Cosine (inverse)', 'Sine (inverse)', 'Tangent (inverse)', 'Cosine (not inverse)'], correctIndex: 0, explanation: 'Adjacent and hypotenuse match Cosine — since you\'re finding the angle, use the inverse: cos⁻¹.', misconceptionId: 'wrong-ratio-chosen' },
      { question: 'What is sin(30°)?', options: ['0.5', '0.866', '1', '0'], correctIndex: 0, explanation: 'sin(30°) = 1/2 = 0.5, a standard special-angle value.', misconceptionId: 'special-angle-memorisation-error' },
    ],
    confidenceCheckPrompt: 'How confident do you feel choosing the right trig ratio and using your calculator correctly?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-soh-cah-toa', revealSteps: 2, prompt: 'A right triangle has angle 50° and adjacent side 6cm. Find the hypotenuse.', steps: [
        { step: 'Adjacent and hypotenuse match Cosine: cos(50°) = 6/hypotenuse.', justification: 'Identify the ratio connecting the known and wanted sides.' },
        { step: 'hypotenuse = 6/cos(50°) ≈ 6/0.643 ≈ 9.33cm.', justification: 'Rearrange and evaluate.' },
      ], answer: 'Hypotenuse ≈ 9.33cm' },
      { id: 'fp-partial-1', objectiveId: 'use-calculator-trig', revealSteps: 1, prompt: 'A right triangle has opposite side 7cm and hypotenuse 12cm. Find the angle.', steps: [
        { step: 'Opposite and hypotenuse match Sine: sin(θ) = 7/12.', justification: 'Identify the ratio.' },
        { step: 'θ = sin⁻¹(7/12) ≈ sin⁻¹(0.583) ≈ 35.7°.', justification: 'Use the inverse function since finding an angle.' },
      ], answer: 'θ ≈ 35.7°' },
      { id: 'fp-independent-1', objectiveId: 'special-angles', revealSteps: 0, prompt: 'Without a calculator, state cos(60°) exactly.', steps: [
        { step: 'This is one of the standard special-angle values.', justification: 'Recall from the 30-60-90 triangle ratios.' },
        { step: 'cos(60°) = 1/2.', justification: 'Standard exact value.' },
      ], answer: 'cos(60°) = 1/2' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'label-triangle-sides', question: 'For angle B in a right triangle, which side is "adjacent"?', options: ['The side touching B, not the hypotenuse', 'The side across from B', 'The hypotenuse', 'It cannot be determined'], correctIndex: 0, hints: { strategic: 'Adjacent means "next to".', procedural: 'It touches B but is not the longest side.', workedStep: 'The side touching B, excluding the hypotenuse.' }, distractorMisconceptions: { 1: 'wrong-side-labelled-opposite' } },
      { id: 'ip-2', objectiveId: 'apply-soh-cah-toa', question: 'You know the opposite side and hypotenuse, and want to find the angle. Which function?', options: ['sin⁻¹', 'sin', 'cos⁻¹', 'tan'], correctIndex: 0, hints: { strategic: 'Opposite/Hypotenuse matches which ratio?', procedural: 'Sine. Since you want the angle, use the inverse.', workedStep: 'sin⁻¹.' }, distractorMisconceptions: { 1: 'inverse-trig-confusion' } },
      { id: 'ip-3', objectiveId: 'use-calculator-trig', question: 'A triangle has angle 25° and hypotenuse 15cm. Find the opposite side.', options: ['≈ 6.34cm', '≈ 13.6cm', '≈ 33.1cm', '≈ 0.42cm'], correctIndex: 0, hints: { strategic: 'Opposite/Hypotenuse matches Sine.', procedural: 'opposite = 15 × sin(25°).', workedStep: '15 × 0.4226 ≈ 6.34cm.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'special-angles', question: 'What is tan(45°)?', options: ['1', '0.5', '√2', '0'], correctIndex: 0, hints: { strategic: 'This comes from a 45-45-90 triangle, where the two legs are equal.', procedural: 'Opposite = Adjacent for 45°.', workedStep: 'tan(45°) = Opposite/Adjacent = 1.' }, distractorMisconceptions: { 1: 'special-angle-memorisation-error' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'label-triangle-sides', multiSelect: false, question: 'True or false: the hypotenuse changes depending on which acute angle you focus on.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the hypotenuse is always opposite the right angle and never depends on which acute angle you choose.', distractorMisconceptions: { 0: 'wrong-side-labelled-opposite' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'apply-soh-cah-toa', multiSelect: false, question: 'You know the adjacent side and want to find the opposite side, and you know the angle. Which ratio connects them?', options: ['Tangent', 'Sine', 'Cosine', 'None of these'], correctIndices: [0], explanation: 'Tangent = Opposite/Adjacent connects exactly those two sides.', distractorMisconceptions: { 1: 'wrong-ratio-chosen', 2: 'wrong-ratio-chosen' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-soh-cah-toa', multiSelect: false, question: 'A right triangle has angle 35° and opposite side 4cm. Find the hypotenuse.', options: ['≈ 6.97cm', '≈ 2.29cm', '≈ 5.71cm', '≈ 4.88cm'], correctIndices: [0], explanation: 'sin(35°) = 4/hyp, so hyp = 4/sin(35°) ≈ 4/0.574 ≈ 6.97cm.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'use-calculator-trig', multiSelect: false, question: 'True or false: at this level, all trig calculations should be done with the calculator in degree mode.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — Grade 10 trigonometry works entirely in degrees.', distractorMisconceptions: { 1: 'calculator-mode-error' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'use-calculator-trig', multiSelect: false, question: 'A triangle has opposite side 9cm and adjacent side 9cm. Find the angle.', options: ['45°', '90°', '0°', '60°'], correctIndices: [0], explanation: 'tan(θ) = 9/9 = 1, so θ = tan⁻¹(1) = 45°.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'special-angles', multiSelect: false, question: 'What is sin(45°)?', options: ['√2/2 (≈0.707)', '1/2', '√3/2', '1'], correctIndices: [0], explanation: 'sin(45°) = √2/2 ≈ 0.707, from the 45-45-90 triangle.', distractorMisconceptions: { 1: 'special-angle-memorisation-error' } },
    { id: 'q7', type: 'true-false', objectiveId: 'special-angles', multiSelect: false, question: 'True or false: cos(30°) = sin(60°).', options: ['True', 'False'], correctIndices: [0], explanation: 'True — cos(30°) = √3/2 and sin(60°) = √3/2, since these two angles are complementary.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'apply-soh-cah-toa', multiSelect: true, question: 'Which ratios use the hypotenuse? (select all that apply)', options: ['Sine', 'Cosine', 'Tangent', 'None of them'], correctIndices: [0, 1], explanation: 'Sine (Opposite/Hypotenuse) and Cosine (Adjacent/Hypotenuse) both use the hypotenuse; Tangent (Opposite/Adjacent) does not.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-soh-cah-toa',
      analogy: 'Think of SOH-CAH-TOA like a lookup table with three doors. Before choosing a door, name exactly which two sides you have (or want) — then find the ONE door (ratio) whose two letters match those exact two sides.',
      explanation: 'Every time, write down: "I know ___ and ___, and I want ___." Then match those to SOH (Opp/Hyp), CAH (Adj/Hyp), or TOA (Opp/Adj) — whichever ratio contains exactly your known and wanted sides.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'You know the angle and the adjacent side, and want the opposite side. Which ratio?', steps: [
          { step: 'You have: angle, adjacent. You want: opposite.', justification: 'Name what you know and want first.' },
          { step: 'The ratio containing BOTH adjacent and opposite is Tangent (TOA).', justification: 'Match to the ratio with exactly those two side names.' },
        ], answer: 'Tangent' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-soh-cah-toa', question: 'You know the angle and hypotenuse, and want the adjacent side. Which ratio?', options: ['Cosine', 'Sine', 'Tangent', 'None'], correctIndex: 0, hints: { strategic: 'Which ratio contains both "adjacent" and "hypotenuse"?', procedural: 'CAH: Adjacent/Hypotenuse.', workedStep: 'Cosine.' }, distractorMisconceptions: { 1: 'wrong-ratio-chosen' } },
        { id: 'rem-p2', objectiveId: 'apply-soh-cah-toa', question: 'You know the opposite and adjacent sides, and want the angle. Which ratio (inverse)?', options: ['tan⁻¹', 'sin⁻¹', 'cos⁻¹', 'tan'], correctIndex: 0, hints: { strategic: 'Which ratio contains both opposite and adjacent?', procedural: 'TOA: Opposite/Adjacent. You want the angle, so use the inverse.', workedStep: 'tan⁻¹.' }, distractorMisconceptions: { 3: 'inverse-trig-confusion' } },
        { id: 'rem-p3', objectiveId: 'apply-soh-cah-toa', question: 'You know the opposite side and hypotenuse, and want the hypotenuse... wait, you want the adjacent side using a different known pair: opposite and angle, want adjacent. Which two-step approach works?', options: ['Find hypotenuse via Sine first, then adjacent via Cosine or Pythagoras', 'Use Tangent directly', 'It cannot be found', 'Use Cosine directly on opposite and angle'], correctIndex: 0, hints: { strategic: 'No single ratio connects opposite and adjacent directly with just the angle and opposite known — think of an indirect route.', procedural: 'First find the hypotenuse (Sine: Opposite/Hypotenuse), then use that to find adjacent (Cosine, or Pythagoras).', workedStep: 'Two-step: Sine then Cosine (or Pythagoras).' }, distractorMisconceptions: { 3: 'wrong-ratio-chosen' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the most useful trick you found for remembering SOH-CAH-TOA?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel using trig ratios now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you check first before using your calculator for a trig problem?', type: 'multiple-choice', options: ['That it\'s in degree mode', 'That the battery is charged', 'That I have a pencil', 'Nothing in particular'] },
  ],
};
