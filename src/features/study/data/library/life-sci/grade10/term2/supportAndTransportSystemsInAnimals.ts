// ── Life Sciences, Term 2, Topic 3: Support and Transport Systems in Animals ─
// Closes the "Life Processes in Plants and Animals" strand for Grade 10.
// Builds on Support and Transport Systems in Plants (this term). Introductory
// Grade 10 scope: the human skeletal system (support), and the human
// circulatory system (heart, vessels, blood, double circulation).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'bones-considered-dead-tissue',
    label: 'Believing bones are dead, inert material with no living cells',
    errorType: 'You described bone as non-living or inert, like a rock, rather than as living tissue.',
    principle: 'Bone is a LIVING connective tissue — it contains living bone cells, has its own blood supply, and is constantly being remodelled (broken down and rebuilt) throughout life. Bone only appears hard and static from the outside; internally it is biologically active.',
    correctStep: 'A broken bone can heal and regrow because it contains living cells and blood vessels — a truly dead, inert material like a rock could never repair itself this way.',
  },
  {
    id: 'arteries-veins-confused-by-oxygen',
    label: 'Assuming all arteries carry oxygenated blood and all veins carry deoxygenated blood',
    errorType: 'You classified a blood vessel as an artery or vein based on whether it carries oxygenated or deoxygenated blood, without checking direction relative to the heart.',
    principle: 'ARTERIES are defined by carrying blood AWAY FROM the heart; VEINS are defined by carrying blood TOWARD the heart — this is about DIRECTION, not oxygen content. Most arteries carry oxygenated blood and most veins carry deoxygenated blood, BUT the pulmonary artery (heart to lungs) carries DEOXYGENATED blood, and the pulmonary vein (lungs to heart) carries OXYGENATED blood — exceptions that prove direction, not oxygen content, is the true definition.',
    correctStep: 'The pulmonary artery carries deoxygenated blood from the heart to the lungs — it is still classified as an artery because of its direction (away from the heart), not its oxygen content.',
  },
  {
    id: 'capillaries-seen-as-large-vessels',
    label: 'Picturing capillaries as large, visible blood vessels like arteries or veins',
    errorType: 'You described or imagined capillaries as similarly sized to arteries and veins, rather than as microscopic vessels.',
    principle: 'CAPILLARIES are microscopic blood vessels, only ONE CELL THICK in their walls, connecting the smallest arteries to the smallest veins. Their thin walls and tiny size are essential for their function: allowing efficient exchange of gases, nutrients, and waste between blood and body tissues.',
    correctStep: 'Oxygen can diffuse out of a capillary into surrounding tissue precisely because the capillary wall is only one cell thick — this exchange could not happen efficiently through the thicker walls of an artery or vein.',
  },
  {
    id: 'double-circulation-misunderstood',
    label: 'Misunderstanding the two-loop structure of double circulation',
    errorType: 'You described blood flow through the body as a single loop, or confused the pulmonary and systemic circuits.',
    principle: 'Humans have DOUBLE CIRCULATION: blood passes through the heart TWICE per full circuit. The PULMONARY circuit carries deoxygenated blood from the heart to the lungs (to pick up oxygen) and oxygenated blood back to the heart. The SYSTEMIC circuit then carries this oxygenated blood from the heart to the rest of the body, and deoxygenated blood back to the heart.',
    correctStep: 'Blood returning from the lungs (oxygenated, via the pulmonary circuit) must pass back through the heart before being pumped out again to the rest of the body (systemic circuit) — it does not go directly from lungs to body.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'life-sci',
  grade: 10,
  term: 2,
  topicId: 'support-and-transport-systems-in-animals',
  topicName: 'Support and Transport Systems in Animals',
  prerequisites: [
    'Support and Transport Systems in Plants (this term, Topic 2)',
    'Plant and Animal Tissues (this term, Topic 1)',
  ],
  objectives: [
    { id: 'describe-skeletal-support-functions', text: 'Describe the functions of the human skeletal system, including that bone is living tissue.' },
    { id: 'classify-blood-vessels', text: 'Classify blood vessels (arteries, veins, capillaries) by structure and function, not oxygen content alone.' },
    { id: 'explain-double-circulation', text: 'Explain the double circulation pathway of blood through the human heart, lungs, and body.' },
  ],
  estimatedMinutes: [25, 35],
};

export const supportAndTransportSystemsInAnimals: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'Your blood passes through your heart twice on every single trip around your body. Why would a two-pump system be better than just one loop?',
  goalSettingPrompt:
    'Animals need both a rigid framework to support and protect the body, and an efficient system to move substances throughout it. By the end of this lesson you\'ll be able to describe the skeletal system\'s roles, classify blood vessels correctly, and explain the double circulation pathway.',

  activate: {
    connectPrompt: 'You already know blood is a connective tissue (from Plant and Animal Tissues) — this lesson looks at exactly how it moves through the body, and what keeps the body\'s frame supported.',
    diagnosticQuestions: [
      { question: 'Is bone living tissue, or inert dead material?', options: ['Living tissue, with living cells and blood supply', 'Completely dead and inert', 'Half living, half dead permanently', 'It depends on age only'], correctIndex: 0, explanation: 'Bone is a living connective tissue that can grow, repair, and remodel.' },
      { question: 'Are arteries and veins classified by oxygen content, or by direction relative to the heart?', options: ['Direction relative to the heart', 'Oxygen content only', 'Blood vessel size only', 'Neither — they are the same thing'], correctIndex: 0, explanation: 'Arteries carry blood away from the heart; veins carry it toward the heart — this is about direction, not oxygen content.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'The human SKELETAL SYSTEM provides SUPPORT (framework for the body), PROTECTION (e.g. skull protects the brain, ribcage protects the heart/lungs), and enables MOVEMENT (bones act as levers at joints, moved by attached muscles). Importantly, BONE is a LIVING connective tissue — it contains living bone cells, has its own blood supply, and constantly remodels itself throughout life, unlike inert, non-living materials. JOINTS are the points where bones meet, allowing movement (though Grade 10 focuses more on structural understanding than detailed joint mechanics).',
    workedExamples: [
      { id: 'wx-bone-living', prompt: 'Explain why a broken bone is able to heal and repair itself over time.', steps: [
        { step: 'Bone is a living tissue, containing living bone cells and its own blood supply.', justification: 'Only living tissue with active cells and blood supply can carry out repair processes.' },
        { step: 'These living cells can produce new bone material at the break site, gradually repairing the fracture — something inert, dead material could never do.', justification: 'Repair requires active cellular processes, confirming bone is living tissue.' },
      ], answer: 'Bone contains living cells and blood supply, allowing it to actively repair fractures' },
      { id: 'wx-skeletal-functions', prompt: 'Name three functions of the human skeletal system, with an example of each.', steps: [
        { step: 'Support: the spine and legs provide the body\'s overall framework, holding it upright.', justification: 'Support is a primary skeletal function, providing structural framework.' },
        { step: 'Protection: the skull protects the brain, and the ribcage protects the heart and lungs.', justification: 'Certain bones are specifically shaped to shield vulnerable organs.' },
        { step: 'Movement: bones act as levers, moved by muscles attached at joints, e.g. the arm bones moving when muscles contract.', justification: 'Bones and muscles work together at joints to enable movement.' },
      ], answer: 'Support (spine/legs), Protection (skull/ribcage), Movement (bones as levers at joints)' },
    ],
    knowledgeChecks: [
      { question: 'Is bone a living or non-living material?', options: ['Living — it contains cells and blood supply', 'Non-living, like a rock', 'Living only in children, not adults', 'It has no cells at all'], correctIndex: 0, explanation: 'Bone is a living connective tissue throughout life.', misconceptionId: 'bones-considered-dead-tissue' },
      { question: 'Which skeletal structure protects the brain?', options: ['The skull', 'The ribcage', 'The spine', 'The pelvis'], correctIndex: 0, explanation: 'The skull is specifically shaped to protect the brain.' },
    ],
    confidenceCheckPrompt: 'How confident do you feel describing the skeletal system\'s functions, including that bone is living tissue?',
  },

  demonstrateChunk2: {
    explanation:
      'The human CIRCULATORY SYSTEM consists of the HEART (a muscular pump), BLOOD VESSELS, and BLOOD. Blood vessels are classified by DIRECTION relative to the heart, not oxygen content: ARTERIES carry blood AWAY from the heart (usually oxygenated, except the pulmonary artery); VEINS carry blood TOWARD the heart (usually deoxygenated, except the pulmonary vein); CAPILLARIES are microscopic, one-cell-thick vessels connecting arteries to veins, allowing exchange of gases/nutrients/waste with tissues. Humans have DOUBLE CIRCULATION: the PULMONARY circuit moves blood between the heart and lungs (picking up oxygen), and the SYSTEMIC circuit moves blood between the heart and the rest of the body (delivering oxygen) — blood passes through the heart twice per full circuit.',
    workedExamples: [
      { id: 'wx-vessel-classification', prompt: 'The pulmonary artery carries deoxygenated blood from the heart to the lungs. Is it correctly classified as an artery, despite carrying deoxygenated blood?', steps: [
        { step: 'Arteries are classified by direction — carrying blood AWAY from the heart — not by oxygen content.', justification: 'Vessel classification depends on direction relative to the heart, not what the blood is carrying.' },
        { step: 'Since the pulmonary artery carries blood away from the heart (toward the lungs), it is correctly classified as an artery, even though this particular blood is deoxygenated.', justification: 'This is the key exception showing direction, not oxygen content, defines artery vs vein.' },
      ], answer: 'Yes — it is correctly an artery, because classification is based on direction, not oxygen content' },
      { id: 'wx-double-circulation', prompt: 'Trace the path of a blood cell from the lungs, through the heart, to a muscle in the leg, and describe which circuit(s) are involved.', steps: [
        { step: 'The blood cell leaves the lungs (oxygenated) via the pulmonary vein, entering the heart — this completes the pulmonary circuit.', justification: 'The pulmonary circuit runs between the heart and lungs.' },
        { step: 'The heart then pumps this oxygenated blood out to the leg muscle via the systemic circuit (through arteries, capillaries).', justification: 'The systemic circuit runs between the heart and the rest of the body.' },
      ], answer: 'The blood passes through both the pulmonary circuit (lungs → heart) and then the systemic circuit (heart → leg muscle)' },
    ],
    knowledgeChecks: [
      { question: 'Are all veins carrying deoxygenated blood, with no exceptions?', options: ['No — the pulmonary vein carries oxygenated blood', 'Yes, always', 'Veins never carry blood', 'Only leg veins are exceptions'], correctIndex: 0, explanation: 'The pulmonary vein is a key exception, carrying oxygenated blood from lungs to heart.', misconceptionId: 'arteries-veins-confused-by-oxygen' },
      { question: 'Why are capillary walls only one cell thick?', options: ['To allow efficient exchange of substances with tissues', 'To make them stronger than arteries', 'It has no functional purpose', 'To store more blood'], correctIndex: 0, explanation: 'Thin walls allow efficient diffusion of gases, nutrients, and waste.', misconceptionId: 'capillaries-seen-as-large-vessels' },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying blood vessels and explaining double circulation?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'describe-skeletal-support-functions', revealSteps: 1, prompt: 'Explain why the ribcage is well-suited to its protective function.', steps: [
        { step: 'The ribcage forms a rigid, curved cage of bone around the heart and lungs, shielding them from external impact while still allowing the chest to expand slightly for breathing.', justification: 'Its rigid but slightly flexible structure balances protection with the need for lung expansion.' },
      ], answer: 'Its rigid, curved bone structure shields the heart and lungs from impact' },
      { id: 'fp-partial-1', objectiveId: 'classify-blood-vessels', revealSteps: 1, prompt: 'A blood vessel carries oxygenated blood away from the heart to the body. Classify it, and explain why oxygen content alone would be a misleading way to classify it.', steps: [
        { step: 'This vessel is classified as an artery, since it carries blood away from the heart.', justification: 'Direction relative to the heart is the correct classification criterion.' },
        { step: 'Oxygen content is misleading because the pulmonary artery carries deoxygenated blood while still being an artery — so oxygen content is not a reliable classifier.', justification: 'The pulmonary artery is the clear exception showing why direction, not oxygen content, must be used.' },
      ], answer: 'It is an artery; oxygen content is unreliable because of exceptions like the pulmonary artery' },
      { id: 'fp-independent-1', objectiveId: 'explain-double-circulation', revealSteps: 0, prompt: 'In one sentence, explain why the pulmonary and systemic circuits together are called "double circulation".', steps: [
        { step: 'Blood passes through the heart twice in one full loop around the body — once for the pulmonary circuit (to the lungs) and once for the systemic circuit (to the body) — hence "double" circulation.', justification: 'The defining feature of double circulation is blood passing through the heart twice per full circuit.' },
      ], answer: 'Blood passes through the heart twice per full circuit — once for each of the two circuits' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'describe-skeletal-support-functions', question: 'Why can a broken bone heal itself, unlike a broken rock?', options: ['Bone is living tissue with cells and blood supply', 'Bones are not actually solid', 'Rocks are also living material', 'Bones never actually break'], correctIndex: 0, hints: { strategic: 'Think about what living tissue can do that non-living material cannot.', procedural: 'Bone\'s living cells enable active repair.', workedStep: 'Bone is living tissue with cells and blood supply.' }, distractorMisconceptions: { 1: 'bones-considered-dead-tissue' } },
      { id: 'ip-2', objectiveId: 'classify-blood-vessels', question: 'Which blood vessel type has walls only one cell thick, allowing exchange with tissues?', options: ['Capillaries', 'Arteries', 'Veins', 'The heart itself'], correctIndex: 0, hints: { strategic: 'Think about which vessels are microscopic.', procedural: 'Capillaries\' thin walls enable efficient exchange.', workedStep: 'Capillaries.' }, distractorMisconceptions: { 1: 'capillaries-seen-as-large-vessels' } },
      { id: 'ip-3', objectiveId: 'classify-blood-vessels', question: 'What is the correct basis for classifying a vessel as an artery or a vein?', options: ['Direction relative to the heart', 'Oxygen content only', 'Vessel size only', 'Colour of the blood'], correctIndex: 0, hints: { strategic: 'Think about the pulmonary artery/vein exception.', procedural: 'Direction (away from vs toward the heart) is the true classifier.', workedStep: 'Direction relative to the heart.' }, distractorMisconceptions: { 1: 'arteries-veins-confused-by-oxygen' } },
      { id: 'ip-4', objectiveId: 'explain-double-circulation', question: 'After blood picks up oxygen in the lungs, where must it go before reaching the rest of the body?', options: ['Back through the heart first', 'Directly to the body, bypassing the heart', 'Directly to the capillaries', 'It stays in the lungs'], correctIndex: 0, hints: { strategic: 'Think about the two-loop structure of double circulation.', procedural: 'Blood always returns to the heart between the pulmonary and systemic circuits.', workedStep: 'Back through the heart first.' }, distractorMisconceptions: { 1: 'double-circulation-misunderstood' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'describe-skeletal-support-functions', multiSelect: false, question: 'True or false: bone is a non-living, inert material.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — bone is a living connective tissue with cells and blood supply.', distractorMisconceptions: { 0: 'bones-considered-dead-tissue' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'describe-skeletal-support-functions', multiSelect: false, question: 'Which skeletal function is demonstrated by the skull protecting the brain?', options: ['Protection', 'Movement', 'Blood cell production only', 'Digestion'], correctIndices: [0], explanation: 'Shielding vulnerable organs is the protective function of the skeleton.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'classify-blood-vessels', multiSelect: false, question: 'What determines whether a vessel is classified as an artery or a vein?', options: ['Direction of blood flow relative to the heart', 'Oxygen content of the blood', 'The vessel\'s colour', 'The vessel\'s length'], correctIndices: [0], explanation: 'Direction relative to the heart is the defining classification criterion.', distractorMisconceptions: { 1: 'arteries-veins-confused-by-oxygen' } },
    { id: 'q4', type: 'true-false', objectiveId: 'classify-blood-vessels', multiSelect: false, question: 'True or false: the pulmonary artery carries oxygenated blood, just like most other arteries.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the pulmonary artery is an exception, carrying deoxygenated blood.', distractorMisconceptions: { 0: 'arteries-veins-confused-by-oxygen' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'classify-blood-vessels', multiSelect: false, question: 'Why are capillary walls only one cell thick?', options: ['To allow efficient exchange of substances with surrounding tissue', 'To make them stronger', 'To store extra blood', 'It has no functional significance'], correctIndices: [0], explanation: 'Thin walls enable efficient diffusion between blood and tissue.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'explain-double-circulation', multiSelect: false, question: 'What are the two circuits in human double circulation?', options: ['Pulmonary and systemic', 'Arterial and venous only', 'Upper and lower body', 'Left and right lung circuits'], correctIndices: [0], explanation: 'Double circulation consists of the pulmonary and systemic circuits.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'explain-double-circulation', multiSelect: false, question: 'True or false: blood travels directly from the lungs to the rest of the body, without passing through the heart again.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — blood must pass back through the heart between the pulmonary and systemic circuits.', distractorMisconceptions: { 0: 'double-circulation-misunderstood' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'classify-blood-vessels', multiSelect: true, question: 'Which of these statements about blood vessels are correct? (select all that apply)', options: ['Arteries carry blood away from the heart', 'Veins carry blood toward the heart', 'All arteries carry oxygenated blood with no exceptions', 'Capillaries are microscopic, one-cell-thick vessels'], correctIndices: [0, 1, 3], explanation: 'The first, second, and fourth statements are correct; the third is false due to the pulmonary artery exception.', distractorMisconceptions: { 2: 'arteries-veins-confused-by-oxygen' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'explain-double-circulation',
      analogy: 'Think of double circulation like a delivery van that must return to a central depot (the heart) between every delivery route. First it does a short "supply run" to a nearby warehouse (the lungs, to pick up oxygen), returns to the depot, then sets out on a long "delivery route" to customers all over the city (the body) before returning to the depot again.',
      explanation: 'To trace double circulation: (1) deoxygenated blood enters the heart from the body, (2) the heart pumps it to the lungs via the pulmonary circuit, where it picks up oxygen, (3) oxygenated blood returns to the heart, (4) the heart then pumps this oxygenated blood to the rest of the body via the systemic circuit, (5) deoxygenated blood returns to the heart, and the cycle repeats.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Blood has just been pumped from the heart to the lungs. Is this part of the pulmonary or systemic circuit, and what will happen to the blood\'s oxygen content?', steps: [
          { step: 'Heart-to-lungs movement is specifically the pulmonary circuit.', justification: 'The pulmonary circuit is defined as the heart-lungs loop.' },
          { step: 'In the lungs, the blood will pick up oxygen, becoming oxygenated before returning to the heart.', justification: 'The lungs are where gas exchange occurs, increasing the blood\'s oxygen content.' },
        ], answer: 'Pulmonary circuit; the blood will become oxygenated in the lungs' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'explain-double-circulation', question: 'Oxygenated blood is being pumped from the heart to leg muscles. Which circuit is this?', options: ['Systemic circuit', 'Pulmonary circuit', 'Neither', 'Both simultaneously'], correctIndex: 0, hints: { strategic: 'Think about heart-to-body movement.', procedural: 'Heart-to-body-tissue movement is the systemic circuit.', workedStep: 'Systemic circuit.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'explain-double-circulation', question: 'How many times does blood pass through the heart during one complete double-circulation loop?', options: ['Twice', 'Once', 'Three times', 'It never passes through the heart'], correctIndex: 0, hints: { strategic: 'Think about the meaning of "double" circulation.', procedural: 'Once for the pulmonary circuit, once for the systemic circuit.', workedStep: 'Twice.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'explain-double-circulation', question: 'Deoxygenated blood arrives at the heart from the body. Where does the heart send it next?', options: ['To the lungs, via the pulmonary circuit', 'Directly back to the body', 'To the brain only', 'Nowhere — it stays in the heart'], correctIndex: 0, hints: { strategic: 'Deoxygenated blood needs to pick up oxygen.', procedural: 'The heart sends deoxygenated blood to the lungs first.', workedStep: 'To the lungs, via the pulmonary circuit.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is it more accurate to classify blood vessels by direction rather than by oxygen content?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel describing the skeletal system and explaining double circulation now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the key exception that shows arteries/veins are classified by direction, not oxygen content?', type: 'multiple-choice', options: ['The pulmonary artery and vein', 'Capillaries', 'The skull', 'Bone marrow'] },
  ],
};
