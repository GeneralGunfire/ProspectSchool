// ── English HL, Term 1, Topic 3: Comprehension Strategies ────────────────────
// First Reading & Viewing topic. Per
// .planning/research/LIBRARY_ENGLISH_HL_RESEARCH.md, kept to MCQ/short-
// answer with explicit question-type tagging (literal/reorganisation/
// inference), matching the CAPS comprehension taxonomy, and staying within
// what the existing engine's quiz/practice types can represent.

import type { LessonContent } from '../../../types';

const PASSAGE = `Every Saturday morning, the small town of Riverbend holds a "Fix-It Market" in the old community hall. Instead of throwing away broken toasters, torn jackets, or wobbly chairs, residents bring their damaged items to volunteer repairers who fix them for free. The idea started three years ago when Thandi Mokoena, a retired electrician, grew frustrated watching perfectly repairable appliances end up in the local landfill. She put up a single handwritten notice outside the hall offering to fix small appliances for free on Saturday mornings. Twelve people showed up on the first day. Word spread quickly, and within a year, the market had grown to include seamstresses, carpenters, and even a bicycle mechanic. Today, the Fix-It Market repairs an average of 60 items every week, and Thandi estimates it has kept several tonnes of waste out of the landfill since it began. "People are often surprised that something so small could grow this big," she says, "but I think everyone secretly wanted an excuse to stop throwing things away."`;

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'literal-question-overanswered',
    label: 'Adding inference or opinion to a literal (fact-finding) question',
    errorType: 'You added your own interpretation to a question that only asked you to find and state a fact directly from the text.',
    principle: 'A LITERAL question asks for information stated DIRECTLY in the text — your answer should come straight from what\'s written, not from your own added interpretation or opinion.',
    correctStep: '"When did the Fix-It Market start?" — answer directly from the text ("three years ago"), not with your own guess or added commentary.',
  },
  {
    id: 'inference-question-answered-literally',
    label: 'Answering an inferential question with only a direct quote, without reasoning',
    errorType: 'You answered a "why do you think" question by only quoting the text, without explaining your reasoning.',
    principle: 'An INFERENTIAL question asks you to read between the lines — combine textual clues with your own reasoning to reach a conclusion the text doesn\'t state directly. A direct quote alone isn\'t a complete inference.',
    correctStep: '"Why do you think the market grew so quickly?" needs YOUR reasoning based on clues (word spread, others joined), not just a quote.',
  },
  {
    id: 'evidence-not-cited',
    label: 'Making a claim about the text without pointing to supporting evidence',
    errorType: 'You stated an interpretation or inference without backing it up with a specific detail from the text.',
    principle: 'Every inferential or evaluative answer should be backed by SPECIFIC evidence from the text (a quote or a clearly referenced detail) — a claim without evidence is just a guess.',
    correctStep: 'Instead of just "Thandi cares about the environment," support it: "Thandi cares about the environment, shown by her frustration at watching repairable items go to the landfill."',
  },
  {
    id: 'question-keyword-ignored',
    label: 'Not reading the question\'s instruction word carefully (e.g. "explain" vs "identify")',
    errorType: 'You gave a one-word or brief answer to a question that asked you to explain or justify your reasoning.',
    principle: 'Pay close attention to the question\'s instruction word: "Identify" or "Name" wants a short direct answer; "Explain" or "Discuss" wants reasoning; "Why do you think" wants an inference with justification.',
    correctStep: '"Explain why the market succeeded" needs a developed answer with reasoning, not just "because people liked it."',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 1,
  topicId: 'comprehension-strategies',
  topicName: 'Comprehension Strategies',
  prerequisites: [
    'General reading fluency from earlier grades',
  ],
  objectives: [
    { id: 'identify-question-types', text: 'Identify whether a comprehension question is literal, reorganisation, or inferential.' },
    { id: 'answer-literal-questions', text: 'Answer literal and reorganisation questions accurately using directly stated information.' },
    { id: 'make-textual-inferences', text: 'Make inferences by combining textual clues with reasoning, supported by evidence.' },
    { id: 'read-question-instructions', text: 'Respond appropriately to a question\'s instruction word (identify, explain, discuss).' },
  ],
  estimatedMinutes: [20, 30],
};

export const comprehensionStrategies: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Is every question about a text asking the same kind of thing?',
  goalSettingPrompt:
    'Not all comprehension questions want the same kind of answer — some want a fact straight from the page, others want you to read between the lines. By the end of this lesson you\'ll be able to tell the difference and answer each type well.',

  activate: {
    connectPrompt: 'You already read texts and answer questions about them constantly — this lesson makes your strategy for doing that more deliberate.',
    diagnosticQuestions: [
      { question: 'Read: "The shop closed at 6pm." What time did the shop close?', options: ['6pm', '5pm', '7pm', 'Not stated'], correctIndex: 0, explanation: 'This is directly stated in the text — a literal question.' },
      { question: 'Which question type asks you to "read between the lines"?', options: ['Inferential', 'Literal', 'Reorganisation', 'None of these'], correctIndex: 0, explanation: 'Inferential questions require reasoning beyond what\'s directly stated.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      `Read this passage carefully — you'll use it throughout this lesson: "${PASSAGE}" LITERAL questions ask for information stated DIRECTLY in the text — find and state it, without adding your own interpretation. REORGANISATION questions ask you to find information from different parts of the text and combine or summarise it in your own words — still based only on what\'s stated, just reorganised.`,
      workedExamples: [
      { id: 'wx-literal-question', prompt: 'Literal question: Who started the Fix-It Market?', steps: [
        { step: 'Scan the text for the name directly associated with starting the market.', justification: 'Literal questions are answered by locating the exact stated fact.' },
        { step: 'The text states: "The idea started... when Thandi Mokoena, a retired electrician..."', justification: 'This directly names the person.' },
      ], answer: 'Thandi Mokoena' },
      { id: 'wx-reorganisation-question', prompt: 'Reorganisation question: List, in your own words, the different types of volunteers who joined the market over time.', steps: [
        { step: 'Find all mentions of volunteer types across the passage: "seamstresses, carpenters, and even a bicycle mechanic" plus the original repairer (electrician).', justification: 'This information is scattered across different sentences.' },
        { step: 'Combine into a summary: an electrician started it, then seamstresses, carpenters, and a bicycle mechanic joined.', justification: 'Reorganisation means combining scattered facts into one organised answer.' },
      ], answer: 'An electrician (the founder), then seamstresses, carpenters, and a bicycle mechanic joined over time' },
    ],
    knowledgeChecks: [
      { question: 'Literal question: How many people showed up on the first day?', options: ['Twelve', 'Sixty', 'Three', 'Not stated'], correctIndex: 0, explanation: 'Directly stated: "Twelve people showed up on the first day."', misconceptionId: 'literal-question-overanswered' },
      { question: 'Reorganisation question: Approximately how many items does the market repair each week now, according to the text?', options: ['60', '12', '3', 'Not stated'], correctIndex: 0, explanation: 'Directly stated: "repairs an average of 60 items every week."', misconceptionId: 'literal-question-overanswered' },
    ],
    confidenceCheckPrompt: 'How confident do you feel answering literal and reorganisation questions accurately?',
  },

  demonstrateChunk2: {
    explanation:
      'INFERENTIAL questions ask you to read between the lines — combine textual CLUES with your own reasoning to reach a conclusion the text doesn\'t state directly. Every inference needs EVIDENCE: point to the specific detail(s) that led you there. Also pay attention to the question\'s INSTRUCTION WORD: "Identify" or "Name" wants a short direct answer; "Explain" or "Discuss" wants developed reasoning.',
    workedExamples: [
      { id: 'wx-inference', prompt: 'Inferential question: Why do you think Thandi put up "a single handwritten notice" rather than something more elaborate?', steps: [
        { step: 'Look for clues: this was a small, personal, frustration-driven idea, not a planned business venture.', justification: 'Identify relevant textual clues before reasoning.' },
        { step: 'Infer: a handwritten notice suggests a modest, low-cost, personal first attempt — she likely wasn\'t expecting it to grow into something big.', justification: 'Combine the clue with reasoning to reach a conclusion the text doesn\'t state directly.' },
      ], answer: 'It suggests a small, personal, low-key first attempt — she likely didn\'t expect it to grow as much as it did (supported by her own surprise, quoted at the end)' },
      { id: 'wx-instruction-word', prompt: 'Compare two questions: "Identify the year the market started" vs. "Explain why the market has been successful."', steps: [
        { step: '"Identify" wants a short, direct fact: "three years ago" (or the specific year if given).', justification: 'Match the answer length/depth to the instruction word.' },
        { step: '"Explain" wants developed reasoning: e.g. it filled a real need (reducing waste), it was free and accessible, and word-of-mouth growth built a community around it.', justification: 'A one-word answer would be insufficient for "explain".' },
      ], answer: 'Identify → short fact; Explain → developed reasoning with multiple points' },
    ],
    knowledgeChecks: [
      { question: 'Inferential question: What can you infer about how Thandi feels about the market\'s growth, based on her quote at the end?', options: ['She is pleasantly surprised by how much people wanted this', 'She is disappointed it didn\'t grow faster', 'She dislikes the attention', 'The text gives no clue about her feelings'], correctIndex: 0, explanation: 'Her quote about people "secretly" wanting an excuse suggests warm surprise at the response.', misconceptionId: 'inference-question-answered-literally' },
      { question: 'A question says "Explain why word spread quickly." What kind of answer is needed?', options: ['A developed answer with reasoning and evidence', 'A single word', 'A direct quote with no explanation', 'A yes/no answer'], correctIndex: 0, explanation: '"Explain" requires developed reasoning, not a brief answer.', misconceptionId: 'question-keyword-ignored' },
    ],
    confidenceCheckPrompt: 'How confident do you feel making inferences and matching your answer depth to the question\'s instruction word?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'answer-literal-questions', revealSteps: 1, prompt: 'Literal question: What was Thandi\'s profession before retiring?', steps: [
        { step: 'The text states: "Thandi Mokoena, a retired electrician."', justification: 'Directly stated fact.' },
      ], answer: 'Electrician' },
      { id: 'fp-partial-1', objectiveId: 'make-textual-inferences', revealSteps: 1, prompt: 'Inferential question: What does the growth from 12 people to 60 items/week suggest about the community\'s need for this service?', steps: [
        { step: 'Clue: rapid, sustained growth over time, not a one-off event.', justification: 'Identify the relevant clue.' },
        { step: 'Infer: there was a real, ongoing demand for affordable repair services that wasn\'t being met before.', justification: 'Combine the clue with reasoning.' },
      ], answer: 'It suggests there was significant unmet demand for this kind of service in the community' },
      { id: 'fp-independent-1', objectiveId: 'identify-question-types', revealSteps: 0, prompt: 'Classify this question: "Summarise, in your own words, how the Fix-It Market has changed since it started."', steps: [
        { step: 'This asks you to combine information from across the whole passage and restate it — not a single directly-quotable fact, and not asking for interpretation beyond the text.', justification: 'This matches the definition of a reorganisation question.' },
      ], answer: 'Reorganisation question' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'identify-question-types', question: 'Classify: "How many tonnes of waste has the market kept out of the landfill?"', options: ['Literal (though the exact number isn\'t given precisely)', 'Inferential', 'Reorganisation', 'Evaluative'], correctIndex: 0, hints: { strategic: 'Is this asking for a directly stated fact?', procedural: 'The text mentions "several tonnes" directly.', workedStep: 'Literal.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'answer-literal-questions', question: 'Literal question: What day of the week does the market happen?', options: ['Saturday', 'Sunday', 'Friday', 'Not stated'], correctIndex: 0, hints: { strategic: 'Scan for the directly stated day.', procedural: '"Every Saturday morning..."', workedStep: 'Saturday.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'make-textual-inferences', question: 'Inferential question: What might the "old community hall" suggest about the town of Riverbend?', options: ['It is a small, close-knit, perhaps older-established town', 'It is a large modern city', 'It has no community spaces', 'The text gives no clue at all'], correctIndex: 0, hints: { strategic: 'What connotation does "old community hall" and "small town" carry together?', procedural: 'These details suggest a small, established, close-knit community.', workedStep: 'A small, close-knit, perhaps older-established town.' }, distractorMisconceptions: { 3: 'evidence-not-cited' } },
      { id: 'ip-4', objectiveId: 'read-question-instructions', question: 'A question asks "Name one type of volunteer who joined the market." What kind of answer is expected?', options: ['A short, direct answer (e.g. "a carpenter")', 'A full paragraph with reasoning', 'A personal opinion', 'A comparison to another text'], correctIndex: 0, hints: { strategic: '"Name" is a literal-style instruction word.', procedural: 'It wants a brief, direct fact.', workedStep: 'A short, direct answer.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'answer-literal-questions', multiSelect: false, question: 'Literal: How long ago did the Fix-It Market start?', options: ['Three years ago', 'One year ago', 'Twelve years ago', 'Not stated'], correctIndices: [0], explanation: 'Directly stated: "The idea started three years ago."', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'identify-question-types', multiSelect: false, question: 'Classify: "List all the types of volunteers mentioned across the passage."', options: ['Reorganisation', 'Literal', 'Inferential', 'Evaluative'], correctIndices: [0], explanation: 'Requires combining scattered facts from different parts of the text.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'answer-literal-questions', multiSelect: false, question: 'True or false: a literal question answer should include your own opinion about the text.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — literal questions want only what is directly stated.', distractorMisconceptions: { 0: 'literal-question-overanswered' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'make-textual-inferences', multiSelect: false, question: 'Inferential: What can you infer about why "word spread quickly" after the first day?', options: ['People found the free repair service valuable and told others', 'Nobody actually used the service', 'The notice was very elaborate', 'The text explicitly states the reason in detail'], correctIndices: [0], explanation: 'This is a reasonable inference from the context, though not stated in those exact words.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'make-textual-inferences', multiSelect: false, question: 'True or false: an inference should always be backed by specific evidence from the text.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — an unsupported claim is just a guess, not a valid inference.', distractorMisconceptions: { 1: 'evidence-not-cited' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'read-question-instructions', multiSelect: false, question: 'A question says "Discuss the impact of the Fix-It Market on the community." What is expected?', options: ['A developed answer covering multiple points with reasoning', 'A single word', 'A yes/no answer', 'A direct quote only'], correctIndices: [0], explanation: '"Discuss" requires a developed, multi-point answer.', distractorMisconceptions: { 3: 'question-keyword-ignored' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'identify-question-types', multiSelect: false, question: 'Classify: "What is the name of the town where the market takes place?"', options: ['Literal', 'Inferential', 'Reorganisation', 'Evaluative'], correctIndices: [0], explanation: 'Directly stated: "Riverbend".', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-question-types', multiSelect: true, question: 'Which of these are literal questions about the passage? (select all that apply)', options: ['"Who started the market?"', '"How many items does the market repair weekly?"', '"Why do you think the market succeeded?"', '"What does Thandi\'s quote suggest about her expectations?"'], correctIndices: [0, 1], explanation: 'The first two ask for directly stated facts. The last two require inference/reasoning beyond the text.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'make-textual-inferences',
      analogy: 'Think of making an inference like a detective solving a case: you can\'t just guess — you gather CLUES (details from the text) and connect them with your own REASONING to reach a conclusion. And just like a detective, you must be ready to point to the exact clue that led you there.',
      explanation: 'For any inferential question: (1) find the specific clue(s) in the text; (2) explain what those clues suggest, using your own reasoning; (3) state your conclusion, always tying it back to the evidence.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Infer: What can you tell about Thandi\'s personality from the passage?', steps: [
          { step: 'Clue: she grew "frustrated" watching repairable items go to waste, and acted on it by starting the market herself.', justification: 'Identify the specific clue.' },
          { step: 'Reasoning: this suggests she is practical, proactive, and cares about reducing waste — she didn\'t just complain, she did something about it.', justification: 'Connect the clue to a conclusion using reasoning.' },
        ], answer: 'She seems practical, proactive, and environmentally conscious — shown by turning her frustration into direct action' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'make-textual-inferences', question: 'What can you infer from the market growing to include "seamstresses, carpenters, and even a bicycle mechanic"?', options: ['The market expanded beyond just electrical repairs to many kinds of fixing', 'Only electrical items are ever repaired there', 'The market shrank over time', 'No inference is possible from this detail'], correctIndex: 0, hints: { strategic: 'What does the range of skills mentioned suggest?', procedural: 'Different trades joined, not just the original electrician.', workedStep: 'The market expanded to cover many kinds of repairs.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'make-textual-inferences', question: 'What can you infer about the local landfill situation from Thandi\'s original frustration?', options: ['Repairable items were commonly being thrown away unnecessarily', 'The landfill was completely empty before', 'Nobody in Riverbend ever threw anything away', 'The text gives no clue about this'], correctIndex: 0, hints: { strategic: 'What triggered her frustration in the first place?', procedural: 'Watching repairable appliances end up in the landfill.', workedStep: 'Repairable items were commonly wasted.' }, distractorMisconceptions: { 3: 'evidence-not-cited' } },
        { id: 'rem-p3', objectiveId: 'make-textual-inferences', question: 'What can you infer about the market\'s cost to attendees, based on the passage?', options: ['It is free (explicitly mentioned as a repair service offered "for free")', 'It is very expensive', 'The cost varies by item', 'The text gives no clue about cost'], correctIndex: 0, hints: { strategic: 'This one is actually close to literal — check the text directly.', procedural: 'The text states items are fixed "for free" more than once.', workedStep: 'It is free.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the difference between a literal question and an inferential question?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel identifying question types and answering each appropriately now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you always do before answering an inferential question?', type: 'multiple-choice', options: ['Find specific evidence in the text to support my reasoning', 'Just write my personal opinion', 'Copy a sentence from the text with no explanation', 'Guess without checking the text'] },
  ],
};
