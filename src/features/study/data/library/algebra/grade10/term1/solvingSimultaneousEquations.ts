// ── Topic 8: Solving Simultaneous Equations — Algebra, Grade 10, Term 1 ──────
// Dedicated Perplexity research pass run (misconception-prone, per
// LIBRARY_PARTNER_HANDOFF.md §4) — see
// .planning/research/LIBRARY_ALGEBRA_TOPIC7_8_RESEARCH.md. Builds on Topic 6
// (solving linear equations); "two rules true at once" is the new idea.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'substitution-bracket-error',
    label: 'Forgetting brackets when substituting an expression',
    errorType: 'You substituted an expression into the other equation without putting it in brackets, changing what it means.',
    principle: 'When substituting an expression like "2x - 3" in place of y, always wrap it in brackets — especially if it\'s being multiplied by something — so every term of the substituted expression is treated correctly.',
    correctStep: 'If y = 2x - 3, substituting into 3y + 1 = 10 means 3(2x - 3) + 1 = 10, not 3·2x - 3 + 1 = 10.',
  },
  {
    id: 'stop-after-one-variable',
    label: 'Stopping after finding only one variable',
    errorType: 'You solved for one variable but never went back to find the value of the other.',
    principle: 'A solution to a system of two equations is a PAIR of values, (x, y) — finding x alone is not a complete answer. Always substitute your found value back into one of the original equations to find the other variable.',
    correctStep: 'After finding x = 4, substitute back into y = 2x - 3 to get y = 2(4) - 3 = 5. The full solution is (4, 5).',
  },
  {
    id: 'check-only-one-equation',
    label: 'Checking a solution in only one of the two original equations',
    errorType: 'You verified your solution works in one equation, and assumed that was enough.',
    principle: 'A solution to a SYSTEM must satisfy BOTH original equations at once — checking only one equation can hide an error made while solving the other.',
    correctStep: 'For (4, 5), check BOTH: does it satisfy equation 1 AND equation 2? Both must be true.',
  },
  {
    id: 'incomplete-scaling',
    label: 'Not multiplying every term when scaling an equation for elimination',
    errorType: 'You multiplied an equation by a number, but only applied it to some of the terms.',
    principle: 'When scaling an equation to prepare for elimination, EVERY term on both sides must be multiplied by the same number — treat the whole equation as one balanced unit.',
    correctStep: 'Multiplying 2x + y = 5 by 3 gives 6x + 3y = 15 — every term (2x, y, AND 5) is multiplied by 3.',
  },
  {
    id: 'elimination-wrong-variable-cancels',
    label: 'Adding/subtracting equations without checking which variable actually cancels',
    errorType: 'You combined the two equations by adding or subtracting, but the coefficients weren\'t actually set up to eliminate anything.',
    principle: 'Before adding or subtracting, check that the coefficients of the target variable are equal in size — same sign for subtracting, opposite signs for adding — so that variable actually cancels to zero.',
    correctStep: 'To eliminate y from 2x + 3y = 12 and x - 3y = 3, the y-coefficients (+3 and -3) are already opposite, so ADDING the equations cancels y: 3x = 15.',
  },
  {
    id: 'solution-type-confusion',
    label: 'Confusing "no solution" with "infinitely many solutions"',
    errorType: 'You reached an algebraic result like 0 = 5 or 0 = 0 but drew the wrong conclusion about what it means.',
    principle: 'A false statement like 0 = 5 (a contradiction) means NO solution exists — the lines are parallel and never meet. A true statement like 0 = 0 (an identity) means INFINITELY many solutions — the two equations describe the same line.',
    correctStep: 'If elimination leads to 0 = 7, there is no solution (parallel lines). If it leads to 0 = 0, there are infinitely many solutions (the same line).',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'solving-simultaneous-equations',
  topicName: 'Solving Simultaneous Equations',
  prerequisites: [
    'Solving linear equations, including variable on both sides (Topic 6)',
    'Substituting values into algebraic expressions',
  ],
  objectives: [
    { id: 'substitution-method', text: 'Solve a system of two linear equations using the substitution method.' },
    { id: 'elimination-method', text: 'Solve a system of two linear equations using the elimination method, including scaling equations.' },
    { id: 'check-both-equations', text: 'Check a solution by substituting it back into BOTH original equations.' },
    { id: 'identify-solution-type', text: 'Identify whether a system has one solution, no solution, or infinitely many solutions.' },
  ],
  estimatedMinutes: [20, 30],
};

export const solvingSimultaneousEquations: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'When must two rules be true at the same time?',
  goalSettingPrompt:
    'You already know how to solve one equation for one unknown. Simultaneous equations ask a new question: what pair of values makes TWO equations true at the same time? By the end of this lesson you\'ll be able to find that pair using two different methods.',

  activate: {
    connectPrompt: 'You already know how to solve linear equations and substitute values into expressions. Let\'s check both, since they\'re the two building blocks for this lesson.',
    diagnosticQuestions: [
      { question: 'Solve 3x + 4 = 19.', options: ['x = 5', 'x = 23/3', 'x = 15', 'x = 63'], correctIndex: 0, explanation: 'Subtract 4: 3x = 15. Divide by 3: x = 5.' },
      { question: 'If y = 2x - 3 and x = 4, what is y?', options: ['5', '11', '1', '8'], correctIndex: 0, explanation: 'y = 2(4) - 3 = 8 - 3 = 5.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'A system of simultaneous equations has TWO equations, both involving the same two unknowns, x and y. Solving the system means finding the one pair (x, y) that makes BOTH equations true at once. The substitution method: use one equation to express one variable in terms of the other, then substitute that expression into the SECOND equation — this leaves one equation with only one unknown, which you already know how to solve. Once you find that value, substitute back to find the other variable. Always finish by checking your pair works in BOTH original equations.',
    workedExamples: [
      { id: 'wx-substitution-basic', prompt: 'Solve the system: y = 2x - 3 and x + y = 9.', steps: [
        { step: 'Substitute y = 2x - 3 into the second equation: x + (2x - 3) = 9.', justification: 'Replace y with its expression in terms of x, using brackets.' },
        { step: 'Solve for x: 3x - 3 = 9 → 3x = 12 → x = 4.', justification: 'This is now a normal one-variable linear equation.' },
        { step: 'Substitute x = 4 back into y = 2x - 3: y = 2(4) - 3 = 5.', justification: 'Find the second variable using the found value.' },
      ], answer: '(x, y) = (4, 5)' },
      { id: 'wx-check-both', prompt: 'Check that (4, 5) satisfies BOTH original equations.', steps: [
        { step: 'Check y = 2x - 3: is 5 = 2(4) - 3? 2(4)-3 = 5 ✓', justification: 'Substitute both values into the first equation.' },
        { step: 'Check x + y = 9: is 4 + 5 = 9? Yes ✓', justification: 'Substitute both values into the second equation too.' },
      ], answer: 'Both equations check out, confirming (4, 5) is correct.' },
    ],
    knowledgeChecks: [
      { question: 'If y = 3x + 1, how should you substitute into 2y - 5 = x?', options: ['2(3x + 1) - 5 = x', '2·3x + 1 - 5 = x', '2y - 5 = 3x + 1', '2(3x) + 1 - 5 = x'], correctIndex: 0, explanation: 'The whole expression (3x+1) must be wrapped in brackets when substituted in place of y, since it\'s being multiplied by 2.', misconceptionId: 'substitution-bracket-error' },
      { question: 'After solving a system and finding x = 3, what should you do next?', options: ['Substitute x=3 back into an original equation to find y', 'Stop — x=3 is the complete answer', 'Solve the second equation for x again to double check', 'Report only x=3 as the solution'], correctIndex: 0, explanation: 'A system\'s solution is a PAIR (x,y) — finding x alone is incomplete.', misconceptionId: 'stop-after-one-variable' },
    ],
    confidenceCheckPrompt: 'How confident do you feel solving a system using substitution, including checking your answer in both equations?',
  },

  demonstrateChunk2: {
    explanation:
      'The elimination method: add or subtract the two equations to make one variable cancel out completely. First, check whether a variable\'s coefficients already match (same size, opposite or same sign) — if not, scale one or both equations by multiplying EVERY term by a number until they do. Then add (if signs are opposite) or subtract (if signs are the same) to eliminate that variable, solve for the remaining one, then substitute back. Occasionally, elimination leads to a strange result: 0 = (some nonzero number) means the lines are parallel and there\'s NO solution; 0 = 0 means the two equations describe the SAME line, so there are infinitely many solutions.',
    workedExamples: [
      { id: 'wx-elimination-aligned', prompt: 'Solve: x + y = 7 and x - y = 1.', steps: [
        { step: 'The y-coefficients (+1 and -1) are already opposite — add the two equations to eliminate y.', justification: 'Adding cancels terms with opposite signs.' },
        { step: '(x+y) + (x-y) = 7+1 → 2x = 8 → x = 4.', justification: 'The y terms cancel, leaving one equation in x.' },
        { step: 'Substitute x=4 into x+y=7: 4+y=7 → y=3.', justification: 'Find the second variable.' },
      ], answer: '(x, y) = (4, 3)' },
      { id: 'wx-elimination-scaling', prompt: 'Solve: 2x + y = 5 and x + 3y = 5.', steps: [
        { step: 'The x-coefficients (2 and 1) don\'t match. Scale the second equation by 2 (every term): 2x + 6y = 10.', justification: 'Scaling makes the x-coefficients equal, ready to eliminate x.' },
        { step: 'Subtract the first equation from the scaled second: (2x+6y) - (2x+y) = 10 - 5 → 5y = 5 → y = 1.', justification: 'The x terms cancel since both coefficients are now 2.' },
        { step: 'Substitute y=1 into x + 3y = 5: x + 3 = 5 → x = 2.', justification: 'Find the remaining variable.' },
      ], answer: '(x, y) = (2, 1)' },
      { id: 'wx-no-solution', prompt: 'Solve: x + y = 4 and x + y = 9.', steps: [
        { step: 'Subtract the first equation from the second: (x+y) - (x+y) = 9 - 4 → 0 = 5.', justification: 'This is a false statement — a contradiction.' },
        { step: 'A contradiction means the two lines are parallel and never meet.', justification: 'There is no pair (x,y) that can satisfy both equations at once.' },
      ], answer: 'No solution' },
    ],
    knowledgeChecks: [
      { question: 'To eliminate y from 3x + 2y = 10 and x + 2y = 6, what should you do?', options: ['Subtract the equations (y-coefficients already match)', 'Add the equations', 'Scale the second equation by 3', 'Divide the first equation by 2'], correctIndex: 0, explanation: 'Both y-coefficients are +2 (same sign), so SUBTRACTING cancels y.', misconceptionId: 'elimination-wrong-variable-cancels' },
      { question: 'Elimination on a system leads to the result 0 = 0. What does this mean?', options: ['Infinitely many solutions — the equations describe the same line', 'No solution', 'Exactly one solution, (0,0)', 'An error was made'], correctIndex: 0, explanation: 'A true statement like 0=0 means the two equations are equivalent — every point on the line is a solution.', misconceptionId: 'solution-type-confusion' },
    ],
    confidenceCheckPrompt: 'How confident do you feel using elimination, including scaling equations and interpreting unusual results?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'substitution-method', revealSteps: 3, prompt: 'Solve: y = x + 2 and 2x + y = 11.', steps: [
        { step: 'Substitute y = x+2 into the second equation: 2x + (x+2) = 11.', justification: 'Replace y with its expression.' },
        { step: 'Solve: 3x + 2 = 11 → 3x = 9 → x = 3.', justification: 'One-variable equation.' },
        { step: 'Substitute back: y = 3 + 2 = 5.', justification: 'Find y.' },
      ], answer: '(x, y) = (3, 5)' },
      { id: 'fp-partial-1', objectiveId: 'elimination-method', revealSteps: 1, prompt: 'Solve: 3x + y = 14 and x - y = 2.', steps: [
        { step: 'The y-coefficients (+1 and -1) are opposite — add the equations.', justification: 'This eliminates y.' },
        { step: '4x = 16 → x = 4. Substitute into x-y=2: 4-y=2 → y=2.', justification: 'Solve then back-substitute.' },
      ], answer: '(x, y) = (4, 2)' },
      { id: 'fp-independent-1', objectiveId: 'identify-solution-type', revealSteps: 0, prompt: 'Solve: 2x + y = 6 and 4x + 2y = 12. What type of solution does this system have?', steps: [
        { step: 'Scale the first equation by 2: 4x + 2y = 12 — identical to the second equation.', justification: 'The two equations describe the exact same line.' },
        { step: 'This means infinitely many solutions.', justification: 'Every point on the line satisfies both equations.' },
      ], answer: 'Infinitely many solutions' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'substitution-method', question: 'Solve: y = 3x - 1 and x + y = 11.', options: ['(3, 8)', '(8, 3)', '(3, 10)', '(4, 11)'], correctIndex: 0, hints: { strategic: 'Substitute the first equation into the second.', procedural: 'x + (3x-1) = 11 → 4x - 1 = 11 → 4x = 12 → x=3.', workedStep: 'y = 3(3)-1 = 8. Solution: (3,8).' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'check-both-equations', question: 'A student finds (x,y) = (2,5) for a system and only checks it in the first equation. What should they do next?', options: ['Also check it in the second original equation', 'Nothing further is needed', 'Re-solve using only the second equation', 'Assume it\'s correct since one equation worked'], correctIndex: 0, hints: { strategic: 'What makes a solution valid for a SYSTEM of equations?', procedural: 'It must satisfy BOTH equations, not just one.', workedStep: 'Substitute (2,5) into the second equation too, to confirm.' }, distractorMisconceptions: { 1: 'check-only-one-equation' } },
      { id: 'ip-3', objectiveId: 'elimination-method', question: 'Solve: x + 3y = 11 and x - y = 3.', options: ['(5, 2)', '(2, 5)', '(3, 3)', '(11, 3)'], correctIndex: 0, hints: { strategic: 'Subtract the equations to eliminate x.', procedural: '(x+3y)-(x-y) = 11-3 → 4y = 8 → y=2.', workedStep: 'Substitute: x - 2 = 3 → x = 5. Solution: (5,2).' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'identify-solution-type', question: 'Elimination on a system produces the result 0 = 6. What does this mean?', options: ['No solution', 'Infinitely many solutions', 'Exactly one solution', 'x = 6'], correctIndex: 0, hints: { strategic: 'Is 0 = 6 a true or false statement?', procedural: 'It\'s false — a contradiction.', workedStep: 'A contradiction means the lines are parallel: no solution.' }, distractorMisconceptions: { 1: 'solution-type-confusion' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'substitution-method', multiSelect: false, question: 'Solve: y = x + 5 and 2x + y = 17.', options: ['(4, 9)', '(9, 4)', '(4, 17)', '(6, 11)'], correctIndices: [0], explanation: 'Substitute: 2x + (x+5) = 17 → 3x = 12 → x=4. y = 4+5 = 9.', distractorMisconceptions: {} },
    { id: 'q2', type: 'true-false', objectiveId: 'substitution-method', multiSelect: false, question: 'True or false: when substituting y = 5 - 2x into 3y = 9, you should write 3(5-2x) = 9.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — the whole expression must be bracketed when substituted, especially when multiplied by another number.', distractorMisconceptions: {} },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'elimination-method', multiSelect: false, question: 'Solve: 2x + y = 9 and x - y = 3.', options: ['(4, 1)', '(1, 4)', '(3, 3)', '(6, -3)'], correctIndices: [0], explanation: 'Add the equations (y-coefficients +1 and -1 are opposite): 3x = 12 → x=4. Then y = 9-2(4) = 1.', distractorMisconceptions: {} },
    { id: 'q4', type: 'true-false', objectiveId: 'elimination-method', multiSelect: false, question: 'True or false: to eliminate x from 2x+y=8 and x+3y=9, you must scale the second equation by 2, multiplying every term.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — scaling means multiplying EVERY term (x, 3y, and 9) by 2, giving 2x+6y=18.', distractorMisconceptions: {} },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'identify-solution-type', multiSelect: false, question: 'Elimination on a system gives 0 = 0. What does this mean?', options: ['Infinitely many solutions', 'No solution', 'Exactly one solution', 'An arithmetic error occurred'], correctIndices: [0], explanation: '0=0 is always true — it means the two equations describe the same line, so every point on it is a solution.', distractorMisconceptions: {} },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'identify-solution-type', multiSelect: false, question: 'Elimination on a system gives 0 = -4. What does this mean?', options: ['No solution', 'Infinitely many solutions', 'x = -4', 'y = 0'], correctIndices: [0], explanation: '0=-4 is false (a contradiction) — the lines are parallel and never intersect, so there is no solution.', distractorMisconceptions: {} },
    { id: 'q7', type: 'true-false', objectiveId: 'check-both-equations', multiSelect: false, question: 'True or false: checking a solution in just one of the two original equations is enough to confirm it is correct.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the solution must satisfy BOTH original equations to be confirmed correct.', distractorMisconceptions: { 0: 'check-only-one-equation' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'elimination-method', multiSelect: true, question: 'For x + 2y = 8 and 3x + 2y = 16, which steps are valid for elimination? (select all that apply)', options: ['Subtract the first equation from the second to eliminate y', 'Add the equations directly (no scaling needed) to eliminate y', 'Scale the first equation by 3 to eliminate x by subtracting', 'Divide the second equation by 2 first'], correctIndices: [0, 2], explanation: 'Subtracting directly eliminates y since both y-coefficients are already +2. Alternatively, scaling the first equation by 3 (to 3x+6y=24) sets up eliminating x by subtracting.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'elimination-method',
      analogy: 'Think of elimination like a tug-of-war where you want one variable\'s "team" to cancel out completely. Before pulling (adding or subtracting), check that both sides have matching strength (equal-sized coefficients) on that variable — scaling an equation is like adding more players to one side until the teams match.',
      explanation: 'Step-by-step: (1) look at the coefficients of the variable you want to eliminate; (2) if they don\'t match in size, scale one or both equations (multiplying EVERY term) until they do; (3) add if the signs are opposite, subtract if the signs are the same; (4) solve the single remaining variable; (5) substitute back to find the other one.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Solve: x + 4y = 14 and 3x + 4y = 22.', steps: [
          { step: 'The y-coefficients (+4 and +4) already match — subtract to eliminate y.', justification: 'Same-sign matching coefficients cancel when subtracted.' },
          { step: '(3x+4y) - (x+4y) = 22-14 → 2x = 8 → x = 4.', justification: 'The y terms cancel, leaving one equation in x.' },
          { step: 'Substitute x=4 into x+4y=14: 4+4y=14 → 4y=10 → y=2.5.', justification: 'Find the second variable.' },
        ], answer: '(x, y) = (4, 2.5)' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'elimination-method', question: 'Solve: x + y = 10 and x - y = 2.', options: ['(6, 4)', '(4, 6)', '(5, 5)', '(8, 2)'], correctIndex: 0, hints: { strategic: 'The y-coefficients are already opposite — add.', procedural: '2x = 12 → x=6.', workedStep: 'y = 10-6 = 4. Solution: (6,4).' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'elimination-method', question: 'Solve: 2x + y = 13 and 2x - 3y = -3.', options: ['(4.5, 4)', '(4, 4.5)', '(5, 3)', '(3, 7)'], correctIndex: 0, hints: { strategic: 'The x-coefficients already match (+2 and +2) — subtract.', procedural: '(2x+y)-(2x-3y) = 13-(-3) → 4y = 16 → y=4.', workedStep: 'Substitute: 2x+4=13 → 2x=9 → x=4.5. Solution: (4.5, 4).' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'elimination-method', question: 'Solve: x + 2y = 7 and 2x + 2y = 10.', options: ['(3, 2)', '(2, 3)', '(4, 1)', '(1, 4)'], correctIndex: 0, hints: { strategic: 'The y-coefficients already match — subtract.', procedural: '(2x+2y)-(x+2y) = 10-7 → x = 3.', workedStep: 'Substitute: 3+2y=7 → 2y=4 → y=2. Solution: (3,2).' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'Which method felt more natural: substitution or elimination?', type: 'multiple-choice', options: ['Substitution', 'Elimination', 'Both felt similar', 'Neither felt comfortable yet'] },
    { id: 'r2', prompt: 'How confident do you feel solving simultaneous equations now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you always do before finalising a system\'s solution?', type: 'free-text' },
  ],
};
