export const atomsSubatomicParticles = {
  id: 'atoms-subatomic-particles',
  title: 'Atoms & Subatomic Particles',
  description: 'Understand atomic structure, subatomic particles, and electron configuration',
  grade: 10,
  term: 1,
  subject: 'physics',

  conceptExplanation: {
    title: 'Atoms & Subatomic Particles',
    content: `
      <h3>What Is an Atom?</h3>
      <p>An atom is the smallest unit of matter that retains the properties of an element.</p>
      <p><strong>Key insight:</strong> Everything is made of atoms. Even you!</p>

      <h3>Atomic Structure</h3>
      <p>An atom has two main regions:</p>
      <p><strong>1. Nucleus (center):</strong> Contains protons and neutrons (very dense, tiny, but contains most mass)</p>
      <p><strong>2. Electron cloud:</strong> Contains electrons orbiting the nucleus (mostly empty space)</p>

      <h3>Subatomic Particles</h3>
      <p><strong>Protons (p⁺):</strong></p>
      <ul>
        <li>Charge: +1 (positive)</li>
        <li>Mass: 1 atomic mass unit (amu)</li>
        <li>Location: Nucleus</li>
        <li><strong>KEY:</strong> Number of protons = Atomic number = Element identity</li>
      </ul>

      <p><strong>Neutrons (n⁰):</strong></p>
      <ul>
        <li>Charge: 0 (neutral)</li>
        <li>Mass: 1 amu</li>
        <li>Location: Nucleus</li>
        <li><strong>KEY:</strong> Neutrons add mass but don't change the element</li>
      </ul>

      <p><strong>Electrons (e⁻):</strong></p>
      <ul>
        <li>Charge: -1 (negative)</li>
        <li>Mass: ~0 (1/1836 of proton mass)</li>
        <li>Location: Electron shells around nucleus</li>
        <li><strong>KEY:</strong> Electrons determine chemical properties and bonding</li>
      </ul>

      <h3>Key Terminology</h3>
      <p><strong>Atomic Number (Z):</strong> Number of protons (defines element)</p>
      <p><strong>Mass Number (A):</strong> Total protons + neutrons</p>
      <p><strong>Notation:</strong> ᴬ_Z X (e.g., ¹²₆C reads "Carbon-12")</p>

      <h3>Electron Configuration</h3>
      <p>Electrons fill shells in order of increasing distance from nucleus.</p>
      <p><strong>Shell capacities:</strong></p>
      <ul>
        <li>1st shell: max 2 electrons</li>
        <li>2nd shell: max 8 electrons</li>
        <li>3rd shell: max 8 electrons</li>
      </ul>

      <p><strong>Filling order:</strong> 1st shell fills first (2e⁻), then 2nd (8e⁻), then 3rd (8e⁻)</p>

      <p><strong>Examples:</strong></p>
      <ul>
        <li>Hydrogen (H): 1 electron → 1st shell: 1</li>
        <li>Carbon (C): 6 electrons → 1st shell: 2, 2nd shell: 4</li>
        <li>Oxygen (O): 8 electrons → 1st shell: 2, 2nd shell: 6</li>
        <li>Sodium (Na): 11 electrons → 1st shell: 2, 2nd shell: 8, 3rd shell: 1</li>
      </ul>

      <h3>Isotopes</h3>
      <p>Isotopes are atoms of the SAME element with DIFFERENT numbers of neutrons.</p>
      <p><strong>Why?</strong> Same protons = same element, different neutrons = different mass</p>

      <p><strong>Example:</strong> Carbon has two main isotopes:</p>
      <ul>
        <li>Carbon-12: 6 protons + 6 neutrons = mass 12</li>
        <li>Carbon-14: 6 protons + 8 neutrons = mass 14</li>
      </ul>
      <p>Both are carbon (same element), but different atomic mass!</p>

      <h3>Ions</h3>
      <p>An ion is an atom that has gained or lost electrons.</p>
      <p><strong>Cation:</strong> Lost electrons → more protons than electrons → positive charge</p>
      <p><strong>Anion:</strong> Gained electrons → more electrons than protons → negative charge</p>

      <p><strong>Example:</strong></p>
      <ul>
        <li>Sodium atom (Na): 11p⁺, 11e⁻ → neutral</li>
        <li>Sodium ion (Na⁺): 11p⁺, 10e⁻ → lost 1 electron, +1 charge</li>
      </ul>

      <h3>Stability and Full Shells</h3>
      <p><strong>Key insight:</strong> Atoms are most stable with a FULL outer shell</p>
      <p>This is why sodium loses its 1 outer electron (empty shell) and chlorine gains 1 (full shell).</p>
    `
  },

  visualizations: [
    {
      id: 'atomic-model-builder',
      type: 'interactive-simulation',
      title: 'Build Your Own Atom',
      description: 'Drag protons, neutrons, electrons to build atoms',
      svgComponent: 'AtomicModelBuilderVisualization'
    },
    {
      id: 'electron-shell-configuration',
      type: 'interactive-simulation',
      title: 'Electron Shell Configuration',
      description: 'Place electrons in shells following rules',
      svgComponent: 'ElectronShellVisualization'
    },
    {
      id: 'periodic-table-structure',
      type: 'interactive-table',
      title: 'Interactive Periodic Table',
      description: 'Click element to see atomic structure',
      svgComponent: 'PeriodicTableVisualization'
    },
    {
      id: 'isotope-comparison',
      type: 'svg-animation',
      title: 'Isotope Comparison',
      description: 'Compare Carbon-12 and Carbon-14',
      svgComponent: 'IsotopeVisualization'
    },
    {
      id: 'ion-formation',
      type: 'interactive-animation',
      title: 'Ion Formation',
      description: 'Watch atoms lose or gain electrons',
      svgComponent: 'IonFormationVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-atom-diagram',
      difficulty: 'easy',
      title: 'Draw Bohr Diagram for Nitrogen',
      problem: 'Draw the Bohr model for Nitrogen (N). Atomic number = 7.',
      steps: [
        {
          step: 1,
          action: 'Find atomic number',
          explanation: 'Nitrogen has atomic number 7',
          work: '7 protons in nucleus'
        },
        {
          step: 2,
          action: 'Add neutrons (for common isotope)',
          explanation: 'Most nitrogen has 7 neutrons',
          work: 'Nitrogen-14: 7 protons + 7 neutrons'
        },
        {
          step: 3,
          action: 'Determine electrons',
          explanation: 'Neutral atom: electrons = protons',
          work: '7 electrons'
        },
        {
          step: 4,
          action: 'Arrange electrons in shells',
          explanation: '1st shell: 2, 2nd shell: 5',
          work: 'Nucleus with 2 electrons in 1st orbit, 5 in 2nd orbit'
        }
      ],
      answer: 'Nucleus (7p, 7n), 1st shell: 2e⁻, 2nd shell: 5e⁻',
      commonMistakes: [
        'Forgetting that protons = atomic number',
        'Wrong electron configuration (not following shell filling rules)'
      ]
    },
    {
      id: 'example-2-mass-number',
      difficulty: 'easy',
      title: 'Calculate Mass Number',
      problem: 'An atom has 8 protons and 9 neutrons. What is the mass number?',
      steps: [
        {
          step: 1,
          action: 'Recall mass number definition',
          explanation: 'Mass number = protons + neutrons',
          work: 'A = Z + N'
        },
        {
          step: 2,
          action: 'Identify values',
          explanation: 'Z = 8 protons, N = 9 neutrons',
          work: ''
        },
        {
          step: 3,
          action: 'Calculate',
          explanation: 'A = 8 + 9',
          work: 'A = 17'
        }
      ],
      answer: 'Mass number = 17',
      commonMistakes: [
        'Including electrons in calculation',
        'Confusing with atomic number'
      ]
    },
    {
      id: 'example-3-electron-config',
      difficulty: 'medium',
      title: 'Electron Configuration for Oxygen',
      problem: 'Write the electron configuration for Oxygen (O, atomic number 8).',
      steps: [
        {
          step: 1,
          action: 'Determine electron count',
          explanation: 'Neutral atom: electrons = protons',
          work: 'Oxygen has 8 electrons'
        },
        {
          step: 2,
          action: 'Fill shells in order',
          explanation: '1st shell: max 2, 2nd shell: max 8',
          work: 'Fill 1st shell with 2 electrons'
        },
        {
          step: 3,
          action: 'Remaining electrons',
          explanation: '8 - 2 = 6 remaining',
          work: 'Put 6 in 2nd shell'
        },
        {
          step: 4,
          action: 'Write configuration',
          explanation: '',
          work: '1st shell: 2, 2nd shell: 6 (or 2.6)'
        }
      ],
      answer: '1st shell: 2, 2nd shell: 6 or (2,6)',
      commonMistakes: [
        'Overfilling a shell',
        'Putting all in one shell'
      ]
    },
    {
      id: 'example-4-isotopes',
      difficulty: 'medium',
      title: 'Compare Isotopes',
      problem: 'Compare Carbon-12 and Carbon-14. Why do they have different masses?',
      steps: [
        {
          step: 1,
          action: 'Both are carbon',
          explanation: 'Same atomic number = 6 protons',
          work: 'Both elements are carbon'
        },
        {
          step: 2,
          action: 'Count neutrons (C-12)',
          explanation: 'Mass number - protons = neutrons',
          work: '12 - 6 = 6 neutrons'
        },
        {
          step: 3,
          action: 'Count neutrons (C-14)',
          explanation: 'Mass number - protons = neutrons',
          work: '14 - 6 = 8 neutrons'
        },
        {
          step: 4,
          action: 'Explain difference',
          explanation: 'Different neutrons = different mass',
          work: 'C-14 has 2 extra neutrons'
        }
      ],
      answer: 'Different neutrons cause different mass. C-14 has 2 more neutrons.',
      commonMistakes: [
        'Thinking isotopes are different elements',
        'Focusing on proton difference (they\'re the same!)'
      ]
    },
    {
      id: 'example-5-ions',
      difficulty: 'medium',
      title: 'Identify Ions',
      problem: 'Sodium atom loses 1 electron. Write the ion symbol and explain the charge.',
      steps: [
        {
          step: 1,
          action: 'Start with neutral atom',
          explanation: 'Sodium (Na): 11 protons, 11 electrons',
          work: 'Neutral (charge = 0)'
        },
        {
          step: 2,
          action: 'Lose 1 electron',
          explanation: 'Now: 11 protons, 10 electrons',
          work: ''
        },
        {
          step: 3,
          action: 'Count charge',
          explanation: '11 positive protons, 10 negative electrons',
          work: 'Net charge = +1'
        },
        {
          step: 4,
          action: 'Write symbol',
          explanation: 'Add + to show it\'s an ion',
          work: 'Na⁺ (sodium ion)'
        }
      ],
      answer: 'Na⁺ - more protons than electrons, so +1 charge',
      commonMistakes: [
        'Confusing number of electrons lost with charge',
        'Wrong symbol format'
      ]
    },
    {
      id: 'example-6-stability',
      difficulty: 'hard',
      title: 'Explain Why Atoms Form Ions',
      problem: 'Why does sodium (Na) lose 1 electron easily, while chlorine (Cl) gains 1 electron?',
      steps: [
        {
          step: 1,
          action: 'Electron configs',
          explanation: 'Na: 2,8,1 | Cl: 2,8,7',
          work: ''
        },
        {
          step: 2,
          action: 'Look at outer shells',
          explanation: 'Na has 1 outer electron, Cl has 7',
          work: ''
        },
        {
          step: 3,
          action: 'Stability principle',
          explanation: 'Atoms prefer FULL outer shells (noble gas config)',
          work: 'Full outer shell = 8 electrons'
        },
        {
          step: 4,
          action: 'Explain sodium',
          explanation: 'Na easily loses 1 electron → outer shell becomes full (2,8)',
          work: 'Reaches stable configuration'
        },
        {
          step: 5,
          action: 'Explain chlorine',
          explanation: 'Cl easily gains 1 electron → reaches full outer shell (2,8,8)',
          work: 'Reaches stable configuration'
        }
      ],
      answer: 'Both achieve full outer shells → stable configurations',
      commonMistakes: []
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which particle has positive charge?',
      options: ['Proton', 'Electron', 'Neutron', 'Neutrino'],
      correctAnswer: 'Proton',
      explanation: ''
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Atomic number = number of ___',
      correctAnswers: ['protons', 'proton'],
      explanation: ''
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Electrons are located in:',
      options: ['Nucleus', 'Electron shells', 'Neutrons', 'Protons'],
      correctAnswer: 'Electron shells',
      explanation: ''
    },
    {
      id: 'practice-4',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'First shell can hold max ___ electrons',
      correctAnswers: ['2'],
      explanation: ''
    },
    {
      id: 'practice-5',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Carbon-12 and Carbon-14 differ in:',
      options: ['Protons', 'Electrons', 'Neutrons', 'Charge'],
      correctAnswer: 'Neutrons',
      explanation: 'Same element (same protons) but different neutrons = isotopes'
    },
    {
      id: 'practice-6',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Electron configuration for Nitrogen (7e⁻): 1st shell=___, 2nd shell=___',
      correctAnswers: ['2, 5', '2,5'],
      explanation: ''
    },
    {
      id: 'practice-7',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'An ion with more protons than electrons has:',
      options: ['Negative charge', 'Positive charge', 'No charge', 'Variable charge'],
      correctAnswer: 'Positive charge',
      explanation: 'More + than - = net positive'
    },
    {
      id: 'practice-8',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Mass number of atom with 6p, 8n = ___',
      correctAnswers: ['14'],
      explanation: 'A = Z + N = 6 + 8'
    },
    {
      id: 'practice-9',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Why are noble gases unreactive?',
      options: ['No protons', 'Full outer shell', 'No electrons', 'Too small'],
      correctAnswer: 'Full outer shell',
      explanation: ''
    },
    {
      id: 'practice-10',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Which has more mass: proton or electron?',
      options: ['Proton', 'Electron', 'Same', 'Depends on atom'],
      correctAnswer: 'Proton',
      explanation: 'Proton is ~1836× heavier'
    }
  ],

  topicQuiz: {
    id: 'atoms-particles-quiz',
    title: 'Atoms & Subatomic Particles Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'Nucleus contains: ___ and ___',
        correctAnswers: ['protons and neutrons', 'protons, neutrons'],
        explanation: ''
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'Element identity determined by:',
        options: ['Neutrons', 'Electrons', 'Protons', 'Ions'],
        correctAnswer: 'Protons',
        explanation: ''
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'Electron charge: ___',
        correctAnswers: ['-1', 'negative'],
        explanation: ''
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'Isotopes same element, different:',
        options: ['Protons', 'Electrons', 'Neutrons', 'Charge'],
        correctAnswer: 'Neutrons',
        explanation: ''
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: '2nd shell max electrons: ___',
        correctAnswers: ['8'],
        explanation: ''
      },
      {
        id: 'quiz-6',
        type: 'multiple-choice',
        question: 'Cation is:',
        options: ['Lost electrons', 'Gained electrons', 'Neutral', 'Radioactive'],
        correctAnswer: 'Lost electrons',
        explanation: ''
      },
      {
        id: 'quiz-7',
        type: 'fill-blank',
        question: 'Atom: 5p, 6n → mass number = ___',
        correctAnswers: ['11'],
        explanation: ''
      },
      {
        id: 'quiz-8',
        type: 'multiple-choice',
        question: 'Most of atom\'s mass is in:',
        options: ['Electrons', 'Nucleus', 'Outer shells', 'Empty space'],
        correctAnswer: 'Nucleus',
        explanation: ''
      },
      {
        id: 'quiz-9',
        type: 'fill-blank',
        question: 'Oxygen config (8e⁻): ___',
        correctAnswers: ['2,6', '2.6'],
        explanation: ''
      },
      {
        id: 'quiz-10',
        type: 'multiple-choice',
        question: 'Why Cl⁻ is stable:',
        options: ['Lost electron', 'Gained electron', 'Full outer shell', 'Heavy nucleus'],
        correctAnswer: 'Full outer shell',
        explanation: ''
      }
    ]
  },

  practiceExam: {
    id: 'atoms-particles-exam',
    title: 'Atoms & Subatomic Particles Exam',
    timeLimit: 5400,
    totalMarks: 100,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'multiple-choice',
        question: 'Neutrons have charge:',
        options: ['+1', '-1', '0', '+½'],
        correctAnswer: '0',
        explanation: ''
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'fill-blank',
        question: 'Atomic number = ___',
        correctAnswers: ['number of protons', 'protons'],
        explanation: ''
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'multiple-choice',
        question: 'Carbon-12: 6p, 6n, 6e. Carbon-14: 6p, 8n, 6e. Difference:',
        options: ['Element type', 'Isotopes', 'Ions', 'Charge'],
        correctAnswer: 'Isotopes',
        explanation: ''
      },
      {
        id: 'exam-4',
        marks: 3,
        type: 'fill-blank',
        question: 'Silicon (14e⁻) config: 1st=2, 2nd=8, 3rd=___',
        correctAnswers: ['4'],
        explanation: ''
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'fill-blank',
        question: 'Atom: 8p, 10e → charge = ___',
        correctAnswers: ['-2', 'negative 2', '2-'],
        explanation: 'More electrons than protons'
      },
      {
        id: 'exam-6',
        marks: 3,
        type: 'multiple-choice',
        question: 'Electron configuration determines:',
        options: ['Element', 'Chemical properties', 'Nuclear size', 'Neutron count'],
        correctAnswer: 'Chemical properties',
        explanation: ''
      },
      {
        id: 'exam-7',
        marks: 4,
        type: 'fill-blank',
        question: 'Atom with 7p, 8n, 7e → symbol = ___',
        correctAnswers: ['N', 'nitrogen', '¹⁵N'],
        explanation: ''
      },
      {
        id: 'exam-8',
        marks: 4,
        type: 'multiple-choice',
        question: 'Nucleus most dense because:',
        options: ['Tightly packed protons/neutrons', 'Many electrons', 'Strong force', 'Mass concentrated'],
        correctAnswer: 'Tightly packed protons/neutrons',
        explanation: ''
      },
      {
        id: 'exam-9',
        marks: 4,
        type: 'fill-blank',
        question: 'Fluorine (9p) loses 1e⁻ → becomes ___ with charge ___',
        correctAnswers: ['F⁺, +1', 'fluorine ion, positive'],
        explanation: ''
      },
      {
        id: 'exam-10',
        marks: 5,
        type: 'fill-blank',
        question: 'Explain why sodium easily forms Na⁺ (hint: electron config)',
        correctAnswers: ['has 1 outer electron', 'loses to get full outer shell', 'reaches stable config'],
        explanation: 'Na: 2,8,1 → loses 1 → becomes 2,8 (full shell, like Ne)'
      }
    ]
  }
};
