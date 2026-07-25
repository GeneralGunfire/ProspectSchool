// ── Life Sciences, Term 1, Topic 2: Cells — Basic Units of Life ──────────────
// Builds on Chemistry of Life (this term). Introductory Grade 10 scope: cell
// theory, prokaryotic vs eukaryotic cells, plant vs animal cell organelles,
// and movement of substances across membranes (diffusion and osmosis).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'animal-cells-have-cell-wall',
    label: 'Believing animal cells have a cell wall',
    errorType: 'You described or drew an animal cell as having a rigid cell wall, confusing it with a plant cell.',
    principle: 'Only PLANT cells (and some other organisms like fungi and bacteria) have a rigid CELL WALL outside the cell membrane. ANIMAL cells have ONLY a cell membrane — no cell wall — which is why animal cells are more flexible in shape than plant cells.',
    correctStep: 'A plant cell has both a cell wall (outer, rigid) and a cell membrane (inner, flexible); an animal cell has only the cell membrane, with no wall.',
  },
  {
    id: 'diffusion-osmosis-conflated',
    label: 'Treating diffusion and osmosis as the same process',
    errorType: 'You used "diffusion" and "osmosis" interchangeably, without distinguishing what is moving in each case.',
    principle: 'DIFFUSION is the net movement of ANY particles (e.g. gases, solutes) from an area of higher concentration to lower concentration. OSMOSIS is specifically the net movement of WATER molecules across a selectively permeable membrane, from an area of higher water concentration (dilute solution) to lower water concentration (concentrated solution). Osmosis is a special case of diffusion, specifically for water.',
    correctStep: 'Oxygen moving from the lungs into the blood is diffusion (a gas moving down its concentration gradient); water moving into a cell placed in a dilute solution is osmosis (water specifically, across a membrane).',
  },
  {
    id: 'prokaryote-eukaryote-confused',
    label: 'Confusing prokaryotic and eukaryotic cell features',
    errorType: 'You attributed a eukaryotic feature (like a membrane-bound nucleus) to a prokaryotic cell, or vice versa.',
    principle: 'EUKARYOTIC cells (e.g. plant and animal cells) have a membrane-bound NUCLEUS and membrane-bound organelles. PROKARYOTIC cells (e.g. bacteria) have NO membrane-bound nucleus — their genetic material floats freely in the cytoplasm — and lack most membrane-bound organelles.',
    correctStep: 'A bacterium (prokaryote) has no nucleus — its DNA is in the cytoplasm; a human cheek cell (eukaryote) has its DNA enclosed within a membrane-bound nucleus.',
  },
  {
    id: 'organelles-float-freely',
    label: 'Believing organelles have no fixed spatial organisation within the cell',
    errorType: 'You described or drew organelles as randomly scattered with no functional arrangement inside the cell.',
    principle: 'While organelles are suspended in the cytoplasm and can move to some extent, their positioning is FUNCTIONALLY ORGANISED — e.g. mitochondria cluster near regions needing energy, and the nucleus, ER, and Golgi apparatus are positioned to support the flow of protein production and processing.',
    correctStep: 'In a muscle cell (which needs a lot of energy), mitochondria are typically found densely packed near the structures that use that energy, not scattered randomly.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 1,
  topicId: 'cells-basic-units-of-life',
  topicName: 'Cells: Basic Units of Life',
  prerequisites: [
    'Chemistry of Life (this term, Topic 1)',
  ],
  objectives: [
    { id: 'distinguish-prokaryote-eukaryote', text: 'Distinguish prokaryotic from eukaryotic cells based on their features.' },
    { id: 'identify-organelle-functions', text: 'Identify key organelles in plant and animal cells and describe their functions.' },
    { id: 'explain-diffusion-osmosis', text: 'Explain diffusion and osmosis, and distinguish between them.' },
  ],
  estimatedMinutes: [25, 35],
};

export const cellsBasicUnitsOfLife: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Zoom into any living thing far enough, and you always find the same basic unit repeating. What is it, and what\'s inside it?',
  goalSettingPrompt:
    'Every living organism is built from cells, and understanding their structure explains how substances move in and out, and how organisms are organised. By the end of this lesson you\'ll be able to distinguish cell types, identify key organelles and their functions, and explain diffusion and osmosis.',

  activate: {
    connectPrompt: 'You already know cells contain organic molecules like proteins and lipids (from Chemistry of Life) — this lesson looks at how those molecules are organised into a working cell.',
    diagnosticQuestions: [
      { question: 'Do all living organisms consist of at least one cell?', options: ['Yes, cell theory states this', 'No, some organisms have no cells', 'Only animals are made of cells', 'Only plants are made of cells'], correctIndex: 0, explanation: 'Cell theory establishes that all living organisms are composed of cells.' },
      { question: 'Does a plant cell have a cell membrane?', options: ['Yes, in addition to a cell wall', 'No, only a cell wall', 'No, plant cells have neither', 'Only some plant cells do'], correctIndex: 0, explanation: 'Plant cells have both a cell membrane and an outer cell wall.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'CELL THEORY states that all living organisms are made of one or more cells, and cells are the basic unit of structure and function in life. PROKARYOTIC cells (e.g. bacteria) have NO membrane-bound nucleus — their DNA floats in the cytoplasm — and lack most membrane-bound organelles. EUKARYOTIC cells (e.g. plant and animal cells) have a membrane-bound NUCLEUS and membrane-bound organelles. Key organelles include: the nucleus (contains DNA, controls the cell), mitochondria (release energy via respiration), the cell membrane (controls what enters/exits), and in plant cells specifically: a rigid CELL WALL (support), chloroplasts (photosynthesis), and a large central VACUOLE (storage, maintains turgor pressure) — features animal cells lack.',
    workedExamples: [
      { id: 'wx-prokaryote-eukaryote', prompt: 'A cell has no membrane-bound nucleus and its DNA is loose in the cytoplasm. Is this a prokaryotic or eukaryotic cell?', steps: [
        { step: 'The absence of a membrane-bound nucleus is the defining feature of a prokaryotic cell.', justification: 'Eukaryotic cells always have a membrane-bound nucleus; prokaryotic cells never do.' },
      ], answer: 'Prokaryotic cell' },
      { id: 'wx-plant-vs-animal', prompt: 'Name two organelles/structures found in a plant cell but not in an animal cell, and state their functions.', steps: [
        { step: 'Cell wall: provides rigid structural support and protection to the plant cell.', justification: 'Only plant cells (and some other organisms) have this rigid outer layer.' },
        { step: 'Chloroplasts: carry out photosynthesis, converting light energy into chemical energy (glucose).', justification: 'Chloroplasts are unique to photosynthetic organisms like plants.' },
      ], answer: 'Cell wall (support/protection) and chloroplasts (photosynthesis)' },
    ],
    knowledgeChecks: [
      { question: 'Does an animal cell have a cell wall?', options: ['No — only a cell membrane', 'Yes, always', 'Yes, but only in some animal cells', 'No, and it has no membrane either'], correctIndex: 0, explanation: 'Animal cells have only a cell membrane, never a cell wall.', misconceptionId: 'animal-cells-have-cell-wall' },
      { question: 'What is the key structural difference between a prokaryotic and eukaryotic cell?', options: ['Eukaryotic cells have a membrane-bound nucleus; prokaryotic cells do not', 'Prokaryotic cells are always larger', 'Eukaryotic cells have no organelles', 'They have no structural differences'], correctIndex: 0, explanation: 'The presence of a membrane-bound nucleus is the defining eukaryotic feature.', misconceptionId: 'prokaryote-eukaryote-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel distinguishing prokaryotic from eukaryotic cells, and identifying organelles?',
  },

  demonstrateChunk2: {
    explanation:
      'DIFFUSION is the net movement of particles (e.g. gases, dissolved solutes) from an area of HIGHER concentration to LOWER concentration, driven by random particle motion, until equilibrium is reached — no energy input is required. OSMOSIS is a specific case of diffusion: the net movement of WATER molecules across a selectively permeable membrane, from an area of higher water concentration (a dilute solution) to lower water concentration (a concentrated solution). The CELL MEMBRANE is selectively permeable, controlling which substances pass through, and organelles within the cell are positioned in a functionally organised way, not randomly scattered.',
    workedExamples: [
      { id: 'wx-diffusion-example', prompt: 'Explain, using diffusion, why oxygen moves from the air in the lungs into the blood.', steps: [
        { step: 'Oxygen concentration is higher in the air in the lungs than in the blood arriving there.', justification: 'Diffusion requires a concentration gradient — particles move from high to low concentration.' },
        { step: 'Oxygen molecules therefore diffuse (net movement) from the air into the blood, down this concentration gradient, until a new balance is reached.', justification: 'Diffusion is the net movement of particles from high to low concentration.' },
      ], answer: 'Oxygen diffuses from high concentration (lung air) to low concentration (blood)' },
      { id: 'wx-osmosis-example', prompt: 'A plant cell is placed in a very dilute (mostly water) solution. Explain what happens to the cell using osmosis.', steps: [
        { step: 'The solution outside the cell has a higher water concentration than the cytoplasm inside the cell.', justification: 'Osmosis depends on comparing water concentration across the membrane.' },
        { step: 'Water moves by osmosis INTO the cell (from high to low water concentration, across the selectively permeable membrane), causing the cell to swell and become turgid.', justification: 'Osmosis moves water toward the region with less water (more concentrated solution).' },
      ], answer: 'Water moves into the cell by osmosis, making it turgid' },
    ],
    knowledgeChecks: [
      { question: 'What specifically moves during osmosis?', options: ['Water only, across a selectively permeable membrane', 'Any particle, in any direction', 'Only dissolved solutes', 'Oxygen and carbon dioxide only'], correctIndex: 0, explanation: 'Osmosis refers specifically to water movement across a membrane.', misconceptionId: 'diffusion-osmosis-conflated' },
      { question: 'Are mitochondria randomly scattered in a cell with no functional pattern?', options: ['No — their positioning relates to where energy is needed', 'Yes, entirely random', 'No, they are always in the nucleus', 'Yes, and this has no biological significance'], correctIndex: 0, explanation: 'Organelle positioning is functionally organised, not random.', misconceptionId: 'organelles-float-freely' },
    ],
    confidenceCheckPrompt: 'How confident do you feel explaining and distinguishing diffusion and osmosis?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'distinguish-prokaryote-eukaryote', revealSteps: 1, prompt: 'A human liver cell has a membrane-bound nucleus and mitochondria. Is it prokaryotic or eukaryotic?', steps: [
        { step: 'The presence of a membrane-bound nucleus confirms this is a eukaryotic cell.', justification: 'A membrane-bound nucleus is the defining feature of eukaryotic cells.' },
      ], answer: 'Eukaryotic' },
      { id: 'fp-partial-1', objectiveId: 'identify-organelle-functions', revealSteps: 1, prompt: 'Which organelle releases energy for the cell through respiration, and is found in both plant and animal cells?', steps: [
        { step: 'The mitochondrion is the organelle responsible for releasing energy via respiration.', justification: 'Mitochondria are the site of cellular respiration in eukaryotic cells.' },
        { step: 'It is found in both plant and animal cells, unlike chloroplasts which are plant-only.', justification: 'Both plant and animal cells need energy, so both have mitochondria.' },
      ], answer: 'Mitochondrion' },
      { id: 'fp-independent-1', objectiveId: 'explain-diffusion-osmosis', revealSteps: 0, prompt: 'A red blood cell is placed in pure water. Using osmosis, predict what happens to it.', steps: [
        { step: 'Pure water has a much higher water concentration than the inside of the cell, so water moves into the cell by osmosis, causing it to swell and potentially burst.', justification: 'Water moves by osmosis from high to low water concentration across the cell membrane.' },
      ], answer: 'Water enters by osmosis; the cell swells and may burst' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'distinguish-prokaryote-eukaryote', question: 'A bacterium has no membrane-bound nucleus. What type of cell is it?', options: ['Prokaryotic', 'Eukaryotic', 'Neither', 'Both'], correctIndex: 0, hints: { strategic: 'Check for a membrane-bound nucleus.', procedural: 'No membrane-bound nucleus means prokaryotic.', workedStep: 'Prokaryotic.' }, distractorMisconceptions: { 1: 'prokaryote-eukaryote-confused' } },
      { id: 'ip-2', objectiveId: 'identify-organelle-functions', question: 'Which structure is found in a plant cell but never in an animal cell?', options: ['Cell wall', 'Cell membrane', 'Mitochondria', 'Nucleus'], correctIndex: 0, hints: { strategic: 'Think about what gives plant cells their rigid shape.', procedural: 'The cell wall is unique to plant cells.', workedStep: 'Cell wall.' }, distractorMisconceptions: { 1: 'animal-cells-have-cell-wall' } },
      { id: 'ip-3', objectiveId: 'explain-diffusion-osmosis', question: 'Carbon dioxide moves out of a cell into the surrounding fluid where its concentration is lower. What process is this?', options: ['Diffusion', 'Osmosis', 'Neither — this requires energy', 'Active transport only'], correctIndex: 0, hints: { strategic: 'This is a gas, not water, moving down a concentration gradient.', procedural: 'Diffusion covers any particle moving from high to low concentration.', workedStep: 'Diffusion.' }, distractorMisconceptions: { 1: 'diffusion-osmosis-conflated' } },
      { id: 'ip-4', objectiveId: 'explain-diffusion-osmosis', question: 'Water moves across a cell membrane from a dilute solution into a more concentrated one. What is this process called specifically?', options: ['Osmosis', 'Diffusion of solutes', 'Active transport', 'Respiration'], correctIndex: 0, hints: { strategic: 'This is specifically water movement across a membrane.', procedural: 'Osmosis is the specific term for water movement across a membrane.', workedStep: 'Osmosis.' }, distractorMisconceptions: { 1: 'diffusion-osmosis-conflated' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'distinguish-prokaryote-eukaryote', multiSelect: false, question: 'True or false: a eukaryotic cell has a membrane-bound nucleus.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is the defining feature of eukaryotic cells.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'distinguish-prokaryote-eukaryote', multiSelect: false, question: 'Where is the genetic material located in a prokaryotic cell?', options: ['Freely in the cytoplasm, with no surrounding membrane', 'Inside a membrane-bound nucleus', 'Inside mitochondria only', 'It has no genetic material'], correctIndices: [0], explanation: 'Prokaryotes lack a membrane-bound nucleus, so DNA is free in the cytoplasm.', distractorMisconceptions: { 1: 'prokaryote-eukaryote-confused' } },
    { id: 'q3', type: 'true-false', objectiveId: 'identify-organelle-functions', multiSelect: false, question: 'True or false: animal cells have a rigid cell wall like plant cells.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — only plant cells (among these) have a rigid cell wall.', distractorMisconceptions: { 0: 'animal-cells-have-cell-wall' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'identify-organelle-functions', multiSelect: false, question: 'Which organelle carries out photosynthesis in plant cells?', options: ['Chloroplast', 'Mitochondrion', 'Nucleus', 'Vacuole'], correctIndices: [0], explanation: 'Chloroplasts are the site of photosynthesis in plant cells.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'identify-organelle-functions', multiSelect: false, question: 'Which organelle controls the cell and contains most of its DNA?', options: ['Nucleus', 'Mitochondrion', 'Cell wall', 'Vacuole'], correctIndices: [0], explanation: 'The nucleus contains the cell\'s DNA and controls its activities.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'explain-diffusion-osmosis', multiSelect: false, question: 'What is the key difference between diffusion and osmosis?', options: ['Osmosis is specifically about water movement across a membrane; diffusion applies to any particle', 'They are exactly the same process', 'Diffusion requires energy; osmosis does not', 'Osmosis only happens in animals'], correctIndices: [0], explanation: 'Osmosis is a specific case of diffusion, restricted to water.', distractorMisconceptions: { 1: 'diffusion-osmosis-conflated' } },
    { id: 'q7', type: 'true-false', objectiveId: 'explain-diffusion-osmosis', multiSelect: false, question: 'True or false: diffusion always requires an input of energy from the cell.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — diffusion is driven by random particle motion and does not require cellular energy input.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-organelle-functions', multiSelect: true, question: 'Which of these are found in BOTH plant and animal cells? (select all that apply)', options: ['Nucleus', 'Mitochondria', 'Chloroplasts', 'Cell wall'], correctIndices: [0, 1], explanation: 'Nucleus and mitochondria are found in both; chloroplasts and cell wall are plant-only.', distractorMisconceptions: { 2: 'animal-cells-have-cell-wall', 3: 'animal-cells-have-cell-wall' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'explain-diffusion-osmosis',
      analogy: 'Think of diffusion like perfume spreading through a room — particles spread from where they are crowded to where they are sparse, evening out over time. Osmosis is the exact same idea, but it\'s specifically about water molecules moving through a membrane doorway, from the "watery" side to the "less watery" (more concentrated) side.',
      explanation: 'To decide if a scenario is diffusion or osmosis: (1) identify what is moving, (2) if it\'s water specifically, moving across a membrane based on water concentration, it\'s osmosis, (3) if it\'s any other particle (gas, solute) moving from high to low concentration, it\'s diffusion (osmosis is technically a type of diffusion, but the specific term applies to water).',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Glucose molecules move from a region of high concentration in the gut into cells lining the gut, where concentration is lower. Is this diffusion or osmosis?', steps: [
          { step: 'The substance moving is glucose, a solute, not water.', justification: 'Identify exactly what particle is moving.' },
          { step: 'Since it is a solute (not water) moving from high to low concentration, this is diffusion, not osmosis.', justification: 'Osmosis is reserved specifically for water movement; other particles moving down a gradient is general diffusion.' },
        ], answer: 'Diffusion' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'explain-diffusion-osmosis', question: 'A plant cell placed in salty water loses water and shrinks. What process caused this?', options: ['Osmosis', 'Diffusion of solutes', 'Active transport', 'Respiration'], correctIndex: 0, hints: { strategic: 'Water is moving across the membrane.', procedural: 'Water leaving toward the more concentrated (salty) solution is osmosis.', workedStep: 'Osmosis.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'explain-diffusion-osmosis', question: 'Perfume molecules spread through a room from where they were sprayed. What process is this?', options: ['Diffusion', 'Osmosis', 'Neither', 'Active transport'], correctIndex: 0, hints: { strategic: 'This is not water moving through a membrane.', procedural: 'Molecules spreading from high to low concentration is diffusion.', workedStep: 'Diffusion.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'explain-diffusion-osmosis', question: 'A cell in a very dilute sugar solution takes in water and swells. What process is this?', options: ['Osmosis', 'Diffusion of sugar', 'Active transport', 'Neither'], correctIndex: 0, hints: { strategic: 'Water is specifically what is moving.', procedural: 'Water moving into the cell is osmosis.', workedStep: 'Osmosis.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the key difference between a plant cell and an animal cell?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel distinguishing prokaryotic/eukaryotic cells and explaining diffusion/osmosis now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What specifically moves during osmosis, and in which direction?', type: 'multiple-choice', options: ['Water, from high to low water concentration across a membrane', 'Any solute, in any direction', 'Only oxygen', 'Nothing moves during osmosis'] },
  ],
};
