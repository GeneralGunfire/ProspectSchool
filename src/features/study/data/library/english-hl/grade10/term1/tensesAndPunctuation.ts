// ── English HL, Term 1, Topic 2: Tenses and Punctuation ───────────────────────
// Builds on Topic 1 (word classes, clauses). Covers tense consistency and
// core punctuation/sentence mechanics, plus basic figures of speech.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'tense-inconsistency',
    label: 'Shifting tense inconsistently within a single piece of writing',
    errorType: 'You switched between past and present tense without a clear reason, within the same passage.',
    principle: 'Once you establish a tense for a piece of writing (e.g. narrating in the past), stay consistent throughout unless there\'s a clear reason to shift (e.g. moving from narration to a general truth).',
    correctStep: '"She walked into the room and saw the mess" (consistent past) — not "She walked into the room and sees the mess" (inconsistent shift to present).',
  },
  {
    id: 'comma-splice',
    label: 'Joining two complete sentences with only a comma (comma splice)',
    errorType: 'You used a comma alone to join two independent clauses that could each stand as their own sentence.',
    principle: 'Two independent (main) clauses cannot be joined with just a comma — use a full stop, a semicolon, or a comma PLUS a conjunction (like "and," "but").',
    correctStep: '"It was raining, we stayed inside" is a comma splice. Fix: "It was raining, so we stayed inside" or "It was raining. We stayed inside."',
  },
  {
    id: 'apostrophe-misuse',
    label: 'Confusing possessive apostrophes with plural forms, or misusing "it\'s" vs "its"',
    errorType: 'You added an apostrophe to make a word plural, or confused a possessive with a contraction.',
    principle: 'Apostrophes show POSSESSION (the dog\'s bone) or CONTRACTION (it\'s = it is) — never just to make a word plural. "Its" (no apostrophe) is possessive; "it\'s" (with apostrophe) is short for "it is."',
    correctStep: '"The dogs ran" (plural, no apostrophe) vs "the dog\'s bone" (possessive, apostrophe). "The cat licked its paw" (possessive) vs "It\'s raining" (it is raining).',
  },
  {
    id: 'run-on-sentence',
    label: 'Writing a run-on sentence with no punctuation separating independent clauses',
    errorType: 'You joined two or more complete sentences together with no punctuation or conjunction at all.',
    principle: 'Every independent clause needs to be properly separated from the next — by a full stop, semicolon, or comma+conjunction. Running them together with nothing in between is a run-on sentence.',
    correctStep: '"I was tired I went to bed early" is a run-on. Fix: "I was tired, so I went to bed early" or "I was tired. I went to bed early."',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 1,
  topicId: 'tenses-and-punctuation',
  topicName: 'Tenses and Punctuation',
  prerequisites: [
    'Word classes and sentence structures (this term, Topic 1)',
  ],
  objectives: [
    { id: 'maintain-tense-consistency', text: 'Maintain consistent tense within a piece of writing.' },
    { id: 'apply-core-punctuation', text: 'Apply correct punctuation for sentence mechanics (full stops, commas, question/exclamation marks).' },
    { id: 'avoid-comma-splices-run-ons', text: 'Identify and correct comma splices and run-on sentences.' },
    { id: 'identify-basic-figures-of-speech', text: 'Identify basic figures of speech (simile, metaphor, personification, hyperbole) in context.' },
  ],
  estimatedMinutes: [20, 30],
};

export const tensesAndPunctuation: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What happens when a story suddenly changes tense halfway through?',
  goalSettingPrompt:
    'Consistent tense and correct punctuation are what make writing easy to follow — get them wrong and even a good story becomes confusing. By the end of this lesson you\'ll be able to spot and fix the most common tense and punctuation errors.',

  activate: {
    connectPrompt: 'You already know clauses from the last lesson — that knowledge is exactly what you need to understand comma splices and run-ons.',
    diagnosticQuestions: [
      { question: 'Which sentence uses consistent past tense?', options: ['"She opened the door and walked inside."', '"She opened the door and walks inside."', '"She opens the door and walked inside."', 'None of these'], correctIndex: 0, explanation: 'Both verbs are in the past tense, consistently.' },
      { question: 'Which is a complete sentence (independent clause)?', options: ['"The dog barked."', '"Because the dog barked."', '"Barking loudly."', '"The loud dog."'], correctIndex: 0, explanation: '"The dog barked" has a subject and verb and can stand alone.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'TENSE CONSISTENCY means staying in the same time frame throughout a piece of writing unless there\'s a clear reason to shift (e.g. narrating events in the past, but stating a general truth in the present). Core PUNCTUATION rules: full stops end complete sentences; commas separate items in a list, or set off extra information, or join a main and subordinate clause; question marks and exclamation marks replace the full stop for questions and strong emotion.',
    workedExamples: [
      { id: 'wx-tense-fix', prompt: 'Fix the tense inconsistency: "He walked into the shop and buys some bread."', steps: [
        { step: 'The first verb "walked" is past tense; the second verb "buys" is present tense — inconsistent.', justification: 'Identify which verb breaks the established tense.' },
        { step: 'Change "buys" to "bought" to match the established past tense.', justification: 'Keep the whole sentence in the same time frame.' },
      ], answer: '"He walked into the shop and bought some bread."' },
      { id: 'wx-punctuation-basic', prompt: 'Punctuate correctly: "Wait she said dont go yet"', steps: [
        { step: 'Add quotation marks around the spoken words, and correct the missing apostrophe in "don\'t".', justification: 'Direct speech needs quotation marks; contractions need apostrophes.' },
        { step: '"Wait," she said, "don\'t go yet!"', justification: 'Add commas to separate the reporting clause, and appropriate end punctuation.' },
      ], answer: '"Wait," she said, "don\'t go yet!"' },
    ],
    knowledgeChecks: [
      { question: 'Which sentence has a tense inconsistency?', options: ['"He runs fast and won the race."', '"He ran fast and won the race."', '"He runs fast and wins the race."', '"He will run fast and will win."'], correctIndex: 0, explanation: '"Runs" (present) then "won" (past) is inconsistent.', misconceptionId: 'tense-inconsistency' },
      { question: 'Which word correctly completes: "The cat licked ___ paw"?', options: ['its', "it's", 'its\'', 'it is'], correctIndex: 0, explanation: '"Its" (no apostrophe) is possessive here — the paw belongs to the cat.', misconceptionId: 'apostrophe-misuse' },
    ],
    confidenceCheckPrompt: 'How confident do you feel maintaining tense consistency and applying core punctuation?',
  },

  demonstrateChunk2: {
    explanation:
      'A COMMA SPLICE joins two complete sentences with only a comma — this is a common error. A RUN-ON SENTENCE joins them with no punctuation at all. Fix either by: using a full stop (making two sentences), a semicolon, or a comma plus a conjunction ("and," "but," "so"). Basic FIGURES OF SPEECH: a SIMILE compares using "like" or "as" (brave as a lion); a METAPHOR states one thing IS another (he is a lion); PERSONIFICATION gives human qualities to non-human things (the wind whispered); HYPERBOLE is deliberate exaggeration (I\'ve told you a million times).',
    workedExamples: [
      { id: 'wx-fix-comma-splice', prompt: 'Fix the comma splice: "The movie was long, I fell asleep."', steps: [
        { step: 'Both parts are complete sentences ("The movie was long" and "I fell asleep") joined by only a comma.', justification: 'Identify that this is a comma splice.' },
        { step: 'Fix with a comma plus conjunction: "The movie was long, so I fell asleep." Or split into two sentences.', justification: 'Either fix resolves the comma splice.' },
      ], answer: '"The movie was long, so I fell asleep."' },
      { id: 'wx-identify-figures', prompt: 'Identify the figure of speech: "The stars danced in the night sky."', steps: [
        { step: 'Stars cannot literally "dance" — this gives a human/living quality to a non-human thing.', justification: 'This matches the definition of personification.' },
      ], answer: 'Personification' },
    ],
    knowledgeChecks: [
      { question: 'Which is a run-on sentence?', options: ['"I was hungry I ate a sandwich."', '"I was hungry, so I ate a sandwich."', '"I was hungry. I ate a sandwich."', '"Because I was hungry, I ate a sandwich."'], correctIndex: 0, explanation: 'No punctuation at all joins the two complete sentences — a run-on.', misconceptionId: 'run-on-sentence' },
      { question: 'Identify the figure of speech: "Her smile was as bright as the sun."', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correctIndex: 0, explanation: 'Uses "as" to compare — a simile.' },
    ],
    confidenceCheckPrompt: 'How confident do you feel fixing comma splices/run-ons and identifying basic figures of speech?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'maintain-tense-consistency', revealSteps: 1, prompt: 'Fix: "She smiled and says thank you."', steps: [
        { step: 'Change "says" to "said" for consistency with "smiled".', justification: 'Match the established past tense.' },
      ], answer: '"She smiled and said thank you."' },
      { id: 'fp-partial-1', objectiveId: 'avoid-comma-splices-run-ons', revealSteps: 1, prompt: 'Fix the comma splice: "The sun set, the sky turned pink."', steps: [
        { step: 'Both parts are complete sentences joined only by a comma.', justification: 'This is a comma splice.' },
        { step: 'Fix: "The sun set, and the sky turned pink."', justification: 'Add a conjunction after the comma.' },
      ], answer: '"The sun set, and the sky turned pink."' },
      { id: 'fp-independent-1', objectiveId: 'identify-basic-figures-of-speech', revealSteps: 0, prompt: 'Identify the figure of speech: "I have a million things to do today."', steps: [
        { step: 'This is a deliberate, obvious exaggeration for effect.', justification: 'This matches the definition of hyperbole.' },
      ], answer: 'Hyperbole' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'maintain-tense-consistency', question: 'Which sentence is consistently in the present tense?', options: ['"She cooks dinner and cleans the kitchen."', '"She cooked dinner and cleans the kitchen."', '"She cooks dinner and cleaned the kitchen."', '"She will cook and cleaned."'], correctIndex: 0, hints: { strategic: 'Check both verbs match the same tense.', procedural: '"Cooks" and "cleans" are both present tense.', workedStep: 'Consistent present tense.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'apply-core-punctuation', question: 'Which sentence is correctly punctuated?', options: ['"Wait for me!" she shouted.', 'Wait for me she shouted', '"Wait for me she shouted."', 'Wait for me, she shouted!'], correctIndex: 0, hints: { strategic: 'Direct speech needs quotation marks and correct end punctuation.', procedural: 'The exclamation belongs inside the quotation marks.', workedStep: '"Wait for me!" she shouted.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'avoid-comma-splices-run-ons', question: 'Which sentence has a comma splice?', options: ['"It was cold, she wore a coat."', '"It was cold, so she wore a coat."', '"It was cold. She wore a coat."', '"Because it was cold, she wore a coat."'], correctIndex: 0, hints: { strategic: 'Are both parts complete sentences joined by only a comma?', procedural: 'Yes — "it was cold" and "she wore a coat" are both complete.', workedStep: 'Comma splice.' }, distractorMisconceptions: { 3: 'comma-splice' } },
      { id: 'ip-4', objectiveId: 'identify-basic-figures-of-speech', question: 'Identify the figure of speech: "Time is money."', options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'], correctIndex: 0, hints: { strategic: 'Does it use "like/as," or directly state one thing IS another?', procedural: 'It directly equates time with money — no "like" or "as".', workedStep: 'Metaphor.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'maintain-tense-consistency', multiSelect: false, question: 'True or false: "He opened the box and finds a surprise inside" is tense-consistent.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — "opened" (past) and "finds" (present) are inconsistent.', distractorMisconceptions: { 0: 'tense-inconsistency' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'apply-core-punctuation', multiSelect: false, question: 'Which word correctly completes: "___ almost time to leave."', options: ["It's", 'Its', "Its'", 'It is'], correctIndices: [0], explanation: '"It\'s" = "it is", a contraction, correct here.', distractorMisconceptions: { 1: 'apostrophe-misuse' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'avoid-comma-splices-run-ons', multiSelect: false, question: 'Which is correctly punctuated (no comma splice or run-on)?', options: ['"The rain stopped; we went outside."', '"The rain stopped, we went outside."', '"The rain stopped we went outside."', 'All are equally correct'], correctIndices: [0], explanation: 'A semicolon correctly joins two related independent clauses.', distractorMisconceptions: { 1: 'comma-splice', 2: 'run-on-sentence' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'identify-basic-figures-of-speech', multiSelect: false, question: 'Identify: "The leaves whispered secrets to the wind."', options: ['Personification', 'Simile', 'Hyperbole', 'Metaphor'], correctIndices: [0], explanation: 'Leaves "whispering" is a human quality given to something non-human.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'identify-basic-figures-of-speech', multiSelect: false, question: 'Identify: "Her eyes were like diamonds."', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correctIndices: [0], explanation: 'Uses "like" to compare — a simile.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'avoid-comma-splices-run-ons', multiSelect: false, question: 'True or false: "I ran home I was late" is a run-on sentence.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — no punctuation joins the two complete sentences at all.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'apply-core-punctuation', multiSelect: false, question: 'Which sentence uses commas correctly in a list?', options: ['"I bought apples, bananas, and oranges."', '"I bought apples bananas and oranges."', '"I bought, apples, bananas, and, oranges."', '"I bought apples, bananas and, oranges."'], correctIndices: [0], explanation: 'Commas correctly separate each list item.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-basic-figures-of-speech', multiSelect: true, question: 'Which of these are similes? (select all that apply)', options: ['"As brave as a lion"', '"He is a lion in battle"', '"Fast as lightning"', '"The lion of the team"'], correctIndices: [0, 2], explanation: '"As brave as a lion" and "fast as lightning" both use "as" to compare — similes. The others are metaphors (stating one thing IS another).', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'avoid-comma-splices-run-ons',
      analogy: 'Think of each complete sentence as its own train car — you can\'t just push two cars together with nothing between them (run-on) or with a flimsy comma alone (comma splice); you need a proper coupling: a full stop, a semicolon, or a comma with a conjunction.',
      explanation: 'Before finalising a sentence with a comma in the middle, check: could BOTH halves stand alone as complete sentences? If yes, you need more than just a comma — add a conjunction, use a semicolon, or split into two sentences.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Fix: "The lights went out, everyone panicked."', steps: [
          { step: 'Check: "the lights went out" and "everyone panicked" are both complete sentences.', justification: 'This confirms it\'s a comma splice.' },
          { step: 'Fix: "The lights went out, and everyone panicked."', justification: 'Add a conjunction after the comma.' },
        ], answer: '"The lights went out, and everyone panicked."' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'avoid-comma-splices-run-ons', question: 'Fix: "The music stopped, the dancers froze."', options: ['"The music stopped, and the dancers froze."', '"The music stopped the dancers froze."', 'It is already correct', '"The music, stopped the dancers, froze."'], correctIndex: 0, hints: { strategic: 'Both halves are complete sentences — add a conjunction.', procedural: 'Insert "and" after the comma.', workedStep: '"The music stopped, and the dancers froze."' }, distractorMisconceptions: { 2: 'comma-splice' } },
        { id: 'rem-p2', objectiveId: 'avoid-comma-splices-run-ons', question: 'Fix: "She studied hard she passed the test."', options: ['"She studied hard, so she passed the test."', 'It is already correct', '"She studied, hard, she, passed the test."', '"She studied hard so, she passed the test."'], correctIndex: 0, hints: { strategic: 'No punctuation at all joins two complete sentences — run-on.', procedural: 'Add a comma and conjunction.', workedStep: '"She studied hard, so she passed the test."' }, distractorMisconceptions: { 1: 'run-on-sentence' } },
        { id: 'rem-p3', objectiveId: 'avoid-comma-splices-run-ons', question: 'Fix: "The power went out, the whole street was dark."', options: ['"The power went out, and the whole street was dark."', 'It is already correct', '"The power, went out the whole street was dark."', '"The power went out the whole, street was dark."'], correctIndex: 0, hints: { strategic: 'Both halves are complete sentences — add a conjunction.', procedural: 'Insert "and" after the comma.', workedStep: '"The power went out, and the whole street was dark."' }, distractorMisconceptions: { 1: 'comma-splice' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the difference between a comma splice and a run-on sentence?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with tense consistency and punctuation now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Which figure of speech do you find easiest to spot?', type: 'multiple-choice', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'] },
  ],
};
