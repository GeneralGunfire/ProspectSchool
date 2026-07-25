// ── Life Sciences, Term 3, Topic 1: The Biosphere and Biomes ─────────────────
// Opens the "Environmental Studies" strand. Introductory Grade 10 scope: levels
// of biological organisation, abiotic vs biotic components, and South Africa's
// major biomes.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'ecosystem-biome-conflated',
    label: 'Treating "ecosystem" and "biome" as the same scale',
    errorType: 'You used "ecosystem" and "biome" interchangeably, without recognising their difference in scale.',
    principle: 'An ECOSYSTEM is a specific, relatively local community of organisms interacting with their environment (e.g. one pond, one patch of forest). A BIOME is a much LARGER-SCALE region defined by its overall climate and dominant vegetation type (e.g. the savanna biome spans huge areas and contains many individual ecosystems within it).',
    correctStep: 'A single waterhole and the organisms around it is one ecosystem; the entire savanna biome contains thousands of such ecosystems (waterholes, grassland patches, woodlands) across a vast region.',
  },
  {
    id: 'south-africa-only-savanna',
    label: 'Assuming South Africa consists only of savanna',
    errorType: 'You described South Africa\'s environment as uniformly savanna, ignoring its other biomes.',
    principle: 'South Africa contains MULTIPLE distinct biomes, not just savanna — including grassland, forest, fynbos, Nama-Karoo, Succulent Karoo, and desert, each with different rainfall, temperature, and vegetation patterns.',
    correctStep: 'The Western Cape\'s fynbos biome (unique shrubland vegetation, winter rainfall) is completely different from the savanna biome found in parts of Limpopo or Mpumalanga (grassland with scattered trees, summer rainfall).',
  },
  {
    id: 'abiotic-factors-seen-as-background',
    label: 'Treating abiotic factors as passive background rather than key drivers',
    errorType: 'You described climate, rainfall, or soil type as unimportant "scenery" rather than as factors that actively determine which organisms can live in an area.',
    principle: 'ABIOTIC factors (non-living: climate, rainfall, temperature, soil type) are ACTIVE DRIVERS that determine which biome forms in an area and which organisms can survive there — they are not passive background, but a primary cause of biome distribution.',
    correctStep: 'Low, unpredictable rainfall and extreme temperatures directly cause the Nama-Karoo\'s sparse, drought-adapted vegetation — the abiotic conditions actively shape what can grow there, not the other way around.',
  },
  {
    id: 'biomes-seen-as-static',
    label: 'Believing biomes are fixed and never change over time',
    errorType: 'You described a biome as permanently unchanging, ignoring that biomes can shift due to climate change or human activity.',
    principle: 'Biomes are not permanently fixed — their boundaries and characteristics can shift over long timescales due to CLIMATE CHANGE (e.g. shifting rainfall patterns) or HUMAN ACTIVITY (e.g. converting grassland to farmland, or desertification from overgrazing).',
    correctStep: 'Overgrazing in parts of the Karoo can push vegetation patterns toward desert-like conditions over time — showing biome characteristics are not permanently fixed.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 3,
  topicId: 'biosphere-and-biomes',
  topicName: 'The Biosphere and Biomes',
  prerequisites: [
    'Support and Transport Systems in Animals (Term 2)',
  ],
  objectives: [
    { id: 'order-levels-of-organisation', text: 'Order the levels of biological organisation from organism to biosphere.' },
    { id: 'distinguish-abiotic-biotic', text: 'Distinguish abiotic from biotic components of an environment.' },
    { id: 'characterise-south-african-biomes', text: 'Characterise South Africa\'s major biomes by climate, vegetation, and human threats.' },
  ],
  estimatedMinutes: [25, 35],
};

export const biosphereAndBiomes: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'A desert and a forest can sit just a few hundred kilometres apart in South Africa. What actually decides which one forms where?',
  goalSettingPrompt:
    'Life on Earth is organised at scales from a single organism up to the entire biosphere, and climate is the main force that sorts life into distinct biomes. By the end of this lesson you\'ll be able to order the levels of organisation, distinguish abiotic from biotic factors, and characterise South Africa\'s major biomes.',

  activate: {
    connectPrompt: 'You already know organisms interact with their environment (from earlier topics on transport and support) — this lesson zooms out to look at environments at a much larger scale.',
    diagnosticQuestions: [
      { question: 'Is a biome larger or smaller in scale than a single ecosystem?', options: ['Larger — a biome contains many ecosystems', 'Smaller', 'They are the same size', 'Neither has a defined scale'], correctIndex: 0, explanation: 'A biome is a large-scale region containing many individual ecosystems.' },
      { question: 'Does South Africa have more than one biome?', options: ['Yes, several distinct biomes', 'No, only savanna', 'No, only desert', 'Only one biome exists anywhere'], correctIndex: 0, explanation: 'South Africa contains several distinct biomes, including savanna, fynbos, grassland, and more.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Biology is organised in increasing LEVELS: ORGANISM (one individual) → POPULATION (organisms of the same species in one area) → COMMUNITY (all populations of different species in one area) → ECOSYSTEM (a community plus its physical environment) → BIOME (a very large region defined by climate and dominant vegetation, containing many ecosystems) → BIOSPHERE (all of Earth\'s ecosystems combined). Every environment has ABIOTIC components (non-living: climate, rainfall, temperature, soil, sunlight) and BIOTIC components (living: plants, animals, microorganisms) — abiotic factors actively determine which organisms can survive in a given area.',
    workedExamples: [
      { id: 'wx-levels-of-organisation', prompt: 'Order these correctly from smallest to largest: ecosystem, organism, biome, population.', steps: [
        { step: 'Start with the smallest unit: a single organism (e.g. one zebra).', justification: 'Organism is the base unit of biological organisation.' },
        { step: 'Next is population (all zebras in one area), then ecosystem (the zebras plus their physical environment and other species), then biome (the large region containing many such ecosystems).', justification: 'Each level nests within and is larger than the one before it.' },
      ], answer: 'Organism → population → ecosystem → biome' },
      { id: 'wx-abiotic-vs-biotic', prompt: 'Classify these as abiotic or biotic: rainfall, a herd of antelope, soil type, a species of grass.', steps: [
        { step: 'Rainfall and soil type are non-living physical factors — abiotic.', justification: 'Abiotic factors are the non-living components of an environment.' },
        { step: 'The herd of antelope and the grass species are living organisms — biotic.', justification: 'Biotic factors are the living components of an environment.' },
      ], answer: 'Abiotic: rainfall, soil type. Biotic: herd of antelope, grass species' },
    ],
    knowledgeChecks: [
      { question: 'Which is larger in scale: an ecosystem or a biome?', options: ['A biome, which contains many ecosystems', 'An ecosystem, which contains many biomes', 'They are exactly the same scale', 'Neither has a defined scale'], correctIndex: 0, explanation: 'A biome is a much larger-scale region than a single ecosystem.', misconceptionId: 'ecosystem-biome-conflated' },
      { question: 'Is soil type an abiotic or biotic factor?', options: ['Abiotic', 'Biotic', 'Neither', 'Both equally'], correctIndex: 0, explanation: 'Soil type is a non-living physical factor, so it is abiotic.' },
    ],
    confidenceCheckPrompt: 'How confident do you feel ordering levels of organisation and distinguishing abiotic from biotic factors?',
  },

  demonstrateChunk2: {
    explanation:
      'A BIOME is defined by its characteristic CLIMATE (rainfall and temperature patterns) and DOMINANT VEGETATION type. South Africa contains several major biomes: SAVANNA (summer rainfall, grassland with scattered trees), GRASSLAND (cold winters, grass-dominated, few trees), FOREST (highest rainfall, dense tree cover), FYNBOS (winter rainfall, unique shrubland, found mainly in the Western Cape), NAMA-KAROO (low, unpredictable rainfall, sparse shrubs), SUCCULENT KAROO (winter rainfall, extremely high plant diversity of succulents), and DESERT (very low rainfall, sparse vegetation). Biomes are NOT permanently fixed — climate change and human activity (agriculture, urbanisation, overgrazing) can shift or degrade them over time.',
    workedExamples: [
      { id: 'wx-biome-characteristics', prompt: 'Compare the fynbos biome and the savanna biome in terms of rainfall pattern and vegetation.', steps: [
        { step: 'Fynbos occurs mainly in the Western Cape, with WINTER rainfall, and is dominated by unique shrubland vegetation.', justification: 'Fynbos is defined by its distinct winter-rainfall climate and shrubland vegetation type.' },
        { step: 'Savanna occurs in warmer regions with SUMMER rainfall, dominated by grassland with scattered trees.', justification: 'Savanna is defined by summer rainfall and its characteristic grassland-with-trees structure.' },
      ], answer: 'Fynbos: winter rainfall, shrubland. Savanna: summer rainfall, grassland with scattered trees' },
      { id: 'wx-biome-threats', prompt: 'Explain how overgrazing could shift the Nama-Karoo biome toward desert-like conditions over time.', steps: [
        { step: 'Overgrazing removes protective plant cover faster than it can regrow, exposing soil to erosion.', justification: 'Excess grazing pressure strips vegetation beyond its natural recovery rate.' },
        { step: 'Over time, this can degrade the sparse Nama-Karoo vegetation further, pushing conditions toward the even sparser vegetation typical of true desert.', justification: 'This shows biomes are not static — human activity can shift their characteristics.' },
      ], answer: 'Overgrazing removes vegetation faster than recovery, potentially shifting conditions toward desert' },
    ],
    knowledgeChecks: [
      { question: 'Does South Africa contain more biomes than just savanna?', options: ['Yes — including fynbos, grassland, forest, and more', 'No, only savanna exists in South Africa', 'No, only desert exists', 'South Africa has no defined biomes'], correctIndex: 0, explanation: 'South Africa contains multiple distinct biomes with different climates and vegetation.', misconceptionId: 'south-africa-only-savanna' },
      { question: 'Can human activity change a biome\'s characteristics over time?', options: ['Yes, e.g. overgrazing can shift vegetation patterns', 'No, biomes are permanently fixed', 'Only natural events can change biomes', 'Biomes cannot be affected at all'], correctIndex: 0, explanation: 'Biomes can shift due to both climate change and human activity.', misconceptionId: 'biomes-seen-as-static' },
    ],
    confidenceCheckPrompt: 'How confident do you feel characterising South Africa\'s biomes and explaining what threatens them?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'order-levels-of-organisation', revealSteps: 1, prompt: 'Order these from smallest to largest: community, organism, biosphere, ecosystem.', steps: [
        { step: 'Organism → community (all species populations in an area) → ecosystem (community plus physical environment) → biosphere (all of Earth\'s ecosystems).', justification: 'Each level of organisation nests within and is larger than the previous one.' },
      ], answer: 'Organism → community → ecosystem → biosphere' },
      { id: 'fp-partial-1', objectiveId: 'distinguish-abiotic-biotic', revealSteps: 1, prompt: 'Classify these as abiotic or biotic: temperature, a population of baboons, sunlight intensity.', steps: [
        { step: 'Temperature and sunlight intensity are non-living physical factors — abiotic.', justification: 'Physical/climatic factors are always abiotic.' },
        { step: 'The population of baboons is living — biotic.', justification: 'Any living organism or population is biotic.' },
      ], answer: 'Abiotic: temperature, sunlight intensity. Biotic: population of baboons' },
      { id: 'fp-independent-1', objectiveId: 'characterise-south-african-biomes', revealSteps: 0, prompt: 'Name one biome found mainly in the Western Cape, and its defining rainfall pattern.', steps: [
        { step: 'Fynbos is the biome found mainly in the Western Cape, characterised by winter rainfall.', justification: 'Fynbos is uniquely associated with the winter-rainfall region of the Western Cape.' },
      ], answer: 'Fynbos; winter rainfall' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'order-levels-of-organisation', question: 'Which of these correctly places three levels in order from smallest to largest?', options: ['Organism, population, ecosystem', 'Ecosystem, organism, population', 'Population, ecosystem, organism', 'Biome, organism, ecosystem'], correctIndex: 0, hints: { strategic: 'Start with a single individual and build up.', procedural: 'Organism is smallest, then population, then ecosystem.', workedStep: 'Organism, population, ecosystem.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'distinguish-abiotic-biotic', question: 'Which of these is a biotic factor?', options: ['A population of grass', 'Rainfall amount', 'Soil pH', 'Average temperature'], correctIndex: 0, hints: { strategic: 'Think about which option is living.', procedural: 'A population of grass is living, so it is biotic.', workedStep: 'A population of grass.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'characterise-south-african-biomes', question: 'Which biome is characterised by summer rainfall and grassland with scattered trees?', options: ['Savanna', 'Fynbos', 'Succulent Karoo', 'Forest'], correctIndex: 0, hints: { strategic: 'Think about the biome with scattered trees in grassland.', procedural: 'Savanna matches this description.', workedStep: 'Savanna.' }, distractorMisconceptions: { 1: 'south-africa-only-savanna' } },
      { id: 'ip-4', objectiveId: 'characterise-south-african-biomes', question: 'Is a biome\'s vegetation pattern something that can never change, regardless of human activity?', options: ['False — human activity like overgrazing can shift a biome\'s characteristics', 'True — biomes are permanently fixed', 'True — only climate can ever change a biome', 'False — but only natural disasters can change a biome'], correctIndex: 0, hints: { strategic: 'Think about how overgrazing affects vegetation over time.', procedural: 'Human activity is one of the drivers of biome change.', workedStep: 'False — human activity can shift a biome\'s characteristics.' }, distractorMisconceptions: { 1: 'biomes-seen-as-static' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'order-levels-of-organisation', multiSelect: false, question: 'Which level of organisation includes all populations of different species living in one area?', options: ['Community', 'Organism', 'Biome', 'Biosphere'], correctIndices: [0], explanation: 'A community consists of all populations of different species in an area.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'order-levels-of-organisation', multiSelect: false, question: 'True or false: an ecosystem and a biome are the same scale.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a biome is a much larger scale, containing many ecosystems.', distractorMisconceptions: { 0: 'ecosystem-biome-conflated' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'distinguish-abiotic-biotic', multiSelect: false, question: 'Which of these is an abiotic factor?', options: ['Average rainfall', 'A herd of elephants', 'A population of trees', 'A community of insects'], correctIndices: [0], explanation: 'Rainfall is a non-living physical factor, so it is abiotic.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'distinguish-abiotic-biotic', multiSelect: false, question: 'True or false: abiotic factors are just unimportant background and do not affect which organisms can live in an area.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — abiotic factors actively determine which organisms can survive in an area.', distractorMisconceptions: { 0: 'abiotic-factors-seen-as-background' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'characterise-south-african-biomes', multiSelect: false, question: 'Which South African biome has winter rainfall and extremely high plant diversity of succulents?', options: ['Succulent Karoo', 'Savanna', 'Grassland', 'Forest'], correctIndices: [0], explanation: 'The Succulent Karoo is known for its winter rainfall and exceptional succulent plant diversity.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'characterise-south-african-biomes', multiSelect: false, question: 'True or false: South Africa consists of only the savanna biome.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — South Africa has multiple distinct biomes.', distractorMisconceptions: { 0: 'south-africa-only-savanna' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'characterise-south-african-biomes', multiSelect: false, question: 'What can cause a biome\'s vegetation pattern to shift over time?', options: ['Climate change and human activity', 'Nothing — biomes never change', 'Only earthquakes', 'Only ocean currents'], correctIndices: [0], explanation: 'Both climate change and human activity can shift biome characteristics.', distractorMisconceptions: { 1: 'biomes-seen-as-static' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'distinguish-abiotic-biotic', multiSelect: true, question: 'Which of these are abiotic factors? (select all that apply)', options: ['Soil type', 'Temperature', 'A population of birds', 'A community of fish'], correctIndices: [0, 1], explanation: 'Soil type and temperature are non-living; the population and community are living (biotic).', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'order-levels-of-organisation',
      analogy: 'Think of the levels of organisation like Russian nesting dolls: the smallest doll is the organism, the next size up is the population, then community, then ecosystem, then biome, then the biosphere is the largest doll containing everything else inside it.',
      explanation: 'To order the levels: (1) start with a single individual (organism), (2) group individuals of the same species together (population), (3) add other species\' populations in the same area (community), (4) add the physical environment around that community (ecosystem), (5) zoom out to the large climate-defined region containing many ecosystems (biome), (6) zoom out to all of Earth\'s ecosystems combined (biosphere).',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Where does "population" fit between "organism" and "community" in the hierarchy?', steps: [
          { step: 'An organism is one individual; a population groups many individuals of the SAME species together in one area.', justification: 'Population is defined as organisms of a single species, distinguishing it from the broader community level.' },
          { step: 'A community then adds populations of DIFFERENT species together — so population sits between organism (smallest) and community (broader) in the hierarchy.', justification: 'Community includes multiple populations of different species, placing it above population in scale.' },
        ], answer: 'Population sits between organism and community, grouping individuals of one species' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'order-levels-of-organisation', question: 'Which level includes only organisms of the SAME species in one area?', options: ['Population', 'Community', 'Ecosystem', 'Biome'], correctIndex: 0, hints: { strategic: 'Think about "same species" specifically.', procedural: 'Population is defined as one species in an area.', workedStep: 'Population.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'order-levels-of-organisation', question: 'Which level adds the physical (abiotic) environment to a community?', options: ['Ecosystem', 'Population', 'Organism', 'Biosphere'], correctIndex: 0, hints: { strategic: 'Think about what "community" is missing.', procedural: 'Ecosystem = community + physical environment.', workedStep: 'Ecosystem.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'order-levels-of-organisation', question: 'Which is the largest level, containing all of Earth\'s ecosystems?', options: ['Biosphere', 'Biome', 'Community', 'Population'], correctIndex: 0, hints: { strategic: 'Think about the broadest possible scale.', procedural: 'Biosphere includes everything.', workedStep: 'Biosphere.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why does South Africa have several different biomes instead of just one?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel ordering levels of organisation and characterising biomes now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What mainly determines which biome forms in a given region?', type: 'multiple-choice', options: ['Climate (rainfall and temperature) and dominant vegetation', 'Only the animals present', 'Random chance', 'Only human settlement patterns'] },
  ],
};
