// ── English HL, Term 2, Topic 3: Comprehension — Inference, Evaluation, Appreciation ──
// Builds on Term 1's comprehension strategies topic, extending to evaluative
// and appreciation question types plus summary writing, using a longer
// argumentative passage per the confirmed Term 2 scope.

import type { LessonContent } from '../../../types';

const PASSAGE = `Should schools ban smartphones during the school day? Supporters of a ban argue that phones are a constant distraction, pulling students' attention away from lessons and toward social media notifications. A 2023 study cited by several education departments found that students in phone-free classrooms scored noticeably higher on tests of sustained attention than those permitted to keep phones nearby, even switched off. Ban supporters also point to the rise in reported cyberbullying incidents that occur during school hours, arguing that removing phones removes the tool, not just the temptation. However, critics of an outright ban warn that it ignores the practical realities of modern family life: many parents rely on being able to reach their children quickly, particularly in an emergency. Critics also argue that smartphones, used well, are powerful learning tools — offering instant access to research, educational apps, and calculators — and that a blanket ban simply pushes the difficult work of teaching responsible use into the future, rather than doing it now, when it matters most. A middle path, adopted by some schools, allows phones to be carried but requires them to be switched off and stored away during lesson time, with clear, escalating consequences for those caught using them. Whichever approach a school chooses, the debate reveals a deeper tension in modern education: how to prepare students for a world saturated with technology, without letting that same technology undermine the very focus school is meant to build.`;

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'evaluation-confused-with-opinion',
    label: 'Giving a personal opinion instead of evaluating the text\'s argument',
    errorType: 'You stated your own view on the topic rather than assessing how well the TEXT itself argues its case.',
    principle: 'An EVALUATIVE question asks you to judge the QUALITY of the text\'s argument, evidence, or reasoning — not simply state your own opinion on the topic. Ground your evaluation in what the text actually does well or poorly.',
    correctStep: 'Not "I think phones should be banned" — instead: "The text\'s use of a specific study strengthens the ban argument, but it doesn\'t address how the study defined \'phone-free,\' which weakens its precision."',
  },
  {
    id: 'bias-not-identified',
    label: 'Not noticing when a text presents one side more favourably than the other',
    errorType: 'You read a text that leans toward one side of an argument without noticing the imbalance.',
    principle: 'Look for signs of BIAS: does the text give more space, stronger evidence, or more persuasive language to one side? Even a text that appears "balanced" may still subtly favour one position through word choice or emphasis.',
    correctStep: 'If a text spends three sentences on one side\'s evidence but only one on the other\'s, that imbalance itself is worth noting as a form of bias.',
  },
  {
    id: 'summary-includes-own-opinion',
    label: 'Including your own opinion or added information in a summary',
    errorType: 'You added your own views or extra information not present in the original text when summarising it.',
    principle: 'A SUMMARY should represent ONLY what the text itself says, in your own words but without adding new opinions, examples, or interpretations. If it\'s not in the text, it doesn\'t belong in the summary.',
    correctStep: 'A summary should never contain phrases like "I think" or add information the original text never mentioned.',
  },
  {
    id: 'tone-register-not-analysed',
    label: 'Not analysing HOW word choice creates a text\'s tone or register',
    errorType: 'You identified the tone (e.g. "serious" or "persuasive") without pointing to the specific words or techniques that create it.',
    principle: 'An APPRECIATION question about tone or register needs you to point to SPECIFIC language choices (word choice, sentence length, level of formality) and explain how they create the effect you\'ve identified.',
    correctStep: 'Not just "the tone is balanced" — add "...shown by the writer presenting both \'supporters\' and \'critics\' with equal space and neutral verbs like \'argue\' and \'point out\' for both sides."',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 2,
  topicId: 'comprehension-evaluation-appreciation',
  topicName: 'Comprehension: Inference, Evaluation, and Appreciation',
  prerequisites: [
    'Comprehension strategies (Term 1, Topic 3)',
  ],
  objectives: [
    { id: 'evaluate-argument-quality', text: 'Evaluate the quality and effectiveness of an argumentative text\'s reasoning and evidence.' },
    { id: 'identify-bias', text: 'Identify signs of bias or imbalance in how a text presents different viewpoints.' },
    { id: 'write-accurate-summary', text: 'Write an accurate summary containing only the text\'s own content, without added opinion.' },
    { id: 'analyse-tone-and-register', text: 'Analyse how specific language choices create a text\'s tone and register.' },
  ],
  estimatedMinutes: [20, 30],
};

export const comprehensionEvaluationAppreciation: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Can a text be "balanced" and still lean toward one side?',
  goalSettingPrompt:
    'You already know how to find facts and make inferences. This lesson builds two more advanced skills: judging how WELL a text argues its case, and writing an accurate, opinion-free summary of it.',

  activate: {
    connectPrompt: 'You already know literal, reorganisation, and inferential questions from Term 1 — this lesson adds evaluative and appreciation questions to your toolkit.',
    diagnosticQuestions: [
      { question: 'What does an inferential question ask you to do?', options: ['Read between the lines using clues and reasoning', 'Find a fact stated directly', 'Give a purely personal opinion', 'Copy a sentence exactly'], correctIndex: 0, explanation: 'Inference means reasoning beyond what\'s directly stated.' },
      { question: 'What should a summary contain?', options: ['Only what the original text says, in your own words', 'Your own opinion of the text', 'New examples not in the text', 'A word-for-word copy'], correctIndex: 0, explanation: 'A summary represents the text\'s own content, not added opinion.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      `Read this longer argumentative passage carefully — you'll use it throughout this lesson: "${PASSAGE}" An EVALUATIVE question asks you to judge the QUALITY of the text's argument — its evidence, reasoning, and how well it supports its claims — not to state your own opinion on the topic itself. Look for signs of BIAS: does the text give more space, stronger evidence, or more persuasive language to one side than the other?`,
    workedExamples: [
      { id: 'wx-evaluate-argument', prompt: 'Evaluate: how effectively does the passage support the claim that phones are "a constant distraction"?', steps: [
        { step: 'Identify the evidence given: a cited 2023 study showing higher test scores in phone-free classrooms.', justification: 'Find what evidence backs the claim.' },
        { step: 'Evaluate its strength: citing a specific study adds credibility, but the passage doesn\'t explain the study\'s sample size, methodology, or source in detail — this limits how fully we can judge its reliability.', justification: 'A strong evaluation notes both what works and what limits the evidence\'s strength.' },
      ], answer: 'The evidence (a cited study) adds some credibility, but lacks enough detail (methodology, source) to fully evaluate its reliability' },
      { id: 'wx-identify-bias', prompt: 'Does this passage lean toward one side of the debate, or stay balanced?', steps: [
        { step: 'Count and compare: both "supporters" and "critics" are given roughly equal space and specific arguments.', justification: 'Check the balance of space/evidence given to each side.' },
        { step: 'The passage also proposes a "middle path" and ends on a neutral, reflective note about the "deeper tension" — this suggests a genuinely balanced approach, not favouring one side.', justification: 'Look at the overall structure and conclusion, not just individual sentences.' },
      ], answer: 'The passage appears genuinely balanced — similar space and neutral language for both sides' },
    ],
    knowledgeChecks: [
      { question: 'Which is a genuine evaluative response to the passage\'s argument quality?', options: ['"The passage cites a specific study, which strengthens the ban argument, though it lacks methodology details"', '"I personally think phones should be banned"', '"Phones are bad for students"', '"The passage is about school phone policies"'], correctIndex: 0, explanation: 'This judges the TEXT\'s argument quality, not just states a personal opinion.', misconceptionId: 'evaluation-confused-with-opinion' },
      { question: 'What would be a sign of bias in a text discussing two sides of an issue?', options: ['Giving one side much more space, evidence, or favourable language than the other', 'Presenting both sides at all', 'Using the word "however"', 'Ending with a question'], correctIndex: 0, explanation: 'Imbalanced treatment of the two sides is a sign of bias.', misconceptionId: 'bias-not-identified' },
    ],
    confidenceCheckPrompt: 'How confident do you feel evaluating an argument\'s quality and identifying bias?',
  },

  demonstrateChunk2: {
    explanation:
      'A SUMMARY should represent ONLY what the text says, in your own words, WITHOUT adding your own opinions, examples, or interpretations not present in the original. An APPRECIATION question about tone or register requires pointing to SPECIFIC language choices (word choice, sentence length, formality level) and explaining how they create the effect you\'ve identified — not just naming the tone alone.',
    workedExamples: [
      { id: 'wx-write-summary', prompt: 'Write a brief, accurate summary of the passage\'s main debate (in 2-3 sentences).', steps: [
        { step: 'Identify the core content: the debate over banning phones in schools, with arguments for (distraction, cyberbullying) and against (family contact, learning tools), plus a proposed middle path.', justification: 'Extract only what the text actually says.' },
        { step: 'Write in your own words, without adding opinion: "The passage examines the debate over banning smartphones in schools. Supporters cite distraction and cyberbullying concerns, while critics highlight family communication needs and learning benefits. Some schools use a middle-path policy of switched-off, stored phones."', justification: 'This represents the text\'s content only, without personal commentary.' },
      ], answer: 'A concise, opinion-free restatement of the passage\'s main points' },
      { id: 'wx-analyse-tone', prompt: 'Analyse the tone of the passage, pointing to specific language.', steps: [
        { step: 'Identify the tone: measured, balanced, reflective — not strongly persuasive toward either side.', justification: 'Name the tone first.' },
        { step: 'Point to specific evidence: neutral reporting verbs ("argue," "point out," "warn"), equal treatment of both viewpoints, and a reflective closing sentence about the "deeper tension" rather than a firm conclusion.', justification: 'Ground the tone claim in specific textual choices.' },
      ], answer: 'Measured and balanced tone, created through neutral verbs, equal treatment of both sides, and a reflective (not conclusive) ending' },
    ],
    knowledgeChecks: [
      { question: 'Which is an appropriate summary sentence (no added opinion)?', options: ['"Critics argue that phones are useful learning tools and that families need contact."', '"I think critics make a better point than supporters."', '"Phones should definitely be allowed at school."', '"This passage proves that banning phones is wrong."'], correctIndex: 0, explanation: 'This restates the text\'s own content without adding personal opinion.', misconceptionId: 'summary-includes-own-opinion' },
      { question: 'What makes a tone analysis complete?', options: ['Naming the tone AND pointing to specific language that creates it', 'Just naming the tone', 'Just describing what the text is about', 'Stating your own feelings about the topic'], correctIndex: 0, explanation: 'A complete appreciation answer connects the tone to specific evidence.', misconceptionId: 'tone-register-not-analysed' },
    ],
    confidenceCheckPrompt: 'How confident do you feel writing an accurate summary and analysing tone with specific evidence?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'evaluate-argument-quality', revealSteps: 1, prompt: 'Evaluate: does the passage\'s mention of cyberbullying strengthen the ban argument effectively?', steps: [
        { step: 'It adds a second, different type of evidence (a social/safety concern, not just academic performance), which broadens and somewhat strengthens the ban argument\'s appeal, though no specific data or statistic is given for this claim.', justification: 'Evaluate both the strength added and any limitations.' },
      ], answer: 'Broadens the argument\'s appeal, but lacks specific supporting data' },
      { id: 'fp-partial-1', objectiveId: 'write-accurate-summary', revealSteps: 1, prompt: 'Summarise the "middle path" solution mentioned in the passage, in one sentence, without adding opinion.', steps: [
        { step: 'Identify only what\'s stated: phones can be carried, but must be switched off and stored during lessons, with escalating consequences for misuse.', justification: 'Extract only the stated details.' },
        { step: 'Write it in your own words: "Some schools allow students to carry phones but require them to be switched off and stored during lessons, with increasing consequences for those who don\'t comply."', justification: 'Restate without adding opinion.' },
      ], answer: 'A one-sentence, opinion-free restatement of the middle-path policy' },
      { id: 'fp-independent-1', objectiveId: 'analyse-tone-and-register', revealSteps: 0, prompt: 'What register (level of formality) does this passage use, and what specific features suggest this?', steps: [
        { step: 'The passage uses formal register: full sentences, no slang or contractions, structured argument with signal words like "however" and "whichever approach."', justification: 'Point to specific formal features as evidence.' },
      ], answer: 'Formal register — shown by full sentences, no contractions/slang, and structured argumentative signal words' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'evaluate-argument-quality', question: 'Which is a genuine evaluation of the passage\'s reasoning (not just an opinion)?', options: ['"The passage doesn\'t specify the source of the 2023 study, which limits how much we can verify its reliability"', '"I don\'t think phones should be banned"', '"This passage is boring"', '"Schools have many rules"'], correctIndex: 0, hints: { strategic: 'Does it judge the TEXT\'s argument, or just state a personal view?', procedural: 'The first option assesses the quality/limitation of the evidence given.', workedStep: 'The first option is a genuine evaluation.' }, distractorMisconceptions: { 1: 'evaluation-confused-with-opinion' } },
      { id: 'ip-2', objectiveId: 'identify-bias', question: 'If a text used words like "wisely" for one side\'s argument and "stubbornly" for the other\'s, what would this suggest?', options: ['Bias — the word choice favours one side', 'Perfect balance', 'A summary', 'A literal question'], correctIndex: 0, hints: { strategic: 'Compare the connotations of "wisely" vs "stubbornly".', procedural: '"Wisely" is positive, "stubbornly" is negative — an imbalance.', workedStep: 'This suggests bias.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'write-accurate-summary', question: 'Which sentence would NOT belong in an accurate summary of this passage?', options: ['"Personally, banning phones is clearly the right choice."', '"Supporters cite a study linking phone-free classrooms to better attention."', '"Critics worry about parents needing to reach their children."', '"Some schools use a middle-path policy."'], correctIndex: 0, hints: { strategic: 'Which one adds a personal opinion not from the text?', procedural: 'The others restate the text\'s own content.', workedStep: 'The first option adds personal opinion — doesn\'t belong.' }, distractorMisconceptions: { 1: 'summary-includes-own-opinion' } },
      { id: 'ip-4', objectiveId: 'analyse-tone-and-register', question: 'What specific feature of the passage supports calling its tone "reflective" rather than "urgent"?', options: ['The closing sentence poses a broader question about technology and focus, rather than pushing for immediate action', 'The passage uses exclamation marks throughout', 'The passage is very short', 'The passage only presents one side'], correctIndex: 0, hints: { strategic: 'Look at how the passage ends.', procedural: 'It reflects on a "deeper tension" rather than demanding urgent action.', workedStep: 'The reflective closing sentence supports this.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'evaluate-argument-quality', multiSelect: false, question: 'True or false: an evaluative question wants your personal opinion on the topic, not an assessment of the text\'s argument.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — evaluative questions assess the TEXT\'s argument quality, not your personal view on the topic.', distractorMisconceptions: { 0: 'evaluation-confused-with-opinion' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'evaluate-argument-quality', multiSelect: false, question: 'What weakens the strength of the study cited in the passage?', options: ['No details are given about its methodology or exact source', 'It is not mentioned at all', 'It only supports the critics\' side', 'It is stated as a definite fact with full data'], correctIndices: [0], explanation: 'The passage cites the study but doesn\'t detail its methodology, limiting verifiability.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'identify-bias', multiSelect: false, question: 'What is one sign that this passage tries to remain balanced?', options: ['Both supporters and critics are given comparable space and neutral reporting verbs', 'Only one side is mentioned', 'The passage ends with a strong personal recommendation', 'The passage uses emotional, one-sided language'], correctIndices: [0], explanation: 'Equal space and neutral language for both sides is a sign of balance, not bias.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'write-accurate-summary', multiSelect: false, question: 'True or false: a good summary can include the writer\'s own opinion, as long as it\'s clearly labelled.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a summary should contain only the original text\'s content, not any added opinion.', distractorMisconceptions: { 0: 'summary-includes-own-opinion' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'write-accurate-summary', multiSelect: false, question: 'Which sentence is appropriate for an accurate summary?', options: ['"The debate centres on distraction and safety concerns versus family contact and learning benefits."', '"Banning phones is obviously correct."', '"This is a very interesting topic."', '"Schools everywhere have banned phones."'], correctIndices: [0], explanation: 'This restates the core content without adding opinion or unsupported claims.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'analyse-tone-and-register', multiSelect: false, question: 'Which detail best supports describing the passage\'s register as formal?', options: ['Full sentence structures with no slang or contractions', 'Frequent use of emojis', 'Very short, casual sentences', 'Direct address to "you" throughout'], correctIndices: [0], explanation: 'Formal register avoids contractions/slang and uses complete, structured sentences.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'analyse-tone-and-register', multiSelect: false, question: 'True or false: simply naming a text\'s tone (e.g. "formal") is a complete appreciation answer on its own.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — you must also point to specific language evidence supporting that tone.', distractorMisconceptions: { 0: 'tone-register-not-analysed' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'evaluate-argument-quality', multiSelect: true, question: 'Which of these are valid ways to evaluate an argument\'s strength? (select all that apply)', options: ['Checking whether evidence is specific and detailed, or vague', 'Checking whether both sides are given fair treatment', 'Simply agreeing or disagreeing with the conclusion personally', 'Checking whether claims are logically supported by the evidence given'], correctIndices: [0, 1, 3], explanation: 'These three are genuine evaluation criteria. Personally agreeing/disagreeing is not evaluation — it\'s opinion.', distractorMisconceptions: { 2: 'evaluation-confused-with-opinion' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'evaluate-argument-quality',
      analogy: 'Think of evaluating an argument like being a judge at a debate competition, not a spectator cheering for your favourite side: a judge assesses HOW WELL each side argued — the quality of their evidence and reasoning — regardless of which side the judge personally agrees with.',
      explanation: 'For any evaluation question, deliberately separate two things: (1) what do YOU personally think about the topic (set this aside); (2) how STRONG is the text\'s evidence and reasoning, specifically (this is what you actually answer with).',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Evaluate: "Schools should ban junk food because a poster in the office suggests it makes some students sick." Is this a strong argument?', steps: [
          { step: 'Set aside personal opinion on junk food bans.', justification: 'Judge the argument\'s quality, not the topic itself.' },
          { step: 'Assess the evidence: "a poster suggests" is a very weak source — vague, unverifiable, and not a credible study or data source.', justification: 'Specific, credible evidence is stronger than vague, unverifiable claims.' },
        ], answer: 'Weak argument — the evidence (a poster) is vague and not credible' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'evaluate-argument-quality', question: 'Which is stronger evidence for an argument about the benefits of exercise?', options: ['"A study of 5,000 people found regular exercisers had 20% lower illness rates"', '"My friend feels good after a run"', '"Everyone knows exercise is good"', '"A poster in the gym says exercise helps"'], correctIndex: 0, hints: { strategic: 'Look for specific, credible, verifiable evidence.', procedural: 'A large, specific study is far stronger than anecdote or vague claims.', workedStep: 'The study is the strongest evidence.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'evaluate-argument-quality', question: 'An argument claims "the new policy failed" but gives no supporting data. How should you evaluate this?', options: ['Weak — the claim lacks any supporting evidence', 'Strong — all claims should be trusted', 'Cannot be evaluated at all', 'It depends only on your personal opinion'], correctIndex: 0, hints: { strategic: 'Is there any evidence given?', procedural: 'No — an unsupported claim is inherently weak.', workedStep: 'Weak, due to lack of evidence.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'evaluate-argument-quality', question: 'Which shows a text fairly representing both sides of a debate?', options: ['Giving comparable space, evidence, and neutral language to each side', 'Only mentioning one side\'s arguments', 'Using strongly negative language for one side only', 'Ending with a one-sided conclusion with no acknowledgement of the other view'], correctIndex: 0, hints: { strategic: 'What would balanced treatment look like?', procedural: 'Comparable space and neutral language for both.', workedStep: 'Giving comparable space and neutral language.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the difference between evaluating an argument and just giving your personal opinion on the topic?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with evaluation, bias-spotting, summary writing, and tone analysis now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you always include when analysing a text\'s tone?', type: 'multiple-choice', options: ['Specific language evidence that creates the tone, not just its name', 'Just the tone\'s name', 'My personal feelings about the topic', 'A full retelling of the text'] },
  ],
};
