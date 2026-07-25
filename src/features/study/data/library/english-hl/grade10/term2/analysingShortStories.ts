// ── English HL, Term 2, Topic 4: Analysing Short Stories ─────────────────────
// Second Literature topic — generic, text-agnostic skills module (per
// confirmed scope), extending Term 1's poetry-analysis skills to narrative
// prose: plot, character, setting, and theme derived from technique, not
// plot summary. Uses an original short story extract, not any real
// prescribed set-work.

import type { LessonContent } from '../../../types';

const STORY_EXTRACT = `Nomvula had rehearsed the apology a hundred times on the walk home, but standing in the kitchen doorway, every word evaporated. Her mother didn't look up from the dishes. The tap ran on, filling the silence neither of them seemed willing to break. Nomvula noticed, for the first time, how her mother's shoulders curved forward now, as though the weight of the day settled there permanently. "I lost the necklace," Nomvula finally said, the words smaller than she'd intended. The water kept running. Her mother turned it off slowly, dried her hands on the dish towel, fold by fold, and only then turned around. "I know," she said. "Mrs. Dlamini called an hour ago." Nomvula braced for the anger she'd imagined all afternoon, but her mother's face held something else entirely — not fury, just a tiredness that seemed older than the argument itself. "It was Grandma's," her mother said quietly, and went back to the dishes.`;

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'story-retold-not-analysed',
    label: 'Retelling the plot events instead of analysing character or technique',
    errorType: 'You described what happened in the story without discussing what it reveals about character, relationships, or theme.',
    principle: 'Retelling events ("Nomvula lost a necklace and told her mother") is summary. ANALYSIS asks what those events REVEAL — about character, relationships, or the story\'s deeper meaning.',
    correctStep: 'Not just "Nomvula told her mother she lost the necklace" — add "...and her mother\'s quiet, tired response (rather than anger) reveals a relationship shaped by exhaustion, not conflict."',
  },
  {
    id: 'character-traits-not-evidenced',
    label: 'Stating a character trait without pointing to specific evidence in the text',
    errorType: 'You described a character\'s personality without showing WHERE in the text that impression comes from.',
    principle: 'Every character analysis claim needs to be tied to SPECIFIC evidence — an action, a piece of dialogue, or a described detail — not just a general impression.',
    correctStep: 'Not just "the mother seems tired" — add "...shown by her \'shoulders curved forward\' and her slow, deliberate drying of her hands before responding."',
  },
  {
    id: 'indirect-characterisation-missed',
    label: 'Only noticing direct statements about a character, missing indirect characterisation',
    errorType: 'You only looked at what the narrator directly says about a character, missing what actions and dialogue reveal indirectly.',
    principle: 'DIRECT characterisation is when the narrator states a trait outright. INDIRECT characterisation reveals character through actions, dialogue, thoughts, or how other characters react to them — often more powerful and worth close attention.',
    correctStep: 'The story never directly says "the mother is exhausted" — this is shown INDIRECTLY, through her posture, her slow actions, and her quiet tone.',
  },
  {
    id: 'setting-ignored-as-meaningless-detail',
    label: 'Treating setting details as mere background, without considering their function',
    errorType: 'You overlooked how a setting detail (like where a scene takes place) contributes to mood or meaning.',
    principle: 'Setting is rarely just background — a kitchen, a specific object, or a sound can shape mood, reflect a character\'s inner state, or add symbolic weight. Always ask what a setting detail contributes, not just what it describes.',
    correctStep: 'The running tap isn\'t just a kitchen detail — it fills the silence, dramatising the tension and unspoken emotion between Nomvula and her mother.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 2,
  topicId: 'analysing-short-stories',
  topicName: 'Analysing Short Stories',
  prerequisites: [
    'Introduction to poetic devices and theme (Term 1, Topic 4)',
  ],
  objectives: [
    { id: 'distinguish-plot-analysis', text: 'Distinguish plot summary from character/thematic analysis in a written response.' },
    { id: 'analyse-characterisation', text: 'Analyse how a writer reveals character through direct and indirect characterisation.' },
    { id: 'analyse-setting-function', text: 'Explain how a setting detail contributes to mood or meaning, not just describes background.' },
    { id: 'derive-theme-from-story', text: 'Derive a specific, evidence-based theme statement from a short story extract.' },
  ],
  estimatedMinutes: [20, 30],
};

export const analysingShortStories: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What does a character\'s silence tell you that their words don\'t?',
  goalSettingPrompt:
    'You already know how to analyse poetic devices and theme. Short story analysis uses the same core skill — moving from detail to meaning — applied to plot, character, and setting. By the end of this lesson you\'ll be able to analyse a short story extract with the same depth, using techniques that transfer directly to your own prescribed set-work.',

  activate: {
    connectPrompt: 'You already know the difference between summary and analysis from poetry — this lesson applies that same distinction to short stories.',
    diagnosticQuestions: [
      { question: 'What is the difference between summary and analysis?', options: ['Summary says what happens; analysis explains how/why and what it reveals', 'They are the same thing', 'Summary is only for poems', 'Analysis only applies to endings'], correctIndex: 0, explanation: 'This distinction applies to all literary analysis, not just poetry.' },
      { question: 'What is indirect characterisation?', options: ['Revealing character through actions/dialogue rather than direct statement', 'The narrator stating a trait outright', 'A character\'s name', 'The story\'s setting'], correctIndex: 0, explanation: 'Indirect characterisation shows rather than tells.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      `Read this short story extract carefully — you'll use it throughout this lesson:\n\n"${STORY_EXTRACT}"\n\nPLOT SUMMARY describes what happens. ANALYSIS explains what those events REVEAL about character, relationships, or theme. CHARACTERISATION can be DIRECT (the narrator states a trait outright) or INDIRECT (revealed through actions, dialogue, thoughts, or other characters' reactions) — indirect characterisation is often more powerful and deserves close attention.`,
    workedExamples: [
      { id: 'wx-summary-vs-analysis-story', prompt: 'Compare a summary and an analysis of the opening line: "Nomvula had rehearsed the apology a hundred times on the walk home, but standing in the kitchen doorway, every word evaporated."', steps: [
        { step: 'Summary: "Nomvula practised what to say, but forgot it when she arrived."', justification: 'This just restates the events.' },
        { step: 'Analysis: "The contrast between the confident rehearsal and the sudden loss of words reveals how much more intimidating the real confrontation feels than Nomvula imagined — suggesting deep anxiety about her mother\'s reaction."', justification: 'This explains what the detail reveals about the character\'s internal state.' },
      ], answer: 'Summary restates; analysis explains what the detail reveals about character' },
      { id: 'wx-indirect-characterisation', prompt: 'How is the mother characterised, and is it direct or indirect?', steps: [
        { step: 'The narrator never directly states "the mother is exhausted" — there is no direct statement of this trait.', justification: 'Check whether the trait is stated outright or shown.' },
        { step: 'Instead, it\'s shown through actions: her curved shoulders, turning off the tap "slowly," drying her hands "fold by fold" — deliberate, weary actions.', justification: 'This is indirect characterisation — revealed through action and detail, not direct statement.' },
      ], answer: 'Indirect characterisation — shown through her slow, deliberate actions and posture' },
    ],
    knowledgeChecks: [
      { question: 'Which is analysis, not plot summary?', options: ['"The slow, deliberate drying of her hands suggests the mother is composing herself before responding"', '"The mother dried her hands with a towel"', '"Nomvula told her mother about the necklace"', '"The story is set in a kitchen"'], correctIndex: 0, explanation: 'This explains what the action reveals, not just what happens.', misconceptionId: 'story-retold-not-analysed' },
      { question: 'Is the phrase "her shoulders curved forward" direct or indirect characterisation?', options: ['Indirect — a physical detail implying emotional weight, not a stated trait', 'Direct — it states her trait outright', 'Neither — it\'s just plot', 'It\'s dialogue'], correctIndex: 0, explanation: 'It shows rather than tells — indirect characterisation.', misconceptionId: 'indirect-characterisation-missed' },
    ],
    confidenceCheckPrompt: 'How confident do you feel distinguishing summary from analysis and identifying indirect characterisation?',
  },

  demonstrateChunk2: {
    explanation:
      'SETTING is rarely just background — specific details (an object, a sound, a location) can shape mood, reflect a character\'s inner state, or carry symbolic weight. Always ask what a setting detail CONTRIBUTES, not just what it describes. A strong THEME STATEMENT for a short story, like for a poem, should be specific and evidence-based — connecting to details across the WHOLE extract, not just naming a topic in one word.',
    workedExamples: [
      { id: 'wx-setting-function', prompt: 'What does the running tap contribute to the scene, beyond being a kitchen detail?', steps: [
        { step: 'Literally, it\'s just background noise in a kitchen.', justification: 'Note the literal function first.' },
        { step: 'Functionally, it fills the awkward silence between mother and daughter, dramatising the tension and the difficulty of what\'s left unsaid — when it\'s finally turned off, that silence becomes charged and significant.', justification: 'Explain what the detail contributes to mood and meaning.' },
      ], answer: 'It fills and dramatises the silence, making the eventual quiet (when it\'s turned off) feel charged and significant' },
      { id: 'wx-theme-story', prompt: 'Develop a specific theme statement about this extract, beyond just "family" or "guilt."', steps: [
        { step: 'Weak: "The theme is guilt."', justification: 'This is just a one-word label.' },
        { step: 'Strong: "The extract suggests that real tenderness in strained relationships often shows itself not through words, but through small, quiet actions and restraint — the mother\'s tiredness, not anger, reveals a deeper, weary love."', justification: 'This connects to specific evidence (her tiredness, the revealed backstory of the necklace) and makes a specific claim.' },
      ], answer: 'A theme statement should make a specific claim about relationships/love/guilt, grounded in the story\'s details' },
    ],
    knowledgeChecks: [
      { question: 'What does the detail "It was Grandma\'s" (about the necklace) add to the story\'s meaning?', options: ['It raises the emotional stakes — this isn\'t just any necklace, but a family heirloom, deepening the sense of loss', 'It has no particular significance', 'It only tells us the story is about jewellery', 'It changes the setting'], correctIndex: 0, explanation: 'This detail retroactively deepens the emotional weight of the whole scene.', misconceptionId: 'setting-ignored-as-meaningless-detail' },
      { question: 'Which is a stronger theme statement for this extract?', options: ['"Quiet restraint can reveal deeper love than an angry reaction would"', '"The theme is family"', '"A necklace was lost"', '"Mothers and daughters sometimes argue"'], correctIndex: 0, explanation: 'This is specific and evidence-based, not a one-word label.' },
    ],
    confidenceCheckPrompt: 'How confident do you feel analysing setting function and writing a specific theme statement for a short story?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'distinguish-plot-analysis', revealSteps: 1, prompt: 'Turn this summary into analysis: "The mother said \'I know\' before Nomvula finished explaining."', steps: [
        { step: 'Analysis: The mother already knowing (before Nomvula even finishes) suggests she has had time to process her feelings already, which explains why her reaction is tiredness rather than the shock or fresh anger Nomvula expected.', justification: 'Explain what the detail reveals, not just restate it.' },
      ], answer: 'Analysis connects the detail to the mother\'s emotional state and explains the unexpected reaction' },
      { id: 'fp-partial-1', objectiveId: 'analyse-characterisation', revealSteps: 1, prompt: 'Is Nomvula\'s characterisation in this extract direct or indirect? Give evidence.', steps: [
        { step: 'The narrator doesn\'t state "Nomvula is anxious" directly.', justification: 'Check for direct statement first.' },
        { step: 'It\'s shown indirectly: rehearsing the apology "a hundred times," her words "evaporating," and her words coming out "smaller than she\'d intended."', justification: 'These actions/details indirectly reveal her anxiety.' },
      ], answer: 'Indirect — shown through her rehearsal, loss of words, and smaller-than-intended speech' },
      { id: 'fp-independent-1', objectiveId: 'derive-theme-from-story', revealSteps: 0, prompt: 'Write a specific theme statement about expectation versus reality in this extract.', steps: [
        { step: 'Connect Nomvula\'s expected reaction (anger) to the actual reaction (tiredness), and what this gap suggests about assumptions we make about others\' feelings.', justification: 'A strong theme statement draws on the contrast built throughout the extract.' },
      ], answer: 'e.g. "The extract suggests that we often brace for reactions that reveal more about our own fears than about the other person\'s actual feelings"' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'distinguish-plot-analysis', question: 'Which is analysis, not summary?', options: ['"The unbroken silence before she speaks suggests just how much courage the confession requires"', '"Nomvula stood in the doorway"', '"The tap was running"', '"The mother dried her hands"'], correctIndex: 0, hints: { strategic: 'Does it explain an effect, or just restate an action?', procedural: 'It explains what the silence suggests about the difficulty of the moment.', workedStep: 'Analysis.' }, distractorMisconceptions: { 1: 'story-retold-not-analysed' } },
      { id: 'ip-2', objectiveId: 'analyse-characterisation', question: 'What does the mother turning off the tap "slowly" suggest about her, and is it direct or indirect?', options: ['Indirect — suggests she is composing herself, taking a moment before responding', 'Direct — the narrator states she is calm', 'It is dialogue', 'It reveals nothing about her character'], correctIndex: 0, hints: { strategic: 'Is her trait stated, or shown through action?', procedural: 'Shown through the deliberate pace of her action.', workedStep: 'Indirect characterisation.' }, distractorMisconceptions: { 3: 'indirect-characterisation-missed' } },
      { id: 'ip-3', objectiveId: 'analyse-setting-function', question: 'What might the specific setting of a kitchen (rather than, say, a bedroom) contribute to this scene?', options: ['A kitchen is a shared, domestic space — its ordinariness contrasts with the emotional weight of the conversation', 'Kitchens have no particular significance ever', 'It only tells us what room they were in', 'It changes the plot entirely'], correctIndex: 0, hints: { strategic: 'Consider what a kitchen represents as a shared, everyday space.', procedural: 'The ordinary setting can heighten the emotional contrast.', workedStep: 'The domestic ordinariness contrasts with the emotional weight of the scene.' }, distractorMisconceptions: { 1: 'setting-ignored-as-meaningless-detail' } },
      { id: 'ip-4', objectiveId: 'derive-theme-from-story', question: 'Which is the more specific, evidence-based theme statement?', options: ['"Love can be expressed through restraint and quiet understanding, rather than dramatic confrontation"', '"The theme is love"', '"A necklace was lost and a mother reacted"', '"Family relationships exist"'], correctIndex: 0, hints: { strategic: 'Does it make a specific claim, backed by the story\'s details?', procedural: 'The others are either one-word labels or plain facts.', workedStep: 'The first option is specific and evidence-based.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'distinguish-plot-analysis', multiSelect: false, question: 'Which is analysis of this extract, not summary?', options: ['"The mother\'s calm response, rather than the expected anger, subverts Nomvula\'s (and the reader\'s) expectations"', '"Nomvula lost a necklace"', '"The story takes place in a kitchen"', '"The mother said \'I know\'"'], correctIndices: [0], explanation: 'This explains an effect (subverted expectation), not just restating events.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'distinguish-plot-analysis', multiSelect: false, question: 'True or false: describing what happens in a story is sufficient for a strong literary analysis response.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — analysis must go beyond describing events to explain their significance.', distractorMisconceptions: { 0: 'story-retold-not-analysed' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'analyse-characterisation', multiSelect: false, question: 'Which is an example of INDIRECT characterisation in the extract?', options: ['Her words coming out "smaller than she\'d intended"', 'A narrator stating "Nomvula was nervous"', 'A character\'s name being given', 'The time of day being mentioned'], correctIndices: [0], explanation: 'This shows her nervousness through description of her speech, not a direct statement.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'analyse-characterisation', multiSelect: false, question: 'True or false: indirect characterisation is generally considered weaker or less important than direct characterisation.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — indirect characterisation is often MORE powerful and worth close analytical attention.', distractorMisconceptions: { 0: 'indirect-characterisation-missed' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'analyse-setting-function', multiSelect: false, question: 'What does the running (then stopped) tap contribute to the scene?', options: ['It fills and then dramatises the silence between the characters', 'It has no function beyond realism', 'It changes the story\'s setting', 'It represents the necklace'], correctIndices: [0], explanation: 'The tap\'s sound and its stopping heighten the emotional tension of the silence.', distractorMisconceptions: { 1: 'setting-ignored-as-meaningless-detail' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'derive-theme-from-story', multiSelect: false, question: 'Which is the stronger theme statement?', options: ['"Expectations of conflict can obscure the quieter, more complex emotions others actually feel"', '"The theme is family conflict"', '"Nomvula was scared"', '"The necklace belonged to the grandmother"'], correctIndices: [0], explanation: 'This makes a specific claim about the story\'s meaning, grounded in the contrast between expected and actual reactions.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'derive-theme-from-story', multiSelect: false, question: 'True or false: a strong theme statement should connect to evidence from across the whole extract, not just one line.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this makes the theme statement more convincing and well-supported.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'analyse-characterisation', multiSelect: true, question: 'Which details in the extract are examples of INDIRECT characterisation of the mother? (select all that apply)', options: ['Her shoulders "curved forward"', 'Drying her hands "fold by fold"', 'The narrator stating her name is "mother"', 'The kitchen being the setting'], correctIndices: [0, 1], explanation: 'Both physical details indirectly suggest her weariness. The other two are neutral facts, not characterisation.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'distinguish-plot-analysis',
      analogy: 'Think of plot events like the visible tip of an iceberg, and analysis like exploring what\'s underneath: the events themselves are just the surface — analysis asks what they reveal about the characters, relationships, and ideas beneath.',
      explanation: 'For any story detail, ask two questions in order: (1) What happens here? (just to orient yourself); (2) What does this REVEAL — about a character\'s feelings, a relationship, or the story\'s deeper meaning? Only the second question belongs in your written analysis.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Analyse (don\'t just summarise): "He didn\'t look up from his newspaper when she walked in."', steps: [
          { step: 'What happens: he doesn\'t look up.', justification: 'Orient yourself with the basic event first.' },
          { step: 'What it reveals: this small, deliberate non-action suggests emotional distance or unresolved tension between them — his choice not to acknowledge her feels significant, not neutral.', justification: 'Move from the event to what it reveals about the relationship.' },
        ], answer: 'The small action reveals emotional distance/tension, not just a neutral detail' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'distinguish-plot-analysis', question: 'Which is analysis of "She smiled, but her eyes stayed cold"?', options: ['"The contrast between her smile and cold eyes suggests the smile is forced or insincere"', '"She smiled"', '"Her eyes were cold"', '"She has a face"'], correctIndex: 0, hints: { strategic: 'Does it explain what the contrast reveals?', procedural: 'Yes — insincerity, hidden feelings.', workedStep: 'The first option is analysis.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'distinguish-plot-analysis', question: 'Which is analysis of "He slammed the door and the pictures on the wall trembled"?', options: ['"The trembling pictures amplify the force of his anger, making the emotional impact felt physically in the space"', '"He slammed the door"', '"There were pictures on the wall"', '"The wall was there"'], correctIndex: 0, hints: { strategic: 'Does it explain the EFFECT of the detail?', procedural: 'It connects the physical detail to emotional intensity.', workedStep: 'The first option is analysis.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'distinguish-plot-analysis', question: 'Which is analysis of "She kept checking her phone, though it never rang"?', options: ['"This repeated, futile action reveals her anxious hope for contact that isn\'t coming"', '"She checked her phone"', '"The phone never rang"', '"She has a phone"'], correctIndex: 0, hints: { strategic: 'Does it explain what the repeated action reveals about her emotional state?', procedural: 'Yes — anxious hope, unfulfilled.', workedStep: 'The first option is analysis.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the difference between direct and indirect characterisation?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel analysing short story extracts now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What two questions will you ask about every story detail from now on?', type: 'multiple-choice', options: ['"What happens?" then "What does it reveal?"', '"Is it long?" then "Is it short?"', '"Do I like it?" then "Is it boring?"', 'No particular questions'] },
  ],
};
