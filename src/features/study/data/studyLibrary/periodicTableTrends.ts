export const periodicTableTrends = {
  id: 'periodic-table-trends',
  title: 'Periodic Table & Periodic Trends',
  description: 'Understand the organization of the periodic table and predict element properties',
  grade: 10,
  term: 1,
  subject: 'chemistry',

  conceptExplanation: {
    title: 'Periodic Table & Periodic Trends',
    content: `
      <h3>Why the Periodic Table?</h3>
      <p>The periodic table organizes elements by patterns. Understanding patterns = predicting properties WITHOUT memorizing!</p>

      <h3>Organization of the Periodic Table</h3>
      <p><strong>Rows = Periods:</strong> Elements in same period have same number of electron shells</p>
      <p><strong>Columns = Groups (or Families):</strong> Elements in same group have same number of outer electrons → similar chemical properties</p>

      <p><strong>Example:</strong></p>
      <ul>
        <li>Period 1: H, He (1 shell)</li>
        <li>Period 2: Li, Be, B, C, N, O, F, Ne (2 shells)</li>
        <li>Period 3: Na, Mg, Al, Si, P, S, Cl, Ar (3 shells)</li>
      </ul>

      <ul>
        <li>Group 1 (Alkali metals): Li, Na, K... (all have 1 outer electron)</li>
        <li>Group 17 (Halogens): F, Cl, Br... (all have 7 outer electrons)</li>
        <li>Group 18 (Noble gases): He, Ne, Ar... (all have 8 outer electrons — full shell!)</li>
      </ul>

      <h3>Types of Elements</h3>
      <p><strong>Metals:</strong> Left side of periodic table</p>
      <ul>
        <li>Shiny, conduct electricity, malleable, ductile</li>
        <li>Lose electrons easily → form positive ions</li>
        <li><strong>Examples:</strong> Na, Cu, Fe, Al</li>
      </ul>

      <p><strong>Nonmetals:</strong> Right side of periodic table</p>
      <ul>
        <li>Dull, poor conductors, brittle</li>
        <li>Gain electrons → form negative ions</li>
        <li><strong>Examples:</strong> O, N, F, Cl</li>
      </ul>

      <p><strong>Metalloids:</strong> Stair-step line (mix properties)</p>
      <ul>
        <li><strong>Examples:</strong> Si, B, As</li>
      </ul>

      <h3>Periodic Trends</h3>
      <p><strong>TREND #1: Atomic Radius</strong></p>
      <ul>
        <li><strong>Across period (left → right):</strong> DECREASES</li>
        <li>Why? More protons attract electrons more strongly, pulling them closer</li>
        <li><strong>Down group (top → bottom):</strong> INCREASES</li>
        <li>Why? More electron shells = larger atom</li>
      </ul>

      <p><strong>TREND #2: Ionization Energy</strong></p>
      <ul>
        <li>Energy needed to remove an electron</li>
        <li><strong>Across period:</strong> INCREASES</li>
        <li>Why? Smaller atoms hold electrons tighter</li>
        <li><strong>Down group:</strong> DECREASES</li>
        <li>Why? Electrons further from nucleus, easier to remove</li>
      </ul>

      <p><strong>TREND #3: Electronegativity</strong></p>
      <ul>
        <li>Ability to attract electrons in a bond</li>
        <li><strong>Across period:</strong> INCREASES</li>
        <li>Why? Smaller atoms pull electrons harder</li>
        <li><strong>Down group:</strong> DECREASES</li>
        <li>Why? Electrons further away, weaker pull</li>
      </ul>

      <h3>Reactivity Patterns</h3>
      <p><strong>Group 1 (Alkali Metals):</strong> VERY reactive</p>
      <ul>
        <li>Have 1 outer electron: easily loses it to form stable 8-electron shell</li>
        <li>Reactivity INCREASES down group: K more reactive than Na, Na more than Li</li>
        <li>Why? Electrons further from nucleus, easier to remove</li>
        <li><strong>Example:</strong> Na in water → violent reaction, produces NaOH + H₂</li>
      </ul>

      <p><strong>Group 17 (Halogens):</strong> VERY reactive</p>
      <ul>
        <li>Have 7 outer electrons: easily gain 1 to form stable 8-electron shell</li>
        <li>Reactivity DECREASES down group: F more reactive than Cl, Cl more than Br</li>
        <li>Why? Harder to pull electrons in bonds when bigger</li>
      </ul>

      <p><strong>Group 18 (Noble Gases):</strong> UNREACTIVE</p>
      <ul>
        <li>Have 8 outer electrons (full shell) → no tendency to gain/lose</li>
        <li>Stable and inert</li>
        <li><strong>Examples:</strong> He, Ne, Ar, Kr</li>
      </ul>

      <h3>Predicting Properties</h3>
      <p><strong>The key insight:</strong> Properties repeat because electron configuration repeats!</p>

      <p><strong>Can you predict?</strong></p>
      <ul>
        <li>Is element a metal or nonmetal? (Check position)</li>
        <li>Will it conduct electricity? (Metal = yes)</li>
        <li>How many electrons will it lose/gain? (Look at group number)</li>
        <li>Which is more reactive: Na or K? (K is lower, more reactive)</li>
        <li>Which is smaller: Na or Cl? (Cl is right side, smaller)</li>
      </ul>

      <h3>Mnemonic Helps</h3>
      <ul>
        <li><strong>Across period:</strong> Atoms get smaller, reactivity changes (metals→nonmetals)</li>
        <li><strong>Down group:</strong> Atoms get bigger, metals more reactive, nonmetals less reactive</li>
      </ul>
    `
  },

  visualizations: [
    {
      id: 'interactive-periodic-table',
      type: 'interactive-table',
      title: 'Interactive Periodic Table',
      description: 'Click elements to see atomic structure and properties',
      svgComponent: 'InteractivePeriodicTableVisualization'
    },
    {
      id: 'atomic-radius-trend',
      type: 'interactive-graph',
      title: 'Atomic Radius Trend',
      description: 'Compare atom sizes across periods and down groups',
      svgComponent: 'AtomicRadiusTrendVisualization'
    },
    {
      id: 'ionization-energy-trend',
      type: 'svg-animation',
      title: 'Ionization Energy Trend',
      description: 'See how easy/hard it is to remove electrons',
      svgComponent: 'IonizationEnergyVisualization'
    },
    {
      id: 'reactivity-animation',
      type: 'interactive-simulation',
      title: 'Reactivity Demonstration',
      description: 'Watch metals reacting with water (intensity varies by group)',
      svgComponent: 'ReactivityAnimationVisualization'
    },
    {
      id: 'electron-config-display',
      type: 'interactive-visualization',
      title: 'Electron Configuration by Period',
      description: 'See how electrons arrange in shells across the table',
      svgComponent: 'ElectronConfigDisplayVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-identify-type',
      difficulty: 'easy',
      title: 'Identify Element Type',
      problem: 'Is Aluminum (Al) a metal or nonmetal?',
      steps: [
        {
          step: 1,
          action: 'Locate on periodic table',
          explanation: 'Al is in Period 3, Group 13',
          work: 'Left of stair-step line'
        },
        {
          step: 2,
          action: 'Apply rule',
          explanation: 'Left side = metals, right side = nonmetals',
          work: 'Al is on left side'
        },
        {
          step: 3,
          action: 'Answer',
          explanation: '',
          work: 'Aluminum is a metal'
        }
      ],
      answer: 'Metal (conducts electricity, shiny, malleable)',
      commonMistakes: []
    },
    {
      id: 'example-2-compare-radius',
      difficulty: 'easy',
      title: 'Compare Atomic Radius',
      problem: 'Which is larger: Na or Cl?',
      steps: [
        {
          step: 1,
          action: 'Locate elements',
          explanation: 'Both in Period 3',
          work: 'Na is Group 1, Cl is Group 17'
        },
        {
          step: 2,
          action: 'Apply trend',
          explanation: 'Across period: size DECREASES (left → right)',
          work: 'Na is left of Cl'
        },
        {
          step: 3,
          action: 'Answer',
          explanation: 'Na is further left = larger',
          work: 'Sodium is larger'
        }
      ],
      answer: 'Sodium (Na) is larger than Chlorine',
      commonMistakes: [
        'Thinking the rightmost element is biggest',
        'Confusing with down-group trend'
      ]
    },
    {
      id: 'example-3-reactivity-comparison',
      difficulty: 'medium',
      title: 'Compare Metal Reactivity',
      problem: 'Which is more reactive: Na or K?',
      steps: [
        {
          step: 1,
          action: 'Identify group',
          explanation: 'Both in Group 1 (alkali metals)',
          work: 'Both have 1 outer electron'
        },
        {
          step: 2,
          action: 'Apply trend',
          explanation: 'Down group: reactivity INCREASES',
          work: 'Electrons further from nucleus'
        },
        {
          step: 3,
          action: 'Locate in group',
          explanation: 'K is below Na',
          work: 'K is lower in group'
        },
        {
          step: 4,
          action: 'Answer',
          explanation: 'Lower in group = more reactive',
          work: 'Potassium is more reactive'
        }
      ],
      answer: 'Potassium (K) is more reactive than Sodium',
      commonMistakes: [
        'Thinking smaller = more reactive',
        'Forgetting the down-group trend'
      ]
    },
    {
      id: 'example-4-predict-electrons',
      difficulty: 'medium',
      title: 'Predict How Many Electrons Lost',
      problem: 'How many electrons does Magnesium (Mg) lose to become stable?',
      steps: [
        {
          step: 1,
          action: 'Find group number',
          explanation: 'Mg is in Group 2',
          work: 'Group 2 = 2 outer electrons'
        },
        {
          step: 2,
          action: 'Stability principle',
          explanation: 'Atoms want 8 outer electrons (or 2 for H, He)',
          work: 'Easier to lose 2 than gain 6'
        },
        {
          step: 3,
          action: 'Predict',
          explanation: 'Losing 2 electrons → stable Mg²⁺',
          work: 'Magnesium loses 2 electrons'
        }
      ],
      answer: '2 electrons (becomes Mg²⁺ ion)',
      commonMistakes: [
        'Thinking it gains electrons instead',
        'Using wrong number'
      ]
    },
    {
      id: 'example-5-nonmetal-reactivity',
      difficulty: 'medium',
      title: 'Compare Nonmetal Reactivity',
      problem: 'Which is more reactive: F or Cl?',
      steps: [
        {
          step: 1,
          action: 'Identify group',
          explanation: 'Both in Group 17 (halogens)',
          work: 'Both want 1 more electron'
        },
        {
          step: 2,
          action: 'Apply trend',
          explanation: 'Down group: reactivity DECREASES',
          work: 'F is smaller, pulls electrons harder'
        },
        {
          step: 3,
          action: 'Locate',
          explanation: 'F is above Cl',
          work: 'F is higher'
        },
        {
          step: 4,
          action: 'Answer',
          explanation: 'Higher = more reactive',
          work: 'Fluorine is more reactive'
        }
      ],
      answer: 'Fluorine (F) is more reactive than Chlorine',
      commonMistakes: [
        'Confusing nonmetal with metal reactivity trends',
        'Not knowing F is most reactive nonmetal'
      ]
    },
    {
      id: 'example-6-hard-predict',
      difficulty: 'hard',
      title: 'Predict Element Properties',
      problem: 'Element in Group 1, Period 4. Is it reactive? Will it conduct electricity? How many electrons lost?',
      steps: [
        {
          step: 1,
          action: 'Identify element',
          explanation: 'Group 1, Period 4 = Potassium (K)',
          work: ''
        },
        {
          step: 2,
          action: 'Is it reactive?',
          explanation: 'Group 1 = alkali metals, very reactive',
          work: 'Yes, very reactive'
        },
        {
          step: 3,
          action: 'Conducts electricity?',
          explanation: 'Metal = good conductor',
          work: 'Yes, conducts electricity'
        },
        {
          step: 4,
          action: 'Electrons lost?',
          explanation: 'Group 1 = 1 outer electron, loses it',
          work: 'Loses 1 electron → K⁺'
        }
      ],
      answer: 'Very reactive, conducts electricity, loses 1 electron (K⁺)',
      commonMistakes: []
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Periods are:',
      options: ['Horizontal rows', 'Vertical columns', 'Diagonal lines', 'Center groups'],
      correctAnswer: 'Horizontal rows',
      explanation: ''
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Group number = number of ___ electrons',
      correctAnswers: ['outer', 'outer shell', 'valence'],
      explanation: ''
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Metals are on:',
      options: ['Right side', 'Left side', 'Center', 'Top'],
      correctAnswer: 'Left side',
      explanation: ''
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Across period, atomic size:',
      options: ['Increases', 'Decreases', 'Stays same', 'Varies randomly'],
      correctAnswer: 'Decreases',
      explanation: 'More protons pull electrons closer'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Down group, ionization energy: ___',
      correctAnswers: ['decreases', 'goes down'],
      explanation: ''
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Most reactive metal in group:',
      options: ['Top', 'Bottom', 'Middle', 'All same'],
      correctAnswer: 'Bottom',
      explanation: ''
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Noble gases have ___ outer electrons (full shell)',
      correctAnswers: ['8', 'eight'],
      explanation: ''
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Which element? Group 17, Period 3',
      options: ['Cl', 'S', 'Si', 'Ar'],
      correctAnswer: 'Cl',
      explanation: ''
    },
    {
      id: 'practice-9',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Electronegativity increases:',
      options: ['Down group', 'Across period', 'Both', 'Neither'],
      correctAnswer: 'Across period',
      explanation: ''
    },
    {
      id: 'practice-10',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'Which loses more easily: Li or Cs (cesium)?',
      correctAnswers: ['Cs', 'cesium', 'cesium (lower)'],
      explanation: 'Both Group 1, but Cs is lower'
    }
  ],

  topicQuiz: {
    id: 'periodic-table-quiz',
    title: 'Periodic Table & Trends Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'Elements in same ___ have similar properties',
        correctAnswers: ['group', 'column'],
        explanation: ''
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'Atomic radius increases:',
        options: ['Across period', 'Down group', 'Right side', 'Top of table'],
        correctAnswer: 'Down group',
        explanation: ''
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Halogens have ___ outer electrons',
        options: ['1', '6', '7', '8'],
        correctAnswer: '7',
        explanation: ''
      },
      {
        id: 'quiz-4',
        type: 'fill-blank',
        question: 'Group 1 = ___ metals (very reactive)',
        correctAnswers: ['alkali', 'alkali metals'],
        explanation: ''
      },
      {
        id: 'quiz-5',
        type: 'multiple-choice',
        question: 'Noble gases are unreactive because:',
        options: ['No electrons', 'Full outer shell', 'No nucleus', 'Too small'],
        correctAnswer: 'Full outer shell',
        explanation: ''
      },
      {
        id: 'quiz-6',
        type: 'multiple-choice',
        question: 'Which is smaller: K or Na?',
        options: ['K', 'Na', 'Same size', 'Can\'t tell'],
        correctAnswer: 'Na',
        explanation: 'Na is above K'
      },
      {
        id: 'quiz-7',
        type: 'fill-blank',
        question: 'Nonmetals on ___ of periodic table',
        correctAnswers: ['right', 'right side'],
        explanation: ''
      },
      {
        id: 'quiz-8',
        type: 'multiple-choice',
        question: 'Most reactive nonmetal:',
        options: ['Cl', 'F', 'Br', 'I'],
        correctAnswer: 'F',
        explanation: ''
      },
      {
        id: 'quiz-9',
        type: 'fill-blank',
        question: 'Fluorine has ___ valence electrons',
        correctAnswers: ['7'],
        explanation: ''
      },
      {
        id: 'quiz-10',
        type: 'multiple-choice',
        question: 'Ionization energy increases:',
        options: ['Down group', 'Across period', 'Left side', 'Bottom'],
        correctAnswer: 'Across period',
        explanation: ''
      }
    ]
  },

  practiceExam: {
    id: 'periodic-table-exam',
    title: 'Periodic Table & Trends Exam',
    timeLimit: 5400,
    totalMarks: 100,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'fill-blank',
        question: 'Vertical columns = ___',
        correctAnswers: ['groups', 'families'],
        explanation: ''
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'multiple-choice',
        question: 'Classify Sodium (Na):',
        options: ['Nonmetal', 'Metal', 'Metalloid', 'Noble gas'],
        correctAnswer: 'Metal',
        explanation: ''
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'fill-blank',
        question: 'Across period: size ___',
        correctAnswers: ['decreases'],
        explanation: ''
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'multiple-choice',
        question: 'Which pair: same properties?',
        options: ['Na and K', 'Na and Cl', 'C and N', 'Ne and Ar'],
        correctAnswer: 'Na and K',
        explanation: 'Both Group 1'
      },
      {
        id: 'exam-5',
        marks: 3,
        type: 'fill-blank',
        question: 'Alkali metals have ___ outer electron(s)',
        correctAnswers: ['1', 'one'],
        explanation: ''
      },
      {
        id: 'exam-6',
        marks: 4,
        type: 'multiple-choice',
        question: 'Most reactive metal in Group 1:',
        options: ['Li', 'Na', 'K', 'Fr'],
        correctAnswer: 'Fr',
        explanation: 'Lowest in group'
      },
      {
        id: 'exam-7',
        marks: 3,
        type: 'fill-blank',
        question: 'Chlorine (Cl) gains ___ electron(s)',
        correctAnswers: ['1', 'one'],
        explanation: ''
      },
      {
        id: 'exam-8',
        marks: 4,
        type: 'multiple-choice',
        question: 'Predict: Most reactive nonmetal?',
        options: ['Cl', 'F', 'Br', 'I'],
        correctAnswer: 'F',
        explanation: ''
      },
      {
        id: 'exam-9',
        marks: 4,
        type: 'fill-blank',
        question: 'Element Group 13, Period 2: ___',
        correctAnswers: ['B', 'boron'],
        explanation: ''
      },
      {
        id: 'exam-10',
        marks: 5,
        type: 'fill-blank',
        question: 'Explain: K more reactive than Na (hint: periodic trends)',
        correctAnswers: ['K lower in group', 'outer electrons further', 'easier to remove', 'same group trend'],
        explanation: 'Both Group 1, but K electrons further from nucleus'
      }
    ]
  }
};
