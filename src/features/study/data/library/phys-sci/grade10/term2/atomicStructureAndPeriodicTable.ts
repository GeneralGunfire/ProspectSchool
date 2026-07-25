// ── Physical Sciences, Term 2, Topic 2: Atomic Structure and the Periodic Table ──
// Uses the new ParticleDiagram component (atom mode) to visualise
// protons/neutrons/electron shells.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'atomic-mass-number-confused',
    label: 'Confusing atomic number with mass number',
    errorType: 'You mixed up what atomic number and mass number each represent.',
    principle: 'ATOMIC NUMBER (Z) = number of PROTONS (defines which element it is). MASS NUMBER (A) = total number of PROTONS + NEUTRONS. These are different quantities, both shown near an element\'s symbol.',
    correctStep: 'For carbon-12: atomic number = 6 (6 protons), mass number = 12 (6 protons + 6 neutrons).',
  },
  {
    id: 'electron-neutron-mass-confused',
    label: 'Believing electrons contribute significantly to an atom\'s mass',
    errorType: 'You included electrons in mass number calculations, or thought they had comparable mass to protons/neutrons.',
    principle: 'Electrons have a MASS SO SMALL it\'s considered negligible compared to protons and neutrons — mass number only counts PROTONS and NEUTRONS, not electrons.',
    correctStep: 'An atom\'s mass number = protons + neutrons ONLY — electrons are excluded because their mass is negligible by comparison.',
  },
  {
    id: 'isotopes-different-elements',
    label: 'Believing isotopes of an element are actually different elements',
    errorType: 'You treated isotopes (same element, different neutron count) as if they were entirely different elements.',
    principle: 'ISOTOPES are atoms of the SAME element (same number of protons/atomic number) but with DIFFERENT numbers of neutrons (different mass numbers). They remain the same element because what defines an element is its proton count, not neutron count.',
    correctStep: 'Carbon-12 and Carbon-14 are both carbon (6 protons each) — they are isotopes of carbon, not different elements, despite having different mass numbers (6 vs. 8 neutrons).',
  },
  {
    id: 'periodic-table-groups-periods-confused',
    label: 'Confusing groups (columns) with periods (rows) on the periodic table',
    errorType: 'You mixed up whether you were referring to a vertical column or a horizontal row.',
    principle: 'GROUPS are the VERTICAL COLUMNS — elements in the same group share similar chemical properties (same number of outer/valence electrons). PERIODS are the HORIZONTAL ROWS — elements across a period have the same number of electron shells, but different properties.',
    correctStep: 'Group 1 (leftmost column) contains highly reactive metals like lithium, sodium, potassium — they share similar reactivity because they share the same outer-electron count.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 2,
  topicId: 'atomic-structure-and-periodic-table',
  topicName: 'Atomic Structure and the Periodic Table',
  prerequisites: [
    'Matter classification and states of matter (this term, Topic 1)',
  ],
  objectives: [
    { id: 'describe-atomic-structure', text: 'Describe the structure of an atom: protons, neutrons, electrons, and their locations.' },
    { id: 'calculate-subatomic-particles', text: 'Calculate the number of protons, neutrons, and electrons from atomic number and mass number.' },
    { id: 'explain-isotopes', text: 'Explain what isotopes are and why they remain the same element.' },
    { id: 'navigate-periodic-table', text: 'Navigate the periodic table using groups and periods, relating position to properties.' },
  ],
  estimatedMinutes: [20, 30],
};

export const atomicStructureAndPeriodicTable: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What makes carbon carbon, no matter how many neutrons it has?',
  goalSettingPrompt:
    'Every atom is built from the same three particles, arranged differently for each element. By the end of this lesson you\'ll be able to describe atomic structure precisely, calculate subatomic particle counts, and navigate the periodic table.',

  activate: {
    connectPrompt: 'You already know atoms contain protons, neutrons, and electrons — this lesson makes that knowledge precise and calculable.',
    diagnosticQuestions: [
      { question: 'What charge does a neutron carry?', options: ['No charge (neutral)', 'Positive', 'Negative', 'Variable charge'], correctIndex: 0, explanation: 'Neutrons are electrically neutral, as the name suggests.' },
      { question: 'Where are electrons located in an atom?', options: ['In shells/energy levels around the nucleus', 'Inside the nucleus with protons', 'Inside the nucleus with neutrons', 'Outside the atom entirely'], correctIndex: 0, explanation: 'Electrons occupy shells around the central nucleus.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'An atom has a central NUCLEUS containing PROTONS (positive charge) and NEUTRONS (no charge), surrounded by ELECTRONS (negative charge) in shells/energy levels. ATOMIC NUMBER (Z) = number of protons (defines the element). MASS NUMBER (A) = protons + neutrons (electrons are excluded, since their mass is negligible). In a neutral atom, the number of electrons equals the number of protons.',
    workedExamples: [
      { id: 'wx-atom-structure', prompt: 'An atom of sodium has atomic number 11 and mass number 23. Find its protons, neutrons, and electrons.', steps: [
        { step: 'Protons = atomic number = 11.', justification: 'Atomic number directly gives the proton count.' },
        { step: 'Neutrons = mass number - atomic number = 23 - 11 = 12.', justification: 'Mass number is protons plus neutrons, so subtract to isolate neutrons.' },
        { step: 'Electrons = protons = 11 (neutral atom).', justification: 'A neutral atom has equal protons and electrons.' },
      ], answer: '11 protons, 12 neutrons, 11 electrons', particle: { mode: 'atom', protons: 11, neutrons: 12, electronsPerShell: [2, 8, 1], label: 'Sodium (Na)' } },
    ],
    knowledgeChecks: [
      { question: 'An atom has atomic number 8 and mass number 16. How many neutrons does it have?', options: ['8', '16', '24', '0'], correctIndex: 0, explanation: 'Neutrons = 16 - 8 = 8.', misconceptionId: 'atomic-mass-number-confused' },
      { question: 'Does the number of electrons count toward an atom\'s mass number?', options: ['No — mass number only counts protons and neutrons', 'Yes, equally with protons', 'Yes, but only half as much', 'Only in large atoms'], correctIndex: 0, explanation: 'Electron mass is negligible and excluded from mass number.', misconceptionId: 'electron-neutron-mass-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel calculating protons, neutrons, and electrons from atomic/mass number?',
  },

  demonstrateChunk2: {
    explanation:
      'ISOTOPES are atoms of the SAME element (same atomic number/proton count) but with DIFFERENT numbers of neutrons (different mass numbers) — they remain the same element because the proton count defines the element. On the PERIODIC TABLE, GROUPS are VERTICAL COLUMNS (elements sharing similar properties, same outer-electron count); PERIODS are HORIZONTAL ROWS (elements with the same number of electron shells).',
    workedExamples: [
      { id: 'wx-isotopes', prompt: 'Carbon-12 has 6 protons and 6 neutrons. Carbon-14 has 6 protons and 8 neutrons. Are these different elements?', steps: [
        { step: 'Both have 6 protons (atomic number 6) — the proton count is what defines an element.', justification: 'Element identity is determined by proton count, not neutron count.' },
        { step: 'Since the proton count is the same, both are carbon — they are ISOTOPES of carbon, differing only in neutron count.', justification: 'Different neutron counts with the same proton count means isotopes, not different elements.' },
      ], answer: 'No — both are carbon, just different isotopes (different neutron counts)' },
      { id: 'wx-periodic-table-position', prompt: 'Sodium (Na) and potassium (K) are both in Group 1. What does this suggest about their properties?', steps: [
        { step: 'Elements in the same group have the same number of outer/valence electrons.', justification: 'Group membership is defined by shared outer-electron structure.' },
        { step: 'This means sodium and potassium share similar chemical properties — both are highly reactive metals.', justification: 'Shared valence-electron structure produces similar chemical behaviour.' },
      ], answer: 'They share similar chemical properties (both highly reactive Group 1 metals)' },
    ],
    knowledgeChecks: [
      { question: 'Chlorine-35 and Chlorine-37 have different mass numbers. Are they different elements?', options: ['No — they are isotopes of the same element (chlorine)', 'Yes, completely different elements', 'One is chlorine, the other isn\'t', 'Cannot be determined'], correctIndex: 0, explanation: 'Same proton count (17) means both are chlorine, just different isotopes.', misconceptionId: 'isotopes-different-elements' },
      { question: 'On the periodic table, what do elements in the same PERIOD (row) share?', options: ['The same number of electron shells', 'Identical chemical properties', 'The same number of protons', 'Nothing in common'], correctIndex: 0, explanation: 'Periods (rows) share the same number of electron shells.', misconceptionId: 'periodic-table-groups-periods-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel explaining isotopes and navigating the periodic table?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'calculate-subatomic-particles', revealSteps: 1, prompt: 'An atom has atomic number 12 and mass number 24. Find its protons, neutrons, and electrons.', steps: [
        { step: 'Protons = 12, Neutrons = 24-12 = 12, Electrons = 12 (neutral atom).', justification: 'Apply the standard calculations.' },
      ], answer: '12 protons, 12 neutrons, 12 electrons' },
      { id: 'fp-partial-1', objectiveId: 'explain-isotopes', revealSteps: 1, prompt: 'Uranium-235 and Uranium-238 both have 92 protons. Are they the same element? Why?', steps: [
        { step: 'Same proton count (92) — this defines the element.', justification: 'Element identity depends on proton count.' },
        { step: 'Yes, both are uranium — they are isotopes, differing only in neutron count.', justification: 'Different mass numbers with same proton count means isotopes.' },
      ], answer: 'Yes, both are uranium — isotopes with different neutron counts' },
      { id: 'fp-independent-1', objectiveId: 'navigate-periodic-table', revealSteps: 0, prompt: 'Fluorine and chlorine are both in Group 17. What can you predict about their chemical behaviour?', steps: [
        { step: 'Same group means same number of outer/valence electrons, so similar chemical reactivity/behaviour is expected.', justification: 'Group membership predicts similar chemical properties.' },
      ], answer: 'Similar chemical behaviour/reactivity, since they share the same group' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'describe-atomic-structure', question: 'Where is the vast majority of an atom\'s mass concentrated?', options: ['In the nucleus (protons and neutrons)', 'In the electron shells', 'Spread evenly throughout the atom', 'Outside the atom'], correctIndex: 0, hints: { strategic: 'Which particles have significant mass?', procedural: 'Protons and neutrons, both in the nucleus.', workedStep: 'The nucleus.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'calculate-subatomic-particles', question: 'An atom has atomic number 20 and mass number 40. How many neutrons does it have?', options: ['20', '40', '60', '0'], correctIndex: 0, hints: { strategic: 'Neutrons = mass number - atomic number.', procedural: '40-20', workedStep: '= 20.' }, distractorMisconceptions: { 1: 'atomic-mass-number-confused' } },
      { id: 'ip-3', objectiveId: 'explain-isotopes', question: 'Two atoms both have 8 protons, but one has 8 neutrons and the other has 10. What is their relationship?', options: ['They are isotopes of the same element (oxygen)', 'They are different elements', 'They are not related at all', 'One is not a real atom'], correctIndex: 0, hints: { strategic: 'Same proton count means same element.', procedural: '8 protons = oxygen, regardless of neutron count.', workedStep: 'Isotopes of oxygen.' }, distractorMisconceptions: { 1: 'isotopes-different-elements' } },
      { id: 'ip-4', objectiveId: 'navigate-periodic-table', question: 'What do elements in the same GROUP (column) share?', options: ['The same number of outer/valence electrons', 'The same number of electron shells', 'The same mass number', 'Nothing meaningful'], correctIndex: 0, hints: { strategic: 'Groups are columns — what defines similar chemical behaviour?', procedural: 'Same outer-electron count.', workedStep: 'Same number of valence electrons.' }, distractorMisconceptions: { 1: 'periodic-table-groups-periods-confused' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'describe-atomic-structure', multiSelect: false, question: 'Which particle carries a negative charge?', options: ['Electron', 'Proton', 'Neutron', 'None of them'], correctIndices: [0], explanation: 'Electrons carry negative charge.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'calculate-subatomic-particles', multiSelect: false, question: 'An atom has atomic number 17 and mass number 35. How many protons does it have?', options: ['17', '35', '18', '52'], correctIndices: [0], explanation: 'Protons = atomic number = 17.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'calculate-subatomic-particles', multiSelect: false, question: 'An atom has atomic number 6 and mass number 14. How many neutrons does it have?', options: ['8', '6', '14', '20'], correctIndices: [0], explanation: 'Neutrons = 14 - 6 = 8.', distractorMisconceptions: { 1: 'atomic-mass-number-confused' } },
    { id: 'q4', type: 'true-false', objectiveId: 'explain-isotopes', multiSelect: false, question: 'True or false: two atoms with the same number of protons but different numbers of neutrons are different elements.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — they are isotopes of the SAME element, since proton count defines the element.', distractorMisconceptions: { 0: 'isotopes-different-elements' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'explain-isotopes', multiSelect: false, question: 'What defines which element an atom is?', options: ['Its number of protons', 'Its number of neutrons', 'Its number of electrons only', 'Its total mass'], correctIndices: [0], explanation: 'Proton count (atomic number) defines the element.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'navigate-periodic-table', multiSelect: false, question: 'What are the vertical columns of the periodic table called?', options: ['Groups', 'Periods', 'Isotopes', 'Shells'], correctIndices: [0], explanation: 'Vertical columns are groups.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'navigate-periodic-table', multiSelect: false, question: 'True or false: elements in the same period (row) share the same number of electron shells.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is what defines a period.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'describe-atomic-structure', multiSelect: true, question: 'Which of these are located in the nucleus of an atom? (select all that apply)', options: ['Protons', 'Neutrons', 'Electrons', 'None of them'], correctIndices: [0, 1], explanation: 'Protons and neutrons are in the nucleus; electrons occupy shells around it.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'calculate-subatomic-particles',
      analogy: 'Think of atomic number as an ID tag telling you exactly how many protons are present (and thus which element it is), and mass number as the total weight of the "heavy" particles (protons + neutrons) — subtract the ID tag number from the total weight to find how many neutrons are "extra."',
      explanation: 'Three reliable steps: (1) Protons = atomic number (always); (2) Neutrons = mass number − atomic number; (3) Electrons = protons, for a neutral atom.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'An atom has atomic number 15 and mass number 31. Find protons, neutrons, electrons.', steps: [
          { step: 'Protons = 15.', justification: 'Directly from atomic number.' },
          { step: 'Neutrons = 31 - 15 = 16.', justification: 'Subtract atomic number from mass number.' },
          { step: 'Electrons = 15 (neutral atom).', justification: 'Equal to protons in a neutral atom.' },
        ], answer: '15 protons, 16 neutrons, 15 electrons' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'calculate-subatomic-particles', question: 'Atomic number 9, mass number 19. Find neutrons.', options: ['10', '9', '19', '28'], correctIndex: 0, hints: { strategic: 'Neutrons = mass number - atomic number.', procedural: '19-9', workedStep: '= 10.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'calculate-subatomic-particles', question: 'Atomic number 26, mass number 56. Find neutrons.', options: ['30', '26', '56', '82'], correctIndex: 0, hints: { strategic: 'Neutrons = mass number - atomic number.', procedural: '56-26', workedStep: '= 30.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'calculate-subatomic-particles', question: 'Atomic number 3, mass number 7. Find neutrons.', options: ['4', '3', '7', '10'], correctIndex: 0, hints: { strategic: 'Neutrons = mass number - atomic number.', procedural: '7-3', workedStep: '= 4.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the difference between atomic number and mass number?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with atomic structure and the periodic table now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What makes two atoms isotopes of the same element, rather than different elements?', type: 'multiple-choice', options: ['Same proton count, different neutron count', 'Same neutron count, different proton count', 'Completely different proton and neutron counts', 'Nothing — isotopes are always different elements'] },
  ],
};
