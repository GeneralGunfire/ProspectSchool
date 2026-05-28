export const classificationOfMatter = {
  id: 'classification-matter',
  title: 'Classification of Matter',
  description: 'Understand pure substances, mixtures, physical and chemical changes',
  grade: 10,
  term: 1,
  subject: 'chemistry',

  conceptExplanation: {
    title: 'Classification of Matter',
    content: `
      <h3>The Big Picture</h3>
      <p>Matter can be classified in two main ways:</p>
      <p><strong>By composition:</strong> Pure substances vs Mixtures</p>
      <p><strong>By type of change:</strong> Physical vs Chemical</p>

      <h3>Pure Substances</h3>
      <p>A pure substance has a fixed composition and definite properties.</p>
      <p><strong>Examples:</strong> Water (H₂O), salt (NaCl), oxygen gas (O₂), diamond (C)</p>
      <p><strong>Key:</strong> Same composition always = same properties always</p>

      <p><strong>Two types of pure substances:</strong></p>
      <p><strong>1. Elements:</strong> Made of one type of atom (O₂, Fe, C)</p>
      <p><strong>2. Compounds:</strong> Made of two or more elements bonded together (H₂O, NaCl, CO₂)</p>

      <h3>Mixtures</h3>
      <p>A mixture is a combination of two or more pure substances that are NOT chemically bonded.</p>
      <p><strong>Key property:</strong> Each component keeps its own properties</p>
      <p><strong>Example:</strong> Salt water = salt + water (both keep their properties, not bonded)</p>

      <p><strong>Types of mixtures:</strong></p>

      <p><strong>1. Solutions:</strong> Homogeneous (looks uniform), particles invisible</p>
      <ul>
        <li><strong>Solute:</strong> The dissolved substance (usually less)</li>
        <li><strong>Solvent:</strong> The dissolving substance (usually more)</li>
        <li><strong>Examples:</strong> Salt water, sugar in coffee, air (mixture of gases)</li>
      </ul>

      <p><strong>2. Suspensions:</strong> Heterogeneous (looks non-uniform), particles visible under microscope</p>
      <ul>
        <li>Particles will settle over time</li>
        <li><strong>Examples:</strong> Mud in water, sand in water, blood</li>
      </ul>

      <p><strong>3. Colloids:</strong> Heterogeneous looking, but particles don't settle</p>
      <ul>
        <li>Particles stay suspended (colloidal particles ~1-1000 nm)</li>
        <li><strong>Examples:</strong> Milk, fog, paint, jelly</li>
      </ul>

      <h3>Physical Change</h3>
      <p>A change in the form or state of matter, but NOT the substance itself.</p>
      <p><strong>Key:</strong> The COMPOSITION doesn't change (same atoms/molecules)</p>
      <p><strong>Usually reversible!</strong></p>

      <p><strong>Examples:</strong></p>
      <ul>
        <li>Melting ice → water (still H₂O)</li>
        <li>Boiling water → steam (still H₂O)</li>
        <li>Breaking glass → glass pieces (still glass)</li>
        <li>Dissolving salt in water → salt solution (salt + water unchanged)</li>
      </ul>

      <h3>Chemical Change</h3>
      <p>A change where NEW substances are formed.</p>
      <p><strong>Key:</strong> The COMPOSITION changes (atoms rearrange into new molecules)</p>
      <p><strong>Usually irreversible!</strong></p>

      <p><strong>Signs of chemical change:</strong></p>
      <ul>
        <li>Color change (not just mixing colors)</li>
        <li>Heat release or absorption</li>
        <li>Gas production</li>
        <li>Precipitate formation (solid appears in solution)</li>
        <li>Light production</li>
      </ul>

      <p><strong>Examples:</strong></p>
      <ul>
        <li>Burning paper → ash + CO₂ + H₂O (new substances!)</li>
        <li>Rusting iron → iron oxide (new compound)</li>
        <li>Baking cake → new substances formed (not just mixing ingredients)</li>
        <li>Digestion → food broken down into new molecules</li>
      </ul>

      <h3>States of Matter</h3>
      <p><strong>Solid:</strong> Fixed shape, fixed volume, particles tightly packed, vibrating in place</p>
      <p><strong>Liquid:</strong> Flows, fixed volume, particles close but can move, taking container shape</p>
      <p><strong>Gas:</strong> Flows, no fixed volume, particles far apart, moving randomly</p>

      <h3>Phase Transitions</h3>
      <ul>
        <li><strong>Melting:</strong> Solid → Liquid (heating breaks structure)</li>
        <li><strong>Freezing:</strong> Liquid → Solid (cooling restores structure)</li>
        <li><strong>Boiling:</strong> Liquid → Gas (molecules escape)</li>
        <li><strong>Condensation:</strong> Gas → Liquid (cooling causes gathering)</li>
        <li><strong>Sublimation:</strong> Solid → Gas (directly, skipping liquid)</li>
      </ul>

      <h3>Separation Techniques</h3>
      <p><strong>Filtration:</strong> Separates solids from liquids (sand from water)</p>
      <p><strong>Evaporation:</strong> Removes solvent (water) to get solute (salt) behind</p>
      <p><strong>Distillation:</strong> Boils liquid, cools vapor back to liquid (separates by boiling point)</p>
      <p><strong>Chromatography:</strong> Separates by how particles stick to paper/medium</p>

      <h3>Key Distinctions</h3>
      <ul>
        <li><strong>Physical change:</strong> Reversible, same substance, no new atoms formed</li>
        <li><strong>Chemical change:</strong> Usually irreversible, new substances, atoms rearrange</li>
        <li><strong>Solution:</strong> Uniform, solute dissolved (molecular level)</li>
        <li><strong>Suspension:</strong> Non-uniform, particles visible, will settle</li>
      </ul>
    `
  },

  visualizations: [
    {
      id: 'pure-vs-mixture',
      type: 'svg-animation',
      title: 'Pure Substances vs Mixtures',
      description: 'Particle diagram showing the difference',
      svgComponent: 'PureVsMixtureVisualization'
    },
    {
      id: 'states-of-matter',
      type: 'interactive-animation',
      title: 'States of Matter',
      description: 'Particle movement in solid, liquid, and gas',
      svgComponent: 'StatesOfMatterVisualization'
    },
    {
      id: 'phase-diagram',
      type: 'interactive-graph',
      title: 'Phase Diagram & Heating Curve',
      description: 'Temperature vs state, showing phase changes',
      svgComponent: 'PhaseDiagramVisualization'
    },
    {
      id: 'physical-vs-chemical',
      type: 'svg-animation',
      title: 'Physical vs Chemical Change',
      description: 'Contrast reversible changes with new substance formation',
      svgComponent: 'PhysicalVsChemicalVisualization'
    },
    {
      id: 'mixture-separator',
      type: 'interactive-simulation',
      title: 'Separation Techniques',
      description: 'See how filtration, evaporation, and distillation work',
      svgComponent: 'SeparationTechniquesVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-classify',
      difficulty: 'easy',
      title: 'Classify Matter Types',
      problem: 'Classify each: (a) pure water, (b) salt water, (c) sand + water, (d) oxygen gas',
      steps: [
        {
          step: 1,
          action: '(a) Pure water',
          explanation: 'Fixed composition, one substance H₂O',
          work: 'Pure substance (compound)'
        },
        {
          step: 2,
          action: '(b) Salt water',
          explanation: 'Salt and water mixed, uniform appearance, not bonded',
          work: 'Mixture (solution)'
        },
        {
          step: 3,
          action: '(c) Sand + water',
          explanation: 'Visible particles, non-uniform',
          work: 'Mixture (suspension)'
        },
        {
          step: 4,
          action: '(d) Oxygen gas',
          explanation: 'Single element O₂, fixed composition',
          work: 'Pure substance (element)'
        }
      ],
      answer: '(a) Pure, (b) Solution, (c) Suspension, (d) Pure element',
      commonMistakes: [
        'Thinking salt water is a pure substance (it\'s a mixture)',
        'Confusing suspension and solution'
      ]
    },
    {
      id: 'example-2-physical-change',
      difficulty: 'easy',
      title: 'Identify Physical Change',
      problem: 'Why is melting ice a physical change?',
      steps: [
        {
          step: 1,
          action: 'Look at composition',
          explanation: 'Ice = H₂O molecules',
          work: ''
        },
        {
          step: 2,
          action: 'After melting',
          explanation: 'Water = same H₂O molecules',
          work: 'Same molecules, just rearranged'
        },
        {
          step: 3,
          action: 'Is it reversible?',
          explanation: 'Yes! Can refreeze water to ice',
          work: 'Reversible = physical change'
        },
        {
          step: 4,
          action: 'Conclusion',
          explanation: 'No new substances formed, still H₂O',
          work: 'Physical change'
        }
      ],
      answer: 'Same substance (H₂O), form changes, reversible = physical',
      commonMistakes: []
    },
    {
      id: 'example-3-chemical-change',
      difficulty: 'easy',
      title: 'Identify Chemical Change',
      problem: 'Why is burning paper a chemical change?',
      steps: [
        {
          step: 1,
          action: 'Original: paper',
          explanation: 'Contains cellulose (C, H, O)',
          work: ''
        },
        {
          step: 2,
          action: 'During burning',
          explanation: 'Heat + oxygen → new substances form',
          work: 'Produces ash, CO₂, H₂O'
        },
        {
          step: 3,
          action: 'Are atoms rearranged?',
          explanation: 'Yes! New molecules formed (CO₂, H₂O)',
          work: 'Not reversible by cooling'
        },
        {
          step: 4,
          action: 'Conclusion',
          explanation: 'New substances = chemical change',
          work: 'Chemical change'
        }
      ],
      answer: 'New substances formed, not reversible = chemical change',
      commonMistakes: [
        'Thinking all changes that break things are physical',
        'Not recognizing new substances'
      ]
    },
    {
      id: 'example-4-phase-transition',
      difficulty: 'medium',
      title: 'Understand Boiling Point Plateau',
      problem: 'Why does temperature stay constant during boiling even though we\'re adding heat?',
      steps: [
        {
          step: 1,
          action: 'What is boiling?',
          explanation: 'Liquid → Gas phase transition',
          work: 'Requires breaking bonds between molecules'
        },
        {
          step: 2,
          action: 'Energy goes to breaking bonds',
          explanation: 'Heat energy breaks particle interactions',
          work: 'Not increasing kinetic energy (temperature)'
        },
        {
          step: 3,
          action: 'Phase transition plateau',
          explanation: 'While phase changing, heat increases potential energy not kinetic',
          work: 'Temperature steady until all liquid evaporates'
        },
        {
          step: 4,
          action: 'After phase complete',
          explanation: 'All liquid → gas, now temperature rises again',
          work: 'Heat increases kinetic energy again'
        }
      ],
      answer: 'Heat breaks bonds instead of increasing temperature',
      commonMistakes: [
        'Thinking temperature always increases with heat',
        'Not understanding phase transitions need energy'
      ]
    },
    {
      id: 'example-5-separation',
      difficulty: 'medium',
      title: 'Choose Separation Technique',
      problem: 'You have salt dissolved in water. How do you separate them?',
      steps: [
        {
          step: 1,
          action: 'Understand the mixture',
          explanation: 'Salt (solute) dissolved in water (solvent)',
          work: 'Solution - invisible particles'
        },
        {
          step: 2,
          action: 'Method 1: Evaporation',
          explanation: 'Heat to evaporate water → salt left behind',
          work: 'Easiest, but no liquid water recovered'
        },
        {
          step: 3,
          action: 'Method 2: Distillation',
          explanation: 'Boil water, cool vapor back to liquid',
          work: 'Recovers both liquid water AND salt'
        },
        {
          step: 4,
          action: 'Choice',
          explanation: 'Use evaporation for salt, distillation for both products',
          work: ''
        }
      ],
      answer: 'Evaporation (simple) or distillation (recover both)',
      commonMistakes: [
        'Choosing filtration (won\'t work, salt is dissolved)',
        'Not knowing these techniques exist'
      ]
    },
    {
      id: 'example-6-signs-of-change',
      difficulty: 'hard',
      title: 'Distinguish Chemical Change Signs',
      problem: 'Burning magnesium produces bright light and white powder (oxide). Why is this chemical?',
      steps: [
        {
          step: 1,
          action: 'Start: magnesium metal',
          explanation: 'Gray shiny metal (Mg)',
          work: ''
        },
        {
          step: 2,
          action: 'Sign 1: Color change',
          explanation: 'Gray → white (not just mixing!)',
          work: 'Different substance formed'
        },
        {
          step: 3,
          action: 'Sign 2: Light & heat release',
          explanation: 'Bright light = energy from bonds breaking/forming',
          work: 'Chemical reaction energy'
        },
        {
          step: 4,
          action: 'Sign 3: New substance',
          explanation: 'Magnesium oxide (MgO) not Mg',
          work: 'Atoms rearranged'
        },
        {
          step: 5,
          action: 'Reversibility',
          explanation: 'Can\'t get Mg metal back easily',
          work: 'Chemical change'
        }
      ],
      answer: 'Multiple signs: color, light, new substance, irreversible',
      commonMistakes: []
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Pure water is:',
      options: ['Mixture', 'Element', 'Compound', 'Suspension'],
      correctAnswer: 'Compound',
      explanation: 'H₂O: compound of H and O'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Salt water is a ___',
      correctAnswers: ['solution', 'mixture'],
      explanation: 'Homogeneous mixture'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Melting ice is:',
      options: ['Chemical change', 'Physical change', 'New substance', 'Irreversible'],
      correctAnswer: 'Physical change',
      explanation: 'Still H₂O, reversible'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Which shows chemical change?',
      options: ['Dissolving sugar', 'Boiling water', 'Burning wood', 'Melting chocolate'],
      correctAnswer: 'Burning wood',
      explanation: 'New substances (ash, gases)'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Solid → Liquid is called ___',
      correctAnswers: ['melting'],
      explanation: ''
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Suspension particles will:',
      options: ['Dissolve', 'Settle over time', 'Stay forever', 'Form solution'],
      correctAnswer: 'Settle over time',
      explanation: 'Visible particles eventually sink'
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'To separate dissolved salt from water, use: ___',
      correctAnswers: ['evaporation', 'distillation'],
      explanation: ''
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'A solution is always:',
      options: ['Heterogeneous', 'Homogeneous', 'Solid', 'Reversible'],
      correctAnswer: 'Homogeneous',
      explanation: 'Uniform appearance throughout'
    },
    {
      id: 'practice-9',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Which is irreversible?',
      options: ['Freezing', 'Melting', 'Burning', 'Evaporation'],
      correctAnswer: 'Burning',
      explanation: 'Creates new substances'
    },
    {
      id: 'practice-10',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Air is best classified as:',
      options: ['Pure substance', 'Solution', 'Suspension', 'Compound'],
      correctAnswer: 'Solution',
      explanation: 'Homogeneous mixture of gases'
    }
  ],

  topicQuiz: {
    id: 'classification-matter-quiz',
    title: 'Classification of Matter Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Pure substance has:',
        options: ['Variable composition', 'Fixed composition', 'Mixed properties', 'Visible particles'],
        correctAnswer: 'Fixed composition',
        explanation: ''
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'Mixture = combination not ___',
        correctAnswers: ['bonded', 'chemically bonded'],
        explanation: ''
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Colloid particles:',
        options: ['Settle quickly', 'Stay suspended', 'Form solutions', 'Visible'],
        correctAnswer: 'Stay suspended',
        explanation: ''
      },
      {
        id: 'quiz-4',
        type: 'fill-blank',
        question: 'Physical change: composition ___',
        correctAnswers: ['unchanged', 'same', 'doesn\'t change'],
        explanation: ''
      },
      {
        id: 'quiz-5',
        type: 'multiple-choice',
        question: 'Gas → Liquid:',
        options: ['Melting', 'Boiling', 'Condensation', 'Sublimation'],
        correctAnswer: 'Condensation',
        explanation: ''
      },
      {
        id: 'quiz-6',
        type: 'multiple-choice',
        question: 'Sign of chemical change:',
        options: ['Shape change', 'Color change', 'Evaporation', 'Melting'],
        correctAnswer: 'Color change',
        explanation: 'Along with other signs'
      },
      {
        id: 'quiz-7',
        type: 'fill-blank',
        question: 'Filtration separates: ___',
        correctAnswers: ['solids from liquids', 'solid and liquid'],
        explanation: ''
      },
      {
        id: 'quiz-8',
        type: 'multiple-choice',
        question: 'Boiling point plateau because:',
        options: ['No heat added', 'Bonds breaking', 'Temperature stable', 'Phase change'],
        correctAnswer: 'Phase change',
        explanation: ''
      },
      {
        id: 'quiz-9',
        type: 'fill-blank',
        question: 'Element = one type of ___',
        correctAnswers: ['atom', 'atoms'],
        explanation: ''
      },
      {
        id: 'quiz-10',
        type: 'multiple-choice',
        question: 'Most reversible change:',
        options: ['Burning', 'Rusting', 'Boiling', 'Digestion'],
        correctAnswer: 'Boiling',
        explanation: 'Can condense back'
      }
    ]
  },

  practiceExam: {
    id: 'classification-matter-exam',
    title: 'Classification of Matter Exam',
    timeLimit: 5400,
    totalMarks: 100,
    questions: [
      {
        id: 'exam-1',
        marks: 3,
        type: 'multiple-choice',
        question: 'Classify: Iron (Fe) is a:',
        options: ['Compound', 'Mixture', 'Element', 'Solution'],
        correctAnswer: 'Element',
        explanation: ''
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'fill-blank',
        question: 'Sugar water is a ___ (homogeneous mixture)',
        correctAnswers: ['solution'],
        explanation: ''
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'multiple-choice',
        question: 'Mud in water is:',
        options: ['Solution', 'Colloid', 'Suspension', 'Compound'],
        correctAnswer: 'Suspension',
        explanation: ''
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'multiple-choice',
        question: 'Freezing water shows:',
        options: ['Chemical change', 'New substance', 'Physical change', 'Irreversible'],
        correctAnswer: 'Physical change',
        explanation: ''
      },
      {
        id: 'exam-5',
        marks: 3,
        type: 'fill-blank',
        question: 'Rusting is ___ change (new substance formed)',
        correctAnswers: ['chemical', 'a chemical'],
        explanation: ''
      },
      {
        id: 'exam-6',
        marks: 4,
        type: 'multiple-choice',
        question: 'During boiling, temperature stays constant because:',
        options: ['No heat', 'Bonds breaking', 'Container cooling', 'Pressure change'],
        correctAnswer: 'Bonds breaking',
        explanation: ''
      },
      {
        id: 'exam-7',
        marks: 3,
        type: 'fill-blank',
        question: 'Liquid → Gas phase change = ___',
        correctAnswers: ['boiling', 'evaporation'],
        explanation: ''
      },
      {
        id: 'exam-8',
        marks: 4,
        type: 'multiple-choice',
        question: 'To separate salt from salt water: use ___',
        options: ['Filtration', 'Evaporation', 'Distillation', 'Mixing'],
        correctAnswer: 'Evaporation',
        explanation: ''
      },
      {
        id: 'exam-9',
        marks: 4,
        type: 'fill-blank',
        question: 'Burning wood shows signs: ___, ___, ___ (list 3)',
        correctAnswers: ['light, heat, new substances', 'heat, light, color change', 'light, heat, ash produced'],
        explanation: ''
      },
      {
        id: 'exam-10',
        marks: 5,
        type: 'fill-blank',
        question: 'Explain why dissolving salt in water is physical change (not chemical)',
        correctAnswers: ['same substances', 'reversible', 'no new compound', 'salt and water unchanged'],
        explanation: 'Salt and water remain - still salt + water, just mixed'
      }
    ]
  }
};
