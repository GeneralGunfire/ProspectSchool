export const functions = {
  id: 'functions',
  title: 'Functions',
  description: 'Understand functions, domains, ranges, linear and quadratic functions',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'Functions',
    content: `
      <h3>What Is a Function?</h3>
      <p>A function is a relationship between inputs and outputs where each input has exactly one output.</p>
      <p><strong>Notation:</strong> f(x) = ... reads as "f of x equals..."</p>
      <p><strong>Example:</strong> f(x) = 2x + 1</p>
      <p>If x = 3, then f(3) = 2(3) + 1 = 7</p>

      <h3>Domain and Range</h3>
      <p><strong>Domain:</strong> The set of all possible input values (x values)</p>
      <p><strong>Range:</strong> The set of all possible output values (y values)</p>
      <p><strong>Example:</strong> For f(x) = x + 2 where x = {1, 2, 3}</p>
      <p>Domain: {1, 2, 3}</p>
      <p>Range: {3, 4, 5}</p>

      <h3>Linear Functions</h3>
      <p><strong>Form:</strong> f(x) = mx + c or y = mx + c</p>
      <p><strong>m</strong> = slope (steepness)</p>
      <p><strong>c</strong> = y-intercept (where it crosses the y-axis)</p>
      <p><strong>Example:</strong> f(x) = 2x + 3</p>
      <p>Slope = 2, y-intercept = 3</p>

      <h3>Slope</h3>
      <p><strong>Formula:</strong> m = (y2 - y1) / (x2 - x1)</p>
      <p>Slope measures how steep the line is.</p>
      <p><strong>Positive slope:</strong> Line goes up from left to right</p>
      <p><strong>Negative slope:</strong> Line goes down from left to right</p>
      <p><strong>Zero slope:</strong> Horizontal line</p>

      <h3>x-intercept</h3>
      <p>Where the graph crosses the x-axis (where y = 0)</p>
      <p>Find by setting y = 0 and solving for x</p>

      <h3>y-intercept</h3>
      <p>Where the graph crosses the y-axis (where x = 0)</p>
      <p>For y = mx + c, the y-intercept is c</p>

      <h3>Quadratic Functions</h3>
      <p><strong>Form:</strong> f(x) = ax² + bx + c</p>
      <p><strong>Shape:</strong> Parabola (U-shaped or inverted)</p>
      <p>If a > 0: Opens upward (U-shape)</p>
      <p>If a < 0: Opens downward (∩-shape)</p>

      <h3>Turning Point (Vertex)</h3>
      <p>The lowest point (for U-shape) or highest point (for ∩-shape)</p>
      <p><strong>x-coordinate:</strong> x = -b / (2a)</p>

      <h3>Axis of Symmetry</h3>
      <p>A vertical line through the turning point</p>
      <p><strong>Equation:</strong> x = -b / (2a)</p>

      <h3>Function Notation</h3>
      <p>f(x) means "the value of the function f at x"</p>
      <p><strong>Example:</strong> If f(x) = x² + 2x, then f(3) = 9 + 6 = 15</p>
    `
  },

  visualizations: [
    {
      id: 'linear-function-interactive',
      type: 'interactive-graph',
      title: 'Linear Functions - Interactive Graph',
      description: 'Change m and c to see how the line changes. Observe slope and y-intercept.',
      svgComponent: 'LinearFunctionVisualization'
    },
    {
      id: 'quadratic-parabola',
      type: 'interactive-graph',
      title: 'Quadratic Functions - Parabolas',
      description: 'Adjust coefficients and see the parabola shape, vertex, and axis of symmetry',
      svgComponent: 'QuadraticFunctionVisualization'
    },
    {
      id: 'function-mapping',
      type: 'svg-animation',
      title: 'Function Mapping - Domain to Range',
      description: 'See how inputs map to outputs',
      svgComponent: 'FunctionMappingVisualization'
    },
    {
      id: 'slope-visualization',
      type: 'svg-animation',
      title: 'Slope - Rise Over Run',
      description: 'Visualize slope as rise over run',
      svgComponent: 'SlopeVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-evaluate',
      difficulty: 'easy',
      title: 'Evaluate f(x) = 2x + 5 at x = 3',
      problem: 'If f(x) = 2x + 5, find f(3)',
      steps: [
        {
          step: 1,
          action: 'Substitute x = 3',
          explanation: 'Replace x with 3 in the function',
          work: 'f(3) = 2(3) + 5'
        },
        {
          step: 2,
          action: 'Calculate',
          explanation: '',
          work: 'f(3) = 6 + 5 = 11'
        }
      ],
      answer: 'f(3) = 11',
      commonMistakes: []
    },
    {
      id: 'example-2-slope',
      difficulty: 'easy',
      title: 'Find the slope: Line passes through (1, 3) and (3, 7)',
      problem: 'Find m for points (1, 3) and (3, 7)',
      steps: [
        {
          step: 1,
          action: 'Use the slope formula',
          explanation: 'm = (y2 - y1) / (x2 - x1)',
          work: ''
        },
        {
          step: 2,
          action: 'Identify coordinates',
          explanation: '(x1, y1) = (1, 3) and (x2, y2) = (3, 7)',
          work: ''
        },
        {
          step: 3,
          action: 'Calculate',
          explanation: '',
          work: 'm = (7 - 3) / (3 - 1) = 4 / 2 = 2'
        }
      ],
      answer: 'm = 2',
      commonMistakes: []
    },
    {
      id: 'example-3-linear',
      difficulty: 'easy',
      title: 'Linear function: Find the equation of y = mx + c',
      problem: 'Find equation: passes through (0, 3) with slope m = 2',
      steps: [
        {
          step: 1,
          action: 'Identify m and c',
          explanation: 'The point (0, 3) means the y-intercept is c = 3. Slope is m = 2.',
          work: ''
        },
        {
          step: 2,
          action: 'Write the equation',
          explanation: 'y = mx + c',
          work: 'y = 2x + 3 or f(x) = 2x + 3'
        }
      ],
      answer: 'f(x) = 2x + 3',
      commonMistakes: []
    },
    {
      id: 'example-4-intercepts',
      difficulty: 'medium',
      title: 'Find intercepts: f(x) = 2x + 4',
      problem: 'Find x-intercept and y-intercept for f(x) = 2x + 4',
      steps: [
        {
          step: 1,
          action: 'Find y-intercept (set x = 0)',
          explanation: 'f(0) = 2(0) + 4 = 4',
          work: 'y-intercept = 4 (point: (0, 4))'
        },
        {
          step: 2,
          action: 'Find x-intercept (set y = 0)',
          explanation: '0 = 2x + 4',
          work: '-4 = 2x, so x = -2'
        },
        {
          step: 3,
          action: 'Write the intercepts',
          explanation: '',
          work: 'x-intercept: (-2, 0), y-intercept: (0, 4)'
        }
      ],
      answer: 'x-intercept: (-2, 0), y-intercept: (0, 4)',
      commonMistakes: []
    },
    {
      id: 'example-5-quadratic',
      difficulty: 'medium',
      title: 'Find turning point: f(x) = x² - 4x + 3',
      problem: 'Find the turning point (vertex) of f(x) = x² - 4x + 3',
      steps: [
        {
          step: 1,
          action: 'Identify a, b, c',
          explanation: 'a = 1, b = -4, c = 3',
          work: ''
        },
        {
          step: 2,
          action: 'Find x-coordinate of vertex',
          explanation: 'x = -b / (2a) = -(-4) / (2 × 1)',
          work: 'x = 4 / 2 = 2'
        },
        {
          step: 3,
          action: 'Find y-coordinate',
          explanation: 'Substitute x = 2 into the function',
          work: 'f(2) = (2)² - 4(2) + 3 = 4 - 8 + 3 = -1'
        },
        {
          step: 4,
          action: 'Write the turning point',
          explanation: '',
          work: 'Vertex: (2, -1)'
        }
      ],
      answer: 'Vertex: (2, -1)',
      commonMistakes: [
        'Forgetting to calculate the y-coordinate',
        'Sign error in the vertex formula'
      ]
    },
    {
      id: 'example-6-hard',
      difficulty: 'hard',
      title: 'Domain and Range: f(x) = x² with domain {-2, -1, 0, 1, 2}',
      problem: 'Find the range of f(x) = x² for domain {-2, -1, 0, 1, 2}',
      steps: [
        {
          step: 1,
          action: 'Evaluate f(x) for each x in the domain',
          explanation: '',
          work: 'f(-2) = 4, f(-1) = 1, f(0) = 0, f(1) = 1, f(2) = 4'
        },
        {
          step: 2,
          action: 'Collect all output values',
          explanation: 'Remove duplicates',
          work: 'Range: {0, 1, 4}'
        }
      ],
      answer: 'Range: {0, 1, 4}',
      commonMistakes: [
        'Forgetting to remove duplicate outputs',
        'Writing range as {4, 1, 0, 1, 4}'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'If f(x) = 3x + 2, find f(4)',
      correctAnswers: ['14', 'f(4) = 14'],
      explanation: 'f(4) = 3(4) + 2 = 12 + 2 = 14'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is the y-intercept of f(x) = 2x + 5?',
      options: ['2', '5', '7', '-5'],
      correctAnswer: '5',
      explanation: 'In y = mx + c, c is the y-intercept'
    },
    {
      id: 'practice-3',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Find the slope from (0, 1) to (2, 5)',
      correctAnswers: ['2', 'm = 2'],
      explanation: 'm = (5 - 1) / (2 - 0) = 4 / 2 = 2'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Find the x-intercept of y = 2x - 6',
      options: ['3', '-3', '-6', '2'],
      correctAnswer: '3',
      explanation: 'Set y = 0: 0 = 2x - 6, so x = 3'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Domain of f(x) = √x for x ≥ 0: all x ≥ 0 (Yes/No)',
      correctAnswers: ['Yes'],
      explanation: 'Square root requires non-negative x'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'What is the shape of f(x) = -x² + 2?',
      options: ['U-shape', '∩-shape', 'straight line', 'V-shape'],
      correctAnswer: '∩-shape',
      explanation: 'Coefficient of x² is negative'
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'For f(x) = x² - 6x + 8, find the x-value of the vertex',
      correctAnswers: ['3', 'x = 3'],
      explanation: 'x = -b/(2a) = -(-6)/(2×1) = 3'
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Write equation of line: slope -2, y-intercept 3',
      options: ['y = -2x + 3', 'y = 2x + 3', 'y = 3x - 2', 'y = -3x + 2'],
      correctAnswer: 'y = -2x + 3',
      explanation: 'y = mx + c with m = -2, c = 3'
    },
    {
      id: 'practice-9',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'Find the vertex of f(x) = x² - 4x + 5',
      correctAnswers: ['(2, 1)', '2, 1'],
      explanation: 'x = 2, f(2) = 4 - 8 + 5 = 1'
    },
    {
      id: 'practice-10',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Is f(x) = 2x² + 3x + 1 a function? (Check if each x gives one y)',
      options: ['Yes', 'No', 'Sometimes', 'Cannot determine'],
      correctAnswer: 'Yes',
      explanation: 'Every x value produces exactly one y value'
    }
  ],

  topicQuiz: {
    id: 'functions-quiz',
    title: 'Functions Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'If f(x) = 5x - 1, find f(2)',
        correctAnswers: ['9', 'f(2) = 9'],
        explanation: ''
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'What is a function?',
        options: ['Any equation', 'A relationship where each input has one output', 'A set of x values', 'A curved line'],
        correctAnswer: 'A relationship where each input has one output',
        explanation: ''
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'Find the y-intercept of y = -3x + 4',
        correctAnswers: ['4'],
        explanation: ''
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'What is the slope of the line through (1, 2) and (4, 8)?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '2',
        explanation: 'm = (8 - 2) / (4 - 1) = 6 / 3 = 2'
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: 'Find x-intercept of y = 3x - 9',
        correctAnswers: ['3', 'x = 3'],
        explanation: ''
      },
      {
        id: 'quiz-6',
        type: 'multiple-choice',
        question: 'For f(x) = -x² + 1, does it open upward or downward?',
        options: ['Upward', 'Downward', 'Sideways', 'Neither'],
        correctAnswer: 'Downward',
        explanation: 'Coefficient of x² is negative'
      },
      {
        id: 'quiz-7',
        type: 'fill-blank',
        question: 'Find the x-coordinate of the vertex: f(x) = x² + 2x - 3',
        correctAnswers: ['-1', 'x = -1'],
        explanation: ''
      },
      {
        id: 'quiz-8',
        type: 'multiple-choice',
        question: 'Domain is the set of ___',
        options: ['output values', 'input values', 'slopes', 'intercepts'],
        correctAnswer: 'input values',
        explanation: ''
      },
      {
        id: 'quiz-9',
        type: 'fill-blank',
        question: 'If f(x) = x², what is the range for domain {-3, -2, 0, 2, 3}?',
        correctAnswers: ['{0, 4, 9}', '{0,4,9}'],
        explanation: ''
      },
      {
        id: 'quiz-10',
        type: 'multiple-choice',
        question: 'Write the equation: slope 1/2, passes through (0, -1)',
        options: ['y = x/2 - 1', 'y = 2x - 1', 'y = x - 2', 'y = -x + 1'],
        correctAnswer: 'y = x/2 - 1',
        explanation: ''
      }
    ]
  },

  practiceExam: {
    id: 'grade-10-functions-exam',
    title: 'Functions Practice Exam',
    timeLimit: 5400,
    totalMarks: 100,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'fill-blank',
        question: 'If f(x) = 2x + 3, find f(5)',
        correctAnswers: ['13', 'f(5) = 13'],
        explanation: ''
      },
      {
        id: 'exam-2',
        marks: 2,
        type: 'multiple-choice',
        question: 'What is the y-intercept of y = -2x + 7?',
        options: ['-2', '7', '0', '-7'],
        correctAnswer: '7',
        explanation: ''
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'fill-blank',
        question: 'Find the slope between (2, 5) and (5, 11)',
        correctAnswers: ['2', 'm = 2'],
        explanation: 'm = (11 - 5) / (5 - 2) = 6 / 3 = 2'
      },
      {
        id: 'exam-4',
        marks: 3,
        type: 'fill-blank',
        question: 'Find x-intercept of y = 3x + 6',
        correctAnswers: ['-2', 'x = -2'],
        explanation: '0 = 3x + 6, so x = -2'
      },
      {
        id: 'exam-5',
        marks: 3,
        type: 'multiple-choice',
        question: 'What is the shape of f(x) = x² - 4?',
        options: ['∩-shape', 'U-shape', 'straight line', 'circle'],
        correctAnswer: 'U-shape',
        explanation: 'Coefficient of x² is positive'
      },
      {
        id: 'exam-6',
        marks: 4,
        type: 'fill-blank',
        question: 'Find the vertex of f(x) = (x - 2)² + 1',
        correctAnswers: ['(2, 1)', '2, 1'],
        explanation: 'Vertex form shows vertex directly at (2, 1)'
      },
      {
        id: 'exam-7',
        marks: 4,
        type: 'fill-blank',
        question: 'Write equation: slope 3, y-intercept -2',
        correctAnswers: ['y = 3x - 2', 'f(x) = 3x - 2'],
        explanation: ''
      },
      {
        id: 'exam-8',
        marks: 4,
        type: 'multiple-choice',
        question: 'For f(x) = x² - 6x + 8, find x-coordinate of vertex',
        options: ['2', '3', '4', '6'],
        correctAnswer: '3',
        explanation: 'x = -b/(2a) = 6/2 = 3'
      },
      {
        id: 'exam-9',
        marks: 5,
        type: 'fill-blank',
        question: 'Find the complete vertex: f(x) = x² - 4x + 3',
        correctAnswers: ['(2, -1)', '2, -1'],
        explanation: 'x = 2, f(2) = 4 - 8 + 3 = -1'
      },
      {
        id: 'exam-10',
        marks: 5,
        type: 'fill-blank',
        question: 'A function passes through (1, 3) and (3, 7). Write the linear equation.',
        correctAnswers: ['y = 2x + 1', 'f(x) = 2x + 1'],
        explanation: 'Slope m = 2, using point (1,3): 3 = 2(1) + c, so c = 1'
      }
    ]
  }
};
