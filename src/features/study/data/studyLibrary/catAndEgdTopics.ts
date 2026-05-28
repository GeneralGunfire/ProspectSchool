// CAT (Computer Applications Technology) - 5 Topics

export const computerSystems = {
  id: 'computer-systems',
  title: 'Computer Systems',
  description: 'Hardware, software, and peripherals',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Understanding Computers',
    content: `
      <h3>What is a Computer?</h3>
      <p>Device that processes data and performs tasks based on instructions.</p>

      <h3>THREE COMPONENTS</h3>
      <p><strong>1. HARDWARE - Physical Parts</strong></p>
      <ul>
        <li><strong>CPU:</strong> Brain of computer, processes instructions</li>
        <li><strong>RAM:</strong> Temporary memory for active programs</li>
        <li><strong>Hard Drive/SSD:</strong> Permanent storage</li>
        <li><strong>Motherboard:</strong> Connects all components</li>
        <li><strong>Monitor:</strong> Displays information</li>
        <li><strong>Keyboard/Mouse:</strong> Input devices</li>
      </ul>

      <p><strong>2. SOFTWARE - Programs</strong></p>
      <ul>
        <li><strong>Operating System:</strong> Windows, Mac, Linux (controls computer)</li>
        <li><strong>Applications:</strong> Word, Excel, Photoshop (specific tasks)</li>
        <li><strong>System Software:</strong> Drivers, utilities</li>
      </ul>

      <p><strong>3. PERIPHERALS - Connected Devices</strong></p>
      <ul>
        <li>Printer, Scanner, Camera, Speakers, Microphone</li>
      </ul>

      <h3>Information Processing Cycle</h3>
      <p><strong>INPUT:</strong> Keyboard, mouse (data enters)</p>
      <p><strong>PROCESS:</strong> CPU processes instructions</p>
      <p><strong>OUTPUT:</strong> Monitor, printer (results appear)</p>
      <p><strong>STORAGE:</strong> Hard drive saves files</p>
      <p><strong>FEEDBACK:</strong> User sees results, makes adjustments</p>
    `
  },
  visualizations: [],
  workedExamples: [
    {
      id: 'example-1-components',
      difficulty: 'easy',
      title: 'Identifying Computer Components',
      problem: 'You need to upgrade your computer for faster performance. What is the main component you should upgrade?',
      steps: [
        {
          step: 1,
          action: 'Identify the problem',
          explanation: 'Slow performance usually means the CPU needs more power',
          work: 'CPU (Central Processing Unit) is the brain'
        },
        {
          step: 2,
          action: 'Consider RAM',
          explanation: 'If running many programs, more RAM helps',
          work: 'RAM stores active program data'
        },
        {
          step: 3,
          action: 'Consider storage',
          explanation: 'SSD upgrade provides faster file access',
          work: 'SSD much faster than mechanical hard drives'
        },
        {
          step: 4,
          action: 'Recommendation',
          explanation: 'For general performance: upgrade in order - SSD, RAM, then CPU',
          work: 'Each upgrade improves different aspects'
        }
      ],
      answer: 'Upgrade SSD first (fastest), then RAM, then CPU for best performance improvement.',
      commonMistakes: ['Thinking only CPU matters', 'Not considering RAM limitations']
    },
    {
      id: 'example-2-software',
      difficulty: 'easy',
      title: 'Software Types',
      problem: 'What is the difference between Operating System and Application Software?',
      steps: [
        {
          step: 1,
          action: 'Operating System (OS)',
          explanation: 'Controls all hardware and manages resources',
          work: 'Windows, Mac, Linux - runs everything'
        },
        {
          step: 2,
          action: 'Application Software',
          explanation: 'Programs that do specific tasks for users',
          work: 'Word, Excel, Photoshop - what users interact with'
        },
        {
          step: 3,
          action: 'Relationship',
          explanation: 'OS manages apps; apps rely on OS',
          work: 'Apps run on top of OS'
        }
      ],
      answer: 'OS controls hardware and manages resources; Applications perform specific user tasks.',
      commonMistakes: ['Confusing OS with applications']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is the primary function of RAM?',
      options: [
        'Permanent storage of files',
        'Temporary memory for active programs',
        'Processing instructions',
        'Displaying graphics'
      ],
      correctAnswer: 'Temporary memory for active programs',
      explanation: 'RAM stores data for programs currently running.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'The ? is the "brain" of the computer that processes all instructions.',
      correctAnswers: ['CPU', 'Central Processing Unit', 'processor'],
      explanation: 'The CPU executes all program instructions.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Which device is considered a peripheral?',
      options: ['CPU', 'Motherboard', 'Printer', 'RAM'],
      correctAnswer: 'Printer',
      explanation: 'Peripherals are external devices connected to the computer.'
    }
  ],
  topicQuiz: {
    id: 'computer-systems-quiz',
    title: 'Computer Systems Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Which component is responsible for long-term storage?',
        options: ['RAM', 'CPU', 'Hard Drive/SSD', 'Monitor'],
        correctAnswer: 'Hard Drive/SSD',
        explanation: 'Hard drives and SSDs store data permanently.'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'A ? is a computer program that controls the hardware and manages system resources.',
        correctAnswers: ['Operating System', 'OS', 'Software'],
        explanation: 'The OS is the main software managing everything.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'What is the Information Processing Cycle?',
        options: [
          'Input → Process → Output → Storage → Feedback',
          'Storage → Input → Process → Output',
          'Output → Feedback → Input → Process',
          'Process → Storage → Input → Output'
        ],
        correctAnswer: 'Input → Process → Output → Storage → Feedback',
        explanation: 'This is the complete cycle of computer operations.'
      }
    ]
  },
  practiceExam: {
    id: 'computer-systems-exam',
    title: 'Computer Systems Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: [
      {
        id: 'exam-1',
        marks: 3,
        type: 'fill-blank',
        question: 'Name three main hardware components of a computer.',
        correctAnswers: [
          'CPU, RAM, Hard Drive',
          'Motherboard, Monitor, Keyboard'
        ],
        explanation: 'There are many hardware components; these are examples.'
      },
      {
        id: 'exam-2',
        marks: 4,
        type: 'multiple-choice',
        question: 'Explain the difference between hardware and software.',
        options: [
          'Same thing, just different names',
          'Hardware is physical parts; software is programs and instructions',
          'Software is physical; hardware is digital',
          'No real difference'
        ],
        correctAnswer: 'Hardware is physical parts; software is programs and instructions',
        explanation: 'This is the fundamental distinction in computer systems.'
      }
    ]
  }
};

export const fileManagement = {
  id: 'file-management',
  title: 'File Management',
  description: 'Organizing folders, naming files, directory structure',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'File Organization',
    content: `
      <h3>File Structure</h3>
      <p><strong>Folder:</strong> Container for files (directory)</p>
      <p><strong>File:</strong> Document, image, or data</p>
      <p><strong>File Extension:</strong> Shows file type (.docx, .xlsx, .jpg, .pdf)</p>

      <h3>Good File Organization</h3>
      <p>Create folder structure like:</p>
      <p>Documents/</p>
      <p>├── School/</p>
      <p>│ ├── Grade 10/</p>
      <p>│ │ ├── Mathematics/</p>
      <p>│ │ ├── English/</p>
      <p>│ │ └── Biology/</p>
      <p>│ └── Grade 11/</p>
      <p>├── Work/</p>
      <p>└── Personal/</p>

      <h3>File Naming Best Practices</h3>
      <ul>
        <li><strong>GOOD:</strong> "Biology-Chapter3-Notes-2024.docx"</li>
        <li><strong>BAD:</strong> "document1.docx"</li>
        <li><strong>BETTER:</strong> "English-Macbeth-Analysis-Draft2.docx"</li>
      </ul>

      <h3>Naming Rules</h3>
      <ul>
        <li>Use descriptive names (subject-topic-type)</li>
        <li>Include date (YYYY-MM-DD format)</li>
        <li>Use version numbers (Draft1, Final, v2)</li>
        <li>Don't use spaces (use hyphens or underscores)</li>
        <li>Avoid special characters (!@#$%)</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'file-structure-explorer',
      type: 'svg-animation',
      title: 'File Structure Explorer',
      description: 'Interactive folder organization tool',
      svgComponent: 'FileStructureVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1-naming',
      difficulty: 'easy',
      title: 'File Naming Best Practices',
      problem: 'You have 3 versions of a Biology essay. How should you name them properly?',
      steps: [
        {
          step: 1,
          action: 'Include subject',
          explanation: 'Shows which subject the file belongs to',
          work: 'Start with "Biology-"'
        },
        {
          step: 2,
          action: 'Include topic',
          explanation: 'Describes what the file contains',
          work: '"Biology-Photosynthesis-'
        },
        {
          step: 3,
          action: 'Include version',
          explanation: 'Shows which draft or version',
          work: '"Biology-Photosynthesis-Draft1.docx"'
        },
        {
          step: 4,
          action: 'Complete naming scheme',
          explanation: 'Final versions would be Draft2, Draft3, Final',
          work: 'Draft1, Draft2, Draft3 versions'
        }
      ],
      answer: 'Biology-Photosynthesis-Draft1.docx, Biology-Photosynthesis-Draft2.docx, Biology-Photosynthesis-Final.docx',
      commonMistakes: ['Using vague names like essay1.docx, essay2.docx', 'Using spaces in filenames']
    },
    {
      id: 'example-2-structure',
      difficulty: 'medium',
      title: 'Creating a File Structure',
      problem: 'Organize files for: Math, English, Biology across Grade 10 and Grade 11.',
      steps: [
        {
          step: 1,
          action: 'Create root folder',
          explanation: 'Start with main folder name',
          work: 'Create "School" folder'
        },
        {
          step: 2,
          action: 'Add grade folders',
          explanation: 'Organize by grade level',
          work: 'Create Grade10, Grade11 inside School'
        },
        {
          step: 3,
          action: 'Add subject folders',
          explanation: 'Each grade has subjects',
          work: 'Create Math, English, Biology in each grade'
        },
        {
          step: 4,
          action: 'Final structure',
          explanation: 'Easy to find files by navigating folders',
          work: 'School/Grade10/Math, School/Grade10/English, etc.'
        }
      ],
      answer: 'School/Grade10/Math, School/Grade10/English, School/Grade10/Biology, School/Grade11/Math, etc.',
      commonMistakes: ['Too many nested folders', 'Not using consistent naming']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What does a file extension tell you?',
      options: [
        'The file size',
        'The file type',
        'Who created the file',
        'When it was created'
      ],
      correctAnswer: 'The file type',
      explanation: '.docx = Word, .xlsx = Excel, .jpg = Image, etc.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'A ? is a container that holds files and other folders.',
      correctAnswers: ['folder', 'directory', 'folder/directory'],
      explanation: 'Folders organize files hierarchically.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Which is the BEST way to name a file?',
      options: [
        'document.docx',
        'My Essay About Shakespeare.docx',
        'English-Hamlet-Analysis-Draft1.docx',
        'xyz123.docx'
      ],
      correctAnswer: 'English-Hamlet-Analysis-Draft1.docx',
      explanation: 'Descriptive names with hyphens (no spaces) are best practice.'
    }
  ],
  topicQuiz: {
    id: 'file-management-quiz',
    title: 'File Management Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'Use ? or ? instead of spaces when naming files.',
        correctAnswers: ['hyphens and underscores', 'hyphens', 'underscores', '- or _'],
        explanation: 'Spaces can cause problems in file names.'
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'What is the benefit of good file organization?',
        options: [
          'Makes files load faster',
          'Increases storage space',
          'Makes it easy to find files when needed',
          'Reduces file size'
        ],
        correctAnswer: 'Makes it easy to find files when needed',
        explanation: 'Organization saves time and reduces confusion.'
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'The file extension ? indicates a Microsoft Word document.',
        correctAnswers: ['.docx', 'docx'],
        explanation: '.docx is the standard Word format.'
      }
    ]
  },
  practiceExam: {
    id: 'file-management-exam',
    title: 'File Management Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: [
      {
        id: 'exam-1',
        marks: 4,
        type: 'fill-blank',
        question: 'Describe a good file naming convention with at least 3 elements.',
        correctAnswers: [
          'Subject-Topic-Type-Version, for example Math-Algebra-Homework-Draft1',
          'Descriptive name with subject, topic, and version'
        ],
        explanation: 'Good naming includes multiple identifying elements.'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'multiple-choice',
        question: 'Why should you avoid using spaces in file names?',
        options: [
          'It wastes storage space',
          'Spaces can cause problems in some systems and programs',
          'It makes files harder to find',
          'There is no real reason'
        ],
        correctAnswer: 'Spaces can cause problems in some systems and programs',
        explanation: 'Some systems interpret spaces as special characters.'
      }
    ]
  }
};

export const wordProcessing = {
  id: 'word-processing',
  title: 'Word Processing',
  description: 'Creating, formatting, and editing documents',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Using Word Processing',
    content: `
      <h3>Word Processing Basics</h3>
      <p><strong>Word processor:</strong> Software for creating and editing text documents</p>
      <p>Examples: Microsoft Word, Google Docs, LibreOffice</p>

      <h3>Key Features</h3>
      <ul>
        <li><strong>Font:</strong> Type of text (Arial, Times New Roman)</li>
        <li><strong>Font Size:</strong> Size of text (12pt, 14pt)</li>
        <li><strong>Bold:</strong> Heavy text for emphasis</li>
        <li><strong>Italic:</strong> Slanted text</li>
        <li><strong>Underline:</strong> Line under text</li>
        <li><strong>Alignment:</strong> Left, center, right, justified</li>
      </ul>

      <h3>Document Structure</h3>
      <ul>
        <li><strong>Heading:</strong> Title or section title (larger font)</li>
        <li><strong>Body:</strong> Main text</li>
        <li><strong>Bullets/Numbering:</strong> Lists</li>
        <li><strong>Spacing:</strong> Line spacing, paragraph spacing</li>
      </ul>

      <h3>Good Formatting Practice</h3>
      <ul>
        <li>Use consistent fonts throughout</li>
        <li>Use headings to organize</li>
        <li>Use bullets for lists</li>
        <li>Margins around text (about 2.5cm)</li>
        <li>Single or 1.5 line spacing</li>
      </ul>

      <h3>Common Document Types</h3>
      <ul>
        <li><strong>Letter:</strong> Formal or informal correspondence</li>
        <li><strong>Resume:</strong> Job application document</li>
        <li><strong>Essay:</strong> Structured writing</li>
        <li><strong>Report:</strong> Organized with headings, findings</li>
      </ul>
    `
  },
  visualizations: [],
  workedExamples: [
    {
      id: 'example-1-formatting',
      difficulty: 'easy',
      title: 'Document Formatting',
      problem: 'You need to format an essay with proper document structure. Describe the steps.',
      steps: [
        {
          step: 1,
          action: 'Set margins',
          explanation: 'Leave space around the document edges',
          work: 'Set to 2.5cm on all sides'
        },
        {
          step: 2,
          action: 'Add title (heading)',
          explanation: 'Main title should be larger and centered',
          work: 'Use heading style, 14-16pt, centered'
        },
        {
          step: 3,
          action: 'Format body text',
          explanation: 'Main content should be readable',
          work: '12pt font, 1.5 line spacing'
        },
        {
          step: 4,
          action: 'Add section headings',
          explanation: 'Organize with clear section titles',
          work: 'Use bold, slightly larger than body text'
        }
      ],
      answer: 'Margins 2.5cm, Title 14-16pt centered, Body 12pt 1.5 spacing, Headings bold',
      commonMistakes: ['Using too many font changes', 'Inconsistent spacing']
    },
    {
      id: 'example-2-document-types',
      difficulty: 'medium',
      title: 'Choosing Document Types',
      problem: 'What document type would you use for each: applying for a job, writing an assignment, sending a formal complaint?',
      steps: [
        {
          step: 1,
          action: 'Applying for a job',
          explanation: 'Need to showcase skills and experience',
          work: 'Use Resume or Curriculum Vitae (CV)'
        },
        {
          step: 2,
          action: 'Writing an assignment',
          explanation: 'Academic structured work',
          work: 'Use Essay format with headings'
        },
        {
          step: 3,
          action: 'Formal complaint',
          explanation: 'Official communication',
          work: 'Use Letter format with proper salutation'
        }
      ],
      answer: 'Resume for job, Essay for assignment, Letter for formal complaint',
      commonMistakes: ['Using wrong document type', 'Not following proper format']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is the purpose of using Bold in a document?',
      options: [
        'To make the document larger',
        'To emphasize important text',
        'To change the document color',
        'To add extra spacing'
      ],
      correctAnswer: 'To emphasize important text',
      explanation: 'Bold highlights important words or phrases.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Standard margins in most documents are set to about ? cm.',
      correctAnswers: ['2.5', '2', '3', '2.5cm'],
      explanation: 'Margins provide white space around the document.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Which formatting practice improves document readability?',
      options: [
        'Using 10 different fonts',
        'Using consistent fonts and line spacing',
        'Making text as small as possible',
        'Using only bold and italic'
      ],
      correctAnswer: 'Using consistent fonts and line spacing',
      explanation: 'Consistency makes documents easier to read.'
    }
  ],
  topicQuiz: {
    id: 'word-processing-quiz',
    title: 'Word Processing Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'A ? is a title or section heading that is formatted larger than body text.',
        correctAnswers: ['heading', 'Heading'],
        explanation: 'Headings organize document sections.'
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'What is italic formatting used for?',
        options: [
          'Making text bold',
          'Making text slanted (slanted text)',
          'Making text underlined',
          'Changing text color'
        ],
        correctAnswer: 'Making text slanted (slanted text)',
        explanation: 'Italic text is slanted and often used for emphasis or titles.'
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'Standard line spacing for most documents is ?? or 1.5 times.',
        correctAnswers: ['single', 'Single line spacing', '1'],
        explanation: 'Single or 1.5 spacing is standard for readability.'
      }
    ]
  },
  practiceExam: {
    id: 'word-processing-exam',
    title: 'Word Processing Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: [
      {
        id: 'exam-1',
        marks: 4,
        type: 'fill-blank',
        question: 'Describe the proper formatting for an academic essay including font, size, spacing, and margins.',
        correctAnswers: [
          'Arial or Times New Roman, 12pt, 1.5 spacing, 2.5cm margins',
          'Standard font, 12pt, single or 1.5 spacing, proper margins'
        ],
        explanation: 'Academic essays have standard formatting requirements.'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'multiple-choice',
        question: 'Why is alignment important in document formatting?',
        options: [
          'It makes the file size smaller',
          'It affects how the document appears and reads',
          'It is not important',
          'It only matters for titles'
        ],
        correctAnswer: 'It affects how the document appears and reads',
        explanation: 'Proper alignment improves document appearance and readability.'
      }
    ]
  }
};

export const spreadsheet = {
  id: 'spreadsheet-basics',
  title: 'Spreadsheet Basics',
  description: 'Excel/Calc fundamentals: rows, columns, formulas',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Understanding Spreadsheets',
    content: `
      <h3>What is a Spreadsheet?</h3>
      <p>Program for organizing and analyzing data in rows and columns</p>
      <p>Examples: Microsoft Excel, Google Sheets, LibreOffice Calc</p>

      <h3>Basic Components</h3>
      <ul>
        <li><strong>Row:</strong> Horizontal line of data (numbered 1, 2, 3...)</li>
        <li><strong>Column:</strong> Vertical line of data (lettered A, B, C...)</li>
        <li><strong>Cell:</strong> Intersection of row and column (A1, B3)</li>
        <li><strong>Sheet:</strong> Collection of rows/columns (tab at bottom)</li>
      </ul>

      <h3>Entering Data</h3>
      <ul>
        <li>Click a cell</li>
        <li>Type data (text, numbers, dates)</li>
        <li>Press Enter to confirm</li>
      </ul>

      <h3>Simple Formulas</h3>
      <p>Formulas start with = sign</p>
      <ul>
        <li><strong>=SUM(A1:A5)</strong> Adds cells A1 through A5</li>
        <li><strong>=AVERAGE(B1:B5)</strong> Calculates average</li>
        <li><strong>=COUNT(C1:C5)</strong> Counts cells with numbers</li>
        <li><strong>=A1+B1</strong> Adds two cells</li>
      </ul>

      <h3>Formatting</h3>
      <ul>
        <li>Font, color, bold, italic</li>
        <li>Cell background color</li>
        <li>Borders and gridlines</li>
        <li>Number format (currency, decimal places)</li>
      </ul>

      <h3>Practical Use</h3>
      <ul>
        <li>Grade tracking</li>
        <li>Budgeting</li>
        <li>Data analysis</li>
        <li>Inventory management</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'spreadsheet-grid',
      type: 'svg-animation',
      title: 'Spreadsheet Grid',
      description: 'Interactive spreadsheet cells and formulas',
      svgComponent: 'SpreadsheetGridVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1-formulas',
      difficulty: 'medium',
      title: 'Creating Simple Formulas',
      problem: 'You have student test scores in cells B2, B3, B4 (85, 90, 78). Create a formula to calculate the average.',
      steps: [
        {
          step: 1,
          action: 'Identify the values',
          explanation: 'Scores are in B2, B3, B4',
          work: '85, 90, 78'
        },
        {
          step: 2,
          action: 'Choose the function',
          explanation: 'Use AVERAGE function for mean',
          work: '=AVERAGE(...)'
        },
        {
          step: 3,
          action: 'Enter the formula',
          explanation: 'Include all cells to average',
          work: '=AVERAGE(B2:B4)'
        },
        {
          step: 4,
          action: 'Result',
          explanation: 'Formula calculates automatically',
          work: '(85+90+78)/3 = 84.33'
        }
      ],
      answer: '=AVERAGE(B2:B4) which results in 84.33',
      commonMistakes: ['Forgetting equals sign', 'Using wrong range (B2:B5 instead of B2:B4)']
    },
    {
      id: 'example-2-sorting',
      difficulty: 'easy',
      title: 'Organizing Data with Sorting',
      problem: 'You have student names and grades. How would you sort by grade from highest to lowest?',
      steps: [
        {
          step: 1,
          action: 'Select all data',
          explanation: 'Include names and grades',
          work: 'Select A1:B10'
        },
        {
          step: 2,
          action: 'Open Sort menu',
          explanation: 'Use Data menu > Sort',
          work: 'Click Data → Sort'
        },
        {
          step: 3,
          action: 'Choose sort key',
          explanation: 'Sort by grade column',
          work: 'Select Grade column'
        },
        {
          step: 4,
          action: 'Set order',
          explanation: 'Highest to lowest',
          work: 'Select Descending order'
        }
      ],
      answer: 'Select data, Data → Sort, choose Grade column, Descending',
      commonMistakes: ['Not selecting all data together', 'Sorting only names without grades']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What is a cell in a spreadsheet?',
      options: [
        'A row of data',
        'A column of data',
        'The intersection of a row and column',
        'The entire sheet'
      ],
      correctAnswer: 'The intersection of a row and column',
      explanation: 'Cells are identified by column letter and row number (A1, B2, etc.).'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'A formula in a spreadsheet always starts with a ?? symbol.',
      correctAnswers: ['=', 'equals sign', 'equals'],
      explanation: 'The = sign tells the spreadsheet this is a formula.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Which formula calculates the sum of cells A1 through A10?',
      options: [
        '=ADD(A1:A10)',
        '=SUM(A1:A10)',
        '=TOTAL(A1:A10)',
        '=COUNT(A1:A10)'
      ],
      correctAnswer: '=SUM(A1:A10)',
      explanation: 'SUM is the function used to add multiple cells.'
    }
  ],
  topicQuiz: {
    id: 'spreadsheet-quiz',
    title: 'Spreadsheet Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'fill-blank',
        question: 'Columns in a spreadsheet are labeled with ?? (A, B, C...)',
        correctAnswers: ['letters', 'Letters'],
        explanation: 'Rows use numbers, columns use letters.'
      },
      {
        id: 'quiz-2',
        type: 'multiple-choice',
        question: 'What does the SUM function do?',
        options: [
          'Finds the largest number',
          'Adds numbers together',
          'Counts how many cells',
          'Finds the average'
        ],
        correctAnswer: 'Adds numbers together',
        explanation: 'SUM calculates the total of selected cells.'
      },
      {
        id: 'quiz-3',
        type: 'fill-blank',
        question: 'To refer to a range of cells from A1 to A10, use the notation ?? .',
        correctAnswers: ['A1:A10'],
        explanation: 'The colon (:) indicates a range of cells.'
      }
    ]
  },
  practiceExam: {
    id: 'spreadsheet-exam',
    title: 'Spreadsheet Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: [
      {
        id: 'exam-1',
        marks: 4,
        type: 'fill-blank',
        question: 'Write a formula to calculate the average of values in cells C2 through C15.',
        correctAnswers: [
          '=AVERAGE(C2:C15)',
          'AVERAGE(C2:C15)'
        ],
        explanation: 'The AVERAGE function calculates the mean of a range.'
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'multiple-choice',
        question: 'What is the advantage of using formulas instead of calculating manually?',
        options: [
          'Formulas are slower',
          'Formulas automatically update when data changes',
          'Formulas are only for large numbers',
          'There is no advantage'
        ],
        correctAnswer: 'Formulas automatically update when data changes',
        explanation: 'This is the key benefit of spreadsheets for data analysis.'
      }
    ]
  }
};

// EGD (Engineering Graphics & Design) - 5 Topics

export const drawingInstruments = {
  id: 'drawing-instruments',
  title: 'Drawing Instruments & Techniques',
  description: 'Ruler, compass, protractor, and proper line quality',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Engineering Drawing Tools',
    content: `
      <h3>Essential Tools</h3>
      <ul>
        <li><strong>Ruler:</strong> For straight lines and measurements</li>
        <li><strong>Compass:</strong> For circles and arcs</li>
        <li><strong>Protractor:</strong> For measuring and drawing angles</li>
        <li><strong>Set Square:</strong> 45°-45°-90° and 30°-60°-90° angles</li>
        <li><strong>Pencils:</strong> HB for drawing, H for construction lines</li>
        <li><strong>Eraser:</strong> For mistakes</li>
      </ul>

      <h3>Line Types & Quality</h3>
      <ul>
        <li><strong>Object Line (thick, solid):</strong> Visible edges - use pencil firmly</li>
        <li><strong>Construction Line (light, thin):</strong> Helper lines - use light pressure</li>
        <li><strong>Hidden Line (dashed):</strong> Edges not visible - consistent dashes</li>
        <li><strong>Center Line (dash-dot):</strong> Symmetry and rotation axes</li>
      </ul>

      <h3>Proper Technique</h3>
      <ul>
        <li>Hold ruler firmly</li>
        <li>Draw from corner of ruler to prevent smudging</li>
        <li>Use light pressure for construction lines</li>
        <li>Keep pencil point sharp</li>
        <li>Erase construction lines after final drawing</li>
      </ul>

      <h3>Paper and Layout</h3>
      <ul>
        <li>Use quality drawing paper</li>
        <li>Leave margins around edge</li>
        <li>Center drawing on page</li>
        <li>Include title and scale</li>
      </ul>
    `
  },
  visualizations: [],
  workedExamples: [
    {
      id: 'example-1-tool-selection',
      difficulty: 'easy',
      title: 'Selecting the Right Tool',
      problem: 'You need to draw a 5cm diameter circle and measure a 60° angle. Which tools do you need?',
      steps: [
        {
          step: 1,
          action: 'For the circle',
          explanation: 'Use a compass to draw precise circles',
          work: 'Compass with 2.5cm radius setting'
        },
        {
          step: 2,
          action: 'For the angle',
          explanation: 'Use a protractor to measure and draw angles',
          work: 'Protractor aligned with baseline'
        },
        {
          step: 3,
          action: 'Summary',
          explanation: 'Combined tools give precision',
          work: 'Compass + Protractor + Ruler'
        }
      ],
      answer: 'Compass, Protractor, and Ruler',
      commonMistakes: ['Using only a ruler for circles', 'Guessing angles without protractor']
    },
    {
      id: 'example-2-line-quality',
      difficulty: 'medium',
      title: 'Understanding Line Quality',
      problem: 'When drawing an object with hidden edges, how should you draw the hidden lines?',
      steps: [
        {
          step: 1,
          action: 'Identify hidden lines',
          explanation: 'Hidden lines are edges you cannot see (behind the object)',
          work: 'Example: Back edges of a box'
        },
        {
          step: 2,
          action: 'Line style',
          explanation: 'Hidden lines use dashed pattern',
          work: 'Dashes with consistent spacing'
        },
        {
          step: 3,
          action: 'Technique',
          explanation: 'Draw using light-medium pressure',
          work: 'Regular dashes (about 5mm each)'
        }
      ],
      answer: 'Use light-medium pressure with consistent dashing pattern',
      commonMistakes: ['Using solid lines for hidden edges', 'Inconsistent dash lengths']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which tool is used to draw a perfect circle?',
      options: ['Ruler', 'Compass', 'Protractor', 'Set square'],
      correctAnswer: 'Compass',
      explanation: 'A compass is specifically designed for drawing circles and arcs.'
    },
    {
      id: 'practice-2',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What type of line is used for construction lines in a drawing?',
      options: ['Thick solid', 'Light and thin', 'Dashed', 'Dash-dot'],
      correctAnswer: 'Light and thin',
      explanation: 'Construction lines are drawn lightly so they can be easily erased.'
    },
    {
      id: 'practice-3',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Hidden edges in technical drawings are shown using ? lines.',
      correctAnswers: ['dashed', 'dashed lines', 'dash'],
      explanation: 'Dashed lines indicate edges that are not visible in that view.'
    }
  ],
  topicQuiz: {
    id: 'drawing-instruments-quiz',
    title: 'Drawing Instruments Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Which pencil grade is best for construction lines?',
        options: ['HB', 'H', 'B', '2B'],
        correctAnswer: 'H',
        explanation: 'H pencils are harder and create light lines suitable for construction.'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'A ? is used to measure and draw angles accurately.',
        correctAnswers: ['protractor'],
        explanation: 'The protractor is the standard tool for angle measurement.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'What is the correct way to hold a ruler when drawing?',
        options: ['Loosely', 'Very firmly with flat pressure', 'Tilted at angle', 'With one hand'],
        correctAnswer: 'Very firmly with flat pressure',
        explanation: 'Holding firmly prevents the ruler from shifting during drawing.'
      }
    ]
  },
  practiceExam: {
    id: 'drawing-instruments-exam',
    title: 'Drawing Instruments Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: [
      {
        id: 'exam-1',
        marks: 3,
        type: 'multiple-choice',
        question: 'Name three essential tools for technical drawing.',
        options: [
          'Pen, marker, crayon',
          'Ruler, compass, protractor',
          'Pencil, eraser, paper',
          'Calculator, ruler, pen'
        ],
        correctAnswer: 'Ruler, compass, protractor',
        explanation: 'These are the core precision tools for engineering drawings.'
      },
      {
        id: 'exam-2',
        marks: 4,
        type: 'fill-blank',
        question: 'List the four main types of lines used in technical drawings.',
        correctAnswers: [
          'Object line, construction line, hidden line, center line',
          'Solid, thin, dashed, dash-dot'
        ],
        explanation: 'Each line type serves a specific purpose in technical drawings.'
      }
    ]
  }
};

export const lineTypesAndLettering = {
  id: 'line-types-and-lettering',
  title: 'Line Types & Lettering',
  description: 'Engineering lettering and proper line standards',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Standards in Technical Drawing',
    content: `
      <h3>Line Standards</h3>
      <p>Different lines convey different information:</p>
      <ul>
        <li><strong>Object Line:</strong> Main outline (thick)</li>
        <li><strong>Hidden Line:</strong> Dashed, shows invisible edges</li>
        <li><strong>Center Line:</strong> Dash-dot, shows axes</li>
        <li><strong>Dimension Line:</strong> Shows measurements</li>
        <li><strong>Extension Line:</strong> Extends from object to dimension</li>
      </ul>

      <h3>Standard Lettering</h3>
      <p><strong>Requirements:</strong></p>
      <ul>
        <li>Consistent height (typically 3-5mm)</li>
        <li>Consistent spacing</li>
        <li>Upright or slightly slanted (max 15°)</li>
        <li>Clear and legible</li>
        <li>Use capital and lowercase appropriately</li>
      </ul>

      <h3>Common Mistakes</h3>
      <ul>
        <li>Inconsistent letter sizes</li>
        <li>Irregular spacing</li>
        <li>Shaky letters</li>
        <li>Poorly aligned baseline</li>
      </ul>

      <h3>Title Block</h3>
      <p>Usually bottom right corner:</p>
      <ul>
        <li>Drawing title</li>
        <li>Scale (1:50, 1:100)</li>
        <li>Date drawn</li>
        <li>Student/Drafter name</li>
      </ul>
    `
  },
  visualizations: [],
  workedExamples: [
    {
      id: 'example-1-line-types',
      difficulty: 'easy',
      title: 'Identifying Line Types',
      problem: 'A technical drawing shows a rectangular box. The visible edges are solid lines, and the back edges are dashed lines. What does this tell us?',
      steps: [
        {
          step: 1,
          action: 'Solid lines',
          explanation: 'Solid lines represent visible edges',
          work: 'Object lines - the front and top of the box'
        },
        {
          step: 2,
          action: 'Dashed lines',
          explanation: 'Dashed lines represent hidden edges',
          work: 'Hidden lines - the back edges we cannot see'
        },
        {
          step: 3,
          action: 'Interpretation',
          explanation: 'Together they show a 3D object in 2D',
          work: 'We understand the complete shape'
        }
      ],
      answer: 'The drawing shows the back edges are hidden from view, making it a 3D representation.',
      commonMistakes: ['Confusing dashed lines with construction lines']
    },
    {
      id: 'example-2-lettering',
      difficulty: 'medium',
      title: 'Proper Engineering Lettering',
      problem: 'You need to label a drawing with "ENGINEERING DESIGN 2024". What are the requirements?',
      steps: [
        {
          step: 1,
          action: 'Letter height',
          explanation: 'All letters should be 3-5mm tall',
          work: 'Consistent height throughout text'
        },
        {
          step: 2,
          action: 'Spacing',
          explanation: 'Space between letters should be uniform',
          work: 'About 1/4 of letter height'
        },
        {
          step: 3,
          action: 'Alignment',
          explanation: 'Letters sit on same baseline',
          work: 'Use guidelines (light lines) to help'
        },
        {
          step: 4,
          action: 'Style',
          explanation: 'Use upright or max 15° slant',
          work: 'Clean, legible appearance'
        }
      ],
      answer: 'Consistent 3-5mm height, uniform spacing, aligned baseline, upright style.',
      commonMistakes: ['Varying letter sizes', 'Inconsistent spacing', 'Shaky handwriting']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'What type of line represents edges that are not visible?',
      options: ['Object line', 'Dimension line', 'Hidden line', 'Center line'],
      correctAnswer: 'Hidden line',
      explanation: 'Hidden lines use a dashed pattern to show invisible edges.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Engineering lettering should have a consistent height of ? to ? mm.',
      correctAnswers: ['3 to 5', '3-5', '3', '5'],
      explanation: 'The standard height range ensures readability and consistency.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'What is shown in a title block?',
      options: [
        'Only the drawing name',
        'Drawing title, scale, date, and drafter name',
        'Only measurements',
        'Only the scale'
      ],
      correctAnswer: 'Drawing title, scale, date, and drafter name',
      explanation: 'The title block contains essential information about the drawing.'
    }
  ],
  topicQuiz: {
    id: 'line-types-quiz',
    title: 'Line Types Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'A dash-dot line (- - . - - .) in technical drawing represents:',
        options: ['Object outline', 'Hidden edges', 'Center line or axis', 'Dimension'],
        correctAnswer: 'Center line or axis',
        explanation: 'Dash-dot lines show axes of symmetry or rotation.'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'Letters in technical drawings should be ? or slightly slanted (max 15°).',
        correctAnswers: ['upright', 'vertical', 'straight'],
        explanation: 'Upright letters are standard for technical documentation.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'What is the maximum slant angle for technical lettering?',
        options: ['5°', '10°', '15°', '30°'],
        correctAnswer: '15°',
        explanation: 'Technical drawings use upright or up to 15° slant for clarity.'
      }
    ]
  },
  practiceExam: {
    id: 'line-types-exam',
    title: 'Line Types Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: [
      {
        id: 'exam-1',
        marks: 3,
        type: 'fill-blank',
        question: 'Name three types of lines used in technical drawings and their purposes.',
        correctAnswers: [
          'Object line (visible edges), Hidden line (invisible edges), Center line (axes)',
          'Solid, dashed, dash-dot'
        ],
        explanation: 'Each line type communicates specific information about the object.'
      },
      {
        id: 'exam-2',
        marks: 4,
        type: 'multiple-choice',
        question: 'Describe what information should be included in a title block.',
        options: [
          'Just the drawing name',
          'Drawing title, scale, date drawn, and drafter name',
          'Only measurements and dimensions',
          'The drawing title and nothing else'
        ],
        correctAnswer: 'Drawing title, scale, date drawn, and drafter name',
        explanation: 'Title block provides essential documentation for the drawing.'
      }
    ]
  }
};

export const geometricalConstructions = {
  id: 'geometrical-constructions',
  title: 'Geometrical Constructions',
  description: 'Perpendicular lines, angles, triangles using compass and ruler',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Basic Constructions',
    content: `
      <h3>Essential Constructions</h3>

      <h3>1. Perpendicular to a Line</h3>
      <ul>
        <li>Given a line and a point</li>
        <li>Use compass to create equal arcs above and below line</li>
        <li>Draw line through arc intersections</li>
        <li>Result: 90° angle</li>
      </ul>

      <h3>2. Bisecting an Angle</h3>
      <ul>
        <li>Given an angle</li>
        <li>Draw arc from vertex intersecting both sides</li>
        <li>Draw equal arcs from intersection points</li>
        <li>Line through intersections bisects angle</li>
      </ul>

      <h3>3. 60° Angle</h3>
      <ul>
        <li>Draw arc with compass from base point</li>
        <li>Keep same radius, mark point on arc</li>
        <li>Draw arc from that point to intersect first arc</li>
        <li>Line from base to intersection = 60°</li>
      </ul>

      <h3>4. Equilateral Triangle</h3>
      <ul>
        <li>Use 60° construction three times</li>
        <li>All sides equal length</li>
        <li>All angles 60°</li>
      </ul>

      <h3>Key Principle</h3>
      <p>All constructions use compass and straight edge (ruler)</p>
      <p>Never measure with ruler - use compass to transfer distances</p>
    `
  },
  visualizations: [
    {
      id: 'perpendicular-construction',
      type: 'svg-animation',
      title: 'Perpendicular Line Construction',
      description: 'Step-by-step animated construction',
      svgComponent: 'PerpendiculerConstructionVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1-perpendicular',
      difficulty: 'medium',
      title: 'Drawing a Perpendicular Line',
      problem: 'Draw a perpendicular line from a point on a given line AB using compass and ruler.',
      steps: [
        {
          step: 1,
          action: 'Mark the point',
          explanation: 'Let P be the point on line AB',
          work: 'Mark P clearly on the line'
        },
        {
          step: 2,
          action: 'Draw equal arcs',
          explanation: 'Use compass centered at P to draw arcs on both sides',
          work: 'Equal distance on both sides of P'
        },
        {
          step: 3,
          action: 'Find intersections',
          explanation: 'Set compass to wider radius, draw arcs above the line from each intersection',
          work: 'Arcs intersect at point Q above line'
        },
        {
          step: 4,
          action: 'Draw perpendicular',
          explanation: 'Draw line from P through Q',
          work: 'This line is perpendicular to AB (90°)'
        }
      ],
      answer: 'The line PQ is perpendicular to AB, forming a 90° angle.',
      commonMistakes: ['Using unequal arc distances', 'Not keeping compass width same for both arcs']
    },
    {
      id: 'example-2-60-angle',
      difficulty: 'medium',
      title: 'Constructing a 60° Angle',
      problem: 'Using only compass and ruler, construct a 60° angle from line AB.',
      steps: [
        {
          step: 1,
          action: 'Set compass width',
          explanation: 'Open compass to any convenient length',
          work: 'Let\'s say 4cm for example'
        },
        {
          step: 2,
          action: 'First arc',
          explanation: 'Draw arc from A with radius 4cm, marking intersection on AB at C',
          work: 'C is on line AB, 4cm from A'
        },
        {
          step: 3,
          action: 'Second arc',
          explanation: 'Keep compass at 4cm, center at C, draw arc above line',
          work: 'Arc intersects first arc at point D'
        },
        {
          step: 4,
          action: 'Complete angle',
          explanation: 'Draw line from A through D',
          work: 'Angle DAC = 60°'
        }
      ],
      answer: 'The angle formed is exactly 60° because the triangle is equilateral.',
      commonMistakes: ['Changing compass width between arcs', 'Not marking the intersection point']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'To construct a perpendicular to a line through a point on the line, which tools are needed?',
      options: ['Ruler only', 'Compass only', 'Compass and ruler', 'Protractor and ruler'],
      correctAnswer: 'Compass and ruler',
      explanation: 'You need a compass to create equal arcs and a ruler to draw the perpendicular line.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'A 60° angle is constructed using equal radii arcs, which creates an ? triangle.',
      correctAnswers: ['equilateral', 'equilateral triangle'],
      explanation: 'When all sides are equal, all angles are 60°.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'When bisecting an angle, the compass width should:',
      options: [
        'Be as small as possible',
        'Be as large as possible',
        'Stay the same for both arcs from the angle sides',
        'Change with each arc'
      ],
      correctAnswer: 'Stay the same for both arcs from the angle sides',
      explanation: 'Consistent compass width ensures accurate angle bisection.'
    }
  ],
  topicQuiz: {
    id: 'constructions-quiz',
    title: 'Constructions Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'What angle does a perpendicular line make with the original line?',
        options: ['45°', '60°', '90°', '180°'],
        correctAnswer: '90°',
        explanation: 'Perpendicular means at right angles (90°).'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'An equilateral triangle has all angles equal to ?°.',
        correctAnswers: ['60', '60°'],
        explanation: 'Each angle in an equilateral triangle is 60°.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'To bisect a line segment, you would:',
        options: [
          'Cut it in half with a ruler',
          'Use compass arcs to find the midpoint, then draw perpendicular',
          'Guess the middle',
          'Use a protractor'
        ],
        correctAnswer: 'Use compass arcs to find the midpoint, then draw perpendicular',
        explanation: 'Compass construction is precise and doesn\'t rely on guessing.'
      }
    ]
  },
  practiceExam: {
    id: 'constructions-exam',
    title: 'Constructions Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: [
      {
        id: 'exam-1',
        marks: 4,
        type: 'fill-blank',
        question: 'Explain the steps to construct a perpendicular line from a point on a given line.',
        correctAnswers: [
          'Mark point, draw equal arcs, intersect arcs from each arc point, draw line through intersection',
          'Use compass to create arcs equally spaced from point, then draw perpendicular'
        ],
        explanation: 'This is a fundamental construction in engineering drawing.'
      },
      {
        id: 'exam-2',
        marks: 4,
        type: 'multiple-choice',
        question: 'How do you construct a 60° angle using compass and ruler?',
        options: [
          'Use a protractor to measure 60°',
          'Draw equal radius arcs to form equilateral triangle',
          'Guess the angle',
          'Use a set square'
        ],
        correctAnswer: 'Draw equal radius arcs to form equilateral triangle',
        explanation: 'Equal radius arcs naturally create 60° angles.'
      }
    ]
  }
};

export const orthographicProjection = {
  id: 'orthographic-projection',
  title: 'Orthographic Projection',
  description: 'Converting 3D objects to 2D views (top, front, side)',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Understanding Orthographic Views',
    content: `
      <h3>What is Orthographic Projection?</h3>
      <p>Method of showing 3D object as 2D drawings from different angles</p>
      <p>Standard in engineering - unambiguous and to scale</p>

      <h3>Three Main Views</h3>
      <p><strong>1. TOP VIEW (Plan):</strong> Looking down from above</p>
      <p><strong>2. FRONT VIEW (Elevation):</strong> Looking at front</p>
      <p><strong>3. SIDE VIEW (Profile):</strong> Looking from side</p>

      <h3>Key Principles</h3>
      <ul>
        <li>Views are aligned with each other</li>
        <li>Hidden edges shown as dashed lines</li>
        <li>All views use same scale</li>
        <li>Dimensions can be added</li>
      </ul>

      <h3>Example: Cube</h3>
      <ul>
        <li><strong>Top view:</strong> Square</li>
        <li><strong>Front view:</strong> Square</li>
        <li><strong>Side view:</strong> Square</li>
      </ul>

      <h3>Example: L-shaped Object</h3>
      <ul>
        <li><strong>Top view:</strong> L-shape</li>
        <li><strong>Front view:</strong> Shows height</li>
        <li><strong>Side view:</strong> Shows depth</li>
      </ul>

      <h3>Why It Matters</h3>
      <ul>
        <li>Architects use for buildings</li>
        <li>Engineers use for machines</li>
        <li>Builders understand exact shape</li>
        <li>No ambiguity - precise communication</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: '3d-to-2d-converter',
      type: 'svg-animation',
      title: '3D to 2D Converter',
      description: 'Interactive tool showing orthographic projection',
      svgComponent: 'ThreeDToTwoDVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1-cube',
      difficulty: 'easy',
      title: 'Orthographic Views of a Cube',
      problem: 'Draw the three orthographic views (top, front, side) of a cube with 5cm sides.',
      steps: [
        {
          step: 1,
          action: 'Top view',
          explanation: 'Looking down from above at a cube',
          work: 'Square 5cm × 5cm'
        },
        {
          step: 2,
          action: 'Front view',
          explanation: 'Looking at the front face',
          work: 'Square 5cm × 5cm'
        },
        {
          step: 3,
          action: 'Side view',
          explanation: 'Looking from the right side',
          work: 'Square 5cm × 5cm'
        },
        {
          step: 4,
          action: 'All three views',
          explanation: 'For a cube, all three views are identical squares',
          work: 'Perfect representation of 3D cube in 2D'
        }
      ],
      answer: 'All three views are 5cm × 5cm squares because a cube looks the same from any direction.',
      commonMistakes: ['Drawing different sizes for different views', 'Forgetting to show all three views']
    },
    {
      id: 'example-2-rectangular-block',
      difficulty: 'medium',
      title: 'Orthographic Views of a Block',
      problem: 'A rectangular block is 10cm long, 6cm wide, and 4cm high. Draw its three orthographic views.',
      steps: [
        {
          step: 1,
          action: 'Top view',
          explanation: 'Looking down shows length and width',
          work: '10cm × 6cm rectangle'
        },
        {
          step: 2,
          action: 'Front view',
          explanation: 'Looking at front shows length and height',
          work: '10cm × 4cm rectangle'
        },
        {
          step: 3,
          action: 'Side view',
          explanation: 'Looking from side shows width and height',
          work: '6cm × 4cm rectangle'
        },
        {
          step: 4,
          action: 'Alignment',
          explanation: 'All views must align with matching dimensions',
          work: 'All edges labeled with dimensions'
        }
      ],
      answer: 'Top: 10×6, Front: 10×4, Side: 6×4 (all aligned and properly scaled)',
      commonMistakes: ['Misaligning views', 'Incorrect dimensions', 'Forgetting hidden edges']
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'How many standard views are typically shown in orthographic projection?',
      options: ['One', 'Two', 'Three', 'Four'],
      correctAnswer: 'Three',
      explanation: 'Top, Front, and Side views provide complete 3D information.'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'The top view of an object shows its ? and ? dimensions.',
      correctAnswers: ['length and width', 'width and length'],
      explanation: 'Looking from above reveals the length and width of an object.'
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'In orthographic projection, hidden edges should be shown as:',
      options: ['Solid lines', 'Dashed lines', 'Erased', 'Dotted lines'],
      correctAnswer: 'Dashed lines',
      explanation: 'Dashed lines represent edges not visible in that particular view.'
    }
  ],
  topicQuiz: {
    id: 'orthographic-quiz',
    title: 'Orthographic Projection Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'Which view is obtained by looking at an object from the side?',
        options: ['Top view', 'Front view', 'Side view (profile)', 'Isometric view'],
        correctAnswer: 'Side view (profile)',
        explanation: 'The side view is also called the profile view.'
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'All orthographic views must use the same ? so they are proportional.',
        correctAnswers: ['scale', 'proportions', 'ratio'],
        explanation: 'Consistent scale ensures accurate representation across all views.'
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'What does a dashed line in an orthographic view represent?',
        options: ['A construction line', 'A visible edge', 'A hidden edge', 'A center line'],
        correctAnswer: 'A hidden edge',
        explanation: 'Dashed lines show edges that are behind other parts in that view.'
      }
    ]
  },
  practiceExam: {
    id: 'orthographic-exam',
    title: 'Orthographic Projection Exam',
    timeLimit: 2400,
    totalMarks: 25,
    questions: [
      {
        id: 'exam-1',
        marks: 4,
        type: 'fill-blank',
        question: 'Explain the three main orthographic views and what dimension each shows.',
        correctAnswers: [
          'Top: length and width, Front: length and height, Side: width and height',
          'Plan, elevation, profile'
        ],
        explanation: 'Each view provides essential information about the 3D object.'
      },
      {
        id: 'exam-2',
        marks: 4,
        type: 'multiple-choice',
        question: 'Why are all views in orthographic projection drawn to the same scale?',
        options: [
          'It looks better',
          'It is required by law',
          'It ensures accurate proportions and allows measurements from the drawing',
          'It is easier to draw'
        ],
        correctAnswer: 'It ensures accurate proportions and allows measurements from the drawing',
        explanation: 'Same scale is essential for precision in engineering drawings.'
      }
    ]
  }
};
