// ── Life Sciences, Term 1, Topic 3: Cell Division — Mitosis ──────────────────
// Closes the "Life at Molecular, Cellular and Tissue Level" strand. Builds on
// Cells: Basic Units of Life (this term). Introductory Grade 10 scope: reasons
// for cell division, the cell cycle, stages of mitosis, and its significance.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'mitosis-meiosis-confused',
    label: 'Confusing mitosis with meiosis, or assuming both occur in all cells',
    errorType: 'You described mitosis as producing genetically varied gametes, or assumed meiosis happens in ordinary body cell division.',
    principle: 'MITOSIS occurs in ordinary body (somatic) cells for growth, repair, and replacement, producing two GENETICALLY IDENTICAL daughter cells with the SAME chromosome number as the parent cell. MEIOSIS (a separate process, covered in later grades) occurs only in specialised reproductive cells to produce genetically varied gametes with HALF the chromosome number. Grade 10 mitosis does not involve genetic variation or chromosome number reduction.',
    correctStep: 'A skin cell dividing to heal a cut undergoes mitosis, producing two identical skin cells — this is not meiosis, and no genetic variation is introduced.',
  },
  {
    id: 'mitosis-creates-different-cells',
    label: 'Believing mitosis produces different types of cells rather than identical copies',
    errorType: 'You described mitosis as creating a new or different kind of cell, rather than an identical copy of the original.',
    principle: 'Mitosis produces two DAUGHTER CELLS that are GENETICALLY IDENTICAL to the original PARENT CELL and to each other — same chromosome number, same genetic information. Mitosis is a copying process, not one that creates variation or new cell types.',
    correctStep: 'When a liver cell divides by mitosis, both resulting cells are liver cells, genetically identical to the original — mitosis does not turn a liver cell into a different cell type.',
  },
  {
    id: 'mitosis-stages-misidentified',
    label: 'Misidentifying the stages of mitosis from a diagram',
    errorType: 'You labelled a diagram of a mitotic stage incorrectly, e.g. calling any image with visible chromosomes "anaphase" without checking their arrangement.',
    principle: 'Each stage of mitosis has a distinct, identifiable feature: PROPHASE — chromosomes condense and become visible, nuclear membrane starts breaking down. METAPHASE — chromosomes line up at the CENTRE (equator) of the cell. ANAPHASE — sister chromatids are pulled APART toward opposite poles. TELOPHASE — two new nuclear membranes form around the separated chromosome sets, and the cell begins to divide.',
    correctStep: 'A diagram showing chromosomes lined up neatly along the middle of the cell shows METAPHASE, not anaphase — anaphase specifically shows chromatids already moving apart toward the poles.',
  },
  {
    id: 'mitosis-only-in-animals',
    label: 'Believing cell division by mitosis only occurs in animals',
    errorType: 'You assumed mitosis is a process exclusive to animal cells, or humans specifically.',
    principle: 'Mitosis occurs in ALL eukaryotic organisms that grow, repair tissue, or reproduce asexually via ordinary cell division — this includes PLANTS (e.g. in root tip and shoot tip meristems) just as much as animals.',
    correctStep: 'Onion root tip cells are commonly used in practicals specifically because they show mitosis clearly and rapidly, in a plant, not an animal.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 1,
  topicId: 'cell-division-mitosis',
  topicName: 'Cell Division: Mitosis',
  prerequisites: [
    'Cells: Basic Units of Life (this term, Topic 2)',
  ],
  objectives: [
    { id: 'explain-reasons-for-mitosis', text: 'Explain why cells undergo mitosis (growth, repair, replacement).' },
    { id: 'identify-mitosis-stages', text: 'Identify the stages of mitosis (prophase, metaphase, anaphase, telophase) from a description or diagram.' },
    { id: 'explain-significance-of-mitosis', text: 'Explain the significance of mitosis in producing genetically identical cells with a constant chromosome number.' },
  ],
  estimatedMinutes: [20, 30],
};

export const cellDivisionMitosis: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'A cut on your skin heals itself within days. Where do all those new skin cells actually come from?',
  goalSettingPrompt:
    'Cells don\'t last forever, and organisms grow — both require a reliable way to make exact copies of existing cells. By the end of this lesson you\'ll be able to explain why cells divide by mitosis, identify its stages, and explain why it must produce genetically identical cells.',

  activate: {
    connectPrompt: 'You already know cells contain a nucleus holding genetic information (from Cells: Basic Units of Life) — mitosis is how that information gets copied and shared between two new cells.',
    diagnosticQuestions: [
      { question: 'When a cell divides by mitosis, are the two resulting cells genetically identical or different?', options: ['Identical', 'Different', 'Half identical', 'Cannot be determined'], correctIndex: 0, explanation: 'Mitosis produces two genetically identical daughter cells.' },
      { question: 'Does mitosis occur only in animals, or in plants too?', options: ['In both plants and animals', 'Only in animals', 'Only in plants', 'In neither'], correctIndex: 0, explanation: 'Mitosis occurs in all eukaryotic organisms, including plants.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Multicellular organisms need cell division for GROWTH (increasing cell number as an organism develops), REPAIR (replacing damaged tissue, e.g. healing a wound), and REPLACEMENT (renewing cells that naturally wear out, e.g. skin or blood cells). MITOSIS is the type of cell division responsible for these processes in ordinary body (somatic) cells — it occurs in both plants (e.g. at root and shoot tips) and animals. Before mitosis begins, the cell\'s DNA is copied during INTERPHASE (part of the cell cycle) — mitosis itself then distributes this copied genetic material equally between two new cells.',
    workedExamples: [
      { id: 'wx-reasons-for-mitosis', prompt: 'Explain, in terms of mitosis, why a plant\'s roots continue to grow longer over time.', steps: [
        { step: 'Cells at the root tip (in the meristem) repeatedly divide by mitosis.', justification: 'Growth in length requires an increasing number of cells, produced by division.' },
        { step: 'Each division produces two new, genetically identical cells, increasing the total cell number and allowing the root to lengthen.', justification: 'Mitosis increases cell number while keeping genetic content identical, supporting growth.' },
      ], answer: 'Repeated mitosis at the root tip increases cell number, lengthening the root' },
      { id: 'wx-plant-vs-animal-mitosis', prompt: 'Name one location in a plant and one process in an animal where mitosis is especially active.', steps: [
        { step: 'In a plant, mitosis is especially active at the root tip and shoot tip meristems, where growth occurs.', justification: 'Meristem tissue is specialised for rapid, ongoing mitosis to drive plant growth.' },
        { step: 'In an animal, mitosis is especially active during wound healing, replacing damaged skin cells.', justification: 'Repair of damaged tissue relies on mitosis to replace lost cells.' },
      ], answer: 'Plant: root/shoot tip meristems; Animal: wound healing (skin repair)' },
    ],
    knowledgeChecks: [
      { question: 'Which of these is NOT a reason cells undergo mitosis?', options: ['To produce genetically varied offspring cells', 'Growth', 'Repair of damaged tissue', 'Replacement of worn-out cells'], correctIndex: 0, explanation: 'Mitosis produces genetically IDENTICAL cells, not varied ones — that is a feature of meiosis.', misconceptionId: 'mitosis-meiosis-confused' },
      { question: 'Does mitosis occur in plant root tips?', options: ['Yes, at the meristem', 'No, only in animals', 'Only in plant leaves', 'Never in plants'], correctIndex: 0, explanation: 'Root tip meristems are a classic example of active mitosis in plants.', misconceptionId: 'mitosis-only-in-animals' },
    ],
    confidenceCheckPrompt: 'How confident do you feel explaining why cells undergo mitosis?',
  },

  demonstrateChunk2: {
    explanation:
      'Mitosis proceeds through four visible stages: PROPHASE — chromosomes condense and become visible under a microscope, and the nuclear membrane begins to break down. METAPHASE — chromosomes line up along the CENTRE (equator) of the cell. ANAPHASE — sister chromatids are pulled APART toward OPPOSITE poles of the cell. TELOPHASE — two new nuclear membranes form around each separated set of chromosomes, and the cell begins to physically divide into two. The RESULT is two DAUGHTER CELLS, each GENETICALLY IDENTICAL to the original parent cell and to each other, with the SAME chromosome number — this is the significance of mitosis.',
    workedExamples: [
      { id: 'wx-identify-stage', prompt: 'A microscope image shows chromosomes lined up neatly along the middle of a cell, not yet separated. Which stage of mitosis is this?', steps: [
        { step: 'Chromosomes aligned at the centre (equator) of the cell, still as complete pairs, is the defining feature of metaphase.', justification: 'Metaphase is specifically identified by chromosomes lining up at the cell\'s centre.' },
      ], answer: 'Metaphase' },
      { id: 'wx-significance', prompt: 'Explain why it is important that mitosis produces genetically identical daughter cells with the same chromosome number.', steps: [
        { step: 'Body cells need to maintain the organism\'s correct genetic information and chromosome number for normal function.', justification: 'Identical daughter cells ensure the organism\'s genetic makeup stays consistent throughout its body.' },
        { step: 'If daughter cells were genetically different or had the wrong chromosome number, tissues could malfunction or develop abnormally.', justification: 'Consistent genetic content across all body cells supports normal, coordinated development and function.' },
      ], answer: 'It maintains the organism\'s correct genetic information and chromosome number in every body cell' },
    ],
    knowledgeChecks: [
      { question: 'In which stage of mitosis are sister chromatids pulled apart toward opposite poles?', options: ['Anaphase', 'Prophase', 'Metaphase', 'Telophase'], correctIndex: 0, explanation: 'Anaphase is defined by the separation of chromatids toward opposite poles.', misconceptionId: 'mitosis-stages-misidentified' },
      { question: 'After mitosis, are the two daughter cells identical to the parent cell, or a new cell type?', options: ['Genetically identical to the parent cell', 'A completely new, different cell type', 'Half identical, half different', 'Cannot be determined'], correctIndex: 0, explanation: 'Mitosis produces genetically identical copies, not new cell types.', misconceptionId: 'mitosis-creates-different-cells' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying mitosis stages and explaining its significance?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'identify-mitosis-stages', revealSteps: 1, prompt: 'A microscope image shows two new nuclear membranes forming around two separated groups of chromosomes, and the cell starting to pinch in the middle. Which stage is this?', steps: [
        { step: 'New nuclear membranes forming around separated chromosome groups, with the cell beginning to divide, is the defining feature of telophase.', justification: 'Telophase is identified by reformation of nuclear membranes and the start of physical cell division.' },
      ], answer: 'Telophase' },
      { id: 'fp-partial-1', objectiveId: 'explain-reasons-for-mitosis', revealSteps: 1, prompt: 'Explain, using mitosis, why your blood cell count returns to normal after donating blood.', steps: [
        { step: 'Blood-forming cells in bone marrow divide by mitosis to replace the lost blood cells.', justification: 'Mitosis replaces cells lost from the body, restoring normal numbers.' },
        { step: 'Each new cell produced is genetically identical to the originals, maintaining normal blood cell function.', justification: 'Mitosis produces identical copies, so replacement cells function the same as the ones lost.' },
      ], answer: 'Mitosis in bone marrow replaces lost blood cells with identical new ones' },
      { id: 'fp-independent-1', objectiveId: 'explain-significance-of-mitosis', revealSteps: 0, prompt: 'In one sentence, explain why mitosis must produce daughter cells with the SAME chromosome number as the parent cell.', steps: [
        { step: 'Keeping the same chromosome number ensures every body cell has the complete, correct set of genetic instructions needed for normal function.', justification: 'A changed chromosome number in body cells would disrupt normal genetic function and development.' },
      ], answer: 'To ensure every body cell has the complete, correct genetic information' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'explain-reasons-for-mitosis', question: 'Which of these is a correct reason for mitosis occurring?', options: ['Replacing worn-out skin cells', 'Producing genetically varied gametes', 'Halving the chromosome number', 'Creating a new species'], correctIndex: 0, hints: { strategic: 'Think about growth, repair, and replacement.', procedural: 'Replacing worn-out cells is a core reason for mitosis.', workedStep: 'Replacing worn-out skin cells.' }, distractorMisconceptions: { 1: 'mitosis-meiosis-confused' } },
      { id: 'ip-2', objectiveId: 'identify-mitosis-stages', question: 'A cell shows condensing, visible chromosomes and a breaking-down nuclear membrane, but chromosomes are not yet aligned. Which stage is this?', options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], correctIndex: 0, hints: { strategic: 'This is the earliest visible stage.', procedural: 'Condensing chromosomes and breakdown of the nuclear membrane mark prophase.', workedStep: 'Prophase.' }, distractorMisconceptions: { 1: 'mitosis-stages-misidentified' } },
      { id: 'ip-3', objectiveId: 'explain-significance-of-mitosis', question: 'Two cells result from mitosis of a skin cell. What should be true of these two new cells?', options: ['They are genetically identical to each other and the original', 'They are genetically different from each other', 'One is a skin cell, the other is a different cell type', 'They have half the chromosome number'], correctIndex: 0, hints: { strategic: 'Think about what mitosis is designed to preserve.', procedural: 'Mitosis produces identical copies with the same chromosome number.', workedStep: 'Genetically identical.' }, distractorMisconceptions: { 1: 'mitosis-creates-different-cells' } },
      { id: 'ip-4', objectiveId: 'explain-reasons-for-mitosis', question: 'Onion root tip cells are commonly used to study mitosis. What does this show about mitosis?', options: ['It occurs in plants, not just animals', 'It only occurs in onions', 'It cannot occur in plants', 'Mitosis is exclusive to root cells'], correctIndex: 0, hints: { strategic: 'Onions are plants.', procedural: 'This confirms mitosis occurs in plant cells too.', workedStep: 'It occurs in plants, not just animals.' }, distractorMisconceptions: { 1: 'mitosis-only-in-animals' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'explain-reasons-for-mitosis', multiSelect: false, question: 'True or false: mitosis is used by the body to repair damaged tissue.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — repair is one of the three main reasons for mitosis.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'explain-reasons-for-mitosis', multiSelect: false, question: 'Which of these is NOT a purpose of mitosis?', options: ['Producing genetically varied gametes', 'Growth', 'Repair', 'Replacement of worn-out cells'], correctIndices: [0], explanation: 'Genetic variation and gamete production are functions of meiosis, not mitosis.', distractorMisconceptions: { 1: 'mitosis-meiosis-confused' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'identify-mitosis-stages', multiSelect: false, question: 'Chromosomes are lined up at the centre of the cell. Which stage is this?', options: ['Metaphase', 'Prophase', 'Anaphase', 'Telophase'], correctIndices: [0], explanation: 'Metaphase is defined by chromosome alignment at the cell\'s equator.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'identify-mitosis-stages', multiSelect: false, question: 'Sister chromatids are being pulled toward opposite poles of the cell. Which stage is this?', options: ['Anaphase', 'Metaphase', 'Prophase', 'Telophase'], correctIndices: [0], explanation: 'Anaphase is defined by chromatid separation toward opposite poles.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'identify-mitosis-stages', multiSelect: false, question: 'True or false: telophase is identified by chromosomes first becoming visible and condensing.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — that describes prophase; telophase involves new nuclear membranes reforming.', distractorMisconceptions: { 0: 'mitosis-stages-misidentified' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'explain-significance-of-mitosis', multiSelect: false, question: 'What is true about the two daughter cells produced by mitosis?', options: ['Genetically identical to the parent cell', 'Genetically different from the parent cell', 'Half the chromosome number of the parent', 'A completely different cell type'], correctIndices: [0], explanation: 'Mitosis preserves genetic identity and chromosome number.', distractorMisconceptions: { 1: 'mitosis-creates-different-cells' } },
    { id: 'q7', type: 'true-false', objectiveId: 'explain-reasons-for-mitosis', multiSelect: false, question: 'True or false: mitosis occurs only in animal cells, never in plant cells.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — mitosis occurs in plant meristems (root/shoot tips) as well as animal cells.', distractorMisconceptions: { 0: 'mitosis-only-in-animals' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-mitosis-stages', multiSelect: true, question: 'Which of these are stages of mitosis? (select all that apply)', options: ['Prophase', 'Metaphase', 'Fertilisation', 'Anaphase'], correctIndices: [0, 1, 3], explanation: 'Prophase, metaphase, and anaphase are mitosis stages; fertilisation is unrelated to mitosis.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'identify-mitosis-stages',
      analogy: 'Think of mitosis like organising and splitting a stack of important documents into two identical copies: PROPHASE is gathering and unfolding the documents (chromosomes condensing, becoming visible). METAPHASE is lining them up neatly on a table (aligned at the centre). ANAPHASE is splitting the pile and moving each half to opposite ends of the room (chromatids separating to poles). TELOPHASE is putting each half into its own new folder (new nuclear membranes forming).',
      explanation: 'To identify a mitosis stage: (1) check if chromosomes are just becoming visible and the nuclear membrane is breaking down (prophase), (2) check if chromosomes are aligned at the cell\'s centre (metaphase), (3) check if chromatids are visibly moving apart toward opposite ends (anaphase), (4) check if two new nuclear membranes are forming around separated chromosome groups (telophase).',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A cell shows chromosomes just starting to condense and become visible, with the nuclear membrane starting to disappear. Which stage is this?', steps: [
          { step: 'Condensing, newly visible chromosomes and a disappearing nuclear membrane are the defining features of the earliest mitosis stage.', justification: 'This combination of features uniquely identifies prophase.' },
        ], answer: 'Prophase' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'identify-mitosis-stages', question: 'A cell shows two new nuclear membranes forming around separated chromosome groups. Which stage is this?', options: ['Telophase', 'Prophase', 'Metaphase', 'Anaphase'], correctIndex: 0, hints: { strategic: 'Nuclear membranes are reforming.', procedural: 'This is the final stage, telophase.', workedStep: 'Telophase.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'identify-mitosis-stages', question: 'A cell shows chromosomes aligned neatly in a single row at the cell\'s centre. Which stage is this?', options: ['Metaphase', 'Prophase', 'Anaphase', 'Telophase'], correctIndex: 0, hints: { strategic: 'Chromosomes are lined up at the centre.', procedural: 'This defines metaphase.', workedStep: 'Metaphase.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'identify-mitosis-stages', question: 'A cell shows chromatids clearly separated and moving toward opposite ends of the cell. Which stage is this?', options: ['Anaphase', 'Prophase', 'Metaphase', 'Telophase'], correctIndex: 0, hints: { strategic: 'Chromatids are actively separating.', procedural: 'This defines anaphase.', workedStep: 'Anaphase.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is it important that mitosis produces genetically identical cells, rather than varied ones?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel identifying the stages of mitosis now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the correct order of the four stages of mitosis?', type: 'multiple-choice', options: ['Prophase, metaphase, anaphase, telophase', 'Metaphase, prophase, telophase, anaphase', 'Anaphase, telophase, prophase, metaphase', 'Telophase, anaphase, metaphase, prophase'] },
  ],
};
