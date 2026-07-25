// ── Geometry, Term 4, Topic 1: Lines and Angles ───────────────────────────────
// First Euclidean Geometry topic — dedicated research pass run, see
// .planning/research/LIBRARY_GEOMETRY_EUCLIDEAN_RESEARCH.md. First use of
// ProofShell (semi-formal two-column statement/reason proofs, per the
// research's confirmed Grade 10 formality norm).

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'assumes-parallel-from-diagram',
    label: 'Assuming lines are parallel just because a diagram looks that way',
    errorType: 'You treated two lines as parallel without that being given or previously proved.',
    principle: 'Never assume parallel lines (or right angles, or equal lengths) from how a diagram LOOKS — only use what is explicitly given, marked, or already proved. Diagrams in geometry are often deliberately not drawn to scale.',
    correctStep: 'Only state "AB ∥ CD" as a reason if it was given in the problem, marked with arrows on the diagram, or already proved in an earlier step.',
  },
  {
    id: 'angle-relationship-mislabelled',
    label: 'Mislabelling which angle relationship applies (alternate vs. corresponding vs. co-interior)',
    errorType: 'You identified the wrong type of angle pair formed by a transversal crossing two lines.',
    principle: 'Alternate angles are on OPPOSITE sides of the transversal, between the two lines. Corresponding angles are in the SAME relative position at each intersection. Co-interior angles are on the SAME side of the transversal, between the two lines.',
    correctStep: 'Two angles on opposite sides of the transversal, both between the parallel lines, are alternate — not corresponding.',
  },
  {
    id: 'missing-parallel-condition-in-reason',
    label: 'Stating an angle-equality reason without naming the parallel condition it depends on',
    errorType: 'You wrote a reason like "alt ∠s" without stating which lines are parallel.',
    principle: 'Angle relationship reasons (alternate/corresponding/co-interior) are only valid BECAUSE certain lines are parallel — always name that condition as part of the reason, e.g. "alt ∠s, AB∥CD," not just "alt ∠s".',
    correctStep: 'Full reason: "Corres ∠s, AB∥CD" — not just "Corres ∠s" on its own.',
  },
  {
    id: 'converse-direction-confused-lines',
    label: 'Confusing a theorem with its converse (using angle equality to prove parallel, and vice versa, in the wrong direction)',
    errorType: 'You used the "lines parallel → angles equal" theorem when you actually needed the reverse "angles equal → lines parallel" converse, or vice versa.',
    principle: 'If lines are ALREADY KNOWN to be parallel, use the theorem to find angle relationships. If you are TRYING TO PROVE lines are parallel, use the converse, starting from known angle equalities.',
    correctStep: 'To prove AB∥CD, show that alternate angles are equal FIRST, THEN conclude "∴ AB∥CD (alt ∠s equal)" — not the other way around.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'geometry',
  grade: 10,
  term: 4,
  topicId: 'lines-and-angles',
  topicName: 'Lines and Angles',
  prerequisites: [
    'Basic angle facts from earlier grades (types of angles, angle measurement)',
  ],
  objectives: [
    { id: 'apply-basic-angle-facts', text: 'Apply straight-line, point/revolution, and vertically-opposite angle facts.' },
    { id: 'identify-angle-relationships', text: 'Correctly identify alternate, corresponding, and co-interior angle pairs formed by a transversal.' },
    { id: 'prove-angle-equality', text: 'Write a semi-formal statement-reason proof using parallel-line angle theorems.' },
    { id: 'prove-lines-parallel', text: 'Use converse angle theorems to prove two lines are parallel.' },
  ],
  estimatedMinutes: [20, 30],
};

export const linesAndAngles: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What can you actually conclude from a diagram — and what must you prove?',
  goalSettingPrompt:
    'Geometry proofs are built entirely on angle facts you can state a reason for — never on what a diagram merely looks like. By the end of this lesson you\'ll be able to identify angle relationships from parallel lines and write your first semi-formal proofs.',

  activate: {
    connectPrompt: 'You already know some basic angle facts from earlier grades — let\'s check those before building proofs on top of them.',
    diagnosticQuestions: [
      { question: 'Two angles on a straight line add up to what?', options: ['180°', '360°', '90°', '45°'], correctIndex: 0, explanation: 'Angles on a straight line are supplementary, summing to 180°.' },
      { question: 'Angles around a single point add up to what?', options: ['360°', '180°', '90°', '270°'], correctIndex: 0, explanation: 'A full revolution around a point is 360°.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Three foundational angle facts: angles on a STRAIGHT LINE sum to 180° ("∠s on a straight line"). Angles around a POINT (a full revolution) sum to 360° ("∠s round a point"). VERTICALLY OPPOSITE angles (formed when two lines cross) are always equal ("vert opp ∠s"). Every one of these facts is a valid REASON you can cite in a proof.',
    workedExamples: [
      { id: 'wx-straight-line', prompt: 'Two angles on a straight line are 3x and 2x+40. Find x.', steps: [
        { step: '3x + (2x+40) = 180 (∠s on a straight line).', justification: 'Angles on a straight line sum to 180°.' },
        { step: '5x+40=180 → 5x=140 → x=28.', justification: 'Solve the resulting linear equation.' },
      ], answer: 'x = 28', diagram: {
        points: [{ id: 'A', x: 20, y: 60 }, { id: 'O', x: 60, y: 60, label: 'O', labelOffset: [0, 18] }, { id: 'B', x: 100, y: 60 }, { id: 'C', x: 75, y: 20 }],
        segments: [{ from: 'A', to: 'B' }, { from: 'O', to: 'C' }],
      } },
      { id: 'wx-vertically-opposite', prompt: 'Two lines cross. One angle is 65°. Find the vertically opposite angle.', steps: [
        { step: 'Vertically opposite angles are always equal.', justification: 'Vert opp ∠s.' },
      ], answer: '65°', diagram: {
        points: [{ id: 'A', x: 20, y: 20 }, { id: 'B', x: 100, y: 100 }, { id: 'C', x: 100, y: 20 }, { id: 'D', x: 20, y: 100 }, { id: 'O', x: 60, y: 60, label: 'O', labelOffset: [8, -4] }],
        segments: [{ from: 'A', to: 'B' }, { from: 'C', to: 'D' }],
      } },
    ],
    knowledgeChecks: [
      { question: 'Three angles around a point are 100°, 140°, and x. Find x.', options: ['120°', '140°', '60°', '240°'], correctIndex: 0, explanation: '100+140+x=360 → x=120.', misconceptionId: 'assumes-parallel-from-diagram' },
      { question: 'If one angle in a vertically-opposite pair is 3y and the other is 75°, what is y?', options: ['25', '75', '15', '37.5'], correctIndex: 0, explanation: 'Vertically opposite angles are equal: 3y=75, y=25.', misconceptionId: 'assumes-parallel-from-diagram' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying the three basic angle facts as proof reasons?',
  },

  demonstrateChunk2: {
    explanation:
      'When a transversal crosses two lines, three angle relationships matter: ALTERNATE angles (opposite sides of the transversal, between the lines) are equal when the lines are parallel. CORRESPONDING angles (same relative position at each crossing) are equal when the lines are parallel. CO-INTERIOR angles (same side, between the lines) are supplementary when the lines are parallel. Every reason must name the parallel condition, e.g. "alt ∠s, AB∥CD." The CONVERSES work in reverse: if you can show equal alternate/corresponding angles (or supplementary co-interior angles), you can conclude the lines ARE parallel.',
    workedExamples: [
      { id: 'wx-parallel-proof', prompt: 'Given: AB∥CD, transversal EF. Prove that the marked alternate angles are equal.', steps: [
        { step: 'AB∥CD (given), and EF is a transversal crossing both.', justification: 'State the given information first.' },
        { step: '∠1 = ∠2 (alt ∠s, AB∥CD).', justification: 'This is the parallel-line theorem, with the parallel condition named.' },
      ], answer: '∠1 = ∠2 (alt ∠s, AB∥CD)', proof: {
        given: ['AB ∥ CD', 'EF is a transversal'],
        prove: '∠1 = ∠2',
        steps: [
          { statement: 'AB ∥ CD', correctReason: 'Given', reasonOptions: ['Given', 'Vert opp ∠s', 'Alt ∠s, AB∥CD'] },
          { statement: '∠1 = ∠2', correctReason: 'Alt ∠s, AB∥CD', reasonOptions: ['Corres ∠s, AB∥CD', 'Alt ∠s, AB∥CD', 'Co-int ∠s, AB∥CD'] },
        ],
      } },
      { id: 'wx-converse-proof', prompt: 'Given: ∠1 = ∠2 (alternate angles formed by transversal EF crossing AB and CD). Prove AB∥CD.', steps: [
        { step: '∠1 = ∠2 (given).', justification: 'State the given equality.' },
        { step: '∴ AB ∥ CD (alt ∠s equal ⇒ lines ∥).', justification: 'Apply the CONVERSE — equal alternate angles prove the lines are parallel.' },
      ], answer: 'AB ∥ CD (alt ∠s equal ⇒ lines ∥)', proof: {
        given: ['∠1 = ∠2'],
        prove: 'AB ∥ CD',
        steps: [
          { statement: '∠1 = ∠2', correctReason: 'Given', reasonOptions: ['Given', 'Alt ∠s, AB∥CD'] },
          { statement: 'AB ∥ CD', correctReason: 'Alt ∠s equal ⇒ lines ∥', reasonOptions: ['Alt ∠s, AB∥CD', 'Alt ∠s equal ⇒ lines ∥', 'Vert opp ∠s'] },
        ],
      } },
    ],
    knowledgeChecks: [
      { question: 'Two angles are on the SAME side of a transversal, both between the two lines. What relationship is this?', options: ['Co-interior', 'Alternate', 'Vertically opposite', 'Corresponding'], correctIndex: 0, explanation: 'Same side, between the lines = co-interior.', misconceptionId: 'angle-relationship-mislabelled' },
      { question: 'Which is the correctly-written reason for a corresponding-angle equality where AB∥CD?', options: ['Corres ∠s, AB∥CD', 'Corres ∠s', 'AB∥CD', 'Equal angles'], correctIndex: 0, explanation: 'The reason must name the parallel condition, not just "corres ∠s" alone.', misconceptionId: 'missing-parallel-condition-in-reason' },
    ],
    confidenceCheckPrompt: 'How confident do you feel identifying angle relationships and writing statement-reason proofs, including converses?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-basic-angle-facts', revealSteps: 1, prompt: 'Two angles on a straight line are 4x and x+30. Find x.', steps: [
        { step: '4x+x+30=180 → 5x=150 → x=30.', justification: '∠s on a straight line.' },
      ], answer: 'x = 30' },
      { id: 'fp-partial-1', objectiveId: 'identify-angle-relationships', revealSteps: 1, prompt: 'AB∥CD with transversal EF. Two angles are on the same side of EF, between AB and CD. What relationship, and what\'s true of them?', steps: [
        { step: 'This is the co-interior relationship.', justification: 'Same side, between the lines.' },
        { step: 'Co-interior angles are supplementary (sum to 180°) when the lines are parallel.', justification: 'Co-int ∠s, AB∥CD.' },
      ], answer: 'Co-interior, supplementary' },
      { id: 'fp-independent-1', objectiveId: 'prove-lines-parallel', revealSteps: 0, prompt: 'Given: co-interior angles ∠1 and ∠2 sum to 180°. Prove AB∥CD.', steps: [
        { step: '∠1+∠2=180° (given). ∴ AB∥CD (co-int ∠s supp ⇒ lines ∥).', justification: 'Apply the converse of the co-interior theorem.' },
      ], answer: 'AB∥CD (co-int ∠s supp ⇒ lines ∥)' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'apply-basic-angle-facts', question: 'Angles around a point are 90°, 110°, and x. Find x.', options: ['160°', '200°', '140°', '360°'], correctIndex: 0, hints: { strategic: 'They sum to 360°.', procedural: '90+110+x=360.', workedStep: 'x=160°.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'identify-angle-relationships', question: 'Two angles in the SAME relative position at two different intersections with a transversal — what relationship?', options: ['Corresponding', 'Alternate', 'Co-interior', 'Vertically opposite'], correctIndex: 0, hints: { strategic: 'Same position at each crossing.', procedural: 'This is the definition of corresponding angles.', workedStep: 'Corresponding.' }, distractorMisconceptions: { 1: 'angle-relationship-mislabelled' } },
      { id: 'ip-3', objectiveId: 'prove-angle-equality', question: 'AB∥CD, transversal EF, ∠1 and ∠2 are corresponding. What is the correct reason for ∠1=∠2?', options: ['Corres ∠s, AB∥CD', 'Corres ∠s', 'Given', 'Vert opp ∠s'], correctIndex: 0, hints: { strategic: 'The reason must name the parallel lines.', procedural: 'Include "AB∥CD" in the reason.', workedStep: 'Corres ∠s, AB∥CD.' }, distractorMisconceptions: { 1: 'missing-parallel-condition-in-reason' } },
      { id: 'ip-4', objectiveId: 'prove-lines-parallel', question: 'You are told co-interior angles are 95° and 85°. Can you conclude the lines are parallel?', options: ['No — they must sum to 180°, and 95+85=180, so actually YES they are parallel', 'Yes, any co-interior pair proves parallel lines', 'No, co-interior angles never prove parallel lines', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'Check: do they actually sum to 180°?', procedural: '95+85=180.', workedStep: 'Yes — co-int ∠s supp ⇒ lines ∥ applies here.' }, distractorMisconceptions: { 2: 'converse-direction-confused-lines' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'apply-basic-angle-facts', multiSelect: false, question: 'Two angles on a straight line are 2x+10 and 3x+20. Find x.', options: ['30', '25', '40', '20'], correctIndices: [0], explanation: '2x+10+3x+20=180 → 5x+30=180 → 5x=150 → x=30.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'apply-basic-angle-facts', multiSelect: false, question: 'True or false: vertically opposite angles are always supplementary.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — vertically opposite angles are always EQUAL, not supplementary.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'identify-angle-relationships', multiSelect: false, question: 'Two angles are on opposite sides of a transversal, between the two lines. What relationship?', options: ['Alternate', 'Corresponding', 'Co-interior', 'Vertically opposite'], correctIndices: [0], explanation: 'Opposite sides, between the lines = alternate.', distractorMisconceptions: { 2: 'angle-relationship-mislabelled' } },
    { id: 'q4', type: 'true-false', objectiveId: 'prove-angle-equality', multiSelect: false, question: 'True or false: it\'s acceptable to state "AB∥CD" as a reason in a proof just because the diagram shows the lines looking parallel.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — parallel must be given, marked, or already proved; never assumed from appearance.', distractorMisconceptions: { 0: 'assumes-parallel-from-diagram' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'prove-angle-equality', multiSelect: false, question: 'AB∥CD, transversal EF. Co-interior angles are 3x and x+40. Find x.', options: ['35', '45', '30', '40'], correctIndices: [0], explanation: 'Co-interior angles are supplementary: 3x+x+40=180 → 4x=140 → x=35.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'prove-lines-parallel', multiSelect: false, question: 'True or false: to prove two lines are parallel, you should use the theorem (not the converse).', options: ['True', 'False'], correctIndices: [1], explanation: 'False — proving lines ARE parallel requires the CONVERSE, starting from known angle relationships.', distractorMisconceptions: { 0: 'converse-direction-confused-lines' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'prove-lines-parallel', multiSelect: false, question: 'Alternate angles ∠1 and ∠2 are both 72°. What can you conclude?', options: ['The two lines are parallel (alt ∠s equal ⇒ lines ∥)', 'The two lines are perpendicular', 'Nothing can be concluded', 'The lines must be the same line'], correctIndices: [0], explanation: 'Equal alternate angles prove the lines are parallel, via the converse.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'identify-angle-relationships', multiSelect: true, question: 'Which angle pairs are equal WHEN two lines are parallel? (select all that apply)', options: ['Alternate angles', 'Corresponding angles', 'Co-interior angles', 'Vertically opposite angles (always, regardless of parallel lines)'], correctIndices: [0, 1, 3], explanation: 'Alternate and corresponding angles are equal when lines are parallel; vertically opposite angles are always equal regardless. Co-interior angles are supplementary, not equal.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'identify-angle-relationships',
      analogy: 'Picture the transversal as a ladder crossing two parallel railway tracks. "Corresponding" angles sit in the same corner at each rung. "Alternate" angles sit in opposite corners, but both squeezed between the tracks. "Co-interior" angles sit on the same side, both between the tracks — like two people facing each other across the gap.',
      explanation: 'For any angle pair formed by a transversal: first check if both angles are BETWEEN the two lines (interior) or outside them (exterior) — only interior pairs are "alternate" or "co-interior". Then check same side (co-interior) vs. opposite sides (alternate). "Corresponding" pairs are NOT between the lines — they occupy matching corners at each separate intersection.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Identify the relationship: two angles both between two parallel lines, on opposite sides of the transversal.', steps: [
          { step: 'Both interior (between the lines) — rules out corresponding.', justification: 'Corresponding angles are not both interior.' },
          { step: 'Opposite sides of the transversal — this is alternate, not co-interior.', justification: 'Co-interior would be same side.' },
        ], answer: 'Alternate angles' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'identify-angle-relationships', question: 'Two angles are both interior (between the lines), on the SAME side of the transversal. What relationship?', options: ['Co-interior', 'Alternate', 'Corresponding', 'Vertically opposite'], correctIndex: 0, hints: { strategic: 'Interior + same side.', procedural: 'This matches the co-interior definition.', workedStep: 'Co-interior.' }, distractorMisconceptions: { 1: 'angle-relationship-mislabelled' } },
        { id: 'rem-p2', objectiveId: 'identify-angle-relationships', question: 'Two angles are in the same relative corner position at two different crossing points. What relationship?', options: ['Corresponding', 'Alternate', 'Co-interior', 'Vertically opposite'], correctIndex: 0, hints: { strategic: 'Same corner, different intersections.', procedural: 'This matches the corresponding definition.', workedStep: 'Corresponding.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'identify-angle-relationships', question: 'Two angles are both interior, on opposite sides of the transversal. What relationship?', options: ['Alternate', 'Co-interior', 'Corresponding', 'Vertically opposite'], correctIndex: 0, hints: { strategic: 'Interior + opposite sides.', procedural: 'This matches the alternate definition.', workedStep: 'Alternate.' }, distractorMisconceptions: { 1: 'angle-relationship-mislabelled' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Why is it important to never assume parallel lines just from how a diagram looks?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel writing statement-reason proofs about angles now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is the difference between using a theorem and using its converse?', type: 'multiple-choice', options: ['A theorem starts from parallel lines; its converse starts from angle equality to prove parallel', 'They are exactly the same', 'A converse is only for triangles', 'There is no meaningful difference'] },
  ],
};
