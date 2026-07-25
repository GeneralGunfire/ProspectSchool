// ── Geometry, Term 4, Topic 4: The Midpoint Theorem ───────────────────────────
// Capstone Euclidean Geometry topic, connecting triangles, quadrilaterals,
// and (via Geometry Term 2) coordinate geometry.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'midpoint-theorem-as-definition-not-theorem',
    label: 'Treating the midpoint theorem as an obvious definition rather than a fact requiring proof and careful application',
    errorType: 'You applied the midpoint theorem as if it were just a naming convention, without recognising it as a provable, powerful geometric fact.',
    principle: 'The midpoint theorem is a THEOREM: the segment joining the midpoints of two sides of a triangle is BOTH parallel to the third side AND exactly half its length. Both conclusions matter and both need the theorem to be justified as a reason.',
    correctStep: 'Citing "Midpt theorem" as a reason establishes BOTH the parallel relationship AND the length relationship at once — not just one or the other.',
  },
  {
    id: 'midpoint-theorem-without-true-midpoints',
    label: 'Applying the midpoint theorem when the points aren\'t actually confirmed midpoints',
    errorType: 'You used the midpoint theorem for a segment where the endpoints weren\'t established as true midpoints.',
    principle: 'The midpoint theorem only applies when BOTH points are genuinely midpoints of their respective sides — given, or already proved. Points that merely "look centred" don\'t qualify.',
    correctStep: 'Before citing "Midpt theorem," confirm both points are labelled or proven as midpoints — not just visually near the centre.',
  },
  {
    id: 'midpoint-theorem-half-length-forgotten',
    label: 'Remembering the parallel part of the midpoint theorem but forgetting the length relationship',
    errorType: 'You concluded the segment is parallel to the third side, but didn\'t also state it is half the length.',
    principle: 'The midpoint theorem gives you TWO facts at once: the segment is PARALLEL to the third side, AND it is HALF its length. A complete answer states both.',
    correctStep: 'If the third side is 12cm, the midpoint segment isn\'t just "parallel to it" — it\'s also exactly 6cm long.',
  },
  {
    id: 'converse-midpoint-theorem-confused',
    label: 'Confusing the midpoint theorem with its converse',
    errorType: 'You used the theorem\'s conclusion as your given, or vice versa, in the wrong direction.',
    principle: 'The THEOREM starts from "these are midpoints" and concludes "parallel and half-length." The CONVERSE starts from "this segment is parallel to a side and passes through one midpoint" and concludes "it bisects the third side" (passes through the other midpoint too).',
    correctStep: 'To PROVE a point is a midpoint, use the converse (starting from a known parallel line through one midpoint). To find a parallel/length relationship from known midpoints, use the theorem itself.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'geometry',
  grade: 10,
  term: 4,
  topicId: 'midpoint-theorem',
  topicName: 'The Midpoint Theorem',
  prerequisites: [
    'Triangle properties and congruency (this term, Topic 2)',
    'Quadrilateral properties and proofs (this term, Topic 3)',
    'Distance and midpoint (Geometry Term 2)',
  ],
  objectives: [
    { id: 'state-midpoint-theorem', text: 'State the midpoint theorem and its converse precisely.' },
    { id: 'apply-midpoint-theorem', text: 'Apply the midpoint theorem to find lengths and identify parallel relationships.' },
    { id: 'apply-converse-midpoint', text: 'Apply the converse of the midpoint theorem to prove a point is a midpoint.' },
    { id: 'connect-midpoint-to-quadrilaterals', text: 'Use the midpoint theorem to prove properties of a quadrilateral formed by midpoints.' },
  ],
  estimatedMinutes: [20, 30],
};

export const midpointTheorem: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What do you get for free when you connect two midpoints?',
  goalSettingPrompt:
    'This lesson brings together everything from this term — triangles, quadrilaterals, and coordinate geometry — into one powerful result: the midpoint theorem. It gives you two facts at once about any segment joining two midpoints.',

  activate: {
    connectPrompt: 'You already know triangle congruency and quadrilateral properties — the midpoint theorem builds directly on both.',
    diagnosticQuestions: [
      { question: 'In triangle ABC, D is the midpoint of AB. What does this mean?', options: ['AD = DB (D splits AB into two equal halves)', 'AD is longer than DB', 'D is anywhere on AB', 'AD is parallel to BC'], correctIndex: 0, explanation: 'A midpoint splits a segment into two exactly equal halves.' },
      { question: 'If a segment DE is parallel to BC, what angle relationship would result from a transversal?', options: ['Corresponding or alternate angles would be equal', 'No angle relationship exists', 'All angles become 90°', 'The segments would have to be equal in length'], correctIndex: 0, explanation: 'Parallel lines create equal corresponding/alternate angles with any transversal.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'THE MIDPOINT THEOREM: if D and E are the MIDPOINTS of sides AB and AC of triangle ABC, then DE is PARALLEL to BC, AND DE is exactly HALF the length of BC. This gives you two facts at once — always state both when applying it. The theorem only applies when BOTH D and E are genuinely midpoints (given or already proved) — not just points that look centred.',
    workedExamples: [
      { id: 'wx-midpoint-theorem-basic', prompt: 'In triangle ABC, D and E are midpoints of AB and AC respectively. BC = 18cm. Find DE, and state the relationship between DE and BC.', steps: [
        { step: 'D and E are midpoints of AB and AC (given).', justification: 'Confirm both conditions of the theorem are met.' },
        { step: 'DE ∥ BC and DE = ½BC (Midpt theorem).', justification: 'The theorem gives both the parallel relationship and the length relationship at once.' },
        { step: 'DE = ½(18) = 9cm.', justification: 'Apply the half-length part specifically.' },
      ], answer: 'DE ∥ BC, DE = 9cm', diagram: {
        points: [{ id: 'A', x: 60, y: 20, label: 'A' }, { id: 'B', x: 20, y: 100, label: 'B' }, { id: 'C', x: 110, y: 100, label: 'C' }, { id: 'D', x: 40, y: 60, label: 'D' }, { id: 'E', x: 85, y: 60, label: 'E' }],
        segments: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'C' }, { from: 'D', to: 'E', parallelMarks: 1 }, { from: 'A', to: 'D', ticks: 1 }, { from: 'D', to: 'B', ticks: 1 }, { from: 'A', to: 'E', ticks: 2 }, { from: 'E', to: 'C', ticks: 2 }],
      } },
    ],
    knowledgeChecks: [
      { question: 'D and E are midpoints of AB and AC in triangle ABC. If BC=24cm, what is DE?', options: ['12cm', '24cm', '48cm', '6cm'], correctIndex: 0, explanation: 'DE = ½BC = 12cm.', misconceptionId: 'midpoint-theorem-half-length-forgotten' },
      { question: 'A point P is roughly in the middle of side AB by eye, but not confirmed as the exact midpoint. Can you apply the midpoint theorem using P?', options: ['No — P must be a confirmed (given or proven) midpoint', 'Yes, close enough is fine', 'Yes, if the triangle looks symmetric', 'Cannot be determined'], correctIndex: 0, explanation: 'The theorem requires a genuine, confirmed midpoint — not an approximate one.', misconceptionId: 'midpoint-theorem-without-true-midpoints' },
    ],
    confidenceCheckPrompt: 'How confident do you feel stating and applying the midpoint theorem?',
  },

  demonstrateChunk2: {
    explanation:
      'THE CONVERSE: if a line is drawn through the midpoint of one side of a triangle, PARALLEL to a second side, then it BISECTS the third side (passes through its midpoint too). Use the theorem when you already KNOW two midpoints and want to find a parallel/length relationship. Use the CONVERSE when you know a segment is parallel and passes through one midpoint, and want to PROVE it passes through the other side\'s midpoint. The midpoint theorem is also a powerful tool for proving properties of quadrilaterals formed by connecting the midpoints of a larger shape.',
    workedExamples: [
      { id: 'wx-converse-midpoint', prompt: 'In triangle ABC, D is the midpoint of AB. A line through D, parallel to BC, meets AC at E. Prove E is the midpoint of AC.', steps: [
        { step: 'D is the midpoint of AB (given). DE ∥ BC (given).', justification: 'State both given conditions the converse requires.' },
        { step: '∴ E is the midpoint of AC (converse of midpt theorem).', justification: 'The converse concludes E bisects AC, given the parallel line through the other midpoint.' },
      ], answer: 'E is the midpoint of AC (converse of midpt theorem)', proof: {
        given: ['D is the midpoint of AB', 'DE ∥ BC'],
        prove: 'E is the midpoint of AC',
        steps: [
          { statement: 'D is the midpoint of AB, DE ∥ BC', correctReason: 'Given', reasonOptions: ['Given', 'Midpt theorem', 'Converse of midpt theorem'] },
          { statement: 'E is the midpoint of AC', correctReason: 'Converse of midpt theorem', reasonOptions: ['Midpt theorem', 'Converse of midpt theorem', 'Opp sides of ∥m are ='] },
        ],
      } },
      { id: 'wx-midpoint-quadrilateral', prompt: 'The midpoints of the four sides of any quadrilateral are joined to form a new quadrilateral. What shape is it always?', steps: [
        { step: 'Each side of the new quadrilateral is formed by joining midpoints of two sides of a triangle created by a diagonal of the original quadrilateral.', justification: 'Split the original quadrilateral using a diagonal to create two triangles.' },
        { step: 'By the midpoint theorem, each such segment is parallel to (and half the length of) the corresponding diagonal — so opposite sides of the new quadrilateral are parallel and equal.', justification: 'Apply the midpoint theorem to both triangles formed by each diagonal.' },
      ], answer: 'It is always a parallelogram (a well-known result, sometimes called Varignon\'s theorem)' },
    ],
    knowledgeChecks: [
      { question: 'A line is drawn through the midpoint of AB, parallel to BC, and meets AC. What can you conclude using the converse?', options: ['The line passes through the midpoint of AC', 'The line is exactly half of BC', 'The triangle must be isosceles', 'Nothing further can be concluded'], correctIndex: 0, explanation: 'The converse midpoint theorem concludes the line bisects the third side.', misconceptionId: 'converse-midpoint-theorem-confused' },
      { question: 'To PROVE a point is a midpoint using a parallel line, which do you use: the theorem or its converse?', options: ['The converse', 'The theorem', 'Either works equally', 'Neither applies'], correctIndex: 0, explanation: 'Proving a point IS a midpoint (from a parallel line) is exactly what the converse is for.', misconceptionId: 'converse-midpoint-theorem-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying the converse midpoint theorem and connecting it to quadrilateral properties?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-midpoint-theorem', revealSteps: 1, prompt: 'D and E are midpoints of AB and AC in triangle ABC. BC=30cm. Find DE.', steps: [
        { step: 'DE = ½BC = 15cm (Midpt theorem).', justification: 'Apply the theorem directly.' },
      ], answer: 'DE = 15cm' },
      { id: 'fp-partial-1', objectiveId: 'apply-converse-midpoint', revealSteps: 1, prompt: 'F is the midpoint of PQ in triangle PQR. A line through F, parallel to QR, meets PR at G. What can you conclude?', steps: [
        { step: 'F is a midpoint, and FG∥QR (given).', justification: 'Confirm the converse\'s conditions.' },
        { step: 'G is the midpoint of PR (converse of midpt theorem).', justification: 'Apply the converse.' },
      ], answer: 'G is the midpoint of PR' },
      { id: 'fp-independent-1', objectiveId: 'connect-midpoint-to-quadrilaterals', revealSteps: 0, prompt: 'The midpoints of a quadrilateral\'s sides are joined to form a new shape. What type of shape results, and which theorem justifies this?', steps: [
        { step: 'It always forms a parallelogram, justified by applying the midpoint theorem to the triangles formed by each diagonal.', justification: 'Each pair of opposite "midpoint segments" becomes parallel and equal via the theorem.' },
      ], answer: 'A parallelogram, justified by the midpoint theorem' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'state-midpoint-theorem', question: 'Which TWO facts does the midpoint theorem give you at once?', options: ['Parallel to the third side AND half its length', 'Equal to the third side AND perpendicular to it', 'Twice the length of the third side only', 'Only that the segment exists'], correctIndex: 0, hints: { strategic: 'Recall both parts of the theorem\'s conclusion.', procedural: 'Parallel relationship AND length relationship.', workedStep: 'Parallel to the third side AND half its length.' }, distractorMisconceptions: { 3: 'midpoint-theorem-as-definition-not-theorem' } },
      { id: 'ip-2', objectiveId: 'apply-midpoint-theorem', question: 'D,E are midpoints of AB,AC in triangle ABC. If DE=7cm, find BC.', options: ['14cm', '3.5cm', '7cm', '21cm'], correctIndex: 0, hints: { strategic: 'DE is HALF of BC, so BC is DOUBLE DE.', procedural: 'BC = 2×DE.', workedStep: '=14cm.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'apply-converse-midpoint', question: 'A line through the midpoint of one side, parallel to a second side, does what to the third side?', options: ['Bisects it (passes through its midpoint)', 'Makes it perpendicular', 'Doubles its length', 'Has no effect on it'], correctIndex: 0, hints: { strategic: 'This is exactly the converse midpoint theorem\'s conclusion.', procedural: 'It bisects the third side.', workedStep: 'Bisects it.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'connect-midpoint-to-quadrilaterals', question: 'Why does joining the midpoints of any quadrilateral always give a parallelogram?', options: ['Each diagonal creates two triangles, and the midpoint theorem makes opposite "midpoint segments" parallel and equal', 'It only works for squares', 'It is just a coincidence with no proof', 'It only works if the original shape is already a parallelogram'], correctIndex: 0, hints: { strategic: 'Think about what a diagonal does to the quadrilateral, and what the midpoint theorem then gives you.', procedural: 'Each diagonal splits it into two triangles.', workedStep: 'The midpoint theorem applies to each, giving parallel and equal opposite sides.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'apply-midpoint-theorem', multiSelect: false, question: 'D,E are midpoints of AB,AC in triangle ABC. BC=40cm. Find DE.', options: ['20cm', '40cm', '80cm', '10cm'], correctIndices: [0], explanation: 'DE=½BC=20cm.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'apply-midpoint-theorem', multiSelect: false, question: 'D,E are midpoints of AB,AC in triangle ABC. DE=9cm. Find BC.', options: ['18cm', '4.5cm', '9cm', '27cm'], correctIndices: [0], explanation: 'BC=2×DE=18cm.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'apply-midpoint-theorem', multiSelect: false, question: 'True or false: the midpoint theorem only tells you about length, not direction/parallelism.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — it gives BOTH a parallel relationship and a length relationship.', distractorMisconceptions: { 0: 'midpoint-theorem-half-length-forgotten' } },
    { id: 'q4', type: 'true-false', objectiveId: 'apply-midpoint-theorem', multiSelect: false, question: 'True or false: you can apply the midpoint theorem to a segment joining two points that merely look centred on their sides.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — both points must be confirmed (given or proven) midpoints.', distractorMisconceptions: { 0: 'midpoint-theorem-without-true-midpoints' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'apply-converse-midpoint', multiSelect: false, question: 'A line through the midpoint of AB, parallel to BC, meets AC at E. What is E?', options: ['The midpoint of AC', 'The midpoint of AB', 'A random point on AC', 'The centre of the triangle'], correctIndices: [0], explanation: 'By the converse midpoint theorem, E is the midpoint of AC.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'apply-converse-midpoint', multiSelect: false, question: 'True or false: to prove a point is a midpoint using a parallel line, you should cite "Midpt theorem" (not the converse).', options: ['True', 'False'], correctIndices: [1], explanation: 'False — proving a point IS a midpoint requires the CONVERSE, not the theorem itself.', distractorMisconceptions: { 0: 'converse-midpoint-theorem-confused' } },
    { id: 'q7', type: 'true-false', objectiveId: 'connect-midpoint-to-quadrilaterals', multiSelect: false, question: 'True or false: joining the midpoints of any quadrilateral\'s sides always forms a parallelogram.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is a well-known consequence of the midpoint theorem applied via the diagonals.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'state-midpoint-theorem', multiSelect: true, question: 'For the midpoint theorem to apply to segment DE in triangle ABC, which must be true? (select all that apply)', options: ['D is the midpoint of one side', 'E is the midpoint of another side', 'DE must be perpendicular to BC', 'Both D and E must be confirmed, not just visually estimated'], correctIndices: [0, 1, 3], explanation: 'Both points must be genuine confirmed midpoints. There is no perpendicularity requirement.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-midpoint-theorem',
      analogy: 'Think of the midpoint theorem as a "two-for-one deal": every time you correctly identify two midpoints in a triangle, you get BOTH a parallel relationship AND an exact half-length relationship, guaranteed together — never state just one without the other.',
      explanation: 'Whenever you see two midpoints in a triangle, immediately write down BOTH conclusions: "the segment joining them is parallel to the third side" AND "it equals half the third side\'s length."',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'D,E are midpoints of PQ,PR in triangle PQR. QR=22cm. State everything the midpoint theorem tells you.', steps: [
          { step: 'DE ∥ QR (the parallel relationship).', justification: 'First conclusion of the theorem.' },
          { step: 'DE = ½(22) = 11cm (the length relationship).', justification: 'Second conclusion of the theorem.' },
        ], answer: 'DE ∥ QR and DE = 11cm — both facts, always together' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-midpoint-theorem', question: 'D,E are midpoints of AB,AC. BC=16cm. What are BOTH conclusions from the midpoint theorem?', options: ['DE∥BC and DE=8cm', 'DE=BC and DE∥BC', 'DE=8cm only', 'DE∥BC only'], correctIndex: 0, hints: { strategic: 'State both the parallel AND length facts.', procedural: 'DE∥BC, and DE=½(16).', workedStep: 'DE∥BC and DE=8cm.' }, distractorMisconceptions: { 2: 'midpoint-theorem-half-length-forgotten', 3: 'midpoint-theorem-half-length-forgotten' } },
        { id: 'rem-p2', objectiveId: 'apply-midpoint-theorem', question: 'D,E are midpoints of AB,AC. BC=50cm. Find DE.', options: ['25cm', '50cm', '100cm', '12.5cm'], correctIndex: 0, hints: { strategic: 'DE is half of BC.', procedural: '50/2', workedStep: '=25cm.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'apply-midpoint-theorem', question: 'D,E are midpoints of AB,AC. DE=13.5cm. Find BC.', options: ['27cm', '6.75cm', '13.5cm', '40.5cm'], correctIndex: 0, hints: { strategic: 'BC is double DE.', procedural: '13.5×2', workedStep: '=27cm.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What are the two facts the midpoint theorem gives you at once?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel applying the midpoint theorem and its converse now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'How did the midpoint theorem connect to quadrilateral properties in this lesson?', type: 'multiple-choice', options: ['It shows why joining a quadrilateral\'s midpoints always forms a parallelogram', 'It has no connection to quadrilaterals', 'It only applies to squares', 'It replaces all quadrilateral theorems'] },
  ],
};
