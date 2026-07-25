// ── Geometry, Term 4, Topic 3: Quadrilateral Properties and Proofs ───────────
// Builds on Topics 1-2 (lines/angles, triangles). Parallelogram-family
// properties and classification via converses.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'quadrilateral-misclassified-by-appearance',
    label: 'Classifying a quadrilateral by how it looks, not by its actual properties',
    errorType: 'You called a quadrilateral a parallelogram (or rhombus, etc.) just because it looked roughly that shape.',
    principle: 'A quadrilateral\'s classification must be justified by its GIVEN or PROVEN properties (equal sides, parallel sides, equal angles) — never by visual appearance alone.',
    correctStep: 'A "diamond-looking" shape is only a rhombus if you can show (given or proven) that all four sides are equal — not just because it looks like one.',
  },
  {
    id: 'property-used-before-classification-proved',
    label: 'Using a shape\'s properties before actually proving it belongs to that category',
    errorType: 'You used a property like "opposite sides are equal" before establishing that the quadrilateral is actually a parallelogram.',
    principle: 'Properties (like "opposite sides of a parallelogram are equal") can only be used once you\'ve established the quadrilateral IS that shape — either given, or already proved earlier in the same proof.',
    correctStep: 'Don\'t write "opposite sides are equal" as a mid-proof step unless "ABCD is a parallelogram" was already given or proved in an earlier line.',
  },
  {
    id: 'quadrilateral-converse-misapplied',
    label: 'Misapplying a converse (e.g. concluding parallelogram from only ONE pair of equal sides)',
    errorType: 'You applied a classification converse using incomplete information.',
    principle: 'Each converse has a precise condition: "opposite sides equal" means BOTH pairs, not just one. Check you actually have everything the converse requires before applying it.',
    correctStep: 'To conclude "ABCD is a parallelogram" from "opposite sides equal," you need BOTH AB=CD AND AD=BC — not just one pair.',
  },
  {
    id: 'quadrilateral-circular-reasoning',
    label: 'Assuming the classification you are trying to prove',
    errorType: 'You used the conclusion you were meant to prove as if it were already established.',
    principle: 'Never use "ABCD is a parallelogram" as a REASON if that is what you are supposed to be PROVING — build up to it from given facts, not backward from the answer.',
    correctStep: 'If asked to prove ABCD is a parallelogram, don\'t write "opposite sides equal (parallelogram property)" as your first step — that assumes what you\'re proving.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'geometry',
  grade: 10,
  term: 4,
  topicId: 'quadrilateral-properties',
  topicName: 'Quadrilateral Properties and Proofs',
  prerequisites: [
    'Lines and angles (this term, Topic 1)',
    'Triangle properties and congruency (this term, Topic 2)',
  ],
  objectives: [
    { id: 'know-quadrilateral-properties', text: 'State the defining properties of parallelograms, rectangles, rhombi, and squares.' },
    { id: 'prove-parallelogram-properties', text: 'Prove basic properties of a parallelogram using triangle congruency.' },
    { id: 'classify-via-converse', text: 'Use converse theorems to classify a quadrilateral (e.g. prove it is a parallelogram).' },
    { id: 'avoid-circular-quadrilateral-proof', text: 'Structure a classification proof without circular reasoning.' },
  ],
  estimatedMinutes: [20, 30],
};

export const quadrilateralProperties: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What actually makes a shape a parallelogram — not just look like one?',
  goalSettingPrompt:
    'Every quadrilateral family (parallelogram, rectangle, rhombus, square) is defined by precise properties — not by appearance. By the end of this lesson you\'ll be able to prove basic quadrilateral properties and use converses to classify a shape correctly.',

  activate: {
    connectPrompt: 'You already know triangle congruency criteria — quadrilateral proofs often use triangles formed by a diagonal.',
    diagnosticQuestions: [
      { question: 'What congruency criterion applies when two triangles share three equal sides?', options: ['SSS', 'SAS', 'ASA', 'RHS'], correctIndex: 0, explanation: 'Three equal sides = SSS.' },
      { question: 'What do the interior angles of a quadrilateral sum to?', options: ['360°', '180°', '270°', '540°'], correctIndex: 0, explanation: 'A quadrilateral\'s interior angles sum to 360° (two triangles\' worth).' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A PARALLELOGRAM is defined by opposite sides being parallel. From this definition, several properties can be PROVED (not assumed): opposite sides are equal, opposite angles are equal, and diagonals bisect each other — often proved using a diagonal to split the parallelogram into two congruent triangles. A RECTANGLE is a parallelogram with all angles 90°. A RHOMBUS is a parallelogram with all sides equal. A SQUARE is both. Classification must always rest on given or PROVEN properties, never on appearance.',
    workedExamples: [
      { id: 'wx-parallelogram-sides-proof', prompt: 'Given: ABCD is a parallelogram (AB∥CD, AD∥BC). Prove AB=CD and AD=BC.', steps: [
        { step: 'AB∥CD and AD∥BC (given), draw diagonal AC.', justification: 'A diagonal splits the parallelogram into two triangles.' },
        { step: '∠BAC = ∠DCA (alt ∠s, AB∥CD) and ∠BCA = ∠DAC (alt ∠s, AD∥BC).', justification: 'Alternate angles, using each pair of parallel sides in turn.' },
        { step: 'AC = AC (common side). So △ABC ≡ △CDA (ASA).', justification: 'Two angles and the included side (the shared diagonal) match ASA.' },
        { step: '∴ AB=CD and BC=AD (corresponding sides of congruent triangles).', justification: 'Congruent triangles have all corresponding parts equal.' },
      ], answer: 'AB=CD, AD=BC — proved via congruent triangles formed by the diagonal', diagram: {
        points: [{ id: 'A', x: 20, y: 20, label: 'A' }, { id: 'B', x: 110, y: 20, label: 'B' }, { id: 'C', x: 130, y: 100, label: 'C' }, { id: 'D', x: 40, y: 100, label: 'D' }],
        segments: [{ from: 'A', to: 'B', parallelMarks: 1 }, { from: 'D', to: 'C', parallelMarks: 1 }, { from: 'A', to: 'D', parallelMarks: 2 }, { from: 'B', to: 'C', parallelMarks: 2 }, { from: 'A', to: 'C', dashed: true }],
      } },
    ],
    knowledgeChecks: [
      { question: 'Which quadrilateral is defined as a parallelogram with all four sides equal?', options: ['Rhombus', 'Rectangle', 'Trapezium', 'Kite'], correctIndex: 0, explanation: 'A rhombus is a parallelogram with all sides equal.', misconceptionId: 'quadrilateral-misclassified-by-appearance' },
      { question: 'In the proof that AB=CD in a parallelogram, why can\'t you just say "opposite sides of a parallelogram are equal" as the whole proof?', options: ['That is the property being proved — you must derive it from more basic facts first', 'It is actually a valid one-line proof', 'Parallelograms don\'t have this property', 'The property only applies to rectangles'], correctIndex: 0, explanation: 'Using the property you\'re trying to prove as your own justification is circular reasoning.', misconceptionId: 'quadrilateral-circular-reasoning' },
    ],
    confidenceCheckPrompt: 'How confident do you feel proving basic parallelogram properties using triangle congruency?',
  },

  demonstrateChunk2: {
    explanation:
      'CONVERSE theorems let you classify a quadrilateral FROM its properties: if opposite sides are equal (BOTH pairs), the quadrilateral IS a parallelogram. If opposite sides are parallel (BOTH pairs), it IS a parallelogram. Always check you have EVERY condition the converse requires — one pair of equal sides is not enough. And never use the classification you\'re trying to prove as a reason earlier in the same proof — that\'s circular reasoning.',
    workedExamples: [
      { id: 'wx-classify-parallelogram', prompt: 'Given: quadrilateral ABCD with AB=CD and AD=BC. Prove ABCD is a parallelogram.', steps: [
        { step: 'AB=CD and AD=BC (given) — BOTH pairs of opposite sides are equal.', justification: 'Confirm you have both pairs, not just one.' },
        { step: '∴ ABCD is a parallelogram (opp sides = ⇒ parallelogram).', justification: 'Apply the converse — this is a valid classification, not an assumption.' },
      ], answer: 'ABCD is a parallelogram (opp sides = ⇒ parallelogram)', proof: {
        given: ['AB = CD', 'AD = BC'],
        prove: 'ABCD is a parallelogram',
        steps: [
          { statement: 'AB = CD, AD = BC', correctReason: 'Given', reasonOptions: ['Given', 'Opp sides of ∥m are =', 'Opp sides = ⇒ parallelogram'] },
          { statement: 'ABCD is a parallelogram', correctReason: 'Opp sides = ⇒ parallelogram', reasonOptions: ['Opp sides of ∥m are =', 'Opp sides = ⇒ parallelogram', 'Sum of ∠s in quad'] },
        ],
      } },
    ],
    knowledgeChecks: [
      { question: 'A quadrilateral has ONE pair of opposite sides equal (the other pair unknown). Can you conclude it\'s a parallelogram?', options: ['No — both pairs of opposite sides must be equal', 'Yes, one pair is always enough', 'Yes, if the sides are long enough', 'Cannot be determined either way'], correctIndex: 0, explanation: 'The converse needs BOTH pairs equal, not just one.', misconceptionId: 'quadrilateral-converse-misapplied' },
      { question: 'In a proof that ABCD is a parallelogram, can you use "opposite angles of a parallelogram are equal" as a reason for an early step?', options: ['No — that assumes ABCD is already a parallelogram, which is what you\'re proving', 'Yes, it\'s always a valid first step', 'Yes, but only for squares', 'Cannot be determined'], correctIndex: 0, explanation: 'This would be circular reasoning — using the conclusion as a premise.', misconceptionId: 'quadrilateral-circular-reasoning' },
    ],
    confidenceCheckPrompt: 'How confident do you feel classifying quadrilaterals using converse theorems, avoiding circular reasoning?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'know-quadrilateral-properties', revealSteps: 1, prompt: 'A parallelogram has all angles equal to 90°. What is it also called?', steps: [
        { step: 'A parallelogram with all right angles is a rectangle.', justification: 'This matches the definition of a rectangle.' },
      ], answer: 'A rectangle' },
      { id: 'fp-partial-1', objectiveId: 'classify-via-converse', revealSteps: 1, prompt: 'Given: ABCD with AB∥CD and AD∥BC. What can you classify ABCD as?', steps: [
        { step: 'Both pairs of opposite sides are parallel (given).', justification: 'Check both conditions are met.' },
        { step: 'ABCD is a parallelogram (opp sides ∥ ⇒ parallelogram).', justification: 'Apply the converse.' },
      ], answer: 'A parallelogram' },
      { id: 'fp-independent-1', objectiveId: 'avoid-circular-quadrilateral-proof', revealSteps: 0, prompt: 'Why is it wrong to write "ABCD is a parallelogram" as your FIRST statement when that is exactly what you\'re asked to prove?', steps: [
        { step: 'Doing so assumes the conclusion before it has been established — this is circular reasoning, not a valid proof.', justification: 'A proof must move FROM given facts TO the conclusion, never the reverse.' },
      ], answer: 'It assumes the very thing being proved (circular reasoning)' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'know-quadrilateral-properties', question: 'A rhombus is a parallelogram with which additional property?', options: ['All four sides equal', 'All angles 90°', 'Diagonals equal in length', 'One pair of parallel sides only'], correctIndex: 0, hints: { strategic: 'Recall the specific definition of a rhombus.', procedural: 'It adds equal sides to the parallelogram definition.', workedStep: 'All four sides equal.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'prove-parallelogram-properties', question: 'In the parallelogram diagonal proof, why is AC "common" to both triangles?', options: ['Because it is the shared diagonal, part of both triangles', 'Because it is always equal to AB', 'Because it is perpendicular to BD', 'Because it is given as equal to BC'], correctIndex: 0, hints: { strategic: 'AC is the line you drew to split the parallelogram.', procedural: 'It belongs to both triangle ABC and triangle CDA.', workedStep: 'It\'s the shared diagonal.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'classify-via-converse', question: 'A quadrilateral has diagonals that bisect each other. What can you classify it as?', options: ['A parallelogram (this is a valid converse condition)', 'A rhombus specifically', 'A trapezium', 'Cannot be classified from this alone'], correctIndex: 0, hints: { strategic: 'Diagonals bisecting each other is one of the standard parallelogram converse conditions.', procedural: 'This condition alone is sufficient.', workedStep: 'A parallelogram.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'avoid-circular-quadrilateral-proof', question: 'You need to prove ABCD is a rhombus. Which is a valid FIRST step?', options: ['State the given information (e.g. all sides equal)', 'State "ABCD is a rhombus" and work backward', 'Assume it\'s a rhombus and check if that\'s consistent', 'Skip straight to the properties of a rhombus'], correctIndex: 0, hints: { strategic: 'A proof must start from what is actually given.', procedural: 'Never start from the conclusion.', workedStep: 'State the given information first.' }, distractorMisconceptions: { 1: 'quadrilateral-circular-reasoning' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'true-false', objectiveId: 'know-quadrilateral-properties', multiSelect: false, question: 'True or false: a square is both a rectangle and a rhombus.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — a square has all angles 90° (rectangle) AND all sides equal (rhombus).', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'know-quadrilateral-properties', multiSelect: false, question: 'Which shape is defined as a quadrilateral with only ONE pair of parallel sides?', options: ['Trapezium', 'Parallelogram', 'Rhombus', 'Kite'], correctIndices: [0], explanation: 'A trapezium has exactly one pair of parallel sides.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'prove-parallelogram-properties', multiSelect: false, question: 'True or false: a diagonal of a parallelogram splits it into two congruent triangles.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is the basis for proving parallelogram properties.', distractorMisconceptions: {} },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'classify-via-converse', multiSelect: false, question: 'A quadrilateral has AB=CD and AB∥CD (only ONE pair given, both parallel and equal). Can you classify it as a parallelogram?', options: ['Yes — one pair both equal AND parallel is sufficient', 'No, you need both pairs equal', 'No, you need both pairs parallel', 'Cannot be determined'], correctIndices: [0], explanation: 'One pair of sides being both equal AND parallel is actually a valid (though less commonly used) parallelogram condition.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'classify-via-converse', multiSelect: false, question: 'True or false: having just ONE pair of opposite sides equal (without more information) is enough to prove a parallelogram.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — one pair of equal sides alone (without also being parallel, or without the other pair also equal) is not sufficient.', distractorMisconceptions: { 0: 'quadrilateral-converse-misapplied' } },
    { id: 'q6', type: 'true-false', objectiveId: 'avoid-circular-quadrilateral-proof', multiSelect: false, question: 'True or false: you can use "opposite sides of a parallelogram are equal" as a reason before proving the shape is a parallelogram.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — this would be circular reasoning.', distractorMisconceptions: { 0: 'quadrilateral-circular-reasoning' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'know-quadrilateral-properties', multiSelect: false, question: 'A quadrilateral looks like a parallelogram in a diagram, with no given properties marked. Can you assume it is one?', options: ['No — never assume from appearance alone', 'Yes, diagrams are always accurate', 'Yes, if it looks close enough', 'Only in Grade 10, not later grades'], correctIndices: [0], explanation: 'Classification must be based on given/proven properties, never appearance.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'classify-via-converse', multiSelect: true, question: 'Which of these are valid conditions for proving a quadrilateral is a parallelogram? (select all that apply)', options: ['Both pairs of opposite sides are equal', 'Both pairs of opposite sides are parallel', 'The diagonals bisect each other', 'Only one angle is 90°'], correctIndices: [0, 1, 2], explanation: 'All three are valid parallelogram converse conditions. A single 90° angle alone proves nothing about being a parallelogram.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'avoid-circular-quadrilateral-proof',
      analogy: 'Think of a classification proof like building a case in court: you can only use EVIDENCE (given facts, or facts already proved earlier in this exact case) to reach your VERDICT (the classification) — you can never use the verdict itself as evidence for reaching that same verdict.',
      explanation: 'Before writing any statement in a classification proof, ask: "Do I already know this is true (given or previously proved), or am I about to use the very thing I\'m trying to show?" If it\'s the latter, that step is invalid.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'You are asked to prove ABCD is a rectangle, given that ABCD is a parallelogram with ∠A=90°. Plan the FIRST valid step.', steps: [
          { step: 'Start from what is given: "ABCD is a parallelogram (given)" and "∠A=90° (given)".', justification: 'These are your starting evidence, not the conclusion.' },
          { step: 'Do NOT start with "ABCD is a rectangle" — that\'s the conclusion you\'re building toward.', justification: 'Avoids circular reasoning from the very first line.' },
        ], answer: 'Start from the given facts, never the conclusion' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'avoid-circular-quadrilateral-proof', question: 'Which is a valid first step in proving "ABCD is a rhombus," given AB=BC=CD=DA?', options: ['State the given side equalities', 'State "ABCD is a rhombus"', 'State a random unrelated fact', 'Skip to the final conclusion'], correctIndex: 0, hints: { strategic: 'Start from the given facts.', procedural: 'The given side equalities are your starting evidence.', workedStep: 'State the given side equalities.' }, distractorMisconceptions: { 1: 'quadrilateral-circular-reasoning' } },
        { id: 'rem-p2', objectiveId: 'avoid-circular-quadrilateral-proof', question: 'True or false: it\'s fine to use "diagonals of a rhombus bisect the angles" as a reason if you haven\'t yet shown the shape is a rhombus.', options: ['False — that would assume the conclusion', 'True, always fine', 'True, but only for squares', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'Have you established it\'s a rhombus yet?', procedural: 'If not, using its properties is circular.', workedStep: 'False — that assumes the conclusion.' }, distractorMisconceptions: { 1: 'quadrilateral-circular-reasoning' } },
        { id: 'rem-p3', objectiveId: 'avoid-circular-quadrilateral-proof', question: 'A proof\'s very first line should always be based on what?', options: ['The given information', 'The desired conclusion', 'A guess', 'The diagram\'s appearance'], correctIndex: 0, hints: { strategic: 'What do you actually know for certain at the start?', procedural: 'The given information.', workedStep: 'The given information.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is it circular reasoning to use a shape\'s properties before proving it belongs to that shape category?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel classifying quadrilaterals and avoiding circular reasoning now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the first thing you\'ll write in any classification proof from now on?', type: 'multiple-choice', options: ['The given information', 'The conclusion', 'A guess at the answer', 'A description of the diagram\'s appearance'] },
  ],
};
