// ECONOMICS - 5 Topics

export const economicProblem = {
  id: 'economic-problem',
  title: 'The Basic Economic Problem',
  description: 'Scarcity, choice, and opportunity cost - the fundamentals',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Scarcity & Choice',
    content: `
      <h3>The Central Economic Problem</h3>
      <p><strong>Problem:</strong> People have UNLIMITED WANTS but LIMITED RESOURCES.</p>

      <h3>What is Scarcity?</h3>
      <p>Not having enough resources to satisfy all wants.</p>
      <ul>
        <li>Money is scarce - can't buy everything</li>
        <li>Time is scarce - can't do everything</li>
        <li>Land is scarce - can't build everywhere</li>
        <li>Labor is scarce - can't hire infinite workers</li>
      </ul>

      <h3>The Universal Problem</h3>
      <p>Scarcity exists for everyone - rich, poor, businesses, governments.</p>
      <p><strong>Example:</strong> Bill Gates has billions but can't buy 100 houses today (time constraint)</p>

      <h3>Opportunity Cost</h3>
      <p><strong>Definition:</strong> What you give up when you choose something else.</p>
      <p><strong>The next best alternative.</strong></p>

      <h3>Examples of Opportunity Cost</h3>
      <ul>
        <li>Choose University (cost: lost wages you could earn)</li>
        <li>Buy Pizza (cost: the burger you could have bought)</li>
        <li>Government builds hospital (cost: the school it could have built)</li>
      </ul>

      <h3>Three Economic Questions Every Society Must Answer</h3>
      <ol>
        <li><strong>WHAT to produce?</strong> Cars or food? Hospitals or roads?</li>
        <li><strong>HOW to produce?</strong> By hand or machines? Labor-intensive or capital-intensive?</li>
        <li><strong>FOR WHOM to produce?</strong> Rich or poor? Everyone equally?</li>
      </ol>
    `
  },
  visualizations: [
    {
      id: 'scarcity-visualizer',
      type: 'svg-animation',
      title: 'Scarcity Concept',
      description: 'Infinite wants vs limited resources',
      svgComponent: 'ScarcityVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      difficulty: 'easy',
      title: 'Identifying Opportunity Cost',
      problem: 'You have R100. Buy movie (R80) OR shoes (R100). What is opportunity cost of movie?',
      steps: [
        { step: 1, action: 'Identify choice', explanation: 'Choosing movie', work: 'Movie = R80' },
        { step: 2, action: 'Next best alternative', explanation: 'Best alternative is shoes', work: 'Shoes = R100' },
        { step: 3, action: 'Opportunity cost', explanation: 'What you give up for movie', work: 'Cost = giving up shoes + R20 savings' }
      ],
      answer: 'Shoes (you give up shoes option)',
      commonMistakes: []
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is scarcity?',
      options: [
        'When something is rare',
        'When unlimited wants exceed limited resources',
        'When prices are high',
        'Lack of money'
      ],
      correctAnswer: 'When unlimited wants exceed limited resources',
      explanation: 'Scarcity is the fundamental economic problem.'
    }
  ],
  topicQuiz: {
    id: 'economic-problem-quiz',
    title: 'Economic Problem Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'economic-problem-exam',
    title: 'Economic Problem Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};

export const productionPossibilityCurve = {
  id: 'production-possibility-curve',
  title: 'Production Possibility Curve (PPC)',
  description: 'Visualizing trade-offs and efficiency',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Understanding PPC',
    content: `
      <h3>What is PPC?</h3>
      <p><strong>Production Possibility Curve:</strong> A graph showing the maximum combination of two goods a country can produce with its resources.</p>

      <h3>Reading PPC</h3>
      <ul>
        <li>X-axis: Quantity of Good A (e.g., Corn)</li>
        <li>Y-axis: Quantity of Good B (e.g., Guns)</li>
        <li>Curve shows ALL efficient production combinations</li>
      </ul>

      <h3>Three Zones on PPC Graph</h3>
      <p><strong>1. ON THE CURVE:</strong> Efficient production (full resource use)</p>
      <p><strong>2. INSIDE THE CURVE:</strong> Inefficient (wasted resources)</p>
      <p><strong>3. OUTSIDE THE CURVE:</strong> Impossible with current resources</p>

      <h3>Trade-offs</h3>
      <p>To produce more corn, must give up guns.</p>
      <p>Example: If curve shows 100 corn and 50 guns, increasing to 120 corn means reducing to 30 guns.</p>

      <h3>Economic Growth</h3>
      <p>PPC shifts outward when:</p>
      <ul>
        <li>New technology discovered</li>
        <li>More workers available</li>
        <li>More capital (machines)</li>
        <li>Better education/training</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'ppc-interactive',
      type: 'svg-animation',
      title: 'Interactive PPC',
      description: 'Drag along curve to see trade-offs',
      svgComponent: 'PPCInteractiveVisualization'
    }
  ],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'ppc-quiz',
    title: 'PPC Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'ppc-exam',
    title: 'PPC Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};

export const economicSystems = {
  id: 'economic-systems',
  title: 'Economic Systems',
  description: 'Market, command, and mixed economies',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Types of Economic Systems',
    content: `
      <h3>Three Main Systems</h3>

      <p><strong>1. MARKET ECONOMY (Capitalism)</strong></p>
      <ul>
        <li>Prices determined by supply and demand</li>
        <li>Businesses compete freely</li>
        <li>Consumers choose what to buy</li>
        <li>Example: USA (mostly)</li>
      </ul>

      <p><strong>2. COMMAND ECONOMY</strong></p>
      <ul>
        <li>Government decides what to produce</li>
        <li>Government sets prices</li>
        <li>No consumer choice</li>
        <li>Example: North Korea (mostly)</li>
      </ul>

      <p><strong>3. MIXED ECONOMY</strong></p>
      <ul>
        <li>Combination of market and government control</li>
        <li>Some prices free, some regulated</li>
        <li>Most real economies</li>
        <li>Example: South Africa</li>
      </ul>

      <h3>Advantages & Disadvantages</h3>
      <p><strong>Market:</strong> Efficient but can be unfair (rich benefit more)</p>
      <p><strong>Command:</strong> Fair distribution but can be inefficient</p>
      <p><strong>Mixed:</strong> Balance, but compromise on both efficiency and equity</p>
    `
  },
  visualizations: [],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'economic-systems-quiz',
    title: 'Economic Systems Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'economic-systems-exam',
    title: 'Economic Systems Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};

export const circularFlowModel = {
  id: 'circular-flow-model',
  title: 'Circular Flow of Income',
  description: 'How money flows between households and firms',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Understanding Circular Flow',
    content: `
      <h3>The Model</h3>
      <p>Money flows in a circle:</p>
      <p>Households → Spend at Firms → Firms → Pay Wages to Households → back to Households</p>

      <h3>Key Flows</h3>
      <p><strong>Households:</strong> Work, earn income, spend money</p>
      <p><strong>Firms:</strong> Hire workers, produce goods, pay wages</p>

      <h3>Income vs Spending</h3>
      <p>When spending decreases:</p>
      <ul>
        <li>Firms earn less</li>
        <li>Firms lay off workers</li>
        <li>Households earn less</li>
        <li>Spending decreases further (recession)</li>
      </ul>

      <p>When spending increases:</p>
      <ul>
        <li>Firms earn more</li>
        <li>Firms hire more workers</li>
        <li>Households earn more</li>
        <li>Spending increases further (economic growth)</li>
      </ul>

      <h3>Leakages & Injections</h3>
      <p><strong>Leakages:</strong> Savings, taxes (money leaves the flow)</p>
      <p><strong>Injections:</strong> Investment, government spending (money enters the flow)</p>
    `
  },
  visualizations: [
    {
      id: 'circular-flow-animation',
      type: 'svg-animation',
      title: 'Circular Flow Animation',
      description: 'Watch money flow between households and firms',
      svgComponent: 'CircularFlowAnimationVisualization'
    }
  ],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'circular-flow-quiz',
    title: 'Circular Flow Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'circular-flow-exam',
    title: 'Circular Flow Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};

export const factorsOfProduction = {
  id: 'factors-of-production',
  title: 'Factors of Production',
  description: 'Land, labor, capital, and entrepreneurship',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'What Makes Production Possible',
    content: `
      <h3>Four Factors of Production</h3>

      <p><strong>1. LAND</strong></p>
      <ul>
        <li>Natural resources</li>
        <li>Farmland, minerals, forests, water</li>
        <li>Limited and immobile</li>
        <li>Reward: Rent</li>
      </ul>

      <p><strong>2. LABOR</strong></p>
      <ul>
        <li>Human effort and skills</li>
        <li>Workers, engineers, managers</li>
        <li>Reward: Wages/Salary</li>
      </ul>

      <p><strong>3. CAPITAL</strong></p>
      <ul>
        <li>Human-made resources used in production</li>
        <li>Machines, buildings, tools, technology</li>
        <li>Reward: Interest/Profit</li>
      </ul>

      <p><strong>4. ENTREPRENEURSHIP</strong></p>
      <ul>
        <li>The ability to combine factors, take risk, innovate</li>
        <li>The person who starts business</li>
        <li>Reward: Profit</li>
      </ul>

      <h3>Example: Making Bread</h3>
      <ul>
        <li><strong>Land:</strong> Farmland for wheat</li>
        <li><strong>Labor:</strong> Farmers, bakers, workers</li>
        <li><strong>Capital:</strong> Tractors, ovens, trucks</li>
        <li><strong>Entrepreneurship:</strong> Bakery owner's idea and risk-taking</li>
      </ul>
    `
  },
  visualizations: [],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'factors-production-quiz',
    title: 'Factors of Production Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'factors-production-exam',
    title: 'Factors of Production Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};
