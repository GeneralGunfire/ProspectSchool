// ── Life Sciences, Term 4, Topic 1: Biodiversity and Classification of Living Organisms ──
// Opens the "Diversity, Change and Continuity" strand. Introductory Grade 10
// scope: concept of biodiversity, binomial nomenclature, the five-kingdom
// classification system, and vertebrates vs invertebrates.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'biodiversity-means-animals-only',
    label: 'Equating biodiversity with animal diversity only',
    errorType: 'You described biodiversity purely in terms of how many animal species exist, ignoring plants, fungi, and microorganisms.',
    principle: 'BIODIVERSITY includes the variety of ALL life: plants, animals, fungi, and microorganisms — as well as SPECIES diversity, GENETIC diversity (variation within a species), and ECOSYSTEM diversity (variety of habitats). It is not limited to animals alone.',
    correctStep: 'A rainforest\'s biodiversity includes its thousands of insect and plant species, its fungi, and its microorganisms — not just the large animals people notice first.',
  },
  {
    id: 'scientific-names-seen-as-arbitrary',
    label: 'Treating scientific (binomial) names as arbitrary labels with no structure',
    errorType: 'You treated a scientific name as just a random label, without recognising its structured genus-species format.',
    principle: 'BINOMIAL NOMENCLATURE gives every species a two-part scientific name: the first part is the GENUS (capitalised, shared by closely related species), and the second part is the SPECIES (lowercase, unique to that species). This structured system, not arbitrary labelling, shows relatedness between organisms.',
    correctStep: 'Panthera leo (lion) and Panthera pardus (leopard) share the same genus, Panthera, showing they are closely related — this relatedness is built into the naming structure, not arbitrary.',
  },
  {
    id: 'classification-seen-as-permanently-fixed',
    label: 'Believing classification systems are permanently fixed and never revised',
    errorType: 'You described the current classification of organisms as final and unchangeable, ignoring that classification is regularly revised.',
    principle: 'Classification systems are NOT permanently fixed — they are regularly REVISED as new evidence emerges, especially GENETIC evidence, which can reveal that organisms once grouped together are not as closely related as previously thought (or vice versa).',
    correctStep: 'Genetic studies have led scientists to reclassify some organisms into different groups than earlier, purely appearance-based classification systems had placed them — classification evolves with new evidence.',
  },
  {
    id: 'invertebrates-seen-as-simple',
    label: 'Equating "invertebrate" with "small" or "biologically simple"',
    errorType: 'You assumed all invertebrates are simple or unsophisticated organisms, simply because they lack a backbone.',
    principle: 'INVERTEBRATE only means "lacking a backbone" — it says nothing about complexity. Many invertebrate groups, like ARTHROPODS (insects, crustaceans, arachnids) and CEPHALOPODS (octopuses, squid), include highly complex organisms with sophisticated behaviours, sensory systems, and (in some cases) advanced problem-solving abilities.',
    correctStep: 'An octopus (an invertebrate) has a highly complex nervous system and demonstrates advanced problem-solving behaviour — its lack of a backbone does not make it biologically "simple".',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 4,
  topicId: 'biodiversity-and-classification',
  topicName: 'Biodiversity and Classification of Living Organisms',
  prerequisites: [
    'Human Impact on the Environment (Term 3)',
  ],
  objectives: [
    { id: 'define-biodiversity-levels', text: 'Define biodiversity and its three levels: species, genetic, and ecosystem diversity.' },
    { id: 'apply-binomial-nomenclature', text: 'Apply binomial nomenclature to interpret and construct scientific names.' },
    { id: 'classify-organisms-by-kingdom-and-vertebrate-status', text: 'Classify organisms into the five kingdoms, and vertebrates into major classes.' },
  ],
  estimatedMinutes: [25, 35],
};

export const biodiversityAndClassification: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Scientists estimate millions of species share this planet — so how do biologists keep track of, name, and organise all of them without total chaos?',
  goalSettingPrompt:
    'Biodiversity spans far more than the animals we notice, and scientists use a structured naming and classification system to organise all of life. By the end of this lesson you\'ll be able to define biodiversity\'s three levels, apply binomial nomenclature, and classify organisms by kingdom and vertebrate status.',

  activate: {
    connectPrompt: 'You already know ecosystems contain many interacting species (from Ecosystems and Ecological Relationships) — this lesson looks at how scientists organise and name that diversity of life.',
    diagnosticQuestions: [
      { question: 'Does biodiversity include only animals, or also plants, fungi, and microorganisms?', options: ['All of life — plants, animals, fungi, microorganisms', 'Animals only', 'Plants only', 'Only large, visible organisms'], correctIndex: 0, explanation: 'Biodiversity encompasses the full variety of all living things.' },
      { question: 'Does a scientific name like Panthera leo follow a structured format, or is it arbitrary?', options: ['Structured — genus then species', 'Completely arbitrary', 'Random letters with no meaning', 'Only the first word matters'], correctIndex: 0, explanation: 'Binomial nomenclature follows a structured genus-species format.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'BIODIVERSITY refers to the variety of life at three levels: SPECIES diversity (the number and variety of different species in an area), GENETIC diversity (the variation WITHIN a species, important for a population\'s ability to adapt), and ECOSYSTEM diversity (the variety of different habitats/ecosystems in a region). Biodiversity includes ALL life — plants, animals, fungi, and microorganisms — not animals alone, and it is important for ecosystem stability, resources, and cultural value.',
    workedExamples: [
      { id: 'wx-biodiversity-levels', prompt: 'A nature reserve contains many different species, but also many genetically varied individuals within its lion population, and both grassland and wetland habitats. Identify the three levels of biodiversity shown.', steps: [
        { step: 'Many different species present shows species diversity.', justification: 'Species diversity refers to the variety of different species in an area.' },
        { step: 'Genetic variation within the lion population shows genetic diversity.', justification: 'Genetic diversity refers to variation within a single species.' },
        { step: 'Both grassland and wetland habitats present shows ecosystem diversity.', justification: 'Ecosystem diversity refers to the variety of different habitats in a region.' },
      ], answer: 'Species diversity, genetic diversity, and ecosystem diversity are all present' },
      { id: 'wx-biodiversity-scope', prompt: 'Explain why fungi and microorganisms should be included when discussing a forest\'s biodiversity, not just its animals.', steps: [
        { step: 'Biodiversity is defined as the variety of ALL life forms in an area, not animals specifically.', justification: 'The definition of biodiversity spans every kingdom of life.' },
        { step: 'Fungi and microorganisms play essential ecological roles (e.g. decomposition, nutrient cycling) and represent a large portion of a forest\'s total biological diversity.', justification: 'Excluding fungi and microorganisms would significantly understate the forest\'s true biodiversity.' },
      ], answer: 'Biodiversity includes all life forms, and fungi/microorganisms play essential ecological roles' },
    ],
    knowledgeChecks: [
      { question: 'Does biodiversity refer only to the variety of animal species in an area?', options: ['No — it includes plants, fungi, and microorganisms too', 'Yes, only animals count', 'Only large animals count', 'Biodiversity has nothing to do with variety'], correctIndex: 0, explanation: 'Biodiversity spans all forms of life, not just animals.', misconceptionId: 'biodiversity-means-animals-only' },
      { question: 'What does "genetic diversity" refer to?', options: ['Variation within a single species', 'The number of different species present', 'The number of different habitats', 'It is not a real level of biodiversity'], correctIndex: 0, explanation: 'Genetic diversity is variation within a species, distinct from species or ecosystem diversity.' },
    ],
    confidenceCheckPrompt: 'How confident do you feel defining biodiversity and its three levels?',
  },

  demonstrateChunk2: {
    explanation:
      'BINOMIAL NOMENCLATURE gives each species a structured two-part scientific name: GENUS (capitalised, shared by closely related species) followed by SPECIES (lowercase, unique to that species) — e.g. Panthera leo (lion). Classification systems are NOT permanently fixed; they are regularly REVISED as new evidence (especially genetic evidence) emerges. A commonly used framework groups organisms into FIVE KINGDOMS: Monera (bacteria), Protista, Fungi, Plantae, and Animalia. Within Animalia, organisms are further divided into VERTEBRATES (have a backbone: fish, amphibians, reptiles, birds, mammals) and INVERTEBRATES (lack a backbone) — invertebrate does NOT mean simple, as groups like arthropods and cephalopods include highly complex organisms.',
    workedExamples: [
      { id: 'wx-binomial-name', prompt: 'Panthera leo (lion) and Panthera tigris (tiger) share the same genus. What does this tell you about their relationship?', steps: [
        { step: 'Sharing the genus "Panthera" means both species are classified as closely related within that genus.', justification: 'Genus is the shared, broader classification level in binomial nomenclature.' },
        { step: 'The different species names ("leo" and "tigris") show they are still distinct species, just closely related ones within the same genus.', justification: 'The species part of the name distinguishes them as separate, though related, species.' },
      ], answer: 'They are closely related species within the same genus, Panthera' },
      { id: 'wx-vertebrate-invertebrate', prompt: 'An octopus has no backbone but shows complex problem-solving behaviour. Classify it as vertebrate or invertebrate, and explain why this doesn\'t mean it is "simple".', steps: [
        { step: 'Since the octopus lacks a backbone, it is classified as an invertebrate.', justification: 'The presence or absence of a backbone is the sole basis for the vertebrate/invertebrate classification.' },
        { step: '"Invertebrate" only describes the lack of a backbone, not the organism\'s complexity — many invertebrates, like octopuses, have sophisticated nervous systems and behaviours.', justification: 'Complexity and vertebrate status are unrelated classification dimensions.' },
      ], answer: 'Invertebrate; the term only refers to lacking a backbone, not to biological simplicity' },
    ],
    knowledgeChecks: [
      { question: 'In the scientific name Felis catus (domestic cat), which part is the genus?', options: ['Felis (the first, capitalised word)', 'Catus (the second word)', 'Both words together form the genus', 'Neither word is the genus'], correctIndex: 0, explanation: 'The first, capitalised word in a binomial name is always the genus.', misconceptionId: 'scientific-names-seen-as-arbitrary' },
      { question: 'Are all invertebrates biologically "simple" organisms?', options: ['No — many, like arthropods and cephalopods, are highly complex', 'Yes, all invertebrates are simple', 'Only insects are complex invertebrates', 'Invertebrates cannot have nervous systems'], correctIndex: 0, explanation: '"Invertebrate" only describes lacking a backbone, not complexity level.', misconceptionId: 'invertebrates-seen-as-simple' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying binomial nomenclature and classifying organisms by kingdom and vertebrate status?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'define-biodiversity-levels', revealSteps: 1, prompt: 'A conservation report notes high genetic variation among a rhino population\'s individuals. Which level of biodiversity does this describe?', steps: [
        { step: 'Variation among individuals WITHIN a single species (rhinos) describes genetic diversity, not species or ecosystem diversity.', justification: 'Genetic diversity is specifically about within-species variation.' },
      ], answer: 'Genetic diversity' },
      { id: 'fp-partial-1', objectiveId: 'apply-binomial-nomenclature', revealSteps: 1, prompt: 'Given the scientific name Canis lupus (grey wolf), identify the genus and species parts, and their formatting rules.', steps: [
        { step: 'Canis is the genus, capitalised as the first word.', justification: 'The genus is always the first word and always capitalised.' },
        { step: 'Lupus is the species, written in lowercase as the second word.', justification: 'The species name is always the second word and always lowercase.' },
      ], answer: 'Canis = genus (capitalised); lupus = species (lowercase)' },
      { id: 'fp-independent-1', objectiveId: 'classify-organisms-by-kingdom-and-vertebrate-status', revealSteps: 0, prompt: 'A frog has a backbone. Which vertebrate class does it belong to?', steps: [
        { step: 'A frog is classified as an amphibian, one of the five main vertebrate classes.', justification: 'Frogs are the classic example of the amphibian vertebrate class.' },
      ], answer: 'Amphibian' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'define-biodiversity-levels', question: 'A region has many different types of habitats: forest, wetland, and grassland. Which level of biodiversity does this describe?', options: ['Ecosystem diversity', 'Genetic diversity', 'Species diversity only', 'None of these'], correctIndex: 0, hints: { strategic: 'Think about variety of habitats specifically.', procedural: 'Multiple distinct habitat types define ecosystem diversity.', workedStep: 'Ecosystem diversity.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'define-biodiversity-levels', question: 'Does biodiversity in a coral reef include the reef\'s bacteria and algae, or only its fish?', options: ['It includes bacteria and algae too, not just fish', 'Only the fish count as biodiversity', 'Only large animals count', 'Biodiversity excludes microorganisms entirely'], correctIndex: 0, hints: { strategic: 'Think about what "all life" means.', procedural: 'Biodiversity includes every kingdom of life present.', workedStep: 'It includes bacteria and algae too.' }, distractorMisconceptions: { 1: 'biodiversity-means-animals-only' } },
      { id: 'ip-3', objectiveId: 'apply-binomial-nomenclature', question: 'Homo sapiens (humans) and Homo erectus (an extinct relative) share the same genus. What does this indicate?', options: ['They are closely related species', 'They are the exact same species', 'They have no relation at all', 'The names are randomly assigned'], correctIndex: 0, hints: { strategic: 'Think about what a shared genus means.', procedural: 'Shared genus indicates close relatedness, though they remain distinct species.', workedStep: 'They are closely related species.' }, distractorMisconceptions: { 3: 'scientific-names-seen-as-arbitrary' } },
      { id: 'ip-4', objectiveId: 'classify-organisms-by-kingdom-and-vertebrate-status', question: 'A spider has no backbone and is often assumed to be "simple". Is this assumption accurate?', options: ['No — many invertebrates like spiders are biologically complex', 'Yes, all invertebrates are simple', 'Spiders are actually vertebrates', 'Complexity is unrelated to backbone status either way, so the question is meaningless'], correctIndex: 0, hints: { strategic: 'Think about what "invertebrate" actually describes.', procedural: 'Lacking a backbone does not mean an organism is simple.', workedStep: 'No, many invertebrates are biologically complex.' }, distractorMisconceptions: { 1: 'invertebrates-seen-as-simple' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'define-biodiversity-levels', multiSelect: false, question: 'What are the three levels of biodiversity?', options: ['Species, genetic, and ecosystem diversity', 'Animal, plant, and fungal diversity only', 'Only species diversity exists', 'Country, continent, and planet diversity'], correctIndices: [0], explanation: 'Biodiversity is measured at species, genetic, and ecosystem levels.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'define-biodiversity-levels', multiSelect: false, question: 'True or false: biodiversity refers only to the variety of animal species present.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — biodiversity includes plants, fungi, and microorganisms too.', distractorMisconceptions: { 0: 'biodiversity-means-animals-only' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-binomial-nomenclature', multiSelect: false, question: 'In the scientific name Panthera leo, what is "Panthera"?', options: ['The genus', 'The species', 'The kingdom', 'A random label'], correctIndices: [0], explanation: 'The first, capitalised word in a binomial name is the genus.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'apply-binomial-nomenclature', multiSelect: false, question: 'True or false: scientific names are assigned arbitrarily, with no structured meaning.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — binomial nomenclature follows a structured genus-species format that reflects relatedness.', distractorMisconceptions: { 0: 'scientific-names-seen-as-arbitrary' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'classify-organisms-by-kingdom-and-vertebrate-status', multiSelect: false, question: 'Which of these is one of the five kingdoms of life?', options: ['Fungi', 'Vertebrata', 'Mammalia', 'Chordata'], correctIndices: [0], explanation: 'Fungi is one of the five kingdoms; the others are not kingdom-level classifications.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'classify-organisms-by-kingdom-and-vertebrate-status', multiSelect: false, question: 'True or false: all invertebrates are biologically simple organisms.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — many invertebrates, like octopuses and insects, are highly complex.', distractorMisconceptions: { 0: 'invertebrates-seen-as-simple' } },
    { id: 'q7', type: 'true-false', objectiveId: 'classify-organisms-by-kingdom-and-vertebrate-status', multiSelect: false, question: 'True or false: classification systems are permanently fixed and never revised.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — classification is regularly revised as new (especially genetic) evidence emerges.', distractorMisconceptions: { 0: 'classification-seen-as-permanently-fixed' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'classify-organisms-by-kingdom-and-vertebrate-status', multiSelect: true, question: 'Which of these are vertebrate classes? (select all that apply)', options: ['Mammals', 'Reptiles', 'Arthropods', 'Amphibians'], correctIndices: [0, 1, 3], explanation: 'Mammals, reptiles, and amphibians are vertebrate classes; arthropods are invertebrates.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'define-biodiversity-levels',
      analogy: 'Think of the three biodiversity levels like a library: ecosystem diversity is having many different SECTIONS (fiction, science, history — different habitat types), species diversity is having many different BOOKS within each section (different species), and genetic diversity is having many different EDITIONS or copies of the same book with slight variations (variation within one species).',
      explanation: 'To identify a biodiversity level: (1) is it about variation between individuals of the SAME species? → genetic diversity. (2) is it about the number of DIFFERENT species present? → species diversity. (3) is it about the variety of DIFFERENT habitats/ecosystems in a region? → ecosystem diversity.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A national park report highlights that its 40 different antelope species represent significant biodiversity. Which level is this describing?', steps: [
          { step: 'This is about the number of different SPECIES (40 different antelope species) present.', justification: 'Counting different species present is specifically species diversity.' },
          { step: 'This is species diversity, not genetic diversity (which would be about variation within one antelope species) or ecosystem diversity (which would be about habitat variety).', justification: 'Distinguishing species diversity from the other two levels requires checking exactly what is being counted or varied.' },
        ], answer: 'Species diversity' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'define-biodiversity-levels', question: 'A cheetah population shows wide genetic variation, helping it adapt to disease. Which biodiversity level is this?', options: ['Genetic diversity', 'Species diversity', 'Ecosystem diversity', 'None of these'], correctIndex: 0, hints: { strategic: 'Think about variation within one species.', procedural: 'This describes genetic diversity.', workedStep: 'Genetic diversity.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'define-biodiversity-levels', question: 'A country contains deserts, forests, wetlands, and grasslands. Which biodiversity level is this?', options: ['Ecosystem diversity', 'Genetic diversity', 'Species diversity', 'None of these'], correctIndex: 0, hints: { strategic: 'Think about the variety of habitat types.', procedural: 'Multiple distinct habitats define ecosystem diversity.', workedStep: 'Ecosystem diversity.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'define-biodiversity-levels', question: 'A forest contains 200 different tree species. Which biodiversity level is this?', options: ['Species diversity', 'Genetic diversity', 'Ecosystem diversity', 'None of these'], correctIndex: 0, hints: { strategic: 'Think about counting different species.', procedural: 'Number of different species present defines species diversity.', workedStep: 'Species diversity.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is biodiversity more than just "how many animals" live in an area?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with binomial nomenclature and classification now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What does the term "invertebrate" actually describe?', type: 'multiple-choice', options: ['An organism lacking a backbone', 'A biologically simple organism', 'An organism with no nervous system', 'A type of plant'] },
  ],
};
