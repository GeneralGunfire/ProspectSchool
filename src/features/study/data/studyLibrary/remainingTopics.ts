// ACCOUNTING TOPICS 4-6

export const sourceDocuments = {
  id: 'source-documents',
  title: 'Source Documents',
  description: 'Understand invoices, receipts, and proof of transactions',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'What Are Source Documents?',
    content: `
      <h3>Definition</h3>
      <p><strong>Source documents:</strong> Original written or electronic proof that a transaction occurred.</p>
      <p><strong>Golden Rule:</strong> Never record a transaction without supporting source documentation.</p>

      <h3>Types of Source Documents</h3>
      <ul>
        <li><strong>Invoice:</strong> Seller's bill to buyer for goods/services. Shows: date, items, price, terms, buyer, seller</li>
        <li><strong>Receipt:</strong> Proof of payment. Shows: date, amount paid, items, buyer, seller</li>
        <li><strong>Bank Statement:</strong> Monthly record of bank transactions, balance, deposits, withdrawals</li>
        <li><strong>Cheque:</strong> Written instruction to pay money from bank account</li>
        <li><strong>Delivery Note:</strong> Proof goods were delivered</li>
        <li><strong>Purchase Order:</strong> Buyer's request to purchase goods/services</li>
      </ul>

      <h3>Why Are They Important?</h3>
      <ul>
        <li>Prevent fraud and theft - no unsupported transactions</li>
        <li>Provide audit trail - can track where money went</li>
        <li>Settle disputes - "What did we agree to?"</li>
        <li>Tax authorities - require source documents for tax deductions</li>
        <li>Accuracy - force attention to details</li>
      </ul>

      <h3>Information on Invoice</h3>
      <ul>
        <li>Invoice number (unique identifier)</li>
        <li>Invoice date</li>
        <li>Seller's details and account number</li>
        <li>Buyer's details</li>
        <li>Description of goods/services</li>
        <li>Quantity and unit price</li>
        <li>Subtotal, taxes, total amount</li>
        <li>Payment terms (due date, payment method)</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'source-docs-types',
      type: 'svg-animation',
      title: 'Types of Source Documents',
      description: 'Gallery of different source document types',
      svgComponent: 'SourceDocumentsTypesVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      difficulty: 'easy',
      title: 'Reading an Invoice',
      problem: 'What information would you extract from an invoice to record a journal entry?',
      steps: [
        { step: 1, action: 'Find the date', explanation: 'Transaction date', work: 'Date of transaction' },
        { step: 2, action: 'Find the amount', explanation: 'Total amount owed', work: 'Amount to record' },
        { step: 3, action: 'Identify items', explanation: 'What was purchased?', work: 'Determines account to debit' }
      ],
      answer: 'Date, Amount, Description of items',
      commonMistakes: []
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is a source document?',
      options: [
        'A recorded journal entry',
        'Original proof that a transaction occurred',
        'A financial statement',
        'A monthly budget'
      ],
      correctAnswer: 'Original proof that a transaction occurred',
      explanation: 'Source documents are the evidence of transactions.'
    }
  ],
  topicQuiz: {
    id: 'source-documents-quiz',
    title: 'Source Documents Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Why must every transaction have a source document?',
        options: [
          'For filing purposes',
          'To prevent fraud and provide audit trail',
          'Because the law requires it',
          'To confuse people'
        ],
        correctAnswer: 'To prevent fraud and provide audit trail',
        explanation: 'Source documents ensure accountability.'
      }
    ]
  },
  practiceExam: {
    id: 'source-documents-exam',
    title: 'Source Documents Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: [
      {
        id: 'exam-1',
        marks: 3,
        type: 'multiple-choice',
        question: 'Which is the best source document for recording a cash purchase?',
        options: ['Invoice', 'Receipt', 'Bank statement', 'Cheque'],
        correctAnswer: 'Receipt',
        explanation: 'Receipt proves cash payment.'
      }
    ]
  }
};

export const journalsInAccounting = {
  id: 'journals-in-accounting',
  title: 'Journals',
  description: 'Understand journals as chronological records of transactions',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'What is a Journal?',
    content: `
      <h3>Journal Definition</h3>
      <p><strong>Journal:</strong> A chronological (date-ordered) record of ALL business transactions.</p>
      <p>Also called: "Book of original entry" or "Day book"</p>

      <h3>Purpose of Journals</h3>
      <ul>
        <li>Record transactions in order they occur</li>
        <li>Show all debit and credit information</li>
        <li>Provide narrative explanation of transaction</li>
        <li>Prevent omission of transactions</li>
        <li>Show source document reference</li>
      </ul>

      <h3>Journal Format</h3>
      <p>Columns: Date | Account | Debit | Credit | Explanation | Source</p>

      <h3>Types of Journals</h3>
      <ul>
        <li><strong>General Journal:</strong> Records all transactions</li>
        <li><strong>Cash Receipts Journal:</strong> Records money received</li>
        <li><strong>Cash Payments Journal:</strong> Records money paid out</li>
        <li><strong>Sales Journal:</strong> Records credit sales</li>
        <li><strong>Purchases Journal:</strong> Records credit purchases</li>
      </ul>

      <h3>Specialized Journals Save Time</h3>
      <p>Instead of recording every transaction individually in General Journal, specialized journals group similar transactions, then post to General Ledger.</p>
    `
  },
  visualizations: [
    {
      id: 'journal-entry-demo',
      type: 'svg-animation',
      title: 'Journal Entry Animation',
      description: 'Watch a transaction flow through the journal',
      svgComponent: 'JournalEntryDemoVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      difficulty: 'easy',
      title: 'Recording in Journal',
      problem: 'Record in journal: Jan 5, bought supplies for R800 cash (Invoice #123)',
      steps: [
        { step: 1, action: 'Date', explanation: 'Jan 5', work: 'Record date' },
        { step: 2, action: 'Accounts', explanation: 'Supplies (Dr) and Cash (Cr)', work: 'Both amounts R800' },
        { step: 3, action: 'Explanation', explanation: 'Reason for transaction', work: 'Bought supplies - Invoice #123' }
      ],
      answer: 'Jan 5 | Supplies R800 | Cash R800 | Purchased supplies - Invoice #123',
      commonMistakes: []
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is the main purpose of a journal?',
      options: [
        'To file transactions alphabetically',
        'To record transactions in chronological order',
        'To calculate profit and loss',
        'To prepare financial statements'
      ],
      correctAnswer: 'To record transactions in chronological order',
      explanation: 'Journals are date-ordered records.'
    }
  ],
  topicQuiz: {
    id: 'journals-quiz',
    title: 'Journals Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'What is the difference between a journal and a ledger?',
        options: [
          'Journal records by transaction, Ledger records by account',
          'Journal is for cash, Ledger is for credit',
          'No difference',
          'Journal is primary, Ledger is secondary'
        ],
        correctAnswer: 'Journal records by transaction, Ledger records by account',
        explanation: 'Different organization methods for same data.'
      }
    ]
  },
  practiceExam: {
    id: 'journals-exam',
    title: 'Journals Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: [
      {
        id: 'exam-1',
        marks: 4,
        type: 'fill-blank',
        question: 'Record this in journal format: Feb 15 - Received R5,000 from customer payment (Receipt #456)',
        correctAnswers: [
          'Feb 15 | Cash R5,000 | Accounts Receivable R5,000 | Customer payment - Receipt #456',
          'Cash 5000 / Accounts Receivable 5000'
        ],
        explanation: 'Cash increases, receivable decreases.'
      }
    ]
  }
};

export const generalLedgerTopics = {
  id: 'general-ledger',
  title: 'General Ledger',
  description: 'Understand ledgers and posting journal entries to accounts',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'What is a General Ledger?',
    content: `
      <h3>General Ledger Definition</h3>
      <p><strong>General Ledger:</strong> A book containing all accounts (Assets, Liabilities, Equity, Income, Expenses), organized by account type.</p>

      <h3>What Goes Into Ledger</h3>
      <p>Data from journal entries is posted (transferred) to T-accounts in the General Ledger.</p>
      <p><strong>Order:</strong> Transactions → Journal → Ledger</p>

      <h3>T-Account in Ledger</h3>
      <p>Each account is shown as a T-shape:</p>
      <p>Account Name (top)</p>
      <p>Debit (left) | Credit (right)</p>
      <p>Balance calculated at bottom</p>

      <h3>Purpose of Ledger</h3>
      <ul>
        <li>Shows all transactions in each account in one place</li>
        <li>Calculate account balances</li>
        <li>Prepare trial balance (checks if debits = credits)</li>
        <li>Prepare financial statements</li>
      </ul>

      <h3>Posting Process</h3>
      <p>Each debit/credit in journal is copied to the appropriate T-account in ledger.</p>
      <p>Example: Journal entry "Debit Cash R1,000, Credit Sales R1,000"</p>
      <ul>
        <li>Copy R1,000 to LEFT side of Cash T-account</li>
        <li>Copy R1,000 to RIGHT side of Sales T-account</li>
      </ul>

      <h3>Trial Balance</h3>
      <p>A list of all accounts with their balances. Total Debits should equal Total Credits if no errors.</p>
    `
  },
  visualizations: [
    {
      id: 'posting-animation',
      type: 'svg-animation',
      title: 'Posting to Ledger',
      description: 'Watch entries move from journal to T-accounts',
      svgComponent: 'PostingAnimationVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      difficulty: 'medium',
      title: 'Posting to Ledger',
      problem: 'Journal entry: Debit Cash R3,000, Credit Sales R3,000. Post to ledger.',
      steps: [
        { step: 1, action: 'Cash account', explanation: 'Debit goes to left side', work: 'Cash (Dr) R3,000' },
        { step: 2, action: 'Sales account', explanation: 'Credit goes to right side', work: 'Sales (Cr) R3,000' }
      ],
      answer: 'Cash T-account: Debit R3,000 | Sales T-account: Credit R3,000',
      commonMistakes: []
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is the purpose of the General Ledger?',
      options: [
        'To record daily transactions',
        'To organize all accounts and calculate balances',
        'To prepare invoices',
        'To collect source documents'
      ],
      correctAnswer: 'To organize all accounts and calculate balances',
      explanation: 'Ledger organizes data by account.'
    }
  ],
  topicQuiz: {
    id: 'general-ledger-quiz',
    title: 'General Ledger Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Which statement is true?',
        options: [
          'Journal contains accounts, Ledger contains transactions',
          'Ledger contains accounts, Journal contains transactions',
          'Both contain the same information',
          'Ledger and Journal are the same thing'
        ],
        correctAnswer: 'Ledger contains accounts, Journal contains transactions',
        explanation: 'Different organization methods.'
      }
    ]
  },
  practiceExam: {
    id: 'general-ledger-exam',
    title: 'General Ledger Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: [
      {
        id: 'exam-1',
        marks: 4,
        type: 'fill-blank',
        question: 'What is posted from the journal to the general ledger?',
        correctAnswers: [
          'Debit and credit amounts for each transaction',
          'Journal entries'
        ],
        explanation: 'Debits and credits are transferred to T-accounts.'
      }
    ]
  }
};
