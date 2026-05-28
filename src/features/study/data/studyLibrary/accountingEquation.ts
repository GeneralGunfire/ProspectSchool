export const accountingEquation = {
  id: 'accounting-equation',
  title: 'The Accounting Equation',
  description: 'Master the fundamental equation: Assets = Equity + Liabilities',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'The Accounting Equation',
    content: `
      <h3>The Fundamental Equation</h3>
      <p><strong>Assets = Equity + Liabilities</strong></p>
      <p>Or rearranged: <strong>Assets = Owner's Equity + Liabilities</strong></p>

      <h3>Understanding Each Component</h3>

      <p><strong>ASSETS - What the business owns</strong></p>
      <ul>
        <li>Cash in bank</li>
        <li>Equipment</li>
        <li>Buildings</li>
        <li>Vehicles</li>
        <li>Accounts receivable (money customers owe)</li>
        <li>Inventory (products to sell)</li>
      </ul>
      <p>Assets represent VALUE that belongs to the business</p>

      <p><strong>LIABILITIES - What the business owes</strong></p>
      <ul>
        <li>Bank loans</li>
        <li>Accounts payable (money owed to suppliers)</li>
        <li>Mortgages (building loans)</li>
        <li>Salaries owed to employees</li>
        <li>Taxes owed to government</li>
      </ul>
      <p>Liabilities are DEBTS - obligations to pay others</p>

      <p><strong>EQUITY (Owner's Capital) - What belongs to the owner</strong></p>
      <ul>
        <li>Money owner invested in business</li>
        <li>Retained profits (profits not taken out)</li>
        <li>Owner's equity = Assets - Liabilities</li>
      </ul>
      <p>If business closes, assets after paying debts go to owner</p>

      <h3>Why Does The Equation Balance?</h3>
      <p><strong>Simple Logic:</strong></p>
      <p>Everything the business owns (Assets) came from two sources:</p>
      <ol>
        <li>Owner's investment (Equity)</li>
        <li>Borrowed money (Liabilities)</li>
      </ol>
      <p>Therefore: Assets = Equity + Liabilities always!</p>

      <h3>Example: Starting a Tutoring Business</h3>
      <p><strong>Day 1:</strong> Owner invests R10,000 cash</p>
      <ul>
        <li>Assets = R10,000 (cash)</li>
        <li>Liabilities = R0 (no debts)</li>
        <li>Equity = R10,000 (owner's investment)</li>
        <li>Equation: R10,000 = R10,000 + R0 ✓ Balances</li>
      </ul>

      <p><strong>Transaction 1:</strong> Buy computer for R2,000 cash</p>
      <ul>
        <li>Assets = R8,000 cash + R2,000 computer = R10,000</li>
        <li>Liabilities = R0</li>
        <li>Equity = R10,000</li>
        <li>Equation: R10,000 = R10,000 + R0 ✓ Still balances!</li>
      </ul>

      <p><strong>Transaction 2:</strong> Borrow R5,000 from bank</p>
      <ul>
        <li>Assets = R13,000 (R8,000 cash + R2,000 computer + R5,000 new cash)</li>
        <li>Liabilities = R5,000 (bank loan)</li>
        <li>Equity = R10,000</li>
        <li>Equation: R13,000 = R10,000 + R5,000 ✓ Still balances!</li>
      </ul>

      <p><strong>Key Point:</strong> Every transaction keeps equation balanced. Assets increase on one side, equity/liabilities increase on other side (or assets shift).</p>

      <h3>Asset Examples</h3>
      <ul>
        <li><strong>Current Assets</strong> (can turn to cash quickly): Cash, accounts receivable, inventory</li>
        <li><strong>Fixed Assets</strong> (long-term): Equipment, buildings, vehicles</li>
      </ul>

      <h3>Liability Examples</h3>
      <ul>
        <li><strong>Current Liabilities</strong> (due within 1 year): Accounts payable, short-term loans</li>
        <li><strong>Long-term Liabilities</strong> (due after 1 year): Mortgages, bonds</li>
      </ul>

      <h3>Why This Matters</h3>
      <p>The accounting equation shows:</p>
      <ul>
        <li>Business solvency (can it pay its debts?)</li>
        <li>Owner's net worth in the business</li>
        <li>How much of assets are financed by debt vs owner investment</li>
      </ul>
    `
  },

  visualizations: [
    {
      id: 'accounting-equation-balance',
      type: 'svg-animation',
      title: 'Balance Scale Visualization',
      description: 'See how the equation stays balanced like a scale',
      svgComponent: 'BalanceScaleVisualization'
    },
    {
      id: 'assets-liabilities-equity',
      type: 'svg-animation',
      title: 'Understanding A = L + E',
      description: 'Interactive breakdown of equation components',
      svgComponent: 'AssetsLiabilitiesEquityVisualization'
    },
    {
      id: 'equation-transactions',
      type: 'svg-animation',
      title: 'Transactions Keep Balance',
      description: 'Watch equation stay balanced as transactions occur',
      svgComponent: 'EquationTransactionsVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-basic',
      difficulty: 'easy',
      title: 'Simple Accounting Equation',
      problem: 'A business has R50,000 in assets and R20,000 in liabilities. What is the owner\'s equity?',
      steps: [
        {
          step: 1,
          action: 'Write the equation',
          explanation: 'Assets = Equity + Liabilities',
          work: 'R50,000 = Equity + R20,000'
        },
        {
          step: 2,
          action: 'Solve for Equity',
          explanation: 'Equity = Assets - Liabilities',
          work: 'Equity = R50,000 - R20,000'
        },
        {
          step: 3,
          action: 'Calculate',
          explanation: '',
          work: 'Equity = R30,000'
        }
      ],
      answer: 'Owner\'s Equity = R30,000',
      commonMistakes: [
        'Adding instead of subtracting: R50,000 + R20,000 ❌'
      ]
    },
    {
      id: 'example-2-starting-business',
      difficulty: 'easy',
      title: 'Starting Business Balance',
      problem: 'An owner invests R100,000 cash to start a business. Show the accounting equation.',
      steps: [
        {
          step: 1,
          action: 'Identify what\'s happening',
          explanation: 'Owner is putting cash into business - this is equity',
          work: 'Assets (cash) = R100,000, Equity = R100,000'
        },
        {
          step: 2,
          action: 'Identify liabilities',
          explanation: 'On first day, no debts yet',
          work: 'Liabilities = R0'
        },
        {
          step: 3,
          action: 'Apply equation',
          explanation: 'Assets = Equity + Liabilities',
          work: 'R100,000 = R100,000 + R0 ✓'
        }
      ],
      answer: 'Assets: R100,000 | Equity: R100,000 | Liabilities: R0',
      commonMistakes: []
    },
    {
      id: 'example-3-transaction',
      difficulty: 'medium',
      title: 'Transaction Changes Equation',
      problem: 'Business buys equipment for R25,000 cash. Equation was: A=R100,000, E=R100,000, L=R0. What is new equation?',
      steps: [
        {
          step: 1,
          action: 'Identify the transaction',
          explanation: 'Cash out R25,000, Equipment in R25,000 (both assets)',
          work: 'Assets shift internally'
        },
        {
          step: 2,
          action: 'Calculate new assets',
          explanation: 'Total assets stay same: R100,000 - R25,000 + R25,000 = R100,000',
          work: 'Assets = R75,000 cash + R25,000 equipment = R100,000'
        },
        {
          step: 3,
          action: 'Check liabilities and equity',
          explanation: 'No debts taken, no equity added/removed',
          work: 'Equity = R100,000, Liabilities = R0'
        },
        {
          step: 4,
          action: 'Verify balance',
          explanation: '',
          work: 'R100,000 = R100,000 + R0 ✓ Still balanced!'
        }
      ],
      answer: 'Assets: R100,000 (R75,000 cash + R25,000 equipment) | Equity: R100,000 | Liabilities: R0',
      commonMistakes: [
        'Thinking assets decreased - they just changed form'
      ]
    },
    {
      id: 'example-4-loan',
      difficulty: 'medium',
      title: 'Adding a Liability',
      problem: 'Business borrows R30,000 from bank. Previous: A=R100,000, E=R100,000, L=R0. New equation?',
      steps: [
        {
          step: 1,
          action: 'Identify transaction',
          explanation: 'Borrowing increases both assets (cash) and liabilities (debt)',
          work: 'Assets increase by R30,000, Liabilities increase by R30,000'
        },
        {
          step: 2,
          action: 'Calculate new assets',
          explanation: 'R100,000 + R30,000 new cash',
          work: 'Assets = R130,000'
        },
        {
          step: 3,
          action: 'Calculate new liabilities',
          explanation: 'R0 + R30,000 bank loan',
          work: 'Liabilities = R30,000'
        },
        {
          step: 4,
          action: 'Equity unchanged',
          explanation: 'Borrowing doesn\'t change owner\'s equity',
          work: 'Equity = R100,000'
        },
        {
          step: 5,
          action: 'Verify balance',
          explanation: '',
          work: 'R130,000 = R100,000 + R30,000 ✓ Balanced!'
        }
      ],
      answer: 'Assets: R130,000 | Equity: R100,000 | Liabilities: R30,000',
      commonMistakes: [
        'Thinking equity increases when borrowing - equity only increases from profits or additional owner investment'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'In the accounting equation A = E + L, what does A represent?',
      options: [
        'Accounts',
        'Assets',
        'Accruals',
        'Additions'
      ],
      correctAnswer: 'Assets',
      explanation: 'Assets are what the business owns.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Assets = ? + Liabilities',
      correctAnswers: ['Equity', "Owner's Equity"],
      explanation: 'Equity is what belongs to the owner.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which is an asset?',
      options: [
        'Bank loan',
        'Equipment',
        'Accounts payable',
        'Mortgage'
      ],
      correctAnswer: 'Equipment',
      explanation: 'Equipment is something the business owns.'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'If Assets = R200,000 and Liabilities = R50,000, what is Equity?',
      options: [
        'R150,000',
        'R250,000',
        'R100,000',
        'R50,000'
      ],
      correctAnswer: 'R150,000',
      explanation: 'Equity = Assets - Liabilities = R200,000 - R50,000 = R150,000'
    }
  ],

  topicQuiz: {
    id: 'accounting-equation-quiz',
    title: 'Accounting Equation Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'The fundamental accounting equation is: Assets = ? + Liabilities',
        correctAnswers: ['Equity', "Owner's Equity"],
        explanation: 'This is the foundation of double-entry accounting.'
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'What does equity represent?',
        options: [
          'Money owed to creditors',
          'What the business owns',
          "The owner's investment and retained profits",
          'The business\'s bank balance'
        ],
        correctAnswer: "The owner's investment and retained profits",
        explanation: 'Equity is the owner\'s stake in the business.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Assets = R80,000, Liabilities = R30,000. What is Equity?',
        options: [
          'R50,000',
          'R110,000',
          'R30,000',
          'R80,000'
        ],
        correctAnswer: 'R50,000',
        explanation: 'Equity = Assets - Liabilities.'
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'When a business borrows money, what happens to the equation?',
        options: [
          'Assets and Liabilities increase, Equity stays same',
          'All three increase',
          'Assets increase, Liabilities and Equity stay same',
          'Liabilities increase, Assets decrease'
        ],
        correctAnswer: 'Assets and Liabilities increase, Equity stays same',
        explanation: 'Borrowing increases both sides equally.'
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: 'If a business has R100,000 assets and R40,000 equity, liabilities are ?.',
        correctAnswers: ['R60,000'],
        explanation: 'Liabilities = Assets - Equity = R100,000 - R40,000.'
      }
    ]
  },

  practiceExam: {
    id: 'accounting-equation-exam',
    title: 'Accounting Equation Practice Exam',
    timeLimit: 2400,
    totalMarks: 50,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'fill-blank',
        question: 'Write the accounting equation.',
        correctAnswers: ['Assets = Equity + Liabilities', 'A = E + L'],
        explanation: 'This is the fundamental equation.'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'multiple-choice',
        question: 'A business has total assets of R150,000 and total liabilities of R60,000. What is the owner\'s equity?',
        options: [
          'R210,000',
          'R90,000',
          'R60,000',
          'R150,000'
        ],
        correctAnswer: 'R90,000',
        explanation: 'Equity = Assets - Liabilities.'
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'fill-blank',
        question: 'Owner invests R50,000 and the business has no debts. Assets = ?, Liabilities = ?, Equity = ?',
        correctAnswers: [
          'R50,000, R0, R50,000',
          'Assets = R50,000, Liabilities = R0, Equity = R50,000'
        ],
        explanation: 'Initial investment creates equal assets and equity.'
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'multiple-choice',
        question: 'Business borrows R20,000. Previous equation: A=R100,000, E=R100,000, L=R0. New equation is:',
        options: [
          'A=R100,000, E=R100,000, L=R20,000',
          'A=R120,000, E=R100,000, L=R20,000',
          'A=R120,000, E=R120,000, L=R0',
          'A=R80,000, E=R100,000, L=R20,000'
        ],
        correctAnswer: 'A=R120,000, E=R100,000, L=R20,000',
        explanation: 'Borrowing increases assets and liabilities equally.'
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'fill-blank',
        question: 'Explain why the accounting equation always balances.',
        correctAnswers: [
          'Everything the business owns came from owner investment or borrowed money',
          'Assets must equal the sources (equity and liabilities)'
        ],
        explanation: 'Fundamental logic of accounting.'
      }
    ]
  }
};
