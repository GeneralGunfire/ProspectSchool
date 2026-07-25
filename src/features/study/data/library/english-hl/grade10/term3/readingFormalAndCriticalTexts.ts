// ── English HL, Term 3, Topic 2: Reading Formal and Critical Texts ───────────
// Builds on Term 1-2 comprehension work. Per Term 3/4 research, Term 3
// reading shifts toward formal informative texts (agendas/reports/minutes)
// and critical/media texts (reviews, articles) — fact/opinion, bias, tone.

import type { LessonContent } from '../../../types';

const MINUTES_EXTRACT = `MINUTES: Grade 10 Environmental Committee Meeting, 14 March\nPresent: Ms. Adams (Chair), 8 learner representatives.\n1. Ms. Adams opened the meeting at 13:15 and welcomed new members.\n2. The recycling bin proposal (raised in the previous meeting) was discussed. Three learners reported that the pilot bins placed outside the library had collected an average of 40kg of recyclable material per week over the trial period.\n3. It was proposed that bins be extended to all classroom blocks. The proposal was seconded and passed unanimously.\n4. Action: Mr. Khumalo to submit a budget request to the SGB by 21 March.\n5. Meeting closed at 13:52.`;

const REVIEW_EXTRACT = `"Nightfall at Hollow Creek" promises tension but mostly delivers confusion. The film's central mystery — a missing hiker in a fog-shrouded forest — has real potential, and the cinematography is genuinely striking in its early scenes. Unfortunately, the plot loses its nerve halfway through, piling on twist after twist until none of them land with any real weight. The lead performance is committed, even when the script gives her little to work with beyond confused stares and whispered dialogue. Fans of atmospheric horror may find enough here to justify a watch, but anyone hoping for a satisfying resolution will likely leave disappointed.`;

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'formal-text-tone-misjudged',
    label: 'Misjudging the tone of a formal informative text as more emotional/opinionated than it is',
    errorType: 'You read emotion or opinion into a formal text (like minutes or a report) that is actually neutrally, factually worded.',
    principle: 'Formal informative texts like minutes, agendas, and reports are typically written in a NEUTRAL, factual tone — avoid reading emotion or bias into wording that is simply precise and objective.',
    correctStep: '"The proposal was seconded and passed unanimously" is neutral factual reporting, not an expression of excitement or opinion.',
  },
  {
    id: 'fact-opinion-confused',
    label: 'Confusing a stated fact with the writer\'s opinion',
    errorType: 'You treated an opinion as if it were an objective fact, or vice versa.',
    principle: 'A FACT can be verified/checked (e.g. a measurement, a date, an event that occurred). An OPINION is a personal judgement or evaluation (e.g. "genuinely striking," "disappointed") — look for evaluative language as a signal of opinion.',
    correctStep: '"The bins collected 40kg per week" is a fact (verifiable). "The cinematography is genuinely striking" is an opinion (a personal judgement).',
  },
  {
    id: 'review-verdict-not-identified',
    label: 'Missing the overall verdict/recommendation buried within a mixed review',
    errorType: 'You focused on individual positive or negative comments without identifying the review\'s overall balanced verdict.',
    principle: 'A review often mixes praise and criticism — to understand its overall verdict, weigh ALL the evaluative comments together, paying special attention to the concluding recommendation, which usually states the writer\'s final judgement most directly.',
    correctStep: 'A review praising cinematography but criticising plot, ending with "fans... may find enough... but anyone hoping for... will likely leave disappointed," is a genuinely MIXED verdict — not simply positive or negative.',
  },
  {
    id: 'informative-text-purpose-misunderstood',
    label: 'Misunderstanding the specific purpose of a formal text type',
    errorType: 'You misidentified what a specific formal text type (like minutes vs. an agenda) is actually meant to record or achieve.',
    principle: 'Different formal text types serve different purposes: an AGENDA lists what WILL be discussed (before a meeting); MINUTES record what WAS discussed and decided (after a meeting); a REPORT presents findings/information on a specific matter.',
    correctStep: 'Minutes record decisions already made (e.g. "the proposal... passed unanimously") — they don\'t list future discussion topics, which would be an agenda\'s job.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 3,
  topicId: 'reading-formal-and-critical-texts',
  topicName: 'Reading Formal and Critical Texts',
  prerequisites: [
    'Comprehension: inference, evaluation, and appreciation (Term 2)',
  ],
  objectives: [
    { id: 'read-formal-informative-texts', text: 'Read and interpret formal informative texts (minutes, agendas, reports) accurately.' },
    { id: 'distinguish-fact-opinion', text: 'Distinguish stated facts from the writer\'s opinions in a text.' },
    { id: 'identify-review-verdict', text: 'Identify a review\'s overall verdict by weighing its mixed evaluative comments.' },
    { id: 'analyse-media-text-bias', text: 'Analyse a media text (review/article) for tone, bias, and persuasive language.' },
  ],
  estimatedMinutes: [20, 30],
};

export const readingFormalAndCriticalTexts: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What\'s the difference between reading minutes and reading a movie review?',
  goalSettingPrompt:
    'Formal informative texts (like meeting minutes) and critical media texts (like reviews) demand different reading skills — one rewards neutral, precise reading; the other requires separating fact from opinion and weighing a mixed verdict. By the end of this lesson you\'ll be confident with both.',

  activate: {
    connectPrompt: 'You already know how to identify literal facts and evaluate an argument\'s quality from Terms 1-2 — this lesson applies those skills to new, more formal text types.',
    diagnosticQuestions: [
      { question: 'Is "the meeting started at 1pm" a fact or an opinion?', options: ['Fact', 'Opinion', 'Neither', 'Both'], correctIndex: 0, explanation: 'This is a verifiable, objective statement — a fact.' },
      { question: 'Is "the meeting was incredibly boring" a fact or an opinion?', options: ['Opinion', 'Fact', 'Neither', 'Both'], correctIndex: 0, explanation: 'This is a personal judgement — an opinion.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      `Read this extract from formal meeting minutes carefully — you'll use it in this lesson:\n\n"${MINUTES_EXTRACT}"\n\nFormal informative texts like minutes, agendas, and reports are typically written in a NEUTRAL, factual tone. Different formal text types serve different purposes: an AGENDA lists what WILL be discussed (before a meeting); MINUTES record what WAS discussed and decided (after a meeting). Don't read emotion or opinion into precise, objective wording.`,
    workedExamples: [
      { id: 'wx-minutes-purpose', prompt: 'What is the purpose of the document above, and how do you know?', steps: [
        { step: 'It records what was discussed, proposed, and decided at a meeting that already happened (using past tense: "opened," "was discussed," "passed").', justification: 'Check the tense and content to identify the text type.' },
        { step: 'This matches the purpose of MINUTES, not an agenda (which would list upcoming topics in future/neutral tense, before the meeting).', justification: 'Distinguish minutes from an agenda based on purpose and tense.' },
      ], answer: 'Minutes — records what was already discussed and decided' },
      { id: 'wx-neutral-tone', prompt: 'Is "the proposal was seconded and passed unanimously" written with emotion or neutrally?', steps: [
        { step: 'The wording is precise and factual, with no emotive or evaluative language (no words like "excitingly" or "wonderfully").', justification: 'Check for emotive/evaluative language.' },
        { step: 'This is neutral, objective reporting — standard for formal minutes.', justification: 'Formal texts of this type maintain a neutral tone by convention.' },
      ], answer: 'Neutral — no emotional or evaluative language present' },
    ],
    knowledgeChecks: [
      { question: 'According to the minutes, how much recyclable material did the pilot bins collect per week on average?', options: ['40kg', '14kg', '21kg', 'Not stated'], correctIndex: 0, explanation: 'Directly stated as a fact in point 2.', misconceptionId: 'formal-text-tone-misjudged' },
      { question: 'What is the key difference between an agenda and minutes?', options: ['An agenda lists upcoming topics; minutes record what was decided', 'They are the same document', 'An agenda is written after the meeting', 'Minutes are always informal'], correctIndex: 0, explanation: 'Agendas look forward; minutes look back at what happened.', misconceptionId: 'informative-text-purpose-misunderstood' },
    ],
    confidenceCheckPrompt: 'How confident do you feel reading formal informative texts like minutes accurately and neutrally?',
  },

  demonstrateChunk2: {
    explanation:
      `Read this film review extract — you'll use it for this section:\n\n"${REVIEW_EXTRACT}"\n\nA FACT can be verified/checked. An OPINION is a personal judgement or evaluation — look for evaluative language ("striking," "disappointed," "genuinely") as a signal of opinion. A review often mixes praise and criticism — to find its overall VERDICT, weigh all the evaluative comments together, paying special attention to the concluding recommendation.`,
    workedExamples: [
      { id: 'wx-fact-vs-opinion-review', prompt: 'Identify one fact and one opinion in the review.', steps: [
        { step: 'Fact: "a missing hiker in a fog-shrouded forest" — this describes the film\'s premise, a checkable claim about what the plot contains.', justification: 'A purely descriptive claim about content, with no evaluative judgement, is a fact.' },
        { step: 'Opinion: "the cinematography is genuinely striking" — this is the reviewer\'s personal aesthetic judgement.', justification: 'Evaluative language ("striking," "genuinely") signals opinion.' },
      ], answer: 'Fact: the film\'s premise (missing hiker, forest). Opinion: "genuinely striking" cinematography' },
      { id: 'wx-overall-verdict', prompt: 'What is the review\'s overall verdict — purely negative, purely positive, or mixed?', steps: [
        { step: 'Praise: striking cinematography, committed lead performance. Criticism: confusing plot, twists that "don\'t land," unsatisfying resolution.', justification: 'Weigh both positive and negative comments.' },
        { step: 'The concluding sentence explicitly splits the audience: "fans... may find enough... but anyone hoping for a satisfying resolution will likely leave disappointed" — a genuinely mixed, conditional verdict.', justification: 'The conclusion is the clearest signal of the overall judgement.' },
      ], answer: 'Mixed verdict — recommended only for a specific audience (atmospheric horror fans), not universally' },
    ],
    knowledgeChecks: [
      { question: 'Which is an opinion in the review, not a fact?', options: ['"none of them land with any real weight"', '"a missing hiker in a fog-shrouded forest"', 'The film is called "Nightfall at Hollow Creek"', 'The lead actress gives a performance'], correctIndex: 0, explanation: 'This is an evaluative judgement about the twists\' effectiveness — an opinion.', misconceptionId: 'fact-opinion-confused' },
      { question: 'What is the review\'s overall verdict?', options: ['Mixed — praises some elements, criticises others, recommends conditionally', 'Purely negative throughout', 'Purely positive throughout', 'No verdict is given at all'], correctIndex: 0, explanation: 'The review balances praise and criticism, ending with a conditional recommendation.', misconceptionId: 'review-verdict-not-identified' },
    ],
    confidenceCheckPrompt: 'How confident do you feel separating fact from opinion and identifying a review\'s overall verdict?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'read-formal-informative-texts', revealSteps: 1, prompt: 'According to the minutes, what action was assigned, and to whom?', steps: [
        { step: 'Point 4: "Mr. Khumalo to submit a budget request to the SGB by 21 March."', justification: 'Directly stated action item.' },
      ], answer: 'Mr. Khumalo — submit a budget request by 21 March' },
      { id: 'fp-partial-1', objectiveId: 'distinguish-fact-opinion', revealSteps: 1, prompt: 'Is "the lead performance is committed" a fact or an opinion?', steps: [
        { step: '"Committed" is a subjective judgement about acting quality.', justification: 'Check for evaluative language.' },
        { step: 'This is an opinion, not a verifiable fact.', justification: 'Personal judgements about quality are opinions.' },
      ], answer: 'Opinion' },
      { id: 'fp-independent-1', objectiveId: 'identify-review-verdict', revealSteps: 0, prompt: 'Would this review recommend the film to someone who wants a clear, satisfying ending?', steps: [
        { step: 'The review explicitly states such viewers "will likely leave disappointed" — a clear conditional non-recommendation for that specific audience.', justification: 'Match the verdict to the specific viewer type asked about.' },
      ], answer: 'No — the review explicitly warns this audience will likely be disappointed' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'read-formal-informative-texts', question: 'What time did the meeting in the minutes close?', options: ['13:52', '13:15', '14:00', 'Not stated'], correctIndex: 0, hints: { strategic: 'Check the final point of the minutes.', procedural: 'Point 5 states the closing time.', workedStep: '13:52.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'distinguish-fact-opinion', question: 'Which is a fact, not an opinion, from the minutes?', options: ['"the proposal was seconded and passed unanimously"', '"This was a great meeting"', '"Everyone loved the idea"', '"It was the best proposal ever"'], correctIndex: 0, hints: { strategic: 'Which is verifiable, neutral, and factual?', procedural: 'The first option is a neutral record of what happened.', workedStep: 'It is a fact.' }, distractorMisconceptions: { 1: 'formal-text-tone-misjudged' } },
      { id: 'ip-3', objectiveId: 'analyse-media-text-bias', question: 'Does the review show signs of strong bias toward hating the film entirely?', options: ['No — it balances genuine praise with genuine criticism', 'Yes, it is entirely negative', 'Yes, it is entirely positive', 'The review gives no evaluative comments at all'], correctIndex: 0, hints: { strategic: 'Check whether both praise and criticism appear.', procedural: 'The review praises cinematography and the lead performance too.', workedStep: 'It balances both — not strongly biased.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'identify-review-verdict', question: 'Who does the review suggest SHOULD watch the film?', options: ['Fans of atmospheric horror specifically', 'Nobody at all', 'Everyone, unconditionally', 'Only critics'], correctIndex: 0, hints: { strategic: 'Look at the specific audience named in the conclusion.', procedural: '"Fans of atmospheric horror may find enough here..."', workedStep: 'Fans of atmospheric horror.' }, distractorMisconceptions: { 1: 'review-verdict-not-identified' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'read-formal-informative-texts', multiSelect: false, question: 'Who chaired the meeting in the minutes?', options: ['Ms. Adams', 'Mr. Khumalo', 'A learner representative', 'Not stated'], correctIndices: [0], explanation: 'Directly stated: "Present: Ms. Adams (Chair)."', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'read-formal-informative-texts', multiSelect: false, question: 'True or false: minutes are typically written in a neutral, factual tone.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is standard convention for formal minutes.', distractorMisconceptions: { 1: 'formal-text-tone-misjudged' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'read-formal-informative-texts', multiSelect: false, question: 'What is the main purpose of an agenda, as distinct from minutes?', options: ['To list what will be discussed, before the meeting', 'To record what was decided, after the meeting', 'They serve identical purposes', 'To review the previous term\'s work'], correctIndices: [0], explanation: 'An agenda looks forward, unlike minutes which look back.', distractorMisconceptions: { 1: 'informative-text-purpose-misunderstood' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'distinguish-fact-opinion', multiSelect: false, question: 'Which is an opinion in the review?', options: ['"the plot loses its nerve halfway through"', 'The film is titled "Nightfall at Hollow Creek"', 'There is a missing hiker in the plot', 'The setting is a forest'], correctIndices: [0], explanation: 'This is an evaluative judgement about the plot\'s quality, not a neutral fact.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'distinguish-fact-opinion', multiSelect: false, question: 'True or false: a fact must be verifiable or checkable, while an opinion is a personal judgement.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is the core distinction.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'identify-review-verdict', multiSelect: false, question: 'What overall verdict does the review reach?', options: ['A mixed, conditional recommendation depending on the viewer', 'A completely negative verdict with no positives', 'A completely positive verdict with no criticism', 'No clear verdict is given'], correctIndices: [0], explanation: 'The review balances praise and criticism, recommending only to a specific audience.', distractorMisconceptions: { 1: 'review-verdict-not-identified', 2: 'review-verdict-not-identified' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'analyse-media-text-bias', multiSelect: false, question: 'What does the reviewer\'s inclusion of BOTH praise and criticism suggest about the review\'s approach?', options: ['A genuine, balanced critical evaluation rather than a one-sided reaction', 'The reviewer is confused and inconsistent', 'The reviewer didn\'t actually watch the film', 'The review has no real opinion at all'], correctIndices: [0], explanation: 'Balancing praise and criticism is a sign of genuine, considered evaluation.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'distinguish-fact-opinion', multiSelect: true, question: 'Which of these are opinions (not facts) from the texts studied? (select all that apply)', options: ['"the cinematography is genuinely striking"', '"the meeting was opened at 13:15"', '"anyone hoping for a satisfying resolution will likely leave disappointed"', '"the proposal was seconded"'], correctIndices: [0, 2], explanation: 'Both involve evaluative judgement (about visual quality and about audience reaction/satisfaction). The other two are neutral factual records.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'distinguish-fact-opinion',
      analogy: 'Think of the "courtroom test": a FACT is something you could prove with evidence in court (a date, a measurement, a recorded event). An OPINION is a judgement no amount of evidence can fully "prove" — it depends on personal taste or evaluation, even if reasonable people could disagree.',
      explanation: 'For any statement, ask: "Could this be checked/verified objectively?" If yes, it\'s a fact. If it depends on judgement, taste, or evaluation (look for words like "great," "disappointing," "striking," "boring"), it\'s an opinion.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Classify: "The concert started at 8pm" vs. "The concert was absolutely incredible."', steps: [
          { step: '"Started at 8pm" — verifiable, checkable against a schedule or recording. Fact.', justification: 'Apply the courtroom test.' },
          { step: '"Absolutely incredible" — a personal judgement about quality, not verifiable. Opinion.', justification: 'This depends on personal taste/evaluation.' },
        ], answer: 'First is fact; second is opinion' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'distinguish-fact-opinion', question: 'Classify: "The book has 300 pages."', options: ['Fact', 'Opinion', 'Neither', 'Both'], correctIndex: 0, hints: { strategic: 'Can this be verified/checked?', procedural: 'Yes — count the pages.', workedStep: 'Fact.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'distinguish-fact-opinion', question: 'Classify: "That was the best book I\'ve ever read."', options: ['Opinion', 'Fact', 'Neither', 'Both'], correctIndex: 0, hints: { strategic: 'Does this depend on personal judgement?', procedural: 'Yes — "best" is a subjective evaluation.', workedStep: 'Opinion.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'distinguish-fact-opinion', question: 'Classify: "The team won the match 3-1."', options: ['Fact', 'Opinion', 'Neither', 'Both'], correctIndex: 0, hints: { strategic: 'Can this be verified against a scoreboard?', procedural: 'Yes.', workedStep: 'Fact.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the "courtroom test" for telling fact from opinion?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel reading formal texts and critical reviews now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What should you always check for when trying to find a review\'s overall verdict?', type: 'multiple-choice', options: ['Weigh ALL the evaluative comments together, especially the conclusion', 'Only read the first sentence', 'Only look for negative comments', 'Ignore the conclusion entirely'] },
  ],
};
