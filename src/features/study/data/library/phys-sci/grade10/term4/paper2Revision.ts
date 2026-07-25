// ── Physical Sciences, Term 4: Paper 2 Revision (Chemistry) ──────────────────
// CAPS Term 4 introduces no new Grade 10 content — it consolidates Paper 2
// (Chemistry) across the year: Matter Classification, Atomic Structure &
// Periodic Table, Chemical Bonding, Physical/Chemical Change (Term 2), and
// Quantitative Aspects of Chemical Change (Term 3). This module re-tests the
// single most exam-reported misconception per topic rather than re-teaching
// from scratch.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'matter-continuous-not-particulate',
    label: 'Picturing matter as continuous rather than made of discrete particles',
    errorType: 'You described or drew a substance as if it were a smooth, continuous material, rather than made of separate particles with space between them.',
    principle: 'ALL matter is made of discrete PARTICLES (atoms, ions, or molecules) with space between them — there is no such thing as "continuous" matter, even in solids or liquids that look smooth to the naked eye.',
    correctStep: 'Even a solid metal bar is made of individual atoms in a fixed arrangement with spacing between them, not one continuous block of "stuff".',
  },
  {
    id: 'periodic-trend-group-period-confused',
    label: 'Confusing what changes across a period versus down a group',
    errorType: 'You mixed up whether a periodic trend (e.g. atomic radius, valence electrons) changes across a period or down a group.',
    principle: 'GROUP NUMBER (column) indicates the number of valence electrons for main-group elements — this stays the SAME down a group. Atomic radius INCREASES down a group (more electron shells) but DECREASES across a period (increasing nuclear charge pulls electrons in).',
    correctStep: 'Sodium and potassium (same group) have the same number of valence electrons (1), but potassium has a larger atomic radius since it has more electron shells.',
  },
  {
    id: 'bonding-electron-sharing-vs-transfer-revision',
    label: 'Confusing electron sharing with electron transfer',
    errorType: 'You described covalent bonding as electron transfer, or ionic bonding as electron sharing.',
    principle: 'IONIC bonding involves electrons being completely TRANSFERRED from one atom to another (forming charged ions that attract each other). COVALENT bonding involves electrons being SHARED between atoms — the two are opposite mechanisms and must not be swapped.',
    correctStep: 'In NaCl, sodium transfers an electron to chlorine (ionic); in Cl₂, both chlorine atoms share a pair of electrons (covalent) — these are different processes.',
  },
  {
    id: 'physical-vs-chemical-change-confused',
    label: 'Misclassifying a change as physical when it is chemical, or vice versa',
    errorType: 'You classified a change based on appearance alone (e.g. "it changed colour, so it must be chemical") rather than checking whether a new substance formed.',
    principle: 'A PHYSICAL change alters appearance or state but NO NEW SUBSTANCE forms (e.g. melting, dissolving). A CHEMICAL change produces a NEW SUBSTANCE with different properties (e.g. burning, rusting) — the defining test is always whether a new substance has formed, not appearance alone.',
    correctStep: 'Melting ice is a physical change — it\'s still H₂O, just in liquid form; burning wood is a chemical change — new substances (ash, gases) form that are chemically different from wood.',
  },
  {
    id: 'moles-mass-confused-revision',
    label: 'Treating grams and moles as interchangeable',
    errorType: 'You used a mass value directly as if it were an amount in moles, without converting through molar mass.',
    principle: 'Moles and mass are linked by molar mass: n = m ÷ M. A mass in grams is never directly a mole value — you must always divide by the molar mass (g·mol⁻¹) to convert.',
    correctStep: '10 g of NaOH (M = 40 g·mol⁻¹) is n = 10 ÷ 40 = 0,25 mol — not "10 mol".',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 4,
  topicId: 'paper-2-revision',
  topicName: 'Paper 2 Revision: Matter, Atoms, Bonding & Chemical Change',
  prerequisites: [
    'Matter Classification and States of Matter (Term 2)',
    'Atomic Structure and the Periodic Table (Term 2)',
    'Chemical Bonding (Term 2)',
    'Physical & Chemical Change, and Representing Chemical Change (Term 2)',
    'Quantitative Aspects of Chemical Change (Term 3)',
  ],
  objectives: [
    { id: 'revise-matter-classification', text: 'Describe matter as particulate and classify substances correctly.' },
    { id: 'revise-periodic-trends', text: 'Relate group and period position to valence electrons and atomic radius.' },
    { id: 'revise-bonding', text: 'Distinguish ionic bonding (transfer) from covalent bonding (sharing).' },
    { id: 'revise-physical-chemical-change', text: 'Classify a change as physical or chemical based on whether a new substance forms.' },
    { id: 'revise-quantitative-chemistry', text: 'Convert between mass, moles, and use mole ratios in stoichiometric calculations.' },
  ],
  estimatedMinutes: [30, 45],
};

export const paper2Revision: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'From particles too small to see, to reactions you can weigh on a scale — can you still connect every step of the chemistry chain?',
  goalSettingPrompt:
    'This revision pulls together every Paper 2 topic from the year and targets the single error each topic trips learners up on most in exams. By the end, you\'ll have tested and sharpened your recall across all of Term 2 and Term 3 Chemistry.',

  activate: {
    connectPrompt: 'Every chemistry topic this year builds on "matter is made of particles" — this revision checks that foundation still holds under exam-style questions.',
    diagnosticQuestions: [
      { question: 'Is matter made of continuous "stuff" or discrete particles?', options: ['Discrete particles, with space between them', 'Continuous stuff with no gaps', 'It depends on the state of matter', 'Neither — matter has no structure'], correctIndex: 0, explanation: 'All matter, in every state, is made of discrete particles.' },
      { question: 'What is the defining test for whether a change is chemical?', options: ['Whether a new substance forms', 'Whether the colour changes', 'Whether heat is involved', 'Whether it happens quickly'], correctIndex: 0, explanation: 'A chemical change is defined by the formation of a new substance.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'MATTER is made of discrete PARTICLES (atoms, ions, molecules) with space between them, in all three states. On the PERIODIC TABLE, GROUP NUMBER gives the number of valence electrons for main-group elements (constant down a group); ATOMIC RADIUS increases down a group (more shells) but decreases across a period (increasing nuclear charge). BONDING: IONIC bonds form by electron TRANSFER (metal + non-metal); COVALENT bonds form by electron SHARING (non-metal + non-metal).',
    workedExamples: [
      { id: 'wx-matter-revision', prompt: 'Explain, in terms of particles, why a gas can be compressed much more easily than a solid.', steps: [
        { step: 'In a gas, particles are far apart with large spaces between them and move freely.', justification: 'Gas particles have much greater spacing than solid particles.' },
        { step: 'In a solid, particles are packed closely together with very little space to compress further.', justification: 'Solid particles are already tightly packed, limiting compression.' },
      ], answer: 'Gas particles have large spaces between them that can be reduced; solid particles are already tightly packed' },
      { id: 'wx-periodic-revision', prompt: 'Compare the atomic radius of sodium (Na) and chlorine (Cl), both in Period 3.', steps: [
        { step: 'Both are in the same period, so compare across the period: nuclear charge increases from Na to Cl (more protons).', justification: 'Atomic radius trends are compared using the same period or group.' },
        { step: 'The increasing nuclear charge across the period pulls electrons in more strongly, so atomic radius DECREASES from Na to Cl.', justification: 'Greater nuclear charge across a period reduces atomic radius.' },
      ], answer: 'Sodium has a larger atomic radius than chlorine' },
      { id: 'wx-bonding-revision', prompt: 'Predict and explain the bond type between calcium and oxygen.', steps: [
        { step: 'Calcium is a metal, oxygen is a non-metal — metal + non-metal predicts an ionic bond.', justification: 'Metal + non-metal combinations typically bond ionically.' },
        { step: 'Calcium transfers electrons to oxygen, forming Ca²⁺ and O²⁻ ions that attract each other.', justification: 'Ionic bonding is complete electron transfer, forming oppositely charged ions.' },
      ], answer: 'Ionic bond; calcium transfers electrons to oxygen' },
    ],
    knowledgeChecks: [
      { question: 'Is a diamond made of continuous matter or discrete particles?', options: ['Discrete carbon atoms, tightly bonded', 'Continuous, unbroken matter', 'It depends on temperature', 'Neither'], correctIndex: 0, explanation: 'Even the hardest solids are made of discrete particles in a fixed arrangement.', misconceptionId: 'matter-continuous-not-particulate' },
      { question: 'Lithium and sodium are in the same group. What do they have in common?', options: ['The same number of valence electrons', 'The same atomic radius', 'The same number of electron shells', 'Nothing in common'], correctIndex: 0, explanation: 'Same group means same valence electron count; atomic radius still differs.', misconceptionId: 'periodic-trend-group-period-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel with the particle model, periodic trends, and predicting bond types?',
  },

  demonstrateChunk2: {
    explanation:
      'The defining test for PHYSICAL vs CHEMICAL change is whether a NEW SUBSTANCE forms — appearance alone (colour, state) is not enough to decide. For QUANTITATIVE CHEMISTRY: mass and moles are linked by molar mass (n = m ÷ M); gas volume at STP links to moles via molar volume (n = V ÷ 22,4 dm³·mol⁻¹); concentration links moles and solution volume (c = n ÷ V, with V in dm³); and coefficients in a balanced equation give mole ratios between reactants and products.',
    workedExamples: [
      { id: 'wx-change-classification-revision', prompt: 'Classify: (a) sugar dissolving in water, (b) sugar burning over a flame.', steps: [
        { step: '(a) Dissolved sugar is still sugar (same substance, just dispersed in water) — this is a physical change.', justification: 'No new substance forms; sugar can be recovered by evaporating the water.' },
        { step: '(b) Burning sugar produces carbon, water vapour, and carbon dioxide — completely different substances from sugar — this is a chemical change.', justification: 'New substances with different properties form, confirming a chemical change.' },
      ], answer: '(a) Physical change, (b) Chemical change' },
      { id: 'wx-quantitative-revision', prompt: 'In 2Mg + O₂ → 2MgO, how many moles of MgO form from 3 mol of Mg?', steps: [
        { step: 'Read the mole ratio of Mg to MgO from the coefficients: 2 : 2, which simplifies to 1 : 1.', justification: 'Coefficients in a balanced equation give the mole ratio.' },
        { step: 'Moles of MgO = 3 × (2 ÷ 2) = 3 mol.', justification: 'Scale the known moles by the mole ratio.' },
      ], answer: '3 mol MgO' },
    ],
    knowledgeChecks: [
      { question: 'Ice melting into water changes its appearance from solid to liquid. Is this a chemical change?', options: ['No — it is still H₂O, a physical change', 'Yes — the appearance changed', 'Yes — energy was involved', 'Cannot be determined'], correctIndex: 0, explanation: 'No new substance forms, so this is a physical change despite the visible change.', misconceptionId: 'physical-vs-chemical-change-confused' },
      { question: 'How many moles are in 4 g of NaOH (M = 40 g·mol⁻¹)?', options: ['0,1 mol', '4 mol', '40 mol', '10 mol'], correctIndex: 0, explanation: 'n = m ÷ M = 4 ÷ 40 = 0,1 mol.', misconceptionId: 'moles-mass-confused-revision' },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying changes and doing mole/mass/concentration/stoichiometry calculations?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'revise-periodic-trends', revealSteps: 1, prompt: 'Which has more valence electrons: oxygen (Group 16/6) or sulfur (Group 16/6)? Explain.', steps: [
        { step: 'Neither — they are in the same group, so both have 6 valence electrons.', justification: 'Group number gives valence electron count, and it is the same for elements in the same group.' },
      ], answer: 'Equal — both have 6 valence electrons' },
      { id: 'fp-partial-1', objectiveId: 'revise-bonding', revealSteps: 1, prompt: 'Predict the bond type between two fluorine atoms forming F₂.', steps: [
        { step: 'Both fluorine atoms are non-metals — non-metal + non-metal predicts a covalent bond.', justification: 'Two non-metals share electrons rather than transferring them.' },
        { step: 'They share one electron pair to each achieve a full outer shell.', justification: 'Covalent bonding involves sharing electron pairs.' },
      ], answer: 'Covalent bond' },
      { id: 'fp-independent-1', objectiveId: 'revise-quantitative-chemistry', revealSteps: 0, prompt: 'How many moles are in 5,6 dm³ of a gas at STP?', steps: [
        { step: 'n = V ÷ Vm = 5,6 ÷ 22,4 = 0,25 mol.', justification: 'At STP, use the standard molar volume of 22,4 dm³·mol⁻¹.' },
      ], answer: '0,25 mol' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'revise-matter-classification', question: 'Which statement about a liquid is correct?', options: ['It is made of discrete particles with some freedom to move', 'It is a single, continuous substance with no particles', 'It has no structure at all', 'Its particles are fixed in place like a solid'], correctIndex: 0, hints: { strategic: 'All matter is particulate.', procedural: 'Liquid particles are close together but can move past each other.', workedStep: 'Discrete particles, some freedom to move.' }, distractorMisconceptions: { 1: 'matter-continuous-not-particulate' } },
      { id: 'ip-2', objectiveId: 'revise-periodic-trends', question: 'Which has a larger atomic radius: potassium (Period 4) or sodium (Period 3), both Group 1?', options: ['Potassium, since it has more electron shells', 'Sodium, since it is lighter', 'They are equal', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'Atomic radius increases down a group.', procedural: 'Potassium is further down Group 1, so it has more shells.', workedStep: 'Potassium is larger.' }, distractorMisconceptions: { 1: 'periodic-trend-group-period-confused' } },
      { id: 'ip-3', objectiveId: 'revise-bonding', question: 'In covalent bonding, what happens to the electrons involved?', options: ['They are shared between atoms', 'They are transferred completely', 'They disappear', 'They are shared by three or more atoms only'], correctIndex: 0, hints: { strategic: 'Covalent bonding is the sharing mechanism.', procedural: 'Contrast with ionic bonding, which transfers electrons.', workedStep: 'Shared between atoms.' }, distractorMisconceptions: { 1: 'bonding-electron-sharing-vs-transfer-revision' } },
      { id: 'ip-4', objectiveId: 'revise-physical-chemical-change', question: 'Iron rusting (forming iron oxide) is an example of what kind of change?', options: ['Chemical change — a new substance (iron oxide) forms', 'Physical change — only appearance changed', 'Neither — nothing happened', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'Check whether a new substance forms.', procedural: 'Iron oxide has different properties from iron.', workedStep: 'Chemical change.' }, distractorMisconceptions: { 1: 'physical-vs-chemical-change-confused' } },
      { id: 'ip-5', objectiveId: 'revise-quantitative-chemistry', question: 'What is the concentration of 0,3 mol of solute dissolved in 600 cm³ of solution?', options: ['0,5 mol·dm⁻³', '180 mol·dm⁻³', '0,0005 mol·dm⁻³', '0,3 mol·dm⁻³'], correctIndex: 0, hints: { strategic: 'Convert cm³ to dm³ first.', procedural: '600 cm³ = 0,6 dm³; c = 0,3 ÷ 0,6.', workedStep: '0,5 mol·dm⁻³.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'revise-matter-classification', multiSelect: false, question: 'True or false: solids are made of continuous matter with no gaps between particles.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — solids are made of discrete particles, just tightly packed.', distractorMisconceptions: { 0: 'matter-continuous-not-particulate' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'revise-periodic-trends', multiSelect: false, question: 'Phosphorus is in Group 15 (or "Group 5"). How many valence electrons does it have?', options: ['5', '15', '3', '8'], correctIndices: [0], explanation: 'Group number (simplified convention) gives valence electron count.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'revise-periodic-trends', multiSelect: false, question: 'True or false: atomic radius decreases across a period from left to right.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — increasing nuclear charge across a period pulls electrons closer.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'revise-bonding', multiSelect: false, question: 'Predict the bond type between potassium (metal) and bromine (non-metal).', options: ['Ionic', 'Covalent', 'Neither', 'Cannot be predicted'], correctIndices: [0], explanation: 'Metal + non-metal predicts an ionic bond.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'revise-physical-chemical-change', multiSelect: false, question: 'Which of these is a chemical change?', options: ['Wood burning to ash', 'Water freezing into ice', 'Salt dissolving in water', 'Paper being torn'], correctIndices: [0], explanation: 'Burning produces new substances (ash, gases); the others are physical changes.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'revise-quantitative-chemistry', multiSelect: false, question: 'How many moles are in 88 g of CO₂ (M = 44 g·mol⁻¹)?', options: ['2 mol', '88 mol', '0,5 mol', '44 mol'], correctIndices: [0], explanation: 'n = m ÷ M = 88 ÷ 44 = 2 mol.', distractorMisconceptions: { 1: 'moles-mass-confused-revision' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'revise-quantitative-chemistry', multiSelect: false, question: 'In N₂ + 3H₂ → 2NH₃, how many moles of H₂ are needed to produce 8 mol of NH₃?', options: ['12 mol', '8 mol', '4 mol', '24 mol'], correctIndices: [0], explanation: 'Ratio H₂ : NH₃ = 3 : 2, so moles H₂ = 8 × (3 ÷ 2) = 12 mol.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'revise-bonding', multiSelect: true, question: 'Which of these combinations would form COVALENT bonds? (select all that apply)', options: ['Two oxygen atoms', 'Sodium and chlorine', 'Two hydrogen atoms', 'Calcium and oxygen'], correctIndices: [0, 2], explanation: 'Non-metal + non-metal pairs (two oxygens, two hydrogens) form covalent bonds; the other two are metal + non-metal, forming ionic bonds.', distractorMisconceptions: { 1: 'bonding-electron-sharing-vs-transfer-revision' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'revise-quantitative-chemistry',
      analogy: 'Think of mass, moles, gas volume, and concentration as four train stations connected by fixed tracks: molar mass (M) connects mass ↔ moles, molar volume connects gas volume ↔ moles (at STP), and solution volume connects concentration ↔ moles. You always travel THROUGH the "moles" station to get from one to another.',
      explanation: 'To convert between mass, gas volume, or concentration: (1) identify which quantity you have and which you want, (2) convert your known quantity into moles first (using M, or 22,4 dm³·mol⁻¹ at STP, or c = n ÷ V), (3) then convert from moles into the quantity you want, using a mole ratio from a balanced equation if switching between substances.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'How many grams of CaCO₃ (M = 100 g·mol⁻¹) contain 0,4 mol?', steps: [
          { step: 'Use m = n × M.', justification: 'This is the rearranged form of n = m ÷ M, solving for mass.' },
          { step: 'm = 0,4 × 100 = 40 g.', justification: 'Substitute the known moles and molar mass.' },
        ], answer: '40 g' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'revise-quantitative-chemistry', question: 'How many moles are in 6,6 g of CO₂ (M = 44 g·mol⁻¹)?', options: ['0,15 mol', '6,6 mol', '44 mol', '1,5 mol'], correctIndex: 0, hints: { strategic: 'Use n = m ÷ M.', procedural: 'n = 6,6 ÷ 44.', workedStep: '0,15 mol.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'revise-quantitative-chemistry', question: 'What volume, at STP, does 0,5 mol of a gas occupy?', options: ['11,2 dm³', '22,4 dm³', '0,5 dm³', '44,8 dm³'], correctIndex: 0, hints: { strategic: 'Use V = n × Vm at STP.', procedural: 'V = 0,5 × 22,4.', workedStep: '11,2 dm³.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'revise-quantitative-chemistry', question: 'What is the concentration of 0,2 mol of solute in 400 cm³ of solution?', options: ['0,5 mol·dm⁻³', '80 mol·dm⁻³', '0,0005 mol·dm⁻³', '0,2 mol·dm⁻³'], correctIndex: 0, hints: { strategic: 'Convert cm³ to dm³ first.', procedural: '400 cm³ = 0,4 dm³; c = 0,2 ÷ 0,4.', workedStep: '0,5 mol·dm⁻³.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which Paper 2 topic from this year do you still feel least confident about, and why?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel across all of Term 2 and Term 3 Chemistry now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the single test you should always use to decide if a change is chemical?', type: 'multiple-choice', options: ['Whether a new substance has formed', 'Whether the colour changed', 'Whether it happened quickly', 'Whether heat was released'] },
  ],
};
