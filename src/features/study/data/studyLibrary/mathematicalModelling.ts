export const mathematicalModelling = {
  id: 'mathematical-modelling',
  title: 'Mathematical Modelling',
  description: 'Apply mathematical concepts to real-world situations',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'Mathematical Modelling',
    content: `
      <h3>What Is Mathematical Modelling?</h3>
      <p>Mathematical modelling is using mathematics to represent and understand real-world situations.</p>
      <p>It involves translating a real problem into a mathematical equation or graph, solving it, and interpreting the answer in the real-world context.</p>

      <h3>The Modelling Process</h3>
      <ol>
        <li><strong>Identify the problem:</strong> What are we trying to find?</li>
        <li><strong>Define variables:</strong> Let x = ..., Let y = ...</li>
        <li><strong>Write an equation:</strong> Translate the problem into math</li>
        <li><strong>Solve:</strong> Use algebra to find the answer</li>
        <li><strong>Interpret:</strong> What does the answer mean in the real context?</li>
        <li><strong>Check:</strong> Does the answer make sense?</li>
      </ol>

      <h3>Linear Models</h3>
      <p>Used when there's a constant rate of change.</p>
      <p><strong>Example:</strong> A car travels at 60 km/h. Distance = 60 × time</p>
      <p>y = mx + c where m is the rate of change and c is the starting value</p>

      <h3>Quadratic Models</h3>
      <p>Used for situations involving area, projectiles, or other non-linear changes.</p>
      <p><strong>Example:</strong> A ball thrown upward: h(t) = -5t² + 20t + 1</p>

      <h3>Interpreting Graphs</h3>
      <p><strong>Slope:</strong> The rate of change in the context</p>
      <p><strong>y-intercept:</strong> The starting or initial value</p>
      <p><strong>x-intercept:</strong> When the quantity becomes zero</p>
      <p><strong>Vertex of parabola:</strong> The maximum or minimum value</p>

      <h3>Creating Tables</h3>
      <p>A table helps organize data and see patterns.</p>
      <p><strong>Example:</strong> Cost of electricity based on usage</p>
      <table border="1" cellpadding="5">
        <tr><th>Units (kWh)</th><th>Cost (R)</th></tr>
        <tr><td>0</td><td>50</td></tr>
        <tr><td>100</td><td>150</td></tr>
        <tr><td>200</td><td>250</td></tr>
      </table>

      <h3>Real-World Applications</h3>
      <p><strong>Finance:</strong> Interest, savings, loans</p>
      <p><strong>Physics:</strong> Motion, trajectories, energy</p>
      <p><strong>Business:</strong> Cost, profit, break-even point</p>
      <p><strong>Environment:</strong> Population growth, pollution levels</p>
      <p><strong>Medicine:</strong> Drug concentration, disease spread</p>
    `
  },

  visualizations: [
    {
      id: 'modelling-steps',
      type: 'svg-animation',
      title: 'The Modelling Process',
      description: 'See each step of the mathematical modelling process',
      svgComponent: 'ModellingStepsVisualization'
    },
    {
      id: 'real-world-graph',
      type: 'interactive-graph',
      title: 'Real-World Scenario Graph',
      description: 'Explore a real-world situation represented as a graph',
      svgComponent: 'RealWorldGraphVisualization'
    },
    {
      id: 'interpretation-guide',
      type: 'svg-animation',
      title: 'Interpreting Graphs in Context',
      description: 'Learn what different features of a graph mean in real situations',
      svgComponent: 'InterpretationGuideVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-linear-model',
      difficulty: 'easy',
      title: 'Linear Model: Cost of Taxi Ride',
      problem: 'A taxi charges R15 per km plus R20 base fare. Write an equation for total cost. If you travel 10 km, what is the cost?',
      steps: [
        {
          step: 1,
          action: 'Define variables',
          explanation: 'Let d = distance in km, C = total cost in R',
          work: ''
        },
        {
          step: 2,
          action: 'Identify the pattern',
          explanation: 'Base fare R20 (fixed) + R15 per km (varies with d)',
          work: 'This is linear: C = md + c'
        },
        {
          step: 3,
          action: 'Write the equation',
          explanation: 'm = 15 (rate per km), c = 20 (base fare)',
          work: 'C = 15d + 20'
        },
        {
          step: 4,
          action: 'Find cost for 10 km',
          explanation: 'Substitute d = 10',
          work: 'C = 15(10) + 20 = 150 + 20 = 170'
        },
        {
          step: 5,
          action: 'Interpret',
          explanation: 'The total cost for a 10 km trip is R170',
          work: ''
        }
      ],
      answer: 'Equation: C = 15d + 20. For 10 km: R170',
      commonMistakes: [
        'Forgetting the base fare: C = 15d ❌',
        'Adding instead of multiplying: C = 15 + d + 20 ❌'
      ]
    },
    {
      id: 'example-2-table',
      difficulty: 'easy',
      title: 'Create a Table from Data',
      problem: 'A student saves R100 each month. Create a table for total savings after 0, 1, 2, 3, 4 months.',
      steps: [
        {
          step: 1,
          action: 'Understand the pattern',
          explanation: 'Saves R100 each month, starting with R0',
          work: ''
        },
        {
          step: 2,
          action: 'Calculate values',
          explanation: 'Month 0: R0, Month 1: R100, Month 2: R200, etc.',
          work: ''
        },
        {
          step: 3,
          action: 'Create table',
          explanation: '',
          work: 'Months | 0 | 1 | 2 | 3 | 4\nSavings (R) | 0 | 100 | 200 | 300 | 400'
        },
        {
          step: 4,
          action: 'Find the equation',
          explanation: 'S = 100m where m is months',
          work: ''
        }
      ],
      answer: 'Table shown above. Equation: S = 100m',
      commonMistakes: []
    },
    {
      id: 'example-3-quadratic',
      difficulty: 'medium',
      title: 'Quadratic Model: Projectile Motion',
      problem: 'A ball is thrown upward. Its height h (in meters) after t seconds is h(t) = -5t² + 20t + 2. What is the maximum height?',
      steps: [
        {
          step: 1,
          action: 'Identify the model',
          explanation: 'This is a quadratic function: h(t) = -5t² + 20t + 2',
          work: 'a = -5, b = 20, c = 2'
        },
        {
          step: 2,
          action: 'Find when maximum occurs',
          explanation: 'For a parabola, maximum is at the vertex',
          work: 't = -b / (2a) = -20 / (2 × -5) = -20 / -10 = 2'
        },
        {
          step: 3,
          action: 'Find the maximum height',
          explanation: 'Substitute t = 2 into h(t)',
          work: 'h(2) = -5(2)² + 20(2) + 2 = -20 + 40 + 2 = 22'
        },
        {
          step: 4,
          action: 'Interpret the answer',
          explanation: 'The ball reaches its maximum height of 22 meters at t = 2 seconds',
          work: ''
        }
      ],
      answer: 'Maximum height is 22 meters at t = 2 seconds',
      commonMistakes: [
        'Only finding t = 2 and forgetting to calculate h(2) ❌',
        'Using the wrong vertex formula'
      ]
    },
    {
      id: 'example-4-break-even',
      difficulty: 'medium',
      title: 'Break-Even Point: Business Model',
      problem: 'A company makes widgets. Fixed cost = R500. Each widget costs R2 to make and sells for R5. Find the break-even point (how many widgets to break even).',
      steps: [
        {
          step: 1,
          action: 'Define variables and equations',
          explanation: 'Let x = number of widgets. Total Cost = 500 + 2x. Revenue = 5x',
          work: ''
        },
        {
          step: 2,
          action: 'Set up break-even equation',
          explanation: 'At break-even: Revenue = Cost',
          work: '5x = 500 + 2x'
        },
        {
          step: 3,
          action: 'Solve for x',
          explanation: '',
          work: '5x - 2x = 500, 3x = 500, x = 166.67'
        },
        {
          step: 4,
          action: 'Interpret',
          explanation: 'Must sell at least 167 widgets to break even (can\'t sell partial widgets)',
          work: 'Round up to 167 widgets'
        },
        {
          step: 5,
          action: 'Check',
          explanation: 'At 167 widgets: Cost = 500 + 2(167) = 834, Revenue = 5(167) = 835 ✓',
          work: ''
        }
      ],
      answer: 'Break-even point: 167 widgets',
      commonMistakes: [
        'Forgetting the fixed cost: x = 500 / 3 ❌',
        'Not rounding up: 166.67 widgets is not practical'
      ]
    },
    {
      id: 'example-5-interpret-graph',
      difficulty: 'medium',
      title: 'Interpret a Real-World Graph',
      problem: 'A graph shows temperature (°C) vs time (hours) during a day. The line goes from (6, 10) at 6 AM to (18, 28) at 6 PM. Interpret the slope.',
      steps: [
        {
          step: 1,
          action: 'Calculate the slope',
          explanation: 'm = (28 - 10) / (18 - 6) = 18 / 12 = 1.5',
          work: ''
        },
        {
          step: 2,
          action: 'Interpret in context',
          explanation: 'The slope means the temperature increases 1.5°C per hour',
          work: ''
        },
        {
          step: 3,
          action: 'Interpret x-intercept if it existed',
          explanation: 'Where the line crosses the x-axis would indicate when temp = 0°C',
          work: ''
        }
      ],
      answer: 'Temperature increases at a rate of 1.5°C per hour',
      commonMistakes: []
    },
    {
      id: 'example-6-complex',
      difficulty: 'hard',
      title: 'Multi-Step Modelling: Population Growth',
      problem: 'A city has 100,000 people. The population grows by 5% each year. Write an equation for population P(t) after t years. Find population after 10 years.',
      steps: [
        {
          step: 1,
          action: 'Identify the growth type',
          explanation: '5% growth each year is exponential (not linear)',
          work: 'But let\'s work with what we know: P(t) = P₀ × (1 + r)^t'
        },
        {
          step: 2,
          action: 'Identify values',
          explanation: 'P₀ = 100,000 (starting), r = 0.05 (5%)',
          work: ''
        },
        {
          step: 3,
          action: 'Write equation',
          explanation: '',
          work: 'P(t) = 100,000 × (1.05)^t'
        },
        {
          step: 4,
          action: 'Calculate P(10)',
          explanation: 'P(10) = 100,000 × (1.05)^10',
          work: 'P(10) = 100,000 × 1.629 ≈ 162,889'
        },
        {
          step: 5,
          action: 'Interpret',
          explanation: 'After 10 years, the population is approximately 162,889 people',
          work: ''
        }
      ],
      answer: 'Equation: P(t) = 100,000 × (1.05)^t. After 10 years: ≈162,889 people',
      commonMistakes: [
        'Using linear model instead of exponential',
        'Rounding errors in calculations'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'A recipe uses 2 cups flour per 3 eggs. If using 12 eggs, how many cups of flour?',
      correctAnswers: ['8', '8 cups'],
      explanation: '12 ÷ 3 = 4 groups, 4 × 2 = 8 cups'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'A car travels 300 km in 5 hours. What is the average speed?',
      options: ['60 km/h', '50 km/h', '100 km/h', '30 km/h'],
      correctAnswer: '60 km/h',
      explanation: '300 ÷ 5 = 60'
    },
    {
      id: 'practice-3',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Ice cream costs R20 per scoop. Write equation for total cost C for s scoops.',
      correctAnswers: ['C = 20s'],
      explanation: ''
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'A store has initial stock of 500 items, sells 50 per day. After how many days is stock empty?',
      options: ['5 days', '10 days', '50 days', '100 days'],
      correctAnswer: '10 days',
      explanation: '500 ÷ 50 = 10'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Garden area = length × width. If length = 2x and width = x, write equation for area A.',
      correctAnswers: ['A = 2x²', 'A = 2x^2'],
      explanation: 'A = 2x × x = 2x²'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'At the break-even point, what is true?',
      options: ['Revenue > Cost', 'Revenue = Cost', 'Revenue < Cost', 'Profit is maximum'],
      correctAnswer: 'Revenue = Cost',
      explanation: ''
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'A phone plan: R100 base + R5 per minute. Cost C for m minutes?',
      correctAnswers: ['C = 100 + 5m'],
      explanation: ''
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Graph shows distance vs time (straight line from origin). What does this represent?',
      options: ['Constant speed', 'Acceleration', 'Stopping', 'Reverse motion'],
      correctAnswer: 'Constant speed',
      explanation: 'Straight line means constant rate (no acceleration)'
    },
    {
      id: 'practice-9',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'A ball height: h = -5t² + 30t + 1. When does it hit ground (h = 0)? (approximate)',
      correctAnswers: ['6', 't ≈ 6'],
      explanation: '-5t² + 30t + 1 = 0, solve using quadratic formula'
    },
    {
      id: 'practice-10',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Temperature increases 2°C per hour. Started at 15°C. Equation T = ?',
      options: ['T = 15t', 'T = 2t + 15', 'T = 15t + 2', 'T = 15 + 2'],
      correctAnswer: 'T = 2t + 15',
      explanation: 'Slope m = 2, starting temp (y-intercept) = 15'
    }
  ],

  topicQuiz: {
    id: 'mathematical-modelling-quiz',
    title: 'Mathematical Modelling Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'First step in modelling: ___________ the problem',
        correctAnswers: ['Identify', 'understand'],
        explanation: ''
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'Which model fits: "grows by 10% each year"?',
        options: ['Linear', 'Quadratic', 'Exponential', 'Constant'],
        correctAnswer: 'Exponential',
        explanation: ''
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'At break-even: Revenue ____ Cost',
        correctAnswers: ['equals', '='],
        explanation: ''
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'Slope of a line represents:',
        options: ['Starting value', 'Rate of change', 'Total amount', 'Time'],
        correctAnswer: 'Rate of change',
        explanation: ''
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: 'A taxi costs R50 base + R10/km. Equation for cost C and distance d?',
        correctAnswers: ['C = 10d + 50'],
        explanation: ''
      },
      {
        id: 'quiz-6',
        type: 'multiple-choice',
        question: 'Model for area of rectangle if length = 3x and width = x?',
        options: ['A = 3x', 'A = 4x', 'A = 3x²', 'A = x²'],
        correctAnswer: 'A = 3x²',
        explanation: ''
      },
      {
        id: 'quiz-7',
        type: 'fill-blank',
        question: 'y-intercept represents the __________ value',
        correctAnswers: ['initial', 'starting'],
        explanation: ''
      },
      {
        id: 'quiz-8',
        type: 'multiple-choice',
        question: 'Max/min of quadratic happens at:',
        options: ['x-intercept', 'vertex', 'y-intercept', 'slope'],
        correctAnswer: 'vertex',
        explanation: ''
      },
      {
        id: 'quiz-9',
        type: 'fill-blank',
        question: 'A stock starts at 1000 units, loses 50/day. Equation S = ?',
        correctAnswers: ['S = 1000 - 50d'],
        explanation: ''
      },
      {
        id: 'quiz-10',
        type: 'multiple-choice',
        question: 'What does interpreting solutions mean?',
        options: ['Solving the equation', 'Explaining what answer means in context', 'Drawing a graph', 'Finding the slope'],
        correctAnswer: 'Explaining what answer means in context',
        explanation: ''
      }
    ]
  },

  practiceExam: {
    id: 'grade-10-mathematical-modelling-exam',
    title: 'Mathematical Modelling Practice Exam',
    timeLimit: 5400,
    totalMarks: 100,
    questions: [
      {
        id: 'exam-1',
        marks: 3,
        type: 'fill-blank',
        question: 'A phone plan costs R120 base + R0.50 per SMS. Equation for cost C and n messages?',
        correctAnswers: ['C = 120 + 0.5n', 'C = 0.5n + 120'],
        explanation: ''
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'multiple-choice',
        question: 'A recipe: 2 cups flour for 5 eggs. For 20 eggs, need ___ cups flour',
        options: ['8', '10', '12', '16'],
        correctAnswer: '8',
        explanation: '20 ÷ 5 = 4, then 4 × 2 = 8'
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'fill-blank',
        question: 'Temperature rises 1.5°C per hour from initial 12°C. Equation T = ?',
        correctAnswers: ['T = 1.5t + 12', 'T = 12 + 1.5t'],
        explanation: ''
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'fill-blank',
        question: 'Cost to produce = R1000 + R8 per item. Sells for R15 per item. Break-even at ___ items.',
        correctAnswers: ['143', '142-143'],
        explanation: '15x = 1000 + 8x, so 7x = 1000, x ≈ 142.86, round to 143'
      },
      {
        id: 'exam-5',
        marks: 3,
        type: 'multiple-choice',
        question: 'At break-even, profit is:',
        options: ['Positive', 'Negative', 'Zero', 'Maximum'],
        correctAnswer: 'Zero',
        explanation: ''
      },
      {
        id: 'exam-6',
        marks: 4,
        type: 'fill-blank',
        question: 'Savings: R200 first month, add R50/month. Total after 6 months?',
        correctAnswers: ['1750', 'R1750'],
        explanation: 'First month 200, then 250, 300, 350, 400, 450. Sum = 200 + 250 + ... + 450'
      },
      {
        id: 'exam-7',
        marks: 4,
        type: 'fill-blank',
        question: 'Rectangle area = length × width. If l = 2w, area A = ?',
        correctAnswers: ['A = 2w²'],
        explanation: 'A = 2w × w = 2w²'
      },
      {
        id: 'exam-8',
        marks: 4,
        type: 'multiple-choice',
        question: 'Ball height h(t) = -10t² + 40t. Maximum height at t = ?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '2',
        explanation: 't = -40 / (2 × -10) = 2'
      },
      {
        id: 'exam-9',
        marks: 5,
        type: 'fill-blank',
        question: 'Car travels 400 km using 50 liters fuel. Consumption rate = ___ km per liter',
        correctAnswers: ['8', '8 km/L'],
        explanation: '400 ÷ 50 = 8'
      },
      {
        id: 'exam-10',
        marks: 5,
        type: 'fill-blank',
        question: 'A store starts with 2000 items, sells 100/day, restocks 150/day. After 30 days, items = ?',
        correctAnswers: ['3500'],
        explanation: 'Net gain: 150 - 100 = 50/day. After 30 days: 2000 + 50(30) = 3500'
      }
    ]
  }
};
