// ── Physical Sciences, Term 2, Topic 1: Matter Classification and States of Matter ──
// First Chemistry topic. Uses the new ParticleDiagram component (state mode)
// to visualise particle arrangement in solids/liquids/gases.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'mixture-vs-compound-confused',
    label: 'Confusing a mixture with a compound',
    errorType: 'You classified a combination of substances as a compound when it was actually a mixture, or vice versa.',
    principle: 'A COMPOUND is formed when elements chemically combine in a FIXED ratio, creating a genuinely new substance with different properties (e.g. water, H₂O). A MIXTURE is simply two or more substances physically combined, each keeping its own properties, in no fixed ratio (e.g. salt and sand).',
    correctStep: 'Salt water is a mixture (salt can be physically separated back out by evaporation); table salt itself (NaCl) is a compound (Na and Cl are chemically bonded, not separable by physical means alone).',
  },
  {
    id: 'homogeneous-heterogeneous-confused',
    label: 'Confusing homogeneous and heterogeneous mixtures',
    errorType: 'You mislabelled a mixture\'s uniformity.',
    principle: 'A HOMOGENEOUS mixture has a uniform composition throughout — you cannot see the individual parts (e.g. salt water, air). A HETEROGENEOUS mixture has visibly distinct parts or regions (e.g. a salad, sand and gravel).',
    correctStep: 'Fully dissolved sugar in water is homogeneous (uniform, no visible sugar grains); a mix of sand and pebbles is heterogeneous (visibly distinct particles).',
  },
  {
    id: 'particles-change-size-between-states',
    label: 'Believing particles themselves change size or shape between states of matter',
    errorType: 'You suggested that particles become larger, smaller, or change shape when a substance changes state.',
    principle: 'When a substance changes state (solid/liquid/gas), the PARTICLES THEMSELVES do not change size or shape — what changes is the SPACING between particles and how much they MOVE, not the particles\' own physical size.',
    correctStep: 'Ice, water, and steam are all made of the same-sized water molecules — only the spacing and motion between them changes.',
  },
  {
    id: 'melting-changes-mass',
    label: 'Believing a change of state changes the total mass of a substance',
    errorType: 'You suggested that mass is gained or lost simply from melting, freezing, boiling, or condensing.',
    principle: 'A change of state is a PHYSICAL change — the same particles are still present, just arranged differently. The total MASS stays the same before and after (unless matter is actually added or removed from the system).',
    correctStep: 'Ice melting into water doesn\'t lose or gain mass — the same water molecules are present, just in a different arrangement.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 2,
  topicId: 'matter-classification-and-states',
  topicName: 'Matter Classification and States of Matter',
  prerequisites: [
    'Electrostatics (Term 1)',
  ],
  objectives: [
    { id: 'classify-matter', text: 'Classify matter into pure substances (elements, compounds) and mixtures (homogeneous, heterogeneous).' },
    { id: 'distinguish-compound-mixture', text: 'Distinguish a compound from a mixture based on how it forms and can be separated.' },
    { id: 'describe-particle-arrangement', text: 'Describe particle spacing and motion in solids, liquids, and gases.' },
    { id: 'apply-kinetic-molecular-theory', text: 'Apply the kinetic molecular theory to explain changes of state.' },
  ],
  estimatedMinutes: [20, 30],
};

export const matterClassificationAndStates: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What actually changes when ice melts into water?',
  goalSettingPrompt:
    'All matter can be classified by what it\'s made of and how its particles behave. By the end of this lesson you\'ll be able to classify any substance, and explain what really happens — at the particle level — when matter changes state.',

  activate: {
    connectPrompt: 'You already know that matter is made of tiny particles from earlier grades — this lesson builds a more precise model.',
    diagnosticQuestions: [
      { question: 'What are the three common states of matter?', options: ['Solid, liquid, gas', 'Hot, warm, cold', 'Big, medium, small', 'Fast, medium, slow'], correctIndex: 0, explanation: 'These are the three common states.' },
      { question: 'Is salt water a single pure substance or a combination?', options: ['A combination (mixture)', 'A single pure substance', 'Neither', 'A compound'], correctIndex: 0, explanation: 'Salt water is salt and water physically combined — a mixture.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Matter is classified into PURE SUBSTANCES (elements — single types of atom; and compounds — elements chemically combined in a fixed ratio, forming a new substance) and MIXTURES (two or more substances physically combined, each keeping its own properties). Mixtures are further split: HOMOGENEOUS (uniform throughout, no visible separate parts) and HETEROGENEOUS (visibly distinct parts or regions).',
    workedExamples: [
      { id: 'wx-classify-substance', prompt: 'Classify: (a) oxygen gas (O₂), (b) carbon dioxide (CO₂), (c) a salad.', steps: [
        { step: '(a) Oxygen gas is made of only one type of atom (oxygen) — this is an ELEMENT.', justification: 'A single atom type, in pure form, is an element.' },
        { step: '(b) Carbon dioxide has carbon and oxygen chemically combined in a fixed ratio (1:2) — this is a COMPOUND.', justification: 'Chemically combined elements in a fixed ratio form a compound.' },
        { step: '(c) A salad has visibly distinct ingredients (lettuce, tomato, etc.) — this is a HETEROGENEOUS MIXTURE.', justification: 'Visible distinct parts indicate a heterogeneous mixture.' },
      ], answer: '(a) element, (b) compound, (c) heterogeneous mixture' },
      { id: 'wx-compound-vs-mixture', prompt: 'How can you tell that table salt dissolved in water is a mixture, not a compound?', steps: [
        { step: 'The salt can be recovered unchanged by evaporating the water (a purely physical process).', justification: 'Mixtures can be separated by physical means; compounds cannot.' },
        { step: 'Since the salt and water can be physically separated back to their original forms, this confirms it\'s a mixture, not a new compound.', justification: 'This separability is the key test distinguishing mixtures from compounds.' },
      ], answer: 'It can be physically separated (evaporation) back into its original components — a mixture' },
    ],
    knowledgeChecks: [
      { question: 'Is air (a blend of gases, uniformly spread) homogeneous or heterogeneous?', options: ['Homogeneous', 'Heterogeneous', 'Neither', 'It is a compound'], correctIndex: 0, explanation: 'Air has no visible separate parts — uniform throughout.', misconceptionId: 'homogeneous-heterogeneous-confused' },
      { question: 'Is water (H₂O) a mixture or a compound?', options: ['A compound', 'A mixture', 'Neither', 'An element'], correctIndex: 0, explanation: 'Hydrogen and oxygen are chemically bonded in a fixed ratio — a compound.', misconceptionId: 'mixture-vs-compound-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying matter into elements, compounds, and mixtures?',
  },

  demonstrateChunk2: {
    explanation:
      'The KINETIC MOLECULAR THEORY explains states of matter through particle spacing and motion. In a SOLID, particles are tightly packed in a fixed arrangement, vibrating in place. In a LIQUID, particles are close together but can move/slide past each other. In a GAS, particles are widely spaced and move freely and rapidly. Crucially, the PARTICLES THEMSELVES don\'t change size between states — only their spacing and motion change. A change of state is a PHYSICAL change — mass is conserved.',
    workedExamples: [
      { id: 'wx-state-particles', prompt: 'Describe the particle arrangement in a solid compared to a gas.', steps: [
        { step: 'Solid: particles are tightly packed in a fixed, ordered arrangement, only vibrating in place.', justification: 'Solids have the least particle freedom of movement.' },
        { step: 'Gas: particles are widely spaced, moving freely and rapidly in all directions, with no fixed arrangement.', justification: 'Gases have the most particle freedom.' },
      ], answer: 'Solid: tightly packed, fixed, vibrating. Gas: widely spaced, moving freely', particle: { mode: 'state', state: 'solid' } },
      { id: 'wx-mass-conservation', prompt: 'A 100g ice cube melts completely into water. What is the mass of the water?', steps: [
        { step: 'Melting is a physical change — the same water molecules are present, just rearranged with more spacing/motion.', justification: 'No matter is added or removed during melting.' },
        { step: 'Mass is conserved: the water still has a mass of 100g.', justification: 'Physical changes of state never change total mass.' },
      ], answer: '100g — mass is conserved' },
    ],
    knowledgeChecks: [
      { question: 'When water freezes into ice, do the water molecules themselves get smaller?', options: ['No — only the spacing and motion between them changes', 'Yes, they shrink', 'Yes, they grow', 'The molecules disappear'], correctIndex: 0, explanation: 'Particles keep their own size; only spacing/motion changes between states.', misconceptionId: 'particles-change-size-between-states' },
      { question: 'A 50g sample of liquid water evaporates completely into water vapour. What is the mass of the vapour (assuming none escapes the system)?', options: ['50g', '0g (mass disappears)', '100g (mass doubles)', 'Cannot be determined'], correctIndex: 0, explanation: 'Mass is conserved during a physical change of state.', misconceptionId: 'melting-changes-mass' },
    ],
    confidenceCheckPrompt: 'How confident do you feel describing particle behaviour in each state and applying mass conservation?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'classify-matter', revealSteps: 1, prompt: 'Classify pure gold (Au).', steps: [
        { step: 'Gold consists of only one type of atom — this is an element.', justification: 'A single atom type in pure form is an element.' },
      ], answer: 'Element' },
      { id: 'fp-partial-1', objectiveId: 'distinguish-compound-mixture', revealSteps: 1, prompt: 'Is muddy water (soil particles suspended in water) a compound or a mixture?', steps: [
        { step: 'The soil and water can be physically separated (e.g. filtration).', justification: 'Physical separability indicates a mixture.' },
        { step: 'This confirms it is a mixture, specifically heterogeneous (you can see the soil particles).', justification: 'Visible distinct parts confirm heterogeneous.' },
      ], answer: 'A heterogeneous mixture' },
      { id: 'fp-independent-1', objectiveId: 'describe-particle-arrangement', revealSteps: 0, prompt: 'Describe how particle motion differs between a liquid and a gas.', steps: [
        { step: 'In a liquid, particles move/slide past each other but stay relatively close together. In a gas, particles move freely and rapidly with large spaces between them.', justification: 'Compare both spacing and motion characteristics.' },
      ], answer: 'Liquid particles slide past each other while staying close; gas particles move freely with large spacing' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'classify-matter', question: 'Classify sugar dissolved completely and uniformly in water.', options: ['Homogeneous mixture', 'Heterogeneous mixture', 'Compound', 'Element'], correctIndex: 0, hints: { strategic: 'Is it uniform, with no visible separate sugar?', procedural: 'Yes — fully dissolved, uniform throughout.', workedStep: 'Homogeneous mixture.' }, distractorMisconceptions: { 1: 'homogeneous-heterogeneous-confused' } },
      { id: 'ip-2', objectiveId: 'distinguish-compound-mixture', question: 'Which is a compound, not a mixture?', options: ['Carbon dioxide (CO₂)', 'Salt water', 'A bowl of cereal with milk', 'Air'], correctIndex: 0, hints: { strategic: 'Which one has elements chemically combined in a fixed ratio?', procedural: 'CO₂ has carbon and oxygen chemically bonded.', workedStep: 'Carbon dioxide.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'describe-particle-arrangement', question: 'Which state has particles in a fixed, ordered arrangement, only vibrating in place?', options: ['Solid', 'Liquid', 'Gas', 'None of these'], correctIndex: 0, hints: { strategic: 'Which state has the least particle freedom?', procedural: 'Solid particles vibrate but stay fixed in position.', workedStep: 'Solid.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'apply-kinetic-molecular-theory', question: 'A 20g sample of solid wax melts into liquid wax. What is the mass of the liquid wax?', options: ['20g', '10g', '40g', '0g'], correctIndex: 0, hints: { strategic: 'Is mass created or destroyed during melting?', procedural: 'No — mass is conserved during a physical change.', workedStep: '20g.' }, distractorMisconceptions: { 1: 'melting-changes-mass' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'classify-matter', multiSelect: false, question: 'Classify pure iron (Fe).', options: ['Element', 'Compound', 'Homogeneous mixture', 'Heterogeneous mixture'], correctIndices: [0], explanation: 'Iron is a single type of atom — an element.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'classify-matter', multiSelect: false, question: 'Classify a mixture of oil and water (visibly separate layers).', options: ['Heterogeneous mixture', 'Homogeneous mixture', 'Compound', 'Element'], correctIndices: [0], explanation: 'Visibly distinct layers make this heterogeneous.', distractorMisconceptions: { 1: 'homogeneous-heterogeneous-confused' } },
    { id: 'q3', type: 'true-false', objectiveId: 'distinguish-compound-mixture', multiSelect: false, question: 'True or false: a compound can be separated back into its original elements using only physical methods (like filtering or evaporating).', options: ['True', 'False'], correctIndices: [1], explanation: 'False — compounds require chemical processes to separate, unlike mixtures.', distractorMisconceptions: { 0: 'mixture-vs-compound-confused' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'distinguish-compound-mixture', multiSelect: false, question: 'Which is a mixture, not a compound?', options: ['Sand and salt combined', 'Water (H₂O)', 'Carbon dioxide (CO₂)', 'Table salt (NaCl)'], correctIndices: [0], explanation: 'Sand and salt keep their own properties and can be physically separated — a mixture.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'describe-particle-arrangement', multiSelect: false, question: 'True or false: particles in a gas are more widely spaced than particles in a liquid.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — gas particles have the greatest spacing of the three states.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'apply-kinetic-molecular-theory', multiSelect: false, question: 'True or false: when a substance changes state, the individual particles change size.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — only spacing and motion change, not particle size.', distractorMisconceptions: { 0: 'particles-change-size-between-states' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'apply-kinetic-molecular-theory', multiSelect: false, question: 'A 30g block of ice melts completely. What is the mass of the resulting water?', options: ['30g', '15g', '60g', '0g'], correctIndices: [0], explanation: 'Mass is conserved during a physical change of state.', distractorMisconceptions: { 1: 'melting-changes-mass' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'classify-matter', multiSelect: true, question: 'Which of these are elements? (select all that apply)', options: ['Oxygen gas (O₂)', 'Pure gold (Au)', 'Water (H₂O)', 'Carbon dioxide (CO₂)'], correctIndices: [0, 1], explanation: 'Oxygen gas and pure gold are each made of only one type of atom — elements. Water and carbon dioxide are compounds.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'distinguish-compound-mixture',
      analogy: 'Think of a compound like a baked cake — once the ingredients are combined and baked, you can\'t simply pick the eggs and flour back out; it\'s a genuinely new thing. A mixture is like a fruit salad — the pieces are combined, but you could still pick out the apple pieces and banana pieces separately.',
      explanation: 'Ask this test question: "Can I get the original substances back using only physical methods (filtering, evaporating, sorting by hand)?" If yes, it\'s a mixture. If it requires a chemical reaction to break apart, it\'s a compound.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Apply the test: is a mixture of iron filings and sulfur powder (not yet reacted) a mixture or compound?', steps: [
          { step: 'Can the iron and sulfur be separated physically? Yes — a magnet can pull out the iron filings.', justification: 'Apply the separability test.' },
          { step: 'This confirms it is a mixture, not a compound (unlike iron sulfide, which WOULD form if they were chemically reacted).', justification: 'Physical separability confirms mixture status.' },
        ], answer: 'A mixture' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'distinguish-compound-mixture', question: 'Apply the test: is granite (a rock with visible mineral grains) a mixture or a compound?', options: ['Mixture — the different minerals can be physically distinguished/separated', 'Compound — chemically bonded in a fixed ratio', 'Neither applies', 'An element'], correctIndex: 0, hints: { strategic: 'Can you see and separate the different mineral grains?', procedural: 'Yes, visibly distinct.', workedStep: 'Mixture.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'distinguish-compound-mixture', question: 'Apply the test: is ammonia gas (NH₃) a mixture or a compound?', options: ['Compound — nitrogen and hydrogen chemically bonded', 'Mixture — physically combined', 'Neither applies', 'An element'], correctIndex: 0, hints: { strategic: 'Are nitrogen and hydrogen chemically bonded in a fixed ratio here?', procedural: 'Yes.', workedStep: 'Compound.' }, distractorMisconceptions: { 1: 'mixture-vs-compound-confused' } },
        { id: 'rem-p3', objectiveId: 'distinguish-compound-mixture', question: 'Apply the test: is a bronze alloy (copper and tin melted together) a mixture or a compound?', options: ['Mixture — no fixed chemical ratio, properties of both metals blend', 'Compound — always a fixed ratio', 'Neither applies', 'An element'], correctIndex: 0, hints: { strategic: 'Alloys are physically blended metals, not chemically bonded in a fixed ratio.', procedural: 'This makes it a mixture.', workedStep: 'Mixture.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the key test for telling a mixture apart from a compound?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel classifying matter and explaining states of matter now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What actually changes when a substance changes state?', type: 'multiple-choice', options: ['The spacing and motion of particles, not their size', 'The size of the particles', 'The total mass', 'The type of atoms present'] },
  ],
};
