// ── Life Sciences, Term 4, Topic 2: History of Life on Earth ─────────────────
// Closes the "Diversity, Change and Continuity" strand for Grade 10. Builds on
// Biodiversity and Classification (this term). Light introductory treatment:
// fossils as evidence, geological time at a broad level, and patterns of
// extinction and change.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'fossils-only-bones',
    label: 'Believing fossils are only preserved bones',
    errorType: 'You described fossils as always being bones, ignoring other types of fossil evidence.',
    principle: 'Fossils include much more than bones: IMPRINTS (e.g. footprints preserved in hardened mud), CASTS (a mould formed around a decayed organism, later filled with minerals), and even preserved traces of ORGANIC MATERIAL (in rare cases) all count as fossil evidence of past life, not just skeletal remains.',
    correctStep: 'A dinosaur footprint preserved in ancient mudstone is a fossil, just as much as a fossilised bone — it is an imprint, not skeletal material, but still valid evidence of past life.',
  },
  {
    id: 'all-organisms-existed-simultaneously',
    label: 'Believing all organisms in Earth\'s history existed at the same time',
    errorType: 'You assumed different organisms known from fossils (e.g. dinosaurs and early humans) all lived at the same time.',
    principle: 'Life on Earth has changed over an enormous span of GEOLOGICAL TIME (billions of years), with different groups of organisms appearing, thriving, and often going extinct at very different, non-overlapping points in that timeline. Dinosaurs, for example, went extinct tens of millions of years before humans existed.',
    correctStep: 'Dinosaurs went extinct around 66 million years ago, while the earliest humans appeared only a few million years ago — these two groups never coexisted, despite sometimes being pictured together.',
  },
  {
    id: 'extinction-seen-as-only-negative',
    label: 'Viewing extinction only as a negative event with no role in long-term change',
    errorType: 'You described extinction purely as a tragedy or failure, without recognising its role in the broader pattern of life\'s history.',
    principle: 'While extinction does represent the permanent loss of a species, it is also a NATURAL PART of life\'s long-term history — extinction events have repeatedly reshaped which groups of organisms dominate, and have sometimes opened opportunities for surviving groups to diversify into new forms over subsequent time periods.',
    correctStep: 'The extinction of most dinosaur groups roughly 66 million years ago is thought to have opened ecological opportunities that allowed mammals to diversify extensively in the time that followed.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 4,
  topicId: 'history-of-life-on-earth',
  topicName: 'History of Life on Earth',
  prerequisites: [
    'Biodiversity and Classification of Living Organisms (this term, Topic 1)',
  ],
  objectives: [
    { id: 'identify-fossil-evidence-types', text: 'Identify different types of fossil evidence for past life.' },
    { id: 'describe-geological-time-broadly', text: 'Describe, at a broad level, that life has changed over vast spans of geological time.' },
    { id: 'explain-extinction-as-part-of-change', text: 'Explain extinction as a natural part of long-term biological change, not only a negative event.' },
  ],
  estimatedMinutes: [20, 30],
};

export const historyOfLifeOnEarth: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'The dinosaurs ruled Earth for well over 100 million years — and yet not a single human ever saw one alive. What does that tell us about the true scale of life\'s history?',
  goalSettingPrompt:
    'The organisms alive today are the result of an immense span of change, evidenced by fossils and marked by repeated extinctions that reshaped life\'s direction. By the end of this lesson you\'ll be able to identify types of fossil evidence, describe geological time at a broad level, and explain extinction\'s role in long-term change.',

  activate: {
    connectPrompt: 'You already know classification organises today\'s biodiversity (from Biodiversity and Classification) — this lesson looks at how that biodiversity came to exist through immense spans of time.',
    diagnosticQuestions: [
      { question: 'Are fossils always bones, or can they take other forms too?', options: ['They can take other forms, like footprints or casts', 'Fossils are always bones', 'Fossils are always complete skeletons', 'Only teeth can become fossils'], correctIndex: 0, explanation: 'Fossils include imprints, casts, and other preserved evidence, not only bones.' },
      { question: 'Did dinosaurs and early humans exist on Earth at the same time?', options: ['No — dinosaurs went extinct long before humans appeared', 'Yes, they coexisted', 'Only in some parts of the world', 'Humans existed before dinosaurs'], correctIndex: 0, explanation: 'Dinosaurs went extinct around 66 million years ago, tens of millions of years before humans existed.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'FOSSILS are the main evidence for past life, and they take several forms — not only bones: IMPRINTS (e.g. footprints or leaf patterns preserved in hardened sediment), CASTS (mineral-filled moulds formed around a decayed organism), and occasionally preserved ORGANIC TRACES. Life\'s history spans an enormous scale of GEOLOGICAL TIME — billions of years — broadly divided into eras and periods, over which very different groups of organisms have appeared, dominated, and disappeared at DIFFERENT, non-overlapping points in time.',
    workedExamples: [
      { id: 'wx-fossil-types', prompt: 'A scientist finds a footprint preserved in ancient rock, with no bones present. Is this valid fossil evidence?', steps: [
        { step: 'A footprint preserved in hardened sediment is a type of fossil evidence called an imprint.', justification: 'Imprints are a recognised category of fossil evidence, separate from bones.' },
        { step: 'This is valid evidence of past life, even though no bones or skeletal material are present.', justification: 'Fossil evidence is not limited to skeletal remains.' },
      ], answer: 'Yes — it is a valid fossil, specifically an imprint' },
      { id: 'wx-geological-timescale', prompt: 'Explain why dinosaurs and early humans could not have coexisted, using geological time.', steps: [
        { step: 'Dinosaurs (most groups) went extinct around 66 million years ago, based on fossil and geological evidence.', justification: 'Fossil dating places the major dinosaur extinction at a specific point in geological time.' },
        { step: 'The earliest humans did not appear until a few million years ago — tens of millions of years AFTER the dinosaurs\' extinction — so their timelines never overlapped.', justification: 'Comparing the dated timelines of both groups shows no overlap exists.' },
      ], answer: 'Their timelines, based on geological dating, do not overlap — dinosaurs were long extinct before humans existed' },
    ],
    knowledgeChecks: [
      { question: 'Can a footprint preserved in rock count as a fossil, even without any bones present?', options: ['Yes — it is a type of fossil called an imprint', 'No — only bones can be fossils', 'No — footprints cannot be preserved', 'Only if bones are found nearby'], correctIndex: 0, explanation: 'Imprints, like footprints, are valid fossil evidence.', misconceptionId: 'fossils-only-bones' },
      { question: 'Did dinosaurs and early humans exist on Earth at the same point in geological time?', options: ['No — their timelines do not overlap', 'Yes, they lived together', 'Only briefly, at the very end', 'This cannot be determined'], correctIndex: 0, explanation: 'Fossil and geological evidence show dinosaurs went extinct long before humans appeared.', misconceptionId: 'all-organisms-existed-simultaneously' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying fossil evidence types and understanding geological time scales?',
  },

  demonstrateChunk2: {
    explanation:
      'EXTINCTION — the permanent disappearance of a species — is a NATURAL and RECURRING part of life\'s long-term history, evidenced repeatedly in the fossil record. While extinction represents genuine loss, it is not purely negative in the bigger picture: extinction events have repeatedly reshaped which groups of organisms dominate an era, and have often created ecological opportunities that allowed SURVIVING groups to diversify extensively afterward. Earth\'s current biodiversity is the result of this long, ongoing pattern of change, extinction, and diversification over geological time, not a fixed, unchanging state.',
    workedExamples: [
      { id: 'wx-extinction-and-diversification', prompt: 'Explain how the extinction of most dinosaur groups may have benefited mammals over subsequent time periods.', steps: [
        { step: 'Before this extinction event, dinosaurs occupied most major ecological niches, limiting opportunities available to other groups like mammals.', justification: 'Dominant groups typically limit the ecological opportunities available to other groups.' },
        { step: 'After most dinosaur groups went extinct, previously unavailable ecological niches opened up, which surviving mammal groups were able to diversify into over subsequent time.', justification: 'Extinction of a dominant group can create new opportunities for surviving groups to diversify.' },
      ], answer: 'The extinction opened ecological niches that mammals were then able to diversify into' },
      { id: 'wx-current-biodiversity-as-result', prompt: 'Explain why today\'s biodiversity should be understood as the result of an ongoing process, rather than a fixed, unchanging state.', steps: [
        { step: 'The fossil record shows repeated cycles of species appearing, changing, and going extinct over vast spans of geological time.', justification: 'Fossil evidence directly demonstrates ongoing change throughout Earth\'s history.' },
        { step: 'Today\'s biodiversity is simply the current snapshot of this ongoing, continuing process — not a final, permanent state.', justification: 'Since the process that produced current biodiversity is ongoing, the present state is not a fixed endpoint.' },
      ], answer: 'It reflects an ongoing, continuing process of change shown throughout the fossil record, not a final state' },
    ],
    knowledgeChecks: [
      { question: 'Is extinction always a purely negative event with no broader role in life\'s history?', options: ['No — it can also open opportunities for surviving groups to diversify', 'Yes, extinction has no positive aspects at all', 'Extinction has never occurred more than once', 'Extinction only affects plants'], correctIndex: 0, explanation: 'Extinction events have repeatedly reshaped and opened opportunities for surviving groups.', misconceptionId: 'extinction-seen-as-only-negative' },
      { question: 'Is today\'s biodiversity a fixed, final, unchanging state?', options: ['No — it is the current result of an ongoing process of change', 'Yes, biodiversity has always been exactly as it is now', 'Biodiversity stopped changing long ago', 'This cannot be determined from evidence'], correctIndex: 0, explanation: 'The fossil record shows biodiversity has continuously changed and continues to change.' },
    ],
    confidenceCheckPrompt: 'How confident do you feel explaining extinction\'s role in long-term biological change?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'identify-fossil-evidence-types', revealSteps: 1, prompt: 'A mineral-filled mould, shaped exactly like a decayed ancient shellfish, is found in rock. What type of fossil evidence is this?', steps: [
        { step: 'A mineral-filled mould formed around a decayed organism is a specific type of fossil called a cast.', justification: 'Casts are defined as mineral-filled moulds formed after an organism decays.' },
      ], answer: 'A cast' },
      { id: 'fp-partial-1', objectiveId: 'describe-geological-time-broadly', revealSteps: 1, prompt: 'Explain, in terms of geological time, why finding a trilobite fossil and a mammal fossil in very different, non-adjacent rock layers makes sense.', steps: [
        { step: 'Different rock layers generally correspond to different periods of geological time, since sediment builds up in layers over vast time spans.', justification: 'Rock layering reflects the passage of geological time, with older layers typically deeper.' },
        { step: 'Trilobites and early mammals lived at very different, widely separated points in Earth\'s history, so finding them in different, non-adjacent layers is consistent with this.', justification: 'Different geological ages for different fossil groups explains their separation in the rock record.' },
      ], answer: 'They represent very different points in geological time, consistent with appearing in separate rock layers' },
      { id: 'fp-independent-1', objectiveId: 'explain-extinction-as-part-of-change', revealSteps: 0, prompt: 'In one sentence, explain why extinction is considered a natural part of life\'s long-term history, rather than an unusual anomaly.', steps: [
        { step: 'The fossil record shows extinction has occurred repeatedly throughout Earth\'s history, making it a recurring, natural pattern rather than a rare anomaly.', justification: 'Repeated occurrence throughout the fossil record establishes extinction as a normal part of life\'s history.' },
      ], answer: 'The fossil record shows extinction has occurred repeatedly, making it a natural, recurring pattern' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'identify-fossil-evidence-types', question: 'Which of these counts as a valid form of fossil evidence?', options: ['A dinosaur footprint imprint in hardened mud', 'Only complete skeletons', 'Only teeth', 'Fossils must always include DNA'], correctIndex: 0, hints: { strategic: 'Think about non-bone forms of fossil evidence.', procedural: 'Footprints are imprints, a recognised fossil type.', workedStep: 'A dinosaur footprint imprint.' }, distractorMisconceptions: { 1: 'fossils-only-bones' } },
      { id: 'ip-2', objectiveId: 'describe-geological-time-broadly', question: 'Did trilobites and dinosaurs exist on Earth at the same broad period of geological time?', options: ['No — trilobites existed long before dinosaurs appeared', 'Yes, they were contemporaries', 'Dinosaurs existed before trilobites', 'This cannot be determined from fossils'], correctIndex: 0, hints: { strategic: 'Think about the huge span of geological time involved.', procedural: 'Trilobites predate dinosaurs by a vast span of time.', workedStep: 'No, trilobites existed long before dinosaurs.' }, distractorMisconceptions: { 1: 'all-organisms-existed-simultaneously' } },
      { id: 'ip-3', objectiveId: 'explain-extinction-as-part-of-change', question: 'Can an extinction event ever lead to increased diversification of surviving groups afterward?', options: ['Yes — it can open ecological opportunities for survivors', 'No — extinction only ever reduces diversity permanently', 'Extinction has no effect on other groups', 'This has never been observed in the fossil record'], correctIndex: 0, hints: { strategic: 'Think about what happens to ecological niches after an extinction event.', procedural: 'Opened niches can allow surviving groups to diversify.', workedStep: 'Yes, it can open ecological opportunities.' }, distractorMisconceptions: { 1: 'extinction-seen-as-only-negative' } },
      { id: 'ip-4', objectiveId: 'describe-geological-time-broadly', question: 'Does the current variety of life on Earth represent a final, unchanging state?', options: ['No — it is the current point in an ongoing process of change', 'Yes, life has always looked exactly like this', 'Biodiversity reached its final form millions of years ago', 'This cannot be assessed using fossils'], correctIndex: 0, hints: { strategic: 'Think about what the fossil record shows about change over time.', procedural: 'The fossil record shows continuous change, not a fixed endpoint.', workedStep: 'No, it is the current point in an ongoing process.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'identify-fossil-evidence-types', multiSelect: false, question: 'A mineral-filled mould shaped like a decayed organism is called what?', options: ['A cast', 'A bone', 'A living fossil', 'A footprint'], correctIndices: [0], explanation: 'A mineral-filled mould of a decayed organism is specifically called a cast.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'identify-fossil-evidence-types', multiSelect: false, question: 'True or false: fossils can only exist as preserved bones.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — imprints, casts, and other forms also count as fossils.', distractorMisconceptions: { 0: 'fossils-only-bones' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'describe-geological-time-broadly', multiSelect: false, question: 'Roughly how long ago did most dinosaur groups go extinct?', options: ['Around 66 million years ago', 'Around 6,000 years ago', 'Around 1 million years ago', 'They have not gone extinct'], correctIndices: [0], explanation: 'The major dinosaur extinction event occurred roughly 66 million years ago.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'describe-geological-time-broadly', multiSelect: false, question: 'True or false: dinosaurs and early humans lived on Earth at the same time.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — dinosaurs went extinct tens of millions of years before humans appeared.', distractorMisconceptions: { 0: 'all-organisms-existed-simultaneously' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'explain-extinction-as-part-of-change', multiSelect: false, question: 'What can happen to surviving groups after a major extinction event?', options: ['They can diversify into newly opened ecological niches', 'Nothing changes for surviving groups', 'All surviving groups also go extinct automatically', 'Extinction events have no effect on other species'], correctIndices: [0], explanation: 'Extinction events can open ecological opportunities for survivors to diversify.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'explain-extinction-as-part-of-change', multiSelect: false, question: 'True or false: extinction is a purely negative event with no role in shaping long-term biological change.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — extinction is a natural, recurring part of life\'s history that has shaped biodiversity.', distractorMisconceptions: { 0: 'extinction-seen-as-only-negative' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'describe-geological-time-broadly', multiSelect: false, question: 'What is the main evidence scientists use to understand life\'s history over geological time?', options: ['Fossils', 'Only living organisms today', 'Weather records', 'Only written historical records'], correctIndices: [0], explanation: 'Fossils are the primary evidence for understanding life\'s history.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-fossil-evidence-types', multiSelect: true, question: 'Which of these count as types of fossil evidence? (select all that apply)', options: ['Bones', 'Footprint imprints', 'Casts', 'Living organisms today'], correctIndices: [0, 1, 2], explanation: 'Bones, imprints, and casts are all fossil evidence types; living organisms today are not fossils.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'describe-geological-time-broadly',
      analogy: 'Think of Earth\'s geological history like a single 24-hour clock, where all of Earth\'s existence is compressed into one day: complex animal life would only appear in the last few hours, dinosaurs would occupy just a brief window in the evening, and humans would appear in only the final few seconds before midnight — showing just how vast geological time really is compared to human history.',
      explanation: 'To reason about geological time: (1) remember that Earth\'s history spans billions of years, vastly longer than human history, (2) different groups of organisms appear and often go extinct at very different, specific points within that timeline, (3) always check whether two organisms\' known time periods actually overlap before assuming they coexisted — do not assume based on both being "ancient" or "extinct".',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A student claims that because both trilobites and dinosaurs are "extinct animals from long ago," they must have lived at the same time. Explain the flaw in this reasoning.', steps: [
          { step: 'Being "extinct" and "from long ago" only tells you an organism no longer exists today — it says nothing about exactly WHEN in geological history it lived.', justification: 'Extinction status alone does not specify a particular time period.' },
          { step: 'Trilobites and dinosaurs actually existed during very different, separated periods of geological time — trilobites went extinct long before dinosaurs even appeared — so the student\'s assumption is incorrect.', justification: 'Checking the actual dated time periods, rather than assuming based on shared "ancient" status, reveals they did not coexist.' },
        ], answer: 'Both being "extinct and ancient" does not mean they lived at the same time — their actual time periods must be checked' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'describe-geological-time-broadly', question: 'Woolly mammoths existed until roughly 4,000 years ago, while dinosaurs went extinct around 66 million years ago. Did these two groups coexist?', options: ['No — mammoths appeared long after dinosaurs went extinct', 'Yes, they lived together', 'This cannot be determined', 'Mammoths existed before dinosaurs'], correctIndex: 0, hints: { strategic: 'Compare the actual time periods given.', procedural: '4,000 years ago is vastly more recent than 66 million years ago.', workedStep: 'No, mammoths appeared long after dinosaurs went extinct.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'describe-geological-time-broadly', question: 'Is human history (a few million years) long or short compared to the full span of Earth\'s geological history (billions of years)?', options: ['Very short by comparison', 'Roughly equal', 'Human history is actually longer', 'They cannot be compared'], correctIndex: 0, hints: { strategic: 'Compare millions of years to billions of years.', procedural: 'A few million years is a tiny fraction of billions of years.', workedStep: 'Very short by comparison.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'describe-geological-time-broadly', question: 'Two fossils are found in very different, widely separated rock layers. What does this most likely suggest?', options: ['The organisms lived at different periods of geological time', 'The organisms definitely lived at exactly the same time', 'Rock layers have no relationship to time', 'The fossils must be fake'], correctIndex: 0, hints: { strategic: 'Think about what rock layering generally reflects.', procedural: 'Different layers generally correspond to different time periods.', workedStep: 'The organisms lived at different periods of geological time.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is it inaccurate to picture humans and dinosaurs coexisting, based on what fossils show about geological time?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel identifying fossil evidence and reasoning about geological time and extinction now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Which best describes the role of extinction in life\'s long-term history?', type: 'multiple-choice', options: ['A natural, recurring process that has reshaped which groups dominate over time', 'A purely negative event with no broader significance', 'Something that has only happened once in Earth\'s history', 'An event unrelated to today\'s biodiversity'] },
  ],
};
