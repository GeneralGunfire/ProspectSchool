// ── Geometry, Term 4, Topic 2: Triangle Properties and Congruency ────────────
// Builds on Topic 1 (lines/angles). Covers angle sum, exterior angle,
// isosceles properties, Pythagoras, and congruency/similarity criteria.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'congruency-criterion-misapplied',
    label: 'Applying a congruency criterion without checking its exact structural requirement',
    errorType: 'You claimed a congruency criterion (like SAS) applied without checking that the equal parts are arranged correctly.',
    principle: 'SAS requires the equal ANGLE to be INCLUDED BETWEEN the two equal sides — not just "two sides and an angle are equal somewhere." Each criterion has a precise structural requirement, not just a headcount of equal parts.',
    correctStep: 'For SAS: the angle must be the one FORMED BY the two equal sides, not an angle elsewhere in the triangle.',
  },
  {
    id: 'congruent-vs-similar-confused',
    label: 'Confusing congruent (same size and shape) with similar (same shape, possibly different size)',
    errorType: 'You described triangles as congruent when they were actually only similar, or vice versa.',
    principle: 'CONGRUENT triangles are identical — same size AND shape (all corresponding sides and angles equal). SIMILAR triangles have the same SHAPE but not necessarily the same size (equal angles, but sides only in proportion, not necessarily equal).',
    correctStep: 'Two triangles with equal angles but sides in ratio 2:1 are similar, not congruent — congruent triangles need equal sides too.',
  },
  {
    id: 'equiangular-sides-equal-assumed',
    label: 'Assuming equiangular triangles must have equal sides',
    errorType: 'You concluded that because two triangles have equal corresponding angles, their sides must be equal too.',
    principle: 'Equiangular triangles (all corresponding angles equal) are SIMILAR — their sides are in PROPORTION, not necessarily equal. Only if the proportion is 1:1 are they also congruent.',
    correctStep: 'Equiangular triangles with sides 3,4,5 and 6,8,10 are similar (proportion 1:2), not congruent.',
  },
  {
    id: 'pythagoras-applied-to-non-right-triangle',
    label: 'Applying Pythagoras\' theorem to a triangle that isn\'t right-angled',
    errorType: 'You used a²+b²=c² on a triangle without a given or proven right angle.',
    principle: 'Pythagoras\' theorem ONLY applies to RIGHT-ANGLED triangles. Before using it, confirm the triangle has a right angle — given, marked, or already proved.',
    correctStep: 'For a triangle with no right angle marked or given, you cannot use Pythagoras — you would need a different method entirely.',
  },
  {
    id: 'proof-solves-for-x-instead-of-arguing',
    label: 'Treating a proof like an algebra problem — "solving for x" instead of building a logical argument',
    errorType: 'You tried to find a numeric answer when the task was actually to prove a general relationship or classification.',
    principle: 'Some geometry tasks ask you to find a value (solve for x) — but PROOFS ask you to build a logical chain of statements and reasons showing something is always true, not to compute a number.',
    correctStep: '"Prove triangle ABC is isosceles" requires a statement-reason argument, not a numeric answer.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'geometry',
  grade: 10,
  term: 4,
  topicId: 'triangle-properties',
  topicName: 'Triangle Properties and Congruency',
  prerequisites: [
    'Lines and angles (this term, Topic 1)',
  ],
  objectives: [
    { id: 'apply-triangle-angle-facts', text: 'Apply the triangle angle sum and exterior angle theorems.' },
    { id: 'apply-isosceles-properties', text: 'Apply isosceles triangle angle/side properties in a proof.' },
    { id: 'apply-congruency-criteria', text: 'Correctly apply SSS, SAS, AAS/ASA, and RHS to prove triangles congruent.' },
    { id: 'distinguish-congruent-similar', text: 'Distinguish congruent from similar triangles, and apply the basic equiangular-similarity theorem.' },
  ],
  estimatedMinutes: [20, 30],
};

export const triangleProperties: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What makes two triangles "the same" — and are there different kinds of "the same"?',
  goalSettingPrompt:
    'You already know how angles behave around lines. Triangles add new tools: angle sum, exterior angles, and — critically — precise rules for when two triangles must be identical (congruent) versus just the same shape (similar).',

  activate: {
    connectPrompt: 'You already know parallel-line angle relationships. Triangles use those same tools, plus some new ones.',
    diagnosticQuestions: [
      { question: 'What do the three interior angles of any triangle sum to?', options: ['180°', '360°', '90°', '270°'], correctIndex: 0, explanation: 'Interior angles of a triangle always sum to 180°.' },
      { question: 'In a right-angled triangle, which side is the hypotenuse?', options: ['The longest side, opposite the right angle', 'The shortest side', 'Any side', 'The side adjacent to the right angle'], correctIndex: 0, explanation: 'The hypotenuse is always the longest side, opposite the right angle.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'The interior angles of any triangle sum to 180° ("∠ sum of △"). The EXTERIOR angle of a triangle (formed by extending one side) equals the SUM of the two interior angles NOT adjacent to it ("ext ∠ of △"). In an ISOSCELES triangle (two equal sides), the angles OPPOSITE those equal sides are also equal ("∠s opp equal sides") — and conversely, if two angles are equal, the sides opposite them are equal too ("sides opp equal ∠s").',
    workedExamples: [
      { id: 'wx-exterior-angle', prompt: 'A triangle has interior angles 50° and 70°. Find the exterior angle at the third vertex.', steps: [
        { step: 'Ext ∠ of △ = sum of the two non-adjacent interior angles = 50+70.', justification: 'Apply the exterior angle theorem.' },
        { step: '= 120°.', justification: 'Evaluate.' },
      ], answer: 'Exterior angle = 120°', diagram: {
        points: [{ id: 'A', x: 20, y: 100, label: 'A' }, { id: 'B', x: 100, y: 100, label: 'B' }, { id: 'C', x: 60, y: 20, label: 'C' }, { id: 'D', x: 130, y: 100, label: 'D' }],
        segments: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'A', to: 'C' }, { from: 'B', to: 'D', dashed: true }],
      } },
      { id: 'wx-isosceles-proof', prompt: 'Given: triangle ABC with AB=AC. Prove ∠B = ∠C.', steps: [
        { step: 'AB=AC (given).', justification: 'State the given equal sides.' },
        { step: '∠B = ∠C (∠s opp equal sides).', justification: 'Angles opposite equal sides in an isosceles triangle are equal.' },
      ], answer: '∠B = ∠C (∠s opp equal sides)', proof: {
        given: ['AB = AC'],
        prove: '∠B = ∠C',
        steps: [
          { statement: 'AB = AC', correctReason: 'Given', reasonOptions: ['Given', '∠s opp equal sides', 'Sides opp equal ∠s'] },
          { statement: '∠B = ∠C', correctReason: '∠s opp equal sides', reasonOptions: ['∠s opp equal sides', 'Sides opp equal ∠s', 'Ext ∠ of △'] },
        ],
      } },
    ],
    knowledgeChecks: [
      { question: 'A triangle has angles 40°, 65°, and x. Find x.', options: ['75°', '105°', '65°', '40°'], correctIndex: 0, explanation: '40+65+x=180 → x=75.', misconceptionId: 'proof-solves-for-x-instead-of-arguing' },
      { question: 'In an isosceles triangle, ∠B=∠C=50°. What can you conclude about the sides?', options: ['The sides opposite those angles (AC and AB) are equal', 'All three sides are equal', 'Nothing can be concluded', 'The triangle is right-angled'], correctIndex: 0, explanation: 'Sides opp equal ∠s — the converse isosceles property.', misconceptionId: 'pythagoras-applied-to-non-right-triangle' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying triangle angle theorems and isosceles properties in a proof?',
  },

  demonstrateChunk2: {
    explanation:
      'Two triangles are CONGRUENT (identical in size and shape) if they satisfy SSS (three sides equal), SAS (two sides AND the INCLUDED angle equal), AAS/ASA (two angles and a corresponding side equal), or RHS (right angle, hypotenuse, and one side equal). Each criterion has a precise structural requirement — SAS needs the angle BETWEEN the two equal sides, not just any angle. Two triangles are SIMILAR (same shape, not necessarily same size) if they are equiangular — their sides are then in PROPORTION, not necessarily equal. Pythagoras\' theorem (and its converse) only applies to right-angled triangles — always confirm the right angle first.',
    workedExamples: [
      { id: 'wx-sas-congruency', prompt: 'Given: AB=DE, ∠A=∠D, AC=DF (with ∠A included between AB and AC). Prove △ABC ≡ △DEF.', steps: [
        { step: 'AB=DE, ∠A=∠D, AC=DF (given), with ∠A the angle INCLUDED between the two equal sides.', justification: 'Confirm the angle is genuinely included, not just present somewhere.' },
        { step: '△ABC ≡ △DEF (SAS).', justification: 'Two sides and the included angle equal — this matches SAS exactly.' },
      ], answer: '△ABC ≡ △DEF (SAS)', proof: {
        given: ['AB = DE', '∠A = ∠D', 'AC = DF'],
        prove: '△ABC ≡ △DEF',
        steps: [
          { statement: 'AB = DE, ∠A = ∠D, AC = DF', correctReason: 'Given', reasonOptions: ['Given', 'SAS', 'SSS'] },
          { statement: '△ABC ≡ △DEF', correctReason: 'SAS', reasonOptions: ['SSS', 'SAS', 'RHS', 'AAS/ASA'] },
        ],
      } },
      { id: 'wx-similarity', prompt: 'Two triangles have all three pairs of corresponding angles equal. What can you conclude?', steps: [
        { step: 'Equiangular triangles have corresponding sides in proportion.', justification: 'III (equiangular △s) — this is the basic similarity theorem.' },
        { step: 'The triangles are SIMILAR, not necessarily congruent — their sides may differ in size while keeping the same ratio.', justification: 'Similar means same shape; congruent additionally requires same size.' },
      ], answer: 'The triangles are similar (equiangular △s)' },
    ],
    knowledgeChecks: [
      { question: 'Two triangles have two equal sides and an equal angle, but the angle is NOT between those two sides. Does SAS apply?', options: ['No — the angle must be included between the two equal sides', 'Yes, SAS always applies with any two sides and any angle', 'Yes, but only for right triangles', 'Cannot be determined'], correctIndex: 0, explanation: 'SAS specifically requires the INCLUDED angle.', misconceptionId: 'congruency-criterion-misapplied' },
      { question: 'Two equiangular triangles have sides in ratio 1:3. Are they congruent?', options: ['No — they are similar, not congruent (different sizes)', 'Yes, equiangular always means congruent', 'Cannot be determined', 'Only if all angles are 60°'], correctIndex: 0, explanation: 'Equiangular means similar; congruent additionally requires equal (not just proportional) sides.', misconceptionId: 'equiangular-sides-equal-assumed' },
    ],
    confidenceCheckPrompt: 'How confident do you feel applying congruency criteria correctly and distinguishing congruent from similar?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'apply-triangle-angle-facts', revealSteps: 1, prompt: 'A triangle has an exterior angle of 100° at one vertex, and one non-adjacent interior angle of 35°. Find the other non-adjacent interior angle.', steps: [
        { step: '100 = 35 + x → x = 65°.', justification: 'Ext ∠ of △ = sum of the two non-adjacent interior angles.' },
      ], answer: '65°' },
      { id: 'fp-partial-1', objectiveId: 'apply-congruency-criteria', revealSteps: 1, prompt: 'Given: two right triangles with equal hypotenuses and one equal corresponding side. Which congruency criterion applies?', steps: [
        { step: 'Right angle + hypotenuse + one side equal.', justification: 'Match the given information to a criterion.' },
        { step: 'This is RHS.', justification: 'Right angle, hypotenuse, side — the specific pattern for RHS.' },
      ], answer: 'RHS' },
      { id: 'fp-independent-1', objectiveId: 'distinguish-congruent-similar', revealSteps: 0, prompt: 'Two triangles have all corresponding sides in a 1:1 ratio (equal) AND all corresponding angles equal. Are they congruent or just similar?', steps: [
        { step: 'Equal sides (not just proportional) plus equal angles means both same shape AND same size.', justification: 'This satisfies the stronger condition of congruency, not just similarity.' },
      ], answer: 'Congruent' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'apply-triangle-angle-facts', question: 'A triangle has angles 55°, 60°, and x. Find x.', options: ['65°', '115°', '5°', '175°'], correctIndex: 0, hints: { strategic: 'Angles sum to 180°.', procedural: '55+60+x=180.', workedStep: 'x=65°.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'apply-isosceles-properties', question: 'Triangle PQR has PQ=PR. If ∠Q=48°, find ∠R.', options: ['48°', '84°', '132°', '96°'], correctIndex: 0, hints: { strategic: 'Angles opposite equal sides are equal.', procedural: 'PQ=PR means ∠R=∠Q.', workedStep: '∠R=48°.' }, distractorMisconceptions: {} },
      { id: 'ip-3', objectiveId: 'apply-congruency-criteria', question: 'Two triangles share three pairs of equal sides. Which criterion proves congruency?', options: ['SSS', 'SAS', 'ASA', 'RHS'], correctIndex: 0, hints: { strategic: 'Three sides equal matches which criterion by name?', procedural: 'SSS = Side-Side-Side.', workedStep: 'SSS.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'distinguish-congruent-similar', question: 'Two triangles are equiangular but their corresponding sides are in ratio 1:2. What relationship do they have?', options: ['Similar, not congruent', 'Congruent', 'Neither similar nor congruent', 'Cannot be determined'], correctIndex: 0, hints: { strategic: 'Equiangular means similar — check if sides are equal or just proportional.', procedural: 'Sides are in ratio 1:2, not equal.', workedStep: 'Similar, not congruent.' }, distractorMisconceptions: { 1: 'equiangular-sides-equal-assumed' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'apply-triangle-angle-facts', multiSelect: false, question: 'A triangle has angles 90°, 35°, and x. Find x.', options: ['55°', '65°', '45°', '125°'], correctIndices: [0], explanation: '90+35+x=180 → x=55.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'apply-triangle-angle-facts', multiSelect: false, question: 'A triangle\'s exterior angle is 130°, with one non-adjacent interior angle of 70°. Find the other.', options: ['60°', '50°', '80°', '200°'], correctIndices: [0], explanation: '130=70+x → x=60.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'apply-isosceles-properties', multiSelect: false, question: 'Triangle XYZ has XY=XZ and ∠Y=70°. Find ∠X.', options: ['40°', '70°', '110°', '55°'], correctIndices: [0], explanation: '∠Z=∠Y=70° (isosceles). ∠X=180-70-70=40°.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'apply-congruency-criteria', multiSelect: false, question: 'True or false: SAS requires the equal angle to be between the two equal sides.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — this is the defining structural requirement of SAS.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'apply-congruency-criteria', multiSelect: false, question: 'Two right triangles share an equal hypotenuse and one equal leg. Which criterion applies?', options: ['RHS', 'SAS', 'SSS', 'ASA'], correctIndices: [0], explanation: 'Right angle, Hypotenuse, Side — this is exactly RHS.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'distinguish-congruent-similar', multiSelect: false, question: 'True or false: all congruent triangles are also similar.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — congruent triangles are a special case of similar triangles, with a 1:1 ratio.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'distinguish-congruent-similar', multiSelect: false, question: 'True or false: all similar triangles are also congruent.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — similar triangles can be different sizes; congruent requires the same size too.', distractorMisconceptions: { 0: 'congruent-vs-similar-confused' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'apply-congruency-criteria', multiSelect: true, question: 'Which of these are valid triangle congruency criteria? (select all that apply)', options: ['SSS', 'SAS', 'AAA', 'RHS'], correctIndices: [0, 1, 3], explanation: 'SSS, SAS, and RHS are valid congruency criteria. AAA (three equal angles) only proves similarity, not congruency.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'apply-congruency-criteria',
      analogy: 'Think of each congruency criterion as a specific recipe with an exact order of ingredients. SAS isn\'t just "some side, some angle, some side" — the angle MUST be the filling between the two matching sides, like a sandwich. If the angle is on the outside instead, it\'s a different (invalid) recipe.',
      explanation: 'Before naming a criterion, check the exact arrangement: SSS = all three sides. SAS = two sides with the angle BETWEEN them. AAS/ASA = two angles and a side (in either order, as long as they correspond correctly). RHS = right angle + hypotenuse + one other side.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Two triangles share two equal sides and an equal angle that is NOT between those sides. Which criterion (if any) applies?', steps: [
          { step: 'Check SAS: does the angle sit between the two equal sides? No.', justification: 'SAS specifically requires the included angle.' },
          { step: 'This arrangement doesn\'t match SAS, SSS, ASA/AAS, or RHS as given — more information would be needed.', justification: 'Not every combination of "some sides and an angle" is a valid criterion.' },
        ], answer: 'No standard criterion applies directly with this information alone' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'apply-congruency-criteria', question: 'Two triangles have two equal angles and the side between them equal. Which criterion?', options: ['ASA', 'SAS', 'SSS', 'RHS'], correctIndex: 0, hints: { strategic: 'Angle-Side-Angle, in that arrangement.', procedural: 'Two angles and the included side.', workedStep: 'ASA.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'apply-congruency-criteria', question: 'Two triangles have three pairs of equal corresponding sides. Which criterion?', options: ['SSS', 'SAS', 'ASA', 'RHS'], correctIndex: 0, hints: { strategic: 'All three sides match.', procedural: 'Side-Side-Side.', workedStep: 'SSS.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'apply-congruency-criteria', question: 'Two right-angled triangles have equal hypotenuses and one equal leg. Which criterion?', options: ['RHS', 'SAS', 'SSS', 'ASA'], correctIndex: 0, hints: { strategic: 'Right angle + Hypotenuse + Side.', procedural: 'This exact combination is RHS.', workedStep: 'RHS.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the difference between congruent and similar triangles?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel applying congruency criteria correctly now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'Which congruency criterion do you find easiest to check?', type: 'multiple-choice', options: ['SSS', 'SAS', 'ASA/AAS', 'RHS'] },
  ],
};
