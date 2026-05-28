// EGD (Engineering Graphics & Design) - Additional Critical Topics

export const measuringLinesAngles = {
  id: 'measuring-lines-angles',
  title: 'Measuring Lines & Angles',
  description: 'Using instruments to accurately measure lines and angles in technical drawings',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Accurate Measurement in Engineering',
    content: `
      <h3>Why Accurate Measurement Matters</h3>
      <p>In engineering drawings, precision is critical. A 1mm error can cause major problems in construction or manufacturing. This topic covers how to use standard tools to measure lines and angles accurately.</p>

      <h3>Tools for Measuring Lines</h3>
      <p><strong>Ruler/Scale:</strong> Marked with measurements (mm, cm)</p>
      <ul>
        <li>Place ruler along the line to be measured</li>
        <li>Align the zero mark with one end of the line</li>
        <li>Read the measurement at the other end</li>
        <li>Keep ruler flat and steady for accuracy</li>
      </ul>

      <h3>Tools for Measuring Angles</h3>
      <p><strong>Protractor:</strong> Semi-circular tool marked 0° to 180°</p>
      <ul>
        <li><strong>Center point:</strong> Place on the vertex (corner) of the angle</li>
        <li><strong>Baseline:</strong> Align the baseline (0°) with one ray of the angle</li>
        <li><strong>Reading:</strong> Follow the other ray to find the degree measurement</li>
        <li><strong>Types:</strong> 180° semicircle or 360° full circle</li>
      </ul>

      <h3>Set Squares for Specific Angles</h3>
      <ul>
        <li><strong>45-45-90 Set Square:</strong> For 45°, 90°, 135° angles</li>
        <li><strong>30-60-90 Set Square:</strong> For 30°, 60°, 90°, 120° angles</li>
        <li><strong>Combination use:</strong> Can create many angles by combining them</li>
      </ul>

      <h3>Common Measurement Errors</h3>
      <ul>
        <li>Not aligning the zero mark correctly</li>
        <li>Tilting the ruler or protractor</li>
        <li>Parallax error (reading from wrong angle)</li>
        <li>Not using a sharp pencil for precise marks</li>
        <li>Measuring thickness instead of center line</li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li>Always use sharp pencil marks</li>
        <li>Measure from clear reference points</li>
        <li>Double-check important measurements</li>
        <li>Use appropriate scale for the drawing</li>
        <li>Record measurements clearly and systematically</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'protractor-measurement',
      type: 'svg-animation',
      title: 'Using a Protractor',
      description: 'Interactive demonstration of measuring angles',
      svgComponent: 'ProtractorMeasurementVisualization'
    },
    {
      id: 'ruler-measurement',
      type: 'svg-animation',
      title: 'Measuring Line Segments',
      description: 'Step-by-step guide to measuring lines',
      svgComponent: 'RulerMeasurementVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1-measure-line',
      difficulty: 'easy',
      title: 'Measuring a Line Segment',
      problem: 'Use a ruler to measure a line segment AB. The line starts at the 2cm mark and ends at the 7.5cm mark.',
      steps: [
        {
          step: 1,
          action: 'Position the ruler',
          explanation: 'Place ruler along the line from A to B',
          work: 'Ruler aligned with line AB'
        },
        {
          step: 2,
          action: 'Identify start point',
          explanation: 'Find where point A aligns with ruler marks',
          work: 'Point A aligns at 2cm mark'
        },
        {
          step: 3,
          action: 'Identify end point',
          explanation: 'Find where point B aligns with ruler marks',
          work: 'Point B aligns at 7.5cm mark'
        },
        {
          step: 4,
          action: 'Calculate length',
          explanation: 'Subtract start from end',
          work: '7.5cm - 2cm = 5.5cm'
        }
      ],
      answer: 'The line segment AB measures 5.5cm',
      commonMistakes: ['Not starting from zero on ruler', 'Parallax error from wrong angle']
    },
    {
      id: 'example-2-measure-angle',
      difficulty: 'medium',
      title: 'Measuring an Angle with Protractor',
      problem: 'Measure angle ABC where the vertex is at B. One ray goes horizontal, the other goes up-right.',
      steps: [
        {
          step: 1,
          action: 'Place protractor center',
          explanation: 'Center point of protractor on vertex B',
          work: 'Protractor center aligned at B'
        },
        {
          step: 2,
          action: 'Align baseline',
          explanation: 'Align protractor baseline with one ray (horizontal)',
          work: 'Baseline aligned with ray BA'
        },
        {
          step: 3,
          action: 'Read the scale',
          explanation: 'Follow the other ray to protractor markings',
          work: 'Ray BC crosses at 45° mark'
        },
        {
          step: 4,
          action: 'Record measurement',
          explanation: 'Note the degree reading',
          work: 'Angle ABC = 45°'
        }
      ],
      answer: 'The angle ABC measures 45°',
      commonMistakes: ['Wrong scale (inner vs outer)', 'Vertex not centered on protractor']
    },
    {
      id: 'example-3-triangle-angles',
      difficulty: 'medium',
      title: 'Measuring All Angles in a Triangle',
      problem: 'Measure all three angles in triangle ABC.',
      steps: [
        {
          step: 1,
          action: 'First angle at A',
          explanation: 'Measure angle CAB',
          work: 'Place protractor at A, measure = 60°'
        },
        {
          step: 2,
          action: 'Second angle at B',
          explanation: 'Measure angle ABC',
          work: 'Place protractor at B, measure = 70°'
        },
        {
          step: 3,
          action: 'Third angle at C',
          explanation: 'Measure angle BCA',
          work: 'Place protractor at C, measure = 50°'
        },
        {
          step: 4,
          action: 'Verify sum',
          explanation: 'All angles should add to 180°',
          work: '60° + 70° + 50° = 180° ✓'
        }
      ],
      answer: 'Angles are 60°, 70°, and 50° (sum = 180°)',
      commonMistakes: ['Angles not summing to 180° (measurement error)']
    },
    {
      id: 'example-4-parallel-lines',
      difficulty: 'medium',
      title: 'Measuring to Check Parallel Lines',
      problem: 'Two lines appear parallel. How can you verify this by measuring angles?',
      steps: [
        {
          step: 1,
          action: 'Draw a transversal',
          explanation: 'Draw a line crossing both lines',
          work: 'Transversal crosses both lines'
        },
        {
          step: 2,
          action: 'Measure corresponding angles',
          explanation: 'Measure angles in same positions',
          work: 'Angle 1 = 65°, Angle 2 = 65°'
        },
        {
          step: 3,
          action: 'Compare measurements',
          explanation: 'Equal corresponding angles = parallel',
          work: 'Both 65°, so lines are parallel'
        }
      ],
      answer: 'If corresponding angles are equal, the lines are parallel',
      commonMistakes: ['Measuring alternate angles instead of corresponding']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'When measuring a line with a ruler, where should you start?',
      options: [
        'At the 1cm mark',
        'At the 0cm mark (zero)',
        'At any convenient mark',
        'At the end of the ruler'
      ],
      correctAnswer: 'At the 0cm mark (zero)',
      explanation: 'Starting at zero prevents calculation errors.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'The center point of a protractor must be placed at the ?.',
      correctAnswers: ['vertex', 'vertex of the angle', 'corner'],
      explanation: 'The vertex is the corner where the two rays meet.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'A protractor measures angles from 0° to:',
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: '180°',
      explanation: 'A standard protractor is semicircular (180°).'
    },
    {
      id: 'practice-4',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'A 30-60-90 set square can be used to draw angles of 30°, 60°, 90°, and ?°.',
      correctAnswers: ['120', '150', '120 degrees'],
      explanation: 'Combining angles gives 30+90=120°.'
    },
    {
      id: 'practice-5',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'What error occurs when you read a protractor from an angle?',
      options: [
        'Parallax error',
        'Measurement error',
        'Calculation error',
        'Rounding error'
      ],
      correctAnswer: 'Parallax error',
      explanation: 'Reading from wrong angle gives inaccurate results.'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Which is NOT a good practice when measuring?',
      options: [
        'Using a sharp pencil',
        'Double-checking important measurements',
        'Tilting the ruler slightly',
        'Recording measurements clearly'
      ],
      correctAnswer: 'Tilting the ruler slightly',
      explanation: 'Rulers must stay flat and straight for accuracy.'
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'The sum of all angles in a triangle must always equal ??°.',
      correctAnswers: ['180', '180 degrees'],
      explanation: 'This is a fundamental property of triangles.'
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'If two lines have equal corresponding angles when cut by a transversal, the lines are:',
      options: [
        'Perpendicular',
        'Parallel',
        'Equal',
        'Concurrent'
      ],
      correctAnswer: 'Parallel',
      explanation: 'Equal corresponding angles indicate parallel lines.'
    }
  ],
  topicQuiz: {
    id: 'measuring-lines-angles-quiz',
    title: 'Measuring Lines & Angles Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'A line from 3cm to 8.5cm on a ruler measures ?? cm.',
        correctAnswers: ['5.5', '5.5 cm'],
        explanation: '8.5 - 3 = 5.5cm'
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'Which tool measures angles?',
        options: ['Ruler', 'Compass', 'Protractor', 'Set square'],
        correctAnswer: 'Protractor',
        explanation: 'Protractors are specifically designed for measuring angles.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'What should three angles of a triangle sum to?',
        options: ['90°', '180°', '270°', '360°'],
        correctAnswer: '180°',
        explanation: 'Triangle angle sum theorem.'
      },
      {
        id: 'quiz-4',
        type: 'fill-blank',
        question: 'A ?? angle measures exactly 90°.',
        correctAnswers: ['right', 'right angle'],
        explanation: 'Right angles are fundamental in technical drawing.'
      },
      {
        id: 'quiz-5',
        type: 'multiple-choice',
        question: 'When using a protractor, what must be at the vertex?',
        options: [
          'The baseline',
          'The center point (hole)',
          'The 0° mark',
          'The ruler'
        ],
        correctAnswer: 'The center point (hole)',
        explanation: 'The protractor center must align with the angle vertex.'
      }
    ]
  },
  practiceExam: {
    id: 'measuring-lines-angles-exam',
    title: 'Measuring Lines & Angles Exam',
    timeLimit: 2400,
    totalMarks: 40,
    questions: [
      {
        id: 'exam-1',
        marks: 4,
        type: 'fill-blank',
        question: 'A line segment measures from 1.5cm to 9cm on a ruler. How long is the line?',
        correctAnswers: ['7.5 cm', '7.5', '7.5cm'],
        explanation: 'Subtract: 9 - 1.5 = 7.5cm'
      },
      {
        id: 'exam-2',
        marks: 5,
        type: 'fill-blank',
        question: 'Describe the steps to measure an angle using a protractor.',
        correctAnswers: [
          'Place center at vertex, align baseline with one ray, read where other ray crosses',
          'Center on vertex, align 0° with one ray, read other ray'
        ],
        explanation: 'These are the three essential steps.'
      },
      {
        id: 'exam-3',
        marks: 4,
        type: 'multiple-choice',
        question: 'A triangle has angles of 55° and 65°. What is the third angle?',
        options: ['60°', '70°', '80°', '90°'],
        correctAnswer: '60°',
        explanation: '180° - 55° - 65° = 60°'
      },
      {
        id: 'exam-4',
        marks: 5,
        type: 'fill-blank',
        question: 'What are three common measurement errors?',
        correctAnswers: [
          'Not starting at zero, parallax error, tilting ruler',
          'Wrong alignment, reading wrong scale, vertex not centered'
        ],
        explanation: 'These are the most common mistakes.'
      }
    ]
  }
};

export const circumscribedInscribedTriangles = {
  id: 'circumscribed-inscribed-triangles',
  title: 'Circumscribed & Inscribed Triangles',
  description: 'Understanding and constructing triangles around and within circles',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Triangles and Circles',
    content: `
      <h3>Understanding the Concepts</h3>
      <p><strong>Circumscribed Triangle:</strong> A triangle drawn AROUND a circle so that the circle touches all three sides of the triangle from inside. The circle is INSCRIBED in the triangle.</p>
      <p><strong>Inscribed Triangle:</strong> A triangle drawn INSIDE a circle so that all three vertices (corners) touch the circle. The triangle is INSCRIBED in the circle.</p>

      <h3>Key Differences</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border: 1px solid black;">
          <td style="border: 1px solid black; padding: 10px;"><strong>Circumscribed Triangle</strong></td>
          <td style="border: 1px solid black; padding: 10px;"><strong>Inscribed Triangle</strong></td>
        </tr>
        <tr style="border: 1px solid black;">
          <td style="border: 1px solid black; padding: 10px;">Triangle OUTSIDE circle</td>
          <td style="border: 1px solid black; padding: 10px;">Triangle INSIDE circle</td>
        </tr>
        <tr style="border: 1px solid black;">
          <td style="border: 1px solid black; padding: 10px;">Circle touches all 3 SIDES</td>
          <td style="border: 1px solid black; padding: 10px;">Circle passes through all 3 VERTICES</td>
        </tr>
        <tr style="border: 1px solid black;">
          <td style="border: 1px solid black; padding: 10px;">Sides are tangent to circle</td>
          <td style="border: 1px solid black; padding: 10px;">Sides are chords of circle</td>
        </tr>
      </table>

      <h3>Construction: Circumscribed Triangle Around a Circle</h3>
      <ol>
        <li>Start with a circle (center O, radius r)</li>
        <li>Draw three radii at 120° angles apart</li>
        <li>Draw perpendiculars at the circle edges</li>
        <li>Extend perpendiculars until they meet</li>
        <li>Three meeting points form triangle vertices</li>
        <li>Connect vertices to complete triangle</li>
      </ol>

      <h3>Construction: Inscribed Triangle in a Circle</h3>
      <ol>
        <li>Start with a circle (center O)</li>
        <li>Draw a diameter (straight line through center)</li>
        <li>Mark any third point on the circumference</li>
        <li>Connect all three points to form triangle</li>
        <li>Triangle is automatically inscribed</li>
      </ol>

      <h3>Properties</h3>
      <p><strong>Circumscribed:</strong> The center is the incenter (where angle bisectors meet)</p>
      <p><strong>Inscribed:</strong> If the triangle has a right angle, it MUST be opposite the diameter</p>

      <h3>Real-World Applications</h3>
      <ul>
        <li>Circumscribed: Tank design, pipe connections</li>
        <li>Inscribed: Wheel design, gear patterns</li>
        <li>Both: Architecture, mechanical design</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'circumscribed-triangle',
      type: 'svg-animation',
      title: 'Circumscribed Triangle Construction',
      description: 'Step-by-step animation of triangle around circle',
      svgComponent: 'CircumscribedTriangleVisualization'
    },
    {
      id: 'inscribed-triangle',
      type: 'svg-animation',
      title: 'Inscribed Triangle Construction',
      description: 'Step-by-step animation of triangle inside circle',
      svgComponent: 'InscribedTriangleVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1-circumscribed',
      difficulty: 'medium',
      title: 'Constructing a Circumscribed Triangle',
      problem: 'Given a circle with center O and radius 3cm, construct a circumscribed equilateral triangle.',
      steps: [
        {
          step: 1,
          action: 'Draw the circle',
          explanation: 'Center O, radius 3cm',
          work: 'Circle complete'
        },
        {
          step: 2,
          action: 'Draw radii at 120° angles',
          explanation: 'Three equal angles: 0°, 120°, 240°',
          work: 'Three radii dividing circle equally'
        },
        {
          step: 3,
          action: 'Draw perpendiculars',
          explanation: 'At each radius endpoint, perpendicular to radius',
          work: 'Three perpendicular lines'
        },
        {
          step: 4,
          action: 'Find intersection points',
          explanation: 'Where perpendiculars meet = triangle vertices',
          work: 'Three vertices labeled A, B, C'
        },
        {
          step: 5,
          action: 'Connect vertices',
          explanation: 'Draw sides AB, BC, CA',
          work: 'Circumscribed triangle complete'
        }
      ],
      answer: 'Equilateral triangle with circle inscribed (touching all sides)',
      commonMistakes: ['Not making equal 120° angles', 'Perpendiculars not truly perpendicular']
    },
    {
      id: 'example-2-inscribed',
      difficulty: 'easy',
      title: 'Constructing an Inscribed Triangle',
      problem: 'Given a circle with center O, construct an inscribed right triangle.',
      steps: [
        {
          step: 1,
          action: 'Draw the circle',
          explanation: 'Mark center O',
          work: 'Circle with center marked'
        },
        {
          step: 2,
          action: 'Draw a diameter',
          explanation: 'Straight line through center O (e.g., horizontal)',
          work: 'Diameter AB drawn'
        },
        {
          step: 3,
          action: 'Mark a third point',
          explanation: 'Any point on circumference (e.g., top)',
          work: 'Point C on circle'
        },
        {
          step: 4,
          action: 'Connect points',
          explanation: 'Draw lines AC and BC',
          work: 'Triangle ABC formed'
        },
        {
          step: 5,
          action: 'Verify right angle',
          explanation: 'Angle ACB (at C) should be 90°',
          work: 'Right angle confirmed at C'
        }
      ],
      answer: 'Right triangle inscribed with vertices on circle, right angle opposite diameter',
      commonMistakes: ['Not using diameter for base', 'Third point not on circle']
    },
    {
      id: 'example-3-comparison',
      difficulty: 'medium',
      title: 'Comparing Circumscribed and Inscribed',
      problem: 'For the same circle, compare the circumscribed and inscribed equilateral triangles.',
      steps: [
        {
          step: 1,
          action: 'Construct circumscribed',
          explanation: 'Triangle outside, sides tangent to circle',
          work: 'Larger triangle'
        },
        {
          step: 2,
          action: 'Construct inscribed',
          explanation: 'Triangle inside, vertices on circle',
          work: 'Smaller triangle'
        },
        {
          step: 3,
          action: 'Measure side lengths',
          explanation: 'Compare the two triangles',
          work: 'Circumscribed larger than inscribed'
        },
        {
          step: 4,
          action: 'Compare areas',
          explanation: 'Calculate area of each',
          work: 'Circumscribed area ≈ 4× inscribed area'
        }
      ],
      answer: 'Circumscribed triangle is significantly larger than inscribed triangle',
      commonMistakes: ['Confusing which is inside/outside']
    },
    {
      id: 'example-4-practical',
      difficulty: 'hard',
      title: 'Practical Application: Gear Design',
      problem: 'Design a gear with an inscribed triangle (three-point contact).',
      steps: [
        {
          step: 1,
          action: 'Define circle',
          explanation: 'Pitch circle of gear (diameter)',
          work: 'Circle represents gear diameter'
        },
        {
          step: 2,
          action: 'Inscribe triangle',
          explanation: 'Three contact points on circle',
          work: 'Vertices at 0°, 120°, 240°'
        },
        {
          step: 3,
          action: 'Design contact points',
          explanation: 'Rounded or sharp contact areas',
          work: 'Three engagement points'
        }
      ],
      answer: 'Inscribed equilateral triangle represents three-point contact gear design',
      commonMistakes: ['Not equally spacing contact points']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'In a circumscribed triangle, where is the circle located?',
      options: [
        'Outside the triangle',
        'Inside the triangle',
        'On the triangle sides',
        'Overlapping the triangle'
      ],
      correctAnswer: 'Inside the triangle',
      explanation: 'Circumscribed means the circle is inside, touching all sides.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'In an inscribed triangle, all three ?? touch the circle.',
      correctAnswers: ['vertices', 'corners'],
      explanation: 'Vertices are the corners of the triangle.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'If you draw a triangle with its vertices on a circle, the triangle is:',
      options: [
        'Circumscribed',
        'Inscribed',
        'Circumferential',
        'Tangent'
      ],
      correctAnswer: 'Inscribed',
      explanation: 'Vertices on circle = inscribed triangle.'
    },
    {
      id: 'practice-4',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'A right triangle inscribed in a circle must have its right angle opposite the ??.',
      correctAnswers: ['diameter'],
      explanation: "This is Thales' theorem."
    },
    {
      id: 'practice-5',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'For an equilateral triangle circumscribed around a circle, the three radii to the sides form angles of:',
      options: [
        '60° each',
        '90° each',
        '120° each',
        '180° each'
      ],
      correctAnswer: '120° each',
      explanation: '360° ÷ 3 = 120° for equal spacing.'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'The center of an inscribed circle (incircle) is called the:',
      options: [
        'Circumcenter',
        'Centroid',
        'Incenter',
        'Orthocenter'
      ],
      correctAnswer: 'Incenter',
      explanation: 'Incenter is where angle bisectors meet.'
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'When all three sides of a triangle are tangent to a circle, that circle is called an ?? circle.',
      correctAnswers: ['inscribed', 'incircle'],
      explanation: 'The circle inscribed in the triangle.'
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'What is the relationship between circumscribed and inscribed triangles with the same circle?',
      options: [
        'Same size',
        'Circumscribed is larger',
        'Inscribed is larger',
        'No relationship'
      ],
      correctAnswer: 'Circumscribed is larger',
      explanation: 'Circumscribed triangle always encloses the inscribed triangle.'
    }
  ],
  topicQuiz: {
    id: 'circumscribed-inscribed-triangles-quiz',
    title: 'Circumscribed & Inscribed Triangles Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'A ?? triangle has its vertices on a circle.',
        correctAnswers: ['inscribed'],
        explanation: 'Definition of inscribed triangle.'
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'Where does the circle touch a circumscribed triangle?',
        options: [
          'At vertices',
          'At midpoints of sides',
          'Tangent to all sides',
          'Outside the triangle'
        ],
        correctAnswer: 'Tangent to all sides',
        explanation: 'Tangent means touching without crossing.'
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'For an equilateral triangle, the inscribed circle touches all ?? sides equally.',
        correctAnswers: ['three', '3'],
        explanation: 'Equilateral has 3 equal sides.'
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'A right angle in an inscribed triangle must be:',
        options: [
          'At the top',
          'Opposite the diameter',
          'At a vertex on the circle',
          'Cannot exist'
        ],
        correctAnswer: 'Opposite the diameter',
        explanation: 'Thales\' theorem.'
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: 'For equal spacing, three radii of a circle should be ?? degrees apart.',
        correctAnswers: ['120'],
        explanation: '360° ÷ 3 = 120°'
      }
    ]
  },
  practiceExam: {
    id: 'circumscribed-inscribed-triangles-exam',
    title: 'Circumscribed & Inscribed Triangles Exam',
    timeLimit: 2400,
    totalMarks: 40,
    questions: [
      {
        id: 'exam-1',
        marks: 5,
        type: 'fill-blank',
        question: 'Explain the difference between a circumscribed triangle and an inscribed triangle.',
        correctAnswers: [
          'Circumscribed: triangle outside circle with sides tangent. Inscribed: triangle inside circle with vertices on circle',
          'Circumscribed is outside, inscribed is inside'
        ],
        explanation: 'Key distinction between the two types.'
      },
      {
        id: 'exam-2',
        marks: 4,
        type: 'fill-blank',
        question: 'Describe the steps to inscribe an equilateral triangle in a circle.',
        correctAnswers: [
          'Mark three points 120° apart on circle, connect them',
          'Divide circle into 3 equal parts (120°), mark points, connect'
        ],
        explanation: 'Equal spacing creates equilateral triangle.'
      },
      {
        id: 'exam-3',
        marks: 4,
        type: 'multiple-choice',
        question: 'If a right triangle is inscribed in a circle, where is the right angle?',
        options: [
          'At the center',
          'At a vertex opposite the diameter',
          'Between the other two vertices',
          'Anywhere on the circle'
        ],
        correctAnswer: 'At a vertex opposite the diameter',
        explanation: 'Thales\' theorem for right triangles.'
      },
      {
        id: 'exam-4',
        marks: 5,
        type: 'fill-blank',
        question: 'State one practical application of circumscribed or inscribed triangles in engineering.',
        correctAnswers: [
          'Gear design, pipe fitting, mechanical structures',
          'Three-point contact, load distribution'
        ],
        explanation: 'Real-world engineering uses.'
      }
    ]
  }
};

export const regulerPolygons = {
  id: 'regular-polygons',
  title: 'Constructing Regular Polygons',
  description: 'Methods for constructing regular pentagons, hexagons, heptagons, and octagons',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Understanding Regular Polygons',
    content: `
      <h3>What is a Regular Polygon?</h3>
      <p>A polygon is <strong>regular</strong> if all sides are equal length AND all angles are equal.</p>
      <ul>
        <li><strong>Pentagon:</strong> 5 sides, each interior angle = 108°</li>
        <li><strong>Hexagon:</strong> 6 sides, each interior angle = 120°</li>
        <li><strong>Heptagon:</strong> 7 sides, each interior angle ≈ 128.57°</li>
        <li><strong>Octagon:</strong> 8 sides, each interior angle = 135°</li>
      </ul>

      <h3>Interior Angle Formula</h3>
      <p><strong>Interior angle = (n - 2) × 180° / n</strong></p>
      <p>Where n = number of sides</p>
      <p>Example: Pentagon (n=5): (5-2)×180°/5 = 540°/5 = 108°</p>

      <h3>Two Construction Methods</h3>

      <h4>Method 1: Given a Circle (Circumscribed)</h4>
      <ol>
        <li>Draw circle with compass</li>
        <li>Calculate central angle = 360° / n</li>
        <li>Mark n points equally spaced around circle</li>
        <li>Connect consecutive points to form polygon</li>
      </ol>

      <h4>Method 2: Given a Side Length</h4>
      <ol>
        <li>Draw the base side of required length</li>
        <li>Construct angles equal to interior angle</li>
        <li>Draw each side with compass to match length</li>
        <li>Continue until polygon closes</li>
      </ol>

      <h3>Construction Details by Polygon</h3>

      <h4>Regular Pentagon (5 sides)</h4>
      <ul>
        <li>Central angle: 360°/5 = 72°</li>
        <li>Interior angle: 108°</li>
        <li>Method: Mark 5 points at 72° intervals</li>
      </ul>

      <h4>Regular Hexagon (6 sides)</h4>
      <ul>
        <li>Central angle: 360°/6 = 60°</li>
        <li>Interior angle: 120°</li>
        <li>Special: Compass radius = circle radius!</li>
        <li>Step around circle with compass opening = radius</li>
      </ul>

      <h4>Regular Heptagon (7 sides)</h4>
      <ul>
        <li>Central angle: 360°/7 ≈ 51.43°</li>
        <li>Interior angle: ≈ 128.57°</li>
        <li>Method: Most accurate using protractor for angles</li>
      </ul>

      <h4>Regular Octagon (8 sides)</h4>
      <ul>
        <li>Central angle: 360°/8 = 45°</li>
        <li>Interior angle: 135°</li>
        <li>Can use 45° set square for angles</li>
      </ul>

      <h3>Key Principles</h3>
      <ul>
        <li>All sides must be equal length</li>
        <li>All angles must be equal</li>
        <li>Central angles must sum to 360°</li>
        <li>Accuracy depends on precise measurements</li>
        <li>Use fresh compass point for each arc</li>
      </ul>

      <h3>Accuracy Tips</h3>
      <ul>
        <li>Use sharp pencil and compass</li>
        <li>Mark all construction lines lightly</li>
        <li>Verify measurements before connecting</li>
        <li>Check final angles with protractor</li>
        <li>Erase construction lines after completion</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'pentagon-construction',
      type: 'svg-animation',
      title: 'Pentagon Construction',
      description: 'Step-by-step construction of regular pentagon',
      svgComponent: 'PentagonConstructionVisualization'
    },
    {
      id: 'hexagon-construction',
      type: 'svg-animation',
      title: 'Hexagon Construction',
      description: 'Step-by-step construction of regular hexagon',
      svgComponent: 'HexagonConstructionVisualization'
    },
    {
      id: 'octagon-construction',
      type: 'svg-animation',
      title: 'Octagon Construction',
      description: 'Step-by-step construction of regular octagon',
      svgComponent: 'OctagenConstructionVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1-hexagon',
      difficulty: 'easy',
      title: 'Constructing a Regular Hexagon',
      problem: 'Construct a regular hexagon inscribed in a circle with radius 5cm.',
      steps: [
        {
          step: 1,
          action: 'Draw circle',
          explanation: 'Center O, radius 5cm',
          work: 'Circle complete'
        },
        {
          step: 2,
          action: 'Calculate central angle',
          explanation: '360°/6 = 60°',
          work: 'Each central angle = 60°'
        },
        {
          step: 3,
          action: 'Mark six points',
          explanation: 'At 0°, 60°, 120°, 180°, 240°, 300°',
          work: 'Six points marked on circle'
        },
        {
          step: 4,
          action: 'Set compass to 5cm',
          explanation: 'Same as circle radius (special property!)',
          work: 'Compass radius = 5cm'
        },
        {
          step: 5,
          action: 'Verify distances',
          explanation: 'Distance from center O to each marked point = 5cm',
          work: 'All distances equal'
        },
        {
          step: 6,
          action: 'Connect points',
          explanation: 'Draw lines between consecutive points',
          work: 'Regular hexagon complete'
        }
      ],
      answer: 'Regular hexagon with all sides = 5cm, all angles = 120°',
      commonMistakes: ['Angles not equally spaced', 'Compass radius changed during construction']
    },
    {
      id: 'example-2-pentagon',
      difficulty: 'medium',
      title: 'Constructing a Regular Pentagon',
      problem: 'Construct a regular pentagon inscribed in a circle with radius 4cm.',
      steps: [
        {
          step: 1,
          action: 'Draw circle',
          explanation: 'Center O, radius 4cm',
          work: 'Circle with center marked'
        },
        {
          step: 2,
          action: 'Calculate central angle',
          explanation: '360°/5 = 72°',
          work: 'Each central angle = 72°'
        },
        {
          step: 3,
          action: 'Mark five points',
          explanation: 'At 0°, 72°, 144°, 216°, 288°',
          work: 'Five points at equal angles'
        },
        {
          step: 4,
          action: 'Verify on circle',
          explanation: 'All points exactly on circumference',
          work: 'Points confirmed on circle'
        },
        {
          step: 5,
          action: 'Connect consecutive points',
          explanation: 'Form pentagon shape',
          work: 'Pentagon outline appears'
        },
        {
          step: 6,
          action: 'Verify angles',
          explanation: 'Each interior angle should = 108°',
          work: 'Regular pentagon verified'
        }
      ],
      answer: 'Regular pentagon inscribed with all sides equal and angles = 108°',
      commonMistakes: ['Angles not 72° apart', 'Points not on circle circumference']
    },
    {
      id: 'example-3-octagon',
      difficulty: 'medium',
      title: 'Constructing a Regular Octagon',
      problem: 'Construct a regular octagon inscribed in a circle with radius 6cm.',
      steps: [
        {
          step: 1,
          action: 'Draw circle',
          explanation: 'Center O, radius 6cm',
          work: 'Circle complete'
        },
        {
          step: 2,
          action: 'Calculate central angle',
          explanation: '360°/8 = 45°',
          work: 'Each central angle = 45°'
        },
        {
          step: 3,
          action: 'Mark points using 45° angle',
          explanation: 'Can use 45-45-90 set square',
          work: 'Eight points at 45° intervals'
        },
        {
          step: 4,
          action: 'Draw all eight points',
          explanation: 'At: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°',
          work: 'Eight points marked'
        },
        {
          step: 5,
          action: 'Connect in order',
          explanation: 'Draw sides between consecutive points',
          work: 'Eight-sided polygon formed'
        }
      ],
      answer: 'Regular octagon with 8 equal sides and all angles = 135°',
      commonMistakes: ['Using wrong angles', 'Points not equally distributed']
    },
    {
      id: 'example-4-given-side',
      difficulty: 'hard',
      title: 'Hexagon Given Side Length',
      problem: 'Construct a regular hexagon with each side = 3cm.',
      steps: [
        {
          step: 1,
          action: 'Draw base side AB',
          explanation: 'Horizontal line 3cm long',
          work: 'Base side AB = 3cm'
        },
        {
          step: 2,
          action: 'Calculate interior angle',
          explanation: '(6-2)×180°/6 = 120°',
          work: 'Interior angle = 120°'
        },
        {
          step: 3,
          action: 'Construct angle at A',
          explanation: 'Draw line at 120° to AB',
          work: 'Line from A at 120°'
        },
        {
          step: 4,
          action: 'Mark point B-C',
          explanation: 'Measure 3cm along the 120° line',
          work: 'Point C located'
        },
        {
          step: 5,
          action: 'Repeat five more times',
          explanation: 'Continue adding 3cm sides at 120° angles',
          work: 'Pentagon outline building'
        },
        {
          step: 6,
          action: 'Close the polygon',
          explanation: 'Last side meets starting point',
          work: 'Regular hexagon complete'
        }
      ],
      answer: 'Regular hexagon with each side = 3cm, all angles = 120°',
      commonMistakes: ['Interior angle calculated wrong', 'Sides not equal length', 'Angles not correct']
    },
    {
      id: 'example-5-heptagon',
      difficulty: 'hard',
      title: 'Constructing a Regular Heptagon',
      problem: 'Construct a regular heptagon (7-sided) inscribed in a circle with radius 5cm.',
      steps: [
        {
          step: 1,
          action: 'Draw circle',
          explanation: 'Center O, radius 5cm',
          work: 'Circle marked'
        },
        {
          step: 2,
          action: 'Calculate central angle',
          explanation: '360°/7 ≈ 51.43°',
          work: 'Central angle ≈ 51.43°'
        },
        {
          step: 3,
          action: 'Mark seven points',
          explanation: 'Use protractor for precise 51.43° angles',
          work: 'Seven points equally spaced'
        },
        {
          step: 4,
          action: 'Connect consecutive points',
          explanation: 'Draw all seven sides',
          work: 'Heptagon outline'
        },
        {
          step: 5,
          action: 'Verify symmetry',
          explanation: 'All sides should appear equal',
          work: 'Heptagon verified'
        }
      ],
      answer: 'Regular heptagon inscribed with 7 equal sides and angles ≈ 128.57°',
      commonMistakes: ['Angles not precise enough (51.43° required)', 'Using wrong angle measure']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is a regular polygon?',
      options: [
        'Any polygon with straight sides',
        'A polygon with all sides and angles equal',
        'A polygon with 4 sides',
        'A polygon that fits in a circle'
      ],
      correctAnswer: 'A polygon with all sides and angles equal',
      explanation: 'Definition of a regular polygon.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'A regular hexagon has ?? sides.',
      correctAnswers: ['6', 'six'],
      explanation: 'Hexa- means six.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is the central angle for a regular hexagon?',
      options: ['30°', '45°', '60°', '90°'],
      correctAnswer: '60°',
      explanation: '360° ÷ 6 = 60°'
    },
    {
      id: 'practice-4',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'The interior angle of a regular octagon is ??°.',
      correctAnswers: ['135'],
      explanation: '(8-2)×180°÷8 = 135°'
    },
    {
      id: 'practice-5',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'For a pentagon inscribed in a circle, the five points should be ?? degrees apart.',
      correctAnswers: ['72'],
      explanation: '360° ÷ 5 = 72°'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'When constructing a hexagon in a circle, the compass radius should be:',
      options: [
        'Half the circle radius',
        'Equal to the circle radius',
        'Twice the circle radius',
        'Any size'
      ],
      correctAnswer: 'Equal to the circle radius',
      explanation: 'Special property of hexagons in circles!'
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'The interior angle formula is ((n-2)×180°)/n. For a pentagon (n=5), this equals ??°.',
      correctAnswers: ['108'],
      explanation: '(5-2)×180°÷5 = 540°÷5 = 108°'
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Which polygon has interior angles of 135°?',
      options: [
        'Pentagon',
        'Hexagon',
        'Heptagon',
        'Octagon'
      ],
      correctAnswer: 'Octagon',
      explanation: '(8-2)×180°÷8 = 135°'
    },
    {
      id: 'practice-9',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'A regular heptagon has ?? sides and central angle ≈ 51.43°.',
      correctAnswers: ['7'],
      explanation: '360° ÷ 7 ≈ 51.43°'
    },
    {
      id: 'practice-10',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Which set square is most useful for constructing a regular octagon?',
      options: [
        '30-60-90',
        '45-45-90',
        'Both equally',
        'Neither useful'
      ],
      correctAnswer: '45-45-90',
      explanation: 'Octagon central angle is 45°.'
    }
  ],
  topicQuiz: {
    id: 'regular-polygons-quiz',
    title: 'Regular Polygons Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'A regular polygon has all ?? equal and all ?? equal.',
        correctAnswers: ['sides, angles'],
        explanation: 'Both properties required for regular.'
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'What is the central angle for a pentagon?',
        options: ['60°', '72°', '90°', '120°'],
        correctAnswer: '72°',
        explanation: '360° ÷ 5 = 72°'
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'The interior angle of a regular hexagon is ??°.',
        correctAnswers: ['120'],
        explanation: '(6-2)×180°÷6 = 120°'
      },
      {
        id: 'quiz-4',
        type: 'multiple-choice',
        question: 'For any regular polygon, interior angles + central angle equals:',
        options: ['90°', '180°', '270°', '360°'],
        correctAnswer: '180°',
        explanation: 'They form a straight line.'
      },
      {
        id: 'quiz-5',
        type: 'fill-blank',
        question: 'An octagon has ?? sides.',
        correctAnswers: ['8'],
        explanation: 'Octa- means eight.'
      }
    ]
  },
  practiceExam: {
    id: 'regular-polygons-exam',
    title: 'Regular Polygons Exam',
    timeLimit: 2400,
    totalMarks: 50,
    questions: [
      {
        id: 'exam-1',
        marks: 5,
        type: 'fill-blank',
        question: 'Describe the steps to construct a regular pentagon inscribed in a circle of radius 4cm.',
        correctAnswers: [
          'Draw circle, mark 5 points at 72° intervals, connect points',
          'Calculate 360°÷5=72°, mark 5 points, connect'
        ],
        explanation: 'Central angle is key to regular polygon construction.'
      },
      {
        id: 'exam-2',
        marks: 4,
        type: 'fill-blank',
        question: 'Calculate the interior angle of a regular heptagon using the formula.',
        correctAnswers: [
          '≈128.57°',
          '(7-2)×180°÷7 ≈ 128.57°'
        ],
        explanation: 'Use interior angle formula.'
      },
      {
        id: 'exam-3',
        marks: 5,
        type: 'multiple-choice',
        question: 'When constructing a regular hexagon in a circle, what special property do we use?',
        options: [
          'The radius equals half the side',
          'The radius equals the side length',
          'All angles are 90°',
          'There is no special property'
        ],
        correctAnswer: 'The radius equals the side length',
        explanation: 'This is a unique property of hexagons.'
      },
      {
        id: 'exam-4',
        marks: 5,
        type: 'fill-blank',
        question: 'Explain why a regular octagon can be easily constructed using a 45-45-90 set square.',
        correctAnswers: [
          'Because the central angle of octagon is 45°',
          '360°÷8=45°, which matches set square angle'
        ],
        explanation: 'Tool selection based on polygon angles.'
      },
      {
        id: 'exam-5',
        marks: 4,
        type: 'multiple-choice',
        question: 'Which polygon has interior angles of 120°?',
        options: [
          'Pentagon',
          'Hexagon',
          'Heptagon',
          'Octagon'
        ],
        correctAnswer: 'Hexagon',
        explanation: '(6-2)×180°÷6 = 120°'
      }
    ]
  }
};
