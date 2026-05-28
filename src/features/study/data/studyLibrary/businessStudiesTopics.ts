// BUSINESS STUDIES - All 5 Topics

export const businessEnvironment = {
  id: 'business-environment',
  title: 'Business Environment',
  description: 'Types of businesses: profit, non-profit, and government',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Understanding Business Environment',
    content: `
      <h3>What is a Business?</h3>
      <p><strong>Business:</strong> An organized activity to produce and sell goods or services.</p>

      <h3>Three Main Types</h3>
      <p><strong>1. FOR-PROFIT BUSINESSES</strong></p>
      <ul>
        <li>Main goal: Make profit</li>
        <li>Owned by individuals or shareholders</li>
        <li>Examples: Shoprite, cell phone companies, restaurants, online stores</li>
        <li>If profitable: owners get dividends</li>
        <li>If unprofitable: owners lose money</li>
      </ul>

      <p><strong>2. NON-PROFIT ORGANIZATIONS</strong></p>
      <ul>
        <li>Main goal: Provide service to community</li>
        <li>Any surplus is reinvested in the organization</li>
        <li>Examples: Charity organizations, schools, hospitals, NGOs</li>
        <li>Still need to manage money carefully</li>
        <li>Exempt from taxes usually</li>
      </ul>

      <p><strong>3. GOVERNMENT ORGANIZATIONS</strong></p>
      <ul>
        <li>Provide public services</li>
        <li>Funded by taxes</li>
        <li>Examples: Post office, police, education department, welfare</li>
        <li>Goal: Serve public interest</li>
      </ul>

      <h3>Business Sectors</h3>
      <p><strong>Primary Sector:</strong> Extract raw materials (mining, farming, fishing)</p>
      <p><strong>Secondary Sector:</strong> Manufacturing (turn raw materials into products)</p>
      <p><strong>Tertiary Sector:</strong> Services (banking, retail, transport, healthcare)</p>
    `
  },
  visualizations: [
    {
      id: 'business-types-diagram',
      type: 'svg-animation',
      title: 'Types of Businesses',
      description: 'For-profit vs Non-profit vs Government',
      svgComponent: 'BusinessTypesVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      difficulty: 'easy',
      title: 'Identifying Business Type',
      problem: 'Shoprite is a retail store that pays dividends to shareholders. What type of business?',
      steps: [
        { step: 1, action: 'Check goal', explanation: 'Makes profit for shareholders', work: 'For-profit' },
        { step: 2, action: 'Verify', explanation: 'Pays dividends = for-profit characteristic', work: 'Confirmed for-profit' }
      ],
      answer: 'For-profit business',
      commonMistakes: []
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is the primary goal of a for-profit business?',
      options: [
        'Help the community',
        'Make profit',
        'Employ people',
        'Provide services'
      ],
      correctAnswer: 'Make profit',
      explanation: 'Profit is the driving goal for for-profit businesses.'
    }
  ],
  topicQuiz: {
    id: 'business-environment-quiz',
    title: 'Business Environment Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Which is a non-profit organization?',
        options: ['Shoprite', 'Red Cross', 'Checkers', 'Takealot'],
        correctAnswer: 'Red Cross',
        explanation: 'Red Cross is a humanitarian organization.'
      }
    ]
  },
  practiceExam: {
    id: 'business-environment-exam',
    title: 'Business Environment Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: [
      {
        id: 'exam-1',
        marks: 3,
        type: 'multiple-choice',
        question: 'What type of business is the South African Post Office?',
        options: ['For-profit', 'Non-profit', 'Government', 'Partnership'],
        correctAnswer: 'Government',
        explanation: 'Post Office is a government service.'
      }
    ]
  }
};

export const businessSectors = {
  id: 'business-sectors',
  title: 'Business Sectors',
  description: 'Primary, secondary, and tertiary sectors explained',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'The Three Business Sectors',
    content: `
      <h3>Sector Classification</h3>
      <p>Businesses are classified by the stage of production:</p>

      <h3>PRIMARY SECTOR - Extract</h3>
      <p>Takes raw materials from nature</p>
      <ul>
        <li>Agriculture (farming, crops)</li>
        <li>Mining (gold, diamonds, coal)</li>
        <li>Fishing</li>
        <li>Forestry</li>
      </ul>
      <p><strong>South African Examples:</strong> Lonmin Mining, SABMiller (agriculture input), fishing industry</p>

      <h3>SECONDARY SECTOR - Manufacture</h3>
      <p>Transforms raw materials into finished products</p>
      <ul>
        <li>Food processing (grain → bread)</li>
        <li>Textile manufacturing (cotton → clothes)</li>
        <li>Automotive (steel → cars)</li>
        <li>Construction</li>
      </ul>
      <p><strong>South African Examples:</strong> Sasol (oil products), Nampak (packaging)</p>

      <h3>TERTIARY SECTOR - Services</h3>
      <p>Provides services to consumers and businesses</p>
      <ul>
        <li>Retail (Shoprite, Pick n Pay)</li>
        <li>Banking (ABSA, FNB)</li>
        <li>Transport (Uber, Metrorail)</li>
        <li>Healthcare, education, hospitality</li>
        <li>Government services</li>
      </ul>
      <p><strong>South African Examples:</strong> Shoprite, Uber, Discovery Health, MTN</p>

      <h3>How They Connect</h3>
      <p>Primary → Secondary → Tertiary → Consumer</p>
      <p>Example: Farmer grows wheat → Miller grinds to flour → Baker makes bread → Shoprite sells to customer</p>
    `
  },
  visualizations: [
    {
      id: 'sector-flow',
      type: 'svg-animation',
      title: 'Sector Flow Diagram',
      description: 'How products flow through sectors',
      svgComponent: 'SectorFlowVisualization'
    }
  ],
  workedExamples: [],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which sector includes mining?',
      options: ['Primary', 'Secondary', 'Tertiary', 'None'],
      correctAnswer: 'Primary',
      explanation: 'Mining extracts raw materials.'
    }
  ],
  topicQuiz: {
    id: 'business-sectors-quiz',
    title: 'Business Sectors Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'business-sectors-exam',
    title: 'Business Sectors Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: []
  }
};

export const businessStakeholders = {
  id: 'business-stakeholders',
  title: 'Stakeholders & Business Ethics',
  description: 'Identify stakeholders and understand conflicts and corporate responsibility',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Stakeholders in Business',
    content: `
      <h3>What is a Stakeholder?</h3>
      <p><strong>Stakeholder:</strong> Any person or group with an interest in the business.</p>

      <h3>Key Stakeholders</h3>
      <ul>
        <li><strong>Owners/Shareholders:</strong> Want profit and growth</li>
        <li><strong>Employees:</strong> Want fair wages and safe working conditions</li>
        <li><strong>Customers:</strong> Want quality products at fair price</li>
        <li><strong>Suppliers:</strong> Want timely payment and fair terms</li>
        <li><strong>Government:</strong> Wants taxes and compliance with laws</li>
        <li><strong>Environment:</strong> Want sustainable practices</li>
        <li><strong>Community:</strong> Want jobs and responsible corporate behavior</li>
      </ul>

      <h3>Stakeholder Conflicts</h3>
      <p><strong>Shareholders vs Workers:</strong> More profit means lower wages</p>
      <p><strong>Business vs Environment:</strong> Pollution reduces costs but harms nature</p>
      <p><strong>Customers vs Profit:</strong> Lower prices vs higher profit</p>

      <h3>Corporate Social Responsibility (CSR)</h3>
      <p>Business responsibility beyond making profit:</p>
      <ul>
        <li>Fair wages to workers</li>
        <li>Environmental protection</li>
        <li>Community development</li>
        <li>Ethical business practices</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'stakeholder-network',
      type: 'svg-animation',
      title: 'Stakeholder Network',
      description: 'Who has interest in a business',
      svgComponent: 'StakeholderNetworkVisualization'
    }
  ],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'stakeholders-quiz',
    title: 'Stakeholders Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'stakeholders-exam',
    title: 'Stakeholders Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: []
  }
};

export const businessOperations = {
  id: 'business-operations',
  title: 'Business Operations',
  description: 'Production, distribution, marketing, and finance functions',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Business Functions',
    content: `
      <h3>Four Main Functions</h3>
      <p><strong>1. PRODUCTION</strong></p>
      <ul>
        <li>Creating products or services</li>
        <li>Managing resources efficiently</li>
        <li>Quality control</li>
      </ul>

      <p><strong>2. DISTRIBUTION</strong></p>
      <ul>
        <li>Getting product to customers</li>
        <li>Inventory management</li>
        <li>Logistics and transport</li>
      </ul>

      <p><strong>3. MARKETING</strong></p>
      <ul>
        <li>Promoting products</li>
        <li>Understanding customer needs</li>
        <li>Setting prices</li>
      </ul>

      <p><strong>4. FINANCE</strong></p>
      <ul>
        <li>Managing money</li>
        <li>Accounting and budgeting</li>
        <li>Investing in growth</li>
      </ul>
    `
  },
  visualizations: [],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'operations-quiz',
    title: 'Operations Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'operations-exam',
    title: 'Operations Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: []
  }
};
