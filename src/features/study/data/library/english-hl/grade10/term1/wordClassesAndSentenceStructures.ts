// ── English HL, Term 1, Topic 1: Word Classes and Sentence Structures ────────
// First English topic — Language Structures & Conventions strand, the
// closest fit to the existing engine per
// .planning/research/LIBRARY_ENGLISH_HL_RESEARCH.md (rule-based, has a
// genuine correct answer, transfers the worked-example/misconception/quiz
// pattern almost unchanged).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'noun-verb-confused-by-position',
    label: 'Identifying a word class by its position in the sentence rather than its function',
    errorType: 'You classified a word based on where it sits in the sentence, rather than what job it is doing.',
    principle: 'The same word can belong to different word classes depending on its function in a specific sentence — always check what the word is DOING (naming a thing? showing an action? describing?), not just where it sits.',
    correctStep: '"Run" is a verb in "I run every day" but a noun in "I went for a run" — same word, different function.',
  },
  {
    id: 'subject-verb-agreement-error',
    label: 'Making a subject-verb agreement error with a compound or collective subject',
    errorType: 'You matched the verb to the nearest noun instead of the true grammatical subject.',
    principle: 'The verb must agree with the TRUE subject of the sentence, not just the nearest noun — this matters especially with phrases between the subject and verb, or with collective nouns (which are usually treated as singular).',
    correctStep: '"The list of items IS on the table" (not "are") — the subject is "list" (singular), not "items".',
  },
  {
    id: 'clause-vs-phrase-confused',
    label: 'Confusing a clause with a phrase',
    errorType: 'You labelled a group of words as a clause when it was actually a phrase, or vice versa.',
    principle: 'A CLAUSE contains a subject AND a verb (e.g. "because she left"). A PHRASE does not contain both (e.g. "in the morning," "running quickly").',
    correctStep: '"After the storm passed" is a clause (subject "storm", verb "passed"). "After the storm" alone is a phrase (no verb).',
  },
  {
    id: 'main-subordinate-clause-confused',
    label: 'Not identifying which clause is main and which is subordinate in a complex sentence',
    errorType: 'You couldn\'t tell which clause could stand alone as a complete sentence.',
    principle: 'A MAIN clause can stand alone as a complete sentence. A SUBORDINATE clause CANNOT stand alone — it depends on the main clause and often starts with a word like "because," "although," "when," or "which."',
    correctStep: '"She stayed home because she was ill": "She stayed home" is the main clause (complete alone); "because she was ill" is subordinate (incomplete alone).',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 1,
  topicId: 'word-classes-and-sentence-structures',
  topicName: 'Word Classes and Sentence Structures',
  prerequisites: [
    'Basic sentence reading and writing from earlier grades',
  ],
  objectives: [
    { id: 'identify-word-classes', text: 'Identify the word class (part of speech) of a word based on its function in a sentence.' },
    { id: 'apply-subject-verb-agreement', text: 'Apply correct subject-verb agreement, including with compound and collective subjects.' },
    { id: 'distinguish-clause-phrase', text: 'Distinguish a clause from a phrase.' },
    { id: 'classify-sentence-types', text: 'Classify a sentence as simple, compound, or complex based on its clause structure.' },
  ],
  estimatedMinutes: [20, 30],
};

export const wordClassesAndSentenceStructures: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Can the same word be two different word classes?',
  goalSettingPrompt:
    'Every word in a sentence has a job to do — and the same word can have different jobs in different sentences. By the end of this lesson you\'ll be able to identify word classes by function, and classify sentences by their clause structure.',

  activate: {
    connectPrompt: 'You already use word classes and sentences correctly in everyday speech and writing — this lesson makes that knowledge explicit and precise.',
    diagnosticQuestions: [
      { question: 'In "The dog barked loudly," which word describes HOW the dog barked?', options: ['loudly', 'dog', 'barked', 'the'], correctIndex: 0, explanation: '"Loudly" describes the manner of the action — this is an adverb.' },
      { question: 'In "She is happy," which word describes the subject "she"?', options: ['happy', 'is', 'she', 'none'], correctIndex: 0, explanation: '"Happy" describes "she" — this is an adjective.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Word classes are defined by FUNCTION, not fixed identity — the same word can be a different class depending on the sentence. Key classes: NOUNS name people/places/things/ideas; VERBS show actions or states of being; ADJECTIVES describe nouns; ADVERBS describe verbs, adjectives, or other adverbs (often answering how/when/where); PRONOUNS replace nouns; PREPOSITIONS show relationships (position, time, direction); CONJUNCTIONS join words or clauses. Always ask: "what job is this word doing HERE?"',
    workedExamples: [
      { id: 'wx-word-class-function', prompt: 'Identify the word class of "light" in two different sentences: (a) "Turn on the light." (b) "The bag is light."', steps: [
        { step: '(a) "Light" names a thing (the object being turned on) — it is a NOUN here.', justification: 'It functions as the object being acted upon.' },
        { step: '(b) "Light" describes the bag (not heavy) — it is an ADJECTIVE here.', justification: 'It describes a quality of the noun "bag".' },
      ], answer: '(a) noun, (b) adjective — same word, different function' },
      { id: 'wx-adverb-identification', prompt: 'Identify the adverb in "She quickly finished her homework yesterday."', steps: [
        { step: 'Look for a word describing HOW, WHEN, or WHERE the action happened.', justification: 'Adverbs typically answer these questions about a verb.' },
        { step: '"Quickly" describes HOW she finished; "yesterday" describes WHEN — both are adverbs.', justification: 'Two separate adverbs can appear in one sentence, describing different aspects.' },
      ], answer: '"Quickly" and "yesterday" are both adverbs' },
    ],
    knowledgeChecks: [
      { question: 'In "I went for a run this morning," what word class is "run"?', options: ['Noun', 'Verb', 'Adjective', 'Adverb'], correctIndex: 0, explanation: 'Here "run" names the activity (a thing you went for) — it functions as a noun.', misconceptionId: 'noun-verb-confused-by-position' },
      { question: 'In "The tall boy runs fast," what word class is "tall"?', options: ['Adjective', 'Adverb', 'Noun', 'Verb'], correctIndex: 0, explanation: '"Tall" describes the noun "boy" — an adjective.', misconceptionId: 'noun-verb-confused-by-position' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying word classes by their function in a sentence?',
  },

  demonstrateChunk2: {
    explanation:
      'SUBJECT-VERB AGREEMENT means the verb must match the TRUE subject in number (singular/plural) — watch for phrases between subject and verb, and collective nouns (like "team," "family," "list"), which are usually singular. A CLAUSE has both a subject and a verb; a PHRASE does not. A MAIN clause can stand alone as a sentence; a SUBORDINATE clause cannot. Sentences are classified by their clauses: SIMPLE (one main clause), COMPOUND (two or more main clauses joined by "and," "but," "or"), COMPLEX (a main clause plus one or more subordinate clauses).',
    workedExamples: [
      { id: 'wx-subject-verb-agreement', prompt: 'Choose the correct verb: "The basket of apples ___ on the table." (is/are)', steps: [
        { step: 'Identify the true subject: "basket" (singular), not "apples" (the noun closest to the verb).', justification: 'The prepositional phrase "of apples" describes the basket but isn\'t the subject.' },
        { step: 'Since "basket" is singular, the verb must be "is".', justification: 'The verb agrees with the true subject, not the nearest noun.' },
      ], answer: '"is" — "The basket of apples is on the table."' },
      { id: 'wx-sentence-classification', prompt: 'Classify: "Although it was raining, she went for a walk, and she enjoyed it."', steps: [
        { step: '"Although it was raining" is a subordinate clause (cannot stand alone).', justification: 'It depends on the rest of the sentence for meaning.' },
        { step: '"She went for a walk" and "she enjoyed it" are both main clauses, joined by "and".', justification: 'Both can stand alone as complete sentences.' },
        { step: 'One subordinate clause plus two main clauses joined by a conjunction makes this a complex sentence with a compound element — commonly classified as complex overall since it contains a subordinate clause.', justification: 'The presence of any subordinate clause makes a sentence at least complex.' },
      ], answer: 'Complex sentence (contains a subordinate clause)' },
    ],
    knowledgeChecks: [
      { question: 'Which of these is a clause, not a phrase?', options: ['"When the bell rang"', '"In the classroom"', '"Running quickly"', '"After lunch"'], correctIndex: 0, explanation: '"When the bell rang" has a subject ("bell") and a verb ("rang") — a clause. The others lack a verb.', misconceptionId: 'clause-vs-phrase-confused' },
      { question: 'In "He left early because he felt ill," which is the main clause?', options: ['"He left early"', '"because he felt ill"', 'Both are main clauses', 'Neither is a clause'], correctIndex: 0, explanation: '"He left early" can stand alone as a complete sentence — it is the main clause.', misconceptionId: 'main-subordinate-clause-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying subject-verb agreement and classifying sentences by clause structure?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'identify-word-classes', revealSteps: 1, prompt: 'Identify the word class of "carefully" in "She carefully wrapped the gift."', steps: [
        { step: '"Carefully" describes HOW she wrapped the gift — this is an adverb.', justification: 'It modifies the verb "wrapped".' },
      ], answer: 'Adverb' },
      { id: 'fp-partial-1', objectiveId: 'apply-subject-verb-agreement', revealSteps: 1, prompt: 'Choose the correct verb: "Neither of the students ___ ready." (is/are)', steps: [
        { step: 'The true subject is "neither" (singular), not "students".', justification: '"Neither" as a subject is treated as singular.' },
        { step: 'The correct verb is "is".', justification: 'Singular subject needs singular verb.' },
      ], answer: '"is" — "Neither of the students is ready."' },
      { id: 'fp-independent-1', objectiveId: 'classify-sentence-types', revealSteps: 0, prompt: 'Classify: "The sun set, and the sky turned orange."', steps: [
        { step: 'Two main clauses ("the sun set" and "the sky turned orange") joined by "and", with no subordinate clause.', justification: 'This matches the definition of a compound sentence.' },
      ], answer: 'Compound sentence' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'identify-word-classes', question: 'In "The clock ticked slowly," what word class is "slowly"?', options: ['Adverb', 'Adjective', 'Noun', 'Verb'], correctIndex: 0, hints: { strategic: 'Does it describe the verb "ticked"?', procedural: 'It describes HOW the clock ticked.', workedStep: 'Adverb.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'apply-subject-verb-agreement', question: 'Choose correctly: "The committee of teachers ___ meeting today." (is/are)', options: ['is', 'are', 'were', 'be'], correctIndex: 0, hints: { strategic: 'Find the true subject.', procedural: '"Committee" (singular collective noun) is the subject, not "teachers".', workedStep: '"is".' }, distractorMisconceptions: { 1: 'subject-verb-agreement-error' } },
      { id: 'ip-3', objectiveId: 'distinguish-clause-phrase', question: 'Which of these is a phrase, not a clause?', options: ['"Before the game started"', '"During the game"', '"When the game started"', '"As the game started"'], correctIndex: 1, hints: { strategic: 'Look for a subject AND a verb.', procedural: '"During the game" has no verb.', workedStep: 'It\'s a phrase.' }, distractorMisconceptions: { 0: 'clause-vs-phrase-confused' } },
      { id: 'ip-4', objectiveId: 'classify-sentence-types', question: 'Classify: "I like tea."', options: ['Simple sentence', 'Compound sentence', 'Complex sentence', 'Not a sentence'], correctIndex: 0, hints: { strategic: 'Count the clauses.', procedural: 'Just one main clause, no subordinate clause.', workedStep: 'Simple sentence.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'identify-word-classes', multiSelect: false, question: 'In "The book on the table is mine," what word class is "on"?', options: ['Preposition', 'Adverb', 'Noun', 'Verb'], correctIndices: [0], explanation: '"On" shows the relationship between "book" and "table" — a preposition.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'identify-word-classes', multiSelect: false, question: 'In "They visited the beautiful garden," what word class is "beautiful"?', options: ['Adjective', 'Adverb', 'Noun', 'Verb'], correctIndices: [0], explanation: 'It describes the noun "garden" — an adjective.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-subject-verb-agreement', multiSelect: false, question: 'Choose correctly: "One of the boxes ___ missing." (is/are)', options: ['is', 'are', 'were', 'be'], correctIndices: [0], explanation: 'The subject is "one" (singular), not "boxes".', distractorMisconceptions: { 1: 'subject-verb-agreement-error' } },
    { id: 'q4', type: 'true-false', objectiveId: 'apply-subject-verb-agreement', multiSelect: false, question: 'True or false: collective nouns like "team" or "family" are usually treated as singular.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — collective nouns are usually singular in standard usage.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'distinguish-clause-phrase', multiSelect: false, question: 'Which contains a subject and a verb (making it a clause)?', options: ['"Since the rain stopped"', '"After the rain"', '"Despite the rain"', '"In heavy rain"'], correctIndices: [0], explanation: '"Since the rain stopped" has subject "rain" and verb "stopped".', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'classify-sentence-types', multiSelect: false, question: 'Classify: "Because she studied hard, she passed the exam."', options: ['Complex sentence', 'Simple sentence', 'Compound sentence', 'Not a sentence'], correctIndices: [0], explanation: 'Contains a subordinate clause ("because she studied hard") plus a main clause — complex.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'classify-sentence-types', multiSelect: false, question: 'Classify: "He ran, he jumped, and he swam."', options: ['Compound sentence', 'Simple sentence', 'Complex sentence', 'Not a sentence'], correctIndices: [0], explanation: 'Three main clauses joined together — compound.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-word-classes', multiSelect: true, question: 'Which of these words can function as EITHER a noun OR a verb, depending on the sentence? (select all that apply)', options: ['run', 'light', 'quickly', 'watch'], correctIndices: [0, 1, 3], explanation: '"Run," "light," and "watch" can all be nouns or verbs depending on context. "Quickly" is always an adverb.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-subject-verb-agreement',
      analogy: 'Think of finding the true subject like tracing a phone call back to who\'s actually speaking — ignore anyone else mentioned along the way (the phrase in between) and match the verb to the real "speaker" (the subject), not whoever\'s name was mentioned most recently.',
      explanation: 'To find the true subject: cross out any phrase starting with a preposition (like "of," "with," "in") between the subject and the verb — what\'s left is your real subject to match the verb to.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Choose correctly: "The players on the team ___ excited." (is/are)', steps: [
          { step: 'Cross out "on the team" (a prepositional phrase).', justification: 'This phrase describes but isn\'t part of the subject.' },
          { step: 'What remains: "The players ___ excited" — "players" is plural.', justification: 'The true subject is "players", not "team".' },
          { step: 'Correct verb: "are".', justification: 'Plural subject needs plural verb.' },
        ], answer: '"are" — "The players on the team are excited."' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-subject-verb-agreement', question: 'Choose correctly: "The keys to the car ___ missing." (is/are)', options: ['are', 'is', 'was', 'be'], correctIndex: 0, hints: { strategic: 'Cross out the prepositional phrase.', procedural: '"to the car" is the phrase — true subject is "keys" (plural).', workedStep: '"are".' }, distractorMisconceptions: { 1: 'subject-verb-agreement-error' } },
        { id: 'rem-p2', objectiveId: 'apply-subject-verb-agreement', question: 'Choose correctly: "The bouquet of roses ___ lovely." (is/are)', options: ['is', 'are', 'were', 'be'], correctIndex: 0, hints: { strategic: 'Cross out the prepositional phrase.', procedural: '"of roses" is the phrase — true subject is "bouquet" (singular).', workedStep: '"is".' }, distractorMisconceptions: { 1: 'subject-verb-agreement-error' } },
        { id: 'rem-p3', objectiveId: 'apply-subject-verb-agreement', question: 'Choose correctly: "The results of the survey ___ surprising." (is/are)', options: ['are', 'is', 'was', 'be'], correctIndex: 0, hints: { strategic: 'Cross out the prepositional phrase.', procedural: '"of the survey" is the phrase — true subject is "results" (plural).', workedStep: '"are".' }, distractorMisconceptions: { 1: 'subject-verb-agreement-error' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'How can the same word belong to different word classes in different sentences?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel identifying word classes and sentence types now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What trick will you use to find the TRUE subject of a sentence for agreement?', type: 'multiple-choice', options: ['Cross out prepositional phrases between subject and verb', 'Always match the nearest noun', 'Guess based on what sounds right', 'Ignore agreement rules entirely'] },
  ],
};
