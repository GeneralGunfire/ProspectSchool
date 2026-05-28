export const doubleEntrySystem = {
  id: 'double-entry-system',
  title: 'Double Entry System',
  description: 'Master debits, credits, and T-accounts for recording transactions',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'Understanding Double Entry',
    content: `
      <h3>The Core Rule: Every Transaction Affects TWO Accounts</h3>
      <p><strong>Why?</strong> To maintain the accounting equation: Assets = Equity + Liabilities</p>
      <p><strong>Example:</strong> Buy equipment for R5,000 cash</p>
      <ul>
        <li>Equipment increases (Asset increases)</li>
        <li>Cash decreases (Asset decreases)</li>
        <li>Total assets stay same - maintains equation</li>
      </ul>

      <h3>Debits and Credits</h3>
      <p><strong>DEBIT = LEFT side of T-account</strong></p>
      <p><strong>CREDIT = RIGHT side of T-account</strong></p>
      <p>But what increases on debit vs credit depends on ACCOUNT TYPE:</p>

      <p><strong>ASSETS (Cash, Equipment, etc.):</strong></p>
      <ul>
        <li>Debit (LEFT) = INCREASE ✓</li>
        <li>Credit (RIGHT) = DECREASE ✗</li>
      </ul>

      <p><strong>LIABILITIES (Bank loan, Accounts payable):</strong></p>
      <ul>
        <li>Debit (LEFT) = DECREASE ✗</li>
        <li>Credit (RIGHT) = INCREASE ✓</li>
      </ul>

      <p><strong>EQUITY (Owner's capital, retained earnings):</strong></p>
      <ul>
        <li>Debit (LEFT) = DECREASE ✗</li>
        <li>Credit (RIGHT) = INCREASE ✓</li>
      </ul>

      <p><strong>INCOME (Revenue, sales):</strong></p>
      <ul>
        <li>Debit (LEFT) = DECREASE ✗</li>
        <li>Credit (RIGHT) = INCREASE ✓</li>
      </ul>

      <p><strong>EXPENSES (Salary, rent, utilities):</strong></p>
      <ul>
        <li>Debit (LEFT) = INCREASE ✓</li>
        <li>Credit (RIGHT) = DECREASE ✗</li>
      </ul>

      <h3>T-Account Format</h3>
      <p>Accounts look like the letter "T":</p>
      <p style="text-align: center; font-family: monospace;">
      <strong>ACCOUNT NAME</strong><br>
      Debit | Credit<br>
      (Left) | (Right)
      </p>

      <h3>Double Entry Journal Entry</h3>
      <p><strong>Format:</strong></p>
      <p>Date | Account | Debit | Credit | Description</p>
      <p><strong>Rule:</strong> Total Debits must equal Total Credits (balances out)</p>

      <h3>Example Transaction: Buy Equipment for Cash</h3>
      <p>Business buys R3,000 equipment with cash</p>
      <ul>
        <li>Equipment (Asset) increases → DEBIT (left)</li>
        <li>Cash (Asset) decreases → CREDIT (right)</li>
      </ul>
      <p>Journal Entry:</p>
      <p>Equipment | R3,000 |  </p>
      <p>  | | R3,000 | Cash</p>
      <p>Debits (R3,000) = Credits (R3,000) ✓ Balanced</p>

      <h3>Example Transaction: Borrow from Bank</h3>
      <p>Business borrows R10,000 from bank</p>
      <ul>
        <li>Cash (Asset) increases → DEBIT (left)</li>
        <li>Bank Loan (Liability) increases → CREDIT (right)</li>
      </ul>
      <p>Journal Entry:</p>
      <p>Cash | R10,000 |  </p>
      <p>  | | R10,000 | Bank Loan</p>
      <p>Debits (R10,000) = Credits (R10,000) ✓ Balanced</p>
    `
  },

  visualizations: [
    {
      id: 'debit-credit-rules',
      type: 'svg-animation',
      title: 'Debit/Credit Decision Table',
      description: 'Interactive guide showing when to debit vs credit each account type',
      svgComponent: 'DebitCreditRulesVisualization'
    },
    {
      id: 't-account-animator',
      type: 'svg-animation',
      title: 'T-Account Builder',
      description: 'Interactive tool to practice entering debits and credits',
      svgComponent: 'TAccountAnimatorVisualization'
    },
    {
      id: 'journal-entry-flow',
      type: 'svg-animation',
      title: 'Journal Entry to Ledger',
      description: 'Watch entries flow from journal to T-accounts',
      svgComponent: 'JournalEntryFlowVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-asset-increase',
      difficulty: 'easy',
      title: 'Asset Increase Transaction',
      problem: 'Record: Business receives R8,000 cash from owner investment',
      steps: [
        {
          step: 1,
          action: 'Identify accounts affected',
          explanation: 'Cash (Asset) increases',
          work: 'Cash account'
        },
        {
          step: 2,
          action: 'Identify second account',
          explanation: 'Owner\'s capital/equity increases',
          work: 'Owner\'s Capital (Equity) account'
        },
        {
          step: 3,
          action: 'Debit/Credit decisions',
          explanation: 'Asset increases = DEBIT | Equity increases = CREDIT',
          work: 'Debit Cash, Credit Owner\'s Capital'
        },
        {
          step: 4,
          action: 'Write journal entry',
          explanation: '',
          work: 'Cash (Dr) R8,000 | Owner\'s Capital (Cr) R8,000'
        }
      ],
      answer: 'Debit Cash R8,000 | Credit Owner\'s Capital R8,000',
      commonMistakes: [
        'Reversing debit/credit'
      ]
    },
    {
      id: 'example-2-asset-decrease',
      difficulty: 'easy',
      title: 'Asset Decrease Transaction',
      problem: 'Record: Pay R2,000 rent expense from cash',
      steps: [
        {
          step: 1,
          action: 'Identify accounts',
          explanation: 'Rent Expense (increases with debit), Cash (decreases)',
          work: 'Rent Expense and Cash accounts'
        },
        {
          step: 2,
          action: 'Debit/Credit decisions',
          explanation: 'Expense increases = DEBIT | Asset decreases = CREDIT',
          work: 'Debit Rent Expense, Credit Cash'
        },
        {
          step: 3,
          action: 'Journal entry',
          explanation: '',
          work: 'Rent Expense (Dr) R2,000 | Cash (Cr) R2,000'
        }
      ],
      answer: 'Debit Rent Expense R2,000 | Credit Cash R2,000',
      commonMistakes: []
    },
    {
      id: 'example-3-liability-increase',
      difficulty: 'medium',
      title: 'Liability Increase Transaction',
      problem: 'Record: Borrow R15,000 bank loan, receive cash',
      steps: [
        {
          step: 1,
          action: 'Identify accounts',
          explanation: 'Cash increases (Asset), Bank Loan increases (Liability)',
          work: 'Cash and Bank Loan accounts'
        },
        {
          step: 2,
          action: 'Debit/Credit rules',
          explanation: 'Asset increases = DEBIT | Liability increases = CREDIT',
          work: 'Debit Cash, Credit Bank Loan'
        },
        {
          step: 3,
          action: 'Journal entry',
          explanation: '',
          work: 'Cash (Dr) R15,000 | Bank Loan (Cr) R15,000'
        }
      ],
      answer: 'Debit Cash R15,000 | Credit Bank Loan R15,000',
      commonMistakes: [
        'Thinking liability decrease = debit'
      ]
    },
    {
      id: 'example-4-complex',
      difficulty: 'hard',
      title: 'Multi-Account Transaction',
      problem: 'Buy equipment R5,000 cash + R3,000 on credit from supplier',
      steps: [
        {
          step: 1,
          action: 'Identify all accounts',
          explanation: 'Equipment (Asset), Cash (Asset), Accounts Payable (Liability)',
          work: 'Three accounts affected'
        },
        {
          step: 2,
          action: 'Equipment account',
          explanation: 'Equipment increases R8,000 total = DEBIT',
          work: 'Debit Equipment R8,000'
        },
        {
          step: 3,
          action: 'Cash account',
          explanation: 'Cash decreases R5,000 = CREDIT',
          work: 'Credit Cash R5,000'
        },
        {
          step: 4,
          action: 'Accounts Payable',
          explanation: 'Liability increases R3,000 = CREDIT',
          work: 'Credit Accounts Payable R3,000'
        },
        {
          step: 5,
          action: 'Verify balance',
          explanation: 'Total debits R8,000 = Total credits R5,000 + R3,000',
          work: 'Debits = R8,000 | Credits = R8,000 ✓'
        }
      ],
      answer: 'Debit Equipment R8,000 | Credit Cash R5,000, Accounts Payable R3,000',
      commonMistakes: [
        'Forgetting the accounts payable component'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'When an asset increases, do you debit or credit?',
      options: ['Debit', 'Credit'],
      correctAnswer: 'Debit',
      explanation: 'Assets increase with debits (left side).'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'When a liability increases, do you debit or credit?',
      options: ['Debit', 'Credit'],
      correctAnswer: 'Credit',
      explanation: 'Liabilities increase with credits (right side).'
    },
    {
      id: 'practice-3',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Record: Pay R5,000 salary from cash. Debit ? and Credit ?',
      correctAnswers: [
        'Salary Expense, Cash',
        'Salary Expense (debit) Cash (credit)'
      ],
      explanation: 'Expense increases (debit), Asset decreases (credit).'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'In a journal entry, what must always be true?',
      options: [
        'Debits > Credits',
        'Total Debits = Total Credits',
        'More accounts debited than credited',
        'Credits > Debits'
      ],
      correctAnswer: 'Total Debits = Total Credits',
      explanation: 'This is the fundamental rule of double entry.'
    }
  ],

  topicQuiz: {
    id: 'double-entry-quiz',
    title: 'Double Entry System Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Why is it called "double entry"?',
        options: [
          'You write each entry twice',
          'Every transaction affects two accounts',
          'You use debit and credit',
          'There are two sides to T-accounts'
        ],
        correctAnswer: 'Every transaction affects two accounts',
        explanation: 'Double entry ensures the equation balances.'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'Assets are on the ? side of accounts and increase with ?.',
        correctAnswers: ['debit, debit', 'left, debit'],
        explanation: 'Left = debit for assets.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'When cash is paid for rent, which entry is correct?',
        options: [
          'Debit Cash, Credit Rent',
          'Credit Cash, Debit Rent',
          'Debit Rent, Credit Cash',
          'Debit Rent, Debit Cash'
        ],
        correctAnswer: 'Debit Rent, Credit Cash',
        explanation: 'Expense increases (debit), asset decreases (credit).'
      },
      {
        id: 'quiz-4',
        type: 'fill-blank',
        question: 'In any journal entry, Total ? must equal Total Credits.',
        correctAnswers: ['Debits'],
        explanation: 'This is the golden rule of accounting.'
      },
      {
        id: 'quiz-5',
        type: 'multiple-choice',
        question: 'Which account is debited when a business borrows money?',
        options: ['Bank Loan', 'Cash', 'Owner\'s Capital', 'Accounts Payable'],
        correctAnswer: 'Cash',
        explanation: 'Cash increases (asset), so it is debited.'
      }
    ]
  },

  practiceExam: {
    id: 'double-entry-exam',
    title: 'Double Entry System Practice Exam',
    timeLimit: 2400,
    totalMarks: 50,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'multiple-choice',
        question: 'What must be true in a balanced journal entry?',
        options: [
          'Debits > Credits',
          'All debits are assets',
          'Total debits = Total credits',
          'No entry has more than 2 accounts'
        ],
        correctAnswer: 'Total debits = Total credits',
        explanation: 'This maintains the accounting equation.'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'fill-blank',
        question: 'Complete the entry: Business buys supplies for R2,000 cash. Debit ? R2,000, Credit Cash R2,000',
        correctAnswers: ['Supplies', 'Supplies Expense'],
        explanation: 'Supplies/Supplies Expense increases with debit.'
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'multiple-choice',
        question: 'When accounts payable is paid with cash, which is correct?',
        options: [
          'Debit Accounts Payable, Credit Cash',
          'Debit Cash, Credit Accounts Payable',
          'Credit both Accounts Payable and Cash',
          'Debit both accounts'
        ],
        correctAnswer: 'Debit Accounts Payable, Credit Cash',
        explanation: 'Liability decreases (debit), asset decreases (credit).'
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'fill-blank',
        question: 'Record this transaction with proper debits/credits: Borrow R10,000 from bank and buy equipment with that money',
        correctAnswers: [
          'Debit Equipment R10,000, Credit Bank Loan R10,000',
          'Equipment (Dr) R10,000, Bank Loan (Cr) R10,000'
        ],
        explanation: 'Asset increases (debit), Liability increases (credit).'
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'fill-blank',
        question: 'Explain why double entry helps prevent errors in accounting.',
        correctAnswers: [
          'Because debits must equal credits, imbalanced entries show errors',
          'The double entry system ensures the equation remains balanced',
          'If total debits ≠ total credits, there is an error'
        ],
        explanation: 'The balance check catches mistakes automatically.'
      }
    ]
  }
};
