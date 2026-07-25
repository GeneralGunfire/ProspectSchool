// ── English HL, Term 2, Topic 1: Direct/Indirect Speech and Active/Passive Voice ──
// Builds on Term 1's tense/clause work. Rule-based, fits the existing engine
// well per LIBRARY_ENGLISH_HL_RESEARCH.md.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'indirect-speech-tense-not-shifted',
    label: 'Not shifting the tense back when converting direct speech to indirect speech',
    errorType: 'You converted direct speech to indirect speech without changing the tense, even though the reporting verb is in the past.',
    principle: 'When the reporting verb is in the past ("she said"), the tense inside the reported speech usually shifts BACK one step: present becomes past, past becomes past perfect, etc.',
    correctStep: 'Direct: "I am tired," she said. Indirect: She said (that) she was tired — "am" (present) shifts back to "was" (past).',
  },
  {
    id: 'pronoun-not-shifted-indirect',
    label: 'Not changing pronouns appropriately when converting to indirect speech',
    errorType: 'You kept the original speaker\'s pronouns unchanged in indirect speech, creating confusion about who is being referred to.',
    principle: 'Pronouns must shift to match the new perspective of the reporter, not the original speaker. "I" often becomes "he/she," "my" becomes "his/her," etc.',
    correctStep: 'Direct: "I lost my keys," he said. Indirect: He said (that) he had lost his keys — "I"→"he", "my"→"his".',
  },
  {
    id: 'passive-voice-agent-confusion',
    label: 'Losing track of who performs the action when converting to passive voice',
    errorType: 'You converted a sentence to passive voice but confused who the doer of the action actually is.',
    principle: 'In passive voice, the object of the active sentence becomes the SUBJECT, and the original subject (the doer) either moves to a "by ___" phrase or is dropped entirely — but the actual doer of the action never changes, only how it\'s expressed.',
    correctStep: 'Active: "The chef cooked the meal." Passive: "The meal was cooked by the chef." The chef is still the one who cooked, just repositioned in the sentence.',
  },
  {
    id: 'passive-overused-inappropriately',
    label: 'Using passive voice where active voice would be clearer and more direct',
    errorType: 'You used passive voice in a context where active voice would communicate more clearly and directly.',
    principle: 'Passive voice is useful when the DOER is unknown, unimportant, or deliberately de-emphasised — but overusing it (especially in narrative or direct writing) makes prose vague and less engaging. Active voice is usually the stronger default choice.',
    correctStep: '"The ball was thrown by John" (passive, wordy) is usually weaker than "John threw the ball" (active, direct) unless there\'s a specific reason to emphasise the ball.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 2,
  topicId: 'direct-indirect-speech-and-voice',
  topicName: 'Direct/Indirect Speech and Active/Passive Voice',
  prerequisites: [
    'Tenses and punctuation (Term 1, Topic 2)',
  ],
  objectives: [
    { id: 'convert-direct-to-indirect', text: 'Convert direct speech to indirect (reported) speech, shifting tense and pronouns correctly.' },
    { id: 'convert-indirect-to-direct', text: 'Convert indirect speech back to direct speech with correct punctuation.' },
    { id: 'convert-active-to-passive', text: 'Convert an active-voice sentence to passive voice, and identify the true doer of the action.' },
    { id: 'choose-active-or-passive', text: 'Judge when active voice or passive voice is the more appropriate choice.' },
  ],
  estimatedMinutes: [20, 30],
};

export const directIndirectSpeechAndVoice: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What changes when you report what someone said, rather than quoting them directly?',
  goalSettingPrompt:
    'Reporting speech and choosing between active and passive voice both require careful, consistent shifts in tense, pronouns, and sentence structure. By the end of this lesson you\'ll be able to convert confidently between each pair, and choose the right voice for your purpose.',

  activate: {
    connectPrompt: 'You already know tense consistency from Term 1 — that skill is essential for converting direct speech to indirect speech correctly.',
    diagnosticQuestions: [
      { question: 'What tense is "I am happy"?', options: ['Present', 'Past', 'Future', 'Past perfect'], correctIndex: 0, explanation: '"Am" is present tense.' },
      { question: 'What tense would "am" typically shift back to in reported speech?', options: ['Was', 'Is', 'Will be', 'Has been'], correctIndex: 0, explanation: 'Present tense typically shifts back to past tense.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'DIRECT SPEECH quotes someone\'s exact words in quotation marks: "I am tired," she said. INDIRECT (reported) SPEECH reports what was said without quotation marks, usually shifting the TENSE back one step (present→past, past→past perfect) when the reporting verb is in the past, and shifting PRONOUNS to match the new perspective (I→she/he, my→his/her).',
    workedExamples: [
      { id: 'wx-direct-to-indirect', prompt: 'Convert to indirect speech: "I am going to the shop," Thabo said.', steps: [
        { step: 'Reporting verb "said" is past tense, so the reported tense shifts back: "am" (present) → "was" (past).', justification: 'Apply the tense-shift rule.' },
        { step: 'Pronoun shifts: "I" → "he" (since we\'re now reporting, not quoting Thabo directly).', justification: 'Apply the pronoun-shift rule.' },
      ], answer: 'Thabo said (that) he was going to the shop.' },
      { id: 'wx-indirect-to-direct', prompt: 'Convert to direct speech: She said that she had finished her homework.', steps: [
        { step: 'Shift the tense forward: "had finished" (past perfect) → "have finished" (present perfect, as she\'d have said it originally).', justification: 'Reverse the tense-shift rule.' },
        { step: 'Shift the pronoun back: "she" → "I" (her own words).', justification: 'Reverse the pronoun-shift rule, and add quotation marks.' },
      ], answer: '"I have finished my homework," she said.' },
    ],
    knowledgeChecks: [
      { question: 'Convert to indirect speech: "I love this song," Lindiwe said.', options: ['Lindiwe said (that) she loved that song', 'Lindiwe said (that) I love this song', 'Lindiwe said (that) she loves this song', 'Lindiwe said "I love this song"'], correctIndex: 0, explanation: 'Tense shifts back (love→loved), pronoun shifts (I→she), and "this" often shifts to "that".', misconceptionId: 'indirect-speech-tense-not-shifted' },
      { question: 'Convert to indirect speech: "My dog is sick," said Peter.', options: ['Peter said (that) his dog was sick', 'Peter said (that) my dog is sick', 'Peter said (that) his dog is sick', 'Peter said "my dog is sick"'], correctIndex: 0, explanation: 'Pronoun "my" shifts to "his" (Peter\'s perspective, from the reporter\'s view), and tense shifts back.', misconceptionId: 'pronoun-not-shifted-indirect' },
    ],
    confidenceCheckPrompt: 'How confident do you feel converting between direct and indirect speech?',
  },

  demonstrateChunk2: {
    explanation:
      'In ACTIVE VOICE, the subject performs the action: "The chef cooked the meal." In PASSIVE VOICE, the object of the active sentence becomes the subject, and the original doer either moves into a "by ___" phrase or is dropped: "The meal was cooked (by the chef)." The actual doer of the action never changes — only how the sentence is structured. Active voice is usually clearer and more direct; passive voice is useful when the doer is unknown, unimportant, or deliberately de-emphasised — but overusing it makes writing vague.',
    workedExamples: [
      { id: 'wx-active-to-passive', prompt: 'Convert to passive voice: "The committee approved the proposal."', steps: [
        { step: 'Identify the object of the active sentence: "the proposal" — this becomes the new subject.', justification: 'The object of an active sentence becomes the subject in passive voice.' },
        { step: 'Rearrange: "The proposal was approved by the committee."', justification: 'The original subject ("the committee") moves into a "by" phrase.' },
      ], answer: 'The proposal was approved by the committee.' },
      { id: 'wx-choose-voice', prompt: 'Which is more appropriate: "Mistakes were made" or "I made mistakes" — and why?', steps: [
        { step: '"Mistakes were made" (passive) hides who is responsible — often seen as evasive.', justification: 'Consider what each version emphasises or hides.' },
        { step: '"I made mistakes" (active) takes clear ownership and is more direct and honest.', justification: 'Active voice is usually the stronger choice unless there\'s a specific reason to de-emphasise the doer.' },
      ], answer: '"I made mistakes" is usually more appropriate — direct and takes ownership' },
    ],
    knowledgeChecks: [
      { question: 'Convert to passive voice: "The teacher marked the essays."', options: ['The essays were marked by the teacher', 'The teacher was marked by the essays', 'The essays marked the teacher', 'The teacher marks the essays'], correctIndex: 0, explanation: 'The object ("essays") becomes the subject; the teacher moves to a "by" phrase.', misconceptionId: 'passive-voice-agent-confusion' },
      { question: 'When is passive voice most appropriate?', options: ['When the doer is unknown, unimportant, or deliberately de-emphasised', 'Always, since it sounds more formal', 'Never, active voice is always required', 'Only in questions'], correctIndex: 0, explanation: 'Passive voice has specific appropriate uses; it shouldn\'t be the default.', misconceptionId: 'passive-overused-inappropriately' },
    ],
    confidenceCheckPrompt: 'How confident do you feel converting active to passive voice and choosing the right voice for your purpose?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'convert-direct-to-indirect', revealSteps: 1, prompt: 'Convert to indirect speech: "I will call you tomorrow," she said.', steps: [
        { step: '"Will" shifts back to "would"; "I" shifts to "she"; "tomorrow" often shifts to "the next day".', justification: 'Apply all relevant shifts together.' },
      ], answer: 'She said (that) she would call me the next day.' },
      { id: 'fp-partial-1', objectiveId: 'convert-active-to-passive', revealSteps: 1, prompt: 'Convert to passive voice: "The storm destroyed the bridge."', steps: [
        { step: 'The object "the bridge" becomes the subject.', justification: 'Identify the object first.' },
        { step: '"The bridge was destroyed by the storm."', justification: 'Move the original subject to a "by" phrase.' },
      ], answer: 'The bridge was destroyed by the storm.' },
      { id: 'fp-independent-1', objectiveId: 'choose-active-or-passive', revealSteps: 0, prompt: 'A news report doesn\'t know who broke a window. Should it use active or passive voice, and why?', steps: [
        { step: 'Since the doer is unknown, passive voice is appropriate: "The window was broken" (rather than forcing an unknown subject).', justification: 'Passive voice suits situations where the doer is genuinely unknown.' },
      ], answer: 'Passive voice — the doer is unknown' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'convert-direct-to-indirect', question: 'Convert to indirect speech: "I am cooking dinner," Mom said.', options: ['Mom said (that) she was cooking dinner', 'Mom said (that) I am cooking dinner', 'Mom said (that) she is cooking dinner', 'Mom said "I am cooking dinner"'], correctIndex: 0, hints: { strategic: 'Shift both tense and pronoun.', procedural: '"am"→"was", "I"→"she".', workedStep: 'Mom said (that) she was cooking dinner.' }, distractorMisconceptions: { 2: 'indirect-speech-tense-not-shifted' } },
      { id: 'ip-2', objectiveId: 'convert-indirect-to-direct', question: 'Convert to direct speech: He said that he was leaving.', options: ['"I am leaving," he said', '"He is leaving," he said', '"I was leaving," he said', '"He was leaving," he said'], correctIndex: 0, hints: { strategic: 'Reverse both the tense and pronoun shifts.', procedural: '"was"→"am", "he"→"I".', workedStep: '"I am leaving," he said.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'convert-active-to-passive', question: 'Convert to passive voice: "The artist painted the mural."', options: ['The mural was painted by the artist', 'The artist was painted by the mural', 'The mural painted the artist', 'The artist paints the mural'], correctIndex: 0, hints: { strategic: 'The object becomes the subject.', procedural: '"the mural" is the object, becomes the new subject.', workedStep: 'The mural was painted by the artist.' }, distractorMisconceptions: { 1: 'passive-voice-agent-confusion' } },
      { id: 'ip-4', objectiveId: 'choose-active-or-passive', question: 'Which is generally the stronger choice for direct, engaging writing?', options: ['Active voice, unless there\'s a specific reason to use passive', 'Passive voice, always', 'Whichever is longer', 'It never matters'], correctIndex: 0, hints: { strategic: 'Which voice is usually clearer and more direct?', procedural: 'Active voice, by default.', workedStep: 'Active voice, unless there\'s a specific reason for passive.' }, distractorMisconceptions: { 1: 'passive-overused-inappropriately' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'convert-direct-to-indirect', multiSelect: false, question: 'Convert: "I have lost my phone," he said.', options: ['He said (that) he had lost his phone', 'He said (that) I have lost my phone', 'He said (that) he has lost his phone', 'He said "I have lost my phone"'], correctIndices: [0], explanation: '"Have lost" shifts back to "had lost"; "I"/"my" shift to "he"/"his".', distractorMisconceptions: { 2: 'indirect-speech-tense-not-shifted' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'convert-direct-to-indirect', multiSelect: false, question: 'Convert: "We are winning," the coach said.', options: ['The coach said (that) they were winning', 'The coach said (that) we are winning', 'The coach said (that) they are winning', 'The coach said "we are winning"'], correctIndices: [0], explanation: '"Are" shifts back to "were"; "we" shifts to "they".', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'convert-indirect-to-direct', multiSelect: false, question: 'Convert to direct speech: She said that she liked the movie.', options: ['"I like the movie," she said', '"She likes the movie," she said', '"I liked the movie," she said', '"She liked the movie," she said'], correctIndices: [0], explanation: 'Reverse both shifts: "liked"→"like" (her original present tense), "she"→"I".', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'convert-active-to-passive', multiSelect: false, question: 'Convert to passive: "The company launched a new product."', options: ['A new product was launched by the company', 'The company was launched by a new product', 'A new product launches the company', 'The company launches a new product'], correctIndices: [0], explanation: 'Object "a new product" becomes the subject.', distractorMisconceptions: { 1: 'passive-voice-agent-confusion' } },
    { id: 'q5', type: 'true-false', objectiveId: 'convert-active-to-passive', multiSelect: false, question: 'True or false: in passive voice, the actual doer of the action changes.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the doer stays the same; only the sentence structure changes.', distractorMisconceptions: { 0: 'passive-voice-agent-confusion' } },
    { id: 'q6', type: 'true-false', objectiveId: 'choose-active-or-passive', multiSelect: false, question: 'True or false: passive voice is appropriate when the doer of an action is unknown.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is one of the legitimate uses of passive voice.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'choose-active-or-passive', multiSelect: false, question: 'Which sentence is more direct and engaging?', options: ['"The team won the championship."', '"The championship was won by the team."', 'Both are equally direct', 'Neither is grammatically correct'], correctIndices: [0], explanation: 'Active voice is generally more direct and engaging than passive.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'convert-direct-to-indirect', multiSelect: true, question: 'When converting "I am here," she said to indirect speech, which shifts are needed? (select all that apply)', options: ['Tense: "am" → "was"', 'Pronoun: "I" → "she"', 'Remove quotation marks', 'Keep everything exactly the same'], correctIndices: [0, 1, 2], explanation: 'All three changes are needed for correct indirect speech — tense shift, pronoun shift, and dropping quotation marks.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'convert-direct-to-indirect',
      analogy: 'Think of converting to indirect speech like retelling a friend\'s story the next day: you naturally say "she said SHE was going," not "she said I am going" — your brain already does the pronoun and tense shift automatically in everyday conversation. This lesson just makes that instinct a deliberate, checkable rule.',
      explanation: 'Two checks every time: (1) if the reporting verb is past tense, shift the reported tense back one step; (2) shift every pronoun to match the new reporting perspective.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Convert: "I am proud of my work," she said.', steps: [
          { step: 'Tense: "am" (present) → "was" (past).', justification: 'Reporting verb "said" is past, so shift back.' },
          { step: 'Pronouns: "I"→"she", "my"→"her".', justification: 'Match the new reporting perspective.' },
        ], answer: 'She said (that) she was proud of her work.' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'convert-direct-to-indirect', question: 'Convert: "I need help," he said.', options: ['He said (that) he needed help', 'He said (that) I need help', 'He said (that) he needs help', 'He said "I need help"'], correctIndex: 0, hints: { strategic: 'Shift tense and pronoun.', procedural: '"need"→"needed", "I"→"he".', workedStep: 'He said (that) he needed help.' }, distractorMisconceptions: { 2: 'indirect-speech-tense-not-shifted' } },
        { id: 'rem-p2', objectiveId: 'convert-direct-to-indirect', question: 'Convert: "My car broke down," she said.', options: ['She said (that) her car had broken down', 'She said (that) my car broke down', 'She said (that) her car breaks down', 'She said "my car broke down"'], correctIndex: 0, hints: { strategic: 'Shift tense (past→past perfect) and pronoun ("my"→"her").', procedural: '"broke down"→"had broken down".', workedStep: 'She said (that) her car had broken down.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'convert-direct-to-indirect', question: 'Convert: "We will arrive late," they said.', options: ['They said (that) they would arrive late', 'They said (that) we will arrive late', 'They said (that) they will arrive late', 'They said "we will arrive late"'], correctIndex: 0, hints: { strategic: 'Shift tense ("will"→"would") and pronoun ("we"→"they").', procedural: 'Apply both shifts together.', workedStep: 'They said (that) they would arrive late.' }, distractorMisconceptions: { 2: 'indirect-speech-tense-not-shifted' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What two things must always shift when converting direct speech to indirect speech?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with speech conversion and active/passive voice now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'When is passive voice actually the better choice?', type: 'multiple-choice', options: ['When the doer is unknown or deliberately de-emphasised', 'Always', 'Never', 'Only in questions'] },
  ],
};
