// ── Term 2, Topic 8: Interpreting and Comparing Graphs ────────────────────────
// Capstone topic for Term 2 — no new function types, just reading/comparing
// skills across everything built in Topics 3-7. Per
// .planning/research/LIBRARY_ALGEBRA_TERM2_RESEARCH.md Part B, this
// specifically targets "reading a graph as a literal picture" and
// scale/interval misconceptions.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'graph-as-literal-picture',
    label: 'Reading a graph as a literal picture of the scenario, not a variable-vs-variable plot',
    errorType: 'You interpreted the graph\'s shape as literally depicting the physical situation (like a hill or path) rather than a relationship between two variables.',
    principle: 'A graph shows how one variable changes relative to another (e.g. distance vs. time) — the graph\'s shape describes that RELATIONSHIP, not a literal picture of a physical path, hill, or object.',
    correctStep: 'A distance-time graph that rises then flattens shows "moving, then stopped" — it does NOT mean the person walked uphill and then stood on flat ground.',
  },
  {
    id: 'ignores-axis-scale',
    label: 'Ignoring the scale between tick marks on an axis',
    errorType: 'You read values off a graph assuming each gridline represents 1 unit, without checking the actual scale.',
    principle: 'Always check what each gridline/tick actually represents before reading values off a graph — axes are not always marked in increments of 1.',
    correctStep: 'If the y-axis ticks are labelled 0, 20, 40, 60..., each gridline represents 20 units, not 1.',
  },
  {
    id: 'increasing-decreasing-single-point',
    label: 'Describing "increasing" or "decreasing" using a single point instead of an interval',
    errorType: 'You described a function\'s behaviour at one isolated point rather than over a stretch (interval) of the domain.',
    principle: '"Increasing" and "decreasing" describe behaviour over an INTERVAL (a range of x-values), not at a single instant — always state the interval, e.g. "increasing for 0 < x < 3", not just "increasing at x=2".',
    correctStep: 'A parabola opening upward is decreasing for x < (turning point x-value) and increasing for x > (turning point x-value) — describe both intervals, not just one point.',
  },
  {
    id: 'intersection-point-misread',
    label: 'Misreading the coordinates of an intersection point between two graphs',
    errorType: 'You read the x-value from one graph\'s scale and the y-value from a different position, or transposed the coordinates.',
    principle: 'At an intersection point, both graphs share the EXACT SAME (x,y) pair — read the x-coordinate and y-coordinate together, from that single shared point, not from two different points on each curve.',
    correctStep: 'If two graphs cross at the point where x=3 and y=7, the intersection is (3,7) for BOTH graphs at once — the coordinates are shared, not separate.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 2,
  topicId: 'interpreting-graphs',
  topicName: 'Interpreting and Comparing Graphs',
  prerequisites: [
    'Sketching linear, quadratic, hyperbolic, and exponential graphs (this term, Topics 3-6)',
    'Trigonometric graphs (this term, Topic 7)',
  ],
  objectives: [
    { id: 'read-values-from-graph', text: 'Read specific values (intercepts, coordinates) accurately from a graph, respecting its scale.' },
    { id: 'describe-intervals', text: 'Describe where a function is increasing, decreasing, positive, or negative, using correct interval language.' },
    { id: 'find-intersections', text: 'Find and interpret the intersection point(s) of two graphs shown together.' },
    { id: 'interpret-real-context', text: 'Interpret a graph correctly as a relationship between two variables in a real-world context, not a literal picture.' },
  ],
  estimatedMinutes: [20, 30],
};

export const interpretingGraphs: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What can a graph tell you that an equation alone can\'t?',
  goalSettingPrompt:
    'You\'ve learned to sketch five different types of graphs this term. Now we flip the skill around: given a graph (with or without its equation), how do you correctly read and compare what it\'s telling you? By the end of this lesson you\'ll be able to interpret graphs precisely, without the common reading mistakes.',

  activate: {
    connectPrompt: 'You already know how to sketch linear, quadratic, hyperbolic, exponential, and trig graphs. Now let\'s focus purely on reading them correctly.',
    diagnosticQuestions: [
      { question: 'On a graph, where does a function cross the y-axis?', options: ['At x=0', 'At y=0', 'At the origin only', 'It never crosses'], correctIndex: 0, explanation: 'The y-intercept occurs where x=0.' },
      { question: 'For y = x² - 4x + 3, is the parabola opening upward or downward?', options: ['Upward', 'Downward', 'Neither', 'Cannot tell'], correctIndex: 0, explanation: 'a=1 is positive, so it opens upward.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'When reading values off a graph, always check the SCALE on each axis first — gridlines aren\'t always spaced in increments of 1. A graph describes a RELATIONSHIP between two variables (like distance vs. time), not a literal picture of the situation — a rising-then-flat distance-time graph means "moving, then stopped," not "walked up a hill." When describing where a function increases or decreases, always give an INTERVAL (a range of x-values), not a single point — behaviour is described over a stretch of the domain.',
    workedExamples: [
      { id: 'wx-scale-reading', prompt: 'A graph\'s y-axis is marked 0, 50, 100, 150. What does one small gridline (halfway between 0 and 50) represent?', steps: [
        { step: 'The labelled gridlines are 50 units apart.', justification: 'Check the actual spacing shown on the axis, not assume increments of 1.' },
        { step: 'A gridline halfway between 0 and 50 represents 25.', justification: 'Divide the labelled interval evenly.' },
      ], answer: '25' },
      { id: 'wx-interval-language', prompt: 'For a parabola y = x² - 4x + 3 (turning point at x=2), describe where it is increasing.', steps: [
        { step: 'The parabola opens upward, so it decreases up to the turning point, then increases after it.', justification: 'Use the turning point to split the domain into two intervals.' },
        { step: 'It is increasing for x > 2 — describe this as an interval, not a single value.', justification: 'Increasing/decreasing behaviour is always described over a range.' },
      ], answer: 'Increasing for x > 2' },
    ],
    knowledgeChecks: [
      { question: 'A graph\'s x-axis is marked 0, 10, 20, 30. What does a gridline halfway between 10 and 20 represent?', options: ['15', '5', '1', '10.5'], correctIndex: 0, explanation: 'Halfway between 10 and 20 is 15.', misconceptionId: 'ignores-axis-scale' },
      { question: 'How should you describe a function that is decreasing between x=1 and x=5?', options: ['"Decreasing for 1 < x < 5"', '"Decreasing at x=3"', '"Decreasing at x=1"', '"Decreasing everywhere"'], correctIndex: 0, explanation: 'Increasing/decreasing behaviour must be described over an interval, not a single point.', misconceptionId: 'increasing-decreasing-single-point' },
    ],
    confidenceCheckPrompt: 'How confident do you feel reading graph scales accurately and describing behaviour using intervals?',
  },

  demonstrateChunk2: {
    explanation:
      'When two graphs are drawn together, their INTERSECTION POINT is the (x,y) pair where BOTH are true at once — both graphs share that exact coordinate. When interpreting a real-world graph (like distance vs. time, or cost vs. quantity), always describe what the SHAPE means for the relationship between the two variables, not as a literal image of the scenario. A flat section means "no change in the vertical variable while the horizontal variable increases" — for a distance-time graph, that specifically means "stopped," not "on flat ground."',
    workedExamples: [
      { id: 'wx-intersection', prompt: 'Two lines are graphed together: y = x + 2 and y = -x + 8. Where do they intersect?', steps: [
        { step: 'At the intersection, both equations are true for the same (x,y): x+2 = -x+8.', justification: 'Set the two expressions equal, since y is the same at that point.' },
        { step: 'Solve: 2x = 6, so x=3. Substitute back: y = 3+2 = 5.', justification: 'Solve for x, then find the shared y-value.' },
      ], answer: 'Intersection at (3, 5)', graph: {
        fn: (x: number) => x + 2, domain: [0, 8], yDomain: [0, 10],
        features: [{ x: 3, y: 5, label: '(3,5)' }],
      } },
      { id: 'wx-context-interpretation', prompt: 'A distance-time graph rises steadily, then becomes flat for a while, then rises again. What does this describe?', steps: [
        { step: 'Rising means distance is increasing — the person/object is moving.', justification: 'Relate the graph\'s slope to what it measures.' },
        { step: 'Flat means distance stays the same while time passes — the person/object has stopped.', justification: 'A horizontal section means no change in the vertical variable.' },
        { step: 'Rising again means movement resumes.', justification: 'The pattern repeats the same interpretation.' },
      ], answer: 'Moving, then stopped for a while, then moving again — NOT a literal hill shape.' },
    ],
    knowledgeChecks: [
      { question: 'Two graphs intersect where x=4 and y=9. How should you state the intersection point?', options: ['(4, 9)', '(9, 4)', 'x=4 only', 'y=9 only'], correctIndex: 0, explanation: 'The intersection is the shared coordinate pair, written as (x,y) = (4,9).', misconceptionId: 'intersection-point-misread' },
      { question: 'A distance-time graph is completely flat for several minutes. What does this mean?', options: ['The object is stationary (not moving) during that time', 'The object is on a flat road', 'The object is moving very fast', 'The graph is broken'], correctIndex: 0, explanation: 'A flat distance-time graph means distance isn\'t changing — the object has stopped.', misconceptionId: 'graph-as-literal-picture' },
    ],
    confidenceCheckPrompt: 'How confident do you feel finding intersection points and interpreting real-world graphs correctly?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'find-intersections', revealSteps: 2, prompt: 'Find where y = 2x and y = x + 5 intersect.', steps: [
        { step: '2x = x + 5.', justification: 'Set the two expressions equal.' },
        { step: 'x = 5, so y = 2(5) = 10.', justification: 'Solve for x, then find y.' },
      ], answer: '(5, 10)' },
      { id: 'fp-partial-1', objectiveId: 'describe-intervals', revealSteps: 1, prompt: 'For a parabola with turning point at x=-1 (opening upward), describe where it is decreasing.', steps: [
        { step: 'It decreases before the turning point.', justification: 'Upward parabolas decrease up to, then increase after, the turning point.' },
        { step: 'Decreasing for x < -1.', justification: 'State as an interval.' },
      ], answer: 'Decreasing for x < -1' },
      { id: 'fp-independent-1', objectiveId: 'interpret-real-context', revealSteps: 0, prompt: 'A cost-vs-quantity graph is a straight line with a positive gradient and a positive y-intercept. What does this describe about the cost structure?', steps: [
        { step: 'Positive y-intercept means there\'s a base/fixed cost even at zero quantity.', justification: 'Relate the intercept to the context.' },
        { step: 'Positive gradient means cost increases steadily as quantity increases — a constant cost per unit.', justification: 'Relate the gradient to the context.' },
      ], answer: 'A fixed base cost plus a constant cost per unit.' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'read-values-from-graph', question: 'A graph\'s y-axis is marked 0, 100, 200, 300. What does a gridline a quarter of the way from 0 to 100 represent?', options: ['25', '10', '50', '75'], correctIndex: 0, hints: { strategic: 'The labelled interval is 100 units.', procedural: 'A quarter of 100 is 25.', workedStep: '25.' }, distractorMisconceptions: { 1: 'ignores-axis-scale' } },
      { id: 'ip-2', objectiveId: 'describe-intervals', question: 'A hyperbola y=k/x (k>0) is always decreasing on each branch. How should you describe this?', options: ['"Decreasing for x < 0 and decreasing for x > 0" (two separate intervals)', '"Decreasing at x=0"', '"Decreasing everywhere, including at x=0"', '"Decreasing for all x"'], correctIndex: 0, hints: { strategic: 'The function is undefined at x=0, so you must describe each branch\'s interval separately.', procedural: 'Two separate intervals, excluding x=0.', workedStep: 'Decreasing for x<0 and decreasing for x>0.' }, distractorMisconceptions: { 2: 'increasing-decreasing-single-point' } },
      { id: 'ip-3', objectiveId: 'find-intersections', question: 'y = x² and y = 4 intersect where?', options: ['(2,4) and (-2,4)', '(4,2) only', '(2,4) only', '(0,4)'], correctIndex: 0, hints: { strategic: 'Set x² = 4 and solve for x.', procedural: 'x = 2 or x = -2, both give y=4.', workedStep: '(2,4) and (-2,4).' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'interpret-real-context', question: 'A graph of "height of water in a bathtub vs. time" rises, then is flat, then falls sharply. What does the flat section mean?', options: ['The tap was turned off and the plug wasn\'t pulled yet (water level unchanged)', 'The bathtub was tilted', 'The water was flowing very fast', 'The graph has an error'], correctIndex: 0, hints: { strategic: 'A flat section means the vertical variable (height) isn\'t changing.', procedural: 'Height staying constant means no water is entering or leaving.', workedStep: 'The tap is off and the plug is still in.' }, distractorMisconceptions: { 1: 'graph-as-literal-picture' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'read-values-from-graph', multiSelect: false, question: 'A graph\'s x-axis is marked 0, 20, 40, 60. What does a gridline halfway between 20 and 40 represent?', options: ['30', '10', '25', '35'], correctIndices: [0], explanation: 'Halfway between 20 and 40 is 30.', distractorMisconceptions: { 1: 'ignores-axis-scale' } },
    { id: 'q2', type: 'true-false', objectiveId: 'describe-intervals', multiSelect: false, question: 'True or false: "increasing" should always be described using an interval of x-values, not a single point.', options: ['True', 'False'], correctIndices: [0], explanation: 'True — increasing/decreasing describes behaviour over a range, not at one instant.', distractorMisconceptions: { 1: 'increasing-decreasing-single-point' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'find-intersections', multiSelect: false, question: 'Find where y = 3x - 1 and y = x + 5 intersect.', options: ['(3, 8)', '(8, 3)', '(1, 6)', '(5, 14)'], correctIndices: [0], explanation: '3x-1=x+5 → 2x=6 → x=3, y=3+5=8.', distractorMisconceptions: { 1: 'intersection-point-misread' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'find-intersections', multiSelect: false, question: 'Find where y = x² - 1 and y = 3 intersect.', options: ['(2,3) and (-2,3)', '(2,3) only', '(4,3)', '(3,2)'], correctIndices: [0], explanation: 'x²-1=3 → x²=4 → x=2 or x=-2, both give y=3.', distractorMisconceptions: {} },
    { id: 'q5', type: 'true-false', objectiveId: 'interpret-real-context', multiSelect: false, question: 'True or false: a graph\'s shape is a literal picture of the physical scenario it describes.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — a graph shows the relationship between two variables, not a literal image of the situation.', distractorMisconceptions: { 0: 'graph-as-literal-picture' } },
    { id: 'q6', type: 'decimal-discrimination', objectiveId: 'interpret-real-context', multiSelect: false, question: 'A speed-vs-time graph is flat at a positive value for 10 minutes. What does this mean?', options: ['Constant (steady) speed for those 10 minutes', 'The object is not moving at all', 'The object is accelerating', 'The graph has an error'], correctIndices: [0], explanation: 'A flat, nonzero speed-time graph means speed isn\'t changing — constant speed, not stationary.', distractorMisconceptions: {} },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'describe-intervals', multiSelect: false, question: 'For an exponential y = 2ˣ, over what interval is the function increasing?', options: ['For all x (it increases everywhere)', 'Only for x > 0', 'Only for x < 0', 'It never increases'], correctIndices: [0], explanation: 'A basic growth exponential with b>1 increases across its entire domain.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'read-values-from-graph', multiSelect: true, question: 'Before reading values off an unfamiliar graph, which checks should you do first? (select all that apply)', options: ['Check the scale/spacing of each axis', 'Check the units labelled on each axis', 'Assume every gridline means 1 unit', 'Check whether the graph starts at (0,0)'], correctIndices: [0, 1], explanation: 'Always check the actual scale and units — never assume gridlines are spaced by 1, and graphs don\'t have to start at the origin.', distractorMisconceptions: { 2: 'ignores-axis-scale' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'find-intersections',
      analogy: 'Think of two graphs intersecting like two people meeting at the exact same address at the exact same time — the intersection is ONE shared location (x,y), true for both of them simultaneously, not two separate addresses.',
      explanation: 'To find where two graphs meet: set their y-expressions equal to each other (since y must be the same value at that point), solve for x, then substitute back into EITHER original equation to find the shared y-value.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Find where y = 4x - 3 and y = x + 6 intersect.', steps: [
          { step: '4x - 3 = x + 6.', justification: 'Set the expressions equal.' },
          { step: '3x = 9, so x = 3.', justification: 'Solve for x.' },
          { step: 'Substitute into y=x+6: y = 3+6 = 9.', justification: 'Find the shared y-value using either equation.' },
        ], answer: '(3, 9)' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'find-intersections', question: 'Find where y = 5x - 2 and y = 2x + 7 intersect.', options: ['(3, 13)', '(13, 3)', '(3, 7)', '(9, 43)'], correctIndex: 0, hints: { strategic: 'Set the expressions equal.', procedural: '5x-2=2x+7 → 3x=9 → x=3.', workedStep: 'y=2(3)+7=13. (3,13).' }, distractorMisconceptions: { 1: 'intersection-point-misread' } },
        { id: 'rem-p2', objectiveId: 'find-intersections', question: 'Find where y = x + 1 and y = -2x + 10 intersect.', options: ['(3, 4)', '(4, 3)', '(3, 10)', '(1, 4)'], correctIndex: 0, hints: { strategic: 'Set the expressions equal.', procedural: 'x+1=-2x+10 → 3x=9 → x=3.', workedStep: 'y=3+1=4. (3,4).' }, distractorMisconceptions: { 1: 'intersection-point-misread' } },
        { id: 'rem-p3', objectiveId: 'find-intersections', question: 'Find where y = 2x and y = 8 intersect.', options: ['(4, 8)', '(8, 4)', '(2, 8)', '(4, 2)'], correctIndex: 0, hints: { strategic: 'Set 2x equal to 8.', procedural: 'x = 4.', workedStep: 'y=8. (4,8).' }, distractorMisconceptions: { 1: 'intersection-point-misread' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What is the biggest mistake to avoid when reading an unfamiliar graph?', type: 'multiple-choice', options: ['Assuming gridlines are always spaced by 1', 'Reading a graph as a literal picture of the scenario', 'Describing increasing/decreasing at a single point instead of an interval', 'All of the above'] },
    { id: 'r2', prompt: 'How confident do you feel interpreting and comparing graphs now, across all the function types from this term?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What will you check first, every time, before reading values off a new graph?', type: 'free-text' },
  ],
};
