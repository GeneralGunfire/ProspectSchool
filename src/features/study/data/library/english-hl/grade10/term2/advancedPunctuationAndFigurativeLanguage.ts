// ── English HL, Term 2, Topic 2: Advanced Punctuation and Figurative Language ──
// Extends Term 1's basic punctuation/figures of speech to colons/semicolons
// and more sophisticated devices (symbolism, irony, oxymoron, sound devices).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'semicolon-colon-confused',
    label: 'Confusing when to use a semicolon versus a colon',
    errorType: 'You used a colon where a semicolon was needed, or vice versa.',
    principle: 'A SEMICOLON joins two closely related independent clauses (each could stand alone) without a conjunction. A COLON introduces something — a list, an explanation, or an example — after a complete independent clause.',
    correctStep: 'Semicolon: "The rain stopped; the sun came out." (two related complete sentences.) Colon: "She packed three things: a map, water, and a torch." (introduces a list.)',
  },
  {
    id: 'irony-confused-with-coincidence',
    label: 'Confusing irony with mere coincidence or bad luck',
    errorType: 'You labelled something as ironic when it was simply an unfortunate coincidence, with no contrast to an expectation.',
    principle: 'IRONY involves a contrast between what is EXPECTED (or said) and what actually happens/is meant — not just any surprising or unlucky event. Verbal irony says the opposite of what\'s meant; situational irony is when the outcome contradicts what was expected.',
    correctStep: 'A fire station burning down IS ironic (contradicts the expectation that a fire station should be safe from fire). Simply losing your keys is just bad luck, not irony.',
  },
  {
    id: 'symbol-treated-as-literal',
    label: 'Reading a symbolic detail only literally, missing its deeper meaning',
    errorType: 'You explained a symbolic image only in its literal sense, without considering what larger idea it might represent.',
    principle: 'A SYMBOL is an object, person, or image that represents an ABSTRACT idea beyond its literal meaning — a dove might literally just be a bird, but symbolically often represents peace.',
    correctStep: 'A wilting flower in a story isn\'t just describing a plant — it likely symbolises decline, loss, or the passage of time within the story\'s larger meaning.',
  },
  {
    id: 'oxymoron-vs-paradox-confused',
    label: 'Confusing an oxymoron with a paradox',
    errorType: 'You mislabelled a two-word contradiction as a paradox, or a longer contradictory statement as an oxymoron.',
    principle: 'An OXYMORON is a short phrase combining two contradictory terms (e.g. "deafening silence"). A PARADOX is a longer statement or situation that seems self-contradictory but may reveal a deeper truth (e.g. "the more you give away, the more you have").',
    correctStep: '"Bittersweet" and "living dead" are oxymorons (short, two contradictory words). "Less is more" is a paradox (a fuller contradictory statement).',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 2,
  topicId: 'advanced-punctuation-and-figurative-language',
  topicName: 'Advanced Punctuation and Figurative Language',
  prerequisites: [
    'Tenses and punctuation (Term 1, Topic 2)',
  ],
  objectives: [
    { id: 'apply-colons-semicolons', text: 'Apply colons and semicolons correctly.' },
    { id: 'identify-symbolism-irony', text: 'Identify symbolism and irony in a text, distinguishing irony from mere coincidence.' },
    { id: 'identify-oxymoron-paradox', text: 'Identify and distinguish oxymoron from paradox.' },
    { id: 'identify-sound-devices', text: 'Identify sound devices (alliteration, assonance, onomatopoeia) and their effects.' },
  ],
  estimatedMinutes: [20, 30],
};

export const advancedPunctuationAndFigurativeLanguage: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What\'s the real difference between "just bad luck" and genuine irony?',
  goalSettingPrompt:
    'This lesson sharpens two toolkits: precise punctuation (colons and semicolons) and more sophisticated figurative language (symbolism, irony, oxymoron, sound devices) — tools that make both your own writing and your literary analysis noticeably stronger.',

  activate: {
    connectPrompt: 'You already know basic punctuation and figures of speech from Term 1 — this lesson extends both.',
    diagnosticQuestions: [
      { question: 'What is a metaphor?', options: ['Stating one thing IS another', 'Comparing using "like" or "as"', 'Giving human qualities to objects', 'Deliberate exaggeration'], correctIndex: 0, explanation: 'A metaphor directly states one thing is another, without "like" or "as".' },
      { question: 'Can two complete sentences be joined by only a comma?', options: ['No — this is a comma splice error', 'Yes, always', 'Only in formal writing', 'Only with a semicolon'], correctIndex: 0, explanation: 'This would be a comma splice — an error, needing a stronger connector.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A SEMICOLON joins two closely related independent (complete) clauses without a conjunction — each side must be able to stand alone as its own sentence. A COLON introduces something — a list, explanation, or example — after a complete independent clause comes before it.',
    workedExamples: [
      { id: 'wx-semicolon', prompt: 'Punctuate correctly: "The exam was difficult many students struggled."', steps: [
        { step: 'Both parts are complete sentences, closely related in meaning.', justification: 'Check that both halves could stand alone.' },
        { step: 'Join with a semicolon: "The exam was difficult; many students struggled."', justification: 'A semicolon is appropriate for two closely related complete sentences.' },
      ], answer: '"The exam was difficult; many students struggled."' },
      { id: 'wx-colon', prompt: 'Punctuate correctly: "She had one goal become a doctor."', steps: [
        { step: 'The first part ("She had one goal") is a complete sentence, and what follows explains/introduces that goal.', justification: 'This matches the colon\'s function of introducing an explanation.' },
        { step: '"She had one goal: become a doctor."', justification: 'Use a colon to introduce the explanation.' },
      ], answer: '"She had one goal: become a doctor."' },
    ],
    knowledgeChecks: [
      { question: 'Which is correctly punctuated?', options: ['"He brought three items: a pen, paper, and a ruler."', '"He brought three items; a pen, paper, and a ruler."', '"He brought three items, a pen; paper; and a ruler."', 'All are equally correct'], correctIndex: 0, explanation: 'A colon correctly introduces the list.', misconceptionId: 'semicolon-colon-confused' },
      { question: 'Which correctly uses a semicolon?', options: ['"It was late; we decided to leave."', '"It was late: we decided to leave."', '"It was late, we decided to leave."', '"It was late we decided to leave."'], correctIndex: 0, explanation: 'Two related complete sentences joined by a semicolon.', misconceptionId: 'semicolon-colon-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel using colons and semicolons correctly?',
  },

  demonstrateChunk2: {
    explanation:
      'SYMBOLISM: an object/image representing an abstract idea beyond its literal meaning. IRONY: a contrast between what\'s expected/said and what actually happens or is meant — not just any surprising or unlucky event. An OXYMORON is a short phrase combining two contradictory terms ("deafening silence"); a PARADOX is a longer, seemingly self-contradictory statement that may reveal a deeper truth ("less is more"). SOUND DEVICES: ALLITERATION repeats consonant sounds at the start of nearby words ("the wild wind whistled"); ASSONANCE repeats vowel sounds within words; ONOMATOPOEIA uses words that imitate sounds ("buzz," "crash").',
    workedExamples: [
      { id: 'wx-irony-vs-coincidence', prompt: 'Is this ironic: "A weather forecaster\'s house was struck by lightning during a broadcast about storm safety"?', steps: [
        { step: 'Check for a contrast between expectation and outcome: a weather expert, someone who should be most prepared, is the one affected.', justification: 'This contrast between role/expectation and outcome is the key test for irony.' },
        { step: 'Yes, this is situational irony — the person most associated with predicting/understanding storms is caught by one during a safety broadcast.', justification: 'The contrast between expected safety/expertise and the actual outcome makes this genuinely ironic, not just coincidental.' },
      ], answer: 'Yes, situational irony — contrast between the forecaster\'s expertise and being struck themselves' },
      { id: 'wx-sound-devices', prompt: 'Identify the sound device in "the buzzing bees drifted by."', steps: [
        { step: '"Buzzing" imitates the actual sound bees make.', justification: 'This matches onomatopoeia.' },
        { step: 'Also note "b" repetition in "buzzing bees" — this is additionally alliteration.', justification: 'More than one sound device can appear in the same phrase.' },
      ], answer: 'Onomatopoeia ("buzzing") and alliteration ("buzzing bees")' },
    ],
    knowledgeChecks: [
      { question: 'A student loses their homework the same day the teacher is absent (so it wasn\'t needed). Is this ironic?', options: ['Yes — situational irony, the "disaster" turned out not to matter', 'No, this is just an unrelated event', 'This is verbal irony', 'This is a paradox'], correctIndex: 0, explanation: 'The contrast between the feared consequence and the actual (harmless) outcome makes this ironic.', misconceptionId: 'irony-confused-with-coincidence' },
      { question: 'Which is an oxymoron, not a paradox?', options: ['"Bitter sweet"', '"The more you know, the more you realise you don\'t know"', '"Standing still, we still moved forward as a team"', 'All of these are oxymorons'], correctIndex: 0, explanation: '"Bittersweet" is a short two-word contradiction — an oxymoron. The others are longer, paradoxical statements.', misconceptionId: 'oxymoron-vs-paradox-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying symbolism, irony, oxymoron/paradox, and sound devices?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-colons-semicolons', revealSteps: 1, prompt: 'Punctuate correctly: "The team had a plan attack early and often."', steps: [
        { step: 'A colon introduces the explanation of "the plan": "The team had a plan: attack early and often."', justification: 'Colon introduces an explanation after a complete clause.' },
      ], answer: '"The team had a plan: attack early and often."' },
      { id: 'fp-partial-1', objectiveId: 'identify-symbolism-irony', revealSteps: 1, prompt: 'In a story, a caged bird appears repeatedly. What might it symbolise?', steps: [
        { step: 'A cage literally restricts a bird\'s natural ability to fly freely.', justification: 'Consider the literal function of the image first.' },
        { step: 'Symbolically, this often represents restriction, lost freedom, or being trapped (e.g. in a situation, relationship, or society).', justification: 'Connect the literal image to a larger abstract idea.' },
      ], answer: 'Restriction, lost freedom, or feeling trapped' },
      { id: 'fp-independent-1', objectiveId: 'identify-sound-devices', revealSteps: 0, prompt: 'Identify the sound device(s) in "the slippery snake slid silently."', steps: [
        { step: 'The repeated "s" sound across "slippery," "snake," "slid," "silently" is alliteration.', justification: 'Repeated consonant sounds at the start of nearby words.' },
      ], answer: 'Alliteration (repeated "s" sounds)' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'apply-colons-semicolons', question: 'Which is correctly punctuated?', options: ['"The sky darkened; a storm was coming."', '"The sky darkened: a storm was coming."', '"The sky darkened, a storm was coming."', '"The sky darkened a storm was coming."'], correctIndex: 0, hints: { strategic: 'Are both parts complete, closely related sentences?', procedural: 'Yes — use a semicolon.', workedStep: '"The sky darkened; a storm was coming."' }, distractorMisconceptions: { 1: 'semicolon-colon-confused' } },
      { id: 'ip-2', objectiveId: 'identify-symbolism-irony', question: 'A lifeguard nearly drowns while off-duty at the beach. Is this ironic?', options: ['Yes — contrast between their role (saving swimmers) and the actual event', 'No, this is unrelated to irony', 'This is an oxymoron', 'This is alliteration'], correctIndex: 0, hints: { strategic: 'Is there a contrast between an expected role and what happens?', procedural: 'A lifeguard is expected to be safest in water.', workedStep: 'Yes, situational irony.' }, distractorMisconceptions: { 1: 'irony-confused-with-coincidence' } },
      { id: 'ip-3', objectiveId: 'identify-oxymoron-paradox', question: 'Which is a paradox, not an oxymoron?', options: ['"You have to be cruel to be kind"', '"Jumbo shrimp"', '"Deafening silence"', '"Living dead"'], correctIndex: 0, hints: { strategic: 'Is it a short two-word contradiction, or a fuller statement?', procedural: 'This is a fuller statement suggesting a deeper truth.', workedStep: 'Paradox.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'identify-sound-devices', question: 'Identify the sound device in "the crack of thunder echoed."', options: ['Onomatopoeia ("crack" imitates the sound)', 'Alliteration', 'Assonance', 'No sound device present'], correctIndex: 0, hints: { strategic: 'Does the word imitate an actual sound?', procedural: '"Crack" sounds like the noise it describes.', workedStep: 'Onomatopoeia.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'apply-colons-semicolons', multiSelect: false, question: 'Which correctly uses a colon?', options: ['"She needed three things: courage, patience, and time."', '"She needed three things; courage, patience, and time."', '"She needed three things, courage; patience; and time."', 'All are equally correct'], correctIndices: [0], explanation: 'A colon correctly introduces the list.', distractorMisconceptions: { 1: 'semicolon-colon-confused' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'apply-colons-semicolons', multiSelect: false, question: 'Which correctly uses a semicolon?', options: ['"The road was closed; traffic backed up for miles."', '"The road was closed: traffic backed up for miles."', '"The road was closed, traffic backed up for miles."', '"The road was closed traffic backed up."'], correctIndices: [0], explanation: 'Two related complete sentences joined by a semicolon.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'identify-symbolism-irony', multiSelect: false, question: 'True or false: any surprising or unlucky event counts as irony.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — irony requires a specific contrast between expectation and outcome, not just any surprise.', distractorMisconceptions: { 0: 'irony-confused-with-coincidence' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'identify-symbolism-irony', multiSelect: false, question: 'In a story, a wilting rose appears whenever a character\'s health declines. What is this an example of?', options: ['Symbolism', 'Onomatopoeia', 'Alliteration', 'A colon'], correctIndices: [0], explanation: 'The rose represents an abstract idea (declining health) beyond its literal meaning.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'identify-oxymoron-paradox', multiSelect: false, question: 'Which is an oxymoron?', options: ['"Pretty ugly"', '"You must lose yourself to find yourself"', '"War is peace"', 'All of these are paradoxes only'], correctIndices: [0], explanation: '"Pretty ugly" is a short two-word contradiction — an oxymoron.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'identify-oxymoron-paradox', multiSelect: false, question: 'True or false: a paradox is usually a longer, seemingly self-contradictory statement, while an oxymoron is a short phrase.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is the key distinction between the two.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'identify-sound-devices', multiSelect: false, question: 'Identify the sound device in "the deep green sea gleamed."', options: ['Assonance (repeated "ee" vowel sound)', 'Onomatopoeia', 'Alliteration', 'No sound device present'], correctIndices: [0], explanation: 'The repeated "ee" sound within "deep," "green," "sea," "gleamed" is assonance.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-sound-devices', multiSelect: true, question: 'Which of these are examples of alliteration? (select all that apply)', options: ['"Peter Piper picked a peck"', '"The buzzing bee"', '"She sells seashells by the seashore"', '"The cat sat on the mat"'], correctIndices: [0, 2], explanation: '"Peter Piper picked" and "She sells seashells" both repeat consonant sounds at the start of nearby words — alliteration. The others don\'t show this pattern as clearly.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'identify-symbolism-irony',
      analogy: 'Think of irony as a "twist test": ask yourself "what would you NORMALLY expect here?" and "what actually happened?" — if there\'s a sharp, meaningful CONTRAST between those two answers, it\'s irony. If it\'s just bad luck with no meaningful contrast to an expectation, it\'s just a coincidence.',
      explanation: 'For any potentially ironic situation, explicitly state: (1) what was expected/normal; (2) what actually happened; (3) whether there\'s a genuine, meaningful CONTRAST between them.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Is this ironic: "A locksmith locked himself out of his own house"?', steps: [
          { step: 'Expected: a locksmith, of all people, should never be locked out — that\'s literally their expertise.', justification: 'State the expectation clearly.' },
          { step: 'Actual: he locked himself out.', justification: 'State what actually happened.' },
          { step: 'Contrast: yes, a strong, meaningful contrast between his expertise and the outcome — this IS ironic.', justification: 'Confirm the contrast is genuine and meaningful.' },
        ], answer: 'Yes, ironic — contrast between his expertise and being locked out himself' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'identify-symbolism-irony', question: 'Is this ironic: "A traffic police officer got a speeding ticket"?', options: ['Yes — contrast between their role enforcing traffic law and breaking it themselves', 'No, this is unrelated', 'This is a paradox, not irony', 'This is alliteration'], correctIndex: 0, hints: { strategic: 'What would you expect from someone in that role?', procedural: 'A traffic officer is expected to enforce speed limits, not break them.', workedStep: 'Yes, ironic.' }, distractorMisconceptions: { 1: 'irony-confused-with-coincidence' } },
        { id: 'rem-p2', objectiveId: 'identify-symbolism-irony', question: 'Is this ironic: "It rained on the day of the outdoor umbrella-sellers\' convention"?', options: ['Not particularly ironic — arguably fitting rather than contradictory (though it depends on framing)', 'Definitely not ironic at all', 'This is a paradox', 'This is symbolism'], correctIndex: 0, hints: { strategic: 'Is there a genuine contrast, or does the rain actually suit umbrella sellers?', procedural: 'Rain might even help umbrella sales — not a clear contradiction.', workedStep: 'Not clearly ironic — check for genuine contrast each time.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'identify-symbolism-irony', question: 'Is this ironic: "A vegetarian restaurant\'s delivery van caught fire from a gas leak"?', options: ['No — unfortunate, but no meaningful contrast to an expectation tied to being vegetarian', 'Yes, extremely ironic', 'This is a paradox', 'This is an oxymoron'], correctIndex: 0, hints: { strategic: 'Is there a meaningful contrast connected to what the restaurant represents?', procedural: 'A vegetarian identity has no logical connection to fire safety.', workedStep: 'No — just unfortunate, not ironic.' }, distractorMisconceptions: { 1: 'irony-confused-with-coincidence' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the "twist test" for checking if something is genuinely ironic?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with colons, semicolons, and advanced figurative language now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the key difference between an oxymoron and a paradox?', type: 'multiple-choice', options: ['Oxymoron is a short contradictory phrase; paradox is a longer contradictory statement', 'They are the same thing', 'Oxymoron only applies to poetry', 'Paradox is always funny'] },
  ],
};
