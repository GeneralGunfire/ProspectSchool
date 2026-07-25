// ── Life Sciences, Term 2, Topic 1: Plant and Animal Tissues ─────────────────
// Opens the "Life Processes in Plants and Animals" strand. Builds on Cells:
// Basic Units of Life (Term 1). Introductory Grade 10 scope: plant tissues
// (meristematic and permanent), and animal tissues (epithelial, connective,
// muscle, nervous).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'xylem-phloem-functions-reversed',
    label: 'Reversing the functions of xylem and phloem',
    errorType: 'You described xylem as transporting sugars/organic nutrients, or phloem as transporting water/minerals.',
    principle: 'XYLEM transports WATER and DISSOLVED MINERAL SALTS, always in ONE DIRECTION — upward from roots to leaves. PHLOEM transports ORGANIC NUTRIENTS (mainly sugars made by photosynthesis), and can move them in EITHER direction depending on where they are needed (source to sink).',
    correctStep: 'Water absorbed by roots travels upward through xylem to the leaves; sugars produced in the leaves travel through phloem to wherever they are needed (e.g. roots, growing shoots) — not the reverse.',
  },
  {
    id: 'blood-not-considered-tissue',
    label: 'Believing blood is not a tissue because it is a fluid',
    errorType: 'You stated or implied that blood cannot be classified as a tissue because it flows and has no fixed shape.',
    principle: 'A TISSUE is defined as a group of similar cells working together to perform a specific function — this does not require a fixed or rigid structure. BLOOD is classified as a type of CONNECTIVE TISSUE: it consists of cells (red blood cells, white blood cells, platelets) suspended in a fluid matrix (plasma), all working together for transport functions.',
    correctStep: 'Blood qualifies as connective tissue because its cells (suspended in plasma) work together to perform the specific function of transport — being fluid does not disqualify it from being a tissue.',
  },
  {
    id: 'cardiac-muscle-classified-as-voluntary',
    label: 'Misclassifying cardiac muscle as voluntary (skeletal) muscle',
    errorType: 'You classified cardiac muscle (heart muscle) as voluntary muscle, or grouped it with skeletal muscle\'s control type.',
    principle: 'There are three types of muscle tissue: SKELETAL muscle is VOLUNTARY (consciously controlled, attached to bones, striated). CARDIAC muscle (found only in the heart) is INVOLUNTARY (not consciously controlled) but IS striated. SMOOTH muscle (found in organs like the gut) is INVOLUNTARY and NOT striated. Cardiac muscle is a distinct type, not a form of skeletal muscle.',
    correctStep: 'You cannot consciously decide to stop your heart from beating — cardiac muscle contracts involuntarily, unlike the voluntary skeletal muscles you use to move your arm.',
  },
  {
    id: 'plant-tissues-treated-as-uniform',
    label: 'Treating all plant tissue as one uniform type with no distinct roles',
    errorType: 'You described plant tissue generically (e.g. "stem tissue") without distinguishing meristematic, structural, and vascular tissue types.',
    principle: 'Plant tissues have distinct types and roles: MERISTEMATIC tissue (at root/shoot tips) consists of actively dividing cells responsible for GROWTH. PERMANENT tissues have specific differentiated roles: parenchyma (general/storage), collenchyma and sclerenchyma (support), and xylem/phloem (transport, also called vascular tissue).',
    correctStep: 'The tip of a growing root contains meristematic tissue (actively dividing for growth), while the older part of the same root contains permanent tissues like xylem and phloem (transport) — these are functionally distinct, not one uniform "root tissue".',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 2,
  topicId: 'plant-and-animal-tissues',
  topicName: 'Plant and Animal Tissues',
  prerequisites: [
    'Cells: Basic Units of Life (Term 1)',
  ],
  objectives: [
    { id: 'classify-plant-tissues', text: 'Classify plant tissues as meristematic or permanent, and describe their roles.' },
    { id: 'classify-animal-tissues', text: 'Classify the four main animal tissue types and describe their roles.' },
    { id: 'relate-tissue-structure-function', text: 'Relate the structure of a tissue to its specific biological function.' },
  ],
  estimatedMinutes: [25, 35],
};

export const plantAndAnimalTissues: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'A single cell can\'t hold up a tree or pump blood through a body — so how do groups of cells achieve what one cell alone never could?',
  goalSettingPrompt:
    'When similar cells organise into groups with a shared job, they form tissues — and each tissue\'s structure is built specifically for its function. By the end of this lesson you\'ll be able to classify plant and animal tissues and explain how their structure supports what they do.',

  activate: {
    connectPrompt: 'You already know cells have specialised organelles for specific jobs (from Cells: Basic Units of Life) — tissues are the next level up, where whole groups of cells specialise together.',
    diagnosticQuestions: [
      { question: 'What is a tissue?', options: ['A group of similar cells working together for a specific function', 'A single specialised cell', 'Any random collection of cells', 'An organ'], correctIndex: 0, explanation: 'A tissue is defined as similar cells organised to perform a shared function.' },
      { question: 'Is blood classified as a tissue?', options: ['Yes, connective tissue', 'No, it is not a tissue', 'Only when clotted', 'Only white blood cells count as tissue'], correctIndex: 0, explanation: 'Blood is a fluid connective tissue.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'PLANT tissues fall into two categories: MERISTEMATIC tissue consists of small, actively dividing cells found at root and shoot tips, responsible for GROWTH. PERMANENT tissues are differentiated (no longer dividing) and include: PARENCHYMA (general-purpose, storage, photosynthesis in leaves), COLLENCHYMA and SCLERENCHYMA (structural support — sclerenchyma cells have thick, often lignified walls for rigidity), and VASCULAR tissue — XYLEM (transports water and minerals upward, one direction only) and PHLOEM (transports sugars, either direction, from source to sink).',
    workedExamples: [
      { id: 'wx-meristem-vs-permanent', prompt: 'Explain why the very tip of a growing root contains meristematic tissue rather than permanent tissue.', steps: [
        { step: 'Growth in length requires new cells to be continuously produced by division.', justification: 'Only actively dividing (meristematic) cells can produce new cells for growth.' },
        { step: 'The root tip is where this active cell division happens, so it contains meristematic tissue; further back, cells have already differentiated into permanent tissues.', justification: 'Meristematic tissue is specifically located where active growth occurs.' },
      ], answer: 'The root tip needs actively dividing cells to produce new growth, which is the defining feature of meristematic tissue' },
      { id: 'wx-xylem-phloem', prompt: 'Compare what xylem and phloem each transport, and in which direction.', steps: [
        { step: 'Xylem transports water and dissolved mineral salts, always upward from roots to leaves (one direction only).', justification: 'Xylem is specialised for one-way transport of water and minerals.' },
        { step: 'Phloem transports organic nutrients (sugars from photosynthesis), and can move them in either direction depending on where they are needed.', justification: 'Phloem transport direction depends on the location of "source" (production) and "sink" (use/storage).' },
      ], answer: 'Xylem: water/minerals, upward only. Phloem: sugars, either direction' },
    ],
    knowledgeChecks: [
      { question: 'Which plant tissue transports sugars produced during photosynthesis?', options: ['Phloem', 'Xylem', 'Meristematic tissue', 'Sclerenchyma'], correctIndex: 0, explanation: 'Phloem transports organic nutrients like sugars.', misconceptionId: 'xylem-phloem-functions-reversed' },
      { question: 'What is the main role of meristematic tissue?', options: ['Growth, through active cell division', 'Structural support only', 'Water transport', 'Storage of sugars'], correctIndex: 0, explanation: 'Meristematic tissue consists of actively dividing cells responsible for growth.', misconceptionId: 'plant-tissues-treated-as-uniform' },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying plant tissues and describing xylem/phloem functions?',
  },

  demonstrateChunk2: {
    explanation:
      'ANIMAL tissues fall into four main types: EPITHELIAL tissue covers and lines surfaces (e.g. skin, gut lining) for protection and absorption. CONNECTIVE tissue supports and connects other tissues, including bone, cartilage, and BLOOD (a fluid connective tissue — its cells are suspended in a liquid matrix, plasma, but it still qualifies as a tissue). MUSCLE tissue has three types: SKELETAL (voluntary, striated, attached to bones), CARDIAC (involuntary, striated, found only in the heart), and SMOOTH (involuntary, not striated, found in organs like the gut). NERVOUS tissue (neurons) is specialised for communication, carrying electrical signals throughout the body, not just in the brain.',
    workedExamples: [
      { id: 'wx-blood-as-tissue', prompt: 'Explain why blood is classified as a connective tissue, even though it is a liquid.', steps: [
        { step: 'A tissue is defined by cells working together for a shared function, not by having a fixed shape.', justification: 'Fluidity does not disqualify something from being classed as a tissue.' },
        { step: 'Blood consists of cells (red cells, white cells, platelets) suspended in a fluid matrix (plasma), all working together for transport — this fits the definition of connective tissue.', justification: 'Blood\'s cells and fluid matrix functioning together for transport meets the tissue definition.' },
      ], answer: 'Blood\'s cells work together in a fluid matrix for transport, meeting the definition of a (connective) tissue' },
      { id: 'wx-muscle-types', prompt: 'Compare cardiac muscle and skeletal muscle in terms of voluntary control.', steps: [
        { step: 'Skeletal muscle is voluntary — you consciously control it (e.g. to move your arm).', justification: 'Skeletal muscle is attached to bones and used for deliberate movement.' },
        { step: 'Cardiac muscle is involuntary — it contracts automatically without conscious control, even though (like skeletal muscle) it is striated in appearance.', justification: 'Cardiac muscle\'s involuntary control is distinct from skeletal muscle, despite sharing a striated appearance.' },
      ], answer: 'Skeletal muscle: voluntary. Cardiac muscle: involuntary (though both are striated)' },
    ],
    knowledgeChecks: [
      { question: 'Which tissue type is blood classified as?', options: ['Connective tissue', 'Not a tissue at all', 'Epithelial tissue', 'Nervous tissue'], correctIndex: 0, explanation: 'Blood is a fluid connective tissue, despite lacking a fixed shape.', misconceptionId: 'blood-not-considered-tissue' },
      { question: 'Is cardiac muscle voluntary or involuntary?', options: ['Involuntary', 'Voluntary', 'Both, depending on the person', 'Neither — it does not contract'], correctIndex: 0, explanation: 'Cardiac muscle contracts involuntarily, unlike skeletal muscle.', misconceptionId: 'cardiac-muscle-classified-as-voluntary' },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying animal tissues, including blood and muscle types?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'classify-plant-tissues', revealSteps: 1, prompt: 'A plant tissue has thick, rigid walls and provides structural support to a mature stem. Is this meristematic or permanent tissue?', steps: [
        { step: 'This tissue is differentiated for a specific role (support) rather than actively dividing, so it is permanent tissue (specifically sclerenchyma).', justification: 'Meristematic tissue divides; permanent tissue has a specific, differentiated role like support.' },
      ], answer: 'Permanent tissue (sclerenchyma)' },
      { id: 'fp-partial-1', objectiveId: 'classify-animal-tissues', revealSteps: 1, prompt: 'A tissue lines the inside of the small intestine, absorbing nutrients. Which of the four main animal tissue types is this?', steps: [
        { step: 'Tissue that covers or lines a surface, here for absorption, is epithelial tissue.', justification: 'Epithelial tissue is defined by its role in covering/lining surfaces.' },
        { step: 'Its structure (often with folds or projections) increases surface area to support absorption.', justification: 'Structure relates directly to the tissue\'s specific function.' },
      ], answer: 'Epithelial tissue' },
      { id: 'fp-independent-1', objectiveId: 'relate-tissue-structure-function', revealSteps: 0, prompt: 'In one sentence, explain how the structure of nervous tissue (neurons) supports its function of communication.', steps: [
        { step: 'Neurons have long, thin extensions that allow electrical signals to travel quickly over long distances throughout the body.', justification: 'The elongated shape of neurons directly supports rapid, long-distance signal transmission.' },
      ], answer: 'Their long, thin shape allows electrical signals to travel quickly over long distances' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'classify-plant-tissues', question: 'Which plant tissue transports water upward from roots to leaves?', options: ['Xylem', 'Phloem', 'Parenchyma', 'Meristematic tissue'], correctIndex: 0, hints: { strategic: 'Think about which vascular tissue moves water.', procedural: 'Xylem is specialised for one-way water transport.', workedStep: 'Xylem.' }, distractorMisconceptions: { 1: 'xylem-phloem-functions-reversed' } },
      { id: 'ip-2', objectiveId: 'classify-animal-tissues', question: 'Bone and cartilage both belong to which animal tissue category?', options: ['Connective tissue', 'Epithelial tissue', 'Muscle tissue', 'Nervous tissue'], correctIndex: 0, hints: { strategic: 'Think about tissues that support and connect other structures.', procedural: 'Bone and cartilage both support the body — connective tissue.', workedStep: 'Connective tissue.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'classify-animal-tissues', question: 'Which muscle type is found only in the heart, and is involuntary but striated?', options: ['Cardiac muscle', 'Skeletal muscle', 'Smooth muscle', 'None — all heart muscle is voluntary'], correctIndex: 0, hints: { strategic: 'Think about the muscle unique to the heart.', procedural: 'Cardiac muscle is involuntary and striated, unlike skeletal (voluntary) or smooth (not striated).', workedStep: 'Cardiac muscle.' }, distractorMisconceptions: { 1: 'cardiac-muscle-classified-as-voluntary' } },
      { id: 'ip-4', objectiveId: 'relate-tissue-structure-function', question: 'Sclerenchyma cells have thick, often lignified cell walls. How does this structure relate to their function?', options: ['It provides rigidity for structural support', 'It allows them to divide rapidly', 'It allows water transport', 'It has no relation to function'], correctIndex: 0, hints: { strategic: 'Think about what thick, rigid walls would be useful for.', procedural: 'Rigid walls support structural strength.', workedStep: 'Provides rigidity for structural support.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'classify-plant-tissues', multiSelect: false, question: 'Which plant tissue type consists of actively dividing cells for growth?', options: ['Meristematic tissue', 'Xylem', 'Sclerenchyma', 'Phloem'], correctIndices: [0], explanation: 'Meristematic tissue is defined by active cell division for growth.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'classify-plant-tissues', multiSelect: false, question: 'True or false: phloem always transports substances upward only, like xylem.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — phloem can transport in either direction, unlike xylem which is one-directional.', distractorMisconceptions: { 0: 'xylem-phloem-functions-reversed' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'classify-animal-tissues', multiSelect: false, question: 'Which animal tissue type covers and lines body surfaces?', options: ['Epithelial tissue', 'Connective tissue', 'Muscle tissue', 'Nervous tissue'], correctIndices: [0], explanation: 'Epithelial tissue is specialised for covering and lining surfaces.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'classify-animal-tissues', multiSelect: false, question: 'True or false: blood cannot be classified as a tissue because it is a liquid.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — blood is a fluid connective tissue; being liquid does not disqualify it.', distractorMisconceptions: { 0: 'blood-not-considered-tissue' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'classify-animal-tissues', multiSelect: false, question: 'Which muscle type is voluntary and striated, attached to bones?', options: ['Skeletal muscle', 'Cardiac muscle', 'Smooth muscle', 'None of these'], correctIndices: [0], explanation: 'Skeletal muscle is the voluntary, striated muscle attached to bones.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'classify-animal-tissues', multiSelect: false, question: 'True or false: cardiac muscle is a type of skeletal muscle found only in the heart.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — cardiac muscle is a distinct, involuntary muscle type, not a form of skeletal muscle.', distractorMisconceptions: { 0: 'cardiac-muscle-classified-as-voluntary' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'relate-tissue-structure-function', multiSelect: false, question: 'Why do xylem vessels have thick, often lignified walls?', options: ['To provide strength while transporting water under pressure', 'To allow rapid cell division', 'To enable sugar storage', 'To absorb sunlight'], correctIndices: [0], explanation: 'Thick, lignified walls give xylem the strength needed to withstand water transport pressure.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'classify-animal-tissues', multiSelect: true, question: 'Which of these are types of muscle tissue? (select all that apply)', options: ['Skeletal', 'Cardiac', 'Epithelial', 'Smooth'], correctIndices: [0, 1, 3], explanation: 'Skeletal, cardiac, and smooth are the three muscle tissue types; epithelial is a separate tissue category.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'classify-animal-tissues',
      analogy: 'Think of the four animal tissue types like four departments in a company: Epithelial is the "front desk/reception" (covering and lining, controlling what enters/exits). Connective is the "structural framework and delivery team" (support and transport — including blood as a fluid delivery team). Muscle is the "movement crew" (three sub-types with different control styles). Nervous is the "communications department" (sending signals).',
      explanation: 'To classify an animal tissue: (1) does it cover/line a surface? → epithelial. (2) does it support, connect, or transport (including blood)? → connective. (3) does it contract to produce movement? → muscle (then check voluntary/striated to pick skeletal, cardiac, or smooth). (4) does it carry electrical signals? → nervous.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A tissue in the wall of the stomach contracts involuntarily to churn food, and is not striated. Which tissue type and sub-type is this?', steps: [
          { step: 'It contracts, so it is muscle tissue.', justification: 'Contraction to produce movement is the defining feature of muscle tissue.' },
          { step: 'It is involuntary and not striated, which specifically identifies it as smooth muscle (unlike cardiac, which is striated).', justification: 'Smooth muscle is the involuntary, non-striated muscle sub-type found in organs like the stomach.' },
        ], answer: 'Muscle tissue — specifically smooth muscle' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'classify-animal-tissues', question: 'A tissue consists of neurons carrying electrical signals from the spinal cord to the leg muscles. What tissue type is this?', options: ['Nervous tissue', 'Muscle tissue', 'Connective tissue', 'Epithelial tissue'], correctIndex: 0, hints: { strategic: 'Think about which tissue carries electrical signals.', procedural: 'Neurons are the defining cell of nervous tissue.', workedStep: 'Nervous tissue.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'classify-animal-tissues', question: 'A tissue forms the outer layer of skin, protecting the body. What tissue type is this?', options: ['Epithelial tissue', 'Connective tissue', 'Muscle tissue', 'Nervous tissue'], correctIndex: 0, hints: { strategic: 'Think about tissue that covers a surface.', procedural: 'Covering the body surface is a defining epithelial role.', workedStep: 'Epithelial tissue.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'classify-animal-tissues', question: 'A tissue consists of cells suspended in plasma, transporting oxygen throughout the body. What tissue type is this?', options: ['Connective tissue (blood)', 'Epithelial tissue', 'Muscle tissue', 'Nervous tissue'], correctIndex: 0, hints: { strategic: 'Think about blood\'s classification.', procedural: 'Blood is a fluid connective tissue.', workedStep: 'Connective tissue (blood).' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is blood classified as connective tissue, even though it is a liquid?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel classifying plant and animal tissues now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the key difference between xylem and phloem?', type: 'multiple-choice', options: ['Xylem transports water/minerals one-way; phloem transports sugars either way', 'They transport the exact same substances', 'Phloem only exists in roots', 'Xylem is a type of muscle tissue'] },
  ],
};
