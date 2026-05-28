export const introductionToAccounting = {
  id: 'introduction-to-accounting',
  title: 'Introduction to Accounting',
  description: 'Understand the purpose, users, and basic principles of accounting',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'What is Accounting?',
    content: `
      <h3>Definition of Accounting</h3>
      <p><strong>Accounting:</strong> The process of recording, classifying, summarizing, and interpreting financial transactions of a business.</p>
      <p>In simple terms: <strong>Tracking money in and out, and explaining what happened to the business.</strong></p>

      <h3>Why Do We Need Accounting?</h3>
      <p><strong>1. Proving Honesty</strong></p>
      <ul>
        <li>Records prove where money came from and where it went</li>
        <li>Shows the owner (and tax authorities) that money is being used properly</li>
        <li>Prevents theft and fraud</li>
      </ul>

      <p><strong>2. Decision Making</strong></p>
      <ul>
        <li>Owner can see if business is profitable</li>
        <li>Know which products/services make the most money</li>
        <li>Decide if business should expand or cut costs</li>
      </ul>

      <p><strong>3. Legal Requirement</strong></p>
      <ul>
        <li>Law requires businesses to keep financial records</li>
        <li>Tax authorities need to know income and expenses</li>
        <li>Banks need accounting records to approve loans</li>
      </ul>

      <p><strong>4. Investor Confidence</strong></p>
      <ul>
        <li>People investing money want proof the business is healthy</li>
        <li>Financial statements show performance</li>
      </ul>

      <h3>Who Uses Accounting Information?</h3>

      <p><strong>Owners/Managers:</strong> Want to know profitability and cash position</p>
      <p><strong>Government (Tax Authorities):</strong> Need to know income for tax purposes</p>
      <p><strong>Banks/Lenders:</strong> Decide if business deserves a loan</p>
      <p><strong>Employees:</strong> Want assurance business can pay their salaries</p>
      <p><strong>Investors/Shareholders:</strong> Want to know if their investment is growing</p>
      <p><strong>Suppliers:</strong> Want to ensure business can pay for goods</p>

      <h3>Basic Accounting Principles</h3>

      <p><strong>1. Business Entity Concept</strong></p>
      <ul>
        <li>Business is separate from owner's personal finances</li>
        <li>Owner's private money and business money are kept apart</li>
        <li>Example: If owner has R1,000,000 personal savings, that's NOT business profit</li>
      </ul>

      <p><strong>2. Accrual vs Cash Basis</strong></p>
      <ul>
        <li>Record transactions when they happen, not when money changes hands</li>
        <li>Example: Invoice customer on Jan 15, but they pay on Feb 20 → Record on Jan 15 (accrual)</li>
      </ul>

      <p><strong>3. Consistency Principle</strong></p>
      <ul>
        <li>Use same accounting methods each year</li>
        <li>Allows comparison: "Is business doing better than last year?"</li>
      </ul>

      <p><strong>4. Going Concern</strong></p>
      <ul>
        <li>Assume business will continue operating</li>
        <li>Don't assume bankruptcy unless obvious</li>
      </ul>

      <h3>Financial Statements</h3>
      <p>Accounting produces three main reports:</p>
      <ul>
        <li><strong>Income Statement (P&L):</strong> Shows profit or loss over a period</li>
        <li><strong>Balance Sheet:</strong> Shows assets, liabilities, and equity on a specific date</li>
        <li><strong>Cash Flow Statement:</strong> Shows money in and out</li>
      </ul>

      <h3>Double Entry System</h3>
      <p><strong>Core Principle:</strong> Every transaction affects TWO accounts</p>
      <p>Example: Buy equipment for R5,000 cash</p>
      <ul>
        <li>Equipment increases by R5,000 (Asset increases)</li>
        <li>Cash decreases by R5,000 (Asset decreases)</li>
        <li>Total assets stay the same - just shifted from cash to equipment</li>
      </ul>
      <p>This keeps accounting balanced and prevents errors.</p>
    `
  },

  visualizations: [
    {
      id: 'why-accounting-matters',
      type: 'svg-animation',
      title: 'Why Accounting Matters',
      description: 'Real-world scenarios showing importance of accounting',
      svgComponent: 'WhyAccountingMattersVisualization'
    },
    {
      id: 'users-of-accounting',
      type: 'svg-animation',
      title: 'Who Uses Accounting Information',
      description: 'Different stakeholders and their interests',
      svgComponent: 'UsersOfAccountingVisualization'
    },
    {
      id: 'accounting-principles',
      type: 'svg-animation',
      title: 'Basic Accounting Principles',
      description: 'Core concepts that guide accounting practice',
      svgComponent: 'AccountingPrinciplesVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-purpose',
      difficulty: 'easy',
      title: 'Understanding Accounting Purpose',
      problem: 'A small shop owner wonders why they need to keep detailed accounts. What are three reasons?',
      steps: [
        {
          step: 1,
          action: 'Reason 1: Decision Making',
          explanation: 'Owner needs to know: Am I making profit? Which products sell best? Can I expand?',
          work: 'Records allow informed business decisions'
        },
        {
          step: 2,
          action: 'Reason 2: Legal/Tax',
          explanation: 'Government requires records for tax purposes',
          work: 'Proves honesty to authorities'
        },
        {
          step: 3,
          action: 'Reason 3: Lender Requirements',
          explanation: 'If owner wants a loan, bank needs proof of profitability',
          work: 'Financial statements convince lenders'
        }
      ],
      answer: 'Decision-making, legal compliance, lender confidence',
      commonMistakes: []
    },
    {
      id: 'example-2-business-entity',
      difficulty: 'easy',
      title: 'Business Entity Concept',
      problem: 'A owner has R500,000 in personal savings and a business with R100,000 cash. What is the business worth?',
      steps: [
        {
          step: 1,
          action: 'Separate personal from business',
          explanation: 'Personal savings (R500,000) and business money (R100,000) are different',
          work: 'Only business cash = R100,000'
        },
        {
          step: 2,
          action: 'Apply business entity concept',
          explanation: "Business accounting ignores owner's personal wealth",
          work: "Business value ≠ Owner's total wealth"
        }
      ],
      answer: 'The business is worth R100,000 in cash (ignoring personal savings)',
      commonMistakes: [
        'Including personal savings in business value'
      ]
    },
    {
      id: 'example-3-users',
      difficulty: 'easy',
      title: 'Identifying Accounting Users',
      problem: 'List who needs accounting information from a restaurant and why.',
      steps: [
        {
          step: 1,
          action: 'Owner',
          explanation: 'Needs to know if restaurant is profitable',
          work: 'Decision-making'
        },
        {
          step: 2,
          action: 'Tax authorities',
          explanation: 'Need to verify income for tax purposes',
          work: 'Legal requirement'
        },
        {
          step: 3,
          action: 'Bank (if taking loan)',
          explanation: 'Needs to know if restaurant can repay loan',
          work: 'Lending decision'
        },
        {
          step: 4,
          action: 'Employees',
          explanation: 'Want assurance restaurant can pay salaries',
          work: 'Job security'
        }
      ],
      answer: 'Owner (decisions), Tax authorities (compliance), Bank (loan approval), Employees (payment assurance)',
      commonMistakes: []
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is the main purpose of accounting?',
      options: [
        'To make businesses look good',
        'To track financial transactions and provide useful information for decision-making',
        'To avoid paying taxes',
        'To prove the business is better than competitors'
      ],
      correctAnswer: 'To track financial transactions and provide useful information for decision-making',
      explanation: 'Accounting records and summarizes financial data for informed decisions.'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Who needs accounting information from a business?',
      options: [
        'Only the owner',
        'Only government',
        'Owner, government, banks, employees, investors',
        'Nobody - its confidential'
      ],
      correctAnswer: 'Owner, government, banks, employees, investors',
      explanation: 'Many stakeholders depend on accounting information.'
    },
    {
      id: 'practice-3',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'The accounting principle that treats a business as separate from the owner\'s personal finances is called the ? concept.',
      correctAnswers: ['business entity', 'entity'],
      explanation: 'Business and personal finances must be kept apart.'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Why is the double entry system important?',
      options: [
        'To confuse people',
        'To ensure both sides of a transaction are recorded, maintaining balance',
        'To record transactions twice for safety',
        'To follow government rules'
      ],
      correctAnswer: 'To ensure both sides of a transaction are recorded, maintaining balance',
      explanation: 'Double entry keeps total assets balanced.'
    }
  ],

  topicQuiz: {
    id: 'introduction-accounting-quiz',
    title: 'Introduction to Accounting Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Accounting is defined as:',
        options: [
          'Counting money',
          'Recording and interpreting financial transactions',
          'Calculating taxes',
          'Predicting future profits'
        ],
        correctAnswer: 'Recording and interpreting financial transactions',
        explanation: 'This is the core definition of accounting.'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'The concept that treats business finances separately from owner\'s personal finances is called ?.',
        correctAnswers: ['business entity'],
        explanation: 'Fundamental principle of accounting.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Who would use accounting records to decide whether to lend money to a business?',
        options: ['Owner', 'Bank', 'Employee', 'Customer'],
        correctAnswer: 'Bank',
        explanation: 'Banks review financial statements before approving loans.'
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'The system where every transaction affects two accounts is called:',
        options: [
          'Single entry',
          'Double entry',
          'Dual accounting',
          'Balanced recording'
        ],
        correctAnswer: 'Double entry',
        explanation: 'The foundation of modern accounting.'
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: 'The three main financial statements are: Income Statement, ?, and Cash Flow Statement.',
        correctAnswers: ['Balance Sheet'],
        explanation: 'These three statements summarize financial performance.'
      }
    ]
  },

  practiceExam: {
    id: 'introduction-accounting-exam',
    title: 'Introduction to Accounting Practice Exam',
    timeLimit: 2400,
    totalMarks: 50,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'multiple-choice',
        question: 'What does accounting track?',
        options: [
          'Only expenses',
          'Only income',
          'All financial transactions of a business',
          'Personal wealth'
        ],
        correctAnswer: 'All financial transactions of a business',
        explanation: 'Accounting records both income and expenses.'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'fill-blank',
        question: 'List three users of accounting information.',
        correctAnswers: [
          'Owner, government, bank',
          'Owner, employees, investors, suppliers, government'
        ],
        explanation: 'Many stakeholders use accounting information.'
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'multiple-choice',
        question: 'Why is accounting a legal requirement for businesses?',
        options: [
          'To make owners happy',
          'To prove honesty and calculate taxes',
          'To impress customers',
          'To avoid competition'
        ],
        correctAnswer: 'To prove honesty and calculate taxes',
        explanation: 'Government requires financial records.'
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'fill-blank',
        question: 'Explain the business entity concept with an example.',
        correctAnswers: [
          'Business is separate from owner - business cash is not owner\'s personal money',
          'Business finances are separate from owner\'s personal finances'
        ],
        explanation: 'This keeps accounting clear and organized.'
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'multiple-choice',
        question: 'Why would a bank request accounting records before giving a business a loan?',
        options: [
          'To be difficult',
          'To assess if business is profitable and can repay the loan',
          'To steal business secrets',
          'Randomly, for no reason'
        ],
        correctAnswer: 'To assess if business is profitable and can repay the loan',
        explanation: 'Banks use financial statements to evaluate lending risk.'
      }
    ]
  }
};
