import { supabaseAdmin } from './supabase';

// ── Curated topic catalog ────────────────────────────────────────
// Ordered, predefined topics per subject+grade+term, matching the official
// CAPS (Curriculum and Assessment Policy Statement) Annual Teaching Plan —
// NOT the Library's current page list, which only covers a subset of topics.
// Each catalog topic carries its own ready-made, auto-graded question set —
// a teacher picks a topic and assigns it, no authoring required.
// Extend this map as more subjects/terms/topics get pre-built content.

export type CognitiveLevel = 'knowledge' | 'routine' | 'complex' | 'problem_solving';

export interface CatalogQuestion {
  subskillLabel: string;   // must match one entry in `subskills` below
  question_type: 'mcq' | 'short_answer' | 'open_text';
  prompt: string;
  cognitive_level: CognitiveLevel;
  options?: string[];       // mcq only
  correct_answer?: string;  // required for mcq/short_answer, omitted for open_text (teacher marks manually)
  answer_tolerance?: number; // short_answer only
  distractor_notes?: Record<string, string>; // mcq only — wrong option text -> misconception it reveals
  memo_answer?: string; // open_text only — model answer/marking guidance shown to the teacher, toggleable, not graded automatically
}

export interface CatalogTopic {
  topicKey: string;         // stable slug used as topic_key, e.g. "AlgebraicExpressions"
  label: string;            // display name, e.g. "Algebraic Expressions"
  subskills: string[];      // fixed diagnostic taxonomy, in order
  questions: CatalogQuestion[];
}

// Keyed by `${subject_code}-${grade}-${term}`.
// Grade 10 Mathematics — one CatalogTopic per lettered textbook subsection
// (finer-grained than a whole CAPS unit), grouped into terms per school pacing:
// Term 1: Unit 1 Equations & Inequalities, Unit 2 Exponents & Surds, Unit 3 Number Patterns.
// Term 2: Unit 4 Factorization, Unit 5 Quadratic Equations.
// Term 3: Unit 6 Functions, Unit 7 Finance, Unit 8 Probability.
const TOPIC_CATALOG: Record<string, CatalogTopic[]> = {
  'math-10-1': [
    // ── Unit 1: Equations & Inequalities ──
    {
      topicKey: 'OneVariableLinearEquations',
      label: 'One Variable Linear Equations',
      subskills: [
        'Isolating the variable (addition/subtraction)',
        'Isolating the variable (multiplication/division)',
        'Equations with brackets',
        'Equations with the variable on both sides',
        'Justifying and checking a solution',
      ],
      questions: [
        // Isolating the variable (addition/subtraction)
        { subskillLabel: 'Isolating the variable (addition/subtraction)', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To solve x + 7 = 12, what should you do to both sides of the equation?',
          options: ['Subtract 7', 'Add 7', 'Multiply by 7', 'Divide by 7'], correct_answer: 'Subtract 7',
          distractor_notes: {
            'Add 7': 'Confuses "undoing" an operation with repeating it — doesn\'t see subtraction as the inverse of addition.',
            'Multiply by 7': 'Defaults to multiplication/division as the only tool for "solving", regardless of the operation present.',
            'Divide by 7': 'Same pattern — reaches for division without checking which operation is actually in the equation.',
          } },
        { subskillLabel: 'Isolating the variable (addition/subtraction)', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve for x: x - 9 = 14. Give the value of x only.', correct_answer: '23' },
        { subskillLabel: 'Isolating the variable (addition/subtraction)', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve for x: 3x + 5 = 20. Give the value of x only.', correct_answer: '5' },
        // Isolating the variable (multiplication/division)
        { subskillLabel: 'Isolating the variable (multiplication/division)', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Solve for x: 5x - 7 = 18',
          options: ['x = 5', 'x = 3', 'x = 25', 'x = 11'], correct_answer: 'x = 5',
          distractor_notes: {
            'x = 3': 'Divided 18 by 5 first (getting the wrong "target"), ignoring the -7 term — an order-of-operations reversal error.',
            'x = 25': 'Added 7 and 18 correctly to get 25, but forgot to divide by 5 — stopped one step early.',
            'x = 11': 'Treated -7 as if it were +7 (sign error) before dividing.',
          } },
        { subskillLabel: 'Isolating the variable (multiplication/division)', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve for x: x/4 + 3 = 10. Give the value of x only.', correct_answer: '28' },
        { subskillLabel: 'Isolating the variable (multiplication/division)', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve for x: (2x - 3)/5 = 3. Give the value of x only.', correct_answer: '9' },
        // Equations with brackets
        { subskillLabel: 'Equations with brackets', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve for x: 2(x - 3) = 10. Give the value of x only.', correct_answer: '8' },
        { subskillLabel: 'Equations with brackets', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Solve for x: 3(x + 2) = 21',
          options: ['x = 5', 'x = 7', 'x = 9', 'x = 3'], correct_answer: 'x = 5',
          distractor_notes: {
            'x = 7': 'Divided 21 by 3 to get 7, then treated that as the final answer — forgot to subtract the 2 that was inside the bracket.',
            'x = 9': 'Added 2 instead of subtracting it after dividing by 3 — sign confusion when reversing the bracket step.',
            'x = 3': 'Distributed incorrectly: read 3(x + 2) as 3x + 2 (only multiplied the first term), then solved 3x + 2 = 21.',
          } },
        { subskillLabel: 'Equations with brackets', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve for x: 3(2x - 1) + 5 = 20. Give the value of x only.', correct_answer: '3' },
        { subskillLabel: 'Equations with brackets', question_type: 'open_text',
          cognitive_level: 'complex',
          prompt: 'A student solved 2(x + 3) = 14 and got x = 4. Explain, in your own words, each step you would take to solve this equation, and show that x = 4 is correct.',
          memo_answer: 'Model answer: Step 1 — distribute: 2(x + 3) = 14 becomes 2x + 6 = 14. Step 2 — subtract 6 from both sides: 2x = 8. Step 3 — divide both sides by 2: x = 4. Check: 2(4 + 3) = 2(7) = 14 ✓. Award full marks for correct distribution, correct isolation steps, and a working check. Partial marks if the method is right but the final check is missing.' },
        // Equations with the variable on both sides
        { subskillLabel: 'Equations with the variable on both sides', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Solve for x: 5x + 2 = 2x + 11',
          options: ['x = 3', 'x = 13/3', 'x = 9', 'x = -3'], correct_answer: 'x = 3',
          distractor_notes: {
            'x = 13/3': 'Moved terms to the wrong sides (added 2x instead of subtracting), producing 7x + 2 = 11 instead of 3x + 2 = 11.',
            'x = 9': 'Subtracted 2 from both sides instead of moving the 2x term first, losing track of which terms have x.',
            'x = -3': 'Sign error when moving the 2x across the equals sign.',
          } },
        { subskillLabel: 'Equations with the variable on both sides', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve for x: 7x - 4 = 3x + 12. Give the value of x only.', correct_answer: '4' },
        // Justifying and checking a solution
        { subskillLabel: 'Justifying and checking a solution', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To check whether x = 4 is the correct solution to 3x - 2 = 10, what should you do?',
          options: ['Substitute x = 4 back into the original equation and check both sides are equal', 'Solve the equation again from scratch', 'Check that x = 4 is a whole number', 'Check that 3x is bigger than 2'],
          correct_answer: 'Substitute x = 4 back into the original equation and check both sides are equal',
          distractor_notes: {
            'Check that x = 4 is a whole number': 'Confuses "reasonable-looking answer" with "verified answer" — doesn\'t understand that checking means substitution.',
          } },
        { subskillLabel: 'Justifying and checking a solution', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A student solved 3x + 5 = 2x + 11 and got x = 16. Substitute x = 16 into both sides of the original equation. Is the student correct? If not, find the correct value of x and explain where the error most likely happened.',
          memo_answer: 'Model answer: Check x = 16: LHS = 3(16)+5 = 53, RHS = 2(16)+11 = 43. 53 ≠ 43, so the student is incorrect. Correct working: 3x + 5 = 2x + 11 → 3x - 2x = 11 - 5 → x = 6. Check: LHS = 3(6)+5 = 23, RHS = 2(6)+11 = 23 ✓. The likely error was adding 5 and 11 (getting 16) instead of correctly isolating x. Award full marks for the correct substitution check, the correct re-solved value, and identifying the likely error.' },
      ],
    },
    {
      topicKey: 'LinearSimultaneousEquations',
      label: 'Linear Simultaneous Equations',
      subskills: [
        'Solving by substitution',
        'Solving by elimination',
        'Interpreting the solution',
      ],
      questions: [
        // Solving by substitution
        { subskillLabel: 'Solving by substitution', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To solve y = x + 2 and x + y = 10 by substitution, what is the correct first step?',
          options: ['Replace y in the second equation with (x + 2)', 'Add the two equations together', 'Subtract the two equations', 'Replace x in the first equation with 10'],
          correct_answer: 'Replace y in the second equation with (x + 2)',
          distractor_notes: {
            'Add the two equations together': 'This is the elimination method, not substitution — confuses the two techniques.',
            'Subtract the two equations': 'Also an elimination-style move, applied when substitution was asked for.',
          } },
        { subskillLabel: 'Solving by substitution', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve simultaneously: y = x + 2 and x + y = 10. Give the value of x only.', correct_answer: '4' },
        { subskillLabel: 'Solving by substitution', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve simultaneously: y = x + 2 and x + y = 10. Give the value of y only.', correct_answer: '6' },
        { subskillLabel: 'Solving by substitution', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve simultaneously: y = 2x - 1 and 3x + y = 14. Give the value of x only.', correct_answer: '3' },
        // Solving by elimination
        { subskillLabel: 'Solving by elimination', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'You want to solve x + y = 10 and x - y = 4 by elimination. What should you do to eliminate y?',
          options: ['Add the two equations', 'Subtract the two equations', 'Multiply the first equation by -1', 'Divide the first equation by y'],
          correct_answer: 'Add the two equations',
          distractor_notes: {
            'Subtract the two equations': 'Subtracting here doubles the y term (since the signs on y are already opposite) instead of cancelling it — a sign-tracking error.',
          } },
        { subskillLabel: 'Solving by elimination', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve simultaneously: x + y = 10 and x - y = 4. Give the value of x only.', correct_answer: '7' },
        { subskillLabel: 'Solving by elimination', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve simultaneously: x + y = 10 and x - y = 4. Give the value of y only.', correct_answer: '3' },
        { subskillLabel: 'Solving by elimination', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve simultaneously: 2x + y = 11 and x - y = 1. Give the value of x only.', correct_answer: '4' },
        // Interpreting the solution
        { subskillLabel: 'Interpreting the solution', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Two numbers have a sum of 18 and a difference of 4. Set up a pair of simultaneous equations to represent this, solve them, and state both numbers clearly.',
          memo_answer: 'Model answer: Let the numbers be x and y. Equations: x + y = 18 and x - y = 4. Adding the equations: 2x = 22, so x = 11. Substituting back: 11 + y = 18, so y = 7. The two numbers are 11 and 7. Award full marks for correctly setting up both equations, solving by either substitution or elimination, and clearly stating both final numbers.' },
      ],
    },
    {
      topicKey: 'InequalitiesOnTheNumberLine',
      label: 'Inequalities On The Number Line',
      subskills: [
        'Reading inequalities from a number line',
        'Representing inequalities on a number line',
        'Distinguishing strict from non-strict inequalities',
      ],
      questions: [
        { subskillLabel: 'Reading inequalities from a number line', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'A number line has a closed (filled-in) dot at 3 with shading to the right. Which inequality does this represent?',
          options: ['x ≥ 3', 'x > 3', 'x ≤ 3', 'x < 3'], correct_answer: 'x ≥ 3',
          distractor_notes: {
            'x > 3': 'Reads the shading direction correctly but ignores that the dot is closed (filled), which means 3 itself is included.',
            'x ≤ 3': 'Gets the boundary type right (closed = included) but reads the shading direction backwards.',
            'x < 3': 'Gets both the dot type and the direction backwards.',
          } },
        { subskillLabel: 'Reading inequalities from a number line', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'A number line has an open (unfilled) dot at -2 with shading to the left. Which inequality does this represent?',
          options: ['x < -2', 'x ≤ -2', 'x > -2', 'x ≥ -2'], correct_answer: 'x < -2',
          distractor_notes: {
            'x ≤ -2': 'Reads the direction correctly but treats the open dot as if it were closed (included).',
          } },
        { subskillLabel: 'Representing inequalities on a number line', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'To represent x ≤ 5 on a number line, what kind of dot should be used at 5?',
          options: ['Closed (filled-in) dot', 'Open (unfilled) dot', 'No dot, just an arrow', 'A square'], correct_answer: 'Closed (filled-in) dot' },
        { subskillLabel: 'Representing inequalities on a number line', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'To represent x > -1 on a number line, which direction should the shading go?',
          options: ['To the right of -1, open dot', 'To the left of -1, open dot', 'To the right of -1, closed dot', 'To the left of -1, closed dot'], correct_answer: 'To the right of -1, open dot',
          distractor_notes: {
            'To the left of -1, open dot': 'Correctly uses an open dot (since > is strict) but shades the wrong direction — treats > as "less than."',
          } },
        { subskillLabel: 'Distinguishing strict from non-strict inequalities', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which of these inequalities would be drawn with an open (unfilled) dot?',
          options: ['x < 4', 'x ≤ 4', 'x ≥ 4', 'x = 4'], correct_answer: 'x < 4',
          distractor_notes: {
            'x ≤ 4': 'Confuses the "or equal to" (≤) symbol with strict inequality — doesn\'t connect the underline in ≤ to "boundary included."',
          } },
      ],
    },
    {
      topicKey: 'SolvingLinearInequalities',
      label: 'Solving Linear Inequalities',
      subskills: [
        'Solving basic inequalities',
        'Flipping the sign when multiplying/dividing by a negative',
        'Solving inequalities with brackets',
      ],
      questions: [
        { subskillLabel: 'Solving basic inequalities', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve for x: 2x - 4 > 6. Give your answer in the form x>a, no spaces, e.g. x>3', correct_answer: 'x>5' },
        { subskillLabel: 'Solving basic inequalities', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Solve for x: 4x + 1 ≤ 13',
          options: ['x ≤ 3', 'x ≥ 3', 'x ≤ 4', 'x ≤ 14'], correct_answer: 'x ≤ 3',
          distractor_notes: {
            'x ≥ 3': 'Solves the arithmetic correctly but flips the inequality sign anyway — over-applies the "flip when negative" rule to a case with no negative multiplication/division.',
            'x ≤ 4': 'Divides 13 by 4 to get roughly 3, rounds up incorrectly, or forgets to subtract 1 first.',
          } },
        { subskillLabel: 'Solving basic inequalities', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve for x: 5x - 3 < 2x + 9. Give your answer in the form x<a, no spaces, e.g. x<5', correct_answer: 'x<4' },
        { subskillLabel: 'Flipping the sign when multiplying/dividing by a negative', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Solve for x: -3x < 9 (remember to flip the inequality sign when dividing by a negative)',
          options: ['x > -3', 'x < -3', 'x > 3', 'x < 3'], correct_answer: 'x > -3',
          distractor_notes: {
            'x < -3': 'Divides correctly but forgets to flip the inequality sign when dividing by a negative number — the single most common inequality error.',
            'x > 3': 'Flips the sign correctly but makes a sign error on the number itself (treats -9/-3 as if the negatives cancelled twice).',
          } },
        { subskillLabel: 'Flipping the sign when multiplying/dividing by a negative', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve for x: -2x ≥ 8. Give your answer in the form x<=a, no spaces, e.g. x<=5', correct_answer: 'x<=-4' },
        { subskillLabel: 'Flipping the sign when multiplying/dividing by a negative', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Explain why the inequality sign must flip when you multiply or divide both sides of an inequality by a negative number. Use the example -2x > 6 to illustrate your explanation.',
          memo_answer: 'Model answer: Dividing both sides of -2x > 6 by -2 gives x < -3 (the sign flips). Explanation should cover: multiplying/dividing by a negative reverses the order of numbers on the number line (e.g. 2 > 1, but -2 < -1), so an inequality that was true before must have its direction reversed to stay true. Check: if x = -4, then -2(-4) = 8 > 6 ✓, confirming x < -3 is correct (not x > -3). Award full marks for correctly solving to x<-3, explaining the "reversal on the number line" reasoning, and (ideally) a numeric check.' },
        { subskillLabel: 'Solving inequalities with brackets', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve for x: 2(x - 1) ≥ 3x - 8. Give your answer in the form x<=a, no spaces, e.g. x<=5', correct_answer: 'x<=6' },
      ],
    },
    {
      topicKey: 'MathematicalModelling',
      label: 'Mathematical Modelling',
      subskills: [
        'Translating word problems into equations',
        'Solving modelled equations',
        'Interpreting the answer in context',
      ],
      questions: [
        { subskillLabel: 'Translating word problems into equations', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Thabo is 3 years older than Sipho. If Sipho\'s age is x, which expression represents Thabo\'s age?',
          options: ['x + 3', 'x - 3', '3x', 'x/3'], correct_answer: 'x + 3',
          distractor_notes: {
            'x - 3': 'Reverses the relationship — treats "3 years older" as "3 years younger."',
            '3x': 'Misreads "3 years older" as a multiplicative relationship rather than additive.',
          } },
        { subskillLabel: 'Translating word problems into equations', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'The sum of two consecutive integers is 25. Let the smaller integer be x. Solve for x. Give the value of x only.', correct_answer: '12' },
        { subskillLabel: 'Translating word problems into equations', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Thabo is 3 years older than Sipho. The sum of their ages is 27. Let Sipho\'s age be x. Solve for x. Give the value of x only.', correct_answer: '12' },
        { subskillLabel: 'Solving modelled equations', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A number plus twice the number equals 27. Let the number be x. Solve for x. Give the value of x only.', correct_answer: '9' },
        { subskillLabel: 'Solving modelled equations', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A rectangle is 3 cm longer than it is wide. If its width is w, its area is w(w + 3) = 40. Solve for w (the width), given w must be positive. Give the value of w only.', correct_answer: '5' },
        { subskillLabel: 'Interpreting the answer in context', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A taxi charges a fixed R20 call-out fee plus R8 per kilometre. Write an equation for the total cost C in terms of distance d, then use it to find how far you can travel on a budget of R100. Show your equation and working, and state your final answer with the correct units.',
          memo_answer: 'Model answer: Equation: C = 20 + 8d. Set C = 100: 100 = 20 + 8d → 80 = 8d → d = 10. Final answer: 10 km. Award full marks for the correct equation (fixed fee + rate×distance), correct substitution and solving, and stating the answer in kilometres. Partial marks if the equation is right but the final answer is missing units.' },
      ],
    },
    {
      topicKey: 'LiteralEquationsChangingSubject',
      label: 'Literal Equations, Changing the Subject of a Formula',
      subskills: [
        'Changing the subject of simple formulae',
        'Changing the subject with more than one term',
        'Changing the subject when the variable appears under a root or power',
      ],
      questions: [
        { subskillLabel: 'Changing the subject of simple formulae', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Make v the subject of the formula: s = vt. Give your answer as v=s/t, no spaces', correct_answer: 'v=s/t' },
        { subskillLabel: 'Changing the subject of simple formulae', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Make b the subject of the formula: A = ½bh. Give your answer as b=2A/h, no spaces', correct_answer: 'b=2A/h' },
        { subskillLabel: 'Changing the subject with more than one term', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Make x the subject of the formula: y = 2x + c. Give your answer as x=(y-c)/2, no spaces', correct_answer: 'x=(y-c)/2' },
        { subskillLabel: 'Changing the subject with more than one term', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Make x the subject of the formula: y = mx + c. Give your answer as x=(y-c)/m, no spaces', correct_answer: 'x=(y-c)/m' },
        { subskillLabel: 'Changing the subject when the variable appears under a root or power', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Make r the subject of the formula: A = πr² (solve for r)',
          options: ['r = √(A/π)', 'r = A/π', 'r = √(A)/π', 'r = πA'], correct_answer: 'r = √(A/π)',
          distractor_notes: {
            'r = A/π': 'Divides by π to "undo" the square, but forgets that undoing a square requires a square root, not just dividing.',
            'r = √(A)/π': 'Takes the square root but applies it only to A, forgetting the π must be inside the root too before dividing.',
          } },
        { subskillLabel: 'Changing the subject when the variable appears under a root or power', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'The formula for the period of a pendulum is T = 2π√(L/g). Make L the subject of the formula, showing every step. Explain what you did to "undo" the square root.',
          memo_answer: 'Model answer: Step 1 — divide both sides by 2π: T/(2π) = √(L/g). Step 2 — square both sides to undo the square root: (T/(2π))² = L/g. Step 3 — multiply both sides by g: L = g(T/(2π))², i.e. L = gT²/(4π²). Explanation should state that squaring both sides is the inverse operation of a square root. Award full marks for correct isolation of the root, correct squaring, and correct final rearrangement for L.' },
      ],
    },
    // ── Unit 2: Exponents & Surds ──
    {
      topicKey: 'ExponentsUnit2',
      label: 'Exponents',
      subskills: [
        'Laws of exponents (multiplication and division)',
        'The zero and negative exponent laws',
        'Simplifying exponential expressions with brackets',
      ],
      questions: [
        { subskillLabel: 'Laws of exponents (multiplication and division)', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which law of exponents applies to x³ · x⁵?',
          options: ['Add the exponents: x^(3+5)', 'Multiply the exponents: x^(3×5)', 'Add the bases: (x+x)^8', 'Keep the same exponent: x^5'],
          correct_answer: 'Add the exponents: x^(3+5)',
          distractor_notes: {
            'Multiply the exponents: x^(3×5)': 'Confuses the multiplication-of-like-bases law (add exponents) with the power-of-a-power law (multiply exponents) — the single most common exponent-law mix-up.',
          } },
        { subskillLabel: 'Laws of exponents (multiplication and division)', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Simplify: x³ · x⁵',
          options: ['x⁸', 'x¹⁵', 'x²', '2x⁸'], correct_answer: 'x⁸',
          distractor_notes: {
            'x¹⁵': 'Multiplied the exponents (3×5) instead of adding them.',
            'x²': 'Subtracted the exponents instead of adding — applied the division law to a multiplication problem.',
            '2x⁸': 'Added exponents correctly but also incorrectly added a coefficient of 2, as if combining "2 like terms."',
          } },
        { subskillLabel: 'Laws of exponents (multiplication and division)', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Simplify: 2⁷ ÷ 2³. Give your answer as a single power of 2, no spaces, e.g. 2^7', correct_answer: '2^4' },
        { subskillLabel: 'The zero and negative exponent laws', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the value of any non-zero number raised to the power of 0?',
          options: ['1', '0', 'The number itself', 'Undefined'], correct_answer: '1',
          distractor_notes: {
            '0': 'Assumes "raised to 0" means "multiplied by 0" — confuses the exponent rule with multiplication by zero.',
          } },
        { subskillLabel: 'The zero and negative exponent laws', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Simplify: x⁻³',
          options: ['1/x³', '-x³', '-3x', '1/3x'], correct_answer: '1/x³',
          distractor_notes: {
            '-x³': 'Treats the negative exponent as if it makes the whole term negative, rather than meaning "reciprocal."',
            '-3x': 'Treats the exponent as a coefficient being multiplied, misreading exponent notation entirely.',
          } },
        { subskillLabel: 'The zero and negative exponent laws', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Simplify: 3⁻² . Give your answer as a fraction, no spaces, e.g. 1/4', correct_answer: '1/9' },
        { subskillLabel: 'Simplifying exponential expressions with brackets', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Simplify: (2a³)²',
          options: ['4a⁶', '2a⁶', '4a⁵', '2a⁵'], correct_answer: '4a⁶',
          distractor_notes: {
            '2a⁶': 'Applied the outer power of 2 to the exponent (a³ → a⁶) but forgot to also square the coefficient 2.',
            '4a⁵': 'Squared the coefficient correctly but added the exponents (3+2) instead of multiplying (3×2).',
            '2a⁵': 'Made both errors: didn\'t square the coefficient, and added instead of multiplied the exponents.',
          } },
        { subskillLabel: 'Simplifying exponential expressions with brackets', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Simplify: (3x²y)³. Give your answer in the form ax^by^c, no spaces, e.g. 8x^3y^2', correct_answer: '27x^6y^3' },
        { subskillLabel: 'Simplifying exponential expressions with brackets', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A classmate simplified (2x³)² and got 2x⁶. Explain what they did wrong, and show the correct simplification with full working.',
          memo_answer: 'Model answer: The classmate forgot to square the coefficient — when a whole bracket (2x³) is raised to a power, every factor inside must be raised to that power, including the number 2, not just the variable. Correct working: (2x³)² = 2² × (x³)² = 4 × x⁶ = 4x⁶. Award full marks for identifying the specific error (coefficient not squared) and showing the correct answer 4x⁶ with working.' },
      ],
    },
    {
      topicKey: 'ScientificNotation',
      label: 'Scientific Notation',
      subskills: [
        'Writing large numbers in scientific notation',
        'Writing small numbers in scientific notation',
        'Converting scientific notation back to standard form',
      ],
      questions: [
        { subskillLabel: 'Writing large numbers in scientific notation', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In scientific notation, a × 10^b, what must be true about a?',
          options: ['1 ≤ a < 10', '0 < a < 1', 'a must be a whole number', 'a can be any number'], correct_answer: '1 ≤ a < 10',
          distractor_notes: {
            'a can be any number': 'Doesn\'t know the defining constraint of scientific notation — treats it as just "some number times a power of 10."',
          } },
        { subskillLabel: 'Writing large numbers in scientific notation', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Write 45000 in scientific notation. Give your answer in the form a×10^b, no spaces, e.g. 6.1×10^3', correct_answer: '4.5×10^4' },
        { subskillLabel: 'Writing large numbers in scientific notation', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Write 7200000 in scientific notation. Give your answer in the form a×10^b, no spaces, e.g. 9.1×10^5', correct_answer: '7.2×10^6' },
        { subskillLabel: 'Writing small numbers in scientific notation', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Write 0.0032 in scientific notation. Give your answer in the form a×10^b, no spaces, e.g. 5.1×10^-2', correct_answer: '3.2×10^-3' },
        { subskillLabel: 'Writing small numbers in scientific notation', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Which is the correct scientific notation for 0.00056?',
          options: ['5.6×10⁻⁴', '5.6×10⁴', '0.56×10⁻³', '56×10⁻⁵'], correct_answer: '5.6×10⁻⁴',
          distractor_notes: {
            '5.6×10⁴': 'Gets the "a" value right but uses a positive exponent for a number smaller than 1 — doesn\'t connect "small number" with "negative exponent."',
            '0.56×10⁻³': 'Gets the right order of magnitude but a is not between 1 and 10, showing the constraint on scientific notation isn\'t understood.',
          } },
        { subskillLabel: 'Converting scientific notation back to standard form', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Write 6×10^3 in standard (normal) form. Give the number only.', correct_answer: '6000' },
        { subskillLabel: 'Converting scientific notation back to standard form', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'What is 5×10⁻² in standard form?',
          options: ['0.05', '0.005', '500', '50'], correct_answer: '0.05',
          distractor_notes: {
            '0.005': 'Miscounts the number of decimal places to shift — off by one place.',
            '500': 'Treats the negative exponent as positive, moving the decimal the wrong direction entirely.',
          } },
      ],
    },
    {
      topicKey: 'ExponentialExpressionsAndEquations',
      label: 'Exponential Expressions & Equations',
      subskills: [
        'Rational (fractional) exponents',
        'Solving exponential equations with the same base',
        'Solving exponential equations needing a rewritten base',
      ],
      questions: [
        { subskillLabel: 'Rational (fractional) exponents', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What does the exponent 1/3 in 8^(1/3) tell you to do?',
          options: ['Take the cube root of 8', 'Divide 8 by 3', 'Multiply 8 by 1/3', 'Take the square root of 8, three times'],
          correct_answer: 'Take the cube root of 8',
          distractor_notes: {
            'Divide 8 by 3': 'Treats the exponent as an ordinary fraction to divide by, rather than as a root instruction.',
          } },
        { subskillLabel: 'Rational (fractional) exponents', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Evaluate: 8^(1/3). Give your answer as a whole number.', correct_answer: '2' },
        { subskillLabel: 'Rational (fractional) exponents', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Evaluate: 27^(2/3). Give your answer as a whole number.', correct_answer: '9' },
        { subskillLabel: 'Solving exponential equations with the same base', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve for x: 2^x = 32. Give the value of x only, e.g. 7', correct_answer: '5' },
        { subskillLabel: 'Solving exponential equations with the same base', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Solve for x: 3^x = 81',
          options: ['4', '3', '27', '9'], correct_answer: '4',
          distractor_notes: {
            '3': 'Confuses the base (3) with the answer for x.',
            '27': 'Divides 81 by 3 once and stops, instead of finding how many times 3 must be multiplied to reach 81.',
          } },
        { subskillLabel: 'Solving exponential equations needing a rewritten base', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve for x: 4^x = 32. (Hint: rewrite both sides with base 2 first.) Give the value of x only.', correct_answer: '2.5' },
        { subskillLabel: 'Solving exponential equations needing a rewritten base', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Solve for x: 9^x = 27. Explain why you cannot directly compare exponents until both sides have the same base, and show how you rewrite 9 and 27 to solve it.',
          memo_answer: 'Model answer: Rewrite both sides with base 3: 9 = 3², so 9^x = (3²)^x = 3^(2x). Also 27 = 3³. So the equation becomes 3^(2x) = 3³. Since the bases now match, the exponents must be equal: 2x = 3, so x = 1.5. Explanation should state that you can only equate exponents once both sides share the same base — comparing 9^x = 27 directly (different bases) tells you nothing about x. Award full marks for correctly rewriting both sides in base 3, equating exponents, and solving for x = 1.5.' },
      ],
    },
    {
      topicKey: 'Surds',
      label: 'Surds',
      subskills: [
        'Classifying rational and irrational numbers',
        'Simplifying surds',
        'Adding and subtracting like surds',
      ],
      questions: [
        { subskillLabel: 'Classifying rational and irrational numbers', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which of the following is an irrational number?',
          options: ['√7', '√9', '0.25', '-3'], correct_answer: '√7',
          distractor_notes: {
            '√9': 'Doesn\'t recognise that √9 = 3 exactly, a whole (rational) number — assumes any square root is automatically irrational.',
          } },
        { subskillLabel: 'Classifying rational and irrational numbers', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which of the following is a surd (an irrational root)?',
          options: ['√7', '√16', '√25', '√100'], correct_answer: '√7',
          distractor_notes: {
            '√16': 'Doesn\'t recognise 16 as a perfect square, so incorrectly assumes its root is irrational.',
          } },
        { subskillLabel: 'Simplifying surds', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'What is the first step to simplify √50?',
          options: ['Find the largest perfect square that divides 50 (25)', 'Divide 50 by 2', 'Multiply 50 by 2', 'Find the largest prime number that divides 50'],
          correct_answer: 'Find the largest perfect square that divides 50 (25)' },
        { subskillLabel: 'Simplifying surds', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Simplify: √50. Give your answer in the form a√b, no spaces, e.g. 3√7', correct_answer: '5√2' },
        { subskillLabel: 'Simplifying surds', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Simplify: √12. Give your answer in the form a√b, no spaces, e.g. 4√5', correct_answer: '2√3' },
        { subskillLabel: 'Simplifying surds', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Simplify: √72. Give your answer in the form a√b, no spaces, e.g. 3√8 (use the largest possible perfect square factor)', correct_answer: '6√2' },
        { subskillLabel: 'Adding and subtracting like surds', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Simplify: 3√2 + 5√2',
          options: ['8√2', '8√4', '15√2', '8√8'], correct_answer: '8√2',
          distractor_notes: {
            '8√4': 'Adds the coefficients correctly but also incorrectly "adds" something to the surd part.',
            '15√2': 'Multiplies the coefficients (3×5) instead of adding them — treats like-surd addition as if it were multiplication.',
          } },
        { subskillLabel: 'Adding and subtracting like surds', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Simplify √8 + √18 fully. Explain why you must simplify each surd first before you can add them.',
          memo_answer: 'Model answer: √8 = √(4×2) = 2√2. √18 = √(9×2) = 3√2. Now that both surds have the same "kind" (√2), they can be added: 2√2 + 3√2 = 5√2. Explanation should state that surds can only be combined like terms once they share the same radical part (like √2) — √8 and √18 look different but are secretly both multiples of √2. Award full marks for correctly simplifying both surds and adding them to get 5√2, plus the explanation of why simplifying first is necessary.' },
      ],
    },
    {
      topicKey: 'RationalizingDenominators',
      label: 'Rationalizing Denominators',
      subskills: [
        'Understanding why we rationalize',
        'Rationalizing a single-term surd denominator',
      ],
      questions: [
        { subskillLabel: 'Understanding why we rationalize', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Why do we rationalize a denominator like 1/√2?',
          options: ['By convention, a final answer should not have a surd in the denominator', 'Because √2 is negative', 'Because fractions cannot have decimals in them', 'Because the denominator must always be a whole number greater than 10'],
          correct_answer: 'By convention, a final answer should not have a surd in the denominator' },
        { subskillLabel: 'Rationalizing a single-term surd denominator', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'To rationalize 1/√2, what should you multiply the fraction by?',
          options: ['√2/√2', '2/2', '1/√2', '√2/2'], correct_answer: '√2/√2',
          distractor_notes: {
            '2/2': 'Knows to multiply by "1 in disguise" but picks the wrong form — doesn\'t use the surd itself.',
          } },
        { subskillLabel: 'Rationalizing a single-term surd denominator', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Rationalize the denominator: 1/√2. Give your answer in the form a√b/c, no spaces, e.g. √3/3', correct_answer: '√2/2' },
        { subskillLabel: 'Rationalizing a single-term surd denominator', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Rationalize the denominator: 3/√3. Give your answer in the form a√b, no spaces, e.g. √7', correct_answer: '√3' },
        { subskillLabel: 'Rationalizing a single-term surd denominator', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Rationalize the denominator: 5/√5. Give your answer in the form a√b, no spaces, e.g. √11', correct_answer: '√5' },
      ],
    },
    // ── Unit 3: Number Patterns ──
    {
      topicKey: 'CommonNumberPatterns',
      label: 'Common Number Patterns',
      subskills: [
        'Identifying the type of pattern',
        'Distinguishing linear, quadratic, and geometric patterns',
      ],
      questions: [
        { subskillLabel: 'Identifying the type of pattern', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What makes a number pattern "linear"?',
          options: ['The difference between consecutive terms is constant', 'The ratio between consecutive terms is constant', 'Each term is the sum of the two before it', 'The terms are all perfect squares'],
          correct_answer: 'The difference between consecutive terms is constant',
          distractor_notes: {
            'The ratio between consecutive terms is constant': 'Describes a geometric pattern, not a linear one — confuses the two pattern types.',
          } },
        { subskillLabel: 'Identifying the type of pattern', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What makes a number pattern "geometric"?',
          options: ['The ratio between consecutive terms is constant', 'The difference between consecutive terms is constant', 'The terms increase forever', 'Each term is one more than a perfect square'],
          correct_answer: 'The ratio between consecutive terms is constant' },
        { subskillLabel: 'Distinguishing linear, quadratic, and geometric patterns', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which of the following is a linear number pattern?',
          options: ['3, 7, 11, 15, ...', '2, 4, 8, 16, ...', '1, 4, 9, 16, ...', '1, 2, 4, 7, ...'], correct_answer: '3, 7, 11, 15, ...',
          distractor_notes: {
            '2, 4, 8, 16, ...': 'This is a geometric pattern (constant ratio ×2) — mistaken for linear because it "looks like it\'s growing steadily."',
            '1, 4, 9, 16, ...': 'This is a quadratic pattern (perfect squares) — the first differences (3, 5, 7) aren\'t checked, only the "increasing" surface pattern.',
          } },
        { subskillLabel: 'Distinguishing linear, quadratic, and geometric patterns', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Which of the following is a geometric sequence?',
          options: ['2, 4, 8, 16, ...', '3, 6, 9, 12, ...', '1, 3, 6, 10, ...', '5, 7, 9, 11, ...'], correct_answer: '2, 4, 8, 16, ...',
          distractor_notes: {
            '3, 6, 9, 12, ...': 'Has a constant difference (3), not a constant ratio — confused because the numbers "look similar" to a doubling pattern.',
          } },
        { subskillLabel: 'Distinguishing linear, quadratic, and geometric patterns', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'For the pattern 2, 5, 10, 17, 26, ..., calculate the first differences and the second differences. Based on this, is the pattern linear, quadratic, or geometric? Explain how you know.',
          memo_answer: 'Model answer: First differences: 5-2=3, 10-5=5, 17-10=7, 26-17=9, i.e. 3, 5, 7, 9. Second differences: 5-3=2, 7-5=2, 9-7=2, i.e. constant 2. Since the second differences are constant (not the first differences, and there is no constant ratio), the pattern is quadratic. Award full marks for correct first and second differences, the correct classification (quadratic), and the reasoning that a constant second difference is the defining test for quadratic patterns.' },
      ],
    },
    {
      topicKey: 'LinearArithmeticSequence',
      label: 'Linear/Arithmetic Sequence',
      subskills: [
        'Finding the constant difference',
        'Extending a linear pattern',
        'Determining the general term',
        'Using the general term to find any value',
      ],
      questions: [
        { subskillLabel: 'Finding the constant difference', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the constant difference of the pattern: 4, 9, 14, 19, ... Give the number only.', correct_answer: '5' },
        { subskillLabel: 'Finding the constant difference', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the constant difference of the pattern: 20, 15, 10, 5, ... Give the number only (include the minus sign if negative, e.g. -2)', correct_answer: '-5' },
        { subskillLabel: 'Extending a linear pattern', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Given the pattern 2, 6, 10, 14, ..., what is the next term?', correct_answer: '18' },
        { subskillLabel: 'Extending a linear pattern', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Given the pattern 4, 9, 14, 19, ..., what is the next term?', correct_answer: '24' },
        { subskillLabel: 'Determining the general term', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The general term formula Tₙ = an + b for a linear pattern — what does "a" represent?',
          options: ['The common difference', 'The first term', 'The number of terms', 'The last term'], correct_answer: 'The common difference',
          distractor_notes: {
            'The first term': 'Confuses the coefficient of n (the difference) with T₁ (the starting value) — a common mix-up when reading the formula.',
          } },
        { subskillLabel: 'Determining the general term', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Determine the general term Tₙ of the pattern: 3, 7, 11, 15, ... Give your answer in the form an+b, no spaces, e.g. 2n+3', correct_answer: '4n-1' },
        { subskillLabel: 'Determining the general term', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'What is the general term Tₙ of the pattern 5, 8, 11, 14, ...?',
          options: ['Tₙ = 3n+2', 'Tₙ = 3n-2', 'Tₙ = 2n+3', 'Tₙ = 3n+5'], correct_answer: 'Tₙ = 3n+2',
          distractor_notes: {
            'Tₙ = 3n-2': 'Gets the constant difference (3) right, but picks the wrong sign for b — likely tested T₁ incorrectly (3×1-2=1, not 5).',
            'Tₙ = 3n+5': 'Uses the first term (5) directly as b, instead of solving for b using T₁ = a(1) + b.',
          } },
        { subskillLabel: 'Using the general term to find any value', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A pattern has general term Tₙ = 4n - 1. Find T₂₀. Give the number only.', correct_answer: '79' },
        { subskillLabel: 'Using the general term to find any value', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A pattern has general term Tₙ = 5n + 2. A student says 202 is a term in this pattern. Check whether they are correct by solving for n, and explain your reasoning.',
          memo_answer: 'Model answer: Set Tₙ = 202: 5n + 2 = 202 → 5n = 200 → n = 40. Since n = 40 is a positive whole number, 202 is indeed a term of the pattern (specifically, the 40th term). The student is correct. Explanation should note that n must be a positive integer for the answer to be valid — if solving gave a fraction or negative number, the value would not be a term in the pattern. Award full marks for the correct equation, correct solving to n = 40, and the conclusion that this confirms 202 is a valid term.' },
      ],
    },
    {
      topicKey: 'QuadraticSequence',
      label: 'Quadratic Sequence',
      subskills: [
        'Identifying a quadratic (second-difference) pattern',
        'Calculating first and second differences',
        'Finding the next term',
      ],
      questions: [
        { subskillLabel: 'Identifying a quadratic (second-difference) pattern', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'How do you identify that a number pattern is quadratic?',
          options: ['The second differences are constant', 'The first differences are constant', 'The ratio between terms is constant', 'The terms alternate between odd and even'],
          correct_answer: 'The second differences are constant',
          distractor_notes: {
            'The first differences are constant': 'Describes a linear pattern — hasn\'t made the distinction that quadratic patterns need a second round of differencing.',
          } },
        { subskillLabel: 'Identifying a quadratic (second-difference) pattern', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which of the following patterns is quadratic (has a constant second difference)?',
          options: ['1, 4, 9, 16, ...', '2, 5, 8, 11, ...', '3, 6, 12, 24, ...', '1, 1, 2, 3, 5, ...'], correct_answer: '1, 4, 9, 16, ...',
          distractor_notes: {
            '2, 5, 8, 11, ...': 'This is linear (constant first difference of 3) — mistaken for quadratic without actually checking second differences.',
          } },
        { subskillLabel: 'Calculating first and second differences', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the first differences of the pattern 1, 4, 9, 16, 25. Give them separated by commas with no spaces, e.g. 2,4,6,8', correct_answer: '3,5,7,9' },
        { subskillLabel: 'Calculating first and second differences', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'For the pattern 2, 6, 12, 20, 30, find the second difference (the constant difference between the first differences). Give the number only.', correct_answer: '2' },
        { subskillLabel: 'Finding the next term', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Given the quadratic pattern 1, 4, 9, 16, 25, ..., what is the next term?', correct_answer: '36' },
        { subskillLabel: 'Finding the next term', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Given the pattern 2, 6, 12, 20, 30, ... (differences increase by 2 each time), what is the next term?', correct_answer: '42' },
        { subskillLabel: 'Finding the next term', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'For the pattern 5, 9, 15, 23, 33, ..., calculate the first and second differences, confirm the pattern is quadratic, and use that to find the next term. Show all your working.',
          memo_answer: 'Model answer: First differences: 9-5=4, 15-9=6, 23-15=8, 33-23=10, i.e. 4, 6, 8, 10. Second differences: 6-4=2, 8-6=2, 10-8=2, i.e. constant 2 — confirms the pattern is quadratic. Since first differences increase by 2 each time, the next first difference is 10+2=12, so the next term is 33+12=45. Award full marks for correct first/second differences, correctly confirming quadratic, and correctly extending to find 45.' },
      ],
    },
    {
      topicKey: 'GeometricSequence',
      label: 'Geometric Sequence',
      subskills: [
        'Identifying the constant ratio',
        'Finding the next term',
        'Distinguishing geometric growth from linear growth',
      ],
      questions: [
        { subskillLabel: 'Identifying the constant ratio', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the constant ratio of the geometric pattern: 2, 6, 18, 54, ... Give the number only.', correct_answer: '3' },
        { subskillLabel: 'Identifying the constant ratio', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the constant ratio of the geometric pattern: 80, 40, 20, 10, ... Give your answer as a decimal, e.g. 0.25', correct_answer: '0.5' },
        { subskillLabel: 'Finding the next term', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Given the geometric pattern 3, 6, 12, 24, ..., what is the next term?', correct_answer: '48' },
        { subskillLabel: 'Finding the next term', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Given the geometric pattern 2, 6, 18, 54, ..., what is the next term?', correct_answer: '162' },
        { subskillLabel: 'Distinguishing geometric growth from linear growth', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'A pattern starts at 4 and each term is double the one before it: 4, 8, 16, 32... After 10 terms, is the growth better described as linear or geometric, and why?',
          options: ['Geometric — it grows by a constant ratio (×2), so it accelerates rapidly', 'Linear — it grows by adding a constant amount each time', 'Geometric — because the numbers are all even', 'Linear — because the pattern is predictable'],
          correct_answer: 'Geometric — it grows by a constant ratio (×2), so it accelerates rapidly',
          distractor_notes: {
            'Linear — because the pattern is predictable': 'Confuses "predictable/rule-based" with "linear" — doesn\'t connect the term to the specific constant-difference definition.',
          } },
      ],
    },
  ],
  'math-10-2': [
    // ── Unit 4: Factorization ──
    {
      topicKey: 'ProductsOfFactors',
      label: 'Products Of Factors',
      subskills: [
        'Expanding two binomials',
        'Expanding a binomial and a trinomial',
        'Squaring a binomial',
      ],
      questions: [
        { subskillLabel: 'Expanding two binomials', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'When expanding (x + 2)(x + 3), what method ensures every term is multiplied correctly?',
          options: ['Multiply each term in the first bracket by each term in the second (FOIL)', 'Multiply only the first terms together', 'Add the two brackets together', 'Multiply only the last terms together'],
          correct_answer: 'Multiply each term in the first bracket by each term in the second (FOIL)' },
        { subskillLabel: 'Expanding two binomials', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Expand: (x + 2)(x + 3)',
          options: ['x² + 5x + 6', 'x² + 6x + 5', 'x² + 5x + 5', 'x² + 6'], correct_answer: 'x² + 5x + 6',
          distractor_notes: {
            'x² + 6x + 5': 'Swaps the coefficient of x (5) with the constant term (6) — multiplied the outer/inner terms correctly but transposed the results.',
            'x² + 5x + 5': 'Gets the middle term right but multiplies 2×3 incorrectly as if adding (2+3=5) instead of multiplying (2×3=6).',
            'x² + 6': 'Only multiplies the first terms (x×x) and last terms (2×3), skipping the middle (outer+inner) terms entirely.',
          } },
        { subskillLabel: 'Expanding two binomials', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Expand: (x - 4)(x + 4). Give the answer in the form x^2-a, no spaces, e.g. x^2-9', correct_answer: 'x^2-16' },
        { subskillLabel: 'Expanding a binomial and a trinomial', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Expand: 3x(x + 4). Give the answer in the form ax^2+bx (no spaces), e.g. 5x^2+10x', correct_answer: '3x^2+12x' },
        { subskillLabel: 'Expanding a binomial and a trinomial', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Expand: (x + 1)(x² + 2x + 3). Give the answer in the form x^3+ax^2+bx+c, no spaces, e.g. x^3+2x^2+4x+1', correct_answer: 'x^3+3x^2+5x+3' },
        { subskillLabel: 'Squaring a binomial', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Expand: (x + 3)²',
          options: ['x² + 6x + 9', 'x² + 9', 'x² + 3x + 9', 'x² + 6x + 3'], correct_answer: 'x² + 6x + 9',
          distractor_notes: {
            'x² + 9': 'Treats (x + 3)² as x² + 3² — skips the middle term entirely, the single most common squaring-a-binomial error.',
            'x² + 3x + 9': 'Gets the constant term right but only adds one copy of the cross term (3x) instead of two (2×3x = 6x).',
          } },
        { subskillLabel: 'Squaring a binomial', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A student says (x + 5)² = x² + 25. Explain why this is wrong, and show the correct expansion with full working.',
          memo_answer: 'Model answer: (x + 5)² means (x + 5)(x + 5), not just squaring each term separately. Correct working: (x + 5)(x + 5) = x² + 5x + 5x + 25 = x² + 10x + 25. The student\'s error is forgetting the middle "cross" terms (5x + 5x = 10x) that come from multiplying the two different terms together. Award full marks for identifying this specific error and showing the correct expansion x² + 10x + 25.' },
      ],
    },
    {
      topicKey: 'Factorization',
      label: 'Factorization',
      subskills: [
        'Common factor extraction',
        'Difference of two squares',
      ],
      questions: [
        { subskillLabel: 'Common factor extraction', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the first step when factorising any expression?',
          options: ['Check for a common factor in every term', 'Look for a difference of two squares', 'Guess two numbers that multiply to the constant', 'Divide every term by x'],
          correct_answer: 'Check for a common factor in every term' },
        { subskillLabel: 'Common factor extraction', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Factorise fully: 4x + 8. Give your answer in the form a(x+b), no spaces, e.g. 4(x+2)', correct_answer: '4(x+2)' },
        { subskillLabel: 'Common factor extraction', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Factorise: 6x² + 9x',
          options: ['3x(2x+3)', '3(2x²+3x)', '6x(x+9)', 'x(6x+9)'], correct_answer: '3x(2x+3)',
          distractor_notes: {
            '3(2x²+3x)': 'Takes out a numeric common factor of 3 but forgets that x is also common to both terms — leaves x un-factored.',
            '6x(x+9)': 'Takes out x correctly but uses the wrong numeric factor (6 instead of 3), and divides 9x by 6x incorrectly.',
          } },
        { subskillLabel: 'Difference of two squares', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which expression is a "difference of two squares" and can be factorised using (a+b)(a-b)?',
          options: ['x² - 9', 'x² + 9', 'x² - 3x', 'x² - 9x + 20'], correct_answer: 'x² - 9',
          distractor_notes: {
            'x² + 9': 'A sum (not difference) of two squares — cannot be factorised this way over the reals, but this is often confused with x² - 9.',
          } },
        { subskillLabel: 'Difference of two squares', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Factorise fully: x² - 9. Give your answer in the form (x+a)(x-a), no spaces, e.g. (x+7)(x-7)', correct_answer: '(x+3)(x-3)' },
        { subskillLabel: 'Difference of two squares', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Factorise fully: 4x² - 25. Give your answer in the form (ax+b)(ax-b), no spaces, e.g. (3x+4)(3x-4)', correct_answer: '(2x+5)(2x-5)' },
      ],
    },
    {
      topicKey: 'FactorizationOfTrinomials',
      label: 'Factorization of Trinomials',
      subskills: [
        'Factorising trinomials with leading coefficient 1',
        'Factorising trinomials with a leading coefficient other than 1',
      ],
      questions: [
        { subskillLabel: 'Factorising trinomials with leading coefficient 1', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To factorise x² + 7x + 10 into (x+a)(x+b), what must a and b satisfy?',
          options: ['a × b = 10 and a + b = 7', 'a × b = 7 and a + b = 10', 'a + b = 7 and a - b = 10', 'a × b = 17'],
          correct_answer: 'a × b = 10 and a + b = 7',
          distractor_notes: {
            'a × b = 7 and a + b = 10': 'Swaps which number is the product and which is the sum — confuses the roles of the constant term and the coefficient of x.',
          } },
        { subskillLabel: 'Factorising trinomials with leading coefficient 1', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Factorise: x² + 7x + 10. Give your answer in the form (x+a)(x+b), no spaces, e.g. (x+1)(x+6)', correct_answer: '(x+2)(x+5)' },
        { subskillLabel: 'Factorising trinomials with leading coefficient 1', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Factorise: x² - 5x + 6',
          options: ['(x-2)(x-3)', '(x+2)(x+3)', '(x-1)(x-6)', '(x-2)(x+3)'], correct_answer: '(x-2)(x-3)',
          distractor_notes: {
            '(x+2)(x+3)': 'Finds the correct pair of numbers (2 and 3) but uses the wrong signs — the constant term is positive so both signs must match the middle term\'s sign (both negative here), not be assumed positive.',
            '(x-2)(x+3)': 'Uses mismatched signs, which would give a negative constant term (-6), not +6.',
          } },
        { subskillLabel: 'Factorising trinomials with a leading coefficient other than 1', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Factorise: 2x² + 5x + 2. Give your answer in the form (ax+b)(x+c), no spaces, e.g. (3x+1)(x+4)', correct_answer: '(2x+1)(x+2)' },
        { subskillLabel: 'Factorising trinomials with a leading coefficient other than 1', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Factorise: 3x² + 7x + 2',
          options: ['(3x+1)(x+2)', '(3x+2)(x+1)', '(x+1)(3x+2)', '(3x+7)(x+2)'], correct_answer: '(3x+1)(x+2)',
          distractor_notes: {
            '(3x+2)(x+1)': 'Swaps which factor pairs with which — expanding this gives 3x² + 5x + 2, not 3x² + 7x + 2, showing the middle term wasn\'t checked by expanding back.',
          } },
        { subskillLabel: 'Factorising trinomials with a leading coefficient other than 1', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Factorise 2x² + 5x + 2 and then verify your answer is correct by expanding it back out. Show both the factorisation and the verification.',
          memo_answer: 'Model answer: Factorise: 2x² + 5x + 2 = (2x + 1)(x + 2). Verification by expanding: (2x + 1)(x + 2) = 2x² + 4x + x + 2 = 2x² + 5x + 2 ✓, matching the original expression. Award full marks for the correct factorisation and a genuine expansion check (not just restating the answer) that matches the original.' },
      ],
    },
    {
      topicKey: 'MultiplicationDivisionRationalExpressions',
      label: 'Multiplication and Division of Rational Expressions',
      subskills: [
        'Multiplying algebraic fractions',
        'Dividing algebraic fractions',
        'Simplifying by cancelling common factors',
      ],
      questions: [
        { subskillLabel: 'Multiplying algebraic fractions', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To multiply two algebraic fractions, what do you do?',
          options: ['Multiply numerators together and denominators together', 'Multiply numerators, add denominators', 'Find a common denominator first', 'Cross-multiply'],
          correct_answer: 'Multiply numerators together and denominators together',
          distractor_notes: {
            'Find a common denominator first': 'Confuses the rule for adding fractions with the rule for multiplying them — a common denominator is not needed for multiplication.',
          } },
        { subskillLabel: 'Multiplying algebraic fractions', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Simplify: (x/2) × (4/x). Give the number only.', correct_answer: '2' },
        { subskillLabel: 'Multiplying algebraic fractions', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Simplify: (2x²)/(3) × (3)/(x). Give your answer in the form ax, no spaces, e.g. 5x', correct_answer: '2x' },
        { subskillLabel: 'Dividing algebraic fractions', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To divide by an algebraic fraction, what should you do?',
          options: ['Multiply by its reciprocal (flip the second fraction)', 'Divide the numerators and divide the denominators', 'Find a common denominator first', 'Multiply both fractions as they are'],
          correct_answer: 'Multiply by its reciprocal (flip the second fraction)' },
        { subskillLabel: 'Dividing algebraic fractions', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Simplify: (x/3) ÷ (x/6). Give the number only.', correct_answer: '2' },
        { subskillLabel: 'Simplifying by cancelling common factors', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Simplify: (6x²)/(3x)',
          options: ['2x', '3x', '2x²', '6x'], correct_answer: '2x',
          distractor_notes: {
            '2x²': 'Cancels the numeric part (6÷3=2) but forgets to also reduce the power of x (x²÷x should give x¹, not x²).',
          } },
        { subskillLabel: 'Simplifying by cancelling common factors', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Simplify: (x² - 4)/(x + 2). (Hint: factorise the numerator first.) Give your answer as x-2, no spaces', correct_answer: 'x-2' },
      ],
    },
    {
      topicKey: 'AdditionSubtractionRationalExpressions',
      label: 'Addition and Subtraction of Rational Expressions',
      subskills: [
        'Adding algebraic fractions with a common denominator',
        'Adding algebraic fractions with different denominators',
      ],
      questions: [
        { subskillLabel: 'Adding algebraic fractions with a common denominator', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Simplify: (2x)/5 + (3x)/5. Give your answer in the form ax/5, no spaces, e.g. 8x/5', correct_answer: '5x/5' },
        { subskillLabel: 'Adding algebraic fractions with a common denominator', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Simplify: (x+2)/(x+2) + (x)/(x+2). Give your answer in the form (ax+b)/(x+2), no spaces, e.g. (3x+1)/(x+2)', correct_answer: '(2x+2)/(x+2)' },
        { subskillLabel: 'Adding algebraic fractions with different denominators', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Before adding two fractions with different denominators, what must you find first?',
          options: ['A common (shared) denominator', 'A common numerator', 'The product of the numerators', 'The difference of the denominators'],
          correct_answer: 'A common (shared) denominator' },
        { subskillLabel: 'Adding algebraic fractions with different denominators', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Simplify: 1/2 + 1/3. Give your answer as a single fraction, no spaces, e.g. 3/4', correct_answer: '5/6' },
        { subskillLabel: 'Adding algebraic fractions with different denominators', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Simplify 1/x + 2/(x+1) into a single fraction. Explain what common denominator you used and why.',
          memo_answer: 'Model answer: Common denominator is x(x+1), since x and (x+1) share no common factor. Rewrite: 1/x = (x+1)/(x(x+1)) and 2/(x+1) = 2x/(x(x+1)). Adding: (x+1+2x)/(x(x+1)) = (3x+1)/(x(x+1)). Award full marks for correctly identifying x(x+1) as the common denominator, correctly rewriting both fractions over it, and correctly combining the numerators.' },
      ],
    },
    // ── Unit 5: Quadratic Equations (Grade 10 scope: factorisation method only) ──
    {
      topicKey: 'SolvingQuadraticEquationsByFactorization',
      label: 'Solving Quadratic Equations by Factorization',
      subskills: [
        'Setting a quadratic equation to zero',
        'Solving by factorising',
        'Solving quadratics with a common factor only',
        'Interpreting solutions in context',
      ],
      questions: [
        { subskillLabel: 'Setting a quadratic equation to zero', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Before factorising to solve a quadratic equation, what must one side of the equation equal?',
          options: ['0', '1', 'x', 'The largest coefficient'], correct_answer: '0',
          distractor_notes: {
            '1': 'Confuses "solving by factorising" with a different technique — doesn\'t understand why zero specifically matters (it\'s because if a product is zero, at least one factor must be zero).',
          } },
        { subskillLabel: 'Setting a quadratic equation to zero', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Rearrange x² + 3x = 4 so that one side equals 0. Give your answer in the form x^2+ax-b=0, no spaces, e.g. x^2+2x-7=0', correct_answer: 'x^2+3x-4=0' },
        { subskillLabel: 'Solving by factorising', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve for x: x² - 9 = 0. Give both answers separated by a comma with no spaces, smallest first, e.g. -4,4', correct_answer: '-3,3' },
        { subskillLabel: 'Solving by factorising', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Solve for x: x² - 5x + 6 = 0',
          options: ['x = 2 or x = 3', 'x = -2 or x = -3', 'x = 1 or x = 6', 'x = 2 or x = -3'], correct_answer: 'x = 2 or x = 3',
          distractor_notes: {
            'x = -2 or x = -3': 'Factorises correctly to (x-2)(x-3)=0 but reads off the roots with the wrong sign — forgets that (x-2)=0 gives x=+2, not x=-2.',
          } },
        { subskillLabel: 'Solving quadratics with a common factor only', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Solve for x: x² - 5x = 0 (hint: factorise out the common factor x first)',
          options: ['x = 0 or x = 5', 'x = 5 only', 'x = 0 only', 'x = 0 or x = -5'], correct_answer: 'x = 0 or x = 5',
          distractor_notes: {
            'x = 5 only': 'Divides both sides by x to get x - 5 = 0, forgetting that dividing by a variable can silently discard a valid solution (x = 0) — a classic algebra pitfall.',
          } },
        { subskillLabel: 'Solving quadratics with a common factor only', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve for x: 2x² + 6x = 0. Give both answers separated by a comma with no spaces, smallest first, e.g. -5,0', correct_answer: '-3,0' },
        { subskillLabel: 'Interpreting solutions in context', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A rectangle has length (x + 3) and width x. Its area is 40 square units. Set up and solve a quadratic equation to find x, and explain why only one of the two mathematical solutions makes sense in this context.',
          memo_answer: 'Model answer: Area equation: x(x+3) = 40, i.e. x² + 3x - 40 = 0. Factorise: (x+8)(x-5) = 0, so x = -8 or x = 5. Since x represents a width (a physical length), it cannot be negative, so x = -8 is rejected. The valid solution is x = 5 (width = 5, length = 8). Award full marks for the correct equation, correct factorisation/solving, and the explanation that a negative length is not physically meaningful.' },
      ],
    },
    // ── Perfect Square Trinomials ──
    {
      topicKey: 'PerfectSquareTrinomials',
      label: 'Perfect Square Trinomials',
      subskills: [
        'Recognising a perfect square trinomial',
        'Factorising a perfect square trinomial',
        'Expanding a perfect square in reverse to check factorisation',
      ],
      questions: [
        { subskillLabel: 'Recognising a perfect square trinomial', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What makes x² + 6x + 9 a "perfect square trinomial"?',
          options: ['It factorises to (x + 3)², i.e. a binomial squared', 'It has three terms', 'The constant term is a perfect square', 'The middle term is even'],
          correct_answer: 'It factorises to (x + 3)², i.e. a binomial squared',
          distractor_notes: {
            'The constant term is a perfect square': 'Being a perfect square number (9 = 3²) is necessary but not sufficient — x² + 5x + 9 also has a perfect-square constant but is not a perfect square trinomial, since the middle term must also match (2×3=6).',
          } },
        { subskillLabel: 'Recognising a perfect square trinomial', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which of these is a perfect square trinomial?',
          options: ['x² + 10x + 25', 'x² + 8x + 25', 'x² + 10x + 20', 'x² + 5x + 25'], correct_answer: 'x² + 10x + 25',
          distractor_notes: {
            'x² + 8x + 25': 'The constant (25 = 5²) is right, but 2×5=10, not 8 — the middle term doesn\'t match, so this does not factorise as a perfect square.',
          } },
        { subskillLabel: 'Factorising a perfect square trinomial', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Factorise: x² + 10x + 25. Give your answer in the form (x+a)^2, no spaces, e.g. (x+2)^2', correct_answer: '(x+5)^2' },
        { subskillLabel: 'Factorising a perfect square trinomial', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Factorise: 4x² - 12x + 9. Give your answer in the form (ax-b)^2, no spaces, e.g. (3x-1)^2', correct_answer: '(2x-3)^2' },
        { subskillLabel: 'Expanding a perfect square in reverse to check factorisation', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A student factorised x² - 14x + 49 as (x - 7)². Verify this is correct by expanding (x - 7)² fully, showing every step.',
          memo_answer: 'Model answer: (x - 7)² = (x - 7)(x - 7) = x² - 7x - 7x + 49 = x² - 14x + 49 ✓, which matches the original expression. Award full marks for a genuine full expansion (not just restating the answer) that correctly arrives back at x² - 14x + 49.' },
      ],
    },
    // ── Sum and Difference of Two Cubes ──
    {
      topicKey: 'SumDifferenceOfCubes',
      label: 'Sum and Difference of Two Cubes',
      subskills: [
        'Recognising a sum/difference of cubes',
        'Applying the sum/difference of cubes formula',
      ],
      questions: [
        { subskillLabel: 'Recognising a sum/difference of cubes', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which expression is a "difference of two cubes"?',
          options: ['x³ - 8', 'x² - 9', 'x³ + 8', 'x³ - 3x'], correct_answer: 'x³ - 8',
          distractor_notes: {
            'x² - 9': 'This is a difference of two squares (x² - 3²), not cubes — a common confusion between the two special-product patterns.',
          } },
        { subskillLabel: 'Recognising a sum/difference of cubes', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'The formula for factorising a³ - b³ is:',
          options: ['(a - b)(a² + ab + b²)', '(a - b)(a² - ab + b²)', '(a - b)²(a + b)', '(a - b)(a + b)²'],
          correct_answer: '(a - b)(a² + ab + b²)',
          distractor_notes: {
            '(a - b)(a² - ab + b²)': 'Gets the first bracket right but flips the sign of the middle term in the second bracket — the correct pattern uses +ab in the "difference of cubes" formula (the sign pattern is opposite to what many students expect).',
          } },
        { subskillLabel: 'Applying the sum/difference of cubes formula', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Factorise: x³ - 8. Give your answer in the form (x-a)(x^2+ax+b), no spaces, e.g. (x-1)(x^2+x+1)', correct_answer: '(x-2)(x^2+2x+4)' },
        { subskillLabel: 'Applying the sum/difference of cubes formula', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Factorise: x³ + 27. Give your answer in the form (x+a)(x^2-ax+b), no spaces, e.g. (x+2)(x^2-2x+4)', correct_answer: '(x+3)(x^2-3x+9)' },
      ],
    },
    // ── Simplifying More Complex Rational Expressions ──
    {
      topicKey: 'ComplexRationalExpressions',
      label: 'Simplifying More Complex Rational Expressions',
      subskills: [
        'Factorising before simplifying a rational expression',
        'Simplifying expressions requiring full factorisation of numerator and denominator',
        'Identifying restrictions (values that make the denominator zero)',
      ],
      questions: [
        { subskillLabel: 'Factorising before simplifying a rational expression', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Before simplifying a rational expression like (x²-9)/(x+3), what should you do first?',
          options: ['Factorise the numerator and/or denominator fully', 'Multiply both sides by the denominator', 'Cancel the x terms directly', 'Add 3 to both the numerator and denominator'],
          correct_answer: 'Factorise the numerator and/or denominator fully',
          distractor_notes: {
            'Cancel the x terms directly': 'You cannot cancel individual terms across addition/subtraction — only common factors of the whole numerator and whole denominator can be cancelled, which is why factorising first is essential.',
          } },
        { subskillLabel: 'Simplifying expressions requiring full factorisation of numerator and denominator', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Simplify: (x² - 4)/(x² + 5x + 6). Give your answer in the form (x-a)/(x+b), no spaces, e.g. (x-1)/(x+2)', correct_answer: '(x-2)/(x+3)' },
        { subskillLabel: 'Simplifying expressions requiring full factorisation of numerator and denominator', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Simplify: (x² - 25)/(x² - 3x - 10). Give your answer in the form (x-a)/(x-b), no spaces, e.g. (x-1)/(x-6)', correct_answer: '(x-5)/(x+2)' },
        { subskillLabel: 'Identifying restrictions (values that make the denominator zero)', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'For the expression (x+3)/(x-4), for which value of x is the expression undefined?',
          options: ['x = 4', 'x = -3', 'x = 0', 'x = -4'], correct_answer: 'x = 4',
          distractor_notes: {
            'x = -3': 'Confuses the restriction (denominator = 0) with the numerator\'s zero — the expression is undefined only where the denominator is 0, not the numerator.',
          } },
        { subskillLabel: 'Identifying restrictions (values that make the denominator zero)', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'For the expression (x² - 4)/(x² - x - 6), find all restrictions (values of x for which the expression is undefined), and explain why you must find these BEFORE simplifying the expression.',
          memo_answer: 'Model answer: Factorise the denominator: x² - x - 6 = (x-3)(x+2). Restrictions: x ≠ 3 and x ≠ -2 (these make the denominator zero). Explanation: after simplifying, the (x+2) factor may cancel with a matching factor in the numerator, hiding the fact that x = -2 was originally undefined — restrictions must be identified from the ORIGINAL (unsimplified) denominator, not the simplified one, otherwise a restriction can be lost. Award full marks for both correct restrictions and the explanation of why they must be found before simplifying.' },
      ],
    },
    // ── Solving Equations Involving Algebraic Fractions ──
    {
      topicKey: 'EquationsWithFractions',
      label: 'Solving Equations Involving Algebraic Fractions',
      subskills: [
        'Clearing fractions using the lowest common denominator',
        'Solving the resulting equation',
        'Checking solutions against restrictions',
      ],
      questions: [
        { subskillLabel: 'Clearing fractions using the lowest common denominator', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To solve the equation x/2 + x/3 = 5, what is the most efficient first step?',
          options: ['Multiply every term by 6 (the LCD of 2 and 3)', 'Add 2 and 3 to get a denominator of 5', 'Cross-multiply the two fractions', 'Subtract x/3 from both sides first'],
          correct_answer: 'Multiply every term by 6 (the LCD of 2 and 3)' },
        { subskillLabel: 'Solving the resulting equation', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Solve for x: x/2 + x/3 = 5. Give the value of x only.', correct_answer: '6' },
        { subskillLabel: 'Solving the resulting equation', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Solve for x: (x+1)/3 - (x-1)/4 = 1. Give the value of x only.', correct_answer: '5' },
        { subskillLabel: 'Checking solutions against restrictions', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'When solving an equation like 3/(x-2) = 6, why must you check your final answer against the equation\'s restrictions?',
          options: ['Because a solution that makes the original denominator zero must be rejected, even if the algebra seems to "solve" it', 'Because all algebraic equations require a check regardless of type', 'Because fractions always have two solutions', 'Because the LCD method never gives a correct answer without checking'],
          correct_answer: 'Because a solution that makes the original denominator zero must be rejected, even if the algebra seems to "solve" it' },
        { subskillLabel: 'Checking solutions against restrictions', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Solve for x: 2/(x-3) = 4/(x+1). Show your working, and confirm your solution does not violate any restriction (a value that would make either denominator zero).',
          memo_answer: 'Model answer: Cross-multiply: 2(x+1) = 4(x-3) → 2x + 2 = 4x - 12 → 14 = 2x → x = 7. Restrictions: x ≠ 3 and x ≠ -1 (from the original denominators). Since x = 7 does not equal 3 or -1, it is a valid solution. Award full marks for correct cross-multiplication, correct solving to x = 7, and explicitly checking x = 7 against both restrictions.' },
      ],
    },
  ],

  // Grade 10 Algebra — Term 3: Trigonometry (ratios, functions, 2D
  // applications), Finance & Growth (interest, depreciation), and an intro to
  // Statistics/Probability — the real CAPS Term 3 spread for Grade 10 Maths.
  'math-10-3': [
    {
      topicKey: 'TrigRatiosBasics',
      label: 'Trigonometric Ratios (SOH CAH TOA)',
      subskills: [
        'Naming the sides of a right-angled triangle',
        'Applying sine, cosine, and tangent ratios',
        'Using a calculator to find trig ratios and angles',
      ],
      questions: [
        { subskillLabel: 'Naming the sides of a right-angled triangle', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In a right-angled triangle, what is the "hypotenuse"?',
          options: ['The longest side, opposite the right angle', 'The side opposite the angle being considered', 'The side next to the angle being considered', 'The shortest side'],
          correct_answer: 'The longest side, opposite the right angle' },
        { subskillLabel: 'Naming the sides of a right-angled triangle', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'For a given angle θ in a right-angled triangle (not the right angle itself), which side is "opposite" θ?',
          options: ['The side directly across from θ, not touching it', 'The longest side of the triangle', 'The side touching both θ and the right angle', 'There is no opposite side'],
          correct_answer: 'The side directly across from θ, not touching it',
          distractor_notes: {
            'The side touching both θ and the right angle': 'This describes the "adjacent" side, not the "opposite" side — a very common mix-up when first learning SOH CAH TOA.',
          } },
        { subskillLabel: 'Applying sine, cosine, and tangent ratios', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which ratio is defined as "opposite over hypotenuse"?',
          options: ['sine (sin)', 'cosine (cos)', 'tangent (tan)', 'None of these'], correct_answer: 'sine (sin)' },
        { subskillLabel: 'Applying sine, cosine, and tangent ratios', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'In a right-angled triangle, the side opposite angle θ is 6 cm and the hypotenuse is 10 cm. Find sin(θ) as a decimal. Give the number only, e.g. 0.2', correct_answer: '0.6' },
        { subskillLabel: 'Applying sine, cosine, and tangent ratios', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'In a right-angled triangle, the side adjacent to angle θ is 8 cm and the side opposite is 6 cm. Find tan(θ) as a decimal. Give the number only, e.g. 1.2', correct_answer: '0.75' },
        { subskillLabel: 'Using a calculator to find trig ratios and angles', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'If sin(θ) = 0.5, how would you find θ using a calculator?',
          options: ['Use the inverse sine function, sin⁻¹(0.5)', 'Multiply 0.5 by 90', 'Divide 90 by 0.5', 'Square 0.5'],
          correct_answer: 'Use the inverse sine function, sin⁻¹(0.5)' },
        { subskillLabel: 'Using a calculator to find trig ratios and angles', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'If sin(θ) = 0.5, find θ (in degrees, between 0° and 90°). Give the number only.', correct_answer: '30' },
      ],
    },
    {
      topicKey: 'RightTriangleApplications',
      label: 'Solving Right-Angled Triangles',
      subskills: [
        'Finding a missing side using trig ratios',
        'Finding a missing angle using trig ratios',
        'Solving real-world height/distance problems',
      ],
      questions: [
        { subskillLabel: 'Finding a missing side using trig ratios', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A right-angled triangle has a hypotenuse of 10 cm and an angle of 30°. Find the length of the side opposite this angle. Give your answer to 1 decimal place, in cm. (Hint: opposite = hypotenuse × sin(angle))', correct_answer: '5.0' },
        { subskillLabel: 'Finding a missing angle using trig ratios', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A right-angled triangle has an opposite side of 5 cm and a hypotenuse of 10 cm. Find the angle θ (to the nearest degree). Give the number only, in degrees.', correct_answer: '30' },
        { subskillLabel: 'Solving real-world height/distance problems', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A ladder leans against a wall, making an angle of 60° with the ground. The foot of the ladder is 2 m from the wall. Find the height the ladder reaches up the wall (to 1 decimal place), showing which trig ratio you used and why.',
          memo_answer: 'Model answer: The angle (60°) is between the ground and the ladder, so the 2 m distance from the wall is the side ADJACENT to this angle, and the height up the wall is the OPPOSITE side. Since we know the adjacent side and want the opposite side, we use tan(θ) = opposite/adjacent. tan(60°) = height/2, so height = 2 × tan(60°) = 2 × 1.732 = 3.5 m (to 1 decimal place). Award full marks for correctly identifying tan as the right ratio (with reasoning about adjacent/opposite), and the correct calculation.' },
      ],
    },
    {
      topicKey: 'SimpleCompoundInterest',
      label: 'Simple and Compound Interest',
      subskills: [
        'Distinguishing simple from compound interest',
        'Calculating simple interest',
        'Calculating compound interest',
      ],
      questions: [
        { subskillLabel: 'Distinguishing simple from compound interest', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the key difference between simple and compound interest?',
          options: ['Compound interest is calculated on the accumulated amount (principal + interest); simple interest is always calculated only on the original principal', 'Simple interest is always higher than compound interest', 'Compound interest can only be used for loans, not savings', 'There is no real difference between them'],
          correct_answer: 'Compound interest is calculated on the accumulated amount (principal + interest); simple interest is always calculated only on the original principal' },
        { subskillLabel: 'Calculating simple interest', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The formula for simple interest is A = P(1 + in), where P is the principal, i is the interest rate, and n is:',
          options: ['The number of years/periods', 'The final amount', 'The interest rate as a percentage', 'The number of times interest is compounded per year'],
          correct_answer: 'The number of years/periods' },
        { subskillLabel: 'Calculating simple interest', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'R1000 is invested at a simple interest rate of 8% per year for 3 years. Find the final amount using A = P(1 + in). Give the number only, in Rand.', correct_answer: '1240' },
        { subskillLabel: 'Calculating compound interest', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The formula for compound interest is A = P(1 + i)ⁿ. What does the exponent n represent here?',
          options: ['The number of compounding periods', 'The principal amount', 'The interest rate', 'The final amount'],
          correct_answer: 'The number of compounding periods' },
        { subskillLabel: 'Calculating compound interest', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'R1000 is invested at a compound interest rate of 10% per year for 2 years. Find the final amount using A = P(1 + i)ⁿ. Give the number only, in Rand.', correct_answer: '1210' },
        { subskillLabel: 'Calculating compound interest', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'R5000 is invested for 2 years at 10% per year. Calculate the final amount under simple interest AND under compound interest, and explain why the compound interest amount is higher.',
          memo_answer: 'Model answer: Simple interest: A = 5000(1 + 0.10×2) = 5000(1.20) = R6000. Compound interest: A = 5000(1 + 0.10)² = 5000(1.21) = R6050. The compound interest amount (R6050) is higher than the simple interest amount (R6000) because in year 2, compound interest is calculated on the new total (R5500, including year 1\'s interest), earning "interest on interest," whereas simple interest is calculated only on the original R5000 every year. Award full marks for both correct calculations and a clear explanation of "interest on interest."' },
      ],
    },
    {
      topicKey: 'Depreciation',
      label: 'Depreciation',
      subskills: [
        'Understanding straight-line depreciation',
        'Calculating depreciation using the straight-line method',
      ],
      questions: [
        { subskillLabel: 'Understanding straight-line depreciation', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What does "depreciation" mean in a financial context?',
          options: ['The decrease in value of an asset over time', 'The increase in value of an investment over time', 'The total amount of tax paid', 'The interest earned on a savings account'],
          correct_answer: 'The decrease in value of an asset over time' },
        { subskillLabel: 'Calculating depreciation using the straight-line method', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A car worth R200 000 depreciates by a fixed R20 000 per year (straight-line depreciation). Find its value after 3 years. Give the number only, in Rand.', correct_answer: '140000' },
      ],
    },
    {
      topicKey: 'MeasuresOfCentralTendency',
      label: 'Statistics: Measures of Central Tendency',
      subskills: [
        'Calculating the mean',
        'Finding the median',
        'Finding the mode',
      ],
      questions: [
        { subskillLabel: 'Calculating the mean', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'How is the mean of a data set calculated?',
          options: ['Sum of all values ÷ number of values', 'The middle value when data is ordered', 'The most frequently occurring value', 'The largest value minus the smallest value'],
          correct_answer: 'Sum of all values ÷ number of values' },
        { subskillLabel: 'Calculating the mean', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the mean of: 4, 8, 6, 10, 12. Give the number only.', correct_answer: '8' },
        { subskillLabel: 'Finding the median', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the "median" of a data set?',
          options: ['The middle value when the data is arranged in order', 'The average of all the values', 'The most common value', 'The range of the values'],
          correct_answer: 'The middle value when the data is arranged in order' },
        { subskillLabel: 'Finding the median', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the median of: 3, 7, 2, 9, 5. (Hint: order them first.) Give the number only.', correct_answer: '5' },
        { subskillLabel: 'Finding the mode', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the mode of: 2, 4, 4, 6, 8, 4, 2. Give the number only.', correct_answer: '4' },
        { subskillLabel: 'Finding the mode', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A data set is: 5, 5, 6, 7, 8, 9, 60. Calculate the mean and the median. Explain which measure (mean or median) better represents this data set, and why.',
          memo_answer: 'Model answer: Mean = (5+5+6+7+8+9+60)/7 = 100/7 ≈ 14.3. Median = 7 (the middle value when ordered: 5,5,6,7,8,9,60). The median (7) better represents this data set, because the outlier value 60 drags the mean up to 14.3, which is not representative of most of the data (which clusters between 5 and 9). The median is not affected by extreme outliers in the same way. Award full marks for correct mean and median calculations, and a clear explanation of why the median is more representative given the outlier.' },
      ],
    },
    {
      topicKey: 'BasicProbability',
      label: 'Basic Probability',
      subskills: [
        'Calculating simple probability',
        'Using Venn diagrams for probability',
      ],
      questions: [
        { subskillLabel: 'Calculating simple probability', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'How is the probability of an event calculated?',
          options: ['Number of favourable outcomes ÷ total number of possible outcomes', 'Total number of outcomes ÷ number of favourable outcomes', 'Number of favourable outcomes × total number of outcomes', 'Total number of outcomes - number of favourable outcomes'],
          correct_answer: 'Number of favourable outcomes ÷ total number of possible outcomes' },
        { subskillLabel: 'Calculating simple probability', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A standard die is rolled once. Find the probability of rolling an even number. Give your answer as a fraction, no spaces, e.g. 1/6', correct_answer: '1/2' },
        { subskillLabel: 'Using Venn diagrams for probability', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'In a class of 30 learners, 18 play soccer, 12 play netball, and 5 play both sports. Using a Venn diagram approach, find how many learners play NEITHER sport, and explain your reasoning.',
          memo_answer: 'Model answer: Learners playing only soccer = 18 - 5 = 13. Learners playing only netball = 12 - 5 = 7. Learners playing at least one sport = 13 + 7 + 5 (both) = 25. Learners playing neither sport = 30 - 25 = 5. Award full marks for correctly avoiding double-counting the 5 learners who play both sports (a common Venn diagram error) and reaching the correct answer of 5 learners playing neither.' },
      ],
    },
    {
      topicKey: 'SpecialAnglesTrigValues',
      label: 'Special Angles and Exact Trig Values',
      subskills: [
        'Recalling exact trig values for 0°, 30°, 45°, 60°, 90°',
        'Using exact values in calculations',
      ],
      questions: [
        { subskillLabel: 'Recalling exact trig values for 0°, 30°, 45°, 60°, 90°', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the exact value of sin(30°)?',
          options: ['1/2', '√3/2', '1', '0'], correct_answer: '1/2',
          distractor_notes: {
            '√3/2': 'This is the exact value of cos(30°) (or sin(60°)) — the special-angle values for sin and cos at 30°/60° are often swapped by mistake.',
          } },
        { subskillLabel: 'Recalling exact trig values for 0°, 30°, 45°, 60°, 90°', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'What is the exact value of cos(60°)?',
          options: ['1/2', '√3/2', '√2/2', '1'], correct_answer: '1/2' },
        { subskillLabel: 'Using exact values in calculations', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Evaluate: sin(30°) + cos(60°), using exact values (both equal 1/2). Give the answer as a fraction, no spaces, e.g. 3/2', correct_answer: '1' },
      ],
    },
    {
      topicKey: 'PopulationGrowthApplications',
      label: 'Growth and Decay Applications',
      subskills: [
        'Applying the compound growth formula to population growth',
        'Distinguishing growth from decay contexts',
      ],
      questions: [
        { subskillLabel: 'Applying the compound growth formula to population growth', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'A town\'s population grows by 5% per year. Which formula models the population after n years, starting from population P?',
          options: ['A = P(1.05)ⁿ', 'A = P(1 + 0.05n)', 'A = P + 0.05n', 'A = 0.05Pⁿ'], correct_answer: 'A = P(1.05)ⁿ',
          distractor_notes: {
            'A = P(1 + 0.05n)': 'This is the simple-interest style (linear) growth formula — population growth compounds each year, so it needs the exponential form, not a linear one.',
          } },
        { subskillLabel: 'Applying the compound growth formula to population growth', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A town has a population of 10 000 and grows by 5% per year. Find the population after 2 years, to the nearest whole number.', correct_answer: '11025' },
        { subskillLabel: 'Distinguishing growth from decay contexts', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A car worth R300 000 loses 15% of its value every year (compound depreciation). Write the formula for its value after n years, and explain why this is a "decay" formula rather than a "growth" formula.',
          memo_answer: 'Model answer: A = 300000(1 - 0.15)ⁿ = 300000(0.85)ⁿ. This is a decay formula because the base (0.85) is less than 1, meaning the value shrinks with each year rather than growing — growth formulas use a base greater than 1 (like 1.05 for 5% growth), while decay formulas use a base between 0 and 1 (like 0.85 for 15% decay). Award full marks for the correct formula and a clear explanation connecting the base value (less than 1) to decay/shrinking.' },
      ],
    },
    {
      topicKey: 'DispersionMeasures',
      label: 'Statistics: Range and Basic Dispersion',
      subskills: [
        'Calculating the range of a data set',
        'Understanding what dispersion tells us about data',
      ],
      questions: [
        { subskillLabel: 'Calculating the range of a data set', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'How is the "range" of a data set calculated?',
          options: ['Largest value minus smallest value', 'Sum of all values divided by count', 'Middle value when ordered', 'Most frequent value'],
          correct_answer: 'Largest value minus smallest value' },
        { subskillLabel: 'Calculating the range of a data set', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the range of: 12, 5, 18, 9, 3. Give the number only.', correct_answer: '15' },
        { subskillLabel: 'Understanding what dispersion tells us about data', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Two classes have the same mean test score, but Class A has a much larger range than Class B. What does this tell you?',
          options: ['Class A\'s scores are more spread out/varied than Class B\'s', 'Class A performed better on average than Class B', 'Class B has more students than Class A', 'The range has no meaningful interpretation here'],
          correct_answer: 'Class A\'s scores are more spread out/varied than Class B\'s' },
      ],
    },
    {
      topicKey: 'TrigOnTheUnitCircleBasics',
      label: 'Trigonometric Functions: Sine, Cosine Graphs (Intro)',
      subskills: [
        'Reading key features of a sine/cosine graph',
        'Understanding amplitude',
      ],
      questions: [
        { subskillLabel: 'Reading key features of a sine/cosine graph', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the maximum value reached by the basic graph y = sin(x)?',
          options: ['1', '90', '0', 'Undefined'], correct_answer: '1' },
        { subskillLabel: 'Reading key features of a sine/cosine graph', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'At x = 0°, what is the value of y = cos(x)?',
          options: ['1', '0', '-1', '90'], correct_answer: '1',
          distractor_notes: {
            '0': 'Confuses cos(0°) with sin(0°) — sin(0°) = 0, but cos(0°) = 1, since cosine starts at its maximum.',
          } },
        { subskillLabel: 'Understanding amplitude', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'For the graph y = 3sin(x), what is the amplitude?',
          options: ['3', '1', '0', 'Cannot be determined'], correct_answer: '3' },
      ],
    },
  ],

  // Grade 10 Geometry — Term 1: Euclidean Geometry (Siyavula Ch. 7 — Triangles,
  // Quadrilaterals, Midpoint Theorem), following the same CAPS-aligned unit order.
  'geometry-10-1': [
    {
      topicKey: 'TrianglesSimilarCongruent',
      label: 'Triangles: Similar & Congruent',
      subskills: [
        'Identifying congruent triangles',
        'Identifying similar triangles',
        'Applying congruency/similarity to find unknown lengths',
      ],
      questions: [
        { subskillLabel: 'Identifying congruent triangles', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Two triangles have exactly the same shape and size. What is the correct term for this relationship?',
          options: ['Congruent', 'Similar', 'Parallel', 'Supplementary'], correct_answer: 'Congruent',
          distractor_notes: {
            'Similar': 'Confuses "same shape and size" (congruent) with "same shape, different size" (similar) — the single most common terminology mix-up in this topic.',
          } },
        { subskillLabel: 'Identifying congruent triangles', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which condition proves two triangles are congruent by "SSS"?',
          options: ['All three sides equal', 'Two angles equal', 'One side equal', 'All angles equal'], correct_answer: 'All three sides equal',
          distractor_notes: {
            'All angles equal': 'Describes similarity (AAA), not congruency — equal angles alone don\'t guarantee equal size, only equal shape.',
          } },
        { subskillLabel: 'Identifying similar triangles', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Two triangles have the same shape but different sizes, with all corresponding angles equal. What is the correct term for this relationship?',
          options: ['Similar', 'Congruent', 'Perpendicular', 'Adjacent'], correct_answer: 'Similar' },
        { subskillLabel: 'Identifying similar triangles', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'For two triangles to be similar, their corresponding sides must be in the same what?',
          options: ['Proportion (ratio)', 'Sum', 'Difference', 'Product'], correct_answer: 'Proportion (ratio)' },
        { subskillLabel: 'Applying congruency/similarity to find unknown lengths', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Triangle ABC is similar to triangle DEF. AB = 6, DE = 9, and BC = 8. Find EF (use the fact that corresponding sides are in the same ratio). Give the number only.', correct_answer: '12' },
        { subskillLabel: 'Applying congruency/similarity to find unknown lengths', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Triangle PQR is similar to triangle STU, with a scale factor of 3 (STU is 3 times larger). If PQ = 4 cm, explain how you would find ST, and calculate the answer.',
          memo_answer: 'Model answer: Since STU is similar to PQR with a scale factor of 3, every side of STU is 3 times the corresponding side of PQR. ST corresponds to PQ, so ST = 3 × PQ = 3 × 4 = 12 cm. Award full marks for correctly identifying that ST corresponds to PQ and applying the scale factor correctly (multiplying, not dividing).' },
      ],
    },
    {
      topicKey: 'TriangleAngleProperties',
      label: 'Triangle Angle Properties',
      subskills: [
        'Angle sum of a triangle',
        'Exterior angle theorem',
        'Isosceles and equilateral triangle angles',
      ],
      questions: [
        { subskillLabel: 'Angle sum of a triangle', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The three interior angles of any triangle always add up to:',
          options: ['180°', '360°', '90°', '270°'], correct_answer: '180°',
          distractor_notes: {
            '360°': 'Confuses the angle sum of a triangle (180°) with the angle sum of a quadrilateral (360°).',
          } },
        { subskillLabel: 'Angle sum of a triangle', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A triangle has angles of 50° and 70°. Find the size of the third angle. Give the number only, e.g. 45', correct_answer: '60' },
        { subskillLabel: 'Exterior angle theorem', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The exterior angle of a triangle is equal to:',
          options: ['The sum of the two interior opposite angles', 'Half the third angle', 'The third interior angle', '90° minus the third angle'], correct_answer: 'The sum of the two interior opposite angles',
          distractor_notes: {
            'The third interior angle': 'Confuses the exterior angle with its adjacent interior angle (these are actually supplementary — they add to 180°, not equal to each other).',
          } },
        { subskillLabel: 'Exterior angle theorem', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A triangle has two interior opposite angles of 40° and 65°. Find the exterior angle at the third vertex. Give the number only, e.g. 100', correct_answer: '105' },
        { subskillLabel: 'Isosceles and equilateral triangle angles', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In an isosceles triangle, what do you know about the base angles?',
          options: ['They are equal to each other', 'They add up to 90°', 'One of them is always 90°', 'They are always both 60°'],
          correct_answer: 'They are equal to each other',
          distractor_notes: {
            'They are always both 60°': 'Confuses isosceles (two equal sides/angles, any size) with equilateral (all three angles exactly 60°) — a common terminology confusion.',
          } },
        { subskillLabel: 'Isosceles and equilateral triangle angles', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'An isosceles triangle has a top angle of 40° and two equal base angles. Find the size of one base angle. Give the number only.', correct_answer: '70' },
      ],
    },
    {
      topicKey: 'QuadrilateralsProperties',
      label: 'Properties of Quadrilaterals',
      subskills: [
        'Naming quadrilaterals from their properties',
        'Angle sum of a quadrilateral',
        'Properties of parallelograms',
      ],
      questions: [
        { subskillLabel: 'Naming quadrilaterals from their properties', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'A quadrilateral has all four sides equal and all four angles equal to 90°. What is it?',
          options: ['Square', 'Rhombus', 'Trapezium', 'Kite'], correct_answer: 'Square',
          distractor_notes: {
            'Rhombus': 'A rhombus also has four equal sides, but its angles are not necessarily 90° — misses the extra angle condition that makes it specifically a square.',
          } },
        { subskillLabel: 'Naming quadrilaterals from their properties', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'A quadrilateral has two pairs of parallel sides and all four sides equal, but its angles are not 90°. What is it?',
          options: ['Rhombus', 'Rectangle', 'Square', 'Trapezium'], correct_answer: 'Rhombus',
          distractor_notes: {
            'Rectangle': 'A rectangle has two pairs of parallel sides but its angles are all 90° — this describes a rhombus, which trades "right angles" for "all sides equal".',
          } },
        { subskillLabel: 'Angle sum of a quadrilateral', question_type: 'short_answer',
          cognitive_level: 'knowledge',
          prompt: 'The interior angles of any quadrilateral add up to how many degrees? Give the number only.', correct_answer: '360' },
        { subskillLabel: 'Angle sum of a quadrilateral', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A quadrilateral has angles of 90°, 90°, and 85°. Find the fourth angle. Give the number only, e.g. 120', correct_answer: '95' },
        { subskillLabel: 'Properties of parallelograms', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In a parallelogram, what is true of opposite angles?',
          options: ['They are equal', 'They add up to 90°', 'They are always 90°', 'They add up to 180°'], correct_answer: 'They are equal',
          distractor_notes: {
            'They add up to 180°': 'This describes co-interior (adjacent) angles in a parallelogram, not opposite angles — confuses the two angle relationships.',
          } },
        { subskillLabel: 'Properties of parallelograms', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A parallelogram has one angle of 65°. Find all three remaining angles, explaining which property of parallelograms you used for each.',
          memo_answer: 'Model answer: Opposite angles are equal, so the angle opposite the 65° angle is also 65°. Co-interior (adjacent) angles are supplementary (add to 180°), so the two remaining angles are each 180° - 65° = 115°. Final angles: 65°, 115°, 65°, 115°. Award full marks for all three correct angles and correctly naming/using both the "opposite angles equal" and "co-interior angles supplementary" properties.' },
      ],
    },
    {
      topicKey: 'MidpointTheorem',
      label: 'The Midpoint Theorem',
      subskills: [
        'Stating the midpoint theorem',
        'Applying the midpoint theorem to find lengths',
        'Applying the midpoint theorem in multi-step problems',
      ],
      questions: [
        { subskillLabel: 'Stating the midpoint theorem', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The line segment joining the midpoints of two sides of a triangle is _____ to the third side.',
          options: ['Parallel', 'Perpendicular', 'Equal in length to', 'Twice as long as'], correct_answer: 'Parallel',
          distractor_notes: {
            'Perpendicular': 'Confuses "parallel" with "perpendicular" — these are opposite relationships and a common vocabulary slip.',
          } },
        { subskillLabel: 'Stating the midpoint theorem', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The line segment joining the midpoints of two sides of a triangle is what fraction of the third side\'s length?',
          options: ['Half', 'A third', 'Double', 'Equal'], correct_answer: 'Half',
          distractor_notes: {
            'Double': 'Inverts the relationship — remembers there\'s a factor of 2 involved but applies it in the wrong direction (the midpoint segment is half, not double, the third side).',
          } },
        { subskillLabel: 'Applying the midpoint theorem to find lengths', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'In a triangle, the line joining the midpoints of two sides is 8 cm long. Find the length of the third side. Give the number only, in cm.', correct_answer: '16' },
        { subskillLabel: 'Applying the midpoint theorem to find lengths', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'In a triangle, the third side is 24 cm long. Find the length of the line segment joining the midpoints of the other two sides. Give the number only, in cm.', correct_answer: '12' },
        { subskillLabel: 'Applying the midpoint theorem in multi-step problems', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'In triangle ABC, D and E are the midpoints of AB and AC respectively. If DE = 6 cm and BC is 3 times the length of DE\'s "partner" relationship, explain what BC must equal, showing your reasoning using the midpoint theorem.',
          memo_answer: 'Model answer: By the midpoint theorem, DE is parallel to BC and DE = ½ BC. Since DE = 6 cm, BC = 2 × DE = 12 cm (the phrase "3 times... partner relationship" is a distractor detail — the actual theorem relationship is always ×2, regardless of extra wording, so students should rely on the theorem itself, not scan for other multipliers in the question). Award full marks for correctly applying DE = ½ BC to get BC = 12 cm, and for explaining the reasoning rather than just stating the answer.' },
      ],
    },
    // ── Parallel Lines & Angles (a major CAPS Term 1 exam staple — the
    // "calculate the size of angle X, giving reasons" format used throughout
    // SA maths exams) ──
    {
      topicKey: 'ParallelLinesAngles',
      label: 'Parallel Lines and Angle Relationships',
      subskills: [
        'Naming angle relationships (corresponding, alternate, co-interior)',
        'Calculating angles using parallel line rules',
        'Giving correct geometric reasons',
      ],
      questions: [
        { subskillLabel: 'Naming angle relationships (corresponding, alternate, co-interior)', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Two parallel lines are cut by a transversal. Angles that are on the same side of the transversal and in matching positions (one at each intersection) are called:',
          options: ['Corresponding angles', 'Alternate angles', 'Co-interior angles', 'Vertically opposite angles'],
          correct_answer: 'Corresponding angles',
          distractor_notes: {
            'Alternate angles': 'Alternate angles are on opposite sides of the transversal, between the two lines — this describes a different position than "matching, same side."',
          } },
        { subskillLabel: 'Naming angle relationships (corresponding, alternate, co-interior)', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Two parallel lines are cut by a transversal. Angles that lie between the two parallel lines, on the same side of the transversal, are called:',
          options: ['Co-interior angles (allied angles)', 'Alternate angles', 'Corresponding angles', 'Adjacent angles'],
          correct_answer: 'Co-interior angles (allied angles)',
          distractor_notes: {
            'Alternate angles': 'Alternate angles are also between the two lines but on opposite sides of the transversal, not the same side.',
          } },
        { subskillLabel: 'Calculating angles using parallel line rules', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Two parallel lines are cut by a transversal. One angle is 65°. What is the size of its corresponding angle?',
          options: ['65°', '115°', '25°', '180°'], correct_answer: '65°',
          distractor_notes: {
            '115°': 'Calculates the co-interior (supplementary) angle instead of the corresponding (equal) angle — mixes up which angle relationship gives equal vs. supplementary values.',
          } },
        { subskillLabel: 'Calculating angles using parallel line rules', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Two parallel lines are cut by a transversal. One co-interior angle is 70°. Find the other co-interior angle (they are supplementary — add up to 180°). Give the number only, in degrees, e.g. 90', correct_answer: '110' },
        { subskillLabel: 'Calculating angles using parallel line rules', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'AB is parallel to CD. A transversal crosses both lines. The angle at the first intersection is (2x + 10)° and its corresponding angle at the second intersection is (3x - 20)°. Since corresponding angles are equal, solve for x. Give the number only.', correct_answer: '30' },
        { subskillLabel: 'Giving correct geometric reasons', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In a geometry proof, when two angles are equal because they are corresponding angles on parallel lines, which is the correct way to state the reason?',
          options: ['AB ∥ CD (corr∠s, AB∥CD)', 'AB = CD', 'Angles are the same size', 'Because parallel lines never meet'],
          correct_answer: 'AB ∥ CD (corr∠s, AB∥CD)',
          distractor_notes: {
            'Angles are the same size': 'States the conclusion (what you\'re trying to prove) rather than the reason (why it\'s true) — SA exam marking requires the theorem/property name, not a restatement of the result.',
          } },
        { subskillLabel: 'Giving correct geometric reasons', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'In the diagram, AB ∥ CD, and a transversal EF cuts both lines at points G (on AB) and H (on CD). Angle AGH = 75°. Calculate the size of angle GHD (co-interior with angle AGH), and give a reason for your answer, in the format used in South African exams (e.g. "co-int ∠s, AB∥CD").',
          memo_answer: 'Model answer: Angle GHD = 180° - 75° = 105°. Reason: co-int ∠s, AB∥CD (co-interior angles between parallel lines are supplementary). Award full marks for the correct numeric answer (105°) AND a reason given in the exam-convention abbreviated format naming the angle relationship and citing that the lines are parallel — a bare number with no reason, or a reason without the correct angle-relationship name, should not get full marks.' },
      ],
    },
    // ── Proving Types of Quadrilaterals ──
    {
      topicKey: 'ProvingQuadrilateralTypes',
      label: 'Proving Types of Quadrilaterals',
      subskills: [
        'Identifying the property needed to prove a specific quadrilateral type',
        'Using coordinate/length information to prove a quadrilateral type',
        'Distinguishing necessary vs. sufficient conditions',
      ],
      questions: [
        { subskillLabel: 'Identifying the property needed to prove a specific quadrilateral type', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To prove that a quadrilateral is a parallelogram, which single property is sufficient?',
          options: ['Both pairs of opposite sides are parallel', 'One pair of sides is equal', 'All four sides are equal', 'The diagonals are equal'],
          correct_answer: 'Both pairs of opposite sides are parallel',
          distractor_notes: {
            'All four sides are equal': 'This proves a rhombus (a special parallelogram), not just any parallelogram — over-specifies the condition needed.',
            'The diagonals are equal': 'Equal diagonals is a property of rectangles, not a general test for parallelograms.',
          } },
        { subskillLabel: 'Identifying the property needed to prove a specific quadrilateral type', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'To prove a parallelogram is specifically a rectangle, what extra property must you show?',
          options: ['One interior angle is 90°', 'All four sides are equal', 'The diagonals bisect each other', 'Opposite sides are parallel'],
          correct_answer: 'One interior angle is 90°',
          distractor_notes: {
            'The diagonals bisect each other': 'This is already true for any parallelogram — it doesn\'t single out a rectangle specifically.',
            'Opposite sides are parallel': 'Also already true for any parallelogram, so this adds no new information to prove it\'s a rectangle.',
          } },
        { subskillLabel: 'Using coordinate/length information to prove a quadrilateral type', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A quadrilateral has all four sides measured as 7 cm, 7 cm, 7 cm, and 7 cm, with no angles given as 90°. What is the most specific name for this shape? (one word)', correct_answer: 'Rhombus' },
        { subskillLabel: 'Using coordinate/length information to prove a quadrilateral type', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A quadrilateral PQRS has PQ = RS = 8 cm and PQ ∥ RS, but PS ≠ QR. Name this quadrilateral and explain which property proves it, and which property it is missing to be a parallelogram.',
          memo_answer: 'Model answer: This is a trapezium. It has one pair of parallel and equal sides (PQ ∥ RS, PQ = RS), which on its own does NOT guarantee a parallelogram — a parallelogram requires BOTH pairs of opposite sides to be parallel, but here PS ≠ QR (and nothing states PS ∥ QR), so the second pair of sides is neither parallel nor equal. Award full marks for correctly naming it a trapezium and explaining that only one pair of sides meets the parallelogram condition.' },
        { subskillLabel: 'Distinguishing necessary vs. sufficient conditions', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'A student says: "A quadrilateral with one pair of equal sides must be a parallelogram." Is this statement true?',
          options: ['False — one pair of equal sides is not enough; a kite or an irregular quadrilateral could also have this property', 'True — any quadrilateral with equal sides is automatically a parallelogram', 'True — but only if the equal sides are opposite each other', 'False — no quadrilateral can have equal sides unless it is a square'],
          correct_answer: 'False — one pair of equal sides is not enough; a kite or an irregular quadrilateral could also have this property',
          distractor_notes: {
            'True — but only if the equal sides are opposite each other': 'Even with equal AND parallel opposite sides this would prove a parallelogram, but "equal" alone (without also being parallel) is still not sufficient — a kite can have one pair of equal sides without being a parallelogram.',
          } },
      ],
    },
    // ── Kites and Trapeziums ──
    {
      topicKey: 'KitesAndTrapeziums',
      label: 'Properties of Kites and Trapeziums',
      subskills: [
        'Identifying properties of a kite',
        'Identifying properties of a trapezium',
        'Calculating angles in kites and trapeziums',
      ],
      questions: [
        { subskillLabel: 'Identifying properties of a kite', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which property is true of a kite?',
          options: ['It has two pairs of adjacent (next to each other) sides equal', 'All four sides are equal', 'Both pairs of opposite sides are parallel', 'Opposite angles are always equal'],
          correct_answer: 'It has two pairs of adjacent (next to each other) sides equal',
          distractor_notes: {
            'Opposite angles are always equal': 'This is a parallelogram property — a kite only has ONE pair of opposite angles equal (the ones between the unequal sides), not both pairs.',
          } },
        { subskillLabel: 'Identifying properties of a kite', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In a kite, the diagonals intersect at what angle?',
          options: ['90° (they are perpendicular)', '45°', '60°', 'They never intersect'], correct_answer: '90° (they are perpendicular)' },
        { subskillLabel: 'Identifying properties of a trapezium', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What defines a trapezium?',
          options: ['Exactly one pair of opposite sides is parallel', 'Both pairs of opposite sides are parallel', 'All sides are equal', 'It has no parallel sides at all'],
          correct_answer: 'Exactly one pair of opposite sides is parallel',
          distractor_notes: {
            'Both pairs of opposite sides are parallel': 'This describes a parallelogram — a trapezium specifically has only ONE parallel pair, not both.',
          } },
        { subskillLabel: 'Calculating angles in kites and trapeziums', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A trapezium has co-interior angles (on the same leg, between the parallel sides) of 65° and x°. Since co-interior angles between parallel lines are supplementary, find x. Give the number only.', correct_answer: '115' },
        { subskillLabel: 'Calculating angles in kites and trapeziums', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A kite has one pair of opposite angles equal to 100° each (between the unequal sides), and the other two angles are equal to each other. Find the size of each of the other two angles, showing your working.',
          memo_answer: 'Model answer: All four angles of any quadrilateral sum to 360°. Two angles are 100° each, totalling 200°. The remaining 360° - 200° = 160° is shared equally between the other two angles (since they are equal in a kite), so each is 160° ÷ 2 = 80°. Award full marks for using the 360° quadrilateral angle sum and correctly dividing the remainder equally.' },
      ],
    },
    // ── Circle Terminology (Grade 10 introduces basic circle vocabulary
    // before Grade 11's circle theorems) ──
    {
      topicKey: 'CircleTerminology',
      label: 'Circle Terminology and Basic Properties',
      subskills: [
        'Naming parts of a circle',
        'Distinguishing a chord, radius, and diameter',
        'Applying the relationship between radius and diameter',
      ],
      questions: [
        { subskillLabel: 'Naming parts of a circle', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is a "radius" of a circle?',
          options: ['A line from the centre to any point on the circle', 'A line joining any two points on the circle', 'A line joining two points on the circle passing through the centre', 'The outer boundary of the circle'],
          correct_answer: 'A line from the centre to any point on the circle',
          distractor_notes: {
            'A line joining two points on the circle passing through the centre': 'This describes a diameter, not a radius — the radius goes from centre to edge, while a diameter spans edge to edge through the centre.',
          } },
        { subskillLabel: 'Distinguishing a chord, radius, and diameter', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'What is a "chord" of a circle?',
          options: ['A straight line joining any two points on the circle (not necessarily through the centre)', 'A line from the centre to the edge', 'The distance around the circle', 'A line that touches the circle at exactly one point'],
          correct_answer: 'A straight line joining any two points on the circle (not necessarily through the centre)',
          distractor_notes: {
            'A line that touches the circle at exactly one point': 'This describes a tangent, not a chord — a chord has both endpoints ON the circle, while a tangent touches at only one point and lies outside otherwise.',
          } },
        { subskillLabel: 'Distinguishing a chord, radius, and diameter', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Is every diameter also a chord?',
          options: ['Yes — a diameter is a special chord that passes through the centre', 'No — a diameter and a chord are unrelated', 'No — a chord must not pass through the centre', 'Yes, but only in a circle with an even radius'],
          correct_answer: 'Yes — a diameter is a special chord that passes through the centre' },
        { subskillLabel: 'Applying the relationship between radius and diameter', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A circle has a radius of 6 cm. Find its diameter. Give the number only, in cm.', correct_answer: '12' },
        { subskillLabel: 'Applying the relationship between radius and diameter', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A circle has a diameter of 15 cm. Find its radius. Give the number only, in cm.', correct_answer: '7.5' },
      ],
    },
    // ── Area and Perimeter of Triangles and Quadrilaterals ──
    {
      topicKey: 'AreaPerimeterShapes',
      label: 'Area and Perimeter of Triangles and Quadrilaterals',
      subskills: [
        'Calculating the area of a triangle',
        'Calculating the area of a rectangle/square',
        'Calculating the area of a parallelogram or trapezium',
        'Calculating perimeter',
      ],
      questions: [
        { subskillLabel: 'Calculating the area of a triangle', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the formula for the area of a triangle?',
          options: ['½ × base × height', 'base × height', '2 × base × height', 'base + height'], correct_answer: '½ × base × height',
          distractor_notes: {
            'base × height': 'This is the formula for a parallelogram/rectangle, not a triangle — forgets the factor of ½.',
          } },
        { subskillLabel: 'Calculating the area of a triangle', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A triangle has a base of 10 cm and a height of 6 cm. Find its area. Give the number only, in cm².', correct_answer: '30' },
        { subskillLabel: 'Calculating the area of a rectangle/square', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A rectangle has a length of 12 cm and a width of 5 cm. Find its area. Give the number only, in cm².', correct_answer: '60' },
        { subskillLabel: 'Calculating the area of a parallelogram or trapezium', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the formula for the area of a trapezium with parallel sides a and b, and height h?',
          options: ['½ × (a + b) × h', '(a + b) × h', '½ × a × b', 'a × b × h'], correct_answer: '½ × (a + b) × h' },
        { subskillLabel: 'Calculating the area of a parallelogram or trapezium', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A trapezium has parallel sides of 8 cm and 12 cm, and a height of 5 cm. Find its area. Give the number only, in cm².', correct_answer: '50' },
        { subskillLabel: 'Calculating perimeter', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A rectangle has a length of 9 cm and a width of 4 cm. Find its perimeter. Give the number only, in cm.', correct_answer: '26' },
        { subskillLabel: 'Calculating perimeter', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A rectangular garden has an area of 48 m² and a length of 8 m. Find its width, then calculate the perimeter of a fence needed to enclose it. Show all working.',
          memo_answer: 'Model answer: Width = Area ÷ length = 48 ÷ 8 = 6 m. Perimeter = 2(length + width) = 2(8 + 6) = 2(14) = 28 m. Award full marks for correctly finding the width from the area first, then correctly applying the perimeter formula.' },
      ],
    },
    // ── The Theorem of Pythagoras ──
    {
      topicKey: 'PythagorasTheorem',
      label: 'The Theorem of Pythagoras',
      subskills: [
        'Stating the theorem of Pythagoras',
        'Finding the hypotenuse',
        'Finding a missing shorter side',
        'Using Pythagoras to test if a triangle is right-angled',
      ],
      questions: [
        { subskillLabel: 'Stating the theorem of Pythagoras', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The theorem of Pythagoras applies to which type of triangle?',
          options: ['Right-angled triangles only', 'Any triangle', 'Equilateral triangles only', 'Isosceles triangles only'],
          correct_answer: 'Right-angled triangles only' },
        { subskillLabel: 'Stating the theorem of Pythagoras', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In a right-angled triangle with hypotenuse c and shorter sides a and b, the theorem of Pythagoras states:',
          options: ['a² + b² = c²', 'a + b = c', 'a² - b² = c²', 'a² × b² = c²'], correct_answer: 'a² + b² = c²' },
        { subskillLabel: 'Finding the hypotenuse', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'A right-angled triangle has shorter sides of 3 cm and 4 cm. Find the hypotenuse. Give the number only, in cm.', correct_answer: '5' },
        { subskillLabel: 'Finding a missing shorter side', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'A right-angled triangle has a hypotenuse of 13 cm and one shorter side of 5 cm. What is the other shorter side?',
          options: ['12 cm', '18 cm', '8 cm', '169 cm'], correct_answer: '12 cm',
          distractor_notes: {
            '18 cm': 'Adds the hypotenuse and given side (13+5) instead of using c² - a² = b² — treats Pythagoras as addition rather than the correct squared relationship.',
            '8 cm': 'Subtracts 13-5 directly instead of subtracting the squares first (169-25=144, then √144=12) — skips squaring/square-rooting entirely.',
          } },
        { subskillLabel: 'Finding a missing shorter side', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A right-angled triangle has a hypotenuse of 10 cm and one shorter side of 6 cm. Find the other shorter side. Give the number only, in cm.', correct_answer: '8' },
        { subskillLabel: 'Using Pythagoras to test if a triangle is right-angled', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'A triangle has sides 5 cm, 12 cm, and 13 cm. Is it a right-angled triangle?',
          options: ['Yes — 5² + 12² = 13² (25 + 144 = 169)', 'No — the sides don\'t form a right angle', 'Yes, but only if it is also isosceles', 'Cannot be determined without knowing the angles first'],
          correct_answer: 'Yes — 5² + 12² = 13² (25 + 144 = 169)' },
        { subskillLabel: 'Using Pythagoras to test if a triangle is right-angled', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A triangle has sides 7 cm, 9 cm, and 12 cm. Use the converse of the Pythagoras theorem to determine whether this triangle is right-angled, showing your working and reasoning clearly.',
          memo_answer: 'Model answer: Check if the square of the longest side equals the sum of squares of the other two: 12² = 144. 7² + 9² = 49 + 81 = 130. Since 144 ≠ 130, the triangle is NOT right-angled. Award full marks for correctly identifying 12 as the longest side (hypotenuse candidate), correctly computing both sides of the equation, and correctly concluding the triangle is not right-angled since they don\'t match.' },
      ],
    },
  ],

  // Grade 10 Geometry — Term 2: formal theorem proofs (parallelogram
  // properties, congruency proofs, similar triangle proofs) — Term 2 moves
  // from identifying/calculating (Term 1) to proving, the standard CAPS
  // progression within Euclidean Geometry.
  'geometry-10-2': [
    {
      topicKey: 'ParallelogramTheoremProofs',
      label: 'Proving Properties of Parallelograms',
      subskills: [
        'Stating the parallelogram theorems',
        'Proving opposite sides and angles are equal',
        'Proving diagonals bisect each other',
      ],
      questions: [
        { subskillLabel: 'Stating the parallelogram theorems', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which of the following is a property of ALL parallelograms?',
          options: ['Opposite sides are equal and parallel', 'All sides are equal', 'Diagonals are equal in length', 'All angles are 90°'],
          correct_answer: 'Opposite sides are equal and parallel',
          distractor_notes: {
            'Diagonals are equal in length': 'This is a property of rectangles specifically (a special parallelogram), not true for all parallelograms in general.',
          } },
        { subskillLabel: 'Stating the parallelogram theorems', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What do the diagonals of a parallelogram do?',
          options: ['Bisect each other (cut each other in half)', 'Are always equal in length', 'Are always perpendicular', 'Never intersect'],
          correct_answer: 'Bisect each other (cut each other in half)' },
        { subskillLabel: 'Proving opposite sides and angles are equal', question_type: 'open_text',
          cognitive_level: 'complex',
          prompt: 'ABCD is a parallelogram. Prove that AB = CD and that angle A = angle C, using the diagonal BD to create two triangles.',
          memo_answer: 'Model answer: Draw diagonal BD. In triangles ABD and CDB: AB ∥ DC, so angle ABD = angle CDB (alt ∠s, AB∥DC); AD ∥ BC, so angle ADB = angle CBD (alt ∠s, AD∥BC); BD = BD (common side). Therefore triangle ABD ≡ triangle CDB (AAS). Therefore AB = CD and angle A = angle C (corresponding sides/angles of congruent triangles). Award full marks for a complete proof establishing congruency (with correct reasons) and clearly stating the AB=CD and angle A = angle C conclusions.' },
        { subskillLabel: 'Proving diagonals bisect each other', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'ABCD is a parallelogram with diagonals AC and BD intersecting at point E. Prove that AE = EC and BE = ED (the diagonals bisect each other).',
          memo_answer: 'Model answer: In triangles AEB and CED: AB ∥ DC, so angle EAB = angle ECD (alt ∠s, AB∥DC) and angle EBA = angle EDC (alt ∠s, AB∥DC); AB = CD (opposite sides of parallelogram ABCD are equal). Therefore triangle AEB ≡ triangle CED (AAS). Therefore AE = EC and BE = ED (corresponding sides of congruent triangles), proving the diagonals bisect each other. Award full marks for correctly setting up the congruent triangle pair with valid reasons and reaching both bisection conclusions.' },
      ],
    },
    {
      topicKey: 'ProvingAParallelogram',
      label: 'Proving a Quadrilateral is a Parallelogram',
      subskills: [
        'Identifying sufficient conditions to prove a parallelogram',
        'Writing a formal proof using one condition',
      ],
      questions: [
        { subskillLabel: 'Identifying sufficient conditions to prove a parallelogram', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which of these is sufficient, on its own, to prove a quadrilateral is a parallelogram?',
          options: ['One pair of opposite sides is both equal AND parallel', 'One pair of opposite sides is equal (but not necessarily parallel)', 'One diagonal bisects one angle', 'The quadrilateral has four sides'],
          correct_answer: 'One pair of opposite sides is both equal AND parallel',
          distractor_notes: {
            'One pair of opposite sides is equal (but not necessarily parallel)': 'Equal alone is not enough — a quadrilateral can have one pair of equal (but non-parallel) sides without being a parallelogram (e.g. an isosceles trapezium\'s legs).',
          } },
        { subskillLabel: 'Identifying sufficient conditions to prove a parallelogram', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which of these is also sufficient to prove a quadrilateral is a parallelogram?',
          options: ['The diagonals bisect each other', 'The diagonals are equal', 'Two sides are parallel', 'All four angles are equal'],
          correct_answer: 'The diagonals bisect each other',
          distractor_notes: {
            'Two sides are parallel': 'Only one pair being parallel describes a trapezium, not necessarily a parallelogram — both pairs must be parallel (or an equivalent sufficient condition) to guarantee a parallelogram.',
          } },
        { subskillLabel: 'Writing a formal proof using one condition', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Quadrilateral PQRS has diagonals that intersect at point T, with PT = TR and QT = TS. Prove that PQRS is a parallelogram.',
          memo_answer: 'Model answer: In triangles PTQ and RTS: PT = TR (given), QT = TS (given), angle PTQ = angle RTS (vertically opposite angles). Therefore triangle PTQ ≡ triangle RTS (SAS). Therefore PQ = RS and angle TPQ = angle TRS, which are alternate angles, so PQ ∥ RS. Since PQ = RS AND PQ ∥ RS, PQRS is a parallelogram (one pair of opposite sides equal and parallel). Award full marks for correctly proving the congruent triangles, then correctly using both the equal length and the alternate-angle argument for parallel lines to conclude PQRS is a parallelogram.' },
      ],
    },
    {
      topicKey: 'RectangleRhombusSquareProofs',
      label: 'Proving Rectangles, Rhombi, and Squares',
      subskills: [
        'Proving a parallelogram is a rectangle',
        'Proving a parallelogram is a rhombus',
        'Combining conditions to prove a square',
      ],
      questions: [
        { subskillLabel: 'Proving a parallelogram is a rectangle', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To prove a parallelogram is specifically a rectangle, which extra condition must be shown?',
          options: ['One angle is 90°, OR the diagonals are equal', 'All sides are equal', 'The diagonals are perpendicular', 'One pair of sides is longer than the other'],
          correct_answer: 'One angle is 90°, OR the diagonals are equal' },
        { subskillLabel: 'Proving a parallelogram is a rhombus', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To prove a parallelogram is specifically a rhombus, which extra condition must be shown?',
          options: ['All four sides are equal, OR the diagonals are perpendicular', 'One angle is 90°', 'The diagonals are equal', 'Two sides are parallel'],
          correct_answer: 'All four sides are equal, OR the diagonals are perpendicular',
          distractor_notes: {
            'The diagonals are equal': 'Equal diagonals prove a rectangle, not a rhombus — the rhombus test is perpendicular diagonals (or equal sides), a different diagonal property entirely.',
          } },
        { subskillLabel: 'Combining conditions to prove a square', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Parallelogram ABCD has diagonals that are both equal in length AND perpendicular to each other. What shape must ABCD be, and explain your reasoning by combining the relevant theorems.',
          memo_answer: 'Model answer: ABCD must be a square. Reasoning: equal diagonals in a parallelogram prove it is a rectangle (one condition). Perpendicular diagonals in a parallelogram prove it is a rhombus (a different condition). A shape that is BOTH a rectangle AND a rhombus at once must be a square (it has all the properties of both: four right angles AND four equal sides). Award full marks for correctly identifying "square" and explaining that satisfying both the rectangle test and the rhombus test simultaneously is exactly what defines a square.' },
      ],
    },
    {
      topicKey: 'CongruencyProofsTriangles',
      label: 'Formal Congruency Proofs',
      subskills: [
        'Selecting the correct congruency condition (SSS, SAS, AAS, RHS)',
        'Writing a two-column congruency proof',
      ],
      questions: [
        { subskillLabel: 'Selecting the correct congruency condition (SSS, SAS, AAS, RHS)', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Two triangles have two pairs of equal sides and the equal angle is between those two sides. Which congruency condition applies?',
          options: ['SAS (side-angle-side)', 'SSS (side-side-side)', 'AAS (angle-angle-side)', 'RHS (right angle-hypotenuse-side)'],
          correct_answer: 'SAS (side-angle-side)',
          distractor_notes: {
            'AAS (angle-angle-side)': 'AAS requires two angles and a side, not two sides and the included angle — the given information here matches SAS, not AAS.',
          } },
        { subskillLabel: 'Selecting the correct congruency condition (SSS, SAS, AAS, RHS)', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Two right-angled triangles have equal hypotenuses and one other pair of equal sides. Which congruency condition applies?',
          options: ['RHS (right angle-hypotenuse-side)', 'SAS (side-angle-side)', 'AAS (angle-angle-side)', 'SSS (side-side-side)'],
          correct_answer: 'RHS (right angle-hypotenuse-side)' },
        { subskillLabel: 'Writing a two-column congruency proof', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'In triangles MNO and PQR, MN = PQ, angle N = angle Q, and NO = QR. Write a formal proof that triangle MNO ≡ triangle PQR, stating the congruency condition used.',
          memo_answer: 'Model answer: MN = PQ (given), angle N = angle Q (given), NO = QR (given). Therefore triangle MNO ≡ triangle PQR (SAS) — since the equal angle (N and Q) is included between the two pairs of equal sides (MN/PQ and NO/QR). Award full marks for correctly listing all three given equalities with reasons, and correctly identifying SAS (not SSS or AAS) as the matching condition since the equal angle sits between the two equal sides.' },
      ],
    },
    {
      topicKey: 'SimilarTriangleProofs',
      label: 'Formal Similar Triangle Proofs (AA)',
      subskills: [
        'Applying the AA (equiangular) similarity condition',
        'Writing a formal similarity proof',
      ],
      questions: [
        { subskillLabel: 'Applying the AA (equiangular) similarity condition', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To prove two triangles are similar using the "AA" condition, how many pairs of equal angles must you show?',
          options: ['Two (the third pair is then automatically equal)', 'Three', 'One', 'None — similarity cannot be proven with angles alone'],
          correct_answer: 'Two (the third pair is then automatically equal)',
          distractor_notes: {
            'Three': 'Only two pairs need to be shown explicitly — since all triangle angles sum to 180°, the third pair is automatically forced to be equal, so proving three would be redundant work.',
          } },
        { subskillLabel: 'Writing a formal similarity proof', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'In triangles ABC and DEF, angle A = angle D and angle B = angle E. Prove that triangle ABC is similar to triangle DEF, and state what this tells you about the sides.',
          memo_answer: 'Model answer: angle A = angle D (given), angle B = angle E (given). Therefore angle C = angle F (angle sum of a triangle = 180°, third angle in each triangle). Since all three pairs of corresponding angles are equal, triangle ABC ||| triangle DEF (AA, or equiangular). This tells us the corresponding sides are in proportion: AB/DE = BC/EF = AC/DF. Award full marks for correctly deriving the third angle pair, stating the similarity conclusion with correct notation, and correctly stating the proportional-sides consequence.' },
      ],
    },
    {
      topicKey: 'RhombusDiagonalProofs',
      label: 'Proving Rhombus Diagonal Properties',
      subskills: [
        'Proving diagonals of a rhombus are perpendicular',
        'Proving diagonals of a rhombus bisect the angles',
      ],
      questions: [
        { subskillLabel: 'Proving diagonals of a rhombus are perpendicular', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which congruency condition is typically used to prove that the diagonals of a rhombus are perpendicular?',
          options: ['SSS, using the fact that all four sides of a rhombus are equal', 'AAS, using two given angles', 'RHS, using a right angle assumed from the start', 'None — this property cannot be proven, only observed'],
          correct_answer: 'SSS, using the fact that all four sides of a rhombus are equal' },
        { subskillLabel: 'Proving diagonals of a rhombus bisect the angles', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'ABCD is a rhombus with diagonal AC. Prove that AC bisects angle A (splits it into two equal angles), using the fact that all sides of a rhombus are equal.',
          memo_answer: 'Model answer: In triangles ABC and ADC: AB = AD (sides of a rhombus are all equal), BC = DC (sides of a rhombus are all equal), AC = AC (common side). Therefore triangle ABC ≡ triangle ADC (SSS). Therefore angle BAC = angle DAC (corresponding angles of congruent triangles), which means diagonal AC bisects angle A into two equal parts. Award full marks for correctly setting up the SSS congruency with valid reasons and reaching the angle-bisection conclusion.' },
      ],
    },
    {
      topicKey: 'DisprovingWithCounterexamples',
      label: 'Disproving False Geometric Statements',
      subskills: [
        'Identifying why a general statement is false',
        'Constructing a counter-example',
      ],
      questions: [
        { subskillLabel: 'Identifying why a general statement is false', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'A student claims: "If a quadrilateral has two pairs of equal angles, it must be a parallelogram." Why is this false?',
          options: ['A kite can have two pairs of equal angles without being a parallelogram', 'All quadrilaterals with equal angles are automatically parallelograms', 'The statement is actually true and cannot be disproven', 'Equal angles always imply equal sides'],
          correct_answer: 'A kite can have two pairs of equal angles without being a parallelogram' },
        { subskillLabel: 'Constructing a counter-example', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A student claims: "Any quadrilateral with one pair of parallel sides must be a parallelogram." Disprove this by describing a specific counter-example shape.',
          memo_answer: 'Model answer: A trapezium is a counter-example. A trapezium has exactly ONE pair of parallel sides (by definition) but is NOT a parallelogram, since its other pair of sides is not parallel. This directly contradicts the student\'s claim, because a trapezium satisfies "one pair of parallel sides" yet is clearly not a parallelogram. Award full marks for naming trapezium specifically (not just "some other shape") and explaining clearly why it satisfies the condition but fails to be a parallelogram.' },
      ],
    },
    {
      topicKey: 'ConverseMidpointTheorem',
      label: 'The Converse of the Midpoint Theorem',
      subskills: [
        'Stating the converse of the midpoint theorem',
        'Applying the converse to prove a point is a midpoint',
      ],
      questions: [
        { subskillLabel: 'Stating the converse of the midpoint theorem', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The converse of the midpoint theorem states that if a line is drawn through the midpoint of one side of a triangle, parallel to a second side, then:',
          options: ['It bisects the third side (passes through its midpoint)', 'It is perpendicular to the third side', 'It is equal in length to the third side', 'It creates two congruent triangles automatically'],
          correct_answer: 'It bisects the third side (passes through its midpoint)' },
        { subskillLabel: 'Applying the converse to prove a point is a midpoint', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'In triangle ABC, D is the midpoint of AB. A line through D parallel to BC meets AC at point E. Use the converse of the midpoint theorem to explain what this tells you about point E, and find AE if AC = 18 cm.',
          memo_answer: 'Model answer: By the converse of the midpoint theorem, since D is the midpoint of AB and DE ∥ BC, E must be the midpoint of AC. Therefore AE = ½ × AC = ½ × 18 = 9 cm. Award full marks for correctly stating that E is the midpoint (using the converse, not the theorem itself) and correctly calculating AE = 9 cm.' },
      ],
    },
    {
      topicKey: 'MixedProofProblems',
      label: 'Mixed Geometry Proof Problems',
      subskills: [
        'Combining multiple theorems in one proof',
        'Planning a proof strategy before writing it',
      ],
      questions: [
        { subskillLabel: 'Combining multiple theorems in one proof', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Before writing a geometry proof, what is the most useful first step?',
          options: ['Identify what you are asked to prove, then work backwards to see what facts/theorems would establish it', 'Write down every theorem you know, regardless of relevance', 'Start writing the proof immediately without a plan', 'Assume the conclusion is true and prove the given information from it'],
          correct_answer: 'Identify what you are asked to prove, then work backwards to see what facts/theorems would establish it' },
        { subskillLabel: 'Planning a proof strategy before writing it', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'ABCD is a parallelogram. E is the midpoint of AB and F is the midpoint of CD. Prove that AEFD... actually, prove that AECF is also a parallelogram (using the fact that AE = FC and AE ∥ FC).',
          memo_answer: 'Model answer: Since ABCD is a parallelogram, AB ∥ DC, and AB = DC. E is the midpoint of AB, so AE = ½AB. F is the midpoint of CD, so CF = ½DC (equivalently FC = ½CD). Since AB = DC, ½AB = ½DC, therefore AE = FC. Also, since AB ∥ DC (given, as opposite sides of the parallelogram), and E lies on AB while F lies on DC, segment AE is parallel to segment FC (same direction as their parent lines). Since AE = FC AND AE ∥ FC, quadrilateral AECF is a parallelogram (one pair of opposite sides equal and parallel). Award full marks for correctly deriving AE = FC from the midpoints, correctly justifying AE ∥ FC, and correctly applying the "equal and parallel" test to conclude AECF is a parallelogram.' },
      ],
    },
    {
      topicKey: 'RectangleDiagonalProofs',
      label: 'Proving Rectangle Diagonal Properties',
      subskills: [
        'Proving diagonals of a rectangle are equal',
        'Using rectangle diagonal properties to solve for unknowns',
      ],
      questions: [
        { subskillLabel: 'Proving diagonals of a rectangle are equal', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which congruency condition is typically used to prove that the diagonals of a rectangle are equal?',
          options: ['SAS, using two sides and the included 90° angle', 'SSS, using three unrelated sides', 'AA, using only angles', 'This cannot be proven, only assumed'],
          correct_answer: 'SAS, using two sides and the included 90° angle' },
        { subskillLabel: 'Using rectangle diagonal properties to solve for unknowns', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'ABCD is a rectangle with diagonals AC and BD intersecting at E. If AE = 7 cm, find the length of the full diagonal BD, explaining which two properties of a rectangle you used.',
          memo_answer: 'Model answer: In a rectangle, the diagonals are equal (AC = BD) AND bisect each other (so AE = EC = BE = ED). Since AE = 7 cm, and AE = BE (diagonals bisect each other), BE = 7 cm too. Therefore BD = BE + ED = 7 + 7 = 14 cm. Award full marks for correctly using BOTH properties (equal diagonals AND bisection) to justify that BE = 7 cm, and correctly calculating BD = 14 cm.' },
      ],
    },
  ],

  // Grade 10 Geometry — Term 3: Analytical Geometry (distance, midpoint,
  // gradient, parallel/perpendicular lines, collinearity) — the CAPS Term 3
  // coordinate-geometry strand, distinct from Terms 1-2's pure Euclidean proofs.
  'geometry-10-3': [
    {
      topicKey: 'DistanceFormula',
      label: 'The Distance Formula',
      subskills: [
        'Stating the distance formula',
        'Calculating the distance between two points',
      ],
      questions: [
        { subskillLabel: 'Stating the distance formula', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The distance between two points (x₁,y₁) and (x₂,y₂) is calculated using:',
          options: ['√((x₂-x₁)² + (y₂-y₁)²)', '(x₂-x₁) + (y₂-y₁)', '(x₂-x₁)² × (y₂-y₁)²', '(x₁+x₂)/2, (y₁+y₂)/2'],
          correct_answer: '√((x₂-x₁)² + (y₂-y₁)²)',
          distractor_notes: {
            '(x₁+x₂)/2, (y₁+y₂)/2': 'This is the midpoint formula, not the distance formula — a common mix-up between the two coordinate-geometry formulas.',
          } },
        { subskillLabel: 'Calculating the distance between two points', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the distance between A(0,0) and B(3,4). Give the number only.', correct_answer: '5' },
        { subskillLabel: 'Calculating the distance between two points', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Find the distance between A(1,2) and B(4,6). Give the number only.', correct_answer: '5' },
      ],
    },
    {
      topicKey: 'MidpointFormula',
      label: 'The Midpoint Formula',
      subskills: [
        'Stating the midpoint formula',
        'Calculating the midpoint of a line segment',
      ],
      questions: [
        { subskillLabel: 'Stating the midpoint formula', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The midpoint of the line segment joining (x₁,y₁) and (x₂,y₂) is calculated using:',
          options: ['((x₁+x₂)/2, (y₁+y₂)/2)', '√((x₂-x₁)² + (y₂-y₁)²)', '(x₂-x₁, y₂-y₁)', '(x₁×x₂, y₁×y₂)'],
          correct_answer: '((x₁+x₂)/2, (y₁+y₂)/2)' },
        { subskillLabel: 'Calculating the midpoint of a line segment', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the midpoint of A(2,4) and B(6,8). Give your answer in the form (x,y), no spaces, e.g. (3,5)', correct_answer: '(4,6)' },
        { subskillLabel: 'Calculating the midpoint of a line segment', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'The midpoint of A(x,3) and B(7,y) is (5,6). Find x and y. Give your answer in the form x=a,y=b, no spaces, e.g. x=1,y=2', correct_answer: 'x=3,y=9' },
      ],
    },
    {
      topicKey: 'GradientFormula',
      label: 'The Gradient (Slope) Formula',
      subskills: [
        'Stating the gradient formula',
        'Calculating the gradient of a line segment',
        'Interpreting the sign and size of a gradient',
      ],
      questions: [
        { subskillLabel: 'Stating the gradient formula', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The gradient of the line through (x₁,y₁) and (x₂,y₂) is calculated using:',
          options: ['(y₂-y₁)/(x₂-x₁)', '(x₂-x₁)/(y₂-y₁)', '(y₂+y₁)/(x₂+x₁)', '√((x₂-x₁)² + (y₂-y₁)²)'],
          correct_answer: '(y₂-y₁)/(x₂-x₁)',
          distractor_notes: {
            '(x₂-x₁)/(y₂-y₁)': 'Flips the numerator and denominator — gradient is "rise over run" (change in y over change in x), not the reverse.',
          } },
        { subskillLabel: 'Calculating the gradient of a line segment', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the gradient of the line through A(1,2) and B(4,8). Give the number only.', correct_answer: '2' },
        { subskillLabel: 'Interpreting the sign and size of a gradient', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'A line has a negative gradient. What does this tell you about the line?',
          options: ['As x increases, y decreases (the line slopes downward left to right)', 'The line is horizontal', 'The line is vertical', 'The line passes through the origin'],
          correct_answer: 'As x increases, y decreases (the line slopes downward left to right)' },
      ],
    },
    {
      topicKey: 'ParallelPerpendicularLines',
      label: 'Parallel and Perpendicular Lines (Analytical)',
      subskills: [
        'Identifying parallel lines from gradients',
        'Identifying perpendicular lines from gradients',
        'Applying gradient rules to solve problems',
      ],
      questions: [
        { subskillLabel: 'Identifying parallel lines from gradients', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Two lines are parallel. What must be true of their gradients?',
          options: ['They are equal', 'They are negative reciprocals of each other', 'Their product is -1', 'One must be zero'],
          correct_answer: 'They are equal' },
        { subskillLabel: 'Identifying perpendicular lines from gradients', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Two lines are perpendicular. What must be true of their gradients?',
          options: ['Their product is -1 (they are negative reciprocals)', 'They are equal', 'Their sum is 0', 'They are both positive'],
          correct_answer: 'Their product is -1 (they are negative reciprocals)',
          distractor_notes: {
            'Their sum is 0': 'Confuses "negative reciprocal" (product = -1) with "negative" (sum = 0) — these are different relationships.',
          } },
        { subskillLabel: 'Applying gradient rules to solve problems', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Line A has a gradient of 3. Line B is perpendicular to line A. Find the gradient of line B. Give your answer as a fraction, no spaces, e.g. -1/2', correct_answer: '-1/3' },
        { subskillLabel: 'Applying gradient rules to solve problems', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Line AB passes through A(0,2) and B(4,10). Line CD passes through C(1,5) and D(5,7). Determine whether AB and CD are parallel, perpendicular, or neither, showing your working.',
          memo_answer: 'Model answer: Gradient of AB = (10-2)/(4-0) = 8/4 = 2. Gradient of CD = (7-5)/(5-1) = 2/4 = 0.5. Since 2 ≠ 0.5, the lines are not parallel. Since 2 × 0.5 = 1, not -1, the lines are not perpendicular either. Conclusion: AB and CD are neither parallel nor perpendicular. Award full marks for both correct gradient calculations and correctly testing both the parallel condition (equal gradients) and perpendicular condition (product = -1).' },
      ],
    },
    {
      topicKey: 'CollinearPoints',
      label: 'Collinear Points',
      subskills: [
        'Understanding what "collinear" means',
        'Testing whether three points are collinear',
      ],
      questions: [
        { subskillLabel: 'Understanding what "collinear" means', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What does it mean for three points to be "collinear"?',
          options: ['They all lie on the same straight line', 'They form a triangle', 'They are all the same distance from the origin', 'They have the same y-coordinate'],
          correct_answer: 'They all lie on the same straight line' },
        { subskillLabel: 'Testing whether three points are collinear', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'How can you test whether three points A, B, and C are collinear using gradients?',
          options: ['Check if the gradient of AB equals the gradient of BC', 'Check if the distance AB equals the distance BC', 'Check if A, B, and C form a right angle', 'Collinearity cannot be tested using gradients'],
          correct_answer: 'Check if the gradient of AB equals the gradient of BC' },
        { subskillLabel: 'Testing whether three points are collinear', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Determine whether the points A(1,2), B(3,6), and C(5,10) are collinear, showing your working and reasoning.',
          memo_answer: 'Model answer: Gradient of AB = (6-2)/(3-1) = 4/2 = 2. Gradient of BC = (10-6)/(5-3) = 4/2 = 2. Since gradient of AB = gradient of BC = 2, and point B is common to both segments, the three points lie on the same straight line — A, B, and C are collinear. Award full marks for both correct gradient calculations and the correct conclusion with reasoning (equal gradients through a common point).' },
      ],
    },
    {
      topicKey: 'EquationOfALine',
      label: 'Finding the Equation of a Line',
      subskills: [
        'Using gradient and a point to find the equation',
        'Using two points to find the equation',
      ],
      questions: [
        { subskillLabel: 'Using gradient and a point to find the equation', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The general form for the equation of a straight line, given gradient m and y-intercept c, is:',
          options: ['y = mx + c', 'y = mx² + c', 'x = my + c', 'y = m + cx'],
          correct_answer: 'y = mx + c' },
        { subskillLabel: 'Using gradient and a point to find the equation', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Find the equation of a line with gradient 2, passing through (0,5). Give your answer in the form y=mx+c, no spaces, e.g. y=3x+1', correct_answer: 'y=2x+5' },
        { subskillLabel: 'Using two points to find the equation', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Find the equation of the line through A(1,3) and B(3,7). Give your answer in the form y=mx+c, no spaces, e.g. y=3x+1', correct_answer: 'y=2x+1' },
      ],
    },
    {
      topicKey: 'AreaViaCoordinates',
      label: 'Using Coordinates to Find Area',
      subskills: [
        'Finding the area of a triangle using base and height from coordinates',
        'Combining distance and gradient to solve area problems',
      ],
      questions: [
        { subskillLabel: 'Finding the area of a triangle using base and height from coordinates', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'To find the area of a triangle plotted on a coordinate plane with a horizontal base, which formula do you use once you know the base length and height?',
          options: ['½ × base × height', 'base × height', '½ × (base + height)', 'base² + height²'],
          correct_answer: '½ × base × height' },
        { subskillLabel: 'Combining distance and gradient to solve area problems', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Triangle ABC has vertices A(0,0), B(6,0), and C(2,4). Find the area of the triangle, showing how you identified the base and height from the coordinates.',
          memo_answer: 'Model answer: AB lies along the x-axis (both points have y=0), so AB can be used as the base: length = 6 (distance from x=0 to x=6). The height is the perpendicular (vertical) distance from C to line AB, which is simply the y-coordinate of C, since AB is horizontal: height = 4. Area = ½ × base × height = ½ × 6 × 4 = 12 square units. Award full marks for correctly identifying AB as a convenient horizontal base, correctly reading the height from C\'s y-coordinate, and the correct area calculation.' },
      ],
    },
    {
      topicKey: 'VerticalHorizontalLines',
      label: 'Vertical and Horizontal Lines',
      subskills: [
        'Identifying the equation of a horizontal line',
        'Identifying the equation of a vertical line',
        'Understanding why vertical lines have an undefined gradient',
      ],
      questions: [
        { subskillLabel: 'Identifying the equation of a horizontal line', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the equation of a horizontal line passing through (3,5)?',
          options: ['y = 5', 'x = 5', 'y = 3', 'x = 3'], correct_answer: 'y = 5',
          distractor_notes: {
            'x = 3': 'Confuses horizontal with vertical — a horizontal line has a constant y-value, not a constant x-value.',
          } },
        { subskillLabel: 'Identifying the equation of a vertical line', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the equation of a vertical line passing through (3,5)?',
          options: ['x = 3', 'y = 3', 'x = 5', 'y = 5'], correct_answer: 'x = 3' },
        { subskillLabel: 'Understanding why vertical lines have an undefined gradient', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Explain, using the gradient formula, why a vertical line has an undefined gradient.',
          memo_answer: 'Model answer: The gradient formula is m = (y₂-y₁)/(x₂-x₁). On a vertical line, every point has the same x-coordinate (x₁ = x₂), so the denominator (x₂-x₁) equals 0. Since division by zero is undefined in mathematics, the gradient of a vertical line is undefined. Award full marks for correctly identifying that x₂-x₁ = 0 on a vertical line and connecting this to division by zero being undefined.' },
      ],
    },
    {
      topicKey: 'MixedAnalyticalGeometryProblems',
      label: 'Mixed Analytical Geometry Problems',
      subskills: [
        'Combining distance, midpoint, and gradient in one problem',
        'Using analytical geometry to identify shape properties',
      ],
      questions: [
        { subskillLabel: 'Combining distance, midpoint, and gradient in one problem', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'To prove that a quadrilateral is a rectangle using analytical geometry, which combination of checks would be most direct?',
          options: ['Show all four gradients confirm two pairs of parallel sides, and one pair of adjacent sides has gradients that multiply to -1 (perpendicular)', 'Only calculate the perimeter', 'Only calculate the area', 'Check that all four vertices have positive coordinates'],
          correct_answer: 'Show all four gradients confirm two pairs of parallel sides, and one pair of adjacent sides has gradients that multiply to -1 (perpendicular)' },
        { subskillLabel: 'Using analytical geometry to identify shape properties', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Quadrilateral PQRS has vertices P(0,0), Q(4,0), R(4,3), and S(0,3). Use analytical geometry (gradients and/or distances) to show that PQRS is a rectangle.',
          memo_answer: 'Model answer: Gradient of PQ = (0-0)/(4-0) = 0 (horizontal). Gradient of RS = (3-3)/(0-4) = 0 (horizontal). So PQ ∥ RS. Gradient of QR = (3-0)/(4-4) = undefined (vertical). Gradient of PS = (3-0)/(0-0) = undefined (vertical). So QR ∥ PS. Since PQ is horizontal and QR is vertical, they are perpendicular (angle PQR = 90°). All four sides meet at right angles with both pairs of opposite sides parallel, so PQRS is a rectangle. Award full marks for correctly showing both pairs of opposite sides are parallel AND that adjacent sides are perpendicular (establishing the right angles).' },
      ],
    },
    {
      topicKey: 'InclinationOfALine',
      label: 'Angle of Inclination of a Line',
      subskills: [
        'Relating gradient to the angle of inclination',
        'Calculating the angle of inclination',
      ],
      questions: [
        { subskillLabel: 'Relating gradient to the angle of inclination', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'The "angle of inclination" of a line is the angle the line makes with:',
          options: ['The positive x-axis, measured anti-clockwise', 'The y-axis, measured clockwise', 'The origin', 'Another line only'],
          correct_answer: 'The positive x-axis, measured anti-clockwise' },
        { subskillLabel: 'Calculating the angle of inclination', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'A line has a gradient of 1. Find its angle of inclination (in degrees, between 0° and 90°). (Hint: tan(θ) = gradient) Give the number only.', correct_answer: '45' },
      ],
    },
  ],

  // Grade 10 English Home Language — Term 1: Language Structures & Conventions
  // (word classes, sentence construction, punctuation, figures of speech —
  // the testable grammar strand of the CAPS ATP; comprehension/writing/literature
  // are assessed via essays and orals, not auto-gradable MCQ/short-answer).
  'english-10-1': [
    {
      topicKey: 'WordClasses',
      label: 'Word Classes (Parts of Speech)',
      subskills: [
        'Identifying nouns, verbs, and adjectives',
        'Identifying adverbs and prepositions',
        'Identifying conjunctions and pronouns',
      ],
      questions: [
        { subskillLabel: 'Identifying nouns, verbs, and adjectives', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In the sentence "The clever fox jumped over the fence", which word is the adjective?',
          options: ['clever', 'fox', 'jumped', 'fence'], correct_answer: 'clever',
          distractor_notes: {
            'fox': 'Picks the noun the adjective is describing, rather than the describing word itself — confuses "what is described" with "what describes it."',
          } },
        { subskillLabel: 'Identifying nouns, verbs, and adjectives', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In the sentence "She quickly finished her homework", which word is the verb?',
          options: ['finished', 'quickly', 'her', 'homework'], correct_answer: 'finished',
          distractor_notes: {
            'quickly': 'Picks the adverb modifying the verb, instead of the verb itself — a common confusion since adverbs often sit right next to the action word.',
          } },
        { subskillLabel: 'Identifying adverbs and prepositions', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In the sentence "He ran swiftly across the field", which word is the adverb?',
          options: ['swiftly', 'ran', 'across', 'field'], correct_answer: 'swiftly',
          distractor_notes: {
            'across': 'Confuses the preposition (across) with the adverb (swiftly) — both appear near the verb, but only one describes how the action was done.',
          } },
        { subskillLabel: 'Identifying adverbs and prepositions', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In the sentence "The book is on the table", which word is the preposition?',
          options: ['on', 'book', 'is', 'table'], correct_answer: 'on' },
        { subskillLabel: 'Identifying conjunctions and pronouns', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In the sentence "She and I went to the shop, but he stayed home", which word is a conjunction?',
          options: ['but', 'she', 'he', 'shop'], correct_answer: 'but',
          distractor_notes: {
            'she': 'Correctly identifies a pronoun, but confuses it with the word class being asked about (conjunction).',
          } },
        { subskillLabel: 'Identifying conjunctions and pronouns', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In the sentence "They gave him the keys", which word is a pronoun referring to a male person?',
          options: ['him', 'they', 'gave', 'keys'], correct_answer: 'him' },
      ],
    },
    {
      topicKey: 'SentenceTypes',
      label: 'Sentence Types & Construction',
      subskills: [
        'Identifying sentence types by function',
        'Identifying simple, compound, and complex sentences',
        'Constructing well-formed sentences',
      ],
      questions: [
        { subskillLabel: 'Identifying sentence types by function', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What type of sentence is: "Close the door!"',
          options: ['Imperative', 'Interrogative', 'Exclamatory', 'Declarative'], correct_answer: 'Imperative',
          distractor_notes: {
            'Exclamatory': 'Notices the exclamation mark and assumes "exclamatory," without checking that the sentence is actually giving a command (imperative) rather than expressing strong emotion.',
          } },
        { subskillLabel: 'Identifying sentence types by function', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'What type of sentence is: "What time does the movie start?"',
          options: ['Interrogative', 'Imperative', 'Declarative', 'Exclamatory'], correct_answer: 'Interrogative' },
        { subskillLabel: 'Identifying simple, compound, and complex sentences', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What makes a sentence "compound" rather than "complex"?',
          options: ['It joins two independent clauses with a coordinating conjunction (and, but, or)', 'It has a subordinate clause that depends on the main clause', 'It has only one clause', 'It uses no conjunctions at all'],
          correct_answer: 'It joins two independent clauses with a coordinating conjunction (and, but, or)',
          distractor_notes: {
            'It has a subordinate clause that depends on the main clause': 'This is the definition of a complex sentence, not a compound one — mixes up the two.',
          } },
        { subskillLabel: 'Identifying simple, compound, and complex sentences', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: '"I studied hard, but I still found the test difficult." What kind of sentence is this?',
          options: ['Compound', 'Simple', 'Complex', 'Fragment'], correct_answer: 'Compound',
          distractor_notes: {
            'Complex': 'Both clauses here are independent (each could stand alone as its own sentence), joined by "but" — mistaken for complex because it "sounds more advanced."',
          } },
        { subskillLabel: 'Identifying simple, compound, and complex sentences', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: '"Although it was raining, the match continued." What kind of sentence is this?',
          options: ['Complex', 'Simple', 'Compound', 'Fragment'], correct_answer: 'Complex',
          distractor_notes: {
            'Compound': '"Although it was raining" is a subordinate clause (cannot stand alone), not an independent clause — this makes it complex, not compound, despite having two clauses.',
          } },
        { subskillLabel: 'Constructing well-formed sentences', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Combine these two simple sentences into one complex sentence using a subordinating conjunction: "The rain stopped. We went outside." Write your combined sentence and name the subordinating conjunction you used.',
          memo_answer: 'Model answer (accept reasonable equivalents): "When the rain stopped, we went outside." or "After the rain stopped, we went outside." Subordinating conjunction used: "when" or "after" (also acceptable: "once", "as soon as"). Award full marks for a grammatically correct complex sentence using a genuine subordinating conjunction (not "and"/"but", which would make it compound) and correctly naming the conjunction used.' },
      ],
    },
    {
      topicKey: 'PunctuationSpelling',
      label: 'Punctuation & Spelling',
      subskills: [
        'Correct use of apostrophes',
        'Correct use of commas',
        'Correct use of full stops and capital letters in complex sentences',
      ],
      questions: [
        { subskillLabel: 'Correct use of apostrophes', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which sentence uses the apostrophe correctly to show possession?',
          options: ["The dog's bone is missing.", "The dogs' bone is missing.", "The dog bone's is missing.", "The dogs bones is missing."], correct_answer: "The dog's bone is missing.",
          distractor_notes: {
            "The dogs' bone is missing.": 'Uses the plural possessive form (apostrophe after the s) for a single dog — mixes up singular vs. plural possessive rules.',
          } },
        { subskillLabel: 'Correct use of apostrophes', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which word correctly shows the contraction of "they are"?',
          options: ["they're", "their", "there", "theyre"], correct_answer: "they're",
          distractor_notes: {
            'their': 'Confuses the possessive "their" with the contraction "they\'re" — a classic homophone mix-up.',
            'there': 'Confuses the location word "there" with the contraction "they\'re" — another homophone mix-up.',
          } },
        { subskillLabel: 'Correct use of commas', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which sentence uses commas correctly?',
          options: ['After the long, tiring match, the players rested.', 'After the long tiring, match the players rested.', 'After the long tiring match the, players rested.', 'After, the long tiring match the players rested.'], correct_answer: 'After the long, tiring match, the players rested.' },
        { subskillLabel: 'Correct use of commas', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which sentence uses a comma correctly to separate items in a list?',
          options: ['We bought apples, bananas, and bread.', 'We bought apples bananas, and bread.', 'We bought, apples bananas and bread.', 'We bought apples, bananas and, bread.'], correct_answer: 'We bought apples, bananas, and bread.' },
        { subskillLabel: 'Correct use of full stops and capital letters in complex sentences', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Which sentence is correctly punctuated?',
          options: ['Because she was tired, she went to bed early.', 'because she was tired, She went to bed early.', 'Because she was tired she went to bed early', 'Because she was tired, She Went To Bed Early.'],
          correct_answer: 'Because she was tired, she went to bed early.',
          distractor_notes: {
            'Because she was tired she went to bed early': 'Missing the comma after the introductory subordinate clause — a very common omission in complex sentences.',
          } },
      ],
    },
    {
      topicKey: 'FiguresOfSpeech',
      label: 'Figures of Speech',
      subskills: [
        'Identifying similes and metaphors',
        'Identifying personification and alliteration',
        'Explaining the effect of a figure of speech',
      ],
      questions: [
        { subskillLabel: 'Identifying similes and metaphors', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: '"Her smile was as bright as the sun." This is an example of a:',
          options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], correct_answer: 'Simile',
          distractor_notes: {
            'Metaphor': 'Both compare two things, but a simile uses "as" or "like" — missing this signal word is the key distinguishing test students often skip.',
          } },
        { subskillLabel: 'Identifying similes and metaphors', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: '"Time is a thief." This is an example of a:',
          options: ['Metaphor', 'Simile', 'Onomatopoeia', 'Hyperbole'], correct_answer: 'Metaphor',
          distractor_notes: {
            'Simile': 'There is no "as" or "like" connecting the two ideas — this direct comparison (X is Y) is what makes it a metaphor, not a simile.',
          } },
        { subskillLabel: 'Identifying personification and alliteration', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: '"The wind whispered through the trees." This is an example of:',
          options: ['Personification', 'Simile', 'Alliteration', 'Hyperbole'], correct_answer: 'Personification' },
        { subskillLabel: 'Identifying personification and alliteration', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: '"Peter Piper picked a peck of pickled peppers." This is an example of:',
          options: ['Alliteration', 'Simile', 'Personification', 'Metaphor'], correct_answer: 'Alliteration' },
        { subskillLabel: 'Explaining the effect of a figure of speech', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read this line: "The old house groaned under the weight of winter." Identify the figure of speech used, and explain what effect it creates for the reader.',
          memo_answer: 'Model answer: This is personification — the house is given the human ability to "groan," which is normally something living things do. The effect is to make the house feel alive, tired, or in distress, creating an atmosphere of decay, age, or foreboding rather than just stating factually that the house creaked. Award full marks for correctly identifying personification AND explaining a specific, sensible effect (mood/atmosphere/imagery), not just restating the definition of personification.' },
      ],
    },
    // ── Sentence Analysis (finite verbs, clauses) — a recurring Paper 1
    // Section C exam task: underline the finite verb, bracket the clauses,
    // and classify the sentence ──
    {
      topicKey: 'SentenceAnalysis',
      label: 'Sentence Analysis: Finite Verbs & Clauses',
      subskills: [
        'Identifying the finite verb in a sentence',
        'Identifying clauses within a sentence',
        'Classifying sentences from their clause structure',
      ],
      questions: [
        { subskillLabel: 'Identifying the finite verb in a sentence', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is a "finite verb"?',
          options: ['A verb that shows tense and agrees with its subject', 'Any word ending in -ing', 'A verb that cannot be conjugated', 'The main noun in a sentence'],
          correct_answer: 'A verb that shows tense and agrees with its subject' },
        { subskillLabel: 'Identifying the finite verb in a sentence', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In the sentence "She has been studying all night", which word is the finite verb?',
          options: ['has', 'been', 'studying', 'night'], correct_answer: 'has',
          distractor_notes: {
            'studying': 'This is the non-finite part of the verb phrase (a present participle) — the finite verb is the auxiliary "has," which carries the tense and agreement with "she."',
          } },
        { subskillLabel: 'Identifying clauses within a sentence', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the key difference between a phrase and a clause?',
          options: ['A clause contains a finite verb (a subject + verb combination); a phrase does not', 'A clause is always longer than a phrase', 'A phrase always comes at the start of a sentence', 'There is no real difference'],
          correct_answer: 'A clause contains a finite verb (a subject + verb combination); a phrase does not' },
        { subskillLabel: 'Identifying clauses within a sentence', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'In the sentence "The girl who won the race was exhausted", identify the subordinate clause. Give it exactly as it appears in the sentence, word for word.', correct_answer: 'who won the race' },
        { subskillLabel: 'Classifying sentences from their clause structure', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: '"The teacher, who had marked all night, was tired, but she still smiled at the class." How many clauses does this sentence contain, and what type is it overall?',
          options: ['Three clauses; it is a complex sentence with an embedded relative clause plus a compound structure', 'One clause; it is a simple sentence', 'Two clauses; it is a compound sentence only', 'Four clauses; it is a run-on sentence'],
          correct_answer: 'Three clauses; it is a complex sentence with an embedded relative clause plus a compound structure',
          distractor_notes: {
            'Two clauses; it is a compound sentence only': 'Misses the embedded relative clause ("who had marked all night") sitting inside the first main clause — only counts the two clauses joined by "but."',
          } },
        { subskillLabel: 'Classifying sentences from their clause structure', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Underline the finite verb, put brackets around each clause, and classify this sentence: "Because the storm was severe, the match was postponed, and the players went home."',
          memo_answer: 'Model answer: [Because the storm was severe] (subordinate clause, finite verb "was"), [the match was postponed] (main clause, finite verb "was postponed"), and [the players went home] (main clause, finite verb "went"). This is a complex-compound sentence: one subordinate clause joined to two coordinated main clauses. Award full marks for correctly identifying all three clauses, the finite verb in each, and naming it a complex-compound (or "compound-complex") sentence.' },
      ],
    },
    // ── Reported (Indirect) Speech — a standard Language Structures exam task ──
    {
      topicKey: 'ReportedSpeech',
      label: 'Direct & Reported (Indirect) Speech',
      subskills: [
        'Recognising direct vs. reported speech',
        'Converting pronouns and tense in reported speech',
        'Converting time and place references in reported speech',
      ],
      questions: [
        { subskillLabel: 'Recognising direct vs. reported speech', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which sentence is in direct speech?',
          options: ['Thabo said, "I am tired."', 'Thabo said that he was tired.', 'Thabo said he had been tired.', 'Thabo mentioned his tiredness.'],
          correct_answer: 'Thabo said, "I am tired."',
          distractor_notes: {
            'Thabo said that he was tired.': 'Already converted to reported speech — no quotation marks, and the pronoun/tense have shifted.',
          } },
        { subskillLabel: 'Converting pronouns and tense in reported speech', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Convert to reported speech: She said, "I am going to the shop." → She said that ___',
          options: ['she was going to the shop', 'I am going to the shop', 'she is going to the shop', 'she will go to the shop'],
          correct_answer: 'she was going to the shop',
          distractor_notes: {
            'she is going to the shop': 'Correctly changes the pronoun (I → she) but forgets to also shift the tense back (am going → was going), a common half-conversion error.',
          } },
        { subskillLabel: 'Converting pronouns and tense in reported speech', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Convert to reported speech: He said, "I have finished my homework." → He said that he ___. Give the missing words only, e.g. had completed his work', correct_answer: 'had finished his homework' },
        { subskillLabel: 'Converting time and place references in reported speech', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Convert to reported speech: She said, "I will see you here tomorrow." Which time/place words must change?',
          options: ['"tomorrow" → "the next day", "here" → "there"', 'No words need to change', 'Only "tomorrow" needs to change', 'Only "here" needs to change'],
          correct_answer: '"tomorrow" → "the next day", "here" → "there"' },
        { subskillLabel: 'Converting time and place references in reported speech', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Convert this sentence fully into reported speech, explaining each change you make: Sipho said to me, "I will finish this project tomorrow."',
          memo_answer: 'Model answer: Sipho told me that he would finish that project the next day (or "the following day"). Changes: "said to me" → "told me" (reporting verb often shifts for direct address); "I" → "he" (first person → third person); "will" → "would" (future in direct speech shifts to a future-in-the-past form); "this" → "that" (demonstrative shifts away from immediate context); "tomorrow" → "the next day" (time reference shifts since we are no longer speaking on the same day). Award full marks for the correctly converted sentence AND a clear explanation of at least three of these specific shifts (pronoun, tense, time/demonstrative).' },
      ],
    },
    // ── Word Formation: Prefixes, Suffixes & Antonyms — common Paper 1
    // Language Structures vocabulary task ──
    {
      topicKey: 'WordFormation',
      label: 'Word Formation: Prefixes, Suffixes & Antonyms',
      subskills: [
        'Identifying prefixes and their meaning',
        'Forming antonyms using prefixes',
        'Identifying synonyms and antonyms in context',
      ],
      questions: [
        { subskillLabel: 'Identifying prefixes and their meaning', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What does the prefix "un-" typically mean when added to a word like "unhappy"?',
          options: ['Not / the opposite of', 'Very / extremely', 'Again / repeated', 'Before / earlier than'],
          correct_answer: 'Not / the opposite of' },
        { subskillLabel: 'Identifying prefixes and their meaning', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which prefix means "before", as in "prehistoric"?',
          options: ['pre-', 'post-', 're-', 'sub-'], correct_answer: 'pre-',
          distractor_notes: {
            'post-': 'Means "after", the opposite of "before" — a common prefix mix-up.',
          } },
        { subskillLabel: 'Forming antonyms using prefixes', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Form the antonym of "responsible" by adding a prefix. Give the word only, e.g. displeased', correct_answer: 'irresponsible' },
        { subskillLabel: 'Forming antonyms using prefixes', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Form the antonym of "legal" by adding a prefix. Give the word only, e.g. impossible', correct_answer: 'illegal' },
        { subskillLabel: 'Identifying synonyms and antonyms in context', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which word is an antonym (opposite) of "generous"?',
          options: ['stingy', 'kind', 'wealthy', 'giving'], correct_answer: 'stingy' },
        { subskillLabel: 'Identifying synonyms and antonyms in context', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read this sentence: "The exhausted athlete could barely walk after the marathon." Give one synonym and one antonym for the word "exhausted", and explain how each word would change the meaning of the sentence if substituted in.',
          memo_answer: 'Model answer (accept reasonable equivalents): Synonym: "drained" / "fatigued" / "worn out" — substituting keeps the same meaning, the athlete is still extremely tired. Antonym: "energetic" / "refreshed" / "invigorated" — substituting would completely reverse the meaning, suggesting the athlete felt strong and lively after the marathon rather than depleted, which would also contradict "could barely walk." Award full marks for a genuine synonym and antonym (not near-misses) plus a clear explanation of the meaning shift for each.' },
      ],
    },
    // ── Active and Passive Voice — a standard Language Structures exam task ──
    {
      topicKey: 'ActivePassiveVoice',
      label: 'Active and Passive Voice',
      subskills: [
        'Identifying active vs. passive sentences',
        'Converting active sentences to passive',
        'Converting passive sentences to active',
      ],
      questions: [
        { subskillLabel: 'Identifying active vs. passive sentences', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In an active sentence, the subject:',
          options: ['Performs the action', 'Receives the action', 'Is always a pronoun', 'Comes after the verb'], correct_answer: 'Performs the action' },
        { subskillLabel: 'Identifying active vs. passive sentences', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which sentence is written in the passive voice?',
          options: ['The cake was eaten by the children.', 'The children ate the cake.', 'The children are eating the cake.', 'The children will eat the cake.'],
          correct_answer: 'The cake was eaten by the children.',
          distractor_notes: {
            'The children ate the cake.': 'This is active voice (the subject "the children" performs the action) — mistaken for passive simply because it\'s in the past tense, confusing tense with voice.',
          } },
        { subskillLabel: 'Converting active sentences to passive', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Convert to passive voice: "The teacher marked the tests." Give the full sentence.', correct_answer: 'The tests were marked by the teacher.' },
        { subskillLabel: 'Converting active sentences to passive', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Convert to passive voice: "The dog chased the cat." Give the full sentence.', correct_answer: 'The cat was chased by the dog.' },
        { subskillLabel: 'Converting passive sentences to active', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Convert this passive sentence to active voice, and explain what changed: "The novel was written by a famous author in 1990."',
          memo_answer: 'Model answer: "A famous author wrote the novel in 1990." Explanation: in the passive version, "the novel" (the thing receiving the action) is the subject and "a famous author" appears after "by"; in the active version, "a famous author" (the doer of the action) becomes the subject, and "the novel" becomes the object, coming directly after the verb "wrote". Award full marks for the correctly converted sentence AND an explanation that identifies the swap of subject/object roles.' },
      ],
    },
    // ── Register and Tone — formal vs. informal language, another common
    // Language Structures exam component ──
    {
      topicKey: 'RegisterAndTone',
      label: 'Register and Tone',
      subskills: [
        'Distinguishing formal from informal register',
        'Rewriting informal language as formal',
        'Identifying tone in a piece of writing',
      ],
      questions: [
        { subskillLabel: 'Distinguishing formal from informal register', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which sentence uses a formal register?',
          options: ['I would like to request your assistance with this matter.', 'Hey, can you help me out with this?', 'Yo, sort this out for me please.', 'Can you gimme a hand with this?'],
          correct_answer: 'I would like to request your assistance with this matter.' },
        { subskillLabel: 'Distinguishing formal from informal register', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which word is more formal than the others?',
          options: ['commence', 'start', 'kick off', 'get going'], correct_answer: 'commence',
          distractor_notes: {
            'start': 'This is a neutral, everyday word — "commence" is specifically the more formal synonym used in official or academic contexts.',
          } },
        { subskillLabel: 'Rewriting informal language as formal', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Rewrite formally: "I wanna know if I can get some help." Give the full rewritten sentence.', correct_answer: 'I would like to know if I can receive some assistance.' },
        { subskillLabel: 'Identifying tone in a piece of writing', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: '"Oh, how wonderful — another Monday morning." What tone is being used here?',
          options: ['Sarcastic', 'Genuinely enthusiastic', 'Neutral/factual', 'Formal and respectful'], correct_answer: 'Sarcastic',
          distractor_notes: {
            'Genuinely enthusiastic': 'Takes the positive words ("wonderful") at face value without noticing the ironic context (Monday mornings are typically not exciting) that signals sarcasm.',
          } },
        { subskillLabel: 'Identifying tone in a piece of writing', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read this sentence: "I suppose your plan might work, if everything goes perfectly, which it never does." Identify the tone of this sentence and explain which words or phrases create that tone.',
          memo_answer: 'Model answer: The tone is doubtful/skeptical (or cynical). This is created by the hedging phrase "I suppose" (weak, unconvinced agreement), the conditional "if everything goes perfectly" (suggesting it\'s unlikely), and the blunt dismissal "which it never does" (a flat, pessimistic generalisation). Award full marks for correctly identifying a skeptical/doubtful/cynical tone AND specifically pointing to at least two of these textual features as evidence, not just a general impression.' },
      ],
    },
    // ── Subject-Verb Agreement — a frequent, testable grammar error type ──
    {
      topicKey: 'SubjectVerbAgreement',
      label: 'Subject-Verb Agreement',
      subskills: [
        'Matching singular subjects with singular verbs',
        'Matching plural subjects with plural verbs',
        'Handling tricky agreement cases (collective nouns, "each/every")',
      ],
      questions: [
        { subskillLabel: 'Matching singular subjects with singular verbs', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which sentence has correct subject-verb agreement?',
          options: ['She walks to school every day.', 'She walk to school every day.', 'She walking to school every day.', 'She have walked to school every day.'],
          correct_answer: 'She walks to school every day.' },
        { subskillLabel: 'Matching plural subjects with plural verbs', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which sentence has correct subject-verb agreement?',
          options: ['The students are studying for their exam.', 'The students is studying for their exam.', 'The students studies for their exam.', 'The student are studying for their exam.'],
          correct_answer: 'The students are studying for their exam.' },
        { subskillLabel: 'Handling tricky agreement cases (collective nouns, "each/every")', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Which sentence has correct subject-verb agreement?',
          options: ['Each of the students has submitted their essay.', 'Each of the students have submitted their essay.', 'Each of the students submit their essay.', 'Each of the student has submitted their essay.'],
          correct_answer: 'Each of the students has submitted their essay.',
          distractor_notes: {
            'Each of the students have submitted their essay.': 'The subject is "each" (singular), not "students" — even though "students" is plural and sits right before the verb, "each" is what the verb must agree with, requiring "has" not "have".',
          } },
        { subskillLabel: 'Handling tricky agreement cases (collective nouns, "each/every")', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Which sentence has correct subject-verb agreement (treating the team as a single unit)?',
          options: ['The team is playing well this season.', 'The team are playing well this season.', 'The team play well this season.', 'The team were play well this season.'],
          correct_answer: 'The team is playing well this season.',
          distractor_notes: {
            'The team are playing well this season.': 'Treats the collective noun "team" as if it were plural (referring to the individual members) rather than as a single unit, which is the standard convention in most exam contexts.',
          } },
        { subskillLabel: 'Handling tricky agreement cases (collective nouns, "each/every")', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Correct the subject-verb agreement error in this sentence, and explain why the original was wrong: "Neither of the boys have finished their homework."',
          memo_answer: 'Model answer: Correct sentence: "Neither of the boys has finished their homework." Explanation: the subject of the sentence is "neither" (a singular pronoun), not "boys" — even though "boys" is plural and sits closer to the verb, the verb must agree with "neither", which requires the singular form "has", not "have". Award full marks for the correct sentence AND an explanation that correctly identifies "neither" (not "boys") as the true subject.' },
      ],
    },
  ],

  // Grade 10 English Home Language — Term 2: Poetry devices, transactional
  // writing conventions, comprehension/vocabulary skills — the testable
  // strand of Term 2's ATP (full essay/poem analysis is assessed by the
  // teacher directly, not auto-gradable MCQ/short-answer).
  'english-10-2': [
    {
      topicKey: 'PoeticSoundDevices',
      label: 'Poetic Sound Devices',
      subskills: [
        'Identifying rhyme and rhyme scheme',
        'Identifying assonance and consonance',
        'Identifying onomatopoeia',
      ],
      questions: [
        { subskillLabel: 'Identifying rhyme and rhyme scheme', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is a "rhyme scheme"?',
          options: ['The pattern of rhyming sounds at the end of lines in a poem, e.g. ABAB', 'The number of syllables in a poem', 'The overall theme of a poem', 'The poet\'s choice of title'],
          correct_answer: 'The pattern of rhyming sounds at the end of lines in a poem, e.g. ABAB' },
        { subskillLabel: 'Identifying rhyme and rhyme scheme', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'A poem has this rhyme pattern: line 1 ends in "day", line 2 ends in "night", line 3 ends in "play", line 4 ends in "light". What is the rhyme scheme?',
          options: ['ABAB', 'AABB', 'ABBA', 'AAAA'], correct_answer: 'ABAB',
          distractor_notes: {
            'AABB': 'Would mean lines 1&2 rhyme with each other and lines 3&4 rhyme with each other — here it\'s actually lines 1&3 and lines 2&4 that rhyme (an alternating pattern), which is ABAB.',
          } },
        { subskillLabel: 'Identifying assonance and consonance', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: '"The rain in Spain falls mainly on the plain." This line demonstrates:',
          options: ['Assonance (repeated vowel sounds)', 'Consonance (repeated consonant sounds)', 'Onomatopoeia', 'Alliteration'],
          correct_answer: 'Assonance (repeated vowel sounds)',
          distractor_notes: {
            'Alliteration': 'Alliteration is repeated sounds at the START of words — here the repeated "ay" sound is in the middle/end of words (rain, Spain, mainly, plain), which is assonance.',
          } },
        { subskillLabel: 'Identifying onomatopoeia', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which word is an example of onomatopoeia (a word that imitates the sound it describes)?',
          options: ['buzz', 'happy', 'quickly', 'beautiful'], correct_answer: 'buzz' },
        { subskillLabel: 'Identifying onomatopoeia', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read this line: "The crackling fire hissed and popped in the quiet night." Identify all the sound devices used in this line, and explain the effect they create together.',
          memo_answer: 'Model answer: Onomatopoeia: "crackling," "hissed," "popped" — these words imitate the actual sounds a fire makes. Effect: using multiple onomatopoeic words together creates a vivid auditory (sound) image for the reader, making the scene feel immediate and realistic, as if the reader can actually hear the fire, which contrasts effectively with the described quietness of the night. Award full marks for identifying at least two onomatopoeic words and explaining the sensory/auditory effect they create.' },
      ],
    },
    {
      topicKey: 'PoeticStructureForm',
      label: 'Poetic Structure and Form',
      subskills: [
        'Identifying stanzas and lines',
        'Recognising common poetic forms',
        'Understanding enjambment and end-stopped lines',
      ],
      questions: [
        { subskillLabel: 'Identifying stanzas and lines', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is a "stanza" in a poem?',
          options: ['A group of lines forming a unit, similar to a paragraph in prose', 'A single word in a poem', 'The title of a poem', 'The rhyme scheme of a poem'],
          correct_answer: 'A group of lines forming a unit, similar to a paragraph in prose' },
        { subskillLabel: 'Recognising common poetic forms', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'A poem with 14 lines, often with a strict rhyme scheme, is most likely a:',
          options: ['Sonnet', 'Haiku', 'Free verse poem', 'Limerick'], correct_answer: 'Sonnet',
          distractor_notes: {
            'Haiku': 'A haiku is a very short, three-line poem (often 5-7-5 syllables) — the opposite of a 14-line structured form like a sonnet.',
          } },
        { subskillLabel: 'Understanding enjambment and end-stopped lines', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'What is "enjambment" in poetry?',
          options: ['When a sentence or phrase continues onto the next line without a pause or punctuation', 'When every line ends with a full stop', 'When a poem has no rhyme at all', 'When a poem is written entirely in one long sentence with no breaks'],
          correct_answer: 'When a sentence or phrase continues onto the next line without a pause or punctuation' },
        { subskillLabel: 'Understanding enjambment and end-stopped lines', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read these lines: "I wandered through the fields and saw / the birds take flight against the sky." Identify whether the first line is enjambed or end-stopped, and explain the effect this has on the reader.',
          memo_answer: 'Model answer: The first line is enjambed — the sentence/phrase ("I wandered through the fields and saw") continues directly into the next line without a pause or punctuation at the end of line one. Effect: enjambment creates a sense of continuous movement or flow, mirroring the act of wandering/moving described in the poem, and it can also create a small moment of suspense as the reader is pulled forward to complete the thought in the next line. Award full marks for correctly identifying "enjambed" and explaining a sensible effect connected to flow, movement, or reader anticipation.' },
      ],
    },
    {
      topicKey: 'ComprehensionInference',
      label: 'Reading Comprehension: Making Inferences',
      subskills: [
        'Distinguishing stated facts from inferences',
        'Drawing a reasonable inference from a text',
        'Justifying an inference with textual evidence',
      ],
      questions: [
        { subskillLabel: 'Distinguishing stated facts from inferences', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is an "inference" when reading a text?',
          options: ['A reasonable conclusion drawn from clues in the text, not stated directly', 'A fact stated explicitly and directly in the text', 'The title of the passage', 'A grammar error in the text'],
          correct_answer: 'A reasonable conclusion drawn from clues in the text, not stated directly' },
        { subskillLabel: 'Drawing a reasonable inference from a text', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Read: "Thandi\'s hands trembled as she opened the envelope, and she had to read the letter twice before she understood what it said." What can you reasonably infer about Thandi?',
          options: ['She is nervous or anxious about the contents of the letter', 'She is completely calm and unbothered', 'She cannot read at all', 'She has read this exact letter many times before'],
          correct_answer: 'She is nervous or anxious about the contents of the letter' },
        { subskillLabel: 'Justifying an inference with textual evidence', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read: "Sipho counted his coins for the third time, then put them back in his pocket and walked past the shop window without looking at the price tag again." What can you infer about Sipho\'s situation, and which specific details from the text support your inference?',
          memo_answer: 'Model answer: We can infer that Sipho does not have enough money to buy whatever is in the shop window (likely something he wants). Supporting evidence: "counted his coins for the third time" suggests he is anxiously checking if he has enough money; "walked past... without looking at the price tag again" suggests he already knows the price is too high for him and is avoiding the disappointment of looking again. Award full marks for a reasonable inference about limited money/inability to afford something, supported by specific quoted or closely paraphrased details from the text.' },
      ],
    },
    {
      topicKey: 'TransactionalWritingConventions',
      label: 'Transactional Writing: Format Conventions',
      subskills: [
        'Identifying the correct format for a formal letter',
        'Identifying the correct format for an email',
        'Identifying the purpose of different transactional text types',
      ],
      questions: [
        { subskillLabel: 'Identifying the correct format for a formal letter', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In a formal letter, where does the sender\'s address usually appear?',
          options: ['Top right-hand corner', 'Bottom of the page', 'Top left-hand corner', 'It is not included in formal letters'],
          correct_answer: 'Top right-hand corner' },
        { subskillLabel: 'Identifying the correct format for a formal letter', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which greeting is most appropriate for a formal letter to an unknown recipient?',
          options: ['Dear Sir/Madam,', 'Hey there,', 'Hi,', 'Yo,'], correct_answer: 'Dear Sir/Madam,' },
        { subskillLabel: 'Identifying the correct format for an email', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which of these is essential in a formal email but not typically required in a formal letter?',
          options: ['A clear subject line', 'A sender\'s address in the top corner', 'A handwritten signature', 'A postage stamp'],
          correct_answer: 'A clear subject line' },
        { subskillLabel: 'Identifying the purpose of different transactional text types', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Explain the difference in purpose between a formal letter of complaint and a memo, and describe one key formatting difference between them.',
          memo_answer: 'Model answer: A formal letter of complaint is written to an external party (e.g. a company) to raise a specific problem and request a resolution, and requires a formal, respectful tone with full addresses and a formal closing (e.g. "Yours faithfully"). A memo is an internal communication within an organisation (e.g. between colleagues or departments), used to share information or instructions quickly, and typically uses a "To/From/Date/Subject" header format instead of full postal addresses and a signed closing. Award full marks for correctly distinguishing external vs. internal purpose AND identifying at least one concrete formatting difference (e.g. header style, closing).' },
      ],
    },
    {
      topicKey: 'SummarySkills',
      label: 'Summary Writing Skills',
      subskills: [
        'Identifying the main idea of a paragraph',
        'Distinguishing essential from non-essential information',
        'Condensing information without changing meaning',
      ],
      questions: [
        { subskillLabel: 'Identifying the main idea of a paragraph', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'When summarising a text, what should you focus on first?',
          options: ['The main ideas and key points', 'Every single word used', 'Only the first sentence of each paragraph', 'The author\'s writing style'],
          correct_answer: 'The main ideas and key points' },
        { subskillLabel: 'Distinguishing essential from non-essential information', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Which type of information should usually be LEFT OUT of a summary?',
          options: ['Repeated examples that illustrate the same point', 'The main argument of the text', 'Key facts that support the main idea', 'The overall conclusion'],
          correct_answer: 'Repeated examples that illustrate the same point' },
        { subskillLabel: 'Condensing information without changing meaning', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Summarise this passage in one sentence, keeping the essential meaning: "Many learners struggle with time management, often leaving assignments until the last minute. This leads to rushed, lower-quality work and increased stress. Teachers recommend breaking tasks into smaller steps and starting early to avoid this problem."',
          memo_answer: 'Model answer (accept reasonable equivalents): "Poor time management causes learners to rush assignments and feel stressed, so teachers advise starting early and breaking tasks into smaller steps." Award full marks for a single sentence that captures the problem (poor time management/leaving things late), the consequence (rushed work/stress), and the recommended solution (starting early/breaking into steps), without simply copying full sentences from the original.' },
      ],
    },
    {
      topicKey: 'IdiomsFigurativeExpressions',
      label: 'Idioms and Figurative Expressions',
      subskills: [
        'Understanding common English idioms',
        'Distinguishing literal from figurative meaning',
      ],
      questions: [
        { subskillLabel: 'Understanding common English idioms', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What does the idiom "it\'s raining cats and dogs" mean?',
          options: ['It is raining very heavily', 'Animals are falling from the sky', 'It is a sunny day', 'A storm is bringing strange animals'],
          correct_answer: 'It is raining very heavily' },
        { subskillLabel: 'Understanding common English idioms', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'What does it mean to "spill the beans"?',
          options: ['To reveal a secret', 'To make a mess while cooking', 'To spend all your money', 'To finish a meal quickly'],
          correct_answer: 'To reveal a secret' },
        { subskillLabel: 'Distinguishing literal from figurative meaning', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Explain the difference between the literal and figurative meaning of the idiom "break the ice," and use it correctly in a sentence of your own.',
          memo_answer: 'Model answer: Literal meaning: to physically break apart frozen water. Figurative meaning: to do or say something that relieves tension or awkwardness at the start of a social situation, making people feel more comfortable. Example sentence: "She told a joke to break the ice before the meeting started." Award full marks for a correct explanation of both meanings AND a grammatically correct example sentence that uses the idiom in its figurative (not literal) sense.' },
      ],
    },
    {
      topicKey: 'VocabularyInContext',
      label: 'Vocabulary in Context (Cloze and Word Choice)',
      subskills: [
        'Choosing the correct word to complete a sentence',
        'Using context clues to determine word meaning',
      ],
      questions: [
        { subskillLabel: 'Choosing the correct word to complete a sentence', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Choose the word that best completes the sentence: "The detective carefully ___ the evidence before making a conclusion."',
          options: ['examined', 'ignored', 'destroyed', 'forgot'], correct_answer: 'examined' },
        { subskillLabel: 'Using context clues to determine word meaning', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Read: "The room was so cacophonous that she could barely hear herself think, with shouting, clattering dishes, and blaring music all at once." Based on the context, what does "cacophonous" most likely mean?',
          options: ['Extremely noisy and chaotic', 'Very quiet and peaceful', 'Beautifully decorated', 'Empty and abandoned'],
          correct_answer: 'Extremely noisy and chaotic' },
        { subskillLabel: 'Using context clues to determine word meaning', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read: "Despite the team\'s dwindling resources, they remained resolute, refusing to give up even as their situation grew more dire." Determine the meaning of "resolute" using context clues, and explain which words in the sentence helped you figure it out.',
          memo_answer: 'Model answer: "Resolute" means determined/firm/unwavering in purpose. Context clues: "refusing to give up" directly signals persistence/determination; the contrast word "despite" tells us that being resolute happens IN SPITE OF the negative situation (dwindling resources, dire circumstances), which confirms it means staying strong/determined rather than giving in. Award full marks for a correct definition AND identifying at least one specific context clue (e.g. "refusing to give up" or the contrastive "despite") that supports it.' },
      ],
    },
    {
      topicKey: 'DialoguePunctuation',
      label: 'Punctuating Dialogue',
      subskills: [
        'Correct placement of quotation marks and punctuation in dialogue',
        'Starting a new paragraph for a new speaker',
      ],
      questions: [
        { subskillLabel: 'Correct placement of quotation marks and punctuation in dialogue', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which sentence punctuates dialogue correctly?',
          options: ['"I am tired," she said.', '"I am tired", she said.', '"I am tired." she said.', 'I am tired, she said.'],
          correct_answer: '"I am tired," she said.',
          distractor_notes: {
            '"I am tired", she said.': 'Places the comma outside the closing quotation mark — standard convention places punctuation like commas inside the quotation marks when it belongs to the quoted speech.',
          } },
        { subskillLabel: 'Correct placement of quotation marks and punctuation in dialogue', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which sentence correctly punctuates a quoted question?',
          options: ['"Are you coming?" he asked.', '"Are you coming?", he asked.', '"Are you coming"? he asked.', '"Are you coming." he asked?'],
          correct_answer: '"Are you coming?" he asked.' },
        { subskillLabel: 'Starting a new paragraph for a new speaker', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Explain the rule for paragraphing when writing dialogue between two characters, and why this rule matters for the reader.',
          memo_answer: 'Model answer: The rule is to start a new paragraph every time the speaker changes, even if each line of dialogue is short. This matters because it helps the reader clearly track who is speaking at each point without confusion — without this convention, a conversation would look like a single dense block of text and it would be difficult to tell who said what. Award full marks for correctly stating the "new speaker, new paragraph" rule and explaining that it aids clarity/readability for tracking speakers.' },
      ],
    },
    {
      topicKey: 'SymbolismImagery',
      label: 'Symbolism and Imagery',
      subskills: [
        'Identifying imagery (sensory language)',
        'Identifying symbolism',
        'Interpreting what a symbol represents',
      ],
      questions: [
        { subskillLabel: 'Identifying imagery (sensory language)', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is "imagery" in a poem or story?',
          options: ['Descriptive language that appeals to the five senses', 'The physical pictures/illustrations in a book', 'A word that rhymes with another', 'The title of the piece of writing'],
          correct_answer: 'Descriptive language that appeals to the five senses' },
        { subskillLabel: 'Identifying symbolism', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In literature, a dove is most commonly used as a symbol of:',
          options: ['Peace', 'War', 'Wealth', 'Anger'], correct_answer: 'Peace' },
        { subskillLabel: 'Interpreting what a symbol represents', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'In a story, a character plants a small tree at the start, and by the end of the story the tree has grown tall and strong alongside the character\'s own personal growth. What might the tree symbolise, and why is this an effective symbolic choice by the author?',
          memo_answer: 'Model answer: The tree likely symbolises the character\'s own growth, resilience, or development over time (or could represent hope, new beginnings, or a lasting legacy). This is an effective symbolic choice because the tree\'s literal, gradual growth mirrors the character\'s emotional/personal growth in a visual, concrete way, letting the reader "see" an abstract internal change (growth, maturity) through a physical, external image. Award full marks for a reasonable, well-explained symbolic interpretation connected clearly to growth/change, plus a comment on why the parallel between tree and character is effective.' },
      ],
    },
    {
      topicKey: 'ComparingTwoTexts',
      label: 'Comparing Two Related Texts',
      subskills: [
        'Identifying similarities between two texts',
        'Identifying differences between two texts',
        'Explaining how purpose shapes each text differently',
      ],
      questions: [
        { subskillLabel: 'Identifying similarities between two texts', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'When comparing two texts on the same topic, what is a useful first step?',
          options: ['Identify the purpose and audience of each text', 'Count the number of words in each', 'Only look at the titles', 'Assume they say exactly the same thing'],
          correct_answer: 'Identify the purpose and audience of each text' },
        { subskillLabel: 'Identifying differences between two texts', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Text A is a scientific report on climate change written for researchers. Text B is a poem about climate change written for the general public. What is the most likely difference between them?',
          options: ['Text A uses formal, technical language; Text B uses emotive, figurative language', 'They will use identical vocabulary and tone', 'Text B will contain more statistics than Text A', 'There is no meaningful difference since they cover the same topic'],
          correct_answer: 'Text A uses formal, technical language; Text B uses emotive, figurative language' },
        { subskillLabel: 'Explaining how purpose shapes each text differently', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Text A is a newspaper article reporting facts about a flood disaster. Text B is a diary entry written by a flood survivor. Compare how the different purposes of these two texts would shape their language and tone.',
          memo_answer: 'Model answer: Text A (newspaper article) would use an objective, factual tone, focusing on verified information (statistics, dates, official statements), written in third person to inform the public accurately and impartially. Text B (diary entry) would use a subjective, personal, emotional tone, written in first person, focusing on the writer\'s own feelings, fears, and experiences rather than verified facts, since its purpose is personal reflection rather than public information. Award full marks for correctly contrasting objective/factual vs. subjective/emotional tone AND connecting this difference clearly to each text\'s different purpose and audience.' },
      ],
    },
  ],

  // Grade 10 English Home Language — Term 3: fact vs. opinion/bias, drama
  // conventions, character analysis, persuasive language, paragraph/essay
  // conventions — the testable strand of Term 3's "critical language
  // awareness" and drama/novel focus (full essays are teacher-marked directly).
  'english-10-3': [
    {
      topicKey: 'FactOpinionBias',
      label: 'Distinguishing Fact, Opinion, and Bias',
      subskills: [
        'Identifying statements of fact vs. opinion',
        'Recognising bias in a text',
      ],
      questions: [
        { subskillLabel: 'Identifying statements of fact vs. opinion', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Which of these is a statement of FACT (not opinion)?',
          options: ['South Africa held its first democratic election in 1994.', 'South Africa is the most beautiful country in Africa.', 'Cape Town is a better city than Johannesburg.', 'Everyone should visit Table Mountain.'],
          correct_answer: 'South Africa held its first democratic election in 1994.' },
        { subskillLabel: 'Identifying statements of fact vs. opinion', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Which of these is a statement of OPINION (not fact)?',
          options: ['This is clearly the best novel ever written.', 'The novel was published in 2010.', 'The novel has 300 pages.', 'The novel is set in Cape Town.'],
          correct_answer: 'This is clearly the best novel ever written.' },
        { subskillLabel: 'Recognising bias in a text', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'A news article about a new law only quotes people who support it and uses words like "brilliant" and "long overdue" to describe it. What does this suggest?',
          options: ['The article shows bias in favour of the law', 'The article is completely objective', 'The article is a fact-only report', 'The article opposes the law'],
          correct_answer: 'The article shows bias in favour of the law' },
        { subskillLabel: 'Recognising bias in a text', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read: "The reckless new policy, pushed through by out-of-touch politicians, will obviously harm ordinary citizens." Identify two words or phrases that reveal bias in this sentence, and explain what viewpoint the bias suggests.',
          memo_answer: 'Model answer: Biased words/phrases: "reckless" (suggests the policy is careless/dangerous, not neutral), "out-of-touch" (suggests the politicians don\'t understand or care about ordinary people), "obviously harm" (presents a debatable claim as an undeniable fact). Together these reveal a viewpoint strongly opposed to the policy and the politicians who created it, rather than a neutral/balanced report. Award full marks for identifying at least two loaded words/phrases and correctly explaining the anti-policy viewpoint they reveal.' },
      ],
    },
    {
      topicKey: 'DramaConventions',
      label: 'Drama Conventions',
      subskills: [
        'Identifying stage directions',
        'Understanding dramatic irony',
        'Recognising the function of soliloquy/asides',
      ],
      questions: [
        { subskillLabel: 'Identifying stage directions', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In a play script, what is a "stage direction"?',
          options: ['An instruction (often in italics or brackets) telling actors how to move, speak, or act', 'A line of dialogue spoken by a character', 'The title of a scene', 'A summary of the plot'],
          correct_answer: 'An instruction (often in italics or brackets) telling actors how to move, speak, or act' },
        { subskillLabel: 'Understanding dramatic irony', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'What is "dramatic irony"?',
          options: ['When the audience knows something that a character on stage does not know', 'When a character makes a joke', 'When the ending is unexpected', 'When two characters have the same name'],
          correct_answer: 'When the audience knows something that a character on stage does not know' },
        { subskillLabel: 'Recognising the function of soliloquy/asides', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the purpose of a "soliloquy" in a play?',
          options: ['A character speaks their inner thoughts aloud, alone on stage, revealing feelings to the audience', 'Two characters argue loudly', 'The narrator describes the setting', 'A song is performed'],
          correct_answer: 'A character speaks their inner thoughts aloud, alone on stage, revealing feelings to the audience' },
        { subskillLabel: 'Recognising the function of soliloquy/asides', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Explain the difference between a "soliloquy" and an "aside" in drama, and why a playwright might choose to use one over the other.',
          memo_answer: 'Model answer: A soliloquy is a longer speech where a character (usually alone on stage) reveals their private thoughts or feelings at length. An aside is a brief remark a character makes directly to the audience (or to themselves), often while other characters are present on stage but supposedly cannot hear it. A playwright might use a soliloquy for deep, extended reflection on a character\'s inner conflict, while an aside is better for a quick, witty comment or a brief moment of insight without interrupting the flow of a scene involving other characters. Award full marks for correctly distinguishing length/context (alone vs. others present) and giving a sensible reason for choosing one over the other.' },
      ],
    },
    {
      topicKey: 'CharacterAnalysisBasics',
      label: 'Character Analysis Basics',
      subskills: [
        'Distinguishing protagonist from antagonist',
        'Identifying character traits from actions/dialogue',
        'Understanding character development/change',
      ],
      questions: [
        { subskillLabel: 'Distinguishing protagonist from antagonist', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the "protagonist" of a story?',
          options: ['The main character, around whom the story revolves', 'The character who opposes the main character', 'A minor character with few lines', 'The narrator of the story'],
          correct_answer: 'The main character, around whom the story revolves' },
        { subskillLabel: 'Identifying character traits from actions/dialogue', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'A character gives away her last piece of bread to a stranger, even though she is hungry herself. What character trait does this action best reveal?',
          options: ['Generosity/selflessness', 'Greed', 'Cowardice', 'Arrogance'],
          correct_answer: 'Generosity/selflessness' },
        { subskillLabel: 'Understanding character development/change', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A character begins a story as timid and afraid to speak up, but by the end confidently stands up to a bully. Describe this type of character development, and explain what techniques an author might use to show this change to the reader (rather than just stating it).',
          memo_answer: 'Model answer: This is an example of a "dynamic" or "round" character who undergoes meaningful change/growth over the course of the story (as opposed to a "static" character who stays the same). Authors typically show this change through: contrasting actions/dialogue at the start versus the end (showing, not telling); the character\'s internal thoughts revealing growing confidence; reactions of other characters noticing the change; and a turning point/key event that triggers the transformation. Award full marks for correctly identifying this as character development/growth (dynamic character) and describing at least two specific techniques an author might use to show it.' },
      ],
    },
    {
      topicKey: 'PersuasiveArgumentativeLanguage',
      label: 'Persuasive and Argumentative Language',
      subskills: [
        'Identifying persuasive techniques',
        'Constructing a simple argument with a claim and support',
      ],
      questions: [
        { subskillLabel: 'Identifying persuasive techniques', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: '"Nine out of ten doctors recommend this product" is an example of which persuasive technique?',
          options: ['Appeal to authority/statistics', 'Appeal to emotion', 'Repetition', 'Rhetorical question'],
          correct_answer: 'Appeal to authority/statistics' },
        { subskillLabel: 'Identifying persuasive techniques', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: '"Don\'t you want your family to be safe?" is an example of which persuasive technique?',
          options: ['Rhetorical question', 'Statistic', 'Direct instruction', 'Statement of fact'],
          correct_answer: 'Rhetorical question' },
        { subskillLabel: 'Constructing a simple argument with a claim and support', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Write a short persuasive argument (2-3 sentences) arguing that schools should start later in the morning. Include a clear claim and at least one piece of supporting evidence or reasoning.',
          memo_answer: 'Model answer (example; other reasonable arguments accepted): "Schools should start later in the morning, because research shows that teenagers\' natural sleep cycles make it difficult for them to fall asleep before 11pm. Starting school later would allow students to get enough sleep, improving their concentration and academic performance." Award full marks for a clear claim (schools should start later) PLUS at least one piece of specific supporting reasoning or evidence (not just a restated opinion).' },
      ],
    },
    {
      topicKey: 'ParagraphStructureTopicSentences',
      label: 'Paragraph Structure and Topic Sentences',
      subskills: [
        'Identifying the topic sentence of a paragraph',
        'Understanding supporting details vs. topic sentences',
      ],
      questions: [
        { subskillLabel: 'Identifying the topic sentence of a paragraph', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is a "topic sentence"?',
          options: ['The sentence that states the main idea of a paragraph, usually near the beginning', 'The last sentence in an essay', 'A sentence containing a quotation', 'A question asked at the end of a paragraph'],
          correct_answer: 'The sentence that states the main idea of a paragraph, usually near the beginning' },
        { subskillLabel: 'Understanding supporting details vs. topic sentences', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read this paragraph: "Regular exercise offers many benefits for teenagers. It improves physical fitness and helps maintain a healthy weight. Exercise also releases endorphins, which improve mood and reduce stress. Additionally, participating in team sports builds social skills and teamwork." Identify the topic sentence, and explain how the remaining sentences support it.',
          memo_answer: 'Model answer: Topic sentence: "Regular exercise offers many benefits for teenagers." The remaining sentences support this by providing specific examples of benefits: physical fitness/healthy weight, improved mood/reduced stress (via endorphins), and social skills/teamwork (via team sports) — each supporting detail gives concrete evidence for the general claim made in the topic sentence. Award full marks for correctly identifying the topic sentence and explaining that the following sentences each provide specific supporting examples/evidence for the main idea.' },
      ],
    },
    {
      topicKey: 'EssayConventions',
      label: 'Essay Structure Conventions',
      subskills: [
        'Understanding the introduction-body-conclusion structure',
        'Identifying the function of an introduction',
        'Identifying the function of a conclusion',
      ],
      questions: [
        { subskillLabel: 'Understanding the introduction-body-conclusion structure', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What are the three main structural parts of a standard essay?',
          options: ['Introduction, body, conclusion', 'Title, quote, summary', 'Question, answer, explanation', 'Beginning, middle, twist'],
          correct_answer: 'Introduction, body, conclusion' },
        { subskillLabel: 'Identifying the function of an introduction', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'What should a strong essay introduction typically do?',
          options: ['Introduce the topic and state the main argument/thesis', 'Repeat the conclusion word for word', 'List every single point in detail', 'Ask the reader unrelated questions'],
          correct_answer: 'Introduce the topic and state the main argument/thesis' },
        { subskillLabel: 'Identifying the function of a conclusion', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Explain the function of a conclusion in an essay, and why simply repeating the introduction word-for-word is considered weak essay writing.',
          memo_answer: 'Model answer: A conclusion should summarise the main points/argument of the essay and provide a final, thoughtful closing statement — often reflecting on the significance of the argument or offering a final insight, rather than introducing brand new information. Simply repeating the introduction word-for-word is weak because it adds no new value for the reader; a strong conclusion should synthesise what has been argued and leave the reader with a sense of closure or deeper understanding, not just restate the opening. Award full marks for correctly describing the summarising/closing function of a conclusion and explaining why mere repetition fails to add value.' },
      ],
    },
    {
      topicKey: 'SettingAtmosphere',
      label: 'Setting and Atmosphere',
      subskills: [
        'Identifying the setting of a text',
        'Identifying atmosphere/mood created by descriptive language',
      ],
      questions: [
        { subskillLabel: 'Identifying the setting of a text', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What does the "setting" of a story refer to?',
          options: ['The time and place in which the story occurs', 'The main character\'s personality', 'The moral lesson of the story', 'The author\'s biography'],
          correct_answer: 'The time and place in which the story occurs' },
        { subskillLabel: 'Identifying atmosphere/mood created by descriptive language', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: '"The abandoned house creaked in the wind, its broken windows staring like empty eyes into the fog-shrouded night." What atmosphere does this description create?',
          options: ['Eerie/ominous', 'Cheerful/warm', 'Comedic', 'Peaceful/calm'],
          correct_answer: 'Eerie/ominous' },
        { subskillLabel: 'Identifying atmosphere/mood created by descriptive language', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Read: "Golden sunlight streamed through the kitchen window, and the smell of fresh bread filled the cosy room." Identify the atmosphere created here, and explain which specific words contribute to this effect.',
          memo_answer: 'Model answer: The atmosphere is warm, comforting, and inviting (cosy/homely). Contributing words: "golden sunlight" (associated with warmth and positivity), "streamed" (suggests a gentle, pleasant flow of light), "fresh bread" (a comforting, homely sensory detail/smell), and "cosy" (directly states the comforting feeling of the room). Award full marks for correctly identifying a warm/comforting atmosphere and pointing to at least two specific descriptive words/phrases that create this effect.' },
      ],
    },
    {
      topicKey: 'ThemeIdentification',
      label: 'Identifying Themes in a Text',
      subskills: [
        'Understanding what a "theme" is',
        'Identifying a theme from a short passage',
      ],
      questions: [
        { subskillLabel: 'Understanding what a "theme" is', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'What is the "theme" of a literary text?',
          options: ['The central message, idea, or insight about life/human nature that the text explores', 'A brief summary of the plot events', 'The name of the main character', 'The publication date of the text'],
          correct_answer: 'The central message, idea, or insight about life/human nature that the text explores' },
        { subskillLabel: 'Identifying a theme from a short passage', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'A story follows a wealthy man who loses everything in a financial crash, but discovers genuine friendship and happiness in his simpler new life. Identify a likely theme of this story, and explain how the plot supports this theme.',
          memo_answer: 'Model answer (accept reasonable equivalents): A likely theme is "true happiness/wealth comes from relationships, not material possessions" (or similar: money doesn\'t buy happiness). This is supported by the plot because the character\'s loss of material wealth directly leads to him finding genuine friendship and happiness, suggesting these two states are connected — the story\'s structure (loss followed by unexpected gain in a different area) directly illustrates the idea that non-material things matter more for true contentment. Award full marks for identifying a reasonable, well-articulated theme AND explaining specifically how the plot events illustrate/support it.' },
      ],
    },
    {
      topicKey: 'NarrativeViewpoint',
      label: 'Narrative Point of View',
      subskills: [
        'Identifying first, second, and third person narration',
        'Understanding the effect of narrative choice',
      ],
      questions: [
        { subskillLabel: 'Identifying first, second, and third person narration', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: '"I walked to the shop and bought some bread." This sentence is written in which narrative person?',
          options: ['First person', 'Second person', 'Third person', 'No clear person'],
          correct_answer: 'First person' },
        { subskillLabel: 'Identifying first, second, and third person narration', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: '"She walked to the shop and bought some bread." This sentence is written in which narrative person?',
          options: ['Third person', 'First person', 'Second person', 'No clear person'],
          correct_answer: 'Third person' },
        { subskillLabel: 'Understanding the effect of narrative choice', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Explain the difference in effect between first-person narration ("I felt terrified") and third-person narration ("She felt terrified") on how a reader experiences a story.',
          memo_answer: 'Model answer: First-person narration creates a sense of intimacy and immediacy, since the reader experiences events directly through the narrator\'s own thoughts and feelings, often making the story feel more personal and emotionally immersive, but limited to only what that one character knows. Third-person narration creates more distance/objectivity, allowing the reader (depending on the type) to potentially see into multiple characters\' perspectives or observe events more broadly, giving a wider view but potentially less emotional immediacy than being "inside" a character\'s head. Award full marks for correctly contrasting intimacy/limited perspective (first person) with distance/broader perspective (third person).' },
      ],
    },
    {
      topicKey: 'DebateSkills',
      label: 'Debate and Discussion Skills',
      subskills: [
        'Structuring an argument for a debate',
        'Identifying counter-arguments',
      ],
      questions: [
        { subskillLabel: 'Structuring an argument for a debate', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In a formal debate, what does it mean to be "for the motion"?',
          options: ['You argue in support of/agree with the statement being debated', 'You argue against the statement being debated', 'You remain completely neutral', 'You only ask questions'],
          correct_answer: 'You argue in support of/agree with the statement being debated' },
        { subskillLabel: 'Identifying counter-arguments', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'The motion is: "Homework should be banned in schools." Write one argument FOR this motion, and one counter-argument AGAINST it.',
          memo_answer: 'Model answer (examples; other reasonable arguments accepted): FOR: "Homework should be banned because it causes unnecessary stress and reduces the time students have for rest, family, and other activities outside school." AGAINST (counter-argument): "Homework should not be banned because it reinforces what was learned in class and helps develop independent study skills that students will need later in life." Award full marks for one genuine argument supporting the motion and one genuine counter-argument opposing it, each with a clear reason (not just a bare opinion).' },
      ],
    },
  ],

  // Grade 10 Afrikaans First Additional Language — Term 1: Taalstrukture en
  // -konvensies (the testable grammar strand of the CAPS ATP; comprehension
  // and creative writing are assessed via other means, not auto-gradable MCQ).
  'afrikaans-10-1': [
    {
      topicKey: 'Werkwoordtye',
      label: 'Werkwoordtye (Verb Tenses)',
      subskills: [
        'Identifisering van tye',
        'Vorming van die verlede tyd',
        'Vorming van die teenwoordige en toekomende tyd',
      ],
      questions: [
        { subskillLabel: 'Identifisering van tye', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: '"Ek loop elke dag skool toe." In watter tyd is hierdie sin?',
          options: ['Teenwoordige tyd', 'Verlede tyd', 'Toekomende tyd', 'Voltooid verlede tyd'], correct_answer: 'Teenwoordige tyd',
          distractor_notes: {
            'Voltooid verlede tyd': 'Verwar die teenwoordige tyd (huidige gewoonte, "loop") met die voltooide verlede tyd (wat "het ... geloop" sou wees) — geen "het/ge-" patroon is hier teenwoordig nie.',
          } },
        { subskillLabel: 'Identifisering van tye', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: '"Ek sal môre huis toe gaan." In watter tyd is hierdie sin?',
          options: ['Toekomende tyd', 'Teenwoordige tyd', 'Verlede tyd', 'Gebiedende wys'], correct_answer: 'Toekomende tyd',
          distractor_notes: {
            'Gebiedende wys': 'Verwar \'n toekomstige aksie (met "sal") met \'n bevel/instruksie (gebiedende wys, bv. "Gaan!") — die woord "sal" dui spesifiek toekomende tyd aan.',
          } },
        { subskillLabel: 'Vorming van die verlede tyd', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter voorvoegsel word gewoonlik gebruik om die verlede tyd van \'n werkwoord te vorm?',
          options: ['ge-', 'ver-', 'be-', 'ont-'], correct_answer: 'ge-' },
        { subskillLabel: 'Vorming van die verlede tyd', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Skryf die werkwoord "loop" in die verlede tyd. Gee net die woord (byvoegsel + werkwoord, bv. "ge" + werkwoord).', correct_answer: 'geloop' },
        { subskillLabel: 'Vorming van die verlede tyd', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Skryf die werkwoord "speel" in die verlede tyd. Gee net die woord (byvoegsel + werkwoord, bv. "ge" + werkwoord).', correct_answer: 'gespeel' },
        { subskillLabel: 'Vorming van die teenwoordige en toekomende tyd', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Skryf die sin in die toekomende tyd om: "Ek eet nou kos." Gee die volsin (gebruik "sal" om die toekomende tyd te vorm).', correct_answer: 'Ek sal later kos eet.' },
        { subskillLabel: 'Vorming van die teenwoordige en toekomende tyd', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Skryf drie sinne oor dieselfde aksie ("swem"): een in die teenwoordige tyd, een in die verlede tyd, en een in die toekomende tyd. Verduidelik watter woorde/voorvoegsels vir jou aandui watter tyd elke sin is.',
          memo_answer: 'Modelantwoord (voorbeelde, ander korrekte variasies word aanvaar): Teenwoordige tyd: "Ek swem in die see." Verlede tyd: "Ek het in die see geswem." Toekomende tyd: "Ek sal in die see swem." Verduideliking moet noem: die "het ... ge-" patroon dui verlede tyd aan; "sal" dui toekomende tyd aan; geen ekstra hulpwerkwoord is nodig vir teenwoordige tyd nie. Volpunte vir drie korrek gevormde sinne EN \'n verduideliking wat die spesifieke aanduiders (ge-, het, sal) korrek uitwys.' },
      ],
    },
    {
      topicKey: 'Voornaamwoorde',
      label: 'Voornaamwoorde (Pronouns)',
      subskills: [
        'Persoonlike voornaamwoorde',
        'Besitlike voornaamwoorde',
        'Voornaamwoorde in konteks gebruik',
      ],
      questions: [
        { subskillLabel: 'Persoonlike voornaamwoorde', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter woord is \'n persoonlike voornaamwoord?',
          options: ['hy', 'vinnig', 'huis', 'mooi'], correct_answer: 'hy' },
        { subskillLabel: 'Persoonlike voornaamwoorde', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Vervang die selfstandige naamwoord met die regte persoonlike voornaamwoord: "Sarah gaan skool toe." → "___ gaan skool toe." Gee net die woord.', correct_answer: 'Sy' },
        { subskillLabel: 'Besitlike voornaamwoorde', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter woord is \'n besitlike voornaamwoord?',
          options: ['my', 'ek', 'jy', 'ons loop'], correct_answer: 'my',
          distractor_notes: {
            'ek': 'Verwar die persoonlike voornaamwoord "ek" (verwys na die persoon self) met die besitlike voornaamwoord "my" (dui besit/eienaarskap aan).',
          } },
        { subskillLabel: 'Besitlike voornaamwoorde', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Vul die korrekte besitlike voornaamwoord in: "Dit is ___ boek." (die boek behoort aan jou). Gee net die woord.', correct_answer: 'jou' },
        { subskillLabel: 'Voornaamwoorde in konteks gebruik', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Herskryf die sin deur die onderstreepte selfstandige naamwoorde met die korrekte voornaamwoorde te vervang: "Thabo en Lerato gee Thabo en Lerato se boeke vir die onderwyser." Gee die volledige volsin.', correct_answer: 'Hulle gee hulle boeke vir die onderwyser.' },
      ],
    },
    {
      topicKey: 'Voegwoorde',
      label: 'Voegwoorde (Conjunctions)',
      subskills: [
        'Herkenning van voegwoorde',
        'Gebruik van voegwoorde om sinne te verbind',
        'Kies die korrekte voegwoord vir betekenis',
      ],
      questions: [
        { subskillLabel: 'Herkenning van voegwoorde', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter woord is \'n voegwoord?',
          options: ['en', 'huis', 'vinnig', 'mooi'], correct_answer: 'en' },
        { subskillLabel: 'Herkenning van voegwoorde', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter woord is \'n voegwoord?',
          options: ['maar', 'boom', 'loop', 'groot'], correct_answer: 'maar' },
        { subskillLabel: 'Gebruik van voegwoorde om sinne te verbind', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Verbind die twee sinne met "want": "Ek is moeg." "Ek het lank gewerk." Skryf die volledige volsin.', correct_answer: 'Ek is moeg want ek het lank gewerk.' },
        { subskillLabel: 'Kies die korrekte voegwoord vir betekenis', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Kies die korrekte voegwoord: "Sy wou swem, ___ die water was te koud."',
          options: ['maar', 'en', 'want', 'toe'], correct_answer: 'maar',
          distractor_notes: {
            'want': 'Verwar oorsaak ("want" — omdat) met teenstelling ("maar" — kontras) — die sin dui \'n teenstelling aan (sy wou swem, tog was dit te koud), nie \'n rede nie.',
          } },
        { subskillLabel: 'Kies die korrekte voegwoord vir betekenis', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Verduidelik die verskil in betekenis tussen "en", "maar", en "want" as voegwoorde, en gebruik elkeen in \'n eie voorbeeldsin.',
          memo_answer: 'Modelantwoord: "en" voeg twee idees byeen sonder kontras of oorsaak (bv. "Ek eet en ek drink."). "maar" dui \'n teenstelling of kontras aan (bv. "Ek wou gaan, maar ek was siek."). "want" gee \'n rede/oorsaak vir iets (bv. "Ek bly tuis want ek is siek."). Volpunte vir korrekte verduideliking van al drie voegwoorde EN \'n grammatikaal korrekte, sinvolle voorbeeldsin vir elkeen.' },
      ],
    },
    {
      topicKey: 'DirekteIndirekteRede',
      label: 'Direkte en Indirekte Rede (Direct & Indirect Speech)',
      subskills: [
        'Herkenning van direkte rede',
        'Omskakeling na indirekte rede',
        'Verandering van voornaamwoorde en tye in indirekte rede',
      ],
      questions: [
        { subskillLabel: 'Herkenning van direkte rede', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter sin is \'n voorbeeld van direkte rede?',
          options: ['Sy sê: "Ek is honger."', 'Sy sê sy is honger.', 'Sy het gesê dat sy honger was.', 'Sy was honger.'], correct_answer: 'Sy sê: "Ek is honger."',
          distractor_notes: {
            'Sy sê sy is honger.': 'Bevat geen aanhalingstekens nie en is reeds in indirekte rede herskryf — die presiese woorde van die spreker word nie meer direk aangehaal nie.',
          } },
        { subskillLabel: 'Omskakeling na indirekte rede', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Skryf in indirekte rede om: Hy sê: "Ek is moeg." → Hy sê dat ___. Gee net die woorde wat in die spasie moet kom (onthou: verander die voornaamwoord van "ek" na "hy").', correct_answer: 'hy moeg is' },
        { subskillLabel: 'Omskakeling na indirekte rede', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Skryf in indirekte rede om: Hy sê: "Ek hou van sokker." → Hy sê dat ___',
          options: ['hy van sokker hou', 'ek van sokker hou', 'hy van sokker gehou het', 'hy hou van sokker'], correct_answer: 'hy van sokker hou',
          distractor_notes: {
            'ek van sokker hou': 'Vergeet om die voornaamwoord van die eerste persoon ("ek") na die derde persoon ("hy") te verander wanneer na indirekte rede omgeskakel word.',
            'hy van sokker gehou het': 'Verander die werkwoordtyd onnodig na die verlede tyd, terwyl die oorspronklike stelling in die teenwoordige tyd was.',
          } },
        { subskillLabel: 'Verandering van voornaamwoorde en tye in indirekte rede', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Skryf hierdie sin in indirekte rede om: Sy sê vir my: "Ek sal jou môre bel." Verduidelik watter voornaamwoorde en/of tye jy moes verander en waarom.',
          memo_answer: 'Modelantwoord: "Sy sê vir my dat sy my die volgende dag sal bel." Veranderinge: "ek" → "sy" (die spreker word nou in die derde persoon beskryf); "jou" → "my" (perspektief verskuif na die verteller); "môre" → "die volgende dag" (tydverwysing verskuif weg van die oomblik van praat, aangesien dit nie meer "vandag" se perspektief is nie). Volpunte vir die korrekte omskakeling EN \'n verduideliking wat al drie veranderinge (voornaamwoord van spreker, voornaamwoord van aangesprokene, tydverwysing) korrek uitwys.' },
      ],
    },
    // ── Meervoude en Verkleinwoorde (Plurals & Diminutives) — 'n klassieke
    // toetsvraag-formaat in Afrikaans-taalstruktuurtoetse ──
    {
      topicKey: 'MeervoudeVerkleinwoorde',
      label: 'Meervoude en Verkleinwoorde (Plurals & Diminutives)',
      subskills: [
        'Vorming van meervoude',
        'Vorming van verkleinwoorde',
        'Herkenning van onreëlmatige meervoude',
      ],
      questions: [
        { subskillLabel: 'Vorming van meervoude', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter meervoudsuitgang word die meeste in Afrikaans gebruik?',
          options: ['-e', '-s', '-ers', '-te'], correct_answer: '-e' },
        { subskillLabel: 'Vorming van meervoude', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Skryf die meervoud van "boek". Gee net die woord.', correct_answer: 'boeke' },
        { subskillLabel: 'Vorming van meervoude', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Skryf die meervoud van "stad". (Let op die klinkerverandering.) Gee net die woord.', correct_answer: 'stede' },
        { subskillLabel: 'Vorming van verkleinwoorde', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter verkleinwoorduitgang word by die meeste woorde gebruik, bv. "huis" → "huisie"?',
          options: ['-ie', '-tjie', '-etjie', '-pie'], correct_answer: '-ie' },
        { subskillLabel: 'Vorming van verkleinwoorde', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Skryf die verkleinwoord van "boom". Gee net die woord.', correct_answer: 'boompie' },
        { subskillLabel: 'Vorming van verkleinwoorde', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Skryf die verkleinwoord van "man". Gee net die woord.', correct_answer: 'mannetjie' },
        { subskillLabel: 'Herkenning van onreëlmatige meervoude', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Wat is die korrekte meervoud van "kind"?',
          options: ['kinders', 'kinde', 'kindes', 'kinden'], correct_answer: 'kinders',
          distractor_notes: {
            'kinde': 'Volg die algemene "-e" patroon, maar "kind" het \'n onreëlmatige meervoud wat "-ers" gebruik, nie net "-e" nie.',
          } },
        { subskillLabel: 'Herkenning van onreëlmatige meervoude', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Skryf die meervoud van "koei" en verduidelik waarom hierdie woord nie net "-e" byvoeg nie (soos die meeste woorde).',
          memo_answer: 'Modelantwoord: Die meervoud is "koeie". Verduideliking: waar \'n woord op \'n klinker (soos "-oei") eindig, word dikwels net "-e" bygevoeg sonder verdere klankverandering, maar sommige woorde soos hierdie een verg spesiale aandag vir spelling (bv. geen ekstra "e" of apostroof word ingevoeg nie). Volpunte vir die korrekte meervoud EN \'n redelike verduideliking wat wys die student verstaan dat nie alle woorde dieselfde eenvoudige "-e"-patroon volg nie.' },
      ],
    },
    // ── Vertaling (Translation) — algemeen in EAT-taalstruktuurtoetse ──
    {
      topicKey: 'Vertaling',
      label: 'Vertaling (Translation): Engels ↔ Afrikaans',
      subskills: [
        'Vertaal enkelwoorde',
        'Vertaal korte frases en algemene uitdrukkings',
        'Vertaal volledige sinne',
      ],
      questions: [
        { subskillLabel: 'Vertaal enkelwoorde', question_type: 'short_answer',
          cognitive_level: 'knowledge',
          prompt: 'Vertaal na Afrikaans: "book". Gee net die woord.', correct_answer: 'boek' },
        { subskillLabel: 'Vertaal enkelwoorde', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Vertaal na Engels: "onderwyser". Gee net die woord.', correct_answer: 'teacher' },
        { subskillLabel: 'Vertaal korte frases en algemene uitdrukkings', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Wat is die korrekte Afrikaanse vertaling van "Good morning"?',
          options: ['Goeie môre', 'Goeie dag', 'Totsiens', 'Baie dankie'], correct_answer: 'Goeie môre',
          distractor_notes: {
            'Goeie dag': 'Beteken "good day", nie spesifiek "good morning" nie — \'n algemene verwarring tussen soortgelyke groetuitdrukkings.',
          } },
        { subskillLabel: 'Vertaal korte frases en algemene uitdrukkings', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Vertaal na Afrikaans: "I am hungry". Gee die volsin.', correct_answer: 'Ek is honger' },
        { subskillLabel: 'Vertaal volledige sinne', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Vertaal na Afrikaans: "The dog is playing in the garden". Gee die volsin.', correct_answer: 'Die hond speel in die tuin' },
        { subskillLabel: 'Vertaal volledige sinne', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Vertaal na Afrikaans: "She will visit her grandmother next weekend." Verduidelik ook watter tyd (teenwoordige, verlede, of toekomende) hierdie sin gebruik, en hoe jy dit in Afrikaans aangedui het.',
          memo_answer: 'Modelantwoord: "Sy sal haar ouma die volgende naweek besoek." Hierdie sin is in die toekomende tyd, aangedui deur die Engelse woord "will" en die Afrikaanse woord "sal". Volpunte vir die korrekte vertaling EN die korrekte identifisering/verduideliking van die toekomende tyd en die woord "sal" wat dit aandui.' },
      ],
    },
    // ── Verdere Sinstipes en Interpunksie (aanvullend tot die basiese
    // interpunksie-toets, met meer gevorderde sinsboupatrone) ──
    {
      topicKey: 'SinstipesInterpunksieUitgebrei',
      label: 'Sinstipes en Interpunksie (Uitgebrei)',
      subskills: [
        'Herkenning van vraag-, stel-, en uitroepsinne',
        'Korrekte gebruik van vraagtekens en uitroeptekens',
        'Korrekte gebruik van kommas in \'n opsomming',
      ],
      questions: [
        { subskillLabel: 'Herkenning van vraag-, stel-, en uitroepsinne', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter soort sin is: "Waar is jou huiswerk?"',
          options: ['Vraagsin', 'Stelsin', 'Uitroepsin', 'Gebiedende sin'], correct_answer: 'Vraagsin' },
        { subskillLabel: 'Herkenning van vraag-, stel-, en uitroepsinne', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter soort sin is: "Wat \'n pragtige dag is dit!"',
          options: ['Uitroepsin', 'Vraagsin', 'Stelsin', 'Gebiedende sin'], correct_answer: 'Uitroepsin',
          distractor_notes: {
            'Vraagsin': 'Die woord "wat" kom voor, maar hierdie sin druk verbasing/bewondering uit (met \'n uitroepteken), nie \'n regte vraag nie.',
          } },
        { subskillLabel: 'Korrekte gebruik van vraagtekens en uitroeptekens', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter punktuasieteken pas by die einde van hierdie sin: "Moenie so hard skree nie___"',
          options: ['!', '?', '.', ','], correct_answer: '!',
          distractor_notes: {
            '.': 'Punktuasie moet die emosionele/gebiedende toon van die sin weerspieël (\'n bevel/waarskuwing), nie net \'n neutrale stelling nie.',
          } },
        { subskillLabel: 'Korrekte gebruik van kommas in \'n opsomming', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Watter sin gebruik kommas korrek in \'n lys?',
          options: ['Ek het appels, piesangs en druiwe gekoop.', 'Ek het appels piesangs, en druiwe gekoop.', 'Ek het, appels piesangs en druiwe gekoop.', 'Ek het appels, piesangs, en, druiwe gekoop.'],
          correct_answer: 'Ek het appels, piesangs en druiwe gekoop.' },
        { subskillLabel: 'Korrekte gebruik van kommas in \'n opsomming', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Skryf hierdie sin oor met die korrekte punktuasie: "het jy al klaar geëet vra sy"',
          memo_answer: 'Modelantwoord: "Het jy al klaar geëet?" vra sy. (Aanhalingstekens, hoofletter aan die begin van die aangehaalde sin, en \'n vraagteken binne die aanhalingstekens omdat die aangehaalde deel self \'n vraag is.) Volpunte vir korrekte aanhalingstekens, korrekte hoofletter, en korrekte plasing van die vraagteken.' },
      ],
    },
    // ── Byvoeglike Naamwoorde (Adjectives) — trappe van vergelyking is 'n
    // gereelde toetsitem in Afrikaans EAT-taalstruktuurtoetse ──
    {
      topicKey: 'ByvoeglikeNaamwoorde',
      label: 'Byvoeglike Naamwoorde (Adjectives): Trappe van Vergelyking',
      subskills: [
        'Herkenning van byvoeglike naamwoorde',
        'Vorming van die vergrotende trap',
        'Vorming van die oortreffende trap',
      ],
      questions: [
        { subskillLabel: 'Herkenning van byvoeglike naamwoorde', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In die sin "Die groot hond blaf hard", watter woord is die byvoeglike naamwoord?',
          options: ['groot', 'hond', 'blaf', 'hard'], correct_answer: 'groot',
          distractor_notes: {
            'hard': 'Dit is \'n bywoord (beskryf hoe die hond blaf), nie \'n byvoeglike naamwoord (wat \'n selfstandige naamwoord beskryf) nie.',
          } },
        { subskillLabel: 'Vorming van die vergrotende trap', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter uitgang word gewoonlik gebruik om die vergrotende trap te vorm, bv. "groot" → "groter"?',
          options: ['-er', '-ste', '-tjie', '-lik'], correct_answer: '-er' },
        { subskillLabel: 'Vorming van die vergrotende trap', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Skryf die vergrotende trap van "vinnig". Gee net die woord.', correct_answer: 'vinniger' },
        { subskillLabel: 'Vorming van die oortreffende trap', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Skryf die oortreffende trap van "groot" (met "die" ingesluit). Gee die volledige vorm.', correct_answer: 'die grootste' },
        { subskillLabel: 'Vorming van die oortreffende trap', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Skryf al drie trappe van vergelyking (stellende, vergrotende, oortreffende trap) van die woord "mooi", en verduidelik kortliks wanneer elke trap gebruik word.',
          memo_answer: 'Modelantwoord: Stellende trap: "mooi" (beskryf een ding sonder vergelyking). Vergrotende trap: "mooier" (vergelyk twee dinge). Oortreffende trap: "die mooiste" (vergelyk drie of meer dinge, dui die uiterste aan). Volpunte vir al drie korrekte vorme EN \'n korrekte, kort verduideliking van wanneer elkeen gebruik word.' },
      ],
    },
    // ── Woordorde (Word Order) — 'n uitdagende area vir EAT-leerders, veral
    // in vraagsinne en bysinne ──
    {
      topicKey: 'Woordorde',
      label: 'Woordorde (Word Order) in Afrikaanse Sinne',
      subskills: [
        'Woordorde in stelsinne',
        'Woordorde in vraagsinne',
        'Woordorde in bysinne (werkwoord aan die einde)',
      ],
      questions: [
        { subskillLabel: 'Woordorde in stelsinne', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter sin het die korrekte woordorde?',
          options: ['Sy gaan môre skool toe.', 'Sy môre gaan skool toe.', 'Môre sy gaan skool toe.', 'Gaan sy môre skool toe.'], correct_answer: 'Sy gaan môre skool toe.' },
        { subskillLabel: 'Woordorde in vraagsinne', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter sin het die korrekte woordorde vir \'n vraagsin?',
          options: ['Gaan jy môre skool toe?', 'Jy gaan môre skool toe?', 'Môre gaan jy skool toe?', 'Skool toe gaan jy môre?'], correct_answer: 'Gaan jy môre skool toe?',
          distractor_notes: {
            'Jy gaan môre skool toe?': 'Volg die stelsin-woordorde (onderwerp eerste), maar \'n vraagsin in Afrikaans vereis dat die werkwoord na die eerste plek beweeg (werkwoord-onderwerp-omkering).',
          } },
        { subskillLabel: 'Woordorde in bysinne (werkwoord aan die einde)', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Watter sin het die korrekte woordorde in die bysin (let op waar die werkwoord moet wees)?',
          options: ['Ek weet dat sy more kom.', 'Ek weet dat sy kom more.', 'Ek weet dat kom sy more.', 'Ek weet sy dat more kom.'], correct_answer: 'Ek weet dat sy more kom.',
          distractor_notes: {
            'Ek weet dat sy kom more.': 'Plaas die werkwoord ("kom") te vroeg — in \'n Afrikaanse bysin (na "dat") moet die werkwoord na die einde van die bysin skuif, nie in die middel bly soos in \'n hoofsin nie.',
          } },
        { subskillLabel: 'Woordorde in bysinne (werkwoord aan die einde)', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Herskryf hierdie twee sinne as een sin deur "want" te gebruik, en verduidelik waar die werkwoord in die bysin moet wees: "Ek bly tuis." "Ek is siek."',
          memo_answer: 'Modelantwoord: "Ek bly tuis want ek is siek." Verduideliking: na "want" (\'n nevenskikkende voegwoord in hierdie geval) bly die woordorde van die tweede sin onveranderd (onderwerp-werkwoord), anders as na onderskikkende voegwoorde soos "dat" waar die werkwoord na die einde van die bysin sou skuif. Volpunte vir die korrekte samegestelde sin EN \'n verduideliking wat wys die student verstaan die woordorde-reël (al is dit net om te wys "want" nie die werkwoord laat skuif nie).' },
      ],
    },
    // ── Leesbegrip Woordeskat (Reading Comprehension Vocabulary-in-Context) —
    // 'n integrale deel van EAT-leesbegriptoetse ──
    {
      topicKey: 'LeesbegripWoordeskat',
      label: 'Leesbegrip: Woordeskat in Konteks',
      subskills: [
        'Verstaan van woordbetekenis in konteks',
        'Identifisering van sinonieme',
        'Identifisering van antonieme',
      ],
      questions: [
        { subskillLabel: 'Verstaan van woordbetekenis in konteks', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Lees: "Die kinders was uitgeput na die lang wandeltog." Wat beteken "uitgeput" in hierdie sin?',
          options: ['Baie moeg', 'Baie gelukkig', 'Baie honger', 'Baie opgewonde'], correct_answer: 'Baie moeg' },
        { subskillLabel: 'Identifisering van sinonieme', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter woord is \'n sinoniem (soortgelyke betekenis) van "vinnig"?',
          options: ['vlugtig', 'stadig', 'stil', 'groot'], correct_answer: 'vlugtig',
          distractor_notes: {
            'stadig': 'Dit is die antoniem (teenoorgestelde) van "vinnig", nie \'n sinoniem nie — \'n algemene verwarring tussen sinonieme en antonieme.',
          } },
        { subskillLabel: 'Identifisering van antonieme', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter woord is die antoniem (teenoorgestelde) van "sterk"?',
          options: ['swak', 'kragtig', 'fris', 'gesond'], correct_answer: 'swak' },
        { subskillLabel: 'Identifisering van antonieme', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Lees: "Die student was baie ywerig met haar huiswerk." Gee een sinoniem en een antoniem vir "ywerig", en verduidelik hoe die sin se betekenis sou verander as jy elkeen sou vervang.',
          memo_answer: 'Modelantwoord: Sinoniem: "fluks" / "hardwerkend" — die vervanging behou dieselfde betekenis, die student werk steeds hard. Antoniem: "lui" / "traag" — die vervanging keer die betekenis heeltemal om, en suggereer die student was nalatig met haar huiswerk in plaas van toegewyd. Volpunte vir \'n regte sinoniem en antoniem (nie net amper-woorde nie) plus \'n duidelike verduideliking van die betekenisverskil vir elkeen.' },
      ],
    },
  ],

  // Grade 10 Afrikaans First Additional Language — Term 2: sinsdele
  // (onderwerp/gesegde/voorwerp), betreklike/aanwysende voornaamwoorde,
  // lidwoorde, samestellings — die KABV Kwartaal 2 taalstruktuur-fokus.
  'afrikaans-10-2': [
    {
      topicKey: 'BetreklikeAanwysendeVoornaamwoorde',
      label: 'Betreklike en Aanwysende Voornaamwoorde',
      subskills: [
        'Herkenning van betreklike voornaamwoorde',
        'Herkenning van aanwysende voornaamwoorde',
      ],
      questions: [
        { subskillLabel: 'Herkenning van betreklike voornaamwoorde', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In die sin "Die man wat gister hier was, is my oom", watter woord is die betreklike voornaamwoord?',
          options: ['wat', 'man', 'gister', 'oom'], correct_answer: 'wat' },
        { subskillLabel: 'Herkenning van betreklike voornaamwoorde', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter woord word gewoonlik gebruik as \'n betreklike voornaamwoord na \'n persoon?',
          options: ['wat', 'hierdie', 'daardie', 'watter'], correct_answer: 'wat' },
        { subskillLabel: 'Herkenning van aanwysende voornaamwoorde', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter woord is \'n aanwysende voornaamwoord in "Hierdie boek is myne"?',
          options: ['Hierdie', 'boek', 'is', 'myne'], correct_answer: 'Hierdie' },
        { subskillLabel: 'Herkenning van aanwysende voornaamwoorde', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Skryf twee sinne: een met "hierdie" (naby) en een met "daardie" (ver) as aanwysende voornaamwoorde, en verduidelik die verskil in betekenis tussen die twee woorde.',
          memo_answer: 'Modelantwoord (voorbeelde, ander redelike variasies word aanvaar): "Hierdie huis is myne." (dui iets naby die spreker aan.) "Daardie huis behoort aan my buurman." (dui iets ver van die spreker aan.) Verduideliking: "hierdie" word gebruik vir iets naby (in afstand of tyd), terwyl "daardie" gebruik word vir iets verder weg. Volpunte vir twee korrekte, grammatikale voorbeeldsinne EN \'n korrekte verduideliking van die naby/ver-onderskeid.' },
      ],
    },
    {
      topicKey: 'Lidwoorde',
      label: 'Lidwoorde (Articles): Bepaald en Onbepaald',
      subskills: [
        'Herkenning van die bepaalde lidwoord',
        'Herkenning van die onbepaalde lidwoord',
      ],
      questions: [
        { subskillLabel: 'Herkenning van die bepaalde lidwoord', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter woord is die bepaalde lidwoord in Afrikaans (soos "the" in Engels)?',
          options: ['die', "'n", 'daardie', 'hierdie'], correct_answer: 'die' },
        { subskillLabel: 'Herkenning van die onbepaalde lidwoord', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter woord is die onbepaalde lidwoord in Afrikaans (soos "a/an" in Engels)?',
          options: ["'n", 'die', 'hierdie', 'watter'], correct_answer: "'n" },
        { subskillLabel: 'Herkenning van die onbepaalde lidwoord', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter sin gebruik die lidwoord korrek?',
          options: ["Sy het 'n hond gekoop.", 'Sy het die hond gekoop \'n nuwe een.', "Sy het 'n die hond gekoop.", 'Sy het hond gekoop.'], correct_answer: "Sy het 'n hond gekoop." },
      ],
    },
    {
      topicKey: 'OnderwerpGesegdeVoorwerp',
      label: 'Onderwerp, Gesegde en Voorwerp (Sentence Parts)',
      subskills: [
        'Identifisering van die onderwerp',
        'Identifisering van die gesegde (werkwoorddeel)',
        'Identifisering van die voorwerp',
      ],
      questions: [
        { subskillLabel: 'Identifisering van die onderwerp', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In die sin "Die hond blaf hard", wat is die onderwerp?',
          options: ['Die hond', 'blaf', 'hard', 'Geen onderwerp nie'], correct_answer: 'Die hond' },
        { subskillLabel: 'Identifisering van die gesegde (werkwoorddeel)', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In die sin "Die kinders speel buite", wat is die gesegde (werkwoorddeel)?',
          options: ['speel', 'Die kinders', 'buite', 'kinders'], correct_answer: 'speel' },
        { subskillLabel: 'Identifisering van die voorwerp', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'In die sin "Sy koop \'n rok", wat is die voorwerp (die ding wat die aksie ontvang)?',
          options: ["'n rok", 'Sy', 'koop', 'Geen voorwerp nie'], correct_answer: "'n rok" },
        { subskillLabel: 'Identifisering van die voorwerp', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Ontleed hierdie sin deur die onderwerp, gesegde, en voorwerp te identifiseer: "Die onderwyser merk die toetse."',
          memo_answer: 'Modelantwoord: Onderwerp: "Die onderwyser" (wie die aksie doen). Gesegde: "merk" (die werkwoorddeel/aksie). Voorwerp: "die toetse" (wat die aksie ontvang). Volpunte vir al drie korrek geïdentifiseerde sinsdele.' },
      ],
    },
    {
      topicKey: 'Samestellings',
      label: 'Samestellings (Compound Words)',
      subskills: [
        'Herkenning van samestellings',
        'Vorming van samestellings',
      ],
      questions: [
        { subskillLabel: 'Herkenning van samestellings', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Wat is \'n "samestelling" in Afrikaans?',
          options: ['Twee of meer woorde wat saam een nuwe woord vorm, bv. "voetbal"', 'Enige woord met meer as vyf letters', 'Twee sinne wat saamgevoeg is', 'Die meervoud van \'n selfstandige naamwoord'],
          correct_answer: 'Twee of meer woorde wat saam een nuwe woord vorm, bv. "voetbal"' },
        { subskillLabel: 'Vorming van samestellings', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Vorm \'n samestelling deur "huis" en "werk" saam te voeg. Gee net die woord.', correct_answer: 'huiswerk' },
        { subskillLabel: 'Vorming van samestellings', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Vorm \'n samestelling deur "skool" en "tas" saam te voeg. Gee net die woord.', correct_answer: 'skooltas' },
      ],
    },
    {
      topicKey: 'VoorsetselsBywoorde',
      label: 'Voorsetsels en Bywoorde (Prepositions & Adverbs)',
      subskills: [
        'Herkenning van voorsetsels',
        'Herkenning van bywoorde',
        'Onderskeiding tussen voorsetsels en bywoorde',
      ],
      questions: [
        { subskillLabel: 'Herkenning van voorsetsels', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'In die sin "Die kat sit onder die tafel", watter woord is die voorsetsel?',
          options: ['onder', 'kat', 'sit', 'tafel'], correct_answer: 'onder' },
        { subskillLabel: 'Herkenning van bywoorde', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In die sin "Sy hardloop vinnig", watter woord is die bywoord?',
          options: ['vinnig', 'Sy', 'hardloop', 'Geen bywoord nie'], correct_answer: 'vinnig' },
        { subskillLabel: 'Onderskeiding tussen voorsetsels en bywoorde', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Verduidelik die verskil tussen \'n voorsetsel en \'n bywoord, en gee een voorbeeldsin vir elkeen.',
          memo_answer: 'Modelantwoord: \'n Voorsetsel dui die verhouding tussen woorde aan, veral plek, tyd, of rigting (bv. "onder," "in," "na"), en kom gewoonlik voor \'n selfstandige naamwoord (bv. "Die boek is op die tafel"). \'n Bywoord beskryf \'n werkwoord, byvoeglike naamwoord, of ander bywoord, en gee inligting oor hoe, wanneer, of waar iets gebeur (bv. "Sy sing mooi"). Volpunte vir \'n korrekte verduideliking van albei woordsoorte EN \'n korrekte voorbeeldsin vir elkeen.' },
      ],
    },
    {
      topicKey: 'VerledetydVerdiep',
      label: 'Verledetyd Verdiep: Sterk en Swak Werkwoorde',
      subskills: [
        'Onderskeiding tussen sterk en swak werkwoorde',
        'Vorming van die verlede tyd van sterk werkwoorde',
      ],
      questions: [
        { subskillLabel: 'Onderskeiding tussen sterk en swak werkwoorde', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Wat is die verskil tussen \'n "sterk" en \'n "swak" werkwoord in Afrikaans?',
          options: ['Sterk werkwoorde verander hul vokaal in die verlede tyd (bv. "sing" → "gesing"); swak werkwoorde volg net die gewone "ge-" patroon', 'Sterk werkwoorde is altyd langer as swak werkwoorde', 'Swak werkwoorde word nooit in die verlede tyd gebruik nie', 'Daar is geen werklike verskil nie'],
          correct_answer: 'Sterk werkwoorde verander hul vokaal in die verlede tyd (bv. "sing" → "gesing"); swak werkwoorde volg net die gewone "ge-" patroon' },
        { subskillLabel: 'Vorming van die verlede tyd van sterk werkwoorde', question_type: 'short_answer',
          cognitive_level: 'complex',
          prompt: 'Skryf die werkwoord "sien" in die verlede tyd (dit is \'n sterk werkwoord met \'n klinkerverandering). Gee net die woord.', correct_answer: 'gesien' },
      ],
    },
    {
      topicKey: 'SinoniemeAntoniemeVerdiep',
      label: 'Sinonieme en Antonieme (Verdiep)',
      subskills: [
        'Sinonieme vir algemene woorde',
        'Antonieme vir algemene woorde',
      ],
      questions: [
        { subskillLabel: 'Sinonieme vir algemene woorde', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter woord is \'n sinoniem van "bly" (gelukkig)?',
          options: ['vrolik', 'hartseer', 'kwaad', 'moeg'], correct_answer: 'vrolik' },
        { subskillLabel: 'Antonieme vir algemene woorde', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter woord is die antoniem van "warm"?',
          options: ['koud', 'droog', 'nat', 'sag'], correct_answer: 'koud' },
      ],
    },
    {
      topicKey: 'SpellingSkryfwyse',
      label: 'Spelling en Skryfwyse',
      subskills: [
        'Korrekte spelling van algemene foute',
        'Gebruik van hoofletters',
      ],
      questions: [
        { subskillLabel: 'Korrekte spelling van algemene foute', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter woord is korrek gespel?',
          options: ['geskryf', 'geskrywe', 'geskrief', 'geskryft'], correct_answer: 'geskryf' },
        { subskillLabel: 'Gebruik van hoofletters', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter sin gebruik hoofletters korrek?',
          options: ['Ek woon in Kaapstad.', 'ek woon in kaapstad.', 'Ek Woon In Kaapstad.', 'ek woon in Kaapstad'], correct_answer: 'Ek woon in Kaapstad.' },
      ],
    },
    {
      topicKey: 'LeesbegripKwartaal2',
      label: 'Leesbegrip: Hooffeite en Afleidings',
      subskills: [
        'Identifisering van hooffeite in \'n teks',
        'Maak van redelike afleidings',
      ],
      questions: [
        { subskillLabel: 'Identifisering van hooffeite in \'n teks', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Wat is die doel daarvan om die hoofidee van \'n paragraaf te identifiseer?',
          options: ['Om die belangrikste punt van die paragraaf te verstaan', 'Om elke woord in die paragraaf te memoriseer', 'Om die skrywer se naam te vind', 'Om die paragraaf te ignoreer'],
          correct_answer: 'Om die belangrikste punt van die paragraaf te verstaan' },
        { subskillLabel: 'Maak van redelike afleidings', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Lees: "Lerato het driemaal na haar selfoon gekyk en toe vinnig na die deur gestap." Wat kan jy aflei oor Lerato se gemoedstoestand, en watter woorde in die sin ondersteun jou afleiding?',
          memo_answer: 'Modelantwoord: \'n Mens kan aflei dat Lerato ongeduldig of angstig is, moontlik omdat sy op iemand of iets wag. Ondersteunende woorde: "driemaal na haar selfoon gekyk" dui op herhaalde, angstige kontrole; "vinnig na die deur gestap" dui op haastige, dringende optrede. Volpunte vir \'n redelike afleiding (ongeduld/angstigheid/haas) wat spesifiek deur woorde uit die teks ondersteun word.' },
      ],
    },
    {
      topicKey: 'VraeVormingKwartaal2',
      label: 'Vraagvorming (Forming Questions)',
      subskills: [
        'Vorming van ja/nee-vrae',
        'Vorming van vrae met vraagwoorde (wie, wat, waar, hoekom)',
      ],
      questions: [
        { subskillLabel: 'Vorming van ja/nee-vrae', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter sin is \'n korrekte ja/nee-vraag?',
          options: ['Gaan jy môre werk toe?', 'Jy gaan môre werk toe.', 'Wie gaan môre werk toe?', 'Jy môre werk toe gaan?'], correct_answer: 'Gaan jy môre werk toe?' },
        { subskillLabel: 'Vorming van vrae met vraagwoorde (wie, wat, waar, hoekom)', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Vorm \'n vraag oor die onderstreepte deel: "Sy gaan Saterdag na die mark." (vra oor WANNEER). Gee die volledige vraagsin.', correct_answer: 'Wanneer gaan sy na die mark?' },
      ],
    },
  ],

  // Grade 10 Afrikaans First Additional Language — Term 3: visuele tekste
  // (spotprente, advertensies, grafieke) en verdere taalstrukture — die KABV
  // Kwartaal 3 fokus op "lees en kyk" van visuele tekste.
  'afrikaans-10-3': [
    {
      topicKey: 'VisueleTekste',
      label: 'Visuele Tekste: Spotprente en Advertensies',
      subskills: [
        'Interpretasie van spotprente',
        'Interpretasie van advertensies',
      ],
      questions: [
        { subskillLabel: 'Interpretasie van spotprente', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Wat is die hoofdoel van \'n politieke spotprent?',
          options: ['Om \'n kommentaar of kritiek op \'n onderwerp humoristies of ironies oor te dra', 'Om net feite sonder mening weer te gee', 'Om \'n produk te adverteer', 'Om \'n resep te verduidelik'],
          correct_answer: 'Om \'n kommentaar of kritiek op \'n onderwerp humoristies of ironies oor te dra' },
        { subskillLabel: 'Interpretasie van spotprente', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Watter tegniek gebruik spotprenttekenaars dikwels om \'n publieke figuur uit te ken?',
          options: ['Oordrywing (karikatuur) van fisiese kenmerke', 'Presiese, realistiese tekeninge sonder oordrywing', 'Slegs woorde, geen tekeninge nie', 'Ewekansige, onverwante beelde'],
          correct_answer: 'Oordrywing (karikatuur) van fisiese kenmerke' },
        { subskillLabel: 'Interpretasie van advertensies', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Wat is die hoofdoel van \'n advertensie?',
          options: ['Om die leser/kyker te oortuig om iets te koop of te doen', 'Om net inligting sonder oorredingsdoel te gee', 'Om \'n gedig te wees', 'Om \'n amptelike verslag te wees'],
          correct_answer: 'Om die leser/kyker te oortuig om iets te koop of te doen' },
        { subskillLabel: 'Interpretasie van advertensies', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Beskryf twee tegnieke wat adverteerders algemeen gebruik om verbruikers te oortuig (bv. kleur, slagspreuke, prominente persoonlikhede), en verduidelik hoe elkeen die kyker beïnvloed.',
          memo_answer: 'Modelantwoord (voorbeelde, ander redelike tegnieke word aanvaar): 1) Slagspreuke (\'n kort, onthoubare frase) — dit maak die produk maklik om te onthou en skep \'n positiewe assosiasie in die kyker se gedagtes. 2) Bekende persoonlikhede/getuienisse — wanneer \'n bekende of vertroude figuur die produk aanbeveel, voel die kyker meer geneig om die produk ook te vertrou, al is daar geen werklike bewys van kwaliteit nie. Volpunte vir twee korrek beskryfde tegnieke EN \'n verduideliking van hoe elkeen die kyker se denke of gedrag beïnvloed.' },
      ],
    },
    {
      topicKey: 'GrafiekeTabelleInterpretasie',
      label: 'Interpretasie van Grafieke en Tabelle',
      subskills: [
        'Lees van inligting uit \'n grafiek',
        'Lees van inligting uit \'n tabel',
      ],
      questions: [
        { subskillLabel: 'Lees van inligting uit \'n grafiek', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Wanneer jy \'n grafiek lees, wat moet jy eerste kontroleer?',
          options: ['Die titel en die eenhede op elke as', 'Net die kleur van die lyne', 'Net die laaste datapunt', 'Die grootte van die bladsy'],
          correct_answer: 'Die titel en die eenhede op elke as' },
        { subskillLabel: 'Lees van inligting uit \'n tabel', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'In \'n tabel met rye en kolomme, wat verteenwoordig die kolomkoppe gewoonlik?',
          options: ['Die kategorieë of tipe inligting wat in daardie kolom aangebied word', 'Willekeurige getalle', 'Slegs datums', 'Die skrywer se naam'],
          correct_answer: 'Die kategorieë of tipe inligting wat in daardie kolom aangebied word' },
      ],
    },
    {
      topicKey: 'IdiomeGesegdes',
      label: 'Idiome en Gesegdes',
      subskills: [
        'Verstaan van algemene Afrikaanse idiome',
        'Gebruik van idiome in konteks',
      ],
      questions: [
        { subskillLabel: 'Verstaan van algemene Afrikaanse idiome', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Wat beteken die idioom "die kat uit die boom kyk"?',
          options: ['Om te wag en te sien wat gebeur voordat jy \'n besluit neem', 'Om vinnig te reageer sonder om te dink', 'Om baie kwaad te wees', 'Om \'n kat as troeteldier aan te hou'],
          correct_answer: 'Om te wag en te sien wat gebeur voordat jy \'n besluit neem' },
        { subskillLabel: 'Verstaan van algemene Afrikaanse idiome', question_type: 'mcq',
          cognitive_level: 'routine',
          prompt: 'Wat beteken die idioom "op sy agterpote staan"?',
          options: ['Om kwaad of verontwaardig te wees', 'Om baie gelukkig te wees', 'Om moeg te wees', 'Om vinnig te hardloop'],
          correct_answer: 'Om kwaad of verontwaardig te wees' },
        { subskillLabel: 'Gebruik van idiome in konteks', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Verduidelik die betekenis van die idioom "die spykerkop raak slaan", en gebruik dit korrek in \'n eie volsin.',
          memo_answer: 'Modelantwoord: Die idioom beteken om presies die regte ding te sê of te doen, of om die kern/essensie van \'n saak raak te vat. Voorbeeldsin: "Met haar opmerking oor die probleem het sy werklik die spykerkop raak geslaan." Volpunte vir \'n korrekte verduideliking van die betekenis EN \'n grammatikaal korrekte, sinvolle voorbeeldsin wat die idioom gepas gebruik.' },
      ],
    },
    {
      topicKey: 'OpsommingVaardighede',
      label: 'Opsommingsvaardighede',
      subskills: [
        'Identifisering van hoofpunte vir \'n opsomming',
        'Skryf van \'n bondige opsomming',
      ],
      questions: [
        { subskillLabel: 'Identifisering van hoofpunte vir \'n opsomming', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Wat moet \'n mens eerste doen wanneer \'n teks opgesom word?',
          options: ['Identifiseer die hoofidees en belangrikste punte', 'Skryf elke woord van die oorspronklike teks oor', 'Voeg jou eie nuwe inligting by', 'Ignoreer die titel van die teks'],
          correct_answer: 'Identifiseer die hoofidees en belangrikste punte' },
        { subskillLabel: 'Skryf van \'n bondige opsomming', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Som hierdie paragraaf op in een sin: "Baie leerders vind dit moeilik om hul tyd te bestuur, en stel dikwels take tot die laaste minuut uit. Dit lei tot haastige, swakker werk en meer stres. Onderwysers beveel aan dat leerders take in kleiner stappe verdeel en vroeg begin."',
          memo_answer: 'Modelantwoord: "Swak tydsbestuur veroorsaak haastige werk en stres by leerders, daarom beveel onderwysers aan om vroeg te begin en take in kleiner stappe te verdeel." Volpunte vir \'n enkele sin wat die probleem (swak tydsbestuur), die gevolg (haastige werk/stres), en die voorgestelde oplossing (vroeg begin/kleiner stappe) korrek vasvang, sonder om net volsinne uit die oorspronklike teks oor te skryf.' },
      ],
    },
    {
      topicKey: 'FormeleTeksteSkryf',
      label: 'Skryf van Formele Tekste',
      subskills: [
        'Herkenning van formele vs. informele taal',
        'Skryf van \'n formele e-pos of brief',
      ],
      questions: [
        { subskillLabel: 'Herkenning van formele vs. informele taal', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter sin is formeel geskryf?',
          options: ['Ek wil graag u hulp met hierdie saak vra.', 'Ek wil net weet of jy kan help, ne?', 'Kan jy gou-gou help asseblief?', 'Help my gou hiermee.'],
          correct_answer: 'Ek wil graag u hulp met hierdie saak vra.' },
        { subskillLabel: 'Skryf van \'n formele e-pos of brief', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Skryf die opening (aanhef) en eerste sin van \'n formele e-pos aan \'n skoolhoof om \'n afspraak aan te vra.',
          memo_answer: 'Modelantwoord (voorbeeld; ander redelike, formele variasies word aanvaar): "Geagte Mnr./Mev. [Van], Ek skryf hierdie e-pos om \'n afspraak met u te versoek om \'n saak rakende my studies te bespreek." Volpunte vir \'n korrekte, formele aanhef (bv. "Geagte...") EN \'n eerste sin wat duidelik en formeel die doel van die e-pos verduidelik.' },
      ],
    },
    {
      topicKey: 'VergelykendeTrappeVerdiep',
      label: 'Vergelykende Trappe (Verdiep)',
      subskills: [
        'Onreëlmatige trappe van vergelyking',
        'Gebruik van trappe van vergelyking in konteks',
      ],
      questions: [
        { subskillLabel: 'Onreëlmatige trappe van vergelyking', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Wat is die oortreffende trap van "goed" (\'n onreëlmatige vorm)?',
          options: ['die beste', 'die goedste', 'die meer goeie', 'die goeier'], correct_answer: 'die beste',
          distractor_notes: {
            'die goedste': 'Volg die gewone "-ste" patroon, maar "goed" het \'n onreëlmatige oortreffende trap ("beste"), soortgelyk aan Engels se "good-better-best".',
          } },
        { subskillLabel: 'Gebruik van trappe van vergelyking in konteks', question_type: 'short_answer',
          cognitive_level: 'routine',
          prompt: 'Vul die korrekte vergrotende trap in: "Hierdie boek is ___ (interessant) as daardie een." Gee net die woord.', correct_answer: 'interessanter' },
      ],
    },
    {
      topicKey: 'VoegwoordeVerdiep',
      label: 'Voegwoorde (Verdiep): Onderskikkend en Nevenskikkend',
      subskills: [
        'Onderskeiding tussen onderskikkende en nevenskikkende voegwoorde',
        'Gebruik van onderskikkende voegwoorde',
      ],
      questions: [
        { subskillLabel: 'Onderskeiding tussen onderskikkende en nevenskikkende voegwoorde', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Watter tipe voegwoord verbind twee gelykwaardige (hoof)sinne, soos "en" of "maar"?',
          options: ['Nevenskikkende voegwoord', 'Onderskikkende voegwoord', 'Betreklike voornaamwoord', 'Vraagwoord'],
          correct_answer: 'Nevenskikkende voegwoord' },
        { subskillLabel: 'Gebruik van onderskikkende voegwoorde', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Watter voegwoord is \'n voorbeeld van \'n onderskikkende voegwoord (verbind \'n hoofsin met \'n bysin)?',
          options: ['omdat', 'en', 'maar', 'of'], correct_answer: 'omdat',
          distractor_notes: {
            'en': 'Dit is \'n nevenskikkende voegwoord (verbind gelykwaardige sinne) — "omdat" verbind spesifiek \'n hoofsin met \'n rede-bysin, wat dit onderskikkend maak.',
          } },
      ],
    },
    {
      topicKey: 'VerwysingswoordeKonteks',
      label: 'Verwysingswoorde in Konteks',
      subskills: [
        'Identifisering van waarna \'n voornaamwoord verwys',
      ],
      questions: [
        { subskillLabel: 'Identifisering van waarna \'n voornaamwoord verwys', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: '"Thabo het die boek gevat en dit op die tafel gesit." Waarna verwys "dit" in hierdie sin?',
          options: ['die boek', 'Thabo', 'die tafel', 'Geen spesifieke verwysing nie'], correct_answer: 'die boek' },
        { subskillLabel: 'Identifisering van waarna \'n voornaamwoord verwys', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Lees: "Die onderwysers het die nuwe reëls bekend gemaak. Hulle het gesê dit sal volgende week begin." Waarna verwys "Hulle" en "dit" onderskeidelik? Verduidelik jou antwoord.',
          memo_answer: 'Modelantwoord: "Hulle" verwys na "die onderwysers" (die persone wat die aankondiging gemaak het). "Dit" verwys na "die nuwe reëls" (die item wat gaan begin/in werking tree). \'n Mens bepaal dit deur te kyk na watter selfstandige naamwoord (mens of ding) grammaties en logies by die voornaamwoord pas — "Hulle" moet na mense/wesens verwys, en "dit" verwys hier na die reëls wat genoem is. Volpunte vir albei korrekte verwysings EN \'n verduideliking van die redenasie.' },
      ],
    },
    {
      topicKey: 'OnderhoudDialoogInterpretasie',
      label: 'Interpretasie van Onderhoude en Dialoog',
      subskills: [
        'Identifisering van die doel van \'n onderhoud',
        'Interpretasie van sprekers se houding in dialoog',
      ],
      questions: [
        { subskillLabel: 'Identifisering van die doel van \'n onderhoud', question_type: 'mcq',
          cognitive_level: 'knowledge',
          prompt: 'Wat is die hoofdoel van \'n onderhoud (interview) in \'n koerant of tydskrif?',
          options: ['Om inligting of menings van \'n spesifieke persoon te bekom en aan lesers oor te dra', 'Om \'n fiktiewe storie te vertel', 'Om \'n gedig te skryf', 'Om \'n resep te verduidelik'],
          correct_answer: 'Om inligting of menings van \'n spesifieke persoon te bekom en aan lesers oor te dra' },
        { subskillLabel: 'Interpretasie van sprekers se houding in dialoog', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Lees: \'"Ek veronderstel dit sal moet werk," sê hy, terwyl hy skouers optrek.\' Watter houding openbaar die spreker hier, en watter woorde/optrede dui daarop?',
          memo_answer: 'Modelantwoord: Die spreker openbaar \'n houding van onsekerheid of gebrek aan entoesiasme/vertroue. Aanduidings: "Ek veronderstel" (\'n aarselende, nie-oortuigde manier om iets te sê, eerder as \'n selfversekerde stelling), en die skouers optrek (\'n fisieke gebaar wat dikwels onverskilligheid of onsekerheid aandui). Volpunte vir \'n korrekte identifisering van die onsekere/nie-entoesiastiese houding EN die verwysing na spesifieke woorde/gebare wat dit aandui.' },
      ],
    },
    {
      topicKey: 'GrafiekeSpotprenteGemeng',
      label: 'Gemengde Visuele Teks Oefening',
      subskills: [
        'Vergelyking van visuele en geskrewe tekste',
      ],
      questions: [
        { subskillLabel: 'Vergelyking van visuele en geskrewe tekste', question_type: 'mcq',
          cognitive_level: 'complex',
          prompt: 'Waarom kombineer adverteerders dikwels beelde EN woorde in een advertensie, eerder as net woorde alleen?',
          options: ['Beelde kan \'n onmiddellike emosionele reaksie skep wat woorde alleen nie altyd so vinnig kan doen nie', 'Woorde alleen is altyd te duur om te druk', 'Beelde word wetlik vereis in alle advertensies', 'Beelde vervang die behoefte aan enige teks heeltemal'],
          correct_answer: 'Beelde kan \'n onmiddellike emosionele reaksie skep wat woorde alleen nie altyd so vinnig kan doen nie' },
        { subskillLabel: 'Vergelyking van visuele en geskrewe tekste', question_type: 'open_text',
          cognitive_level: 'problem_solving',
          prompt: 'Verduidelik hoe \'n spotprent en \'n koerantberig oor dieselfde onderwerp (bv. \'n nuwe wet) op verskillende maniere \'n boodskap kan oordra.',
          memo_answer: 'Modelantwoord: \'n Koerantberig gebruik geskrewe woorde om feite, aanhalings, en agtergrond stap-vir-stap te verduidelik, en streef gewoonlik na \'n meer objektiewe, neutrale aanbieding. \'n Spotprent gebruik oordrywing, simboliek, en humor/ironie om vinnig \'n standpunt of kritiek oor te dra, dikwels op \'n meer subjektiewe en emosionele manier as \'n geskrewe berig. Volpunte vir \'n duidelike vergelyking wat beide die vorm (woorde vs. beeld/simboliek) en die toon (objektief vs. subjektief/ironies) van elke teksoort korrek beskryf.' },
      ],
    },
  ],
};

export function getCatalogTopics(subjectCode: string, grade: number, term: number): CatalogTopic[] {
  return TOPIC_CATALOG[`${subjectCode}-${grade}-${term}`] ?? [];
}

// ── Types ─────────────────────────────────────────────────────

export type GradingMode = 'auto' | 'manual';

export interface TopicTest {
  id: number;
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  term: number;
  topic_key: string;
  title: string;
  time_limit_seconds: number;
  grading_mode: GradingMode;
  is_active: boolean;
  created_at: string;
  // joined
  subject_label?: string;
}

export interface TopicTestSubskill {
  id: number;
  topic_test_id: number;
  label: string;
  sort_order: number;
}

export type QuestionType = 'mcq' | 'short_answer' | 'open_text';

export interface TopicTestQuestion {
  id: number;
  topic_test_id: number;
  subskill_id: number;
  question_type: QuestionType;
  prompt: string;
  options: string[] | null;
  correct_answer: string | null; // null for open_text — teacher marks manually
  answer_tolerance: number | null;
  cognitive_level: CognitiveLevel | null;
  distractor_notes: Record<string, string> | null; // mcq only — wrong option text -> misconception
  memo_answer: string | null; // open_text only — model answer shown to teacher when marking
  sort_order: number;
}

export interface TopicTestAssignment {
  id: number;
  topic_test_id: number;
  teacher_id: number;
  school_id: number;
  subject_id: number;
  grade: number;
  opens_at: string;
  closes_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TopicTestAttempt {
  id: number;
  topic_test_id: number;
  assignment_id: number;
  student_id: number;
  school_id: number;
  started_at: string;
  submitted_at: string | null;
  time_expired: boolean;
  score_pct: number | null;
  grading_complete: boolean;
}

export interface TopicTestAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  subskill_id: number;
  student_answer: string | null;
  is_correct: boolean;
  graded_at: string | null;
}

// Full test definition bundle used by builder + student test-taking screen
export interface TopicTestFull {
  test: TopicTest;
  subskills: TopicTestSubskill[];
  questions: TopicTestQuestion[];
}

export interface CreateTopicTestInput {
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  term?: number;
  topic_key: string;
  title: string;
  time_limit_seconds?: number;
  grading_mode?: GradingMode; // defaults to 'auto'
  subskills: string[]; // labels, in order
}

export type TopicTestResult =
  | { success: true; test: TopicTest }
  | { success: false; error: string };

export type SimpleResult =
  | { success: true }
  | { success: false; error: string };

// ── Teacher: fetch all tests (grouped by subject+grade) ────────

export interface TopicTestGroup {
  key: string; // `${subject_id}-${grade}`
  subject_id: number;
  subject_label: string;
  grade: number;
  tests: TopicTest[];
}

export async function fetchTeacherTopicTests(
  teacher_id: number,
  school_id: number
): Promise<TopicTestGroup[]> {
  const { data, error } = await supabaseAdmin
    .from('topic_tests')
    .select('*')
    .eq('teacher_id', teacher_id)
    .eq('school_id', school_id)
    .order('grade')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const subjectIds = [...new Set(data.map((r: any) => r.subject_id as number))];
  const { data: subjectsData } = await supabaseAdmin
    .from('subjects')
    .select('id, label')
    .in('id', subjectIds);
  const subjectMap = new Map((subjectsData ?? []).map((s: any) => [s.id, s.label]));

  const tests: TopicTest[] = data.map((r: any) => ({
    ...r,
    subject_label: subjectMap.get(r.subject_id) ?? 'Unknown',
  }));

  const map = new Map<string, TopicTestGroup>();
  for (const t of tests) {
    const key = `${t.subject_id}-${t.grade}`;
    if (!map.has(key)) {
      map.set(key, { key, subject_id: t.subject_id, subject_label: t.subject_label ?? '', grade: t.grade, tests: [] });
    }
    map.get(key)!.tests.push(t);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.grade !== b.grade ? a.grade - b.grade : a.subject_label.localeCompare(b.subject_label)
  );
}

// ── Fetch one test's full definition (subskills + questions) ──

export async function fetchTopicTestFull(topic_test_id: number): Promise<TopicTestFull | null> {
  const { data: test } = await supabaseAdmin
    .from('topic_tests')
    .select('*')
    .eq('id', topic_test_id)
    .single();

  if (!test) return null;

  const { data: subskills } = await supabaseAdmin
    .from('topic_test_subskills')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .order('sort_order');

  const { data: questions } = await supabaseAdmin
    .from('topic_test_questions')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .order('sort_order');

  return {
    test,
    subskills: subskills ?? [],
    questions: questions ?? [],
  };
}

// ── Create a test + its sub-skill taxonomy ─────────────────────

export async function createTopicTest(input: CreateTopicTestInput): Promise<TopicTestResult> {
  const { school_id, teacher_id, subject_id, grade, term = 1, topic_key, title, time_limit_seconds = 600, grading_mode = 'auto', subskills } = input;

  if (subskills.length === 0) {
    return { success: false, error: 'Add at least one sub-skill before creating the test.' };
  }

  const { data: test, error } = await supabaseAdmin
    .from('topic_tests')
    .insert({
      school_id, teacher_id, subject_id, grade, term,
      topic_key, title: title.trim(), time_limit_seconds, grading_mode,
    })
    .select('*')
    .single();

  if (error || !test) return { success: false, error: error?.message ?? 'Failed to create test.' };

  const { error: subskillError } = await supabaseAdmin
    .from('topic_test_subskills')
    .insert(subskills.map((label, i) => ({ topic_test_id: test.id, label: label.trim(), sort_order: i })));

  if (subskillError) {
    await supabaseAdmin.from('topic_tests').delete().eq('id', test.id);
    return { success: false, error: 'Failed to create sub-skills.' };
  }

  return { success: true, test };
}

// ── Seed a fully predefined test from the catalog ────────────────
// Creates the test, its sub-skills, and every catalog question in one call.
// Predefined/catalog tests are always auto-graded — no manual marking step.

export interface SeedCatalogTestInput {
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  term: number;
  topic: CatalogTopic;
  time_limit_seconds?: number;
}

export async function seedCatalogTest(input: SeedCatalogTestInput): Promise<TopicTestResult> {
  const { school_id, teacher_id, subject_id, grade, term, topic, time_limit_seconds = 600 } = input;

  if (topic.questions.length === 0) {
    return { success: false, error: `${topic.label} doesn't have a predefined question set yet.` };
  }

  const hasOpenText = topic.questions.some((q) => q.question_type === 'open_text');

  const created = await createTopicTest({
    school_id, teacher_id, subject_id, grade, term,
    topic_key: topic.topicKey,
    title: topic.label,
    time_limit_seconds,
    grading_mode: hasOpenText ? 'manual' : 'auto',
    subskills: topic.subskills,
  });

  if (!created.success) return created;

  const { data: subskillRows } = await supabaseAdmin
    .from('topic_test_subskills')
    .select('id, label')
    .eq('topic_test_id', created.test.id);

  const subskillIdByLabel = new Map((subskillRows ?? []).map((s: any) => [s.label, s.id as number]));

  for (const q of topic.questions) {
    const subskill_id = subskillIdByLabel.get(q.subskillLabel);
    if (!subskill_id) continue;
    await addTopicTestQuestion({
      topic_test_id: created.test.id,
      subskill_id,
      question_type: q.question_type,
      prompt: q.prompt,
      options: q.options,
      correct_answer: q.correct_answer,
      answer_tolerance: q.answer_tolerance,
      cognitive_level: q.cognitive_level,
      distractor_notes: q.distractor_notes,
      memo_answer: q.memo_answer,
    });
  }

  return created;
}

export async function deleteTopicTest(topic_test_id: number, school_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('topic_tests')
    .delete()
    .eq('id', topic_test_id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to delete test.' };
  return { success: true };
}

// ── Questions ───────────────────────────────────────────────────

export interface AddQuestionInput {
  topic_test_id: number;
  subskill_id: number;
  question_type: QuestionType;
  prompt: string;
  options?: string[];
  correct_answer?: string; // required for mcq/short_answer, omitted for open_text
  answer_tolerance?: number;
  cognitive_level?: CognitiveLevel;
  distractor_notes?: Record<string, string>; // mcq only
  memo_answer?: string; // open_text only
}

export async function addTopicTestQuestion(input: AddQuestionInput): Promise<SimpleResult> {
  const { data: existing } = await supabaseAdmin
    .from('topic_test_questions')
    .select('id')
    .eq('topic_test_id', input.topic_test_id);

  const sort_order = existing?.length ?? 0;

  const { error } = await supabaseAdmin
    .from('topic_test_questions')
    .insert({
      topic_test_id: input.topic_test_id,
      subskill_id: input.subskill_id,
      question_type: input.question_type,
      prompt: input.prompt.trim(),
      options: input.question_type === 'mcq' ? (input.options ?? []) : null,
      correct_answer: input.question_type === 'open_text' ? null : (input.correct_answer ?? '').trim(),
      answer_tolerance: input.question_type === 'short_answer' ? (input.answer_tolerance ?? null) : null,
      cognitive_level: input.cognitive_level ?? null,
      distractor_notes: input.question_type === 'mcq' ? (input.distractor_notes ?? null) : null,
      memo_answer: input.question_type === 'open_text' ? (input.memo_answer?.trim() || null) : null,
      sort_order,
    });

  if (error) return { success: false, error: 'Failed to add question.' };
  return { success: true };
}

export async function deleteTopicTestQuestion(question_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin.from('topic_test_questions').delete().eq('id', question_id);
  if (error) return { success: false, error: 'Failed to delete question.' };
  return { success: true };
}

// ── Assign a test to a class/subject/grade ─────────────────────

export interface AssignTopicTestInput {
  topic_test_id: number;
  teacher_id: number;
  school_id: number;
  subject_id: number;
  grade: number;
  closes_at?: string; // ISO timestamp, optional
}

export async function assignTopicTest(input: AssignTopicTestInput): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('topic_test_assignments')
    .insert({
      topic_test_id: input.topic_test_id,
      teacher_id: input.teacher_id,
      school_id: input.school_id,
      subject_id: input.subject_id,
      grade: input.grade,
      closes_at: input.closes_at ?? null,
    });

  if (error) return { success: false, error: 'Failed to assign test.' };
  return { success: true };
}

export async function fetchTestAssignments(topic_test_id: number): Promise<TopicTestAssignment[]> {
  const { data } = await supabaseAdmin
    .from('topic_test_assignments')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function deactivateAssignment(assignment_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('topic_test_assignments')
    .update({ is_active: false })
    .eq('id', assignment_id);
  if (error) return { success: false, error: 'Failed to update assignment.' };
  return { success: true };
}

// ── Student: fetch tests currently visible to them ──────────────
// A test is visible only if there's an active assignment matching the
// student's subject+grade, and now() is within opens_at/closes_at.

export interface StudentVisibleTest {
  assignment: TopicTestAssignment;
  test: TopicTest;
  attempted: boolean;
  attempt?: TopicTestAttempt;
}

// Convenience wrapper: derives the student's enrolled subject_ids from
// teacher_students, then fetches visible tests. Used by the student portal.
export async function fetchVisibleTestsForStudent(
  student_id: number,
  school_id: number,
  grade: number
): Promise<StudentVisibleTest[]> {
  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('subject_id')
    .eq('student_id', student_id);

  const subject_ids = [...new Set((links ?? []).map((l: any) => l.subject_id as number))];
  return fetchStudentVisibleTests(student_id, school_id, grade, subject_ids);
}

export async function fetchStudentVisibleTests(
  student_id: number,
  school_id: number,
  grade: number,
  subject_ids: number[]
): Promise<StudentVisibleTest[]> {
  if (subject_ids.length === 0) return [];

  const nowIso = new Date().toISOString();

  const { data: assignments } = await supabaseAdmin
    .from('topic_test_assignments')
    .select('*')
    .eq('school_id', school_id)
    .eq('grade', grade)
    .in('subject_id', subject_ids)
    .eq('is_active', true)
    .lte('opens_at', nowIso);

  if (!assignments || assignments.length === 0) return [];

  const openAssignments = assignments.filter((a: any) => !a.closes_at || a.closes_at > nowIso);
  if (openAssignments.length === 0) return [];

  const testIds = [...new Set(openAssignments.map((a: any) => a.topic_test_id as number))];
  const { data: tests } = await supabaseAdmin
    .from('topic_tests')
    .select('*')
    .in('id', testIds)
    .eq('is_active', true);
  const testMap = new Map((tests ?? []).map((t: any) => [t.id, t]));

  const assignmentIds = openAssignments.map((a: any) => a.id as number);
  const { data: attempts } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('*')
    .eq('student_id', student_id)
    .in('assignment_id', assignmentIds);
  const attemptMap = new Map((attempts ?? []).map((a: any) => [a.assignment_id, a]));

  return openAssignments
    .filter((a: any) => testMap.has(a.topic_test_id))
    .map((a: any) => ({
      assignment: a,
      test: testMap.get(a.topic_test_id),
      attempted: attemptMap.has(a.id),
      attempt: attemptMap.get(a.id),
    }));
}

// ── Student: start an attempt ────────────────────────────────────

export type StartAttemptResult =
  | { success: true; attempt: TopicTestAttempt }
  | { success: false; error: string };

export async function startTopicTestAttempt(
  topic_test_id: number,
  assignment_id: number,
  student_id: number,
  school_id: number
): Promise<StartAttemptResult> {
  // One attempt per (assignment, student) — unique constraint backstops this.
  const { data: existing } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('*')
    .eq('assignment_id', assignment_id)
    .eq('student_id', student_id)
    .maybeSingle();

  if (existing) return { success: true, attempt: existing };

  const { data: attempt, error } = await supabaseAdmin
    .from('topic_test_attempts')
    .insert({ topic_test_id, assignment_id, student_id, school_id })
    .select('*')
    .single();

  if (error || !attempt) return { success: false, error: error?.message ?? 'Failed to start test.' };
  return { success: true, attempt };
}

// ── Student: submit answers ───────────────────────────────────────
// Grades MCQ by exact match, short_answer by exact or numeric-tolerance match.
// Writes one topic_test_answers row per question and updates the attempt's score.

export interface SubmittedAnswer {
  question_id: number;
  subskill_id: number;
  student_answer: string;
}

// Returns null for open_text questions — those are never auto-graded,
// a teacher must mark them manually after submission.
export function gradeAnswer(question: TopicTestQuestion, studentAnswer: string): boolean | null {
  if (question.question_type === 'open_text') return null;

  const answer = studentAnswer.trim();
  if (answer === '') return false;

  if (question.question_type === 'mcq') {
    return answer === question.correct_answer;
  }

  // short_answer
  const correctAnswer = question.correct_answer ?? '';
  if (question.answer_tolerance != null) {
    const given = Number(answer);
    const correct = Number(correctAnswer);
    if (Number.isNaN(given) || Number.isNaN(correct)) return answer === correctAnswer;
    return Math.abs(given - correct) <= question.answer_tolerance;
  }
  return answer.toLowerCase() === correctAnswer.trim().toLowerCase();
}

export async function submitTopicTestAttempt(
  attempt_id: number,
  questions: TopicTestQuestion[],
  answers: SubmittedAnswer[],
  time_expired: boolean
): Promise<SimpleResult> {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const nowIso = new Date().toISOString();

  const rows = answers.map((a) => {
    const q = questionMap.get(a.question_id);
    const graded = q ? gradeAnswer(q, a.student_answer) : false;
    return {
      attempt_id,
      question_id: a.question_id,
      subskill_id: a.subskill_id,
      student_answer: a.student_answer,
      is_correct: graded ?? false, // placeholder until manually marked
      graded_at: graded === null ? null : nowIso, // null = open_text, awaiting manual marking
    };
  });

  if (rows.length > 0) {
    const { error: answersError } = await supabaseAdmin.from('topic_test_answers').insert(rows);
    if (answersError) return { success: false, error: 'Failed to save answers.' };
  }

  const hasUngraded = rows.some((r) => r.graded_at === null);
  const gradedRows = rows.filter((r) => r.graded_at !== null);
  const correctCount = gradedRows.filter((r) => r.is_correct).length;
  // Score is provisional (auto-graded questions only) until manual marking completes.
  const score_pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const { error } = await supabaseAdmin
    .from('topic_test_attempts')
    .update({
      submitted_at: nowIso,
      time_expired,
      score_pct,
      grading_complete: !hasUngraded,
    })
    .eq('id', attempt_id);

  if (error) return { success: false, error: 'Failed to submit test.' };
  return { success: true };
}

// ── Teacher: mark open_text answers, finalize score ──────────────

export async function markAnswer(answer_id: number, is_correct: boolean): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('topic_test_answers')
    .update({ is_correct, graded_at: new Date().toISOString() })
    .eq('id', answer_id);

  if (error) return { success: false, error: 'Failed to save mark.' };
  return { success: true };
}

// Recomputes an attempt's score from all its answers and marks grading complete
// once every answer has a graded_at timestamp. Call after marking each answer.
export async function finalizeAttemptGrading(attempt_id: number): Promise<SimpleResult> {
  const { data: answers } = await supabaseAdmin
    .from('topic_test_answers')
    .select('is_correct, graded_at')
    .eq('attempt_id', attempt_id);

  if (!answers) return { success: false, error: 'Attempt not found.' };

  const allGraded = answers.every((a: any) => a.graded_at !== null);
  const correctCount = answers.filter((a: any) => a.is_correct).length;
  const score_pct = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

  const { error } = await supabaseAdmin
    .from('topic_test_attempts')
    .update({ score_pct, grading_complete: allGraded })
    .eq('id', attempt_id);

  if (error) return { success: false, error: 'Failed to update score.' };
  return { success: true };
}

// Fetches attempts still awaiting manual marking for a given test
// (grading_complete = false), with the student name and open_text answers joined.

export interface PendingMarkingAttempt {
  attempt: TopicTestAttempt;
  student_name: string;
  student_surname: string;
  answers: (TopicTestAnswer & { question: TopicTestQuestion; subskill_label: string })[];
}

export async function fetchPendingMarking(topic_test_id: number): Promise<PendingMarkingAttempt[]> {
  const { data: attempts } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .eq('grading_complete', false)
    .not('submitted_at', 'is', null);

  if (!attempts || attempts.length === 0) return [];

  const attemptIds = attempts.map((a: any) => a.id as number);
  const studentIds = [...new Set(attempts.map((a: any) => a.student_id as number))];

  const [{ data: students }, { data: answers }, { data: questions }, { data: subskills }] = await Promise.all([
    supabaseAdmin.from('students').select('id, name, surname').in('id', studentIds),
    supabaseAdmin.from('topic_test_answers').select('*').in('attempt_id', attemptIds),
    supabaseAdmin.from('topic_test_questions').select('*').eq('topic_test_id', topic_test_id),
    supabaseAdmin.from('topic_test_subskills').select('*').eq('topic_test_id', topic_test_id),
  ]);

  const studentMap = new Map((students ?? []).map((s: any) => [s.id, s]));
  const questionMap = new Map((questions ?? []).map((q: any) => [q.id, q]));
  const subskillMap = new Map((subskills ?? []).map((s: any) => [s.id, s.label]));
  const answersByAttempt = new Map<number, any[]>();
  for (const a of (answers ?? []) as any[]) {
    const list = answersByAttempt.get(a.attempt_id) ?? [];
    list.push(a);
    answersByAttempt.set(a.attempt_id, list);
  }

  return attempts
    .map((a: any) => {
      const student = studentMap.get(a.student_id);
      const myAnswers = (answersByAttempt.get(a.id) ?? [])
        .filter((ans) => questionMap.get(ans.question_id)?.question_type === 'open_text')
        .map((ans) => ({
          ...ans,
          question: questionMap.get(ans.question_id),
          subskill_label: subskillMap.get(ans.subskill_id) ?? 'Unknown',
        }));
      return {
        attempt: a,
        student_name: student?.name ?? 'Unknown',
        student_surname: student?.surname ?? '',
        answers: myAnswers,
      };
    })
    .filter((row) => row.answers.length > 0);
}

// ── Teacher: topic overview — sub-skill breakdown across a test ──

export interface SubskillBreakdown {
  subskill_id: number;
  label: string;
  correctCount: number;
  totalCount: number;
  correctPct: number;
}

export interface StudentResultRow {
  attempt_id: number;
  student_id: number;
  student_name: string;
  student_surname: string;
  score_pct: number | null;
  weakestSubskills: string[]; // labels of sub-skills this student got wrong
}

export interface MisconceptionPattern {
  question_id: number;
  prompt: string;
  subskill_label: string;
  option: string;         // the wrong option students chose
  misconception: string;  // from distractor_notes
  count: number;          // how many students chose it
}

export interface TopicOverviewData {
  attemptedCount: number;
  totalAssigned: number;
  avgScore: number | null;
  subskills: SubskillBreakdown[];
  students: StudentResultRow[];
  misconceptions: MisconceptionPattern[]; // sorted by count desc, only options with notes + ≥1 pick
}

export async function fetchTopicOverview(topic_test_id: number): Promise<TopicOverviewData> {
  const { data: subskills } = await supabaseAdmin
    .from('topic_test_subskills')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .order('sort_order');

  const { data: attempts } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .not('submitted_at', 'is', null);

  const attemptList = attempts ?? [];
  const attemptIds = attemptList.map((a: any) => a.id as number);

  const { data: answers } = attemptIds.length > 0
    ? await supabaseAdmin.from('topic_test_answers').select('*').in('attempt_id', attemptIds)
    : { data: [] as any[] };

  const answerList = answers ?? [];

  // Sub-skill aggregation
  const subskillStats = new Map<number, { correct: number; total: number }>();
  for (const a of answerList as any[]) {
    const s = subskillStats.get(a.subskill_id) ?? { correct: 0, total: 0 };
    s.total += 1;
    if (a.is_correct) s.correct += 1;
    subskillStats.set(a.subskill_id, s);
  }

  const subskillBreakdown: SubskillBreakdown[] = (subskills ?? []).map((sk: any) => {
    const stat = subskillStats.get(sk.id) ?? { correct: 0, total: 0 };
    return {
      subskill_id: sk.id,
      label: sk.label,
      correctCount: stat.correct,
      totalCount: stat.total,
      correctPct: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
    };
  });

  // Per-student rows
  const studentIds = [...new Set(attemptList.map((a: any) => a.student_id as number))];
  const { data: studentsData } = studentIds.length > 0
    ? await supabaseAdmin.from('students').select('id, name, surname').in('id', studentIds)
    : { data: [] as any[] };
  const studentMap = new Map((studentsData ?? []).map((s: any) => [s.id, s]));

  const subskillLabelMap = new Map((subskills ?? []).map((s: any) => [s.id, s.label]));
  const answersByAttempt = new Map<number, any[]>();
  for (const a of answerList as any[]) {
    const list = answersByAttempt.get(a.attempt_id) ?? [];
    list.push(a);
    answersByAttempt.set(a.attempt_id, list);
  }

  const students: StudentResultRow[] = attemptList.map((a: any) => {
    const student = studentMap.get(a.student_id);
    const myAnswers = answersByAttempt.get(a.id) ?? [];
    const weakestSubskills = [...new Set(
      myAnswers.filter((ans) => !ans.is_correct).map((ans) => subskillLabelMap.get(ans.subskill_id) ?? 'Unknown')
    )];
    return {
      attempt_id: a.id,
      student_id: a.student_id,
      student_name: student?.name ?? 'Unknown',
      student_surname: student?.surname ?? '',
      score_pct: a.score_pct,
      weakestSubskills,
    };
  });

  const scores = attemptList.map((a: any) => a.score_pct).filter((s: any) => s != null) as number[];
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : null;

  // Total assigned = distinct students in teacher_students matching the test's subject/grade
  const { data: test } = await supabaseAdmin.from('topic_tests').select('*').eq('id', topic_test_id).single();
  let totalAssigned = 0;
  if (test) {
    const { data: links } = await supabaseAdmin
      .from('teacher_students')
      .select('student_id, students(grade)')
      .eq('teacher_id', test.teacher_id)
      .eq('subject_id', test.subject_id);
    const matching = (links ?? []).filter((l: any) => l.students?.grade === test.grade);
    totalAssigned = new Set(matching.map((l: any) => l.student_id)).size;
  }

  // Misconception patterns — for wrong MCQ answers, look up the distractor_notes
  // on the question to see which specific misconception that wrong option encodes,
  // and tally how many students picked it.
  const { data: questionRows } = await supabaseAdmin
    .from('topic_test_questions')
    .select('id, prompt, question_type, distractor_notes, subskill_id')
    .eq('topic_test_id', topic_test_id);
  const questionMap = new Map((questionRows ?? []).map((q: any) => [q.id, q]));

  const misconceptionCounts = new Map<string, MisconceptionPattern>();
  for (const a of answerList as any[]) {
    if (a.is_correct) continue;
    const q = questionMap.get(a.question_id);
    if (!q || q.question_type !== 'mcq' || !q.distractor_notes) continue;
    const misconception = q.distractor_notes[a.student_answer];
    if (!misconception) continue;
    const key = `${q.id}::${a.student_answer}`;
    const existing = misconceptionCounts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      misconceptionCounts.set(key, {
        question_id: q.id,
        prompt: q.prompt,
        subskill_label: subskillLabelMap.get(q.subskill_id) ?? 'Unknown',
        option: a.student_answer,
        misconception,
        count: 1,
      });
    }
  }
  const misconceptions = [...misconceptionCounts.values()].sort((a, b) => b.count - a.count);

  return {
    attemptedCount: attemptList.length,
    totalAssigned,
    avgScore,
    subskills: subskillBreakdown,
    students,
    misconceptions,
  };
}

// ── Teacher: per-student struggle view — cross-test sub-skill diagnosis ──
// Answers the question "where is this specific student getting stuck," not
// just "how did this one test go." Scoped to only the subjects this teacher
// actually teaches this student (via teacher_students), so a maths teacher
// never sees a student's English struggles and vice versa.

export interface StudentSubskillStruggle {
  subject_id: number;
  subject_label: string;
  topic_test_id: number;
  topic_key: string;
  topic_label: string;
  subskill_id: number;
  subskill_label: string;
  lastCorrect: boolean;
  lastAttemptDate: string;
  totalAttempts: number;
  totalCorrect: number;
}

// ── Teacher: full per-student attempt detail — every question, their answer,
// correctness, and (for open_text) the memo answer + grading state. Lets a
// teacher actually review a student's whole submitted test, not just the
// open_text questions awaiting marking. ──

export interface AttemptDetailQuestion {
  question_id: number;
  subskill_label: string;
  prompt: string;
  question_type: QuestionType;
  options: string[] | null;
  correct_answer: string | null; // null for open_text
  memo_answer: string | null;
  student_answer: string | null;
  is_correct: boolean;
  graded_at: string | null; // null = still awaiting teacher marking (open_text only)
  sort_order: number;
}

export interface AttemptDetail {
  attempt: TopicTestAttempt;
  student_name: string;
  student_surname: string;
  test_title: string;
  questions: AttemptDetailQuestion[];
}

export async function fetchAttemptDetail(attempt_id: number): Promise<AttemptDetail | null> {
  const { data: attempt } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('*')
    .eq('id', attempt_id)
    .single();

  if (!attempt) return null;

  const [{ data: student }, { data: test }, { data: questions }, { data: subskills }, { data: answers }] = await Promise.all([
    supabaseAdmin.from('students').select('name, surname').eq('id', attempt.student_id).single(),
    supabaseAdmin.from('topic_tests').select('title').eq('id', attempt.topic_test_id).single(),
    supabaseAdmin.from('topic_test_questions').select('*').eq('topic_test_id', attempt.topic_test_id).order('sort_order'),
    supabaseAdmin.from('topic_test_subskills').select('id, label').eq('topic_test_id', attempt.topic_test_id),
    supabaseAdmin.from('topic_test_answers').select('*').eq('attempt_id', attempt_id),
  ]);

  const subskillLabelMap = new Map((subskills ?? []).map((s: any) => [s.id, s.label as string]));
  const answerByQuestion = new Map((answers ?? []).map((a: any) => [a.question_id, a]));

  const detailQuestions: AttemptDetailQuestion[] = (questions ?? []).map((q: any) => {
    const ans = answerByQuestion.get(q.id);
    return {
      question_id: q.id,
      subskill_label: subskillLabelMap.get(q.subskill_id) ?? 'Unknown',
      prompt: q.prompt,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      memo_answer: q.memo_answer ?? null,
      student_answer: ans?.student_answer ?? null,
      is_correct: ans?.is_correct ?? false,
      graded_at: ans?.graded_at ?? null,
      sort_order: q.sort_order,
    };
  });

  return {
    attempt,
    student_name: student?.name ?? 'Unknown',
    student_surname: student?.surname ?? '',
    test_title: test?.title ?? '',
    questions: detailQuestions,
  };
}

export async function fetchStudentStruggles(
  student_id: number,
  teacher_id: number
): Promise<StudentSubskillStruggle[]> {
  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('subject_id')
    .eq('teacher_id', teacher_id)
    .eq('student_id', student_id);

  const subjectIds = [...new Set((links ?? []).map((l: any) => l.subject_id as number))];
  if (subjectIds.length === 0) return [];

  const { data: subjectsData } = await supabaseAdmin
    .from('subjects')
    .select('id, label')
    .in('id', subjectIds);
  const subjectLabelMap = new Map((subjectsData ?? []).map((s: any) => [s.id, s.label as string]));

  const { data: tests } = await supabaseAdmin
    .from('topic_tests')
    .select('id, subject_id, topic_key, title')
    .in('subject_id', subjectIds);
  const testList = tests ?? [];
  if (testList.length === 0) return [];
  const testMap = new Map(testList.map((t: any) => [t.id, t]));
  const testIds = testList.map((t: any) => t.id as number);

  const { data: attempts } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('id, topic_test_id, submitted_at')
    .eq('student_id', student_id)
    .in('topic_test_id', testIds)
    .not('submitted_at', 'is', null)
    .order('submitted_at', { ascending: true });

  const attemptList = attempts ?? [];
  if (attemptList.length === 0) return [];
  const attemptIds = attemptList.map((a: any) => a.id as number);
  const attemptMap = new Map(attemptList.map((a: any) => [a.id, a]));

  const { data: answers } = await supabaseAdmin
    .from('topic_test_answers')
    .select('attempt_id, subskill_id, is_correct, graded_at')
    .in('attempt_id', attemptIds)
    .not('graded_at', 'is', null); // only fully-graded answers count toward struggle diagnosis

  const answerList = answers ?? [];

  const subskillIds = [...new Set(answerList.map((a: any) => a.subskill_id as number))];
  const { data: subskillRows } = subskillIds.length > 0
    ? await supabaseAdmin.from('topic_test_subskills').select('id, label, topic_test_id').in('id', subskillIds)
    : { data: [] as any[] };
  const subskillMap = new Map((subskillRows ?? []).map((s: any) => [s.id, s]));

  // Chronological order matters: answers ordered by their attempt's submitted_at,
  // so "last" per sub-skill really means most recent attempt, not insertion order.
  const sorted = [...answerList].sort((a: any, b: any) => {
    const aDate = attemptMap.get(a.attempt_id)?.submitted_at ?? '';
    const bDate = attemptMap.get(b.attempt_id)?.submitted_at ?? '';
    return aDate.localeCompare(bDate);
  });

  const stats = new Map<number, { correct: number; total: number; lastCorrect: boolean; lastDate: string }>();
  for (const a of sorted as any[]) {
    const s = stats.get(a.subskill_id) ?? { correct: 0, total: 0, lastCorrect: false, lastDate: '' };
    s.total += 1;
    if (a.is_correct) s.correct += 1;
    const attemptDate = attemptMap.get(a.attempt_id)?.submitted_at ?? '';
    s.lastCorrect = a.is_correct;
    s.lastDate = attemptDate;
    stats.set(a.subskill_id, s);
  }

  const rows: StudentSubskillStruggle[] = [];
  for (const [subskill_id, stat] of stats.entries()) {
    const subskill = subskillMap.get(subskill_id);
    if (!subskill) continue;
    const test = testMap.get(subskill.topic_test_id);
    if (!test) continue;
    rows.push({
      subject_id: test.subject_id,
      subject_label: subjectLabelMap.get(test.subject_id) ?? 'Unknown',
      topic_test_id: test.id,
      topic_key: test.topic_key,
      topic_label: test.title,
      subskill_id,
      subskill_label: subskill.label,
      lastCorrect: stat.lastCorrect,
      lastAttemptDate: stat.lastDate,
      totalAttempts: stat.total,
      totalCorrect: stat.correct,
    });
  }

  // Flagged (last attempt wrong) first, then lowest overall correctness, then most recent.
  return rows.sort((a, b) => {
    if (a.lastCorrect !== b.lastCorrect) return a.lastCorrect ? 1 : -1;
    const aPct = a.totalCorrect / a.totalAttempts;
    const bPct = b.totalCorrect / b.totalAttempts;
    if (aPct !== bPct) return aPct - bPct;
    return b.lastAttemptDate.localeCompare(a.lastAttemptDate);
  });
}
