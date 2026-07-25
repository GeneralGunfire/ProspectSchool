// ── Physical Sciences, Term 2, Topic 3: Chemical Bonding ──────────────────────
// Builds on atomic structure. Introductory Grade 10 scope: ionic vs covalent
// bonding, simple Lewis structures.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'bonding-type-metal-nonmetal-missed',
    label: 'Not using metal/non-metal combination to predict bond type',
    errorType: 'You didn\'t use the reacting elements\' metal/non-metal nature to predict whether bonding would be ionic or covalent.',
    principle: 'As a reliable Grade 10 guide: METAL + NON-METAL typically forms an IONIC bond (electron transfer). NON-METAL + NON-METAL typically forms a COVALENT bond (electron sharing).',
    correctStep: 'Sodium (metal) + chlorine (non-metal) → ionic bond (NaCl). Two chlorine atoms (both non-metals) → covalent bond (Cl₂).',
  },
  {
    id: 'ionic-bond-electron-sharing-confused',
    label: 'Believing ionic bonding involves sharing electrons rather than transferring them',
    errorType: 'You described ionic bonding as if electrons were shared between atoms, like in covalent bonding.',
    principle: 'In IONIC bonding, electrons are TRANSFERRED completely from one atom to another (creating charged ions that then attract each other) — NOT shared. In COVALENT bonding, electrons ARE shared between atoms.',
    correctStep: 'In NaCl, sodium completely LOSES an electron to become Na⁺, and chlorine completely GAINS that electron to become Cl⁻ — no sharing occurs, unlike in a covalent bond.',
  },
  {
    id: 'valence-electrons-miscounted',
    label: 'Miscounting an element\'s valence (outer-shell) electrons from its group number',
    errorType: 'You used the wrong number of valence electrons when drawing or reasoning about a Lewis structure.',
    principle: 'For main-group elements, the GROUP NUMBER often directly indicates the number of valence (outermost shell) electrons — Group 1 has 1, Group 2 has 2, and so on up to Group 18 (or using the 1-8 pattern for Groups 13-18 in the older/common Grade 10 convention).',
    correctStep: 'Oxygen is in Group 16 (or "Group 6" in the simplified older convention), so it has 6 valence electrons.',
  },
  {
    id: 'ionic-compound-charge-not-balanced',
    label: 'Writing an ionic compound formula without balancing the overall charge to zero',
    errorType: 'You wrote a formula for an ionic compound without checking that the total positive and negative charges balance out.',
    principle: 'An ionic compound\'s overall charge must be ZERO — the total positive charge from cations must exactly balance the total negative charge from anions, which may require more than one of an ion.',
    correctStep: 'Calcium (Ca²⁺) and chloride (Cl⁻) combine as CaCl₂ (one Ca²⁺ needs TWO Cl⁻ to balance the charge to zero), not CaCl.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 2,
  topicId: 'chemical-bonding',
  topicName: 'Chemical Bonding',
  prerequisites: [
    'Atomic structure and the periodic table (this term, Topic 2)',
  ],
  objectives: [
    { id: 'predict-bond-type', text: 'Predict whether a bond will be ionic or covalent based on the elements involved.' },
    { id: 'explain-ionic-bonding', text: 'Explain ionic bonding as electron transfer, forming charged ions.' },
    { id: 'explain-covalent-bonding', text: 'Explain covalent bonding as electron sharing.' },
    { id: 'balance-ionic-compound-charge', text: 'Write a correctly charge-balanced formula for a simple ionic compound.' },
  ],
  estimatedMinutes: [20, 30],
};

export const chemicalBonding: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Why do atoms bond with each other at all?',
  goalSettingPrompt:
    'Atoms bond to become more stable, and HOW they bond — sharing or transferring electrons — determines whether you get salt or sugar, metal or gas. By the end of this lesson you\'ll be able to predict and explain both major bond types.',

  activate: {
    connectPrompt: 'You already know about protons, electrons, and the periodic table — bonding is about how atoms interact via their outer electrons.',
    diagnosticQuestions: [
      { question: 'What is a metal generally more likely to do with an electron: gain or lose it?', options: ['Lose it', 'Gain it', 'Neither', 'Both equally'], correctIndex: 0, explanation: 'Metals tend to lose electrons easily.' },
      { question: 'Which group of the periodic table contains highly reactive metals?', options: ['Group 1', 'Group 18', 'Group 8', 'None of them'], correctIndex: 0, explanation: 'Group 1 metals are highly reactive.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'As a reliable Grade 10 guide: METAL + NON-METAL typically forms an IONIC bond, where electrons are TRANSFERRED completely from one atom to another — the metal loses electron(s) to become a positive ion (cation), the non-metal gains them to become a negative ion (anion), and the resulting opposite charges attract each other. NON-METAL + NON-METAL typically forms a COVALENT bond, where electrons are SHARED between atoms.',
    workedExamples: [
      { id: 'wx-predict-bond-type', prompt: 'Predict the bond type for: (a) magnesium and oxygen, (b) two hydrogen atoms.', steps: [
        { step: '(a) Magnesium is a metal, oxygen is a non-metal — metal + non-metal.', justification: 'Identify each element\'s metal/non-metal status.' },
        { step: 'This predicts an IONIC bond.', justification: 'Metal + non-metal typically forms ionic bonds.' },
        { step: '(b) Both hydrogen atoms are non-metals — non-metal + non-metal predicts a COVALENT bond.', justification: 'Two non-metals share electrons rather than transferring them.' },
      ], answer: '(a) Ionic, (b) Covalent' },
      { id: 'wx-ionic-electron-transfer', prompt: 'Explain what happens to electrons when sodium bonds with chlorine.', steps: [
        { step: 'Sodium (metal, 1 valence electron) transfers that electron completely to chlorine.', justification: 'Ionic bonding involves complete transfer, not sharing.' },
        { step: 'Sodium becomes Na⁺ (lost an electron, now positive); chlorine becomes Cl⁻ (gained an electron, now negative). The opposite charges then attract.', justification: 'This transfer creates oppositely charged ions that attract each other.' },
      ], answer: 'Na loses an electron to become Na⁺; Cl gains it to become Cl⁻; they attract' },
    ],
    knowledgeChecks: [
      { question: 'Predict the bond type between potassium (metal) and fluorine (non-metal).', options: ['Ionic', 'Covalent', 'Neither', 'Cannot be predicted'], correctIndex: 0, explanation: 'Metal + non-metal predicts an ionic bond.', misconceptionId: 'bonding-type-metal-nonmetal-missed' },
      { question: 'In ionic bonding, are electrons shared or transferred?', options: ['Transferred completely', 'Shared equally', 'Shared unequally', 'Neither occurs'], correctIndex: 0, explanation: 'Ionic bonding involves complete electron transfer, unlike covalent sharing.', misconceptionId: 'ionic-bond-electron-sharing-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel predicting bond types and explaining ionic bonding?',
  },

  demonstrateChunk2: {
    explanation:
      'COVALENT bonding involves atoms SHARING electron pairs, often shown using LEWIS STRUCTURES (dots representing valence electrons). For main-group elements, GROUP NUMBER indicates the number of valence (outer-shell) electrons. For IONIC COMPOUNDS, the overall formula must balance to a NET CHARGE OF ZERO — this may require more than one of a particular ion.',
    workedExamples: [
      { id: 'wx-lewis-structure', prompt: 'How many valence electrons does chlorine have, and how does this relate to forming Cl₂?', steps: [
        { step: 'Chlorine is in Group 17 (or "Group 7" in the simplified convention), so it has 7 valence electrons.', justification: 'Group number indicates valence electron count for main-group elements.' },
        { step: 'Each chlorine atom needs 1 more electron for a full outer shell (8 total) — two chlorine atoms share ONE electron pair (each contributing one electron) to both achieve a full shell.', justification: 'Covalent bonding shares electrons to help both atoms reach a stable full outer shell.' },
      ], answer: 'Chlorine has 7 valence electrons; two atoms share one electron pair to form Cl₂' },
      { id: 'wx-balance-ionic-formula', prompt: 'Write the correct formula for the ionic compound formed between calcium (Ca²⁺) and chloride (Cl⁻).', steps: [
        { step: 'Calcium\'s charge is +2; chloride\'s charge is -1.', justification: 'Identify each ion\'s charge.' },
        { step: 'To balance +2 with -1 ions, you need TWO chloride ions: +2 and 2×(-1) = -2, which sums to zero.', justification: 'The total charge must balance to zero overall.' },
      ], answer: 'CaCl₂' },
    ],
    knowledgeChecks: [
      { question: 'Oxygen is in Group 16 (or "Group 6"). How many valence electrons does it have?', options: ['6', '16', '2', '8'], correctIndex: 0, explanation: 'Group number (simplified convention) gives valence electron count directly.', misconceptionId: 'valence-electrons-miscounted' },
      { question: 'What is the correct formula for the ionic compound formed between aluminium (Al³⁺) and oxide (O²⁻)?', options: ['Al₂O₃', 'AlO', 'Al₃O₂', 'AlO₃'], correctIndex: 0, explanation: 'Balancing +3 and -2 charges requires 2 Al (total +6) and 3 O (total -6), giving Al₂O₃.', misconceptionId: 'ionic-compound-charge-not-balanced' },
    ],
    confidenceCheckPrompt: 'How confident do you feel with valence electrons, covalent sharing, and balancing ionic compound formulas?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'predict-bond-type', revealSteps: 1, prompt: 'Predict the bond type between two oxygen atoms forming O₂.', steps: [
        { step: 'Both are non-metals, so this predicts a covalent bond.', justification: 'Non-metal + non-metal = covalent.' },
      ], answer: 'Covalent' },
      { id: 'fp-partial-1', objectiveId: 'explain-covalent-bonding', revealSteps: 1, prompt: 'Nitrogen (Group 15/5) needs how many more electrons for a full outer shell, and how might this relate to N₂?', steps: [
        { step: 'Nitrogen has 5 valence electrons, needing 3 more for a full shell of 8.', justification: 'Calculate the shortfall from 8.' },
        { step: 'Two nitrogen atoms can share 3 electron pairs (a triple bond) to both reach a full shell.', justification: 'Sharing multiple pairs can satisfy a larger electron shortfall.' },
      ], answer: 'Needs 3 more electrons; forms a triple covalent bond in N₂' },
      { id: 'fp-independent-1', objectiveId: 'balance-ionic-compound-charge', revealSteps: 0, prompt: 'Write the balanced formula for the ionic compound between sodium (Na⁺) and oxide (O²⁻).', steps: [
        { step: 'To balance +1 (Na) with -2 (O), you need TWO sodium ions: 2×(+1) = +2, balancing the -2 from one oxide.', justification: 'Find the smallest whole-number ratio balancing the charges.' },
      ], answer: 'Na₂O' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'predict-bond-type', question: 'Predict the bond type between calcium (metal) and fluorine (non-metal).', options: ['Ionic', 'Covalent', 'Neither', 'Cannot be predicted'], correctIndex: 0, hints: { strategic: 'Metal + non-metal.', procedural: 'This combination predicts ionic bonding.', workedStep: 'Ionic.' }, distractorMisconceptions: { 1: 'bonding-type-metal-nonmetal-missed' } },
      { id: 'ip-2', objectiveId: 'explain-ionic-bonding', question: 'When magnesium bonds with oxygen, what happens to magnesium\'s electrons?', options: ['They are transferred completely to oxygen', 'They are shared equally with oxygen', 'Nothing happens to them', 'Oxygen\'s electrons transfer to magnesium instead'], correctIndex: 0, hints: { strategic: 'Magnesium is a metal — what do metals typically do with electrons in ionic bonding?', procedural: 'They lose/transfer electrons.', workedStep: 'Transferred completely to oxygen.' }, distractorMisconceptions: { 1: 'ionic-bond-electron-sharing-confused' } },
      { id: 'ip-3', objectiveId: 'explain-covalent-bonding', question: 'Fluorine is in Group 17 (or "Group 7"). How many valence electrons does it have?', options: ['7', '17', '1', '8'], correctIndex: 0, hints: { strategic: 'Group number indicates valence electrons directly.', procedural: 'Group 17 (simplified: Group 7) → 7 valence electrons.', workedStep: '7.' }, distractorMisconceptions: { 1: 'valence-electrons-miscounted' } },
      { id: 'ip-4', objectiveId: 'balance-ionic-compound-charge', question: 'Write the balanced formula for the ionic compound between magnesium (Mg²⁺) and chloride (Cl⁻).', options: ['MgCl₂', 'MgCl', 'Mg₂Cl', 'MgCl₃'], correctIndex: 0, hints: { strategic: 'Balance +2 with -1 charges.', procedural: 'Need two Cl⁻ ions: 2×(-1) = -2, balancing +2.', workedStep: 'MgCl₂.' }, distractorMisconceptions: { 1: 'ionic-compound-charge-not-balanced' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'predict-bond-type', multiSelect: false, question: 'Predict the bond type between potassium (metal) and bromine (non-metal).', options: ['Ionic', 'Covalent', 'Neither', 'Cannot be predicted'], correctIndices: [0], explanation: 'Metal + non-metal predicts ionic bonding.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'predict-bond-type', multiSelect: false, question: 'Predict the bond type between two hydrogen atoms (H₂).', options: ['Covalent', 'Ionic', 'Neither', 'Cannot be predicted'], correctIndices: [0], explanation: 'Non-metal + non-metal predicts covalent bonding.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'explain-ionic-bonding', multiSelect: false, question: 'True or false: in ionic bonding, electrons are shared equally between the two atoms.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — ionic bonding involves complete electron transfer, not sharing.', distractorMisconceptions: { 0: 'ionic-bond-electron-sharing-confused' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'explain-ionic-bonding', multiSelect: false, question: 'When sodium bonds ionically with chlorine, what does sodium become?', options: ['A positive ion (Na⁺), having lost an electron', 'A negative ion, having gained an electron', 'Unchanged', 'A shared electron pair'], correctIndices: [0], explanation: 'Sodium loses an electron, becoming a positive ion.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'explain-covalent-bonding', multiSelect: false, question: 'Carbon is in Group 14 (or "Group 4"). How many valence electrons does it have?', options: ['4', '14', '2', '8'], correctIndices: [0], explanation: 'Group number gives valence electron count.', distractorMisconceptions: { 1: 'valence-electrons-miscounted' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'balance-ionic-compound-charge', multiSelect: false, question: 'Write the balanced formula for the compound between aluminium (Al³⁺) and chloride (Cl⁻).', options: ['AlCl₃', 'AlCl', 'Al₃Cl', 'AlCl₂'], correctIndices: [0], explanation: 'Balance +3 with three -1 ions: AlCl₃.', distractorMisconceptions: { 1: 'ionic-compound-charge-not-balanced' } },
    { id: 'q7', type: 'true-false', objectiveId: 'balance-ionic-compound-charge', multiSelect: false, question: 'True or false: an ionic compound\'s formula must have a net charge of zero overall.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is a fundamental requirement for a valid ionic formula.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'predict-bond-type', multiSelect: true, question: 'Which of these combinations would you predict form IONIC bonds? (select all that apply)', options: ['Sodium + chlorine', 'Two oxygen atoms', 'Calcium + oxygen', 'Two nitrogen atoms'], correctIndices: [0, 2], explanation: 'Sodium+chlorine and calcium+oxygen are both metal+non-metal — ionic. The other two are non-metal+non-metal — covalent.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'balance-ionic-compound-charge',
      analogy: 'Think of balancing an ionic formula like balancing a seesaw: positive charges on one side, negative on the other — you need to add enough of each ion so the total "weight" (charge) on each side is exactly equal, resulting in perfect balance (net zero).',
      explanation: 'Find the smallest whole-number ratio of cations to anions so that (cation charge × number of cations) exactly equals (anion charge × number of anions, ignoring sign).',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Balance the formula for iron(III) (Fe³⁺) and oxide (O²⁻).', steps: [
          { step: 'Charges: +3 and -2. Find the smallest numbers that make these equal in magnitude: 2×3=6 and 3×2=6.', justification: 'Find the lowest common multiple of the charge magnitudes.' },
          { step: 'Need 2 Fe³⁺ (total +6) and 3 O²⁻ (total -6) — these balance to zero.', justification: 'Use the LCM to determine how many of each ion is needed.' },
        ], answer: 'Fe₂O₃' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'balance-ionic-compound-charge', question: 'Balance the formula for barium (Ba²⁺) and chloride (Cl⁻).', options: ['BaCl₂', 'BaCl', 'Ba₂Cl', 'BaCl₃'], correctIndex: 0, hints: { strategic: 'Balance +2 with -1 charges.', procedural: 'Need two Cl⁻: 2×(-1)=-2.', workedStep: 'BaCl₂.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'balance-ionic-compound-charge', question: 'Balance the formula for potassium (K⁺) and sulfide (S²⁻).', options: ['K₂S', 'KS', 'KS₂', 'K₂S₂'], correctIndex: 0, hints: { strategic: 'Balance +1 with -2 charges.', procedural: 'Need two K⁺: 2×(+1)=+2.', workedStep: 'K₂S.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'balance-ionic-compound-charge', question: 'Balance the formula for aluminium (Al³⁺) and oxide (O²⁻).', options: ['Al₂O₃', 'AlO', 'Al₃O₂', 'AlO₃'], correctIndex: 0, hints: { strategic: 'Find the LCM of 3 and 2: 6.', procedural: 'Need 2 Al³⁺ (total +6) and 3 O²⁻ (total -6).', workedStep: 'Al₂O₃.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the key difference between ionic and covalent bonding?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel predicting bond types and balancing ionic formulas now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What quick rule can you use to predict ionic vs covalent bonding?', type: 'multiple-choice', options: ['Metal + non-metal = ionic; non-metal + non-metal = covalent', 'All bonds are ionic', 'All bonds are covalent', 'It cannot be predicted at all'] },
  ],
};
