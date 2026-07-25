// ── English HL, Term 3, Topic 3: Structuring a Literary Response ─────────────
// Third Literature topic. Per confirmed scope, this stays within what the
// engine can assess: recognising structure, planning, and contextual-
// question strategy via MCQ/short-answer — NOT auto-grading a full essay
// (Writing remains deferred). Text-agnostic, applies to any set-work.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'intro-has-no-argument',
    label: 'Writing an introduction that only announces the topic, without a clear line of argument',
    errorType: 'Your introduction stated what the essay is about, but not WHAT you will argue about it.',
    principle: 'A strong literary essay introduction doesn\'t just name the text and topic — it states a clear THESIS or line of argument that the rest of the essay will support.',
    correctStep: 'Weak: "This essay will discuss the theme of loss in the poem." Strong: "This essay argues that the poem presents loss not as tragedy, but as a natural, even peaceful, process."',
  },
  {
    id: 'topic-sentence-missing-focus',
    label: 'Writing a paragraph without a clear topic sentence stating its single main point',
    errorType: 'Your paragraph lacked an opening sentence that clearly states what that specific paragraph will argue or discuss.',
    principle: 'Every body paragraph should open with a TOPIC SENTENCE that states its single main point — the rest of the paragraph then provides evidence and analysis supporting that specific point.',
    correctStep: 'Topic sentence: "The poet\'s use of decay imagery reinforces the poem\'s central theme of inevitable change." Everything after should support THIS specific claim.',
  },
  {
    id: 'contextual-question-instruction-ignored',
    label: 'Not tailoring your answer to exactly what a contextual question is asking',
    errorType: 'You gave a general response about the text instead of directly answering the SPECIFIC question asked about a given extract.',
    principle: 'Contextual questions refer to a SPECIFIC extract and ask something PRECISE about it — always re-read the exact question and make sure your answer addresses exactly what\'s asked, using the given extract as your primary evidence.',
    correctStep: 'If asked "What does this line reveal about the character\'s state of mind AT THIS POINT," don\'t write generally about the character throughout the whole text — focus specifically on this moment.',
  },
  {
    id: 'conclusion-just-repeats-intro',
    label: 'Writing a conclusion that simply repeats the introduction word-for-word',
    errorType: 'Your conclusion restated the introduction without adding any synthesis or final insight.',
    principle: 'A strong conclusion doesn\'t just repeat the introduction — it SYNTHESISES the essay\'s points, showing how they connect, and may offer a final, slightly deeper insight building on what\'s been argued.',
    correctStep: 'Instead of repeating "this essay showed that loss is peaceful," a strong conclusion might add: "...suggesting that the poem ultimately reframes decay as a form of quiet dignity, not something to fear."',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 3,
  topicId: 'structuring-literary-response',
  topicName: 'Structuring a Literary Response',
  prerequisites: [
    'Analysing short stories (Term 2)',
    'Introduction to poetic devices and theme (Term 1)',
  ],
  objectives: [
    { id: 'plan-thesis-driven-intro', text: 'Recognise a strong, thesis-driven introduction versus a weak, purely descriptive one.' },
    { id: 'structure-topic-sentences', text: 'Identify effective topic sentences that give a paragraph a single clear focus.' },
    { id: 'answer-contextual-questions', text: 'Tailor an answer precisely to what a contextual question specifically asks.' },
    { id: 'write-synthesising-conclusion', text: 'Distinguish a synthesising conclusion from one that merely repeats the introduction.' },
  ],
  estimatedMinutes: [20, 30],
};

export const structuringLiteraryResponse: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What separates an essay that argues something from one that just describes?',
  goalSettingPrompt:
    'You already know how to analyse a text\'s devices and theme. This lesson focuses on STRUCTURE — how to plan and organise a literary response so your analysis actually builds toward a clear argument. These planning and structuring skills apply to any text, including your own prescribed set-work.',

  activate: {
    connectPrompt: 'You already know the difference between summary and analysis — this lesson builds on that to structure a full response.',
    diagnosticQuestions: [
      { question: 'What is a thesis statement?', options: ['The main argument the essay will support', 'A summary of the plot', 'The title of the text', 'A list of devices used'], correctIndex: 0, explanation: 'A thesis states the essay\'s central argument.' },
      { question: 'What should a topic sentence do?', options: ['State the paragraph\'s single main point', 'Summarise the whole essay', 'Just introduce the text\'s title', 'Repeat the previous paragraph'], correctIndex: 0, explanation: 'Topic sentences focus each paragraph on one clear point.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A strong literary essay INTRODUCTION doesn\'t just name the text and topic — it states a clear THESIS (line of argument) that the rest of the essay supports. Every BODY PARAGRAPH should open with a TOPIC SENTENCE stating its single main point, with the rest of the paragraph providing evidence and analysis supporting that specific point — not drifting into unrelated ideas.',
    workedExamples: [
      { id: 'wx-thesis-vs-announcement', prompt: 'Compare: "This essay will look at imagery in the poem" vs. "This essay argues that the poem\'s imagery transforms decay from something feared into something quietly dignified."', steps: [
        { step: 'The first only announces the TOPIC (imagery) without stating a specific argument.', justification: 'This is a weak, purely descriptive opening.' },
        { step: 'The second states a specific, arguable claim (a THESIS) that the essay will need to support with evidence.', justification: 'This gives the essay a clear direction and something specific to prove.' },
      ], answer: 'The second is a genuine thesis; the first merely announces a topic' },
      { id: 'wx-topic-sentence-focus', prompt: 'Which is a stronger topic sentence: "There are many things in this poem" or "The poem\'s repeated use of decay imagery reinforces its theme of inevitable change"?', steps: [
        { step: 'The first is vague and gives the paragraph no clear focus.', justification: 'It doesn\'t commit to a specific claim.' },
        { step: 'The second names a specific technique (decay imagery) and its specific effect (reinforcing a theme) — giving the paragraph one clear job.', justification: 'This focuses everything that follows on supporting this one claim.' },
      ], answer: 'The second — specific, focused, gives the paragraph one clear job' },
    ],
    knowledgeChecks: [
      { question: 'Which is a genuine thesis statement, not just a topic announcement?', options: ['"The story suggests that quiet restraint reveals more love than dramatic anger would"', '"This essay is about the short story."', '"The story has several characters."', '"This essay will discuss the setting."'], correctIndex: 0, explanation: 'This makes a specific, arguable claim the essay will support.', misconceptionId: 'intro-has-no-argument' },
      { question: 'What is the main job of a topic sentence?', options: ['To state the single main point the paragraph will focus on', 'To summarise the entire essay', 'To quote as much of the text as possible', 'To introduce a completely new topic unrelated to the essay'], correctIndex: 0, explanation: 'A topic sentence commits the whole paragraph to one clear focus.', misconceptionId: 'topic-sentence-missing-focus' },
    ],
    confidenceCheckPrompt: 'How confident do you feel recognising strong thesis statements and focused topic sentences?',
  },

  demonstrateChunk2: {
    explanation:
      'CONTEXTUAL questions refer to a SPECIFIC extract and ask something PRECISE about it — always re-read the exact question and ensure your answer addresses exactly what\'s asked, using the given extract as your primary evidence, not the whole text in general. A strong CONCLUSION doesn\'t just repeat the introduction — it SYNTHESISES the essay\'s points, showing how they connect, and may add a final, deeper insight.',
    workedExamples: [
      { id: 'wx-contextual-precision', prompt: 'A contextual question asks: "What does the character\'s silence in THIS extract suggest about her state of mind at this specific moment?" How should you answer?', steps: [
        { step: 'Focus specifically on THIS moment/extract, not the character\'s personality across the whole text.', justification: 'The question is precisely scoped to "this specific moment."' },
        { step: 'Use details from the given extract as evidence (e.g. her hesitation, what she doesn\'t say) to answer specifically about her state of mind HERE.', justification: 'Contextual answers must be grounded in the given extract, not general knowledge of the character.' },
      ], answer: 'Answer specifically about this moment, using this extract\'s details as evidence — not a general character summary' },
      { id: 'wx-synthesising-conclusion', prompt: 'Compare a repetitive conclusion and a synthesising one for an essay arguing decay is shown as peaceful.', steps: [
        { step: 'Repetitive: "In conclusion, this essay showed that decay is presented as peaceful." (Just restates the thesis.)', justification: 'This adds nothing new.' },
        { step: 'Synthesising: "By tracing the shift from an \'eager\' hinge to a field \'gone to sleep,\' the poem ultimately suggests that acceptance, not resistance, is what gives decay its quiet dignity." (Connects points and adds a final insight.)', justification: 'This draws the essay\'s evidence together and offers a deeper closing thought.' },
      ], answer: 'A synthesising conclusion connects evidence and adds insight, rather than just repeating the thesis' },
    ],
    knowledgeChecks: [
      { question: 'A contextual question asks about "this extract" specifically. What should your answer focus on?', options: ['The specific details and moment given in that extract', 'The entire text from beginning to end', 'Your personal opinion about the text overall', 'A different section of the text entirely'], correctIndex: 0, explanation: 'Contextual questions require precise, extract-specific answers.', misconceptionId: 'contextual-question-instruction-ignored' },
      { question: 'What makes a conclusion "synthesising" rather than merely repetitive?', options: ['It connects the essay\'s points together and may add a final insight', 'It repeats the introduction word-for-word', 'It introduces a brand new, unrelated argument', 'It is always the shortest paragraph'], correctIndex: 0, explanation: 'Synthesis means drawing threads together, not just restating.', misconceptionId: 'conclusion-just-repeats-intro' },
    ],
    confidenceCheckPrompt: 'How confident do you feel answering contextual questions precisely and writing synthesising conclusions?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'plan-thesis-driven-intro', revealSteps: 1, prompt: 'Is "This essay explores symbolism in the poem" a thesis or a topic announcement?', steps: [
        { step: 'It only names a technique (symbolism) without stating a specific claim about its effect or meaning.', justification: 'A thesis must make an arguable claim, not just name a topic.' },
      ], answer: 'Topic announcement, not a thesis' },
      { id: 'fp-partial-1', objectiveId: 'structure-topic-sentences', revealSteps: 1, prompt: 'Improve this weak topic sentence: "The story has a sad part."', steps: [
        { step: 'Identify what makes it weak: vague, no specific technique or claim named.', justification: 'Diagnose the weakness first.' },
        { step: 'Stronger version: "The narrator\'s use of short, clipped sentences during the climax mirrors the character\'s emotional shock."', justification: 'Names a specific technique and its specific effect.' },
      ], answer: 'A stronger version names a specific technique and its effect' },
      { id: 'fp-independent-1', objectiveId: 'answer-contextual-questions', revealSteps: 0, prompt: 'A question asks "Explain the effect of the dash in line 3 of THIS extract." What should you avoid doing in your answer?', steps: [
        { step: 'Avoid discussing dashes or punctuation elsewhere in the text generally — stay focused on line 3 of the given extract specifically.', justification: 'Contextual precision means answering exactly what\'s asked, about exactly what\'s given.' },
      ], answer: 'Avoid drifting to general discussion beyond the specific line/extract asked about' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'plan-thesis-driven-intro', question: 'Which is a genuine thesis statement?', options: ['"The novel suggests that true courage often looks like quiet persistence rather than dramatic heroism"', '"This essay is about courage in the novel."', '"The novel has a courageous character."', '"This essay will discuss the plot."'], correctIndex: 0, hints: { strategic: 'Does it make a specific, arguable claim?', procedural: 'The first option states a specific interpretation to be defended.', workedStep: 'The first option is a genuine thesis.' }, distractorMisconceptions: { 1: 'intro-has-no-argument' } },
      { id: 'ip-2', objectiveId: 'structure-topic-sentences', question: 'Which is the stronger topic sentence?', options: ['"The writer\'s repeated use of short sentences builds a sense of urgency throughout the chase scene"', '"There is a chase scene in this chapter"', '"This chapter has some interesting parts"', '"The chapter is quite long"'], correctIndex: 0, hints: { strategic: 'Does it name a specific technique and its specific effect?', procedural: 'The first names technique (short sentences) and effect (urgency).', workedStep: 'The first is stronger.' }, distractorMisconceptions: { 1: 'topic-sentence-missing-focus' } },
      { id: 'ip-3', objectiveId: 'answer-contextual-questions', question: 'A contextual question asks "What tone is created in lines 5-8?" Your answer should focus on:', options: ['Specifically lines 5-8, using their exact wording as evidence', 'The tone of the entire text', 'Your own opinion of the whole book', 'A different part of the text you remember better'], correctIndex: 0, hints: { strategic: 'The question specifies an exact range of lines.', procedural: 'Stay precisely within that scope.', workedStep: 'Focus specifically on lines 5-8.' }, distractorMisconceptions: { 1: 'contextual-question-instruction-ignored' } },
      { id: 'ip-4', objectiveId: 'write-synthesising-conclusion', question: 'Which is a synthesising conclusion, not a repetitive one?', options: ['"Ultimately, the interplay of setting and character choice reveals that isolation, not tragedy, drives the protagonist\'s transformation"', '"In conclusion, this essay discussed the theme of isolation."', '"To conclude, the essay was about the protagonist."', '"In summary, isolation is a theme."'], correctIndex: 0, hints: { strategic: 'Does it connect ideas and add a final insight, or just restate?', procedural: 'The first draws together setting and character choice into a fresh closing claim.', workedStep: 'The first is synthesising.' }, distractorMisconceptions: { 1: 'conclusion-just-repeats-intro' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'plan-thesis-driven-intro', multiSelect: false, question: 'True or false: an introduction that only names the topic (without a specific claim) is a strong thesis.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a strong thesis makes a specific, arguable claim, not just names a topic.', distractorMisconceptions: { 0: 'intro-has-no-argument' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'plan-thesis-driven-intro', multiSelect: false, question: 'Which is a genuine thesis statement?', options: ['"The play argues that ambition, left unchecked, corrodes even the closest relationships"', '"This essay is about the play."', '"The play has ambition as a topic."', '"This essay will summarise the plot."'], correctIndices: [0], explanation: 'This makes a specific, defensible claim about the play\'s meaning.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'structure-topic-sentences', multiSelect: false, question: 'What should follow a strong topic sentence in a body paragraph?', options: ['Evidence and analysis supporting that specific point', 'A completely unrelated new idea', 'A summary of a different paragraph', 'Nothing further is needed'], correctIndices: [0], explanation: 'The rest of the paragraph should support the topic sentence\'s specific claim.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'structure-topic-sentences', multiSelect: false, question: 'True or false: a good paragraph can drift between several unrelated points as long as they\'re all about the text.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — each paragraph should stay focused on its topic sentence\'s single point.', distractorMisconceptions: { 0: 'topic-sentence-missing-focus' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'answer-contextual-questions', multiSelect: false, question: 'A contextual question asks about "the effect of repetition in THIS stanza." Your answer should:', options: ['Focus specifically on the repetition in that stanza, using its wording as evidence', 'Discuss repetition anywhere in the whole poem generally', 'Ignore the stanza and discuss theme instead', 'Focus on a completely different poetic device'], correctIndices: [0], explanation: 'Contextual precision means answering exactly what and where is asked.', distractorMisconceptions: { 1: 'contextual-question-instruction-ignored' } },
    { id: 'q6', type: 'true-false', objectiveId: 'answer-contextual-questions', multiSelect: false, question: 'True or false: a general answer about the whole text is an acceptable substitute for answering a specific contextual question.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — contextual questions require precise, extract-specific answers.', distractorMisconceptions: { 0: 'contextual-question-instruction-ignored' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'write-synthesising-conclusion', multiSelect: false, question: 'What is the main weakness of a conclusion that just repeats the introduction?', options: ['It adds no new insight or synthesis of the essay\'s points', 'It is too long', 'It uses too much evidence', 'It introduces a new argument'], correctIndices: [0], explanation: 'A repetitive conclusion fails to draw the essay\'s points together into something new.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'plan-thesis-driven-intro', multiSelect: true, question: 'Which of these are genuine thesis statements (not just topic announcements)? (select all that apply)', options: ['"The novel suggests that forgiveness requires more courage than revenge"', '"This essay is about forgiveness."', '"The poem reveals that silence can communicate more than speech in moments of grief"', '"This essay will discuss the poem\'s themes."'], correctIndices: [0, 2], explanation: 'Both make specific, arguable claims. The other two merely announce a topic.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'plan-thesis-driven-intro',
      analogy: 'Think of a topic announcement as pointing at a map and saying "we\'re going somewhere in this country" — vague, no destination. A thesis is naming the EXACT destination: "we\'re going to this specific city, by this specific route." An essay needs a destination to organise itself around.',
      explanation: 'Test any introduction with this question: "Could someone disagree with this statement?" If yes, it\'s a thesis (a specific, defensible claim). If it\'s just a neutral description of the topic that nobody could possibly disagree with, it\'s just an announcement.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Test: "This essay discusses the character of the mother." Is this a thesis?', steps: [
          { step: 'Could someone disagree with this? No — it\'s just a neutral statement of topic, not a claim.', justification: 'Apply the disagreement test.' },
          { step: 'This is a topic announcement, not a thesis.', justification: 'It fails the test — no one could meaningfully argue against it.' },
        ], answer: 'Topic announcement, not a thesis' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'plan-thesis-driven-intro', question: 'Apply the disagreement test: "The mother\'s quiet response reveals a love shaped by exhaustion rather than anger." Thesis or announcement?', options: ['Thesis — someone could disagree and argue for a different interpretation', 'Announcement — nobody could disagree with this', 'Neither applies here', 'Both at once'], correctIndex: 0, hints: { strategic: 'Could someone reasonably argue a different interpretation?', procedural: 'Yes — this is a specific, debatable claim.', workedStep: 'Thesis.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'plan-thesis-driven-intro', question: 'Apply the disagreement test: "This essay will look at the setting of the story." Thesis or announcement?', options: ['Announcement — nobody could meaningfully disagree', 'Thesis — a specific defensible claim', 'Neither applies', 'Both at once'], correctIndex: 0, hints: { strategic: 'Is there a specific claim to disagree with?', procedural: 'No — it just names a topic.', workedStep: 'Announcement.' }, distractorMisconceptions: { 1: 'intro-has-no-argument' } },
        { id: 'rem-p3', objectiveId: 'plan-thesis-driven-intro', question: 'Apply the disagreement test: "The recurring storm imagery suggests the protagonist\'s inner turmoil is never fully resolved." Thesis or announcement?', options: ['Thesis — a specific, debatable interpretation', 'Announcement — just states a fact', 'Neither applies', 'Both at once'], correctIndex: 0, hints: { strategic: 'Could someone argue for a different reading of the imagery?', procedural: 'Yes — this is an interpretive claim.', workedStep: 'Thesis.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the "disagreement test" for checking if a statement is a genuine thesis?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel planning and structuring a literary response now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the biggest risk when answering a contextual question?', type: 'multiple-choice', options: ['Drifting into general discussion instead of the specific extract/line asked about', 'Writing too little', 'Using too much evidence', 'Answering too quickly'] },
  ],
};
