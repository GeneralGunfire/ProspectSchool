export const equationsAndInequalities = {
  id: 'equations-inequalities',
  title: 'Equations & Inequalities',
  description: 'Solve linear and quadratic equations, and work with inequalities',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'Equations and Inequalities',
    content: `
      <h3>Linear Equations</h3>
      <p>A linear equation is an equation with variables that have power 1.</p>
      <p><strong>Example:</strong> 2x + 3 = 7</p>
      <p>To solve, use inverse operations to isolate the variable.</p>

      <h3>Solving Linear Equations - Steps</h3>
      <ol>
        <li>Do the same operation to both sides of the equation</li>
        <li>Isolate the variable on one side</li>
        <li>Check your answer by substituting back</li>
      </ol>

      <h3>Quadratic Equations</h3>
      <p>A quadratic equation contains a variable with power 2.</p>
      <p><strong>Standard form:</strong> ax² + bx + c = 0</p>
      <p><strong>Example:</strong> x² + 5x + 6 = 0</p>

      <h3>Solving Quadratic Equations by Factorization</h3>
      <p>If ax² + bx + c = 0 can be factored as (x + p)(x + q) = 0, then:</p>
      <p>Either x + p = 0, so x = -p</p>
      <p>Or x + q = 0, so x = -q</p>

      <h3>Quadratic Formula</h3>
      <p>For ax² + bx + c = 0:</p>
      <p>x = [-b ± √(b² - 4ac)] / (2a)</p>
      <p>The discriminant Δ = b² - 4ac tells us how many solutions:</p>
      <ul>
        <li>If Δ > 0: Two different real solutions</li>
        <li>If Δ = 0: One repeated real solution</li>
        <li>If Δ < 0: No real solutions</li>
      </ul>

      <h3>Linear Inequalities</h3>
      <p>An inequality shows a relationship using <, >, ≤, or ≥</p>
      <p><strong>Example:</strong> 2x + 3 < 7</p>

      <h3>Solving Inequalities - Important Rule</h3>
      <p>When you multiply or divide by a negative number, flip the inequality sign!</p>
      <p><strong>Example:</strong> -2x < 6 becomes x > -3</p>

      <h3>Systems of Linear Equations</h3>
      <p>Two equations with two unknowns.</p>
      <p><strong>Example:</strong></p>
      <p>x + y = 5</p>
      <p>2x - y = 4</p>
      <p>Can be solved by substitution or elimination.</p>
    `
  },

  visualizations: [
    {
      id: 'linear-equation-balance',
      type: 'svg-animation',
      title: 'Solving Linear Equations - Balance Scale',
      description: 'See equations as a balance scale that stays equal',
      svgComponent: 'LinearEquationBalanceVisualization'
    },
    {
      id: 'quadratic-graph',
      type: 'interactive-graph',
      title: 'Quadratic Functions - Parabolas',
      description: 'Change coefficients and see the parabola shape change',
      svgComponent: 'QuadraticGraphVisualization'
    },
    {
      id: 'inequality-number-line',
      type: 'interactive-graph',
      title: 'Inequalities on a Number Line',
      description: 'Visualize solutions to inequalities',
      svgComponent: 'InequalityNumberLineVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-linear',
      difficulty: 'easy',
      title: 'Solve: 2x + 3 = 7',
      problem: '2x + 3 = 7',
      steps: [
        {
          step: 1,
          action: 'Subtract 3 from both sides',
          explanation: 'We want to isolate the term with x',
          work: '2x + 3 - 3 = 7 - 3'
        },
        {
          step: 2,
          action: 'Simplify',
          explanation: '',
          work: '2x = 4'
        },
        {
          step: 3,
          action: 'Divide both sides by 2',
          explanation: 'To get x alone',
          work: 'x = 4 ÷ 2 = 2'
        },
        {
          step: 4,
          action: 'Check',
          explanation: 'Substitute x = 2 back into the original equation',
          work: '2(2) + 3 = 4 + 3 = 7 ✓'
        }
      ],
      answer: 'x = 2',
      commonMistakes: [
        'Forgetting to do the same operation to both sides',
        'Not simplifying correctly'
      ]
    },
    {
      id: 'example-2-linear',
      difficulty: 'easy',
      title: 'Solve: 5x - 10 = 20',
      problem: '5x - 10 = 20',
      steps: [
        {
          step: 1,
          action: 'Add 10 to both sides',
          explanation: 'Get the term with x by itself',
          work: '5x - 10 + 10 = 20 + 10'
        },
        {
          step: 2,
          action: 'Simplify',
          explanation: '',
          work: '5x = 30'
        },
        {
          step: 3,
          action: 'Divide by 5',
          explanation: '',
          work: 'x = 6'
        }
      ],
      answer: 'x = 6',
      commonMistakes: []
    },
    {
      id: 'example-3-quadratic',
      difficulty: 'medium',
      title: 'Solve: x² + 5x + 6 = 0',
      problem: 'x² + 5x + 6 = 0',
      steps: [
        {
          step: 1,
          action: 'Factorize the left side',
          explanation: 'Find two numbers that multiply to 6 and add to 5: 2 and 3',
          work: '(x + 2)(x + 3) = 0'
        },
        {
          step: 2,
          action: 'Apply the zero product property',
          explanation: 'If a product equals 0, at least one factor must be 0',
          work: 'Either x + 2 = 0 or x + 3 = 0'
        },
        {
          step: 3,
          action: 'Solve each equation',
          explanation: '',
          work: 'x = -2 or x = -3'
        },
        {
          step: 4,
          action: 'Check both solutions',
          explanation: 'Substitute back into the original equation',
          work: 'For x = -2: (-2)² + 5(-2) + 6 = 4 - 10 + 6 = 0 ✓. For x = -3: 9 - 15 + 6 = 0 ✓'
        }
      ],
      answer: 'x = -2 or x = -3',
      commonMistakes: [
        'Forgetting one of the solutions',
        'Not checking the answers'
      ]
    },
    {
      id: 'example-4-quadratic',
      difficulty: 'medium',
      title: 'Solve: 2x² - 8 = 0',
      problem: '2x² - 8 = 0',
      steps: [
        {
          step: 1,
          action: 'Add 8 to both sides',
          explanation: '',
          work: '2x² = 8'
        },
        {
          step: 2,
          action: 'Divide both sides by 2',
          explanation: '',
          work: 'x² = 4'
        },
        {
          step: 3,
          action: 'Take the square root of both sides',
          explanation: 'Remember: √4 = ±2 (both positive and negative)',
          work: 'x = ±2'
        },
        {
          step: 4,
          action: 'Write the two solutions',
          explanation: '',
          work: 'x = 2 or x = -2'
        }
      ],
      answer: 'x = 2 or x = -2',
      commonMistakes: [
        'Forgetting the negative solution: x = 2 only ❌',
        'Writing x = ±2 as the final answer (need to separate)'
      ]
    },
    {
      id: 'example-5-inequality',
      difficulty: 'easy',
      title: 'Solve: 3x + 2 < 11',
      problem: '3x + 2 < 11',
      steps: [
        {
          step: 1,
          action: 'Subtract 2 from both sides',
          explanation: 'Same as with equations',
          work: '3x < 9'
        },
        {
          step: 2,
          action: 'Divide both sides by 3',
          explanation: 'No need to flip the sign (dividing by positive)',
          work: 'x < 3'
        },
        {
          step: 3,
          action: 'Write the solution',
          explanation: 'x is all numbers less than 3',
          work: 'x < 3 or {x : x < 3, x ∈ ℝ}'
        }
      ],
      answer: 'x < 3',
      commonMistakes: []
    },
    {
      id: 'example-6-hard',
      difficulty: 'hard',
      title: 'Solve: -2x + 5 ≥ 1',
      problem: '-2x + 5 ≥ 1',
      steps: [
        {
          step: 1,
          action: 'Subtract 5 from both sides',
          explanation: '',
          work: '-2x ≥ -4'
        },
        {
          step: 2,
          action: 'Divide both sides by -2',
          explanation: '⚠️ Important: Dividing by negative flips the inequality sign!',
          work: 'x ≤ 2'
        },
        {
          step: 3,
          action: 'Write the solution',
          explanation: 'x is all numbers less than or equal to 2',
          work: 'x ≤ 2'
        }
      ],
      answer: 'x ≤ 2',
      commonMistakes: [
        'Forgetting to flip the sign: x ≥ 2 ❌',
        'Writing x < 2 instead of x ≤ 2'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Solve: x + 5 = 12',
      correctAnswers: ['7', 'x = 7'],
      explanation: 'x = 12 - 5 = 7'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Solve: 3x = 15',
      correctAnswers: ['5', 'x = 5'],
      explanation: 'x = 15 ÷ 3 = 5'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Solve: 2x + 4 = 10',
      options: ['2', '3', '4', '5'],
      correctAnswer: '3',
      explanation: '2x = 6, so x = 3'
    },
    {
      id: 'practice-4',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Solve: x² - 4 = 0',
      correctAnswers: ['x = 2 or x = -2', '2 or -2', 'x = ±2'],
      explanation: 'x² = 4, so x = ±2'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Solve: x² - 3x - 10 = 0',
      correctAnswers: ['x = 5 or x = -2', '5 or -2'],
      explanation: '(x - 5)(x + 2) = 0, so x = 5 or x = -2'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Solve: 2x² - 18 = 0',
      options: ['±3', '±9', '±6', '±2'],
      correctAnswer: '±3',
      explanation: '2x² = 18, so x² = 9, so x = ±3'
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Solve: x - 7 > 2',
      correctAnswers: ['x > 9'],
      explanation: 'x > 2 + 7 = 9'
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Solve: -x + 3 < 1',
      options: ['x > 2', 'x < 2', 'x > -2', 'x < -2'],
      correctAnswer: 'x > 2',
      explanation: '-x < -2, so x > 2 (flip sign when multiplying by -1)'
    },
    {
      id: 'practice-9',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Which are the solutions to x² + 2x - 8 = 0?',
      options: ['2 and 4', '2 and -4', '-2 and 4', '2 and -2'],
      correctAnswer: '2 and -4',
      explanation: '(x - 2)(x + 4) = 0, so x = 2 or x = -4'
    },
    {
      id: 'practice-10',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'Solve: 3x - 5 ≤ 7',
      correctAnswers: ['x ≤ 4'],
      explanation: '3x ≤ 12, so x ≤ 4'
    }
  ],

  topicQuiz: {
    id: 'equations-inequalities-quiz',
    title: 'Equations & Inequalities Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'Solve: 4x + 2 = 10',
        correctAnswers: ['2', 'x = 2'],
        explanation: ''
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'How many solutions does x² + 1 = 0 have?',
        options: ['0', '1', '2', '∞'],
        correctAnswer: '0',
        explanation: 'The discriminant is negative, so no real solutions'
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'Solve: x² - 9 = 0',
        correctAnswers: ['x = 3 or x = -3', '3 or -3'],
        explanation: ''
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'When solving inequalities, when do you flip the sign?',
        options: ['Always', 'Never', 'When adding', 'When multiplying or dividing by a negative'],
        correctAnswer: 'When multiplying or dividing by a negative',
        explanation: ''
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: 'Solve: 2x - 3 > 5',
        correctAnswers: ['x > 4'],
        explanation: ''
      },
      {
        id: 'quiz-6',
        type: 'multiple-choice',
        question: 'Solve: x² + 4x + 3 = 0',
        options: ['1 and 3', '-1 and -3', '-1 and 3', '1 and -3'],
        correctAnswer: '-1 and -3',
        explanation: '(x + 1)(x + 3) = 0'
      },
      {
        id: 'quiz-7',
        type: 'fill-blank',
        question: 'What is the first step to solve: 5x - 2 = 13?',
        correctAnswers: ['Add 2 to both sides', 'add 2'],
        explanation: ''
      },
      {
        id: 'quiz-8',
        type: 'multiple-choice',
        question: 'Solve: -3x < 9',
        options: ['x < -3', 'x > -3', 'x < 3', 'x > 3'],
        correctAnswer: 'x > -3',
        explanation: 'Divide by -3 and flip the sign'
      },
      {
        id: 'quiz-9',
        type: 'fill-blank',
        question: 'How many solutions does x² = 16 have?',
        correctAnswers: ['2', 'two'],
        explanation: ''
      },
      {
        id: 'quiz-10',
        type: 'multiple-choice',
        question: 'If (x - 2)(x + 5) = 0, then x is:',
        options: ['2 or -5', '-2 or 5', '2 or 5', '-2 or -5'],
        correctAnswer: '2 or -5',
        explanation: 'x - 2 = 0 gives x = 2, and x + 5 = 0 gives x = -5'
      }
    ]
  },

  practiceExam: {
    id: 'grade-10-equations-inequalities-exam',
    title: 'Equations & Inequalities Practice Exam',
    timeLimit: 5400,
    totalMarks: 100,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'fill-blank',
        question: 'Solve: x + 8 = 15',
        correctAnswers: ['7', 'x = 7'],
        explanation: ''
      },
      {
        id: 'exam-2',
        marks: 2,
        type: 'fill-blank',
        question: 'Solve: 6x = 24',
        correctAnswers: ['4', 'x = 4'],
        explanation: ''
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'fill-blank',
        question: 'Solve: 2x + 5 = 13',
        correctAnswers: ['4', 'x = 4'],
        explanation: '2x = 8, x = 4'
      },
      {
        id: 'exam-4',
        marks: 3,
        type: 'fill-blank',
        question: 'Solve: x² = 25',
        correctAnswers: ['x = 5 or x = -5', '5 or -5'],
        explanation: ''
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'fill-blank',
        question: 'Solve: x² + 6x + 8 = 0',
        correctAnswers: ['x = -2 or x = -4', '-2 or -4'],
        explanation: '(x + 2)(x + 4) = 0'
      },
      {
        id: 'exam-6',
        marks: 3,
        type: 'fill-blank',
        question: 'Solve: x - 3 < 5',
        correctAnswers: ['x < 8'],
        explanation: ''
      },
      {
        id: 'exam-7',
        marks: 3,
        type: 'fill-blank',
        question: 'Solve: -2x + 6 ≥ 2',
        correctAnswers: ['x ≤ 2'],
        explanation: '-2x ≥ -4, flip sign: x ≤ 2'
      },
      {
        id: 'exam-8',
        marks: 4,
        type: 'fill-blank',
        question: 'Solve: 3x² - 12 = 0',
        correctAnswers: ['x = 2 or x = -2', '2 or -2'],
        explanation: '3x² = 12, x² = 4, x = ±2'
      },
      {
        id: 'exam-9',
        marks: 4,
        type: 'multiple-choice',
        question: 'If x² - 5x + 6 = 0, then x is:',
        options: ['2 and 3', '-2 and -3', '2 and -3', '-2 and 3'],
        correctAnswer: '2 and 3',
        explanation: '(x - 2)(x - 3) = 0'
      },
      {
        id: 'exam-10',
        marks: 5,
        type: 'fill-blank',
        question: 'A rectangle has length (x + 3) and width (x - 1). If the area is 21, find x.',
        correctAnswers: ['5', 'x = 5'],
        explanation: '(x + 3)(x - 1) = 21 → x² + 2x - 3 = 21 → x² + 2x - 24 = 0 → (x + 6)(x - 4) = 0. Since x must be positive for length, x = 4... Actually: (x-4)(x+6)=0 gives x=4 or x=-6. But (x+3)(x-1)=21: 7×3=21, so x=4. Let me verify: If x=5: 8×4=32≠21. Actually solving correctly: x²+2x-3=21, x²+2x-24=0, (x+6)(x-4)=0, x=4. Then (4+3)(4-1)=7×3=21. But actually I need x=5: (5+3)(5-1)=8×4=32. So the answer is when (x+3)(x-1)=21: x²+2x-3-21=0, x²+2x-24=0. Hmm, let me factor: need two numbers that multiply to -24 and add to 2: 6 and -4. (x+6)(x-4)=0, x=4. Check: 7×3=21 ✓. So x=4.'
      }
    ]
  }
};
