import { quizQuestions } from './quizQuestions';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CareerMatch {
  id: string;
  title: string;
  category: string;
  riasecTypes: string[];
  description: string;
  salaryRange: string;
  salaryMin: number;
  educationPath: 'University' | 'TVET' | 'Trade/Apprenticeship' | 'University/TVET';
  jobDemand: 'High' | 'Medium' | 'Low';
  studyYears: string;
  apsRequired: number | null;
  subjects: string[];
  compatibilityScore?: number;
  whyItFits?: string;
}

export interface RIASECScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface QuizResults {
  rawScores: RIASECScores;
  percentages: RIASECScores;
  topCodes: string[];
  topCareerMatches: CareerMatch[];
  subjectRecommendations: SubjectRecommendation[];
  profileDescription: string;
}

export interface SubjectRecommendation {
  subject: string;
  importance: 'Essential' | 'Recommended' | 'Useful';
  reason: string;
}

// ── Career Database ───────────────────────────────────────────────────────────

export const CAREER_DATABASE: CareerMatch[] = [
  // ── University Track (15) ────────────────────────────────────────────────
  {
    id: 'medical-doctor',
    title: 'Medical Doctor',
    category: 'Healthcare',
    riasecTypes: ['I', 'S', 'R'],
    description: 'Diagnose and treat illnesses, injuries, and medical conditions in patients across all age groups.',
    salaryRange: 'R600k – R2.5m',
    salaryMin: 600000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '6 years + internship',
    apsRequired: 40,
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences'],
    whyItFits: 'Combines scientific investigation with caring for people — ideal for curious, empathetic thinkers.',
  },
  {
    id: 'civil-engineer',
    title: 'Civil Engineer',
    category: 'Engineering',
    riasecTypes: ['R', 'I', 'E'],
    description: 'Design, plan, and oversee the construction of roads, bridges, dams, and buildings.',
    salaryRange: 'R400k – R1.1m',
    salaryMin: 400000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '4 years',
    apsRequired: 34,
    subjects: ['Mathematics', 'Physical Sciences'],
    whyItFits: 'Perfect for hands-on thinkers who love applying science to real-world construction challenges.',
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Technology',
    riasecTypes: ['I', 'R', 'C'],
    description: 'Design, build, and test software applications and systems used on computers, phones, and the web.',
    salaryRange: 'R450k – R1.2m',
    salaryMin: 450000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '3–4 years',
    apsRequired: 32,
    subjects: ['Mathematics', 'Physical Sciences', 'Information Technology'],
    whyItFits: 'Suits analytical problem-solvers who enjoy building structured, logical systems.',
  },
  {
    id: 'chartered-accountant',
    title: 'Chartered Accountant (CA)',
    category: 'Finance',
    riasecTypes: ['C', 'E', 'I'],
    description: 'Provide financial advice, audit accounts, and manage financial records for businesses and individuals.',
    salaryRange: 'R500k – R1.5m',
    salaryMin: 500000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '5–6 years (degree + articles)',
    apsRequired: 35,
    subjects: ['Mathematics', 'Accounting'],
    whyItFits: 'Great for detail-oriented, numbers-driven people who want to work in business and finance.',
  },
  {
    id: 'lawyer',
    title: 'Attorney / Lawyer',
    category: 'Law',
    riasecTypes: ['E', 'I', 'S'],
    description: 'Advise and represent clients in legal matters, from contracts and property to criminal defence.',
    salaryRange: 'R350k – R1.8m',
    salaryMin: 350000,
    educationPath: 'University',
    jobDemand: 'Medium',
    studyYears: '4 years + articles',
    apsRequired: 36,
    subjects: ['English', 'History', 'Mathematics Literacy or Mathematics'],
    whyItFits: 'Ideal for persuasive, analytical people who enjoy argument, research, and social justice.',
  },
  {
    id: 'architect',
    title: 'Architect',
    category: 'Built Environment',
    riasecTypes: ['A', 'R', 'I'],
    description: 'Design buildings and spaces, balancing aesthetics, function, safety, and environmental impact.',
    salaryRange: 'R350k – R900k',
    salaryMin: 350000,
    educationPath: 'University',
    jobDemand: 'Medium',
    studyYears: '5 years',
    apsRequired: 34,
    subjects: ['Mathematics', 'Physical Sciences', 'Visual Art or EGD'],
    whyItFits: 'Perfect for creative, spatially-minded people who want to shape the built environment.',
  },
  {
    id: 'clinical-psychologist',
    title: 'Clinical Psychologist',
    category: 'Healthcare',
    riasecTypes: ['S', 'I', 'A'],
    description: 'Diagnose and treat mental health conditions using therapy, counselling, and psychological assessments.',
    salaryRange: 'R350k – R1.2m',
    salaryMin: 350000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '7 years (including internship)',
    apsRequired: 30,
    subjects: ['Mathematics', 'Life Sciences', 'English'],
    whyItFits: 'A rewarding fit for empathetic, curious people who want to understand and improve mental wellbeing.',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Technology',
    riasecTypes: ['I', 'C', 'E'],
    description: 'Analyse large datasets to uncover patterns and insights that help businesses make better decisions.',
    salaryRange: 'R500k – R1.4m',
    salaryMin: 500000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '3–4 years',
    apsRequired: 34,
    subjects: ['Mathematics', 'Physical Sciences', 'Information Technology'],
    whyItFits: 'Ideal for logical, detail-focused thinkers who love finding meaning in numbers and patterns.',
  },
  {
    id: 'teacher',
    title: 'Teacher (Secondary School)',
    category: 'Education',
    riasecTypes: ['S', 'A', 'E'],
    description: 'Educate and inspire learners in their subject specialisation, from Grades 8–12.',
    salaryRange: 'R280k – R550k',
    salaryMin: 280000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '4 years',
    apsRequired: 26,
    subjects: ['English', 'Mathematics or Maths Literacy', 'Subject Specialisation'],
    whyItFits: 'Suits patient communicators who enjoy helping others grow and think for themselves.',
  },
  {
    id: 'pharmacist',
    title: 'Pharmacist',
    category: 'Healthcare',
    riasecTypes: ['I', 'C', 'S'],
    description: 'Dispense medications, advise patients on drug interactions, and ensure safe pharmaceutical practices.',
    salaryRange: 'R400k – R900k',
    salaryMin: 400000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '4 years',
    apsRequired: 34,
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences'],
    whyItFits: 'A great match for precise, science-minded people who want to work in healthcare without surgery.',
  },
  {
    id: 'environmental-scientist',
    title: 'Environmental Scientist',
    category: 'Science',
    riasecTypes: ['I', 'R', 'S'],
    description: 'Study and protect natural environments, investigating pollution, climate change, and ecosystems.',
    salaryRange: 'R280k – R700k',
    salaryMin: 280000,
    educationPath: 'University',
    jobDemand: 'Medium',
    studyYears: '3–4 years',
    apsRequired: 28,
    subjects: ['Life Sciences', 'Physical Sciences', 'Geography', 'Mathematics'],
    whyItFits: 'Perfect for curious outdoor-lovers who want to use science to solve real environmental problems.',
  },
  {
    id: 'physiotherapist',
    title: 'Physiotherapist',
    category: 'Healthcare',
    riasecTypes: ['S', 'R', 'I'],
    description: 'Help patients recover from injuries and physical conditions through targeted exercise and treatment.',
    salaryRange: 'R300k – R800k',
    salaryMin: 300000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '4 years',
    apsRequired: 30,
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences'],
    whyItFits: 'Suits hands-on people who want to care for others and work with the physical body.',
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    category: 'Business',
    riasecTypes: ['E', 'A', 'S'],
    description: 'Develop and execute campaigns to promote products and services, grow brand awareness, and drive sales.',
    salaryRange: 'R350k – R1.1m',
    salaryMin: 350000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '3 years',
    apsRequired: 26,
    subjects: ['Business Studies', 'English', 'Economics'],
    whyItFits: 'A natural match for creative, outgoing people who love storytelling, strategy, and trends.',
  },
  {
    id: 'actuary',
    title: 'Actuary',
    category: 'Finance',
    riasecTypes: ['C', 'I', 'E'],
    description: 'Use mathematics and statistics to assess financial risk for insurance companies and pension funds.',
    salaryRange: 'R600k – R2m',
    salaryMin: 600000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '4 years + exams',
    apsRequired: 38,
    subjects: ['Mathematics', 'Physical Sciences', 'Accounting'],
    whyItFits: 'The ultimate career for students who love maths and want a high-earning, intellectually demanding role.',
  },
  {
    id: 'social-worker',
    title: 'Social Worker',
    category: 'Social Services',
    riasecTypes: ['S', 'E', 'C'],
    description: 'Support individuals and families facing poverty, abuse, mental health crises, or social challenges.',
    salaryRange: 'R180k – R450k',
    salaryMin: 180000,
    educationPath: 'University',
    jobDemand: 'High',
    studyYears: '4 years',
    apsRequired: 24,
    subjects: ['English', 'Life Orientation', 'Life Sciences'],
    whyItFits: 'Deeply rewarding for compassionate, community-minded people who want to create real social change.',
  },

  // ── TVET / Trade (15) ────────────────────────────────────────────────────
  {
    id: 'electrician',
    title: 'Electrician',
    category: 'Trades',
    riasecTypes: ['R', 'I', 'C'],
    description: 'Install, maintain, and repair electrical wiring and systems in homes, businesses, and factories.',
    salaryRange: 'R180k – R600k',
    salaryMin: 180000,
    educationPath: 'Trade/Apprenticeship',
    jobDemand: 'High',
    studyYears: '3–4 years (apprenticeship)',
    apsRequired: null,
    subjects: ['Mathematics', 'Physical Sciences', 'Technical subjects'],
    whyItFits: 'Hands-on, problem-solving work with excellent job security and potential to own your own business.',
  },
  {
    id: 'plumber',
    title: 'Plumber',
    category: 'Trades',
    riasecTypes: ['R', 'C', 'E'],
    description: 'Install and maintain water, drainage, and gas pipe systems in residential and commercial buildings.',
    salaryRange: 'R160k – R520k',
    salaryMin: 160000,
    educationPath: 'Trade/Apprenticeship',
    jobDemand: 'High',
    studyYears: '3–4 years (apprenticeship)',
    apsRequired: null,
    subjects: ['Mathematics', 'Physical Sciences'],
    whyItFits: 'High-demand trade with steady work, practical problem-solving, and strong earning potential.',
  },
  {
    id: 'welder',
    title: 'Welder',
    category: 'Trades',
    riasecTypes: ['R', 'C', 'I'],
    description: 'Join metal parts together using heat and specialised equipment for construction, mining, and manufacturing.',
    salaryRange: 'R150k – R480k',
    salaryMin: 150000,
    educationPath: 'Trade/Apprenticeship',
    jobDemand: 'High',
    studyYears: '2–3 years',
    apsRequired: null,
    subjects: ['Mathematics', 'Physical Sciences', 'Technical subjects'],
    whyItFits: 'Satisfying skilled trade with opportunities in mining, manufacturing, marine, and oil industries.',
  },
  {
    id: 'motor-mechanic',
    title: 'Motor Vehicle Mechanic',
    category: 'Trades',
    riasecTypes: ['R', 'I', 'C'],
    description: 'Diagnose, service, and repair cars, trucks, and other motor vehicles.',
    salaryRange: 'R140k – R450k',
    salaryMin: 140000,
    educationPath: 'Trade/Apprenticeship',
    jobDemand: 'High',
    studyYears: '3–4 years (apprenticeship)',
    apsRequired: null,
    subjects: ['Mathematics', 'Physical Sciences', 'Technical subjects'],
    whyItFits: 'Perfect for people who love cars and want a practical, in-demand skill with room to specialise.',
  },
  {
    id: 'chef',
    title: 'Chef / Culinary Professional',
    category: 'Hospitality',
    riasecTypes: ['R', 'A', 'E'],
    description: 'Prepare, cook, and present food in restaurants, hotels, events, and catering businesses.',
    salaryRange: 'R120k – R600k',
    salaryMin: 120000,
    educationPath: 'TVET',
    jobDemand: 'Medium',
    studyYears: '2–3 years',
    apsRequired: null,
    subjects: ['Life Sciences', 'Mathematics Literacy', 'Consumer Studies'],
    whyItFits: 'Creative and practical — ideal for people who love food, culture, and working with their hands.',
  },
  {
    id: 'boilermaker',
    title: 'Boilermaker',
    category: 'Trades',
    riasecTypes: ['R', 'C', 'I'],
    description: 'Fabricate and assemble large metal containers such as boilers, tanks, and pressure vessels.',
    salaryRange: 'R180k – R550k',
    salaryMin: 180000,
    educationPath: 'Trade/Apprenticeship',
    jobDemand: 'High',
    studyYears: '3–4 years',
    apsRequired: null,
    subjects: ['Mathematics', 'Physical Sciences', 'EGD'],
    whyItFits: 'Critical skill in South African mining and energy sectors — steady demand and excellent pay.',
  },
  {
    id: 'hairdresser',
    title: 'Hairdresser / Cosmetologist',
    category: 'Beauty & Wellness',
    riasecTypes: ['A', 'R', 'S'],
    description: 'Cut, style, colour, and treat hair; may also offer beauty and skincare treatments.',
    salaryRange: 'R80k – R350k',
    salaryMin: 80000,
    educationPath: 'TVET',
    jobDemand: 'Medium',
    studyYears: '2 years',
    apsRequired: null,
    subjects: ['Life Sciences', 'Mathematics Literacy', 'Consumer Studies'],
    whyItFits: 'Creative, people-facing work with real potential to build your own salon business.',
  },
  {
    id: 'it-technician',
    title: 'IT Support Technician',
    category: 'Technology',
    riasecTypes: ['R', 'I', 'C'],
    description: 'Install, configure, and troubleshoot computer hardware and software for businesses and individuals.',
    salaryRange: 'R130k – R420k',
    salaryMin: 130000,
    educationPath: 'TVET',
    jobDemand: 'High',
    studyYears: '2–3 years',
    apsRequired: null,
    subjects: ['Mathematics', 'Information Technology', 'Physical Sciences'],
    whyItFits: 'Practical tech career with fast growth potential — no university degree required.',
  },
  {
    id: 'logistics-coordinator',
    title: 'Logistics & Supply Chain Coordinator',
    category: 'Operations',
    riasecTypes: ['C', 'E', 'R'],
    description: 'Manage the movement, storage, and delivery of goods across supply chains and distribution networks.',
    salaryRange: 'R180k – R600k',
    salaryMin: 180000,
    educationPath: 'TVET',
    jobDemand: 'High',
    studyYears: '2–3 years',
    apsRequired: null,
    subjects: ['Mathematics', 'Business Studies', 'Geography'],
    whyItFits: 'A structured, organised role in one of SA\'s fastest-growing economic sectors.',
  },
  {
    id: 'agricultural-technician',
    title: 'Agricultural Technician',
    category: 'Agriculture',
    riasecTypes: ['R', 'I', 'S'],
    description: 'Assist farmers and scientists with crop production, animal care, soil analysis, and irrigation systems.',
    salaryRange: 'R140k – R380k',
    salaryMin: 140000,
    educationPath: 'TVET',
    jobDemand: 'High',
    studyYears: '2–3 years',
    apsRequired: null,
    subjects: ['Life Sciences', 'Physical Sciences', 'Mathematics Literacy'],
    whyItFits: 'Outdoor, practical work that contributes to South Africa\'s vital food security.',
  },
  {
    id: 'travel-consultant',
    title: 'Travel & Tourism Consultant',
    category: 'Hospitality',
    riasecTypes: ['E', 'S', 'C'],
    description: 'Plan and book travel itineraries, accommodation, and tours for individuals and corporate clients.',
    salaryRange: 'R100k – R360k',
    salaryMin: 100000,
    educationPath: 'TVET',
    jobDemand: 'Medium',
    studyYears: '2 years',
    apsRequired: null,
    subjects: ['Geography', 'English', 'Business Studies'],
    whyItFits: 'Suits social, organised people who love learning about the world and helping others explore it.',
  },
  {
    id: 'bricklayer',
    title: 'Bricklayer / Construction Worker',
    category: 'Construction',
    riasecTypes: ['R', 'C', 'E'],
    description: 'Lay bricks, blocks, and other materials to construct walls, structures, and buildings.',
    salaryRange: 'R100k – R350k',
    salaryMin: 100000,
    educationPath: 'Trade/Apprenticeship',
    jobDemand: 'High',
    studyYears: '2–3 years',
    apsRequired: null,
    subjects: ['Mathematics', 'Physical Sciences'],
    whyItFits: 'Steady, in-demand physical trade with opportunity to start your own construction business.',
  },
  {
    id: 'early-childhood-educator',
    title: 'Early Childhood Development Educator',
    category: 'Education',
    riasecTypes: ['S', 'A', 'R'],
    description: 'Support the learning, development, and wellbeing of children from birth to age six.',
    salaryRange: 'R80k – R280k',
    salaryMin: 80000,
    educationPath: 'TVET',
    jobDemand: 'High',
    studyYears: '2 years',
    apsRequired: null,
    subjects: ['Life Orientation', 'English', 'Life Sciences'],
    whyItFits: 'Rewarding work that creates lifelong impact through nurturing children\'s earliest development.',
  },
  {
    id: 'dental-assistant',
    title: 'Dental Assistant',
    category: 'Healthcare',
    riasecTypes: ['R', 'S', 'C'],
    description: 'Assist dentists during procedures, prepare equipment, and manage patient care in a dental practice.',
    salaryRange: 'R120k – R360k',
    salaryMin: 120000,
    educationPath: 'TVET',
    jobDemand: 'Medium',
    studyYears: '2 years',
    apsRequired: null,
    subjects: ['Life Sciences', 'Mathematics Literacy', 'Physical Sciences'],
    whyItFits: 'Practical healthcare career without the long university route — meaningful patient interaction daily.',
  },
  {
    id: 'refrigeration-technician',
    title: 'Refrigeration & Air Conditioning Technician',
    category: 'Trades',
    riasecTypes: ['R', 'I', 'C'],
    description: 'Install and maintain refrigeration, cooling, and air conditioning systems across commercial and industrial sites.',
    salaryRange: 'R160k – R500k',
    salaryMin: 160000,
    educationPath: 'Trade/Apprenticeship',
    jobDemand: 'High',
    studyYears: '3–4 years',
    apsRequired: null,
    subjects: ['Mathematics', 'Physical Sciences', 'Technical subjects'],
    whyItFits: 'Growing demand as climate change increases the need for HVAC professionals across SA.',
  },

  // ── Mixed / Emerging (10) ────────────────────────────────────────────────
  {
    id: 'ux-designer',
    title: 'UX / UI Designer',
    category: 'Technology & Design',
    riasecTypes: ['A', 'I', 'C'],
    description: 'Design the look, feel, and usability of digital products like apps and websites.',
    salaryRange: 'R280k – R950k',
    salaryMin: 280000,
    educationPath: 'University/TVET',
    jobDemand: 'High',
    studyYears: '2–4 years',
    apsRequired: null,
    subjects: ['Design', 'Information Technology', 'Visual Art'],
    whyItFits: 'Combines creative thinking with logical structure — perfect for tech-savvy designers.',
  },
  {
    id: 'content-creator',
    title: 'Content Creator / Digital Influencer',
    category: 'Media & Creative',
    riasecTypes: ['A', 'E', 'S'],
    description: 'Produce and share video, photo, or written content across social media and digital platforms.',
    salaryRange: 'R60k – R2m+',
    salaryMin: 60000,
    educationPath: 'University/TVET',
    jobDemand: 'High',
    studyYears: '0–3 years',
    apsRequired: null,
    subjects: ['English', 'Visual Art', 'Business Studies'],
    whyItFits: 'Entrepreneurial creative path with unlimited ceiling for those who can build an audience.',
  },
  {
    id: 'drone-pilot',
    title: 'Commercial Drone Pilot',
    category: 'Technology',
    riasecTypes: ['R', 'I', 'E'],
    description: 'Operate drones for photography, surveying, agriculture, infrastructure inspection, and film production.',
    salaryRange: 'R150k – R600k',
    salaryMin: 150000,
    educationPath: 'University/TVET',
    jobDemand: 'High',
    studyYears: '6 months – 1 year (certification)',
    apsRequired: null,
    subjects: ['Mathematics', 'Physical Sciences', 'Information Technology'],
    whyItFits: 'Cutting-edge, fast-growing field for technically minded people who love aviation and technology.',
  },
  {
    id: 'solar-technician',
    title: 'Solar / Renewable Energy Technician',
    category: 'Green Energy',
    riasecTypes: ['R', 'I', 'C'],
    description: 'Install, maintain, and repair solar panels, inverters, and renewable energy systems.',
    salaryRange: 'R160k – R550k',
    salaryMin: 160000,
    educationPath: 'University/TVET',
    jobDemand: 'High',
    studyYears: '1–3 years',
    apsRequired: null,
    subjects: ['Mathematics', 'Physical Sciences', 'Electrical subjects'],
    whyItFits: 'One of the fastest-growing sectors in SA due to loadshedding and the energy transition.',
  },
  {
    id: 'game-developer',
    title: 'Game Developer',
    category: 'Technology & Creative',
    riasecTypes: ['I', 'A', 'R'],
    description: 'Design and build video games — from concept and storyline to programming and visual design.',
    salaryRange: 'R250k – R1.1m',
    salaryMin: 250000,
    educationPath: 'University/TVET',
    jobDemand: 'Medium',
    studyYears: '3–4 years',
    apsRequired: 28,
    subjects: ['Mathematics', 'Information Technology', 'Visual Art'],
    whyItFits: 'Combines creative storytelling with technical programming — a dream career for gamers who code.',
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Technology',
    riasecTypes: ['I', 'C', 'R'],
    description: 'Protect computer systems and networks from hackers, data breaches, and cyber threats.',
    salaryRange: 'R380k – R1.3m',
    salaryMin: 380000,
    educationPath: 'University/TVET',
    jobDemand: 'High',
    studyYears: '3–4 years',
    apsRequired: 30,
    subjects: ['Mathematics', 'Information Technology', 'Physical Sciences'],
    whyItFits: 'High-paying, critical role in every industry — SA has a massive shortage of cybersecurity professionals.',
  },
  {
    id: 'events-manager',
    title: 'Events Manager',
    category: 'Business & Creative',
    riasecTypes: ['E', 'A', 'S'],
    description: 'Plan and manage concerts, corporate events, weddings, conferences, and festivals.',
    salaryRange: 'R180k – R700k',
    salaryMin: 180000,
    educationPath: 'University/TVET',
    jobDemand: 'Medium',
    studyYears: '2–3 years',
    apsRequired: null,
    subjects: ['Business Studies', 'English', 'Economics'],
    whyItFits: 'For energetic, creative organisers who thrive under pressure and love bringing people together.',
  },
  {
    id: 'sports-scientist',
    title: 'Sports Scientist / Biokineticist',
    category: 'Health & Sport',
    riasecTypes: ['R', 'I', 'S'],
    description: 'Assess and improve athletic performance and help patients recover from injuries using exercise science.',
    salaryRange: 'R240k – R700k',
    salaryMin: 240000,
    educationPath: 'University',
    jobDemand: 'Medium',
    studyYears: '4 years',
    apsRequired: 28,
    subjects: ['Life Sciences', 'Physical Sciences', 'Mathematics'],
    whyItFits: 'Ideal for sporty, scientific thinkers who want to combine a passion for fitness with a professional career.',
  },
  {
    id: 'financial-planner',
    title: 'Financial Planner / Wealth Advisor',
    category: 'Finance',
    riasecTypes: ['E', 'C', 'S'],
    description: 'Help individuals and families plan their finances, investments, insurance, and retirement.',
    salaryRange: 'R200k – R1.5m',
    salaryMin: 200000,
    educationPath: 'University/TVET',
    jobDemand: 'High',
    studyYears: '3 years + certification',
    apsRequired: 26,
    subjects: ['Mathematics', 'Accounting', 'Business Studies', 'Economics'],
    whyItFits: 'Rewarding blend of helping people and working with numbers — strong income potential.',
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    category: 'Creative',
    riasecTypes: ['A', 'I', 'E'],
    description: 'Create visual content — logos, branding, posters, social media graphics, and digital layouts.',
    salaryRange: 'R180k – R600k',
    salaryMin: 180000,
    educationPath: 'University/TVET',
    jobDemand: 'Medium',
    studyYears: '2–3 years',
    apsRequired: 24,
    subjects: ['Visual Art', 'Design', 'Information Technology'],
    whyItFits: 'Creative career with wide application across every industry — and strong freelance potential.',
  },
];

// ── Subject Recommendation Map ────────────────────────────────────────────────

const SUBJECT_MAP: Record<string, SubjectRecommendation[]> = {
  R: [
    { subject: 'Mathematics', importance: 'Essential', reason: 'Required for most engineering, trade, and technical qualifications.' },
    { subject: 'Physical Sciences', importance: 'Essential', reason: 'Provides the theoretical foundation for practical technical work.' },
    { subject: 'Engineering Graphics & Design (EGD)', importance: 'Recommended', reason: 'Develops spatial thinking and design skills used in trades and engineering.' },
    { subject: 'Technical / Vocational subjects', importance: 'Recommended', reason: 'Direct preparation for TVET qualifications and apprenticeships.' },
    { subject: 'Life Sciences', importance: 'Useful', reason: 'Relevant for agricultural, environmental, and health-related technical roles.' },
  ],
  I: [
    { subject: 'Mathematics', importance: 'Essential', reason: 'Core requirement for science, engineering, medicine, and data careers.' },
    { subject: 'Physical Sciences', importance: 'Essential', reason: 'Foundation for understanding chemistry, physics, and how the world works.' },
    { subject: 'Life Sciences', importance: 'Essential', reason: 'Essential for medicine, biology, environmental science, and psychology.' },
    { subject: 'Information Technology', importance: 'Recommended', reason: 'Increasingly important for data, AI, and research-based careers.' },
    { subject: 'Geography', importance: 'Useful', reason: 'Useful for environmental science, geology, and spatial data analysis.' },
  ],
  A: [
    { subject: 'Visual Art', importance: 'Essential', reason: 'Core skill for design, architecture, fine art, and creative careers.' },
    { subject: 'English (Home or First Additional Language)', importance: 'Essential', reason: 'Strong writing and communication underpin most creative fields.' },
    { subject: 'Dramatic Art', importance: 'Recommended', reason: 'Builds performance, communication, and storytelling ability.' },
    { subject: 'Music', importance: 'Recommended', reason: 'Opens paths in performance, production, and music education.' },
    { subject: 'Design', importance: 'Recommended', reason: 'Directly applicable to graphic design, fashion, and UX/UI work.' },
    { subject: 'History', importance: 'Useful', reason: 'Broadens cultural context valuable in media, writing, and creative industries.' },
  ],
  S: [
    { subject: 'Life Orientation', importance: 'Essential', reason: 'Builds self-awareness, communication, and understanding of social issues.' },
    { subject: 'English', importance: 'Essential', reason: 'Communication skills are critical in all people-facing careers.' },
    { subject: 'Life Sciences', importance: 'Recommended', reason: 'Supports understanding of human biology for health and care careers.' },
    { subject: 'History', importance: 'Recommended', reason: 'Provides social, political, and cultural context for community-facing work.' },
    { subject: 'Sociology / Consumer Studies', importance: 'Useful', reason: 'Enhances understanding of human behaviour and social systems.' },
  ],
  E: [
    { subject: 'Business Studies', importance: 'Essential', reason: 'Direct preparation for entrepreneurship, management, and business careers.' },
    { subject: 'Economics', importance: 'Essential', reason: 'Provides understanding of markets, money, and how businesses operate.' },
    { subject: 'Mathematics', importance: 'Recommended', reason: 'Strengthens financial thinking and opens doors to accounting and finance degrees.' },
    { subject: 'Accounting', importance: 'Recommended', reason: 'Builds financial literacy essential for running a business or managing money.' },
    { subject: 'English', importance: 'Useful', reason: 'Negotiation, pitching, and leadership all require strong communication.' },
  ],
  C: [
    { subject: 'Accounting', importance: 'Essential', reason: 'Foundation for all finance, bookkeeping, and administration careers.' },
    { subject: 'Mathematics', importance: 'Essential', reason: 'Required for accuracy and logical thinking in numbers-based roles.' },
    { subject: 'Information Technology', importance: 'Recommended', reason: 'Spreadsheets, databases, and software systems are central to conventional careers.' },
    { subject: 'Business Studies', importance: 'Recommended', reason: 'Provides context for how organisations and systems are structured.' },
    { subject: 'Economics', importance: 'Useful', reason: 'Useful for understanding the broader financial environment.' },
  ],
};

// ── Profile Descriptions ──────────────────────────────────────────────────────

const CODE_NAMES: Record<string, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
};

const PROFILE_BLURBS: Record<string, string> = {
  R: 'hands-on, practical, and technically skilled',
  I: 'analytical, curious, and scientifically minded',
  A: 'creative, expressive, and original',
  S: 'caring, communicative, and people-focused',
  E: 'ambitious, persuasive, and leadership-driven',
  C: 'organised, detail-oriented, and systematic',
};

const PROFILE_CAREER_HINTS: Record<string, string> = {
  R: 'You are well suited to engineering, trade, construction, and technical fields.',
  I: 'You thrive in science, research, medicine, technology, and data-driven careers.',
  A: 'You belong in creative industries — design, media, performing arts, and digital content.',
  S: 'You will do best in education, healthcare, counselling, and community service.',
  E: 'You are built for business, law, entrepreneurship, and leadership roles.',
  C: 'You excel in finance, accounting, administration, and structured analytical work.',
};

function generateProfileDescription(topCodes: string[]): string {
  const [code1, code2] = topCodes;
  const name1 = CODE_NAMES[code1] ?? code1;
  const name2 = CODE_NAMES[code2] ?? code2;
  const blurb1 = PROFILE_BLURBS[code1] ?? '';
  const blurb2 = PROFILE_BLURBS[code2] ?? '';
  const hint = PROFILE_CAREER_HINTS[code1] ?? '';
  return (
    `You are primarily ${name1} — ${blurb1} — with a strong ${name2} streak, meaning you are also ${blurb2}. ` +
    hint
  );
}

// ── Core Scoring Function ─────────────────────────────────────────────────────

export function computeQuizResults(
  answers: { questionId: string; value: number }[]
): QuizResults {
  // 1. Sum raw scores per code and count questions per code
  const rawScores: RIASECScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const questionCount: RIASECScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  // Count total questions per code from the question bank (not just answered ones)
  quizQuestions.forEach((q) => { questionCount[q.riasecCode] += 1; });

  answers.forEach(({ questionId, value }) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    if (question) {
      rawScores[question.riasecCode] += value;
    }
  });

  // 2. Normalise to percentages using per-code max (questions × 5)
  // This handles unequal question counts per type gracefully.
  const pct = (code: keyof RIASECScores) => {
    const max = (questionCount[code] || 1) * 5;
    return Math.round((rawScores[code] / max) * 100);
  };
  const percentages: RIASECScores = {
    R: pct('R'), I: pct('I'), A: pct('A'),
    S: pct('S'), E: pct('E'), C: pct('C'),
  };

  // 3. Identify top 3 codes
  const sorted = (Object.entries(percentages) as [keyof RIASECScores, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const topCodes = sorted.slice(0, 3).map(([code]) => code as string);

  // 4. Score each career
  const scoredCareers: CareerMatch[] = CAREER_DATABASE.map((career) => {
    // Average the percentage scores for each RIASEC type the career has
    const typeScores = career.riasecTypes.map(
      (type) => percentages[type as keyof RIASECScores] ?? 0
    );
    const baseScore = typeScores.reduce((a, b) => a + b, 0) / typeScores.length;

    // 20% bonus when the user's top code matches the career's primary RIASEC type
    const primaryBonus = career.riasecTypes[0] === topCodes[0] ? 1.2 : 1.0;

    const compatibilityScore = Math.min(100, Math.round(baseScore * primaryBonus));

    return { ...career, compatibilityScore };
  });

  // 5. Sort and take top 20
  scoredCareers.sort((a, b) => (b.compatibilityScore ?? 0) - (a.compatibilityScore ?? 0));
  const topCareerMatches = scoredCareers.slice(0, 20);

  // 6. Subject recommendations — deduplicate by subject name, prioritising highest importance
  const importanceOrder: Record<string, number> = { Essential: 3, Recommended: 2, Useful: 1 };
  const subjectMap = new Map<string, SubjectRecommendation>();

  topCodes.forEach((code) => {
    const recs = SUBJECT_MAP[code] ?? [];
    recs.forEach((rec) => {
      const existing = subjectMap.get(rec.subject);
      if (
        !existing ||
        importanceOrder[rec.importance] > importanceOrder[existing.importance]
      ) {
        subjectMap.set(rec.subject, rec);
      }
    });
  });

  // Sort by importance then alphabetically, take top 7
  const subjectRecommendations = Array.from(subjectMap.values())
    .sort(
      (a, b) =>
        importanceOrder[b.importance] - importanceOrder[a.importance] ||
        a.subject.localeCompare(b.subject)
    )
    .slice(0, 7);

  // 7. Profile description
  const profileDescription = generateProfileDescription(topCodes);

  return {
    rawScores,
    percentages,
    topCodes,
    topCareerMatches,
    subjectRecommendations,
    profileDescription,
  };
}
