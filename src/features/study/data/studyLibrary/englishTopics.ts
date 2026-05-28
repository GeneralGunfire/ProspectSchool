// ENGLISH - 5 Topics

export const languageStructures = {
  id: 'language-structures',
  title: 'Language Structures',
  description: 'Sentence types, parts of speech, and grammar',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Understanding Grammar',
    content: `
      <h3>Sentence Types</h3>

      <p><strong>1. SIMPLE SENTENCE</strong></p>
      <ul>
        <li>One independent clause</li>
        <li>Example: "The cat sleeps."</li>
        <li>Subject + Verb</li>
      </ul>

      <p><strong>2. COMPOUND SENTENCE</strong></p>
      <ul>
        <li>Two independent clauses joined by coordinator (and, but, or)</li>
        <li>Example: "The cat sleeps and the dog plays."</li>
        <li>Can also use semicolon: "The cat sleeps; the dog plays."</li>
      </ul>

      <p><strong>3. COMPLEX SENTENCE</strong></p>
      <ul>
        <li>One independent clause + one or more dependent clauses</li>
        <li>Example: "Because it was tired, the cat slept."</li>
        <li>Uses subordinators: because, when, if, although, etc.</li>
      </ul>

      <h3>Parts of Speech</h3>
      <ul>
        <li><strong>Noun:</strong> Person, place, thing (cat, school, happiness)</li>
        <li><strong>Verb:</strong> Action or state (run, sleep, is)</li>
        <li><strong>Adjective:</strong> Describes noun (big, blue, happy)</li>
        <li><strong>Adverb:</strong> Describes verb (quickly, very, really)</li>
        <li><strong>Pronoun:</strong> Replaces noun (he, she, it, they)</li>
        <li><strong>Preposition:</strong> Shows relationship (in, on, under, between)</li>
        <li><strong>Conjunction:</strong> Joins words/clauses (and, but, or, because)</li>
      </ul>

      <h3>Sentence Components</h3>
      <ul>
        <li><strong>Subject:</strong> Who/what the sentence is about</li>
        <li><strong>Predicate:</strong> What the subject does or is</li>
        <li><strong>Object:</strong> Receives the action (She threw the ball)</li>
      </ul>

      <h3>Common Errors</h3>
      <ul>
        <li><strong>Run-on:</strong> Two independent clauses without connector</li>
        <li><strong>Fragment:</strong> Incomplete sentence</li>
        <li><strong>Subject-Verb Disagreement:</strong> "The dogs runs" (wrong)</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'sentence-diagrammer',
      type: 'svg-animation',
      title: 'Sentence Structure Analyzer',
      description: 'Interactive tool to analyze sentence components',
      svgComponent: 'SentenceDiagrammerVisualization'
    }
  ],
  workedExamples: [
    {
      id: 'example-1',
      difficulty: 'easy',
      title: 'Identifying Sentence Type',
      problem: 'Because it was late, Sarah went to bed. What type of sentence?',
      steps: [
        { step: 1, action: 'Find independent clause', explanation: '"Sarah went to bed" is independent', work: 'Independent clause present' },
        { step: 2, action: 'Find dependent clause', explanation: '"Because it was late" is dependent (starts with subordinator)', work: 'Dependent clause present' },
        { step: 3, action: 'Classify', explanation: 'One independent + one dependent = complex', work: 'Complex sentence' }
      ],
      answer: 'Complex sentence',
      commonMistakes: []
    }
  ],
  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which sentence is simple?',
      options: [
        'The cat sleeps.',
        'The cat sleeps and the dog plays.',
        'Because the cat was tired, it slept.',
        'Although the cat was tired, it played.'
      ],
      correctAnswer: 'The cat sleeps.',
      explanation: 'Simple has only one independent clause.'
    }
  ],
  topicQuiz: {
    id: 'language-structures-quiz',
    title: 'Language Structures Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'language-structures-exam',
    title: 'Language Structures Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};

export const readingComprehension = {
  id: 'reading-comprehension',
  title: 'Reading & Comprehension',
  description: 'Literal and inferential understanding of texts',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Understanding Text',
    content: `
      <h3>Two Levels of Comprehension</h3>

      <p><strong>1. LITERAL COMPREHENSION</strong></p>
      <ul>
        <li>What the text explicitly says</li>
        <li>Answer is directly in the text</li>
        <li>Example: "What color was the car?" Answer: "Red" (stated in text)</li>
      </ul>

      <p><strong>2. INFERENTIAL COMPREHENSION</strong></p>
      <ul>
        <li>What the text implies or suggests</li>
        <li>Must read between the lines</li>
        <li>Requires combining clues from text with general knowledge</li>
        <li>Example: "Why was John shaking?" (not directly stated but inferred from clues)</li>
      </ul>

      <h3>Strategies for Comprehension</h3>
      <ul>
        <li><strong>Skim:</strong> Quick overview of main ideas</li>
        <li><strong>Scan:</strong> Look for specific information</li>
        <li><strong>Read Actively:</strong> Take notes, ask questions</li>
        <li><strong>Identify Main Idea:</strong> What is the passage about?</li>
        <li><strong>Find Supporting Details:</strong> Examples that back up main idea</li>
      </ul>

      <h3>Question Types</h3>
      <ul>
        <li><strong>Factual:</strong> Who, what, when, where (literal)</li>
        <li><strong>Why/How:</strong> Reasons and causes (inferential)</li>
        <li><strong>Inference:</strong> What is implied? (inferential)</li>
        <li><strong>Vocabulary:</strong> Word meaning from context</li>
      </ul>

      <h3>Identifying Fact vs Opinion</h3>
      <p><strong>Fact:</strong> "The sun rises in the east" (provable, true)</p>
      <p><strong>Opinion:</strong> "Sunrises are beautiful" (subjective, belief)</p>
    `
  },
  visualizations: [],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'comprehension-quiz',
    title: 'Reading Comprehension Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'comprehension-exam',
    title: 'Reading Comprehension Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};

export const writingEssays = {
  id: 'writing-essays',
  title: 'Writing Essays',
  description: 'Essay structure: introduction, body, conclusion',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Essay Writing',
    content: `
      <h3>Essay Structure</h3>

      <p><strong>1. INTRODUCTION (5-10% of essay)</strong></p>
      <ul>
        <li><strong>Hook:</strong> Interesting opening line to grab attention</li>
        <li><strong>Background:</strong> Context about topic</li>
        <li><strong>Thesis:</strong> Main argument/claim (usually last sentence)</li>
      </ul>

      <p><strong>2. BODY PARAGRAPHS (70-80% of essay)</strong></p>
      <ul>
        <li><strong>Topic Sentence:</strong> Main point of paragraph (usually first)</li>
        <li><strong>Evidence:</strong> Facts, quotes, examples supporting claim</li>
        <li><strong>Analysis:</strong> Explain how evidence supports argument</li>
        <li><strong>Conclusion Sentence:</strong> Wrap up paragraph idea</li>
      </ul>

      <p><strong>3. CONCLUSION (5-10% of essay)</strong></p>
      <ul>
        <li>Restate thesis (don't just repeat)</li>
        <li>Summarize main points</li>
        <li>Final thought or call to action</li>
      </ul>

      <h3>Essay Types</h3>
      <ul>
        <li><strong>Narrative:</strong> Tells a story with beginning, middle, end</li>
        <li><strong>Descriptive:</strong> Paints picture with sensory details</li>
        <li><strong>Persuasive:</strong> Argues for a position</li>
        <li><strong>Expository:</strong> Explains/informs about topic</li>
      </ul>

      <h3>Writing Process</h3>
      <ol>
        <li>Brainstorm ideas</li>
        <li>Create outline</li>
        <li>Write first draft</li>
        <li>Revise for clarity and flow</li>
        <li>Edit for grammar and spelling</li>
        <li>Proofread final version</li>
      </ol>

      <h3>Key Points</h3>
      <ul>
        <li>Use clear, simple language</li>
        <li>Support claims with evidence</li>
        <li>Organize logically</li>
        <li>Keep paragraphs focused on one idea</li>
      </ul>
    `
  },
  visualizations: [
    {
      id: 'essay-structure-diagram',
      type: 'svg-animation',
      title: 'Essay Structure Diagram',
      description: 'Visual breakdown of essay components',
      svgComponent: 'EssayStructureVisualization'
    }
  ],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'writing-essays-quiz',
    title: 'Writing Essays Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'writing-essays-exam',
    title: 'Writing Essays Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};

export const literaryAnalysis = {
  id: 'literary-analysis',
  title: 'Literary Analysis',
  description: 'Poetry, prose, literary devices, character analysis',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Analyzing Literature',
    content: `
      <h3>Literary Devices</h3>

      <p><strong>METAPHOR</strong></p>
      <ul>
        <li>Direct comparison: "Life is a journey"</li>
        <li>No "like" or "as"</li>
      </ul>

      <p><strong>SIMILE</strong></p>
      <ul>
        <li>Comparison using "like" or "as"</li>
        <li>Example: "Life is like a journey"</li>
      </ul>

      <p><strong>PERSONIFICATION</strong></p>
      <ul>
        <li>Giving human qualities to non-human things</li>
        <li>Example: "The wind whispered secrets"</li>
      </ul>

      <p><strong>IMAGERY</strong></p>
      <ul>
        <li>Sensory language (sight, sound, touch, smell, taste)</li>
        <li>Example: "The soft breeze carried sweet perfume"</li>
      </ul>

      <p><strong>SYMBOLISM</strong></p>
      <ul>
        <li>Something represents something else</li>
        <li>Example: Dove = peace</li>
      </ul>

      <h3>Character Analysis</h3>
      <ul>
        <li><strong>Characterization:</strong> How author reveals character</li>
        <li><strong>Motivation:</strong> Why character acts/feels certain way</li>
        <li><strong>Development:</strong> How character changes through story</li>
        <li><strong>Conflict:</strong> Internal (within self) or external (with others)</li>
      </ul>

      <h3>Poetry Analysis</h3>
      <ul>
        <li><strong>Theme:</strong> Main message or lesson</li>
        <li><strong>Rhyme Scheme:</strong> Pattern of rhyming words (AABB, ABAB)</li>
        <li><strong>Rhythm:</strong> Stress pattern in lines</li>
        <li><strong>Tone:</strong> Author's attitude toward subject</li>
      </ul>

      <h3>Steps to Analyze</h3>
      <ol>
        <li>Read carefully</li>
        <li>Identify devices used</li>
        <li>Consider effect on reader</li>
        <li>Explain how it supports main idea</li>
      </ol>
    `
  },
  visualizations: [
    {
      id: 'literary-devices-explorer',
      type: 'svg-animation',
      title: 'Literary Devices Explorer',
      description: 'Examples of metaphor, simile, personification, etc.',
      svgComponent: 'LiteraryDevicesVisualization'
    }
  ],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'literary-analysis-quiz',
    title: 'Literary Analysis Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'literary-analysis-exam',
    title: 'Literary Analysis Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};

export const communicationSkills = {
  id: 'communication-skills',
  title: 'Communication Skills',
  description: 'Speaking, listening, presentation, and interpersonal skills',
  grade: 10,
  term: 1,
  conceptExplanation: {
    title: 'Effective Communication',
    content: `
      <h3>Communication Process</h3>
      <ul>
        <li><strong>Sender:</strong> Person sending message</li>
        <li><strong>Message:</strong> What is being communicated</li>
        <li><strong>Medium:</strong> How it is sent (speech, writing, etc.)</li>
        <li><strong>Receiver:</strong> Person getting message</li>
        <li><strong>Feedback:</strong> Response from receiver</li>
      </ul>

      <h3>Types of Communication</h3>

      <p><strong>VERBAL</strong></p>
      <ul>
        <li>Spoken words</li>
        <li>Clear pronunciation and pace</li>
      </ul>

      <p><strong>NON-VERBAL</strong></p>
      <ul>
        <li>Body language, eye contact, gestures</li>
        <li>Can convey more than words</li>
      </ul>

      <p><strong>WRITTEN</strong></p>
      <ul>
        <li>Letters, emails, reports</li>
        <li>Must be clear and organized</li>
      </ul>

      <h3>Active Listening</h3>
      <ul>
        <li>Focus on speaker</li>
        <li>Avoid interrupting</li>
        <li>Ask clarifying questions</li>
        <li>Show understanding through feedback</li>
      </ul>

      <h3>Presentation Skills</h3>
      <ul>
        <li>Know your content</li>
        <li>Practice beforehand</li>
        <li>Make eye contact</li>
        <li>Use clear, confident voice</li>
        <li>Use visual aids appropriately</li>
        <li>Stand confidently</li>
      </ul>

      <h3>Interpersonal Skills</h3>
      <ul>
        <li>Empathy: Understand others' feelings</li>
        <li>Respect: Value others' opinions</li>
        <li>Cooperation: Work together toward goals</li>
        <li>Conflict resolution: Handle disagreements constructively</li>
      </ul>

      <h3>Barriers to Communication</h3>
      <ul>
        <li>Noise (physical distractions)</li>
        <li>Misunderstanding</li>
        <li>Prejudice</li>
        <li>Lack of feedback</li>
      </ul>
    `
  },
  visualizations: [],
  workedExamples: [],
  practiceQuestions: [],
  topicQuiz: {
    id: 'communication-quiz',
    title: 'Communication Skills Quiz',
    passingScore: 70,
    questions: []
  },
  practiceExam: {
    id: 'communication-exam',
    title: 'Communication Skills Exam',
    timeLimit: 2400,
    totalMarks: 30,
    questions: []
  }
};
