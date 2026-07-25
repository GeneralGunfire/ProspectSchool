// ── Physical Sciences, Term 2, Topic 4: Physical/Chemical Change and Representing Chemical Change ──
// Final Term 2 Chemistry topic. First use of the new EquationBalancer
// component for equation balancing.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'dissolving-called-chemical-change',
    label: 'Classifying dissolving as a chemical change',
    errorType: 'You classified a substance dissolving in a solvent as a chemical change.',
    principle: 'DISSOLVING is a PHYSICAL change — the dissolved substance can usually be recovered unchanged (e.g. by evaporation), and no new substance with different chemical properties is formed.',
    correctStep: 'Salt dissolving in water is physical — evaporating the water recovers the exact same salt, unchanged.',
  },
  {
    id: 'physical-change-signs-missed',
    label: 'Not recognising the standard observable signs that indicate a chemical change has occurred',
    errorType: 'You didn\'t use the standard observable signs (colour change, gas produced, precipitate formed, temperature change, odour change) to help classify a change.',
    principle: 'Signs suggesting a CHEMICAL change (though not always definitive alone) include: a colour change, gas bubbles produced, a solid precipitate forming, an unexpected temperature change, a new odour, or the change being difficult/impossible to reverse.',
    correctStep: 'Bubbles forming when vinegar is added to baking soda, along with a temperature change, are signs a chemical reaction (producing CO₂ gas) has occurred.',
  },
  {
    id: 'coefficient-treated-as-subscript',
    label: 'Confusing a coefficient with a subscript when balancing an equation',
    errorType: 'You changed a formula\'s subscript (which defines the compound itself) instead of adjusting the coefficient in front of it.',
    principle: 'A COEFFICIENT (the number placed IN FRONT of a formula, like the "2" in 2H₂O) multiplies the WHOLE formula and can be freely changed to balance an equation. A SUBSCRIPT (the small number WITHIN a formula, like the "2" in H₂O) is part of the compound\'s identity and must NEVER be changed to balance an equation.',
    correctStep: 'To get more oxygen atoms, change 2H₂O (coefficient) — never change H₂O to H₂O₂ (that would be a completely different compound, hydrogen peroxide, not more water).',
  },
  {
    id: 'balancing-changes-what-reaction-happens',
    label: 'Believing balancing an equation determines or causes what reaction occurs',
    errorType: 'You treated balancing as though it decides what chemical reaction takes place, rather than accurately representing a reaction that already occurs.',
    principle: 'Balancing an equation doesn\'t CAUSE or CHOOSE a reaction — it accurately REPRESENTS a reaction that occurs in reality, ensuring the equation obeys the LAW OF CONSERVATION OF MATTER (atoms are neither created nor destroyed in a chemical reaction).',
    correctStep: 'The reaction between hydrogen and oxygen to form water happens due to chemistry, independent of how we write it — balancing the equation just makes our WRITTEN representation accurate to what actually happens.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 2,
  topicId: 'physical-chemical-change-and-equations',
  topicName: 'Physical & Chemical Change, and Representing Chemical Change',
  prerequisites: [
    'Chemical bonding (this term, Topic 3)',
  ],
  objectives: [
    { id: 'distinguish-physical-chemical-change', text: 'Distinguish physical changes from chemical changes using observable signs.' },
    { id: 'write-word-equations', text: 'Write a word equation for a simple chemical reaction.' },
    { id: 'balance-chemical-equations', text: 'Balance a chemical equation by adjusting coefficients, conserving atoms.' },
    { id: 'apply-conservation-of-matter', text: 'Explain balancing as representing the law of conservation of matter.' },
  ],
  estimatedMinutes: [20, 30],
};

export const physicalChemicalChangeAndEquations: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How can you tell a genuinely new substance has formed, not just a new shape or mixture?',
  goalSettingPrompt:
    'Physical changes rearrange matter without creating anything new; chemical changes create genuinely new substances. By the end of this lesson you\'ll be able to tell them apart, and correctly balance chemical equations to represent reactions accurately.',

  activate: {
    connectPrompt: 'You already know that atoms bond in fixed ratios — balancing equations respects those same ratios across an entire reaction.',
    diagnosticQuestions: [
      { question: 'Is melting ice a physical or chemical change?', options: ['Physical', 'Chemical', 'Neither', 'Both'], correctIndex: 0, explanation: 'Melting just rearranges particle spacing — no new substance forms.' },
      { question: 'Is burning wood a physical or chemical change?', options: ['Chemical', 'Physical', 'Neither', 'Both'], correctIndex: 0, explanation: 'Burning produces new substances (ash, gases) — a chemical change.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A PHYSICAL change alters a substance\'s form/appearance WITHOUT creating a new substance — it\'s usually reversible (e.g. melting, dissolving, cutting). A CHEMICAL change creates a genuinely NEW substance with different properties. Signs suggesting a chemical change: colour change, gas produced, precipitate (solid) formed, unexpected temperature change, new odour, or difficulty reversing the change.',
    workedExamples: [
      { id: 'wx-classify-change', prompt: 'Classify: (a) sugar dissolving in tea, (b) an iron nail rusting.', steps: [
        { step: '(a) The sugar can be recovered (e.g. by evaporating the water) — no new substance forms, just dissolved sugar in solution.', justification: 'Reversibility and no new substance indicate a physical change.' },
        { step: '(b) Rust (iron oxide) is a genuinely new substance, different from the original iron — reddish-brown, brittle, chemically distinct.', justification: 'A new substance with different properties indicates a chemical change.' },
      ], answer: '(a) Physical, (b) Chemical' },
      { id: 'wx-observable-signs', prompt: 'Vinegar is added to baking soda. Bubbles form immediately, and the mixture feels cooler. What type of change is this, and why?', steps: [
        { step: 'Gas bubbles (a new substance, CO₂) form, and there\'s a temperature change — both are signs of chemical change.', justification: 'Apply the standard observable signs.' },
      ], answer: 'Chemical change — gas production and temperature change are the signs' },
    ],
    knowledgeChecks: [
      { question: 'Is salt dissolving in water a physical or chemical change?', options: ['Physical', 'Chemical', 'Neither', 'Both'], correctIndex: 0, explanation: 'Dissolving is reversible and creates no new substance.', misconceptionId: 'dissolving-called-chemical-change' },
      { question: 'Which of these is NOT typically a sign of chemical change?', options: ['A change in shape only, with nothing else different', 'A colour change', 'Gas bubbles forming', 'A new odour appearing'], correctIndex: 0, explanation: 'A simple shape change alone (like cutting paper) is physical, not chemical.', misconceptionId: 'physical-change-signs-missed' },
    ],
    confidenceCheckPrompt: 'How confident do you feel distinguishing physical from chemical changes using observable signs?',
  },

  demonstrateChunk2: {
    explanation:
      'A WORD EQUATION describes a reaction using substance names: reactants → products. A CHEMICAL (formula) equation uses formulas, and must be BALANCED so the same number of each type of atom appears on both sides — this represents the LAW OF CONSERVATION OF MATTER (atoms are never created or destroyed in a reaction, only rearranged). Balance by adjusting COEFFICIENTS (numbers in front of formulas) — NEVER change a SUBSCRIPT (part of the formula itself), since that would describe a different substance entirely.',
    workedExamples: [
      { id: 'wx-word-equation', prompt: 'Write a word equation for hydrogen gas reacting with oxygen gas to form water.', steps: [
        { step: 'Identify reactants and products: hydrogen + oxygen react to form water.', justification: 'Word equations name the substances, not formulas.' },
      ], answer: 'Hydrogen + Oxygen → Water' },
      { id: 'wx-balance-equation', prompt: 'Balance the equation: H₂ + O₂ → H₂O', steps: [
        { step: 'Count atoms: left has 2 H, 2 O. Right has 2 H, 1 O — oxygen is unbalanced.', justification: 'Always count each element on both sides first.' },
        { step: 'Adjust coefficients (never subscripts): 2H₂ + O₂ → 2H₂O gives left: 4H, 2O; right: 4H, 2O — balanced.', justification: 'Adjust coefficients until every element matches on both sides.' },
      ], answer: '2H₂ + O₂ → 2H₂O', equationBalancer: {
        reactants: [{ formula: 'H2', elements: { H: 2 }, correctCoefficient: 2 }, { formula: 'O2', elements: { O: 2 }, correctCoefficient: 1 }],
        products: [{ formula: 'H2O', elements: { H: 2, O: 1 }, correctCoefficient: 2 }],
      } },
    ],
    knowledgeChecks: [
      { question: 'To balance an equation, which part of a formula are you allowed to change?', options: ['The coefficient (number in front)', 'The subscript (number within the formula)', 'Both freely', 'Neither can be changed'], correctIndex: 0, explanation: 'Only coefficients can be adjusted; subscripts define the compound itself.', misconceptionId: 'coefficient-treated-as-subscript' },
      { question: 'Why must a chemical equation be balanced?', options: ['To represent the law of conservation of matter — atoms aren\'t created or destroyed', 'To make the equation look neater', 'To decide which reaction will happen', 'Balancing is just a arbitrary convention with no real meaning'], correctIndex: 0, explanation: 'Balancing accurately represents that atoms are conserved, not created/destroyed.', misconceptionId: 'balancing-changes-what-reaction-happens' },
    ],
    confidenceCheckPrompt: 'How confident do you feel writing word equations and balancing chemical equations?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'distinguish-physical-chemical-change', revealSteps: 1, prompt: 'Is boiling water a physical or chemical change?', steps: [
        { step: 'Water vapour is still H₂O — no new substance forms, and condensing reverses it.', justification: 'Reversibility and same substance indicate physical change.' },
      ], answer: 'Physical' },
      { id: 'fp-partial-1', objectiveId: 'write-word-equations', revealSteps: 1, prompt: 'Write a word equation for magnesium reacting with oxygen to form magnesium oxide.', steps: [
        { step: 'Identify reactants (magnesium, oxygen) and product (magnesium oxide).', justification: 'Name the substances involved.' },
        { step: 'Magnesium + Oxygen → Magnesium oxide.', justification: 'Arrange as reactants → products.' },
      ], answer: 'Magnesium + Oxygen → Magnesium oxide' },
      { id: 'fp-independent-1', objectiveId: 'balance-chemical-equations', revealSteps: 0, prompt: 'Balance: N₂ + H₂ → NH₃', steps: [
        { step: 'Left: 2N, 2H. Right: 1N, 3H — unbalanced. Try N₂ + 3H₂ → 2NH₃: left 2N,6H; right 2N,6H — balanced.', justification: 'Adjust coefficients until all elements match.' },
      ], answer: 'N₂ + 3H₂ → 2NH₃' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'distinguish-physical-chemical-change', question: 'Is baking a cake (batter → cake, irreversible, new texture/taste) a physical or chemical change?', options: ['Chemical', 'Physical', 'Neither', 'Both'], correctIndex: 0, hints: { strategic: 'Is it reversible? Does a genuinely new substance form?', procedural: 'Not reversible, new substance (cake) with new properties.', workedStep: 'Chemical change.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'write-word-equations', question: 'Write a word equation for methane burning in oxygen to form carbon dioxide and water.', options: ['Methane + Oxygen → Carbon dioxide + Water', 'Carbon dioxide + Water → Methane + Oxygen', 'Methane → Carbon dioxide + Water + Oxygen', 'Oxygen → Methane + Water'], correctIndex: 0, hints: { strategic: 'Reactants react to form products.', procedural: 'Methane and oxygen are reactants; CO₂ and water are products.', workedStep: 'Methane + Oxygen → Carbon dioxide + Water.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'balance-chemical-equations', question: 'Balance: Na + Cl₂ → NaCl', options: ['2Na + Cl₂ → 2NaCl', 'Na + Cl₂ → NaCl', 'Na + Cl₂ → NaCl₂', '2Na + Cl₂ → NaCl'], correctIndex: 0, hints: { strategic: 'Count atoms: Cl₂ has 2 Cl atoms — how many Na and NaCl are needed?', procedural: 'Need 2 Na and 2 NaCl to balance 2 Cl.', workedStep: '2Na + Cl₂ → 2NaCl.' }, distractorMisconceptions: { 2: 'coefficient-treated-as-subscript' } },
      { id: 'ip-4', objectiveId: 'apply-conservation-of-matter', question: 'What law does balancing a chemical equation represent?', options: ['Conservation of matter (atoms aren\'t created or destroyed)', 'Conservation of energy only', 'A rule with no physical meaning', 'The law of gravity'], correctIndex: 0, hints: { strategic: 'Balancing ensures the same atoms appear on both sides.', procedural: 'This reflects that atoms are neither created nor destroyed.', workedStep: 'Conservation of matter.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'distinguish-physical-chemical-change', multiSelect: false, question: 'Is tearing paper a physical or chemical change?', options: ['Physical', 'Chemical', 'Neither', 'Both'], correctIndices: [0], explanation: 'The paper is still paper — just a different shape.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'distinguish-physical-chemical-change', multiSelect: false, question: 'True or false: dissolving sugar in water is a chemical change.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — dissolving is physical; the sugar can be recovered unchanged.', distractorMisconceptions: { 0: 'dissolving-called-chemical-change' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'distinguish-physical-chemical-change', multiSelect: false, question: 'Which is a sign suggesting a chemical change has occurred?', options: ['Gas bubbles forming unexpectedly', 'A shape change only', 'A size change only', 'A change of position'], correctIndices: [0], explanation: 'Gas production is a standard sign of chemical change.', distractorMisconceptions: { 1: 'physical-change-signs-missed' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'write-word-equations', multiSelect: false, question: 'Write a word equation for iron reacting with sulfur to form iron sulfide.', options: ['Iron + Sulfur → Iron sulfide', 'Iron sulfide → Iron + Sulfur', 'Iron + Iron sulfide → Sulfur', 'Sulfur → Iron + Iron sulfide'], correctIndices: [0], explanation: 'Reactants (iron, sulfur) form the product (iron sulfide).', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'balance-chemical-equations', multiSelect: false, question: 'Balance: Fe + O₂ → Fe₂O₃', options: ['4Fe + 3O₂ → 2Fe₂O₃', 'Fe + O₂ → Fe₂O₃', '2Fe + O₂ → Fe₂O₃', 'Fe + 3O₂ → Fe₂O₃'], correctIndices: [0], explanation: 'Balancing iron and oxygen requires 4Fe + 3O₂ → 2Fe₂O₃ (4Fe, 6O on each side).', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'balance-chemical-equations', multiSelect: false, question: 'True or false: to balance an equation, you can change the subscript within a formula.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — only coefficients can be changed; subscripts define the substance.', distractorMisconceptions: { 0: 'coefficient-treated-as-subscript' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'apply-conservation-of-matter', multiSelect: false, question: 'A balanced equation has 6 oxygen atoms on the reactant side. How many should be on the product side?', options: ['6', '3', '12', 'Any number'], correctIndices: [0], explanation: 'A balanced equation must have equal atom counts on both sides.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'distinguish-physical-chemical-change', multiSelect: true, question: 'Which of these are signs that suggest a chemical change has occurred? (select all that apply)', options: ['A colour change', 'A precipitate (solid) forming', 'A change in shape only', 'A new odour appearing'], correctIndices: [0, 1, 3], explanation: 'Colour change, precipitate formation, and new odour are all standard signs of chemical change. Shape change alone is typically physical.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'balance-chemical-equations',
      analogy: 'Think of balancing an equation like packing identical boxes onto two sides of a delivery truck: you can add MORE identical boxes (coefficients) to either side to make the load match, but you can never open a box and change what\'s INSIDE it (subscripts) — that would mean it\'s no longer the same product.',
      explanation: 'Always: (1) count each element on both sides; (2) find which elements don\'t match; (3) adjust COEFFICIENTS ONLY, one element at a time, until every count matches; (4) never touch a subscript.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Balance: Mg + O₂ → MgO', steps: [
          { step: 'Left: 1 Mg, 2 O. Right: 1 Mg, 1 O — oxygen unbalanced.', justification: 'Count each element on both sides.' },
          { step: 'Try 2Mg + O₂ → 2MgO: left 2Mg, 2O; right 2Mg, 2O — balanced.', justification: 'Adjust coefficients until both sides match.' },
        ], answer: '2Mg + O₂ → 2MgO' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'balance-chemical-equations', question: 'Balance: K + Cl₂ → KCl', options: ['2K + Cl₂ → 2KCl', 'K + Cl₂ → KCl', 'K + Cl₂ → KCl₂', '2K + Cl₂ → KCl'], correctIndex: 0, hints: { strategic: 'Count Cl atoms — Cl₂ has 2.', procedural: 'Need 2K and 2KCl to balance 2 Cl.', workedStep: '2K + Cl₂ → 2KCl.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'balance-chemical-equations', question: 'Balance: Al + O₂ → Al₂O₃', options: ['4Al + 3O₂ → 2Al₂O₃', 'Al + O₂ → Al₂O₃', '2Al + O₂ → Al₂O₃', 'Al + 3O₂ → Al₂O₃'], correctIndex: 0, hints: { strategic: 'Balance both Al and O carefully.', procedural: 'Need 4Al and 3O₂ to make 2Al₂O₃ (4Al, 6O each side).', workedStep: '4Al + 3O₂ → 2Al₂O₃.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'balance-chemical-equations', question: 'Balance: C + O₂ → CO₂', options: ['C + O₂ → CO₂ (already balanced)', '2C + O₂ → CO₂', 'C + 2O₂ → CO₂', 'C + O₂ → 2CO₂'], correctIndex: 0, hints: { strategic: 'Count atoms on both sides first.', procedural: 'Left: 1C, 2O. Right: 1C, 2O — already equal.', workedStep: 'Already balanced as written.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the key difference between a coefficient and a subscript?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel classifying changes and balancing equations now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What law does a balanced equation represent?', type: 'multiple-choice', options: ['Conservation of matter', 'Conservation of energy only', 'No particular law', 'The law of gravity'] },
  ],
};
