// ── Physical Sciences, Term 1, Topic 2: Electrostatics ────────────────────────
// Builds on Waves/Sound/Light. Qualitative Grade 10 scope — charging methods,
// electric field concept — no quantitative Coulomb's law (Grade 11+).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'charge-created-not-transferred',
    label: 'Believing charging an object creates new charge, rather than transferring existing charge',
    errorType: 'You described charging as if electric charge were being newly created, rather than moved from one object to another.',
    principle: 'Charging never CREATES charge — it TRANSFERS electrons from one object to another (or redistributes them). The total charge in an isolated system is always conserved.',
    correctStep: 'Rubbing a balloon on hair transfers electrons FROM the hair TO the balloon — no new charge is created, the hair becomes positively charged as it loses electrons, the balloon negative as it gains them.',
  },
  {
    id: 'like-charges-attract-confused',
    label: 'Confusing whether like or unlike charges attract',
    errorType: 'You stated the wrong rule for how charges interact.',
    principle: 'LIKE charges (both positive or both negative) REPEL each other. UNLIKE charges (one positive, one negative) ATTRACT each other.',
    correctStep: 'Two positively charged balloons pushed near each other will repel (push apart), not attract.',
  },
  {
    id: 'induction-requires-contact',
    label: 'Believing charging by induction requires direct contact',
    errorType: 'You described induction as if it required the charged and neutral objects to physically touch.',
    principle: 'Charging by INDUCTION happens WITHOUT direct contact — a charged object brought near (not touching) a neutral object causes electrons within the neutral object to redistribute (repelled or attracted), separating charge within it.',
    correctStep: 'Bringing a charged rod near (not touching) a neutral metal sphere causes electrons in the sphere to shift away from or toward the rod — this is induction, distinct from charging by direct contact.',
  },
  {
    id: 'neutral-object-has-no-charges',
    label: 'Believing a neutral object contains no charges at all',
    errorType: 'You assumed "neutral" means an object has no positive or negative charges present.',
    principle: 'A NEUTRAL object has EQUAL amounts of positive and negative charge — it\'s not that charges are absent, but that they balance out to a net charge of zero.',
    correctStep: 'A neutral atom has protons (positive) and electrons (negative) present in equal numbers — the charges cancel out, they aren\'t missing.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'phys-sci',
  grade: 10,
  term: 1,
  topicId: 'electrostatics',
  topicName: 'Electrostatics',
  prerequisites: [
    'Waves, sound and light (this term, Topic 1)',
  ],
  objectives: [
    { id: 'explain-charging-methods', text: 'Explain the three methods of charging: friction, contact, and induction.' },
    { id: 'apply-charge-interaction-rules', text: 'Apply the rule that like charges repel and unlike charges attract.' },
    { id: 'explain-charge-conservation', text: 'Explain that charging transfers/redistributes charge rather than creating it.' },
    { id: 'describe-electric-field-concept', text: 'Describe the concept of an electric field around a charged object.' },
  ],
  estimatedMinutes: [20, 30],
};

export const electrostatics: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Why does your hair stand up when you rub a balloon on it?',
  goalSettingPrompt:
    'Static electricity comes from moving electrons between objects, not creating new charge. By the end of this lesson you\'ll be able to explain the three charging methods, predict how charges interact, and describe the electric field around a charge.',

  activate: {
    connectPrompt: 'You already know atoms contain protons and electrons from general science — this lesson builds directly on that.',
    diagnosticQuestions: [
      { question: 'What charge does a proton carry?', options: ['Positive', 'Negative', 'Neutral', 'No charge'], correctIndex: 0, explanation: 'Protons are positively charged.' },
      { question: 'What charge does an electron carry?', options: ['Negative', 'Positive', 'Neutral', 'No charge'], correctIndex: 0, explanation: 'Electrons are negatively charged.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Charging NEVER creates new charge — it TRANSFERS electrons from one object to another. There are three charging methods: FRICTION (rubbing two objects together transfers electrons from one to the other); CONTACT (touching a charged object to a neutral one shares charge between them); INDUCTION (bringing a charged object NEAR — not touching — a neutral object causes electrons within it to redistribute). A NEUTRAL object has EQUAL positive and negative charge, not an absence of charge.',
    workedExamples: [
      { id: 'wx-friction-charging', prompt: 'A glass rod is rubbed with silk. The rod becomes positively charged. Explain what happened.', steps: [
        { step: 'Rubbing transfers electrons between the two materials — one gains electrons, the other loses them.', justification: 'Friction charging works through electron transfer.' },
        { step: 'Since the rod became positively charged, it must have LOST electrons (fewer negative charges means a net positive charge) — the silk gained them.', justification: 'A positive charge results from losing electrons, not gaining protons.' },
      ], answer: 'The rod lost electrons to the silk during rubbing' },
      { id: 'wx-induction', prompt: 'A negatively charged rod is brought near (not touching) a neutral metal sphere. What happens to the electrons in the sphere?', steps: [
        { step: 'The rod\'s negative charge repels the sphere\'s free electrons (like charges repel).', justification: 'Electrons in the metal are free to move.' },
        { step: 'Electrons shift to the far side of the sphere, away from the rod — the near side becomes relatively positive, the far side relatively negative, with NO net charge change (still neutral overall) and no contact occurred.', justification: 'This redistribution, without contact, is induction.' },
      ], answer: 'Electrons redistribute within the sphere, away from the rod, without any contact' },
    ],
    knowledgeChecks: [
      { question: 'When two objects are charged by friction, what actually happens?', options: ['Electrons transfer from one object to the other', 'New charge is created', 'Protons transfer between objects', 'Charge disappears'], correctIndex: 0, explanation: 'Friction charging works by electron transfer, not creation.', misconceptionId: 'charge-created-not-transferred' },
      { question: 'Does charging by induction require the charged and neutral objects to touch?', options: ['No — induction works without contact', 'Yes, contact is always required', 'Only for negative charges', 'Only for positive charges'], correctIndex: 0, explanation: 'Induction specifically works through nearby (not touching) charge redistribution.', misconceptionId: 'induction-requires-contact' },
    ],
    confidenceCheckPrompt: 'How confident do you feel explaining the three charging methods?',
  },

  demonstrateChunk2: {
    explanation:
      'The fundamental rule: LIKE charges (both positive, or both negative) REPEL each other; UNLIKE charges (one positive, one negative) ATTRACT each other. An ELECTRIC FIELD is the region of space around a charged object where another charge would experience a force — fields are often drawn as arrows/lines pointing away from positive charges and toward negative charges, showing the direction a small positive test charge would be pushed.',
    workedExamples: [
      { id: 'wx-charge-interaction', prompt: 'Two balloons are both negatively charged after rubbing on hair. What happens when they\'re brought close together?', steps: [
        { step: 'Both balloons carry the same (negative) charge — like charges.', justification: 'Identify that both charges are the same sign.' },
        { step: 'Like charges repel, so the balloons push apart.', justification: 'Apply the fundamental charge interaction rule.' },
      ], answer: 'They repel (push apart)' },
      { id: 'wx-electric-field', prompt: 'Describe the electric field direction around a single positive point charge.', steps: [
        { step: 'A small positive test charge placed near it would be pushed AWAY (like charges repel).', justification: 'Use a positive test charge to determine field direction by convention.' },
        { step: 'So the field lines point radially OUTWARD, away from the positive charge in all directions.', justification: 'Field direction follows the force on a positive test charge.' },
      ], answer: 'Field lines point outward, away from the positive charge' },
    ],
    knowledgeChecks: [
      { question: 'A positively charged rod is brought near a negatively charged ball. What happens?', options: ['They attract', 'They repel', 'Nothing happens', 'The charges cancel instantly on contact only'], correctIndex: 0, explanation: 'Unlike charges (positive and negative) attract.', misconceptionId: 'like-charges-attract-confused' },
      { question: 'A neutral object is placed in an electric field. What is true about its overall charge?', options: ['It still has equal positive and negative charge, just possibly redistributed', 'It has no charges at all present', 'It becomes permanently charged', 'It cannot be affected by fields'], correctIndex: 0, explanation: 'Neutral means balanced charge, not absent charge.', misconceptionId: 'neutral-object-has-no-charges' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying charge interaction rules and describing electric fields?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-charge-interaction-rules', revealSteps: 1, prompt: 'Two objects, one positive and one negative, are brought close together. What happens?', steps: [
        { step: 'Unlike charges attract, so they pull toward each other.', justification: 'Apply the interaction rule.' },
      ], answer: 'They attract' },
      { id: 'fp-partial-1', objectiveId: 'explain-charging-methods', revealSteps: 1, prompt: 'A charged balloon is touched briefly to a neutral metal doorknob. What charging method is this, and what happens?', steps: [
        { step: 'Direct contact between a charged and neutral object.', justification: 'This matches the definition of charging by contact.' },
        { step: 'Charge is shared between the two objects until they reach a similar charge level.', justification: 'Contact charging redistributes charge between touching objects.' },
      ], answer: 'Charging by contact — charge is shared between the balloon and doorknob' },
      { id: 'fp-independent-1', objectiveId: 'explain-charge-conservation', revealSteps: 0, prompt: 'A plastic ruler rubbed with a cloth becomes negatively charged. What happened to the cloth\'s charge, and why?', steps: [
        { step: 'The ruler gained electrons (becoming negative), so the cloth must have LOST the same number of electrons, becoming positively charged.', justification: 'Charge is conserved — what one object gains, the other loses.' },
      ], answer: 'The cloth became positively charged, having lost electrons to the ruler' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'explain-charging-methods', question: 'Which charging method involves NO physical contact between the charged and neutral object?', options: ['Induction', 'Friction', 'Contact', 'All require contact'], correctIndex: 0, hints: { strategic: 'Which method works just by bringing a charge NEAR, not touching?', procedural: 'Induction.', workedStep: 'Induction requires no contact.' }, distractorMisconceptions: { 2: 'induction-requires-contact' } },
      { id: 'ip-2', objectiveId: 'apply-charge-interaction-rules', question: 'Two positively charged spheres are brought near each other. What happens?', options: ['They repel', 'They attract', 'Nothing happens', 'They become neutral'], correctIndex: 0, hints: { strategic: 'Are these like or unlike charges?', procedural: 'Both positive — like charges.', workedStep: 'They repel.' }, distractorMisconceptions: { 1: 'like-charges-attract-confused' } },
      { id: 'ip-3', objectiveId: 'explain-charge-conservation', question: 'When an object is charged by friction, where does its new charge come from?', options: ['Electrons transferred from the other object it was rubbed against', 'It is newly created from nothing', 'It comes from the air', 'It was always there, just hidden'], correctIndex: 0, hints: { strategic: 'Charge transfers, it doesn\'t appear from nowhere.', procedural: 'Electrons move between the two rubbed objects.', workedStep: 'Transferred from the other object.' }, distractorMisconceptions: { 1: 'charge-created-not-transferred' } },
      { id: 'ip-4', objectiveId: 'describe-electric-field-concept', question: 'Which direction do electric field lines point around a negative charge?', options: ['Inward, toward the negative charge', 'Outward, away from the negative charge', 'They don\'t exist around negative charges', 'Sideways only'], correctIndex: 0, hints: { strategic: 'A positive test charge would be attracted toward a negative charge.', procedural: 'Field lines point in the direction a positive test charge would move.', workedStep: 'Inward, toward the negative charge.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'explain-charge-conservation', multiSelect: false, question: 'True or false: charging an object by rubbing creates brand new electric charge.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — charging transfers existing charge (electrons), it never creates new charge.', distractorMisconceptions: { 0: 'charge-created-not-transferred' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'explain-charging-methods', multiSelect: false, question: 'A charged rod touches a neutral sphere, and charge spreads between them. What method is this?', options: ['Contact', 'Friction', 'Induction', 'None of these'], correctIndices: [0], explanation: 'Direct contact and charge-sharing defines charging by contact.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'explain-charging-methods', multiSelect: false, question: 'True or false: induction requires the charged and neutral object to touch.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — induction specifically works without contact.', distractorMisconceptions: { 0: 'induction-requires-contact' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'apply-charge-interaction-rules', multiSelect: false, question: 'Two negatively charged objects are brought close together. What happens?', options: ['They repel', 'They attract', 'Nothing happens', 'They become positive'], correctIndices: [0], explanation: 'Like charges (both negative) repel.', distractorMisconceptions: { 1: 'like-charges-attract-confused' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'apply-charge-interaction-rules', multiSelect: false, question: 'A positive charge and a negative charge are brought close together. What happens?', options: ['They attract', 'They repel', 'Nothing happens', 'They become neutral instantly at any distance'], correctIndices: [0], explanation: 'Unlike charges attract.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'explain-charge-conservation', multiSelect: false, question: 'True or false: a neutral object contains no charges at all, positive or negative.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a neutral object has equal positive and negative charge, not an absence of charge.', distractorMisconceptions: { 0: 'neutral-object-has-no-charges' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'describe-electric-field-concept', multiSelect: false, question: 'What does an electric field describe?', options: ['The region around a charge where another charge would feel a force', 'The exact path an object must follow', 'A type of charging method', 'The temperature around a charged object'], correctIndices: [0], explanation: 'An electric field describes the region of influence around a charge.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'explain-charging-methods', multiSelect: true, question: 'Which of these are genuine methods of charging an object? (select all that apply)', options: ['Friction', 'Contact', 'Induction', 'Evaporation'], correctIndices: [0, 1, 2], explanation: 'Friction, contact, and induction are the three real charging methods. Evaporation is not a charging method.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-charge-interaction-rules',
      analogy: 'Think of charges like magnets in a simplified sense: same poles push apart, opposite poles pull together. "Like charges repel, unlike charges attract" is exactly this same pattern, just for electric charge instead of magnetic poles.',
      explanation: 'Before predicting what happens between two charges, identify the SIGN of each (both positive? both negative? one of each?), then apply: same sign = repel, different sign = attract.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'A positively charged balloon and a positively charged rod are brought close. What happens?', steps: [
          { step: 'Both are positive — same sign.', justification: 'Identify both signs.' },
          { step: 'Same sign means repel.', justification: 'Apply the rule.' },
        ], answer: 'They repel' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-charge-interaction-rules', question: 'A negative rod and a positive ball are brought close. What happens?', options: ['They attract', 'They repel', 'Nothing happens', 'They both become neutral'], correctIndex: 0, hints: { strategic: 'Are these the same sign or different?', procedural: 'Different (negative and positive).', workedStep: 'Different sign means attract.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'apply-charge-interaction-rules', question: 'Two negatively charged combs are brought close together. What happens?', options: ['They repel', 'They attract', 'Nothing happens', 'They swap charges'], correctIndex: 0, hints: { strategic: 'Same sign or different?', procedural: 'Both negative — same sign.', workedStep: 'Same sign means repel.' }, distractorMisconceptions: { 1: 'like-charges-attract-confused' } },
        { id: 'rem-p3', objectiveId: 'apply-charge-interaction-rules', question: 'A neutral piece of paper is brought near a charged balloon. What tends to happen (via induction)?', options: ['The paper is attracted to the balloon', 'The paper is repelled from the balloon', 'Nothing happens at all', 'The paper becomes permanently charged'], correctIndex: 0, hints: { strategic: 'The balloon induces a redistribution of charge in the paper, creating an attraction on the near side.', procedural: 'The near side of the paper becomes oppositely charged to the balloon.', workedStep: 'Attraction, via induction.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'How is charging by induction different from charging by contact?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel with electrostatics now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What happens to electrons (not "charge" in the abstract) when an object is charged by friction?', type: 'multiple-choice', options: ['They transfer from one object to the other', 'They are destroyed', 'They multiply', 'Nothing happens to them'] },
  ],
};
