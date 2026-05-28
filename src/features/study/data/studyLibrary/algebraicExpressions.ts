export const algebraicExpressions = {
  id: 'algebraic-expressions',
  title: 'Algebraic Expressions',
  description: 'Learn about exponents, expanding, and factoring expressions',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'Understanding Algebraic Expressions',
    content: `
      <h3>What Are Algebraic Expressions?</h3>
      <p>An algebraic expression is a mathematical phrase that contains variables (letters), numbers, and operations.</p>
      <p><strong>Examples:</strong> 2x + 3, 5y² - 2y + 1, 3(x + 2)</p>

      <h3>Laws of Exponents</h3>
      <p><strong>Multiplication Rule:</strong> a^m × a^n = a^(m+n)</p>
      <p>When multiplying powers with the same base, add the exponents.</p>
      <p><strong>Example:</strong> 2³ × 2² = 2^(3+2) = 2⁵ = 32</p>

      <p><strong>Division Rule:</strong> a^m ÷ a^n = a^(m-n)</p>
      <p>When dividing powers with the same base, subtract the exponents.</p>
      <p><strong>Example:</strong> 2⁵ ÷ 2² = 2^(5-2) = 2³ = 8</p>

      <p><strong>Power of a Power:</strong> (a^m)^n = a^(mn)</p>
      <p>When raising a power to another power, multiply the exponents.</p>
      <p><strong>Example:</strong> (2³)² = 2^(3×2) = 2⁶ = 64</p>

      <p><strong>Zero Exponent:</strong> a⁰ = 1 (when a ≠ 0)</p>
      <p>Any non-zero number raised to the power 0 equals 1.</p>
      <p><strong>Example:</strong> 5⁰ = 1</p>

      <p><strong>Negative Exponent:</strong> a^(-n) = 1/(a^n)</p>
      <p>A negative exponent means "take the reciprocal".</p>
      <p><strong>Example:</strong> 2^(-3) = 1/2³ = 1/8</p>

      <h3>Expanding Brackets</h3>
      <p>Expanding means multiplying out brackets.</p>
      <p><strong>Single Bracket:</strong> a(b + c) = ab + ac</p>
      <p><strong>Double Bracket:</strong> (a + b)(c + d) = ac + ad + bc + bd</p>

      <h3>Factorization</h3>
      <p>Factorization is the reverse of expanding. We find the common factors and write them outside brackets.</p>
      <p><strong>Common Factor:</strong> ab + ac = a(b + c)</p>
      <p><strong>Difference of Two Squares:</strong> a² - b² = (a + b)(a - b)</p>
      <p><strong>Trinomial:</strong> ax² + bx + c can often be factored into (px + q)(rx + s)</p>
    `
  },

  visualizations: [
    {
      id: 'exponent-blocks',
      type: 'svg-animation',
      title: 'Understanding Exponents Visually',
      description: 'See how exponents represent repeated multiplication',
      svgComponent: 'ExponentBlocksVisualization'
    },
    {
      id: 'expanding-brackets-tiles',
      type: 'svg-animation',
      title: 'Algebra Tiles - Expanding Brackets',
      description: 'Use algebra tiles to visualize (x + 2)(x + 3)',
      svgComponent: 'AlgebraTilesVisualization'
    },
    {
      id: 'factoring-tiles',
      type: 'svg-animation',
      title: 'Factorization with Tiles',
      description: 'Reverse the process to factor expressions',
      svgComponent: 'FactoringTilesVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-exponents',
      difficulty: 'easy',
      title: 'Simplify: 2³ × 2²',
      problem: '2³ × 2²',
      steps: [
        {
          step: 1,
          action: 'Identify the rule',
          explanation: 'When multiplying powers with the same base, use: a^m × a^n = a^(m+n)',
          work: ''
        },
        {
          step: 2,
          action: 'Apply the rule',
          explanation: 'Both terms have base 2. Add the exponents: 3 + 2 = 5',
          work: '2³ × 2² = 2^(3+2) = 2⁵'
        },
        {
          step: 3,
          action: 'Evaluate',
          explanation: '2⁵ means 2 × 2 × 2 × 2 × 2',
          work: '2⁵ = 32'
        }
      ],
      answer: '32',
      commonMistakes: [
        'Multiplying the exponents: 2^(3×2) = 2⁶ ❌ (Wrong!)',
        'Multiplying the bases: 4^5 ❌ (Wrong!)'
      ]
    },
    {
      id: 'example-2-exponents',
      difficulty: 'easy',
      title: 'Simplify: x⁶ ÷ x²',
      problem: 'x⁶ ÷ x²',
      steps: [
        {
          step: 1,
          action: 'Identify the rule',
          explanation: 'When dividing powers with the same base: a^m ÷ a^n = a^(m-n)',
          work: ''
        },
        {
          step: 2,
          action: 'Apply the rule',
          explanation: 'Both terms have base x. Subtract the exponents: 6 - 2 = 4',
          work: 'x⁶ ÷ x² = x^(6-2) = x⁴'
        }
      ],
      answer: 'x⁴',
      commonMistakes: [
        'Dividing the exponents: x³ ❌ (Wrong!)',
        'Subtracting the bases: Doesn\'t make sense ❌'
      ]
    },
    {
      id: 'example-3-expanding',
      difficulty: 'easy',
      title: 'Expand: 3(x + 4)',
      problem: 'Expand: 3(x + 4)',
      steps: [
        {
          step: 1,
          action: 'Multiply each term in brackets by 3',
          explanation: 'Use the distributive property: a(b + c) = ab + ac',
          work: ''
        },
        {
          step: 2,
          action: '3 × x and 3 × 4',
          explanation: 'Multiply 3 by both x and 4',
          work: '3 × x = 3x, and 3 × 4 = 12'
        },
        {
          step: 3,
          action: 'Write the answer',
          explanation: 'Combine the results',
          work: '3(x + 4) = 3x + 12'
        }
      ],
      answer: '3x + 12',
      commonMistakes: [
        'Only multiplying the first term: 3x + 4 ❌',
        'Forgetting to multiply by 3: x + 4 ❌'
      ]
    },
    {
      id: 'example-4-double-bracket',
      difficulty: 'medium',
      title: 'Expand: (x + 2)(x + 3)',
      problem: 'Expand: (x + 2)(x + 3)',
      steps: [
        {
          step: 1,
          action: 'Use FOIL or distribution',
          explanation: 'FOIL = First, Outer, Inner, Last',
          work: ''
        },
        {
          step: 2,
          action: 'First: x × x',
          explanation: 'Multiply the first term in each bracket',
          work: 'x × x = x²'
        },
        {
          step: 3,
          action: 'Outer: x × 3',
          explanation: 'Multiply the outer terms',
          work: 'x × 3 = 3x'
        },
        {
          step: 4,
          action: 'Inner: 2 × x',
          explanation: 'Multiply the inner terms',
          work: '2 × x = 2x'
        },
        {
          step: 5,
          action: 'Last: 2 × 3',
          explanation: 'Multiply the last term in each bracket',
          work: '2 × 3 = 6'
        },
        {
          step: 6,
          action: 'Combine like terms',
          explanation: 'Add the outer and inner terms: 3x + 2x = 5x',
          work: 'x² + 3x + 2x + 6 = x² + 5x + 6'
        }
      ],
      answer: 'x² + 5x + 6',
      commonMistakes: [
        'Forgetting the middle terms: x² + 6 ❌',
        'Wrong signs when expanding: x² - 5x + 6 ❌'
      ]
    },
    {
      id: 'example-5-factoring',
      difficulty: 'medium',
      title: 'Factorize: x² + 5x + 6',
      problem: 'Factorize: x² + 5x + 6',
      steps: [
        {
          step: 1,
          action: 'Look for factors',
          explanation: 'We need two numbers that multiply to 6 and add to 5',
          work: '2 × 3 = 6 and 2 + 3 = 5 ✓'
        },
        {
          step: 2,
          action: 'Write as two brackets',
          explanation: 'Use the pattern (x + a)(x + b) where a + b = 5 and ab = 6',
          work: '(x + 2)(x + 3)'
        },
        {
          step: 3,
          action: 'Verify by expanding',
          explanation: 'Check: (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6 ✓',
          work: ''
        }
      ],
      answer: '(x + 2)(x + 3)',
      commonMistakes: [
        'Choosing wrong factors: (x + 1)(x + 6) would give x² + 7x + 6 ❌',
        'Forgetting to check the middle term'
      ]
    },
    {
      id: 'example-6-hard',
      difficulty: 'hard',
      title: 'Factorize: 2x² - 8x - 10',
      problem: 'Factorize: 2x² - 8x - 10',
      steps: [
        {
          step: 1,
          action: 'Find the greatest common factor (GCF)',
          explanation: 'All terms are divisible by 2: 2x², 8x, 10 all have factor 2',
          work: '2x² - 8x - 10 = 2(x² - 4x - 5)'
        },
        {
          step: 2,
          action: 'Factorize the remaining trinomial',
          explanation: 'Find two numbers that multiply to -5 and add to -4',
          work: '-5 × 1 = -5 and -5 + 1 = -4 ✓'
        },
        {
          step: 3,
          action: 'Write as two brackets',
          explanation: '',
          work: 'x² - 4x - 5 = (x - 5)(x + 1)'
        },
        {
          step: 4,
          action: 'Write the complete factorization',
          explanation: '',
          work: '2x² - 8x - 10 = 2(x - 5)(x + 1)'
        }
      ],
      answer: '2(x - 5)(x + 1)',
      commonMistakes: [
        'Forgetting to factor out the 2: (x - 5)(x + 1) ❌',
        'Wrong factors of -5'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Simplify: 3² × 3³',
      options: ['3⁶', '3⁵', '9⁵', '6⁵'],
      correctAnswer: '3⁵',
      explanation: 'Using the multiplication rule a^m × a^n = a^(m+n): 3² × 3³ = 3^(2+3) = 3⁵ = 243'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is 4⁰?',
      options: ['0', '1', '4', 'undefined'],
      correctAnswer: '1',
      explanation: 'Any non-zero number raised to the power 0 equals 1.'
    },
    {
      id: 'practice-3',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Expand: 5(x - 2) = ?',
      correctAnswers: ['5x - 10', '5x-10'],
      explanation: 'Distribute 5 to both terms: 5 × x = 5x and 5 × (-2) = -10'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Expand: (x + 1)(x + 2) = ?',
      options: ['x² + 3x + 2', 'x² + 2x + 2', 'x² + 2x + 1', 'x² + 3x + 1'],
      correctAnswer: 'x² + 3x + 2',
      explanation: 'Using FOIL: x² + 2x + x + 2 = x² + 3x + 2'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Factorize: x² + 7x + 12 = ?',
      correctAnswers: ['(x + 3)(x + 4)', '(x+3)(x+4)'],
      explanation: 'Find two numbers that multiply to 12 and add to 7: 3 × 4 = 12 and 3 + 4 = 7'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Simplify: (2x)³',
      options: ['2x³', '6x', '8x³', '2x⁶'],
      correctAnswer: '8x³',
      explanation: '(2x)³ = 2³ × x³ = 8x³'
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Factorize: x² - 9 = ?',
      correctAnswers: ['(x + 3)(x - 3)', '(x+3)(x-3)'],
      explanation: 'This is the difference of two squares: a² - b² = (a + b)(a - b). Here x² - 9 = x² - 3² = (x + 3)(x - 3)'
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Simplify: a⁵ ÷ a²',
      options: ['a³', 'a⁷', 'a^(5/2)', 'a^(10)'],
      correctAnswer: 'a³',
      explanation: 'Using the division rule a^m ÷ a^n = a^(m-n): a⁵ ÷ a² = a^(5-2) = a³'
    },
    {
      id: 'practice-9',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'Expand and simplify: (2x + 1)(3x - 2) = ?',
      correctAnswers: ['6x² - 4x + 3x - 2 = 6x² - x - 2', '6x² - x - 2'],
      explanation: 'FOIL: First (6x²) + Outer (-4x) + Inner (3x) + Last (-2) = 6x² - x - 2'
    },
    {
      id: 'practice-10',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Factorize: 3x² - 12x + 12',
      options: ['3(x - 2)²', '(3x - 4)(x - 3)', '3(x - 2)(x - 2)', '(x - 2)(x - 6)'],
      correctAnswer: '3(x - 2)²',
      explanation: 'First factor out 3: 3(x² - 4x + 4). Then recognize x² - 4x + 4 = (x - 2)²'
    }
  ],

  topicQuiz: {
    id: 'algebraic-expressions-quiz',
    title: 'Algebraic Expressions Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Simplify: 2^4 × 2^3',
        options: ['2^7', '2^12', '4^7', '8'],
        correctAnswer: '2^7',
        explanation: 'Add exponents: 4 + 3 = 7'
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'What does a negative exponent mean?',
        options: ['Subtract from another number', 'Take the reciprocal', 'Make the answer negative', 'Divide by the base'],
        correctAnswer: 'Take the reciprocal',
        explanation: 'a^(-n) = 1/(a^n)'
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'Expand: 2(x + 3)',
        correctAnswers: ['2x + 6', '2x+6'],
        explanation: ''
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'Expand: (x - 3)(x + 2)',
        options: ['x² - x - 6', 'x² + x - 6', 'x² - 5x - 6', 'x² - x + 6'],
        correctAnswer: 'x² - x - 6',
        explanation: 'FOIL: x² + 2x - 3x - 6 = x² - x - 6'
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: 'Factorize: x² - 5x + 6',
        correctAnswers: ['(x - 2)(x - 3)', '(x-2)(x-3)'],
        explanation: ''
      },
      {
        id: 'quiz-6',
        type: 'multiple-choice',
        question: 'Simplify: (x²)³',
        options: ['x⁶', 'x⁵', 'x²', 'x⁹'],
        correctAnswer: 'x⁶',
        explanation: 'Multiply exponents: 2 × 3 = 6'
      },
      {
        id: 'quiz-7',
        type: 'fill-blank',
        question: 'What is 5⁰?',
        correctAnswers: ['1'],
        explanation: ''
      },
      {
        id: 'quiz-8',
        type: 'multiple-choice',
        question: 'Factorize: 4x² - 1',
        options: ['(2x - 1)(2x + 1)', '(2x - 1)²', '(4x - 1)(x + 1)', '4(x - 1)(x + 1)'],
        correctAnswer: '(2x - 1)(2x + 1)',
        explanation: 'Difference of two squares: (2x)² - 1² = (2x - 1)(2x + 1)'
      },
      {
        id: 'quiz-9',
        type: 'multiple-choice',
        question: 'Which expression equals (a + b)²?',
        options: ['a² + b²', 'a² + 2ab + b²', 'a² + ab + b²', 'a + 2b'],
        correctAnswer: 'a² + 2ab + b²',
        explanation: '(a + b)² = (a + b)(a + b) = a² + ab + ab + b² = a² + 2ab + b²'
      },
      {
        id: 'quiz-10',
        type: 'fill-blank',
        question: 'Simplify: 2x⁵ ÷ x²',
        correctAnswers: ['2x³', '2x^3'],
        explanation: ''
      }
    ]
  },

  practiceExam: {
    id: 'grade-10-term1-exam',
    title: 'Grade 10 Term 1 Mathematics Practice Exam',
    timeLimit: 5400,
    totalMarks: 100,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'multiple-choice',
        question: 'Simplify: 3⁵ ÷ 3²',
        options: ['3³', '3⁷', '3^(10)', '9'],
        correctAnswer: '3³',
        explanation: 'a^m ÷ a^n = a^(m-n) → 3⁵ ÷ 3² = 3³ = 27'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'fill-blank',
        question: 'Expand: 3(2x - 5)',
        correctAnswers: ['6x - 15', '6x-15'],
        explanation: 'Distribute 3 to both terms'
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'fill-blank',
        question: 'Expand and simplify: (x + 4)(x + 2)',
        correctAnswers: ['x² + 6x + 8', 'x^2+6x+8'],
        explanation: 'FOIL: x² + 2x + 4x + 8 = x² + 6x + 8'
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'fill-blank',
        question: 'Factorize: x² + 8x + 15',
        correctAnswers: ['(x + 3)(x + 5)', '(x+3)(x+5)'],
        explanation: 'Find factors of 15 that add to 8: 3 and 5'
      },
      {
        id: 'exam-5',
        marks: 2,
        type: 'multiple-choice',
        question: 'What is 10⁰?',
        options: ['0', '1', '10', 'undefined'],
        correctAnswer: '1',
        explanation: 'Any non-zero number to the power 0 = 1'
      },
      {
        id: 'exam-6',
        marks: 3,
        type: 'multiple-choice',
        question: 'Simplify: (2a)² × 3a',
        options: ['6a³', '12a³', '6a²', '12a²'],
        correctAnswer: '12a³',
        explanation: '(2a)² = 4a². Then 4a² × 3a = 12a³'
      },
      {
        id: 'exam-7',
        marks: 3,
        type: 'fill-blank',
        question: 'Factorize: 9x² - 4',
        correctAnswers: ['(3x - 2)(3x + 2)', '(3x-2)(3x+2)'],
        explanation: 'Difference of two squares: (3x)² - 2² = (3x - 2)(3x + 2)'
      },
      {
        id: 'exam-8',
        marks: 4,
        type: 'fill-blank',
        question: 'Factorize completely: 2x² + 8x + 8',
        correctAnswers: ['2(x + 2)²', '2(x+2)^2', '2(x+2)(x+2)'],
        explanation: 'Factor out 2 first, then recognize perfect square'
      },
      {
        id: 'exam-9',
        marks: 3,
        type: 'multiple-choice',
        question: 'Simplify: x⁷ ÷ x⁴ × x²',
        options: ['x⁵', 'x²', 'x⁹', 'x³'],
        correctAnswer: 'x⁵',
        explanation: 'x⁷ ÷ x⁴ = x³. Then x³ × x² = x⁵'
      },
      {
        id: 'exam-10',
        marks: 5,
        type: 'fill-blank',
        question: 'A square has sides of length (x + 3) units. Write the area as an expanded expression.',
        correctAnswers: ['x² + 6x + 9', 'x^2+6x+9'],
        explanation: 'Area = (x + 3)² = (x + 3)(x + 3) = x² + 6x + 9'
      }
    ]
  }
};
