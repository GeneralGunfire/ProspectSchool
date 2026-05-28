export const taxonomyAndBinomialNomenclature = {
  id: 'taxonomy-and-binomial-nomenclature',
  title: 'Taxonomy & Binomial Nomenclature',
  description: 'Learn the classification hierarchy and universal scientific naming system',
  grade: 10,
  term: 1,

  conceptExplanation: {
    title: 'Understanding Taxonomy and Naming',
    content: `
      <h3>What is Taxonomy?</h3>
      <p>Taxonomy is the science of classifying and organizing living organisms into groups.</p>
      <p><strong>Purpose:</strong> Shows evolutionary relationships and provides order to the incredible diversity of life.</p>

      <h3>The Taxonomic Hierarchy</h3>
      <p>Organisms are classified from broadest to most specific:</p>
      <ol>
        <li><strong>Kingdom</strong> - Broadest category (Animalia, Plantae, Fungi, etc.)</li>
        <li><strong>Phylum</strong> - Major body plan groups (Chordata, Arthropoda)</li>
        <li><strong>Class</strong> - Vertebrate type (Mammalia, Aves, Reptilia)</li>
        <li><strong>Order</strong> - Lifestyle/diet groups (Primates, Carnivora)</li>
        <li><strong>Family</strong> - Closer relatives (Hominidae, Felidae)</li>
        <li><strong>Genus</strong> - Very close relatives (Homo, Felix)</li>
        <li><strong>Species</strong> - Narrowest category (sapiens, leo)</li>
      </ol>
      <p><strong>Memory aid:</strong> "King Phillip Came Over For Good Soup"</p>

      <h3>Why This Hierarchy?</h3>
      <p><strong>Organization:</strong> Groups with shared traits together</p>
      <p><strong>Evolution:</strong> Organisms in same group share common ancestor</p>
      <p><strong>Details:</strong> As you go down, details become more specific</p>

      <h3>Binomial Nomenclature</h3>
      <p><strong>Definition:</strong> Universal two-part scientific naming system (Genus + species)</p>

      <h3>Rules of Binomial Nomenclature:</h3>
      <ul>
        <li><strong>Two parts:</strong> Genus (first) + species (second)</li>
        <li><strong>Capitalization:</strong> Genus is capitalized, species is lowercase</li>
        <li><strong>Italics:</strong> Both parts italicized (or underlined in handwriting)</li>
        <li><strong>Latin/Greek:</strong> Names come from classical languages</li>
        <li><strong>Descriptive:</strong> Names often describe appearance or habitat</li>
      </ul>

      <h3>Examples of Binomial Nomenclature:</h3>
      <p><em>Homo sapiens</em> = Humans</p>
      <p><em>Panthera leo</em> = Lion (genus Panthera, species leo)</p>
      <p><em>Canis lupus</em> = Gray wolf</p>
      <p><em>Mus musculus</em> = House mouse</p>
      <p><em>Rosa damascena</em> = Damask rose</p>

      <h3>Why Universal Naming?</h3>
      <p>In English: "cat" means different things (house cat, wild cat, big cat)</p>
      <p>In Afrikaans: "kat" = cat, but "kat-kat" = polecat</p>
      <p>In Spanish: "gato" = cat</p>
      <p><strong>Scientific:</strong> <em>Felis catus</em> = only one organism, understood worldwide</p>

      <h3>Naming Patterns</h3>
      <p><strong>Descriptive names:</strong></p>
      <ul>
        <li><em>Canis lupus</em> - "Canis" (dog), "lupus" (wolf)</li>
        <li><em>Quercus alba</em> - "alba" means white (white oak)</li>
        <li><em>Corvus corax</em> - "corax" (raven) - genus and species same!</li>
      </ul>
      <p><strong>Named after discoverer or place:</strong></p>
      <ul>
        <li><em>Magnolia grandiflora</em> - "grandiflora" (large flowers)</li>
      </ul>
    `
  },

  visualizations: [
    {
      id: 'taxonomy-hierarchy',
      type: 'svg-animation',
      title: 'Taxonomic Hierarchy Tree',
      description: 'Interactive taxonomy tree showing kingdom to species classification',
      svgComponent: 'TaxonomyHierarchyVisualization'
    },
    {
      id: 'human-classification',
      type: 'svg-animation',
      title: 'Complete Human Classification',
      description: 'Walk through each level of human taxonomy',
      svgComponent: 'HumanClassificationVisualization'
    },
    {
      id: 'binomial-naming-rules',
      type: 'svg-animation',
      title: 'Binomial Nomenclature Rules',
      description: 'Learn the rules for scientific naming',
      svgComponent: 'BinomialNamingRulesVisualization'
    },
    {
      id: 'organism-comparison-classifier',
      type: 'svg-animation',
      title: 'Organism Classifier',
      description: 'Compare and classify different organisms',
      svgComponent: 'OrganismComparisonVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-hierarchy-levels',
      difficulty: 'easy',
      title: 'Understanding Classification Hierarchy',
      problem: 'A lion and a house cat are both in the Kingdom Animalia. Are they the same species?',
      steps: [
        {
          step: 1,
          action: 'Check Kingdom level',
          explanation: 'Both in Kingdom Animalia - very broad category, so not the same species',
          work: 'Kingdom Animalia includes millions of species'
        },
        {
          step: 2,
          action: 'Check Family level',
          explanation: 'Both in Family Felidae (cats) - more specific, but still different',
          work: 'Lion: Panthera leo | House cat: Felis catus'
        },
        {
          step: 3,
          action: 'Check Species level',
          explanation: 'Different genera AND different species - definitely NOT same species',
          work: 'leo ≠ catus'
        }
      ],
      answer: 'No, they are different species. Lion is Panthera leo, house cat is Felis catus.',
      commonMistakes: [
        'Thinking same family = same species - remember: family groups are broader than species'
      ]
    },
    {
      id: 'example-2-binomial-notation',
      difficulty: 'easy',
      title: 'Writing Binomial Nomenclature Correctly',
      problem: 'Write the scientific name for humans using correct binomial nomenclature rules.',
      steps: [
        {
          step: 1,
          action: 'Identify Genus',
          explanation: 'Humans are in genus Homo',
          work: 'Homo (capitalized)'
        },
        {
          step: 2,
          action: 'Identify species',
          explanation: 'Humans are species sapiens',
          work: 'sapiens (lowercase)'
        },
        {
          step: 3,
          action: 'Apply rules',
          explanation: 'Capitalize genus, lowercase species, italicize both',
          work: '<em>Homo sapiens</em>'
        }
      ],
      answer: '<em>Homo sapiens</em> (or Homo sapiens underlined)',
      commonMistakes: [
        'Not italicizing: Homo sapiens ❌',
        'Capitalizing species: Homo Sapiens ❌',
        'Reversing order: sapiens Homo ❌'
      ]
    },
    {
      id: 'example-3-classification-levels',
      difficulty: 'easy',
      title: 'Placing Organism in Classification',
      problem: 'Place a dog in the complete taxonomic hierarchy.',
      steps: [
        {
          step: 1,
          action: 'Kingdom',
          explanation: 'Dogs are animals',
          work: 'Kingdom: Animalia'
        },
        {
          step: 2,
          action: 'Phylum',
          explanation: 'Dogs have backbones',
          work: 'Phylum: Chordata'
        },
        {
          step: 3,
          action: 'Class',
          explanation: 'Dogs are mammals (warm-blooded, hair, feed young milk)',
          work: 'Class: Mammalia'
        },
        {
          step: 4,
          action: 'Order',
          explanation: 'Dogs eat meat, sharp teeth',
          work: 'Order: Carnivora'
        },
        {
          step: 5,
          action: 'Family',
          explanation: 'Dogs are in family with wolves, foxes',
          work: 'Family: Canidae'
        },
        {
          step: 6,
          action: 'Genus',
          explanation: 'Dog genus is Canis',
          work: 'Genus: Canis'
        },
        {
          step: 7,
          action: 'Species',
          explanation: 'Dog species is familiaris',
          work: 'Species: familiaris'
        }
      ],
      answer: 'Kingdom: Animalia | Phylum: Chordata | Class: Mammalia | Order: Carnivora | Family: Canidae | Genus: Canis | Species: familiaris | Scientific name: <em>Canis familiaris</em>',
      commonMistakes: []
    },
    {
      id: 'example-4-naming-patterns',
      difficulty: 'medium',
      title: 'Understanding Scientific Names',
      problem: 'What does <em>Felis catus</em> tell you about this organism?',
      steps: [
        {
          step: 1,
          action: 'Identify Genus and species',
          explanation: 'Felis = genus (cat-like), catus = species',
          work: 'Genus: Felis | Species: catus'
        },
        {
          step: 2,
          action: 'Recognize the pattern',
          explanation: '"catus" relates to domestic cat - tells us about nature of organism',
          work: 'Name describes the organism'
        },
        {
          step: 3,
          action: 'Compare to similar organisms',
          explanation: 'Other Felis species: F. silvestris (wildcat), F. chaus (jungle cat)',
          work: 'Same genus = close relatives, different species'
        }
      ],
      answer: '<em>Felis catus</em> is the house cat - "Felis" indicates it is a small cat, "catus" is the specific domestic cat',
      commonMistakes: [
        'Thinking each word has a simple meaning - scientific names are more descriptive'
      ]
    },
    {
      id: 'example-5-comparing-species',
      difficulty: 'medium',
      title: 'Comparing Two Species Using Taxonomy',
      problem: 'Compare <em>Panthera leo</em> (lion) and <em>Panthera tigris</em> (tiger). What do they share?',
      steps: [
        {
          step: 1,
          action: 'Observe the names',
          explanation: 'Both start with Panthera - they share the same genus',
          work: 'Same genus = close relatives'
        },
        {
          step: 2,
          action: 'What this means',
          explanation: 'If same genus, they must share Family, Order, Class, Phylum, and Kingdom',
          work: 'Both: Animalia, Chordata, Mammalia, Carnivora, Felidae, Panthera'
        },
        {
          step: 3,
          action: 'Why different species',
          explanation: 'leo (lion) and tigris (tiger) - cannot interbreed successfully in nature',
          work: 'Different species, but closely related'
        }
      ],
      answer: 'Lions and tigers share Kingdom, Phylum, Class, Order, Family, and Genus (Panthera). They are close relatives but different species.',
      commonMistakes: [
        'Thinking same genus means same species - they can still be different species'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'The memory aid for taxonomy is: King Phillip Came Over For Good ?',
      correctAnswers: ['Soup'],
      explanation: 'K-P-C-O-F-G-S = Kingdom-Phylum-Class-Order-Family-Genus-Species'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'In the scientific name <em>Canis lupus</em>, which part is the Genus?',
      options: [
        'Canis',
        'lupus',
        'Both parts together',
        'Neither - it is a common name'
      ],
      correctAnswer: 'Canis',
      explanation: 'Genus is always first and capitalized. Species is second and lowercase.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'How should scientific names be written?',
      options: [
        'All capital letters',
        'Normal sentence case',
        'Genus capitalized and italicized, species lowercase and italicized',
        'All lowercase'
      ],
      correctAnswer: 'Genus capitalized and italicized, species lowercase and italicized',
      explanation: 'This is the standard rule for binomial nomenclature.'
    },
    {
      id: 'practice-4',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What does the second part of a binomial name represent?',
      options: [
        'Genus',
        'Species',
        'Family',
        'Phylum'
      ],
      correctAnswer: 'Species',
      explanation: 'Binomial = two names: Genus (first) + Species (second)'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'In taxonomy, the most specific classification level is ?.',
      correctAnswers: ['species'],
      explanation: 'Species is the narrowest category in the hierarchy.'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Two organisms are in the same Family but different Genus. What does this tell you?',
      options: [
        'They are the same species',
        'They are different species but close relatives',
        'They cannot be compared',
        'They are in different kingdoms'
      ],
      correctAnswer: 'They are different species but close relatives',
      explanation: 'Same family = related, but different genus = different species.'
    }
  ],

  topicQuiz: {
    id: 'taxonomy-quiz',
    title: 'Taxonomy & Binomial Nomenclature Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'The seven levels of classification from broadest to narrowest are: Kingdom, Phylum, Class, Order, ?, Genus, Species.',
        correctAnswers: ['Family'],
        explanation: 'Family is the 5th level in the hierarchy.'
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'Why do we use binomial nomenclature instead of common names?',
        options: [
          'Because Latin is more fun',
          'To confuse students',
          'Because same organism has different names in different languages',
          'Because scientists like to show off'
        ],
        correctAnswer: 'Because same organism has different names in different languages',
        explanation: 'Universal naming ensures all scientists discuss the same organism.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Which is written correctly?',
        options: [
          'homo sapiens',
          '<em>Homo Sapiens</em>',
          '<em>Homo sapiens</em>',
          'HOMO SAPIENS'
        ],
        correctAnswer: '<em>Homo sapiens</em>',
        explanation: 'Genus capitalized, species lowercase, both italicized.'
      },
      {
        id: 'quiz-4',
        type: 'fill-blank',
        question: 'Two organisms in the same Kingdom but different Phylum are ? but not closely related.',
        correctAnswers: ['related', 'organisms'],
        explanation: 'Same kingdom = share basic life characteristics, but different phyla = not closely related.'
      },
      {
        id: 'quiz-5',
        type: 'multiple-choice',
        question: 'What is the advantage of having a universal classification system?',
        options: [
          'Makes biology harder',
          'Allows scientists worldwide to communicate about organisms clearly',
          'Eliminates the need for common names',
          'Ensures all species are named in Latin'
        ],
        correctAnswer: 'Allows scientists worldwide to communicate about organisms clearly',
        explanation: 'This is the primary reason for standardized classification.'
      }
    ]
  },

  practiceExam: {
    id: 'grade-10-taxonomy-exam',
    title: 'Taxonomy & Binomial Nomenclature Practice Exam',
    timeLimit: 2400,
    totalMarks: 50,
    questions: [
      {
        id: 'exam-1',
        marks: 2,
        type: 'fill-blank',
        question: 'List the seven levels of classification from broadest to narrowest.',
        correctAnswers: [
          'Kingdom, Phylum, Class, Order, Family, Genus, Species',
          'K, P, C, O, F, G, S'
        ],
        explanation: 'Memory aid: King Phillip Came Over For Good Soup'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'multiple-choice',
        question: 'In <em>Panthera leo</em>, the lion, which part tells you it is a big cat?',
        options: [
          'Panthera',
          'leo',
          'Both parts',
          'Neither'
        ],
        correctAnswer: 'Panthera',
        explanation: 'Genus (Panthera) groups big cats together.'
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'fill-blank',
        question: 'Write the correct binomial nomenclature for a dog.',
        correctAnswers: [
          '<em>Canis familiaris</em>',
          'Canis familiaris'
        ],
        explanation: 'Genus Canis (capitalized, italicized), species familiaris (lowercase, italicized).'
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'multiple-choice',
        question: 'Why is <em>Canis lupus</em> (wolf) different from <em>Canis familiaris</em> (dog) despite being in the same genus?',
        options: [
          'They live in different places',
          'They are different species within genus Canis',
          'They cannot interbreed',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'Different species means they cannot successfully breed together, even though they are closely related.'
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'fill-blank',
        question: 'Two organisms both belong to Kingdom Animalia, Phylum Chordata, Class Mammalia, but different Order. Are they closely related? Explain.',
        correctAnswers: [
          'Not closely related - they are in same class but different order, so they share broad characteristics but diverged early',
          'Not closely related'
        ],
        explanation: 'Same class but different order means they are somewhat related but not close cousins.'
      }
    ]
  }
};
