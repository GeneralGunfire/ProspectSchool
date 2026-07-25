// ── Life Sciences, Term 2, Topic 2: Support and Transport Systems in Plants ──
// Builds on Plant and Animal Tissues (this term). Introductory Grade 10 scope:
// support via turgor pressure and structural tissues, and transport via xylem
// (water/minerals) and phloem (organic nutrients/translocation), plus transpiration.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'support-only-from-roots',
    label: 'Believing plants stay upright only because roots anchor them in soil',
    errorType: 'You explained a plant\'s upright posture purely in terms of roots holding it in the ground, ignoring internal support mechanisms.',
    principle: 'While roots do anchor a plant, much of a plant\'s upright support comes from INTERNAL mechanisms: TURGOR PRESSURE (water pushing outward against cell walls, keeping cells firm) and structural tissues like COLLENCHYMA and SCLERENCHYMA. A plant wilts (loses its upright shape) when it loses water, even though its roots are still firmly in the soil — proving support depends on more than anchoring.',
    correctStep: 'A wilted plant still has its roots in the soil, yet droops — this shows turgor pressure and structural tissue, not just root anchoring, are responsible for keeping the plant upright.',
  },
  {
    id: 'transpiration-just-water-loss',
    label: 'Viewing transpiration only as wasteful water loss with no functional role',
    errorType: 'You described transpiration purely as water being lost from the plant, without connecting it to the plant\'s transport system.',
    principle: 'TRANSPIRATION (water evaporating from leaf surfaces, mainly through stomata) is not just "loss" — it creates the PULLING FORCE (transpiration pull) that draws water and dissolved minerals UP through the xylem from the roots, all the way to the leaves. Transpiration is functionally linked to the plant\'s water transport system, not a separate wasteful process.',
    correctStep: 'As water evaporates from a leaf during transpiration, it pulls more water up the xylem behind it, like sucking on a straw — this is how water reaches the top of a tall tree.',
  },
  {
    id: 'transport-limited-to-leaves',
    label: 'Believing transport processes only involve the leaves',
    errorType: 'You described plant transport (xylem/phloem movement) as something that only happens in or near the leaves.',
    principle: 'Xylem and phloem form CONTINUOUS vascular tissue running through the ENTIRE plant — roots, stem, and leaves — not just within the leaves. Water travels from roots, through the stem, to the leaves via xylem; sugars travel from leaves (or storage organs) to wherever needed throughout the plant via phloem.',
    correctStep: 'Water absorbed by root hairs must travel through the root, up the entire stem, before reaching the leaves — this transport happens throughout the whole plant, not just at the leaf.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 2,
  topicId: 'support-and-transport-systems-in-plants',
  topicName: 'Support and Transport Systems in Plants',
  prerequisites: [
    'Plant and Animal Tissues (this term, Topic 1)',
  ],
  objectives: [
    { id: 'explain-plant-support-mechanisms', text: 'Explain how turgor pressure and structural tissues support a plant.' },
    { id: 'describe-xylem-phloem-transport', text: 'Describe what xylem and phloem transport, and in which direction(s).' },
    { id: 'explain-transpiration-role', text: 'Explain the role of transpiration in driving water transport up the plant.' },
  ],
  estimatedMinutes: [25, 35],
};

export const supportAndTransportSystemsInPlants: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'A tall tree has no bones, yet can hold thousands of litres of water dozens of metres in the air. How does it manage both support and transport without a skeleton or a heart?',
  goalSettingPrompt:
    'Plants achieve support and long-distance transport using pressure, structural tissue, and a clever pulling mechanism driven by evaporation. By the end of this lesson you\'ll be able to explain how plants stay upright, what xylem and phloem each transport, and how transpiration drives water movement.',

  activate: {
    connectPrompt: 'You already know xylem and phloem are vascular tissues (from Plant and Animal Tissues) — this lesson looks at exactly how they achieve transport, and what keeps a plant upright in the first place.',
    diagnosticQuestions: [
      { question: 'Besides roots anchoring a plant in soil, what else helps keep a plant upright?', options: ['Turgor pressure and structural tissue', 'Nothing else is needed', 'Only the leaves', 'Only photosynthesis'], correctIndex: 0, explanation: 'Internal water pressure and structural tissues both contribute to support.' },
      { question: 'Does water evaporating from leaves (transpiration) play any role in water transport?', options: ['Yes, it helps pull water up through the xylem', 'No, it is unrelated to transport', 'It only affects the roots', 'It stops water transport'], correctIndex: 0, explanation: 'Transpiration creates a pulling force that draws water upward.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Plant support comes from more than just roots anchoring the plant in soil. TURGOR PRESSURE — water pushing outward against the cell wall from inside plant cells — keeps cells firm, giving non-woody parts (like leaves and young stems) their rigidity; when water is lost, cells become FLACCID and the plant wilts. STRUCTURAL TISSUES also provide support: COLLENCHYMA (flexible support in young, growing parts) and SCLERENCHYMA (rigid support, often in mature stems, with thick lignified walls).',
    workedExamples: [
      { id: 'wx-turgor-support', prompt: 'Explain, using turgor pressure, why an unwatered plant wilts even though its roots remain in the soil.', steps: [
        { step: 'Without enough water, cells lose internal water pressure and become flaccid (soft), rather than firm.', justification: 'Turgor pressure depends on water pushing against the cell wall from inside the cell.' },
        { step: 'Flaccid cells can no longer hold the plant\'s non-woody parts upright, so the plant wilts, even though the roots are still anchored in soil.', justification: 'Support in non-woody parts depends on turgor pressure, not just root anchoring.' },
      ], answer: 'Loss of turgor pressure makes cells flaccid, causing wilting, independent of root anchoring' },
      { id: 'wx-structural-support', prompt: 'Explain how sclerenchyma tissue contributes to a mature stem\'s ability to stay upright.', steps: [
        { step: 'Sclerenchyma cells have thick, often lignified (hardened) cell walls.', justification: 'This structural feature gives sclerenchyma its rigidity.' },
        { step: 'This rigidity provides strong, lasting structural support, independent of water content — unlike turgor pressure, which depends on hydration.', justification: 'Sclerenchyma\'s support does not fail when water is scarce, unlike turgor-based support.' },
      ], answer: 'Its thick, lignified cell walls provide rigid structural support regardless of water levels' },
    ],
    knowledgeChecks: [
      { question: 'Why does a plant wilt when it lacks water, even though its roots are still in the soil?', options: ['Cells lose turgor pressure and become flaccid', 'The roots detach from the soil', 'Photosynthesis stops completely', 'The plant has no other explanation'], correctIndex: 0, explanation: 'Wilting results from loss of turgor pressure in cells, not root detachment.', misconceptionId: 'support-only-from-roots' },
      { question: 'Which plant tissue provides rigid, lasting structural support through thick, lignified walls?', options: ['Sclerenchyma', 'Parenchyma', 'Phloem', 'Meristematic tissue'], correctIndex: 0, explanation: 'Sclerenchyma\'s thick lignified walls give it rigid structural strength.' },
    ],
    confidenceCheckPrompt: 'How confident do you feel explaining turgor pressure and structural tissue support in plants?',
  },

  demonstrateChunk2: {
    explanation:
      'XYLEM transports water and dissolved mineral salts in ONE DIRECTION only — upward from roots to leaves. PHLOEM transports organic nutrients (mainly sugars from photosynthesis) via a process called TRANSLOCATION, and can move them in EITHER direction, from a "source" (where sugars are made or stored) to a "sink" (where they are needed, e.g. growing tissue or roots). TRANSPIRATION — the evaporation of water from leaf surfaces, mainly through STOMATA — creates a pulling force (the transpiration stream) that draws water and minerals up through the xylem from the roots, all the way through the stem to the leaves.',
    workedExamples: [
      { id: 'wx-translocation', prompt: 'A plant\'s leaves are actively photosynthesising and producing excess sugar, while its roots are growing and need sugar for energy. Describe the direction of phloem transport in this situation.', steps: [
        { step: 'The leaves are the "source" (producing sugar) and the roots are the "sink" (needing sugar).', justification: 'Phloem transport direction depends on identifying the source and sink in a given situation.' },
        { step: 'Phloem transports the sugars from the leaves (source) down to the roots (sink).', justification: 'Translocation always moves organic nutrients from source to sink, whatever direction that requires.' },
      ], answer: 'Phloem transports sugars from the leaves (source) down to the roots (sink)' },
      { id: 'wx-transpiration-pull', prompt: 'Explain, step by step, how transpiration helps water travel from the roots to the top of a tall tree.', steps: [
        { step: 'Water evaporates from leaf cells into the air, mainly through the stomata (transpiration).', justification: 'Transpiration is the evaporation of water from the leaf surface.' },
        { step: 'This evaporation creates a "pull" that draws more water up through the xylem to replace what was lost, all the way from the roots.', justification: 'The continuous column of water in the xylem is pulled upward as water is lost at the top, due to cohesion between water molecules.' },
      ], answer: 'Evaporation at the leaves pulls water continuously up through the xylem from the roots' },
    ],
    knowledgeChecks: [
      { question: 'Can phloem transport sugars downward, from leaves to roots?', options: ['Yes, phloem transport direction depends on source and sink', 'No, phloem only transports upward', 'No, phloem never transports sugars', 'Only xylem can transport downward'], correctIndex: 0, explanation: 'Phloem transport direction is flexible, following source-to-sink demand.' },
      { question: 'Does transpiration play a functional role in water transport, or is it just wasted water?', options: ['It creates the pulling force that draws water up the xylem', 'It is purely wasteful with no function', 'It only affects roots', 'It stops water movement'], correctIndex: 0, explanation: 'Transpiration drives water transport by creating a pulling force in the xylem.', misconceptionId: 'transpiration-just-water-loss' },
    ],
    confidenceCheckPrompt: 'How confident do you feel describing xylem/phloem transport and explaining transpiration\'s role?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'explain-plant-support-mechanisms', revealSteps: 1, prompt: 'A plant is watered after wilting and becomes upright again within hours. Explain this using turgor pressure.', steps: [
        { step: 'Watering restores water into the plant\'s cells, increasing internal pressure against the cell walls (turgor pressure), making cells firm again and restoring the plant\'s upright shape.', justification: 'Turgor pressure is directly restored by rehydrating the plant\'s cells.' },
      ], answer: 'Restored water increases turgor pressure, making cells firm and the plant upright again' },
      { id: 'fp-partial-1', objectiveId: 'describe-xylem-phloem-transport', revealSteps: 1, prompt: 'Describe what is being transported, and in which tissue, when mineral salts absorbed by roots reach the leaves.', steps: [
        { step: 'Mineral salts are transported dissolved in water, through the xylem.', justification: 'Xylem transports both water and dissolved mineral salts together.' },
        { step: 'This movement is one-directional, always upward from roots to leaves.', justification: 'Xylem transport only occurs in one direction: upward.' },
      ], answer: 'Mineral salts, dissolved in water, transported upward through the xylem' },
      { id: 'fp-independent-1', objectiveId: 'explain-transpiration-role', revealSteps: 0, prompt: 'In one sentence, explain why a plant in very dry, windy conditions loses water faster than usual through transpiration.', steps: [
        { step: 'Dry, windy conditions increase the rate of evaporation from the leaf surface (through the stomata), speeding up transpiration.', justification: 'Environmental conditions that increase evaporation rate directly increase transpiration rate.' },
      ], answer: 'Dry, windy conditions increase evaporation rate from leaves, speeding up transpiration' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'explain-plant-support-mechanisms', question: 'Which structure/process provides support in young, non-woody plant parts by pushing outward against the cell wall?', options: ['Turgor pressure', 'Xylem', 'Photosynthesis', 'Root anchoring alone'], correctIndex: 0, hints: { strategic: 'Think about water pressure inside cells.', procedural: 'Water pushing against the cell wall is turgor pressure.', workedStep: 'Turgor pressure.' }, distractorMisconceptions: { 3: 'support-only-from-roots' } },
      { id: 'ip-2', objectiveId: 'describe-xylem-phloem-transport', question: 'Sugars produced in a leaf are transported to a growing fruit. Which tissue carries out this transport?', options: ['Phloem', 'Xylem', 'Sclerenchyma', 'Collenchyma'], correctIndex: 0, hints: { strategic: 'Think about which tissue transports organic nutrients.', procedural: 'Sugars are organic nutrients, transported by phloem.', workedStep: 'Phloem.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'describe-xylem-phloem-transport', question: 'Where in the plant does xylem transport occur — only in leaves, or throughout the whole plant?', options: ['Throughout the whole plant, from roots to leaves', 'Only within the leaves', 'Only within the roots', 'Only in the stem'], correctIndex: 0, hints: { strategic: 'Think about the path water takes from soil to leaf.', procedural: 'Xylem is continuous from roots, through the stem, to the leaves.', workedStep: 'Throughout the whole plant.' }, distractorMisconceptions: { 1: 'transport-limited-to-leaves' } },
      { id: 'ip-4', objectiveId: 'explain-transpiration-role', question: 'What force does transpiration create that helps move water up the xylem?', options: ['A pulling force from evaporation at the leaves', 'A pushing force from the roots only', 'No force at all', 'A pulling force from the soil'], correctIndex: 0, hints: { strategic: 'Think about what happens as water evaporates from leaves.', procedural: 'Evaporation at the top pulls more water up behind it.', workedStep: 'A pulling force from evaporation at the leaves.' }, distractorMisconceptions: { 2: 'transpiration-just-water-loss' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'explain-plant-support-mechanisms', multiSelect: false, question: 'True or false: a plant\'s roots being anchored in soil is the ONLY reason it stays upright.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — turgor pressure and structural tissues also contribute significantly to support.', distractorMisconceptions: { 0: 'support-only-from-roots' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'explain-plant-support-mechanisms', multiSelect: false, question: 'What happens to plant cells when they lose water and become flaccid?', options: ['The plant loses rigidity and wilts', 'The plant grows taller', 'Nothing changes', 'The plant becomes more rigid'], correctIndices: [0], explanation: 'Loss of turgor pressure causes cells to become flaccid, leading to wilting.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'describe-xylem-phloem-transport', multiSelect: false, question: 'In which direction does xylem transport water and minerals?', options: ['Upward only, from roots to leaves', 'Downward only', 'Either direction, depending on demand', 'It does not transport anything'], correctIndices: [0], explanation: 'Xylem transport is strictly one-directional: upward.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'describe-xylem-phloem-transport', multiSelect: false, question: 'True or false: phloem can transport sugars in either direction, depending on source and sink.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — phloem transport direction depends on where sugars are produced versus needed.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'describe-xylem-phloem-transport', multiSelect: false, question: 'Where does xylem and phloem transport occur within the plant?', options: ['Throughout the whole plant — roots, stem, and leaves', 'Only within the leaves', 'Only within the roots', 'Only above ground'], correctIndices: [0], explanation: 'Xylem and phloem form continuous vascular tissue through the entire plant.', distractorMisconceptions: { 1: 'transport-limited-to-leaves' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'explain-transpiration-role', multiSelect: false, question: 'What is transpiration?', options: ['Evaporation of water from leaf surfaces, mainly through stomata', 'The transport of sugars through phloem', 'The absorption of minerals by roots', 'The process of photosynthesis'], correctIndices: [0], explanation: 'Transpiration is specifically water evaporation from leaves.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'explain-transpiration-role', multiSelect: false, question: 'True or false: transpiration is purely wasteful water loss with no role in the plant\'s transport system.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — transpiration creates the pulling force that drives water transport up the xylem.', distractorMisconceptions: { 0: 'transpiration-just-water-loss' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'explain-plant-support-mechanisms', multiSelect: true, question: 'Which of these contribute to plant support? (select all that apply)', options: ['Turgor pressure', 'Sclerenchyma tissue', 'Phloem sugar transport', 'Root anchoring'], correctIndices: [0, 1, 3], explanation: 'Turgor pressure, sclerenchyma, and root anchoring all contribute to support; phloem sugar transport does not.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'explain-transpiration-role',
      analogy: 'Think of the xylem water column like a long chain of people holding hands in a line from the roots to the leaf tip. When the person at the top (the leaf) lets go of a "water hand" through evaporation, everyone in the chain shifts up slightly to fill the gap — pulling the whole chain (and eventually a new water molecule from the roots) upward.',
      explanation: 'To explain the transpiration pull: (1) water evaporates from leaf cells into the air through stomata (transpiration), (2) this creates a "gap" or reduced pressure at the top of the xylem column, (3) because water molecules are cohesive (they stick together), losing water at the top pulls the entire column of water upward, (4) this draws new water in at the roots to replace what was lost.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'On a hot, dry day, transpiration increases. Explain what happens to the rate of water uptake by the roots as a result.', steps: [
          { step: 'Increased transpiration means more water is evaporating from the leaves, strengthening the pulling force in the xylem.', justification: 'Transpiration rate directly determines the strength of the pull on the water column.' },
          { step: 'This stronger pull draws water into the roots faster, so root water uptake increases to match the increased transpiration.', justification: 'The transpiration pull mechanism connects leaf water loss directly to root water uptake.' },
        ], answer: 'Root water uptake increases to match the increased transpiration rate' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'explain-transpiration-role', question: 'If a plant\'s stomata are closed (reducing transpiration), what happens to the rate of water movement up the xylem?', options: ['It decreases, since the pulling force is reduced', 'It increases', 'It stays exactly the same', 'Water starts moving downward instead'], correctIndex: 0, hints: { strategic: 'Think about the connection between transpiration and the xylem pull.', procedural: 'Less transpiration means less pulling force.', workedStep: 'It decreases.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'explain-transpiration-role', question: 'Which structure on the leaf surface is mainly responsible for water loss during transpiration?', options: ['Stomata', 'Xylem vessels directly', 'Phloem', 'Root hairs'], correctIndex: 0, hints: { strategic: 'Think about small openings on the leaf surface.', procedural: 'Stomata are the main site of water vapour loss.', workedStep: 'Stomata.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'explain-transpiration-role', question: 'Why does a tall tree need transpiration pull specifically, rather than relying only on root pressure, to move water to its highest leaves?', options: ['Root pressure alone is too weak to push water to great heights', 'Trees do not need water at their highest leaves', 'Transpiration and height are unrelated', 'Root pressure is always stronger than transpiration pull'], correctIndex: 0, hints: { strategic: 'Think about the scale of the challenge for very tall trees.', procedural: 'Transpiration pull is the dominant mechanism for moving water great heights.', workedStep: 'Root pressure alone is too weak.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'In your own words, explain how transpiration helps water reach the top of a tall tree.', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel explaining plant support and transport systems now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the key difference between xylem and phloem transport direction?', type: 'multiple-choice', options: ['Xylem is one-directional (upward); phloem can go either direction', 'Both are strictly one-directional', 'Both can go either direction', 'Xylem transports sugars; phloem transports water'] },
  ],
};
