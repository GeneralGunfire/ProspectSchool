// ── Physical Sciences, Term 3, Topic 1: Quantitative Aspects of Chemical Change ──
// Chemistry strand. Builds on Term 2's atomic structure and representing chemical
// change. Introductory Grade 10 scope: the mole, molar mass, molar volume at STP,
// concentration of solutions, and mole-ratio stoichiometry from balanced equations.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'moles-mass-confused',
    label: 'Treating grams and moles as interchangeable',
    errorType: 'You used a mass value directly as if it were an amount in moles, without converting through molar mass.',
    principle: 'Moles and mass are DIFFERENT quantities linked by molar mass: n = m / M, where n is in mol, m is in g, and M is in g·mol⁻¹. You must always convert through M — never read a mass value as a mole value.',
    correctStep: '20 g of NaOH (M = 40 g·mol⁻¹) is NOT "20 mol" — it is n = 20 ÷ 40 = 0,5 mol.',
  },
  {
    id: 'coefficients-as-formula',
    label: 'Reading equation coefficients as changing the formula',
    errorType: 'You treated the number in front of a formula in a balanced equation as if it changed what the substance is, rather than how many moles of it react.',
    principle: 'A coefficient in a balanced equation is a MOLE RATIO, not part of the chemical formula. "2H₂O" still means water (H₂O) — the 2 tells you there are 2 moles of water, nothing about the substance itself changes.',
    correctStep: 'In 2H₂ + O₂ → 2H₂O, the "2" in front of H₂O means 2 mol of water are produced — the substance is still H₂O.',
  },
  {
    id: 'molar-volume-universal-constant',
    label: 'Applying molar volume without checking it only holds at STP',
    errorType: 'You used 22,4 dm³·mol⁻¹ for a gas without checking that the conditions given were STP.',
    principle: 'The molar volume of 22,4 dm³·mol⁻¹ (or 22,4 L·mol⁻¹) applies ONLY at STP (standard temperature and pressure, 0 °C and 1 atm at Grade 10 level). It is not a universal constant for gases at any temperature or pressure.',
    correctStep: 'At STP, n = V ÷ 22,4 dm³·mol⁻¹ — but this equation cannot be used if the problem states different conditions.',
  },
  {
    id: 'concentration-volume-units-mixed',
    label: 'Mixing dm³ and cm³ without converting',
    errorType: 'You substituted a volume in cm³ directly into c = n / V without converting to dm³ first.',
    principle: 'Concentration in mol·dm⁻³ requires volume in dm³. Since 1 dm³ = 1000 cm³, any volume given in cm³ must be divided by 1000 before it is used in c = n / V.',
    correctStep: '250 cm³ = 250 ÷ 1000 = 0,25 dm³ — this is the value that must be substituted into c = n / V, not 250.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 3,
  topicId: 'quantitative-aspects-of-chemical-change',
  topicName: 'Quantitative Aspects of Chemical Change',
  prerequisites: [
    'Representing chemical change: balanced equations (Term 2)',
    'Atomic structure and the periodic table (Term 2)',
  ],
  objectives: [
    { id: 'calculate-moles-from-mass', text: 'Calculate the amount (in mol) of a substance from its mass, using molar mass.' },
    { id: 'calculate-moles-from-gas-volume', text: 'Calculate the amount (in mol) of a gas at STP from its volume, using molar volume.' },
    { id: 'calculate-concentration', text: 'Calculate the concentration of a solution from moles of solute and volume of solution.' },
    { id: 'apply-mole-ratio-stoichiometry', text: 'Use mole ratios from a balanced equation to calculate an unknown amount of reactant or product.' },
  ],
  estimatedMinutes: [25, 35],
};

export const quantitativeAspectsOfChemicalChange: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How do chemists know exactly how much product a reaction will make — without ever weighing the atoms themselves?',
  goalSettingPrompt:
    'Chemists can\'t count individual atoms, but they can count in a unit called the MOLE, which links the invisible world of atoms to the visible world of grams, litres, and concentrations you can measure on a bench. By the end of this lesson you\'ll be able to move between mass, gas volume, concentration, and mole ratios with confidence.',

  activate: {
    connectPrompt: 'You already know how to balance chemical equations and read formulas — this lesson gives those coefficients a precise, measurable meaning.',
    diagnosticQuestions: [
      { question: 'In the formula H₂O, how many atoms of hydrogen are there per molecule?', options: ['2', '1', '3', '0'], correctIndex: 0, explanation: 'The subscript 2 gives the number of hydrogen atoms.' },
      { question: 'In a balanced equation, what must be equal on both sides?', options: ['The number of atoms of each element', 'The number of molecules', 'The mass in grams only', 'Nothing needs to be equal'], correctIndex: 0, explanation: 'A balanced equation conserves atoms of each element.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'The MOLE (mol) is the SI unit for "amount of substance" — it is simply a very large counting number (like "a dozen" means 12), used because atoms are far too small and numerous to count individually. The MOLAR MASS (M, in g·mol⁻¹) of a substance is its mass per mole, found by adding the atomic masses from the periodic table. The link between mass and moles is: n = m / M, where n = amount (mol), m = mass (g), M = molar mass (g·mol⁻¹). Gases at STP (standard temperature and pressure) all occupy the same MOLAR VOLUME per mole, 22,4 dm³·mol⁻¹, giving n = V / Vm.',
    workedExamples: [
      { id: 'wx-moles-from-mass', prompt: 'Calculate the number of moles in 4,4 g of carbon dioxide, CO₂ (M = 44 g·mol⁻¹).', steps: [
        { step: 'Identify the formula to use: n = m / M.', justification: 'This equation links mass to moles via molar mass.' },
        { step: 'Substitute: n = 4,4 ÷ 44 = 0,1 mol.', justification: 'Divide the given mass by the molar mass.' },
      ], answer: '0,1 mol' },
      { id: 'wx-moles-from-gas-volume', prompt: 'Calculate the number of moles of oxygen gas in 11,2 dm³ of O₂ at STP.', steps: [
        { step: 'At STP, molar volume Vm = 22,4 dm³·mol⁻¹, so n = V ÷ Vm.', justification: 'STP conditions allow use of the standard molar volume.' },
        { step: 'Substitute: n = 11,2 ÷ 22,4 = 0,5 mol.', justification: 'Divide the given volume by the molar volume.' },
      ], answer: '0,5 mol' },
    ],
    knowledgeChecks: [
      { question: 'What mass in grams is 2 mol of NaOH (M = 40 g·mol⁻¹)?', options: ['80 g', '40 g', '20 g', '2 g'], correctIndex: 0, explanation: 'm = n × M = 2 × 40 = 80 g.', misconceptionId: 'moles-mass-confused' },
      { question: 'At STP, how many moles are in 44,8 dm³ of a gas?', options: ['2 mol', '1 mol', '22,4 mol', '0,5 mol'], correctIndex: 0, explanation: 'n = 44,8 ÷ 22,4 = 2 mol.', misconceptionId: 'molar-volume-universal-constant' },
    ],
    confidenceCheckPrompt: 'How confident do you feel converting between mass, moles, and gas volume at STP?',
  },

  demonstrateChunk2: {
    explanation:
      'CONCENTRATION describes how much solute is dissolved in a solution, measured in mol·dm⁻³: c = n / V, where V must be in dm³ (convert cm³ by dividing by 1000). In a BALANCED EQUATION, the coefficients give the MOLE RATIO between reactants and products — this lets you calculate the moles of one substance from the moles of another, then convert to mass or volume as needed.',
    workedExamples: [
      { id: 'wx-concentration', prompt: 'Calculate the concentration of a solution containing 0,2 mol of solute dissolved in 500 cm³ of solution.', steps: [
        { step: 'Convert volume to dm³: 500 cm³ ÷ 1000 = 0,5 dm³.', justification: 'Concentration in mol·dm⁻³ requires volume in dm³.' },
        { step: 'Substitute into c = n ÷ V: c = 0,2 ÷ 0,5 = 0,4 mol·dm⁻³.', justification: 'Divide moles of solute by volume of solution in dm³.' },
      ], answer: '0,4 mol·dm⁻³' },
      { id: 'wx-mole-ratio-stoichiometry', prompt: 'In the reaction N₂ + 3H₂ → 2NH₃, how many moles of NH₃ form from 0,6 mol of H₂?', steps: [
        { step: 'Read the mole ratio of H₂ to NH₃ from the coefficients: 3 mol H₂ produces 2 mol NH₃.', justification: 'Coefficients in a balanced equation give the mole ratio between species.' },
        { step: 'Set up the ratio: moles NH₃ = 0,6 × (2 ÷ 3) = 0,4 mol.', justification: 'Scale the known moles by the mole ratio to find the unknown.' },
      ], answer: '0,4 mol NH₃' },
    ],
    knowledgeChecks: [
      { question: 'A solution has 0,1 mol of solute in 250 cm³. What volume (in dm³) should be substituted into c = n / V?', options: ['0,25 dm³', '250 dm³', '2,5 dm³', '0,025 dm³'], correctIndex: 0, explanation: '250 cm³ ÷ 1000 = 0,25 dm³.', misconceptionId: 'concentration-volume-units-mixed' },
      { question: 'In 2Mg + O₂ → 2MgO, what does the coefficient "2" in front of MgO represent?', options: ['2 mol of MgO are produced', 'The formula changes to Mg₂O', '2 grams of MgO', 'Nothing chemically meaningful'], correctIndex: 0, explanation: 'The coefficient is a mole ratio, not part of the formula.', misconceptionId: 'coefficients-as-formula' },
    ],
    confidenceCheckPrompt: 'How confident do you feel calculating concentration and using mole ratios from balanced equations?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'calculate-moles-from-mass', revealSteps: 2, prompt: 'Calculate the number of moles in 8 g of NaOH (M = 40 g·mol⁻¹).', steps: [
        { step: 'Use n = m ÷ M.', justification: 'This links mass to moles.' },
        { step: 'n = 8 ÷ 40 = 0,2 mol.', justification: 'Substitute and divide.' },
      ], answer: '0,2 mol' },
      { id: 'fp-partial-1', objectiveId: 'calculate-moles-from-gas-volume', revealSteps: 1, prompt: 'Calculate the volume, at STP, occupied by 0,25 mol of CO₂ gas.', steps: [
        { step: 'Rearrange n = V ÷ Vm to V = n × Vm.', justification: 'Solve for volume instead of moles.' },
        { step: 'V = 0,25 × 22,4 = 5,6 dm³.', justification: 'Substitute n and the STP molar volume.' },
      ], answer: '5,6 dm³' },
      { id: 'fp-independent-1', objectiveId: 'apply-mole-ratio-stoichiometry', revealSteps: 0, prompt: 'In 2H₂ + O₂ → 2H₂O, how many moles of H₂O form from 1 mol of O₂?', steps: [
        { step: 'The mole ratio of O₂ to H₂O is 1 : 2, so 1 mol O₂ produces 2 mol H₂O.', justification: 'Read the ratio directly from the coefficients.' },
      ], answer: '2 mol H₂O' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'calculate-moles-from-mass', question: 'How many moles are in 22 g of CO₂ (M = 44 g·mol⁻¹)?', options: ['0,5 mol', '22 mol', '2 mol', '44 mol'], correctIndex: 0, hints: { strategic: 'Use n = m ÷ M.', procedural: 'n = 22 ÷ 44.', workedStep: '0,5 mol.' }, distractorMisconceptions: { 1: 'moles-mass-confused' } },
      { id: 'ip-2', objectiveId: 'calculate-moles-from-gas-volume', question: 'How many moles are in 5,6 dm³ of a gas at STP?', options: ['0,25 mol', '5,6 mol', '22,4 mol', '2,5 mol'], correctIndex: 0, hints: { strategic: 'Use n = V ÷ Vm at STP.', procedural: 'n = 5,6 ÷ 22,4.', workedStep: '0,25 mol.' }, distractorMisconceptions: { 1: 'molar-volume-universal-constant' } },
      { id: 'ip-3', objectiveId: 'calculate-concentration', question: 'What is the concentration of 0,4 mol of solute dissolved in 200 cm³ of solution?', options: ['2 mol·dm⁻³', '0,002 mol·dm⁻³', '80 mol·dm⁻³', '0,4 mol·dm⁻³'], correctIndex: 0, hints: { strategic: 'Convert cm³ to dm³ first.', procedural: '200 cm³ = 0,2 dm³; c = 0,4 ÷ 0,2.', workedStep: '2 mol·dm⁻³.' }, distractorMisconceptions: { 1: 'concentration-volume-units-mixed' } },
      { id: 'ip-4', objectiveId: 'apply-mole-ratio-stoichiometry', question: 'In CaCO₃ → CaO + CO₂, how many moles of CaO form from 3 mol of CaCO₃?', options: ['3 mol', '1 mol', '6 mol', '9 mol'], correctIndex: 0, hints: { strategic: 'Check the mole ratio between CaCO₃ and CaO.', procedural: 'The ratio is 1 : 1, so moles of CaO = moles of CaCO₃.', workedStep: '3 mol.' }, distractorMisconceptions: { 1: 'coefficients-as-formula' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'calculate-moles-from-mass', multiSelect: false, question: 'How many moles are in 80 g of NaOH (M = 40 g·mol⁻¹)?', options: ['2 mol', '80 mol', '0,5 mol', '40 mol'], correctIndices: [0], explanation: 'n = 80 ÷ 40 = 2 mol.', distractorMisconceptions: { 1: 'moles-mass-confused' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'calculate-moles-from-mass', multiSelect: false, question: 'What mass (in g) is 3 mol of CO₂ (M = 44 g·mol⁻¹)?', options: ['132 g', '44 g', '3 g', '0,068 g'], correctIndices: [0], explanation: 'm = n × M = 3 × 44 = 132 g.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'calculate-moles-from-gas-volume', multiSelect: false, question: 'How many moles are in 2,24 dm³ of a gas at STP?', options: ['0,1 mol', '2,24 mol', '22,4 mol', '1 mol'], correctIndices: [0], explanation: 'n = 2,24 ÷ 22,4 = 0,1 mol.', distractorMisconceptions: { 1: 'molar-volume-universal-constant' } },
    { id: 'q4', type: 'true-false', objectiveId: 'calculate-moles-from-gas-volume', multiSelect: false, question: 'True or false: 22,4 dm³·mol⁻¹ can be used for any gas at any temperature and pressure.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — it only applies at STP.', distractorMisconceptions: { 0: 'molar-volume-universal-constant' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'calculate-concentration', multiSelect: false, question: 'What is the concentration of 0,5 mol of solute in 1000 cm³ of solution?', options: ['0,5 mol·dm⁻³', '500 mol·dm⁻³', '0,0005 mol·dm⁻³', '5 mol·dm⁻³'], correctIndices: [0], explanation: '1000 cm³ = 1 dm³, so c = 0,5 ÷ 1 = 0,5 mol·dm⁻³.', distractorMisconceptions: { 1: 'concentration-volume-units-mixed' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'apply-mole-ratio-stoichiometry', multiSelect: false, question: 'In N₂ + 3H₂ → 2NH₃, how many moles of H₂ are needed to produce 4 mol of NH₃?', options: ['6 mol', '4 mol', '2 mol', '12 mol'], correctIndices: [0], explanation: 'Ratio H₂ : NH₃ = 3 : 2, so moles H₂ = 4 × (3 ÷ 2) = 6 mol.', distractorMisconceptions: { 1: 'coefficients-as-formula' } },
    { id: 'q7', type: 'true-false', objectiveId: 'apply-mole-ratio-stoichiometry', multiSelect: false, question: 'True or false: in 2H₂O, the coefficient 2 changes the substance from water to something else.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the coefficient is a mole ratio; the substance is still H₂O.', distractorMisconceptions: { 0: 'coefficients-as-formula' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'calculate-moles-from-mass', multiSelect: true, question: 'Which of these correctly link mass and moles? (select all that apply)', options: ['n = m ÷ M', 'm = n × M', 'n = m × M', 'M = n ÷ m'], correctIndices: [0, 1], explanation: 'n = m ÷ M and its rearrangement m = n × M are both correct; the other two are not.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-mole-ratio-stoichiometry',
      analogy: 'Think of a balanced equation like a recipe: "2 eggs + 1 cup flour → 12 pancakes" tells you the RATIO of ingredients to product, not the ingredients themselves. If you double the eggs, you must scale everything else by the same ratio — that\'s exactly what a mole ratio does with reactants and products.',
      explanation: 'To use mole ratios: (1) make sure the equation is balanced, (2) read the ratio of coefficients between the substance you know and the substance you want, (3) multiply the known moles by that ratio to find the unknown moles.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'In 2Mg + O₂ → 2MgO, how many moles of MgO form from 5 mol of Mg?', steps: [
          { step: 'Read the ratio of Mg to MgO from the coefficients: 2 : 2, which simplifies to 1 : 1.', justification: 'Compare the coefficients of the known and unknown substances.' },
          { step: 'Moles of MgO = 5 × (2 ÷ 2) = 5 mol.', justification: 'Scale the known moles by the mole ratio.' },
        ], answer: '5 mol MgO' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-mole-ratio-stoichiometry', question: 'In 2H₂ + O₂ → 2H₂O, how many moles of H₂ are needed for 3 mol of O₂?', options: ['6 mol', '3 mol', '1,5 mol', '9 mol'], correctIndex: 0, hints: { strategic: 'Ratio H₂ : O₂ = 2 : 1.', procedural: 'moles H₂ = 3 × (2 ÷ 1).', workedStep: '6 mol.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'apply-mole-ratio-stoichiometry', question: 'In N₂ + 3H₂ → 2NH₃, how many moles of N₂ are needed to produce 6 mol of NH₃?', options: ['3 mol', '6 mol', '2 mol', '9 mol'], correctIndex: 0, hints: { strategic: 'Ratio N₂ : NH₃ = 1 : 2.', procedural: 'moles N₂ = 6 × (1 ÷ 2).', workedStep: '3 mol.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'apply-mole-ratio-stoichiometry', question: 'In CaCO₃ → CaO + CO₂, how many moles of CO₂ form from 2 mol of CaCO₃?', options: ['2 mol', '1 mol', '4 mol', '0,5 mol'], correctIndex: 0, hints: { strategic: 'Ratio CaCO₃ : CO₂ = 1 : 1.', procedural: 'moles CO₂ = 2 × (1 ÷ 1).', workedStep: '2 mol.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why do chemists use the mole instead of counting atoms directly?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel converting between mass, gas volume, concentration, and moles now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What does a coefficient in a balanced equation actually tell you?', type: 'multiple-choice', options: ['The mole ratio between substances', 'A change to the chemical formula', 'The mass of the substance in grams', 'Nothing useful'] },
  ],
};
