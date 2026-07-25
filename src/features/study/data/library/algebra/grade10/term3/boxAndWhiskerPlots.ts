// ── Term 3, Topic 2: Box-and-Whisker Plots ────────────────────────────────────
// First use of the new BoxPlot component. Builds directly on Topic 1's
// median/ordering skills, extending to the full five-number summary.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'quartiles-not-medians-of-halves',
    label: 'Not finding quartiles as the median of each half of the data',
    errorType: 'You calculated Q1 and Q3 incorrectly, not using the "median of each half" method.',
    principle: 'After finding the median, split the ordered data into a lower half and upper half (excluding the overall median if the count is odd). Q1 is the MEDIAN of the lower half; Q3 is the MEDIAN of the upper half.',
    correctStep: 'For {2,4,6,8,10,12,14} (median=8): lower half {2,4,6} has median Q1=4; upper half {10,12,14} has median Q3=12.',
  },
  {
    id: 'box-plot-box-misread',
    label: 'Misreading what the box itself represents on a box plot',
    errorType: 'You misidentified which part of the box plot shows the median, or thought the box shows the full range.',
    principle: 'The BOX spans from Q1 to Q3 (the middle 50% of the data, the interquartile range). The line INSIDE the box is the median. The WHISKERS (lines extending outward) reach to the min and max.',
    correctStep: 'On a box plot, the box edges are Q1 and Q3, the line inside is the median, and the whisker tips are the minimum and maximum.',
  },
  {
    id: 'comparing-boxplots-only-medians',
    label: 'Comparing two box plots using only their medians, ignoring spread',
    errorType: 'You compared two box plots by looking only at where their medians sit, without considering the size of the boxes/whiskers.',
    principle: 'A full comparison of two box plots should consider BOTH central tendency (median position) AND spread (box width = interquartile range, whisker length = full range) — two data sets can have similar medians but very different spreads.',
    correctStep: 'Two classes might have the same median test score, but one class\'s box plot could be much wider — meaning more varied performance.',
  },
  {
    id: 'iqr-calculation-error',
    label: 'Calculating the interquartile range incorrectly',
    errorType: 'You didn\'t subtract Q1 from Q3 correctly, or used the wrong pair of values.',
    principle: 'The interquartile range (IQR) = Q3 - Q1 — the width of the box, describing the spread of the middle 50% of the data.',
    correctStep: 'If Q1=12 and Q3=28, then IQR = 28-12 = 16.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 3,
  topicId: 'box-and-whisker-plots',
  topicName: 'Box-and-Whisker Plots',
  prerequisites: [
    'Mean, median, mode, and range (this term, Topic 1)',
    'Ordering data',
  ],
  objectives: [
    { id: 'find-five-number-summary', text: 'Find the five-number summary (min, Q1, median, Q3, max) of a data set.' },
    { id: 'construct-box-plot', text: 'Construct a box-and-whisker plot from a five-number summary.' },
    { id: 'read-box-plot', text: 'Read a box plot to identify its five-number summary and interquartile range.' },
    { id: 'compare-box-plots', text: 'Compare two box plots on both central tendency and spread.' },
  ],
  estimatedMinutes: [20, 30],
};

export const boxAndWhiskerPlots: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'How do you summarise an entire data set in one small picture?',
  goalSettingPrompt:
    'You already know how to find the median of a data set. A box plot extends that single number into a full five-number summary, visualised as one compact picture. By the end of this lesson you\'ll be able to build, read, and compare box plots.',

  activate: {
    connectPrompt: 'You already know how to order data and find the median. A box plot builds on both skills.',
    diagnosticQuestions: [
      { question: 'Order these: 15, 3, 9, 21, 7.', options: ['3, 7, 9, 15, 21', '21, 15, 9, 7, 3', '3, 9, 7, 15, 21', '7, 3, 9, 15, 21'], correctIndex: 0, explanation: 'Ascending order: 3, 7, 9, 15, 21.' },
      { question: 'Find the median of {3, 7, 9, 15, 21}.', options: ['9', '7', '15', '11'], correctIndex: 0, explanation: 'Middle value of 5 ordered values is 9.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'The FIVE-NUMBER SUMMARY consists of: the minimum, the first quartile (Q1), the median, the third quartile (Q3), and the maximum. After finding the overall median, split the ordered data into a lower half and an upper half. Q1 is the MEDIAN of the lower half; Q3 is the MEDIAN of the upper half. Together, these five numbers describe both the centre and the spread of the data.',
    workedExamples: [
      { id: 'wx-five-number-summary', prompt: 'Find the five-number summary of {4, 8, 15, 16, 23, 42, 50}.', steps: [
        { step: 'Already ordered. Min=4, Max=50.', justification: 'Identify the extremes first.' },
        { step: 'Median (middle of 7 values) = 16.', justification: 'Find the overall median.' },
        { step: 'Lower half (excluding median): {4,8,15}, median of this = Q1 = 8. Upper half: {23,42,50}, median = Q3 = 42.', justification: 'Split into two halves and find the median of each.' },
      ], answer: 'Min=4, Q1=8, Median=16, Q3=42, Max=50' },
    ],
    knowledgeChecks: [
      { question: 'For {2, 4, 6, 8, 10, 12, 14} (median=8), what is Q1?', options: ['4', '2', '6', '8'], correctIndex: 0, explanation: 'Lower half {2,4,6}, median (Q1) = 4.', misconceptionId: 'quartiles-not-medians-of-halves' },
      { question: 'For the same data {2,4,6,8,10,12,14}, what is Q3?', options: ['12', '14', '10', '8'], correctIndex: 0, explanation: 'Upper half {10,12,14}, median (Q3) = 12.', misconceptionId: 'quartiles-not-medians-of-halves' },
    ],
    confidenceCheckPrompt: 'How confident do you feel finding a five-number summary?',
  },

  demonstrateChunk2: {
    explanation:
      'A box plot displays the five-number summary visually: the BOX spans from Q1 to Q3 (the middle 50% of the data), with a line inside showing the median; the WHISKERS extend out to the minimum and maximum. The INTERQUARTILE RANGE (IQR = Q3 - Q1) is the width of the box, describing the spread of the middle 50%. When comparing two box plots, look at BOTH where the medians sit AND how wide the boxes/whiskers are — similar medians can still hide very different spreads.',
    workedExamples: [
      { id: 'wx-construct-boxplot', prompt: 'Construct a box plot from the summary Min=10, Q1=20, Median=28, Q3=35, Max=50.', steps: [
        { step: 'Draw whiskers from 10 to 20 (min to Q1) and from 35 to 50 (Q3 to max).', justification: 'Whiskers connect the extremes to the box edges.' },
        { step: 'Draw the box from 20 to 35 (Q1 to Q3), with a line at 28 (the median) inside it.', justification: 'The box spans the middle 50% of the data.' },
      ], answer: 'Box plot with whiskers 10-20 and 35-50, box 20-35, median line at 28', boxPlot: {
        plots: [{ label: 'Class A', min: 10, q1: 20, median: 28, q3: 35, max: 50 }],
        domain: [0, 55],
      } },
      { id: 'wx-compare-boxplots', prompt: 'Compare these two classes\' test scores using their box plots.', steps: [
        { step: 'Class A: Min=40, Q1=55, Median=65, Q3=75, Max=90. Class B: Min=50, Q1=60, Median=65, Q3=70, Max=80.', justification: 'Both classes have the same median, 65.' },
        { step: 'Class A\'s box (Q1 to Q3) is wider (55 to 75, IQR=20) than Class B\'s (60 to 70, IQR=10) — Class A has more varied scores.', justification: 'Compare spread, not just the median.' },
      ], answer: 'Same median, but Class A has more spread/variability than Class B', boxPlot: {
        plots: [
          { label: 'Class A', min: 40, q1: 55, median: 65, q3: 75, max: 90 },
          { label: 'Class B', min: 50, q1: 60, median: 65, q3: 70, max: 80 },
        ],
        domain: [30, 100],
      } },
    ],
    knowledgeChecks: [
      { question: 'On a box plot, what does the line inside the box represent?', options: ['The median', 'The mean', 'The mode', 'The range'], correctIndex: 0, explanation: 'The line inside the box is always the median.', misconceptionId: 'box-plot-box-misread' },
      { question: 'Two box plots have the same median but very different box widths. What does this tell you?', options: ['They have different amounts of spread in the middle 50% of data', 'They must be identical data sets', 'The wider one has a higher median', 'Nothing meaningful can be concluded'], correctIndex: 0, explanation: 'Box width (IQR) shows spread — same median doesn\'t mean same spread.', misconceptionId: 'comparing-boxplots-only-medians' },
    ],
    confidenceCheckPrompt: 'How confident do you feel constructing, reading, and comparing box plots?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'find-five-number-summary', revealSteps: 2, prompt: 'Find the five-number summary of {5, 9, 12, 18, 22, 30, 35}.', steps: [
        { step: 'Min=5, Max=35, Median (middle of 7) = 18.', justification: 'Identify extremes and overall median.' },
        { step: 'Lower half {5,9,12}: Q1=9. Upper half {22,30,35}: Q3=30.', justification: 'Median of each half.' },
      ], answer: 'Min=5, Q1=9, Median=18, Q3=30, Max=35' },
      { id: 'fp-partial-1', objectiveId: 'construct-box-plot', revealSteps: 1, prompt: 'Sketch a box plot for Min=0, Q1=15, Median=25, Q3=40, Max=60.', steps: [
        { step: 'Box from 15 to 40, with median line at 25.', justification: 'Box spans Q1 to Q3.' },
        { step: 'Whiskers from 0 to 15, and from 40 to 60.', justification: 'Whiskers connect box edges to extremes.' },
      ], answer: 'Box 15-40 with line at 25; whiskers 0-15 and 40-60', boxPlot: { plots: [{ label: 'Data', min: 0, q1: 15, median: 25, q3: 40, max: 60 }], domain: [0, 65] } },
      { id: 'fp-independent-1', objectiveId: 'read-box-plot', revealSteps: 0, prompt: 'From a box plot showing Min=20, Q1=35, Median=50, Q3=60, Max=90, find the IQR.', steps: [
        { step: 'IQR = Q3 - Q1 = 60 - 35 = 25.', justification: 'Subtract Q1 from Q3.' },
      ], answer: 'IQR = 25' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'find-five-number-summary', question: 'Find Q1 and Q3 for {1, 3, 5, 7, 9, 11, 13} (median=7).', options: ['Q1=3, Q3=11', 'Q1=1, Q3=13', 'Q1=5, Q3=9', 'Q1=3, Q3=9'], correctIndex: 0, hints: { strategic: 'Q1 = median of the lower half; Q3 = median of the upper half.', procedural: 'Lower half {1,3,5}, upper half {9,11,13}.', workedStep: 'Q1=3, Q3=11.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'construct-box-plot', question: 'For a box plot with Q1=25 and Q3=45, how wide is the box?', options: ['20', '70', '25', '45'], correctIndex: 0, hints: { strategic: 'Box width = Q3 - Q1 = IQR.', procedural: '45-25', workedStep: '= 20.' }, distractorMisconceptions: { 1: 'iqr-calculation-error' } },
      { id: 'ip-3', objectiveId: 'read-box-plot', question: 'On a box plot, the whisker tips are at 5 and 95. What do these represent?', options: ['The minimum and maximum', 'Q1 and Q3', 'The median only', 'The mean'], correctIndex: 0, hints: { strategic: 'Whiskers extend to the extremes of the data.', procedural: 'Min and max.', workedStep: '5 is min, 95 is max.' }, distractorMisconceptions: { 1: 'box-plot-box-misread' } },
      { id: 'ip-4', objectiveId: 'compare-box-plots', question: 'Two box plots have medians 60 and 62 (very close), but one has a much wider box. What\'s the best conclusion?', options: ['Similar typical scores, but very different amounts of spread', 'They are essentially identical data sets', 'The one with the wider box has a much higher median', 'No meaningful comparison is possible'], correctIndex: 0, hints: { strategic: 'Compare both median AND box width.', procedural: 'Medians are close; box widths differ.', workedStep: 'Similar centre, different spread.' }, distractorMisconceptions: { 1: 'comparing-boxplots-only-medians' } },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'find-five-number-summary', multiSelect: false, question: 'For {6, 10, 14, 18, 22, 26, 30} (median=18), find Q1.', options: ['10', '6', '14', '18'], correctIndices: [0], explanation: 'Lower half {6,10,14}, median (Q1) = 10.', distractorMisconceptions: { 2: 'quartiles-not-medians-of-halves' } },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'find-five-number-summary', multiSelect: false, question: 'For the same data, find Q3.', options: ['26', '30', '22', '18'], correctIndices: [0], explanation: 'Upper half {22,26,30}, median (Q3) = 26.', distractorMisconceptions: {} },
    { id: 'q3', type: 'true-false', objectiveId: 'construct-box-plot', multiSelect: false, question: 'True or false: the box on a box plot spans from the minimum to the maximum.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the box spans from Q1 to Q3; the whiskers reach the min and max.', distractorMisconceptions: { 0: 'box-plot-box-misread' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'read-box-plot', multiSelect: false, question: 'A box plot shows Q1=18 and Q3=42. What is the IQR?', options: ['24', '60', '18', '42'], correctIndices: [0], explanation: 'IQR = 42-18 = 24.', distractorMisconceptions: { 1: 'iqr-calculation-error' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'read-box-plot', multiSelect: false, question: 'A box plot shows a median line at 55, box from 40 to 70, whiskers to 20 and 90. What is the maximum?', options: ['90', '70', '55', '20'], correctIndices: [0], explanation: 'The upper whisker tip is the maximum, 90.', distractorMisconceptions: { 1: 'box-plot-box-misread' } },
    { id: 'q6', type: 'true-false', objectiveId: 'compare-box-plots', multiSelect: false, question: 'True or false: two box plots with the same median must have the same spread.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — median only describes the centre; spread (box width, whisker length) is a separate comparison.', distractorMisconceptions: { 0: 'comparing-boxplots-only-medians' } },
    { id: 'q7', type: 'decimal-discrimination', objectiveId: 'find-five-number-summary', multiSelect: false, question: 'For {3, 6, 9, 12, 15, 18, 21, 24} (8 values, even — median = (12+15)/2=13.5), what are the lower and upper halves for finding Q1/Q3?', options: ['{3,6,9,12} and {15,18,21,24}', '{3,6,9} and {18,21,24}', '{3,6,9,12,15} and {15,18,21,24}', '{6,9,12} and {15,18,21}'], correctIndices: [0], explanation: 'With an even count, split exactly in half: lower 4 values and upper 4 values.', distractorMisconceptions: {} },
    { id: 'q8', type: 'multi-select', objectiveId: 'read-box-plot', multiSelect: true, question: 'Which of these can be read directly from a box plot? (select all that apply)', options: ['The median', 'The interquartile range', 'The mean', 'The minimum and maximum'], correctIndices: [0, 1, 3], explanation: 'Median, IQR (box width), and min/max (whisker tips) are all directly readable. The mean is NOT shown on a standard box plot.', distractorMisconceptions: {} },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'find-five-number-summary',
      analogy: 'Think of the five-number summary like folding a ruler in half twice: first fold finds the middle (median); folding each half again finds the middle of each half (Q1 and Q3).',
      explanation: 'Step by step: (1) order the data; (2) find the overall median; (3) split into lower half and upper half (excluding the median itself if the count is odd); (4) find the median of each half — these are Q1 and Q3.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Find the five-number summary of {2, 5, 8, 11, 14, 17, 20, 23, 26}.', steps: [
          { step: 'Already ordered. Min=2, Max=26. Median (5th of 9) = 14.', justification: 'Find extremes and overall median.' },
          { step: 'Lower half {2,5,8,11}, median (Q1) = (5+8)/2 = 6.5.', justification: 'Even count in the half, average the middle two.' },
          { step: 'Upper half {17,20,23,26}, median (Q3) = (20+23)/2 = 21.5.', justification: 'Same process for the upper half.' },
        ], answer: 'Min=2, Q1=6.5, Median=14, Q3=21.5, Max=26' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'find-five-number-summary', question: 'Find Q1 and Q3 of {4, 8, 12, 16, 20, 24, 28, 32} (median = (16+20)/2 = 18).', options: ['Q1=10, Q3=26', 'Q1=8, Q3=24', 'Q1=12, Q3=28', 'Q1=16, Q3=20'], correctIndex: 0, hints: { strategic: 'Split into lower 4 and upper 4 values.', procedural: 'Lower {4,8,12,16}: Q1=(8+12)/2=10.', workedStep: 'Upper {20,24,28,32}: Q3=(24+28)/2=26.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'find-five-number-summary', question: 'Find Q1 and Q3 of {10, 20, 30, 40, 50} (median=30).', options: ['Q1=15, Q3=45', 'Q1=20, Q3=40', 'Q1=10, Q3=50', 'Q1=30, Q3=30'], correctIndex: 0, hints: { strategic: 'Lower half (excluding the median): {10,20}. Upper half: {40,50}.', procedural: 'With only 2 values in each half, their median is the average of the two.', workedStep: 'Q1=(10+20)/2=15. Q3=(40+50)/2=45.' }, distractorMisconceptions: {} },
        { id: 'rem-p3', objectiveId: 'find-five-number-summary', question: 'Find Q1 and Q3 of {5, 10, 15, 20, 25, 30, 35}.', options: ['Q1=10, Q3=30', 'Q1=15, Q3=25', 'Q1=5, Q3=35', 'Q1=20, Q3=20'], correctIndex: 0, hints: { strategic: 'Median=20. Lower half {5,10,15}, upper half {25,30,35}.', procedural: 'Q1 = median of {5,10,15} = 10.', workedStep: 'Q3 = median of {25,30,35} = 30.' }, distractorMisconceptions: {} },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'What does the width of the box on a box plot tell you?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel building and comparing box plots now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'When comparing two box plots, what two things should you always look at?', type: 'multiple-choice', options: ['Median position and spread (box/whisker width)', 'Only the median', 'Only the range', 'The colours used'] },
  ],
};
