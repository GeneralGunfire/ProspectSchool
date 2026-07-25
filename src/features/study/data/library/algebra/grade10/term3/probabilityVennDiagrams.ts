// ── Term 3, Topic 3: Probability Basics & Venn Diagrams ───────────────────────
// First use of the new VennDiagram component. Per
// .planning/research/LIBRARY_ALGEBRA_TERM3_4_RESEARCH.md, deliberately
// designed to surface the representativeness heuristic in feedback.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'probability-outside-0-1',
    label: 'Giving a probability outside the range 0 to 1',
    errorType: 'You calculated or stated a probability less than 0 or greater than 1.',
    principle: 'Probability is always a value between 0 (impossible) and 1 (certain), inclusive. If your calculation gives something outside this range, you\'ve made an error somewhere.',
    correctStep: 'P(event) = 0.7 is valid; a result like 1.3 or -0.2 signals a calculation mistake.',
  },
  {
    id: 'representativeness-heuristic',
    label: 'Believing a "more typical-looking" outcome is more likely than an equally probable "unusual-looking" one',
    errorType: 'You judged an outcome as more or less likely based on how "random" or "typical" it looked, rather than actual probability.',
    principle: 'For genuinely random, independent events, every specific outcome sequence with the same structure has EQUAL probability — a sequence that "looks patterned" (like HHHHHH) is exactly as likely as one that "looks random" (like HTHTTH), for the same number of flips.',
    correctStep: 'Flipping a fair coin 6 times: P(HHHHHH) = P(HTHTTH) = (1/2)⁶ — both specific sequences are equally likely, even though one looks more "random".',
  },
  {
    id: 'gamblers-fallacy',
    label: 'Believing past independent outcomes affect future probability (gambler\'s fallacy)',
    errorType: 'You assumed that because an outcome hasn\'t occurred in a while, it becomes "due" to happen.',
    principle: 'For independent events (like coin flips or dice rolls), each trial is unaffected by previous ones — the probability resets each time. A coin has no "memory" of previous flips.',
    correctStep: 'After 5 heads in a row, P(heads on the next flip) is still exactly 0.5 — not higher or lower.',
  },
  {
    id: 'venn-region-confusion',
    label: 'Confusing which region of a Venn diagram represents which combination',
    errorType: 'You shaded or read the wrong region for an intersection, union, or complement.',
    principle: 'The INTERSECTION (A∩B) is the overlapping middle region — elements in BOTH sets. The UNION (A∪B) is everything in EITHER set — the whole shaded area of both circles combined. The COMPLEMENT (not A) is everything OUTSIDE circle A, including outside both circles entirely.',
    correctStep: 'A∩B is only the overlap; A∪B is both circles entirely (overlap counted once); "not A" is everything except circle A.',
  },
  {
    id: 'double-counting-union',
    label: 'Double-counting the overlap when calculating a union',
    errorType: 'You added the sizes of two sets without subtracting their overlap, over-counting the intersection.',
    principle: 'For the union: P(A∪B) = P(A) + P(B) - P(A∩B). Without subtracting the overlap, elements in both sets get counted twice.',
    correctStep: 'If 15 students like maths, 12 like science, and 5 like both: P(maths or science) count = 15+12-5 = 22, not 27.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 3,
  topicId: 'probability-venn-diagrams',
  topicName: 'Probability Basics & Venn Diagrams',
  prerequisites: [
    'Working with fractions and simple ratios',
    'Basic set language (informal)',
  ],
  objectives: [
    { id: 'calculate-basic-probability', text: 'Calculate the probability of a single event as a fraction, decimal, or percentage.' },
    { id: 'understand-independence', text: 'Explain why independent events are unaffected by previous outcomes.' },
    { id: 'read-venn-diagrams', text: 'Read and interpret a two-set Venn diagram, including intersection, union, and complement.' },
    { id: 'calculate-union-probability', text: 'Calculate the probability of a union of two events, accounting for overlap.' },
  ],
  estimatedMinutes: [20, 30],
};

export const probabilityVennDiagrams: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Does a coin remember what it just landed on?',
  goalSettingPrompt:
    'Probability quantifies how likely something is — but our intuition about randomness is often wrong. By the end of this lesson you\'ll be able to calculate probabilities correctly and use Venn diagrams to organise combined events, while avoiding two very common thinking traps.',

  activate: {
    connectPrompt: 'You already know how to work with fractions — probability is just a fraction describing likelihood.',
    diagnosticQuestions: [
      { question: 'Simplify 6/12.', options: ['1/2', '2/3', '1/3', '6/12 cannot be simplified'], correctIndex: 0, explanation: '6/12 = 1/2.' },
      { question: 'If a bag has 3 red and 7 blue balls, what fraction is red?', options: ['3/10', '3/7', '7/10', '10/3'], correctIndex: 0, explanation: 'Total balls = 10, red = 3, so 3/10.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Probability = (number of favourable outcomes) / (total number of possible outcomes), always a value between 0 (impossible) and 1 (certain). For INDEPENDENT events (like separate coin flips or dice rolls), each trial is completely unaffected by previous ones — there is no "memory," so a run of the same outcome doesn\'t make the opposite outcome more likely next time (the gambler\'s fallacy). Similarly, every specific sequence of outcomes with the same length is EQUALLY likely, even if one "looks" more random than another (the representativeness heuristic is a trap here).',
    workedExamples: [
      { id: 'wx-basic-probability', prompt: 'A bag has 4 red, 3 blue, and 3 green marbles. Find P(blue).', steps: [
        { step: 'Total marbles = 4+3+3 = 10.', justification: 'Count all possible outcomes.' },
        { step: 'P(blue) = 3/10 (favourable outcomes ÷ total).', justification: 'Apply the probability formula.' },
      ], answer: 'P(blue) = 3/10 = 0.3' },
      { id: 'wx-independence', prompt: 'A fair coin has landed on heads 4 times in a row. What is P(heads) on the next flip?', steps: [
        { step: 'Each flip is an independent event — the coin has no memory of previous flips.', justification: 'Independence means past outcomes don\'t affect future probability.' },
        { step: 'P(heads) is still exactly 0.5, regardless of the previous 4 flips.', justification: 'The probability resets each independent trial.' },
      ], answer: 'P(heads) = 0.5 (unchanged)' },
    ],
    knowledgeChecks: [
      { question: 'After rolling a die and getting 6 three times in a row, what is P(6) on the next roll?', options: ['1/6 (unchanged)', 'Less than 1/6, since 6 is "due" to stop', 'Greater than 1/6, since 6 is "on a streak"', 'Cannot be determined'], correctIndex: 0, explanation: 'Each roll is independent — previous outcomes don\'t change the probability.', misconceptionId: 'gamblers-fallacy' },
      { question: 'Flipping a coin 4 times, which is more likely: HHHH or HTHT?', options: ['They are equally likely', 'HTHT is more likely, it looks more random', 'HHHH is more likely', 'Cannot be compared'], correctIndex: 0, explanation: 'Every specific sequence of 4 flips has the same probability, (1/2)⁴ — "looking random" doesn\'t make a sequence more probable.', misconceptionId: 'representativeness-heuristic' },
    ],
    confidenceCheckPrompt: 'How confident do you feel calculating basic probabilities and understanding independence?',
  },

  demonstrateChunk2: {
    explanation:
      'A VENN DIAGRAM organises two (or more) sets visually. The INTERSECTION (A∩B) is the overlapping middle region — elements in BOTH sets. The UNION (A∪B) is everything in EITHER set — both circles combined, counting any overlap only once. The COMPLEMENT of A (written A\' or "not A") is everything OUTSIDE circle A. When calculating a union\'s probability, you must SUBTRACT the overlap to avoid double-counting: P(A∪B) = P(A) + P(B) - P(A∩B).',
    workedExamples: [
      { id: 'wx-venn-basic', prompt: 'In a class of 30, 18 play soccer, 12 play cricket, and 6 play both. How many play neither?', steps: [
        { step: 'Union (soccer or cricket) = 18 + 12 - 6 = 24 (subtracting the double-counted overlap).', justification: 'Apply the union formula to avoid double-counting the 6 who play both.' },
        { step: 'Neither = total - union = 30 - 24 = 6.', justification: 'Everyone not in the union plays neither sport.' },
      ], answer: '6 students play neither sport', venn: {
        labelA: 'Soccer', labelB: 'Cricket',
        counts: { onlyA: 12, onlyB: 6, both: 6, neither: 6 },
      } },
      { id: 'wx-venn-union-formula', prompt: 'P(A)=0.5, P(B)=0.4, P(A∩B)=0.2. Find P(A∪B).', steps: [
        { step: 'P(A∪B) = P(A) + P(B) - P(A∩B) = 0.5 + 0.4 - 0.2.', justification: 'Apply the union formula directly.' },
      ], answer: 'P(A∪B) = 0.7', venn: {
        labelA: 'A', labelB: 'B', highlight: 'union',
      } },
    ],
    knowledgeChecks: [
      { question: 'On a Venn diagram, what does the overlapping region between two circles represent?', options: ['The intersection (both A and B)', 'The union (A or B)', 'The complement of A', 'Neither A nor B'], correctIndex: 0, explanation: 'The overlap is the intersection — elements in both sets.', misconceptionId: 'venn-region-confusion' },
      { question: '20 like tea, 15 like coffee, 8 like both. What is P(tea or coffee) as a count, out of a class of 30?', options: ['27 (20+15-8)', '35', '20', '15'], correctIndex: 0, explanation: '20+15-8=27 — subtracting the overlap avoids double-counting.', misconceptionId: 'double-counting-union' },
    ],
    confidenceCheckPrompt: 'How confident do you feel reading Venn diagrams and calculating union probabilities correctly?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'calculate-basic-probability', revealSteps: 1, prompt: 'A spinner has 8 equal sections: 3 red, 2 blue, 3 green. Find P(green).', steps: [
        { step: 'P(green) = 3/8 (favourable ÷ total).', justification: 'Apply the probability formula.' },
      ], answer: 'P(green) = 3/8' },
      { id: 'fp-partial-1', objectiveId: 'read-venn-diagrams', revealSteps: 1, prompt: 'In a survey of 40 people, 22 like pizza, 18 like burgers, 10 like both. How many like neither?', steps: [
        { step: 'Union = 22+18-10 = 30.', justification: 'Union formula.' },
        { step: 'Neither = 40-30 = 10.', justification: 'Subtract union from total.' },
      ], answer: '10 people like neither', venn: { labelA: 'Pizza', labelB: 'Burgers', counts: { onlyA: 12, onlyB: 8, both: 10, neither: 10 } } },
      { id: 'fp-independent-1', objectiveId: 'calculate-union-probability', revealSteps: 0, prompt: 'P(A)=0.6, P(B)=0.3, P(A∩B)=0.1. Find P(A∪B).', steps: [
        { step: 'P(A∪B) = 0.6+0.3-0.1 = 0.8.', justification: 'Union formula.' },
      ], answer: 'P(A∪B) = 0.8' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'calculate-basic-probability', question: 'A bag has 5 yellow and 15 other balls (20 total). Find P(yellow).', options: ['0.25', '0.75', '5', '0.05'], correctIndex: 0, hints: { strategic: 'P = favourable/total.', procedural: '5/20', workedStep: '= 0.25.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'understand-independence', question: 'A roulette wheel has landed on red 8 times in a row. What is P(red) on the next spin (assume P(red)=0.47 normally)?', options: ['Still 0.47', 'Higher than 0.47', 'Lower than 0.47', 'Exactly 0 or 1'], correctIndex: 0, hints: { strategic: 'Is each spin independent?', procedural: 'Yes — no memory of past spins.', workedStep: 'Still 0.47.' }, distractorMisconceptions: { 2: 'gamblers-fallacy' } },
      { id: 'ip-3', objectiveId: 'read-venn-diagrams', question: 'On a Venn diagram, what represents "not in A"?', options: ['Everything outside circle A', 'Only the overlap', 'Everything outside both circles', 'Circle A entirely'], correctIndex: 0, hints: { strategic: 'The complement of A excludes only circle A.', procedural: 'It still includes circle B\'s non-overlapping part, and outside both.', workedStep: 'Everything outside circle A.' }, distractorMisconceptions: { 0: 'venn-region-confusion' } },
      { id: 'ip-4', objectiveId: 'calculate-union-probability', question: '25 like reading, 20 like gaming, 12 like both, out of 50 people. How many like neither?', options: ['17', '20', '33', '5'], correctIndex: 0, hints: { strategic: 'Union = 25+20-12. Neither = total - union.', procedural: 'Union = 33.', workedStep: '50-33 = 17.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'calculate-basic-probability', multiSelect: false, question: 'True or false: a probability of 1.2 is a valid result.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — probability must be between 0 and 1.', distractorMisconceptions: { 0: 'probability-outside-0-1' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'calculate-basic-probability', multiSelect: false, question: 'A bag has 6 green and 14 other balls (20 total). Find P(green).', options: ['0.3', '0.7', '6', '0.6'], correctIndices: [0], explanation: '6/20 = 0.3.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'understand-independence', multiSelect: false, question: 'True or false: if a die hasn\'t shown a 6 in 20 rolls, a 6 becomes more likely on the next roll.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — this is the gambler\'s fallacy. Each roll is independent; P(6) stays 1/6.', distractorMisconceptions: { 0: 'gamblers-fallacy' } },
    { id: 'q4', type: 'true-false', objectiveId: 'understand-independence', multiSelect: false, question: 'True or false: for 5 coin flips, HHHHH is less likely than HTHTH.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — both specific sequences have equal probability, (1/2)⁵.', distractorMisconceptions: { 0: 'representativeness-heuristic' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'read-venn-diagrams', multiSelect: false, question: 'On a Venn diagram, what does the region inside BOTH circles represent?', options: ['A∩B (intersection)', 'A∪B (union)', 'Complement of A', 'Neither A nor B'], correctIndices: [0], explanation: 'The overlap is the intersection.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'calculate-union-probability', multiSelect: false, question: 'P(A)=0.45, P(B)=0.35, P(A∩B)=0.15. Find P(A∪B).', options: ['0.65', '0.80', '0.95', '0.50'], correctIndices: [0], explanation: '0.45+0.35-0.15 = 0.65.', distractorMisconceptions: { 1: 'double-counting-union' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'calculate-union-probability', multiSelect: false, question: 'In a class of 35, 20 like art, 15 like music, 5 like both. How many like neither?', options: ['5', '10', '30', '0'], correctIndices: [0], explanation: 'Union = 20+15-5=30. Neither = 35-30=5.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'read-venn-diagrams', multiSelect: true, question: 'Which statements about Venn diagrams are correct? (select all that apply)', options: ['The union includes the intersection, counted once', 'The intersection is a subset of the union', 'The complement of A can include parts of B', 'The union is always smaller than either individual set'], correctIndices: [0, 1, 2], explanation: 'Union counts overlap once; intersection is within the union; "not A" can include the parts of B outside A. The union is never smaller than either individual set.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'calculate-union-probability',
      analogy: 'Think of counting people at two overlapping parties: if you count everyone at Party A, then everyone at Party B, anyone who went to BOTH gets counted twice — you have to subtract them once to get the true total number of different people.',
      explanation: 'The union formula P(A∪B) = P(A) + P(B) - P(A∩B) exists specifically to correct this double-counting of the overlap.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: '30 like football, 22 like basketball, 14 like both, out of 50 people. How many like at least one?', steps: [
          { step: 'Union = 30 + 22 - 14 = 38.', justification: 'Subtract the double-counted overlap.' },
        ], answer: '38 people like at least one sport' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'calculate-union-probability', question: '18 like dogs, 14 like cats, 6 like both. How many like at least one?', options: ['26', '32', '20', '8'], correctIndex: 0, hints: { strategic: 'Union = A+B-both.', procedural: '18+14-6', workedStep: '= 26.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'calculate-union-probability', question: 'P(A)=0.55, P(B)=0.4, P(A∩B)=0.25. Find P(A∪B).', options: ['0.70', '0.95', '0.15', '0.85'], correctIndex: 0, hints: { strategic: 'Union = A+B-intersection.', procedural: '0.55+0.4-0.25', workedStep: '= 0.70.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'calculate-union-probability', question: '12 like chess, 9 like checkers, 3 like both, out of 25. How many like neither?', options: ['7', '18', '3', '10'], correctIndex: 0, hints: { strategic: 'Union first, then subtract from total.', procedural: 'Union=12+9-3=18.', workedStep: '25-18=7.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why doesn\'t a coin "remember" its previous flips?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with probability and Venn diagrams now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Which trap do you think you\'re more likely to fall into: the gambler\'s fallacy, or double-counting a union?', type: 'multiple-choice', options: ['Gambler\'s fallacy', 'Double-counting a union', 'Neither', 'Both'] },
  ],
};
