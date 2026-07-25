// ── Term 3, Topic 1: Measures of Central Tendency & Spread ───────────────────
// First Term 3 topic — no new visual component needed (tables/text suffice);
// BoxPlot is reserved for Topic 2 which builds on this one's five-number
// summary groundwork.

import type { LessonContent } from '../../../types';

const misconceptions: LessonContent['misconceptions'] = [
  {
    id: 'mean-always-best-measure',
    label: 'Always using the mean, even when it doesn\'t represent the data well',
    errorType: 'You used the mean as "the" average without checking whether it actually represents the typical value.',
    principle: 'The mean is sensitive to outliers (extreme values) — a single very large or very small value can pull it far from where most of the data actually sits. The MEDIAN is often a better "typical value" when outliers are present.',
    correctStep: 'For salaries {20000, 22000, 21000, 23000, 500000}, the mean (~117200) is misleading due to the outlier; the median (22000) better represents the typical salary.',
  },
  {
    id: 'mode-confused-with-frequency',
    label: 'Confusing the mode with the frequency (count) of the most common value',
    errorType: 'You reported how many times the most frequent value appeared, instead of the value itself.',
    principle: 'The MODE is the VALUE that appears most often, not the number of times it appears. If 5 appears three times, the mode is 5, not 3.',
    correctStep: 'For {2, 5, 5, 5, 8}, the mode is 5 (the value), not 3 (the count of how many times it appears).',
  },
  {
    id: 'median-even-count-error',
    label: 'Finding the median incorrectly when there is an even number of data points',
    errorType: 'You picked one of the two middle values instead of averaging them, when the data set had an even count.',
    principle: 'With an EVEN number of values (after ordering), the median is the AVERAGE of the two middle values — not just one of them.',
    correctStep: 'For {3, 5, 7, 9} (4 values), the two middle values are 5 and 7, so the median = (5+7)/2 = 6.',
  },
  {
    id: 'forgot-to-order-data',
    label: 'Finding the median without first ordering the data',
    errorType: 'You picked the middle value from the data set in its original, unordered form.',
    principle: 'The median requires the data to be ordered from smallest to largest FIRST — only then does "the middle value" make sense.',
    correctStep: 'For {9, 2, 7, 3, 5}: order first: {2,3,5,7,9}. The median is the middle value, 5.',
  },
  {
    id: 'range-vs-spread-confused',
    label: 'Treating the range as a complete description of spread',
    errorType: 'You used only the range to describe how spread out the data is, ignoring how the values are distributed.',
    principle: 'The RANGE (max - min) only tells you the total span, and is very sensitive to a single outlier — it says nothing about how the values are distributed WITHIN that span.',
    correctStep: 'Two data sets can have the same range but look very different — one tightly clustered except for one outlier, another evenly spread — the range alone can\'t distinguish them.',
  },
];

const meta: LessonContent['meta'] = {
  subject: 'algebra',
  grade: 10,
  term: 3,
  topicId: 'central-tendency-spread',
  topicName: 'Measures of Central Tendency & Spread',
  prerequisites: [
    'Ordering and comparing numbers',
    'Basic arithmetic (sums, division)',
  ],
  objectives: [
    { id: 'calculate-mean-median-mode', text: 'Calculate the mean, median, and mode of a data set.' },
    { id: 'choose-appropriate-measure', text: 'Choose the most appropriate measure of central tendency for a given data set, especially with outliers.' },
    { id: 'calculate-range', text: 'Calculate the range of a data set as a basic measure of spread.' },
    { id: 'interpret-grouped-data', text: 'Read and interpret central tendency from a simple frequency table.' },
  ],
  estimatedMinutes: [20, 30],
};

export const centralTendencySpread: LessonContent = {
  meta,
  colorScheme: { N: 'sky', W: 'teal', Z: 'indigo', Q: 'emerald', QPrime: 'amber', R: 'stone' },
  openingHook: 'What does a single number tell you about a whole data set?',
  goalSettingPrompt:
    'Every data set can be summarised with a handful of key numbers — but choosing the RIGHT one for the situation matters. By the end of this lesson you\'ll be able to calculate mean, median, mode, and range, and know when each one is the most honest choice.',

  activate: {
    connectPrompt: 'You already know basic arithmetic — averages just apply it to a whole list of numbers at once.',
    diagnosticQuestions: [
      { question: 'What is the sum of {4, 6, 8, 10, 12}?', options: ['40', '36', '44', '38'], correctIndex: 0, explanation: '4+6+8+10+12 = 40.' },
      { question: 'Order these from smallest to largest: 7, 2, 9, 4.', options: ['2, 4, 7, 9', '9, 7, 4, 2', '2, 7, 4, 9', '4, 2, 9, 7'], correctIndex: 0, explanation: 'Sorted ascending: 2, 4, 7, 9.' },
    ],
  },

  demonstrateChunk1: {
    explanation:
      'Three common ways to describe a "typical" value: the MEAN (add all values, divide by how many there are), the MEDIAN (the middle value once the data is ordered — average the two middle values if there\'s an even count), and the MODE (the value that appears most often). The mean is sensitive to outliers (extreme values); the median usually isn\'t, making it a better "typical value" when outliers are present.',
    workedExamples: [
      { id: 'wx-mean-median-mode', prompt: 'Find the mean, median, and mode of {4, 7, 4, 9, 6}.', steps: [
        { step: 'Mean: (4+7+4+9+6)/5 = 30/5 = 6.', justification: 'Sum all values and divide by the count.' },
        { step: 'Median: order first {4,4,6,7,9}, middle value (3rd of 5) is 6.', justification: 'Order the data before finding the middle.' },
        { step: 'Mode: 4 appears twice, more than any other value, so the mode is 4.', justification: 'Identify the most frequently occurring value.' },
      ], answer: 'Mean=6, Median=6, Mode=4' },
      { id: 'wx-even-median', prompt: 'Find the median of {3, 8, 5, 11}.', steps: [
        { step: 'Order first: {3, 5, 8, 11}.', justification: 'Order before finding the median.' },
        { step: 'With 4 values (even), average the two middle values: (5+8)/2 = 6.5.', justification: 'An even count needs the average of the two middle values.' },
      ], answer: 'Median = 6.5' },
    ],
    knowledgeChecks: [
      { question: 'Find the mode of {2, 5, 5, 5, 9, 9}.', options: ['5', '3', '9', '2'], correctIndex: 0, explanation: '5 appears three times, more than any other value — that\'s the mode itself, not the count.', misconceptionId: 'mode-confused-with-frequency' },
      { question: 'Find the median of {10, 2, 8, 4, 6} (order it first!).', options: ['6', '10', '2', '4'], correctIndex: 0, explanation: 'Ordered: {2,4,6,8,10}. Middle value (3rd of 5) is 6.', misconceptionId: 'forgot-to-order-data' },
    ],
    confidenceCheckPrompt: 'How confident do you feel calculating the mean, median, and mode of a data set?',
  },

  demonstrateChunk2: {
    explanation:
      'The RANGE (max - min) is the simplest measure of spread, but it only tells you the total span — it\'s very sensitive to a single outlier and says nothing about how values are distributed within that span. When choosing which measure of central tendency to report, consider whether outliers are present: if so, the median is usually more honest than the mean. Data is sometimes given as a frequency table — the same mean/median/mode principles apply, just working from the table\'s counts.',
    workedExamples: [
      { id: 'wx-range', prompt: 'Find the range of {12, 45, 23, 8, 31}.', steps: [
        { step: 'Identify the max (45) and min (8).', justification: 'Range only needs these two extreme values.' },
        { step: 'Range = 45 - 8 = 37.', justification: 'Subtract min from max.' },
      ], answer: 'Range = 37' },
      { id: 'wx-outlier-choice', prompt: 'A shop\'s daily sales for a week were {200, 210, 195, 205, 190, 2000, 198}. Which measure best describes a "typical" day, and why?', steps: [
        { step: 'The mean would be pulled far higher by the 2000 outlier (one unusually busy day).', justification: 'Check whether an outlier is present.' },
        { step: 'The median, found by ordering the data, is not affected by that one extreme value.', justification: 'The median only depends on the middle position, not the size of extreme values.' },
      ], answer: 'The median — it\'s not distorted by the 2000 outlier.' },
    ],
    knowledgeChecks: [
      { question: 'For {5, 6, 7, 8, 100}, which measure best represents a "typical" value?', options: ['Median', 'Mean', 'Range', 'They are all equally good'], correctIndex: 0, explanation: 'The mean would be distorted by the 100 outlier; the median (7) is unaffected.', misconceptionId: 'mean-always-best-measure' },
      { question: 'Two classes have test scores with the same range but different distributions. What does this tell you?', options: ['The range alone doesn\'t describe how the data is distributed', 'They must have the same mean', 'They must have the same median', 'The range is a complete description of spread'], correctIndex: 0, explanation: 'Range only measures total span — data with the same range can be distributed very differently.', misconceptionId: 'range-vs-spread-confused' },
    ],
    confidenceCheckPrompt: 'How confident do you feel choosing the right measure of central tendency and understanding the range\'s limitations?',
  },

  apply: {
    fadingProblems: [
      { id: 'fp-full-1', objectiveId: 'calculate-mean-median-mode', revealSteps: 2, prompt: 'Find the mean, median, and mode of {6, 3, 6, 9, 3, 6}.', steps: [
        { step: 'Mean: (6+3+6+9+3+6)/6 = 33/6 = 5.5.', justification: 'Sum and divide.' },
        { step: 'Median: order {3,3,6,6,6,9}, average the two middle values (6 and 6) = 6.', justification: 'Even count, average the middle two.' },
        { step: 'Mode: 6 appears three times, the most.', justification: 'Most frequent value.' },
      ], answer: 'Mean=5.5, Median=6, Mode=6' },
      { id: 'fp-partial-1', objectiveId: 'calculate-range', revealSteps: 1, prompt: 'Find the range of {88, 45, 102, 67, 91}.', steps: [
        { step: 'Max = 102, Min = 45.', justification: 'Identify extremes.' },
        { step: 'Range = 102-45 = 57.', justification: 'Subtract.' },
      ], answer: 'Range = 57' },
      { id: 'fp-independent-1', objectiveId: 'choose-appropriate-measure', revealSteps: 0, prompt: 'House prices on a street are mostly around R800,000, except one mansion at R8,000,000. Which measure of central tendency best describes a "typical" house price here?', steps: [
        { step: 'The mean would be heavily skewed upward by the R8,000,000 outlier.', justification: 'Check for outliers.' },
        { step: 'The median is unaffected by that single extreme value.', justification: 'Median depends on position, not magnitude.' },
      ], answer: 'The median.' },
    ],
    independentPractice: [
      { id: 'ip-1', objectiveId: 'calculate-mean-median-mode', question: 'Find the mean of {10, 15, 20, 25, 30}.', options: ['20', '25', '15', '18'], correctIndex: 0, hints: { strategic: 'Sum and divide by count.', procedural: '(10+15+20+25+30)/5', workedStep: '100/5 = 20.' }, distractorMisconceptions: {} },
      { id: 'ip-2', objectiveId: 'calculate-mean-median-mode', question: 'Find the median of {12, 4, 8, 16} (order it first).', options: ['10', '8', '12', '4'], correctIndex: 0, hints: { strategic: 'Order first, then average the two middle values (even count).', procedural: 'Ordered: 4,8,12,16.', workedStep: '(8+12)/2 = 10.' }, distractorMisconceptions: { 1: 'median-even-count-error' } },
      { id: 'ip-3', objectiveId: 'calculate-range', question: 'Find the range of {56, 12, 89, 34, 71}.', options: ['77', '89', '12', '65'], correctIndex: 0, hints: { strategic: 'Range = max - min.', procedural: 'Max=89, Min=12.', workedStep: '89-12 = 77.' }, distractorMisconceptions: {} },
      { id: 'ip-4', objectiveId: 'choose-appropriate-measure', question: 'A data set has no outliers and is fairly evenly spread. Which measure is generally fine to use for "typical value"?', options: ['Either mean or median work well here', 'Only the mode', 'Only the range', 'None of them work'], correctIndex: 0, hints: { strategic: 'Outliers are the main reason to prefer median over mean.', procedural: 'Without outliers, mean and median tend to be close.', workedStep: 'Either mean or median is fine.' }, distractorMisconceptions: {} },
    ],
  },

  misconceptions,

  quiz: [
    { id: 'q1', type: 'decimal-discrimination', objectiveId: 'calculate-mean-median-mode', multiSelect: false, question: 'Find the mean of {8, 12, 16, 20}.', options: ['14', '16', '12', '18'], correctIndices: [0], explanation: '(8+12+16+20)/4 = 56/4 = 14.', distractorMisconceptions: {} },
    { id: 'q2', type: 'decimal-discrimination', objectiveId: 'calculate-mean-median-mode', multiSelect: false, question: 'Find the median of {9, 3, 7, 3, 12} (order first).', options: ['7', '3', '9', '12'], correctIndices: [0], explanation: 'Ordered: {3,3,7,9,12}. Middle value is 7.', distractorMisconceptions: { 1: 'forgot-to-order-data' } },
    { id: 'q3', type: 'decimal-discrimination', objectiveId: 'calculate-mean-median-mode', multiSelect: false, question: 'Find the mode of {4, 4, 7, 9, 9, 9, 2}.', options: ['9', '3', '4', '7'], correctIndices: [0], explanation: '9 appears three times, the most.', distractorMisconceptions: { 1: 'mode-confused-with-frequency' } },
    { id: 'q4', type: 'decimal-discrimination', objectiveId: 'calculate-mean-median-mode', multiSelect: false, question: 'Find the median of {2, 8, 5, 11, 6, 9} (order first — even count).', options: ['7', '5', '6.5', '8'], correctIndices: [0], explanation: 'Ordered: {2,5,6,8,9,11}. Middle two are 6 and 8, average = 7.', distractorMisconceptions: { 1: 'median-even-count-error' } },
    { id: 'q5', type: 'decimal-discrimination', objectiveId: 'calculate-range', multiSelect: false, question: 'Find the range of {34, 67, 12, 89, 45}.', options: ['77', '89', '12', '55'], correctIndices: [0], explanation: '89-12=77.', distractorMisconceptions: {} },
    { id: 'q6', type: 'true-false', objectiveId: 'choose-appropriate-measure', multiSelect: false, question: 'True or false: the mean is always the best measure of central tendency to report.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — the mean is distorted by outliers; the median is often more appropriate then.', distractorMisconceptions: { 0: 'mean-always-best-measure' } },
    { id: 'q7', type: 'true-false', objectiveId: 'calculate-range', multiSelect: false, question: 'True or false: two data sets with the same range must have the same distribution shape.', options: ['True', 'False'], correctIndices: [1], explanation: 'False — range only measures total span, not how values are distributed within it.', distractorMisconceptions: { 0: 'range-vs-spread-confused' } },
    { id: 'q8', type: 'multi-select', objectiveId: 'calculate-mean-median-mode', multiSelect: true, question: 'Which of these statements about {5, 5, 5, 8, 12} are correct? (select all that apply)', options: ['The mode is 5', 'The median is 5', 'The mean is 7', 'The mode is 3'], correctIndices: [0, 1, 2], explanation: 'Mode=5 (most frequent value), median=5 (middle of ordered {5,5,5,8,12}), mean=(5+5+5+8+12)/5=35/5=7. The mode is the VALUE 5, not the count 3.', distractorMisconceptions: { 3: 'mode-confused-with-frequency' } },
  ],

  masteryThresholdPct: 80,

  remediation: [
    {
      objectiveId: 'calculate-mean-median-mode',
      analogy: 'Think of the three measures as three different questions about the same data: Mean asks "if we shared everything equally, how much would each get?" Median asks "what\'s the middle person\'s value, once everyone lines up in order?" Mode asks "what value shows up most often in the crowd?"',
      explanation: 'Always compute each one by its own clear procedure: Mean = sum ÷ count. Median = order the data, then find the middle (or average the middle two). Mode = the most frequently occurring value.',
      workedExamples: [
        { id: 'rem-wx-1', prompt: 'Find mean, median, and mode of {7, 2, 7, 9, 5}.', steps: [
          { step: 'Mean: (7+2+7+9+5)/5 = 30/5 = 6.', justification: 'Sum divided by count.' },
          { step: 'Median: order {2,5,7,7,9}, middle value is 7.', justification: 'Order first, then find the middle.' },
          { step: 'Mode: 7 appears twice, the most.', justification: 'Most frequent value.' },
        ], answer: 'Mean=6, Median=7, Mode=7' },
      ],
      practice: [
        { id: 'rem-p1', objectiveId: 'calculate-mean-median-mode', question: 'Find the mean, median, mode of {3, 3, 8, 10}.', options: ['Mean=6, Median=5.5, Mode=3', 'Mean=6, Median=8, Mode=3', 'Mean=5.5, Median=6, Mode=3', 'Mean=6, Median=5.5, Mode=10'], correctIndex: 0, hints: { strategic: 'Compute each separately.', procedural: 'Mean=(3+3+8+10)/4=24/4=6. Median: avg of 3,8 = 5.5.', workedStep: 'Mode=3. So Mean=6, Median=5.5, Mode=3.' }, distractorMisconceptions: {} },
        { id: 'rem-p2', objectiveId: 'calculate-mean-median-mode', question: 'Find the mean, median, mode of {4, 6, 6, 6, 8}.', options: ['Mean=6, Median=6, Mode=6', 'Mean=6, Median=6, Mode=3', 'Mean=5, Median=6, Mode=6', 'Mean=6, Median=4, Mode=6'], correctIndex: 0, hints: { strategic: 'Compute each separately.', procedural: 'Mean=(4+6+6+6+8)/5=30/5=6. Median (middle of 5) = 6.', workedStep: 'Mode=6. All three are 6.' }, distractorMisconceptions: { 1: 'mode-confused-with-frequency' } },
        { id: 'rem-p3', objectiveId: 'calculate-mean-median-mode', question: 'Find the mean and median of {1, 2, 3, 4, 5, 6}.', options: ['Mean=3.5, Median=3.5', 'Mean=3, Median=3', 'Mean=3.5, Median=3', 'Mean=4, Median=3.5'], correctIndex: 0, hints: { strategic: 'Even count — remember to average the two middle values for the median.', procedural: 'Mean=(1+2+3+4+5+6)/6=21/6=3.5.', workedStep: 'Median = (3+4)/2 = 3.5.' }, distractorMisconceptions: { 1: 'median-even-count-error' } },
      ],
      passThreshold: { correct: 2, total: 3 },
    },
  ],

  reflection: [
    { id: 'r1', prompt: 'When would you choose the median over the mean?', type: 'free-text' },
    { id: 'r2', prompt: 'How confident do you feel calculating and choosing between mean, median, and mode now?', type: 'confidence-scale' },
    { id: 'r3', prompt: 'What is one everyday example where an outlier might mislead an average?', type: 'multiple-choice', options: ['Salaries in a small company with one very high earner', 'Test scores that are all very similar', 'Heights of students in a class', 'None of these'] },
  ],
};
