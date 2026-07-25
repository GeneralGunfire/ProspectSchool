// ── Term 3, Topic 4: Tree Diagrams & Combined Events ──────────────────────────
// First use of the new TreeDiagram component. Builds on T3.3's independence
// concept, extending to sequential/combined events with and without
// replacement.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'add-instead-of-multiply-path',
    label: 'Adding branch probabilities along a path instead of multiplying',
    errorType: 'You added the probabilities along a single path through the tree, instead of multiplying them.',
    principle: 'To find the probability of a SPECIFIC PATH through a tree diagram (one specific sequence of outcomes), MULTIPLY the probabilities along that path — addition is used for combining separate, alternative paths, not steps within the same path.',
    correctStep: 'P(first red AND then blue) = P(red) × P(blue | after red), not P(red) + P(blue).',
  },
  {
    id: 'without-replacement-probabilities-unchanged',
    label: 'Not adjusting probabilities for the second draw when sampling without replacement',
    errorType: 'You used the same probabilities for the second stage as the first, even though an item was removed and not replaced.',
    principle: 'When sampling WITHOUT replacement, removing an item changes both the total count and the count of that type remaining — the probabilities at the second stage must be recalculated based on what\'s left.',
    correctStep: 'A bag has 5 red, 3 blue (8 total). Without replacement, after drawing one red: 4 red, 3 blue remain (7 total) — the second-draw probabilities change.',
  },
  {
    id: 'branches-dont-sum-to-one',
    label: 'Not checking that probabilities from a single node sum to 1',
    errorType: 'You labelled the branches from a single node with probabilities that don\'t add up to 1.',
    principle: 'At any single point in a tree diagram, the probabilities of ALL possible outcomes from that point must sum to exactly 1 — since something must happen.',
    correctStep: 'If P(red)=0.4 and P(blue)=0.6 are the only two options from a node, they correctly sum to 1.',
  },
  {
    id: 'combining-paths-wrong-operation',
    label: 'Multiplying instead of adding when combining multiple separate paths',
    errorType: 'You multiplied the probabilities of two different paths that both lead to the desired outcome, instead of adding them.',
    principle: 'When a desired outcome can happen via MULTIPLE DIFFERENT paths through the tree, ADD the probabilities of those separate paths together (after multiplying along each individual path first).',
    correctStep: 'P(exactly one head in 2 flips) = P(HT) + P(TH) = (0.5×0.5) + (0.5×0.5) = 0.25+0.25 = 0.5.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 3,
  topicId: 'tree-diagrams-combined-events',
  topicName: 'Tree Diagrams & Combined Events',
  prerequisites: [
    'Basic probability and independence (this term, Topic 3)',
  ],
  objectives: [
    { id: 'construct-tree-diagram', text: 'Construct a tree diagram for a sequence of two events.' },
    { id: 'calculate-path-probability', text: 'Calculate the probability of a specific path through a tree diagram by multiplying along the branches.' },
    { id: 'with-without-replacement', text: 'Distinguish between sampling with and without replacement, and adjust probabilities accordingly.' },
    { id: 'combine-multiple-paths', text: 'Calculate the probability of an outcome reachable via multiple different paths, by adding path probabilities.' },
  ],
  estimatedMinutes: [20, 30],
};

export const treeDiagramsCombinedEvents: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How do probabilities combine across a sequence of events?',
  goalSettingPrompt:
    'You already know how to find the probability of a single event. A tree diagram extends this to a SEQUENCE of events — showing every possible combination, and how to calculate each one\'s probability. By the end of this lesson you\'ll be able to build and use tree diagrams confidently.',

  activate: {
    connectPrompt: 'You already know how to calculate a single event\'s probability. Let\'s check that before combining multiple events.',
    diagnosticQuestions: [
      { question: 'A bag has 4 red and 6 blue balls. Find P(red).', options: ['0.4', '0.6', '4', '0.24'], correctIndex: 0, explanation: '4/10 = 0.4.' },
      { question: 'Are separate coin flips independent events?', options: ['Yes', 'No', 'Only sometimes', 'Cannot be determined'], correctIndex: 0, explanation: 'Each flip is unaffected by previous ones — independent.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A tree diagram shows every possible outcome of a SEQUENCE of events as branching paths. Each branch is labelled with its probability. To find the probability of one SPECIFIC path (a full sequence of outcomes), MULTIPLY the probabilities along that path — this is because each step\'s probability applies "given that" the previous step already happened. At any single branching point, all the branches\' probabilities must sum to exactly 1.',
    workedExamples: [
      { id: 'wx-tree-basic', prompt: 'A coin is flipped twice. Find P(Heads then Heads).', steps: [
        { step: 'P(Heads on 1st flip) = 0.5.', justification: 'Basic single-event probability.' },
        { step: 'P(Heads on 2nd flip) = 0.5, unaffected by the first flip (independence).', justification: 'Each flip is independent.' },
        { step: 'P(H then H) = 0.5 × 0.5 = 0.25.', justification: 'Multiply along the path.' },
      ], answer: 'P(H,H) = 0.25', tree: {
        root: { label: 'Start', probability: 1, children: [
          { label: 'H', probability: 0.5, children: [
            { label: 'H', probability: 0.5 },
            { label: 'T', probability: 0.5 },
          ] },
          { label: 'T', probability: 0.5, children: [
            { label: 'H', probability: 0.5 },
            { label: 'T', probability: 0.5 },
          ] },
        ] },
      } },
    ],
    knowledgeChecks: [
      { question: 'For a two-flip tree, what should you do to find P(Heads then Tails)?', options: ['Multiply the two branch probabilities', 'Add the two branch probabilities', 'Subtract them', 'Use only the first branch\'s probability'], correctIndex: 0, explanation: 'Multiply along the path: P(H) × P(T).', misconceptionId: 'add-instead-of-multiply-path' },
      { question: 'At a branching point, three outcomes have probabilities 0.2, 0.5, and 0.3. Do these sum correctly?', options: ['Yes, they sum to 1', 'No, they should sum to 0', 'No, they should sum to 2', 'Cannot be determined'], correctIndex: 0, explanation: '0.2+0.5+0.3=1 — correct, since all possibilities from one point must sum to 1.', misconceptionId: 'branches-dont-sum-to-one' },
    ],
    confidenceCheckPrompt: 'How confident do you feel constructing a tree diagram and calculating a single path\'s probability?',
  },

  demonstrateChunk2: {
    explanation:
      'When sampling WITHOUT replacement (an item is removed and not put back), the SECOND stage\'s probabilities must be recalculated based on what remains — both the total and the specific count change. When an outcome can be reached via MULTIPLE DIFFERENT paths through the tree, first multiply along each individual path, then ADD those path probabilities together to get the combined probability.',
    workedExamples: [
      { id: 'wx-without-replacement', prompt: 'A bag has 5 red and 3 blue balls (8 total). Two balls are drawn WITHOUT replacement. Find P(red, then red).', steps: [
        { step: 'P(1st red) = 5/8.', justification: 'Standard first-draw probability.' },
        { step: 'After removing one red: 4 red, 3 blue remain, 7 total. P(2nd red) = 4/7.', justification: 'Without replacement, both the red count and total change.' },
        { step: 'P(red, red) = 5/8 × 4/7 = 20/56 = 5/14.', justification: 'Multiply along the path, using the ADJUSTED second probability.' },
      ], answer: 'P(red,red) = 5/14', tree: {
        root: { label: 'Start', probability: 1, children: [
          { label: 'Red (5/8)', probability: 5 / 8, children: [
            { label: 'Red (4/7)', probability: 4 / 7 },
            { label: 'Blue (3/7)', probability: 3 / 7 },
          ] },
          { label: 'Blue (3/8)', probability: 3 / 8, children: [
            { label: 'Red (5/7)', probability: 5 / 7 },
            { label: 'Blue (2/7)', probability: 2 / 7 },
          ] },
        ] },
      } },
      { id: 'wx-combine-paths', prompt: 'Two coins are flipped. Find P(exactly one head).', steps: [
        { step: '"Exactly one head" happens via TWO different paths: (Heads,Tails) OR (Tails,Heads).', justification: 'Identify all paths leading to the desired outcome.' },
        { step: 'P(H,T) = 0.5×0.5 = 0.25. P(T,H) = 0.5×0.5 = 0.25.', justification: 'Multiply along each individual path first.' },
        { step: 'P(exactly one head) = 0.25 + 0.25 = 0.5.', justification: 'Add the separate path probabilities together.' },
      ], answer: 'P(exactly one head) = 0.5' },
    ],
    knowledgeChecks: [
      { question: 'A bag has 6 green, 4 yellow (10 total). Drawing WITHOUT replacement, after one green is removed, what is P(green) on the second draw?', options: ['5/9', '6/10', '6/9', '5/10'], correctIndex: 0, explanation: 'After removing one green: 5 green, 9 total remain.', misconceptionId: 'without-replacement-probabilities-unchanged' },
      { question: 'To find P("at least one head" in 2 flips), which paths lead to this outcome?', options: ['HH, HT, and TH (add all three)', 'Only HH', 'HT only', 'All four possible outcomes'], correctIndex: 0, explanation: 'HH, HT, and TH all contain at least one head — their probabilities are added together.', misconceptionId: 'combining-paths-wrong-operation' },
    ],
    confidenceCheckPrompt: 'How confident do you feel handling without-replacement scenarios and combining multiple paths?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'calculate-path-probability', revealSteps: 1, prompt: 'A die is rolled twice. Find P(6, then 6).', steps: [
        { step: 'P(6,6) = 1/6 × 1/6 = 1/36.', justification: 'Multiply along the path, both draws independent.' },
      ], answer: 'P(6,6) = 1/36' },
      { id: 'fp-partial-1', objectiveId: 'with-without-replacement', revealSteps: 1, prompt: 'A bag has 4 white, 6 black (10 total). Two drawn without replacement. Find P(white, then white).', steps: [
        { step: 'P(1st white) = 4/10.', justification: 'First draw.' },
        { step: 'After removing one white: 3 white, 9 total. P(2nd white) = 3/9.', justification: 'Adjust for removal.' },
      ], answer: 'P(white,white) = 4/10 × 3/9 = 12/90 = 2/15' },
      { id: 'fp-independent-1', objectiveId: 'combine-multiple-paths', revealSteps: 0, prompt: 'A coin is flipped 3 times. Find P(exactly 2 heads).', steps: [
        { step: 'Paths with exactly 2 heads: HHT, HTH, THH — each has probability (0.5)³=0.125.', justification: 'Identify all qualifying paths.' },
        { step: 'P(exactly 2 heads) = 0.125+0.125+0.125 = 0.375.', justification: 'Add the three path probabilities.' },
      ], answer: 'P(exactly 2 heads) = 0.375' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'calculate-path-probability', question: 'A spinner (P(red)=0.3) is spun twice. Find P(red, then red).', options: ['0.09', '0.6', '0.3', '0.15'], correctIndex: 0, hints: { strategic: 'Multiply along the path.', procedural: '0.3 × 0.3', workedStep: '= 0.09.' }, distractorMisconceptions: { 1: 'add-instead-of-multiply-path' } },
      { id: 'ip-2', objectiveId: 'with-without-replacement', question: 'A bag has 7 red, 3 blue (10 total). Without replacement, find P(2nd is blue | 1st was blue).', options: ['2/9', '3/9', '3/10', '2/10'], correctIndex: 0, hints: { strategic: 'After removing one blue, how many blue and total remain?', procedural: '2 blue, 9 total remain.', workedStep: '2/9.' }, distractorMisconceptions: { 1: 'without-replacement-probabilities-unchanged' } },
      { id: 'ip-3', objectiveId: 'combine-multiple-paths', question: 'Two dice are rolled. Find P(sum is either 2 different specific single-path outcomes: (1,6) or (6,1)) treating order as distinct.', options: ['Add P(1,6) and P(6,1)', 'Multiply P(1,6) and P(6,1)', 'Just use P(1,6) alone', 'Subtract them'], correctIndex: 0, hints: { strategic: 'Two separate distinct paths leading to a similar sum — combine how?', procedural: 'Add the separate path probabilities.', workedStep: 'Add P(1,6) and P(6,1).' }, distractorMisconceptions: { 1: 'combining-paths-wrong-operation' } },
      { id: 'ip-4', objectiveId: 'construct-tree-diagram', question: 'At one branching point, two outcomes have probabilities 0.65 and 0.35. Do they correctly sum to 1?', options: ['Yes', 'No', 'Only if independent', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'Add them and check.', procedural: '0.65+0.35', workedStep: '=1, correct.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'calculate-path-probability', multiSelect: false, question: 'A coin is flipped twice. Find P(Tails, then Tails).', options: ['0.25', '0.5', '1', '0.75'], correctIndices: [0], explanation: '0.5×0.5=0.25.', distractorMisconceptions: { 1: 'add-instead-of-multiply-path' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'calculate-path-probability', multiSelect: false, question: 'A die is rolled twice. Find P(even, then even) (P(even)=0.5 each roll).', options: ['0.25', '1', '0.5', '0.75'], correctIndices: [0], explanation: '0.5×0.5=0.25.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'with-without-replacement', multiSelect: false, question: 'A bag has 5 blue, 5 red (10 total). Without replacement, after 1 blue removed, find P(2nd is blue).', options: ['4/9', '5/9', '5/10', '4/10'], correctIndices: [0], explanation: '4 blue, 9 total remain.', distractorMisconceptions: { 1: 'without-replacement-probabilities-unchanged' } },
    { id: 'q4', type: 'true-false', objectiveId: 'with-without-replacement', multiSelect: false, question: 'True or false: sampling WITH replacement keeps the probabilities the same for every draw.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — with replacement, the item is returned, so counts (and probabilities) don\'t change.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'combine-multiple-paths', multiSelect: false, question: 'Two coins are flipped. Find P(at least one tail).', options: ['0.75', '0.5', '0.25', '1'], correctIndices: [0], explanation: 'P(at least one tail) = 1 - P(no tails) = 1 - P(HH) = 1 - 0.25 = 0.75.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'combine-multiple-paths', multiSelect: false, question: 'True or false: when an outcome can happen via two different paths, you add their probabilities after multiplying along each path.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — multiply within a path, add across separate paths.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'construct-tree-diagram', multiSelect: false, question: 'At a branching point, one outcome has probability 0.7. If there are only two possible outcomes, what is the other\'s probability?', options: ['0.3', '0.7', '1.7', '0'], correctIndices: [0], explanation: 'They must sum to 1: 1-0.7=0.3.', distractorMisconceptions: { 3: 'branches-dont-sum-to-one' } },
    { id: 'q8', type: 'decimal-discrimination', objectiveId: 'with-without-replacement', multiSelect: false, question: 'A bag has 8 marbles: 3 red, 5 blue. Without replacement, find P(red, then blue).', options: ['15/56', '3/8 + 5/7', '3/8 × 5/8', '15/64'], correctIndices: [0], explanation: 'P(1st red)=3/8. After removing red: 5 blue, 7 total, P(2nd blue)=5/7. 3/8 × 5/7 = 15/56.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'with-without-replacement',
      analogy: 'Think of "without replacement" like eating candies from a bag — once you eat one, it\'s gone, so the bag genuinely has fewer candies (and possibly fewer of that colour) for the next pick. "With replacement" is like putting the candy back after looking at it — the bag is exactly the same for the next pick.',
      explanation: 'For without-replacement problems: after each draw, subtract 1 from the total, AND subtract 1 from the count of whatever was drawn, before calculating the next stage\'s probability.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A bag has 6 red, 4 green (10 total). Without replacement, find P(green, then green).', steps: [
          { step: 'P(1st green) = 4/10.', justification: 'First draw, full bag.' },
          { step: 'After removing 1 green: 3 green, 9 total. P(2nd green) = 3/9.', justification: 'Subtract 1 from both the green count and the total.' },
          { step: 'P(green,green) = 4/10 × 3/9 = 12/90 = 2/15.', justification: 'Multiply along the path.' },
        ], answer: 'P(green,green) = 2/15' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'with-without-replacement', question: 'A bag has 5 orange, 5 purple (10 total). Without replacement, find P(orange, then orange).', options: ['5/10 × 4/9', '5/10 × 5/9', '5/10 × 4/10', '5/10 + 4/9'], correctIndex: 0, hints: { strategic: 'Subtract 1 from both orange count and total for the second draw.', procedural: '4 orange, 9 total remain.', workedStep: '5/10 × 4/9.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'with-without-replacement', question: 'A bag has 3 black, 7 white (10 total). Without replacement, find P(black, then white).', options: ['3/10 × 7/9', '3/10 × 6/9', '3/10 × 7/10', '3/10 + 7/9'], correctIndex: 0, hints: { strategic: 'After removing 1 black, white count is unaffected but total drops.', procedural: '7 white, 9 total remain.', workedStep: '3/10 × 7/9.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'with-without-replacement', question: 'A bag has 4 red, 6 blue (10 total). Without replacement, find P(blue, then blue, then blue) — three draws.', options: ['6/10 × 5/9 × 4/8', '6/10 × 6/9 × 6/8', '6/10 × 5/9 × 5/8', '6/10 × 6/10 × 6/10'], correctIndex: 0, hints: { strategic: 'Subtract 1 from blue count and total after each draw.', procedural: 'Draw 1: 6/10. Draw 2: 5/9. Draw 3: 4/8.', workedStep: '6/10 × 5/9 × 4/8.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the difference between "with replacement" and "without replacement", in your own words?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel using tree diagrams for combined events now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'When should you multiply probabilities, and when should you add them?', type: 'multiple-choice', options: ['Multiply along a single path; add across separate paths', 'Always multiply', 'Always add', 'It doesn\'t matter'] },
  ],
};
