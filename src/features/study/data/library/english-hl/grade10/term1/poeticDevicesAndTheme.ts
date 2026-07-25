// ── English HL, Term 1, Topic 4: Introduction to Poetic Devices and Theme ────
// First Literature topic. Per confirmed scope, this is a GENERIC,
// text-agnostic skills module (device identification, theme-from-evidence
// reasoning) — not tied to any specific school's prescribed set-work poem,
// since set-works vary by province/school. Uses an original short poem
// (not any real prescribed text) purely to demonstrate technique.

import type { LessonContent } from '../../../types';

const POEM = `The Old Gate
The gate has rusted where it stands,
forgotten by the passing hands.
Once it swung on eager hinge,
now it leans on time's slow cringe.
No latch, no lock, no need to keep —
the field beyond has gone to sleep.`;

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'plot-summary-not-analysis',
    label: 'Retelling what a poem/story says instead of analysing HOW or WHY it says it',
    errorType: 'You described what happens in the text without discussing the writer\'s techniques or their effect.',
    principle: 'SUMMARY says what happens. ANALYSIS explains HOW the writer creates meaning or effect — through word choice, imagery, structure, sound — and WHY that matters for theme or mood.',
    correctStep: 'Summary: "The gate is old and rusty." Analysis: "The image of a rusted gate suggests decay and abandonment, reinforcing the poem\'s theme of things being forgotten over time."',
  },
  {
    id: 'surface-theme-no-nuance',
    label: 'Naming a broad theme without connecting it to specific textual evidence',
    errorType: 'You named a general theme (like "time" or "loss") without showing how the text actually develops that theme.',
    principle: 'A strong theme statement is SPECIFIC and connects to evidence — not just a one-word label, but what the text is actually SAYING about that idea, backed by details.',
    correctStep: 'Weak: "The theme is time." Strong: "The poem suggests that time inevitably erodes even things once cared for, shown through the gate\'s progression from \'eager hinge\' to abandoned decay."',
  },
  {
    id: 'device-named-without-effect',
    label: 'Naming a poetic device without explaining its effect',
    errorType: 'You correctly identified a device (like personification or imagery) but stopped there, without saying what it achieves.',
    principle: 'Identifying a device is only half the answer — always follow up with WHAT EFFECT it creates: what mood, meaning, or feeling does it produce for the reader?',
    correctStep: 'Not just "this is personification" — add "...which gives the gate a human, weary quality, deepening the sense of loss."',
  },
  {
    id: 'personal-opinion-not-grounded',
    label: 'Giving a personal reaction disconnected from the text\'s actual details',
    errorType: 'You shared a personal opinion or feeling about the text without grounding it in specific textual evidence.',
    principle: 'A personal response is valuable, but in literary analysis it must be GROUNDED in the text — tie your reaction back to specific words, images, or techniques.',
    correctStep: 'Not just "this poem makes me sad" — add "...because the imagery of the gate \'gone to sleep\' suggests a quiet, final kind of ending, which creates a wistful, melancholy mood."',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 1,
  topicId: 'poetic-devices-and-theme',
  topicName: 'Introduction to Poetic Devices and Theme',
  prerequisites: [
    'Basic figures of speech (this term, Topic 2)',
  ],
  objectives: [
    { id: 'identify-poetic-devices', text: 'Identify poetic devices (imagery, personification, metaphor, simile, sound devices) in a poem.' },
    { id: 'explain-device-effect', text: 'Explain the effect a poetic device creates, not just name it.' },
    { id: 'distinguish-summary-analysis', text: 'Distinguish summary from analysis in a written response.' },
    { id: 'develop-theme-statement', text: 'Develop a specific, evidence-based theme statement rather than a one-word label.' },
  ],
  estimatedMinutes: [20, 30],
};

export const poeticDevicesAndTheme: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What is a poem actually DOING, beyond what it says?',
  goalSettingPrompt:
    'Anyone can retell what a poem describes — analysis means explaining HOW the poet creates meaning, and WHY it matters. By the end of this lesson you\'ll be able to identify poetic devices, explain their effects, and write a specific, evidence-based theme statement. These skills apply to any poem you\'re asked to study, including your prescribed set-work.',

  activate: {
    connectPrompt: 'You already know basic figures of speech (simile, metaphor, personification, hyperbole) from Language Structures — this lesson applies them to full poem analysis.',
    diagnosticQuestions: [
      { question: 'What is personification?', options: ['Giving human qualities to something non-human', 'Comparing using "like" or "as"', 'Deliberate exaggeration', 'Stating one thing IS another'], correctIndex: 0, explanation: 'Personification gives human qualities to non-human things.' },
      { question: 'What is the difference between summary and analysis?', options: ['Summary says what happens; analysis explains how/why', 'They are the same thing', 'Summary is longer', 'Analysis only applies to poems'], correctIndex: 0, explanation: 'Summary retells; analysis explains technique and effect.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      `Read this short poem carefully — you'll use it throughout this lesson:\n\n"${POEM}"\n\nIMAGERY is descriptive language that appeals to the senses, creating a mental picture. PERSONIFICATION gives human qualities to non-human things. Identifying a device is only the FIRST step — you must always follow up by explaining its EFFECT: what mood, meaning, or feeling does it create for the reader?`,
    workedExamples: [
      { id: 'wx-identify-imagery', prompt: 'Identify and explain the effect of the imagery in "The gate has rusted where it stands."', steps: [
        { step: 'The image is visual: a rusted, standing gate.', justification: 'Identify what sense the image appeals to.' },
        { step: 'Effect: rust suggests decay, neglect, and the passage of time — it immediately sets a mood of abandonment before we know anything else about the poem.', justification: 'Always follow device identification with its effect.' },
      ], answer: 'Visual imagery of rust — creates a mood of decay and neglect from the very first line' },
      { id: 'wx-identify-personification', prompt: 'Identify and explain the effect of personification in "now it leans on time\'s slow cringe."', steps: [
        { step: '"Cringe" is a human reaction, given to "time" — this is personification.', justification: 'Identify the device.' },
        { step: 'Effect: giving time a human, uncomfortable reaction makes the passage of time feel almost painful or reluctant, deepening the poem\'s weary, melancholy tone.', justification: 'Explain what this technique achieves for the reader.' },
      ], answer: 'Personification of time — creates a weary, almost painful sense of time passing' },
    ],
    knowledgeChecks: [
      { question: 'In "Once it swung on eager hinge," what does "eager" suggest, given it describes a hinge?', options: ['Personification — the hinge is given a human-like eagerness, suggesting the gate was once lively/well-used', 'This is a simile', 'This is hyperbole', 'This has no particular effect'], correctIndex: 0, explanation: 'Giving "eager" (a human quality) to the hinge is personification, contrasting the gate\'s past liveliness with its present decay.', misconceptionId: 'device-named-without-effect' },
      { question: 'Why does explaining a device\'s EFFECT matter, not just naming it?', options: ['Because naming alone doesn\'t show you understand what the device achieves for meaning/mood', 'It doesn\'t matter, naming is enough', 'Only effects matter, never name the device', 'This only applies to metaphors'], correctIndex: 0, explanation: 'A complete analysis always connects device to effect.', misconceptionId: 'device-named-without-effect' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying poetic devices and explaining their effects?',
  },

  demonstrateChunk2: {
    explanation:
      'SUMMARY describes what happens; ANALYSIS explains HOW the writer creates meaning and WHY it matters. A strong THEME STATEMENT is specific and evidence-based — not a one-word label like "time" or "loss," but a full statement about what the text is actually saying about that idea, backed by details from across the poem.',
    workedExamples: [
      { id: 'wx-summary-vs-analysis', prompt: 'Compare a summary and an analysis of the poem\'s final two lines: "No latch, no lock, no need to keep — the field beyond has gone to sleep."', steps: [
        { step: 'Summary: "The gate has no lock, and the field is asleep."', justification: 'This just restates what the words say.' },
        { step: 'Analysis: "The repeated \'no\' emphasises total abandonment — there is nothing left worth protecting. \'Gone to sleep\' is a gentle, peaceful personification of the field, suggesting the ending isn\'t violent or sad, but a quiet, natural rest."', justification: 'This explains the technique (repetition, personification) and its effect on meaning and mood.' },
      ], answer: 'Summary restates; analysis explains technique and effect' },
      { id: 'wx-theme-statement', prompt: 'Develop a specific theme statement for "The Old Gate," rather than just the word "time."', steps: [
        { step: 'Weak (one-word label): "The theme is time."', justification: 'This says nothing specific about what the poem argues.' },
        { step: 'Strong (specific, evidence-based): "The poem suggests that the passage of time inevitably leads to abandonment, but frames this not as tragic, but as a quiet, natural process — shown by the gentle personification of the field \'gone to sleep\' rather than something harsher."', justification: 'This connects the theme to specific evidence and explains the poem\'s particular take on the idea.' },
      ], answer: 'A theme statement should say what the poem argues about an idea, not just name the idea' },
    ],
    knowledgeChecks: [
      { question: 'Which is analysis, not summary?', options: ['"The repeated \'no\' emphasises total abandonment"', '"The gate has no lock"', '"The field is described as asleep"', '"There are six lines in the poem"'], correctIndex: 0, explanation: 'This explains a technique (repetition) and its effect — analysis. The others just restate facts.', misconceptionId: 'plot-summary-not-analysis' },
      { question: 'Which is a stronger theme statement?', options: ['"Time leads to abandonment, framed here as peaceful rather than tragic"', '"The theme is time"', '"The poem is about a gate"', '"The poem has six lines"'], correctIndex: 0, explanation: 'This is specific and evidence-based, not just a one-word label.', misconceptionId: 'surface-theme-no-nuance' },
    ],
    confidenceCheckPrompt: 'How confident do you feel distinguishing summary from analysis and writing a specific theme statement?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'identify-poetic-devices', revealSteps: 1, prompt: 'Identify the device in "the field beyond has gone to sleep."', steps: [
        { step: 'A field cannot literally sleep — this gives it a human quality.', justification: 'This matches the definition of personification.' },
      ], answer: 'Personification' },
      { id: 'fp-partial-1', objectiveId: 'explain-device-effect', revealSteps: 1, prompt: 'Explain the effect of the personification in "the field beyond has gone to sleep."', steps: [
        { step: 'Sleep is peaceful, natural, temporary — not violent or final.', justification: 'Consider the connotations of the specific word chosen.' },
        { step: 'This frames the ending/abandonment as gentle and natural, not tragic.', justification: 'Connect the connotation to the overall mood.' },
      ], answer: 'It creates a peaceful, natural mood around the idea of abandonment/ending' },
      { id: 'fp-independent-1', objectiveId: 'develop-theme-statement', revealSteps: 0, prompt: 'Write a specific theme statement about change/decay in "The Old Gate," using evidence.', steps: [
        { step: 'Combine the imagery of rust, the personified weary time, and the peaceful "gone to sleep" ending into one specific claim about the poem\'s view of decay.', justification: 'A strong theme statement draws on evidence across the whole poem, not just one line.' },
      ], answer: 'e.g. "The poem presents decay not as loss to be mourned, but as a natural, even peaceful, process" — evidence-based, not just "decay"' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'identify-poetic-devices', question: 'What device is used in "time\'s slow cringe"?', options: ['Personification', 'Simile', 'Hyperbole', 'Onomatopoeia'], correctIndex: 0, hints: { strategic: 'Can time literally "cringe"?', procedural: 'No — this gives a human reaction to an abstract concept.', workedStep: 'Personification.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'explain-device-effect', question: 'What effect does describing the hinge as "eager" (before the gate\'s decay) create?', options: ['Contrast between the gate\'s lively past and its present decline', 'No particular effect', 'It makes the poem funny', 'It describes the gate\'s colour'], correctIndex: 0, hints: { strategic: 'Compare the past description to the present state.', procedural: '"Eager" (past) vs. rusted/leaning (present).', workedStep: 'Creates contrast highlighting the decline.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'distinguish-summary-analysis', question: 'Which of these is analysis rather than summary?', options: ['"The rust imagery immediately signals decay before any other detail is given"', '"The gate is rusty"', '"The poem is six lines long"', '"The field is asleep"'], correctIndex: 0, hints: { strategic: 'Does it explain a technique\'s effect, or just restate a fact?', procedural: 'It explains WHY the rust detail matters, not just that it exists.', workedStep: 'Analysis.' }, distractorMisconceptions: { 1: 'plot-summary-not-analysis' } },
      { id: 'ip-4', objectiveId: 'develop-theme-statement', question: 'Which is the stronger, more specific theme statement?', options: ['"Decay is presented as a gentle, natural process rather than something to fear"', '"The theme is decay"', '"The poem describes a gate"', '"Rust is mentioned in the poem"'], correctIndex: 0, hints: { strategic: 'Does it say something SPECIFIC about the idea, backed by evidence?', procedural: 'The others are either one-word labels or plain facts.', workedStep: 'The first option is specific and evidence-based.' }, distractorMisconceptions: { 1: 'surface-theme-no-nuance' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'identify-poetic-devices', multiSelect: false, question: 'In "the wind whispered through the trees," what device is used?', options: ['Personification', 'Simile', 'Hyperbole', 'Alliteration'], correctIndices: [0], explanation: 'Wind cannot literally whisper — a human quality given to it.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'identify-poetic-devices', multiSelect: false, question: 'True or false: imagery only refers to visual descriptions.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — imagery can appeal to any of the five senses, not just sight.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'explain-device-effect', multiSelect: false, question: 'True or false: naming a device (e.g. "this is a metaphor") is a complete analytical answer on its own.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — you must also explain its effect.', distractorMisconceptions: { 0: 'device-named-without-effect' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'distinguish-summary-analysis', multiSelect: false, question: 'Which is a summary, not analysis?', options: ['"The old man walked slowly to the shop."', '"The slow pacing of this sentence mirrors the old man\'s frailty."', '"The short sentences create a tense, urgent mood."', '"The repetition emphasises his exhaustion."'], correctIndices: [0], explanation: 'This just restates the action without any analysis of technique or effect.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'distinguish-summary-analysis', multiSelect: false, question: 'True or false: analysis explains HOW a writer creates meaning, not just WHAT happens.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is the core distinction between summary and analysis.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'develop-theme-statement', multiSelect: false, question: 'Which is a stronger theme statement about a poem describing a wilting flower?', options: ['"The poem suggests that beauty is fleeting, and that its decline can still hold a strange dignity"', '"The theme is beauty"', '"The flower wilts"', '"Flowers are pretty"'], correctIndices: [0], explanation: 'This is specific and makes a claim about what the poem says regarding beauty, not just naming a topic.', distractorMisconceptions: { 1: 'surface-theme-no-nuance' } },
    { id: 'q7', type: 'true-false', objectiveId: 'develop-theme-statement', multiSelect: false, question: 'True or false: a good theme statement is just a single word, like "love" or "loss."', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a strong theme statement makes a specific claim, not just names a topic.', distractorMisconceptions: { 0: 'surface-theme-no-nuance' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-poetic-devices', multiSelect: true, question: 'Which of these are examples of personification? (select all that apply)', options: ['"The old gate leans on time\'s slow cringe"', '"The field beyond has gone to sleep"', '"As quiet as a mouse"', '"He is a lion in battle"'], correctIndices: [0, 1], explanation: 'Both give human qualities/actions to non-human things (time cringing, a field sleeping). The other two are a simile and a metaphor, respectively.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'explain-device-effect',
      analogy: 'Think of naming a device without its effect like pointing at a tool without saying what it\'s FOR — "this is a hammer" tells us nothing useful until you add "...used to drive in this nail, holding the frame together." Always finish the job: name it, THEN explain what it does.',
      explanation: 'Use this two-step habit every time: (1) name the device precisely; (2) immediately follow with "...which creates/suggests/emphasises..." to explain its effect on meaning or mood.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Identify and explain the effect of the device in "the old house groaned in the wind."', steps: [
          { step: 'Step 1 — name it: this is personification (a house cannot literally groan).', justification: 'Identify the device first.' },
          { step: 'Step 2 — explain effect: it creates an eerie, almost living quality for the house, building an unsettling atmosphere.', justification: 'Always follow naming with effect.' },
        ], answer: 'Personification — creates an eerie, unsettling atmosphere' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'explain-device-effect', question: 'For "the stars winked at us from above," what is the device AND its effect?', options: ['Personification — creates a playful, friendly mood', 'Simile — creates a sad mood', 'Hyperbole — creates confusion', 'Alliteration — creates rhythm only'], correctIndex: 0, hints: { strategic: 'Name the device first, then think about the mood "winked" creates.', procedural: 'Stars cannot literally wink — human quality given to them.', workedStep: 'Personification — creates a playful, friendly mood.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'explain-device-effect', question: 'For "her voice was a soft melody," what is the device AND its effect?', options: ['Metaphor — creates a soothing, musical impression of her voice', 'Simile — creates a harsh impression', 'Personification — creates fear', 'Hyperbole — creates exaggeration only'], correctIndex: 0, hints: { strategic: 'Does it directly state one thing IS another, without "like/as"?', procedural: 'Yes — "voice was a melody" is a metaphor.', workedStep: 'Metaphor — creates a soothing, musical impression.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'explain-device-effect', question: 'For "the silence screamed at him," what is the device AND its effect?', options: ['Oxymoron/personification — creates an intense, unsettling sense of tension', 'Simile — creates calm', 'Alliteration only — creates rhythm', 'Hyperbole — used for comic effect'], correctIndex: 0, hints: { strategic: 'Notice the contradiction: silence cannot scream — this is jarring on purpose.', procedural: 'Combines contradiction and personification for intensity.', workedStep: 'Creates an intense, unsettling sense of tension.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the difference between summary and analysis, in your own words?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel analysing poetic devices and writing theme statements now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What two steps will you always follow when identifying a poetic device?', type: 'multiple-choice', options: ['Name the device, then explain its effect', 'Just name the device', 'Just describe the mood', 'Quote the line only'] },
  ],
};
