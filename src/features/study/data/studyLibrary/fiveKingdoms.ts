export const fiveKingdoms = {
  id: 'five-kingdoms',
  title: 'The Five Kingdoms',
  description: 'Learn about the five kingdoms of life and their characteristics',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'The Five Kingdoms of Life',
    content: `
      <h3>What Are the Five Kingdoms?</h3>
      <p>The five kingdoms divide all living organisms into five major groups based on their characteristics.</p>

      <h3>1. Kingdom Monera</h3>
      <p><strong>Characteristics:</strong></p>
      <ul>
        <li>Single-celled organisms</li>
        <li>No nucleus (prokaryotic)</li>
        <li>No membrane-bound organelles</li>
        <li>Simple cell structure</li>
      </ul>
      <p><strong>Examples:</strong> Bacteria, cyanobacteria</p>
      <p><strong>Importance:</strong> Found everywhere - soil, water, human body. Some cause disease, others help with digestion.</p>

      <h3>2. Kingdom Protista</h3>
      <p><strong>Characteristics:</strong></p>
      <ul>
        <li>Mostly single-celled organisms</li>
        <li>Have a nucleus (eukaryotic)</li>
        <li>Have membrane-bound organelles</li>
        <li>More complex than Monera</li>
      </ul>
      <p><strong>Examples:</strong> Amoeba, paramecium, algae</p>
      <p><strong>Habitat:</strong> Mostly found in water or moist environments</p>

      <h3>3. Kingdom Fungi</h3>
      <p><strong>Characteristics:</strong></p>
      <ul>
        <li>Mostly multicellular</li>
        <li>Have a nucleus (eukaryotic)</li>
        <li>Feed by absorbing nutrients from dead organic matter</li>
        <li>Cell wall made of chitin</li>
        <li>Cannot make their own food (not photosynthetic)</li>
      </ul>
      <p><strong>Examples:</strong> Mushrooms, mold, yeast</p>
      <p><strong>Role:</strong> Decomposers - break down dead organisms and recycle nutrients</p>

      <h3>4. Kingdom Plantae</h3>
      <p><strong>Characteristics:</strong></p>
      <ul>
        <li>Multicellular organisms</li>
        <li>Have a nucleus (eukaryotic)</li>
        <li>Make their own food through photosynthesis</li>
        <li>Cell wall made of cellulose</li>
        <li>Cannot move around</li>
      </ul>
      <p><strong>Examples:</strong> Trees, flowers, grasses, algae</p>
      <p><strong>Role:</strong> Producers - make food from sunlight, providing food for other organisms</p>

      <h3>5. Kingdom Animalia</h3>
      <p><strong>Characteristics:</strong></p>
      <ul>
        <li>Multicellular organisms</li>
        <li>Have a nucleus (eukaryotic)</li>
        <li>Must eat other organisms for food (cannot make their own)</li>
        <li>No cell wall</li>
        <li>Can move around (at least at some stage of life)</li>
      </ul>
      <p><strong>Examples:</strong> Mammals, birds, fish, insects, worms</p>
      <p><strong>Role:</strong> Consumers - eat plants or other animals for energy</p>

      <h3>Key Comparison</h3>
      <p><strong>Nucleus:</strong> Monera have no nucleus. Protista, Fungi, Plantae, and Animalia all have nuclei.</p>
      <p><strong>Cells:</strong> Monera and Protista are usually single-celled. Fungi, Plantae, and Animalia are multicellular.</p>
      <p><strong>Food:</strong> Plantae make their own food. Fungi and Animalia must absorb or eat food.</p>
    `
  },

  visualizations: [
    {
      id: 'five-kingdoms-chart',
      type: 'svg-animation',
      title: 'The Five Kingdoms Overview',
      description: 'Characteristics and examples of each kingdom',
      svgComponent: 'FiveKingdomsChartVisualization'
    },
    {
      id: 'kingdom-examples-gallery',
      type: 'svg-animation',
      title: 'Kingdom Examples Gallery',
      description: 'Visual examples of organisms from each kingdom',
      svgComponent: 'KingdomExamplesGalleryVisualization'
    },
    {
      id: 'kingdom-comparison',
      type: 'svg-animation',
      title: 'Kingdom Characteristics Comparison',
      description: 'Compare key features of each kingdom',
      svgComponent: 'KingdomComparisonVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-monera-identification',
      difficulty: 'easy',
      title: 'Identifying Monera',
      problem: 'A single-celled organism has no nucleus and lives in soil. Which kingdom does it belong to?',
      steps: [
        {
          step: 1,
          action: 'Check for nucleus',
          explanation: 'The organism has NO nucleus. This is a key feature of Monera.',
          work: 'No nucleus = Monera characteristic'
        },
        {
          step: 2,
          action: 'Check cell structure',
          explanation: 'Single-celled with simple structure - typical of bacteria',
          work: 'Simple structure, no organelles = Monera'
        }
      ],
      answer: 'Kingdom Monera (specifically, it is likely a bacterium)',
      commonMistakes: [
        'Confusing Monera with Protista - remember Protista have nuclei'
      ]
    },
    {
      id: 'example-2-protista-identification',
      difficulty: 'easy',
      title: 'Identifying Protista',
      problem: 'You observe a single-celled organism in pond water under the microscope. It has a nucleus and moves around using hair-like structures. Which kingdom is it?',
      steps: [
        {
          step: 1,
          action: 'Check for nucleus',
          explanation: 'It has a nucleus - this rules out Monera',
          work: 'Has nucleus = Protista, Fungi, Plantae, or Animalia'
        },
        {
          step: 2,
          action: 'Check cell count',
          explanation: 'Single-celled organism - this narrows to Protista',
          work: 'Single-celled with nucleus = Protista'
        }
      ],
      answer: 'Kingdom Protista (this is a paramecium)',
      commonMistakes: [
        'Thinking all organisms with nuclei are the same - remember single-celled ones with nuclei are Protista'
      ]
    },
    {
      id: 'example-3-fungi-identification',
      difficulty: 'easy',
      title: 'Identifying Fungi',
      problem: 'An organism is multicellular, has a nucleus, but cannot make its own food. It feeds on dead wood. Which kingdom?',
      steps: [
        {
          step: 1,
          action: 'Check if it makes own food',
          explanation: 'It does NOT make its own food (no photosynthesis) - rules out Plantae',
          work: 'Cannot photosynthesize'
        },
        {
          step: 2,
          action: 'Check feeding method',
          explanation: 'It absorbs nutrients from dead organic matter - characteristic of Fungi',
          work: 'Absorbs nutrients from dead material = Fungi (decomposer)'
        }
      ],
      answer: 'Kingdom Fungi (example: mushroom or mold)',
      commonMistakes: [
        'Confusing Fungi with Animalia - Fungi absorb nutrients, animals ingest them'
      ]
    },
    {
      id: 'example-4-plantae-identification',
      difficulty: 'easy',
      title: 'Identifying Plantae',
      problem: 'An organism is multicellular, has a nucleus, makes its own food using sunlight, and cannot move. Which kingdom?',
      steps: [
        {
          step: 1,
          action: 'Check food production',
          explanation: 'It makes its own food using photosynthesis - key to Plantae',
          work: 'Photosynthetic = Plantae'
        },
        {
          step: 2,
          action: 'Check mobility',
          explanation: 'It cannot move around - characteristic of plants',
          work: 'Stationary + photosynthetic = Plantae'
        }
      ],
      answer: 'Kingdom Plantae (example: tree, flower, grass)',
      commonMistakes: [
        'Thinking animals cannot move - animals CAN and DO move'
      ]
    },
    {
      id: 'example-5-animalia-identification',
      difficulty: 'easy',
      title: 'Identifying Animalia',
      problem: 'An organism is multicellular, has a nucleus, eats other organisms for food, and can move. Which kingdom?',
      steps: [
        {
          step: 1,
          action: 'Check feeding method',
          explanation: 'It eats other organisms - must be consumer (Fungi or Animalia)',
          work: 'Consumes other organisms'
        },
        {
          step: 2,
          action: 'Check how it eats',
          explanation: 'It ingests food (eats it), not absorbs it - characteristic of Animalia',
          work: 'Ingests food = Animalia'
        }
      ],
      answer: 'Kingdom Animalia (example: dog, bird, fish)',
      commonMistakes: [
        'Confusing ingestion with absorption - animals ingest, fungi absorb'
      ]
    },
    {
      id: 'example-6-kingdom-comparison',
      difficulty: 'medium',
      title: 'Comparing Multiple Kingdoms',
      problem: 'Compare a bacterium, an amoeba, a mushroom, a rose plant, and a lion. State which kingdom each belongs to and one key characteristic.',
      steps: [
        {
          step: 1,
          action: 'Identify bacterium',
          explanation: 'Single-celled, no nucleus',
          work: 'Bacterium = Kingdom Monera'
        },
        {
          step: 2,
          action: 'Identify amoeba',
          explanation: 'Single-celled, has nucleus',
          work: 'Amoeba = Kingdom Protista'
        },
        {
          step: 3,
          action: 'Identify mushroom',
          explanation: 'Multicellular, absorbs nutrients from dead matter',
          work: 'Mushroom = Kingdom Fungi'
        },
        {
          step: 4,
          action: 'Identify rose',
          explanation: 'Multicellular, photosynthetic, cannot move',
          work: 'Rose = Kingdom Plantae'
        },
        {
          step: 5,
          action: 'Identify lion',
          explanation: 'Multicellular, eats other animals',
          work: 'Lion = Kingdom Animalia'
        }
      ],
      answer: 'Bacterium-Monera, Amoeba-Protista, Mushroom-Fungi, Rose-Plantae, Lion-Animalia',
      commonMistakes: []
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which kingdom includes organisms that typically lack a nucleus?',
      options: [
        'Protista',
        'Fungi',
        'Monera',
        'Plantae'
      ],
      correctAnswer: 'Monera',
      explanation: 'Monera (bacteria) are prokaryotic and lack a nucleus.'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which kingdom includes amoebas and paramecia?',
      options: [
        'Monera',
        'Protista',
        'Fungi',
        'Animalia'
      ],
      correctAnswer: 'Protista',
      explanation: 'Protista are single-celled eukaryotes found mostly in water or moist environments.'
    },
    {
      id: 'practice-3',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Mushrooms and mold belong to Kingdom ?.',
      correctAnswers: ['Fungi'],
      explanation: 'Fungi are decomposers that absorb nutrients from dead organic matter.'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which kingdom includes organisms that make their own food through photosynthesis?',
      options: [
        'Fungi',
        'Animalia',
        'Plantae',
        'Protista'
      ],
      correctAnswer: 'Plantae',
      explanation: 'Plants photosynthesize to produce their own food.'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'A multicellular organism that eats plants belongs to Kingdom ?.',
      correctAnswers: ['Animalia'],
      explanation: 'Animals must eat other organisms (plants or animals) for food.'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'What is the main difference between Fungi and Plantae?',
      options: [
        'Fungi have nuclei, Plantae do not',
        'Fungi make food, Plantae do not',
        'Fungi cannot make food, Plantae can',
        'Fungi are multicellular, Plantae are single-celled'
      ],
      correctAnswer: 'Fungi cannot make food, Plantae can',
      explanation: 'Plantae photosynthesize; Fungi absorb nutrients from dead matter.'
    }
  ],

  topicQuiz: {
    id: 'five-kingdoms-quiz',
    title: 'The Five Kingdoms Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Which kingdom has organisms with no nucleus?',
        options: ['Monera', 'Protista', 'Fungi', 'Plantae'],
        correctAnswer: 'Monera',
        explanation: 'Monera are prokaryotic bacteria without nuclei.'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'A single-celled organism with a nucleus that lives in pond water belongs to Kingdom ?.',
        correctAnswers: ['Protista'],
        explanation: 'Protista are eukaryotic, usually single-celled organisms.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Which kingdom includes organisms that decompose dead matter?',
        options: ['Plantae', 'Fungi', 'Animalia', 'Protista'],
        correctAnswer: 'Fungi',
        explanation: 'Fungi are decomposers.'
      },
      {
        id: 'quiz-4',
        type: 'fill-blank',
        question: 'Kingdom ? includes all plants.',
        correctAnswers: ['Plantae'],
        explanation: 'This is the definition of Plantae.'
      },
      {
        id: 'quiz-5',
        type: 'multiple-choice',
        question: 'Which kingdom includes humans?',
        options: ['Fungi', 'Animalia', 'Plantae', 'Protista'],
        correctAnswer: 'Animalia',
        explanation: 'Humans are multicellular animals that must eat for food.'
      }
    ]
  },

  practiceExam: {
    id: 'grade-10-five-kingdoms-exam',
    title: 'The Five Kingdoms Practice Exam',
    timeLimit: 2400,
    totalMarks: 50,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'multiple-choice',
        question: 'Which of these is NOT a kingdom of life?',
        options: ['Monera', 'Fungi', 'Archaea', 'Plantae'],
        correctAnswer: 'Archaea',
        explanation: 'The five kingdoms are Monera, Protista, Fungi, Plantae, and Animalia.'
      },
      {
        id: 'exam-2',
        marks: 2,
        type: 'fill-blank',
        question: 'Bacteria belong to Kingdom ?.',
        correctAnswers: ['Monera'],
        explanation: 'Bacteria are prokaryotic organisms.'
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'multiple-choice',
        question: 'What is the main characteristic that distinguishes Fungi from Plantae?',
        options: [
          'Number of cells',
          'Ability to move',
          'Method of obtaining food',
          'Presence of a nucleus'
        ],
        correctAnswer: 'Method of obtaining food',
        explanation: 'Plants photosynthesize (make food); Fungi absorb nutrients from dead matter.'
      },
      {
        id: 'exam-4',
        marks: 3,
        type: 'fill-blank',
        question: 'Yeast, mushrooms, and molds all belong to Kingdom ?.',
        correctAnswers: ['Fungi'],
        explanation: 'These are all fungal organisms.'
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'multiple-choice',
        question: 'An organism is single-celled, has a nucleus, and lives in water. Which kingdom is it most likely in?',
        options: ['Monera', 'Protista', 'Animalia', 'Fungi'],
        correctAnswer: 'Protista',
        explanation: 'Protista are typically single-celled eukaryotes living in aquatic environments.'
      }
    ]
  }
};
