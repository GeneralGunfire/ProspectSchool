export const biodiversityAndClassification = {
  id: 'biodiversity-and-classification',
  title: 'Biodiversity & Classification',
  description: 'Understand why we classify organisms and the three levels of biodiversity',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'Understanding Biodiversity',
    content: `
      <h3>What is Biodiversity?</h3>
      <p>Biodiversity is the variety of life on Earth. It exists at three different levels:</p>

      <h3>1. Genetic Diversity</h3>
      <p><strong>Definition:</strong> The variety of genes within a species.</p>
      <p>Even within one species (like humans), we have different genes for traits like eye color, height, and hair texture.</p>
      <p><strong>Example:</strong> In a population of dogs, some have brown eyes and others have blue eyes due to genetic differences.</p>

      <h3>2. Species Diversity</h3>
      <p><strong>Definition:</strong> The variety of different species in a region.</p>
      <p>A rainforest has high species diversity (thousands of species), while a desert has lower species diversity.</p>
      <p><strong>Example:</strong> A coral reef ecosystem contains fish, corals, sea plants, crustaceans, and mollusks.</p>

      <h3>3. Ecosystem Diversity</h3>
      <p><strong>Definition:</strong> The variety of different habitats and ecosystems on Earth.</p>
      <p>Ecosystems include rainforests, deserts, oceans, grasslands, and mountains.</p>
      <p><strong>Example:</strong> Earth has tropical rainforests, temperate forests, savannas, deserts, oceans, and tundra.</p>

      <h3>Why Classify Organisms?</h3>
      <p><strong>Organization:</strong> With millions of species, classification helps organize and understand life.</p>
      <p><strong>Communication:</strong> Scientists worldwide use the same classification system, so they understand each other.</p>
      <p><strong>Evolutionary Relationships:</strong> Classification shows how organisms are related through evolution.</p>
      <p><strong>Conservation:</strong> Classification helps identify endangered species and conservation priorities.</p>

      <h3>Classification Provides Order</h3>
      <p>Imagine a library with books scattered everywhere. Classification is like organizing them by subject, making them easy to find and understand.</p>
    `
  },

  visualizations: [
    {
      id: 'biodiversity-pyramid',
      type: 'svg-animation',
      title: 'Three Levels of Biodiversity',
      description: 'Interactive pyramid showing genetic, species, and ecosystem diversity',
      svgComponent: 'BiodiversityPyramidVisualization'
    },
    {
      id: 'ecosystem-gallery',
      type: 'svg-animation',
      title: 'Global Ecosystem Examples',
      description: 'Explore different ecosystems and their biodiversity',
      svgComponent: 'EcosystemGalleryVisualization'
    },
    {
      id: 'why-classify-diagram',
      type: 'svg-animation',
      title: 'Why Do We Classify?',
      description: 'Benefits of classification system',
      svgComponent: 'WhyClassifyVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-genetic-diversity',
      difficulty: 'easy',
      title: 'Identifying Genetic Diversity',
      problem: 'A group of cats all belong to the same species, but some are black, some are orange, and some are white. What type of biodiversity does this show?',
      steps: [
        {
          step: 1,
          action: 'Identify what is different',
          explanation: 'The cats are all the same species, but they look different in color.',
          work: 'Difference is in appearance/traits'
        },
        {
          step: 2,
          action: 'Recognize the level of diversity',
          explanation: 'When organisms of the SAME species have different traits, this is genetic diversity.',
          work: 'Different genes for color = genetic diversity'
        }
      ],
      answer: 'Genetic diversity (variation within the species)',
      commonMistakes: [
        'Calling it species diversity - species diversity is about different species, not different traits'
      ]
    },
    {
      id: 'example-2-species-diversity',
      difficulty: 'easy',
      title: 'Identifying Species Diversity',
      problem: 'A coral reef has fish, crustaceans, mollusks, sea plants, and sea mammals. What type of biodiversity is this?',
      steps: [
        {
          step: 1,
          action: 'Count the different species types',
          explanation: 'We have fish, crustaceans, mollusks, plants, and mammals - all different species',
          work: 'Multiple different species present'
        },
        {
          step: 2,
          action: 'Recognize the diversity level',
          explanation: 'When many different SPECIES live in the same area, this is species diversity.',
          work: 'Many different species = species diversity'
        }
      ],
      answer: 'Species diversity (variety of different species)',
      commonMistakes: [
        'Confusing with ecosystem diversity - ecosystem diversity is about different environments, not species in one environment'
      ]
    },
    {
      id: 'example-3-ecosystem-diversity',
      difficulty: 'easy',
      title: 'Identifying Ecosystem Diversity',
      problem: 'Earth has rainforests, deserts, coral reefs, tundra, and mountains. What type of biodiversity does this show?',
      steps: [
        {
          step: 1,
          action: 'Identify what is being described',
          explanation: 'We are describing different types of environments or habitats on Earth.',
          work: 'Different habitats: rainforest, desert, tundra, mountains'
        },
        {
          step: 2,
          action: 'Recognize the diversity level',
          explanation: 'When there are many different types of ecosystems, this is ecosystem diversity.',
          work: 'Variety of different environments = ecosystem diversity'
        }
      ],
      answer: 'Ecosystem diversity (variety of different habitats)',
      commonMistakes: [
        'Calling it species diversity - focus on the different HABITATS, not the species'
      ]
    },
    {
      id: 'example-4-why-classify',
      difficulty: 'easy',
      title: 'Understanding Classification Purpose',
      problem: 'Why do scientists use the same classification system worldwide?',
      steps: [
        {
          step: 1,
          action: 'Consider communication',
          explanation: 'Scientists from different countries need to understand each other.',
          work: 'Standard system ensures everyone uses same terms'
        },
        {
          step: 2,
          action: 'Consider organization',
          explanation: 'With millions of species, a system helps organize them logically.',
          work: 'Classification prevents confusion and duplicates'
        }
      ],
      answer: 'Universal classification ensures scientists worldwide understand and communicate about the same organisms',
      commonMistakes: []
    },
    {
      id: 'example-5-biodiversity-levels',
      difficulty: 'medium',
      title: 'Comparing All Three Levels',
      problem: 'In an African savanna, there are lions, zebras, giraffes, antelopes, and many grass species. Some zebras have different stripe patterns. Describe all three levels of biodiversity.',
      steps: [
        {
          step: 1,
          action: 'Identify genetic diversity',
          explanation: 'Look for variation WITHIN a species - the zebra stripe differences',
          work: 'Genetic diversity = different stripe patterns in same species'
        },
        {
          step: 2,
          action: 'Identify species diversity',
          explanation: 'Count different species - lions, zebras, giraffes, antelopes, grasses',
          work: 'Species diversity = multiple different species in one habitat'
        },
        {
          step: 3,
          action: 'Consider ecosystem diversity',
          explanation: 'The savanna itself is one ecosystem type among many on Earth',
          work: 'Ecosystem diversity = savanna + rainforest + desert + ocean + etc.'
        }
      ],
      answer: 'Genetic: stripe variations in zebras | Species: lions, zebras, giraffes, antelopes, grass | Ecosystem: savanna is one of many habitats on Earth',
      commonMistakes: [
        'Mixing up the levels - always remember: genetic (WITHIN species), species (different species), ecosystem (different habitats)'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which is an example of genetic diversity?',
      options: [
        'Tall and short people in the same population',
        'Lions and tigers in the same location',
        'Desert and rainforest on Earth',
        'Fish and birds in an ocean ecosystem'
      ],
      correctAnswer: 'Tall and short people in the same population',
      explanation: 'Genetic diversity is variation within a species. Different heights are genetic differences in humans.'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'A rainforest contains thousands of species. What type of biodiversity is this?',
      options: [
        'Genetic diversity',
        'Species diversity',
        'Ecosystem diversity',
        'Population diversity'
      ],
      correctAnswer: 'Species diversity',
      explanation: 'Species diversity refers to the variety of different species in one location.'
    },
    {
      id: 'practice-3',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'The three levels of biodiversity are: genetic, ?, and ecosystem.',
      correctAnswers: ['species', 'species diversity'],
      explanation: 'The three levels are genetic diversity, species diversity, and ecosystem diversity.'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Why is classification important in biology?',
      options: [
        'To make the study of biology easier',
        'To organize organisms and show relationships',
        'To help scientists communicate about organisms',
        'All of the above'
      ],
      correctAnswer: 'All of the above',
      explanation: 'Classification serves all these purposes - organization, showing relationships, and enabling communication.'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'A coral reef has many different fish species, different coral types, sea plants, and crustaceans. This shows ? diversity.',
      correctAnswers: ['species', 'species diversity'],
      explanation: 'Multiple different species in one ecosystem = species diversity.'
    }
  ],

  topicQuiz: {
    id: 'biodiversity-quiz',
    title: 'Biodiversity & Classification Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'What is biodiversity?',
        options: [
          'The number of animals in one habitat',
          'The variety of life on Earth',
          'The ability of organisms to adapt',
          'The study of living organisms'
        ],
        correctAnswer: 'The variety of life on Earth',
        explanation: 'Biodiversity includes all variations of life at genetic, species, and ecosystem levels.'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'Variation in eye color within human populations is an example of ? diversity.',
        correctAnswers: ['genetic'],
        explanation: 'Different traits within a species = genetic diversity.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Which shows ecosystem diversity?',
        options: [
          'Multiple bird species in a forest',
          'Different colored birds in one species',
          'Forests, oceans, deserts, and tundra on Earth',
          'Many insects in a garden'
        ],
        correctAnswer: 'Forests, oceans, deserts, and tundra on Earth',
        explanation: 'Ecosystem diversity refers to different types of habitats on Earth.'
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'Why do scientists need a universal classification system?',
        options: [
          'To make biology more difficult',
          'To confuse other scientists',
          'To ensure clear communication and understanding worldwide',
          'To prove organisms are not related'
        ],
        correctAnswer: 'To ensure clear communication and understanding worldwide',
        explanation: 'A standard system prevents confusion and ensures all scientists discuss organisms the same way.'
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: 'The variety of different species in one region is called ? diversity.',
        correctAnswers: ['species'],
        explanation: 'This is the definition of species diversity.'
      }
    ]
  },

  practiceExam: {
    id: 'grade-10-biodiversity-exam',
    title: 'Biodiversity & Classification Practice Exam',
    timeLimit: 2400,
    totalMarks: 50,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'multiple-choice',
        question: 'Which best defines biodiversity?',
        options: [
          'The number of animals in one place',
          'The variety of life at genetic, species, and ecosystem levels',
          'The ability to adapt to change',
          'The study of evolution'
        ],
        correctAnswer: 'The variety of life at genetic, species, and ecosystem levels',
        explanation: 'Biodiversity encompasses all three levels of variation.'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'fill-blank',
        question: 'If a population of frogs has different colored skin (green and brown), what type of diversity is this?',
        correctAnswers: ['genetic'],
        explanation: 'Different traits within the same species = genetic diversity.'
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'multiple-choice',
        question: 'A pond contains 15 different fish species, 8 plant species, and various invertebrates. Which level of biodiversity does this describe?',
        options: [
          'Genetic diversity',
          'Species diversity',
          'Ecosystem diversity',
          'Population diversity'
        ],
        correctAnswer: 'Species diversity',
        explanation: 'Multiple different species in one location = species diversity.'
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'fill-blank',
        question: 'List the three levels of biodiversity.',
        correctAnswers: [
          'genetic, species, ecosystem',
          'genetic diversity, species diversity, ecosystem diversity'
        ],
        explanation: 'The three levels are genetic, species, and ecosystem diversity.'
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'multiple-choice',
        question: 'Why is maintaining biodiversity important?',
        options: [
          'Only for scientific research',
          'To have pretty animals to look at',
          'For ecosystem stability, medicine discovery, and food sources',
          'It is not important'
        ],
        correctAnswer: 'For ecosystem stability, medicine discovery, and food sources',
        explanation: 'Biodiversity provides ecosystem services, medicines, food, and ecosystem stability.'
      }
    ]
  }
};
