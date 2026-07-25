// ── Life Sciences, Term 1, Topic 1: Chemistry of Life ─────────────────────────
// Opens the "Life at Molecular, Cellular and Tissue Level" strand. Introductory
// Grade 10 scope: organic vs inorganic molecules, water and mineral salts,
// biomacromolecules (carbohydrates, lipids, proteins, nucleic acids), and enzymes.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'organic-equals-living',
    label: 'Believing "organic" means "living" and "inorganic" means "non-living"',
    errorType: 'You classified a molecule as organic or inorganic based on whether it came from something alive, rather than its chemical structure.',
    principle: 'ORGANIC molecules are defined by containing CARBON bonded to hydrogen (with a carbon backbone) — e.g. carbohydrates, lipids, proteins, nucleic acids. INORGANIC molecules generally lack this carbon-hydrogen structure, e.g. water and mineral salts — even though water is essential to life, it is inorganic.',
    correctStep: 'Water (H₂O) is inorganic despite being essential for life, because it has no carbon; glucose (C₆H₁₂O₆) is organic because it has a carbon backbone.',
  },
  {
    id: 'carbohydrate-role-oversimplified',
    label: 'Treating all carbohydrates as interchangeable "sugar"',
    errorType: 'You described all carbohydrates as simply "sugar" without distinguishing their different roles (energy storage vs structural support).',
    principle: 'Carbohydrates have DIFFERENT roles depending on their structure: monosaccharides (e.g. glucose) provide quick energy; polysaccharides like GLYCOGEN store energy in animals, while polysaccharides like CELLULOSE provide structural support in plant cell walls — not all carbohydrates serve the same function.',
    correctStep: 'Cellulose in a plant cell wall provides structural rigidity, while glycogen stored in a liver cell provides an energy reserve — both are carbohydrates but serve very different roles.',
  },
  {
    id: 'lipids-only-negative',
    label: 'Viewing lipids only as unhealthy fat with no biological function',
    errorType: 'You described lipids purely in terms of "unhealthy fat" without recognising their essential biological roles.',
    principle: 'Lipids serve essential functions: TRIGLYCERIDES store energy (more per gram than carbohydrates), and PHOSPHOLIPIDS form the structural basis of ALL cell membranes. Lipids are not simply "bad" — they are essential biomolecules.',
    correctStep: 'The cell membrane surrounding every cell in your body is built from a phospholipid bilayer — without lipids, cells could not exist.',
  },
  {
    id: 'enzymes-used-up-or-create-reaction',
    label: 'Believing enzymes are used up or that they create chemical reactions from nothing',
    errorType: 'You described an enzyme as being consumed by the reaction it catalyses, or as the source of the reaction itself.',
    principle: 'Enzymes are biological CATALYSTS — they SPEED UP a reaction that would happen anyway (just more slowly) by lowering the activation energy, and they are NOT consumed or changed permanently by the reaction. The same enzyme molecule can be reused repeatedly.',
    correctStep: 'A single amylase enzyme molecule breaks down many starch molecules one after another over time — it is not destroyed or "used up" after catalysing one reaction.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 1,
  topicId: 'chemistry-of-life',
  topicName: 'Chemistry of Life',
  prerequisites: [
    'Basic atomic structure (Grade 9 Natural Sciences)',
  ],
  objectives: [
    { id: 'classify-organic-inorganic', text: 'Classify a molecule as organic or inorganic based on its structure.' },
    { id: 'identify-biomacromolecule-roles', text: 'Identify the four major biomacromolecule classes and match each to its primary biological role.' },
    { id: 'explain-enzyme-function', text: 'Explain how enzymes function as catalysts, including the effect of temperature and pH.' },
  ],
  estimatedMinutes: [25, 35],
};

export const chemistryOfLife: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Every living thing — from bacteria to blue whales — is built from the same small set of chemical building blocks. What are they?',
  goalSettingPrompt:
    'Life runs on chemistry: water, mineral salts, and four families of carbon-based molecules do almost everything a cell needs. By the end of this lesson you\'ll be able to classify molecules as organic or inorganic, identify the four biomacromolecule classes and their roles, and explain how enzymes speed up reactions.',

  activate: {
    connectPrompt: 'You already know atoms bond to form molecules — this lesson looks at which molecules living things are actually built from, and why.',
    diagnosticQuestions: [
      { question: 'What element is present in all organic molecules?', options: ['Carbon', 'Oxygen', 'Nitrogen', 'Hydrogen only'], correctIndex: 0, explanation: 'Organic molecules are defined by a carbon backbone.' },
      { question: 'Is water an organic or inorganic molecule?', options: ['Inorganic', 'Organic', 'Neither', 'Both, depending on context'], correctIndex: 0, explanation: 'Water has no carbon, so it is inorganic, despite being essential to life.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'ORGANIC molecules contain a CARBON backbone bonded to hydrogen — examples include carbohydrates, lipids, proteins, and nucleic acids. INORGANIC molecules lack this structure — the most important examples in living organisms are WATER (a polar molecule that acts as the main solvent in cells, and is involved in cohesion, adhesion, and temperature regulation) and MINERAL SALTS (e.g. calcium for bones, iron for haemoglobin). Among organic molecules, CARBOHYDRATES are built from sugar units: monosaccharides (e.g. glucose) provide quick energy, while polysaccharides serve either energy storage (glycogen in animals, starch in plants) or structural roles (cellulose in plant cell walls).',
    workedExamples: [
      { id: 'wx-classify-organic', prompt: 'Classify glucose (C₆H₁₂O₆) and sodium chloride (NaCl) as organic or inorganic.', steps: [
        { step: 'Glucose contains carbon bonded to hydrogen (a carbon backbone), so it is organic.', justification: 'Organic molecules are defined by a carbon-hydrogen backbone.' },
        { step: 'Sodium chloride contains no carbon at all, so it is inorganic.', justification: 'Inorganic molecules generally lack a carbon-hydrogen structure.' },
      ], answer: 'Glucose: organic; NaCl: inorganic' },
      { id: 'wx-carbohydrate-roles', prompt: 'Compare the roles of starch (in a potato) and cellulose (in a plant cell wall).', steps: [
        { step: 'Starch is a storage polysaccharide, holding energy reserves that the plant can break down when needed.', justification: 'Some polysaccharides are specialised for energy storage.' },
        { step: 'Cellulose is a structural polysaccharide, providing rigidity to plant cell walls rather than being easily broken down for energy.', justification: 'Other polysaccharides are specialised for structural support instead.' },
      ], answer: 'Starch: energy storage; Cellulose: structural support' },
    ],
    knowledgeChecks: [
      { question: 'Which of these is inorganic?', options: ['Water', 'Glucose', 'A protein', 'DNA'], correctIndex: 0, explanation: 'Water contains no carbon, so it is inorganic — unlike the other three.', misconceptionId: 'organic-equals-living' },
      { question: 'Glycogen (in animals) and cellulose (in plants) are both carbohydrates. Do they serve the same role?', options: ['No — glycogen stores energy, cellulose provides structure', 'Yes — both are just "sugar" for energy', 'No — glycogen is inorganic', 'Yes — both are structural only'], correctIndex: 0, explanation: 'Different carbohydrates serve different roles depending on their structure.', misconceptionId: 'carbohydrate-role-oversimplified' },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying molecules as organic/inorganic and identifying carbohydrate roles?',
  },

  demonstrateChunk2: {
    explanation:
      'LIPIDS (triglycerides and phospholipids) store energy (more per gram than carbohydrates) and form the structural basis of every cell membrane (phospholipid bilayer). PROTEINS are built from amino acids and serve structural roles (e.g. keratin) and functional roles, including as ENZYMES. NUCLEIC ACIDS (DNA and RNA) store and transmit genetic information. ENZYMES are biological CATALYSTS: they speed up reactions by lowering activation energy, are specific to particular reactions (via their active site), are NOT consumed by the reaction, and their activity is affected by temperature and pH — too high a temperature or wrong pH can denature (permanently damage) an enzyme.',
    workedExamples: [
      { id: 'wx-lipid-role', prompt: 'Explain why phospholipids, not carbohydrates, form the main structure of cell membranes.', steps: [
        { step: 'Phospholipids have a water-loving (hydrophilic) head and water-repelling (hydrophobic) tail, allowing them to spontaneously form a bilayer in water.', justification: 'This dual nature lets phospholipids self-assemble into the membrane structure separating a cell\'s interior from its watery surroundings.' },
        { step: 'Carbohydrates and proteins do not have this specific dual-affinity structure needed to form a stable barrier bilayer.', justification: 'Membrane structure specifically requires the phospholipid\'s amphipathic (dual) nature.' },
      ], answer: 'Phospholipids\' dual water-loving/water-repelling structure lets them form the bilayer membrane' },
      { id: 'wx-enzyme-temperature', prompt: 'Explain what happens to an enzyme\'s activity if the temperature rises well above its optimal range.', steps: [
        { step: 'At first, activity may increase slightly as molecules move and collide faster.', justification: 'Warmer temperatures generally increase reaction rates up to a point.' },
        { step: 'Beyond the optimal temperature, the enzyme\'s shape (including its active site) is disrupted — it becomes DENATURED and can no longer function, even if the temperature later drops.', justification: 'Excessive heat permanently damages the enzyme\'s specific 3D shape, which is essential for its function.' },
      ], answer: 'Enzyme activity increases then sharply drops as the enzyme denatures at high temperatures' },
    ],
    knowledgeChecks: [
      { question: 'What happens to an enzyme molecule after it catalyses a reaction?', options: ['It is unchanged and can catalyse further reactions', 'It is consumed and destroyed', 'It becomes part of the product', 'It changes into a different molecule'], correctIndex: 0, explanation: 'Enzymes are not consumed — they remain available to catalyse more reactions.', misconceptionId: 'enzymes-used-up-or-create-reaction' },
      { question: 'What is the main structural component of every cell membrane?', options: ['Phospholipids', 'Carbohydrates', 'Mineral salts', 'DNA'], correctIndex: 0, explanation: 'Phospholipids form the bilayer structure of cell membranes.', misconceptionId: 'lipids-only-negative' },
    ],
    confidenceCheckPrompt: 'How confident do you feel explaining lipid and protein roles, and how enzymes function?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'classify-organic-inorganic', revealSteps: 1, prompt: 'Classify calcium carbonate (CaCO₃, found in bone) and a fatty acid (a lipid component) as organic or inorganic.', steps: [
        { step: 'Calcium carbonate has no carbon-hydrogen backbone structure typical of organic molecules — it is inorganic. A fatty acid has a long carbon-hydrogen chain — it is organic.', justification: 'Check for a carbon-hydrogen backbone to classify each molecule.' },
      ], answer: 'CaCO₃: inorganic; fatty acid: organic' },
      { id: 'fp-partial-1', objectiveId: 'identify-biomacromolecule-roles', revealSteps: 1, prompt: 'A biomolecule stores genetic information and is found in the nucleus. Which biomacromolecule class is this, and what is its monomer?', steps: [
        { step: 'This describes a nucleic acid (DNA), since DNA stores genetic information in the nucleus.', justification: 'Genetic information storage is the defining role of nucleic acids, specifically DNA.' },
        { step: 'Its monomer unit is the nucleotide.', justification: 'Nucleic acids are polymers built from repeating nucleotide units.' },
      ], answer: 'Nucleic acid (DNA); monomer is the nucleotide' },
      { id: 'fp-independent-1', objectiveId: 'explain-enzyme-function', revealSteps: 0, prompt: 'Explain, in one sentence, why an enzyme only works on one specific type of substrate.', steps: [
        { step: 'The enzyme\'s active site has a specific 3D shape that only fits a particular substrate molecule, like a lock and key.', justification: 'Enzyme specificity comes from the precise shape-match between active site and substrate.' },
      ], answer: 'Its active site\'s specific shape only fits one particular substrate' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'classify-organic-inorganic', question: 'Which of these is an organic molecule?', options: ['A protein', 'Water', 'A mineral salt', 'Sodium chloride'], correctIndex: 0, hints: { strategic: 'Check for a carbon-hydrogen backbone.', procedural: 'Proteins are built from amino acids, which contain carbon.', workedStep: 'A protein is organic.' }, distractorMisconceptions: { 1: 'organic-equals-living' } },
      { id: 'ip-2', objectiveId: 'identify-biomacromolecule-roles', question: 'Which biomacromolecule class provides the main structural component of a plant cell wall?', options: ['Carbohydrates (cellulose)', 'Lipids', 'Proteins only', 'Nucleic acids'], correctIndex: 0, hints: { strategic: 'Think about which polysaccharide is structural in plants.', procedural: 'Cellulose, a carbohydrate, forms plant cell walls.', workedStep: 'Carbohydrates (cellulose).' }, distractorMisconceptions: { 2: 'carbohydrate-role-oversimplified' } },
      { id: 'ip-3', objectiveId: 'identify-biomacromolecule-roles', question: 'Which biomacromolecule class forms the structural basis of all cell membranes?', options: ['Lipids (phospholipids)', 'Carbohydrates', 'Nucleic acids', 'Water'], correctIndex: 0, hints: { strategic: 'Think about which molecule has both water-loving and water-repelling parts.', procedural: 'Phospholipids form the membrane bilayer.', workedStep: 'Lipids (phospholipids).' }, distractorMisconceptions: { 1: 'lipids-only-negative' } },
      { id: 'ip-4', objectiveId: 'explain-enzyme-function', question: 'An enzyme is heated far above its optimal temperature and then cooled back down. Does it work normally again?', options: ['No — it has denatured and permanently lost its shape', 'Yes — enzymes always recover once cooled', 'Yes — temperature never affects enzymes', 'No — it has been consumed by the reaction'], correctIndex: 0, hints: { strategic: 'Consider what excessive heat does to an enzyme\'s shape.', procedural: 'Denaturation permanently changes the active site\'s shape.', workedStep: 'No, it has denatured.' }, distractorMisconceptions: { 3: 'enzymes-used-up-or-create-reaction' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'classify-organic-inorganic', multiSelect: false, question: 'Which of these molecules is inorganic?', options: ['Mineral salt (e.g. calcium)', 'A carbohydrate', 'A lipid', 'A protein'], correctIndices: [0], explanation: 'Mineral salts lack a carbon-hydrogen backbone, so they are inorganic.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'classify-organic-inorganic', multiSelect: false, question: 'True or false: a molecule is organic simply because it is found in a living organism.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — "organic" refers to carbon-based structure, not biological origin; water is inorganic despite being in living things.', distractorMisconceptions: { 0: 'organic-equals-living' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'identify-biomacromolecule-roles', multiSelect: false, question: 'Which biomacromolecule class stores the most energy per gram?', options: ['Lipids', 'Carbohydrates', 'Nucleic acids', 'Water'], correctIndices: [0], explanation: 'Lipids store more energy per gram than carbohydrates.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'identify-biomacromolecule-roles', multiSelect: false, question: 'True or false: glycogen and cellulose serve exactly the same biological role.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — glycogen stores energy in animals; cellulose provides structural support in plants.', distractorMisconceptions: { 0: 'carbohydrate-role-oversimplified' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'identify-biomacromolecule-roles', multiSelect: false, question: 'What is the monomer unit of a protein?', options: ['Amino acid', 'Nucleotide', 'Monosaccharide', 'Fatty acid'], correctIndices: [0], explanation: 'Proteins are polymers of amino acids.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'explain-enzyme-function', multiSelect: false, question: 'What term describes an enzyme permanently losing its shape and function due to excess heat?', options: ['Denaturation', 'Digestion', 'Synthesis', 'Replication'], correctIndices: [0], explanation: 'Denaturation is the permanent loss of an enzyme\'s functional shape.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'explain-enzyme-function', multiSelect: false, question: 'True or false: an enzyme is permanently consumed after catalysing one reaction.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — enzymes are not consumed and can catalyse many reactions repeatedly.', distractorMisconceptions: { 0: 'enzymes-used-up-or-create-reaction' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-biomacromolecule-roles', multiSelect: true, question: 'Which of these are organic biomacromolecules? (select all that apply)', options: ['Proteins', 'Lipids', 'Water', 'Mineral salts'], correctIndices: [0, 1], explanation: 'Proteins and lipids are organic; water and mineral salts are inorganic.', distractorMisconceptions: { 2: 'organic-equals-living' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'identify-biomacromolecule-roles',
      analogy: 'Think of the four biomacromolecule classes like four job roles in a factory: carbohydrates are the "quick fuel and scaffolding crew," lipids are the "long-term energy warehouse and wall-builders," proteins are the "machines and workers doing specific jobs," and nucleic acids are the "instruction manuals" that tell everyone what to build.',
      explanation: 'To identify a biomacromolecule\'s role: (1) check if it stores/releases energy quickly (carbohydrate) or long-term (lipid), (2) check if it does a specific job like catalysing a reaction or providing structure (protein), (3) check if it stores or transmits genetic information (nucleic acid).',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A biomolecule breaks down starch into sugars in your saliva. What class of biomolecule is it, and what specific role does it play?', steps: [
          { step: 'It performs a specific catalytic job (speeding up starch breakdown), which is a protein function.', justification: 'Catalysing specific reactions is the defining role of enzymes, which are proteins.' },
          { step: 'Specifically, it is an enzyme (amylase) — a protein specialised to catalyse this one reaction.', justification: 'Enzymes are the protein sub-class responsible for catalysis.' },
        ], answer: 'A protein — specifically an enzyme (amylase)' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'identify-biomacromolecule-roles', question: 'A biomolecule provides long-term energy storage and is a key part of every cell membrane. What class is it?', options: ['Lipid', 'Carbohydrate', 'Nucleic acid', 'Mineral salt'], correctIndex: 0, hints: { strategic: 'Think about energy storage AND membrane structure together.', procedural: 'Both roles point to lipids.', workedStep: 'Lipid.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'identify-biomacromolecule-roles', question: 'A biomolecule is the primary source of quick, short-term energy for cells. What class is it?', options: ['Carbohydrate', 'Lipid', 'Protein', 'Nucleic acid'], correctIndex: 0, hints: { strategic: 'Think about which class provides fast energy.', procedural: 'Monosaccharides like glucose are quick energy sources.', workedStep: 'Carbohydrate.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'identify-biomacromolecule-roles', question: 'A biomolecule stores the genetic instructions passed from parent to offspring. What class is it?', options: ['Nucleic acid', 'Protein', 'Carbohydrate', 'Lipid'], correctIndex: 0, hints: { strategic: 'Think about genetic information storage.', procedural: 'DNA is a nucleic acid.', workedStep: 'Nucleic acid.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is water classified as inorganic even though it is essential for life?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel classifying molecules and identifying biomacromolecule roles now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What happens to an enzyme when it is exposed to extreme heat?', type: 'multiple-choice', options: ['It denatures and permanently loses function', 'It works faster forever', 'It turns into a different enzyme', 'Nothing happens'] },
  ],
};
