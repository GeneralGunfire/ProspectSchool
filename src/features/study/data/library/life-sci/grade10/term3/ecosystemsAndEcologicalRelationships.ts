// ── Life Sciences, Term 3, Topic 2: Ecosystems and Ecological Relationships ──
// Builds on The Biosphere and Biomes (this term). Introductory Grade 10 scope:
// producers/consumers/decomposers, food chains and webs, energy flow vs
// nutrient cycling, ecological relationships, and population limiting factors.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'decomposers-destroy-matter',
    label: 'Believing decomposers destroy matter rather than recycling it',
    errorType: 'You described decomposers as "getting rid of" or "destroying" dead organic matter, rather than recycling its nutrients.',
    principle: 'DECOMPOSERS (e.g. bacteria, fungi) break down dead organisms and waste, RELEASING the nutrients locked within them back into the ecosystem (e.g. into the soil) where they can be reused by producers. This is RECYCLING of matter, not destruction — nutrients are not lost, they are made available again.',
    correctStep: 'When a fallen leaf decomposes, the nutrients it contained (like nitrogen) are released into the soil and can be absorbed by plant roots — the nutrients are recycled, not destroyed.',
  },
  {
    id: 'food-chains-treated-as-only-model',
    label: 'Treating food chains as the only accurate way organisms feed, ignoring food webs',
    errorType: 'You described feeding relationships as a single, rigid, one-path sequence, without acknowledging that most organisms have multiple feeding connections.',
    principle: 'A FOOD CHAIN shows one single, simplified feeding sequence, but real ecosystems have FOOD WEBS — many interconnected food chains, since most organisms eat more than one type of food and are eaten by more than one predator. Food webs give a more realistic picture of an ecosystem\'s feeding relationships.',
    correctStep: 'A single food chain might show "grass → antelope → lion", but in reality the antelope also eats other plants, and the lion also eats zebra and buffalo — this network of connections is a food web, not a single chain.',
  },
  {
    id: 'all-interactions-seen-as-predation',
    label: 'Assuming all ecological interactions are predator-prey relationships',
    errorType: 'You classified an ecological relationship as predation when it was actually mutualism, commensalism, or parasitism.',
    principle: 'Ecological relationships include several distinct types beyond predation: MUTUALISM (both species benefit), COMMENSALISM (one species benefits, the other is unaffected), and PARASITISM (one species benefits at the other\'s expense, without necessarily killing it immediately, unlike predation). Not every interaction between two species is predator-prey.',
    correctStep: 'A tick feeding on a buck\'s blood is parasitism (the tick benefits, the buck is harmed but not immediately killed) — this is different from a lion killing and eating the buck, which is predation.',
  },
  {
    id: 'energy-flow-treated-as-cyclical',
    label: 'Believing energy cycles through an ecosystem the same way matter does',
    errorType: 'You described energy as being recycled back to producers, the same way nutrients/matter are cycled by decomposers.',
    principle: 'ENERGY FLOWS in ONE DIRECTION through an ecosystem — from the sun, to producers, to consumers, with energy LOST as heat at each transfer (it cannot be recycled or reused). This is different from MATTER (nutrients), which IS cycled repeatedly through an ecosystem via decomposition.',
    correctStep: 'The energy a lion gains from eating an antelope is eventually lost as heat through the lion\'s life processes — it does not return to the grass for reuse, unlike nutrients, which decomposers do recycle back into the soil.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 3,
  topicId: 'ecosystems-and-ecological-relationships',
  topicName: 'Ecosystems and Ecological Relationships',
  prerequisites: [
    'The Biosphere and Biomes (this term, Topic 1)',
  ],
  objectives: [
    { id: 'classify-trophic-roles', text: 'Classify organisms as producers, consumers, or decomposers, and describe their roles.' },
    { id: 'distinguish-ecological-relationships', text: 'Distinguish predation, competition, mutualism, commensalism, and parasitism.' },
    { id: 'contrast-energy-flow-nutrient-cycling', text: 'Contrast the one-way flow of energy with the cycling of nutrients through an ecosystem.' },
  ],
  estimatedMinutes: [25, 35],
};

export const ecosystemsAndEcologicalRelationships: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Every living thing in an ecosystem is connected to others through feeding — but is it really a simple chain, or something far more tangled?',
  goalSettingPrompt:
    'Ecosystems function through networks of feeding relationships, diverse species interactions, and two very different processes: energy flow and nutrient cycling. By the end of this lesson you\'ll be able to classify organisms by trophic role, distinguish the major ecological relationships, and contrast energy flow with nutrient cycling.',

  activate: {
    connectPrompt: 'You already know an ecosystem includes both abiotic and biotic components (from Biosphere and Biomes) — this lesson looks at how the biotic components specifically interact and feed off one another.',
    diagnosticQuestions: [
      { question: 'Do decomposers destroy nutrients, or recycle them?', options: ['Recycle them, releasing them back into the ecosystem', 'Destroy them completely', 'Neither — decomposers have no effect on nutrients', 'Store them permanently'], correctIndex: 0, explanation: 'Decomposers release locked-up nutrients back into the ecosystem for reuse.' },
      { question: 'Are all interactions between two species examples of predation?', options: ['No — there are several distinct relationship types', 'Yes, all interactions are predation', 'No — only mutualism exists', 'Species never interact'], correctIndex: 0, explanation: 'Ecological relationships include mutualism, commensalism, parasitism, and competition, not just predation.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Organisms in an ecosystem occupy different TROPHIC (feeding) roles: PRODUCERS (e.g. plants) make their own food via photosynthesis, forming the base of the food chain. CONSUMERS eat other organisms (herbivores eat producers, carnivores eat other consumers, omnivores eat both). DECOMPOSERS (e.g. bacteria and fungi) break down dead organisms and waste, RECYCLING nutrients back into the ecosystem — they do not destroy matter, they release it for reuse. A FOOD CHAIN shows one simplified feeding sequence, but a FOOD WEB — many interconnected food chains — more realistically represents an ecosystem, since most organisms have multiple feeding connections.',
    workedExamples: [
      { id: 'wx-trophic-roles', prompt: 'Classify grass, a rabbit, a fox, and a soil bacterium by trophic role.', steps: [
        { step: 'Grass makes its own food via photosynthesis — it is a producer.', justification: 'Producers are organisms that photosynthesise to make their own food.' },
        { step: 'The rabbit eats grass (a producer) — it is a consumer (specifically a herbivore); the fox eats the rabbit (a consumer) — it is also a consumer (a carnivore).', justification: 'Consumers are classified by what they eat.' },
        { step: 'The soil bacterium breaks down dead organisms and waste — it is a decomposer.', justification: 'Decomposers break down dead organic matter, recycling nutrients.' },
      ], answer: 'Grass: producer; Rabbit: consumer (herbivore); Fox: consumer (carnivore); Bacterium: decomposer' },
      { id: 'wx-decomposer-recycling', prompt: 'Explain what happens to the nutrients in a dead animal after decomposers break it down.', steps: [
        { step: 'Decomposers break down the complex organic matter of the dead animal into simpler substances.', justification: 'Decomposition chemically breaks down complex matter.' },
        { step: 'These simpler nutrients are released back into the soil, where they become available for producers (like plants) to absorb and reuse.', justification: 'Decomposition recycles nutrients back into the ecosystem, rather than destroying them.' },
      ], answer: 'Nutrients are released into the soil and become available for producers to reuse' },
    ],
    knowledgeChecks: [
      { question: 'What do decomposers do to the nutrients in dead organic matter?', options: ['Release/recycle them back into the ecosystem', 'Destroy them permanently', 'Store them forever without release', 'Nothing — decomposers have no effect'], correctIndex: 0, explanation: 'Decomposers release nutrients for reuse, not destroy them.', misconceptionId: 'decomposers-destroy-matter' },
      { question: 'Is a real ecosystem more accurately shown by a single food chain, or a food web?', options: ['A food web, since most organisms have multiple feeding connections', 'A single food chain, since feeding is always linear', 'Neither represents real ecosystems', 'Food chains and food webs are identical concepts'], correctIndex: 0, explanation: 'Food webs capture the multiple interconnections real organisms have.', misconceptionId: 'food-chains-treated-as-only-model' },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying trophic roles and understanding food webs?',
  },

  demonstrateChunk2: {
    explanation:
      'Species interact through several distinct ECOLOGICAL RELATIONSHIPS: PREDATION (one organism kills and eats another), COMPETITION (organisms compete for the same limited resource, e.g. food or space), MUTUALISM (both species benefit, e.g. bees and flowers), COMMENSALISM (one species benefits, the other is unaffected), and PARASITISM (one species benefits at the other\'s expense, without necessarily killing it, e.g. a tick on an animal). ENERGY flows in ONE DIRECTION through an ecosystem — from the sun to producers to consumers, with energy lost as heat at each step — and CANNOT be recycled. In contrast, NUTRIENTS (matter) ARE cycled repeatedly through an ecosystem via decomposition, being reused again and again.',
    workedExamples: [
      { id: 'wx-relationship-types', prompt: 'Classify these interactions: (a) a tick feeding on a buck\'s blood, (b) bees pollinating flowers while collecting nectar.', steps: [
        { step: '(a) The tick benefits (gets blood) while the buck is harmed (loses blood, risk of disease) without being immediately killed — this is parasitism.', justification: 'Parasitism involves one organism benefiting at the other\'s expense, without necessarily killing it.' },
        { step: '(b) Both the bee (gets nectar/food) and the flower (gets pollinated, enabling reproduction) benefit — this is mutualism.', justification: 'Mutualism involves both species benefiting from the interaction.' },
      ], answer: '(a) Parasitism, (b) Mutualism' },
      { id: 'wx-energy-vs-nutrients', prompt: 'Explain the key difference between how energy and nutrients move through an ecosystem.', steps: [
        { step: 'Energy flows in ONE direction: sun → producers → consumers, with energy lost as heat at each transfer — it is never recycled back to an earlier stage.', justification: 'Energy is progressively lost as heat and cannot be reused once transferred.' },
        { step: 'Nutrients (matter), by contrast, ARE cycled: decomposers break down dead organisms and release nutrients back into the soil, where producers can reabsorb and reuse them repeatedly.', justification: 'Unlike energy, matter is conserved and recycled through decomposition.' },
      ], answer: 'Energy flows one-way and is lost as heat; nutrients are cycled and reused repeatedly' },
    ],
    knowledgeChecks: [
      { question: 'A tick feeds on a buck\'s blood without killing it immediately. What type of relationship is this?', options: ['Parasitism', 'Predation', 'Mutualism', 'Commensalism'], correctIndex: 0, explanation: 'The tick benefits while harming the buck without necessarily killing it — this is parasitism, distinct from predation.', misconceptionId: 'all-interactions-seen-as-predation' },
      { question: 'Does energy get recycled back to producers the same way nutrients are?', options: ['No — energy flows one way and is lost as heat', 'Yes, energy cycles exactly like nutrients', 'Energy and nutrients behave identically', 'Energy is never lost at any stage'], correctIndex: 0, explanation: 'Energy flow is one-directional, unlike the cycling of nutrients.', misconceptionId: 'energy-flow-treated-as-cyclical' },
    ],
    confidenceCheckPrompt: 'How confident do you feel distinguishing ecological relationships and contrasting energy flow with nutrient cycling?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'classify-trophic-roles', revealSteps: 1, prompt: 'A fungus grows on a fallen log, breaking it down. What trophic role does it play?', steps: [
        { step: 'The fungus breaks down dead organic matter (the fallen log), recycling its nutrients — this is a decomposer role.', justification: 'Breaking down dead matter and recycling nutrients defines a decomposer.' },
      ], answer: 'Decomposer' },
      { id: 'fp-partial-1', objectiveId: 'distinguish-ecological-relationships', revealSteps: 1, prompt: 'A bird builds its nest in a tree, gaining shelter, while the tree is unaffected. What relationship is this?', steps: [
        { step: 'The bird benefits from the nest site, while the tree experiences no meaningful benefit or harm.', justification: 'One species benefiting while the other is unaffected is the defining pattern of a specific relationship type.' },
        { step: 'This one-sided benefit with no effect on the other species is commensalism.', justification: 'Commensalism is defined by one species benefiting and the other being unaffected.' },
      ], answer: 'Commensalism' },
      { id: 'fp-independent-1', objectiveId: 'contrast-energy-flow-nutrient-cycling', revealSteps: 0, prompt: 'In one sentence, explain why nutrients can be reused by an ecosystem indefinitely, but energy cannot.', steps: [
        { step: 'Nutrients are recycled by decomposers back into a form producers can reuse, while energy is progressively lost as heat at each transfer and can never be recovered or reused.', justification: 'This distinction between conserved, recyclable matter and progressively lost, one-way energy explains the difference.' },
      ], answer: 'Nutrients are recycled by decomposers; energy is lost as heat and cannot be recovered' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'classify-trophic-roles', question: 'A lion eats a zebra, which had eaten grass. What trophic role does the lion play?', options: ['Consumer (carnivore)', 'Producer', 'Decomposer', 'None — lions have no trophic role'], correctIndex: 0, hints: { strategic: 'Think about what the lion eats.', procedural: 'The lion eats another consumer, making it a carnivorous consumer.', workedStep: 'Consumer (carnivore).' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'classify-trophic-roles', question: 'Why is a food web a more realistic model of an ecosystem than a single food chain?', options: ['Most organisms have multiple feeding connections', 'Food chains are always wrong', 'Food webs only apply to plants', 'There is no real difference'], correctIndex: 0, hints: { strategic: 'Think about how many things a typical animal eats and is eaten by.', procedural: 'Multiple connections mean a web, not a single chain, is realistic.', workedStep: 'Most organisms have multiple feeding connections.' }, distractorMisconceptions: { 1: 'food-chains-treated-as-only-model' } },
      { id: 'ip-3', objectiveId: 'distinguish-ecological-relationships', question: 'Two lion prides compete for the same limited territory and prey. What relationship is this?', options: ['Competition', 'Mutualism', 'Commensalism', 'Parasitism'], correctIndex: 0, hints: { strategic: 'Think about organisms competing for the same limited resource.', procedural: 'Competing for shared resources is competition.', workedStep: 'Competition.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'contrast-energy-flow-nutrient-cycling', question: 'Can energy that a herbivore loses as heat ever be reused by that same ecosystem\'s producers?', options: ['No — energy flow is one-directional and lost as heat', 'Yes, energy cycles back to producers', 'Only at night', 'Only in aquatic ecosystems'], correctIndex: 0, hints: { strategic: 'Think about the one-way nature of energy flow.', procedural: 'Energy lost as heat cannot be recovered or reused.', workedStep: 'No, energy flow is one-directional.' }, distractorMisconceptions: { 1: 'energy-flow-treated-as-cyclical' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'classify-trophic-roles', multiSelect: false, question: 'Which organism type makes its own food via photosynthesis?', options: ['Producer', 'Consumer', 'Decomposer', 'None of these'], correctIndices: [0], explanation: 'Producers make their own food through photosynthesis.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'classify-trophic-roles', multiSelect: false, question: 'True or false: decomposers destroy nutrients, removing them from the ecosystem permanently.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — decomposers recycle nutrients back into the ecosystem for reuse.', distractorMisconceptions: { 0: 'decomposers-destroy-matter' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'distinguish-ecological-relationships', multiSelect: false, question: 'Bees collect nectar from flowers while pollinating them, benefiting both species. What relationship is this?', options: ['Mutualism', 'Parasitism', 'Predation', 'Competition'], correctIndices: [0], explanation: 'Both species benefiting defines mutualism.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'distinguish-ecological-relationships', multiSelect: false, question: 'True or false: every interaction between two species is an example of predation.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — there are several distinct relationship types beyond predation.', distractorMisconceptions: { 0: 'all-interactions-seen-as-predation' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'distinguish-ecological-relationships', multiSelect: false, question: 'A tapeworm lives inside an animal\'s gut, absorbing nutrients and harming the host without killing it immediately. What relationship is this?', options: ['Parasitism', 'Mutualism', 'Commensalism', 'Predation'], correctIndices: [0], explanation: 'One species benefiting at the other\'s expense, without immediate death, is parasitism.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'contrast-energy-flow-nutrient-cycling', multiSelect: false, question: 'How does energy move through an ecosystem?', options: ['In one direction, lost as heat at each transfer', 'It cycles repeatedly, like nutrients', 'It never leaves producers', 'It moves randomly with no pattern'], correctIndices: [0], explanation: 'Energy flows one-way through an ecosystem, progressively lost as heat.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'contrast-energy-flow-nutrient-cycling', multiSelect: false, question: 'True or false: nutrients, unlike energy, are recycled repeatedly through an ecosystem via decomposition.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — nutrients are cycled, unlike energy which flows one-way and is lost.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'distinguish-ecological-relationships', multiSelect: true, question: 'Which of these are examples of distinct ecological relationships? (select all that apply)', options: ['Mutualism', 'Commensalism', 'Photosynthesis', 'Parasitism'], correctIndices: [0, 1, 3], explanation: 'Mutualism, commensalism, and parasitism are ecological relationships; photosynthesis is a biochemical process, not a relationship type.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'distinguish-ecological-relationships',
      analogy: 'Think of ecological relationships like different types of transactions between two neighbours: mutualism is a fair trade (both benefit), commensalism is one neighbour borrowing your ladder without you noticing or caring (one benefits, other unaffected), parasitism is a neighbour secretly siphoning your electricity (one benefits, other is harmed but not destroyed), and predation is one neighbour actually taking the other\'s house entirely (one consumes the other).',
      explanation: 'To classify a relationship: (1) does one organism kill and eat the other? → predation. (2) do both organisms benefit? → mutualism. (3) does one benefit while the other is unaffected? → commensalism. (4) does one benefit while harming (but not immediately killing) the other? → parasitism. (5) are they both competing for the same limited resource? → competition.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Oxpecker birds sit on a rhino, eating ticks and parasites off its skin, benefiting both the bird (food) and the rhino (fewer parasites). What relationship is this?', steps: [
          { step: 'Check if both organisms benefit: the bird gets food, and the rhino benefits from having parasites removed.', justification: 'Identifying benefit/harm for both species is the first step in classifying the relationship.' },
          { step: 'Since both species benefit, this is mutualism.', justification: 'Mutualism is defined by mutual benefit to both species involved.' },
        ], answer: 'Mutualism' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'distinguish-ecological-relationships', question: 'A cheetah chases down and eats a gazelle. What relationship is this?', options: ['Predation', 'Mutualism', 'Commensalism', 'Parasitism'], correctIndex: 0, hints: { strategic: 'One organism kills and eats the other.', procedural: 'This defines predation.', workedStep: 'Predation.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'distinguish-ecological-relationships', question: 'Two species of birds both need the same nesting holes in a limited number of trees. What relationship is this?', options: ['Competition', 'Mutualism', 'Parasitism', 'Predation'], correctIndex: 0, hints: { strategic: 'Both need the same limited resource.', procedural: 'This defines competition.', workedStep: 'Competition.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'distinguish-ecological-relationships', question: 'A small fish swims alongside a shark, feeding on scraps of food the shark leaves behind, without affecting the shark at all. What relationship is this?', options: ['Commensalism', 'Mutualism', 'Parasitism', 'Predation'], correctIndex: 0, hints: { strategic: 'One benefits, the other is unaffected.', procedural: 'This defines commensalism.', workedStep: 'Commensalism.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is it inaccurate to say energy "cycles" through an ecosystem the same way nutrients do?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel distinguishing ecological relationships and trophic roles now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Which of these correctly describes decomposers\' role in an ecosystem?', type: 'multiple-choice', options: ['They recycle nutrients from dead matter back into the ecosystem', 'They destroy nutrients permanently', 'They only affect energy, not matter', 'They have no significant ecological role'] },
  ],
};
