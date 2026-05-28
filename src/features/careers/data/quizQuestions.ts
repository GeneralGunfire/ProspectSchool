export interface QuizQuestion {
  id: string;
  question: string;
  riasecCode: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  careerExamples?: string[];
}

export const quizQuestions: QuizQuestion[] = [
  // ── Realistic (R) — 6 questions ─────────────────────────────────────────────
  {
    id: 'R1',
    question: 'I enjoy working with tools, machines, or equipment to fix or build things.',
    riasecCode: 'R',
    careerExamples: ['Electrician', 'Mechanic', 'Civil Engineer'],
  },
  {
    id: 'R3',
    question: 'I feel proud when I can see or touch something I have made or repaired with my own hands.',
    riasecCode: 'R',
    careerExamples: ['Welder', 'Carpenter', 'Plumber'],
  },
  {
    id: 'R4',
    question: 'If a household appliance broke down, I would want to take it apart and figure out how to fix it.',
    riasecCode: 'R',
    careerExamples: ['Appliance Technician', 'Electronics Technician'],
  },
  {
    id: 'R7',
    question: 'I like working on practical problems where I can see an immediate, real-world result.',
    riasecCode: 'R',
    careerExamples: ['Boilermaker', 'Automotive Technician', 'Structural Engineer'],
  },
  {
    id: 'R8',
    question: 'I enjoy learning technical skills such as wiring, plumbing, welding, or woodworking.',
    riasecCode: 'R',
    careerExamples: ['Electrician', 'Plumber', 'Cabinet Maker'],
  },
  {
    id: 'R10',
    question: 'I find hands-on training and apprenticeships more appealing than years of classroom study.',
    riasecCode: 'R',
    careerExamples: ['Artisan', 'TVET Graduate', 'Trade Professional'],
  },

  // ── Investigative (I) — 6 questions ─────────────────────────────────────────
  {
    id: 'I1',
    question: "When I don't understand how something works, I keep researching until I find the answer.",
    riasecCode: 'I',
    careerExamples: ['Scientist', 'Engineer', 'Doctor'],
  },
  {
    id: 'I3',
    question: 'I like solving complex puzzles or brainteasers that require careful logical thinking.',
    riasecCode: 'I',
    careerExamples: ['Data Scientist', 'Mathematician', 'Software Engineer'],
  },
  {
    id: 'I4',
    question: 'I would enjoy conducting experiments in a laboratory to test ideas and hypotheses.',
    riasecCode: 'I',
    careerExamples: ['Chemist', 'Microbiologist', 'Forensic Scientist'],
  },
  {
    id: 'I5',
    question: 'I find myself asking "why?" or "how?" far more often than most people around me.',
    riasecCode: 'I',
    careerExamples: ['Researcher', 'Academic', 'Medical Doctor'],
  },
  {
    id: 'I6',
    question: 'I enjoy analysing data, statistics, or research findings to draw conclusions.',
    riasecCode: 'I',
    careerExamples: ['Statistician', 'Economist', 'Data Analyst'],
  },
  {
    id: 'I9',
    question: 'I enjoy subjects like Mathematics, Physical Sciences, or Life Sciences at school.',
    riasecCode: 'I',
    careerExamples: ['Engineer', 'Doctor', 'Actuary'],
  },

  // ── Artistic (A) — 6 questions ───────────────────────────────────────────────
  {
    id: 'A1',
    question: 'I express myself best through creative activities like drawing, music, writing, or performance.',
    riasecCode: 'A',
    careerExamples: ['Graphic Designer', 'Musician', 'Author'],
  },
  {
    id: 'A2',
    question: 'I enjoy creating original work — something that reflects my own unique perspective or style.',
    riasecCode: 'A',
    careerExamples: ['Fine Artist', 'Fashion Designer', 'Filmmaker'],
  },
  {
    id: 'A3',
    question: 'I notice and appreciate good design, colour, layout, or visual style in the world around me.',
    riasecCode: 'A',
    careerExamples: ['Interior Designer', 'Graphic Designer', 'Architect'],
  },
  {
    id: 'A5',
    question: 'I feel most energised when I am working on a creative project that has no single correct answer.',
    riasecCode: 'A',
    careerExamples: ['UX Designer', 'Art Director', 'Creative Director'],
  },
  {
    id: 'A7',
    question: 'I am drawn to careers in media, entertainment, fashion, or the arts.',
    riasecCode: 'A',
    careerExamples: ['Content Creator', 'Fashion Designer', 'Photographer'],
  },
  {
    id: 'A10',
    question: 'I would enjoy a job where I help shape how something looks, sounds, or feels to an audience.',
    riasecCode: 'A',
    careerExamples: ['Sound Engineer', 'Set Designer', 'UI/UX Designer'],
  },

  // ── Social (S) — 6 questions ─────────────────────────────────────────────────
  {
    id: 'S1',
    question: 'I feel most satisfied when I have helped someone work through a difficult problem.',
    riasecCode: 'S',
    careerExamples: ['Counsellor', 'Social Worker', 'Teacher'],
  },
  {
    id: 'S3',
    question: 'I am a good listener and people often come to me when they need advice or support.',
    riasecCode: 'S',
    careerExamples: ['Psychologist', 'Life Coach', 'Chaplain'],
  },
  {
    id: 'S4',
    question: 'I enjoy teaching, explaining, or mentoring — helping others understand something new.',
    riasecCode: 'S',
    careerExamples: ['Teacher', 'Tutor', 'Corporate Trainer'],
  },
  {
    id: 'S5',
    question: 'I care deeply about social issues and want my work to have a positive impact on my community.',
    riasecCode: 'S',
    careerExamples: ['Social Worker', 'NGO Manager', 'Public Health Worker'],
  },
  {
    id: 'S7',
    question: 'I would find it rewarding to work with children, elderly people, or people facing hardship.',
    riasecCode: 'S',
    careerExamples: ['Early Childhood Educator', 'Occupational Therapist', 'Care Worker'],
  },
  {
    id: 'S10',
    question: 'I enjoy community events, volunteer work, or activities that bring people together.',
    riasecCode: 'S',
    careerExamples: ['Community Organiser', 'Nonprofit Director', 'Educator'],
  },

  // ── Enterprising (E) — 6 questions ──────────────────────────────────────────
  {
    id: 'E1',
    question: 'I enjoy taking charge and leading others toward a goal.',
    riasecCode: 'E',
    careerExamples: ['Manager', 'Entrepreneur', 'Politician'],
  },
  {
    id: 'E2',
    question: 'I am confident when speaking in front of a group, pitching an idea, or negotiating.',
    riasecCode: 'E',
    careerExamples: ['Sales Manager', 'Lawyer', 'Marketing Director'],
  },
  {
    id: 'E3',
    question: 'I often think about starting my own business or creating something from nothing.',
    riasecCode: 'E',
    careerExamples: ['Entrepreneur', 'Franchise Owner', 'Startup Founder'],
  },
  {
    id: 'E4',
    question: 'I am motivated by competition — I like to win, achieve targets, and be recognised for results.',
    riasecCode: 'E',
    careerExamples: ['Sales Executive', 'Investment Banker', 'Business Development Manager'],
  },
  {
    id: 'E5',
    question: 'I enjoy convincing others to see my point of view or persuading them to take action.',
    riasecCode: 'E',
    careerExamples: ['Lawyer', 'Marketer', 'Real Estate Agent'],
  },
  {
    id: 'E9',
    question: 'I enjoy organising and managing events, projects, or groups of people.',
    riasecCode: 'E',
    careerExamples: ['Events Manager', 'Project Manager', 'Operations Director'],
  },

  // ── Conventional (C) — 5 questions ──────────────────────────────────────────
  {
    id: 'C1',
    question: 'I like having a clear set of rules or procedures to follow when completing a task.',
    riasecCode: 'C',
    careerExamples: ['Accountant', 'Bookkeeper', 'Compliance Officer'],
  },
  {
    id: 'C3',
    question: 'I enjoy working with numbers, spreadsheets, budgets, or financial records.',
    riasecCode: 'C',
    careerExamples: ['Accountant', 'Financial Analyst', 'Actuary'],
  },
  {
    id: 'C4',
    question: 'I notice small errors or inconsistencies that others might overlook.',
    riasecCode: 'C',
    careerExamples: ['Auditor', 'Quality Controller', 'Legal Proofreader'],
  },
  {
    id: 'C5',
    question: 'I prefer a structured, predictable work environment to one that is always changing.',
    riasecCode: 'C',
    careerExamples: ['Bank Teller', 'Office Manager', 'Government Official'],
  },
  {
    id: 'C7',
    question: 'I feel satisfaction when I complete a task neatly, accurately, and on time.',
    riasecCode: 'C',
    careerExamples: ['Paralegal', 'Office Administrator', 'Tax Consultant'],
  },
];
