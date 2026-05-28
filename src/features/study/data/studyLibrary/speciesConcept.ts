export const speciesConcept = {
  id: 'species-concept',
  title: 'Species Concept',
  description: 'Understand what defines a species and reproductive isolation',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'Understanding Species',
    content: `
      <h3>What is a Species?</h3>
      <p><strong>Definition:</strong> A species is a group of organisms that can interbreed and produce fertile offspring.</p>
      <p>This is called the <strong>Biological Species Concept</strong> - the most common definition used in biology.</p>

      <h3>Key Points About Species:</h3>
      <ul>
        <li>Members of a species CAN breed with each other and produce fertile offspring</li>
        <li>Members of different species CANNOT breed together, or produce sterile offspring</li>
        <li>Reproductive isolation separates species</li>
        <li>Species are the unit of evolution</li>
      </ul>

      <h3>Examples of Species:</h3>
      <p><strong>Humans:</strong> All humans are one species (<em>Homo sapiens</em>) - any human can potentially breed with any other human</p>
      <p><strong>Dogs and Wolves:</strong> Different species despite being in same genus</p>
      <ul>
        <li>Dogs (<em>Canis familiaris</em>) and wolves (<em>Canis lupus</em>) can interbreed</li>
        <li>But dogs were domesticated FROM wolves, now reproductively isolated</li>
        <li>Some argue they're subspecies of same species</li>
      </ul>
      <p><strong>Lions and Tigers:</strong> Different species</p>
      <ul>
        <li>Can interbreed in captivity → produce hybrid "liger"</li>
        <li>But ligers are STERILE (cannot reproduce)</li>
        <li>Therefore, lions and tigers are different species</li>
      </ul>

      <h3>Reproductive Isolation</h3>
      <p><strong>Definition:</strong> When organisms cannot breed together, they are reproductively isolated.</p>
      <p>Reproductive isolation can occur through:</p>

      <h3>1. Geographic Isolation (Allopatry)</h3>
      <p><strong>What it is:</strong> Physical barriers prevent organisms from meeting</p>
      <p><strong>Examples:</strong></p>
      <ul>
        <li>Mountain separates two squirrel populations → over time they diverge and become separate species</li>
        <li>Ocean isolates island species from mainland species</li>
        <li>Frogs on opposite sides of river cannot meet to breed</li>
      </ul>

      <h3>2. Behavioral Isolation</h3>
      <p><strong>What it is:</strong> Mating behaviors or rituals prevent breeding</p>
      <p><strong>Examples:</strong></p>
      <ul>
        <li>Fireflies: Different species have different flashing patterns (can't recognize each other as mates)</li>
        <li>Birds: Different songs prevent recognition as potential mates</li>
        <li>Frogs: Different mating calls mean species don't attract each other</li>
      </ul>

      <h3>3. Temporal Isolation</h3>
      <p><strong>What it is:</strong> Species breed at different times, so they never meet</p>
      <p><strong>Examples:</strong></p>
      <ul>
        <li>Plants flowering at different seasons</li>
        <li>Insects with different breeding seasons</li>
        <li>Animals migrating at different times</li>
      </ul>

      <h3>4. Structural/Mechanical Isolation</h3>
      <p><strong>What it is:</strong> Physical structures prevent mating</p>
      <p><strong>Examples:</strong></p>
      <ul>
        <li>Insects with incompatible genitalia (can't physically mate)</li>
        <li>Flowers with different shapes that fit different pollinators</li>
      </ul>

      <h3>5. Genetic Isolation</h3>
      <p><strong>What it is:</strong> Genetic incompatibility prevents successful reproduction</p>
      <p><strong>Examples:</strong></p>
      <ul>
        <li>Sperm cannot penetrate egg</li>
        <li>Hybrid embryo dies before birth</li>
        <li>Hybrid is sterile (cannot reproduce) - like ligers</li>
      </ul>

      <h3>Species vs Similar-Looking Organisms</h3>
      <p><strong>Important:</strong> Two organisms can look very similar but be different species, or look different but be same species.</p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>Frogs that look nearly identical but have different mating calls = different species</li>
        <li>Dogs come in many shapes/sizes but are all same species</li>
      </ul>

      <h3>Speciation</h3>
      <p><strong>Definition:</strong> The process by which new species arise from existing species</p>
      <p><strong>How it happens:</strong> When populations become reproductively isolated long enough, they accumulate different mutations and become separate species.</p>
    `
  },

  visualizations: [
    {
      id: 'reproductive-isolation-types',
      type: 'svg-animation',
      title: 'Types of Reproductive Isolation',
      description: 'Interactive guide to different mechanisms that isolate species',
      svgComponent: 'ReproductiveIsolationVisualization'
    },
    {
      id: 'species-definition-scenarios',
      type: 'svg-animation',
      title: 'Species or Not? Decision Tree',
      description: 'Use breeding potential to determine if organisms are same species',
      svgComponent: 'SpeciesDecisionTreeVisualization'
    },
    {
      id: 'geographic-isolation-animation',
      type: 'svg-animation',
      title: 'Geographic Isolation Over Time',
      description: 'See how populations diverge when separated',
      svgComponent: 'GeographicIsolationVisualization'
    },
    {
      id: 'hybrid-sterility-explanation',
      type: 'svg-animation',
      title: 'Why Hybrids Are Sterile',
      description: 'Understanding liger and mule sterility',
      svgComponent: 'HybridSterilityVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-definition',
      difficulty: 'easy',
      title: 'Applying the Species Definition',
      problem: 'Are lions and tigers the same species?',
      steps: [
        {
          step: 1,
          action: 'Check if they can breed',
          explanation: 'Lions and tigers CAN interbreed in captivity and produce offspring',
          work: 'They can breed together'
        },
        {
          step: 2,
          action: 'Check if offspring are fertile',
          explanation: 'Offspring (ligers) are STERILE - cannot reproduce',
          work: 'Ligers cannot breed'
        },
        {
          step: 3,
          action: 'Apply definition',
          explanation: 'Species definition requires both: can breed AND produce FERTILE offspring. Ligers fail the second test.',
          work: 'Different species'
        }
      ],
      answer: 'Lions and tigers are different species because their hybrid offspring are sterile',
      commonMistakes: [
        'Thinking they can breed = same species - forget about fertility requirement'
      ]
    },
    {
      id: 'example-2-geographic-isolation',
      difficulty: 'easy',
      title: 'Understanding Geographic Isolation',
      problem: 'A river divides a squirrel population. One group lives on each side. Over 100,000 years, can they become different species?',
      steps: [
        {
          step: 1,
          action: 'Identify the barrier',
          explanation: 'River separates populations - geographic isolation',
          work: 'Two separated populations cannot interbreed'
        },
        {
          step: 2,
          action: 'Consider time',
          explanation: '100,000 years is a LONG time evolutionarily - mutations accumulate',
          work: 'Each population evolves separately'
        },
        {
          step: 3,
          action: 'Consider outcome',
          explanation: 'Eventually populations diverge enough that if barrier removed, they could not breed (reproductive isolation)',
          work: 'Yes, can become different species'
        }
      ],
      answer: 'Yes, geographic isolation can lead to speciation over time',
      commonMistakes: [
        'Thinking speciation happens quickly - it takes thousands or millions of years'
      ]
    },
    {
      id: 'example-3-behavioral-isolation',
      difficulty: 'easy',
      title: 'Understanding Behavioral Isolation',
      problem: 'Firefly species A flashes 5 times per second, species B flashes 3 times per second. Are they reproductively isolated?',
      steps: [
        {
          step: 1,
          action: 'Understand firefly behavior',
          explanation: 'Fireflies recognize mates by flashing patterns',
          work: 'Different flash = different recognition signals'
        },
        {
          step: 2,
          action: 'Consider mating behavior',
          explanation: 'Females looking for mates respond to species-specific flash pattern',
          work: 'Female A only attracts to 5-flash pattern, ignores 3-flash'
        },
        {
          step: 3,
          action: 'Determine isolation',
          explanation: 'Different mating signals prevent them from recognizing each other as mates',
          work: 'Behaviorally isolated = different species'
        }
      ],
      answer: 'Yes, behavioral isolation - different flash patterns prevent mating',
      commonMistakes: [
        'Thinking they just choose not to mate - it is biological inability to recognize'
      ]
    },
    {
      id: 'example-4-temporal-isolation',
      difficulty: 'medium',
      title: 'Understanding Temporal Isolation',
      problem: 'Two orchid species flower at different times of year. Can they breed?',
      steps: [
        {
          step: 1,
          action: 'Identify the barrier',
          explanation: 'Orchid A flowers in spring, orchid B flowers in summer',
          work: 'Flowers never bloom at same time'
        },
        {
          step: 2,
          action: 'Consider reproduction',
          explanation: 'Since they never flower together, they cannot pollinate each other',
          work: 'No opportunity to breed'
        },
        {
          step: 3,
          action: 'Classify isolation',
          explanation: 'Temporal isolation = separated by time',
          work: 'Temporally isolated'
        }
      ],
      answer: 'No, temporal isolation prevents breeding - they flower at different times',
      commonMistakes: []
    },
    {
      id: 'example-5-structural-isolation',
      difficulty: 'medium',
      title: 'Understanding Structural Isolation',
      problem: 'Two insect species live in the same place and breed at the same time. Can they mate?',
      steps: [
        {
          step: 1,
          action: 'Consider genitalia',
          explanation: 'Species A male has different shaped genitalia than species B female',
          work: 'Physical structures incompatible'
        },
        {
          step: 2,
          action: 'Consider mating attempt',
          explanation: 'Even if they try, physical shapes prevent successful mating',
          work: 'Cannot mate = reproductive isolation'
        }
      ],
      answer: 'No, structural/mechanical isolation prevents mating',
      commonMistakes: [
        'Thinking this is rare - very common in insects'
      ]
    },
    {
      id: 'example-6-comprehensive',
      difficulty: 'hard',
      title: 'Multiple Isolation Mechanisms',
      problem: 'Two frog species live in the same pond, breed at same time, can physically mate. Why don\'t they hybridize?',
      steps: [
        {
          step: 1,
          action: 'Check geographic isolation',
          explanation: 'No barrier - they\'re in same pond, so not geographically isolated',
          work: 'Geographic isolation: NO'
        },
        {
          step: 2,
          action: 'Check temporal isolation',
          explanation: 'Breed at same time, so not temporally isolated',
          work: 'Temporal isolation: NO'
        },
        {
          step: 3,
          action: 'Check behavioral isolation',
          explanation: 'Different mating calls - females don\'t recognize opposite species as mates',
          work: 'Behavioral isolation: YES - different mating calls prevent pairing'
        },
        {
          step: 4,
          action: 'Consider genetic isolation',
          explanation: 'Even if mating occurred, sperm-egg incompatibility might exist',
          work: 'Likely genetic isolation as backup'
        }
      ],
      answer: 'Behavioral isolation (different mating calls) + possibly genetic isolation prevent hybridization',
      commonMistakes: [
        'Thinking only one isolation mechanism exists - often multiple mechanisms reinforce isolation'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which best defines a species?',
      options: [
        'Organisms that look similar',
        'Organisms that live in the same place',
        'Organisms that can interbreed and produce fertile offspring',
        'Organisms in the same genus'
      ],
      correctAnswer: 'Organisms that can interbreed and produce fertile offspring',
      explanation: 'This is the biological species concept.'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'A horse and donkey can produce a mule. Are they the same species?',
      options: [
        'Yes, because they can breed',
        'No, because mules are sterile',
        'Maybe, need more information',
        'Species definition does not apply'
      ],
      correctAnswer: 'No, because mules are sterile',
      explanation: 'Offspring must be fertile. Since mules are sterile, horses and donkeys are different species.'
    },
    {
      id: 'practice-3',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'When populations are separated by a physical barrier like a mountain, this is called ? isolation.',
      correctAnswers: ['geographic', 'geographical'],
      explanation: 'Geographic isolation occurs when physical barriers prevent populations from meeting.'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Which type of isolation occurs when species have different mating calls?',
      options: [
        'Geographic',
        'Behavioral',
        'Temporal',
        'Genetic'
      ],
      correctAnswer: 'Behavioral',
      explanation: 'Different behaviors (like mating calls) prevent recognition of potential mates.'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'When two species breed at different times of year, this is ? isolation.',
      correctAnswers: ['temporal'],
      explanation: 'Temporal isolation = separation by time.'
    }
  ],

  topicQuiz: {
    id: 'species-concept-quiz',
    title: 'Species Concept Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'The biological species concept is based on:',
        options: [
          'Physical appearance',
          'Evolutionary history',
          'Reproductive compatibility',
          'Geographic location'
        ],
        correctAnswer: 'Reproductive compatibility',
        explanation: 'Ability to interbreed and produce fertile offspring defines species biologically.'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'Reproductive ? occurs when populations cannot breed together.',
        correctAnswers: ['isolation'],
        explanation: 'This prevents gene flow between species.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Which is an example of behavioral isolation?',
        options: [
          'Mountain between populations',
          'Different mating calls',
          'Breeding in different seasons',
          'Sterile offspring'
        ],
        correctAnswer: 'Different mating calls',
        explanation: 'Behavioral traits prevent mating recognition.'
      },
      {
        id: 'quiz-4',
        type: 'fill-blank',
        question: 'When populations are separated for a long time and evolve separately, this can eventually lead to ?.',
        correctAnswers: ['speciation'],
        explanation: 'New species arise from existing species through reproductive isolation.'
      },
      {
        id: 'quiz-5',
        type: 'multiple-choice',
        question: 'Why are ligers (lion-tiger hybrids) sterile?',
        options: [
          'Because they are too big',
          'Because genetic incompatibility prevents chromosome pairing in reproduction',
          'Because lions and tigers never meet in nature',
          'Because ligers refuse to mate'
        ],
        correctAnswer: 'Because genetic incompatibility prevents chromosome pairing in reproduction',
        explanation: 'Different numbers/structures of chromosomes prevent proper meiosis.'
      }
    ]
  },

  practiceExam: {
    id: 'grade-10-species-concept-exam',
    title: 'Species Concept Practice Exam',
    timeLimit: 2400,
    totalMarks: 50,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'fill-blank',
        question: 'Define a species using the biological species concept.',
        correctAnswers: [
          'A group of organisms that can interbreed and produce fertile offspring',
          'Organisms that can interbreed and produce fertile offspring'
        ],
        explanation: 'This is the core definition.'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'multiple-choice',
        question: 'A bird species has a specific mating song. A similar-looking bird species has a different song. They live in the same forest. What type of isolation prevents them from hybridizing?',
        options: [
          'Geographic',
          'Behavioral',
          'Temporal',
          'Structural'
        ],
        correctAnswer: 'Behavioral',
        explanation: 'Different songs prevent mating behavior and recognition.'
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'fill-blank',
        question: 'List three types of reproductive isolation mechanisms.',
        correctAnswers: [
          'Geographic, behavioral, temporal',
          'Geographic, behavioral, structural, temporal, genetic'
        ],
        explanation: 'Any three of: geographic, behavioral, temporal, structural, genetic.'
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'multiple-choice',
        question: 'If a mountain range separates a squirrel population for 50,000 years, the two populations may eventually become separate species through:',
        options: [
          'Divergent evolution due to different selection pressures',
          'Accumulation of different mutations',
          'Reproductive isolation becoming permanent',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'Geographic isolation leads to genetic divergence and speciation.'
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'fill-blank',
        question: 'Two plants flower in the same location but at different times of year. Explain why they do not hybridize.',
        correctAnswers: [
          'Temporal isolation - they flower at different times, so they cannot pollinate each other',
          'They breed at different times (temporal isolation)',
          'Temporal isolation prevents mating'
        ],
        explanation: 'Time separation = temporal isolation.'
      }
    ]
  }
};
