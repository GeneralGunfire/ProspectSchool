export const chemicalBonding = {
  id: 'chemical-bonding',
  title: 'Chemical Bonding',
  description: 'Understand ionic and covalent bonds, Lewis structures, and bond types',
  grade: 10,
  term: 1,
  subject: 'chemistry',

  conceptExplanation: {
    title: 'Chemical Bonding',
    content: `
      <h3>Why Do Atoms Bond?</h3>
      <p><strong>Stability:</strong> Atoms want full outer shells (8 electrons for most, 2 for H/He)</p>
      <p>Atoms bond to achieve this stability. There are different ways to do it!</p>

      <h3>Two Main Types of Chemical Bonds</h3>

      <h3>1. IONIC BONDING (Electron Transfer)</h3>
      <p><strong>What happens:</strong> One atom TRANSFERS electrons to another atom</p>
      <p><strong>Result:</strong> Atoms become ions (charged)</p>
      <p><strong>Attraction:</strong> Opposite charges attract (cation + to anion -)</p>

      <p><strong>When does it happen?</strong> When electronegativity difference is LARGE (>1.7)</p>
      <p><strong>Example: Sodium Chloride (NaCl)</strong></p>
      <ul>
        <li>Na: 11 electrons, has 1 outer electron (Group 1)</li>
        <li>Cl: 17 electrons, has 7 outer electrons (Group 17)</li>
        <li>Na TRANSFERS 1 electron to Cl</li>
        <li>Na becomes Na⁺ (lost 1e⁻, positive)</li>
        <li>Cl becomes Cl⁻ (gained 1e⁻, negative)</li>
        <li>Na⁺ and Cl⁻ attract → ionic bond → NaCl formed</li>
      </ul>

      <p><strong>Properties of Ionic Compounds:</strong></p>
      <ul>
        <li>High melting/boiling points (strong attractions)</li>
        <li>Conduct electricity when melted or dissolved (ions move)</li>
        <li>Often soluble in water</li>
        <li>Brittle (ions repel when forced together wrong way)</li>
      </ul>

      <h3>2. COVALENT BONDING (Electron Sharing)</h3>
      <p><strong>What happens:</strong> Atoms SHARE electrons</p>
      <p><strong>Result:</strong> Atoms stay neutral (no charge)</p>
      <p><strong>Attraction:</strong> Shared electrons attract both nuclei</p>

      <p><strong>When does it happen?</strong> When electronegativity difference is SMALL (<1.7)</p>
      <p><strong>Example: Hydrogen gas (H₂)</strong></p>
      <ul>
        <li>Two H atoms, each needs 1 more electron</li>
        <li>Neither can GIVE an electron (equal power)</li>
        <li>They SHARE a pair of electrons</li>
        <li>Both get what they need → H₂ molecule forms</li>
      </ul>

      <p><strong>Example: Water (H₂O)</strong></p>
      <ul>
        <li>O needs 2 more electrons</li>
        <li>Each H needs 1 more electron</li>
        <li>O SHARES electrons with 2 H atoms</li>
        <li>All get full outer shells</li>
      </ul>

      <p><strong>Properties of Covalent Compounds:</strong></p>
      <ul>
        <li>Low melting/boiling points (weak attractions)</li>
        <li>Poor electrical conductors (no free ions)</li>
        <li>Often insoluble in water</li>
        <li>Often gases or liquids at room temperature</li>
      </ul>

      <h3>Lewis Dot Structures</h3>
      <p>A way to show valence electrons and bonding</p>
      <p><strong>Steps:</strong></p>
      <ol>
        <li>Count total valence electrons</li>
        <li>Place atom in center, arrange others around</li>
        <li>Draw lines (bonds) between atoms that share/transfer electrons</li>
        <li>Show remaining lone pairs with dots</li>
      </ol>

      <p><strong>Example: NaCl (ionic)</strong></p>
      <p>Na has 1 dot → transfers to Cl (which has 7 dots) → Na⁺ (0 dots), Cl⁻ (8 dots)</p>

      <p><strong>Example: Cl₂ (covalent)</strong></p>
      <p>Two Cl atoms (7 dots each) → share 1 pair → both get 8 electrons</p>

      <h3>Single, Double, Triple Bonds</h3>
      <p><strong>Single bond (—):</strong> 2 electrons shared (1 pair)</p>
      <p><strong>Double bond (=):</strong> 4 electrons shared (2 pairs)</p>
      <p><strong>Triple bond (≡):</strong> 6 electrons shared (3 pairs)</p>

      <p><strong>Example: O₂ (oxygen gas)</strong></p>
      <p>Each O needs 2 more electrons → share 2 pairs → O=O (double bond)</p>

      <h3>Electronegativity and Bond Type</h3>
      <ul>
        <li><strong>Difference > 1.7:</strong> Ionic bond (electron transfer)</li>
        <li><strong>Difference 0.4-1.7:</strong> Polar covalent (unequal sharing)</li>
        <li><strong>Difference < 0.4:</strong> Nonpolar covalent (equal sharing)</li>
      </ul>

      <h3>Key Distinctions</h3>
      <ul>
        <li><strong>Ionic:</strong> Electron transfer, ions formed, high melting points</li>
        <li><strong>Covalent:</strong> Electron sharing, molecules formed, low melting points</li>
        <li><strong>Both:</strong> Attempt to achieve full outer shells</li>
      </ul>
    `
  },

  visualizations: [
    {
      id: 'electron-transfer-animation',
      type: 'interactive-animation',
      title: 'Electron Transfer (Ionic Bonding)',
      description: 'Watch sodium electron jump to chlorine',
      svgComponent: 'ElectronTransferVisualization'
    },
    {
      id: 'electron-sharing-animation',
      type: 'interactive-animation',
      title: 'Electron Sharing (Covalent Bonding)',
      description: 'See how atoms share electrons',
      svgComponent: 'ElectronSharingVisualization'
    },
    {
      id: 'lewis-structure-builder',
      type: 'interactive-simulation',
      title: 'Lewis Structure Builder',
      description: 'Drag electrons to show bonding',
      svgComponent: 'LewisStructureBuilderVisualization'
    },
    {
      id: 'bond-type-predictor',
      type: 'interactive-tool',
      title: 'Bond Type Predictor',
      description: 'Input two elements, predict ionic vs covalent',
      svgComponent: 'BondTypePredictorVisualization'
    },
    {
      id: 'compound-properties-compare',
      type: 'svg-animation',
      title: 'Ionic vs Covalent Properties',
      description: 'Compare melting points, solubility, conductivity',
      svgComponent: 'CompoundPropertiesVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-nacl-formation',
      difficulty: 'easy',
      title: 'Ionic Bond Formation: NaCl',
      problem: 'Explain how Na and Cl bond to form NaCl.',
      steps: [
        {
          step: 1,
          action: 'Electron configurations',
          explanation: 'Na: 2,8,1 (1 outer) | Cl: 2,8,7 (7 outer)',
          work: ''
        },
        {
          step: 2,
          action: 'Problem',
          explanation: 'Both want 8 outer electrons for stability',
          work: ''
        },
        {
          step: 3,
          action: 'Solution',
          explanation: 'Na loses 1 (easier than gaining 7). Cl gains 1 (easier than losing 7)',
          work: 'Electron TRANSFER'
        },
        {
          step: 4,
          action: 'Result',
          explanation: 'Na⁺ (lost 1e⁻) and Cl⁻ (gained 1e⁻)',
          work: ''
        },
        {
          step: 5,
          action: 'Bonding',
          explanation: 'Opposite charges attract → ionic bond',
          work: 'NaCl forms'
        }
      ],
      answer: 'Na transfers electron to Cl → Na⁺ and Cl⁻ attract → ionic bond',
      commonMistakes: [
        'Thinking they share electrons (no — transfer)',
        'Wrong charge assignments'
      ]
    },
    {
      id: 'example-2-h2-formation',
      difficulty: 'easy',
      title: 'Covalent Bond Formation: H₂',
      problem: 'Explain how two hydrogen atoms bond to form H₂.',
      steps: [
        {
          step: 1,
          action: 'Single hydrogen',
          explanation: 'H has 1 electron, needs 2 (like He)',
          work: ''
        },
        {
          step: 2,
          action: 'Two hydrogens',
          explanation: 'Each needs 1 more electron',
          work: ''
        },
        {
          step: 3,
          action: 'Can transfer happen?',
          explanation: 'No — neither is "stronger" (equal electronegativity)',
          work: 'Can\'t do electron transfer'
        },
        {
          step: 4,
          action: 'Solution',
          explanation: 'They SHARE 1 pair of electrons',
          work: 'H:H or H-H'
        },
        {
          step: 5,
          action: 'Result',
          explanation: 'Both H now have 2 electrons → stable',
          work: 'Covalent bond'
        }
      ],
      answer: 'Two H share 1 electron pair → H₂ molecule (covalent bond)',
      commonMistakes: [
        'Thinking one H gives electron to other',
        'Not understanding why sharing instead of transfer'
      ]
    },
    {
      id: 'example-3-lewis-structure',
      difficulty: 'medium',
      title: 'Draw Lewis Structure: Cl₂',
      problem: 'Draw the Lewis structure for Cl₂.',
      steps: [
        {
          step: 1,
          action: 'Valence electrons',
          explanation: 'Cl is Group 17, so 7 valence electrons each',
          work: 'Total: 7 + 7 = 14 electrons'
        },
        {
          step: 2,
          action: 'Arrange atoms',
          explanation: 'Two Cl atoms bonded together',
          work: 'Cl-Cl'
        },
        {
          step: 3,
          action: 'Connect with bond',
          explanation: 'They share 2 electrons (1 pair)',
          work: 'Cl:Cl (or Cl-Cl with line)'
        },
        {
          step: 4,
          action: 'Remaining electrons',
          explanation: 'Each Cl has 6 electrons left (3 pairs) as lone pairs',
          work: 'Draw dots: each Cl has 3 pairs of dots plus shared pair'
        }
      ],
      answer: 'Two Cl atoms with single bond (Cl-Cl), each with 3 lone pairs',
      commonMistakes: [
        'Wrong electron count',
        'Forgetting lone pairs'
      ]
    },
    {
      id: 'example-4-predict-bond-type',
      difficulty: 'medium',
      title: 'Predict Bond Type: NaCl vs H₂O',
      problem: 'Is NaCl ionic or covalent? Is H₂O ionic or covalent?',
      steps: [
        {
          step: 1,
          action: 'NaCl analysis',
          explanation: 'Na (metal) with Cl (nonmetal), very different electronegativity',
          work: 'Difference > 1.7 → IONIC'
        },
        {
          step: 2,
          action: 'NaCl bonding',
          explanation: 'Na transfers electron to Cl',
          work: 'Ionic compound (Na⁺ Cl⁻)'
        },
        {
          step: 3,
          action: 'H₂O analysis',
          explanation: 'H (nonmetal) with O (nonmetal), similar enough',
          work: 'Difference 0.4-1.7 → COVALENT'
        },
        {
          step: 4,
          action: 'H₂O bonding',
          explanation: 'H and O share electrons',
          work: 'Covalent compound (H₂O molecule)'
        }
      ],
      answer: 'NaCl is ionic, H₂O is covalent',
      commonMistakes: [
        'Thinking all compounds with metals are ionic',
        'Not using electronegativity difference'
      ]
    },
    {
      id: 'example-5-compound-properties',
      difficulty: 'medium',
      title: 'Explain Property Differences',
      problem: 'Why does NaCl dissolve in water but H₂ doesn\'t?',
      steps: [
        {
          step: 1,
          action: 'NaCl properties',
          explanation: 'Ionic compound → positive and negative ions',
          work: ''
        },
        {
          step: 2,
          action: 'In water',
          explanation: 'Water molecules (polar) surround ions',
          work: 'Na⁺ and Cl⁻ separate and dissolve'
        },
        {
          step: 3,
          action: 'H₂ properties',
          explanation: 'Covalent molecule → nonpolar, no ions',
          work: ''
        },
        {
          step: 4,
          action: 'In water',
          explanation: 'Water can\'t interact with nonpolar H₂',
          work: 'H₂ doesn\'t dissolve (immiscible)'
        }
      ],
      answer: 'Ionic compounds dissolve (ions interact with water). Covalent nonpolar compounds don\'t.',
      commonMistakes: []
    },
    {
      id: 'example-6-bond-order',
      difficulty: 'hard',
      title: 'Identify Bond Types in O₂',
      problem: 'Why is O₂ a double bond, not single?',
      steps: [
        {
          step: 1,
          action: 'Single bond attempt',
          explanation: 'If O=O share 1 pair: each O has 6 + 1 = 7 electrons',
          work: 'Not full shell (needs 8)'
        },
        {
          step: 2,
          action: 'Double bond',
          explanation: 'Share 2 pairs: each O has 6 + 2 = 8 electrons',
          work: 'Full shell — stable!'
        },
        {
          step: 3,
          action: 'Conclusion',
          explanation: 'O atoms need 2 pairs shared',
          work: 'O=O (double bond)'
        }
      ],
      answer: 'O needs 2 shared pairs for full shell → O=O double bond',
      commonMistakes: [
        'Not counting electrons correctly',
        'Not knowing atoms need full shells'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Ionic bonding is:',
      options: ['Electron sharing', 'Electron transfer', 'Force', 'Attraction'],
      correctAnswer: 'Electron transfer',
      explanation: ''
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Covalent bonding = electron ___',
      correctAnswers: ['sharing'],
      explanation: ''
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'NaCl is primarily:',
      options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
      correctAnswer: 'Ionic',
      explanation: 'Na transfers electron to Cl'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Which has ionic bond?',
      options: ['H₂', 'H₂O', 'NaCl', 'O₂'],
      correctAnswer: 'NaCl',
      explanation: ''
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Ionic compounds conduct when ___ or ___',
      correctAnswers: ['melted, dissolved', 'molten, dissolved'],
      explanation: ''
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Bond type predictor: electronegativity difference?',
      options: ['>1.7 covalent', '>1.7 ionic', '<0.4 ionic', 'None'],
      correctAnswer: '>1.7 ionic',
      explanation: ''
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Lewis dot shows ___ electrons',
      correctAnswers: ['valence'],
      explanation: ''
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Why O₂ has double bond:',
      options: ['Share 1 pair', 'Share 2 pairs', 'Transfer electron', 'Repulsion'],
      correctAnswer: 'Share 2 pairs',
      explanation: 'Each O needs 2 more electrons'
    },
    {
      id: 'practice-9',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Covalent compounds often:',
      options: ['Conduct electricity', 'High melting point', 'Low melting point', 'Soluble in water'],
      correctAnswer: 'Low melting point',
      explanation: 'Weak intermolecular forces'
    },
    {
      id: 'practice-10',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Which is polar covalent?',
      options: ['H₂', 'NaCl', 'H₂O', 'O₂'],
      correctAnswer: 'H₂O',
      explanation: 'Electronegativity difference 0.4-1.7'
    }
  ],

  topicQuiz: {
    id: 'chemical-bonding-quiz',
    title: 'Chemical Bonding Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Atoms bond to:',
        options: ['Release energy', 'Get full outer shell', 'Gain mass', 'Change color'],
        correctAnswer: 'Get full outer shell',
        explanation: ''
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'Ionic compound example: ___',
        correctAnswers: ['NaCl', 'salt', 'sodium chloride'],
        explanation: ''
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Covalent bond:',
        options: ['Ions attract', 'Electrons shared', 'Electrons transfer', 'Forces'],
        correctAnswer: 'Electrons shared',
        explanation: ''
      },
      {
        id: 'quiz-4',
        type: 'fill-blank',
        question: 'Lewis structure shows ___ electrons',
        correctAnswers: ['valence', 'outer'],
        explanation: ''
      },
      {
        id: 'quiz-5',
        type: 'multiple-choice',
        question: 'Ionic compounds conduct when:',
        options: ['Solid', 'Melted', 'Cool', 'Always'],
        correctAnswer: 'Melted',
        explanation: ''
      },
      {
        id: 'quiz-6',
        type: 'fill-blank',
        question: 'Single bond = ___ electrons shared',
        correctAnswers: ['2', 'two'],
        explanation: ''
      },
      {
        id: 'quiz-7',
        type: 'multiple-choice',
        question: 'Large electronegativity difference:',
        options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
        correctAnswer: 'Ionic',
        explanation: ''
      },
      {
        id: 'quiz-8',
        type: 'fill-blank',
        question: 'Covalent compounds have ___ melting points',
        correctAnswers: ['low'],
        explanation: ''
      },
      {
        id: 'quiz-9',
        type: 'multiple-choice',
        question: 'H₂O bonding is:',
        options: ['Ionic', 'Covalent', 'Both', 'Neither'],
        correctAnswer: 'Covalent',
        explanation: ''
      },
      {
        id: 'quiz-10',
        type: 'fill-blank',
        question: 'Na loses ___ electron(s) to Cl',
        correctAnswers: ['1', 'one'],
        explanation: ''
      }
    ]
  },

  practiceExam: {
    id: 'chemical-bonding-exam',
    title: 'Chemical Bonding Exam',
    timeLimit: 5400,
    totalMarks: 100,
    questions: [
      {
        id: 'exam-1',
        marks: 3,
        type: 'multiple-choice',
        question: 'Ionic bonding requires:',
        options: ['Equal atoms', 'Metal + nonmetal', 'Two nonmetals', 'Electrons only'],
        correctAnswer: 'Metal + nonmetal',
        explanation: ''
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'fill-blank',
        question: 'NaCl: Na⁺ charge = ___, Cl⁻ charge = ___',
        correctAnswers: ['+1, -1', '+1 and -1'],
        explanation: ''
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'multiple-choice',
        question: 'Covalent bond property:',
        options: ['High melting', 'Conducts solid', 'Shared electrons', 'Ions formed'],
        correctAnswer: 'Shared electrons',
        explanation: ''
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'fill-blank',
        question: 'Lewis for H₂O: H shares with O using ___ electron pairs',
        correctAnswers: ['2', 'two'],
        explanation: ''
      },
      {
        id: 'exam-5',
        marks: 3,
        type: 'multiple-choice',
        question: 'Bond type if EN difference = 0.5:',
        options: ['Ionic', 'Polar covalent', 'Nonpolar covalent', 'Metallic'],
        correctAnswer: 'Nonpolar covalent',
        explanation: ''
      },
      {
        id: 'exam-6',
        marks: 4,
        type: 'fill-blank',
        question: 'O₂ has ___ bond (single/double/triple)',
        correctAnswers: ['double'],
        explanation: ''
      },
      {
        id: 'exam-7',
        marks: 3,
        type: 'multiple-choice',
        question: 'Ionic compounds in water:',
        options: ['Stay solid', 'Dissolve (ions separate)', 'Precipitate', 'React'],
        correctAnswer: 'Dissolve (ions separate)',
        explanation: ''
      },
      {
        id: 'exam-8',
        marks: 4,
        type: 'fill-blank',
        question: 'Why H₂ forms covalent (not ionic):',
        correctAnswers: ['equal atoms', 'equal electronegativity', 'no electron transfer possible'],
        explanation: ''
      },
      {
        id: 'exam-9',
        marks: 4,
        type: 'multiple-choice',
        question: 'Compare NaCl (ionic) vs H₂O (covalent): melting points?',
        options: ['NaCl higher', 'H₂O higher', 'Same', 'Can\'t compare'],
        correctAnswer: 'NaCl higher',
        explanation: 'Ionic: strong attractions. Covalent: weak'
      },
      {
        id: 'exam-10',
        marks: 5,
        type: 'fill-blank',
        question: 'Explain: Why does NaCl conduct when melted but H₂ doesn\'t',
        correctAnswers: ['NaCl has ions that move', 'H₂ has no ions', 'ions are mobile in liquid', 'covalent no ions'],
        explanation: 'Ionic: melted compound releases mobile ions. Covalent: no ions to conduct'
      }
    ]
  }
};
