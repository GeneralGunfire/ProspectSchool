// ── Life Sciences, Term 3, Topic 3: Human Impact on the Environment ──────────
// Closes the "Environmental Studies" strand for Grade 10. Builds on Ecosystems
// and Ecological Relationships (this term). Introductory Grade 10 scope: types
// of environmental problems, global issues (intro level), and conservation.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'pollution-only-litter',
    label: 'Believing pollution only means visible litter',
    errorType: 'You described pollution purely in terms of visible litter or rubbish, ignoring chemical, air, and water pollution.',
    principle: 'Pollution includes far more than visible litter: AIR pollution (e.g. vehicle emissions, industrial smoke), WATER pollution (e.g. chemical runoff, sewage), and SOIL pollution (e.g. pesticide residue, heavy metals) are all major forms — many of which are invisible but still cause serious environmental and health harm.',
    correctStep: 'A factory releasing invisible chemical fumes into the air, or fertiliser runoff contaminating a river, are both forms of pollution — even though nothing "looks like litter".',
  },
  {
    id: 'global-warming-just-weather',
    label: 'Confusing global warming with day-to-day weather changes',
    errorType: 'You described global warming as simply "the weather getting hotter" on any given day, rather than a long-term climate pattern.',
    principle: 'GLOBAL WARMING refers to a LONG-TERM rise in Earth\'s average temperature over decades, driven by increased greenhouse gases — it is distinct from short-term WEATHER, which varies day to day and season to season. A single cold day does not disprove global warming, because the trend is about long-term climate averages, not daily weather.',
    correctStep: 'A record cold winter in one region does not contradict global warming, since global warming is about the long-term rise in AVERAGE global temperature, not any single day\'s weather.',
  },
  {
    id: 'conservation-means-excluding-humans',
    label: 'Believing conservation always means completely excluding human activity',
    errorType: 'You described conservation purely as "keeping humans out" of an area, without considering sustainable use.',
    principle: 'CONSERVATION includes both protection (e.g. strict nature reserves) AND SUSTAINABLE USE — managing resources so they can be used by humans now without being depleted for future generations. Conservation is not always about total exclusion of people; it often involves careful, balanced management.',
    correctStep: 'Sustainable fishing quotas allow controlled fishing to continue indefinitely, rather than banning fishing entirely — this is conservation through sustainable use, not exclusion.',
  },
  {
    id: 'individual-action-extremes',
    label: 'Assuming individual action either does nothing or solves everything',
    errorType: 'You described individual environmental actions (like recycling) as either completely pointless, or as a complete solution on their own.',
    principle: 'Individual actions (like recycling, reducing water use) DO contribute meaningfully to reducing environmental impact when adopted widely, but they are NOT a complete solution on their own — addressing large-scale issues like pollution and climate change also requires policy change, industry action, and collective effort at scale.',
    correctStep: 'Recycling reduces waste sent to landfills and conserves resources, but it alone cannot solve issues like large-scale industrial pollution — both individual and systemic action are needed together.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 3,
  topicId: 'human-impact-on-the-environment',
  topicName: 'Human Impact on the Environment',
  prerequisites: [
    'Ecosystems and Ecological Relationships (this term, Topic 2)',
  ],
  objectives: [
    { id: 'identify-types-of-environmental-problems', text: 'Identify types of environmental problems: pollution, habitat destruction, over-exploitation, and invasive species.' },
    { id: 'explain-global-warming-basics', text: 'Explain, at an introductory level, what global warming is and how it differs from day-to-day weather.' },
    { id: 'describe-conservation-principles', text: 'Describe conservation and sustainable use, including the role of protected areas.' },
  ],
  estimatedMinutes: [25, 35],
};

export const humanImpactOnTheEnvironment: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'A river can look perfectly clean and still be poisoned. What kinds of environmental damage are easy to miss?',
  goalSettingPrompt:
    'Human activity affects ecosystems in ways ranging from obvious litter to invisible chemical pollution and long-term climate shifts — and addressing these problems requires more than good intentions alone. By the end of this lesson you\'ll be able to identify types of environmental problems, explain global warming at a basic level, and describe conservation principles.',

  activate: {
    connectPrompt: 'You already know how ecosystems function through feeding relationships and nutrient cycling (from Ecosystems and Ecological Relationships) — this lesson looks at how human activity disrupts these systems.',
    diagnosticQuestions: [
      { question: 'Is pollution limited to visible litter?', options: ['No — it includes invisible air, water, and soil pollution too', 'Yes, pollution is only litter', 'No, pollution only affects water', 'Pollution does not include chemicals'], correctIndex: 0, explanation: 'Pollution includes many invisible forms, not just visible litter.' },
      { question: 'Does global warming refer to short-term weather or long-term climate trends?', options: ['Long-term climate trends over decades', 'A single hot day', 'Only summer temperatures', 'Weather patterns in one specific city'], correctIndex: 0, explanation: 'Global warming is about long-term average temperature trends, not daily weather.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Human activity causes several types of environmental problems: POLLUTION (contamination of air, water, or soil — including invisible chemical pollutants, not just visible litter), HABITAT DESTRUCTION (e.g. deforestation, converting natural land to farmland or urban areas), OVER-EXPLOITATION of resources (e.g. overfishing, overgrazing — using a resource faster than it can naturally replenish), and INVASIVE ALIEN SPECIES (non-native species introduced to an area, which can outcompete and harm native species that have no natural defences against them).',
    workedExamples: [
      { id: 'wx-pollution-types', prompt: 'Give an example of air pollution and an example of water pollution, and explain why neither necessarily "looks like litter".', steps: [
        { step: 'Air pollution example: vehicle exhaust releasing invisible gases like carbon monoxide into the atmosphere.', justification: 'Many air pollutants are gases, invisible to the naked eye, unlike litter.' },
        { step: 'Water pollution example: fertiliser runoff from farms entering a river, causing excess algae growth — the water may look clear at first but contains harmful chemical concentrations.', justification: 'Chemical pollution in water is often not visually obvious, unlike litter.' },
      ], answer: 'Air: vehicle exhaust gases. Water: fertiliser runoff — neither is visible litter, yet both are pollution' },
      { id: 'wx-over-exploitation', prompt: 'Explain, using overfishing as an example, what "over-exploitation" of a resource means.', steps: [
        { step: 'Overfishing means catching fish faster than fish populations can naturally reproduce and replenish.', justification: 'Over-exploitation is defined by resource use exceeding its natural rate of renewal.' },
        { step: 'Over time, this depletes fish populations, potentially collapsing the fishery entirely if it continues unchecked.', justification: 'Continued over-exploitation can permanently damage a resource\'s ability to recover.' },
      ], answer: 'Overfishing removes fish faster than populations can replenish, risking population collapse' },
    ],
    knowledgeChecks: [
      { question: 'Is chemical runoff into a river, with no visible litter present, still a form of pollution?', options: ['Yes — it is water pollution, even without visible litter', 'No — only visible litter counts as pollution', 'No, chemicals are not pollutants', 'Only if the water changes colour'], correctIndex: 0, explanation: 'Chemical pollution is a major form of water pollution, regardless of visibility.', misconceptionId: 'pollution-only-litter' },
      { question: 'What defines "over-exploitation" of a resource?', options: ['Using it faster than it can naturally replenish', 'Using any amount of a resource at all', 'Only applies to fossil fuels', 'Using a resource sustainably'], correctIndex: 0, explanation: 'Over-exploitation means depleting a resource faster than its natural renewal rate.' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying different types of environmental problems?',
  },

  demonstrateChunk2: {
    explanation:
      'GLOBAL WARMING refers to a LONG-TERM rise in Earth\'s average temperature over decades, caused mainly by increased greenhouse gases from human activity — it is distinct from day-to-day WEATHER, which naturally fluctuates. This contributes to broader CLIMATE CHANGE and loss of biodiversity. CONSERVATION involves both protecting environments (e.g. national parks, nature reserves) and SUSTAINABLE USE — managing resources carefully so they remain available for the future rather than being depleted. Individual actions (like recycling) contribute meaningfully but are not a complete solution alone — addressing large-scale issues also requires policy, industry change, and collective effort.',
    workedExamples: [
      { id: 'wx-global-warming-vs-weather', prompt: 'Explain why a single unusually cold winter does not disprove global warming.', steps: [
        { step: 'Global warming refers to a long-term trend in AVERAGE global temperature over decades, not any single day or season\'s weather.', justification: 'The distinction between long-term climate trend and short-term weather is central to understanding global warming.' },
        { step: 'A single cold winter is a short-term weather event and does not reflect the decades-long global average trend, which is what global warming describes.', justification: 'One unusual weather event cannot disprove a long-term statistical trend.' },
      ], answer: 'Global warming describes long-term average trends, not any single weather event' },
      { id: 'wx-conservation-sustainable-use', prompt: 'Explain how a sustainable fishing quota is an example of conservation without fully excluding human use.', steps: [
        { step: 'A sustainable fishing quota limits how many fish can be caught, based on how quickly the fish population can naturally replenish.', justification: 'Sustainable use means setting limits based on the resource\'s natural renewal rate.' },
        { step: 'This allows fishing to continue indefinitely (benefiting people) while preventing the fish population from collapsing — this is conservation through management, not total exclusion of humans.', justification: 'Conservation can balance human use and resource protection, rather than requiring total exclusion.' },
      ], answer: 'It limits catches to the population\'s natural replenishment rate, allowing ongoing use without depletion' },
    ],
    knowledgeChecks: [
      { question: 'Does global warming refer to a single hot day, or a long-term average temperature trend?', options: ['A long-term average temperature trend over decades', 'A single hot day', 'Only summer weather', 'It has no defined timescale'], correctIndex: 0, explanation: 'Global warming is specifically about long-term average temperature trends.', misconceptionId: 'global-warming-just-weather' },
      { question: 'Does conservation always require completely excluding human activity from an area?', options: ['No — it can involve sustainable use alongside protection', 'Yes, always', 'Conservation has nothing to do with human activity', 'Only strict nature reserves count as conservation'], correctIndex: 0, explanation: 'Conservation includes sustainable use, not only strict exclusion.', misconceptionId: 'conservation-means-excluding-humans' },
    ],
    confidenceCheckPrompt: 'How confident do you feel explaining global warming basics and conservation principles?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'identify-types-of-environmental-problems', revealSteps: 1, prompt: 'A non-native plant species is introduced to a wetland and rapidly outcompetes native plants, since local herbivores don\'t eat it. What type of environmental problem is this?', steps: [
        { step: 'A non-native species outcompeting native species, with no natural predators/consumers to control it, is the defining pattern of an invasive alien species problem.', justification: 'This scenario matches the definition of invasive alien species harming a native ecosystem.' },
      ], answer: 'Invasive alien species' },
      { id: 'fp-partial-1', objectiveId: 'explain-global-warming-basics', revealSteps: 1, prompt: 'Explain why increased greenhouse gases lead to global warming, in simple terms.', steps: [
        { step: 'Greenhouse gases trap heat from the sun in Earth\'s atmosphere, rather than letting it escape back into space.', justification: 'Greenhouse gases work by trapping heat, similar to a greenhouse retaining warmth.' },
        { step: 'As greenhouse gas levels increase (from human activity), more heat is trapped, gradually raising Earth\'s average temperature over time — this is global warming.', justification: 'Increased trapped heat over decades causes the long-term average temperature rise.' },
      ], answer: 'Increased greenhouse gases trap more heat, gradually raising Earth\'s average temperature' },
      { id: 'fp-independent-1', objectiveId: 'describe-conservation-principles', revealSteps: 0, prompt: 'In one sentence, explain what "sustainable use" of a resource means.', steps: [
        { step: 'Sustainable use means using a resource at a rate that allows it to naturally replenish, so it remains available for future use.', justification: 'Sustainable use balances present use with the resource\'s long-term availability.' },
      ], answer: 'Using a resource at a rate that allows it to naturally replenish for future use' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'identify-types-of-environmental-problems', question: 'A factory releases invisible chemical gases into the air with no visible litter present. Is this pollution?', options: ['Yes — invisible chemical gases are still air pollution', 'No — pollution requires visible litter', 'No — only water can be polluted', 'Yes, but only if it smells bad'], correctIndex: 0, hints: { strategic: 'Think about whether pollution requires visibility.', procedural: 'Invisible chemical gases still count as pollution.', workedStep: 'Yes, invisible chemical gases are still air pollution.' }, distractorMisconceptions: { 1: 'pollution-only-litter' } },
      { id: 'ip-2', objectiveId: 'identify-types-of-environmental-problems', question: 'Converting a forest into farmland removes the natural habitat of many species. What type of environmental problem is this?', options: ['Habitat destruction', 'Invasive species', 'Global warming', 'Sustainable use'], correctIndex: 0, hints: { strategic: 'Think about what happens to the natural forest habitat.', procedural: 'Removing natural habitat for farmland is habitat destruction.', workedStep: 'Habitat destruction.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'explain-global-warming-basics', question: 'A region experiences a record cold winter. Does this disprove global warming?', options: ['No — global warming is about long-term average trends, not single events', 'Yes, this proves global warming is false', 'Yes, but only in that specific region', 'Cold winters are impossible if global warming is real'], correctIndex: 0, hints: { strategic: 'Think about the difference between weather and climate trends.', procedural: 'A single event does not reflect a decades-long average trend.', workedStep: 'No, it does not disprove global warming.' }, distractorMisconceptions: { 1: 'global-warming-just-weather' } },
      { id: 'ip-4', objectiveId: 'describe-conservation-principles', question: 'Does conservation always mean banning all human use of an area?', options: ['No — sustainable use is also a form of conservation', 'Yes, always', 'Conservation is unrelated to resource use', 'Only zoos count as conservation'], correctIndex: 0, hints: { strategic: 'Think about managed, sustainable resource use.', procedural: 'Sustainable use allows ongoing human benefit while protecting the resource.', workedStep: 'No, sustainable use is also conservation.' }, distractorMisconceptions: { 1: 'conservation-means-excluding-humans' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'identify-types-of-environmental-problems', multiSelect: false, question: 'Which of these is an example of water pollution?', options: ['Chemical runoff from farms entering a river', 'A native fish species living in a river', 'A dry riverbed', 'A healthy wetland ecosystem'], correctIndices: [0], explanation: 'Chemical runoff contaminating water is a clear example of water pollution.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'identify-types-of-environmental-problems', multiSelect: false, question: 'True or false: pollution can only exist in the form of visible litter.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — pollution includes many invisible forms like chemical, air, and water contamination.', distractorMisconceptions: { 0: 'pollution-only-litter' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'identify-types-of-environmental-problems', multiSelect: false, question: 'A non-native fish species is introduced to a lake and outcompetes native fish. What type of problem is this?', options: ['Invasive alien species', 'Water pollution', 'Global warming', 'Sustainable use'], correctIndices: [0], explanation: 'A non-native species harming a native ecosystem is an invasive species problem.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'explain-global-warming-basics', multiSelect: false, question: 'True or false: global warming refers to the temperature on any single hot day.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — global warming refers to a long-term average temperature trend, not a single day.', distractorMisconceptions: { 0: 'global-warming-just-weather' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'explain-global-warming-basics', multiSelect: false, question: 'What primarily drives global warming?', options: ['Increased greenhouse gases trapping heat in the atmosphere', 'Seasonal weather changes', 'Ocean tides', 'Decreasing sunlight'], correctIndices: [0], explanation: 'Increased greenhouse gases are the main driver of global warming.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'describe-conservation-principles', multiSelect: false, question: 'True or false: conservation always requires excluding all human activity from an area.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — sustainable use is also a valid conservation approach.', distractorMisconceptions: { 0: 'conservation-means-excluding-humans' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'describe-conservation-principles', multiSelect: false, question: 'What is the purpose of a protected area like a national park?', options: ['To conserve ecosystems and biodiversity', 'To maximise resource extraction', 'To eliminate all wildlife', 'To promote pollution'], correctIndices: [0], explanation: 'Protected areas exist to conserve ecosystems and biodiversity.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-types-of-environmental-problems', multiSelect: true, question: 'Which of these are recognised types of environmental problems? (select all that apply)', options: ['Pollution', 'Habitat destruction', 'Sustainable use', 'Over-exploitation of resources'], correctIndices: [0, 1, 3], explanation: 'Pollution, habitat destruction, and over-exploitation are problems; sustainable use is a solution, not a problem.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'describe-conservation-principles',
      analogy: 'Think of conservation like managing a shared savings account rather than a locked vault: a locked vault (strict protection, no access) keeps money completely safe but useless to anyone; sustainable use is more like a savings account where you only withdraw the interest earned, never touching the principal — allowing ongoing benefit while keeping the resource intact for the future.',
      explanation: 'To identify a conservation approach: (1) check if it involves strict protection with no human use (e.g. a strict nature reserve), (2) check if it involves managed, limited use that allows the resource to replenish (sustainable use, e.g. fishing quotas, controlled logging) — both are valid conservation strategies, not just the first.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A community is allowed to harvest a set, limited number of a plant species each year, based on how quickly the population regrows. Is this conservation?', steps: [
          { step: 'Check whether this allows the resource to persist over time: since harvesting is limited to the regrowth rate, the population is not being depleted.', justification: 'Sustainable harvesting rates that match regrowth rates preserve the resource long-term.' },
          { step: 'Yes, this is conservation — specifically sustainable use, since it balances human benefit with long-term resource protection.', justification: 'Conservation includes sustainable use, not only strict exclusion of humans.' },
        ], answer: 'Yes — this is conservation through sustainable use' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'describe-conservation-principles', question: 'A strict nature reserve bans all resource extraction to fully protect an ecosystem. Is this a valid conservation approach?', options: ['Yes — strict protection is one valid conservation approach', 'No — conservation must always allow human use', 'No — this is not conservation at all', 'Only if animals are removed too'], correctIndex: 0, hints: { strategic: 'Think about whether strict protection counts as conservation.', procedural: 'Strict protection is a form of conservation, alongside sustainable use.', workedStep: 'Yes, strict protection is a valid conservation approach.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'describe-conservation-principles', question: 'A logging company harvests only as many trees per year as can naturally regrow, maintaining forest cover indefinitely. What conservation approach is this?', options: ['Sustainable use', 'Total exclusion', 'Habitat destruction', 'Pollution control'], correctIndex: 0, hints: { strategic: 'Think about matching use to the natural regrowth rate.', procedural: 'This is a classic sustainable use example.', workedStep: 'Sustainable use.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'describe-conservation-principles', question: 'Is banning all fishing in a lake the ONLY way to conserve its fish population?', options: ['No — sustainable fishing quotas can also conserve the population', 'Yes, banning is the only option', 'Fish populations cannot be conserved', 'Conservation does not apply to fish'], correctIndex: 0, hints: { strategic: 'Think about alternatives to a total ban.', procedural: 'Quotas based on replenishment rate also conserve the resource.', workedStep: 'No, sustainable fishing quotas can also conserve the population.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is it inaccurate to say a single cold winter disproves global warming?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel identifying environmental problems and describing conservation principles now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Which of these best describes "sustainable use" of a resource?', type: 'multiple-choice', options: ['Using it at a rate that allows it to naturally replenish', 'Using as much of it as possible immediately', 'Banning all use of it', 'Ignoring how quickly it replenishes'] },
  ],
};
