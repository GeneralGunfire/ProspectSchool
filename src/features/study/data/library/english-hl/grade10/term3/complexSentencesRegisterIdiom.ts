// ── English HL, Term 3, Topic 1: Complex Sentences, Register and Idiom ───────
// Builds on Term 1-2 sentence/clause work. Per
// .planning/research/LIBRARY_ENGLISH_HL_RESEARCH.md's Term 3/4 follow-up
// pass, Term 3 emphasises editing/complex clause work plus register and
// idiom in context (reviews, articles, speeches).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'multiple-subordinate-clauses-misidentified',
    label: 'Losing track of which clause is main when a sentence has multiple subordinate clauses',
    errorType: 'You misidentified the main clause in a sentence containing more than one subordinate clause.',
    principle: 'A sentence can have several subordinate clauses, but only ONE (or more, if compound-complex) main clause that could stand alone — isolate each subordinate clause first (they typically start with words like "because," "although," "which," "when"), and whatever remains is the main clause.',
    correctStep: '"Although it was raining, which surprised no one, we went out because we were bored": main clause = "we went out"; the other two are subordinate.',
  },
  {
    id: 'register-mismatch',
    label: 'Using informal language in a formal context, or overly formal language in an informal context',
    errorType: 'You chose a register that didn\'t match the text type\'s purpose and audience.',
    principle: 'REGISTER is the level of formality appropriate to a text\'s purpose and audience. A formal letter or report needs formal register (no slang/contractions); a friendly text message or informal letter can use casual language.',
    correctStep: '"I would like to formally request..." suits a business letter; "Hey, can I ask you something?" suits an informal message — using either in the wrong context is a register mismatch.',
  },
  {
    id: 'idiom-interpreted-literally',
    label: 'Interpreting an idiom literally instead of understanding its figurative meaning',
    errorType: 'You took an idiomatic expression at face value rather than recognising its established figurative meaning.',
    principle: 'An IDIOM is an expression whose figurative meaning differs from its literal words — you must know the established meaning, not work it out literally.',
    correctStep: '"It\'s raining cats and dogs" doesn\'t literally mean animals are falling from the sky — it figuratively means it\'s raining very heavily.',
  },
  {
    id: 'conditional-sentence-tense-error',
    label: 'Using the wrong tense combination in a conditional ("if") sentence',
    errorType: 'You mismatched the tenses in the "if" clause and the main clause of a conditional sentence.',
    principle: 'Different conditional types need specific tense pairings: real/possible future ("If it rains, we will stay in" — present + will); unreal present ("If I were rich, I would travel" — past + would); unreal past ("If I had known, I would have come" — past perfect + would have).',
    correctStep: '"If I was you, I would apologise" (informal but common) is more precisely "If I WERE you..." in formal register — using "were" for hypothetical situations regardless of subject.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 3,
  topicId: 'complex-sentences-register-idiom',
  topicName: 'Complex Sentences, Register and Idiom',
  prerequisites: [
    'Word classes and sentence structures (Term 1)',
    'Direct/indirect speech and active/passive voice (Term 2)',
  ],
  objectives: [
    { id: 'analyse-multi-clause-sentences', text: 'Identify the main and subordinate clauses in a sentence with multiple subordinate clauses.' },
    { id: 'apply-conditional-sentences', text: 'Construct conditional sentences with correct tense pairings.' },
    { id: 'match-register-to-context', text: 'Choose language register appropriate to a text\'s purpose and audience.' },
    { id: 'interpret-idioms', text: 'Interpret common idioms and proverbs by their figurative, not literal, meaning.' },
  ],
  estimatedMinutes: [20, 30],
};

export const complexSentencesRegisterIdiom: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Why doesn\'t "it\'s raining cats and dogs" mean what it literally says?',
  goalSettingPrompt:
    'This lesson builds three more advanced language skills: untangling sentences with multiple clauses, matching your language register to your audience, and understanding idioms by their real, figurative meaning.',

  activate: {
    connectPrompt: 'You already know main and subordinate clauses from Term 1 — this lesson applies that to more complex sentences.',
    diagnosticQuestions: [
      { question: 'In "She left because she was tired," which is the main clause?', options: ['"She left"', '"because she was tired"', 'Both are main clauses', 'Neither is a clause'], correctIndex: 0, explanation: '"She left" can stand alone as a complete sentence.' },
      { question: 'What does "register" mean in language?', options: ['The level of formality appropriate to context', 'A type of punctuation', 'A verb tense', 'A figure of speech'], correctIndex: 0, explanation: 'Register refers to formality level matched to purpose and audience.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A sentence can contain MULTIPLE subordinate clauses. To find the main clause: isolate each subordinate clause first (they typically start with words like "because," "although," "which," "when," "if"), and whatever remains is the main clause. CONDITIONAL sentences ("if" sentences) need specific tense pairings: real/possible future uses present + "will"; unreal present uses past + "would"; unreal past uses past perfect + "would have."',
    workedExamples: [
      { id: 'wx-multi-clause', prompt: 'Identify the main clause: "Although she was nervous, which was unusual for her, she gave the speech because the team needed her."', steps: [
        { step: 'Isolate subordinate clauses: "Although she was nervous," "which was unusual for her," "because the team needed her."', justification: 'Each starts with a subordinating word.' },
        { step: 'What remains: "she gave the speech" — this is the main clause.', justification: 'It can stand alone as a complete sentence.' },
      ], answer: 'Main clause: "she gave the speech"' },
      { id: 'wx-conditional', prompt: 'Complete correctly: "If I ___ (know) the answer, I would have told you." Identify the conditional type.', steps: [
        { step: 'This describes an unreal PAST situation (I didn\'t know, so I didn\'t tell you).', justification: 'Identify which type of conditional this is.' },
        { step: 'Unreal past needs past perfect in the "if" clause: "If I had known the answer, I would have told you."', justification: 'Apply the correct tense pairing for this conditional type.' },
      ], answer: '"had known" — unreal past conditional' },
    ],
    knowledgeChecks: [
      { question: 'Identify the main clause: "When the bell rang, which everyone had been waiting for, the students rushed outside."', options: ['"the students rushed outside"', '"When the bell rang"', '"which everyone had been waiting for"', 'There is no main clause'], correctIndex: 0, explanation: 'This is the only part that can stand alone as a complete sentence.', misconceptionId: 'multiple-subordinate-clauses-misidentified' },
      { question: 'Complete correctly (unreal present): "If I ___ (be) taller, I would join the basketball team."', options: ['were', 'am', 'was', 'will be'], correctIndex: 0, explanation: 'Unreal present conditionals use "were" (not "was") for all subjects in formal register.', misconceptionId: 'conditional-sentence-tense-error' },
    ],
    confidenceCheckPrompt: 'How confident do you feel with multi-clause sentences and conditional tense pairings?',
  },

  demonstrateChunk2: {
    explanation:
      'REGISTER is the level of formality matched to a text\'s purpose and audience — formal for business letters/reports, informal for friendly messages. Mismatching register (too casual for a formal context, or stiffly formal for a casual one) undermines your writing\'s effectiveness. An IDIOM is an expression whose figurative meaning differs entirely from its literal words — you must know the established meaning, since working it out literally leads you astray.',
    workedExamples: [
      { id: 'wx-register-match', prompt: 'Which register suits a formal letter of complaint: "This is honestly so annoying, please just fix it" or "I am writing to express my dissatisfaction with the service received"?', steps: [
        { step: 'The first uses casual language ("honestly," "just fix it") unsuited to a formal complaint.', justification: 'Assess the formality level of each option.' },
        { step: 'The second uses formal, measured language appropriate to a business context.', justification: 'Match register to the text type\'s purpose and audience.' },
      ], answer: '"I am writing to express my dissatisfaction with the service received" — matches formal register' },
      { id: 'wx-idiom-meaning', prompt: 'What does "bite the bullet" mean, and why is a literal reading wrong?', steps: [
        { step: 'Literally, it would suggest biting an actual bullet — a nonsensical, unrelated action.', justification: 'Recognise the literal reading doesn\'t fit typical usage.' },
        { step: 'Figuratively, it means to face a difficult or unpleasant situation with courage, accepting it\'s unavoidable.', justification: 'This is the established idiomatic meaning, unrelated to the literal words.' },
      ], answer: 'To face a difficult situation bravely — the literal words are unrelated to the actual meaning' },
    ],
    knowledgeChecks: [
      { question: 'Which sentence matches formal register, appropriate for a school report?', options: ['"The student demonstrated consistent improvement throughout the term."', '"This kid did way better this term, ngl."', '"They\'re doing great, love to see it!"', '"Not bad, could be worse."'], correctIndex: 0, explanation: 'This uses formal, precise, professional language suited to an official report.', misconceptionId: 'register-mismatch' },
      { question: 'What does "the ball is in your court" mean?', options: ['It is now your responsibility to take the next action', 'Someone literally has a ball', 'You are playing a sport', 'You have made a mistake'], correctIndex: 0, explanation: 'This idiom figuratively means it\'s your turn to act or decide.', misconceptionId: 'idiom-interpreted-literally' },
    ],
    confidenceCheckPrompt: 'How confident do you feel matching register to context and interpreting idioms correctly?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'analyse-multi-clause-sentences', revealSteps: 1, prompt: 'Identify the main clause: "Because the shop was closing, and since it had started to rain, we hurried home."', steps: [
        { step: 'Subordinate clauses: "Because the shop was closing," "since it had started to rain." Main clause: "we hurried home."', justification: 'Isolate the subordinate clauses first.' },
      ], answer: 'Main clause: "we hurried home"' },
      { id: 'fp-partial-1', objectiveId: 'apply-conditional-sentences', revealSteps: 1, prompt: 'Complete correctly (real future): "If you ___ (study) hard, you will pass."', steps: [
        { step: 'Real/possible future conditionals use present tense in the "if" clause.', justification: 'Identify the conditional type.' },
        { step: '"study" (present tense).', justification: 'Apply the correct tense.' },
      ], answer: '"study"' },
      { id: 'fp-independent-1', objectiveId: 'match-register-to-context', revealSteps: 0, prompt: 'Which is more appropriate for a job application email: "Yo, hire me, I\'m great" or "I am confident that my skills and experience make me a strong candidate for this position"?', steps: [
        { step: 'A job application needs formal, professional register — the second option matches this.', justification: 'Match register to the high-stakes formal context.' },
      ], answer: '"I am confident that my skills and experience make me a strong candidate..."' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'analyse-multi-clause-sentences', question: 'Identify the main clause: "Since she arrived late, which annoyed her boss, she apologised immediately."', options: ['"she apologised immediately"', '"Since she arrived late"', '"which annoyed her boss"', 'There is no main clause'], correctIndex: 0, hints: { strategic: 'Isolate each subordinate clause.', procedural: 'Two subordinate clauses start with "since" and "which".', workedStep: 'The remaining clause is the main one.' }, distractorMisconceptions: { 1: 'multiple-subordinate-clauses-misidentified' } },
      { id: 'ip-2', objectiveId: 'apply-conditional-sentences', question: 'Complete correctly (unreal past): "If she ___ (leave) earlier, she would have caught the bus."', options: ['had left', 'left', 'leaves', 'would leave'], correctIndex: 0, hints: { strategic: 'Unreal past needs past perfect.', procedural: '"had left".', workedStep: '"had left".' }, distractorMisconceptions: { 1: 'conditional-sentence-tense-error' } },
      { id: 'ip-3', objectiveId: 'match-register-to-context', question: 'Which register suits a text message to a close friend?', options: ['"Hey! Free this weekend?"', '"I am writing to enquire about your availability this weekend."', '"To Whom It May Concern: are you free?"', '"I would be most grateful if you could confirm your availability."'], correctIndex: 0, hints: { strategic: 'A close friend text needs casual, not formal, register.', procedural: 'The first option is casual and appropriate.', workedStep: '"Hey! Free this weekend?"' }, distractorMisconceptions: { 1: 'register-mismatch' } },
      { id: 'ip-4', objectiveId: 'interpret-idioms', question: 'What does "break the ice" mean?', options: ['To ease tension or start a conversation in an awkward situation', 'To literally break ice', 'To end a friendship', 'To make someone angry'], correctIndex: 0, hints: { strategic: 'Think figuratively, not literally.', procedural: 'It relates to easing initial awkwardness.', workedStep: 'To ease tension/start a conversation.' }, distractorMisconceptions: { 1: 'idiom-interpreted-literally' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'analyse-multi-clause-sentences', multiSelect: false, question: 'Identify the main clause: "Although he was tired, because he had worked all night, he finished the report."', options: ['"he finished the report"', '"Although he was tired"', '"because he had worked all night"', 'There is no main clause'], correctIndices: [0], explanation: 'This is the only clause that can stand alone.', distractorMisconceptions: { 1: 'multiple-subordinate-clauses-misidentified' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'apply-conditional-sentences', multiSelect: false, question: 'Complete correctly (unreal present): "If he ___ (have) more time, he would finish the project."', options: ['had', 'has', 'will have', 'would have'], correctIndices: [0], explanation: 'Unreal present uses past tense in the "if" clause.', distractorMisconceptions: { 1: 'conditional-sentence-tense-error' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-conditional-sentences', multiSelect: false, question: 'Complete correctly (real future): "If it ___ (be) sunny tomorrow, we will go to the beach."', options: ['is', 'was', 'were', 'will be'], correctIndices: [0], explanation: 'Real/possible future conditionals use present tense in the "if" clause.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'match-register-to-context', multiSelect: false, question: 'True or false: the same register is appropriate for both a formal report and a text message to a friend.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — register must match the specific context and audience.', distractorMisconceptions: { 0: 'register-mismatch' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'match-register-to-context', multiSelect: false, question: 'Which is appropriate for a formal school report?', options: ['"The learner has shown marked improvement in written expression."', '"This kid\'s writing got way better lol."', '"Not bad I guess."', '"Whatever, it\'s fine."'], correctIndices: [0], explanation: 'Formal, precise, professional language suits an official report.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'interpret-idioms', multiSelect: false, question: 'What does "spill the beans" mean?', options: ['To reveal a secret', 'To literally drop beans', 'To make a mess', 'To cook a meal'], correctIndices: [0], explanation: 'Figuratively means to reveal secret information.', distractorMisconceptions: { 1: 'idiom-interpreted-literally' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'interpret-idioms', multiSelect: false, question: 'What does "under the weather" mean?', options: ['Feeling ill or unwell', 'Standing outside in bad weather', 'Feeling very happy', 'Being very busy'], correctIndices: [0], explanation: 'Figuratively means feeling unwell, unrelated to actual weather.', distractorMisconceptions: { 1: 'idiom-interpreted-literally' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'analyse-multi-clause-sentences', multiSelect: true, question: 'In "Because it was late, and since everyone was tired, we ended the meeting, which relieved us all," which are subordinate clauses? (select all that apply)', options: ['"Because it was late"', '"since everyone was tired"', '"we ended the meeting"', '"which relieved us all"'], correctIndices: [0, 1, 3], explanation: 'Three subordinate clauses surround the one main clause, "we ended the meeting".', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'analyse-multi-clause-sentences',
      analogy: 'Think of finding the main clause like peeling layers off an onion: each subordinate clause (starting with words like "because," "although," "which," "since") is a layer you set aside — what\'s left at the centre, able to stand completely on its own, is the main clause.',
      explanation: 'Scan the sentence for every subordinating word ("because," "although," "which," "since," "when," "if," "that"), mentally bracket off each clause it introduces, and check what remains — that\'s your main clause.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Find the main clause: "While the rain continued, which nobody expected, the game carried on because the players insisted."', steps: [
          { step: 'Bracket subordinate clauses: [While the rain continued], [which nobody expected], [because the players insisted].', justification: 'Identify each subordinating word and its clause.' },
          { step: 'What remains: "the game carried on" — the main clause.', justification: 'This is the only part that can stand alone.' },
        ], answer: 'Main clause: "the game carried on"' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'analyse-multi-clause-sentences', question: 'Find the main clause: "If you arrive early, which would help a lot, we can start on time."', options: ['"we can start on time"', '"If you arrive early"', '"which would help a lot"', 'There is no main clause'], correctIndex: 0, hints: { strategic: 'Bracket off each subordinate clause.', procedural: 'Two subordinate clauses: "If you arrive early" and "which would help a lot".', workedStep: 'Main clause: "we can start on time".' }, distractorMisconceptions: { 1: 'multiple-subordinate-clauses-misidentified' } },
        { id: 'rem-p2', objectiveId: 'analyse-multi-clause-sentences', question: 'Find the main clause: "Though she was scared, because the room was dark, she walked in anyway."', options: ['"she walked in anyway"', '"Though she was scared"', '"because the room was dark"', 'There is no main clause'], correctIndex: 0, hints: { strategic: 'Bracket off each subordinate clause.', procedural: 'Two subordinate clauses: "Though she was scared" and "because the room was dark".', workedStep: 'Main clause: "she walked in anyway".' }, distractorMisconceptions: { 1: 'multiple-subordinate-clauses-misidentified' } },
        { id: 'rem-p3', objectiveId: 'analyse-multi-clause-sentences', question: 'Find the main clause: "As soon as the alarm rang, which startled everyone, the students lined up outside."', options: ['"the students lined up outside"', '"As soon as the alarm rang"', '"which startled everyone"', 'There is no main clause'], correctIndex: 0, hints: { strategic: 'Bracket off each subordinate clause.', procedural: 'Two subordinate clauses: "As soon as..." and "which startled everyone".', workedStep: 'Main clause: "the students lined up outside".' }, distractorMisconceptions: { 1: 'multiple-subordinate-clauses-misidentified' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'How do you find the main clause in a sentence with several subordinate clauses?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with conditionals, register, and idioms now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the biggest risk of interpreting an idiom literally?', type: 'multiple-choice', options: ['Misunderstanding the intended figurative meaning entirely', 'No risk at all', 'It only matters in poetry', 'Idioms are always obvious'] },
  ],
};
