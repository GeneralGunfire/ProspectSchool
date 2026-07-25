// ── English HL, Term 4, Topic 1: Visual Literacy and Persuasive Techniques ───
// The one genuinely new Term 4 topic per
// .planning/research/LIBRARY_ENGLISH_HL_RESEARCH.md's Term 3/4 follow-up —
// advertisements, cartoons, infographics. No image-rendering component
// exists, so visual texts are described precisely in words (the same
// convention used in printed exam papers when describing an image for
// screen-reader/text purposes) rather than rendered graphically.

import type { LessonContent } from '../../../types';

const AD_DESCRIPTION = `Description of a print advertisement: The image shows a wilting houseplant in a small pot on a cracked, dry windowsill, photographed in dull grey light. Below it, in bold red capital letters, is the headline "IS YOUR PLANT SILENTLY DYING?" Beneath that, in smaller text: "AquaGro Self-Watering Pots detect soil moisture and water automatically — so you never have to guess again." In the bottom corner, a bright, vivid photo of a thriving green plant in a sleek white pot sits beside the slogan "Never say goodbye to a plant again." The brand logo and a discount code ("SAVE20") appear in the bottom right corner.`;

const CARTOON_DESCRIPTION = `Description of an editorial cartoon: A large, exhausted-looking figure labelled "TAXPAYER" is shown bent over, carrying an enormous stack of boxes labelled with different government department names, sweat dripping from his brow. In the background, several small, well-dressed figures labelled "OFFICIALS" sit comfortably at a table laden with food, appearing not to notice him. A single speech bubble from one of the seated figures reads: "We really must discuss efficiency at our next meeting." The cartoon is captioned: "Some things never change."`;

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'visual-technique-named-without-purpose',
    label: 'Naming a visual technique without explaining what it persuades the viewer to think or feel',
    errorType: 'You identified a visual choice (like colour or image contrast) without connecting it to its persuasive purpose.',
    principle: 'Every visual choice in an advert or cartoon serves a PERSUASIVE purpose — always connect what you notice (colour, contrast, size, placement) to what it makes the viewer think, feel, or want to do.',
    correctStep: 'Not just "the healthy plant is in bright colours" — add "...contrasting with the dull, grey wilting plant, this makes the product\'s result look far more appealing by comparison."',
  },
  {
    id: 'emotive-appeal-not-identified',
    label: 'Not recognising when an advert appeals to emotion rather than logic/facts',
    errorType: 'You treated an emotionally-driven persuasive appeal as if it were a factual, logical argument.',
    principle: 'Adverts often appeal to EMOTION (fear, guilt, desire, humour) rather than pure logic or evidence — a question like "Is your plant silently dying?" creates worry/guilt, not a factual claim to be verified.',
    correctStep: '"Never say goodbye to a plant again" appeals to the fear of loss/guilt, not to a verifiable factual claim about the product\'s effectiveness.',
  },
  {
    id: 'satire-taken-literally',
    label: 'Reading a satirical/editorial cartoon\'s exaggeration as a literal, factual claim',
    errorType: 'You interpreted an exaggerated cartoon image or caption as if it were making a literal, factual statement.',
    principle: 'Editorial cartoons use EXAGGERATION and SYMBOLISM to make a POINT, not to literally depict reality — a giant labelled figure or absurd size difference is a visual metaphor for an idea (like burden or inequality), not a literal claim.',
    correctStep: 'The oversized stack of boxes doesn\'t literally claim a taxpayer carries physical boxes — it symbolically represents the burden of taxation/bureaucracy.',
  },
  {
    id: 'layout-significance-ignored',
    label: 'Not considering how layout, size, and positioning contribute to a visual text\'s meaning',
    errorType: 'You analysed only the words/images in isolation without considering how their SIZE, POSITION, or ARRANGEMENT affects meaning.',
    principle: 'In visual texts, size and position carry meaning: larger elements draw attention first; central or top placement often signals importance; contrast between elements (e.g. before/after images) is a deliberate persuasive structure.',
    correctStep: 'The bold, large red headline is positioned to be read FIRST, immediately establishing worry before the viewer even reaches the product information.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'english-hl',
  grade: 10,
  term: 4,
  topicId: 'visual-literacy-and-persuasive-techniques',
  topicName: 'Visual Literacy and Persuasive Techniques',
  prerequisites: [
    'Comprehension: inference, evaluation, and appreciation (Term 2)',
    'Reading formal and critical texts (Term 3)',
  ],
  objectives: [
    { id: 'analyse-advert-techniques', text: 'Analyse how visual and verbal techniques in an advertisement work together to persuade.' },
    { id: 'identify-emotive-appeals', text: 'Identify when a persuasive text appeals to emotion rather than logic or evidence.' },
    { id: 'interpret-editorial-cartoons', text: 'Interpret the symbolism and exaggeration in an editorial cartoon, without reading it literally.' },
    { id: 'analyse-layout-significance', text: 'Explain how layout, size, and positioning contribute to a visual text\'s meaning.' },
  ],
  estimatedMinutes: [20, 30],
};

export const visualLiteracyAndPersuasiveTechniques: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What is an advertisement actually trying to make you FEEL, not just know?',
  goalSettingPrompt:
    'Visual texts — adverts, cartoons, infographics — persuade through image, layout, and words working together, often appealing to emotion rather than pure fact. By the end of this lesson you\'ll be able to break down exactly how these techniques work.',

  activate: {
    connectPrompt: 'You already know how to evaluate an argument\'s quality and identify bias in written texts — this lesson extends those skills to visual and persuasive texts.',
    diagnosticQuestions: [
      { question: 'What does "persuasive" language aim to do?', options: ['Convince the reader/viewer to think or act a certain way', 'Simply inform without any angle', 'Only entertain', 'List facts with no viewpoint'], correctIndex: 0, explanation: 'Persuasive texts aim to convince, not just inform.' },
      { question: 'Can an argument appeal to emotion instead of logic?', options: ['Yes, this is very common in advertising', 'No, all arguments are purely logical', 'Only in poetry', 'Never in persuasive texts'], correctIndex: 0, explanation: 'Emotional appeals are extremely common, especially in advertising.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      `Study this advertisement description carefully — you'll use it in this lesson:\n\n"${AD_DESCRIPTION}"\n\nEvery visual choice in an advert serves a PERSUASIVE purpose — always connect what you notice (colour, contrast, size, placement) to what it makes the viewer think, feel, or want to do. Adverts often appeal to EMOTION (fear, guilt, desire, humour) rather than pure logic or verifiable evidence.`,
    workedExamples: [
      { id: 'wx-colour-contrast', prompt: 'Analyse the effect of contrasting the dull, grey wilting plant with the bright, vivid healthy plant.', steps: [
        { step: 'Identify the technique: strong visual contrast (dull/grey vs. bright/vivid) between a "before" and "after" state.', justification: 'Name the specific visual technique.' },
        { step: 'Effect: this makes the product\'s result look dramatically more appealing by direct comparison, exaggerating the difference to strengthen the persuasive pull.', justification: 'Connect the technique to its persuasive purpose.' },
      ], answer: 'The stark visual contrast exaggerates the product\'s appeal by comparison' },
      { id: 'wx-emotive-appeal', prompt: 'Is "Is your plant silently dying?" a factual claim or an emotional appeal?', steps: [
        { step: 'This is a question, not a verifiable factual statement — it can\'t really be fact-checked as written.', justification: 'Check whether the language makes a checkable factual claim.' },
        { step: 'It creates worry and guilt (the word "silently" implies a hidden problem the viewer has failed to notice) — an emotional appeal, not a factual one.', justification: 'Identify the specific emotion being targeted.' },
      ], answer: 'Emotional appeal — creates worry/guilt, not a factual claim' },
    ],
    knowledgeChecks: [
      { question: 'What is the effect of placing the healthy plant image in the bottom corner alongside the slogan?', options: ['It positions the "solution" and its emotional payoff (never losing a plant) together, reinforcing the product\'s appeal', 'It has no particular significance', 'It is simply where all adverts place logos', 'It suggests the product doesn\'t work well'], correctIndex: 0, explanation: 'The positioning deliberately links the visual solution with the emotional promise.', misconceptionId: 'visual-technique-named-without-purpose' },
      { question: '"Never say goodbye to a plant again" appeals to which emotion?', options: ['Fear of loss', 'Pure logic and statistics', 'Anger', 'Boredom'], correctIndex: 0, explanation: 'This appeals to the fear/sadness of losing something, not to facts.', misconceptionId: 'emotive-appeal-not-identified' },
    ],
    confidenceCheckPrompt: 'How confident do you feel analysing an advertisement\'s visual and emotional persuasive techniques?',
  },

  demonstrateChunk2: {
    explanation:
      `Study this editorial cartoon description — you'll use it in this section:\n\n"${CARTOON_DESCRIPTION}"\n\nEditorial cartoons use EXAGGERATION and SYMBOLISM to make a point, not to literally depict reality — an oversized figure or absurd contrast is a visual metaphor for an idea, not a literal claim. In visual texts generally, SIZE and POSITION carry meaning: larger elements draw attention first; contrast (like before/after) is a deliberate persuasive structure.`,
    workedExamples: [
      { id: 'wx-cartoon-symbolism', prompt: 'What does the oversized stack of boxes symbolise, and why is it exaggerated rather than literal?', steps: [
        { step: 'Literally, a taxpayer doesn\'t carry physical labelled boxes — this is clearly not meant as a literal depiction.', justification: 'Recognise the exaggeration signals symbolism, not literal reality.' },
        { step: 'Symbolically, the boxes represent the burden of government departments/taxation/bureaucracy that ordinary taxpayers must "carry" (fund/support).', justification: 'Connect the visual symbol to its represented idea.' },
      ], answer: 'The boxes symbolise the burden of taxation/bureaucracy — exaggerated as a visual metaphor, not literal' },
      { id: 'wx-cartoon-contrast', prompt: 'What does the contrast between the exhausted taxpayer and the comfortable officials suggest?', steps: [
        { step: 'One figure is straining and sweating; the others are relaxed, well-fed, and seemingly unaware of his struggle.', justification: 'Note the visual contrast between the two groups.' },
        { step: 'This suggests a critical view: those in comfortable positions (officials) are disconnected from or indifferent to the burden carried by ordinary people (taxpayers).', justification: 'Connect the visual contrast to the cartoon\'s critical message.' },
      ], answer: 'It suggests officials are disconnected from/indifferent to the burden on ordinary taxpayers' },
    ],
    knowledgeChecks: [
      { question: 'Should the oversized boxes in the cartoon be read literally?', options: ['No — they are an exaggerated visual symbol, not a literal depiction', 'Yes, cartoons always show literal events', 'Only if the caption confirms it', 'Cartoons never use symbolism'], correctIndex: 0, explanation: 'Editorial cartoons rely on exaggeration and symbolism, not literal depiction.', misconceptionId: 'satire-taken-literally' },
      { question: 'What does the officials\' comfortable, well-fed appearance (versus the taxpayer\'s exhaustion) contribute to the cartoon\'s meaning?', options: ['It visually reinforces the cartoon\'s critical point about inequality/indifference', 'It has no relevance to the cartoon\'s message', 'It only shows literal information about food', 'It makes the cartoon purely comedic with no message'], correctIndex: 0, explanation: 'The visual contrast is a deliberate part of the cartoon\'s critique.', misconceptionId: 'layout-significance-ignored' },
    ],
    confidenceCheckPrompt: 'How confident do you feel interpreting symbolism and layout in an editorial cartoon?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'analyse-advert-techniques', revealSteps: 1, prompt: 'What is the effect of the bold, large red headline text in the advert?', steps: [
        { step: 'Bold, large, red text draws immediate visual attention and creates urgency/alarm before any other information is read.', justification: 'Size and colour choices are deliberate attention-directing and emotion-creating techniques.' },
      ], answer: 'Draws immediate attention and creates urgency/alarm first' },
      { id: 'fp-partial-1', objectiveId: 'identify-emotive-appeals', revealSteps: 1, prompt: 'Is the discount code "SAVE20" primarily a logical or emotional appeal?', steps: [
        { step: 'It offers a concrete incentive (a discount), which is more transactional/practical than purely emotional.', justification: 'Consider whether this appeals to feelings or to practical self-interest.' },
        { step: 'This is closer to a practical/logical incentive (save money) rather than an emotional appeal like the headline.', justification: 'Different parts of an advert can use different persuasive strategies.' },
      ], answer: 'Practical/logical incentive (saving money), distinct from the emotional headline' },
      { id: 'fp-independent-1', objectiveId: 'interpret-editorial-cartoons', revealSteps: 0, prompt: 'What is the effect of the caption "Some things never change"?', steps: [
        { step: 'This suggests the cartoon\'s criticism (officials\' indifference to ordinary people\'s burden) is depicted as a long-standing, recurring problem, not a one-off event.', justification: 'The caption frames the cartoon\'s message as an ongoing, familiar pattern.' },
      ], answer: 'It frames the criticism as a long-standing, recurring problem, not a one-off event' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'analyse-advert-techniques', question: 'What technique is used by placing the wilting plant and healthy plant images in the same advert?', options: ['Before/after contrast to persuade through comparison', 'Random unrelated placement', 'Pure factual demonstration with no persuasive intent', 'A technique with no name'], correctIndex: 0, hints: { strategic: 'What kind of comparison structure is this?', procedural: 'A "before and after" contrast.', workedStep: 'Before/after contrast.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'identify-emotive-appeals', question: 'Which emotion does "IS YOUR PLANT SILENTLY DYING?" most directly target?', options: ['Guilt/worry about having failed to notice a problem', 'Pure happiness', 'Boredom', 'Confusion with no emotional content'], correctIndex: 0, hints: { strategic: 'What does "silently" suggest about the viewer\'s awareness?', procedural: 'It implies they may have missed something important — creating guilt/worry.', workedStep: 'Guilt/worry.' }, distractorMisconceptions: { 1: 'emotive-appeal-not-identified' } },
      { id: 'ip-3', objectiveId: 'interpret-editorial-cartoons', question: 'Should the reader interpret the officials\' table "laden with food" literally as a factual claim about their diet?', options: ['No — it symbolically represents excess/comfort, not a literal factual claim', 'Yes, this is a literal factual report', 'It has no symbolic meaning at all', 'It is only about food, unrelated to the cartoon\'s message'], correctIndex: 0, hints: { strategic: 'Editorial cartoons use exaggeration symbolically.', procedural: 'The food represents excess/comfort as a contrast to the taxpayer\'s struggle.', workedStep: 'Symbolic, not literal.' }, distractorMisconceptions: { 1: 'satire-taken-literally' } },
      { id: 'ip-4', objectiveId: 'analyse-layout-significance', question: 'Why might the brand logo and discount code be placed in the bottom right corner rather than the centre?', options: ['This is a conventional placement that doesn\'t compete with the main emotional/visual message for attention', 'It has no reason at all', 'It is always centred in every advert', 'It makes the advert impossible to read'], correctIndex: 0, hints: { strategic: 'What gets attention FIRST in the layout, and what is left for last?', procedural: 'The headline and images are central/prominent; practical details are secondary.', workedStep: 'It avoids competing with the main persuasive message.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'analyse-advert-techniques', multiSelect: false, question: 'What persuasive purpose does contrasting a dull "before" image with a vivid "after" image serve?', options: ['It exaggerates the appeal of the product\'s result through comparison', 'It has no persuasive purpose', 'It is purely decorative', 'It confuses the viewer intentionally'], correctIndices: [0], explanation: 'Before/after contrast is a deliberate persuasive technique.', distractorMisconceptions: { 1: 'visual-technique-named-without-purpose' } },
    { id: 'q2', type: 'true-false', objectiveId: 'identify-emotive-appeals', multiSelect: false, question: 'True or false: "Is your plant silently dying?" is a verifiable factual claim.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — it is an emotionally-loaded question, not a factual claim.', distractorMisconceptions: { 0: 'emotive-appeal-not-identified' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'identify-emotive-appeals', multiSelect: false, question: 'Which emotion does "Never say goodbye to a plant again" most directly appeal to?', options: ['Fear of loss', 'Pure logic', 'Boredom', 'Confusion'], correctIndices: [0], explanation: 'This targets the fear/sadness of losing something valued.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'interpret-editorial-cartoons', multiSelect: false, question: 'True or false: an editorial cartoon\'s exaggerated imagery should be read as a literal factual claim.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — exaggeration in editorial cartoons is symbolic, not literal.', distractorMisconceptions: { 0: 'satire-taken-literally' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'interpret-editorial-cartoons', multiSelect: false, question: 'What does the caption "Some things never change" suggest about the cartoon\'s criticism?', options: ['It presents the issue as long-standing and recurring, not a one-off', 'It suggests the issue was just resolved', 'It has no connection to the cartoon\'s message', 'It suggests everything is fine now'], correctIndices: [0], explanation: 'The caption frames the criticism as an ongoing pattern.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'analyse-layout-significance', multiSelect: false, question: 'Why is the headline placed in large, bold text at the top of the advert?', options: ['To draw immediate attention and establish the emotional hook before other details', 'Layout has no effect on meaning', 'It is simply a random design choice', 'To make the advert harder to read'], correctIndices: [0], explanation: 'Size and position deliberately control what the viewer notices first.', distractorMisconceptions: { 1: 'layout-significance-ignored' } },
    { id: 'q7', type: 'true-false', objectiveId: 'analyse-layout-significance', multiSelect: false, question: 'True or false: the size and position of elements in a visual text are usually deliberate, meaningful choices.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — layout is a deliberate part of a visual text\'s persuasive strategy.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'analyse-advert-techniques', multiSelect: true, question: 'Which of these are persuasive techniques used in the plant advert? (select all that apply)', options: ['Before/after visual contrast', 'An emotionally-loaded question as headline', 'A discount code as practical incentive', 'A fully neutral, purely factual product description with no persuasive language'], correctIndices: [0, 1, 2], explanation: 'The first three are all genuine persuasive techniques used in the advert. The advert is not purely neutral/factual.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'identify-emotive-appeals',
      analogy: 'Think of the "fact-check test": for any persuasive statement, ask "could I verify this with evidence, or does it only work by making me FEEL something?" A statistic or study result could be checked. A statement designed to trigger fear, guilt, or desire cannot be "checked" the same way — it\'s built to persuade through emotion, not proof.',
      explanation: 'For any persuasive line, ask: (1) Does it state something checkable/factual? (2) Or does it primarily target an emotion (fear, guilt, desire, pride)? Most advertising headlines and slogans are built for emotional impact, not factual verification.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Apply the fact-check test to: "Don\'t let your family down — choose SafeHome Insurance today."', steps: [
          { step: 'Could this be verified/fact-checked? No — "letting your family down" is not a measurable claim.', justification: 'Apply the fact-check test.' },
          { step: 'This targets guilt and fear (of failing one\'s family) — an emotional appeal.', justification: 'Identify the specific emotion targeted.' },
        ], answer: 'Emotional appeal — guilt and fear, not a factual claim' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'identify-emotive-appeals', question: 'Apply the fact-check test: "9 out of 10 dentists recommend this toothpaste." Fact-based or emotional?', options: ['Fact-based (a checkable, specific statistic)', 'Purely emotional, no factual content', 'Neither applies', 'Both equally'], correctIndex: 0, hints: { strategic: 'Is this a specific, checkable statistic?', procedural: 'Yes — a claimed statistic that could be verified.', workedStep: 'Fact-based (though its reliability could still be questioned separately).' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'identify-emotive-appeals', question: 'Apply the fact-check test: "Don\'t miss out — this offer won\'t last!" Fact-based or emotional?', options: ['Emotional — creates urgency/fear of missing out', 'Fact-based, a specific verifiable claim', 'Neither applies', 'Both equally'], correctIndex: 0, hints: { strategic: 'Is there a specific fact, or does it create a feeling?', procedural: 'It creates urgency/fear of missing out (FOMO), not a checkable fact.', workedStep: 'Emotional appeal.' }, distractorMisconceptions: { 1: 'emotive-appeal-not-identified' } },
        { id: 'rem-p3', objectiveId: 'identify-emotive-appeals', question: 'Apply the fact-check test: "This car has a 5-star safety rating." Fact-based or emotional?', options: ['Fact-based (a specific, checkable rating)', 'Purely emotional', 'Neither applies', 'Both equally'], correctIndex: 0, hints: { strategic: 'Is this a specific, verifiable claim?', procedural: 'Yes — a rating that can be checked against official sources.', workedStep: 'Fact-based.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the "fact-check test" for telling emotional appeals from factual claims?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel analysing adverts and editorial cartoons now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What should you never do when interpreting an editorial cartoon\'s exaggerated imagery?', type: 'multiple-choice', options: ['Read it literally, as a factual claim', 'Consider its symbolic meaning', 'Think about what it criticises', 'Look at size and positioning'] },
  ],
};
